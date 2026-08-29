import "../_runtime.mjs";
import { a as honeycomb_bees_default, i as honey_drizzle_default, n as bee_flower_default, o as prod_ajwain_default, r as family_honey_default, t as bee_farm_default } from "./team-beekeepers-DfClHD0g.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function resolvePostImage(url, categoryOrSlug) {
	if (url && (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/"))) return url;
	const key = (categoryOrSlug || "").toLowerCase();
	if (key.includes("health") || key.includes("ajwain") || key.includes("benefit")) return prod_ajwain_default;
	if (key.includes("farm") || key.includes("beekeeping") || key.includes("cycle")) return bee_farm_default;
	if (key.includes("ayurveda") || key.includes("remed") || key.includes("raw")) return honey_drizzle_default;
	if (key.includes("sustain") || key.includes("planet") || key.includes("bloom") || key.includes("flora")) return bee_flower_default;
	if (key.includes("comb") || key.includes("hive")) return honeycomb_bees_default;
	if (key.includes("purity") || key.includes("nabl") || key.includes("unadulterated")) return family_honey_default;
	return honey_drizzle_default;
}
function formatPostDate(isoString) {
	if (!isoString) return "May 14, 2024";
	try {
		const d = new Date(isoString);
		if (isNaN(d.getTime())) return "May 14, 2024";
		return d.toLocaleDateString("en-US", {
			month: "short",
			day: "2-digit",
			year: "numeric"
		});
	} catch {
		return "May 14, 2024";
	}
}
function extractTableOfContents(markdown) {
	if (!markdown) return [];
	const lines = markdown.split("\n");
	const toc = [];
	let count = 0;
	for (const line of lines) {
		const trim = line.trim();
		if (trim.startsWith("## ")) {
			const text = trim.replace(/^##\s+/, "").trim();
			toc.push({
				id: `heading-${count++}`,
				text,
				level: 2
			});
		} else if (trim.startsWith("### ")) {
			const text = trim.replace(/^###\s+/, "").trim();
			toc.push({
				id: `heading-${count++}`,
				text,
				level: 3
			});
		}
	}
	return toc;
}
function parseInlineFormatting(text) {
	const parts = [];
	const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
	let lastIdx = 0;
	let match;
	while ((match = regex.exec(text)) !== null) {
		if (match.index > lastIdx) parts.push(text.slice(lastIdx, match.index));
		const token = match[0];
		if (token.startsWith("**") && token.endsWith("**")) parts.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
			className: "font-bold text-espresso",
			children: token.slice(2, -2)
		}, match.index));
		else if (token.startsWith("*") && token.endsWith("*")) parts.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
			className: "italic text-espresso/95",
			children: token.slice(1, -1)
		}, match.index));
		else if (token.startsWith("[")) {
			const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
			if (linkMatch) parts.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: linkMatch[2],
				target: "_blank",
				rel: "noopener noreferrer",
				className: "text-burnt-orange font-bold underline hover:text-terracotta transition-colors",
				children: linkMatch[1]
			}, match.index));
			else parts.push(token);
		} else parts.push(token);
		lastIdx = regex.lastIndex;
	}
	if (lastIdx < text.length) parts.push(text.slice(lastIdx));
	return parts.length === 0 ? [text] : parts;
}
function renderMarkdown(markdown) {
	if (!markdown || !markdown.trim()) return [];
	const blocks = markdown.split(/\n\n+/);
	let headingCount = 0;
	return blocks.map((block, idx) => {
		const trim = block.trim();
		if (trim.startsWith("![") && trim.includes("](")) {
			const imgMatch = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(trim);
			if (imgMatch) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "my-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: imgMatch[2],
					alt: imgMatch[1] || "Article illustration",
					loading: "lazy",
					className: "w-full rounded-2xl shadow-soft border border-border/80 object-cover aspect-[16/9]"
				}), imgMatch[1] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-center text-xs text-muted-foreground italic",
					children: imgMatch[1]
				})]
			}, idx);
		}
		if (trim.startsWith("## ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			id: `heading-${headingCount++}`,
			className: "font-serif text-2xl md:text-3xl font-bold text-espresso mt-10 mb-4 pb-3 border-b border-border/60 scroll-mt-28",
			children: parseInlineFormatting(trim.replace(/^##\s+/, ""))
		}, idx);
		if (trim.startsWith("### ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			id: `heading-${headingCount++}`,
			className: "font-serif text-xl md:text-2xl font-bold text-espresso mt-8 mb-3 scroll-mt-28",
			children: parseInlineFormatting(trim.replace(/^###\s+/, ""))
		}, idx);
		if (trim.startsWith("> ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", {
			className: "italic text-base md:text-lg text-espresso/95 bg-cream-deep/60 p-6 rounded-2xl border-l-4 border-burnt-orange my-6 shadow-xs leading-relaxed",
			children: parseInlineFormatting(trim.replace(/^>\s*/gm, ""))
		}, idx);
		if (trim.startsWith("- ") || trim.startsWith("* ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "list-disc list-inside space-y-2.5 my-6 text-[15px] leading-relaxed text-foreground/90 bg-cream/30 p-6 rounded-2xl border border-border/50",
			children: trim.split("\n").map((line) => line.replace(/^[-*]\s+/, "")).map((item, itemIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "pl-1",
				children: parseInlineFormatting(item)
			}, itemIdx))
		}, idx);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[15px] md:text-base text-foreground/90 leading-relaxed my-4",
			children: parseInlineFormatting(trim)
		}, idx);
	});
}
//#endregion
export { resolvePostImage as i, formatPostDate as n, renderMarkdown as r, extractTableOfContents as t };
