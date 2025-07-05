import logger from '../config/logger';
import cloudinary from '../config/cloudinary';

class CloudinaryService {
  async deleteFromCloud(publicId: string | undefined): Promise<void> {
    if (publicId) {
      try {
        const result: { result: string } =
          await cloudinary.uploader.destroy(publicId);
        if (result.result !== 'ok')
          logger.error('Failed to delete image from cloudinary', result);
      } catch (error) {
        logger.error('Cloudinary delete error:', error);
      }
    }
  }

  async deleteMultipleImages(publicIds: (string | undefined)[]): Promise<void> {
    const validPublicIds = publicIds.filter((id) => id !== undefined);
    if (validPublicIds.length) {
      try {
        await cloudinary.api.delete_resources(validPublicIds);
      } catch (error) {
        logger.error('Cloudinary batch delete error:', error);
      }
    }
  }
}

export default new CloudinaryService();
