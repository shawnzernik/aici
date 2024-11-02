#! /bin/bash

DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="aici"
DB_USER="postgres"
DB_PASSWORD="postgres"

export PGPASSWORD="$DB_PASSWORD"

echo "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_NAME' AND pid <> pg_backend_pid()"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_NAME' AND pid <> pg_backend_pid();" -q

echo "DROP DATABASE IF EXISTS \"$DB_NAME\""
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c "DROP DATABASE IF EXISTS \"$DB_NAME\";" -q

echo "CREATE DATABASE \"$DB_NAME\""
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c "CREATE DATABASE \"$DB_NAME\";" -q

SQL_FILES=(
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

for SQL_FILE in "${SQL_FILES[@]}"; do
    echo "psql -f \"$SQL_FILE\""
    psql -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" -U "$DB_USER" -f "$SQL_FILE" -q
    if [ $? -ne 0 ]; then
        echo "Failed to execute SQL script: $SQL_FILE"
        exit 1
    fi
done
