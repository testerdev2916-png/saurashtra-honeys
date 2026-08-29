import { i as __toESM } from "../_runtime.mjs";
import { f as prod_giftpack_default, r as family_honey_default } from "./team-beekeepers-DfClHD0g.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { E as Send, R as PenTool, St as Gift, zt as CircleCheck } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as literalType, l as stringType, s as objectType } from "../_libs/zod.mjs";
import { n as SiteLayout } from "./Layout-BROfU7ZF.mjs";
import { t as submitForm } from "./submit-p7h-oKeY.mjs";
import { t as PageHeroSlider } from "./PageHeroSlider-B2niNRj-.mjs";
import { n as breadcrumbLd, t as StructuredData } from "./StructuredData-C0TBI3qI.mjs";
import { t as hero_products_default } from "./hero-products-Bb1IPyNq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/corporate-gifting-DzAQg42S.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var schema = objectType({
	name: stringType().trim().min(2, "Name is required").max(100),
	email: stringType().trim().email("Enter a valid email").max(255),
	phone: stringType().trim().min(7, "Enter a valid phone").max(20),
	company: stringType().trim().min(2, "Company name is required").max(120),
	quantity: stringType().min(1, "Quantity is required"),
	occasion: stringType().min(1, "Occasion is required"),
	message: stringType().trim().max(1e3).optional().or(literalType(""))
});
function CorporateGiftingPage() {
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		email: "",
		phone: "",
		company: "",
		quantity: "",
		occasion: "",
		message: ""
	});
	const set = (k, v) => setForm((f) => ({
		...f,
		[k]: v
	}));
	async function onSubmit(e) {
		e.preventDefault();
		const parsed = schema.safeParse(form);
		if (!parsed.success) {
			toast.error(parsed.error.issues[0].message);
			return;
		}
		setLoading(true);
		try {
			await submitForm({
				form_type: "bulk_order",
				name: form.name,
				email: form.email,
				phone: form.phone,
				company: form.company,
				city: "N/A",
				quantity: form.quantity,
				message: form.message,
				meta: {
					purpose: "Corporate Gifting",
					occasion: form.occasion
				}
			});
			toast.success("Request received!", { description: "Our gifting concierge will contact you shortly." });
			setForm({
				name: "",
				email: "",
				phone: "",
				company: "",
				quantity: "",
				occasion: "",
				message: ""
			});
		} catch {
			toast.error("Couldn't submit right now. Please call +91 96873 28404.");
		} finally {
			setLoading(false);
		}
	}
	function scrollToForm() {
		document.getElementById("request-catalogue")?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StructuredData, { data: breadcrumbLd([
			{
				name: "Home",
				url: "/"
			},
			{
				name: "Bulk & Gifting",
				url: "/bulk-gifting"
			},
			{
				name: "Corporate Gifting",
				url: "/corporate-gifting"
			}
		]) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeroSlider, { page: "bulk-orders" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bg-[#2B2118] py-6 flex justify-center gap-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: scrollToForm,
				className: "bg-[#D97706] text-white px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-[#B57420] transition-colors",
				children: "Request Corporate Catalogue"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-20 bg-[#FDFBF7]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 w-full relative aspect-square rounded-[24px] overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: prod_giftpack_default,
						alt: "Corporate Gifting",
						className: "w-full h-full object-cover"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[12px] font-bold uppercase tracking-[0.25em] text-[#D97706]",
							children: "A Gift of Health"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-[34px] sm:text-[44px] text-[#2B2118] leading-tight",
							children: "Gifts That Leave a Lasting Impression"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[#6B6257] leading-relaxed text-[16px]",
							children: "Corporate gifting should be more than just a formality. At Saurashtra Honey, we craft premium, health-conscious gifts that reflect your company's values and genuine appreciation. From Diwali to work anniversaries, our pure honey hampers stand out."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-4 pt-4",
							children: [
								"100% Pure, Healthy & Meaningful",
								"Fully Customizable Branding",
								"Premium Luxury Packaging",
								"Hassle-Free Doorstep Delivery"
							].map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-3 text-[#2B2118] font-[500]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-5 text-[#D97706]" }),
									" ",
									item
								]
							}, i))
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-20 bg-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center mb-16",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-[36px] sm:text-[44px] text-[#2B2118]",
						children: "Tailored for Your Brand"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-8 bg-[#FDFBF7] rounded-[24px] border border-[#D97706]/15 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenTool, {
									className: "size-10 text-[#D97706] mx-auto mb-6",
									strokeWidth: 1.5
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-serif text-[22px] font-bold text-[#2B2118] mb-3",
									children: "Custom Branding"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[#6B6257] leading-relaxed",
									children: "Incorporate your company logo, custom sleeves, and personalized greeting cards."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-8 bg-[#FDFBF7] rounded-[24px] border border-[#D97706]/15 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, {
									className: "size-10 text-[#D97706] mx-auto mb-6",
									strokeWidth: 1.5
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-serif text-[22px] font-bold text-[#2B2118] mb-3",
									children: "Curated Options"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[#6B6257] leading-relaxed",
									children: "Choose from single jars, multi-flavor luxury boxes, or elaborate festive hampers."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-8 bg-[#FDFBF7] rounded-[24px] border border-[#D97706]/15 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {
									className: "size-10 text-[#D97706] mx-auto mb-6",
									strokeWidth: 1.5
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-serif text-[22px] font-bold text-[#2B2118] mb-3",
									children: "Bulk Delivery"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[#6B6257] leading-relaxed",
									children: "We manage the logistics. Ship in bulk to your office or individually to employee homes."
								})
							]
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-20 bg-[#FDFBF7]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center mb-16",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-[36px] sm:text-[44px] text-[#2B2118]",
						children: "The Gifting Process"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto",
					children: [
						"Choose Your Hamper",
						"Customize & Brand",
						"Finalize Details",
						"Delivered with Care"
					].map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-16 rounded-full bg-white border border-[#D97706]/20 flex items-center justify-center text-[#D97706] font-serif text-[24px] font-bold shadow-sm mb-6",
							children: i + 1
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-[#2B2118] text-[18px] mb-2",
							children: step
						})]
					}, i))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-20 bg-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-[36px] sm:text-[44px] text-[#2B2118] mb-12",
					children: "Perfect For Every Industry"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap justify-center gap-6 max-w-4xl mx-auto",
					children: [
						"Tech Companies",
						"Financial Institutions",
						"Real Estate Developers",
						"Creative Agencies",
						"Law Firms",
						"Healthcare"
					].map((ind) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-8 py-4 bg-[#FDFBF7] rounded-full border border-[#D97706]/10 text-[#2B2118] font-bold tracking-wide",
						children: ind
					}, ind))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-20 bg-[#2B2118]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-page",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto",
					children: [
						hero_products_default,
						prod_giftpack_default,
						family_honey_default
					].map((img, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "aspect-[4/5] overflow-hidden rounded-[16px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: img,
							alt: "Corporate Gifting",
							className: "w-full h-full object-cover hover:scale-105 transition-transform duration-700"
						})
					}, idx))
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-20 bg-[#FDFBF7]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page max-w-3xl mx-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-[36px] sm:text-[44px] text-[#2B2118] text-center mb-12",
					children: "Frequently Asked Questions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-6",
					children: [
						{
							q: "What is the minimum order quantity for corporate gifts?",
							a: "Our corporate gifting MOQ starts at 50 units for standard hampers and 100 units for fully customized branding."
						},
						{
							q: "Can you ship directly to our employees' homes?",
							a: "Yes, we offer direct-to-home fulfillment services. You provide the address list, and we handle individual dispatch and tracking."
						},
						{
							q: "How far in advance should we place an order for Diwali?",
							a: "For major festivals like Diwali, we recommend confirming your order 4-6 weeks in advance to ensure stock availability and ample time for custom branding."
						}
					].map((faq, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white p-6 rounded-[16px] shadow-sm border border-[#D97706]/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-[#2B2118] text-[18px] mb-2",
							children: faq.q
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[#6B6257]",
							children: faq.a
						})]
					}, i))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-20 bg-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page max-w-4xl mx-auto text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[12px] font-bold uppercase tracking-[0.25em] text-[#D97706] mb-6",
						children: "Client Testimonials"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-serif text-[24px] sm:text-[32px] text-[#2B2118] leading-relaxed italic",
						children: "\"We switched to Saurashtra Honey for our annual Diwali gifts and the response from our clients was overwhelming. The premium packaging and the purity of the honey perfectly aligned with our brand image.\""
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 font-bold text-[#6B6257] uppercase tracking-widest text-[14px]",
						children: "— HR Director, Leading Tech Firm"
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			id: "request-catalogue",
			className: "py-20 bg-[#F8F5EF] border-t border-[#D97706]/20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-page max-w-2xl mx-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white p-8 sm:p-12 rounded-[24px] shadow-xl shadow-black/5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center mb-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-serif text-[32px] font-bold text-[#2B2118] mb-3",
								children: "Request Corporate Catalogue"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[#6B6257]",
								children: "Fill out the details below to receive our latest gifting catalogue and pricing."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit,
							className: "space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										placeholder: "Full Name",
										value: form.name,
										onChange: (e) => set("name", e.target.value),
										className: "w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706]",
										required: true
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										placeholder: "Company Name",
										value: form.company,
										onChange: (e) => set("company", e.target.value),
										className: "w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706]",
										required: true
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "email",
										placeholder: "Email Address",
										value: form.email,
										onChange: (e) => set("email", e.target.value),
										className: "w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706]",
										required: true
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "tel",
										placeholder: "Phone Number",
										value: form.phone,
										onChange: (e) => set("phone", e.target.value),
										className: "w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706]",
										required: true
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: form.occasion,
										onChange: (e) => set("occasion", e.target.value),
										className: "w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706] appearance-none",
										required: true,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												disabled: true,
												children: "Gifting Occasion"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Diwali / Festivals",
												children: "Diwali / Festivals"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Employee Onboarding",
												children: "Employee Onboarding"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Client Appreciation",
												children: "Client Appreciation"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Other",
												children: "Other"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: form.quantity,
										onChange: (e) => set("quantity", e.target.value),
										className: "w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706] appearance-none",
										required: true,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												disabled: true,
												children: "Estimated Quantity"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "50-100",
												children: "50 - 100 boxes"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "100-500",
												children: "100 - 500 boxes"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "500+",
												children: "500+ boxes"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									placeholder: "Any specific requirements or budget...",
									value: form.message,
									onChange: (e) => set("message", e.target.value),
									className: "w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706] min-h-[120px] resize-y"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: loading,
									className: "w-full py-4 bg-[#D97706] hover:bg-[#B57420] text-white font-bold tracking-widest uppercase rounded-xl transition-colors disabled:opacity-70 mt-2",
									children: loading ? "Sending..." : "Request Catalogue"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 text-center text-[#6B6257] text-[14px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Or contact us directly:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-center gap-4 mt-2 font-bold text-[#2B2118]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "tel:+919687328404",
										className: "hover:text-[#D97706]",
										children: "📞 +91 96873 28404"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "|" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "mailto:gifting@saurashtrahoney.com",
										className: "hover:text-[#D97706]",
										children: "✉️ gifting@saurashtrahoney.com"
									})
								]
							})]
						})
					]
				})
			})
		})
	] });
}
//#endregion
export { CorporateGiftingPage as component };
