"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWSConfig = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const dotenv_1 = __importDefault(require("dotenv"));
const utils_1 = require("../../utils");
dotenv_1.default.config();
const ajv = new ajv_1.default({ allErrors: true });
(0, ajv_formats_1.default)(ajv);
const configSchema = {
    type: 'object',
    properties: {
        REGION: { type: 'string' },
        BUCKET_NAME: { type: 'string' },
    },
    required: ['REGION', 'BUCKET_NAME'],
};
const validate = ajv.compile(configSchema);
exports.AWSConfig = {
    REGION: process.env.REGION,
    BUCKET_NAME: process.env.BUCKET_NAME,
};
if (!validate(exports.AWSConfig)) {
    utils_1.logger.error('Config validation failed:', validate.errors);
    const formattedErrors = validate.errors?.map((error) => `${error.instancePath} ${error.message}`);
    throw new Error(`Invalid configuration:\n${formattedErrors?.join('\n')}`);
}
