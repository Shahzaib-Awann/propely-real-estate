import { auth } from "@/auth";
import UpdateUserAvatar from "@/components/pages/profile/update/update-user-avatar";
import UpdateUserInfo from "@/components/pages/profile/update/update-user-info";
import { getUserById } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import React from "react";

const UpdateProfilePage = async () => {
  
  // === Authenticate user ===
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  // === Fetch user by ID (safe mode) ===
  const user = await getUserById(Number(session.user.id))

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <main className="flex flex-col-reverse lg:flex-row h-[calc(100vh-80px)] px-4 overflow-y-auto lg:overflow-y-hidden scroll-smooth">
      {/* LEFT: User Info Form */}
      <section className="flex-3 lg:h-full">
        <div className="flex flex-col gap-10 py-5 pr-0 pb-12 lg:pr-10 overflow-y-visible lg:overflow-y-auto h-auto lg:h-full">
          <UpdateUserInfo info={user} />
        </div>
      </section>

      {/* RIGHT: User Avatar Panel */}
      <aside className="flex flex-2 h-full bg-side-panel pb-5 lg:pb-0 lg:py-5 rounded-lg lg:rounded-none">
        <div className="p-4 flex h-full w-full">
          <UpdateUserAvatar avatar={user.avatar} />
        </div>
      </aside>
    </main>
  );
};

export default UpdateProfilePage;
