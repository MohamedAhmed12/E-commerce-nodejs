import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EmailMailingConfig } from 'src/configuration';
import { RequestAccessToPlatformInput } from 'src/core/user/inputs/request-access-to-platform.input';

// ToDo: change rule of eslint?
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Mailchimp = require('@mailchimp/mailchimp_transactional');

interface Context {
  name: string;
  content: any;
}

interface EmailInfo {
  subject: string;
  templateName: string;
}

@Injectable()
export class EmailMailingService {
  private mailchimp: any;
  private readonly sender: string;
  private readonly frontendDomain: string;
  constructor(private configService: ConfigService) {
    const { apiKey, sender } =
      this.configService.get<EmailMailingConfig>('emailMailing');

    this.sender = sender;
    this.mailchimp = new Mailchimp(apiKey);
    this.frontendDomain = this.configService.get<string>('frontendDomain');
  }

  async sendResetPasswordEmail(email: string, token: string) {
    const link = `${this.frontendDomain}reset_password?token=${token}`;

    const context = [
      {
        name: 'link',
        content: link,
      },
    ];

    await this.sendTemplateEmail(
      email,
      {
        templateName: 'Reset Password',
        subject: 'Reset Password',
      },
      context,
    );
  }

  async sendInviteEmail(email: string, token: string) {
    const link = `${this.frontendDomain}accept_invitation?token=${token}`;

    const context = [
      {
        name: 'link',
        content: link,
      },
    ];

    await this.sendTemplateEmail(
      email,
      {
        templateName: 'Invite User',
        subject: 'Invite User',
      },
      context,
    );
  }

  async requestAccessToPlatform(
    email: string,
    input: RequestAccessToPlatformInput,
  ) {
    const context = [
      {
        name: 'accountType',
        content: input.accountType,
      },
      {
        name: 'email',
        content: input.email,
      },
      {
        name: 'companyName',
        content: input.companyName,
      },
      {
        name: 'firstName',
        content: input.firstName,
      },
      {
        name: 'lastName',
        content: input.lastName,
      },
      {
        name: 'phoneNumber',
        content: input.phoneNumber,
      },
      {
        name: 'country',
        content: input.country,
      },
      {
        name: 'website',
        content: input.website,
      },
    ];

    await this.sendTemplateEmail(
      email,
      {
        templateName: 'Request Access',
        subject: 'Request Access',
      },
      context,
    );
  }

  async sendTemplateEmail(
    email: string,
    emailInfo: EmailInfo,
    context: Context[],
  ) {
    const a = await this.mailchimp.messages.sendTemplate({
      template_name: 'reset-password-template',
      template_content: [],
      message: {
        from_email: this.sender,
        form_name: 'test',
        subject: emailInfo.subject,
        to: [
          {
            email,
            type: 'to',
          },
        ],
        global_merge_vars: context,
      },
    });
    console.log(2111111111111111111111111, a);
  }
}
