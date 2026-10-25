'use client';

import { Search, X } from 'lucide-react';
import { useLang } from '@/lib/i18n/LanguageProvider';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label: string;
  id: string;
}

export default function SearchInput({ value, onChange, placeholder, label, id }: SearchInputProps) {
  const { t } = useLang();
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input pl-10 pr-11"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center text-muted hover:text-ink"
          aria-label={t('common.clearSearch')}
        >
          <X size={18} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
