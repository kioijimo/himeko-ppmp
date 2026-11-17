import {
  pgTable,
  foreignKey,
  bigint,
  timestamp,
  uuid,
  unique,
  text,
  numeric,
  smallint,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const fiscalYearStatus = pgEnum("fiscal_year_status", [
  "Ongoing",
  "Finished",
]);
export const inLieuStatus = pgEnum("in_lieu_status", [
  "Pending",
  "Approved",
  "Rejected",
]);
export const module = pgEnum("module", [
  "Authentication",
  "Account Management",
  "Content Management",
  "In Lieu Request",
  "Purchase Request",
  "PPMP List",
]);
export const purchaseRequestStatus = pgEnum("purchase_request_status", [
  "Pending",
  "Approved",
  "Received",
  "Rejected",
]);
export const userRole = pgEnum("user_role", ["User", "Admin"]);
export const userStatus = pgEnum("user_status", ["Active", "Inactive"]);

export const purchaseRequestItem = pgTable(
  "purchase_request_item",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    purchaseRequestId: bigint("purchase_request_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    quantity: bigint({ mode: "number" }),
    modifiedAt: timestamp("modified_at", {
      withTimezone: true,
      mode: "string",
    }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    id: uuid().defaultRandom().primaryKey().notNull(),
    inventoryItemId: uuid("inventory_item_id"),
  },
  (table) => [
    foreignKey({
      columns: [table.inventoryItemId],
      foreignColumns: [inventoryItem.id],
      name: "purchase_request_item_inventory_item_id_fkey",
    })
      .onUpdate("restrict")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.purchaseRequestId],
      foreignColumns: [purchaseRequest.id],
      name: "purchase_request_item_purchase_request_id_fkey",
    })
      .onUpdate("restrict")
      .onDelete("restrict"),
  ],
);

export const purchaseRequest = pgTable(
  "purchase_request",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
      name: "purchase_request_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      cache: 1,
    }),
    userId: uuid("user_id").default(sql`auth.uid()`),
    modifiedAt: timestamp("modified_at", {
      withTimezone: true,
      mode: "string",
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    approvedBy: uuid("approved_by"),
    status: purchaseRequestStatus().default("Pending"),
  },
  (table) => [
    foreignKey({
      columns: [table.approvedBy],
      foreignColumns: [user.id],
      name: "purchase_request_approved_by_fkey",
    })
      .onUpdate("restrict")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "purchase_request_user_id_fkey",
    })
      .onUpdate("restrict")
      .onDelete("restrict"),
  ],
);

export const user = pgTable(
  "user",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    email: text(),
    contactNumber: text("contact_number"),
    firstName: text("first_name"),
    lastName: text("last_name"),
    modifiedAt: timestamp("modified_at", {
      withTimezone: true,
      mode: "string",
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    role: userRole().default("User"),
    status: userStatus().default("Active"),
  },
  (table) => [
    unique("user_email_key").on(table.email),
    unique("user_contact_number_key").on(table.contactNumber),
  ],
);

export const fiscalYear = pgTable("fiscal_year", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
    name: "fiscal_year_id_seq",
    startWith: 1,
    increment: 1,
    minValue: 1,
    cache: 1,
  }),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  year: bigint({ mode: "number" }),
  budget: numeric(),
  modifiedAt: timestamp("modified_at", { withTimezone: true, mode: "string" }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  status: fiscalYearStatus().default("Ongoing"),
});

export const category = pgTable("category", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
    name: "category_id_seq",
    startWith: 1,
    increment: 1,
    minValue: 1,
    cache: 1,
  }),
  name: text(),
  modifiedAt: timestamp("modified_at", { withTimezone: true, mode: "string" }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const signatory = pgTable("signatory", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
    name: "signatory_id_seq",
    startWith: 1,
    increment: 1,
    minValue: 1,
    cache: 1,
  }),
  document: smallint(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  position: text(),
  modifiedAt: timestamp("modified_at", { withTimezone: true, mode: "string" }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const backupItem = pgTable(
  "backup_item",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    fiscalYearId: bigint("fiscal_year_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    categoryId: bigint("category_id", { mode: "number" }),
    name: text(),
    tag: text(),
    unit: text(),
    price: numeric(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    quantity: bigint({ mode: "number" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.categoryId],
      foreignColumns: [category.id],
      name: "original_ppmp_item_category_id_fkey",
    })
      .onUpdate("restrict")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.fiscalYearId],
      foreignColumns: [fiscalYear.id],
      name: "original_ppmp_item_fiscal_year_id_fkey",
    })
      .onUpdate("restrict")
      .onDelete("restrict"),
  ],
);

