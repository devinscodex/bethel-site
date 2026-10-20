# Church planner: design (draft)

Goal: service plan builder first, volunteer scheduling second, on the Bethel domain behind a login.

## Constraints

- The public site is static Hugo served from quill through the watchtower04 relay. It cannot log anyone in, so the planner is a separate small app.
- Volunteer names, phone numbers and availability are personal data. They never go in this repo; the repo gets fake seed data only.
- Suckless: one process, one SQLite file, no framework beyond the standard library where practical.

## Shape

- App on quill, bound to the tailnet address only, served at `/planner/` by the watchtower04 nginx (proxy to quill). Static site and planner share a hostname, not a codebase.
- Login: per-person accounts, password hashed with scrypt, session cookie (Secure, HttpOnly, SameSite=Lax), login rate limit, lockout. The Dialos `auth_local.py` module already does this and is the reuse candidate.
- Roles: admin (Devin, Steve), planner (can edit plans), member (view own assignments and set availability).
- Data: SQLite at `/var/lib/bethel-planner/planner.db`, nightly copy to a second host. Not in the web root, not in git.
- Audit: a plain log of who changed which plan.

## Data model

Slice 1, service plans:

- `song`: id, title, default_key, tempo, notes, links (lyrics, chart, video)
- `service`: id, date, title, theme, scripture, notes, status (draft, final)
- `item`: id, service_id, position, kind (song, prayer, scripture, sermon, offering, announcement, other), title, song_id, key, minutes, leader_person_id, notes
- Drag-free ordering: up/down buttons, so it works on a phone and with a keyboard.
- Output: printable one-page order of service, and a plain-text copy for pasting into a message.

Slice 2, volunteer scheduling (tables designed now, built later):

- `person`: id, name, phone, email, active
- `position`: id, name (worship leader, keys, nursery, sound, greeter, etc.)
- `person_position`: who can fill what
- `blockout`: person_id, start_date, end_date, reason
- `assignment`: service_id, position_id, person_id, status (asked, confirmed, declined), asked_at, responded_at
- Swap: a declined assignment reopens the slot and lists eligible people who have no blockout that day.

## Build order

1. Skeleton: login, one empty page, deploy behind the relay, backups. Prove the auth and hosting path before any features.
2. Songs list and service builder with printable output, using fake data.
3. Import Devin's real songs and one real service plan.
4. Add person, position, blockout, assignment tables and a read-only "who is on this Sunday" view.
5. Request and confirm flow (email or text link), swaps.

## Risks

- Anything on a public hostname gets scanned. Mitigate: relay rate limits, fail2ban jail for `/planner/login`, no registration endpoint, accounts created by an admin only.
- A single SQLite file on one host is a single point of loss. Mitigate: nightly copy plus restore test before real data goes in.
- Scope creep into a full church-management system. Mitigate: slice 1 ships alone and stays useful.

## Decisions (Devin, 2026-10-19)

- Logins now: Devin only. Later: worship team and admin staff (Devin, Steve, Becky).
- Calendar for real events (meetings, etc.) is in scope, alongside service plans.
- Airtable export comes later; slice 1 waits on it for the real workflow.

## Calendar (slice 1b)

- `event`: id, title, start, end, all_day, location, notes, visibility (staff, worship team, everyone with a login), created_by
- Service dates appear on the calendar automatically from `service`; other events are entered by planners and admins.
- Views: month grid and a plain upcoming list; both print cleanly.
- Optional later: a read-only iCal feed per person (secret URL) so it shows in phone calendars; a public "upcoming events" page on the static site generated from events marked everyone.
- Roles: admin and planner create and edit; members see the events their visibility allows.

## Open questions for Devin

- Airtable: export each table to CSV and share one real service plan plus how it is used on a Sunday, so slice 1 matches the real workflow.
- Reminders: email, text, or neither at first?
- Planning Center: does Bethel already have an account? If so, reading its public API may beat rebuilding the data model.
