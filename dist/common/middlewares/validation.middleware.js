"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateRequest = ValidateRequest;
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const constants_1 = require("../constants");
const enums_1 = require("../enums");
const handler_1 = require("../handler");
function createAjvInstance() {
    const ajv = new ajv_1.default();
    (0, ajv_formats_1.default)(ajv);
    ajv.addFormat('date', {
        type: 'string',
        validate: /^\d{4}-\d{2}-\d{2}$/,
    });
    ajv.addFormat('time', {
        type: 'string',
        validate: /^\d{2}:\d{2}$/,
    });
    ajv.addFormat('year', {
        type: 'string',
        validate: /^(19|20)\d{2}$/,
    });
    ajv.addFormat('month', {
        type: 'string',
        validate: /^(0[1-9]|1[0-2])$/,
    });
    ajv.addFormat('iso-timestamp', {
        type: 'string',
        validate: /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z?$/,
    });
    return ajv;
}
function ValidateRequest(schema) {
    const ajv = createAjvInstance();
    return (req, res, next) => {
        const isValid = ajv.validate(schema, req.body);
        if (!isValid || Object.keys(req.body).length === 0) {
            return (0, handler_1.cbError)(res, enums_1.HTTPSTATUS.BAD_REQUEST, constants_1.ERRORS.BAD_REQUEST, ajv.errorsText(ajv.errors, { separator: '\n' }));
        }
        next();
    };
}
