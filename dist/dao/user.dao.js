"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAndCacheUsers = void 0;
const axios_1 = __importDefault(require("axios"));
const models_1 = require("../models");
const config_1 = require("../common/config");
const utils_1 = require("../utils");
const fetchAndCacheUsers = async () => {
    utils_1.logger.info('userDao - fetchAndCacheUsers()');
    try {
        const cachedUsers = await models_1.User.find({
            cachedAt: { $gt: new Date(Date.now() - parseInt(config_1.AppConfig.CACHE_TTL || '0') * 1000) },
        });
        if (cachedUsers.length > 0) {
            return cachedUsers;
        }
        const response = await axios_1.default.get(`${config_1.AppConfig.EXTERNAL_API}/users`);
        await models_1.User.deleteMany({});
        const usersToSave = response.data.map((user) => ({
            externalId: user.id,
            name: user.name,
            email: user.email,
            cachedAt: new Date(),
        }));
        return await models_1.User.insertMany(usersToSave);
    }
    catch (error) {
        utils_1.logger.error('Error in fetching users', error);
        throw error;
    }
};
exports.fetchAndCacheUsers = fetchAndCacheUsers;
