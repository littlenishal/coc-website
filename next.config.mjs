
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'oidc-token-hash'];
    return config;
  }
};

export default nextConfig;
