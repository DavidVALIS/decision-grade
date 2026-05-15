import { useEffect, useId, useRef, useState } from 'react';

type Props = {
  chart?: string;
  children?: string;
};

let mermaidPromise: Promise<typeof import('mermaid')['default']> | null = null;

function getMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((mod) => {
      const m = mod.default;
      m.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'loose',
        fontFamily: 'DM Mono, SF Mono, Menlo, monospace',
        themeVariables: {
          background: '#15130f',
          primaryColor: '#15130f',
          primaryTextColor: '#efe9dc',
          primaryBorderColor: '#3a342b',
          lineColor: '#a09a8c',
          secondaryColor: '#1c1915',
          tertiaryColor: '#0c0b09',
        },
      });
      return m;
    });
  }
  return mermaidPromise;
}

export function Mermaid({ chart, children }: Props) {
  const code = (chart ?? (typeof children === 'string' ? children : '')).trim();
  const ref = useRef<HTMLDivElement | null>(null);
  const reactId = useId();
  const id = `dg-mermaid-${reactId.replace(/[^a-zA-Z0-9]/g, '')}`;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!code || !ref.current) return;
    getMermaid()
      .then((mermaid) => mermaid.render(id, code))
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
  }, [code, id]);

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
