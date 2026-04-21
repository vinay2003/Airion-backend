import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('uploads')
export class UploadsController {
    constructor(private readonly uploadsService: UploadsService) {}

    @Post('image')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('File is missing');
        }
        
        // Allowed formats (Image + Video support)
        const allowedMimeTypes = [
            'image/jpeg', 'image/png', 'image/webp', 'image/gif', 
            'image/heic', 'image/heif', 'image/bmp',
            'video/mp4', 'video/quicktime'
        ];
        
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException('Invalid file format. Only JPEG, PNG, WebP, GIF, HEIC and MP4/MOV are allowed.');
        }

        const result = await this.uploadsService.uploadFile(file);
        return {
            success: true,
            url: result.url,
            message: 'Image uploaded successfully'
        };
    }
}
