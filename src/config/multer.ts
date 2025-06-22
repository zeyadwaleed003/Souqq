import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import APIError from '../utils/APIError';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isProfPic = req.baseUrl === '/api/v1/auth' || '/api/v1/users';

    cb(null, `${__dirname}/../uploads/${isProfPic ? 'users' : ''}`);
  },
  filename: function (req, file, cb) {
    const fileName =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, fileName);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new APIError('Unsupported file format', 400), false);
};

const upload = multer({ storage, fileFilter });

export default upload;
