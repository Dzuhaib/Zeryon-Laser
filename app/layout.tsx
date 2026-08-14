import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
export const metadata: Metadata = {
  title: {
    default: "ZERYON | Advanced Aesthetic Technology",
    template: "%s | ZERYON",
  },
  description:
    "Professional aesthetic machines, laser training and ongoing practitioner support in the UK.",
  openGraph: {
    title: "ZERYON Advanced Aesthetic Technology",
    description: "Train. Equip. Grow.",
    type: "website",
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
