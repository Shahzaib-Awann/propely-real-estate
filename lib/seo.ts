// lib/seo.ts

import type { Metadata } from "next";
import { defaultAppSettings } from "./constants";

type SEOProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
};

const SITE_NAME = "Propley";
const SITE_URL = defaultAppSettings.baseUrl;

export function generateSEO({
  title,
  description,
  path = "",
  image = "/images/og-image.jpg",
  keywords = [],
  noIndex = false,
}: SEOProps): Metadata {
  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,

    keywords: [
      "real estate",
      "property listings",
      "buy property",
      "sell property",
      "rent property",
      ...keywords,
    ],

    alternates: {
      canonical: url,
    },

    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },

    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function generatePropertySEO(property: {
  id: string;
  title: string;
  city: string;
  address: string;
  price: string;
  ptype: string;
  ltype: string;
  bedRooms: number;
  bathroom: number;
  images: string[];
}) {
  const propertyType =
    property.ptype.charAt(0).toUpperCase() +
    property.ptype.slice(1);

  const listingType =
    property.ltype === "rent"
      ? "For Rent"
      : "For Sale";

  return generateSEO({
    title: `${property.title} | ${property.city}`,

    description:
      `${property.bedRooms} bedroom, ${property.bathroom} bathroom ${propertyType.toLowerCase()} ${listingType.toLowerCase()} in ${property.city}. View photos, location, features, pricing and contact the seller directly.`,

    path: `/property/${property.id}`,

    image: property.images?.[0],

    keywords: [
      property.title,
      property.city,
      property.address,
      propertyType,
      listingType,
      `${property.bedRooms} bedroom`,
      "real estate",
      "property listing",
      "buy property",
      "rent property",
      "house for sale",
      "apartment for rent",
    ],
  });
}