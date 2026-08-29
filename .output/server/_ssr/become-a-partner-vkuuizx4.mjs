import { i as __toESM } from "../_runtime.mjs";
import { i as honey_drizzle_default } from "./team-beekeepers-DfClHD0g.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { C as ShieldCheck, Ft as ClipboardList, It as ClipboardCheck, J as Megaphone, S as ShoppingBag, V as Package, _ as Store, bt as GraduationCap, f as TrendingUp, gt as Headphones, in as ArrowRight, s as UsersRound, tn as Award, u as Truck, v as Star, yt as Handshake } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { l as stringType, s as objectType } from "../_libs/zod.mjs";
import { n as SiteLayout } from "./Layout-BROfU7ZF.mjs";
import { t as HeroSlider } from "./HeroSlider-CikMyqvX.mjs";
import { t as submitForm } from "./submit-p7h-oKeY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/become-a-partner-vkuuizx4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var partner_handshake_default = "/assets/partner-handshake-Byc1Jn4K.jpg";
var partnerSchema = objectType({
	name: stringType().trim().min(2, "Name is required").max(100),
	phone: stringType().trim().min(7, "Phone is required").max(20),
	email: stringType().trim().email("Enter a valid email").max(255),
	city: stringType().trim().min(2, "City is required").max(80),
	interest: stringType().min(1, "Select interest")
});
var perks = [
	[
		Award,
		"Premium Products",
		"100% pure, raw and unfiltered honey."
	],
	[
		Package,
		"Attractive Margins",
		"Competitive pricing with good profit."
	],
	[
		Megaphone,
		"Marketing Support",
		"Product creatives, posters and promotional support."
	],
	[
		GraduationCap,
		"Training & Guidance",
		"Complete knowledge and business support."
	],
	[
		Truck,
		"Reliable Supply",
		"Timely delivery and consistent stock."
	]
];
var whoJoins = [
	[
		Store,
		"Retail Stores",
		"Expand your product range with pure honey."
	],
	[
		Award,
		"Distributors",
		"Distribute a trusted brand with high demand."
	],
	[
		UsersRound,
		"Wholesalers",
		"Partner with a brand that customers love."
	],
	[
		ShoppingBag,
		"Online Sellers",
		"Sell natural, chemical-free honey online."
	]
];
var steps = [
	[
		ClipboardList,
		"Fill the Form",
		"Share your details and business information."
	],
	[
		Headphones,
		"Connect With Us",
		"Our team will connect with you shortly."
	],
	[
		ClipboardCheck,
		"Discuss & Onboard",
		"We will discuss terms and finalise onboarding."
	],
	[
		Package,
		"Get Products",
		"Receive your products and marketing materials."
	],
	[
		TrendingUp,
		"Grow Together",
		"Sell with confidence — we grow together."
	]
];
var partners = [
	{
		n: "Manish Patel",
		role: "Distributor, Rajkot",
		q: "Saurashtra Honey has excellent quality and the support from their team is outstanding. Great brand to work with."
	},
	{
		n: "Neha Agarwal",
		role: "Retailer, Ahmedabad",
		q: "The demand for natural honey is always high. My customers love the taste and purity of Saurashtra Honey."
	},
	{
		n: "Rakesh Verma",
		role: "Wholesaler, Surat",
		q: "Timely delivery, great margins and a trusted product. It's a perfect partnership for our business."
	}
];
function Partner() {
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		phone: "",
		email: "",
		city: "",
		interest: ""
	});
	const set = (k, v) => setForm((f) => ({
		...f,
		[k]: v
	}));
	async function onSubmit(e) {
		e.preventDefault();
		const parsed = partnerSchema.safeParse(form);
		if (!parsed.success) {
			toast.error(parsed.error.issues[0].message);
			return;
		}
		setLoading(true);
		try {
			await submitForm({
				form_type: "partner",
				name: form.name,
				phone: form.phone,
				email: form.email,
				city: form.city,
				meta: { interest: form.interest }
			});
			toast.success("Application received!", { description: "Our partnerships team will reach out shortly." });
			setForm({
				name: "",
				phone: "",
				email: "",
				city: "",
				interest: ""
			});
		} catch {
			toast.error("Couldn't submit. Please try again.");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroSlider, {
			variant: "inner",
			size: "sm",
			slides: [
				{
					image: partner_handshake_default,
					title: "Let's Grow Together.",
					ctaTo: "/become-a-partner"
				},
				{
					image: honey_drizzle_default,
					title: "Stock a Brand Customers Love.",
					ctaTo: "/become-a-partner"
				},
				{
					image: partner_handshake_default,
					title: "Reliable Supply. Real Support.",
					ctaTo: "/contact"
				}
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "container-page py-16 grid lg:grid-cols-[1fr_2fr] gap-10 items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs uppercase tracking-widest text-burnt-orange font-bold",
					children: "Why Partner With Us?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 font-serif text-4xl font-bold text-espresso",
					children: "More Than a Partnership, It's a Growing Relationship."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted-foreground max-w-md leading-relaxed",
					children: "We provide our partners with everything they need to succeed in the fast-growing natural & organic food market."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-4 w-12 h-0.5 bg-burnt-orange" })
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 md:grid-cols-5 gap-6",
				children: perks.map(([I, t, b]) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center bg-cream-deep/50 border border-border/80 rounded-2xl p-5 shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto size-14 rounded-full bg-white flex items-center justify-center text-burnt-orange shadow-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I, { className: "size-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3.5 font-bold text-sm text-espresso",
								children: t
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: b
							})
						]
					}, t);
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "container-page pb-14 grid lg:grid-cols-[1fr_2fr] gap-8 items-start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-espresso text-cream rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-lg border border-white/10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-widest text-burnt-orange font-bold",
						children: "Who Can Join?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-2 font-serif text-2xl font-bold",
						children: "Partner Programs"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-7 space-y-6",
						children: whoJoins.map(([I, t, b]) => {
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-3.5 items-start",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-10 rounded-xl bg-cream/10 flex items-center justify-center text-burnt-orange shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I, { className: "size-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold text-sm text-cream",
									children: t
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-cream/75 mt-0.5 leading-relaxed",
									children: b
								})] })]
							}, t);
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-border/80 rounded-3xl p-8 md:p-10 shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-widest text-burnt-orange font-bold",
						children: "Our Partnership Process"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-2 font-serif text-3xl font-bold text-espresso",
						children: "Simple Steps to Partner With Us"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 grid grid-cols-2 md:grid-cols-5 gap-5",
						children: steps.map(([I, t, b], i) => {
							const Icon = I;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mx-auto size-8 rounded-full bg-espresso text-cream text-xs font-bold flex items-center justify-center shadow-xs",
										children: i + 1
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "mx-auto mt-3.5 size-6 text-burnt-orange" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 font-bold text-sm text-espresso",
										children: t
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: b
									}),
									i < steps.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "hidden md:block absolute top-4 -right-3 size-3.5 text-burnt-orange" })
								]
							}, t);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center mt-9 pt-6 border-t border-border/60",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "#apply",
							className: "inline-flex items-center gap-2 bg-espresso text-cream rounded-full px-7 py-3.5 text-xs font-bold tracking-widest hover:bg-burnt-orange transition-all shadow-sm",
							children: ["START PARTNERSHIP JOURNEY ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
						})
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			id: "apply",
			className: "container-page pb-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-espresso text-cream rounded-3xl p-8 md:p-12 shadow-xl border border-white/10 grid lg:grid-cols-[1fr_1.3fr] gap-10 items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-widest text-burnt-orange font-bold",
						children: "Apply Online"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-serif text-3xl md:text-4xl font-bold",
						children: "Join the Saurashtra Honey Network"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-cream/80 leading-relaxed",
						children: "Fill out your details below. Our partnership manager will review your profile and connect within 24 hours to discuss margins, samples, and terms."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 space-y-3 text-xs text-cream/75",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4 text-burnt-orange" }), " 100% Direct Manufacturer Supply"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4 text-burnt-orange" }), " Guaranteed Batch Purity & NABL Reports"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4 text-burnt-orange" }), " Dedicated Regional Marketing Assistance"]
							})
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-serif text-xl font-bold text-white mb-5",
							children: "Partner Registration Form"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									value: form.name,
									onChange: (e) => set("name", e.target.value),
									placeholder: "Full Name *",
									className: "bg-cream/15 border border-cream/30 rounded-xl px-4 py-3 text-sm placeholder:text-cream/60 focus:outline-none focus:border-burnt-orange transition-colors"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									value: form.phone,
									onChange: (e) => set("phone", e.target.value),
									placeholder: "Phone / WhatsApp *",
									className: "bg-cream/15 border border-cream/30 rounded-xl px-4 py-3 text-sm placeholder:text-cream/60 focus:outline-none focus:border-burnt-orange transition-colors"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									type: "email",
									value: form.email,
									onChange: (e) => set("email", e.target.value),
									placeholder: "Business Email *",
									className: "bg-cream/15 border border-cream/30 rounded-xl px-4 py-3 text-sm placeholder:text-cream/60 focus:outline-none focus:border-burnt-orange transition-colors"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									value: form.city,
									onChange: (e) => set("city", e.target.value),
									placeholder: "City / State *",
									className: "bg-cream/15 border border-cream/30 rounded-xl px-4 py-3 text-sm placeholder:text-cream/60 focus:outline-none focus:border-burnt-orange transition-colors"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									required: true,
									value: form.interest,
									onChange: (e) => set("interest", e.target.value),
									className: "sm:col-span-2 bg-cream/15 border border-cream/30 rounded-xl px-4 py-3 text-sm text-cream/90 focus:outline-none focus:border-burnt-orange transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										className: "text-espresso",
										children: "Select Partnership Type *"
									}), whoJoins.map(([_, t]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: t,
										className: "text-espresso",
										children: t
									}, t))]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							disabled: loading,
							className: "mt-6 w-full inline-flex items-center justify-center gap-2 bg-burnt-orange text-white rounded-xl py-3.5 text-xs font-bold tracking-widest hover:bg-terracotta disabled:opacity-60 transition-all shadow-md",
							children: loading ? "SUBMITTING…" : "SUBMIT PARTNER APPLICATION"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 text-center text-[11px] text-cream/70",
							children: "Our team will get in touch shortly after submission."
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "container-page py-14",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-cream-deep/50 border border-border/80 rounded-3xl p-8 md:p-10 shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-between mb-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-widest text-burnt-orange font-bold",
						children: "Our Partners Speak"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-2 font-serif text-3xl font-bold text-espresso",
						children: "Growing Businesses. Building Trust."
					})] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid md:grid-cols-3 gap-6",
					children: partners.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
						className: "bg-white rounded-2xl p-6 border border-border/80 shadow-xs flex flex-col justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-12 rounded-full bg-burnt-orange text-white flex items-center justify-center font-serif text-lg font-bold shadow-xs",
								children: p.n[0]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-bold text-sm text-espresso",
								children: p.n
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground font-medium",
								children: p.role
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
							className: "mt-4 text-sm text-foreground/85 leading-relaxed",
							children: [
								"\"",
								p.q,
								"\""
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 flex text-amber-500",
							children: [...Array(5)].map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3.5 fill-amber-500" }, i))
						})]
					}, p.n))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "container-page pb-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden rounded-3xl shadow-lg border border-white/10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: honey_drizzle_default,
						alt: "",
						loading: "lazy",
						className: "absolute inset-0 w-full h-full object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-espresso/95 via-espresso/90 to-espresso/60" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative p-8 md:p-12 grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center text-cream",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-serif text-3xl md:text-4xl font-bold",
								children: "Let's create sweetness together."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-cream/80",
								children: "Join the Saurashtra Honey family today!"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "#apply",
								className: "mt-6 inline-flex items-center gap-2 bg-burnt-orange text-white rounded-full px-7 py-3.5 text-xs font-bold tracking-widest hover:bg-terracotta transition-all shadow-md",
								children: ["JOIN NOW ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handshake, { className: "size-4" })]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-xs",
							children: [
								["10K+", "Happy Partners"],
								["500+", "Cities Covered"],
								["100%", "Pure & Natural"],
								["Growing", "Stronger Together"]
							].map(([n, l]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center border-l border-cream/25 first:border-0 pl-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-serif text-2xl font-bold text-burnt-orange",
									children: n
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-cream/75 mt-0.5",
									children: l
								})]
							}, l))
						})]
					})
				]
			})
		})
	] });
}
//#endregion
export { Partner as component };
