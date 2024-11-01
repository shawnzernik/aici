# Check for required argument
if ($args.Count -ne 1) {
    Write-Output "Usage: .\script.ps1 <version>"
    exit 1
}

$VERSION = $args[0]

# Database credentials
$DB_HOST = "localhost"
$DB_PORT = "5432"
$DB_NAME = "ts-react-express"
$DB_USER = "postgres"
$DB_PASSWORD = "postgres"

# Set the environment variable for PostgreSQL password
$env:PGPASSWORD = $DB_PASSWORD

# Define backup file name
$BACKUP_FILE = "$VERSION-after.sql"

# Execute pg_dump
& pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f $BACKUP_FILE
Write-Output "Backup created: $BACKUP_FILE"
