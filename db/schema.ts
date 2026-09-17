import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const professionals = sqliteTable("professionals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  passwordHash: text("password_hash").notNull(),
  passwordSalt: text("password_salt").notNull(),
  mustChangePassword: integer("must_change_password").notNull().default(1),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const clients = sqliteTable("clients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  notes: text("notes"),
  status: text("status").notNull().default("active"),
  passwordHash: text("password_hash").notNull(),
  passwordSalt: text("password_salt").notNull(),
  mustChangePassword: integer("must_change_password").notNull().default(1),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
}, (table) => [index("idx_clients_name").on(table.lastName, table.firstName)]);

export const bonuses = sqliteTable("bonuses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  clientId: integer("client_id").notNull().references(() => clients.id),
  name: text("name").notNull(),
  initialSessions: integer("initial_sessions").notNull(),
  expiresAt: integer("expires_at"),
  status: text("status").notNull().default("active"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
}, (table) => [index("idx_bonuses_client_id").on(table.clientId)]);

export const bonusMovements = sqliteTable("bonus_movements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bonusId: integer("bonus_id").notNull().references(() => bonuses.id),
  delta: integer("delta").notNull(),
  reason: text("reason").notNull(),
  appointmentId: integer("appointment_id").unique(),
  createdBy: integer("created_by").notNull(),
  createdAt: integer("created_at").notNull(),
}, (table) => [index("idx_bonus_movements_bonus_id").on(table.bonusId)]);

export const appointments = sqliteTable("appointments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  clientId: integer("client_id").notNull().references(() => clients.id),
  bonusId: integer("bonus_id").notNull().references(() => bonuses.id),
  startsAt: integer("starts_at").notNull(),
  endsAt: integer("ends_at").notNull(),
  status: text("status").notNull().default("scheduled"),
  notes: text("notes"),
  deductedAt: integer("deducted_at"),
  createdBy: integer("created_by").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
}, (table) => [
  index("idx_appointments_starts_at").on(table.startsAt),
  index("idx_appointments_client_id").on(table.clientId),
  index("idx_appointments_status_starts_at").on(table.status, table.startsAt),
]);

export const privateSessions = sqliteTable("private_sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tokenHash: text("token_hash").notNull().unique(),
  role: text("role").notNull(),
  userId: integer("user_id").notNull(),
  expiresAt: integer("expires_at").notNull(),
  createdAt: integer("created_at").notNull(),
}, (table) => [index("idx_private_sessions_expires_at").on(table.expiresAt)]);
