import upload from '../config/multer';

export const uploadUserPhoto = upload.single('photo');
export const uploadMultipleImages = upload.array('images', 8);
export const uploadCoverImage = upload.single('coverImage');
