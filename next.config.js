/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
  webpack: (
    config,
  ) => {
      config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
  images: {
    domains: [
      'everipedia.org',
      'figma.com',
      'ipfs.everipedia.org',
      'lh3.googleusercontent.com',
      'gateway.pinata.cloud'
    ], 
  },
}

module.exports = nextConfig