document.documentElement.classList.add('js');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
// The three requested motion systems use separate clocks and never move layout.
document.querySelectorAll('[data-text-cycle]').forEach(group => {
  const titles = [...group.querySelectorAll('.cycle-title > .cycle-frame')];
  const descriptions = [...group.querySelectorAll('.cycle-description > .cycle-frame')];
  const original = titles.map(el => el.querySelector('.cycle-display').innerHTML);
  const words = titles.map(el => el.querySelector('.cycle-display').textContent);
  const interval = Number(group.dataset.cycleInterval) || 6500;
  let index = 0, frame, timer, inView = false;
  const show = next => {
    index = next;
    group.querySelector('.cycle-title').setAttribute('aria-label',words[index]);
    titles.forEach((el,i) => {el.querySelector('.cycle-display').innerHTML=original[i];el.classList.toggle('is-active',i===index);el.setAttribute('aria-hidden',String(i!==index));});
    descriptions.forEach((el,i) => {el.classList.toggle('is-active',i===index);el.setAttribute('aria-hidden',String(i!==index));});
  };
  function cycle() {
    if(reducedMotion.matches || document.hidden || !inView)return;
    show((index+1)%titles.length);
    if(group.dataset.textCycle==='decode'){
      const output=titles[index].querySelector('.cycle-display'), text=words[index], started=performance.now();
      const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ';
      // Reserve each original word's width; random glyphs cannot change wrapping.
      let offset=0;
      const parts=text.split(/(\s+)/).map(word=>{
        const start=offset;offset+=word.length;
        if(/\s/.test(word))return {node:document.createTextNode(word)};
        const node=document.createElement('span');node.className='decode-word';
        const measure=document.createElement('span');measure.className='decode-measure';measure.textContent=word;measure.setAttribute('aria-hidden','true');
        const random=document.createElement('span');random.className='decode-random';
        node.append(measure,random);return {node,random,word,start};
      });
      output.replaceChildren(...parts.map(part=>part.node));
      function decode(now){
        const progress=Math.min(1,(now-started)/900);
        parts.forEach(part=>{if(part.random)part.random.textContent=[...part.word].map((char,i)=>(part.start+i)/text.length<progress?char:alphabet[Math.floor(Math.random()*alphabet.length)]).join('');});
        if(progress<1)frame=requestAnimationFrame(decode);
        else{output.innerHTML=original[index];timer=setTimeout(cycle,6000);}
      }
      frame=requestAnimationFrame(decode);
    }else timer=setTimeout(cycle,interval);
  }
  function schedule(){clearTimeout(timer);cancelAnimationFrame(frame);show(index);if(!reducedMotion.matches&&!document.hidden&&inView)timer=setTimeout(cycle,interval);}
  function restart(){index=0;schedule();}
  new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;schedule();}).observe(group);
  document.addEventListener('visibilitychange',schedule);
  window.addEventListener('pagehide',()=>{clearTimeout(timer);cancelAnimationFrame(frame);});
  window.addEventListener('pageshow',schedule);
  reducedMotion.addEventListener('change',restart);restart();
});
const counters=[...document.querySelectorAll('[data-count]')];
const visibleCounters=new Set();
const counterStarts=new WeakMap();
const formatNumber=new Intl.NumberFormat('pt-BR');
let countsFrame;
const countObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){visibleCounters.add(entry.target);counterStarts.set(entry.target,performance.now());}
  else visibleCounters.delete(entry.target);
  scheduleCounts();
}));
counters.forEach(el=>countObserver.observe(el));
function animateCounts(now){
  countsFrame=undefined;
  if(!document.hidden&&!reducedMotion.matches)visibleCounters.forEach(el=>{
    const elapsed=(now-counterStarts.get(el))%7800;
    const progress=Math.min(1,elapsed/1800);
    const value=Math.round(Number(el.dataset.count)*(1-Math.pow(1-progress,3)));
    el.firstElementChild.textContent=formatNumber.format(value)+el.dataset.suffix;
  });
  scheduleCounts();
}
function scheduleCounts(){
  if(document.hidden||reducedMotion.matches||!visibleCounters.size){cancelAnimationFrame(countsFrame);countsFrame=undefined;return;}
  if(countsFrame===undefined)countsFrame=requestAnimationFrame(animateCounts);
}
reducedMotion.addEventListener('change',()=>counters.forEach(el=>{
  el.firstElementChild.textContent=formatNumber.format(Number(el.dataset.count))+el.dataset.suffix;
  counterStarts.set(el,performance.now());
}));
reducedMotion.addEventListener('change',scheduleCounts);
document.addEventListener('visibilitychange',scheduleCounts);
window.addEventListener('pagehide',()=>{cancelAnimationFrame(countsFrame);countsFrame=undefined;});
window.addEventListener('pageshow',scheduleCounts);
const movingAssets=[...document.querySelectorAll('.home-logo-wiggle,.orbit-item img,#formulario .contact-visual>.asset img,.hero-asset img[src="assets/hero/servicos-foguete.png"]')];
const assetsInView=new Set();
const pauseHiddenAssets=()=>movingAssets.forEach(el=>el.classList.toggle('motion-offscreen',document.hidden||!assetsInView.has(el)));
const motionObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)assetsInView.add(entry.target);else assetsInView.delete(entry.target);});pauseHiddenAssets();});
movingAssets.forEach(el=>motionObserver.observe(el));
document.addEventListener('visibilitychange',pauseHiddenAssets);
const featureViewer=document.querySelector('.portfolio-section .featured-grid .feature');
if(featureViewer){
  const items=JSON.parse(document.querySelector('#service-gallery-data').textContent)[1].items;
  let current=0;
  const image=featureViewer.querySelector('img'),open=featureViewer.querySelector('button');
  function advanceFeature(delta){
    current=(current+delta+items.length)%items.length;
    const item=items[current];
    featureViewer.querySelector('.eyebrow').textContent=item.category;
    featureViewer.querySelector('h3').textContent=item.title;
    featureViewer.querySelector('p').textContent=item.description;
    image.src=item.src;image.alt=item.alt;image.width=item.width;image.height=item.height;
    featureViewer.dataset.category=item.category;
    const tone=item.category==='Redes Sociais'?'pink':item.category==='Catálogos'?'lime':'blue';
    featureViewer.style.backgroundColor=`var(--color-${tone})`;
    featureViewer.style.color=`var(--color-${tone==='blue'?'white':'black'})`;
    open.dataset.serviceIndex=current;open.setAttribute('aria-label',`Ampliar projeto: ${item.title}`);
    document.querySelector('#feature-count').textContent=`${String(current+1).padStart(2,'0')} / ${items.length}`;
    if(!reducedMotion.matches)featureViewer.animate([{opacity:.3,transform:'translateX(4px)'},{opacity:1,transform:'translateX(0)'}],{duration:200,easing:'ease-out'});
  }
  document.querySelector('[data-feature-prev]').addEventListener('click',()=>advanceFeature(-1));
  document.querySelector('[data-feature-next]').addEventListener('click',()=>advanceFeature(1));
}
// Keep category artwork in flow so changing a service never resizes its card.
document.querySelectorAll('.services-section .service-card').forEach(card => {
  const list = card.querySelector('.service-body ul');
  const panel = card.querySelector('.service-art-link');
  const selectedImage = panel.querySelector('.service-selected-art');
  let selected = null, touchPreviewOnly = false;
  function resetPanel() {
    selected = null;
    touchPreviewOnly = false;
    selectedImage.hidden = true;
    panel.classList.remove('is-previewing');
  }
  function selectService(button) {
    selected = button;
    selectedImage.src = button.dataset.serviceIcon;
    selectedImage.alt = button.textContent.trim();
    selectedImage.hidden = false;
    panel.classList.add('is-previewing');
  }
  list.querySelectorAll('[data-service-icon]').forEach(button => {
    button.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse') selectService(button);
    });
    button.addEventListener('focus', () => selectService(button));
    button.addEventListener('pointerdown', event => {
      touchPreviewOnly = false;
      if (event.pointerType === 'touch' || event.pointerType === 'pen') {
        touchPreviewOnly = selected !== button;
        selectService(button);
      }
    });
    button.addEventListener('click', event => {
      if (touchPreviewOnly) {
        touchPreviewOnly = false;
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    });
  });
  list.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse') resetPanel();
  });
  list.addEventListener('focusout', event => {
    if (!list.contains(event.relatedTarget)) resetPanel();
  });
  card.addEventListener('keydown', event => {
    if (event.key === 'Escape') resetPanel();
  });
  document.addEventListener('pointerdown', event => {
    if (!card.contains(event.target)) resetPanel();
  });
});
const serviceHeadlineSyncs = new Map();
document.querySelectorAll('.services-section .service-card').forEach(websitesCard => {
  const websitePanel = websitesCard.querySelector('.service-preview');
  const websiteImage = websitesCard.querySelector('.service-selected-art');
  const websiteHeadline = websitesCard.querySelector('.website-service-headline');
  function syncWebsiteHeadline() {
    if (websitesCard.id !== 'servico-01') websitePanel.style.setProperty('--website-actual-height', `${websitePanel.getBoundingClientRect().height}px`);
    const selectedButton = [...websitesCard.querySelectorAll('[data-website-headline]')].find(button => button.dataset.serviceIcon === websiteImage.getAttribute('src'));
    if (websiteImage.hidden || !selectedButton) {
      websiteHeadline.hidden = true;
      websiteHeadline.textContent = '';
      websitePanel.classList.remove('website-has-headline');
      return;
    }
    websiteHeadline.textContent = selectedButton.dataset.websiteHeadline;
    websiteHeadline.hidden = false;
    const mobile = matchMedia('(max-width:560px)').matches;
    if (websitesCard.id === 'servico-01' || mobile) websitePanel.style.setProperty('--website-base-height', `${websitePanel.clientWidth / 1.7}px`);
    websitePanel.classList.toggle('website-has-headline', mobile);
    const panelBox = websitePanel.getBoundingClientRect();
    const imageBox = websiteImage.getBoundingClientRect();
    const imageSide = Math.min(imageBox.width, imageBox.height);
    const headlineTop = imageBox.top - panelBox.top + (imageBox.height + imageSide) / 2 + 8;
    websitePanel.style.setProperty('--website-headline-top', `${headlineTop}px`);
    if (mobile) {
      const height = Math.max(websitePanel.clientWidth / 1.7, headlineTop + websiteHeadline.getBoundingClientRect().height + 20);
      websitePanel.style.setProperty('--website-panel-height', `${Math.ceil(height)}px`);
    }
  }
  new MutationObserver(syncWebsiteHeadline).observe(websiteImage, { attributes:true, attributeFilter:['src','alt','hidden'] });
  new ResizeObserver(syncWebsiteHeadline).observe(websitePanel);
  if (websitesCard.id !== 'servico-01') serviceHeadlineSyncs.set(websitesCard, syncWebsiteHeadline);
});
// Measure every caption at the existing icon position, reserving only missing space.
// Capture all original row heights before extending any row; card 01 is excluded.
function fitServiceHeadlines() {
  const cards = [...serviceHeadlineSyncs.keys()];
  cards.forEach(card => {
    card.style.removeProperty('min-height');
    card.querySelector('.service-preview').classList.remove('service-headline-sized');
  });
  if (matchMedia('(max-width:560px)').matches) {
    serviceHeadlineSyncs.forEach(sync => sync());
    return;
  }
  const bases = cards.map(card => card.querySelector('.service-preview').getBoundingClientRect().height);
  const required = cards.map((card, index) => {
    const panel = card.querySelector('.service-preview');
    const caption = card.querySelector('.website-service-headline');
    const image = card.querySelector('.service-selected-art').cloneNode();
    const text = caption.textContent, hidden = caption.hidden;
    panel.style.setProperty('--website-base-height', `${bases[index]}px`);
    panel.style.setProperty('--website-actual-height', `${bases[index]}px`);
    panel.classList.add('service-headline-sized');
    image.hidden = false;
    image.setAttribute('aria-hidden', 'true');
    panel.append(image);
    caption.hidden = false;
    let height = bases[index];
    card.querySelectorAll('[data-website-headline]').forEach(button => {
      image.src = button.dataset.serviceIcon;
      caption.textContent = button.dataset.websiteHeadline;
      const imageBox = image.getBoundingClientRect();
      const top = imageBox.top - panel.getBoundingClientRect().top + (imageBox.height + Math.min(imageBox.width, imageBox.height)) / 2 + 8;
      height = Math.max(height, top + caption.getBoundingClientRect().height + 8);
    });
    image.remove();
    caption.textContent = text;
    caption.hidden = hidden;
    return height > bases[index] ? Math.ceil(height + 2) : null;
  });
  cards.forEach((card, index) => {
    if (required[index] !== null) card.style.minHeight = `${required[index]}px`;
  });
  serviceHeadlineSyncs.forEach(sync => sync());
}
if (serviceHeadlineSyncs.size) {
  fitServiceHeadlines();
  window.addEventListener('resize', fitServiceHeadlines);
}
const serviceGallery = document.querySelector('#service-gallery');
if (serviceGallery) {
  const groups = JSON.parse(document.querySelector('#service-gallery-data').textContent);
  const preview = document.querySelector('#service-hover-preview');
  let previewButton, previewHideTimer;
  function hidePreview() { clearTimeout(previewHideTimer); preview.hidden = true; }
  function showPreview(button) {
    if (serviceGallery.open) return;
    clearTimeout(previewHideTimer);
    previewButton = button;
    const item = groups[Number(button.dataset.serviceGroup)].items[Number(button.dataset.serviceIndex)];
    preview.querySelector('img').src = item.src;
    preview.querySelector('span').textContent = item.title;
    preview.hidden = false;
    const previewImage = preview.querySelector('img');
    preview.style.width = '';
    previewImage.style.height = '';
    const originalWidth = preview.offsetWidth, originalHeight = preview.offsetHeight;
    const originalImageHeight = previewImage.offsetHeight;
    const mobilePanel = innerWidth <= 560 ? button.closest('.service-card')?.querySelector('.service-preview')?.getBoundingClientRect() : null;
    preview.style.width = `${Math.min(originalWidth * 1.5, innerWidth - 16, mobilePanel ? mobilePanel.width - 16 : Infinity)}px`;
    previewImage.style.height = `${originalImageHeight * 1.5}px`;
    const targetHeight = mobilePanel ? Math.min(originalHeight * 1.5, mobilePanel.height - 16) : originalHeight * 1.5;
    previewImage.style.height = `${Math.max(0, previewImage.offsetHeight + targetHeight - preview.offsetHeight)}px`;
    const box = button.getBoundingClientRect();
    const width = preview.offsetWidth, height = preview.offsetHeight;
    const cardBox = button.closest('.service-card')?.getBoundingClientRect();
    const gridBox = button.closest('.services-grid')?.getBoundingClientRect();
    const rightCard = cardBox && gridBox && cardBox.left >= gridBox.left + gridBox.width / 2;
    const left = rightCard ? cardBox.left - width - 14 : box.right + 14 + width <= innerWidth ? box.right + 14 : box.left - width - 14;
    preview.style.left = `${mobilePanel ? mobilePanel.left + (mobilePanel.width - width) / 2 : Math.max(8, Math.min(left, innerWidth - width - 8))}px`;
    preview.style.top = `${mobilePanel ? mobilePanel.top + (mobilePanel.height - height) / 2 : Math.max(8, Math.min(box.top - 15, innerHeight - height - 8))}px`;
  }
  document.querySelectorAll('.service-name').forEach(button => {
    button.addEventListener('pointerenter', event => { if(event.pointerType === 'mouse') showPreview(button); });
    button.addEventListener('pointerleave', () => { previewHideTimer = setTimeout(hidePreview, 200); });
    button.addEventListener('focus', () => showPreview(button));
    button.addEventListener('blur', hidePreview);
  });
  preview.addEventListener('pointerenter', () => clearTimeout(previewHideTimer));
  preview.addEventListener('pointerleave', hidePreview);
  preview.querySelector('img').style.pointerEvents = 'auto';
  preview.querySelector('img').addEventListener('pointerdown', event => event.preventDefault());
  preview.querySelector('img').addEventListener('click', () => previewButton?.click());
  window.addEventListener('scroll', hidePreview, true);
  window.addEventListener('resize', hidePreview);
  let groupIndex = 0, imageIndex = 0, opener;
  const image = document.querySelector('#service-gallery-image');
  function renderService() {
    const group = groups[groupIndex], item = group.items[imageIndex];
    image.src = item.src;
    image.alt = item.title;
    image.width = item.width;
    image.height = item.height;
    serviceGallery.style.setProperty('--gallery-ratio', item.width / item.height);
    document.querySelector('#service-gallery-title').textContent = item.title;
    document.querySelector('#service-gallery-category').textContent = item.category || group.title;
    document.querySelector('#service-gallery-description').textContent = item.description;
    document.querySelector('#service-gallery-count').textContent = `${imageIndex + 1} / ${group.items.length}`;
    serviceGallery.scrollTop = 0;
  }
  function advance(delta) {
    imageIndex = (imageIndex + delta + groups[groupIndex].items.length) % groups[groupIndex].items.length;
    renderService();
  }
  document.querySelectorAll('[data-service-group]').forEach(button => button.addEventListener('click', () => {
    hidePreview();
    opener = button;
    groupIndex = Number(button.dataset.serviceGroup);
    imageIndex = Number(button.dataset.serviceIndex);
    renderService();
    serviceGallery.showModal();
    document.body.classList.add('gallery-open');
  }));
  serviceGallery.querySelector('.gallery-close').addEventListener('click', () => serviceGallery.close());
  serviceGallery.querySelector('[data-gallery-prev]').addEventListener('click', () => advance(-1));
  serviceGallery.querySelector('[data-gallery-next]').addEventListener('click', () => advance(1));
  serviceGallery.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); advance(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  serviceGallery.addEventListener('click', event => { if (event.target === serviceGallery) serviceGallery.close(); });
  serviceGallery.addEventListener('close', () => {
    document.body.classList.remove('gallery-open'); opener?.focus();
  });
}
document.querySelector('.orbit-motion')?.addEventListener('click', event => {
  const button=event.currentTarget;
  const paused=button.getAttribute('aria-pressed')!=='true';
  button.setAttribute('aria-pressed',String(paused));
  button.textContent=paused?'Retomar animação':'Pausar animação';
  button.closest('.orbit-composition').classList.toggle('is-paused',paused);
});
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menu.classList.toggle('is-open', open);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    menuButton.setAttribute('aria-expanded','false'); menu.classList.remove('is-open'); menuButton.focus();
  }
});
const dialog = document.querySelector('#project-dialog');
const projectData = document.querySelector('#project-data');
if(dialog && projectData){
  const projects=JSON.parse(projectData.textContent);
  let opener;
  document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{
    opener=button;
    const project=projects.find(p=>p.id===button.dataset.project);
    document.querySelector('#dialog-title').textContent=project.title;
    document.querySelector('#dialog-description').textContent=project.description;
    const image=document.querySelector('#dialog-image');
    image.src=project.src;image.alt=project.alt;image.width=project.width;image.height=project.height;
    dialog.showModal();document.body.classList.add('gallery-open');
  }));
  dialog.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  dialog.addEventListener('close',()=>{document.body.classList.remove('gallery-open');opener?.focus();});
}
function bindComparison(card) {
  const input = card.querySelector('input[type="range"]');
  const stage = card.querySelector('.comparison');
  const handle = card.querySelector('.comparison-handle');
  function update(value) {
    const split = Math.max(0,Math.min(100,Math.round(value)));
    input.value = split;
    stage.style.setProperty('--split',`${split}%`);
    card.querySelector('output').textContent = `${split}% depois`;
    handle.setAttribute('aria-valuenow',split);
    handle.setAttribute('aria-valuetext',`${split}% depois`);
  }
  input.addEventListener('input',()=>update(input.value));
  let pointer;
  function move(event) {
    const rect = stage.getBoundingClientRect();
    update((event.clientX-rect.left)/rect.width*100);
  }
  handle.addEventListener('pointerdown',event=>{
    if(event.button!==0)return;
    event.preventDefault();event.stopPropagation();
    pointer=event.pointerId;handle.focus();handle.setPointerCapture(pointer);move(event);
  });
  handle.addEventListener('pointermove',event=>{if(event.pointerId===pointer)move(event);});
  function release(event){if(event.pointerId===pointer){pointer=undefined;if(handle.hasPointerCapture(event.pointerId))handle.releasePointerCapture(event.pointerId);}}
  handle.addEventListener('pointerup',release);
  handle.addEventListener('pointercancel',release);
  handle.addEventListener('click',event=>event.stopPropagation());
  handle.addEventListener('keydown',event=>{
    const actions={ArrowLeft:-1,ArrowDown:-1,ArrowRight:1,ArrowUp:1,PageDown:-10,PageUp:10};
    if(event.key in actions){event.preventDefault();update(Number(input.value)+actions[event.key]);}
    if(event.key==='Home'||event.key==='End'){event.preventDefault();update(event.key==='Home'?0:100);}
  });
  update(input.value);
}
const comparisonDialog=document.querySelector('#comparison-dialog');
if(comparisonDialog){
  let opener;
  document.querySelectorAll('.comparison-grid .comparison-card').forEach(card=>{
    bindComparison(card);
    const button=card.querySelector('.comparison-open');
    let press;
    button.addEventListener('pointerdown',event=>{press={x:event.clientX,y:event.clientY};});
    button.addEventListener('click',event=>{
      if(event.detail&&press&&Math.hypot(event.clientX-press.x,event.clientY-press.y)>8)return;
      opener=button;
      const enlarged=card.cloneNode(true);
      enlarged.querySelector('.comparison-open').remove();
      const input=enlarged.querySelector('input');input.id='comparison-modal-range';
      enlarged.querySelector('label').htmlFor=input.id;
      enlarged.querySelector('output').htmlFor=input.id;
      enlarged.querySelectorAll('img').forEach(img=>{img.loading='eager';img.draggable=false;});
      comparisonDialog.querySelector('.comparison-modal-content').replaceChildren(enlarged);
      comparisonDialog.setAttribute('aria-label',`Comparação ampliada: ${card.dataset.comparisonName}`);
      bindComparison(enlarged);
      comparisonDialog.showModal();document.body.classList.add('comparison-opened');
      comparisonDialog.querySelector('.comparison-close').focus();
    });
  });
  comparisonDialog.querySelector('.comparison-close').addEventListener('click',()=>comparisonDialog.close());
  comparisonDialog.addEventListener('click',event=>{if(event.target===comparisonDialog)comparisonDialog.close();});
  comparisonDialog.addEventListener('close',()=>{document.body.classList.remove('comparison-opened');opener?.focus();});
}
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  let contactSubmitting = false;
  contactForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (contactSubmitting || !contactForm.reportValidity()) return;
    const submit = contactForm.querySelector('[type="submit"]');
    const status = contactForm.querySelector('#form-status');
    contactSubmitting = true;
    submit.disabled = true;
    contactForm.setAttribute('aria-busy', 'true');
    status.textContent = 'Enviando sua mensagem…';
    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });
      const result = await response.json();
      if (!response.ok || result?.ok !== true || result?.errors?.length) {
        const details = Array.isArray(result?.errors) ? result.errors.map(error => error.message).filter(message => typeof message === 'string').join(' ') : '';
        status.textContent = response.status === 429
          ? 'Limite de envios atingido. Aguarde alguns minutos e tente novamente. Seus dados foram mantidos.'
          : `Não foi possível enviar sua mensagem. Seus dados foram mantidos. ${details || 'Tente novamente ou fale conosco pelo WhatsApp.'}`;
        return;
      }
      contactForm.reset();
      status.textContent = 'Mensagem enviada com sucesso! Obrigado pelo contato.';
    } catch {
      status.textContent = 'Não foi possível confirmar o envio. Seus dados foram mantidos. Verifique sua conexão e tente novamente ou fale conosco pelo WhatsApp.';
    } finally {
      contactSubmitting = false;
      submit.disabled = false;
      contactForm.removeAttribute('aria-busy');
    }
  });
}

