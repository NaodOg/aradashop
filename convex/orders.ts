import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

function requireAdmin(adminKey?: string) {
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) throw new Error("Unauthorized");
}

export const create = mutation({
  args: {
    fullName: v.string(),
    phone: v.string(),
    address: v.string(),
    city: v.string(),
    items: v.array(
      v.object({
        productId: v.string(),
        size: v.optional(v.string()),
        quantity: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    if (!args.items.length) throw new Error("No items");
    const resolved = [];
    for (const item of args.items) {
      if (item.quantity < 1) throw new Error("Invalid quantity");
      let product = null;
      try { product = await ctx.db.get(item.productId); } catch { product = null; }
      if (!product) {
        const all = await ctx.db.query("products").collect();
        product = all.find((p) => String(p.legacyId) === String(item.productId) || String(p._id) === String(item.productId));
      }
      if (!product) throw new Error("Product not found");
      resolved.push({ product, size: item.size || null, quantity: item.quantity });
    }
    const orderId = await ctx.db.insert("orders", {
      fullName: args.fullName,
      phone: args.phone,
      address: args.address,
      city: args.city,
      status: "pending",
      createdAt: Date.now(),
    });
    for (const r of resolved) {
      await ctx.db.insert("orderItems", {
        orderId,
        productId: r.product._id,
        productName: r.product.name,
        size: r.size || undefined,
        quantity: r.quantity,
        unitPrice: r.product.price,
      });
    }
    return { id: orderId };
  },
});

export const listAll = query({
  args: { adminKey: v.string() },
  handler: async (ctx, args) => {
    requireAdmin(args.adminKey);
    const orders = await ctx.db.query("orders").withIndex("by_createdAt").order("desc").collect();
    return Promise.all(
      orders.map(async (o) => {
        const items = await ctx.db
          .query("orderItems")
          .withIndex("by_orderId", (q) => q.eq("orderId", o._id))
          .collect();
        return {
          id: o._id,
          full_name: o.fullName,
          phone: o.phone,
          address: o.address,
          city: o.city,
          status: o.status,
          created_at: new Date(o.createdAt).toISOString(),
          items: items.map((it) => ({
            id: it._id,
            product: it.productId,
            product_name: it.productName,
            size: it.size || null,
            quantity: it.quantity,
            unit_price: it.unitPrice,
          })),
        };
      })
    );
  },
});

export const createB2BRequest = mutation({
  args: {
    company: v.optional(v.string()),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    items: v.array(
      v.object({
        productId: v.string(),
        productName: v.string(),
        kind: v.string(),
        color: v.string(),
        sizeBreakdown: v.optional(v.array(v.object({ size: v.string(), quantity: v.number() }))),
        size: v.optional(v.string()),
        quantity: v.number(),
        unit: v.string(),
        notes: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    if (!args.items.length) throw new Error("No items");
    const id = await ctx.db.insert("b2bRequests", {
      company: args.company || undefined,
      name: args.name || undefined,
      phone: args.phone || undefined,
      status: "new",
      createdAt: Date.now(),
      items: args.items,
    });
    return { id };
  },
});

export const listB2BRequests = query({
  args: { adminKey: v.string() },
  handler: async (ctx, args) => {
    requireAdmin(args.adminKey);
    const reqs = await ctx.db.query("b2bRequests").withIndex("by_createdAt").order("desc").collect();
    return reqs.map((r) => ({
      id: r._id,
      company: r.company || "",
      name: r.name || "",
      phone: r.phone || "",
      status: r.status,
      created_at: new Date(r.createdAt).toISOString(),
      items: r.items,
    }));
  },
});
