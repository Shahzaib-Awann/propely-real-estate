import React from "react";
import {
  Building2,
  Layers,
  MessageSquare,
  Cpu,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  Code2,
  Sparkles,
  Terminal,
  ArrowDownRight,
  UploadCloud,
  Map,
  Network,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateSEO } from "@/lib/seo";

/**
 * Metadata for about page.
 */
export const metadata = generateSEO({
  title: "About Propely & The Engineering Behind It",
  description:
    "Explore Propely, a modern real estate platform built by Shahzaib Awan. Learn about the architecture, technology stack, real-time messaging system, property search engine, and engineering decisions powering the platform.",

  path: "/about",

  keywords: [
    "Propely",
    "Propely real estate platform",
    "real estate marketplace",
    "property management platform",
    "real estate software",
    "real estate technology",
    "Next.js real estate project",
    "real-time property marketplace",
    "Socket.io messaging",
    "property listing platform",
    "Shahzaib Awan",
    "full stack software engineer",
    "Next.js developer",
    "TypeScript developer",
    "software architecture",
    "property search platform",
    "real estate application",
  ],
});

// Custom Github icon implemented using inline SVG
const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

// Custom LinkedIn icon implemented using inline SVG
const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function AboutPage() {
  return (
    <main className="bg-background text-foreground max-w-360 min-h-screen mx-auto flex lg:flex-row flex-col lg:px-4">
      {/* Main Structural Portfolio Architecture Column */}
      <section className="lg:flex-3 flex items-center px-6 lg:px-15">
        <div className="py-10 space-y-14 w-full">
          {/* Platform Branding Header */}
          <header className="mb-16 max-w-4xl border-b border-border pb-10">
            <div className="flex items-center gap-2 text-primary mb-4">
              <Building2 size={18} className="opacity-90" />
              <span className="text-xs md:text-sm font-lato font-bold tracking-widest uppercase">
                Platform Documentation
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-lato font-bold tracking-tight text-foreground leading-tight">
              Propely Real Estate: High-Performance Asset Ecosystem
            </h1>
            <p className="text-sm sm:text-base font-sans text-muted-foreground mt-4 leading-relaxed">
              An architectural deep dive into the engineering principles, core
              problems solved, and the developer behind the product.
            </p>
          </header>

          {/* The Structural Core Problem */}
          <article className="space-y-4 max-w-5xl">
            <div className="flex items-center gap-2 text-destructive">
              <ShieldAlert size={18} />
              <h2 className="text-xs md:text-sm font-lato font-bold uppercase tracking-wider">
                The Core Problem Statement
              </h2>
            </div>
            <p className="text-base sm:text-lg font-sans leading-relaxed text-foreground/90 font-normal">
              Modern real estate software routinely isolates platform processes.
              Traditional portals create disjointed customer journeys where
              users discover listings in one interface, filter properties using
              rigid, non-responsive backend queries, and then must move entirely
              off-platform to external messaging tools to finalize transaction
              parameters. This disconnect creates critical communication gaps,
              slows discovery velocity, and introduces security risk.
            </p>
          </article>

          {/* Strategic System Integration */}
          <article className="space-y-4 max-w-5xl">
            <div className="flex items-center gap-2 text-primary">
              <ArrowDownRight size={18} />
              <h2 className="text-xs md:text-sm font-lato font-bold uppercase tracking-wider">
                The Propely Strategy
              </h2>
            </div>
            <p className="text-base sm:text-base font-sans leading-relaxed text-muted-foreground">
              Propely breaks down this siloed architecture by merging property
              lookup engines and multi-client messaging interfaces into a single
              workspace layer. By keeping application states completely
              synchronized in real time, the platform scales across both desktop
              real estate layouts and mobile interfaces seamlessly—eliminating
              performance friction and ensuring transaction contexts are
              preserved.
            </p>
          </article>

          {/* Product Feature Matrices */}
          <div className="space-y-6">
            <h2 className="text-xs md:text-sm font-lato font-bold uppercase tracking-wider text-muted-foreground/80">
              Integrated Technical Feature Suite
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: Layers,
                  title: "Responsive Grid Filter Engine",
                  description:
                    "A context-aware query capsule that dynamically displays on-page forms on desktop interfaces and transitions to intuitive sliding bottom trays on touch/mobile viewports for instant property categorization.",
                },
                {
                  icon: MessageSquare,
                  title: "Asymmetric Messaging Streams",
                  description:
                    "High-fidelity minimalist chat bubbles using asymmetric alignment rules (`rounded-br-xs` vs `rounded-bl-xs`), keeping the canvas clean while placing status badges on tracking baselines.",
                },
                {
                  icon: Network,
                  title: "Isolated Socket Room Clusters",
                  description:
                    "Low-latency communication layers utilizing custom Socket.io client rooms to isolate live tenant-broker negotiation threads, preventing packet cross-contamination over the transport medium.",
                },
                {
                  icon: UploadCloud,
                  title: "Asynchronous Media Pipelines",
                  description:
                    "Seamless integrations with the native Cloudinary Upload Widget, handling asynchronous multi-image uploads for listing portfolios and profile photography with dynamic cloud optimization.",
                },
                {
                  icon: Map,
                  title: "Geospatial Leaflet Interactivity",
                  description:
                    "Interactive layout mapping running lightweight Leaflet coordinate instances to anchor properties, render custom marker pins, and visualize precise geographic locations smoothly.",
                },
                {
                  icon: CheckCircle2,
                  title: "Multi-Batch Logical Deletion",
                  description:
                    "Advanced multi-message selection arrays hooked to optimized backends. Executes safe, high-speed single or compound database entry removals without degrading stream performance.",
                },
              ].map(({ icon: Icon, title, description }, index) => (
                <div
                  key={index}
                  className="p-6 group shadow-sm border border-border/60 rounded-xl space-y-3.5 hover:border-border transition-all duration-300"
                >
                  <div className="size-9 rounded-lg group-hover:bg-primary group-hover:text-white bg-primary/10 flex items-center justify-center text-primary transition-all duration-500">
                    <Icon size={18} />
                  </div>

                  <h3 className="font-lato font-bold text-base sm:text-lg text-foreground">
                    {title}
                  </h3>

                  <p className="text-sm font-sans text-muted-foreground/90 leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Full-Stack Technical Architecture */}
          <div className="space-y-5">
            <h2 className="text-xs md:text-sm font-lato font-bold uppercase tracking-wider text-muted-foreground/80">
              The Engineering Ecosystem Spec
            </h2>
            <div className="p-6 border border-border rounded-xl bg-muted/10 space-y-5">
              <div className="flex items-center gap-3">
                <Cpu className="text-primary size-6 shrink-0" />
                <div>
                  <h4 className="text-sm font-lato font-bold text-foreground">
                    Type-Safe Production Pipeline
                  </h4>
                  <p className="text-sm text-muted-foreground/90 mt-0.5">
                    Rigorous full-stack layer handling asset indexing, stream
                    sockets, and reliable TCP tracking maps
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2.5 pt-1">
                {[
                  "Next.js 16",
                  "React 19",
                  "TypeScript",
                  "Tailwind CSS 4",
                  "Drizzle ORM",
                  "MySQL",
                  "NextAuth.js",
                  "Socket.io",
                  "Cloudinary",
                  "React Leaflet",
                  "React Hook Form",
                  "Lexical Editor",
                  "Zod",
                  "Zustand",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 text-[11px] font-mono font-bold bg-background border border-border/80 rounded-md shadow-3xs text-foreground/90"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Side Profile Structural Column */}
      <aside className="lg:flex-2 w-full bg-side-panel flex flex-col items-center justify-start p-6 lg:p-10">
        <div className="space-y-10 w-full">
          {/* Detailed Biography and Identity Card */}
          <div className="border border-border/80 bg-background dark:bg-muted/5 rounded-xl p-6 sm:p-8 space-y-8 shadow-xs">
            {/* Profile Graphic Elements Header */}
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-28 w-28 ring-4 ring-primary/10 shadow-md">
                <AvatarImage
                  src="https://avatars.githubusercontent.com/u/135974922?v=4"
                  alt="Shahzaib Awan"
                  loading="eager"
                />
                <AvatarFallback className="bg-primary text-primary-foreground font-lato text-3xl font-bold tracking-wider">
                  SA
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1.5">
                <h3 className="font-lato font-bold text-xl sm:text-2xl text-foreground tracking-tight">
                  Shahzaib Awan
                </h3>
                <p className="text-xs sm:text-sm font-sans font-bold text-primary tracking-widest uppercase">
                  Full-Stack Software Engineer
                </p>
              </div>
            </div>

            <hr className="border-t border-border/60" />

            {/* In-Depth Developer Overview Text Layer */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 text-foreground">
                <Code2 size={18} className="text-primary shrink-0" />
                <h4 className="text-sm font-lato font-bold uppercase tracking-wider">
                  About Me
                </h4>
              </div>
              <p className="text-sm font-sans text-muted-foreground leading-relaxed font-normal">
                I am a passionate Full-Stack Developer specializing in crafting
                high-performance, real-time web architectures and beautifully
                polished user interfaces. My engineering focus centers around
                maximizing server hydration speed, configuring clean and
                maintainable relational database schemas, and building fluid
                user experiences modeled after the design principles of{" "}
                <strong>Quiet Luxury</strong>.
              </p>
              <p className="text-sm font-sans text-muted-foreground leading-relaxed font-normal">
                As the sole engineer behind Propely Real Estate, I managed the
                full lifecycle of the platform—from implementing
                performance-tuned logic for Drizzle ORM arrays down to polishing
                custom layout tokens, interactive states, and sub-second
                messaging systems.
              </p>
            </div>

            <hr className="border-t border-border/60" />

            {/* Core Tech Stack Competencies Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 text-foreground">
                <Terminal size={18} className="text-primary shrink-0" />
                <h4 className="text-sm font-lato font-bold uppercase tracking-wider">
                  Core Expertise
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Full-Stack Architecture",
                  "Next.js Applications",
                  "Database Design",
                  "Drizzle ORM",
                  "Real-Time Messaging",
                  "API Development",
                  "Authentication & RBAC",
                  "TypeScript",
                  "Performance Optimization",
                  "Responsive UI Systems",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 text-xs font-medium bg-muted/40 border border-border rounded-md text-foreground/80 shadow-3xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <hr className="border-t border-border/60" />

            {/* Legible External Portals Hub */}
            <div className="space-y-4">
              <h4 className="text-sm font-lato font-bold text-muted-foreground/80 tracking-wider uppercase ml-0.5">
                Developer Network Channels
              </h4>

              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    title: "Official Portfolio Hub",
                    href: "https://shahzaibawan.site/",
                    indicator: true,
                    domain: "shahzaibawan.site",
                  },
                  {
                    title: "GitHub Workspace",
                    href: "https://github.com/shahzaib-awann/",
                    Icon: GitHubIcon,
                  },
                  {
                    title: "LinkedIn Connection",
                    href: "https://www.linkedin.com/in/shahzaib-awann/",
                    Icon: LinkedInIcon,
                  },
                ].map(({ title, href, Icon, indicator, domain }) => (
                  <a
                    key={title}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-4 py-3 bg-muted/10 border border-border/80 rounded-lg group hover:border-primary hover:bg-muted/20 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 text-sm font-semibold text-foreground/90 group-hover:text-foreground">
                      {indicator ? (
                        <div className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      ) : (
                        Icon && (
                          <Icon className="size-4 text-muted-foreground/90 group-hover:text-primary" />
                        )
                      )}
                      <span className="text-sm">{title}</span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:text-sm font-mono text-muted-foreground group-hover:text-primary transition-colors">
                      {domain && (
                        <span className="hidden sm:inline text-xs">
                          {domain}
                        </span>
                      )}
                      <ExternalLink size={14} />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Cohesive Engineering Philosophy Highlight Block */}
          <div className="bg-primary/10 dark:bg-primary/10 border border-primary/20 rounded-xl p-6 space-y-3 shadow-3xs">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles size={16} />
              <h4 className="text-sm font-lato font-bold uppercase tracking-wider">
                Design Philosophy
              </h4>
            </div>
            <p className="text-sm sm:text-base text-foreground/80 leading-relaxed italic font-medium">
              &quot;Code should be as clean and invisible as the architecture it
              builds. True optimization is found by eliminating visual and
              mechanical bloat.&quot;
            </p>
          </div>
        </div>
      </aside>
    </main>
  );
}
