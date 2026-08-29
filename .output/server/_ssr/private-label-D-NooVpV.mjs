import { i as __toESM } from "../_runtime.mjs";
import { a as honeycomb_bees_default, o as prod_ajwain_default, t as bee_farm_default } from "./team-beekeepers-DfClHD0g.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { B as Palette, C as ShieldCheck, V as Package, W as Microscope, zt as CircleCheck } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as literalType, l as stringType, s as objectType } from "../_libs/zod.mjs";
import { n as SiteLayout } from "./Layout-BROfU7ZF.mjs";
import { t as submitForm } from "./submit-p7h-oKeY.mjs";
import { t as PageHeroSlider } from "./PageHeroSlider-B2niNRj-.mjs";
import { n as breadcrumbLd, t as StructuredData } from "./StructuredData-C0TBI3qI.mjs";
import { t as hero_products_default } from "./hero-products-Bb1IPyNq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/private-label-D-NooVpV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var schema = objectType({
	name: stringType().trim().min(2, "Name is required").max(100),
	email: stringType().trim().email("Enter a valid email").max(255),
	phone: stringType().trim().min(7, "Enter a valid phone").max(20),
	company: stringType().trim().min(2, "Company name is required").max(120),
	country: stringType().trim().min(2, "Country is required").max(80),
	estimated_volume: stringType().min(1, "Volume is required"),
	services: stringType().min(1, "Service type is required"),
	message: stringType().trim().max(1e3).optional().or(literalType(""))
});
function PrivateLabelPage() {
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		email: "",
		phone: "",
		company: "",
		country: "",
		estimated_volume: "",
		services: "",
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
				city: form.country,
				quantity: form.estimated_volume,
				message: form.message,
				meta: {
					purpose: "Private Label",
					services_needed: form.services
				}
			});
			toast.success("Manufacturing enquiry received!", { description: "Our OEM specialist will contact you shortly." });
			setForm({
				name: "",
				email: "",
				phone: "",
				company: "",
				country: "",
				estimated_volume: "",
				services: "",
				message: ""
			});
		} catch {
			toast.error("Couldn't submit right now. Please call +91 96873 28404.");
		} finally {
			setLoading(false);
		}
	}
	function scrollToForm() {
		document.getElementById("start-brand")?.scrollIntoView({
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
				name: "Private Label",
				url: "/private-label"
			}
		]) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeroSlider, { page: "bulk-orders" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bg-[#2B2118] py-6 flex justify-center gap-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: scrollToForm,
				className: "bg-[#D97706] text-white px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-[#B57420] transition-colors",
				children: "Start Your Honey Brand"
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
							children: "White Label Manufacturing"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-[34px] sm:text-[44px] text-[#2B2118] leading-tight",
							children: "Your Brand. Our Pure Honey."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[#6B6257] leading-relaxed text-[16px]",
							children: "Building a premium food brand requires a partner you can completely trust. We provide fully certified OEM/White Label manufacturing services, empowering entrepreneurs and established brands to launch world-class honey products without the hassle of setting up a facility."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-4 pt-4",
							children: [
								"End-to-End Contract Manufacturing",
								"NABL Certified Quality Control",
								"Custom Bottle & Jar Sourcing",
								"Global Export Support"
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
					className: "flex-1 w-full relative aspect-[4/5] rounded-[24px] overflow-hidden shadow-lg border border-[#D97706]/10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: hero_products_default,
						alt: "Private Label Manufacturing",
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
						children: "Complete OEM Solutions"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-8 bg-[#FDFBF7] rounded-[24px] border border-[#D97706]/15 text-center transition-transform hover:-translate-y-2 duration-500",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Microscope, {
									className: "size-10 text-[#D97706] mx-auto mb-6",
									strokeWidth: 1.5
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-serif text-[20px] font-bold text-[#2B2118] mb-3",
									children: "Lab Testing"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[#6B6257] text-[14px] leading-relaxed",
									children: "Rigorous independent quality control for moisture, HMF, and sugar profiles."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-8 bg-[#FDFBF7] rounded-[24px] border border-[#D97706]/15 text-center transition-transform hover:-translate-y-2 duration-500",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, {
									className: "size-10 text-[#D97706] mx-auto mb-6",
									strokeWidth: 1.5
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-serif text-[20px] font-bold text-[#2B2118] mb-3",
									children: "Jar Selection"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[#6B6257] text-[14px] leading-relaxed",
									children: "Choose from our extensive catalog of premium glass jars and squeeze bottles."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-8 bg-[#FDFBF7] rounded-[24px] border border-[#D97706]/15 text-center transition-transform hover:-translate-y-2 duration-500",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, {
									className: "size-10 text-[#D97706] mx-auto mb-6",
									strokeWidth: 1.5
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-serif text-[20px] font-bold text-[#2B2118] mb-3",
									children: "Custom Labels"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[#6B6257] text-[14px] leading-relaxed",
									children: "In-house design assistance to ensure your labels meet compliance and look stunning."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-8 bg-[#FDFBF7] rounded-[24px] border border-[#D97706]/15 text-center transition-transform hover:-translate-y-2 duration-500",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
									className: "size-10 text-[#D97706] mx-auto mb-6",
									strokeWidth: 1.5
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-serif text-[20px] font-bold text-[#2B2118] mb-3",
									children: "Certifications"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[#6B6257] text-[14px] leading-relaxed",
									children: "Manufactured in a certified facility ready for domestic retail and international export."
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
						children: "Launch Timeline"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-5 gap-6 max-w-6xl mx-auto",
					children: [
						{
							t: "Consultation",
							d: "Discuss volume & vision"
						},
						{
							t: "Formulation",
							d: "Select honey varieties"
						},
						{
							t: "Packaging",
							d: "Finalize jars & labels"
						},
						{
							t: "Production",
							d: "Filling & QC testing"
						},
						{
							t: "Delivery",
							d: "Dispatch to warehouse"
						}
					].map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center text-center relative group",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-16 rounded-full bg-white border border-[#D97706]/20 flex items-center justify-center text-[#D97706] font-serif text-[24px] font-bold shadow-sm mb-6 z-10 transition-transform duration-500 group-hover:scale-110",
								children: i + 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-[#2B2118] text-[16px] mb-2",
								children: step.t
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[13px] text-[#6B6257] leading-relaxed",
								children: step.d
							}),
							i < 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden md:block absolute top-8 left-1/2 w-full h-[1px] bg-[#D97706]/20 -z-0" })
						]
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
					children: "Who Partners With Us"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap justify-center gap-6 max-w-4xl mx-auto",
					children: [
						"Supermarket Chains",
						"Health Supplements",
						"D2C Brands",
						"International Exporters",
						"Boutique Food Labels",
						"Wellness Resorts"
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
						prod_ajwain_default,
						bee_farm_default,
						honeycomb_bees_default
					].map((img, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "aspect-square overflow-hidden rounded-[16px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: img,
							alt: "Manufacturing",
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
							q: "What is the Minimum Order Quantity (MOQ) for private label?",
							a: "Our private label MOQ starts at 500 units per SKU. This ensures cost-effective production while keeping the barrier to entry manageable for new brands."
						},
						{
							q: "Do you assist with FDA / FSSAI labeling compliance?",
							a: "Yes. Our team will review your label design to ensure all nutritional facts, barcode placements, and legal declarations meet FSSAI and international standards."
						},
						{
							q: "Can I provide my own jars and labels?",
							a: "Absolutely. We offer complete flexibility. You can ship your proprietary packaging to our facility, and we will handle the filling, sealing, and testing."
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
						children: "Partner Success"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-serif text-[24px] sm:text-[32px] text-[#2B2118] leading-relaxed italic",
						children: "\"Launching our organic food brand seemed daunting until we partnered with Saurashtra Honey. Their contract manufacturing team guided us through jar selection, testing, and scaling up production seamlessly.\""
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 font-bold text-[#6B6257] uppercase tracking-widest text-[14px]",
						children: "— Founder, Premium D2C Wellness Brand"
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			id: "start-brand",
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
								children: "Start Your Honey Brand"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[#6B6257]",
								children: "Submit your project details below to schedule a consultation with our OEM specialists."
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
										placeholder: "Company / Brand Name",
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
										placeholder: "Target Country / Market",
										value: form.country,
										onChange: (e) => set("country", e.target.value),
										className: "w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706]",
										required: true
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: form.estimated_volume,
										onChange: (e) => set("estimated_volume", e.target.value),
										className: "w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706] appearance-none",
										required: true,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												disabled: true,
												children: "Estimated Monthly Volume"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "500-1000 units",
												children: "500 - 1,000 units"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "1000-5000 units",
												children: "1,000 - 5,000 units"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "5000+ units",
												children: "5,000+ units"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: form.services,
									onChange: (e) => set("services", e.target.value),
									className: "w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706] appearance-none",
									required: true,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											disabled: true,
											children: "Required Services"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Full Turnkey (Honey + Jars + Labels)",
											children: "Full Turnkey (Honey + Jars + Labels)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Filling Only (We provide packaging)",
											children: "Filling Only (I will provide packaging)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Bulk Honey Supply Only",
											children: "Bulk Honey Supply Only (Drums/Buckets)"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									placeholder: "Describe your vision, flavors needed, or any specific certifications...",
									value: form.message,
									onChange: (e) => set("message", e.target.value),
									className: "w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706] min-h-[120px] resize-y"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: loading,
									className: "w-full py-4 bg-[#D97706] hover:bg-[#B57420] text-white font-bold tracking-widest uppercase rounded-xl transition-colors disabled:opacity-70 mt-2",
									children: loading ? "Sending..." : "Start Your Honey Brand"
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
										href: "mailto:oem@saurashtrahoney.com",
										className: "hover:text-[#D97706]",
										children: "✉️ oem@saurashtrahoney.com"
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
export { PrivateLabelPage as component };
