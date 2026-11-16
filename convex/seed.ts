import { mutation } from "./_generated/server";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").collect();
    if (existing.length > 0) return { ok: true, message: "Already seeded" };

    await ctx.db.insert("products", {
      legacyId: 2,
      name: "GIGI",
      slug: "gigi",
      category: "tshirt",
      price: 900,
      imageUrl: "/products/gigi.jpg",
      isAvailable: true,
      createdAt: Date.now(),
    });

    return { ok: true, message: "Seeded product" };
  },
});
