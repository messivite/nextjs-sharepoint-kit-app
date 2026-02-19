"use client";

import dynamic from "next/dynamic";

const AppShell = dynamic(() => import("./app-shell"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          border: "3px solid #ccc",
          borderTopColor: "#3b82f6",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  ),
});

export default function DynamicAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
