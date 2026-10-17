#!/bin/sh
# Run on quill as root: sudo sh quill-isso-remove.sh
# Removes the Isso comment server and its nginx route. Keeps one last copy of the
# comments database in /root. Expects quill-bethel.conf (without /comments/) alongside.
set -e
D=$(cd "$(dirname "$0")" && pwd)
SITE=/etc/nginx/sites-available/bethel

if [ -f /opt/isso/db/comments.db ]; then
  cp /opt/isso/db/comments.db "/root/isso-final-$(date +%Y%m%d).db"
  echo "final copy saved in /root"
fi
docker rm -f isso >/dev/null 2>&1 || true
docker rmi ghcr.io/isso-comments/isso:release >/dev/null 2>&1 || true
rm -f /opt/isso/config/isso.cfg /opt/isso/db/comments.db /opt/isso/db/comments.db.bak /etc/cron.d/isso-backup
rmdir /opt/isso/config /opt/isso/db /opt/isso 2>/dev/null || echo "left in /opt/isso: $(ls -A /opt/isso 2>/dev/null)"

cp "$SITE" "$SITE.bak"
cp "$D/quill-bethel.conf" "$SITE"
if nginx -t; then systemctl reload nginx; else cp "$SITE.bak" "$SITE"; echo "nginx test failed, restored"; exit 1; fi
echo "container: $(docker ps -a --format '{{.Names}}' | grep -c '^isso$') (0 = gone)"
echo "route: $(curl -s -o /dev/null -w '%{http_code}' http://100.72.207.83:8088/comments/js/embed.min.js) (404 = gone)"
