import * as nodemailer from 'nodemailer';
import MailAttachments = require('../shared/sharedarray');
import LoggerService = require('../shared/logger/LoggerService');
import * as fs from 'fs';
import * as path from 'path';
import { SentMessageInfo } from 'nodemailer';

let config = require('config');
let loggerService = new LoggerService('MAILCHIMP_MAILER_SERVICE');

class SendMailService {
  static smtpTransport = nodemailer.createTransport({
    service: config.get('TplSeed.mail.MAIL_SERVICE'),
    auth: {
      user: config.get('TplSeed.mail.MAIL_SENDER'),
      pass: config.get('TplSeed.mail.MAIL_SENDER_PASSWORD')
    }
  });

  send(sendmailTo: string, subject: string, templateName: string,
       data: Map<string, string>,
       callback: (error: Error, result: SentMessageInfo) => void, carbonCopy?: string) {
    let content = fs.readFileSync(path.resolve() + config.get('TplSeed.publicPath') + 'templates/' + templateName).toString();
    data.forEach((value: string, key: string) => {
      content = content.replace(key, value);
    });

    let mailOptions = {
      from: config.get('TplSeed.mail.MAIL_SENDER'),
      to: sendmailTo,
      cc: carbonCopy,
      subject: subject,
      html: content,
      attachments: MailAttachments.AttachmentArray
    };
    SendMailService.smtpTransport.sendMail(mailOptions, function (error: Error, response: SentMessageInfo) {
      if (error) {
        loggerService.logError(' Error in mail send ' + error);
      }
      callback(error, response);
    });
  }
}

Object.seal(SendMailService);
export = SendMailService;
