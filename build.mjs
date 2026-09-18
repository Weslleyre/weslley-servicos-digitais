import { mkdir, writeFile, copyFile, cp } from 'node:fs/promises';
import { Header, Footer } from './src/components.mjs';
import * as pages from './src/pages.mjs';
import { projects } from './src/content.mjs';
const root = new URL('./', import.meta.url);
await mkdir(new URL('dist/',root),{recursive:true});
const shell = (key,title,body) => `<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | Weslley 3Dezão — Serviços Digitais</title><meta name="description" content="Protótipo estrutural — Etapa 01. Weslley 3Dezão — Serviços Digitais."><meta name="robots" content="noindex,nofollow"><link rel="stylesheet" href="styles.css"><script src="interactions.js" defer></script></head><body>${Header(key)}<main id="conteudo">${body}</main>${Footer()}</body></html>`;
for (const [key,title,render] of [['index','Home',pages.home],['servicos','Serviços',pages.servicos],['portfolio','Portfólio',pages.portfolio],['contato','Contato',pages.contato]]) {
  let html = shell(key,title,render());
  if(key==='index'||key==='portfolio') html=html.replace('</body>',`<script type="application/json" id="project-data">${JSON.stringify(projects).replace(/</g,'\\u003c')}</script></body>`);
  await writeFile(new URL(`dist/${key}.html`,root),html);
}
await copyFile(new URL('src/styles.css',root),new URL('dist/styles.css',root));
await copyFile(new URL('src/interactions.js',root),new URL('dist/interactions.js',root));
await cp(new URL('assets/',root),new URL('dist/assets/',root),{recursive:true});
console.log('Protótipo gerado em dist/.');
export { shell, root };
