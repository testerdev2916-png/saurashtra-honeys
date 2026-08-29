import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { A as RefreshCcw, L as Pencil, N as Plus, an as ArrowLeft, ft as ImageOff, l as Upload, p as Trash2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useServerFn } from "./useServerFn-BqzygRuj.mjs";
import { C as uploadCategoryImage, E as upsertCategory, n as deleteCategory, u as listCategories } from "./admin-cms.functions-jTsNSh7F.mjs";
import { a as PageHeader, c as Td, d as inp, i as Field, l as Th, n as BtnPrimary, o as StatusPill, r as Card, s as TableWrap, t as BtnGhost } from "./ui-Cij6S7ah.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.categories-MCRVp1v9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMPTY = {
	slug: "",
	name: "",
	description: "",
	image_url: "",
	parent_id: null,
	sort_order: 0,
	active: true,
	seo_title: "",
	seo_description: ""
};
function CategoriesPage() {
	const list = useServerFn(listCategories);
	useServerFn(upsertCategory);
	const del = useServerFn(deleteCategory);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [edit, setEdit] = (0, import_react.useState)(null);
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
	if (edit) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editor, {
		initial: edit,
		parents: rows,
		onCancel: () => setEdit(null),
		onSaved: async () => {
			setEdit(null);
			await load();
		}
	});
	const virtualRows = rows.filter((r) => r.slug === "all-products");
	const productRows = rows.filter((r) => r.slug !== "all-products");
	const renderTable = (data, emptyText) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
		"Sort",
		"Image",
		"Slug",
		"Name",
		"Parent",
		"Status",
		""
	].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: h }, h)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
		className: "divide-y divide-border",
		children: [
			loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "text-center py-12 text-muted-foreground",
				children: "Loading…"
			}) }),
			!loading && data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "text-center py-12 text-muted-foreground",
				children: emptyText
			}) }),
			!loading && data.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "hover:bg-cream/40",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "text-xs text-muted-foreground",
						children: r.sort_order
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "size-11 rounded-lg overflow-hidden bg-cream border border-border grid place-items-center shrink-0",
						children: r.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: r.image_url,
							alt: r.name,
							className: "w-full h-full object-cover",
							loading: "lazy"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageOff, { className: "size-4 text-muted-foreground/50" })
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "text-xs font-mono",
						children: r.slug
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "font-medium text-forest-dark",
						children: r.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "text-xs",
						children: rows.find((x) => x.id === r.parent_id)?.name ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { s: r.active ? "active" : "disabled" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setEdit(r),
							className: "text-gold-deep hover:underline text-xs font-bold mr-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5 inline" }), " EDIT"]
						}), r.slug !== "all-products" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: async () => {
								if (!confirm("Delete?")) return;
								try {
									await del({ data: { id: r.id } });
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
			}, r.id))
		]
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Categories",
			subtitle: `${rows.length} categories`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnGhost, {
				onClick: load,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCcw, { className: "size-3.5" }), " REFRESH"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnPrimary, {
				onClick: () => setEdit(EMPTY),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), " NEW CATEGORY"]
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-serif text-xl text-forest-dark mb-4",
					children: "Virtual Collections"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mb-4",
					children: "Special collections that span across multiple product types."
				}),
				renderTable(virtualRows, "No virtual collections.")
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-serif text-xl text-forest-dark mb-4",
				children: "Product Categories"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mb-4",
				children: "Database categories used to tag and filter actual products."
			}),
			renderTable(productRows, "No product categories yet.")
		] })
	] });
}
function Editor({ initial, parents, onCancel, onSaved }) {
	const [f, setF] = (0, import_react.useState)({ ...initial });
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const save = useServerFn(upsertCategory);
	const upload = useServerFn(uploadCategoryImage);
	const fileRef = (0, import_react.useRef)(null);
	async function onFile(file) {
		if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
		if (file.size > 10 * 1024 * 1024) return toast.error("Image too large (max 10MB)");
		setUploading(true);
		try {
			const b64 = await new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(String(reader.result).split(",")[1]);
				reader.onerror = () => reject(/* @__PURE__ */ new Error("Could not read file"));
				reader.readAsDataURL(file);
			});
			const { url } = await upload({ data: {
				filename: file.name,
				contentType: file.type,
				base64: b64
			} });
			if (url) {
				setF((prev) => ({
					...prev,
					image_url: url
				}));
				toast.success("Image uploaded");
			}
		} catch (e) {
			toast.error(e.message);
		} finally {
			setUploading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: onCancel,
		className: "inline-flex items-center gap-1 text-xs font-bold text-forest-dark mb-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " BACK"]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-6 max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl text-forest-dark mb-4",
				children: f.id ? "Edit category" : "New category"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
							className: inp
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
							className: inp
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Parent",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: f.parent_id ?? "",
							onChange: (e) => setF({
								...f,
								parent_id: e.target.value || null
							}),
							className: inp,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "— top-level —"
							}), parents.filter((p) => p.id !== f.id).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: p.id,
								children: p.name
							}, p.id))]
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
							className: inp
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Category image",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-24 rounded-xl overflow-hidden bg-cream border border-border grid place-items-center shrink-0",
									children: f.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: f.image_url,
										alt: f.name || "Category preview",
										className: "w-full h-full object-cover"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageOff, { className: "size-6 text-muted-foreground/50" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											ref: fileRef,
											type: "file",
											accept: "image/*",
											className: "hidden",
											onChange: (e) => {
												const file = e.target.files?.[0];
												if (file) onFile(file);
												e.target.value = "";
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnGhost, {
												type: "button",
												disabled: uploading,
												onClick: () => fileRef.current?.click(),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5" }),
													" ",
													uploading ? "UPLOADING…" : f.image_url ? "REPLACE IMAGE" : "UPLOAD IMAGE"
												]
											}), f.image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnGhost, {
												type: "button",
												onClick: () => setF({
													...f,
													image_url: ""
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), " REMOVE"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: f.image_url ?? "",
											onChange: (e) => setF({
												...f,
												image_url: e.target.value
											}),
											className: inp,
											placeholder: "Or paste an image URL…"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground",
											children: "This image appears on the storefront's \"Shop by Category\" section. JPG/PNG/WebP, ideally a square or 4:5 crop, under 10MB."
										})
									]
								})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Description",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 3,
								value: f.description ?? "",
								onChange: (e) => setF({
									...f,
									description: e.target.value
								}),
								className: inp
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "SEO title",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.seo_title ?? "",
							onChange: (e) => setF({
								...f,
								seo_title: e.target.value
							}),
							className: inp
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "SEO description",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.seo_description ?? "",
							onChange: (e) => setF({
								...f,
								seo_description: e.target.value
							}),
							className: inp
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-xs md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: !!f.active,
							onChange: (e) => setF({
								...f,
								active: e.target.checked
							})
						}), " Active"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnPrimary, {
					disabled: busy,
					onClick: async () => {
						setBusy(true);
						try {
							await save({ data: {
								id: f.id,
								slug: f.slug,
								name: f.name,
								description: f.description ?? null,
								image_url: f.image_url || null,
								parent_id: f.parent_id ?? null,
								sort_order: Number(f.sort_order ?? 0),
								active: !!f.active,
								seo_title: f.seo_title || null,
								seo_description: f.seo_description || null
							} });
							toast.success("Saved");
							await onSaved();
						} catch (e) {
							toast.error(e.message);
						} finally {
							setBusy(false);
						}
					},
					children: busy ? "SAVING…" : "SAVE"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnGhost, {
					onClick: onCancel,
					children: "CANCEL"
				})]
			})
		]
	})] });
}
//#endregion
export { CategoriesPage as component };
