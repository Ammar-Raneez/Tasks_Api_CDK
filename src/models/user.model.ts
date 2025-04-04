import mongoose, { Document, Schema } from 'mongoose';

export interface IUserDoc extends Document {
  externalId: number;
  name: string;
  email: string;
  cachedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    externalId: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    cachedAt: {
      type: Date,
      default: Date.now,
      expires: 300,
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model<IUserDoc>('User', UserSchema);
