/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  webpack5: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
  styledComponents: true,
  images: {
    domains: [
      'everipedia.org',
      'figma.com',
      'ipfs.everipedia.org',
      'lh3.googleusercontent.com',
      'gateway.pinata.cloud'
    ], 
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "https://polygonscan.com/",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  }
}

module.exports = nextConfig