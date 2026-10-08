import type { Metadata } from "next";
import { FAQ_ITEMS } from "@/lib/faq";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mnvseguranca.com.br"),
  title: "Segurança contra Incêndio e Pânico no Rio de Janeiro | AVCB, MNV",
  description:
    "Consultoria em segurança contra incêndio e pânico no Rio de Janeiro: legalização, redação de AVCB, vistoria do CBMERJ e alvará do Corpo de Bombeiros.",
  openGraph: {
    title: "Segurança contra Incêndio e Pânico no Rio de Janeiro | AVCB, MNV",
    description:
      "Legalização, redação de AVCB, vistoria do CBMERJ e alvará do Corpo de Bombeiros para empresas no Rio de Janeiro.",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-mnv.png",
        width: 1200,
        height: 630,
        alt: "MNV, Segurança contra Incêndio e Pânico no Rio de Janeiro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Segurança contra Incêndio e Pânico no Rio de Janeiro | AVCB, MNV",
    description:
      "Legalização, redação de AVCB, vistoria do CBMERJ e alvará do Corpo de Bombeiros para empresas no Rio de Janeiro.",
    images: ["/og-mnv.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </body>
    </html>
  );
}
