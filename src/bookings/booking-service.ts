import { Bookings, CreateBookings, UpdateBooking } from "../interfaces/booking-interface";
import { bookingRepository } from "./booking-repository";
import NodeCache from "node-cache";

const bookingService = new bookingRepository();
const bookingCache = new NodeCache({stdTTL: 600, checkperiod: 120})
export class BookingService {

    // hjälp funktion för cache-nycklar
    private getCachKey(id?: string): string {
        return id ? `booking:${id}` : 'allBookings';
    }
    async create(createBooking: CreateBookings): Promise<string> {

        if(createBooking.startTime >= createBooking.endTime) {
            throw new Error ('Start-Time date must be before end-Time date')
        }

        const checkRoomAvailability = await bookingService.findBookingByRoomIdAndDate(
            createBooking.roomID,
            createBooking.startTime,
            createBooking.endTime
        )

        if (checkRoomAvailability.length > 0 ) {
            throw new Error (`The room is already booked for the selected dates: 
                ${createBooking.startTime}, ${createBooking.endTime}.
                Please choose another date`)
        }

        const CreatingBooking = await bookingService.create(createBooking)

        // Rensa relevant cache
        bookingCache.del(this.getCachKey()); 

        return CreatingBooking;
    }

    async findAll(): Promise<Bookings[]> {
        const cacheKey = this.getCachKey();
        const cachedBookings = bookingCache.get<Bookings[]>(cacheKey);
    

        if(cachedBookings) {
            console.log('Returns bookings from cache')
            return cachedBookings
        }

        console.log('Fetching data from Database...')

        const bookings = await bookingService.findAllBookings();
        bookingCache.set(cacheKey, bookings);

        return bookings
    }

    async findOne(id: string): Promise<Bookings> {
        const cacheKey = this.getCachKey(id);
        const cached = bookingCache.get<Bookings>(cacheKey)

        if (cached) {
            console.log(`Data is cached`)
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

        if(updateBooking.roomID) {
            bookingCache.del(`room: ${updateBooking.roomID}: availability`)
        }

        return this.findOne(id)
    }

    async delete(id: string): Promise<{ id: string; deleted: boolean }> {

        const booking = await this.findOne(id)

        await bookingService.delete(id)

        bookingCache.del(this.getCachKey(id)) // delete one booking
        bookingCache.del(this.getCachKey())
        
        if (booking.roomID) {
            bookingCache.del(`room: ${booking.roomID}: availibility`)
        }

        return {id, deleted: true};
    }
}