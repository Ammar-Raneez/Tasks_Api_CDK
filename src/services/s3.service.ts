import { UploadedFile } from 'express-fileupload';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

import { AWSConfig } from '../common/config';
import { IS3UploadUrl } from '../common/interfaces';

import { logger, ThrowError } from '../utils';

AWS.config.update({
  region: AWSConfig.REGION,
});

const s3 = new AWS.S3();

export const uploadFileToS3 = async (file: UploadedFile): Promise<IS3UploadUrl> => {
  const fileExtension = file.name.split('.').pop();
  const fileKey = `${uuidv4()}.${fileExtension}`;

  const params = {
    Bucket: AWSConfig.BUCKET_NAME!,
    Key: fileKey,
    Body: file.data,
    ContentType: file.mimetype,
  };

  await s3.putObject(params).promise();

  const fileUrl = `${AWSConfig.CLOUDFRONT_DISTRIBUTION}/${fileKey}`;

  return {
    fileKey,
    fileUrl,
  };
};

export const deleteFile = async (fileKey: string): Promise<void> => {
  logger.info('s3Service - deleteFile()');

  try {
    const bucketName = AWSConfig.BUCKET_NAME;
    if (bucketName) {
      const params = {
        Bucket: bucketName,
        Key: fileKey,
      };

      await s3.deleteObject(params).promise();
    }
  } catch (error) {
    throw ThrowError(`Error deleting file from S3: ${(error as Error).message}`);
  }
};
