param([switch]$RegisterStartup,[switch]$StartNow)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Security
$projectRoot = Split-Path -Parent $PSScriptRoot
$syncDir = Join-Path $env:LOCALAPPDATA 'ChefZC\SteamSync'
$runtimeDir = Join-Path $syncDir 'runtime'
$configPath = Join-Path $syncDir 'config.json'
New-Item -ItemType Directory -Force -Path $syncDir,$runtimeDir,(Join-Path $runtimeDir 'scripts'),(Join-Path $runtimeDir 'lib'),(Join-Path $runtimeDir 'dist') | Out-Null
if (Test-Path -LiteralPath $configPath) {
 $config = Get-Content -LiteralPath $configPath -Raw | ConvertFrom-Json
 $syncKey = [Text.Encoding]::UTF8.GetString([Security.Cryptography.ProtectedData]::Unprotect([Convert]::FromBase64String($config.protectedKey),$null,[Security.Cryptography.DataProtectionScope]::CurrentUser))
} else {
 $bytes = New-Object byte[] 32
 $rng = [Security.Cryptography.RandomNumberGenerator]::Create()
 $rng.GetBytes($bytes); $rng.Dispose()
 $syncKey = [Convert]::ToBase64String($bytes).TrimEnd('=').Replace('+','-').Replace('/','_')
 $protected = [Security.Cryptography.ProtectedData]::Protect([Text.Encoding]::UTF8.GetBytes($syncKey),$null,[Security.Cryptography.DataProtectionScope]::CurrentUser)
 $config = @{source='E:\Steam\userdata\796657407\config\localconfig.vdf';endpoint='https://chefzc.dev/api/ac8-record';protectedKey=[Convert]::ToBase64String($protected)}
 $config | ConvertTo-Json | Set-Content -LiteralPath $configPath -Encoding UTF8
}
# Secrets travel over stdin to the already authenticated, linked Vercel CLI.
$previousErrorMode = $ErrorActionPreference
$ErrorActionPreference = 'Continue'
try { $envResult = & vercel.cmd env ls production --scope zzichuan0808-3165s-projects --non-interactive 2>&1 | Out-String; $envExit = $LASTEXITCODE } finally { $ErrorActionPreference=$previousErrorMode }
if ($envExit -ne 0) { throw 'Could not inspect the linked production environment.' }
if ($envResult -notmatch '\bAC8_SYNC_SECRET\b') {
 $ErrorActionPreference = 'Continue'
 try { $addResult = $syncKey | & vercel.cmd env add AC8_SYNC_SECRET production --sensitive --scope zzichuan0808-3165s-projects --non-interactive 2>&1 | Out-String; $addExit=$LASTEXITCODE } finally { $ErrorActionPreference=$previousErrorMode }
 if ($addExit -ne 0) { throw 'Could not add the scoped AC8 sync key.' }
}
$nodeBinary = (Get-Command node.exe).Source
Copy-Item -LiteralPath $nodeBinary -Destination (Join-Path $runtimeDir 'node.exe') -Force
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'ac8-sync.mjs') -Destination (Join-Path $runtimeDir 'scripts\ac8-sync.mjs') -Force
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'ac8-unprotect.ps1') -Destination (Join-Path $runtimeDir 'scripts\ac8-unprotect.ps1') -Force
Copy-Item -LiteralPath (Join-Path $projectRoot 'lib\ac8-record-schema.js') -Destination (Join-Path $runtimeDir 'lib\ac8-record-schema.js') -Force
Copy-Item -LiteralPath (Join-Path $projectRoot 'dist\ac8-record-state.js') -Destination (Join-Path $runtimeDir 'dist\ac8-record-state.js') -Force
'{"type":"module"}' | Set-Content -LiteralPath (Join-Path $runtimeDir 'package.json') -Encoding UTF8
$launchPath = Join-Path $syncDir 'launch.ps1'
@'
$ErrorActionPreference='Stop'
$mutex = New-Object Threading.Mutex($false,'Local\ChefZC_AC8_Record_Sync')
$owned = $false
try {
 try { $owned=$mutex.WaitOne(0) } catch [Threading.AbandonedMutexException] { $owned=$true }
 if (-not $owned) { exit 0 }
 $syncDir = Split-Path -Parent $PSCommandPath
 $runtimeDir = Join-Path $syncDir 'runtime'
 $ErrorActionPreference='Continue'
 & (Join-Path $runtimeDir 'node.exe') (Join-Path $runtimeDir 'scripts\ac8-sync.mjs') --watch >> (Join-Path $syncDir 'bridge.log') 2>&1
} finally { if ($owned) { $mutex.ReleaseMutex() }; $mutex.Dispose() }
'@ | Set-Content -LiteralPath $launchPath -Encoding UTF8
if ($RegisterStartup) {
 $userId = [Security.Principal.WindowsIdentity]::GetCurrent().Name
 $powershellPath = Join-Path $env:WINDIR 'System32\WindowsPowerShell\v1.0\powershell.exe'
 $action = New-ScheduledTaskAction -Execute $powershellPath -Argument "-NoProfile -NonInteractive -WindowStyle Hidden -File `"$launchPath`""
 $trigger = New-ScheduledTaskTrigger -AtLogOn -User $userId
 $principal = New-ScheduledTaskPrincipal -UserId $userId -LogonType Interactive -RunLevel Limited
 $settings = New-ScheduledTaskSettingsSet -MultipleInstances IgnoreNew -ExecutionTimeLimit ([TimeSpan]::Zero) -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
 Register-ScheduledTask -TaskName 'ChefZC-AC8-Steam-Sync' -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Description 'Sync only AC8 allowlisted Steam aggregates to chefzc.dev; current-user DPAPI credential; no Steam credentials or other games.' -Force | Out-Null
 if ($StartNow) { Start-ScheduledTask -TaskName 'ChefZC-AC8-Steam-Sync' }
}
$syncKey=$null
Write-Output 'AC8-only bridge installed. Credential protected for the current Windows user.'
