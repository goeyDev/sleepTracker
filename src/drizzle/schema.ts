import { relations } from "drizzle-orm";
import {
  inet,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoles = ["admin", "user"] as const;
export type UserRole = (typeof userRoles)[number];
export const userRoleEnum = pgEnum("user_roles", userRoles);

const createdAt = timestamp("created_at", { withTimezone: true })
  .notNull()
  .defaultNow();
const updatedAt = timestamp("updated_at", { withTimezone: true })
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());

export const userTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull().unique(),
  imageUrl: varchar("imageUrl"),
  password: text(),
  salt: text(),
  role: userRoleEnum().notNull().default("user"),
  lastLogoutAt: timestamp("last_logout_at", { withTimezone: true }),
  createdAt,
  updatedAt,
});

export const sessionTable = pgTable("session", {
  session_id: text("session_id").primaryKey(),
  user_id: uuid("user_id").references(() => userTable.id), // Match userTable.id type
  user_role: text("user_role"),
  expire_at: timestamp("expire_at", { withTimezone: true }).notNull(),
});

export const oAuthProviders = ["discord", "github", "google"] as const;
export type OAuthProvider = (typeof oAuthProviders)[number];
export const oAuthProviderEnum = pgEnum("oauth_provides", oAuthProviders);

export const userOAuthAccountTable = pgTable(
  "user_oauth_accounts",
  {
    userId: uuid()
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    provider: oAuthProviderEnum().notNull(),
    providerAccountId: text().notNull().unique(),
    createdAt,
    updatedAt,
  },
  (t) => [primaryKey({ columns: [t.providerAccountId, t.provider] })]
);

export const userOauthAccountRelationships = relations(
  userOAuthAccountTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [userOAuthAccountTable.userId],
      references: [userTable.id],
    }),
  })
);

export const recordsTable = pgTable("records", {
  id: uuid("id").primaryKey().defaultRandom(),
  text: varchar("text", { length: 255 }).notNull(),
  amount: real("amount").notNull(),
  date: timestamp("date", { mode: "date" }).notNull().defaultNow(),
  userId: uuid("userId")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

export type recordsTableInferSelect = typeof recordsTable.$inferSelect
export type recordsTableInferInsert = typeof recordsTable.$inferInsert

export const auditLogTable = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => userTable.id, {
    onDelete: "set null", // Keep logs even if user is deleted
  }),
  action: text("action").notNull(), // e.g., 'login', 'logout', 'password_change'
  ipAddress: inet("ip_address"), // PostgreSQL inet type for IP storage
  userAgent: text("user_agent"),
  metadata: jsonb("metadata"), // Optional: store additional context
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userRelations = relations(userTable, ({ many }) => ({
  oAuthAccounts: many(userOAuthAccountTable),
  records: many(recordsTable),  // This will use the relation defined above
  sessions: many(sessionTable), // Moved here to consolidate user relations
}));

export const sessionsRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.user_id], // Field in THIS table
    references: [userTable.id], // Field in TARGET table
  }),
}));

export const recordsRelations = relations(recordsTable, ({ one }) => ({
  user: one(userTable, {
    fields: [recordsTable.userId],  // The foreign key in recordsTable
    references: [userTable.id],     // The primary key in userTable
  }),
}));
