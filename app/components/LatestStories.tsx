import BlogCard from "./BlogCard";
import { getSignalorBlogPosts } from "../lib/signalor";

/** Published Signalor blogs on the homepage, rendered as the site's standard
 *  BlogCard (image, category, title, excerpt, meta) — the same card used on the
 *  /blogs explorer — instead of a bare text strip. Hidden when there are none. */
export default async function LatestStories() {
  const posts = await getSignalorBlogPosts();
  if (posts.length === 0) return null;

  return (
    <section className="pt-8">
      <h2 className="font-display border-b border-border pb-3 text-2xl font-bold text-foreground">
        From the Blog
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
