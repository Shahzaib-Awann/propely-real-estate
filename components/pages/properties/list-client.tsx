"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ListCard from "./list-card";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";
import { deletePropertyById } from "@/lib/actions/property.action";
import { toggleBookmark } from "@/lib/actions/properties.action";
import { useRouter } from "next/navigation";
import { ListPropertyInterface } from "@/types/propely.type";

export default function ListClient({
  list: initialList,
  refreshList,
}: {
  list: ListPropertyInterface[];
  refreshList?: boolean;
}) {
  const [list, setList] = useState(initialList);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  const confirmDelete = async () => {
    if (!pendingDeleteId || isDeleting) return;

    // backup for rollback
    const previousList = list;

    // optimistic UI
    setIsDeleting(true);

    try {
      await deletePropertyById(pendingDeleteId);
      setList((prev) => prev.filter((p) => p.id !== pendingDeleteId));

      toast.success("Property deleted successfully");
    } catch (error: unknown) {
      // rollback UI
      setList(previousList);

      // error normalization
      if (error instanceof Error) {
        // Known server / runtime error
        toast.error(error.message || "Failed to delete property");
      } else {
        // Truly unknown error
        toast.error("Something went wrong. Please try again.");
      }

      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
      setPendingDeleteId(null);
    }
  };

  const handleBookmark = async (id: string) => {
    const previousList = list;

    // optimistic UI
    setList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isSaved: !item.isSaved } : item,
      ),
    );

    try {
      const result = await toggleBookmark(id);

      if (!result.success) {
        // rollback
        setList(previousList);

        if (result.code === "UNAUTHORIZED") {
          router.push(
            `/sign-in?callbackUrl=${encodeURIComponent(`/property/${id}`)}`,
          );
          return;
        }

        toast.error(result.message);
        return;
      }

      if (refreshList) {
        setList((prev) => prev.filter((p) => p.id !== id));
      }

      toast.success(result.message);
    } catch (error) {
      // rollback
      setList(previousList);

      toast.error("Failed to update bookmark");
      console.error(error);
    }
  };

  return (
    <>
      {/* LIST */}
      <div className="grid gap-8">
        {list.map((item: ListPropertyInterface) => (
          <ListCard
            key={item.id}
            item={item}
            actions={{
              onDelete: setPendingDeleteId,
              onBookmark: handleBookmark,
            }}
          />
        ))}
      </div>

      {/* CONFIRM DELETE DIALOG */}
      <Dialog
        open={!!pendingDeleteId}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteId(null);
        }}
      >
        <DialogContent className="max-w-md">
          {/* Header */}
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/10">
                <Trash className="h-5 w-5 text-destructive" />
              </div>

              <DialogTitle className="text-lg font-semibold leading-none">
                Confirm Deletion
              </DialogTitle>
            </div>

            <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
              Are you sure you want to <strong>delete this property?</strong>{" "}
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {/* Footer */}
          <DialogFooter className="mt-6 flex gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPendingDeleteId(null)}
              className="flex w-1/2 items-center justify-center h-12 rounded-none font-medium font-lato"
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="flex w-1/2 items-center justify-center gap-2 h-12 rounded-none font-medium font-lato"
            >
              <Trash className="h-4 w-4" />
              <span>{isDeleting ? "Deleting…" : "Delete Property"}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
