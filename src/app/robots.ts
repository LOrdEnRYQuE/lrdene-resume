import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    host: "https://lordenryque.com",
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/admin", "/portal"],
      },
    ],
    sitemap: ["https://lordenryque.com/sitemap.xml"],
  };
}
