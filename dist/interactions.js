document.documentElement.classList.add('js');
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
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const projectCards = [...document.querySelectorAll('[data-category]')];
filterButtons.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  filterButtons.forEach(item => item.setAttribute('aria-pressed',String(item === button)));
  let count=0;
  projectCards.forEach(card => {card.hidden = category !== 'Todos' && card.dataset.category !== category;if(!card.hidden) count++;});
  document.querySelector('#filter-status').textContent=`${count} projeto${count===1?'':'s'} demonstrativo${count===1?'':'s'} — ${category}`;
  document.querySelector('#empty-projects').hidden = count > 0;
  const featureGrid=document.querySelector('.featured-grid');
  featureGrid.hidden=![...featureGrid.children].some(el=>!el.hidden);
}));
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
document.querySelectorAll('.comparison-control input').forEach(input=>input.addEventListener('input',()=>{
  const card=input.closest('.comparison-card');
  card.querySelector('.comparison').style.setProperty('--split',`${input.value}%`);
  card.querySelector('output').textContent=`${input.value}% depois`;
}));
document.querySelector('.contact-form')?.addEventListener('submit',event=>{
  event.preventDefault();
  document.querySelector('#form-status').textContent='Campos validados. Este é um protótipo: nenhuma mensagem foi enviada e seus dados não foram armazenados.';
});
document.querySelector('[data-whatsapp]')?.addEventListener('click',()=>{
  document.querySelector('.contact-status').textContent='[WHATSAPP A CONFIRMAR] — o link será configurado na integração. Nenhuma conversa foi iniciada.';
});
