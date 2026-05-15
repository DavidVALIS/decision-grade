import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IconSearch, IconSparkle, IconGitHub, ValisMark } from '@/components/icons';
import { REPO_URL } from '@/lib/pages';

function openSearch() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('open-search'));
  }
}

export function TopBar() {
  const router = useRouter();
  const slug = (router.query.slug as string) ?? router.pathname.replace('/', '');
  const isAbout = slug === 'about';
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsMac(/Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent));
    }
  }, []);

  return (
    <header className="dg-topbar">
      <div className="dg-topbar-inner">
        <Link href="/introduction/" className="dg-brand">
          <ValisMark size={24} />
          <span className="dg-brand-text">Decision-Grade AI</span>
        </Link>

        <nav className="dg-topnav" aria-label="Primary">
          <Link href="/introduction/" className={!isAbout ? 'active' : ''}>
            Framework
          </Link>
          <Link href="/about/" className={isAbout ? 'active' : ''}>
            About
          </Link>
          <a href={REPO_URL} target="_blank" rel="noreferrer">
            Source
          </a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            className="dg-search"
            type="button"
            aria-label="Search (press Cmd K or forward slash)"
            onClick={openSearch}
          >
            <IconSearch size={14} />
            <span>Search or ask...</span>
            <span className="kbd">{isMac ? '⌘K' : 'Ctrl K'}</span>
          </button>
          <a
            className="icon-btn"
            title="Source on GitHub"
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Source on GitHub"
          >
            <IconGitHub size={16} />
          </a>
          <button
            className="icon-btn"
            type="button"
            title="Ask VALIS"
            aria-label="Ask VALIS"
            onClick={openSearch}
          >
            <IconSparkle size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
