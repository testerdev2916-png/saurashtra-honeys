import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Bt as CircleAlert, D as Search, Gt as Check, Kt as Calendar, Pt as Clock, in as ArrowRight } from "../_libs/lucide-react.mjs";
import { t as useServerFn } from "./useServerFn-BqzygRuj.mjs";
import { n as subscribeNewsletter } from "./newsletter.functions-CwCLhrRj.mjs";
import { n as SiteLayout } from "./Layout-BROfU7ZF.mjs";
import { t as Route } from "./blog-ClA-loxX.mjs";
import { i as resolvePostImage, n as formatPostDate } from "./blog-client-helpers-B6pLNpSM.mjs";
import { t as PageHeroSlider } from "./PageHeroSlider-B2niNRj-.mjs";
import { t as PremiumMobileCarousel } from "./PremiumMobileCarousel-DywbpNAf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog-C55MROrx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useDragScroll() {
	const ref = import_react.useRef(null);
	import_react.useEffect(() => {
		const ele = ref.current;
		if (!ele) return;
		let pos = {
			top: 0,
			left: 0,
			x: 0,
			y: 0
		};
		let isDown = false;
		const mouseDownHandler = function(e) {
			isDown = true;
			ele.style.cursor = "grabbing";
			ele.style.userSelect = "none";
			pos = {
				left: ele.scrollLeft,
				top: ele.scrollTop,
				x: e.clientX,
				y: e.clientY
			};
		};
		const mouseMoveHandler = function(e) {
			if (!isDown) return;
			e.preventDefault();
			const dx = e.clientX - pos.x;
			const dy = e.clientY - pos.y;
			ele.scrollTop = pos.top - dy;
			ele.scrollLeft = pos.left - dx;
		};
		const mouseUpHandler = function() {
			isDown = false;
			ele.style.cursor = "grab";
			ele.style.removeProperty("user-select");
		};
		ele.addEventListener("mousedown", mouseDownHandler);
		window.addEventListener("mousemove", mouseMoveHandler);
		window.addEventListener("mouseup", mouseUpHandler);
		return () => {
			ele.removeEventListener("mousedown", mouseDownHandler);
			window.removeEventListener("mousemove", mouseMoveHandler);
			window.removeEventListener("mouseup", mouseUpHandler);
		};
	}, []);
	return ref;
}
var CATEGORY_TABS = [
	"All Posts",
	"Honey & Health",
	"Bee Farming",
	"Natural Living",
	"Recipes",
	"Sustainability",
	"Honey Guide",
	"Our Farm"
];
function BlogPage() {
	const { posts, popular, featured } = Route.useLoaderData();
	const search = Route.useSearch();
	const navigate = useNavigate({ from: "/blog" });
	const activeCategory = search.cat || "All Posts";
	const [searchInput, setSearchInput] = (0, import_react.useState)(search.q || "");
	const [email, setEmail] = (0, import_react.useState)("");
	const [newsletterStatus, setNewsletterStatus] = (0, import_react.useState)("idle");
	const [newsletterMsg, setNewsletterMsg] = (0, import_react.useState)("");
	const subscribe = useServerFn(subscribeNewsletter);
	const scrollContainerRef = useDragScroll();
	function handleCategoryClick(cat) {
		navigate({ search: (prev) => ({
			...prev,
			cat: cat === "All Posts" ? void 0 : cat,
			page: 1
		}) });
	}
	function handleSearchSubmit(e) {
		if (e) e.preventDefault();
		navigate({ search: (prev) => ({
			...prev,
			q: searchInput.trim() || void 0,
			page: 1
		}) });
	}
	async function handleNewsletterSubmit(e) {
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
			if ((await subscribe({ data: {
				email: cleanEmail,
				source: "journal-newsletter"
			} })).already) {
				setNewsletterStatus("already");
				setNewsletterMsg("You are already subscribed to our Journal newsletter!");
			} else {
				setNewsletterStatus("success");
				setNewsletterMsg("Successfully subscribed! Check your inbox for welcome stories.");
				setEmail("");
			}
		} catch (err) {
			setNewsletterStatus("error");
			setNewsletterMsg(err.message || "Something went wrong. Please try again.");
		}
	}
	const displayedPosts = (0, import_react.useMemo)(() => {
		if (posts.rows && posts.rows.length > 0) return posts.rows.map((p) => ({
			slug: p.slug,
			title: p.title,
			excerpt: p.excerpt || "Click to read full story from the hive...",
			category: p.category_name || "Honey & Health",
			date: formatPostDate(p.published_at || p.created_at),
			readTime: p.reading_time || "5 min read",
			image: resolvePostImage(p.cover_image_url, p.category_name || p.slug)
		}));
		return [];
	}, [posts.rows, activeCategory]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeroSlider, { page: "blog" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			id: "journal-grid",
			className: "pt-16 sm:pt-24 pb-12 sm:pb-16 bg-cream border-b border-border/80",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center max-w-2xl mx-auto mb-10 sm:mb-14",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-bold tracking-[0.25em] uppercase text-brand-orange mb-2",
								children: "OUR JOURNAL"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-espresso tracking-tight",
								children: "Honey. Knowledge. Inspiration."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm sm:text-base text-espresso/80 leading-relaxed mt-3 max-w-xl mx-auto",
								children: "Read our latest articles on bees, health, sustainability and natural living."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full relative -mx-4 sm:mx-0 overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							ref: scrollContainerRef,
							className: "flex items-center gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory pb-6 pt-2 px-5 sm:px-0 scroll-smooth no-scrollbar cursor-grab",
							style: {
								scrollbarWidth: "none",
								msOverflowStyle: "none"
							},
							children: CATEGORY_TABS.map((cat, index) => {
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => handleCategoryClick(cat),
									className: `shrink-0 snap-center px-6 sm:px-8 py-3.5 rounded-[24px] text-[12px] sm:text-[13px] font-bold tracking-wider whitespace-nowrap transition-all shadow-[0_4px_14px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] ${activeCategory === cat ? "bg-[#2B2118] text-[#FDFBF7]" : "bg-white text-[#2B2118] hover:bg-[#F8F5EF] border border-[#D97706]/15"}`,
									children: cat
								}, cat);
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSearchSubmit,
						className: "mt-6 max-w-md mx-auto relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 text-espresso/50 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								placeholder: "Search articles by topic...",
								value: searchInput,
								onChange: (e) => setSearchInput(e.target.value),
								className: "w-full pl-11 pr-24 py-3 bg-white border border-border/80 rounded-full text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:border-brand-orange shadow-xs"
							}),
							searchInput && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								className: "absolute right-2 top-1/2 -translate-y-1/2 bg-brand-orange text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-brand-orange-hover transition-colors",
								children: "Search"
							})
						]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-12 sm:py-20 bg-cream",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-page",
				children: displayedPosts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-3xl border border-border/80 p-12 text-center shadow-soft max-w-xl mx-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-14 rounded-2xl bg-cream-deep flex items-center justify-center mx-auto text-brand-orange mb-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-6" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-serif text-2xl font-bold text-espresso",
							children: "No articles found"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-espresso/75 leading-relaxed",
							children: "We couldn't find any published articles matching your criteria. Try selecting \"All Posts\" or resetting your search."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setSearchInput("");
								handleCategoryClick("All Posts");
							},
							className: "mt-6 inline-flex items-center gap-2 bg-brand-orange text-white rounded-full px-7 py-3.5 text-xs font-bold tracking-widest uppercase hover:bg-brand-orange-hover transition-all",
							children: "RESET ALL FILTERS"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "block md:hidden mt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PremiumMobileCarousel, {
							items: displayedPosts,
							slideClassName: "flex-[0_0_86vw] min-w-0",
							renderItem: (post) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "bg-white rounded-[22px] border border-border/80 overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between h-full group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/blog/$slug",
									params: { slug: post.slug },
									className: "block relative overflow-hidden aspect-[4/3] bg-cream-deep",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: post.image,
										alt: post.title,
										loading: "lazy",
										className: "w-full h-full object-cover pointer-events-none"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-bold tracking-[0.18em] text-brand-orange uppercase px-3 py-1 rounded-full bg-cream border border-border/70 inline-block mb-3.5",
											children: post.category
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/blog/$slug",
											params: { slug: post.slug },
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-serif text-[18px] font-bold text-espresso leading-snug line-clamp-2",
												children: post.title
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[14px] text-espresso/75 leading-relaxed mt-2.5 line-clamp-2",
											children: post.excerpt
										})
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "px-6 pb-6 pt-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-4 border-t border-border/60 flex items-center justify-between text-[12px] font-medium text-espresso/70",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3.5 text-brand-orange" }),
													" ",
													post.date
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5 text-brand-orange" }),
													" ",
													post.readTime
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/blog/$slug",
											params: { slug: post.slug },
											"aria-label": `Read more about ${post.title}`,
											className: "text-brand-orange font-bold hover:translate-x-1 transition-transform",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })
										})]
									})
								})]
							}, post.slug)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8",
						children: displayedPosts.map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "bg-white rounded-3xl border border-border/80 overflow-hidden shadow-xs hover:shadow-soft transition-all duration-300 flex flex-col justify-between group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/blog/$slug",
								params: { slug: post.slug },
								className: "block relative overflow-hidden aspect-[4/3] bg-cream-deep",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: post.image,
									alt: post.title,
									loading: "lazy",
									className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-6 sm:p-7",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] sm:text-[11px] font-bold tracking-[0.18em] text-brand-orange uppercase px-3 py-1 rounded-full bg-cream border border-border/70 inline-block mb-3.5",
										children: post.category
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/blog/$slug",
										params: { slug: post.slug },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-serif text-lg sm:text-xl font-bold text-espresso group-hover:text-brand-orange transition-colors leading-snug line-clamp-2",
											children: post.title
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs sm:text-sm text-espresso/75 leading-relaxed mt-2.5 line-clamp-2",
										children: post.excerpt
									})
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-6 sm:px-7 pb-6 pt-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-4 border-t border-border/60 flex items-center justify-between text-[11px] sm:text-xs font-medium text-espresso/70",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3.5 text-brand-orange" }),
												" ",
												post.date
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5 text-brand-orange" }),
												" ",
												post.readTime
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/blog/$slug",
										params: { slug: post.slug },
										"aria-label": `Read more about ${post.title}`,
										className: "text-brand-orange font-bold hover:translate-x-1 transition-transform",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })
									})]
								})
							})]
						}, post.slug))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-12 sm:mt-16 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								setSearchInput("");
								handleCategoryClick("All Posts");
							},
							className: "inline-flex items-center gap-2 bg-white hover:bg-cream border border-brand-orange text-brand-orange rounded-full px-8 py-3.5 text-xs font-bold tracking-widest uppercase transition-all shadow-xs hover:shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "VIEW ALL ARTICLES" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5" })]
						})
					})
				] })
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-8 sm:py-12 bg-cream border-t border-border/80",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-page",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-[#FFF9ED] border border-border/80 rounded-3xl p-8 sm:p-12 shadow-xs relative overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "lg:col-span-6 space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-bold tracking-[0.25em] uppercase text-brand-orange",
										children: "STAY UPDATED"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-espresso leading-tight",
										children: "Join Our Honey Journey"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm sm:text-base text-espresso/75 leading-relaxed pt-1",
										children: "Get the latest stories, tips and farm updates right in your inbox."
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "lg:col-span-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										onSubmit: handleNewsletterSubmit,
										className: "flex flex-col sm:flex-row gap-3 max-w-md lg:max-w-none lg:ml-auto",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "email",
											placeholder: "Enter your email address",
											value: email,
											onChange: (e) => setEmail(e.target.value),
											disabled: newsletterStatus === "submitting",
											className: "flex-1 px-6 py-4 bg-white border border-border/80 rounded-full text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:border-brand-orange shadow-xs disabled:opacity-50"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "submit",
											disabled: newsletterStatus === "submitting",
											className: "bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs sm:text-sm tracking-widest px-8 py-4 rounded-full uppercase shadow-md hover:scale-[1.02] transition-all disabled:opacity-50 shrink-0",
											children: newsletterStatus === "submitting" ? "SUBSCRIBING..." : "SUBSCRIBE"
										})]
									}),
									newsletterStatus === "success" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 inline-flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: newsletterMsg })]
									}),
									newsletterStatus === "already" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 inline-flex items-center gap-2 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 px-4 py-2 rounded-full",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: newsletterMsg })]
									}),
									newsletterStatus === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 inline-flex items-center gap-2 text-xs font-medium text-red-700 bg-red-50 border border-red-200 px-4 py-2 rounded-full",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: newsletterMsg })]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute top-6 right-8 text-2xl sm:text-3xl opacity-80 pointer-events-none select-none hidden sm:block",
							children: "🐝"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-10 -right-10 w-48 h-48 bg-brand-orange/10 rounded-full blur-2xl pointer-events-none" })
					]
				})
			})
		})
	] });
}
//#endregion
export { BlogPage as component };
