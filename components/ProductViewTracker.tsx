"use client";

import { useEffect } from "react";

export function ProductViewTracker({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  useEffect(() => {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event: "product_view", productId, productName }),
      keepalive: true,
    }).catch(() => undefined);
  }, [productId, productName]);
  return null;
}
