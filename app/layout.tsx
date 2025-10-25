import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { finger, nexa, niramit, poppins } from "./fonts";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://elkebabgy.com'),
  title: "El Kebabgy | Authentic Egyptian Grills in Nairobi, Kenya",
  description: "Experience authentic Egyptian grills at El Kebabgy in Gallant Mall Parklands. Fresh kebabs, shawarma, kofta, and traditional Egyptian dishes in Nairobi.",
  keywords: "Egyptian restaurant, kebabs, shawarma, kofta, grills, Nairobi, Kenya, El Kebabgy, Middle Eastern cuisine, halal food, Parklands",
  openGraph: {
    title: "El Kebabgy | Authentic Egyptian Grills in Nairobi, Kenya",
    description: "Experience authentic Egyptian grills at El Kebabgy in Gallant Mall Parklands. Fresh kebabs, shawarma, kofta, and traditional Egyptian dishes in Nairobi.",
    url: "https://elkebabgy.com",
    siteName: "El Kebabgy Egyptian Restaurant",
    locale: "en_KE",
    type: "website",
    images: [{
      url: "/logo.svg",
      width: 150,
      height: 52,
      alt: "El Kebabgy Logo",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "El Kebabgy | Authentic Egyptian Grills in Nairobi, Kenya",
    description: "Experience authentic Egyptian grills at El Kebabgy in Gallant Mall Parklands. Fresh kebabs, shawarma, kofta, and traditional Egyptian dishes in Nairobi.",
    images: ["/logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nexa.variable} ${poppins.variable} ${finger.variable} ${niramit.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}