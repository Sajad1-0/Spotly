"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const user_roles_1 = require("../users/user-roles");
const httpStatus_1 = require("../httpStatus");
const loggar_1 = require("../utils/loggar");
const authorize = (requiredPermissions) => {
    return (req, res, next) => {
        // detta gör att man kan registrera sig utan att behöva en jwt
        const { role, username } = req.jwtPayload || {};
        if (!role) {
            loggar_1.logger.error(`Someone tried to do some staff at system without
                    beeing authenticated`);
            res.status(httpStatus_1.httpCodeStatus.NOT_AUTHENTICATED)
                .send('User is not authenticated');
            return;
        }
        if (role === user_roles_1.Role.Admin) {
            loggar_1.logger.info(`Admin: ${username} is online in the system`);
            console.log('User is and Admin, skip authentication');
            next();
            return;
        }
        const userPermissions = user_roles_1.ROLES_WITH_PERMISSIONS[role];
        if (!userPermissions) {
            res.status(httpStatus_1.httpCodeStatus.NOT_AUTHORIZED)
                .send('User missing permission');
            return;
        }
        const hasRequiredPermission = requiredPermissions
            .every((permission) => userPermissions.includes(permission));
        if (!hasRequiredPermission) {
            res.status(httpStatus_1.httpCodeStatus.NOT_AUTHORIZED)
                .send('Permission denied');
            return;
        }
        next();
    };
};
exports.authorize = authorize;
