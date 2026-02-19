import type { Metadata } from "next";
import "./globals.css";
import DynamicAppShell from "./dynamic-app-shell";

export const metadata: Metadata = {
  title: "My SharePoint App",
  description: "SharePoint integration demo using @mustafaaksoy41/sharepoint-kit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <DynamicAppShell>{children}</DynamicAppShell>
      </body>
    </html>
  );
}
