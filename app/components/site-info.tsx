"use client";

import { Box, Flex, Text, Skeleton } from "@radix-ui/themes";
import {
  GlobeIcon,
  Link2Icon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { useSiteInfo } from "../hooks/use-site-info";

export function SiteInfo() {
  const { rootSite, isLoading, error } = useSiteInfo();

  if (isLoading) {
    return (
      <Flex gap="3" align="center">
        <Skeleton style={{ width: 120, height: 16 }} />
        <Skeleton style={{ width: 200, height: 14 }} />
      </Flex>
    );
  }

  if (error || !rootSite) {
    return (
      <Flex gap="2" align="center">
        <InfoCircledIcon />
        <Text size="2" color="gray">
          Site bilgisi yüklenemedi
        </Text>
      </Flex>
    );
  }

  return (
    <Flex gap="3" align="center">
      <Flex
        align="center"
        justify="center"
        style={{
          width: 32,
          height: 32,
          borderRadius: "var(--radius-2)",
          background: "var(--accent-3)",
        }}
      >
        <GlobeIcon width={18} height={18} color="var(--accent-11)" />
      </Flex>
      <Box>
        <Text size="2" weight="bold" style={{ display: "block" }}>
          {rootSite.displayName}
        </Text>
        {rootSite.webUrl && (
          <Flex gap="1" align="center">
            <Link2Icon width={12} height={12} />
            <Text size="1" color="gray" trim="both">
              {rootSite.webUrl}
            </Text>
          </Flex>
        )}
      </Box>
    </Flex>
  );
}
