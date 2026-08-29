import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { A as RefreshCcw, L as Pencil, N as Plus, Qt as Bold, _t as Heading3, an as ArrowLeft, b as Sparkles, et as List, j as Quote, l as Upload, nt as Link, p as Trash2, st as Italic, ut as Image, v as Star, vt as Heading2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as supabase } from "./client-CiOF68Zx.mjs";
import { t as useServerFn } from "./useServerFn-BqzygRuj.mjs";
import { h as listPosts, k as upsertPost, o as deletePost } from "./admin-cms.functions-jTsNSh7F.mjs";
import { a as PageHeader, c as Td, d as inp, i as Field, l as Th, n as BtnPrimary, o as StatusPill, r as Card, s as TableWrap, t as BtnGhost } from "./ui-Cij6S7ah.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.blog-Ba78pU7q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIES = [
	"Honey & Health",
	"Ayurveda & Remedies",
	"Beekeeping Stories",
	"Recipes & Pairings",
	"Sustainability"
];
var EMPTY = {
	slug: "",
	title: "",
	excerpt: "",
	body_markdown: "",
	cover_image_url: "",
	category_name: "Honey & Health",
	author_name: "Saurashtra Honey Editorial Team",
	reading_time: "5 min read",
	is_featured: false,
	is_popular: false,
	tags: [],
	status: "draft"
};
function BlogPage() {
	const list = useServerFn(listPosts);
	const del = useServerFn(deletePost);
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
		onCancel: () => setEdit(null),
		onSaved: async () => {
			setEdit(null);
			await load();
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Journal Management",
		subtitle: `${rows.length} total articles across D2C Journal`,
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnGhost, {
			onClick: load,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCcw, { className: "size-3.5 mr-1" }), " REFRESH"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnPrimary, {
			onClick: () => setEdit(EMPTY),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5 mr-1" }), " NEW ARTICLE"]
		})] })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
		"Title",
		"Category",
		"Status",
		"Published",
		"Featured / Popular",
		"Updated",
		""
	].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: h }, h)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
		className: "divide-y divide-border",
		children: [
			loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "text-center py-12 text-muted-foreground",
				children: "Loading articles…"
			}) }),
			!loading && rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "text-center py-12 text-muted-foreground",
				children: "No journal articles found. Click \"New Article\" to create one."
			}) }),
			!loading && rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "hover:bg-cream/40",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, {
						className: "font-medium text-forest-dark max-w-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-serif font-bold text-sm leading-snug",
							children: r.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] text-muted-foreground font-mono mt-0.5",
							children: r.slug
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-block bg-cream-deep text-espresso text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border border-border/80",
						children: r.category_name || "Uncategorized"
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { s: r.status }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "text-xs",
						children: r.published_at ? new Date(r.published_at).toLocaleDateString() : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							r.is_featured && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 bg-gold-deep/15 text-gold-deep text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-gold-deep/30",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3" }), " FEATURED"]
							}),
							r.is_popular && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 bg-burnt-orange/15 text-burnt-orange text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-burnt-orange/30",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3" }), " POPULAR"]
							}),
							!r.is_featured && !r.is_popular && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-xs",
								children: "—"
							})
						]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "text-xs text-muted-foreground",
						children: new Date(r.updated_at).toLocaleDateString()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setEdit(r),
							className: "text-gold-deep hover:underline text-xs font-bold mr-4 inline-flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5 inline" }), " EDIT"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: async () => {
								if (!confirm("Delete article? This cannot be undone.")) return;
								try {
									await del({ data: { id: r.id } });
									toast.success("Article deleted");
									load();
								} catch (e) {
									toast.error(e.message);
								}
							},
							className: "text-destructive hover:underline text-xs font-bold inline-flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5 inline" }), " DELETE"]
						})]
					})
				]
			}, r.id))
		]
	})] })] });
}
function Editor({ initial, onCancel, onSaved }) {
	const [f, setF] = (0, import_react.useState)({
		...initial,
		tags: initial.tags ?? [],
		category_name: initial.category_name || "Honey & Health",
		author_name: initial.author_name || "Saurashtra Honey Editorial Team",
		reading_time: initial.reading_time || "5 min read",
		is_featured: initial.is_featured || false,
		is_popular: initial.is_popular || false
	});
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const save = useServerFn(upsertPost);
	function insertMarkdown(syntax) {
		const current = f.body_markdown ?? "";
		setF({
			...f,
			body_markdown: current ? `${current}\n\n${syntax}` : syntax
		});
	}
	async function handleImageUpload(file) {
		if (!file.type.startsWith("image/")) {
			toast.error("Please choose a valid image file (JPG, PNG, WebP)");
			return;
		}
		setUploading(true);
		try {
			const safeName = file.name.replace(/[^\w.\-]+/g, "_");
			const path = `blog/covers/${Date.now()}_${safeName}`;
			const { data, error } = await supabase.storage.from("media").upload(path, file, {
				contentType: file.type,
				cacheControl: "3600",
				upsert: true
			});
			if (error) throw new Error(error.message);
			const { data: pubData } = supabase.storage.from("media").getPublicUrl(data.path);
			setF((prev) => ({
				...prev,
				cover_image_url: pubData.publicUrl
			}));
			toast.success("Featured image uploaded successfully");
		} catch (e) {
			toast.error(e.message);
		} finally {
			setUploading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: onCancel,
		className: "inline-flex items-center gap-1.5 text-xs font-bold text-forest-dark mb-4 hover:text-burnt-orange transition-colors",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " BACK TO ARTICLES"]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl text-forest-dark mb-4",
				children: f.id ? "Edit Journal Article" : "New Journal Article"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid md:grid-cols-2 gap-4 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Title *",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.title ?? "",
							onChange: (e) => {
								const val = e.target.value;
								const nextSlug = f.id ? f.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
								setF({
									...f,
									title: val,
									slug: nextSlug || f.slug
								});
							},
							className: inp,
							placeholder: "e.g. 7 Health Benefits of Raw Honey"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Slug (URL Path) *",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.slug ?? "",
							onChange: (e) => setF({
								...f,
								slug: e.target.value
							}),
							className: inp,
							placeholder: "7-health-benefits-of-raw-honey"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Category *",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: f.category_name || "Honey & Health",
							onChange: (e) => setF({
								...f,
								category_name: e.target.value
							}),
							className: inp,
							children: CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: cat,
								children: cat
							}, cat))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Author Name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.author_name || "",
							onChange: (e) => setF({
								...f,
								author_name: e.target.value
							}),
							className: inp,
							placeholder: "Saurashtra Honey Editorial Team"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Reading Time",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.reading_time || "",
							onChange: (e) => setF({
								...f,
								reading_time: e.target.value
							}),
							className: inp,
							placeholder: "5 min read"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Status *",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: f.status ?? "draft",
							onChange: (e) => setF({
								...f,
								status: e.target.value
							}),
							className: inp,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "draft",
									children: "Draft (Hidden from customers)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "published",
									children: "Published (Publicly visible)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "archived",
									children: "Archived"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Publish Date (optional)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "datetime-local",
							value: f.published_at ? f.published_at.slice(0, 16) : "",
							onChange: (e) => setF({
								...f,
								published_at: e.target.value ? new Date(e.target.value).toISOString() : null
							}),
							className: inp
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-6 pt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-espresso",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: f.is_featured || false,
								onChange: (e) => setF({
									...f,
									is_featured: e.target.checked
								}),
								className: "size-4 rounded border-border text-burnt-orange focus:ring-burnt-orange"
							}), "Mark as Featured Article"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-espresso",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: f.is_popular || false,
								onChange: (e) => setF({
									...f,
									is_popular: e.target.checked
								}),
								className: "size-4 rounded border-border text-burnt-orange focus:ring-burnt-orange"
							}), "Mark as Popular Article"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Short Excerpt",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 2,
								value: f.excerpt ?? "",
								onChange: (e) => setF({
									...f,
									excerpt: e.target.value
								}),
								className: inp,
								placeholder: "A concise summary of the article for cards and meta descriptions..."
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Featured Image URL",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: f.cover_image_url ?? "",
									onChange: (e) => setF({
										...f,
										cover_image_url: e.target.value
									}),
									className: inp,
									placeholder: "https://..."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-cream-deep border border-border rounded-xl text-xs font-bold text-espresso hover:bg-cream transition-colors cursor-pointer",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5" }),
										uploading ? "UPLOADING..." : "UPLOAD",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "file",
											accept: "image/*",
											className: "hidden",
											disabled: uploading,
											onChange: (e) => {
												const file = e.target.files?.[0];
												if (file) handleImageUpload(file);
											}
										})
									]
								})]
							})
						})
					}),
					f.cover_image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-bold text-muted-foreground mb-1.5",
							children: "IMAGE PREVIEW"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: f.cover_image_url,
							alt: "Featured preview",
							className: "h-40 rounded-xl object-cover border border-border"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "SEO Title",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.seo_title ?? "",
							onChange: (e) => setF({
								...f,
								seo_title: e.target.value
							}),
							className: inp,
							placeholder: "SEO optimized title..."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "SEO Description",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.seo_description ?? "",
							onChange: (e) => setF({
								...f,
								seo_description: e.target.value
							}),
							className: inp,
							placeholder: "SEO meta description..."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-bold text-espresso",
								children: "Full Article Content (Markdown / Rich Formatting)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 bg-cream-deep p-1 rounded-lg border border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => insertMarkdown("## Heading 2"),
										title: "Heading 2",
										className: "p-1 hover:bg-cream rounded text-espresso text-xs font-bold",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading2, { className: "size-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => insertMarkdown("### Heading 3"),
										title: "Heading 3",
										className: "p-1 hover:bg-cream rounded text-espresso text-xs font-bold",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading3, { className: "size-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => insertMarkdown("**Bold Text**"),
										title: "Bold",
										className: "p-1 hover:bg-cream rounded text-espresso text-xs font-bold",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bold, { className: "size-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => insertMarkdown("*Italic Text*"),
										title: "Italic",
										className: "p-1 hover:bg-cream rounded text-espresso text-xs font-bold",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Italic, { className: "size-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => insertMarkdown("- List item 1\n- List item 2"),
										title: "List",
										className: "p-1 hover:bg-cream rounded text-espresso text-xs font-bold",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "size-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => insertMarkdown("> Blockquote quotation"),
										title: "Quote",
										className: "p-1 hover:bg-cream rounded text-espresso text-xs font-bold",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quote, { className: "size-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => insertMarkdown("[Link text](https://example.com)"),
										title: "Link",
										className: "p-1 hover:bg-cream rounded text-espresso text-xs font-bold",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, { className: "size-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => insertMarkdown("![Image description](https://example.com/image.jpg)"),
										title: "Image",
										className: "p-1 hover:bg-cream rounded text-espresso text-xs font-bold",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "size-3.5" })
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 14,
							value: f.body_markdown ?? "",
							onChange: (e) => setF({
								...f,
								body_markdown: e.target.value
							}),
							className: `${inp} font-mono text-xs`,
							placeholder: "Write your article content using Markdown formatting (headings, paragraphs, lists, bold, links, images)..."
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnPrimary, {
					disabled: busy,
					onClick: async () => {
						if (!f.title || !f.slug) {
							toast.error("Title and Slug are required.");
							return;
						}
						setBusy(true);
						try {
							await save({ data: {
								id: f.id,
								slug: f.slug,
								title: f.title,
								excerpt: f.excerpt ?? null,
								body_markdown: f.body_markdown ?? null,
								cover_image_url: f.cover_image_url ?? null,
								category_name: f.category_name ?? "Honey & Health",
								author_name: f.author_name ?? "Saurashtra Honey Editorial Team",
								reading_time: f.reading_time ?? "5 min read",
								is_featured: f.is_featured ?? false,
								is_popular: f.is_popular ?? false,
								seo_title: f.seo_title ?? null,
								seo_description: f.seo_description ?? null,
								tags: f.tags ?? [],
								status: f.status ?? "draft",
								published_at: f.status === "published" && !f.published_at ? (/* @__PURE__ */ new Date()).toISOString() : f.published_at ?? null
							} });
							toast.success("Journal article saved");
							await onSaved();
						} catch (e) {
							toast.error(e.message);
						} finally {
							setBusy(false);
						}
					},
					children: busy ? "SAVING…" : "SAVE ARTICLE"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnGhost, {
					onClick: onCancel,
					children: "CANCEL"
				})]
			})
		]
	})] });
}
//#endregion
export { BlogPage as component };
