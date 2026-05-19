import type { ReactNode } from 'react';
import { IconWarning } from '@/components/icons';

export function Warning({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="dg-callout dg-callout--warn" role="note">
      <IconWarning className="dg-callout-icon" size={20} />
      <div style={{ minWidth: 0, flex: 1 }}>
        {title ? <p className="dg-callout-label">{title}</p> : null}
        <div className="dg-callout-body">{children}</div>
      </div>
    </div>
  );
}
