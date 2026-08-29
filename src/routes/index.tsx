import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/Index";
import { getRequestLocale } from "@/lib/locale.functions";
import { OG_IMAGE, canonicalLinks, jsonLdScript, socialMeta } from "@/lib/social-meta";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      return await getRequestLocale();
    } catch {
      return { locale: "en" as const };
    }
  },
  head: ({ loaderData }) => ({
    meta: socialMeta(loaderData?.locale ?? "en", `https://rout.be${OG_IMAGE}`),
    links: canonicalLinks("/"),
    scripts: jsonLdScript({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "ROUT",
      url: "https://rout.be",
      inLanguage: loaderData?.locale ?? "en",
      publisher: { "@type": "Organization", name: "ROUT", url: "https://rout.be" },
    }),
  }),
  component: Page,
});
