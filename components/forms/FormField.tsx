'use client';

import type { ReactNode } from 'react';
import { useLang } from '@/lib/i18n/LanguageProvider';

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
}

/** Label + control + hint + inline error (announced via role="alert"). */
export default function FormField({ id, label, required, error, hint, children }: FormFieldProps) {
  const { t } = useLang();
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
        {required ? (
          <span className="ml-1 text-status-holdText" aria-hidden="true">*</span>
        ) : (
          <span className="ml-1 text-[14px] font-normal text-muted">{t('form.optional')}</span>
        )}
      </label>
      {children}
      {hint && <div id={`${id}-hint`} className="mt-1 text-[14px] text-muted">{hint}</div>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-[14px] font-semibold text-status-holdText">
          {error}
        </p>
      )}
    </div>
  );
}

export function describedBy(id: string, error?: string, hasHint = false) {
  return [hasHint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined;
}
