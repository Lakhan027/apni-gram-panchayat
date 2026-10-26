'use client';

import { Loader2, Send } from 'lucide-react';
import FormField from '@/components/forms/FormField';
import Button from '@/components/ui/Button';
import { useLang } from '@/lib/i18n/LanguageProvider';
import { validateWorkApplication, type WorkApplication } from '@/lib/nrega';
import SuccessDialog from '@/components/forms/SuccessDialog';
import { useServiceForm } from '@/components/forms/useServiceForm';

const EMPTY: WorkApplication = { name: '', fatherName: '', jobCard: '', village: '', mobile: '' };

/** कार्य के लिए आवेदन — five required fields. */
export default function WorkApplicationForm() {
  const { t } = useLang();
  const f = useServiceForm(EMPTY, validateWorkApplication, 'aw');
  const { values, errors, set, field } = f;

  return (
    <>
      <form ref={f.formRef} onSubmit={f.onSubmit} noValidate className="card space-y-5 p-5 sm:p-6" aria-label={t('nrega.applyWork')}>
        <p className="text-[15px] text-muted">{t('nrega.applyWorkIntro')}</p>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField id="aw-name" label={t('nf.name')} required error={errors.name}>
            <input className="input" autoComplete="name" value={values.name} onChange={(e) => set('name', e.target.value)} {...field('name')} />
          </FormField>
          <FormField id="aw-fatherName" label={t('nf.fatherName')} required error={errors.fatherName}>
            <input className="input" value={values.fatherName} onChange={(e) => set('fatherName', e.target.value)} {...field('fatherName')} />
          </FormField>
          <FormField id="aw-jobCard" label={t('nf.jobCard')} required error={errors.jobCard} hint={t('nf.jobCardHint')}>
            <input
              className="input"
              autoCapitalize="characters"
              spellCheck={false}
              value={values.jobCard}
              onChange={(e) => set('jobCard', e.target.value.toUpperCase())}
              {...field('jobCard', true)}
            />
          </FormField>
          <FormField id="aw-village" label={t('nf.village')} required error={errors.village}>
            <input className="input" value={values.village} onChange={(e) => set('village', e.target.value)} {...field('village')} />
          </FormField>
          <FormField id="aw-mobile" label={t('nf.mobile')} required error={errors.mobile} hint={t('form.mobileHint')}>
            <input
              className="input"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              autoComplete="tel-national"
              value={values.mobile}
              onChange={(e) => set('mobile', e.target.value.replace(/\D/g, ''))}
              {...field('mobile', true)}
            />
          </FormField>
        </div>
        <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={f.submitting}>
          {f.submitting ? <Loader2 size={20} className="animate-spin" aria-hidden="true" /> : <Send size={20} aria-hidden="true" />}
          {f.submitting ? t('form.submitting') : t('nf.submit')}
        </Button>
      </form>
      <SuccessDialog open={f.submittedName !== null} message={t('ns.work', { name: f.submittedName ?? '' })} onClose={f.closeSuccess} />
    </>
  );
}
