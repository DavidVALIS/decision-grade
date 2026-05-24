import Link from 'next/link';
import type { PageEntry } from '@/lib/pages';

export function Pager({ prev, next }: { prev?: PageEntry; next?: PageEntry }) {
  if (!prev && !next) return null;
  return (
    <nav className="dg-pager" aria-label="Page navigation">
      {prev ? (
        <Link href={`/${prev.id}/`}>
          <span className="dg-pager-dir">← Previous · {prev.num}</span>
          <span className="dg-pager-title">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={`/${next.id}/`} className="dg-pager-next">
          <span className="dg-pager-dir">Next · {next.num} →</span>
          <span className="dg-pager-title">{next.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
