# MNV — Segurança contra Incêndio e Pânico

Site institucional da MNV, consultoria em segurança contra incêndio no Rio de Janeiro: legalização, redação de AVCB, vistoria do CBMERJ e alvará do Corpo de Bombeiros.

## Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4

## Rodando local

```bash
npm install
npm run dev
```

O site sobe em [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando             | O que faz                                  |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | servidor de desenvolvimento                |
| `npm run build`     | build de produção                          |
| `npm run lint`      | ESLint                                     |
| `npm run typecheck` | checagem de tipos                          |
| `npm run check`     | lint + typecheck + build (rodar antes de commitar) |
| `npm run brand:assets` | regenera favicon e OG image a partir de `scripts/generate-brand-assets.mjs` |

## Como o projeto está organizado

- `src/app/` — páginas, layout e metadados (SEO, favicon, OG image).
- `src/components/sections/` — as seções da home (Hero, Serviços, Depoimentos, FAQ, Footer…). É ali que mora quase todo o visual.
- `src/lib/faq.ts` — perguntas frequentes, usadas na página e no schema do Google.
- `src/lib/assets.ts` — mapa dos ícones e imagens usados nas seções.
- `public/` — imagens, fontes e ícones servidos pelo site (`public/images/` tem os assets das seções).
- `assets/img/` — originais (hero, thumb, favicon, OG image).
- `scripts/generate-brand-assets.mjs` — gera favicon e OG image (`npm run brand:assets`).

## Antes de publicar

Checklist de coisas que ainda são placeholder:

- [ ] Confirmar o domínio em `metadataBase` (`src/app/layout.tsx`) — hoje está como `https://mnvseguranca.com.br`.
- [ ] Trocar os contadores (200/150/200/150) e os depoimentos pelos dados reais.
- [ ] Definir o destino do botão "Falar com especialista" (hoje abre e-mail).

---
Desenvolvido por **2swebtech**.
