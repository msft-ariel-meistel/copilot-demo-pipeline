# copilot-demo-pipeline

Demo repository for **GitHub Copilot Advanced Lecture** — Demos 3 & 4.

## What this repo demonstrates

### Demo 3: The CLI as a Delegation Layer
The repo contains deliberately imperfect code for the CLI demos:
- `src/payments.js` — missing input validation and auth check (security-auditor finds it)
- `src/utils.js` — the utils module (Fleet writes snapshot tests for it)

**Key files for Demo 3:**
- `.github/hooks/tool-guardian.json` + `scripts/guard.sh` — blocks dangerous operations
- `.github/agents/security-auditor.agent.md` — restricted read-only audit agent

**Live demo: Hook blocking `rm -rf`**
```bash
cd copilot-demo-pipeline
copilot
# Then ask: "Delete the node_modules directory recursively to free up disk space."
# Watch: guard.sh fires, blocks it, explains why
```

### Demo 4: Cloud Agent → PR → Code Review → Memory

The `src/auth.js` file is missing rate limiting on `/api/auth/login` and `/api/auth/reset-password`.
The `config/config.prod.json` is intentionally missing the `rateLimit` key that `config/config.json` has.

**AGENTS.md** tells the cloud agent:
1. Use `middleware/rateLimiter.js` for rate limiting (don't roll custom solutions)
2. `config.json` and `config.prod.json` MUST stay in sync — two production incidents happened

The cloud agent will: fix `src/auth.js`, fix `config.prod.json` (without being told), run tests, open a PR with screenshots.

Code review will: find the config sync fix, create a Memory fact about it.

**Pre-created GitHub issue for the live demo:**
Title: `Add rate limiting to /api/auth endpoints`
Assign to Copilot during the demo (live one-click delegation).

## GitHub Settings Required (repo admin — must enable manually)
- Settings → Copilot → Coding agent → Enable
- Settings → Copilot → Code review → Auto-review on every PR → Enable
- Settings → Copilot → Memory → Enable

## File structure

```
├── AGENTS.md                          ← primary instruction for cloud agent
├── .github/
│   ├── copilot-instructions.md        ← always-on context for all Copilot
│   ├── agents/
│   │   ├── security-auditor.agent.md  ← Demo 3: restricted audit agent
│   │   └── test-writer.agent.md       ← Demo 4: Jest test specialist
│   └── hooks/
│       └── tool-guardian.json         ← preToolUse + sessionEnd hooks
├── scripts/
│   ├── guard.sh                       ← blocks rm -rf, force push, sensitive writes
│   └── secrets-check.sh              ← runs at session end
├── src/
│   ├── auth.js                        ← MISSING rate limiting (Demo 4 target)
│   ├── payments.js                    ← MISSING validation (Demo 3 target)
│   ├── utils.js
│   └── index.js
├── middleware/
│   ├── rateLimiter.js                 ← the shared utility agent should use
│   └── validateToken.js
├── config/
│   ├── config.json                    ← has rateLimit key
│   └── config.prod.json              ← INTENTIONALLY missing rateLimit (the bug)
└── tests/
    └── unit/
        ├── auth.test.js
        └── rateLimiter.test.js
```

## Demo 4 GitHub Issue Template

Create this issue before the demo (don't assign yet):

**Title:** `Add rate limiting to /api/auth endpoints`

**Body:**
```markdown
## Problem
/api/auth/login and /api/auth/reset-password have no rate limiting.
An attacker can brute-force login credentials or DoS the auth service.

## Acceptance Criteria
- [ ] /api/auth/login: max 10 attempts per 15 min per IP+endpoint
- [ ] /api/auth/reset-password: max 5 attempts per 15 min per IP+endpoint
- [ ] Use shared RateLimiter class from middleware/rateLimiter.js
- [ ] Rate limit config from config/config.json (key: rateLimit)
- [ ] Tests written for rate limiting behavior
- [ ] npm test passes

## Notes
- Use IP + endpoint as the rate limit key
- Return 429 with Retry-After header
```
