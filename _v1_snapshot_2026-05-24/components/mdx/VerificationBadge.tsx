import type { CSSProperties, ReactNode } from 'react';

/**
 * VALIS Verification Badges. Adapted from the design-system prototype at
 * Documentation/decision-grade-ai/VALIS Verification Badge/ for use inside
 * MDX pages on decision-grade.ai.
 *
 * Visual stance: paper-cream artifact on the dark site, like a postmark on a
 * letter. The badge marks where VALIS-generated content begins and ends so the
 * doctrine voice and the analyzer voice never blur together.
 *
 * Two public wrappers in this file:
 *   <BadgeRule>    inline horizontal colophon, opens the VALIS-framed band
 *   <BadgeFooter>  full-width strip, closes the band with metadata + verify URL
 *
 * Plus <VerificationFrame> which sandwiches arbitrary children between a Rule
 * and a Footer, swapping in light-paper CSS variables for the children so that
 * existing dark-themed components (Stat, Card, Accordion) recolor automatically.
 */

const PAPER = '#f4f0e8';
const PAPER_DEEP = '#eee8dc';
const INK = '#1a1814';
const INK_SOFT = '#3a3530';
const INK_MUTED = '#6e6960';
const INK_FAINT = '#8a847a';
const SALMON = '#E79583';

/**
 * Theme palette. The badges have two modes:
 *   paper: cream artifact, used in the standalone Verification Badge gallery.
 *   dark:  site-native attribution stamp on decision-grade.ai. Reads as a
 *          decision-grade element with VALIS credit, not as a VALIS artifact.
 */
type Theme = 'paper' | 'dark';

type ThemePalette = {
  bg: string;
  text: string;
  textSoft: string;
  textMuted: string;
  textFaint: string;
  border: string;
  rule: string;
  accent: string;
};

const PALETTES: Record<Theme, ThemePalette> = {
  paper: {
    bg: PAPER,
    text: INK,
    textSoft: INK_SOFT,
    textMuted: INK_MUTED,
    textFaint: INK_FAINT,
    border: INK,
    rule: 'rgba(26,24,20,0.25)',
    accent: SALMON,
  },
  dark: {
    bg: 'var(--bg-2)',
    text: 'var(--fg-1)',
    textSoft: 'var(--fg-2)',
    textMuted: 'var(--fg-3)',
    textFaint: 'var(--fg-4)',
    border: 'var(--rule-strong)',
    rule: 'var(--rule)',
    accent: 'var(--accent)',
  },
};

/**
 * Decision Grade taxonomy. Canonical scale used across VALIS.
 *
 *   A · 86-100 · Exemplary
 *   B · 71-85  · Research-Grade
 *   C · 51-70  · Structurally Sound
 *   D · 26-50  · Developing Structure
 *   F · 0-25   · Structurally Ungrounded
 *
 * All of A/B/C render in green: each is a band of acceptable structural
 * grounding. D renders amber (developing). F renders red (ungrounded).
 * The "Decision-Ready / Actionable / Developing / Not Ready" labels belong
 * to a separate Thesis Readiness zone scale and are not used on this badge.
 */
type Grade = 'A' | 'B' | 'C' | 'D' | 'F';

type GradeMeta = { fg: string; bg: string; label: string; range: string };

/** Grade colors for the paper theme. */
const GRADE_COLORS_PAPER: Record<Grade, GradeMeta> = {
  A: { fg: '#16803C', bg: 'rgba(22,128,60,0.10)', label: 'Exemplary', range: '86–100' },
  B: { fg: '#16803C', bg: 'rgba(22,128,60,0.08)', label: 'Research-Grade', range: '71–85' },
  C: { fg: '#16803C', bg: 'rgba(22,128,60,0.06)', label: 'Structurally Sound', range: '51–70' },
  D: { fg: '#B45309', bg: 'rgba(180,83,9,0.08)', label: 'Developing Structure', range: '26–50' },
  F: { fg: '#B53939', bg: 'rgba(181,57,57,0.08)', label: 'Structurally Ungrounded', range: '0–25' },
};

/** Grade colors for the dark theme. Uses the site's existing status tokens. */
const GRADE_COLORS_DARK: Record<Grade, GradeMeta> = {
  A: { fg: 'var(--verified)', bg: 'rgba(95,207,143,0.10)', label: 'Exemplary', range: '86–100' },
  B: { fg: 'var(--verified)', bg: 'rgba(95,207,143,0.08)', label: 'Research-Grade', range: '71–85' },
  C: { fg: 'var(--verified)', bg: 'rgba(95,207,143,0.06)', label: 'Structurally Sound', range: '51–70' },
  D: { fg: 'var(--challenged)', bg: 'rgba(227,178,97,0.08)', label: 'Developing Structure', range: '26–50' },
  F: { fg: 'var(--unverified)', bg: 'rgba(255,122,110,0.08)', label: 'Structurally Ungrounded', range: '0–25' },
};

