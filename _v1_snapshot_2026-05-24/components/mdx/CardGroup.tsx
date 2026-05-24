import type { ReactNode } from 'react';

export type CardGroupProps = {
  cols?: 1 | 2 | 3;
  children: ReactNode;
};

export function CardGroup({ cols = 2, children }: CardGroupProps) {
  const safeCols = cols === 1 || cols === 2 || cols === 3 ? cols : 2;
  return <div className={`dg-card-grid dg-card-grid--${safeCols}`}>{children}</div>;
}
