+++
author = "uphiago"
title = "Stack de Skills, MCP e Contexto de Projeto"
date = 2026-04-02T00:00:00-03:00
description = "Guia prático para construir agentes interoperáveis em qualquer runtime de IA."
tags = [
  "ai",
  "agents",
  "mcp",
  "llm",
  "skills",
  "prompt-engineering",
  "claude",
]
authors = ["uphiago"]
draft = false
+++

<!--more-->

---

> **Nota do Autor:** Este guia consolida as melhores práticas de engenharia de prompt e arquitetura de sistemas autônomos. Ele foi desenhado para desenvolvedores que desejam transitar de simples "prompts" para sistemas agênticos robustos e confiáveis.

## 0. Setup Rápido (TL;DR)

Quer começar agora? Veja como configurar o suporte a Skills em ambientes agênticos comuns.

| Plataforma | Como Configurar |
| :--- | :--- |
| **Codex** | Mantenha as skills em `skills/` no workspace e as regras do projeto em `AGENTS.md`. O agente usa esses artefatos como fonte primária de contexto operacional. |
| **Claude** | Crie a pasta `.claude/skills/` na raiz do projeto (ou `~/.claude/skills/` para uso pessoal). O Claude Code descobre as skills automaticamente ao iniciar: nenhuma configuração adicional é necessária. |
| **OpenCode** | As skills são carregadas automaticamente se estiverem na raiz do projeto em `.opencode/skills` ou `skills/`. Certifique-se de que o plugin de Agente está ativo. |

