import upload from '../config/multer';

export const uploadUserPhoto = upload.single('photo');
