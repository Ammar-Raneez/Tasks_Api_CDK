import { ITaskDoc } from '../models';

import { CreateTaskDto, UpdateTaskDto } from '../common/dtos/task';

import { logger, ThrowError } from '../utils';
import { taskDao } from '../dao';

export const createTask = async (taskData: CreateTaskDto): Promise<ITaskDoc> => {
  logger.info('taskService - createTask()');

  try {
    return await taskDao.createTask(taskData);
  } catch (error) {
    throw ThrowError(error);
  }
};

export const getAllTasks = async (): Promise<ITaskDoc[]> => {
  logger.info('taskService - getAllTasks()');

  try {
    return await taskDao.getAllTasks();
  } catch (error) {
    throw ThrowError(error);
  }
};

export const getTaskById = async (id: string): Promise<ITaskDoc> => {
  logger.info('taskService - getTaskById()');

  try {
    return await taskDao.getTaskById(id);
  } catch (error) {
    throw ThrowError(error);
  }
};

export const updateTask = async (id: string, taskData: UpdateTaskDto): Promise<ITaskDoc> => {
  logger.info('taskService - updateTask()');

  try {
    return await taskDao.updateTask(id, taskData);
  } catch (error) {
    throw ThrowError(error);
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  logger.info('taskService - deleteTask()');

  try {
    return await taskDao.deleteTask(id);
  } catch (error) {
    throw ThrowError(error);
  }
};
