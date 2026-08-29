import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { C as ShieldCheck, E as Send, I as PhoneCall, K as MessageCircle, N as Plus, U as Minus, X as Mail, Y as MapPin, in as ArrowRight } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { l as stringType, s as objectType } from "../_libs/zod.mjs";
import { n as SiteLayout } from "./Layout-BROfU7ZF.mjs";
import { t as submitForm } from "./submit-p7h-oKeY.mjs";
import { t as PageHeroSlider } from "./PageHeroSlider-B2niNRj-.mjs";
import { n as breadcrumbLd, t as StructuredData } from "./StructuredData-C0TBI3qI.mjs";
import { t as hero_products_default } from "./hero-products-Bb1IPyNq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-BJ02H9R2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var contactSchema = objectType({
	name: stringType().trim().min(2, "Name is required").max(100),
	email: stringType().trim().email("Enter a valid email").max(255),
	phone: stringType().trim().min(7, "Enter a valid phone").max(20),
	subject: stringType().min(1, "Please pick a subject"),
	message: stringType().trim().min(5, "Message is too short").max(1e3)
});
function ContactPage() {
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		email: "",
		phone: "",
		subject: "",
		message: ""
	});
	const [openFaq, setOpenFaq] = (0, import_react.useState)(0);
	const set = (k, v) => setForm((f) => ({
		...f,
		[k]: v
	}));
	async function onSubmit(e) {
		e.preventDefault();
		const parsed = contactSchema.safeParse(form);
		if (!parsed.success) {
			toast.error(parsed.error.issues[0].message);
			return;
		}
		setLoading(true);
		try {
			await submitForm({
				form_type: "contact",
				...parsed.data
			});
			toast.success("Message sent!", { description: "Our team will get back to you within 24 hours." });
			setForm({
				name: "",
				email: "",
				phone: "",
				subject: "",
				message: ""
			});
		} catch {
			toast.error("Couldn't send right now. Please try again or call +91 96873 28404.");
		} finally {
			setLoading(false);
		}
	}
	const contactChannels = [
		{
			title: "Call Us",
			value: "+91 96873 28404",
			subtext: "Mon – Sat: 9:00 AM – 6:00 PM",
			Icon: PhoneCall,
			href: "tel:+919687328404"
		},
		{
			title: "Email Us",
			value: "hello@saurastrahoney.com",
			subtext: "We reply within 24 hours",
			Icon: Mail,
			href: "mailto:hello@saurastrahoney.com"
		},
		{
			title: "Visit Us",
			value: "Saurashtra Honey Bee Farm,",
			subtext: "Saurashtra, Gujarat, India",
			Icon: MapPin,
			href: "https://www.google.com/maps/search/?api=1&query=22.9914292,71.4663753"
		},
		{
			title: "WhatsApp Us",
			value: "+91 96873 28404",
			subtext: "Quick response on WhatsApp",
			Icon: MessageCircle,
			href: "https://wa.me/919687328404"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StructuredData, { data: breadcrumbLd([{
			name: "Home",
			url: "/"
		}, {
			name: "Contact",
			url: "/contact"
		}]) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeroSlider, { page: "contact" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			id: "contact-section",
			className: "py-16 sm:py-24 bg-cream border-b border-border/80",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-page",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-5 space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-bold tracking-[0.25em] uppercase text-brand-orange mb-2",
								children: "CONTACT US"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-espresso tracking-tight leading-tight",
								children: "We'd Love to Hear From You!"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm sm:text-base text-espresso/80 leading-relaxed mt-3 mb-8",
								children: "Reach out to us for any queries, support or bulk orders. Our team will get back to you as soon as possible."
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4",
							children: contactChannels.map(({ title, value, subtext, Icon, href }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href,
								target: href.startsWith("http") ? "_blank" : void 0,
								rel: "noreferrer",
								className: "flex items-start gap-4 p-4 rounded-2xl bg-white border border-border/80 hover:border-brand-orange hover:shadow-xs transition-all duration-200 group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-12 sm:size-14 rounded-full bg-cream border border-border/70 flex items-center justify-center text-brand-orange shadow-xs shrink-0 group-hover:scale-105 transition-transform",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5 sm:size-6" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-0.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-serif text-base sm:text-lg font-bold text-espresso group-hover:text-brand-orange transition-colors",
											children: title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold text-sm text-espresso mt-0.5",
											children: value
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-espresso/70 mt-0.5",
											children: subtext
										})
									]
								})]
							}, title))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:col-span-7",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white rounded-3xl border border-border/80 p-8 sm:p-12 shadow-soft",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-serif text-2xl sm:text-3xl font-bold text-espresso mb-7",
								children: "Send Us a Message"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit,
								className: "space-y-4.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-4.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											required: true,
											value: form.name,
											onChange: (e) => set("name", e.target.value),
											placeholder: "Your Name *",
											className: "w-full bg-white border border-border/80 rounded-2xl px-5 py-4 text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:border-brand-orange shadow-xs transition-colors"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											required: true,
											type: "email",
											value: form.email,
											onChange: (e) => set("email", e.target.value),
											placeholder: "Email Address *",
											className: "w-full bg-white border border-border/80 rounded-2xl px-5 py-4 text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:border-brand-orange shadow-xs transition-colors"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-4.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											required: true,
											value: form.phone,
											onChange: (e) => set("phone", e.target.value),
											placeholder: "Phone Number *",
											className: "w-full bg-white border border-border/80 rounded-2xl px-5 py-4 text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:border-brand-orange shadow-xs transition-colors"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											required: true,
											value: form.subject,
											onChange: (e) => set("subject", e.target.value),
											className: "w-full bg-white border border-border/80 rounded-2xl px-5 py-4 text-sm text-espresso focus:outline-none focus:border-brand-orange shadow-xs transition-colors",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Subject *"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "General Enquiry",
													children: "General Enquiry"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Order Status & Shipping",
													children: "Order Status & Shipping"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Bulk & Wholesale Request",
													children: "Bulk & Wholesale Request"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Corporate Gifting & Hampers",
													children: "Corporate Gifting & Hampers"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Product & Testing Questions",
													children: "Product & Testing Questions"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Other",
													children: "Other"
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										required: true,
										rows: 5,
										value: form.message,
										onChange: (e) => set("message", e.target.value),
										placeholder: "Your Message *",
										className: "w-full bg-white border border-border/80 rounded-2xl px-5 py-4 text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:border-brand-orange shadow-xs transition-colors"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-3 flex flex-col sm:flex-row items-center justify-between gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "submit",
											disabled: loading,
											className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-full px-8 py-4 font-bold text-xs sm:text-sm uppercase tracking-widest shadow-md hover:scale-[1.02] disabled:opacity-60 transition-all",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: loading ? "SENDING..." : "SEND MESSAGE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 text-xs text-espresso/70",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4 text-brand-orange shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Your information is safe with us." })]
										})]
									})
								]
							})]
						})
					})]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			id: "map-section",
			className: "py-12 sm:py-16 bg-cream border-b border-border/80",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-page",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full rounded-3xl sm:rounded-[2.5rem] overflow-hidden border border-border/80 shadow-soft bg-cream-deep min-h-[400px] sm:min-h-0 aspect-auto sm:aspect-[21/8]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
						title: "Saurashtra Honey Bee Farm Map Location",
						src: "https://www.openstreetmap.org/export/embed.html?bbox=71.366%2C22.891%2C71.566%2C23.091&layer=mapnik&marker=22.9914%2C71.4664",
						className: "w-full h-full border-0 absolute inset-0",
						loading: "lazy"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute top-6 left-6 sm:top-8 sm:left-8 bg-white/95 backdrop-blur-md rounded-2xl border border-border/80 p-6 sm:p-7 shadow-lift max-w-xs z-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-10 rounded-full bg-cream border border-border text-brand-orange flex items-center justify-center shrink-0 shadow-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-serif text-lg font-bold text-espresso",
								children: "Our Location"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs sm:text-sm text-espresso/75 mt-0.5 leading-relaxed",
								children: [
									"Saurashtra Honey Bee Farm",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"Saurashtra, Gujarat, India"
								]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "https://www.google.com/maps/search/?api=1&query=22.9914292,71.4663753",
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange hover:translate-x-1 transition-transform mt-4 pt-3 border-t border-border/60 w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View on Google Maps" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5" })]
						})]
					})]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			id: "faqs",
			className: "py-16 sm:py-24 bg-cream",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center max-w-2xl mx-auto mb-12 sm:mb-16",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-bold tracking-[0.25em] uppercase text-brand-orange mb-2",
						children: "FAQS"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-espresso tracking-tight",
						children: "Frequently Asked Questions"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-6xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:col-span-7 space-y-4",
						children: [
							{
								q: "Do you offer bulk orders for businesses?",
								a: "Yes! We supply retail stores, hotels, restaurants, and businesses with custom wholesale pricing on orders over 10 kg. Contact our bulk team or visit our Bulk & Gifting page to request a quote.",
								link: {
									text: "View Bulk & Gifting",
									to: "/bulk-gifting"
								}
							},
							{
								q: "How is your honey tested for purity?",
								a: "Every batch of Saurashtra Honey undergoes strict independent NABL lab testing for moisture content, HMF levels, and sugar profiles to ensure 0% additives and 100% natural purity."
							},
							{
								q: "Do you ship across India?",
								a: "Yes, we provide safe, insured pan-India delivery. Orders are typically dispatched within 24–48 hours from our farm in Gujarat with full tracking information."
							},
							{
								q: "What is the difference between raw and processed honey?",
								a: "Our raw honey is never heated above natural hive temperature or ultra-filtered. This preserves living enzymes, natural pollen, and antioxidants that commercial pasteurized honey loses."
							}
						].map(({ q, a }, idx) => {
							const isOpen = openFaq === idx;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-white rounded-2xl border border-border/80 px-6 py-5 shadow-xs hover:border-brand-orange/60 transition-all cursor-pointer",
								onClick: () => setOpenFaq(isOpen ? null : idx),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-serif text-base sm:text-lg font-bold text-espresso",
										children: q
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "size-8 rounded-full bg-cream flex items-center justify-center text-brand-orange shrink-0",
										children: isOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
									})]
								}), isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-xs sm:text-sm text-espresso/75 leading-relaxed pt-2 border-t border-border/50",
									children: a
								})]
							}, q);
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:col-span-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-[#FFF9ED] border border-border/80 rounded-3xl p-8 sm:p-10 shadow-xs relative overflow-hidden flex flex-col justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative z-10",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "size-24 sm:size-28 rounded-2xl overflow-hidden shadow-sm border border-border/60 mb-5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: hero_products_default,
											alt: "Saurashtra Honey — Pure Raw Honey Support",
											className: "w-full h-full object-cover"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "font-serif text-2xl sm:text-3xl font-bold text-espresso leading-snug",
										children: [
											"Still have questions?",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											"We're happy to help!"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-xs sm:text-sm text-espresso/75 leading-relaxed",
										children: "Chat with our friendly team directly on WhatsApp for quick answers and order assistance."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-6",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: "https://wa.me/919687328404",
											target: "_blank",
											rel: "noreferrer",
											className: "inline-flex items-center gap-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-full px-7 py-3.5 font-bold text-xs sm:text-sm uppercase tracking-widest shadow-md hover:scale-[1.02] transition-all",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "CHAT ON WHATSAPP" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
										})
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute bottom-6 right-6 text-3xl opacity-80 pointer-events-none select-none hidden sm:block",
								children: "🐝"
							})]
						})
					})]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "md:hidden fixed bottom-[84px] right-5 z-40",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "https://wa.me/919687328404",
				target: "_blank",
				rel: "noreferrer",
				className: "flex items-center justify-center size-[52px] bg-[#25D366] text-white rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.4)] active:scale-95 transition-transform",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-6" })
			})
		})
	] });
}
//#endregion
export { ContactPage as component };
