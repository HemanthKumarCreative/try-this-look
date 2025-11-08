import { useEffect, useState } from "react";
import { authenticatedFetch, initializeAppBridge, isEmbeddedApp } from "@/lib/appBridge";

type InitializationStatus = "idle" | "ready" | "error";

const AppBridgeInitializer = () => {
  const [status, setStatus] = useState<InitializationStatus>("idle");

  useEffect(() => {
    if (!isEmbeddedApp()) {
      setStatus("idle");
      return;
    }

    const appBridge = initializeAppBridge();
    if (!appBridge) {
      setStatus("error");
      return;
    }

    let isCurrent = true;

    const verifySession = async () => {
      try {
        const response = await authenticatedFetch("/api/admin/session", {
          method: "GET",
        });

        if (!isCurrent) {
          return;
        }

        if (!response.ok) {
          setStatus("error");
          return;
        }

        setStatus("ready");
      } catch {
        if (!isCurrent) {
          return;
        }

        setStatus("error");
      }
    };

    verifySession();

    return () => {
      isCurrent = false;
    };
  }, []);

  if (status === "error") {
    if (import.meta?.env?.MODE === "development") {
      console.warn(
        "[AppBridgeInitializer] Failed to verify embedded session. Ensure you have logged into the dev store recently."
      );
    }
  }

  return null;
};

export default AppBridgeInitializer;

