#!/bin/sh
# Run on watchtower04 as root: sh watchtower04-admin-setup.sh
# Protects /admin on bethel.ravenscrest.xyz: password, rate limit, fail2ban.
set -e
D=$(dirname "$0")
CONF=/etc/nginx/sites-available/bethel.conf

printf 'Admin username: '; read -r U
printf 'Password (min 16 chars): '; stty -echo; read -r P; stty echo; echo
[ ${#P} -ge 16 ] || { echo "too short"; exit 1; }
printf '%s:%s\n' "$U" "$(printf '%s' "$P" | openssl passwd -6 -stdin)" > /etc/nginx/bethel-admin.htpasswd
chown root:www-data /etc/nginx/bethel-admin.htpasswd; chmod 640 /etc/nginx/bethel-admin.htpasswd

apt-get install -y fail2ban
cp "$D/fail2ban-bethel-admin.conf" /etc/fail2ban/filter.d/bethel-admin.conf
cat > /etc/fail2ban/jail.d/bethel-admin.local <<'J'
[bethel-admin]
enabled = true
port = http,https
filter = bethel-admin
logpath = /var/log/nginx/bethel.access.log
maxretry = 5
findtime = 10m
bantime = 1h
bantime.increment = true
bantime.maxtime = 1w
J

cp "$CONF" "$CONF.bak"
cp "$D/watchtower04-bethel.conf" "$CONF"
if nginx -t; then systemctl reload nginx; else cp "$CONF.bak" "$CONF"; echo "nginx test failed, restored"; exit 1; fi
systemctl restart fail2ban
sleep 2
fail2ban-client status bethel-admin
