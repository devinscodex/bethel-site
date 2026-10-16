#!/bin/sh
# Run on watchtower04 as root: sh watchtower04-stats-setup.sh
# Installs GoAccess, gives bethel its own access log, builds a static report
# every 10 minutes, and serves it on the tailnet address only (port 8089).
set -e
TS_IP=100.105.185.113
VHOST=/etc/nginx/sites-enabled/bethel.conf

apt-get install -y goaccess

# Separate log for this site (the shared access.log has no host field).
grep -q bethel.access.log "$VHOST" || \
  awk '/server_name bethel.ravenscrest.xyz;/{n++} {print} n==2 && /server_name bethel.ravenscrest.xyz;/{print "    access_log /var/log/nginx/bethel.access.log;"}' "$VHOST" > /tmp/bethel.conf.new && cp /tmp/bethel.conf.new "$VHOST"

mkdir -p /var/www/bethel-stats
cat > /usr/local/bin/bethel-stats <<'SH'
#!/bin/sh
# Rebuild the visitor report from the bethel access logs.
cd /var/log/nginx
zcat -f bethel.access.log.*.gz 2>/dev/null | cat - bethel.access.log.1 bethel.access.log 2>/dev/null |
  goaccess - --log-format=COMBINED --ignore-crawlers --anonymize-ip \
    --ignore-panel=REMOTE_USER -o /var/www/bethel-stats/index.tmp.html 2>/dev/null
mv /var/www/bethel-stats/index.tmp.html /var/www/bethel-stats/index.html
SH
chmod 755 /usr/local/bin/bethel-stats
echo '*/10 * * * * root /usr/local/bin/bethel-stats' > /etc/cron.d/bethel-stats

cat > /etc/nginx/sites-available/bethel-stats.conf <<CONF
# Visitor report, tailnet only.
server {
    listen $TS_IP:8089;
    root /var/www/bethel-stats;
    index index.html;
    location / { try_files \$uri \$uri/ =404; }
}
CONF
ln -sf /etc/nginx/sites-available/bethel-stats.conf /etc/nginx/sites-enabled/bethel-stats.conf

nginx -t
systemctl reload nginx
/usr/local/bin/bethel-stats || true
echo "report: http://$TS_IP:8089/"
