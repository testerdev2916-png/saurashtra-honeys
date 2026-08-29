import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as supabase } from "./client-CiOF68Zx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-L3PDI3kX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Ctx = (0, import_react.createContext)(null);
function AuthProvider({ children }) {
	const [session, setSession] = (0, import_react.useState)(null);
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
	async function loadRole(uid) {
		if (!uid) {
			setIsAdmin(false);
			return;
		}
		const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid).eq("role", "admin").maybeSingle();
		setIsAdmin(!!data);
	}
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
			setSession(s);
			setTimeout(() => {
				loadRole(s?.user.id);
			}, 0);
		});
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			loadRole(data.session?.user.id).finally(() => setLoading(false));
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value: {
			user: session?.user ?? null,
			session,
			isAdmin,
			loading,
			signOut: async () => {
				await supabase.auth.signOut();
			},
			refreshRole: async () => loadRole(session?.user.id)
		},
		children
	});
}
var FALLBACK = {
	user: null,
	session: null,
	isAdmin: false,
	loading: true,
	signOut: async () => {},
	refreshRole: async () => {}
};
function useAuth() {
	return (0, import_react.useContext)(Ctx) ?? FALLBACK;
}
//#endregion
export { useAuth as n, AuthProvider as t };
