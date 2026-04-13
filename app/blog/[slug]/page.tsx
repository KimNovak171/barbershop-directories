import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatBlogDate,
  getPostBySlug,
  getPostSlugs,
  markdownToHtml,
} from "@/lib/blog";

const siteUrl = "https://barbershopdirectories.com";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return { title: "Article not found" };
  }
  const canonicalPath = `/blog/${post.slug}`;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        "en-us": canonicalUrl,
      },
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonicalPath,
      siteName: "BarbershopDirectories.com",
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const contentHtml = await markdownToHtml(post.contentMarkdown);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "BarbershopDirectories.com",
        item: `${siteUrl}/`,
      },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${siteUrl}/blog/${post.slug}`,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <nav className="text-xs text-foreground/70" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link href="/" className="hover:text-teal">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/blog" className="hover:text-teal">
              Blog
            </Link>
          </li>
        </ol>
      </nav>

      <article className="mt-6 space-y-6">
        <header className="space-y-3 border-b border-teal/10 pb-6">
          <time
            dateTime={post.date}
            className="text-xs font-medium text-foreground/60"
          >
            {formatBlogDate(post.date)}
          </time>
          <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
            {post.title}
          </h1>
          <p className="text-sm leading-relaxed text-foreground/80">
            {post.description}
          </p>
        </header>

        <div
          className="blog-markdown text-sm leading-relaxed text-foreground/90"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>

      <p className="mt-10 border-t border-teal/10 pt-8">
        <Link
          href="/blog"
          className="text-sm font-semibold text-teal hover:text-teal-soft"
        >
          ← All articles
        </Link>
      </p>
    </div>
  );
}
