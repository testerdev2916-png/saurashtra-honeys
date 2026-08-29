import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { A as RefreshCcw, D as Search, Nt as Copy, l as Upload, p as Trash2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useServerFn } from "./useServerFn-BqzygRuj.mjs";
import { a as deleteMedia, m as listMedia, w as uploadMedia } from "./admin-cms.functions-jTsNSh7F.mjs";
import { a as PageHeader, n as BtnPrimary, r as Card, t as BtnGhost } from "./ui-Cij6S7ah.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.media-Cl25pqN0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BUCKETS = ["product-images", "media"];
var MEDIA_FOLDERS = [
	"logos",
	"hero",
	"banners",
	"blog",
	"avatars",
	"documents",
	"general"
];
function MediaPage() {
	const list = useServerFn(listMedia);
	const del = useServerFn(deleteMedia);
	const up = useServerFn(uploadMedia);
	const [bucket, setBucket] = (0, import_react.useState)("");
	const [q, setQ] = (0, import_react.useState)("");
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [uploadBucket, setUploadBucket] = (0, import_react.useState)("product-images");
	const [uploadFolder, setUploadFolder] = (0, import_react.useState)("general");
	const fileRef = (0, import_react.useRef)(null);
	async function load() {
		setLoading(true);
		try {
			const r = await list({ data: {
				bucket: bucket || void 0,
				q: q || void 0
			} });
			setRows(r.rows);
		} catch (e) {
			toast.error(e.message);
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		load();
	}, [bucket]);
	async function onFile(f) {
		if (f.size > 20 * 1024 * 1024) return toast.error("File too large (max 20MB)");
		const reader = new FileReader();
		reader.onload = async () => {
			const b64 = String(reader.result).split(",")[1];
			try {
				await up({ data: {
					bucket: uploadBucket,
					folder: uploadBucket === "media" ? uploadFolder : void 0,
					filename: f.name,
					contentType: f.type || "application/octet-stream",
					base64: b64
				} });
				toast.success("Uploaded");
				load();
			} catch (e) {
				toast.error(e.message);
			}
		};
		reader.readAsDataURL(f);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Media Library",
			subtitle: `${rows.length} files`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: uploadBucket,
					onChange: (e) => setUploadBucket(e.target.value),
					className: "w-full border border-border rounded-lg px-3 py-2 text-xs bg-white",
					children: BUCKETS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: b,
						children: ["Upload → ", b]
					}, b))
				}),
				uploadBucket === "media" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: uploadFolder,
					onChange: (e) => setUploadFolder(e.target.value),
					className: "w-full border border-border rounded-lg px-3 py-2 text-xs bg-white",
					children: MEDIA_FOLDERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: f,
						children: [
							"media/",
							f,
							"/"
						]
					}, f))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: fileRef,
					type: "file",
					className: "hidden",
					onChange: (e) => {
						const f = e.target.files?.[0];
						if (f) onFile(f);
						e.target.value = "";
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnPrimary, {
					onClick: () => fileRef.current?.click(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5" }), " UPLOAD"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnGhost, {
					onClick: load,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCcw, { className: "size-3.5" }), " REFRESH"]
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-4 mb-4 flex flex-wrap items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: bucket,
					onChange: (e) => setBucket(e.target.value),
					className: "w-full border border-border rounded-lg px-3 py-2 text-xs bg-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "All buckets"
					}), BUCKETS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: b,
						children: b
					}, b))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 min-w-[240px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (e) => setQ(e.target.value),
						onKeyDown: (e) => {
							if (e.key === "Enter") load();
						},
						placeholder: "Search filename…",
						className: "w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-white text-xs focus:outline-none focus:border-gold-deep"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnPrimary, {
					onClick: load,
					children: "APPLY"
				})
			]
		}),
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "py-12 text-center text-muted-foreground",
			children: "Loading…"
		}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "py-12 text-center text-muted-foreground",
			children: "No files."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
			children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "aspect-square bg-cream rounded-lg overflow-hidden flex items-center justify-center",
					children: r.url && r.mime_type?.startsWith("image/") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: r.url,
						alt: r.alt_text ?? r.filename,
						className: "w-full h-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground p-2 text-center break-all",
						children: r.filename
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-2 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono truncate",
							title: r.filename,
							children: r.filename
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-muted-foreground text-[10px] mt-0.5",
							children: [
								r.bucket,
								" • ",
								r.size_bytes ? `${Math.round(r.size_bytes / 1024)}KB` : ""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between mt-2 gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									if (r.url) {
										navigator.clipboard.writeText(r.url);
										toast.success("URL copied");
									}
								},
								className: "flex-1 text-[10px] font-bold bg-cream hover:bg-cream/60 rounded py-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3 inline" }), " URL"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
								className: "text-destructive text-[10px] font-bold px-2 py-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3 inline" })
							})]
						})
					]
				})]
			}, r.id))
		})
	] });
}
//#endregion
export { MediaPage as component };
