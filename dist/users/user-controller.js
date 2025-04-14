"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.updateUserById = exports.deleteUserById = exports.findUserById = exports.findAllUsers = exports.creatingUsers = void 0;
const user_service_1 = require("./user-service");
const httpStatus_1 = require("../httpStatus");
const loggar_1 = require("../utils/loggar");
const userService = new user_service_1.UserService();
// create user
const creatingUsers = async (req, res) => {
    const createUser = req.body;
    try {
        const userId = await userService.create(createUser);
        loggar_1.logger.info(`✅ User has been created: ${createUser.username}`); // logga i terminal och filen
        // logga för klienten
        res.status(httpStatus_1.httpCodeStatus.CREATED).json({
            message: 'User has been created', userId
        });
    }
    catch (error) {
        loggar_1.logger.error(`❌ Fel vid skapande: ${error.message}`);
        res.status(httpStatus_1.httpCodeStatus.NOT_FOUND).json({
            error: error.message
        });
    }
};
exports.creatingUsers = creatingUsers;
// get all users
const findAllUsers = async (req, res) => {
    const { username, role } = req.jwtPayload || {};
    if (role !== 'Admin') {
        loggar_1.logger.error(`You ${username} can't get all users, 
        Only Admin is allowed to do it.`);
        res.status(httpStatus_1.httpCodeStatus.NOT_AUTHORIZED).send(`
            ${role} isn't allowed to get all users`);
        return;
    }
    try {
        const userId = await userService.findAllUsers();
        loggar_1.logger.info(`Admin ${username} fetched all users 
            from database`);
        res.status(httpStatus_1.httpCodeStatus.OK).json(userId);
    }
    catch (error) {
        res.status(httpStatus_1.httpCodeStatus.NOT_FOUND).json({
            error: error.message
        });
    }
};
exports.findAllUsers = findAllUsers;
const findUserById = async (req, res) => {
    const userInfoToGet = req.params.id;
    const { username, role, userId } = req.jwtPayload || {};
    const isAuthorized = role === 'Admin' ||
        userId === userInfoToGet;
    if (!isAuthorized) {
        loggar_1.logger.error(`You ${username} isn't allowed to get information about
            ${userInfoToGet}`);
        res.status(httpStatus_1.httpCodeStatus.NOT_AUTHORIZED).send(`
            ${username} isn't allowed to get information
            about ${userInfoToGet}`);
        return;
    }
    try {
        const userInfo = await userService.findUserById(userInfoToGet);
        if (!userInfo) {
            loggar_1.logger.error(`There is no user with: ${userId} id`);
            res.status(httpStatus_1.httpCodeStatus.NOT_FOUND).send(`Couldn't find user with: ${userInfoToGet}`);
        }
        loggar_1.logger.info(`User has been found ${userInfoToGet}. By ${username}: ${role}`);
        res.status(httpStatus_1.httpCodeStatus.OK).json({
            message: 'User has been found', userInfo
        });
    }
    catch (error) {
        res.status(httpStatus_1.httpCodeStatus.INTERNAL_SERVER_ERROR).json({
            error: 'Something went wrong'
        });
    }
};
exports.findUserById = findUserById;
// delete user
const deleteUserById = async (req, res) => {
    const userIdFromParams = req.params.id;
    const { userId, role, username } = req.jwtPayload || {};
    const isAuthorized = role === 'Admin' || userIdFromParams === userId;
    if (!isAuthorized) {
        loggar_1.logger.error(`Users aren't allowed to delete other users, This user: 
            ${username} tried to delete this user: ${userIdFromParams}`);
        res.status(httpStatus_1.httpCodeStatus.NOT_AUTHORIZED).send(`${username} isn't allowed to delete this user: 
            ${userIdFromParams}`);
        return;
    }
    try {
        await userService.delete(userIdFromParams);
        loggar_1.logger.info(`${userIdFromParams} has been deleted by ${username}: 
            ${role}`);
        res.status(httpStatus_1.httpCodeStatus.NO_CONTENT).send(`
            ${userId} has been deleted`);
    }
    catch (error) {
        res.status(httpStatus_1.httpCodeStatus.INTERNAL_SERVER_ERROR).send(`
            Something went wrong`);
    }
};
exports.deleteUserById = deleteUserById;
// update user
const updateUserById = async (req, res) => {
    const { userId, username, role } = req.jwtPayload || {};
    const userIdFromParams = req.params.id;
    const updateUser = req.body;
    if (userIdFromParams !== userId) {
        loggar_1.logger.error(`Users aren't allowed to update other users, This user: 
            ${username} tried to update this user: ${userIdFromParams}`);
        res.status(httpStatus_1.httpCodeStatus.NOT_AUTHORIZED).send(`
            ${username} isn't allowed to update this user:
            ${userIdFromParams}`);
        return;
    }
    try {
        await userService.update(userIdFromParams, updateUser);
        loggar_1.logger.info(`${userIdFromParams} has been deleted by ${username}
            : ${role}`);
        res.status(httpStatus_1.httpCodeStatus.NO_CONTENT).send(`
            ${userIdFromParams} has been updated`);
    }
    catch (error) {
        res.status(httpStatus_1.httpCodeStatus.INTERNAL_SERVER_ERROR).send('Something went wrong');
    }
};
exports.updateUserById = updateUserById;
const loginUser = async (req, res) => {
    const userLogin = req.body;
    const jwt = await userService.login(userLogin);
    if (!jwt) {
        loggar_1.logger.error(`${userLogin.username} has been tried to login with wrong
            username or password`);
        res.status(httpStatus_1.httpCodeStatus.NOT_AUTHENTICATED).json({
            message: 'Invalid username or password! please try again'
        });
        return;
    }
    loggar_1.logger.info(`${userLogin.username} has been logged in`);
    res.status(httpStatus_1.httpCodeStatus.OK).json({
        message: 'User has been logged in', jwt
    });
};
exports.loginUser = loginUser;
