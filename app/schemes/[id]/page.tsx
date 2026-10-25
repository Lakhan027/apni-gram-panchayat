import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, FileCheck2, ListOrdered, Phone, ShieldAlert, Target } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import IconTile from '@/components/ui/IconTile';
import OfficialLink from '@/components/schemes/OfficialLink';
import { getSchemeById, getSchemes } from '@/lib/data';
import { L, T } from '@/lib/i18n/T';

// Only IDs from generateStaticParams are exported; unknown IDs call notFound().
// Don't set dynamicParams = false: with output: 'export' it breaks `next dev` in Next 14.2.

export async function generateStaticParams() {
  const schemes = await getSchemes();
  return schemes.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const s = await getSchemeById(params.id);
  return { title: s ? s.name : 'योजना नहीं मिली' };
}

const heading = 'text-[20px] font-bold text-green-900';

export default async function SchemeDetailPage({ params }: { params: { id: string } }) {
  const scheme = await getSchemeById(params.id);
  if (!scheme) notFound();
  const name = <L hi={scheme.name} en={scheme.en?.name} />;

  return (
    <>
      <PageHeader
        title={name}
        description={<T k={`schemeCat.${scheme.category}`} />}
        crumbs={[{ label: <T k="nav.schemes" />, href: '/schemes' }, { label: name }]}
        badge={!scheme.verified ? <Badge label={<T k="common.verificationNeeded" />} /> : undefined}
      />
      <div className="container-page py-8">
        {!scheme.verified && (
          <div role="note" className="mb-6 flex gap-3 rounded-[14px] border border-saffron/50 bg-saffron-50 p-4 text-saffron-text">
            <ShieldAlert size={22} className="mt-0.5 shrink-0" aria-hidden="true" />
            <p className="font-medium">
              <T k="scheme.unverified" />
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-3">
              <IconTile icon={Target} />
              <h2 className={heading}><T k="scheme.purpose" /></h2>
            </div>
            <p><L hi={scheme.purpose} en={scheme.en?.purpose} /></p>
            {scheme.eligibility && (
              <p className="mt-3 text-[15px]">
                <span className="font-semibold"><T k="scheme.eligibility" /> </span>
                <span className="text-muted">{scheme.eligibility}</span>
              </p>
            )}
          </Card>
          <Card className="p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-3">
              <IconTile icon={Phone} tone="saffron" />
              <h2 className={heading}><T k="scheme.contact" /></h2>
            </div>
            <p><L hi={scheme.contact} en={scheme.en?.contact} /></p>
          </Card>
          <Card className="p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-3">
              <IconTile icon={FileCheck2} />
              <h2 className={heading}><T k="scheme.documents" /></h2>
            </div>
            <ul className="list-disc space-y-1.5 pl-5">
              {scheme.documents.map((d, i) => (
                <li key={d}><L hi={d} en={scheme.en?.documents?.[i]} /></li>
              ))}
            </ul>
          </Card>
          <Card className="p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-3">
              <IconTile icon={ListOrdered} tone="saffron" />
              <h2 className={heading}><T k="scheme.steps" /></h2>
            </div>
            <ol className="space-y-2">
              {scheme.steps.map((s, i) => (
                <li key={s} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-700 text-[14px] font-bold text-white">{i + 1}</span>
                  <span><L hi={s} en={scheme.en?.steps?.[i]} /></span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
        {scheme.officialLink && (
          <Card className="mt-6 flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6">
            <span className="flex items-center gap-2 font-semibold">
              <ExternalLink size={18} className="text-green-700" aria-hidden="true" /> <T k="scheme.link" />
            </span>
            <OfficialLink href={scheme.officialLink} />
          </Card>
        )}
        <Link href="/schemes" className="mt-8 inline-flex min-h-[44px] items-center gap-2 font-semibold text-green-700 hover:underline">
          <ArrowLeft size={18} aria-hidden="true" /> <T k="scheme.back" />
        </Link>
      </div>
    </>
  );
}
