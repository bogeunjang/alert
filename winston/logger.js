const winston = require("winston");
const winstonDaily = require("winston-daily-rotate-file");
const appRoot = require("app-root-path");
const { createLogger } = require("winston");
const process = require("process");

const logDir = `${appRoot}/logs`;

const { combine, timestamp, label, printf } = winston.format;

const logFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
})

const logger = createLogger({
    format: combine(label({ label: "NODE_PROJECT" }), timestamp(), logFormat),
    transports: [
        new winstonDaily({
            level:"info",
            datePattern: "YYYY-MM-DD",
            dirname: logDir,
            filename: "%DATE%.log",
            maxSize: "20m",
            maxFiles: "30d",
        }),
        new winstonDaily({
            level: "error",
            datePattern: "YYYY-MM-DD",
            dirname: logDir,
            filename: "%DATE%.error.log",
            maxSize: "20m",
            maxFiles: "30d",
        })
    ]
})

module.exports = logger;