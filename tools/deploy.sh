#!/bin/sh
# Build for production. Copy to the web server.
# Settings are outside the repo, in ~/.config/bethel-deploy (or $BETHEL_DEPLOY_CONF):
#   TARGET=user@host:/path/    rsync destination
#   SITE=https://example.org   public address
#   TOKEN=secret               optional; makes the public cache refetch changed pages
set -eu
cd "$(dirname "$0")/.."
. "${BETHEL_DEPLOY_CONF:-$HOME/.config/bethel-deploy}"

hugo --minify --environment production --cleanDestinationDir
pagefind --site public

# Files rsync sends, one per line.
changed=$(rsync -a --delete --out-format='%i %n' public/ "$TARGET" | sed -n 's/^[<>]f[^ ]* //p')
echo "$changed" | grep -c . | sed 's/$/ files changed/' || true

# CSS and JS names change with content. Only pages and search files can be stale.
[ -n "${TOKEN:-}" ] || { echo "no TOKEN: the public cache may serve old pages for 10 minutes"; exit 0; }
echo "$changed" | grep -v '^pagefind/\(fragment\|index\)/' | while read -r f; do
	case $f in */index.html | index.html) u=${f%index.html} ;; *) u=$f ;; esac
	curl -fsS -o /dev/null -H "X-Refresh: $TOKEN" "$SITE/$u" || echo "refresh failed: /$u"
done
echo "deployed: $SITE/"
