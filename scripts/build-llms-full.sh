#!/usr/bin/env bash
# Build llms-full.txt by concatenating all framework pages.
# Must be run from the repo root, or via the wrapper that cds to it.

set -euo pipefail

cd "$(dirname "$0")/.."

title_for() {
  case "$1" in
    introduction) echo "A stronger basis for a decision." ;;
    the-frame) echo "The problem" ;;
    evidence) echo "Current evidence" ;;
    the-doctrine) echo "What Decision Grade means" ;;
    buyers-checklist) echo "Questions to ask before relying" ;;
    lane-discipline) echo "Reliance lanes" ;;
    watchlist) echo "What to measure" ;;
    about) echo "About" ;;
    mcp) echo "MCP server" ;;
    *) echo "ERROR: Unknown page: $1" >&2; return 1 ;;
  esac
}

PAGES=(introduction the-frame evidence the-doctrine buyers-checklist lane-discipline watchlist about mcp)

{
  cat <<'HEADER'
# Decision Grade — Full Framework

> A public framework for making AI-assisted professional work more decision-ready before reliance.

This file contains all nine pages published at decision-grade.ai, assembled for AI-assisted reading. The canonical reading experience is at https://decision-grade.ai. Source is at https://github.com/DavidVALIS/decision-grade.

Publisher and commercial-interest disclosure appears in the About section. Content licensed under Creative Commons Attribution 4.0 International (CC BY 4.0).

Decision Grade is earned through a defined full review for one declared use. It is not a permanent property of a document or a guarantee of correctness. Work beyond the reviewed material should be described as more decision-ready: a stronger basis for judgment with evidence, assumptions, reasoning, limits, and epistemic distance made visible.

External research on this site supports the problem. It does not prove that any particular system outperforms a strong model or a qualified human reviewer.

HEADER

  for f in "${PAGES[@]}"; do
    if [ ! -f "$f.mdx" ]; then
      echo "ERROR: Missing page file: $f.mdx" >&2
      exit 1
    fi
    echo ""
    echo "---"
    echo ""
    echo "# $(title_for "$f")"
    echo ""
    # Strip only the YAML frontmatter (between the first two --- at the top of the file).
    # Horizontal rules (---) further down in the file must be preserved.
    # Then render <StatRow> / <Stat> JSX blocks as plain markdown bullets so
    # the bundle reads as text for downstream LLM consumers.
    awk '
      NR==1 && /^---$/ { fm=1; next }
      fm==1 && /^---$/ { fm=2; next }
      fm==2 { print }
      fm=="" && NR==1 { fm=2; print }
    ' "$f.mdx" | node scripts/render-stats.mjs
  done
} > llms-full.txt

# Bundle-completeness assertion. Fail the build if any page is missing or truncated.
# Walks the bundle counting lines per page (between H1 markers), then checks
# each page has at least 30 lines of content. The previous assertion used
# "---" as page-end marker but that collides with horizontal rules inside
# pages.
errors=0
declare -a TITLES=()
for f in "${PAGES[@]}"; do
  TITLES+=("# $(title_for "$f")")
done

for i in "${!PAGES[@]}"; do
  f="${PAGES[$i]}"
  title="$(title_for "$f")"
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
