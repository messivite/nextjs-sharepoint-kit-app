"use client";

import { useEffect, useState } from "react";
import { useSpContext, useSpAuth } from "@mustafaaksoy41/sharepoint-kit/components";

export interface SpSite {
  id: string;
  displayName: string;
  name?: string;
  webUrl?: string;
  description?: string;
}

export function useSiteInfo() {
  const { client } = useSpContext();
  const { token } = useSpAuth();
  const [sites, setSites] = useState<SpSite[]>([]);
  const [rootSite, setRootSite] = useState<SpSite | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  // Root site: GET /sites/root - bağlandığımız site (siteId="root")
  useEffect(() => {
    if (!token || token === "bypass-token") return;
    let cancelled = false;
    setIsLoading(true);

    fetch("https://graph.microsoft.com/v1.0/sites/root", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(res.statusText))))
      .then((data: SpSite) => {
        if (!cancelled) setRootSite(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [token]);

  // Tüm siteler: GET /sites - liste (örn. 2 site)
  useEffect(() => {
    let cancelled = false;

    client
      .getSites()
      .then((data: SpSite[]) => {
        if (!cancelled) setSites(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err);
      });

    return () => { cancelled = true; };
  }, [client]);

  return { sites, rootSite, isLoading, error };
}
