# Deka Lash Franklin Lakes — Prototype

A mockup landing page that replicates the [Zoca demo template](https://dekalash-demo.zoca.com/)
structure, filled with real content from the **Deka Lash Franklin Lakes** studio pages.

## Run it

**With Deno** (matches the folder name):
```bash
deno run -A server.ts      # → http://localhost:8000
```

**Or any static server**, e.g.:
```bash
python3 -m http.server 8000   # → http://localhost:8000
```

Or just open `index.html` directly in a browser.

## Files
- `index.html` — page markup (all sections + booking modal)
- `styles.css` — Deka Lash branding (magenta #C800A1, Lato + Avenir, flat rectangular buttons)
- `script.js` — booking-modal wizard, image fallbacks, mobile nav
- `server.ts` — tiny Deno static server
- `assets/deka-lash-logo.png` — official Deka Lash wordmark

## Brand
- Colors: magenta `#C800A1`, ink/black, grey, white — matched to dekalash.com
- Fonts: **Lato** (headings + body), **Avenir** (nav, buttons, labels) with Montserrat fallback
- Buttons: flat, rectangular, uppercase — per the live site

## Next step: embedded booking
The reserved slot for the live booking widget is the
`#booking` / `.embed-slot` block near the top of `index.html`
(marked "EMBEDDED BOOKING EXPERIENCE"). Drop the booking flow in there.

## Content sourced from
- https://dekalash.com/find-a-studio/new-jersey/franklin-lakes/
- https://dekalash.com/find-a-studio/new-jersey/franklin-lakes/services/

Studio: 794 Franklin Ave, Franklin Lakes, NJ 07417 · (201) 735-8451 · franklinlakes@dekalash.com

> Images use Unsplash placeholders (lash/beauty) with on-brand gradient fallbacks.
> Swap in real Deka Lash photography for the final version.
