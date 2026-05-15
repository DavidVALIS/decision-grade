/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  // We use next-mdx-remote to load .mdx from the repo root, so .mdx is NOT a page extension.
  pageExtensions: ['tsx', 'ts'],
  reactStrictMode: true,
};

export default nextConfig;
