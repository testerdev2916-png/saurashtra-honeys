import { i as __toESM } from "../_runtime.mjs";
import { f as prod_giftpack_default, n as bee_flower_default } from "./team-beekeepers-DfClHD0g.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { R as PenTool, St as Gift, b as Sparkles, zt as CircleCheck } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as hero_honey_default } from "./product-images-CLm3Xqgk.mjs";
import { a as literalType, l as stringType, s as objectType } from "../_libs/zod.mjs";
import { n as SiteLayout } from "./Layout-BROfU7ZF.mjs";
import { t as submitForm } from "./submit-p7h-oKeY.mjs";
import { t as PageHeroSlider } from "./PageHeroSlider-B2niNRj-.mjs";
import { n as breadcrumbLd, t as StructuredData } from "./StructuredData-C0TBI3qI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gift-hampers-DEWH6OHF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var schema = objectType({
	name: stringType().trim().min(2, "Name is required").max(100),
	email: stringType().trim().email("Enter a valid email").max(255),
	phone: stringType().trim().min(7, "Enter a valid phone").max(20),
	occasion: stringType().min(1, "Occasion is required"),
	quantity: stringType().min(1, "Quantity is required"),
	customization: stringType().min(1, "Preference is required"),
	message: stringType().trim().max(1e3).optional().or(literalType(""))
});
function GiftHampersPage() {
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		email: "",
		phone: "",
		occasion: "",
		quantity: "",
		customization: "",
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
				company: "N/A",
				city: "N/A",
				quantity: form.quantity,
				message: form.message,
				meta: {
					purpose: "Gift Hampers",
					occasion: form.occasion,
					customization: form.customization
				}
			});
			toast.success("Design request received!", { description: "Our gifting specialist will contact you shortly." });
			setForm({
				name: "",
				email: "",
				phone: "",
				occasion: "",
				quantity: "",
				customization: "",
				message: ""
			});
		} catch {
			toast.error("Couldn't submit right now. Please call +91 96873 28404.");
		} finally {
			setLoading(false);
		}
	}
	function scrollToForm() {
		document.getElementById("design-hamper")?.scrollIntoView({
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
				name: "Gift Hampers",
				url: "/gift-hampers"
			}
		]) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeroSlider, { page: "bulk-orders" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bg-[#2B2118] py-6 flex justify-center gap-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: scrollToForm,
				className: "bg-[#D97706] text-white px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-[#B57420] transition-colors",
				children: "Design My Gift Hamper"
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
							children: "Meaningful Gifting"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-[34px] sm:text-[44px] text-[#2B2118] leading-tight",
							children: "Curated with Care, Wrapped with Love"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[#6B6257] leading-relaxed text-[16px]",
							children: "Gift health, taste, and purity. Our premium honey hampers are designed to make your special occasions unforgettable. Whether it's a wedding return gift or a festive family present, Saurashtra Honey delivers joy in every jar."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-4 pt-4",
							children: [
								"Beautiful Luxury Packaging",
								"Personalized Handwritten Notes",
								"Premium Satin Ribbon Options",
								"Selection of Exotic Flora Honey"
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
					className: "flex-1 w-full relative aspect-[4/5] rounded-[24px] overflow-hidden shadow-lg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: hero_honey_default,
						alt: "Luxury Honey Hamper",
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
						children: "Hamper Customizations"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-8 bg-[#FDFBF7] rounded-[24px] border border-[#D97706]/15 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
									className: "size-10 text-[#D97706] mx-auto mb-6",
									strokeWidth: 1.5
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-serif text-[22px] font-bold text-[#2B2118] mb-3",
									children: "Premium Presentation"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[#6B6257] leading-relaxed",
									children: "Elegant wooden boxes, gold foil detailing, and custom ribbons for an unforgettable unboxing."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-8 bg-[#FDFBF7] rounded-[24px] border border-[#D97706]/15 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenTool, {
									className: "size-10 text-[#D97706] mx-auto mb-6",
									strokeWidth: 1.5
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-serif text-[22px] font-bold text-[#2B2118] mb-3",
									children: "Personalized Notes"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[#6B6257] leading-relaxed",
									children: "Add a touch of warmth with custom printed or handwritten message cards in every box."
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
									children: "Curated Varieties"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[#6B6257] leading-relaxed",
									children: "Combine distinct flavors like Ajwain, Fennel, and Lychee in beautifully matched sets."
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
						children: "Designing Your Hamper"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto",
					children: [
						"Select Honey Flavors",
						"Choose Packaging Style",
						"Add Personalization",
						"Delivered Safely"
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
					children: "Perfect For Every Occasion"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap justify-center gap-6 max-w-4xl mx-auto",
					children: [
						"Wedding Invitations",
						"Return Gifts",
						"Diwali & Festivals",
						"Baby Showers",
						"Birthdays",
						"Anniversaries"
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
						hero_honey_default,
						prod_giftpack_default,
						bee_flower_default
					].map((img, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "aspect-square overflow-hidden rounded-[16px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: img,
							alt: "Gift Hampers",
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
							q: "Can I mix different sizes of honey jars in one hamper?",
							a: "Yes, our luxury gift boxes are designed to hold various combinations of 250g and 500g jars."
						},
						{
							q: "Is there a minimum order for custom ribbon and tags?",
							a: "Custom tags and ribbon printing are available for orders of 25 hampers or more."
						},
						{
							q: "Do you deliver pan-India for weddings?",
							a: "Absolutely! We specialize in secure, pan-India logistics to ensure your hampers arrive perfectly intact."
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
						children: "Happy Families"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-serif text-[24px] sm:text-[32px] text-[#2B2118] leading-relaxed italic",
						children: "\"We used Saurashtra Honey hampers as our wedding return gifts. The packaging was absolutely stunning and our guests loved the premium quality and the personalized tags.\""
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 font-bold text-[#6B6257] uppercase tracking-widest text-[14px]",
						children: "— Priya & Rahul, Mumbai"
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			id: "design-hamper",
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
								children: "Design My Gift Hamper"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[#6B6257]",
								children: "Tell us about your occasion, and our design team will help you craft the perfect gift."
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
										type: "email",
										placeholder: "Email Address",
										value: form.email,
										onChange: (e) => set("email", e.target.value),
										className: "w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706]",
										required: true
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: form.occasion,
										onChange: (e) => set("occasion", e.target.value),
										className: "w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706] appearance-none",
										required: true,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												disabled: true,
												children: "Occasion"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Wedding",
												children: "Wedding"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Festival",
												children: "Festival"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Birthday / Anniversary",
												children: "Birthday / Anniversary"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Other",
												children: "Other"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: form.quantity,
										onChange: (e) => set("quantity", e.target.value),
										className: "w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706] appearance-none",
										required: true,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												disabled: true,
												children: "Number of Hampers"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "10-50",
												children: "10 - 50 Hampers"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "50-150",
												children: "50 - 150 Hampers"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "150+",
												children: "150+ Hampers"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: form.customization,
										onChange: (e) => set("customization", e.target.value),
										className: "w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706] appearance-none",
										required: true,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												disabled: true,
												children: "Customization Need"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Standard Premium Box",
												children: "Standard Premium Box"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Custom Tags & Notes",
												children: "Custom Tags & Notes"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Fully Custom Branding",
												children: "Fully Custom Branding"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									placeholder: "Tell us more about your ideas or preferences...",
									value: form.message,
									onChange: (e) => set("message", e.target.value),
									className: "w-full px-5 py-3.5 bg-[#FDFBF7] border border-[#D97706]/20 rounded-xl focus:outline-none focus:border-[#D97706] min-h-[120px] resize-y"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: loading,
									className: "w-full py-4 bg-[#D97706] hover:bg-[#B57420] text-white font-bold tracking-widest uppercase rounded-xl transition-colors disabled:opacity-70 mt-2",
									children: loading ? "Sending..." : "Submit Enquiry"
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
export { GiftHampersPage as component };
