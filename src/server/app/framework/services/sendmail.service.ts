import * as nodemailer from "nodemailer";
import Messages=require("../shared/messages");
var config = require('config');
var smtpTransport = nodemailer.createTransport({
  service:"Zoho",

  auth: {
    user: config.get('TplSeed.mail.MAIL_SENDER'),
    pass: config.get('TplSeed.mail.MAIL_SENDER_PASSWORD')
  }
});

class SendMailService {

  sendMail(mailOptions: any, callback: any) {

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
