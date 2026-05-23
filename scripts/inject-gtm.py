#!/usr/bin/env python3
"""Inject Google Tag Manager snippets into static HTML files."""

from __future__ import annotations

import re
import sys
from pathlib import Path

GTM_ID = "GTM-MCVF7CQJ"

HEAD_SNIPPET = f"""<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){{w[l]=w[l]||[];w[l].push({{'gtm.start':
new Date().getTime(),event:'gtm.js'}});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
}})(window,document,'script','dataLayer','{GTM_ID}');</script>
<!-- End Google Tag Manager -->"""

BODY_SNIPPET = f"""<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id={GTM_ID}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->"""

GTM_MARKER = GTM_ID


def inject_gtm(html: str) -> str:
    if GTM_MARKER in html:
        return html

    head_match = re.search(r"(<head[^>]*>)", html, re.IGNORECASE)
    if not head_match:
        raise ValueError("No <head> tag found")

    html = html[: head_match.end()] + "\n" + HEAD_SNIPPET + html[head_match.end() :]

    body_match = re.search(r"(<body[^>]*>)", html, re.IGNORECASE)
    if not body_match:
        raise ValueError("No <body> tag found")

    html = html[: body_match.end()] + "\n" + BODY_SNIPPET + html[body_match.end() :]
    return html


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    targets = sorted(root.glob("public/**/*.html"))
    updated = 0

    for path in targets:
        original = path.read_text(encoding="utf-8")
        if GTM_MARKER in original:
            continue
        path.write_text(inject_gtm(original), encoding="utf-8")
        updated += 1
        print(f"updated {path.relative_to(root)}")

    print(f"Done. Updated {updated} file(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
