"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const loggar_1 = require("../utils/loggar");
const rooms_Repository_1 = require("./rooms-Repository");
const node_cache_1 = __importDefault(require("node-cache"));
const roomService = new rooms_Repository_1.roomRepository();
const roomCache = new node_cache_1.default({ stdTTL: 600, checkperiod: 120 });
class RoomService {
    getCachKey(id) {
        return id ? `room:${id}` : 'allRooms';
    }
    async create(room) {
        const createRooms = await roomService.create(room);
        // Rensa relevant cache
        roomCache.del(this.getCachKey());
        return createRooms;
    }
    async getAllRooms() {
        const cacheKey = this.getCachKey();
        const cachedRooms = await roomCache.get(cacheKey);
        if (cachedRooms) {
            return cachedRooms;
        }
        loggar_1.logger.info('Fetching data from Database...');
        const rooms = await roomService.findAllRooms();
        roomCache.set(cacheKey, rooms);
        return rooms;
    }
    async findOneRoomById(id) {
        const cacheKey = this.getCachKey(id);
        const cachedRoom = await roomCache.get(cacheKey);
        if (cachedRoom) {
            return cachedRoom;
        }
        loggar_1.logger.info('Fetching data from Database...');
        const room = await roomService.findOne(id);
        roomCache.set(cacheKey, room);
        return room;
    }
    async updateRoom(id, updateRoom) {
        const roomUpdate = await roomService.update(id, updateRoom);
        roomCache.del(this.getCachKey(id));
        roomCache.del(this.getCachKey());
        return roomUpdate;
    }
    async deleteRoom(id) {
        const deletedRoom = await roomService.delete(id);
        roomCache.del(this.getCachKey(id));
        roomCache.del(this.getCachKey());
        return deletedRoom;
    }
}
exports.RoomService = RoomService;
