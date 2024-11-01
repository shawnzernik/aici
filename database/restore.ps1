# Check for required argument
if ($args.Count -ne 1) {
    Write-Output "Usage: .\restore.ps1 <BACKUP_FILE>"
    exit 1
}

$BACKUP_FILE = $args[0]

# Database credentials
$DB_HOST = "localhost"
$DB_PORT = "5432"
$DB_NAME = "ts-react-express"
$DB_USER = "postgres"
$DB_PASSWORD = "postgres"

# Set the environment variable for PostgreSQL password
$env:PGPASSWORD = $DB_PASSWORD

$env:PATH += ";C:\Program Files\PostgreSQL\17\bin"

# Terminate all connections to the database
$SQL = "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_NAME' AND pid <> pg_backend_pid();"
Set-Content -Path "temp.sql" -Value $SQL -Encoding Ascii
Write-Output $SQL
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -f temp.sql -q

# Drop the database if it exists
$SQL = "DROP DATABASE IF EXISTS `"$DB_NAME`";"
Set-Content -Path "temp.sql" -Value $SQL -Encoding Ascii
Write-Output $SQL
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -f temp.sql -q

# Create a new database
$SQL = "CREATE DATABASE `"$DB_NAME`";"
Set-Content -Path "temp.sql" -Value $SQL -Encoding Ascii
Write-Output $SQL
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -f temp.sql -q

# Restore the database from the backup file
Write-Output "Restoring database from backup file: $BACKUP_FILE"
Get-Content -Path $BACKUP_FILE | psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME

Write-Output "Database restoration complete."
