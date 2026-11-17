import { relations } from "drizzle-orm/relations";
import {
  inventoryItem,
  purchaseRequestItem,
  purchaseRequest,
  user,
  category,
  backupItem,
  fiscalYear,
  auditLog,
  item,
  inLieuRequest,
  inLieuItem,
} from "./schema";

export const purchaseRequestItemRelations = relations(
  purchaseRequestItem,
  ({ one }) => ({
    inventoryItem: one(inventoryItem, {
      fields: [purchaseRequestItem.inventoryItemId],
      references: [inventoryItem.id],
    }),
    purchaseRequest: one(purchaseRequest, {
      fields: [purchaseRequestItem.purchaseRequestId],
      references: [purchaseRequest.id],
    }),
  }),
);

export const inventoryItemRelations = relations(
  inventoryItem,
  ({ one, many }) => ({
    purchaseRequestItems: many(purchaseRequestItem),
    item: one(item, {
      fields: [inventoryItem.itemId],
      references: [item.id],
    }),
  }),
);

export const purchaseRequestRelations = relations(
  purchaseRequest,
  ({ one, many }) => ({
    purchaseRequestItems: many(purchaseRequestItem),
    user_approvedBy: one(user, {
      fields: [purchaseRequest.approvedBy],
      references: [user.id],
      relationName: "purchaseRequest_approvedBy_user_id",
    }),
    user_userId: one(user, {
      fields: [purchaseRequest.userId],
      references: [user.id],
      relationName: "purchaseRequest_userId_user_id",
    }),
  }),
);

export const userRelations = relations(user, ({ many }) => ({
  purchaseRequests_approvedBy: many(purchaseRequest, {
    relationName: "purchaseRequest_approvedBy_user_id",
  }),
  purchaseRequests_userId: many(purchaseRequest, {
    relationName: "purchaseRequest_userId_user_id",
  }),
  auditLogs: many(auditLog),
  inLieuRequests_approvedBy: many(inLieuRequest, {
    relationName: "inLieuRequest_approvedBy_user_id",
  }),
  inLieuRequests_userId: many(inLieuRequest, {
    relationName: "inLieuRequest_userId_user_id",
  }),
}));

export const backupItemRelations = relations(backupItem, ({ one }) => ({
  category: one(category, {
    fields: [backupItem.categoryId],
    references: [category.id],
  }),
  fiscalYear: one(fiscalYear, {
    fields: [backupItem.fiscalYearId],
    references: [fiscalYear.id],
  }),
}));

export const categoryRelations = relations(category, ({ many }) => ({
  backupItems: many(backupItem),
  items: many(item),
}));

export const fiscalYearRelations = relations(fiscalYear, ({ many }) => ({
  backupItems: many(backupItem),
  items: many(item),
}));

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  user: one(user, {
    fields: [auditLog.userId],
    references: [user.id],
  }),
}));

export const itemRelations = relations(item, ({ one, many }) => ({
  category: one(category, {
    fields: [item.categoryId],
    references: [category.id],
  }),
  fiscalYear: one(fiscalYear, {
    fields: [item.fiscalYearId],
    references: [fiscalYear.id],
  }),
  inLieuRequest: one(inLieuRequest, {
    fields: [item.inLieuRequestId],
    references: [inLieuRequest.id],
  }),
  inventoryItems: many(inventoryItem),
  inLieuItems: many(inLieuItem),
}));

export const inLieuRequestRelations = relations(
  inLieuRequest,
  ({ one, many }) => ({
    items: many(item),
    inLieuItems: many(inLieuItem),
    user_approvedBy: one(user, {
      fields: [inLieuRequest.approvedBy],
      references: [user.id],
      relationName: "inLieuRequest_approvedBy_user_id",
    }),
    user_userId: one(user, {
      fields: [inLieuRequest.userId],
      references: [user.id],
      relationName: "inLieuRequest_userId_user_id",
    }),
  }),
);

export const inLieuItemRelations = relations(inLieuItem, ({ one }) => ({
  inLieuRequest: one(inLieuRequest, {
    fields: [inLieuItem.inLieuRequestId],
    references: [inLieuRequest.id],
  }),
  item: one(item, {
    fields: [inLieuItem.itemId],
    references: [item.id],
  }),
}));
