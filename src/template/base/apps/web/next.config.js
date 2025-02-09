/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ['ui'],
  experimental: {
    typedRoutes: true,
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false

    return config
  },
}
