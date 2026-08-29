import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as supabase } from "./client-CiOF68Zx.mjs";
import { n as useAuth } from "./auth-L3PDI3kX.mjs";
import { l as stringType, s as objectType } from "../_libs/zod.mjs";
import { n as SiteLayout, t as SectionEyebrow } from "./Layout-BROfU7ZF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-TUZaiShc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function safeRedirectPath(path) {
	if (!path) return "/account";
	if (!path.startsWith("/") || path.startsWith("//")) return "/account";
	try {
		const parsed = new URL(path, "https://saurashtra-honey.local");
		if (parsed.origin !== "https://saurashtra-honey.local") return "/account";
		return `${parsed.pathname}${parsed.search}${parsed.hash}`;
	} catch {
		return "/account";
	}
}
var signupSchema = objectType({
	email: stringType().trim().email("Enter a valid email").max(255),
	password: stringType().min(8, "Password must be at least 8 characters").max(72),
	full_name: stringType().trim().min(2, "Enter your name").max(120)
});
var signinSchema = objectType({
	email: stringType().trim().email().max(255),
	password: stringType().min(1)
});
function AuthPage() {
	const { user, loading } = useAuth();
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [form, setForm] = (0, import_react.useState)({
		email: "",
		password: "",
		full_name: ""
	});
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!loading && user) {
			const redirect = safeRedirectPath(new URLSearchParams(window.location.search).get("redirect"));
			navigate({ to: redirect });
		}
	}, [
		user,
		loading,
		navigate
	]);
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		try {
			if (mode === "signup") {
				const p = signupSchema.safeParse(form);
				if (!p.success) {
					toast.error(p.error.issues[0].message);
					return;
				}
				const { error } = await supabase.auth.signUp({
					email: p.data.email,
					password: p.data.password,
					options: {
						data: { full_name: p.data.full_name },
						emailRedirectTo: `${window.location.origin}/account`
					}
				});
				if (error) throw error;
				toast.success("Account created", { description: "Check your inbox to verify your email, then sign in." });
				setMode("signin");
			} else {
				const p = signinSchema.safeParse(form);
				if (!p.success) {
					toast.error(p.error.issues[0].message);
					return;
				}
				const { error } = await supabase.auth.signInWithPassword({
					email: p.data.email,
					password: p.data.password
				});
				if (error) throw error;
				toast.success("Signed in");
			}
		} catch (e) {
			toast.error(e.message || "Something went wrong");
		} finally {
			setBusy(false);
		}
	}
	async function onGoogle() {
		setBusy(true);
		try {
			const intended = new URLSearchParams(window.location.search).get("redirect") || "/";
			const callbackUrl = new URL(`${window.location.origin}/auth/callback`);
			callbackUrl.searchParams.set("redirect", intended);
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: { redirectTo: callbackUrl.toString() }
			});
			if (error) throw error;
			toast.success("Redirecting to Google...");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Google sign-in is temporarily unavailable.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-16 max-w-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionEyebrow, { children: mode === "signin" ? "Welcome back" : "Create account" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-serif text-4xl text-forest-dark",
				children: mode === "signin" ? "Sign in" : "Join Saurashtra Honey"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: mode === "signin" ? "Track orders, manage addresses and wishlist." : "Create an account to place orders and save your favorites."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onGoogle,
				disabled: busy,
				className: "mt-6 w-full flex items-center justify-center gap-3 bg-white border border-border rounded-lg py-3 text-sm font-semibold text-forest-dark hover:bg-cream disabled:opacity-60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					width: "18",
					height: "18",
					viewBox: "0 0 48 48",
					"aria-hidden": "true",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							fill: "#FFC107",
							d: "M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							fill: "#FF3D00",
							d: "M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							fill: "#4CAF50",
							d: "M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							fill: "#1976D2",
							d: "M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
						})
					]
				}), "Continue with Google"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "my-5 flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" }),
					" or ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "space-y-3",
				children: [
					mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						placeholder: "Full name",
						value: form.full_name,
						onChange: (e) => setForm({
							...form,
							full_name: e.target.value
						}),
						className: "w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-deep"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						type: "email",
						placeholder: "Email",
						value: form.email,
						onChange: (e) => setForm({
							...form,
							email: e.target.value
						}),
						className: "w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-deep"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						type: "password",
						placeholder: "Password",
						value: form.password,
						onChange: (e) => setForm({
							...form,
							password: e.target.value
						}),
						className: "w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-deep"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: busy,
						className: "w-full bg-forest-dark text-cream rounded-lg py-3 text-xs font-bold tracking-widest hover:bg-forest disabled:opacity-60",
						children: busy ? "PLEASE WAIT…" : mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "text-xs text-muted-foreground hover:text-gold-deep",
					onClick: () => setMode(mode === "signin" ? "signup" : "signin"),
					children: mode === "signin" ? "New here? Create an account →" : "Already have an account? Sign in →"
				}), mode === "signin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/forgot-password",
					className: "text-xs text-gold-deep hover:underline",
					children: "Forgot password?"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-8 text-[11px] text-muted-foreground",
				children: [
					"By continuing you agree to our terms. ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/contact",
						className: "text-gold-deep hover:underline",
						children: "Contact support"
					}),
					" for help."
				]
			})
		]
	}) });
}
//#endregion
export { AuthPage as component };
