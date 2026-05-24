import type { ReactNode } from 'react';
import { IconCheck } from '@/components/icons';

export function Tip({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="dg-callout dg-callout--tip" role="note">
      <IconCheck className="dg-callout-icon" size={20} />
      <div style={{ minWidth: 0, flex: 1 }}>
        {title ? <p className="dg-callout-label">{title}</p> : null}
        <div className="dg-callout-body">{children}</div>
      </div>
    </div>
  );
}
