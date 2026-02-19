<div align="center">

# SharePoint Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![SharePoint Kit](https://img.shields.io/badge/SharePoint%20Kit-0.1.4-0078D4?logo=microsoftsharepoint&logoColor=white)](https://github.com/messivite/sharepoint-kit)
[![Radix UI](https://img.shields.io/badge/Radix%20UI-Themes-161618)](https://www.radix-ui.com/themes)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Invoice and document management dashboard with Next.js + Microsoft SharePoint integration.

[Setup](#-setup) •
[Features](#-features) •
[Usage](#-usage) •
[Deploy](#-deploy)

</div>

---

## Demo

[![Watch demo](https://img.youtube.com/vi/KbM5PdSj0_Q/hqdefault.jpg)](https://youtu.be/KbM5PdSj0_Q)

---

## Features

| Feature | Description |
|---------|-------------|
| **Microsoft login** | Azure AD SSO, automatic token refresh |
| **SharePoint lists** | Data from Documents, Invoices lists |
| **Type-safe CRUD** | TypeScript types auto-generated via CLI |
| **Radix UI** | Modern, accessible components |

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SHAREPOINT_TENANT_ID` | Azure AD Tenant ID |
| `NEXT_PUBLIC_SHAREPOINT_CLIENT_ID` | Azure AD App Client ID |
| `NEXT_PUBLIC_SHAREPOINT_REDIRECT_URI` | Redirect URI (e.g. `http://localhost:3000`) |
| `SHAREPOINT_CLIENT_SECRET` | For sp-generate-types CLI (optional, local only) |

### 3. Generate types (optional)

Generate TypeScript interfaces from SharePoint content types:

```bash
npx sp-generate-types -c sharepoint.config.ts --non-interactive
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## @mustafaaksoy41/sharepoint-kit

This project uses the **[sharepoint-kit](https://github.com/messivite/sharepoint-kit)** package. It provides Microsoft Graph API client, React hooks, Radix UI components, and a CLI type generator.

### Package modules

| Module | Contents |
|--------|----------|
| `@mustafaaksoy41/sharepoint-kit` | `createSpClient` – Graph API client |
| `@mustafaaksoy41/sharepoint-kit/components` | `SpAuthProvider`, `SpProviderWithAuth`, `SpListTable`, etc. |
| `@mustafaaksoy41/sharepoint-kit/hooks` | `useSpList`, `useSpItem`, `useSpCreate`, etc. |

---

## Usage

### Auth and Provider

```tsx
import { SpAuthProvider, SpProviderWithAuth } from "@mustafaaksoy41/sharepoint-kit/components";
import { Theme } from "@radix-ui/themes";

<Theme>
  <SpAuthProvider loginConfig={loginConfig}>
    <SpProviderWithAuth siteId="root">
      {children}
    </SpProviderWithAuth>
  </SpAuthProvider>
</Theme>
```

### Hooks

#### `useSpContext` – Graph API client

```tsx
import { useSpContext } from "@mustafaaksoy41/sharepoint-kit/components";

function MyComponent() {
  const { client } = useSpContext();

  useEffect(() => {
    client.getLists().then((lists) => console.log(lists));
    client.getListItems({ listId, contentTypeName }).then((items) => ...);
  }, [client]);
}
```

#### `useSpAuth` – Token and auth state

```tsx
import { useSpAuth } from "@mustafaaksoy41/sharepoint-kit/components";

function Header() {
  const { token, isAuthenticated, user, login, logout } = useSpAuth();

  if (!isAuthenticated) {
    return <button onClick={login}>Sign in with Microsoft</button>;
  }
  return <span>{user?.name}</span>;
}
```

#### `useSpList` – List data (SWR)

```tsx
import { useSpList } from "@mustafaaksoy41/sharepoint-kit/hooks";
import type { Invoice } from "../generated/sp-types";

function InvoiceList() {
  const { data, isLoading, error, mutate } = useSpList<Invoice>({
    listId: "50fc630f-...",
    contentTypeName: "Invoice",
  });

  if (isLoading) return <Spinner />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data?.map((item) => (
        <li key={item.id}>{item.fields.Title}</li>
      ))}
    </ul>
  );
}
```

### Components

#### `SpListTable` – Table view

```tsx
import { SpListTable } from "@mustafaaksoy41/sharepoint-kit/components";
import type { Invoice } from "../generated/sp-types";

<SpListTable<Invoice>
  listId={listId}
  contentTypeName="Invoice"
  columns={[
    { key: "Title", label: "Title" },
    { key: "Tutar", label: "Amount", format: "currency" },
    { key: "Created", label: "Date", format: "date" },
  ]}
  emptyMessage="No records found."
/>
```

#### `SpItemForm` – Add/edit form

```tsx
import { SpItemForm } from "@mustafaaksoy41/sharepoint-kit/components";

<SpItemForm<Invoice>
  listId={listId}
  fields={["Title", "Tutar", "invoiceNo"]}
  onSubmit={() => mutate()}
/>
```

---

## Project structure

```
├── app/
│   ├── (dashboard)/
│   │   └── listeler/faturalar/   # Invoice list page
│   ├── components/               # Header, TokenRefreshProvider
│   ├── hooks/                    # useSiteInfo, useLists
│   └── providers.tsx             # SpAuth + Theme
├── generated/
│   └── sp-types.ts               # CLI-generated types (Invoice, etc.)
├── sharepoint.config.ts          # Type generation config (reads from env)
└── .env.local                    # Secrets (gitignored)
```

---

## Deploy

### Vercel

1. Connect the repo to Vercel
2. Add **Environment Variables**:
   - `NEXT_PUBLIC_SHAREPOINT_TENANT_ID`
   - `NEXT_PUBLIC_SHAREPOINT_CLIENT_ID`
   - `NEXT_PUBLIC_SHAREPOINT_REDIRECT_URI` → `https://your-domain.vercel.app`

3. Deploy

### Release

```bash
npm version patch    # 0.1.0 → 0.1.1
git push --follow-tags
```

Pushing a tag triggers an automatic GitHub Release.

---

## License

MIT
