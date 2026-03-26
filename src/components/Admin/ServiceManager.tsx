"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import styles from "./ServiceManager.module.css";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Star,
  PlusCircle,
  Clock,
  DollarSign,
  Cloud,
  XCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SERVICE_LOCATIONS } from "@/utils/serviceLocations";
import { useAdminMutation } from "@/hooks/useAdminMutation";
import { useAdminQuery } from "@/hooks/useAdminQuery";

type LocationContentForm = {
  headline: string;
  intro: string;
  proofPoint: string;
  testimonial: string;
  faqQuestion: string;
  faqAnswer: string;
  ctaText: string;
};

function calculateLocationCompletion(data: Partial<LocationContentForm>) {
  const checks = [
    Boolean(data.headline?.trim()),
    Boolean(data.intro?.trim()),
    Boolean(data.proofPoint?.trim()),
    Boolean(data.testimonial?.trim()),
    Boolean(data.faqQuestion?.trim()),
    Boolean(data.faqAnswer?.trim()),
    Boolean(data.ctaText?.trim()),
  ];
  const completed = checks.filter(Boolean).length;
  const total = checks.length;
  return {
    score: Math.round((completed / total) * 100),
    completed,
    total,
  };
}

export const ServiceManager = () => {
  const services = useQuery(api.services.listAll) || [];
  const sections = (useAdminQuery(api.pages.getPageSections, { page: "services", includeDraft: true }) as any[]) || [];
  const createService = useAdminMutation(api.services.create);
  const updateService = useAdminMutation(api.services.update);
  const deleteService = useAdminMutation(api.services.remove);
  const upsertSection = useAdminMutation(api.pages.upsertSection);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const seedProjects = useMutation(api.seed.seedProjects);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    iconName: "Zap",
    price: "",
    deliveryTime: "",
    features: [] as string[],
    process: [] as { step: string; desc: string }[],
    status: "active",
    category: "Development",
    featured: false
  });

  const [featureInput, setFeatureInput] = useState("");
  const [selectedLocationServiceId, setSelectedLocationServiceId] = useState<string>("");
  const [selectedLocationSlug, setSelectedLocationSlug] = useState<string>(SERVICE_LOCATIONS[0]?.slug ?? "berlin");
  const [locationForm, setLocationForm] = useState<LocationContentForm>({
    headline: "",
    intro: "",
    proofPoint: "",
    testimonial: "",
    faqQuestion: "",
    faqAnswer: "",
    ctaText: "Book a discovery call",
  });
  const [isSavingLocation, setIsSavingLocation] = useState(false);
  const [matrixSort, setMatrixSort] = useState<"scoreAsc" | "scoreDesc" | "city" | "service">("scoreAsc");
  const [matrixFilter, setMatrixFilter] = useState<"all" | "complete" | "incomplete" | "missingFaq">("incomplete");
  const [selectedMatrixKeys, setSelectedMatrixKeys] = useState<string[]>([]);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      iconName: "Zap",
      price: "",
      deliveryTime: "",
      features: [],
      process: [],
      status: "active",
      category: "Development",
      featured: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: any) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      slug: service.slug,
      description: service.description,
      iconName: service.iconName,
      price: service.price || "",
      deliveryTime: service.deliveryTime || "",
      features: service.features || [],
      process: service.process || [],
      status: service.status,
      category: service.category,
      featured: service.featured || false
    });
    setIsModalOpen(true);
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setFormData({ ...formData, features: [...formData.features, featureInput] });
    setFeatureInput("");
  };

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  const handleSync = async () => {
    if (!confirm("This will synchronize default services from the system. Continue?")) return;
    setIsSyncing(true);
    try {
      await seedProjects({ force: true });
    } catch (err) {
      console.error("Sync failed:", err);
      alert("Sync failed.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingService) {
        const updatePayload = { ...formData } as Record<string, unknown>;
        delete updatePayload.featured;
        await updateService({ id: editingService._id, ...(updatePayload as any) });
      } else {
        await createService(formData);
      }
      setIsModalOpen(false);
      setEditingService(null);
    } catch (error) {
      console.error("Failed to save service", error);
    }
  };

  const selectedLocationService = services.find((service) => service._id === selectedLocationServiceId) || services[0];
  const selectedLocation = SERVICE_LOCATIONS.find((location) => location.slug === selectedLocationSlug) || SERVICE_LOCATIONS[0];

  const locationSectionKey = selectedLocationService && selectedLocation
    ? `location-${selectedLocationService.slug}-${selectedLocation.slug}`
    : "";

  const existingLocationSection = locationSectionKey
    ? sections.find((section) => section.sectionKey === locationSectionKey)
    : null;

  const preloadLocationForm = () => {
    const existingData = (existingLocationSection?.data ?? {}) as Partial<LocationContentForm>;
    setLocationForm({
      headline:
        existingData.headline ||
        `${selectedLocationService?.title || "Service"} in ${selectedLocation?.city || "Berlin"}`,
      intro:
        existingData.intro ||
        `Premium delivery for teams in ${selectedLocation?.city || "Berlin"} looking for measurable growth and modern execution.`,
      proofPoint: existingData.proofPoint || selectedLocation?.proofPoint || "",
      testimonial:
        existingData.testimonial ||
        "Execution was clean, fast, and exactly what our growth plan needed.",
      faqQuestion: existingData.faqQuestion || `How does ${selectedLocationService?.title || "this service"} delivery work?`,
      faqAnswer:
        existingData.faqAnswer ||
        "We scope outcomes first, define milestones, and ship in iterative weekly cycles.",
      ctaText: existingData.ctaText || "Book a discovery call",
    });
  };

  const saveLocationContent = async () => {
    if (!selectedLocationService || !selectedLocation) return;
    setIsSavingLocation(true);
    try {
      await upsertSection({
        id: existingLocationSection?._id,
        page: "services",
        sectionKey: `location-${selectedLocationService.slug}-${selectedLocation.slug}`,
        type: "locationLanding",
        data: {
          ...locationForm,
          serviceSlug: selectedLocationService.slug,
          locationSlug: selectedLocation.slug,
          city: selectedLocation.city,
          region: selectedLocation.region,
          country: selectedLocation.country,
        },
        status: "published",
        order: existingLocationSection?.order ?? 1000,
      });
      alert("Location landing content saved.");
    } catch (error) {
      console.error("Failed to save location content", error);
      alert("Failed to save location content.");
    } finally {
      setIsSavingLocation(false);
    }
  };

  const openEditorForLocation = (serviceId: string, locationSlug: string) => {
    setSelectedLocationServiceId(serviceId);
    setSelectedLocationSlug(locationSlug);
  };

  const locationRows = services.flatMap((service) =>
    SERVICE_LOCATIONS.map((location) => {
      const key = `location-${service.slug}-${location.slug}`;
      const section = sections.find((entry) => entry.sectionKey === key);
      const data = (section?.data ?? {}) as Partial<LocationContentForm>;
      const completion = calculateLocationCompletion(data);
      return {
        key,
        serviceId: service._id,
        serviceTitle: service.title,
        serviceSlug: service.slug,
        location,
        hasContent: Boolean(section),
        hasFaq: Boolean(data.faqQuestion?.trim() && data.faqAnswer?.trim()),
        completion,
      };
    }),
  );

  const filteredLocationRows = locationRows
    .filter((row) => {
      if (matrixFilter === "complete") return row.completion.score === 100;
      if (matrixFilter === "incomplete") return row.completion.score < 100;
      if (matrixFilter === "missingFaq") return !row.hasFaq;
      return true;
    })
    .sort((a, b) => {
      if (matrixSort === "scoreAsc") return a.completion.score - b.completion.score;
      if (matrixSort === "scoreDesc") return b.completion.score - a.completion.score;
      if (matrixSort === "city") return a.location.city.localeCompare(b.location.city);
      return a.serviceTitle.localeCompare(b.serviceTitle);
    });

  const toggleSelectedMatrixKey = (key: string) => {
    setSelectedMatrixKeys((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    );
  };

  const selectAllVisibleMatrixRows = () => {
    setSelectedMatrixKeys(filteredLocationRows.map((row) => row.key));
  };

  const clearSelectedMatrixRows = () => {
    setSelectedMatrixKeys([]);
  };

  const runBulkAutofill = async (mode: "faq" | "testimonial" | "all") => {
    if (selectedMatrixKeys.length === 0) {
      alert("Select at least one row in the matrix.");
      return;
    }

    setIsBulkUpdating(true);
    try {
      for (const row of locationRows) {
        if (!selectedMatrixKeys.includes(row.key)) continue;
        const existingSection = sections.find((entry) => entry.sectionKey === row.key);
        const existingData = (existingSection?.data ?? {}) as Partial<LocationContentForm>;

        const faqQuestion =
          existingData.faqQuestion?.trim() ||
          `How does ${row.serviceTitle} delivery work in ${row.location.city}?`;
        const faqAnswer =
          existingData.faqAnswer?.trim() ||
          "We scope outcomes first, define milestones, and ship in iterative weekly cycles with transparent reporting.";
        const testimonial =
          existingData.testimonial?.trim() ||
          "Execution was structured, reliable, and directly aligned to our growth goals.";

        await upsertSection({
          id: existingSection?._id,
          page: "services",
          sectionKey: row.key,
          type: "locationLanding",
          data: {
            headline: existingData.headline || `${row.serviceTitle} in ${row.location.city}`,
            intro:
              existingData.intro ||
              `Premium delivery for teams in ${row.location.city}, ${row.location.country}, focused on measurable growth.`,
            proofPoint: existingData.proofPoint || row.location.proofPoint,
            testimonial: mode === "faq" ? existingData.testimonial || "" : testimonial,
            faqQuestion: mode === "testimonial" ? existingData.faqQuestion || "" : faqQuestion,
            faqAnswer: mode === "testimonial" ? existingData.faqAnswer || "" : faqAnswer,
            ctaText: existingData.ctaText || "Book a discovery call",
            serviceSlug: row.serviceSlug,
            locationSlug: row.location.slug,
            city: row.location.city,
            region: row.location.region,
            country: row.location.country,
          },
          status: "published",
          order: existingSection?.order ?? 1000,
        });
      }
      alert("Bulk content autofill completed.");
      setSelectedMatrixKeys([]);
    } catch (error) {
      console.error("Bulk autofill failed", error);
      alert("Bulk autofill failed.");
    } finally {
      setIsBulkUpdating(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Service <span className="gold-text">Catalog</span></h1>
          <p>Package your expertise into premium service offerings.</p>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={styles.syncBtn} 
            onClick={handleSync}
            disabled={isSyncing}
          >
            <Cloud size={18} className={isSyncing ? styles.syncingIcon : ""} />
            {isSyncing ? "Syncing..." : "Sync Services"}
          </button>
          <button className={styles.addBtn} onClick={handleOpenCreate}>
            <Plus size={20} /> New Offering
          </button>
        </div>
      </header>

      <div className={styles.serviceGrid}>
        {services.map((service) => (
          <motion.div 
            key={service._id}
            className={styles.serviceCard}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={styles.cardHeader}>
              <div className={styles.titleArea}>
                <h3>{service.title}</h3>
                {service.featured && <Star size={14} className="gold-text" fill="currentColor" />}
              </div>
              <span className={styles.categoryBadge}>{service.category}</span>
            </div>
            
            <p className={styles.description}>{service.description}</p>

            <div className={styles.metaRow}>
              <span><DollarSign size={14} /> {service.price || "Custom"}</span>
              <span><Clock size={14} /> {service.deliveryTime || "TBD"}</span>
            </div>

            <div className={styles.actions}>
              <button className={styles.editBtn} onClick={() => handleOpenEdit(service)}>
                <Edit2 size={16} /> Edit
              </button>
              <button className={styles.deleteBtn} onClick={() => deleteService({ id: service._id })}>
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <section className={styles.locationSection}>
        <h2>Service-Location SEO Landing Editor</h2>
        <p>Create and maintain unique SEO copy for routes like <code>/services/ai-automation-berlin</code>.</p>

        <div className={styles.locationControls}>
          <div className={styles.formGroup}>
            <label>Service</label>
            <select
              value={selectedLocationService?._id ?? ""}
              onChange={(event) => setSelectedLocationServiceId(event.target.value)}
            >
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.title}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Location</label>
            <select
              value={selectedLocationSlug}
              onChange={(event) => setSelectedLocationSlug(event.target.value)}
            >
              {SERVICE_LOCATIONS.map((location) => (
                <option key={location.slug} value={location.slug}>
                  {location.city}, {location.country}
                </option>
              ))}
            </select>
          </div>
          <button type="button" className={styles.syncBtn} onClick={preloadLocationForm}>
            Load Suggested Copy
          </button>
        </div>

        <div className={styles.locationSlugPreview}>
          Route preview:{" "}
          <strong>
            /services/{selectedLocationService?.slug || "service"}-{selectedLocation?.slug || "berlin"}
          </strong>
        </div>

        <div className={styles.locationFormGrid}>
          <div className={styles.formGroup}>
            <label>Headline</label>
            <input
              value={locationForm.headline}
              onChange={(event) => setLocationForm({ ...locationForm, headline: event.target.value })}
              placeholder="AI Automation in Berlin"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Intro</label>
            <textarea
              rows={3}
              value={locationForm.intro}
              onChange={(event) => setLocationForm({ ...locationForm, intro: event.target.value })}
              placeholder="How this service helps local clients..."
            />
          </div>
          <div className={styles.formGroup}>
            <label>Proof Point</label>
            <textarea
              rows={2}
              value={locationForm.proofPoint}
              onChange={(event) => setLocationForm({ ...locationForm, proofPoint: event.target.value })}
              placeholder="Unique local trust signal"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Testimonial Snippet</label>
            <textarea
              rows={2}
              value={locationForm.testimonial}
              onChange={(event) => setLocationForm({ ...locationForm, testimonial: event.target.value })}
              placeholder="One-line social proof"
            />
          </div>
          <div className={styles.formGroup}>
            <label>FAQ Question</label>
            <input
              value={locationForm.faqQuestion}
              onChange={(event) => setLocationForm({ ...locationForm, faqQuestion: event.target.value })}
              placeholder="Common decision-stage question"
            />
          </div>
          <div className={styles.formGroup}>
            <label>FAQ Answer</label>
            <textarea
              rows={3}
              value={locationForm.faqAnswer}
              onChange={(event) => setLocationForm({ ...locationForm, faqAnswer: event.target.value })}
              placeholder="Clear, concise answer"
            />
          </div>
          <div className={styles.formGroup}>
            <label>CTA Text</label>
            <input
              value={locationForm.ctaText}
              onChange={(event) => setLocationForm({ ...locationForm, ctaText: event.target.value })}
              placeholder="Book a strategy call"
            />
          </div>
        </div>

        <div className={styles.locationActions}>
          <button type="button" className={styles.saveBtn} onClick={saveLocationContent} disabled={isSavingLocation}>
            {isSavingLocation ? "Saving..." : "Save Location Landing Content"}
          </button>
        </div>
      </section>

      <section className={styles.locationMatrixSection}>
        <h2>Location Landing Matrix</h2>
        <p>Track completion and jump directly to editing or viewing each live location page.</p>
        <div className={styles.matrixToolbar}>
          <div className={styles.formGroup}>
            <label>Sort</label>
            <select value={matrixSort} onChange={(event) => setMatrixSort(event.target.value as typeof matrixSort)}>
              <option value="scoreAsc">Lowest score first</option>
              <option value="scoreDesc">Highest score first</option>
              <option value="city">City A-Z</option>
              <option value="service">Service A-Z</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Filter</label>
            <select value={matrixFilter} onChange={(event) => setMatrixFilter(event.target.value as typeof matrixFilter)}>
              <option value="all">All rows</option>
              <option value="incomplete">Incomplete only</option>
              <option value="complete">Complete only</option>
              <option value="missingFaq">Missing FAQ only</option>
            </select>
          </div>
          <div className={styles.matrixSummary}>
            Showing {filteredLocationRows.length} of {locationRows.length}
          </div>
        </div>
        <div className={styles.matrixBulkActions}>
          <button type="button" className={styles.syncBtn} onClick={selectAllVisibleMatrixRows}>
            Select all visible
          </button>
          <button type="button" className={styles.syncBtn} onClick={clearSelectedMatrixRows}>
            Clear selection
          </button>
          <button
            type="button"
            className={styles.syncBtn}
            onClick={() => runBulkAutofill("faq")}
            disabled={isBulkUpdating}
          >
            Autofill FAQ
          </button>
          <button
            type="button"
            className={styles.syncBtn}
            onClick={() => runBulkAutofill("testimonial")}
            disabled={isBulkUpdating}
          >
            Autofill Testimonial
          </button>
          <button
            type="button"
            className={styles.saveBtn}
            onClick={() => runBulkAutofill("all")}
            disabled={isBulkUpdating}
          >
            {isBulkUpdating ? "Updating..." : "Autofill FAQ + Testimonial"}
          </button>
          <span className={styles.matrixSelectionInfo}>
            Selected: {selectedMatrixKeys.length}
          </span>
        </div>
        <div className={styles.locationMatrix}>
          {filteredLocationRows.map((row) => (
            <div key={row.key} className={styles.matrixRow}>
              <label className={styles.matrixCheckbox}>
                <input
                  type="checkbox"
                  checked={selectedMatrixKeys.includes(row.key)}
                  onChange={() => toggleSelectedMatrixKey(row.key)}
                />
              </label>
              <div>
                <div className={styles.matrixTitle}>
                  {row.serviceTitle} - {row.location.city}
                </div>
                <div className={styles.matrixMeta}>
                  /services/{row.serviceSlug}-{row.location.slug}
                </div>
                {!row.hasFaq ? <div className={styles.matrixWarn}>FAQ missing</div> : null}
              </div>
              <div className={styles.matrixScore}>
                <span>{row.completion.score}%</span>
                <small>
                  {row.completion.completed}/{row.completion.total} fields
                </small>
              </div>
              <div className={styles.matrixActions}>
                <button
                  type="button"
                  className={styles.editBtn}
                  onClick={() => {
                    openEditorForLocation(row.serviceId, row.location.slug);
                    setTimeout(preloadLocationForm, 0);
                  }}
                >
                  Edit
                </button>
                <a
                  href={`/services/${row.serviceSlug}-${row.location.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.syncBtn}
                >
                  Open Live
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <motion.div 
              className={styles.modal}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <h2>{editingService ? "Edit Service" : "New Service Listing"}</h2>
              
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Title</label>
                    <input 
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Custom AI Integration"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Slug</label>
                    <input 
                      value={formData.slug}
                      onChange={e => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="ai-integration"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Briefly describe the outcome..."
                    required
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Price Range</label>
                    <input 
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g. From $5,000"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Delivery Timeline</label>
                    <input 
                      value={formData.deliveryTime}
                      onChange={e => setFormData({ ...formData, deliveryTime: e.target.value })}
                      placeholder="e.g. 2-4 Weeks"
                    />
                  </div>
                </div>

                <div className={styles.section}>
                  <h3>Core Features</h3>
                  <div className={styles.listBuilder}>
                    <input 
                      value={featureInput}
                      onChange={e => setFeatureInput(e.target.value)}
                      placeholder="Add a benefit or technical feature..."
                    />
                    <button type="button" onClick={addFeature}><PlusCircle size={20} /></button>
                  </div>
                  <div className={styles.chipCloud}>
                    {formData.features.map((f, i) => (
                      <span key={i} className={styles.chip}>
                        {f} <XCircle size={14} onClick={() => removeFeature(i)} />
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.saveBtn}>
                    {editingService ? "Update Offering" : "Publish Offering"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
