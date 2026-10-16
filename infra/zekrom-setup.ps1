# Run on zekrom (elevated). Installs Caddy as the tailnet-only audio origin.
# Windows PowerShell 5.1, ASCII only.
$ErrorActionPreference = 'Stop'
$ver  = '2.11.7'
$dir  = 'E:\bethel-web'
$zip  = "caddy_${ver}_windows_amd64.zip"
$base = "https://github.com/caddyserver/caddy/releases/download/v$ver"
New-Item -ItemType Directory -Force -Path $dir | Out-Null
Invoke-WebRequest "$base/$zip" -OutFile "$dir\$zip" -UseBasicParsing
Invoke-WebRequest "$base/caddy_${ver}_checksums.txt" -OutFile "$dir\checksums.txt" -UseBasicParsing
$want = (Select-String -Path "$dir\checksums.txt" -Pattern ([regex]::Escape($zip))).Line.Split(' ')[0].ToLower()
$have = (Get-FileHash "$dir\$zip" -Algorithm SHA512).Hash.ToLower()
if ($want -ne $have) { throw "checksum mismatch: want $want have $have" }
Expand-Archive -Force "$dir\$zip" -DestinationPath $dir
Remove-Item "$dir\$zip"
Copy-Item "$dir\Caddyfile" "$dir\Caddyfile.bak" -ErrorAction SilentlyContinue
'checksum ok, caddy at ' + $dir
