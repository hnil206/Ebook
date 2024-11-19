import { UploadApiResponse } from 'cloudinary';
import path from 'path';
import cloudinary from '../configs/cloudinary.config';
import File from '../models/file.model';
export async function uploadFile(
  file: Express.Multer.File,
  // userId: string,
  type: string,
  relatedId?: string,
  onModel?: string,
): Promise<InstanceType<typeof File>> {
  try {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const isEpub = fileExtension === '.epub';
    console.log('isEpub: ', isEpub);
    const filename = path.basename(file.originalname, fileExtension);
    const publicId = isEpub ? `${filename}${fileExtension}` : filename;
    const result: UploadApiResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: isEpub ? 'raw' : 'auto',
            folder: process.env.CLOUD_IMG_FOLDER,
            use_filename: true,
            unique_filename: true,
            public_id: isEpub ? publicId : undefined,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as UploadApiResponse);
          },
        )
        .end(file.buffer);
    });

    //TODO: add userId
    const _file = new File({
      // userId,
      publicId: result.public_id,
      url: result.secure_url,
      type,
      ...(relatedId && { relatedId }),
      ...(onModel && { onModel }),
    });

    return await _file.save();
  } catch (error) {
    console.error('Lỗi khi tải lên ảnh:', error);
    throw error;
  }
}

export async function getFileIds(urls: string | string[]): Promise<string[]> {
  try {
    const urlArray = Array.isArray(urls) ? urls : [urls];
    const files = await File.find({ url: { $in: urlArray } }).select('_id');
    return files.map((file) => file._id.toString());
  } catch (error) {
    console.error('Lỗi khi lấy ID ảnh:', error);
    throw error;
  }
}
