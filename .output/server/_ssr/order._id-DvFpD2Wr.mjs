import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as Printer, Pt as Clock, V as Package, Y as MapPin, u as Truck, zt as CircleCheck } from "../_libs/lucide-react.mjs";
import { n as supabase } from "./client-CiOF68Zx.mjs";
import { n as useAuth } from "./auth-L3PDI3kX.mjs";
import { n as SiteLayout } from "./Layout-BROfU7ZF.mjs";
import { t as Route } from "./order._id-jykP0l-4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/order._id-DvFpD2Wr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ORDER_STEPS = [
	{
		key: "pending",
		label: "Placed",
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
function OrderDetail() {
	const { id } = Route.useParams();
	const { user, loading } = useAuth();
	const nav = useNavigate();
	const [order, setOrder] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!loading && !user) nav({
			to: "/auth",
			search: { redirect: `/order/${id}` }
		});
	}, [
		user,
		loading,
		id,
		nav
	]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		(async () => {
			const { data, error } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
			if (error) {
				setErr(error.message);
				return;
			}
			if (!data) {
				setErr("Order not found.");
				return;
			}
			setOrder(data);
		})();
	}, [user, id]);
	if (loading || !user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-page py-24 text-center text-muted-foreground",
		children: "Loading…"
	}) });
	if (err) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-16 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-destructive",
			children: err
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/account",
			search: { tab: "orders" },
			className: "mt-4 inline-block text-gold-deep",
			children: "Back to orders →"
		})]
	}) });
	if (!order) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-page py-24 text-center text-muted-foreground",
		children: "Loading order…"
	}) });
	const stepIdx = ORDER_STEPS.findIndex((s) => s.key === (order.status === "paid" || order.status === "confirmed" ? "processing" : order.status));
	const cancelled = order.status === "cancelled";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-8 max-w-4xl print:py-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between items-start gap-3 flex-wrap print:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/account",
						search: { tab: "orders" },
						className: "text-xs text-gold-deep font-bold tracking-widest hover:underline",
						children: "← ALL ORDERS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-2 font-serif text-3xl text-forest-dark",
						children: ["Order ", order.order_number ?? order.id.slice(0, 8)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: ["Placed on ", new Date(order.created_at).toLocaleString()]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => window.print(),
					className: "inline-flex items-center gap-2 border border-border rounded-lg px-4 py-2 text-xs font-bold tracking-widest text-forest-dark hover:bg-cream",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), " PRINT INVOICE"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden print:block mb-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between border-b pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-serif text-2xl text-forest-dark",
						children: "Saurashtra Honey"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "Raw, unfiltered honey from Saurashtra • hello@saurastrahoney.com"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-bold",
								children: "INVOICE"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["#", order.order_number ?? order.id.slice(0, 8)] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: new Date(order.created_at).toLocaleDateString() })
						]
					})]
				})
			}),
			!cancelled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 bg-cream rounded-2xl p-5 print:hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] font-bold tracking-widest text-forest-dark uppercase mb-4",
						children: "Status"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "relative flex justify-between",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-3 left-6 right-6 h-0.5 bg-border",
								"aria-hidden": true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-3 left-6 h-0.5 bg-gold-deep transition-all",
								style: { width: `calc((100% - 3rem) * ${Math.max(0, stepIdx) / (ORDER_STEPS.length - 1)})` },
								"aria-hidden": true
							}),
							ORDER_STEPS.map((s, i) => {
								const done = i <= stepIdx;
								const Icon = s.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "relative z-10 flex flex-col items-center text-center w-16",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `size-6 rounded-full flex items-center justify-center ${done ? "bg-gold-deep text-cream" : "bg-white border border-border text-muted-foreground"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `mt-2 text-[10px] font-semibold ${done ? "text-forest-dark" : "text-muted-foreground"}`,
										children: s.label
									})]
								}, s.key);
							})
						]
					}),
					order.tracking_number && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-xs text-forest-dark",
						children: [
							"Tracking: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: order.tracking_number }),
							order.shipping_carrier && ` (${order.shipping_carrier})`
						]
					}),
					order.estimated_delivery && !order.delivered_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: ["Estimated delivery: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "text-forest-dark",
							children: new Date(order.estimated_delivery).toLocaleDateString()
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid md:grid-cols-3 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-card border border-border rounded-2xl p-4 md:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] tracking-widest font-bold text-forest-dark uppercase mb-2",
							children: "Items"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border",
							children: order.items.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "py-3 flex gap-3 items-center",
								children: [
									it.image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: it.image,
										alt: "",
										className: "size-14 rounded-lg object-cover"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium text-forest-dark",
											children: it.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-muted-foreground",
											children: [
												it.size,
												" × ",
												it.qty
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-sm font-semibold",
										children: ["₹", it.price * it.qty]
									})
								]
							}, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 border-t border-border pt-3 space-y-1 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["₹", (order.subtotal_paise / 100).toFixed(0)] })]
								}),
								order.discount_paise > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-gold-deep",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Discount ", order.coupon_code && `(${order.coupon_code})`] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["−₹", (order.discount_paise / 100).toFixed(0)] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Shipping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: order.shipping_paise === 0 ? "Free" : `₹${(order.shipping_paise / 100).toFixed(0)}` })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between border-t border-border pt-2 font-serif text-xl text-forest-dark",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["₹", (order.total_paise / 100).toFixed(0)] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground uppercase mt-1",
									children: ["Paid via ", order.payment_method]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-card border border-border rounded-2xl p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[10px] tracking-widest font-bold text-forest-dark uppercase mb-2 flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3" }), " Shipping"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm",
								children: [
									order.full_name,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									order.shipping.line1,
									order.shipping.line2 ? `, ${order.shipping.line2}` : "",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									order.shipping.city,
									", ",
									order.shipping.state,
									" — ",
									order.shipping.pincode
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									order.phone,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									order.email
								]
							})
						]
					}), order.timeline?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-card border border-border rounded-2xl p-4 print:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] tracking-widest font-bold text-forest-dark uppercase mb-2",
							children: "Timeline"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "text-xs space-y-2",
							children: [...order.timeline].reverse().map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
									className: "text-forest-dark uppercase",
									children: t.status
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [new Date(t.at).toLocaleString(), t.note ? ` — ${t.note}` : ""]
								})
							] }, i))
						})]
					})]
				})]
			})
		]
	}) });
}
//#endregion
export { OrderDetail as component };
