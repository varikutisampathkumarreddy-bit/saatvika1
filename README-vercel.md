# Deploying to Vercel

Quick steps to deploy this static site to Vercel:

1. Install the Vercel CLI (optional):

```bash
npm i -g vercel
```

2. Login and deploy:

```bash
vercel login
vercel --prod
```

Or connect this GitHub repository in the Vercel dashboard and enable automatic deployments from the `main` branch.

Notes:
- `vercel.json` config uses `@vercel/static` to serve `index.html` and routes all paths to the SPA entry.
- `.vercelignore` excludes local files from upload to speed up deployments.
