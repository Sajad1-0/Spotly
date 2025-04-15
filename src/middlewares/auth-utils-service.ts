import { AuthUtils } from "./auth-utils";
import { httpCodeStatus } from "../httpStatus";
import { Request, Response, NextFunction } from "express";
import { authenticateRequest } from "../interfaces/user-interface";
import { logger } from "../utils/loggar";

const authUtils = new AuthUtils();

export const authenticateToken = async (
    req: authenticateRequest, res: Response, next: NextFunction): Promise <any> => {
        const token = req.headers.authorization?.split(' ')[1]; 

        if(!token) return next();
        
        const payload = await authUtils.verifyToken(token);

        if(!payload || !payload.userId) {
            
            logger.error('Invalid Token for the User')
            return res.status(httpCodeStatus.NOT_AUTHENTICATED).send('Invalid token');
        } 
        
        req.jwtPayload = payload

        next();
    } 