import type { Metadata } from "next";
import PageHero from "../components/PageHero";
import BlogsExplorer from "./BlogsExplorer";
import { blogPosts, type BlogPost } from "../lib/data";
import { getPosts, formatDate, type BlogRow } from "../lib/blog-db";

export const revalidate = 300;

const SITE_URL = "https://trendledgers.com";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Every Trend Ledgers story in one place. Browse the latest posts and filter by category — markets, business, lifestyle, sport and more.",
  alternates: {
    canonical: "/blogs",
  },
  openGraph: {
    type: "website",
    title: "Blogs | Trend Ledgers",
    description:
      "Every Trend Ledgers story in one place. Browse the latest posts and filter by category — markets, business, lifestyle, sport and more.",
    url: `${SITE_URL}/blogs`,
    siteName: "Trend Ledgers",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Trend Ledgers — all stories",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blogs | Trend Ledgers",
    description:
      "Every Trend Ledgers story in one place. Browse the latest posts and filter by category.",
    images: ["/opengraph-image.png"],
  },
};

/** Keep only genuine published Signalor rows — never placeholder/test rows.
 *  The list endpoint returns summaries WITHOUT content_html, so only gate on
 *  body length when a body is actually present (i.e. never drop a valid summary). */
function isRealDbPost(r: BlogRow): boolean {
  const title = (r.title ?? "").trim();
  if (!title || /^test\b/i.test(title)) return false;
  const text = (r.content_html ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (text && text.length < 140) return false;
  return true;
}

/** Convert a published Signalor post into the listing's BlogPost shape. */
function dbToBlogPost(r: BlogRow): BlogPost {
  const text = (r.content_html ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  return {
    id: r.slug,
    title: r.title,
    category: r.category?.trim() || "Business",
    excerpt: (r.description?.trim() || text).slice(0, 160),
    date: formatDate(r.published_at),
    author: "Signalor",
    readTime: `${Math.max(1, Math.round(words / 200))} mins read`,
    image: r.image_url?.trim() || `https://picsum.photos/seed/${encodeURIComponent(r.slug)}/640/420`,
    imageAlt: r.title,
    href: `/${r.slug}`,
  };
}

export default async function BlogsPage() {
  // Latest published Signalor posts (newest first) lead the list, ahead of the
  // editorial archive, so freshly published blogs always surface at the top.
  const signalorPosts = (await getPosts()).filter(isRealDbPost).map(dbToBlogPost);
  const posts = [...signalorPosts, ...blogPosts];

  return (
    <main className="flex-1">
      <PageHero
        eyebrow="The Blog"
        title="All Stories"
        description="The latest news, trending stories and popular topics — all in one place. Filter by category to find exactly what you're after."
      />

      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <BlogsExplorer posts={posts} />
      </div>
    </main>
  );
}
