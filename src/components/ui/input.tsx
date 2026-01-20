import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface InputProps extends React.ComponentProps<"input"> {
  error?: string;
  touched?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, touched, ...props }, ref) => {
    const hasError = touched && error;
    
    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            // Base styles - modern and soft
            "flex h-11 w-full rounded-xl border-2 bg-background px-4 py-2.5 text-base",
            // Placeholder and text
            "placeholder:text-muted-foreground/60 text-foreground",
            // Transitions
            "transition-all duration-200 ease-out",
            // Focus styles - soft glow
            "focus:outline-none focus:border-primary focus:bg-background focus:shadow-[0_0_0_4px_hsl(var(--primary)/0.1)]",
            // Hover
            "hover:border-primary/40 hover:bg-background",
            // Disabled
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background",
            // File input
            "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
            // Error state
            hasError && "border-destructive focus:border-destructive focus:shadow-[0_0_0_4px_hsl(var(--destructive)/0.1)]",
            // Normal border - more visible in light mode
            !hasError && "border-input shadow-sm",
            // Size for text
            "md:text-sm",
            className,
          )}
          ref={ref}
          {...props}
        />
        {hasError && (
          <div className="flex items-center gap-1.5 mt-1.5 text-destructive text-xs animate-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
