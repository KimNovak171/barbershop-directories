import type { Metadata } from "next";
import Link from "next/link";
import { formatBlogDate, getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guides and tips on choosing a barbershop, haircuts, grooming, and barbershop culture from BarbershopDirectories.com.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog | BarbershopDirectories.com",
    description:
      "Guides and tips on barbershops, haircuts, and men’s grooming.",
    url: "/blog",
    siteName: "BarbershopDirectories.com",
    type: "website",
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
          BarbershopDirectories.com
        </p>
        <h1 className="text-3xl font-semibold text-navy sm:text-4xl">Blog</h1>
        <p className="max-w-2xl text-sm text-foreground/80">
          Practical guides on finding a barbershop, communicating with your
          barber, and keeping your haircut looking sharp.
        </p>
      </header>

      <ul className="mt-10 divide-y divide-teal/10 border-t border-teal/10">
        {posts.map((post) => (
          <li key={post.slug} className="py-6">
            <article className="space-y-2">
              <time
                dateTime={post.date}
                className="text-xs font-medium text-foreground/60"
              >
                {formatBlogDate(post.date)}
              </time>
              <h2 className="text-lg font-semibold text-navy">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="max-w-3xl text-sm leading-relaxed text-foreground/80">
                {post.description}
              </p>
              <p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs font-semibold text-teal hover:text-teal-soft"
                >
                  Read article →
                </Link>
              </p>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
