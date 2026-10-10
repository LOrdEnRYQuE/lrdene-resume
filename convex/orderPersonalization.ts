/** Only allowlisted Shopify line-item properties are retained for Smart Business production. */
export type SmartOrderPersonalization = {
  configurationId?: string;
  contactName?: string;
  company?: string;
  role?: string;
  email?: string;
  phone?: string;
  website?: string;
  qrTarget?: string;
  address?: string;
  instagram?: string;
  linkedin?: string;
  message?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  designTemplate?: string;
  accentColor?: string;
  proofRequested?: boolean;
  layoutApproved?: boolean;
};

export function parseOrderPersonalization(raw: unknown): SmartOrderPersonalization | undefined {
  if (!Array.isArray(raw)) return undefined;
  const properties = new Map<string, string>();
  for (const item of raw.slice(0, 80)) {
    if (!item || typeof item !== "object") continue;
    const { name, value } = item as { name?: unknown; value?: unknown };
    if (typeof name !== "string" || typeof value !== "string") continue;
    if (name.length > 100 || value.length > 2048) continue;
    properties.set(name, value.trim());
  }
  const value = (limit: number, ...names: string[]): string | undefined => {
    for (const name of names) {
      const text = properties.get(name)?.trim();
      if (text) return text.slice(0, limit);
    }
    return undefined;
  };
  const secureUrl = (...names: string[]): string | undefined => {
    const rawUrl = value(1000, ...names);
    if (!rawUrl) return undefined;
    try {
      const url = new URL(rawUrl);
      if (url.protocol !== "https:" || url.username || url.password) return undefined;
      return url.href.slice(0, 1000);
    } catch { return undefined; }
  };
  const uploadedFile = (...names: string[]): string | undefined => {
    const candidate = secureUrl(...names);
    if (!candidate) return undefined;
    const url = new URL(candidate);
    return url.hostname === "cdn.shopify.com" && url.pathname.includes("/uploads/") ? candidate : undefined;
  };
  const id = value(64, "_lr_configuration_id");
  const result: SmartOrderPersonalization = {
    configurationId: id && /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(id) ? id : undefined,
    contactName: value(120, "Kontaktname", "name"),
    company: value(120, "Firmenname", "company"),
    role: value(120, "Position", "role"),
    email: value(180, "E-Mail", "email"),
    phone: value(80, "Telefon", "phone"),
    website: secureUrl("Website / vCard Link", "Website", "website"),
    qrTarget: secureUrl("QR-Zieladresse", "destination"),
    address: value(240, "Standort", "address"),
    instagram: secureUrl("Instagram", "instagram"),
    linkedin: secureUrl("LinkedIn", "linkedin"),
    message: value(350, "Wunschtext", "Wunschtext / Hinweise", "message", "Über mich"),
    logoUrl: uploadedFile("Logo", "Artwork"),
    coverImageUrl: uploadedFile("Titelbild"),
    designTemplate: value(120, "Designvorlage", "Template"),
    accentColor: value(40, "Akzentfarbe", "accent"),
    proofRequested: properties.get("Entwurfsprüfung gewünscht") === "Ja" || properties.get("Entwurfsprüfung gewünscht") === "Yes" || undefined,
    layoutApproved: properties.get("Designfreigabe") === "Ja" || properties.get("Layout checked") === "Yes" || undefined,
  };
  return Object.values(result).some((item) => item !== undefined) ? result : undefined;
}