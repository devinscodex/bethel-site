#!/bin/sh
# Run on quill as root: sudo sh quill-isso-setup.sh
# Installs the Isso comment server (moderated) in Docker, bound to 127.0.0.1:8090,
# and adds the /comments/ proxy to the site's nginx. Expects quill-bethel.conf in the same directory.
set -e
D=$(cd "$(dirname "$0")" && pwd)
SITE=/etc/nginx/sites-available/bethel

printf 'Isso admin password (min 16 chars, not echoed): '; stty -echo; read -r P; stty echo; echo
[ ${#P} -ge 16 ] || { echo "too short"; exit 1; }
case "$P" in *[\ \$\`\\\"\']*) echo "avoid spaces and \$ \` \\ quotes in the password"; exit 1;; esac

mkdir -p /opt/isso/config /opt/isso/db
umask 077
cat > /opt/isso/config/isso.cfg <<CFG
[general]
dbpath = /db/comments.db
host = https://bethel.ravenscrest.xyz/
max-age = 15m
notify = stdout

[moderation]
enabled = true
purge-after = 30d

[server]
listen = http://127.0.0.1:8090
public-endpoint = https://bethel.ravenscrest.xyz/comments
trusted-proxies = 127.0.0.1

[guard]
enabled = true
ratelimit = 2
direct-reply = 3
reply-to-self = false
require-author = true
require-email = false

[markup]
options = autolink

[admin]
enabled = true
password = $P
CFG
umask 022

docker pull ghcr.io/isso-comments/isso:release
docker rm -f isso >/dev/null 2>&1 || true
docker run -d --name isso --restart unless-stopped --network host --memory 300m \
  -v /opt/isso/config:/config -v /opt/isso/db:/db \
  --entrypoint /isso/bin/gunicorn ghcr.io/isso-comments/isso:release \
  -b 127.0.0.1:8090 -w 2 --preload --worker-tmp-dir /dev/shm isso.run

echo '0 3 * * * root cp /opt/isso/db/comments.db /opt/isso/db/comments.db.bak 2>/dev/null' > /etc/cron.d/isso-backup

cp "$SITE" "$SITE.bak"
cp "$D/quill-bethel.conf" "$SITE"
if nginx -t; then systemctl reload nginx; else cp "$SITE.bak" "$SITE"; echo "nginx test failed, restored"; exit 1; fi

sleep 4
echo "isso direct: $(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8090/js/embed.min.js)"
echo "via nginx:   $(curl -s -o /dev/null -w '%{http_code}' http://100.72.207.83:8088/comments/js/embed.min.js)"
