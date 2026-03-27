/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as adminAuth from "../adminAuth.js";
import type * as adminPreferences from "../adminPreferences.js";
import type * as adminRateLimit from "../adminRateLimit.js";
import type * as ai from "../ai.js";
import type * as analytics from "../analytics.js";
import type * as analytics_pro from "../analytics_pro.js";
import type * as autoPosts from "../autoPosts.js";
import type * as communications from "../communications.js";
import type * as crons from "../crons.js";
import type * as demos from "../demos.js";
import type * as emails from "../emails.js";
import type * as http from "../http.js";
import type * as leads from "../leads.js";
import type * as media from "../media.js";
import type * as pages from "../pages.js";
import type * as portals from "../portals.js";
import type * as posts from "../posts.js";
import type * as products from "../products.js";
import type * as projects from "../projects.js";
import type * as seed from "../seed.js";
import type * as seedDemos from "../seedDemos.js";
import type * as seedOfferings from "../seedOfferings.js";
import type * as services from "../services.js";
import type * as settings from "../settings.js";
import type * as siteMetadata from "../siteMetadata.js";
import type * as stats from "../stats.js";
import type * as tasks from "../tasks.js";
import type * as webhooks from "../webhooks.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  adminAuth: typeof adminAuth;
  adminPreferences: typeof adminPreferences;
  adminRateLimit: typeof adminRateLimit;
  ai: typeof ai;
  analytics: typeof analytics;
  analytics_pro: typeof analytics_pro;
  autoPosts: typeof autoPosts;
  communications: typeof communications;
  crons: typeof crons;
  demos: typeof demos;
  emails: typeof emails;
  http: typeof http;
  leads: typeof leads;
  media: typeof media;
  pages: typeof pages;
  portals: typeof portals;
  posts: typeof posts;
  products: typeof products;
  projects: typeof projects;
  seed: typeof seed;
  seedDemos: typeof seedDemos;
  seedOfferings: typeof seedOfferings;
  services: typeof services;
  settings: typeof settings;
  siteMetadata: typeof siteMetadata;
  stats: typeof stats;
  tasks: typeof tasks;
  webhooks: typeof webhooks;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
