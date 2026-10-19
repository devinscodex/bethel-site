# Bethel Fellowship Church website

Hugo site (custom theme, no framework) at https://bethel.ravenscrest.xyz/. Source of truth is the Fossil
repo; every commit is mirrored to the private GitHub repo.

## How it is hosted

    Visitors -> watchtower04  public nginx relay: TLS, page cache (10 min), rate limits, hotlink guard
       /        -> quill   100.72.207.83:8088   static site in /var/www/bethel (tailnet only)
       /media/  -> zekrom  100.92.128.16:8097   Caddy, audio and PDFs in E:\bethel-media (tailnet only)
       /admin/  -> watchtower04 100.105.185.113:8089   visitor report (GoAccess), behind a password

Only watchtower04 has a public listener. Audio is cached on the relay (up to 6 GB, 4 MB slices).

DNS: A record bethel.ravenscrest.xyz -> watchtower04's public address (same as jellyfin.ravenscrest.xyz).

## Files in infra/

| File | Goes to |
|---|---|
| quill-bethel.conf | quill:/etc/nginx/sites-available/bethel |
| watchtower04-bethel.conf | watchtower04:/etc/nginx/sites-available/bethel.conf |
| bethel-headers.conf | watchtower04:/etc/nginx/snippets/bethel-headers.conf |
| zekrom-Caddyfile, zekrom-setup.ps1 | zekrom (task BethelMedia, already installed) |
| watchtower04-admin-setup.sh, fail2ban-bethel-admin.conf | password and lockout for /admin |
| watchtower04-clean-stats.sh, bethel-stats.sh, fail2ban-bethel-scan.conf | visitors-only report and scanner bans |
| watchtower04-stats-setup.sh | first version of the report setup, superseded by the clean-stats script |
| quill-isso-remove.sh | removes the retired comment server (see below) |

Configs are installed by hand with sudo; every script backs up and restores on a failed `nginx -t`.

## Everyday tasks

- Preview: `tools/build.sh`, then `python3 -m http.server -d public 8080`.
- Deploy: `tools/deploy.sh` (production build, search index, rsync to quill). The relay can show the previous
  version for up to 10 minutes.
- Sermons: `tools/import_sermons.py` builds `content/sermons/` from the archive. Fixes for titles, audio paths
  and speaker names live at the top of that script so a re-import keeps them.
- Sermon notes: `tools/extract_notes.py` turns the notes PDFs into `data/notes/<slug>.json` (transcript text).
- Visitor report: the cron job rebuilds it every 10 minutes. Addresses to leave out are listed in
  `/etc/bethel-stats.exclude` on watchtower04.

## Security layers

HTTPS with HSTS, strict content policy (no inline scripts), per-IP rate limits, hotlink guard on /media/,
POST refused everywhere, AI-training crawlers refused (robots.txt and a 403), password plus rate limit plus
fail2ban on /admin, fail2ban on scanner probes (.php, .env, .git and similar).

## Retired: shared notes and message board

Built with the Isso comment server and removed at Steve's request. The code is kept in Fossil under the tag
`comments-isso` (also on GitHub). To look at it: `fossil cat -r comments-isso infra/quill-isso-setup.sh`.
Removing it from the servers takes two commands that need sudo: `quill-isso-remove.sh` on quill, then copy
`watchtower04-bethel.conf` over the live relay config (it no longer has the /comments/ routes).

## Conventions

- Plain commit messages, no tags or prefixes.
- Code comments are short and technical. Nothing is signed.
- No people or children in the repo or on the site without Devin's say.
- Push with plain `git push origin main`; never mirror or force.

## Open items

- Upload tool for staff to add sermon audio and notes (review before publishing, per-person logins).
- Search Console and Google Business Profile.
- Church planner: reverse-engineered Planning Center "Services" app, fed by data from Airtable
  (replaces the paid Planning Center subscription). Real scope: plan worship services (song
  sets, order of service) and practice/rehearsal schedules, assign volunteers/musicians, and
  communicate with them (reminders, schedule changes, practice notes).
- Quill has deferred service restarts waiting (including Docker, which carries Joplin).
