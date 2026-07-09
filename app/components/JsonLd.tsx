/**
 * Renders a JSON-LD structured-data block for SEO / rich results.
 * Server-safe: emits a single <script type="application/ld+json"> tag.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is trusted, static JSON — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
