/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	productionBrowserSourceMaps: true,
};

module.exports = nextConfig;

module.exports = {
  images: {
    domains: [new URL(process.env.NEXT_PUBLIC_APP_BACKEND_URL).hostname],
  },
}
