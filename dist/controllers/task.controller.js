"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileUploadUrl = exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getAllTasks = exports.createTask = void 0;
const services_1 = require("../services");
const constants_1 = require("../common/constants");
const enums_1 = require("../common/enums");
const handler_1 = require("../common/handler");
const utils_1 = require("../utils");
const createTask = async (req, res) => {
    utils_1.logger.info('taskController - createTask()');
    try {
        const response = await services_1.taskService.createTask(req.body);
        return (0, handler_1.cb)(enums_1.HTTPSTATUS.CREATED, res, response);
    }
    catch (error) {
        return (0, handler_1.cbError)(res, enums_1.HTTPSTATUS.INTERNAL_SERVER_ERROR, constants_1.ERRORS.CREATE_FAILED, error);
    }
};
exports.createTask = createTask;
const getAllTasks = async (_, res) => {
    utils_1.logger.info('taskController - getAllTasks()');
    try {
        const response = await services_1.taskService.getAllTasks();
        return (0, handler_1.cb)(enums_1.HTTPSTATUS.OK, res, response);
    }
    catch (error) {
        return (0, handler_1.cbError)(res, enums_1.HTTPSTATUS.INTERNAL_SERVER_ERROR, constants_1.ERRORS.GET_FAILED, error);
    }
};
exports.getAllTasks = getAllTasks;
const getTaskById = async (req, res) => {
    utils_1.logger.info('taskController - getTaskById()');
    try {
        const response = await services_1.taskService.getTaskById(req.params.id);
        return (0, handler_1.cb)(enums_1.HTTPSTATUS.OK, res, response);
    }
    catch (error) {
        if (error.message === 'Task not found') {
            return (0, handler_1.cbError)(res, enums_1.HTTPSTATUS.BAD_REQUEST, constants_1.ERRORS.NOT_FOUND, error);
        }
        return (0, handler_1.cbError)(res, enums_1.HTTPSTATUS.INTERNAL_SERVER_ERROR, constants_1.ERRORS.GET_FAILED, error);
    }
};
exports.getTaskById = getTaskById;
const updateTask = async (req, res) => {
    utils_1.logger.info('taskController - updateTask()');
    try {
        const response = await services_1.taskService.updateTask(req.params.id, req.body);
        return (0, handler_1.cb)(enums_1.HTTPSTATUS.OK, res, response);
    }
    catch (error) {
        if (error.message === 'Task not found') {
            return (0, handler_1.cbError)(res, enums_1.HTTPSTATUS.BAD_REQUEST, constants_1.ERRORS.NOT_FOUND, error);
        }
        return (0, handler_1.cbError)(res, enums_1.HTTPSTATUS.INTERNAL_SERVER_ERROR, constants_1.ERRORS.UPDATE_FAILED, error);
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    utils_1.logger.info('taskController - deleteTask()');
    try {
        const task = await services_1.taskService.getTaskById(req.params.id);
        await services_1.taskService.deleteTask(req.params.id);
        if (task.fileKey) {
            await services_1.s3Service.deleteFile(task.fileKey);
        }
        return (0, handler_1.cb)(enums_1.HTTPSTATUS.NO_CONTENT, res, {});
    }
    catch (error) {
        if (error.message === 'Task not found') {
            return (0, handler_1.cbError)(res, enums_1.HTTPSTATUS.BAD_REQUEST, constants_1.ERRORS.NOT_FOUND, error);
        }
        return (0, handler_1.cbError)(res, enums_1.HTTPSTATUS.INTERNAL_SERVER_ERROR, constants_1.ERRORS.DELETE_FAILED, error);
    }
};
exports.deleteTask = deleteTask;
const getFileUploadUrl = async (req, res) => {
    utils_1.logger.info('taskController - getFileUploadUrl()');
    try {
        const { contentType, fileExtension } = req.body;
        if (!contentType || !fileExtension) {
            return (0, handler_1.cb)(enums_1.HTTPSTATUS.BAD_REQUEST, res, {
                message: 'Content type and file extension are required',
            });
        }
        const response = await services_1.s3Service.generatePresignedUrl(contentType, fileExtension);
        return (0, handler_1.cb)(enums_1.HTTPSTATUS.OK, res, response);
    }
    catch (error) {
        return (0, handler_1.cbError)(res, enums_1.HTTPSTATUS.INTERNAL_SERVER_ERROR, constants_1.ERRORS.GET_FAILED, error);
    }
};
exports.getFileUploadUrl = getFileUploadUrl;
