#!/usr/bin/env python3
"""Validate deterministic structural invariants for the static landing page."""

from __future__ import annotations

import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parents[1]
HTML_PATHS = sorted(ROOT.glob("*.html")) + sorted((ROOT / "account").glob("*.html"))


class SiteParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.elements: list[tuple[str, dict[str, str], int]] = []
        self.html_lang = ""
        self.h1_count = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = {name: value or "" for name, value in attrs}
        self.elements.append((tag, attributes, self.getpos()[0]))

        if tag == "html":
            self.html_lang = attributes.get("lang", "")
        elif tag == "h1":
            self.h1_count += 1


def local_path(value: str, document_path: Path) -> Path | None:
    parsed = urlsplit(value)
    if parsed.scheme or parsed.netloc or value.startswith(("#", "mailto:", "tel:")):
        return None

    if parsed.path.startswith("/"):
        return ROOT / parsed.path.lstrip("/")

    return (document_path.parent / (parsed.path or "index.html")).resolve()


def main() -> int:
    errors: list[str] = []
    element_count = 0
    id_count = 0

    for html_path in HTML_PATHS:
        parser = SiteParser()
        parser.feed(html_path.read_text(encoding="utf-8"))
        relative_path = html_path.relative_to(ROOT)
        prefix = f"{relative_path}:"

        ids = [
            attrs["id"]
            for _, attrs, _ in parser.elements
            if attrs.get("id")
        ]
        id_set = set(ids)
        element_count += len(parser.elements)
        id_count += len(ids)

        for element_id, count in Counter(ids).items():
            if count > 1:
                errors.append(f'{prefix} duplicate id "{element_id}"')

        if parser.html_lang != "ru":
            errors.append(f'{prefix} the document must declare lang="ru"')

        if parser.h1_count != 1:
            errors.append(f"{prefix} expected exactly one h1, found {parser.h1_count}")

        for tag, attrs, line in parser.elements:
            for attribute in ("href", "src"):
                value = attrs.get(attribute)
                if not value:
                    continue

                path = local_path(value, html_path)
                if path is not None and not path.exists():
                    errors.append(f"{prefix}{line}: missing local resource {value}")

            href = attrs.get("href", "")
            if href.startswith("#") and href != "#" and href[1:] not in id_set:
                errors.append(f'{prefix}{line}: href references missing id "{href[1:]}"')

            if href == "#" and not (
                attrs.get("data-scroll") or attrs.get("data-placeholder-message")
            ):
                errors.append(
                    f'{prefix}{line}: href="#" needs data-scroll or data-placeholder-message'
                )

            if attrs.get("target") == "_blank":
                rel_values = set(attrs.get("rel", "").split())
                missing = {"noopener", "noreferrer"} - rel_values
                if missing:
                    errors.append(
                        f"{prefix}{line}: target=_blank is missing rel values: "
                        + ", ".join(sorted(missing))
                    )

            for target_attribute in ("aria-controls", "aria-labelledby", "data-scroll"):
                target = attrs.get(target_attribute)
                if target and target not in id_set:
                    errors.append(
                        f'{prefix}{line}: {target_attribute} references missing id "{target}"'
                    )

            scroll_target = attrs.get("data-scroll")
            if scroll_target and href != f"#{scroll_target}":
                errors.append(
                    f'{prefix}{line}: data-scroll="{scroll_target}" '
                    f'must use href="#{scroll_target}" for no-JavaScript fallback'
                )

            if tag == "img":
                if "alt" not in attrs:
                    errors.append(f"{prefix}{line}: img is missing alt")
                if not attrs.get("width") or not attrs.get("height"):
                    errors.append(f"{prefix}{line}: img must declare width and height")

    if errors:
        print("Site checks failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print(
        f"Site checks passed: {len(HTML_PATHS)} documents, "
        f"{element_count} elements, {id_count} ids."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
