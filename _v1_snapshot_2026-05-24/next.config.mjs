/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  // We use next-mdx-remote to load .mdx from the repo root, so .mdx is NOT a page extension.
  pageExtensions: ['tsx', 'ts'],
  reactStrictMode: true,
  // Type-check and lint are run separately (npx tsc --noEmit, npm run lint) to keep the
  // production build fast on slow IO targets like CI runners and FUSE mounts.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
