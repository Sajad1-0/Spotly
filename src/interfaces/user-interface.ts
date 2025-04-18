import { Role } from "../users/user-roles";
import { Request } from "express";

export interface User {
    id: string;
    username: string;
    password: string;
    role: "User" | "Admin";
}

export interface UpdateUser {
    username?: string;
    password: string;
    role?: "User" | "Admin";
}

export interface UserWithoutPassword extends Omit<User, "password"> {}
export interface CreateUser extends Omit<User, "id"> {}
export interface UserCrendentials {
    username: string;
    password: string;
    role: Role;
}

export interface JwtPayload {
    userId: string;
    username: string;
    role: Role
}

export interface AuthenticateRequest extends Request {
    jwtPayload?: JwtPayload
}