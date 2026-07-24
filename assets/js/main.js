(() => {
  const path = location.pathname.replace(/\\/g, '/');
  const inNested = path.includes('/flows/') || path.includes('/blogs/');
  const base = inNested ? '../' : '';
  const iconInstagram = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></svg>`;
  const header = `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="site-header">
      <div class="container nav-wrap">
        <a class="brand" href="${base}index.html" aria-label="Real Estate WhatsApp Flow Builder home">
          <img src="${base}assets/images/logo.svg" alt="" width="40" height="40">
          <span class="brand-text">Real Estate Flow <small>WhatsApp Builder</small></span>
        </a>
        <nav class="nav-links" id="primary-navigation" aria-label="Primary navigation">
          <a href="${base}index.html">Home</a><a href="${base}template-maker.html">Template Maker</a><a href="${base}chat-flows.html">Chat Flows</a><a href="${base}premium-templates.html">Templates</a><a href="${base}lead-manager.html">Leads</a><a href="${base}blog.html">Blog</a><a href="${base}about.html">About</a><a href="${base}contact.html">Contact</a>
        </nav>
        <div class="nav-actions">
          <a class="instagram-link" href="https://instagram.com/jitendrauno" target="_blank" rel="noopener" aria-label="Follow @JITENDRAUNO on Instagram">${iconInstagram}</a>
          <a class="btn btn-whatsapp btn-sm" href="${base}template-maker.html">Create Template</a>
          <button class="menu-toggle" type="button" aria-controls="primary-navigation" aria-expanded="false" aria-label="Open menu"><span></span><span></span><span></span></button>
        </div>
      </div>
    </header>`;
  const footer = `
    <footer class="site-footer">
      <div class="container footer-main">
        <div class="footer-brand"><a class="brand" href="${base}index.html"><img src="${base}assets/images/logo.svg" alt="" width="40" height="40"><span class="brand-text">Real Estate Flow <small>WhatsApp Builder</small></span></a><p>Create professional property messages and lead-conversion flows without complicated software.</p><div class="social-row"><a href="https://instagram.com/jitendrauno" target="_blank" rel="noopener" aria-label="Instagram">${iconInstagram}</a></div></div>
        <div class="footer-col"><h3>Template Tools</h3><a href="${base}template-maker.html">Template Maker</a><a href="${base}premium-templates.html">All Templates</a><a href="${base}lead-manager.html">Lead Manager</a><a href="${base}flows/lead-qualification.html">Lead Qualification</a><a href="${base}flows/site-visit-booking.html">Site Visit Flow</a></div>
        <div class="footer-col"><h3>Chat Flows</h3><a href="${base}flows/property-recommendation.html">Property Recommendation</a><a href="${base}flows/booking-confirmation.html">Booking Confirmation</a><a href="${base}flows/home-loan.html">Home Loan</a><a href="${base}flows/customer-support.html">Customer Support</a></div>
        <div class="footer-col"><h3>Connect</h3><a href="${base}blog.html">Blog</a><a href="${base}about.html">About</a><a href="${base}contact.html">Contact</a><a href="${base}privacy-policy.html">Privacy Policy</a><a href="${base}disclaimer.html">Disclaimer</a><a href="https://instagram.com/jitendrauno" target="_blank" rel="noopener">@JITENDRAUNO</a></div>
      </div>
      <div class="container footer-bottom"><p>© <span data-year></span> Real Estate WhatsApp Flow Builder. All rights reserved.</p><p>Created by Jitendra Kumar · <a href="https://instagram.com/jitendrauno" target="_blank" rel="noopener">@JITENDRAUNO</a></p></div>
    </footer>`;
  document.querySelectorAll('[data-site-header]').forEach(el => el.outerHTML = header);
  document.querySelectorAll('[data-site-footer]').forEach(el => el.outerHTML = footer);
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  const nav = document.querySelector('.nav-links'); const toggle = document.querySelector('.menu-toggle');
  const closeMenu = () => { if(!nav || !toggle) return; nav.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); toggle.setAttribute('aria-label','Open menu'); document.body.classList.remove('menu-open'); };
  toggle?.addEventListener('click', () => { const open = !nav.classList.contains('open'); nav.classList.toggle('open',open); toggle.setAttribute('aria-expanded',String(open)); toggle.setAttribute('aria-label',open?'Close menu':'Open menu'); document.body.classList.toggle('menu-open',open); });
  nav?.querySelectorAll('a').forEach(a => { const href = a.getAttribute('href')?.replace('../',''); const current = path.endsWith('/'+href) || (!path.includes('/') && path===href); if(current) a.setAttribute('aria-current','page'); a.addEventListener('click',closeMenu); });
  addEventListener('resize', () => { if(innerWidth>1040) closeMenu(); });
  addEventListener('keydown', e => { if(e.key==='Escape') closeMenu(); });
})();