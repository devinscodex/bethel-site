#!/bin/sh
# Build the production site (with search index) and push it to quill.
# Needs the one-time server setup in infra/README.md.
set -e
cd "$(dirname "$0")/.."
hugo --minify --environment production
pagefind --site public
rsync -a --delete public/ raven@quill:/var/www/bethel/
echo "deployed: https://bethel.ravenscrest.xyz/"
