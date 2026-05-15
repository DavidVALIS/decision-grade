import type { ReactNode } from 'react';

export function Accordion({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="dg-accordion">
      <summary>{title}</summary>
      <div className="dg-accordion-body">{children}</div>
    </details>
  );
}
