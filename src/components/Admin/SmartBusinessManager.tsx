"use client";

import React, { useState } from "react";
import { CheckCircle2, Download, ExternalLink, Nfc, PackageCheck, Truck } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { useAdminQuery } from "@/hooks/useAdminQuery";
import { useAdminMutation } from "@/hooks/useAdminMutation";
import styles from "./SmartBusinessManager.module.css";

type OrderPersonalization = {
  configurationId?: string;
  contactName?: string;
  company?: string;
  role?: string;
  email?: string;
  phone?: string;
  website?: string;
  qrTarget?: string;
  message?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  designTemplate?: string;
  accentColor?: string;
  proofRequested?: boolean;
  layoutApproved?: boolean;
};

type QueueRow = {
  device: {
    _id: string;
    publicCode: string;
    status: string;
    nfcUid?: string;
    updatedAt: number;
  };
  profile: {
    status: string;
    displayName?: string;
    company?: string;
    role?: string;
    email?: string;
    phone?: string;
  } | null;
  entitlement: {
    sku: string;
    kind: string;
    quantity: number;
    shopifyOrderGid: string;
    personalization?: OrderPersonalization;
  } | null;
  workspace: {
    shopifyCustomerGid: string;
    status: string;
  } | null;
  stats: {
    taps: number;
    vcardDownloads: number;
    lastInteractionAt?: number;
  } | null;
  publicUrl: string;
};

function deviceStatusLabel(status: string) {
  if (status === "provisioned") return "Wartet auf Kundenfreigabe";
  if (status === "approved") return "Freigegeben · bereit zum Programmieren";
  if (status === "programmed") return "NFC programmiert · bereit zum Versand";
  if (status === "shipped") return "Versendet";
  return status;
}

