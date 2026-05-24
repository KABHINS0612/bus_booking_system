$excludes = '\\target\\','\\node_modules\\','\\.git\\'
$patterns = '*.java','*.xml','*.properties','*.json','*.js','*.ps1','*.bat','*.md'
Get-ChildItem -Recurse -File -Include $patterns | Where-Object {
    $p=$_.FullName; -not ($excludes | ForEach-Object { $p -match $_ })
} | ForEach-Object {
    $path=$_.FullName
    try {
        $text = Get-Content -Raw -LiteralPath $path -ErrorAction Stop
    } catch {
        Write-Output "SKIP: $path (read error)"
        return
    }
    $orig = $text
    $text = $text -replace 'Trip Management','Busbooking System'
    $text = $text -replace 'TripManagement','BusbookingSystem'
    $text = $text -replace 'trip-management','busbooking-system'
    $text = $text -replace 'trip_management','busbooking_system'
    $text = $text -replace 'trip management','busbooking system'
    $text = $text -replace 'tripmanagement','busbookingsystem'
    $text = $text -replace 'com.tripmanagement','com.busbookingsystem'
    $text = $text -replace 'trip-management-system','busbooking-system'
    $text = $text -replace 'trip-management-backend','busbooking-backend'
    $text = $text -replace 'trip-management-frontend','busbooking-frontend'
    $text = $text -replace 'trip_management_data','busbooking_system_data'
    $text = $text -replace 'TripManagementApplication','BusbookingSystemApplication'
    $text = $text -replace 'Trip Management','Busbooking System'
    if($text -ne $orig){
        Set-Content -LiteralPath $path -Value $text -Encoding UTF8
        Write-Output "UPDATED: $path"
    }
}
Write-Output "Replacement script finished."