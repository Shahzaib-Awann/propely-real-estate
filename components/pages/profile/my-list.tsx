import { auth } from "@/auth";
import { getSavedPropertiesByUserId } from "@/lib/actions/properties.action";
import ListClient from "../properties/list-client";

const List = async () => {
  const session = await auth();

  // Fetch saved properties for the logged-in user
  const savedList = await getSavedPropertiesByUserId(Number(session?.user?.id));

  return (
    <div className="grid grid-cols-1 gap-8">

      {/* Client component responsible for interactive list rendering */}
      <ListClient list={savedList} refreshList={true} />
    </div>
  );
};

export default List;
