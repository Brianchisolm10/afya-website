/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  reactStrictMode: true,
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Enable SWC minification for faster builds
  swcMinify: true,

  // CSS optimization
  productionBrowserSourceMaps: false, // Disable source maps in production for smaller bundles
  
  // Experimental features for better performance
  experimental: {
    optimizeCss: true, // Enable CSS optimization
    optimizePackageImports: [
      '@prisma/client',
      'lucide-react',
      'date-fns',
      'zod',
    ],
  },

  // Webpack configuration for advanced code splitting
  webpack: (config, { isServer, dev }) => {
    if (!dev && !isServer) {
      // Optimize chunk splitting strategy
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Vendor chunk for node_modules
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              reuseExistingChunk: true,
            },
            // React and React-DOM in separate chunk
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              name: 'react',
              priority: 20,
              reuseExistingChunk: true,
            },
            // UI components chunk
            ui: {
              test: /[\\/]components[\\/]ui[\\/]/,
              name: 'ui-components',
              priority: 15,
              minChunks: 2,
              reuseExistingChunk: true,
            },
            // Admin components chunk
            admin: {
              test: /[\\/]components[\\/]admin[\\/]/,
              name: 'admin-components',
              priority: 15,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            // Tools components chunk
            tools: {
              test: /[\\/]components[\\/]tools[\\/]/,
              name: 'tools-components',
              priority: 15,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            // Performance utilities chunk
            performance: {
              test: /[\\/]lib[\\/]performance[\\/]/,
              name: 'performance-utils',
              priority: 15,
              minChunks: 2,
              reuseExistingChunk: true,
            },
            // Common utilities chunk
            common: {
              test: /[\\/]lib[\\/]/,
              name: 'common-lib',
              priority: 5,
              minChunks: 3,
              reuseExistingChunk: true,
            },
            // Default chunk for shared code
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      };

      // Tree shaking optimizations
      config.optimization.usedExports = true;
      config.optimization.sideEffects = true;
    }

    return config;
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Redirects for common paths
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig
