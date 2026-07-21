"use client";

import { useEffect, useState } from "react";

export default function Clock() {
  const [time, setTime] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);

  useEffect(() => {
    function tick() {
      const now = new Date();
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now)
      );

      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        weekday: "long",
      }).formatToParts(now);
      const get = (type: string) => parts.find((p) => p.type === type)?.value || "";
      setDate(`${get("day")}-${get("month")}-${get("year")} | ${get("weekday")}`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  return (
    <div className="ist-clock">
      <span className="ist-clock-time">{time}</span>
      <span className="ist-clock-label">{date}</span>
    </div>
  );
}
