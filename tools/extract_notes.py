#!/usr/bin/env python3
"""Extract summary, key takeaways and transcript from the sermon PDFs into data/notes/<slug>.json."""
import glob, json, os, re, subprocess, sys

ARCHIVE = os.environ["SERMON_MEDIA"]  # folder with the sermon PDFs
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
END = re.compile(r"[.?!\"”')\]]$|\*\*$")


def lines_of(pdf):
    out = subprocess.run(["pdftotext", pdf, "-"], capture_output=True, text=True, check=True).stdout
    return [l.replace("\f", "").rstrip() for l in out.split("\n")]


def paragraphs(lines, width):
    """Join hard-wrapped lines; a line well short of the wrap width ends a paragraph."""
    paras, cur = [], []
    for l in lines:
        if not l.strip():
            if cur:
                paras.append(" ".join(cur)); cur = []
            continue
        cur.append(l.strip())
        if len(l) < width * 0.85 and END.search(l.strip()):
            paras.append(" ".join(cur)); cur = []
    if cur:
        paras.append(" ".join(cur))
    return split_long(merge_lower(paras))


def merge_lower(paras):
    """A paragraph cannot start in lowercase: it continues the previous one."""
    out = []
    for p in paras:
        if out and re.match(r"[a-z]", p.lstrip("*")):
            out[-1] += " " + p
        else:
            out.append(p)
    return out


def split_long(paras, limit=1100, target=700):
    """Break very long paragraphs at sentence ends so they stay readable."""
    out = []
    for p in paras:
        while len(p) > limit:
            cut = p.rfind(". ", target - 150, target + 350)
            if cut >= 0:
                out.append(p[:cut + 1]); p = p[cut + 2:]
            else:  # unpunctuated transcript: break at a word boundary
                cut = p.rfind(" ", target, target + 200)
                if cut < 0:
                    break
                out.append(p[:cut]); p = p[cut + 1:]
        out.append(p)
    return out


def is_heading(prev_blank, l, nxt):
    s = l.strip()
    return prev_blank and 2 < len(s) < 70 and not re.search(r"[.,?!;\"”]$", s) and bool(nxt and nxt.strip())


def parse(pdf):
    ls = lines_of(pdf)
    lens = sorted(len(l) for l in ls if len(l) > 40)
    width = lens[int(len(lens) * 0.9)] if lens else 100
    idx = lambda pat, start=0: next((i for i in range(start, len(ls)) if re.fullmatch(pat, ls[i].strip(), re.I)), None)
    s, k = idx(r"summary"), idx(r"key takeaways")
    if s is None or k is None:
        return None
    t = idx(r"transcript", k)
    if t is None:  # no marker: transcript starts at the first heading after the takeaways block
        t = next((i for i in range(k + 2, len(ls) - 1) if not ls[i - 1].strip() and is_heading(True, ls[i], ls[i + 1])), len(ls))
    summary = paragraphs(ls[s + 1:k], width)
    take = paragraphs(ls[k + 1:t], width)
    body = ls[t + 1:] if re.fullmatch(r"transcript", ls[t].strip(), re.I) else ls[t:]
    secs, cur = [], {"h": "", "p": []}
    buf = []
    def flush():
        cur["p"].extend(paragraphs(buf, width)); buf.clear()
    for i, l in enumerate(body):
        prev_blank = i == 0 or not body[i - 1].strip()
        nxt = body[i + 1] if i + 1 < len(body) else ""
        if is_heading(prev_blank, l, nxt):
            flush()
            if cur["h"] or cur["p"]:
                secs.append(cur)
            cur = {"h": l.strip(), "p": []}
        else:
            buf.append(l)
    flush()
    if cur["h"] or cur["p"]:
        secs.append(cur)
    return {"summary": summary, "takeaways": take, "transcript": secs}


def main():
    os.makedirs(os.path.join(ROOT, "data", "notes"), exist_ok=True)
    for md in sorted(glob.glob(os.path.join(ROOT, "content", "sermons", "*.md"))):
        m = re.search(r'^notes_pdf: "/files/(.*)"', open(md).read(), re.M)
        if not m:
            continue
        slug = os.path.basename(md)[:-3]
        d = parse(os.path.join(ARCHIVE, m.group(1)))
        if d is None:
            print("skip (no summary/takeaways):", slug); continue
        json.dump(d, open(os.path.join(ROOT, "data", "notes", slug + ".json"), "w"), ensure_ascii=False, indent=1)
        print(slug, "summary", len(d["summary"]), "takeaways", len(d["takeaways"]), "sections", len(d["transcript"]),
              "paras", sum(len(x["p"]) for x in d["transcript"]))


if __name__ == "__main__":
    main()
