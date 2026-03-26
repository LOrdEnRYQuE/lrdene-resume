import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getStatus = query({
  args: {
    fingerprint: v.string(),
    now: v.number(),
  },
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query("adminLoginAttempts")
      .withIndex("by_fingerprint", (q) => q.eq("fingerprint", args.fingerprint))
      .unique();

    if (!row || !row.blockedUntil || row.blockedUntil <= args.now) {
      return { limited: false as const, retryAfterMs: 0 };
    }

    return {
      limited: true as const,
      retryAfterMs: Math.max(1, row.blockedUntil - args.now),
    };
  },
});

export const registerFailure = mutation({
  args: {
    fingerprint: v.string(),
    now: v.number(),
    windowMs: v.number(),
    maxAttempts: v.number(),
  },
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query("adminLoginAttempts")
      .withIndex("by_fingerprint", (q) => q.eq("fingerprint", args.fingerprint))
      .unique();

    if (!row) {
      await ctx.db.insert("adminLoginAttempts", {
        fingerprint: args.fingerprint,
        attempts: 1,
        windowStart: args.now,
        lastAttempt: args.now,
        blockedUntil: args.maxAttempts <= 1 ? args.now + args.windowMs : undefined,
      });
      return { limited: args.maxAttempts <= 1, retryAfterMs: args.maxAttempts <= 1 ? args.windowMs : 0 };
    }

    let attempts = row.attempts;
    const windowExpired = row.windowStart + args.windowMs <= args.now;

    if (windowExpired) {
      attempts = 0;
    }

    const nextAttempts = attempts + 1;
    const limited = nextAttempts >= args.maxAttempts;
    const blockedUntil = limited ? args.now + args.windowMs : undefined;

    await ctx.db.patch(row._id, {
      attempts: nextAttempts,
      windowStart: windowExpired ? args.now : row.windowStart,
      lastAttempt: args.now,
      blockedUntil,
    });

    return { limited, retryAfterMs: limited ? args.windowMs : 0 };
  },
});

export const clear = mutation({
  args: {
    fingerprint: v.string(),
    now: v.number(),
  },
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query("adminLoginAttempts")
      .withIndex("by_fingerprint", (q) => q.eq("fingerprint", args.fingerprint))
      .unique();

    if (!row) {
      await ctx.db.insert("adminLoginAttempts", {
        fingerprint: args.fingerprint,
        attempts: 0,
        windowStart: args.now,
        lastAttempt: args.now,
      });
      return;
    }

    await ctx.db.patch(row._id, {
      attempts: 0,
      windowStart: args.now,
      lastAttempt: args.now,
      blockedUntil: undefined,
    });
  },
});
