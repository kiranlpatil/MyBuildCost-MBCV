"use strict";
var UserRepository = require("../dataaccess/repository/UserRepository");
var SendMailService = require("./mailer.service");
var SendMessageService = require("./sendmessage.service");
var fs = require("fs");
var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;
var config = require('config');
var path = require('path');
var Messages = require("../shared/messages");
var AuthInterceptor = require("../../framework/interceptor/auth.interceptor");
var ProjectAsset = require("../shared/projectasset");
var MailAttachments = require("../shared/sharedarray");
var bcrypt = require("bcrypt");
var log4js = require('log4js');
var logger = log4js.getLogger('User service');
var mailchimp_mailer_service_1 = require("./mailchimp-mailer.service");
var SubscriptionService = require("../../applicationProject/services/SubscriptionService");
var UserSubscription = require("../../applicationProject/dataaccess/model/project/Subscription/UserSubscription");
var ProjectRepository = require("../../applicationProject/dataaccess/repository/ProjectRepository");
var ProjectSubscriptionDetails = require("../../applicationProject/dataaccess/model/project/Subscription/ProjectSubscriptionDetails");
var messages = require("../../applicationProject/shared/messages");
var constants = require("../../applicationProject/shared/constants");
var ProjectSubcription = require("../../applicationProject/dataaccess/model/company/ProjectSubcription");
var CCPromise = require('promise/lib/es6-extensions');
var log4js = require('log4js');
var logger = log4js.getLogger('User service');
var UserService = (function () {
    function UserService() {
        this.isActiveAddBuildingButton = false;
        this.userRepository = new UserRepository();
        this.projectRepository = new ProjectRepository();
        this.APP_NAME = ProjectAsset.APP_NAME;
    }
    UserService.prototype.createUser = function (item, callback) {
        var _this = this;
        this.userRepository.retrieve({ 'email': item.email }, function (err, res) {
            if (err) {
                callback(new Error(err), null);
            }
            else if (res.length > 0) {
                logger.debug('Email already exist' + JSON.stringify(res));
                if (res[0].isActivated === true) {
                    callback(new Error(Messages.MSG_ERROR_REGISTRATION), null);
                }
                else if (res[0].isActivated === false) {
                    callback(new Error(Messages.MSG_ERROR_VERIFY_ACCOUNT), null);
                }
            }
            else {
                logger.debug('Email not present.' + JSON.stringify(res));
                var saltRounds = 10;
                bcrypt.hash(item.password, saltRounds, function (err, hash) {
                    if (err) {
                        logger.error('Error in creating hash password');
                        callback({
                            reason: 'Error in creating hash using bcrypt',
                            message: 'Error in creating hash using bcrypt',
                            stackTrace: new Error(),
                            code: 403
                        }, null);
                    }
                    else {
                        logger.debug('created hash succesfully.');
                        item.password = hash;
                        var subScriptionService_1 = new SubscriptionService();
                        subScriptionService_1.getSubscriptionPackageByName('Free', 'BasePackage', function (err, freeSubscription) {
                            if (freeSubscription.length > 0) {
                                logger.debug('freeSubscription length  > 0');
                                _this.assignFreeSubscriptionAndCreateUser(item, freeSubscription[0], callback);
                            }
                            else {
                                logger.debug('freeSubscription length !==0');
                                subScriptionService_1.addSubscriptionPackage(config.get('subscription.package.Free'), function (err, freeSubscription) {
                                    logger.debug('assigning free subscription by creating new user');
                                    _this.assignFreeSubscriptionAndCreateUser(item, freeSubscription, callback);
                                });
                            }
                        });
                    }
                });
            }
        });
    };
    UserService.prototype.checkForValidSubscription = function (userid, callback) {
        var query = [
            { $match: { '_id': userid } },
            { $project: { 'subscription': 1 } },
            { $unwind: '$subscription' }
        ];
        this.userRepository.aggregate(query, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                var validSubscriptionPackage = void 0;
                if (result.length > 0) {
                    for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                        var subscriptionPackage = result_1[_i];
                        if (subscriptionPackage.subscription.projectId.length === 0) {
                            validSubscriptionPackage = subscriptionPackage;
                        }
                    }
                }
                callback(null, validSubscriptionPackage);
            }
        });
    };
    UserService.prototype.assignFreeSubscriptionAndCreateUser = function (item, freeSubscription, callback) {
        var _this = this;
        var user = item;
        var sendMailService = new SendMailService();
        this.assignFreeSubscriptionPackage(user, freeSubscription);
        logger.debug('Creating user with new free trail subscription package');
        this.userRepository.create(user, function (err, res) {
            if (err) {
                logger.error('Failed to Creating user subscription package');
                callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
            }
            else {
                logger.debug('created user succesfully.' + JSON.stringify(res));
                var auth = new AuthInterceptor();
                var token = auth.issueTokenWithUid(res);
                var host = config.get('application.mail.host');
                var link = host + 'signin?access_token=' + token + '&_id=' + res._id;
                var htmlTemplate = 'welcome-aboard.html';
                var data = new Map([['$applicationLink$', config.get('application.mail.host')],
                    ['$first_name$', res.first_name], ['$link$', link], ['$app_name$', _this.APP_NAME]]);
                var attachment = MailAttachments.WelcomeAboardAttachmentArray;
                logger.debug('sending mail to new user.' + JSON.stringify(attachment));
                sendMailService.send(user.email, Messages.EMAIL_SUBJECT_CANDIDATE_REGISTRATION, htmlTemplate, data, attachment, function (err, result) {
                    callback(err, result);
                });
            }
        });
    };
    UserService.prototype.getUserForCheckingBuilding = function (userId, projectId, user, callback) {
        var _this = this;
        var query = [
            { $match: { '_id': userId } },
            { $project: { 'subscription': 1 } },
            { $unwind: '$subscription' },
            { $match: { 'subscription.projectId': projectId } }
        ];
        this.userRepository.aggregate(query, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                if (result.length > 0) {
                    var _loop_1 = function (subscriptionPackage) {
                        if (subscriptionPackage && subscriptionPackage.subscription.projectId !== null) {
                            var query_1 = { _id: projectId };
                            var populate = { path: 'building', select: ['name', 'buildings',] };
                            _this.projectRepository.findAndPopulate(query_1, populate, function (error, result) {
                                if (error) {
                                    callback(error, null);
                                }
                                else {
                                    var noOfBuildings = result.buildings.length;
                                    if (subscriptionPackage && noOfBuildings <= subscriptionPackage.subscription.numOfBuildings) {
                                        _this.isActiveAddBuildingButton = false;
                                    }
                                    else {
                                        _this.isActiveAddBuildingButton = true;
                                    }
                                }
                                callback(null, result);
                            });
                        }
                    };
                    for (var _i = 0, result_2 = result; _i < result_2.length; _i++) {
                        var subscriptionPackage = result_2[_i];
                        _loop_1(subscriptionPackage);
                    }
                }
            }
            callback(null, { data: _this.isActiveAddBuildingButton });
        });
    };
    UserService.prototype.assignFreeSubscriptionPackage = function (user, freeSubscription) {
        var subscription = new UserSubscription();
        subscription.activationDate = new Date();
        subscription.numOfBuildings = freeSubscription.basePackage.numOfBuildings;
        subscription.numOfProjects = freeSubscription.basePackage.numOfProjects;
        subscription.validity = freeSubscription.basePackage.validity;
        subscription.projectId = new Array();
        subscription.purchased = new Array();
        subscription.purchased.push(freeSubscription.basePackage);
        user.subscription = new Array();
        user.subscription.push(subscription);
    };
    UserService.prototype.login = function (data, callback) {
        this.retrieve({ 'email': data.email }, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else if (result.length > 0 && result[0].isActivated === true) {
                bcrypt.compare(data.password, result[0].password, function (err, isSame) {
                    if (err) {
                        callback({
                            reason: Messages.MSG_ERROR_RSN_INVALID_REGISTRATION_STATUS,
                            message: Messages.MSG_ERROR_VERIFY_CANDIDATE_ACCOUNT,
                            stackTrace: new Error(),
                            actualError: err,
                            code: 500
                        }, null);
                    }
                    else {
                        if (isSame) {
                            var auth = new AuthInterceptor();
                            var token = auth.issueTokenWithUid(result[0]);
                            var data = {
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
                        }
                        else {
                            callback({
                                reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                                message: Messages.MSG_ERROR_WRONG_PASSWORD,
                                stackTrace: new Error(),
                                code: 400
                            }, null);
                        }
                    }
                });
            }
            else if (result.length > 0 && result[0].isActivated === false) {
                callback({
                    reason: Messages.MSG_ERROR_RSN_INVALID_REGISTRATION_STATUS,
                    message: Messages.MSG_ERROR_VERIFY_CANDIDATE_ACCOUNT,
                    stackTrace: new Error(),
                    code: 500
                }, null);
            }
            else {
                callback({
                    reason: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
                    message: Messages.MSG_ERROR_USER_NOT_PRESENT,
                    stackTrace: new Error(),
                    code: 400
                }, null);
            }
        });
    };
    UserService.prototype.sendOtp = function (params, user, callback) {
        var Data = {
            new_mobile_number: params.mobile_number,
            old_mobile_number: user.mobile_number,
            _id: user._id
        };
        this.generateOtp(Data, function (error, result) {
            if (error) {
                if (error === Messages.MSG_ERROR_CHECK_MOBILE_PRESENT) {
                    callback({
                        reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
                        message: Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER,
                        stackTrace: new Error(),
                        code: 400
                    }, null);
                }
                else {
                    callback(error, null);
                }
            }
            else if (result.length > 0) {
                callback({
                    'status': Messages.STATUS_SUCCESS,
                    'data': {
                        'message': Messages.MSG_SUCCESS_OTP
                    }
                }, null);
            }
            else {
                callback({
                    reason: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
                    message: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
                    stackTrace: new Error(),
                    code: 400
                }, null);
            }
        });
    };
    UserService.prototype.generateOtp = function (field, callback) {
        var _this = this;
        this.userRepository.retrieve({ 'mobile_number': field.new_mobile_number, 'isActivated': true }, function (err, res) {
            if (err) {
            }
            else if (res.length > 0 && (res[0]._id) !== field._id) {
                callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
            }
            else if (res.length === 0) {
                var query = { '_id': field._id };
                var otp_1 = Math.floor((Math.random() * 99999) + 100000);
                var updateData = { 'mobile_number': field.new_mobile_number, 'otp': otp_1 };
                _this.userRepository.findOneAndUpdate(query, updateData, { new: true }, function (error, result) {
                    if (error) {
                        callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
                    }
                    else {
                        var Data = {
                            mobileNo: field.new_mobile_number,
                            otp: otp_1
                        };
                        var sendMessageService = new SendMessageService();
                        sendMessageService.sendMessageDirect(Data, callback);
                    }
                });
            }
            else {
                callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
            }
        });
    };
    UserService.prototype.verifyOtp = function (params, user, callback) {
        var mailChimpMailerService = new mailchimp_mailer_service_1.MailChimpMailerService();
        var query = { '_id': user._id, 'isActivated': false };
        var updateData = { 'isActivated': true, 'activation_date': new Date() };
        if (user.otp === params.otp) {
            this.findOneAndUpdate(query, updateData, { new: true }, function (error, result) {
                if (error) {
                    callback(error, null);
                }
                else {
                    callback(null, {
                        'status': 'Success',
                        'data': { 'message': 'User Account verified successfully' }
                    });
                    mailChimpMailerService.onCandidateSignSuccess(result);
                }
            });
        }
        else {
            callback({
                reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                message: Messages.MSG_ERROR_WRONG_OTP,
                stackTrace: new Error(),
                code: 400
            }, null);
        }
    };
    UserService.prototype.changeMobileNumber = function (field, callback) {
        var query = { '_id': field._id };
        var otp = Math.floor((Math.random() * 99999) + 100000);
        var updateData = { 'otp': otp, 'temp_mobile': field.new_mobile_number };
        this.userRepository.findOneAndUpdate(query, updateData, { new: true }, function (error, result) {
            if (error) {
                callback(new Error(Messages.MSG_ERROR_REGISTRATION), null);
            }
            else {
                var Data = {
                    current_mobile_number: field.current_mobile_number,
                    mobileNo: field.new_mobile_number,
                    otp: otp
                };
                var sendMessageService = new SendMessageService();
                sendMessageService.sendChangeMobileMessage(Data, callback);
            }
        });
    };
    UserService.prototype.forgotPassword = function (field, callback) {
        var _this = this;
        var sendMailService = new SendMailService();
        var query = { 'email': field.email };
        this.userRepository.retrieve(query, function (err, res) {
            if (res.length > 0 && res[0].isActivated === true) {
                var auth = new AuthInterceptor();
                var token = auth.issueTokenWithUid(res[0]);
                var host = config.get('application.mail.host');
                var link = host + 'reset-password?access_token=' + token + '&_id=' + res[0]._id;
                var htmlTemplate = 'forgotpassword.html';
                var data = new Map([['$applicationLink$', config.get('application.mail.host')],
                    ['$first_name$', res[0].first_name], ['$user_mail$', res[0].email], ['$link$', link], ['$app_name$', _this.APP_NAME]]);
                var attachment = MailAttachments.ForgetPasswordAttachmentArray;
                sendMailService.send(field.email, Messages.EMAIL_SUBJECT_FORGOT_PASSWORD, htmlTemplate, data, attachment, function (err, result) {
                    callback(err, result);
                });
            }
            else if (res.length > 0 && res[0].isActivated === false) {
                callback(new Error(Messages.MSG_ERROR_ACCOUNT_STATUS), res);
            }
            else {
                callback(new Error(Messages.MSG_ERROR_USER_NOT_FOUND), res);
            }
        });
    };
    UserService.prototype.SendChangeMailVerification = function (field, callback) {
        var query = { 'email': field.current_email, 'isActivated': true };
        var updateData = { $set: { 'temp_email': field.new_email } };
        this.userRepository.findOneAndUpdate(query, updateData, { new: true }, function (error, result) {
            if (error) {
                callback(new Error(Messages.MSG_ERROR_EMAIL_ACTIVE_NOW), null);
            }
            else if (result == null) {
                callback(new Error(Messages.MSG_ERROR_VERIFY_ACCOUNT), null);
            }
            else {
                var auth = new AuthInterceptor();
                var token = auth.issueTokenWithUid(result);
                var host = config.get('application.mail.host');
                var link = host + 'activate-user?access_token=' + token + '&_id=' + result._id + 'isEmailVerification';
                var sendMailService = new SendMailService();
                var data = new Map([['$applicationLink$', config.get('application.mail.host')],
                    ['$link$', link]]);
                var attachment = MailAttachments.AttachmentArray;
                sendMailService.send(field.new_email, Messages.EMAIL_SUBJECT_CHANGE_EMAILID, 'change.mail.html', data, attachment, callback);
            }
        });
    };
    UserService.prototype.sendMail = function (field, callback) {
        var sendMailService = new SendMailService();
        var data = new Map([['$applicationLink$', config.get('application.mail.host')],
            ['$first_name$', field.first_name], ['$email$', field.email], ['$message$', field.message]]);
        var attachment = MailAttachments.AttachmentArray;
        sendMailService.send(config.get('application.mail.ADMIN_MAIL'), Messages.EMAIL_SUBJECT_USER_CONTACTED_YOU, 'contactus.mail.html', data, attachment, callback);
    };
    UserService.prototype.sendMailOnError = function (errorInfo, callback) {
        var current_Time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        var data;
        if (errorInfo.stackTrace) {
            data = new Map([['$applicationLink$', config.get('application.mail.host')],
                ['$time$', current_Time], ['$host$', config.get('application.mail.host')],
                ['$reason$', errorInfo.reason], ['$code$', errorInfo.code],
                ['$message$', errorInfo.message], ['$error$', errorInfo.stackTrace.stack]]);
        }
        else if (errorInfo.stack) {
            data = new Map([['$applicationLink$', config.get('application.mail.host')],
                ['$time$', current_Time], ['$host$', config.get('application.mail.host')],
                ['$reason$', errorInfo.reason], ['$code$', errorInfo.code],
                ['$message$', errorInfo.message], ['$error$', errorInfo.stack]]);
        }
        var sendMailService = new SendMailService();
        var attachment = MailAttachments.AttachmentArray;
        sendMailService.send(config.get('application.mail.ADMIN_MAIL'), Messages.EMAIL_SUBJECT_SERVER_ERROR + ' on ' + config.get('application.mail.host'), 'error.mail.html', data, attachment, callback, config.get('application.mail.TPLGROUP_MAIL'));
    };
    UserService.prototype.findById = function (id, callback) {
        this.userRepository.findById(id, callback);
    };
    UserService.prototype.retrieve = function (field, callback) {
        this.userRepository.retrieve(field, callback);
    };
    UserService.prototype.retrieveWithLimit = function (field, included, callback) {
        var limit = config.get('application.limitForQuery');
        this.userRepository.retrieveWithLimit(field, included, limit, callback);
    };
    UserService.prototype.retrieveWithLean = function (field, callback) {
        this.userRepository.retrieve(field, callback);
    };
    UserService.prototype.retrieveAll = function (item, callback) {
        this.userRepository.retrieve(item, function (err, res) {
            if (err) {
                callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
            }
            else {
                callback(null, res);
            }
        });
    };
    UserService.prototype.update = function (_id, item, callback) {
        var _this = this;
        this.userRepository.findById(_id, function (err, res) {
            if (err) {
                callback(err, res);
            }
            else {
                _this.userRepository.update(_id, item, callback);
            }
        });
    };
    UserService.prototype.delete = function (_id, callback) {
        this.userRepository.delete(_id, callback);
    };
    UserService.prototype.findOneAndUpdate = function (query, newData, options, callback) {
        this.userRepository.findOneAndUpdate(query, newData, options, callback);
    };
    UserService.prototype.UploadImage = function (tempPath, fileName, cb) {
        var targetpath = fileName;
        fs.rename(tempPath, targetpath, function (err) {
            cb(null, tempPath);
        });
    };
    UserService.prototype.UploadDocuments = function (tempPath, fileName, cb) {
        var targetpath = fileName;
        fs.rename(tempPath, targetpath, function (err) {
            cb(null, tempPath);
        });
    };
    UserService.prototype.findAndUpdateNotification = function (query, newData, options, callback) {
        this.userRepository.findOneAndUpdate(query, newData, options, callback);
    };
    UserService.prototype.retrieveBySortedOrder = function (query, projection, sortingQuery, callback) {
    };
    UserService.prototype.resetPassword = function (data, user, callback) {
        var _this = this;
        var saltRounds = 10;
        bcrypt.hash(data.new_password, saltRounds, function (err, hash) {
            if (err) {
                callback({
                    reason: 'Error in creating hash using bcrypt',
                    message: 'Error in creating hash using bcrypt',
                    stackTrace: new Error(),
                    code: 403
                }, null);
            }
            else {
                var updateData = { 'password': hash };
                var query = { '_id': user._id, 'password': user.password };
                _this.findOneAndUpdate(query, updateData, { new: true }, function (error, result) {
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        callback(null, {
                            'status': 'Success',
                            'data': { 'message': 'Password changed successfully' }
                        });
                    }
                });
            }
        });
    };
    UserService.prototype.updateDetails = function (data, user, callback) {
        var auth = new AuthInterceptor();
        var query = { '_id': user._id };
        this.userRepository.findOneAndUpdate(query, data, { new: true }, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, {
                    'status': 'Success',
                    'data': { 'message': 'User Profile Updated successfully' }
                });
            }
        });
    };
    UserService.prototype.getUserById = function (user, callback) {
        var auth = new AuthInterceptor();
        var token = auth.issueTokenWithUid(user);
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
    };
    UserService.prototype.verifyAccount = function (user, callback) {
        var query = { '_id': user._id, 'isActivated': false };
        var updateData = { 'isActivated': true };
        this.findOneAndUpdate(query, updateData, { new: true }, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, {
                    'status': 'Success',
                    'data': { 'message': 'User Account verified successfully' }
                });
            }
        });
    };
    UserService.prototype.changeEmailId = function (data, user, callback) {
        var _this = this;
        var auth = new AuthInterceptor();
        var query = { 'email': data.new_email };
        this.retrieve(query, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else if (result.length > 0 && result[0].isActivated === true) {
                callback({
                    reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
                    message: Messages.MSG_ERROR_REGISTRATION,
                    stackTrace: new Error(),
                    code: 400
                }, null);
            }
            else if (result.length > 0 && result[0].isActivated === false) {
                callback({
                    reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
                    message: Messages.MSG_ERROR_ACCOUNT_STATUS,
                    stackTrace: new Error(),
                    code: 400
                }, null);
            }
            else {
                _this.SendChangeMailVerification(data, function (error, result) {
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
                        }
                        else {
                            callback({
                                reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
                                message: Messages.MSG_ERROR_WHILE_CONTACTING,
                                stackTrace: new Error(),
                                code: 400
                            }, null);
                        }
                    }
                    else {
                        callback(null, {
                            'status': Messages.STATUS_SUCCESS,
                            'data': { 'message': Messages.MSG_SUCCESS_EMAIL_CHANGE_EMAILID }
                        });
                    }
                });
            }
        });
    };
    UserService.prototype.verifyChangedEmailId = function (user, callback) {
        var query = { '_id': user._id };
        var updateData = { 'email': user.temp_email, 'temp_email': user.email };
        this.findOneAndUpdate(query, updateData, { new: true }, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, {
                    'status': 'Success',
                    'data': { 'message': 'User Account verified successfully' }
                });
            }
        });
    };
    UserService.prototype.verifyMobileNumber = function (data, user, callback) {
        var query = { '_id': user._id };
        var updateData = { 'mobile_number': user.temp_mobile, 'temp_mobile': user.mobile_number };
        if (user.otp === data.otp) {
            this.findOneAndUpdate(query, updateData, { new: true }, function (error, result) {
                if (error) {
                    callback(error, null);
                }
                else {
                    callback(null, {
                        'status': 'Success',
                        'data': { 'message': 'User Account verified successfully' }
                    });
                }
            });
        }
        else {
            callback({
                reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                message: Messages.MSG_ERROR_WRONG_OTP,
                stackTrace: new Error(),
                code: 400
            }, null);
        }
    };
    UserService.prototype.assignPremiumPackage = function (user, userId, cost, callback) {
        var _this = this;
        var projection = { subscription: 1 };
        this.userRepository.findByIdWithProjection(userId, projection, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                var subScriptionArray_1 = result.subscription;
                var subScriptionService = new SubscriptionService();
                subScriptionService.getSubscriptionPackageByName('Premium', 'BasePackage', function (error, subscriptionPackage) {
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        var premiumPackage = subscriptionPackage[0];
                        if (subScriptionArray_1[0].projectId.length === 0) {
                            subScriptionArray_1[0].numOfBuildings = premiumPackage.basePackage.numOfBuildings;
                            subScriptionArray_1[0].numOfProjects = premiumPackage.basePackage.numOfProjects;
                            subScriptionArray_1[0].validity = subScriptionArray_1[0].validity + premiumPackage.basePackage.validity;
                            subScriptionArray_1[0].purchased.push(premiumPackage.basePackage);
                        }
                        else {
                            var subscription = new UserSubscription();
                            subscription.activationDate = new Date();
                            subscription.numOfBuildings = premiumPackage.basePackage.numOfBuildings;
                            subscription.numOfProjects = premiumPackage.basePackage.numOfProjects;
                            subscription.validity = premiumPackage.basePackage.validity;
                            premiumPackage.basePackage.cost = cost;
                            subscription.projectId = new Array();
                            subscription.purchased = new Array();
                            subscription.purchased.push(premiumPackage.basePackage);
                            subScriptionArray_1.push(subscription);
                        }
                        var query = { '_id': userId };
                        var newData = { $set: { 'subscription': subScriptionArray_1 } };
                        _this.userRepository.findOneAndUpdate(query, newData, { new: true }, function (err, response) {
                            if (err) {
                                callback(err, null);
                            }
                            else {
                                callback(null, { data: 'success' });
                            }
                        });
                    }
                });
            }
        });
    };
    UserService.prototype.getProjects = function (user, callback) {
        var _this = this;
        var query = { _id: user._id };
        var populate = { path: 'project', select: ['name', 'buildings', 'activeStatus'] };
        this.userRepository.findAndPopulate(query, populate, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                var authInterceptor = new AuthInterceptor();
                var populatedProject = result[0];
                var projectList = result[0].project;
                var subscriptionList = result[0].subscription;
                var projectSubscriptionArray = Array();
                var isAbleToCreateNewProject = false;
                for (var _i = 0, projectList_1 = projectList; _i < projectList_1.length; _i++) {
                    var project = projectList_1[_i];
                    for (var _a = 0, subscriptionList_1 = subscriptionList; _a < subscriptionList_1.length; _a++) {
                        var subscription = subscriptionList_1[_a];
                        if (subscription.projectId.length !== 0) {
                            if (subscription.projectId[0].equals(project._id)) {
                                var projectSubscription = new ProjectSubscriptionDetails();
                                projectSubscription.projectName = project.name;
                                projectSubscription.projectId = project._id;
                                projectSubscription.activeStatus = project.activeStatus;
                                projectSubscription.numOfBuildingsRemaining = (subscription.numOfBuildings - project.buildings.length);
                                projectSubscription.numOfBuildingsAllocated = project.buildings.length;
                                projectSubscription.packageName = _this.checkCurrentPackage(subscription);
                                var activation_date = new Date(subscription.activationDate);
                                var expiryDate = new Date(subscription.activationDate);
                                projectSubscription.expiryDate = new Date(expiryDate.setDate(activation_date.getDate() + subscription.validity));
                                var current_date = new Date();
                                var newExipryDate = new Date(projectSubscription.expiryDate);
                                newExipryDate.setDate(projectSubscription.expiryDate.getDate() + 30);
                                var noOfDays = _this.daysdifference(newExipryDate, current_date);
                                projectSubscription.numOfDaysToExpire = _this.daysdifference(projectSubscription.expiryDate, current_date);
                                if (projectSubscription.numOfDaysToExpire < 30 && projectSubscription.numOfDaysToExpire > 0) {
                                    projectSubscription.warningMessage =
                                        'Expiring in ' + Math.round(projectSubscription.numOfDaysToExpire) + ' days,';
                                }
                                else if (projectSubscription.numOfDaysToExpire <= 0 && noOfDays >= 0) {
                                    projectSubscription.expiryMessage = 'Project expired,';
                                }
                                else if (noOfDays < 0) {
                                    projectSubscription.activeStatus = false;
                                }
                                projectSubscriptionArray.push(projectSubscription);
                            }
                        }
                        else {
                            isAbleToCreateNewProject = true;
                        }
                    }
                }
                if (projectList.length === 0 && subscriptionList[0].purchased.length !== 0) {
                    isAbleToCreateNewProject = true;
                }
                callback(null, {
                    data: projectSubscriptionArray,
                    isSubscriptionAvailable: isAbleToCreateNewProject,
                    access_token: authInterceptor.issueTokenWithUid(user)
                });
            }
        });
    };
    UserService.prototype.checkCurrentPackage = function (subscription) {
        var activation_date = new Date(subscription.activationDate);
        var expiryDate = new Date(subscription.activationDate);
        var expiryDateOuter = new Date(subscription.activationDate);
        var current_date = new Date();
        for (var _i = 0, _a = subscription.purchased; _i < _a.length; _i++) {
            var purchasePackage = _a[_i];
            expiryDateOuter = new Date(expiryDateOuter.setDate(activation_date.getDate() + purchasePackage.validity));
            for (var _b = 0, _c = subscription.purchased; _b < _c.length; _b++) {
                var purchasePackage_1 = _c[_b];
                expiryDate = new Date(expiryDate.setDate(activation_date.getDate() + purchasePackage_1.validity));
                if ((expiryDateOuter < expiryDate) && (expiryDate >= current_date)) {
                    return purchasePackage_1.name;
                }
            }
            if (purchasePackage.name === 'Free') {
                return purchasePackage.name = 'Free';
            }
            else {
                return purchasePackage.name = 'Premium';
            }
        }
    };
    UserService.prototype.daysdifference = function (date1, date2) {
        var ONEDAY = 1000 * 60 * 60 * 24;
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();
        var difference_ms = (date1_ms - date2_ms);
        return Math.round(difference_ms / ONEDAY);
    };
    UserService.prototype.getProjectSubscription = function (user, projectId, callback) {
        var _this = this;
        var query = [
            { $match: { '_id': ObjectId(user._id) } },
            { $project: { 'subscription': 1 } },
            { $unwind: '$subscription' },
            { $match: { 'subscription.projectId': ObjectId(projectId) } }
        ];
        this.userRepository.aggregate(query, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                var query_2 = { _id: projectId };
                var populate = { path: 'buildings' };
                _this.projectRepository.findAndPopulate(query_2, populate, function (error, resp) {
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        var projectSubscription = new ProjectSubscriptionDetails();
                        projectSubscription.projectName = resp[0].name;
                        projectSubscription.projectId = resp[0]._id;
                        projectSubscription.activeStatus = resp[0].activeStatus;
                        projectSubscription.numOfBuildingsAllocated = resp[0].buildings.length;
                        projectSubscription.numOfBuildingsExist = result[0].subscription.numOfBuildings;
                        projectSubscription.numOfBuildingsRemaining = (result[0].subscription.numOfBuildings - resp[0].buildings.length);
                        if (result[0].subscription.numOfBuildings === 10 && projectSubscription.numOfBuildingsRemaining === 0 && projectSubscription.packageName !== 'Free') {
                            projectSubscription.addBuildingDisable = true;
                        }
                        projectSubscription.packageName = _this.checkCurrentPackage(result[0].subscription);
                        if (projectSubscription.packageName === 'Free' && projectSubscription.numOfBuildingsRemaining === 0) {
                            projectSubscription.addBuildingDisable = true;
                        }
                        var activation_date = new Date(result[0].subscription.activationDate);
                        var expiryDate = new Date(result[0].subscription.activationDate);
                        projectSubscription.expiryDate = new Date(expiryDate.setDate(activation_date.getDate() + result[0].subscription.validity));
                        var current_date = new Date();
                        var newExipryDate = new Date(projectSubscription.expiryDate);
                        newExipryDate.setDate(projectSubscription.expiryDate.getDate() + 30);
                        var noOfDays = _this.daysdifference(newExipryDate, current_date);
                        projectSubscription.numOfDaysToExpire = _this.daysdifference(projectSubscription.expiryDate, current_date);
                        if (projectSubscription.numOfDaysToExpire < 30 && projectSubscription.numOfDaysToExpire > 0) {
                            projectSubscription.warningMessage =
                                'Expiring in ' + Math.round(projectSubscription.numOfDaysToExpire) + ' days.';
                        }
                        else if (projectSubscription.numOfDaysToExpire <= 0 && noOfDays >= 0) {
                            projectSubscription.expiryMessage = 'Project expired,';
                        }
                        else if (noOfDays < 0) {
                            projectSubscription.activeStatus = false;
                        }
                        callback(null, projectSubscription);
                    }
                });
            }
        });
    };
    UserService.prototype.updateSubscription = function (user, projectId, packageName, costForBuildingPurchased, numberOfBuildingsPurchased, callback) {
        var _this = this;
        var query = [
            { $match: { '_id': ObjectId(user._id) } },
            { $project: { 'subscription': 1 } },
            { $unwind: '$subscription' },
            { $match: { 'subscription.projectId': ObjectId(projectId) } }
        ];
        this.userRepository.aggregate(query, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                var subscription = result[0].subscription;
                _this.updatePackage(user, subscription, packageName, costForBuildingPurchased, numberOfBuildingsPurchased, projectId, function (error, result) {
                    if (error) {
                        var error_1 = new Error();
                        error_1.message = messages.MSG_ERROR_WHILE_CONTACTING;
                        callback(error_1, null);
                    }
                    else {
                        if (packageName === constants.RENEW_PROJECT) {
                            callback(null, { data: messages.MSG_SUCCESS_PROJECT_RENEW });
                        }
                        else {
                            callback(null, { data: 'success' });
                        }
                    }
                });
            }
        });
    };
    UserService.prototype.updatePackage = function (user, subscription, packageName, costForBuildingPurchased, numberOfBuildingsPurchased, projectId, callback) {
        var _this = this;
        var subScriptionService = new SubscriptionService();
        switch (packageName) {
            case 'Premium':
                {
                    subScriptionService.getSubscriptionPackageByName('Premium', 'BasePackage', function (error, subscriptionPackage) {
                        if (error) {
                            callback(error, null);
                        }
                        else {
                            var result = subscriptionPackage[0];
                            subscription.numOfBuildings = result.basePackage.numOfBuildings;
                            subscription.numOfProjects = result.basePackage.numOfProjects;
                            var noOfDaysToExpiry = _this.calculateValidity(subscription);
                            subscription.validity = noOfDaysToExpiry + result.basePackage.validity;
                            result.basePackage.cost = costForBuildingPurchased;
                            subscription.purchased.push(result.basePackage);
                            _this.updateSubscriptionPackage(user._id, projectId, subscription, function (error, result) {
                                if (error) {
                                    callback(error, null);
                                }
                                else {
                                    callback(null, { data: 'success' });
                                }
                            });
                        }
                    });
                    break;
                }
            case 'RenewProject':
                {
                    subScriptionService.getSubscriptionPackageByName('RenewProject', 'addOnPackage', function (error, subscriptionPackage) {
                        if (error) {
                            callback(error, null);
                        }
                        else {
                            var result = subscriptionPackage[0];
                            var noOfDaysToExpiry = _this.calculateValidity(subscription);
                            subscription.validity = noOfDaysToExpiry + result.addOnPackage.validity;
                            result.addOnPackage.cost = costForBuildingPurchased;
                            subscription.purchased.push(result.addOnPackage);
                            _this.updateSubscriptionPackage(user._id, projectId, subscription, function (error, result) {
                                if (error) {
                                    callback(error, null);
                                }
                                else {
                                    callback(null, { data: 'Project Renewed successfully' });
                                }
                            });
                        }
                    });
                    break;
                }
            case 'Add_building':
                {
                    subScriptionService.getSubscriptionPackageByName('Add_building', 'addOnPackage', function (error, subscriptionPackage) {
                        if (error) {
                            callback(error, null);
                        }
                        else {
                            var projectBuildingsLimit = subscription.numOfBuildings + numberOfBuildingsPurchased;
                            var result = subscriptionPackage[0];
                            result.addOnPackage.numOfBuildings = numberOfBuildingsPurchased;
                            result.addOnPackage.cost = costForBuildingPurchased;
                            subscription.numOfBuildings = subscription.numOfBuildings + result.addOnPackage.numOfBuildings;
                            subscription.purchased.push(result.addOnPackage);
                            _this.updateSubscriptionPackage(user._id, projectId, subscription, function (error, result) {
                                if (error) {
                                    callback(error, null);
                                }
                                else {
                                    callback(null, { data: 'success' });
                                }
                            });
                        }
                    });
                    break;
                }
        }
    };
    UserService.prototype.updateSubscriptionPackage = function (userId, projectId, updatedSubscription, callback) {
        var _this = this;
        var projection = { subscription: 1 };
        this.userRepository.findByIdWithProjection(userId, projection, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                var subScriptionArray = result.subscription;
                for (var subscriptionIndex = 0; subscriptionIndex < subScriptionArray.length; subscriptionIndex++) {
                    if (subScriptionArray[subscriptionIndex].projectId.length !== 0) {
                        if (subScriptionArray[subscriptionIndex].projectId[0].equals(projectId)) {
                            subScriptionArray[subscriptionIndex] = updatedSubscription;
                        }
                    }
                }
                var query = { '_id': userId };
                var newData = { $set: { 'subscription': subScriptionArray } };
                _this.userRepository.findOneAndUpdate(query, newData, { new: true }, function (err, response) {
                    if (err) {
                        callback(err, null);
                    }
                    else {
                        callback(null, { data: 'success' });
                    }
                });
            }
        });
    };
    UserService.prototype.calculateValidity = function (subscription) {
        var activationDate = new Date(subscription.activationDate);
        var expiryDate = new Date(subscription.activationDate);
        var projectExpiryDate = new Date(expiryDate.setDate(activationDate.getDate() + subscription.validity));
        var current_date = new Date();
        var days = this.daysdifference(projectExpiryDate, current_date);
        return days;
    };
    UserService.prototype.sendProjectExpiryWarningMails = function (callback) {
        var _this = this;
        logger.debug('sendProjectExpiryWarningMails is been hit');
        var query = [
            { $project: { 'subscription': 1, 'first_name': 1, 'email': 1 } },
            { $unwind: '$subscription' },
            { $unwind: '$subscription.projectId' }
        ];
        this.userRepository.aggregate(query, function (error, response) {
            if (error) {
                logger.error('sendProjectExpiryWarningMails error : ' + JSON.stringify(error));
                callback(error, null);
            }
            else {
                logger.debug('sendProjectExpiryWarningMails sucess');
                var userList = new Array();
                var userSubscriptionPromiseArray = [];
                for (var _i = 0, response_1 = response; _i < response_1.length; _i++) {
                    var user = response_1[_i];
                    logger.debug('geting all user data for sending mail to users.');
                    var validityDays = _this.calculateValidity(user.subscription);
                    var valdityDaysValidation = config.get('cronJobMailNotificationValidityDays');
                    logger.debug('validityDays : ' + validityDays);
                    if (valdityDaysValidation.indexOf(validityDays) !== -1) {
                        logger.debug('calling promise');
                        var promiseObject = _this.getProjectDataById(user);
                        userSubscriptionPromiseArray.push(promiseObject);
                    }
                    else {
                        logger.debug('invalid validityDays : ' + validityDays);
                    }
                }
                if (userSubscriptionPromiseArray.length !== 0) {
                    CCPromise.all(userSubscriptionPromiseArray).then(function (data) {
                        logger.debug('data recieved for all users: ' + JSON.stringify(data));
                        var sendMailPromiseArray = [];
                        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                            var user = data_1[_i];
                            logger.debug('Calling sendMailForProjectExpiryToUser for user : ' + JSON.stringify(user.first_name));
                            var userService = new UserService();
                            var sendMailPromise = userService.sendMailForProjectExpiryToUser(user);
                            sendMailPromiseArray.push(sendMailPromise);
                        }
                        CCPromise.all(sendMailPromiseArray).then(function (mailSentData) {
                            logger.debug('mailSentData for all users: ' + JSON.stringify(mailSentData));
                            callback(null, { 'data': 'Mail sent successfully to users.' });
                        }).catch(function (e) {
                            logger.error('Promise failed for getting mailSentData ! :' + JSON.stringify(e.message));
                            CCPromise.reject(e.message);
                        });
                    }).catch(function (e) {
                        logger.error('Promise failed for send mail notification ! :' + JSON.stringify(e.message));
                        CCPromise.reject(e.message);
                    });
                }
                else {
                    logger.info('No any project is expired.');
                }
            }
        });
    };
    UserService.prototype.getProjectDataById = function (user) {
        return new CCPromise(function (resolve, reject) {
            logger.debug('geting all user data for sending mail to users.');
            var projectSubscription = new ProjectSubcription();
            var projection = { 'name': 1 };
            var projectRepository = new ProjectRepository();
            var userService = new UserService();
            projectRepository.findByIdWithProjection(user.subscription.projectId, projection, function (error, resp) {
                if (error) {
                    logger.error('Error in fetching User data' + JSON.stringify(error));
                    reject(error);
                }
                else {
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
        }).catch(function (e) {
            logger.error('Promise failed for individual createPromiseForGetProjectById ! Error: ' + JSON.stringify(e.message));
            CCPromise.reject(e.message);
        });
    };
    UserService.prototype.sendMailForProjectExpiryToUser = function (user) {
        return new CCPromise(function (resolve, reject) {
            var mailService = new SendMailService();
            var auth = new AuthInterceptor();
            var token = auth.issueTokenWithUid(user);
            var host = config.get('application.mail.host');
            var htmlTemplate = 'project-expiry-notification-mail.html';
            var data = new Map([
                ['$applicationLink$', config.get('application.mail.host')], ['$first_name$', user.first_name],
                ['$expiry_date$', user.projectExpiryDate], ['$subscription_link$', config.get('application.mail.host')],
                ['$app_name$', 'BuildInfo - Cost Control']
            ]);
            var attachment = MailAttachments.AttachmentArray;
            mailService.send(user.userEmail, Messages.PROJECT_EXPIRY_WARNING, htmlTemplate, data, attachment, function (err, result) {
                if (err) {
                    console.log('Failed to send mail to user : ' + user.userEmail);
                    reject(err);
                }
                else {
                    console.log('Mail sent successfully to user : ' + user.userEmail);
                    resolve(result);
                }
            });
        }).catch(function (e) {
            logger.error('Promise failed for individual sendMailForProjectExpiryToUser ! Error: ' + JSON.stringify(e.message));
            CCPromise.reject(e.message);
        });
    };
    UserService.prototype.calculateExpiryDate = function (subscription) {
        var activationDate = new Date(subscription.activationDate);
        var expiryDate = new Date(subscription.activationDate);
        var projectExpiryDate = new Date(expiryDate.setDate(activationDate.getDate() + subscription.validity));
        return projectExpiryDate;
    };
    return UserService;
}());
Object.seal(UserService);
module.exports = UserService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvVXNlclNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHdFQUEyRTtBQUMzRSxrREFBcUQ7QUFDckQsMERBQTZEO0FBQzdELHVCQUF5QjtBQUN6QixtQ0FBcUM7QUFDckMsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7QUFFdkMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQiw2Q0FBZ0Q7QUFDaEQsOEVBQWlGO0FBQ2pGLHFEQUF3RDtBQUN4RCx1REFBMEQ7QUFFMUQsK0JBQWtDO0FBQ2xDLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzlDLHVFQUFvRTtBQUdwRSwyRkFBOEY7QUFHOUYsa0hBQXFIO0FBQ3JILG9HQUF1RztBQUN2RyxzSUFBeUk7QUFDekksbUVBQXVFO0FBQ3ZFLHFFQUF5RTtBQUN6RSx5R0FBNEc7QUFDNUcsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDdEQsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUM7QUFFOUM7SUFRRTtRQUpBLDhCQUF5QixHQUFTLEtBQUssQ0FBQztRQUt0QyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksaUJBQWlCLEVBQUUsQ0FBQztRQUNqRCxJQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUM7SUFD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Q0FBQztRQUN2RyxNQUFNLENBQUMsaUJBQWlCLENBQUM7SUFDM0IsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0ExcENBLEFBMHBDQyxJQUFBO0FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUN6QixpQkFBUyxXQUFXLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9zZXJ2aWNlcy9Vc2VyU2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBVc2VyUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9Vc2VyUmVwb3NpdG9yeScpO1xuaW1wb3J0IFNlbmRNYWlsU2VydmljZSA9IHJlcXVpcmUoJy4vbWFpbGVyLnNlcnZpY2UnKTtcbmltcG9ydCBTZW5kTWVzc2FnZVNlcnZpY2UgPSByZXF1aXJlKCcuL3NlbmRtZXNzYWdlLnNlcnZpY2UnKTtcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcbmxldCBPYmplY3RJZCA9IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkO1xuaW1wb3J0IHsgU2VudE1lc3NhZ2VJbmZvIH0gZnJvbSAnbm9kZW1haWxlcic7XG5sZXQgY29uZmlnID0gcmVxdWlyZSgnY29uZmlnJyk7XG5sZXQgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmltcG9ydCBNZXNzYWdlcyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9tZXNzYWdlcycpO1xuaW1wb3J0IEF1dGhJbnRlcmNlcHRvciA9IHJlcXVpcmUoJy4uLy4uL2ZyYW1ld29yay9pbnRlcmNlcHRvci9hdXRoLmludGVyY2VwdG9yJyk7XG5pbXBvcnQgUHJvamVjdEFzc2V0ID0gcmVxdWlyZSgnLi4vc2hhcmVkL3Byb2plY3Rhc3NldCcpO1xuaW1wb3J0IE1haWxBdHRhY2htZW50cyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9zaGFyZWRhcnJheScpO1xuaW1wb3J0IHsgYXNFbGVtZW50RGF0YSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUvc3JjL3ZpZXcnO1xuaW1wb3J0IGJjcnlwdCA9IHJlcXVpcmUoJ2JjcnlwdCcpO1xubGV0IGxvZzRqcyA9IHJlcXVpcmUoJ2xvZzRqcycpO1xubGV0IGxvZ2dlciA9IGxvZzRqcy5nZXRMb2dnZXIoJ1VzZXIgc2VydmljZScpO1xuaW1wb3J0IHsgTWFpbENoaW1wTWFpbGVyU2VydmljZSB9IGZyb20gJy4vbWFpbGNoaW1wLW1haWxlci5zZXJ2aWNlJztcbmltcG9ydCBVc2VyTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL1VzZXJNb2RlbCcpO1xuaW1wb3J0IFVzZXIgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vbmdvb3NlL3VzZXInKTtcbmltcG9ydCBTdWJzY3JpcHRpb25TZXJ2aWNlID0gcmVxdWlyZSgnLi4vLi4vYXBwbGljYXRpb25Qcm9qZWN0L3NlcnZpY2VzL1N1YnNjcmlwdGlvblNlcnZpY2UnKTtcbmltcG9ydCBTdWJzY3JpcHRpb25QYWNrYWdlID0gcmVxdWlyZSgnLi4vLi4vYXBwbGljYXRpb25Qcm9qZWN0L2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9TdWJzY3JpcHRpb24vU3Vic2NyaXB0aW9uUGFja2FnZScpO1xuaW1wb3J0IEJhc2VTdWJzY3JpcHRpb25QYWNrYWdlID0gcmVxdWlyZSgnLi4vLi4vYXBwbGljYXRpb25Qcm9qZWN0L2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9TdWJzY3JpcHRpb24vQmFzZVN1YnNjcmlwdGlvblBhY2thZ2UnKTtcbmltcG9ydCBVc2VyU3Vic2NyaXB0aW9uID0gcmVxdWlyZSgnLi4vLi4vYXBwbGljYXRpb25Qcm9qZWN0L2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9TdWJzY3JpcHRpb24vVXNlclN1YnNjcmlwdGlvbicpO1xuaW1wb3J0IFByb2plY3RSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vLi4vYXBwbGljYXRpb25Qcm9qZWN0L2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9Qcm9qZWN0UmVwb3NpdG9yeScpO1xuaW1wb3J0IFByb2plY3RTdWJzY3JpcHRpb25EZXRhaWxzID0gcmVxdWlyZSgnLi4vLi4vYXBwbGljYXRpb25Qcm9qZWN0L2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9TdWJzY3JpcHRpb24vUHJvamVjdFN1YnNjcmlwdGlvbkRldGFpbHMnKTtcbmltcG9ydCBtZXNzYWdlcyAgPSByZXF1aXJlKCcuLi8uLi9hcHBsaWNhdGlvblByb2plY3Qvc2hhcmVkL21lc3NhZ2VzJyk7XG5pbXBvcnQgY29uc3RhbnRzICA9IHJlcXVpcmUoJy4uLy4uL2FwcGxpY2F0aW9uUHJvamVjdC9zaGFyZWQvY29uc3RhbnRzJyk7XG5pbXBvcnQgUHJvamVjdFN1YmNyaXB0aW9uID0gcmVxdWlyZSgnLi4vLi4vYXBwbGljYXRpb25Qcm9qZWN0L2RhdGFhY2Nlc3MvbW9kZWwvY29tcGFueS9Qcm9qZWN0U3ViY3JpcHRpb24nKTtcbmxldCBDQ1Byb21pc2UgPSByZXF1aXJlKCdwcm9taXNlL2xpYi9lczYtZXh0ZW5zaW9ucycpO1xubGV0IGxvZzRqcyA9IHJlcXVpcmUoJ2xvZzRqcycpO1xubGV0IGxvZ2dlciA9IGxvZzRqcy5nZXRMb2dnZXIoJ1VzZXIgc2VydmljZScpO1xuXG5jbGFzcyBVc2VyU2VydmljZSB7XG4gIEFQUF9OQU1FOiBzdHJpbmc7XG4gIGNvbXBhbnlfbmFtZTogc3RyaW5nO1xuICBtaWRfY29udGVudDogYW55O1xuICBpc0FjdGl2ZUFkZEJ1aWxkaW5nQnV0dG9uOmJvb2xlYW49ZmFsc2U7XG4gIHByaXZhdGUgdXNlclJlcG9zaXRvcnk6IFVzZXJSZXBvc2l0b3J5O1xuICBwcml2YXRlIHByb2plY3RSZXBvc2l0b3J5IDogUHJvamVjdFJlcG9zaXRvcnk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeSA9IG5ldyBVc2VyUmVwb3NpdG9yeSgpO1xuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkgPSBuZXcgUHJvamVjdFJlcG9zaXRvcnkoKTtcbiAgICB0aGlzLkFQUF9OQU1FID0gUHJvamVjdEFzc2V0LkFQUF9OQU1FO1xuICB9XG5cbiAgY3JlYXRlVXNlcihpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnJldHJpZXZlKHsnZW1haWwnOiBpdGVtLmVtYWlsfSwgKGVyciwgcmVzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihlcnIpLCBudWxsKTtcbiAgICAgIH0gZWxzZSBpZiAocmVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbG9nZ2VyLmRlYnVnKCdFbWFpbCBhbHJlYWR5IGV4aXN0JytKU09OLnN0cmluZ2lmeShyZXMpKTtcblxuICAgICAgICBpZiAocmVzWzBdLmlzQWN0aXZhdGVkID09PSB0cnVlKSB7XG4gICAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT04pLCBudWxsKTtcbiAgICAgICAgfSBlbHNlIGlmIChyZXNbMF0uaXNBY3RpdmF0ZWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQUNDT1VOVCksIG51bGwpO1xuICAgICAgICB9XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvZ2dlci5kZWJ1ZygnRW1haWwgbm90IHByZXNlbnQuJytKU09OLnN0cmluZ2lmeShyZXMpKTtcbiAgICAgICAgY29uc3Qgc2FsdFJvdW5kcyA9IDEwO1xuICAgICAgICBiY3J5cHQuaGFzaChpdGVtLnBhc3N3b3JkLCBzYWx0Um91bmRzLCAoZXJyOiBhbnksIGhhc2g6IGFueSkgPT4ge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcignRXJyb3IgaW4gY3JlYXRpbmcgaGFzaCBwYXNzd29yZCcpO1xuICAgICAgICAgICAgY2FsbGJhY2soe1xuICAgICAgICAgICAgICByZWFzb246ICdFcnJvciBpbiBjcmVhdGluZyBoYXNoIHVzaW5nIGJjcnlwdCcsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICdFcnJvciBpbiBjcmVhdGluZyBoYXNoIHVzaW5nIGJjcnlwdCcsXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgICAgICBjb2RlOiA0MDNcbiAgICAgICAgICAgIH0sIG51bGwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb2dnZXIuZGVidWcoJ2NyZWF0ZWQgaGFzaCBzdWNjZXNmdWxseS4nKTtcbiAgICAgICAgICAgIGl0ZW0ucGFzc3dvcmQgPSBoYXNoO1xuICAgICAgICAgICAgbGV0IHN1YlNjcmlwdGlvblNlcnZpY2UgPSBuZXcgU3Vic2NyaXB0aW9uU2VydmljZSgpO1xuICAgICAgICAgICAgc3ViU2NyaXB0aW9uU2VydmljZS5nZXRTdWJzY3JpcHRpb25QYWNrYWdlQnlOYW1lKCdGcmVlJywnQmFzZVBhY2thZ2UnLCAoZXJyOiBhbnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJlZVN1YnNjcmlwdGlvbjogQXJyYXk8U3Vic2NyaXB0aW9uUGFja2FnZT4pID0+IHtcbiAgICAgICAgICAgICAgaWYgKGZyZWVTdWJzY3JpcHRpb24ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnZnJlZVN1YnNjcmlwdGlvbiBsZW5ndGggID4gMCcpO1xuICAgICAgICAgICAgICAgIHRoaXMuYXNzaWduRnJlZVN1YnNjcmlwdGlvbkFuZENyZWF0ZVVzZXIoaXRlbSwgZnJlZVN1YnNjcmlwdGlvblswXSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKCdmcmVlU3Vic2NyaXB0aW9uIGxlbmd0aCAhPT0wJyk7XG4gICAgICAgICAgICAgICAgc3ViU2NyaXB0aW9uU2VydmljZS5hZGRTdWJzY3JpcHRpb25QYWNrYWdlKGNvbmZpZy5nZXQoJ3N1YnNjcmlwdGlvbi5wYWNrYWdlLkZyZWUnKSxcbiAgICAgICAgICAgICAgICAgIChlcnI6IGFueSwgZnJlZVN1YnNjcmlwdGlvbik9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnYXNzaWduaW5nIGZyZWUgc3Vic2NyaXB0aW9uIGJ5IGNyZWF0aW5nIG5ldyB1c2VyJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXNzaWduRnJlZVN1YnNjcmlwdGlvbkFuZENyZWF0ZVVzZXIoaXRlbSwgZnJlZVN1YnNjcmlwdGlvbiwgY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgIH0pO1xuICB9XG5cbiAgY2hlY2tGb3JWYWxpZFN1YnNjcmlwdGlvbih1c2VyaWQgOiBzdHJpbmcsIGNhbGxiYWNrIDogKGVycm9yIDogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuXG4gICAgbGV0IHF1ZXJ5ID0gW1xuICAgICAgeyAkbWF0Y2g6IHsnX2lkJzp1c2VyaWR9fSxcbiAgICAgIHsgJHByb2plY3QgOiB7J3N1YnNjcmlwdGlvbic6MX19LFxuICAgICAgeyAkdW53aW5kOiAnJHN1YnNjcmlwdGlvbid9XG4gICAgXTtcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmFnZ3JlZ2F0ZShxdWVyeSAsKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgdmFsaWRTdWJzY3JpcHRpb25QYWNrYWdlO1xuICAgICAgICBpZihyZXN1bHQubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZvcihsZXQgc3Vic2NyaXB0aW9uUGFja2FnZSBvZiByZXN1bHQpIHtcbiAgICAgICAgICAgIGlmKHN1YnNjcmlwdGlvblBhY2thZ2Uuc3Vic2NyaXB0aW9uLnByb2plY3RJZC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgdmFsaWRTdWJzY3JpcHRpb25QYWNrYWdlID0gc3Vic2NyaXB0aW9uUGFja2FnZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2FsbGJhY2sobnVsbCwgdmFsaWRTdWJzY3JpcHRpb25QYWNrYWdlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gICBhc3NpZ25GcmVlU3Vic2NyaXB0aW9uQW5kQ3JlYXRlVXNlcihpdGVtOiBhbnksIGZyZWVTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvblBhY2thZ2UsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcbiAgICBsZXQgdXNlcjogVXNlck1vZGVsID0gaXRlbTtcbiAgICBsZXQgc2VuZE1haWxTZXJ2aWNlID0gbmV3IFNlbmRNYWlsU2VydmljZSgpO1xuICAgIHRoaXMuYXNzaWduRnJlZVN1YnNjcmlwdGlvblBhY2thZ2UodXNlciwgZnJlZVN1YnNjcmlwdGlvbik7XG4gICAgbG9nZ2VyLmRlYnVnKCdDcmVhdGluZyB1c2VyIHdpdGggbmV3IGZyZWUgdHJhaWwgc3Vic2NyaXB0aW9uIHBhY2thZ2UnKTtcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmNyZWF0ZSh1c2VyLCAoZXJyOkVycm9yLCByZXM6YW55KSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGxvZ2dlci5lcnJvcignRmFpbGVkIHRvIENyZWF0aW5nIHVzZXIgc3Vic2NyaXB0aW9uIHBhY2thZ2UnKTtcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT05fTU9CSUxFX05VTUJFUiksIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9nZ2VyLmRlYnVnKCdjcmVhdGVkIHVzZXIgc3VjY2VzZnVsbHkuJytKU09OLnN0cmluZ2lmeShyZXMpKTtcbiAgICAgICAgbGV0IGF1dGggPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XG4gICAgICAgIGxldCB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQocmVzKTtcbiAgICAgICAgbGV0IGhvc3QgPSBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLmhvc3QnKTtcbiAgICAgICAgbGV0IGxpbmsgPSBob3N0ICsgJ3NpZ25pbj9hY2Nlc3NfdG9rZW49JyArIHRva2VuICsgJyZfaWQ9JyArIHJlcy5faWQ7XG4gICAgICAgIGxldCBodG1sVGVtcGxhdGUgPSAnd2VsY29tZS1hYm9hcmQuaHRtbCc7XG4gICAgICAgIGxldCBkYXRhOk1hcDxzdHJpbmcsc3RyaW5nPj0gbmV3IE1hcChbWyckYXBwbGljYXRpb25MaW5rJCcsY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5ob3N0JyldLFxuICAgICAgICAgIFsnJGZpcnN0X25hbWUkJyxyZXMuZmlyc3RfbmFtZV0sWyckbGluayQnLGxpbmtdLFsnJGFwcF9uYW1lJCcsdGhpcy5BUFBfTkFNRV1dKTtcbiAgICAgICAgbGV0IGF0dGFjaG1lbnQgPSBNYWlsQXR0YWNobWVudHMuV2VsY29tZUFib2FyZEF0dGFjaG1lbnRBcnJheTtcbiAgICAgICAgbG9nZ2VyLmRlYnVnKCdzZW5kaW5nIG1haWwgdG8gbmV3IHVzZXIuJytKU09OLnN0cmluZ2lmeShhdHRhY2htZW50KSk7XG4gICAgICAgIHNlbmRNYWlsU2VydmljZS5zZW5kKCB1c2VyLmVtYWlsLCBNZXNzYWdlcy5FTUFJTF9TVUJKRUNUX0NBTkRJREFURV9SRUdJU1RSQVRJT04sIGh0bWxUZW1wbGF0ZSwgZGF0YSxhdHRhY2htZW50LFxuICAgICAgICAgIChlcnI6IGFueSwgcmVzdWx0OiBhbnkpID0+IHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgcmVzdWx0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0VXNlckZvckNoZWNraW5nQnVpbGRpbmcodXNlcklkOnN0cmluZyxwcm9qZWN0SWQ6c3RyaW5nLHVzZXI6VXNlcixjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgbGV0IHF1ZXJ5PSBbXG4gICAgICB7ICRtYXRjaDogeydfaWQnOnVzZXJJZH19LFxuICAgICAgeyAkcHJvamVjdCA6IHsnc3Vic2NyaXB0aW9uJzoxfX0sXG4gICAgICB7ICR1bndpbmQ6ICckc3Vic2NyaXB0aW9uJ30sXG4gICAgICB7ICRtYXRjaDogeydzdWJzY3JpcHRpb24ucHJvamVjdElkJzpwcm9qZWN0SWR9fVxuICAgIF07XG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5hZ2dyZWdhdGUocXVlcnksKGVycm9yLHJlc3VsdCk9PiB7XG4gICAgICBpZihlcnJvcikge1xuICAgICAgICBjYWxsYmFjayhlcnJvcixudWxsKTtcbiAgICAgIH1lbHNlIHtcbiAgICAgICAgaWYocmVzdWx0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmb3IobGV0IHN1YnNjcmlwdGlvblBhY2thZ2Ugb2YgcmVzdWx0KSB7XG4gICAgICAgICAgICAgIGlmKHN1YnNjcmlwdGlvblBhY2thZ2UgJiYgc3Vic2NyaXB0aW9uUGFja2FnZS5zdWJzY3JpcHRpb24ucHJvamVjdElkIT09bnVsbCkge1xuICAgICAgICAgICAgICAgIGxldCBxdWVyeSA9IHtfaWQ6IHByb2plY3RJZH07XG4gICAgICAgICAgICAgICAgbGV0IHBvcHVsYXRlID0ge3BhdGg6ICdidWlsZGluZycsIHNlbGVjdDogWyduYW1lJywgJ2J1aWxkaW5ncycsXX07XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kQW5kUG9wdWxhdGUocXVlcnksIHBvcHVsYXRlLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBub09mQnVpbGRpbmdzPXJlc3VsdC5idWlsZGluZ3MubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBpZihzdWJzY3JpcHRpb25QYWNrYWdlICYmIG5vT2ZCdWlsZGluZ3MgPD0gc3Vic2NyaXB0aW9uUGFja2FnZS5zdWJzY3JpcHRpb24ubnVtT2ZCdWlsZGluZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQWN0aXZlQWRkQnVpbGRpbmdCdXR0b249ZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQWN0aXZlQWRkQnVpbGRpbmdCdXR0b249dHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLHJlc3VsdCk7XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjYWxsYmFjayhudWxsLHtkYXRhOnRoaXMuaXNBY3RpdmVBZGRCdWlsZGluZ0J1dHRvbn0pO1xuICAgIH0pO1xuICB9XG5cblxuICBhc3NpZ25GcmVlU3Vic2NyaXB0aW9uUGFja2FnZSh1c2VyOiBVc2VyTW9kZWwsIGZyZWVTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvblBhY2thZ2UpIHtcbiAgICBsZXQgc3Vic2NyaXB0aW9uID0gbmV3IFVzZXJTdWJzY3JpcHRpb24oKTtcbiAgICBzdWJzY3JpcHRpb24uYWN0aXZhdGlvbkRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIHN1YnNjcmlwdGlvbi5udW1PZkJ1aWxkaW5ncyA9IGZyZWVTdWJzY3JpcHRpb24uYmFzZVBhY2thZ2UubnVtT2ZCdWlsZGluZ3M7XG4gICAgc3Vic2NyaXB0aW9uLm51bU9mUHJvamVjdHMgPSBmcmVlU3Vic2NyaXB0aW9uLmJhc2VQYWNrYWdlLm51bU9mUHJvamVjdHM7XG4gICAgc3Vic2NyaXB0aW9uLnZhbGlkaXR5ID0gZnJlZVN1YnNjcmlwdGlvbi5iYXNlUGFja2FnZS52YWxpZGl0eTtcbiAgICBzdWJzY3JpcHRpb24ucHJvamVjdElkID0gbmV3IEFycmF5PHN0cmluZz4oKTtcbiAgICBzdWJzY3JpcHRpb24ucHVyY2hhc2VkID0gbmV3IEFycmF5PEJhc2VTdWJzY3JpcHRpb25QYWNrYWdlPigpO1xuICAgIHN1YnNjcmlwdGlvbi5wdXJjaGFzZWQucHVzaChmcmVlU3Vic2NyaXB0aW9uLmJhc2VQYWNrYWdlKTtcbiAgICB1c2VyLnN1YnNjcmlwdGlvbiA9IG5ldyBBcnJheTxVc2VyU3Vic2NyaXB0aW9uPigpO1xuICAgIHVzZXIuc3Vic2NyaXB0aW9uLnB1c2goc3Vic2NyaXB0aW9uKTtcbiAgfVxuXG4gIGxvZ2luKGRhdGE6IGFueSwgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy5yZXRyaWV2ZSh7J2VtYWlsJzogZGF0YS5lbWFpbH0sIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICAgICAgfSBlbHNlIGlmIChyZXN1bHQubGVuZ3RoID4gMCAmJiByZXN1bHRbMF0uaXNBY3RpdmF0ZWQgPT09IHRydWUpIHtcbiAgICAgICAgYmNyeXB0LmNvbXBhcmUoZGF0YS5wYXNzd29yZCwgcmVzdWx0WzBdLnBhc3N3b3JkLCAoZXJyOiBhbnksIGlzU2FtZTogYW55KSA9PiB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgY2FsbGJhY2soe1xuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9SRUdJU1RSQVRJT05fU1RBVFVTLFxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0NBTkRJREFURV9BQ0NPVU5ULFxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgICAgICAgYWN0dWFsRXJyb3I6IGVycixcbiAgICAgICAgICAgICAgY29kZTogNTAwXG4gICAgICAgICAgICB9LCBudWxsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLypjb25zb2xlLmxvZygnZ290IHVzZXInKTsqL1xuICAgICAgICAgICAgaWYgKGlzU2FtZSkge1xuICAgICAgICAgICAgICBsZXQgYXV0aCA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcbiAgICAgICAgICAgICAgbGV0IHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZChyZXN1bHRbMF0pO1xuICAgICAgICAgICAgICB2YXIgZGF0YTogYW55ID0ge1xuICAgICAgICAgICAgICAgICdzdGF0dXMnOiBNZXNzYWdlcy5TVEFUVVNfU1VDQ0VTUyxcbiAgICAgICAgICAgICAgICAnZGF0YSc6IHtcbiAgICAgICAgICAgICAgICAgICdmaXJzdF9uYW1lJzogcmVzdWx0WzBdLmZpcnN0X25hbWUsXG4gICAgICAgICAgICAgICAgICAnbGFzdF9uYW1lJzogcmVzdWx0WzBdLmxhc3RfbmFtZSxcbiAgICAgICAgICAgICAgICAgICdjb21wYW55X25hbWUnOiByZXN1bHRbMF0uY29tcGFueV9uYW1lLFxuICAgICAgICAgICAgICAgICAgJ2VtYWlsJzogcmVzdWx0WzBdLmVtYWlsLFxuICAgICAgICAgICAgICAgICAgJ19pZCc6IHJlc3VsdFswXS5faWQsXG4gICAgICAgICAgICAgICAgICAnY3VycmVudF90aGVtZSc6IHJlc3VsdFswXS5jdXJyZW50X3RoZW1lLFxuICAgICAgICAgICAgICAgICAgJ3BpY3R1cmUnOiByZXN1bHRbMF0ucGljdHVyZSxcbiAgICAgICAgICAgICAgICAgICdtb2JpbGVfbnVtYmVyJzogcmVzdWx0WzBdLm1vYmlsZV9udW1iZXIsXG4gICAgICAgICAgICAgICAgICAnYWNjZXNzX3Rva2VuJzogdG9rZW5cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGFjY2Vzc190b2tlbjogdG9rZW5cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgZGF0YSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjYWxsYmFjayh7XG4gICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dST05HX1BBU1NXT1JELFxuICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgICAgICAgIGNvZGU6IDQwMFxuICAgICAgICAgICAgICB9LCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChyZXN1bHQubGVuZ3RoID4gMCAmJiByZXN1bHRbMF0uaXNBY3RpdmF0ZWQgPT09IGZhbHNlKSB7XG4gICAgICAgIGNhbGxiYWNrKHtcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9SRUdJU1RSQVRJT05fU1RBVFVTLFxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQ0FORElEQVRFX0FDQ09VTlQsXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgY29kZTogNTAwXG4gICAgICAgIH0sIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2soe1xuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9VU0VSX05PVF9GT1VORCxcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVVNFUl9OT1RfUFJFU0VOVCxcbiAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgICBjb2RlOiA0MDBcbiAgICAgICAgfSxudWxsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNlbmRPdHAocGFyYW1zOiBhbnksIHVzZXI6IGFueSwgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgbGV0IERhdGEgPSB7XG4gICAgICBuZXdfbW9iaWxlX251bWJlcjogcGFyYW1zLm1vYmlsZV9udW1iZXIsXG4gICAgICBvbGRfbW9iaWxlX251bWJlcjogdXNlci5tb2JpbGVfbnVtYmVyLFxuICAgICAgX2lkOiB1c2VyLl9pZFxuICAgIH07XG4gICAgdGhpcy5nZW5lcmF0ZU90cChEYXRhLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGlmIChlcnJvciA9PT0gTWVzc2FnZXMuTVNHX0VSUk9SX0NIRUNLX01PQklMRV9QUkVTRU5UKSB7XG4gICAgICAgICAgY2FsbGJhY2soe1xuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0VYSVNUSU5HX1VTRVIsXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfUkVHSVNUUkFUSU9OX01PQklMRV9OVU1CRVIsXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgICAgIGNvZGU6IDQwMFxuICAgICAgICAgIH0sIG51bGwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChyZXN1bHQubGVuZ3RoID4gMCkge1xuICAgICAgICBjYWxsYmFjayh7XG4gICAgICAgICAgJ3N0YXR1cyc6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxuICAgICAgICAgICdkYXRhJzoge1xuICAgICAgICAgICAgJ21lc3NhZ2UnOiBNZXNzYWdlcy5NU0dfU1VDQ0VTU19PVFBcbiAgICAgICAgICB9XG4gICAgICAgIH0sIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2soe1xuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9VU0VSX05PVF9GT1VORCxcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX1VTRVJfTk9UX0ZPVU5ELFxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgIGNvZGU6IDQwMFxuICAgICAgICB9LCBudWxsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdlbmVyYXRlT3RwKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnJldHJpZXZlKHsnbW9iaWxlX251bWJlcic6IGZpZWxkLm5ld19tb2JpbGVfbnVtYmVyLCAnaXNBY3RpdmF0ZWQnOiB0cnVlfSwgKGVyciwgcmVzKSA9PiB7XG5cbiAgICAgIGlmIChlcnIpIHtcbiAgICAgIH0gZWxzZSBpZiAocmVzLmxlbmd0aCA+IDAgJiYgKHJlc1swXS5faWQpICE9PSBmaWVsZC5faWQpIHtcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT05fTU9CSUxFX05VTUJFUiksIG51bGwpO1xuICAgICAgfSBlbHNlIGlmIChyZXMubGVuZ3RoID09PSAwKSB7XG5cbiAgICAgICAgbGV0IHF1ZXJ5ID0geydfaWQnOiBmaWVsZC5faWR9O1xuICAgICAgICBsZXQgb3RwID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDk5OTk5KSArIDEwMDAwMCk7XG4gICAgICAgIGxldCB1cGRhdGVEYXRhID0geydtb2JpbGVfbnVtYmVyJzogZmllbGQubmV3X21vYmlsZV9udW1iZXIsICdvdHAnOiBvdHB9O1xuICAgICAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZURhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT05fTU9CSUxFX05VTUJFUiksIG51bGwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgRGF0YSA9IHtcbiAgICAgICAgICAgICAgbW9iaWxlTm86IGZpZWxkLm5ld19tb2JpbGVfbnVtYmVyLFxuICAgICAgICAgICAgICBvdHA6IG90cFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGxldCBzZW5kTWVzc2FnZVNlcnZpY2UgPSBuZXcgU2VuZE1lc3NhZ2VTZXJ2aWNlKCk7XG4gICAgICAgICAgICBzZW5kTWVzc2FnZVNlcnZpY2Uuc2VuZE1lc3NhZ2VEaXJlY3QoRGF0YSwgY2FsbGJhY2spO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTl9NT0JJTEVfTlVNQkVSKSwgbnVsbCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB2ZXJpZnlPdHAocGFyYW1zOiBhbnksIHVzZXI6YW55LCBjYWxsYmFjazooZXJyb3I6YW55LCByZXN1bHQ6YW55KSA9PiB2b2lkKSB7XG4gICAgbGV0IG1haWxDaGltcE1haWxlclNlcnZpY2UgPSBuZXcgTWFpbENoaW1wTWFpbGVyU2VydmljZSgpO1xuXG4gICAgbGV0IHF1ZXJ5ID0geydfaWQnOiB1c2VyLl9pZCwgJ2lzQWN0aXZhdGVkJzogZmFsc2V9O1xuICAgIGxldCB1cGRhdGVEYXRhID0geydpc0FjdGl2YXRlZCc6IHRydWUsICdhY3RpdmF0aW9uX2RhdGUnOiBuZXcgRGF0ZSgpfTtcbiAgICBpZiAodXNlci5vdHAgPT09IHBhcmFtcy5vdHApIHtcbiAgICAgIHRoaXMuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjayhudWxsLHtcbiAgICAgICAgICAgICdzdGF0dXMnOiAnU3VjY2VzcycsXG4gICAgICAgICAgICAnZGF0YSc6IHsnbWVzc2FnZSc6ICdVc2VyIEFjY291bnQgdmVyaWZpZWQgc3VjY2Vzc2Z1bGx5J31cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBtYWlsQ2hpbXBNYWlsZXJTZXJ2aWNlLm9uQ2FuZGlkYXRlU2lnblN1Y2Nlc3MocmVzdWx0KTtcblxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FsbGJhY2soe1xuICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcbiAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dST05HX09UUCxcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgIGNvZGU6IDQwMFxuICAgICAgfSwgbnVsbCk7XG4gICAgfVxuXG4gIH1cblxuICBjaGFuZ2VNb2JpbGVOdW1iZXIoZmllbGQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuXG4gICAgbGV0IHF1ZXJ5ID0geydfaWQnOiBmaWVsZC5faWR9O1xuICAgIGxldCBvdHAgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogOTk5OTkpICsgMTAwMDAwKTtcbiAgICBsZXQgdXBkYXRlRGF0YSA9IHsnb3RwJzogb3RwLCAndGVtcF9tb2JpbGUnOiBmaWVsZC5uZXdfbW9iaWxlX251bWJlcn07XG5cbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZURhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfUkVHSVNUUkFUSU9OKSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgRGF0YSA9IHtcbiAgICAgICAgICBjdXJyZW50X21vYmlsZV9udW1iZXI6IGZpZWxkLmN1cnJlbnRfbW9iaWxlX251bWJlcixcbiAgICAgICAgICBtb2JpbGVObzogZmllbGQubmV3X21vYmlsZV9udW1iZXIsXG4gICAgICAgICAgb3RwOiBvdHBcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IHNlbmRNZXNzYWdlU2VydmljZSA9IG5ldyBTZW5kTWVzc2FnZVNlcnZpY2UoKTtcbiAgICAgICAgc2VuZE1lc3NhZ2VTZXJ2aWNlLnNlbmRDaGFuZ2VNb2JpbGVNZXNzYWdlKERhdGEsIGNhbGxiYWNrKTtcblxuICAgICAgfVxuICAgIH0pO1xuXG4gIH1cblxuICBmb3Jnb3RQYXNzd29yZChmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogU2VudE1lc3NhZ2VJbmZvKSA9PiB2b2lkKSB7XG5cbiAgICBsZXQgc2VuZE1haWxTZXJ2aWNlID0gbmV3IFNlbmRNYWlsU2VydmljZSgpO1xuICAgIGxldCBxdWVyeSA9IHsnZW1haWwnOiBmaWVsZC5lbWFpbH07XG5cbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnJldHJpZXZlKHF1ZXJ5LCAoZXJyLCByZXMpID0+IHtcblxuICAgICAgaWYgKHJlcy5sZW5ndGggPiAwICYmIHJlc1swXS5pc0FjdGl2YXRlZCA9PT0gdHJ1ZSkge1xuXG4gICAgICAgIGxldCBhdXRoID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xuICAgICAgICBsZXQgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc1swXSk7XG4gICAgICAgIGxldCBob3N0ID0gY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5ob3N0Jyk7XG4gICAgICAgIGxldCBsaW5rID0gaG9zdCArICdyZXNldC1wYXNzd29yZD9hY2Nlc3NfdG9rZW49JyArIHRva2VuICsgJyZfaWQ9JyArIHJlc1swXS5faWQ7XG4gICAgICAgIGxldCBodG1sVGVtcGxhdGUgPSAnZm9yZ290cGFzc3dvcmQuaHRtbCc7XG4gICAgICAgIGxldCBkYXRhOk1hcDxzdHJpbmcsc3RyaW5nPj0gbmV3IE1hcChbWyckYXBwbGljYXRpb25MaW5rJCcsY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5ob3N0JyldLFxuICAgICAgICAgIFsnJGZpcnN0X25hbWUkJyxyZXNbMF0uZmlyc3RfbmFtZV0sWyckdXNlcl9tYWlsJCcscmVzWzBdLmVtYWlsXSxbJyRsaW5rJCcsbGlua10sWyckYXBwX25hbWUkJyx0aGlzLkFQUF9OQU1FXV0pO1xuICAgICAgICBsZXQgYXR0YWNobWVudD1NYWlsQXR0YWNobWVudHMuRm9yZ2V0UGFzc3dvcmRBdHRhY2htZW50QXJyYXk7XG4gICAgICAgIHNlbmRNYWlsU2VydmljZS5zZW5kKCBmaWVsZC5lbWFpbCwgTWVzc2FnZXMuRU1BSUxfU1VCSkVDVF9GT1JHT1RfUEFTU1dPUkQsIGh0bWxUZW1wbGF0ZSwgZGF0YSxhdHRhY2htZW50LFxuKGVycjogYW55LCByZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyLCByZXN1bHQpO1xuICAgICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChyZXMubGVuZ3RoID4gMCAmJiByZXNbMF0uaXNBY3RpdmF0ZWQgPT09IGZhbHNlKSB7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfQUNDT1VOVF9TVEFUVVMpLCByZXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9VU0VSX05PVF9GT1VORCksIHJlcyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgfVxuXG5cbiAgU2VuZENoYW5nZU1haWxWZXJpZmljYXRpb24oZmllbGQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IFNlbnRNZXNzYWdlSW5mbykgPT4gdm9pZCkge1xuICAgIGxldCBxdWVyeSA9IHsnZW1haWwnOiBmaWVsZC5jdXJyZW50X2VtYWlsLCAnaXNBY3RpdmF0ZWQnOiB0cnVlfTtcbiAgICBsZXQgdXBkYXRlRGF0YSA9IHskc2V0OnsndGVtcF9lbWFpbCc6IGZpZWxkLm5ld19lbWFpbH19O1xuICAgIHRoaXMudXNlclJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfRU1BSUxfQUNUSVZFX05PVyksIG51bGwpO1xuICAgICAgfSBlbHNlIGlmKHJlc3VsdCA9PSBudWxsKSB7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0FDQ09VTlQpLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBhdXRoID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xuICAgICAgICBsZXQgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc3VsdCk7XG4gICAgICAgIGxldCBob3N0ID0gY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5ob3N0Jyk7XG4gICAgICAgIGxldCBsaW5rID0gaG9zdCArICdhY3RpdmF0ZS11c2VyP2FjY2Vzc190b2tlbj0nICsgdG9rZW4gKyAnJl9pZD0nICsgcmVzdWx0Ll9pZCsnaXNFbWFpbFZlcmlmaWNhdGlvbic7XG4gICAgICAgIGxldCBzZW5kTWFpbFNlcnZpY2UgPSBuZXcgU2VuZE1haWxTZXJ2aWNlKCk7XG4gICAgICAgIGxldCBkYXRhOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcChbWyckYXBwbGljYXRpb25MaW5rJCcsY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5ob3N0JyldLFxuICAgICAgICAgIFsnJGxpbmskJywgbGlua11dKTtcbiAgICAgICAgbGV0IGF0dGFjaG1lbnQ9TWFpbEF0dGFjaG1lbnRzLkF0dGFjaG1lbnRBcnJheTtcbiAgICAgICAgc2VuZE1haWxTZXJ2aWNlLnNlbmQoZmllbGQubmV3X2VtYWlsLFxuICAgICAgICAgIE1lc3NhZ2VzLkVNQUlMX1NVQkpFQ1RfQ0hBTkdFX0VNQUlMSUQsXG4gICAgICAgICAgJ2NoYW5nZS5tYWlsLmh0bWwnLCBkYXRhLGF0dGFjaG1lbnQsIGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNlbmRNYWlsKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBTZW50TWVzc2FnZUluZm8pID0+IHZvaWQpIHtcbiAgICBsZXQgc2VuZE1haWxTZXJ2aWNlID0gbmV3IFNlbmRNYWlsU2VydmljZSgpO1xuICAgIGxldCBkYXRhOk1hcDxzdHJpbmcsc3RyaW5nPj0gbmV3IE1hcChbWyckYXBwbGljYXRpb25MaW5rJCcsY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5ob3N0JyldLFxuICAgICAgWyckZmlyc3RfbmFtZSQnLGZpZWxkLmZpcnN0X25hbWVdLFsnJGVtYWlsJCcsZmllbGQuZW1haWxdLFsnJG1lc3NhZ2UkJyxmaWVsZC5tZXNzYWdlXV0pO1xuICAgIGxldCBhdHRhY2htZW50PU1haWxBdHRhY2htZW50cy5BdHRhY2htZW50QXJyYXk7XG4gICAgc2VuZE1haWxTZXJ2aWNlLnNlbmQoY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5BRE1JTl9NQUlMJyksXG4gICAgICBNZXNzYWdlcy5FTUFJTF9TVUJKRUNUX1VTRVJfQ09OVEFDVEVEX1lPVSxcbiAgICAgICdjb250YWN0dXMubWFpbC5odG1sJyxkYXRhLGF0dGFjaG1lbnQsY2FsbGJhY2spO1xuICB9XG5cbiAgc2VuZE1haWxPbkVycm9yKGVycm9ySW5mbzogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogU2VudE1lc3NhZ2VJbmZvKSA9PiB2b2lkKSB7XG4gICAgbGV0IGN1cnJlbnRfVGltZSA9IG5ldyBEYXRlKCkudG9Mb2NhbGVUaW1lU3RyaW5nKFtdLCB7aG91cjogJzItZGlnaXQnLCBtaW51dGU6ICcyLWRpZ2l0J30pO1xuICAgIGxldCBkYXRhOk1hcDxzdHJpbmcsc3RyaW5nPjtcbiAgICBpZihlcnJvckluZm8uc3RhY2tUcmFjZSkge1xuICAgICAgIGRhdGE9IG5ldyBNYXAoW1snJGFwcGxpY2F0aW9uTGluayQnLGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpXSxcbiAgICAgICAgIFsnJHRpbWUkJyxjdXJyZW50X1RpbWVdLFsnJGhvc3QkJyxjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLmhvc3QnKV0sXG4gICAgICAgIFsnJHJlYXNvbiQnLGVycm9ySW5mby5yZWFzb25dLFsnJGNvZGUkJyxlcnJvckluZm8uY29kZV0sXG4gICAgICAgIFsnJG1lc3NhZ2UkJyxlcnJvckluZm8ubWVzc2FnZV0sWyckZXJyb3IkJyxlcnJvckluZm8uc3RhY2tUcmFjZS5zdGFja11dKTtcblxuICAgIH0gZWxzZSBpZihlcnJvckluZm8uc3RhY2spIHtcbiAgICAgIGRhdGE9IG5ldyBNYXAoW1snJGFwcGxpY2F0aW9uTGluayQnLGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpXSxcbiAgICAgICAgWyckdGltZSQnLGN1cnJlbnRfVGltZV0sWyckaG9zdCQnLGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpXSxcbiAgICAgICAgWyckcmVhc29uJCcsZXJyb3JJbmZvLnJlYXNvbl0sWyckY29kZSQnLGVycm9ySW5mby5jb2RlXSxcbiAgICAgICAgWyckbWVzc2FnZSQnLGVycm9ySW5mby5tZXNzYWdlXSxbJyRlcnJvciQnLGVycm9ySW5mby5zdGFja11dKTtcbiAgICB9XG4gICAgbGV0IHNlbmRNYWlsU2VydmljZSA9IG5ldyBTZW5kTWFpbFNlcnZpY2UoKTtcbiAgICBsZXQgYXR0YWNobWVudCA9IE1haWxBdHRhY2htZW50cy5BdHRhY2htZW50QXJyYXk7XG4gICAgc2VuZE1haWxTZXJ2aWNlLnNlbmQoY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5BRE1JTl9NQUlMJyksXG4gICAgICBNZXNzYWdlcy5FTUFJTF9TVUJKRUNUX1NFUlZFUl9FUlJPUiArICcgb24gJyArIGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpLFxuICAgICAgJ2Vycm9yLm1haWwuaHRtbCcsZGF0YSxhdHRhY2htZW50LCBjYWxsYmFjayxjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLlRQTEdST1VQX01BSUwnKSk7XG4gIH1cblxuICBmaW5kQnlJZChpZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kQnlJZChpZCwgY2FsbGJhY2spO1xuICB9XG5cbiAgcmV0cmlldmUoZmllbGQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIHRoaXMudXNlclJlcG9zaXRvcnkucmV0cmlldmUoZmllbGQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJldHJpZXZlV2l0aExpbWl0KGZpZWxkOiBhbnksIGluY2x1ZGVkIDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgbGV0IGxpbWl0ID0gY29uZmlnLmdldCgnYXBwbGljYXRpb24ubGltaXRGb3JRdWVyeScpO1xuICAgIHRoaXMudXNlclJlcG9zaXRvcnkucmV0cmlldmVXaXRoTGltaXQoZmllbGQsIGluY2x1ZGVkLCBsaW1pdCwgY2FsbGJhY2spO1xuICB9XG5cbiAgcmV0cmlldmVXaXRoTGVhbihmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5yZXRyaWV2ZShmaWVsZCwgY2FsbGJhY2spO1xuICB9XG5cbiAgcmV0cmlldmVBbGwoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5yZXRyaWV2ZShpdGVtLCAoZXJyLCByZXMpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT05fTU9CSUxFX05VTUJFUiksIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZShfaWQ6IGFueSwgaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG5cbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmZpbmRCeUlkKF9pZCwgKGVycjogYW55LCByZXM6IGFueSkgPT4ge1xuXG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgcmVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudXNlclJlcG9zaXRvcnkudXBkYXRlKF9pZCwgaXRlbSwgY2FsbGJhY2spO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cblxuICBkZWxldGUoX2lkOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmRlbGV0ZShfaWQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGZpbmRPbmVBbmRVcGRhdGUocXVlcnk6IGFueSwgbmV3RGF0YTogYW55LCBvcHRpb25zOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIG5ld0RhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIFVwbG9hZEltYWdlKHRlbXBQYXRoOiBhbnksIGZpbGVOYW1lOiBhbnksIGNiOiBhbnkpIHtcbiAgICBsZXQgdGFyZ2V0cGF0aCA9IGZpbGVOYW1lO1xuICAgIGZzLnJlbmFtZSh0ZW1wUGF0aCwgdGFyZ2V0cGF0aCwgZnVuY3Rpb24gKGVycikge1xuICAgICAgY2IobnVsbCwgdGVtcFBhdGgpO1xuICAgIH0pO1xuICB9XG5cbiAgVXBsb2FkRG9jdW1lbnRzKHRlbXBQYXRoOiBhbnksIGZpbGVOYW1lOiBhbnksIGNiOiBhbnkpIHtcbiAgICBsZXQgdGFyZ2V0cGF0aCA9IGZpbGVOYW1lO1xuICAgIGZzLnJlbmFtZSh0ZW1wUGF0aCwgdGFyZ2V0cGF0aCwgZnVuY3Rpb24gKGVycjogYW55KSB7XG4gICAgICBjYihudWxsLCB0ZW1wUGF0aCk7XG4gICAgfSk7XG4gIH1cblxuICBmaW5kQW5kVXBkYXRlTm90aWZpY2F0aW9uKHF1ZXJ5OiBhbnksIG5ld0RhdGE6IGFueSwgb3B0aW9uczogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBuZXdEYXRhLCBvcHRpb25zLCBjYWxsYmFjayk7XG4gIH1cblxuICByZXRyaWV2ZUJ5U29ydGVkT3JkZXIocXVlcnk6IGFueSwgcHJvamVjdGlvbjphbnksIHNvcnRpbmdRdWVyeTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgLy90aGlzLnVzZXJSZXBvc2l0b3J5LnJldHJpZXZlQnlTb3J0ZWRPcmRlcihxdWVyeSwgcHJvamVjdGlvbiwgc29ydGluZ1F1ZXJ5LCBjYWxsYmFjayk7XG4gIH1cblxuICByZXNldFBhc3N3b3JkKGRhdGE6IGFueSwgdXNlciA6IGFueSwgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PmFueSkge1xuICAgIGNvbnN0IHNhbHRSb3VuZHMgPSAxMDtcbiAgICBiY3J5cHQuaGFzaChkYXRhLm5ld19wYXNzd29yZCwgc2FsdFJvdW5kcywgKGVycjogYW55LCBoYXNoOiBhbnkpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY2FsbGJhY2soe1xuICAgICAgICAgIHJlYXNvbjogJ0Vycm9yIGluIGNyZWF0aW5nIGhhc2ggdXNpbmcgYmNyeXB0JyxcbiAgICAgICAgICBtZXNzYWdlOiAnRXJyb3IgaW4gY3JlYXRpbmcgaGFzaCB1c2luZyBiY3J5cHQnLFxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgIGNvZGU6IDQwM1xuICAgICAgICB9LCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCB1cGRhdGVEYXRhID0geydwYXNzd29yZCc6IGhhc2h9O1xuICAgICAgICBsZXQgcXVlcnkgPSB7J19pZCc6IHVzZXIuX2lkLCAncGFzc3dvcmQnOiB1c2VyLnBhc3N3b3JkfTtcbiAgICAgICAgdGhpcy5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCx7XG4gICAgICAgICAgICAgICdzdGF0dXMnOiAnU3VjY2VzcycsXG4gICAgICAgICAgICAgICdkYXRhJzogeydtZXNzYWdlJzogJ1Bhc3N3b3JkIGNoYW5nZWQgc3VjY2Vzc2Z1bGx5J31cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVEZXRhaWxzKGRhdGE6ICBVc2VyTW9kZWwsIHVzZXI6IFVzZXJNb2RlbCwgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgbGV0IGF1dGg6IEF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcbiAgICBsZXQgcXVlcnkgPSB7J19pZCc6IHVzZXIuX2lkfTtcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIGRhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKG51bGwse1xuICAgICAgICAgICdzdGF0dXMnOiAnU3VjY2VzcycsXG4gICAgICAgICAgJ2RhdGEnOiB7J21lc3NhZ2UnOiAnVXNlciBQcm9maWxlIFVwZGF0ZWQgc3VjY2Vzc2Z1bGx5J31cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICB9KTtcbiAgfVxuXG4gIGdldFVzZXJCeUlkKHVzZXI6YW55LCBjYWxsYmFjazooZXJyb3I6YW55LCByZXN1bHQ6YW55KT0+dm9pZCkge1xuICAgIGxldCBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XG5cbiAgICBsZXQgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpO1xuICAgIGNhbGxiYWNrKG51bGwse1xuICAgICAgJ3N0YXR1cyc6ICdzdWNjZXNzJyxcbiAgICAgICdkYXRhJzoge1xuICAgICAgICAnZmlyc3RfbmFtZSc6IHVzZXIuZmlyc3RfbmFtZSxcbiAgICAgICAgJ2xhc3RfbmFtZSc6IHVzZXIubGFzdF9uYW1lLFxuICAgICAgICAnZW1haWwnOiB1c2VyLmVtYWlsLFxuICAgICAgICAnbW9iaWxlX251bWJlcic6IHVzZXIubW9iaWxlX251bWJlcixcbiAgICAgICAgJ2NvbXBhbnlfbmFtZSc6IHVzZXIuY29tcGFueV9uYW1lLFxuICAgICAgICAnc3RhdGUnOiB1c2VyLnN0YXRlLFxuICAgICAgICAnY2l0eSc6IHVzZXIuY2l0eSxcbiAgICAgICAgJ3BpY3R1cmUnOiB1c2VyLnBpY3R1cmUsXG4gICAgICAgICdzb2NpYWxfcHJvZmlsZV9waWN0dXJlJzogdXNlci5zb2NpYWxfcHJvZmlsZV9waWN0dXJlLFxuICAgICAgICAnX2lkJzogdXNlci5faWQsXG4gICAgICAgICdjdXJyZW50X3RoZW1lJzogdXNlci5jdXJyZW50X3RoZW1lXG4gICAgICB9LFxuICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblxuICAgIH0pO1xuICB9XG5cbiAgdmVyaWZ5QWNjb3VudCh1c2VyOlVzZXIsIGNhbGxiYWNrOihlcnJvcjphbnksIHJlc3VsdDphbnkpPT52b2lkKSB7XG4gICAgbGV0IHF1ZXJ5ID0geydfaWQnOiB1c2VyLl9pZCwgJ2lzQWN0aXZhdGVkJzogZmFsc2V9O1xuICAgIGxldCB1cGRhdGVEYXRhID0geydpc0FjdGl2YXRlZCc6IHRydWV9O1xuICAgIHRoaXMuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sobnVsbCx7XG4gICAgICAgICAgJ3N0YXR1cyc6ICdTdWNjZXNzJyxcbiAgICAgICAgICAnZGF0YSc6IHsnbWVzc2FnZSc6ICdVc2VyIEFjY291bnQgdmVyaWZpZWQgc3VjY2Vzc2Z1bGx5J31cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICB9KTtcbiAgfVxuXG4gIGNoYW5nZUVtYWlsSWQoZGF0YTphbnksIHVzZXIgOiBVc2VyLCBjYWxsYmFjazooZXJyb3I6YW55LCByZXN1bHQ6YW55KT0+dm9pZCkge1xuICAgIGxldCBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XG4gICAgbGV0IHF1ZXJ5ID0geydlbWFpbCc6IGRhdGEubmV3X2VtYWlsfTtcblxuICAgIHRoaXMucmV0cmlldmUocXVlcnksIChlcnJvciwgcmVzdWx0KSA9PiB7XG5cbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICB9IGVsc2UgaWYgKHJlc3VsdC5sZW5ndGggPiAwICYmIHJlc3VsdFswXS5pc0FjdGl2YXRlZCA9PT0gdHJ1ZSkge1xuICAgICAgICBjYWxsYmFjayh7XG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0VYSVNUSU5HX1VTRVIsXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTixcbiAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgICBjb2RlOiA0MDBcbiAgICAgICAgfSxudWxsKTtcbiAgICAgIH0gZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDAgJiYgcmVzdWx0WzBdLmlzQWN0aXZhdGVkID09PSBmYWxzZSkge1xuICAgICAgICBjYWxsYmFjayh7XG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0VYSVNUSU5HX1VTRVIsXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0FDQ09VTlRfU1RBVFVTLFxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgIGNvZGU6IDQwMFxuICAgICAgICB9LCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuU2VuZENoYW5nZU1haWxWZXJpZmljYXRpb24oZGF0YSwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChlcnJvci5tZXNzYWdlID09PSBNZXNzYWdlcy5NU0dfRVJST1JfQ0hFQ0tfRU1BSUxfQUNDT1VOVCkge1xuICAgICAgICAgICAgICBjYWxsYmFjayh7XG4gICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0VYSVNUSU5HX1VTRVIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNQUlMX0FDVElWRV9OT1csXG4gICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgICAgICAgY29kZTogNDAwXG4gICAgICAgICAgICAgIH0sIG51bGwpO1xuICAgICAgICAgICAgfWlmIChlcnJvci5tZXNzYWdlID09PSBNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0FDQ09VTlQpIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2soe1xuICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1ZFUklGWV9BQ0NPVU5ULFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQUNDT1VOVCxcbiAgICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgICAgICAgICBjb2RlOiA0MDBcbiAgICAgICAgICAgICAgfSwgbnVsbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjYWxsYmFjayh7XG4gICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX1dISUxFX0NPTlRBQ1RJTkcsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dISUxFX0NPTlRBQ1RJTkcsXG4gICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgICAgICAgY29kZTogNDAwXG4gICAgICAgICAgICAgIH0sIG51bGwpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtcbiAgICAgICAgICAgICAgJ3N0YXR1cyc6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxuICAgICAgICAgICAgICAnZGF0YSc6IHsnbWVzc2FnZSc6IE1lc3NhZ2VzLk1TR19TVUNDRVNTX0VNQUlMX0NIQU5HRV9FTUFJTElEfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdmVyaWZ5Q2hhbmdlZEVtYWlsSWQodXNlcjogYW55LCBjYWxsYmFjazooZXJyb3IgOiBhbnksIHJlc3VsdCA6IGFueSk9PiBhbnkpIHtcbiAgICBsZXQgcXVlcnkgPSB7J19pZCc6IHVzZXIuX2lkfTtcbiAgICBsZXQgdXBkYXRlRGF0YSA9IHsnZW1haWwnOiB1c2VyLnRlbXBfZW1haWwsICd0ZW1wX2VtYWlsJzogdXNlci5lbWFpbH07XG4gICAgdGhpcy5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayhudWxsLHtcbiAgICAgICAgICAnc3RhdHVzJzogJ1N1Y2Nlc3MnLFxuICAgICAgICAgICdkYXRhJzogeydtZXNzYWdlJzogJ1VzZXIgQWNjb3VudCB2ZXJpZmllZCBzdWNjZXNzZnVsbHknfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgIH0pO1xuICB9XG5cbiAgdmVyaWZ5TW9iaWxlTnVtYmVyKGRhdGEgOmFueSAsIHVzZXIgOiBhbnksIGNhbGxiYWNrOihlcnJvcjphbnksIHJlc3VsdDphbnkpPT52b2lkKSB7XG4gICAgbGV0IHF1ZXJ5ID0geydfaWQnOiB1c2VyLl9pZH07XG4gICAgbGV0IHVwZGF0ZURhdGEgPSB7J21vYmlsZV9udW1iZXInOiB1c2VyLnRlbXBfbW9iaWxlLCAndGVtcF9tb2JpbGUnOiB1c2VyLm1vYmlsZV9udW1iZXJ9O1xuICAgIGlmICh1c2VyLm90cCA9PT0gZGF0YS5vdHApIHtcbiAgICAgIHRoaXMuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjayhudWxsLHtcbiAgICAgICAgICAgICdzdGF0dXMnOiAnU3VjY2VzcycsXG4gICAgICAgICAgICAnZGF0YSc6IHsnbWVzc2FnZSc6ICdVc2VyIEFjY291bnQgdmVyaWZpZWQgc3VjY2Vzc2Z1bGx5J31cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhbGxiYWNrKHtcbiAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXG4gICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XUk9OR19PVFAsXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICBjb2RlOiA0MDBcbiAgICAgIH0sIG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIGFzc2lnblByZW1pdW1QYWNrYWdlKHVzZXI6VXNlcix1c2VySWQ6c3RyaW5nLCBjb3N0OiBudW1iZXIsY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIGxldCBwcm9qZWN0aW9uID0ge3N1YnNjcmlwdGlvbjogMX07XG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kQnlJZFdpdGhQcm9qZWN0aW9uKHVzZXJJZCxwcm9qZWN0aW9uLChlcnJvcixyZXN1bHQpPT4ge1xuICAgICAgaWYoZXJyb3IpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsbnVsbCk7XG4gICAgICB9ZWxzZSB7XG4gICAgICAgIGxldCBzdWJTY3JpcHRpb25BcnJheSA9IHJlc3VsdC5zdWJzY3JpcHRpb247XG4gICAgICAgIGxldCBzdWJTY3JpcHRpb25TZXJ2aWNlID0gbmV3IFN1YnNjcmlwdGlvblNlcnZpY2UoKTtcbiAgICAgICAgc3ViU2NyaXB0aW9uU2VydmljZS5nZXRTdWJzY3JpcHRpb25QYWNrYWdlQnlOYW1lKCdQcmVtaXVtJywnQmFzZVBhY2thZ2UnLFxuICAgICAgICAgIChlcnJvcjogYW55LCBzdWJzY3JpcHRpb25QYWNrYWdlOiBBcnJheTxTdWJzY3JpcHRpb25QYWNrYWdlPikgPT4ge1xuICAgICAgICAgICAgaWYoZXJyb3IpIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsbnVsbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBsZXQgcHJlbWl1bVBhY2thZ2UgPSBzdWJzY3JpcHRpb25QYWNrYWdlWzBdO1xuICAgICAgICAgICAgICBpZihzdWJTY3JpcHRpb25BcnJheVswXS5wcm9qZWN0SWQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgc3ViU2NyaXB0aW9uQXJyYXlbMF0ubnVtT2ZCdWlsZGluZ3MgPSBwcmVtaXVtUGFja2FnZS5iYXNlUGFja2FnZS5udW1PZkJ1aWxkaW5ncztcbiAgICAgICAgICAgICAgICBzdWJTY3JpcHRpb25BcnJheVswXS5udW1PZlByb2plY3RzID0gcHJlbWl1bVBhY2thZ2UuYmFzZVBhY2thZ2UubnVtT2ZQcm9qZWN0cztcbiAgICAgICAgICAgICAgICBzdWJTY3JpcHRpb25BcnJheVswXS52YWxpZGl0eSA9IHN1YlNjcmlwdGlvbkFycmF5WzBdLnZhbGlkaXR5ICsgcHJlbWl1bVBhY2thZ2UuYmFzZVBhY2thZ2UudmFsaWRpdHk7XG4gICAgICAgICAgICAgICAgc3ViU2NyaXB0aW9uQXJyYXlbMF0ucHVyY2hhc2VkLnB1c2gocHJlbWl1bVBhY2thZ2UuYmFzZVBhY2thZ2UpO1xuICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IHN1YnNjcmlwdGlvbiA9IG5ldyBVc2VyU3Vic2NyaXB0aW9uKCk7XG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLmFjdGl2YXRpb25EYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24ubnVtT2ZCdWlsZGluZ3MgPSBwcmVtaXVtUGFja2FnZS5iYXNlUGFja2FnZS5udW1PZkJ1aWxkaW5ncztcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24ubnVtT2ZQcm9qZWN0cyA9IHByZW1pdW1QYWNrYWdlLmJhc2VQYWNrYWdlLm51bU9mUHJvamVjdHM7XG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLnZhbGlkaXR5ID0gcHJlbWl1bVBhY2thZ2UuYmFzZVBhY2thZ2UudmFsaWRpdHk7XG4gICAgICAgICAgICAgICAgcHJlbWl1bVBhY2thZ2UuYmFzZVBhY2thZ2UuY29zdCA9IGNvc3Q7XG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLnByb2plY3RJZCA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLnB1cmNoYXNlZCA9IG5ldyBBcnJheTxCYXNlU3Vic2NyaXB0aW9uUGFja2FnZT4oKTtcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24ucHVyY2hhc2VkLnB1c2gocHJlbWl1bVBhY2thZ2UuYmFzZVBhY2thZ2UpO1xuICAgICAgICAgICAgICAgIHN1YlNjcmlwdGlvbkFycmF5LnB1c2goc3Vic2NyaXB0aW9uKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBsZXQgcXVlcnkgPSB7J19pZCc6IHVzZXJJZH07XG4gICAgICAgICAgICAgIGxldCBuZXdEYXRhID0geyRzZXQ6IHsnc3Vic2NyaXB0aW9uJzogc3ViU2NyaXB0aW9uQXJyYXl9fTtcbiAgICAgICAgICAgICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBuZXdEYXRhLCB7bmV3OiB0cnVlfSwgKGVyciwgcmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTonc3VjY2Vzcyd9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldFByb2plY3RzKHVzZXI6IFVzZXIsIGNhbGxiYWNrOihlcnJvciA6IGFueSwgcmVzdWx0IDphbnkpPT52b2lkKSB7XG5cbiAgICBsZXQgcXVlcnkgPSB7X2lkOiB1c2VyLl9pZCB9O1xuICAgIGxldCBwb3B1bGF0ZSA9IHtwYXRoOiAncHJvamVjdCcsIHNlbGVjdDogWyduYW1lJywnYnVpbGRpbmdzJywnYWN0aXZlU3RhdHVzJ119O1xuICAgIHRoaXMudXNlclJlcG9zaXRvcnkuZmluZEFuZFBvcHVsYXRlKHF1ZXJ5LCBwb3B1bGF0ZSwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgYXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xuICAgICAgICBsZXQgcG9wdWxhdGVkUHJvamVjdCA9IHJlc3VsdFswXTtcbiAgICAgICAgbGV0IHByb2plY3RMaXN0ID0gcmVzdWx0WzBdLnByb2plY3Q7XG4gICAgICAgIGxldCBzdWJzY3JpcHRpb25MaXN0ID0gcmVzdWx0WzBdLnN1YnNjcmlwdGlvbjtcblxuICAgICAgICBsZXQgcHJvamVjdFN1YnNjcmlwdGlvbkFycmF5ID0gQXJyYXk8UHJvamVjdFN1YnNjcmlwdGlvbkRldGFpbHM+KCk7XG4gICAgICAgIGxldCBpc0FibGVUb0NyZWF0ZU5ld1Byb2plY3QgOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICAgICAgZm9yKGxldCBwcm9qZWN0IG9mIHByb2plY3RMaXN0KSB7XG4gICAgICAgICAgZm9yKGxldCBzdWJzY3JpcHRpb24gb2Ygc3Vic2NyaXB0aW9uTGlzdCkge1xuICAgICAgICAgICAgaWYoc3Vic2NyaXB0aW9uLnByb2plY3RJZC5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICAgaWYoc3Vic2NyaXB0aW9uLnByb2plY3RJZFswXS5lcXVhbHMocHJvamVjdC5faWQpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHByb2plY3RTdWJzY3JpcHRpb24gPSBuZXcgUHJvamVjdFN1YnNjcmlwdGlvbkRldGFpbHMoKTtcbiAgICAgICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLnByb2plY3ROYW1lID0gcHJvamVjdC5uYW1lO1xuICAgICAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24ucHJvamVjdElkID0gcHJvamVjdC5faWQ7XG4gICAgICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5hY3RpdmVTdGF0dXMgPSBwcm9qZWN0LmFjdGl2ZVN0YXR1cztcbiAgICAgICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLm51bU9mQnVpbGRpbmdzUmVtYWluaW5nID0gKHN1YnNjcmlwdGlvbi5udW1PZkJ1aWxkaW5ncyAtIHByb2plY3QuYnVpbGRpbmdzLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5udW1PZkJ1aWxkaW5nc0FsbG9jYXRlZCA9IHByb2plY3QuYnVpbGRpbmdzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLnBhY2thZ2VOYW1lID0gdGhpcy5jaGVja0N1cnJlbnRQYWNrYWdlKHN1YnNjcmlwdGlvbik7XG4gICAgICAgICAgICAgICAgLy9hY3RpdmF0aW9uIGRhdGUgZm9yIHByb2plY3Qgc3Vic2NyaXB0aW9uXG4gICAgICAgICAgICAgICAgbGV0IGFjdGl2YXRpb25fZGF0ZSA9IG5ldyBEYXRlKHN1YnNjcmlwdGlvbi5hY3RpdmF0aW9uRGF0ZSk7XG4gICAgICAgICAgICAgICAgbGV0IGV4cGlyeURhdGUgPSBuZXcgRGF0ZShzdWJzY3JpcHRpb24uYWN0aXZhdGlvbkRhdGUpO1xuICAgICAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24uZXhwaXJ5RGF0ZSA9IG5ldyBEYXRlKGV4cGlyeURhdGUuc2V0RGF0ZShhY3RpdmF0aW9uX2RhdGUuZ2V0RGF0ZSgpICsgc3Vic2NyaXB0aW9uLnZhbGlkaXR5KSk7XG5cbiAgICAgICAgICAgICAgICAvL2V4cGlyeSBkYXRlIGZvciBwcm9qZWN0IHN1YnNjcmlwdGlvblxuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50X2RhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgICAgIHZhciBuZXdFeGlwcnlEYXRlID0gbmV3IERhdGUocHJvamVjdFN1YnNjcmlwdGlvbi5leHBpcnlEYXRlKTtcbiAgICAgICAgICAgICAgICBuZXdFeGlwcnlEYXRlLnNldERhdGUocHJvamVjdFN1YnNjcmlwdGlvbi5leHBpcnlEYXRlLmdldERhdGUoKSArIDMwKTtcbiAgICAgICAgICAgICAgICBsZXQgbm9PZkRheXMgPSAgdGhpcy5kYXlzZGlmZmVyZW5jZShuZXdFeGlwcnlEYXRlLCAgY3VycmVudF9kYXRlKTtcbiAgICAgICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLm51bU9mRGF5c1RvRXhwaXJlID0gdGhpcy5kYXlzZGlmZmVyZW5jZShwcm9qZWN0U3Vic2NyaXB0aW9uLmV4cGlyeURhdGUsIGN1cnJlbnRfZGF0ZSk7XG5cbiAgICAgICAgICAgICAgICBpZihwcm9qZWN0U3Vic2NyaXB0aW9uLm51bU9mRGF5c1RvRXhwaXJlIDwgMzAgJiYgcHJvamVjdFN1YnNjcmlwdGlvbi5udW1PZkRheXNUb0V4cGlyZSA+MCkge1xuICAgICAgICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi53YXJuaW5nTWVzc2FnZSA9XG4gICAgICAgICAgICAgICAgICAgICdFeHBpcmluZyBpbiAnICsgIE1hdGgucm91bmQocHJvamVjdFN1YnNjcmlwdGlvbi5udW1PZkRheXNUb0V4cGlyZSkgKyAnIGRheXMsJyA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKHByb2plY3RTdWJzY3JpcHRpb24ubnVtT2ZEYXlzVG9FeHBpcmUgPD0gMCAmJiAgbm9PZkRheXMgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5leHBpcnlNZXNzYWdlID0gICdQcm9qZWN0IGV4cGlyZWQsJztcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZihub09mRGF5cyA8IDApIHtcbiAgICAgICAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24uYWN0aXZlU3RhdHVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbkFycmF5LnB1c2gocHJvamVjdFN1YnNjcmlwdGlvbik7XG5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlICB7XG4gICAgICAgICAgICAgIGlzQWJsZVRvQ3JlYXRlTmV3UHJvamVjdCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYocHJvamVjdExpc3QubGVuZ3RoID09PSAwICYmIHN1YnNjcmlwdGlvbkxpc3RbMF0ucHVyY2hhc2VkLmxlbmd0aCAhPT0wKSB7XG4gICAgICAgICAgaXNBYmxlVG9DcmVhdGVOZXdQcm9qZWN0ID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHtcbiAgICAgICAgICBkYXRhOiBwcm9qZWN0U3Vic2NyaXB0aW9uQXJyYXksXG4gICAgICAgICAgaXNTdWJzY3JpcHRpb25BdmFpbGFibGUgOiBpc0FibGVUb0NyZWF0ZU5ld1Byb2plY3QsXG4gICAgICAgICAgYWNjZXNzX3Rva2VuOiBhdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcilcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvL1RvIGNoZWNrIHdoaWNoIGlzIGN1cnJlbnQgcGFja2FnZSBvY2N1cGllZCBieSB1c2VyLlxuICAgY2hlY2tDdXJyZW50UGFja2FnZShzdWJzY3JpcHRpb246YW55KSB7XG4gICAgIGxldCBhY3RpdmF0aW9uX2RhdGUgPSBuZXcgRGF0ZShzdWJzY3JpcHRpb24uYWN0aXZhdGlvbkRhdGUpO1xuICAgICBsZXQgZXhwaXJ5RGF0ZSA9IG5ldyBEYXRlKHN1YnNjcmlwdGlvbi5hY3RpdmF0aW9uRGF0ZSk7XG4gICAgIGxldCBleHBpcnlEYXRlT3V0ZXIgPSBuZXcgRGF0ZShzdWJzY3JpcHRpb24uYWN0aXZhdGlvbkRhdGUpO1xuICAgICBsZXQgY3VycmVudF9kYXRlID0gbmV3IERhdGUoKTtcbiAgICAgZm9yKGxldCBwdXJjaGFzZVBhY2thZ2Ugb2Ygc3Vic2NyaXB0aW9uLnB1cmNoYXNlZCkge1xuICAgICAgIGV4cGlyeURhdGVPdXRlciA9IG5ldyBEYXRlKGV4cGlyeURhdGVPdXRlci5zZXREYXRlKGFjdGl2YXRpb25fZGF0ZS5nZXREYXRlKCkgKyBwdXJjaGFzZVBhY2thZ2UudmFsaWRpdHkpKTtcbiAgICAgICBmb3IgKGxldCBwdXJjaGFzZVBhY2thZ2Ugb2Ygc3Vic2NyaXB0aW9uLnB1cmNoYXNlZCkge1xuICAgICAgICAgLy9leHBpcnkgZGF0ZSBmb3IgZWFjaCBwYWNrYWdlLlxuICAgICAgICAgZXhwaXJ5RGF0ZSA9IG5ldyBEYXRlKGV4cGlyeURhdGUuc2V0RGF0ZShhY3RpdmF0aW9uX2RhdGUuZ2V0RGF0ZSgpICsgcHVyY2hhc2VQYWNrYWdlLnZhbGlkaXR5KSk7XG4gICAgICAgICBpZiAoKGV4cGlyeURhdGVPdXRlciA8IGV4cGlyeURhdGUpICYmIChleHBpcnlEYXRlID49Y3VycmVudF9kYXRlKSkge1xuICAgICAgICAgICByZXR1cm4gcHVyY2hhc2VQYWNrYWdlLm5hbWU7XG4gICAgICAgICAgIH1cbiAgICAgICB9XG4gICAgICAgaWYocHVyY2hhc2VQYWNrYWdlLm5hbWUgPT09J0ZyZWUnKSB7XG4gICAgICAgICByZXR1cm4gcHVyY2hhc2VQYWNrYWdlLm5hbWU9J0ZyZWUnO1xuICAgICAgIH1lbHNlIHtcbiAgICAgICAgIHJldHVybiBwdXJjaGFzZVBhY2thZ2UubmFtZT0nUHJlbWl1bSc7XG4gICAgICAgfVxuICAgICB9XG4gICAgfVxuXG4gIGRheXNkaWZmZXJlbmNlKGRhdGUxIDogRGF0ZSwgZGF0ZTIgOiBEYXRlKSB7XG4gICAgbGV0IE9ORURBWSA9IDEwMDAgKiA2MCAqIDYwICogMjQ7XG4gICAgbGV0IGRhdGUxX21zID0gZGF0ZTEuZ2V0VGltZSgpO1xuICAgIGxldCBkYXRlMl9tcyA9IGRhdGUyLmdldFRpbWUoKTtcbiAgICBsZXQgZGlmZmVyZW5jZV9tcyA9IChkYXRlMV9tcyAtIGRhdGUyX21zKTtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChkaWZmZXJlbmNlX21zL09ORURBWSk7XG4gIH1cblxuICBnZXRQcm9qZWN0U3Vic2NyaXB0aW9uKHVzZXI6IFVzZXIsIHByb2plY3RJZDogc3RyaW5nLCBjYWxsYmFjazooZXJyb3IgOiBhbnksIHJlc3VsdCA6YW55KT0+dm9pZCkge1xuXG4gICAgbGV0IHF1ZXJ5ID0gW1xuICAgICAgeyRtYXRjaDogeydfaWQnOk9iamVjdElkKHVzZXIuX2lkKX19LFxuICAgICAgeyAkcHJvamVjdCA6IHsnc3Vic2NyaXB0aW9uJzoxfX0sXG4gICAgICB7ICR1bndpbmQ6ICckc3Vic2NyaXB0aW9uJ30sXG4gICAgICB7ICRtYXRjaDogeydzdWJzY3JpcHRpb24ucHJvamVjdElkJyA6IE9iamVjdElkKHByb2plY3RJZCl9fVxuICAgIF07XG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5hZ2dyZWdhdGUocXVlcnkgLChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHF1ZXJ5ID0geyBfaWQ6IHByb2plY3RJZH07XG4gICAgICAgIGxldCBwb3B1bGF0ZSA9IHtwYXRoIDogJ2J1aWxkaW5ncyd9O1xuICAgICAgICB0aGlzLnByb2plY3RSZXBvc2l0b3J5LmZpbmRBbmRQb3B1bGF0ZShxdWVyeSwgcG9wdWxhdGUsIChlcnJvciwgcmVzcCkgPT4ge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgcHJvamVjdFN1YnNjcmlwdGlvbiA9IG5ldyBQcm9qZWN0U3Vic2NyaXB0aW9uRGV0YWlscygpO1xuICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5wcm9qZWN0TmFtZSA9IHJlc3BbMF0ubmFtZTtcbiAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24ucHJvamVjdElkID0gcmVzcFswXS5faWQ7XG4gICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLmFjdGl2ZVN0YXR1cyA9IHJlc3BbMF0uYWN0aXZlU3RhdHVzO1xuICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5udW1PZkJ1aWxkaW5nc0FsbG9jYXRlZCA9IHJlc3BbMF0uYnVpbGRpbmdzLmxlbmd0aDtcbiAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24ubnVtT2ZCdWlsZGluZ3NFeGlzdCA9IHJlc3VsdFswXS5zdWJzY3JpcHRpb24ubnVtT2ZCdWlsZGluZ3M7XG4gICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLm51bU9mQnVpbGRpbmdzUmVtYWluaW5nID0gKHJlc3VsdFswXS5zdWJzY3JpcHRpb24ubnVtT2ZCdWlsZGluZ3MgLSByZXNwWzBdLmJ1aWxkaW5ncy5sZW5ndGgpO1xuICAgICAgICAgICAgaWYocmVzdWx0WzBdLnN1YnNjcmlwdGlvbi5udW1PZkJ1aWxkaW5ncyA9PT0gMTAgJiYgcHJvamVjdFN1YnNjcmlwdGlvbi5udW1PZkJ1aWxkaW5nc1JlbWFpbmluZyA9PT0wICYmIHByb2plY3RTdWJzY3JpcHRpb24ucGFja2FnZU5hbWUgIT09ICdGcmVlJykge1xuICAgICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLmFkZEJ1aWxkaW5nRGlzYWJsZT10cnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLnBhY2thZ2VOYW1lID0gdGhpcy5jaGVja0N1cnJlbnRQYWNrYWdlKHJlc3VsdFswXS5zdWJzY3JpcHRpb24pO1xuICAgICAgICAgICAgaWYocHJvamVjdFN1YnNjcmlwdGlvbi5wYWNrYWdlTmFtZSA9PT0gJ0ZyZWUnICYmIHByb2plY3RTdWJzY3JpcHRpb24ubnVtT2ZCdWlsZGluZ3NSZW1haW5pbmcgPT09IDApIHtcbiAgICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5hZGRCdWlsZGluZ0Rpc2FibGU9dHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGFjdGl2YXRpb25fZGF0ZSA9IG5ldyBEYXRlKHJlc3VsdFswXS5zdWJzY3JpcHRpb24uYWN0aXZhdGlvbkRhdGUpO1xuICAgICAgICAgICAgbGV0IGV4cGlyeURhdGUgPSBuZXcgRGF0ZShyZXN1bHRbMF0uc3Vic2NyaXB0aW9uLmFjdGl2YXRpb25EYXRlKTtcbiAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24uZXhwaXJ5RGF0ZSA9IG5ldyBEYXRlKGV4cGlyeURhdGUuc2V0RGF0ZShhY3RpdmF0aW9uX2RhdGUuZ2V0RGF0ZSgpICsgcmVzdWx0WzBdLnN1YnNjcmlwdGlvbi52YWxpZGl0eSkpO1xuXG4gICAgICAgICAgICAvL2V4cGlyeSBkYXRlIGZvciBwcm9qZWN0IHN1YnNjcmlwdGlvblxuICAgICAgICAgICAgbGV0IGN1cnJlbnRfZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICB2YXIgbmV3RXhpcHJ5RGF0ZSA9IG5ldyBEYXRlKHByb2plY3RTdWJzY3JpcHRpb24uZXhwaXJ5RGF0ZSk7XG4gICAgICAgICAgICBuZXdFeGlwcnlEYXRlLnNldERhdGUocHJvamVjdFN1YnNjcmlwdGlvbi5leHBpcnlEYXRlLmdldERhdGUoKSArIDMwKTtcbiAgICAgICAgICAgIGxldCBub09mRGF5cyA9ICB0aGlzLmRheXNkaWZmZXJlbmNlKG5ld0V4aXByeURhdGUsICBjdXJyZW50X2RhdGUpO1xuXG4gICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLm51bU9mRGF5c1RvRXhwaXJlID0gdGhpcy5kYXlzZGlmZmVyZW5jZShwcm9qZWN0U3Vic2NyaXB0aW9uLmV4cGlyeURhdGUsIGN1cnJlbnRfZGF0ZSk7XG5cbiAgICAgICAgICAgIGlmKHByb2plY3RTdWJzY3JpcHRpb24ubnVtT2ZEYXlzVG9FeHBpcmUgPCAzMCAmJiBwcm9qZWN0U3Vic2NyaXB0aW9uLm51bU9mRGF5c1RvRXhwaXJlID4wKSB7XG4gICAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24ud2FybmluZ01lc3NhZ2UgPVxuICAgICAgICAgICAgICAgICdFeHBpcmluZyBpbiAnICsgIE1hdGgucm91bmQocHJvamVjdFN1YnNjcmlwdGlvbi5udW1PZkRheXNUb0V4cGlyZSkgKyAnIGRheXMuJyA7XG4gICAgICAgICAgICB9IGVsc2UgaWYocHJvamVjdFN1YnNjcmlwdGlvbi5udW1PZkRheXNUb0V4cGlyZSA8PSAwICYmIG5vT2ZEYXlzID49IDApIHtcbiAgICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5leHBpcnlNZXNzYWdlID0gJ1Byb2plY3QgZXhwaXJlZCwnO1xuICAgICAgICAgICAgfWVsc2UgaWYobm9PZkRheXMgPCAwKSB7XG4gICAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24uYWN0aXZlU3RhdHVzID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBwcm9qZWN0U3Vic2NyaXB0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlU3Vic2NyaXB0aW9uKHVzZXIgOiBVc2VyLCBwcm9qZWN0SWQ6IHN0cmluZywgcGFja2FnZU5hbWU6IHN0cmluZyxjb3N0Rm9yQnVpbGRpbmdQdXJjaGFzZWQ6YW55LG51bWJlck9mQnVpbGRpbmdzUHVyY2hhc2VkOmFueSwgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KT0+IHZvaWQpIHtcbiAgICBsZXQgcXVlcnkgPSBbXG4gICAgICB7JG1hdGNoOiB7J19pZCc6T2JqZWN0SWQodXNlci5faWQpfX0sXG4gICAgICB7ICRwcm9qZWN0IDogeydzdWJzY3JpcHRpb24nOjF9fSxcbiAgICAgIHsgJHVud2luZDogJyRzdWJzY3JpcHRpb24nfSxcbiAgICAgIHsgJG1hdGNoOiB7J3N1YnNjcmlwdGlvbi5wcm9qZWN0SWQnIDogT2JqZWN0SWQocHJvamVjdElkKX19XG4gICAgXTtcbiAgIHRoaXMudXNlclJlcG9zaXRvcnkuYWdncmVnYXRlKHF1ZXJ5LCAoZXJyb3IscmVzdWx0KSA9PiB7XG4gICAgIGlmIChlcnJvcikge1xuICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgfSBlbHNlIHtcbiAgICAgICBsZXQgc3Vic2NyaXB0aW9uID0gcmVzdWx0WzBdLnN1YnNjcmlwdGlvbjtcbiAgICAgICB0aGlzLnVwZGF0ZVBhY2thZ2UodXNlciwgc3Vic2NyaXB0aW9uLCBwYWNrYWdlTmFtZSxjb3N0Rm9yQnVpbGRpbmdQdXJjaGFzZWQsbnVtYmVyT2ZCdWlsZGluZ3NQdXJjaGFzZWQscHJvamVjdElkLChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgbGV0IGVycm9yID0gbmV3IEVycm9yKCk7XG4gICAgICAgICAgIGVycm9yLm1lc3NhZ2UgPSBtZXNzYWdlcy5NU0dfRVJST1JfV0hJTEVfQ09OVEFDVElORztcbiAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgaWYocGFja2FnZU5hbWUgPT09IGNvbnN0YW50cy5SRU5FV19QUk9KRUNUKSB7XG4gICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IG1lc3NhZ2VzLk1TR19TVUNDRVNTX1BST0pFQ1RfUkVORVd9KTtcbiAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogJ3N1Y2Nlc3MnfSk7XG4gICAgICAgICAgIH1cbiAgICAgICAgIH1cbiAgICAgICB9KTtcbiAgICAgfVxuICAgfSk7XG4gIH1cblxuICB1cGRhdGVQYWNrYWdlKHVzZXI6IFVzZXIsIHN1YnNjcmlwdGlvbjogYW55LCBwYWNrYWdlTmFtZTogc3RyaW5nLGNvc3RGb3JCdWlsZGluZ1B1cmNoYXNlZDphbnksbnVtYmVyT2ZCdWlsZGluZ3NQdXJjaGFzZWQ6YW55LCBwcm9qZWN0SWQ6c3RyaW5nLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xuICAgIGxldCBzdWJTY3JpcHRpb25TZXJ2aWNlID0gbmV3IFN1YnNjcmlwdGlvblNlcnZpY2UoKTtcbiAgICBzd2l0Y2ggKHBhY2thZ2VOYW1lKSB7XG4gICAgICBjYXNlICdQcmVtaXVtJzpcbiAgICAgIHtcbiAgICAgICAgc3ViU2NyaXB0aW9uU2VydmljZS5nZXRTdWJzY3JpcHRpb25QYWNrYWdlQnlOYW1lKCdQcmVtaXVtJywnQmFzZVBhY2thZ2UnLFxuICAgICAgICAgIChlcnJvcjogYW55LCBzdWJzY3JpcHRpb25QYWNrYWdlOiBBcnJheTxTdWJzY3JpcHRpb25QYWNrYWdlPikgPT4ge1xuICAgICAgICAgICAgaWYoZXJyb3IpIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsbnVsbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gc3Vic2NyaXB0aW9uUGFja2FnZVswXTtcbiAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLm51bU9mQnVpbGRpbmdzID0gcmVzdWx0LmJhc2VQYWNrYWdlLm51bU9mQnVpbGRpbmdzO1xuICAgICAgICAgICAgICBzdWJzY3JpcHRpb24ubnVtT2ZQcm9qZWN0cyA9IHJlc3VsdC5iYXNlUGFja2FnZS5udW1PZlByb2plY3RzO1xuICAgICAgICAgICAgICBsZXQgbm9PZkRheXNUb0V4cGlyeSA9IHRoaXMuY2FsY3VsYXRlVmFsaWRpdHkoc3Vic2NyaXB0aW9uKTtcbiAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLnZhbGlkaXR5ID0gbm9PZkRheXNUb0V4cGlyeSArIHJlc3VsdC5iYXNlUGFja2FnZS52YWxpZGl0eTtcbiAgICAgICAgICAgICAgcmVzdWx0LmJhc2VQYWNrYWdlLmNvc3QgPSBjb3N0Rm9yQnVpbGRpbmdQdXJjaGFzZWQ7XG4gICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi5wdXJjaGFzZWQucHVzaChyZXN1bHQuYmFzZVBhY2thZ2UpO1xuICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVN1YnNjcmlwdGlvblBhY2thZ2UodXNlci5faWQsIHByb2plY3RJZCxzdWJzY3JpcHRpb24sIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiAnc3VjY2Vzcyd9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY2FzZSAnUmVuZXdQcm9qZWN0JzpcbiAgICAgIHtcbiAgICAgICAgc3ViU2NyaXB0aW9uU2VydmljZS5nZXRTdWJzY3JpcHRpb25QYWNrYWdlQnlOYW1lKCdSZW5ld1Byb2plY3QnLCdhZGRPblBhY2thZ2UnLFxuICAgICAgICAgIChlcnJvcjogYW55LCBzdWJzY3JpcHRpb25QYWNrYWdlOiBBcnJheTxTdWJzY3JpcHRpb25QYWNrYWdlPikgPT4ge1xuICAgICAgICAgICAgaWYoZXJyb3IpIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsbnVsbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gc3Vic2NyaXB0aW9uUGFja2FnZVswXTtcbiAgICAgICAgICAgICAgbGV0IG5vT2ZEYXlzVG9FeHBpcnkgPSB0aGlzLmNhbGN1bGF0ZVZhbGlkaXR5KHN1YnNjcmlwdGlvbik7XG4gICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi52YWxpZGl0eSA9IG5vT2ZEYXlzVG9FeHBpcnkgKyByZXN1bHQuYWRkT25QYWNrYWdlLnZhbGlkaXR5O1xuICAgICAgICAgICAgICByZXN1bHQuYWRkT25QYWNrYWdlLmNvc3QgPSBjb3N0Rm9yQnVpbGRpbmdQdXJjaGFzZWQ7XG4gICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi5wdXJjaGFzZWQucHVzaChyZXN1bHQuYWRkT25QYWNrYWdlKTtcbiAgICAgICAgICAgICAgdGhpcy51cGRhdGVTdWJzY3JpcHRpb25QYWNrYWdlKHVzZXIuX2lkLHByb2plY3RJZCwgc3Vic2NyaXB0aW9uLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogJ1Byb2plY3QgUmVuZXdlZCBzdWNjZXNzZnVsbHknfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGNhc2UgJ0FkZF9idWlsZGluZyc6XG4gICAgICB7XG4gICAgICAgIHN1YlNjcmlwdGlvblNlcnZpY2UuZ2V0U3Vic2NyaXB0aW9uUGFja2FnZUJ5TmFtZSgnQWRkX2J1aWxkaW5nJywnYWRkT25QYWNrYWdlJyxcbiAgICAgICAgICAoZXJyb3I6IGFueSwgc3Vic2NyaXB0aW9uUGFja2FnZTogQXJyYXk8U3Vic2NyaXB0aW9uUGFja2FnZT4pID0+IHtcbiAgICAgICAgICAgIGlmKGVycm9yKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLG51bGwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgbGV0IHByb2plY3RCdWlsZGluZ3NMaW1pdCA9IHN1YnNjcmlwdGlvbi5udW1PZkJ1aWxkaW5ncyArIG51bWJlck9mQnVpbGRpbmdzUHVyY2hhc2VkO1xuICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gc3Vic2NyaXB0aW9uUGFja2FnZVswXTtcbiAgICAgICAgICAgICAgICByZXN1bHQuYWRkT25QYWNrYWdlLm51bU9mQnVpbGRpbmdzID0gbnVtYmVyT2ZCdWlsZGluZ3NQdXJjaGFzZWQ7XG4gICAgICAgICAgICAgICAgcmVzdWx0LmFkZE9uUGFja2FnZS5jb3N0ID0gY29zdEZvckJ1aWxkaW5nUHVyY2hhc2VkO1xuICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi5udW1PZkJ1aWxkaW5ncyA9IHN1YnNjcmlwdGlvbi5udW1PZkJ1aWxkaW5ncyArIHJlc3VsdC5hZGRPblBhY2thZ2UubnVtT2ZCdWlsZGluZ3M7XG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLnB1cmNoYXNlZC5wdXNoKHJlc3VsdC5hZGRPblBhY2thZ2UpO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU3Vic2NyaXB0aW9uUGFja2FnZSh1c2VyLl9pZCwgcHJvamVjdElkLHN1YnNjcmlwdGlvbiwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogJ3N1Y2Nlc3MnfSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlU3Vic2NyaXB0aW9uUGFja2FnZSggdXNlcklkOiBhbnksIHByb2plY3RJZDpzdHJpbmcsdXBkYXRlZFN1YnNjcmlwdGlvbjogYW55LCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xuICAgIGxldCBwcm9qZWN0aW9uID0ge3N1YnNjcmlwdGlvbjogMX07XG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kQnlJZFdpdGhQcm9qZWN0aW9uKHVzZXJJZCxwcm9qZWN0aW9uLChlcnJvcixyZXN1bHQpPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBzdWJTY3JpcHRpb25BcnJheSA9IHJlc3VsdC5zdWJzY3JpcHRpb247XG4gICAgICAgIGZvciAobGV0IHN1YnNjcmlwdGlvbkluZGV4ID0wOyBzdWJzY3JpcHRpb25JbmRleDwgc3ViU2NyaXB0aW9uQXJyYXkubGVuZ3RoOyBzdWJzY3JpcHRpb25JbmRleCsrKSB7XG4gICAgICAgICAgaWYgKHN1YlNjcmlwdGlvbkFycmF5W3N1YnNjcmlwdGlvbkluZGV4XS5wcm9qZWN0SWQubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICBpZiAoc3ViU2NyaXB0aW9uQXJyYXlbc3Vic2NyaXB0aW9uSW5kZXhdLnByb2plY3RJZFswXS5lcXVhbHMocHJvamVjdElkKSkge1xuICAgICAgICAgICAgICBzdWJTY3JpcHRpb25BcnJheVtzdWJzY3JpcHRpb25JbmRleF0gPSB1cGRhdGVkU3Vic2NyaXB0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgcXVlcnkgPSB7J19pZCc6IHVzZXJJZH07XG4gICAgICAgIGxldCBuZXdEYXRhID0geyRzZXQ6IHsnc3Vic2NyaXB0aW9uJzogc3ViU2NyaXB0aW9uQXJyYXl9fTtcbiAgICAgICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBuZXdEYXRhLCB7bmV3OiB0cnVlfSwgKGVyciwgcmVzcG9uc2UpID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTonc3VjY2Vzcyd9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgfVxuXG4gIGNhbGN1bGF0ZVZhbGlkaXR5KHN1YnNjcmlwdGlvbjogYW55KSB7XG4gICAgbGV0IGFjdGl2YXRpb25EYXRlID0gbmV3IERhdGUoc3Vic2NyaXB0aW9uLmFjdGl2YXRpb25EYXRlKTtcbiAgICBsZXQgZXhwaXJ5RGF0ZSA9IG5ldyBEYXRlKHN1YnNjcmlwdGlvbi5hY3RpdmF0aW9uRGF0ZSk7XG4gICAgbGV0IHByb2plY3RFeHBpcnlEYXRlID0gbmV3IERhdGUoZXhwaXJ5RGF0ZS5zZXREYXRlKGFjdGl2YXRpb25EYXRlLmdldERhdGUoKSArIHN1YnNjcmlwdGlvbi52YWxpZGl0eSkpO1xuICAgIGxldCBjdXJyZW50X2RhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIGxldCBkYXlzID0gdGhpcy5kYXlzZGlmZmVyZW5jZShwcm9qZWN0RXhwaXJ5RGF0ZSxjdXJyZW50X2RhdGUpO1xuICAgIHJldHVybiBkYXlzO1xuICB9XG5cbiAgc2VuZFByb2plY3RFeHBpcnlXYXJuaW5nTWFpbHMoY2FsbGJhY2s6KGVycm9yIDogYW55LCByZXN1bHQgOmFueSk9PnZvaWQpIHtcbiAgICBsb2dnZXIuZGVidWcoJ3NlbmRQcm9qZWN0RXhwaXJ5V2FybmluZ01haWxzIGlzIGJlZW4gaGl0Jyk7XG4gICAgbGV0IHF1ZXJ5ID0gW1xuICAgICAgeyAkcHJvamVjdCA6IHsgJ3N1YnNjcmlwdGlvbicgOiAxLCAnZmlyc3RfbmFtZScgOiAxLCAnZW1haWwnIDogMSB9fSxcbiAgICAgIHsgJHVud2luZCA6ICckc3Vic2NyaXB0aW9uJyB9LFxuICAgICAgeyAkdW53aW5kIDogJyRzdWJzY3JpcHRpb24ucHJvamVjdElkJyB9XG4gICAgXTtcblxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkuYWdncmVnYXRlKHF1ZXJ5LCAoZXJyb3IsIHJlc3BvbnNlKSA9PiB7XG4gICAgICBpZihlcnJvcikge1xuICAgICAgICBsb2dnZXIuZXJyb3IoJ3NlbmRQcm9qZWN0RXhwaXJ5V2FybmluZ01haWxzIGVycm9yIDogJytKU09OLnN0cmluZ2lmeShlcnJvcikpO1xuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2dnZXIuZGVidWcoJ3NlbmRQcm9qZWN0RXhwaXJ5V2FybmluZ01haWxzIHN1Y2VzcycpO1xuICAgICAgICBsZXQgdXNlckxpc3QgPSBuZXcgQXJyYXk8UHJvamVjdFN1YmNyaXB0aW9uPigpO1xuICAgICAgICBsZXQgdXNlclN1YnNjcmlwdGlvblByb21pc2VBcnJheSA9W107XG5cbiAgICAgICAgZm9yKGxldCB1c2VyIG9mIHJlc3BvbnNlKSB7XG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCdnZXRpbmcgYWxsIHVzZXIgZGF0YSBmb3Igc2VuZGluZyBtYWlsIHRvIHVzZXJzLicpO1xuICAgICAgICAgIGxldCB2YWxpZGl0eURheXMgPSB0aGlzLmNhbGN1bGF0ZVZhbGlkaXR5KHVzZXIuc3Vic2NyaXB0aW9uKTtcbiAgICAgICAgICBsZXQgdmFsZGl0eURheXNWYWxpZGF0aW9uID0gY29uZmlnLmdldCgnY3JvbkpvYk1haWxOb3RpZmljYXRpb25WYWxpZGl0eURheXMnKTtcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ3ZhbGlkaXR5RGF5cyA6ICcrdmFsaWRpdHlEYXlzKTtcbiAgICAgICAgICBpZih2YWxkaXR5RGF5c1ZhbGlkYXRpb24uaW5kZXhPZih2YWxpZGl0eURheXMpICE9PSAtMSkge1xuICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKCdjYWxsaW5nIHByb21pc2UnKTtcbiAgICAgICAgICAgIGxldCBwcm9taXNlT2JqZWN0ID0gdGhpcy5nZXRQcm9qZWN0RGF0YUJ5SWQodXNlcik7XG4gICAgICAgICAgICB1c2VyU3Vic2NyaXB0aW9uUHJvbWlzZUFycmF5LnB1c2gocHJvbWlzZU9iamVjdCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnaW52YWxpZCB2YWxpZGl0eURheXMgOiAnK3ZhbGlkaXR5RGF5cyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYodXNlclN1YnNjcmlwdGlvblByb21pc2VBcnJheS5sZW5ndGggIT09IDApIHtcblxuICAgICAgICAgIENDUHJvbWlzZS5hbGwodXNlclN1YnNjcmlwdGlvblByb21pc2VBcnJheSkudGhlbihmdW5jdGlvbihkYXRhOiBBcnJheTxhbnk+KSB7XG5cbiAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnZGF0YSByZWNpZXZlZCBmb3IgYWxsIHVzZXJzOiAnK0pTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgICAgIGxldCBzZW5kTWFpbFByb21pc2VBcnJheSA9IFtdO1xuXG4gICAgICAgICAgICBmb3IobGV0IHVzZXIgb2YgZGF0YSkge1xuICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoJ0NhbGxpbmcgc2VuZE1haWxGb3JQcm9qZWN0RXhwaXJ5VG9Vc2VyIGZvciB1c2VyIDogJytKU09OLnN0cmluZ2lmeSh1c2VyLmZpcnN0X25hbWUpKTtcbiAgICAgICAgICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XG4gICAgICAgICAgICAgIGxldCBzZW5kTWFpbFByb21pc2UgPSB1c2VyU2VydmljZS5zZW5kTWFpbEZvclByb2plY3RFeHBpcnlUb1VzZXIodXNlcik7XG4gICAgICAgICAgICAgIHNlbmRNYWlsUHJvbWlzZUFycmF5LnB1c2goc2VuZE1haWxQcm9taXNlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgQ0NQcm9taXNlLmFsbChzZW5kTWFpbFByb21pc2VBcnJheSkudGhlbihmdW5jdGlvbihtYWlsU2VudERhdGE6IEFycmF5PGFueT4pIHtcbiAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKCdtYWlsU2VudERhdGEgZm9yIGFsbCB1c2VyczogJytKU09OLnN0cmluZ2lmeShtYWlsU2VudERhdGEpKTtcbiAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgeyAnZGF0YScgOiAnTWFpbCBzZW50IHN1Y2Nlc3NmdWxseSB0byB1c2Vycy4nIH0pO1xuICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZTphbnkpIHtcbiAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdQcm9taXNlIGZhaWxlZCBmb3IgZ2V0dGluZyBtYWlsU2VudERhdGEgISA6JyArSlNPTi5zdHJpbmdpZnkoZS5tZXNzYWdlKSk7XG4gICAgICAgICAgICAgIENDUHJvbWlzZS5yZWplY3QoZS5tZXNzYWdlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZTphbnkpIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcignUHJvbWlzZSBmYWlsZWQgZm9yIHNlbmQgbWFpbCBub3RpZmljYXRpb24gISA6JyArSlNPTi5zdHJpbmdpZnkoZS5tZXNzYWdlKSk7XG4gICAgICAgICAgICBDQ1Byb21pc2UucmVqZWN0KGUubWVzc2FnZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ05vIGFueSBwcm9qZWN0IGlzIGV4cGlyZWQuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldFByb2plY3REYXRhQnlJZCh1c2VyOiBhbnkpIHtcblxuICAgIHJldHVybiBuZXcgQ0NQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlOiBhbnksIHJlamVjdDogYW55KSB7XG5cbiAgICAgIGxvZ2dlci5kZWJ1ZygnZ2V0aW5nIGFsbCB1c2VyIGRhdGEgZm9yIHNlbmRpbmcgbWFpbCB0byB1c2Vycy4nKTtcblxuICAgICAgbGV0IHByb2plY3RTdWJzY3JpcHRpb24gPSBuZXcgUHJvamVjdFN1YmNyaXB0aW9uKCk7XG4gICAgICBsZXQgcHJvamVjdGlvbiA9IHsgJ25hbWUnIDogMSB9O1xuICAgICAgbGV0IHByb2plY3RSZXBvc2l0b3J5ID0gbmV3IFByb2plY3RSZXBvc2l0b3J5KCk7XG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcblxuICAgICAgcHJvamVjdFJlcG9zaXRvcnkuZmluZEJ5SWRXaXRoUHJvamVjdGlvbih1c2VyLnN1YnNjcmlwdGlvbi5wcm9qZWN0SWQsIHByb2plY3Rpb24sIChlcnJvciAsIHJlc3ApID0+IHtcbiAgICAgICAgaWYoZXJyb3IpIHtcbiAgICAgICAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIGluIGZldGNoaW5nIFVzZXIgZGF0YScrSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcbiAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnZ290IFByb2plY3RTdWJzY3JpcHRpb24gZm9yIHVzZXIgJysgdXNlci5faWQpO1xuICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24udXNlcklkID0gdXNlci5faWQ7XG4gICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi51c2VyRW1haWwgPSB1c2VyLmVtYWlsO1xuICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24uZmlyc3RfbmFtZSA9IHVzZXIuZmlyc3RfbmFtZTtcbiAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLnZhbGlkaXR5RGF5cyA9IHVzZXIuc3Vic2NyaXB0aW9uLnZhbGlkaXR5O1xuICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24ucHJvamVjdEV4cGlyeURhdGUgPSB1c2VyU2VydmljZS5jYWxjdWxhdGVFeHBpcnlEYXRlKHVzZXIuc3Vic2NyaXB0aW9uKTtcbiAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLnByb2plY3ROYW1lID0gcmVzcC5uYW1lO1xuICAgICAgICAgIHJlc29sdmUocHJvamVjdFN1YnNjcmlwdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24gKGU6IGFueSkge1xuICAgICAgbG9nZ2VyLmVycm9yKCdQcm9taXNlIGZhaWxlZCBmb3IgaW5kaXZpZHVhbCBjcmVhdGVQcm9taXNlRm9yR2V0UHJvamVjdEJ5SWQgISBFcnJvcjogJyArIEpTT04uc3RyaW5naWZ5KGUubWVzc2FnZSkpO1xuICAgICAgQ0NQcm9taXNlLnJlamVjdChlLm1lc3NhZ2UpO1xuICAgIH0pO1xuICB9XG5cbiAgc2VuZE1haWxGb3JQcm9qZWN0RXhwaXJ5VG9Vc2VyKHVzZXI6IGFueSkge1xuXG4gICAgcmV0dXJuIG5ldyBDQ1Byb21pc2UoZnVuY3Rpb24gKHJlc29sdmU6IGFueSwgcmVqZWN0OiBhbnkpIHtcblxuICAgICAgbGV0IG1haWxTZXJ2aWNlID0gbmV3IFNlbmRNYWlsU2VydmljZSgpO1xuXG4gICAgICBsZXQgYXV0aCA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcbiAgICAgIGxldCB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQodXNlcik7XG4gICAgICBsZXQgaG9zdCA9IGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpO1xuICAgICAgbGV0IGh0bWxUZW1wbGF0ZSA9ICdwcm9qZWN0LWV4cGlyeS1ub3RpZmljYXRpb24tbWFpbC5odG1sJztcblxuICAgICAgbGV0IGRhdGE6TWFwPHN0cmluZyxzdHJpbmc+PSBuZXcgTWFwKFtcbiAgICAgICAgWyckYXBwbGljYXRpb25MaW5rJCcsY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5ob3N0JyldLCBbJyRmaXJzdF9uYW1lJCcsdXNlci5maXJzdF9uYW1lXSxcbiAgICAgICAgWyckZXhwaXJ5X2RhdGUkJyx1c2VyLnByb2plY3RFeHBpcnlEYXRlXSwgWyckc3Vic2NyaXB0aW9uX2xpbmskJyxjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLmhvc3QnKV0sXG4gICAgICAgIFsnJGFwcF9uYW1lJCcsJ0J1aWxkSW5mbyAtIENvc3QgQ29udHJvbCddXSk7XG5cbiAgICAgIGxldCBhdHRhY2htZW50ID0gTWFpbEF0dGFjaG1lbnRzLkF0dGFjaG1lbnRBcnJheTtcbiAgICAgIG1haWxTZXJ2aWNlLnNlbmQoIHVzZXIudXNlckVtYWlsLCBNZXNzYWdlcy5QUk9KRUNUX0VYUElSWV9XQVJOSU5HLCBodG1sVGVtcGxhdGUsIGRhdGEsYXR0YWNobWVudCxcbiAgICAgICAgKGVycjogYW55LCByZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgICAgIGlmKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBzZW5kIG1haWwgdG8gdXNlciA6ICcrdXNlci51c2VyRW1haWwpO1xuICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdNYWlsIHNlbnQgc3VjY2Vzc2Z1bGx5IHRvIHVzZXIgOiAnK3VzZXIudXNlckVtYWlsKTtcbiAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24gKGU6IGFueSkge1xuICAgICAgbG9nZ2VyLmVycm9yKCdQcm9taXNlIGZhaWxlZCBmb3IgaW5kaXZpZHVhbCBzZW5kTWFpbEZvclByb2plY3RFeHBpcnlUb1VzZXIgISBFcnJvcjogJyArIEpTT04uc3RyaW5naWZ5KGUubWVzc2FnZSkpO1xuICAgICAgQ0NQcm9taXNlLnJlamVjdChlLm1lc3NhZ2UpO1xuICAgIH0pO1xuICB9XG5cbiAgY2FsY3VsYXRlRXhwaXJ5RGF0ZShzdWJzY3JpcHRpb24gOiBhbnkpIHtcbiAgICBsZXQgYWN0aXZhdGlvbkRhdGUgPSBuZXcgRGF0ZShzdWJzY3JpcHRpb24uYWN0aXZhdGlvbkRhdGUpO1xuICAgIGxldCBleHBpcnlEYXRlID0gbmV3IERhdGUoc3Vic2NyaXB0aW9uLmFjdGl2YXRpb25EYXRlKTtcbiAgICBsZXQgcHJvamVjdEV4cGlyeURhdGUgPSBuZXcgRGF0ZShleHBpcnlEYXRlLnNldERhdGUoYWN0aXZhdGlvbkRhdGUuZ2V0RGF0ZSgpICsgc3Vic2NyaXB0aW9uLnZhbGlkaXR5KSk7XG4gICAgcmV0dXJuIHByb2plY3RFeHBpcnlEYXRlO1xuICB9XG59XG5cbk9iamVjdC5zZWFsKFVzZXJTZXJ2aWNlKTtcbmV4cG9ydCA9IFVzZXJTZXJ2aWNlO1xuIl19
