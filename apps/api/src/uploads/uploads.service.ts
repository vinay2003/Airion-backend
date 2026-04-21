import { Injectable, BadRequestException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadsService {
  private supabase: SupabaseClient;
  private bucket: string;

  constructor(private configService: ConfigService) {
      const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
      const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');
      this.bucket = this.configService.get<string>('SUPABASE_STORAGE_BUCKET') || 'images';

      if (!supabaseUrl || !supabaseKey) {
          console.error('Supabase credentials missing in environment');
      }

      this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async uploadFile(file: Express.Multer.File): Promise<{ url: string; public_id: string; format?: string; duration?: number }> {
      if (!file) {
          throw new BadRequestException('No file provided');
      }

      // --- PRODUCTION SECURITY: MIME TYPE GUARD ---
      const allowedMimeTypes = [
          'image/jpeg', 'image/png', 'image/webp', 'image/gif', 
          'image/heic', 'image/heif', 'image/bmp',
          'video/mp4', 'video/quicktime'
      ];
      if (!allowedMimeTypes.includes(file.mimetype)) {
          throw new BadRequestException('Invalid file type. Only JPEG, PNG, WEBP, GIF, HEIC and MP4/MOV are allowed.');
      }

      // --- PRODUCTION GUARD: SIZE LIMITS ---
      const isVideo = file.mimetype.startsWith('video');
      const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024; // 50MB for video, 10MB for images
      if (file.size > maxSize) {
          throw new BadRequestException(`File too large. Max limit is ${maxSize / (1024 * 1024)}MB`);
      }

      const fileExt = file.originalname.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error } = await this.supabase.storage
          .from(this.bucket)
          .upload(filePath, file.buffer, {
              contentType: file.mimetype,
              upsert: false
          });

      if (error) {
          throw new BadRequestException(`Supabase Storage Error: ${error.message}`);
      }

      // Get Public URL
      const { data: { publicUrl } } = this.supabase.storage
          .from(this.bucket)
          .getPublicUrl(filePath);

      return {
          url: publicUrl,
          public_id: data.path,
          format: fileExt
      };
  }
}
