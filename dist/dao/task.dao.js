"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getAllTasks = exports.createTask = void 0;
const models_1 = require("../models");
const utils_1 = require("../utils");
const createTask = async (taskData) => {
    utils_1.logger.info('taskDao - createTask()');
    try {
        const task = new models_1.Task(taskData);
        await task.save();
        return task;
    }
    catch (error) {
        utils_1.logger.error('Error in creating task', error);
        throw error;
    }
};
exports.createTask = createTask;
const getAllTasks = async () => {
    utils_1.logger.info('taskDao - getAllTasks()');
    try {
        return await models_1.Task.find().sort({ createdAt: -1 });
    }
    catch (error) {
        utils_1.logger.error('Error in getting tasks', error);
        throw error;
    }
};
exports.getAllTasks = getAllTasks;
const getTaskById = async (id) => {
    utils_1.logger.info('taskDao - getTaskById()');
    try {
        const task = await models_1.Task.findById(id);
        if (!task) {
            throw (0, utils_1.ThrowError)('Task not found');
        }
        return task;
    }
    catch (error) {
        utils_1.logger.error(`Error in getting task: ${id}`, error);
        throw error;
    }
};
exports.getTaskById = getTaskById;
const updateTask = async (id, taskData) => {
    utils_1.logger.info('taskDao - updateTask()');
    try {
        const task = await models_1.Task.findByIdAndUpdate(id, taskData, {
            new: true,
            runValidators: true,
        });
        if (!task) {
            throw (0, utils_1.ThrowError)('Task not found');
        }
        return task;
    }
    catch (error) {
        utils_1.logger.error(`Error in updating task: ${id}`, error);
        throw error;
    }
};
exports.updateTask = updateTask;
const deleteTask = async (id) => {
    utils_1.logger.info('taskDao - deleteTask()');
    try {
        const task = await models_1.Task.findByIdAndDelete(id);
        if (!task) {
            throw (0, utils_1.ThrowError)('Task not found');
        }
    }
    catch (error) {
        utils_1.logger.error(`Error in deleting task: ${id}`, error);
        throw error;
    }
};
exports.deleteTask = deleteTask;
