import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPage } from "@/components/product/ProductPage";
import { allProducts, isProductSlug, products } from "@/content/products";
import { pageMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return allProducts.map((p) => ({ produto: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ produto: string }> }): Promise<Metadata> {
  const { produto } = await params;
  if (!isProductSlug(produto)) return {};
  const p = products[produto];
  return pageMetadata({ title: p.seoTitle, description: p.seoDescription, path: `/${p.slug}`, noindex: p.status !== "active" });
}

export default async function Page({ params }: { params: Promise<{ produto: string }> }) {
  const { produto } = await params;
  if (!isProductSlug(produto)) notFound();
  return <ProductPage product={products[produto]} />;
}
