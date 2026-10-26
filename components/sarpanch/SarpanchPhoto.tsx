import Image from 'next/image';

interface SarpanchPhotoProps {
  src: string;
  alt: string;
  size: 'md' | 'lg';
}

/** Round photo with the site's green-and-saffron ring (same style as the logo and member cards). */
export default function SarpanchPhoto({ src, alt, size }: SarpanchPhotoProps) {
  const box = size === 'lg' ? 'h-40 w-40 sm:h-48 sm:w-48' : 'h-28 w-28 sm:h-32 sm:w-32';
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-full bg-green-50 ring-4 ring-saffron ring-offset-4 ${box}`}>
      {/* Shown near the top of the page, so load it straight away rather than lazily. */}
      <Image src={src} alt={alt} fill sizes={size === 'lg' ? '192px' : '128px'} className="object-cover object-top" priority />
    </div>
  );
}
