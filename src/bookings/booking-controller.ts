import { Request, Response } from "express";
import { httpCodeStatus } from "../httpStatus";
import { BookingService } from "./booking-service";

const bookingController = new BookingService

// Create booking
export const createBooking = async (req: Request, res: Response) => {
    try {
        const bookingId = await bookingController.create(req.body)

        // Emit Socket.io event
        const io = req.app.get('io')
        io.emit('create_booking', {
            message: 'Booking has been created',
            booking: bookingId
        })

        console.log(bookingId)
        res.status(httpCodeStatus.CREATED).json({
            message: 'You succesfully create a booking', bookingId
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
    const {role, userId} = req.jwtPayload || {}


    try {
        if (role === 'Admin') {
            const bookings = await bookingController.findAll()
            res.status(httpCodeStatus.OK).json(bookings)
        } else {
            const userBookings = await bookingController.findByUserId(userId);

            if (!userBookings || userBookings.length === 0) {
                res.status(httpCodeStatus.NOT_FOUND).send(`
                    ${userId} has no bookings!`)
                return
            }

            const formattedBookings = userBookings.map((booking: any) => ({
                id: booking.id,
                roomId: booking.roomId,
                userId: booking.userId,
                startTime: booking.startTime,
                endTime: booking.endTime
            }))

            res.status(httpCodeStatus.OK).send(formattedBookings);
        }
    }
    catch(err) {
        res.status(httpCodeStatus.INTERNAL_SERVER_ERROR).json({
            err:'Something went wrong'
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

        const io = req.app.get('io')
        io.emit('delete_booking', {
            message: 'Booking has been deleted!',
            booking: bookingId
        })
        
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

            const io = req.app.get('io')
            io.emit('update_booking', {
                message: 'Booking has been updated!',
                booking: updateId
            })

            res.status(httpCodeStatus.OK).json({
                message: 'Booking has been updated', updateId
            })

        } catch (error) {
            res.status(httpCodeStatus.NOT_FOUND).json({
                message: 'Booking has not been found', error
            })
        }
    }