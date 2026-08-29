import { i as __toESM } from "../_runtime.mjs";
import { a as honeycomb_bees_default, i as honey_drizzle_default, n as bee_flower_default, r as family_honey_default, t as bee_farm_default } from "./team-beekeepers-DfClHD0g.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as Sparkles, ht as HeartHandshake, rt as Leaf, zt as CircleCheck } from "../_libs/lucide-react.mjs";
import { n as SiteLayout } from "./Layout-BROfU7ZF.mjs";
import { t as PageHeroSlider } from "./PageHeroSlider-B2niNRj-.mjs";
import { n as breadcrumbLd, r as organizationLd, t as StructuredData } from "./StructuredData-C0TBI3qI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/our-story-BaeqldE8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var our_bee_farm_timeline_default = "/assets/our-bee-farm-timeline-CF0sJ7dK.jpg";
var our_bees_illustration_default = "/assets/our-bees-illustration-BKmnyXMY.jpg";
function OurStory() {
	(0, import_react.useEffect)(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("animate-in", "fade-in", "slide-in-from-bottom-8", "duration-1000", "opacity-100");
					entry.target.classList.remove("opacity-0", "translate-y-8");
					observer.unobserve(entry.target);
				}
			});
		}, {
			threshold: .15,
			rootMargin: "0px 0px -50px 0px"
		});
		document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
			observer.observe(el);
		});
		return () => observer.disconnect();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StructuredData, { data: [breadcrumbLd([{
		name: "Home",
		url: "/"
	}, {
		name: "Our Story",
		url: "/our-story"
	}]), organizationLd()] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "bg-[#F8F5EF] min-h-screen text-[#2B2118] overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeroSlider, { page: "our-story" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "the-beginning",
				className: "pt-20 pb-12 md:pt-32 md:pb-16 bg-[#FDFBF7]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "container-page text-center mb-10 md:mb-14 reveal-on-scroll opacity-0 translate-y-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] sm:text-[12px] uppercase tracking-[0.3em] text-[#A6610E] font-[600] block",
							children: "OUR STORY"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full mb-12 md:mb-16",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "container-page flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-4 gap-6 md:gap-10 pb-8 md:pb-0 [&::-webkit-scrollbar]:hidden",
							style: {
								scrollbarWidth: "none",
								msOverflowStyle: "none",
								WebkitOverflowScrolling: "touch"
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "snap-start shrink-0 w-[70vw] md:w-auto flex flex-col items-center text-center reveal-on-scroll opacity-0 translate-y-8",
									style: { animationDelay: "100ms" },
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: "/images/heritage/illus_wildflower.png",
											alt: "The Beginning",
											className: "w-[160px] h-[160px] md:w-[200px] md:h-[200px] object-contain mix-blend-multiply opacity-90 mb-6 hover:opacity-100 transition-opacity duration-500"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] uppercase tracking-[0.2em] text-[#A6610E] font-bold mb-3",
											children: "01"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-serif text-xl font-bold text-[#2B2118] mb-2",
											children: "The Beginning"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-[#2B2118]/70 leading-relaxed px-4",
											children: "Rooted in the wild landscapes of Saurashtra."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "snap-start shrink-0 w-[70vw] md:w-auto flex flex-col items-center text-center reveal-on-scroll opacity-0 translate-y-8",
									style: { animationDelay: "200ms" },
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: "/images/heritage/illus_beekeeping.png",
											alt: "The Bees",
											className: "w-[160px] h-[160px] md:w-[200px] md:h-[200px] object-contain mix-blend-multiply opacity-90 mb-6 hover:opacity-100 transition-opacity duration-500"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] uppercase tracking-[0.2em] text-[#A6610E] font-bold mb-3",
											children: "02"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-serif text-xl font-bold text-[#2B2118] mb-2",
											children: "The Bees"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-[#2B2118]/70 leading-relaxed px-4",
											children: "Healthy bees, thriving among wildflowers."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "snap-start shrink-0 w-[70vw] md:w-auto flex flex-col items-center text-center reveal-on-scroll opacity-0 translate-y-8",
									style: { animationDelay: "300ms" },
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: "/images/heritage/illus_hive_to_home.png",
											alt: "Careful Harvest",
											className: "w-[160px] h-[160px] md:w-[200px] md:h-[200px] object-contain mix-blend-multiply opacity-90 mb-6 hover:opacity-100 transition-opacity duration-500"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] uppercase tracking-[0.2em] text-[#A6610E] font-bold mb-3",
											children: "03"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-serif text-xl font-bold text-[#2B2118] mb-2",
											children: "Careful Harvest"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-[#2B2118]/70 leading-relaxed px-4",
											children: "Honey gathered with care and responsibility."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "snap-start shrink-0 w-[70vw] md:w-auto flex flex-col items-center text-center reveal-on-scroll opacity-0 translate-y-8",
									style: { animationDelay: "400ms" },
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: "/images/heritage/illus_pure.png",
											alt: "From Hive to Home",
											className: "w-[160px] h-[160px] md:w-[200px] md:h-[200px] object-contain mix-blend-multiply opacity-90 mb-6 hover:opacity-100 transition-opacity duration-500"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] uppercase tracking-[0.2em] text-[#A6610E] font-bold mb-3",
											children: "04"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-serif text-xl font-bold text-[#2B2118] mb-2",
											children: "From Hive to Home"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-[#2B2118]/70 leading-relaxed px-4",
											children: "Pure honey, brought from our hives to you."
										})
									]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "container-page text-center max-w-[800px] mx-auto reveal-on-scroll opacity-0 translate-y-8",
						style: { animationDelay: "500ms" },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-[#2B2118]",
								children: "The Beginning"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg md:text-xl leading-relaxed text-[#2B2118]/80 mb-6 font-light",
								children: "Saurashtra Honey was born from a deep respect for nature and a simple belief: the best honey comes from healthy bees living in a healthy environment."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg md:text-xl leading-relaxed text-[#2B2118]/80 mb-10 font-light",
								children: "Nestled in the rich, diverse landscapes of Saurashtra, our journey started with a commitment to pure, ethical beekeeping. We don't just harvest honey; we nurture the ecosystem that makes it possible."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "#our-bees",
								className: "inline-flex items-center justify-center bg-transparent border border-[#A6610E] text-[#A6610E] px-8 py-3.5 rounded-full font-bold text-[12px] tracking-[0.15em] hover:bg-[#A6610E] hover:text-white transition-all duration-400 mt-4",
								onClick: (e) => {
									e.preventDefault();
									document.getElementById("our-bees")?.scrollIntoView({ behavior: "smooth" });
								},
								children: "OUR JOURNEY →"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "from-hive-to-honey",
				className: "pt-0 pb-20 md:pb-32 bg-[#FDFBF7] relative overflow-hidden flex flex-col items-center w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full max-w-none px-0 reveal-on-scroll opacity-0 translate-y-8 flex flex-col items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: our_bee_farm_timeline_default,
						alt: "Our Bee Farm - From Hive to Honey Timeline",
						className: "w-full h-auto block object-contain",
						loading: "lazy"
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "our-bees",
				className: "py-20 md:py-32 container-page",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative rounded-3xl overflow-hidden shadow-2xl reveal-on-scroll opacity-0 translate-y-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: our_bees_illustration_default,
							alt: "Custom illustration of our healthy bees and honeycomb",
							className: "w-full h-auto block object-cover hover:scale-105 transition-transform duration-1000"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "reveal-on-scroll opacity-0 translate-y-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-bold tracking-[0.2em] uppercase text-brand-orange mb-4 block",
								children: "The Heart of Our Brand"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-serif text-3xl md:text-5xl font-bold mb-6",
								children: "Our Bees"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg text-foreground/80 leading-relaxed mb-6",
								children: "Healthy bees are the foundation of everything we do. A strong, vibrant colony is essential not only for producing premium honey but also for sustaining the local environment through pollination."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg text-foreground/80 leading-relaxed",
								children: "We closely monitor the health and vitality of our hives, ensuring our bees have everything they need to flourish naturally. Our deep understanding of bee behavior guides our gentle approach to colony management."
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "responsible-beekeeping",
				className: "py-24 bg-[#FDFBF7] text-[#2B2118]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container-page text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-3xl mx-auto reveal-on-scroll opacity-0 translate-y-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-3xl md:text-5xl font-bold mb-8 text-[#2B2118]",
							children: "Responsible Beekeeping"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg md:text-xl text-[#2B2118]/80 leading-relaxed mb-12",
							children: "Our beekeeping practices are rooted in respect for the natural ecosystem. We harvest honey only at the right time, ensuring the bees always have enough reserves for themselves. We believe in minimal intervention—letting nature take its course while we serve as careful stewards of the hives."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid md:grid-cols-3 gap-8 text-left mt-16",
						children: [
							{
								title: "Gentle Harvesting",
								desc: "Extracting honey without harming the comb or the colony.",
								icon: HeartHandshake
							},
							{
								title: "Natural Foraging",
								desc: "Placing hives near rich, pesticide-free floral sources.",
								icon: Sparkles
							},
							{
								title: "Ecosystem First",
								desc: "Supporting local biodiversity through active pollination.",
								icon: Leaf
							}
						].map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-[#F8F5EF] rounded-2xl p-8 border border-[#2B2118]/5 reveal-on-scroll opacity-0 translate-y-8",
							style: { animationDelay: `${i * 150}ms` },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-10 text-brand-orange mb-6" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-serif text-2xl font-bold mb-4 text-[#2B2118]",
									children: item.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[#2B2118]/70 leading-relaxed",
									children: item.desc
								})
							]
						}, i))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "py-20 bg-white",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "container-page",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid lg:grid-cols-2 gap-12 lg:gap-24 items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "order-2 lg:order-1 relative rounded-3xl overflow-hidden shadow-2xl h-[400px] lg:h-[500px] reveal-on-scroll opacity-0 translate-y-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: honey_drizzle_default,
								alt: "Pure golden honey",
								className: "w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "order-1 lg:order-2 reveal-on-scroll opacity-0 translate-y-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-serif text-3xl md:text-5xl font-bold mb-6",
									children: "Pure & Natural"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-16 h-1 bg-brand-orange mb-8 rounded-full" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-lg text-foreground/80 leading-relaxed mb-6",
									children: "Our philosophy is simple: honey should be exactly as the bees made it. We do not pasteurize, ultra-filter, or add anything artificial."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-lg text-foreground/80 leading-relaxed",
									children: "By maintaining this commitment to rawness, we preserve the natural pollens, enzymes, and unique floral profiles that give our honey its authentic character and distinct regional taste."
								})
							]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "py-24 bg-cream-deep/30",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container-page",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center max-w-2xl mx-auto mb-16 reveal-on-scroll opacity-0 translate-y-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-3xl md:text-5xl font-bold mb-6",
							children: "Our Commitment"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-foreground/70 text-lg",
							children: "A promise to our bees, our environment, and to you."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto",
						children: [
							"Respecting bees and their natural rhythms.",
							"Practicing responsible and ethical beekeeping.",
							"Protecting and nurturing natural ecosystems.",
							"Maintaining uncompromised raw quality.",
							"Supporting local environments and farmers.",
							"Delivering 100% authentic, traceable honey."
						].map((text, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white p-6 rounded-2xl shadow-sm flex items-start gap-4 border border-border/40 reveal-on-scroll opacity-0 translate-y-8",
							style: { animationDelay: `${i * 100}ms` },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-6 text-brand-orange shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-foreground/90 font-medium leading-relaxed",
								children: text
							})]
						}, i))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "py-24 container-page",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center mb-16 reveal-on-scroll opacity-0 translate-y-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-3xl md:text-5xl font-bold mb-4",
						children: "Life on the Farm"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-foreground/70 text-lg",
						children: "A glimpse into our daily dedication."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-2 md:col-span-1 row-span-2 rounded-3xl overflow-hidden shadow-md reveal-on-scroll opacity-0 translate-y-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: bee_farm_default,
								alt: "Farm landscape",
								className: "w-full h-full object-cover hover:scale-105 transition-transform duration-700"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-3xl overflow-hidden shadow-md aspect-square md:aspect-auto h-[200px] md:h-full reveal-on-scroll opacity-0 translate-y-8",
							style: { animationDelay: "100ms" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: honeycomb_bees_default,
								alt: "Honeycomb",
								className: "w-full h-full object-cover hover:scale-105 transition-transform duration-700"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-3xl overflow-hidden shadow-md aspect-square md:aspect-auto h-[200px] md:h-full reveal-on-scroll opacity-0 translate-y-8",
							style: { animationDelay: "200ms" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: bee_flower_default,
								alt: "Bee on flower",
								className: "w-full h-full object-cover hover:scale-105 transition-transform duration-700"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-2 rounded-3xl overflow-hidden shadow-md h-[250px] md:h-[300px] reveal-on-scroll opacity-0 translate-y-8",
							style: { animationDelay: "300ms" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: family_honey_default,
								alt: "Beekeeping community",
								className: "w-full h-full object-cover hover:scale-105 transition-transform duration-700"
							})
						})
					]
				})]
			})
		]
	})] });
}
//#endregion
export { OurStory as component };
