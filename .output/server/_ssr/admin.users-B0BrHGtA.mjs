import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { A as RefreshCcw, Gt as Check, i as X, ot as KeyRound } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useServerFn } from "./useServerFn-BqzygRuj.mjs";
import { _ as listUsers, b as setUserRole, c as inviteUser, y as sendPasswordReset } from "./admin-cms.functions-jTsNSh7F.mjs";
import { a as PageHeader, c as Td, d as inp, i as Field, l as Th, n as BtnPrimary, r as Card, s as TableWrap, t as BtnGhost } from "./ui-Cij6S7ah.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.users-B0BrHGtA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ROLES = [
	"super_admin",
	"admin",
	"manager",
	"editor",
	"customer"
];
function UsersPage() {
	const list = useServerFn(listUsers);
	const setRole = useServerFn(setUserRole);
	const invite = useServerFn(inviteUser);
	const reset = useServerFn(sendPasswordReset);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [email, setEmail] = (0, import_react.useState)("");
	const [inviteRole, setInviteRole] = (0, import_react.useState)("editor");
	async function load() {
		setLoading(true);
		try {
			const r = await list({});
			setRows(r.rows);
		} catch (e) {
			toast.error(e.message);
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Users & Roles",
			subtitle: `${rows.length} accounts`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BtnGhost, {
				onClick: load,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCcw, { className: "size-3.5" }), " REFRESH"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-4 mb-4 grid md:grid-cols-[1fr_auto_auto] gap-2 items-end",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Invite by email",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "email",
						value: email,
						onChange: (e) => setEmail(e.target.value),
						className: inp,
						placeholder: "new.staff@example.com"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Role",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: inviteRole,
						onChange: (e) => setInviteRole(e.target.value),
						className: inp,
						children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: r,
							children: r
						}, r))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtnPrimary, {
					onClick: async () => {
						if (!email) return;
						try {
							await invite({ data: {
								email,
								role: inviteRole
							} });
							toast.success("Invite sent");
							setEmail("");
							load();
						} catch (e) {
							toast.error(e.message);
						}
					},
					children: "SEND INVITE"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
			"Email",
			"Joined",
			"Last sign-in",
			"Roles",
			"Actions"
		].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: h }, h)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
			className: "divide-y divide-border",
			children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "text-center py-12 text-muted-foreground",
				children: "Loading…"
			}) }), !loading && rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "hover:bg-cream/40",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "text-xs",
						children: r.email ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "text-xs text-muted-foreground",
						children: new Date(r.created_at).toLocaleDateString()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						className: "text-xs text-muted-foreground",
						children: r.last_sign_in_at ? new Date(r.last_sign_in_at).toLocaleString() : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1",
						children: ROLES.map((role) => {
							const has = r.roles.includes(role);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: async () => {
									try {
										await setRole({ data: {
											user_id: r.id,
											role,
											action: has ? "revoke" : "grant"
										} });
										toast.success(`${has ? "Revoked" : "Granted"} ${role}`);
										load();
									} catch (e) {
										toast.error(e.message);
									}
								},
								className: `text-[10px] font-bold tracking-wider uppercase rounded-full px-2 py-1 border ${has ? "bg-forest-dark text-cream border-forest-dark" : "bg-white text-muted-foreground border-border hover:border-gold-deep"}`,
								children: [
									has ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3 inline mr-0.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3 inline mr-0.5" }),
									" ",
									role.replace("_", " ")
								]
							}, role);
						})
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: async () => {
							if (!r.email) return;
							try {
								await reset({ data: { email: r.email } });
								toast.success("Reset link generated");
							} catch (e) {
								toast.error(e.message);
							}
						},
						className: "text-xs font-bold text-gold-deep hover:underline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "size-3 inline" }), " RESET"]
					}) })
				]
			}, r.id))]
		})] })
	] });
}
//#endregion
export { UsersPage as component };
