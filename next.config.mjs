/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  experimental: {
    serverActions: {
      allowedForwardedHosts: [`*`],
      allowedOrigins: [`*`],
    },
  },
};

export default nextConfig;
