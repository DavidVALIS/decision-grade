import type { ReactNode } from 'react';

export type QuoteProps = {
  source?: string;
  cite?: string;
  children: ReactNode;
};

export function Quote({ source, cite, children }: QuoteProps) {
  return (
    <blockquote className="dg-quote" cite={cite}>
      <div className="dg-quote-text">{children}</div>
      {source ? <footer className="dg-quote-source">{source}</footer> : null}
    </blockquote>
  );
}
