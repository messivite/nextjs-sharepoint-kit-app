"use client";

import { useEffect, useState } from "react";
import { useSpContext } from "@mustafaaksoy41/sharepoint-kit/components";

export interface SpList {
  id: string;
  displayName: string;
  name?: string;
  description?: string;
  webUrl?: string;
  createdDateTime?: string;
  lastModifiedDateTime?: string;
}

export function useLists() {
  const { client } = useSpContext();
  const [lists, setLists] = useState<SpList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    client
      .getLists()
      .then((data: SpList[]) => {
        if (!cancelled) setLists(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [client]);

  return { lists, isLoading, error };
}
