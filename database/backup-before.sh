#! /bin/sh

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <version>"
    exit 1
fi

VERSION="$1"

DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="aici"
DB_USER="postgres"
DB_PASSWORD="postgres"

export PGPASSWORD="$DB_PASSWORD"

BACKUP_FILE="${VERSION}-before.sql"

pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" > "$BACKUP_FILE"
echo "Backup created: $BACKUP_FILE"