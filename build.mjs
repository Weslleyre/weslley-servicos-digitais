import { mkdir, writeFile, copyFile, cp, readFile, unlink } from 'node:fs/promises';
import { Header, Footer } from './src/components.mjs';
import * as pages from './src/pages.mjs';
import { projects } from './src/content.mjs';
import { BrandLogo } from './src/brand.mjs';
import { assets } from './src/assets.mjs';
import { siteURL, siteName, descriptions, indexable } from './src/site-config.mjs';
const root = new URL('./', import.meta.url);
await mkdir(new URL('dist/',root),{recursive:true});
// Portable wordmark for reuse on other sites, with no background rectangle.
const theme = await readFile(new URL('src/styles.css',root),'utf8');
const brandColor = name => theme.match(new RegExp(`--color-${name}:\\s*([^;]+)`))[1];
await writeFile(new URL('assets/brand/weslley-3dezao.svg',root),BrandLogo().replace('<g font-family=', `<style>.brand-accent,.brand-caption{fill:${brandColor('lime')}}</style><g font-family=`).replace('class="brand-wordmark"',`class="brand-wordmark" style="color:${brandColor('white')}"`));
const shell = (key,title,body) => {
  const url = `${siteURL}/${key}.html`, image = `${siteURL}/assets/brand/logotipo-home.png`;
  return `<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | ${siteName}</title><meta name="description" content="${descriptions[key]}"><meta name="robots" content="${indexable?'index,follow':'noindex,follow'}"><link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="${siteName}"><meta property="og:title" content="${title} | ${siteName}"><meta property="og:description" content="${descriptions[key]}"><meta property="og:url" content="${url}"><meta property="og:image" content="${image}"><meta property="og:image:width" content="800"><meta property="og:image:height" content="450"><meta property="og:image:alt" content="${siteName}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title} | ${siteName}"><meta name="twitter:description" content="${descriptions[key]}"><meta name="twitter:image" content="${image}"><link rel="icon" type="image/svg+xml" href="assets/brand/weslley-3dezao.svg"><link rel="stylesheet" href="styles.css"><link rel="stylesheet" href="brand-process.css"><script src="interactions.js" defer></script></head><body>${Header(key)}<main id="conteudo">${body}</main>${Footer()}</body></html>`;
};
for (const [key,title,render] of [['index','Home',pages.home],['servicos','Serviços',pages.servicos],['portfolio','Portfólio',pages.portfolio],['contato','Contato',pages.contato]]) {
  let html = shell(key,title,render());
  if(key==='index'||key==='portfolio') html=html.replace('</body>',`<script type="application/json" id="project-data">${JSON.stringify(projects.map(p=>({...p,...assets['ASSET-PROJETO-'+p.id]}))).replace(/</g,'\\u003c')}</script></body>`);
  await writeFile(new URL(`dist/${key}.html`,root),html);
}
await copyFile(new URL('src/styles.css',root),new URL('dist/styles.css',root));
await copyFile(new URL('src/brand-process.css',root),new URL('dist/brand-process.css',root));
await copyFile(new URL('src/interactions.js',root),new URL('dist/interactions.js',root));
await cp(new URL('assets/',root),new URL('dist/assets/',root),{recursive:true});
// Originals remain in the source checkout; omit replaced PNG copies from distribution.
const variants=JSON.parse(await readFile(new URL('src/asset-variants.json',root),'utf8'));
for(const {original,target} of variants){
  if(!/^assets\/(portfolio|service-galleries)\/[^\s]+\.png$/.test(original)||original.split('/').includes('..'))throw Error('Invalid asset variant path');
  const referenced=Object.values(assets).some(a=>a.src===original);
  if(!referenced&&target===original.replace(/\.png$/,'.webp'))await unlink(new URL(`dist/${original}`,root));
}
await writeFile(new URL('dist/robots.txt',root),`User-agent: *\n${indexable?'Allow: /':'Disallow: /'}\nSitemap: ${siteURL}/sitemap.xml\n`);
await writeFile(new URL('dist/sitemap.xml',root),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['index','servicos','portfolio','contato'].map(key=>`<url><loc>${siteURL}/${key}.html</loc></url>`).join('')}</urlset>`);
console.log('Protótipo gerado em dist/.');
export { shell, root };

