import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadsService {
  constructor(private configService: ConfigService) {
      cloudinary.config({
          cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME') || 'demo',
          api_key: this.configService.get('CLOUDINARY_API_KEY') || 'demo',
          api_secret: this.configService.get('CLOUDINARY_API_SECRET') || 'demo',
      });
  }

  async uploadFile(file: Express.Multer.File): Promise<{ url: string; public_id: string }> {
      if (!file) {
          throw new BadRequestException('No file provided');
      }

      return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
              { folder: 'ease2event' },
              (error, result) => {
                  if (error || !result) {
                      return reject(new BadRequestException('Failed to upload file to Cloudinary'));
                  }
                  resolve({
                      url: result.secure_url,
                      public_id: result.public_id,
                  });
              }
          );
          uploadStream.end(file.buffer);
      });
  }
}
