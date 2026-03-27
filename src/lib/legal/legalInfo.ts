export const LEGAL_LAST_UPDATED = "2026-03-26";

export const LEGAL_ENTITY = {
  brand: "LOrdEnRYQuE | Advanced Digital Solution",
  owner: "Attila Lazar",
  businessType: "Nebengewerbe (Einzelunternehmen)",
  street: "Nahensteig 188E",
  postalCode: "84028",
  city: "Landshut",
  country: "Germany",
  email: "lordenryque.dev@gmail.com",
  phone: "+49 172 2620671",
  website: "https://lordenryque.com",
  vatId: "",
  taxNoteDe: "Nebengewerbe als Einzelunternehmen. Es gilt die Kleinunternehmerregelung gemäß § 19 UStG; daher wird keine Umsatzsteuer ausgewiesen.",
  taxNoteEn: "Part-time sole proprietorship (Nebengewerbe). The small business regulation under Section 19 German VAT Act applies; therefore VAT is not separately shown.",
} as const;

export const LEGAL_PROCESSORS = [
  { name: "Cloudflare", purpose: "Hosting, CDN, DNS, security" },
  { name: "Convex", purpose: "Application backend and database" },
  { name: "GitHub", purpose: "Source code hosting and deployment workflows" },
] as const;
