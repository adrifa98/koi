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
      }
    ],
  },
};

export default nextConfig;
