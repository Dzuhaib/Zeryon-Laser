import { createClient } from "@sanity/client";
import { fallbackProducts } from "./products";
import type { Product } from "./types";

const projectId = process.env.SANITY_PROJECT_ID || "4kxmr9b8";
const dataset = process.env.SANITY_DATASET || "production";

export const sanity = createClient({
  projectId,
  dataset,
  apiVersion: "2026-08-15",
  useCdn: true,
  perspective: "published",
});

export const sanityWrite = process.env.SANITY_API_WRITE_TOKEN
  ? sanity.withConfig({
      token: process.env.SANITY_API_WRITE_TOKEN,
      useCdn: false,
    })
  : null;

const productProjection = `{
  _id,
  name,
  "slug": slug.current,
  category,
  price,
  summary,
  description,
  applications,
  features,
  included,
  specifications[]{label, value},
  "image": image.asset->url,
  featured
  ,order
}`;

export async function getProducts(): Promise<Product[]> {
  try {
    return await sanity.fetch<Product[]>(
      `*[_type == "product" && defined(slug.current)] | order(order asc) ${productProjection}`,
      {},
      { next: { revalidate: 60 } },
    );
  } catch (error) {
    console.error("Unable to fetch products from Sanity", error);
    return fallbackProducts;
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    return await sanity.fetch<Product | null>(
      `*[_type == "product" && slug.current == $slug][0] ${productProjection}`,
      { slug },
      { next: { revalidate: 60 } },
    );
  } catch (error) {
    console.error(`Unable to fetch ${slug} from Sanity`, error);
    return fallbackProducts.find((product) => product.slug === slug) || null;
  }
}

export type CustomerOrder = {
  _id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  subtotal: number;
  vat: number;
  total: number;
  items: Array<{ name: string; quantity: number; price: number }>;
};

export async function getCustomerOrders(
  email: string,
): Promise<CustomerOrder[]> {
  if (!sanityWrite || !email) return [];
  try {
    return await sanityWrite.fetch<CustomerOrder[]>(
      `*[_type == "order" && lower(customer.email) == lower($email)] | order(createdAt desc) {
        _id, orderNumber, status, createdAt, subtotal, vat, total,
        items[]{name, quantity, price}
      }`,
      { email },
    );
  } catch (error) {
    console.error("Unable to fetch customer orders", error);
    return [];
  }
}
