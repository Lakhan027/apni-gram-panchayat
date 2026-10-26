import type { Metadata } from 'next';
import PageHeader from '@/components/layout/PageHeader';
import VillageGallery from '@/components/gallery/VillageGallery';
import { getGallery } from '@/lib/data';
import { T } from '@/lib/i18n/T';

export const metadata: Metadata = { title: 'गैलरी' };

export default async function GalleryPage() {
  const photos = await getGallery();
  return (
    <>
      <PageHeader title={<T k="nav.gallery" />} description={<T k="gallery.desc" />} crumbs={[{ label: <T k="nav.gallery" /> }]} />
      <div className="container-page py-8">
        <VillageGallery photos={photos} />
      </div>
    </>
  );
}
