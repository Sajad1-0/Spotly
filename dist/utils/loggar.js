"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const { combine, timestamp, printf, colorize, prettyPrint } = winston_1.format;
const logFormat = printf(({ level, message, timestamp }) => {
    return `[${timestamp} ${level}: ${message}]`;
});
const dailyRotateTransport = new winston_daily_rotate_file_1.default({
    filename: 'logs/combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '30d',
    level: 'info'
});
const errorRotateTransport = new winston_daily_rotate_file_1.default({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '30d',
    level: 'error'
});
exports.logger = (0, winston_1.createLogger)({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), colorize(), prettyPrint(), logFormat),
    transports: [
        new winston_1.transports.Console({ format: combine(colorize(), logFormat) }),
        dailyRotateTransport,
        errorRotateTransport,
    ]
});
