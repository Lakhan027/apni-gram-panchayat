import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MapPin, Tag } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import WorkDetail from '@/components/works/WorkDetail';
import { getWorkById, getWorks } from '@/lib/data';
import { L, T } from '@/lib/i18n/T';
import { todayISO } from '@/lib/schedule';

// Only IDs from generateStaticParams are exported; unknown IDs call notFound().
// Don't set dynamicParams = false: with output: 'export' it breaks `next dev` in Next 14.2.

export async function generateStaticParams() {
  const works = await getWorks();
  return works.map((w) => ({ id: w.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const work = await getWorkById(params.id);
  return { title: work ? work.name : 'कार्य नहीं मिला' };
}

export default async function WorkDetailPage({ params }: { params: { id: string } }) {
  const work = await getWorkById(params.id);
  if (!work) notFound();

  return (
    <>
      <PageHeader
        title={<L hi={work.name} en={work.en?.name} />}
        crumbs={[{ label: <T k="nav.works" />, href: '/works' }, { label: work.id }]}
        badge={<StatusBadge status={work.status} />}
      />
      <div className="container-page py-8">
        <p className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px] text-muted">
          <span className="break-all font-semibold text-ink">{work.id}</span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={16} aria-hidden="true" /> <T k="common.ward" vars={{ n: work.ward }} />
          </span>
          <span className="inline-flex items-center gap-1">
            <Tag size={16} aria-hidden="true" /> <T k={`cat.${work.category}`} />
          </span>
        </p>
        <WorkDetail work={work} today={todayISO()} />
        <Link href="/works" className="mt-8 inline-flex min-h-[44px] items-center gap-2 font-semibold text-green-700 hover:underline">
          <ArrowLeft size={18} aria-hidden="true" /> <T k="work.back" />
        </Link>
      </div>
    </>
  );
}
