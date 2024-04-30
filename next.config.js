/** @type {import('next').NextConfig} */

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ]
  },
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
  webpack(config) {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      'react-native': false,
    }
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    config.optimization.moduleIds = 'named'
    config.optimization.runtimeChunk = 'single'
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
  images: {
    domains: [
      'static.debank.com',
      'everipedia.org',
      'figma.com',
      'ipfs.everipedia.org',
      'lh3.googleusercontent.com',
      'gateway.pinata.cloud',
    ],
  },
}

module.exports = nextConfig
