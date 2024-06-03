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
  name: text("name").notNull(),
  type: movementDirectionTypeEnum("movement_direction_type"),
  isDriverRequired: boolean("is_driver_required").notNull(),
  doCreateClientDebt: boolean("do_create_client_debt").notNull(),
  isClientRequired: boolean("is_client_required").notNull(),
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
  customerDebtId: integer("customer_debt_id").references(
    () => clientDebtSchema.id,
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
  clientDebt: one(clientDebtSchema, {
    references: [clientDebtSchema.id],
    fields: [movementSchema.customerDebtId],
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

export const driverMovementPaymentSchema = pgTable("driver_movement_payment", {
  id: serial("id").primaryKey().notNull(),
  driverId: integer("driver_id")
    .references(() => driverSchema.id)
    .notNull(),
  movementTypeId: integer("movement_type_id")
    .references(() => movementTypeSchema.id)
    .notNull(),
  amount: numeric("amount", { scale: 2 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const clientSchema = pgTable("client", {
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const clientSchemaRelations = relations(clientSchema, ({ many }) => ({
  debts: many(clientDebtSchema),
}));

export const clientDebtSchema = pgTable("client_debt", {
  id: serial("id").primaryKey().notNull(),
  clientId: integer("client_id")
    .references(() => clientSchema.id)
    .notNull(),
  amount: numeric("amount", { scale: 2 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const clientDebtSchemaRelations = relations(
  clientDebtSchema,
  ({ one }) => ({
    client: one(clientSchema, {
      references: [clientSchema.id],
      fields: [clientDebtSchema.clientId],
    }),
    movement: one(movementSchema, {
      references: [movementSchema.customerDebtId],
      fields: [clientDebtSchema.id],
    }),
  }),
);
