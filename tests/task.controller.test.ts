import { Request, Response } from 'express';

import { taskController } from '../src/controllers';
import { taskService } from '../src/services';

import { ERRORS } from '../src/common/constants';
import { HTTPSTATUS } from '../src/common/enums';

jest.mock('../src/services/task.service');
jest.mock('../src/services/s3.service');

describe('Task Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockCb: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockCb = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a task and return 201 status', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Task Description',
        status: 'pending',
      };

      mockRequest.body = taskData;

      const mockedTask = {
        id: '123',
        ...taskData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (taskService.createTask as jest.Mock).mockResolvedValue(mockedTask);

      await taskController.createTask(mockRequest as Request, mockResponse as Response);

      expect(taskService.createTask).toHaveBeenCalledWith(taskData);
      expect(mockResponse.status).toHaveBeenCalledWith(HTTPSTATUS.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: mockedTask,
      });
    });

    it('should return status 500 for invalid body', async () => {
      mockRequest.body = {
        title: 'Test Task',
      };

      const error = {
        code: HTTPSTATUS.INTERNAL_SERVER_ERROR,
        key: ERRORS.CREATE_FAILED.key,
        message: ERRORS.CREATE_FAILED.message,
        error: expect.any(String),
      };

      (taskService.createTask as jest.Mock).mockRejectedValue(error);

      await taskController.createTask(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(HTTPSTATUS.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: expect.objectContaining({
          ...error,
        }),
      });
    });
  });

  describe('getTaskById', () => {
    it('should return a task by id with 200 status', async () => {
      const taskId = '123';
      const mockedTask = {
        id: taskId,
        title: 'Test Task',
        description: 'Task Description',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { id: taskId };

      (taskService.getTaskById as jest.Mock).mockResolvedValue(mockedTask);

      await taskController.getTaskById(mockRequest as Request, mockResponse as Response);

      expect(taskService.getTaskById).toHaveBeenCalledWith(taskId);
      expect(mockResponse.status).toHaveBeenCalledWith(HTTPSTATUS.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: mockedTask,
      });
    });
  });
});
