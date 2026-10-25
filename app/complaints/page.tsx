import type { Metadata } from 'next';
import { ClipboardCheck, Eye, MessageSquareReply, UserCheck } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import ComplaintForm from '@/components/forms/ComplaintForm';
import Card from '@/components/ui/Card';
import IconTile from '@/components/ui/IconTile';
import { T } from '@/lib/i18n/T';

export const metadata: Metadata = { title: 'शिकायत / सुझाव' };

const STEPS = [
  { icon: ClipboardCheck, title: 'complaints.step1', text: 'complaints.step1Text' },
  { icon: UserCheck, title: 'complaints.step2', text: 'complaints.step2Text' },
  { icon: Eye, title: 'complaints.step3', text: 'complaints.step3Text' },
  { icon: MessageSquareReply, title: 'complaints.step4', text: 'complaints.step4Text' },
] as const;

export default function ComplaintsPage() {
  return (
    <>
      <PageHeader title={<T k="complaints.title" />} description={<T k="complaints.desc" />} crumbs={[{ label: <T k="nav.complaints" /> }]} />
      <div className="container-page grid grid-cols-1 gap-6 py-8 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <p role="note" className="mb-4 rounded-[14px] border border-saffron/50 bg-saffron-50 p-4 font-medium text-saffron-text">
            <T k="complaints.note" />
          </p>
          <ComplaintForm />
        </div>
        <aside className="min-w-0">
          <Card className="p-5 sm:p-6">
            <h2 className="text-[20px] font-bold text-green-900">
              <T k="complaints.howTitle" />
            </h2>
            <ol className="mt-4 space-y-4">
              {STEPS.map((s) => (
                <li key={s.title} className="flex gap-3">
                  <IconTile icon={s.icon} />
                  <span>
                    <span className="block font-bold text-ink">
                      <T k={s.title} />
                    </span>
                    <span className="block text-[15px] text-muted">
                      <T k={s.text} />
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </Card>
        </aside>
      </div>
    </>
  );
}
