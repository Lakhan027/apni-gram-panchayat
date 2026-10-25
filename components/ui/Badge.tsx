import type { ReactNode } from 'react';

interface BadgeProps {
  label: ReactNode;
  tone?: 'saffron' | 'soft' | 'dark';
}

export default function Badge({ label, tone = 'soft' }: BadgeProps) {
  const tones = {
    saffron: 'bg-saffron text-green-900',
    soft: 'bg-saffron-50 text-saffron-text border border-saffron/40',
    dark: 'bg-white/15 text-white border border-white/30',
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[13px] font-bold leading-6 tracking-wide ${tones[tone]}`}
    >
      {label}
    </span>
  );
}
