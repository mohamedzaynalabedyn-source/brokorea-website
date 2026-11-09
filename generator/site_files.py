"""Which repository files belong on the published website, and does the publishing setup match?

GitHub Pages builds this repository with Jekyll. Jekyll copies files without front matter unchanged
and leaves out what `_config.yml` excludes (plus dot-files and `_` files). This script:

  1. works out the files the website needs, by following every link, image, stylesheet, script,
     font, icon and manifest reference from the pages, plus a few entry points that browsers and
     search engines request directly (robots.txt, sitemap.xml, favicon.ico, the 404 page);
  2. works out what Jekyll will publish from the tracked files and the `exclude` list;
  3. reports the difference: a needed file that would not be published, or a published file
     that nothing needs (development tools, notes, backups, audit output...).

Run: python3 generator/site_files.py            (exit code 1 if anything is wrong)
     python3 generator/site_files.py --list     (also print the published files)
build.py runs the same check after writing the pages.
"""
import os, re, sys, subprocess, json, html, urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://brokorea.com"

# Requested directly by browsers, crawlers or GitHub Pages rather than linked from a page.
ENTRY_POINTS = ["CNAME", "404.html", "robots.txt", "sitemap.xml", "favicon.ico"]
# Public files that must ship with others although no page links to them: the font licences
# (SIL OFL requires the licence to travel with the fonts).
ALSO_PUBLIC = ["assets/fonts/OFL-NotoKufiArabic.txt", "assets/fonts/OFL-NotoSans.txt", "assets/fonts/OFL-NotoSansArabic.txt"]
ASSET_EXT = r"(?:html|css|js|png|jpe?g|webp|svg|ico|woff2?|webmanifest|xml|txt|json|pdf|zip)"


def tracked_files():
    out = subprocess.run(["git", "-C", ROOT, "ls-files", "-z"], capture_output=True, check=True).stdout
    return sorted(f for f in out.decode().split("\0") if f)


def local_path(ref, base_dir):
    """Map a reference found in a file to a repository path (None for external links)."""
    ref = html.unescape(ref.strip())
    if not ref or ref.startswith(("#", "mailto:", "tel:", "data:", "javascript:")):
        return None
    if ref.startswith(SITE + "/") or ref == SITE:
        ref = ref[len(SITE):] or "/"
    elif re.match(r"^[a-z][a-z0-9+.-]*:", ref, re.I) or ref.startswith("//"):
        return None                                   # another website
    ref = urllib.parse.unquote(ref.split("#")[0].split("?")[0])
    path = os.path.normpath(ref.lstrip("/") if ref.startswith("/") else os.path.join(base_dir, ref))
    if path in (".", ""):
        return "index.html"                           # the home page ("/", "./")
    if ref.endswith("/") or os.path.isdir(os.path.join(ROOT, path)):
        path = os.path.join(path, "index.html")       # a folder ("ar/") means its index page
    return path.replace(os.sep, "/")


def references(path):
    """Every local file referenced from one file."""
    full = os.path.join(ROOT, path)
    base = os.path.dirname(path)
    text = open(full, encoding="utf-8", errors="replace").read()
    refs = []
    if path.endswith((".html", ".xml")):
        for attr, val in re.findall(r'\s(href|src|srcset|content|data-thanks|action)="([^"]*)"', text):
            if attr == "srcset":
                refs += [part.strip().split(" ")[0] for part in val.split(",") if part.strip()]
            elif attr == "content":
                if val.startswith(SITE):
                    refs.append(val)
            else:
                refs.append(val)
        refs += re.findall(r'"(https://brokorea\.com/[^"]*)"', text)            # JSON-LD
        refs += re.findall(r"<loc>([^<]+)</loc>", text)                          # sitemap
    if path.endswith(".css"):
        refs += [u.strip("'\"") for u in re.findall(r"url\(([^)]+)\)", text)]
    if path.endswith(".webmanifest"):
        refs += [i["src"] for i in json.loads(text).get("icons", [])]
    if path.endswith(".js"):
        # files a script loads itself, written as a relative path in a string (e.g. vendor/gsap.min.js)
        refs += re.findall(r'["\']((?:[\w-]+/)*[\w.-]+\.' + ASSET_EXT + r')["\']', text)
    found = set()
    for r in refs:
        p = local_path(r, base)
        if p:
            found.add(p)
    return found


def required_files(tracked):
    pages = [f for f in tracked if f.endswith(".html") and not f.startswith(("generator/", "."))]
    todo = list(dict.fromkeys(pages + ENTRY_POINTS + ALSO_PUBLIC))
    need, missing = set(), {}
    while todo:
        f = todo.pop()
        if f in need:
            continue
        if not os.path.isfile(os.path.join(ROOT, f)):
            missing.setdefault(f, "referenced but missing")
            continue
        need.add(f)
        if f.endswith((".html", ".css", ".js", ".webmanifest", ".xml")):
            for r in references(f):
                if r not in need:
                    if not os.path.isfile(os.path.join(ROOT, r)):
                        missing.setdefault(r, f"referenced by {f}")
                    else:
                        todo.append(r)
    return need, missing


def jekyll_config_excludes():
    path = os.path.join(ROOT, "_config.yml")
    if not os.path.exists(path):
        return None
    items, inside = [], False
    for line in open(path, encoding="utf-8"):
        if re.match(r"^exclude\s*:", line):
            inside = True
            continue
        if inside:
            m = re.match(r"^\s+-\s*(.+?)\s*$", line.split(" #")[0])    # drop inline comments
            if m:
                items.append(m.group(1).strip("'\""))
            elif line.strip() and not line.startswith((" ", "#")):
                inside = False
    return items


def published_files(tracked):
    """What GitHub Pages' Jekyll build publishes from the tracked files (static files only)."""
    if os.path.exists(os.path.join(ROOT, ".nojekyll")):
        return [f for f in tracked if not f.startswith(".git/")]           # no Jekyll: everything
    excl = jekyll_config_excludes() or []
    def excluded(f):
        parts = f.split("/")
        if any(p.startswith((".", "_", "#")) or p.endswith("~") for p in parts):
            return True
        return any(f == e.rstrip("/") or f.startswith(e.rstrip("/") + "/") for e in excl)
    return [f for f in tracked if not excluded(f)]


def check(verbose=False):
    tracked = tracked_files()
    need, missing = required_files(tracked)
    published = set(published_files(tracked))
    problems = []
    for f, why in sorted(missing.items()):
        problems.append(f"MISSING  {f} ({why})")
    for f in sorted(need - published):
        problems.append(f"NOT PUBLISHED but needed: {f}")
    for f in sorted(published - need):
        problems.append(f"PUBLISHED but not needed: {f} (add it to exclude in _config.yml, or link it)")
    if verbose:
        for f in sorted(published):
            print("  " + f)
    print(f"site files: {len(need)} needed, {len(published)} published, {len(tracked) - len(published)} kept out of the website")
    for p in problems:
        print(p)
    return not problems


if __name__ == "__main__":
    sys.exit(0 if check("--list" in sys.argv) else 1)
