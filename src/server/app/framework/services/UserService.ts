import * as fs from 'fs';
import * as mongoose from 'mongoose';
import {SentMessageInfo} from 'nodemailer';
import bcrypt = require('bcrypt');
import UserRepository = require('../dataaccess/repository/UserRepository');
import SendMailService = require('./mailer.service');
import SendMessageService = require('./sendmessage.service');
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
import UserSubscriptionForRA = require('../../applicationProject/dataaccess/model/project/Subscription/UserSubscriptionForRA');
import NewUser = require("../../applicationProject/dataaccess/model/Users/NewUser");
import alasql = require('alasql');

import Constants = require('../../applicationProject/shared/constants');
import LoggerService = require('../shared/logger/LoggerService');
import Mobile = require("../../applicationProject/dataaccess/model/Users/Mobile");
import json2csv = require("json2csv");
import UsageTrackingRepository = require("../../applicationProject/dataaccess/repository/UsageTrackingRepository");

let CCPromise = require('promise/lib/es6-extensions');
let log4js = require('log4js');
let logger = log4js.getLogger('User service');
let ObjectId = mongoose.Types.ObjectId;
let config = require('config');
let path = require('path');
let request = require('request');
let xlsxj = require('xlsx-to-json');
var async =  require('async');

class UserService {
  APP_NAME: string;
  company_name: string;
  mid_content: any;
  projectName: string;
  isActiveAddBuildingButton: boolean = false;
  highestDateUser: Array<NewUser>;
  private userRepository: UserRepository;
  private projectRepository: ProjectRepository;
  private loggerService: LoggerService;
  private usageTrackingRepository : UsageTrackingRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.projectRepository = new ProjectRepository();
    this.loggerService = new LoggerService('UserService');
    this.APP_NAME = ProjectAsset.APP_NAME;
    this.usageTrackingRepository = new UsageTrackingRepository();
  }

  createUser(item: any, callback: (error: any, result: any) => void) {

    let query;
    if (item.typeOfApp === 'RAapp') {
      query = {'mobile_number': item.mobile_number};
    } else {
      query = {'email': item.email, 'typeOfApp':{ $exists: false }};
    }
    this.userRepository.retrieve(query, (err, res) => {
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
            if (item.typeOfApp !== 'RAapp') {
              subScriptionService.getSubscriptionPackageByName('Free', 'BasePackage', (err: any,
                                                                                       freeSubscription: Array<SubscriptionPackage>) => {
                if (freeSubscription.length > 0) {
                  this.assignFreeSubscriptionAndCreateUser(item, freeSubscription[0], callback);
                } else {
                  subScriptionService.addSubscriptionPackage(config.get('subscription.package.Free'),
                    (err: any, freeSubscription) => {
                      this.assignFreeSubscriptionAndCreateUser(item, freeSubscription, callback);
                    });
                }
              });
            } else {
              subScriptionService.getSubscriptionPackageByName('Trial', 'BasePackage', (err: any,
                                                                                        trialSubscription: Array<SubscriptionPackage>) => {

                if (trialSubscription.length > 0) {
                  this.assignFreeSubscriptionAndCreateUser(item, trialSubscription[0], callback);
                } else {
                  subScriptionService.addSubscriptionPackage(config.get('subscription.package.Trial'),
                    (error: any, trialSubscription) => {
                      this.assignFreeSubscriptionAndCreateUser(item, trialSubscription[0], callback);
                    });
                }
              });
            }
          }
        });
      }
    });
  }

  checkForValidSubscription(userid: string, callback: (error: any, result: any) => void) {

    let query = [
      {$match: {'_id': userid}},
      {$project: {'subscription': 1}},
      {$unwind: '$subscription'}
    ];
    this.userRepository.aggregate(query, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        if(result.length === 0) {
          callback({
            reason: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
            message: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
            stackTrace: new Error(),
            code: 401
          }, null);
          return;
        }
        let validSubscriptionPackage;
        if (result.length > 0) {
          for (let subscriptionPackage of result) {
            if (subscriptionPackage.subscription.projectId.length === 0) {
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
    if (item.typeOfApp !== 'RAapp') {
      this.assignFreeSubscriptionPackage(user, freeSubscription);
    } else {
      this.assignTrialSubscriptionPackage(user, freeSubscription);
    }
    this.userRepository.create(user, (err: Error, res: any) => {
      if (err) {
        logger.error('Failed to Creating user subscription package');
        callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
      } else {
        logger.debug('created user succesfully.'+JSON.stringify(res));
        callback(err, res);
        if (user && user.email) {
          let auth = new AuthInterceptor();
          let token = auth.issueTokenWithUid(res);
          let host = config.get('application.mail.host');
          let link = host + 'signin?access_token=' + token + '&_id=' + res._id;
          let htmlTemplate = 'welcome-aboard.html';
          let data: Map<string, string> = new Map([['$applicationLink$', config.get('application.mail.host')],
            ['$first_name$', res.first_name], ['$link$', link], ['$app_name$', this.APP_NAME]]);
          let attachment = MailAttachments.WelcomeAboardAttachmentArray;
          sendMailService.send(user.email, Messages.EMAIL_SUBJECT_CANDIDATE_REGISTRATION, htmlTemplate, data, attachment,
            (err: any, result: any) => {
              if (err) {
                logger.error(JSON.stringify(err));
              }
              logger.debug('Sending Mail : ' + JSON.stringify(result));
              //callback(err, result);
            }, config.get('application.mail.BUILDINFO_ADMIN_MAIL'));
        }
      }
    });
  }

  getUserForCheckingBuilding(userId: string, projectId: string, user: User, callback: (error: any, result: any) => void) {
    let query = [
      {$match: {'_id': userId}},
      {$project: {'subscription': 1}},
      {$unwind: '$subscription'},
      {$match: {'subscription.projectId': projectId}}
    ];
    this.userRepository.aggregate(query, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        if (result.length > 0) {
          for (let subscriptionPackage of result) {
            if (subscriptionPackage && subscriptionPackage.subscription.projectId !== null) {
              let query = {_id: projectId};
              let populate = {path: 'building', select: ['name', 'buildings',]};
              this.projectRepository.findAndPopulate(query, populate, (error, result) => {
                if (error) {
                  callback(error, null);
                } else {
                  let noOfBuildings = result.buildings.length;
                  if (subscriptionPackage && noOfBuildings <= subscriptionPackage.subscription.numOfBuildings) {
                    this.isActiveAddBuildingButton = false;
                  } else {
                    this.isActiveAddBuildingButton = true;
                  }
                }
                callback(null, result);

              });
            }
          }
        }
      }
      callback(null, {data: this.isActiveAddBuildingButton});
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

  assignTrialSubscriptionPackage(user: UserModel, freeSubscription: SubscriptionPackage) {
    let subscription = new UserSubscriptionForRA();
    subscription.activationDate = new Date();
    subscription.validity = freeSubscription.basePackage.validity;
    subscription.name = freeSubscription.basePackage.name;
    subscription.description = freeSubscription.basePackage.description;
    subscription.cost = freeSubscription.basePackage.cost;
    user.subscriptionForRA = subscription;
  }

  login(data: any, typeOfApp: any, callback: (error: any, result: any) => void) {

    let query;
    if (typeOfApp === 'RAapp') {
      query = {'mobile_number': data.mobile_number, 'typeOfApp': 'RAapp'};
    } else {
      query = {'email': data.email,'typeOfApp':{ $exists: false }};
    }

    this.retrieve(query, (error, result) => {
      if (error) {
        callback(error, null);
      } else if (result.length > 0 && result[0].isActivated === true) {
        bcrypt.compare(data.password, result[0].password, (err: any, isSame: any) => {
          if (err) {
            callback({
              reason: Messages.MSG_ERROR_RSN_INVALID_REGISTRATION_STATUS,
              message: Messages.MSG_ERROR_USER_NOT_PRESENT,
              stackTrace: new Error(),
              actualError: err,
              code: 500
            }, null);
          } else {
            /*console.log('got user');*/
            if (isSame) {
              let auth = new AuthInterceptor();
              let token = auth.issueTokenWithUid(result[0]);
              var resData: any = {
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
              if (typeOfApp === 'RAapp') {
                this.getUserSubscriptionDetails(result[0]._id, (error, result) => {
                  if (error) {
                    callback(error, null);
                  } else {
                    callback(null, {data: resData, subscriptionDetails: result});
                  }
                });
              } else {
                callback(null, resData);
              }
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
          code: 400
        }, null);
      } else {
        callback({
          reason: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
          message: Messages.MSG_ERROR_USER_NOT_PRESENT,
          stackTrace: new Error(),
          code: 400
        }, null);
      }
    });
  }

  sendOtp(params: any, user: any, callback: (error: any, result: any) => void) {
    let generateOtpObject = {
      new_mobile_number: params.mobile_number,
      _id: user._id
    };
    this.generateOtp(generateOtpObject, (error, result) => {
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
      } else if (result && result._doc) {
        callback(null, {
          'status': Messages.STATUS_SUCCESS,
          'data': {
            'message': Messages.MSG_SUCCESS_OTP,
            'newMobileNumber': result._doc.new_mobile_number
          }
        });
      } else if (result.ErrorCode === '000') {
        callback(null, {
          'status': Messages.STATUS_SUCCESS,
          'data': {
            'message': Messages.MSG_SUCCESS_OTP,
            'newMobileNumber': result.new_mobile_number
          }
        });
      } else if (result.ErrorCode === '021') {
        let tempError: any = new Object();
        tempError.reason = Messages.MSG_ERROR_INSUFFICIENT_CREDITS;
        tempError.code = 500;
        tempError.message = Messages.MSG_ERROR_INSUFFICIENT_CREDITS;
        tempError.stack = JSON.stringify(result);
        this.loggerService.logErrorObj(new Error(Messages.MSG_ERROR_INSUFFICIENT_CREDITS));
        this.sendMailOnErrorWithOutCallback(tempError);
        callback({
          reason: Messages.MSG_ERROR_INSUFFICIENT_CREDITS,
          message: Messages.MSG_ERROR_INSUFFICIENT_CREDITS,
          stackTrace: new Error(),
          code: 400
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

  generateOtp(generateOtpObject: any, callback: (error: any, result: any) => void) {
    let query = {'_id': generateOtpObject._id};
    let otp = Math.floor((Math.random() * 999) + 1000);
    // TODO decide whether to update 'mobile_number' with 'new_mobile_number'
    // let updateData = {'mobile_number': generateOtpObject.new_mobile_number, 'otp': otp};
    let updateData = {'otp': otp};
    // find user by _id and update user with new mobile number and new otp
    this.userRepository.findOneAndUpdate(query, updateData, {new: true}, (error, result) => {
      if (error) {
        callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
      } else {
        let messaging = config.get('application.messaging');
        let messageForEndUser = 'The One Time Password(OTP) for' + ' ' + messaging.appName + ' ' + 'account is' + ' ' + otp
          + '' + '. Use this OTP to verify your account.';
        console.log('message sent to user:', messageForEndUser);
        let url = messaging.url + '?user=' + messaging.user + '&password=' + messaging.password + '&msisdn=91'
          + generateOtpObject.new_mobile_number + '&sid=' + messaging.sid + '&msg=' + messageForEndUser + '&fl='
          + messaging.fl + '&gwid=' + messaging.gwid;

        // call post api of Orca info solutions to send OTP
        request.post({url: url, json: ''}, (error: any, response: any, body: any) => {
          if (error) {
            callback(error, null);
          } else if (!error && response) {
            let res = JSON.parse(response.body);
            // TODO check new_mobile_number against orca info response
            res.new_mobile_number = generateOtpObject.new_mobile_number;
            callback(null, res);
          }
        });
        // end of post api
        // result._doc.new_mobile_number = generateOtpObject.new_mobile_number;
        // callback(null, result);
      }
    });
  }

  verifyOtp(params: any, user: any, callback: (error: any, result: any) => void) {
    // let query = {'_id': user._id, 'isActivated': false};
    let query = {'_id': user._id};
    let updateData = {'isActivated': true, 'activation_date': new Date()};
    if (user.otp === parseInt(params.otp)) {
      // find user by _id and update user for otp verification
      this.findOneAndUpdate(query, updateData, {new: true}, (error, result) => {
        if (error) {
          callback(error, null);
        } else {
          callback(null, {
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

    // TODO check query for my-build-cost and ra-app
    let sendMailService = new SendMailService();
    let query = {'email': field.email};

    this.userRepository.retrieve(query, (err, res) => {

      if (res.length > 0 && res[0].isActivated === true) {

        let auth = new AuthInterceptor();
        let token = auth.issueTokenWithUid(res[0]);
        let host = config.get('application.mail.host');
        let link = host + 'reset-password?access_token=' + token + '&_id=' + res[0]._id;
        let htmlTemplate = 'forgotpassword.html';
        let data: Map<string, string> = new Map([['$applicationLink$', config.get('application.mail.host')],
          ['$first_name$', res[0].first_name], ['$user_mail$', res[0].email], ['$link$', link], ['$app_name$', this.APP_NAME]]);
        let attachment = MailAttachments.ForgetPasswordAttachmentArray;
        sendMailService.send(field.email, Messages.EMAIL_SUBJECT_FORGOT_PASSWORD, htmlTemplate, data, attachment,
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
    // TODO check query for my-build-cost and ra-app
    let query = {'email': field.current_email, 'isActivated': true};
    let updateData = {$set: {'temp_email': field.new_email}};
    this.userRepository.findOneAndUpdate(query, updateData, {new: true}, (error: any, result: any) => {
      if (error) {
        callback(new Error(Messages.MSG_ERROR_EMAIL_ACTIVE_NOW), null);
      } else if (result == null) {
        callback(new Error(Messages.MSG_ERROR_VERIFY_ACCOUNT), null);
      } else {
        let auth = new AuthInterceptor();
        let token = auth.issueTokenWithUid(result);
        let host = config.get('application.mail.host');
        let link = host + 'activate-user?access_token=' + token + '&_id=' + result._id + 'isEmailVerification';
        let sendMailService = new SendMailService();
        let data: Map<string, string> = new Map([['$applicationLink$', config.get('application.mail.host')],
          ['$link$', link]]);
        let attachment = MailAttachments.AttachmentArray;
        sendMailService.send(field.new_email,
          Messages.EMAIL_SUBJECT_CHANGE_EMAILID,
          'change.mail.html', data, attachment, callback);
      }
    });
  }

  sendMail(field: any, callback: (error: any, result: SentMessageInfo) => void) {
    let sendMailService = new SendMailService();
    let data: Map<string, string> = new Map([['$applicationLink$', config.get('application.mail.host')],
      ['$first_name$', field.first_name], ['$email$', field.email], ['$message$', field.message]]);
    let attachment = MailAttachments.AttachmentArray;
    sendMailService.send(config.get('application.mail.ADMIN_MAIL'),
      Messages.EMAIL_SUBJECT_USER_CONTACTED_YOU,
      'contactus.mail.html', data, attachment, callback);
  }

  sendMailOnError(errorInfo: any, callback: (error: any, result: SentMessageInfo) => void) {
    let current_Time = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    let data: Map<string, string>;
    if (errorInfo.stackTrace) {
      data = new Map([['$applicationLink$', config.get('application.mail.host')],
        ['$time$', current_Time], ['$host$', config.get('application.mail.host')],
        ['$reason$', errorInfo.reason], ['$code$', errorInfo.code],
        ['$message$', errorInfo.message], ['$error$', errorInfo.stackTrace.stack]]);

    } else if (errorInfo.stack) {
      data = new Map([['$applicationLink$', config.get('application.mail.host')],
        ['$time$', current_Time], ['$host$', config.get('application.mail.host')],
        ['$reason$', errorInfo.reason], ['$code$', errorInfo.code],
        ['$message$', errorInfo.message], ['$error$', errorInfo.stack]]);
    } else if (errorInfo.reason) {
      data = new Map([['$applicationLink$', config.get('application.mail.host')],
        ['$time$', current_Time], ['$host$', config.get('application.mail.host')],
        ['$reason$', errorInfo.reason], ['$code$', errorInfo.code],
        ['$message$', errorInfo.message], ['$error$', errorInfo.stack]]);
    }
    let sendMailService = new SendMailService();
    let attachment = MailAttachments.AttachmentArray;
    sendMailService.send(config.get('application.mail.ADMIN_MAIL'),
      Messages.EMAIL_SUBJECT_SERVER_ERROR + ' on ' + config.get('application.mail.host'),
      'error.mail.html', data, attachment, callback, config.get('application.mail.TPLGROUP_MAIL'));
  }

  findById(id: any, callback: (error: any, result: any) => void) {
    this.userRepository.findById(id, callback);
  }

  retrieve(field: any, callback: (error: any, result: any) => void) {
    this.userRepository.retrieve(field, callback);
  }

  retrieveWithLimit(field: any, included: any, callback: (error: any, result: any) => void) {
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

  retrieveBySortedOrder(query: any, projection: any, sortingQuery: any, callback: (error: any, result: any) => void) {
    //this.userRepository.retrieveBySortedOrder(query, projection, sortingQuery, callback);
  }

  resetPassword(data: any, user: any, callback: (error: any, result: any) => any) {
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
            callback(null, {
              'status': 'Success',
              'data': {'message': 'Password changed successfully'}
            });
          }
        });
      }
    });
  }

  updateDetails(data: UserModel, user: UserModel, callback: (error: any, result: any) => void) {
    let auth: AuthInterceptor = new AuthInterceptor();
    let query = {'_id': user._id};
    this.userRepository.findOneAndUpdate(query, data, {new: true}, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, {
          'status': 'Success',
          'data': {'message': 'User Profile Updated successfully'}
        });
      }

    });
  }

  getUserById(user: any, callback: (error: any, result: any) => void) {
    let auth: AuthInterceptor = new AuthInterceptor();

    let token = auth.issueTokenWithUid(user);
    callback(null, {
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

  verifyAccount(user: User, callback: (error: any, result: any) => void) {
    let query = {'_id': user._id, 'isActivated': false};
    let updateData = {'isActivated': true};
    this.findOneAndUpdate(query, updateData, {new: true}, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, {
          'status': 'Success',
          'data': {'message': 'User Account verified successfully'}
        });
      }

    });
  }

  changeEmailId(data: any, user: User, callback: (error: any, result: any) => void) {
    let auth: AuthInterceptor = new AuthInterceptor();
    // TODO check query for my-build-cost and ra-app
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
        }, null);
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
            }
            if (error.message === Messages.MSG_ERROR_VERIFY_ACCOUNT) {
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

  verifyChangedEmailId(user: any, callback: (error: any, result: any) => any) {
    let query = {'_id': user._id};
    let updateData = {'email': user.temp_email, 'temp_email': user.email};
    this.findOneAndUpdate(query, updateData, {new: true}, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, {
          'status': 'Success',
          'data': {'message': 'User Account verified successfully'}
        });
      }

    });
  }

  verifyMobileNumber(data: any, user: any, callback: (error: any, result: any) => void) {
    let query = {'_id': user._id};
    let updateData = {'mobile_number': user.temp_mobile, 'temp_mobile': user.mobile_number};
    if (user.otp === data.otp) {
      this.findOneAndUpdate(query, updateData, {new: true}, (error, result) => {
        if (error) {
          callback(error, null);
        } else {
          callback(null, {
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

  getUserSubscriptionDetails(userId: string, callback: (error: any, result: any) => void) {
    let projection = {subscriptionForRA: 1, mobile_number: 1};
    this.userRepository.findByIdWithProjection(userId, projection, (error, result) => {
      if (error ||result === null) {
        if(result === null) {
          callback({
            reason: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
            message: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
            stackTrace: new Error(),
            code: 401
          }, null);
          return;
        }
        callback(error, null);
      } else {
        let testUserMobileNumber = config.get('testUser.mobile_number');
        let subscriptionData = result.subscriptionForRA;
        let subscriptionDetails = this.getSubscriptionData(subscriptionData);
        if(result.mobile_number === testUserMobileNumber) {
          subscriptionDetails.testUser = true;
        }
        callback(null, subscriptionDetails);
      }
    });
  }

  getPaymentStatusOfUser(userId: string, callback: (error: any, result: any) => void) {
    let projection = {paymentStatus: 1};
    this.userRepository.findByIdWithProjection(userId, projection, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        logger.error('payemnt status of User : ' + JSON.stringify(result));
        callback(null, result);
      }
    });
  }

  getSubscriptionData(subscriptionData: UserSubscriptionForRA) {
    let subscriptionDetails = new UserSubscriptionForRA();
    subscriptionDetails.name = subscriptionData.name;
    let activation_date = new Date(subscriptionData.activationDate);
    let expiryDate = new Date(subscriptionData.activationDate);
    subscriptionDetails.expiryDate = new Date(expiryDate.setDate(activation_date.getDate() + subscriptionData.validity));
    let current_date = new Date();
    subscriptionDetails.noOfDaysToExpiry = this.daysdifference(subscriptionDetails.expiryDate, current_date);
     if (subscriptionDetails.noOfDaysToExpiry <= Constants.PREMIUM_PERIOD && subscriptionDetails.noOfDaysToExpiry > 0 && subscriptionData.name === 'RAPremium') {
      subscriptionDetails.warningMsgForPackage = 'Your subscription will expire in ' +
        Math.round(subscriptionDetails.noOfDaysToExpiry) + ' day(s).';

    } else if (subscriptionDetails.noOfDaysToExpiry <= 0) {
     if(subscriptionData.name === 'RAPremium') {
        subscriptionDetails.expiryMsgForPackage = 'Your subscription has expired.';
      }
      subscriptionDetails.isPackageExpired = true;
    }
    return subscriptionDetails;
  }

  assignPremiumPackage(user: User, userId: string, cost: number, callback: (error: any, result: any) => void) {
    let projection = {subscription: 1};
    this.userRepository.findByIdWithProjection(userId, projection, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        let subScriptionArray = result.subscription;
        let subScriptionService = new SubscriptionService();
        subScriptionService.getSubscriptionPackageByName('Premium', 'BasePackage',
          (error: any, subscriptionPackage: Array<SubscriptionPackage>) => {
            if (error) {
              callback(error, null);
            } else {
              let premiumPackage = subscriptionPackage[0];
              if (subScriptionArray[0].projectId.length === 0) {
                subScriptionArray[0].numOfBuildings = premiumPackage.basePackage.numOfBuildings;
                subScriptionArray[0].numOfProjects = premiumPackage.basePackage.numOfProjects;
                subScriptionArray[0].validity = subScriptionArray[0].validity + premiumPackage.basePackage.validity;
                subScriptionArray[0].purchased.push(premiumPackage.basePackage);
              } else {
                let subscription = new UserSubscription();
                subscription.activationDate = new Date();
                subscription.numOfBuildings = premiumPackage.basePackage.numOfBuildings;
                subscription.numOfProjects = premiumPackage.basePackage.numOfProjects;
                subscription.validity = premiumPackage.basePackage.validity;
                premiumPackage.basePackage.cost = cost;
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
                  callback(null, {data: 'success'});
                }
              });
            }
          });
      }
    });
  }

  getProjects(user: User, callback: (error: any, result: any) => void) {

    let query = {_id: user._id};
    let populate = {path: 'project', select: ['name', 'projectImage', 'buildings', 'activeStatus']};
    this.userRepository.findAndPopulate(query, populate, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        let authInterceptor = new AuthInterceptor();
        let populatedProject = result[0];
        let projectList = result[0].project;
        let subscriptionList = result[0].subscription;

        let projectSubscriptionArray = Array<ProjectSubscriptionDetails>();
        let sampleProjectSubscriptionArray = Array<ProjectSubscriptionDetails>();
        let isAbleToCreateNewProject: boolean = false;
        for (let project of projectList) {
          for (let subscription of subscriptionList) {
            if (subscription.projectId.length !== 0) {
              if (subscription.projectId[0].equals(project._id)) {
                let projectSubscription = new ProjectSubscriptionDetails();
                projectSubscription.projectName = project.name;
                projectSubscription.projectId = project._id;
                projectSubscription.activeStatus = project.activeStatus;
                projectSubscription.numOfBuildingsRemaining = (subscription.numOfBuildings - project.buildings.length);
                projectSubscription.numOfBuildingsAllocated = project.buildings.length;
                if (project && project.projectImage)
                  projectSubscription.projectImage = project.projectImage;
                projectSubscription.packageName = this.checkCurrentPackage(subscription);
                //activation date for project subscription
                let activation_date = new Date(subscription.activationDate);
                let expiryDate = new Date(subscription.activationDate);
                projectSubscription.expiryDate = new Date(expiryDate.setDate(activation_date.getDate() + subscription.validity));

                //expiry date for project subscription
                let current_date = new Date();
                var newExipryDate = new Date(projectSubscription.expiryDate);
                newExipryDate.setDate(projectSubscription.expiryDate.getDate() + 30);
                let noOfDays = this.daysdifference(newExipryDate, current_date);
                projectSubscription.numOfDaysToExpire = this.daysdifference(projectSubscription.expiryDate, current_date);

                if (projectSubscription.numOfDaysToExpire < 30 && projectSubscription.numOfDaysToExpire > 0) {
                  projectSubscription.warningMessage =
                    'Expiring in ' + Math.round(projectSubscription.numOfDaysToExpire) + ' days,';
                } else if (projectSubscription.numOfDaysToExpire <= 0 && noOfDays >= 0) {
                  projectSubscription.expiryMessage = 'Project expired,';
                } else if (noOfDays < 0) {
                  projectSubscription.activeStatus = false;
                }

                projectSubscriptionArray.push(projectSubscription);

              }
            } else {
              isAbleToCreateNewProject = true;
            }
          }
        }

        if (projectList.length === 0 && subscriptionList[0].purchased.length !== 0) {
          isAbleToCreateNewProject = true;
        }

        let projectId = config.get('sampleProject.' + 'projectId');
        let projection = {'name': 1, 'activeStatus': 1, 'projectImage': 1};
        let isAnySubscriptionAvailable =this.checkUserHaveActiveSubcription(subscriptionList,projectSubscriptionArray);
        this.projectRepository.findByIdWithProjection(projectId, projection, (error, project) => {
          if (error) {
            callback(error, null);
          } else {
            let data = project;
            let sampleProjectSubscription = new ProjectSubscriptionDetails();
            sampleProjectSubscription.projectName = project.name;
            sampleProjectSubscription.projectId = project._id;
            sampleProjectSubscription.activeStatus = project.activeStatus;
            if (project && project.projectImage)
              sampleProjectSubscription.projectImage = project.projectImage;
            sampleProjectSubscriptionArray.push(sampleProjectSubscription);
          }
          callback(null, {
            data: projectSubscriptionArray,
            sampleProject: sampleProjectSubscriptionArray,
            isSubscriptionAvailable: isAbleToCreateNewProject,
            isAnySubscriptionAvailable: isAnySubscriptionAvailable,
            access_token: authInterceptor.issueTokenWithUid(user)
          });
        });
      }
    });
  }
checkUserHaveActiveSubcription (subscriptionList :any ,projectSubscriptionArray:any) {

  let isAnySubscriptionAvailable: boolean = false;
  if(subscriptionList && subscriptionList.length === 1) {
    if (subscriptionList.length === projectSubscriptionArray.length) {
      for (let project of projectSubscriptionArray) {
        if (project.expiryMessage || !project.activeStatus) {
          // if never go to else means all projects are expired.
        } else {
          isAnySubscriptionAvailable = true;
        }
      }
    }else {
      if(projectSubscriptionArray.length === 0) {
        isAnySubscriptionAvailable = true;
      }
    }
  }else if(subscriptionList && subscriptionList.length >1) {
    if(subscriptionList &&subscriptionList[0] &&
      subscriptionList[0].purchased && subscriptionList[0].purchased.length > 1) {
      if (subscriptionList.length === projectSubscriptionArray.length) {
        for (let project of projectSubscriptionArray) {
          if (project.expiryMessage || !project.activeStatus) {
            // if never go to else means all projects are expired.
          } else {
            isAnySubscriptionAvailable = true;
          }
        }
      }else {
        isAnySubscriptionAvailable = true;
      }
    } else {
      if (subscriptionList.length-1 === projectSubscriptionArray.length-1) {
        for (let project of projectSubscriptionArray) {
          if (project.projectId === subscriptionList[0].projectId[0]) {
            continue;
          }
          if (project.expiryMessage || !project.activeStatus) {
            // if never go to else means all projects are expired.
          } else {
            isAnySubscriptionAvailable = true;
          }
        }
      }else if (subscriptionList.length-1 > projectSubscriptionArray.length-1) {
        isAnySubscriptionAvailable = true;
      }
    }
  }
   return isAnySubscriptionAvailable;
}

  //To check which is current package occupied by user.
  checkCurrentPackage(subscription: any) {
    let activation_date = new Date(subscription.activationDate);
    let expiryDate = new Date(subscription.activationDate);
    let expiryDateOuter = new Date(subscription.activationDate);
    let current_date = new Date();
    for (let purchasePackage of subscription.purchased) {
      expiryDateOuter = new Date(expiryDateOuter.setDate(activation_date.getDate() + purchasePackage.validity));
      for (let purchasePackage of subscription.purchased) {
        //expiry date for each package.
        expiryDate = new Date(expiryDate.setDate(activation_date.getDate() + purchasePackage.validity));
        if ((expiryDateOuter < expiryDate) && (expiryDate >= current_date)) {
          return purchasePackage.name;
        }
      }
      if (purchasePackage.name === 'Free') {
        return purchasePackage.name = 'Free';
      } else {
        return purchasePackage.name = 'Premium';
      }
    }
  }

  daysdifference(date1: Date, date2: Date) {
    let ONEDAY = 1000 * 60 * 60 * 24;
    let date1_ms = date1.getTime();
    let date2_ms = date2.getTime();
    let difference_ms = (date1_ms - date2_ms);
    return Math.round(difference_ms / ONEDAY);
  }

  getProjectSubscription(user: User, projectId: string, callback: (error: any, result: any) => void) {

    let query = [
      {$match: {'_id': ObjectId(user._id)}},
      {$project: {'subscription': 1}},
      {$unwind: '$subscription'},
      {$match: {'subscription.projectId': ObjectId(projectId)}}
    ];
    this.userRepository.aggregate(query, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        let query = {_id: projectId};
        let populate = {path: 'buildings'};
        this.projectRepository.findAndPopulate(query, populate, (error, resp) => {
          if (error) {
            callback(error, null);
          } else {

            if (resp.length > 0 && result.length > 0) {

              let projectSubscription = new ProjectSubscriptionDetails();
              projectSubscription.projectName = resp[0].name;
              projectSubscription.projectId = resp[0]._id;
              projectSubscription.activeStatus = resp[0].activeStatus;
              projectSubscription.numOfBuildingsAllocated = resp[0].buildings.length;
              projectSubscription.numOfBuildingsExist = result[0].subscription.numOfBuildings;
              projectSubscription.numOfBuildingsRemaining = (result[0].subscription.numOfBuildings - resp[0].buildings.length);
              if (resp[0] && resp[0].projectImage) {
                projectSubscription.projectImage = resp[0].projectImage;
              }
              if (result[0].subscription.numOfBuildings === 10 && projectSubscription.numOfBuildingsRemaining === 0
                && projectSubscription.packageName !== 'Free') {
                projectSubscription.addBuildingDisable = true;
              } else {
                projectSubscription.addBuildingDisable = false;
              }
              projectSubscription.packageName = this.checkCurrentPackage(result[0].subscription);
              if (projectSubscription.packageName === 'Free' && projectSubscription.numOfBuildingsRemaining === 0) {
                projectSubscription.addBuildingDisable = true;
              } else {
                projectSubscription.addBuildingDisable = false;
              }

              let activation_date = new Date(result[0].subscription.activationDate);
              let expiryDate = new Date(result[0].subscription.activationDate);
              projectSubscription.expiryDate = new Date(expiryDate.setDate(activation_date.getDate() + result[0].subscription.validity));

              //expiry date for project subscription
              let current_date = new Date();
              var newExipryDate = new Date(projectSubscription.expiryDate);
              newExipryDate.setDate(projectSubscription.expiryDate.getDate() + 30);
              let noOfDays = this.daysdifference(newExipryDate, current_date);

              projectSubscription.numOfDaysToExpire = this.daysdifference(projectSubscription.expiryDate, current_date);

              if (projectSubscription.numOfDaysToExpire < 30 && projectSubscription.numOfDaysToExpire > 0) {
                projectSubscription.warningMessage =
                  'Expiring in ' + Math.round(projectSubscription.numOfDaysToExpire) + ' days.';
              } else if (projectSubscription.numOfDaysToExpire <= 0 && noOfDays >= 0) {
                projectSubscription.expiryMessage = 'Project expired,';
              } else if (noOfDays < 0) {
                projectSubscription.activeStatus = false;
              }
              callback(null, projectSubscription);

            } else {
              callback(null, null);
            }
          }
        });
      }
    });
  }

  updateSubscription(user: User, projectId: string, packageName: string, costForBuildingPurchased: any,
                     numberOfBuildingsPurchased: any, callback: (error: any, result: any) => void) {
    let query = [
      {$match: {'_id': ObjectId(user._id)}},
      {$project: {'subscription': 1}},
      {$unwind: '$subscription'},
      {$match: {'subscription.projectId': ObjectId(projectId)}}
    ];
    this.userRepository.aggregate(query, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        let subscription = result[0].subscription;
        this.updatePackage(user, subscription, packageName, costForBuildingPurchased, numberOfBuildingsPurchased, projectId, (error, result) => {
          if (error) {
            let error = new Error();
            error.message = messages.MSG_ERROR_WHILE_CONTACTING;
            callback(error, null);
          } else {
            if (packageName === constants.RENEW_PROJECT) {
              callback(null, {data: messages.MSG_SUCCESS_PROJECT_RENEW});
            } else {
              callback(null, {data: 'success'});
            }
          }
        });
      }
    });
  }

  updatePackage(user: User, subscription: any, packageName: string, costForBuildingPurchased: any,
                numberOfBuildingsPurchased: any, projectId: string, callback: (error: any, result: any) => void) {
    let subScriptionService = new SubscriptionService();
    switch (packageName) {
      case 'Premium': {
        subScriptionService.getSubscriptionPackageByName('Premium', 'BasePackage',
          (error: any, subscriptionPackage: Array<SubscriptionPackage>) => {
            if (error) {
              callback(error, null);
            } else {
              let result = subscriptionPackage[0];
              subscription.numOfBuildings = result.basePackage.numOfBuildings;
              subscription.numOfProjects = result.basePackage.numOfProjects;
              let noOfDaysToExpiry = this.calculateValidity(subscription);
              subscription.validity = noOfDaysToExpiry + result.basePackage.validity;
              result.basePackage.cost = costForBuildingPurchased;
              subscription.purchased.push(result.basePackage);
              this.updateSubscriptionPackage(user._id, projectId, subscription, (error, result) => {
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

      case 'RenewProject': {
        subScriptionService.getSubscriptionPackageByName('RenewProject', 'addOnPackage',
          (error: any, subscriptionPackage: Array<SubscriptionPackage>) => {
            if (error) {
              callback(error, null);
            } else {
              let result = subscriptionPackage[0];
              let noOfDaysToExpiry = this.calculateValidity(subscription);
              subscription.validity = noOfDaysToExpiry + result.addOnPackage.validity;
              result.addOnPackage.cost = costForBuildingPurchased;
              subscription.purchased.push(result.addOnPackage);
              this.updateSubscriptionPackage(user._id, projectId, subscription, (error, result) => {
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

      case 'Add_building': {
        subScriptionService.getSubscriptionPackageByName('Add_building', 'addOnPackage',
          (error: any, subscriptionPackage: Array<SubscriptionPackage>) => {
            if (error) {
              callback(error, null);
            } else {
              let projectBuildingsLimit = subscription.numOfBuildings + numberOfBuildingsPurchased;
              let result = subscriptionPackage[0];
              result.addOnPackage.numOfBuildings = numberOfBuildingsPurchased;
              result.addOnPackage.cost = costForBuildingPurchased;
              subscription.numOfBuildings = subscription.numOfBuildings + result.addOnPackage.numOfBuildings;
              subscription.purchased.push(result.addOnPackage);
              this.updateSubscriptionPackage(user._id, projectId, subscription, (error, result) => {
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
    }
  }

  updateSubscriptionPackage(userId: any, projectId: string, updatedSubscription: any, callback: (error: any, result: any) => void) {
    let projection = {subscription: 1};
    this.userRepository.findByIdWithProjection(userId, projection, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        let subScriptionArray = result.subscription;
        for (let subscriptionIndex = 0; subscriptionIndex < subScriptionArray.length; subscriptionIndex++) {
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
            callback(null, {data: 'success'});
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
    let days = this.daysdifference(projectExpiryDate, current_date);
    return days;
  }

  sendProjectExpiryWarningMails(callback: (error: any, result: any) => void) {
    logger.debug('sendProjectExpiryWarningMails is been hit');
    let query = [
      {$project: {'subscription': 1, 'first_name': 1, 'email': 1}},
      {$unwind: '$subscription'},
      {$unwind: '$subscription.projectId'}
    ];

    this.userRepository.aggregate(query, (error, response) => {
      if (error) {
        logger.error('sendProjectExpiryWarningMails error : ' + JSON.stringify(error));
        callback(error, null);
      } else {
        logger.debug('sendProjectExpiryWarningMails sucess');
        let userList = new Array<ProjectSubcription>();
        let userSubscriptionPromiseArray = [];

        for (let user of response) {
          logger.debug('geting all user data for sending mail to users.');
          let validityDays = this.calculateValidity(user.subscription);
         let valdityDaysValidation = config.get('cronJobMailNotificationValidityDays');
          logger.debug('validityDays : ' + validityDays);
          if ( valdityDaysValidation.indexOf(validityDays)>=0) {
            logger.debug('calling promise');
            let promiseObject = this.getProjectDataById(user);
            userSubscriptionPromiseArray.push(promiseObject);
          } else {
            logger.debug('invalid validityDays : ' + validityDays);
          }
        }

        if (userSubscriptionPromiseArray.length !== 0) {

          CCPromise.all(userSubscriptionPromiseArray).then(function (data: Array<any>) {

            logger.debug('data recieved for all users: ' + JSON.stringify(data));
            let sendMailPromiseArray = [];

            for (let user of data) {
              logger.debug('Calling sendMailForProjectExpiryToUser for user : ' + JSON.stringify(user.first_name));
              let userService = new UserService();
              let sendMailPromise = userService.sendMailForProjectExpiryToUser(user);
              sendMailPromiseArray.push(sendMailPromise);
            }

            CCPromise.all(sendMailPromiseArray).then(function (mailSentData: Array<any>) {
              logger.debug('mailSentData for all users: ' + JSON.stringify(mailSentData));
              callback(null, {'data': 'Mail sent successfully to users.'});
            }).catch(function (e: any) {
              logger.error('Promise failed for getting mailSentData ! :' + JSON.stringify(e.message));
              CCPromise.reject(e.message);
            });

          }).catch(function (e: any) {
            logger.error('Promise failed for send mail notification ! :' + JSON.stringify(e.message));
            CCPromise.reject(e.message);
          });
        } else {
          logger.info('No any project is expired.');
        }
      }
    });
  }

  getProjectDataById(user: any) {

    return new CCPromise(function (resolve: any, reject: any) {

      logger.debug('geting all user data for sending mail to users.');

      let projectSubscription = new ProjectSubcription();
      let projection = {'name': 1};
      let projectRepository = new ProjectRepository();
      let userService = new UserService();

      projectRepository.findByIdWithProjection(user.subscription.projectId, projection, (error, resp) => {
        if (error) {
          logger.error('Error in fetching User data' + JSON.stringify(error));
          reject(error);
        } else {
          logger.debug('got ProjectSubscription for user ' + user._id);
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

      let data: Map<string, string> = new Map([
        ['$applicationLink$', config.get('application.mail.host')], ['$first_name$', user.first_name],
        ['$project_name$', user.projectName],
        ['$expiry_date$', user.projectExpiryDate], ['$subscription_link$', config.get('application.mail.host') + 'signin'],
        ['$app_name$', 'BuildInfo - Cost Control']]);

      let attachment = MailAttachments.AttachmentArray;
      mailService.send(user.userEmail, Messages.PROJECT_EXPIRY_WARNING, htmlTemplate, data, attachment,
        (err: any, result: any) => {
          if (err) {
            console.log('Failed to send mail to user : ' + user.userEmail);
            reject(err);
          } else {
            console.log('Mail sent successfully to user : ' + user.userEmail);
            resolve(result);
          }
        });

    }).catch(function (e: any) {
      logger.error('Promise failed for individual sendMailForProjectExpiryToUser ! Error: ' + JSON.stringify(e.message));
      CCPromise.reject(e.message);
    });
  }

  calculateExpiryDate(subscription: any) {
    let activationDate = new Date(subscription.activationDate);
    let expiryDate = new Date(subscription.activationDate);
    let projectExpiryDate = new Date(expiryDate.setDate(activationDate.getDate() + subscription.validity));
    let readabledate = projectExpiryDate.toDateString();
    return readabledate;
  }

  getUserExistenceStatus(mobileNumber: number, appType: string, callback: (error: any, result: any) => void) {
    let typeOfApp = 'RAapp';
    // TODO check query for my-build-cost and ra-app
    let query = {'mobile_number': mobileNumber, 'typeOfApp': typeOfApp};
    this.userRepository.retrieve(query, (error, result) => {
      if (error) {
        callback(error, null);
      } else if (appType === 'mobile-app' && result.length > 0 && result[0].isActivated === true) {
        let testUserMobileNumber = config.get('testUser.mobile_number');
        if(mobileNumber !== testUserMobileNumber) {
          this.sendOtp({mobile_number: mobileNumber}, {_id: result[0]._id}, (err: any, res: any) => {
            if (err) {
              callback(err, null);
            } else {
              callback(null, {
                'isActivated': false,
                'isPasswordSet': false,
                'id': result[0]._id,
                'mobileNumber': res.data.newMobileNumber,
                'user': result[0]
              });
            }
          });
        } else {
          callback(null, {
            'isActivated': false,
            'isPasswordSet': false,
            'id': result[0]._id,
            'mobileNumber': mobileNumber,
            'user': result[0]
          });
        }
      } else if (appType === 'forgot-password-flow' && result.length > 0 && result[0].isActivated === true) {
        this.sendOtp({mobile_number: mobileNumber}, {_id: result[0]._id}, (err: any, res: any) => {
          if (err) {
            callback(err, null);
          } else {
            callback(null, {
              'isActivated': true,
              'isPasswordSet': false,
              'id': result[0]._id,
              'mobileNumber': res.data.newMobileNumber,
              'user': result[0]
            });
          }
        });
      } else if (appType === 'web-app' && result.length > 0 && result[0].isActivated === true) {
        if (!result[0].password || result[0].password === undefined) {
          this.sendOtp({mobile_number: mobileNumber}, {_id: result[0]._id}, (err: any, res: any) => {
            if (err) {
              callback(err, null);
            } else {
              callback(null, {
                'isActivated': true,
                'isPasswordSet': false,
                'id': result[0]._id,
                'mobileNumber': res.data.newMobileNumber,
                'user': result[0]
              });
            }
          });
        } else {
          callback(null, {
            'isActivated': true,
            'isPasswordSet': true,
            'id': result[0]._id,
            'user': result[0]
          });
        }
      } else if (result.length > 0 && result[0].isActivated === false) {
        this.sendOtp({mobile_number: mobileNumber}, {_id: result[0]._id}, (err: any, res: any) => {
          if (err) {
            callback(err, null);
          } else {
            callback(null, {
              'isActivated': false,
              'isPasswordSet': false,
              'id': result[0]._id,
              'mobileNumber': res.data.newMobileNumber,
              'user': result[0]
            });
          }
        });
      } else {
        var item = {mobile_number: mobileNumber, isActivated: false, typeOfApp: 'RAapp'};
        let subscriptionService = new SubscriptionService();

        subscriptionService.getSubscriptionPackageByName('Trial', 'BasePackage', (err: any,
                                                                                  trialSubscription: Array<SubscriptionPackage>) => {

          if (trialSubscription.length > 0) {
            this.assignFreeSubscriptionAndCreateUser(item, trialSubscription[0], (err: any, model: any) => {
              if (err) {
                callback(err, null);
                return;
              }
              this.sendOtp({mobile_number: mobileNumber}, {_id: model._id}, (err: any, res: any) => {
                if (err) {
                  callback(err, null);
                } else {
                  callback(null, {
                    'isActivated': false,
                    'isPasswordSet': false,
                    'id': model._id,
                    'mobileNumber': res.data.newMobileNumber,
                    'user': model
                  });
                }
              });
            });
          } else {
            subscriptionService.addSubscriptionPackage(config.get('subscription.package.Trial'),
              (error: any, trialSubscription) => {
                this.assignFreeSubscriptionAndCreateUser(item, trialSubscription[0], (err: any, model: any) => {
                  if (err) {
                    callback(err, null);
                    return;
                  }
                  this.sendOtp({mobile_number: mobileNumber}, {_id: model._id}, (err: any, res: any) => {
                    if (err) {
                      callback(err, null);
                    } else {
                      callback(null, {
                        'isActivated': false,
                        'isPasswordSet': false,
                        'id': model._id,
                        'mobileNumber': res.data.newMobileNumber,
                        'user': model
                      });
                    }
                  });
                });
              });
          }
        });
      }
    });
  }

  updateSubscriptionDetails(userId: string, callback: (error: any, result: any) => void) {
    let subScriptionService = new SubscriptionService();
    let subscription = new UserSubscriptionForRA();
    subScriptionService.getSubscriptionPackageByName('RAPremium', 'BasePackage',
      (error: any, subscriptionPackage: Array<SubscriptionPackage>) => {
        if (error) {
          callback(error, null);
        } else {
          let query = {'_id' :userId };
          this.userRepository.retrieve(query, (error, result) => {
            if (error) {
              callback(error, null);
            } else {
              if(result[0].subscriptionForRA.name === 'Trial') {
                let result = subscriptionPackage[0];
                subscription.activationDate = new Date();
                subscription.validity = result.basePackage.validity;
                subscription.name = result.basePackage.name;
                subscription.description = result.basePackage.description;
                subscription.cost = result.basePackage.cost;
              } else if (result[0].subscriptionForRA.name === 'RAPremium') {
                let packageDetails = subscriptionPackage[0];
                let activation_date = new Date( result[0].subscriptionForRA.activationDate);
                let expiryDate = new Date( result[0].subscriptionForRA.activationDate);
                let actualexpiryDate = new Date(expiryDate.setDate(activation_date.getDate() + packageDetails.basePackage.validity));
                if(actualexpiryDate > new Date()) {
                  let current_date = new Date();
                  subscription.validity = this.daysdifference(actualexpiryDate, current_date) + packageDetails.basePackage.validity;
                } else if(actualexpiryDate <= new Date()) {
                  subscription.validity = packageDetails.basePackage.validity;
                }
                subscription.activationDate = new Date();
                subscription.name = packageDetails.basePackage.name;
                subscription.description = packageDetails.basePackage.description;
                subscription.cost = packageDetails.basePackage.cost;
              }

            }
            let query = {'_id': userId};
            let updateData = {'subscriptionForRA': subscription, 'paymentStatus': 'success'};
            this.userRepository.findOneAndUpdate(query, updateData, {new: true}, (error, result) => {
              if (error) {
                callback(error, null);
              } else {
                callback(null, result);
              }
            });
          });
        }
      });
  }

  sendMailOnErrorWithOutCallback(errorInfo: any) {
    this.sendMailOnError(errorInfo, (error: any, result: any) => {
      if (error) {
        this.loggerService.logErrorObj(error);
      }
    });
  }
  updateUserData(callback: (err: any, result: any) => void) {
    // let rr = 'C:\\Users\\Nilesh\\Webstorm Projects\\costcontrol\\AllData.xlsx';
    let rr = path.resolve() + config.get('application.userFile');
    xlsxj({
      input: rr,
      output: null
    }, (err: any, result: any) => {
      if (err) {
        callback(err, null);
      } else {
        let noArray = Array<Mobile>();
        let subScriptionService = new SubscriptionService();
        subScriptionService.getSubscriptionPackageByName('RAPremium', 'BasePackage',
          (error: any, subscriptionPackageDetails: Array<SubscriptionPackage>) => {
            if (error) {
              callback(error, null);
            } else {
              let subscriptionPackage = subscriptionPackageDetails[0];
              let users = [];
              for (let i = 0; i < result.length; i++) {

                let number = new Mobile();
                number.mobile_number = result[i].App_Cellnumber;
                number.app_Installed_Date = result[i].App_InstalledOn;
                number.appCode = result[i].AppCode;
                noArray.push(number);

                let isMobileNoExits = alasql('SELECT COUNT(*) AS totalCount  FROM ? where  mobile_number = ' +
                  '"' + result[i].App_Cellnumber + '"', [noArray]);

                if (isMobileNoExits[0].totalCount <= 1) {
                  let totalCountOfMobileNo = alasql('SELECT COUNT(App_Cellnumber) AS totalCount  FROM ? where App_Cellnumber = ' +
                    '"' + result[i].App_Cellnumber + '"', [result]);

                  let getUserSQL = alasql('SELECT EmailAddress, App_Cellnumber, AppCode, DATE(App_InstalledOn) as date FROM ? where App_Cellnumber = ' + '"' + result[i].App_Cellnumber + '"' , [result]);

                  let duplicateUser =getUserSQL.reduce(function(result, current) {
                    result[current.AppCode] = result[current.AppCode] || [];
                    result[current.AppCode].push(current);
                    return result;
                  }, {});


if(duplicateUser.hasOwnProperty("RAP")){
  this.highestDateUser= duplicateUser.RAP.reduce(function (a, b) { return a.date > b.date ? a : b; });
} else if(Object.keys(duplicateUser).length ===2 ){
  let highestUsers=[];
  if(duplicateUser.hasOwnProperty("RA")) {
    highestUsers.push(duplicateUser.RA.reduce(function (a, b) {
      return a.date > b.date ? a : b;
    }));
  }
  if(duplicateUser.hasOwnProperty("MA")) {
    highestUsers.push(duplicateUser.MA.reduce(function (a, b) {
      return a.date > b.date ? a : b;
    }));
  }
  this.highestDateUser= highestUsers.reduce(function (a, b) { return a.date > b.date ? a : b; });
}else if(duplicateUser.hasOwnProperty("RA")){
  this.highestDateUser= duplicateUser.RA.reduce(function (a, b) { return a.date > b.date ? a : b; });
}else if(duplicateUser.hasOwnProperty("MA")){
  this.highestDateUser= duplicateUser.MA.reduce(function (a, b) { return a.date > b.date ? a : b; });
}

                  users.push(this.highestDateUser);
        this.convertToUserSchema(this.highestDateUser, subscriptionPackage,(error, result) => {
                  });

                }
              }
              callback(null, users);
            }
          });
      }
    });
  }

  convertToUserSchema(data: any, subscriptionPackage:any, callback: (error: any, result: any) => void) {
    let user = new NewUser();
    if (data && data.EmailAddress && data.EmailAddress !== null && data.EmailAddress !== 'NULL') {
      user.email = data.EmailAddress;
    }
    user.activation_date = data.date;
    // user.isCandidate =  true;
    user.isActivated = true;
    user.mobile_number = Number(data.App_Cellnumber);
    user.typeOfApp = 'RAapp';
    this.checkPackage(user, data.date, data.AppCode, subscriptionPackage, (error, result) => {
    });
  }

  checkPackage(user: any, date: any, appType: any, result:any, callback: (error: any, result: any) => void) {
    let subscription = new UserSubscriptionForRA();
    console.log('user'+ user.mobile_number);
    let query = {'mobile_number': user.mobile_number, 'typeOfApp': user.typeOfApp};
    this.userRepository.retrieve(query, (error, res) => {
      if (error) {
        logger.info(res[0].mobile_number);
      } else if (res && res.length > 0) {
        logger.info(res[0].mobile_number);
      } else {
        switch (appType) {
          case 'RA' :
            subscription.activationDate = date;
            subscription.validity = result.basePackage.validity;
            subscription.name = result.basePackage.name;
            subscription.description = result.basePackage.description;
            subscription.cost = result.basePackage.cost;
            user.subscriptionForRA = subscription;
            break;
          case 'RAP' :
            let newActivationDate = date;
            newActivationDate.setDate(date.getDate() + result.basePackage.validity);
            subscription.activationDate = newActivationDate;
            subscription.validity = result.basePackage.validity;
            subscription.name = result.basePackage.name;
            subscription.description = result.basePackage.description;
            subscription.cost = result.basePackage.cost;
            user.subscriptionForRA = subscription;
            break;
          case 'MA' :
            subscription.activationDate = date;
            subscription.validity = 0;
            subscription.name = result.basePackage.name;
            subscription.description = result.basePackage.description;
            subscription.cost = result.basePackage.cost;
            user.subscriptionForRA = subscription;
            break;
        }
        this.userRepository.create(user, (err: Error, res: any) => {
        });
      }
    });
  }
  updatePaymentStatus(userId: string, paymentStatus: string, callback: (error: any, result: any) => void) {

    let query = {'_id': userId};
    let updateData = {'paymentStatus' : paymentStatus};
    this.userRepository.findOneAndUpdate(query, updateData, {new: true}, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        logger.error('Payment success failure : '+ JSON.stringify(result));
        callback(null, result);
      }
    });
  }

  exportUserData(callback:(error: any, result: any)=> void) {
   let rateAnalysisUsersFile =  this.createRateAnalysisUsersFile(callback);
   let buildInfoUsersFile = this.createBuildInfoUsersFile(callback);
   let usageTrackingFile = this.createUsageTrackingFile(callback);
   Promise.all([
     rateAnalysisUsersFile,
     buildInfoUsersFile,
     usageTrackingFile
   ]).then((data: any) => {
     callback(null, {
       'status': 'Success',
       'data': {'message': 'File created successfully'}
     });
   }).catch(function (e: any) {
      logger.error(' Promise failed for creating Excel Files ! :' + JSON.stringify(e.message));
     Promise.reject(e.message);
    });
  }

  createRateAnalysisUsersFile(callback: (error: any, result: any) => void) {
    return new Promise((resolve: any, reject: any) => {
      let findAllUsersOfRA = {'typeOfApp': 'RAapp'};
      this.userRepository.retrieve(findAllUsersOfRA, (error: any, userList: any) => {
        if (error) {
          callback(error, null);
        } else {
          for (let user of userList) {
            user.typeOfApp = 'RateAnalysis';
            if (user.subscriptionForRA.name === "RAPremium") {
              user.isPaidUser = true;
            } else {
              user.isPaidUser = false;
            }
            let activation_date = new Date(user.subscriptionForRA.activationDate);
            let expiryDate = new Date(user.subscriptionForRA.activationDate);
            let newExpiryDate = new Date(expiryDate.setDate(activation_date.getDate() + user.subscriptionForRA.validity));
            let current_date = new Date();
            user.subscriptionForRA.numOfDaysToExpire = this.daysdifference(newExpiryDate, current_date);
            if (user.subscriptionForRA.numOfDaysToExpire > 0) {
              user.subscriptionForRA.isPackageExpired = false;
            } else {
              user.subscriptionForRA.isPackageExpired = true;
            }
            user.subscriptionForRA.expiryDate = newExpiryDate.toLocaleDateString('zh-CN');
          }

          var fields = [{label: 'Email', value: 'email'}, {label: 'Mobile Number', value: 'mobile_number'},
            {label: 'App Type', value: 'typeOfApp'}, {label: 'IsPaidUser', value: 'isPaidUser'},
            {label: 'Subscription.PackageName', value: 'subscriptionForRA.name'},
            {label: 'Subscription.ExpiryDate', value: 'subscriptionForRA.expiryDate'},
            {label: 'Subscription.IsExpired', value: 'subscriptionForRA.isPackageExpired'}];

          var csv = json2csv({data: userList, fields: fields});
          var pathOfFile = path.resolve() + config.get('application.exportFilePathServer') + 'RateAnalysisUsers.csv';
          this.createCsvFile(pathOfFile, csv);
          resolve(userList);
        }
      });

    }).catch((error: Error) => {
      Promise.reject(error);
    });
  }

  createBuildInfoUsersFile(callback: (error: any, result: any) => void) {
    return new Promise((resolve: any, reject: any) => {
      let findAllUsersOfMBC = {'typeOfApp': {$exists: false}};
      this.userRepository.retrieve(findAllUsersOfMBC, (error: any, userList: any) => {
        if (error) {
          callback(error, null);
        } else {
          let arrayPromises: any = new Array(0);
          for (let user of userList) {
            user.typeOfApp = 'MyBuildCost';
            if (user.subscription[0].validity > 15 || user.subscription.length >= 2) {
              user.isPaidUser = true;
            } else {
              user.isPaidUser = false;
            }
            for (let subscription of user.subscription) {
              if (subscription.projectId.length !== 0) {
                let tempPromise = this.getProjectName(subscription, user);
                arrayPromises.push(tempPromise);
              } else {
                this.projectSubscriptionDetails(subscription, user);
              }
            }
          }

          Promise.all(arrayPromises)
            .then((data: any) => {
              var csvData = ['Email,Mobile_Number,App_Type,IsPaidUser,Subscription_ProjectName,Subscription_PackageName,Subscription_ExpiryDate,Subscription_IsExpired'];
              for (let user of userList) {
                var csvRow1 = {
                  Email: user.email,
                  Mobile_Number: user.mobile_number,
                  App_Type: user.typeOfApp,
                  IsPaidUser: user.isPaidUser
                };
                for (let subscription of user.subscription) {
                  let csvRow2 = JSON.parse(JSON.stringify(csvRow1));
                  csvRow2.Subscription_ProjectName = subscription.projectDetails.projectName;
                  csvRow2.Subscription_PackageName = subscription.projectDetails.packageName;
                  csvRow2.Subscription_ExpiryDate = subscription.projectDetails.expiryDate;
                  csvRow2.Subscription_IsExpired = subscription.projectDetails.activeStatus;
                  csvData.push(csvRow2);
                }
              }

              var fields = [{label: 'Email', value: 'Email'}, {label: 'Mobile Number', value: 'Mobile_Number'},
                {label: 'App Type', value: 'App_Type'}, {label: 'IsPaidUser', value: 'IsPaidUser'},
                {label: 'Subscription.ProjectName', value: 'Subscription_ProjectName'},
                {label: 'Subscription.PackageName', value: 'Subscription_PackageName'},
                {label: 'Subscription.ExpiryDate', value: 'Subscription_ExpiryDate'},
                {label: 'Subscription.IsExpired', value: 'Subscription_IsExpired'}];

              var csv = json2csv({data: csvData, fields: fields});
              var pathOfFile = path.resolve() + config.get('application.exportFilePathServer') + 'MyBuildCostUser.csv';
              this.createCsvFile(pathOfFile, csv);
              resolve(userList);
            })
            .catch((error: Error) => {
              Promise.reject(error);
            });
        }
      });
    }).catch((error: Error) => {
      Promise.reject(error);
    });
  }

  createUsageTrackingFile(callback: (error: any, result: any) => void) {
    return new Promise((resolve: any, reject: any) => {
      let usageTrackingForUsers = {};
      let query = {path: '_id', select: ['userId']};
      this.usageTrackingRepository.findAndPopulate(usageTrackingForUsers, query, (err: any, userData: any) => {
        if (err) {
          callback(err, null);
        } else {
          let arrayPromise: any = new Array(0);
          for (let user of userData) {
            if (user.userId) {
              let tempPromise = this.getMobileAndEmail(user);
              arrayPromise.push(tempPromise);
            }
            if (user.appType === undefined || user.appType === 'MyBuildCost') {
              user.appType = 'MyBuildCost';
            } else if (user.appType && user.appType === 'mcc') {
              user.appType = 'MyCivilCalC';
            }
          }

          Promise.all(arrayPromise)
            .then((data: any) => {
              console.log('created usageFile');
              var fields = [{label: 'Email', value: 'email'}, {label: 'Mobile Number', value: 'mobileNumber'},
                {label: 'App Type', value: 'appType'}, {label: 'UserId', value: 'userId'},
                {label: 'DeviceId', value: 'deviceId'}, {label: 'Platform', value: 'platform'},
                {label: 'Device OS', value: 'deviceOS'}, {label: 'Used From Mobile', value: 'isMobile'},
                {label: 'Used From Desktop', value: 'isDesktop'}, {label: 'Browser', value: 'browser'},
                {label: 'WorkItem', value: 'workItemName'}, {label: 'Region Name', value: 'regionName'},
                {label: 'IsPaidWorkItem', value: 'isPaidWorkItem'}, {label: 'Used On Time', value: 'createdAt'}];

              var csv = json2csv({data: userData, fields: fields});
              var pathOfFile = path.resolve() + config.get('application.exportFilePathServer') + 'AppUsageDetails.csv';
              this.createCsvFile(pathOfFile, csv);
              resolve(userData);
            })
            .catch((error: Error) => {
              Promise.reject(error);
            });
        }
      });
    }).catch((error: Error) => {
      Promise.reject(error);
    });
  }

  getMobileAndEmail(user:any) {
    return new Promise((resolve: any, reject: any) => {
      let query = {_id: user.userId};
      let populate = {path: '_id', select: ['mobile_number', 'email']};
      this.userRepository.findAndPopulate(query, populate, (error, result) => {
        if (result.length !== 0) {
          user.mobileNumber = result[0].mobile_number;
          user.email = result[0].email;
        }
          resolve(user);
      });
    }).catch((error: Error) => {
      Promise.reject(error);
    });
  }

  getProjectName(subscription:any, user:any) {
    return new Promise((resolve: any, reject: any) => {
      let query = {_id: subscription.projectId[0]};
      let populate = {path: 'buildings', select: ['name']};
      this.projectRepository.findAndPopulate(query, populate, (error, result) => {
        if (result.length !== 0)
        var projectName = result[0].name;
        this.projectSubscriptionDetails(subscription,user, projectName);
        resolve(subscription);
      });
    }).catch((error: Error) => {
      Promise.reject(error);
    });
  }

  projectSubscriptionDetails(subscription:any,user:any, projectName ?:string,) {
    let projectSubscription = new ProjectSubscriptionDetails();
    projectSubscription.projectName = projectName;
    for(let i=0; i<subscription.purchased.length; i++) {
      if(subscription.purchased[i].name) {
        projectSubscription.packageName = subscription.purchased[i].name;
      }
    }
    //activation date for project subscription
    let activation_date = new Date(subscription.activationDate);
    let expiryDate = new Date(subscription.activationDate);
    let newExpiryDate = new Date(expiryDate.setDate(activation_date.getDate() + subscription.validity));
    let current_date = new Date();
    projectSubscription.numOfDaysToExpire = this.daysdifference(newExpiryDate, current_date);
    projectSubscription.expiryDate = newExpiryDate.toLocaleDateString('zh-CN');

    if (projectSubscription.numOfDaysToExpire > 0) {
      projectSubscription.activeStatus = false;
    } else {
      projectSubscription.activeStatus = true;
    }
    subscription.projectDetails = projectSubscription;
  }

  createCsvFile(path: string, csv: string | void) {
    fs.writeFile(path, csv, function (err: any, data: any) {
      if (err) {
        throw err;
      } else {
      }
    });
  }

  sendNotificationToBigSlice(mobileNumber: number) {
    let mailService = new SendMailService();

    let htmlTemplate = 'ra-new-user-registered.html';

    let data: Map<string, string> = new Map([
      ['$mobileNumber$', mobileNumber]]);

    let attachment = MailAttachments.RaAttachmentArray;
    mailService.send(config.get('application.mail.BUILDINFO_ADMIN_MAIL'), Messages.RA_NEW_USER_REGISTERED, htmlTemplate, data, attachment,
      (err: any, result: any) => {
        if (err) {
          console.log('Failed to send mail to Big slice on RA user registration');
        } else {
          console.log('Mail sent successfully to Big slice on RA user registration');
        }
      });
  }
}

Object.seal(UserService);
export = UserService;
