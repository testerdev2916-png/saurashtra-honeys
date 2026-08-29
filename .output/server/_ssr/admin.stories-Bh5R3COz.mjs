import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { A as RefreshCcw, L as Pencil, N as Plus, P as Play, a as Video, an as ArrowLeft, ft as ImageOff, l as Upload, nn as ArrowUp, p as Trash2, sn as ArrowDown, z as Pause } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as supabase } from "./client-CiOF68Zx.mjs";
import { n as fetchProducts } from "./product-catalog-DsxAkRUU.mjs";
import { t as useServerFn } from "./useServerFn-BqzygRuj.mjs";
import { O as upsertHomepageVideo, i as deleteHomepageVideo, p as listHomepageVideos, v as reorderHomepageVideos } from "./admin-cms.functions-jTsNSh7F.mjs";
import { a as PageHeader, c as Td, d as inp, i as Field, l as Th, n as BtnPrimary, o as StatusPill, r as Card, s as TableWrap, t as BtnGhost } from "./ui-Cij6S7ah.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.stories-Bh5R3COz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMPTY = {
	title: "",
	subtitle: "",
	badge: "",
	video_url: "",
	thumbnail_url: "",
	product_slug: "ajwain-honey",
	link_url: "/product/ajwain-honey",
	status: "published",
	is_active: true,
	is_featured: false,
	placement: "all",
	display_order: 1
};
function StoriesPage() {
	const listFn = useServerFn(listHomepageVideos);
	const delFn = useServerFn(deleteHomepageVideo);
	const reorderFn = useServerFn(reorderHomepageVideos);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [edit, setEdit] = (0, import_react.useState)(null);
	const [allProducts, setAllProducts] = (0, import_react.useState)([]);
	async function load() {
		setLoading(true);
		try {
			const r = await listFn({});
			setRows(r.rows);
			const p = await fetchProducts();
			if (p.length) setAllProducts(p);
		} catch (e) {
			toast.error(e.message);
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	async function moveRow(index, direction) {
		const targetIdx = index + direction;
		if (targetIdx < 0 || targetIdx >= rows.length) return;
		const clone = [...rows];
		const tempOrder = clone[index].display_order;
		clone[index].display_order = clone[targetIdx].display_order;
		clone[targetIdx].display_order = tempOrder;
		const temp = clone[index];
		clone[index] = clone[targetIdx];
		clone[targetIdx] = temp;
		setRows(clone);
		try {
			await reorderFn({ data: { items: clone.map((r, i) => ({
				id: r.id,
				display_order: i + 1
			})) } });
			toast.success("Order updated");
		} catch (e) {
			toast.error(e.message);
			load();
		}
	}
	if (edit) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editor, {
		initial: edit,
		allProducts,
		onCancel: () => setEdit(null),
		onSaved: async () => {
			setEdit(null);
			await load();
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Homepage Management → Video / Story Section",
		subtitle: `${rows.length} homepage story/video cards (9:16 vertical aspect ratio)`,
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnGhost, {
			onClick: load,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCcw, { className: "size-3.5" }), " REFRESH"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnPrimary, {
			onClick: () => setEdit({
				...EMPTY,
				display_order: rows.length + 1
			}),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), " NEW STORY CARD"]
		})] })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
		"Order",
		"Preview",
		"Title & Subtitle",
		"Badge",
		"Product",
		"Status",
		"Order Move",
		""
	].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: h }, h)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
		className: "divide-y divide-border",
		children: [
			loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "text-center py-12 text-muted-foreground",
				children: "Loading homepage videos..."
			}) }),
			!loading && rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "text-center py-12 text-muted-foreground",
				children: "No homepage videos yet. Click \"New Story Card\" to create one."
			}) }),
			!loading && rows.map((r, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "hover:bg-cream/40",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "text-xs font-mono text-muted-foreground",
						children: r.display_order
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative size-14 aspect-[9/16] rounded-lg overflow-hidden bg-cream-deep border border-border grid place-items-center shrink-0",
						children: [r.thumbnail_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: r.thumbnail_url,
							alt: r.title,
							className: "w-full h-full object-cover",
							loading: "lazy"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageOff, { className: "size-5 text-muted-foreground/50" }), r.video_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute bottom-1 right-1 rounded-full bg-forest-dark/80 text-gold p-1 shadow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-3" })
						})]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-serif font-medium text-forest-dark",
						children: r.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: r.subtitle || "—"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: r.badge ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-flex rounded-full bg-gold/20 text-forest-dark text-[11px] font-semibold px-2 py-0.5",
						children: r.badge
					}) : "—”" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "text-xs font-mono",
						children: r.product_slug || r.link_url || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { s: r.status === "published" ? "active" : "disabled" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground",
							children: r.is_active ? "Active on Homepage" : "Disabled"
						})]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: idx === 0,
							onClick: () => void moveRow(idx, -1),
							className: "p-1 rounded hover:bg-cream-deep disabled:opacity-30 text-forest-dark",
							title: "Move up",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-3.5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: idx === rows.length - 1,
							onClick: () => void moveRow(idx, 1),
							className: "p-1 rounded hover:bg-cream-deep disabled:opacity-30 text-forest-dark",
							title: "Move down",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-3.5" })
						})]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setEdit(r),
							className: "text-gold-deep hover:underline text-xs font-bold mr-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5 inline" }), " EDIT"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: async () => {
								if (!confirm(`Delete story card "${r.title}"?`)) return;
								try {
									await delFn({ data: { id: r.id } });
									toast.success("Deleted story card");
									load();
								} catch (e) {
									toast.error(e.message);
								}
							},
							className: "text-destructive hover:underline text-xs font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5 inline" }), " DELETE"]
						})]
					})
				]
			}, r.id))
		]
	})] })] });
}
function Editor({ initial, allProducts, onCancel, onSaved }) {
	const [f, setF] = (0, import_react.useState)({ ...initial });
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [videoUploading, setVideoUploading] = (0, import_react.useState)(false);
	const [videoProgress, setVideoProgress] = (0, import_react.useState)(0);
	const [thumbUploading, setThumbUploading] = (0, import_react.useState)(false);
	const [previewPlaying, setPreviewPlaying] = (0, import_react.useState)(false);
	const videoRef = (0, import_react.useRef)(null);
	const thumbRef = (0, import_react.useRef)(null);
	const previewVideoRef = (0, import_react.useRef)(null);
	const saveFn = useServerFn(upsertHomepageVideo);
	const MAX_VIDEO_BYTES = 209715200;
	const MAX_THUMB_BYTES = 10 * 1024 * 1024;
	async function onUploadVideo(file) {
		if (!file.type.startsWith("video/")) {
			toast.error("Please choose a valid video file (MP4, WebM, QuickTime)");
			return;
		}
		if (file.size > MAX_VIDEO_BYTES) {
			toast.error(`Video file exceeds 200 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB)`);
			return;
		}
		setVideoUploading(true);
		setVideoProgress(5);
		try {
			const safeName = file.name.replace(/[^\w.\-]+/g, "_");
			const path = `stories/videos/${Date.now()}_${safeName}`;
			const { data, error } = await supabase.storage.from("media").upload(path, file, {
				contentType: file.type,
				cacheControl: "3600",
				upsert: true
			});
			setVideoProgress(90);
			if (error) throw new Error(error.message);
			const { data: pubData } = supabase.storage.from("media").getPublicUrl(data.path);
			const url = pubData.publicUrl;
			setF((prev) => ({
				...prev,
				video_url: url
			}));
			setVideoProgress(100);
			toast.success("9:16 Video uploaded successfully");
		} catch (e) {
			toast.error(e.message);
		} finally {
			setVideoUploading(false);
		}
	}
	async function onUploadThumbnail(file) {
		if (!file.type.startsWith("image/")) {
			toast.error("Please choose a valid image file (JPG, PNG, WebP)");
			return;
		}
		if (file.size > MAX_THUMB_BYTES) {
			toast.error("Thumbnail file exceeds 10 MB limit");
			return;
		}
		setThumbUploading(true);
		try {
			const safeName = file.name.replace(/[^\w.\-]+/g, "_");
			const path = `stories/thumbnails/${Date.now()}_${safeName}`;
			const { data, error } = await supabase.storage.from("media").upload(path, file, {
				contentType: file.type,
				cacheControl: "3600",
				upsert: true
			});
			if (error) throw new Error(error.message);
			const { data: pubData } = supabase.storage.from("media").getPublicUrl(data.path);
			const url = pubData.publicUrl;
			setF((prev) => ({
				...prev,
				thumbnail_url: url
			}));
			toast.success("Poster/thumbnail uploaded successfully");
		} catch (e) {
			toast.error(e.message);
		} finally {
			setThumbUploading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: onCancel,
		className: "inline-flex items-center gap-1 text-xs font-bold text-forest-dark mb-4 hover:underline",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " BACK TO HOMEPAGE VIDEOS"]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-6 max-w-4xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl text-forest-dark mb-2",
				children: f.id ? "Edit Story / Video Card" : "New Story / Video Card"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground mb-6",
				children: "Recommended format: 9:16 vertical (1080 × 1920), maximum 200 MB. Poster-first rendering ensures no video is downloaded until customer interacts."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid md:grid-cols-2 gap-4 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Card Title * (e.g. Digestive Ritual)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.title ?? "",
							onChange: (e) => setF({
								...f,
								title: e.target.value
							}),
							className: inp,
							placeholder: "Digestive Ritual"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Subtitle / Kicker text (e.g. Ajwain Honey)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.subtitle ?? "",
							onChange: (e) => setF({
								...f,
								subtitle: e.target.value
							}),
							className: inp,
							placeholder: "Ajwain Honey"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Badge Label (e.g. Single Flora)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.badge ?? "",
							onChange: (e) => setF({
								...f,
								badge: e.target.value
							}),
							className: inp,
							placeholder: "Single Flora"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Linked Product",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: f.product_slug ?? "",
							onChange: (e) => {
								const slug = e.target.value || null;
								setF({
									...f,
									product_slug: slug,
									link_url: slug ? `/product/${slug}` : f.link_url
								});
							},
							className: inp,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "— No product link / custom URL —"
							}), allProducts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: p.slug,
								children: [
									p.name,
									" (",
									p.category,
									") — ₹",
									p.price
								]
							}, p.slug))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Custom URL / Product Path",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.link_url ?? "",
							onChange: (e) => setF({
								...f,
								link_url: e.target.value
							}),
							className: inp,
							placeholder: "/product/ajwain-honey"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Display Order",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: f.display_order ?? 1,
							onChange: (e) => setF({
								...f,
								display_order: Number(e.target.value)
							}),
							className: inp
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Status",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: f.status ?? "published",
							onChange: (e) => setF({
								...f,
								status: e.target.value
							}),
							className: inp,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "published",
									children: "Published (Public)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "draft",
									children: "Draft (Hidden)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "archived",
									children: "Archived"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Where can it appear? (Placement Context)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: f.placement ?? "all",
							onChange: (e) => setF({
								...f,
								placement: e.target.value
							}),
							className: inp,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: "Everywhere (Homepage, Shop & PDPs)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "homepage",
									children: "Homepage Only"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "shop",
									children: "Shop & Collections Only"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "pdp",
									children: "Product Detail Pages Only"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-6 pt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm font-medium text-forest-dark cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: !!f.is_active,
								onChange: (e) => setF({
									...f,
									is_active: e.target.checked
								}),
								className: "size-4"
							}), "Active on Carousel"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm font-medium text-burnt-orange cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: !!f.is_featured,
								onChange: (e) => setF({
									...f,
									is_featured: e.target.checked
								}),
								className: "size-4"
							}), "Mark Featured"]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 pt-6 border-t border-border grid md:grid-cols-2 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "1. Poster / Thumbnail Image (Required for Poster-First Lazy Loading)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: thumbRef,
									type: "file",
									accept: "image/*",
									className: "hidden",
									onChange: (e) => {
										const file = e.target.files?.[0];
										if (file) onUploadThumbnail(file);
										e.target.value = "";
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnGhost, {
										type: "button",
										disabled: thumbUploading,
										onClick: () => thumbRef.current?.click(),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5" }), thumbUploading ? "UPLOADING THUMBNAIL..." : f.thumbnail_url ? "REPLACE THUMBNAIL" : "UPLOAD THUMBNAIL"]
									}), f.thumbnail_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnGhost, {
										type: "button",
										onClick: () => setF({
											...f,
											thumbnail_url: ""
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), " REMOVE"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: f.thumbnail_url ?? "",
									onChange: (e) => setF({
										...f,
										thumbnail_url: e.target.value
									}),
									className: inp,
									placeholder: "Or paste image URL (https://...)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "JPG, PNG, or WebP. Appears immediately when page loads before customer plays video."
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "2. 9:16 Vertical Video (MP4 / WebM / QuickTime, Max 200 MB)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: videoRef,
									type: "file",
									accept: "video/*",
									className: "hidden",
									onChange: (e) => {
										const file = e.target.files?.[0];
										if (file) onUploadVideo(file);
										e.target.value = "";
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnGhost, {
										type: "button",
										disabled: videoUploading,
										onClick: () => videoRef.current?.click(),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-3.5" }), videoUploading ? `UPLOADING (${videoProgress}%)...` : f.video_url ? "REPLACE VIDEO (MAX 200MB)" : "UPLOAD 9:16 VIDEO (MAX 200MB)"]
									}), f.video_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnGhost, {
										type: "button",
										onClick: () => setF({
											...f,
											video_url: ""
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), " REMOVE"]
									})]
								}),
								videoUploading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full bg-cream-deep h-2 rounded-full overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "bg-gold-deep h-full transition-all duration-300",
										style: { width: `${videoProgress}%` }
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: f.video_url ?? "",
									onChange: (e) => setF({
										...f,
										video_url: e.target.value
									}),
									className: inp,
									placeholder: "Or paste video URL (https://...)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "Vertical 9:16 video (1080 × 1920 recommended). Replaces static image when customer clicks play."
								})
							]
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center p-4 bg-cream/50 rounded-xl border border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-bold tracking-widest text-forest-dark uppercase mb-3",
						children: "9:16 Vertical Storefront Preview"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-48 aspect-[9/16] rounded-2xl overflow-hidden bg-forest-dark shadow-lift border border-border",
						children: [
							f.video_url && previewPlaying ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								ref: previewVideoRef,
								src: f.video_url,
								poster: f.thumbnail_url || void 0,
								playsInline: true,
								muted: true,
								loop: true,
								autoPlay: true,
								className: "w-full h-full object-cover"
							}) : f.thumbnail_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: f.thumbnail_url,
								alt: "Preview",
								className: "w-full h-full object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "w-full h-full flex flex-col items-center justify-center text-cream/50 text-xs p-4 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-8 mb-2 opacity-40" }), "No Thumbnail/Video Set"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-forest-dark/85 via-forest-dark/20 to-transparent pointer-events-none" }),
							f.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-2 left-2 z-10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-block rounded-full bg-cream/20 backdrop-blur-sm text-cream text-[9px] font-semibold tracking-widest uppercase px-2 py-0.5",
									children: f.badge
								})
							}),
							f.video_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setPreviewPlaying(!previewPlaying),
								className: "absolute inset-0 flex items-center justify-center z-10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid place-items-center size-10 rounded-full bg-cream/90 text-forest-dark shadow",
									children: previewPlaying ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4 ml-0.5" })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-10 text-cream z-10",
								children: (() => {
									const p = allProducts.find((item) => item.slug === f.product_slug);
									if (p) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/15",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: p.image,
											alt: p.name,
											className: "size-8 rounded-lg object-cover bg-cream shrink-0 border border-white/20"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-serif text-xs font-bold text-white truncate",
												children: p.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-baseline gap-1 mt-0.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-xs font-bold text-white",
													children: ["₹", p.price]
												}), p.mrp && p.mrp > p.price && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[10px] text-white/60 line-through",
													children: ["₹", p.mrp]
												})]
											})]
										})]
									});
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-serif text-sm leading-tight",
										children: f.title || "Card Title"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-cream/80",
										children: f.subtitle || "Subtitle"
									})] });
								})()
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnPrimary, {
					disabled: busy || videoUploading,
					onClick: async () => {
						if (!f.title?.trim()) {
							toast.error("Title is required");
							return;
						}
						setBusy(true);
						try {
							await saveFn({ data: {
								id: f.id,
								title: f.title,
								subtitle: f.subtitle ?? null,
								badge: f.badge ?? null,
								video_url: f.video_url || null,
								thumbnail_url: f.thumbnail_url || null,
								product_slug: f.product_slug || null,
								link_url: f.link_url || null,
								status: f.status || "published",
								is_active: !!f.is_active,
								display_order: Number(f.display_order ?? 0),
								is_featured: false,
								placement: f.placement || "all"
							} });
							toast.success("Saved story/video card");
							await onSaved();
						} catch (e) {
							toast.error(e.message);
						} finally {
							setBusy(false);
						}
					},
					children: busy ? "SAVING..." : "SAVE STORY CARD"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnGhost, {
					onClick: onCancel,
					children: "CANCEL"
				})]
			})
		]
	})] });
}
//#endregion
export { StoriesPage as component };
