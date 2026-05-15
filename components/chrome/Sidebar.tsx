import Link from 'next/link';
import { useRouter } from 'next/router';
import { PAGES, REPO_URL, REPO_RAW_URL } from '@/lib/pages';
import { getIcon } from '@/components/icons';

export function Sidebar() {
  const router = useRouter();
  const slug = (router.query.slug as string) ?? router.pathname.replace('/', '');

  return (
    <aside className="dg-sidebar">
      <div className="dg-sidebar-group">
        <p className="dg-sidebar-group-label">Framework · v1.0</p>
        {PAGES.map((p) => {
          const Icon = getIcon(p.icon);
          const active = slug === p.id;
          return (
            <Link
              key={p.id}
              href={`/${p.id}/`}
              className={`dg-sidebar-item${active ? ' dg-sidebar-item--active' : ''}`}
            >
              <span className="dg-sidebar-num">{p.num}</span>
              {Icon ? <Icon className="dg-sidebar-icon" size={16} /> : null}
              <span>{p.title}</span>
            </Link>
          );
        })}
      </div>

      <div className="dg-sidebar-group">
        <p className="dg-sidebar-group-label">Appendix</p>
        <Link
          href="/mcp/"
          className={`dg-sidebar-item${slug === 'mcp' ? ' dg-sidebar-item--active' : ''}`}
        >
          <span className="dg-sidebar-num">A1</span>
          <span>MCP server</span>
        </Link>
        <a className="dg-sidebar-item" href="/llms.txt" target="_blank" rel="noreferrer">
          <span className="dg-sidebar-num">A2</span>
          <span>llms.txt index</span>
        </a>
        <a className="dg-sidebar-item" href="/llms-full.txt" target="_blank" rel="noreferrer">
          <span className="dg-sidebar-num">A3</span>
          <span>Full text bundle</span>
        </a>
        <a className="dg-sidebar-item" href={`${REPO_URL}/tree/main`} target="_blank" rel="noreferrer">
          <span className="dg-sidebar-num">A4</span>
          <span>Markdown source</span>
        </a>
      </div>

      <div className="dg-sidebar-group" style={{ marginTop: 'auto' }}>
        <p className="dg-sidebar-group-label">Posture</p>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: '0.95rem',
            lineHeight: 1.5,
            color: 'var(--fg-3)',
            margin: 0,
            paddingRight: 8,
          }}
        >
          If the analysis can&apos;t be checked, it hasn&apos;t been earned.
        </p>
      </div>
    </aside>
  );
}

// Suppress unused-import warning in case Sidebar built without raw URL
void REPO_RAW_URL;
