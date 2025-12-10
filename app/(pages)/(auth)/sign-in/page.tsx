import SignInForm from "@/components/pages/sign-in/sign-in-form";
import SignInFormSkeleton from "@/components/skeletons";
import Image from "next/image";
import { Suspense } from "react";

export default async function SignIn(props: {
  searchParams?: Promise<{
    callbackUrl?: string;
    email?: string;
  }>;
}) {

  const searchParams = await props.searchParams;
  const callbackUrl = searchParams?.callbackUrl || '/';
  const email = searchParams?.email ?? undefined;

  return (
    <div className="bg-background text-foreground max-w-340 min-h-[calc(100vh-80px)] mx-auto flex flex-col">

      {/* Main Content Section  */}
      <div className="flex flex-row flex-1 px-4">

        {/* Left: Heading + Sign-in Form*/}
        <div className="flex-3 flex flex-col justify-center gap-10">

          <h1 className="text-3xl text-center font-medium">Sign In</h1>
          
          <Suspense key={callbackUrl} fallback={<SignInFormSkeleton />}>
            <SignInForm callbackUrl={callbackUrl} email={email} />
          </Suspense>

        </div>

        {/* Right: Background + Image Grid */}
        <div className="hidden lg:flex flex-2 justify-end items-center gap-4 lg:bg-side-panel p-0 h-[calc(100vh-80px)]">

          {/* Wrapper */}
          <div className="w-full h-auto px-6 py-5">
            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-6 w-full max-w-xl">
              {[
                { src: "/images/img-1.jpg", className: "relative w-full xl:w-full h-52 xl:left-0 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-all duration-200" },
                { src: "/images/img-2.jpg", className: "relative w-full xl:w-full h-72 mt-6 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-all duration-200" },
                { src: "/images/img-3.jpg", className: "relative w-full xl:w-full h-72 -mt-6 xl:left-0 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-all duration-200" },
                { src: "/images/img-4.jpg", className: "relative w-full xl:w-full h-52 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-all duration-200" },
              ].map((img, idx) => (
                <div
                  key={idx}
                  className={img.className}
                >
                  <Image
                    src={img.src}
                    fill
                    alt={`img-${idx + 1}`}
                    sizes="(max-width: 1000px) 0px, 50vw"
                    className="object-cover hover:scale-110 transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}