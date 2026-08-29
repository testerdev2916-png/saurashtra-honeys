import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState, useMemo } from "react";
import {
  ArrowRight,
  Calendar,
  Clock,
  Search,
  Check,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { PageHeroSlider } from "@/components/site/PageHeroSlider";
import { PremiumMobileCarousel } from "@/components/site/PremiumMobileCarousel";
import {
  listPublicPosts,
  getPopularPosts,
  getFeaturedPost,
  type PublicBlogPost,
} from "@/lib/blog-server.functions";
import {
  resolvePostImage,
  formatPostDate,
} from "@/lib/blog-client-helpers";
import { subscribeNewsletter } from "@/lib/newsletter.functions";
import { useServerFn } from "@tanstack/react-start";

// Custom hook for native drag-to-scroll
function useDragScroll() {
  const ref = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const ele = ref.current;
    if (!ele) return;
    
    let pos = { top: 0, left: 0, x: 0, y: 0 };
    let isDown = false;

    const mouseDownHandler = function (e: MouseEvent) {
      isDown = true;
      ele.style.cursor = 'grabbing';
      ele.style.userSelect = 'none';
      pos = {
        left: ele.scrollLeft,
        top: ele.scrollTop,
        x: e.clientX,
        y: e.clientY,
      };
    };

    const mouseMoveHandler = function (e: MouseEvent) {
      if (!isDown) return;
      e.preventDefault();
      const dx = e.clientX - pos.x;
      const dy = e.clientY - pos.y;
      ele.scrollTop = pos.top - dy;
      ele.scrollLeft = pos.left - dx;
    };

    const mouseUpHandler = function () {
      isDown = false;
      ele.style.cursor = 'grab';
      ele.style.removeProperty('user-select');
    };

    ele.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('mouseup', mouseUpHandler);

    return () => {
      ele.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('mousemove', mouseMoveHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
    };
  }, []);

  return ref;
}

// Assets matching our warm golden farm-origin photography
import beeFarmImg from "@/assets/bee-farm.jpg";
import beeFlowerImg from "@/assets/bee-flower.jpg";
import honeyDrizzleImg from "@/assets/honey-drizzle.jpg";
import heroProductsImg from "@/assets/hero-products.jpg";
import combImg from "@/assets/honeycomb-bees.jpg";
import familyImg from "@/assets/family-honey.jpg";
import ajwainImg from "@/assets/prod-ajwain.jpg";

type BlogSearch = {
  cat?: string;
  q?: string;
  page?: number;
};

