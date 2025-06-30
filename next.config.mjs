// import bundleAnalyzer from '@next/bundle-analyzer'
// TODO: Uncomment when MDX dependencies are installed
// import createMDX from '@next/mdx'

// const withBundleAnalyzer = bundleAnalyzer({
//   enabled: process.env.ANALYZE === 'true',
// })

// TODO: Uncomment when MDX dependencies are installed
// const withMDX = createMDX({
//   options: {
//     remarkPlugins: [],
//     rehypePlugins: [],
//   },
// })

/** @type {import('next').NextConfig} */
const nextConfig = {
  // TODO: Uncomment when MDX is enabled
  // pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  // Enable ESLint and TypeScript checks during builds for production safety
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "*.vercel.app", "tapstead.com"]
    }
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
  },
  // Compress static assets
  compress: true,
  // Enable static optimization
  poweredByHeader: false,
  images: {
    domains: ['placeholder.svg', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    unoptimized: true,
  },
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
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

// TODO: When MDX is enabled, change this to:
// export default withBundleAnalyzer(withMDX(nextConfig))
export default nextConfig
