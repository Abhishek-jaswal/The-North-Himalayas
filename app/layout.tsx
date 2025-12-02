import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ✅ Load fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ SEO metadata
export const metadata: Metadata = {
  title: "The North Himalayas | Explore Himachal, Ladakh & Kashmir",
  description:
    "The North Himalayas is your trusted travel partner for Himachal, Ladakh, and Kashmir tours. Enjoy adventure, culture, and breathtaking mountain views with curated packages.",
  keywords: [
    "Himachal tour packages",
    "Ladakh trips",
    "Kashmir travel agency",
    "Manali honeymoon packages",
    "Leh Ladakh adventure tours",
    "Best Himachal travel company",
    "North India tourism",
    "Mountain vacations",
    "Adventure holidays in India",
    "The North Himalayas tours",
  ],
  openGraph: {
    title: "The North Himalayas",
    description:
      "Plan your dream mountain getaway with The North Himalayas — your trusted travel partner for Himachal, Ladakh, and Kashmir.",
    url: "https://thenorthhimalayas.com",
    siteName: "The North Himalayas",
    images: [
      {
        url: "https://thenorthhimalayas.com/logo.png",
        width: 800,
        height: 600,
        alt: "The North Himalayas Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: "/favicon.png",
  },
};

// ✅ Root Layout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Favicon */}

        {/* ✅ JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              name: "The North Himalayas",
              url: "https://thenorthhimalayas.com",
              logo: "https://thenorthhimalayas.com/logo.png",
              image: "https://thenorthhimalayas.com/logo.png",
              description:
                "Plan your dream vacation with The North Himalayas. We offer Himachal, Ladakh, and Kashmir tour packages with affordable pricing and expert guides.",
             
              email: "hello@thenorthhimalayas.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Mall Road",
                addressLocality: "Manali",
                addressRegion: "Himachal Pradesh",
                postalCode: "175131",
                addressCountry: "IN",
              },
              openingHours: "Mo-Fr 09:00-18:00",
              sameAs: [
                "https://www.instagram.com/thenorthhimalayas",
                "https://www.facebook.com/thenorthhimalayas",
                "https://www.linkedin.com/in/the-north-himalayan",
                "https://youtube.com/@thenorthhimalayas",
                "https://x.com/northhimalayas"
              ],
              makesOffer: {
                "@type": "OfferCatalog",
                name: "Tour Packages",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Trip",
                      name: "Leh Ladakh Adventure Tour",
                      description:
                        "7-day adventure through Leh and Nubra Valley with breathtaking landscapes.",
                      url: "https://thenorthhimalayas.com/tour-package/leh-ladakh",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Trip",
                      name: "Manali & Shimla Vacation",
                      description:
                        "5-day Himachal trip exploring Shimla, Kufri, and Manali with comfortable stays.",
                      url: "https://thenorthhimalayas.com/tour-package/manali-shimla",
                    },
                  },
                ],
              },
            }),
          }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
