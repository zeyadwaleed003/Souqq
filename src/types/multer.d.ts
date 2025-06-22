import APIError from '../../utils/APIError';

declare module 'multer' {
  interface FileFilterCallback {
    (error: APIError, acceptFile: boolean): void;
  }
}
