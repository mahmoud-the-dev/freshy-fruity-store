import { useEffect } from "react";

export const siteUrl = "https://freshy-fruity-store.vercel.app";
const defaultImage = `${siteUrl}/images/logo.png`;

export interface DocumentMeta {
  title: string;
  description: string;
  path?: string;
  robots?: string;
  image?: string;
}

export const homepageMeta: DocumentMeta = {
  title: "Freshy Fruity | Sun-ripened fruit market in Charleston",
  description:
    "Freshy Fruity is a neighborhood fruit market in Charleston for sun-ripened produce, same-day delivery, and seasonal picks from the stall.",
  path: "/",
};

function setMeta(selector: string, attribute: "name" | "property", value: string, content: string) {
  const existing = document.head.querySelector<HTMLMetaElement>(selector);
  const meta = existing ?? document.createElement("meta");
  meta.setAttribute(attribute, value);
  meta.setAttribute("content", content);
  if (!existing) document.head.appendChild(meta);
}

export function useDocumentMeta({
  title,
  description,
  path = window.location.pathname,
  robots = "index,follow",
  image = defaultImage,
}: DocumentMeta) {
  useEffect(() => {
    const canonicalUrl = new URL(path, siteUrl).toString();
    document.title = title;
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[name="robots"]', "name", "robots", robots);
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    setMeta('meta[property="og:image"]', "property", "og:image", image);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", image);

    const existing = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const canonical = existing ?? document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    canonical.setAttribute("href", canonicalUrl);
    if (!existing) document.head.appendChild(canonical);
  }, [description, image, path, robots, title]);
}

export function useJsonLd(id: string, data: Record<string, unknown> | null) {
  useEffect(() => {
    const existing = document.head.querySelector<HTMLScriptElement>(`script#${id}`);
    if (!data) {
      existing?.remove();
      return;
    }

    const script = existing ?? document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    if (!existing) document.head.appendChild(script);

    return () => script.remove();
  }, [data, id]);
}
