/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  compress: false,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
