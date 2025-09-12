import winston from 'winston'
import {configuration} from "../config/timeControlConfig.js";

export const logger = winston.createLogger({
    level: configuration.logLevel,
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'errorWinston.log', level: 'error'}),
        new winston.transports.File({filename: 'combine.log'}),
    ]

})

export const loggerV2 = winston.createLogger({
    level: configuration.logLevel,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(({level, message, timestamp}) => `[${timestamp}] ${level} : ${message}`)
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'errorWinston.log', level: 'error'}),
        new winston.transports.File({filename: 'combine.log'}),
    ]
})