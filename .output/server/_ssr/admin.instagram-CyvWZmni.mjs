import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as getInstagramSettings } from "./instagram.functions-CZs_jpgy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.instagram-CyvWZmni.js
var $$splitComponentImporter = () => import("./admin.instagram-wqKnKfvi.mjs");
var Route = createFileRoute("/admin/instagram")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	loader: async () => {
		return await getInstagramSettings();
	}
});
//#endregion
export { Route as t };
