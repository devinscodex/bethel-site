#!/bin/sh
# Rebuild the visitor report from the bethel access logs, visitors only.
# Dropped before reporting: our own addresses (/etc/bethel-stats.exclude: one per line, a full address or a prefix ending in a dot),
# crawlers and tools, scanner probes, and the comments/search plumbing.
# OUT and LOGDIR can be overridden for testing.
OUT=${OUT:-/var/www/bethel-stats/index.html}
LOGDIR=${LOGDIR:-/var/log/nginx}
EXCL=${EXCL:-/etc/bethel-stats.exclude}
cd "$LOGDIR" || exit 1

PREFIXES=$(grep -v '^[[:space:]]*#' "$EXCL" 2>/dev/null | sed '/^[[:space:]]*$/d' | sed 's/\./\\./g' | paste -sd'|')
{ zcat -f bethel.access.log.*.gz 2>/dev/null; cat bethel.access.log.1 bethel.access.log 2>/dev/null; } |
  PRE="^(${PREFIXES:-NOMATCH})[0-9]* " awk '
    BEGIN { pre = ENVIRON["PRE"] }
    $0 ~ pre { next }
    tolower($0) ~ /(claudebot|gptbot|ccbot|bytespider|meta-externalagent|amazonbot|cohere-ai|diffbot|imagesiftbot|omgilibot|curl\/|python-|go-http|wget|facebookexternalhit|scan\.|zgrab|masscan|nmap)/ { next }
    $0 ~ /"[A-Z]+ [^"]*(\.php|\.env|\.git\/|\.aws|\.asp|\.jsp|wp-admin|wp-login|wp-content|xmlrpc|phpmyadmin|cgi-bin)[^"? ]*[^"]*" / { next }
    $0 ~ /"[A-Z]+ \/(comments|pagefind|admin)\// { next }
    { print }' |
  goaccess - --log-format=COMBINED --ignore-crawlers --anonymize-ip --ignore-panel=REMOTE_USER \
    --static-file=.webp --static-file=.woff2 --static-file=.svg --static-file=.json --static-file=.xml --static-file=.txt \
    -o "$OUT.tmp.html" 2>/dev/null && mv "$OUT.tmp.html" "$OUT"
