// Optional audit utility; no dependency is added to the website or build.
// Usage: node scripts/optimize-gallery-assets.mjs <installed sharp module directory>
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const sharp=require(process.argv[2]||'sharp');
const audit=JSON.parse(fs.readFileSync('audit/static-audit.json','utf8'));
const candidates=audit.images.map(i=>i.src).concat(audit.largeAssets.filter(a=>a.referenced).map(a=>a.file));
const sources=['src/assets.mjs','src/service-galleries.mjs'];
const contents=new Map(sources.map(file=>[file,fs.readFileSync(file,'utf8')]));
const results=fs.existsSync('audit/image-optimization.json')?JSON.parse(fs.readFileSync('audit/image-optimization.json','utf8')):[];
for(const original of new Set(candidates)){
  if(!/^assets\/(?:portfolio|service-galleries)\/.*\.png$/.test(original))continue;
  if(![...contents.values()].some(s=>s.includes(original)))continue;
  if(!(await sharp(original).stats()).isOpaque)continue;
  const output=await sharp(original).keepMetadata().webp({lossless:true,effort:4}).toBuffer();
  const before=fs.statSync(original).size;
  if(output.length>before*.85)continue;
  const [a,b]=await Promise.all([sharp(original).ensureAlpha().raw().toBuffer(),sharp(output).ensureAlpha().raw().toBuffer()]);
  if(!a.equals(b))throw Error(`Pixel mismatch: ${original}`);
  const target=original.replace(/\.png$/,'.webp');fs.writeFileSync(target,output);
  for(const [file,text] of contents)contents.set(file,text.replaceAll(original,target));
  results.push({original,target,before,after:output.length,pixelIdentical:true});
}
for(const [file,text] of contents)fs.writeFileSync(file,text);
fs.writeFileSync('audit/image-optimization.json',JSON.stringify(results,null,2));
fs.writeFileSync('src/asset-variants.json',JSON.stringify(results.map(({original,target})=>({original,target})),null,2));
const before=results.reduce((s,r)=>s+r.before,0),after=results.reduce((s,r)=>s+r.after,0);
console.log(JSON.stringify({files:results.length,before,after,savedBytes:before-after,savedPercent:Math.round((1-after/before)*100)},null,2));
