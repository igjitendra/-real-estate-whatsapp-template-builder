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
