import { MapPinOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import { T } from '@/lib/i18n/T';

export default function NotFound() {
  return (
    <div className="container-page flex justify-center py-16">
      <div className="card w-full max-w-lg p-8 text-center">
        <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-saffron-50 text-saffron-text">
          <MapPinOff size={32} aria-hidden="true" />
        </span>
        <p className="text-[15px] font-bold text-saffron-text">
          <T k="nf.code" />
        </p>
        <h1 className="mt-1 text-[26px] font-extrabold text-green-900 md:text-[32px]">
          <T k="nf.title" />
        </h1>
        <p className="mt-2 text-muted">
          <T k="nf.text" />
        </p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Button href="/">
            <T k="common.goHome" />
          </Button>
          <Button href="/works" variant="outline">
            <T k="nf.works" />
          </Button>
        </div>
      </div>
    </div>
  );
}
