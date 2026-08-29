import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { D as Search, Pt as Clock, V as Package, Y as MapPin, u as Truck, zt as CircleCheck } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useServerFn } from "./useServerFn-BqzygRuj.mjs";
import { n as SiteLayout, t as SectionEyebrow } from "./Layout-BROfU7ZF.mjs";
import { t as trackOrderFn } from "./coupons.functions-B1UWeC6d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/track-order-CLnVFm76.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_STEPS = [
	{
		key: "pending",
		label: "Order placed",
		icon: Clock
	},
	{
		key: "processing",
		label: "Processing",
		icon: Package
	},
	{
		key: "packed",
		label: "Packed",
		icon: Package
	},
	{
		key: "shipped",
		label: "Shipped",
		icon: Truck
	},
	{
		key: "delivered",
		label: "Delivered",
		icon: CircleCheck
	}
];
function stepIndex(status) {
	const order = [
		"pending",
		"paid",
		"confirmed",
		"processing",
		"packed",
		"shipped",
		"delivered"
	];
	const s = status === "paid" || status === "confirmed" ? "processing" : status;
	const idx = STATUS_STEPS.findIndex((x) => x.key === s);
	return idx < 0 ? Math.max(0, order.indexOf(status)) : idx;
}
function TrackOrder() {
	const track = useServerFn(trackOrderFn);
	const [form, setForm] = (0, import_react.useState)({
		order_number: "",
		email: ""
	});
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [order, setOrder] = (0, import_react.useState)(null);
	const [notFound, setNotFound] = (0, import_react.useState)(false);
	async function lookup(e) {
		e.preventDefault();
		if (!form.order_number.trim() || !form.email.trim()) {
			toast.error("Enter both order number and email");
			return;
		}
		setBusy(true);
		setNotFound(false);
		setOrder(null);
		try {
			const r = await track({ data: form });
			if (!r.ok) {
				setNotFound(true);
				return;
			}
			setOrder(r.order);
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusy(false);
		}
	}
	const cancelled = order?.status === "cancelled";
	const curStep = order ? stepIndex(order.status) : -1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-12 max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionEyebrow, { children: "Order Tracking" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-serif text-3xl md:text-4xl font-bold text-espresso",
				children: "Where is my order?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Enter your order number and the email you used at checkout."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: lookup,
				className: "mt-7 bg-white border border-border/80 rounded-2xl p-5 md:p-6 grid sm:grid-cols-[1fr_1fr_auto] gap-4 items-end shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-espresso font-bold mb-1.5",
							children: "Order number"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: form.order_number,
							onChange: (e) => setForm({
								...form,
								order_number: e.target.value.trim()
							}),
							placeholder: "SH-240702-A1B2C3",
							className: "w-full border border-border/80 rounded-xl px-4 py-3 text-sm bg-cream/20 focus:outline-none focus:border-burnt-orange transition-colors"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-espresso font-bold mb-1.5",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							value: form.email,
							onChange: (e) => setForm({
								...form,
								email: e.target.value
							}),
							placeholder: "you@example.com",
							className: "w-full border border-border/80 rounded-xl px-4 py-3 text-sm bg-cream/20 focus:outline-none focus:border-burnt-orange transition-colors"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						disabled: busy,
						className: "bg-burnt-orange text-white rounded-xl px-6 py-3.5 text-xs font-bold tracking-widest hover:bg-terracotta disabled:opacity-60 inline-flex items-center gap-2 justify-center shadow-md transition-all",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" }),
							" ",
							busy ? "…" : "TRACK"
						]
					})
				]
			}),
			notFound && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 bg-destructive/10 border border-destructive/30 rounded-2xl p-5 text-sm text-destructive",
				children: [
					"We couldn't find that order. Double-check the order number and email — or ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "mailto:hello@saurastrahoney.com",
						className: "underline font-semibold",
						children: "write to us"
					}),
					"."
				]
			}),
			order && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-border/80 rounded-2xl p-6 shadow-soft",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] tracking-widest font-bold text-burnt-orange uppercase",
								children: "Order number"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-serif text-xl font-bold text-espresso mt-0.5",
								children: order.order_number
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] tracking-widest font-bold text-burnt-orange uppercase",
									children: "Total"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-serif text-xl font-bold text-espresso mt-0.5",
									children: ["₹", (order.total_paise / 100).toFixed(0)]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground pt-3 border-t border-border/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Placed: ", new Date(order.created_at).toLocaleDateString()] }),
								order.estimated_delivery && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Est. delivery: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
									className: "text-espresso font-semibold",
									children: new Date(order.estimated_delivery).toLocaleDateString()
								})] }),
								order.delivered_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Delivered: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
									className: "text-espresso font-semibold",
									children: new Date(order.delivered_at).toLocaleDateString()
								})] }),
								order.tracking_number && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Tracking: ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
										className: "text-espresso font-semibold",
										children: order.tracking_number
									}),
									" ",
									order.shipping_carrier && `(${order.shipping_carrier})`
								] })
							]
						})]
					}),
					cancelled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-destructive/10 border border-destructive/30 rounded-2xl p-5 text-sm text-destructive font-medium",
						children: "This order has been cancelled."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-cream-deep/50 border border-border/80 rounded-2xl p-6 shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] tracking-widest font-bold text-espresso uppercase mb-4",
							children: "Delivery Status"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
							className: "relative flex justify-between",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute top-3 left-6 right-6 h-0.5 bg-border/80",
									"aria-hidden": true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute top-3 left-6 h-0.5 bg-burnt-orange transition-all",
									style: { width: `calc((100% - 3rem) * ${Math.max(0, curStep) / (STATUS_STEPS.length - 1)})` },
									"aria-hidden": true
								}),
								STATUS_STEPS.map((s, i) => {
									const done = i <= curStep;
									const Icon = s.icon;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "relative z-10 flex flex-col items-center text-center w-16",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `size-7 rounded-full flex items-center justify-center shadow-xs transition-colors ${done ? "bg-burnt-orange text-white" : "bg-white border border-border/80 text-muted-foreground"}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `mt-2 text-[11px] font-bold ${done ? "text-espresso" : "text-muted-foreground"}`,
											children: s.label
										})]
									}, s.key);
								})
							]
						})]
					}),
					order.timeline?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-border/80 rounded-2xl p-6 shadow-soft",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] tracking-widest font-bold text-burnt-orange uppercase mb-4",
							children: "Timeline"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-3 text-xs",
							children: [...order.timeline].reverse().map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-3.5 items-start",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full bg-burnt-orange mt-1 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold text-espresso uppercase tracking-wider",
									children: t.status
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-muted-foreground mt-0.5",
									children: [new Date(t.at).toLocaleString(), t.note ? ` — ${t.note}` : ""]
								})] })]
							}, i))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white border border-border/80 rounded-2xl p-6 grid md:grid-cols-2 gap-6 shadow-soft",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[10px] tracking-widest font-bold text-burnt-orange uppercase mb-3 flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "size-3.5" }), " Items"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "text-sm space-y-1.5 font-medium text-espresso",
							children: order.items.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								it.name,
								" — ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground font-normal",
									children: [
										it.size,
										" × ",
										it.qty
									]
								})
							] }, i))
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[10px] tracking-widest font-bold text-burnt-orange uppercase mb-3 flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5" }), " Shipping to"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm font-medium text-espresso leading-relaxed",
							children: [
								order.shipping.line1,
								order.shipping.line2 ? `, ${order.shipping.line2}` : "",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								order.shipping.city,
								", ",
								order.shipping.state,
								" — ",
								order.shipping.pincode
							]
						})] })]
					})
				]
			})
		]
	}) });
}
//#endregion
export { TrackOrder as component };
