import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import path from 'path';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}

  async sendEmail(to: string, subject: string, text: string) {
    await this.mailService.sendMail({
      to,
      subject,
      text,
    });
  }

  async sendEmailWithTemplate(
    to: string,
    subject: string,
    template: string,
    context: any,
  ) {
    try {
      const templatePath = path.join(__dirname, '..', '..', 'templates', `${template}.pug`);
      await this.mailService.sendMail({
        to,
        subject,
        template: templatePath,
        context,
      });
    } catch (error) {
      console.error('Email send error:', error);
    }
  }
}
