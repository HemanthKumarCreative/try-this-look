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
    <div className="space-y-6 py-8 sm:py-12">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded bg-gradient-to-br from-primary to-primary-light mb-6 animate-pulse">
          <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold mb-2">Generating...</h3>
        <p className="text-muted-foreground">
          This may take between 30 and 60 seconds
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        <div className="space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm font-bold text-primary">
                {progress}%
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Loading Steps */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded transition-all ${
                  step <= Math.floor((progress / 100) * 5) + 1
                    ? "bg-primary scale-110"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Status Message */}
          <div className="text-center p-4 bg-muted rounded">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <p className="font-medium">Processing</p>
            </div>
            <p className="text-sm text-muted-foreground animate-pulse">
              {LOADING_MESSAGES[messageIndex]}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
