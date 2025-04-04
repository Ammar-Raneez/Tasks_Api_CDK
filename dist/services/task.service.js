"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getAllTasks = exports.createTask = void 0;
const utils_1 = require("../utils");
const dao_1 = require("../dao");
const createTask = async (taskData) => {
    utils_1.logger.info('taskService - createTask()');
    try {
        return await dao_1.taskDao.createTask(taskData);
    }
    catch (error) {
        throw (0, utils_1.ThrowError)(error);
    }
};
exports.createTask = createTask;
const getAllTasks = async () => {
    utils_1.logger.info('taskService - getAllTasks()');
    try {
        return await dao_1.taskDao.getAllTasks();
    }
    catch (error) {
        throw (0, utils_1.ThrowError)(error);
    }
};
exports.getAllTasks = getAllTasks;
const getTaskById = async (id) => {
    utils_1.logger.info('taskService - getTaskById()');
    try {
        return await dao_1.taskDao.getTaskById(id);
    }
    catch (error) {
        throw (0, utils_1.ThrowError)(error);
    }
};
exports.getTaskById = getTaskById;
const updateTask = async (id, taskData) => {
    utils_1.logger.info('taskService - updateTask()');
    try {
        return await dao_1.taskDao.updateTask(id, taskData);
    }
    catch (error) {
        throw (0, utils_1.ThrowError)(error);
    }
};
exports.updateTask = updateTask;
const deleteTask = async (id) => {
    utils_1.logger.info('taskService - deleteTask()');
    try {
        return await dao_1.taskDao.deleteTask(id);
    }
    catch (error) {
        throw (0, utils_1.ThrowError)(error);
    }
};
exports.deleteTask = deleteTask;
