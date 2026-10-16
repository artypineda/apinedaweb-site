# apinedaweb.com

Static rebuild of the Art Pineda Web portfolio, served by GitHub Pages straight from this repo's `main` branch.

- `data/projects.json`, `data/about.json`: site content
- `build.mjs`: generates `index.html`, `projects/`, `contact/` and `404.html` from the data (no dependencies)
- `site.css`, `site.js`, `imgs/`, `apw/`: hand-written styles, scripts and images

## Making changes

- **CSS, JS or images:** edit, commit, push.
- **Projects or About text:** edit `data/*.json`, run `node build.mjs`, then commit and push. Put new project images in `apw/`.

Preview locally:

```bash
python3 -m http.server 8000
```
