# SafeLine VPN Landing

## Project shape

- Static landing page built with plain HTML, CSS, and JavaScript.
- Keep the browser payload small. Do not add a framework or runtime dependency unless the requested behavior clearly needs one.
- The production URL is `https://skay1992.github.io/safeline-vpn-landing/`.

## Local run

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/`.

## Verification

Fast deterministic check that does not require npm:

```bash
python3 scripts/check_site.py
```

Full quality check after installing project dependencies with Node.js 24.8 or newer:

```bash
npm install
npm run check
```

After any UI change, verify the page in a real browser at desktop and mobile widths. At minimum, check the mobile menu, internal navigation, placeholder status message, keyboard focus, and reduced-motion behavior.

## Editing agreements

- Preserve semantic HTML and accessible names.
- Keep `prefers-reduced-motion` support for animations.
- Update Playwright tests when user-visible behavior changes.
- Keep GitHub Pages URLs in `index.html`, `robots.txt`, and `sitemap.xml` synchronized.
