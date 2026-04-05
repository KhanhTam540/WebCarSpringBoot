param(
    [Parameter(Mandatory = $true, ValueFromRemainingArguments = $true)]
    [string[]]$Command
)

$env:JAVA_HOME = 'C:\Program Files\Zulu\zulu-21'
$env:Path = "$env:JAVA_HOME\bin;$env:Path"

$commandText = ($Command -join ' ').Trim()
if ([string]::IsNullOrWhiteSpace($commandText)) {
    throw 'Bạn phải truyền lệnh cần chạy, ví dụ: .\run-java21.ps1 .\mvnw.cmd -version'
}

if ($commandText -match '^\./mvnw(\s|$)') {
    $commandText = $commandText -replace '^\./mvnw', '.\\mvnw.cmd'
}

Write-Output "JAVA_HOME=$env:JAVA_HOME"
& java -version
Write-Output "Running: $commandText"
cmd /c $commandText
exit $LASTEXITCODE
