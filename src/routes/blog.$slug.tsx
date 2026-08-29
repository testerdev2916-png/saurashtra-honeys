import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, SectionEyebrow } from "@/components/site/Layout";
import { getPublicPost, type PublicBlogPost } from "@/lib/blog-server.functions";
import {
  resolvePostImage,
  formatPostDate,
  renderMarkdown,
  extractTableOfContents,
} from "@/lib/blog-client-helpers";
import {
  Calendar,
  Clock,
  ChevronRight,
  ArrowRight,
  Copy,
  Check,
  BookOpen,
} from "lucide-react";
import { StructuredData, breadcrumbLd } from "@/components/site/StructuredData";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    return await getPublicPost({ data: { slug: params.slug } });
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    return {
      meta: post
        ? [
            { title: `${post.seo_title || post.title} | Saurashtra Honey Journal` },
            { name: "description", content: (post.seo_description || post.excerpt || "").slice(0, 155) },
            { property: "og:title", content: post.title },
            { property: "og:description", content: post.excerpt || "" },
            { property: "og:type", content: "article" },
            { property: "article:published_time", content: post.published_at || post.created_at },
            { property: "article:section", content: post.category_name || "Honey & Health" },
            { name: "twitter:card", content: "summary_large_image" },
          ]
        : [
            { title: "Article Not Found | Saurashtra Honey Journal" },
          ],
    };
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-page py-24 text-center">
        <h1 className="font-serif text-4xl font-bold text-espresso">Article not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">The story you are looking for may have been moved or unpublished.</p>
        <Link to="/blog" className="mt-6 inline-block bg-espresso text-cream rounded-full px-7 py-3.5 text-xs font-bold tracking-widest hover:bg-burnt-orange transition-all">
          BACK TO JOURNAL
        </Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: ({ reset }) => (
    <SiteLayout>
      <div className="container-page py-24 text-center">
        <h1 className="font-serif text-4xl font-bold text-espresso">Something went wrong</h1>
        <button onClick={reset} className="mt-4 text-burnt-orange border-b border-burnt-orange font-bold">
          Try again
        </button>
      </div>
    </SiteLayout>
  ),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post, related } = Route.useLoaderData();
  const [copied, setCopied] = useState(false);

  if (!post) {
    return (
      <SiteLayout>
        <div className="container-page py-24 text-center">
          <h1 className="font-serif text-4xl font-bold text-espresso">Article not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">The story you are looking for may have been moved or unpublished.</p>
          <Link to="/blog" className="mt-6 inline-block bg-espresso text-cream rounded-full px-7 py-3.5 text-xs font-bold tracking-widest hover:bg-burnt-orange transition-all">
            BACK TO JOURNAL
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const imageSrc = resolvePostImage(post.cover_image_url, post.category_name || post.slug);
  const displayDate = formatPostDate(post.published_at || post.created_at);
  const readTime = post.reading_time || "5 min read";
  const categoryName = post.category_name || "Honey & Health";
  const authorName = post.author_name || "Saurashtra Honey Editorial Team";
  const toc = extractTableOfContents(post.body_markdown);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || "",
    image: [imageSrc],
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.published_at || post.created_at,
    articleSection: categoryName,
    author: { "@type": "Organization", name: authorName },
    publisher: {
      "@type": "Organization",
      name: "Saurashtra Honey",
      logo: { "@type": "ImageObject", url: "/favicon.ico" },
    },
    mainEntityOfPage: `/blog/${post.slug}`,
  };

  const handleShare = (type: string) => {
    const url = window.location.href;
    if (type === "copy") {
      void navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Article link copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    } else if (type === "whatsapp") {
      window.open(
        `https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + " - " + url)}`,
        "_blank"
      );
    } else if (type === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}`,
        "_blank"
      );
    }
  };

  return (
    <SiteLayout>
      <StructuredData data={articleLd} />
      <StructuredData
        data={breadcrumbLd([
          { name: "Home", url: "/" },
          { name: "Journal", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ])}
      />

      {/* BREADCRUMB */}
      <div className="container-page py-6 text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
        <Link to="/" className="hover:text-burnt-orange font-semibold">
          Home
        </Link>{" "}
        <ChevronRight className="size-3" />
        <Link to="/blog" className="hover:text-burnt-orange font-semibold">
          Journal
        </Link>{" "}
        <ChevronRight className="size-3" />
        <span className="text-espresso font-semibold line-clamp-1">{post.title}</span>
      </div>

      <article className="container-page pb-16 grid lg:grid-cols-[1fr_340px] gap-10">
        <div className="max-w-[780px]">
          <span className="inline-block bg-espresso text-cream text-[10px] font-bold tracking-widest px-3 py-1 rounded-md uppercase shadow-xs">
            {categoryName}
          </span>
          <h1 className="mt-4 font-serif text-3xl md:text-5xl font-bold text-espresso leading-tight">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center justify-between flex-wrap gap-4 border-b border-border/80 pb-5">
            <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5 text-burnt-orange" /> {displayDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-burnt-orange" /> {readTime}
              </span>
            </div>
            {/* SOCIAL SHARING */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">
                Share:
              </span>
              <button
                type="button"
                onClick={() => handleShare("whatsapp")}
                className="px-3 py-1.5 rounded-lg bg-cream-deep/60 hover:bg-cream-deep text-xs font-bold text-espresso transition-colors"
              >
                WhatsApp
              </button>
              <button
                type="button"
                onClick={() => handleShare("twitter")}
                className="px-3 py-1.5 rounded-lg bg-cream-deep/60 hover:bg-cream-deep text-xs font-bold text-espresso transition-colors"
              >
                X / Tweet
              </button>
              <button
                type="button"
                onClick={() => handleShare("copy")}
                className="px-3 py-1.5 rounded-lg bg-cream-deep/60 hover:bg-cream-deep text-xs font-bold text-espresso inline-flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="size-3 text-botanical" /> : <Copy className="size-3" />}{" "}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <img
            src={imageSrc}
            alt={post.title}
            className="mt-7 w-full aspect-[16/9] object-cover rounded-2xl border border-border/80 shadow-soft"
          />

          {/* DYNAMIC TABLE OF CONTENTS */}
          {toc.length > 0 && (
            <div className="mt-8 bg-cream-deep/50 border border-border/80 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center gap-2 font-serif text-lg font-bold text-espresso mb-3">
                <BookOpen className="size-4 text-burnt-orange" /> Table of Contents
              </div>
              <ul className="space-y-2 text-xs md:text-sm font-semibold text-espresso/80">
                {toc.map((item) => (
                  <li
                    key={item.id}
                    className={item.level === 3 ? "pl-4 text-muted-foreground" : ""}
                  >
                    <a
                      href={`#${item.id}`}
                      className="hover:text-burnt-orange transition-colors"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ARTICLE CONTENT */}
          <div className="prose prose-lg max-w-none mt-8 text-foreground/90 space-y-6 text-base leading-relaxed">
            {post.excerpt && (
              <p className="text-lg text-espresso font-serif italic bg-cream/40 p-5 rounded-2xl border-l-4 border-burnt-orange leading-relaxed">
                {post.excerpt}
              </p>
            )}
            {renderMarkdown(post.body_markdown)}
          </div>

          {/* AUTHOR BIO */}
          <div className="mt-12 p-6 md:p-8 rounded-2xl bg-cream-deep/60 border border-border/80 shadow-soft flex items-start gap-5">
            <div className="size-16 rounded-full bg-espresso text-cream flex items-center justify-center font-serif text-xl font-bold shrink-0 shadow-sm">
              SH
            </div>
            <div>
              <SectionEyebrow>Author & Research</SectionEyebrow>
              <h3 className="font-serif text-xl font-bold text-espresso mt-0.5">
                {authorName}
              </h3>
              <p className="mt-2 text-xs md:text-sm text-muted-foreground leading-relaxed">
                Curated by our veteran beekeepers, NABL-certified food scientists, and Ayurvedic health practitioners in Saurashtra, Gujarat.
              </p>
            </div>
          </div>
        </div>

        {/* SIDEBAR - RELATED & EXPLORE */}
        <aside className="space-y-6">
          <div className="bg-white border border-border/80 rounded-2xl p-6 shadow-soft">
            <h3 className="font-serif text-lg font-bold text-espresso mb-4">
              Related Articles
            </h3>
            {related.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">
                No related articles found.
              </p>
            ) : (
              <ul className="space-y-4 divide-y divide-border/60">
                {related.map((p, i) => {
                  const rImage = resolvePostImage(p.cover_image_url, p.category_name || p.slug);
                  const rDate = formatPostDate(p.published_at || p.created_at);
                  const rReadTime = p.reading_time || "5 min read";

                  return (
                    <li key={p.id} className={`flex gap-3.5 ${i > 0 ? "pt-4" : ""}`}>
                      <Link to="/blog/$slug" params={{ slug: p.slug }} className="shrink-0">
                        <img
                          src={rImage}
                          alt={p.title}
                          loading="lazy"
                          className="size-16 rounded-xl object-cover border border-border/60"
                        />
                      </Link>
                      <div className="text-sm">
                        <Link to="/blog/$slug" params={{ slug: p.slug }}>
                          <div className="font-bold text-espresso leading-snug text-xs hover:text-burnt-orange transition-colors line-clamp-2">
                            {p.title}
                          </div>
                        </Link>
                        <div className="mt-1.5 flex items-center gap-2.5 text-[11px] font-medium text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3 text-burnt-orange" /> {rDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="size-3 text-burnt-orange" /> {rReadTime}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="bg-espresso text-cream rounded-2xl p-6 shadow-lg border border-white/10">
            <SectionEyebrow>Pure Honey Collections</SectionEyebrow>
            <h3 className="mt-1 font-serif text-xl font-bold">Taste the Story</h3>
            <p className="mt-2 text-xs text-cream/75 leading-relaxed">
              Explore our unheated, single-flora honeys harvested ethically from the floral belts of Saurashtra.
            </p>
            <Link
              to="/shop"
              className="mt-5 block w-full bg-burnt-orange text-white rounded-xl py-3 text-xs font-bold tracking-widest text-center hover:bg-terracotta transition-all shadow-sm"
            >
              SHOP RAW HONEY
            </Link>
          </div>
        </aside>
      </article>

      {/* FOOTER CTA */}
      <section className="container-page pb-20">
        <div className="bg-cream-deep/60 border border-border/80 rounded-3xl p-8 grid md:grid-cols-[1fr_auto] gap-6 items-center shadow-soft">
          <div>
            <h3 className="font-serif text-2xl font-bold text-espresso">
              Want to Learn More About Ethical Beekeeping?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              Join our bee farming community and explore the art of natural beekeeping with Saurashtra Honey.
            </p>
          </div>
          <Link
            to="/bee-farming"
            className="inline-flex items-center gap-2 bg-espresso text-cream rounded-full px-7 py-3.5 text-xs font-bold tracking-widest hover:bg-burnt-orange transition-all shadow-sm shrink-0"
          >
            EXPLORE BEE FARMING <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
