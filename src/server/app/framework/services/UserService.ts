import UserRepository = require('../dataaccess/repository/UserRepository');
import SendMailService = require('./mailer.service');
import SendMessageService = require('./sendmessage.service');
import * as fs from 'fs';
import * as mongoose from 'mongoose';
import { SentMessageInfo } from 'nodemailer';
let config = require('config');
let path = require('path');
import Messages = require('../shared/messages');
import AuthInterceptor = require('../../framework/interceptor/auth.interceptor');
import ProjectAsset = require('../shared/projectasset');
import MailAttachments = require('../shared/sharedarray');
import { asElementData } from '@angular/core/src/view';
import bcrypt = require('bcrypt');
import { MailChimpMailerService } from './mailchimp-mailer.service';
import UserModel = require('../dataaccess/model/UserModel');
import User = require('../dataaccess/mongoose/user');
import SubscriptionService = require('../../applicationProject/services/SubscriptionService');
import SubscriptionPackage = require('../../applicationProject/dataaccess/model/project/Subscription/SubscriptionPackage');
import BaseSubscriptionPackage = require('../../applicationProject/dataaccess/model/project/Subscription/BaseSubscriptionPackage');
import UserSubscription = require('../../applicationProject/dataaccess/model/project/Subscription/UserSubscription');

class UserService {
  APP_NAME: string;
  company_name: string;
  mid_content: any;
  private userRepository: UserRepository;


