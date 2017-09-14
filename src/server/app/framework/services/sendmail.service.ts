import * as nodemailer from "nodemailer";
import Messages=require("../shared/messages");
var config = require('config');

class SendMailService {

  sendMail(mailOptions: any, callback: any) {
    let smtpTransport = nodemailer.createTransport({
      service:config.get('TplSeed.mail.MAIL_SERVICE'),

      auth: {
        user: config.get('TplSeed.mail.MAIL_SENDER'),
        pass: config.get('TplSeed.mail.MAIL_SENDER_PASSWORD')
      }
    });

    smtpTransport.sendMail(mailOptions, function (error: any, response: any) {
      if (error) {
        callback(new Error(Messages.MSG_ERROR_EMAIL), response);
      }
      else {
        callback(null, response);
      }
    });

  }
}

Object.seal(SendMailService);
export = SendMailService;