function csvCell(value: unknown) {
  const text = value == null ? "" : String(value);
  // Prevent spreadsheet formula execution when customer-provided names/notes are exported.
  const safe = /^[\s]*[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

function profileStatusLabel(status?: string) {
  if (status === "configuration_required") return "Einrichtung erforderlich";
  if (status === "configured") return "Konfiguriert";
  if (status === "approved") return "Vom Kunden freigegeben";
  return status || "Unbekannt";
}

export function SmartBusinessManager() {
  const rows = (useAdminQuery(api.smartHub.listProductionQueue) as QueueRow[] | undefined) || [];
  const updateDevice = useAdminMutation(api.smartHub.updateDeviceProduction);
  const [uidByDevice, setUidByDevice] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const transition = async (
    deviceId: string,
    status: "programmed" | "shipped",
  ) => {
    setBusyId(deviceId);
    setError("");
    try {
      await updateDevice({
        deviceId,
        status,
        nfcUid: status === "programmed" ? uidByDevice[deviceId] : undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status konnte nicht aktualisiert werden.");
    } finally {
      setBusyId(null);
    }
  };

  const exportProductionCsv = () => {
    const header = [
      "device_id",
      "status",
      "public_code",
      "public_url",
      "profile_name",
      "company",
      "sku",
      "shopify_order",
      "configuration_id",
      "design_template",
      "accent_color",
      "qr_target",
      "artwork_logo_url",
      "artwork_cover_url",
      "contact_email",
      "contact_phone",
      "proof_requested",
      "design_approved",
      "nfc_uid",
      "taps",
      "vcard_downloads",
    ];

    const body = rows.map((row) =>
      [
        row.device._id,
        row.device.status,
        row.device.publicCode,
        row.publicUrl,
        row.profile?.displayName,
        row.profile?.company,
        row.entitlement?.sku,
        row.entitlement?.shopifyOrderGid,
        row.entitlement?.personalization?.configurationId,
        row.entitlement?.personalization?.designTemplate,
        row.entitlement?.personalization?.accentColor,
        row.entitlement?.personalization?.qrTarget,
        row.entitlement?.personalization?.logoUrl,
        row.entitlement?.personalization?.coverImageUrl,
        row.entitlement?.personalization?.email,
        row.entitlement?.personalization?.phone,
        row.entitlement?.personalization?.proofRequested ? 'Yes' : 'No',
        row.entitlement?.personalization?.layoutApproved ? 'Yes' : 'No',
        row.device.nfcUid,
        row.stats?.taps || 0,
        row.stats?.vcardDownloads || 0,
      ]
        .map(csvCell)
        .join(","),
    );

    const blob = new Blob([[header.join(","), ...body].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `lordenryque-smart-business-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const counts = rows.reduce(
    (acc, row) => {
      acc[row.device.status] = (acc[row.device.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className={styles.container}>
      <section className={styles.summary}>
        <div>
          <p className={styles.eyebrow}>LOrdEnRYQuE Smart Hub</p>
          <h2>Smart Business Produktion</h2>
          <p>
            Kundenkonfiguration, Freigabe, NFC-Programmierung und Versand in einer
            einzigen operativen Warteschlange.
          </p>
        </div>

        <div className={styles.summaryActions}>
          <button type="button" onClick={exportProductionCsv} disabled={rows.length === 0}>
            <Download size={16} />
            Produktions-CSV exportieren
          </button>
        </div>

        <div className={styles.metrics}>
          <article>
            <span>Wartet</span>
            <strong>{counts.provisioned || 0}</strong>
          </article>
          <article>
            <span>Freigegeben</span>
            <strong>{counts.approved || 0}</strong>
          </article>
          <article>
            <span>Programmiert</span>
            <strong>{counts.programmed || 0}</strong>
          </article>
          <article>
            <span>Versendet</span>
            <strong>{counts.shipped || 0}</strong>
          </article>
        </div>
      </section>

      {error ? <div className={styles.error}>{error}</div> : null}

      <section className={styles.queue}>
        {rows.length === 0 ? (
          <div className={styles.empty}>
            <Nfc size={28} />
            <h3>Noch keine Smart-Business-Geräte</h3>
            <p>Nach einer bezahlten Smart-Business-Bestellung erscheint das Gerät hier.</p>
          </div>
        ) : (
          rows.map((row) => {
            const id = row.device._id;
            const busy = busyId === id;

            return (
              <article className={styles.card} key={id}>
                <header className={styles.cardHeader}>
                  <div>
                    <span className={styles.status} data-status={row.device.status}>
                      {deviceStatusLabel(row.device.status)}
                    </span>
                    <h3>{row.profile?.displayName || "Smart Contact Card"}</h3>
                    <p>
                      {[row.profile?.role, row.profile?.company].filter(Boolean).join(" · ") ||
                        row.entitlement?.sku ||
                        "Smart Business"}
                    </p>
                  </div>
                  <Nfc size={24} />
                </header>

                <div className={styles.details}>
                  <div>
                    <span>Profil</span>
                    <strong>{profileStatusLabel(row.profile?.status)}</strong>
                  </div>
                  <div>
                    <span>SKU</span>
                    <strong>{row.entitlement?.sku || "—"}</strong>
                  </div>
                  <div>
                    <span>Smart Code</span>
                    <strong>{row.device.publicCode}</strong>
                  </div>
                  <div>
                    <span>Interaktionen</span>
                    <strong>
                      {row.stats?.taps || 0} Aufrufe · {row.stats?.vcardDownloads || 0} Saves
                    </strong>
                  </div>
                </div>

                {row.entitlement?.personalization ? (
                  <div className={styles.details}>
                    <div>
                      <span>Konfiguration</span>
                      <strong>{row.entitlement.personalization.configurationId || '—'}</strong>
                    </div>
                    <div>
                      <span>Design</span>
                      <strong>{row.entitlement.personalization.designTemplate || '—'}</strong>
                    </div>
                    <div>
                      <span>QR-Ziel</span>
                      <strong>{row.entitlement.personalization.qrTarget || 'Digitale Visitenkarte'}</strong>
                    </div>
                    <div>
                      <span>Logo für Produktion</span>
                      {row.entitlement.personalization.logoUrl ? (
                        <a href={row.entitlement.personalization.logoUrl} target="_blank" rel="noopener noreferrer">Kundendatei ansehen</a>
                      ) : <strong>Kein Logo hochgeladen</strong>}
                    </div>
                  </div>
                ) : null}

                <a
                  className={styles.publicLink}
                  href={row.publicUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink size={15} />
                  {row.publicUrl}
                </a>

                {row.device.status === "approved" ? (
                  <div className={styles.productionAction}>
                    <label>
                      NFC UID <span>(optional)</span>
                      <input
                        value={uidByDevice[id] ?? row.device.nfcUid ?? ""}
                        onChange={(event) =>
                          setUidByDevice((current) => ({
                            ...current,
                            [id]: event.target.value,
                          }))
                        }
                        placeholder="z. B. 04:A1:B2:C3:D4:E5:80"
                      />
                    </label>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => transition(id, "programmed")}
                    >
                      <CheckCircle2 size={17} />
                      Als programmiert markieren
                    </button>
                  </div>
                ) : null}

                {row.device.status === "programmed" ? (
                  <div className={styles.productionAction}>
                    <p>
                      <PackageCheck size={17} />
                      NFC ist programmiert
                      {row.device.nfcUid ? ` · UID ${row.device.nfcUid}` : ""}
                    </p>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => transition(id, "shipped")}
                    >
                      <Truck size={17} />
                      Als versendet markieren
                    </button>
                  </div>
                ) : null}

                {row.device.status === "shipped" ? (
                  <div className={styles.completed}>
                    <Truck size={17} />
                    Produktionsfluss abgeschlossen
                  </div>
                ) : null}
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}