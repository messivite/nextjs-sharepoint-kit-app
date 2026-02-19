"use client";

import { useState, useEffect } from "react";

export function ClientDate({
  dateString,
  options = {},
}: {
  dateString: string;
  options?: Intl.DateTimeFormatOptions;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span>—</span>;
  }

  return (
    <span suppressHydrationWarning>
      {new Date(dateString).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        ...options,
      })}
    </span>
  );
}
