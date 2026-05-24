import { useEffect, useId, useRef, useState } from 'react';

type Props = {
  chart?: string;
  children?: string;
};

type Theme = 'dark' | 'light';

// VALIS palette per theme.
const PALETTE = {
  dark: {
    bg: '#15130f',
    bgAlt: '#1c1915',
    text: '#efe9dc',
    textSubtle: '#a09a8c',
    border: '#3a342b',
    edge: '#a09a8c',
    edgeLabelBg: '#15130f',
  },
  light: {
    bg: '#eee8dc',
    bgAlt: '#e8e2d6',
    text: '#1a1814',
    textSubtle: '#6e6960',
    border: '#b8b1a3',
    edge: '#6e6960',
    edgeLabelBg: '#eee8dc',
  },
} as const;

// Map hardcoded hex values used in MDX mermaid blocks to VALIS-aligned values.
// Original colors were: slate-800 default, dark-red failure, dark-green success,
// dark-amber warning. Each maps to a muted, on-brand tone per theme.
function applyValisColors(chart: string, theme: Theme): string {
  const p = PALETTE[theme];
  const map: Record<string, string> = theme === 'dark'
    ? {
        '#1E293B': p.bg,        // slate default -> bg-2
        '#7F1D1D': '#3a1f1c',   // dark red failure -> muted brick
        '#14532D': '#1a3624',   // dark green success -> muted forest
        '#7C2D12': '#3a2517',   // dark amber warning -> muted umber
      }
    : {
        '#1E293B': p.bg,
        '#7F1D1D': '#f0d6d1',   // muted salmon on paper
        '#14532D': '#d8e8dc',   // muted sage on paper
        '#7C2D12': '#f0e0c8',   // muted ochre on paper
      };

  let out = chart;
  for (const [from, to] of Object.entries(map)) {
    out = out.split(from).join(to);
  }
  // Re-color the "white" text in light theme.
  if (theme === 'light') {
    out = out.replace(/color:#fff/gi, 'color:#1a1814');
  }
  return out;
}

let mermaidPromise: Promise<typeof import('mermaid')['default']> | null = null;
let currentTheme: Theme | null = null;

async function getMermaid(theme: Theme) {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((mod) => mod.default);
  }
  const m = await mermaidPromise;
  if (currentTheme !== theme) {
    const p = PALETTE[theme];
    m.initialize({
      startOnLoad: false,
      theme: 'base',
      securityLevel: 'loose',
      fontFamily: 'DM Mono, SF Mono, Menlo, monospace',
      flowchart: {
        curve: 'basis',
        padding: 16,
        nodeSpacing: 40,
        rankSpacing: 56,
      },
      themeVariables: {
        // Base / background
        background: 'transparent',
        // Node defaults
        primaryColor: p.bg,
        primaryTextColor: p.text,
        primaryBorderColor: p.border,
        // Secondary nodes (used for subgraphs and some shapes)
        secondaryColor: p.bgAlt,
        secondaryTextColor: p.text,
        secondaryBorderColor: p.border,
        // Tertiary nodes
        tertiaryColor: p.bgAlt,
        tertiaryTextColor: p.text,
        tertiaryBorderColor: p.border,
        // Edges and labels
        lineColor: p.edge,
        edgeLabelBackground: p.edgeLabelBg,
        labelTextColor: p.textSubtle,
        // Notes / clusters
        noteBkgColor: p.bgAlt,
        noteTextColor: p.text,
        noteBorderColor: p.border,
        // Timeline (used on Watchlist)
        cScale0: p.bgAlt,
        cScale1: p.bg,
        cScale2: p.bgAlt,
        cScaleLabel0: p.text,
        cScaleLabel1: p.text,
        cScaleLabel2: p.text,
        // Font sizes
        fontSize: '13px',
      },
    });
    currentTheme = theme;
  }
  return m;
}

function readTheme(): Theme {
  if (typeof document === 'undefined') return 'dark';
  const t = document.documentElement.getAttribute('data-theme');
  return t === 'light' ? 'light' : 'dark';
}

export function Mermaid({ chart, children }: Props) {
  const code = (chart ?? (typeof children === 'string' ? children : '')).trim();
  const ref = useRef<HTMLDivElement | null>(null);
  const reactId = useId();
  const id = `dg-mermaid-${reactId.replace(/[^a-zA-Z0-9]/g, '')}`;
  const [error, setError] = useState<string | null>(null);
  const [themeTick, setThemeTick] = useState(0);

  // Re-render on theme change.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'data-theme') {
          setThemeTick((n) => n + 1);
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!code || !ref.current) return;
    const theme = readTheme();
    const themedCode = applyValisColors(code, theme);
    // Force re-initialize when theme changes
    currentTheme = null;
    getMermaid(theme)
      .then((mermaid) => mermaid.render(id, themedCode))
      .then(({ svg }) => {
        if (cancelled || !ref.current) return;
        ref.current.innerHTML = svg;
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
      });
    return () => {
      cancelled = true;
    };
  }, [code, id, themeTick]);

  if (!code) return null;
  if (error) {
    return (
      <pre className="dg-mermaid" style={{ color: 'var(--unverified)' }}>
        Mermaid render error: {error}
        {'\n\n'}
        {code}
      </pre>
    );
  }
  return <div ref={ref} className="dg-mermaid" aria-label="Diagram" />;
}
