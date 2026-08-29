import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as supabase } from "./client-CiOF68Zx.mjs";
import { t as useServerFn } from "./useServerFn-BqzygRuj.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-Uqm2rRc8.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-ZAYK2SXy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.marketing-b7aXVr1c.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var updateSiteSettings = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("afc995e6400aa2dc6d12f04a990623f12023f4496bfccbfda32702d28d40d61c"));
function Page() {
	const [tab, setTab] = (0, import_react.useState)("seo");
	const [data, setData] = (0, import_react.useState)({});
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const save = useServerFn(updateSiteSettings);
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data: row } = await supabase.from("app_settings").select("data").eq("id", 1).maybeSingle();
			setData(row?.data ?? {});
			setLoading(false);
		})();
	}, []);
	function update(section, key, value) {
		setData((d) => ({
			...d,
			[section]: {
				...d[section] ?? {},
				[key]: value
			}
		}));
	}
	async function persist() {
		setSaving(true);
		try {
			await save({ data: { data } });
			toast.success("Settings saved");
		} catch (e) {
			toast.error(e.message);
		} finally {
			setSaving(false);
		}
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-6 text-sm text-muted-foreground",
		children: "Loading…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-4xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-2xl text-forest-dark",
				children: "Marketing & Settings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Global configuration used across the storefront."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1 border-b border-border",
				children: [
					["seo", "SEO"],
					["analytics", "Analytics"],
					["social", "Social"],
					["whatsapp", "WhatsApp"],
					["loyalty", "Loyalty"],
					["features", "Features"],
					["robots", "Robots"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setTab(id),
					className: `px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === id ? "border-gold text-forest-dark" : "border-transparent text-muted-foreground hover:text-forest-dark"}`,
					children: label
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-border rounded-xl p-6 space-y-4",
				children: [
					tab === "seo" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							label: "Default Title",
							v: s(data, "seo", "default_title"),
							onChange: (v) => update("seo", "default_title", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							label: "Default Description",
							textarea: true,
							v: s(data, "seo", "default_description"),
							onChange: (v) => update("seo", "default_description", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							label: "Default Keywords",
							v: s(data, "seo", "default_keywords"),
							onChange: (v) => update("seo", "default_keywords", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							label: "Default OG Image URL",
							v: s(data, "seo", "default_og_image"),
							onChange: (v) => update("seo", "default_og_image", v)
						})
					] }),
					tab === "analytics" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							label: "GA4 Measurement ID",
							placeholder: "G-XXXXXXX",
							v: s(data, "analytics", "ga4_measurement_id"),
							onChange: (v) => update("analytics", "ga4_measurement_id", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							label: "Meta Pixel ID",
							v: s(data, "analytics", "meta_pixel_id"),
							onChange: (v) => update("analytics", "meta_pixel_id", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							label: "Microsoft Clarity ID",
							v: s(data, "analytics", "clarity_id"),
							onChange: (v) => update("analytics", "clarity_id", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							label: "Search Console Verification",
							v: s(data, "analytics", "gsc_verification"),
							onChange: (v) => update("analytics", "gsc_verification", v)
						})
					] }),
					tab === "social" && [
						"instagram",
						"facebook",
						"youtube",
						"linkedin",
						"x",
						"pinterest"
					].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
						label: k.toUpperCase(),
						v: s(data, "social", k),
						onChange: (v) => update("social", k, v)
					}, k)),
					tab === "whatsapp" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							label: "Show floating WhatsApp button",
							checked: b(data, "whatsapp", "enabled"),
							onChange: (v) => update("whatsapp", "enabled", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							label: "WhatsApp Number (with country code, no +)",
							v: s(data, "whatsapp", "number"),
							onChange: (v) => update("whatsapp", "number", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							label: "Default Message",
							textarea: true,
							v: s(data, "whatsapp", "default_message"),
							onChange: (v) => update("whatsapp", "default_message", v)
						})
					] }),
					tab === "loyalty" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							label: "Enable loyalty program",
							checked: b(data, "loyalty", "enabled"),
							onChange: (v) => update("loyalty", "enabled", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							label: "Points per Rupee",
							type: "number",
							v: String(n(data, "loyalty", "points_per_rupee")),
							onChange: (v) => update("loyalty", "points_per_rupee", Number(v) || 0)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							label: "Redeem rate (paise per point)",
							type: "number",
							v: String(n(data, "loyalty", "redeem_rate_paise")),
							onChange: (v) => update("loyalty", "redeem_rate_paise", Number(v) || 0)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							label: "Referral reward (referrer)",
							type: "number",
							v: String(n(data, "loyalty", "referral_reward")),
							onChange: (v) => update("loyalty", "referral_reward", Number(v) || 0)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							label: "Referred bonus (new user)",
							type: "number",
							v: String(n(data, "loyalty", "referred_reward")),
							onChange: (v) => update("loyalty", "referred_reward", Number(v) || 0)
						})
					] }),
					tab === "features" && [
						"recently_purchased_popup",
						"trust_badges",
						"low_stock_message",
						"exit_intent_ready"
					].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						label: k.replace(/_/g, " "),
						checked: b(data, "features", k),
						onChange: (v) => update("features", k, v)
					}, k)),
					tab === "robots" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-semibold mb-1",
						children: "Disallow paths (one per line)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						className: "w-full min-h-[120px] border border-border rounded-lg p-2 text-sm font-mono",
						value: (data.robots?.disallow_paths ?? []).join("\n"),
						onChange: (e) => update("robots", "disallow_paths", e.target.value.split(/\n+/).map((s) => s.trim()).filter(Boolean))
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
						label: "Extra rules",
						textarea: true,
						v: s(data, "robots", "extra"),
						onChange: (v) => update("robots", "extra", v)
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					disabled: saving,
					onClick: persist,
					className: "bg-forest-dark text-cream rounded-lg px-6 py-3 text-xs font-bold tracking-widest hover:bg-forest disabled:opacity-60",
					children: saving ? "SAVING…" : "SAVE CHANGES"
				})
			})
		]
	});
}
function s(d, section, key) {
	const v = d[section]?.[key];
	return typeof v === "string" ? v : "";
}
function n(d, section, key) {
	const v = d[section]?.[key];
	return typeof v === "number" ? v : 0;
}
function b(d, section, key) {
	return Boolean(d[section]?.[key]);
}
function F({ label, v, onChange, textarea, placeholder, type = "text" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs font-semibold mb-1",
			children: label
		}), textarea ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			value: v,
			onChange: (e) => onChange(e.target.value),
			placeholder,
			className: "w-full min-h-[80px] border border-border rounded-lg p-2 text-sm"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value: v,
			onChange: (e) => onChange(e.target.value),
			placeholder,
			type,
			className: "w-full border border-border rounded-lg p-2 text-sm"
		})]
	});
}
function Switch({ label, checked, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex items-center gap-3 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "checkbox",
			checked,
			onChange: (e) => onChange(e.target.checked),
			className: "size-4"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "capitalize",
			children: label
		})]
	});
}
//#endregion
export { Page as component };
