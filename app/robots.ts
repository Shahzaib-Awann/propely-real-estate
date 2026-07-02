import type { MetadataRoute } from "next";
import { defaultAppSettings } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/profile",
        "/chat",
        "/property/add",
        "/property/edit",
      ],
    },
    sitemap: `${defaultAppSettings.baseUrl}/sitemap.xml`,
  };
}