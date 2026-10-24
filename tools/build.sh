#!/bin/sh
# Build site and search index into public/.
# Preview: python3 -m http.server -d public 8080
set -e
cd "$(dirname "$0")/.."
hugo --minify
pagefind --site public
