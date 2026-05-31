# Saatvika Family Clinic Website

This repository contains the static website for Saatvika Family Clinic — a neighbourhood
primary care clinic in BTM Layout, Bengaluru. The site is a small static HTML/CSS/JS
project suitable for hosting on platforms like Vercel or GitHub Pages.

## Contents

- `index.html` — main HTML file
- `styles.css` — site styles
- `script.js` — client-side interactions
- `vercel.json` — Vercel deployment configuration
- `.vercelignore` — files excluded from Vercel uploads

## Local development

Simply open `index.html` in a browser. For a basic local server you can use Python:

```bash
# Python 3
python -m http.server 8000
# then open http://localhost:8000
```

## Deployment

This project includes `vercel.json` and a short deployment README (`README-vercel.md`).
To deploy with the Vercel CLI:

```bash
npm i -g vercel
vercel login
vercel --prod
```

Alternatively, connect this repository to the Vercel dashboard and enable automatic
deployments from the `main` branch.

## License

This repository does not include a license file. Add a `LICENSE` if you want to
explicitly set reuse terms.

