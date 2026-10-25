'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Info, Loader2, Send } from 'lucide-react';
import Button from '@/components/ui/Button';
import { COMPLAINT_CATEGORIES, WARD_COUNT } from '@/lib/constants';
import { useLang } from '@/lib/i18n/LanguageProvider';
import {
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  validateComplaint,
  type ComplaintErrors,
  type ComplaintInput,
} from '@/lib/validation';
import FormField, { describedBy } from './FormField';
import PhotoInput from './PhotoInput';

const EMPTY: ComplaintInput = { name: '', ward: '', category: '', description: '', mobile: '', photo: null };

export default function ComplaintForm() {
  const { t, lang } = useLang();
  const [values, setValues] = useState<ComplaintInput>(EMPTY);
  const [errors, setErrors] = useState<ComplaintErrors>({});
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const set = <K extends keyof ComplaintInput>(k: K, v: ComplaintInput[K]) => {
    setValues((prev) => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validateComplaint(values, lang);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`#c-${first}`)?.focus();
      return;
    }
    // Online filing is not live yet: nothing is stored or sent anywhere.
    setState('loading');
    window.setTimeout(() => setState('done'), 900);
  };

  if (state === 'done') {
    return (
      <div role="status" className="card border-saffron/60 p-6 text-center sm:p-8">
        <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-saffron-50 text-saffron-text">
          <Info size={28} aria-hidden="true" />
        </span>
        <p className="text-[20px] font-bold text-green-900">{t('form.doneTitle')}</p>
        <p className="mt-2 text-muted">{t('form.doneText')}</p>
        <Button className="mt-5" variant="outline" onClick={() => { setValues(EMPTY); setState('idle'); }}>
          {t('form.again')}
        </Button>
      </div>
    );
  }

  const len = values.description.trim().length;
  const aria = (k: keyof ComplaintInput, hint = false) => ({
    'aria-invalid': !!errors[k] || undefined,
    'aria-describedby': describedBy(`c-${k}`, errors[k], hint),
  });

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="card space-y-5 p-5 sm:p-6" aria-label={t('form.label')}>
      <FormField id="c-name" label={t('form.name')}>
        <input id="c-name" className="input" value={values.name} onChange={(e) => set('name', e.target.value)} autoComplete="off" />
      </FormField>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField id="c-ward" label={t('form.ward')} required error={errors.ward}>
          <select id="c-ward" className="input" value={values.ward} onChange={(e) => set('ward', e.target.value)} aria-required="true" {...aria('ward')}>
            <option value="">{t('form.chooseWard')}</option>
            {Array.from({ length: WARD_COUNT }, (_, i) => (
              <option key={i + 1} value={String(i + 1)}>{t('common.ward', { n: i + 1 })}</option>
            ))}
          </select>
        </FormField>
        <FormField id="c-category" label={t('form.category')} required error={errors.category}>
          <select id="c-category" className="input" value={values.category} onChange={(e) => set('category', e.target.value)} aria-required="true" {...aria('category')}>
            <option value="">{t('form.chooseCategory')}</option>
            {COMPLAINT_CATEGORIES.map((c) => (
              <option key={c} value={c}>{t(`complaintCat.${c}`)}</option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField
        id="c-description"
        label={t('form.description')}
        required
        error={errors.description}
        hint={
          <span className="flex flex-wrap justify-between gap-2">
            <span>{t('form.descRange', { min: DESCRIPTION_MIN, max: DESCRIPTION_MAX })}</span>
            <span aria-live="polite" className={len > DESCRIPTION_MAX ? 'font-semibold text-status-holdText' : ''}>
              {len} / {DESCRIPTION_MAX}
            </span>
          </span>
        }
      >
        <textarea id="c-description" rows={5} className="input py-2.5" value={values.description} onChange={(e) => set('description', e.target.value)} aria-required="true" {...aria('description', true)} />
      </FormField>

      <FormField id="c-mobile" label={t('form.mobile')} error={errors.mobile} hint={t('form.mobileHint')}>
        <input id="c-mobile" type="tel" inputMode="numeric" maxLength={10} className="input" value={values.mobile} onChange={(e) => set('mobile', e.target.value.replace(/\D/g, ''))} autoComplete="off" {...aria('mobile', true)} />
      </FormField>

      <FormField id="c-photo" label={t('form.photo')} error={errors.photo}>
        <PhotoInput id="c-photo" file={values.photo} onChange={(f) => set('photo', f)} invalid={!!errors.photo} describedBy={describedBy('c-photo', errors.photo)} />
      </FormField>

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={state === 'loading'}>
        {state === 'loading' ? (
          <><Loader2 size={20} className="animate-spin" aria-hidden="true" /> {t('form.submitting')}</>
        ) : (
          <><Send size={20} aria-hidden="true" /> {t('form.submit')}</>
        )}
      </Button>
    </form>
  );
}
