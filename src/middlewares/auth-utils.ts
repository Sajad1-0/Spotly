import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { JwtPayload } from '../interfaces/user-interface';
import { Role } from '../users/user-roles';
import { logger } from '../utils/loggar';

dotenv.config();

const secret = process.env.JWT_SECRET!;

export class AuthUtils {
    async hashPassword(password: string) {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }

    async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword)
    }

    async generateToken(userId: string, role: Role, username: string): Promise<string> {
        const payload = { userId, username, role};
        return jwt.sign(payload, secret, {expiresIn: '60m'});
    }


    async verifyToken(token: string): Promise<JwtPayload | null> {
        try {
            return jwt.verify(token, secret) as JwtPayload;
        } catch (error) {
            logger.error(`Jwt verification error: ${error}`);
            return null
        }
    }
}