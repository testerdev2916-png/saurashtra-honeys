import { i as __toESM } from "../_runtime.mjs";
import { i as getVariantByLabel, n as getProductGallery, t as getProductAdditionalImages } from "./products-CxldZzZM.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useCart } from "./cart-Bp2wgR53.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as LoaderCircle, C as ShieldCheck, Ct as Flower2, Gt as Check, H as PackageCheck, Ht as ChevronRight, K as MessageCircle, N as Plus, Ut as ChevronLeft, Vt as ChevronUp, Wt as ChevronDown, b as Sparkles, dt as ImagePlus, en as Beaker, k as RefreshCw, mt as Heart, n as ZoomIn, p as Trash2, rt as Leaf, u as Truck, v as Star, w as Share2, x as ShoppingCart, xt as GitCompare } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as supabase } from "./client-CiOF68Zx.mjs";
import { n as useAuth } from "./auth-L3PDI3kX.mjs";
import { a as getCategorySlug, c as useWishlist } from "./collection-helpers-DAdv5muE.mjs";
import { n as fetchProducts } from "./product-catalog-DsxAkRUU.mjs";
import { n as SiteLayout } from "./Layout-BROfU7ZF.mjs";
import { t as pushRecent } from "./recently-viewed-vyH4vNwq.mjs";
import { t as useEmblaCarousel } from "../_libs/embla-carousel-react+[...].mjs";
import { t as PremiumMobileCarousel } from "./PremiumMobileCarousel-DywbpNAf.mjs";
import { i as productLd, n as breadcrumbLd, t as StructuredData } from "./StructuredData-C0TBI3qI.mjs";
import { n as useCompare } from "./compare-Cg9kkhzV.mjs";
import { t as ProductCard } from "./ProductCard-EQWSFYBy.mjs";
import { t as Route } from "./product._slug-RZv2PRXf.mjs";
import { t as ShoppableVideoCarousel } from "./ShoppableVideoCarousel-xbi21IV0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._slug-C4ePcoh0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MAX_FILES = 5;
var MAX_SIZE = 25 * 1024 * 1024;
var PAGE_SIZE = 5;
var LOAD_TIMEOUT_MS = 12e3;
async function signMedia(items) {
	if (!items?.length) return [];
	const paths = items.map((m) => m.path).filter(Boolean);
	if (!paths.length) return items;
	const { data } = await supabase.storage.from("review-media").createSignedUrls(paths, 3600 * 24 * 7);
	const map = new Map((data ?? []).map((d) => [d.path, d.signedUrl]));
	return items.map((m) => ({
		...m,
		url: map.get(m.path) ?? m.url
	}));
}
function helpfulScore(r) {
	const bodyLen = (r.body ?? "").length;
	return (r.media ?? []).length * 50 + Math.min(bodyLen, 400) / 4 + r.rating * 5;
}
function ReviewsSection({ productSlug, productName } = {}) {
	const { user } = useAuth();
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [loadError, setLoadError] = (0, import_react.useState)(null);
	const [sort, setSort] = (0, import_react.useState)("newest");
	const [page, setPage] = (0, import_react.useState)(1);
	const [rating, setRating] = (0, import_react.useState)(5);
	const [hover, setHover] = (0, import_react.useState)(0);
	const [title, setTitle] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const [files, setFiles] = (0, import_react.useState)([]);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [uploadProgress, setUploadProgress] = (0, import_react.useState)(null);
	const fileRef = (0, import_react.useRef)(null);
	const load = async () => {
		setLoading(true);
		setLoadError(null);
		let timedOut = false;
		const timeout = new Promise((resolve) => {
			setTimeout(() => {
				timedOut = true;
				resolve({ error: /* @__PURE__ */ new Error("Reviews took too long to load. Please retry.") });
			}, LOAD_TIMEOUT_MS);
		});
		try {
			let query = supabase.from("reviews").select("id,user_id,product_slug,rating,title,body,media,author_name,verified_purchase,created_at").eq("status", "approved").order("created_at", { ascending: false }).limit(200);
			if (productSlug) query = query.eq("product_slug", productSlug);
			const result = await Promise.race([query, timeout]);
			if (timedOut) {
				setLoadError("Reviews took too long to load. Please retry.");
				setRows([]);
				return;
			}
			const { data, error } = result;
			if (error) {
				setLoadError(error.message);
				setRows([]);
				return;
			}
			const list = data ?? [];
			const signed = await Promise.all(list.map(async (r) => ({
				...r,
				media: await signMedia(r.media ?? [])
			})));
			setRows(signed);
			setPage(1);
		} catch (e) {
			setLoadError(e instanceof Error ? e.message : "Failed to load reviews");
			setRows([]);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		load();
	}, [productSlug]);
	const sorted = (0, import_react.useMemo)(() => {
		const copy = [...rows];
		if (sort === "helpful") copy.sort((a, b) => helpfulScore(b) - helpfulScore(a) || +new Date(b.created_at) - +new Date(a.created_at));
		else copy.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
		return copy;
	}, [rows, sort]);
	const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
	const pageRows = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
	const avg = rows.length ? rows.reduce((s, r) => s + r.rating, 0) / rows.length : 0;
	const dist = [
		5,
		4,
		3,
		2,
		1
	].map((n) => ({
		n,
		c: rows.filter((r) => r.rating === n).length
	}));
	const onFiles = (e) => {
		const valid = Array.from(e.target.files ?? []).filter((f) => {
			if (f.size > MAX_SIZE) {
				toast.error(`${f.name} exceeds 25MB`);
				return false;
			}
			if (!/^(image|video)\//.test(f.type)) {
				toast.error(`${f.name} is not an image or video`);
				return false;
			}
			return true;
		});
		setFiles((prev) => [...prev, ...valid].slice(0, MAX_FILES));
		if (fileRef.current) fileRef.current.value = "";
	};
	const submit = async () => {
		if (!user) return;
		if (rating < 1) {
			toast.error("Please choose a rating");
			return;
		}
		if (!body.trim()) {
			toast.error("Please write a short review");
			return;
		}
		setSubmitting(true);
		const uploaded = [];
		try {
			setUploadProgress({
				done: 0,
				total: files.length
			});
			const media = [];
			for (let i = 0; i < files.length; i++) {
				const f = files[i];
				const ext = (f.name.split(".").pop() ?? "bin").toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
				const path = `${user.id}/${productSlug || "general"}/${crypto.randomUUID()}.${ext}`;
				const { error: upErr } = await supabase.storage.from("review-media").upload(path, f, {
					cacheControl: "3600",
					upsert: false,
					contentType: f.type
				});
				if (upErr) throw new Error(`Failed to upload ${f.name}: ${upErr.message}`);
				uploaded.push(path);
				media.push({
					path,
					type: f.type.startsWith("video/") ? "video" : "image"
				});
				setUploadProgress({
					done: i + 1,
					total: files.length
				});
			}
			const { data: prof } = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
			const { error } = await supabase.from("reviews").upsert({
				user_id: user.id,
				product_slug: productSlug || "general",
				rating,
				title: title.trim() || null,
				body: body.trim(),
				media,
				author_name: prof?.full_name ?? user.email?.split("@")[0] ?? "Customer"
			}, { onConflict: "user_id,product_slug" });
			if (error) throw new Error(error.message);
			toast.success("Thanks for your review!");
			setTitle("");
			setBody("");
			setFiles([]);
			setRating(5);
			load();
		} catch (e) {
			const msg = e instanceof Error ? e.message : "Failed to submit review";
			toast.error(msg);
			if (uploaded.length) await supabase.storage.from("review-media").remove(uploaded).catch(() => {});
		} finally {
			setSubmitting(false);
			setUploadProgress(null);
		}
	};
	const removeMine = async (id, media) => {
		if (!confirm("Delete this review?")) return;
		const { error } = await supabase.from("reviews").delete().eq("id", id);
		if (error) {
			toast.error(error.message);
			return;
		}
		if (media?.length) await supabase.storage.from("review-media").remove(media.map((m) => m.path)).catch(() => {});
		toast.success("Review removed");
		load();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "container-page pb-14",
		id: "reviews",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-cream rounded-2xl p-6 md:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl md:text-3xl text-forest-dark",
						children: "Customer Reviews"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-1",
						children: productName ? `Real feedback on ${productName}` : "Real feedback from our verified customers"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-4xl font-serif text-forest-dark",
							children: avg.toFixed(1)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex text-gold",
							children: [...Array(5)].map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `size-4 ${i < Math.round(avg) ? "fill-gold" : ""}` }, i))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground mt-1",
							children: [
								rows.length,
								" review",
								rows.length === 1 ? "" : "s"
							]
						})] })]
					})]
				}),
				rows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 grid gap-1 max-w-md",
					children: dist.map(({ n, c }) => {
						const pct = rows.length ? c / rows.length * 100 : 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "w-6 text-forest-dark",
									children: [n, "★"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex-1 h-2 bg-background rounded-full overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full bg-gold-deep",
										style: { width: `${pct}%` }
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-6 text-right text-muted-foreground",
									children: c
								})
							]
						}, n);
					})
				}),
				productSlug && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 border-t border-border pt-6",
					children: !user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							className: "text-gold-deep font-semibold border-b border-gold-deep",
							children: "Sign in"
						}), " to write a review."]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 max-w-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold text-forest-dark",
								children: "Write a review"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-1",
								children: [
									1,
									2,
									3,
									4,
									5
								].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onMouseEnter: () => setHover(n),
									onMouseLeave: () => setHover(0),
									onClick: () => setRating(n),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `size-6 ${(hover || rating) >= n ? "fill-gold text-gold" : "text-muted-foreground"}` })
								}, n))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: title,
								onChange: (e) => setTitle(e.target.value),
								placeholder: "Title (optional)",
								className: "w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: body,
								onChange: (e) => setBody(e.target.value),
								placeholder: "Share your experience with this product",
								rows: 4,
								className: "w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: fileRef,
									type: "file",
									accept: "image/*,video/*",
									multiple: true,
									onChange: onFiles,
									className: "hidden"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => fileRef.current?.click(),
									className: "inline-flex items-center gap-2 text-xs font-semibold text-forest-dark border border-border rounded-lg px-3 py-2 hover:bg-background",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-4" }),
										" Add photos / videos (",
										files.length,
										"/",
										MAX_FILES,
										")"
									]
								}),
								files.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 flex flex-wrap gap-2",
									children: files.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs bg-background border border-border rounded px-2 py-1 flex items-center gap-1",
										children: [f.name.slice(0, 24), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setFiles((p) => p.filter((_, j) => j !== i)),
											className: "text-muted-foreground hover:text-destructive",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3" })
										})]
									}, i))
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								disabled: submitting,
								onClick: submit,
								className: "bg-forest-dark text-cream rounded-lg py-2.5 px-5 text-sm font-bold tracking-widest hover:bg-forest inline-flex items-center gap-2 disabled:opacity-60",
								children: [submitting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), submitting && uploadProgress ? `UPLOADING ${uploadProgress.done}/${uploadProgress.total}` : "SUBMIT REVIEW"]
							})
						]
					})
				}),
				rows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex items-center justify-between gap-3 flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: [
							"Showing ",
							(page - 1) * PAGE_SIZE + 1,
							"–",
							Math.min(page * PAGE_SIZE, sorted.length),
							" of ",
							sorted.length
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "inline-flex items-center gap-1 text-xs bg-background border border-border rounded-lg p-1",
						children: ["newest", "helpful"].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setSort(k);
								setPage(1);
							},
							className: `px-3 py-1.5 rounded-md capitalize ${sort === k ? "bg-forest-dark text-cream font-semibold" : "text-forest-dark hover:bg-cream"}`,
							children: k
						}, k))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-6",
					children: [
						loading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm text-muted-foreground inline-flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), " Loading reviews…"]
						}),
						!loading && loadError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm text-destructive flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: loadError }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => void load(),
								className: "inline-flex items-center gap-1 text-forest-dark border border-border rounded px-2 py-1 hover:bg-background",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3" }), " Retry"]
							})]
						}),
						!loading && !loadError && rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground",
							children: "No reviews yet — be the first to share your experience."
						}),
						!loading && !loadError && pageRows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "border-t border-border pt-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex text-gold",
											children: [...Array(5)].map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `size-4 ${i < r.rating ? "fill-gold" : ""}` }, i))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-semibold text-forest-dark mt-1",
											children: r.title || "Verified feedback"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-muted-foreground",
											children: [
												r.author_name ?? "Customer",
												" · ",
												new Date(r.created_at).toLocaleDateString(),
												r.verified_purchase && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "ml-2 text-gold-deep",
													children: "✓ Verified purchase"
												})
											]
										})
									] }), user?.id === r.user_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => removeMine(r.id, r.media),
										className: "text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3" }), " Delete"]
									})]
								}),
								r.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm text-forest-dark/90 whitespace-pre-wrap",
									children: r.body
								}),
								r.media && r.media.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 flex flex-wrap gap-2",
									children: r.media.map((m, i) => m.type === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
										src: m.url,
										controls: true,
										className: "w-28 h-28 object-cover rounded-lg border border-border"
									}, i) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: m.url,
										target: "_blank",
										rel: "noreferrer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											loading: "lazy",
											src: m.url,
											alt: "review",
											className: "w-20 h-20 object-cover rounded-lg border border-border"
										})
									}, i))
								})
							]
						}, r.id))
					]
				}),
				!loading && !loadError && totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex items-center justify-center gap-1 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setPage((p) => Math.max(1, p - 1)),
							disabled: page === 1,
							className: "size-9 rounded-lg border border-border disabled:opacity-40 hover:bg-background",
							children: "‹"
						}),
						Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setPage(n),
							className: `size-9 rounded-lg border border-border ${n === page ? "bg-forest-dark text-cream" : "hover:bg-background"}`,
							children: n
						}, n)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
							disabled: page === totalPages,
							className: "size-9 rounded-lg border border-border disabled:opacity-40 hover:bg-background",
							children: "›"
						})
					]
				})
			]
		})
	});
}
var honey_process_infographic_default = "/assets/honey-process-infographic-vq6TDbM8.png";
var FAQS = [
	{
		q: "Is this raw honey?",
		a: "Yes — never heated above hive temperature, never filtered past what's needed to remove wax. All natural enzymes are preserved."
	},
	{
		q: "Will it crystallise?",
		a: "Natural crystallisation is a sign of purity. Warm the jar gently in a bowl of warm water — never microwave — to bring it back to liquid."
	},
	{
		q: "How long does it last?",
		a: "Stored in a cool, dry place, raw honey stays good for 2+ years. It never really expires — just enjoy it at its best."
	},
	{
		q: "Is it safe for children?",
		a: "Yes for children above 1 year. Never give any honey to infants under 12 months."
	},
	{
		q: "How do I know it's pure?",
		a: "Every batch has an independent lab report for moisture, HMF, sucrose and pollen count. You can request the report from customer care."
	},
	{
		q: "Shipping and returns?",
		a: "Free shipping over ₹799. Ships in 24–48 hrs. Easy replacement within 7 days if any jar arrives damaged."
	}
];
function ProductPage() {
	const { product: p } = Route.useLoaderData();
	const [size, setSize] = (0, import_react.useState)(p.sizes[0]);
	const [qty, setQty] = (0, import_react.useState)(1);
	const [tab, setTab] = (0, import_react.useState)("Description");
	const [openFaq, setOpenFaq] = (0, import_react.useState)(0);
	const [allProducts, setAllProducts] = (0, import_react.useState)([]);
	const [heroIdx, setHeroIdx] = (0, import_react.useState)(0);
	const [zoom, setZoom] = (0, import_react.useState)(false);
	const { add, setOpen } = useCart();
	const wl = useWishlist();
	const cmp = useCompare();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		fetchProducts().then((r) => {
			if (r.length) setAllProducts(r);
		});
	}, []);
	(0, import_react.useEffect)(() => {
		pushRecent(p.slug);
		import("./analytics-DCmDeuTY.mjs").then((n) => n.t).then((n) => n.t).then(({ track, toItem }) => {
			track("view_item", {
				currency: "INR",
				value: p.price,
				items: [toItem(p, { size })]
			});
		});
	}, [p.slug]);
	const gallery = (0, import_react.useMemo)(() => {
		const base = getProductGallery(p) || [];
		const add = getProductAdditionalImages(p) || [];
		return [...base, ...add].filter((u) => u && u.trim().length > 0);
	}, [p]);
	const related = allProducts.filter((x) => x.slug !== p.slug && x.category === p.category).slice(0, 4);
	const fbt = allProducts.filter((x) => x.slug !== p.slug).slice(0, 3);
	const activeVariant = (0, import_react.useMemo)(() => getVariantByLabel(p, size), [p, size]);
	const activePrice = activeVariant.price ?? p.price;
	const activeMrp = activeVariant.mrp ?? p.mrp;
	const stock = activeVariant.stock ?? p.stock_quantity ?? 100;
	const inStock = activeVariant.inStock !== false && (p.in_stock ?? true);
	const lowStock = inStock && stock <= 10;
	const handleAdd = () => {
		if (!inStock) {
			toast.error("Out of stock");
			return;
		}
		add(p, size, qty, activeVariant);
		import("./analytics-DCmDeuTY.mjs").then((n) => n.t).then((n) => n.t).then(({ track, toItem }) => track("add_to_cart", {
			currency: "INR",
			value: activePrice * qty,
			items: [toItem(p, {
				size,
				qty
			})]
		}));
		toast.success(`Added ${p.name} (${size}) to cart`);
	};
	const handleBuy = () => {
		if (!inStock) {
			toast.error("Out of stock");
			return;
		}
		add(p, size, qty, activeVariant);
		import("./analytics-DCmDeuTY.mjs").then((n) => n.t).then((n) => n.t).then(({ track, toItem }) => {
			track("begin_checkout", {
				currency: "INR",
				value: activePrice * qty,
				items: [toItem(p, {
					size,
					qty
				})]
			});
		});
		setOpen(false);
		navigate({ to: "/checkout" });
	};
	const toggleWish = async () => {
		const saved = await wl.toggle(p.slug);
		toast.success(saved ? "Saved to wishlist" : "Removed from wishlist");
	};
	const toggleCompare = () => {
		if (cmp.toggle(p.slug)) toast.success("Added to compare");
	};
	const share = async () => {
		const url = typeof window !== "undefined" ? window.location.href : "";
		if (navigator.share) try {
			await navigator.share({
				title: p.name,
				text: p.tagline,
				url
			});
			return;
		} catch {}
		try {
			await navigator.clipboard.writeText(url);
			toast.success("Link copied");
		} catch {
			toast.error("Couldn't copy");
		}
	};
	const waMsg = encodeURIComponent(`Hi! I'd like to know more about ${p.name} (${size}) — ${typeof window !== "undefined" ? window.location.href : ""}`);
	const deliveryDate = (0, import_react.useMemo)(() => {
		const d = /* @__PURE__ */ new Date();
		d.setDate(d.getDate() + 5);
		return d.toLocaleDateString("en-IN", {
			weekday: "short",
			day: "numeric",
			month: "short"
		});
	}, []);
	const totalPrice = activePrice * qty;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-product py-4 md:py-6 text-xs text-muted-foreground flex items-center gap-1 flex-wrap",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "hover:text-gold-deep",
					children: "Home"
				}),
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop",
					className: "hover:text-gold-deep",
					children: "Shop"
				}),
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/collections/$slug",
					params: { slug: getCategorySlug(p.category) },
					className: "hover:text-gold-deep",
					children: p.category
				}),
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-forest-dark truncate",
					children: p.name
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "container-product grid lg:grid-cols-[minmax(520px,680px)_minmax(450px,1fr)] gap-6 lg:gap-10 pb-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden md:grid grid-cols-[90px_1fr] gap-3.5 items-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex flex-col items-center",
						children: [
							gallery.length > 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"aria-label": "Scroll Up",
								onClick: () => {
									const el = document.getElementById("desktop-thumbs-rail");
									if (el) el.scrollBy({
										top: -110,
										behavior: "smooth"
									});
								},
								className: "w-full py-1 mb-1 text-espresso/60 hover:text-burnt-orange flex items-center justify-center transition-colors",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								id: "desktop-thumbs-rail",
								className: "flex flex-col gap-2.5 overflow-y-auto max-h-[600px] w-full pr-1 scrollbar-thin scrollbar-thumb-border",
								children: gallery.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setHeroIdx(i),
									className: `bg-cream-deep/60 rounded-xl overflow-hidden aspect-square w-full border transition-all shrink-0 ${i === heroIdx ? "border-2 border-burnt-orange shadow-sm scale-95" : "border-border/80 hover:border-burnt-orange/50"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src,
										alt: `${p.name} view ${i + 1}`,
										loading: "lazy",
										className: "w-full h-full object-contain bg-white object-center aspect-square"
									})
								}, i))
							}),
							gallery.length > 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"aria-label": "Scroll Down",
								onClick: () => {
									const el = document.getElementById("desktop-thumbs-rail");
									if (el) el.scrollBy({
										top: 110,
										behavior: "smooth"
									});
								},
								className: "w-full py-1 mt-1 text-espresso/60 hover:text-burnt-orange flex items-center justify-center transition-colors",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-cream-deep/40 border border-border/80 rounded-3xl overflow-hidden relative group shadow-soft aspect-square w-full",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "absolute top-4 right-4 z-10 size-24 rounded-full bg-white/95 backdrop-blur-md border border-burnt-orange/40 flex flex-col items-center justify-center text-[9px] font-bold text-espresso tracking-widest text-center leading-tight shadow-sm",
								children: [
									"RAW &",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-burnt-orange",
										children: "UNFILTERED"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "size-3.5 text-burnt-orange mx-auto mt-1" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"aria-label": "Zoom",
								onClick: () => setZoom(true),
								className: "absolute bottom-4 right-4 z-10 size-10 bg-white/95 rounded-full flex items-center justify-center text-espresso hover:bg-white shadow-md transition-transform hover:scale-110",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomIn, { className: "size-4 text-burnt-orange" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: gallery[heroIdx] || gallery[0],
								alt: p.name,
								className: "w-full h-full object-contain aspect-square cursor-zoom-in transition-transform duration-500",
								onClick: () => setZoom(true)
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileProductGallery, {
					images: gallery,
					name: p.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					p.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-bold tracking-widest text-burnt-orange uppercase mb-1.5",
						children: p.badge
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-espresso leading-tight",
						children: p.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm md:text-base text-muted-foreground font-normal leading-relaxed",
						children: p.tagline
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3.5 flex items-center gap-2 text-sm flex-wrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex text-burnt-orange",
								children: [...Array(5)].map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `size-4 ${i < Math.round(p.rating) ? "fill-burnt-orange text-burnt-orange" : "text-border"}` }, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-espresso",
								children: p.rating
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "#reviews",
								className: "text-muted-foreground hover:text-burnt-orange underline underline-offset-2 font-medium",
								children: [
									"(",
									p.reviews,
									" verified reviews)"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex items-center gap-2.5 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xl md:text-2xl font-semibold text-espresso",
							children: ["₹", activePrice]
						}), activeMrp && activeMrp > activePrice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-base text-muted-foreground line-through",
							children: ["₹", activeMrp]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-bold text-terracotta bg-cream-deep px-2 py-0.5 rounded-full shadow-xs",
							children: [
								"-",
								Math.round((activeMrp - activePrice) / activeMrp * 100),
								"% OFF"
							]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Inclusive of all taxes & free shipping on orders over ₹999"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium",
						children: [inStock ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5 text-botanical font-bold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }),
								" In Stock & Ready to Harvest",
								lowStock && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-terracotta font-semibold",
									children: [
										"— only ",
										stock,
										" jars left"
									]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-flex items-center gap-1.5 text-terracotta font-bold",
							children: "Temporarily Out of Stock"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5 text-espresso",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "size-4 text-burnt-orange" }),
								" Estimated Delivery by ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
									className: "font-bold",
									children: deliveryDate
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-6 h-px bg-border/80" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-sm md:text-base text-muted-foreground leading-relaxed",
						children: p.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-bold uppercase tracking-widest text-espresso",
							children: "Select Pack Size"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2.5 flex gap-2.5 flex-wrap",
							children: p.sizes.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSize(s),
								className: `px-5 py-2.5 rounded-full text-sm border font-semibold transition-all ${size === s ? "border-burnt-orange text-burnt-orange bg-cream shadow-xs" : "border-border text-muted-foreground hover:border-burnt-orange"}`,
								children: s
							}, s))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex items-center gap-4 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-bold uppercase tracking-widest text-espresso",
							children: "Quantity"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2.5 inline-flex items-center border border-border rounded-xl bg-white shadow-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									"aria-label": "Decrease",
									onClick: () => setQty(Math.max(1, qty - 1)),
									className: "px-3.5 py-2.5 text-espresso hover:text-burnt-orange font-bold text-base",
									children: "−"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "px-4 text-sm font-bold",
									children: qty
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									"aria-label": "Increase",
									onClick: () => setQty(qty + 1),
									className: "px-3.5 py-2.5 text-espresso hover:text-burnt-orange font-bold text-base",
									children: "+"
								})
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "ml-auto text-right self-end pb-1.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xl md:text-2xl font-semibold text-espresso",
								children: ["₹", totalPrice]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 grid grid-cols-2 gap-4 hidden md:grid",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleAdd,
							className: "btn-primary py-4 text-[13px] rounded-2xl tracking-widest disabled:opacity-50 font-bold",
							disabled: !inStock,
							children: ["ADD TO CART ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "size-4" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleBuy,
							className: "btn-accent py-4 text-[13px] rounded-2xl tracking-widest disabled:opacity-50 font-bold",
							disabled: !inStock,
							children: "BUY NOW"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid grid-cols-3 gap-2.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: toggleWish,
								className: `inline-flex items-center justify-center gap-1.5 border rounded-xl py-2.5 text-[11px] font-bold tracking-widest transition-colors shadow-xs ${wl.has(p.slug) ? "border-terracotta text-terracotta bg-cream" : "border-border text-espresso hover:border-burnt-orange"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `size-3.5 ${wl.has(p.slug) ? "fill-current" : ""}` }),
									" ",
									wl.has(p.slug) ? "SAVED" : "WISHLIST"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: toggleCompare,
								className: `inline-flex items-center justify-center gap-1.5 border rounded-xl py-2.5 text-[11px] font-bold tracking-widest transition-colors shadow-xs ${cmp.has(p.slug) ? "border-burnt-orange text-burnt-orange bg-cream" : "border-border text-espresso hover:border-burnt-orange"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitCompare, { className: "size-3.5" }),
									" ",
									cmp.has(p.slug) ? "IN COMPARE" : "COMPARE"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: share,
								className: "inline-flex items-center justify-center gap-1.5 border border-border text-espresso rounded-xl py-2.5 text-[11px] font-bold tracking-widest hover:border-burnt-orange shadow-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-3.5" }), " SHARE"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: `https://wa.me/?text=${waMsg}`,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "mt-4 inline-flex items-center justify-center gap-2 text-xs font-semibold text-espresso/80 hover:text-burnt-orange transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4 text-botanical" }), " Ask about this harvest on WhatsApp"]
					})
				] })
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "container-product pb-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-cream-deep/70 border border-border/80 rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6 shadow-soft",
				children: [
					[
						Leaf,
						"100% Pure & Raw",
						"Unheated and unfiltered floral honey."
					],
					[
						Beaker,
						"Lab Tested Purity",
						"Every batch certified for zero adulteration."
					],
					[
						Sparkles,
						"Direct From Apiary",
						"Harvested ethically from wildflower farms."
					],
					[
						Flower2,
						"Single Floral Note",
						"Capturing authentic regional terroir."
					]
				].map(([I, t, s]) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(I, { className: "size-5 text-burnt-orange shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-bold text-espresso",
								children: t
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-muted-foreground mt-0.5",
								children: s
							})]
						})]
					}, t);
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "container-product pb-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-border/80 rounded-2xl p-6 md:p-8 shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-6 md:gap-8 border-b border-border/80 overflow-x-auto",
					children: [
						"Story / Description",
						"What Makes It Special",
						"Floral Source & Notes",
						"Storage & Usage",
						"Purity & Lab Test"
					].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setTab(t),
						className: `pb-3.5 text-xs md:text-sm font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${tab === t ? "text-burnt-orange border-b-2 border-burnt-orange" : "text-muted-foreground hover:text-espresso"}`,
						children: t
					}, t))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-7",
					children: [
						tab === "Description" || tab === "Story / Description" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm md:text-base text-muted-foreground leading-relaxed",
							children: [
								"Our ",
								p.name,
								" is collected by bees from the nectar of ",
								p.flora ?? "wild",
								" blossoms grown across the rich floral regions of Saurashtra. It is raw, unheated and unfiltered—preserving every natural enzyme, antioxidant, and subtle aroma present in the hive."
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-5 grid sm:grid-cols-2 gap-3 text-sm font-medium text-espresso",
							children: p.benefits.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "size-5 rounded-full bg-cream-deep text-burnt-orange flex items-center justify-center text-xs font-bold",
										children: "✓"
									}),
									" ",
									b
								]
							}, b))
						})] }) : null,
						tab === "Benefits" || tab === "What Makes It Special" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium text-espresso",
							children: [
								p.benefits.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "size-4 text-burnt-orange mt-0.5 shrink-0" }),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: b })
									]
								}, b)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "size-4 text-burnt-orange mt-0.5 shrink-0" }),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Rich in natural antimicrobial properties & enzymes" })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "size-4 text-burnt-orange mt-0.5 shrink-0" }),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Never heated above natural hive temperature" })
									]
								})
							]
						}) : null,
						tab === "How to Use" || tab === "Storage & Usage" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "space-y-4 text-sm font-medium text-espresso",
							children: [
								"Take 1–2 teaspoons each morning on an empty stomach for daily vitality.",
								"Stir into warm (never boiling) water, herbal infusions, or lemon water.",
								"Drizzle over yogurt, artisanal cheese, fruit bowls, or freshly baked sourdough.",
								"Store in a cool, dry place away from direct sunlight; natural crystallization is a sign of pure raw honey."
							].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-3.5 items-start",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "size-6 rounded-full bg-espresso text-cream text-xs font-bold flex items-center justify-center shrink-0 mt-0.5",
									children: i + 1
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "leading-relaxed",
									children: s
								})]
							}, i))
						}) : null,
						tab === "Ingredients" || tab === "Floral Source & Notes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm md:text-base text-muted-foreground leading-relaxed",
								children: [
									"100% Pure, Raw & Unfiltered Honey harvested primarily from ",
									p.flora ?? "Wildflower",
									" blossoms in Saurashtra. No sugar syrups, artificial flavorings, or preservatives."
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-xl bg-cream-deep/60 border border-border/80 text-xs font-medium text-espresso",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-burnt-orange",
									children: "Tasting Note:"
								}), " Distinct floral sweetness with an authentic earthy, soothing finish characteristic of raw Indian apiaries."]
							})]
						}) : null,
						tab === "Lab Report" || tab === "Purity & Lab Test" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm md:text-base text-muted-foreground leading-relaxed",
								children: "Every batch of Saurashtra Honey undergoes independent NABL-accredited laboratory testing for moisture content, HMF levels, C4 sugar adulteration, and pollen verification."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between p-4 rounded-xl bg-cream border border-border/80 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-bold text-espresso",
									children: ["Verified Batch Code: SH24-", p.slug.slice(0, 3).toUpperCase()]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "Tested for zero inverted sugar & 100% floral purity"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#",
									className: "text-xs font-bold tracking-widest text-burnt-orange hover:underline uppercase",
									children: "Download PDF Report →"
								})]
							})]
						}) : null
					]
				})]
			})
		}),
		fbt.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "container-product pb-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl font-bold text-espresso mb-4",
				children: "Frequently Bought Together"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-cream-deep/50 border border-border/80 rounded-2xl p-5 md:p-7 grid md:grid-cols-[1fr_auto] gap-6 md:gap-8 items-center shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-3 md:gap-5 overflow-x-auto pb-2 md:pb-0",
					children: [p, ...fbt].map((x, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 md:gap-4 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-24 md:w-28 shrink-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: x.image,
									alt: x.name,
									className: "w-full aspect-square rounded-xl object-cover bg-white shadow-xs border border-border/80"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1.5 font-serif text-xs md:text-sm font-bold text-espresso leading-tight line-clamp-2",
									children: x.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] md:text-xs text-muted-foreground font-semibold mt-0.5",
									children: ["₹", x.price]
								})
							]
						}), i < fbt.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5 text-burnt-orange shrink-0" })]
					}, x.slug))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:text-right border-t md:border-t-0 pt-4 md:pt-0 border-border/60",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] uppercase tracking-widest text-muted-foreground font-bold",
							children: "Bundle Price"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-serif text-2xl md:text-3xl font-bold text-espresso",
							children: ["₹", [p, ...fbt].reduce((s, x) => s + x.price, 0)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								[p, ...fbt].forEach((x) => add(x));
								toast.success("Bundle added to cart");
							},
							className: "mt-3 w-full md:w-auto bg-espresso text-cream rounded-xl px-6 py-3 text-xs font-bold tracking-widest hover:bg-burnt-orange transition-colors shadow-sm",
							children: "ADD BUNDLE TO CART"
						})
					]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "pb-14 relative",
			style: {
				width: "100vw",
				maxWidth: "none",
				marginLeft: "calc(50% - 50vw)",
				marginRight: "calc(50% - 50vw)",
				paddingLeft: "0",
				paddingRight: "0"
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: honey_process_infographic_default,
				alt: "From Hive to Home, Pure Honey for You - Honey extraction process",
				style: {
					width: "100%",
					display: "block",
					height: "auto"
				},
				className: "w-full h-auto block object-contain",
				loading: "lazy"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "container-product pb-14",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl font-bold text-espresso mb-5",
				children: "Frequently Asked Questions"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white border border-border/80 rounded-2xl divide-y divide-border/60 shadow-soft overflow-hidden",
				children: FAQS.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setOpenFaq(openFaq === i ? null : i),
					className: "w-full flex justify-between items-center text-left p-5 md:p-6 hover:bg-cream/40 transition-colors",
					"aria-expanded": openFaq === i,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold text-espresso text-sm md:text-base",
						children: f.q
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `size-4 text-burnt-orange transition-transform shrink-0 ${openFaq === i ? "rotate-180" : ""}` })]
				}), openFaq === i && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-5 md:px-6 pb-5 md:pb-6 text-sm text-muted-foreground leading-relaxed",
					children: f.a
				})] }, i))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewsSection, {
			productSlug: p.slug,
			productName: p.name
		}),
		related.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "container-product pb-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl font-bold text-espresso",
						children: "You May Also Like"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						className: "text-xs font-bold tracking-widest text-burnt-orange hover:underline uppercase",
						children: "VIEW ALL HARVESTS →"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "block md:hidden mt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PremiumMobileCarousel, {
						items: related,
						slideClassName: "flex-[0_0_86vw] min-w-0",
						renderItem: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { p: r }, r.slug)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden md:grid md:grid-cols-4 gap-4 sm:gap-6",
					children: related.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { p: r }, r.slug))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppableVideoCarousel, {
			eyebrow: "FROM THE APIARIES",
			title: "Stories from the Hive",
			subtitle: "Watch how our floral raw honey is ethically harvested in the wild",
			placementContext: "pdp",
			currentSlug: p.slug,
			category: p.category
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StructuredData, { data: productLd({
			name: p.name,
			description: p.description,
			image: p.image,
			slug: p.slug,
			price: p.price,
			rating: p.rating,
			reviews: p.reviews
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StructuredData, { data: breadcrumbLd([
			{
				name: "Home",
				url: "/"
			},
			{
				name: "Shop",
				url: "/shop"
			},
			{
				name: p.category,
				url: `/shop?category=${encodeURIComponent(p.category)}`
			},
			{
				name: p.name,
				url: `/product/${p.slug}`
			}
		]) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StructuredData, { data: {
			"@context": "https://schema.org",
			"@type": "FAQPage",
			mainEntity: FAQS.map((f) => ({
				"@type": "Question",
				name: f.q,
				acceptedAnswer: {
					"@type": "Answer",
					text: f.a
				}
			}))
		} }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "container-product pb-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-espresso text-cream rounded-2xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 shadow-soft border border-white/10",
				children: [
					[
						PackageCheck,
						"100% Secure Payments",
						"256-bit encrypted transactions"
					],
					[
						Truck,
						"Fast & Safe Delivery",
						"Insured doorstep delivery"
					],
					[
						PackageCheck,
						"Artisanal Packing",
						"Recyclable glass & eco cushioning"
					],
					[
						ShieldCheck,
						"Purity Assurance",
						"Guaranteed unheated floral raw honey"
					]
				].map(([I, t, s]) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(I, { className: "size-6 text-burnt-orange shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-bold text-cream tracking-wide",
								children: t
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-cream/75 mt-0.5 leading-relaxed",
								children: s
							})]
						})]
					}, t);
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "md:hidden fixed inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-border shadow-[0_-6px_20px_-8px_rgba(0,0,0,0.15)]",
			style: { bottom: "calc(56px + env(safe-area-inset-bottom))" },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pl-1 pr-2 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-muted-foreground truncate font-bold uppercase tracking-wider",
							children: size
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-base font-serif font-bold text-espresso",
							children: ["₹", totalPrice]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleAdd,
						disabled: !inStock,
						className: "btn-primary flex-1 py-3 text-xs tracking-widest disabled:opacity-50",
						children: "ADD TO CART"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleBuy,
						disabled: !inStock,
						className: "btn-accent flex-1 py-3 text-xs tracking-widest disabled:opacity-50",
						children: "BUY NOW"
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "md:hidden h-[160px]",
			"aria-hidden": true
		}),
		zoom && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed inset-0 z-[100] bg-forest-dark/95 flex items-center justify-center p-4",
			onClick: () => setZoom(false),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					"aria-label": "Close zoom",
					className: "absolute top-4 right-4 size-10 rounded-full bg-white/10 text-cream flex items-center justify-center hover:bg-white/20",
					children: "✕"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-5xl w-full grid md:grid-cols-[80px_1fr] gap-3",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden md:flex flex-col gap-2 overflow-y-auto max-h-[80vh]",
						children: gallery.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setHeroIdx(i),
							className: `bg-cream/10 rounded-lg overflow-hidden aspect-square border ${i === heroIdx ? "border-gold" : "border-transparent"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src,
								alt: "",
								className: "w-full h-full object-cover"
							})
						}, i))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: gallery[heroIdx],
						alt: p.name,
						className: "w-full h-auto max-h-[85vh] object-contain"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute bottom-4 inset-x-0 flex justify-center gap-2 md:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						"aria-label": "Previous image",
						onClick: (e) => {
							e.stopPropagation();
							setHeroIdx((heroIdx - 1 + gallery.length) % gallery.length);
						},
						className: "size-10 rounded-full bg-white/10 text-cream flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						"aria-label": "Next image",
						onClick: (e) => {
							e.stopPropagation();
							setHeroIdx((heroIdx + 1) % gallery.length);
						},
						className: "size-10 rounded-full bg-white/10 text-cream flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "md:hidden fixed bottom-[72px] left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-[#2B2118]/10 p-3 shadow-[0_-8px_30px_rgba(43,33,24,0.08)] flex gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: handleAdd,
				disabled: !inStock,
				className: "flex-1 bg-white border border-[#2B2118] text-[#2B2118] font-bold text-[12px] uppercase tracking-widest py-3.5 rounded-[16px] shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "size-4" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: handleBuy,
				disabled: !inStock,
				className: "flex-[1.5] bg-[#D97706] text-white font-bold text-[12px] uppercase tracking-widest py-3.5 rounded-[16px] shadow-sm active:scale-95 transition-transform",
				children: "Buy Now"
			})]
		})
	] });
}
function MobileProductGallery({ images, name }) {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop: true,
		align: "center",
		skipSnaps: false
	});
	const [selectedIndex, setSelectedIndex] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (!emblaApi) return;
		emblaApi.on("select", () => {
			setSelectedIndex(emblaApi.selectedScrollSnap());
		});
	}, [emblaApi]);
	const scrollTo = (0, import_react.useCallback)((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "md:hidden w-full min-w-0 mb-4 relative",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-[28px] border border-[#2B2118]/10 bg-[#F8F5EF] shadow-sm relative",
				ref: emblaRef,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex touch-pan-y cursor-grab active:cursor-grabbing",
					children: images.map((src, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-[0_0_100%] min-w-0 aspect-square relative",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src,
							alt: `${name} view ${idx + 1}`,
							loading: "lazy",
							className: "w-full max-w-full h-full object-contain bg-white object-center pointer-events-none"
						})
					}, idx))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "absolute bottom-4 right-4 z-10 px-3 py-1 bg-espresso/80 backdrop-blur-md text-white rounded-full text-xs font-bold tracking-widest shadow-sm",
					children: [
						selectedIndex + 1,
						" / ",
						images.length
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-center gap-2 mt-4",
				children: images.map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => scrollTo(idx),
					className: `transition-all duration-300 rounded-full ${idx === selectedIndex ? "w-6 h-1.5 bg-[#D97706]" : "w-1.5 h-1.5 bg-[#D97706]/30"}`,
					"aria-label": `Go to slide ${idx + 1}`
				}, idx))
			}),
			images.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2.5 overflow-x-auto overflow-y-hidden w-full min-w-0 py-3 px-1 no-scrollbar mt-1",
				children: images.map((src, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => scrollTo(idx),
					className: `size-16 rounded-xl overflow-hidden aspect-square shrink-0 border transition-all ${idx === selectedIndex ? "border-2 border-burnt-orange shadow-sm scale-95" : "border-border/80 opacity-75"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src,
						alt: `${name} thumb ${idx + 1}`,
						className: "w-full h-full object-contain bg-white"
					})
				}, idx))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "absolute top-4 right-8 z-10 size-16 rounded-full bg-white/95 backdrop-blur-md border border-[#D97706]/40 flex flex-col items-center justify-center text-[8px] font-bold text-[#2B2118] tracking-widest text-center leading-[1.1] shadow-sm",
				children: [
					"RAW &",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[#D97706]",
						children: "UNFILTERED"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "size-3 text-[#D97706] mx-auto mt-0.5" })
				]
			})
		]
	});
}
//#endregion
export { ProductPage as component };
