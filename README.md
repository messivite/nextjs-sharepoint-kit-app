<div align="center">

# SharePoint Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![SharePoint Kit](https://img.shields.io/badge/SharePoint%20Kit-0.1.4-0078D4?logo=microsoftsharepoint&logoColor=white)](https://github.com/messivite/sharepoint-kit)
[![Radix UI](https://img.shields.io/badge/Radix%20UI-Themes-161618)](https://www.radix-ui.com/themes)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Next.js + Microsoft SharePoint entegrasyonu ile fatura ve belge yönetim dashboard'u.

[Kurulum](#-kurulum) •
[Özellikler](#-özellikler) •
[Kullanım](#-kullanım) •
[Deploy](#-deploy)

</div>

---

## Özellikler

| Özellik | Açıklama |
|--------|----------|
| **Microsoft ile giriş** | Azure AD SSO, otomatik token yenileme |
| **SharePoint listeleri** | Belgeler, Faturalar listelerinden veri çekme |
| **Tip güvenli CRUD** | CLI ile otomatik üretilen TypeScript tipleri |
| **Radix UI** | Modern, erişilebilir komponentler |

---

## Kurulum

### 1. Bağımlılıkları yükle

```bash
npm install
```

### 2. Ortam değişkenlerini ayarla

```bash
cp .env.example .env.local
```

`.env.local` dosyasını doldur:

| Değişken | Açıklama |
|----------|----------|
| `NEXT_PUBLIC_SHAREPOINT_TENANT_ID` | Azure AD Tenant ID |
| `NEXT_PUBLIC_SHAREPOINT_CLIENT_ID` | Azure AD App Client ID |
| `NEXT_PUBLIC_SHAREPOINT_REDIRECT_URI` | Redirect URI (örn. `http://localhost:3000`) |
| `SHAREPOINT_CLIENT_SECRET` | sp-generate-types CLI için (opsiyonel, sadece local) |

### 3. Tipleri oluştur (opsiyonel)

SharePoint content type'larından TypeScript interface'leri üretir:

```bash
npx sp-generate-types -c sharepoint.config.ts --non-interactive
```

### 4. Geliştirme sunucusunu başlat

```bash
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) açın.

---

## @mustafaaksoy41/sharepoint-kit

Bu proje **[sharepoint-kit](https://github.com/messivite/sharepoint-kit)** paketini kullanıyor. Microsoft Graph API, React hook'ları, Radix UI bileşenleri ve CLI tip üreteci sunar.

### Paket modülleri

| Modül | İçerik |
|-------|--------|
| `@mustafaaksoy41/sharepoint-kit` | `createSpClient` – Graph API client |
| `@mustafaaksoy41/sharepoint-kit/components` | `SpAuthProvider`, `SpProviderWithAuth`, `SpListTable` vb. |
| `@mustafaaksoy41/sharepoint-kit/hooks` | `useSpList`, `useSpItem`, `useSpCreate` vb. |

---

## Kullanım

### Auth ve Provider

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

### Hook'lar

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

#### `useSpAuth` – Token ve giriş durumu

```tsx
import { useSpAuth } from "@mustafaaksoy41/sharepoint-kit/components";

function Header() {
  const { token, isAuthenticated, user, login, logout } = useSpAuth();

  if (!isAuthenticated) {
    return <button onClick={login}>Microsoft ile giriş</button>;
  }
  return <span>{user?.name}</span>;
}
```

#### `useSpList` – Liste verisi (SWR)

```tsx
import { useSpList } from "@mustafaaksoy41/sharepoint-kit/hooks";
import type { Invoice } from "../generated/sp-types";

function InvoiceList() {
  const { data, isLoading, error, mutate } = useSpList<Invoice>({
    listId: "50fc630f-...",
    contentTypeName: "Fatura Denemesi",
  });

  if (isLoading) return <Spinner />;
  if (error) return <p>Hata: {error.message}</p>;

  return (
    <ul>
      {data?.map((item) => (
        <li key={item.id}>{item.fields.Title}</li>
      ))}
    </ul>
  );
}
```

### Komponentler

#### `SpListTable` – Tablo görünümü

```tsx
import { SpListTable } from "@mustafaaksoy41/sharepoint-kit/components";
import type { Invoice } from "../generated/sp-types";

<SpListTable<Invoice>
  listId={listId}
  contentTypeName="Fatura Denemesi"
  columns={[
    { key: "Title", label: "Başlık" },
    { key: "Tutar", label: "Tutar", format: "currency" },
    { key: "Created", label: "Tarih", format: "date" },
  ]}
  emptyMessage="Kayıt bulunamadı."
/>
```

#### `SpItemForm` – Form ile ekleme/düzenleme

```tsx
import { SpItemForm } from "@mustafaaksoy41/sharepoint-kit/components";

<SpItemForm<Invoice>
  listId={listId}
  fields={["Title", "Tutar", "faturaNo"]}
  onSubmit={() => mutate()}
/>
```

---

## Proje yapısı

```
├── app/
│   ├── (dashboard)/
│   │   └── listeler/faturalar/   # Fatura listesi sayfası
│   ├── components/               # Header, TokenRefreshProvider
│   ├── hooks/                    # useSiteInfo, useLists
│   └── providers.tsx             # SpAuth + Theme
├── generated/
│   └── sp-types.ts               # CLI ile üretilen Invoice vb.
├── sharepoint.config.ts          # Tip üretimi config (tenant/client env'den)
└── .env.local                    # Secret'lar (gitignore)
```

---

## Deploy

### Vercel

1. Repo'yu Vercel'e bağla
2. **Environment Variables** ekle:
   - `NEXT_PUBLIC_SHAREPOINT_TENANT_ID`
   - `NEXT_PUBLIC_SHAREPOINT_CLIENT_ID`
   - `NEXT_PUBLIC_SHAREPOINT_REDIRECT_URI` → `https://your-domain.vercel.app`

3. Deploy et

### Release

```bash
npm version patch    # 0.1.0 → 0.1.1
git push --follow-tags
```

Tag push edildiğinde GitHub Release otomatik oluşturulur.

---

## Lisans

MIT
