"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUtils = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const loggar_1 = require("../utils/loggar");
dotenv_1.default.config();
const secret = process.env.JWT_SECRET;
class AuthUtils {
    async hashPassword(password) {
        const saltRounds = 10;
        return bcrypt_1.default.hash(password, saltRounds);
    }
    async validatePassword(password, hashedPassword) {
        return bcrypt_1.default.compare(password, hashedPassword);
    }
    async generateToken(userId, role, username) {
        const payload = { userId, username, role };
        return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: '60m' });
    }
    async verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, secret);
        }
        catch (error) {
            loggar_1.logger.error(`Jwt verification error: ${error}`);
            return null;
        }
    }
}
exports.AuthUtils = AuthUtils;
