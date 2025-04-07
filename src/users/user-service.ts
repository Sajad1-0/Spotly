import { UserCrendentials, CreateUser, UpdateUser } from "../interfaces/user-interface";
import { AuthUtils } from "../middlewares/auth-utils";
import { userRepository } from "./user-repository";
import { Role } from "./user-roles";
import NodeCache from "node-cache";

const authUtils = new AuthUtils();
const userRepo = new userRepository();
const userCache = new NodeCache({stdTTL: 600, checkperiod: 120})

export class UserService {

    private getCachKey(id?: string): string {
        return id ? `user${id}` : 'allUsers'
    }

    // create user
    async create(createUser: CreateUser): Promise<string> {
        const hashedPassword = await authUtils.hashPassword(createUser.password);

        const createUsers = await userRepo.create({
            username: createUser.username,
            password: hashedPassword,
            role: createUser.role
        })

        userCache.del(this.getCachKey())

        return createUsers
    }

    async findAllUsers() {
        const cacheKey = this.getCachKey()
        const cachedUser = await userCache.get(cacheKey);

        if(cachedUser) {
            return cachedUser
        }

        console.log('Fetching users from database...')
        const users = await userRepo.findAllUsers()

        userCache.set(cacheKey, users)

        return users
    }

    async findUserById(id: string) {
        const cacheKey = this.getCachKey(id);
        const cachedUser = await userCache.get(cacheKey);

        if (cachedUser) {
            return cachedUser
        }

        const userId = userRepo.findUserById(id)
        
        userCache.set(cacheKey, userId)

        return userId
    }

    async update(id: string, updateUser: UpdateUser) {


        // bycrypt password if it has been updated
        const hashedPassword = await authUtils.hashPassword(
            updateUser.password);
        updateUser.password = hashedPassword;   
        
        const updatedUser = await userRepo.update(id, updateUser)
        userCache.del(this.getCachKey(id)) // update the user
        userCache.del(this.getCachKey())
        return updatedUser
    }

    async delete(id: string) {

        const deleteUser = await userRepo.delete(id);

        userCache.del(this.getCachKey(id))
        userCache.del(this.getCachKey())
        
        return deleteUser
    }

    async login(crendentials: UserCrendentials): Promise<string | null> {
        const hashedPassword = await userRepo.getPassword(crendentials.username)

        if(!hashedPassword) {
            console.warn(`The password doesn't match for this user: ${crendentials.username}`)
            return null
        }

        const user = await userRepo.findUserByUsername(crendentials.username)

        if(!user) {
            console.warn(`User with id: ${crendentials.username} doesn't exist`)
            return null
        }

        const correctCrendentials = await authUtils.validatePassword(
            crendentials.password, hashedPassword
        )

        if(!correctCrendentials) {
            console.warn(`Wrong password for user with username: ${crendentials.username}`)
            return null
        }
        
        //hämta från databasen och inte från UserCrendentials
        return authUtils.generateToken(user.id, user.role as Role, user.username);
    }
}