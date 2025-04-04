import { Router } from 'express';

import { taskController } from '../controllers';

import { createTaskDtoSchema, updateTaskDtoSchema } from '../common/dtos';
import { ValidateRequest } from '../common/middlewares';

const router = Router();

router.post('/', ValidateRequest(createTaskDtoSchema), taskController.createTask);
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.put('/:id', ValidateRequest(updateTaskDtoSchema), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.post('/upload-url', taskController.getFileUploadUrl);

export default router;
