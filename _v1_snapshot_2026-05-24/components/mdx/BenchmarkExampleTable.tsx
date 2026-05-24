import type { ReactNode } from 'react';

export type BenchmarkExampleTableProps = {
  /** Optional row override. Default is CEO / Analyst / Operator. */
  rows?: { role: string; body: ReactNode }[];
  ceo?: ReactNode;
  analyst?: ReactNode;
  operator?: ReactNode;
};

/**
 * Per-test stakes table: CEO / Analyst / Operator rows.
 * Mirrors the .example-table CSS pattern from valis/benchmarks.
 */
export function BenchmarkExampleTable({
  rows,
  ceo,
  analyst,
  operator,
}: BenchmarkExampleTableProps) {
  const data =
    rows ??
    [
      ceo ? { role: 'CEO', body: ceo } : null,
      analyst ? { role: 'Analyst', body: analyst } : null,
      operator ? { role: 'Operator', body: operator } : null,
    ].filter((r): r is { role: string; body: ReactNode } => r !== null);

  return (
    <table className="dg-bench-table">
      <thead>
        <tr>
          <th>If you are the...</th>
          <th>What &ldquo;below 95 percent&rdquo; means for you</th>
        </tr>
      </thead>
      <tbody>
        {data.map((r) => (
          <tr key={r.role}>
            <td>{r.role}</td>
            <td>{r.body}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
