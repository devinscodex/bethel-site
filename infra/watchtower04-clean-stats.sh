#!/bin/sh
# Run on watchtower04 as root: sudo sh watchtower04-clean-stats.sh
# Installs the visitors-only report builder and a fail2ban rule for scanner probes.
# Expects bethel-stats.sh and fail2ban-bethel-scan.conf in the same directory.
set -e
D=$(cd "$(dirname "$0")" && pwd)

install -m 755 "$D/bethel-stats.sh" /usr/local/bin/bethel-stats
[ -f /etc/bethel-stats.exclude ] || cat > /etc/bethel-stats.exclude <<'X'
# Addresses left out of the visitor report: a full address, or a prefix ending in a dot.
# Add the church or your home address here so staff visits don't count.
38.22.159.
65.108.218.69
X

cp "$D/fail2ban-bethel-scan.conf" /etc/fail2ban/filter.d/bethel-scan.conf
cat > /etc/fail2ban/jail.d/bethel-scan.local <<'J'
[bethel-scan]
enabled = true
port = http,https
filter = bethel-scan
logpath = /var/log/nginx/bethel.access.log
maxretry = 3
findtime = 10m
bantime = 1d
bantime.increment = true
bantime.maxtime = 4w
ignoreip = 127.0.0.1/8 100.64.0.0/10 38.22.159.0/24 65.108.218.69
J
systemctl restart fail2ban
sleep 2
/usr/local/bin/bethel-stats
ls -la /var/www/bethel-stats/index.html
fail2ban-client status bethel-scan
