#!/usr/bin/env bash
# Build llms-full.txt by concatenating all framework pages.
# Must be run from the repo root, or via the wrapper that cds to it.

set -euo pipefail

cd "$(dirname "$0")/.."

declare -A titles=(
  [introduction]="Introduction"
  [the-frame]="The Frame"
  [the-doctrine]="The Doctrine"
  [buyers-checklist]="The Buyer's Checklist"
  [lane-discipline]="Lane Discipline"
  [watchlist]="2026 Watchlist"
  [about]="About"
)

PAGES=(introduction the-frame the-doctrine buyers-checklist lane-discipline watchlist about)

{
  cat <<'HEADER'
# Decision-Grade AI — Full Framework

> A framework for executives, technology leaders, and strategy functions working with AI in 2026. Built around verification: what to demand from AI vendors, what to build inside your organization, and what to watch over the next eighteen months.

This file is the full text of all six pages of the decision-grade.ai framework, assembled into a single document for AI-assisted reading. The canonical reading experience is at https://decision-grade.ai. Source is at https://github.com/DavidVALIS/decision-grade.

Published by VALIS Systems. Content licensed under Creative Commons Attribution 4.0 International (CC BY 4.0). Reference: https://valissystems.com.

The framework starts from a single observation: AI production cost has fallen by a factor of one hundred to one thousand against human equivalents, while the cost of verifying that the output reasons correctly has not moved. The gap between those two cost curves is the operational risk that most executive AI guidance does not yet address.

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
    awk '/^---$/{n++; next} n==2' "$f.mdx"
  done
} > llms-full.txt

echo "Built llms-full.txt: $(wc -l -w -c < llms-full.txt | awk '{print $1" lines, "$2" words, "$3" bytes"}')"
