import { Children, isValidElement, cloneElement, type ReactNode } from 'react';

export function Steps({ children }: { children: ReactNode }) {
  let index = 0;
  const numbered = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    index += 1;
    return cloneElement(child as React.ReactElement<{ _index?: number }>, { _index: index });
  });
  return <div className="dg-steps">{numbered}</div>;
}
