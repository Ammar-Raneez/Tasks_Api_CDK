"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDBLoader = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../common/config");
const utils_1 = require("../utils");
class MongoDBLoader {
    constructor() {
        this.connection = null;
        this.load();
    }
    static getInstance() {
        if (!MongoDBLoader.instance) {
            MongoDBLoader.instance = new MongoDBLoader();
        }
        return MongoDBLoader.instance;
    }
    getMongoInstance() {
        return this.connection;
    }
    async load() {
        const { DB_URI } = config_1.DBConfig;
        try {
            this.connection = await mongoose_1.default.connect(DB_URI);
            utils_1.logger.info('✅ MongoDB connected successfully');
        }
        catch (error) {
            utils_1.logger.error('❌ Failed to connect to MongoDB', error);
            throw error;
        }
    }
}
exports.MongoDBLoader = MongoDBLoader;
MongoDBLoader.instance = null;
