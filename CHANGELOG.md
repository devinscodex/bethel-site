# Changelog

Versions match the release tags (v1.0-v1.3) in the project history. v1.3 was
tagged early, so real work past it is grouped under 1.4 below.

## 1.4 (in progress, not tagged yet)

Look
- Nav: Sermons, Visit, Ministries, Resources, About. Current page has a blue box, no bold. On phones only the logo (no word) and the five links show, on one row. The light/dark switch is on the Tools page. More space right of the logo and after About.
- Colors: Flexoki, light and dark, blue accent (was Catppuccin).
- New logo mark in the header, and on the home page beside the church name. The header name is just "Bethel".
- Tab icon: white arch and cross on black, bolder for small sizes, with versioned file names so browsers and the proxy fetch the new one.
- Type: larger labels and meta text, brighter muted text, bigger player controls.

Home
- Carousel: 7 slides, pause button, swipe, 44px controls, two stained glass views, hymnal.
- Church name and times under the photos, with the mark.
- Latest sermon with summary and player. Two recent sermons.

Sermons
- All sermons: sortable table, word search (title, speaker, series, passage, summary), clear button, `/` to search, filters kept in the address.
- Speaker and series views with counts and years. Speakers: newest first.
- Player: no back-15 button.

Visit
- Times and address strip, directions link, welcome text, short sections.

Ministries
- Intro line and 2x2 grid. Youth and Providence hidden for now.

About
- Gallery banner, life together, contact details, Facebook, directions.
- "changelog" link at the bottom (was a version number).

Resources (was Tools; /tools/ still redirects here)
- Blue Letter Bible, ESV Bible online, music links, Airtable (members), search.
- Music player on the Resources page. Plays video when a song has one, else audio. First playlist: This week. No playlist tabs or personal playlists for now.
- Display: a copy of the light/dark switch.
- Own Bible reader removed.
- Serving: scaffold added for a future volunteer sign-in/schedule link (commented out in hugo.toml, not live until a provider is chosen).

Other
- Deploy script: reads settings from a config file, refetches changed pages.
- Typo fixes (Galatians). Footer: address, phone and email only (no light/dark switch).
- MIT license for the code. Font license added.
- README: build, deploy, layout, privacy.
- README trimmed for the public repo (dropped build/deploy commands and internal rules); privacy section tightened.
- Removed infra/ (server names, addresses, hardening configs) from the repo; it stays in the private project history, not the public one.

## 1.3 (2026-10-23)

Tagged early; the bulk of real work past this point is in 1.4 above.
- Nav: Sermons first, Visit, Ministries, Tools, About; current page highlighted; one-line phone header.
- Tools page: Airtable (members), ESV Bible, Blue Letter Bible, open music tools, search.
- Sermons: sortable table, word search including summaries, `/` to search.
- Home, Visit, About: carousel, times strip and copy passes.
- Added MIT license, font license, CHANGELOG.md.

## 1.2 (2026-10-17)

Comments and message board retired at request (code kept under the
`comments-isso` tag, not deleted). Added a visitors-only traffic report
with scanner bans. Sermon merges and photo/layout polish.

## 1.1 (2026-10-16)

Added visitor comments and a message board, admin moderation (notes
publish immediately, admin deletes afterward), stricter admin password
check.

## 1.0 (2026-10-16)

First complete site: sermon archive (296 imported sermons), light/dark
Everforest theme, custom audio player with search, series/speaker/topic
pages, mobile nav, gallery, strict-CSP-ready JS.