Para gerenciar skills em múltiplos agentes a partir de uma fonte única, [skills.sh](https://skills.sh) (Vercel Labs) instala em uma pasta central e propaga via symlinks: `npx skills add <repo>`.

> **Interoperabilidade:** O padrão Agent Skills é adotado por mais de 30 ferramentas: Claude Code, Codex, Cursor, VS Code, Gemini CLI, GitHub Copilot, Roo Code, OpenCode e outros. **Uma única Skill funciona em qualquer runtime compatível.** Não crie versões por ferramenta; o sistema de arquivos é a fonte da verdade universal. Veja a lista completa em [agentskills.io](https://agentskills.io).

---

## 1. A Nova Fronteira: Engenharia Agêntica

A era de utilizar LLMs apenas como chatbots consultivos acabou. Estamos vivendo a transição para **Agentes Autônomos**, sistemas capazes de orquestrar planejamento, execução de ferramentas e verificação de resultados. No entanto, a eficácia de um agente é diretamente proporcional à qualidade das ferramentas (Skills) fornecidas a ele.

Diferente de um prompt isolado, uma **Skill** é uma unidade funcional modular, reutilizável e determinística que expande as capacidades nativas do modelo.

### O Padrão de Arquitetura de Skills

Para garantir interoperabilidade entre as dezenas de plataformas que suportam o padrão Agent Skills, adotamos uma arquitetura baseada em **Isolamento de Contexto** e **Execução Segura**.

Isso resolve o problema da "Alucinação Funcional": pesquisas sobre modelos aumentados com ferramentas (incluindo Toolformer, Meta AI 2023, e o trabalho publicado pela Anthropic sobre construção de agentes eficazes) mostram que modelos ancorados em ferramentas bem definidas cometem significativamente menos erros lógicos.

### O "Stack" Agêntico

Para criar agentes realmente eficazes que entendam o contexto da sua organização, utilizamos três padrões complementares alinhados ao ecossistema da **Agentic AI Foundation**:

1. **MCP (Model Context Protocol):** A camada de **Acesso a Dados**. Responde "Quais ferramentas e dados posso acessar?" (ex: conectar ao Postgres ou Jira).
2. **Agent Skills:** A camada de **Know-How**. Responde "Como devo realizar esta tarefa?" (ex: metodologia de Code Review da empresa).
3. **AGENTS.md / CLAUDE.md:** A camada de **Contexto do Projeto**. Responde "Quais são as regras deste projeto específico?" (ex: usar React com Tailwind). No Claude Code, esse arquivo é o `CLAUDE.md`; no Codex e OpenCode, `AGENTS.md`.

A diferença competitiva entre abordagens de IA coding raramente está no modelo. Está no harness de execução: o loop do agente, o modelo de permissões, o sistema de ferramentas e a memória em camadas. Melhorar orquestração e governança consistentemente supera a troca de modelos.

---

## 2. Arquitetura Técnica de uma Skill

Para construir uma skill robusta, abandonamos estruturas orgânicas em favor de uma organização estrita. Não é apenas sobre pastas, é sobre **Progressive Disclosure** (Divulgação Progressiva).

### O Padrão "Progressive Disclosure"

Se carregássemos todo o conhecimento de uma vez, estouraríamos o contexto do modelo. Por isso, a arquitetura opera em 3 fases distintas:

- **Fase 1 (Discovery):** O agente escaneia apenas os metadados (YAML). Custo: ~100 tokens.
- **Fase 2 (Activation):** Ao escolher uma skill, o agente lê o `SKILL.md` completo. Custo: ~2k-5k tokens.
- **Fase 3 (Execution):** Scripts e referências pesadas são acessados apenas sob demanda. Custo: Zero até ser usado.

Esse padrão está alinhado com as recomendações oficiais da Anthropic para gerenciamento de contexto e construção de agentes:

- **Claude Docs - Long context prompting tips:** [platform.claude.com/docs/en/build-with-claude/prompt-engineering/long-context-tips](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/long-context-tips)
- **Anthropic Engineering - Building effective agents:** [anthropic.com/engineering/building-effective-agents](https://www.anthropic.com/engineering/building-effective-agents)
- **Evidência acadêmica sobre contexto ("Lost in the Middle"):** [arxiv.org/abs/2307.03172](https://arxiv.org/abs/2307.03172)

Preencher a janela além do necessário degrada a qualidade da recuperação, não só a eficiência. *"Lost in the Middle"* demonstra que modelos têm pior desempenho com conteúdo posicionado no meio de contextos longos: a curva de performance é em U, com os piores resultados no centro. Priorize contexto curto, relevante e verificável em vez de volume; evite carregar conteúdo que o agente não precisa para a tarefa atual.

![Diagrama do padrão Progressive Disclosure](/images/2026/agentic-engineering-progressive-disclosure.png)

---

### Estrutura de Diretórios da Skill

Uma skill deve implementar os seguintes componentes. O diretório base varia por plataforma: `.claude/skills/<nome>/` no Claude Code, `skills/<nome>/` no Codex, `.opencode/skills/<nome>/` no OpenCode.

### A. O Manifesto de Comportamento (`SKILL.md`)

Este arquivo atua como a **Interface de Controle** ou *System Prompt* dedicado.

- **Função:** Definir gatilhos de ativação e regras de negócio.
- **Tech Spec:** Deve conter metadados em YAML (frontmatter) e instruções em Markdown conciso.
- **Convenção de Nomes:** Use verbos no gerúndio para facilitar a descoberta semântica pelo agente (ex: `processing-pdfs`, `managing-databases`, `reviewing-code`).

> **Design Pattern: Graus de Liberdade (Degrees of Freedom)**
>
> - **Baixa Liberdade:** Para tarefas críticas (migrações, infra), use scripts rígidos. Não deixe a IA "pensar".
> - **Alta Liberdade:** Para tarefas criativas (code review, docs), dê diretrizes e exemplos, mas permita adaptação.

### Frontmatter e Execução Avançada

Além de `name` e `description`, estes campos deixam a skill mais previsível e poderosa:

- **`allowed-tools`**: define ferramentas permitidas durante a skill.
- **`disable-model-invocation`**: se `true`, a skill só roda por invocação manual.
- **`user-invocable`**: controla se a skill aparece no menu de comandos.
- **`argument-hint`**: documenta o formato esperado de argumentos.
- **`context: fork` + `agent`**: roda em subagente isolado para tarefas longas ou especializadas.
- **`model`**: define o modelo usado quando a skill está ativa (ex: `claude-opus-4-6`).

Nota: `allowed-tools` faz parte do padrão aberto Agent Skills. Todos os outros campos acima são extensões específicas do Claude Code e podem não estar disponíveis em outros runtimes.

O conteúdo do `SKILL.md` também suporta substituições dinâmicas:

- **`$ARGUMENTS`**: substituído por tudo que é passado ao invocar a skill. Ex: `/fix-issue 123` → `$ARGUMENTS` vira `123`.
- **`$ARGUMENTS[N]`** ou **`$N`**: acessa argumentos por posição. Ex: `/migrate SearchBar React Vue` com `$0`, `$1`, `$2`.

Exemplo:

```yaml
---
name: review-pr
description: Revisa PR com checklist de segurança, testes e legibilidade.
argument-hint: [pr-number]
allowed-tools: Read, Grep, Bash(gh pr view *), Bash(gh pr diff *)
---
```

### B. A Camada de Execução (`scripts/`)

Onde o determinismo acontece. Não peça para a IA "imaginar" como executar uma migração de banco de dados.

- **Função:** Scripts em Python, Bash ou Node.js que realizam a tarefa pesada.
- **Segurança:** Permite auditoria de código e execução em sandbox.
- **Progressive Disclosure (Nível 3):** Estes arquivos NUNCA são lidos pelo LLM, apenas executados. Isso garante zero consumo de tokens para a lógica pesada.

### C. A Base de Conhecimento (`references/`)

Documentação estática e exemplos (One-shot learning).

- **Função:** Fornecer contexto *Just-in-Time*. O agente só carrega esses arquivos se a tarefa exigir, economizando tokens.

![Estrutura de diretórios de uma skill](/images/2026/agentic-engineering-directory-structure.png)

---

## 3. Implementação e Uso por Ambiente

### Fundamentos Compartilhados entre Runtimes

Independente da ferramenta, todos os runtimes compatíveis com Agent Skills seguem os mesmos pilares: **MCP + Skills + Loop Research → Plan → Execute → Verify**.

1. **Pesquisa (Research):** O agente mapeia o estado atual: lê arquivos de contexto, regras do projeto e código relevante antes de tocar em qualquer coisa.
2. **Planejamento (Plan):** O agente quebra o trabalho em passos pequenos e verificáveis, definindo critérios de aceite antes de implementar.
3. **Execução (Execute):** O agente usa ferramentas e scripts (`scripts/`) para aplicar mudanças de forma determinística.
4. **Verificação (Verify):** O agente valida o resultado com testes, checks e critérios de qualidade antes de encerrar a tarefa.

O que muda entre as ferramentas é principalmente a **experiência de configuração/orquestração** (onde declarar agentes, memória e integrações), e não os princípios operacionais.

- **MCP em todos:** MCP é um padrão aberto e pode ser usado em todos os ambientes para conectar dados e ferramentas externas.
- **Codex (exemplo prático):** uso de `skills/` + `AGENTS.md` como contrato local do projeto e execução de ferramentas no workspace.
- **Claude Code (exemplo prático):** Sub-agents definidos em `.claude/agents/` (arquivos `.md` com frontmatter YAML) e contexto persistente em `CLAUDE.md`.
- **OpenCode (exemplo prático):** Skills em `skills/`, execução por scripts e validação contínua no loop autônomo.

> **Segurança Crítica:** Configure skills destrutivas (ex: `git push`, deleção de arquivos) para exigir aprovação humana explícita (*Human-in-the-loop*), independentemente da autonomia do agente.

---

## 4. Estudo de Caso: Criando a Skill `git-safe`

Vamos construir uma skill real para garantir operações Git seguras.

**Estrutura de Diretórios:**

```text
# Claude Code
.claude/skills/git-safe/
├── SKILL.md
└── scripts/
    └── pre_push_check.sh

# Codex / OpenCode
skills/git-safe/
├── SKILL.md
└── scripts/
    └── pre_push_check.sh
```

**Conteúdo do `SKILL.md` (Manifesto):**

```markdown
---
name: git-safe
description: Utilitário para operações seguras de versionamento.
allowed-tools: Bash(git *)
---
# Diretrizes
1. GATILHO: Quando o usuário solicitar sync/push.
2. AÇÃO: Execute `scripts/pre_push_check.sh`.
3. REGRA: Se o script falhar, aborte a operação e reporte o erro.
4. SEGURANÇA: Sempre solicite confirmação humana antes de qualquer push.
```

**Conteúdo do `pre_push_check.sh` (Execução):**

```bash
#!/bin/bash
# Bloqueia push direto na main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" = "main" ]; then
  echo "ERRO: Push direto na main bloqueado por política de segurança."
  exit 1
fi
```

---

## 5. Padrões Avançados de Arquitetura

Para levar seus agentes ao próximo nível, você pode implementar padrões de design avançados que imitam fluxos de trabalho humanos complexos.

### A. O Padrão "Evaluator-Optimizer"

Em vez de confiar na primeira resposta da IA, este padrão cria um loop de feedback interno.

- **Conceito:** Um agente "Gerador" produz uma solução, e um agente "Crítico" avalia. Se a avaliação for negativa, o Gerador refaz o trabalho com base no feedback.
- **Aplicação Prática (Code Review):**
  1. **Agente 1 (Dev):** Gera o código da skill.
  2. **Agente 2 (Sr. Engineer):** Analisa o código procurando vulnerabilidades. Se encontrar, devolve para o Agente 1.
  3. **Resultado:** Apenas código "aprovado" chega ao usuário.

### B. Loop de Qualidade (Validate-Fix-Repeat)

Nunca confie na primeira saída. O segredo da qualidade é o loop de feedback **imediato**.

1. **Ação:** O agente executa uma tarefa (ex: gera um JSON).
2. **Validação:** Um script roda imediatamente para verificar a integridade (ex: `validate_json.py`).
3. **Decisão:**
   - Se **Falha**: O agente lê o erro, corrige e tenta de novo.
   - Se **Sucesso**: Só então o resultado é apresentado ao usuário.

Isso previne o efeito cascata de erros e garante saídas robustas.

### C. Orquestração (Orchestrator-Workers)

Para tarefas massivas, um único agente se perde. A solução é delegar.

- **O Orquestrador:** Não põe a mão na massa. Ele analisa o pedido ("Construa um app completo"), quebra em sub-tarefas ("Criar DB", "Criar Frontend") e delega para sub-agents especializados.
- **Os Operários (Workers):** Sub-agents que só enxergam suas próprias ferramentas. O *Worker-SQL* não tem acesso a ferramentas de CSS, e vice-versa. Isso aumenta drasticamente a segurança e a precisão.

### D. Injeção de Contexto Dinâmico

A sintaxe `` !`comando` `` executa um comando shell *antes* de o modelo receber o prompt: o output substitui o placeholder no conteúdo da skill. O modelo nunca vê o comando, só o resultado já processado.

Útil para injetar dados ao vivo sem depender de memória ou contexto anterior:

```yaml
---
name: pr-summary
description: Resume as mudanças de um pull request
context: fork
agent: Explore
allowed-tools: Bash(gh *)
---

## Contexto do PR
- Diff: !`gh pr diff`
- Comentários: !`gh pr view --comments`
- Arquivos alterados: !`gh pr diff --name-only`

## Tarefa
Resuma as mudanças deste pull request com foco em impacto e riscos.
```

---

### E. Testes Automatizados (LLM-as-a-Judge)

Como saber se seu agente está performando bem? Use outra IA para testar.

- **Frameworks:** Ferramentas como *DeepEval* ou scripts customizados permitem criar "Unit Tests" para prompts.
- **Exemplo de Teste de Skill:**

```python
# test_agent.py
def test_git_safe_block():
    response = agent.run("Faça um push na main")
    assert "bloqueado" in response.output
    assert agent.tools_called == ["pre_push_check.sh"]
```

---

## 6. Referência Rápida

Esta seção é um checklist prático para começar a produzir com agentes, skills e MCP no dia a dia.

### 1. Onde as Skills Devem Ficar

- **Projeto (Claude Code):** `.claude/skills/<nome>/SKILL.md`
- **Projeto (Codex / OpenCode):** `skills/<nome>/SKILL.md`
- **Pessoal (Claude Code):** `~/.claude/skills/<nome>/SKILL.md` (disponível em todos os projetos)
- **Todos os agentes de uma vez:** use [skills.sh](https://skills.sh): instala em uma pasta, cria symlinks para Claude Code, Cursor, Codex e mais de 40 outros automaticamente.
- **Regra prática:** se afeta código/regras do repositório, mantenha no próprio repositório.

**Boas práticas para `CLAUDE.md` / `AGENTS.md`:** mantenha curto (200 linhas é uma heurística amplamente usada pela comunidade, não um limite oficial); inclua comandos de build, teste e lint; registre decisões arquiteturais e convenções do projeto; liste gotchas técnicos (ex: strict mode, regras de import); evite teoria; o que o linter já impõe não precisa viver aqui.

> **Nota:** `.claude/commands/` ainda funciona como alternativa mais simples: um único arquivo `.md` sem estrutura de pasta. Skills são recomendadas pois suportam arquivos de suporte, scripts e controle de invocação.

### 2. Como o Agente Descobre Skills

- O agente lê primeiro metadados (`name`, `description`).
- Depois carrega o `SKILL.md` da skill relevante.
- Scripts e referências só entram quando necessário (progressive disclosure).
- Descrição boa = ativação boa. Descrição vaga = skill pouco acionada.

### 3. Estrutura Recomendada de Skill

```text
# Claude Code
.claude/skills/nome-da-skill/
├── SKILL.md
├── references/
│   └── guia.md
└── scripts/
    └── run.sh

# Codex / OpenCode
skills/nome-da-skill/
├── SKILL.md
├── references/
│   └── guia.md
└── scripts/
    └── run.sh
```

- `SKILL.md`: objetivo, gatilho, fluxo e critérios de sucesso.
- `references/`: detalhes longos, exemplos, padrões.
- `scripts/`: execução determinística para tarefas críticas/repetitivas.

### 4. Skill Boa vs Skill Fraca

- **Boa:** escopo claro, entradas explícitas, saída esperada definida.
- **Fraca:** "faz tudo", sem critério de validação, sem exemplos.

### 5. Segurança Técnica no Uso Diário

- Nunca coloque segredo em `SKILL.md`, `references/` ou `AGENTS.md`.
- Sempre prefira script para ações sensíveis/repetitivas em vez de geração livre.
- Para ações destrutivas, exigir confirmação humana explícita.

### 6. Fluxo de Trabalho Recomendado

1. Defina a tarefa.
2. Veja se já existe skill no repositório.
3. Se não existir, crie uma skill mínima.
4. Rode no loop `Plan → Execute → Verify`.
5. Se funcionou, evolua com exemplos e script.
6. Se repetiu 3 vezes, virou candidata oficial do time.

### 7. Erros Comuns no Início

- Escrever `SKILL.md` longo sem separar em `references/`.
- Não declarar formato de argumentos.
- Não validar saída (teste/check/lint).
- Misturar regra do projeto dentro de prompt temporário em vez de `AGENTS.md`.

---

## 7. Recursos e Referências

Para aprofundar seu conhecimento em arquitetura de agentes e melhores práticas, consulte os seguintes materiais de referência da indústria:

**Documentação & Padrões:**

- **Agent Skills (especificação aberta):** [agentskills.io](https://agentskills.io): O padrão aberto de skills adotado por Claude Code, Codex, Cursor, VS Code, Gemini CLI, GitHub Copilot e outros.
- **skills.sh CLI (Vercel Labs):** [github.com/vercel-labs/skills](https://github.com/vercel-labs/skills): instale e gerencie skills em mais de 40 agentes via symlinks.
- **Model Context Protocol (MCP):** [modelcontextprotocol.io/docs/getting-started/intro](https://modelcontextprotocol.io/docs/getting-started/intro): O padrão aberto para conectar assistentes de IA a sistemas.
- **Claude Prompt Engineering (System prompts):** [platform.claude.com/docs/en/build-with-claude/prompt-engineering/give-claude-a-role-system-prompts](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/give-claude-a-role-system-prompts): Guia oficial de papéis e instruções de sistema.
- **Claude Prompt Engineering (Long context):** [platform.claude.com/docs/en/build-with-claude/prompt-engineering/long-context-tips](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/long-context-tips): Boas práticas para prompts longos e contexto extenso.

**Artigos Recomendados:**

- *"Building Effective Agents"* (Anthropic Engineering): [anthropic.com/engineering/building-effective-agents](https://www.anthropic.com/engineering/building-effective-agents)
- *"ReAct: Synergizing Reasoning and Acting in Language Models"*: [arxiv.org/abs/2210.03629](https://arxiv.org/abs/2210.03629)
- *"Toolformer: Language Models Can Teach Themselves to Use Tools"*: [arxiv.org/abs/2302.04761](https://arxiv.org/abs/2302.04761)
- *"Lost in the Middle: How Language Models Use Long Contexts"*: [arxiv.org/abs/2307.03172](https://arxiv.org/abs/2307.03172)

**Repositórios de Exemplo:**

- `awesome-mcp-servers`: [github.com/punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers)
- Exemplos de "Agentic Workflows": [LangChain](https://github.com/langchain-ai/langchain) e [AutoGen](https://github.com/microsoft/autogen)

---

## Conclusão

Skills + MCP + contexto de projeto formam um padrão operacional moderno para times de engenharia. Comece pequeno, padronize cedo e evolua com consistência.
