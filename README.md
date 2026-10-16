# Gerador de Orçamentos · Coktelitas

App de uso interno para gerar o orçamento/proposta da Coktelitas Drinks & Cocktails como PDF,
visualmente idêntico ao modelo do Canva, a partir de um painel de campos.

## Como funciona

- `/` — editor: painel de campos à esquerda, preview A4 à direita (todo texto do preview é editável ao clicar).
- `/tabela` — tabela de preços e catálogo de drinks (salvo no navegador; exportar/importar JSON).
- `/imprimir` — página de impressão (abre em nova aba ao clicar em **Gerar PDF**; usa a impressão do Chrome →
  "Salvar como PDF"). Nome do arquivo: `Nome-orçamento.pdf`.

Não há login nem banco: um usuário, dados salvos no `localStorage`.

**Histórico**: **Salvar** e **Gerar PDF** guardam uma versão do orçamento (botão **Histórico** no topo).
Para dar desconto depois: abrir o orçamento no histórico → alterar (ajuste geral ou preços da página 4) →
Gerar PDF; vira a versão seguinte do mesmo orçamento, e as anteriores continuam disponíveis. Dá para
duplicar, excluir e exportar/importar um backup em JSON (`coktelitas.historico.v1`).

## Estrutura

```
src/doc/
  types.ts        modelo (Proposta, Config)
  config.ts       tabela padrão (planilha 2026/2027), catálogo, presets, persistência
  pricing.ts      motor de cálculo (regras R1–R11) + pricing.test.ts
  historico.ts    orçamentos salvos com versões (localStorage) + historico.test.ts
  layout.tsx      primitivas A4 em pontos (Page, Txt, Box, Img) e métricas de fonte
  context.tsx     DocProvider + <E> (texto editável inline com sobrescrita)
  Documento.tsx   monta as 9 páginas (página 4 muda com o regime)
  pages/          P1Capa … P7Pagamento, PStatic (p2/p8/p9), MenuBox, Servicos
  assets/svg/     vetores extraídos do PDF original (logo, ícones, títulos)
public/doc/       imagens (capas, aquarelas, fotos, páginas fixas em 300 dpi)
src/components/editor/  painel, editor, tabela de preços
```

## Regras principais

- **Regime**: convidados < 70 → "Coquetéis limitados" (p.4a); ≥ 70 → "Open bar" (p.4b).
- **Open bar**: `convidados_faixa × R$/pessoa ÷ 4 × horas × (1 + acréscimo)`; faixa = aba mais próxima da
  planilha; acréscimo 2027 por quadrimestre (5/10/15%).
- **Limitado**: 150/200 unidades × R$16/17/18/20.
- Todo valor calculado pode ser sobrescrito no preview (marcado com ponto laranja). "Ajuste geral" aplica
  um desconto/acréscimo em todas as opções sem aparecer no PDF.
- Painel **Coquetéis (página 4)**: regime, faixa da planilha, horas, acréscimo %, unidades, R$/unidade e os
  preços de cada opção são sugeridos pela tabela e editáveis (campos em amarelo = editados à mão; ↺ volta ao
  automático; "Preços automáticos" zera tudo). Guardado em `Proposta.precos` (parâmetros) e
  `Proposta.overrides` (`ob.preco.N`, `lim.total.OP.F`).

## Desenvolvimento

```
bun install
bun run dev      # http://localhost:8080
bun run test     # motor de cálculo
bun run lint
```

Posições e tamanhos das páginas estão em pontos PDF (595,5 × 842,25 pt), medidos nos PDFs originais.
Ao ajustar layout, mantenha as unidades em `pt`.
