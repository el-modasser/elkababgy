"use client"
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { FaHome } from 'react-icons/fa';

export default function Layout({ children }) {
  const pathname = usePathname();

  // Local business structured data for SEO
  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "El Kebabgy",
    "image": "https://elkebabgy.com/images/el-kebabgy-restaurant.jpg",
    "@id": "https://elkebabgy.com",
    "url": "https://elkebabgy.com",
    "telephone": "+254769723159",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Gallant Mall, Parklands",
      "addressLocality": "Nairobi",
      "addressRegion": "Nairobi",
      "postalCode": "00100",
      "addressCountry": "KE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -1.254,
      "longitude": 36.810
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "10:00",
        "closes": "22:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday", "Sunday"],
        "opens": "11:00",
        "closes": "23:00"
      }
    ],
    "servesCuisine": ["Egyptian", "Middle Eastern", "Grills", "Kebabs", "Shawarma"],
    "priceRange": "$$",
    "menu": "https://elkebabgy.com/menu",
    "acceptsReservations": "True"
  };

  return (
    <div className='bg-white'>
      <Script
        id="local-business-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
      />
      <header className="flex flex-col items-center w-full pt-6 pb-0">
        <div className="mb-4 flex justify-center items-center w-full max-w-[800px]">
          {/* Centered Logo */}
          <Image
            src="/logo.svg"
            alt="El Kebabgy Logo"
            width={190}
            height={62}
            className="h-auto py-0 max-w-full mx-auto"
            priority
          />
        </div>
      </header>

      <main className="max-w-[800px] mx-auto px-4">{children}</main>
    </div>
  );
}