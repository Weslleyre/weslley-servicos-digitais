import { serviceGalleries } from './service-galleries.mjs';
import { assets } from './assets.mjs';
import { serviceItemIcons } from './service-item-icons.mjs';
import { websiteHeadlines } from './website-headlines.mjs';
import { serviceHeadlines } from './service-headlines.mjs';
import { escapeHTML as e } from './components.mjs';
function serviceItem(group, item, g, i) {
 const icon = serviceItemIcons[group.title]?.[item.title];
 return `<li><button class="service-name" data-service-group="${g}" data-service-index="${i}"${icon?` data-service-icon="${e(icon.src)}"`:''} data-website-headline="${e(g===0?websiteHeadlines[item.title]:serviceHeadlines[g][item.title])}" type="button" aria-haspopup="dialog">${e(item.title)}</button></li>`;
}
export function ServiceCards(){
 return serviceGalleries.map((group,g)=>`<article class="service-card tone-${g%3}" id="servico-${String(g+1).padStart(2,'0')}"><div class="asset service-preview"><button class="service-art-link" data-service-group="${g}" data-service-index="0" type="button" aria-label="Ver ${e(group.items[0].title)}"><img class="service-category-art" src="${assets['ASSET-SERVICO-'+String(g+1).padStart(2,'0')].src}" alt="${e(group.title)}" width="${assets['ASSET-SERVICO-'+String(g+1).padStart(2,'0')].width}" height="${assets['ASSET-SERVICO-'+String(g+1).padStart(2,'0')].height}" loading="lazy" decoding="async"><img class="service-selected-art" alt="" hidden></button><p class="website-service-headline" aria-live="polite" hidden></p></div><div class="service-body"><h2><span class="service-number">${String(g+1).padStart(2,'0')}</span>${e(group.title)}</h2><ul>${group.items.map((item,i)=>serviceItem(group,item,g,i)).join('')}</ul></div></article>`).join('');
}
export function ServiceGalleryDialog(groups = serviceGalleries){
 return `<div id="service-hover-preview" class="service-hover-preview" hidden aria-hidden="true"><img alt=""><span></span></div><dialog id="service-gallery" class="service-gallery" aria-labelledby="service-gallery-title"><div class="gallery-panel"><button type="button" class="gallery-close" aria-label="Fechar janela">×</button><div class="gallery-image-stage"><img id="service-gallery-image" alt=""></div><div class="gallery-copy"><p id="service-gallery-category"></p><h2 id="service-gallery-title"></h2><p id="service-gallery-description"></p></div><footer class="gallery-controls"><button type="button" class="gallery-arrow" data-gallery-prev aria-label="Imagem anterior">←</button><span id="service-gallery-count" role="status" aria-live="polite"></span><button type="button" class="gallery-arrow" data-gallery-next aria-label="Próxima imagem">→</button></footer></div></dialog><script type="application/json" id="service-gallery-data">${JSON.stringify(groups).replace(/</g,'\\u003c')}</script>`;
}
