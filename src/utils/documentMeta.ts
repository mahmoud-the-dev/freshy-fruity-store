import { useEffect } from "react";

export const homepageMeta = {
  title: "Freshy Fruity | Sun-ripened fruit market in Charleston",
  description:
    "Freshy Fruity — a neighborhood fruit market for sun-ripened produce, same-day delivery, and seasonal picks you can taste from the stall.",
};

export const storeMeta = {
  title: "Fresh fruit catalog | Freshy Fruity",
  description: "Shop seasonal fruit, berries, citrus, and same-day delivery from Freshy Fruity in Charleston.",
};

export const bagMeta = {
  title: "Your market bag | Freshy Fruity",
  description: "Review your Freshy Fruity market bag before placing an order.",
};

export const notFoundMeta = {
  title: "Page not found | Freshy Fruity",
  description: "The requested Freshy Fruity page could not be found.",
};

const siteUrl = "https://freshy-fruity-store.vercel.app";

interface DocumentMetaOptions {
  canonicalPath?: string;
  robots?: string;
}

function upsertMeta(selector: string, attributes: Record<string, string>) {
  const existing = document.head.querySelector<HTMLMetaElement>(selector);
  const meta = existing ?? document.createElement("meta");

  Object.entries(attributes).forEach(([name, value]) => meta.setAttribute(name, value));
  if (!existing) document.head.appendChild(meta);
}

function upsertCanonical(url: string) {
  const existing = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  const canonical = existing ?? document.createElement("link");

  canonical.setAttribute("rel", "canonical");
  canonical.setAttribute("href", url);
  if (!existing) document.head.appendChild(canonical);
}

export function useDocumentMeta(title: string, description: string, options: DocumentMetaOptions = {}) {
  useEffect(() => {
    const url = `${siteUrl}${options.canonicalPath ?? window.location.pathname}`;

    document.title = title;
    upsertMeta('meta[name="description"]', { name: "description", content: description });
    upsertMeta('meta[name="robots"]', { name: "robots", content: options.robots ?? "index,follow" });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: url });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    upsertCanonical(url);
  }, [description, options.canonicalPath, options.robots, title]);
}
