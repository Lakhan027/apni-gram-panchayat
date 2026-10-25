import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import IconTile from '@/components/ui/IconTile';

interface ServiceCardProps {
  href: string;
  title: ReactNode;
  description: ReactNode;
  icon: LucideIcon;
  tone?: 'green' | 'saffron';
}

export default function ServiceCard({ href, title, description, icon, tone = 'green' }: ServiceCardProps) {
  return (
    <Link
      href={href}
      className="card group flex h-full flex-col gap-3 p-4 transition-colors hover:border-green-700 sm:p-5"
    >
      <IconTile icon={icon} tone={tone} size="lg" />
      <span className="text-[16px] font-bold leading-snug text-green-900 group-hover:underline sm:text-[18px]">{title}</span>
      <span className="text-[14px] leading-relaxed text-muted sm:text-[15px]">{description}</span>
    </Link>
  );
}
