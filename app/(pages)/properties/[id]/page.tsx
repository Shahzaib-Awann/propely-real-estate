import ImageSlider from "@/components/pages/view-property/image-slider";
import { singlePostData, userData } from "@/lib/dummyData";
import { MapPin } from "lucide-react";
import Image from "next/image";

export default function Properties() {
  const user = userData;
  const post = singlePostData;

  return (
    <main className="flex flex-row flex-1 bg-transparent">

      {/* Left: Post Details */}
      <section className="flex-1 w-full flex flex-col gap-10 pr-2 md:pr-10 max-h-[calc(100vh-100px)] pb-12">

        {/* Image Carousel */}
        <div>
          <ImageSlider images={post.images} />
        </div>

        <div>

          {/* Top: Post details & user info  */}
          <div className="flex flex-row justify-between">

            {/* Post Info */}
            <div className="flex flex-col gap-5">
              <h1 className="text-3xl font-semibold">{post.title}</h1>
              <p className="flex items-center gap-1 text-xs sm:text-sm"><MapPin className="size-4 text-muted-foreground" /> {post.address}</p>
              <p className="inline-flex items-center rounded-sm bg-[#eac9a8]/50 w-fit px-2.5 py-1 text-base sm:text-lg font-semibold text-[#cb6441]">$ {post.price}</p>
            </div>

            {/* User Info */}
            <div className="flex flex-col items-center justify-center px-12 bg-[#eac9a8]/50 rounded-lg gap-5 ">
              <div className="h-12 w-12 rounded-full overflow-hidden relative">
                <Image src={user.img} alt="Profile" fill className="object-cover" />
              </div>
              <span>{user.name}</span>
            </div>

          </div>

          {/* Bottom: Post description */}
          <div className="mt-12 bg-[#eac9a8]/20 leading-6">
            {post.description}
          </div>
        </div>

      </section>

      {/* Right: Post Details */}
      <aside className="hidden lg:flex w-md items-center justify-center relative h-calc(100vh-100px)">

        {/* Soft background panel */}
        <div className="absolute right-0 h-full w-md bg-[#eac9a8]/50"></div>

      </aside>
    </main>
  );
}