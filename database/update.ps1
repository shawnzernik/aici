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

# Run the SQL script
Write-Output "psql -f `"$VERSION.sql`""
& psql -h $DB_HOST -p $DB_PORT -d $DB_NAME -U $DB_USER -f "$VERSION.sql" -q
