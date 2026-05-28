# akashverse — thinking out loud

Personal site + learning journal of **Akash Gupta** — Software Engineer @ Pegasystems.

Live at: **https://AkashGuptaPractice.github.io/akashverse-thinking-out-loud/**

## Structure
```
index.html              # landing page (about, journey, learnings, contact)
assets/
  style.css             # site styles
  app.js                # loads posts/index.json and renders the Learnings list
posts/
  index.json            # post registry — title, file, date, summary, tags
  <slug>.html           # self-contained post (HTML + inline CSS/JS)
```

## Adding a new post
1. Drop the post's HTML file into `posts/` (e.g. `posts/my-new-post.html`).
2. Add an entry to `posts/index.json`:
   ```json
   {
     "title": "My New Post",
     "file": "my-new-post.html",
     "date": "2026-06-01",
     "summary": "One-line hook.",
     "tags": ["Tag1", "Tag2"]
   }
   ```
3. Commit + push. GitHub Pages auto-deploys.

## Local preview
```bash
python3 -m http.server 8000
# open http://localhost:8000
```
A real server is required — `fetch()` for `posts/index.json` won't work over `file://`.

