import '@shopify/ui-extensions/preact';
import {render} from 'preact';
import {useEffect, useMemo, useState} from 'preact/hooks';

export default async () => {
  render(<SmartBusinessPage />, document.body);
};

function SmartBusinessPage() {
  const [hub, setHub] = useState(null);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [draft, setDraft] = useState({});
  const [state, setState] = useState({loading: true, saving: false, error: '', saved: false});

  const backendUrl = String(shopify.settings.value?.backend_url || '').replace(/\/$/, '');

  async function apiFetch(path, options = {}) {
    if (!backendUrl) {
      throw new Error('Smart Hub backend URL ist noch nicht konfiguriert.');
    }
    const token = await shopify.sessionToken.get();
    const response = await fetch(`${backendUrl}${path}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload.ok === false) {
      throw new Error(payload.error || `Smart Hub request failed (${response.status})`);
    }
    return payload;
  }

  async function loadHub() {
    setState((current) => ({...current, loading: true, error: ''}));
    try {
      const payload = await apiFetch('/smart-hub/customer');
      setHub(payload.hub);
      setState((current) => ({...current, loading: false}));
    } catch (error) {
      setState((current) => ({
        ...current,
        loading: false,
        error: error instanceof Error ? error.message : 'Smart Hub konnte nicht geladen werden.',
      }));
    }
  }

  useEffect(() => {
    loadHub();
  }, []);

  const selectedProfile = useMemo(
    () => hub?.profiles?.find((profile) => profile._id === selectedProfileId) || null,
    [hub, selectedProfileId],
  );

  function editProfile(profile) {
    setSelectedProfileId(profile._id);
    setDraft({
      displayName: profile.displayName || '',
      company: profile.company || '',
      role: profile.role || '',
      phone: profile.phone || '',
      email: profile.email || '',
      whatsapp: profile.whatsapp || '',
      website: profile.website || '',
      address: profile.address || '',
      instagram: profile.instagram || '',
      facebook: profile.facebook || '',
      tiktok: profile.tiktok || '',
      linkedin: profile.linkedin || '',
      bookingUrl: profile.bookingUrl || '',
    });
    setState((current) => ({...current, error: '', saved: false}));
  }

  function field(name) {
    return {
      value: draft[name] || '',
      onChange: (event) => {
        const value = event.currentTarget.value;
        setDraft((current) => ({...current, [name]: value}));
        setState((current) => ({...current, saved: false}));
      },
    };
  }

  async function saveProfile(event) {
    event.preventDefault();
    if (!selectedProfileId) return;

    setState((current) => ({...current, saving: true, error: '', saved: false}));
    try {
      await apiFetch('/smart-hub/contact', {
        method: 'PATCH',
        body: JSON.stringify({profileId: selectedProfileId, ...draft}),
      });
      await loadHub();
      setState((current) => ({...current, saving: false, saved: true}));
    } catch (error) {
      setState((current) => ({
        ...current,
        saving: false,
        error: error instanceof Error ? error.message : 'Änderungen konnten nicht gespeichert werden.',
      }));
    }
  }

  if (state.loading) {
    return (
      <s-page heading="Smart Business">
        <s-text>LOrdEnRYQuE Smart Hub wird geladen…</s-text>
      </s-page>
    );
  }

  if (state.error && !hub) {
    return (
      <s-page heading="Smart Business">
        <s-banner tone="critical" title="Smart Hub nicht verfügbar">
          <s-text>{state.error}</s-text>
        </s-banner>
        <s-button onClick={loadHub}>Erneut versuchen</s-button>
      </s-page>
    );
  }

  const entitlements = hub?.entitlements || [];
  const contactProfiles = (hub?.profiles || []).filter((profile) => profile.kind === 'contact_card');
  const devices = hub?.devices || [];

  return (
    <s-page heading="Smart Business">
      <s-stack direction="block" gap="base">
        <s-text>
          Verwalten Sie Ihre gekauften LOrdEnRYQuE Smart Produkte direkt in Ihrem Shopify-Konto.
        </s-text>

        {state.error ? (
          <s-banner tone="critical" title="Fehler">
            <s-text>{state.error}</s-text>
          </s-banner>
        ) : null}

        {state.saved ? (
          <s-banner tone="success" title="Gespeichert">
            <s-text>Die Smart Contact Card wurde aktualisiert. NFC und QR müssen nicht neu gedruckt werden.</s-text>
          </s-banner>
        ) : null}

        {entitlements.length === 0 ? (
          <s-banner title="Noch keine Smart Produkte">
            <s-text>
              Nach einer bezahlten Smart-Business-Bestellung erscheinen Ihre Produkte automatisch hier.
            </s-text>
          </s-banner>
        ) : (
          <s-stack direction="block" gap="base">
            <s-text type="strong">Meine Smart Produkte</s-text>
            {entitlements.map((item) => (
              <s-stack key={item._id} direction="block" gap="small-200">
                <s-text type="strong">{labelForKind(item.kind)}</s-text>
                <s-text>{statusLabel(item.status)}</s-text>
                <s-text>SKU: {item.sku} · Menge: {item.quantity}</s-text>
              </s-stack>
            ))}
          </s-stack>
        )}

        {contactProfiles.length > 0 ? (
          <s-stack direction="block" gap="base">
            <s-text type="strong">Smart Contact Cards</s-text>
            {contactProfiles.map((profile, index) => {
              const device = devices.find((candidate) => candidate.profileId === profile._id);
              return (
                <s-stack key={profile._id} direction="block" gap="small-200">
                  <s-text type="strong">
                    {profile.displayName || `Kontaktkarte ${index + 1}`}
                  </s-text>
                  <s-text>{profileStatusLabel(profile.status)}</s-text>
                  {device ? <s-text>Smart Code: {device.publicCode}</s-text> : null}
                  <s-button onClick={() => editProfile(profile)}>Bearbeiten</s-button>
                </s-stack>
              );
            })}
          </s-stack>
        ) : null}

        {selectedProfile ? (
          <s-form onSubmit={saveProfile}>
            <s-stack direction="block" gap="base">
              <s-text type="strong">Kontaktkarte bearbeiten</s-text>
              <s-text-field label="Name" name="displayName" {...field('displayName')} />
              <s-text-field label="Unternehmen" name="company" {...field('company')} />
              <s-text-field label="Position / Funktion" name="role" {...field('role')} />
              <s-phone-field label="Telefon" name="phone" {...field('phone')} />
              <s-email-field label="E-Mail" name="email" {...field('email')} />
              <s-phone-field label="WhatsApp" name="whatsapp" {...field('whatsapp')} />
              <s-text-field label="Website" name="website" {...field('website')} />
              <s-text-field label="Adresse" name="address" {...field('address')} />
              <s-text-field label="Instagram" name="instagram" {...field('instagram')} />
              <s-text-field label="Facebook" name="facebook" {...field('facebook')} />
              <s-text-field label="TikTok" name="tiktok" {...field('tiktok')} />
              <s-text-field label="LinkedIn" name="linkedin" {...field('linkedin')} />
              <s-text-field label="Booking URL" name="bookingUrl" {...field('bookingUrl')} />
              <s-button type="submit" variant="primary" disabled={state.saving}>
                {state.saving ? 'Wird gespeichert…' : 'Änderungen speichern'}
              </s-button>
              <s-button
                type="button"
                onClick={() => {
                  setSelectedProfileId(null);
                  setDraft({});
                  setState((current) => ({...current, saved: false, error: ''}));
                }}
              >
                Abbrechen
              </s-button>
            </s-stack>
          </s-form>
        ) : null}
      </s-stack>
    </s-page>
  );
}

function labelForKind(kind) {
  return {
    contact_card: 'NFC Smart Contact Card',
    review_stand: 'Google Review Stand',
    review_card: 'Google Review Card',
    business_kit: 'NFC Business Kit',
    social: 'Social Media Stand',
    wifi: 'WiFi Stand',
    menu_booking: 'Menü & Booking Stand',
    growth_kit: 'Smart Business Growth Kit',
    hospitality_kit: 'Smart Hospitality Kit',
  }[kind] || 'Smart Business Produkt';
}

function statusLabel(status) {
  if (status === 'active') return 'Aktiv';
  if (status === 'pending_implementation') return 'Einrichtung wird vorbereitet';
  if (status === 'revoked') return 'Deaktiviert';
  return status;
}

function profileStatusLabel(status) {
  if (status === 'configuration_required') return 'Einrichtung erforderlich';
  if (status === 'configured') return 'Konfiguriert';
  if (status === 'approved') return 'Design freigegeben';
  if (status === 'suspended') return 'Deaktiviert';
  return status;
}
