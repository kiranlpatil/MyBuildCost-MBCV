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

class UserService {
  APP_NAME: string;
  company_name: string;
  mid_content: any;
  isActiveAddBuildingButton:boolean=false;
  private userRepository: UserRepository;
  private projectRepository:ProjectRepository;

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
            subScriptionService.getSubscriptionPackageByName('Free','BasePackage', (err: any,
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
            if(subscription.projectId.indexOf(project._id)) {
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
              projectSubscription.numOfDaysToExpire = this.daysdifference(projectSubscription.expiryDate, current_date);

              if(projectSubscription.numOfDaysToExpire < 30 && projectSubscription.numOfDaysToExpire >=0) {
                projectSubscription.warningMessage =
                  'Expiring in ' +  Math.round(projectSubscription.numOfDaysToExpire) + ' days,' ;
              } else if(projectSubscription.numOfDaysToExpire < 0) {
                projectSubscription.expiryMessage =  'Project expired,';
              }

              projectSubscriptionArray.push(projectSubscription);

            } else if(subscription.projectId.length === 0) {
              isAbleToCreateNewProject = true;
            }
          }
        }

        if(projectList.length === 0) {
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
     let current_date = new Date();
     for(let purchasePackage of subscription.purchased) {
       //expiry date for each package.
       expiryDate = new Date(expiryDate.setDate(activation_date.getDate() + purchasePackage.validity));
      if(expiryDate >= current_date) {
        return purchasePackage.name;
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
            let activation_date = new Date(result[0].subscription.activationDate);
            let expiryDate = new Date(result[0].subscription.activationDate);
            projectSubscription.expiryDate = new Date(expiryDate.setDate(activation_date.getDate() + result[0].subscription.validity));

            //expiry date for project subscription
            let current_date = new Date();
            projectSubscription.numOfDaysToExpire = this.daysdifference(projectSubscription.expiryDate, current_date);

            if(projectSubscription.numOfDaysToExpire < 30 && projectSubscription.numOfDaysToExpire >=0) {
              projectSubscription.warningMessage =
                'Expiring in ' +  Math.round(projectSubscription.numOfDaysToExpire) + ' days.' ;
            } else if(projectSubscription.numOfDaysToExpire < 0) {
              projectSubscription.expiryMessage = 'Project expired,';
            }
            callback(null, projectSubscription);
          }
        });
      }
    });
  }

  updateSubscription(user : User, projectId: string, packageName: string, callback:(error: any, result: any)=> void) {
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
       this.updatePackage(user, subscription, packageName,projectId,(error, result) => {
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

  updatePackage(user: User, subscription: any, packageName: string, projectId:string, callback:(error: any, result: any)=> void) {
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
              subscription.purchased.push(result.addOnPackage);
              this.updateSubscriptionPackage(user._id,projectId, subscription, (error, result) => {
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

      case 'Add_building':
      {
        subScriptionService.getSubscriptionPackageByName('Add_building','addOnPackage',
          (error: any, subscriptionPackage: Array<SubscriptionPackage>) => {
            if(error) {
              callback(error,null);
            } else {
              let result = subscriptionPackage[0];
              subscription.numOfBuildings = subscription.numOfBuildings + result.addOnPackage.numOfBuildings;
              subscription.purchased.push(result.addOnPackage);
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
    }
  }

  updateSubscriptionPackage( userId: any, projectId:string,subscription: any, callback:(error: any, result: any)=> void) {
    let query = {_id: userId};
    //TODO for more objects in subscription .
    let updateQuery = {$set:{'subscription.$[]':subscription}};
    this.userRepository.findOneAndUpdate(query, updateQuery, {new: true}, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, {data:'success'});
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

}

Object.seal(UserService);
export = UserService;
