"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingById = exports.deleteBookingById = exports.findBookingById = exports.findAllBookings = exports.createBooking = void 0;
const httpStatus_1 = require("../httpStatus");
const booking_service_1 = require("./booking-service");
const loggar_1 = require("../utils/loggar");
const bookingController = new booking_service_1.BookingService;
// Create booking
const createBooking = async (req, res) => {
    try {
        const bookingId = await bookingController.create(req.body);
        // Emit Socket.io event
        const io = req.app.get('io');
        io.emit('create_booking', {
            message: 'Booking has been created',
            booking: bookingId
        });
        loggar_1.logger.info(`A room has been booked`);
        res.status(httpStatus_1.httpCodeStatus.CREATED).json({
            message: 'You have succesfully booked a room', bookingId
        });
    }
    catch (err) {
        res.status(httpStatus_1.httpCodeStatus.INTERNAL_SERVER_ERROR).send(`
            Something went wrong`);
    }
};
exports.createBooking = createBooking;
// get all bookings
const findAllBookings = async (req, res) => {
    const { username, role, userId } = req.jwtPayload || {};
    try {
        if (role === 'Admin') {
            const bookings = await bookingController.findAll();
            loggar_1.logger.info(`${username} has fetched bookings from database`);
            res.status(httpStatus_1.httpCodeStatus.OK).json(bookings);
        }
        else {
            const userBookings = await bookingController.findByUserId(userId);
            if (!userBookings || userBookings.length === 0) {
                loggar_1.logger.error(`${username} tried to fetch bookings from database`);
                res.status(httpStatus_1.httpCodeStatus.NOT_FOUND).send(`
                    ${username} has no bookings!`);
                return;
            }
            const formattedBookings = userBookings.map((booking) => ({
                id: booking.id,
                roomId: booking.roomId,
                userId: booking.userId,
                startTime: booking.startTime,
                endTime: booking.endTime
            }));
            loggar_1.logger.info(`${username} has get their bookings`);
            res.status(httpStatus_1.httpCodeStatus.OK).send(formattedBookings);
        }
    }
    catch (err) {
        res.status(httpStatus_1.httpCodeStatus.INTERNAL_SERVER_ERROR).json({
            err: 'Something went wrong'
        });
    }
};
exports.findAllBookings = findAllBookings;
// find Booking 
const findBookingById = async (req, res) => {
    try {
        const bookingId = await bookingController.findOne(req.params.id);
        if (!bookingId) {
            res.status(httpStatus_1.httpCodeStatus.BAD_REQUEST).json({
                message: 'The booking required Id'
            });
        }
        res.status(httpStatus_1.httpCodeStatus.OK).json({
            message: 'Booking has been found', bookingId
        });
    }
    catch (err) {
        res.status(httpStatus_1.httpCodeStatus.NOT_FOUND).json({
            error: err.message
        });
    }
};
exports.findBookingById = findBookingById;
// delete booking 
const deleteBookingById = async (req, res) => {
    const usernameFromToken = req.jwtPayload?.username || {};
    try {
        const bookingId = await bookingController.delete(req.params.id);
        if (!bookingId) {
            loggar_1.logger.info(`Someone tried to delete a booking without inserting the booking id`);
            res.status(httpStatus_1.httpCodeStatus.BAD_REQUEST).json({
                message: 'Booking Id required'
            });
            return;
        }
        const io = req.app.get('io');
        io.emit('delete_booking', {
            message: 'Booking has been deleted!',
            booking: bookingId
        });
        loggar_1.logger.info(`Booking has been deleted by ${usernameFromToken}`);
        res.status(httpStatus_1.httpCodeStatus.OK).json({
            message: 'Booking has been deleted', bookingId
        });
    }
    catch (error) {
        res.status(httpStatus_1.httpCodeStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Something went wrong'
        });
    }
};
exports.deleteBookingById = deleteBookingById;
// update booking
const updateBookingById = async (req, res) => {
    const usernameFromToken = req.jwtPayload?.username;
    try {
        const updateId = await bookingController.update(req.params.id, req.body);
        if (!updateId) {
            res.status(httpStatus_1.httpCodeStatus.BAD_REQUEST).json({
                message: 'Booking Id Required'
            });
            return;
        }
        const io = req.app.get('io');
        io.emit('update_booking', {
            message: 'Booking has been updated!',
            booking: updateId
        });
        loggar_1.logger.info(`Booking has been updated by ${usernameFromToken}`);
        res.status(httpStatus_1.httpCodeStatus.OK).json({
            message: 'Booking has been updated', updateId
        });
    }
    catch (error) {
        res.status(httpStatus_1.httpCodeStatus.NOT_FOUND).json({
            message: 'Booking has not been found', error
        });
    }
};
exports.updateBookingById = updateBookingById;
