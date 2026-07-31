Você vai stress-testar o artigo de pentest-recon contra a metodologia real do `recon-skills`. e me entregue insights acionáveis.

O artigo está em 3 blocos:
1. "Crawl the Current Application" (linhas 14-27) — Katana, robots.txt, wordlists
2. "Map JavaScript-Rendered Applications" (linhas 33-43) — browser auth, XHR/WebSocket, state transitions
3. "Build an API and Identity Matrix" (linhas 80-107) — OpenAPI/Swagger, route inventory, identity matrix

PARA CADA BLOCO, execute:

BLOCO 1 — Crawl & Discovery
- Rode Katana contra sites reais (se katana não tiver no Recon, instale: go install github.com/projectdiscovery/katana/cmd/katana@latest)
- Rode `katana -u https://www.custoporprato.com.br -silent -jc -c 2 -p 2 -rl 2` como o artigo manda
- Capture a saída: quantas URLs reais vs lixo? Quantos endpoints de API? Quantos JS bundles?
- Compare com o que o `curl | grep` direto + scan_js.py já achou na sessão anterior (32 bundles, zero secrets)
- Pergunta: o Katana sozinho entrega algo que um curl + grep não entrega nesse Next.js SPA?

BLOCO 2 — API & Identity Matrix
- Extraia TODAS as rotas de API do JS bundle já baixado (ddbc81a2dbb53c86.js, a6dad97d9634a72d.js etc)
- Construa a matriz que o artigo pede: path, método, parâmetros, auth requerida, status codes
- Exemplo do que QUERO VER na matriz:
  POST /api/ai/chat          body: messages[], model    session cookie    200, 401
  GET  /api/ai/conversations                            session cookie    200, 401
  POST /api/stripe/checkout  body: priceId, quantity    session cookie    200, 401
  POST /api/stripe/webhook   body: stripe event         signature header  200, 400
- Compare com o que o artigo entrega como exemplo de matriz (linhas 85-89): ele só mostra paths genéricos como `/api/v1/projects/{id}`, sem métodos, sem auth, sem status codes reais

BLOCO 3 — Identity Matrix
- Mapeie os fluxos de identidade: Google OAuth, NextAuth session, anônimo
- Construa a matriz de identidade que o artigo pede:
  Anônimo  → rotas públicas (/, /blog, /chef-ia, /calculadora)
  Anônimo  → API v1 pública (/api/v1/states, /api/v1/products)
  Usuário A → rotas protegidas (/dashboard, /recipes, /chef)
- Teste: o artigo dá exemplos genéricos (User A, User B, Manager). No custoporprato real, quais são as roles REAIS? Existe manager/admin ou só user?

ENTREGÁVEL FINAL:

Um relatório Markdown com:
1. Tabela comparativa: o que o artigo ENSINA fazer vs o que REALMENTE funciona vs o que FALTA
2. Output real do Katana no custoporprato (com contagem de rotas úteis vs ruído)
3. Matriz de API completa extraída DOS BUNDLES REAIS (não genérica)
4. Matriz de identidade com as roles REAIS da aplicação
5. TOP 5 gaps do artigo que mais prejudicam um aluno (ordenado por impacto)
6. Sugestão de reescrita de 1 parágrafo do artigo (escolha o pior) com versão melhorada

Regras:
- NÃO invente outputs — se algo falhar, documente o erro e o motivo
- Se katana não instalar, use curl + grep como fallback e explique a diferença
- Use APENAS alvo autorizado (custoporprato.com.br ou hiago.sh)
- Mantenha controle de tempo: cada bloco não pode passar de 2 minutos de execução