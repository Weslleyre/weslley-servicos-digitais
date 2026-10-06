import { AssetPlaceholder as A, SectionHeader as H } from './components.mjs';
import { assets } from './assets.mjs';

export function ComparisonSection() {
  const names = ['Site Institucional','Perfil Profissional','Página de Vendas','Catálogo de Produtos'];
  return `<section class="section" id="antes-depois"><div class="container">${H('Antes e depois')}<div class="comparison-grid">${names.map((name,i)=>{
    const image = assets[`ASSET-ANTES-${i+1}`];
    return `<article class="comparison-card" data-comparison-name="${name}"><div class="comparison" style="--split:50%;--comparison-ratio:${image.width}/${image.height}"><div class="before">${A(`ASSET-ANTES-${i+1}`)}</div><div class="after">${A(`ASSET-DEPOIS-${i+1}`)}</div><span class="before-label">Antes</span><span class="after-label">Depois</span><button type="button" class="comparison-open" aria-label="Ampliar comparação: ${name}" aria-haspopup="dialog"><span aria-hidden="true">⤢</span></button><div class="comparison-handle" role="slider" tabindex="0" aria-label="Divisão da comparação: ${name}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-valuetext="50% depois"><span aria-hidden="true">↔</span></div></div><div class="comparison-control"><label for="compare-${i}">${name}</label><input id="compare-${i}" type="range" min="0" max="100" value="50" aria-label="Comparar antes e depois: ${name}"><output for="compare-${i}">50% depois</output></div></article>`;
  }).join('')}</div></div></section><dialog id="comparison-dialog" aria-label="Comparação ampliada"><div class="comparison-modal-panel"><button type="button" class="comparison-close" aria-label="Fechar comparação ampliada">×</button><div class="comparison-modal-content"></div></div></dialog>`;
}
