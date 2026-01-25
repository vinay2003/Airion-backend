import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
    constructor(private configService: ConfigService) { }

    async uploadImage(filePath: string, folder: string = 'airion/vendors') {
        return await cloudinary.uploader.upload(filePath, {
            folder: folder,
        });
    }
}
