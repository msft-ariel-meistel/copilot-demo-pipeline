Stack: Node.js 20, Express 4. No TypeScript — plain JavaScript ES2022.

Build: `npm install` → `npm test` → `npm run lint`
Dev server: `npm run dev` (port 3000)

Code style:
- ES2022 async/await throughout (no .then() chains)
- JSDoc comments on all exported functions
- Error format: `{ success: false, error: "ERROR_CODE", message: "..." }`
- Never log sensitive data (tokens, passwords, card numbers)

Important constraints:
- Rate limiting: always use `middleware/rateLimiter.js` — never roll custom solutions
- Auth: always use `middleware/validateToken.js` — never inline token validation
- Config: if you change config.json, ALWAYS update config.prod.json to match structure
