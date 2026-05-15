import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';

// Listens for: window event 'open-search', Cmd+K, Ctrl+K, '/' (when not in input).

type Section = { id: string; heading: string; text: string };
type SearchEntry = {
  slug: string;
  title: string;
  description: string;
  num: string;
  sections: Section[];
};

type Result = {
  slug: string;
  title: string;
  sectionId: string;
  heading: string;
  snippet: string;
};

type FlexDoc = {
  id: number;
  slug: string;
  anchor: string;
  title: string;
  heading: string;
  text: string;
  snippet: string;
};

export function Search() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [entries, setEntries] = useState<SearchEntry[]>([]);
  const [docs, setDocs] = useState<FlexDoc[]>([]);
  const indexRef = useRef<any>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [selected, setSelected] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Lazy load index the first time the modal opens.
  useEffect(() => {
    if (!open || loaded) return;
    let cancelled = false;
    (async () => {
      try {
        const [resp, FlexSearchModule] = await Promise.all([
          fetch('/search-index.json'),
          import('flexsearch'),
        ]);
        if (cancelled) return;
        const data: SearchEntry[] = await resp.json();
        const FlexSearch: any = (FlexSearchModule as any).default || FlexSearchModule;
        const idx = new FlexSearch.Document({
          tokenize: 'forward',
          document: {
            id: 'id',
            index: ['title', 'heading', 'text'],
            store: ['slug', 'anchor', 'title', 'heading', 'snippet'],
          },
        });

        const allDocs: FlexDoc[] = [];
        let nextId = 0;
        for (const page of data) {
          // Index the page itself
          allDocs.push({
            id: nextId++,
            slug: page.slug,
            anchor: '',
            title: page.title,
            heading: '',
            text: page.description || '',
            snippet: page.description || '',
          });
          for (const section of page.sections) {
            if (!section.text && !section.heading) continue;
            allDocs.push({
              id: nextId++,
              slug: page.slug,
              anchor: section.id,
              title: page.title,
              heading: section.heading,
              text: section.text,
              snippet: section.text.slice(0, 180),
            });
          }
        }
        for (const d of allDocs) idx.add(d);

        if (cancelled) return;
        indexRef.current = idx;
        setDocs(allDocs);
        setEntries(data);
        setLoaded(true);
      } catch (err) {
        console.error('Search index failed to load:', err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, loaded]);

  // Focus input on open; reset state on close.
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = 'hidden';
    } else {
      setQuery('');
      setResults([]);
      setSelected(0);
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Run search.
  useEffect(() => {
    const idx = indexRef.current;
    if (!idx || !query.trim()) {
      setResults([]);
      setSelected(0);
      return;
    }
    const fieldResults: Array<{ field: string; result: number[] }> = idx.search(query, {
      limit: 12,
      suggest: true,
    });
    const seen = new Set<string>();
    const out: Result[] = [];
    for (const fr of fieldResults) {
      for (const id of fr.result) {
        const d = docs[id];
        if (!d) continue;
        const key = `${d.slug}#${d.anchor}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({
          slug: d.slug,
          title: d.title,
          sectionId: d.anchor,
          heading: d.heading,
          snippet: d.snippet,
        });
        if (out.length >= 12) break;
      }
      if (out.length >= 12) break;
    }
    setResults(out);
    setSelected(0);
  }, [query, docs]);

  // Global keyboard handlers: open shortcuts + in-modal navigation.
  const closeModal = useCallback(() => setOpen(false), []);

  const goToResult = useCallback(
    (r: Result) => {
      const url = `/${r.slug}/${r.sectionId ? `#${r.sectionId}` : ''}`;
      router.push(url);
      closeModal();
    },
    [router, closeModal],
  );

  useEffect(() => {
    const opener = () => setOpen(true);
    window.addEventListener('open-search', opener);
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inField =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (e.key === '/' && !inField && !open) {
        e.preventDefault();
        setOpen(true);
        return;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('open-search', opener);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, Math.max(0, results.length - 1)));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const r = results[selected];
        if (r) goToResult(r);
        return;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, selected, closeModal, goToResult]);

  // Group results by page for display.
  const grouped = useMemo(() => {
    const groups: { slug: string; title: string; hits: Result[] }[] = [];
    for (const r of results) {
      let g = groups.find((gr) => gr.slug === r.slug);
      if (!g) {
        g = { slug: r.slug, title: r.title, hits: [] };
        groups.push(g);
      }
      g.hits.push(r);
    }
    return groups;
  }, [results]);

  // Scroll the selected result into view.
  useEffect(() => {
    if (!listRef.current) return;
    const active = listRef.current.querySelector('.dg-search-result--active');
    if (active) {
      (active as HTMLElement).scrollIntoView({ block: 'nearest' });
    }
  }, [selected, results]);

  if (!open) return null;

  return (
    <div className="dg-search-modal" role="dialog" aria-modal="true" onClick={closeModal}>
      <div className="dg-search-card" onClick={(e) => e.stopPropagation()}>
        <div className="dg-search-input-row">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the framework..."
            className="dg-search-input"
            type="text"
            spellCheck={false}
            autoComplete="off"
          />
          <button className="dg-search-esc" onClick={closeModal} aria-label="Close">
            ESC
          </button>
        </div>
        <div className="dg-search-results" ref={listRef}>
          {!query && (
            <div className="dg-search-empty">
              <p>Type to search across the framework.</p>
              <p className="dg-search-hints">
                <span className="kbd">↑</span> <span className="kbd">↓</span> navigate ·{' '}
                <span className="kbd">↵</span> open · <span className="kbd">esc</span> close
              </p>
            </div>
          )}
          {query && results.length === 0 && loaded && (
            <div className="dg-search-empty">
              <p>No results for &ldquo;{query}&rdquo;.</p>
            </div>
          )}
          {query && !loaded && <div className="dg-search-empty">Loading index...</div>}
          {grouped.map((group) => (
            <div key={group.slug} className="dg-search-group">
              <div className="dg-search-group-title">{group.title}</div>
              {group.hits.map((hit) => {
                const flatIdx = results.indexOf(hit);
                const isActive = flatIdx === selected;
                return (
                  <a
                    key={`${hit.slug}#${hit.sectionId}`}
                    href={`/${hit.slug}/${hit.sectionId ? `#${hit.sectionId}` : ''}`}
                    className={`dg-search-result ${isActive ? 'dg-search-result--active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      goToResult(hit);
                    }}
                    onMouseEnter={() => setSelected(flatIdx)}
                  >
                    {hit.heading ? (
                      <div className="dg-search-result-heading">{hit.heading}</div>
                    ) : (
                      <div className="dg-search-result-heading">Page overview</div>
                    )}
                    {hit.snippet && (
                      <div className="dg-search-result-snippet">{hit.snippet}</div>
                    )}
                  </a>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
