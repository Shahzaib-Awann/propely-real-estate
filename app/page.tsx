import Navbar from "@/components/Navbar/navbar";
import SearchBar from "@/components/pages/landing-page/searchBar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-transparent text-black max-w-340 min-h-screen mx-auto px-5 flex flex-col">
      <Navbar />

      <div className="bg-green-500/0 flex flex-row flex-1">
        <div className="w-1/2 flex-1 flex flex-col justify-center gap-12">

            <h1 className="font-lato font-bold text-6xl">
              Find Real Estate & Get Your Dream Place
            </h1>

            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro reiciendis officia minus error aliquid optio eaque doloremque nobis explicabo in, voluptate, nemo incidunt quaerat. Tempore molestiae placeat accusantium numquam. Provident earum ipsa vitae id corporis.
            </p>

            <SearchBar />

            <div className="flex flex-row justify-between">
              <div className="flex flex-col ">
                <h1 className="text-4xl font-bold">15+</h1>
                <h3 className="text-xl font-light">Years of Experience</h3>
              </div>
              <div className="flex flex-col ">
                <h1 className="text-4xl font-bold">200</h1>
                <h3 className="text-xl font-light">Awards Gained</h3>
              </div>
              <div className="flex flex-col mr-0 md:mr-10">
                <h1 className="text-4xl font-bold">1200+</h1>
                <h3 className="text-xl font-light">Property Ready</h3>
              </div>
            </div>

        </div>

        <div className="w-1/2 md:flex hidden items-center justify-center relative">
          
          {/* Soft background orbs */}
          <div className="absolute w-96 right-0 h-full bg-[#eac9a8]/50 "></div>
          <div className="absolute top-20 left-10 w-28 h-28 bg-[#cb6441]/30 blur-3xl rounded-full"></div>
          <div className="absolute bottom-1/2 right-1/2 w-36 h-36 bg-[#eac9a8]/30 blur-2xl rounded-full"></div>

          {/* Main Grid Container */}
          <div className="grid grid-cols-2 gap-6 w-full max-w-xl">
            {/* Image 1 */}
            <div className="relative w-full h-52 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition">
              <Image
                src="/images/img-1.jpg"
                fill
                alt="img"
                className="object-cover hover:scale-110 transition-all duration-300"
                loading="lazy"
              />
            </div>

            {/* Image 2 — taller + stagger */}
            <div className="relative w-full h-72 mt-6 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition">
              <Image
                src="/images/img-2.jpg"
                fill
                alt="img"
                className="object-cover hover:scale-110 transition-all duration-300"
                loading="lazy"
              />
            </div>

            {/* Image 3 — taller + opposite stagger */}
            <div className="relative w-full h-72 -mt-6 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition">
              <Image
                src="/images/img-3.jpg"
                fill
                alt="img"
                className="object-cover hover:scale-110 transition-all duration-300"
                loading="lazy"
              />
            </div>

            {/* Image 4 */}
            <div className="relative w-full h-52 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition">
              <Image
                src="/images/img-4.jpg"
                fill
                alt="img"
                className="object-cover hover:scale-110 transition-all duration-300"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}