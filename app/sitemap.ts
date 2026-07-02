import type { MetadataRoute } from "next";
import { defaultAppSettings } from "@/lib/constants";
import { getPropertyUrls } from "@/lib/actions/properties.action";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = defaultAppSettings.baseUrl;

 const properties = await getPropertyUrls();

  const propertyUrls = properties.map((property) => ({
    url: `${baseUrl}/property/${property.id}`,
    lastModified: property.updatedAt ?? new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },

    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },

    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },

    ...propertyUrls,
  ];
}