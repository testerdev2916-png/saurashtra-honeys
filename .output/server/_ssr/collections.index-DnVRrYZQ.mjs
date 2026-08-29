import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Ht as ChevronRight, b as Sparkles, in as ArrowRight } from "../_libs/lucide-react.mjs";
import { r as getCategoryMetadata, t as DEDICATED_COLLECTION_SLUGS } from "./collection-helpers-DAdv5muE.mjs";
import { n as SiteLayout } from "./Layout-BROfU7ZF.mjs";
import { n as breadcrumbLd, t as StructuredData } from "./StructuredData-C0TBI3qI.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function CollectionsIndexPage() {
	const collections = DEDICATED_COLLECTION_SLUGS.map((slug) => getCategoryMetadata(slug));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StructuredData, { data: breadcrumbLd([
			{
				name: "Home",
				url: "/"
			},
			{
				name: "Shop",
				url: "/shop"
			},
			{
				name: "Collections",
				url: "/collections"
			}
		]) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bg-[#1A140F] border-b border-white/10 pt-6 pb-3 px-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page flex items-center gap-2 text-xs md:text-sm tracking-wide text-cream/70 font-sans",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "hover:text-gold transition-colors duration-200",
						children: "Home"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3.5 text-cream/40" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						className: "hover:text-gold transition-colors duration-200 font-medium",
						children: "Shop"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3.5 text-cream/40" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-gold font-semibold tracking-wider uppercase",
						children: "Collections"
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-[#1A140F] text-cream py-16 sm:py-24 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page max-w-3xl px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs tracking-[0.25em] uppercase text-gold font-medium mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5 text-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Saurashtra Honey • Catalog" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-4xl sm:text-6xl font-medium text-white tracking-tight mb-4",
						children: "Artisanal Collections"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-cream/80 text-base sm:text-lg leading-relaxed font-light",
						children: "Every collection is harvested with care from our apiaries across Saurashtra. Explore our range of pure honeys, natural beeswax, superfood bee pollen, and luxury gifts."
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-20 sm:py-28 bg-[#F8F5EF]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-page px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
					children: collections.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/collections/$slug",
						params: { slug: col.slug },
						className: "group relative rounded-[28px] overflow-hidden bg-white border border-border/80 shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.14)] hover:-translate-y-2 transition-all duration-500 flex flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative aspect-[4/3] overflow-hidden bg-[#F8F5EF]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: col.heroImage,
									alt: col.name,
									className: "w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute bottom-4 left-6 right-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] tracking-[0.2em] uppercase text-gold font-bold",
										children: "COLLECTION"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-serif text-2xl font-medium text-white group-hover:text-gold transition-colors duration-300",
										children: col.name
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-6 sm:p-8 flex-1 flex flex-col justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-espresso/75 text-sm leading-relaxed mb-6",
								children: col.heroDescription
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-2 text-sm font-semibold text-[#D97706] group-hover:translate-x-1 transition-transform duration-300",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Explore Collection" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
							})]
						})]
					}, col.slug))
				})
			})
		})
	] });
}
//#endregion
export { CollectionsIndexPage as component };
