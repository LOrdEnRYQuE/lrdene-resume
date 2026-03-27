import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// 09:30 GMT daily (inside the requested 09:00-11:00 GMT publishing window).
crons.cron("daily-auto-blog-post", "30 9 * * *", internal.autoPosts.publishFromCron, {});

export default crons;
