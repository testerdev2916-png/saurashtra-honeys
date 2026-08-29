import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useCart } from "./cart-Bp2wgR53.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { $t as Bell, C as ShieldCheck, N as Plus, Pt as Clock, Q as Lock, T as Settings, V as Package, X as Mail, Y as MapPin, Z as LogOut, c as User, d as TriangleAlert, mt as Heart, ot as KeyRound, p as Trash2, tn as Award, v as Star } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as supabase } from "./client-CiOF68Zx.mjs";
import { n as useAuth } from "./auth-L3PDI3kX.mjs";
import { c as useWishlist } from "./collection-helpers-DAdv5muE.mjs";
import { n as fetchProducts } from "./product-catalog-DsxAkRUU.mjs";
import { t as Route } from "./account-TQP5sZXh.mjs";
import { n as SiteLayout, t as SectionEyebrow } from "./Layout-BROfU7ZF.mjs";
import { n as useRecentlyViewed } from "./recently-viewed-vyH4vNwq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-G245PqKV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	[
		"dashboard",
		Award,
		"Dashboard"
	],
	[
		"orders",
		Package,
		"Orders"
	],
	[
		"wishlist",
		Heart,
		"Wishlist"
	],
	[
		"recent",
		Clock,
		"Recently viewed"
	],
	[
		"reviews",
		Star,
		"My reviews"
	],
	[
		"notifications",
		Bell,
		"Notifications"
	],
	[
		"addresses",
		MapPin,
		"Addresses"
	],
	[
		"profile",
		User,
		"Profile"
	],
	[
		"password",
		KeyRound,
		"Password"
	],
	[
		"newsletter",
		Mail,
		"Newsletter"
	],
	[
		"settings",
		Settings,
		"Settings"
	]
];
function Account() {
	const search = Route.useSearch();
	const { user, loading, signOut, isAdmin } = useAuth();
	const navigate = useNavigate();
	const [tab, setTab] = (0, import_react.useState)(search.tab ?? "dashboard");
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [addresses, setAddresses] = (0, import_react.useState)([]);
	const [orders, setOrders] = (0, import_react.useState)([]);
	const wl = useWishlist();
	const [reviews, setReviews] = (0, import_react.useState)([]);
	const [notifications, setNotifications] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		setTab(search.tab ?? "dashboard");
	}, [search.tab]);
	(0, import_react.useEffect)(() => {
		if (!loading && !user) navigate({
			to: "/auth",
			search: { redirect: "/account" }
		});
	}, [
		user,
		loading,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		if (user) loadAll();
	}, [user]);
	async function loadAll() {
		if (!user) return;
		const [p, a, o, r, n] = await Promise.all([
			supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
			supabase.from("addresses").select("*").eq("user_id", user.id).order("is_default", { ascending: false }).order("created_at", { ascending: false }),
			supabase.from("orders").select("id,order_number,created_at,status,total_paise,payment_method,items,tracking_number").order("created_at", { ascending: false }).limit(50),
			supabase.from("reviews").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
			supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50)
		]);
		setProfile(p.data ?? {
			id: user.id,
			full_name: user.user_metadata?.full_name ?? "",
			phone: "",
			newsletter_opt_in: false,
			email: user.email ?? "",
			avatar_url: null
		});
		setAddresses(a.data ?? []);
		setOrders(o.data ?? []);
		setReviews(r.data ?? []);
		setNotifications(n.data ?? []);
	}
	function goto(t) {
		setTab(t);
		navigate({ search: { tab: t } });
	}
	if (loading || !user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-page py-24 text-center text-muted-foreground",
		children: "Loading…"
	}) });
	const unreadCount = notifications.filter((n) => !n.read).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-6 md:py-10 grid md:grid-cols-[250px_1fr] gap-6 md:gap-10 w-full max-w-full box-border px-4 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "md:sticky md:top-24 md:self-start space-y-1 w-full max-w-full min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-cream-deep/60 border border-border/80 rounded-2xl p-4 sm:p-5 mb-5 shadow-xs w-full max-w-full box-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground font-medium",
						children: "Signed in as"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-bold text-espresso text-sm mt-0.5 break-all [overflow-wrap:anywhere] leading-snug",
						children: user.email
					}),
					isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin",
						className: "mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-burnt-orange hover:underline",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3.5 shrink-0" }),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ADMIN DASHBOARD" })
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:block flex items-center overflow-x-auto no-scrollbar gap-2 pb-3 md:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 w-full max-w-full",
				children: [NAV.map(([k, Icon, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => goto(k),
					className: `flex-none md:w-full inline-flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm whitespace-nowrap font-semibold transition-all ${tab === k ? "bg-espresso text-cream shadow-sm" : "text-espresso bg-white/60 md:bg-transparent hover:bg-cream/70 border border-border/40 md:border-transparent"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }),
						k === "notifications" && unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-auto bg-destructive text-white rounded-full text-[10px] px-1.5 py-0.5 font-bold",
							children: unreadCount
						}),
						k === "wishlist" && wl.count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-auto text-[10px] font-bold text-muted-foreground",
							children: wl.count
						})
					]
				}, k)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: async () => {
						await signOut();
						navigate({ to: "/" });
					},
					className: "flex-none md:w-full inline-flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 whitespace-nowrap transition-colors border border-border/40 md:border-transparent",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4 shrink-0" }),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sign out" })
					]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "min-w-0",
			children: [
				tab === "dashboard" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardTab, {
					profile,
					orders,
					wishlistCount: wl.count,
					unreadCount,
					onGo: goto
				}),
				tab === "profile" && profile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileTab, {
					profile,
					onSaved: loadAll
				}),
				tab === "password" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordTab, {}),
				tab === "addresses" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddressesTab, {
					addresses,
					userId: user.id,
					profileName: profile?.full_name ?? "",
					onChanged: loadAll
				}),
				tab === "orders" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrdersTab, { orders }),
				tab === "wishlist" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WishlistTab, {}),
				tab === "recent" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecentlyViewedTab, {}),
				tab === "reviews" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewsTab, {
					reviews,
					onChanged: loadAll
				}),
				tab === "notifications" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationsTab, {
					notifications,
					onChanged: loadAll
				}),
				tab === "newsletter" && profile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsletterTab, {
					profile,
					onSaved: loadAll
				}),
				tab === "settings" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsTab, {
					email: user.email ?? "",
					onSignedOut: async () => {
						await signOut();
						navigate({ to: "/" });
					}
				})
			]
		})]
	}) });
}
function DashboardTab({ profile, orders, wishlistCount, unreadCount, onGo }) {
	const totalSpent = orders.filter((o) => o.status !== "cancelled").reduce((n, o) => n + o.total_paise, 0);
	const active = orders.filter((o) => [
		"pending",
		"paid",
		"confirmed",
		"processing",
		"packed",
		"shipped"
	].includes(o.status));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionEyebrow, { children: "Dashboard" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "mt-1 font-serif text-3xl font-bold text-espresso",
				children: ["Welcome", profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Orders",
						value: String(orders.length),
						onClick: () => onGo("orders")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Wishlist",
						value: String(wishlistCount),
						onClick: () => onGo("wishlist")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total spent",
						value: `₹${(totalSpent / 100).toLocaleString()}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Unread",
						value: String(unreadCount),
						onClick: () => onGo("notifications")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid md:grid-cols-2 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white border border-border/80 rounded-2xl p-6 shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] tracking-widest font-bold text-burnt-orange uppercase mb-4",
						children: "Active orders"
					}), active.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Nothing on the way right now."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-3",
						children: active.slice(0, 3).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/order/$id",
							params: { id: o.id },
							className: "flex justify-between items-center bg-cream-deep/40 rounded-xl p-3.5 text-sm hover:bg-cream-deep/80 transition-colors border border-border/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs font-bold text-espresso",
									children: o.order_number ?? o.id.slice(0, 8)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase text-burnt-orange font-bold tracking-wider px-2 py-0.5 bg-burnt-orange/10 rounded",
									children: o.status
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-serif font-bold text-espresso",
									children: ["₹", (o.total_paise / 100).toFixed(0)]
								})
							]
						}) }, o.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-espresso text-cream rounded-2xl p-6 flex flex-col justify-between shadow-lg border border-white/10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] tracking-widest font-bold text-burnt-orange uppercase",
							children: "Reward points"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-serif text-4xl font-bold mt-2",
							children: "Coming soon"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-cream/75 mt-1.5 leading-relaxed",
							children: "Earn points on every order and redeem them for exclusive discounts."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						className: "mt-6 inline-flex items-center justify-center bg-burnt-orange text-white rounded-xl px-5 py-3 text-xs font-bold tracking-widest hover:bg-terracotta transition-all shadow-md",
						children: "SHOP NOW"
					})]
				})]
			})
		]
	});
}
function StatCard({ label, value, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		disabled: !onClick,
		className: `text-left bg-white border border-border/80 rounded-2xl p-5 shadow-xs transition-all ${onClick ? "hover:border-burnt-orange hover:shadow-soft cursor-pointer" : "cursor-default"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] tracking-widest font-bold text-burnt-orange uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1.5 font-serif text-2xl font-bold text-espresso",
			children: value
		})]
	});
}
function ProfileTab({ profile, onSaved }) {
	const [form, setForm] = (0, import_react.useState)({
		full_name: profile.full_name ?? "",
		phone: profile.phone ?? ""
	});
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function save() {
		setBusy(true);
		try {
			const { error } = await supabase.from("profiles").upsert({
				id: profile.id,
				full_name: form.full_name.trim(),
				phone: form.phone.trim(),
				email: profile.email
			});
			if (error) throw error;
			toast.success("Profile updated");
			onSaved();
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionEyebrow, { children: "Profile" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-2 font-serif text-3xl text-forest-dark",
			children: "Your details"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 bg-card border border-border rounded-2xl p-5 md:p-6 max-w-lg space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldWrap, {
					label: "Full name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.full_name,
						onChange: (e) => setForm({
							...form,
							full_name: e.target.value
						}),
						className: inpCls
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldWrap, {
					label: "Phone",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.phone,
						onChange: (e) => setForm({
							...form,
							phone: e.target.value
						}),
						className: inpCls
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldWrap, {
					label: "Email",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: profile.email ?? "",
						disabled: true,
						className: inpCls + " opacity-60"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					disabled: busy,
					onClick: save,
					className: "mt-2 bg-forest-dark text-cream rounded-lg px-6 py-2.5 text-xs font-bold tracking-widest hover:bg-forest disabled:opacity-60",
					children: busy ? "SAVING…" : "SAVE"
				})
			]
		})
	] });
}
function PasswordTab() {
	const [pw, setPw] = (0, import_react.useState)({
		next: "",
		confirm: ""
	});
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function save(e) {
		e.preventDefault();
		if (pw.next.length < 8) {
			toast.error("Use at least 8 characters");
			return;
		}
		if (pw.next !== pw.confirm) {
			toast.error("Passwords don't match");
			return;
		}
		setBusy(true);
		try {
			const { error } = await supabase.auth.updateUser({ password: pw.next });
			if (error) throw error;
			toast.success("Password updated");
			setPw({
				next: "",
				confirm: ""
			});
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionEyebrow, { children: "Password" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-2 font-serif text-3xl text-forest-dark",
			children: "Change password"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: save,
			className: "mt-6 bg-card border border-border rounded-2xl p-5 md:p-6 max-w-lg space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldWrap, {
					label: "New password",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "password",
						autoComplete: "new-password",
						value: pw.next,
						onChange: (e) => setPw({
							...pw,
							next: e.target.value
						}),
						className: inpCls
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldWrap, {
					label: "Confirm new password",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "password",
						autoComplete: "new-password",
						value: pw.confirm,
						onChange: (e) => setPw({
							...pw,
							confirm: e.target.value
						}),
						className: inpCls
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					disabled: busy,
					className: "mt-2 bg-forest-dark text-cream rounded-lg px-6 py-2.5 text-xs font-bold tracking-widest hover:bg-forest disabled:opacity-60 inline-flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-3.5" }),
						" ",
						busy ? "UPDATING…" : "UPDATE PASSWORD"
					]
				})
			]
		})
	] });
}
function AddressesTab({ addresses, userId, profileName, onChanged }) {
	const empty = {
		label: "Home",
		full_name: profileName,
		line1: "",
		line2: "",
		city: "",
		state: "",
		pincode: "",
		country: "India",
		phone: "",
		is_default: addresses.length === 0
	};
	const [form, setForm] = (0, import_react.useState)(empty);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function add() {
		if (!form.line1 || !form.city || !form.state || !form.pincode) {
			toast.error("Fill line 1, city, state and pincode");
			return;
		}
		setBusy(true);
		try {
			if (form.is_default) await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
			const { error } = await supabase.from("addresses").insert({
				...form,
				user_id: userId
			});
			if (error) throw error;
			setForm(empty);
			toast.success("Address added");
			onChanged();
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusy(false);
		}
	}
	async function del(id) {
		const { error } = await supabase.from("addresses").delete().eq("id", id);
		if (error) toast.error(error.message);
		else {
			toast.success("Deleted");
			onChanged();
		}
	}
	async function setDefault(id) {
		await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
		await supabase.from("addresses").update({ is_default: true }).eq("id", id);
		toast.success("Default address updated");
		onChanged();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionEyebrow, { children: "Shipping addresses" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-2 font-serif text-3xl text-forest-dark",
			children: "Where should we deliver?"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-3",
			children: [addresses.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm text-muted-foreground",
				children: "No addresses yet. Add one below."
			}), addresses.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-card border border-border rounded-xl p-4 flex justify-between items-start gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold text-gold-deep",
								children: a.label ?? "ADDRESS"
							}), a.is_default && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold bg-forest-dark text-cream rounded px-1.5 py-0.5",
								children: "DEFAULT"
							})]
						}),
						a.full_name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-sm font-medium text-forest-dark",
							children: a.full_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm",
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
						}),
						a.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: ["📞 ", a.phone]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-end gap-2 shrink-0",
					children: [!a.is_default && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setDefault(a.id),
						className: "text-[10px] font-bold tracking-widest text-forest-dark hover:text-gold-deep",
						children: "SET DEFAULT"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						"aria-label": "Delete address",
						onClick: () => del(a.id),
						className: "text-destructive hover:text-destructive/80",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
					})]
				})]
			}, a.id))]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 bg-cream rounded-2xl p-5 md:p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-semibold text-forest-dark flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add address"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid md:grid-cols-2 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							placeholder: "Label (Home, Office)",
							value: form.label,
							onChange: (e) => setForm({
								...form,
								label: e.target.value
							}),
							className: inpCls
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							placeholder: "Recipient name",
							value: form.full_name,
							onChange: (e) => setForm({
								...form,
								full_name: e.target.value
							}),
							className: inpCls
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							placeholder: "Phone",
							value: form.phone,
							onChange: (e) => setForm({
								...form,
								phone: e.target.value
							}),
							className: inpCls
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							placeholder: "Country",
							value: form.country,
							onChange: (e) => setForm({
								...form,
								country: e.target.value
							}),
							className: inpCls
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							placeholder: "Address line 1 *",
							value: form.line1,
							onChange: (e) => setForm({
								...form,
								line1: e.target.value
							}),
							className: `md:col-span-2 ${inpCls}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							placeholder: "Address line 2",
							value: form.line2,
							onChange: (e) => setForm({
								...form,
								line2: e.target.value
							}),
							className: `md:col-span-2 ${inpCls}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							placeholder: "City *",
							value: form.city,
							onChange: (e) => setForm({
								...form,
								city: e.target.value
							}),
							className: inpCls
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							placeholder: "State *",
							value: form.state,
							onChange: (e) => setForm({
								...form,
								state: e.target.value
							}),
							className: inpCls
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							placeholder: "Pincode *",
							value: form.pincode,
							onChange: (e) => setForm({
								...form,
								pincode: e.target.value
							}),
							className: inpCls
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-xs text-forest-dark md:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: form.is_default,
								onChange: (e) => setForm({
									...form,
									is_default: e.target.checked
								})
							}), " Make default address"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					disabled: busy,
					onClick: add,
					className: "mt-3 bg-forest-dark text-cream rounded-lg px-5 py-2.5 text-xs font-bold tracking-widest hover:bg-forest disabled:opacity-60",
					children: busy ? "SAVING…" : "ADD ADDRESS"
				})
			]
		})
	] });
}
function OrdersTab({ orders }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionEyebrow, { children: "Order history" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-2 font-serif text-3xl text-forest-dark",
			children: "Your orders"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-3",
			children: [orders.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-sm text-muted-foreground",
				children: ["No orders yet. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop",
					className: "text-gold-deep",
					children: "Start shopping →"
				})]
			}), orders.map((o) => {
				const items = o.items ?? [];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/order/$id",
					params: { id: o.id },
					className: "bg-card border border-border rounded-xl p-4 flex justify-between flex-wrap gap-3 hover:border-gold-deep transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground font-mono",
								children: [
									o.order_number ?? `#${o.id.slice(0, 8)}`,
									" • ",
									new Date(o.created_at).toLocaleDateString()
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-sm font-medium text-forest-dark line-clamp-2",
								children: items.map((i) => `${i.name} (${i.size}) × ${i.qty}`).join(", ")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-xs uppercase text-muted-foreground",
								children: [o.payment_method, o.tracking_number && ` · Tracking ${o.tracking_number}`]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-lg font-serif text-forest-dark",
							children: ["₹", (o.total_paise / 100).toFixed(0)]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-bold tracking-wider uppercase bg-gold/20 text-gold-deep rounded px-2 py-1",
							children: o.status
						})]
					})]
				}, o.id);
			})]
		})
	] });
}
function WishlistTab() {
	const wl = useWishlist();
	const { add } = useCart();
	const [all, setAll] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		fetchProducts().then((r) => {
			if (r.length) setAll(r);
		});
	}, []);
	const items = (0, import_react.useMemo)(() => {
		return all.filter((p) => wl.has(p.slug));
	}, [
		all,
		wl.slugs,
		wl
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionEyebrow, { children: "Wishlist" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
			className: "mt-2 font-serif text-3xl text-forest-dark",
			children: [
				"Saved for later (",
				items.length,
				")"
			]
		})] }), items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: async () => {
				if (confirm("Clear all items from your wishlist?")) {
					await wl.clear();
					toast.success("Wishlist cleared");
				}
			},
			className: "text-xs font-bold tracking-widest text-muted-foreground hover:text-destructive border border-border px-3 py-1.5 rounded-lg",
			children: "CLEAR ALL"
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
		children: [items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "col-span-full text-sm text-muted-foreground",
			children: "Tap the heart on any product to save it here."
		}), items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-card border border-border rounded-xl overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/product/$slug",
				params: { slug: p.slug },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: p.image,
					alt: p.name,
					className: "w-full aspect-square object-cover"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-serif text-sm text-forest-dark leading-tight line-clamp-2",
						children: p.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 text-xs text-muted-foreground",
						children: [
							"₹",
							p.price,
							p.priceMax ? ` – ₹${p.priceMax}` : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 grid grid-cols-[1fr_auto] gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								add(p);
								toast.success(`Added ${p.name}`);
							},
							className: "bg-forest-dark text-cream rounded-lg py-1.5 text-[11px] font-bold tracking-widest hover:bg-gold-deep",
							children: "ADD TO CART"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							"aria-label": "Remove",
							onClick: () => wl.remove(p.slug),
							className: "text-muted-foreground hover:text-destructive border border-border rounded-lg px-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
						})]
					})
				]
			})]
		}, p.slug))]
	})] });
}
function RecentlyViewedTab() {
	const { slugs, clear } = useRecentlyViewed();
	const [all, setAll] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		fetchProducts().then((r) => {
			if (r.length) setAll(r);
		});
	}, []);
	const items = slugs.map((s) => all.find((p) => p.slug === s)).filter(Boolean);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap justify-between items-end gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionEyebrow, { children: "Recently viewed" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-2 font-serif text-3xl text-forest-dark",
			children: "Recently viewed"
		})] }), items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: clear,
			className: "text-xs font-bold tracking-widest text-forest-dark hover:text-destructive",
			children: "CLEAR HISTORY"
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
		children: [items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "col-span-full text-sm text-muted-foreground",
			children: "Nothing here yet. Browse a few products and they'll show up here."
		}), items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/product/$slug",
			params: { slug: p.slug },
			className: "bg-card border border-border rounded-xl overflow-hidden hover:border-gold-deep",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: p.image,
				alt: p.name,
				className: "w-full aspect-square object-cover"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-serif text-sm text-forest-dark leading-tight line-clamp-2",
					children: p.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 text-xs text-muted-foreground",
					children: ["₹", p.price]
				})]
			})]
		}, p.slug))]
	})] });
}
function ReviewsTab({ reviews, onChanged }) {
	async function del(id) {
		if (!confirm("Delete this review?")) return;
		const { error } = await supabase.from("reviews").delete().eq("id", id);
		if (error) toast.error(error.message);
		else {
			toast.success("Deleted");
			onChanged();
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionEyebrow, { children: "My reviews" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-2 font-serif text-3xl text-forest-dark",
			children: "Reviews you've written"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-3",
			children: [reviews.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm text-muted-foreground",
				children: "You haven't reviewed anything yet."
			}), reviews.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-card border border-border rounded-xl p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between items-start gap-3 flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/product/$slug",
								params: { slug: r.product_slug },
								className: "text-xs font-bold text-gold-deep uppercase tracking-widest hover:underline",
								children: r.product_slug
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-gold flex items-center gap-1",
								children: ["★".repeat(r.rating), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "☆".repeat(5 - r.rating)
								})]
							}),
							r.title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 font-serif text-lg text-forest-dark",
								children: r.title
							}),
							r.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground whitespace-pre-wrap",
								children: r.body
							}),
							r.admin_reply && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 bg-cream rounded-lg p-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold text-forest-dark uppercase tracking-widest",
									children: "Reply from Saurashtra Honey"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-forest-dark",
									children: r.admin_reply
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `text-[10px] font-bold uppercase tracking-widest rounded px-2 py-0.5 ${r.status === "approved" ? "bg-forest text-cream" : r.status === "rejected" ? "bg-destructive/15 text-destructive" : "bg-cream text-forest-dark border border-border"}`,
							children: r.status
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => del(r.id),
							className: "mt-2 block text-xs text-destructive hover:underline",
							children: "Delete"
						})]
					})]
				})
			}, r.id))]
		})
	] });
}
function NotificationsTab({ notifications, onChanged }) {
	async function markAllRead() {
		const ids = notifications.filter((n) => !n.read).map((n) => n.id);
		if (ids.length === 0) return;
		await supabase.from("notifications").update({ read: true }).in("id", ids);
		onChanged();
	}
	async function toggleRead(n) {
		await supabase.from("notifications").update({ read: !n.read }).eq("id", n.id);
		onChanged();
	}
	async function del(id) {
		await supabase.from("notifications").delete().eq("id", id);
		onChanged();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between items-end gap-3 flex-wrap",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionEyebrow, { children: "Notifications" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-2 font-serif text-3xl text-forest-dark",
			children: "Your notifications"
		})] }), notifications.some((n) => !n.read) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: markAllRead,
			className: "text-xs font-bold tracking-widest text-forest-dark hover:text-gold-deep",
			children: "MARK ALL READ"
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 grid gap-2",
		children: [notifications.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm text-muted-foreground",
			children: "You're all caught up."
		}), notifications.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `rounded-xl border p-4 flex gap-3 items-start ${n.read ? "bg-card border-border" : "bg-cream border-gold/40"}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-2 rounded-full mt-2 shrink-0 ${n.read ? "bg-muted" : "bg-gold-deep"}` }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold uppercase tracking-widest text-forest-dark",
								children: n.kind
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-muted-foreground",
								children: new Date(n.created_at).toLocaleString()
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 font-medium text-forest-dark",
							children: n.title
						}),
						n.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: n.body
						}),
						n.link && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: n.link,
							className: "mt-1 inline-block text-[11px] font-bold tracking-widest text-gold-deep hover:underline",
							children: "VIEW →"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-1 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => toggleRead(n),
						className: "text-[10px] text-muted-foreground hover:text-forest-dark uppercase tracking-widest",
						children: n.read ? "Unread" : "Read"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => del(n.id),
						className: "text-muted-foreground hover:text-destructive",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
					})]
				})
			]
		}, n.id))]
	})] });
}
function NewsletterTab({ profile, onSaved }) {
	const [opt, setOpt] = (0, import_react.useState)(profile.newsletter_opt_in);
	async function save() {
		const { error } = await supabase.from("profiles").upsert({
			id: profile.id,
			newsletter_opt_in: opt
		});
		if (error) toast.error(error.message);
		else {
			toast.success("Preferences saved");
			onSaved();
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionEyebrow, { children: "Newsletter" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-2 font-serif text-3xl text-forest-dark",
			children: "Stories from the hive"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "mt-6 flex items-center gap-3 bg-card border border-border rounded-xl p-4 cursor-pointer max-w-lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "checkbox",
				checked: opt,
				onChange: (e) => setOpt(e.target.checked),
				className: "size-5"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm",
				children: "Send me recipes, honey tips and new-flora launches (about 2 emails a month)."
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: save,
			className: "mt-4 bg-forest-dark text-cream rounded-lg px-6 py-2.5 text-xs font-bold tracking-widest hover:bg-forest",
			children: "SAVE"
		})
	] });
}
function SettingsTab({ email, onSignedOut }) {
	const [confirm, setConfirm] = (0, import_react.useState)("");
	async function requestDelete() {
		if (confirm !== "DELETE") {
			toast.error("Type DELETE to confirm");
			return;
		}
		try {
			await supabase.from("form_submissions").insert({
				form_type: "account_deletion",
				email,
				name: email,
				subject: "Delete my account",
				message: "Customer requested account deletion from account settings.",
				meta: { requested_at: (/* @__PURE__ */ new Date()).toISOString() }
			});
			toast.success("Deletion request received. We'll email you within 24 hours.");
			setConfirm("");
		} catch (e) {
			toast.error(e.message);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionEyebrow, { children: "Settings" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-2 font-serif text-3xl text-forest-dark",
			children: "Account settings"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 bg-card border border-border rounded-2xl p-5 max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] tracking-widest font-bold text-forest-dark uppercase",
					children: "Session"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Sign out from this device."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: onSignedOut,
					className: "mt-3 border border-border rounded-lg px-4 py-2 text-xs font-bold tracking-widest text-forest-dark hover:border-destructive hover:text-destructive inline-flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-3.5" }), " SIGN OUT"]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 bg-destructive/5 border border-destructive/30 rounded-2xl p-5 max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[10px] tracking-widest font-bold text-destructive uppercase flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-3" }), " Danger zone"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-2 font-semibold text-forest-dark",
					children: "Delete my account"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: [
						"This submits a deletion request to our team. Your orders will be kept for tax records; profile data will be permanently erased. Type ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "DELETE" }),
						" to confirm."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: confirm,
						onChange: (e) => setConfirm(e.target.value.toUpperCase()),
						placeholder: "Type DELETE",
						className: inpCls + " flex-1"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: requestDelete,
						className: "bg-destructive text-white rounded-lg px-4 py-2 text-xs font-bold tracking-widest hover:bg-destructive/90",
						children: "REQUEST DELETION"
					})]
				})
			]
		})
	] });
}
var inpCls = "border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:border-gold-deep w-full";
function FieldWrap({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs font-semibold text-forest-dark",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1",
			children
		})]
	});
}
//#endregion
export { Account as component };
