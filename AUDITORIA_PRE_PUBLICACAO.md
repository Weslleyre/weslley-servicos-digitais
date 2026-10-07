# Auditoria de pré-publicação — Weslley 3Dezão

Data: 07/10/2026. Escopo: Home, Serviços, Portfólio e Contato, a partir do projeto aprovado. **Correções locais concluídas; publicação permanece pendente. Nenhuma publicação ou alteração de acesso foi realizada.**

## A. Bugs críticos encontrados

- **Formulário sem envio real:** `src/interactions.js` / formulário de Contato. A validação funciona, mas não há backend, entrega de e-mail ou persistência. Não foi inventada integração. Impacto: o formulário não pode ser anunciado como canal de envio operacional. Validado com e-mail inválido e dados fictícios válidos; a mensagem informa explicitamente que nenhum envio aconteceu.
- **Overflow na Home em 320 e 360 px:** coluna do hero não encolhia o suficiente. Corrigido; ver B/C.
- **Modal da Home com estudo de caso provisório:** o botão abria texto de desenvolvimento e não a imagem do projeto. Corrigido; ver B/G.

## B. Bugs corrigidos

| Problema | Arquivo/componente | Correção | Impacto e validação |
|---|---|---|---|
| Overflow do hero Home | `src/brand-process.css` | `min-width:0` e quebra de palavra como fallback, restritos aos textos rotativos do hero | Layout utilizável em telas estreitas; 60 combinações de página/largura sem overflow após a mudança |
| Modal provisório da Home | `src/pages.mjs`, `src/interactions.js`, `build.mjs` | Imagem real, alt e dimensões derivados do projeto; remoção do texto provisório do modal; bloqueio de scroll e retorno de foco | Enter abre imagem, Escape fecha, scroll/foco restaurados |
| Timers e animações continuavam fora da viewport | `src/interactions.js`, `src/brand-process.css` | Suspensão por IntersectionObserver, aba oculta, pagehide e reduced-motion; retomada controlada | Teste automatizado da rotação passa; evita trabalho contínuo desnecessário. Não foi medida redução quantitativa de CPU |
| Decode exposto como texto aleatório assistivo | `src/interactions.js` | Nome acessível preserva a frase original da headline | Leitura assistiva não depende dos caracteres temporários; validado no teste da rotação |
| Alvos pequenos de modal e nomes de serviços | `src/brand-process.css` | Controles da galeria com mínimo de 44 px; nomes de serviços com mínimo de 24 px | Melhora acionamento sem reconstruir o grid |
| Metadados de protótipo/incompletos | `build.mjs`, novo `src/site-config.mjs` | Títulos/descrições exclusivos, canonical, OG, Twitter, favicon, robots e sitemap | Auditoria estática passa nas quatro páginas; indexação continua desativada enquanto o site estiver restrito |
| Dimensões HTML diferentes das imagens | `src/components.mjs`, `src/assets.mjs` | Dimensões intrínsecas reais dos assets limpos do orbit e serviço 08 | Reserva de proporção mais precisa; tamanho visual CSS preservado |
| MIME de robots/sitemap | `server.mjs` | Tipos text/plain e application/xml | Ambos retornam 200 com Content-Type correto no servidor local |
| Peso de galerias | `src/assets.mjs`, `src/service-galleries.mjs`, `assets/`, `build.mjs` | 74 derivados WebP lossless; fontes PNG preservadas; distribuição contém apenas a variante utilizada | 21.287.399 bytes economizados; pixels decodificados comparados byte a byte |

## C. Responsividade

Verificadas as quatro páginas em **320, 360, 390, 430, 560, 768, 800, 820, 1024, 1100, 1280, 1440, 1920, 2560 e 3840 px**: 60 combinações, sem overflow horizontal e sem imagens carregadas quebradas. Evidência: `audit/browser-audit.json`.

