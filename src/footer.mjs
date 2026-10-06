import { BrandLogo } from './brand.mjs';

const socialIcon = name => {
  const shapes = {
    Instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/>',
    TikTok: '<path d="M14 3v12a4 4 0 1 1-4-4M14 3c0 4 3 6 6 6"/>',
    Google: '<path d="M20 7a9 9 0 1 0 1 9v-4h-9"/>'
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${shapes[name]}</svg>`;
};

export function Footer() {
  const socials = [
    ['Instagram', 'https://www.instagram.com/weslley_3dezao'],
    ['TikTok', 'https://www.tiktok.com/@weslley_3dezao'],
    ['Google', 'https://www.google.com/search?client=opera&q=weslley+3dez%C3%A3o&sourceid=opera&ie=UTF-8&oe=UTF-8']
  ];
  return `<footer class="footer" id="rodape"><div class="container footer-grid"><div class="footer-brand"><a href="index.html" aria-label="Weslley 3Dezão — Home">${BrandLogo()}</a></div><nav aria-label="Navegação do rodapé"><h2>Navegação</h2><a href="index.html">Home</a><a href="servicos.html">Serviços</a><a href="portfolio.html">Portfólio</a><a href="contato.html">Contato</a></nav><nav aria-label="Serviços do rodapé"><h2>Serviços</h2><a href="servicos.html#servico-01">Websites</a><a href="servicos.html#servico-02">Landing Pages</a><a href="servicos.html#servico-03">Lojas Virtuais</a><a href="servicos.html#servico-04">Redes Sociais</a><a href="servicos.html#servico-07">Apresentações</a></nav><div><h2>Contato</h2><a href="https://wa.me/5511999720479" target="_blank" rel="noopener noreferrer">(11) 99972-0479</a><a href="mailto:criacoescamaleao@gmail.com">criacoescamaleao@gmail.com</a><p>São Paulo/Brasil — Online</p></div><div class="footer-social"><h2>Siga a gente</h2><div class="footer-social-links">${socials.map(([name,url])=>`<a href="${url.replace(/&/g,'&amp;')}" target="_blank" rel="noopener noreferrer">${socialIcon(name)}<span>${name}</span></a>`).join('')}</div></div></div><div class="container footer-note"><p>CNPJ: 14.319.613/0001-09</p><p>© 2026 Weslley 3Dezão. Todos os direitos reservados.</p></div></footer>`;
}
