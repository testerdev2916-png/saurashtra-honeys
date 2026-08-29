import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as supabase } from "./client-CiOF68Zx.mjs";
import { n as SiteLayout, t as SectionEyebrow } from "./Layout-BROfU7ZF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reset-password-CSlF74Wx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ResetPassword() {
	const navigate = useNavigate();
	const [ready, setReady] = (0, import_react.useState)(false);
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((event) => {
			if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
		});
		supabase.auth.getSession().then(({ data }) => {
			if (data.session) setReady(true);
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	async function submit(e) {
		e.preventDefault();
		if (password.length < 8) {
			toast.error("Password must be at least 8 characters");
			return;
		}
		if (password !== confirm) {
			toast.error("Passwords don't match");
			return;
		}
		setBusy(true);
		try {
			const { error } = await supabase.auth.updateUser({ password });
			if (error) throw error;
			toast.success("Password updated. You're signed in.");
			navigate({ to: "/account" });
		} catch (e) {
			toast.error(e.message || "Could not update password");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-16 max-w-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionEyebrow, { children: "New password" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-serif text-4xl text-forest-dark",
				children: "Set a new password"
			}),
			!ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: [
					"Open this page from the reset link in your email. If the link expired, ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/forgot-password",
						className: "text-gold-deep hover:underline",
						children: "request a new one"
					}),
					"."
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "mt-6 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						type: "password",
						placeholder: "New password (min 8 chars)",
						value: password,
						onChange: (e) => setPassword(e.target.value),
						className: "w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-deep"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						type: "password",
						placeholder: "Confirm new password",
						value: confirm,
						onChange: (e) => setConfirm(e.target.value),
						className: "w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-deep"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: busy,
						className: "w-full bg-forest-dark text-cream rounded-lg py-3 text-xs font-bold tracking-widest hover:bg-forest disabled:opacity-60",
						children: busy ? "UPDATING…" : "UPDATE PASSWORD"
					})
				]
			})
		]
	}) });
}
//#endregion
export { ResetPassword as component };
