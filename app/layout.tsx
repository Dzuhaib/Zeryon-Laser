import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
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
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const application = (
    <CartProvider>
      <Header clerkEnabled={clerkEnabled} />
      <main>{children}</main>
      <Footer />
    </CartProvider>
  );

  return (
    <html lang="en">
      <body>
        {clerkEnabled ? (
          <ClerkProvider>{application}</ClerkProvider>
        ) : (
          application
        )}
      </body>
    </html>
  );
}
