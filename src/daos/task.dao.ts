import { Task, ITaskDoc } from '../models';

import { CreateTaskDto, UpdateTaskDto } from '../common/dtos/task';

import { logger, ThrowError } from '../utils';

export const createTask = async (taskData: CreateTaskDto): Promise<ITaskDoc> => {
  logger.info('taskDao - createTask()');

  try {
    const task = new Task(taskData);
    await task.save();
    return task;
  } catch (error) {
    logger.error('Error in creating task', error);
    throw error;
  }
};

export const getAllTasks = async (): Promise<ITaskDoc[]> => {
  logger.info('taskDao - getAllTasks()');

  try {
    return await Task.find().sort({ createdAt: -1 });
  } catch (error) {
    logger.error('Error in getting tasks', error);
    throw error;
  }
};

export const getTaskById = async (id: string): Promise<ITaskDoc> => {
  logger.info('taskDao - getTaskById()');

  try {
    const task = await Task.findById(id);
    if (!task) {
      throw ThrowError('Task not found');
    }

    return task;
  } catch (error) {
    logger.error(`Error in getting task: ${id}`, error);
    throw error;
  }
};

export const updateTask = async (id: string, taskData: UpdateTaskDto): Promise<ITaskDoc> => {
  logger.info('taskDao - updateTask()');

  try {
    const task = await Task.findByIdAndUpdate(id, taskData, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      throw ThrowError('Task not found');
    }

    return task;
  } catch (error) {
    logger.error(`Error in updating task: ${id}`, error);
    throw error;
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  logger.info('taskDao - deleteTask()');

  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      throw ThrowError('Task not found');
    }
  } catch (error) {
    logger.error(`Error in deleting task: ${id}`, error);
    throw error;
  }
};
