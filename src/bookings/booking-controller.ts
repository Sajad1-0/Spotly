import { Request, Response } from "express";
import { httpCodeStatus } from "../httpStatus";
import { BookingService } from "./booking-service";

const bookingController = new BookingService

// Create booking
export const createBooking = async (req: Request, res: Response) => {
    try {
        const bookingId = await bookingController.create(req.body)
        console.log(bookingId)
        res.status(httpCodeStatus.CREATED).json({
            message: 'You succesfully create a booking',
        })
    }
    catch(err) {
        console.log(err)
        console.log()
        res.status(httpCodeStatus.NOT_FOUND).json({
            error: (err as Error).message
        })
    }
}

// get all bookings
export const findAllBookings = async (req: any, res: Response) => {

    const userRoleFromToken = req.jwtPayload?.role;

    if(userRoleFromToken !== 'Admin') {
        res.status(httpCodeStatus.NOT_AUTHORIZED).send(`
            ${userRoleFromToken}s aren't allowed to see all bookings,
            only Admins are allowed!`)
    }

    try {
        const bookingId = await bookingController.findAll()
        res.status(httpCodeStatus.OK).json(bookingId)
    }
    catch(err) {
        res.status(httpCodeStatus.NOT_FOUND).json({
            error: (err as Error).message
        })
    }
}

// find Booking 
export const findBookingById = async (req: Request, res: Response) => {
    try {
        const bookingId = await bookingController.findOne(req.params.id);
        
        if(!bookingId) {
            res.status(httpCodeStatus.BAD_REQUEST).json({
                message: 'The booking required Id'
            })
        }
        res.status(httpCodeStatus.OK).json({
            message: 'Booking has been found', bookingId
        })
    }
    catch(err) {
        res.status(httpCodeStatus.NOT_FOUND).json({
            error: (err as Error).message
        })
    }
}

// delete booking 
export const deleteBookingById = async (req: Request, res: Response) => {
    try {
        const bookingId = await bookingController.delete(req.params.id);

        if(!bookingId) {
            res.status(httpCodeStatus.BAD_REQUEST).json({
                message: 'Booking Id required'
            })
            return
        }
        res.status(httpCodeStatus.OK).json({
            message: 'Booking has been deleted', bookingId
        })
    } catch (error) {
        res.status(httpCodeStatus.NOT_FOUND).json({
            message: 'Booking has not been found'
        })
    }
}

// update booking
export const updateBookingById = async (
    req: Request, res: Response) => {
        try {
            const updateId = await bookingController.update(
                req.params.id,
                req.body
            )

            if(!updateId) {
                res.status(httpCodeStatus.BAD_REQUEST).json({
                    message: 'Booking Id Required'
                })
                return
            }
            res.status(httpCodeStatus.OK).json({
                message: 'Booking has been updated', updateId
            })

        } catch (error) {
            res.status(httpCodeStatus.NOT_FOUND).json({
                message: 'Booking has not been found', error
            })
        }
    }