# Bethel Fellowship Church website

Hugo site, custom theme, no framework. Live at https://bethel.ravenscrest.xyz/.

Bethel Fellowship Church, Fortuna, Missouri. Sunday School 9:30 AM, Worship 10:30 AM.
Sermon archive (nearly 300), photo gallery, ministries, visit/contact info.

Fossil is the source of truth. The GitHub copy is a mirror.

## Quick start

Requires `hugo` and `pagefind` on PATH.

    tools/build.sh                        # hugo --minify + pagefind search index -> public/
    python3 -m http.server -d public 8080 # preview at localhost:8080

Deploy: `tools/deploy.sh` builds for production, makes the search index and copies the site to
the web server. It reads `TARGET`, `SITE` and optional `TOKEN` from `~/.config/bethel-deploy`.
A caching proxy can show the old site for up to 10 minutes after a deploy.

## Layout

    content/      sermons, ministries, gallery, about, visit, contact
    layouts/      custom theme templates (no external Hugo theme)
    assets/       CSS/JS source
    static/       served as-is: fonts, favicon, robots.txt
    data/notes/   sermon transcript JSON, built by tools/extract_notes.py
    sketches/     design explorations, not part of the live site
    tools/        build.sh, deploy.sh, import_sermons.py, extract_notes.py

## Releases

Tagged on trunk at real milestones, not every commit. Each tag carries its own description
(`fossil info v1.2`, or browse tags in the Fossil web UI) rather than duplicating it here.

## Conventions

- Plain commit messages, no tags or prefixes.
- Code comments are short and technical. Nothing is signed.
- No people or children in the repo or on the site without Devin's say.

## Open items

- Bible reader: add a web view beside the terminal-style view, with a toggle. Licensed texts (ESV, NASB, NKJV) cannot be hosted; only public-domain texts ship in the repo.
