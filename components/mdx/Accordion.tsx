import type { ReactNode } from 'react';

export function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details className="dg-accordion" open={defaultOpen || undefined}>
      <summary>{title}</summary>
      <div className="dg-accordion-body">{children}</div>
    </details>
  );
}
