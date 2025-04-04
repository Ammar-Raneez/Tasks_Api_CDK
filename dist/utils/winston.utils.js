"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const express_http_context_1 = __importDefault(require("express-http-context"));
const winston_1 = __importDefault(require("winston"));
require("winston-daily-rotate-file");
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.printf(({ level, message, timestamp }) => {
    const userId = express_http_context_1.default.get('userId') || 'anonymous';
    return JSON.stringify({ level, userId, message, timestamp });
}));
const transportOptions = {
    dirname: 'logs',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxFiles: '30d',
};
const infoTransport = new winston_1.default.transports.DailyRotateFile({
    ...transportOptions,
    level: 'info',
    filename: 'info-%DATE%.log',
});
const errorTransport = new winston_1.default.transports.DailyRotateFile({
    ...transportOptions,
    level: 'error',
    filename: 'error-%DATE%.log',
});
const warningTransport = new winston_1.default.transports.DailyRotateFile({
    ...transportOptions,
    level: 'warn',
    filename: 'warning-%DATE%.log',
});
const transports = [infoTransport, errorTransport, warningTransport];
transports.push(new winston_1.default.transports.Console());
exports.logger = winston_1.default.createLogger({
    format: logFormat,
    transports,
});
