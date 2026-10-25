/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  // A second dev server can use its own folder: NEXT_DIST_DIR=.next-test npx next dev -p 3011.
  // Dev only: with output: 'export', distDir is also where the exported site goes, so builds keep the default (out/).
  ...(process.env.NODE_ENV === 'development' && process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
};

export default nextConfig;
