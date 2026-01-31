import { auth } from "@/auth";
import PropertyForm from "@/components/pages/property/property-form";
import { getPostByIdForEdit } from "@/lib/actions/property.action";
import { redirect } from "next/navigation";


/**
 * Edit Property Page (Server Component)
 */
export default async function EditPropertyPage({ params }: { params: Promise<{ postId: string }> }) {

  const { postId } = await params;

  // === Authenticate user ===
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/sign-in")
  }

  // 404 if post Id not Valid
  if (!postId) {
    redirect('/properties');
  }


  //=== Fetch Property for Edit ===
  const property = await getPostByIdForEdit(postId, Number(userId));

  // Show fallback if property is not found
  if (!property) {
    return <div> Property Not Found </div>
  }

  return(
    <main className="flex flex-col-reverse lg:flex-row h-[calc(100vh-80px)] px-4 overflow-y-auto lg:overflow-y-hidden scroll-smooth">
      <PropertyForm mode='edit' property={property} />
    </main>
  )
}