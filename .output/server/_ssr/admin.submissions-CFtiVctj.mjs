import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { A as RefreshCcw, D as Search, an as ArrowLeft, jt as Download } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useServerFn } from "./useServerFn-BqzygRuj.mjs";
import { a as updateSubmission, i as listSubmissions, n as getSubmission } from "./admin.functions-mQMezj7y.mjs";
import { a as PageHeader, c as Td, d as inp, i as Field, l as Th, n as BtnPrimary, o as StatusPill, r as Card, s as TableWrap, t as BtnGhost, u as csvDownload } from "./ui-Cij6S7ah.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.submissions-CFtiVctj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TYPES = [
	"all",
	"bulk_order",
	"partner",
	"contact",
	"newsletter"
];
var STATUSES = [
	"all",
	"new",
	"in_progress",
	"completed",
	"archived"
];
function SubmissionsPage() {
	const list = useServerFn(listSubmissions);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [type, setType] = (0, import_react.useState)("all");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [q, setQ] = (0, import_react.useState)("");
	const [from, setFrom] = (0, import_react.useState)("");
	const [to, setTo] = (0, import_react.useState)("");
	const [current, setCurrent] = (0, import_react.useState)(null);
	async function load() {
		setLoading(true);
		try {
			const r = await list({ data: {
				form_type: type,
				status,
				q,
				from: from || void 0,
				to: to ? (/* @__PURE__ */ new Date(to + "T23:59:59")).toISOString() : void 0
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
	}, []);
	const counts = (0, import_react.useMemo)(() => {
		const c = { all: rows.length };
		for (const r of rows) c[r.form_type] = (c[r.form_type] ?? 0) + 1;
		return c;
	}, [rows]);
	const cols = [
		"created_at",
		"form_type",
		"status",
		"name",
		"email",
		"phone",
		"city",
		"subject",
		"message"
	];
	if (current) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
		row: current,
		onClose: () => {
			setCurrent(null);
			load();
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Form Submissions",
			subtitle: `${rows.length} entries`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnGhost, {
				onClick: () => csvDownload(rows, cols, `submissions-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), " CSV"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnPrimary, {
				onClick: load,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCcw, { className: "size-3.5" }), " REFRESH"]
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-4 mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5 mb-3",
				children: TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setType(t),
					className: `px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase ${type === t ? "bg-forest-dark text-cream" : "bg-white text-forest-dark border border-border hover:border-gold-deep"}`,
					children: [
						t.replace("_", " "),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "opacity-70 ml-1",
							children: [
								"(",
								counts[t] ?? 0,
								")"
							]
						})
					]
				}, t))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2 items-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: status,
						onChange: (e) => setStatus(e.target.value),
						className: "w-full border border-border rounded-lg px-3 py-2 text-xs bg-white",
						children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: s,
							children: ["Status: ", s]
						}, s))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: from,
						onChange: (e) => setFrom(e.target.value),
						className: "w-full border border-border rounded-lg px-3 py-2 text-xs bg-white"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "to"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: to,
						onChange: (e) => setTo(e.target.value),
						className: "w-full border border-border rounded-lg px-3 py-2 text-xs bg-white"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1 min-w-[220px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: q,
							onChange: (e) => setQ(e.target.value),
							onKeyDown: (e) => {
								if (e.key === "Enter") load();
							},
							placeholder: "Search…",
							className: "w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-white text-xs focus:outline-none focus:border-gold-deep"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnPrimary, {
						onClick: load,
						children: "APPLY"
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
			"Date",
			"Type",
			"Status",
			"Name",
			"Contact",
			"Details",
			""
		].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: h }, h)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
			className: "divide-y divide-border",
			children: [
				loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "text-center py-12 text-muted-foreground",
					children: "Loading…"
				}) }),
				!loading && rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "text-center py-12 text-muted-foreground",
					children: "No submissions."
				}) }),
				!loading && rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "hover:bg-cream/40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "text-xs text-muted-foreground whitespace-nowrap",
							children: new Date(r.created_at).toLocaleString()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-bold tracking-wider uppercase bg-gold/20 text-gold-deep rounded px-2 py-1",
							children: r.form_type.replace("_", " ")
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { s: r.status }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, {
							className: "font-medium text-forest-dark",
							children: [r.name ?? "—", r.company && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: r.company
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, {
							className: "text-xs",
							children: [r.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: r.email }), r.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: r.phone })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "text-xs max-w-sm truncate",
							children: r.subject || r.product_interest || r.message?.slice(0, 60) || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setCurrent(r),
								className: "text-xs font-bold text-gold-deep hover:underline",
								children: "OPEN →"
							})
						})
					]
				}, r.id))
			]
		})] })
	] });
}
function Detail({ row, onClose }) {
	const upd = useServerFn(updateSubmission);
	const get = useServerFn(getSubmission);
	const [status, setStatus] = (0, import_react.useState)(row.status);
	const [notes, setNotes] = (0, import_react.useState)(row.admin_notes ?? "");
	const [full, setFull] = (0, import_react.useState)(row);
	(0, import_react.useEffect)(() => {
		get({ data: { id: row.id } }).then((r) => setFull(r.row)).catch(() => {});
	}, [row.id, get]);
	async function save() {
		try {
			await upd({ data: {
				id: row.id,
				status,
				admin_notes: notes
			} });
			toast.success("Saved");
			onClose();
		} catch (e) {
			toast.error(e.message);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: onClose,
		className: "inline-flex items-center gap-1 text-xs font-bold text-forest-dark mb-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " BACK"]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid lg:grid-cols-[1.4fr_1fr] gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-bold tracking-widest text-gold-deep",
					children: full.form_type.replace("_", " ").toUpperCase()
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-serif text-2xl text-forest-dark",
					children: full.name || full.email || "Submission"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground",
					children: new Date(full.created_at).toLocaleString()
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm",
					children: [
						["Name", full.name],
						["Email", full.email],
						["Phone", full.phone],
						["Company", full.company],
						["City", full.city],
						["Subject", full.subject],
						["Product", full.product_interest],
						["Quantity", full.quantity]
					].map(([k, v]) => v ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs text-muted-foreground",
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-medium text-forest-dark",
						children: v
					})] }, k) : null)
				}),
				full.message && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "Message"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm whitespace-pre-wrap",
						children: full.message
					})]
				}),
				full.meta && Object.keys(full.meta).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "mt-4 text-xs bg-cream rounded p-3 overflow-auto",
					children: JSON.stringify(full.meta, null, 2)
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "bg-cream rounded-2xl p-6 h-fit",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-serif text-xl text-forest-dark",
					children: "Manage"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Status",
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: status,
						onChange: (e) => setStatus(e.target.value),
						className: inp,
						children: STATUSES.filter((s) => s !== "all").map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s,
							children: s
						}, s))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Admin notes",
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 6,
						value: notes,
						onChange: (e) => setNotes(e.target.value),
						className: inp
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnPrimary, {
					onClick: save,
					className: "mt-4 w-full justify-center",
					children: "SAVE"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-2 text-xs",
					children: [
						full.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: `mailto:${full.email}`,
							className: "text-gold-deep hover:underline",
							children: ["✉ ", full.email]
						}),
						full.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: `tel:${full.phone}`,
							className: "text-gold-deep hover:underline",
							children: ["📞 ", full.phone]
						}),
						full.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `https://wa.me/${full.phone.replace(/[^0-9]/g, "")}`,
							className: "text-gold-deep hover:underline",
							children: "💬 WhatsApp"
						})
					]
				})
			]
		})]
	})] });
}
//#endregion
export { SubmissionsPage as component };
