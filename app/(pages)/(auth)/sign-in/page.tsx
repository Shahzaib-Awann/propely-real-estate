import SignInForm from "@/components/pages/sign-in/sign-in-form";
import { SignInFormSkeleton } from "@/components/skeletons";
import { generateSEO } from "@/lib/seo";
import Image from "next/image";
import { Suspense } from "react";

/**
 * Seo metadata for sign in page.
 */
export const metadata = generateSEO({
  title: "Sign In",
  description:
    "Sign in to your Propely account to manage listings, save properties, communicate with buyers and sellers, and access personalized real estate features.",
  path: "/sign-in",
  keywords: [
    "Propely login",
    "Propely sign in",
    "real estate account",
    "property dashboard",
    "property management",
    "user login",
  ],
});

export default async function SignIn(props: {
  searchParams?: Promise<{
    callbackUrl?: string;
    email?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const callbackUrl = searchParams?.callbackUrl || "/";
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

        {/* Right: Premium Minimal Property Panel */}
        <div className="hidden lg:flex flex-2 justify-end items-center lg:bg-side-panel h-[calc(100vh-80px)] relative overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center px-10">
            {/* HERO IMAGE */}
            <div className="relative w-85 h-100 rounded-3xl overflow-hidden shadow-2xl z-20">
              <Image
                src="https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg"
                alt="Luxury property interior"
                fill
                sizes="(min-width: 1024px) 40vw"
                className="object-cover hover:scale-105 transition-all duration-300 ease-in-out"
                priority
              />
            </div>

            {/* SUB IMAGES */}
            {[
              {
                src: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
                alt: "Luxury house exterior",
                className: "absolute top-10 left-10 w-44 h-48 z-10",
                sizes: "(min-width: 1024px) 180px",
              },
              {
                src: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
                alt: "Modern villa",
                className: "absolute bottom-10 right-10 w-40 h-48 z-10",
                sizes: "(min-width: 1024px) 160px",
              },
            ].map((img, index) => (
              <div
                key={index}
                className={`${img.className} rounded-2xl overflow-hidden shadow-lg`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes={img.sizes}
                  className="object-cover hover:scale-105 transition-all duration-300 ease-in-out"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
