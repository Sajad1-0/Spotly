import { Role } from "../users/user-roles";
import { Request } from "express";

export interface Booking {
    id: string;
    roomID: string;
    userID: string;
    startTime: string;
    endTime: string;
}

export interface UpdateBooking {
    roomID?: string;
    userID?: string;
    startTime?: string;
    endTime?: string;
}

export interface CreateBookings extends Omit<Booking, 'id'> {}
export interface Bookings extends Omit<Booking, 'id'> {}

export interface JwtToken {
    userID: string,
    role: Role,
}

export interface AuthenticateRequest extends Request {
    jwtPayload?: JwtToken;
}