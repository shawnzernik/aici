#! /bin/sh

podman run \
    --name qdrant \
    -p 6333:6333 \
    qdrant/qdrant
