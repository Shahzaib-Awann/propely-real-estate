"use client";

import { Button } from "@/components/ui/button";
import { PropertiesMeta } from "@/lib/types/propely.type";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";


export const getVisiblePages = (current: number, total: number): (number | string)[] => {
  const pages: (number | string)[] = [];

  // Always show first page
  if (total <= 7) {
    // If pages are small, show all
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  pages.push(1);

  if (current > 3) {
    pages.push("...");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("...");
  }

  pages.push(total);

  return pages;
};


const PageNavigation = ({ meta }: { meta : PropertiesMeta }) => {
  const router = useRouter();

  /** === Page Change === */
  const handlePageChange = (newPage: number) => {
    // setPage(newPage);
};


  
  return (
    <div className="w-full flex gap-2 justify-center items-center">
      {/* <Button type="button"><ChevronLeft /></Button>
      <Button type="button"><ChevronRight /></Button> */}

      {/* Pagination */}
      {meta && meta.totalPage > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                    <Button variant="outline" disabled={meta.page === 1} onClick={() => handlePageChange(meta.page - 1)} title="Previous Page" className="inline-flex items-center justify-center w-10 p-3 bg-white/5 hover:bg-emerald-600 group rounded-full hover:w-20 cursor-pointer transition-all duration-300 overflow-hidden">
                        <span className="relative flex items-center transition-all duration-300">
                            <ArrowLeft className="text-white transition-all duration-300 group-hover:-translate-x-1" />
                            <span className="absolute left-[4px] h-[2px] w-0 bg-white rounded-full transition-all duration-300 group-hover:w-3"></span>
                        </span>
                    </Button>

                    {getVisiblePages(meta.page, meta.totalPage).map((p, index) => {
                        // Ellipsis
                        if (p === "...") {
                            return (
                                <div
                                    key={`ellipsis-${index}`}
                                    className="flex justify-center items-center w-10 text-neutral-500 select-none"
                                >
                                    ...
                                </div>
                            );
                        }

                        // Normal Page Button
                        return (
                            <Button
                                key={p}
                                onClick={() => handlePageChange(Number(p))}
                                variant={p === meta.page ? "default" : "outline"}
                                className={`inline-flex items-center justify-center w-10 p-3 ${p === meta.page ? "bg-emerald-500 border-none" : "bg-neutral-900"
                                    } group rounded-full hover:w-20 cursor-pointer transition-all duration-300 overflow-hidden`}
                            >
                                {p}
                            </Button>
                        );
                    })}

                    <Button variant="outline" disabled={meta.page === meta.totalPage} onClick={() => handlePageChange(meta.page + 1)} title="Next Page" className="inline-flex items-center justify-center w-10 p-3 bg-white/5 group rounded-full hover:w-20 cursor-pointer transition-all duration-300 overflow-hidden">
                        <span className="relative flex items-center transition-all duration-300">
                            <ArrowRight className="text-white transition-all duration-300 group-hover:translate-x-1" />
                            <span className="absolute right-[4px] h-[2px] w-0 bg-white rounded-full transition-all duration-300 group-hover:w-3"></span>
                        </span>
                    </Button>
                </div>
            )}
    </div>
  );
};

export default PageNavigation;
