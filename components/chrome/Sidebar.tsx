import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PAGES, REPO_URL, REPO_RAW_URL } from '@/lib/pages';
import { getIcon, IconX } from '@/components/icons';

export function Sidebar() {
  const router = useRouter();
  const slug = (router.query.slug as string) ?? router.pathname.replace('/', '');
  const [open, setOpen] = useState(false);

  // Open via custom event fired by the topbar burger
  useEffect(() => {
    function handleOpen() {
      setOpen(true);
    }
    window.addEventListener('open-sidebar', handleOpen);
    return () => window.removeEventListener('open-sidebar', handleOpen);
  }, []);

  // Close on route change
  useEffect(() => {
    function handleRoute() {
      setOpen(false);
    }
    router.events.on('routeChangeStart', handleRoute);
    return () => router.events.off('routeChangeStart', handleRoute);
  }, [router.events]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open]);

  // Lock body scroll when open on mobile
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {open ? (
        <div
          className="dg-sidebar-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      ) : null}
      <aside className={`dg-sidebar${open ? ' dg-sidebar--open' : ''}`}>
        <button
          className="dg-sidebar-close"
          type="button"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        >
          <IconX size={18} />
        </button>

        <div className="dg-sidebar-group">
          <p className="dg-sidebar-group-label">Framework</p>
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

        {/* Benchmarks section removed 2026-07-06: pages deleted, routes 404. */}

        <div className="dg-sidebar-group">
          <p className="dg-sidebar-group-label">Appendix</p>
          <Link
            href="/about/"
            className={`dg-sidebar-item${slug === 'about' ? ' dg-sidebar-item--active' : ''}`}
          >
            <span className="dg-sidebar-num">A1</span>
            <span>About</span>
          </Link>
          <Link
            href="/mcp/"
            className={`dg-sidebar-item${slug === 'mcp' ? ' dg-sidebar-item--active' : ''}`}
          >
            <span className="dg-sidebar-num">A2</span>
            <span>MCP server</span>
          </Link>
          <a className="dg-sidebar-item" href="/llms.txt" target="_blank" rel="noreferrer">
            <span className="dg-sidebar-num">A3</span>
            <span>llms.txt index</span>
          </a>
          <a className="dg-sidebar-item" href="/llms-full.txt" target="_blank" rel="noreferrer">
            <span className="dg-sidebar-num">A4</span>
            <span>Full text bundle</span>
          </a>
          <a className="dg-sidebar-item" href={`${REPO_URL}/tree/main`} target="_blank" rel="noreferrer">
            <span className="dg-sidebar-num">A5</span>
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
    </>
  );
}

// Suppress unused-import warning in case Sidebar built without raw URL
void REPO_RAW_URL;
