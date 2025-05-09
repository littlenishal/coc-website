
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'oidc-token-hash'];
    return config;
  },
  images: {
    domains: ['picsum.photos']
  }
};

export default nextConfig;
