import Navbar from "@/components/Navbar/navbar";
import SearchBar from "@/components/pages/landing-page/searchBar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-transparent text-black max-w-340 min-h-screen mx-auto px-5 flex flex-col">

      {/* Navbar */}
      <Navbar />

      {/* Main Content Section  */}
      <div className="bg-green-500/0 flex flex-row flex-1">

        {/* Left: Heading + Search + Stats */}
        <div className="w-1/2 flex-1 flex flex-col justify-center gap-12">

          {/* Heading */}
          <h1 className="font-lato font-bold text-6xl">
            Find Real Estate & Get Your Dream Place
          </h1>

          {/* Description */}
          <p>
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
        <div className="w-1/2 lg:flex hidden items-center justify-center relative">

          {/* Soft background orbs + light Background */}
          <div className="absolute w-md right-0 h-full bg-[#eac9a8]/50 "></div>
          <div className="absolute top-20 left-10 w-28 h-28 bg-[#cb6441]/30 blur-3xl rounded-full"></div>
          <div className="absolute bottom-1/2 right-1/2 w-36 h-36 bg-[#eac9a8]/30 blur-2xl rounded-full"></div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-6 w-full max-w-xl">
            {[
              { src: "/images/img-1.jpg", className: "relative w-full lg:w-40 xl:w-full h-52 lg:left-20 xl:left-0 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-all duration-200" },
              { src: "/images/img-2.jpg", className: "relative w-full lg:w-52 xl:w-full h-72 mt-6 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-all duration-200" },
              { src: "/images/img-3.jpg", className: "relative w-full lg:w-40 xl:w-full h-72 -mt-6 lg:left-20 xl:left-0 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-all duration-200" },
              { src: "/images/img-4.jpg", className: "relative w-full lg:w-56 xl:w-full h-52 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-all duration-200" },
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
  );
}