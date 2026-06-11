"use client";

import { Button } from "@/components/ui/button";
import { toggleBookmark } from "@/lib/actions/properties.action";
import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

// ⚠️ assume this is your API function
// import { toggleBookmark } from "@/lib/actions/bookmark.action";

type BookmarkButtonProps = {
  propertyId: string;
  initialSaved?: boolean;
  canBookmark: boolean;
};

const BookmarkButton = ({
  propertyId,
  initialSaved = false,
  canBookmark
}: BookmarkButtonProps) => {
  const router = useRouter();

  const [isSaved, setIsSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const handleBookmark = async () => {
    if(!canBookmark) return;

    const previousState = isSaved;

    // optimistic update
    setIsSaved((prev) => !prev);
    setLoading(true);

    try {
      const result = await toggleBookmark(propertyId);

      toast.success(result?.message || "Updated bookmark");
    } catch (error: any) {
      // rollback
      setIsSaved(previousState);

      if (error?.message === "Unauthorized access") {
        router.push("/sign-in");
        return;
      }

      toast.error("Failed to update bookmark");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if(!canBookmark) return null

  return (
    <Button
      onClick={handleBookmark}
      disabled={loading}
      className="p-6 bg-white text-black hover:text-white"
    >
      <Bookmark
        className={`transition text-black ${
          isSaved ? "fill-black" : ""
        }`}
      />

      {isSaved ? "Saved" : "Save"}
    </Button>
  );
};

export default BookmarkButton;