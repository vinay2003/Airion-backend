import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemConfig } from './entities/system-config.entity';
import { UpdateConfigDto } from './dto/update-config.dto';

@Injectable()
export class CmsService {
  constructor(
    @InjectRepository(SystemConfig)
    private configRepository: Repository<SystemConfig>,
  ) {}

  async findAll(): Promise<Record<string, any>> {
    const configs = await this.configRepository.find();
    const result: Record<string, any> = {};
    configs.forEach(config => {
      result[config.key] = config.value;
    });
    return result;
  }

  async findOne(key: string): Promise<SystemConfig | null> {
    return this.configRepository.findOne({ where: { key } });
  }

  async set(key: string, updateDto: UpdateConfigDto): Promise<SystemConfig> {
    let config = await this.configRepository.findOne({ where: { key } });
    if (!config) {
      config = this.configRepository.create({ key, value: updateDto.value });
    } else {
      config.value = updateDto.value;
    }
    return this.configRepository.save(config);
  }
}
