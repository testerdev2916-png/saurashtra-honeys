import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/StructuredData-C0TBI3qI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function StructuredData({ data }) {
	const id = `ld-${(0, import_react.useId)().replace(/[:]/g, "")}`;
	(0, import_react.useEffect)(() => {
		let el = document.getElementById(id);
		if (!el) {
			el = document.createElement("script");
			el.type = "application/ld+json";
			el.id = id;
			document.head.appendChild(el);
		}
		el.text = JSON.stringify(data);
		return () => {
			el?.remove();
		};
	}, [id, data]);
	return null;
}
function breadcrumbLd(items) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((it, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: it.name,
			item: it.url
		}))
	};
}
function productLd(p, origin = "") {
	return {
		"@context": "https://schema.org",
		"@type": "Product",
		name: p.name,
		description: p.description,
		image: origin + p.image,
		sku: p.slug,
		brand: {
			"@type": "Brand",
			name: "Saurashtra Honey"
		},
		offers: {
			"@type": "Offer",
			price: p.price,
			priceCurrency: "INR",
			availability: "https://schema.org/InStock",
			url: `${origin}/product/${p.slug}`
		},
		...p.rating && p.reviews ? { aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: p.rating,
			reviewCount: p.reviews
		} } : {}
	};
}
function organizationLd(origin = "") {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "Saurashtra Honey",
		url: origin || void 0,
		logo: origin + "/favicon.ico",
		sameAs: []
	};
}
//#endregion
export { productLd as i, breadcrumbLd as n, organizationLd as r, StructuredData as t };
