import type { Metadata } from 'next';
import SignatureRequestPage from '@/components/services/SignatureRequestPage';
import { getServiceGuide } from '@/lib/data';

export const metadata: Metadata = { title: 'NOC के लिए — डिजिटल सिग्नेचर' };

export default async function NocPage() {
  return <SignatureRequestPage slug="noc" guide={await getServiceGuide('noc')} />;
}
