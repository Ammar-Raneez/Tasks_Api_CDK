"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAndCacheUsers = void 0;
const utils_1 = require("../utils");
const dao_1 = require("../dao");
const fetchAndCacheUsers = async () => {
    utils_1.logger.info('userService - fetchAndCacheUsers()');
    try {
        return await dao_1.userDao.fetchAndCacheUsers();
    }
    catch (error) {
        throw (0, utils_1.ThrowError)(error);
    }
};
exports.fetchAndCacheUsers = fetchAndCacheUsers;
