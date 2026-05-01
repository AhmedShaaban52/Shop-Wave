import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  numeric,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  username: varchar("username", { length: 255 }),
  avatar_url: text("avatar_url"),
  phone: varchar("phone", { length: 20 }),
  role: varchar("role", { length: 20 }).default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categoriesTable = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description", { length: 500 }),
  image: text("image").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const productsTable = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  categoryId: uuid("category_id")
    .references(() => categoriesTable.id)
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description", { length: 500 }),
  image: text("image").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  discountType: varchar("discount_type", { length: 20 }).$type<
    "percent" | "amount"
  >(),
  discountValue: numeric("discount_value", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const offersTable = pgTable("offers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image").notNull(),
  discount: integer("discount").notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
  products: many(productsTable),
}));

export const productsRelations = relations(productsTable, ({ one }) => ({
  category: one(categoriesTable, {
    fields: [productsTable.categoryId],
    references: [categoriesTable.id],
  }),
}));
