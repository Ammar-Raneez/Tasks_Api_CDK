"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.generatePresignedUrl = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const uuid_1 = require("uuid");
const config_1 = require("../common/config");
const utils_1 = require("../utils");
aws_sdk_1.default.config.update({
    region: config_1.AWSConfig.REGION,
});
const s3 = new aws_sdk_1.default.S3();
const generatePresignedUrl = async (contentType, fileExtension) => {
    utils_1.logger.info('s3Service - generatePresignedUrl()');
    try {
        const fileKey = `${(0, uuid_1.v4)()}.${fileExtension}`;
        const params = {
            Bucket: config_1.AWSConfig.BUCKET_NAME,
            Key: fileKey,
            ContentType: contentType,
            Expires: 300,
        };
        const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
        const fileUrl = `https://${config_1.AWSConfig.BUCKET_NAME}.s3.${config_1.AWSConfig.REGION}.amazonaws.com/${fileKey}`;
        return {
            uploadUrl,
            fileKey,
            fileUrl,
        };
    }
    catch (error) {
        throw (0, utils_1.ThrowError)(`Error generating presigned URL: ${error.message}`);
    }
};
exports.generatePresignedUrl = generatePresignedUrl;
const deleteFile = async (fileKey) => {
    utils_1.logger.info('s3Service - deleteFile()');
    try {
        const bucketName = config_1.AWSConfig.BUCKET_NAME;
        if (bucketName) {
            const params = {
                Bucket: bucketName,
                Key: fileKey,
            };
            await s3.deleteObject(params).promise();
        }
    }
    catch (error) {
        throw (0, utils_1.ThrowError)(`Error deleting file from S3: ${error.message}`);
    }
};
exports.deleteFile = deleteFile;
