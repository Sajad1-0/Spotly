import { Role, Permission, ROLES_WITH_PERMISSIONS } from "../users/user-roles";
import { Response, NextFunction } from "express";
import { httpCodeStatus } from "../httpStatus";
import { JwtPayload } from "../interfaces/user-interface";
import { logger } from "../utils/loggar";


export const authorize = (requiredPermissions: Permission[]) => {
    return (req: any, res: Response, 
        next: NextFunction): void => {
    
            const { role, username } = req.jwtPayload as JwtPayload;
            
            if(!role) {

                logger.error(`Someone tried to do some staff at system withoutv
                    beeing authenticated`)
                res.status(httpCodeStatus.NOT_AUTHENTICATED)
                .send('User is not authenticated');
                return
            }

            if(role === Role.Admin) {

                logger.info(`Admin: ${username} is online in the system`)
                
                console.log('User is and Admin, skip authentication')
                next()
                return
            }

            const userPermissions = ROLES_WITH_PERMISSIONS[role]

            if(!userPermissions) {
                res.status(httpCodeStatus.NOT_AUTHORIZED)
                .send('User missing permission')
                return
            }

            const hasRequiredPermission = requiredPermissions
            .every((permission) => userPermissions.includes(permission))

            if(!hasRequiredPermission) {
                res.status(httpCodeStatus.NOT_AUTHORIZED)
                .send('Permission denied')
                return
            }
            
        next()
    }
}