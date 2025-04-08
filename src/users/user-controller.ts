import { Response, Request } from "express";
import { UserService } from "./user-service";
import { httpCodeStatus } from "../httpStatus";
import { CreateUser, UpdateUser, User, UserCrendentials, AuthenticateRequest } from "../interfaces/user-interface";

const userService = new UserService();

// create user
export const creatingUsers = async (req: Request, res: Response) => {
    const createUser = req.body as CreateUser;
    try {
        const userId = await userService.create(createUser);
        res.status(httpCodeStatus.CREATED).json({
            message: 'User has been created', userId
        })
    } catch (error) {
        res.status(httpCodeStatus.NOT_FOUND).json({
            error: (error as Error).message
        })
    }
}

// get all users
export const findAllUsers = async (req: any, res: Response) => {
    const userRoleFromToken = req.jwtPayload?.role;

    if (userRoleFromToken !== 'Admin') {
        res.status(httpCodeStatus.NOT_AUTHORIZED).send(`
            ${userRoleFromToken} isn't allowed to get all users`)
        
        return
    }

    try {
        const userId = await userService.findAllUsers()
        res.status(httpCodeStatus.OK).json(userId)
    }
    catch(error) {
        res.status(httpCodeStatus.NOT_FOUND).json({
            error: (error as Error).message
        })
    }
}

export const findUserById = async (req: AuthenticateRequest, res: Response) => {

    const userIdFromToken = req.jwtPayload?.userId;
    const userInfoToGet = req.params.id;
    const userRoleFromToken = req.jwtPayload?.role

    const isAuthorized = userRoleFromToken === 'Admin' || 
    userIdFromToken === userInfoToGet

    if (!isAuthorized) {
        res.status(httpCodeStatus.NOT_AUTHORIZED).send(`
            ${userIdFromToken} isn't allowed to get information
            about ${userInfoToGet}`)
        return
    }

    try {
        const userInfo = await userService.findUserById(userInfoToGet);

        if (!userInfo) {
            res.status(httpCodeStatus.NOT_FOUND).send(
                `Kunde inte hitta användaren med id: ${userInfoToGet}`
            )
        }
        res.status(httpCodeStatus.OK).json({
            message: 'User has been found', userInfo
        })
    }
    catch (error) {
        res.status(httpCodeStatus.NOT_FOUND).json({
            error: (error as Error).message 
        })
    }
}

// delete user
export const deleteUserById = async (req: AuthenticateRequest, res: Response) => {
    const userIdFromToken = req.jwtPayload?.userId; 
    const userId = req.params.id;
    const userRoleFromToken = req.jwtPayload?.role;
    
    const isAuthorized = userRoleFromToken === 'Admin' || userIdFromToken === userId 

    if(!isAuthorized) {
        res.status(httpCodeStatus.NOT_AUTHORIZED).send(
            `${userIdFromToken} isn't allowed to delete this user: 
            ${userId}`
        )
        return 
    }
    
    try {
        await userService.delete(userId)
        res.status(httpCodeStatus.NO_CONTENT).send(`
            ${userId} has been deleted`)
    } catch (error) {
        res.status(httpCodeStatus.INTERNAL_SERVER_ERROR).send(`
            Something went wrong`)
    }

};

// update user

export const updateUserById = async (req: AuthenticateRequest, res: Response) => {

    const userIdFromToken = req.jwtPayload?.userId;
    const userIdFromParams = req.params.id;
    const updateUser = req.body as UpdateUser

    if(userIdFromParams !== userIdFromToken) {
        res.status(httpCodeStatus.NOT_AUTHORIZED).send(`
            ${userIdFromToken} isn't allowed to update this user:
            ${userIdFromParams}`)
     
        return
    }

    try {
        
        await userService.update(userIdFromParams, updateUser);
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
        console.log(`Couldn't login user with username:
        ${userLogin.username}`);
        res.status(httpCodeStatus.NOT_AUTHENTICATED).json({
            message: 'Invalid username or password! please try again'
        })
        return    
    }

    res.status(httpCodeStatus.OK).json({
        message: 'User has been logged in', jwt
    })
}