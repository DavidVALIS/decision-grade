import { useEffect, useState } from 'react';
import { REPO_URL, REPO_RAW_URL } from '@/lib/pages';

export type TocItem = {
  id: string;
  label: string;
  depth: number;
};

export function TOC({ items, slug }: { items: TocItem[]; slug: string }) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (items.length === 0) return;
    const ids = items.map((it) => it.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: [0, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const editUrl = `${REPO_URL}/edit/main/${slug}.mdx`;
  const rawUrl = `${REPO_RAW_URL}/${slug}.mdx`;
  const askUrl = '/llms-full.txt';

  return (
    <aside className="dg-toc" aria-label="On this page">
      <p className="dg-toc-title">
        <span
          style={{
            display: 'inline-block',
            width: 12,
            height: 1,
            background: 'var(--accent)',
          }}
        />
        On this page
      </p>
      {items.map((it) => (
        <a
          key={it.id}
          href={`#${it.id}`}
          className={`dg-toc-item${activeId === it.id ? ' dg-toc-item--active' : ''}`}
          style={it.depth === 3 ? { paddingLeft: 26, fontSize: '0.78rem' } : undefined}
        >
          {it.label}
        </a>
      ))}

      <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--rule)' }}>
        <p className="dg-toc-title" style={{ marginBottom: 14 }}>
          <span
            style={{
              display: 'inline-block',
              width: 12,
              height: 1,
              background: 'var(--accent)',
            }}
          />
          Verification
        </p>
        <a
          href={editUrl}
          target="_blank"
          rel="noreferrer"
          className="dg-toc-item"
          style={{ borderLeft: 0, paddingLeft: 0, marginLeft: 0 }}
        >
          Edit on GitHub →
        </a>
        <a
          href={rawUrl}
          target="_blank"
          rel="noreferrer"
          className="dg-toc-item"
          style={{ borderLeft: 0, paddingLeft: 0, marginLeft: 0 }}
        >
          View Markdown source →
        </a>
        <a
          href={askUrl}
          target="_blank"
          rel="noreferrer"
          className="dg-toc-item"
          style={{ borderLeft: 0, paddingLeft: 0, marginLeft: 0 }}
        >
          Ask any AI to read it →
        </a>
      </div>
    </aside>
  );
}
