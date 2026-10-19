# Bethel Fellowship Church website

Hugo site (custom theme, no framework) for Bethel Fellowship Church in Fortuna, Missouri.
Live at https://bethel.ravenscrest.xyz/. Source of truth is this Fossil repo; every commit
mirrors to a private GitHub repo.

Sunday School 9:30 AM, Worship 10:30 AM. The site carries nearly 300 archived sermons, a
photo gallery, ministry info, and visit/contact details.

## Quick start

Requires `hugo` and `pagefind` on PATH.

    tools/build.sh                        # hugo --minify + pagefind search index -> public/
    python3 -m http.server -d public 8080 # preview at localhost:8080

Deploy to production: `tools/deploy.sh` (production build, search index, rsync to quill).
The public relay can still show the previous version for up to 10 minutes after a deploy.
Needs the one-time server setup in `infra/README.md`.

## Layout

    content/      Hugo content: sermons, ministries, gallery, about, visit, contact
    layouts/      Custom theme templates (no external Hugo theme in use)
    assets/       CSS/JS source
    static/       Files served as-is (fonts, favicon, robots.txt)
    data/notes/   Sermon transcript JSON, built by tools/extract_notes.py
    sketches/     Design explorations, not part of the live site
    infra/        Server configs + hosting runbook -- see infra/README.md
    tools/        build.sh, deploy.sh, import_sermons.py, extract_notes.py

## Hosting, security, and day-to-day ops

Full detail -- the watchtower04/quill/zekrom relay chain, DNS, nginx/fail2ban configs, the
visitor report, and the sermon-import pipeline -- lives in `infra/README.md`. Read that before
touching anything server-side.

## Releases

Tags mark real milestones on trunk, not every commit -- see `fossil timeline tag:v1.2` (or any
tag name) for the exact commit list behind one.

- **v1.0** -- First complete site: sermon archive (296 imported sermons), light/dark Everforest
  theme, custom audio player with Pagefind search, series/speaker/topic pages, mobile nav,
  gallery, strict-CSP-ready JS, and the three-server production hosting setup
  (quill/watchtower04/zekrom).
- **v1.1** -- Added visitor comments and a message board (Isso-based), with admin moderation
  (notes publish immediately, admin deletes afterward) and a stricter admin password check.
- **v1.2** -- Comments and the message board retired at Steve's request (code kept under the
  `comments-isso` tag, not deleted -- `fossil cat -r comments-isso infra/quill-isso-setup.sh` to
  look at it); added a visitors-only traffic report (GoAccess) with scanner bans, plus sermon
  merges and photo/layout polish. Current hosting runbook lives in `infra/README.md`.

Tagging a new release: `fossil tag add vX.Y <check-in>` on trunk once a real milestone lands,
then a one-line summary added here of what actually shipped since the last tag.

## Conventions

- Plain commit messages, no tags or prefixes.
- Code comments are short and technical. Nothing is signed.
- No people or children in the repo or on the site without Devin's say.
- Push with plain `git push origin main`; never mirror or force.

## Open items

See `infra/README.md`'s Open items section (staff upload tool, Search Console, church planner,
pending quill restarts).
