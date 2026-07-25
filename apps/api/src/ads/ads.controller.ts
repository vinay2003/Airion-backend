import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { AdsService } from './ads.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  // ─── Vendor Endpoints ───────────────────────────────────────────────
  
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR)
  create(@Body() createAdDto: CreateAdDto, @Req() req: any) {
    return this.adsService.create(req.user.userId, createAdDto);
  }

  @Get('vendor/me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR)
  findMyAds(@Req() req: any) {
    return this.adsService.findByVendor(req.user.userId);
  }

  // ─── Admin Endpoints ────────────────────────────────────────────────
  
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.adsService.findAll();
  }

  @Get('active')
  findActive(@Query('city') city?: string) {
    return this.adsService.findActiveAds({ city });
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateStatus(@Param('id') id: string, @Body() updateAdDto: UpdateAdDto) {
    return this.adsService.update(id, updateAdDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  findOne(@Param('id') id: string) {
    return this.adsService.findOne(id);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  approve(@Param('id') id: string, @Req() req: any) {
    return this.adsService.approveCampaign(id, req.user.userId);
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  reject(@Param('id') id: string, @Req() req: any) {
    return this.adsService.rejectCampaign(id, req.user.userId);
  }

  @Patch(':id/expire')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  expire(@Param('id') id: string) {
    return this.adsService.expireCampaign(id);
  }

  // ─── Public Endpoints (User Website) ────────────────────────────────



  @Post(':id/click')
  async recordClick(@Param('id') id: string) {
    await this.adsService.incrementClick(id);
    return { success: true };
  }

  @Post(':id/impression')
  async recordImpression(@Param('id') id: string) {
    await this.adsService.incrementImpression(id);
    return { success: true };
  }
}
