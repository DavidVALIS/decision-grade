import { modelScores, headlineMetric, getWedge, type WedgeKey, type RosterScore } from '@/lib/benchmarks';

export type BenchmarkComparisonChartProps = {
  wedge: WedgeKey;
};

/**
 * Server-side SVG: side-by-side model comparison on the wedge's headline
 * metric. Salmon highlight goes to the leader. LBCI is rendered specially
 * elsewhere (per-tier breakdown lives in BenchmarkTierComparison).
 */
export function BenchmarkComparisonChart({ wedge }: BenchmarkComparisonChartProps) {
  const { label } = headlineMetric(wedge);
  const scores = modelScores(wedge);
  if (scores.length === 0) return null;

  // Layout constants
  const width = 460;
  const labelW = 200;
  const barH = 18;
  const gap = 8;
  const pad = 12;
  const inner = width - labelW - pad * 2;
  const height = pad * 2 + scores.length * (barH + gap) - gap;
  const leader = scores.reduce((a, b) => (a.value >= b.value ? a : b)).value;

  return (
    <svg
      role="img"
      className="dg-bench-chart"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMinYMin meet"
      width="100%"
      aria-label={`${wedge} comparison: ${scores
        .map((s) => `${s.model_id} ${s.value.toFixed(3)}`)
        .join(', ')}`}
    >
      <text x={pad} y={14} className="dg-bench-chart__axis">
        {label}
      </text>
      {scores.map((s, i) => {
        const y = pad + 8 + i * (barH + gap);
        const isLeader = Math.abs(s.value - leader) < 1e-9 && leader > 0;
        const bw = Math.max(0, Math.min(1, s.value)) * inner;
        return (
          <g key={s.model_id}>
            <text
              x={pad}
              y={y + barH * 0.7}
              className="dg-bench-chart__label"
            >
              {s.model_id}
            </text>
            <rect
              x={labelW}
              y={y}
              width={inner}
              height={barH}
              className="dg-bench-chart__track"
            />
            <rect
              x={labelW}
              y={y}
              width={bw}
              height={barH}
              className={
                isLeader ? 'dg-bench-chart__bar dg-bench-chart__bar--leader' : 'dg-bench-chart__bar'
              }
            />
            <text
              x={width - pad}
              y={y + barH * 0.7}
              textAnchor="end"
              className="dg-bench-chart__value"
            >
              {s.value.toFixed(3)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** LBCI tier-1/2/3 chart: three tiers x three models. Salmon highlight
 * per-tier leader. */
export function BenchmarkTierComparison() {
  const rows = getWedge('load_bearing_claim_identification');
  if (rows.length === 0) return null;
  const sorted = [...rows].sort((a, b) => a.model_id.localeCompare(b.model_id));
  const tiers: { label: string; field: keyof RosterScore }[] = [
    { label: 'Tier 1 F1', field: 'tier_1_macro_f1' },
    { label: 'Tier 2 F1', field: 'tier_2_macro_f1' },
    { label: 'Tier 3 F1', field: 'tier_3_macro_f1' },
  ];

  const width = 460;
  const labelW = 130;
  const barH = 14;
  const subGap = 4;
  const tierGap = 14;
  const pad = 12;
  const inner = width - labelW - pad * 2;
  const tierH = sorted.length * (barH + subGap) - subGap;
  const height = pad * 2 + tiers.length * (tierH + tierGap) - tierGap;

  function tierValue(r: (typeof rows)[number], f: keyof RosterScore): number {
    const v = r.roster_score[f];
    return typeof v === 'number' ? v : 0;
  }

  return (
    <svg
      role="img"
      className="dg-bench-chart"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMinYMin meet"
      width="100%"
      aria-label="LBCI per-tier comparison"
    >
      {tiers.map((tier, ti) => {
        const yTier = pad + ti * (tierH + tierGap);
        const tierMax = Math.max(...sorted.map((r) => tierValue(r, tier.field)));
        return (
          <g key={tier.label}>
            <text x={pad} y={yTier + tierH / 2 + 4} className="dg-bench-chart__label">
              {tier.label}
            </text>
            {sorted.map((r, i) => {
              const v = tierValue(r, tier.field);
              const y = yTier + i * (barH + subGap);
              const isLeader = Math.abs(v - tierMax) < 1e-9 && tierMax > 0;
              return (
                <g key={r.model_id}>
                  <rect
                    x={labelW}
                    y={y}
                    width={inner}
                    height={barH}
                    className="dg-bench-chart__track"
                  />
                  <rect
                    x={labelW}
                    y={y}
                    width={Math.max(0, Math.min(1, v)) * inner}
                    height={barH}
                    className={
                      isLeader
                        ? 'dg-bench-chart__bar dg-bench-chart__bar--leader'
                        : 'dg-bench-chart__bar'
                    }
                  />
                  <text
                    x={labelW + 6}
                    y={y + barH * 0.75}
                    className="dg-bench-chart__model"
                  >
                    {r.model_id}
                  </text>
                  <text
                    x={width - pad}
                    y={y + barH * 0.75}
                    textAnchor="end"
                    className="dg-bench-chart__value-sm"
                  >
                    {v.toFixed(3)}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}
