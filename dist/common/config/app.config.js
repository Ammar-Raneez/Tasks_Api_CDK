"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfig = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const dotenv_1 = __importDefault(require("dotenv"));
const constants_1 = require("../constants");
const utils_1 = require("../../utils");
dotenv_1.default.config();
const ajv = new ajv_1.default({ allErrors: true });
(0, ajv_formats_1.default)(ajv);
const configSchema = {
    type: 'object',
    properties: {
        APP_ENV: {
            type: 'string',
            enum: [constants_1.ENVIRONMENTS.DEV, constants_1.ENVIRONMENTS.STAGING, constants_1.ENVIRONMENTS.PRODUCTION],
        },
        APP_PORT: { type: 'string' },
        APP_VERSION: { type: 'string' },
        CACHE_TTL: { type: 'string' },
        EXTERNAL_API: { type: 'string' },
    },
    required: ['APP_ENV', 'APP_PORT', 'APP_VERSION', 'CACHE_TTL', 'EXTERNAL_API'],
};
const validate = ajv.compile(configSchema);
exports.AppConfig = {
    APP_ENV: process.env.APP_ENV,
    APP_PORT: process.env.APP_PORT,
    APP_VERSION: process.env.APP_VERSION,
    CACHE_TTL: process.env.CACHE_TTL,
    EXTERNAL_API: process.env.EXTERNAL_API,
};
if (!validate(exports.AppConfig)) {
    utils_1.logger.error('Config validation failed:', validate.errors);
    const formattedErrors = validate.errors?.map((error) => `${error.instancePath} ${error.message}`);
    throw new Error(`Invalid configuration:\n${formattedErrors?.join('\n')}`);
}
