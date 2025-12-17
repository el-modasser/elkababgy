"use client";
import Image from 'next/image';
import Script from 'next/script';

// ==================== BRAND CONFIGURATION ====================
// Edit these values to customize for your brand

const BRAND_CONFIG = {
  // Brand identity
  brandName: "Elkababgy Nairobi",
  brandNameAr: "الكبابجي نيروبي",

  // Hero Image Configuration
  heroImage: {
    enableHero: true,
    mobile: "/images/hero.png", // Update with your hero image
    desktop: "/images/hero-lg.png", // Update with your hero image
    alt: "Delicious Egyptian grilled BBQ at Elkababgy Nairobi",
    height: {
      mobile: "280px",
      desktop: "320px"
    },
    overlay: false,
    overlayOpacity: 0.2
  },

  // Contact information
  contact: {
    phone: "+254798008898", // Update with your actual phone
    whatsapp: "+254798008898" // Update with your actual WhatsApp
  },

  // Locations
  locations: [
    {
      name: "Gallant Mall Branch",
      address: "Gallant Mall, Parklands Road, Nairobi",
      coordinates: {
        latitude: -1.2531897254973337, // Update with actual coordinates
        longitude: 36.812070047236784 // Update with actual coordinates
      }
    }
  ],

  // Business information for SEO
  businessInfo: {
    type: "Restaurant",
    cuisine: ["Egyptian", "Middle Eastern", "Arabic", "Grilled BBQ", "Kebab", "Tajin", "Kofta", "Shish Tawook"],
    priceRange: "$$",
    description: "Elkababgy Nairobi - Authentic Egyptian grilled BBQ in Nairobi. Experience traditional Egyptian grills, kebabs, tajin, shish tawook, and authentic Middle Eastern cuisine.",
    domain: "https://elkababgy.esto.solutions" // Update with your actual domain
  },

  // Layout settings
  layout: {
    showHeroImage: true,
    heroHeight: "medium" // "small" | "medium" | "large"
  }
};

// ==================== HELPER FUNCTIONS ====================

// Generate structured data for SEO
const generateStructuredData = () => {
  const { brandName, businessInfo, locations, contact } = BRAND_CONFIG;

  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": businessInfo.type,
    "name": brandName,
    "name_ar": BRAND_CONFIG.brandNameAr,
    "@id": businessInfo.domain,
    "url": businessInfo.domain,
    "telephone": contact.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": locations[0].address,
      "addressLocality": "Nairobi",
      "addressRegion": "Nairobi",
      "addressCountry": "KE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": locations[0].coordinates.latitude,
      "longitude": locations[0].coordinates.longitude
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "10:00",
        "closes": "23:00"
      }
    ],
    "servesCuisine": businessInfo.cuisine,
    "priceRange": businessInfo.priceRange,
    "description": businessInfo.description,
    "hasMenu": `${businessInfo.domain}/menu`,
    "menu": {
      "@type": "Menu",
      "hasMenuSection": [
        {
          "@type": "MenuSection",
          "name": "Appetizers",
          "name_ar": "مقبلات",
          "description": "Egyptian appetizers and starters"
        },
        {
          "@type": "MenuSection",
          "name": "Beef & Lamb Grills",
          "name_ar": "مشاوي اللحم البقري والضأن",
          "description": "Authentic Egyptian grilled meats"
        },
        {
          "@type": "MenuSection",
          "name": "Chicken Plates",
          "name_ar": "أطباق الدجاج",
          "description": "Egyptian chicken specialties"
        },
        {
          "@type": "MenuSection",
          "name": "Tajin",
          "name_ar": "طواجن",
          "description": "Traditional Egyptian clay pot dishes"
        },
        {
          "@type": "MenuSection",
          "name": "Sharing Plates",
          "name_ar": "أطباق للمشاركة",
          "description": "Family-style platters"
        },
        {
          "@type": "MenuSection",
          "name": "Vegetarian Selection",
          "name_ar": "أطباق نباتية",
          "description": "Vegetarian Egyptian dishes"
        },
        {
          "@type": "MenuSection",
          "name": "Salads & Sides",
          "name_ar": "سلطات وأطباق جانبية",
          "description": "Fresh salads and side dishes"
        },
        {
          "@type": "MenuSection",
          "name": "Drinks",
          "name_ar": "مشروبات",
          "description": "Beverages, mocktails, and teas"
        }
      ]
    },
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "MenuItem",
          "name": "Lamb Kebab",
          "description": "6 pieces of charcoal-grilled marinated lamb kebab with Arabic spices",
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
          "name": "Mixed Grill (Single)",
          "description": "2 kofta, 2 lamb kebab, 3 sausage, 4 chicken wings, grilled to perfection",
          "offers": {
            "@type": "Offer",
            "price": 2100,
            "priceCurrency": "KES"
          }
        }
      }
    ]
  };

  return localBusinessData;
};

// Get hero height based on configuration
const getHeroHeight = (heightType) => {
  switch (heightType) {
    case "small":
      return { mobile: "220px", desktop: "260px" };
    case "large":
      return { mobile: "340px", desktop: "380px" };
    default: // medium
      return { mobile: "280px", desktop: "320px" };
  }
};

