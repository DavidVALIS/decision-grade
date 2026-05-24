import type { ReactNode } from 'react';

export type ProvenanceStampProps = {
  /**
   * What kind of analysis this stamp belongs to.
   *   audit   – static, dated structural audit of the doctrine
   *   signals – live, weekly horizon-scanner feed
   */
  kind: 'audit' | 'signals';
  /** ISO date string (YYYY-MM-DD) for static analyses. */
  date?: string;
  /** Refresh cadence for live feeds, e.g. 'weekly'. */
  cadence?: string;
  /** Link to the methodology overview (defaults to valissystems.com). */
  methodologyUrl?: string;
  /** Link where readers can contest the analysis (defaults to repo issues). */
  contestUrl?: string;
  /** Optional override for the disclosure copy. */
  children?: ReactNode;
};

const DEFAULT_METHODOLOGY_URL = 'https://valissystems.com';
const DEFAULT_CONTEST_URL = 'https://github.com/DavidVALIS/decision-grade/issues';

function defaultBody(kind: 'audit' | 'signals'): ReactNode {
  if (kind === 'signals') {
    return (
      <>
        Signals from the AI verification frontier. Produced by VALIS Systems, the
        publisher of this doctrine. The methodology is described at the
        methodology link below. Disagreements file at the contest link.
      </>
    );
  }
  return (
    <>
      An audit of this doctrine, produced by VALIS Systems, the doctrine&apos;s
      publisher. The full analysis is held by VALIS Systems. The excerpts below
      are reproduced so the doctrine can be contested on its own terms.
    </>
  );
}

function formatDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  // Format as e.g. "20 May 2026" without using locale-dependent Intl
  // (build-time stability across environments).
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const [, year, monthStr, dayStr] = m;
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const month = months[Number(monthStr) - 1] ?? monthStr;
  const day = String(Number(dayStr));
  return `${day} ${month} ${year}`;
}

export function ProvenanceStamp({
  kind,
  date,
  cadence,
  methodologyUrl = DEFAULT_METHODOLOGY_URL,
  contestUrl = DEFAULT_CONTEST_URL,
  children,
}: ProvenanceStampProps) {
  const label = kind === 'signals' ? 'Live feed' : 'Static audit';
  const dateLabel = formatDate(date);

  return (
    <div
      className="dg-provenance"
      role="note"
      style={{
        border: '1px solid var(--rule-strong)',
        borderLeft: '3px solid var(--accent)',
        background: 'var(--bg-2)',
        padding: '1rem 1.25rem',
        margin: '0 0 2.5rem',
        fontSize: '0.88rem',
        lineHeight: 1.65,
        color: 'var(--fg-3)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem 1.25rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--fg-4)',
          marginBottom: '0.6rem',
        }}
      >
        <span>{label}</span>
        {dateLabel ? <span>As of {dateLabel}</span> : null}
        {cadence ? <span>Refreshes {cadence}</span> : null}
        <span>Conflict of interest: publisher is the analyst</span>
      </div>
      <div style={{ color: 'var(--fg-2)' }}>
        {children ?? defaultBody(kind)}
      </div>
      <div
        style={{
          marginTop: '0.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.25rem',
          fontSize: '0.85rem',
        }}
      >
        <a href={methodologyUrl} target="_blank" rel="noreferrer">
          Methodology
        </a>
        <a href={contestUrl} target="_blank" rel="noreferrer">
          Contest this analysis
        </a>
      </div>
    </div>
  );
}
