# AGENTS.md — Copilot Pipeline Demo

## Repository Purpose
Express.js REST API for a fictional fintech application. Handles user authentication and payment processing.

## Architecture
- `src/` — Express routes, middleware, services
- `tests/` — Jest test suite, must maintain ≥ 80% coverage on `src/`
- `config/` — environment configs (`config.json` = dev, `config.prod.json` = prod)
- `middleware/` — Express middleware (auth, validation, rate limiting)

## Development Workflow
1. All features must have tests before merge
2. Run `npm test` — all tests must pass
3. Run `npm run lint` — zero errors
4. Rate limiting middleware MUST use the shared `RateLimiter` class in `middleware/rateLimiter.js`. Do NOT implement ad-hoc solutions.
5. **CRITICAL**: Any change to `config/config.json` MUST have a matching change to `config/config.prod.json` with production-appropriate values. This has caused two production incidents.

## Testing conventions
- Unit tests in `tests/unit/`
- Integration tests in `tests/integration/`
- Mock all external HTTP calls with `jest.mock`
- Test files named `<module>.test.js`

## IMPORTANT: Config sync rule
`config/config.json` and `config/config.prod.json` MUST stay in sync on structure. New keys added to one must be added to the other. Code review must check this.

## Things the cloud agent should know
- Auth tokens are validated in `middleware/validateToken.js`
- The `RateLimiter` class accepts: `windowMs`, `maxRequests`, `keyFn` parameters
- Rate limit keys should be based on IP + endpoint, not just IP
- Return 429 with `Retry-After` header when rate limited
