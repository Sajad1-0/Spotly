import { CreateRoom, UpdateRoom } from "../interfaces/room-interface";
import { logger } from "../utils/loggar";
import { roomRepository } from "./rooms-repository";
import NodeCache from "node-cache";


const roomService = new roomRepository();
const roomCache = new NodeCache({stdTTL: 600, checkperiod:120}) 

export class RoomService {

    private getCachKey(id?: string ): string {
        return id ? `room:${id}` : 'allRooms'
    }
    async create(room: CreateRoom) {
        
        const createRooms = await roomService.create(room)

        // Rensa relevant cache
        roomCache.del(this.getCachKey())
        return createRooms; 
    }

    async getAllRooms() {
        const cacheKey = this.getCachKey();
        const cachedRooms = await roomCache.get(cacheKey);

        if (cachedRooms) {
            return cachedRooms
        }

        logger.info('Fetching data from Database...')
        const rooms = await roomService.findAllRooms()

        roomCache.set(cacheKey, rooms)
        return rooms
    }

    async findOneRoomById(id: string) {
        const cacheKey = this.getCachKey(id);
        const cachedRoom = await roomCache.get(cacheKey);

        if (cachedRoom) {            
            return cachedRoom
        }

        logger.info('Fetching data from Database...')
        const room = await roomService.findOne(id)

        roomCache.set(cacheKey, room)
        return room
    }

    async updateRoom(id: string, updateRoom: UpdateRoom) {

        const roomUpdate = await roomService.update(id, updateRoom)

        roomCache.del(this.getCachKey(id));
        roomCache.del(this.getCachKey());
        return roomUpdate

    }

    async deleteRoom(id: string) {

        const deletedRoom = await roomService.delete(id)

        roomCache.del(this.getCachKey(id));
        roomCache.del(this.getCachKey());
        
        return deletedRoom
    }
}