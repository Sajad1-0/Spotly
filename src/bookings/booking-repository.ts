import 'dotenv/config';
import { bookingSchema } from '../db/schema';
import { eq, and, lte, gte, or } from 'drizzle-orm';
import { db } from '../rooms/rooms-repository';

export  type CreateBookings = typeof bookingSchema.$inferInsert;
export type UpdateBookings = Partial<CreateBookings>;

export class BookingRepository {

    async create(createBooking: CreateBookings): Promise<string> {
        const createBookings = await db.insert(bookingSchema)
        .values(createBooking)
        .returning({insertId: bookingSchema.id})
        return createBookings[0].insertId
    }

    async update(id: string, updateBookings: UpdateBookings): Promise<string> {
        const updateBooking = await db.update(bookingSchema)
        .set(updateBookings)
        .where(eq(bookingSchema.id, id))
        .returning({updateId: bookingSchema.id})

        return updateBooking[0].updateId
    }

    async findAllBookings(): Promise<CreateBookings[]> {
        return await db.select().from(bookingSchema);
    }

    async findBookingsByUserId(userId: string): Promise<CreateBookings[]> {
        return await db.select()
        .from(bookingSchema)
        .where(eq(bookingSchema.userId, userId))
    }

    async findOneBooking(id: string): Promise<CreateBookings> {
        const bookingId = await db.select()
        .from(bookingSchema)
        .where(and(
            eq(bookingSchema.id, id)
        ))
        
        if(bookingId.length === 0) {
            // todo: säg till att den kastar 404 till klienten
            throw new Error('The booking has been not found')
        }
        
        return bookingId[0]
    }

    async findBookingByRoomIdAndDate(roomId: string, startTme: Date, 
        endTime: Date) {
            return await db.select()
            .from(bookingSchema)
            .where(and(eq(bookingSchema.roomId, roomId),
            or(
                and(
                    lte(bookingSchema.startTime, endTime.toISOString()),
                    gte(bookingSchema.endTime, startTme.toISOString())
                ),
                and(
                    lte(bookingSchema.startTime, startTme.toISOString()),
                    gte(bookingSchema.endTime, endTime.toISOString())
                )
            )))
    }

    async delete(id: string): Promise<string> {
        if(!id) {
            throw new Error('Booking Id required!')
        }
        const deleteBooking = await db.delete(bookingSchema)
        .where(eq(bookingSchema.id, id))
        .returning()

        if (deleteBooking.length === 0) {
            throw new Error('The booking has been not found')
        }
        return deleteBooking[0].id
    }
}