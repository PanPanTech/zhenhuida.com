import type { Metadata } from "next";
import Script from "next/script";
import "../globals.css";
import { defaultLang, langCodes } from "@/lib/i18n";

const GA_MEASUREMENT_ID = "G-4PXLT7QZ40";

export const metadata: Metadata = {
  title: "Qinghai Zhenhuida | Industrial chemicals for Central Asia",
  description:
    "Industrial chemical sourcing from Qinghai, China. Product specifications, delivery planning and business inquiries for Central Asia.",
};

export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const active = langCodes.includes(lang) ? lang : defaultLang;
  return (
    <html lang={active}>
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
