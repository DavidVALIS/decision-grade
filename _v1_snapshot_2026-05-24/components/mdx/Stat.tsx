import type { ReactNode } from 'react';

export type StatProps = {
  value: string;
  label?: ReactNode;
  source?: string;
  href?: string;
  size?: 'sm' | 'md' | 'lg';
  align?: 'left' | 'center';
  children?: ReactNode;
};

export function Stat({
  value,
  label,
  source,
  href,
  size = 'lg',
  align = 'left',
  children,
}: StatProps) {
  const captionContent: ReactNode = children ?? label;
  const content = (
    <>
      <div className={`dg-stat-value dg-stat-value--${size}`}>{value}</div>
      {captionContent ? <div className="dg-stat-label">{captionContent}</div> : null}
      {source ? <div className="dg-stat-source">{source}</div> : null}
    </>
  );

  const className = `dg-stat dg-stat--${align}${href ? ' dg-stat--link' : ''}`;

  if (href) {
    const external = /^https?:\/\//.test(href);
    return (
      <a
        className={className}
        href={href}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {content}
      </a>
    );
  }
  return <div className={className}>{content}</div>;
}

export type StatRowProps = {
  cols?: 2 | 3 | 4;
  children: ReactNode;
};

export function StatRow({ cols = 4, children }: StatRowProps) {
  const safeCols = cols === 2 || cols === 3 || cols === 4 ? cols : 4;
  return <div className={`dg-stat-row dg-stat-row--${safeCols}`}>{children}</div>;
}
