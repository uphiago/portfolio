+++
author = "@uphiago"
title = "Hermes Barbarossa: Orchestrating Isolated Workers"
slug = "hermes-agent-recon"
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
> If this infrastructure model is relevant, continue for its architecture, deployment, routing, and verification.

> **Author's note:** An agent is not a worker, and a worker is not a task.
> Skills teach agents how to plan, route, and evaluate work; `AGENTS.md`
> defines operational boundaries; and an optional `SOUL.md` preserves
> behavioral principles. Workers provide sandboxed execution capacity across
> available hardware. Scaling means adding isolated lanes, worker replicas, or
> agent instances while preserving CPU, memory, PID, credential, filesystem,
> and network boundaries. This allows authorized scan waves, fuzzing batches,
> and spray-style workloads to run in parallel without weakening sandbox
> protections.

[![Barbarossa, the capability-oriented agent runtime](/images/barbarossa-epic-16x9.webp)](https://github.com/uphiago/barbarossa)

<!--more-->

[Barbarossa](https://github.com/uphiago/barbarossa) is a portable runtime for
connecting an agent orchestrator to isolated workers through typed
capabilities and durable jobs. Execution stays outside the orchestrator, and
workers return bounded results instead of exposing general-purpose privileged
shells.

This article documents the current public reference implementation: a
three-container profile, an MCP v2 capability router, Forge runtime and Codex
lanes, isolated direct and Tor networking, Telegram authorization, and
state portability. Model providers, worker counts, and concurrency limits
remain configurable deployment choices.

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

Four responsibilities stay separate:

| Layer | Responsibility |
| :--- | :--- |
| Orchestrator | Plans work, delegates, follows jobs, combines results |
| Capability router | Validates typed requests and selects a worker lane |
| Workers | Execute bounded jobs in domain-specific environments |
| Job store | Retains state, logs, artifacts, and terminal results |

The repository ships one concrete profile:

```text
Hermes (orchestration)
|-- Forge
|   |-- runtime lane
|   `-- Codex lane
`-- Recon
    |-- direct network
    `-- Tor (explicit)
```

That is three long-running containers: `hermes`, `forge`, and `recon`. The MCP
v2 router is packaged as a PEX bundle and runs as a hidden subprocess inside
the official Hermes image. It is not a fourth service.

Internally, the router uses restricted SSH to reach each worker. Hermes never
gets an interactive SSH shell. Its interface is a set of typed MCP tools:
submit a job, inspect its status and logs, retrieve its result, or cancel it.
SSH is transport. MCP is the contract.

### Reference Profile

The checked-in deployment is a capacity profile, not a fixed topology:

| Component | Current role | Admission policy |
| :--- | :--- | :--- |
| Hermes | DeepSeek V4 Flash orchestration | Up to three child tasks, one level deep |
| Forge runtime | Shell, files, builds, and conversions | One runtime job |
| Forge Codex | GPT-5.6 Luna with medium reasoning | One Codex job with at most one internal subagent |
| Recon | Authorized direct or explicit-Tor networking | One network job |

Forge runtime and Forge Codex are independent lanes and can execute
concurrently. Hermes can also route work to Recon while both Forge lanes are
active.

Models, providers, admission limits, worker types, and worker replicas are
deployment policy. Scaling can increase lane capacity or add isolated worker
instances, but every new route must retain explicit capability identity,
resource limits, credential scope, network isolation, durable job state, and
capability-specific verification.

## 1. Local Bootstrap And Production Requirements

The machine running `./setup.sh` from source requires:

- Docker with Compose;
- `ssh-keygen`;
- Python 3 and [`uv`](https://docs.astral.sh/uv/).

Python and `uv` are build-time dependencies. The local setup uses them to
package the MCP router as a PEX file before Compose starts. Worker tools and
agent capabilities remain inside the containers.

A server receiving prebuilt worker images and a PEX bundle does not require
Python or `uv`. It requires Docker with Compose and standard OpenSSH utilities
for generating and installing worker-control material.

Both modes require external configuration for:

- the orchestrator model selected by the profile;
- the Telegram bot;
- dashboard authentication;
- Codex authentication through an access token or a headless `auth.json`.

Clone the project:

```bash
git clone https://github.com/uphiago/barbarossa.git
cd barbarossa
cp .env.example .env
```

The default profile expects these operator-supplied values in `.env`:

```dotenv
DEEPSEEK_API_KEY=
TOOL_GATEWAY_USER_TOKEN=
TELEGRAM_BOT_TOKEN=
TELEGRAM_ALLOWED_USERS=
DASHBOARD_USER=
DASHBOARD_PASS=
DASHBOARD_SECRET=
```

`TOOL_GATEWAY_USER_TOKEN` and `TELEGRAM_ALLOWED_USERS` are optional. The
DeepSeek, Telegram, and dashboard values are required by the checked-in setup.
Alternative profiles require corresponding variable names and configuration.

The following `.env` values are file paths, not credential values:

```dotenv
BARBAROSSA_CODEX_TOKEN_FILE=.runtime/codex_access_token
BARBAROSSA_CODEX_AUTH_FILE=.runtime/codex_auth.json
BARBAROSSA_GITHUB_TOKEN_FILE=.runtime/github_token
```

The referenced files contain:

| Variable | Expected file content | Requirement |
| :--- | :--- | :--- |
| `BARBAROSSA_CODEX_TOKEN_FILE` | Raw Codex access token | Alternative A |
| `BARBAROSSA_CODEX_AUTH_FILE` | Complete `auth.json` from an existing Codex login | Alternative B |
| `BARBAROSSA_GITHUB_TOKEN_FILE` | Raw scoped GitHub token | Optional |

At least one Codex alternative must be non-empty. When both configured Codex
files are empty, `setup.sh` copies `$HOME/.codex/auth.json` if it exists;
otherwise, bootstrap stops. The GitHub file may remain empty when jobs use only
public repositories and unauthenticated Git operations.

The default `.runtime/` directory is ignored by Git and created with mode
`0700`. Compose mounts the referenced files as secrets instead of embedding
their contents in `docker-compose.yml`. Codex authentication is scoped to
Forge. A non-empty GitHub token is exposed as `GH_TOKEN` only to Codex and
image jobs, never to Hermes, Recon, or the generic Forge runtime lane.

## 2. Bootstrap And Start The Reference Profile

### First Local Bootstrap

A clean source checkout cannot start with `docker compose up` alone. The router
bundle, worker-control files, `known_hosts`, and external credential files must
exist before Compose can resolve its mounts and secrets.

Prepare those artifacts and start the initial stack with:

```bash
./setup.sh
```

`setup.sh` performs the complete bootstrap:

1. validates Docker, Compose, `uv`, Python, and required configuration;
2. creates a private runtime directory;
3. generates a fresh Ed25519 worker-control key;
4. restricts that key to the worker dispatch command;
5. builds the locked MCP router PEX;
6. builds Forge and Recon;
7. starts the workers and derives `known_hosts` from their own host-key volumes;
8. starts Hermes only after both workers are healthy;
9. runs the complete capability smoke test.

The private worker-control key never enters a worker. Host verification is
never disabled. A worker accepts only the restricted RPC, upload, and download
operations implemented by the dispatch script.

### Subsequent Local Starts

After the initial bootstrap, normal starts and container recreation use
Compose directly:

```bash
docker compose up -d --wait
```

The services also use `restart: unless-stopped`, so they return automatically
after a Docker daemon or host restart.

Run `./setup.sh` again only when rebuilding the local router and worker images,
regenerating worker-control material, or replacing worker host-key volumes.

Inspect the running application services with:

```bash
docker compose ps --status running --services
```

Expected, in any order:

```text
forge
hermes
recon
```

## 3. Operator Interfaces And Job Diagnostics

### Agent Interaction

Normal requests enter through:

- Telegram, using the configured gateway and authorization policy;
- the Chat tab at `http://127.0.0.1:9119`;
- the [Hermes CLI](https://hermes-agent.nousresearch.com/docs/user-guide/cli).

Start an interactive Hermes session inside the container:

```bash
docker compose exec --user hermes hermes \
  /opt/hermes/.venv/bin/hermes chat
```

For a non-interactive request:

```bash
docker compose exec -T --user hermes hermes \
  /opt/hermes/.venv/bin/hermes chat \
  -q 'Run a bounded Forge runtime check and report the result.'
```

Hermes selects the capability, submits the job, polls it, retrieves the result,
and returns the final response through the same interface. The job lifecycle
remains internal to the orchestration flow:

```text
submit -> job_id -> queued/running -> succeeded|failed|cancelled
                    |                 |
                    +-> bounded logs  +-> result and artifacts
```

### External Audit And Automation

An operator or auditing agent with SSH access to the Docker host can inspect
the deployment through Compose:

```bash
docker compose ps
docker compose logs --since 15m --no-color hermes forge recon
```

The packaged router CLI provides a lower-level diagnostic interface inside
Hermes. It is useful for controlled capability audits, smoke tests, and job
inspection; it is not the public chat interface.

Define a local shell helper on the Docker host:

```bash
router() {
  docker compose exec -T --user hermes hermes \
    /opt/hermes/.venv/bin/python \
    /opt/barbarossa-router/barbarossa-router.pex "$@"
}
```

Check the router and the Hermes MCP connection:

```bash
router health
docker compose exec -T --user hermes hermes \
  /opt/hermes/.venv/bin/hermes mcp test barbarossa
```

Submit a bounded audit job:

```bash
router submit \
  --capability runtime.execute \
  --command 'printf BARBAROSSA_RUNTIME_OK' \
  --wait
```

For a known `job_id`, inspect only its bounded records:

```bash
router status JOB_ID
router logs JOB_ID
router result JOB_ID
```

Hermes exposes equivalent MCP operations through `runtime_execute`,
`job_status`, `job_logs`, `job_result`, and `job_cancel`. A capability being
listed means it is configured, not verified. Verification requires a completed
job with evidence for that exact route.

Audits should avoid broad environment dumps or unredacted `docker inspect`
output because container configuration can reference operational secrets.

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

The deterministic examples below use the diagnostic `router` helper from the
audit section. Routine operation sends the same intent to Hermes through
Telegram, the dashboard, or `hermes chat`.

The scheduler enforces the reference admission policy independently per lane.
Queue pressure in one lane does not consume admission capacity in another, so
runtime, Codex, and authorized network jobs can progress concurrently.
Orchestrator child tasks add planning concurrency above those execution lanes.

A worker is not equivalent to a task. Workers contain lanes, lanes admit jobs,
and the orchestrator can create multiple tasks and route each one to the
appropriate capability.

## 5. Codex Engineering

Codex is scoped as an optional engineering capability inside Forge:

```bash
router submit \
  --capability code.delegate \
  --prompt 'Inspect the repository, run its tests, and report the smallest safe correction.' \
  --wait
```

The current Codex profile can:

- analyze, edit, and review repositories;
- run compilers and test suites;
- use Git and, when explicitly credentialed, GitHub CLI;
- inspect images;
- generate or edit raster images;
- create one internal subagent when the task benefits from it.

Codex uses `danger-full-access` only inside the Forge container boundary. That
does not mean host access. Forge is non-root, resource-bounded, read-only at
its container root, and has neither the Docker socket nor a host-root mount.
Work happens under the job directory in the Forge workspace.

Each job retains its own request, state, logs, result, inputs, and outputs:

```text
/workspace/jobs/<job_id>/
|-- inputs/
|-- outputs/
|-- request.json
|-- status.json
|-- stdout.log
|-- stderr.log
`-- result.json
```

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
docker compose exec --user hermes hermes \
  /opt/hermes/.venv/bin/hermes pairing approve telegram CODE
```

Review pending and approved identities:

```bash
docker compose exec --user hermes hermes \
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
