import SignUpForm from "@/components/pages/sign-up/sign-up-form";
import { generateSEO } from "@/lib/seo";
import Image from "next/image";

/**
 * Metadata for sign up page.
 */
export const metadata = generateSEO({
  title: "Sign Up",
  description:
    "Join Propely to list properties, connect with buyers and sellers, and access premium real estate features. Create your account today.",
  path: "/sign-up",
  keywords: [
    "Propely signup",
    "create account",
    "real estate account",
    "property marketplace",
    "user registration",
  ],
});

export default function SignUp() {
  return (
    <div className="bg-background text-foreground max-w-340 min-h-[calc(100vh-80px)] mx-auto flex flex-col">
      {/* Main Content Section  */}
      <div className="flex flex-row flex-1 px-4">
        {/* Left: Heading + Sign-Up Form */}
        <div className="flex-3 flex flex-col justify-center gap-10">
          <h1 className="text-3xl text-center font-medium">Sign Up</h1>
          <SignUpForm />
        </div>

        {/* Right: Premium Aspirational Property Panel */}
        <div className="hidden lg:flex flex-2 justify-end items-center lg:bg-side-panel h-[calc(100vh-80px)] relative overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center px-10">
            {/* HERO IMAGE */}
            <div className="relative w-85 h-100 rounded-3xl overflow-hidden shadow-xl z-20 border border-black/5">
              <Image
                src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
                alt="Luxury modern home with warm lighting"
                fill
                sizes="(min-width: 1024px) 40vw"
                className="object-cover hover:scale-105 transition-all duration-300 ease-in-out"
                priority
              />
            </div>

            {/* SUB IMAGES */}
            {[
              {
                src: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
                alt: "Modern glass luxury architecture",
                className: "absolute top-16 right-10 w-44 h-52 z-10",
                sizes: "(min-width: 1024px) 180px",
              },
              {
                src: "https://images.pexels.com/photos/21297784/pexels-photo-21297784.jpeg",
                alt: "Luxury modern living room interior",
                className: "absolute bottom-16 left-10 w-44 h-52 z-10",
                sizes: "(min-width: 1024px) 160px",
              },
            ].map((img, index) => (
              <div
                key={index}
                className={`${img.className} rounded-2xl overflow-hidden shadow-md border border-black/5`}
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
