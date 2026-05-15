import type { ReactNode } from 'react';
import { IconInfo } from '@/components/icons';

export function Note({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="dg-callout" role="note">
      <IconInfo className="dg-callout-icon" size={20} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <p className="dg-callout-label">{title ?? 'Note'}</p>
        <div className="dg-callout-body">{children}</div>
      </div>
    </div>
  );
}
