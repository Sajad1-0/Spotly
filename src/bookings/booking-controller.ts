import { Request, Response } from "express";
import { httpCodeStatus } from "../httpStatus";
import { BookingService } from "./booking-service";
import { logger } from "../utils/loggar";

const bookingController = new BookingService

// Create booking
export const createBooking = async (req: any, res: Response) => {

    try {
        const bookingId = await bookingController.create(req.body)

        // Emit Socket.io event
        const io = req.app.get('io')
        io.emit('create_booking', {
            message: 'Booking has been created',
            booking: bookingId
        })

        logger.info(`A room has been booked`)
        res.status(httpCodeStatus.CREATED).json({
            message: 'You have succesfully booked a room', bookingId
        })
    }
    catch(err) {
        res.status(httpCodeStatus.INTERNAL_SERVER_ERROR).send(`
            Something went wrong`)
    }
}

// get all bookings
export const findAllBookings = async (req: any, res: Response) => {
    const {username, role, userId} = req.jwtPayload || {}


    try {
        if (role === 'Admin') {
            const bookings = await bookingController.findAll();

            logger.info(`${username} has fetched bookings from database`)

            res.status(httpCodeStatus.OK).json(bookings)
        } else {
            const userBookings = await bookingController.findByUserId(userId);

            if (!userBookings || userBookings.length === 0) {

                logger.error(`${username} tried to fetch bookings from database`)

                res.status(httpCodeStatus.NOT_FOUND).send(`
                    ${username} has no bookings!`)
                return
            }

            const formattedBookings = userBookings.map((booking: any) => ({
                id: booking.id,
                roomId: booking.roomId,
                userId: booking.userId,
                startTime: booking.startDateAndTime,
                endTime: booking.endDateAndTime
            }))

            logger.info(`${username} has get their bookings`)

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
export const deleteBookingById = async (req: any, res: Response) => {
    
    const usernameFromToken = req.jwtPayload?.username 

    try {
        const bookingId = await bookingController.delete(req.params.id);

        if(!bookingId) {
            logger.info(`Someone tried to delete a booking without inserting the booking id`)
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
        
        logger.info(`Booking has been deleted by ${usernameFromToken}`)
        res.status(httpCodeStatus.OK).json({
            message: 'Booking has been deleted', bookingId
        })
    } catch (error) {
        res.status(httpCodeStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Something went wrong'
        })
    }
}

// update booking
export const updateBookingById = async (
    req: any, res: Response) => {

        const usernameFromToken = req.jwtPayload?.username;

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

            logger.info(`Booking has been updated by ${usernameFromToken}`)
            res.status(httpCodeStatus.OK).json({
                message: 'Booking has been updated', updateId
            })

        } catch (error) {
            res.status(httpCodeStatus.NOT_FOUND).json({
                message: 'Booking has not been found', error
            })
        }
}