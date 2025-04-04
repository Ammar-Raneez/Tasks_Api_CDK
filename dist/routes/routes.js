"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetRoutes = SetRoutes;
const express_1 = require("express");
const task_routes_1 = __importDefault(require("./task.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const constants_1 = require("../common/constants");
const config_1 = require("../common/config");
const enums_1 = require("../common/enums");
const handler_1 = require("../common/handler");
async function SetRoutes(app) {
    const apiRouter = (0, express_1.Router)();
    app.use('/health', (_, res) => {
        return (0, handler_1.cb)(enums_1.HTTPSTATUS.OK, res, {
            status: 'OK',
            version: config_1.AppConfig.APP_VERSION,
        });
    });
    app.use('/api', apiRouter);
    apiRouter.use(`/${constants_1.APIS.TASKS}`, task_routes_1.default);
    apiRouter.use(`/${constants_1.APIS.USERS}`, user_routes_1.default);
    app.use((req, res) => {
        return (0, handler_1.cbError)(res, enums_1.HTTPSTATUS.NOT_FOUND, constants_1.ERRORS.API_NOT_FOUND, { endPoint: req.path });
    });
}
