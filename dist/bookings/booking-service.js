"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const loggar_1 = require("../utils/loggar");
const booking_repository_1 = require("./booking-repository");
const node_cache_1 = __importDefault(require("node-cache"));
const bookingService = new booking_repository_1.BookingRepository();
/* stdTTL: Standard time-to-liv. Det säkerställer att varje cache-post automatiskt
förfallaer efter en vid tid, i detta fall 600sekunder = 10min

checkperiod: Det genomsöka hela cachen och kollar alla lagrade nyckler samt
identifierar vilka cache som har gått ut och behövs att tas bort från minnet.
Detta görs efter en viss tid, i detta fallet 120sek = 2min a

Med andra ord den rensar och uppdaterar cache minnet efter en viss tid
*/
const bookingCache = new node_cache_1.default({ stdTTL: 600, checkperiod: 120 });
class BookingService {
    // hjälp funktion för cache-nycklar
    getCachKey(id) {
        return id ? `booking:${id}` : 'allBookings';
    }
    async create(createBooking) {
        const startDateAndTime = new Date(createBooking.startTime);
        const endDateAndTime = new Date(createBooking.endTime);
        if (startDateAndTime >= endDateAndTime) {
            loggar_1.logger.error(`invalid start or end time has been given`);
            throw new Error('Start-Time date must be before end-Time date');
        }
        const checkRoomAvailability = await bookingService.findBookingByRoomIdAndDate(createBooking.roomId, startDateAndTime, endDateAndTime);
        if (checkRoomAvailability.length > 0) {
            loggar_1.logger.error(`Room is already booked at choosen time
                ${createBooking.startTime}, ${createBooking.endTime}`);
            throw new Error(`The room is already booked for the selected dates: 
                ${createBooking.startTime}, ${createBooking.endTime}.
                Please choose another date`);
        }
        const createdBookingId = await bookingService.create(createBooking);
        // Rensa relevant cache
        bookingCache.del(this.getCachKey());
        return {
            id: createdBookingId,
            roomId: createBooking.roomId,
            userId: createBooking.userId,
        };
    }
    async findAll() {
        const cacheKey = this.getCachKey();
        const cachedBookings = bookingCache.get(cacheKey);
        if (cachedBookings) {
            loggar_1.logger.info('Returns bookings from cache');
            return cachedBookings;
        }
        loggar_1.logger.info('Fetching data from Database...');
        const bookings = await bookingService.findAllBookings();
        bookingCache.set(cacheKey, bookings);
        return bookings;
    }
    async findByUserId(userId) {
        const cacheKey = this.getCachKey(userId);
        const cachedBookings = bookingCache.get(cacheKey);
        if (cachedBookings) {
            loggar_1.logger.info('Returns bookings from cache');
            return cachedBookings;
        }
        loggar_1.logger.info('Fetching data from Database...');
        const bookings = await bookingService.findBookingsByUserId(userId);
        bookingCache.set(cacheKey, bookings);
        return bookings;
    }
    async findOne(id) {
        const cacheKey = this.getCachKey(id);
        const cached = bookingCache.get(cacheKey);
        if (cached) {
            loggar_1.logger.info(`Cached data`);
            return cached;
        }
        const booking = await bookingService.findOneBooking(id);
        bookingCache.set(cacheKey, booking);
        return booking;
    }
    async update(id, updateBooking) {
        await bookingService.update(id, updateBooking);
        bookingCache.del(this.getCachKey(id)); // update the updated booking
        bookingCache.del(this.getCachKey()); // Update all bookings
        if (updateBooking.roomId) {
            bookingCache.del(`room: ${updateBooking.roomId}: availability`);
        }
        return this.findOne(id);
    }
    async delete(id) {
        const booking = await this.findOne(id);
        await bookingService.delete(id);
        bookingCache.del(this.getCachKey(id)); // delete one booking
        bookingCache.del(this.getCachKey());
        if (booking.roomId) {
            bookingCache.del(`room: ${booking.roomId}: availibility`);
        }
        return {
            id,
            roomId: booking.roomId,
            userId: booking.userId,
            deleted: true,
        };
    }
}
exports.BookingService = BookingService;
