import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'outline' | 'ghost' | 'light' | 'onDark';
type Size = 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 text-center';

const variants: Record<Variant, string> = {
  primary: 'bg-green-700 text-white hover:bg-green-900',
  outline: 'border-2 border-green-700 bg-white text-green-700 hover:bg-green-50',
  ghost: 'text-green-700 hover:bg-green-50',
  light: 'bg-white text-green-900 hover:bg-green-50',
  onDark: 'border-2 border-white/60 text-white hover:bg-white/10',
};

const sizes: Record<Size, string> = {
  md: 'min-h-[44px] px-4 text-[15px]',
  lg: 'min-h-[52px] px-6 text-[17px] rounded-[12px]',
};

export function buttonClass(variant: Variant = 'primary', size: Size = 'md', extra = '') {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type LinkProps = CommonProps & { href: string; 'aria-label'?: string };

export default function Button(props: ButtonProps | LinkProps) {
  const { variant = 'primary', size = 'md', className = '', children } = props;
  const cls = buttonClass(variant, size, className);
  if (props.href !== undefined) {
    return (
      <Link href={props.href} className={cls} aria-label={props['aria-label']}>
        {children}
      </Link>
    );
  }
  const { variant: _v, size: _s, className: _c, children: _ch, type = 'button', ...rest } = props;
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  );
}
