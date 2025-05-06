import React, { useEffect } from "react";
import Script from "next/script";

interface DojahWidgetProps {
  bvn: string;
  apiKey: string;
  appId: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

const DojahWidget = ({
  bvn,
  apiKey,
  appId,
  onSuccess,
  onError,
}: DojahWidgetProps) => {
  useEffect(() => {
    // Initialize when window is available
    if (typeof window !== "undefined") {
      const Dojah = (window as any).DojahWidget;
      if (Dojah) {
        Dojah.initialize({
          widgetId: "66fac6544c4c6929b5958116",
          appId,
          publicKey: apiKey,
          bvn,
          onSuccess: (data: any) => onSuccess?.(data),
          onError: (error: any) => onError?.(error),
        });
      }
    }
  }, [bvn, apiKey, appId, onSuccess, onError]);

  return (
    <>
      <Script
        src="https://widget.dojah.io/websdk.js"
        strategy="afterInteractive"
        defer
      />
      {/* @ts-ignore - Custom element not recognized by TS */}
      <dojah-button
        widgetId="66fac6544c4c6929b5958116"
        text="Web"
        accesskey=""
        textColor="#FFFFFF"
        backgroundColor="#3977de"
      />
    </>
  );
};

export default DojahWidget;
