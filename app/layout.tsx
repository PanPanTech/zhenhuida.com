import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qinghai Zhenhuida | Industrial chemicals for Central Asia",
  description: "Industrial chemical sourcing from Qinghai, China. Product specifications, delivery planning and business inquiries for Central Asia.",
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
    </html>
  );
}
