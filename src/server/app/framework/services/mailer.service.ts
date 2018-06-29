import * as nodemailer from 'nodemailer';
import MailAttachments = require('../shared/sharedarray');
import LoggerService = require('../shared/logger/LoggerService');
import * as fs from 'fs';
import * as path from 'path';
import { SentMessageInfo } from 'nodemailer';

let config = require('config');
let loggerService = new LoggerService('MAILCHIMP_MAILER_SERVICE');

class SendMailService {
  //process.env.NODE_TLS_REJECT_UNAUTHORIZED : any = '0';
  static smtpTransport = nodemailer.createTransport({
    service: config.get('application.mail.MAIL_SERVICE'),
    auth: {
      user: config.get('application.mail.MAIL_SENDER'),
      pass: config.get('application.mail.MAIL_SENDER_PASSWORD')
    },
    tls: { rejectUnauthorized: false }
  });

  send(sendmailTo: string, subject: string, templateName: string,
       data: Map<string, string>, attachment?:any[],
       callback: (error: Error, result: SentMessageInfo) => void, blankCarbonCopy?: string) {

    let content = fs.readFileSync(path.resolve() + config.get('application.publicPath') + 'templates/' + templateName).toString();
    data.forEach((value: string, key: string) => {
      content = content.replace(key, value);
    });
    loggerService.logDebug('Sending mail from mail service.');

    let mailOptions = {
      from: config.get('application.mail.MAIL_SENDER'),
      to: sendmailTo,
      bcc: blankCarbonCopy,
      subject: subject,
      html: content,
      attachments:attachment
      /*attachment?attachment: MailAttachments.WelcomeAboardAttachmentArray*/
    };
    SendMailService.smtpTransport.sendMail(mailOptions, function (error: Error, response: SentMessageInfo) {
      if (error) {
        loggerService.logError(' Error in mail send ' + error);
      }
      loggerService.logDebug(' response in mail send ' + response);
      callback(error, response);
    });
  }
}

Object.seal(SendMailService);
export = SendMailService;
