"use client";

import { Box, Flex, Text, Button, Separator } from "@radix-ui/themes";
import { ExitIcon, PersonIcon } from "@radix-ui/react-icons";
import { useSpAuth } from "@mustafaaksoy41/sharepoint-kit/components";
import { SiteInfo } from "./site-info";

export function Header() {
  const { logout } = useSpAuth();

  return (
    <Box
      style={{
        borderBottom: "1px solid var(--gray-a4)",
        background: "var(--color-background)",
      }}
    >
      <Flex align="center" justify="between" px="4" py="3">
        <Flex align="center" gap="4">
          <Flex align="center" gap="2">
            <Box
              style={{
                width: 28,
                height: 28,
                borderRadius: "var(--radius-2)",
                background: "var(--accent-9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text size="2" weight="bold" style={{ color: "white" }}>
                SP
              </Text>
            </Box>
            <Text size="3" weight="bold">
              SharePoint Panel
            </Text>
          </Flex>
          <Separator orientation="vertical" size="1" />
          <SiteInfo />
        </Flex>

        <Flex align="center" gap="3">
          <Flex
            align="center"
            gap="1"
            style={{
              padding: "4px 10px",
              borderRadius: "var(--radius-2)",
              background: "var(--gray-a3)",
            }}
          >
            <PersonIcon width={14} height={14} />
            <Text size="1" color="gray">
              Oturum Açık
            </Text>
          </Flex>
          <Button
            variant="soft"
            color="red"
            size="1"
            onClick={logout}
            style={{ cursor: "pointer" }}
          >
            <ExitIcon width={14} height={14} />
            Çıkış
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
