#!/bin/sh
# Build the site and its search index into public/.
# Preview: python3 -m http.server -d public 8080
set -e
cd "$(dirname "$0")/.."
hugo --minify
pagefind --site public
