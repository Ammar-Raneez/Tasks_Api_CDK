"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskDtoSchema = void 0;
const enums_1 = require("../../enums");
exports.updateTaskDtoSchema = {
    type: 'object',
    properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        status: { type: 'string', enum: Object.values(enums_1.TASKSTATUS) },
        fileUrl: { type: 'string' },
        fileKey: { type: 'string' },
    },
    additionalProperties: false,
};
