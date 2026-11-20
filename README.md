# Vice Sunset Cover Lab

A GTA 6 style cover maker for the make.fun bounty `gta6-cover-art-01`.
Single offline app, no network requests, no library.

## What it does

- Upload 1 to 3 photos, or use the built-in drawn sunset scene (no photo needed).
- 3 layouts: Classic grid (3 panels), Single hero, Split duo (2 photos).
- 4 colour grades: Vice Sunset, Neon Night, Palm Gold, Mono Noir, with
  grade, vignette and grain sliders.
- Editable title, subtitle and corner badge.
- Export PNG in 1080x1080, 1080x1350 or 1920x1080.

All art is original: gradients, shapes and lettering drawn in code.
No Rockstar logo, official artwork or official font is used.
Photos you upload stay in your browser.

## Run it

```
node serve.ts
```

Then open http://localhost:8080

## Hand it in

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and
writes `dossier.json` with the vendored make.fun library
(`vendor/makefun-app.ts`, copied from the kit unchanged).

## Screenshots

`shots.json` lists the three screenshots in `screenshots/`. The first
by name is the cover. They were taken with Playwright Chromium against
the local server, waiting for `window.__shotReady`.

## Files

- `main.ts` - hand-in program
- `serve.ts` - local static server for development
- `app/index.html` - page
- `app/style.css` - styles
- `app/src/cover.js` - cover drawing (layouts, grades, sunset scene)
- `app/src/main.js` - page wiring (upload, controls, export)
- `app/src/shots.js` - fixed scenes for screenshots
- `app/samples/boulevard.jpg`, `app/samples/pier.jpg` - kit starter
  samples, free to use
