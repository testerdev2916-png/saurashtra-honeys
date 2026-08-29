import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as supabase } from "./client-CiOF68Zx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.redirects-GzOx28ye.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [form, setForm] = (0, import_react.useState)({
		from_path: "",
		to_path: "",
		code: 301,
		note: ""
	});
	async function load() {
		const { data } = await supabase.from("redirects").select("*").order("created_at", { ascending: false });
		setRows(data ?? []);
		setLoading(false);
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	async function add() {
		if (!form.from_path.startsWith("/") || !form.to_path) return toast.error("Paths must start with /");
		const { error } = await supabase.from("redirects").insert({ ...form });
		if (error) return toast.error(error.message);
		setForm({
			from_path: "",
			to_path: "",
			code: 301,
			note: ""
		});
		toast.success("Redirect added");
		load();
	}
	async function toggle(r) {
		await supabase.from("redirects").update({ active: !r.active }).eq("id", r.id);
		load();
	}
	async function del(r) {
		if (!confirm("Delete?")) return;
		await supabase.from("redirects").delete().eq("id", r.id);
		load();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-5xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-2xl text-forest-dark",
				children: "Redirects"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "301/302 URL redirects. Handy for broken links, migrations, campaign short links."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-border rounded-xl p-4 grid gap-3 md:grid-cols-[1fr_1fr_120px_1fr_auto]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						placeholder: "/from-path",
						value: form.from_path,
						onChange: (e) => setForm({
							...form,
							from_path: e.target.value
						}),
						className: "w-full border border-border rounded p-2 text-sm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						placeholder: "/to-path",
						value: form.to_path,
						onChange: (e) => setForm({
							...form,
							to_path: e.target.value
						}),
						className: "w-full border border-border rounded p-2 text-sm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: form.code,
						onChange: (e) => setForm({
							...form,
							code: Number(e.target.value)
						}),
						className: "w-full border border-border rounded p-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: 301,
								children: "301"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: 302,
								children: "302"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: 307,
								children: "307"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: 308,
								children: "308"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						placeholder: "Note (optional)",
						value: form.note,
						onChange: (e) => setForm({
							...form,
							note: e.target.value
						}),
						className: "w-full border border-border rounded p-2 text-sm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: add,
						className: "bg-forest-dark text-cream rounded px-4 text-xs font-bold tracking-widest",
						children: "ADD"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white border border-border rounded-xl overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-cream/60 text-left text-xs uppercase tracking-wider text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "From"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "To" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Code" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Hits" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Active" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 6,
						className: "p-6 text-center text-muted-foreground",
						children: "Loading…"
					}) }) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 6,
						className: "p-6 text-center text-muted-foreground",
						children: "No redirects yet."
					}) }) : rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 font-mono",
								children: r.from_path
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "font-mono",
								children: r.to_path
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: r.code }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: r.hits }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => toggle(r),
								className: `text-xs font-bold ${r.active ? "text-emerald-600" : "text-muted-foreground"}`,
								children: r.active ? "ON" : "OFF"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "pr-3 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => del(r),
									className: "text-xs text-red-600 hover:underline",
									children: "Delete"
								})
							})
						]
					}, r.id)) })]
				})
			})
		]
	});
}
//#endregion
export { Page as component };
