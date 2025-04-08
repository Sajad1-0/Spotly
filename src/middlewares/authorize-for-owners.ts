import { Request, Response, NextFunction } from "express";
import { Role } from "../users/user-roles";
import { httpCodeStatus } from "../httpStatus";
import { AuthenticateRequest } from "../interfaces/booking-interface";
import { BookingService } from "../bookings/booking-service";

const bookingService = new BookingService();

export const authorizeForOwners = async (req: AuthenticateRequest, res: Response, next: NextFunction) => {
    
    const bookingId = req.params.id;
    const {userId: requesterUserId, role} = req.jwtPayload || {}
    console.log('Hej Resmus',req.jwtPayload)

    if(role === Role.Admin) next()
        
    const {userId: ownerUserId} = await bookingService.findOne(bookingId);
    console.log( 'Helloo', ownerUserId);
    console.log('shuu', requesterUserId)
    if(requesterUserId === ownerUserId) return next();

    res.status(httpCodeStatus.NOT_AUTHORIZED)
    .send(`User with this ${ownerUserId} hasn't any rights for this booking: ${bookingId}`)

}
