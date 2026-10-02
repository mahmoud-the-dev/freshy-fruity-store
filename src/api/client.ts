import { hasExpressDelivery } from "../data/expressDelivery";
import { Color, Family, Fruit, Vitamin } from "../data/types";

export interface ProductSeo {
  title: string;
  description: string;
}

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  unit?: string;
  colors: Color[];
  family: Family;
  vitamins: Vitamin[];
  description: string;
  image: string;
  imageUrl: string;
  expressDelivery?: boolean;
  seo?: ProductSeo;
}

export interface CheckoutResponse {
  ok: boolean;
  orderId?: string;
  itemCount?: number;
  message: string;
}

export interface HomeCta {
  label: string;
  to: string;
}

export interface HomeHero {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: HomeCta;
  secondaryCta: HomeCta;
  stamp: string;
  logo: string;
  logoAlt: string;
  logoUrl: string;
}

export interface HomeValue {
  mark: string;
  title: string;
  description: string;
}

export interface HomePage {
  hero: HomeHero;
  values: HomeValue[];
  featured: ApiProduct[];
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const defaultApiUrl = "https://freshy-fruity-api.edu-mahmoud-ahmed.workers.dev";

const apiUrl = () => (import.meta.env.VITE_API_URL ?? defaultApiUrl).replace(/\/$/, "");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const base = apiUrl();
  if (!base) {
    throw new Error("Missing VITE_API_URL. Add it to .env and restart the dev server.");
  }

  const response = await fetch(`${base}${path}`, init);
  const data = (await response.json()) as T & { message?: string; error?: string };

  if (!response.ok) {
    throw new ApiError(data.message || data.error || `Request failed (${response.status})`, response.status);
  }

  return data;
}

export function fetchProducts(): Promise<ApiProduct[]> {
  return request<ApiProduct[]>("/api/products");
}

export function fetchProduct(slug: string): Promise<ApiProduct> {
  return request<ApiProduct>(`/api/products/${encodeURIComponent(slug)}`);
}

export function fetchRecommendations(slug: string): Promise<ApiProduct[]> {
  return request<ApiProduct[]>(`/api/products/${encodeURIComponent(slug)}/recommendations`);
}

export async function fetchHome(): Promise<HomePage | null> {
  try {
    return await request<HomePage>("/api/home");
  } catch {
    return null;
  }
}

export function mapProduct(product: ApiProduct): Fruit {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    unit: product.unit,
    quantity: 1,
    colors: product.colors,
    family: product.family,
    vitamins: product.vitamins,
    isFavorite: false,
    inBag: false,
    description: product.description,
    imageUrl: product.imageUrl,
    expressDelivery: hasExpressDelivery(product.slug, product.expressDelivery),
  };
}

export function checkoutBag(items: Fruit[]): Promise<CheckoutResponse> {
  return request<CheckoutResponse>("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: items.map((item) => ({
        slug: item.slug,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    }),
  });
}
