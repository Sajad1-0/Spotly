import { Role } from "../users/user-roles";
import { Request } from "express";

export interface User {
    id: string;
    username: string;
    password: string;
    role: "User" | "Admin";
}

export interface updateUser {
    username?: string;
    password: string;
    role?: "User" | "Admin";
}

export interface userWithoutPassword extends Omit<User, "password"> {}
export interface createUser extends Omit<User, "id"> {}
export interface userCrendentials {
    username: string;
    password: string;
    role: Role;
}

export interface jwtPayload {
    userId: string;
    username: string;
    role: Role
}

export interface authenticateRequest extends Request {
    jwtPayload?: jwtPayload
}