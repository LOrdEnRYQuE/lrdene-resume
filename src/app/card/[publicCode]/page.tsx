import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import {
  safeExternalUrl,
  whatsappUrl,
} from "@/lib/smartHub/contactCard";

export const runtime = "edge";

type PageProps = {
  params: Promise<{ publicCode: string }>;
};

export default async function SmartContactCardPage({ params }: PageProps) {
  const { publicCode } = await params;
  const card = await fetchQuery(api.smartHub.getPublicContactCard, { publicCode });

  if (!card) notFound();

  const profile = card.profile;
  const configured = profile.status !== "configuration_required";
  const website = safeExternalUrl(profile.website);
  const booking = safeExternalUrl(profile.bookingUrl);
  const whatsapp = whatsappUrl(profile.whatsapp);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0d0f12",
        color: "#f7f7f5",
        padding: "48px 20px",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 720,
          margin: "0 auto",
          border: "1px solid rgba(255,255,255,.14)",
          borderRadius: 28,
          padding: 28,
          background: "rgba(255,255,255,.045)",
          boxShadow: "0 24px 80px rgba(0,0,0,.28)",
        }}
      >
        {!configured ? (
          <>
            <p style={{ opacity: 0.65, margin: 0 }}>LOrdEnRYQuE Smart Business</p>
            <h1 style={{ fontSize: 32, margin: "10px 0 12px" }}>
              Diese Smart Contact Card wird gerade eingerichtet.
            </h1>
            <p style={{ opacity: 0.76, lineHeight: 1.6 }}>
              Der permanente NFC-/QR-Link ist bereits reserviert. Die Kontaktdaten
              erscheinen hier, sobald der Karteninhaber die Konfiguration im Smart Hub
              abgeschlossen hat.
            </p>
          </>
        ) : (
          <>
            <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
              {profile.photoUrl ? (
                <Image
                  src={profile.photoUrl}
                  alt={profile.displayName ?? "Kontakt"}
                  width={112}
                  height={112}
                  unoptimized
                  style={{ borderRadius: 24, objectFit: "cover" }}
                />
              ) : null}
              <div>
                <p style={{ opacity: 0.62, margin: 0 }}>LOrdEnRYQuE Smart Contact</p>
                <h1 style={{ fontSize: 38, margin: "8px 0 4px" }}>
                  {profile.displayName ?? "Kontakt"}
                </h1>
                <p style={{ opacity: 0.78, margin: 0 }}>
                  {[profile.role, profile.company].filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 12,
                marginTop: 28,
              }}
            >
              {profile.phone ? <a href={`tel:${profile.phone}`} style={linkStyle}>Anrufen</a> : null}
              {profile.email ? <a href={`mailto:${profile.email}`} style={linkStyle}>E-Mail</a> : null}
              {whatsapp ? <a href={whatsapp} style={linkStyle}>WhatsApp</a> : null}
              {website ? <a href={website} style={linkStyle}>Website</a> : null}
              {booking ? <a href={booking} style={linkStyle}>Termin buchen</a> : null}
              <a href={`/card/${publicCode}/contact.vcf`} style={primaryLinkStyle}>
                Kontakt speichern
              </a>
            </div>

            {profile.address ? (
              <p style={{ marginTop: 24, opacity: 0.72 }}>{profile.address}</p>
            ) : null}

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 24 }}>
              {[
                ["Instagram", profile.instagram],
                ["Facebook", profile.facebook],
                ["TikTok", profile.tiktok],
                ["LinkedIn", profile.linkedin],
              ].map(([label, value]) => {
                const url = safeExternalUrl(value);
                return url ? (
                  <a key={label} href={url} style={{ color: "inherit", opacity: 0.82 }}>
                    {label}
                  </a>
                ) : null;
              })}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

const linkStyle = {
  display: "block",
  padding: "14px 16px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,.16)",
  color: "inherit",
  textDecoration: "none",
  textAlign: "center" as const,
};

const primaryLinkStyle = {
  ...linkStyle,
  background: "#f7f7f5",
  color: "#111315",
  fontWeight: 700,
};
