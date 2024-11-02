# Database credentials
$DB_HOST = "localhost"
$DB_PORT = "5432"
$DB_NAME = "aici"
$DB_USER = "postgres"
$DB_PASSWORD = "Welcome123"

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

# List of SQL files to execute
$SQL_FILES = @(
    "tables/groups.sql"
    "tables/memberships.sql"
    "tables/passwords.sql"
    "tables/permissions.sql"
    "tables/securables.sql"
    "tables/users.sql"
    "tables/menus.sql"
    "tables/settings.sql"
    "tables/lists.sql"
    "tables/list_filters.sql"
    "tables/datasets.sql"
    "tables/logs.sql"
    "tables/prompts.sql"
    "tables/finetunes.sql"
    "foreignkeys/memberships.sql"
    "foreignkeys/passwords.sql"
    "foreignkeys/permissions.sql"
    "foreignkeys/menus.sql"
    "foreignkeys/list_filters.sql"
    "data/securables.sql"
    "data/menus.sql"
    "data/administrator.sql"
    "data/anonymous.sql"
    "data/lists.sql"
    "data/settings.sql"
    "data/datasets.sql"
    "data/prompts.sql"
)

# Loop through each SQL file and execute
foreach ($SQL_FILE in $SQL_FILES) {
    Write-Output "psql -f `"$SQL_FILE`""
    psql -h $DB_HOST -p $DB_PORT -d $DB_NAME -U $DB_USER -f $SQL_FILE -q
    if ($LASTEXITCODE -ne 0) {
        Write-Output "Failed to execute SQL script: $SQL_FILE"
        exit 1
    }
}
