+++
author = "@uphiago"
title = "Hermes Barbarossa: Orchestrating Isolated Workers"
slug = "hermes-barbarossa"
date = 2026-06-28T00:00:00-03:00
lastmod = 2026-07-29T00:00:00-03:00
description = "A practical guide to Barbarossa: typed MCP capabilities, isolated workers, durable jobs, Codex engineering, image tools, and explicit network routing."
tags = [
  "barbarossa",
  "agents",
  "mcp",
  "infra",
  "docker",
  "codex",
  "automation",
  "security",
]
draft = false
+++

> **TL;DR:** Barbarossa connects an agent orchestrator to isolated workers through typed MCP capabilities and durable jobs.
> [github.com/uphiago/barbarossa](https://github.com/uphiago/barbarossa) - continue for its architecture, deployment, routing, and verification.

> **Author's note:** An agent is not a worker, and a worker is not a task.
> Skills define routing and evaluation, `AGENTS.md` sets operational
> boundaries, and an optional `SOUL.md` preserves behavior. Scale by adding
> isolated lanes, workers, or agent instances without sharing resource,
> credential, filesystem, or network boundaries.

<!--more-->

[Barbarossa](https://github.com/uphiago/barbarossa) is a portable runtime that
keeps execution outside the orchestrator. Its public reference implementation
uses three containers, typed MCP v2 capabilities, durable jobs, isolated
direct and Tor networking, and configurable models and concurrency.

---

## Architecture

The runtime follows this structure:

```text
Telegram / API
       |
  orchestrator
       |
  typed MCP capabilities
       |
  isolated workers
       |
  durable jobs and bounded results
```

The repository separates orchestration, typed routing, worker execution, and
durable job state. Its concrete profile is:

```text
Hermes (orchestration)
|-- Forge
|   |-- runtime lane
|   `-- Codex lane
`-- Recon
    |-- direct network
    `-- Tor (explicit)
```

The three services are `hermes`, `forge`, and `recon`. The MCP router is a PEX
subprocess inside Hermes, not a fourth service. It reaches workers over
restricted SSH, while Hermes receives only typed submit, status, log, result,
and cancellation operations.

### Reference Profile

The checked-in values define a replaceable reference profile:

| Component | Example default | Admission policy |
| :--- | :--- | :--- |
| Hermes | DeepSeek V4 Flash through its native API | Up to three child tasks, one level deep |
| Forge runtime | Shell, files, builds, and conversions | One runtime job |
| Forge Codex | GPT-5.6 Luna with medium reasoning | One Codex job with at most one internal subagent |
| Recon | Authorized direct or explicit-Tor networking | One network job |

The three lanes can run concurrently. Provider, model, reasoning, child-agent,
and Codex subagent settings come from the environment. Scaling may add lane
capacity or worker replicas, but each route still needs explicit identity,
resource and credential limits, isolation, durable state, and verification.

## 1. Local Bootstrap And Production Requirements

The machine running `./setup.sh` from source requires:

- Docker with Compose;
- `ssh-keygen`;
- Python 3 and [`uv`](https://docs.astral.sh/uv/).

Python and `uv` only build the router PEX. A production host receiving prebuilt
images and the bundle needs Docker Compose and OpenSSH utilities, not the
Python toolchain. Both modes need model, Telegram, dashboard, and Codex
credentials.

Clone the project:

```bash
git clone https://github.com/uphiago/barbarossa.git
cd barbarossa
cp .env.example .env
cp hermes.env.example hermes.env
```

Two private environment files have different consumers:

| File | Consumer | Configuration |
| :--- | :--- | :--- |
| `.env` | Compose and Barbarossa scripts | Runtime paths, image tag, dashboard bind, resources, Codex execution profile, external credential paths |
| `hermes.env` | Hermes container only | Main model, native delegation, provider credentials, Telegram, Tool Gateway, dashboard authentication |

`.runtime/compose.env` is generated and contains only the resolved runtime
path and image tag. Configure infrastructure and Forge in `.env`:

```dotenv
BARBAROSSA_RUNTIME_DIR=.runtime
BARBAROSSA_HERMES_ENV_FILE=./hermes.env
HERMES_DASHBOARD_BIND=127.0.0.1
HERMES_DASHBOARD_PORT=9119

BARBAROSSA_CODEX_MODEL=gpt-5.6-luna
BARBAROSSA_CODEX_REASONING_EFFORT=medium
BARBAROSSA_CODEX_MAX_SUBAGENTS=1

BARBAROSSA_CODEX_TOKEN_FILE=
BARBAROSSA_CODEX_AUTH_FILE=
BARBAROSSA_GITHUB_TOKEN_FILE=
```

Codex and GitHub credentials stay in separate files. The optional `*_FILE`
entries in `.env` only override where Barbarossa finds them. Configure Hermes
in `hermes.env`:

```dotenv
HERMES_MODEL_PROVIDER=deepseek
HERMES_MODEL_NAME=deepseek-v4-flash
HERMES_REASONING_EFFORT=medium

HERMES_DELEGATION_PROVIDER=
HERMES_DELEGATION_MODEL=
HERMES_MAX_CONCURRENT_CHILDREN=3
HERMES_MAX_SPAWN_DEPTH=1
HERMES_ORCHESTRATOR_ENABLED=true

DEEPSEEK_API_KEY=
TOOL_GATEWAY_USER_TOKEN=
TELEGRAM_BOT_TOKEN=
TELEGRAM_ALLOWED_USERS=

HERMES_DASHBOARD_BASIC_AUTH_USERNAME=
HERMES_DASHBOARD_BASIC_AUTH_PASSWORD=
HERMES_DASHBOARD_BASIC_AUTH_SECRET=
```

Empty delegation provider/model values inherit the main model. Changing
provider requires its provider name, model name, and native Hermes credential
variable, not a source edit. Tool Gateway and Telegram allowlist values are
optional.

The external Codex files selected in `.env` contain:

| Variable | Expected file content | Requirement |
| :--- | :--- | :--- |
| `BARBAROSSA_CODEX_TOKEN_FILE` | Raw Codex access token | Alternative A |
| `BARBAROSSA_CODEX_AUTH_FILE` | Complete `auth.json` from an existing Codex login | Alternative B |
| `BARBAROSSA_GITHUB_TOKEN_FILE` | Raw scoped GitHub token | Optional |

Codex needs either the raw token or `auth.json`; `setup.sh` can import an
existing `$HOME/.codex/auth.json`. GitHub authentication is optional for public
repositories. Git ignores `.runtime/` and both real environment files. Compose
mounts credentials as secrets, and exposes `GH_TOKEN` only to Codex and image
jobs.

## 2. Bootstrap And Start The Reference Profile

### First Local Bootstrap

A clean checkout first needs its router bundle, worker-control files,
`known_hosts`, and credential mounts. Bootstrap them with:

```bash
./setup.sh
```

The script validates configuration, builds the router and workers, creates
private runtime files and a fresh restricted Ed25519 control key, derives
`known_hosts`, starts services in health order, and runs the capability smoke
test. The private key never enters a worker; workers accept only the forced
RPC, upload, and download commands.

### Subsequent Local Starts

After the initial bootstrap, use the packaged Compose wrapper. It applies both
the operator `.env` and the generated immutable image/runtime settings:

```bash
scripts/compose.sh up -d --wait
```

Services use `restart: unless-stopped`. Run `./setup.sh` again only to rebuild
artifacts or regenerate worker trust material.

Inspect the running application services with:

```bash
scripts/compose.sh ps --status running --services
```

Expected, in any order:

```text
forge
hermes
recon
```

## 3. Operator Interfaces And Job Diagnostics

Normal requests enter through Telegram, the dashboard Chat tab, or the
[Hermes CLI](https://hermes-agent.nousresearch.com/docs/user-guide/cli):

```bash
scripts/compose.sh exec -T --user hermes hermes \
  /opt/hermes/.venv/bin/hermes chat \
  -q 'Run a bounded Forge runtime check and report the result.'
```

Hermes routes and follows the job, then returns through the same interface:

```text
submit -> job_id -> queued/running -> succeeded|failed|cancelled
                    |                 |
                    +-> bounded logs  +-> result and artifacts
```

An operator or auditing agent with host SSH can inspect Compose:

```bash
scripts/compose.sh ps
scripts/compose.sh logs --since 15m --no-color hermes forge recon
```

The packaged router CLI is a diagnostic interface for audits and smoke tests,
not the public chat interface:

```bash
router() {
  scripts/compose.sh exec -T --user hermes hermes \
    /opt/hermes/.venv/bin/python \
    /opt/barbarossa-router/barbarossa-router.pex "$@"
}
```

```bash
router health
scripts/compose.sh exec -T --user hermes hermes \
  /opt/hermes/.venv/bin/hermes mcp test barbarossa
router submit \
  --capability runtime.execute \
  --command 'printf BARBAROSSA_RUNTIME_OK' \
  --wait
```

```bash
router status JOB_ID
router logs JOB_ID
router result JOB_ID
```

Hermes exposes equivalent MCP operations. A listed capability is configured,
not verified; require a completed job for that route. Avoid broad environment
dumps and unredacted `docker inspect` output during audits.

## 4. Capability Routing

Barbarossa does not expose "a worker shell." It exposes narrow operations:

| Capability | Worker and lane |
| :--- | :--- |
| `runtime.execute` | Forge runtime |
| `media.file.inspect` | Forge runtime |
| `code.delegate` | Forge Codex |
| `media.image.inspect` | Forge Codex |
| `media.image.generate` | Forge Codex |
| `media.image.edit` | Forge Codex |
| `network.fetch` | Recon, direct HTTP(S) |
| `network.inspect` | Recon, authorized direct tooling |
| `network.tor` | Recon, explicit `torsocks --isolate` |

Examples below use the diagnostic `router` helper; routine requests use
Hermes. Admission is independent per lane, so runtime, Codex, and authorized
network jobs can progress concurrently while child agents add orchestration
parallelism.

## 5. Codex Engineering

Codex is scoped as an optional engineering capability inside Forge:

```bash
router submit \
  --capability code.delegate \
  --prompt 'Inspect the repository, run its tests, and report the smallest safe correction.' \
  --wait
```

Codex can edit and review repositories, run tests and compilers, use Git and
optionally GitHub CLI, process images, and create internal subagents within its
configured limit.

`danger-full-access` applies only inside Forge, not the host. Forge is
non-root, resource-bounded, read-only at its container root, and has no Docker
socket or host-root mount. Each `/workspace/jobs/<job_id>/` retains bounded
inputs, outputs, request, status, logs, and result.

## 6. Image Capabilities

Audio is intentionally outside this profile. Image understanding, generation,
and editing use the Codex lane.

For an existing image, stage exactly one file and submit:

```bash
router submit \
  --capability media.image.inspect \
  --input-path /opt/data/barbarossa-transfer/example.png \
  --prompt 'Describe the visible objects and any readable text.' \
  --wait
```

Generate a new image without an input file:

```bash
router submit \
  --capability media.image.generate \
  --prompt 'Create a clean 16:9 technical illustration of an isolated agent runtime.' \
  --wait
```

Editing also requires exactly one staged input:

```bash
router submit \
  --capability media.image.edit \
  --input-path /opt/data/barbarossa-transfer/example.png \
  --prompt 'Keep the composition and replace the background with an overcast sea.' \
  --wait
```

Telegram attachments use the same path. The gateway stages each image with
private permissions, tells Hermes which path is available, and Hermes routes
it to `media_image_inspect`. The orchestrator does not need a second vision
provider for that flow.

Generated or edited files return only from the bounded result area beneath:

```text
/opt/data/barbarossa-results/<job_id>
```

## 7. Network Routing

Recon is a separate worker because network tools have a different risk profile
from compilers, repositories, and image artifacts.

Use direct HTTP for ordinary authorized fetches:

```bash
router submit \
  --capability network.fetch \
  --url https://check.torproject.org/api/ip \
  --wait
```

Use Tor only when the request explicitly requires it and the rules of
engagement allow it:

```bash
router submit \
  --capability network.tor \
  --command 'curl -fsS https://check.torproject.org/api/ip' \
  --wait
```

`network.tor` wraps the command with `torsocks --isolate`. Tor listens only on
Recon's loopback interface. It is not published to the host, never selected
automatically, and never falls back silently to direct networking.

Network capabilities are restricted to owned systems or explicitly authorized
testing scopes. Isolation does not create authorization.

## 8. Trust Boundaries

The current profile enforces:

- separate non-root Forge and Recon users;
- separate Docker networks for Hermes-to-Forge and Hermes-to-Recon control;
- no network shared directly between Forge and Recon;
- read-only container root filesystems;
- bounded writable tmpfs and named volumes;
- CPU, memory, PID, health, and log limits;
- no published worker ports;
- no Docker socket;
- verified SSH worker host keys;
- bounded and redacted logs returned to Hermes;
- capability-specific secret injection.

The only host service that production needs to expose is SSH. The dashboard
binds to `127.0.0.1:9119` by default.

For a remote host, open a local tunnel:

```bash
ssh -NL 9119:127.0.0.1:9119 user@server
```

Then browse to:

```text
http://127.0.0.1:9119
```

## 9. Telegram Authorization

There are two access models.

For a small fixed group, set a comma-separated allowlist:

```dotenv
TELEGRAM_ALLOWED_USERS=123456789,987654321
```

For operator-approved onboarding, leave it empty. An unknown user receives a
pairing code but cannot use the agent until an operator approves it:

```bash
scripts/compose.sh exec --user hermes hermes \
  /opt/hermes/.venv/bin/hermes pairing approve telegram CODE
```

Review pending and approved identities:

```bash
scripts/compose.sh exec --user hermes hermes \
  /opt/hermes/.venv/bin/hermes pairing list
```

A Telegram conversation is not authorization by itself. Pairing state lives in
the Hermes volume and survives container recreation until an operator removes
it.

## 10. State And Portability

Named volumes retain:

- Hermes jobs, pairing state, transfer files, and downloaded results;
- Forge workspaces and Codex home;
- Recon workspaces and Tor state;
- worker host keys.

There is no automatic 24-hour cleanup. There is also no automatic backup.

Persistent volumes make restarts convenient but do not make the deployment
durable. Valuable source, reviewed skills, and sanitized artifacts should be
promoted manually to a private Git repository. Tokens, authentication caches,
private findings, and unredacted evidence must remain outside it.

The infrastructure remains portable because the repository describes the
services and trust contracts while environment-specific state stays outside
Git. A replacement host can generate fresh control material without migrating
the previous runtime.

## 11. Verification

Run the complete smoke suite on the Docker host:

```bash
scripts/smoke-remote.sh
```

It verifies:

- all three services are running;
- the MCP server is healthy;
- Forge runtime execution;
- Codex delegation and one internal subagent;
- image inspection and generation;
- direct networking and explicit Tor;
- non-root worker identities;
- the absence of Docker sockets;
- separation of worker networks;
- absence of known secret markers in recent logs.

A green container healthcheck is necessary, but it is not the same as a
verified capability. The smoke suite exercises the actual routes.

## 12. Extending The Runtime

Workers are explicit trust boundaries. They are not discovered dynamically.

Adding a capability follows this chain:

```text
Compose service or existing worker lane
  -> worker RPC implementation
  -> typed MCP router tool and routing policy
  -> orchestrator skill or instruction
  -> capability-specific smoke test
```

Adding another worker instance also needs an identity, isolated network,
scheduler route, resource budget, credential policy, and verification path.
Do not add a generic shell tool when a narrow capability can express the job.

These explicit steps prevent a new capability from silently inheriting every
credential, filesystem, and network route already present in the system.

---

Barbarossa source:
[github.com/uphiago/barbarossa](https://github.com/uphiago/barbarossa)

Hermes runtime:
[github.com/NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)

More field notes:
[hiago.sh](https://hiago.sh) and
[@uphiago](https://x.com/uphiago)
