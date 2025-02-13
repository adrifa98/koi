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
        hostname: 'static.vecteezy.com', // Dominio del que se cargan las imágenes
        pathname: '/system/resources/thumbnails/**',
      },
      
    ],
  },
};
 

export default withNextIntl(nextConfig);