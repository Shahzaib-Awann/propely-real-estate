import { redirect } from "next/navigation";


/**
 * Edit Property Page (Server Component)
 */
export default async function EditPropertyPage({ params }: { params: Promise<{ postId: string }> }) {

  const { postId } = await params;

  // 404 if post Id not Valid
  if (!postId || isNaN(Number(postId))) {
    redirect('/properties');
  }

  return(
    <div>Edit Property Id: {postId}</div>
  )
}