// lib/types/index.ts
import { z } from "zod";
import { categoriesTable, offersTable, productsTable } from "./schema";

export type Category = typeof categoriesTable.$inferSelect;
export type Offer = typeof offersTable.$inferSelect;
export type Product = typeof productsTable.$inferSelect;

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional().or(z.literal("")),
  image: z.any(),
  price: z.coerce.number().min(0.01, "Price is required"),
  categoryId: z.string().min(1, "Category is required"),
  discountType: z.enum(["percent", "amount"]).optional(),
  discountValue: z.coerce.number().min(0).optional(),
  isActive: z.string().optional(),
});

export type ProductSchemaType = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional().or(z.literal("")),
  image: z.any(),
  isActive: z.string().optional(),
});

export type CategorySchemaType = z.infer<typeof categorySchema>;

export const offerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional().or(z.literal("")),
  image: z.any(),
  discount: z.number().min(1, "Minimum 1%").max(100, "Maximum 100%"),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  createdAt: z.string().optional().or(z.literal("")),
  updatedAt: z.string().optional().or(z.literal("")),
});
export type OfferSchemaType = z.infer<typeof offerSchema>;

// lib/types.ts
export type FieldType =
  | "text"
  | "email"
  | "number"
  | "textarea"
  | "select"
  | "file"
  | "date";

export interface ModalField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  accept?: string;
  min?: number;
  max?: number;
  colSpan?: 1 | 2;
}
