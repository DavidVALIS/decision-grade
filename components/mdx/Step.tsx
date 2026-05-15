import type { ReactNode } from 'react';

export function Step({
  title,
  children,
  _index,
}: {
  title?: string;
  children: ReactNode;
  _index?: number;
}) {
  const num = typeof _index === 'number' ? String(_index).padStart(2, '0') : '01';
  return (
    <div className="dg-step">
      <div className="dg-step-num">{num}</div>
      <div>
        {title ? <h3 className="dg-step-title">{title}</h3> : null}
        <div className="dg-step-body">{children}</div>
      </div>
    </div>
  );
}
