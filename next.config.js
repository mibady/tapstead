/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001'],
    },
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self'",
              "connect-src 'self' https://*.stripe.com https://*.cal.com https://api.cal.com https://api.stripe.com https://*.supabase.co https://localhost:* http://localhost:*",
              "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://*.cal.com"
            ].join('; ')
          }
        ]
      }
    ]
  },
  webpack: (config) => {
    // Handle Stripe localization files
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });
    
    return config;
  },
  env: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NEXT_PUBLIC_CALCOM_API_URL: 'https://api.cal.com',
    NEXT_PUBLIC_CALCOM_CLIENT_ID: process.env.NEXT_PUBLIC_CALCOM_CLIENT_ID,
    CALCOM_API_KEY: process.env.CALCOM_API_KEY
  },
  // Enable React Strict Mode for better error catching
  reactStrictMode: true,
  // Enable production browser source maps for better debugging
  productionBrowserSourceMaps: true,

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://localhost:3000/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig