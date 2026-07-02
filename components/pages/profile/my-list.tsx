import { auth } from "@/auth";
import { getSavedPropertiesByUserId } from "@/lib/actions/properties.action";
import ListClient from "../properties/list-client";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const List = async () => {
  const session = await auth();

  // Fetch saved properties for the logged-in user
  const savedList = await getSavedPropertiesByUserId(Number(session?.user?.id));

  return (
    <div className="grid grid-cols-1 gap-8">
      {savedList.length > 0 ? (
        <ListClient list={savedList} refreshList={true} />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 py-20 px-6 text-center">
          <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 mb-5">
            <Heart className="size-8 text-primary" />
          </div>

          <h3 className="text-lg font-semibold">No Saved Properties</h3>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Save properties you&apos;re interested in so you can quickly find
            them later.
          </p>

          <Link href="/properties" className="mt-6">
            <Button variant="outline">Browse Properties</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default List;
