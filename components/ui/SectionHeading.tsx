import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

interface SectionHeadingProps {
  title: ReactNode;
  id?: string;
  subtitle?: ReactNode;
  badge?: ReactNode;
  link?: { href: string; label: ReactNode };
  level?: 'h2' | 'h3';
}

export default function SectionHeading({ title, id, subtitle, badge, link, level = 'h2' }: SectionHeadingProps) {
  const Tag = level;
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Tag
            id={id}
            className={`font-bold text-green-900 ${level === 'h2' ? 'text-[24px] md:text-[30px]' : 'text-[20px] md:text-[22px]'}`}
          >
            {title}
          </Tag>
          {badge}
        </div>
        {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
      </div>
      {link && (
        <Link
          href={link.href}
          className="inline-flex min-h-[44px] items-center gap-1 font-semibold text-green-700 hover:underline"
        >
          {link.label}
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
