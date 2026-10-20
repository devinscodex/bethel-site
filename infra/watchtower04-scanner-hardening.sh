#!/bin/sh
# watchtower04: reduce scanner noise and ban repeat offenders. Run as root.
#   sudo sh watchtower04-scanner-hardening.sh          apply
#   sudo sh watchtower04-scanner-hardening.sh --check  show what would change, touch nothing
# Adds only new files; existing jails and vhosts are left alone. Every nginx change is
# validated with nginx -t and rolled back from a timestamped backup if it fails.
set -u
[ "$(hostname)" = watchtower04 ] || { echo "wrong host"; exit 1; }
[ "$(id -u)" = 0 ] || { echo "run as root"; exit 1; }
CHECK=0; [ "${1:-}" = "--check" ] && CHECK=1

B=/root/hardening-backup-$(date +%Y%m%d-%H%M%S)
say() { printf '== %s\n' "$*"; }

say "existing default servers"
grep -rn "default_server" /etc/nginx/sites-enabled /etc/nginx/conf.d 2>/dev/null || echo "none"
say "existing jails"; fail2ban-client status 2>/dev/null | sed -n 2,3p
[ "$CHECK" = 1 ] && exit 0

mkdir -p "$B" && cp -a /etc/nginx "$B/nginx" && cp -a /etc/fail2ban "$B/fail2ban" && say "backup in $B"

# 1. Requests that reach us by bare IP or an unknown hostname are scanners, not visitors.
#    Drop them before any site answers. Skipped if a default_server already exists.
if grep -rqs "default_server" /etc/nginx/sites-enabled /etc/nginx/conf.d; then
  say "default_server already present, leaving catch-all alone"
else
  cat > /etc/nginx/conf.d/00-catchall.conf <<'EOF'
# Unknown Host or bare-IP requests: close without a response; refuse TLS handshakes with no matching name.
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    return 444;
}
server {
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;
    server_name _;
    ssl_reject_handshake on;
}
EOF
fi

# 2. Rate-limit and size-limit defaults for the whole http block.
cat > /etc/nginx/conf.d/10-scanner-defaults.conf <<'EOF'
client_header_timeout 10s;
client_body_timeout 10s;
send_timeout 20s;
large_client_header_buffers 4 8k;
# Method filter for any vhost that opts in with: if ($bad_method) { return 405; }
map $request_method $bad_method {
    default 1;
    GET 0;
    HEAD 0;
    POST 0;
}
EOF

if nginx -t 2>&1; then
  systemctl reload nginx && say "nginx reloaded"
else
  say "nginx -t FAILED, rolling back"
  rm -f /etc/nginx/conf.d/00-catchall.conf /etc/nginx/conf.d/10-scanner-defaults.conf
  nginx -t && systemctl reload nginx
  exit 1
fi

# 3. fail2ban: broader probe filter, rate-limit offenders, repeat offenders (recidive), planner login.
cat > /etc/fail2ban/filter.d/bethel-probe.conf <<'EOF'
[Definition]
# Paths a static site and its tools never serve: scripts, secrets, backups, dumps, admin consoles, router and IoT exploits.
failregex = ^<HOST> .* "(GET|POST|HEAD|PUT|PROPFIND|OPTIONS) [^"]*(\.php|\.env|\.git(/|config)|\.svn|\.hg|\.aws|\.ssh|\.asp|\.jsp|\.cgi|\.sql|\.bak|\.old|\.swp|\.zip|\.tar|\.gz|\.rar|\.7z|id_rsa|wp-admin|wp-login|wp-content|wp-includes|xmlrpc|phpmyadmin|pma/|cgi-bin|actuator|solr/|boaform|HNAP1|owa/|ecp/|autodiscover|vendor/phpunit|_ignition|server-status|manager/html|jenkins|geoserver|remote/login|/etc/passwd|\.\./)[^"]*" (400|401|403|404|405|406|414|444|499)
ignoreregex =
EOF
cat > /etc/fail2ban/filter.d/bethel-ratelimit.conf <<'EOF'
[Definition]
# The relay answered 429 to this client: it is hammering past the per-IP limits.
failregex = ^<HOST> .* "[A-Z]+ [^"]*" 429
ignoreregex =
EOF
cat > /etc/fail2ban/filter.d/bethel-planner-login.conf <<'EOF'
[Definition]
failregex = ^<HOST> .* "POST /planner/login[^"]*" (400|429)
ignoreregex =
EOF

cat > /etc/fail2ban/jail.d/bethel-extra.local <<'EOF'
[bethel-probe]
enabled  = true
port     = http,https
filter   = bethel-probe
logpath  = /var/log/nginx/*.access.log
maxretry = 3
findtime = 10m
bantime  = 24h

[bethel-ratelimit]
enabled  = true
port     = http,https
filter   = bethel-ratelimit
logpath  = /var/log/nginx/bethel.access.log
maxretry = 30
findtime = 2m
bantime  = 1h

[bethel-planner-login]
enabled  = true
port     = http,https
filter   = bethel-planner-login
logpath  = /var/log/nginx/bethel.access.log
maxretry = 5
findtime = 10m
bantime  = 1h

[recidive]
enabled  = true
logpath  = /var/log/fail2ban.log
banaction = %(banaction_allports)s
bantime  = 1w
findtime = 1d
maxretry = 3
EOF

# Never ban ourselves: add the tailnet range if missing.
grep -rqs "100.64.0.0/10" /etc/fail2ban/jail.local /etc/fail2ban/jail.d 2>/dev/null || \
  printf '[DEFAULT]\nignoreip = 127.0.0.1/8 ::1 100.64.0.0/10\n' > /etc/fail2ban/jail.d/00-ignoreip.local

if fail2ban-client -t >/dev/null 2>&1; then
  systemctl reload fail2ban || systemctl restart fail2ban
  say "fail2ban reloaded"; fail2ban-client status
else
  say "fail2ban config test FAILED, removing new files"
  rm -f /etc/fail2ban/jail.d/bethel-extra.local /etc/fail2ban/jail.d/00-ignoreip.local \
        /etc/fail2ban/filter.d/bethel-probe.conf /etc/fail2ban/filter.d/bethel-ratelimit.conf \
        /etc/fail2ban/filter.d/bethel-planner-login.conf
  fail2ban-client -t; exit 1
fi

say "verify"
curl -sk -o /dev/null -w "bare-IP https -> %{http_code} (000 = handshake refused)\n" https://127.0.0.1/ || true
curl -s  -o /dev/null -w "bethel via name -> %{http_code}\n" --resolve bethel.ravenscrest.xyz:443:127.0.0.1 https://bethel.ravenscrest.xyz/
echo "rollback: cp -a $B/nginx/. /etc/nginx/ && cp -a $B/fail2ban/. /etc/fail2ban/ && systemctl reload nginx fail2ban"
