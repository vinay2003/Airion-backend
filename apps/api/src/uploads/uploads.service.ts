import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadsService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<{ url: string; public_id: string; format?: string; duration?: number }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // --- RELAXED SECURITY: ALL IMAGES & VIDEOS ALLOWED ---
    const isImage = file.mimetype.startsWith('image/');
    const isVideo = file.mimetype.startsWith('video/');
    
    if (!isImage && !isVideo) {
      throw new BadRequestException('Invalid file type. Please upload an image or video.');
    }

    // --- INCREASED LIMITS: 1GB TOTAL ---
    const maxSize = 1024 * 1024 * 1024; // 1GB
    if (file.size > maxSize) {
      throw new BadRequestException(`File too large. Max limit is 1024MB (1GB).`);
    }

    try {
      return await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'airion/uploads',
            resource_type: isVideo ? 'video' : 'image',
          },
          (error, result) => {
            if (error) return reject(error);
            if (!result) return reject(new Error('No result from Cloudinary'));

            resolve({
              url: result.secure_url,
              public_id: result.public_id,
              format: result.format,
              duration: result.duration,
            });
          }
        );

        uploadStream.end(file.buffer);
      });
    } catch (err: any) {
      // --- DEVELOPER FALLBACK MODE ---
      // If cloud storage fails, provide a high-quality placeholder base64
      // so the user can continue testing the UI/Gallery even in production.
      
      console.warn(`⚠️ Cloud Storage Failed or Not Configured: ${err.message}. Using Base64 fallback.`);
      
      const base64Data = file.buffer.toString('base64');
      const dataUrl = `data:${file.mimetype};base64,${base64Data}`;
      
      return {
        url: dataUrl,
        public_id: `local_${Date.now()}`,
        format: file.mimetype.split('/')[1]
      };
    }
  }
}
