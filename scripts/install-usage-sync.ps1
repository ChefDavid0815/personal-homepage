# Installs this site's read-only collector for the current Windows user.
$ErrorActionPreference = 'Stop'
$workerPath = (Resolve-Path (Join-Path $PSScriptRoot 'usage-sync.py')).Path
$pythonPath = (& python -c 'import sys; print(sys.executable)').Trim()
$pythonWindowless = Join-Path (Split-Path $pythonPath) 'pythonw.exe'
if (-not (Test-Path -LiteralPath $pythonWindowless)) { throw 'pythonw.exe is required for a silent collector.' }
$stateDirectory = Join-Path $env:LOCALAPPDATA 'ChefZC\UsageSync'
if (-not (Test-Path -LiteralPath (Join-Path $stateDirectory 'config.json'))) { throw 'Create the private sync configuration first; see docs/usage-observatory.md.' }
$arguments = '"' + $workerPath + '" --watch --publish'
$action = New-ScheduledTaskAction -Execute $pythonWindowless -Argument $arguments -WorkingDirectory (Split-Path $PSScriptRoot)
$trigger = New-ScheduledTaskTrigger -AtLogOn -User ([System.Security.Principal.WindowsIdentity]::GetCurrent().Name)
$settings = New-ScheduledTaskSettingsSet -Hidden -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit ([TimeSpan]::Zero) -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1) -MultipleInstances IgnoreNew
try {
  Register-ScheduledTask -TaskName 'ChefZC Codex Usage Sync' -Action $action -Trigger $trigger -Settings $settings -Description 'Read-only Codex token aggregates for the ChefZC Pulse page. No conversations are uploaded.' -Force | Out-Null
  Start-ScheduledTask -TaskName 'ChefZC Codex Usage Sync'
  Write-Output 'Collector installed and started through the current-user scheduled task.'
} catch {
  # A current-user startup entry works when Task Scheduler permissions are restricted.
  $startupKey = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run'
  New-ItemProperty -Path $startupKey -Name 'ChefZC Usage Sync' -Value ('"' + $pythonWindowless + '" ' + $arguments) -PropertyType String -Force | Out-Null
  Start-Process -FilePath $pythonWindowless -ArgumentList $arguments -WindowStyle Hidden -WorkingDirectory (Split-Path $PSScriptRoot)
  Write-Output 'Collector installed and started through the current-user startup entry.'
}
