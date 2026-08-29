import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { At as ExternalLink, N as Plus, O as Save, Ot as Eye, b as Sparkles, i as X, kt as EyeOff, nn as ArrowUp, p as Trash2, sn as ArrowDown, y as SquarePen } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { T as updateSectionSettings, _ as toggleSectionVisibility, g as logAudit, m as fetchHomepageSections, w as updateSectionOrder } from "./homepage-cms.functions-dnhwKaHU.mjs";
import { a as PageHeader, d as inp, i as Field, n as BtnPrimary, o as StatusPill, r as Card, t as BtnGhost } from "./ui-Cij6S7ah.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.homepage-BPE1gvi-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SECTION_CONFIG = {
	hero: {
		title: "Hero Slider",
		desc: "Main top banner slider on the homepage.",
		link: "/admin/hero"
	},
	trust_strip: {
		title: "Benefits / Trust Strip",
		desc: "100% Pure Honey, Lab Tested, Farm Sourced trust badges.",
		link: "/admin/homepage/trust"
	},
	shop_by_category: {
		title: "Shop By Category / Explore Our World",
		desc: "The category carousel and introductory heading.",
		link: "/admin/homepage/categories",
		fields: [
			{
				type: "text",
				key: "eyebrow",
				label: "Eyebrow text",
				placeholder: "DISCOVER"
			},
			{
				type: "text",
				key: "heading",
				label: "Heading",
				placeholder: "Explore Our World"
			},
			{
				type: "textarea",
				key: "description",
				label: "Description"
			},
			{
				type: "text",
				key: "cta_text",
				label: "CTA Button Text",
				placeholder: "VIEW ALL CATEGORIES"
			},
			{
				type: "text",
				key: "cta_url",
				label: "CTA URL",
				placeholder: "/shop"
			}
		]
	},
	featured_products: {
		title: "Featured Products / Best Sellers",
		desc: "Curated list of top products displayed on the homepage.",
		link: "/admin/homepage/products",
		fields: [
			{
				type: "text",
				key: "eyebrow",
				label: "Eyebrow text",
				placeholder: "CURATED FOR YOU"
			},
			{
				type: "text",
				key: "heading",
				label: "Heading",
				placeholder: "Our Finest Picks"
			},
			{
				type: "textarea",
				key: "description",
				label: "Description"
			},
			{
				type: "text",
				key: "cta_text",
				label: "CTA Button Text",
				placeholder: "VIEW ALL PRODUCTS"
			},
			{
				type: "text",
				key: "cta_url",
				label: "CTA URL",
				placeholder: "/shop"
			}
		]
	},
	shoppable_videos: {
		title: "Shoppable Video / Story Section",
		desc: "9:16 vertical video reels from the hive.",
		link: "/admin/stories",
		fields: [
			{
				type: "text",
				key: "eyebrow",
				label: "Eyebrow text",
				placeholder: "FROM THE HIVE"
			},
			{
				type: "text",
				key: "heading",
				label: "Heading",
				placeholder: "Stories from the Hive"
			},
			{
				type: "textarea",
				key: "description",
				label: "Description"
			}
		]
	},
	why_choose: {
		title: "Our Heritage / Why Choose Us",
		desc: "Our story and purity guarantee section.",
		fields: [
			{
				type: "text",
				key: "eyebrow",
				label: "Eyebrow text",
				placeholder: "OUR HERITAGE"
			},
			{
				type: "text",
				key: "heading",
				label: "Heading",
				placeholder: "Where Purity Begins"
			},
			{
				type: "textarea",
				key: "description",
				label: "Description"
			},
			{
				type: "text",
				key: "cta_text",
				label: "CTA Button Text",
				placeholder: "KNOW MORE ABOUT US"
			},
			{
				type: "text",
				key: "cta_url",
				label: "CTA URL",
				placeholder: "/our-story"
			}
		]
	},
	farm_banner: {
		title: "Farm / Beekeeping Banner",
		desc: "Full width decorative farm image section.",
		fields: [
			{
				type: "text",
				key: "eyebrow",
				label: "Eyebrow text",
				placeholder: "BEEKEEPING"
			},
			{
				type: "text",
				key: "heading",
				label: "Heading",
				placeholder: "The Art of Beekeeping"
			},
			{
				type: "textarea",
				key: "description",
				label: "Description"
			},
			{
				type: "text",
				key: "cta_text",
				label: "CTA Button Text",
				placeholder: "LEARN ABOUT OUR FARMS"
			},
			{
				type: "text",
				key: "cta_url",
				label: "CTA URL",
				placeholder: "/bee-farming"
			}
		]
	},
	stats_strip: {
		title: "Statistics Strip",
		desc: "Key metrics like Happy Customers, Lab Tested Batches.",
		fields: [{
			type: "stats",
			key: "stats",
			label: "Statistics"
		}]
	},
	testimonials: {
		title: "Testimonials / Customer Reviews",
		desc: "Customer reviews featured on the homepage.",
		link: "/admin/reviews",
		fields: [
			{
				type: "text",
				key: "eyebrow",
				label: "Eyebrow text",
				placeholder: "TRUSTED BY MANY"
			},
			{
				type: "text",
				key: "heading",
				label: "Heading",
				placeholder: "Loved Across India"
			},
			{
				type: "textarea",
				key: "description",
				label: "Description"
			}
		]
	},
	journal: {
		title: "Journal / Blog Preview",
		desc: "Latest blog articles and honey guides.",
		link: "/admin/blog",
		fields: [
			{
				type: "text",
				key: "eyebrow",
				label: "Eyebrow text",
				placeholder: "JOIN OUR JOURNEY"
			},
			{
				type: "text",
				key: "heading",
				label: "Heading",
				placeholder: "Follow Our Hive"
			},
			{
				type: "textarea",
				key: "description",
				label: "Description"
			},
			{
				type: "text",
				key: "cta_text",
				label: "CTA Button Text",
				placeholder: "READ OUR STORIES"
			},
			{
				type: "text",
				key: "cta_url",
				label: "CTA URL",
				placeholder: "/blog"
			}
		]
	}
};
function StatsEditor({ value, onChange }) {
	const items = value.length > 0 ? value : [{
		value: "",
		label: ""
	}];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [items.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2 items-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: item.value,
					onChange: (e) => {
						const next = [...items];
						next[idx] = {
							...next[idx],
							value: e.target.value
						};
						onChange(next);
					},
					className: `${inp} w-28`,
					placeholder: "15+ Years"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: item.label,
					onChange: (e) => {
						const next = [...items];
						next[idx] = {
							...next[idx],
							label: e.target.value
						};
						onChange(next);
					},
					className: inp,
					placeholder: "Beekeeping Experience"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onChange(items.filter((_, i) => i !== idx)),
					className: "p-1.5 text-destructive hover:bg-destructive/10 rounded shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
				})
			]
		}, idx)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => onChange([...items, {
				value: "",
				label: ""
			}]),
			className: "flex items-center gap-1.5 text-xs font-semibold text-gold-deep hover:underline mt-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), " Add stat"]
		})]
	});
}
function SectionSettingsPanel({ sec, fields, onClose, onSaved }) {
	const [form, setForm] = (0, import_react.useState)({ ...sec.settings });
	const [saving, setSaving] = (0, import_react.useState)(false);
	const handleSave = async (e) => {
		e.preventDefault();
		setSaving(true);
		try {
			await updateSectionSettings(sec.id, form);
			await logAudit({ data: {
				action: "homepage.section_settings_updated",
				entity_type: "homepage_section",
				entity_id: sec.id,
				metadata: { section_key: sec.section_key }
			} });
			toast.success("Settings saved");
			onSaved(sec.id, form);
			onClose();
		} catch {
			toast.error("Failed to save settings");
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSave,
		className: "mt-4 pt-4 border-t border-border/60 space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
				className: "text-xs font-bold text-forest-dark tracking-wider uppercase",
				children: "Section Content Settings"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid md:grid-cols-2 gap-3",
				children: fields.map((f) => {
					if (f.type === "stats") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-forest-dark mb-1",
								children: f.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground mb-2",
								children: "Edit the value + label pairs. Leave empty to use defaults."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatsEditor, {
								value: form.stats ?? [],
								onChange: (v) => setForm({
									...form,
									stats: v
								})
							})
						]
					}, "stats");
					if (f.type === "textarea") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: f.label,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 2,
								value: form[f.key] ?? "",
								onChange: (e) => setForm({
									...form,
									[f.key]: e.target.value
								}),
								className: `${inp} resize-none`,
								placeholder: f.placeholder
							})
						})
					}, f.key);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: f.label,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: form[f.key] ?? "",
							onChange: (e) => setForm({
								...form,
								[f.key]: e.target.value
							}),
							className: inp,
							placeholder: f.placeholder
						})
					}, f.key);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-muted-foreground",
				children: "Leave any field empty to use the default content."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnPrimary, {
					type: "submit",
					disabled: saving,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-3.5" }), saving ? "Saving…" : "Save Settings"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnGhost, {
					type: "button",
					onClick: onClose,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" }), " Cancel"]
				})]
			})
		]
	});
}
function HomepageManagement() {
	const [sections, setSections] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const loadData = async () => {
		setLoading(true);
		try {
			const data = await fetchHomepageSections();
			setSections(data);
		} catch (e) {
			toast.error("Failed to load homepage sections");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadData();
	}, []);
	const handleToggle = async (id, current, key) => {
		try {
			await toggleSectionVisibility(id, !current);
			setSections((prev) => prev.map((s) => s.id === id ? {
				...s,
				enabled: !current
			} : s));
			toast.success(`Section ${!current ? "enabled" : "hidden"} successfully`);
			await logAudit({ data: {
				action: "homepage.section_toggled",
				entity_type: "homepage_section",
				entity_id: id,
				metadata: {
					section_key: key,
					enabled: !current
				}
			} });
		} catch (e) {
			toast.error("Failed to update visibility");
		}
	};
	const handleMove = async (index, direction) => {
		if (direction === "up" && index === 0 || direction === "down" && index === sections.length - 1) return;
		const targetIndex = direction === "up" ? index - 1 : index + 1;
		const newSections = [...sections];
		const [moved] = newSections.splice(index, 1);
		newSections.splice(targetIndex, 0, moved);
		const updates = newSections.map((s, idx) => ({
			id: s.id,
			sort_order: idx + 1
		}));
		setSections(newSections.map((s, idx) => ({
			...s,
			sort_order: idx + 1
		})));
		try {
			await updateSectionOrder(updates);
			toast.success("Section order saved");
			await logAudit({ data: {
				action: "homepage.sections_reordered",
				entity_type: "homepage_section",
				metadata: { order: updates }
			} });
		} catch (e) {
			toast.error("Failed to save order");
			loadData();
		}
	};
	const handleSettingsSaved = (id, settings) => {
		setSections((prev) => prev.map((s) => s.id === id ? {
			...s,
			settings
		} : s));
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-24 text-center text-muted-foreground",
		children: "Loading Homepage CMS…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Homepage Management",
		subtitle: "Manage visibility, order, and content of all Homepage sections."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 mt-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all border-brand-orange/30",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-cream p-2.5 rounded-lg border border-border mt-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-5 text-brand-orange" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-lg font-bold text-forest-dark",
						children: "Announcement Bar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { s: "active" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-1",
					children: "Manage the sliding messages at the very top of the website."
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2 self-end sm:self-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/admin/homepage/announcements",
					className: "inline-flex items-center gap-1.5 bg-forest-dark text-cream rounded-lg px-4 py-2 text-xs font-bold tracking-widest hover:bg-forest transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "MANAGE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" })]
				})
			})]
		}), sections.map((sec, index) => {
			const meta = SECTION_CONFIG[sec.section_key] || {
				title: sec.section_key.toUpperCase(),
				desc: "Custom homepage section."
			};
			const isEditing = editingId === sec.id;
			const hasFields = meta.fields && meta.fields.length > 0;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: `p-5 transition-all ${!sec.enabled ? "opacity-60 bg-cream/40" : ""} ${isEditing ? "ring-2 ring-gold-deep/40" : ""}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-cream p-2.5 rounded-lg border border-border mt-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-5 text-gold-deep" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 flex-wrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-serif text-lg font-bold text-forest-dark",
								children: meta.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { s: sec.enabled ? "active" : "disabled" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: meta.desc
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 self-end sm:self-center flex-wrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center border border-border rounded-lg overflow-hidden bg-white",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									disabled: index === 0,
									onClick: () => handleMove(index, "up"),
									className: "p-2 hover:bg-cream/60 disabled:opacity-30 border-r border-border transition-colors",
									title: "Move Up",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-4 text-forest-dark" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									disabled: index === sections.length - 1,
									onClick: () => handleMove(index, "down"),
									className: "p-2 hover:bg-cream/60 disabled:opacity-30 transition-colors",
									title: "Move Down",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-4 text-forest-dark" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleToggle(sec.id, sec.enabled, sec.section_key),
								className: `inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${sec.enabled ? "border-border text-forest-dark hover:bg-cream/60" : "border-gold-deep text-gold-deep hover:bg-gold/10"}`,
								children: sec.enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-3.5" }), " Hide"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5" }), " Show"] })
							}),
							hasFields && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setEditingId(isEditing ? null : sec.id),
								className: `inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${isEditing ? "border-gold-deep bg-gold/10 text-gold-deep" : "border-border text-forest-dark hover:bg-cream/60"}`,
								title: "Edit section content",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "size-3.5" }), isEditing ? "Close" : "Edit Content"]
							}),
							meta.link && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: meta.link,
								className: "inline-flex items-center gap-1.5 bg-forest-dark text-cream rounded-lg px-4 py-2 text-xs font-bold tracking-widest hover:bg-forest transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "MANAGE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" })]
							})
						]
					})]
				}), isEditing && meta.fields && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionSettingsPanel, {
					sec,
					fields: meta.fields,
					onClose: () => setEditingId(null),
					onSaved: handleSettingsSaved
				})]
			}, sec.id);
		})]
	})] });
}
//#endregion
export { HomepageManagement as component };
