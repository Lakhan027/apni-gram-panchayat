import type { Metadata } from 'next';
import { BookOpen, ClipboardList, Hammer, Landmark, MapPin, UsersRound } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/ui/Card';
import IconTile from '@/components/ui/IconTile';
import SectionHeading from '@/components/ui/SectionHeading';
import MemberCard from '@/components/members/MemberCard';
import { getMembers, getPanchayatInfo } from '@/lib/data';
import { L, T } from '@/lib/i18n/T';

export const metadata: Metadata = { title: 'पंचायत परिचय' };

const FUNCTION_ICONS = [Hammer, BookOpen, UsersRound, ClipboardList];

export default async function AboutPage() {
  const [info, members] = await Promise.all([getPanchayatInfo(), getMembers()]);
  const officials = members.filter((m) => m.role !== 'ward-panch');
  const sarpanchName = members.find((m) => m.role === 'sarpanch') ?? { name: '', nameEn: '' };
  const details = [
    { key: 'gp', label: <T k="about.gp" />, value: <L hi={info.name} en={info.en?.name} /> },
    { key: 'tehsil', label: <T k="about.tehsil" />, value: info.tehsil },
    { key: 'district', label: <T k="about.district" />, value: info.district },
    { key: 'state', label: <T k="about.state" />, value: <T k="site.state" /> },
    { key: 'sarpanch', label: <T k="about.sarpanch" />, value: <L hi={sarpanchName.name} en={sarpanchName.nameEn} /> },
    { key: 'villages', label: <T k="about.villages" />, value: <L hi={info.villages.join(', ')} en={info.en?.villages?.join(', ')} /> },
    { key: 'wards', label: <T k="about.wardCount" />, value: String(info.wards.length) },
  ];

  return (
    <>
      <PageHeader title={<T k="nav.about" />} description={<T k="about.desc" />} crumbs={[{ label: <T k="nav.about" /> }]} />
      <div className="container-page space-y-14 py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Card className="p-5 sm:p-7">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <h2 className="text-[22px] font-bold text-green-900 md:text-[26px]">
                <T k="about.intro" />
              </h2>
            </div>
            <p className="text-[16px] leading-[1.8] text-ink">
              <L hi={info.intro} en={info.en?.intro} />
            </p>
          </Card>
          <Card className="p-5 sm:p-7">
            <div className="mb-4 flex items-center gap-3">
              <IconTile icon={Landmark} />
              <h2 className="text-[20px] font-bold text-green-900">
                <T k="about.details" />
              </h2>
            </div>
            <dl className="divide-y divide-line">
              {details.map((d) => (
                <div key={d.key} className="flex flex-wrap justify-between gap-2 py-2.5">
                  <dt className="text-muted">{d.label}</dt>
                  <dd className="font-semibold text-ink">{d.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>

        <section aria-labelledby="wards">
          <SectionHeading id="wards" title={<T k="about.wards" />} />
          <ul className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
            {info.wards.map((w) => (
              <li key={w.number} className="card flex items-center gap-3 p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-700 text-[18px] font-extrabold text-white">
                  {w.number}
                </span>
                <span className="min-w-0">
                  <span className="block font-bold text-green-900">
                    <T k="common.ward" vars={{ n: w.number }} />
                  </span>
                  {w.area && (
                    <span className="flex items-start gap-1 break-words text-[14px] text-muted">
                      <MapPin size={14} className="mt-1 shrink-0" aria-hidden="true" />
                      <L hi={w.area} en={info.en?.wardArea} />
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="functions">
          <SectionHeading id="functions" title={<T k="about.functions" />} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {info.functions.map((f, i) => (
              <Card key={f.title} className="p-5">
                <IconTile icon={FUNCTION_ICONS[i % FUNCTION_ICONS.length]} tone={i % 2 ? 'saffron' : 'green'} />
                <h3 className="mt-3 text-[18px] font-bold text-green-900">
                  <L hi={f.title} en={info.en?.functions?.[i]?.title} />
                </h3>
                <p className="mt-1 text-[15px] text-muted">
                  <L hi={f.text} en={info.en?.functions?.[i]?.text} />
                </p>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="reps">
          <SectionHeading id="reps" title={<T k="about.reps" />} link={{ href: '/members', label: <T k="members.viewAll" /> }} />
          <ul className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {officials.map((m) => (
              <li key={m.id}>
                <MemberCard member={m} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
