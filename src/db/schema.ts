import { int, numeric, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  age: int().notNull(),
  email: text().notNull().unique(),
  gender: text(),
});

export const designations = sqliteTable("designations", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
});

export const employees = sqliteTable("employees", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  designationId: int("designation_id")
    .notNull()
    .references(() => designations.id),
  email: text().notNull().unique(),
  phone: numeric().notNull().unique(),
});

export const categories = sqliteTable("categories", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

export const products = sqliteTable("products", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  price: int().notNull(),
  categoryId: int("category_id")
    .notNull()
    .references(() => categories.id),
  userId: int("user_id")
    .notNull()
    .references(() => users.id),
});


