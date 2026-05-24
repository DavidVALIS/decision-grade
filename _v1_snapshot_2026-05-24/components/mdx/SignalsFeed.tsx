import type { CSSProperties, ReactNode } from 'react';
import signalsData from '@/data/signals.json';

/**
 * Signals feed. List of discrete signal cards aligned to the page column
 * (no outer panel wrapper). Each card is a bordered <details> containing
 * its own summary and expanded body, so the open state reads as a single
 * object rather than flowing into the surrounding feed.
 */

type Confidence = 'high' | 'medium' | 'low';
type VerificationStatus = 'date_confirmed' | 'confirmed' | 'unconfirmed';

type Signal = {
  id: string;
  title: string;
  summary: string;
  source_url: string;
  source_domain: string;
  confidence: Confidence;
  verification_status: VerificationStatus;
  observation_tags: string[];
  why_picked: string;
  relevance_score: number;
  impact_analysis: string;
  affected_scenarios: string[];
  watch_list_refs?: string[];
  published_at: string;
  detected_at: string;
};

type SignalsData = {
  generated_at: string;
  project_id: string;
  signals: Signal[];
};

const WINDOW_DAYS = 28;

const CONFIDENCE_LABEL: Record<Confidence, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const VERIFICATION_LABEL: Record<VerificationStatus, string> = {
  date_confirmed: 'Date Confirmed',
  confirmed: 'Confirmed',
  unconfirmed: 'Unconfirmed',
};

const SECTION_LABEL_STYLE: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.7rem',
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
  color: 'var(--fg-4)',
  marginTop: '1.25rem',
  marginBottom: '0.55rem',
};

function formatDateLong(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(iso);
  if (!m) return iso;
  const [, , monthStr, dayStr, hourStr, minStr] = m;
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const month = months[Number(monthStr) - 1] ?? monthStr;
  const day = Number(dayStr);
  const hour24 = Number(hourStr);
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  return `${month} ${day}, ${String(hour12).padStart(2, '0')}:${minStr} ${ampm}`;
}

function formatDateShort(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const [, , monthStr, dayStr] = m;
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return `${months[Number(monthStr) - 1] ?? monthStr} ${Number(dayStr)}`;
}

function withinWindow(generatedAtIso: string, detectedAtIso: string, days: number): boolean {
  const generated = Date.parse(generatedAtIso);
  const detected = Date.parse(detectedAtIso);
  if (Number.isNaN(generated) || Number.isNaN(detected)) return true;
  const cutoff = generated - days * 24 * 60 * 60 * 1000;
  return detected >= cutoff;
}

function ChevronIcon() {
  return (
    <svg
      className="dg-signal-chevron"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function Chip({
  children,
  background,
  color,
  border,
  icon,
}: {
  children: ReactNode;
  background: string;
  color: string;
  border: string;
  icon?: ReactNode;
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.22rem 0.6rem',
        background,
        color,
        border: `1px solid ${border}`,
        fontFamily: 'var(--font-mono)',
        fontSize: '0.7rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        lineHeight: 1.3,
      }}
    >
      {icon}
      {children}
    </span>
  );
}

function DomainChip({ domain }: { domain: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.22rem 0.6rem',
        background: 'transparent',
        color: 'var(--fg-3)',
        border: '1px solid var(--rule)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.7rem',
        letterSpacing: '0.04em',
        lineHeight: 1.3,
      }}
    >
      {domain}
    </span>
  );
}

function ConfidenceChip({ confidence }: { confidence: Confidence }) {
  const shield = (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3l8 3v6c0 4.5-3.2 8.4-8 10-4.8-1.6-8-5.5-8-10V6z" />
    </svg>
  );
  return (
    <Chip
      background="rgba(227, 178, 97, 0.08)"
      color="var(--challenged)"
      border="rgba(227, 178, 97, 0.35)"
      icon={shield}
    >
      {CONFIDENCE_LABEL[confidence]}
    </Chip>
  );
}

function VerificationChip({ status }: { status: VerificationStatus }) {
  return (
    <Chip
      background="rgba(95, 207, 143, 0.08)"
      color="var(--verified)"
      border="rgba(95, 207, 143, 0.35)"
    >
      {VERIFICATION_LABEL[status]}
    </Chip>
  );
}

function ScenarioChip({ name }: { name: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.25rem 0.65rem',
        background: 'rgba(184, 153, 216, 0.08)',
        color: '#b899d8',
        border: '1px solid rgba(184, 153, 216, 0.30)',
        fontFamily: 'var(--font-sans)',
        fontSize: '0.85rem',
        lineHeight: 1.5,
        marginRight: '0.4rem',
        marginBottom: '0.4rem',
      }}
    >
      {name}
    </span>
  );
}

