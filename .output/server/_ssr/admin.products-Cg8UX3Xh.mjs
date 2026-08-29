import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { A as RefreshCcw, L as Pencil, N as Plus, Nt as Copy, an as ArrowLeft, ft as ImageOff, jt as Download, l as Upload, p as Trash2, v as Star } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as resolveImage } from "./product-images-CLm3Xqgk.mjs";
import { t as useServerFn } from "./useServerFn-BqzygRuj.mjs";
import { E as upsertCategory, T as uploadProductImage, u as listCategories } from "./admin-cms.functions-jTsNSh7F.mjs";
import { a as PageHeader, c as Td, d as inp, i as Field, l as Th, n as BtnPrimary, o as StatusPill, r as Card, s as TableWrap, t as BtnGhost, u as csvDownload } from "./ui-Cij6S7ah.mjs";
import { i as listAdminProducts, l as saveProductVariants, s as listProductVariants, t as deleteProduct, u as upsertProduct } from "./admin-catalog.functions-Bf3hxAUH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.products-Cg8UX3Xh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMPTY = {
	slug: "",
	name: "",
	tagline: "",
	description: "",
	category: "Single Flora",
	flora: "",
	badge: null,
	price: 0,
	price_max: null,
	mrp: null,
	rating: 0,
	reviews_count: 0,
	sizes: [],
	benefits: [],
	image_key: null,
	image_url: null,
	images: [],
	additional_images: [],
	stock_quantity: 100,
	in_stock: true,
	published: true,
	sort_order: 0,
	low_stock_limit: 5,
	status: "published",
	is_featured: false,
	is_bestseller: false,
	is_new_arrival: false,
	attributes: {},
	show_on_homepage: false
};
function ProductsPage() {
	const list = useServerFn(listAdminProducts);
	const save = useServerFn(upsertProduct);
	const del = useServerFn(deleteProduct);
	const getCats = useServerFn(listCategories);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [cats, setCats] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [edit, setEdit] = (0, import_react.useState)(null);
	const [selected, setSelected] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [q, setQ] = (0, import_react.useState)("");
	const [filterCategory, setFilterCategory] = (0, import_react.useState)("all");
	const [filterStatus, setFilterStatus] = (0, import_react.useState)("all");
	const saveV = useServerFn(saveProductVariants);
	const [isDirty, setIsDirty] = (0, import_react.useState)(false);
	const formRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const handleBeforeUnload = (e) => {
			if (isDirty) {
				e.preventDefault();
				e.returnValue = "";
			}
		};
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [isDirty]);
	async function load() {
		setLoading(true);
		try {
			const [r, c] = await Promise.all([list({}), getCats({})]);
			setRows(r.rows);
			setCats(c.rows || []);
			setSelected(/* @__PURE__ */ new Set());
		} catch (e) {
			toast.error(e.message);
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	async function onSave(p, variants) {
		console.log("UI onSave triggered with images:", p.images);
		const savedId = (await save({ data: {
			id: p.id,
			slug: p.slug,
			name: p.name,
			tagline: p.tagline ?? null,
			description: p.description ?? null,
			category: p.category ?? null,
			flora: p.flora || null,
			badge: p.badge || null,
			price: Number(p.price ?? 0),
			price_max: p.price_max ?? null,
			mrp: p.mrp ?? null,
			rating: Number(p.rating ?? 0),
			reviews_count: Number(p.reviews_count ?? 0),
			sizes: p.sizes ?? [],
			benefits: p.benefits ?? [],
			image_key: p.image_key || null,
			image_url: p.image_url || null,
			images: p.images ?? [],
			additional_images: p.additional_images ?? [],
			stock_quantity: Number(p.stock_quantity ?? 100),
			in_stock: !!p.in_stock,
			published: !!p.published,
			sort_order: Number(p.sort_order ?? 0),
			sku: p.sku || null,
			barcode: p.barcode || null,
			brand: p.brand || null,
			ingredients: p.ingredients || null,
			usage_instructions: p.usage_instructions || null,
			warnings: p.warnings || null,
			cost_price_paise: p.cost_price_paise ?? null,
			gst_percent: p.gst_percent ?? null,
			hsn_code: p.hsn_code || null,
			weight_g: p.weight_g ?? null,
			low_stock_limit: Number(p.low_stock_limit ?? 5),
			status: p.status ?? "published",
			is_featured: !!p.is_featured,
			is_bestseller: !!p.is_bestseller,
			is_new_arrival: !!p.is_new_arrival,
			show_on_homepage: !!p.show_on_homepage,
			video_url: p.video_url || null,
			meta_title: p.meta_title || null,
			meta_description: p.meta_description || null,
			meta_keywords: p.meta_keywords || null,
			canonical_url: p.canonical_url || null,
			attributes: p.attributes || {}
		} })).id || p.id;
		if (savedId && variants && variants.length > 0) try {
			await saveV({ data: {
				product_id: savedId,
				variants
			} });
		} catch (err) {
			console.error("Failed to save variants during product save:", err);
		}
		toast.success("All changes saved successfully.");
		setEdit(null);
		setIsDirty(false);
		await load();
	}
	async function bulkDelete() {
		if (!selected.size) return;
		if (!confirm(`Delete ${selected.size} product(s)?`)) return;
		try {
			for (const id of selected) await del({ data: { id } });
			toast.success(`Deleted ${selected.size}`);
			load();
		} catch (e) {
			toast.error(e.message);
		}
	}
	async function bulkPublish(publish) {
		if (!selected.size) return;
		try {
			for (const id of selected) {
				const r = rows.find((x) => x.id === id);
				if (r) await save({ data: {
					...r,
					id,
					published: publish,
					status: publish ? "published" : "draft"
				} });
			}
			toast.success("Updated");
			load();
		} catch (e) {
			toast.error(e.message);
		}
	}
	async function duplicate(p) {
		try {
			await save({ data: {
				...p,
				id: void 0,
				slug: `${p.slug}-copy`,
				name: `${p.name} (Copy)`,
				published: false,
				status: "draft"
			} });
			toast.success("Duplicated");
			load();
		} catch (e) {
			toast.error(e.message);
		}
	}
	let filtered = rows;
	if (q.trim()) {
		const ql = q.toLowerCase();
		filtered = filtered.filter((r) => [
			r.name,
			r.slug,
			r.sku,
			r.category
		].join(" ").toLowerCase().includes(ql));
	}
	if (filterCategory !== "all") filtered = filtered.filter((r) => r.category === filterCategory);
	if (filterStatus !== "all") filtered = filtered.filter((r) => r.status === filterStatus);
	const cols = [
		"name",
		"slug",
		"sku",
		"category",
		"price",
		"stock_quantity",
		"status"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Products",
		subtitle: edit ? edit.id ? "Edit product" : "New product" : `${rows.length} in catalogue`,
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [
				isDirty && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-bold text-burnt-orange mr-2",
					children: "Unsaved changes"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnPrimary, {
					disabled: !isDirty || !edit,
					onClick: () => {
						if (edit && formRef.current) formRef.current.save().catch((e) => {
							toast.error("Some changes could not be saved. Please try again.");
							console.error(e);
						});
					},
					children: "SAVE"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnGhost, {
					onClick: () => csvDownload(rows, cols, `products-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), " CSV"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnGhost, {
					onClick: load,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCcw, { className: "size-3.5" }), " REFRESH"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnPrimary, {
					onClick: () => setEdit(EMPTY),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), " NEW PRODUCT"]
				})
			]
		})
	}), edit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductForm, {
		ref: formRef,
		initial: edit,
		onDirtyChange: setIsDirty,
		onCancel: () => {
			if (isDirty && !confirm("You have unsaved changes. Are you sure you want to leave?")) return;
			setEdit(null);
			setIsDirty(false);
		},
		onSave: async (p, variants) => {
			try {
				await onSave(p, variants);
			} catch (e) {
				toast.error("Some changes could not be saved. Please try again.");
				throw e;
			}
		}
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search products...",
					className: "flex-1 w-full sm:max-w-xs border border-border rounded-xl px-4 py-2.5 text-sm bg-white shadow-sm focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: filterCategory,
					onChange: (e) => setFilterCategory(e.target.value),
					className: "border border-border rounded-xl px-4 py-2.5 text-sm bg-white shadow-sm focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all cursor-pointer w-full sm:w-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: "All Categories"
					}), cats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: c.name,
						children: c.name
					}, c.id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: filterStatus,
					onChange: (e) => setFilterStatus(e.target.value),
					className: "border border-border rounded-xl px-4 py-2.5 text-sm bg-white shadow-sm focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all cursor-pointer w-full sm:w-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "All Statuses"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "published",
							children: "Published"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "draft",
							children: "Draft"
						})
					]
				})
			]
		}),
		selected.size > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-3 mb-6 flex flex-wrap gap-4 items-center bg-cream-deep border-brand-orange/30 shadow-sm rounded-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-sm font-bold text-forest-dark pl-2",
				children: [selected.size, " selected"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnGhost, {
						onClick: () => bulkPublish(true),
						className: "bg-white hover:bg-cream border border-border",
						children: "PUBLISH"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnGhost, {
						onClick: () => bulkPublish(false),
						className: "bg-white hover:bg-cream border border-border",
						children: "DRAFT"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnGhost, {
						onClick: bulkDelete,
						className: "bg-white border border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-colors",
						children: "DELETE"
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "checkbox",
			checked: selected.size === filtered.length && filtered.length > 0,
			onChange: (e) => setSelected(e.target.checked ? new Set(filtered.map((r) => r.id)) : /* @__PURE__ */ new Set())
		}) }), [
			"PRODUCT",
			"CATEGORY",
			"PRICE",
			"STOCK",
			"STATUS",
			"ACTIONS"
		].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: h }, h))] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
			className: "divide-y divide-border",
			children: [
				loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "text-center py-12 text-muted-foreground",
					children: "Loading…"
				}) }),
				!loading && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "text-center py-12 text-muted-foreground",
					children: "No products."
				}) }),
				!loading && filtered.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "hover:bg-cream/40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: selected.has(r.id),
							onChange: (e) => {
								const s = new Set(selected);
								e.target.checked ? s.add(r.id) : s.delete(r.id);
								setSelected(s);
							}
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [r.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-10 rounded-lg overflow-hidden border border-border/50 shrink-0 bg-cream",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: r.image_url,
									alt: r.name,
									className: "w-full h-full object-cover",
									loading: "lazy"
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-10 rounded-lg border border-border/50 shrink-0 bg-cream flex items-center justify-center text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageOff, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-bold text-forest-dark text-[15px]",
								children: r.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground font-mono mt-0.5",
								children: r.sku ? `${r.sku} • ${r.slug}` : r.slug
							})] })]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "text-xs",
							children: r.category ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, {
							className: "text-xs",
							children: [
								"₹",
								r.price,
								r.price_max ? `–₹${r.price_max}` : ""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: `text-xs ${r.stock_quantity <= r.low_stock_limit ? "text-destructive font-bold" : ""}`,
							children: r.stock_quantity
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { s: r.status }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, {
							className: "text-right whitespace-nowrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setEdit(r),
									className: "text-gold-deep hover:underline text-xs font-bold mr-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5 inline" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => duplicate(r),
									className: "text-forest-dark hover:underline text-xs font-bold mr-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5 inline" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: async () => {
										if (!confirm("Are you sure you want to permanently delete this product? This action cannot be undone.")) return;
										try {
											await del({ data: { id: r.id } });
											toast.success("Product permanently deleted.");
											load();
										} catch (e) {
											toast.error("Unable to delete product. Please try again.");
										}
									},
									className: "text-destructive hover:underline text-xs font-bold",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5 inline" })
								})
							]
						})
					]
				}, r.id))
			]
		})] })
	] })] });
}
var ProductForm = (0, import_react.forwardRef)(({ initial, onCancel, onSave, onDirtyChange }, ref) => {
	const [f, setF] = (0, import_react.useState)({ ...initial });
	const [pendingVariants, setPendingVariants] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		onDirtyChange(JSON.stringify(f) !== JSON.stringify(initial));
	}, [
		f,
		initial,
		onDirtyChange
	]);
	const triggerSave = async () => {
		setBusy(true);
		try {
			if (f.category && !cats.some((c) => c.name === f.category)) try {
				const newSlug = f.category.toLowerCase().replace(/[^\w-]+/g, "-");
				await saveCat({ data: {
					slug: newSlug,
					name: f.category,
					active: true,
					sort_order: cats.length + 1
				} });
			} catch {}
			await onSave(f, pendingVariants);
		} finally {
			setBusy(false);
		}
	};
	(0, import_react.useImperativeHandle)(ref, () => ({ save: triggerSave }));
	const [tab, setTab] = (0, import_react.useState)("general");
	const tabs = [
		["general", "General"],
		["pricing", "Pricing & Stock"],
		["media", "Media"],
		["details", "Details"],
		["seo", "SEO"]
	];
	const listCats = useServerFn(listCategories);
	const saveCat = useServerFn(upsertCategory);
	const [cats, setCats] = (0, import_react.useState)([]);
	const [isNewCat, setIsNewCat] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		listCats({}).then((r) => {
			if (r.rows) setCats(r.rows.filter((x) => x.slug !== "all-products").map((x) => ({
				name: x.name,
				slug: x.slug
			})));
		});
	}, []);
	const uploadImg = useServerFn(uploadProductImage);
	const [uploadingMedia, setUploadingMedia] = (0, import_react.useState)(false);
	(0, import_react.useRef)(null);
	(0, import_react.useRef)(null);
	(0, import_react.useRef)(null);
	(0, import_react.useRef)(null);
	async function handleMediaUpload(file, mode, replaceIdx) {
		setUploadingMedia(true);
		try {
			const b64 = await new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(String(reader.result).split(",")[1]);
				reader.onerror = () => reject(/* @__PURE__ */ new Error("Could not read file"));
				reader.readAsDataURL(file);
			});
			const res = await uploadImg({ data: {
				filename: file.name,
				contentType: file.type,
				base64: b64
			} });
			if (res && res.url) {
				if (mode === "gallery") {
					const cur = [...f.images ?? []];
					if (typeof replaceIdx === "number") cur[replaceIdx] = res.url;
					else if (cur.length < 9) cur.push(res.url);
					setF((prev) => ({
						...prev,
						images: cur,
						image_url: cur[0] ?? prev.image_url
					}));
				} else {
					const cur = [...f.additional_images ?? []];
					cur[mode] = res.url;
					setF((prev) => ({
						...prev,
						additional_images: cur
					}));
				}
				toast.success("Image uploaded");
			}
		} catch (e) {
			toast.error(e.message);
		} finally {
			setUploadingMedia(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: onCancel,
		className: "inline-flex items-center gap-1 text-xs font-bold text-forest-dark mb-4 hover:underline",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " BACK"]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap justify-between items-start gap-3 mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "inline-flex rounded-lg border border-border overflow-hidden w-full sm:w-auto",
					children: tabs.map(([k, l]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setTab(k),
						className: `px-3 py-2 text-[11px] font-bold tracking-widest ${tab === k ? "bg-forest-dark text-cream" : "bg-white text-forest-dark hover:bg-cream"}`,
						children: l
					}, k))
				})
			}),
			tab === "general" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid md:grid-cols-2 gap-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Slug *",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.slug ?? "",
							onChange: (e) => setF({
								...f,
								slug: e.target.value
							}),
							className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Name *",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.name ?? "",
							onChange: (e) => setF({
								...f,
								name: e.target.value
							}),
							className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Brand",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.brand ?? "",
							onChange: (e) => setF({
								...f,
								brand: e.target.value
							}),
							className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Category",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-1.5",
							children: (() => {
								const matchedCat = cats.find((c) => c.name.toLowerCase().trim() === (f.category ?? "").toLowerCase().trim() || c.slug.toLowerCase().trim() === (f.category ?? "").toLowerCase().trim());
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: isNewCat ? "__NEW__" : matchedCat ? matchedCat.name : f.category ?? "",
									onChange: (e) => {
										const val = e.target.value;
										if (val === "__NEW__") {
											setIsNewCat(true);
											setF({
												...f,
												category: ""
											});
										} else {
											setIsNewCat(false);
											setF({
												...f,
												category: val
											});
										}
									},
									className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "— Select Category —"
										}),
										cats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: c.name,
											children: c.name
										}, c.slug)),
										f.category && !matchedCat && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: f.category,
											children: f.category
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "__NEW__",
											children: "+ Create new category..."
										})
									]
								}), isNewCat && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: f.category ?? "",
									onChange: (e) => setF({
										...f,
										category: e.target.value
									}),
									placeholder: "Type new category name (e.g. Single Flora Honey)...",
									className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep"
								})] });
							})()
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Flora / Type",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.flora ?? "",
							onChange: (e) => setF({
								...f,
								flora: e.target.value
							}),
							className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Badge",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.badge ?? "",
							onChange: (e) => setF({
								...f,
								badge: e.target.value || null
							}),
							className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep",
							placeholder: "BESTSELLER / NEW / PREMIUM"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2 border border-border/80 rounded-xl p-4 bg-cream/30 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-xs font-bold text-espresso uppercase tracking-wider",
								children: "Dynamic Category Filter Attributes"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground mt-0.5",
								children: "Define attribute groups (e.g., “Product Type”, “Skin Type”, “Candle Type”) and values (e.g., “Lip Care”) to power faceted filtering on the Shop page."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									const curr = { ...f.attributes || {} };
									let idx = 1;
									while (`Attribute ${idx}` in curr) idx++;
									curr[`Attribute ${idx}`] = "";
									setF({
										...f,
										attributes: curr
									});
								},
								className: "px-2.5 py-1.5 text-xs font-bold bg-espresso text-cream rounded-lg hover:bg-burnt-orange transition-colors shrink-0",
								children: "+ Add Attribute"
							})]
						}), Object.entries(f.attributes || {}).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground italic",
							children: "No custom attributes defined yet."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: Object.entries(f.attributes || {}).map(([key, val], idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										placeholder: "Attribute group (e.g., Product Type)",
										value: key,
										onChange: (e) => {
											const entries = Object.entries(f.attributes || {});
											entries[idx] = [e.target.value, val];
											setF({
												...f,
												attributes: Object.fromEntries(entries)
											});
										},
										className: `mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep text-xs w-1/2`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										placeholder: "Value (e.g., Lip Care)",
										value: Array.isArray(val) ? val.join(", ") : val,
										onChange: (e) => {
											const entries = Object.entries(f.attributes || {});
											entries[idx] = [key, e.target.value];
											setF({
												...f,
												attributes: Object.fromEntries(entries)
											});
										},
										className: `mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep text-xs w-1/2`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											const entries = Object.entries(f.attributes || {}).filter((_, i) => i !== idx);
											setF({
												...f,
												attributes: Object.fromEntries(entries)
											});
										},
										className: "p-2 text-muted-foreground hover:text-red-600",
										title: "Remove attribute",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
									})
								]
							}, idx))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Tagline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: f.tagline ?? "",
								onChange: (e) => setF({
									...f,
									tagline: e.target.value
								}),
								className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep"
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Short description",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 4,
								value: f.description ?? "",
								onChange: (e) => setF({
									...f,
									description: e.target.value
								}),
								className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep"
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Status",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: f.status ?? "published",
							onChange: (e) => setF({
								...f,
								status: e.target.value,
								published: e.target.value === "published"
							}),
							className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "draft",
									children: "Draft"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "published",
									children: "Published"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "archived",
									children: "Archived"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Sort order",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: f.sort_order ?? 0,
							onChange: (e) => setF({
								...f,
								sort_order: Number(e.target.value)
							}),
							className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: !!f.is_featured,
								onChange: (e) => setF({
									...f,
									is_featured: e.target.checked
								})
							}),
							" ",
							"Featured"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: !!f.is_bestseller,
								onChange: (e) => setF({
									...f,
									is_bestseller: e.target.checked
								})
							}),
							" ",
							"Best seller"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: !!f.is_new_arrival,
								onChange: (e) => setF({
									...f,
									is_new_arrival: e.target.checked
								})
							}),
							" ",
							"New arrival"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: !!f.show_on_homepage,
								onChange: (e) => setF({
									...f,
									show_on_homepage: e.target.checked
								})
							}),
							" ",
							"Show on Homepage (Our Finest Picks)"
						]
					})
				]
			}),
			tab === "pricing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VariantsEditor, {
					productId: f.id,
					productSlug: f.slug,
					initialSizes: f.sizes,
					productPrice: f.price,
					productMrp: f.mrp,
					productStock: f.stock_quantity,
					productSku: f.sku,
					productWeight: f.weight_g,
					onVariantsChange: (variants) => {
						setPendingVariants(variants);
						const defaultVar = variants.find((v) => v.is_default) || variants[0];
						if (defaultVar) {
							const activeLabels = variants.filter((v) => v.is_active).map((v) => v.label);
							const totalStock = variants.filter((v) => v.is_active).reduce((sum, v) => sum + (v.stock_quantity || 0), 0);
							setF((prev) => ({
								...prev,
								price: defaultVar.price,
								mrp: defaultVar.mrp,
								stock_quantity: totalStock,
								sku: defaultVar.sku || prev.sku,
								weight_g: defaultVar.weight_g || prev.weight_g,
								sizes: activeLabels,
								in_stock: totalStock > 0
							}));
						}
					}
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-border pt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-sm font-bold text-forest-dark mb-3",
						children: "Product-Level Tax & Reference Fields"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid md:grid-cols-3 gap-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "GST %",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									step: "0.5",
									value: f.gst_percent ?? "",
									onChange: (e) => setF({
										...f,
										gst_percent: e.target.value ? Number(e.target.value) : null
									}),
									className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "HSN code",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: f.hsn_code ?? "",
									onChange: (e) => setF({
										...f,
										hsn_code: e.target.value
									}),
									className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Brand",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: f.brand ?? "",
									onChange: (e) => setF({
										...f,
										brand: e.target.value
									}),
									className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep"
								})
							})
						]
					})]
				})]
			}),
			tab === "media" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-8 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 rounded-2xl bg-cream/40 border border-border/80 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-serif text-lg font-bold text-espresso",
								children: "Product Gallery Images"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Upload up to 4 permanent images. Recommended size: 1080 × 1080 px."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 sm:grid-cols-4 gap-4",
								children: [
									0,
									1,
									2,
									3
								].map((idx) => {
									const u = (f.images ?? [])[idx] || "";
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `relative group rounded-2xl border p-3 bg-white flex flex-col justify-between space-y-3 ${idx === 0 ? "border-2 border-burnt-orange shadow-md" : "border-border/80"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `text-[10px] font-bold uppercase tracking-wider ${idx === 0 ? "text-burnt-orange" : "text-espresso"}`,
													children: idx === 0 ? "Primary (Main)" : `Gallery ${idx + 1}`
												}), u && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => {
														const cur = Array.from({ length: 4 }, (_, i) => (f.images ?? [])[i] || "");
														cur[idx] = "";
														setF({
															...f,
															images: cur,
															image_url: cur[0] || null
														});
													},
													className: "text-destructive text-[10px] hover:underline font-semibold",
													children: "Remove"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "aspect-square rounded-xl overflow-hidden bg-cream-deep/30 border border-border/40 grid place-items-center relative",
												children: u ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: resolveImage(u, null),
													alt: `Gallery ${idx + 1}`,
													className: "w-full h-full object-cover"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-center text-muted-foreground/60 p-4",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageOff, { className: "size-6 mx-auto mb-1 opacity-40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[10px] block",
														children: "1080 × 1080 px"
													})]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "file",
												accept: "image/*",
												className: "hidden",
												onChange: (e) => {
													const file = e.target.files?.[0];
													if (file) {
														const cur = Array.from({ length: 4 }, (_, i) => (f.images ?? [])[i] || "");
														setF({
															...f,
															images: cur
														});
														handleMediaUpload(file, "gallery", idx);
													}
													e.target.value = "";
												}
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex gap-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnGhost, {
													type: "button",
													disabled: uploadingMedia,
													onClick: (e) => {
														const input = e.currentTarget.parentElement?.parentElement?.querySelector("input[type='file']");
														if (input) input.click();
													},
													className: `flex-1 border-border font-semibold text-xs py-2 px-1 ${idx === 0 ? "text-burnt-orange" : "text-espresso"}`,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5" }), u ? "REPLACE" : "UPLOAD"]
												})
											})] })
										]
									}, idx);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Or paste Gallery URLs (one per line, exactly 4 lines mapping to slots 1-4)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 4,
									value: Array.from({ length: 4 }, (_, i) => (f.images ?? [])[i] || "").join("\n"),
									onChange: (e) => {
										const lines = e.target.value.split("\n").map((s) => s.trim());
										const cur = Array.from({ length: 4 }, (_, i) => lines[i] || "");
										setF({
											...f,
											images: cur,
											image_url: cur[0] || null
										});
									},
									className: `mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep font-mono text-xs`,
									placeholder: "Paste exactly 4 image URLs, one per line (leave blank line for empty slot)"
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5 rounded-2xl bg-cream/40 border border-border/80 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-serif text-lg font-bold text-espresso",
							children: "Additional Product Images"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Upload up to 8 images. Recommended size: 1080 × 1080 px."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4",
							children: [
								0,
								1,
								2,
								3,
								4,
								5,
								6,
								7
							].map((idx) => {
								const url = (f.additional_images ?? [])[idx];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-border/80 p-3 bg-white flex flex-col justify-between space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs font-bold uppercase tracking-wider text-espresso",
												children: ["Additional Image ", idx + 1]
											}), url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													const cur = [...f.additional_images ?? []];
													cur[idx] = "";
													setF({
														...f,
														additional_images: cur
													});
												},
												className: "text-destructive text-xs hover:underline font-semibold",
												children: "Remove"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "aspect-square rounded-xl overflow-hidden bg-cream-deep/30 border border-border/40 grid place-items-center relative",
											children: url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: resolveImage(url, null),
												alt: `Additional ${idx + 1}`,
												className: "w-full h-full object-cover"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-center text-muted-foreground/60 p-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageOff, { className: "size-6 mx-auto mb-1 opacity-40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs block",
													children: "1080 × 1080 px"
												})]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "file",
												accept: "image/*",
												className: "hidden",
												onChange: (e) => {
													const file = e.target.files?.[0];
													if (file) handleMediaUpload(file, idx);
													e.target.value = "";
												}
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex gap-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnGhost, {
													type: "button",
													disabled: uploadingMedia,
													onClick: (e) => {
														const input = e.currentTarget.parentElement?.parentElement?.querySelector("input[type='file']");
														if (input) input.click();
													},
													className: "flex-1 border-border text-espresso font-semibold text-xs py-2 px-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5" }), url ? "REPLACE" : "UPLOAD"]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: url ?? "",
												onChange: (e) => {
													const cur = [...f.additional_images ?? []];
													cur[idx] = e.target.value;
													setF({
														...f,
														additional_images: cur
													});
												},
												className: `mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep mt-2 text-[10px] font-mono`,
												placeholder: "Or paste URL…"
											})
										] })
									]
								}, idx);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-5 rounded-2xl bg-cream/40 border border-border/80",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Product video URL",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: f.video_url ?? "",
								onChange: (e) => setF({
									...f,
									video_url: e.target.value || null
								}),
								className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep",
								placeholder: "https://youtube.com/embed/… or MP4 URL"
							})
						})
					})
				]
			}),
			tab === "details" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid md:grid-cols-2 gap-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Benefits (separate with |)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: (f.benefits ?? []).join(" | "),
								onChange: (e) => setF({
									...f,
									benefits: e.target.value.split("|").map((s) => s.trim()).filter(Boolean)
								}),
								className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep"
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Ingredients",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 4,
								value: f.ingredients ?? "",
								onChange: (e) => setF({
									...f,
									ingredients: e.target.value
								}),
								className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep"
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Usage / directions",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 4,
								value: f.usage_instructions ?? "",
								onChange: (e) => setF({
									...f,
									usage_instructions: e.target.value
								}),
								className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep"
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Warnings / disclaimers",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 3,
								value: f.warnings ?? "",
								onChange: (e) => setF({
									...f,
									warnings: e.target.value
								}),
								className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep"
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Rating (0–5)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							step: "0.1",
							value: f.rating ?? 0,
							onChange: (e) => setF({
								...f,
								rating: Number(e.target.value)
							}),
							className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Reviews count",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: f.reviews_count ?? 0,
							onChange: (e) => setF({
								...f,
								reviews_count: Number(e.target.value)
							}),
							className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep"
						})
					})
				]
			}),
			tab === "seo" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid md:grid-cols-2 gap-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Meta title",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.meta_title ?? "",
							onChange: (e) => setF({
								...f,
								meta_title: e.target.value
							}),
							className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Canonical URL",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.canonical_url ?? "",
							onChange: (e) => setF({
								...f,
								canonical_url: e.target.value
							}),
							className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Meta description",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 3,
								value: f.meta_description ?? "",
								onChange: (e) => setF({
									...f,
									meta_description: e.target.value
								}),
								className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep"
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Meta keywords",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: f.meta_keywords ?? "",
								onChange: (e) => setF({
									...f,
									meta_keywords: e.target.value
								}),
								className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep",
								placeholder: "comma, separated, keywords"
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex gap-3 border-t border-border pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnPrimary, {
					disabled: busy,
					onClick: triggerSave,
					children: busy ? "SAVING…" : "SAVE"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnGhost, {
					onClick: onCancel,
					children: "CANCEL"
				})]
			})
		]
	})] });
});
function buildFallbackVariants(slug, productId, sizes, defaultPrice, defaultMrp, defaultStock, defaultSku, defaultWeight) {
	const pid = productId || "";
	if (slug === "ajwain-honey" || slug === "prod-ajwain") return [
		{
			product_id: pid,
			label: "250g",
			weight_g: 250,
			price: 349,
			mrp: 399,
			cost_price: 200,
			stock_quantity: 100,
			low_stock_threshold: 5,
			sku: "SH-AJW-250",
			barcode: "",
			is_default: true,
			is_active: true,
			sort_order: 0
		},
		{
			product_id: pid,
			label: "500g",
			weight_g: 500,
			price: 649,
			mrp: 749,
			cost_price: 400,
			stock_quantity: 75,
			low_stock_threshold: 5,
			sku: "SH-AJW-500",
			barcode: "",
			is_default: false,
			is_active: true,
			sort_order: 1
		},
		{
			product_id: pid,
			label: "1kg",
			weight_g: 1e3,
			price: 1199,
			mrp: 1399,
			cost_price: 750,
			stock_quantity: 40,
			low_stock_threshold: 5,
			sku: "SH-AJW-1000",
			barcode: "",
			is_default: false,
			is_active: true,
			sort_order: 2
		}
	];
	if (slug === "fennel-honey" || slug === "prod-fennel") return [
		{
			product_id: pid,
			label: "250g",
			weight_g: 250,
			price: 349,
			mrp: 399,
			cost_price: 200,
			stock_quantity: 80,
			low_stock_threshold: 5,
			sku: "SH-FEN-250",
			barcode: "",
			is_default: true,
			is_active: true,
			sort_order: 0
		},
		{
			product_id: pid,
			label: "500g",
			weight_g: 500,
			price: 649,
			mrp: 749,
			cost_price: 400,
			stock_quantity: 60,
			low_stock_threshold: 5,
			sku: "SH-FEN-500",
			barcode: "",
			is_default: false,
			is_active: true,
			sort_order: 1
		},
		{
			product_id: pid,
			label: "1kg",
			weight_g: 1e3,
			price: 1199,
			mrp: 1399,
			cost_price: 750,
			stock_quantity: 30,
			low_stock_threshold: 5,
			sku: "SH-FEN-1000",
			barcode: "",
			is_default: false,
			is_active: true,
			sort_order: 2
		}
	];
	if (slug === "lychee-honey" || slug === "prod-lychee") return [
		{
			product_id: pid,
			label: "250g",
			weight_g: 250,
			price: 399,
			mrp: 449,
			cost_price: 220,
			stock_quantity: 90,
			low_stock_threshold: 5,
			sku: "SH-LYC-250",
			barcode: "",
			is_default: true,
			is_active: true,
			sort_order: 0
		},
		{
			product_id: pid,
			label: "500g",
			weight_g: 500,
			price: 749,
			mrp: 849,
			cost_price: 450,
			stock_quantity: 50,
			low_stock_threshold: 5,
			sku: "SH-LYC-500",
			barcode: "",
			is_default: false,
			is_active: true,
			sort_order: 1
		},
		{
			product_id: pid,
			label: "1kg",
			weight_g: 1e3,
			price: 1399,
			mrp: 1599,
			cost_price: 850,
			stock_quantity: 25,
			low_stock_threshold: 5,
			sku: "SH-LYC-1000",
			barcode: "",
			is_default: false,
			is_active: true,
			sort_order: 2
		}
	];
	if (slug === "multiflora-honey" || slug === "prod-multiflora") return [
		{
			product_id: pid,
			label: "250g",
			weight_g: 250,
			price: 299,
			mrp: 349,
			cost_price: 180,
			stock_quantity: 120,
			low_stock_threshold: 5,
			sku: "SH-MUL-250",
			barcode: "",
			is_default: true,
			is_active: true,
			sort_order: 0
		},
		{
			product_id: pid,
			label: "500g",
			weight_g: 500,
			price: 549,
			mrp: 649,
			cost_price: 350,
			stock_quantity: 80,
			low_stock_threshold: 5,
			sku: "SH-MUL-500",
			barcode: "",
			is_default: false,
			is_active: true,
			sort_order: 1
		},
		{
			product_id: pid,
			label: "1kg",
			weight_g: 1e3,
			price: 999,
			mrp: 1199,
			cost_price: 650,
			stock_quantity: 45,
			low_stock_threshold: 5,
			sku: "SH-MUL-1000",
			barcode: "",
			is_default: false,
			is_active: true,
			sort_order: 2
		}
	];
	if (sizes && sizes.length > 0) return sizes.map((sz, i) => ({
		product_id: pid,
		label: sz,
		weight_g: defaultWeight || null,
		price: defaultPrice || 0,
		mrp: defaultMrp || null,
		cost_price: null,
		stock_quantity: defaultStock || 100,
		low_stock_threshold: 5,
		sku: defaultSku ? i === 0 ? defaultSku : `${defaultSku}-${sz}` : "",
		barcode: "",
		is_default: i === 0,
		is_active: true,
		sort_order: i
	}));
	return [{
		product_id: pid,
		label: "Default",
		weight_g: defaultWeight || null,
		price: defaultPrice || 0,
		mrp: defaultMrp || null,
		cost_price: null,
		stock_quantity: defaultStock || 100,
		low_stock_threshold: 5,
		sku: defaultSku || "",
		barcode: "",
		is_default: true,
		is_active: true,
		sort_order: 0
	}];
}
function VariantsEditor({ productId, productSlug, initialSizes, productPrice, productMrp, productStock, productSku, productWeight, onVariantsChange }) {
	const [variants, setVariants] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const listV = useServerFn(listProductVariants);
	const saveV = useServerFn(saveProductVariants);
	(0, import_react.useEffect)(() => {
		const defaultList = buildFallbackVariants(productSlug, productId, initialSizes, productPrice, productMrp, productStock, productSku, productWeight);
		if (!productId) {
			setVariants(defaultList);
			onVariantsChange(defaultList);
			return;
		}
		setLoading(true);
		listV({ data: { product_id: productId } }).then((res) => {
			if (res && res.rows && res.rows.length > 0) {
				setVariants(res.rows);
				onVariantsChange(res.rows);
			} else {
				setVariants(defaultList);
				onVariantsChange(defaultList);
			}
		}).catch((err) => {
			console.error("Failed to load variants:", err);
			setVariants(defaultList);
			onVariantsChange(defaultList);
		}).finally(() => setLoading(false));
	}, [productId]);
	function updateVariant(idx, patch) {
		const next = variants.map((v, i) => i === idx ? {
			...v,
			...patch
		} : v);
		setVariants(next);
		onVariantsChange(next);
	}
	function handleSetDefault(idx) {
		const next = variants.map((v, i) => ({
			...v,
			is_default: i === idx
		}));
		setVariants(next);
		onVariantsChange(next);
	}
	function handleAddVariant() {
		const newVariant = {
			product_id: productId || "",
			label: "",
			weight_g: null,
			price: productPrice || 0,
			mrp: productMrp || null,
			cost_price: null,
			stock_quantity: 100,
			low_stock_threshold: 5,
			sku: "",
			barcode: "",
			is_default: variants.length === 0,
			is_active: true,
			sort_order: variants.length
		};
		const next = [...variants, newVariant];
		setVariants(next);
		onVariantsChange(next);
	}
	function handleDeleteVariant(idx) {
		if (variants.length <= 1) {
			toast.error("A product must have at least one variant.");
			return;
		}
		const next = variants.filter((_, i) => i !== idx);
		if (!next.some((v) => v.is_default) && next.length > 0) next[0].is_default = true;
		setVariants(next);
		onVariantsChange(next);
	}
	async function handleSaveVariants() {
		if (!productId) {
			toast.error("Please save the product first before saving variants independently.");
			return;
		}
		setSaving(true);
		try {
			const res = await saveV({ data: {
				product_id: productId,
				variants
			} });
			toast.success("Variants saved successfully!");
			if (res && res.variants) {
				setVariants(res.variants);
				onVariantsChange(res.variants);
			}
		} catch (e) {
			toast.error("Error saving variants: " + e.message);
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 bg-cream/50 p-4 rounded-xl border border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-serif text-lg font-bold text-forest-dark",
					children: "PRODUCT VARIANTS"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-0.5",
					children: "Manage independent size, price, MRP, cost, stock, SKU, barcode, and weight for each option. Only ONE variant can be marked Default."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnGhost, {
						type: "button",
						onClick: handleAddVariant,
						className: "bg-white hover:bg-cream border border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), " ADD VARIANT"]
					}), productId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnPrimary, {
						type: "button",
						onClick: handleSaveVariants,
						disabled: saving || loading,
						children: saving ? "SAVING..." : "SAVE VARIANTS"
					})]
				})]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-8 text-center text-xs text-muted-foreground",
				children: "Loading variants…"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: variants.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full border border-border rounded-xl p-4 bg-white shadow-sm space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-mono font-bold bg-cream px-2 py-0.5 rounded text-forest-dark",
									children: ["#", i + 1]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-serif font-bold text-sm text-forest-dark",
									children: v.label || "New Variant"
								}),
								v.is_default && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "bg-forest text-cream text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 fill-current" }), " ★ Default"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [
								!v.is_default && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => handleSetDefault(i),
									className: "text-xs font-semibold px-2.5 py-1 rounded-full border border-border hover:border-gold-deep text-forest-dark transition-colors",
									children: "Set Default"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "inline-flex items-center gap-1.5 text-xs font-semibold text-forest-dark cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: v.is_active,
										onChange: (e) => updateVariant(i, { is_active: e.target.checked }),
										className: "rounded border-border text-forest"
									}), "Active"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => handleDeleteVariant(i),
									className: "text-destructive hover:bg-destructive/10 p-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-colors",
									title: "Delete Variant",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), " Delete"]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Size / Label *",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: v.label,
									onChange: (e) => updateVariant(i, { label: e.target.value }),
									placeholder: "e.g. 250g, 500g, 1kg",
									className: inp
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Weight (g)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									value: v.weight_g ?? "",
									onChange: (e) => updateVariant(i, { weight_g: e.target.value ? Number(e.target.value) : null }),
									placeholder: "e.g. 250",
									className: inp
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Selling Price ₹ *",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									value: v.price,
									onChange: (e) => updateVariant(i, { price: Number(e.target.value) }),
									className: inp
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "MRP ₹",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									value: v.mrp ?? "",
									onChange: (e) => updateVariant(i, { mrp: e.target.value ? Number(e.target.value) : null }),
									className: inp
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Cost Price ₹",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									value: v.cost_price ?? "",
									onChange: (e) => updateVariant(i, { cost_price: e.target.value ? Number(e.target.value) : null }),
									className: inp
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Stock Quantity *",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									value: v.stock_quantity,
									onChange: (e) => updateVariant(i, { stock_quantity: Number(e.target.value) }),
									className: inp
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Low Stock Threshold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									value: v.low_stock_threshold,
									onChange: (e) => updateVariant(i, { low_stock_threshold: Number(e.target.value) }),
									className: inp
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "SKU",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: v.sku ?? "",
									onChange: (e) => updateVariant(i, { sku: e.target.value || null }),
									placeholder: "e.g. SH-AJW-250",
									className: inp
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Barcode",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: v.barcode ?? "",
									onChange: (e) => updateVariant(i, { barcode: e.target.value || null }),
									placeholder: "EAN / UPC code",
									className: inp
								})
							})
						]
					})]
				}, v.id || `var-${i}`))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pt-2 flex justify-start",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnGhost, {
					type: "button",
					onClick: handleAddVariant,
					className: "bg-white hover:bg-cream border border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), " ADD VARIANT"]
				})
			})
		]
	});
}
//#endregion
export { ProductsPage as component };
