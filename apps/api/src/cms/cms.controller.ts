import { Controller, Get, Post, Put, Body, Param, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { CmsService } from './cms.service';
import { UpdateConfigDto } from './dto/update-config.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get()
  async findAll() {
    return this.cmsService.findAll();
  }

  @Get(':key')
  async findOne(@Param('key') key: string) {
    const config = await this.cmsService.findOne(key);
    if (!config) {
      return null;
    }
    return config.value;
  }

  @Put(':key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('key') key: string, @Body() updateConfigDto: UpdateConfigDto) {
    return this.cmsService.set(key, updateConfigDto);
  }
}
