import { i as __toESM } from "../_runtime.mjs";
import { i as getVariantByLabel } from "./products-CxldZzZM.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-Bp2wgR53.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Ctx = (0, import_react.createContext)(null);
var KEY = "sh_cart_v1";
var SAVED_KEY = "sh_saved_v1";
var COUPON_KEY = "sh_coupon_v1";
function CartProvider({ children }) {
	const [items, setItems] = (0, import_react.useState)([]);
	const [saved, setSaved] = (0, import_react.useState)([]);
	const [coupon, setCoupon] = (0, import_react.useState)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(KEY);
			if (raw) setItems(JSON.parse(raw));
			const rawS = localStorage.getItem(SAVED_KEY);
			if (rawS) setSaved(JSON.parse(rawS));
			const rawC = localStorage.getItem(COUPON_KEY);
			if (rawC) setCoupon(JSON.parse(rawC));
		} catch {}
		setHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (hydrated) localStorage.setItem(KEY, JSON.stringify(items));
	}, [items, hydrated]);
	(0, import_react.useEffect)(() => {
		if (hydrated) localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
	}, [saved, hydrated]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		if (coupon) localStorage.setItem(COUPON_KEY, JSON.stringify(coupon));
		else localStorage.removeItem(COUPON_KEY);
	}, [coupon, hydrated]);
	const applyCoupon = (0, import_react.useCallback)((c) => setCoupon(c), []);
	const value = (0, import_react.useMemo)(() => {
		const subtotal = items.reduce((n, i) => n + i.qty * i.price, 0);
		const subtotalPaise = subtotal * 100;
		let discountPaise = 0;
		if (coupon && !coupon.free_shipping) discountPaise = Math.min(coupon.discount_paise, subtotalPaise);
		return {
			items,
			saved,
			open,
			setOpen,
			add: (p, size, qty = 1, variant) => {
				const s = size ?? p.sizes[0];
				const v = variant ?? getVariantByLabel(p, s);
				const itemPrice = v.price ?? p.price;
				setItems((prev) => {
					const idx = prev.findIndex((i) => i.slug === p.slug && i.size === s);
					if (idx >= 0) {
						const next = [...prev];
						const newQty = next[idx].qty + qty;
						const cappedQty = v.stock !== void 0 ? Math.min(newQty, v.stock) : newQty;
						next[idx] = {
							...next[idx],
							qty: cappedQty,
							price: itemPrice,
							variantId: v.id,
							sku: v.sku,
							stock: v.stock
						};
						return next;
					}
					const initialQty = v.stock !== void 0 ? Math.min(qty, v.stock) : qty;
					return [...prev, {
						slug: p.slug,
						name: p.name,
						image: p.image,
						size: s,
						price: itemPrice,
						qty: initialQty,
						variantId: v.id,
						sku: v.sku,
						stock: v.stock
					}];
				});
				setOpen(true);
			},
			remove: (slug, size) => setItems((prev) => prev.filter((i) => !(i.slug === slug && i.size === size))),
			updateQty: (slug, size, qty) => setItems((prev) => prev.map((i) => {
				if (i.slug === slug && i.size === size) {
					const clamped = Math.max(1, qty);
					const maxQty = i.stock !== void 0 ? Math.min(clamped, i.stock) : clamped;
					return {
						...i,
						qty: maxQty
					};
				}
				return i;
			})),
			clear: () => {
				setItems([]);
				setCoupon(null);
			},
			moveToSaved: (slug, size) => setItems((prev) => {
				const it = prev.find((i) => i.slug === slug && i.size === size);
				if (!it) return prev;
				setSaved((s) => s.some((x) => x.slug === slug && x.size === size) ? s : [...s, {
					...it,
					qty: 1
				}]);
				return prev.filter((i) => !(i.slug === slug && i.size === size));
			}),
			moveToCart: (slug, size) => setSaved((prev) => {
				const it = prev.find((i) => i.slug === slug && i.size === size);
				if (!it) return prev;
				setItems((cur) => {
					const idx = cur.findIndex((i) => i.slug === slug && i.size === size);
					if (idx >= 0) {
						const next = [...cur];
						next[idx] = {
							...next[idx],
							qty: next[idx].qty + 1
						};
						return next;
					}
					return [...cur, {
						...it,
						qty: 1
					}];
				});
				return prev.filter((i) => !(i.slug === slug && i.size === size));
			}),
			removeSaved: (slug, size) => setSaved((prev) => prev.filter((i) => !(i.slug === slug && i.size === size))),
			coupon,
			applyCoupon,
			count: items.reduce((n, i) => n + i.qty, 0),
			subtotal,
			subtotalPaise,
			discount: discountPaise / 100,
			shippingWaived: !!coupon?.free_shipping
		};
	}, [
		items,
		saved,
		open,
		coupon,
		applyCoupon
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value,
		children
	});
}
function useCart() {
	const c = (0, import_react.useContext)(Ctx);
	if (!c) throw new Error("useCart must be used inside <CartProvider>");
	return c;
}
//#endregion
export { useCart as n, CartProvider as t };