function SectionLabel({ children }: { children: string }) {
  return <div style={SECTION_LABEL_STYLE}>{children}</div>;
}

function SignalCard({ signal }: { signal: Signal }) {
  return (
    <details className="dg-signal-tile">
      <summary
        className="dg-signal-summary"
        style={{
          listStyle: 'none',
          cursor: 'pointer',
          padding: '1.2rem 1.4rem',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '1rem',
          alignItems: 'start',
        }}
      >
        <div>
          {/* Date kicker above the title. */}
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--fg-4)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}
          >
            {formatDateShort(signal.detected_at)}
          </div>
          <a
            href={signal.source_url}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 500,
              fontSize: '1.05rem',
              color: 'var(--accent)',
              borderBottom: 'none',
              lineHeight: 1.4,
            }}
          >
            {signal.title}
            <span style={{ marginLeft: '0.35rem', fontSize: '0.85em' }}>↗</span>
          </a>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.92rem',
              color: 'var(--fg-3)',
              marginTop: '0.4rem',
              lineHeight: 1.6,
            }}
          >
            {signal.summary}
          </div>
        </div>
        <ChevronIcon />
      </summary>

      {/* Expanded body. Sits inside the same bordered card with a single
          dividing rule from the summary, so the whole signal reads as one
          object when open. */}
      <div
        style={{
          borderTop: '1px solid var(--rule)',
          padding: '1rem 1.4rem 1.3rem',
        }}
      >
        {/* Source meta row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.45rem',
            marginTop: '0.25rem',
            marginBottom: '0.5rem',
          }}
        >
          <DomainChip domain={signal.source_domain} />
          <ConfidenceChip confidence={signal.confidence} />
          <VerificationChip status={signal.verification_status} />
        </div>

        <SectionLabel>Why it was picked</SectionLabel>
        <div style={{ fontSize: '0.93rem', lineHeight: 1.7, color: 'var(--fg-2)' }}>
          {signal.why_picked}{' '}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--fg-4)' }}>
            (relevance {signal.relevance_score.toFixed(2)})
          </span>
        </div>

        <SectionLabel>Impact analysis</SectionLabel>
        <div style={{ fontSize: '0.93rem', lineHeight: 1.7, color: 'var(--fg-2)' }}>
          {signal.impact_analysis}
        </div>

        {signal.affected_scenarios.length > 0 ? (
          <>
            <SectionLabel>Affected scenarios</SectionLabel>
            <div>
              {signal.affected_scenarios.map((name) => (
                <ScenarioChip key={name} name={name} />
              ))}
            </div>
          </>
        ) : null}

        <div
          style={{
            marginTop: '1.25rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--rule)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.74rem',
            color: 'var(--fg-4)',
            letterSpacing: '0.04em',
          }}
        >
          Published: {formatDateLong(signal.published_at)} · Detected: {formatDateLong(signal.detected_at)}
        </div>
      </div>
    </details>
  );
}

export function SignalsFeed() {
  const data = signalsData as SignalsData;
  const filtered = data.signals.filter((s) =>
    withinWindow(data.generated_at, s.detected_at, WINDOW_DAYS),
  );

  return (
    <section className="dg-signals-feed" style={{ margin: '1.25rem 0 2.5rem' }}>
      {/* Caption sits at the page column, aligned with the H2 above. Plain
          muted text, no panel chrome. */}
      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.92rem',
          color: 'var(--fg-3)',
          marginTop: 0,
          marginBottom: '1.25rem',
          lineHeight: 1.6,
        }}
      >
        {filtered.length} observation{filtered.length === 1 ? '' : 's'} from the
        past {WINDOW_DAYS} days. Each card expands to show the source, the
        scanner&apos;s read on confidence and verification, the impact analysis,
        and the scenarios it affects.
      </p>

      <div>
        {filtered.map((s) => (
          <SignalCard key={s.id} signal={s} />
        ))}
      </div>

      <p
        style={{
          marginTop: '2rem',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.88rem',
          lineHeight: 1.7,
          color: 'var(--fg-3)',
        }}
      >
        This is a four-week sample. The live analysis runs against a substantially
        wider horizon and uses many more signals than are reproduced here. The
        full feed is held at VALIS; each signal above links back to its primary
        source so the underlying claims are independently checkable.
      </p>
    </section>
  );
}
