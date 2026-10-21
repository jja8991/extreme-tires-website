<#
.SYNOPSIS
  Runs the Extreme Tires website prototype on a local server at http://localhost:8080

.DESCRIPTION
  Put this script in the same folder as index.html, then right-click > Run with PowerShell.
  No installs needed: uses Windows' built-in .NET web listener.
  Logs every request to logs\site-YYYY-MM-DD.txt. Press Ctrl+C to stop.

.PARAMETER Port
  Port to serve on (default 8080). Pick another if 8080 is busy.

.PARAMETER WhatIf
  Shows what it would serve and where, without starting the server.

.EXAMPLE
  .\Start-ExtremeSite.ps1
  .\Start-ExtremeSite.ps1 -Port 3000
  .\Start-ExtremeSite.ps1 -WhatIf
#>
[CmdletBinding(SupportsShouldProcess = $true)]
param([int]$Port = 8080)

$ErrorActionPreference = 'Stop'
$Root   = $PSScriptRoot
$LogDir = Join-Path $Root 'logs'
$Log    = Join-Path $LogDir ("site-{0:yyyy-MM-dd}.txt" -f (Get-Date))

function Write-Log([string]$Msg, [string]$Level = 'INFO') {
    $line = "{0:yyyy-MM-dd HH:mm:ss} [{1}] {2}" -f (Get-Date), $Level, $Msg
    $color = switch ($Level) { 'ERROR' { 'Red' } 'WARN' { 'Yellow' } default { 'Gray' } }
    Write-Host $line -ForegroundColor $color
    try { Add-Content -Path $Log -Value $line } catch { }   # logging must never stop the server
}

# --- Checks -----------------------------------------------------------------
if (-not (Test-Path (Join-Path $Root 'index.html'))) {
    Write-Host "index.html not found in $Root. Put this script next to index.html." -ForegroundColor Red
    Read-Host 'Press Enter to close'; exit 1
}
New-Item -ItemType Directory -Path $LogDir -Force | Out-Null

$url = "http://localhost:$Port/"
if (-not $PSCmdlet.ShouldProcess($url, "Serve files from $Root")) { exit 0 }

# Duplicate detection: if something already answers on this port, don't start a second server.
try {
    $probe = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2
    Write-Log "Port $Port is already serving (HTTP $($probe.StatusCode)). Opening it instead of starting a second server." 'WARN'
    Start-Process $url; exit 0
} catch { }  # nothing running, good

$mime = @{
    '.html'='text/html; charset=utf-8'; '.css'='text/css'; '.js'='application/javascript'; '.json'='application/json'
    '.png'='image/png'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'; '.svg'='image/svg+xml'; '.webp'='image/webp'
    '.mp4'='video/mp4'; '.ico'='image/x-icon'; '.txt'='text/plain'
}

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add($url)
try { $listener.Start() }
catch {
    Write-Log "Could not start on port ${Port}: $($_.Exception.Message). Try: .\Start-ExtremeSite.ps1 -Port 3000" 'ERROR'
    Read-Host 'Press Enter to close'; exit 1
}

Write-Host ""
Write-Host "  Extreme Tires site is live at $url" -ForegroundColor Green
Write-Host "  Pages: $url#home  |  $url#tires  |  $url#mobile  |  $url#quote"
Write-Host "  Phone on same Wi-Fi: run as Administrator with your PC's IP (see README note)."
Write-Host "  Press Ctrl+C to stop."
Write-Host ""
Write-Log "Server started at $url serving $Root"
Start-Process $url

try {
    while ($listener.IsListening) {
        $ctx = $listener.GetContext()
        $req = $ctx.Request; $res = $ctx.Response
        try {
            $rel = [Uri]::UnescapeDataString($req.Url.AbsolutePath.TrimStart('/'))
            if ([string]::IsNullOrWhiteSpace($rel)) { $rel = 'index.html' }
            $full = [IO.Path]::GetFullPath((Join-Path $Root $rel))
            # Block "../" tricks: only serve files inside this folder.
            if (-not $full.StartsWith($Root, [StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path $full -PathType Leaf)) {
                $res.StatusCode = 404
                $bytes = [Text.Encoding]::UTF8.GetBytes('Not found')
            } else {
                $ext = [IO.Path]::GetExtension($full).ToLower()
                $res.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
                $res.Headers.Add('Cache-Control', 'no-store')   # always show the newest version while editing
                $bytes = [IO.File]::ReadAllBytes($full)
            }
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
            Write-Log ("{0} {1} -> {2}" -f $req.HttpMethod, $req.Url.AbsolutePath, $res.StatusCode)
        } catch {
            Write-Log "Request failed: $($_.Exception.Message)" 'ERROR'
            try { $res.StatusCode = 500 } catch { }
        } finally {
            $res.OutputStream.Close()
        }
    }
} finally {
    $listener.Stop(); $listener.Close()
    Write-Log 'Server stopped.'
}
