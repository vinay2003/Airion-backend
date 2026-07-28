import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

import fetch from 'cross-fetch';

@Injectable()
export class UploadsService {
  private supabase: SupabaseClient;
  private bucket: string;

  constructor(private configService: ConfigService) {
    const supabaseUrl = (this.configService.get<string>('SUPABASE_URL') || '').trim();
    const supabaseKey = (this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') || '').trim();
    
    if (!supabaseUrl || !supabaseKey) {
       console.warn('⚠️ Supabase Storage not fully configured in .env');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey, {
      global: { fetch: fetch },
      auth: { persistSession: false },
    });
    this.bucket = (this.configService.get<string>('SUPABASE_STORAGE_BUCKET') || 'images').trim();
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
      const fileExt = file.originalname ? file.originalname.split('.').pop() : (isImage ? 'jpg' : 'mp4');
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // 30-second timeout for upload
      const uploadPromise = this.supabase.storage
          .from(this.bucket)
          .upload(filePath, file.buffer, {
              contentType: file.mimetype,
              upsert: false
          });

      const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Upload timed out after 30 seconds. Supabase Storage may be unreachable.')), 30000)
      );

      const { data, error } = await Promise.race([uploadPromise, timeoutPromise]) as any;

      if (error) {
          throw new Error(`Supabase Storage Error: ${error.message}`);
      }

      const { data: { publicUrl } } = this.supabase.storage
          .from(this.bucket)
          .getPublicUrl(filePath);

      return {
          url: publicUrl,
          public_id: data.path,
          format: fileExt
      };
    } catch (err: any) {
      console.warn(`⚠️ Cloud Storage Failed or Not Configured: ${err.message}`);
      throw new BadRequestException(`Supabase Error: ${err.message}`);
    }
  }
}
