"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoomById = exports.findRoomById = exports.findAllRooms = exports.deleteRoomById = exports.createRooms = void 0;
const rooms_service_1 = require("./rooms-service");
const httpStatus_1 = require("../httpStatus");
const loggar_1 = require("../utils/loggar");
const roomsController = new rooms_service_1.RoomService();
const createRooms = async (req, res) => {
    const { username, role } = req.jwtPayload || {};
    if (role !== 'Admin') {
        loggar_1.logger.error(`${username} isn't allowed to create room, bucause ${username}
            isn't Admin`);
        res.status(httpStatus_1.httpCodeStatus.NOT_AUTHORIZED).send(`
            ${role} isn't allowed to create rooms,
            only Admin can create rooms`);
        return;
    }
    try {
        const createRoomId = await roomsController.create(req.body);
        loggar_1.logger.info(`Room has been created by ${username}`, createRoomId);
        res.status(httpStatus_1.httpCodeStatus.CREATED)
            .json({ message: 'Rooms Created', createRoomId });
    }
    catch (error) {
        res.status(httpStatus_1.httpCodeStatus.INTERNAL_SERVER_ERROR)
            .send('Something went wrong');
    }
};
exports.createRooms = createRooms;
const deleteRoomById = async (req, res) => {
    const { username, role } = req.jwtPayload || {};
    const deleteRoom = req.params.id;
    if (role !== 'Admin') {
        loggar_1.logger.error(`${username} tried to delete room, Only Admin is allowed`);
        res.status(httpStatus_1.httpCodeStatus.NOT_AUTHORIZED).send(`
            ${role} isn't allowed to delete rooms,
            only Admin can delete rooms`);
        return;
    }
    if (!deleteRoom) {
        loggar_1.logger.error(`Room id is missing`);
        res.status(httpStatus_1.httpCodeStatus.BAD_REQUEST).json({
            message: 'Room Id is required'
        });
        return;
    }
    try {
        await roomsController.deleteRoom(deleteRoom);
        loggar_1.logger.info(`Room has been deleted by ${username}`);
        res.status(httpStatus_1.httpCodeStatus.OK).json({
            message: 'Room has been deleted succesfully!', deleteRoom
        });
    }
    catch (error) {
        res.status(httpStatus_1.httpCodeStatus.INTERNAL_SERVER_ERROR).send(`
            Something went wrong`);
    }
};
exports.deleteRoomById = deleteRoomById;
const findAllRooms = async (req, res) => {
    const allRooms = await roomsController.getAllRooms();
    loggar_1.logger.info(`Rooms has been fetched from database`);
    res.status(httpStatus_1.httpCodeStatus.OK).json(allRooms);
};
exports.findAllRooms = findAllRooms;
// find one room
const findRoomById = async (req, res) => {
    try {
        const roomId = await roomsController.findOneRoomById(req.params.id);
        loggar_1.logger.info(`Room has been fetched from database`, roomId);
        res.status(httpStatus_1.httpCodeStatus.OK).json({
            message: 'Room has been found', roomId
        });
    }
    catch (error) {
        res.status(httpStatus_1.httpCodeStatus.INTERNAL_SERVER_ERROR).send(`
            Something went wrong!`);
    }
};
exports.findRoomById = findRoomById;
// update users
const updateRoomById = async (req, res) => {
    const { role, username } = req.jwtPayload || {};
    if (role !== 'Admin') {
        loggar_1.logger.error(`${username} has tried to update a room`);
        res.status(httpStatus_1.httpCodeStatus.NOT_AUTHORIZED).send(`
            ${role} isn't allowed to update rooms,
            Only Admin can update rooms`);
    }
    try {
        const updatedRoomId = await roomsController.updateRoom(req.params.id, req.body);
        if (!updatedRoomId) {
            res.status(httpStatus_1.httpCodeStatus.BAD_REQUEST).json({
                message: 'Room Id is required'
            });
            return;
        }
        loggar_1.logger.info(`Room has been updated by ${username}, Role: ${role}`);
        res.status(httpStatus_1.httpCodeStatus.OK).json({
            message: 'Room has been updated', updatedRoomId
        });
    }
    catch (error) {
        res.status(httpStatus_1.httpCodeStatus.INTERNAL_SERVER_ERROR).send(`
            Something went wrong`);
    }
};
exports.updateRoomById = updateRoomById;
