#!/usr/bin/env python3
"""Submit the local document to the W3C Nu validator."""

from __future__ import annotations

import json
import sys
from pathlib import Path
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
HTML_PATHS = sorted(ROOT.glob("*.html")) + sorted((ROOT / "account").glob("*.html"))

all_errors = []

for html_path in HTML_PATHS:
    request = Request(
        "https://validator.w3.org/nu/?out=json",
        data=html_path.read_bytes(),
        headers={
            "Content-Type": "text/html; charset=utf-8",
            "User-Agent": "SafeLine-VPN-quality-check/1.0",
        },
    )

    with urlopen(request, timeout=30) as response:
        report = json.load(response)

    for error in (message for message in report["messages"] if message["type"] == "error"):
        all_errors.append((html_path.relative_to(ROOT), error))

if all_errors:
    print("W3C validation failed:")
    for relative_path, error in all_errors:
        print(
            f'- {relative_path}: line {error.get("lastLine", "?")}: '
            f'{error["message"]}'
        )
    sys.exit(1)

print(f"W3C validation passed with no errors in {len(HTML_PATHS)} documents.")
