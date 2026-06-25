import Navbar from "@/components/layout/navbar/navbar";
import SearchBar from "@/components/pages/landing-page/searchBar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-background text-foreground max-w-340 min-h-screen mx-auto flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content Section  */}
      <div className="flex flex-row flex-1 px-4 pt-15 sm:pt-0">
        {/* Left: Heading + Search + Stats */}
        <div className="flex-3 flex flex-col justify-center gap-12 pb-12">
          {/* Heading */}
          <h1 className="font-lato font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight">
            Find the Perfect Property for Your Lifestyle
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
            Discover verified homes, apartments, and investment opportunities in
            your preferred location. Browse listings, compare options, and find
            a place that truly feels like home.
          </p>

          {/* Search Bar */}
          <SearchBar />

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { value: "15+", label: "Years of Experience" },
              { value: "200", label: "Awards Gained" },
              { value: "1200+", label: "Property Ready" },
            ].map((stat, idx) => (
              <div key={idx}>
                <h2 className="text-3xl md:text-4xl font-bold">{stat.value}</h2>
                <p className="text-base md:text-lg text-muted-foreground">
                  {stat.label}
                </p>
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
                {
                  src: "/images/img-1.jpg",
                  className:
                    "relative w-full xl:w-full h-52 xl:left-0 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-all duration-200",
                },
                {
                  src: "/images/img-2.jpg",
                  className:
                    "relative w-full xl:w-full h-72 mt-6 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-all duration-200",
                },
                {
                  src: "/images/img-3.jpg",
                  className:
                    "relative w-full xl:w-full h-72 -mt-6 xl:left-0 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-all duration-200",
                },
                {
                  src: "/images/img-4.jpg",
                  className:
                    "relative w-full xl:w-full h-52 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-all duration-200",
                },
              ].map((img, idx) => (
                <div key={idx} className={img.className}>
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
