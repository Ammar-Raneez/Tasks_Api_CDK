"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThrowError = ThrowError;
const winston_utils_1 = require("./winston.utils");
function ThrowError(error) {
    winston_utils_1.logger.error(error.toString());
    return error;
}
