import ListCard from "@/components/pages/properties/list-card";
import Filter from "@/components/pages/properties/filter";
import { listData } from "@/lib/dummyData";
import MapWrapper from "@/components/ui/map-wrapper";

export default function Properties() {
  return (
    <main className="flex flex-row flex-1 bg-transparent">

      {/* Left: Filters + List */}
      <section className="flex-1 w-full flex flex-col gap-10 pr-2 md:pr-10 overflow-y-scroll max-h-[calc(100vh-100px)] pb-12 scroll-smooth">
        
        {/* Filter Component */}
        <Filter />

        {/* Property List */}
        <div className="grid grid-cols-1 gap-8">
          {listData.map((item) => (
            <ListCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Right Sidebar Background (Desktop Only) */}
      <aside className="hidden lg:flex w-md items-center justify-center relative h-calc(100vh-100px)">
        
        {/* Soft background panel */}
        <div className="absolute right-0 h-full w-md bg-[#eac9a8]/50"></div>

          <MapWrapper />
      </aside>
    </main>
  );
}