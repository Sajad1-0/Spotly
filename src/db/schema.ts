import {
    integer, 
    pgTable, 
    varchar,
    uuid,
    pgEnum,
    timestamp,
} from "drizzle-orm/pg-core";

// skapat en enum 
export const roleEnum = pgEnum("role", ["User", "Admin"]);
export const roomEnum =pgEnum("roomType", ["Workspace", "Conference"]);

export const userSchema = pgTable("users", {
    id: uuid().defaultRandom().primaryKey(),
    username: varchar({ length:200 }).unique().notNull(),
    password: varchar({ length:200 }).notNull(),
    role: roleEnum().notNull()
});

export const roomsSchema = pgTable("rooms", {
    id: uuid().defaultRandom().primaryKey(),
    name: varchar({ length: 200 }).notNull(),
    capacity: integer().notNull(),
    type: roomEnum().notNull()
})

export const bookingSchema = pgTable("bookings", {
    id: uuid().defaultRandom().primaryKey(),
    roomId: uuid().references(() => roomsSchema.id).notNull(),
    userId: uuid().references(() => userSchema.id).notNull(),
    startTime: timestamp({ mode: 'string' }).notNull(),
    endTime: timestamp({ mode: 'string' }).notNull()
})