export const auditLog = pgTable(
  "audit_log",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
      name: "audit_log_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      cache: 1,
    }),
    userId: uuid("user_id").default(sql`auth.uid()`),
    action: text(),
    description: text(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    module: module(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "audit_log_user_id_fkey",
    })
      .onUpdate("restrict")
      .onDelete("restrict"),
  ],
);

export const item = pgTable(
  "item",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    fiscalYearId: bigint("fiscal_year_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    categoryId: bigint("category_id", { mode: "number" }),
    name: text(),
    tag: text(),
    unit: text(),
    price: numeric(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    quantity: bigint({ mode: "number" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    inLieuRequestId: bigint("in_lieu_request_id", { mode: "number" }),
  },
  (table) => [
    foreignKey({
      columns: [table.categoryId],
      foreignColumns: [category.id],
      name: "mutable_item_duplicate_category_id_fkey",
    })
      .onUpdate("restrict")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.fiscalYearId],
      foreignColumns: [fiscalYear.id],
      name: "mutable_item_duplicate_fiscal_year_id_fkey",
    })
      .onUpdate("restrict")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.inLieuRequestId],
      foreignColumns: [inLieuRequest.id],
      name: "mutable_item_in_lieu_request_id_fkey",
    })
      .onUpdate("restrict")
      .onDelete("restrict"),
  ],
);

export const inventoryItem = pgTable(
  "inventory_item",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    itemId: uuid("item_id"),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    quantityAvailable: bigint("quantity_available", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    quantityPending: bigint("quantity_pending", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    quantityReceived: bigint("quantity_received", { mode: "number" }),
    modifiedAt: timestamp("modified_at", {
      withTimezone: true,
      mode: "string",
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.itemId],
      foreignColumns: [item.id],
      name: "inventory_item_item_id_fkey",
    })
      .onUpdate("restrict")
      .onDelete("restrict"),
    unique("inventory_item_mutable_item_id_key").on(table.itemId),
  ],
);

export const inLieuItem = pgTable(
  "in_lieu_item",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    itemId: uuid("item_id"),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    inLieuRequestId: bigint("in_lieu_request_id", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    quantityIncrement: bigint("quantity_increment", { mode: "number" }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    quantityDecrement: bigint("quantity_decrement", { mode: "number" }),
  },
  (table) => [
    foreignKey({
      columns: [table.inLieuRequestId],
      foreignColumns: [inLieuRequest.id],
      name: "in_lieu_item_in_lieu_request_id_fkey",
    })
      .onUpdate("restrict")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.itemId],
      foreignColumns: [item.id],
      name: "in_lieu_item_item_id_fkey",
    })
      .onUpdate("restrict")
      .onDelete("restrict"),
  ],
);

export const inLieuRequest = pgTable(
  "in_lieu_request",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
      name: "in_lieu_request_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      cache: 1,
    }),
    userId: uuid("user_id").default(sql`auth.uid()`),
    modifiedAt: timestamp("modified_at", {
      withTimezone: true,
      mode: "string",
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    approvedBy: uuid("approved_by"),
    status: inLieuStatus().default("Pending"),
  },
  (table) => [
    foreignKey({
      columns: [table.approvedBy],
      foreignColumns: [user.id],
      name: "in_lieu_request_approved_by_fkey",
    })
      .onUpdate("restrict")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "in_lieu_request_user_id_fkey",
    })
      .onUpdate("restrict")
      .onDelete("restrict"),
  ],
);
