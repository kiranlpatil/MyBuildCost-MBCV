import UserRepository = require('../dataaccess/repository/UserRepository');
import SendMailService = require('./mailer.service');
import SendMessageService = require('./sendmessage.service');
import * as fs from 'fs';
import * as mongoose from 'mongoose';
let ObjectId = mongoose.Types.ObjectId;
import { SentMessageInfo } from 'nodemailer';
let config = require('config');
let path = require('path');
import Messages = require('../shared/messages');
import AuthInterceptor = require('../../framework/interceptor/auth.interceptor');
import ProjectAsset = require('../shared/projectasset');
import MailAttachments = require('../shared/sharedarray');
import { asElementData } from '@angular/core/src/view';
import bcrypt = require('bcrypt');
let log4js = require('log4js');
let logger = log4js.getLogger('User service');
import { MailChimpMailerService } from './mailchimp-mailer.service';
import UserModel = require('../dataaccess/model/UserModel');
import User = require('../dataaccess/mongoose/user');
import SubscriptionService = require('../../applicationProject/services/SubscriptionService');
import SubscriptionPackage = require('../../applicationProject/dataaccess/model/project/Subscription/SubscriptionPackage');
import BaseSubscriptionPackage = require('../../applicationProject/dataaccess/model/project/Subscription/BaseSubscriptionPackage');
import UserSubscription = require('../../applicationProject/dataaccess/model/project/Subscription/UserSubscription');
import ProjectRepository = require('../../applicationProject/dataaccess/repository/ProjectRepository');
import ProjectSubscriptionDetails = require('../../applicationProject/dataaccess/model/project/Subscription/ProjectSubscriptionDetails');
import messages  = require('../../applicationProject/shared/messages');
import constants  = require('../../applicationProject/shared/constants');
import ProjectSubcription = require('../../applicationProject/dataaccess/model/company/ProjectSubcription');
let CCPromise = require('promise/lib/es6-extensions');
let log4js = require('log4js');
let logger = log4js.getLogger('User service');

