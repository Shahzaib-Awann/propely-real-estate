import Navbar from "@/components/layout/navbar/navbar";
import SearchBar from "@/components/pages/landing-page/searchBar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-background text-foreground max-w-340 min-h-screen mx-auto flex flex-col">

      {/* Navbar */}
      <Navbar />

      {/* Main Content Section  */}
      <div className="flex flex-row flex-1 px-4">

        {/* Left: Heading + Search + Stats */}
        <div className="flex-3 flex flex-col justify-center gap-12 pb-12">

          {/* Heading */}
          <h1 className="font-lato font-bold text-6xl pr-0 lg:pr-12">
            Find Real Estate & Get Your Dream Place
          </h1>

          {/* Description */}
          <p className="pr-0 lg:pr-12">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro reiciendis officia minus error aliquid optio eaque doloremque nobis explicabo in, voluptate, nemo incidunt quaerat. Tempore molestiae placeat accusantium numquam. Provident earum ipsa vitae id corporis.
          </p>

          {/* Search Bar */}
          <SearchBar />

          {/* Stats */}
          <div className="flex flex-col gap-10 sm:flex-row sm:gap-0 justify-between">
            {[
              { value: "15+", label: "Years of Experience" },
              { value: "200", label: "Awards Gained" },
              { value: "1200+", label: "Property Ready" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${idx === 2 ? "mr-0 md:mr-10" : ""}`}
              >
                <h1 className="text-4xl font-bold">{stat.value}</h1>
                <h3 className="text-xl font-light">{stat.label}</h3>
              </div>
            ))}
          </div>

        </div>

        {/* Right: Background + Image Grid */}
        <div className="hidden lg:flex flex-2 justify-end items-center gap-4 lg:bg-side-panel p-0 h-[calc(100vh-80px)]">

          {/* Wrapper */}
          <div className="w-full h-auto px-6 py-5">
            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-6 w-full max-w-xl">
              {[
                { src: "/images/img-1.jpg", className: "relative w-full xl:w-full h-52 xl:left-0 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-all duration-200" },
                { src: "/images/img-2.jpg", className: "relative w-full xl:w-full h-72 mt-6 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-all duration-200" },
                { src: "/images/img-3.jpg", className: "relative w-full xl:w-full h-72 -mt-6 xl:left-0 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-all duration-200" },
                { src: "/images/img-4.jpg", className: "relative w-full xl:w-full h-52 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-all duration-200" },
              ].map((img, idx) => (
                <div
                  key={idx}
                  className={img.className}
                >
                  <Image
                    src={img.src}
                    fill
                    alt={`img-${idx + 1}`}
                    sizes="(max-width: 1000px) 0px, 50vw"
                    className="object-cover hover:scale-110 transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}