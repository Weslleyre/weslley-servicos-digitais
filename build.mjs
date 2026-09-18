import { mkdir, writeFile, copyFile, cp, readFile } from 'node:fs/promises';
import { Header, Footer } from './src/components.mjs';
import * as pages from './src/pages.mjs';
import { projects } from './src/content.mjs';
import { BrandLogo } from './src/brand.mjs';
const root = new URL('./', import.meta.url);
await mkdir(new URL('dist/',root),{recursive:true});
// Portable wordmark for reuse on other sites, with no background rectangle.
const theme = await readFile(new URL('src/styles.css',root),'utf8');
const brandColor = name => theme.match(new RegExp(`--color-${name}:\\s*([^;]+)`))[1];
await writeFile(new URL('assets/brand/weslley-3dezao.svg',root),BrandLogo().replace('<g font-family=', `<style>.brand-accent,.brand-caption{fill:${brandColor('lime')}}</style><g font-family=`).replace('class="brand-wordmark"',`class="brand-wordmark" style="color:${brandColor('white')}"`));
const shell = (key,title,body) => `<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | Weslley 3Dezão — Serviços Digitais</title><meta name="description" content="Protótipo estrutural — Etapa 01. Weslley 3Dezão — Serviços Digitais."><meta name="robots" content="noindex,nofollow"><link rel="stylesheet" href="styles.css"><link rel="stylesheet" href="brand-process.css"><script src="interactions.js" defer></script></head><body>${Header(key)}<main id="conteudo">${body}</main>${Footer()}</body></html>`;
for (const [key,title,render] of [['index','Home',pages.home],['servicos','Serviços',pages.servicos],['portfolio','Portfólio',pages.portfolio],['contato','Contato',pages.contato]]) {
  let html = shell(key,title,render());
  if(key==='index'||key==='portfolio') html=html.replace('</body>',`<script type="application/json" id="project-data">${JSON.stringify(projects).replace(/</g,'\\u003c')}</script></body>`);
  await writeFile(new URL(`dist/${key}.html`,root),html);
}
await copyFile(new URL('src/styles.css',root),new URL('dist/styles.css',root));
await copyFile(new URL('src/brand-process.css',root),new URL('dist/brand-process.css',root));
await copyFile(new URL('src/interactions.js',root),new URL('dist/interactions.js',root));
await cp(new URL('assets/',root),new URL('dist/assets/',root),{recursive:true});
console.log('Protótipo gerado em dist/.');
export { shell, root };

