#! /bin/bash

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <BACKUP_FILE>"
    exit 1
fi

BACKUP_FILE="$1"

DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="ts-react-express"
DB_USER="postgres"
DB_PASSWORD="postgres"

export PGPASSWORD="$DB_PASSWORD"

echo "DROP DATABASE IF EXISTS \"$DB_NAME\""
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c "DROP DATABASE IF EXISTS \"$DB_NAME\";" -q

echo "Creating database if it doesn't exist..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c "CREATE DATABASE \"$DB_NAME\";" -q

echo "Restoring database from backup file: $BACKUP_FILE"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" < "$BACKUP_FILE"

echo "Database restoration complete."