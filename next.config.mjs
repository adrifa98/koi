import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "avatar.vercel.sh",
        port: "",
      },
      {
        hostname: "utfs.io",
        port: "",
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**'
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", 
      },
      {
        protocol: "https",
        hostname: "img.youtube.com", 
      },
      {
        protocol: "https",
        hostname: "static-cdn.jtvnw.net", 
      },
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com',
        pathname: '/system/resources/thumbnails/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://movistar-koi.vercel.app https://www.twitch.tv" 
          }
        ],
      },
    ];
  },
};
 
export default withNextIntl(nextConfig);