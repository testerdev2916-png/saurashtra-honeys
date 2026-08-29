import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { A as RefreshCcw, D as Search, M as Printer, an as ArrowLeft, jt as Download } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useServerFn } from "./useServerFn-BqzygRuj.mjs";
import { r as listOrders } from "./admin.functions-mQMezj7y.mjs";
import { S as updateOrderExtended } from "./admin-cms.functions-jTsNSh7F.mjs";
import { a as PageHeader, c as Td, d as inp, f as paise, i as Field, l as Th, n as BtnPrimary, o as StatusPill, r as Card, s as TableWrap, t as BtnGhost, u as csvDownload } from "./ui-Cij6S7ah.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.orders-C-0YgeZQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUSES = [
	"all",
	"pending",
	"paid",
	"confirmed",
	"processing",
	"packed",
	"shipped",
	"delivered",
	"cancelled",
	"refunded"
];
function OrdersPage() {
	const list = useServerFn(listOrders);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [status, setStatus] = (0, import_react.useState)("all");
	const [q, setQ] = (0, import_react.useState)("");
	const [from, setFrom] = (0, import_react.useState)("");
	const [to, setTo] = (0, import_react.useState)("");
	const [current, setCurrent] = (0, import_react.useState)(null);
	async function load() {
		setLoading(true);
		try {
			const res = await list({ data: {
				status,
				q,
				from: from || void 0,
				to: to ? (/* @__PURE__ */ new Date(to + "T23:59:59")).toISOString() : void 0
			} });
			setRows(res.rows);
		} catch (e) {
			toast.error(e.message);
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	if (current) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderDetail, {
		order: current,
		onClose: () => {
			setCurrent(null);
			load();
		}
	});
	const cols = [
		"order_number",
		"created_at",
		"full_name",
		"email",
		"phone",
		"status",
		"payment_method",
		"total_paise"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Orders",
			subtitle: `${rows.length} orders`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnGhost, {
				onClick: () => csvDownload(rows, cols, `orders-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), " CSV"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnPrimary, {
				onClick: load,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCcw, { className: "size-3.5" }), " REFRESH"]
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-4 mb-4 flex flex-wrap gap-2 items-center",
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
						placeholder: "Search name, email, phone, order id…",
						className: "w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-white text-xs focus:outline-none focus:border-gold-deep"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnPrimary, {
					onClick: load,
					children: "APPLY"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
			"Order",
			"Date",
			"Customer",
			"Payment",
			"Status",
			"Total",
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
					children: "No orders."
				}) }),
				!loading && rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "hover:bg-cream/40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "font-mono text-xs",
							children: r.order_number ?? `#${r.id.slice(0, 8)}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "text-xs text-muted-foreground whitespace-nowrap",
							children: new Date(r.created_at).toLocaleString()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium text-forest-dark",
							children: r.full_name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: r.email
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "text-xs uppercase",
							children: r.payment_method
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { s: r.status }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "font-semibold",
							children: paise(r.total_paise)
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
function OrderDetail({ order, onClose }) {
	const upd = useServerFn(updateOrderExtended);
	const [status, setStatus] = (0, import_react.useState)(order.status);
	const [notes, setNotes] = (0, import_react.useState)(order.admin_notes ?? "");
	const [tn, setTn] = (0, import_react.useState)(order.tracking_number ?? "");
	const [carrier, setCarrier] = (0, import_react.useState)(order.shipping_carrier ?? "");
	const [refund, setRefund] = (0, import_react.useState)("");
	async function save() {
		try {
			await upd({ data: {
				id: order.id,
				status,
				admin_notes: notes,
				tracking_number: tn || void 0,
				shipping_carrier: carrier || void 0,
				refund_amount_paise: refund ? Number(refund) * 100 : void 0
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between items-start gap-3 flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-bold tracking-widest text-gold-deep",
							children: "ORDER"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-serif text-2xl text-forest-dark",
							children: order.order_number ?? `#${order.id.slice(0, 8)}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: new Date(order.created_at).toLocaleString()
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => window.print(),
						className: "inline-flex items-center gap-1 border border-border rounded-lg px-3 py-1.5 text-xs font-semibold hover:border-gold-deep",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-3.5" }), " PRINT INVOICE"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid sm:grid-cols-2 gap-6 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Customer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium text-forest-dark",
							children: order.full_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: order.email }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: order.phone })
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Shipping"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [order.shipping.line1, order.shipping.line2 ? `, ${order.shipping.line2}` : ""] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							order.shipping.city,
							", ",
							order.shipping.state,
							" — ",
							order.shipping.pincode
						] })
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground mb-2",
						children: "Items"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
						className: "w-full text-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border",
							children: order.items.map((i, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-2",
									children: [
										i.name,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: [
												"(",
												i.size,
												")"
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-2 text-right",
									children: ["× ", i.qty]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-2 text-right font-medium",
									children: ["₹", i.price * i.qty]
								})
							] }, idx))
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 text-sm space-y-1 max-w-xs ml-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: paise(order.subtotal_paise) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Shipping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: paise(order.shipping_paise) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between font-serif text-lg pt-2 border-t border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: paise(order.total_paise) })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 text-xs text-muted-foreground",
					children: [
						"Payment: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "uppercase font-semibold",
							children: order.payment_method
						}),
						order.razorpay_payment_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" • Razorpay: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono",
							children: order.razorpay_payment_id
						})] })
					]
				}),
				order.timeline && order.timeline.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground mb-2",
						children: "Timeline"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1 text-xs",
						children: order.timeline.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono",
								children: new Date(t.at).toLocaleString()
							}),
							" — ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { s: t.status }),
							" ",
							t.note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: ["— ", t.note]
							})
						] }, i))
					})]
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
					label: "Shipping carrier",
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: carrier,
						onChange: (e) => setCarrier(e.target.value),
						className: inp,
						placeholder: "Delhivery / BlueDart / …"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Tracking number",
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: tn,
						onChange: (e) => setTn(e.target.value),
						className: inp
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Refund amount (₹)",
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						value: refund,
						onChange: (e) => setRefund(e.target.value),
						className: inp
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Admin notes",
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 5,
						value: notes,
						onChange: (e) => setNotes(e.target.value),
						className: inp
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnPrimary, {
					onClick: save,
					className: "mt-4 w-full justify-center",
					children: "SAVE"
				})
			]
		})]
	})] });
}
//#endregion
export { OrdersPage as component };
