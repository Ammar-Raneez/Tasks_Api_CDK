"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const services_1 = require("../services");
const constants_1 = require("../common/constants");
const enums_1 = require("../common/enums");
const handler_1 = require("../common/handler");
const utils_1 = require("../utils");
const getUsers = async (_, res) => {
    utils_1.logger.info('userController - getUsers()');
    try {
        const response = await services_1.userService.fetchAndCacheUsers();
        return (0, handler_1.cb)(enums_1.HTTPSTATUS.OK, res, response);
    }
    catch (error) {
        return (0, handler_1.cbError)(res, enums_1.HTTPSTATUS.INTERNAL_SERVER_ERROR, constants_1.ERRORS.GET_FAILED, error);
    }
};
exports.getUsers = getUsers;
