'use client';

import ErrorState from '@/components/ui/ErrorState';
import Button from '@/components/ui/Button';
import { useLang } from '@/lib/i18n/LanguageProvider';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  const { t } = useLang();
  return (
    <div className="container-page py-12">
      <ErrorState
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={reset}>{t('common.retry')}</Button>
            <Button href="/" variant="outline">
              {t('common.goHome')}
            </Button>
          </div>
        }
      />
    </div>
  );
}
