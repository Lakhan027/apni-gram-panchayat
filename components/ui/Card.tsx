import type { ElementType, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  id?: string;
  'aria-labelledby'?: string;
}

export default function Card({ children, className = '', as: Tag = 'div', id, 'aria-labelledby': labelledBy }: CardProps) {
  return (
    <Tag id={id} aria-labelledby={labelledBy} className={`card ${className}`}>
      {children}
    </Tag>
  );
}
