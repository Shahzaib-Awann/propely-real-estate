export default function SignInFormSkeleton() {
    return (
      <div className="max-w-80 w-full mx-auto animate-pulse">
        {/* Email */}
        <div className="space-y-2 mb-6">
          <div className="h-4 w-24 bg-muted rounded mb-3" />
          <div className="h-14 w-full bg-muted rounded" />
        </div>
  
        {/* Password */}
        <div className="space-y-2 mb-6">
          <div className="h-4 w-24 bg-muted rounded mb-3" />
          <div className="h-14 w-full bg-muted rounded" />
        </div>
  
        {/* Submit button */}
        <div className="h-14 w-full rounded bg-primary/20 mb-8" />
  
        {/* Sign up link */}
        <div className="h-3 w-40 bg-muted-foreground/20 rounded mx-auto" />
      </div>
    );
  }