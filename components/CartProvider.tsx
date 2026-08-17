"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { CartItem, Product } from "@/lib/types";
type C = {
  items: CartItem[];
  add: (p: Product) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, q: number) => void;
  count: number;
  total: number;
  clear: () => void;
};
const Cart = createContext<C | null>(null);
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("lbl-cart") || "[]");
      if (!Array.isArray(stored)) return;
      setItems(
        stored
          .filter(
            (item): item is CartItem =>
              typeof item?.product?._id === "string" &&
              typeof item?.product?.name === "string" &&
              Number.isFinite(Number(item?.product?.price)) &&
              Number.isFinite(Number(item?.quantity)),
          )
          .slice(0, 20)
          .map((item) => ({
            ...item,
            quantity: Math.min(10, Math.max(1, Math.floor(item.quantity))),
          })),
      );
    } catch {
      localStorage.removeItem("lbl-cart");
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("lbl-cart", JSON.stringify(items));
  }, [items]);
  const add = (product: Product) => {
    setItems((v) =>
      v.some((i) => i.product._id === product._id)
        ? v.map((i) =>
            i.product._id === product._id
              ? { ...i, quantity: Math.min(10, i.quantity + 1) }
              : i,
          )
        : [...v, { product, quantity: 1 }],
    );
    fetch("/api/analytics", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        event: "cart_add",
        productId: product._id,
        productName: product.name,
      }),
      keepalive: true,
    }).catch(() => undefined);
  };
  const remove = (id: string) =>
    setItems((v) => v.filter((i) => i.product._id !== id));
  const setQuantity = (id: string, q: number) =>
    setItems((v) =>
      v.map((i) =>
        i.product._id === id
          ? { ...i, quantity: Math.min(10, Math.max(1, q)) }
          : i,
      ),
    );
  const clear = useCallback(() => setItems([]), []);
  return (
    <Cart.Provider
      value={{
        items,
        add,
        remove,
        setQuantity,
        count: items.reduce((a, b) => a + b.quantity, 0),
        total: items.reduce(
          (a, b) => a + (b.product.price || 0) * b.quantity,
          0,
        ),
        clear,
      }}
    >
      {children}
    </Cart.Provider>
  );
}
export const useCart = () => {
  const c = useContext(Cart);
  if (!c) throw Error("Cart context");
  return c;
};
