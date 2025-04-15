import { Response, Request } from "express";
import { UserService } from "./user-service";
import { httpCodeStatus } from "../httpStatus";
import { CreateUser, UpdateUser, UserCrendentials, AuthenticateRequest } from "../interfaces/user-interface";
import { logger } from "../utils/loggar";

const userService = new UserService();

// create user
export const creatingUsers = async (req: Request, res: Response) => {
    const createUser = req.body as CreateUser;
    try {
        const userId = await userService.create(createUser);

        logger.info(`✅ User has been created: ${createUser.username}`) // logga i terminal och filen
        // logga för klienten
        res.status(httpCodeStatus.CREATED).json({
            message: 'User has been created', userId
        })
    } catch (error) {
        logger.error(`❌ Something went wrong: ${(error as Error).message}`)

        res.status(httpCodeStatus.NOT_FOUND).json({
            error: (error as Error).message
        })
    }
}

// get all users
export const findAllUsers = async (req: any, res: Response) => {

     const {username, role} = req.jwtPayload || {}

    if (role !== 'Admin') {

        logger.error(`You ${username} can't get all users, 
        Only Admin is allowed to do it.`)

        res.status(httpCodeStatus.NOT_AUTHORIZED).send(`
            ${role} isn't allowed to get all users`)
        
        return
    }

    try {
        const userId = await userService.findAllUsers()

        logger.info(`Admin ${username} fetched all users 
            from database`)

        res.status(httpCodeStatus.OK).json(userId)
    }
    catch(error) {
        res.status(httpCodeStatus.NOT_FOUND).json({
            error: (error as Error).message
        })
    }
}

export const findUserById = async (req: AuthenticateRequest, res: Response) => {

    const userInfoToGet = req.params.id;
    const {username, role, userId} = req.jwtPayload || {}

    const isAuthorized = role === 'Admin' || 
    userId === userInfoToGet

    if (!isAuthorized) {
        logger.error(`You ${username} isn't allowed to get information about
            ${userInfoToGet}`)

        res.status(httpCodeStatus.NOT_AUTHORIZED).send(`
            ${username} isn't allowed to get information
            about ${userInfoToGet}`)
        return
    }

    try {
        const userInfo = await userService.findUserById(userInfoToGet);

        if (!userInfo) {
            logger.error(`There is no user with: ${userId} id`)

            res.status(httpCodeStatus.NOT_FOUND).send(
                `Couldn't find user with: ${userInfoToGet}`
            )
        }
        logger.info(`User has been found ${userInfoToGet}. By ${username}: ${role}`)

        res.status(httpCodeStatus.OK).json({
            message: 'User has been found', userInfo
        })
    }
    catch (error) {
        res.status(httpCodeStatus.INTERNAL_SERVER_ERROR).json({
            error: 'Something went wrong'
        })
    }
}

// delete user
export const deleteUserById = async (req: AuthenticateRequest, res: Response) => {
    const userIdFromParams = req.params.id;
    const {userId, role, username} = req.jwtPayload || {}
    
    const isAuthorized = role === 'Admin' || userIdFromParams === userId 

    if(!isAuthorized) {
        logger.error(`Users aren't allowed to delete other users, This user: 
            ${username} tried to delete this user: ${userIdFromParams}`)

        res.status(httpCodeStatus.NOT_AUTHORIZED).send(
            `${username} isn't allowed to delete this user: 
            ${userIdFromParams}`
        )
        return 
    }
    
    try {
        await userService.delete(userIdFromParams)
        logger.info(`${userIdFromParams} has been deleted by ${username}: 
            ${role}`)

        res.status(httpCodeStatus.NO_CONTENT).send(`
            ${userId} has been deleted`)
    } catch (error) {
        res.status(httpCodeStatus.INTERNAL_SERVER_ERROR).send(`
            Something went wrong`)
    }

};

// update user

export const updateUserById = async (req: AuthenticateRequest, res: Response) => {
    const {userId, username, role} = req.jwtPayload || {}
    const userIdFromParams = req.params.id;
    const updateUser = req.body as UpdateUser

    if(userIdFromParams !== userId) {
        logger.error(`Users aren't allowed to update other users, This user: 
            ${username} tried to update this user: ${userIdFromParams}`)

        res.status(httpCodeStatus.NOT_AUTHORIZED).send(`
            ${username} isn't allowed to update this user:
            ${userIdFromParams}`)
     
        return
    }

    try {
        
        await userService.update(userIdFromParams, updateUser);
        logger.info(`${userIdFromParams} has been deleted by ${username}
            : ${role}`)

        res.status(httpCodeStatus.NO_CONTENT).send(`
            ${userIdFromParams} has been updated`)
    } catch (error) {
        res.status(httpCodeStatus.INTERNAL_SERVER_ERROR).send(
            'Something went wrong'
        )
    }
    
}

export const loginUser = async (req: Request, res: Response) => {
    const userLogin = req.body as UserCrendentials;
    const jwt = await userService.login(userLogin);
    
    if (!jwt) {
        logger.error(`${userLogin.username} has been tried to login with wrong
            username or password`);

        res.status(httpCodeStatus.NOT_AUTHENTICATED).json({
            message: 'Invalid username or password! please try again'
        })
        return    
    }

    logger.info(`${userLogin.username} has been logged in`)

    res.status(httpCodeStatus.OK).json({
        message: 'User has been logged in', jwt
    })
}