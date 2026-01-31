"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ListCard from "./list-card";
import { ListPropertyInterface } from "@/lib/types/propely.type";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";
import { deletePropertyById } from "@/lib/actions/property.action";

export default function MyListClient({ list: initialList }:{ list: ListPropertyInterface[] }) {
  const [list, setList] = useState(initialList);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!pendingDeleteId || isDeleting) return;

    // backup for rollback
    const previousList = list;

    // optimistic UI
    setList((prev) => prev.filter((p) => p.id !== pendingDeleteId));
    setIsDeleting(true);

    try {

        await deletePropertyById(pendingDeleteId);

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

  return (
    <>
      {/* LIST */}
      <div className="grid gap-8">
        {list.map((item: ListPropertyInterface) => (
          <ListCard
          key={item.id}
          item={item}
          actions={{
            onEdit: true,
            onDelete: setPendingDeleteId,
            onBookmark: setPendingDeleteId,
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
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
          <Trash className="h-5 w-5 text-destructive" />
        </div>

        <DialogTitle className="text-lg font-semibold">
          Delete property?
        </DialogTitle>
      </div>
    </DialogHeader>

    {/* Body */}
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Are you sure you want to delete this property?
      </p>

      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">
          This action cannot be undone.
        </span>{" "}
        The property will be permanently removed.
      </p>
    </div>

    {/* Footer */}
    <DialogFooter className="mt-6 flex gap-2 sm:justify-end">
      <Button
        type="button"
        variant="outline"
        onClick={() => setPendingDeleteId(null)}
        className="flex w-1/2 items-center gap-2 px-5 h-12 min-w-12 rounded-none font-medium transition-colors font-lato"
      >
        Cancel
      </Button>

      <Button
        type="button"
        variant="destructive"
        onClick={confirmDelete}
        disabled={isDeleting}
        className="flex w-1/2 items-center gap-2 px-5 h-12 min-w-12 rounded-none text-primary-foreground bg-destructive/90 font-medium hover:bg-destructive transition-colors font-lato"
      >
        <Trash />
         <span className="hidden md:inline">{isDeleting ? "Deleting..." : "Delete property"}</span>
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </>
  );
}
