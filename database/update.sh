#! /bin/sh

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <version>"
    exit 1
fi

VERSION="$1"

DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="ts-react-express"
DB_USER="postgres"
DB_PASSWORD="postgres"

export PGPASSWORD="$DB_PASSWORD"

echo "psql -f \"${VERSION}.sql\""
psql -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" -U "$DB_USER" -f "${VERSION}.sql" -q