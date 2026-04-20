import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadsService {
  constructor(private configService: ConfigService) {
      cloudinary.config({
          cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
          api_key: this.configService.get('CLOUDINARY_API_KEY'),
          api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
      });
  }

  async uploadFile(file: Express.Multer.File): Promise<{ url: string; public_id: string; format?: string; duration?: number }> {
      if (!file) {
          throw new BadRequestException('No file provided');
      }

      // --- PRODUCTION SECURITY: MIME TYPE GUARD ---
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
          throw new BadRequestException('Invalid file type. Only JPEG, PNG, WEBP and MP4/MOV are allowed.');
      }

      // --- PRODUCTION GUARD: SIZE LIMITS ---
      const isVideo = file.mimetype.startsWith('video');
      const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024; // 50MB for video, 10MB for images
      if (file.size > maxSize) {
          throw new BadRequestException(`File too large. Max limit is ${maxSize / (1024 * 1024)}MB`);
      }

      return new Promise((resolve, reject) => {
          const uploadOptions: any = {
              folder: 'ease2event',
              resource_type: isVideo ? 'video' : 'auto',
          };

          // Auto-optimization for videos
          if (isVideo) {
            uploadOptions.eager = [
                { width: 720, crop: "scale", quality: "auto" },
                { streaming_profile: "full_hd", format: "m3u8" }
            ];
          }

          const uploadStream = cloudinary.uploader.upload_stream(
              uploadOptions,
              (error, result) => {
                  if (error || !result) {
                      return reject(new BadRequestException(`Cloudinary Upload Failed: ${error?.message || 'Unknown error'}`));
                  }
                  resolve({
                      url: result.secure_url,
                      public_id: result.public_id,
                      format: result.format,
                      duration: result.duration
                  });
              }
          );
          uploadStream.end(file.buffer);
      });
  }
}
