import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username"),
  token: text("token"),
  email: text("email").notNull(),
  password: text("password").notNull(),
  avatar: text("avatar"),
  github_id: text("github_id"),
  google_id: text("google_id"),
});

export type Users = InferSelectModel<typeof users>;
