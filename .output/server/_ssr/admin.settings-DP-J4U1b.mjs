import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { l as Upload } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as supabase } from "./client-CiOF68Zx.mjs";
import { i as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { t as useServerFn } from "./useServerFn-BqzygRuj.mjs";
import { A as upsertSetting, g as listSettings } from "./admin-cms.functions-jTsNSh7F.mjs";
import { a as PageHeader, d as inp, i as Field, n as BtnPrimary, r as Card } from "./ui-Cij6S7ah.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.settings-DP-J4U1b.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LABELS = {
	company: {
		title: "Company",
		fields: [
			{
				key: "name",
				label: "Company name"
			},
			{
				key: "tagline",
				label: "Tagline"
			},
			{
				key: "logo_url",
				label: "Logo URL"
			},
			{
				key: "favicon_url",
				label: "Favicon URL"
			}
		]
	},
	contact: {
		title: "Contact",
		fields: [
			{
				key: "email",
				label: "Email"
			},
			{
				key: "phone",
				label: "Phone"
			},
			{
				key: "whatsapp",
				label: "WhatsApp"
			},
			{
				key: "address",
				label: "Address",
				textarea: true
			}
		]
	},
	social: {
		title: "Social links",
		fields: [
			{
				key: "instagram",
				label: "Instagram"
			},
			{
				key: "facebook",
				label: "Facebook"
			},
			{
				key: "youtube",
				label: "YouTube"
			},
			{
				key: "twitter",
				label: "Twitter/X"
			}
		]
	},
	business: {
		title: "Business",
		fields: [{
			key: "gst",
			label: "GST number"
		}, {
			key: "hours",
			label: "Business hours"
		}]
	},
	footer: {
		title: "Footer",
		fields: [{
			key: "copyright",
			label: "Copyright line"
		}]
	},
	seo: {
		title: "Default SEO",
		fields: [
			{
				key: "default_title",
				label: "Default title"
			},
			{
				key: "default_description",
				label: "Default description",
				textarea: true
			},
			{
				key: "og_image",
				label: "Default OG image URL"
			}
		]
	}
};
function SettingsPage() {
	const list = useServerFn(listSettings);
	const save = useServerFn(upsertSetting);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [values, setValues] = (0, import_react.useState)({});
	const queryClient = useQueryClient();
	async function load() {
		try {
			const rs = (await list({})).rows;
			setRows(rs);
			const v = {};
			for (const row of rs) {
				v[row.key] = {};
				for (const [k, val] of Object.entries(row.value ?? {})) v[row.key][k] = String(val ?? "");
			}
			setValues(v);
		} catch (e) {
			toast.error(e.message);
		}
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	async function onUploadBranding(rowKey, fieldKey, file) {
		try {
			const safeName = file.name.replace(/[^\w.-]+/g, "_");
			const path = `logos/${Date.now()}_${safeName}`;
			const { data, error } = await supabase.storage.from("media").upload(path, file, {
				contentType: file.type || "application/octet-stream",
				cacheControl: "3600",
				upsert: true
			});
			if (error) throw new Error(error.message);
			const { data: pubData } = supabase.storage.from("media").getPublicUrl(data.path);
			setValues((v) => ({
				...v,
				[rowKey]: {
					...v[rowKey],
					[fieldKey]: pubData.publicUrl
				}
			}));
			toast.success("Uploaded original branding file to Supabase Storage");
		} catch (e) {
			toast.error(e.message);
		}
	}
	async function onSave(key) {
		setBusy(key);
		try {
			await save({ data: {
				key,
				value: values[key] ?? {},
				is_public: true
			} });
			toast.success(`Saved ${key}`);
			if (key === "company") queryClient.invalidateQueries({ queryKey: ["company-settings"] });
			await load();
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusy(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Site Settings",
		subtitle: "All customer-facing site content"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4",
		children: rows.map((row) => {
			const meta = LABELS[row.key];
			if (!meta) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-xl text-forest-dark mb-3",
					children: row.key
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					rows: 6,
					className: `${inp} font-mono text-xs`,
					defaultValue: JSON.stringify(row.value, null, 2),
					onBlur: (e) => {
						try {
							const v = JSON.parse(e.target.value);
							save({ data: {
								key: row.key,
								value: v,
								is_public: row.is_public
							} }).then(() => toast.success("Saved"));
						} catch {
							toast.error("Invalid JSON");
						}
					}
				})]
			}, row.key);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-xl text-forest-dark mb-4",
						children: meta.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid md:grid-cols-2 gap-3 text-sm",
						children: meta.fields.map((fld) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: fld.textarea ? "md:col-span-2" : "",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
								label: fld.label,
								children: [fld.textarea ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 3,
									className: inp,
									value: values[row.key]?.[fld.key] ?? "",
									onChange: (e) => setValues((v) => ({
										...v,
										[row.key]: {
											...v[row.key],
											[fld.key]: e.target.value
										}
									}))
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: fld.type ?? "text",
										className: `${inp} flex-1`,
										value: values[row.key]?.[fld.key] ?? "",
										onChange: (e) => setValues((v) => ({
											...v,
											[row.key]: {
												...v[row.key],
												[fld.key]: e.target.value
											}
										}))
									}), (fld.key === "logo_url" || fld.key === "favicon_url") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "inline-flex items-center gap-1.5 bg-brand-orange hover:bg-brand-orange-hover text-white px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors shrink-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "UPLOAD" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "file",
												accept: "image/*,.ico,.svg",
												className: "hidden",
												onChange: (e) => {
													const file = e.target.files?.[0];
													if (file) onUploadBranding(row.key, fld.key, file);
												}
											})
										]
									})]
								}), (fld.key === "logo_url" || fld.key === "favicon_url") && values[row.key]?.[fld.key] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 p-2 rounded-lg border border-border bg-espresso/90 flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: values[row.key][fld.key],
										alt: fld.label,
										className: "max-h-8 w-auto object-contain",
										style: {
											filter: "none",
											opacity: 1,
											mixBlendMode: "normal"
										}
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-cream/70 truncate font-mono",
										children: "Previewing original file without tinting"
									})]
								})]
							})
						}, fld.key))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnPrimary, {
						onClick: () => onSave(row.key),
						disabled: busy === row.key,
						className: "mt-4",
						children: busy === row.key ? "SAVING…" : "SAVE"
					})
				]
			}, row.key);
		})
	})] });
}
//#endregion
export { SettingsPage as component };
