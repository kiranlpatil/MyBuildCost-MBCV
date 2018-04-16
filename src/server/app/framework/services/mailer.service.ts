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
    service: config.get('application.mail.MAIL_SERVICE'),
    auth: {
      user: config.get('application.mail.MAIL_SENDER'),
      pass: config.get('application.mail.MAIL_SENDER_PASSWORD')
    }
  });

  send(sendmailTo: string, subject: string, templateName: string,
       data: Map<string, string>,
       callback: (error: Error, result: SentMessageInfo) => void, carbonCopy?: string,attachment?:any) {

    let content = fs.readFileSync(path.resolve() + config.get('application.publicPath') + 'templates/' + templateName).toString();
    if(content) {
      console.log('content resolve : '+JSON.stringify(content));
      let result = content;
      callback(null, null);
    } else {
      let content2 = fs.readFileSync(config.get('application.publicPath') + 'templates/' + templateName).toString();
      console.log('content  publicPath: '+JSON.stringify(content2));
      callback(null, null);
    }
    /*data.forEach((value: string, key: string) => {
      content = content.replace(key, value);
    });

    let mailOptions = {
      from: config.get('application.mail.MAIL_SENDER'),
      to: sendmailTo,
      cc: carbonCopy,
      subject: subject,
      html: content,
      attachments:attachment?attachment: MailAttachments.AttachmentArray
    };
    SendMailService.smtpTransport.sendMail(mailOptions, function (error: Error, response: SentMessageInfo) {
      if (error) {
        loggerService.logError(' Error in mail send ' + error);
      }
      callback(error, response);
    });*/
  }
}

Object.seal(SendMailService);
export = SendMailService;