class UserService {
  APP_NAME: string;
  company_name: string;
  mid_content: any;
  isActiveAddBuildingButton:boolean=false;
  private userRepository: UserRepository;
  private projectRepository : ProjectRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.projectRepository = new ProjectRepository();
    this.APP_NAME = ProjectAsset.APP_NAME;
  }

  createUser(item: any, callback: (error: any, result: any) => void) {
    this.userRepository.retrieve({'email': item.email}, (err, res) => {
      if (err) {
        callback(new Error(err), null);
      } else if (res.length > 0) {
        logger.debug('Email already exist'+JSON.stringify(res));

        if (res[0].isActivated === true) {
          callback(new Error(Messages.MSG_ERROR_REGISTRATION), null);
        } else if (res[0].isActivated === false) {
          callback(new Error(Messages.MSG_ERROR_VERIFY_ACCOUNT), null);
        }

      } else {
        logger.debug('Email not present.'+JSON.stringify(res));
        const saltRounds = 10;
        bcrypt.hash(item.password, saltRounds, (err: any, hash: any) => {
          if (err) {
            logger.error('Error in creating hash password');
            callback({
              reason: 'Error in creating hash using bcrypt',
              message: 'Error in creating hash using bcrypt',
              stackTrace: new Error(),
              code: 403
            }, null);
          } else {
            logger.debug('created hash succesfully.');
            item.password = hash;
            let subScriptionService = new SubscriptionService();
            subScriptionService.getSubscriptionPackageByName('Free','BasePackage', (err: any,
                                                                      freeSubscription: Array<SubscriptionPackage>) => {
              if (freeSubscription.length > 0) {
                logger.debug('freeSubscription length  > 0');
                this.assignFreeSubscriptionAndCreateUser(item, freeSubscription[0], callback);
              }else {
                logger.debug('freeSubscription length !==0');
                subScriptionService.addSubscriptionPackage(config.get('subscription.package.Free'),
                  (err: any, freeSubscription)=> {
                    logger.debug('assigning free subscription by creating new user');
                    this.assignFreeSubscriptionAndCreateUser(item, freeSubscription, callback);
                });
              }

            });

          }
        });
      }

    });
  }

  checkForValidSubscription(userid : string, callback : (error : any, result: any) => void) {

    let query = [
      { $match: {'_id':userid}},
      { $project : {'subscription':1}},
      { $unwind: '$subscription'}
    ];
    this.userRepository.aggregate(query ,(error, result) => {
      if (error) {
        callback(error, null);
      } else {
        let validSubscriptionPackage;
        if(result.length > 0) {
          for(let subscriptionPackage of result) {
            if(subscriptionPackage.subscription.projectId.length === 0) {
              validSubscriptionPackage = subscriptionPackage;
            }
          }
        }
        callback(null, validSubscriptionPackage);
      }
    });
  }

   assignFreeSubscriptionAndCreateUser(item: any, freeSubscription: SubscriptionPackage, callback: (error: any, result: any) => void) {
    let user: UserModel = item;
    let sendMailService = new SendMailService();
    this.assignFreeSubscriptionPackage(user, freeSubscription);
    logger.debug('Creating user with new free trail subscription package');
    this.userRepository.create(user, (err:Error, res:any) => {
      if (err) {
        logger.error('Failed to Creating user subscription package');
        callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
      } else {
        logger.debug('created user succesfully.'+JSON.stringify(res));
        let auth = new AuthInterceptor();
        let token = auth.issueTokenWithUid(res);
        let host = config.get('application.mail.host');
        let link = host + 'signin?access_token=' + token + '&_id=' + res._id;
        let htmlTemplate = 'welcome-aboard.html';
        let data:Map<string,string>= new Map([['$applicationLink$',config.get('application.mail.host')],
          ['$first_name$',res.first_name],['$link$',link],['$app_name$',this.APP_NAME]]);
        let attachment = MailAttachments.WelcomeAboardAttachmentArray;
        logger.debug('sending mail to new user.'+JSON.stringify(attachment));
        sendMailService.send( user.email, Messages.EMAIL_SUBJECT_CANDIDATE_REGISTRATION, htmlTemplate, data,attachment,
          (err: any, result: any) => {
            callback(err, result);
          });
        }
    });
  }

  getUserForCheckingBuilding(userId:string,projectId:string,user:User,callback: (error: any, result: any) => void) {
    let query= [
      { $match: {'_id':userId}},
      { $project : {'subscription':1}},
      { $unwind: '$subscription'},
      { $match: {'subscription.projectId':projectId}}
    ];
    this.userRepository.aggregate(query,(error,result)=> {
      if(error) {
        callback(error,null);
      }else {
        if(result.length > 0) {
          for(let subscriptionPackage of result) {
              if(subscriptionPackage && subscriptionPackage.subscription.projectId!==null) {
                let query = {_id: projectId};
                let populate = {path: 'building', select: ['name', 'buildings',]};
                this.projectRepository.findAndPopulate(query, populate, (error, result) => {
                  if (error) {
                    callback(error, null);
                  } else {
                    let noOfBuildings=result.buildings.length;
                    if(subscriptionPackage && noOfBuildings <= subscriptionPackage.subscription.numOfBuildings) {
                      this.isActiveAddBuildingButton=false;
                    }else {
                      this.isActiveAddBuildingButton=true;
                    }
                    }
                  callback(null,result);

                });
              }
            }
        }
      }
      callback(null,{data:this.isActiveAddBuildingButton});
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
          ['$first_name$',res[0].first_name],['$user_mail$',res[0].email],['$link$',link],['$app_name$',this.APP_NAME]]);
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

  assignPremiumPackage(user:User,userId:string,callback: (error: any, result: any) => void) {
    let projection = {subscription: 1};
    this.userRepository.findByIdWithProjection(userId,projection,(error,result)=> {
      if(error) {
        callback(error,null);
      }else {
        let subScriptionArray = result.subscription;
        let subScriptionService = new SubscriptionService();
        subScriptionService.getSubscriptionPackageByName('Premium','BasePackage',
          (error: any, subscriptionPackage: Array<SubscriptionPackage>) => {
            if(error) {
              callback(error,null);
            } else {
              let premiumPackage = subscriptionPackage[0];
              if(subScriptionArray[0].projectId.length === 0) {
                subScriptionArray[0].numOfBuildings = premiumPackage.basePackage.numOfBuildings;
                subScriptionArray[0].numOfProjects = premiumPackage.basePackage.numOfProjects;
                subScriptionArray[0].validity = subScriptionArray[0].validity + premiumPackage.basePackage.validity;
                subScriptionArray[0].purchased.push(premiumPackage.basePackage);
              }else {
                let subscription = new UserSubscription();
                subscription.activationDate = new Date();
                subscription.numOfBuildings = premiumPackage.basePackage.numOfBuildings;
                subscription.numOfProjects = premiumPackage.basePackage.numOfProjects;
                subscription.validity = premiumPackage.basePackage.validity;
                subscription.projectId = new Array<string>();
                subscription.purchased = new Array<BaseSubscriptionPackage>();
                subscription.purchased.push(premiumPackage.basePackage);
                subScriptionArray.push(subscription);
              }
              let query = {'_id': userId};
              let newData = {$set: {'subscription': subScriptionArray}};
              this.userRepository.findOneAndUpdate(query, newData, {new: true}, (err, response) => {
                if (err) {
                  callback(err, null);
                } else {
                  callback(null, {data:'success'});
                }
              });
            }
        });
      }
    });
  }

  getProjects(user: User, callback:(error : any, result :any)=>void) {

    let query = {_id: user._id };
    let populate = {path: 'project', select: ['name','buildings','activeStatus']};
    this.userRepository.findAndPopulate(query, populate, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        let authInterceptor = new AuthInterceptor();
        let populatedProject = result[0];
        let projectList = result[0].project;
        let subscriptionList = result[0].subscription;

        let projectSubscriptionArray = Array<ProjectSubscriptionDetails>();
        let isAbleToCreateNewProject : boolean = false;

        for(let project of projectList) {
          for(let subscription of subscriptionList) {
            if(subscription.projectId.length !== 0) {
              if(subscription.projectId[0].equals(project._id)) {
                let projectSubscription = new ProjectSubscriptionDetails();
                projectSubscription.projectName = project.name;
                projectSubscription.projectId = project._id;
                projectSubscription.activeStatus = project.activeStatus;
                projectSubscription.numOfBuildingsRemaining = (subscription.numOfBuildings - project.buildings.length);
                projectSubscription.numOfBuildingsAllocated = project.buildings.length;
                projectSubscription.packageName = this.checkCurrentPackage(subscription);
                //activation date for project subscription
                let activation_date = new Date(subscription.activationDate);
                let expiryDate = new Date(subscription.activationDate);
                projectSubscription.expiryDate = new Date(expiryDate.setDate(activation_date.getDate() + subscription.validity));

                //expiry date for project subscription
                let current_date = new Date();
                var newExipryDate = new Date(projectSubscription.expiryDate);
                newExipryDate.setDate(projectSubscription.expiryDate.getDate() + 30);
                let noOfDays =  this.daysdifference(newExipryDate,  current_date);
                projectSubscription.numOfDaysToExpire = this.daysdifference(projectSubscription.expiryDate, current_date);

                if(projectSubscription.numOfDaysToExpire < 30 && projectSubscription.numOfDaysToExpire >0) {
                  projectSubscription.warningMessage =
                    'Expiring in ' +  Math.round(projectSubscription.numOfDaysToExpire) + ' days,' ;
                } else if(projectSubscription.numOfDaysToExpire <= 0 &&  noOfDays >= 0) {
                  projectSubscription.expiryMessage =  'Project expired,';
                }else if(noOfDays < 0) {
                  projectSubscription.activeStatus = false;
                }

                projectSubscriptionArray.push(projectSubscription);

              }
            } else  {
              isAbleToCreateNewProject = true;
            }
          }
        }

        if(projectList.length === 0 && subscriptionList[0].purchased.length !==0) {
          isAbleToCreateNewProject = true;
        }

        callback(null, {
          data: projectSubscriptionArray,
          isSubscriptionAvailable : isAbleToCreateNewProject,
          access_token: authInterceptor.issueTokenWithUid(user)
        });
      }
    });
  }

  //To check which is current package occupied by user.
   checkCurrentPackage(subscription:any) {
     let activation_date = new Date(subscription.activationDate);
     let expiryDate = new Date(subscription.activationDate);
     let expiryDateOuter = new Date(subscription.activationDate);
     let current_date = new Date();
     for(let purchasePackage of subscription.purchased) {
       expiryDateOuter = new Date(expiryDateOuter.setDate(activation_date.getDate() + purchasePackage.validity));
       for (let purchasePackage of subscription.purchased) {
         //expiry date for each package.
         expiryDate = new Date(expiryDate.setDate(activation_date.getDate() + purchasePackage.validity));
         if ((expiryDateOuter < expiryDate) && (expiryDate >=current_date)) {
           return purchasePackage.name;
           }
       }
       if(purchasePackage.name ==='Free') {
         return purchasePackage.name='Free';
       }else {
         return purchasePackage.name='Premium';
       }
     }
    }

  daysdifference(date1 : Date, date2 : Date) {
    let ONEDAY = 1000 * 60 * 60 * 24;
    let date1_ms = date1.getTime();
    let date2_ms = date2.getTime();
    let difference_ms = (date1_ms - date2_ms);
    return Math.round(difference_ms/ONEDAY);
  }

  getProjectSubscription(user: User, projectId: string, callback:(error : any, result :any)=>void) {

    let query = [
      {$match: {'_id':ObjectId(user._id)}},
      { $project : {'subscription':1}},
      { $unwind: '$subscription'},
      { $match: {'subscription.projectId' : ObjectId(projectId)}}
    ];
    this.userRepository.aggregate(query ,(error, result) => {
      if (error) {
        callback(error, null);
      } else {
        let query = { _id: projectId};
        let populate = {path : 'buildings'};
        this.projectRepository.findAndPopulate(query, populate, (error, resp) => {
          if (error) {
            callback(error, null);
          } else {
            let projectSubscription = new ProjectSubscriptionDetails();
            projectSubscription.projectName = resp[0].name;
            projectSubscription.projectId = resp[0]._id;
            projectSubscription.activeStatus = resp[0].activeStatus;
            projectSubscription.numOfBuildingsAllocated = resp[0].buildings.length;
            projectSubscription.numOfBuildingsRemaining = (result[0].subscription.numOfBuildings - resp[0].buildings.length);
            if(result[0].subscription.numOfBuildings === 10 && projectSubscription.numOfBuildingsRemaining ===0 && projectSubscription.packageName !== 'Free'){
              projectSubscription.addBuildingDisable=true;
              }
            projectSubscription.packageName = this.checkCurrentPackage(result[0].subscription);
            if(projectSubscription.packageName === 'Free' && projectSubscription.numOfBuildingsRemaining === 0){
              projectSubscription.addBuildingDisable=true;
            }

            let activation_date = new Date(result[0].subscription.activationDate);
            let expiryDate = new Date(result[0].subscription.activationDate);
            projectSubscription.expiryDate = new Date(expiryDate.setDate(activation_date.getDate() + result[0].subscription.validity));

            //expiry date for project subscription
            let current_date = new Date();
            var newExipryDate = new Date(projectSubscription.expiryDate);
            newExipryDate.setDate(projectSubscription.expiryDate.getDate() + 30);
            let noOfDays =  this.daysdifference(newExipryDate,  current_date);

            projectSubscription.numOfDaysToExpire = this.daysdifference(projectSubscription.expiryDate, current_date);

            if(projectSubscription.numOfDaysToExpire < 30 && projectSubscription.numOfDaysToExpire >0) {
              projectSubscription.warningMessage =
                'Expiring in ' +  Math.round(projectSubscription.numOfDaysToExpire) + ' days.' ;
            } else if(projectSubscription.numOfDaysToExpire <= 0 && noOfDays >= 0) {
              projectSubscription.expiryMessage = 'Project expired,';
            }else if(noOfDays < 0) {
              projectSubscription.activeStatus = false;
            }
            callback(null, projectSubscription);
          }
        });
      }
    });
  }

  updateSubscription(user : User, projectId: string, packageName: string,costForBuildingPurchased:any,numberOfBuildingsPurchased:any, callback:(error: any, result: any)=> void) {
    let query = [
      {$match: {'_id':ObjectId(user._id)}},
      { $project : {'subscription':1}},
      { $unwind: '$subscription'},
      { $match: {'subscription.projectId' : ObjectId(projectId)}}
    ];
   this.userRepository.aggregate(query, (error,result) => {
     if (error) {
       callback(error, null);
     } else {
       let subscription = result[0].subscription;
       this.updatePackage(user, subscription, packageName,costForBuildingPurchased,numberOfBuildingsPurchased,projectId,(error, result) => {
         if (error) {
           let error = new Error();
           error.message = messages.MSG_ERROR_WHILE_CONTACTING;
           callback(error, null);
         } else {
           if(packageName === constants.RENEW_PROJECT) {
             callback(null, {data: messages.MSG_SUCCESS_PROJECT_RENEW});
           } else {
             callback(null, {data: 'success'});
           }
         }
       });
     }
   });
  }

  updatePackage(user: User, subscription: any, packageName: string,costForBuildingPurchased:any,numberOfBuildingsPurchased:any, projectId:string, callback:(error: any, result: any)=> void) {
    let subScriptionService = new SubscriptionService();
    switch (packageName) {
      case 'Premium':
      {
        subScriptionService.getSubscriptionPackageByName('Premium','BasePackage',
          (error: any, subscriptionPackage: Array<SubscriptionPackage>) => {
            if(error) {
              callback(error,null);
            } else {
              let result = subscriptionPackage[0];
              subscription.numOfBuildings = result.basePackage.numOfBuildings;
              subscription.numOfProjects = result.basePackage.numOfProjects;
              let noOfDaysToExpiry = this.calculateValidity(subscription);
              subscription.validity = noOfDaysToExpiry + result.basePackage.validity;
              result.basePackage.cost = costForBuildingPurchased;
              subscription.purchased.push(result.basePackage);
              this.updateSubscriptionPackage(user._id, projectId,subscription, (error, result) => {
                if (error) {
                  callback(error, null);
                } else {
                  callback(null, {data: 'success'});
                }
              });
            }
          });
        break;
      }

      case 'RenewProject':
      {
        subScriptionService.getSubscriptionPackageByName('RenewProject','addOnPackage',
          (error: any, subscriptionPackage: Array<SubscriptionPackage>) => {
            if(error) {
              callback(error,null);
            } else {
              let result = subscriptionPackage[0];
              let noOfDaysToExpiry = this.calculateValidity(subscription);
              subscription.validity = noOfDaysToExpiry + result.addOnPackage.validity;
              result.addOnPackage.cost = costForBuildingPurchased;
              subscription.purchased.push(result.addOnPackage);
              this.updateSubscriptionPackage(user._id,projectId, subscription, (error, result) => {
                if (error) {
                  callback(error, null);
                } else {
                  callback(null, {data: 'Project Renewed successfully'});
                }
              });
            }
          });
        break;
      }

      case 'Add_building':
      {
        subScriptionService.getSubscriptionPackageByName('Add_building','addOnPackage',
          (error: any, subscriptionPackage: Array<SubscriptionPackage>) => {
            if(error) {
              callback(new Error(Messages.MSG_ERROR_BUILDINGS_PURCHASED_LIMIT), null);
            } else {
              let projectBuildingsLimit = subscription.numOfBuildings + numberOfBuildingsPurchased;
              if(projectBuildingsLimit <= 10) {
                let result = subscriptionPackage[0];
                result.addOnPackage.numOfBuildings = numberOfBuildingsPurchased;
                result.addOnPackage.cost = costForBuildingPurchased;
                subscription.numOfBuildings = subscription.numOfBuildings + result.addOnPackage.numOfBuildings;
                subscription.purchased.push(result.addOnPackage);
                this.updateSubscriptionPackage(user._id, projectId,subscription, (error, result) => {
                  if (error) {
                    callback(error, null);
                  } else {
                    callback(null, {data: 'success'});
                  }
                });
              } else {
                callback(new Error(Messages.MSG_ERROR_BUILDINGS_PURCHASED_LIMIT), null);
              }
            }
          });
        break;
      }
    }
  }

  updateSubscriptionPackage( userId: any, projectId:string,updatedSubscription: any, callback:(error: any, result: any)=> void) {
    let projection = {subscription: 1};
    this.userRepository.findByIdWithProjection(userId,projection,(error,result)=> {
      if (error) {
        callback(error, null);
      } else {
        let subScriptionArray = result.subscription;
        for (let subscriptionIndex =0; subscriptionIndex< subScriptionArray.length; subscriptionIndex++) {
          if (subScriptionArray[subscriptionIndex].projectId.length !== 0) {
            if (subScriptionArray[subscriptionIndex].projectId[0].equals(projectId)) {
              subScriptionArray[subscriptionIndex] = updatedSubscription;
            }
          }
        }
        let query = {'_id': userId};
        let newData = {$set: {'subscription': subScriptionArray}};
        this.userRepository.findOneAndUpdate(query, newData, {new: true}, (err, response) => {
          if (err) {
            callback(err, null);
          } else {
            callback(null, {data:'success'});
          }
        });
      }
    });
   }

  calculateValidity(subscription: any) {
    let activationDate = new Date(subscription.activationDate);
    let expiryDate = new Date(subscription.activationDate);
    let projectExpiryDate = new Date(expiryDate.setDate(activationDate.getDate() + subscription.validity));
    let current_date = new Date();
    let days = this.daysdifference(projectExpiryDate,current_date);
    return days;
  }

  sendProjectExpiryWarningMails(callback:(error : any, result :any)=>void) {
    logger.debug('sendProjectExpiryWarningMails is been hit');
    let query = [
      { $project : { 'subscription' : 1, 'first_name' : 1, 'email' : 1 }},
      { $unwind : '$subscription' },
      { $unwind : '$subscription.projectId' }
    ];

    this.userRepository.aggregate(query, (error, response) => {
      if(error) {
        logger.error('sendProjectExpiryWarningMails error : '+JSON.stringify(error));
        callback(error, null);
      } else {
        logger.debug('sendProjectExpiryWarningMails sucess');
        let userList = new Array<ProjectSubcription>();
        let userSubscriptionPromiseArray =[];

        for(let user of response) {
          logger.debug('geting all user data for sending mail to users.');
          let validityDays = this.calculateValidity(user.subscription);
          let valdityDaysValidation = config.get('cronJobMailNotificationValidityDays');
          if(valdityDaysValidation.includes(validityDays)) {
            let promiseObject = this.getProjectDataById(user);
            userSubscriptionPromiseArray.push(promiseObject);
          }
        }

        if(userSubscriptionPromiseArray.length !== 0) {

          CCPromise.all(userSubscriptionPromiseArray).then(function(data: Array<any>) {

            logger.debug('data recieved for all users: '+JSON.stringify(data));
            let sendMailPromiseArray = [];

            for(let user of data) {
              logger.debug('Calling sendMailForProjectExpiryToUser for user : '+JSON.stringify(user.first_name));
              let userService = new UserService();
              let sendMailPromise = userService.sendMailForProjectExpiryToUser(user);
              sendMailPromiseArray.push(sendMailPromise);
            }

            CCPromise.all(sendMailPromiseArray).then(function(mailSentData: Array<any>) {
              logger.debug('mailSentData for all users: '+JSON.stringify(mailSentData));
              callback(null, { 'data' : 'Mail sent successfully to users.' });
            }).catch(function(e:any) {
              logger.error('Promise failed for getting mailSentData ! :' +JSON.stringify(e.message));
              CCPromise.reject(e.message);
            });

          }).catch(function(e:any) {
            logger.error('Promise failed for send mail notification ! :' +JSON.stringify(e.message));
            CCPromise.reject(e.message);
          });
        }
      }
    });
  }

  getProjectDataById(user: any) {

    return new CCPromise(function (resolve: any, reject: any) {

      logger.debug('geting all user data for sending mail to users.');

      let projectSubscription = new ProjectSubcription();
      let projection = { 'name' : 1 };
      let projectRepository = new ProjectRepository();
      let userService = new UserService();

      projectRepository.findByIdWithProjection(user.subscription.projectId, projection, (error , resp) => {
        if(error) {
          logger.error('Error in fetching User data'+JSON.stringify(error));
          reject(error);
        } else {
          logger.debug('got ProjectSubscription for user '+ user._id);
          projectSubscription.userId = user._id;
          projectSubscription.userEmail = user.email;
          projectSubscription.first_name = user.first_name;
          projectSubscription.validityDays = user.subscription.validity;
          projectSubscription.projectExpiryDate = userService.calculateExpiryDate(user.subscription);
          projectSubscription.projectName = resp.name;
          resolve(projectSubscription);
        }
      });

    }).catch(function (e: any) {
      logger.error('Promise failed for individual createPromiseForGetProjectById ! Error: ' + JSON.stringify(e.message));
      CCPromise.reject(e.message);
    });
  }

  sendMailForProjectExpiryToUser(user: any) {

    return new CCPromise(function (resolve: any, reject: any) {

      let mailService = new SendMailService();

      let auth = new AuthInterceptor();
      let token = auth.issueTokenWithUid(user);
      let host = config.get('application.mail.host');
      let htmlTemplate = 'project-expiry-notification-mail.html';

      let data:Map<string,string>= new Map([
        ['$applicationLink$',config.get('application.mail.host')], ['$first_name$',user.first_name],
        ['$expiry_date$',user.projectExpiryDate], ['$subscription_link$',config.get('application.mail.host')],
        ['$app_name$','BuildInfo - Cost Control']]);

      let attachment = MailAttachments.AttachmentArray;
      mailService.send( user.userEmail, Messages.PROJECT_EXPIRY_WARNING, htmlTemplate, data,attachment,
        (err: any, result: any) => {
          if(err) {
            console.log('Failed to send mail to user : '+user.userEmail);
            reject(err);
          } else {
            console.log('Mail sent successfully to user : '+user.userEmail);
            resolve(result);
          }
        });

    }).catch(function (e: any) {
      logger.error('Promise failed for individual sendMailForProjectExpiryToUser ! Error: ' + JSON.stringify(e.message));
      CCPromise.reject(e.message);
    });
  }

  calculateExpiryDate(subscription : any) {
    let activationDate = new Date(subscription.activationDate);
    let expiryDate = new Date(subscription.activationDate);
    let projectExpiryDate = new Date(expiryDate.setDate(activationDate.getDate() + subscription.validity));
    return projectExpiryDate;
  }
}

Object.seal(UserService);
export = UserService;
