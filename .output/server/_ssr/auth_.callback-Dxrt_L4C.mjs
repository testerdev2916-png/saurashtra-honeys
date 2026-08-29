import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as supabase } from "./client-CiOF68Zx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth_.callback-Dxrt_L4C.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthCallback() {
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const intended = new URL(window.location.href).searchParams.get("redirect") || "/";
		const go = () => {
			if (cancelled) return;
			navigate({
				to: intended,
				replace: true
			});
		};
		const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
			if (event === "SIGNED_IN" || session) go();
		});
		supabase.auth.getSession().then(({ data }) => {
			if (data.session) go();
		});
		const t = setTimeout(() => {
			if (cancelled) return;
			navigate({
				to: "/auth",
				replace: true
			});
		}, 5e3);
		return () => {
			cancelled = true;
			clearTimeout(t);
			sub.subscription.unsubscribe();
		};
	}, [navigate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-[60vh] flex items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Signing you in…"
		})
	});
}
//#endregion
export { AuthCallback as component };
