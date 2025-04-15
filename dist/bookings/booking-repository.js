"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRepository = void 0;
require("dotenv/config");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const rooms_repository_1 = require("../rooms/rooms-repository");
class bookingRepository {
    async create(createBooking) {
        const createBookings = await rooms_repository_1.db.insert(schema_1.bookingSchema)
            .values(createBooking)
            .returning({ insertId: schema_1.bookingSchema.id });
        return createBookings[0].insertId;
    }
    async update(id, updateBookings) {
        const updateBooking = await rooms_repository_1.db.update(schema_1.bookingSchema)
            .set(updateBookings)
            .where((0, drizzle_orm_1.eq)(schema_1.bookingSchema.id, id))
            .returning({ updateId: schema_1.bookingSchema.id });
        return updateBooking[0].updateId;
    }
    async findAllBookings() {
        return await rooms_repository_1.db.select().from(schema_1.bookingSchema);
    }
    async findBookingsByUserId(userId) {
        return await rooms_repository_1.db.select()
            .from(schema_1.bookingSchema)
            .where((0, drizzle_orm_1.eq)(schema_1.bookingSchema.userId, userId));
    }
    async findOneBooking(id) {
        const bookingId = await rooms_repository_1.db.select()
            .from(schema_1.bookingSchema)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.bookingSchema.id, id)));
        if (bookingId.length === 0) {
            // todo: säg till att den kastar 404 till klienten
            throw new Error('The booking has been not found');
        }
        return bookingId[0];
    }
    async findBookingByRoomIdAndDate(roomId, startTme, endTime) {
        return await rooms_repository_1.db.select()
            .from(schema_1.bookingSchema)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.bookingSchema.roomId, roomId), (0, drizzle_orm_1.or)((0, drizzle_orm_1.and)((0, drizzle_orm_1.lte)(schema_1.bookingSchema.startTime, endTime.toISOString()), (0, drizzle_orm_1.gte)(schema_1.bookingSchema.endTime, startTme.toISOString())), (0, drizzle_orm_1.and)((0, drizzle_orm_1.lte)(schema_1.bookingSchema.startTime, startTme.toISOString()), (0, drizzle_orm_1.gte)(schema_1.bookingSchema.endTime, endTime.toISOString())))));
    }
    async delete(id) {
        if (!id) {
            throw new Error('Booking Id required!');
        }
        const deleteBooking = await rooms_repository_1.db.delete(schema_1.bookingSchema)
            .where((0, drizzle_orm_1.eq)(schema_1.bookingSchema.id, id))
            .returning();
        if (deleteBooking.length === 0) {
            throw new Error('The booking has been not found');
        }
        return deleteBooking[0].id;
    }
}
exports.bookingRepository = bookingRepository;
