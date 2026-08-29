import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var inp = "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep";
function Field({ label, children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: `block ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs font-semibold text-forest-dark",
			children: label
		}), children]
	});
}
function PageHeader({ title, subtitle, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap justify-between items-end gap-3 mb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-serif text-2xl lg:text-3xl text-forest-dark",
			children: title
		}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground mt-1",
			children: subtitle
		})] }), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-2 flex-wrap",
			children: actions
		})]
	});
}
function Card({ children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `bg-white border border-border rounded-2xl ${className}`,
		children
	});
}
function TableWrap({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-white border border-border rounded-2xl overflow-hidden overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
			className: "w-full text-sm",
			children
		})
	});
}
function Th({ children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
		className: `px-4 py-3 text-[11px] font-bold tracking-wider uppercase text-forest-dark bg-cream/60 text-left ${className}`,
		children
	});
}
function Td({ children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
		className: `px-4 py-3 align-top ${className}`,
		children
	});
}
function StatusPill({ s }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `text-[10px] font-bold tracking-wider uppercase rounded px-2 py-1 ${[
			"paid",
			"delivered",
			"approved",
			"completed",
			"active",
			"published",
			"live"
		].includes(s) ? "bg-forest text-cream" : [
			"shipped",
			"processing",
			"packed",
			"confirmed",
			"in_progress"
		].includes(s) ? "bg-gold text-forest-dark" : [
			"cancelled",
			"refunded",
			"rejected",
			"disabled",
			"archived"
		].includes(s) ? "bg-destructive/15 text-destructive" : "bg-cream text-forest-dark border border-border"}`,
		children: s
	});
}
function BtnPrimary(props) {
	const { className = "", ...rest } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		...rest,
		className: `inline-flex items-center gap-2 bg-forest-dark text-cream rounded-lg px-4 py-2 text-xs font-bold tracking-widest hover:bg-forest disabled:opacity-60 ${className}`
	});
}
function BtnGhost(props) {
	const { className = "", ...rest } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		...rest,
		className: `inline-flex items-center gap-2 border border-border rounded-lg px-3 py-2 text-xs font-semibold hover:border-gold-deep ${className}`
	});
}
function csvDownload(rows, cols, filename) {
	const esc = (v) => `"${String(v ?? "").replace(/"/g, "\"\"").replace(/\n/g, " ")}"`;
	const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
	const blob = new Blob([csv], { type: "text/csv" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
function paise(p) {
	return `₹${((p ?? 0) / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}
//#endregion
export { PageHeader as a, Td as c, inp as d, paise as f, Field as i, Th as l, BtnPrimary as n, StatusPill as o, Card as r, TableWrap as s, BtnGhost as t, csvDownload as u };
