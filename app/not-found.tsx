import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="bg-background text-foreground max-w-340 min-h-screen mx-auto flex px-4">
      {/* Left Section */}
      <section className="flex-3 flex items-center px-6 lg:px-16">
        <div className="max-w-2xl">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            404 • Page Not Found
          </span>

          <h1 className="mt-6 font-lato text-5xl lg:text-7xl font-bold leading-tight">
            This Property
            <br />
            Doesn&apos;t Exist.
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
            The property may have been removed, the URL might be incorrect,
            or you don&apos;t have permission to view it.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              <Home size={18} />
              Browse Properties
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 transition hover:bg-muted"
            >
              <ArrowLeft size={18} />
              Return Home
            </Link>
          </div>
        </div>
      </section>

      {/* Right Section */}
      <section className="hidden group lg:flex flex-2 bg-side-panel items-center justify-center p-10">
        <div className="relative w-full max-w-lg aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
          <Image
            src="/images/img-3.jpg"
            alt="Luxury property"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 0px"
            className="object-cover group-hover:scale-110 transition-all duration-300"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Floating Card */}
          <div className="absolute bottom-8 left-8 right-8 rounded-2xl bg-background/90 backdrop-blur-md p-6 shadow-lg">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold">
              Property Unavailable
            </p>

            <h2 className="mt-2 font-lato text-2xl font-bold">
              Looking for something else?
            </h2>

            <p className="mt-3 text-sm text-muted-foreground">
              Explore hundreds of verified listings and discover your next home.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}