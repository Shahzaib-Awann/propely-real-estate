import MapWrapper from "@/components/widgets/map/map-wrapper";
import ImageSlider from "@/components/pages/view-property/image-slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getPostDetailsById } from "@/lib/actions/property.action";
import { formatMeters, getAvatarFallback } from "@/lib/utils/general";
import {
  Bath,
  BedDouble,
  Building,
  Bus,
  CircleDollarSign,
  MapPin,
  MessageSquareText,
  PawPrint,
  Ruler,
  School,
  ToolCase,
} from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import LexicalViewer from "@/components/widgets/editor/LexicalViewer";
import BookmarkButton from "../../../../components/pages/property/bookmark-button";
import { auth } from "@/auth";
import Link from "next/link";
import Script from "next/script";
import { generatePropertySEO } from "@/lib/seo";

/**
 * Generate SEO metadata dynamically based on post ID
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ postId: string }>;
}): Promise<Metadata> {
  const { postId } = await params;

  const property = await getPostDetailsById(postId);

  if (!property) {
    return {
      title: "Property Not Found | Propely",
      description: "The requested property could not be found.",
    };
  }

  return generatePropertySEO({
    id: property.id,
    title: property.title,
    city: property.city,
    address: property.address,
    price: property.price,
    ptype: property.ptype,
    ltype: property.ltype,
    bedRooms: property.bedRooms,
    bathroom: property.bathroom,
    images: property.images,
  });
}

/**
 * View Single Property Page (Server Component)
 */
