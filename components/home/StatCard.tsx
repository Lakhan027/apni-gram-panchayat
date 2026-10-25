import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import IconTile from '@/components/ui/IconTile';

interface StatCardProps {
  label: ReactNode;
  value: ReactNode;
  icon: LucideIcon;
  tone?: 'green' | 'saffron';
  note?: string;
}

export default function StatCard({ label, value, icon, tone = 'green', note }: StatCardProps) {
  return (
    <div className="card flex h-full flex-col gap-2 p-4 sm:p-5">
      <IconTile icon={icon} tone={tone} />
      <p className="break-words text-[22px] font-extrabold leading-tight text-green-900 sm:text-[26px]">{value}</p>
      <p className="text-[14px] font-medium text-muted sm:text-[15px]">{label}</p>
      {note && <p className="text-[13px] text-muted">{note}</p>}
    </div>
  );
}
