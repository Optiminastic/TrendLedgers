// Shared conversion of published Signalor posts into the site's BlogPost card
// shape. Used by both the homepage ("From the Blog" card grid) and the /blogs
// explorer so a freshly published Signalor post surfaces as a proper card
// everywhere, with the same cover-image fallback.

import { getPosts, formatDate, type BlogRow } from "./blog-db";
import type { BlogPost } from "./data";

const stripHtml = (html: string) =>
  (html ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

/** Keep only genuine published rows — never placeholder/test rows. The list
 *  endpoint omits content_html, so only gate on body length when present. */
export function isRealDbPost(r: BlogRow): boolean {
  const title = (r.title ?? "").trim();
  if (!title || /^test\b/i.test(title)) return false;
  const text = stripHtml(r.content_html ?? "");
  if (text && text.length < 140) return false;
  return true;
}

/** Convert a published Signalor post into the BlogPost card shape. */
export function dbToBlogPost(r: BlogRow): BlogPost {
  const text = stripHtml(r.content_html ?? "");
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

/** Published Signalor posts as cards, newest first. A failed fetch → []. */
export async function getSignalorBlogPosts(): Promise<BlogPost[]> {
  try {
    return (await getPosts()).filter(isRealDbPost).map(dbToBlogPost);
  } catch {
    return [];
  }
}
