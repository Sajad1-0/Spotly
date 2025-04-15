import { authorize } from "../middlewares/authorize-utils";
import { 
    createRooms,
    deleteRoomById, 
    findAllRooms, 
    findRoomById, 
    updateRoomById} from "../rooms/rooms-controller";
import { Router } from "express";

const router = Router()

router.post('/', authorize(['room:create']), createRooms);
router.get('/', findAllRooms);
router.delete('/:id', deleteRoomById);
router.get('/:id', findRoomById);
router.put('/:id', updateRoomById)

export default router