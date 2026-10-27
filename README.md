# Bethel Fellowship Church website

A small, dependency-light Hugo site for Bethel Fellowship Church (Fortuna,
Missouri): a sermon archive (audio, text and notes for roughly 300 sermons),
ministries and visit information, and a members resources page. Own theme,
no JS framework, static output only. Live: https://bethel.ravenscrest.xyz/

## Layout

    content/      sermons, ministries, gallery, about, visit, contact, resources
    layouts/      theme templates (no external theme)
    assets/       CSS and JS source
    static/       served as-is: fonts, favicon, robots.txt
    data/notes/   sermon transcript JSON (tools/extract_notes.py)
    sketches/     old design tests, not on the live site
    tools/        build.sh, deploy.sh, import_sermons.py, extract_notes.py

## Privacy

- No analytics, ads, trackers, or social widgets.
- Search runs in the browser from a static index.
- One cookie (`bt`, light/dark mode). No accounts, no forms.
- Outbound links (Facebook, esv.org, Blue Letter Bible, Airtable, GitHub) only load when clicked.
- No CDN; pages, audio, notes and transcripts are served from church-run servers.
- Access logs (address, time, page) kept 14 days, then deleted.
- AI crawlers blocked via `robots.txt` and a server-side 403.
- Gallery shows the building and grounds only: no people, no contact or volunteer details.
- Code is MIT-licensed and open; deploy settings and keys are not in the repo.

## License

Code (templates, CSS, JS, scripts): MIT. See `LICENSE`.

Not covered by MIT:
- Photos, logo, brand files, sermon audio, notes and transcripts belong to Bethel Fellowship Church. All rights reserved.
- Fonts in `static/fonts/` use the SIL Open Font License. See `static/fonts/OFL.txt`.
