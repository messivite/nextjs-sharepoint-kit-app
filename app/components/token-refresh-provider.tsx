"use client";

import { useEffect, useRef } from "react";
import {
  PublicClientApplication,
  InteractionRequiredAuthError,
} from "@azure/msal-browser";
import { useSpAuth } from "@mustafaaksoy41/sharepoint-kit/components";
import type { SpLoginConfig } from "@mustafaaksoy41/sharepoint-kit/components";

const SCOPES = ["https://graph.microsoft.com/.default"];
const REFRESH_INTERVAL_MS = 45 * 60 * 1000; // token lasts ~1h, refresh before that

function buildMsalConfig(config: SpLoginConfig) {
  const tenantId = (config.tenantId || "").replace(/\/$/, "");
  return {
    auth: {
      clientId: config.clientId,
      authority: `https://login.microsoftonline.com/${tenantId}`,
      redirectUri: config.redirectUri,
    },
  };
}

let msalInstance: Awaited<ReturnType<typeof PublicClientApplication.createPublicClientApplication>> | null = null;
let msalConfigKey: string | null = null;

async function getMsalInstance(config: SpLoginConfig) {
  const key = `${config.tenantId}:${config.clientId}:${config.redirectUri}`;
  if (msalInstance && msalConfigKey === key) return msalInstance;
  const msalConfig = buildMsalConfig(config);
  msalInstance =
    await PublicClientApplication.createPublicClientApplication(msalConfig);
  msalConfigKey = key;
  return msalInstance;
}

export function TokenRefreshProvider({
  loginConfig,
  children,
}: {
  loginConfig: SpLoginConfig;
  children: React.ReactNode;
}) {
  const { token, isAuthenticated, login } = useSpAuth();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (
      !loginConfig ||
      !isAuthenticated ||
      !token ||
      token === "bypass-token" ||
      typeof window === "undefined"
    ) {
      return;
    }

    const refreshToken = async () => {
      try {
        const instance = await getMsalInstance(loginConfig);
        const accounts = instance.getAllAccounts();
        if (accounts.length === 0) return;
        const request = {
          scopes: SCOPES,
          account: accounts[0],
        };
        const result = await instance.acquireTokenSilent(request);
        if (result?.accessToken) {
          login(result.accessToken);
        }
      } catch (err) {
        if (err instanceof InteractionRequiredAuthError) {
          // silent refresh failed – user'll have to sign in again when the next API call fails
        }
      }
    };

    // refresh now, then every 45 min
    refreshToken();
    intervalRef.current = setInterval(refreshToken, REFRESH_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [loginConfig, isAuthenticated, token, login]);

  return <>{children}</>;
}