// Explanatory tooltips for the four existing Home process steps only.
const processTooltipEntries = [...document.querySelectorAll('.process [data-process-tooltip]')].map(step => ({
  step, tooltip: document.getElementById(step.dataset.processTooltip), hovered: false
}));
if (processTooltipEntries.length) {
  let activeProcessTooltip, processTooltipTimer;
  function hideProcessTooltip() {
    clearTimeout(processTooltipTimer);
    if (activeProcessTooltip) activeProcessTooltip.tooltip.hidden = true;
    activeProcessTooltip = null;
  }
  function positionProcessTooltip() {
    if (!activeProcessTooltip) return;
    const { step, tooltip } = activeProcessTooltip;
    const box = step.getBoundingClientRect();
    const viewport = window.visualViewport;
    const leftEdge = viewport?.offsetLeft || 0, topEdge = viewport?.offsetTop || 0;
    const width = viewport?.width || document.documentElement.clientWidth;
    const height = viewport?.height || innerHeight;
    if (box.bottom <= topEdge || box.top >= topEdge + height || box.right <= leftEdge || box.left >= leftEdge + width) {
      hideProcessTooltip();
      return;
    }
    tooltip.style.width = `${Math.min(360, width - 24)}px`;
    tooltip.querySelector('.process-tooltip-copy').style.maxHeight = `${Math.max(16, height - 72)}px`;
    const tipBox = tooltip.getBoundingClientRect();
    const center = (box.left + box.right) / 2;
    const left = Math.max(leftEdge + 12, Math.min(center - tipBox.width / 2, leftEdge + width - tipBox.width - 12));
    const above = box.top - topEdge - 24, below = topEdge + height - box.bottom - 24;
    const placement = tipBox.height <= above || above >= below ? 'above' : 'below';
    const wantedTop = placement === 'above' ? box.top - tipBox.height - 12 : box.bottom + 12;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${Math.max(topEdge + 12, Math.min(wantedTop, topEdge + height - tipBox.height - 12))}px`;
    tooltip.style.setProperty('--process-tooltip-arrow', `${Math.max(16, Math.min(center - left, tipBox.width - 16))}px`);
    tooltip.dataset.placement = placement;
  }
  function showProcessTooltip(entry) {
    clearTimeout(processTooltipTimer);
    if (activeProcessTooltip !== entry) hideProcessTooltip();
    activeProcessTooltip = entry;
    entry.tooltip.hidden = false;
    positionProcessTooltip();
  }
  function leaveProcessTooltip(entry) {
    clearTimeout(processTooltipTimer);
    if (entry.hovered || entry.step.contains(document.activeElement)) return;
    processTooltipTimer = setTimeout(() => {
      if (activeProcessTooltip === entry) hideProcessTooltip();
    }, 160);
  }
  processTooltipEntries.forEach(entry => {
    let touchActivation = false, touchWasOpen = false;
    entry.step.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'mouse') return;
      entry.hovered = true;
      showProcessTooltip(entry);
    });
    entry.step.addEventListener('pointerleave', event => {
      if (event.pointerType !== 'mouse') return;
      entry.hovered = false;
      leaveProcessTooltip(entry);
    });
    entry.tooltip.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'mouse') return;
      entry.hovered = true;
      clearTimeout(processTooltipTimer);
    });
    entry.tooltip.addEventListener('pointerleave', event => {
      if (event.pointerType !== 'mouse') return;
      entry.hovered = entry.step.contains(event.relatedTarget);
      leaveProcessTooltip(entry);
    });
    entry.step.addEventListener('focus', () => { if (!touchActivation) showProcessTooltip(entry); });
    entry.step.addEventListener('focusout', () => leaveProcessTooltip(entry));
    entry.step.addEventListener('pointerdown', event => {
      if (event.target.closest('.process-tooltip')) return;
      touchActivation = event.pointerType === 'touch' || event.pointerType === 'pen';
      touchWasOpen = activeProcessTooltip === entry;
    });
    entry.step.addEventListener('pointercancel', () => { touchActivation = false; });
    entry.step.addEventListener('click', event => {
      if (event.target.closest('.process-tooltip')) return;
      if (touchActivation) {
        touchWasOpen ? hideProcessTooltip() : showProcessTooltip(entry);
        touchActivation = false;
      } else if (event.detail === 0) showProcessTooltip(entry);
    });
    entry.step.addEventListener('keydown', event => {
      if (activeProcessTooltip !== entry) return;
      const copy = entry.tooltip.querySelector('.process-tooltip-copy');
      const direction = { ArrowDown: 40, ArrowUp: -40, PageDown: copy.clientHeight, PageUp: -copy.clientHeight }[event.key];
      if (direction && copy.scrollHeight > copy.clientHeight) {
        event.preventDefault();
        copy.scrollTop += direction;
      }
    });
  });
  document.addEventListener('pointerdown', event => {
    if (activeProcessTooltip && !activeProcessTooltip.step.contains(event.target)) hideProcessTooltip();
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') hideProcessTooltip(); });
  window.addEventListener('resize', positionProcessTooltip);
  window.addEventListener('scroll', event => {
    if (!activeProcessTooltip?.tooltip.contains(event.target)) positionProcessTooltip();
  }, true);
  window.visualViewport?.addEventListener('resize', positionProcessTooltip);
  window.visualViewport?.addEventListener('scroll', positionProcessTooltip);
}
