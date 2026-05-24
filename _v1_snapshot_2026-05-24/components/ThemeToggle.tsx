import { useEffect, useState } from 'react';
import { IconSun, IconMoon } from '@/components/icons';

const STORAGE_KEY = 'dg-theme';

type Theme = 'light' | 'dark';

function readInitial(): Theme {
  if (typeof window === 'undefined') return 'dark';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === 'light' || stored === 'dark') return stored;
    const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)').matches;
    return prefersLight ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
}

export function ThemeToggle() {
  // Avoid hydration mismatch: render a placeholder until mounted, then sync.
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const initial = readInitial();
    setTheme(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  };

  // Render the placeholder shape on first render so layout stays stable.
  if (!mounted) {
    return (
      <button
        className="icon-btn"
        type="button"
        aria-label="Toggle theme"
        aria-hidden="true"
        tabIndex={-1}
      >
        <IconMoon size={16} />
      </button>
    );
  }

  return (
    <button
      className="icon-btn"
      type="button"
      onClick={toggle}
      title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {theme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
    </button>
  );
}
