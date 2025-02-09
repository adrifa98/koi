export default {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**'
      },
      {
        hostname: "avatar.vercel.sh",
        port: "",
      },
      {
        hostname: "utfs.io",
        port: "",
      },
    ]
  }
};
