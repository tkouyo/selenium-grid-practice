$ErrorActionPreference = 'Stop'

$browserRoot = Join-Path $env:LOCALAPPDATA 'SeleniumPractice'
$chromeCandidates = @(
    (Join-Path $env:ProgramFiles 'Google\Chrome\Application\chrome.exe'),
    (Join-Path ${env:ProgramFiles(x86)} 'Google\Chrome\Application\chrome.exe'),
    (Join-Path $env:LOCALAPPDATA 'Google\Chrome\Application\chrome.exe')
)
$chromeBinary = $chromeCandidates | Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1

if (-not (Test-Path $chromeBinary)) {
    $channelInfo = Invoke-RestMethod 'https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions-with-downloads.json'
    $chromeVersion = $channelInfo.channels.Stable.version
    $chromeDownload = $channelInfo.channels.Stable.downloads.chrome | Where-Object platform -eq 'win64'
    $chromeDirectory = Join-Path $browserRoot "ChromeForTesting\$chromeVersion"
    $chromeBinary = Join-Path $chromeDirectory 'chrome-win64\chrome.exe'

    New-Item -ItemType Directory -Force -Path $chromeDirectory | Out-Null
    if (-not (Test-Path $chromeBinary)) {
        $archivePath = Join-Path $env:TEMP "chrome-for-testing-$chromeVersion.zip"
        Invoke-WebRequest -Uri $chromeDownload.url -OutFile $archivePath
        Expand-Archive -LiteralPath $archivePath -DestinationPath $chromeDirectory -Force
        Remove-Item -LiteralPath $archivePath
    }
}

$firefoxCandidates = @(
    (Join-Path $env:ProgramFiles 'Mozilla Firefox\firefox.exe'),
    (Join-Path $env:LOCALAPPDATA 'Programs\Mozilla Firefox\firefox.exe')
)
$firefoxBinary = $firefoxCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $firefoxBinary) {
    winget install --id Mozilla.Firefox --exact --scope user --source winget --silent --accept-source-agreements --accept-package-agreements
    $firefoxBinary = $firefoxCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
}

if (-not $firefoxBinary) {
    throw 'Firefox installation was not found in the expected locations.'
}

Write-Output "Chrome: $chromeBinary"
Write-Output "Firefox: $firefoxBinary"