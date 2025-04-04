import { UploadedFile } from 'express-fileupload';

import { ITaskDoc } from '../models';

import { CreateTaskDto, UpdateTaskDto } from '../common/dtos/task';

import { logger, ThrowError } from '../utils';
import { taskDao } from '../daos';

import { s3Service } from '.';

export const createTask = async (
  taskData: CreateTaskDto,
  file?: UploadedFile,
): Promise<ITaskDoc> => {
  logger.info('taskService - createTask()');

  try {
    let fileUrl = '';
    let fileKey = '';
    if (file) {
      const upload = await s3Service.uploadFileToS3(file);
      fileUrl = upload.fileUrl;
      fileKey = upload.fileKey;
    }

    const createData = { ...taskData };
    if (fileUrl) {
      createData.fileKey = fileKey;
      createData.fileUrl = fileUrl;
    }

    return await taskDao.createTask(createData);
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

export const updateTask = async (
  id: string,
  taskData: UpdateTaskDto,
  file?: UploadedFile,
): Promise<ITaskDoc> => {
  logger.info('taskService - updateTask()');

  try {
    let fileUrl = '';
    let fileKey = '';
    if (file) {
      const upload = await s3Service.uploadFileToS3(file);
      fileUrl = upload.fileUrl;
      fileKey = upload.fileKey;
    }

    const updateData = { ...taskData };
    if (fileUrl) {
      updateData.fileKey = fileKey;
      updateData.fileUrl = fileUrl;
    }

    return await taskDao.updateTask(id, updateData);
  } catch (error) {
    throw ThrowError(error);
  }
};

export const deleteTask = async (id: string): Promise<ITaskDoc> => {
  logger.info('taskService - deleteTask()');

  try {
    const task = await taskDao.deleteTask(id);
    if (task.fileKey) {
      await s3Service.deleteFile(task.fileKey);
    }

    return task;
  } catch (error) {
    throw ThrowError(error);
  }
};
