"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cbError = exports.cb = void 0;
const utils_1 = require("../../utils");
const cb = (code, res, responseData, isWrapWithData = true) => {
    let response;
    if (responseData) {
        if (isWrapWithData) {
            response = { data: responseData };
        }
        else {
            response = responseData;
        }
    }
    utils_1.logger.info(response);
    res.status(code).json(response);
};
exports.cb = cb;
const cbError = (res, code, type, error = '') => {
    const errorContent = {
        code,
        key: type.key,
        message: type.message,
        error: error ? JSON.stringify(error, Object.getOwnPropertyNames(error)) : '',
    };
    utils_1.logger.error(errorContent);
    res.status(code).json({ error: errorContent });
};
exports.cbError = cbError;
