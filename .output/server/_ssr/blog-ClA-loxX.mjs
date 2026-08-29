import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as listPublicPosts, n as getPopularPosts, t as getFeaturedPost } from "./blog-server.functions-WqtTS3kD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog-ClA-loxX.js
var $$splitComponentImporter = () => import("./blog-C55MROrx.mjs");
var Route = createFileRoute("/blog")({
	validateSearch: (search) => ({
		cat: typeof search.cat === "string" ? search.cat : void 0,
		q: typeof search.q === "string" ? search.q : void 0,
		page: typeof search.page === "number" ? search.page : 1
	}),
	loaderDeps: ({ search }) => ({
		cat: search.cat,
		q: search.q,
		page: search.page
	}),
	loader: async ({ deps }) => {
		const [postsData, popularData, featuredData] = await Promise.all([
			listPublicPosts({ data: {
				cat: deps.cat,
				q: deps.q,
				page: deps.page || 1,
				pageSize: 9
			} }),
			getPopularPosts({ data: { limit: 4 } }),
			getFeaturedPost()
		]);
		return {
			posts: postsData,
			popular: popularData.rows,
			featured: featuredData.post
		};
	},
	head: () => ({ meta: [
		{ title: "Journal — Stories from Our Hive to Yours | Saurashtra Honey" },
		{
			name: "description",
			content: "Discover helpful tips, inspiring stories and the latest updates from Saurashtra Honey Bee Farm. Read articles on bees, health, sustainability and natural living."
		},
		{
			property: "og:title",
			content: "Journal — Saurashtra Honey"
		},
		{
			property: "og:description",
			content: "Stories from Our Hive to Yours. Honey. Knowledge. Inspiration."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
