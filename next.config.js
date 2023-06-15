/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "myawsaccount1.s3.ap-south-1.amazonaws.com",
        pathname: "/*",
      },
    ],
  },
};
module.exports = nextConfig;