function gradeMeta(grade: Grade, theme: Theme): GradeMeta {
  return (theme === 'dark' ? GRADE_COLORS_DARK : GRADE_COLORS_PAPER)[grade];
}

const FONT_MONO = "'DM Mono', ui-monospace, 'SF Mono', Menlo, monospace";
const FONT_SERIF = "'Cormorant Garamond', Georgia, serif";

/** Small 5-square mark used inline next to the VALIS wordmark. */
function StaticMark({ size = 12, color = SALMON }: { size?: number; color?: string }) {
  const s = size;
  const g = s * 0.45;
  const sq = s * 0.36;
  const positions: [number, number][] = [
    [s / 2 - sq / 2, s / 2 - sq / 2],
    [s / 2 - sq / 2, s / 2 - sq / 2 - g],
    [s / 2 - sq / 2 + g, s / 2 - sq / 2],
    [s / 2 - sq / 2, s / 2 - sq / 2 + g],
    [s / 2 - sq / 2 - g, s / 2 - sq / 2],
  ];
  const ops = [1, 0.72, 0.48, 0.85, 0.58];
  return (
    <span style={{ position: 'relative', width: s, height: s, display: 'inline-block', flexShrink: 0 }}>
      {positions.map(([x, y], i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: sq,
            height: sq,
            background: color,
            opacity: ops[i],
            borderRadius: sq * 0.2,
          }}
        />
      ))}
    </span>
  );
}

function GradeLetter({ grade, size = 44, color = INK }: { grade: Grade; size?: number; color?: string }) {
  // F is the only "failed" grade in the taxonomy and reads in italic to
  // distinguish it visually from the structurally-sound tier.
  const italic = grade === 'F';
  return (
    <span
      style={{
        fontFamily: FONT_SERIF,
        fontWeight: 300,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: '-0.04em',
        color,
        fontStyle: italic ? 'italic' : 'normal',
      }}
    >
      {grade}
    </span>
  );
}

function formatBadgeDate(iso?: string): string {
  if (!iso) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const [, year, month, day] = m;
  return `${day}.${month}.${year.slice(2)}`;
}

export type BadgeRuleProps = {
  grade?: Grade;
  hash?: string;
  date?: string;
  size?: 'sm' | 'md' | 'lg';
  /**
   * Visual theme. `paper` is the cream artifact from the design system gallery.
   * `dark` is the site-native variant used as a VALIS attribution stamp on
   * decision-grade.ai's dark theme. Defaults to `paper` for backwards-compat.
   */
  theme?: Theme;
  /**
   * Eyebrow mode. When true, the badge renders as a small attribution line
   * that sits directly above a section heading: no top/bottom borders, no
   * background block, tight padding. The class hook .dg-badge-rule--eyebrow
   * pairs with a sibling rule in style.css that pulls the following h2 close.
   */
  eyebrow?: boolean;
};

/** Inline horizontal colophon. Used as a VALIS attribution stamp. */
export function BadgeRule({
  grade = 'A',
  hash = '',
  date = '',
  size,
  theme = 'paper',
  eyebrow = false,
}: BadgeRuleProps) {
  const gc = gradeMeta(grade, theme);
  const palette = PALETTES[theme];
  const sizeMap = {
    sm: { fs: 9, py: 5, gap: 10, markSize: 9 },
    md: { fs: 11, py: 8, gap: 14, markSize: 11 },
    lg: { fs: 13, py: 11, gap: 18, markSize: 13 },
  };
  // Eyebrow defaults to small. Otherwise default to md.
  const S = sizeMap[size ?? (eyebrow ? 'sm' : 'md')];
  const dateLabel = /^\d{4}-\d{2}-\d{2}/.test(date) ? formatBadgeDate(date) : date;
  const gradeLabel =
    grade === 'A' || grade === 'B' || grade === 'C' ? `Grade ${grade}` : gc.label;

  const className = eyebrow ? 'dg-badge-rule dg-badge-rule--eyebrow' : 'dg-badge-rule';

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: S.gap,
        borderTop: eyebrow ? 'none' : `1px solid ${palette.border}`,
        borderBottom: eyebrow ? 'none' : `1px solid ${palette.border}`,
        padding: eyebrow ? '0' : `${S.py}px ${S.gap + 2}px`,
        background: eyebrow ? 'transparent' : palette.bg,
        marginBottom: eyebrow ? '0.5rem' : undefined,
        fontFamily: FONT_MONO,
        fontSize: S.fs,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: palette.text,
        flexWrap: 'wrap',
      }}
    >
      <StaticMark size={S.markSize} color={palette.accent} />
      <span style={{ fontWeight: 700 }}>VALIS</span>
      <span style={{ color: palette.textFaint }}>Verified</span>
      <span style={{ color: palette.rule }}>·</span>
      <span style={{ color: gc.fg, fontWeight: 500 }}>{gradeLabel}</span>
      {hash ? (
        <>
          <span style={{ color: palette.rule }}>·</span>
          <span style={{ color: palette.textMuted, textTransform: 'none', letterSpacing: '0.04em' }}>
            {hash}
          </span>
        </>
      ) : null}
      {dateLabel ? (
        <>
          <span style={{ color: palette.rule }}>·</span>
          <span style={{ color: palette.textMuted }}>{dateLabel}</span>
        </>
      ) : null}
    </div>
  );
}

