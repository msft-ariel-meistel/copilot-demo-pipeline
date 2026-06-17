#!/usr/bin/env bash
# secrets-check.sh — Runs at session end to check for accidental secret commits
# Non-zero exit is logged but does NOT block (postToolUse / sessionEnd hooks are advisory)

echo "🔍 Running secrets scan on modified files..."

# Check for common secret patterns in staged/unstaged changes
if git diff --name-only 2>/dev/null | xargs grep -l -E '(api_key|secret_key|password|token|bearer)\s*[=:]\s*["\x27][^"\x27]{8,}' 2>/dev/null; then
  echo "⚠️  WARNING: Possible secrets detected in modified files. Review before committing." >&2
else
  echo "✅ No obvious secrets detected in modified files."
fi
