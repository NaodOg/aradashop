import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    legacyId: v.optional(v.number()),
    name: v.string(),
    slug: v.string(),
    category: v.union(
      v.literal("tshirt"),
      v.literal("sweater"),
      v.literal("hoodie"),
      v.literal("mug"),
      v.literal("totebag"),
    ),
    price: v.number(),
    imageStorageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    isAvailable: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_createdAt", ["createdAt"])
    .index("by_legacyId", ["legacyId"]),

  orders: defineTable({
    fullName: v.string(),
    phone: v.string(),
    address: v.string(),
    city: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled"),
    ),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),

  orderItems: defineTable({
    orderId: v.id("orders"),
    productId: v.id("products"),
    productName: v.string(),
    size: v.optional(v.string()),
    quantity: v.number(),
    unitPrice: v.number(),
  }).index("by_orderId", ["orderId"]),

  b2bRequests: defineTable({
    company: v.optional(v.string()),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    status: v.string(),
    createdAt: v.number(),
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
  }).index("by_createdAt", ["createdAt"]),
});
