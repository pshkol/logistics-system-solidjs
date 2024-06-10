import { relations, sql } from "drizzle-orm";
import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";

export const MovementDirectionTypeEnum = ["IN", "OUT"] as const;

export const movementTypeSchema = sqliteTable("movement_type", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  name: text("name").notNull(),
  type: text("type", { enum: MovementDirectionTypeEnum }).notNull(),
  isDriverRequired: integer("is_driver_required", {
    mode: "boolean",
  }).notNull(),
  doCreateClientDebt: integer("do_create_client_debt", {
    mode: "boolean",
  }).notNull(),
  isClientRequired: integer("is_client_required", {
    mode: "boolean",
  }).notNull(),
  createdAt: integer("created_at")
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at")
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const movementTypeSchemaRelations = relations(
  movementTypeSchema,
  ({ many }) => ({
    movements: many(movementSchema),
    driverMovementPayments: many(driverMovementPaymentSchema),
  }),
);

export const movementSchema = sqliteTable("movement", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  amount: real("amount").notNull(),
  description: text("description"),
  movementTypeId: integer("movement_type_id").references(
    () => movementTypeSchema.id,
  ),
  clientId: integer("client_id").references(() => clientSchema.id),
  driverId: integer("driver_id").references(() => driverSchema.id),
  createdAt: integer("created_at")
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at")
    .default(sql`(unixepoch())`)
    .notNull(),
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

export const driverSchema = sqliteTable("driver", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  name: text("name").notNull(),
  lastName: text("last_name").notNull(),
  createdAt: integer("created_at")
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at")
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const driverSchemaRelations = relations(driverSchema, ({ many }) => ({
  movements: many(movementSchema),
  movementPayments: many(driverMovementPaymentSchema),
  debtsToDriver: many(debtToDriverSchema),
  paymentsToDriver: many(paymentToDriverSchema),
}));

export const driverMovementPaymentSchema = sqliteTable(
  "driver_movement_payment",
  {
    id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
    driverId: integer("driver_id")
      .references(() => driverSchema.id)
      .notNull(),
    movementTypeId: integer("movement_type_id")
      .references(() => movementTypeSchema.id)
      .notNull(),
    amount: real("amount").notNull(),
    createdAt: integer("created_at")
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: integer("updated_at")
      .default(sql`(unixepoch())`)
      .notNull(),
  },
);

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

export const clientSchema = sqliteTable("client", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  name: text("name").notNull(),
  createdAt: integer("created_at")
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at")
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const clientSchemaRelations = relations(clientSchema, ({ many }) => ({
  debts: many(clientDebtSchema),
}));

export const clientDebtSchema = sqliteTable("client_debt", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  clientId: integer("client_id")
    .references(() => clientSchema.id)
    .notNull(),
  movementId: integer("movement_id").references(() => movementSchema.id),
  amount: real("amount").notNull(),
  createdAt: integer("created_at")
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at")
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const clientDebtSchemaRelations = relations(
  clientDebtSchema,
  ({ one, many }) => ({
    client: one(clientSchema, {
      references: [clientSchema.id],
      fields: [clientDebtSchema.clientId],
    }),
    movement: one(movementSchema, {
      references: [movementSchema.id],
      fields: [clientDebtSchema.movementId],
    }),
    payments: many(clientPaymentSchema),
  }),
);

export const clientPaymentSchema = sqliteTable("client_payment", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  clientId: integer("client_id")
    .references(() => clientSchema.id)
    .notNull(),
  amount: real("amount").notNull(),
  clientDebtId: integer("client_debt_id").references(() => clientDebtSchema.id),
  paymentDate: integer("payment_date", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at")
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at")
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const clientPaymentSchemaRelations = relations(
  clientPaymentSchema,
  ({ one }) => ({
    client: one(clientSchema, {
      references: [clientSchema.id],
      fields: [clientPaymentSchema.clientId],
    }),
    clientDebt: one(clientDebtSchema, {
      references: [clientDebtSchema.id],
      fields: [clientPaymentSchema.clientDebtId],
    }),
  }),
);

export const debtToDriverSchema = sqliteTable("debt_to_driver", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  driverId: integer("driver_id")
    .references(() => driverSchema.id)
    .notNull(),
  amount: real("amount").notNull(),
  driverMovementPaymentId: integer("driver_movement_payment_id").references(
    () => driverMovementPaymentSchema.id,
  ),
  movementId: integer("movement_id")
    .references(() => movementSchema.id)
    .notNull(),
  createdAt: integer("created_at")
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at")
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const debtToDriverSchemaRelations = relations(
  debtToDriverSchema,
  ({ one, many }) => ({
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
    paymentsToDriver: many(paymentToDriverSchema),
  }),
);

export const paymentToDriverSchema = sqliteTable("payment_to_driver", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  driverId: integer("driver_id")
    .references(() => driverSchema.id)
    .notNull(),
  amount: real("amount").notNull(),
  debtToDriverId: integer("debt_to_driver_id").references(
    () => debtToDriverSchema.id,
  ),
  paymentDate: integer("payment_date", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at")
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at")
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const paymentToDriverSchemaRelations = relations(
  paymentToDriverSchema,
  ({ one }) => ({
    driver: one(driverSchema, {
      references: [driverSchema.id],
      fields: [paymentToDriverSchema.driverId],
    }),
    debtToDriver: one(debtToDriverSchema, {
      references: [debtToDriverSchema.id],
      fields: [paymentToDriverSchema.debtToDriverId],
    }),
  }),
);
