import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { A as RefreshCcw, Gt as Check, i as X, p as Trash2, v as Star } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as supabase } from "./client-CiOF68Zx.mjs";
import { t as useServerFn } from "./useServerFn-BqzygRuj.mjs";
import { a as PageHeader, r as Card, t as BtnGhost } from "./ui-Cij6S7ah.mjs";
import { a as listAdminReviews, c as moderateReview, n as deleteReview } from "./admin-catalog.functions-Bf3hxAUH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.reviews-DmfOD1M5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUSES = [
	"all",
	"pending",
	"approved",
	"rejected"
];
function ReviewsPage() {
	const list = useServerFn(listAdminReviews);
	const moderate = useServerFn(moderateReview);
	const del = useServerFn(deleteReview);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [status, setStatus] = (0, import_react.useState)("pending");
	async function load() {
		setLoading(true);
		try {
			const r = await list({ data: { status } });
			setRows(r.rows);
		} catch (e) {
			toast.error(e.message);
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		load();
	}, [status]);
	const toggleFeatured = async (id, current) => {
		try {
			const { error } = await supabase.from("reviews").update({ featured_on_homepage: !current }).eq("id", id);
			if (error) throw error;
			setRows((prev) => prev.map((r) => r.id === id ? {
				...r,
				featured_on_homepage: !current
			} : r));
			toast.success(current ? "Removed from homepage testimonials" : "Featured on homepage testimonials");
		} catch (e) {
			toast.error("Failed to update featured status");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Reviews",
			subtitle: "Moderate customer feedback",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnGhost, {
				onClick: load,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCcw, { className: "size-3.5" }), " REFRESH"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "p-4 mb-4 flex flex-wrap gap-2",
			children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setStatus(s),
				className: `px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase ${status === s ? "bg-forest-dark text-cream" : "bg-white text-forest-dark border border-border hover:border-gold-deep"}`,
				children: s
			}, s))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [
				loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center py-12 text-muted-foreground",
					children: "Loading…"
				}),
				!loading && rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center py-12 text-muted-foreground",
					children: "No reviews."
				}),
				!loading && rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "p-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-start gap-4 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 mb-1 flex-wrap",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-bold tracking-wider uppercase bg-gold/20 text-gold-deep rounded px-2 py-0.5",
											children: r.product_slug
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `text-[10px] font-bold tracking-wider uppercase rounded px-2 py-0.5 ${r.status === "approved" ? "bg-forest text-cream" : r.status === "rejected" ? "bg-destructive/15 text-destructive" : "bg-cream text-forest-dark border border-border"}`,
											children: r.status
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: new Date(r.created_at).toLocaleString()
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-medium text-forest-dark",
									children: [
										r.author_name ?? "Anonymous",
										" — ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-gold-deep",
											children: ["★".repeat(r.rating), "☆".repeat(5 - r.rating)]
										})
									]
								}),
								r.title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 font-serif text-lg text-forest-dark",
									children: r.title
								}),
								r.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground whitespace-pre-wrap",
									children: r.body
								}),
								r.media_urls && r.media_urls.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 flex gap-2 flex-wrap",
									children: r.media_urls.map((u, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: u,
										target: "_blank",
										rel: "noreferrer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: u,
											alt: "",
											className: "size-16 rounded-lg object-cover border border-border"
										})
									}, i))
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2 shrink-0",
							children: [
								r.status !== "approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: async () => {
										try {
											await moderate({ data: {
												id: r.id,
												status: "approved"
											} });
											toast.success("Approved");
											load();
										} catch (e) {
											toast.error(e.message);
										}
									},
									className: "inline-flex items-center gap-1 bg-forest text-cream rounded-lg px-3 py-1.5 text-[11px] font-bold tracking-widest hover:bg-forest-dark",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }), " APPROVE"]
								}),
								r.status !== "rejected" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: async () => {
										try {
											await moderate({ data: {
												id: r.id,
												status: "rejected"
											} });
											toast.success("Rejected");
											load();
										} catch (e) {
											toast.error(e.message);
										}
									},
									className: "inline-flex items-center gap-1 border border-border rounded-lg px-3 py-1.5 text-[11px] font-bold tracking-widest hover:border-destructive hover:text-destructive",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" }), " REJECT"]
								}),
								r.status === "approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => toggleFeatured(r.id, !!r.featured_on_homepage),
									className: `inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-bold tracking-widest transition-colors ${r.featured_on_homepage ? "bg-gold/20 text-gold-deep border border-gold-deep hover:bg-gold/30" : "border border-border hover:border-gold-deep hover:text-gold-deep"}`,
									title: r.featured_on_homepage ? "Remove from homepage testimonials" : "Feature on homepage testimonials",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `size-3.5 ${r.featured_on_homepage ? "fill-gold-deep" : ""}` }), r.featured_on_homepage ? "FEATURED" : "FEATURE"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
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
									className: "inline-flex items-center gap-1 text-destructive text-[11px] font-bold tracking-widest hover:underline",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), " DELETE"]
								})
							]
						})]
					})
				}, r.id))
			]
		})
	] });
}
//#endregion
export { ReviewsPage as component };
