import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  variant?: "default" | "simple"
}

function Input({ className, type, variant = "default", ...props }: InputProps) {
  const baseStyles = "h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs text-foreground placeholder:text-muted-foreground dark:bg-input/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm file:text-sm file:font-medium file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-foreground";

  const defaultStyles = cn(
    baseStyles,
    "file:text-foreground selection:bg-primary selection:text-primary-foreground border-input",
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    className
  );

  const simpleStyles = cn(baseStyles, className);

  return (
    <input
      type={type}
      data-slot="input"
      className={variant === "simple" ? simpleStyles : defaultStyles}
      {...props}
    />
  )
}

export { Input }
