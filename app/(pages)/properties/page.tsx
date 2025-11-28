import ListCard from "@/components/pages/properties/card";
import Filter from "@/components/pages/properties/filter";

export default function Properties() {
  return (
      <div className="bg-green-500/0 flex flex-row flex-1">

        {/* Left: Heading + Search + Stats */}
        <div className="w-1/2 flex-1 flex flex-col gap-12">
          <Filter />

          <ListCard />
        </div>

        {/* Right: Background + Image Grid */}
        <div className="w-1/2 lg:flex hidden items-center justify-center relative">

          {/* Soft background orbs + light Background */}
          <div className="absolute w-md right-0 h-full bg-[#eac9a8]/50 "></div>

        </div>
      </div>
  );
}