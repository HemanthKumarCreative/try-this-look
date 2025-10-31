import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Info } from "lucide-react";

interface StatusBarProps {
  message: string | null;
  variant?: "info" | "error";
}

export default function StatusBar({ message, variant = "info" }: StatusBarProps) {
  if (!message) return null;

  const isError = variant === "error";

  return (
    <div className="w-full">
      <Alert className={`rounded-md border p-3 sm:p-4 transition-colors duration-200 ${
        isError 
          ? "bg-error/10 border-error/30 text-error" 
          : "bg-primary/10 border-primary/30 text-primary"
      }`}>
        <div className="flex items-start sm:items-center gap-2 sm:gap-3">
          {isError ? (
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5 sm:mt-0 text-error" aria-hidden="true" />
          ) : (
            <Info className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5 sm:mt-0 text-primary" aria-hidden="true" />
          )}
          <AlertDescription className="text-xs sm:text-sm md:text-base leading-relaxed break-words min-w-0 flex-1 font-medium">
            {message}
          </AlertDescription>
        </div>
      </Alert>
    </div>
  );
}


