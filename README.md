# DIGITAIS_Site — Etapa 01

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
