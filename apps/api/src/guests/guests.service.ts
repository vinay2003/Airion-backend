import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guest } from './entities/guest.entity';
import { CreateGuestDto, UpdateGuestDto } from './dto/guest.dto';

@Injectable()
export class GuestsService {
    constructor(
        @InjectRepository(Guest)
        private guestRepository: Repository<Guest>,
    ) {}

    async findAll(userId: string): Promise<Guest[]> {
        return this.guestRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }

    async create(userId: string, createGuestDto: CreateGuestDto): Promise<Guest> {
        const guest = this.guestRepository.create({
            ...createGuestDto,
            userId,
        });
        return this.guestRepository.save(guest);
    }

    async update(id: string, userId: string, updateGuestDto: UpdateGuestDto): Promise<Guest> {
        const guest = await this.guestRepository.findOne({ where: { id, userId } });
        if (!guest) throw new NotFoundException('Guest not found');
        
        Object.assign(guest, updateGuestDto);
        return this.guestRepository.save(guest);
    }

    async remove(id: string, userId: string): Promise<void> {
        const result = await this.guestRepository.delete({ id, userId });
        if (result.affected === 0) throw new NotFoundException('Guest not found');
    }
}
