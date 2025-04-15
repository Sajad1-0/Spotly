"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const schema_1 = require("../db/schema");
const rooms_repository_1 = require("../rooms/rooms-repository");
const drizzle_orm_1 = require("drizzle-orm");
class userRepository {
    async create(createUser) {
        const CreatedUser = await rooms_repository_1.db.insert(schema_1.userSchema)
            .values(createUser)
            .returning({ insertedId: schema_1.userSchema.id });
        return CreatedUser[0].insertedId;
    }
    async findAllUsers() {
        const allUsers = await rooms_repository_1.db.select()
            .from(schema_1.userSchema);
        return allUsers.map(({ password, ...usersWithoutPassword }) => usersWithoutPassword);
    }
    async findUserByUsername(username) {
        const findUser = await rooms_repository_1.db.select()
            .from(schema_1.userSchema)
            .where((0, drizzle_orm_1.eq)(schema_1.userSchema.username, username));
        if (findUser.length === 0) {
            throw new Error('User not been found!');
        }
        return findUser[0];
    }
    async findUserById(id) {
        const findUserById = await rooms_repository_1.db.select()
            .from(schema_1.userSchema)
            .where((0, drizzle_orm_1.eq)(schema_1.userSchema.id, id));
        if (findUserById.length === 0) {
            throw new Error('User not been found!');
        }
        const { password, ...userWithoutPassword } = findUserById[0];
        return userWithoutPassword;
    }
    async update(id, updateUser) {
        const updateRooms = await rooms_repository_1.db.update(schema_1.userSchema)
            .set(updateUser)
            .where((0, drizzle_orm_1.eq)(schema_1.userSchema.id, id))
            .returning({ updateId: schema_1.userSchema.id });
        if (updateRooms.length === 0) {
            throw new Error('User has not been found');
        }
        return updateRooms[0].updateId;
    }
    async delete(id) {
        if (!id) {
            throw new Error('User Id required');
        }
        const deleteUser = await rooms_repository_1.db.delete(schema_1.userSchema)
            .where((0, drizzle_orm_1.eq)(schema_1.userSchema.id, id))
            .returning();
        if (deleteUser.length === 0) {
            throw new Error(`There is no User with this id ${id}`);
        }
        return deleteUser[0].id;
    }
    async getPassword(username) {
        const userInfo = await rooms_repository_1.db.select()
            .from(schema_1.userSchema)
            .where((0, drizzle_orm_1.eq)(schema_1.userSchema.username, username));
        console.log(userInfo);
        if (userInfo.length === 0) {
            throw new Error('User has not been found');
        }
        return userInfo[0].password;
    }
}
exports.userRepository = userRepository;
