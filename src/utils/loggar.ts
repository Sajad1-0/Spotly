import {createLogger, format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file';

const {combine, timestamp, printf, colorize, prettyPrint } = format;

const logFormat = printf(({level, message, timestamp}) => {
    return `[${timestamp} ${level}: ${message}]`
})

const dailyRotateTransport = new DailyRotateFile({
    filename: 'logs/combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '30d',
    level: 'info'
})

const errorRotateTransport = new DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '30d',
    level: 'error'
})

export const logger = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        colorize(),
        prettyPrint(),
        logFormat
    ),
    transports: [
        new transports.Console({ format: combine(colorize(), logFormat) }),
        dailyRotateTransport,
        errorRotateTransport,
    ]
})