Paisagem adicional: 844×390 e 1024×768 nas quatro páginas, sem overflow. Evidência: `audit/landscape-audit.json`. Imagens sem src dentro de modais fechados são carregadas ao abrir e não são arquivos quebrados.

Menu mobile: abertura, fechamento por Escape e retorno de foco verificados em 390 px. Assets do hero usam proporção original e contain; grid, tipografia, paleta e reservas de altura já aprovadas foram preservados. Captura da Home estreita: `audit/home-320.jpg`.

Limites: testes em viewport do navegador Chromium integrado; não equivalem a dispositivos físicos, Safari/Firefox ou hardware de Smart TV. Zoom real em 125/150/200% e aumento independente de texto em 200% não foram executados pela interface disponível. Reflow em largura reduzida foi verificado, mas não substitui esses testes.

## D. Performance

- Distribuição de assets passou de aproximadamente 116,81 para **96,51 MiB**. As 74 imagens otimizadas passaram de 85.737.081 para 64.449.682 bytes: redução de aproximadamente 25% nesse conjunto, sem perda de pixels.
- Heroes/logos permanecem sem lazy loading; galerias e imagens abaixo da dobra usam lazy loading. Dimensões e áreas reservadas existentes foram preservadas.
- Timers/rAF deixam de trabalhar continuamente quando conteúdo não está visível. Não foi feita refatoração agressiva de CSS/JS.
- Tipografia atual preservada, sem nova fonte externa ou biblioteca de runtime. `package.json` não possui dependências de aplicação a atualizar; não há lockfile de dependências.
- **Lighthouse mobile/desktop não produziu relatório:** tentativa com CLI oficial por pnpm falhou com EPERM ao criar symlink no Windows. Não foram inventadas notas. LCP, CLS e INP não foram medidos; estabilidade visual/local não equivale a métricas de campo. Reexecutar Lighthouse no ambiente de publicação, também com simulação de aparelho mais fraco.

## E. Acessibilidade

Quatro páginas com um h1 e um main; imagens com alt; SVGs inline com viewBox válido; labels do formulário; botões nativos e navegação de teclado. Foco de menu/modal e Escape verificados. Nome acessível do decode corrigido. Reduced-motion coberto pelo teste automatizado da lógica e regras CSS existentes; não houve emulação real da preferência do sistema no navegador.

**RECOMENDAÇÃO — requer aprovação:** contraste da cor lima sobre azul no item ativo do menu e azul sobre lima em “que utilizo”: aproximadamente **4,17:1**, abaixo dos 4,5:1 exigidos para texto pequeno. Não houve mudança automática de paleta/tipografia por essa diferença. Evidência: `audit/contrast-audit.json`; cálculo de fundos sólidos, não certificação de contraste de toda imagem.

**RECOMENDAÇÃO — requer aprovação:** avaliar controle visível de pausa para textos/contadores que se repetem automaticamente. Reduced-motion e suspensão fora da tela não substituem, por si só, todos os critérios de pausa de animação. Não foi adicionado componente visual novo. Esta auditoria não certifica conformidade WCAG completa.

## F. SEO

`src/site-config.mjs` centraliza origem e descrições. HTML final inclui lang pt-BR, viewport, títulos/descrições por página, canonical absoluto, OG/Twitter, imagem de compartilhamento local existente e favicon. `robots.txt` e `sitemap.xml` gerados no build.

Origem configurada: `https://weslley-3dezao-digitais.quick-cloud-3278.chatgpt.site`. O site existente está com acesso restrito/custom; por isso **indexable=false, noindex e Disallow permanecem intencionalmente**. Ao autorizar publicação pública, confirmar domínio definitivo, ajustar origem se necessário, habilitar indexable e gerar novo build. OG foi validado no HTML, mas preview externo em redes não foi confirmado enquanto o acesso é restrito.

## G. Formulários e links

