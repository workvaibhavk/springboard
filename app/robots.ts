export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/subadmin"],
    },
    sitemap: "https://vspringboard.vercel.app/sitemap.xml",
  };
}