  constructor() {
    this.userRepository = new UserRepository();
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
        const saltRounds = 10;
        bcrypt.hash(item.password, saltRounds, (err: any, hash: any) => {
          if (err) {
            callback({
              reason: 'Error in creating hash using bcrypt',
              message: 'Error in creating hash using bcrypt',
              stackTrace: new Error(),
              code: 403
            }, null);
          } else {
            item.password = hash;
            let subScriptionService = new SubscriptionService();
            subScriptionService.getSubscriptionPackageByName('Free', (err: any,
                                                                      freeSubscription: Array<SubscriptionPackage>) => {
              if (freeSubscription.length > 0) {
                this.assignFreeSubscriptionAndCreateUser(item, freeSubscription[0], callback);
              }else {
                subScriptionService.addSubscriptionPackage(config.get('subscription.package.Free'),
                  (err: any, freeSubscription)=> {
                    this.assignFreeSubscriptionAndCreateUser(item, freeSubscription, callback);
                });
              }

            });

          }
        });
      }

    });
  }

   assignFreeSubscriptionAndCreateUser(item: any, freeSubscription: SubscriptionPackage, callback: (error: any, result: any) => void) {
    let user: UserModel = item;
    let sendMailService = new SendMailService();
    this.assignFreeSubscriptionPackage(user, freeSubscription);
    this.userRepository.create(user, (err:Error, res:any) => {
      if (err) {
        callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
      } else {
        let auth = new AuthInterceptor();
        let token = auth.issueTokenWithUid(res);
        let host = config.get('application.mail.host');
        let link = host + 'signin?access_token=' + token + '&_id=' + res._id;
        let htmlTemplate = 'welcome-aboard.html';
        let data:Map<string,string>= new Map([['$applicationLink$',config.get('application.mail.host')],
          ['$first_name$',res.first_name],['$link$',link],['$app_name$',this.APP_NAME]]);
        let attachment=MailAttachments.WelcomeAboardAttachmentArray;
        sendMailService.send( user.email, Messages.EMAIL_SUBJECT_CANDIDATE_REGISTRATION, htmlTemplate, data,attachment,
          (err: any, result: any) => {
            callback(err, result);
          });
        }
    });
  }

  assignFreeSubscriptionPackage(user: UserModel, freeSubscription: SubscriptionPackage) {
    let subscription = new UserSubscription();
    subscription.activationDate = new Date();
    subscription.numOfBuildings = freeSubscription.basePackage.numOfBuildings;
    subscription.numOfProjects = freeSubscription.basePackage.numOfProjects;
    subscription.validity = freeSubscription.basePackage.validity;
    subscription.projectId = new Array<string>();
    subscription.purchased = new Array<BaseSubscriptionPackage>();
    subscription.purchased.push(freeSubscription.basePackage);
    user.subscription = new Array<UserSubscription>();
    user.subscription.push(subscription);
  }

  login(data: any, callback:(error: any, result: any) => void) {
    this.retrieve({'email': data.email}, (error, result) => {
      if (error) {
        callback(error, null);
      } else if (result.length > 0 && result[0].isActivated === true) {
        bcrypt.compare(data.password, result[0].password, (err: any, isSame: any) => {
          if (err) {
            callback({
              reason: Messages.MSG_ERROR_RSN_INVALID_REGISTRATION_STATUS,
              message: Messages.MSG_ERROR_VERIFY_CANDIDATE_ACCOUNT,
              stackTrace: new Error(),
              actualError: err,
              code: 500
            }, null);
          } else {
            /*console.log('got user');*/
            if (isSame) {
              let auth = new AuthInterceptor();
              let token = auth.issueTokenWithUid(result[0]);
              var data: any = {
                'status': Messages.STATUS_SUCCESS,
                'data': {
                  'first_name': result[0].first_name,
                  'last_name': result[0].last_name,
                  'company_name': result[0].company_name,
                  'email': result[0].email,
                  '_id': result[0]._id,
                  'current_theme': result[0].current_theme,
                  'picture': result[0].picture,
                  'mobile_number': result[0].mobile_number,
                  'access_token': token
                },
                access_token: token
              };
              callback(null, data);
            } else {
              callback({
                reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                message: Messages.MSG_ERROR_WRONG_PASSWORD,
                stackTrace: new Error(),
                code: 400
              }, null);
            }
          }
        });
      } else if (result.length > 0 && result[0].isActivated === false) {
        callback({
          reason: Messages.MSG_ERROR_RSN_INVALID_REGISTRATION_STATUS,
          message: Messages.MSG_ERROR_VERIFY_CANDIDATE_ACCOUNT,
          stackTrace: new Error(),
          code: 500
        }, null);
      } else {
        callback({
          reason: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
          message: Messages.MSG_ERROR_USER_NOT_PRESENT,
          stackTrace: new Error(),
          code: 400
        },null);
      }
    });
  }

  sendOtp(params: any, user: any, callback:(error: any, result: any) => void) {
    let Data = {
      new_mobile_number: params.mobile_number,
      old_mobile_number: user.mobile_number,
      _id: user._id
    };
    this.generateOtp(Data, (error, result) => {
      if (error) {
        if (error === Messages.MSG_ERROR_CHECK_MOBILE_PRESENT) {
          callback({
            reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
            message: Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER,
            stackTrace: new Error(),
            code: 400
          }, null);
        } else {
          callback(error, null);
        }
      } else if (result.length > 0) {
        callback({
          'status': Messages.STATUS_SUCCESS,
          'data': {
            'message': Messages.MSG_SUCCESS_OTP
          }
        }, null);
      } else {
        callback({
          reason: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
          message: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
          stackTrace: new Error(),
          code: 400
        }, null);
      }
    });
  }

  generateOtp(field: any, callback: (error: any, result: any) => void) {
    this.userRepository.retrieve({'mobile_number': field.new_mobile_number, 'isActivated': true}, (err, res) => {

      if (err) {
      } else if (res.length > 0 && (res[0]._id) !== field._id) {
        callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
      } else if (res.length === 0) {

        let query = {'_id': field._id};
        let otp = Math.floor((Math.random() * 99999) + 100000);
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

  verifyOtp(params: any, user:any, callback:(error:any, result:any) => void) {
    let mailChimpMailerService = new MailChimpMailerService();

    let query = {'_id': user._id, 'isActivated': false};
    let updateData = {'isActivated': true, 'activation_date': new Date()};
    if (user.otp === params.otp) {
      this.findOneAndUpdate(query, updateData, {new: true}, (error, result) => {
        if (error) {
          callback(error, null);
        } else {
          callback(null,{
            'status': 'Success',
            'data': {'message': 'User Account verified successfully'}
          });
          mailChimpMailerService.onCandidateSignSuccess(result);

        }
      });
    } else {
      callback({
        reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
        message: Messages.MSG_ERROR_WRONG_OTP,
        stackTrace: new Error(),
        code: 400
      }, null);
    }

  }

  changeMobileNumber(field: any, callback: (error: any, result: any) => void) {

    let query = {'_id': field._id};
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
    let query = {'email': field.email};

    this.userRepository.retrieve(query, (err, res) => {

      if (res.length > 0 && res[0].isActivated === true) {

        let auth = new AuthInterceptor();
        let token = auth.issueTokenWithUid(res[0]);
        let host = config.get('application.mail.host');
        let link = host + 'reset-password?access_token=' + token + '&_id=' + res[0]._id;
        let htmlTemplate = 'forgotpassword.html';
        let data:Map<string,string>= new Map([['$applicationLink$',config.get('application.mail.host')],
          ['$first_name$',res[0].first_name],['$link$',link],['$app_name$',this.APP_NAME]]);
        let attachment=MailAttachments.ForgetPasswordAttachmentArray;
        sendMailService.send( field.email, Messages.EMAIL_SUBJECT_FORGOT_PASSWORD, htmlTemplate, data,attachment,
(err: any, result: any) => {
            callback(err, result);
          });
      } else if (res.length > 0 && res[0].isActivated === false) {
        callback(new Error(Messages.MSG_ERROR_ACCOUNT_STATUS), res);
      } else {
        callback(new Error(Messages.MSG_ERROR_USER_NOT_FOUND), res);
      }
    });

  }


  SendChangeMailVerification(field: any, callback: (error: any, result: SentMessageInfo) => void) {
    let query = {'email': field.current_email, 'isActivated': true};
    let updateData = {$set:{'temp_email': field.new_email}};
    this.userRepository.findOneAndUpdate(query, updateData, {new: true}, (error: any, result: any) => {
      if (error) {
        callback(new Error(Messages.MSG_ERROR_EMAIL_ACTIVE_NOW), null);
      } else if(result == null) {
        callback(new Error(Messages.MSG_ERROR_VERIFY_ACCOUNT), null);
      } else {
        let auth = new AuthInterceptor();
        let token = auth.issueTokenWithUid(result);
        let host = config.get('application.mail.host');
        let link = host + 'activate-user?access_token=' + token + '&_id=' + result._id+'isEmailVerification';
        let sendMailService = new SendMailService();
        let data: Map<string, string> = new Map([['$applicationLink$',config.get('application.mail.host')],
          ['$link$', link]]);
        let attachment=MailAttachments.AttachmentArray;
        sendMailService.send(field.new_email,
          Messages.EMAIL_SUBJECT_CHANGE_EMAILID,
          'change.mail.html', data,attachment, callback);
      }
    });
  }


 /* sendVerificationMail(field: any, callback: (error: any, result: SentMessageInfo) => void) {

    this.userRepository.retrieve({'email': field.email}, (err, res) => {
      if (res.length > 0) {
        this.recruiterRepository.retrieve({'userId': new mongoose.Types.ObjectId(res[0]._id)}, (err, recruiter) => {
          if (err) {
            callback(err, null);
          } else {
            this.company_name = recruiter[0].company_name;
            let auth = new AuthInterceptor();
            let token = auth.issueTokenWithUid(recruiter[0]);
            let host = config.get('application.mail.host');
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
  }*/

/*  sendRecruiterVerificationMail(field: any, callback: (error: any, result: SentMessageInfo) => void) {

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
  }*/


  sendMail(field: any, callback: (error: any, result: SentMessageInfo) => void) {
    let sendMailService = new SendMailService();
    let data:Map<string,string>= new Map([['$applicationLink$',config.get('application.mail.host')],
      ['$first_name$',field.first_name],['$email$',field.email],['$message$',field.message]]);
    let attachment=MailAttachments.AttachmentArray;
    sendMailService.send(config.get('application.mail.ADMIN_MAIL'),
      Messages.EMAIL_SUBJECT_USER_CONTACTED_YOU,
      'contactus.mail.html',data,attachment,callback);
  }

  sendMailOnError(errorInfo: any, callback: (error: any, result: SentMessageInfo) => void) {
    let current_Time = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    let data:Map<string,string>;
    if(errorInfo.stackTrace) {
       data= new Map([['$applicationLink$',config.get('application.mail.host')],
         ['$time$',current_Time],['$host$',config.get('application.mail.host')],
        ['$reason$',errorInfo.reason],['$code$',errorInfo.code],
        ['$message$',errorInfo.message],['$error$',errorInfo.stackTrace.stack]]);

    } else if(errorInfo.stack) {
      data= new Map([['$applicationLink$',config.get('application.mail.host')],
        ['$time$',current_Time],['$host$',config.get('application.mail.host')],
        ['$reason$',errorInfo.reason],['$code$',errorInfo.code],
        ['$message$',errorInfo.message],['$error$',errorInfo.stack]]);
    }
    let sendMailService = new SendMailService();
    let attachment = MailAttachments.AttachmentArray;
    sendMailService.send(config.get('application.mail.ADMIN_MAIL'),
      Messages.EMAIL_SUBJECT_SERVER_ERROR + ' on ' + config.get('application.mail.host'),
      'error.mail.html',data,attachment, callback,config.get('application.mail.TPLGROUP_MAIL'));
  }

  findById(id: any, callback: (error: any, result: any) => void) {
    this.userRepository.findById(id, callback);
  }

  retrieve(field: any, callback: (error: any, result: any) => void) {
    this.userRepository.retrieve(field, callback);
  }

  retrieveWithLimit(field: any, included : any, callback: (error: any, result: any) => void) {
    let limit = config.get('application.limitForQuery');
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
  }

  update(_id: any, item: any, callback: (error: any, result: any) => void) {

    this.userRepository.findById(_id, (err: any, res: any) => {

      if (err) {
        callback(err, res);
      } else {
        this.userRepository.update(_id, item, callback);
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
    //this.userRepository.retrieveBySortedOrder(query, projection, sortingQuery, callback);
  }

  resetPassword(data: any, user : any, callback:(error: any, result: any) =>any) {
    const saltRounds = 10;
    bcrypt.hash(data.new_password, saltRounds, (err: any, hash: any) => {
      if (err) {
        callback({
          reason: 'Error in creating hash using bcrypt',
          message: 'Error in creating hash using bcrypt',
          stackTrace: new Error(),
          code: 403
        }, null);
      } else {
        let updateData = {'password': hash};
        let query = {'_id': user._id, 'password': user.password};
        this.findOneAndUpdate(query, updateData, {new: true}, (error, result) => {
          if (error) {
            callback(error, null);
          } else {
            callback(null,{
              'status': 'Success',
              'data': {'message': 'Password changed successfully'}
            });
          }
        });
      }
    });
  }

  updateDetails(data:  UserModel, user: UserModel, callback:(error: any, result: any) => void) {
    let auth: AuthInterceptor = new AuthInterceptor();
    let query = {'_id': user._id};
    this.userRepository.findOneAndUpdate(query, data, {new: true}, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null,{
          'status': 'Success',
          'data': {'message': 'User Profile Updated successfully'}
        });
      }

    });
  }
  getUserById(user:any, callback:(error:any, result:any)=>void) {
    let auth: AuthInterceptor = new AuthInterceptor();

    let token = auth.issueTokenWithUid(user);
    callback(null,{
      'status': 'success',
      'data': {
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        'mobile_number': user.mobile_number,
        'company_name': user.company_name,
        'state': user.state,
        'city': user.city,
        'picture': user.picture,
        'social_profile_picture': user.social_profile_picture,
        '_id': user._id,
        'current_theme': user.current_theme
      },
      access_token: token
    });
  }

  verifyAccount(user:User, callback:(error:any, result:any)=>void) {
    let query = {'_id': user._id, 'isActivated': false};
    let updateData = {'isActivated': true};
    this.findOneAndUpdate(query, updateData, {new: true}, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null,{
          'status': 'Success',
          'data': {'message': 'User Account verified successfully'}
        });
      }

    });
  }

  changeEmailId(data:any, user : User, callback:(error:any, result:any)=>void) {
    let auth: AuthInterceptor = new AuthInterceptor();
    let query = {'email': data.new_email};

    this.retrieve(query, (error, result) => {

      if (error) {
        callback(error, null);
      } else if (result.length > 0 && result[0].isActivated === true) {
        callback({
          reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
          message: Messages.MSG_ERROR_REGISTRATION,
          stackTrace: new Error(),
          code: 400
        },null);
      } else if (result.length > 0 && result[0].isActivated === false) {
        callback({
          reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
          message: Messages.MSG_ERROR_ACCOUNT_STATUS,
          stackTrace: new Error(),
          code: 400
        }, null);
      } else {

        this.SendChangeMailVerification(data, (error, result) => {
          if (error) {
            if (error.message === Messages.MSG_ERROR_CHECK_EMAIL_ACCOUNT) {
              callback({
                reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
                message: Messages.MSG_ERROR_EMAIL_ACTIVE_NOW,
                stackTrace: new Error(),
                code: 400
              }, null);
            }if (error.message === Messages.MSG_ERROR_VERIFY_ACCOUNT) {
              callback({
                reason: Messages.MSG_ERROR_VERIFY_ACCOUNT,
                message: Messages.MSG_ERROR_VERIFY_ACCOUNT,
                stackTrace: new Error(),
                code: 400
              }, null);
            } else {
              callback({
                reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
                message: Messages.MSG_ERROR_WHILE_CONTACTING,
                stackTrace: new Error(),
                code: 400
              }, null);

            }
          } else {
            callback(null, {
              'status': Messages.STATUS_SUCCESS,
              'data': {'message': Messages.MSG_SUCCESS_EMAIL_CHANGE_EMAILID}
            });
          }
        });

      }
    });
  }

  verifyChangedEmailId(user: any, callback:(error : any, result : any)=> any) {
    let query = {'_id': user._id};
    let updateData = {'email': user.temp_email, 'temp_email': user.email};
    this.findOneAndUpdate(query, updateData, {new: true}, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null,{
          'status': 'Success',
          'data': {'message': 'User Account verified successfully'}
        });
      }

    });
  }

  verifyMobileNumber(data :any , user : any, callback:(error:any, result:any)=>void) {
    let query = {'_id': user._id};
    let updateData = {'mobile_number': user.temp_mobile, 'temp_mobile': user.mobile_number};
    if (user.otp === data.otp) {
      this.findOneAndUpdate(query, updateData, {new: true}, (error, result) => {
        if (error) {
          callback(error, null);
        } else {
          callback(null,{
            'status': 'Success',
            'data': {'message': 'User Account verified successfully'}
          });
        }
      });
    } else {
      callback({
        reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
        message: Messages.MSG_ERROR_WRONG_OTP,
        stackTrace: new Error(),
        code: 400
      }, null);
    }
  }

  getProjects(user: User, callback:(error : any, result :any)=>void) {
    let query = {_id : user._id};
    this.userRepository.findAndPopulate(query, {path: 'project', select: 'name'}, (error, result) => {
      if(error) {
        callback(error, null);
      }else {
        let authInterceptor = new AuthInterceptor();
        callback(null, {data: result[0].project, access_token: authInterceptor.issueTokenWithUid(user)});
      }
    });
  }
}

Object.seal(UserService);
export = UserService;