// ==================== LAYOUT COMPONENT ====================

export default function Layout({ children }) {
  const {
    brandName,
    heroImage,
    layout
  } = BRAND_CONFIG;

  const structuredData = generateStructuredData();
  const heroHeight = getHeroHeight(layout.heroHeight);

  return (
    <div className="min-h-screen bg-white">
      {/* Structured Data for SEO */}
      <Script
        id="local-business-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Additional SEO Meta Tags */}
      <Script
        id="additional-seo-tags"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Food-specific meta tags
            const metaTags = [
              { name: 'food:cuisine', content: '${BRAND_CONFIG.businessInfo.cuisine.join(', ')}' },
              { name: 'food:price_range', content: '${BRAND_CONFIG.businessInfo.priceRange}' },
              { name: 'food:menu_url', content: '${BRAND_CONFIG.businessInfo.domain}/menu' },
              { name: 'food:restaurant_type', content: 'Restaurant' },
              { name: 'food:restaurant_category', content: 'Egyptian, Arabic, Middle Eastern, Grill' },
              { name: 'food:specialty', content: 'Egyptian Grilled BBQ' },
              { name: 'geo.region', content: 'KE-NAIROBI' },
              { name: 'geo.placename', content: 'Nairobi, Parklands' },
              { name: 'geo.position', content: '${BRAND_CONFIG.locations[0].coordinates.latitude};${BRAND_CONFIG.locations[0].coordinates.longitude}' },
              { name: 'ICBM', content: '${BRAND_CONFIG.locations[0].coordinates.latitude}, ${BRAND_CONFIG.locations[0].coordinates.longitude}' },
              { property: 'whatsapp:business', content: '${BRAND_CONFIG.contact.whatsapp}' },
              { property: 'whatsapp:message', content: 'Hello Elkababgy! I\\'d like to order Egyptian grilled BBQ' },
              { property: 'business:contact:phone', content: '${BRAND_CONFIG.contact.phone}' },
              { property: 'business:contact:whatsapp', content: '${BRAND_CONFIG.contact.whatsapp}' },
              { property: 'business:contact:website', content: '${BRAND_CONFIG.businessInfo.domain}' },
              { property: 'business:contact:ordering', content: '${BRAND_CONFIG.businessInfo.domain}/menu' }
            ];
            
            metaTags.forEach(tag => {
              const meta = document.createElement('meta');
              if (tag.property) {
                meta.setAttribute('property', tag.property);
              } else {
                meta.setAttribute('name', tag.name);
              }
              meta.setAttribute('content', tag.content);
              document.head.appendChild(meta);
            });
          `
        }}
      />

      {/* Hero Image Section */}
      {layout.showHeroImage && (
        <div className="relative w-full overflow-hidden">
          {/* Mobile Hero Image */}
          <div className="block md:hidden relative">
            <div
              className="w-full bg-cover bg-center"
              style={{
                height: heroHeight.mobile,
                backgroundImage: `url('${heroImage.mobile}')`,
                backgroundColor: '#f5f5f5' // Fallback color
              }}
            >
              {heroImage.overlay && (
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: `rgba(0, 0, 0, ${heroImage.overlayOpacity})`
                  }}
                />
              )}
            </div>
          </div>

          {/* Desktop Hero Image */}
          <div className="hidden md:block relative">
            <div
              className="w-full bg-cover bg-center"
              style={{
                height: heroHeight.desktop,
                backgroundImage: `url('${heroImage.desktop}')`,
                backgroundColor: '#f5f5f5' // Fallback color
              }}
            >
              {heroImage.overlay && (
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: `rgba(0, 0, 0, ${heroImage.overlayOpacity})`
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="w-full">
        {children}
      </main>

      {/* Global Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Cairo:wght@300;400;500;600;700&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        html {
          font-family: 'Inter', 'Cairo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          scroll-behavior: smooth;
        }
        
        body {
          background: #ffffff;
          color: #000000;
          line-height: 1.6;
          font-weight: 400;
        }
        
        /* RTL text support */
        .arabic-text {
          font-family: 'Cairo', sans-serif;
          direction: rtl;
          text-align: right;
        }
        
        /* Clean scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #fafafa;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #e5e5e5;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #d4d4d4;
        }
        
        /* Focus styles */
        button:focus-visible,
        input:focus-visible,
        select:focus-visible {
          outline: 2px solid #8B4513; /* Brown accent for Middle Eastern theme */
          outline-offset: 2px;
        }
        
        /* Selection */
        ::selection {
          background: #D4AF37; /* Gold accent */
          color: #000000;
        }
        
        /* Image loading animation */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .hero-image {
          animation: fadeIn 0.5s ease-out;
        }
        
        /* Responsive images */
        img {
          max-width: 100%;
          height: auto;
        }

        /* Egyptian/grill theme accents */
        .theme-accent {
          color: #C19A6B; /* Gold-brown for Egyptian theme */
        }

        .theme-bg-accent {
          background-color: #F5E8D0; /* Light beige background */
        }

        .theme-border-accent {
          border-color: #8B4513; /* Saddle brown for borders */
        }
      `}</style>
    </div>
  );
}