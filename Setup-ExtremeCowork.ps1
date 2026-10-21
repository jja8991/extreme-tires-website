<#
.SYNOPSIS
  One-shot setup of the Extreme Tires website workspace on this PC (for Claude Cowork).

.DESCRIPTION
  Clones https://github.com/jja8991/extreme-tires-website into Documents\Extreme-Tires-Cowork,
  or pulls the latest if it is already there (your local edits are never overwritten).
  Then opens the prototype in your browser. The repo is private: Git will open a GitHub
  sign-in window the first time.
  Log: <workspace>\logs\setup-YYYY-MM-DD.txt

.PARAMETER Dest
  Target folder (default: Documents\Extreme-Tires-Cowork)

.PARAMETER WhatIf
  Shows what would happen without changing anything.

.EXAMPLE
  .\Setup-ExtremeCowork.ps1
  .\Setup-ExtremeCowork.ps1 -WhatIf
#>
[CmdletBinding(SupportsShouldProcess = $true)]
param([string]$Dest = (Join-Path ([Environment]::GetFolderPath('MyDocuments')) 'Extreme-Tires-Cowork'))

$ErrorActionPreference = 'Stop'
$Repo   = 'https://github.com/jja8991/extreme-tires-website.git'
$Branch = 'main'
$LogDir = Join-Path $Dest 'logs'
$Log    = Join-Path $LogDir ("setup-{0:yyyy-MM-dd}.txt" -f (Get-Date))

function Write-Log([string]$Msg, [string]$Level = 'INFO') {
    $line = "{0:yyyy-MM-dd HH:mm:ss} [{1}] {2}" -f (Get-Date), $Level, $Msg
    $c = @{ ERROR = 'Red'; WARN = 'Yellow'; OK = 'Green' }[$Level]; if (-not $c) { $c = 'Gray' }
    Write-Host $line -ForegroundColor $c
    if (Test-Path $LogDir) { try { Add-Content $Log $line } catch { } }   # logging must never stop setup
}

try {
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        throw "Git is not installed. Install it with:  winget install --id Git.Git -e   then re-run this script."
    }
    Write-Log "Git found: $((git --version) -join ' ')"

    $exists = Test-Path (Join-Path $Dest '.git')
    $action = if ($exists) { "Update existing workspace at $Dest" } else { "Clone $Repo to $Dest" }
    if (-not $PSCmdlet.ShouldProcess($Dest, $action)) {
        Write-Host "WhatIf: would $action, then open site\index.html." -ForegroundColor Cyan
        return
    }

    if ($exists) {
        # Duplicate protection: never clobber local work. Fast-forward only.
        Write-Log "Workspace exists, pulling latest (fast-forward only)..."
        git -C $Dest pull --ff-only origin $Branch
        if ($LASTEXITCODE -ne 0) { throw "Could not fast-forward. You have local changes; commit or stash them, then re-run." }
    } else {
        if (Test-Path $Dest) {
            # Folder exists but is not a repo (e.g. from the earlier zip setup): back it up, don't delete it.
            $bk = "$Dest-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
            Move-Item $Dest $bk
            Write-Log "Existing non-git folder moved to $bk" 'WARN'
        }
        Write-Log "Cloning (a GitHub sign-in window may pop up the first time)..."
        git clone --branch $Branch $Repo $Dest
        if ($LASTEXITCODE -ne 0) { throw "git clone failed. Make sure you are signed in to GitHub as jja8991 (or an account with access)." }
    }

    New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
    foreach ($f in 'docs\00-START-HERE-Cowork-Brief.md', 'docs\01-Cowork-Starter-Prompt.md', 'site\index.html') {
        if (-not (Test-Path (Join-Path $Dest $f))) { throw "Missing $f. The download looks incomplete." }
    }
    $count = (Get-ChildItem $Dest -Recurse -File -Force | Where-Object { $_.FullName -notmatch '\\\.git\\|\\logs\\' }).Count
    Write-Log "Workspace ready: $count files in $Dest" 'OK'

    Start-Process (Join-Path $Dest 'site\index.html')
    Write-Log "Opened the prototype in your browser." 'OK'
    Write-Host ""
    Write-Host "  DONE. Workspace: $Dest" -ForegroundColor Green
    Write-Host "  Next: in Claude Cowork select this folder, then paste docs\01-Cowork-Starter-Prompt.md" -ForegroundColor Green
    Write-Host "  Local server (optional): site\Start-ExtremeSite.ps1 -> http://localhost:8080"
}
catch {
    Write-Log $_.Exception.Message 'ERROR'
    exit 1
}
