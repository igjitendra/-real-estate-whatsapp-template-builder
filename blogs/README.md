# Adding a new blog post

1. Copy `blog-template.html`.
2. Rename it to a lowercase hyphenated slug, for example `real-estate-whatsapp-buttons.html`.
3. Replace title, description, canonical URL, category, date, reading time, cover image and article content.
4. Add the post metadata to `data/posts.json` and `data/posts.js`.
5. Upload cover artwork to `assets/images/`.
6. Run the site final QA and add the new URL to sitemap.xml and feed.xml.

CSS stays in `assets/css/blog.css`; article behavior stays in `assets/js/blog.js`. Do not paste page-specific CSS or JavaScript into each article unless required.

## One-command index update
After uploading a new HTML article into this folder, run:

```bash
python3 blogs/rebuild-index.py
```

The script scans blog HTML files and updates `data/posts.json`, `data/posts.js`, `feed.xml`, and the website sitemap. A static browser cannot automatically discover new files without this build step.
