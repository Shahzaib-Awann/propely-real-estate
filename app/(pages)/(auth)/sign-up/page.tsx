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

        {/* Right: Background + Image Grid */}
        <div className="hidden lg:flex flex-2 justify-end items-center gap-4 lg:bg-side-panel p-0 h-[calc(100vh-80px)]">

          {/* Wrapper */}
          <div className="w-full h-auto px-6 py-5">
            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-6 w-full max-w-xl">
              {[
                { src: "/images/img-1.jpg", alt: "Modern luxury residential property", className: "relative w-full xl:w-full h-52 xl:left-0 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-all duration-200" },
                { src: "/images/img-2.jpg", alt: "Beautiful coastal home with ocean view", className: "relative w-full xl:w-full h-72 mt-6 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-all duration-200" },
                { src: "/images/img-3.jpg", alt: "Spacious urban apartment with city views", className: "relative w-full xl:w-full h-72 -mt-6 xl:left-0 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-all duration-200" },
                { src: "/images/img-4.jpg", alt: "Elegant suburban house with garden", className: "relative w-full xl:w-full h-52 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-all duration-200" },
              ].map((img, idx) => (
                <div
                  key={idx}
                  className={img.className}
                >
                  <Image
                    src={img.src}
                    fill
                    alt={img.alt}
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