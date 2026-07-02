import type { Metadata } from "next";
import { Geist, Geist_Mono, Lato } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import QueryToastHandler from "@/components/widgets/query-toast-handler";
import { auth } from "@/auth";
import SocketProvider from "@/components/providers/socket/socket-provider";
import { defaultAppSettings } from "@/lib/constants";

/**
 * Font configuration using Next.js Google Fonts optimization.
 * Each font is assigned a CSS variable for global usage.
 */

// Primary sans-serif font
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Monospace font used for code or technical UI elements
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Secondary UI font with multiple weight options
const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

/**
 * Global metadata for the application.
 * Used by Next.js for SEO and document head configuration.
 */
export const metadata: Metadata = {
  metadataBase: new URL(defaultAppSettings.baseUrl),

  title: {
    default: "Propely | Buy, Sell & Rent Properties",
    template: "%s | Propely",
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },

  description:
    "Discover apartments, houses, plots, and commercial properties for sale and rent. Connect directly with property owners and real estate professionals on Propely.",

  keywords: [
    "real estate",
    "property listings",
    "buy property",
    "sell property",
    "rent property",
    "houses for sale",
    "apartments for rent",
    "commercial property",
    "property marketplace",
    "real estate platform",
    "property finder",
    "real estate listings",
  ],

  authors: [
    {
      name: "Shahzaib Awan",
    },
  ],

  creator: "Shahzaib Awan",

  publisher: "Propely",

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: defaultAppSettings.baseUrl,
    siteName: "Propely",
    title: "Propely | Buy, Sell & Rent Properties",
    description:
      "Find verified property listings, connect with sellers, and explore homes, apartments, plots, and commercial spaces.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Propely Real Estate Marketplace",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Propely | Buy, Sell & Rent Properties",
    description:
      "Browse property listings and connect directly with buyers and sellers.",
    images: ["/images/og-image.jpg"],
  },

  category: "Real Estate",
};

/**
 * Root Layout Component (Next.js App Router)
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /* Authenticate User */
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lato.variable} antialiased`}
      >
        {/* Provides real-time socket connection scoped to the authenticated user */}
        <SocketProvider userId={userId ? Number(userId) : undefined} />

        {/* Client component handles all query-to-toast logic */}
        <QueryToastHandler />

        {/* Render all page-specific content */}
        {children}

        {/* Global toast notification container */}
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
