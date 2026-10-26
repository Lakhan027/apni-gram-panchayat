// डिजिटल सिग्नेचर options. The service pages show guidance (data/service-guides.json), not forms.
import type { MessageKey } from './i18n/translate';

export interface SignatureService {
  slug: 'noc' | 'ration-card' | 'light-file';
  titleKey: MessageKey;
  descKey: MessageKey;
}

/** The three डिजिटल सिग्नेचर options, in display order. */
export const SIGNATURE_SERVICES: SignatureService[] = [
  {
    slug: 'noc',
    titleKey: 'ds.noc',
    descKey: 'ds.nocDesc',
  },
  {
    slug: 'ration-card',
    titleKey: 'ds.ration',
    descKey: 'ds.rationDesc',
  },
  {
    slug: 'light-file',
    titleKey: 'ds.light',
    descKey: 'ds.lightDesc',
  },
];

export function getSignatureService(slug: SignatureService['slug']): SignatureService {
  return SIGNATURE_SERVICES.find((s) => s.slug === slug)!;
}
