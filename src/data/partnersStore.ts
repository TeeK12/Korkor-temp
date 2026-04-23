/**
 * Partners store — in-memory mock state for the "Business Partners" feature.
 * Owners share periodic business health reports with trusted partners.
 */

export type ReportFrequency = "monthly" | "quarterly" | "biannual";

export interface Partner {
  id: string;
  /** Email address or Bulkbook username. */
  contact: string;
  /** Display name parsed from contact (heuristic). */
  displayName: string;
  /** Whether the partner is reachable in-app vs by email. */
  channel: "email" | "in_app";
  frequency: ReportFrequency;
  /** ISO timestamp of last report sent, or undefined if none. */
  lastSentAt?: string;
  createdAt: string;
}

const partners = new Map<string, Partner[]>();

const isEmail = (s: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

const deriveName = (contact: string): string => {
  if (isEmail(contact)) {
    const local = contact.split("@")[0] ?? contact;
    return local
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return contact.replace(/^@/, "");
};

export const FREQUENCY_LABELS: Record<ReportFrequency, string> = {
  monthly: "Monthly",
  quarterly: "Every 3 months",
  biannual: "Every 6 months",
};

export const listPartners = (businessId: string): Partner[] =>
  partners.get(businessId)?.slice() ?? [];

export const addPartner = (
  businessId: string,
  contact: string,
  frequency: ReportFrequency = "monthly",
): Partner | { error: string } => {
  const trimmed = contact.trim();
  if (!trimmed) return { error: "Enter an email or username" };
  if (!isEmail(trimmed) && trimmed.length < 3) {
    return { error: "Username must be at least 3 characters" };
  }
  const list = partners.get(businessId) ?? [];
  if (list.some((p) => p.contact.toLowerCase() === trimmed.toLowerCase())) {
    return { error: "Partner already added" };
  }
  const partner: Partner = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    contact: trimmed,
    displayName: deriveName(trimmed),
    channel: isEmail(trimmed) ? "email" : "in_app",
    frequency,
    createdAt: new Date().toISOString(),
  };
  list.push(partner);
  partners.set(businessId, list);
  return partner;
};

export const updatePartnerFrequency = (
  businessId: string,
  partnerId: string,
  frequency: ReportFrequency,
): void => {
  const list = partners.get(businessId);
  if (!list) return;
  const p = list.find((x) => x.id === partnerId);
  if (p) p.frequency = frequency;
};

export const removePartner = (businessId: string, partnerId: string): void => {
  const list = partners.get(businessId);
  if (!list) return;
  partners.set(
    businessId,
    list.filter((p) => p.id !== partnerId),
  );
};

/** Test helper — pretend a report just went out. */
export const markReportSent = (businessId: string, partnerId: string): void => {
  const list = partners.get(businessId);
  if (!list) return;
  const p = list.find((x) => x.id === partnerId);
  if (p) p.lastSentAt = new Date().toISOString();
};