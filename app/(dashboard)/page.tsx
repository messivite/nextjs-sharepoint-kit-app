"use client";

import {
  Box,
  Card,
  Flex,
  Grid,
  Heading,
  Text,
  Spinner,
  Separator,
} from "@radix-ui/themes";
import {
  DashboardIcon,
  FileTextIcon,
  GlobeIcon,
  ListBulletIcon,
  ClockIcon,
  Link2Icon,
} from "@radix-ui/react-icons";
import { useSiteInfo } from "../hooks/use-site-info";
import { useLists } from "../hooks/use-lists";
import { ClientDate } from "../components/client-date";
import Link from "next/link";

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <Card size="2">
      <Flex gap="3" align="center">
        <Flex
          align="center"
          justify="center"
          style={{
            width: 40,
            height: 40,
            borderRadius: "var(--radius-2)",
            background: `var(--${color}-a3)`,
            color: `var(--${color}-11)`,
            flexShrink: 0,
          }}
        >
          {icon}
        </Flex>
        <Box>
          <Text size="1" color="gray" style={{ display: "block" }}>
            {label}
          </Text>
          <Text size="5" weight="bold">
            {value}
          </Text>
        </Box>
      </Flex>
    </Card>
  );
}

export default function DashboardPage() {
  const { rootSite, sites, isLoading: siteLoading } = useSiteInfo();
  const { lists, isLoading: listsLoading } = useLists();

  const isLoading = siteLoading || listsLoading;

  if (isLoading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: 400 }}>
        <Flex direction="column" align="center" gap="3">
          <Spinner size="3" />
          <Text size="2" color="gray">
            Dashboard yükleniyor...
          </Text>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="5">
      <Flex align="center" gap="2">
        <DashboardIcon width={20} height={20} />
        <Heading size="5">Dashboard</Heading>
      </Flex>

      <Grid columns={{ initial: "1", sm: "3" }} gap="4">
        <StatCard
          icon={<GlobeIcon width={20} height={20} />}
          label="SharePoint Site"
          value={rootSite?.displayName ?? "—"}
          color="blue"
        />
        <StatCard
          icon={<ListBulletIcon width={20} height={20} />}
          label="Toplam Liste"
          value={lists.length}
          color="green"
        />
        <StatCard
          icon={<FileTextIcon width={20} height={20} />}
          label="İçerik Türleri"
          value="Fatura Denemesi"
          color="violet"
        />
      </Grid>

      {rootSite && (
        <Card size="3">
          <Flex direction="column" gap="3">
            <Flex align="center" gap="2">
              <GlobeIcon width={18} height={18} />
              <Heading size="4">Site Bilgileri</Heading>
            </Flex>
            <Separator size="4" />
            <Grid columns={{ initial: "1", sm: "2" }} gap="4">
              <Flex direction="column" gap="1">
                <Text size="1" color="gray" weight="bold">
                  Site Adı
                </Text>
                <Text size="3">{rootSite.displayName}</Text>
              </Flex>
              {rootSite.webUrl && (
                <Flex direction="column" gap="1">
                  <Text size="1" color="gray" weight="bold">
                    URL
                  </Text>
                  <Flex align="center" gap="1">
                    <Link2Icon width={14} height={14} />
                    <Text
                      size="2"
                      color="blue"
                      asChild
                    >
                      <a
                        href={rootSite.webUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {rootSite.webUrl}
                      </a>
                    </Text>
                  </Flex>
                </Flex>
              )}
              {rootSite.description && (
                <Flex direction="column" gap="1">
                  <Text size="1" color="gray" weight="bold">
                    Açıklama
                  </Text>
                  <Text size="2">{rootSite.description}</Text>
                </Flex>
              )}
              {rootSite.name && (
                <Flex direction="column" gap="1">
                  <Text size="1" color="gray" weight="bold">
                    Site Kodu
                  </Text>
                  <Text size="2">{rootSite.name}</Text>
                </Flex>
              )}
            </Grid>
          </Flex>
        </Card>
      )}

      {lists.length > 0 && (
        <Card size="3">
          <Flex direction="column" gap="3">
            <Flex align="center" gap="2">
              <ListBulletIcon width={18} height={18} />
              <Heading size="4">Mevcut Listeler</Heading>
            </Flex>
            <Separator size="4" />
            <Flex direction="column" gap="2">
              {lists.map((list) => (
                <Flex
                  key={list.id}
                  align="center"
                  justify="between"
                  py="2"
                  px="3"
                  style={{
                    borderRadius: "var(--radius-2)",
                    border: "1px solid var(--gray-a4)",
                  }}
                >
                  <Flex align="center" gap="2">
                    <FileTextIcon width={14} height={14} />
                    <Text size="2" weight="medium">
                      {list.displayName}
                    </Text>
                  </Flex>
                  <Flex align="center" gap="3">
                    {list.lastModifiedDateTime && (
                      <Flex align="center" gap="1">
                        <ClockIcon width={12} height={12} />
                        <Text size="1" color="gray">
                          <ClientDate dateString={list.lastModifiedDateTime} />
                        </Text>
                      </Flex>
                    )}
                    {list.displayName === "Faturalar" && (
                      <Text size="1" asChild>
                        <Link
                          href="/listeler/faturalar"
                          style={{
                            color: "var(--accent-11)",
                            fontWeight: 600,
                          }}
                        >
                          Görüntüle →
                        </Link>
                      </Text>
                    )}
                  </Flex>
                </Flex>
              ))}
            </Flex>
          </Flex>
        </Card>
      )}
    </Flex>
  );
}
