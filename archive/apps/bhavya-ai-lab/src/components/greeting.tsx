"use client";

import { useState, useEffect } from "react";

export function Greeting() {
  const [greeting, setGreeting] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hour = now.getHours();
      if (hour < 12) setGreeting("Good Morning");
      else if (hour < 17) setGreeting("Good Afternoon");
      else setGreeting("Good Evening");

      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      );
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 600,
          color: "#fafafa",
          letterSpacing: "-0.02em",
        }}
      >
        {greeting}
      </div>
      <div
        style={{
          fontSize: 14,
          color: "#71717a",
          marginTop: 4,
          fontFamily: "monospace",
        }}
      >
        {time} IST
      </div>
    </div>
  );
}