- Varredura de destinos internos, âncoras, imagens, scripts e estilos: nenhum destino inexistente identificado. 80 verificações HTTP locais: arquivos existentes 200; rota inexistente 404. Evidências: `audit/static-audit.json`, `audit/http-audit.json`.
- Menu e rodapé têm destinos reais nas quatro páginas; estado ativo correto. Footer global reutilizado; CNPJ **14.319.613/0001-09**; sem placeholders visíveis nem “Etapa 01 — protótipo estrutural para revisão” no rodapé.
- WhatsApp: `https://wa.me/5511999720479`; e-mail: `mailto:criacoescamaleao@gmail.com`; localização: São Paulo/Brasil — Online. Número e endereço correspondem aos fornecidos pelo usuário.
- Instagram, TikTok e Google preservam as URLs fornecidas; links em nova aba possuem noopener noreferrer. Disponibilidade externa não confirmada: ferramentas de consulta tiveram bloqueio/cache miss; isso não comprova link quebrado. Abrir app WhatsApp, cliente de e-mail e redes em celular real permanece validação manual.
- Carrossel: todas as 11 posições atualizam título/imagem e índice; 11→01 e 01→11 verificados. Evidência: `audit/carousel-audit.json`.
- Galeria: abertura, próximo, Escape, bloqueio de scroll, foco inicial e retorno de foco verificados. Comparação antes/depois abre por teclado, range responde a End e Escape fecha. Clique fora possui handler; não foi exercitado de forma independente nesta rodada. Touch/swipe físicos não foram simulados; interação disponível por controles e teclado não depende de hover.
- Formulário: obrigatórios e e-mail inválido bloqueiam validação; preenchimento válido informa que não houve envio. Estados loading/sucesso/falha remotos e prevenção de duplicação de requisição não são testáveis porque não existe requisição. Não expor esse protótipo como formulário operacional.

## H. Imagens e assets

PNG dos heroes com transparência e proporção preservadas; não convertidos nesta auditoria. Blender/3ds Max transparentes, Adobe vetorial e Marmoset com base branca pequena mantidos. Valores são SVG via código. Nenhum placeholder de ferramenta/valor visível encontrado.

74 imagens opacas convertidas em WebP lossless, fontes originais intactas em `assets/`. Metadados/qualidade preservados; manifest `src/asset-variants.json`, script `scripts/optimize-gallery-assets.mjs`, comprovação `audit/image-optimization.json`. No build, só as cópias PNG substituídas são omitidas da distribuição.

150 arquivos de assets na distribuição; 28 maiores que 1 MB, 28 candidatos sem referência direta e 1 grupo duplicado por hash listados integralmente em `audit/static-audit.json`. Candidatos incluem versões antigas de logos/ferramentas, banners e arquivos de apoio. **Não apagados por dúvida de uso futuro.** Assets pesados permanecem disponíveis em alta qualidade para ampliação; total distribuído não equivale ao download inicial de cada página.

## I. Animações

Intervalos preservados: Serviços/Portfólio/Contato 3.000 ms; Home mantém sua configuração anterior de 6.500 ms. Headline e apoio trocam juntos, com reserva do maior bloco já aprovada. Sem mudança de identidade entre mensagens.

`scripts/audit-motion.test.mjs` executa a lógica real de rotação com adaptadores controláveis: loop 1→2→3→1, sincronismo, reduced-motion, aba oculta, entrada/saída de viewport e cancelamento de timers passam. É teste de lógica, não leitura de preferência real do sistema. Contadores preservam valores, símbolos e formatação pt-BR; agendamento suspenso quando ocultos. Flutuações continuam por transform, pausadas fora de tela; nenhuma animação adicional foi introduzida. Não foi coletado trace de CPU/jank/CLS.

## J. Segurança

Nenhum segredo/chave/token de aplicação identificado na varredura do frontend; nenhum script externo de runtime adicionado. Links externos seguros. Dados empresariais de contato/CNPJ são os aprovados. Formulário não armazena nem transmite os dados. Sem analytics, trackers ou nova biblioteca; não foi criada PWA.

