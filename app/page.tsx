import FeaturedNews from "./components/FeaturedNews";
import Sidebar from "./components/Sidebar";
import BusinessCarousel from "./components/BusinessCarousel";
import LifestyleFeature from "./components/LifestyleFeature";
import SportSection from "./components/SportSection";
import LatestStories from "./components/LatestStories";
import JsonLd from "./components/JsonLd";

export const revalidate = 300;

const SITE_URL = "https://trendledgers.com";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Trend Ledgers",
  alternateName: "Market news, trends & what's-next analysis",
  url: SITE_URL,
  description:
    "A market & finance journal covering the latest news, trends and what's-next analysis across markets, business, lifestyle and sport.",
  publisher: {
    "@type": "Organization",
    name: "Trend Ledgers",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/opengraph-image.png`,
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Trend Ledgers",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/opengraph-image.png`,
    width: 1200,
    height: 630,
  },
  description:
    "Market news, trends & what's-next analysis across markets, business, lifestyle and sport.",
};

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4">
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={organizationJsonLd} />
      <LatestStories />
      {/* Top: featured + sidebar */}
      <div className="grid grid-cols-1 gap-10 pt-8 lg:grid-cols-[1fr_320px]">
        <FeaturedNews />
        <Sidebar />
      </div>

      {/* Full-width sections */}
      <div className="mt-12 flex flex-col gap-12">
        <BusinessCarousel />
        <LifestyleFeature />
        <SportSection />
      </div>
    </main>
  );
}
