import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return [
      { id: "1", text: "Learn Convex", isCompleted: true },
      { id: "2", text: "Integrate with Next.js", isCompleted: false },
    ];
  },
});
