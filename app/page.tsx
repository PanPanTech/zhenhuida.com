import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { origin } from "@/lib/catalog";
import { defaultLang } from "@/lib/i18n";

// GitHub Pages serves this static export and cannot set a per-path status code.
// `next dev` uses the App Router permanent redirect (HTTP 308). The exported `/`
// document is an instant meta refresh to the default locale, which crawlers treat
// as a permanent redirect. It is not a language picker and it is not `noindex`.
const destination = `/${defaultLang}/`;

export const metadata: Metadata = {
  title: "Qinghai Zhenhuida",
  alternates: { canonical: `${origin}${destination}` },
};

export default function Index() {
  if (process.env.NODE_ENV === "development") permanentRedirect(destination);
  return (
    <html lang={defaultLang}>
      <body>
        <meta httpEquiv="refresh" content={`0;url=${destination}`} />
        <p>
          <a href={destination}>Qinghai Zhenhuida</a>
        </p>
      </body>
    </html>
  );
}
