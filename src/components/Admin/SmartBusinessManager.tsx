"use client";

import React, { useState } from "react";
import { CheckCircle2, ExternalLink, Nfc, PackageCheck, Truck } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { useAdminQuery } from "@/hooks/useAdminQuery";
import { useAdminMutation } from "@/hooks/useAdminMutation";
import styles from "./SmartBusinessManager.module.css";

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
