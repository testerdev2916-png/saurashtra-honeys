import { i as __toESM } from "../_runtime.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useCart, t as CartProvider } from "./cart-Bp2wgR53.mjs";
import { M as redirect, _ as useNavigate, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { C as ShieldCheck, N as Plus, S as ShoppingBag, U as Minus, Xt as BookmarkPlus, g as Tag, i as X, p as Trash2, rn as ArrowUpRight, u as Truck, xt as GitCompare } from "../_libs/lucide-react.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as supabase } from "./client-CiOF68Zx.mjs";
import { t as AuthProvider } from "./auth-L3PDI3kX.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { n as WishlistProvider, s as useCompanySettings } from "./collection-helpers-DAdv5muE.mjs";
import { t as Route$52 } from "./account-TQP5sZXh.mjs";
import { t as useServerFn } from "./useServerFn-BqzygRuj.mjs";
import { t as Route$53 } from "./admin.instagram-CyvWZmni.mjs";
import { r as track } from "./analytics-DCmDeuTY.mjs";
import { t as Route$54 } from "./blog-ClA-loxX.mjs";
import { t as Route$55 } from "./blog._slug-Bq1PE4Tr.mjs";
import { t as Route$56 } from "./collections._slug-CMYvhzUu.mjs";
import { n as useCompare, t as CompareProvider } from "./compare-Cg9kkhzV.mjs";
import { t as Route$57 } from "./newsletter.confirm._token-BxVpDBTa.mjs";
import { t as Route$58 } from "./newsletter.unsubscribe._token-DRlCfBim.mjs";
import { t as Route$59 } from "./order._id-jykP0l-4.mjs";
import { t as Route$60 } from "./product._slug-RZv2PRXf.mjs";
import { n as validateCouponFn } from "./coupons.functions-B1UWeC6d.mjs";
import { t as Route$61 } from "./routes-CcKgfIj1.mjs";
import { t as Route$62 } from "./shop.index-DzLEocu-.mjs";
import { t as Route$63 } from "./shop._slug-Dp1hCuvf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BHalhISt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
var Sheet = Dialog;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-3 top-3 flex size-9 items-center justify-center rounded-full opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
function CartDrawer() {
	const { items, saved, open, setOpen, updateQty, remove, subtotal, subtotalPaise, discount, clear, coupon, applyCoupon, moveToSaved, moveToCart, removeSaved, shippingWaived } = useCart();
	const navigate = useNavigate();
	const validate = useServerFn(validateCouponFn);
	const [code, setCode] = (0, import_react.useState)("");
	const [applying, setApplying] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (open && items.length) track("view_cart", {
			currency: "INR",
			value: subtotal,
			items: items.map((i) => ({
				item_id: i.slug,
				item_name: i.name,
				item_variant: i.size,
				price: i.price,
				quantity: i.qty
			}))
		});
	}, [
		open,
		items,
		subtotal
	]);
	const freeAt = 799;
	const remaining = Math.max(0, freeAt - (subtotal - discount));
	const pct = Math.min(100, Math.round((subtotal - discount) / freeAt * 100));
	const shipping = shippingWaived || subtotal - discount >= freeAt ? 0 : 49;
	const total = subtotal - discount + shipping;
	async function apply() {
		if (!code.trim()) return;
		setApplying(true);
		try {
			const r = await validate({ data: {
				code: code.trim(),
				subtotal_paise: subtotalPaise
			} });
			if (r.ok) {
				applyCoupon({
					code: r.code,
					discount_paise: r.discount_paise,
					free_shipping: r.free_shipping,
					description: r.description
				});
				setCode("");
				toast.success(r.free_shipping ? `Coupon applied — free shipping!` : `Coupon applied — you saved ₹${(r.discount_paise / 100).toFixed(0)}`);
			} else toast.error(r.error);
		} catch (e) {
			toast.error(e.message);
		} finally {
			setApplying(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange: setOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			className: "w-full sm:max-w-md flex flex-col bg-background gap-0 p-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
					className: "px-6 pt-6 pb-4 border-b border-border space-y-1 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetTitle, {
						className: "font-serif text-xl text-forest-dark flex items-center gap-2 pr-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-5 text-gold-deep shrink-0" }), " Your Cart"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] font-bold tracking-widest text-muted-foreground",
						children: items.length === 0 ? "0 ITEMS" : `${items.reduce((n, i) => n + i.qty, 0)} ITEM${items.reduce((n, i) => n + i.qty, 0) === 1 ? "" : "S"}`
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 overflow-y-auto py-4 px-6 space-y-4",
					children: [items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center py-16",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto size-16 rounded-full bg-cream flex items-center justify-center text-gold-deep mb-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-forest-dark",
								children: "Your cart is empty."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Discover naturally sourced honey from our collection."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/shop",
								onClick: () => setOpen(false),
								className: "mt-5 inline-block bg-forest-dark text-cream rounded-lg px-6 py-2.5 text-[11px] font-bold tracking-widest hover:bg-forest",
								children: "SHOP HONEY"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-3",
						children: items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3 bg-cream rounded-xl p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: i.image,
								alt: i.name,
								loading: "lazy",
								width: 80,
								height: 80,
								className: "size-20 rounded-lg object-cover shrink-0"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-serif text-sm text-forest-dark leading-tight truncate",
												children: i.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[11px] text-muted-foreground",
												children: ["Size: ", i.size]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											"aria-label": "Remove",
											onClick: () => remove(i.slug, i.size),
											className: "text-muted-foreground hover:text-destructive shrink-0 p-1.5 -m-1.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "inline-flex items-center border border-border rounded-lg bg-background",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													"aria-label": "Decrease quantity",
													onClick: () => updateQty(i.slug, i.size, i.qty - 1),
													className: "px-2.5 py-1.5",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-3" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "px-2 text-xs tabular-nums min-w-[1.5rem] text-center",
													children: i.qty
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													"aria-label": "Increase quantity",
													onClick: () => updateQty(i.slug, i.size, i.qty + 1),
													className: "px-2.5 py-1.5",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3" })
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-sm font-semibold text-forest-dark",
											children: ["₹", (i.price * i.qty).toLocaleString()]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => moveToSaved(i.slug, i.size),
										className: "mt-1.5 inline-flex items-center gap-1 text-[10px] text-forest-dark/70 hover:text-gold-deep py-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkPlus, { className: "size-3" }), " Save for later"]
									})
								]
							})]
						}, i.slug + i.size))
					}), saved.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[10px] font-bold tracking-widest text-forest-dark mb-2",
						children: [
							"SAVED FOR LATER (",
							saved.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: saved.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3 items-center bg-background border border-border rounded-xl p-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									loading: "lazy",
									src: i.image,
									alt: "",
									className: "size-12 rounded-md object-cover"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium text-forest-dark truncate",
										children: i.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-muted-foreground",
										children: [
											i.size,
											" · ₹",
											i.price
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-1 shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => moveToCart(i.slug, i.size),
										className: "text-[10px] font-bold tracking-widest text-gold-deep hover:underline inline-flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3" }), "MOVE"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										"aria-label": "Remove saved item",
										onClick: () => removeSaved(i.slug, i.size),
										className: "text-muted-foreground hover:text-destructive",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
									})]
								})
							]
						}, i.slug + i.size))
					})] })]
				}),
				items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-border px-6 py-4 space-y-3",
					children: [
						remaining > 0 && !shippingWaived ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[11px] text-forest-dark",
							children: [
								"₹",
								remaining,
								" away from ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
									className: "font-bold tracking-wide",
									children: "FREE SHIPPING"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1.5 h-1.5 rounded-full bg-cream overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-gold-deep transition-all",
								style: { width: `${pct}%` }
							})
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] font-bold tracking-widest text-gold-deep",
							children: "YOU'VE UNLOCKED FREE SHIPPING"
						}),
						coupon ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 bg-cream rounded-lg px-3 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "size-3.5 text-gold-deep" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 text-xs text-forest-dark",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: coupon.code }),
										" applied ",
										coupon.free_shipping ? "· free shipping" : `· −₹${(coupon.discount_paise / 100).toFixed(0)}`
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									"aria-label": "Remove coupon",
									onClick: () => applyCoupon(null),
									className: "text-muted-foreground hover:text-destructive",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: (e) => {
								e.preventDefault();
								apply();
							},
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: code,
								onChange: (e) => setCode(e.target.value.toUpperCase()),
								placeholder: "Coupon code",
								className: "flex-1 border border-border rounded-lg px-3 py-2 text-xs bg-background focus:outline-none focus:border-gold-deep"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								disabled: applying,
								className: "bg-forest-dark text-cream rounded-lg px-4 text-[11px] font-bold tracking-widest hover:bg-forest disabled:opacity-60",
								children: applying ? "…" : "APPLY"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["₹", subtotal.toLocaleString()] })]
								}),
								discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-gold-deep",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Discount" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["−₹", discount.toLocaleString()] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Shipping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: shipping === 0 ? "Free" : `₹${shipping}` })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between pt-1 border-t border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-forest-dark font-semibold text-sm",
										children: "Total"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-serif text-2xl text-forest-dark",
										children: ["₹", total.toLocaleString()]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								setOpen(false);
								navigate({ to: "/checkout" });
							},
							className: "w-full bg-forest-dark text-cream rounded-lg py-3 text-xs font-bold tracking-widest hover:bg-forest",
							children: ["CHECKOUT · ₹", total.toLocaleString()]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-center gap-4 text-[10px] text-muted-foreground pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3 text-gold-deep" }), " Secure"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "size-3 text-gold-deep" }), " Ships in 24–48 hrs"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-[11px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/shop",
								onClick: () => setOpen(false),
								className: "text-gold-deep font-semibold",
								children: "Continue shopping"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: clear,
								className: "text-muted-foreground hover:text-destructive",
								children: "Clear cart"
							})]
						})
					]
				})
			]
		})
	});
}
function CompareBar() {
	const { slugs, remove, clear, count } = useCompare();
	if (count === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed bottom-16 md:bottom-4 inset-x-2 md:inset-x-auto md:right-4 z-40 max-w-xl md:w-auto md:min-w-[440px] bg-forest-dark text-cream rounded-2xl shadow-lift px-4 py-3 flex items-center gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitCompare, { className: "size-5 text-gold shrink-0" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[10px] tracking-widest font-bold text-gold",
					children: [
						"COMPARE (",
						count,
						"/4)"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5 mt-1",
					children: slugs.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 text-[11px] bg-cream/10 rounded px-2 py-0.5",
						children: [s, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							"aria-label": `Remove ${s}`,
							onClick: () => remove(s),
							className: "hover:text-gold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" })
						})]
					}, s))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1.5 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/compare",
					className: "bg-gold-deep text-cream rounded-lg px-3 py-1.5 text-[11px] font-bold tracking-widest hover:bg-gold hover:text-forest-dark",
					children: "COMPARE"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: clear,
					className: "text-[10px] text-cream/60 hover:text-cream",
					children: "Clear all"
				})]
			})
		]
	});
}
var DEFAULTS = {
	seo: {
		default_title: "Saurashtra Honey",
		default_description: "Raw, unfiltered honey from Saurashtra.",
		default_keywords: "",
		default_og_image: ""
	},
	analytics: {
		ga4_measurement_id: "",
		meta_pixel_id: "",
		clarity_id: "",
		gsc_verification: ""
	},
	social: {
		instagram: "",
		facebook: "",
		youtube: "",
		linkedin: "",
		x: "",
		pinterest: ""
	},
	whatsapp: {
		enabled: true,
		number: "919687328404",
		default_message: "Hi! I would like to know more about your honey."
	},
	newsletter: {
		double_opt_in: true,
		welcome_reward_points: 0
	},
	loyalty: {
		enabled: true,
		points_per_rupee: 1,
		redeem_rate_paise: 100,
		signup_bonus: 0,
		referral_reward: 100,
		referred_reward: 50
	},
	features: {
		recently_purchased_popup: true,
		trust_badges: true,
		low_stock_message: true,
		exit_intent_ready: true
	},
	robots: {
		disallow_paths: [
			"/admin",
			"/account",
			"/checkout",
			"/order",
			"/lovable"
		],
		extra: ""
	},
	i18n: {
		default_locale: "en",
		supported_locales: [
			"en",
			"hi",
			"gu"
		]
	}
};
var Ctx = (0, import_react.createContext)(DEFAULTS);
var useSiteSettings = () => (0, import_react.useContext)(Ctx);
function SiteSettingsProvider({ children }) {
	const [s, setS] = (0, import_react.useState)(DEFAULTS);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			const { data } = await supabase.from("app_settings").select("data").eq("id", 1).maybeSingle();
			if (!cancelled && data?.data) {
				const merged = { ...DEFAULTS };
				for (const k of Object.keys(DEFAULTS)) merged[k] = {
					...DEFAULTS[k],
					...data.data[k] ?? {}
				};
				setS(merged);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value: s,
		children
	});
}
var I18nCtx = (0, import_react.createContext)({
	locale: "en",
	setLocale: () => {},
	t: (_, f) => f ?? ""
});
var KEY = "sh_locale";
function I18nProvider({ children }) {
	const [locale, setLocale] = (0, import_react.useState)("en");
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const l = window.localStorage.getItem(KEY);
		if (l) setLocale(l);
		document.documentElement.lang = l ?? "en";
	}, []);
	function set(l) {
		setLocale(l);
		try {
			window.localStorage.setItem(KEY, l);
		} catch {}
		if (typeof document !== "undefined") document.documentElement.lang = l;
	}
	const t = (_key, fallback) => fallback ?? _key;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nCtx.Provider, {
		value: {
			locale,
			setLocale: set,
			t
		},
		children
	});
}
function inject(src, id) {
	if (document.getElementById(id)) return;
	const s = document.createElement("script");
	s.async = true;
	s.src = src;
	s.id = id;
	document.head.appendChild(s);
}
function injectInline(code, id) {
	if (document.getElementById(id)) return;
	const s = document.createElement("script");
	s.id = id;
	s.text = code;
	document.head.appendChild(s);
}
function AnalyticsScripts() {
	const { analytics } = useSiteSettings();
	const { ga4_measurement_id: ga, meta_pixel_id: fb, clarity_id: cl, gsc_verification: gsc } = analytics;
	(0, import_react.useEffect)(() => {
		if (ga) {
			inject(`https://www.googletagmanager.com/gtag/js?id=${ga}`, "ga4-src");
			injectInline(`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ga}',{send_page_view:true});`, "ga4-init");
		}
		if (fb) injectInline(`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${fb}');fbq('track','PageView');`, "fbq-init");
		if (cl) injectInline(`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${cl}");`, "clarity-init");
		if (gsc) {
			const m = document.querySelector("meta[name=\"google-site-verification\"]");
			if (m) m.content = gsc;
			else {
				const el = document.createElement("meta");
				el.name = "google-site-verification";
				el.content = gsc;
				document.head.appendChild(el);
			}
		}
	}, [
		ga,
		fb,
		cl,
		gsc
	]);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const map = {
			view_item: "ViewContent",
			add_to_cart: "AddToCart",
			begin_checkout: "InitiateCheckout",
			purchase: "Purchase",
			search: "Search",
			view_item_list: "ViewCategory"
		};
		const handler = (event) => {
			const e = event;
			const name = e.type.replace(/^analytics:/, "");
			const fbEvent = map[name];
			if (fbEvent && window.fbq) window.fbq("track", fbEvent, e.detail ?? {});
			if (window.clarity) window.clarity("event", name);
		};
		const events = Object.keys(map).map((k) => `analytics:${k}`);
		events.forEach((ev) => window.addEventListener(ev, handler));
		return () => events.forEach((ev) => window.removeEventListener(ev, handler));
	}, []);
	return null;
}
var whatsapp_logo_default = "/assets/whatsapp-logo-Bfos9VAh.png";
function WhatsAppFloat() {
	const { whatsapp } = useSiteSettings();
	if (!whatsapp.enabled || !whatsapp.number) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: `https://wa.me/${whatsapp.number.replace(/\D/g, "")}?text=${encodeURIComponent(whatsapp.default_message)}`,
		target: "_blank",
		rel: "noopener noreferrer",
		"aria-label": "Chat on WhatsApp",
		className: "fixed z-50 bottom-[100px] md:bottom-6 right-4 md:right-6 w-[56px] h-[56px] md:w-[64px] md:h-[64px] hover:scale-105 transition-transform flex items-center justify-center drop-shadow-lg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			loading: "lazy",
			src: whatsapp_logo_default,
			alt: "WhatsApp",
			className: "w-full h-full object-contain scale-[1.6]"
		})
	});
}
function FaviconUpdater() {
	const faviconUrl = useCompanySettings()?.favicon_url?.trim();
	(0, import_react.useEffect)(() => {
		const rawUrl = faviconUrl || "/favicon.ico";
		const versionedUrl = `${rawUrl}${rawUrl.includes("?") ? "&" : "?"}v=${Date.now()}`;
		const iconLinks = document.querySelectorAll("link[rel*='icon']");
		if (iconLinks.length > 0) iconLinks.forEach((link) => {
			link.href = versionedUrl;
			if (rawUrl.endsWith(".svg")) link.type = "image/svg+xml";
			else if (rawUrl.endsWith(".png")) link.type = "image/png";
			else link.type = "image/x-icon";
		});
		else {
			const newLink = document.createElement("link");
			newLink.rel = "icon";
			newLink.href = versionedUrl;
			newLink.type = rawUrl.endsWith(".svg") ? "image/svg+xml" : rawUrl.endsWith(".png") ? "image/png" : "image/x-icon";
			document.head.appendChild(newLink);
		}
	}, [faviconUrl]);
	return null;
}
var styles_default = "/assets/styles-BbJ6ApCg.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	window.__lovableReportRuntimeError?.({
		message,
		stack: error instanceof Error ? error.stack : void 0,
		filename: window.location.pathname
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$51 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{
				name: "theme-color",
				content: "#2B1B14"
			},
			{
				property: "og:site_name",
				content: "Saurashtra Honey"
			},
			{
				property: "og:locale",
				content: "en_IN"
			},
			{
				name: "twitter:site",
				content: "@saurashtrahoney"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400..700;1,400..700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=Inter:wght@300;400;500;600;700;800&display=swap"
			}
		],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "Organization",
				name: "Saurashtra Honey",
				url: "https://id-preview--f7347c5b-4839-4afc-a6bf-ed617bd76e1d.lovable.app",
				description: "Raw, unfiltered honey from the wildflower farms of Saurashtra.",
				contactPoint: {
					"@type": "ContactPoint",
					telephone: "+91-96873-28404",
					contactType: "customer service",
					email: "hello@saurastrahoney.com",
					areaServed: "IN"
				}
			})
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: `
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
              for(let registration of registrations) {
                registration.unregister();
              }
            }).catch(function(err) {
              console.error('Service Worker unregistration failed: ', err);
            });
          }
          if (window.caches) {
            caches.keys().then(function(names) {
              for (let name of names) {
                caches.delete(name);
              }
            });
          }
        ` } })
		] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$51.useRouteContext();
	const isAdmin = useRouter().state.location.pathname.startsWith("/admin");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteSettingsProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WishlistProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompareProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CartProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartDrawer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompareBar, {}),
			!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppFloat, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalyticsScripts, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaviconUpdater, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
				position: "top-right",
				richColors: true
			})
		] }) }) }) }) }) })
	});
}
var $$splitComponentImporter$45 = () => import("./admin-B4D1ufXX.mjs");
var Route$50 = createFileRoute("/admin")({
	head: () => ({ meta: [
		{ title: "Admin • Saurashtra Honey" },
		{
			name: "description",
			content: "Internal admin dashboard."
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$45, "component")
});
var $$splitComponentImporter$44 = () => import("./auth-TUZaiShc.mjs");
var Route$49 = createFileRoute("/auth")({
	head: () => ({ meta: [
		{ title: "Sign In or Create Account | Saurashtra Honey" },
		{
			name: "description",
			content: "Sign in to track orders, manage addresses and your wishlist."
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$44, "component")
});
var $$splitComponentImporter$43 = () => import("./become-a-partner-vkuuizx4.mjs");
var Route$48 = createFileRoute("/become-a-partner")({
	head: () => ({
		meta: [
			{ title: "Become a Partner — Let's Grow Naturally, Together | Saurashtra Honey" },
			{
				name: "description",
				content: "Join hands with Saurashtra Honey — retailers, distributors, wholesalers and online sellers. High margins, marketing support and reliable supply."
			},
			{
				property: "og:title",
				content: "Become a Partner — Saurashtra Honey"
			},
			{
				property: "og:description",
				content: "Let's grow naturally, together. Build a business rooted in purity and trust."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: "https://id-preview--f7347c5b-4839-4afc-a6bf-ed617bd76e1d.lovable.app/become-a-partner"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "canonical",
			href: "https://id-preview--f7347c5b-4839-4afc-a6bf-ed617bd76e1d.lovable.app/become-a-partner"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$43, "component")
});
var Route$47 = createFileRoute("/bee-farming")({ beforeLoad: () => {
	throw redirect({ to: "/our-story" });
} });
var $$splitComponentImporter$42 = () => import("./bulk-gifting-C7y-YALN.mjs");
var Route$46 = createFileRoute("/bulk-gifting")({
	head: () => ({ meta: [
		{ title: "B2B Ecosystem — Wholesale, Corporate Gifts & Private Label | Saurashtra Honey" },
		{
			name: "description",
			content: "Discover our premium B2B services: Wholesale Bulk Orders, Corporate Gifting, Luxury Hampers, and White Label Manufacturing of pure natural honey."
		},
		{
			property: "og:title",
			content: "B2B Ecosystem — Saurashtra Honey"
		},
		{
			property: "og:description",
			content: "Partner with a trusted premium honey manufacturer."
		},
		{
			property: "og:type",
			content: "website"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$42, "component")
});
var $$splitComponentImporter$41 = () => import("./bulk-orders-Dz0P1ZPY.mjs");
var Route$45 = createFileRoute("/bulk-orders")({
	head: () => ({ meta: [
		{ title: "Wholesale & Bulk Honey Orders | Saurashtra Honey" },
		{
			name: "description",
			content: "Premium wholesale honey supply for restaurants, retailers, hotels, and distributors. Custom packaging, reliable delivery, and competitive B2B pricing."
		},
		{
			property: "og:title",
			content: "Wholesale Honey Supply — Saurashtra Honey"
		},
		{
			property: "og:description",
			content: "Premium bulk honey for businesses."
		},
		{
			property: "og:type",
			content: "website"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$41, "component")
});
var $$splitComponentImporter$40 = () => import("./checkout-DY6sh6LJ.mjs");
var Route$44 = createFileRoute("/checkout")({
	head: () => ({ meta: [
		{ title: "Secure Checkout | Saurashtra Honey" },
		{
			name: "description",
			content: "Complete your honey order with Cash on Delivery or secure online payment."
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$40, "component")
});
var $$splitComponentImporter$39 = () => import("./compare-BqOn4CKy.mjs");
var Route$43 = createFileRoute("/compare")({
	head: () => ({ meta: [
		{ title: "Compare Honey Products — Saurashtra Honey" },
		{
			name: "description",
			content: "Compare our raw honey varieties side-by-side — price, flora, benefits and pack sizes."
		},
		{
			property: "og:title",
			content: "Compare Products — Saurashtra Honey"
		},
		{
			property: "og:description",
			content: "Compare honey side-by-side to pick the right jar for you."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$39, "component")
});
var $$splitComponentImporter$38 = () => import("./contact-BJ02H9R2.mjs");
var Route$42 = createFileRoute("/contact")({
	head: () => ({ meta: [
		{ title: "Contact Us — We'd Love to Hear From You | Saurashtra Honey" },
		{
			name: "description",
			content: "Have a question, feedback or a special request? Reach out to Saurashtra Honey Bee Farm in Gujarat. Call, email, WhatsApp or send us a message — we are here to help."
		},
		{
			property: "og:title",
			content: "Contact Us — Saurashtra Honey Bee Farm"
		},
		{
			property: "og:description",
			content: "We're Here for You. Let's Connect. Have a question, feedback or special request? We'd love to hear from you."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$38, "component")
});
var $$splitComponentImporter$37 = () => import("./corporate-gifting-DzAQg42S.mjs");
var Route$41 = createFileRoute("/corporate-gifting")({
	head: () => ({ meta: [
		{ title: "Corporate Gifting & Luxury Honey Hampers | Saurashtra Honey" },
		{
			name: "description",
			content: "Elevate your corporate gifting with premium natural honey hampers. Custom branding, greeting cards, and bulk delivery for clients and employees."
		},
		{
			property: "og:title",
			content: "Corporate Gifting — Saurashtra Honey"
		},
		{
			property: "og:description",
			content: "Thoughtful luxury honey gifts that leave a sweet impression."
		},
		{
			property: "og:type",
			content: "website"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$37, "component")
});
var $$splitComponentImporter$36 = () => import("./forgot-password-BfLLZ-ah.mjs");
var Route$40 = createFileRoute("/forgot-password")({
	head: () => ({ meta: [
		{ title: "Reset your password | Saurashtra Honey" },
		{
			name: "description",
			content: "Request a secure link to reset your Saurashtra Honey account password."
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$36, "component")
});
var $$splitComponentImporter$35 = () => import("./gift-hampers-DEWH6OHF.mjs");
var Route$39 = createFileRoute("/gift-hampers")({
	head: () => ({ meta: [
		{ title: "Luxury Honey Gift Hampers | Saurashtra Honey" },
		{
			name: "description",
			content: "Curated premium honey gift hampers for weddings, birthdays, return gifts, and festivals. Beautiful packaging with personalized notes and custom ribbons."
		},
		{
			property: "og:title",
			content: "Luxury Honey Gift Hampers"
		},
		{
			property: "og:description",
			content: "The perfect sweet gift for your loved ones."
		},
		{
			property: "og:type",
			content: "website"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$35, "component")
});
var $$splitComponentImporter$34 = () => import("./our-story-BaeqldE8.mjs");
var Route$38 = createFileRoute("/our-story")({
	head: () => ({ meta: [
		{ title: "Our Story — Rooted in Nature, Driven by Purpose | Saurashtra Honey" },
		{
			name: "description",
			content: "From the heart of Saurashtra to your home, our journey is one of passion, purity and purpose. Discover our ethical beekeeping and natural farms."
		},
		{
			property: "og:title",
			content: "Our Story — Saurashtra Honey"
		},
		{
			property: "og:description",
			content: "Rooted in Nature, Driven by Purpose."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$34, "component")
});
var $$splitComponentImporter$33 = () => import("./private-label-D-NooVpV.mjs");
var Route$37 = createFileRoute("/private-label")({
	head: () => ({ meta: [
		{ title: "Private Label Honey Manufacturing | Saurashtra Honey" },
		{
			name: "description",
			content: "Start your own honey brand with our end-to-end white label manufacturing. From raw honey sourcing to lab testing, bottle selection, and custom labeling."
		},
		{
			property: "og:title",
			content: "Private Label Honey Manufacturing"
		},
		{
			property: "og:description",
			content: "Your Brand, Our Pure Honey. Complete OEM Solutions."
		},
		{
			property: "og:type",
			content: "website"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$33, "component")
});
var $$splitComponentImporter$32 = () => import("./reset-password-CSlF74Wx.mjs");
var Route$36 = createFileRoute("/reset-password")({
	head: () => ({ meta: [
		{ title: "Set a new password | Saurashtra Honey" },
		{
			name: "description",
			content: "Choose a new password for your Saurashtra Honey account."
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$32, "component")
});
var DEFAULT_DISALLOW = [
	"/admin",
	"/account",
	"/checkout",
	"/order",
	"/lovable"
];
var Route$35 = createFileRoute("/robots.txt")({ server: { handlers: { GET: async () => {
	let disallow = DEFAULT_DISALLOW;
	let extra = "";
	try {
		const { createClient } = await import("../_libs/supabase__supabase-js.mjs").then((n) => n.n);
		const key = process.env.SUPABASE_PUBLISHABLE_KEY ?? "";
		if (process.env.SUPABASE_URL && key) {
			const { data } = await createClient(process.env.SUPABASE_URL, key, {
				auth: {
					persistSession: false,
					autoRefreshToken: false
				},
				global: { fetch: (input, init) => {
					const h = new Headers(init?.headers);
					if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
					h.set("apikey", key);
					return fetch(input, {
						...init,
						headers: h
					});
				} }
			}).from("app_settings").select("data").eq("id", 1).maybeSingle();
			const robots = (data?.data)?.robots;
			if (robots?.disallow_paths?.length) disallow = robots.disallow_paths;
			if (robots?.extra) extra = robots.extra;
		}
	} catch {}
	const body = [
		"User-agent: *",
		"Allow: /",
		...disallow.map((p) => `Disallow: ${p}`),
		extra.trim()
	].filter(Boolean).join("\n") + "\n";
	return new Response(body, { headers: {
		"Content-Type": "text/plain",
		"Cache-Control": "public, max-age=3600"
	} });
} } } });
var $$splitComponentImporter$31 = () => import("./shop-C1QSjShi.mjs");
var Route$34 = createFileRoute("/shop")({ component: lazyRouteComponent($$splitComponentImporter$31, "component") });
var BASE_URL = "";
var Route$33 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	const staticEntries = [
		{
			path: "/",
			changefreq: "weekly",
			priority: "1.0"
		},
		{
			path: "/shop",
			changefreq: "daily",
			priority: "0.9"
		},
		{
			path: "/our-story",
			changefreq: "monthly",
			priority: "0.6"
		},
		{
			path: "/bee-farming",
			changefreq: "monthly",
			priority: "0.6"
		},
		{
			path: "/become-a-partner",
			changefreq: "monthly",
			priority: "0.5"
		},
		{
			path: "/bulk-orders",
			changefreq: "monthly",
			priority: "0.5"
		},
		{
			path: "/contact",
			changefreq: "monthly",
			priority: "0.5"
		},
		{
			path: "/blog",
			changefreq: "weekly",
			priority: "0.7"
		},
		{
			path: "/auth",
			changefreq: "yearly",
			priority: "0.3"
		},
		{
			path: "/collections",
			changefreq: "weekly",
			priority: "0.8"
		},
		{
			path: "/collections/raw-honey",
			changefreq: "weekly",
			priority: "0.8"
		},
		{
			path: "/collections/beeswax",
			changefreq: "weekly",
			priority: "0.8"
		},
		{
			path: "/collections/bee-pollen",
			changefreq: "weekly",
			priority: "0.8"
		},
		{
			path: "/collections/beeswax-candles",
			changefreq: "weekly",
			priority: "0.8"
		},
		{
			path: "/collections/beauty",
			changefreq: "weekly",
			priority: "0.8"
		},
		{
			path: "/collections/gift-hampers",
			changefreq: "weekly",
			priority: "0.8"
		}
	];
	let dynamic = [];
	try {
		const { createClient } = await import("../_libs/supabase__supabase-js.mjs").then((n) => n.n);
		const key = process.env.SUPABASE_PUBLISHABLE_KEY ?? "";
		if (process.env.SUPABASE_URL && key) {
			const supa = createClient(process.env.SUPABASE_URL, key, {
				auth: {
					persistSession: false,
					autoRefreshToken: false
				},
				global: { fetch: (input, init) => {
					const h = new Headers(init?.headers);
					if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
					h.set("apikey", key);
					return fetch(input, {
						...init,
						headers: h
					});
				} }
			});
			const [{ data: products }, { data: posts }, { data: cats }] = await Promise.all([
				supa.from("products").select("slug").eq("status", "published"),
				supa.from("blog_posts").select("slug").eq("status", "published"),
				supa.from("categories").select("slug").eq("active", true)
			]);
			dynamic = [
				...(products ?? []).map((p) => ({
					path: `/product/${p.slug}`,
					changefreq: "weekly",
					priority: "0.8"
				})),
				...(posts ?? []).map((p) => ({
					path: `/blog/${p.slug}`,
					changefreq: "monthly",
					priority: "0.6"
				})),
				...(cats ?? []).map((c) => ({
					path: `/collections/${c.slug}`,
					changefreq: "weekly",
					priority: "0.7"
				}))
			];
		}
	} catch {}
	const xml = [
		`<?xml version="1.0" encoding="UTF-8"?>`,
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
		...[...staticEntries, ...dynamic].map((e) => [
			`  <url>`,
			`    <loc>${BASE_URL}${e.path}</loc>`,
			e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
			e.priority ? `    <priority>${e.priority}</priority>` : null,
			`  </url>`
		].filter(Boolean).join("\n")),
		`</urlset>`
	].join("\n");
	return new Response(xml, { headers: {
		"Content-Type": "application/xml",
		"Cache-Control": "public, max-age=3600"
	} });
} } } });
var $$splitComponentImporter$30 = () => import("./track-order-CLnVFm76.mjs");
var Route$32 = createFileRoute("/track-order")({
	head: () => ({ meta: [
		{ title: "Track Your Order — Saurashtra Honey" },
		{
			name: "description",
			content: "Track your Saurashtra Honey order status, shipping timeline and estimated delivery."
		},
		{
			property: "og:title",
			content: "Track Your Order — Saurashtra Honey"
		},
		{
			property: "og:description",
			content: "Check the status and delivery timeline of your Saurashtra Honey order."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$30, "component")
});
var $$splitComponentImporter$29 = () => import("./wishlist-BI_4Q6qG.mjs");
var Route$31 = createFileRoute("/wishlist")({
	head: () => ({ meta: [
		{ title: "My Wishlist — Saurashtra Honey" },
		{
			name: "description",
			content: "View and manage your saved raw honey varieties, gift sets, and single-flora reserves."
		},
		{
			property: "og:title",
			content: "My Wishlist — Saurashtra Honey"
		},
		{
			property: "og:description",
			content: "Your saved honeys from Saurashtra Honey Bee Farm."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$29, "component")
});
var $$splitComponentImporter$28 = () => import("./admin.index-DRrYEJZW.mjs");
var Route$30 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$28, "component") });
var $$splitComponentImporter$27 = () => import("./admin.audit-BWH76yWP.mjs");
var Route$29 = createFileRoute("/admin/audit")({ component: lazyRouteComponent($$splitComponentImporter$27, "component") });
var $$splitComponentImporter$26 = () => import("./admin.blog-Ba78pU7q.mjs");
var Route$28 = createFileRoute("/admin/blog")({ component: lazyRouteComponent($$splitComponentImporter$26, "component") });
var $$splitComponentImporter$25 = () => import("./admin.categories-MCRVp1v9.mjs");
var Route$27 = createFileRoute("/admin/categories")({ component: lazyRouteComponent($$splitComponentImporter$25, "component") });
var $$splitComponentImporter$24 = () => import("./admin.coupons-pZPl0bin.mjs");
var Route$26 = createFileRoute("/admin/coupons")({ component: lazyRouteComponent($$splitComponentImporter$24, "component") });
var $$splitComponentImporter$23 = () => import("./admin.customers-BbgEatjj.mjs");
var Route$25 = createFileRoute("/admin/customers")({ component: lazyRouteComponent($$splitComponentImporter$23, "component") });
var $$splitComponentImporter$22 = () => import("./admin.hero-CxbAlw_v.mjs");
var Route$24 = createFileRoute("/admin/hero")({ component: lazyRouteComponent($$splitComponentImporter$22, "component") });
var $$splitComponentImporter$21 = () => import("./admin.homepage-BPE1gvi-.mjs");
var Route$23 = createFileRoute("/admin/homepage")({ component: lazyRouteComponent($$splitComponentImporter$21, "component") });
var $$splitComponentImporter$20 = () => import("./admin.inventory-CPhD3TBt.mjs");
var Route$22 = createFileRoute("/admin/inventory")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
var $$splitComponentImporter$19 = () => import("./admin.loyalty-W_5-HLK2.mjs");
var Route$21 = createFileRoute("/admin/loyalty")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
var $$splitComponentImporter$18 = () => import("./admin.marketing-b7aXVr1c.mjs");
var Route$20 = createFileRoute("/admin/marketing")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./admin.media-Cl25pqN0.mjs");
var Route$19 = createFileRoute("/admin/media")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./admin.migrate-catalog-C-YG9s5f.mjs");
var Route$18 = createFileRoute("/admin/migrate-catalog")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./admin.newsletter-hYyxMozN.mjs");
var Route$17 = createFileRoute("/admin/newsletter")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./admin.orders-C-0YgeZQ.mjs");
var Route$16 = createFileRoute("/admin/orders")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./admin.products-Cg8UX3Xh.mjs");
var Route$15 = createFileRoute("/admin/products")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./admin.redirects-GzOx28ye.mjs");
var Route$14 = createFileRoute("/admin/redirects")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./admin.reviews-DmfOD1M5.mjs");
var Route$13 = createFileRoute("/admin/reviews")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./admin.settings-DP-J4U1b.mjs");
var Route$12 = createFileRoute("/admin/settings")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./admin.stories-Bh5R3COz.mjs");
var Route$11 = createFileRoute("/admin/stories")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./admin.submissions-CFtiVctj.mjs");
var Route$10 = createFileRoute("/admin/submissions")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./admin.users-B0BrHGtA.mjs");
var Route$9 = createFileRoute("/admin/users")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./admin.who-we-supply-R13TfB0o.mjs");
var Route$8 = createFileRoute("/admin/who-we-supply")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./auth_.callback-Dxrt_L4C.mjs");
var Route$7 = createFileRoute("/auth_/callback")({
	head: () => ({ meta: [{ title: "Signing you in… | Saurashtra Honey" }, {
		name: "robots",
		content: "noindex, nofollow"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./collections.index-DnVRrYZQ.mjs");
var Route$6 = createFileRoute("/collections/")({
	head: () => ({ meta: [{ title: "Artisanal Collections — Pure Raw Honey & Bee Products | Saurashtra Honey" }, {
		name: "description",
		content: "Explore our dedicated artisanal collections — Raw Honey, Beeswax, Bee Pollen, Beeswax Candles, Beauty & Personal Care, and Luxury Gift Hampers."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./admin.homepage_.announcements-BZe3xokY.mjs");
var Route$5 = createFileRoute("/admin/homepage_/announcements")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./admin.homepage_.categories-BTDtLgq1.mjs");
var Route$4 = createFileRoute("/admin/homepage_/categories")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./admin.homepage_.products-DIrS_WQy.mjs");
var Route$3 = createFileRoute("/admin/homepage_/products")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./admin.homepage_.trust-svNDrCC-.mjs");
var Route$2 = createFileRoute("/admin/homepage_/trust")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route$1 = createFileRoute("/api/public/health")({ server: { handlers: { GET: async () => {
	const started = Date.now();
	const report = {
		status: "ok",
		uptime_ms: 0,
		checks: {},
		version: process.env.APP_VERSION ?? "dev",
		timestamp: (/* @__PURE__ */ new Date()).toISOString()
	};
	const dbStart = Date.now();
	try {
		const url = process.env.SUPABASE_URL;
		const key = process.env.SUPABASE_PUBLISHABLE_KEY;
		if (!url || !key) throw new Error("missing_supabase_env");
		const res = await fetch(`${url}/rest/v1/app_settings?select=id&limit=1`, { headers: {
			apikey: key,
			Accept: "application/json"
		} });
		report.checks.database = {
			ok: res.ok,
			latency_ms: Date.now() - dbStart
		};
		if (!res.ok) report.checks.database.error = `http_${res.status}`;
	} catch (e) {
		report.checks.database = {
			ok: false,
			error: e.message
		};
	}
	report.uptime_ms = Date.now() - started;
	if (Object.values(report.checks).some((c) => !c.ok)) report.status = "degraded";
	return new Response(JSON.stringify(report, null, 2), {
		status: report.status === "ok" ? 200 : 503,
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "no-store"
		}
	});
} } } });
var OWNER_EMAIL = "saurashtra.honey@gmail.com";
var Route = createFileRoute("/api/public/submissions")({ server: { handlers: { POST: async ({ request }) => {
	try {
		const payload = await request.json().catch(() => ({}));
		const apiKey = process.env.LOVABLE_API_KEY;
		const senderDomain = process.env.LOVABLE_EMAIL_SENDER_DOMAIN;
		if (!apiKey || !senderDomain) return Response.json({
			ok: true,
			emailed: false,
			reason: "email_domain_not_configured"
		});
		const lines = Object.entries(payload).filter(([, v]) => v !== void 0 && v !== null && v !== "").map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;font-weight:600">${k}</td><td style="padding:4px 0">${typeof v === "object" ? JSON.stringify(v) : String(v)}</td></tr>`).join("");
		const subject = `New ${payload.form_type ?? "form"} submission — Saurashtra Honey`;
		const html = `<div style="font-family:Arial,sans-serif;color:#1b3a2b"><h2 style="font-family:Georgia,serif">New submission</h2><table>${lines}</table></div>`;
		const res = await fetch("https://api.lovable.app/v1/emails/send", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				from: `Saurashtra Honey <notify@${senderDomain}>`,
				to: OWNER_EMAIL,
				subject,
				html
			})
		});
		return Response.json({
			ok: true,
			emailed: res.ok
		});
	} catch {
		return Response.json({
			ok: true,
			emailed: false
		});
	}
} } } });
var IndexRoute = Route$61.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$51
});
var AccountRoute = Route$52.update({
	id: "/account",
	path: "/account",
	getParentRoute: () => Route$51
});
var AdminRoute = Route$50.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$51
});
var AuthRoute = Route$49.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$51
});
var BecomeAPartnerRoute = Route$48.update({
	id: "/become-a-partner",
	path: "/become-a-partner",
	getParentRoute: () => Route$51
});
var BeeFarmingRoute = Route$47.update({
	id: "/bee-farming",
	path: "/bee-farming",
	getParentRoute: () => Route$51
});
var BlogRoute = Route$54.update({
	id: "/blog",
	path: "/blog",
	getParentRoute: () => Route$51
});
var BulkGiftingRoute = Route$46.update({
	id: "/bulk-gifting",
	path: "/bulk-gifting",
	getParentRoute: () => Route$51
});
var BulkOrdersRoute = Route$45.update({
	id: "/bulk-orders",
	path: "/bulk-orders",
	getParentRoute: () => Route$51
});
var CheckoutRoute = Route$44.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$51
});
var CompareRoute = Route$43.update({
	id: "/compare",
	path: "/compare",
	getParentRoute: () => Route$51
});
var ContactRoute = Route$42.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$51
});
var CorporateGiftingRoute = Route$41.update({
	id: "/corporate-gifting",
	path: "/corporate-gifting",
	getParentRoute: () => Route$51
});
var ForgotPasswordRoute = Route$40.update({
	id: "/forgot-password",
	path: "/forgot-password",
	getParentRoute: () => Route$51
});
var GiftHampersRoute = Route$39.update({
	id: "/gift-hampers",
	path: "/gift-hampers",
	getParentRoute: () => Route$51
});
var OurStoryRoute = Route$38.update({
	id: "/our-story",
	path: "/our-story",
	getParentRoute: () => Route$51
});
var PrivateLabelRoute = Route$37.update({
	id: "/private-label",
	path: "/private-label",
	getParentRoute: () => Route$51
});
var ResetPasswordRoute = Route$36.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$51
});
var RobotsDottxtRoute = Route$35.update({
	id: "/robots.txt",
	path: "/robots.txt",
	getParentRoute: () => Route$51
});
var ShopRoute = Route$34.update({
	id: "/shop",
	path: "/shop",
	getParentRoute: () => Route$51
});
var SitemapDotxmlRoute = Route$33.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$51
});
var TrackOrderRoute = Route$32.update({
	id: "/track-order",
	path: "/track-order",
	getParentRoute: () => Route$51
});
var WishlistRoute = Route$31.update({
	id: "/wishlist",
	path: "/wishlist",
	getParentRoute: () => Route$51
});
var AdminIndexRoute = Route$30.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var AdminAuditRoute = Route$29.update({
	id: "/audit",
	path: "/audit",
	getParentRoute: () => AdminRoute
});
var AdminBlogRoute = Route$28.update({
	id: "/blog",
	path: "/blog",
	getParentRoute: () => AdminRoute
});
var AdminCategoriesRoute = Route$27.update({
	id: "/categories",
	path: "/categories",
	getParentRoute: () => AdminRoute
});
var AdminCouponsRoute = Route$26.update({
	id: "/coupons",
	path: "/coupons",
	getParentRoute: () => AdminRoute
});
var AdminCustomersRoute = Route$25.update({
	id: "/customers",
	path: "/customers",
	getParentRoute: () => AdminRoute
});
var AdminHeroRoute = Route$24.update({
	id: "/hero",
	path: "/hero",
	getParentRoute: () => AdminRoute
});
var AdminHomepageRoute = Route$23.update({
	id: "/homepage",
	path: "/homepage",
	getParentRoute: () => AdminRoute
});
var AdminInstagramRoute = Route$53.update({
	id: "/instagram",
	path: "/instagram",
	getParentRoute: () => AdminRoute
});
var AdminInventoryRoute = Route$22.update({
	id: "/inventory",
	path: "/inventory",
	getParentRoute: () => AdminRoute
});
var AdminLoyaltyRoute = Route$21.update({
	id: "/loyalty",
	path: "/loyalty",
	getParentRoute: () => AdminRoute
});
var AdminMarketingRoute = Route$20.update({
	id: "/marketing",
	path: "/marketing",
	getParentRoute: () => AdminRoute
});
var AdminMediaRoute = Route$19.update({
	id: "/media",
	path: "/media",
	getParentRoute: () => AdminRoute
});
var AdminMigrateCatalogRoute = Route$18.update({
	id: "/migrate-catalog",
	path: "/migrate-catalog",
	getParentRoute: () => AdminRoute
});
var AdminNewsletterRoute = Route$17.update({
	id: "/newsletter",
	path: "/newsletter",
	getParentRoute: () => AdminRoute
});
var AdminOrdersRoute = Route$16.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => AdminRoute
});
var AdminProductsRoute = Route$15.update({
	id: "/products",
	path: "/products",
	getParentRoute: () => AdminRoute
});
var AdminRedirectsRoute = Route$14.update({
	id: "/redirects",
	path: "/redirects",
	getParentRoute: () => AdminRoute
});
var AdminReviewsRoute = Route$13.update({
	id: "/reviews",
	path: "/reviews",
	getParentRoute: () => AdminRoute
});
var AdminSettingsRoute = Route$12.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AdminRoute
});
var AdminStoriesRoute = Route$11.update({
	id: "/stories",
	path: "/stories",
	getParentRoute: () => AdminRoute
});
var AdminSubmissionsRoute = Route$10.update({
	id: "/submissions",
	path: "/submissions",
	getParentRoute: () => AdminRoute
});
var AdminUsersRoute = Route$9.update({
	id: "/users",
	path: "/users",
	getParentRoute: () => AdminRoute
});
var AdminWhoWeSupplyRoute = Route$8.update({
	id: "/who-we-supply",
	path: "/who-we-supply",
	getParentRoute: () => AdminRoute
});
var AuthCallbackRoute = Route$7.update({
	id: "/auth_/callback",
	path: "/auth/callback",
	getParentRoute: () => Route$51
});
var BlogSlugRoute = Route$55.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => BlogRoute
});
var CollectionsIndexRoute = Route$6.update({
	id: "/collections/",
	path: "/collections/",
	getParentRoute: () => Route$51
});
var CollectionsSlugRoute = Route$56.update({
	id: "/collections/$slug",
	path: "/collections/$slug",
	getParentRoute: () => Route$51
});
var OrderIdRoute = Route$59.update({
	id: "/order/$id",
	path: "/order/$id",
	getParentRoute: () => Route$51
});
var ProductSlugRoute = Route$60.update({
	id: "/product/$slug",
	path: "/product/$slug",
	getParentRoute: () => Route$51
});
var ShopIndexRoute = Route$62.update({
	id: "/",
	path: "/",
	getParentRoute: () => ShopRoute
});
var ShopSlugRoute = Route$63.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => ShopRoute
});
var AdminHomepageAnnouncementsRoute = Route$5.update({
	id: "/homepage_/announcements",
	path: "/homepage/announcements",
	getParentRoute: () => AdminRoute
});
var AdminHomepageCategoriesRoute = Route$4.update({
	id: "/homepage_/categories",
	path: "/homepage/categories",
	getParentRoute: () => AdminRoute
});
var AdminHomepageProductsRoute = Route$3.update({
	id: "/homepage_/products",
	path: "/homepage/products",
	getParentRoute: () => AdminRoute
});
var AdminHomepageTrustRoute = Route$2.update({
	id: "/homepage_/trust",
	path: "/homepage/trust",
	getParentRoute: () => AdminRoute
});
var ApiPublicHealthRoute = Route$1.update({
	id: "/api/public/health",
	path: "/api/public/health",
	getParentRoute: () => Route$51
});
var ApiPublicSubmissionsRoute = Route.update({
	id: "/api/public/submissions",
	path: "/api/public/submissions",
	getParentRoute: () => Route$51
});
var NewsletterConfirmTokenRoute = Route$57.update({
	id: "/newsletter/confirm/$token",
	path: "/newsletter/confirm/$token",
	getParentRoute: () => Route$51
});
var NewsletterUnsubscribeTokenRoute = Route$58.update({
	id: "/newsletter/unsubscribe/$token",
	path: "/newsletter/unsubscribe/$token",
	getParentRoute: () => Route$51
});
var AdminRouteChildren = {
	AdminAuditRoute,
	AdminBlogRoute,
	AdminCategoriesRoute,
	AdminCouponsRoute,
	AdminCustomersRoute,
	AdminHeroRoute,
	AdminHomepageRoute,
	AdminInstagramRoute,
	AdminInventoryRoute,
	AdminLoyaltyRoute,
	AdminMarketingRoute,
	AdminMediaRoute,
	AdminMigrateCatalogRoute,
	AdminNewsletterRoute,
	AdminOrdersRoute,
	AdminProductsRoute,
	AdminRedirectsRoute,
	AdminReviewsRoute,
	AdminSettingsRoute,
	AdminStoriesRoute,
	AdminSubmissionsRoute,
	AdminUsersRoute,
	AdminWhoWeSupplyRoute,
	AdminIndexRoute,
	AdminHomepageAnnouncementsRoute,
	AdminHomepageCategoriesRoute,
	AdminHomepageProductsRoute,
	AdminHomepageTrustRoute
};
var AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
var BlogRouteChildren = { BlogSlugRoute };
var BlogRouteWithChildren = BlogRoute._addFileChildren(BlogRouteChildren);
var ShopRouteChildren = {
	ShopSlugRoute,
	ShopIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AccountRoute,
	AdminRoute: AdminRouteWithChildren,
	AuthRoute,
	BecomeAPartnerRoute,
	BeeFarmingRoute,
	BlogRoute: BlogRouteWithChildren,
	BulkGiftingRoute,
	BulkOrdersRoute,
	CheckoutRoute,
	CompareRoute,
	ContactRoute,
	CorporateGiftingRoute,
	ForgotPasswordRoute,
	GiftHampersRoute,
	OurStoryRoute,
	PrivateLabelRoute,
	ResetPasswordRoute,
	RobotsDottxtRoute,
	ShopRoute: ShopRoute._addFileChildren(ShopRouteChildren),
	SitemapDotxmlRoute,
	TrackOrderRoute,
	WishlistRoute,
	AuthCallbackRoute,
	CollectionsSlugRoute,
	OrderIdRoute,
	ProductSlugRoute,
	CollectionsIndexRoute,
	ApiPublicHealthRoute,
	ApiPublicSubmissionsRoute,
	NewsletterConfirmTokenRoute,
	NewsletterUnsubscribeTokenRoute
};
var routeTree = Route$51._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
