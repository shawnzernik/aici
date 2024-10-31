#! /bin/sh

rm -R ./data
mkdir data

podman run \
    --name postgres \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_DB=postgres \
    -p 5432:5432 \
    -v $(pwd)/data:/var/lib/postgresql/data -d postgres