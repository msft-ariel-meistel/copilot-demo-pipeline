Stack: Node.js 20, Express 4. No TypeScript — plain JavaScript ES2022.

Code style:
- ES2022 async/await throughout (no .then() chains)
- JSDoc comments on all exported functions
- Error format: `{ success: false, error: "ERROR_CODE", message: "..." }`
- Never log sensitive data (tokens, passwords, card numbers)

Use `AGENTS.md` for agent operating instructions such as build/test commands, validation steps, rate-limiting implementation constraints, and config synchronization rules.
