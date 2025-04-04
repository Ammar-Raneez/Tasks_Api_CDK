import mongoose, { Document, Schema } from 'mongoose';

import { TASKSTATUS } from '../common/enums';

export interface ITaskDoc extends Document {
  title: string;
  description: string;
  status: TASKSTATUS;
  fileUrl?: string;
  fileKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(TASKSTATUS),
      default: TASKSTATUS.PENDING,
    },
    fileUrl: {
      type: String,
      required: false,
    },
    fileKey: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    id: true,
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

export const Task = mongoose.model<ITaskDoc>('Task', TaskSchema);
