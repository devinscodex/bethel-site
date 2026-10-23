# Bethel Fellowship Church website

Hugo site, custom theme, no framework. Live at https://bethel.ravenscrest.xyz/.

Bethel Fellowship Church, Fortuna, Missouri. Sunday School 9:30 AM, Worship 10:30 AM.
Sermon archive (nearly 300), photo gallery, ministries, visit/contact info.

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

## Privacy and data

What the site does and does not do with visitor data. Each point was checked against the code and the live server.

- No analytics, advertising scripts, trackers or social widgets. Pages load only their own scripts, fonts and images.
- Search and the Bible reader run in the visitor's browser. The search index is a static file.
- One cookie, `bt`, remembers light or dark mode. There are no accounts and no forms that send data.
- Links to Facebook, esv.org, Airtable and GitHub leave the site only when clicked.
- Pages, sermon audio, notes and transcripts are served from servers we run. No CDN sits in front of them.
- The web server keeps ordinary access logs (address, time, page) for 14 days, then deletes them.
- AI crawlers are asked to stay away in `robots.txt`, and the server refuses them with a 403.
- The gallery shows the building and grounds. No contact lists or volunteer details are published.
- The church owns its content. It lives in version control, and a copy of the old WordPress site is kept offline.
- The code is open (MIT) so anyone can read what the site does. Deploy settings and keys stay out of the repo.

## License

The code (templates, CSS, JavaScript, scripts) is MIT, see `LICENSE`.

Not covered by that license:
- Photos, the logo and brand files, sermon audio, notes and transcripts belong to Bethel Fellowship Church. All rights reserved.
- Bible text in `assets/bible/web/` is the World English Bible, public domain.
- Fonts in `static/fonts/` are under the SIL Open Font License, see `static/fonts/OFL.txt`.

## Releases

Tagged on trunk at real milestones, not every commit. Each tag carries its own description
(`fossil info v1.2`, or browse tags in the Fossil web UI) rather than duplicating it here.

## Conventions

- Plain commit messages, no tags or prefixes.
- Code comments are short and technical. Nothing is signed.
- No people or children in the repo or on the site without Devin's say.

## Open items

- Bible reader: add a web view beside the terminal-style view, with a toggle. Licensed texts (ESV, NASB, NKJV) cannot be hosted; only public-domain texts ship in the repo.
