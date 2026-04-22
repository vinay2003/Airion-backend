import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactsService {
    private readonly logger = new Logger(ContactsService.name);

    constructor(
        @InjectRepository(Contact)
        private contactRepository: Repository<Contact>,
    ) {}

    async create(createContactDto: CreateContactDto): Promise<Contact> {
        this.logger.log(`New contact message from ${createContactDto.email}`);
        
        const contact = this.contactRepository.create(createContactDto);
        const savedContact = await this.contactRepository.save(contact);
        
        // TODO: Implement email notification logic (e.g., SendGrid, Nodemailer)
        // this.sendEmail(savedContact);

        return savedContact;
    }

    async findAll(): Promise<Contact[]> {
        return this.contactRepository.find({
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<Contact> {
        const contact = await this.contactRepository.findOne({ where: { id } });
        if (!contact) {
            throw new Error(`Contact with ID ${id} not found`);
        }
        return contact;
    }

    async updateStatus(id: string, status: 'unread' | 'read' | 'replied'): Promise<Contact> {
        await this.contactRepository.update(id, { status });
        return this.findOne(id);
    }
}
