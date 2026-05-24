import type { ReactNode } from 'react';
import { TopBar } from '@/components/chrome/TopBar';
import { Sidebar } from '@/components/chrome/Sidebar';
import { TOC, type TocItem } from '@/components/chrome/TOC';
import { Pager } from '@/components/chrome/Pager';
import { Search } from '@/components/Search';
import { getBySlug, getPrev, getNext, REPO_URL } from '@/lib/pages';
import { getIcon } from '@/components/icons';

export type LayoutProps = {
  slug: string;
  title?: string;
  description?: string;
  toc?: TocItem[];
  children: ReactNode;
};

export function Layout({ slug, title, description, toc = [], children }: LayoutProps) {
  const page = getBySlug(slug);
  const prev = page ? getPrev(slug) : undefined;
  const next = page ? getNext(slug) : undefined;
  const Icon = page ? getIcon(page.icon) : undefined;
  const year = new Date().getFullYear();

  return (
    <>
      <TopBar />
      <div className="dg-shell">
        <Sidebar />
        <main className="dg-content">
          <div className="dg-content-header">
            {Icon ? <Icon size={20} style={{ color: 'var(--accent)' }} /> : null}
            {page ? (
              <span className="dg-content-header-label">
                {page.num} · {page.title}
              </span>
            ) : (
              <span className="dg-content-header-label">{title ?? slug}</span>
            )}
          </div>

          {title ? <h1 className="dg-display">{title}</h1> : null}
          {description ? <p className="dg-subhead">{description}</p> : null}

          <div className="dg-body">{children}</div>

          <Pager prev={prev} next={next} />
        </main>
        <TOC items={toc} slug={slug} />
      </div>

      <footer className="dg-footer">
        <span>© {year} David Lundblad · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a></span>
        <span className="dg-footer-links">
          <a href="/about/">About</a>
          <span aria-hidden="true">·</span>
          <a href="/llms.txt" target="_blank" rel="noreferrer">llms.txt</a>
          <span aria-hidden="true">·</span>
          <a href="/llms-full.txt" target="_blank" rel="noreferrer">llms-full.txt</a>
          <span aria-hidden="true">·</span>
          <a href="/mcp/">MCP</a>
          <span aria-hidden="true">·</span>
          <a href={REPO_URL} target="_blank" rel="noreferrer">Source on GitHub</a>
        </span>
      </footer>
      <div className="grain-overlay" aria-hidden="true" />
      <Search />
    </>
  );
}
