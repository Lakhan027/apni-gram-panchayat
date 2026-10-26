import type { Metadata } from 'next';
import SignatureRequestPage from '@/components/services/SignatureRequestPage';
import { getServiceGuide } from '@/lib/data';

export const metadata: Metadata = { title: 'लाइट फाइल के लिए — डिजिटल सिग्नेचर' };

export default async function LightFilePage() {
  return <SignatureRequestPage slug="light-file" guide={await getServiceGuide('light-file')} />;
}
