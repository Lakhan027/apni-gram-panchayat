import type { Metadata } from 'next';
import SignatureRequestPage from '@/components/services/SignatureRequestPage';
import { getServiceGuide } from '@/lib/data';

export const metadata: Metadata = { title: 'राशन कार्ड के लिए — डिजिटल सिग्नेचर' };

export default async function RationCardPage() {
  return <SignatureRequestPage slug="ration-card" guide={await getServiceGuide('ration-card')} />;
}
