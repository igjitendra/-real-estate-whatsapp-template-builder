(() => {
  'use strict';
  const api = window.REWFB;
  const editor = document.querySelector('.message-area');
  const titleInput = document.querySelector('#messageTitle');
  const categorySelect = document.querySelector('#templateCategory');
  const languageSelect = document.querySelector('#templateLanguage');
  if (!api || !editor || !titleInput || !categorySelect || !languageSelect) return;

  const categoryMap = {
    'Welcome Message':'welcome','Lead Qualification':'lead-qualification','Requirement Confirmation':'requirement-confirmation',
    'Property Recommendation':'property-recommendation','Site Visit Booking':'site-visit','Follow-Up':'follow-up',
    'Payment Reminder':'payment-reminder','Booking Confirmation':'booking-confirmation','Project Launch':'project-launch',
    'Festive Offer':'festive-offer','Customer Support':'customer-support','Custom Template':'custom'
  };
  const inputMap = {
    CustomerName:'customerName',CustomerPhone:'customerPhone',LeadSource:'leadSource',AgentName:'agentName',
    CompanyName:'companyName',CompanyPhone:'companyPhone',CompanyEmail:'businessEmail',CompanyWebsite:'businessWebsite',
    OfficeAddress:'officeAddress',WhatsAppNumber:'whatsappNumber',RERANumber:'reraNumber',ProjectName:'projectName',
    PropertyType:'propertyType',Location:'location',Configuration:'configuration',Size:'propertySize',Price:'startingPrice',
    PossessionStatus:'possessionStatus',Amenities:'amenities',BrochureLink:'brochureUrl',VideoLink:'videoUrl',MapLink:'mapUrl',
    BuyingPurpose:'buyingPurpose',Budget:'budget',PurchaseTimeline:'purchaseTimeline',PaymentMethod:'paymentMethod',
    LeadStatus:'leadStatus',ConsultantName:'assignedConsultant',ConsultantPhone:'consultantPhone',VisitDate:'visitDate',
    VisitTime:'visitTime',VisitorCount:'visitorCount',PaymentLink:'paymentLink',BookingAmount:'bookingAmount'
  };
  const tokenPattern = () => new RegExp(String.fromCharCode(123,123) + '([A-Za-z][A-Za-z0-9]*)' + String.fromCharCode(125,125), 'g');
  const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
  const state = { base:null, dirty:false, history:[], index:-1, timer:null };

  const editorBlock = document.querySelector('.editor-block');
  const inspector = document.createElement('div');
  inspector.className = 'variable-inspector';
  inspector.innerHTML = `<div class="inspector-head"><div><strong>Dynamic variables</strong><span data-variable-summary>No variables detected</span></div><button type="button" class="inspector-toggle" aria-expanded="true">Hide</button></div><div class="inspector-body"><div class="detected-variables" data-detected-variables></div><div class="resolved-box"><div class="resolved-label"><span>Resolved message preview</span><small>Values are only previewed; tokens stay reusable.</small></div><div class="resolved-message" data-resolved-message></div></div></div>`;
  editorBlock.insertAdjacentElement('afterend', inspector);

  const dialog = document.createElement('dialog');
  dialog.className = 'variable-dialog';
  dialog.setAttribute('aria-labelledby','variable-dialog-title');
  dialog.innerHTML = `<div class="dialog-head"><div><span class="eyebrow">Dynamic content</span><h2 id="variable-dialog-title">Insert a variable</h2><p>Choose a reusable field to insert at the cursor.</p></div><button type="button" class="dialog-close" aria-label="Close variable picker">×</button></div><div class="dialog-search"><input type="search" placeholder="Search variables…" aria-label="Search variables"></div><div class="variable-groups" data-variable-groups></div>`;
  document.body.append(dialog);

  const emojiMenu = document.createElement('div');
  emojiMenu.className = 'emoji-menu'; emojiMenu.hidden = true;
  emojiMenu.innerHTML = ['👋','😊','🏠','🏢','📍','📅','✅','✨','💰','📞','📄','🎉'].map(e=>`<button type="button" data-emoji="${e}" aria-label="Insert ${e}">${e}</button>`).join('');
  document.querySelector('.editor-head')?.append(emojiMenu);

  const getValues = () => Object.fromEntries(Object.entries(inputMap).map(([key,id]) => {
    const el=document.getElementById(id); let value=el?.value?.trim() || '';
    if (key==='VisitDate' && value) value=new Date(value+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});
    if (key==='VisitTime' && value) value=new Date('1970-01-01T'+value).toLocaleTimeString('en-IN',{hour:'numeric',minute:'2-digit'});
    return [key,value];
  }));
  const usedKeys = () => [...new Set([...editor.value.matchAll(tokenPattern())].map(m=>m[1]))];
  const insertAtCursor = text => {
    const start=editor.selectionStart, end=editor.selectionEnd;
    editor.setRangeText(text,start,end,'end'); editor.focus(); editor.dispatchEvent(new Event('input',{bubbles:true}));
  };
  const pushHistory = (force=false) => {
    const snapshot={message:editor.value,title:titleInput.value};
    const current=state.history[state.index];
    if (!force && current && current.message===snapshot.message && current.title===snapshot.title) return;
    state.history=state.history.slice(0,state.index+1); state.history.push(snapshot);
    if(state.history.length>60) state.history.shift(); state.index=state.history.length-1; updateUndoButtons();
  };
  const applyHistory = index => {
    const snapshot=state.history[index]; if(!snapshot) return;
    state.index=index; editor.value=snapshot.message; titleInput.value=snapshot.title; refresh(); updateUndoButtons();
  };
  const updateUndoButtons = () => {
    const undo=document.querySelector('[aria-label="Undo"]'), redo=document.querySelector('[aria-label="Redo"]');
    if(undo) undo.disabled=state.index<=0; if(redo) redo.disabled=state.index>=state.history.length-1;
  };
  const updateCounters = () => {
    const chars=editor.value.length;
    const words=(editor.value.trim().match(/\S+/g)||[]).length;
    const parts=Math.max(1,Math.ceil(chars/1000));
    const values=document.querySelectorAll('.counter-list strong');
    if(values[0]) values[0].textContent=chars.toLocaleString('en-IN');
    if(values[1]) values[1].textContent=words.toLocaleString('en-IN');
    if(values[2]) values[2].textContent=parts;
  };
  const refreshInspector = () => {
    const values=getValues(), known=new Map(api.getVariables().map(v=>[v.key,v]));
    const keys=usedKeys(), list=inspector.querySelector('[data-detected-variables]');
    const missing=keys.filter(key=>!values[key]); const unknown=keys.filter(key=>!known.has(key));
    inspector.querySelector('[data-variable-summary]').textContent = keys.length ? `${keys.length} used · ${missing.length} missing${unknown.length?` · ${unknown.length} unknown`:''}` : 'No variables detected';
    list.innerHTML = keys.length ? keys.map(key=>{
      const item=known.get(key), value=values[key];
      const status=!item?'unknown':value?'ready':'missing';
      return `<button type="button" class="variable-status ${status}" data-focus-field="${escapeHtml(key)}" title="${value?escapeHtml(value):'Add a value'}"><code>${escapeHtml(item?.token || (String.fromCharCode(123,123)+key+String.fromCharCode(125,125)))}</code><span>${!item?'Unknown':value?'Ready':'Missing'}</span></button>`;
    }).join('') : '<p class="no-variables">Insert a variable to make this message reusable.</p>';
    let cursor=0, html='', source=editor.value;
    for(const match of source.matchAll(tokenPattern())){
      html+=escapeHtml(source.slice(cursor,match.index));
      const value=values[match[1]], item=known.get(match[1]);
      html+=`<mark class="resolved-token ${!item?'unknown':value?'':'missing'}" title="${escapeHtml(match[0])}">${escapeHtml(value || match[0])}</mark>`;
      cursor=match.index+match[0].length;
    }
    html+=escapeHtml(source.slice(cursor));
    inspector.querySelector('[data-resolved-message]').innerHTML=html.replace(/\n/g,'<br>') || '<span class="muted">Your resolved message will appear here.</span>';
  };
  const refresh = () => { updateCounters(); refreshInspector(); state.dirty=true; document.querySelector('.autosave-state').textContent='Unsaved changes'; };

  const renderVariableDialog = filter => {
    const groups={}; api.getVariables().forEach(v=>{if(filter && !`${v.key} ${v.label} ${v.group}`.toLowerCase().includes(filter.toLowerCase()))return;(groups[v.group]??=[]).push(v)});
    const labels={customer:'Customer',business:'Business',property:'Property',lead:'Lead',appointment:'Appointment',payment:'Payment',campaign:'Campaign'};
    dialog.querySelector('[data-variable-groups]').innerHTML=Object.entries(groups).map(([group,rows])=>`<section class="variable-group"><h3>${labels[group]||group}</h3><div>${rows.map(v=>`<button type="button" class="variable-option" data-token-key="${v.key}"><span><strong>${escapeHtml(v.label)}</strong><code>${escapeHtml(v.token)}</code></span><small>${escapeHtml(v.sample)}</small></button>`).join('')}</div></section>`).join('') || '<p class="dialog-empty">No matching variables.</p>';
  };
  const loadTemplate = () => {
    const categoryId=categoryMap[categorySelect.value];
    if(categoryId==='custom'){
      state.base={id:'custom',title:'Custom Real Estate Message',message:''};
    } else {
      const exact=api.getTemplates({categoryId,language:languageSelect.value});
      const fallback=exact[0] || api.getTemplates({categoryId})[0];
      if(!fallback) return;
      state.base=fallback;
    }
    titleInput.value=state.base.title; editor.value=state.base.message; state.history=[]; state.index=-1; pushHistory(true); state.dirty=false;
    document.querySelector('.autosave-state').textContent='Template loaded'; updateCounters(); refreshInspector();
  };
  const wrapSelection = (before,after=before) => {
    const start=editor.selectionStart,end=editor.selectionEnd,selected=editor.value.slice(start,end);
    editor.setRangeText(before+selected+after,start,end,'select'); editor.selectionStart=start+before.length; editor.selectionEnd=end+before.length+selected.length; editor.focus(); editor.dispatchEvent(new Event('input',{bubbles:true}));
  };
  const bulletSelection = () => {
    const start=editor.selectionStart,end=editor.selectionEnd;
    let selected=editor.value.slice(start,end) || editor.value.split('\n').find((_,i,a)=>{let pos=0;for(let x=0;x<i;x++)pos+=a[x].length+1;return start>=pos&&start<=pos+a[i].length}) || '';
    const output=selected.split('\n').map(line=>line.trim()?`• ${line.replace(/^[-•]\s*/, '')}`:line).join('\n');
    editor.setRangeText(output,start,end,'end'); editor.focus(); editor.dispatchEvent(new Event('input',{bubbles:true}));
  };

  document.querySelector('.variable-trigger')?.addEventListener('click',()=>{renderVariableDialog('');dialog.showModal();dialog.querySelector('input').focus()});
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();const btn=e.target.closest('[data-token-key]');if(btn){const item=api.getVariable(btn.dataset.tokenKey);insertAtCursor(item.token);dialog.close()}});
  dialog.querySelector('input').addEventListener('input',e=>renderVariableDialog(e.target.value));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!emojiMenu.hidden)emojiMenu.hidden=true});
  inspector.querySelector('.inspector-toggle').addEventListener('click',e=>{const body=inspector.querySelector('.inspector-body');body.hidden=!body.hidden;e.currentTarget.textContent=body.hidden?'Show':'Hide';e.currentTarget.setAttribute('aria-expanded',String(!body.hidden))});
  inspector.addEventListener('click',e=>{const btn=e.target.closest('[data-focus-field]');if(!btn)return;const id=inputMap[btn.dataset.focusField];const field=document.getElementById(id);if(field){field.closest('details')?.setAttribute('open','');field.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>field.focus(),350)}});
  editor.addEventListener('input',()=>{refresh();clearTimeout(state.timer);state.timer=setTimeout(()=>pushHistory(),250)});
  titleInput.addEventListener('input',()=>{state.dirty=true;clearTimeout(state.timer);state.timer=setTimeout(()=>pushHistory(),250)});
  document.querySelector('.builder-workspace')?.addEventListener('input',e=>{if(e.target!==editor&&e.target!==titleInput)refreshInspector()});
  categorySelect.addEventListener('change',loadTemplate); languageSelect.addEventListener('change',loadTemplate);
  document.querySelector('[aria-label="Undo"]')?.addEventListener('click',()=>applyHistory(state.index-1));
  document.querySelector('[aria-label="Redo"]')?.addEventListener('click',()=>applyHistory(state.index+1));
  const resetButton=[...document.querySelectorAll('.panel-head .btn')].find(b=>b.textContent.trim()==='Reset');
  resetButton?.addEventListener('click',()=>{if(!state.base)return;titleInput.value=state.base.title;editor.value=state.base.message;pushHistory(true);refresh();document.querySelector('.autosave-state').textContent='Template reset'});
  if(resetButton){const duplicate=document.createElement('button');duplicate.type='button';duplicate.className='btn btn-outline btn-sm';duplicate.textContent='Duplicate';duplicate.addEventListener('click',()=>{titleInput.value=`${titleInput.value.replace(/\s+Copy(?:\s\d+)?$/,'')} Copy`;pushHistory(true);refresh();document.querySelector('.autosave-state').textContent='Duplicate ready'});resetButton.parentElement?.insertBefore(duplicate,resetButton)}
  const buttons=[...document.querySelectorAll('.format-button')];
  buttons.find(b=>b.title==='Bold')?.addEventListener('click',()=>wrapSelection('*'));
  buttons.find(b=>b.title==='Italic')?.addEventListener('click',()=>wrapSelection('_'));
  buttons.find(b=>b.title==='Bullet list')?.addEventListener('click',bulletSelection);
  buttons.find(b=>b.title==='Emoji')?.addEventListener('click',()=>{emojiMenu.hidden=!emojiMenu.hidden});
  emojiMenu.addEventListener('click',e=>{const btn=e.target.closest('[data-emoji]');if(btn){insertAtCursor(btn.dataset.emoji);emojiMenu.hidden=true}});

  renderVariableDialog(''); loadTemplate();
})();