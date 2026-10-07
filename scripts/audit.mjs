import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=path.resolve('dist'), pages=['index','servicos','portfolio','contato'];
const docs=new Map(pages.map(p=>[`${p}.html`,fs.readFileSync(path.join(root,`${p}.html`),'utf8')]));
const issues=[], external=new Set(), used=new Set(), images=[];
const decode=s=>s.replace(/&amp;/g,'&');
const attr=(tag,name)=>tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
function reference(raw,page){
  const url=new URL(decode(raw),`https://audit.local/${page}`);
  if(url.origin!=='https://audit.local'){external.add(url.href);return;}
  const file=decodeURIComponent(url.pathname.slice(1))||'index.html';
  used.add(file);
  if(!fs.existsSync(path.join(root,file)))issues.push({page,type:'missing-file',file});
  if(url.hash&&docs.has(file)){
    const id=decodeURIComponent(url.hash.slice(1));
    if(!docs.get(file).includes(`id="${id}"`))issues.push({page,type:'missing-anchor',file,id});
  }
}
for(const [page,html] of docs){
  for(const tag of html.matchAll(/<(?:a|img|script|link)\b[^>]*>/g)){
    const raw=attr(tag[0],'href')??attr(tag[0],'src');
    if(raw!==undefined){if(!raw)issues.push({page,type:'empty-link'});else reference(raw,page);}
    if(tag[0].startsWith('<img')){
      if(attr(tag[0],'alt')===undefined)issues.push({page,type:'missing-alt'});
      if(attr(tag[0],'src'))images.push({page,src:attr(tag[0],'src'),loading:attr(tag[0],'loading'),width:attr(tag[0],'width'),height:attr(tag[0],'height')});
    }
    if(attr(tag[0],'target')==='_blank'&&!/\brel="[^"]*noopener[^\"]*noreferrer/.test(tag[0]))issues.push({page,type:'unsafe-blank'});
  }
  for(const script of html.matchAll(/<script type="application\/json"[^>]*>([\s\S]*?)<\/script>/g)){
    const data=JSON.parse(script[1]);
    const visit=v=>{if(Array.isArray(v))v.forEach(visit);else if(v&&typeof v==='object'){if(v.src)reference(v.src,page);Object.values(v).forEach(visit);}};visit(data);
  }
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  if(new Set(ids).size!==ids.length)issues.push({page,type:'duplicate-id'});
  if((html.match(/<h1\b/g)||[]).length!==1)issues.push({page,type:'h1-count'});
  for(const key of ['description','viewport','twitter:card'])if(!html.includes(`name="${key}"`))issues.push({page,type:'missing-meta',key});
  if(!html.includes('rel="canonical"'))issues.push({page,type:'missing-canonical'});
}
for(const file of ['styles.css','brand-process.css','interactions.js']){
  const source=fs.readFileSync(path.join(root,file),'utf8');
  for(const m of source.matchAll(/assets\/[a-zA-Z0-9_./-]+\.(?:png|svg|jpg|webp)/g))reference(m[0],'index.html');
}
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const files=walk(path.join(root,'assets')), hashes=new Map();
const inventory=files.map(file=>{
  const data=fs.readFileSync(file),relative=path.relative(root,file).replaceAll('\\','/'),hash=crypto.createHash('sha256').update(data).digest('hex');
  if(!hashes.has(hash))hashes.set(hash,[]);hashes.get(hash).push(relative);
  return {file:relative,bytes:data.length,referenced:used.has(relative)};
});
const result={pages:pages.length,issues,external:[...external].sort(),images,assetCount:inventory.length,assetBytes:inventory.reduce((sum,f)=>sum+f.bytes,0),largeAssets:inventory.filter(f=>f.bytes>1000000).sort((a,b)=>b.bytes-a.bytes),unusedCandidates:inventory.filter(f=>!f.referenced),duplicates:[...hashes.values()].filter(g=>g.length>1)};
fs.mkdirSync('audit',{recursive:true});fs.writeFileSync('audit/static-audit.json',JSON.stringify(result,null,2));
console.log(JSON.stringify({pages:result.pages,issues,external:result.external,assetCount:result.assetCount,assetMB:(result.assetBytes/1048576).toFixed(2),unusedCandidates:result.unusedCandidates.length,duplicateGroups:result.duplicates.length,largeAssets:result.largeAssets.length},null,2));
if(issues.length)process.exitCode=1;
