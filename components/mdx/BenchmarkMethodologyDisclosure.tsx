import type { ReactNode } from 'react';

export type BenchmarkMethodologyDisclosureProps = {
  children: ReactNode;
};

/**
 * LBCI methodology disclosure callout.
 * Renders only the load_bearing_claim_identification page uses this --
 * a 2px salmon-top-border block that "leads" the wedge results because
 * the manifest's publication_template_commitment requires it.
 */
export function BenchmarkMethodologyDisclosure({ children }: BenchmarkMethodologyDisclosureProps) {
  return (
    <aside className="dg-bench-disclosure" aria-label="Methodology disclosure">
      <p className="dg-bench-disclosure__eyebrow">Methodology disclosure</p>
      <div className="dg-bench-disclosure__body">{children}</div>
    </aside>
  );
}
