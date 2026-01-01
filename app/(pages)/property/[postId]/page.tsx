import MapWrapper from "@/components/widgets/map/map-wrapper";
import ImageSlider from "@/components/pages/view-property/image-slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getPostDetailsById } from "@/lib/actions/properties.action";
import { getAvatarFallback } from "@/lib/utils/general";
import {
  Bath,
  BedDouble,
  Bookmark,
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
import { redirect } from "next/navigation";



/**
 * Generate SEO metadata dynamically based on search filters
 */
export async function generateMetadata({ params }: { params: Promise<{ postId: string }> }): Promise<Metadata> {
  
  const { postId } = await params;

  // Fallback metadata if postId is invalid
  if (!postId || isNaN(Number(postId))) {
    return {
      title: "Property Not Found",
      description: "The property you are looking for does not exist.",
    };
  }

  const post = await getPostDetailsById(Number(postId));

  // Fallback if post not found
  if (!post) {
    return {
      title: "Property Not Found",
      description: "The property you are looking for does not exist.",
    };
  }

  const { title, description, city, images } = post;

  return {
    title: `${title} in ${city} | Real Estate Listing`,
    description: description.slice(0, 150) + "...",
    openGraph: {
      title: `${title} in ${city} | Real Estate Listing`,
      description: description.slice(0, 150) + "...",
      siteName: "Propely Real Estate",
      images: images && images.length > 0 ? [{ url: images[0], width: 1200, height: 630 }] : [],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} in ${city}`,
      description: description.slice(0, 150) + "...",
      images: images && images.length > 0 ? [images[0]] : [],
    },
  };
}



/**
 * View Single Property Page (Server Component)
 */
export default async function ViewProperty({ params }: { params: Promise<{ postId: string }> }) {

  const { postId } = await params;

  // 404 if post not found
  if (!postId || isNaN(Number(postId))) {
    redirect('/properties');
  }

  const post = await getPostDetailsById(Number(postId))

  // 404 if post not found
  if (!post) {
    return <div>Not Found</div>
  }

  // Convert sqm to sqft
  const sizeSqft = Math.floor(post.size * 10.7639);

  return (
    <main className="flex flex-col lg:flex-row flex-1 px-4 pb-20 lg:pb-0 max-h-[calc(100vh-80px)] bg-transparent overflow-y-scroll lg:overflow-y-hidden scroll-smooth">

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
                  <MapPin className="size-4 text-muted-foreground" /> {post.address}
                </p>
                <p className="inline-flex items-center bg-side-panel w-fit px-2.5 py-1 text-lg sm:text-xl font-semibold text-primary rounded-sm">
                  ${post.price}
                </p>
              </div>

              {/* Seller Card */}
              <div className="flex flex-row md:flex-col items-center justify-center px-12 py-5 bg-side-panel rounded-lg gap-5">

                <Avatar className="h-12 w-12">
                  <AvatarImage src={post.sellerInfo?.avatar ?? undefined} alt={post.sellerInfo?.name ?? "user avatar"} />
                  <AvatarFallback>{getAvatarFallback(post.sellerInfo?.name ?? "")}</AvatarFallback>
                </Avatar>

                <span className="text-center">{post.sellerInfo?.name}</span>
              </div>
            </div>

            {/* Extra Features */}
            {post.features && post.features.length > 0 && (
              <div className="mt-6">
                <h1 className="text-2xl font-semibold mb-4 border-b pb-2">Features</h1>
                <div className="flex flex-wrap gap-2 w-full">
                  {post.features.map((feature, idx) => (
                    <div
                      key={`${feature.title}-${idx}`}
                      className="flex items-center gap-3 bg-white px-5 py-4 rounded-lg flex-1 shadow-sm min-w-56"
                    >
                      <div className="shrink-0 size-4 rounded-full bg-transparent border-2 border-primary" />
                      <div>
                        <h2 className="font-bold text-sm md:text-base">{feature.title}</h2>
                        <p className="text-xs md:text-sm">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mt-12 bg-side-panel/30 text-sm sm:text-base rounded-lg leading-6 p-4">
              {post.description}
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
              <p className="text-sm font-semibold">
                {post.size} sqm ({sizeSqft} sqft)
              </p>
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
                <p className="text-sm">{post.school}</p>
              </div>
            </div>

            {/* Bus */}
            <div className="flex items-center gap-3">
              <Bus className="text-primary" />
              <div>
                <h2 className="font-bold">Bus Stop</h2>
                <p className="text-sm">{post.bus}</p>
              </div>
            </div>

            {/* Restaurant */}
            <div className="flex items-center gap-3">
              <Building className="text-primary" />
              <div>
                <h2 className="font-bold">Restaurant</h2>
                <p className="text-sm">{post.restaurant}</p>
              </div>
            </div>
          </div>

          {/* Location Map */}
          <h3 className="font-bold">Location</h3>
          <div className="h-48 w-full">
            <MapWrapper items={[{
              id: post.id,
              title: post.title,
              img: post.images[0],
              bedRooms: post.bedRooms,
              bathRooms: post.bathroom,
              price: post.price,
              address: post.address,
              latitude: post.latitude,
              longitude: post.longitude,
              location: post.city,
              ptype: post.ptype,
              ltype: post.ltype,
            }]} className="rounded-lg shadow-sm" />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button className="p-6 bg-white" variant="secondary">
              <MessageSquareText /> Send a message
            </Button>
            <Button className="p-6 bg-white" variant="secondary">
              <Bookmark /> Save the place
            </Button>
          </div>

        </div>
      </aside>
    </main>
  );
}