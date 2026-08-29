import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { A as RefreshCcw, L as Pencil, N as Plus, Ot as Eye, an as ArrowLeft, b as Sparkles, in as ArrowRight, p as Trash2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as supabase } from "./client-CiOF68Zx.mjs";
import { i as resolveImage, t as FALLBACK_IMAGE } from "./product-images-CLm3Xqgk.mjs";
import { t as useServerFn } from "./useServerFn-BqzygRuj.mjs";
import { a as PageHeader, c as Td, d as inp, i as Field, l as Th, n as BtnPrimary, o as StatusPill, r as Card, s as TableWrap, t as BtnGhost } from "./ui-Cij6S7ah.mjs";
import { d as upsertSlide, o as listAdminSlides, r as deleteSlide } from "./admin-catalog.functions-Bf3hxAUH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.hero-CxbAlw_v.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMPTY = {
	page: "home",
	eyebrow: "",
	title: "",
	subtitle: "",
	image_key: "hero-honey",
	image_url: null,
	mobile_image_url: null,
	cta_label: "Shop Now",
	cta_href: "/shop",
	sort_order: 1,
	active: true
};
var PAGE_OPTIONS = [
	{
		value: "home",
		label: "Home Page (1920×700)"
	},
	{
		value: "shop",
		label: "Shop (1920×600)"
	},
	{
		value: "our-story",
		label: "Our Story (1920×600)"
	},
	{
		value: "bee-farming",
		label: "Bee Farming (1920×600)"
	},
	{
		value: "blog",
		label: "Journal (1920×600)"
	},
	{
		value: "bulk-orders",
		label: "Bulk & Gifting (1920×600)"
	},
	{
		value: "contact",
		label: "Contact (1920×600)"
	}
];
function HeroPage() {
	const list = useServerFn(listAdminSlides);
	const del = useServerFn(deleteSlide);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [edit, setEdit] = (0, import_react.useState)(null);
	const [filterPage, setFilterPage] = (0, import_react.useState)("all");
	async function load() {
		setLoading(true);
		try {
			const r = await list({});
			setRows(r.rows);
		} catch (e) {
			toast.error(e.message);
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const filteredRows = (0, import_react.useMemo)(() => {
		if (filterPage === "all") return rows;
		return rows.filter((r) => r.page.toLowerCase() === filterPage.toLowerCase());
	}, [rows, filterPage]);
	if (edit) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editor, {
		initial: edit,
		onCancel: () => setEdit(null),
		onSaved: async () => {
			setEdit(null);
			await load();
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Banner / Hero Slider Management",
			subtitle: `${rows.length} total hero slides across website pages`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnGhost, {
				onClick: load,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCcw, { className: "size-3.5" }), " REFRESH"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnPrimary, {
				onClick: () => setEdit(EMPTY),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), " NEW SLIDE"]
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-2 mb-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-bold text-forest-dark",
					children: "Filter Page:"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setFilterPage("all"),
					className: `px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${filterPage === "all" ? "bg-forest-dark text-cream" : "bg-cream text-forest-dark border border-border"}`,
					children: [
						"All (",
						rows.length,
						")"
					]
				}),
				PAGE_OPTIONS.map((opt) => {
					const count = rows.filter((r) => r.page.toLowerCase() === opt.value).length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setFilterPage(opt.value),
						className: `px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${filterPage === opt.value ? "bg-forest-dark text-cream" : "bg-cream text-forest-dark border border-border"}`,
						children: [
							opt.value.toUpperCase(),
							" (",
							count,
							")"
						]
					}, opt.value);
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
			"Page",
			"Sort",
			"Title & Preview",
			"Target",
			"Status",
			""
		].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: h }, h)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
			className: "divide-y divide-border",
			children: [
				loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 6,
					className: "px-4 py-12 text-center text-muted-foreground",
					children: "Loading slides…"
				}) }),
				!loading && filteredRows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 6,
					className: "px-4 py-12 text-center text-muted-foreground",
					children: "No slides found for this view. Click \"NEW SLIDE\" to add custom banners."
				}) }),
				!loading && filteredRows.map((r) => {
					const previewImg = resolveImage(r.image_key, r.image_url, "/assets/hero-honey-_5XoWxQ5.jpg");
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "hover:bg-cream/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
								className: "text-xs font-bold uppercase text-brand-orange",
								children: r.page
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
								className: "text-xs text-muted-foreground font-mono",
								children: r.sort_order
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-12 rounded-lg overflow-hidden border border-border bg-cream shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: previewImg,
										alt: "Slide preview",
										className: "w-full h-full object-cover"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold text-forest-dark truncate max-w-[200px]",
									children: r.title || "(No Title)"
								})]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
								className: "text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: r.cta_href
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { s: r.active ? "live" : "disabled" }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, {
								className: "text-right whitespace-nowrap",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setEdit(r),
									className: "text-brand-orange hover:underline text-xs font-bold mr-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5 inline" }), " EDIT"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: async () => {
										if (!confirm("Delete this hero slide?")) return;
										try {
											await del({ data: { id: r.id } });
											toast.success("Deleted slide");
											load();
										} catch (e) {
											toast.error(e.message);
										}
									},
									className: "text-destructive hover:underline text-xs font-bold",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5 inline" })
								})]
							})
						]
					}, r.id);
				})
			]
		})] })
	] });
}
function Editor({ initial, onCancel, onSaved }) {
	const [f, setF] = (0, import_react.useState)({ ...initial });
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const save = useServerFn(upsertSlide);
	const previewImage = resolveImage(f.image_key, f.image_url, FALLBACK_IMAGE);
	const previewMobileImage = f.mobile_image_url || previewImage;
	const isHome = (f.page || "home").toLowerCase() === "home";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: onCancel,
		className: "inline-flex items-center gap-1 text-xs font-bold text-forest-dark mb-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " BACK TO SLIDES"]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 lg:grid-cols-12 gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "lg:col-span-7",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl text-forest-dark mb-4",
						children: f.id ? "Edit Hero Slide" : "New Hero Slide"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-forest-dark bg-cream/70 border border-brand-orange/30 rounded-xl p-4 mb-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 font-bold text-brand-orange mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Recommended Artwork Dimensions:" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "list-disc pl-5 space-y-1 mt-1 text-espresso/90",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "For Desktop Banners:" }),
									" Recommended size →",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-bold",
										children: "1920 × 700 px"
									}),
									" (Home) or ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-bold",
										children: "1920 × 600 px"
									}),
									" (Inner pages)."
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "For Mobile Banners:" }),
									" Recommended size →",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-bold",
										children: "1080 × 1080 px"
									}),
									" (Square 1:1 Aspect Ratio)."
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-[11px] text-espresso/70 italic font-medium",
								children: "Warning: The container will enforce these aspect ratios. If an uploaded image has a different ratio, it will be automatically center-cropped."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid md:grid-cols-2 gap-4 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Target Page *",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: f.page ?? "home",
									onChange: (e) => setF({
										...f,
										page: e.target.value
									}),
									disabled: !!f.id,
									className: `${inp} ${f.id ? "opacity-50 cursor-not-allowed bg-cream/50" : ""}`,
									children: PAGE_OPTIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: o.value,
										children: o.label
									}, o.value))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Slide Title (Admin & SEO) *",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: f.title ?? "",
									onChange: (e) => setF({
										...f,
										title: e.target.value
									}),
									placeholder: "e.g. Summer Sale Banner",
									className: inp
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "md:col-span-2 pt-2 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-bold text-forest-dark mb-3 uppercase tracking-wider",
									children: "Text Overlay (Optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid md:grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Eyebrow Text (Small Label)",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: f.eyebrow ?? "",
											onChange: (e) => setF({
												...f,
												eyebrow: e.target.value
											}),
											placeholder: "e.g. NEW COLLECTION",
											className: inp
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Description / Subtitle",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: f.subtitle ?? "",
											onChange: (e) => setF({
												...f,
												subtitle: e.target.value
											}),
											placeholder: "Short supporting sentence...",
											className: inp
										})
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Sort Order",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									value: f.sort_order ?? 0,
									onChange: (e) => setF({
										...f,
										sort_order: Number(e.target.value)
									}),
									className: inp
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "md:col-span-2 pt-2 border-t border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Desktop Banner Image URL * (Required)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "url",
										value: f.image_url ?? "",
										onChange: (e) => setF({
											...f,
											image_url: e.target.value,
											image_key: null
										}),
										placeholder: "https://...",
										className: inp
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "md:col-span-2 pt-2 border-t border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Mobile Banner Image URL (Optional, falls back to desktop)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "url",
										value: f.mobile_image_url ?? "",
										onChange: (e) => setF({
											...f,
											mobile_image_url: e.target.value
										}),
										placeholder: "https://...",
										className: inp
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "md:col-span-2 pt-2 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-bold text-forest-dark mb-3 uppercase tracking-wider",
									children: "Call To Action (Optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid md:grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "CTA Button Text",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: f.cta_label ?? "",
											onChange: (e) => setF({
												...f,
												cta_label: e.target.value
											}),
											placeholder: "e.g. Shop Now",
											className: inp
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "CTA Target URL",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: f.cta_href ?? "/shop",
											onChange: (e) => setF({
												...f,
												cta_href: e.target.value
											}),
											placeholder: "/shop",
											className: inp
										})
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "md:col-span-2 pt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "inline-flex items-center gap-2 text-sm font-bold text-forest-dark cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: !!f.active,
										onChange: (e) => setF({
											...f,
											active: e.target.checked
										}),
										className: "size-4 rounded border-border text-brand-orange"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Active (Display this banner in the slider)" })]
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnPrimary, {
							disabled: busy || uploading,
							onClick: async () => {
								if (!f.title) {
									toast.error("Please provide a Slide Title.");
									return;
								}
								if (!f.image_url || !/^https?:\/\//i.test(f.image_url)) {
									toast.error("Please provide a valid HTTPS URL for the desktop banner image");
									return;
								}
								if (f.mobile_image_url && !/^https?:\/\//i.test(f.mobile_image_url)) {
									toast.error("Please provide a valid HTTPS URL for the mobile banner image");
									return;
								}
								setBusy(true);
								try {
									const { data: { session } } = await supabase.auth.getSession();
									console.log("Hero Slide Auth Debug", {
										hasSession: !!session,
										userId: session?.user?.id,
										email: session?.user?.email,
										accessTokenExists: !!session?.access_token
									});
									const { data: { user }, error: userError } = await supabase.auth.getUser();
									console.log("Hero Slide Current User", {
										userId: user?.id,
										email: user?.email,
										error: userError
									});
									if (!session || !user) {
										toast.error("Admin authentication error: No active session. Please sign in again.");
										window.location.href = "/auth?redirect=/admin/hero";
										return;
									}
									await save({ data: {
										id: f.id,
										page: f.page || "home",
										eyebrow: f.eyebrow || null,
										title: f.title,
										subtitle: f.subtitle || null,
										image_key: f.image_key || null,
										image_url: f.image_url || null,
										mobile_image_url: f.mobile_image_url || null,
										cta_label: f.cta_label || null,
										cta_href: f.cta_href || "/shop",
										sort_order: Number(f.sort_order ?? 0),
										active: !!f.active
									} });
									toast.success("Hero slide saved successfully");
									await onSaved();
								} catch (e) {
									toast.error(e.message);
								} finally {
									setBusy(false);
								}
							},
							children: busy ? "SAVING SLIDE…" : "SAVE SLIDE"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnGhost, {
							onClick: onCancel,
							children: "CANCEL"
						})]
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "lg:col-span-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5 sticky top-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-bold text-forest-dark uppercase tracking-wider flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4 text-brand-orange" }), " LIVE BANNER PREVIEW"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-mono font-bold text-muted-foreground bg-cream px-2 py-0.5 rounded border border-border",
							children: isHome ? "1920 × 700 px (Home)" : "1920 × 600 px (Inner)"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] font-bold text-forest-dark uppercase tracking-wider mb-2",
							children: "Desktop View"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `relative rounded-2xl overflow-hidden shadow-lg border border-border bg-espresso w-full ${isHome ? "aspect-[1920/700]" : "aspect-[1920/600]"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: previewImage,
								alt: "Desktop Preview",
								className: "w-full h-full object-cover"
							}), (f.eyebrow || f.subtitle || f.cta_label) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute inset-0 flex flex-col justify-center items-center text-center p-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none",
								children: [
									f.eyebrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[9px] font-bold tracking-[0.25em] uppercase text-brand-orange mb-3 drop-shadow-md",
										children: f.eyebrow
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-serif text-2xl font-bold text-cream mb-3 drop-shadow-lg leading-tight",
										children: f.title || "Banner Title"
									}),
									f.subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-cream/90 mb-4 max-w-[80%] leading-relaxed drop-shadow-md",
										children: f.subtitle
									}),
									f.cta_label && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "inline-flex items-center gap-1.5 bg-brand-orange text-white rounded-full px-4 py-2 font-bold text-[9px] uppercase tracking-widest shadow-md",
										children: [f.cta_label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3" })]
									})
								]
							})]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] font-bold text-forest-dark uppercase tracking-wider mb-2",
							children: "Mobile View"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative rounded-[2rem] overflow-hidden shadow-lg border-4 border-espresso/20 bg-espresso mx-auto",
							style: {
								width: "240px",
								aspectRatio: "1080/1080"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: previewMobileImage,
								alt: "Mobile Preview",
								className: "w-full h-full object-cover"
							}), (f.eyebrow || f.subtitle || f.cta_label) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute inset-0 flex flex-col justify-center items-center text-center p-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none",
								children: [
									f.eyebrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[9px] font-bold tracking-[0.25em] uppercase text-brand-orange mb-2 drop-shadow-md",
										children: f.eyebrow
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-serif text-[20px] font-bold text-cream mb-2 drop-shadow-lg leading-tight",
										children: f.title || "Banner Title"
									}),
									f.subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-cream/90 mb-3 max-w-[90%] leading-relaxed drop-shadow-md",
										children: f.subtitle
									}),
									f.cta_label && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "inline-flex items-center gap-1.5 bg-brand-orange text-white rounded-full px-4 py-2.5 font-bold text-[9px] uppercase tracking-widest shadow-md",
										children: [f.cta_label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3" })]
									})
								]
							})]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 text-center text-xs text-muted-foreground",
						children: "Images will scale responsively on actual devices."
					})
				]
			})
		})]
	})] });
}
//#endregion
export { HeroPage as component };
