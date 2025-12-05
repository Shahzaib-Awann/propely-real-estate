import ListCard from "@/components/pages/properties/list-card";
import Filter from "@/components/pages/properties/filter";
import { listData } from "@/lib/dummyData";
import MapWrapper from "@/components/map/map-wrapper";

export default function Properties() {
  return (
    <main className="flex flex-row h-[calc(100vh-80px)] px-4">

      {/* LEFT: Filters + Property List */}
      <section className="flex-3 h-full overflow-hidden">

        {/* Scrollable Content Wrapper */}
        <div className="h-full flex flex-col gap-10 pr-4 lg:pr-10 py-5 overflow-y-scroll pb-12">

          {/* Filter Component */}
          <Filter />

          {/* Properties List */}
          <div className="grid grid-cols-1 gap-8">
            {listData.map((item) => (
              <ListCard key={item.id} item={item} />
            ))}
          </div>

        </div>
      </section>

      {/* RIGHT: Map Display (Desktop Only) */}
      <aside className="hidden lg:block flex-2 h-full bg-side-panel py-5">

        {/* Interactive Map */}
        <MapWrapper items={listData} className="rounded-lg" />

      </aside>
    </main>
  );
}