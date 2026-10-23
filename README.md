# Bethel Fellowship Church website

Hugo site, custom theme, no framework. Live at https://bethel.ravenscrest.xyz/.

Bethel Fellowship Church, Fortuna, Missouri. Sunday School 9:30 AM, Worship 10:30 AM.
Sermon archive (nearly 300), photo gallery, ministries, visit/contact info.

Fossil is the source of truth; every commit mirrors to a private GitHub repo.

## Quick start

Requires `hugo` and `pagefind` on PATH.

    tools/build.sh                        # hugo --minify + pagefind search index -> public/
    python3 -m http.server -d public 8080 # preview at localhost:8080

Deploy: `tools/deploy.sh` (production build, search index, rsync to quill). The public relay
can still show the previous version for up to 10 minutes after a deploy. One-time server setup
is in `infra/README.md`.

## Layout

    content/      sermons, ministries, gallery, about, visit, contact
    layouts/      custom theme templates (no external Hugo theme)
    assets/       CSS/JS source
    static/       served as-is: fonts, favicon, robots.txt
    data/notes/   sermon transcript JSON, built by tools/extract_notes.py
    sketches/     design explorations, not part of the live site
    infra/        server configs + hosting runbook, see infra/README.md
    tools/        build.sh, deploy.sh, import_sermons.py, extract_notes.py

## Hosting and ops

The relay chain (watchtower04/quill/zekrom), DNS, nginx/fail2ban configs, visitor report, and
sermon-import pipeline are all in `infra/README.md`. Read that before touching anything
server-side.

## Releases

Tagged on trunk at real milestones, not every commit. Each tag carries its own description
(`fossil info v1.2`, or browse tags in the Fossil web UI) rather than duplicating it here.

## Conventions

- Plain commit messages, no tags or prefixes.
- Code comments are short and technical. Nothing is signed.
- No people or children in the repo or on the site without Devin's say.
- Push with plain `git push origin main`; never mirror or force.

## Open items

- Bible reader: add a web view beside the terminal-style view (toggle between them), modeled on esv.org's reading layout. Licensed texts (ESV, NASB, NKJV) cannot be hosted; only public-domain texts ship in the repo.
See `infra/README.md`'s Open items section.
