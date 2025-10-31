import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, Sparkles } from "lucide-react";
import { LOADING_MESSAGES } from "@/types/tryon";
import { useEffect, useState } from "react";

interface GenerationProgressProps {
  progress: number;
  isGenerating: boolean;
}

export default function GenerationProgress({
  progress,
  isGenerating,
}: GenerationProgressProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6 py-6 sm:py-8 md:py-12">
      <div className="text-center px-2 sm:px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary to-primary-light mb-4 sm:mb-5 md:mb-6 animate-pulse shadow-lg">
          <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary-foreground" />
        </div>
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 text-foreground">Generating...</h3>
        <p className="text-sm sm:text-base text-muted-foreground px-2">
          This may take between 30 and 60 seconds
        </p>
      </div>

      <Card className="p-4 sm:p-5 md:p-6 lg:p-8">
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2 gap-2">
              <span className="text-xs sm:text-sm font-medium">Progress</span>
              <span className="text-xs sm:text-sm md:text-base font-bold text-primary">
                {progress}%
              </span>
            </div>
            <Progress value={progress} className="h-2 sm:h-3" />
          </div>

          {/* Loading Steps */}
          <div className="flex justify-center gap-1.5 sm:gap-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded transition-all ${
                  step <= Math.floor((progress / 100) * 5) + 1
                    ? "bg-primary scale-110 shadow-sm"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Status Message */}
          <div className="text-center p-3 sm:p-4 bg-muted rounded">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-primary flex-shrink-0" />
              <p className="font-medium text-sm sm:text-base">Processing</p>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground animate-pulse px-2">
              {LOADING_MESSAGES[messageIndex]}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