export default async function ViewProperty({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const session = await auth();
  const userId = session?.user?.id ? Number(session.user.id) : undefined;

  const post = await getPostDetailsById(postId, userId);

  // 404 if post not found
  if (!post) {
    notFound();
  }

  const isOwner = userId === post.sellerInfo?.id;

  const chatHref = post.sellerInfo?.id
    ? {
        pathname: "/chat",
        query: {
          property: post.id,
        },
      }
    : null;

  const signInHref = `/sign-in?callbackUrl=${encodeURIComponent(
    `/chat?property=${post.id}`,
  )}`;

  return (
    <main className="flex flex-col lg:flex-row flex-1 px-4 pb-20 lg:pb-0 max-h-[calc(100vh-80px)] bg-transparent overflow-y-scroll lg:overflow-y-hidden scroll-smooth">
      <Script
        id={`property-${post.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Residence",
            name: post.title,
            description: post.title,
            address: {
              "@type": "PostalAddress",
              streetAddress: post.address,
              addressLocality: post.city,
            },
            numberOfRooms: post.bedRooms,
            floorSize: {
              "@type": "QuantitativeValue",
              value: post.size,
              unitCode: "FTK",
            },
            image: post.images,
          }),
        }}
      />

      {/* LEFT: Main Post Content */}
      <section className="flex-3 max-h-full lg:overflow-y-auto scroll-smooth">
        {/* Post Content Container */}
        <div className="w-full h-full flex flex-col gap-10 lg:pr-10">
          {/* Image Slider */}
          <div>
            <ImageSlider images={post.images} />
          </div>

          {/* Details Wrapper */}
          <div className="pb-12">
            {/* Top Section: Title + User Info */}
            <div className="flex flex-col md:flex-row justify-between gap-10">
              {/* Property Info */}
              <div className="flex flex-col gap-3">
                <h1 className="text-xl sm:text-2xl xl:text-3xl font-semibold">
                  {post.title}
                </h1>
                <p className="flex items-center gap-1 text-sm">
                  <MapPin className="size-4 text-muted-foreground" />{" "}
                  {post.address}
                </p>
                <p className="inline-flex items-center bg-side-panel w-fit px-2.5 py-1 text-lg sm:text-xl font-semibold text-primary rounded-sm">
                  ${post.price}
                </p>
              </div>

              {/* Seller Card */}
              <div className="flex flex-row md:flex-col items-center justify-center px-12 py-5 bg-side-panel rounded-lg gap-5">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={post.sellerInfo?.avatar ?? undefined}
                    alt={post.sellerInfo?.name ?? "user avatar"}
                  />
                  <AvatarFallback>
                    {getAvatarFallback(post.sellerInfo?.name ?? "")}
                  </AvatarFallback>
                </Avatar>

                <span className="text-center">{post.sellerInfo?.name}</span>
              </div>
            </div>

            {/* Extra Features */}
            {post.features && post.features.length > 0 && (
              <div className="mt-6">
                <h1 className="text-2xl font-semibold mb-4 border-b pb-2">
                  Features
                </h1>
                <div className="flex flex-wrap gap-2 w-full">
                  {post.features.map((feature, idx) => (
                    <div
                      key={`${feature.title}-${idx}`}
                      className="flex items-center gap-3 bg-white px-5 py-4 rounded-lg flex-1 shadow-sm min-w-56"
                    >
                      <div className="shrink-0 size-4 rounded-full bg-transparent border-2 border-primary" />
                      <div>
                        <h2 className="font-bold text-sm md:text-base">
                          {feature.title}
                        </h2>
                        <p className="text-xs md:text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mt-12 bg-side-panel/30 text-sm sm:text-base rounded-lg leading-6 p-4">
              <LexicalViewer value={post.description} />
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT: Sidebar */}
      <aside className="flex-2 max-h-full lg:overflow-y-auto bg-side-panel rounded-lg lg:rounded-none">
        {/* Sidebar Content */}
        <div className="w-full p-5 flex flex-col gap-6">
          {/* General Info */}
          <h3 className="font-bold">General</h3>
          <div className="bg-white/75 p-4 rounded-lg space-y-4 shadow-sm">
            {/* Utilities */}
            <div className="flex items-center gap-3">
              <ToolCase className="text-primary" />
              <div>
                <h2 className="font-bold">Utilities</h2>
                <p className="text-sm">{post.utilities}</p>
              </div>
            </div>

            {/* Pet Policy */}
            <div className="flex items-center gap-3">
              <PawPrint className="text-primary" />
              <div>
                <h2 className="font-bold">Pet Policy</h2>
                <p className="text-sm">{post.petPolicy}</p>
              </div>
            </div>

            {/* Property Fees */}
            <div className="flex items-center gap-3">
              <CircleDollarSign className="text-primary" />
              <div>
                <h2 className="font-bold">Property Fees</h2>
                <p className="text-sm">{post.incomePolicy}</p>
              </div>
            </div>
          </div>

          {/* Sizes Section */}
          <h3 className="font-bold">Sizes</h3>
          <div className="w-full flex flex-wrap gap-4">
            {/* Area */}
            <div className="flex items-center gap-3 bg-white/75 p-2 rounded-lg shadow-sm">
              <Ruler className="text-primary" />
              <p className="text-sm font-semibold">{post.size} sqft</p>
            </div>

            {/* Bedrooms */}
            <div className="flex items-center gap-3 bg-white/75 p-2 rounded-lg shadow-sm">
              <BedDouble className="text-primary" />
              <p className="text-sm font-semibold">{post.bedRooms} bed</p>
            </div>

            {/* Bathrooms */}
            <div className="flex items-center gap-3 bg-white/75 p-2 rounded-lg shadow-sm">
              <Bath className="text-primary" />
              <p className="text-sm font-semibold">{post.bathroom} bathroom</p>
            </div>
          </div>

          {/* Nearby Places Section */}
          <h3 className="font-bold">Nearby Places</h3>
          <div className="bg-white/75 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between gap-5">
            {/* School */}
            <div className="flex items-center gap-3">
              <School className="text-primary" />
              <div>
                <h2 className="font-bold">School</h2>
                <p className="text-sm">{formatMeters(post.school)}</p>
              </div>
            </div>

            {/* Bus */}
            <div className="flex items-center gap-3">
              <Bus className="text-primary" />
              <div>
                <h2 className="font-bold">Bus Stop</h2>
                <p className="text-sm">{formatMeters(post.bus)}</p>
              </div>
            </div>

            {/* Restaurant */}
            <div className="flex items-center gap-3">
              <Building className="text-primary" />
              <div>
                <h2 className="font-bold">Restaurant</h2>
                <p className="text-sm">{formatMeters(post.restaurant)}</p>
              </div>
            </div>
          </div>

          {/* Location Map */}
          <h3 className="font-bold">Location</h3>
          <div className="h-48 w-full">
            <MapWrapper
              items={[
                {
                  id: post.id,
                  title: post.title,
                  img: post.images[0],
                  bedRooms: post.bedRooms,
                  price: post.price,
                  latitude: post.latitude,
                  longitude: post.longitude,
                },
              ]}
              className="rounded-lg shadow-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            {post.sellerInfo?.id && !isOwner && (
              <Link
                href={userId ? chatHref! : signInHref}
                className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all shrink-0 outline-none hover:bg-primary/90 px-4 py-3.5 bg-white text-black hover:text-white"
              >
                <MessageSquareText className="size-4" />
                Send a message
              </Link>
            )}
            <BookmarkButton
              initialSaved={post.isSaved}
              propertyId={post.id}
              canBookmark={post.permissions.canBookmark}
              isLoggedIn={!!userId}
            />
          </div>
        </div>
      </aside>
    </main>
  );
}
