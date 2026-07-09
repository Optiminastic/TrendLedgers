import type { MetadataRoute } from "next";
import { getPosts } from "./lib/blog-db";

const SITE_URL = "https://trendledgers.com";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/blogs`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // A DB/API failure must never break the build — degrade to static routes.
  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await getPosts();
    postRoutes = posts
      .filter((p) => p.slug)
      .map((p) => ({
        url: `${SITE_URL}/${p.slug}`,
        lastModified: p.published_at ? new Date(p.published_at) : now,
        changeFrequency: "weekly",
        priority: 0.7,
      }));
  } catch (e) {
    console.error("[sitemap] failed to fetch posts:", e);
  }

  return [...staticRoutes, ...postRoutes];
}
