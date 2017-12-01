import UserRepository = require('../dataaccess/repository/user.repository');
import SendMailService = require('./mailer.service');
import SendMessageService = require('./sendmessage.service');
import * as fs from "fs";
import * as mongoose from "mongoose";
import {SentMessageInfo} from "nodemailer";
let config = require('config');
let path = require('path');
import Messages = require('../shared/messages');
import AuthInterceptor = require('../../framework/interceptor/auth.interceptor');
import ProjectAsset = require('../shared/projectasset');
import MailAttachments = require('../shared/sharedarray');
import RecruiterRepository = require('../dataaccess/repository/recruiter.repository');
import RecruiterService = require('./recruiter.service');

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
        // let otp = Math.floor(Math.random() * (10000 - 1000) + 1000);
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
    // let otp = Math.floor(Math.random() * (10000 - 1000) + 1000);
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

  forgotPassword(field: any, callback: (error: any, result: SentMessageInfo) => void) {
    let sendMailService = new SendMailService();

    this.userRepository.retrieve({'email': field.email}, (err, res) => {
      if (res.length > 0 && res[0].isActivated === true) {

        let auth = new AuthInterceptor();
        let token = auth.issueTokenWithUid(res[0]);
        let host = config.get('TplSeed.mail.host');
        let link = host + 'reset-password?access_token=' + token + '&_id=' + res[0]._id;
        if (res[0].isCandidate === true) {
          let data:Map<string,string>= new Map([['$jobmosisLink$',config.get('TplSeed.mail.host')],
            ['$first_name$',res[0].first_name],['$link$',link],['$app_name$',this.APP_NAME]]);
          sendMailService.send(field.email,
            Messages.EMAIL_SUBJECT_FORGOT_PASSWORD,
            'forgotpassword.html',data,(err: any, result: any) => {
              callback(err, result);
            });
        } else {
          this.recruiterRepository.retrieve({'userId': new mongoose.Types.ObjectId(res[0]._id)}, (err, recruiter) => {
            if (err) {
              callback(err, null);
            } else {
              this.company_name = recruiter[0].company_name;
              let data:Map<string,string>= new Map([['$jobmosisLink$',config.get('TplSeed.mail.host')],
                ['$first_name$',this.company_name],['$link$',link],['$app_name$',this.APP_NAME]]);
              sendMailService.send(field.email,
                Messages.EMAIL_SUBJECT_FORGOT_PASSWORD,
                'forgotpassword.html',data,callback ,null,MailAttachments.ForgetPasswordAttachmentArray);
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


  SendChangeMailVerification(field: any, callback: (error: any, result: SentMessageInfo) => void) {
    let query = {'email': field.current_email, 'isActivated': true};
    let updateData = {'temp_email': field.new_email};
    this.userRepository.findOneAndUpdate(query, updateData, {new: true}, (error, result) => {
      if (error) {
        callback(new Error(Messages.MSG_ERROR_EMAIL_ACTIVE_NOW), null);
      } else {
        let auth = new AuthInterceptor();
        let token = auth.issueTokenWithUid(result);
        let host = config.get('TplSeed.mail.host');
        let link = host + 'activate-user?access_token=' + token + '&_id=' + result._id+'isEmailVerification';
        let sendMailService = new SendMailService();
        let data: Map<string, string> = new Map([['$jobmosisLink$',config.get('TplSeed.mail.host')],
          ['$link$', link]]);
        sendMailService.send(field.new_email,
          Messages.EMAIL_SUBJECT_CHANGE_EMAILID,
          'change.mail.html', data, callback);
      }
    });
  }


  sendVerificationMail(field: any, callback: (error: any, result: SentMessageInfo) => void) {

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
            let link = host + 'company-details?access_token=' + token + '&_id=' + res[0]._id + '&companyName=' + this.company_name;
            let sendMailService = new SendMailService();
            let data:Map<string,string>= new Map([['$jobmosisLink$',config.get('TplSeed.mail.host')],
              ['$link$',link]]);
            sendMailService.send(field.email,
              Messages.EMAIL_SUBJECT_REGISTRATION,
              'recruiter.mail.html',data,(err: any, result: any) => {
              if(err) {
                callback(err,result);
                return;
                 }
                let recruiterService = new RecruiterService();
                recruiterService.mailOnRecruiterSignupToAdmin(res[0], this.company_name, callback);

              });
                 } });
      } else {
        callback(new Error(Messages.MSG_ERROR_USER_NOT_FOUND), res);
      }
    });
  }

  sendRecruiterVerificationMail(field: any, callback: (error: any, result: SentMessageInfo) => void) {

    this.userRepository.retrieve({'email': field.email}, (err, res) => {
      if (res.length > 0) {
        let auth = new AuthInterceptor();
        let token = auth.issueTokenWithUid(res[0]);
        let host = config.get('TplSeed.mail.host');
        let link = host + 'activate-user?access_token=' + token + '&_id=' + res[0]._id;
        let sendMailService = new SendMailService();
        let data: Map<string, string> = new Map([['$jobmosisLink$',config.get('TplSeed.mail.host')],['$link$', link]]);
        sendMailService.send(field.email,
          Messages.EMAIL_SUBJECT_REGISTRATION,
          'recruiter.mail.html', data, callback);

      } else {
        callback(new Error(Messages.MSG_ERROR_USER_NOT_FOUND), res);
      }
    });
  }


  sendMail(field: any, callback: (error: any, result: SentMessageInfo) => void) {
    let sendMailService = new SendMailService();
    let data:Map<string,string>= new Map([['$jobmosisLink$',config.get('TplSeed.mail.host')],
      ['$first_name$',field.first_name],['$email$',field.email],['$message$',field.message]]);
    sendMailService.send(config.get('TplSeed.mail.ADMIN_MAIL'),
      Messages.EMAIL_SUBJECT_USER_CONTACTED_YOU,
      'contactus.mail.html',data,callback);
  }

  sendMailOnError(errorInfo: any, callback: (error: any, result: SentMessageInfo) => void) {
    let current_Time = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    let data:Map<string,string>;
    if(errorInfo.stackTrace) {
       data= new Map([['$jobmosisLink$',config.get('TplSeed.mail.host')],
         ['$time$',current_Time],['$host$',config.get('TplSeed.mail.host')],
        ['$reason$',errorInfo.reason],['$code$',errorInfo.code],
        ['$message$',errorInfo.message],['$error$',errorInfo.stackTrace.stack]]);

    } else if(errorInfo.stack) {
      data= new Map([['$jobmosisLink$',config.get('TplSeed.mail.host')],
        ['$time$',current_Time],['$host$',config.get('TplSeed.mail.host')],
        ['$reason$',errorInfo.reason],['$code$',errorInfo.code],
        ['$message$',errorInfo.message],['$error$',errorInfo.stack]]);
    }
    let sendMailService = new SendMailService();
    sendMailService.send(config.get('TplSeed.mail.ADMIN_MAIL'),
      Messages.EMAIL_SUBJECT_SERVER_ERROR + ' on ' + config.get('TplSeed.mail.host'),
      'error.mail.html',data,callback,config.get('TplSeed.mail.TPLGROUP_MAIL'));
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

  getUserRegistrationStatus(query: any, callback: (error: any, result: any) => void) {
    this.userRepository.retrieveWithIncluded(query, {'email': 1, '_id': 0}, callback);
  }

}

Object.seal(UserService);
export = UserService;
