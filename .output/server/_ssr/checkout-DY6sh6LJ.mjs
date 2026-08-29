import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useCart } from "./cart-Bp2wgR53.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as ShieldCheck, Mt as CreditCard, V as Package, u as Truck } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as supabase } from "./client-CiOF68Zx.mjs";
import { n as useAuth } from "./auth-L3PDI3kX.mjs";
import { a as literalType, i as enumType, l as stringType, n as arrayType, o as numberType, s as objectType } from "../_libs/zod.mjs";
import { t as useServerFn } from "./useServerFn-BqzygRuj.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-Uqm2rRc8.mjs";
import { n as SiteLayout, t as SectionEyebrow } from "./Layout-BROfU7ZF.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-ZAYK2SXy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-DY6sh6LJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var itemSchema = objectType({
	slug: stringType().max(120),
	name: stringType().max(200),
	size: stringType().max(40),
	price: numberType().int().nonnegative(),
	qty: numberType().int().positive().max(999),
	image: stringType().max(2e3).optional()
});
var shippingSchema = objectType({
	line1: stringType().min(3).max(200),
	line2: stringType().max(200).optional().or(literalType("")),
	city: stringType().min(2).max(100),
	state: stringType().min(2).max(100),
	pincode: stringType().min(4).max(12),
	country: stringType().max(80).optional()
});
var createSchema = objectType({
	full_name: stringType().trim().min(2).max(120),
	email: stringType().trim().email().max(255),
	phone: stringType().trim().min(7).max(20),
	shipping: shippingSchema,
	items: arrayType(itemSchema).min(1).max(50),
	payment_method: enumType(["cod", "razorpay"]),
	notes: stringType().max(1e3).optional(),
	coupon_code: stringType().trim().max(60).optional(),
	gift_note: stringType().trim().max(500).optional()
});
var createOrder = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => createSchema.parse(d)).handler(createSsrRpc("7f92d135aa3763ddd5bf6d4d9f84832b6b591cbaa35dcc4048b4b1beed8e7bf3"));
var createGuestOrder = createServerFn({ method: "POST" }).inputValidator((d) => createSchema.parse(d)).handler(createSsrRpc("ee598dbe3c410e1ffa3e252af029e83311b8c1e958da7a0127463555fe6a5f8a"));
var verifySchema = objectType({
	order_id: stringType().uuid(),
	razorpay_order_id: stringType().min(1),
	razorpay_payment_id: stringType().min(1),
	razorpay_signature: stringType().min(1)
});
var verifyRazorpay = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => verifySchema.parse(d)).handler(createSsrRpc("42e06eefd76cd7fc5258d5e9d07a37e00700eb20e59469c43c736ab5fce8334c"));
var verifyRazorpayGuest = createServerFn({ method: "POST" }).inputValidator((d) => verifySchema.parse(d)).handler(createSsrRpc("9de4a5288d4e6418520fe943f8e9ffb932f806ab19c76c34bdb1889243c36148"));
function loadRazorpay() {
	return new Promise((resolve) => {
		if (window.Razorpay) return resolve(true);
		const s = document.createElement("script");
		s.src = "https://checkout.razorpay.com/v1/checkout.js";
		s.onload = () => resolve(true);
		s.onerror = () => resolve(false);
		document.body.appendChild(s);
	});
}
function Checkout() {
	const { items, subtotal, subtotalPaise, discount, shippingWaived, coupon, clear } = useCart();
	const { user, loading } = useAuth();
	const navigate = useNavigate();
	const createOrderFn = useServerFn(createOrder);
	const createGuestOrderFn = useServerFn(createGuestOrder);
	const verifyFn = useServerFn(verifyRazorpay);
	const verifyGuestFn = useServerFn(verifyRazorpayGuest);
	const [addresses, setAddresses] = (0, import_react.useState)([]);
	const [selected, setSelected] = (0, import_react.useState)("");
	const [form, setForm] = (0, import_react.useState)({
		full_name: "",
		email: "",
		phone: "",
		line1: "",
		line2: "",
		city: "",
		state: "",
		pincode: ""
	});
	const [method, setMethod] = (0, import_react.useState)("cod");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [beganCheckout, setBeganCheckout] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (beganCheckout || items.length === 0) return;
		setBeganCheckout(true);
		import("./analytics-DCmDeuTY.mjs").then((n) => n.t).then((n) => n.t).then(({ track }) => track("begin_checkout", {
			currency: "INR",
			value: subtotal,
			items: items.map((i) => ({
				item_id: i.slug,
				item_name: i.name,
				item_variant: i.size,
				price: i.price,
				quantity: i.qty
			}))
		}));
	}, [
		items,
		subtotal,
		beganCheckout
	]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		(async () => {
			const [{ data: addrs }, { data: profile }] = await Promise.all([supabase.from("addresses").select("*").eq("user_id", user.id).order("created_at", { ascending: false }), supabase.from("profiles").select("full_name, phone").eq("id", user.id).maybeSingle()]);
			setAddresses(addrs ?? []);
			if (addrs && addrs.length > 0) setSelected(addrs[0].id);
			setForm((f) => ({
				...f,
				email: user.email ?? "",
				full_name: profile?.full_name ?? "",
				phone: profile?.phone ?? ""
			}));
		})();
	}, [user]);
	(0, import_react.useEffect)(() => {
		if (!selected) return;
		const a = addresses.find((x) => x.id === selected);
		if (a) setForm((f) => ({
			...f,
			line1: a.line1,
			line2: a.line2 ?? "",
			city: a.city,
			state: a.state,
			pincode: a.pincode,
			phone: a.phone ?? f.phone
		}));
	}, [selected, addresses]);
	const discountedSubtotal = Math.max(0, subtotal - discount);
	const shipping = shippingWaived || discountedSubtotal >= 799 ? 0 : 49;
	const total = discountedSubtotal + shipping;
	async function place() {
		if (busy) return;
		if (items.length === 0) {
			toast.error("Your cart is empty");
			return;
		}
		if (!form.full_name || !form.email || !form.phone || !form.line1 || !form.city || !form.state || !form.pincode) {
			toast.error("Please fill your name, contact and full address");
			return;
		}
		setBusy(true);
		const watchdog = setTimeout(() => {
			setBusy(false);
			toast.error("This is taking longer than expected. Please try again.");
		}, 3e4);
		try {
			const payload = { data: {
				full_name: form.full_name,
				email: form.email,
				phone: form.phone,
				shipping: {
					line1: form.line1,
					line2: form.line2,
					city: form.city,
					state: form.state,
					pincode: form.pincode
				},
				items: items.map((i) => ({
					slug: i.slug,
					name: i.name,
					size: i.size,
					price: i.price,
					qty: i.qty,
					image: i.image
				})),
				payment_method: method,
				notes: notes || void 0,
				coupon_code: coupon?.code
			} };
			const res = await (user ? createOrderFn(payload) : createGuestOrderFn(payload));
			const purchasePayload = {
				transaction_id: res.orderId,
				currency: "INR",
				value: total,
				shipping,
				items: items.map((i) => ({
					item_id: i.slug,
					item_name: i.name,
					item_variant: i.size,
					price: i.price,
					quantity: i.qty
				}))
			};
			if (method === "cod") {
				const { track } = await import("./analytics-DCmDeuTY.mjs").then((n) => n.t).then((n) => n.t);
				track("purchase", purchasePayload);
				clear();
				toast.success("Order placed!", { description: "We'll call to confirm within 24 hours." });
				navigate(user ? {
					to: "/order/$id",
					params: { id: res.orderId }
				} : { to: "/" });
				return;
			}
			if (!res.razorpay) throw new Error("Payment could not be started. Please choose Cash on Delivery or try again.");
			if (!await loadRazorpay() || !window.Razorpay) throw new Error("Could not load the payment gateway. Please check your connection.");
			new window.Razorpay({
				key: res.razorpay.keyId,
				amount: res.razorpay.amount,
				currency: res.razorpay.currency,
				name: "Saurashtra Honey",
				description: `Order ${res.orderId.slice(0, 8)}`,
				order_id: res.razorpay.orderId,
				prefill: {
					name: form.full_name,
					email: form.email,
					contact: form.phone
				},
				theme: { color: "#2B1B14" },
				handler: async (r) => {
					try {
						await (user ? verifyFn({ data: {
							order_id: res.orderId,
							...r
						} }) : verifyGuestFn({ data: {
							order_id: res.orderId,
							...r
						} }));
						const { track } = await import("./analytics-DCmDeuTY.mjs").then((n) => n.t).then((n) => n.t);
						track("purchase", purchasePayload);
						clear();
						toast.success("Payment successful!");
						navigate(user ? {
							to: "/order/$id",
							params: { id: res.orderId }
						} : { to: "/" });
					} catch (e) {
						toast.error(e.message || "Payment verification failed");
					}
				},
				modal: { ondismiss: () => {
					toast.info("Payment cancelled");
					setBusy(false);
				} }
			}).open();
			setBusy(false);
		} catch (e) {
			const msg = e.message || "Could not place order. Please try again.";
			const clean = /^(fetch|network|failed to fetch|typeerror)/i.test(msg) ? "Network issue. Please check your connection and try again." : msg;
			toast.error(clean);
		} finally {
			clearTimeout(watchdog);
			setBusy(false);
		}
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-page py-24 text-center text-muted-foreground",
		children: "Loading…"
	}) });
	if (items.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "mx-auto size-12 text-muted-foreground" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-serif text-3xl font-bold text-espresso",
				children: "Your cart is empty"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				className: "mt-4 inline-block text-burnt-orange font-semibold hover:text-terracotta",
				children: "Browse honey →"
			})
		]
	}) });
	const freeShipRemaining = Math.max(0, 799 - subtotal);
	const freePct = Math.min(100, Math.round(subtotal / 799 * 100));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-6 md:py-10 grid lg:grid-cols-[1.3fr_1fr] gap-6 lg:gap-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionEyebrow, { children: "Checkout" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 md:mt-2 font-serif text-2xl md:text-4xl font-bold text-espresso",
				children: "Complete your order"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3.5 text-burnt-orange" }), " Secure SSL"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "size-3.5 text-burnt-orange" }), " Free shipping ₹799+"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "size-3.5 text-burnt-orange" }), " Ships in 24–48 hrs"]
					})
				]
			}),
			!user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 bg-cream border border-burnt-orange/40 rounded-xl p-3 text-xs text-espresso flex flex-wrap items-center justify-between gap-2 shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"You're checking out as a guest. ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						search: { redirect: "/checkout" },
						className: "font-semibold text-burnt-orange underline underline-offset-2",
						children: "Sign in"
					}),
					" to save this address & track orders."
				] })
			}),
			addresses.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-bold tracking-widest text-espresso",
					children: "SAVED ADDRESSES"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 grid sm:grid-cols-2 gap-2",
					children: addresses.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: `bg-card border rounded-xl p-3 cursor-pointer text-xs transition-all ${selected === a.id ? "border-burnt-orange bg-cream shadow-sm" : "border-border"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "radio",
								name: "addr",
								checked: selected === a.id,
								onChange: () => setSelected(a.id),
								className: "mr-2"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-burnt-orange",
								children: a.label ?? "Address"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-espresso",
								children: [
									a.line1,
									a.line2 ? `, ${a.line2}` : "",
									", ",
									a.city,
									", ",
									a.state,
									" — ",
									a.pincode
								]
							})
						]
					}, a.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 bg-card border border-border rounded-2xl p-4 md:p-6 space-y-3 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-bold tracking-widest text-espresso",
						children: "CONTACT"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid sm:grid-cols-2 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								placeholder: "Full name *",
								autoComplete: "name",
								value: form.full_name,
								onChange: (e) => setForm({
									...form,
									full_name: e.target.value
								}),
								className: "w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background min-w-0 focus:border-burnt-orange focus:outline-none"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								placeholder: "Phone *",
								autoComplete: "tel",
								inputMode: "tel",
								value: form.phone,
								onChange: (e) => setForm({
									...form,
									phone: e.target.value
								}),
								className: "w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background min-w-0 focus:border-burnt-orange focus:outline-none"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								placeholder: "Email *",
								autoComplete: "email",
								inputMode: "email",
								value: form.email,
								onChange: (e) => setForm({
									...form,
									email: e.target.value
								}),
								className: "sm:col-span-2 border border-border rounded-lg px-3 py-2.5 text-sm bg-background min-w-0 focus:border-burnt-orange focus:outline-none"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-bold tracking-widest text-espresso mt-4",
						children: "SHIPPING ADDRESS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid sm:grid-cols-2 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								placeholder: "Address line 1 *",
								autoComplete: "address-line1",
								value: form.line1,
								onChange: (e) => setForm({
									...form,
									line1: e.target.value
								}),
								className: "sm:col-span-2 border border-border rounded-lg px-3 py-2.5 text-sm bg-background min-w-0 focus:border-burnt-orange focus:outline-none"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								placeholder: "Address line 2",
								autoComplete: "address-line2",
								value: form.line2,
								onChange: (e) => setForm({
									...form,
									line2: e.target.value
								}),
								className: "sm:col-span-2 border border-border rounded-lg px-3 py-2.5 text-sm bg-background min-w-0 focus:border-burnt-orange focus:outline-none"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								placeholder: "City *",
								autoComplete: "address-level2",
								value: form.city,
								onChange: (e) => setForm({
									...form,
									city: e.target.value
								}),
								className: "w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background min-w-0 focus:border-burnt-orange focus:outline-none"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								placeholder: "State *",
								autoComplete: "address-level1",
								value: form.state,
								onChange: (e) => setForm({
									...form,
									state: e.target.value
								}),
								className: "w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background min-w-0 focus:border-burnt-orange focus:outline-none"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								placeholder: "Pincode *",
								autoComplete: "postal-code",
								inputMode: "numeric",
								value: form.pincode,
								onChange: (e) => setForm({
									...form,
									pincode: e.target.value
								}),
								className: "w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background min-w-0 focus:border-burnt-orange focus:outline-none"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 2,
						placeholder: "Order notes (optional)",
						value: notes,
						onChange: (e) => setNotes(e.target.value),
						className: "w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:border-burnt-orange focus:outline-none"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-bold tracking-widest text-espresso",
					children: "PAYMENT METHOD"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 grid sm:grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: `bg-card border rounded-xl p-4 cursor-pointer flex gap-3 items-start transition-all ${method === "cod" ? "border-burnt-orange bg-cream shadow-sm" : "border-border"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "radio",
							checked: method === "cod",
							onChange: () => setMethod("cod"),
							className: "mt-1"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-semibold text-espresso flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "size-4" }), " Cash on Delivery"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Pay when you receive. India-wide."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: `bg-card border rounded-xl p-4 cursor-pointer flex gap-3 items-start transition-all ${method === "razorpay" ? "border-burnt-orange bg-cream shadow-sm" : "border-border"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "radio",
							checked: method === "razorpay",
							onChange: () => setMethod("razorpay"),
							className: "mt-1"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-semibold text-espresso flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "size-4" }), " Online payment"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "UPI, cards, netbanking via Razorpay"
						})] })]
					})]
				})]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
			className: "lg:sticky lg:top-24 h-fit",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-cream rounded-2xl md:rounded-3xl p-4 md:p-6 border border-border/70 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-xl md:text-2xl font-bold text-espresso",
						children: "Order summary"
					}),
					freeShipRemaining > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[11px] text-espresso",
							children: [
								"Add ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["₹", freeShipRemaining] }),
								" more for ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "FREE" }),
								" shipping"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 h-1.5 rounded-full bg-white overflow-hidden border border-border/40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-burnt-orange transition-all",
								style: { width: `${freePct}%` }
							})
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 text-[11px] font-semibold text-burnt-orange",
						children: "🎉 You've unlocked FREE shipping"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 divide-y divide-border max-h-72 overflow-y-auto",
						children: items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-3 flex gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: i.image,
									alt: i.name,
									className: "size-14 rounded-lg object-cover object-center shrink-0 shadow-sm"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium text-espresso truncate",
										children: i.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: [
											i.size,
											" × ",
											i.qty
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm font-semibold shrink-0",
									children: ["₹", i.price * i.qty]
								})
							]
						}, i.slug + i.size))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["₹", subtotal] })]
							}),
							discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-burnt-orange",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Coupon ", coupon?.code && `(${coupon.code})`] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["−₹", discount] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Shipping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: shipping === 0 ? "Free" : `₹${shipping}` })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between font-serif text-lg md:text-xl font-bold text-espresso pt-2 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["₹", total] })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: busy,
						onClick: place,
						className: "mt-5 w-full bg-espresso text-cream rounded-lg py-3.5 text-xs font-bold tracking-widest hover:bg-burnt-orange disabled:opacity-60 transition-all shadow-sm",
						children: busy ? "PLACING…" : method === "cod" ? `PLACE COD ORDER · ₹${total}` : `PAY ₹${total}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 space-y-1.5 text-[10px] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3 text-burnt-orange" }), " 100% secure — no card data touches our servers"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "size-3 text-burnt-orange" }), " Easy replacement within 7 days if damaged"]
						})]
					})
				]
			})
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "lg:hidden fixed bottom-14 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] uppercase tracking-widest text-muted-foreground",
			children: "Total"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "font-serif text-lg font-bold text-espresso leading-none",
			children: ["₹", total]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			disabled: busy,
			onClick: place,
			className: "flex-1 bg-espresso text-cream rounded-lg py-3 text-xs font-bold tracking-widest hover:bg-burnt-orange disabled:opacity-60 transition-colors",
			children: busy ? "PLACING…" : method === "cod" ? "PLACE ORDER" : `PAY ₹${total}`
		})]
	})] });
}
//#endregion
export { Checkout as component };
