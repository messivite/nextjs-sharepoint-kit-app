"use client";

import { useEffect, useState } from "react";
import { Box, Flex, Text, Heading, Spinner, Callout } from "@radix-ui/themes";
import {
  FileTextIcon,
  InfoCircledIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import {
  useSpContext,
  SpListTable,
} from "@mustafaaksoy41/sharepoint-kit/components";
import type { Invoice } from "../../../../generated/sp-types";

// SharePoint uses encoded field names (Fatura_x0020_Numaras_x0131_ = Fatura No)
const invoiceColumns = [
  { key: "Title" as const, label: "Başlık" },
  { key: "Fatura_x0020_Numaras_x0131_" as const, label: "Fatura No" },
  { key: "Tutar" as const, label: "Tutar", format: "currency" as const },
  { key: "Created" as const, label: "Tarih", format: "date" as const },
  { key: "LinkFilename" as const, label: "Dosya" },
];

export default function FaturalarPage() {
  const { client } = useSpContext();
  const [listId, setListId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // prefer env, else look for Faturalar or Belgeler list
    const envListId = process.env.NEXT_PUBLIC_FATURALAR_LIST_ID;

    if (envListId) {
      setListId(envListId);
      setLoading(false);
      return;
    }

    client
      .getLists()
      .then((lists: { id: string; displayName: string }[]) => {
        if (cancelled) return;
        const faturalar = lists.find((l) => l.displayName === "Faturalar");
        const belgeler = lists.find((l) => l.displayName === "Belgeler");
        const list = faturalar ?? belgeler;
        if (list) {
          setListId(list.id);
        } else {
          setError(
            '"Faturalar" veya "Belgeler" listesi bulunamadı. NEXT_PUBLIC_FATURALAR_LIST_ID ile listId verebilirsiniz.'
          );
        }
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [client]);

  if (loading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: 300 }}>
        <Flex direction="column" align="center" gap="3">
          <Spinner size="3" />
          <Text size="2" color="gray">
            Faturalar yükleniyor...
          </Text>
        </Flex>
      </Flex>
    );
  }

  if (error) {
    return (
      <Box style={{ maxWidth: 600, margin: "0 auto" }}>
        <Callout.Root color="red" variant="surface">
          <Callout.Icon>
            <ExclamationTriangleIcon />
          </Callout.Icon>
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      </Box>
    );
  }

  if (!listId) return null;

  return (
    <Flex direction="column" gap="4">
      <Flex align="center" gap="2">
        <FileTextIcon width={20} height={20} />
        <Heading size="5">Faturalar</Heading>
      </Flex>

      <Callout.Root color="blue" variant="soft" size="1">
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>
          SharePoint &quot;Belgeler&quot; listesindeki &quot;Fatura Denemesi&quot; içerik türünden çekilen veriler aşağıda listelenmektedir.
        </Callout.Text>
      </Callout.Root>

      <Box
        style={{
          background: "var(--color-background)",
          borderRadius: "var(--radius-3)",
          border: "1px solid var(--gray-a4)",
          overflow: "hidden",
        }}
      >
        <SpListTable<Invoice>
          listId={listId}
          contentTypeName="Fatura Denemesi"
          columns={invoiceColumns}
          emptyMessage="Henüz fatura kaydı bulunamadı."
        />
      </Box>
    </Flex>
  );
}
