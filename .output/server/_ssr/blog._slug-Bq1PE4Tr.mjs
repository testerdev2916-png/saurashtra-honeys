import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as getPublicPost } from "./blog-server.functions-WqtTS3kD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog._slug-Bq1PE4Tr.js
var $$splitComponentImporter = () => import("./blog._slug-BALDOIxB.mjs");
var $$splitErrorComponentImporter = () => import("./blog._slug-Ckwbq0tI.mjs");
var $$splitNotFoundComponentImporter = () => import("./blog._slug-D0phHAK7.mjs");
var Route = createFileRoute("/blog/$slug")({
	loader: async ({ params }) => {
		return await getPublicPost({ data: { slug: params.slug } });
	},
	head: ({ loaderData }) => {
		const post = loaderData?.post;
		return { meta: post ? [
			{ title: `${post.seo_title || post.title} | Saurashtra Honey Journal` },
			{
				name: "description",
				content: (post.seo_description || post.excerpt || "").slice(0, 155)
			},
			{
				property: "og:title",
				content: post.title
			},
			{
				property: "og:description",
				content: post.excerpt || ""
			},
			{
				property: "og:type",
				content: "article"
			},
			{
				property: "article:published_time",
				content: post.published_at || post.created_at
			},
			{
				property: "article:section",
				content: post.category_name || "Honey & Health"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		] : [{ title: "Article Not Found | Saurashtra Honey Journal" }] };
	},
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
