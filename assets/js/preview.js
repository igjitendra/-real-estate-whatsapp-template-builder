(() => {
  'use strict';
  const api=window.REWFB, editor=document.querySelector('.message-area'), panel=document.querySelector('.preview-panel');
  if(!api||!editor||!panel)return;
  const tokenPattern=()=>new RegExp(String.fromCharCode(123,123)+'([A-Za-z][A-Za-z0-9]*)'+String.fromCharCode(125,125),'g');
  const idMap={CustomerName:'customerName',CustomerPhone:'customerPhone',LeadSource:'leadSource',AgentName:'agentName',CompanyName:'companyName',CompanyPhone:'companyPhone',CompanyEmail:'businessEmail',CompanyWebsite:'businessWebsite',OfficeAddress:'officeAddress',WhatsAppNumber:'whatsappNumber',RERANumber:'reraNumber',ProjectName:'projectName',PropertyType:'propertyType',Location:'location',Configuration:'configuration',Size:'propertySize',Price:'startingPrice',PossessionStatus:'possessionStatus',Amenities:'amenities',BrochureLink:'brochureUrl',VideoLink:'videoUrl',MapLink:'mapUrl',BuyingPurpose:'buyingPurpose',Budget:'budget',PurchaseTimeline:'purchaseTimeline',PaymentMethod:'paymentMethod',LeadStatus:'leadStatus',ConsultantName:'assignedConsultant',ConsultantPhone:'consultantPhone',VisitDate:'visitDate',VisitTime:'visitTime',VisitorCount:'visitorCount',PaymentLink:'paymentLink',BookingAmount:'bookingAmount'};
  const quickReplies={
    'Welcome Message':['Price & availability','View brochure','Book site visit','Speak to expert'],
    'Lead Qualification':['Self-use','Investment','Not decided'],
    'Requirement Confirmation':['Confirm details','Edit requirement','Talk to expert'],
    'Property Recommendation':['View brochure','Open location','Watch video','Book site visit'],
    'Site Visit Booking':['Physical visit','Video tour','Choose date','Call me'],
    'Follow-Up':['Still interested','Share details','Call later','Stop messages'],
    'Payment Reminder':['Payment done','Need help','Call accounts'],
    'Booking Confirmation':['View next steps','Call consultant'],
    'Project Launch':['Send brochure','Priority callback','Book visit'],
    'Festive Offer':['View offer','Check eligibility','Book visit'],
    'Customer Support':['Payment issue','Documents','Possession','Human support'],
    'Custom Template':['Yes, please','Tell me more','Call me']
  };
  const customerReplies={
    'Welcome Message':'I’d like to check the price and availability.',
    'Lead Qualification':'I’m looking for a 2 BHK for self-use within 30 days.',
    'Requirement Confirmation':'Yes, these details are correct.',
    'Property Recommendation':'Please share the brochure and location.',
    'Site Visit Booking':'I prefer a physical visit this weekend.',
    'Follow-Up':'Yes, I’m still interested. Please call me.',
    'Payment Reminder':'Payment is completed. Please confirm.',
    'Booking Confirmation':'Thank you. Please share the next steps.',
    'Project Launch':'Please arrange a priority callback.',
    'Festive Offer':'Which units are eligible for this offer?',
    'Customer Support':'I need help with my booking documents.',
    'Custom Template':'Thank you. Please share more information.'
  };
  const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
  const safeUrl=value=>{try{const url=new URL(value);return ['http:','https:'].includes(url.protocol)?url.href:''}catch{return''}};
  const getValues=()=>Object.fromEntries(Object.entries(idMap).map(([key,id])=>{const el=document.getElementById(id);let value=el?.value?.trim()||'';if(key==='VisitDate'&&value)value=new Date(value+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});if(key==='VisitTime'&&value)value=new Date('1970-01-01T'+value).toLocaleTimeString('en-IN',{hour:'numeric',minute:'2-digit'});return[key,value]}));
  const formatMessage=value=>{
    let html=esc(value).replace(/\*([^*\n]+)\*/g,'<strong>$1</strong>').replace(/_([^_\n]+)_/g,'<em>$1</em>');
    return html.replace(/(^|\n)([•-])\s/g,'$1<span class="preview-bullet">•</span> ').replace(/\n/g,'<br>');
  };
  const now=()=>new Intl.DateTimeFormat('en-IN',{hour:'numeric',minute:'2-digit'}).format(new Date());
  const initials=name=>(String(name||'Real Estate').trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('')||'RE').toUpperCase();
  const create=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node};
  const addMessage=(chat,html,out=false)=>{const bubble=create('div','wa-bubble'+(out?' out':''));const p=create('p');p.innerHTML=html;bubble.append(p);const time=create('time');time.innerHTML=`${esc(now())} <span class="ticks">✓✓</span>`;bubble.append(time);chat.append(bubble);return bubble};
  const renderAttachments=(chat,values,category)=>{
    const items=[];
    const brochure=safeUrl(values.BrochureLink),video=safeUrl(values.VideoLink),map=safeUrl(values.MapLink);
    if(brochure)items.push({type:'PDF',title:'Project brochure',meta:'Document · Secure link',url:brochure,icon:'▤'});
    if(video)items.push({type:'VIDEO',title:'Project walkthrough',meta:'Video link',url:video,icon:'▶'});
    if(map)items.push({type:'MAP',title:values.Location||'Project location',meta:'Open in Google Maps',url:map,icon:'⌖'});
    if(!items.length&&category==='Property Recommendation')items.push({type:'PDF',title:'Project brochure',meta:'Add a brochure URL to activate',url:'',icon:'▤'});
    items.forEach(item=>{const card=create(item.url?'a':'div','wa-attachment');if(item.url){card.href=item.url;card.target='_blank';card.rel='noopener'}const icon=create('span','attachment-icon',item.icon);const copy=create('span','attachment-copy');copy.append(create('strong','',item.title),create('small','',item.meta));card.append(icon,copy,create('span','attachment-type',item.type));chat.append(card)});
  };
  const renderQuickReplies=(chat,category)=>{const replies=quickReplies[category]||quickReplies['Custom Template'];const grid=create('div','wa-quick dynamic-quick');replies.slice(0,4).forEach(label=>{const b=create('button','',label);b.type='button';b.addEventListener('click',()=>{const reply=panel.querySelector('.wa-bubble.out p');if(reply)reply.textContent=label;flashSynced()});grid.append(b)});chat.append(grid)};
  let syncTimer;
  const flashSynced=()=>{const badge=panel.querySelector('[data-preview-sync]');if(!badge)return;badge.textContent='Synced';badge.classList.add('synced');clearTimeout(syncTimer);syncTimer=setTimeout(()=>badge.classList.remove('synced'),700)};
  const render=()=>{
    const values=getValues(),category=document.getElementById('templateCategory')?.value||'Custom Template';
    const resolved=api.substitute(editor.value,values,{keepUnknown:true});
    const company=values.CompanyName||values.AgentName||'Real Estate Advisor';
    panel.querySelector('[data-preview-company]').textContent=company;
    panel.querySelector('[data-preview-status]').textContent=values.AgentName?`${values.AgentName} · online`:'online';
    const avatar=panel.querySelector('[data-preview-avatar]');avatar.textContent=initials(company);
    const logo=safeUrl(document.getElementById('logoUrl')?.value||'');
    avatar.style.backgroundImage=logo?`url("${logo.replace(/["\\]/g,'')}")`:'';avatar.classList.toggle('has-logo',Boolean(logo));
    const chat=panel.querySelector('[data-preview-chat]');chat.innerHTML='';
    const date=create('div','wa-date','TODAY');chat.append(date);
    addMessage(chat,formatMessage(resolved||'Start typing to preview your WhatsApp message.'));
    renderAttachments(chat,values,category);renderQuickReplies(chat,category);
    addMessage(chat,esc(customerReplies[category]||customerReplies['Custom Template']),true);
    const unresolved=[...resolved.matchAll(tokenPattern())].length;
    const status=panel.querySelector('[data-preview-warning]');
    status.innerHTML=unresolved?`<i>⚠</i><span>${unresolved} variable${unresolved===1?' is':'s are'} missing. Add values before sharing.</span>`:'<i>✓</i><span>All message variables are resolved in this preview.</span>';
    status.classList.toggle('ready',!unresolved);flashSynced();
  };
  const schedule=()=>{const badge=panel.querySelector('[data-preview-sync]');if(badge)badge.textContent='Updating…';cancelAnimationFrame(schedule.frame);schedule.frame=requestAnimationFrame(render)};

  document.querySelector('.builder-workspace')?.addEventListener('input',schedule);
  document.querySelector('.builder-workspace')?.addEventListener('change',schedule);
  document.querySelectorAll('[data-device]').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('[data-device]').forEach(item=>{item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button))});
    panel.classList.toggle('desktop-view',button.dataset.device==='desktop');panel.querySelector('.wa-phone').style.maxWidth='';
  }));
  document.querySelectorAll('[data-theme]').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('[data-theme]').forEach(item=>{item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button))});
    panel.classList.toggle('dark-preview',button.dataset.theme==='dark');panel.querySelector('.preview-canvas').style.filter='';
  }));
  panel.addEventListener('click',event=>{if(event.target.closest('.composer-send')){const bubble=addMessage(panel.querySelector('[data-preview-chat]'),esc('Thanks! A consultant will contact you shortly.'),true);bubble.scrollIntoView({behavior:'smooth',block:'nearest'})}});
  render();
})();