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
    driverMovementPayments: many(driverMovementPaymentSchema),
  }),
);

export const movementSchema = pgTable("movement", {
  id: serial("id").primaryKey().notNull(),
  amount: numeric("amount", { scale: 2 }).notNull(),
  description: text("description"),
  movementTypeId: integer("movement_type_id").references(
    () => movementTypeSchema.id,
  ),
  clientId: integer("client_id").references(() => clientSchema.id),
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
    references: [clientDebtSchema.movementId],
    fields: [movementSchema.id],
  }),
  debtsToDriver: one(debtToDriverSchema, {
    references: [debtToDriverSchema.movementId],
    fields: [movementSchema.id],
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
  movementPayments: many(driverMovementPaymentSchema),
  debtsToDriver: many(debtToDriverSchema),
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

export const driverMovementPaymentSchemaRelations = relations(
  driverMovementPaymentSchema,
  ({ one, many }) => ({
    driver: one(driverSchema, {
      references: [driverSchema.id],
      fields: [driverMovementPaymentSchema.driverId],
    }),
    movementType: one(movementTypeSchema, {
      references: [movementTypeSchema.id],
      fields: [driverMovementPaymentSchema.movementTypeId],
    }),
    debtsToDriver: many(debtToDriverSchema),
  }),
);

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
  movementId: integer("movement_id").references(() => movementSchema.id),
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
      references: [movementSchema.id],
      fields: [clientDebtSchema.movementId],
    }),
  }),
);

export const debtToDriverSchema = pgTable("debt_to_driver", {
  id: serial("id").primaryKey().notNull(),
  driverId: integer("driver_id")
    .references(() => driverSchema.id)
    .notNull(),
  amount: numeric("amount", { scale: 2 }).notNull(),
  driverMovementPaymentId: integer("driver_movement_payment_id").references(
    () => driverMovementPaymentSchema.id,
  ),
  movementId: integer("movement_id")
    .references(() => movementSchema.id)
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const debtToDriverSchemaRelations = relations(
  debtToDriverSchema,
  ({ one }) => ({
    driver: one(driverSchema, {
      references: [driverSchema.id],
      fields: [debtToDriverSchema.driverId],
    }),
    driverMovementPayment: one(driverMovementPaymentSchema, {
      references: [driverMovementPaymentSchema.id],
      fields: [debtToDriverSchema.driverMovementPaymentId],
    }),
    movement: one(movementSchema, {
      references: [movementSchema.id],
      fields: [debtToDriverSchema.movementId],
    }),
  }),
);
