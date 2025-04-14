"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const auth_utils_1 = require("./auth-utils");
const httpStatus_1 = require("../httpStatus");
const loggar_1 = require("../utils/loggar");
const authUtils = new auth_utils_1.AuthUtils();
const authenticateToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token)
        return next();
    const payload = await authUtils.verifyToken(token);
    if (!payload || !payload.userId) {
        loggar_1.logger.error('Invalid Token for the User');
        return res.status(httpStatus_1.httpCodeStatus.NOT_AUTHENTICATED).send('Invalid token');
    }
    req.jwtPayload = payload;
    next();
};
exports.authenticateToken = authenticateToken;
