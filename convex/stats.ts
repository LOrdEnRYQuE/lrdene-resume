import { query } from "./_generated/server";
import { ADMIN_TOKEN, requireAdminToken } from "./adminAuth";

const COUNT_CAP = 5000;

export const getSystemStats = query({
  args: { adminToken: ADMIN_TOKEN },
  handler: async (ctx, args) => {
    await requireAdminToken(args.adminToken);
    const leads = await ctx.db.query("leads").order("desc").take(COUNT_CAP + 1);
    const projects = await ctx.db.query("projects").order("desc").take(COUNT_CAP + 1);
    const services = await ctx.db.query("services").order("desc").take(COUNT_CAP + 1);
    const demos = await ctx.db.query("demos").order("desc").take(COUNT_CAP + 1);
    const posts = await ctx.db.query("posts").order("desc").take(COUNT_CAP + 1);

    return {
      leads: Math.min(leads.length, COUNT_CAP),
      projects: Math.min(projects.length, COUNT_CAP),
      services: Math.min(services.length, COUNT_CAP),
      demos: Math.min(demos.length, COUNT_CAP),
      posts: Math.min(posts.length, COUNT_CAP),
      lastLead: leads[0]?._creationTime || 0,
      dbStatus: "Connected",
      environment: process.env.NODE_ENV || "production",
      runtime: "Edge Runtime (Vercel)",
      sampled: [leads, projects, services, demos, posts].some((rows) => rows.length > COUNT_CAP),
    };
  },
});
