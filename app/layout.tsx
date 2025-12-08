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
        {/* ✅ Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id=GTM-NQ6JCJ83'+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NQ6JCJ83');`,
          }}
        />

        {/* ✅ JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              "name": "The North Himalayas",
              "url": "https://thenorthhimalayas.com",
              "logo": "https://thenorthhimalayas.com/logo.png",
              "image": "https://thenorthhimalayas.com/logo.png",
              "description":
                "Plan your dream vacation with The North Himalayas. We offer Himachal, Ladakh, and Kashmir tour packages with affordable pricing and expert guides.",
              "email": "hello@thenorthhimalayas.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Near Radisson Blu, Khaniyara Road",
                "addressLocality": "Dharamshala",
                "addressRegion": "Himachal Pradesh",
                "postalCode": "176215",
                "addressCountry": "IN",
              },
              "telephone": ["+91 80915 35250"],
              "openingHours": "Mo-Fr 09:00-18:00",
              "sameAs": [
                "https://www.instagram.com/thenorthhimalayas",
                "https://www.facebook.com/thenorthhimalayas",
                "https://www.linkedin.com/in/the-north-himalayan",
                "https://youtube.com/@thenorthhimalayas",
                "https://x.com/northhimalayas",
                "https://wa.me/message/BVNBURX2Z2BCK1",
              ],
              "makesOffer": {
                "@type": "OfferCatalog",
                "name": "Tour Packages",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Trip",
                      "name": "Leh Ladakh Adventure Tour",
                      "description":
                        "7-day adventure through Leh and Nubra Valley with breathtaking landscapes.",
                      "url":
                        "https://thenorthhimalayas.com/tour-package/leh-ladakh",
                    },
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Trip",
                      "name": "Manali & Shimla Vacation",
                      "description":
                        "5-day Himachal trip exploring Shimla, Kufri, and Manali with comfortable stays.",
                      "url":
                        "https://thenorthhimalayas.com/tour-package/manali-shimla",
                    },
                  },
                ],
              },
            }),
          }}
        />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ✅ Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NQ6JCJ83"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        {children}
      </body>
    </html>
  );
}
