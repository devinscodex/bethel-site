#!/usr/bin/env python3
"""Import the frozen WordPress REST archive into Hugo sermon pages.

usage: import_sermons.py OUT_DIR [LIMIT]
Reads the archive read-only; writes content/sermons/<slug>.md (YAML front matter).
"""
import html, json, os, re, sys, urllib.parse
from datetime import datetime, timezone

ARC = "/mnt/t/documents/bethel/website/archive/2026-10-15/rest-json/"
out_dir = sys.argv[1]
limit = int(sys.argv[2]) if len(sys.argv) > 2 else None
os.makedirs(out_dir, exist_ok=True)

def load(n): return json.load(open(ARC + n))
names = lambda f: {t["id"]: html.unescape(t["name"]) for t in load(f)}
preachers = names("tax_wpfc_preacher.json")
TITLE_FIX = {"261011": "The Heart of Paul"}
AUDIO_FIX = {"kaleo-13-called-to-stand-firm": "/audio/sermons/2020/03/2020-03-08-Kaleo-13-Called-To-Stand-Firm.mp3"}
SPEAKER_FIX = {"Eric Loganbill": "Erik Loganbill", "Bethel Church Family": "Bethel Family", "Robert Loggins": "Dr. Robert Loggins", "Rober Loggins": "Dr. Robert Loggins"}
preachers = {k: SPEAKER_FIX.get(v, v) for k, v in preachers.items()}
series = names("tax_wpfc_sermon_series.json")
books = names("tax_wpfc_bible_book.json")
topics = names("tax_wpfc_sermon_topics.json")

def upload_path(url, prefix):
    if not url: return ""
    p = urllib.parse.urlparse(url).path
    if "/wp-content/uploads/" not in p: return ""
    return prefix + urllib.parse.unquote(p.split("/wp-content/uploads/", 1)[1])

def clean(t):
    t = re.sub(r"<[^>]+>", " ", t or "")
    return re.sub(r"\s+", " ", html.unescape(t)).strip()

def y(v):  # JSON is valid YAML
    return json.dumps(v, ensure_ascii=False)

sermons = sorted(load("type_wpfc_sermon.json"), key=lambda s: s["slug"])
if limit: sermons = sermons[:limit]
seen, written = set(), 0
for s in sermons:
    slug = s["slug"]
    if slug in seen:
        raise SystemExit(f"duplicate slug {slug}")
    seen.add(slug)
    ts = s.get("sermon_date")
    date = datetime.fromtimestamp(ts, timezone.utc).strftime("%Y-%m-%d") if ts else s["date"][:10]
    if not ts and re.fullmatch(r"\d{6}", slug):
        date = datetime.strptime(slug, "%y%m%d").strftime("%Y-%m-%d")
    fm = {
        "title": html.unescape(s["title"]["rendered"]),
        "date": date,
        "slug": slug,
        "speaker": [preachers[i] for i in s.get("wpfc_preacher", []) if i in preachers],
        "series": [series[i] for i in s.get("wpfc_sermon_series", []) if i in series],
        "books": [books[i] for i in s.get("wpfc_bible_book", []) if i in books],
        "topics": [topics[i] for i in s.get("wpfc_sermon_topics", []) if i in topics],
        "passage": s.get("bible_passage") or "",
        "audio": upload_path(s.get("sermon_audio"), "/audio/"),
        "notes_pdf": upload_path(s.get("sermon_bulletin"), "/files/"),
        "wp_id": s["id"],
    }
    fm["audio"] = AUDIO_FIX.get(slug, fm["audio"])
    fm["title"] = TITLE_FIX.get(slug, fm["title"])
    summary = clean(s["excerpt"]["rendered"])
    body = clean(s["content"]["rendered"])
    with open(os.path.join(out_dir, slug + ".md"), "w", encoding="utf-8") as f:
        f.write("---\n")
        for k, v in fm.items():
            if v in ("", [], None) and k not in ("title",): continue
            f.write(f"{k}: {y(v)}\n")
        if summary: f.write(f"summary: {y(summary)}\n")
        f.write("---\n")
        if body: f.write(body + "\n")
    written += 1
print("written", written, "to", out_dir)
