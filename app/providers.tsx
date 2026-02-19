"use client";

import React from "react";
import { Theme } from "@radix-ui/themes";
import {
  SpAuthProvider,
  SpProviderWithAuth,
  type SpLoginConfig,
} from "@mustafaaksoy41/sharepoint-kit/components";

const loginConfig: SpLoginConfig = {
  tenantId: process.env.NEXT_PUBLIC_SHAREPOINT_TENANT_ID!,
  clientId: process.env.NEXT_PUBLIC_SHAREPOINT_CLIENT_ID!,
  redirectUri: process.env.NEXT_PUBLIC_SHAREPOINT_REDIRECT_URI!,
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Theme accentColor="blue" grayColor="slate" radius="medium" scaling="100%">
      <SpAuthProvider loginConfig={loginConfig}>
        <SpProviderWithAuth siteId="root">{children}</SpProviderWithAuth>
      </SpAuthProvider>
    </Theme>
  );
}
