import { TASKSTATUS } from '../../enums';

export const createTaskDtoSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    status: { type: 'string', enum: Object.values(TASKSTATUS) },
    fileUrl: { type: 'string' },
    fileKey: { type: 'string' },
  },
  required: ['title', 'description'],
  additionalProperties: false,
};

export interface CreateTaskDto {
  title: string;
  description: string;
  status?: TASKSTATUS;
  fileUrl?: string;
  fileKey?: string;
}
