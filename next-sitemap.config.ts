module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wonderful-quran.netlify.app',
  generateRobotsTxt: true,
  priority: null,
  exclude: ['/api/*'],
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }]
  }
};
