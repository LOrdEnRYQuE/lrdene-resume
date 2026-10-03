export type PublicContactProfile = {
  status: string;
  displayName?: string;
  company?: string;
  role?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  website?: string;
  address?: string;
  photoUrl?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  linkedin?: string;
  bookingUrl?: string;
};

export function safeExternalUrl(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const url = new URL(candidate);
    if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

export function whatsappUrl(value?: string): string | undefined {
  if (!value) return undefined;
  const digits = value.replace(/[^0-9]/g, "");
  return digits ? `https://wa.me/${digits}` : undefined;
}

function escapeVCard(value?: string): string {
  return (value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

export function buildVCard(profile: PublicContactProfile): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCard(profile.displayName)}`,
  ];

  if (profile.company) lines.push(`ORG:${escapeVCard(profile.company)}`);
  if (profile.role) lines.push(`TITLE:${escapeVCard(profile.role)}`);
  if (profile.phone) lines.push(`TEL;TYPE=CELL:${escapeVCard(profile.phone)}`);
  if (profile.email) lines.push(`EMAIL;TYPE=INTERNET:${escapeVCard(profile.email)}`);
  if (profile.website) lines.push(`URL:${escapeVCard(safeExternalUrl(profile.website) ?? profile.website)}`);
  if (profile.address) lines.push(`ADR;TYPE=WORK:;;${escapeVCard(profile.address)};;;;`);

  lines.push("END:VCARD");
  return lines.join("\r\n");
}
