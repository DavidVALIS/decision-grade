import type { ReactNode } from 'react';
import { getIcon } from '@/components/icons';

export type CardProps = {
  title?: string;
  icon?: string;
  href?: string;
  children?: ReactNode;
};

export function Card({ title, icon, href, children }: CardProps) {
  const Icon = getIcon(icon);
  const content = (
    <>
      {Icon ? <Icon className="dg-card-icon" size={24} /> : null}
      {title ? <h3 className="dg-card-title">{title}</h3> : null}
      <div className="dg-card-body">{children}</div>
    </>
  );

  if (href) {
    const external = /^https?:\/\//.test(href);
    return (
      <a
        className="dg-card"
        href={href}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {content}
      </a>
    );
  }
  return <div className="dg-card">{content}</div>;
}
