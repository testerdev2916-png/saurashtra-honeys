import { expect, test, type Page } from "@playwright/test";

const storageKey = "sb-hwdngvzgdblzrkllyaji-auth-token";

function base64Url(value: string) {
  return Buffer.from(value).toString("base64url");
}

function fakeJwt(sub: string) {
  const header = base64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64Url(JSON.stringify({ sub, exp: Math.floor(Date.now() / 1000) + 3600, role: "authenticated" }));
  return `${header}.${payload}.signature`;
}

async function installOAuthReturnState(page: Page, target: "/account" | "/admin", intentId: string) {
  await page.route("https://hwdngvzgdblzrkllyaji.supabase.co/auth/v1/user**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "00000000-0000-4000-8000-000000000001",
        aud: "authenticated",
        role: "authenticated",
        email: "test@example.invalid",
        app_metadata: { provider: "google", providers: ["google"] },
        user_metadata: {},
      }),
    });
  });
  await page.addInitScript(
    ({ key, targetPath, id, token }) => {
      window.sessionStorage.setItem("oauth_intent_latest", id);
      window.sessionStorage.setItem(`oauth_intent:${id}`, JSON.stringify({ id, target: targetPath, createdAt: Date.now() }));
      window.localStorage.setItem(key, JSON.stringify({
        access_token: token,
        refresh_token: "test-refresh-token",
        token_type: "bearer",
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        user: {
          id: "00000000-0000-4000-8000-000000000001",
          aud: "authenticated",
          role: "authenticated",
          email: "test@example.invalid",
          app_metadata: { provider: "google", providers: ["google"] },
          user_metadata: {},
        },
      }));
    },
    { key: storageKey, targetPath: target, id: intentId, token: fakeJwt("00000000-0000-4000-8000-000000000001") },
  );
}

for (const target of ["/account", "/admin"] as const) {
  test(`Google OAuth callback returns to ${target} without a 404`, async ({ page }) => {
    const badResponses: Array<{ status: number; url: string }> = [];
    page.on("response", (response) => {
      if (response.status() === 404) badResponses.push({ status: response.status(), url: response.url() });
    });
    const intentId = `intent-${target.slice(1)}`;
    await installOAuthReturnState(page, target, intentId);
    await page.goto(`/auth/callback?oauth_intent=${intentId}`);
    await expect(page).toHaveURL(new RegExp(`${target.replace("/", "\\/")}`));
    await expect(page.getByText("Page not found")).toHaveCount(0);
    expect(badResponses, JSON.stringify(badResponses)).toEqual([]);
  });
}

test("localhost Google sign-in does not navigate to the missing OAuth broker route", async ({ page }) => {
  const oauth404s: string[] = [];
  page.on("response", (response) => {
    if (response.status() === 404 && response.url().includes("/~oauth/initiate")) oauth404s.push(response.url());
  });
  await page.goto("/auth?redirect=/account");
  await page.getByRole("button", { name: "Continue with Google" }).click();
  await expect(page).toHaveURL(/\/auth\?redirect=\/account$/);
  expect(oauth404s).toEqual([]);
});