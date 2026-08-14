"use client";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { Product } from "@/lib/types";
import { money } from "@/lib/money";
import { useCart } from "./CartProvider";
export function ProductCard({
  product,
  index = 1,
}: {
  product: Product;
  index?: number;
}) {
  const { add } = useCart();
  return (
    <article className="product-card">
      <Link href={`/machines/${product.slug}`} className="product-visual">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="machine-art">
            <i />
            <span>0{index}</span>
          </div>
        )}
        <em>{product.category}</em>
      </Link>
      <div className="product-info">
        <div>
          <h3>{product.name}</h3>
          <p>{product.summary}</p>
        </div>
        <strong>
          {money(product.price)} <small>ex VAT</small>
        </strong>
      </div>
      <div className="product-actions">
        <Link href={`/machines/${product.slug}`}>
          Explore machine <ArrowUpRight size={16} />
        </Link>
        <button onClick={() => add(product)}>
          <Plus size={16} /> Add to cart
        </button>
      </div>
    </article>
  );
}
