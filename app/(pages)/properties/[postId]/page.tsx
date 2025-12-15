import MapWrapper from "@/components/map/map-wrapper";
import ImageSlider from "@/components/pages/view-property/image-slider";
import { Button } from "@/components/ui/button";
import { getPostDetailsById } from "@/lib/actions/properties.action";
import { singlePostData, userData } from "@/lib/dummyData";
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
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function ViewProperty({ params }: { params: Promise<{ postId: string }>}) {

  const { postId } = await params;
  const user = userData;
  const viewPost = singlePostData;

  // Redirect if postId is missing or not a valid number
  if(!postId || isNaN(Number(postId))){
    redirect('/properties')
  }

  const post = await getPostDetailsById(Number(postId))

  if(!post) {
    redirect('/properties')
  }

  console.log(JSON.stringify(post, null, 2))


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

              {/* Property Text Info */}
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

              {/* User Card */}
              <div className="flex flex-row md:flex-col items-center justify-center px-12 py-5 bg-side-panel rounded-lg gap-5">
                <div className="h-12 w-12 rounded-full overflow-hidden relative">
                  <Image src={user.img} alt="Profile" sizes="100px" fill className="object-cover" />
                </div>
                <span className="text-center">{user.name}</span>
              </div>
            </div>

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

          {/* General Section */}
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

            {/* Size */}
            <div className="flex items-center gap-3 bg-white/75 p-2 rounded-lg shadow-sm">
              <Ruler className="text-primary" />
              <p className="text-sm font-semibold">
                {post.size} sqm ({Math.floor(viewPost.size * 10.7639)} sqft)
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

          {/* Buttons */}
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