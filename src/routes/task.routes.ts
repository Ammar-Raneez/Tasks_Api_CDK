import { Router } from 'express';
import fileUpload from 'express-fileupload';

import { taskController } from '../controllers';

import { createTaskDtoSchema, updateTaskDtoSchema } from '../common/dtos';
import { ValidateRequest } from '../common/middlewares';

const router = Router();

router.post('/', fileUpload(), ValidateRequest(createTaskDtoSchema), taskController.createTask);
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.put('/:id', fileUpload(), ValidateRequest(updateTaskDtoSchema), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;
