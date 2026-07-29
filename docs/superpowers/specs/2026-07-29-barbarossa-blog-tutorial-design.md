# Barbarossa Blog Tutorial Redesign

## Goal

Replace the existing Hermes-focused article with an English, tutorial-first
introduction to Barbarossa. The article keeps the first-person agent voice, but
Barbarossa is the speaker and Hermes is one internal orchestration runtime.

## Positioning

Barbarossa is a portable pattern for connecting an orchestrator to isolated,
specialized workers through typed capabilities and durable jobs. The article
must not present one provider, model, worker count, or concurrency limit as an
architectural requirement.

The current repository profile, with Hermes, Forge, and Recon, is the concrete
reference implementation used by the tutorial. Values such as DeepSeek, Codex
GPT-5.6 Luna, and the current parallelism limits may appear only as examples
that operators can replace or tune.

## Narrative

- Title: `I'm Barbarossa. This Is How I Work.`
- Author: `Barbarossa + @uphiago`
- Preserve the direct first-person voice of the existing article.
- Do not describe or compare the previous two-container architecture.
- Open with the Barbarossa artwork, linked to the public repository.
- Link `https://github.com/uphiago/barbarossa` as the primary source.

## Tutorial Flow

1. Introduce Barbarossa and show the result being built.
2. Explain requirements and the external secret files.
3. Configure `.env` without publishing real credentials.
4. Run `setup.sh` and explain what it validates.
5. Exercise the first capability and job lifecycle.
6. Explain routing, workers, lanes, and parallel execution.
7. Cover Codex engineering, subagents, and image capabilities.
8. Distinguish direct network work from explicit Tor routing.
9. Explain trust boundaries, Telegram authorization, and secret scoping.
10. Describe retained state, portability, and manual promotion to private Git.
11. Run the complete smoke test.
12. Show how to extend the router, Compose topology, and capability contract.

## Accuracy Constraints

- SSH is an internal restricted transport; MCP is the agent-facing contract.
- Workers are non-root, resource-bounded, read-only, and have no Docker socket.
- Forge and Recon are isolated from one another in the reference profile.
- Jobs use submit, status, logs, result, and cancel operations.
- Tor is explicit and never an automatic fallback.
- Codex is an optional capability, not the orchestrator.
- New worker types require explicit Compose, router, and contract changes.
- Named volumes are operational state, not backups.
- Telegram access uses pairing or an explicit allowlist.
- Secrets, tokens, account identifiers, host addresses, and private findings
  must not appear in the article.

## Verification

Review every command against `uphiago/barbarossa` `origin/main`. Confirm the
article renders as Markdown, contains no stale paths or variables, and does not
claim that configurable examples are fixed architectural requirements.
