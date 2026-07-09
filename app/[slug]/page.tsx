import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPosts, getPostBySlug, formatDate, type BlogRow } from "@/app/lib/blog-db";
import JsonLd from "@/app/components/JsonLd";

export const revalidate = 300;

const SITE_URL = "https://trendledgers.com";

/** Plain-text excerpt (~155 chars) from a post's description or HTML body. */
function toDescription(post: BlogRow): string {
  const raw =
    post.description?.trim() ||
    (post.content_html ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (raw.length <= 155) return raw;
  return `${raw.slice(0, 152).trimEnd()}…`;
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not found", robots: { index: false } };

  const description = toDescription(post);
  const canonical = `/${slug}`;
  const images = post.image_url
    ? [{ url: post.image_url, alt: post.title }]
    : ["/opengraph-image.png"];

  return {
    title: post.title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: `${SITE_URL}${canonical}`,
      siteName: "Trend Ledgers",
      publishedTime: post.published_at ?? undefined,
      authors: ["Trend Ledgers"],
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.image_url ? [post.image_url] : ["/opengraph-image.png"],
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const canonical = `${SITE_URL}/${slug}`;
  const description = toDescription(post);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description,
    image: post.image_url ? [post.image_url] : [`${SITE_URL}/opengraph-image.png`],
    datePublished: post.published_at ?? undefined,
    dateModified: post.published_at ?? undefined,
    author: {
      "@type": "Organization",
      name: "Trend Ledgers",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Trend Ledgers",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/opengraph-image.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
  };

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
      <JsonLd data={articleJsonLd} />
      <Link href="/" className="text-sm text-muted transition-colors hover:text-foreground">
        ← Home
      </Link>
      <header className="mt-5 border-b border-border pb-8">
        <time className="text-xs uppercase tracking-wide text-muted">
          {formatDate(post.published_at)}
        </time>
        <h1 className="font-display mt-3 text-4xl font-bold leading-tight text-foreground sm:text-5xl">
          {post.title}
        </h1>
        {post.description ? (
          <p className="mt-4 font-serif text-lg leading-relaxed text-muted">{post.description}</p>
        ) : null}
      </header>
      {post.image_url ? (
        <div className="mt-8 overflow-hidden rounded-lg border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image_url}
            alt={`${post.title} — Trend Ledgers`}
            className="w-full object-cover"
          />
        </div>
      ) : null}
      <div
        className="mt-8 font-serif text-lg leading-relaxed text-foreground [&_a]:text-[#1d6fa5] [&_a]:underline [&_h2]:font-display [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_p]:mt-4 [&_ul]:mt-4"
        dangerouslySetInnerHTML={{ __html: post.content_html }}
      />
    </main>
  );
}
