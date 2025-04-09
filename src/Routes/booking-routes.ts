import { Router } from "express";
import {
    createBooking, 
    findAllBookings, 
    deleteBookingById, 
    findBookingById, 
    updateBookingById} from "../bookings/booking-controller";
import { authorizeForOwners } from "../middlewares/authorize-for-owners";

const router = Router()

router.post('/', createBooking);
router.get('/', findAllBookings);
router.get('/:id', authorizeForOwners, findBookingById);
router.delete('/:id', authorizeForOwners, deleteBookingById);
router.put('/:id',  authorizeForOwners, updateBookingById)

export default router;