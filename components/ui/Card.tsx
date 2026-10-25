import type { ElementType, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  id?: string;
}

export default function Card({ children, className = '', as: Tag = 'div', id }: CardProps) {
  return (
    <Tag id={id} className={`card ${className}`}>
      {children}
    </Tag>
  );
}
