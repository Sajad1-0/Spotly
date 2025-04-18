"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomRepository = exports.db = void 0;
require("dotenv/config");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
exports.db = (0, node_postgres_1.drizzle)(process.env.DATABASE_URL);
class roomRepository {
    // creating rooms
    async create(createRoom) {
        const CreatingRoom = await exports.db.insert(schema_1.roomsSchema)
            .values(createRoom)
            .returning({ insertedId: schema_1.roomsSchema.id });
        return CreatingRoom[0].insertedId;
    }
    // updating rooms
    async update(id, updateRoom) {
        const updateRooms = await exports.db.update(schema_1.roomsSchema)
            .set(updateRoom)
            .where((0, drizzle_orm_1.eq)(schema_1.roomsSchema.id, id))
            .returning({ updateId: schema_1.roomsSchema.id });
        if (updateRooms.length === 0) {
            throw new Error(`Couldn't find room with id ${id}`);
        }
        return updateRooms[0].updateId;
    }
    // find rooms
    async findAllRooms() {
        return exports.db.select()
            .from(schema_1.roomsSchema);
    }
    // find onde room 
    async findOne(id) {
        const findOneRoom = await exports.db.select()
            .from(schema_1.roomsSchema)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.roomsSchema.id, id)));
        if (findOneRoom.length === 0) {
            throw new Error(`There is no room with this id ${id}`);
        }
        return findOneRoom[0];
    }
    // delete rooms
    async delete(id) {
        if (!id) {
            throw new Error('Room Id is required!');
        }
        const deleteRooms = await exports.db.delete(schema_1.roomsSchema)
            .where((0, drizzle_orm_1.eq)(schema_1.roomsSchema.id, id))
            .returning();
        if (deleteRooms.length === 0) {
            throw new Error(`There is no room with this id ${id}`);
        }
        return deleteRooms[0].id;
    }
}
exports.roomRepository = roomRepository;
