/**
 * Build Next.js Metadata with matching Open Graph + Twitter fields.
 * When `image` is omitted, the site-wide `opengraph-image` file still applies.
 */
export function pageSocialMetadata({
  title,
  description,
  image,
  imageAlt,
  type = "website",
  path,
}) {
  const desc = description?.trim() || undefined;
  const imageUrl = image?.trim() || "";
  const images = imageUrl
    ? [{ url: imageUrl, alt: imageAlt || title }]
    : undefined;

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type,
      ...(path ? { url: path } : {}),
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      ...(images ? { images: [imageUrl] } : {}),
    },
  };
}
