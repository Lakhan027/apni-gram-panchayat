import type { Metadata } from 'next';
import { ArrowRight, Clock, Map as MapIcon, MapPin, MessageSquareWarning, UsersRound } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/ui/Card';
import IconTile from '@/components/ui/IconTile';
import Button from '@/components/ui/Button';
import { getPanchayatInfo } from '@/lib/data';
import { T } from '@/lib/i18n/T';

export const metadata: Metadata = { title: 'संपर्क' };

export default async function ContactPage() {
  const info = await getPanchayatInfo();
  // Office details come from the dictionary so they follow the language. Phone and email are added once confirmed.
  const rows = [
    { icon: MapPin, label: 'contact.address', value: 'office.address' },
    { icon: Clock, label: 'common.officeHours', value: 'office.hours' },
  ] as const;

  return (
    <>
      <PageHeader title={<T k="nav.contact" />} description={<T k="contact.desc" />} crumbs={[{ label: <T k="nav.contact" /> }]} />
      <div className="container-page grid grid-cols-1 gap-6 py-8 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <h2 className="text-[20px] font-bold text-green-900">
            <T k="contact.office" />
          </h2>
          <p className="text-[14px] text-muted">
            <T k="contact.place" vars={{ tehsil: info.tehsil, district: info.district }} />, <T k="site.state" />
          </p>
          <ul className="mt-5 space-y-4">
            {rows.map((r) => (
              <li key={r.label} className="flex items-center gap-3">
                <IconTile icon={r.icon} />
                <span>
                  <span className="block text-[14px] text-muted">
                    <T k={r.label} />
                  </span>
                  <span className="block font-semibold text-ink">
                    <T k={r.value} />
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[14px] text-muted">
            <T k="contact.verifyNote" />
          </p>
        </Card>

        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[14px] border-2 border-dashed border-line bg-green-50 p-6 text-center sm:rounded-card">
          <MapIcon size={40} className="text-green-700" aria-hidden="true" />
          <p className="mt-3 font-semibold text-green-900">
            <T k="contact.map" />
          </p>
          <p className="text-[14px] text-muted">
            <T k="contact.mapSoon" />
          </p>
        </div>

        <Card className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <IconTile icon={MessageSquareWarning} tone="saffron" />
            <p className="font-semibold">
              <T k="contact.cta" />
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button href="/complaints">
              <T k="contact.complain" /> <ArrowRight size={18} aria-hidden="true" />
            </Button>
            <Button href="/gram-sabha" variant="outline">
              <UsersRound size={18} aria-hidden="true" /> <T k="nav.gramSabha" />
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
