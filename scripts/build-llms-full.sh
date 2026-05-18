#!/usr/bin/env bash
# Build llms-full.txt by concatenating all framework pages.
# Must be run from the repo root, or via the wrapper that cds to it.

set -euo pipefail

cd "$(dirname "$0")/.."

declare -A titles=(
  [introduction]="Introduction"
  [the-frame]="The Frame"
  [evidence]="The Evidence Base"
  [the-doctrine]="The Doctrine"
  [buyers-checklist]="The Buyer's Checklist"
  [lane-discipline]="Lane Discipline"
  [watchlist]="2026 Watchlist"
  [about]="About"
  [mcp]="MCP Server"
)

PAGES=(introduction the-frame evidence the-doctrine buyers-checklist lane-discipline watchlist about mcp)

{
  cat <<'HEADER'
# Decision-Grade AI — Full Framework

> A framework for executives, technology leaders, and strategy functions working with AI in 2026. Built around verification: what to demand from AI vendors, what to build inside your organization, and what to watch over the next eighteen months.

This file is the full text of all nine pages of the decision-grade.ai framework, assembled into a single document for AI-assisted reading. The canonical reading experience is at https://decision-grade.ai. Source is at https://github.com/DavidVALIS/decision-grade.

Published by VALIS Systems. Content licensed under Creative Commons Attribution 4.0 International (CC BY 4.0). Reference: https://valissystems.com.

The framework starts from a single observation: AI is already in your analytical pipeline somewhere. The token-level production cost collapsed by two to three orders of magnitude. The all-in cost of analytical work fell by roughly 5x to 20x. Verification cost has not moved at the same rate at the structural-reasoning layer. The gap between those two cost curves is the operational risk that most executive AI guidance does not yet address.

The framework is published openly because the Zero Trust posture it advocates extends to the doctrine itself. You should not have to trust the publisher. You can verify the framework, contest it, fork it, or implement it elsewhere.

HEADER

  for f in "${PAGES[@]}"; do
    if [ ! -f "$f.mdx" ]; then
      echo "ERROR: Missing page file: $f.mdx" >&2
      exit 1
    fi
    echo ""
    echo "---"
    echo ""
    echo "# ${titles[$f]}"
    echo ""
    # Strip only the YAML frontmatter (between the first two --- at the top of the file).
    # Horizontal rules (---) further down in the file must be preserved.
    awk '
      NR==1 && /^---$/ { fm=1; next }
      fm==1 && /^---$/ { fm=2; next }
      fm==2 { print }
      fm=="" && NR==1 { fm=2; print }
    ' "$f.mdx"
  done
} > llms-full.txt

# Bundle-completeness assertion. Fail the build if any page is missing or truncated.
# Walks the bundle counting lines per page (between H1 markers), then checks
# each page has at least 30 lines of content. The previous assertion used
# "---" as page-end marker but that collides with horizontal rules inside
# pages (e.g. between sections of the Buyer's Checklist).
errors=0
declare -a TITLES=()
for f in "${PAGES[@]}"; do
  TITLES+=("# ${titles[$f]}")
done

for i in "${!PAGES[@]}"; do
  f="${PAGES[$i]}"
  title="${titles[$f]}"
  # The next title (or "" if last)
  next_idx=$((i + 1))
  if [ "$next_idx" -lt "${#TITLES[@]}" ]; then
    next_title="${TITLES[$next_idx]}"
  else
    next_title=""
  fi

  block=$(awk -v t="# $title" -v nt="$next_title" '
    $0 == t { in_block=1; next }
    in_block && nt != "" && $0 == nt { exit }
    in_block { count++ }
    END { print count+0 }
  ' llms-full.txt)

  if [ "$block" -lt 30 ]; then
    echo "ERROR: '$title' produced only $block lines in llms-full.txt — likely truncated" >&2
    errors=$((errors + 1))
  fi
done
if [ "$errors" -gt 0 ]; then
  exit 1
fi

echo "Built llms-full.txt: $(wc -l -w -c < llms-full.txt | awk '{print $1" lines, "$2" words, "$3" bytes"}')"
