import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/admin"],
    },
    host: "https://lrdene.com",
    sitemap: "https://lrdene.com/sitemap.xml",
  };
}
