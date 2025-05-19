import pug from 'pug';
import { convert } from 'html-to-text';

import env from '../config/env';
import logger from '../config/logger';
import { transporter } from '../config/email';

const sendEmail = async (
  name: string,
  email: string,
  url: string,
  template: string,
  subject: string
) => {
  const html = pug.renderFile(`${__dirname}/../templates/${template}.pug`, {
    firstName: name.split(' ')[0],
    url,
    subject,
  });

  const info = await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: email,
    subject,
    html,
    text: convert(html, {
      wordwrap: false,
    }),
  });

  logger.info(`Email sent successfully.\nid: ${info.messageId}.\n${email}.`);
};

export const sendEmailVerifyEmail = async (
  name: string,
  email: string,
  url: string
) => {
  await sendEmail(
    name,
    email,
    url,
    'emailVerify',
    'Your email verification token (valid for 10 minutes)'
  );
};

export const sendPasswordResetEmail = async (
  name: string,
  email: string,
  url: string
) => {
  await sendEmail(
    name,
    email,
    url,
    'passwordReset',
    `Your password reset token (valid for 10 minutes)`
  );
};
