# Bethel Fellowship Church website

Hugo site. Own theme. No framework. Live: https://bethel.ravenscrest.xyz/

## Build

Needs `hugo` and `pagefind` on PATH.

    tools/build.sh                        # build site and search index into public/
    python3 -m http.server -d public 8080 # preview at localhost:8080

## Deploy

    tools/deploy.sh

The script builds for production, makes the search index, and copies the site to the web server.
It reads `TARGET`, `SITE` and optional `TOKEN` from `~/.config/bethel-deploy`.
A caching proxy can show old pages for up to 10 minutes after a deploy.

## Layout

    content/      sermons, ministries, gallery, about, visit, contact, resources
    layouts/      theme templates (no external theme)
    assets/       CSS and JS source
    static/       served as-is: fonts, favicon, robots.txt
    data/notes/   sermon transcript JSON (tools/extract_notes.py)
    sketches/     old design tests, not on the live site
    tools/        build.sh, deploy.sh, import_sermons.py, extract_notes.py

## Privacy

Each point was checked against the code and the live server.

- No analytics, ads, trackers or social widgets. Pages load only their own scripts, fonts and images.
- Search runs in the browser. The search index is a static file.
- One cookie: `bt` (light or dark mode). No accounts. No forms.
- Links to Facebook, esv.org, Blue Letter Bible, Airtable and GitHub leave the site only when a visitor clicks them.
- Pages, audio, notes and transcripts come from servers the church runs. No CDN.
- The web server keeps access logs (address, time, page) for 14 days, then deletes them.
- `robots.txt` asks AI crawlers to stay away. The server refuses them with a 403.
- The gallery shows the building and grounds. No contact lists. No volunteer details.
- The church owns its content. A copy of the old WordPress site is kept offline.
- The code is open (MIT). Deploy settings and keys are not in the repo.

## License

Code (templates, CSS, JS, scripts): MIT. See `LICENSE`.

Not covered by MIT:
- Photos, logo, brand files, sermon audio, notes and transcripts belong to Bethel Fellowship Church. All rights reserved.
- Fonts in `static/fonts/` use the SIL Open Font License. See `static/fonts/OFL.txt`.

## Releases

Tags mark real milestones, not every commit. See `CHANGELOG.md`.

## Rules

- Commit messages are plain. No tags or prefixes.
- Code comments are short and technical. No signatures.
- No people or children in the repo or on the site without Devin's approval.
