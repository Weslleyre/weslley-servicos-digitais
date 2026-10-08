// Public V1.0 origin. PUBLIC_SITE_URL can override it for an approved deployment.
const configuredURL = process.env.PUBLIC_SITE_URL || 'https://weslleyre.github.io/weslley-servicos-digitais';
const parsedURL = new URL(configuredURL);
if (parsedURL.protocol !== 'https:' || parsedURL.search || parsedURL.hash || parsedURL.username || parsedURL.password) throw new Error('PUBLIC_SITE_URL must be an HTTPS base URL without credentials, query or fragment.');
export const siteURL = parsedURL.href.replace(/\/$/, '');
// Public indexing authorized for V1.0. Set PUBLIC_INDEXABLE=false for a restricted preview.
export const indexable = process.env.PUBLIC_INDEXABLE !== 'false';
export const siteName = 'Weslley 3Dezão — Soluções Digitais';
export const descriptions = {
  index: 'Sites, landing pages e soluções digitais com design, estratégia e tecnologia para fortalecer sua marca.',
  servicos: 'Conheça os serviços de websites, landing pages, lojas virtuais, redes sociais e apresentações de Weslley 3Dezão.',
  portfolio: 'Conheça projetos de websites, landing pages, catálogos e comunicação digital apresentados por Weslley 3Dezão.',
  contato: 'Fale com Weslley 3Dezão sobre seu projeto digital. Atendimento online em São Paulo, Brasil, por WhatsApp e e-mail.'
};
