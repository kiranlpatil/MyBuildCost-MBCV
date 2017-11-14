import * as nodemailer from "nodemailer";
import Messages=require("../shared/messages");
let config = require('config');

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
        console.log('in error of emial',error);
        callback(new Error(Messages.MSG_ERROR_EMAIL), response);
      }
      else {
        console.log("success emial");
        callback(null, response);
      }
    });

  }
}

Object.seal(SendMailService);
export = SendMailService;
