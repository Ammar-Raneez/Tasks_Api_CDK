import { TASKSTATUS } from '../../enums';

export const updateTaskDtoSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    status: { type: 'string', enum: Object.values(TASKSTATUS) },
    fileUrl: { type: 'string' },
    fileKey: { type: 'string' },
  },
  additionalProperties: false,
};

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TASKSTATUS;
  fileUrl?: string;
  fileKey?: string;
}
