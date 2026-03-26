export const ANALYTICS_EVENTS = {
  VIEW_SERVICE: "view_service",
  VIEW_PROJECT: "view_project",
  OPEN_DEMO: "open_demo",
  CLICK_CTA: "click_cta",
  INTERNAL_LINK_CLICK: "internal_link_click",
  START_CONTACT_FORM: "start_contact_form",
  CONTACT_STEP_VIEW: "contact_step_view",
  CONTACT_STEP_NEXT: "contact_step_next",
  CONTACT_STEP_BACK: "contact_step_back",
  SELECT_PROMOTION_TIER: "select_promotion_tier",
  SUBMIT_CONTACT_FORM: "submit_contact_form",
  ATTRIBUTION: "attribution",
  CONVERSION: "conversion",
} as const;

export type AnalyticsEventType = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
