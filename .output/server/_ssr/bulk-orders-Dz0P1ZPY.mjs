import { i as __toESM } from "../_runtime.mjs";
import { r as family_honey_default, t as bee_farm_default } from "./team-beekeepers-DfClHD0g.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { C as ShieldCheck, V as Package, u as Truck, zt as CircleCheck } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as literalType, l as stringType, s as objectType } from "../_libs/zod.mjs";
import { n as SiteLayout } from "./Layout-BROfU7ZF.mjs";
import { t as submitForm } from "./submit-p7h-oKeY.mjs";
import { t as PageHeroSlider } from "./PageHeroSlider-B2niNRj-.mjs";
import { n as breadcrumbLd, t as StructuredData } from "./StructuredData-C0TBI3qI.mjs";
import { t as hero_products_default } from "./hero-products-Bb1IPyNq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bulk-orders-Dz0P1ZPY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var schema = objectType({
	name: stringType().trim().min(2, "Name is required").max(100),
	email: stringType().trim().email("Enter a valid email").max(255),
	phone: stringType().trim().min(7, "Enter a valid phone").max(20),
	company: stringType().trim().min(2, "Company name is required").max(120),
	city: stringType().trim().min(2, "City is required").max(80),
	quantity: stringType().min(1, "Quantity is required"),
	message: stringType().trim().max(1e3).optional().or(literalType(""))
});
function BulkOrdersPage() {
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		email: "",
		phone: "",
		company: "",
		city: "",
		quantity: "",
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
				city: form.city,
				quantity: form.quantity,
				message: form.message
			});
			toast.success("Request received!", { description: "Our wholesale team will contact you within 24 hours." });
			setForm({
				name: "",
				email: "",
				phone: "",
				company: "",
				city: "",
				quantity: "",
				message: ""
			});
		} catch {
			toast.error("Couldn't submit right now. Please call +91 96873 28404.");
		} finally {
			setLoading(false);
		}
	}
	function scrollToForm() {
		document.getElementById("request-quote")?.scrollIntoView({
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
				name: "Bulk Orders",
				url: "/bulk-orders"
			}
		]) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeroSlider, { page: "bulk-orders" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bg-[#2B2118] py-6 flex justify-center gap-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: scrollToForm,
				className: "bg-[#D97706] text-white px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-[#B57420] transition-colors",
				children: "Request Wholesale Pricing"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-20 bg-[#FDFBF7]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[12px] font-bold uppercase tracking-[0.25em] text-[#D97706]",
							children: "Trusted Supply Partner"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-[34px] sm:text-[44px] text-[#2B2118] leading-tight",
							children: "Uncompromising Quality at Scale"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[#6B6257] leading-relaxed text-[16px]",
							children: "When you partner with Saurashtra Honey, you are guaranteed 100% pure, natural honey sourced directly from our ethical farms. We maintain strict quality control across every batch, ensuring your business receives exactly what was promised—every single time."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-4 pt-4",
							children: [
								"Low Minimum Order Quantities (MOQ)",
								"Customizable Packaging Sizes",
								"NABL Lab Certified Purity",
								"Dedicated Account Manager"
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
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 w-full relative aspect-square rounded-[24px] overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: bee_farm_default,
						alt: "Honey farm",
						className: "w-full h-full object-cover"
					})
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
						children: "Wholesale Benefits"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-8 bg-[#FDFBF7] rounded-[24px] border border-[#D97706]/15",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, {
									className: "size-10 text-[#D97706] mb-6",
									strokeWidth: 1.5
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-serif text-[22px] font-bold text-[#2B2118] mb-3",
									children: "Flexible Packaging"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[#6B6257] leading-relaxed",
									children: "Available in bulk food-grade buckets, drums, or retail-ready glass jars."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-8 bg-[#FDFBF7] rounded-[24px] border border-[#D97706]/15",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, {
									className: "size-10 text-[#D97706] mb-6",
									strokeWidth: 1.5
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-serif text-[22px] font-bold text-[#2B2118] mb-3",
									children: "Fast Delivery"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[#6B6257] leading-relaxed",
									children: "Reliable pan-India dispatch and logistics support to keep your inventory full."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-8 bg-[#FDFBF7] rounded-[24px] border border-[#D97706]/15",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
									className: "size-10 text-[#D97706] mb-6",
									strokeWidth: 1.5
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-serif text-[22px] font-bold text-[#2B2118] mb-3",
									children: "Consistent Pricing"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[#6B6257] leading-relaxed",
									children: "Transparent B2B pricing structures designed to support your margins."
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
						children: "How It Works"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto",
					children: [
						"Submit Enquiry",
						"Consultation & Samples",
						"Confirm Order",
						"Dispatch & Delivery"
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
					children: "Industries We Serve"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap justify-center gap-6 max-w-4xl mx-auto",
					children: [
						"Restaurants & Cafes",
						"Luxury Hotels",
						"Retail Chains",
						"Distributors",
						"Health Food Brands",
						"Bakeries"
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
						bee_farm_default,
						family_honey_default
					].map((img, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "aspect-square overflow-hidden rounded-[16px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: img,
							alt: "Gallery",
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
							q: "What is the Minimum Order Quantity (MOQ)?",
							a: "Our wholesale MOQ starts at just 10kg, making it accessible for both small cafes and large retail chains."
						},
						{
							q: "Do you provide lab test reports?",
							a: "Yes, every bulk dispatch is accompanied by an independent NABL lab report guaranteeing purity."
						},
						{
							q: "Can I get samples before ordering?",
							a: "Absolutely. We provide commercial sample kits for businesses to evaluate quality and taste profiles."
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
						children: "Partner Testimonials"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-serif text-[24px] sm:text-[32px] text-[#2B2118] leading-relaxed italic",
						children: "\"Saurashtra Honey has been our exclusive supplier for over two years. Their consistency in quality and flawless delivery schedule has made them an invaluable partner for our restaurant chain.\""
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 font-bold text-[#6B6257] uppercase tracking-widest text-[14px]",
						children: "— Executive Chef, Premium Hospitality Group"
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			id: "request-quote",
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
								children: "Request Wholesale Pricing"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[#6B6257]",
								children: "Fill out the details below and our B2B team will reach out shortly."
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
										placeholder: "Company / Business Name",
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
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										placeholder: "City",
										value: form.city,
										onChange: (e) => set("city", e.target.value),
										className: "w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706]",
										required: true
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: form.quantity,
										onChange: (e) => set("quantity", e.target.value),
										className: "w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706] appearance-none",
										required: true,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												disabled: true,
												children: "Estimated Monthly Quantity"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "10-50kg",
												children: "10 - 50 kg"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "50-200kg",
												children: "50 - 200 kg"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "200kg+",
												children: "200+ kg"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									placeholder: "Tell us about your requirements...",
									value: form.message,
									onChange: (e) => set("message", e.target.value),
									className: "w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706] min-h-[120px] resize-y"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: loading,
									className: "w-full py-4 bg-[#D97706] hover:bg-[#B57420] text-white font-bold tracking-widest uppercase rounded-xl transition-colors disabled:opacity-70 mt-2",
									children: loading ? "Sending..." : "Submit Request"
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
										href: "mailto:wholesale@saurashtrahoney.com",
										className: "hover:text-[#D97706]",
										children: "✉️ wholesale@saurashtrahoney.com"
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
export { BulkOrdersPage as component };
