import busboy from 'busboy';
import { NextFunction, Request, Response } from 'express';

import logger from '../config/logger';
import APIError from '../utils/APIError';
import cloudinary from '../config/cloudinary';
import { CloudinaryFile, UploadOptions } from '../types/cloudinary.types';

const uploadToCloud = (options: UploadOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers['content-type']?.includes('multipart/form-data'))
      return next();

    const bb = busboy({
      headers: req.headers,
      limits: {
        fileSize: 30 * 1024 * 1024, // 30MB
      },
    });

    const uploadPromises: Promise<CloudinaryFile>[] = [];
    const formFields: Record<string, any> = {};

    bb.on('field', (name, value) => {
      if (formFields[name]) {
        if (!Array.isArray(formFields[name]))
          formFields[name] = [formFields[name], value];

        formFields[name].push(value);
      } else formFields[name] = value;
    });

    bb.on('file', (name, stream, info) => {
      const { mimeType } = info;

      if (!mimeType.startsWith('image')) {
        stream.resume(); // https://github.com/mscdex/busboy?tab=readme-ov-file#readme
        return next(new APIError('Unsupported file format', 400));
      }

      const uploadPromise = new Promise<CloudinaryFile>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: options.folder,
            public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
            resource_type: 'auto',
            quality: 'auto',
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                fieldname: name,
                secure_url: result!.secure_url,
                public_id: result!.public_id,
              });
            }
          }
        );

        stream.pipe(uploadStream);
      });

      uploadPromises.push(uploadPromise);
    });

    bb.on('finish', async () => {
      try {
        const results = await Promise.all(uploadPromises);

        // Need to populate req.body with form fields
        req.body = formFields;

        if (results.length === 0) {
          req.file = undefined;
          req.files = undefined;
        } else {
          options.mutliple ? (req.files = results) : (req.file = results[0]);
        }
        next();
      } catch (error) {
        logger.error('Cloudinary upload error:', error);
        return next(new APIError('Uploading failed', 500));
      }
    });

    bb.on('error', (error) => {
      logger.error('Busboy error:', error);
      return next(new APIError('Uploading failed', 500));
    });

    req.pipe(bb);
  };
};

export const uploadUserPhoto = uploadToCloud({
  folder: 'users',
  mutliple: false,
});

export const uploadCoverImage = uploadToCloud({
  folder: 'categories',
  mutliple: false,
});

export const uploadProductImages = uploadToCloud({
  folder: 'products',
  mutliple: true,
});

export const uploadVariantImages = uploadToCloud({
  folder: 'variants',
  mutliple: true,
});
