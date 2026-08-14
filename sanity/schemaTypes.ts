import { defineField, defineType } from "sanity";
const product = defineType({
  name: "product",
  title: "Products",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      type: "string",
      options: {
        list: [
          "Laser",
          "Skin",
          "Facial",
          "Body",
          "Hair Removal",
          "Multi-Functional Systems",
        ],
      },
    }),
    defineField({ name: "price", type: "number" }),
    defineField({ name: "summary", type: "text" }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "applications",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "features", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "included", type: "array", of: [{ type: "string" }] }),
    defineField({
      name: "specifications",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string" },
            { name: "value", type: "string" },
          ],
        },
      ],
    }),
    defineField({ name: "featured", type: "boolean" }),
    defineField({ name: "order", type: "number" }),
  ],
});
const order = defineType({
  name: "order",
  title: "Orders",
  type: "document",
  fields: [
    { name: "orderNumber", type: "string" },
    {
      name: "status",
      type: "string",
      options: {
        list: ["new", "contacted", "confirmed", "fulfilled", "cancelled"],
      },
    },
    { name: "createdAt", type: "datetime" },
    {
      name: "customer",
      type: "object",
      fields: [
        { name: "firstName", type: "string" },
        { name: "lastName", type: "string" },
        { name: "email", type: "string" },
        { name: "phone", type: "string" },
        { name: "business", type: "string" },
        { name: "address", type: "string" },
        { name: "city", type: "string" },
        { name: "postcode", type: "string" },
        { name: "notes", type: "text" },
      ],
    },
    {
      name: "items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "productId", type: "string" },
            { name: "name", type: "string" },
            { name: "price", type: "number" },
            { name: "quantity", type: "number" },
          ],
        },
      ],
    },
    { name: "subtotal", type: "number" },
    { name: "vat", type: "number" },
    { name: "total", type: "number" },
  ],
  preview: { select: { title: "orderNumber", subtitle: "customer.email" } },
});
const site = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    { name: "heroEyebrow", type: "string" },
    { name: "heroTitle", type: "string" },
    { name: "heroText", type: "text" },
    { name: "heroImage", type: "image" },
    { name: "contactEmail", type: "string" },
    { name: "phone", type: "string" },
  ],
});
export const schemaTypes = [product, order, site];
