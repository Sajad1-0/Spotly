"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingSchema = exports.roomsSchema = exports.userSchema = exports.roomEnum = exports.roleEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
// skapat en enum 
exports.roleEnum = (0, pg_core_1.pgEnum)("role", ["User", "Admin"]);
exports.roomEnum = (0, pg_core_1.pgEnum)("roomType", ["Workspace", "Conference"]);
exports.userSchema = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    username: (0, pg_core_1.varchar)({ length: 200 }).unique().notNull(),
    password: (0, pg_core_1.varchar)({ length: 200 }).notNull(),
    role: (0, exports.roleEnum)().notNull()
});
exports.roomsSchema = (0, pg_core_1.pgTable)("rooms", {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    name: (0, pg_core_1.varchar)({ length: 200 }).notNull(),
    capacity: (0, pg_core_1.integer)().notNull(),
    type: (0, exports.roomEnum)().notNull()
});
exports.bookingSchema = (0, pg_core_1.pgTable)("bookings", {
    id: (0, pg_core_1.uuid)().defaultRandom().primaryKey(),
    roomId: (0, pg_core_1.uuid)().references(() => exports.roomsSchema.id).notNull(),
    userId: (0, pg_core_1.uuid)().references(() => exports.userSchema.id).notNull(),
    startTime: (0, pg_core_1.timestamp)({ mode: 'string' }).notNull(),
    endTime: (0, pg_core_1.timestamp)({ mode: 'string' }).notNull()
});
