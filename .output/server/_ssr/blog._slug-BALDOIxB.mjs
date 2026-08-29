import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Gt as Check, Ht as ChevronRight, Kt as Calendar, Nt as Copy, Pt as Clock, Zt as BookOpen, in as ArrowRight } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as SiteLayout, t as SectionEyebrow } from "./Layout-BROfU7ZF.mjs";
import { i as resolvePostImage, n as formatPostDate, r as renderMarkdown, t as extractTableOfContents } from "./blog-client-helpers-B6pLNpSM.mjs";
import { t as Route } from "./blog._slug-Bq1PE4Tr.mjs";
import { n as breadcrumbLd, t as StructuredData } from "./StructuredData-C0TBI3qI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog._slug-BALDOIxB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BlogPostPage() {
	const { post, related } = Route.useLoaderData();
	const [copied, setCopied] = (0, import_react.useState)(false);
	if (!post) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-4xl font-bold text-espresso",
				children: "Article not found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "The story you are looking for may have been moved or unpublished."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/blog",
				className: "mt-6 inline-block bg-espresso text-cream rounded-full px-7 py-3.5 text-xs font-bold tracking-widest hover:bg-burnt-orange transition-all",
				children: "BACK TO JOURNAL"
			})
		]
	}) });
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
		author: {
			"@type": "Organization",
			name: authorName
		},
		publisher: {
			"@type": "Organization",
			name: "Saurashtra Honey",
			logo: {
				"@type": "ImageObject",
				url: "/favicon.ico"
			}
		},
		mainEntityOfPage: `/blog/${post.slug}`
	};
	const handleShare = (type) => {
		const url = window.location.href;
		if (type === "copy") {
			navigator.clipboard.writeText(url);
			setCopied(true);
			toast.success("Article link copied to clipboard!");
			setTimeout(() => setCopied(false), 3e3);
		} else if (type === "whatsapp") window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + " - " + url)}`, "_blank");
		else if (type === "twitter") window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}`, "_blank");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StructuredData, { data: articleLd }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StructuredData, { data: breadcrumbLd([
			{
				name: "Home",
				url: "/"
			},
			{
				name: "Journal",
				url: "/blog"
			},
			{
				name: post.title,
				url: `/blog/${post.slug}`
			}
		]) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page py-6 text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "hover:text-burnt-orange font-semibold",
					children: "Home"
				}),
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/blog",
					className: "hover:text-burnt-orange font-semibold",
					children: "Journal"
				}),
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-espresso font-semibold line-clamp-1",
					children: post.title
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "container-page pb-16 grid lg:grid-cols-[1fr_340px] gap-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-[780px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-block bg-espresso text-cream text-[10px] font-bold tracking-widest px-3 py-1 rounded-md uppercase shadow-xs",
						children: categoryName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 font-serif text-3xl md:text-5xl font-bold text-espresso leading-tight",
						children: post.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center justify-between flex-wrap gap-4 border-b border-border/80 pb-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4 text-xs font-semibold text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3.5 text-burnt-orange" }),
									" ",
									displayDate
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5 text-burnt-orange" }),
									" ",
									readTime
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1",
									children: "Share:"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => handleShare("whatsapp"),
									className: "px-3 py-1.5 rounded-lg bg-cream-deep/60 hover:bg-cream-deep text-xs font-bold text-espresso transition-colors",
									children: "WhatsApp"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => handleShare("twitter"),
									className: "px-3 py-1.5 rounded-lg bg-cream-deep/60 hover:bg-cream-deep text-xs font-bold text-espresso transition-colors",
									children: "X / Tweet"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => handleShare("copy"),
									className: "px-3 py-1.5 rounded-lg bg-cream-deep/60 hover:bg-cream-deep text-xs font-bold text-espresso inline-flex items-center gap-1 transition-colors",
									children: [
										copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3 text-botanical" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3" }),
										" ",
										copied ? "Copied!" : "Copy"
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: imageSrc,
						alt: post.title,
						className: "mt-7 w-full aspect-[16/9] object-cover rounded-2xl border border-border/80 shadow-soft"
					}),
					toc.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 bg-cream-deep/50 border border-border/80 rounded-2xl p-6 shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 font-serif text-lg font-bold text-espresso mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4 text-burnt-orange" }), " Table of Contents"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2 text-xs md:text-sm font-semibold text-espresso/80",
							children: toc.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: item.level === 3 ? "pl-4 text-muted-foreground" : "",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: `#${item.id}`,
									className: "hover:text-burnt-orange transition-colors",
									children: item.text
								})
							}, item.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "prose prose-lg max-w-none mt-8 text-foreground/90 space-y-6 text-base leading-relaxed",
						children: [post.excerpt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg text-espresso font-serif italic bg-cream/40 p-5 rounded-2xl border-l-4 border-burnt-orange leading-relaxed",
							children: post.excerpt
						}), renderMarkdown(post.body_markdown)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-12 p-6 md:p-8 rounded-2xl bg-cream-deep/60 border border-border/80 shadow-soft flex items-start gap-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-16 rounded-full bg-espresso text-cream flex items-center justify-center font-serif text-xl font-bold shrink-0 shadow-sm",
							children: "SH"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionEyebrow, { children: "Author & Research" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-serif text-xl font-bold text-espresso mt-0.5",
								children: authorName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs md:text-sm text-muted-foreground leading-relaxed",
								children: "Curated by our veteran beekeepers, NABL-certified food scientists, and Ayurvedic health practitioners in Saurashtra, Gujarat."
							})
						] })]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white border border-border/80 rounded-2xl p-6 shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-lg font-bold text-espresso mb-4",
						children: "Related Articles"
					}), related.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground py-4 text-center",
						children: "No related articles found."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-4 divide-y divide-border/60",
						children: related.map((p, i) => {
							const rImage = resolvePostImage(p.cover_image_url, p.category_name || p.slug);
							const rDate = formatPostDate(p.published_at || p.created_at);
							const rReadTime = p.reading_time || "5 min read";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: `flex gap-3.5 ${i > 0 ? "pt-4" : ""}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/blog/$slug",
									params: { slug: p.slug },
									className: "shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: rImage,
										alt: p.title,
										loading: "lazy",
										className: "size-16 rounded-xl object-cover border border-border/60"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/blog/$slug",
										params: { slug: p.slug },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-bold text-espresso leading-snug text-xs hover:text-burnt-orange transition-colors line-clamp-2",
											children: p.title
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1.5 flex items-center gap-2.5 text-[11px] font-medium text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3 text-burnt-orange" }),
												" ",
												rDate
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3 text-burnt-orange" }),
												" ",
												rReadTime
											]
										})]
									})]
								})]
							}, p.id);
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-espresso text-cream rounded-2xl p-6 shadow-lg border border-white/10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionEyebrow, { children: "Pure Honey Collections" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-1 font-serif text-xl font-bold",
							children: "Taste the Story"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-cream/75 leading-relaxed",
							children: "Explore our unheated, single-flora honeys harvested ethically from the floral belts of Saurashtra."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop",
							className: "mt-5 block w-full bg-burnt-orange text-white rounded-xl py-3 text-xs font-bold tracking-widest text-center hover:bg-terracotta transition-all shadow-sm",
							children: "SHOP RAW HONEY"
						})
					]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "container-page pb-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-cream-deep/60 border border-border/80 rounded-3xl p-8 grid md:grid-cols-[1fr_auto] gap-6 items-center shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-serif text-2xl font-bold text-espresso",
					children: "Want to Learn More About Ethical Beekeeping?"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground leading-relaxed",
					children: "Join our bee farming community and explore the art of natural beekeeping with Saurashtra Honey."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/bee-farming",
					className: "inline-flex items-center gap-2 bg-espresso text-cream rounded-full px-7 py-3.5 text-xs font-bold tracking-widest hover:bg-burnt-orange transition-all shadow-sm shrink-0",
					children: ["EXPLORE BEE FARMING ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
				})]
			})
		})
	] });
}
//#endregion
export { BlogPostPage as component };
