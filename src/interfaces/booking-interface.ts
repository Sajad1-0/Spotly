import { Role } from "../users/user-roles";
import { Request } from "express";

export interface booking {
    id: string;
    roomId: string;
    userId: string;
    startTime: string;
    endTime: string;
}

export interface updateBooking {
    roomId?: string;
    userId?: string;
    startTime?: string;
    endTime?: string;
}

export interface createBookings extends Omit<booking, 'id'> {}
export interface bookingsWithoutId extends Omit<booking, 'id'> {}

export interface jwtToken {
    userId: string,
    role: Role,
}

export interface authenticateRequest extends Request {
    jwtPayload?: jwtToken;
}