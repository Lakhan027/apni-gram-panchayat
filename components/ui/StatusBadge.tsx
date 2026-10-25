'use client';

import { CheckCircle2, Circle, Clock, FileCheck2, PauseCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { WORK_STATUS } from '@/lib/constants';
import { useLang } from '@/lib/i18n/LanguageProvider';
import type { WorkStatus } from '@/lib/types';

const icons = {
  proposed: Circle,
  approved: FileCheck2,
  'in-progress': Clock,
  completed: CheckCircle2,
  'on-hold': PauseCircle,
};

/** Generic pill: always icon/text + color, never color alone. */
export function Pill({ label, className, icon: Icon }: { label: ReactNode; className: string; icon?: typeof Circle }) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[13px] font-semibold ${className}`}
    >
      {Icon && <Icon size={14} aria-hidden="true" />}
      {label}
    </span>
  );
}

export default function StatusBadge({ status }: { status: WorkStatus }) {
  const { t } = useLang();
  return <Pill label={t(`status.${status}`)} className={WORK_STATUS[status].className} icon={icons[status]} />;
}
