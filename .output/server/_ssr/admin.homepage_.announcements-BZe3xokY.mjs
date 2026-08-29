import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as Plus, O as Save, an as ArrowLeft, i as X, nn as ArrowUp, p as Trash2, sn as ArrowDown, y as SquarePen } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as deleteAnnouncement, g as logAudit, l as fetchAllAnnouncements, t as createAnnouncement, v as updateAnnouncement, y as updateAnnouncementOrder } from "./homepage-cms.functions-dnhwKaHU.mjs";
import { a as PageHeader, i as Field, n as BtnPrimary, r as Card, t as BtnGhost } from "./ui-Cij6S7ah.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.homepage_.announcements-BZe3xokY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminAnnouncements() {
	const [items, setItems] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [showAdd, setShowAdd] = (0, import_react.useState)(false);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)({
		text: "",
		link: "",
		icon: "",
		open_in_new_tab: false
	});
	const loadData = async () => {
		setLoading(true);
		try {
			setItems(await fetchAllAnnouncements());
		} catch (e) {
			toast.error("Failed to load announcements");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadData();
	}, []);
	const resetForm = () => {
		setFormData({
			text: "",
			link: "",
			icon: "",
			open_in_new_tab: false
		});
		setShowAdd(false);
		setEditingId(null);
	};
	const handleSave = async (e) => {
		e.preventDefault();
		if (!formData.text.trim()) return toast.error("Text is required");
		try {
			if (editingId) {
				await updateAnnouncement(editingId, formData);
				toast.success("Announcement updated");
			} else {
				await createAnnouncement({
					...formData,
					enabled: true,
					sort_order: items.length + 1
				});
				toast.success("Announcement added");
			}
			await logAudit({ data: {
				action: editingId ? "homepage.announcement_updated" : "homepage.announcement_added",
				entity_type: "announcement_items",
				entity_id: editingId || "new"
			} });
			resetForm();
			loadData();
		} catch (err) {
			toast.error("Failed to save announcement");
		}
	};
	const handleRemove = async (id) => {
		if (!confirm("Delete this announcement?")) return;
		try {
			await deleteAnnouncement(id);
			toast.success("Announcement deleted");
			loadData();
		} catch (e) {
			toast.error("Failed to delete announcement");
		}
	};
	const handleMove = async (index, direction) => {
		if (direction === "up" && index === 0 || direction === "down" && index === items.length - 1) return;
		const targetIndex = direction === "up" ? index - 1 : index + 1;
		const newItems = [...items];
		const [moved] = newItems.splice(index, 1);
		newItems.splice(targetIndex, 0, moved);
		const updates = newItems.map((s, idx) => ({
			id: s.id,
			sort_order: idx + 1
		}));
		setItems(newItems.map((s, idx) => ({
			...s,
			sort_order: idx + 1
		})));
		try {
			await updateAnnouncementOrder(updates);
			toast.success("Order saved");
		} catch (e) {
			toast.error("Failed to save order");
			loadData();
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-24 text-center text-muted-foreground",
		children: "Loading..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Announcement Bar",
			subtitle: "Manage the sliding messages at the very top of the website.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin/homepage",
				className: "inline-flex items-center gap-2 border border-border rounded-lg px-3 py-2 text-xs font-semibold hover:border-gold-deep",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " Back to Homepage CMS"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-between items-center mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-xl font-bold text-forest-dark",
				children: "Active Announcements"
			}), !showAdd && !editingId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnPrimary, {
				onClick: () => setShowAdd(true),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add Announcement"]
			})]
		}),
		(showAdd || editingId) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "p-5 mb-6 bg-cream/40 border-gold-deep/30",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSave,
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid md:grid-cols-2 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Announcement Text *",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: formData.text,
								onChange: (e) => setFormData({
									...formData,
									text: e.target.value
								}),
								className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep",
								placeholder: "e.g. Free Delivery on orders above ₹400"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Icon (Emoji or text)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: formData.icon,
								onChange: (e) => setFormData({
									...formData,
									icon: e.target.value
								}),
								className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep",
								placeholder: "e.g. 🚚 or 🍯"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Link URL (Optional)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: formData.link,
								onChange: (e) => setFormData({
									...formData,
									link: e.target.value
								}),
								className: "mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:border-gold-deep",
								placeholder: "e.g. /shop"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Open in new tab?",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 mt-3 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: formData.open_in_new_tab,
									onChange: (e) => setFormData({
										...formData,
										open_in_new_tab: e.target.checked
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm",
									children: "Yes, open in new tab"
								})]
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnPrimary, {
						type: "submit",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" }), " Save"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnGhost, {
						type: "button",
						onClick: resetForm,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), " Cancel"]
					})]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-8 text-center text-muted-foreground bg-white border border-border rounded-2xl",
				children: "No announcements configured."
			}) : items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: `p-4 flex items-center justify-between ${editingId === item.id ? "border-gold-deep" : ""}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-10 rounded-full bg-cream border border-border flex items-center justify-center text-lg",
						children: item.icon || "•"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-forest-dark",
						children: item.text
					}), item.link && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: ["Link: ", item.link]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center border border-border rounded-lg overflow-hidden bg-white mr-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								disabled: index === 0,
								onClick: () => handleMove(index, "up"),
								className: "p-2 hover:bg-cream/60 disabled:opacity-30 border-r border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								disabled: index === items.length - 1,
								onClick: () => handleMove(index, "down"),
								className: "p-2 hover:bg-cream/60 disabled:opacity-30",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "size-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setEditingId(item.id);
								setFormData({
									text: item.text,
									link: item.link || "",
									icon: item.icon || "",
									open_in_new_tab: item.open_in_new_tab
								});
								setShowAdd(false);
							},
							className: "p-2 text-forest-dark hover:bg-cream rounded",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => handleRemove(item.id),
							className: "p-2 text-destructive hover:bg-destructive/10 rounded",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
						})
					]
				})]
			}, item.id))
		})
	] });
}
//#endregion
export { AdminAnnouncements as component };
