import {
  pgTable,
  text,
  serial,
  timestamp,
  pgEnum,
  integer,
  numeric,
  boolean,
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
  isDriverRequired: boolean("is_driver_required").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const movementTypeSchemaRelations = relations(
  movementTypeSchema,
  ({ many }) => ({
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
  driverId: integer("driver_id").references(() => driverSchema.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const movementSchemaRelations = relations(movementSchema, ({ one }) => ({
  movementType: one(movementTypeSchema, {
    references: [movementTypeSchema.id],
    fields: [movementSchema.movementTypeId],
  }),
  driver: one(driverSchema, {
    references: [driverSchema.id],
    fields: [movementSchema.driverId],
  }),
}));

export const driverSchema = pgTable("driver", {
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull(),
  lastName: text("last_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const driverSchemaRelations = relations(driverSchema, ({ many }) => ({
  movements: many(movementSchema),
}));

export const clientSchema = pgTable("client", {
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
