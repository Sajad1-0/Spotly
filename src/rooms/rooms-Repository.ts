import 'dotenv/config';
import {drizzle} from 'drizzle-orm/node-postgres';
import { roomsSchema } from '../db/schema';
import { eq, and } from 'drizzle-orm';

export const db = drizzle(process.env.DATABASE_URL!);

export type CreateRoom = typeof roomsSchema.$inferInsert;
export type UpdateRoom = Partial<CreateRoom>;

export class roomRepository {

    // creating rooms
    async create(createRoom: CreateRoom): Promise<string> {
        const CreatingRoom = await db.insert(roomsSchema)
        .values(createRoom)
        .returning({insertedId: roomsSchema.id})
        return CreatingRoom[0].insertedId;
    } 

    // updating rooms
    async update(id: string, updateRoom: UpdateRoom): Promise<string> {
        
        const updateRooms = await db.update(roomsSchema)
        .set(updateRoom)
        .where(eq(roomsSchema.id, id))
        .returning({updateId: roomsSchema.id})

        if (updateRooms.length === 0) {
            throw new Error(`Couldn't find room with id ${id}`)
        }
        
        return updateRooms[0].updateId
    }

    // find rooms
    async findAllRooms(): Promise<CreateRoom[]> {
        return db.select()
        .from(roomsSchema)
    }

    // find onde room 
    async findOne(id: string): Promise<CreateRoom> {
        const findOneRoom = await db.select()
        .from(roomsSchema)
        .where(and(
            eq(roomsSchema.id, id)
        ))

        if (findOneRoom.length === 0) {
            throw new Error(`There is no room with this id ${id}`)
        }

        return findOneRoom[0]
    }

    // delete rooms
    async delete(id: string): Promise<string> {

        if(!id) {
            throw new Error('Room Id is required!')
        }
        const deleteRooms = await db.delete(roomsSchema)
        .where(eq(roomsSchema.id, id))
        .returning()

        if(deleteRooms.length === 0) {
            throw new Error(`There is no room with this id ${id}`)
        }

        return deleteRooms[0].id;
    }
}