'use client';

import { useEffect, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useLang } from '@/lib/i18n/LanguageProvider';

interface SuccessDialogProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

/** Success popup after a form is submitted. Closes with OK, Escape or a tap outside. */
export default function SuccessDialog({ open, message, onClose }: SuccessDialogProps) {
  const { t } = useLang();
  const okRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    okRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-green-900/50 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-title"
        aria-describedby="success-text"
        className="card w-full max-w-md p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-status-doneBg text-status-doneText">
          <CheckCircle2 size={30} aria-hidden="true" />
        </span>
        <h2 id="success-title" className="text-[20px] font-bold text-green-900">
          {t('ns.title')}
        </h2>
        <div id="success-text">
          <p className="mt-2 text-ink">{message}</p>
          <p className="mt-2 text-[14px] text-muted">{t('ns.officeNote')}</p>
        </div>
        <button
          ref={okRef}
          type="button"
          onClick={onClose}
          className="mt-5 min-h-[48px] w-full rounded-[10px] bg-green-700 text-[17px] font-semibold text-white hover:bg-green-900"
        >
          {t('ns.ok')}
        </button>
      </div>
    </div>
  );
}
