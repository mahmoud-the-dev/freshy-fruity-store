import { useEffect } from "react";

export const homepageMeta = {
  title: "Freshy Fruity — Sun-ripened fruit market",
  description:
    "Freshy Fruity — a neighborhood fruit market for sun-ripened produce, same-day delivery, and seasonal picks you can taste from the stall.",
};

function descriptionMeta(): HTMLMetaElement | null {
  return document.querySelector<HTMLMetaElement>('meta[name="description"]');
}

export function useDocumentMeta(title: string | null, description: string | null) {
  useEffect(() => {
    if (title) document.title = title;
    if (!description) return;

    const existing = descriptionMeta();
    const meta = existing ?? document.createElement("meta");
    meta.setAttribute("name", "description");
    meta.setAttribute("content", description);
    if (!existing) document.head.appendChild(meta);
  }, [title, description]);
}
