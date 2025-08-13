/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://protoready.ai',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/admin*',
    '/api/*',
    '/consultant/dashboard*',
    '/messages*',
    '/server-sitemap.xml',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/consultant/dashboard/',
          '/messages/',
          '/_next/',
          '/static/',
        ],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_APP_URL || 'https://protoready.ai'}/server-sitemap.xml`,
    ],
  },
  transform: async (config, path) => {
    // Custom priority and changefreq for different page types
    const customConfig = {
      loc: path,
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }

    // Homepage gets highest priority
    if (path === '/') {
      customConfig.priority = 1.0
      customConfig.changefreq = 'daily'
    }
    
    // Assessment and marketplace are high priority
    if (path.includes('/assessment') || path.includes('/marketplace')) {
      customConfig.priority = 0.9
      customConfig.changefreq = 'daily'
    }
    
    // Pricing and auth pages
    if (path.includes('/pricing') || path.includes('/auth')) {
      customConfig.priority = 0.8
      customConfig.changefreq = 'weekly'
    }
    
    // Consultant public profiles
    if (path.includes('/consultant/') && !path.includes('/dashboard')) {
      customConfig.priority = 0.6
      customConfig.changefreq = 'weekly'
    }

    return customConfig
  },
}