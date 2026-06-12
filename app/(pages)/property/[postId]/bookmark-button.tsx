"use client";

import { Button } from "@/components/ui/button";
import { toggleBookmark } from "@/lib/actions/properties.action";
import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

type BookmarkButtonProps = {
  propertyId: string;
  initialSaved?: boolean;
  canBookmark: boolean;
  isLoggedIn: boolean;
};

const BookmarkButton = ({
  propertyId,
  initialSaved = false,
  canBookmark,
  isLoggedIn,
}: BookmarkButtonProps) => {
  const router = useRouter();

  const [isSaved, setIsSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const redirectToLogin = () => {
    router.push(
      `/sign-in?callbackUrl=${encodeURIComponent(`/property/${propertyId}`)}`,
    );
  };

  const handleBookmark = async () => {
    if (!isLoggedIn) {
      redirectToLogin();
      return;
    }

    if (!canBookmark) {
      toast.error("You cannot bookmark your own property");
      return;
    }

    const previousState = isSaved;

    // optimistic update
    setIsSaved((prev) => !prev);
    setLoading(true);

    try {
      const result = await toggleBookmark(propertyId);

      if (!result.success) {
        // rollback optimistic update
        setIsSaved(previousState);

        if (result.code === "UNAUTHORIZED") {
          redirectToLogin();
          return;
        }

        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    } catch (error) {
      // rollback optimistic update
      setIsSaved(previousState);

      toast.error("Failed to update bookmark");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn && !canBookmark) {
    return null;
  }

  return (
    <Button
      onClick={handleBookmark}
      disabled={loading}
      className="p-6 bg-white text-black hover:text-white"
    >
      <Bookmark
        className={`transition text-black ${isSaved ? "fill-black" : ""}`}
      />

      {isSaved ? "Saved" : "Save"}
    </Button>
  );
};

export default BookmarkButton;
