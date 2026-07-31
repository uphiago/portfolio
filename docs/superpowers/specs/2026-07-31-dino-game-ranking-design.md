# T-Rex Dino Game + Top 10 Ranking — Design

## Objetivo

Substituir o conteúdo "soon / work in progress" do card de vídeo da landing
(`VideoCard`, grid 7×5) pelo jogo do dinossauro (t-rex-runner, extraído do
Chrome offline) e adicionar um ranking global top 10 persistido no Supabase.

## Componentes

### 1. Jogo (vendor, sem iframe)
- `public/dino/100-offline-sprite.png` e `public/dino/200-offline-sprite.png`:
  sprites do jogo (1x/2x), copiados do repositório t-rex-runner.
- `public/dino/runner.js`: código original do jogo com patches mínimos:
  - remover auto-init em `DOMContentLoaded`;
  - ignorar teclas quando o foco está em input/textarea/contenteditable;
  - áudio opcional (sem template `#audio-resources`, jogo roda mudo);
  - `setArcadeMode`/scale relativos ao container do card (não à janela);
  - guard no `querySelector('.icon-offline')`;
  - callback `config.onGameOver(score)` no game over;
  - método `destroy()` para cleanup (remove listeners, limpa singleton).
- Carregado via `<Script src="/dino/runner.js" strategy="afterInteractive">`.
- Visual dark: `filter: invert(1)` no canvas (sprites pretos viram brancos,
  fundo `#f7f7f7` vira escuro) — combina com o card `#0a0a0a`.

### 2. Componente `DinoGame.jsx` (client)
- Renderiza o container `.interstitial-wrapper` + sprites escondidos
  (`#offline-resources-1x/2x`) + `.icon-offline` + hint "press space / tap to start".
- Inicializa `new window.Runner(...)` no mount (após o script carregar) e faz
  cleanup no unmount.
- No game over: mostra best score, pede nickname na primeira vez (salvo no
  localStorage), envia score via `POST /api/dino/score` e recarrega o ranking.
- `VideoCard` mantém o header "soon / work in progress" (mesmos textos, testes
  existentes continuam passando) e o jogo + ranking no corpo do card.

### 3. Ranking Supabase (top 10)
- Tabela `dino_scores` (`id` uuid, `nickname` text, `score` int, `created_at`):
  SQL de setup em `docs/supabase/dino_scores.sql`, com RLS (leitura pública,
  escrita só via service role).
- `src/lib/dinoRanking.js`: acesso via REST do Supabase (PostgREST, sem
  dependência nova) usando `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`.
- `GET /api/dino/scores`: top 10 (`order=score.desc&limit=10`), rota
  `force-dynamic` para sempre recarregar no F5. Sem env → `{ disabled: true }`.
- `POST /api/dino/score`: valida nickname (1–24 chars, sanitizado) e score
  (1–99999), rate-limit por IP (mapa em memória, estilo da rota de subscribe).
- UI: lista compacta top 10 no card (mono, estilo do site), posição do jogador
  destacada quando entra no top 10; atualiza no game over e a cada F5.

## Config
- `.env.example` e `.env.local`: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
- Sem credenciais o ranking fica `disabled`; o jogo continua funcionando
  normalmente com best score local.

## Testes e deploy
- Testes: manter os existentes; adicionar checks de render do card (container do
  jogo, ranking) e unit tests da lib/rotas (validação, rate-limit, fetch mockado).
- Deploy: validar com `npm test` + `npm run build`, merge na `main` e push para
  `uphiago/portfolio` (Vercel publica em hiago.sh) — com aprovação do usuário.
