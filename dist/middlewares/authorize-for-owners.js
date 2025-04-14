"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeForOwners = void 0;
const user_roles_1 = require("../users/user-roles");
const httpStatus_1 = require("../httpStatus");
const booking_service_1 = require("../bookings/booking-service");
const loggar_1 = require("../utils/loggar");
const bookingService = new booking_service_1.BookingService();
const authorizeForOwners = async (req, res, next) => {
    const bookingId = req.params.id;
    const { userId: requesterUserId, role } = req.jwtPayload || {};
    if (role === user_roles_1.Role.Admin)
        return next();
    const { userId: ownerUserId } = await bookingService.findOne(bookingId);
    if (requesterUserId === ownerUserId)
        return next();
    loggar_1.logger.error(`${ownerUserId} trying to change this booking: ${bookingId}`);
    res.status(httpStatus_1.httpCodeStatus.NOT_AUTHORIZED)
        .send(`User with this ${ownerUserId} hasn't any rights for this booking: ${bookingId}`);
};
exports.authorizeForOwners = authorizeForOwners;
