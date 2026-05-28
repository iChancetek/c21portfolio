$content = Get-Content src\app\page.tsx -Raw
$content = $content -replace '\\n', ''
Set-Content src\app\page.tsx $content
