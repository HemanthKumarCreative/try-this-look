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
    <div className="">
      <Alert className={`rounded-md border-0 ${isError ? "bg-red-50 text-red-800" : "bg-blue-50 text-blue-800"}`}>
        <div className="flex items-center gap-2">
          {isError ? (
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Info className="h-4 w-4" aria-hidden="true" />
          )}
          <AlertDescription className="text-sm">
            {message}
          </AlertDescription>
        </div>
      </Alert>
    </div>
  );
}


