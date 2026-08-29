import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as enumType, s as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-TQP5sZXh.js
var $$splitComponentImporter = () => import("./account-G245PqKV.mjs");
var searchSchema = objectType({ tab: enumType([
	"dashboard",
	"profile",
	"password",
	"orders",
	"addresses",
	"wishlist",
	"recent",
	"reviews",
	"notifications",
	"newsletter",
	"settings"
]).optional() });
var Route = createFileRoute("/account")({
	validateSearch: (s) => searchSchema.parse(s),
	head: () => ({ meta: [
		{ title: "My Account | Saurashtra Honey" },
		{
			name: "description",
			content: "Manage your profile, addresses, orders, wishlist, reviews and account preferences."
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
