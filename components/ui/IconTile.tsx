import type { LucideIcon } from 'lucide-react';

interface IconTileProps {
  icon: LucideIcon;
  tone?: 'green' | 'saffron';
  size?: 'md' | 'lg';
}

export default function IconTile({ icon: Icon, tone = 'green', size = 'md' }: IconTileProps) {
  const toneCls = tone === 'green' ? 'bg-green-50 text-green-700' : 'bg-saffron-50 text-saffron-text';
  const sizeCls = size === 'lg' ? 'h-14 w-14' : 'h-11 w-11';
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-xl ${toneCls} ${sizeCls}`} aria-hidden="true">
      <Icon size={size === 'lg' ? 28 : 22} />
    </span>
  );
}
