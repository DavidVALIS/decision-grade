import { modelScores, headlineMetric, type WedgeKey } from '@/lib/benchmarks';

export type BenchmarkFindingCardProps = {
  wedge: WedgeKey;
};

/**
 * One card per model, showing the headline metric value for the given wedge.
 * Compact alternative to the per-test SVG; renders 3 cards in a grid.
 */
export function BenchmarkFindingCard({ wedge }: BenchmarkFindingCardProps) {
  const { label } = headlineMetric(wedge);
  const scores = modelScores(wedge);
  return (
    <div className="dg-bench-card-grid">
      {scores.map((s) => {
        const excluded = s.total - s.scored;
        const excludedPct = s.total ? (excluded / s.total) * 100 : 0;
        return (
          <article key={s.model_id} className="dg-bench-card">
            <p className="dg-bench-card__eyebrow">Finding · {s.model_id}</p>
            <p className="dg-bench-card__headline">{s.value.toFixed(3)}</p>
            <p className="dg-bench-card__metric">{label}</p>
            <ul className="dg-bench-card__stats">
              <li>
                {s.scored} / {s.total} scored
              </li>
              {excluded > 0 ? <li>{excludedPct.toFixed(1)}% excluded</li> : null}
              {s.partial_count > 0 ? <li>{s.partial_count} partial</li> : null}
              {s.rate_limit_count > 0 ? <li>{s.rate_limit_count} rate-limited</li> : null}
            </ul>
          </article>
        );
      })}
    </div>
  );
}
