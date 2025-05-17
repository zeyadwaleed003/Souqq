import nodemailer, { TransportOptions } from 'nodemailer';
import pug from 'pug';
import { convert } from 'html-to-text';

import env from '../config/env';
import IUser from '../interfaces/user.interface';
import logger from '../config/logger';

export default class Email {
  to: IUser;
  from: string;
  url: string;
  firstName: string;

  constructor(user: IUser, url: string) {
    this.to = user;
    this.from = env.EMAIL_FROM as string;
    this.url = url;
    this.firstName = user.name.split(' ')[0];
  }

  newTransporter() {
    // if (env.NODE_ENV === 'production') {
    //   // Use a service to send emails in production
    //   return;
    // }

    return nodemailer.createTransport({
      host: env.MAILTRAP_HOST,
      port: Number(env.MAILTRAP_PORT),
      auth: {
        user: env.MAILTRAP_USERNAME,
        pass: env.MAILTRAP_PASSWORD,
      },
    } as TransportOptions);
  }

  async send(template: string, subject: string) {
    const html = pug.renderFile(`${__dirname}/../templates/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    const info = await this.newTransporter().sendMail({
      from: this.from,
      to: this.to.email as string,
      subject,
      html,
      text: convert(html, {
        wordwrap: false,
      }),
    });

    logger.info(
      `Email sent successfully.\nid: ${info.messageId}.\n${this.to.email}.`
    );
  }

  // Send this email after the user sign up with a url of his profile
  async sendWelcome() {
    await this.send('welcome', 'Welcome to our e-commerce app');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      `Your password reset token (valid for 10 minutes)`
    );
  }

  async sendEmailVerify() {
    await this.send(
      'emailVerify',
      'Your email verification token (valid for 10 minutes)'
    );
  }
}
