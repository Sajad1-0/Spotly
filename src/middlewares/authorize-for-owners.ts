import { Request, Response, NextFunction } from "express";
import { Role } from "../users/user-roles";
import { httpCodeStatus } from "../httpStatus";
import { authenticateRequest } from "../interfaces/booking-interface";
import { BookingService } from "../bookings/booking-service";
import { logger } from "../utils/loggar";

const bookingService = new BookingService();

export const authorizeForOwners = async (req: authenticateRequest, res: Response, next: NextFunction) => {
    
    const bookingId = req.params.id;
    const {userId: requesterUserId, role} = req.jwtPayload || {}
    

    if(role === Role.Admin) return next()
        
    const {userId: ownerUserId} = await bookingService.findOne(bookingId);
    
    if(requesterUserId === ownerUserId) return next();
    
    logger.error(`${ownerUserId} trying to change this booking: ${bookingId}`)

    res.status(httpCodeStatus.NOT_AUTHORIZED)
    .send(`User with this ${ownerUserId} hasn't any rights for this booking: ${bookingId}`)

}
