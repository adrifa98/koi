"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement) => void;
      };
    };
  }
}

export default function TwitterTimeline() {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const loadTwitterScript = () => {
      if (window.twttr && window.twttr.widgets) {
        if (containerRef.current) {
          window.twttr.widgets.load(containerRef.current);
        }
      } else {
        const script = document.createElement("script");
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        script.onload = () => {
          if (window.twttr && window.twttr.widgets && containerRef.current) {
            window.twttr.widgets.load(containerRef.current);
          }
        };
        document.body.appendChild(script);
      }
    };

    loadTwitterScript();
  }, [theme, mounted]);

  if (!mounted) return null; // Evita el desajuste entre SSR y cliente

  return (
    <div className="flex justify-center mt-4 w-full">
      <div
        className={`relative w-full max-w-[600px] rounded-lg overflow-auto scrollbar ${
          theme === "dark" ? "dark-scroll" : "light-scroll"
        }`}
        style={{
          height: "1100px",
        }}
      >
        <div ref={containerRef} className="relative">
          <a
            className="twitter-timeline"
            data-height="1100"
            data-width="100%"
            data-theme={theme === "dark" ? "dark" : "light"}
            href="https://twitter.com/MovistarKOI?ref_src=twsrc%5Etfw"
          >
          </a>
        </div>
      </div>
    </div>
  );
}
