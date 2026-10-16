# Bethel hosting: three pieces

Visitors -> watchtower04 (public nginx relay, TLS, cache, limits)
  /        -> quill  100.72.207.83:8088  (nginx, static site in /var/www/bethel)
  /media/  -> zekrom 100.92.128.16:8097  (Caddy, audio in E:\bethel-media, tailnet-only)

Neither origin has a public listener. Only watchtower04 is public.

Files:
- quill-bethel.conf           -> quill:/etc/nginx/sites-available/bethel
- watchtower04-bethel.conf    -> watchtower04:/etc/nginx/sites-available/bethel.conf
- bethel-headers.conf         -> watchtower04:/etc/nginx/snippets/bethel-headers.conf
- zekrom-Caddyfile, zekrom-setup.ps1 -> zekrom (already installed; task BethelMedia)

Deploy: tools/deploy.sh (builds production config, indexes search, rsyncs to quill).
Local preview: tools/build.sh, then python3 -m http.server -d public 8080.

DNS: A record bethel.ravenscrest.xyz -> watchtower04's public address (same as jellyfin.ravenscrest.xyz).
