import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://elkababgy.esto.solutions'),
  title: "Elkababgy Nairobi | Authentic Egyptian Grilled BBQ Restaurant | الكبابجي",
  description: "Elkababgy Nairobi offers authentic Egyptian grilled BBQ in Nairobi. Experience traditional Egyptian grills, kebabs, tajin, shawarma, and authentic Middle Eastern cuisine in a warm atmosphere. Order online for delivery or pickup!",
  keywords: "Elkababgy, Egyptian food, Arabic food, Middle Eastern cuisine, grilled BBQ, Egyptian kebab, tajin, kofta, lamb chops, shish tawook, hummus, falafel, Nairobi restaurant, Egyptian restaurant, authentic Egyptian BBQ, Gallant Mall Parklands, Egyptian grills, الكبابجي, مطعم مصري, طعام مصري في نيروبي",
  authors: [{ name: "Elkababgy Nairobi" }],
  openGraph: {
    title: "Elkababgy Nairobi | Authentic Egyptian Grilled BBQ Restaurant | الكبابجي",
    description: "Experience authentic Egyptian grilled BBQ in Nairobi. Traditional Egyptian grills, kebabs, tajin, shish tawook, and more in a warm atmosphere. Order online!",
    url: "https://elkababgy.esto.solutions",
    siteName: "Elkababgy Nairobi",
    locale: "en_KE",
    type: "website",
    images: [
      {
        url: "/images/hero.png", // Update with your hero image
        width: 1200,
        height: 630,
        alt: "Delicious Egyptian grilled BBQ at Elkababgy Nairobi",
      },
      {
        url: "/images/hero-lg.png", // Update with your desktop hero image
        width: 800,
        height: 600,
        alt: "Elkababgy mixed grill plate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elkababgy Nairobi | Authentic Egyptian Grilled BBQ Restaurant | الكبابجي",
    description: "Experience authentic Egyptian grilled BBQ in Nairobi. Traditional Egyptian grills, kebabs, tajin, and more.",
    images: ["/images/hero.png"],
    creator: "@elkababgy_ke",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
    yandex: "YOUR_YANDEX_VERIFICATION_CODE",
    yahoo: "YOUR_YAHOO_VERIFICATION_CODE",
  },
  alternates: {
    canonical: "https://elkababgy.esto.solutions",
    languages: {
      "en-KE": "https://elkababgy.esto.solutions",
    },
  },
  category: "Food & Drink",
  other: {
    "facebook-domain-verification": "YOUR_FACEBOOK_DOMAIN_VERIFICATION",
  },
};

// JSON-LD structured data for enhanced SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Elkababgy Nairobi",
  "name_ar": "الكبابجي نيروبي",
  "description": "Authentic Egyptian restaurant specializing in grilled BBQ, offering traditional Egyptian kebabs, lamb chops, tajin, shish tawook, kofta, and more in Nairobi. Experience the taste of Egypt in Kenya.",
  "url": "https://elkababgy.esto.solutions",
  "telephone": "+254798008898",
  "address": [
    {
      "@type": "PostalAddress",
      "streetAddress": "Gallant Mall, Parklands Road",
      "addressLocality": "Nairobi",
      "addressRegion": "Nairobi",
      "postalCode": "00100",
      "addressCountry": "KE"
    }
  ],
  "geo": {
    "@type": "GeoCoordinates",
    // Update with actual coordinates for Gallant Mall Parklands
    "latitude": -1.2531897254973337,
    "longitude": 36.812070047236784
  },
  "openingHours": "Mo-Su 10:00-23:00",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "10:00",
      "closes": "23:00"
    }
  ],
  "servesCuisine": ["Egyptian", "Middle Eastern", "Arabic", "Grilled BBQ"],
  "priceRange": "$$",
  "image": [
    "https://elkababgy.esto.solutions/images/hero.png",
    "https://elkababgy.esto.solutions/images/hero-lg.png"
  ],
  "menu": "https://elkababgy.esto.solutions/?order=true",
  "acceptsReservations": true,
  "paymentAccepted": ["Cash", "Credit Card", "M-Pesa", "Debit Card"],
  "currenciesAccepted": "KES",
  "hasMenu": "https://elkababgy.esto.solutions/?order=true",
  "sameAs": [
    "https://www.facebook.com/elkababgynairobi",
    "https://www.instagram.com/elkababgynairobi",
    "https://twitter.com/elkababgynairobi"
  ],
  "potentialAction": {
    "@type": "OrderAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://elkababgy.esto.solutions/?order=true",
      "actionPlatform": [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/IOSPlatform",
        "http://schema.org/AndroidPlatform"
      ]
    }
  },
  "makesOffer": [
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "MenuItem",
        "name": "Lamb Kebab",
        "description": "6 pieces of charcoal-grilled marinated lamb kebab with Arabic spices. Served with Arabic bread, green salad, tahini sauce, and choice of fries or rice.",
        "offers": {
          "@type": "Offer",
          "price": 1800,
          "priceCurrency": "KES"
        }
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "MenuItem",
        "name": "Lamb Chops",
        "description": "5 pieces of tender lamb chops grilled with Arabic herbs and spices. Served with Arabic bread, green salad, tahini sauce, and choice of fries or rice.",
        "offers": {
          "@type": "Offer",
          "price": 2200,
          "priceCurrency": "KES"
        }
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "MenuItem",
        "name": "Mixed Grill (Single)",
        "description": "2 kofta, 2 lamb kebab, 3 sausage, 4 chicken wings, grilled to perfection. Served with Arabic bread, green salad, tahini sauce, and choice of fries or rice.",
        "offers": {
          "@type": "Offer",
          "price": 2100,
          "priceCurrency": "KES"
        }
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Additional meta tags for food/restaurant SEO */}
        <meta name="food:cuisine" content="Egyptian, Middle Eastern, Arabic, Grilled BBQ" />
        <meta name="food:price_range" content="$$" />
        <meta name="food:menu_url" content="https://elkababgy.esto.solutions/?order=true" />
        <meta name="food:restaurant_type" content="Restaurant" />
        <meta name="food:restaurant_category" content="Egyptian, Arabic, Middle Eastern, Grill" />
        <meta name="food:specialty" content="Egyptian Grilled BBQ" />

        {/* Location meta tags */}
        <meta name="geo.region" content="KE-NAIROBI" />
        <meta name="geo.placename" content="Nairobi, Parklands" />
        <meta name="geo.position" content="-1.2531897254973337;36.812070047236784" />
        <meta name="ICBM" content="-1.2531897254973337, 36.812070047236784" />

        {/* WhatsApp Business integration */}
        <meta property="whatsapp:business" content="+254798008898" />
        <meta property="whatsapp:message" content="Hello Elkababgy! I'd like to order Egyptian grilled BBQ" />

        {/* Ordering Action meta */}
        <meta property="business:contact:phone" content="+254798008898" />
        <meta property="business:contact:website" content="https://elkababgy.esto.solutions" />
        <meta property="business:contact:ordering" content="https://elkababgy.esto.solutions/?order=true" />
        <meta property="business:contact:whatsapp" content="+254798008898" />
      </head>
      <body
        className={`${inter.variable} ${cairo.variable} antialiased bg-gray-50 text-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}