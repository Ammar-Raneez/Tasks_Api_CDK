import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

import { AWSConfig } from '../common/config';
import { IS3UploadUrl } from '../common/interfaces';

import { logger, ThrowError } from '../utils';

AWS.config.update({
  region: AWSConfig.REGION,
});

const s3 = new AWS.S3();

export const generatePresignedUrl = async (
  contentType: string,
  fileExtension: string,
): Promise<IS3UploadUrl> => {
  logger.info('s3Service - generatePresignedUrl()');

  try {
    const fileKey = `${uuidv4()}.${fileExtension}`;
    const params = {
      Bucket: AWSConfig.BUCKET_NAME,
      Key: fileKey,
      ContentType: contentType,
      Expires: 300,
    };

    const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
    const fileUrl = `https://${AWSConfig.BUCKET_NAME}.s3.${AWSConfig.REGION}.amazonaws.com/${fileKey}`;

    return {
      uploadUrl,
      fileKey,
      fileUrl,
    };
  } catch (error) {
    throw ThrowError(`Error generating presigned URL: ${(error as Error).message}`);
  }
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
