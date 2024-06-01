import {
  pgTable,
  text,
  serial,
  timestamp,
  pgEnum,
  integer,
  numeric,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const movementDirectionTypeEnum = pgEnum("movement_direction_type", [
  "IN",
  "OUT",
]);

export const movementTypeSchema = pgTable("movement_type", {
  id: serial("id").primaryKey().notNull(),
  name: text("first_name").notNull(),
  type: movementDirectionTypeEnum("movement_direction_type"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const movementTypeSchemaRelations = relations(
  movementTypeSchema,
  ({ many, one }) => ({
    movements: many(movementSchema),
  }),
);

export const movementSchema = pgTable("movement", {
  id: serial("id").primaryKey().notNull(),
  amount: numeric("amount", { scale: 2 }).notNull(),
  description: text("description"),
  movementTypeId: integer("movement_type_id").references(
    () => movementTypeSchema.id,
  ),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const movementSchemaRelations = relations(
  movementSchema,
  ({ many, one }) => ({
    movementType: one(movementTypeSchema, {
      references: [movementTypeSchema.id],
      fields: [movementSchema.movementTypeId],
    }),
  }),
);
