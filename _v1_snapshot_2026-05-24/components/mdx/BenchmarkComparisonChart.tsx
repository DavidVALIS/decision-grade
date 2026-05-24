import { modelScores, headlineMetric, getWedge, type WedgeKey, type RosterScore } from '@/lib/benchmarks';

export type BenchmarkComparisonChartProps = {
  wedge: WedgeKey;
  /** Show the 95% decision-grade reference line. Default true. */
  showBar?: boolean;
};

/**
 * Server-side SVG: side-by-side model comparison on the wedge's headline
 * metric. Salmon highlight goes to the leader. A dashed reference line at
 * 0.95 makes pass/fail visually obvious -- bars that don't reach the line
 * are below the decision-grade bar.
 */
export function BenchmarkComparisonChart({ wedge, showBar = true }: BenchmarkComparisonChartProps) {
  const { label } = headlineMetric(wedge);
  const scores = modelScores(wedge);
  if (scores.length === 0) return null;

  // Layout constants -- vertical-stack layout uses bigger fonts and bars
  // so the chart reads at a glance without the visitor squinting.
  const width = 640;
  const labelW = 240;
  const barH = 30;
  const gap = 16;
  const padTop = 22;
  const padBottom = 32;
  const padX = 16;
  const inner = width - labelW - padX * 2;
  const height = padTop + padBottom + scores.length * (barH + gap) - gap;
  const leader = scores.reduce((a, b) => (a.value >= b.value ? a : b)).value;
  const barX95 = labelW + inner * 0.95;

  return (
    <svg
      role="img"
      className="dg-bench-chart"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMinYMin meet"
      width="100%"
      aria-label={`${wedge} comparison: ${scores
        .map((s) => `${s.model_id} ${s.value.toFixed(2)}`)
        .join(', ')}. 95 percent bar at 0.95.`}
    >
      <text x={padX} y={12} className="dg-bench-chart__axis">
        {label}
      </text>
      {showBar ? (
        <>
          <line
            x1={barX95}
            x2={barX95}
            y1={padTop - 4}
            y2={height - padBottom + 4}
            className="dg-bench-chart__threshold"
          />
          <text
            x={barX95}
            y={height - 8}
            textAnchor="middle"
            className="dg-bench-chart__threshold-label"
          >
            95% bar
          </text>
        </>
      ) : null}
      {scores.map((s, i) => {
        const y = padTop + i * (barH + gap);
        const isLeader = Math.abs(s.value - leader) < 1e-9 && leader > 0;
        const bw = Math.max(0, Math.min(1, s.value)) * inner;
        return (
          <g key={s.model_id}>
            <text x={padX} y={y + barH * 0.7} className="dg-bench-chart__label">
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
              x={width - padX}
              y={y + barH * 0.7}
              textAnchor="end"
              className="dg-bench-chart__value"
            >
              {s.value.toFixed(2)}
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
