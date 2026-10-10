# AC8 flight log

The public API `/api/ac8-record` serves only AppID 2288340 totals, recent minutes,
last-played time, source-update time and inspection/sync times. A dedicated owner
key protects writes. Other games, Steam credentials, local paths and save content
cannot pass the server's rebuilt allowlist.

The local bridge reads `localconfig.vdf` without modifying it, checks the source
hash before and after reading, and inspects every 30 seconds. Changed AC8 records
are sent immediately; unchanged records receive a five-minute heartbeat. Steam
usually writes playtime after a session closes, so the website never adds time
between actual Steam updates. Visitors refresh once per minute while the flight
log is visible. Failed reads retain the last good values and show their age.

The current Windows user approved login startup. The task is
`ChefZC-AC8-Steam-Sync`, with Limited privileges and one mutex-guarded instance.
Its stable Node runtime, logs, snapshot and current-user DPAPI-protected owner
credential live in `%LOCALAPPDATA%\ChefZC\SteamSync`. None is uploaded with the
website. No Steam password or login session is used by the bridge.

```powershell
Start-ScheduledTask -TaskName ChefZC-AC8-Steam-Sync
Stop-ScheduledTask -TaskName ChefZC-AC8-Steam-Sync
Get-ScheduledTask -TaskName ChefZC-AC8-Steam-Sync
```

To install/update the bridge from this checkout:

```powershell
powershell.exe -NoProfile -File scripts/setup-ac8-sync.ps1 -RegisterStartup
```

No execution-policy change is required. Credentials go to the linked Vercel
project over stdin and are never placed in browser bundles or process arguments.

The exhibit's map, missile trails and counters are artwork. Steam time is separate
from those illustrated effects and does not claim kills, victories or rankings.
