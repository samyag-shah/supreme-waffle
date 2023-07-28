const path = require("path");
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
  // sassOptions: {
  //   // loading scss for next 13.0.0
  //   fiber: false,
  //   includePaths: [path.join(__dirname, "styles")],
  // },
  // // disable css-modules component styling
  // webpack(config) {
  //   config.module.rules.forEach((rule) => {
  //     const { oneOf } = rule;
  //     if (oneOf) {
  //       oneOf.forEach((one) => {
  //         if (!`${one.issuer?.and}`.includes("_app")) return;
  //         one.issuer.and = [path.resolve(__dirname)];
  //       });
  //     }
  //   });
  //   return config;
  // },
};
module.exports = nextConfig;
