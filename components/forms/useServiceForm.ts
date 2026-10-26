'use client';

import { useCallback, useRef, useState, type FormEvent } from 'react';
import { useLang } from '@/lib/i18n/LanguageProvider';
import type { Lang } from '@/lib/i18n/translate';
import type { Errors } from '@/lib/nrega';
import { describedBy } from '@/components/forms/FormField';

/** Props every form control gets from `field()`. */
export interface FieldProps {
  id: string;
  'aria-required': true;
  'aria-invalid': true | undefined;
  'aria-describedby': string | undefined;
}

/**
 * Shared state for the service forms (NREGA, digital signature, patta): values, inline errors, focus on the first error,
 * a short "submitting" state and the success popup. Frontend only — nothing is sent anywhere.
 */
export function useServiceForm<T extends object>(empty: T, validate: (v: T, lang: Lang) => Errors<T>, idPrefix: string) {
  const { lang } = useLang();
  const [values, setValues] = useState<T>(empty);
  const [errors, setErrors] = useState<Errors<T>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedName, setSubmittedName] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const set = <K extends keyof T>(k: K, v: T[K]) => {
    setValues((prev) => ({ ...prev, [k]: v }));
    setErrors((prev) => (prev[k] ? { ...prev, [k]: undefined } : prev));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(values, lang);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`#${idPrefix}-${first}`)?.focus();
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setSubmittedName(String((values as Record<string, unknown>).name ?? '').trim());
    }, 500);
  };

  const closeSuccess = useCallback(() => {
    setSubmittedName(null);
    setValues(empty);
    setErrors({});
  }, [empty]);

  /** Props shared by every input: id, required flags and error description. */
  const field = (k: keyof T, hint = false): FieldProps => {
    const id = `${idPrefix}-${String(k)}`;
    return {
      id,
      'aria-required': true as const,
      'aria-invalid': errors[k] ? (true as const) : undefined,
      'aria-describedby': describedBy(id, errors[k], hint),
    };
  };

  return { values, errors, set, onSubmit, submitting, submittedName, closeSuccess, formRef, field };
}
