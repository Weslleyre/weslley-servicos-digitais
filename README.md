# DIGITAIS_Site — Etapa 01

## Revisão concluída — serviços, marca e imagens

- Dez PNGs de `Página 02_SERVIÇOS.rar` aplicados aos grupos da página Serviços.
- Marca compartilhada em `src/brand.mjs`, com linhas sem sobreposição e sem fundo. Versão SVG reutilizável: `assets/brand/weslley-3dezao.svg` (para fundos escuros).
- Ícones vetoriais de processo em `src/process-icons.mjs`, associados pelo nome da etapa nas páginas Home, Serviços e Portfólio.
- Cinco imagens do banner com transparência real: `assets/illustrations/banner/notebook-clean.png`, `lojas-clean.png`, `campanhas-clean.png`, `redes-sociais-clean.png`, `email-marketing-clean.png`. Originais preservados.
- Personagem com base alongada: `assets/illustrations/personagem-base-estendida.png`. A plataforma avança sobre o rodapé, com espaço reservado antes dos links.

Edições raster feitas com a ferramenta integrada ImageGen. Prompt aplicado individualmente às cinco imagens: “Edit only the background of the supplied image. Remove all surrounding baked checkerboard and white background, make it genuinely transparent alpha. Preserve the exact original object, its perspective, colors, all lettering and screen content, and edges. Do not redesign, add, or crop the object. Output a transparent PNG, not a checkerboard rendering. Keep original landscape composition, except cart retains portrait composition.”

Prompt do personagem: “Edit this transparent astronaut artwork. Preserve astronaut, laptop, pose, proportions and ALL upper artwork unchanged. Extend the existing connected blue cubical pedestal downwards by approximately 30 percent of original image height, adding matching rows of connected glossy blue blocks with pink accent right faces. Keep same perspective and materials. The base should be a continuous substantial platform supporting the astronaut, not floating disconnected blocks. Canvas may extend downward; don't shrink or crop upper artwork. Genuine transparent alpha background, no checkerboard or solid backdrop. PNG.”

As observações históricas abaixo sobre fundos quadriculados não se aplicam às cinco versões limpas desta revisão. Os arquivos novos da página Serviços foram preservados conforme fornecidos.

## Atualização — banner central e personagem

Os nove arquivos de `ElementosBannerCentral.rar` formam o componente `SolutionsOrbit`: notebook central, oito elementos em volta, conexões pontilhadas em SVG e levitação CSS. Há pausa manual e respeito a `prefers-reduced-motion`. O personagem fornecido é compartilhado na faixa de CTA acima do rodapé das quatro páginas. Os arquivos originais foram preservados; alguns elementos possuem quadriculado opaco incorporado e precisam de novas versões com transparência real para eliminar esse fundo.

## Atualização — ícones de Nossos Serviços

Os sete PNGs enviados no pacote `Nosso Serviços_Página-01.rar` foram aplicados exclusivamente aos cards de Nossos Serviços da Home, preservando os arquivos originais. O registro em `src/assets.mjs` contém as associações, textos alternativos e dimensões 512 × 512. Os demais assets permanecem como placeholders. As observações abaixo sobre ausência de assets descrevem a entrega inicial.

Protótipo estrutural responsivo de Weslley 3Dezão — Serviços Digitais. Esta entrega termina na Etapa 01; nenhum asset final foi criado, extraído ou integrado.

## Executar

Opção simples: abra `dist/index.html` no navegador. As quatro páginas são arquivos HTML reais e funcionam localmente, sem instalação.

Com Node.js instalado, na pasta do projeto:

```sh
npm start
```

Acesse http://127.0.0.1:4173. Para regenerar os HTML após editar os componentes: `npm run build`. Não há dependências para instalar. Para conferir a sintaxe: `npm run check`.

## Estrutura

- `src/components.mjs`: Header, Footer, Button, HeroSection, SectionHeader, AssetPlaceholder, CTASection, ProcessStep, StatsCard e TestimonialCard.
- `src/pages.mjs`: composição das quatro páginas e ProjectCard.
- `src/content.mjs`: grupos e itens dos serviços, projetos das referências e textos comuns.
- `src/assets.mjs`: registro central para futura substituição dos placeholders.
- `src/styles.css`: tokens globais, componentes e regras responsivas.
- `src/interactions.js`: menu, filtros, modal, comparadores e validação demonstrativa do formulário.
- `build.mjs`: gera HTML estático, sem framework nem dependências.
- `server.mjs`: servidor de prévia local.
- `dist/`: entrega executável e publicável.
- `assets/`: pastas reservadas para os assets da próxima etapa.

## O que validar

Home → Serviços → Portfólio → Contato. Conferir em 1920, 1366, 768 e 390 pixels, incluindo navegação por teclado, menu mobile e ausência de rolagem horizontal. Grids mudam progressivamente; o layout é fluido e a largura máxima do conteúdo é 1320 px.

O portfólio tem filtros com estado ativo, contagem e estado vazio (Motion Design). Os botões de projeto abrem um diálogo demonstrativo, com fechamento por botão e Escape. Os comparadores funcionam por mouse, toque e teclado. O formulário valida os campos obrigatórios e e-mail, sem backend, armazenamento ou envio real.

## Fidelidade e conteúdo

As quatro imagens do pacote orientaram hierarquia, proporções, faixas, grids e sequência. Não foram incorporadas às páginas, recortadas nem usadas para recriar ilustrações. A navegação segue as quatro páginas pedidas, em vez dos seis itens visuais das referências. Fontes de sistema são provisórias, pois não foi fornecido arquivo ou nome de fonte aprovado.

Os textos de serviços foram preservados do briefing. Nomes e descrições de projetos legíveis nas referências são demonstrativos e estão sinalizados. Depoimentos, estatísticas, contatos, ferramentas e marcas ficam como placeholders para não apresentar dados da composição visual como fatos confirmados. Cabeçalho e rodapé usam placeholder de logo, sem marca inventada. A paleta foi centralizada nos cinco tokens pedidos; tons auxiliares são derivados com `color-mix`.

## Etapa 02 — somente após aprovação

Cada espaço tem um ID em `data-asset`, como `ASSET-HOME-HERO`. No momento, `src/assets.mjs` está vazio. Depois da aprovação, cadastrar o caminho, texto alternativo e dimensões reais; o componente já suporta `width`, `height`, carregamento prioritário no hero e `loading="lazy"` fora dele. Copiar os arquivos de `assets/` para `dist/assets/` é responsabilidade do gerador. Os espaços reservam proporções para reduzir mudanças de layout.

Confirmar número de WhatsApp, e-mail, localização, horários, números, depoimentos, redes sociais e cases antes de integrar conteúdo final. Nenhuma integração externa está ativa. A publicação de revisão deve permanecer privada; há `noindex` nas páginas, que não substitui controle de acesso.
