import UserRepository = require('../dataaccess/repository/user.repository');
import SendMailService = require('./sendmail.service');
import SendMessageService = require('./sendmessage.service');
import * as fs from "fs";
import * as mongoose from "mongoose";
var config = require('config');
let path = require('path');
import Messages = require('../shared/messages');
import AuthInterceptor = require('../../framework/interceptor/auth.interceptor');
import ProjectAsset = require('../shared/projectasset');
import MailAttachments = require('../shared/sharedarray');
import RecruiterRepository = require('../dataaccess/repository/recruiter.repository');

class UserService {
  APP_NAME: string;
  company_name: string;
  mid_content: any;
  private userRepository: UserRepository;
  private recruiterRepository: RecruiterRepository;


  constructor() {
    this.userRepository = new UserRepository();
    this.recruiterRepository = new RecruiterRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  createUser(item: any, callback: (error: any, result: any) => void) {
    this.userRepository.retrieve({'email': item.email}, (err, res) => {
      if (err) {
        callback(new Error(err), null);
      } else if (res.length > 0) {

        if (res[0].isActivated === true) {
          callback(new Error(Messages.MSG_ERROR_REGISTRATION), null);
        } else if (res[0].isActivated === false) {
          callback(new Error(Messages.MSG_ERROR_VERIFY_ACCOUNT), null);
        }

      } else {
        this.userRepository.create(item, (err, res) => {
          if (err) {
            callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
          } else {
            callback(null, res);
          }
        });
      }

    });

  };


  generateOtp(field: any, callback: (error: any, result: any) => void) {
    this.userRepository.retrieve({'mobile_number': field.new_mobile_number, 'isActivated': true}, (err, res) => {

      if (err) {
      } else if (res.length > 0 && (res[0]._id) !== field._id) {
        callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
      } else if (res.length === 0) {

        let query = {'_id': field._id};
        let otp = Math.floor((Math.random() * 99999) + 100000);
        // var otp = Math.floor(Math.random() * (10000 - 1000) + 1000);
        let updateData = {'mobile_number': field.new_mobile_number, 'otp': otp};
        this.userRepository.findOneAndUpdate(query, updateData, {new: true}, (error, result) => {
          if (error) {
            callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
          } else {
            let Data = {
              mobileNo: field.new_mobile_number,
              otp: otp
            };
            let sendMessageService = new SendMessageService();
            sendMessageService.sendMessageDirect(Data, callback);
          }
        });
      } else {
        callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
      }
    });
  }

  changeMobileNumber(field: any, callback: (error: any, result: any) => void) {

    let query = {'_id': field._id};
    // var otp = Math.floor(Math.random() * (10000 - 1000) + 1000);
    let otp = Math.floor((Math.random() * 99999) + 100000);
    let updateData = {'otp': otp, 'temp_mobile': field.new_mobile_number};

    this.userRepository.findOneAndUpdate(query, updateData, {new: true}, (error, result) => {
      if (error) {
        callback(new Error(Messages.MSG_ERROR_REGISTRATION), null);
      } else {
        let Data = {
          current_mobile_number: field.current_mobile_number,
          mobileNo: field.new_mobile_number,
          otp: otp
        };
        let sendMessageService = new SendMessageService();
        sendMessageService.sendChangeMobileMessage(Data, callback);

      }
    });

  }

  forgotPassword(field: any, callback: (error: any, result: any) => void) {

    this.userRepository.retrieve({'email': field.email}, (err, res) => {
      if (res.length > 0 && res[0].isActivated === true) {
        let header1 = fs.readFileSync(path.resolve() + config.get('TplSeed.publicPath')+'header1.html').toString();
        let content = fs.readFileSync(path.resolve() + config.get('TplSeed.publicPath')+'forgotpassword.html').toString();
        let footer1 = fs.readFileSync(path.resolve() + config.get('TplSeed.publicPath')+'footer1.html').toString();

        let auth = new AuthInterceptor();
        let token = auth.issueTokenWithUid(res[0]);
        let host = config.get('TplSeed.mail.host');
        let link = host + 'reset_password?access_token=' + token + '&_id=' + res[0]._id;
        if (res[0].isCandidate === true) {
          this.mid_content = content.replace('$link$', link).replace('$first_name$', res[0].first_name).replace('$app_name$', this.APP_NAME);
          let mailOptions = {
            from: config.get('TplSeed.mail.MAIL_SENDER'),
            to: field.email,
            subject: Messages.EMAIL_SUBJECT_FORGOT_PASSWORD,
            html: header1 + this.mid_content + footer1
            , attachments: MailAttachments.AttachmentArray
          };
          let sendMailService = new SendMailService();
          sendMailService.sendMail(mailOptions, callback);

        } else {
          this.recruiterRepository.retrieve({'userId': new mongoose.Types.ObjectId(res[0]._id)}, (err, recruiter) => {
            if (err) {
              callback(err, null);
            } else {
              this.company_name = recruiter[0].company_name;

              this.mid_content = content.replace('$link$', link).replace('$first_name$', this.company_name).replace('$app_name$', this.APP_NAME);

              let mailOptions = {
                from: config.get('TplSeed.mail.MAIL_SENDER'),
                to: field.email,
                subject: Messages.EMAIL_SUBJECT_FORGOT_PASSWORD,
                html: header1 + this.mid_content + footer1
                , attachments: MailAttachments.AttachmentArray
              };
              let sendMailService = new SendMailService();
              sendMailService.sendMail(mailOptions, callback);

            }
          });
        }
      } else if (res.length > 0 && res[0].isActivated === false) {
        callback(new Error(Messages.MSG_ERROR_ACCOUNT_STATUS), res);
      } else {

        callback(new Error(Messages.MSG_ERROR_USER_NOT_FOUND), res);
      }
    });

  }


  SendChangeMailVerification(field: any, callback: (error: any, result: any) => void) {
    let query = {'email': field.current_email, 'isActivated': true};
    let updateData = {'temp_email': field.new_email};
    this.userRepository.findOneAndUpdate(query, updateData, {new: true}, (error, result) => {
      if (error) {

        callback(new Error(Messages.MSG_ERROR_EMAIL_ACTIVE_NOW), null);

      } else {

        let auth = new AuthInterceptor();
        let token = auth.issueTokenWithUid(result);
        let host = config.get('TplSeed.mail.host');
        let link = host + 'activate_user?access_token=' + token + '&_id=' + result._id+'isEmailVerification';
        let header1 = fs.readFileSync(path.resolve() + config.get('TplSeed.publicPath')+'header1.html').toString();
        let content = fs.readFileSync(path.resolve() + config.get('TplSeed.publicPath')+'change.mail.html').toString();
        let footer1 = fs.readFileSync(path.resolve() + config.get('TplSeed.publicPath')+'footer1.html').toString();
        let mid_content = content.replace('$link$', link);

        let mailOptions = {
          from: config.get('TplSeed.mail.MAIL_SENDER'),
          to: field.new_email,
          subject: Messages.EMAIL_SUBJECT_CHANGE_EMAILID,
          html: header1 + mid_content + footer1

          , attachments: MailAttachments.AttachmentArray
        };
        let sendMailService = new SendMailService();
        sendMailService.sendMail(mailOptions, callback);

      }
    });
  }


  sendVerificationMail(field: any, callback: (error: any, result: any) => void) {

    this.userRepository.retrieve({'email': field.email}, (err, res) => {
      if (res.length > 0) {
        this.recruiterRepository.retrieve({'userId': new mongoose.Types.ObjectId(res[0]._id)}, (err, recruiter) => {
          if (err) {
            callback(err, null);
          } else {
            this.company_name = recruiter[0].company_name;

            let auth = new AuthInterceptor();
            let token = auth.issueTokenWithUid(recruiter[0]);
            let host = config.get('TplSeed.mail.host');
            let link = host + 'company_details?access_token=' + token + '&_id=' + res[0]._id + '&companyName=' + this.company_name;
            let header1 = fs.readFileSync(path.resolve() +config.get('TplSeed.publicPath')+'header1.html').toString();
            let content = fs.readFileSync(path.resolve() +config.get('TplSeed.publicPath')+'recruiter.mail.html').toString();
            let footer1 = fs.readFileSync(path.resolve() +config.get('TplSeed.publicPath')+'footer1.html').toString();
            let mid_content = content.replace('$link$', link);
            let mailOptions = {
              from: config.get('TplSeed.mail.MAIL_SENDER'),
              to: field.email,
              subject: Messages.EMAIL_SUBJECT_REGISTRATION,
              html: header1 + mid_content + footer1
              , attachments: MailAttachments.AttachmentArray
            };
            let sendMailService = new SendMailService();
            sendMailService.sendMail(mailOptions, callback);
          }
        });
      } else {
        callback(new Error(Messages.MSG_ERROR_USER_NOT_FOUND), res);
      }
    });
  }

  sendRecruiterVerificationMail(field: any, callback: (error: any, result: any) => void) {

    this.userRepository.retrieve({'email': field.email}, (err, res) => {
      if (res.length > 0) {
        let auth = new AuthInterceptor();
        let token = auth.issueTokenWithUid(res[0]);
        let host = config.get('TplSeed.mail.host');
        let link = host + 'activate_user?access_token=' + token + '&_id=' + res[0]._id;
        let header1 = fs.readFileSync(path.resolve() +config.get('TplSeed.publicPath')+'header1.html').toString();
        let content = fs.readFileSync(path.resolve() +config.get('TplSeed.publicPath')+'recruiter.mail.html').toString();
        let footer1 = fs.readFileSync(path.resolve() +config.get('TplSeed.publicPath')+'footer1.html').toString();
        let mid_content = content.replace('$link$', link);
        let mailOptions = {
          from: config.get('TplSeed.mail.MAIL_SENDER'),
          to: field.email,
          subject: Messages.EMAIL_SUBJECT_REGISTRATION,
          html: header1 + mid_content + footer1
          , attachments: MailAttachments.AttachmentArray
        };
        let sendMailService = new SendMailService();
        sendMailService.sendMail(mailOptions, callback);

      } else {

        callback(new Error(Messages.MSG_ERROR_USER_NOT_FOUND), res);
      }
    });
  }


  sendMail(field: any, callback: (error: any, result: any) => void) {
    let header1 = fs.readFileSync(path.resolve() +config.get('TplSeed.publicPath')+'header1.html').toString();
    let content = fs.readFileSync(path.resolve() +config.get('TplSeed.publicPath')+'contactus.mail.html').toString();
    let footer1 = fs.readFileSync(path.resolve() +config.get('TplSeed.publicPath')+'footer1.html').toString();
    let mid_content = content.replace('$first_name$', field.first_name).replace('$email$', field.email).replace('$message$', field.message);
    let to = config.get('TplSeed.mail.ADMIN_MAIL');
    let mailOptions = {
      from: config.get('TplSeed.mail.MAIL_SENDER'),
      to: to,
      subject: Messages.EMAIL_SUBJECT_USER_CONTACTED_YOU,
      html: header1 + mid_content + footer1
      , attachments: MailAttachments.AttachmentArray
    };
    let sendMailService = new SendMailService();
    sendMailService.sendMail(mailOptions, callback);

  }

  sendMailOnError(errorInfo: any, callback: (error: any, result: any) => void) {
    let current_Time = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    let header1 = fs.readFileSync(path.resolve() +config.get('TplSeed.publicPath')+'header1.html').toString();
    let content = fs.readFileSync(path.resolve() +config.get('TplSeed.publicPath')+'error.mail.html').toString();
    let footer1 = fs.readFileSync(path.resolve() +config.get('TplSeed.publicPath')+'footer1.html').toString();
    let mid_content = content.replace('$time$', current_Time).replace('$host$', config.get('TplSeed.mail.host')).replace('$reason$', errorInfo.reason).replace('$code$', errorInfo.code).replace('$message$', errorInfo.message);
    if(errorInfo.stackTrace) {
      mid_content=mid_content.replace('$error$',errorInfo.stackTrace.stack);
    } else if(errorInfo.stack){
      mid_content=mid_content.replace('$error$',errorInfo.stack);
    }
    let mailOptions = {
      from: config.get('TplSeed.mail.MAIL_SENDER'),
      to: config.get('TplSeed.mail.ADMIN_MAIL'),
      cc: config.get('TplSeed.mail.TPLGROUP_MAIL'),
      subject: Messages.EMAIL_SUBJECT_SERVER_ERROR + ' on ' + config.get('TplSeed.mail.host'),
      html: header1 + mid_content + footer1
      , attachments: MailAttachments.AttachmentArray
    };
    let sendMailService = new SendMailService();
    sendMailService.sendMail(mailOptions, callback);

  }

  findById(id: any, callback: (error: any, result: any) => void) {
    this.userRepository.findById(id, callback);
  }

  retrieve(field: any, callback: (error: any, result: any) => void) {
    this.userRepository.retrieveWithLean(field,{}, callback);
  }

  retrieveWithLimit(field: any, included : any, callback: (error: any, result: any) => void) {
    let limit = config.get('TplSeed.limitForQuery');
    this.userRepository.retrieveWithLimit(field, included, limit, callback);
  }

  retrieveWithLean(field: any, callback: (error: any, result: any) => void) {
    this.userRepository.retrieve(field, callback);
  }

  retrieveAll(item: any, callback: (error: any, result: any) => void) {
    this.userRepository.retrieve(item, (err, res) => {
      if (err) {
        callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
      } else {
        callback(null, res);
      }
    });
  };

  update(_id: string, item: any, callback: (error: any, result: any) => void) {

    this.userRepository.findById(_id, (err: any, res: any) => {

      if (err) {
        callback(err, res);
      }else {
        this.userRepository.update(res._id, item, callback);
      }
    });
  }


  delete(_id: string, callback: (error: any, result: any) => void) {
    this.userRepository.delete(_id, callback);
  }

  findOneAndUpdate(query: any, newData: any, options: any, callback: (error: any, result: any) => void) {
    this.userRepository.findOneAndUpdate(query, newData, options, callback);
  }

  UploadImage(tempPath: any, fileName: any, cb: any) {
    let targetpath = fileName;
    fs.rename(tempPath, targetpath, function (err) {
      cb(null, tempPath);
    });
  }

  UploadDocuments(tempPath: any, fileName: any, cb: any) {
    let targetpath = fileName;
    fs.rename(tempPath, targetpath, function (err: any) {
      cb(null, tempPath);
    });
  }

  findAndUpdateNotification(query: any, newData: any, options: any, callback: (error: any, result: any) => void) {
    this.userRepository.findOneAndUpdate(query, newData, options, callback);
  }

  retrieveBySortedOrder(query: any, projection:any, sortingQuery: any, callback: (error: any, result: any) => void) {
    this.userRepository.retrieveBySortedOrder(query, projection, sortingQuery, callback);
  }

}

Object.seal(UserService);
export = UserService;
