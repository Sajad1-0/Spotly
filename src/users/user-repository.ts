import { userSchema } from '../db/schema';
import { db } from '../rooms/rooms-repository';
import { eq} from 'drizzle-orm';
import { User, UserWithoutPassword } from '../interfaces/user-interface';

// typen ska innehålla samma egenskaper som databasen. 
export type CreateUser = typeof userSchema.$inferInsert;
// typen update ska låta inmatning i valfria fält. 
export type UpdateUser = Partial<CreateUser>;

export class userRepository {
    async create(createUser: CreateUser): Promise<string> {
        const CreatedUser = await db.insert(userSchema)
        .values(createUser)
        .returning({insertedId: userSchema.id})
        return CreatedUser[0].insertedId;
    }

    async findAllUsers(): Promise<UserWithoutPassword[] | null> {
        const allUsers = await db.select()
        .from(userSchema)
        
        return allUsers.map(({ password, ...usersWithoutPassword}) => usersWithoutPassword)
    }

    async findUserByUsername(username: string): Promise<User | null> {
        const findUser = await db.select()
        .from(userSchema)
        .where(eq(userSchema.username, username))

        if (findUser.length === 0) {
            throw new Error ('User not been found!')
        }
        return findUser[0];
    }

    async findUserById(id: string): Promise<UserWithoutPassword | null> {
        const findUserById = await db.select()
        .from(userSchema)
        .where(eq(userSchema.id, id))

        if (findUserById.length === 0) {
            throw new Error ('User not been found!')
        }
        const { password, ...userWithoutPassword } = findUserById[0];
        return userWithoutPassword;
    }
    async update(id: string, updateUser: UpdateUser): Promise<string> {
        const updateRooms = await db.update(userSchema)
        .set(updateUser)
        .where(eq(userSchema.id, id))
        .returning({updateId: userSchema.id})

        if (updateRooms.length === 0) {
            throw new Error('User has not been found')
        }

        return updateRooms[0].updateId;
    }

    async delete(id: string): Promise<string> {
        if (!id) {
            throw new Error('User Id required')
        }

        const deleteUser = await db.delete(userSchema)
        .where(eq(userSchema.id, id))
        .returning()

        if (deleteUser.length === 0 ) {
            throw new Error(`There is no User with this id ${id}`)
        }
        return deleteUser[0].id;
    }

    async getPassword(username: string): Promise<string | null> {
        const userInfo = await db.select()
        .from(userSchema)
        .where(eq(userSchema.username, username))
        console.log(userInfo)
        if (userInfo.length === 0) {
            throw new Error('User has not been found')
        }
        return userInfo[0].password
    }
}