export const EXPRESS_DELIVERY_SLUGS = [
  "banana",
  "strawberry",
  "red-apple",
  "grapes",
  "lemon",
  "cucumber",
] as const;

export function hasExpressDelivery(slug: string, flagged?: boolean) {
  if (typeof flagged === "boolean") return flagged;
  return (EXPRESS_DELIVERY_SLUGS as readonly string[]).includes(slug);
}
