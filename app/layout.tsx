import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { siteVerification } from "@/lib/catalog";

const GA_MEASUREMENT_ID = "G-4PXLT7QZ40";

export const metadata: Metadata = {
  title: "Qinghai Zhenhuida | Industrial chemicals for Central Asia",
  description: "Industrial chemical sourcing from Qinghai, China. Product specifications, delivery planning and business inquiries for Central Asia.",
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
  return (
    <html lang="ru">
      <body className="antialiased">{children}</body>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </html>
  );
}
