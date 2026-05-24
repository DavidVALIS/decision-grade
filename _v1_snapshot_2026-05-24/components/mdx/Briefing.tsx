import type { CSSProperties, ReactNode } from 'react';
import briefingData from '@/data/briefing.json';

/**
 * Briefing UI panel. The data fields (lead, assessment, watch list,
 * transparency) are structural, not editorial, and the layout treats them
 * that way: a bordered panel with section labels in mono caps, and a
 * two-column grid inside each section (a fixed-width chip column on the
 * left, body column on the right) so the grounding chips anchor their
 * rows instead of floating after them.
 */

type Grounding = 'verified' | 'analytical' | 'pv';

type Paragraph = {
  body: string;
  grounding?: Grounding;
};

type WatchItem = {
  id: string;
  title: string;
  summary: string;
  grounding?: Grounding;
};

type BriefingData = {
  generated_at: string;
  analysis_version: string;
  decision_grade: string;
  lead: Paragraph;
  assessment: Paragraph[];
  watch_list: WatchItem[];
  transparency: string[];
};

const GROUNDING_LABEL: Record<Grounding, string> = {
  verified: 'Verified',
  analytical: 'Analytical',
  pv: 'Peripheral',
};

const GROUNDING_FG: Record<Grounding, string> = {
  verified: 'var(--verified)',
  analytical: 'var(--citation)',
  pv: 'var(--challenged)',
};

const GROUNDING_BG: Record<Grounding, string> = {
  verified: 'rgba(95, 207, 143, 0.08)',
  analytical: 'rgba(122, 167, 255, 0.08)',
  pv: 'rgba(227, 178, 97, 0.08)',
};

const CHIP_COL_WIDTH = 108;

const PANEL_STYLE: CSSProperties = {
  border: '1px solid var(--rule-strong)',
  background: 'var(--bg-2)',
  margin: '1.5rem 0 2.5rem',
};

const SECTION_STYLE: CSSProperties = {
  padding: '1.5rem 1.5rem 1.65rem',
};

const SECTION_DIVIDER_STYLE: CSSProperties = {
  borderTop: '1px solid var(--rule)',
};

const SECTION_LABEL_STYLE: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.72rem',
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
  color: 'var(--fg-3)',
  marginBottom: '1.1rem',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'baseline',
  gap: '0.5rem 0.75rem',
};

const SECTION_COUNT_STYLE: CSSProperties = {
  color: 'var(--fg-4)',
  fontWeight: 400,
};

const ROW_STYLE: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: `${CHIP_COL_WIDTH}px 1fr`,
  gap: '1.2rem',
  alignItems: 'start',
};

const ROW_GAP_STYLE: CSSProperties = {
  marginTop: '0.85rem',
};

function formatGeneratedAt(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const [, year, monthStr, dayStr] = m;
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${Number(dayStr)} ${months[Number(monthStr) - 1] ?? monthStr} ${year}`;
}

function Chip({ grounding }: { grounding?: Grounding }) {
  if (!grounding) {
    // Render a placeholder of identical dimensions so rows still grid-align
    // when a particular row lacks a chip (currently never on briefing data,
    // but keeps the layout robust).
    return <span aria-hidden="true" style={{ display: 'block' }} />;
  }
  const fg = GROUNDING_FG[grounding];
  const bg = GROUNDING_BG[grounding];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${CHIP_COL_WIDTH}px`,
        boxSizing: 'border-box',
        padding: '0.32rem 0.55rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.68rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        border: `1px solid ${fg}`,
        background: bg,
        color: fg,
        lineHeight: 1.3,
        whiteSpace: 'nowrap',
      }}
    >
      {GROUNDING_LABEL[grounding]}
    </span>
  );
}

function SectionLabel({ label, count }: { label: string; count?: string }) {
  return (
    <div style={SECTION_LABEL_STYLE}>
      <span style={{ color: 'var(--fg-2)' }}>{label}</span>
      {count ? <span style={SECTION_COUNT_STYLE}>· {count}</span> : null}
    </div>
  );
}

function Section({
  label,
  count,
  isFirst,
  children,
}: {
  label: string;
  count?: string;
  isFirst?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        ...SECTION_STYLE,
        ...(isFirst ? {} : SECTION_DIVIDER_STYLE),
      }}
    >
      <SectionLabel label={label} count={count} />
      {children}
    </div>
  );
}

function Row({
  grounding,
  isFirst,
  children,
}: {
  grounding?: Grounding;
  isFirst?: boolean;
  children: ReactNode;
}) {
  return (
    <div style={{ ...ROW_STYLE, ...(isFirst ? {} : ROW_GAP_STYLE) }}>
      <Chip grounding={grounding} />
      <div>{children}</div>
    </div>
  );
}

export function Briefing() {
  const data = briefingData as BriefingData;
  const generatedAt = formatGeneratedAt(data.generated_at);

  return (
    <section className="dg-briefing" style={PANEL_STYLE}>
      {/* Lead. The headline read of the briefing. Set in serif italic for
          weight, but laid out as a row so the chip anchors it like any
          other data field. */}
      <Section label="Lead" count={`as of ${generatedAt}`} isFirst>
        <Row grounding={data.lead.grounding} isFirst>
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.18rem',
              lineHeight: 1.5,
              color: 'var(--fg-1)',
              fontStyle: 'italic',
              fontWeight: 300,
            }}
          >
            {data.lead.body}
          </div>
        </Row>
      </Section>

      {/* Assessment. Multi-paragraph reasoning, each paragraph carrying its
          own grounding chip in the left column. */}
      <Section
        label="Assessment"
        count={`${data.assessment.length} paragraphs`}
      >
        {data.assessment.map((paragraph, i) => (
          <Row key={i} grounding={paragraph.grounding} isFirst={i === 0}>
            <div
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.95rem',
                lineHeight: 1.65,
                color: 'var(--fg-2)',
              }}
            >
              {paragraph.body}
            </div>
          </Row>
        ))}
      </Section>

      {/* Watch list. Each row is a tripwire with a title and a summary in
          the body column, and the grounding chip in the left column. */}
      <Section
        label="Watch list"
        count={`${data.watch_list.length} tripwires`}
      >
        {data.watch_list.map((item, i) => (
          <Row key={item.id} grounding={item.grounding} isFirst={i === 0}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: 'var(--fg-1)',
                marginBottom: '0.35rem',
              }}
            >
              {item.title}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.95rem',
                lineHeight: 1.65,
                color: 'var(--fg-2)',
              }}
            >
              {item.summary}
            </div>
          </Row>
        ))}
      </Section>

      {/* Transparency. Disclosures about the briefing itself: the analytical
          weight, the uncertainty, the assumptions. No grounding chips, since
          these are not data items. Rendered smaller and in muted colour. */}
      <Section label="Transparency">
        {data.transparency.map((paragraph, i) => (
          <div
            key={i}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.88rem',
              lineHeight: 1.7,
              color: 'var(--fg-3)',
              marginTop: i === 0 ? 0 : '0.7rem',
            }}
          >
            {paragraph}
          </div>
        ))}
      </Section>
    </section>
  );
}
