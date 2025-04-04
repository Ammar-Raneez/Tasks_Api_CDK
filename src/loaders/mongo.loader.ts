import mongoose, { Mongoose } from 'mongoose';

import { DBConfig } from '../common/config';

import { logger } from '../utils';

export class MongoDBLoader {
  private static instance: MongoDBLoader | null = null;
  private connection: Mongoose | null = null;

  private constructor() {
    this.load();
  }

  public static getInstance(): MongoDBLoader {
    if (!MongoDBLoader.instance) {
      MongoDBLoader.instance = new MongoDBLoader();
    }

    return MongoDBLoader.instance;
  }

  public getMongoInstance(): Mongoose | null {
    return this.connection;
  }

  private async load(): Promise<void> {
    const { DB_URI } = DBConfig;

    try {
      this.connection = await mongoose.connect(DB_URI);
      logger.info('✅ MongoDB connected successfully');
    } catch (error) {
      logger.error('❌ Failed to connect to MongoDB', error);
      throw error;
    }
  }
}
