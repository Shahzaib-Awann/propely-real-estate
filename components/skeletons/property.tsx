import { Skeleton } from "@/components/ui/skeleton";

export function PropertyFormSkeleton() {
  return (
    <>
      {/* LEFT: Form Skeleton */}
      <section className="flex-3 lg:h-full">
        <div className="flex flex-col gap-10 py-5 pr-0 pb-12 lg:pr-10 overflow-y-visible lg:overflow-y-auto h-auto lg:h-full">
          <Skeleton className="h-8 w-64" />

          <div className="space-y-8">
            {/* Title + Price + Size */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>

            {/* Description */}
            <div className="border p-4 relative">
              <Skeleton className="absolute -top-3 left-4 h-6 w-24" />
              <Skeleton className="h-72 w-full" />
            </div>

            {/* Address + City + State */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>

            {/* Bedrooms + Bathrooms + Property */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>

            {/* Lat + Lng + Listing */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>

            {/* Policies */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>

            {/* Distances */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>

            {/* Features */}
            <div className="pt-8 space-y-4 border p-4 relative">
              <Skeleton className="absolute -top-3 left-4 h-6 w-24" />
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-2 items-end">
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                </div>
              ))}
              <Skeleton className="h-10 w-32" />
            </div>

            {/* Submit */}
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
      </section>

      {/* RIGHT: Images Skeleton */}
      <aside className="flex flex-2 h-full bg-side-panel pb-5 lg:pb-0 lg:py-5 rounded-lg lg:rounded-none">
        <div className="p-4 flex flex-col gap-4 h-full w-full">
          <div className="my-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 max-h-[70dvh] overflow-y-auto pr-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="w-full aspect-video rounded border"
                />
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <Skeleton className="h-12 w-48" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}