Servidor local mantém política de desenvolvimento no-store; não deve ser tratado como configuração definitiva de produção. Avaliação de vulnerabilidade do runtime/host e headers depende do ambiente de hospedagem; inexistência de dependências de aplicação não certifica segurança do servidor.

## K. Publicação

Build, sintaxe de JS/build/servidor e git diff --check passam. Console das quatro páginas sem erros registrados; auditoria estática sem issues. Nenhuma mudança de design fora das correções técnicas descritas. Distribuição e ZIP foram atualizados localmente.

**Não publicado.** HTTPS, redirecionamento HTTP→HTTPS, cache com invalidação, Brotli/gzip, headers de segurança, MIME e tratamento de 404 devem ser confirmados no host final após autorização. Servidor local entrega 404 correto e MIME correto; não foi criada página 404 nova por desconhecer o tratamento da plataforma. Referências de produção são HTTPS; localhost HTTP é apenas desenvolvimento.

Checkpoint inicial: **389ce8d** (`Checkpoint before pre-publication audit`). O commit final tem mensagem **“Pre-publication audit: technical fixes and evidence”** e pode ser localizado com `git log --oneline -5`.

Rollback reversível: com checkout limpo, executar `git revert <hash-do-commit-final-da-auditoria>`; depois `node build.mjs` e regenerar o ZIP a partir de dist. Alternativa de consulta sem alterar checkout: `git show 389ce8d:<arquivo>`. Não executar reset --hard nem apagar fontes. Alterações posteriores devem ser preservadas antes de qualquer rollback.

## L. Pendências

1. Definir e implementar envio real do formulário, ou aprovar publicá-lo explicitamente como protótipo. Backend, credenciais, privacidade e estados de envio exigem escopo próprio.
2. Autorizar publicação; confirmar domínio/acesso público e só então habilitar indexação.
3. Reexecutar Lighthouse mobile/desktop e medir LCP/CLS/INP no host; bloqueio local EPERM registrado.
4. Validar Safari/Firefox, aparelhos físicos, touch, cliente WhatsApp/e-mail, zoom 125/150/200% e texto 200%; não declarar esses itens aprovados sem teste.
5. Validar headers, HTTPS, compressão, cache, 404 e previews sociais de produção.
6. Resolver recomendações de contraste e pausa mediante aprovação, caso se exija conformidade WCAG completa.

A auditoria local foi concluída com limitações documentadas; **o aceite irrestrito de publicação ainda não foi atingido** por essas pendências.

## M. Sugestões opcionais

- Revisar a lista de assets sem uso antes de removê-los; possível economia adicional sem sacrificar fontes.
- Considerar variantes menores responsivas para imagens de galeria, preservando versão integral de ampliação, somente após medir rede/benefício.
- Analytics apenas se solicitado, com política de privacidade correspondente; não adicionado.
- Ajustes visuais ou novos controles: **RECOMENDAÇÃO — requer aprovação**, nunca redesign automático.

## Arquivos alterados e evidências

Código: `build.mjs`, `server.mjs`, `src/assets.mjs`, `src/brand-process.css`, `src/components.mjs`, `src/interactions.js`, `src/pages.mjs`, `src/service-galleries.mjs`. Novos: `src/site-config.mjs`, `src/asset-variants.json`, scripts de auditoria/otimização, este relatório, evidências em `audit/` e 74 WebP em `assets/`. `dist/` regenerado; fontes PNG originais mantidas. Diretório preexistente `work/` não faz parte do checkpoint.

Reprodução: `node build.mjs`; `node --check src/interactions.js`; `node --check build.mjs`; `node --check server.mjs`; `node scripts/audit.mjs`; `node scripts/audit-motion.test.mjs`; `git diff --check`. Otimização opcional requer o módulo sharp já disponível no runtime, passado como argumento; não é dependência do site em produção.
