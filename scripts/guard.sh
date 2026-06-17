#!/usr/bin/env bash
# guard.sh — Deterministic policy enforcement for Copilot tool calls
# Receives tool call context via environment variables
# Exit 0 = allow. Exit non-zero = BLOCK with message to stderr.

TOOL_NAME="${COPILOT_TOOL_NAME:-}"
TOOL_INPUT="${COPILOT_TOOL_INPUT:-}"

# ── Rule 1: Block destructive recursive deletion ──────────────────────────────
if [[ "$TOOL_NAME" == "run_command" || "$TOOL_NAME" == "shell" || "$TOOL_NAME" == "bash" ]]; then
  if echo "$TOOL_INPUT" | grep -qE 'rm\s+-rf\s+/|rm\s+-rf\s+~|rm\s+--recursive\s+/'; then
    echo "🚫 POLICY BLOCK: Destructive recursive deletion detected." >&2
    echo "   Tool: $TOOL_NAME" >&2
    echo "   Input pattern matched: rm -rf on root or home directory" >&2
    echo "   Rule: guard.sh rule 1" >&2
    exit 1
  fi
fi

# ── Rule 2: Block writes to sensitive system paths ────────────────────────────
if [[ "$TOOL_NAME" == "write_file" || "$TOOL_NAME" == "create_file" || "$TOOL_NAME" == "edit_file" ]]; then
  if echo "$TOOL_INPUT" | grep -qE '(/etc/|/usr/|/var/|~/.ssh/|~/.aws/|~/.config/gh)'; then
    echo "🚫 POLICY BLOCK: Write to sensitive system path blocked." >&2
    echo "   Rule: guard.sh rule 2" >&2
    exit 1
  fi
fi

# ── Rule 3: Block git push --force ───────────────────────────────────────────
if [[ "$TOOL_NAME" == "run_command" || "$TOOL_NAME" == "shell" ]]; then
  if echo "$TOOL_INPUT" | grep -qE 'git\s+push\s+.*--force|git\s+push\s+.*-f\b'; then
    echo "🚫 POLICY BLOCK: Force push to remote is not allowed." >&2
    echo "   Rule: guard.sh rule 3" >&2
    exit 1
  fi
fi

exit 0
