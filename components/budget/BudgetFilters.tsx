'use client';

import SelectFilter from '@/components/ui/SelectFilter';
import { WORK_CATEGORIES } from '@/lib/constants';
import { useLang } from '@/lib/i18n/LanguageProvider';

export interface BudgetFilterState {
  fy: string;
  category: string;
  from: string;
  to: string;
}

interface BudgetFiltersProps {
  years: string[];
  value: BudgetFilterState;
  onChange: (next: BudgetFilterState) => void;
}

const fyLabel = (fy: string) => fy.replace('-', '–');

export default function BudgetFilters({ years, value, onChange }: BudgetFiltersProps) {
  const { t } = useLang();
  const set = (k: keyof BudgetFilterState, v: string) => onChange({ ...value, [k]: v });
  return (
    <div className="card no-print grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
      <SelectFilter
        id="budget-fy"
        label={t('budget.fy')}
        value={value.fy}
        onChange={(v) => set('fy', v)}
        options={years.map((y) => ({ value: y, label: fyLabel(y) }))}
      />
      <SelectFilter
        id="budget-category"
        label={t('common.category')}
        value={value.category}
        onChange={(v) => set('category', v)}
        options={[{ value: 'all', label: t('common.allCategories') }, ...WORK_CATEGORIES.map((k) => ({ value: k, label: t(`cat.${k}`) }))]}
      />
      <div>
        <label htmlFor="budget-from" className="label">
          {t('budget.from')}
        </label>
        <input id="budget-from" type="date" className="input" value={value.from} onChange={(e) => set('from', e.target.value)} />
      </div>
      <div>
        <label htmlFor="budget-to" className="label">
          {t('budget.to')}
        </label>
        <input id="budget-to" type="date" className="input" value={value.to} min={value.from || undefined} onChange={(e) => set('to', e.target.value)} />
      </div>
      <p className="text-[13px] text-muted sm:col-span-2 lg:col-span-4">{t('budget.rangeNote')}</p>
    </div>
  );
}

export { fyLabel };
