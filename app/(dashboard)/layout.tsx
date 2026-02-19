"use client";

import { Box, Flex } from "@radix-ui/themes";
import { Header } from "../components/header";
import { Sidebar } from "../components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex direction="column" style={{ minHeight: "100vh" }}>
      <Header />
      <Flex style={{ flex: 1, overflow: "hidden" }}>
        <Sidebar />
        <Box
          p="5"
          style={{
            flex: 1,
            overflow: "auto",
            background: "var(--gray-a2)",
          }}
        >
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
