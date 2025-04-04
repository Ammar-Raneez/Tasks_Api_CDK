"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskDtoSchema = void 0;
const enums_1 = require("../../enums");
exports.createTaskDtoSchema = {
    type: 'object',
    properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        status: { type: 'string', enum: Object.values(enums_1.TASKSTATUS) },
        fileUrl: { type: 'string' },
        fileKey: { type: 'string' },
    },
    required: ['title', 'description'],
    additionalProperties: false,
};
