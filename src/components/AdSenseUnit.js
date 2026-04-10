"use client";

import { useEffect, useRef } from "react";

export default function AdSenseUnit() {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    try {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      if (err.message && err.message.includes("already have ads")) {
        // Ignore the strict mode duplicate push error
        return;
      }
      console.error("AdSense Unit Error:", err);
    }
  }, []);

  return (
    <div className="w-full overflow-hidden my-12 flex justify-center py-4 bg-muted/5 rounded-[2rem] border border-border/50">
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", minHeight: "100px" }}
        data-ad-client="ca-pub-5290024709923218"
        data-ad-slot="8505635119"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
