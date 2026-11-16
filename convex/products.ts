import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

function requireAdmin(adminKey?: string) {
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) throw new Error("Unauthorized");
}

const category = v.union(
  v.literal("tshirt"),
  v.literal("sweater"),
  v.literal("hoodie"),
  v.literal("mug"),
  v.literal("totebag"),
);

export const list = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let products;
    if (args.category && args.category !== "all") {
      products = await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("category", args.category))
        .collect();
    } else {
      products = await ctx.db.query("products").withIndex("by_createdAt").order("desc").collect();
    }
    const sorted = [...products].sort((a, b) => b.createdAt - a.createdAt);
    return Promise.all(
      sorted.map(async (p) => ({
        _id: p._id,
        id: p.legacyId ?? p._id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        price: p.price,
        image: p.imageStorageId ? await ctx.storage.getUrl(p.imageStorageId) : p.imageUrl || null,
        imageStorageId: p.imageStorageId || null,
        is_available: p.isAvailable,
        variants: [],
      }))
    );
  },
});

export const get = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    let product = null;
    try {
      product = await ctx.db.get(args.id);
    } catch {
      product = null;
    }
    if (!product) {
      const all = await ctx.db.query("products").collect();
      product = all.find((p) => String(p.legacyId) === String(args.id)) || null;
    }
    if (!product) return null;
    return {
      _id: product._id,
      id: product.legacyId ?? product._id,
      name: product.name,
      slug: product.slug,
      category: product.category,
      price: product.price,
      image: product.imageStorageId ? await ctx.storage.getUrl(product.imageStorageId) : product.imageUrl || null,
      imageStorageId: product.imageStorageId || null,
      is_available: product.isAvailable,
      variants: [],
    };
  },
});

export const generateUploadUrl = mutation({
  args: { adminKey: v.string() },
  handler: async (ctx, args) => {
    requireAdmin(args.adminKey);
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
    adminKey: v.string(),
    name: v.string(),
    slug: v.string(),
    category,
    price: v.number(),
    isAvailable: v.boolean(),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminKey);
    const { adminKey, ...data } = args;
    return await ctx.db.insert("products", { ...data, createdAt: Date.now() });
  },
});

export const update = mutation({
  args: {
    adminKey: v.string(),
    id: v.id("products"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    category: v.optional(category),
    price: v.optional(v.number()),
    isAvailable: v.optional(v.boolean()),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    requireAdmin(args.adminKey);
    const { adminKey, id, ...patch } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Product not found");
    const clean = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined));
    await ctx.db.patch(id, clean);
    return { ok: true };
  },
});

export const remove = mutation({
  args: { adminKey: v.string(), id: v.id("products") },
  handler: async (ctx, args) => {
    requireAdmin(args.adminKey);
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Product not found");
    await ctx.db.delete(args.id);
    return { ok: true };
  },
});
