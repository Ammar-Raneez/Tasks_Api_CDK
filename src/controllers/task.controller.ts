import { Request, Response } from 'express';

import { s3Service, taskService } from '../services';

import { ERRORS } from '../common/constants';
import { HTTPSTATUS } from '../common/enums';
import { cb, cbError } from '../common/handler';

import { logger } from '../utils';

export const createTask = async (req: Request, res: Response) => {
  logger.info('taskController - createTask()');

  try {
    const response = await taskService.createTask(req.body);
    return cb(HTTPSTATUS.CREATED, res, response);
  } catch (error) {
    return cbError(res, HTTPSTATUS.INTERNAL_SERVER_ERROR, ERRORS.CREATE_FAILED, error);
  }
};

export const getAllTasks = async (_: Request, res: Response) => {
  logger.info('taskController - getAllTasks()');

  try {
    const response = await taskService.getAllTasks();
    return cb(HTTPSTATUS.OK, res, response);
  } catch (error) {
    return cbError(res, HTTPSTATUS.INTERNAL_SERVER_ERROR, ERRORS.GET_FAILED, error);
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  logger.info('taskController - getTaskById()');

  try {
    const response = await taskService.getTaskById(req.params.id);
    return cb(HTTPSTATUS.OK, res, response);
  } catch (error) {
    if ((error as Error).message === 'Task not found') {
      return cbError(res, HTTPSTATUS.BAD_REQUEST, ERRORS.NOT_FOUND, error);
    }

    return cbError(res, HTTPSTATUS.INTERNAL_SERVER_ERROR, ERRORS.GET_FAILED, error);
  }
};

export const updateTask = async (req: Request, res: Response) => {
  logger.info('taskController - updateTask()');

  try {
    const response = await taskService.updateTask(req.params.id, req.body);
    return cb(HTTPSTATUS.OK, res, response);
  } catch (error) {
    if ((error as Error).message === 'Task not found') {
      return cbError(res, HTTPSTATUS.BAD_REQUEST, ERRORS.NOT_FOUND, error);
    }

    return cbError(res, HTTPSTATUS.INTERNAL_SERVER_ERROR, ERRORS.UPDATE_FAILED, error);
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  logger.info('taskController - deleteTask()');

  try {
    const task = await taskService.getTaskById(req.params.id);

    await taskService.deleteTask(req.params.id);

    if (task.fileKey) {
      await s3Service.deleteFile(task.fileKey);
    }

    return cb(HTTPSTATUS.NO_CONTENT, res, {});
  } catch (error) {
    if ((error as Error).message === 'Task not found') {
      return cbError(res, HTTPSTATUS.BAD_REQUEST, ERRORS.NOT_FOUND, error);
    }

    return cbError(res, HTTPSTATUS.INTERNAL_SERVER_ERROR, ERRORS.DELETE_FAILED, error);
  }
};

export const getFileUploadUrl = async (req: Request, res: Response) => {
  logger.info('taskController - getFileUploadUrl()');

  try {
    const { contentType, fileExtension } = req.body;

    if (!contentType || !fileExtension) {
      return cb(HTTPSTATUS.BAD_REQUEST, res, {
        message: 'Content type and file extension are required',
      });
    }

    const response = await s3Service.generatePresignedUrl(contentType, fileExtension);
    return cb(HTTPSTATUS.OK, res, response);
  } catch (error) {
    return cbError(res, HTTPSTATUS.INTERNAL_SERVER_ERROR, ERRORS.GET_FAILED, error);
  }
};
