param([Parameter(Mandatory=$true)][string]$ConfigPath)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Security
$config = Get-Content -LiteralPath $ConfigPath -Raw | ConvertFrom-Json
$bytes = [Convert]::FromBase64String($config.protectedKey)
[Text.Encoding]::UTF8.GetString([Security.Cryptography.ProtectedData]::Unprotect($bytes,$null,[Security.Cryptography.DataProtectionScope]::CurrentUser))
