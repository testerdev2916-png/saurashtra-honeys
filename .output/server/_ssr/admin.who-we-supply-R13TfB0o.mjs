import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { A as RefreshCcw, C as ShieldCheck, Et as Factory, Jt as Briefcase, L as Pencil, Lt as CircleX, N as Plus, Rt as CirclePlus, St as Gift, V as Package, _ as Store, an as ArrowLeft, l as Upload, p as Trash2, qt as Building2, s as UsersRound, tn as Award, u as Truck } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as supabase } from "./client-CiOF68Zx.mjs";
import { i as resolveImage, n as IMAGE_KEYS } from "./product-images-CLm3Xqgk.mjs";
import { l as stringType, n as arrayType, o as numberType, r as booleanType, s as objectType } from "../_libs/zod.mjs";
import { t as useServerFn } from "./useServerFn-BqzygRuj.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-Uqm2rRc8.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-ZAYK2SXy.mjs";
import { a as PageHeader, c as Td, d as inp, i as Field, l as Th, n as BtnPrimary, o as StatusPill, r as Card, s as TableWrap, t as BtnGhost } from "./ui-Cij6S7ah.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.who-we-supply-R13TfB0o.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
createServerFn({ method: "POST" }).handler(createSsrRpc("9bc4be56e09ccac9e7ba220f34bb31502001dc104ed807b5d132000a67d290b0"));
var listAdminSupplyServices = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("b91ec57940e2ae5daaa73b45cb6912174724c05290894eb52c06c9d6ebae1311"));
var supplyServiceSchema = objectType({
	id: stringType().uuid().optional(),
	title: stringType().min(1, "Title is required").max(150),
	short_description: stringType().min(1, "Short description is required").max(300),
	image_key: stringType().max(120).nullable().optional(),
	image_url: stringType().max(2e3).nullable().optional(),
	icon_name: stringType().min(1).max(50).default("Store"),
	detail_title: stringType().min(1, "Detail title is required").max(150),
	subtitle: stringType().min(1, "Subtitle is required").max(250),
	full_description: stringType().min(1, "Full description is required").max(3e3),
	key_points: arrayType(stringType().min(1)).default([]),
	cta_text: stringType().min(1, "CTA text is required").max(100),
	cta_message: stringType().min(1, "CTA message is required").max(1e3),
	is_active: booleanType().default(true),
	sort_order: numberType().int().default(0)
});
var upsertSupplyService = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => supplyServiceSchema.parse(d)).handler(createSsrRpc("54d44f04fd52ecddd43c8eaacbf3a28a8a192b35d65c714ea2289fb61f4938a2"));
var deleteSupplyService = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ id: stringType().uuid() }).parse(d)).handler(createSsrRpc("fc96e535b14a83e30a37e142a5d941e80482fd8a62cd8b34fb62f55ad94cc7a5"));
var AVAILABLE_ICONS = [
	"Store",
	"Factory",
	"Gift",
	"Users2",
	"Building2",
	"Briefcase",
	"Award",
	"Package",
	"Truck",
	"ShieldCheck"
];
var ICON_MAP = {
	Store,
	Factory,
	Gift,
	Users2: UsersRound,
	Building2,
	Briefcase,
	Award,
	Package,
	Truck,
	ShieldCheck
};
var EMPTY = {
	title: "",
	short_description: "",
	image_key: "prod-multiflora",
	image_url: null,
	icon_name: "Store",
	detail_title: "",
	subtitle: "",
	full_description: "",
	key_points: [
		"Bulk honey sourcing",
		"Multiple packaging options",
		"Consistent quality and supply"
	],
	cta_text: "Enquire Now",
	cta_message: "Hello Saurashtra Honey, I’m interested in your supply services.",
	is_active: true,
	sort_order: 1
};
function WhoWeSupplyPage() {
	const listFn = useServerFn(listAdminSupplyServices);
	const delFn = useServerFn(deleteSupplyService);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [edit, setEdit] = (0, import_react.useState)(null);
	async function load() {
		setLoading(true);
		try {
			const r = await listFn({});
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
	if (edit) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editor, {
		initial: edit,
		onCancel: () => setEdit(null),
		onSaved: async () => {
			setEdit(null);
			await load();
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Who We Supply",
		subtitle: `${rows.length} supply cards displayed on the Bulk Orders page`,
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnGhost, {
			onClick: load,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCcw, { className: "size-3.5" }), " REFRESH"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnPrimary, {
			onClick: () => setEdit(EMPTY),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), " NEW CARD"]
		})] })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
		"Sort",
		"Icon",
		"Card Title",
		"Short Description",
		"WhatsApp CTA",
		"Status",
		""
	].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: h }, h)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
		className: "divide-y divide-border",
		children: [
			loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "text-center py-12 text-muted-foreground",
				"aria-colspan": 7,
				children: "Loading…"
			}) }),
			!loading && rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "text-center py-12 text-muted-foreground",
				"aria-colspan": 7,
				children: "No supply service cards found."
			}) }),
			!loading && rows.map((r) => {
				const IconComponent = ICON_MAP[r.icon_name] || Store;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "hover:bg-cream/40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "text-xs text-muted-foreground font-semibold",
							children: r.sort_order
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-8 rounded-full bg-cream-deep flex items-center justify-center text-burnt-orange shadow-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconComponent, { className: "size-4" })
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "font-medium text-forest-dark",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: resolveImage(r.image_key, r.image_url),
									alt: r.title,
									className: "size-8 rounded object-cover border border-border"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.title })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "text-xs text-muted-foreground max-w-xs truncate",
							children: r.short_description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, {
							className: "text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold",
								children: r.cta_text
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted-foreground max-w-xs truncate",
								children: r.cta_message
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { s: r.is_active ? "live" : "disabled" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setEdit(r),
								className: "text-gold-deep hover:underline text-xs font-bold mr-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5 inline" }), " EDIT"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: async () => {
									if (!confirm(`Delete card "${r.title}"?`)) return;
									try {
										if (r.id) await delFn({ data: { id: r.id } });
										toast.success("Deleted");
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
				}, r.id || r.title);
			})
		]
	})] })] });
}
function Editor({ initial, onCancel, onSaved }) {
	const [f, setF] = (0, import_react.useState)({
		...initial,
		key_points: initial.key_points || []
	});
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const saveFn = useServerFn(upsertSupplyService);
	async function onUploadImage(file) {
		if (!file.type.startsWith("image/")) {
			toast.error("Please choose an image file");
			return;
		}
		setUploading(true);
		try {
			const safeName = file.name.replace(/[^\w.-]+/g, "_");
			const path = `who-we-supply/${Date.now()}_${safeName}`;
			const { data, error } = await supabase.storage.from("media").upload(path, file, {
				contentType: file.type,
				cacheControl: "3600",
				upsert: true
			});
			if (error) throw new Error(error.message);
			const { data: pubData } = supabase.storage.from("media").getPublicUrl(data.path);
			setF((prev) => ({
				...prev,
				image_url: pubData.publicUrl,
				image_key: null
			}));
			toast.success("Image uploaded successfully");
		} catch (e) {
			toast.error(e.message);
		} finally {
			setUploading(false);
		}
	}
	function updatePoint(index, val) {
		const list = [...f.key_points || []];
		list[index] = val;
		setF({
			...f,
			key_points: list
		});
	}
	function addPoint() {
		const list = [...f.key_points || [], ""];
		setF({
			...f,
			key_points: list
		});
	}
	function removePoint(index) {
		const list = (f.key_points || []).filter((_, i) => i !== index);
		setF({
			...f,
			key_points: list
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: onCancel,
		className: "inline-flex items-center gap-1 text-xs font-bold text-forest-dark mb-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " BACK"]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-6 max-w-4xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl text-forest-dark mb-4",
				children: f.id ? "Edit Supply Service Card" : "New Supply Service Card"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid md:grid-cols-2 gap-4 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Card Title *",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.title ?? "",
							onChange: (e) => setF({
								...f,
								title: e.target.value
							}),
							placeholder: "e.g. Retail Chains",
							className: inp
						})
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Short Description *",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.short_description ?? "",
							onChange: (e) => setF({
								...f,
								short_description: e.target.value
							}),
							placeholder: "e.g. Grocery, organic and speciality stores",
							className: inp
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Card Icon",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: f.icon_name ?? "Store",
							onChange: (e) => setF({
								...f,
								icon_name: e.target.value
							}),
							className: inp,
							children: AVAILABLE_ICONS.map((ic) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: ic,
								children: ic
							}, ic))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Image Key (Preset)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: f.image_key ?? "",
							onChange: (e) => setF({
								...f,
								image_key: e.target.value || null
							}),
							className: inp,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "— use custom URL / upload —"
							}), IMAGE_KEYS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: k,
								children: k
							}, k))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Image URL",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: f.image_url ?? "",
								onChange: (e) => setF({
									...f,
									image_url: e.target.value || null
								}),
								className: inp,
								placeholder: "https://…"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-1 cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-cream-deep border border-border rounded-lg text-xs font-bold text-espresso hover:bg-gold-deep hover:text-white transition-colors shrink-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5" }),
									uploading ? "UPLOADING…" : "UPLOAD",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "image/*",
										className: "hidden",
										disabled: uploading,
										onChange: (e) => {
											const file = e.target.files?.[0];
											if (file) onUploadImage(file);
										}
									})
								]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Detail Modal Title *",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.detail_title ?? "",
							onChange: (e) => setF({
								...f,
								detail_title: e.target.value
							}),
							placeholder: "e.g. Retail Chains",
							className: inp
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Detail Subtitle *",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.subtitle ?? "",
							onChange: (e) => setF({
								...f,
								subtitle: e.target.value
							}),
							placeholder: "e.g. Premium Natural Honey for Modern Retail",
							className: inp
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Full Description *",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 3,
								value: f.full_description ?? "",
								onChange: (e) => setF({
									...f,
									full_description: e.target.value
								}),
								placeholder: "Full description displayed inside the detail modal",
								className: inp
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-forest-dark",
								children: "Key Points / Features"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: addPoint,
								className: "inline-flex items-center gap-1 text-xs font-bold text-gold-deep hover:underline",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { className: "size-3.5" }), " ADD POINT"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: (f.key_points || []).map((point, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: point,
									onChange: (e) => updatePoint(idx, e.target.value),
									placeholder: `Feature point #${idx + 1}`,
									className: `${inp} mt-0`
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => removePoint(idx),
									className: "text-destructive hover:text-red-700 p-1",
									title: "Remove point",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-4" })
								})]
							}, idx))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "CTA Button Text *",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.cta_text ?? "",
							onChange: (e) => setF({
								...f,
								cta_text: e.target.value
							}),
							placeholder: "e.g. Enquire for Retail Supply",
							className: inp
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "CTA WhatsApp Enquiry Message *",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.cta_message ?? "",
							onChange: (e) => setF({
								...f,
								cta_message: e.target.value
							}),
							placeholder: "e.g. Hello Saurashtra Honey, I’m interested in Retail Supply...",
							className: inp
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-xs md:col-span-2 mt-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: !!f.is_active,
								onChange: (e) => setF({
									...f,
									is_active: e.target.checked
								})
							}),
							" ",
							"Active (Display on website)"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnPrimary, {
					disabled: busy || uploading,
					onClick: async () => {
						if (!f.title || !f.short_description || !f.detail_title || !f.cta_text) {
							toast.error("Please fill out all required fields");
							return;
						}
						setBusy(true);
						try {
							await saveFn({ data: {
								id: f.id,
								title: f.title,
								short_description: f.short_description,
								image_key: f.image_key || null,
								image_url: f.image_url || null,
								icon_name: f.icon_name || "Store",
								detail_title: f.detail_title,
								subtitle: f.subtitle || "",
								full_description: f.full_description || "",
								key_points: (f.key_points || []).filter((p) => p.trim() !== ""),
								cta_text: f.cta_text,
								cta_message: f.cta_message || "",
								is_active: !!f.is_active,
								sort_order: Number(f.sort_order ?? 0)
							} });
							toast.success("Supply Service Card saved successfully!");
							await onSaved();
						} catch (e) {
							toast.error(e.message);
						} finally {
							setBusy(false);
						}
					},
					children: busy ? "SAVING…" : "SAVE CARD"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnGhost, {
					onClick: onCancel,
					children: "CANCEL"
				})]
			})
		]
	})] });
}
//#endregion
export { WhoWeSupplyPage as component };
