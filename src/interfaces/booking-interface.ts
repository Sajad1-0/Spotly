import { Role } from "../users/user-roles";
import { Request } from "express";

export interface Booking {
    id: string;
    roomId: string;
    userId: string;
    startTime: string;
    endTime: string;
}

export interface UpdateBooking {
    roomId?: string;
    userId?: string;
    startTime?: string;
    endTime?: string;
}

export interface CreateBookings extends Omit<Booking, 'id'> {}
export interface Bookings extends Omit<Booking, 'id'> {}

export interface JwtToken {
    userId: string,
    role: Role,
}

export interface AuthenticateRequest extends Request {
    jwtPayload?: JwtToken;
}