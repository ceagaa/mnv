import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elevana - Webflow Ecommerce website template",
  description:
    "Elevana is your trusted partner for modern home renovation—offering expert design, flawless craftsmanship, and hassle-free project execution. From kitchen upgrades to full-home makeovers, we deliver beautiful, functional spaces with transparent pricing and on-time delivery.",
  openGraph: {
    title: "Elevana - Webflow Ecommerce website template",
    description:
      "Elevana is your trusted partner for modern home renovation—offering expert design, flawless craftsmanship, and hassle-free project execution.",
    images: ["/seo/692fefb8570f01684d2fd241_Home-7-106ca5.png"],
  },
  icons: {
    icon: "/seo/69392c7083db23b54b50d439_favicon-3c9560.png",
    apple: "/seo/69392c755769a4de787a2264_Webclip-ff57fd.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
