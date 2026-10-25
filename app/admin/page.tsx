import type { Metadata } from 'next';
import { Lock } from 'lucide-react';
import Button from '@/components/ui/Button';
import AdminUpcomingList from '@/components/layout/AdminUpcomingList';
import { T } from '@/lib/i18n/T';

export const metadata: Metadata = { title: 'जल्द आ रहा है', robots: { index: false } };

export default function AdminPage() {
  return (
    <div className="container-page flex justify-center py-12 md:py-20">
      <div className="card w-full max-w-xl p-6 text-center sm:p-10">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-700 text-white ring-4 ring-saffron ring-offset-2">
          <Lock size={30} aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-[28px] font-extrabold text-green-900 md:text-[34px]">
          <T k="admin.title" />
        </h1>
        <p className="text-[17px] font-semibold text-saffron-text">Coming Soon</p>
        <p className="mt-3 text-ink">
          <T k="admin.text" />
        </p>
        <AdminUpcomingList />
        <Button href="/" size="lg" className="mt-7 w-full sm:w-auto">
          <T k="common.goHome" />
        </Button>
      </div>
    </div>
  );
}