export const Route = createFileRoute("/blog")({
  validateSearch: (search: Record<string, unknown>): BlogSearch => ({
    cat: typeof search.cat === "string" ? search.cat : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
    page: typeof search.page === "number" ? search.page : 1,
  }),
  loaderDeps: ({ search }) => ({
    cat: search.cat,
    q: search.q,
    page: search.page,
  }),
  loader: async ({ deps }) => {
    const [postsData, popularData, featuredData] = await Promise.all([
      listPublicPosts({
        data: { cat: deps.cat, q: deps.q, page: deps.page || 1, pageSize: 9 },
      }),
      getPopularPosts({ data: { limit: 4 } }),
      getFeaturedPost(),
    ]);
    return {
      posts: postsData,
      popular: popularData.rows,
      featured: featuredData.post,
    };
  },
  head: () => ({
    meta: [
      { title: "Journal — Stories from Our Hive to Yours | Saurashtra Honey" },
      {
        name: "description",
        content:
          "Discover helpful tips, inspiring stories and the latest updates from Saurashtra Honey Bee Farm. Read articles on bees, health, sustainability and natural living.",
      },
      { property: "og:title", content: "Journal — Saurashtra Honey" },
      {
        property: "og:description",
        content: "Stories from Our Hive to Yours. Honey. Knowledge. Inspiration.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlogPage,
});

const CATEGORY_TABS = [
  "All Posts",
  "Honey & Health",
  "Bee Farming",
  "Natural Living",
  "Recipes",
  "Sustainability",
  "Honey Guide",
  "Our Farm",
];

function BlogPage() {
  const { posts, popular, featured } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/blog" });

  const activeCategory = search.cat || "All Posts";
  const activeQuery = search.q || "";

  const [searchInput, setSearchInput] = useState(activeQuery);
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<
    "idle" | "submitting" | "success" | "already" | "error"
  >("idle");
  const [newsletterMsg, setNewsletterMsg] = useState("");

  const subscribe = useServerFn(subscribeNewsletter);
  
  // Attach the drag-to-scroll hook
  const scrollContainerRef = useDragScroll();

  function handleCategoryClick(cat: string) {
    void navigate({
      search: (prev) => ({
        ...prev,
        cat: cat === "All Posts" ? undefined : cat,
        page: 1,
      }),
    });
  }

  function handleSearchSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    void navigate({
      search: (prev) => ({
        ...prev,
        q: searchInput.trim() || undefined,
        page: 1,
      }),
    });
  }

  async function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setNewsletterStatus("error");
      setNewsletterMsg("Please enter a valid email address.");
      return;
    }
    setNewsletterStatus("submitting");
    setNewsletterMsg("");
    try {
      const res = await subscribe({
        data: { email: cleanEmail, source: "journal-newsletter" },
      });
      if (res.already) {
        setNewsletterStatus("already");
        setNewsletterMsg("You are already subscribed to our Journal newsletter!");
      } else {
        setNewsletterStatus("success");
        setNewsletterMsg(
          "Successfully subscribed! Check your inbox for welcome stories."
        );
        setEmail("");
      }
    } catch (err) {
      setNewsletterStatus("error");
      setNewsletterMsg(
        (err as Error).message || "Something went wrong. Please try again."
      );
    }
  }

  const displayedPosts = useMemo(() => {
    if (posts.rows && posts.rows.length > 0) {
      return posts.rows.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt || "Click to read full story from the hive...",
        category: p.category_name || "Honey & Health",
        date: formatPostDate(p.published_at || p.created_at),
        readTime: p.reading_time || "5 min read",
        image: resolvePostImage(p.cover_image_url, p.category_name || p.slug),
      }));
    }

    return [];
  }, [posts.rows, activeCategory]);

  return (
    <SiteLayout>
      {/* =========================================================================
          2. JOURNAL HERO (Left: Eyebrow + Serif Heading + Orange Italics + CTA, Right: Apiary Photo)
         ========================================================================= */}
      <PageHeroSlider page="blog" />

      {/* =========================================================================
          4. JOURNAL INTRODUCTION (#journal-grid)
         ========================================================================= */}
      <section
        id="journal-grid"
        className="pt-16 sm:pt-24 pb-12 sm:pb-16 bg-cream border-b border-border/80"
      >
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <div className="text-xs font-bold tracking-[0.25em] uppercase text-brand-orange mb-2">
              OUR JOURNAL
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-espresso tracking-tight">
              Honey. Knowledge. Inspiration.
            </h2>
            <p className="text-sm sm:text-base text-espresso/80 leading-relaxed mt-3 max-w-xl mx-auto">
              Read our latest articles on bees, health, sustainability and
              natural living.
            </p>
          </div>

          {/* Category Filter Tabs - Premium Horizontal Navigation */}
          <div className="w-full relative -mx-4 sm:mx-0 overflow-hidden">
            <div 
              ref={scrollContainerRef}
              className="flex items-center gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory pb-6 pt-2 px-5 sm:px-0 scroll-smooth no-scrollbar cursor-grab"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {CATEGORY_TABS.map((cat, index) => {
                const isSelected = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryClick(cat)}
                    className={`shrink-0 snap-center px-6 sm:px-8 py-3.5 rounded-[24px] text-[12px] sm:text-[13px] font-bold tracking-wider whitespace-nowrap transition-all shadow-[0_4px_14px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] ${
                      isSelected
                        ? "bg-[#2B2118] text-[#FDFBF7]"
                        : "bg-white text-[#2B2118] hover:bg-[#F8F5EF] border border-[#D97706]/15"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search bar row */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-6 max-w-md mx-auto relative"
          >
            <Search className="size-4 text-espresso/50 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search articles by topic..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-11 pr-24 py-3 bg-white border border-border/80 rounded-full text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:border-brand-orange shadow-xs"
            />
            {searchInput && (
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-orange text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-brand-orange-hover transition-colors"
              >
                Search
              </button>
            )}
          </form>
        </div>
      </section>

      {/* =========================================================================
          5. ARTICLE / BLOG GRID (Full-width 3-Column Editorial Grid matching reference)
         ========================================================================= */}
      <section className="py-12 sm:py-20 bg-cream">
        <div className="container-page">
          {displayedPosts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-border/80 p-12 text-center shadow-soft max-w-xl mx-auto">
              <div className="size-14 rounded-2xl bg-cream-deep flex items-center justify-center mx-auto text-brand-orange mb-4">
                <Search className="size-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-espresso">
                No articles found
              </h3>
              <p className="mt-2 text-sm text-espresso/75 leading-relaxed">
                We couldn&apos;t find any published articles matching your
                criteria. Try selecting &quot;All Posts&quot; or resetting your
                search.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  handleCategoryClick("All Posts");
                }}
                className="mt-6 inline-flex items-center gap-2 bg-brand-orange text-white rounded-full px-7 py-3.5 text-xs font-bold tracking-widest uppercase hover:bg-brand-orange-hover transition-all"
              >
                RESET ALL FILTERS
              </button>
            </div>
          ) : (
            <>
              {/* Mobile View */}
              <div className="block md:hidden mt-2">
                <PremiumMobileCarousel
                  items={displayedPosts}
                  slideClassName="flex-[0_0_86vw] min-w-0"
                  renderItem={(post) => (
                    <article
                      key={post.slug}
                      className="bg-white rounded-[22px] border border-border/80 overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between h-full group"
                    >
                      <div>
                        {/* Top Featured Image */}
                        <Link
                          to="/blog/$slug"
                          params={{ slug: post.slug }}
                          className="block relative overflow-hidden aspect-[4/3] bg-cream-deep"
                        >
                          <img
                            src={post.image}
                            alt={post.title}
                            loading="lazy"
                            className="w-full h-full object-cover pointer-events-none"
                          />
                        </Link>

                        {/* Content Area */}
                        <div className="p-6">
                          <span className="text-[11px] font-bold tracking-[0.18em] text-brand-orange uppercase px-3 py-1 rounded-full bg-cream border border-border/70 inline-block mb-3.5">
                            {post.category}
                          </span>

                          <Link to="/blog/$slug" params={{ slug: post.slug }}>
                            <h3 className="font-serif text-[18px] font-bold text-espresso leading-snug line-clamp-2">
                              {post.title}
                            </h3>
                          </Link>

                          <p className="text-[14px] text-espresso/75 leading-relaxed mt-2.5 line-clamp-2">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>

                      {/* Bottom Metadata Bar */}
                      <div className="px-6 pb-6 pt-0">
                        <div className="pt-4 border-t border-border/60 flex items-center justify-between text-[12px] font-medium text-espresso/70">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="size-3.5 text-brand-orange" />{" "}
                              {post.date}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="size-3.5 text-brand-orange" />{" "}
                              {post.readTime}
                            </span>
                          </div>

                          <Link
                            to="/blog/$slug"
                            params={{ slug: post.slug }}
                            aria-label={`Read more about ${post.title}`}
                            className="text-brand-orange font-bold hover:translate-x-1 transition-transform"
                          >
                            <ArrowRight className="size-4" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  )}
                />
              </div>

              {/* Desktop/Tablet View */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {displayedPosts.map((post) => (
                  <article
                    key={post.slug}
                    className="bg-white rounded-3xl border border-border/80 overflow-hidden shadow-xs hover:shadow-soft transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Featured Image */}
                      <Link
                        to="/blog/$slug"
                        params={{ slug: post.slug }}
                        className="block relative overflow-hidden aspect-[4/3] bg-cream-deep"
                      >
                        <img
                          src={post.image}
                          alt={post.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      </Link>

                      {/* Content Area */}
                      <div className="p-6 sm:p-7">
                        <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] text-brand-orange uppercase px-3 py-1 rounded-full bg-cream border border-border/70 inline-block mb-3.5">
                          {post.category}
                        </span>

                        <Link to="/blog/$slug" params={{ slug: post.slug }}>
                          <h3 className="font-serif text-lg sm:text-xl font-bold text-espresso group-hover:text-brand-orange transition-colors leading-snug line-clamp-2">
                            {post.title}
                          </h3>
                        </Link>

                        <p className="text-xs sm:text-sm text-espresso/75 leading-relaxed mt-2.5 line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Metadata Bar */}
                    <div className="px-6 sm:px-7 pb-6 pt-0">
                      <div className="pt-4 border-t border-border/60 flex items-center justify-between text-[11px] sm:text-xs font-medium text-espresso/70">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="size-3.5 text-brand-orange" />{" "}
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="size-3.5 text-brand-orange" />{" "}
                            {post.readTime}
                          </span>
                        </div>

                        <Link
                          to="/blog/$slug"
                          params={{ slug: post.slug }}
                          aria-label={`Read more about ${post.title}`}
                          className="text-brand-orange font-bold hover:translate-x-1 transition-transform"
                        >
                          <ArrowRight className="size-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* VIEW ALL ARTICLES → Pill Button */}
              <div className="mt-12 sm:mt-16 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    handleCategoryClick("All Posts");
                  }}
                  className="inline-flex items-center gap-2 bg-white hover:bg-cream border border-brand-orange text-brand-orange rounded-full px-8 py-3.5 text-xs font-bold tracking-widest uppercase transition-all shadow-xs hover:shadow-sm"
                >
                  <span>VIEW ALL ARTICLES</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* =========================================================================
          11. NEWSLETTER / SUBSCRIBE SECTION (Cream Banner Card matching reference)
         ========================================================================= */}
      <section className="py-8 sm:py-12 bg-cream border-t border-border/80">
        <div className="container-page">
          <div className="bg-[#FFF9ED] border border-border/80 rounded-3xl p-8 sm:p-12 shadow-xs relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left Text Column (6 cols) */}
              <div className="lg:col-span-6 space-y-2">
                <div className="text-xs font-bold tracking-[0.25em] uppercase text-brand-orange">
                  STAY UPDATED
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-espresso leading-tight">
                  Join Our Honey Journey
                </h2>
                <p className="text-sm sm:text-base text-espresso/75 leading-relaxed pt-1">
                  Get the latest stories, tips and farm updates right in your
                  inbox.
                </p>
              </div>

              {/* Right Subscription Form Column (6 cols) */}
              <div className="lg:col-span-6">
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="flex flex-col sm:flex-row gap-3 max-w-md lg:max-w-none lg:ml-auto"
                >
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={newsletterStatus === "submitting"}
                    className="flex-1 px-6 py-4 bg-white border border-border/80 rounded-full text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:border-brand-orange shadow-xs disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={newsletterStatus === "submitting"}
                    className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs sm:text-sm tracking-widest px-8 py-4 rounded-full uppercase shadow-md hover:scale-[1.02] transition-all disabled:opacity-50 shrink-0"
                  >
                    {newsletterStatus === "submitting"
                      ? "SUBSCRIBING..."
                      : "SUBSCRIBE"}
                  </button>
                </form>

                {/* Newsletter Status Feedback */}
                {newsletterStatus === "success" && (
                  <div className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full">
                    <Check className="size-4 shrink-0" />
                    <span>{newsletterMsg}</span>
                  </div>
                )}
                {newsletterStatus === "already" && (
                  <div className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 px-4 py-2 rounded-full">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{newsletterMsg}</span>
                  </div>
                )}
                {newsletterStatus === "error" && (
                  <div className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-red-700 bg-red-50 border border-red-200 px-4 py-2 rounded-full">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{newsletterMsg}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Decorative bee flight icon on right edge */}
            <div className="absolute top-6 right-8 text-2xl sm:text-3xl opacity-80 pointer-events-none select-none hidden sm:block">
              🐝
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-brand-orange/10 rounded-full blur-2xl pointer-events-none" />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
