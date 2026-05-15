import type { ReactNode } from 'react';

export function AccordionGroup({ children }: { children: ReactNode }) {
  return <div className="dg-accordion-group">{children}</div>;
}