export type BadgeFooterProps = {
  grade?: Grade;
  hash?: string;
  date?: string;
  claims?: number;
  /** Kept for forward-compat; not rendered. */
  models?: number;
  /** Kept for forward-compat; not rendered. */
  frameworks?: number;
  /** Kept for forward-compat; not rendered. */
  verifyUrl?: string;
  /** Visual theme. Defaults to `paper`. */
  theme?: Theme;
};

/** Full-width strip. Closes a VALIS-framed band with metadata. */
export function BadgeFooter({
  grade = 'A',
  hash = '',
  date = '',
  claims,
  theme = 'paper',
}: BadgeFooterProps) {
  const gc = gradeMeta(grade, theme);
  const palette = PALETTES[theme];
  const dateLabel = /^\d{4}-\d{2}-\d{2}/.test(date) ? formatBadgeDate(date) : date;

  return (
    <div
      style={{
        borderTop: `1px solid ${palette.border}`,
        borderBottom: `1px solid ${palette.border}`,
        background: palette.bg,
        padding: '20px 24px',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        gap: 24,
      }}
    >
      {/* Left: mark + wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
        <StaticMark size={16} color={palette.accent} />
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.36em',
              color: palette.text,
            }}
          >
            VALIS
          </div>
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 8.5,
              letterSpacing: '0.18em',
              color: palette.textFaint,
              textTransform: 'uppercase',
              marginTop: 2,
            }}
          >
            Structural Verification
          </div>
        </div>
      </div>

      {/* Center: grade */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '0 24px',
          borderLeft: `1px solid ${palette.border}`,
          borderRight: `1px solid ${palette.border}`,
        }}
      >
        <GradeLetter grade={grade} size={44} color={gc.fg} />
        <div>
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 8,
              letterSpacing: '0.14em',
              color: palette.textFaint,
              textTransform: 'uppercase',
            }}
          >
            Decision Grade
          </div>
          <div
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: 18,
              color: gc.fg,
              lineHeight: 1.1,
              marginTop: 2,
            }}
          >
            {gc.label}
          </div>
        </div>
      </div>

      {/* Right: metadata. Claims + hash + date only. No models/frameworks line,
          no verify link, per editorial direction. */}
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 9.5,
          color: palette.textMuted,
          letterSpacing: '0.04em',
          lineHeight: 1.75,
          textAlign: 'right',
          minWidth: 0,
        }}
      >
        {typeof claims === 'number' ? <div>{claims.toLocaleString()} claims</div> : null}
        <div style={{ color: palette.textFaint, wordBreak: 'break-all' }}>
          {[hash, dateLabel].filter(Boolean).join(' · ')}
        </div>
      </div>
    </div>
  );
}

export type VerificationFrameProps = {
  grade?: Grade;
  hash?: string;
  date?: string;
  claims?: number;
  models?: number;
  frameworks?: number;
  verifyUrl?: string;
  children?: ReactNode;
};

/**
 * Wraps content in a paper-cream VALIS-framed band. Not used on the current
 * site pages (which sit in doctrine voice with the BadgeRule as a small
 * attribution stamp), but kept as a design primitive for any future page that
 * wants the full band treatment. If you reach for this on decision-grade.ai,
 * make sure you also restore the `.dg-valis-band` CSS overrides that used to
 * sit in style.css.
 */
export function VerificationFrame({
  grade = 'A',
  hash,
  date,
  claims,
  models,
  frameworks,
  verifyUrl,
  children,
}: VerificationFrameProps) {
  return (
    <div className="dg-valis-frame" style={{ margin: '2.5rem 0' }}>
      <BadgeRule grade={grade} hash={hash} date={date} />
      <div className="dg-valis-band">{children}</div>
      <BadgeFooter
        grade={grade}
        hash={hash}
        date={date}
        claims={claims}
        models={models}
        frameworks={frameworks}
        verifyUrl={verifyUrl}
      />
    </div>
  );
}
