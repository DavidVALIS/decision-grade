import Link from 'next/link';
import { IconSearch, IconGitHub, IconMenu, ValisMark } from '@/components/icons';
import { ThemeToggle } from '@/components/ThemeToggle';
import { REPO_URL } from '@/lib/pages';

function openSearch() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('open-search'));
  }
}

function openSidebar() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('open-sidebar'));
  }
}

export function TopBar() {
  return (
    <header className="dg-topbar">
      <div className="dg-topbar-inner">
        <button
          className="dg-burger"
          type="button"
          title="Open navigation"
          aria-label="Open navigation"
          onClick={openSidebar}
        >
          <IconMenu size={20} />
        </button>

        <Link href="/introduction/" className="dg-brand">
          <ValisMark size={24} />
          <span className="dg-brand-text">Decision-Grade AI</span>
        </Link>

        <div className="dg-topbar-actions">
          <button
            className="icon-btn"
            type="button"
            title="Search"
            aria-label="Search"
            onClick={openSearch}
          >
            <IconSearch size={16} />
          </button>
          <a
            className="icon-btn dg-desktop-only"
            title="Source on GitHub"
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Source on GitHub"
          >
            <IconGitHub size={16} />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
