import * as React from "react"
import { cn } from "@/lib/utils/general"

interface InputProps extends React.ComponentProps<"input"> {
  variant?: "default" | "simple" | "primary" | "unstyled"
}

function Input({ className, type, variant = "default", ...props }: InputProps) {
  const baseStyles =
    "h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs text-foreground placeholder:text-muted-foreground dark:bg-input/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm file:text-sm file:font-medium file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-foreground"

  const defaultStyles = cn(
    baseStyles,
    "file:text-foreground selection:bg-primary selection:text-primary-foreground border-input",
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    className
  )

  const simpleStyles = cn(baseStyles, className)

  const primaryStyles = cn(
    baseStyles,
    "border-input",
    "focus-visible:border-primary rounded-none",
    "focus-visible:ring-0",
    "focus-visible:outline-none",
    className
  )

  // --- NEW VARIANT: UNSTYLED ---
  const unstyledStyles = cn(
    "bg-transparent border-0 outline-none shadow-none p-0 m-0 focus-visible:outline-none focus-visible:ring-0",
    className
  )

  return (
    <input
      type={type}
      data-slot="input"
      className={
        variant === "unstyled"
          ? unstyledStyles
          : variant === "simple"
          ? simpleStyles
          : variant === "primary"
          ? primaryStyles
          : defaultStyles
      }
      {...props}
    />
  )
}

export { Input }
