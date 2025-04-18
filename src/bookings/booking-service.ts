import { BookingsWithoutId, CreateBookings, UpdateBooking } from "../interfaces/booking-interface";
import { logger } from "../utils/loggar";
import { BookingRepository } from "./booking-repository";
import NodeCache from "node-cache";

const bookingService = new BookingRepository();


/* stdTTL: Standard time-to-liv. Det säkerställer att varje cache-post automatiskt
förfallaer efter en vid tid, i detta fall 600sekunder = 10min

checkperiod: Det genomsöka hela cachen och kollar alla lagrade nyckler samt 
identifierar vilka cache som har gått ut och behövs att tas bort från minnet.
Detta görs efter en viss tid, i detta fallet 120sek = 2min a

Med andra ord den rensar och uppdaterar cache minnet efter en viss tid
*/


const bookingCache = new NodeCache({stdTTL: 600, checkperiod: 120})
export class BookingService {

    // hjälp funktion för cache-nycklar
    private getCachKey(id?: string): string {
        return id ? `booking:${id}` : 'allBookings';
    }
    async create(createBooking: CreateBookings): Promise<{
        id: string,
        roomId: string,
        userId: string
    }> {

        const startDateAndTime = new Date(createBooking.startTime);
        const endDateAndTime = new Date(createBooking.endTime);

        if(startDateAndTime >= endDateAndTime) {
            logger.error(`invalid start or end time has been given`)

            throw new Error ('Start-Time date must be before end-Time date')
        }

        const checkRoomAvailability = await bookingService.findBookingByRoomIdAndDate(
            createBooking.roomId,
            startDateAndTime,
            endDateAndTime
        )

        if (checkRoomAvailability.length > 0 ) {
            logger.error(`Room is already booked at choosen time
                ${createBooking.startTime}, ${createBooking.endTime}`)

            throw new Error (`The room is already booked for the selected dates: 
                ${createBooking.startTime}, ${createBooking.endTime}.
                Please choose another date`)    
        }
        

        const createdBookingId = await bookingService.create(createBooking)

        // Rensa relevant cache
        bookingCache.del(this.getCachKey()); 

        return {
            id: createdBookingId,
            roomId: createBooking.roomId,
            userId: createBooking.userId,
        };
    }

    async findAll(): Promise<BookingsWithoutId[]> {
        const cacheKey = this.getCachKey();
        const cachedBookings = bookingCache.get<BookingsWithoutId[]>(cacheKey);
    

        if(cachedBookings) {
            logger.info('Returns bookings from cache')
            return cachedBookings
        }

        logger.info('Fetching data from Database...')

        const bookings = await bookingService.findAllBookings();
        bookingCache.set(cacheKey, bookings);

        return bookings
    }

    async findByUserId(userId: string): Promise<BookingsWithoutId[]> {
        const cacheKey = this.getCachKey(userId);
        const cachedBookings = bookingCache.get<BookingsWithoutId[]>(cacheKey);

        if (cachedBookings) {
            logger.info('Returns bookings from cache')
            return cachedBookings
        }

        logger.info('Fetching data from Database...')

        const bookings = await bookingService.findBookingsByUserId(userId);
        bookingCache.set(cacheKey, bookings);

        return bookings
    }

    async findOne(id: string): Promise<BookingsWithoutId> {
        const cacheKey = this.getCachKey(id);
        const cached = bookingCache.get<BookingsWithoutId>(cacheKey)

        if (cached) {
            logger.info(`Cached data`)
            return cached
        }

        const booking = await bookingService.findOneBooking(id);
        bookingCache.set(cacheKey, booking);

        return booking;
    }

    async update(id: string, updateBooking: UpdateBooking) {

         await bookingService.update(id, updateBooking)

        bookingCache.del(this.getCachKey(id)) // update the updated booking
        bookingCache.del(this.getCachKey()) // Update all bookings

        if(updateBooking.roomId) {
            bookingCache.del(`room: ${updateBooking.roomId}: availability`)
        }

        return this.findOne(id)
    }

    async delete(id: string): Promise<{ 
        id: string,
        roomId: string,
        userId: string,
        deleted: boolean,
        }> {

        const booking = await this.findOne(id)

        await bookingService.delete(id)

        bookingCache.del(this.getCachKey(id)) // delete one booking
        bookingCache.del(this.getCachKey())
        
        if (booking.roomId) {
            bookingCache.del(`room: ${booking.roomId}: availibility`)
        }

        return {
            id,
            roomId: booking.roomId,
            userId: booking.userId,
            deleted: true,
        };
    }
}