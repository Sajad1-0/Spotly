import { Request, Response } from "express";
import { RoomService } from "./rooms-service";
import { httpCodeStatus } from "../httpStatus";
import { logger } from "../utils/loggar";

const roomsController = new RoomService();

export const createRooms = async (req: any, res: Response) => {

    const {username, role} = req.jwtPayload || {};

    if (role !== 'Admin') {
        logger.error(`${username} isn't allowed to create room, bucause ${username}
            isn't Admin`)

        res.status(httpCodeStatus.NOT_AUTHORIZED).send(`
            ${role} isn't allowed to create rooms,
            only Admin can create rooms`)
        return
    }

    try {
        const createRoomId = await roomsController.create(req.body);
        logger.info(`Room has been created by ${username}`, createRoomId)

        res.status(httpCodeStatus.CREATED)
        .json({message: 'Rooms Created', createRoomId})
    }
    catch (error) {
        res.status(httpCodeStatus.INTERNAL_SERVER_ERROR)
        .send('Something went wrong')
    }
}

export const deleteRoomById = async (req: any, res: Response) => {
    const {username, role} = req.jwtPayload || {};
    const deleteRoom = req.params.id; 

    if (role !== 'Admin') {
        logger.error(`${username} tried to delete room, Only Admin is allowed`)

        res.status(httpCodeStatus.NOT_AUTHORIZED).send(`
            ${role} isn't allowed to delete rooms,
            only Admin can delete rooms`)
        return
    }

    if(!deleteRoom) {
        logger.error(`Room id is missing`)

        res.status(httpCodeStatus.BAD_REQUEST).json({
            message: 'Room Id is required'
        })
        return
    }
    try {
        await roomsController.deleteRoom(deleteRoom)
        logger.info(`Room has been deleted by ${username}`)
        res.status(httpCodeStatus.OK).json({
            message: 'Room has been deleted succesfully!', deleteRoom
        })
    }
    catch(error) {
        res.status(httpCodeStatus.INTERNAL_SERVER_ERROR).send(`
            Something went wrong`)
    }
}

export const findAllRooms = async (req: any, res: Response) => {

    const allRooms = await roomsController.getAllRooms();
    
    logger.info(`Rooms has been fetched from database`)

    res.status(httpCodeStatus.OK).json(allRooms)
}

// find one room
export const findRoomById = async (req: Request, res: Response) => {

    try {
        const roomId = await roomsController.findOneRoomById(req.params.id);
        
        logger.info(`Room has been fetched from database`, roomId)

        res.status(httpCodeStatus.OK).json({
            message: 'Room has been found', roomId
        })
    }
    catch (error) {
        res.status(httpCodeStatus.INTERNAL_SERVER_ERROR).send(`
            Something went wrong!`)
    }
}

// update users
export const updateRoomById = async (req: any, res: Response) => {
    const {role, username} = req.jwtPayload || {}

    if( role !== 'Admin') {
        logger.error(`${username} has tried to update a room`)

        res.status(httpCodeStatus.NOT_AUTHORIZED).send(`
            ${role} isn't allowed to update rooms,
            Only Admin can update rooms`)
    }

    try {
        const updatedRoomId = await roomsController.updateRoom(req.params.id, req.body);

        if(!updatedRoomId) {
            res.status(httpCodeStatus.BAD_REQUEST).json({
                message: 'Room Id is required'
            })
            return
        }

        logger.info(`Room has been updated by ${username}, Role: ${role}`)
        res.status(httpCodeStatus.OK).json({
            message: 'Room has been updated', updatedRoomId
        })
        
    } catch (error) {
        res.status(httpCodeStatus.INTERNAL_SERVER_ERROR).send(`
            Something went wrong`)
    }
}