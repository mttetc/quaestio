/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Configure for WebContainer environment
  output: 'standalone',
  
  // Use webpack for compilation in WebContainer
  webpack: (config, { dev, isServer }) => {
    // Only enable minification in production and for client-side bundles
    if (!dev && !isServer) {
      config.optimization.minimize = true;
    }

    // Configure for WebContainer compatibility
    config.experiments = {
      ...config.experiments,
      layers: true,
      topLevelAwait: true,
      asyncWebAssembly: false,
    }

    // Disable Node.js native modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      module: false,
      path: false,
      "builtin-modules": false
    };

    return config;
  }
};

module.exports = nextConfig;