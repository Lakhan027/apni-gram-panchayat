'use client';

import { Loader2, Send } from 'lucide-react';
import FormField from '@/components/forms/FormField';
import Button from '@/components/ui/Button';
import { WARD_COUNT } from '@/lib/constants';
import { useLang } from '@/lib/i18n/LanguageProvider';
import { validateJobCardApplication, type JobCardApplication } from '@/lib/nrega';
import SuccessDialog from '@/components/forms/SuccessDialog';
import { useServiceForm } from '@/components/forms/useServiceForm';

const EMPTY: JobCardApplication = { name: '', fatherName: '', age: '', gender: '', village: '', ward: '', adults: '', mobile: '' };

/** नया जॉब कार्ड बनाने हेतु — household details. Deliberately does not ask for Aadhaar or bank details. */
export default function JobCardForm() {
  const { t } = useLang();
  const f = useServiceForm(EMPTY, validateJobCardApplication, 'jc');
  const { values, errors, set, field } = f;
  const digits = (v: string) => v.replace(/\D/g, '');

  return (
    <>
      <form ref={f.formRef} onSubmit={f.onSubmit} noValidate className="card space-y-5 p-5 sm:p-6" aria-label={t('nrega.newCard')}>
        <p className="text-[15px] text-muted">{t('nrega.newCardIntro')}</p>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField id="jc-name" label={t('nf.name')} required error={errors.name}>
            <input className="input" autoComplete="name" value={values.name} onChange={(e) => set('name', e.target.value)} {...field('name')} />
          </FormField>
          <FormField id="jc-fatherName" label={t('nf.fatherOrHusband')} required error={errors.fatherName}>
            <input className="input" value={values.fatherName} onChange={(e) => set('fatherName', e.target.value)} {...field('fatherName')} />
          </FormField>
          <FormField id="jc-age" label={t('nf.age')} required error={errors.age}>
            <input className="input" inputMode="numeric" maxLength={3} value={values.age} onChange={(e) => set('age', digits(e.target.value))} {...field('age')} />
          </FormField>
          <FormField id="jc-gender" label={t('nf.gender')} required error={errors.gender}>
            <select className="input" value={values.gender} onChange={(e) => set('gender', e.target.value)} {...field('gender')}>
              <option value="">{t('nf.chooseGender')}</option>
              <option value="female">{t('nf.female')}</option>
              <option value="male">{t('nf.male')}</option>
              <option value="other">{t('nf.other')}</option>
            </select>
          </FormField>
          <FormField id="jc-village" label={t('nf.village')} required error={errors.village}>
            <input className="input" value={values.village} onChange={(e) => set('village', e.target.value)} {...field('village')} />
          </FormField>
          <FormField id="jc-ward" label={t('form.ward')} required error={errors.ward}>
            <select className="input" value={values.ward} onChange={(e) => set('ward', e.target.value)} {...field('ward')}>
              <option value="">{t('form.chooseWard')}</option>
              {Array.from({ length: WARD_COUNT }, (_, i) => (
                <option key={i + 1} value={String(i + 1)}>
                  {t('common.ward', { n: i + 1 })}
                </option>
              ))}
            </select>
          </FormField>
          <FormField id="jc-adults" label={t('nf.adults')} required error={errors.adults}>
            <input className="input" inputMode="numeric" maxLength={2} value={values.adults} onChange={(e) => set('adults', digits(e.target.value))} {...field('adults')} />
          </FormField>
          <FormField id="jc-mobile" label={t('nf.mobile')} required error={errors.mobile} hint={t('form.mobileHint')}>
            <input
              className="input"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              autoComplete="tel-national"
              value={values.mobile}
              onChange={(e) => set('mobile', digits(e.target.value))}
              {...field('mobile', true)}
            />
          </FormField>
        </div>
        <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={f.submitting}>
          {f.submitting ? <Loader2 size={20} className="animate-spin" aria-hidden="true" /> : <Send size={20} aria-hidden="true" />}
          {f.submitting ? t('form.submitting') : t('nf.submit')}
        </Button>
      </form>
      <SuccessDialog open={f.submittedName !== null} message={t('ns.card', { name: f.submittedName ?? '' })} onClose={f.closeSuccess} />
    </>
  );
}
