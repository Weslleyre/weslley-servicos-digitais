document.documentElement.classList.add('js');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
// The three requested motion systems use separate clocks and never move layout.
document.querySelectorAll('[data-text-cycle]').forEach(group => {
  const titles = [...group.querySelectorAll('.cycle-title > .cycle-frame')];
  const descriptions = [...group.querySelectorAll('.cycle-description > .cycle-frame')];
  const original = titles.map(el => el.querySelector('.cycle-display').innerHTML);
  const words = titles.map(el => el.querySelector('.cycle-display').textContent);
  const interval = Number(group.dataset.cycleInterval) || 6500;
  let index = 0, frame, timer;
  const show = next => {
    index = next;
    titles.forEach((el,i) => {el.querySelector('.cycle-display').innerHTML=original[i];el.classList.toggle('is-active',i===index);el.setAttribute('aria-hidden',String(i!==index));});
    descriptions.forEach((el,i) => {el.classList.toggle('is-active',i===index);el.setAttribute('aria-hidden',String(i!==index));});
  };
  function cycle() {
    if(reducedMotion.matches)return;
    if(document.hidden){timer=setTimeout(cycle,1000);return;}
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
  function restart(){clearTimeout(timer);cancelAnimationFrame(frame);show(0);if(!reducedMotion.matches)timer=setTimeout(cycle,interval);}
  reducedMotion.addEventListener('change',restart);restart();
});
const counters=[...document.querySelectorAll('[data-count]')];
const visibleCounters=new Set();
const counterStarts=new WeakMap();
const formatNumber=new Intl.NumberFormat('pt-BR');
const countObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){visibleCounters.add(entry.target);counterStarts.set(entry.target,performance.now());}
  else visibleCounters.delete(entry.target);
}));
counters.forEach(el=>countObserver.observe(el));
function animateCounts(now){
  if(!document.hidden&&!reducedMotion.matches)visibleCounters.forEach(el=>{
    const elapsed=(now-counterStarts.get(el))%7800;
    const progress=Math.min(1,elapsed/1800);
    const value=Math.round(Number(el.dataset.count)*(1-Math.pow(1-progress,3)));
    el.firstElementChild.textContent=formatNumber.format(value)+el.dataset.suffix;
  });
  requestAnimationFrame(animateCounts);
}
reducedMotion.addEventListener('change',()=>counters.forEach(el=>{
  el.firstElementChild.textContent=formatNumber.format(Number(el.dataset.count))+el.dataset.suffix;
  counterStarts.set(el,performance.now());
}));
if(counters.length)requestAnimationFrame(animateCounts);
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
const serviceGallery = document.querySelector('#service-gallery');
if (serviceGallery) {
  const groups = JSON.parse(document.querySelector('#service-gallery-data').textContent);
  const preview = document.querySelector('#service-hover-preview');
  function hidePreview() { preview.hidden = true; }
  function showPreview(button) {
    if (serviceGallery.open) return;
    const item = groups[Number(button.dataset.serviceGroup)].items[Number(button.dataset.serviceIndex)];
    preview.querySelector('img').src = item.src;
    preview.querySelector('span').textContent = item.title;
    preview.hidden = false;
    const box = button.getBoundingClientRect();
    const width = preview.offsetWidth, height = preview.offsetHeight;
    const left = box.right + 14 + width <= innerWidth ? box.right + 14 : box.left - width - 14;
    preview.style.left = `${Math.max(8, Math.min(left, innerWidth - width - 8))}px`;
    preview.style.top = `${Math.max(8, Math.min(box.top - 15, innerHeight - height - 8))}px`;
  }
  document.querySelectorAll('.service-name').forEach(button => {
    button.addEventListener('pointerenter', event => { if(event.pointerType === 'mouse') showPreview(button); });
    button.addEventListener('pointerleave', hidePreview);
    button.addEventListener('focus', () => showPreview(button));
    button.addEventListener('blur', hidePreview);
  });
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
  document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{
    const project=projects.find(p=>p.id===button.dataset.project);
    document.querySelector('#dialog-title').textContent=project.title;
    document.querySelector('#dialog-description').textContent=project.description;
    dialog.showModal();
  }));
  dialog.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());
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
document.querySelector('.contact-form')?.addEventListener('submit',event=>{
  event.preventDefault();
  document.querySelector('#form-status').textContent='Campos validados. Este é um protótipo: nenhuma mensagem foi enviada e seus dados não foram armazenados.';
});
