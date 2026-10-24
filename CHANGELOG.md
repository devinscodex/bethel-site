# Changelog

Versions match the release tags. Tags v1.0 to v1.3 are in Fossil. Version 1.3 was tagged early, so this list covers everything since v1.2.

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

Other
- Deploy script: reads settings from a config file, refetches changed pages.
- Typo fixes (Galatians). Footer: address, phone and email only (no light/dark switch).
- MIT license for the code. Font license added.
- README: build, deploy, layout, privacy.

## 1.0 to 1.2 (2026-10-16 to 2026-10-17)

First release: sermon archive with audio, notes and transcripts, photo gallery, ministries, Visit and Contact pages, search, light and dark mode.
