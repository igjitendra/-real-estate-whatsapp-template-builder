# Real Estate WhatsApp Flow Builder — Part 1

## Included
- Responsive foundation preview (`index.html`)
- Centralized design tokens and component styles
- Mobile/desktop navigation and shared footer injector
- Accessible keyboard interactions and reduced-motion support
- Complete manifest for all 33 flow pages (`data/routes.json`)
- SVG brand mark

## Preview
Open `index.html` in a browser. A local web server is preferred:

```bash
python3 -m http.server 8080
```

## Part boundaries
This package intentionally contains the foundation only. Homepage content, Template Maker, library, builder logic and individual flow pages belong to later parts.

## Brand tokens
- Navy `#0F172A`
- WhatsApp `#25D366`
- Dark green `#128C7E`
- Premium gold `#D4A72C`
- Canvas `#F8FAFC`
- Border `#E2E8F0`


## Part 2 — Homepage
- Conversion-focused hero and workflow visual
- Audience trust strip and six template categories
- Eight-stage flow collection preview
- Three-step usage guide
- Feature bento, industry use cases and popular templates
- Benefits, accessible FAQ and Instagram CTA
- Responsive desktop/tablet/390px layouts


## Part 3 — Data and content architecture
- `data/templates.json`: filter-ready multilingual template catalog
- `data/chat-flows.json`: all 33 flows with ordered typed steps
- `data/variables.json`: centralized dynamic variable dictionary and samples
- `data/data-manifest.json`: counts, version and privacy metadata
- `assets/js/templates.js`: offline-safe browser data API (`window.REWFB`)
- `tests/validate-data.py`: integrity, variable and flow-order validation

### Browser API examples
```js
REWFB.getTemplates({ categoryId: 'welcome', language: 'Hindi' });
REWFB.getFlows({ categoryId: 'appointments' });
REWFB.substitute(template.message, REWFB.getSampleValues());
```


## Part 4 — Template Maker UI
- Full desktop two-column editor and sticky WhatsApp preview
- Mobile-first stacked workspace with fixed action bar
- Template, business, customer, property, lead, appointment and payment forms
- Accessible collapsible field groups and completion indicator
- Message editor shell, formatting toolbar and counters
- Mobile/compact and light/dark preview controls
- Single Message and reserved Complete Chat Flow modes


## Part 5 — Message Editor and Variable Engine
- Category/language template auto-loading from the Part 3 catalog
- Cursor-aware dynamic variable picker with grouped search
- Variable status inspector, missing-value detection and resolved preview
- Bold, italic, bullet and emoji helpers
- Live character, word and 1,000-character part counters
- Editor undo/redo history, reset and duplicate actions
- Form-to-variable mapping for business, customer, property, lead and appointment fields


## Part 6 — Live WhatsApp Preview
- Real-time message and variable synchronization
- Dynamic company name, agent status, initials and optional logo URL
- Category-aware customer replies and quick-reply buttons
- Read ticks, current timestamps and browser conversation simulation
- Brochure, video and map attachment cards from verified HTTP(S) links
- Missing-variable status and live sync feedback
- Proper light/dark themes plus phone/desktop preview layouts
- Safe HTML escaping and protocol validation for user-provided content


## Part 7 — Save, Copy, Download and Import
- Browser-local draft creation, update and post-save autosave
- Saved Drafts manager with open, rename, duplicate, delete, search and clear-all
- Resolved message copy with missing-variable warnings
- TXT download and versioned JSON backup export
- Validated JSON import with 1 MB safety limit
- Print layout and user-triggered WhatsApp sharing
- Safe filenames, URL encoding, storage error handling and accessible toast feedback
- No automatic external transmission of form or draft data


## Part 10 — Template Library
- Searchable catalog of all 24 professional templates
- Category, language, length and property-type filters
- Featured, title and lead-stage sorting
- Browser-local favorites, copy action and WhatsApp-style preview
- Direct template handoff into Template Maker


## Part 11 — Chat Flow Directory
- Searchable directory of all 33 real estate chat flows
- Seven categories with stage, duration and sorting controls
- Step, action and variable previews with browser-local saved flows


## Part 12 — First 10 Flow Pages
- Complete responsive pages for flows 1–10
- Step-by-step expandable workflows and conversation previews
- Variable panels, copy controls, safety notes and launch checklists
- Previous/next navigation and direct builder actions


## Part 13 — Remaining 23 Flow Pages
- Complete responsive pages for flows 11–33
- All 33 directory routes now have detailed workflow content
- Expandable steps, previews, variables, safety notes and checklists
- Cross-flow navigation and direct builder actions


## Part 14 — SEO, Legal and Final QA
- Complete About, Contact, Privacy, Disclaimer and 404 pages
- Canonical, Open Graph, Twitter and JSON-LD metadata
- Sitemap, robots, manifest and deployment security headers
- Accessibility improvements and local-link validation
- Complete visual flow builder and logic simulator restored


## Approval-Ready Flow Upgrade
- All 33 flows rebuilt as copy-paste WhatsApp Business template journeys
- Quick Reply and CTA buttons with next-message mappings
- Named-variable and Meta-numbered-variable views
- Copy full step/flow, TXT and JSON exports, interactive click-path preview
- Approval checklists, samples, category guidance and compliance warnings


## Premium Template Category Pages
- Comprehensive premium Marketing, Utility and All Real Estate template pages
- Search, use-case filters, favorites, WhatsApp preview and Meta submission copy
- Clear Quick Replies, CTA buttons, named variables and numbered Meta variables
- Conversion-focused wording with consent, verification and non-guarantee safeguards


## Blog and Learning Center
- Root `blog.html` listing with search, categories, saved posts and reading progress
- Dedicated `blogs/` folder with separate CSS, JavaScript, images and data
- Two complete sample articles, reusable upload template, README and RSS feed
- Article TOC, reading progress, font controls, copy blocks, sharing, printing and feedback
