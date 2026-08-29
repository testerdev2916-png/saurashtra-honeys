import { n as supabase } from "./client-CiOF68Zx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/homepage-cms.functions-dnhwKaHU.js
/**
* Fetches the ordered list of all homepage sections
*/
async function fetchHomepageSections() {
	const { data, error } = await supabase.from("homepage_sections").select("*").order("sort_order", { ascending: true });
	if (error) {
		console.error("Error fetching homepage sections:", error);
		return [];
	}
	return data || [];
}
/**
* Fetches announcement items
*/
async function fetchAnnouncements() {
	const { data, error } = await supabase.from("announcement_items").select("*").eq("enabled", true).order("sort_order", { ascending: true });
	if (error) {
		console.error("Error fetching announcements:", error);
		return [];
	}
	return data;
}
/**
* Fetches public site settings (e.g. footer copyright, social links, contact info)
*/
async function fetchPublicSiteSettings() {
	const { data, error } = await supabase.from("site_settings").select("key, value").eq("is_public", true);
	if (error) {
		if (error.code !== "42501") console.error("Error fetching site settings:", error);
		return {};
	}
	const settings = {};
	for (const row of data || []) settings[row.key] = row.value;
	return settings;
}
async function updateSectionOrder(updates) {
	const promises = updates.map((u) => supabase.from("homepage_sections").update({ sort_order: u.sort_order }).eq("id", u.id));
	await Promise.all(promises);
}
async function toggleSectionVisibility(id, enabled) {
	const { error } = await supabase.from("homepage_sections").update({ enabled }).eq("id", id);
	if (error) throw error;
}
async function updateSectionSettings(id, settings) {
	const { error } = await supabase.from("homepage_sections").update({ settings }).eq("id", id);
	if (error) throw error;
}
async function createAnnouncement(data) {
	const { error } = await supabase.from("announcement_items").insert([data]);
	if (error) throw error;
}
async function updateAnnouncement(id, data) {
	const { error } = await supabase.from("announcement_items").update(data).eq("id", id);
	if (error) throw error;
}
async function deleteAnnouncement(id) {
	const { error } = await supabase.from("announcement_items").delete().eq("id", id);
	if (error) throw error;
}
async function fetchAllAnnouncements() {
	const { data, error } = await supabase.from("announcement_items").select("*").order("sort_order");
	if (error) throw error;
	return data;
}
async function updateAnnouncementOrder(updates) {
	const promises = updates.map((u) => supabase.from("announcement_items").update({ sort_order: u.sort_order }).eq("id", u.id));
	await Promise.all(promises);
}
async function createHomepageCategory(data) {
	const { error } = await supabase.from("homepage_category_selection").insert([data]);
	if (error) throw error;
}
async function deleteHomepageCategory(id) {
	const { error } = await supabase.from("homepage_category_selection").delete().eq("id", id);
	if (error) throw error;
}
async function fetchAllHomepageCategories() {
	const { data, error } = await supabase.from("homepage_category_selection").select("*").order("sort_order");
	if (error) throw error;
	return data;
}
async function updateHomepageCategoryOrder(updates) {
	const promises = updates.map((u) => supabase.from("homepage_category_selection").update({ sort_order: u.sort_order }).eq("id", u.id));
	await Promise.all(promises);
}
async function createHomepageFeaturedProduct(data) {
	const { error } = await supabase.from("homepage_featured_products").insert([data]);
	if (error) throw error;
}
async function deleteHomepageFeaturedProduct(id) {
	const { error } = await supabase.from("homepage_featured_products").delete().eq("id", id);
	if (error) throw error;
}
async function fetchAllHomepageFeaturedProducts() {
	const { data, error } = await supabase.from("homepage_featured_products").select("*").order("sort_order");
	if (error) throw error;
	return data;
}
async function updateHomepageFeaturedProductOrder(updates) {
	const promises = updates.map((u) => supabase.from("homepage_featured_products").update({ sort_order: u.sort_order }).eq("id", u.id));
	await Promise.all(promises);
}
async function createHomepageTrustItem(data) {
	const { error } = await supabase.from("homepage_trust_items").insert([data]);
	if (error) throw error;
}
async function updateHomepageTrustItem(id, data) {
	const { error } = await supabase.from("homepage_trust_items").update(data).eq("id", id);
	if (error) throw error;
}
async function deleteHomepageTrustItem(id) {
	const { error } = await supabase.from("homepage_trust_items").delete().eq("id", id);
	if (error) throw error;
}
async function fetchAllHomepageTrustItems() {
	const { data, error } = await supabase.from("homepage_trust_items").select("*").order("sort_order");
	if (error) throw error;
	return data;
}
async function updateHomepageTrustItemOrder(updates) {
	const promises = updates.map((u) => supabase.from("homepage_trust_items").update({ sort_order: u.sort_order }).eq("id", u.id));
	await Promise.all(promises);
}
async function logAudit({ data }) {
	try {
		await supabase.rpc("log_audit", {
			_action: data.action,
			_entity_type: data.entity_type ?? null,
			_entity_id: data.entity_id ?? null,
			_metadata: data.metadata ?? {}
		});
	} catch (err) {
		console.warn("[logAudit] failed:", err);
	}
}
//#endregion
export { updateHomepageTrustItemOrder as C, updateHomepageTrustItem as S, updateSectionSettings as T, toggleSectionVisibility as _, deleteAnnouncement as a, updateHomepageCategoryOrder as b, deleteHomepageTrustItem as c, fetchAllHomepageFeaturedProducts as d, fetchAllHomepageTrustItems as f, logAudit as g, fetchPublicSiteSettings as h, createHomepageTrustItem as i, fetchAllAnnouncements as l, fetchHomepageSections as m, createHomepageCategory as n, deleteHomepageCategory as o, fetchAnnouncements as p, createHomepageFeaturedProduct as r, deleteHomepageFeaturedProduct as s, createAnnouncement as t, fetchAllHomepageCategories as u, updateAnnouncement as v, updateSectionOrder as w, updateHomepageFeaturedProductOrder as x, updateAnnouncementOrder as y };
