// module.exports = {
//     siteUrl: 'https://vspringboard.vercel.app',
//     generateRobotsTxt: true,
//     changefreq: 'weekly',
//     priority: 0.7,
// }

/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://vspringboard.vercel.app',
    generateRobotsTxt: true,
    exclude: ['/admin', '/admin/*', '/subadmin/*', '/api/*', '/onboarding'],
    changefreq: 'weekly',
    priority: 0.7,
}