"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const auth_utils_1 = require("../middlewares/auth-utils");
const user_repository_1 = require("./user-repository");
const node_cache_1 = __importDefault(require("node-cache"));
const loggar_1 = require("../utils/loggar");
const authUtils = new auth_utils_1.AuthUtils();
const userRepo = new user_repository_1.userRepository();
const userCache = new node_cache_1.default({ stdTTL: 600, checkperiod: 120 });
class UserService {
    getCachKey(id) {
        return id ? `user${id}` : 'allUsers';
    }
    // create user
    async create(createUser) {
        const hashedPassword = await authUtils.hashPassword(createUser.password);
        const createUsers = await userRepo.create({
            username: createUser.username,
            password: hashedPassword,
            role: createUser.role
        });
        userCache.del(this.getCachKey());
        loggar_1.logger.info('Chached Data has been updated');
        return createUsers;
    }
    async findAllUsers() {
        const cacheKey = this.getCachKey();
        const cachedUser = await userCache.get(cacheKey);
        if (cachedUser) {
            return cachedUser;
        }
        loggar_1.logger.info('Fetching data from database....');
        const users = await userRepo.findAllUsers();
        userCache.set(cacheKey, users);
        return users;
    }
    async findUserById(id) {
        const cacheKey = this.getCachKey(id);
        const cachedUser = await userCache.get(cacheKey);
        if (cachedUser) {
            return cachedUser;
        }
        const userId = userRepo.findUserById(id);
        userCache.set(cacheKey, userId);
        return userId;
    }
    async update(id, updateUser) {
        // bycrypt password if it has been updated
        const hashedPassword = await authUtils.hashPassword(updateUser.password);
        updateUser.password = hashedPassword;
        const updatedUser = await userRepo.update(id, updateUser);
        userCache.del(this.getCachKey(id)); // update the user
        userCache.del(this.getCachKey());
        return updatedUser;
    }
    async delete(id) {
        const deleteUser = await userRepo.delete(id);
        userCache.del(this.getCachKey(id));
        userCache.del(this.getCachKey());
        return deleteUser;
    }
    async login(crendentials) {
        const hashedPassword = await userRepo.getPassword(crendentials.username);
        if (!hashedPassword) {
            loggar_1.logger.error(`The password doesn't match for this user: ${crendentials.username}`);
            return null;
        }
        const user = await userRepo.findUserByUsername(crendentials.username);
        if (!user) {
            loggar_1.logger.error(`User with id: ${crendentials.username} doesn't exist`);
            return null;
        }
        const correctCrendentials = await authUtils.validatePassword(crendentials.password, hashedPassword);
        if (!correctCrendentials) {
            loggar_1.logger.error(`Wrong password for user with username: ${crendentials.username}`);
            return null;
        }
        //hämta från databasen och inte från UserCrendentials
        return authUtils.generateToken(user.id, user.role, user.username);
    }
}
exports.UserService = UserService;
