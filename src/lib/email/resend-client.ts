import { Resend } from "resend";

export interface EmailConfig {
  apiKey: string | undefined;
  fromAddress: string;
  ownerEmail: string;
  siteUrl: string;
  isConfigured: boolean;
  isMockMode: boolean;
}

export interface MockEmailRecord {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  idempotencyKey?: string;
  template: string;
  timestamp: string;
}

// In-memory mock storage for testing & verification
const mockSentEmails: MockEmailRecord[] = [];

export function getMockSentEmails(): MockEmailRecord[] {
  return [...mockSentEmails];
}

export function clearMockSentEmails(): void {
  mockSentEmails.length = 0;
}

export function recordMockSentEmail(record: MockEmailRecord): void {
  mockSentEmails.push(record);
}

export function getEmailConfig(): EmailConfig {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromAddress =
    process.env.EMAIL_FROM_ADDRESS?.trim() || "Saurashtra Honey <orders@saurashtrahoney.com>";
  const ownerEmail = process.env.OWNER_NOTIFICATION_EMAIL?.trim() || "orders@saurashtrahoney.com";
  const rawSiteUrl = process.env.SITE_URL?.trim() || "https://saurashtrahoney.com";
  const siteUrl = rawSiteUrl.replace(/\/+$/, "");

  const isConfigured = Boolean(apiKey && apiKey.startsWith("re_"));
  const isMockMode =
    process.env.MOCK_EMAIL === "true" ||
    process.env.NODE_ENV === "test" ||
    process.env.VITEST === "true";

  return {
    apiKey,
    fromAddress,
    ownerEmail,
    siteUrl,
    isConfigured,
    isMockMode,
  };
}

let resendInstance: Resend | null = null;

export function getResendClient(): Resend | null {
  const config = getEmailConfig();
  if (!config.apiKey || !config.isConfigured) {
    return null;
  }
  if (!resendInstance) {
    resendInstance = new Resend(config.apiKey);
  }
  return resendInstance;
}
