import type { ReactNode } from 'react';
import { leader, worst, type WedgeKey } from '@/lib/benchmarks';
import { BenchmarkComparisonChart } from './BenchmarkComparisonChart';

export type BenchmarkTestSectionProps = {
  wedge: WedgeKey;
  name: string;
  children: ReactNode;
  /** Override score line (defaults to best/worst from data) */
  scoreLine?: ReactNode;
};

/**
 * Wraps a single test on the per-test page: italic name, DM Mono score
 * line, the prose children, and the auto-rendered comparison chart.
 * The example table is passed in as children so the MDX author can
 * customise per-test stakes copy.
 */
export function BenchmarkTestSection({
  wedge,
  name,
  scoreLine,
  children,
}: BenchmarkTestSectionProps) {
  const top = leader(wedge);
  const bot = worst(wedge);
  return (
    <div className="dg-bench-test">
      <h3 className="dg-bench-test__name">{name}</h3>
      <p className="dg-bench-test__score">
        {scoreLine ? (
          scoreLine
        ) : top && bot ? (
          <>
            Best: {top.model_id} at {top.value.toFixed(2)} F1
            <span className="dg-bench-test__sep"> · </span>
            Worst: {bot.model_id} at {bot.value.toFixed(2)} F1
          </>
        ) : (
          'Results pending'
        )}
      </p>
      {children}
      <BenchmarkComparisonChart wedge={wedge} />
    </div>
  );
}
