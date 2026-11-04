import type { Metadata } from "next";
import { siteVerification } from "@/lib/catalog";

// Shared head tags. `<html lang>` is set by `app/[lang]/layout.tsx` for locale
// pages and by `app/page.tsx` for the `/` → `/ru/` redirect document.
export const metadata: Metadata = {
  verification: {
    ...(siteVerification.google ? { google: siteVerification.google } : {}),
    ...(siteVerification.yandex ? { yandex: siteVerification.yandex } : {}),
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
