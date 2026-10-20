#!/usr/bin/env python3
"""USFM -> assets/bible/<tr>/<slug>.json (+ books.json). One-shot converter.

    python3 tools/bible_build.py web /path/to/extracted/eng-web_usfm

Public-domain texts only (WEB, KJV...): output is committed and published.
Never run this on a licensed module (NASB, NKJV, ...): the site is public.
Each book file: {"n": "John", "c": [["v1 text", "v2 text", ...], ...]}
(c[chapter-1][verse-1]); a missing verse is "" so indexes stay aligned.
"""
import glob, json, os, re, sys

BOOKS = [  # (USFM code, name, slug)
    ("GEN", "Genesis"), ("EXO", "Exodus"), ("LEV", "Leviticus"), ("NUM", "Numbers"),
    ("DEU", "Deuteronomy"), ("JOS", "Joshua"), ("JDG", "Judges"), ("RUT", "Ruth"),
    ("1SA", "1 Samuel"), ("2SA", "2 Samuel"), ("1KI", "1 Kings"), ("2KI", "2 Kings"),
    ("1CH", "1 Chronicles"), ("2CH", "2 Chronicles"), ("EZR", "Ezra"), ("NEH", "Nehemiah"),
    ("EST", "Esther"), ("JOB", "Job"), ("PSA", "Psalms"), ("PRO", "Proverbs"),
    ("ECC", "Ecclesiastes"), ("SNG", "Song of Solomon"), ("ISA", "Isaiah"), ("JER", "Jeremiah"),
    ("LAM", "Lamentations"), ("EZK", "Ezekiel"), ("DAN", "Daniel"), ("HOS", "Hosea"),
    ("JOL", "Joel"), ("AMO", "Amos"), ("OBA", "Obadiah"), ("JON", "Jonah"),
    ("MIC", "Micah"), ("NAM", "Nahum"), ("HAB", "Habakkuk"), ("ZEP", "Zephaniah"),
    ("HAG", "Haggai"), ("ZEC", "Zechariah"), ("MAL", "Malachi"),
    ("MAT", "Matthew"), ("MRK", "Mark"), ("LUK", "Luke"), ("JHN", "John"),
    ("ACT", "Acts"), ("ROM", "Romans"), ("1CO", "1 Corinthians"), ("2CO", "2 Corinthians"),
    ("GAL", "Galatians"), ("EPH", "Ephesians"), ("PHP", "Philippians"), ("COL", "Colossians"),
    ("1TH", "1 Thessalonians"), ("2TH", "2 Thessalonians"), ("1TI", "1 Timothy"),
    ("2TI", "2 Timothy"), ("TIT", "Titus"), ("PHM", "Philemon"), ("HEB", "Hebrews"),
    ("JAS", "James"), ("1PE", "1 Peter"), ("2PE", "2 Peter"), ("1JN", "1 John"),
    ("2JN", "2 John"), ("3JN", "3 John"), ("JUD", "Jude"), ("REV", "Revelation"),
]


def slug(name):
    return name.lower().replace(" ", "")  # "1 john" -> "1john"; "song of solomon" -> "songofsolomon"


def clean(t):
    t = re.sub(r"\\f .*?\\f\*", "", t, flags=re.S)        # footnotes
    t = re.sub(r"\\x .*?\\x\*", "", t, flags=re.S)        # cross references
    t = re.sub(r'\\\+?w ([^|\\]*)\|[^\\]*\\\+?w\*', r"\1", t)  # \w word|strong=".."\w*
    t = re.sub(r"\\[a-z]+\d?\*?", "", t)                  # remaining markers (\nd, \add, \qs...)
    return re.sub(r"\s+", " ", t).strip()


def parse(path):
    chapters, ch, vs = [], 0, 0
    for line in open(path, encoding="utf-8-sig"):
        line = line.rstrip("\n")
        m = re.match(r"\\c (\d+)", line)
        if m:
            ch = int(m.group(1))
            while len(chapters) < ch:
                chapters.append([])
            vs = 0
            continue
        if not ch or re.match(r"\\(s\d?|ms\d?|mr|r|d|sp|b|rem)\b", line):
            continue  # headings / psalm superscriptions kept out of verse text
        m = re.match(r"\\v (\d+)(?:-\d+)?\s*(.*)", line)
        if m:
            vs = int(m.group(1))
            while len(chapters[ch - 1]) < vs:
                chapters[ch - 1].append("")
            chapters[ch - 1][vs - 1] = m.group(2)
        elif vs:
            chapters[ch - 1][vs - 1] += " " + line  # continuation (poetry \q lines etc.)
    return [[clean(v) for v in c] for c in chapters]


def main(tr, src):
    out = os.path.join(os.path.dirname(__file__), "..", "assets", "bible", tr)
    os.makedirs(out, exist_ok=True)
    meta, nv = [], 0
    for code, name in BOOKS:
        files = glob.glob(os.path.join(src, f"*-{code}*.usfm"))
        if len(files) != 1:
            sys.exit(f"{code}: expected 1 file, found {files}")
        chs = parse(files[0])
        nv += sum(1 for c in chs for v in c if v)
        json.dump({"n": name, "c": chs}, open(os.path.join(out, slug(name) + ".json"), "w"),
                  ensure_ascii=False, separators=(",", ":"))
        meta.append({"n": name, "s": slug(name), "ch": len(chs)})
    json.dump(meta, open(os.path.join(out, "books.json"), "w"), separators=(",", ":"))
    print(f"{tr}: {len(meta)} books, {sum(b['ch'] for b in meta)} chapters, {nv} verses")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
