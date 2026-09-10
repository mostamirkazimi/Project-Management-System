import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    private readonly mailService: MailService,
  ) {}

  async sendMessage(dto: CreateContactDto) {
    await this.mailService.sendContactEmail(
      dto.name,
      dto.email,
      dto.phone,
      dto.subject,
      dto.message,
    );

    return {
      message: 'Your message has been sent successfully.',
    };
  }
}