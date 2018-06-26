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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvVXNlclNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHdFQUEyRTtBQUMzRSxrREFBcUQ7QUFDckQsMERBQTZEO0FBQzdELHVCQUF5QjtBQUN6QixtQ0FBcUM7QUFDckMsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7QUFFdkMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQiw2Q0FBZ0Q7QUFDaEQsOEVBQWlGO0FBQ2pGLHFEQUF3RDtBQUN4RCx1REFBMEQ7QUFFMUQsK0JBQWtDO0FBQ2xDLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzlDLHVFQUFvRTtBQUdwRSwyRkFBOEY7QUFHOUYsa0hBQXFIO0FBQ3JILG9HQUF1RztBQUN2RyxzSUFBeUk7QUFDekksbUVBQXVFO0FBQ3ZFLHFFQUF5RTtBQUN6RSx5R0FBNEc7QUFDNUcsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDdEQsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUM7QUFFOUM7SUFRRTtRQUpBLDhCQUF5QixHQUFTLEtBQUssQ0FBQztRQUt0QyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksaUJBQWlCLEVBQUUsQ0FBQztRQUNqRCxJQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUM7SUFD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Q0FBQztRQUN2RyxNQUFNLENBQUMsaUJBQWlCLENBQUM7SUFDM0IsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0ExcENBLEFBMHBDQyxJQUFBO0FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUN6QixpQkFBUyxXQUFXLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9zZXJ2aWNlcy9Vc2VyU2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBVc2VyUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9Vc2VyUmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgU2VuZE1haWxTZXJ2aWNlID0gcmVxdWlyZSgnLi9tYWlsZXIuc2VydmljZScpO1xyXG5pbXBvcnQgU2VuZE1lc3NhZ2VTZXJ2aWNlID0gcmVxdWlyZSgnLi9zZW5kbWVzc2FnZS5zZXJ2aWNlJyk7XHJcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcclxuaW1wb3J0ICogYXMgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5sZXQgT2JqZWN0SWQgPSBtb25nb29zZS5UeXBlcy5PYmplY3RJZDtcclxuaW1wb3J0IHsgU2VudE1lc3NhZ2VJbmZvIH0gZnJvbSAnbm9kZW1haWxlcic7XHJcbmxldCBjb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcclxubGV0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XHJcbmltcG9ydCBNZXNzYWdlcyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9tZXNzYWdlcycpO1xyXG5pbXBvcnQgQXV0aEludGVyY2VwdG9yID0gcmVxdWlyZSgnLi4vLi4vZnJhbWV3b3JrL2ludGVyY2VwdG9yL2F1dGguaW50ZXJjZXB0b3InKTtcclxuaW1wb3J0IFByb2plY3RBc3NldCA9IHJlcXVpcmUoJy4uL3NoYXJlZC9wcm9qZWN0YXNzZXQnKTtcclxuaW1wb3J0IE1haWxBdHRhY2htZW50cyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9zaGFyZWRhcnJheScpO1xyXG5pbXBvcnQgeyBhc0VsZW1lbnREYXRhIH0gZnJvbSAnQGFuZ3VsYXIvY29yZS9zcmMvdmlldyc7XHJcbmltcG9ydCBiY3J5cHQgPSByZXF1aXJlKCdiY3J5cHQnKTtcclxubGV0IGxvZzRqcyA9IHJlcXVpcmUoJ2xvZzRqcycpO1xyXG5sZXQgbG9nZ2VyID0gbG9nNGpzLmdldExvZ2dlcignVXNlciBzZXJ2aWNlJyk7XHJcbmltcG9ydCB7IE1haWxDaGltcE1haWxlclNlcnZpY2UgfSBmcm9tICcuL21haWxjaGltcC1tYWlsZXIuc2VydmljZSc7XHJcbmltcG9ydCBVc2VyTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL1VzZXJNb2RlbCcpO1xyXG5pbXBvcnQgVXNlciA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9uZ29vc2UvdXNlcicpO1xyXG5pbXBvcnQgU3Vic2NyaXB0aW9uU2VydmljZSA9IHJlcXVpcmUoJy4uLy4uL2FwcGxpY2F0aW9uUHJvamVjdC9zZXJ2aWNlcy9TdWJzY3JpcHRpb25TZXJ2aWNlJyk7XHJcbmltcG9ydCBTdWJzY3JpcHRpb25QYWNrYWdlID0gcmVxdWlyZSgnLi4vLi4vYXBwbGljYXRpb25Qcm9qZWN0L2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9TdWJzY3JpcHRpb24vU3Vic2NyaXB0aW9uUGFja2FnZScpO1xyXG5pbXBvcnQgQmFzZVN1YnNjcmlwdGlvblBhY2thZ2UgPSByZXF1aXJlKCcuLi8uLi9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L1N1YnNjcmlwdGlvbi9CYXNlU3Vic2NyaXB0aW9uUGFja2FnZScpO1xyXG5pbXBvcnQgVXNlclN1YnNjcmlwdGlvbiA9IHJlcXVpcmUoJy4uLy4uL2FwcGxpY2F0aW9uUHJvamVjdC9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvU3Vic2NyaXB0aW9uL1VzZXJTdWJzY3JpcHRpb24nKTtcclxuaW1wb3J0IFByb2plY3RSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vLi4vYXBwbGljYXRpb25Qcm9qZWN0L2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9Qcm9qZWN0UmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgUHJvamVjdFN1YnNjcmlwdGlvbkRldGFpbHMgPSByZXF1aXJlKCcuLi8uLi9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L1N1YnNjcmlwdGlvbi9Qcm9qZWN0U3Vic2NyaXB0aW9uRGV0YWlscycpO1xyXG5pbXBvcnQgbWVzc2FnZXMgID0gcmVxdWlyZSgnLi4vLi4vYXBwbGljYXRpb25Qcm9qZWN0L3NoYXJlZC9tZXNzYWdlcycpO1xyXG5pbXBvcnQgY29uc3RhbnRzICA9IHJlcXVpcmUoJy4uLy4uL2FwcGxpY2F0aW9uUHJvamVjdC9zaGFyZWQvY29uc3RhbnRzJyk7XHJcbmltcG9ydCBQcm9qZWN0U3ViY3JpcHRpb24gPSByZXF1aXJlKCcuLi8uLi9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9tb2RlbC9jb21wYW55L1Byb2plY3RTdWJjcmlwdGlvbicpO1xyXG5sZXQgQ0NQcm9taXNlID0gcmVxdWlyZSgncHJvbWlzZS9saWIvZXM2LWV4dGVuc2lvbnMnKTtcclxubGV0IGxvZzRqcyA9IHJlcXVpcmUoJ2xvZzRqcycpO1xyXG5sZXQgbG9nZ2VyID0gbG9nNGpzLmdldExvZ2dlcignVXNlciBzZXJ2aWNlJyk7XHJcblxyXG5jbGFzcyBVc2VyU2VydmljZSB7XHJcbiAgQVBQX05BTUU6IHN0cmluZztcclxuICBjb21wYW55X25hbWU6IHN0cmluZztcclxuICBtaWRfY29udGVudDogYW55O1xyXG4gIGlzQWN0aXZlQWRkQnVpbGRpbmdCdXR0b246Ym9vbGVhbj1mYWxzZTtcclxuICBwcml2YXRlIHVzZXJSZXBvc2l0b3J5OiBVc2VyUmVwb3NpdG9yeTtcclxuICBwcml2YXRlIHByb2plY3RSZXBvc2l0b3J5IDogUHJvamVjdFJlcG9zaXRvcnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeSA9IG5ldyBVc2VyUmVwb3NpdG9yeSgpO1xyXG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeSA9IG5ldyBQcm9qZWN0UmVwb3NpdG9yeSgpO1xyXG4gICAgdGhpcy5BUFBfTkFNRSA9IFByb2plY3RBc3NldC5BUFBfTkFNRTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZVVzZXIoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnJldHJpZXZlKHsnZW1haWwnOiBpdGVtLmVtYWlsfSwgKGVyciwgcmVzKSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoZXJyKSwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSBpZiAocmVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBsb2dnZXIuZGVidWcoJ0VtYWlsIGFscmVhZHkgZXhpc3QnK0pTT04uc3RyaW5naWZ5KHJlcykpO1xyXG5cclxuICAgICAgICBpZiAocmVzWzBdLmlzQWN0aXZhdGVkID09PSB0cnVlKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTiksIG51bGwpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAocmVzWzBdLmlzQWN0aXZhdGVkID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQUNDT1VOVCksIG51bGwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbG9nZ2VyLmRlYnVnKCdFbWFpbCBub3QgcHJlc2VudC4nK0pTT04uc3RyaW5naWZ5KHJlcykpO1xyXG4gICAgICAgIGNvbnN0IHNhbHRSb3VuZHMgPSAxMDtcclxuICAgICAgICBiY3J5cHQuaGFzaChpdGVtLnBhc3N3b3JkLCBzYWx0Um91bmRzLCAoZXJyOiBhbnksIGhhc2g6IGFueSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIGluIGNyZWF0aW5nIGhhc2ggcGFzc3dvcmQnKTtcclxuICAgICAgICAgICAgY2FsbGJhY2soe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogJ0Vycm9yIGluIGNyZWF0aW5nIGhhc2ggdXNpbmcgYmNyeXB0JyxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiAnRXJyb3IgaW4gY3JlYXRpbmcgaGFzaCB1c2luZyBiY3J5cHQnLFxyXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgICB9LCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnY3JlYXRlZCBoYXNoIHN1Y2Nlc2Z1bGx5LicpO1xyXG4gICAgICAgICAgICBpdGVtLnBhc3N3b3JkID0gaGFzaDtcclxuICAgICAgICAgICAgbGV0IHN1YlNjcmlwdGlvblNlcnZpY2UgPSBuZXcgU3Vic2NyaXB0aW9uU2VydmljZSgpO1xyXG4gICAgICAgICAgICBzdWJTY3JpcHRpb25TZXJ2aWNlLmdldFN1YnNjcmlwdGlvblBhY2thZ2VCeU5hbWUoJ0ZyZWUnLCdCYXNlUGFja2FnZScsIChlcnI6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyZWVTdWJzY3JpcHRpb246IEFycmF5PFN1YnNjcmlwdGlvblBhY2thZ2U+KSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKGZyZWVTdWJzY3JpcHRpb24ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKCdmcmVlU3Vic2NyaXB0aW9uIGxlbmd0aCAgPiAwJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFzc2lnbkZyZWVTdWJzY3JpcHRpb25BbmRDcmVhdGVVc2VyKGl0ZW0sIGZyZWVTdWJzY3JpcHRpb25bMF0sIGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoJ2ZyZWVTdWJzY3JpcHRpb24gbGVuZ3RoICE9PTAnKTtcclxuICAgICAgICAgICAgICAgIHN1YlNjcmlwdGlvblNlcnZpY2UuYWRkU3Vic2NyaXB0aW9uUGFja2FnZShjb25maWcuZ2V0KCdzdWJzY3JpcHRpb24ucGFja2FnZS5GcmVlJyksXHJcbiAgICAgICAgICAgICAgICAgIChlcnI6IGFueSwgZnJlZVN1YnNjcmlwdGlvbik9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKCdhc3NpZ25pbmcgZnJlZSBzdWJzY3JpcHRpb24gYnkgY3JlYXRpbmcgbmV3IHVzZXInKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFzc2lnbkZyZWVTdWJzY3JpcHRpb25BbmRDcmVhdGVVc2VyKGl0ZW0sIGZyZWVTdWJzY3JpcHRpb24sIGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY2hlY2tGb3JWYWxpZFN1YnNjcmlwdGlvbih1c2VyaWQgOiBzdHJpbmcsIGNhbGxiYWNrIDogKGVycm9yIDogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG5cclxuICAgIGxldCBxdWVyeSA9IFtcclxuICAgICAgeyAkbWF0Y2g6IHsnX2lkJzp1c2VyaWR9fSxcclxuICAgICAgeyAkcHJvamVjdCA6IHsnc3Vic2NyaXB0aW9uJzoxfX0sXHJcbiAgICAgIHsgJHVud2luZDogJyRzdWJzY3JpcHRpb24nfVxyXG4gICAgXTtcclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkuYWdncmVnYXRlKHF1ZXJ5ICwoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IHZhbGlkU3Vic2NyaXB0aW9uUGFja2FnZTtcclxuICAgICAgICBpZihyZXN1bHQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgZm9yKGxldCBzdWJzY3JpcHRpb25QYWNrYWdlIG9mIHJlc3VsdCkge1xyXG4gICAgICAgICAgICBpZihzdWJzY3JpcHRpb25QYWNrYWdlLnN1YnNjcmlwdGlvbi5wcm9qZWN0SWQubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgdmFsaWRTdWJzY3JpcHRpb25QYWNrYWdlID0gc3Vic2NyaXB0aW9uUGFja2FnZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYWxsYmFjayhudWxsLCB2YWxpZFN1YnNjcmlwdGlvblBhY2thZ2UpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gICBhc3NpZ25GcmVlU3Vic2NyaXB0aW9uQW5kQ3JlYXRlVXNlcihpdGVtOiBhbnksIGZyZWVTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvblBhY2thZ2UsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCB1c2VyOiBVc2VyTW9kZWwgPSBpdGVtO1xyXG4gICAgbGV0IHNlbmRNYWlsU2VydmljZSA9IG5ldyBTZW5kTWFpbFNlcnZpY2UoKTtcclxuICAgIHRoaXMuYXNzaWduRnJlZVN1YnNjcmlwdGlvblBhY2thZ2UodXNlciwgZnJlZVN1YnNjcmlwdGlvbik7XHJcbiAgICBsb2dnZXIuZGVidWcoJ0NyZWF0aW5nIHVzZXIgd2l0aCBuZXcgZnJlZSB0cmFpbCBzdWJzY3JpcHRpb24gcGFja2FnZScpO1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5jcmVhdGUodXNlciwgKGVycjpFcnJvciwgcmVzOmFueSkgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgbG9nZ2VyLmVycm9yKCdGYWlsZWQgdG8gQ3JlYXRpbmcgdXNlciBzdWJzY3JpcHRpb24gcGFja2FnZScpO1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfUkVHSVNUUkFUSU9OX01PQklMRV9OVU1CRVIpLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsb2dnZXIuZGVidWcoJ2NyZWF0ZWQgdXNlciBzdWNjZXNmdWxseS4nK0pTT04uc3RyaW5naWZ5KHJlcykpO1xyXG4gICAgICAgIGxldCBhdXRoID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgICAgIGxldCB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQocmVzKTtcclxuICAgICAgICBsZXQgaG9zdCA9IGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpO1xyXG4gICAgICAgIGxldCBsaW5rID0gaG9zdCArICdzaWduaW4/YWNjZXNzX3Rva2VuPScgKyB0b2tlbiArICcmX2lkPScgKyByZXMuX2lkO1xyXG4gICAgICAgIGxldCBodG1sVGVtcGxhdGUgPSAnd2VsY29tZS1hYm9hcmQuaHRtbCc7XHJcbiAgICAgICAgbGV0IGRhdGE6TWFwPHN0cmluZyxzdHJpbmc+PSBuZXcgTWFwKFtbJyRhcHBsaWNhdGlvbkxpbmskJyxjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLmhvc3QnKV0sXHJcbiAgICAgICAgICBbJyRmaXJzdF9uYW1lJCcscmVzLmZpcnN0X25hbWVdLFsnJGxpbmskJyxsaW5rXSxbJyRhcHBfbmFtZSQnLHRoaXMuQVBQX05BTUVdXSk7XHJcbiAgICAgICAgbGV0IGF0dGFjaG1lbnQgPSBNYWlsQXR0YWNobWVudHMuV2VsY29tZUFib2FyZEF0dGFjaG1lbnRBcnJheTtcclxuICAgICAgICBsb2dnZXIuZGVidWcoJ3NlbmRpbmcgbWFpbCB0byBuZXcgdXNlci4nK0pTT04uc3RyaW5naWZ5KGF0dGFjaG1lbnQpKTtcclxuICAgICAgICBzZW5kTWFpbFNlcnZpY2Uuc2VuZCggdXNlci5lbWFpbCwgTWVzc2FnZXMuRU1BSUxfU1VCSkVDVF9DQU5ESURBVEVfUkVHSVNUUkFUSU9OLCBodG1sVGVtcGxhdGUsIGRhdGEsYXR0YWNobWVudCxcclxuICAgICAgICAgIChlcnI6IGFueSwgcmVzdWx0OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyLCByZXN1bHQpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRVc2VyRm9yQ2hlY2tpbmdCdWlsZGluZyh1c2VySWQ6c3RyaW5nLHByb2plY3RJZDpzdHJpbmcsdXNlcjpVc2VyLGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCBxdWVyeT0gW1xyXG4gICAgICB7ICRtYXRjaDogeydfaWQnOnVzZXJJZH19LFxyXG4gICAgICB7ICRwcm9qZWN0IDogeydzdWJzY3JpcHRpb24nOjF9fSxcclxuICAgICAgeyAkdW53aW5kOiAnJHN1YnNjcmlwdGlvbid9LFxyXG4gICAgICB7ICRtYXRjaDogeydzdWJzY3JpcHRpb24ucHJvamVjdElkJzpwcm9qZWN0SWR9fVxyXG4gICAgXTtcclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkuYWdncmVnYXRlKHF1ZXJ5LChlcnJvcixyZXN1bHQpPT4ge1xyXG4gICAgICBpZihlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLG51bGwpO1xyXG4gICAgICB9ZWxzZSB7XHJcbiAgICAgICAgaWYocmVzdWx0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIGZvcihsZXQgc3Vic2NyaXB0aW9uUGFja2FnZSBvZiByZXN1bHQpIHtcclxuICAgICAgICAgICAgICBpZihzdWJzY3JpcHRpb25QYWNrYWdlICYmIHN1YnNjcmlwdGlvblBhY2thZ2Uuc3Vic2NyaXB0aW9uLnByb2plY3RJZCE9PW51bGwpIHtcclxuICAgICAgICAgICAgICAgIGxldCBxdWVyeSA9IHtfaWQ6IHByb2plY3RJZH07XHJcbiAgICAgICAgICAgICAgICBsZXQgcG9wdWxhdGUgPSB7cGF0aDogJ2J1aWxkaW5nJywgc2VsZWN0OiBbJ25hbWUnLCAnYnVpbGRpbmdzJyxdfTtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZEFuZFBvcHVsYXRlKHF1ZXJ5LCBwb3B1bGF0ZSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBub09mQnVpbGRpbmdzPXJlc3VsdC5idWlsZGluZ3MubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHN1YnNjcmlwdGlvblBhY2thZ2UgJiYgbm9PZkJ1aWxkaW5ncyA8PSBzdWJzY3JpcHRpb25QYWNrYWdlLnN1YnNjcmlwdGlvbi5udW1PZkJ1aWxkaW5ncykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0FjdGl2ZUFkZEJ1aWxkaW5nQnV0dG9uPWZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNBY3RpdmVBZGRCdWlsZGluZ0J1dHRvbj10cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwscmVzdWx0KTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgY2FsbGJhY2sobnVsbCx7ZGF0YTp0aGlzLmlzQWN0aXZlQWRkQnVpbGRpbmdCdXR0b259KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIGFzc2lnbkZyZWVTdWJzY3JpcHRpb25QYWNrYWdlKHVzZXI6IFVzZXJNb2RlbCwgZnJlZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uUGFja2FnZSkge1xyXG4gICAgbGV0IHN1YnNjcmlwdGlvbiA9IG5ldyBVc2VyU3Vic2NyaXB0aW9uKCk7XHJcbiAgICBzdWJzY3JpcHRpb24uYWN0aXZhdGlvbkRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgc3Vic2NyaXB0aW9uLm51bU9mQnVpbGRpbmdzID0gZnJlZVN1YnNjcmlwdGlvbi5iYXNlUGFja2FnZS5udW1PZkJ1aWxkaW5ncztcclxuICAgIHN1YnNjcmlwdGlvbi5udW1PZlByb2plY3RzID0gZnJlZVN1YnNjcmlwdGlvbi5iYXNlUGFja2FnZS5udW1PZlByb2plY3RzO1xyXG4gICAgc3Vic2NyaXB0aW9uLnZhbGlkaXR5ID0gZnJlZVN1YnNjcmlwdGlvbi5iYXNlUGFja2FnZS52YWxpZGl0eTtcclxuICAgIHN1YnNjcmlwdGlvbi5wcm9qZWN0SWQgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG4gICAgc3Vic2NyaXB0aW9uLnB1cmNoYXNlZCA9IG5ldyBBcnJheTxCYXNlU3Vic2NyaXB0aW9uUGFja2FnZT4oKTtcclxuICAgIHN1YnNjcmlwdGlvbi5wdXJjaGFzZWQucHVzaChmcmVlU3Vic2NyaXB0aW9uLmJhc2VQYWNrYWdlKTtcclxuICAgIHVzZXIuc3Vic2NyaXB0aW9uID0gbmV3IEFycmF5PFVzZXJTdWJzY3JpcHRpb24+KCk7XHJcbiAgICB1c2VyLnN1YnNjcmlwdGlvbi5wdXNoKHN1YnNjcmlwdGlvbik7XHJcbiAgfVxyXG5cclxuICBsb2dpbihkYXRhOiBhbnksIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy5yZXRyaWV2ZSh7J2VtYWlsJzogZGF0YS5lbWFpbH0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIGlmIChyZXN1bHQubGVuZ3RoID4gMCAmJiByZXN1bHRbMF0uaXNBY3RpdmF0ZWQgPT09IHRydWUpIHtcclxuICAgICAgICBiY3J5cHQuY29tcGFyZShkYXRhLnBhc3N3b3JkLCByZXN1bHRbMF0ucGFzc3dvcmQsIChlcnI6IGFueSwgaXNTYW1lOiBhbnkpID0+IHtcclxuICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX1JFR0lTVFJBVElPTl9TVEFUVVMsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1ZFUklGWV9DQU5ESURBVEVfQUNDT1VOVCxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBhY3R1YWxFcnJvcjogZXJyLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDUwMFxyXG4gICAgICAgICAgICB9LCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8qY29uc29sZS5sb2coJ2dvdCB1c2VyJyk7Ki9cclxuICAgICAgICAgICAgaWYgKGlzU2FtZSkge1xyXG4gICAgICAgICAgICAgIGxldCBhdXRoID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgICAgICAgICAgIGxldCB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQocmVzdWx0WzBdKTtcclxuICAgICAgICAgICAgICB2YXIgZGF0YTogYW55ID0ge1xyXG4gICAgICAgICAgICAgICAgJ3N0YXR1cyc6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgICAgICAgJ2RhdGEnOiB7XHJcbiAgICAgICAgICAgICAgICAgICdmaXJzdF9uYW1lJzogcmVzdWx0WzBdLmZpcnN0X25hbWUsXHJcbiAgICAgICAgICAgICAgICAgICdsYXN0X25hbWUnOiByZXN1bHRbMF0ubGFzdF9uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAnY29tcGFueV9uYW1lJzogcmVzdWx0WzBdLmNvbXBhbnlfbmFtZSxcclxuICAgICAgICAgICAgICAgICAgJ2VtYWlsJzogcmVzdWx0WzBdLmVtYWlsLFxyXG4gICAgICAgICAgICAgICAgICAnX2lkJzogcmVzdWx0WzBdLl9pZCxcclxuICAgICAgICAgICAgICAgICAgJ2N1cnJlbnRfdGhlbWUnOiByZXN1bHRbMF0uY3VycmVudF90aGVtZSxcclxuICAgICAgICAgICAgICAgICAgJ3BpY3R1cmUnOiByZXN1bHRbMF0ucGljdHVyZSxcclxuICAgICAgICAgICAgICAgICAgJ21vYmlsZV9udW1iZXInOiByZXN1bHRbMF0ubW9iaWxlX251bWJlcixcclxuICAgICAgICAgICAgICAgICAgJ2FjY2Vzc190b2tlbic6IHRva2VuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblxyXG4gICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgZGF0YSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2soe1xyXG4gICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfUEFTU1dPUkQsXHJcbiAgICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICAgIH0sIG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDAgJiYgcmVzdWx0WzBdLmlzQWN0aXZhdGVkID09PSBmYWxzZSkge1xyXG4gICAgICAgIGNhbGxiYWNrKHtcclxuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX1JFR0lTVFJBVElPTl9TVEFUVVMsXHJcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0NBTkRJREFURV9BQ0NPVU5ULFxyXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICBjb2RlOiA1MDBcclxuICAgICAgICB9LCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayh7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fVVNFUl9OT1RfRk9VTkQsXHJcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVVNFUl9OT1RfUFJFU0VOVCxcclxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgfSxudWxsKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZW5kT3RwKHBhcmFtczogYW55LCB1c2VyOiBhbnksIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IERhdGEgPSB7XHJcbiAgICAgIG5ld19tb2JpbGVfbnVtYmVyOiBwYXJhbXMubW9iaWxlX251bWJlcixcclxuICAgICAgb2xkX21vYmlsZV9udW1iZXI6IHVzZXIubW9iaWxlX251bWJlcixcclxuICAgICAgX2lkOiB1c2VyLl9pZFxyXG4gICAgfTtcclxuICAgIHRoaXMuZ2VuZXJhdGVPdHAoRGF0YSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgaWYgKGVycm9yID09PSBNZXNzYWdlcy5NU0dfRVJST1JfQ0hFQ0tfTU9CSUxFX1BSRVNFTlQpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0VYSVNUSU5HX1VTRVIsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT05fTU9CSUxFX05VTUJFUixcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICBjYWxsYmFjayh7XHJcbiAgICAgICAgICAnc3RhdHVzJzogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgICAnZGF0YSc6IHtcclxuICAgICAgICAgICAgJ21lc3NhZ2UnOiBNZXNzYWdlcy5NU0dfU1VDQ0VTU19PVFBcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayh7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fVVNFUl9OT1RfRk9VTkQsXHJcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX1VTRVJfTk9UX0ZPVU5ELFxyXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICB9LCBudWxsKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZW5lcmF0ZU90cChmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnJldHJpZXZlKHsnbW9iaWxlX251bWJlcic6IGZpZWxkLm5ld19tb2JpbGVfbnVtYmVyLCAnaXNBY3RpdmF0ZWQnOiB0cnVlfSwgKGVyciwgcmVzKSA9PiB7XHJcblxyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgIH0gZWxzZSBpZiAocmVzLmxlbmd0aCA+IDAgJiYgKHJlc1swXS5faWQpICE9PSBmaWVsZC5faWQpIHtcclxuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTl9NT0JJTEVfTlVNQkVSKSwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSBpZiAocmVzLmxlbmd0aCA9PT0gMCkge1xyXG5cclxuICAgICAgICBsZXQgcXVlcnkgPSB7J19pZCc6IGZpZWxkLl9pZH07XHJcbiAgICAgICAgbGV0IG90cCA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiA5OTk5OSkgKyAxMDAwMDApO1xyXG4gICAgICAgIGxldCB1cGRhdGVEYXRhID0geydtb2JpbGVfbnVtYmVyJzogZmllbGQubmV3X21vYmlsZV9udW1iZXIsICdvdHAnOiBvdHB9O1xyXG4gICAgICAgIHRoaXMudXNlclJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT05fTU9CSUxFX05VTUJFUiksIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IERhdGEgPSB7XHJcbiAgICAgICAgICAgICAgbW9iaWxlTm86IGZpZWxkLm5ld19tb2JpbGVfbnVtYmVyLFxyXG4gICAgICAgICAgICAgIG90cDogb3RwXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGxldCBzZW5kTWVzc2FnZVNlcnZpY2UgPSBuZXcgU2VuZE1lc3NhZ2VTZXJ2aWNlKCk7XHJcbiAgICAgICAgICAgIHNlbmRNZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZURpcmVjdChEYXRhLCBjYWxsYmFjayk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT05fTU9CSUxFX05VTUJFUiksIG51bGwpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHZlcmlmeU90cChwYXJhbXM6IGFueSwgdXNlcjphbnksIGNhbGxiYWNrOihlcnJvcjphbnksIHJlc3VsdDphbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCBtYWlsQ2hpbXBNYWlsZXJTZXJ2aWNlID0gbmV3IE1haWxDaGltcE1haWxlclNlcnZpY2UoKTtcclxuXHJcbiAgICBsZXQgcXVlcnkgPSB7J19pZCc6IHVzZXIuX2lkLCAnaXNBY3RpdmF0ZWQnOiBmYWxzZX07XHJcbiAgICBsZXQgdXBkYXRlRGF0YSA9IHsnaXNBY3RpdmF0ZWQnOiB0cnVlLCAnYWN0aXZhdGlvbl9kYXRlJzogbmV3IERhdGUoKX07XHJcbiAgICBpZiAodXNlci5vdHAgPT09IHBhcmFtcy5vdHApIHtcclxuICAgICAgdGhpcy5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY2FsbGJhY2sobnVsbCx7XHJcbiAgICAgICAgICAgICdzdGF0dXMnOiAnU3VjY2VzcycsXHJcbiAgICAgICAgICAgICdkYXRhJzogeydtZXNzYWdlJzogJ1VzZXIgQWNjb3VudCB2ZXJpZmllZCBzdWNjZXNzZnVsbHknfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBtYWlsQ2hpbXBNYWlsZXJTZXJ2aWNlLm9uQ2FuZGlkYXRlU2lnblN1Y2Nlc3MocmVzdWx0KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNhbGxiYWNrKHtcclxuICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfT1RQLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICB9LCBudWxsKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBjaGFuZ2VNb2JpbGVOdW1iZXIoZmllbGQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG5cclxuICAgIGxldCBxdWVyeSA9IHsnX2lkJzogZmllbGQuX2lkfTtcclxuICAgIGxldCBvdHAgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogOTk5OTkpICsgMTAwMDAwKTtcclxuICAgIGxldCB1cGRhdGVEYXRhID0geydvdHAnOiBvdHAsICd0ZW1wX21vYmlsZSc6IGZpZWxkLm5ld19tb2JpbGVfbnVtYmVyfTtcclxuXHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZURhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTiksIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBEYXRhID0ge1xyXG4gICAgICAgICAgY3VycmVudF9tb2JpbGVfbnVtYmVyOiBmaWVsZC5jdXJyZW50X21vYmlsZV9udW1iZXIsXHJcbiAgICAgICAgICBtb2JpbGVObzogZmllbGQubmV3X21vYmlsZV9udW1iZXIsXHJcbiAgICAgICAgICBvdHA6IG90cFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgbGV0IHNlbmRNZXNzYWdlU2VydmljZSA9IG5ldyBTZW5kTWVzc2FnZVNlcnZpY2UoKTtcclxuICAgICAgICBzZW5kTWVzc2FnZVNlcnZpY2Uuc2VuZENoYW5nZU1vYmlsZU1lc3NhZ2UoRGF0YSwgY2FsbGJhY2spO1xyXG5cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgZm9yZ290UGFzc3dvcmQoZmllbGQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IFNlbnRNZXNzYWdlSW5mbykgPT4gdm9pZCkge1xyXG5cclxuICAgIGxldCBzZW5kTWFpbFNlcnZpY2UgPSBuZXcgU2VuZE1haWxTZXJ2aWNlKCk7XHJcbiAgICBsZXQgcXVlcnkgPSB7J2VtYWlsJzogZmllbGQuZW1haWx9O1xyXG5cclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkucmV0cmlldmUocXVlcnksIChlcnIsIHJlcykgPT4ge1xyXG5cclxuICAgICAgaWYgKHJlcy5sZW5ndGggPiAwICYmIHJlc1swXS5pc0FjdGl2YXRlZCA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICBsZXQgYXV0aCA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgICAgICBsZXQgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc1swXSk7XHJcbiAgICAgICAgbGV0IGhvc3QgPSBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLmhvc3QnKTtcclxuICAgICAgICBsZXQgbGluayA9IGhvc3QgKyAncmVzZXQtcGFzc3dvcmQ/YWNjZXNzX3Rva2VuPScgKyB0b2tlbiArICcmX2lkPScgKyByZXNbMF0uX2lkO1xyXG4gICAgICAgIGxldCBodG1sVGVtcGxhdGUgPSAnZm9yZ290cGFzc3dvcmQuaHRtbCc7XHJcbiAgICAgICAgbGV0IGRhdGE6TWFwPHN0cmluZyxzdHJpbmc+PSBuZXcgTWFwKFtbJyRhcHBsaWNhdGlvbkxpbmskJyxjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLmhvc3QnKV0sXHJcbiAgICAgICAgICBbJyRmaXJzdF9uYW1lJCcscmVzWzBdLmZpcnN0X25hbWVdLFsnJHVzZXJfbWFpbCQnLHJlc1swXS5lbWFpbF0sWyckbGluayQnLGxpbmtdLFsnJGFwcF9uYW1lJCcsdGhpcy5BUFBfTkFNRV1dKTtcclxuICAgICAgICBsZXQgYXR0YWNobWVudD1NYWlsQXR0YWNobWVudHMuRm9yZ2V0UGFzc3dvcmRBdHRhY2htZW50QXJyYXk7XHJcbiAgICAgICAgc2VuZE1haWxTZXJ2aWNlLnNlbmQoIGZpZWxkLmVtYWlsLCBNZXNzYWdlcy5FTUFJTF9TVUJKRUNUX0ZPUkdPVF9QQVNTV09SRCwgaHRtbFRlbXBsYXRlLCBkYXRhLGF0dGFjaG1lbnQsXHJcbihlcnI6IGFueSwgcmVzdWx0OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyLCByZXN1bHQpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSBpZiAocmVzLmxlbmd0aCA+IDAgJiYgcmVzWzBdLmlzQWN0aXZhdGVkID09PSBmYWxzZSkge1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfQUNDT1VOVF9TVEFUVVMpLCByZXMpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfVVNFUl9OT1RfRk9VTkQpLCByZXMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuXHJcbiAgU2VuZENoYW5nZU1haWxWZXJpZmljYXRpb24oZmllbGQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IFNlbnRNZXNzYWdlSW5mbykgPT4gdm9pZCkge1xyXG4gICAgbGV0IHF1ZXJ5ID0geydlbWFpbCc6IGZpZWxkLmN1cnJlbnRfZW1haWwsICdpc0FjdGl2YXRlZCc6IHRydWV9O1xyXG4gICAgbGV0IHVwZGF0ZURhdGEgPSB7JHNldDp7J3RlbXBfZW1haWwnOiBmaWVsZC5uZXdfZW1haWx9fTtcclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX0VNQUlMX0FDVElWRV9OT1cpLCBudWxsKTtcclxuICAgICAgfSBlbHNlIGlmKHJlc3VsdCA9PSBudWxsKSB7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQUNDT1VOVCksIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBhdXRoID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgICAgIGxldCB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQocmVzdWx0KTtcclxuICAgICAgICBsZXQgaG9zdCA9IGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpO1xyXG4gICAgICAgIGxldCBsaW5rID0gaG9zdCArICdhY3RpdmF0ZS11c2VyP2FjY2Vzc190b2tlbj0nICsgdG9rZW4gKyAnJl9pZD0nICsgcmVzdWx0Ll9pZCsnaXNFbWFpbFZlcmlmaWNhdGlvbic7XHJcbiAgICAgICAgbGV0IHNlbmRNYWlsU2VydmljZSA9IG5ldyBTZW5kTWFpbFNlcnZpY2UoKTtcclxuICAgICAgICBsZXQgZGF0YTogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoW1snJGFwcGxpY2F0aW9uTGluayQnLGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpXSxcclxuICAgICAgICAgIFsnJGxpbmskJywgbGlua11dKTtcclxuICAgICAgICBsZXQgYXR0YWNobWVudD1NYWlsQXR0YWNobWVudHMuQXR0YWNobWVudEFycmF5O1xyXG4gICAgICAgIHNlbmRNYWlsU2VydmljZS5zZW5kKGZpZWxkLm5ld19lbWFpbCxcclxuICAgICAgICAgIE1lc3NhZ2VzLkVNQUlMX1NVQkpFQ1RfQ0hBTkdFX0VNQUlMSUQsXHJcbiAgICAgICAgICAnY2hhbmdlLm1haWwuaHRtbCcsIGRhdGEsYXR0YWNobWVudCwgY2FsbGJhY2spO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNlbmRNYWlsKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBTZW50TWVzc2FnZUluZm8pID0+IHZvaWQpIHtcclxuICAgIGxldCBzZW5kTWFpbFNlcnZpY2UgPSBuZXcgU2VuZE1haWxTZXJ2aWNlKCk7XHJcbiAgICBsZXQgZGF0YTpNYXA8c3RyaW5nLHN0cmluZz49IG5ldyBNYXAoW1snJGFwcGxpY2F0aW9uTGluayQnLGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpXSxcclxuICAgICAgWyckZmlyc3RfbmFtZSQnLGZpZWxkLmZpcnN0X25hbWVdLFsnJGVtYWlsJCcsZmllbGQuZW1haWxdLFsnJG1lc3NhZ2UkJyxmaWVsZC5tZXNzYWdlXV0pO1xyXG4gICAgbGV0IGF0dGFjaG1lbnQ9TWFpbEF0dGFjaG1lbnRzLkF0dGFjaG1lbnRBcnJheTtcclxuICAgIHNlbmRNYWlsU2VydmljZS5zZW5kKGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuQURNSU5fTUFJTCcpLFxyXG4gICAgICBNZXNzYWdlcy5FTUFJTF9TVUJKRUNUX1VTRVJfQ09OVEFDVEVEX1lPVSxcclxuICAgICAgJ2NvbnRhY3R1cy5tYWlsLmh0bWwnLGRhdGEsYXR0YWNobWVudCxjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICBzZW5kTWFpbE9uRXJyb3IoZXJyb3JJbmZvOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBTZW50TWVzc2FnZUluZm8pID0+IHZvaWQpIHtcclxuICAgIGxldCBjdXJyZW50X1RpbWUgPSBuZXcgRGF0ZSgpLnRvTG9jYWxlVGltZVN0cmluZyhbXSwge2hvdXI6ICcyLWRpZ2l0JywgbWludXRlOiAnMi1kaWdpdCd9KTtcclxuICAgIGxldCBkYXRhOk1hcDxzdHJpbmcsc3RyaW5nPjtcclxuICAgIGlmKGVycm9ySW5mby5zdGFja1RyYWNlKSB7XHJcbiAgICAgICBkYXRhPSBuZXcgTWFwKFtbJyRhcHBsaWNhdGlvbkxpbmskJyxjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLmhvc3QnKV0sXHJcbiAgICAgICAgIFsnJHRpbWUkJyxjdXJyZW50X1RpbWVdLFsnJGhvc3QkJyxjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLmhvc3QnKV0sXHJcbiAgICAgICAgWyckcmVhc29uJCcsZXJyb3JJbmZvLnJlYXNvbl0sWyckY29kZSQnLGVycm9ySW5mby5jb2RlXSxcclxuICAgICAgICBbJyRtZXNzYWdlJCcsZXJyb3JJbmZvLm1lc3NhZ2VdLFsnJGVycm9yJCcsZXJyb3JJbmZvLnN0YWNrVHJhY2Uuc3RhY2tdXSk7XHJcblxyXG4gICAgfSBlbHNlIGlmKGVycm9ySW5mby5zdGFjaykge1xyXG4gICAgICBkYXRhPSBuZXcgTWFwKFtbJyRhcHBsaWNhdGlvbkxpbmskJyxjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLmhvc3QnKV0sXHJcbiAgICAgICAgWyckdGltZSQnLGN1cnJlbnRfVGltZV0sWyckaG9zdCQnLGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpXSxcclxuICAgICAgICBbJyRyZWFzb24kJyxlcnJvckluZm8ucmVhc29uXSxbJyRjb2RlJCcsZXJyb3JJbmZvLmNvZGVdLFxyXG4gICAgICAgIFsnJG1lc3NhZ2UkJyxlcnJvckluZm8ubWVzc2FnZV0sWyckZXJyb3IkJyxlcnJvckluZm8uc3RhY2tdXSk7XHJcbiAgICB9XHJcbiAgICBsZXQgc2VuZE1haWxTZXJ2aWNlID0gbmV3IFNlbmRNYWlsU2VydmljZSgpO1xyXG4gICAgbGV0IGF0dGFjaG1lbnQgPSBNYWlsQXR0YWNobWVudHMuQXR0YWNobWVudEFycmF5O1xyXG4gICAgc2VuZE1haWxTZXJ2aWNlLnNlbmQoY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5BRE1JTl9NQUlMJyksXHJcbiAgICAgIE1lc3NhZ2VzLkVNQUlMX1NVQkpFQ1RfU0VSVkVSX0VSUk9SICsgJyBvbiAnICsgY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5ob3N0JyksXHJcbiAgICAgICdlcnJvci5tYWlsLmh0bWwnLGRhdGEsYXR0YWNobWVudCwgY2FsbGJhY2ssY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5UUExHUk9VUF9NQUlMJykpO1xyXG4gIH1cclxuXHJcbiAgZmluZEJ5SWQoaWQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kQnlJZChpZCwgY2FsbGJhY2spO1xyXG4gIH1cclxuXHJcbiAgcmV0cmlldmUoZmllbGQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5yZXRyaWV2ZShmaWVsZCwgY2FsbGJhY2spO1xyXG4gIH1cclxuXHJcbiAgcmV0cmlldmVXaXRoTGltaXQoZmllbGQ6IGFueSwgaW5jbHVkZWQgOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCBsaW1pdCA9IGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLmxpbWl0Rm9yUXVlcnknKTtcclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkucmV0cmlldmVXaXRoTGltaXQoZmllbGQsIGluY2x1ZGVkLCBsaW1pdCwgY2FsbGJhY2spO1xyXG4gIH1cclxuXHJcbiAgcmV0cmlldmVXaXRoTGVhbihmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnJldHJpZXZlKGZpZWxkLCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICByZXRyaWV2ZUFsbChpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkucmV0cmlldmUoaXRlbSwgKGVyciwgcmVzKSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTl9NT0JJTEVfTlVNQkVSKSwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoX2lkOiBhbnksIGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG5cclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkuZmluZEJ5SWQoX2lkLCAoZXJyOiBhbnksIHJlczogYW55KSA9PiB7XHJcblxyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyLCByZXMpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMudXNlclJlcG9zaXRvcnkudXBkYXRlKF9pZCwgaXRlbSwgY2FsbGJhY2spO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxuICBkZWxldGUoX2lkOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkuZGVsZXRlKF9pZCwgY2FsbGJhY2spO1xyXG4gIH1cclxuXHJcbiAgZmluZE9uZUFuZFVwZGF0ZShxdWVyeTogYW55LCBuZXdEYXRhOiBhbnksIG9wdGlvbnM6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBuZXdEYXRhLCBvcHRpb25zLCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICBVcGxvYWRJbWFnZSh0ZW1wUGF0aDogYW55LCBmaWxlTmFtZTogYW55LCBjYjogYW55KSB7XHJcbiAgICBsZXQgdGFyZ2V0cGF0aCA9IGZpbGVOYW1lO1xyXG4gICAgZnMucmVuYW1lKHRlbXBQYXRoLCB0YXJnZXRwYXRoLCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgIGNiKG51bGwsIHRlbXBQYXRoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgVXBsb2FkRG9jdW1lbnRzKHRlbXBQYXRoOiBhbnksIGZpbGVOYW1lOiBhbnksIGNiOiBhbnkpIHtcclxuICAgIGxldCB0YXJnZXRwYXRoID0gZmlsZU5hbWU7XHJcbiAgICBmcy5yZW5hbWUodGVtcFBhdGgsIHRhcmdldHBhdGgsIGZ1bmN0aW9uIChlcnI6IGFueSkge1xyXG4gICAgICBjYihudWxsLCB0ZW1wUGF0aCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZpbmRBbmRVcGRhdGVOb3RpZmljYXRpb24ocXVlcnk6IGFueSwgbmV3RGF0YTogYW55LCBvcHRpb25zOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgbmV3RGF0YSwgb3B0aW9ucywgY2FsbGJhY2spO1xyXG4gIH1cclxuXHJcbiAgcmV0cmlldmVCeVNvcnRlZE9yZGVyKHF1ZXJ5OiBhbnksIHByb2plY3Rpb246YW55LCBzb3J0aW5nUXVlcnk6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgLy90aGlzLnVzZXJSZXBvc2l0b3J5LnJldHJpZXZlQnlTb3J0ZWRPcmRlcihxdWVyeSwgcHJvamVjdGlvbiwgc29ydGluZ1F1ZXJ5LCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICByZXNldFBhc3N3b3JkKGRhdGE6IGFueSwgdXNlciA6IGFueSwgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PmFueSkge1xyXG4gICAgY29uc3Qgc2FsdFJvdW5kcyA9IDEwO1xyXG4gICAgYmNyeXB0Lmhhc2goZGF0YS5uZXdfcGFzc3dvcmQsIHNhbHRSb3VuZHMsIChlcnI6IGFueSwgaGFzaDogYW55KSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayh7XHJcbiAgICAgICAgICByZWFzb246ICdFcnJvciBpbiBjcmVhdGluZyBoYXNoIHVzaW5nIGJjcnlwdCcsXHJcbiAgICAgICAgICBtZXNzYWdlOiAnRXJyb3IgaW4gY3JlYXRpbmcgaGFzaCB1c2luZyBiY3J5cHQnLFxyXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICB9LCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgdXBkYXRlRGF0YSA9IHsncGFzc3dvcmQnOiBoYXNofTtcclxuICAgICAgICBsZXQgcXVlcnkgPSB7J19pZCc6IHVzZXIuX2lkLCAncGFzc3dvcmQnOiB1c2VyLnBhc3N3b3JkfTtcclxuICAgICAgICB0aGlzLmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZURhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwse1xyXG4gICAgICAgICAgICAgICdzdGF0dXMnOiAnU3VjY2VzcycsXHJcbiAgICAgICAgICAgICAgJ2RhdGEnOiB7J21lc3NhZ2UnOiAnUGFzc3dvcmQgY2hhbmdlZCBzdWNjZXNzZnVsbHknfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVEZXRhaWxzKGRhdGE6ICBVc2VyTW9kZWwsIHVzZXI6IFVzZXJNb2RlbCwgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsZXQgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgbGV0IHF1ZXJ5ID0geydfaWQnOiB1c2VyLl9pZH07XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIGRhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCx7XHJcbiAgICAgICAgICAnc3RhdHVzJzogJ1N1Y2Nlc3MnLFxyXG4gICAgICAgICAgJ2RhdGEnOiB7J21lc3NhZ2UnOiAnVXNlciBQcm9maWxlIFVwZGF0ZWQgc3VjY2Vzc2Z1bGx5J31cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0VXNlckJ5SWQodXNlcjphbnksIGNhbGxiYWNrOihlcnJvcjphbnksIHJlc3VsdDphbnkpPT52b2lkKSB7XHJcbiAgICBsZXQgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG5cclxuICAgIGxldCB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQodXNlcik7XHJcbiAgICBjYWxsYmFjayhudWxsLHtcclxuICAgICAgJ3N0YXR1cyc6ICdzdWNjZXNzJyxcclxuICAgICAgJ2RhdGEnOiB7XHJcbiAgICAgICAgJ2ZpcnN0X25hbWUnOiB1c2VyLmZpcnN0X25hbWUsXHJcbiAgICAgICAgJ2xhc3RfbmFtZSc6IHVzZXIubGFzdF9uYW1lLFxyXG4gICAgICAgICdlbWFpbCc6IHVzZXIuZW1haWwsXHJcbiAgICAgICAgJ21vYmlsZV9udW1iZXInOiB1c2VyLm1vYmlsZV9udW1iZXIsXHJcbiAgICAgICAgJ2NvbXBhbnlfbmFtZSc6IHVzZXIuY29tcGFueV9uYW1lLFxyXG4gICAgICAgICdzdGF0ZSc6IHVzZXIuc3RhdGUsXHJcbiAgICAgICAgJ2NpdHknOiB1c2VyLmNpdHksXHJcbiAgICAgICAgJ3BpY3R1cmUnOiB1c2VyLnBpY3R1cmUsXHJcbiAgICAgICAgJ3NvY2lhbF9wcm9maWxlX3BpY3R1cmUnOiB1c2VyLnNvY2lhbF9wcm9maWxlX3BpY3R1cmUsXHJcbiAgICAgICAgJ19pZCc6IHVzZXIuX2lkLFxyXG4gICAgICAgICdjdXJyZW50X3RoZW1lJzogdXNlci5jdXJyZW50X3RoZW1lXHJcbiAgICAgIH0sXHJcbiAgICAgIGFjY2Vzc190b2tlbjogdG9rZW5cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdmVyaWZ5QWNjb3VudCh1c2VyOlVzZXIsIGNhbGxiYWNrOihlcnJvcjphbnksIHJlc3VsdDphbnkpPT52b2lkKSB7XHJcbiAgICBsZXQgcXVlcnkgPSB7J19pZCc6IHVzZXIuX2lkLCAnaXNBY3RpdmF0ZWQnOiBmYWxzZX07XHJcbiAgICBsZXQgdXBkYXRlRGF0YSA9IHsnaXNBY3RpdmF0ZWQnOiB0cnVlfTtcclxuICAgIHRoaXMuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLHtcclxuICAgICAgICAgICdzdGF0dXMnOiAnU3VjY2VzcycsXHJcbiAgICAgICAgICAnZGF0YSc6IHsnbWVzc2FnZSc6ICdVc2VyIEFjY291bnQgdmVyaWZpZWQgc3VjY2Vzc2Z1bGx5J31cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgY2hhbmdlRW1haWxJZChkYXRhOmFueSwgdXNlciA6IFVzZXIsIGNhbGxiYWNrOihlcnJvcjphbnksIHJlc3VsdDphbnkpPT52b2lkKSB7XHJcbiAgICBsZXQgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgbGV0IHF1ZXJ5ID0geydlbWFpbCc6IGRhdGEubmV3X2VtYWlsfTtcclxuXHJcbiAgICB0aGlzLnJldHJpZXZlKHF1ZXJ5LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG5cclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2UgaWYgKHJlc3VsdC5sZW5ndGggPiAwICYmIHJlc3VsdFswXS5pc0FjdGl2YXRlZCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIGNhbGxiYWNrKHtcclxuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxyXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTixcclxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgfSxudWxsKTtcclxuICAgICAgfSBlbHNlIGlmIChyZXN1bHQubGVuZ3RoID4gMCAmJiByZXN1bHRbMF0uaXNBY3RpdmF0ZWQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgY2FsbGJhY2soe1xyXG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0VYSVNUSU5HX1VTRVIsXHJcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfQUNDT1VOVF9TVEFUVVMsXHJcbiAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgIH0sIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuU2VuZENoYW5nZU1haWxWZXJpZmljYXRpb24oZGF0YSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IubWVzc2FnZSA9PT0gTWVzc2FnZXMuTVNHX0VSUk9SX0NIRUNLX0VNQUlMX0FDQ09VTlQpIHtcclxuICAgICAgICAgICAgICBjYWxsYmFjayh7XHJcbiAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRVhJU1RJTkdfVVNFUixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTUFJTF9BQ1RJVkVfTk9XLFxyXG4gICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgICB9LCBudWxsKTtcclxuICAgICAgICAgICAgfWlmIChlcnJvci5tZXNzYWdlID09PSBNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0FDQ09VTlQpIHtcclxuICAgICAgICAgICAgICBjYWxsYmFjayh7XHJcbiAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQUNDT1VOVCxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQUNDT1VOVCxcclxuICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgICAgfSwgbnVsbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2soe1xyXG4gICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX1dISUxFX0NPTlRBQ1RJTkcsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV0hJTEVfQ09OVEFDVElORyxcclxuICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgICAgfSwgbnVsbCk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7XHJcbiAgICAgICAgICAgICAgJ3N0YXR1cyc6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgICAgICdkYXRhJzogeydtZXNzYWdlJzogTWVzc2FnZXMuTVNHX1NVQ0NFU1NfRU1BSUxfQ0hBTkdFX0VNQUlMSUR9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB2ZXJpZnlDaGFuZ2VkRW1haWxJZCh1c2VyOiBhbnksIGNhbGxiYWNrOihlcnJvciA6IGFueSwgcmVzdWx0IDogYW55KT0+IGFueSkge1xyXG4gICAgbGV0IHF1ZXJ5ID0geydfaWQnOiB1c2VyLl9pZH07XHJcbiAgICBsZXQgdXBkYXRlRGF0YSA9IHsnZW1haWwnOiB1c2VyLnRlbXBfZW1haWwsICd0ZW1wX2VtYWlsJzogdXNlci5lbWFpbH07XHJcbiAgICB0aGlzLmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZURhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCx7XHJcbiAgICAgICAgICAnc3RhdHVzJzogJ1N1Y2Nlc3MnLFxyXG4gICAgICAgICAgJ2RhdGEnOiB7J21lc3NhZ2UnOiAnVXNlciBBY2NvdW50IHZlcmlmaWVkIHN1Y2Nlc3NmdWxseSd9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHZlcmlmeU1vYmlsZU51bWJlcihkYXRhIDphbnkgLCB1c2VyIDogYW55LCBjYWxsYmFjazooZXJyb3I6YW55LCByZXN1bHQ6YW55KT0+dm9pZCkge1xyXG4gICAgbGV0IHF1ZXJ5ID0geydfaWQnOiB1c2VyLl9pZH07XHJcbiAgICBsZXQgdXBkYXRlRGF0YSA9IHsnbW9iaWxlX251bWJlcic6IHVzZXIudGVtcF9tb2JpbGUsICd0ZW1wX21vYmlsZSc6IHVzZXIubW9iaWxlX251bWJlcn07XHJcbiAgICBpZiAodXNlci5vdHAgPT09IGRhdGEub3RwKSB7XHJcbiAgICAgIHRoaXMuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNhbGxiYWNrKG51bGwse1xyXG4gICAgICAgICAgICAnc3RhdHVzJzogJ1N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAnZGF0YSc6IHsnbWVzc2FnZSc6ICdVc2VyIEFjY291bnQgdmVyaWZpZWQgc3VjY2Vzc2Z1bGx5J31cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjYWxsYmFjayh7XHJcbiAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dST05HX09UUCxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgfSwgbnVsbCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3NpZ25QcmVtaXVtUGFja2FnZSh1c2VyOlVzZXIsdXNlcklkOnN0cmluZywgY29zdDogbnVtYmVyLGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCBwcm9qZWN0aW9uID0ge3N1YnNjcmlwdGlvbjogMX07XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmZpbmRCeUlkV2l0aFByb2plY3Rpb24odXNlcklkLHByb2plY3Rpb24sKGVycm9yLHJlc3VsdCk9PiB7XHJcbiAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsbnVsbCk7XHJcbiAgICAgIH1lbHNlIHtcclxuICAgICAgICBsZXQgc3ViU2NyaXB0aW9uQXJyYXkgPSByZXN1bHQuc3Vic2NyaXB0aW9uO1xyXG4gICAgICAgIGxldCBzdWJTY3JpcHRpb25TZXJ2aWNlID0gbmV3IFN1YnNjcmlwdGlvblNlcnZpY2UoKTtcclxuICAgICAgICBzdWJTY3JpcHRpb25TZXJ2aWNlLmdldFN1YnNjcmlwdGlvblBhY2thZ2VCeU5hbWUoJ1ByZW1pdW0nLCdCYXNlUGFja2FnZScsXHJcbiAgICAgICAgICAoZXJyb3I6IGFueSwgc3Vic2NyaXB0aW9uUGFja2FnZTogQXJyYXk8U3Vic2NyaXB0aW9uUGFja2FnZT4pID0+IHtcclxuICAgICAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvcixudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBsZXQgcHJlbWl1bVBhY2thZ2UgPSBzdWJzY3JpcHRpb25QYWNrYWdlWzBdO1xyXG4gICAgICAgICAgICAgIGlmKHN1YlNjcmlwdGlvbkFycmF5WzBdLnByb2plY3RJZC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHN1YlNjcmlwdGlvbkFycmF5WzBdLm51bU9mQnVpbGRpbmdzID0gcHJlbWl1bVBhY2thZ2UuYmFzZVBhY2thZ2UubnVtT2ZCdWlsZGluZ3M7XHJcbiAgICAgICAgICAgICAgICBzdWJTY3JpcHRpb25BcnJheVswXS5udW1PZlByb2plY3RzID0gcHJlbWl1bVBhY2thZ2UuYmFzZVBhY2thZ2UubnVtT2ZQcm9qZWN0cztcclxuICAgICAgICAgICAgICAgIHN1YlNjcmlwdGlvbkFycmF5WzBdLnZhbGlkaXR5ID0gc3ViU2NyaXB0aW9uQXJyYXlbMF0udmFsaWRpdHkgKyBwcmVtaXVtUGFja2FnZS5iYXNlUGFja2FnZS52YWxpZGl0eTtcclxuICAgICAgICAgICAgICAgIHN1YlNjcmlwdGlvbkFycmF5WzBdLnB1cmNoYXNlZC5wdXNoKHByZW1pdW1QYWNrYWdlLmJhc2VQYWNrYWdlKTtcclxuICAgICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc3Vic2NyaXB0aW9uID0gbmV3IFVzZXJTdWJzY3JpcHRpb24oKTtcclxuICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi5hY3RpdmF0aW9uRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24ubnVtT2ZCdWlsZGluZ3MgPSBwcmVtaXVtUGFja2FnZS5iYXNlUGFja2FnZS5udW1PZkJ1aWxkaW5ncztcclxuICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi5udW1PZlByb2plY3RzID0gcHJlbWl1bVBhY2thZ2UuYmFzZVBhY2thZ2UubnVtT2ZQcm9qZWN0cztcclxuICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi52YWxpZGl0eSA9IHByZW1pdW1QYWNrYWdlLmJhc2VQYWNrYWdlLnZhbGlkaXR5O1xyXG4gICAgICAgICAgICAgICAgcHJlbWl1bVBhY2thZ2UuYmFzZVBhY2thZ2UuY29zdCA9IGNvc3Q7XHJcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24ucHJvamVjdElkID0gbmV3IEFycmF5PHN0cmluZz4oKTtcclxuICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi5wdXJjaGFzZWQgPSBuZXcgQXJyYXk8QmFzZVN1YnNjcmlwdGlvblBhY2thZ2U+KCk7XHJcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24ucHVyY2hhc2VkLnB1c2gocHJlbWl1bVBhY2thZ2UuYmFzZVBhY2thZ2UpO1xyXG4gICAgICAgICAgICAgICAgc3ViU2NyaXB0aW9uQXJyYXkucHVzaChzdWJzY3JpcHRpb24pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBsZXQgcXVlcnkgPSB7J19pZCc6IHVzZXJJZH07XHJcbiAgICAgICAgICAgICAgbGV0IG5ld0RhdGEgPSB7JHNldDogeydzdWJzY3JpcHRpb24nOiBzdWJTY3JpcHRpb25BcnJheX19O1xyXG4gICAgICAgICAgICAgIHRoaXMudXNlclJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgbmV3RGF0YSwge25ldzogdHJ1ZX0sIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTonc3VjY2Vzcyd9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldFByb2plY3RzKHVzZXI6IFVzZXIsIGNhbGxiYWNrOihlcnJvciA6IGFueSwgcmVzdWx0IDphbnkpPT52b2lkKSB7XHJcblxyXG4gICAgbGV0IHF1ZXJ5ID0ge19pZDogdXNlci5faWQgfTtcclxuICAgIGxldCBwb3B1bGF0ZSA9IHtwYXRoOiAncHJvamVjdCcsIHNlbGVjdDogWyduYW1lJywnYnVpbGRpbmdzJywnYWN0aXZlU3RhdHVzJ119O1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kQW5kUG9wdWxhdGUocXVlcnksIHBvcHVsYXRlLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgICAgICBsZXQgcG9wdWxhdGVkUHJvamVjdCA9IHJlc3VsdFswXTtcclxuICAgICAgICBsZXQgcHJvamVjdExpc3QgPSByZXN1bHRbMF0ucHJvamVjdDtcclxuICAgICAgICBsZXQgc3Vic2NyaXB0aW9uTGlzdCA9IHJlc3VsdFswXS5zdWJzY3JpcHRpb247XHJcblxyXG4gICAgICAgIGxldCBwcm9qZWN0U3Vic2NyaXB0aW9uQXJyYXkgPSBBcnJheTxQcm9qZWN0U3Vic2NyaXB0aW9uRGV0YWlscz4oKTtcclxuICAgICAgICBsZXQgaXNBYmxlVG9DcmVhdGVOZXdQcm9qZWN0IDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICBmb3IobGV0IHByb2plY3Qgb2YgcHJvamVjdExpc3QpIHtcclxuICAgICAgICAgIGZvcihsZXQgc3Vic2NyaXB0aW9uIG9mIHN1YnNjcmlwdGlvbkxpc3QpIHtcclxuICAgICAgICAgICAgaWYoc3Vic2NyaXB0aW9uLnByb2plY3RJZC5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgICBpZihzdWJzY3JpcHRpb24ucHJvamVjdElkWzBdLmVxdWFscyhwcm9qZWN0Ll9pZCkpIHtcclxuICAgICAgICAgICAgICAgIGxldCBwcm9qZWN0U3Vic2NyaXB0aW9uID0gbmV3IFByb2plY3RTdWJzY3JpcHRpb25EZXRhaWxzKCk7XHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLnByb2plY3ROYW1lID0gcHJvamVjdC5uYW1lO1xyXG4gICAgICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5wcm9qZWN0SWQgPSBwcm9qZWN0Ll9pZDtcclxuICAgICAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24uYWN0aXZlU3RhdHVzID0gcHJvamVjdC5hY3RpdmVTdGF0dXM7XHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLm51bU9mQnVpbGRpbmdzUmVtYWluaW5nID0gKHN1YnNjcmlwdGlvbi5udW1PZkJ1aWxkaW5ncyAtIHByb2plY3QuYnVpbGRpbmdzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLm51bU9mQnVpbGRpbmdzQWxsb2NhdGVkID0gcHJvamVjdC5idWlsZGluZ3MubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5wYWNrYWdlTmFtZSA9IHRoaXMuY2hlY2tDdXJyZW50UGFja2FnZShzdWJzY3JpcHRpb24pO1xyXG4gICAgICAgICAgICAgICAgLy9hY3RpdmF0aW9uIGRhdGUgZm9yIHByb2plY3Qgc3Vic2NyaXB0aW9uXHJcbiAgICAgICAgICAgICAgICBsZXQgYWN0aXZhdGlvbl9kYXRlID0gbmV3IERhdGUoc3Vic2NyaXB0aW9uLmFjdGl2YXRpb25EYXRlKTtcclxuICAgICAgICAgICAgICAgIGxldCBleHBpcnlEYXRlID0gbmV3IERhdGUoc3Vic2NyaXB0aW9uLmFjdGl2YXRpb25EYXRlKTtcclxuICAgICAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24uZXhwaXJ5RGF0ZSA9IG5ldyBEYXRlKGV4cGlyeURhdGUuc2V0RGF0ZShhY3RpdmF0aW9uX2RhdGUuZ2V0RGF0ZSgpICsgc3Vic2NyaXB0aW9uLnZhbGlkaXR5KSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9leHBpcnkgZGF0ZSBmb3IgcHJvamVjdCBzdWJzY3JpcHRpb25cclxuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50X2RhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld0V4aXByeURhdGUgPSBuZXcgRGF0ZShwcm9qZWN0U3Vic2NyaXB0aW9uLmV4cGlyeURhdGUpO1xyXG4gICAgICAgICAgICAgICAgbmV3RXhpcHJ5RGF0ZS5zZXREYXRlKHByb2plY3RTdWJzY3JpcHRpb24uZXhwaXJ5RGF0ZS5nZXREYXRlKCkgKyAzMCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgbm9PZkRheXMgPSAgdGhpcy5kYXlzZGlmZmVyZW5jZShuZXdFeGlwcnlEYXRlLCAgY3VycmVudF9kYXRlKTtcclxuICAgICAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24ubnVtT2ZEYXlzVG9FeHBpcmUgPSB0aGlzLmRheXNkaWZmZXJlbmNlKHByb2plY3RTdWJzY3JpcHRpb24uZXhwaXJ5RGF0ZSwgY3VycmVudF9kYXRlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihwcm9qZWN0U3Vic2NyaXB0aW9uLm51bU9mRGF5c1RvRXhwaXJlIDwgMzAgJiYgcHJvamVjdFN1YnNjcmlwdGlvbi5udW1PZkRheXNUb0V4cGlyZSA+MCkge1xyXG4gICAgICAgICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLndhcm5pbmdNZXNzYWdlID1cclxuICAgICAgICAgICAgICAgICAgICAnRXhwaXJpbmcgaW4gJyArICBNYXRoLnJvdW5kKHByb2plY3RTdWJzY3JpcHRpb24ubnVtT2ZEYXlzVG9FeHBpcmUpICsgJyBkYXlzLCcgO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKHByb2plY3RTdWJzY3JpcHRpb24ubnVtT2ZEYXlzVG9FeHBpcmUgPD0gMCAmJiAgbm9PZkRheXMgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLmV4cGlyeU1lc3NhZ2UgPSAgJ1Byb2plY3QgZXhwaXJlZCwnO1xyXG4gICAgICAgICAgICAgICAgfWVsc2UgaWYobm9PZkRheXMgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24uYWN0aXZlU3RhdHVzID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbkFycmF5LnB1c2gocHJvamVjdFN1YnNjcmlwdGlvbik7XHJcblxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlICB7XHJcbiAgICAgICAgICAgICAgaXNBYmxlVG9DcmVhdGVOZXdQcm9qZWN0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYocHJvamVjdExpc3QubGVuZ3RoID09PSAwICYmIHN1YnNjcmlwdGlvbkxpc3RbMF0ucHVyY2hhc2VkLmxlbmd0aCAhPT0wKSB7XHJcbiAgICAgICAgICBpc0FibGVUb0NyZWF0ZU5ld1Byb2plY3QgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwge1xyXG4gICAgICAgICAgZGF0YTogcHJvamVjdFN1YnNjcmlwdGlvbkFycmF5LFxyXG4gICAgICAgICAgaXNTdWJzY3JpcHRpb25BdmFpbGFibGUgOiBpc0FibGVUb0NyZWF0ZU5ld1Byb2plY3QsXHJcbiAgICAgICAgICBhY2Nlc3NfdG9rZW46IGF1dGhJbnRlcmNlcHRvci5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vVG8gY2hlY2sgd2hpY2ggaXMgY3VycmVudCBwYWNrYWdlIG9jY3VwaWVkIGJ5IHVzZXIuXHJcbiAgIGNoZWNrQ3VycmVudFBhY2thZ2Uoc3Vic2NyaXB0aW9uOmFueSkge1xyXG4gICAgIGxldCBhY3RpdmF0aW9uX2RhdGUgPSBuZXcgRGF0ZShzdWJzY3JpcHRpb24uYWN0aXZhdGlvbkRhdGUpO1xyXG4gICAgIGxldCBleHBpcnlEYXRlID0gbmV3IERhdGUoc3Vic2NyaXB0aW9uLmFjdGl2YXRpb25EYXRlKTtcclxuICAgICBsZXQgZXhwaXJ5RGF0ZU91dGVyID0gbmV3IERhdGUoc3Vic2NyaXB0aW9uLmFjdGl2YXRpb25EYXRlKTtcclxuICAgICBsZXQgY3VycmVudF9kYXRlID0gbmV3IERhdGUoKTtcclxuICAgICBmb3IobGV0IHB1cmNoYXNlUGFja2FnZSBvZiBzdWJzY3JpcHRpb24ucHVyY2hhc2VkKSB7XHJcbiAgICAgICBleHBpcnlEYXRlT3V0ZXIgPSBuZXcgRGF0ZShleHBpcnlEYXRlT3V0ZXIuc2V0RGF0ZShhY3RpdmF0aW9uX2RhdGUuZ2V0RGF0ZSgpICsgcHVyY2hhc2VQYWNrYWdlLnZhbGlkaXR5KSk7XHJcbiAgICAgICBmb3IgKGxldCBwdXJjaGFzZVBhY2thZ2Ugb2Ygc3Vic2NyaXB0aW9uLnB1cmNoYXNlZCkge1xyXG4gICAgICAgICAvL2V4cGlyeSBkYXRlIGZvciBlYWNoIHBhY2thZ2UuXHJcbiAgICAgICAgIGV4cGlyeURhdGUgPSBuZXcgRGF0ZShleHBpcnlEYXRlLnNldERhdGUoYWN0aXZhdGlvbl9kYXRlLmdldERhdGUoKSArIHB1cmNoYXNlUGFja2FnZS52YWxpZGl0eSkpO1xyXG4gICAgICAgICBpZiAoKGV4cGlyeURhdGVPdXRlciA8IGV4cGlyeURhdGUpICYmIChleHBpcnlEYXRlID49Y3VycmVudF9kYXRlKSkge1xyXG4gICAgICAgICAgIHJldHVybiBwdXJjaGFzZVBhY2thZ2UubmFtZTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICBpZihwdXJjaGFzZVBhY2thZ2UubmFtZSA9PT0nRnJlZScpIHtcclxuICAgICAgICAgcmV0dXJuIHB1cmNoYXNlUGFja2FnZS5uYW1lPSdGcmVlJztcclxuICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgcmV0dXJuIHB1cmNoYXNlUGFja2FnZS5uYW1lPSdQcmVtaXVtJztcclxuICAgICAgIH1cclxuICAgICB9XHJcbiAgICB9XHJcblxyXG4gIGRheXNkaWZmZXJlbmNlKGRhdGUxIDogRGF0ZSwgZGF0ZTIgOiBEYXRlKSB7XHJcbiAgICBsZXQgT05FREFZID0gMTAwMCAqIDYwICogNjAgKiAyNDtcclxuICAgIGxldCBkYXRlMV9tcyA9IGRhdGUxLmdldFRpbWUoKTtcclxuICAgIGxldCBkYXRlMl9tcyA9IGRhdGUyLmdldFRpbWUoKTtcclxuICAgIGxldCBkaWZmZXJlbmNlX21zID0gKGRhdGUxX21zIC0gZGF0ZTJfbXMpO1xyXG4gICAgcmV0dXJuIE1hdGgucm91bmQoZGlmZmVyZW5jZV9tcy9PTkVEQVkpO1xyXG4gIH1cclxuXHJcbiAgZ2V0UHJvamVjdFN1YnNjcmlwdGlvbih1c2VyOiBVc2VyLCBwcm9qZWN0SWQ6IHN0cmluZywgY2FsbGJhY2s6KGVycm9yIDogYW55LCByZXN1bHQgOmFueSk9PnZvaWQpIHtcclxuXHJcbiAgICBsZXQgcXVlcnkgPSBbXHJcbiAgICAgIHskbWF0Y2g6IHsnX2lkJzpPYmplY3RJZCh1c2VyLl9pZCl9fSxcclxuICAgICAgeyAkcHJvamVjdCA6IHsnc3Vic2NyaXB0aW9uJzoxfX0sXHJcbiAgICAgIHsgJHVud2luZDogJyRzdWJzY3JpcHRpb24nfSxcclxuICAgICAgeyAkbWF0Y2g6IHsnc3Vic2NyaXB0aW9uLnByb2plY3RJZCcgOiBPYmplY3RJZChwcm9qZWN0SWQpfX1cclxuICAgIF07XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmFnZ3JlZ2F0ZShxdWVyeSAsKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBxdWVyeSA9IHsgX2lkOiBwcm9qZWN0SWR9O1xyXG4gICAgICAgIGxldCBwb3B1bGF0ZSA9IHtwYXRoIDogJ2J1aWxkaW5ncyd9O1xyXG4gICAgICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZEFuZFBvcHVsYXRlKHF1ZXJ5LCBwb3B1bGF0ZSwgKGVycm9yLCByZXNwKSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHByb2plY3RTdWJzY3JpcHRpb24gPSBuZXcgUHJvamVjdFN1YnNjcmlwdGlvbkRldGFpbHMoKTtcclxuICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5wcm9qZWN0TmFtZSA9IHJlc3BbMF0ubmFtZTtcclxuICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5wcm9qZWN0SWQgPSByZXNwWzBdLl9pZDtcclxuICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5hY3RpdmVTdGF0dXMgPSByZXNwWzBdLmFjdGl2ZVN0YXR1cztcclxuICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5udW1PZkJ1aWxkaW5nc0FsbG9jYXRlZCA9IHJlc3BbMF0uYnVpbGRpbmdzLmxlbmd0aDtcclxuICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5udW1PZkJ1aWxkaW5nc0V4aXN0ID0gcmVzdWx0WzBdLnN1YnNjcmlwdGlvbi5udW1PZkJ1aWxkaW5ncztcclxuICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5udW1PZkJ1aWxkaW5nc1JlbWFpbmluZyA9IChyZXN1bHRbMF0uc3Vic2NyaXB0aW9uLm51bU9mQnVpbGRpbmdzIC0gcmVzcFswXS5idWlsZGluZ3MubGVuZ3RoKTtcclxuICAgICAgICAgICAgaWYocmVzdWx0WzBdLnN1YnNjcmlwdGlvbi5udW1PZkJ1aWxkaW5ncyA9PT0gMTAgJiYgcHJvamVjdFN1YnNjcmlwdGlvbi5udW1PZkJ1aWxkaW5nc1JlbWFpbmluZyA9PT0wICYmIHByb2plY3RTdWJzY3JpcHRpb24ucGFja2FnZU5hbWUgIT09ICdGcmVlJykge1xyXG4gICAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24uYWRkQnVpbGRpbmdEaXNhYmxlPXRydWU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLnBhY2thZ2VOYW1lID0gdGhpcy5jaGVja0N1cnJlbnRQYWNrYWdlKHJlc3VsdFswXS5zdWJzY3JpcHRpb24pO1xyXG4gICAgICAgICAgICBpZihwcm9qZWN0U3Vic2NyaXB0aW9uLnBhY2thZ2VOYW1lID09PSAnRnJlZScgJiYgcHJvamVjdFN1YnNjcmlwdGlvbi5udW1PZkJ1aWxkaW5nc1JlbWFpbmluZyA9PT0gMCkge1xyXG4gICAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24uYWRkQnVpbGRpbmdEaXNhYmxlPXRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBhY3RpdmF0aW9uX2RhdGUgPSBuZXcgRGF0ZShyZXN1bHRbMF0uc3Vic2NyaXB0aW9uLmFjdGl2YXRpb25EYXRlKTtcclxuICAgICAgICAgICAgbGV0IGV4cGlyeURhdGUgPSBuZXcgRGF0ZShyZXN1bHRbMF0uc3Vic2NyaXB0aW9uLmFjdGl2YXRpb25EYXRlKTtcclxuICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5leHBpcnlEYXRlID0gbmV3IERhdGUoZXhwaXJ5RGF0ZS5zZXREYXRlKGFjdGl2YXRpb25fZGF0ZS5nZXREYXRlKCkgKyByZXN1bHRbMF0uc3Vic2NyaXB0aW9uLnZhbGlkaXR5KSk7XHJcblxyXG4gICAgICAgICAgICAvL2V4cGlyeSBkYXRlIGZvciBwcm9qZWN0IHN1YnNjcmlwdGlvblxyXG4gICAgICAgICAgICBsZXQgY3VycmVudF9kYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgdmFyIG5ld0V4aXByeURhdGUgPSBuZXcgRGF0ZShwcm9qZWN0U3Vic2NyaXB0aW9uLmV4cGlyeURhdGUpO1xyXG4gICAgICAgICAgICBuZXdFeGlwcnlEYXRlLnNldERhdGUocHJvamVjdFN1YnNjcmlwdGlvbi5leHBpcnlEYXRlLmdldERhdGUoKSArIDMwKTtcclxuICAgICAgICAgICAgbGV0IG5vT2ZEYXlzID0gIHRoaXMuZGF5c2RpZmZlcmVuY2UobmV3RXhpcHJ5RGF0ZSwgIGN1cnJlbnRfZGF0ZSk7XHJcblxyXG4gICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLm51bU9mRGF5c1RvRXhwaXJlID0gdGhpcy5kYXlzZGlmZmVyZW5jZShwcm9qZWN0U3Vic2NyaXB0aW9uLmV4cGlyeURhdGUsIGN1cnJlbnRfZGF0ZSk7XHJcblxyXG4gICAgICAgICAgICBpZihwcm9qZWN0U3Vic2NyaXB0aW9uLm51bU9mRGF5c1RvRXhwaXJlIDwgMzAgJiYgcHJvamVjdFN1YnNjcmlwdGlvbi5udW1PZkRheXNUb0V4cGlyZSA+MCkge1xyXG4gICAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24ud2FybmluZ01lc3NhZ2UgPVxyXG4gICAgICAgICAgICAgICAgJ0V4cGlyaW5nIGluICcgKyAgTWF0aC5yb3VuZChwcm9qZWN0U3Vic2NyaXB0aW9uLm51bU9mRGF5c1RvRXhwaXJlKSArICcgZGF5cy4nIDtcclxuICAgICAgICAgICAgfSBlbHNlIGlmKHByb2plY3RTdWJzY3JpcHRpb24ubnVtT2ZEYXlzVG9FeHBpcmUgPD0gMCAmJiBub09mRGF5cyA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5leHBpcnlNZXNzYWdlID0gJ1Byb2plY3QgZXhwaXJlZCwnO1xyXG4gICAgICAgICAgICB9ZWxzZSBpZihub09mRGF5cyA8IDApIHtcclxuICAgICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLmFjdGl2ZVN0YXR1cyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHByb2plY3RTdWJzY3JpcHRpb24pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZVN1YnNjcmlwdGlvbih1c2VyIDogVXNlciwgcHJvamVjdElkOiBzdHJpbmcsIHBhY2thZ2VOYW1lOiBzdHJpbmcsY29zdEZvckJ1aWxkaW5nUHVyY2hhc2VkOmFueSxudW1iZXJPZkJ1aWxkaW5nc1B1cmNoYXNlZDphbnksIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsZXQgcXVlcnkgPSBbXHJcbiAgICAgIHskbWF0Y2g6IHsnX2lkJzpPYmplY3RJZCh1c2VyLl9pZCl9fSxcclxuICAgICAgeyAkcHJvamVjdCA6IHsnc3Vic2NyaXB0aW9uJzoxfX0sXHJcbiAgICAgIHsgJHVud2luZDogJyRzdWJzY3JpcHRpb24nfSxcclxuICAgICAgeyAkbWF0Y2g6IHsnc3Vic2NyaXB0aW9uLnByb2plY3RJZCcgOiBPYmplY3RJZChwcm9qZWN0SWQpfX1cclxuICAgIF07XHJcbiAgIHRoaXMudXNlclJlcG9zaXRvcnkuYWdncmVnYXRlKHF1ZXJ5LCAoZXJyb3IscmVzdWx0KSA9PiB7XHJcbiAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgfSBlbHNlIHtcclxuICAgICAgIGxldCBzdWJzY3JpcHRpb24gPSByZXN1bHRbMF0uc3Vic2NyaXB0aW9uO1xyXG4gICAgICAgdGhpcy51cGRhdGVQYWNrYWdlKHVzZXIsIHN1YnNjcmlwdGlvbiwgcGFja2FnZU5hbWUsY29zdEZvckJ1aWxkaW5nUHVyY2hhc2VkLG51bWJlck9mQnVpbGRpbmdzUHVyY2hhc2VkLHByb2plY3RJZCwoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICBsZXQgZXJyb3IgPSBuZXcgRXJyb3IoKTtcclxuICAgICAgICAgICBlcnJvci5tZXNzYWdlID0gbWVzc2FnZXMuTVNHX0VSUk9SX1dISUxFX0NPTlRBQ1RJTkc7XHJcbiAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgIGlmKHBhY2thZ2VOYW1lID09PSBjb25zdGFudHMuUkVORVdfUFJPSkVDVCkge1xyXG4gICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IG1lc3NhZ2VzLk1TR19TVUNDRVNTX1BST0pFQ1RfUkVORVd9KTtcclxuICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6ICdzdWNjZXNzJ30pO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgfVxyXG4gICAgICAgfSk7XHJcbiAgICAgfVxyXG4gICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZVBhY2thZ2UodXNlcjogVXNlciwgc3Vic2NyaXB0aW9uOiBhbnksIHBhY2thZ2VOYW1lOiBzdHJpbmcsY29zdEZvckJ1aWxkaW5nUHVyY2hhc2VkOmFueSxudW1iZXJPZkJ1aWxkaW5nc1B1cmNoYXNlZDphbnksIHByb2plY3RJZDpzdHJpbmcsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsZXQgc3ViU2NyaXB0aW9uU2VydmljZSA9IG5ldyBTdWJzY3JpcHRpb25TZXJ2aWNlKCk7XHJcbiAgICBzd2l0Y2ggKHBhY2thZ2VOYW1lKSB7XHJcbiAgICAgIGNhc2UgJ1ByZW1pdW0nOlxyXG4gICAgICB7XHJcbiAgICAgICAgc3ViU2NyaXB0aW9uU2VydmljZS5nZXRTdWJzY3JpcHRpb25QYWNrYWdlQnlOYW1lKCdQcmVtaXVtJywnQmFzZVBhY2thZ2UnLFxyXG4gICAgICAgICAgKGVycm9yOiBhbnksIHN1YnNjcmlwdGlvblBhY2thZ2U6IEFycmF5PFN1YnNjcmlwdGlvblBhY2thZ2U+KSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsbnVsbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHN1YnNjcmlwdGlvblBhY2thZ2VbMF07XHJcbiAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLm51bU9mQnVpbGRpbmdzID0gcmVzdWx0LmJhc2VQYWNrYWdlLm51bU9mQnVpbGRpbmdzO1xyXG4gICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi5udW1PZlByb2plY3RzID0gcmVzdWx0LmJhc2VQYWNrYWdlLm51bU9mUHJvamVjdHM7XHJcbiAgICAgICAgICAgICAgbGV0IG5vT2ZEYXlzVG9FeHBpcnkgPSB0aGlzLmNhbGN1bGF0ZVZhbGlkaXR5KHN1YnNjcmlwdGlvbik7XHJcbiAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLnZhbGlkaXR5ID0gbm9PZkRheXNUb0V4cGlyeSArIHJlc3VsdC5iYXNlUGFja2FnZS52YWxpZGl0eTtcclxuICAgICAgICAgICAgICByZXN1bHQuYmFzZVBhY2thZ2UuY29zdCA9IGNvc3RGb3JCdWlsZGluZ1B1cmNoYXNlZDtcclxuICAgICAgICAgICAgICBzdWJzY3JpcHRpb24ucHVyY2hhc2VkLnB1c2gocmVzdWx0LmJhc2VQYWNrYWdlKTtcclxuICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVN1YnNjcmlwdGlvblBhY2thZ2UodXNlci5faWQsIHByb2plY3RJZCxzdWJzY3JpcHRpb24sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6ICdzdWNjZXNzJ30pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgY2FzZSAnUmVuZXdQcm9qZWN0JzpcclxuICAgICAge1xyXG4gICAgICAgIHN1YlNjcmlwdGlvblNlcnZpY2UuZ2V0U3Vic2NyaXB0aW9uUGFja2FnZUJ5TmFtZSgnUmVuZXdQcm9qZWN0JywnYWRkT25QYWNrYWdlJyxcclxuICAgICAgICAgIChlcnJvcjogYW55LCBzdWJzY3JpcHRpb25QYWNrYWdlOiBBcnJheTxTdWJzY3JpcHRpb25QYWNrYWdlPikgPT4ge1xyXG4gICAgICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLG51bGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGxldCByZXN1bHQgPSBzdWJzY3JpcHRpb25QYWNrYWdlWzBdO1xyXG4gICAgICAgICAgICAgIGxldCBub09mRGF5c1RvRXhwaXJ5ID0gdGhpcy5jYWxjdWxhdGVWYWxpZGl0eShzdWJzY3JpcHRpb24pO1xyXG4gICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi52YWxpZGl0eSA9IG5vT2ZEYXlzVG9FeHBpcnkgKyByZXN1bHQuYWRkT25QYWNrYWdlLnZhbGlkaXR5O1xyXG4gICAgICAgICAgICAgIHJlc3VsdC5hZGRPblBhY2thZ2UuY29zdCA9IGNvc3RGb3JCdWlsZGluZ1B1cmNoYXNlZDtcclxuICAgICAgICAgICAgICBzdWJzY3JpcHRpb24ucHVyY2hhc2VkLnB1c2gocmVzdWx0LmFkZE9uUGFja2FnZSk7XHJcbiAgICAgICAgICAgICAgdGhpcy51cGRhdGVTdWJzY3JpcHRpb25QYWNrYWdlKHVzZXIuX2lkLHByb2plY3RJZCwgc3Vic2NyaXB0aW9uLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiAnUHJvamVjdCBSZW5ld2VkIHN1Y2Nlc3NmdWxseSd9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNhc2UgJ0FkZF9idWlsZGluZyc6XHJcbiAgICAgIHtcclxuICAgICAgICBzdWJTY3JpcHRpb25TZXJ2aWNlLmdldFN1YnNjcmlwdGlvblBhY2thZ2VCeU5hbWUoJ0FkZF9idWlsZGluZycsJ2FkZE9uUGFja2FnZScsXHJcbiAgICAgICAgICAoZXJyb3I6IGFueSwgc3Vic2NyaXB0aW9uUGFja2FnZTogQXJyYXk8U3Vic2NyaXB0aW9uUGFja2FnZT4pID0+IHtcclxuICAgICAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvcixudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBsZXQgcHJvamVjdEJ1aWxkaW5nc0xpbWl0ID0gc3Vic2NyaXB0aW9uLm51bU9mQnVpbGRpbmdzICsgbnVtYmVyT2ZCdWlsZGluZ3NQdXJjaGFzZWQ7XHJcbiAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHN1YnNjcmlwdGlvblBhY2thZ2VbMF07XHJcbiAgICAgICAgICAgICAgICByZXN1bHQuYWRkT25QYWNrYWdlLm51bU9mQnVpbGRpbmdzID0gbnVtYmVyT2ZCdWlsZGluZ3NQdXJjaGFzZWQ7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQuYWRkT25QYWNrYWdlLmNvc3QgPSBjb3N0Rm9yQnVpbGRpbmdQdXJjaGFzZWQ7XHJcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24ubnVtT2ZCdWlsZGluZ3MgPSBzdWJzY3JpcHRpb24ubnVtT2ZCdWlsZGluZ3MgKyByZXN1bHQuYWRkT25QYWNrYWdlLm51bU9mQnVpbGRpbmdzO1xyXG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLnB1cmNoYXNlZC5wdXNoKHJlc3VsdC5hZGRPblBhY2thZ2UpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVTdWJzY3JpcHRpb25QYWNrYWdlKHVzZXIuX2lkLCBwcm9qZWN0SWQsc3Vic2NyaXB0aW9uLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6ICdzdWNjZXNzJ30pO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlU3Vic2NyaXB0aW9uUGFja2FnZSggdXNlcklkOiBhbnksIHByb2plY3RJZDpzdHJpbmcsdXBkYXRlZFN1YnNjcmlwdGlvbjogYW55LCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xyXG4gICAgbGV0IHByb2plY3Rpb24gPSB7c3Vic2NyaXB0aW9uOiAxfTtcclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkuZmluZEJ5SWRXaXRoUHJvamVjdGlvbih1c2VySWQscHJvamVjdGlvbiwoZXJyb3IscmVzdWx0KT0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBzdWJTY3JpcHRpb25BcnJheSA9IHJlc3VsdC5zdWJzY3JpcHRpb247XHJcbiAgICAgICAgZm9yIChsZXQgc3Vic2NyaXB0aW9uSW5kZXggPTA7IHN1YnNjcmlwdGlvbkluZGV4PCBzdWJTY3JpcHRpb25BcnJheS5sZW5ndGg7IHN1YnNjcmlwdGlvbkluZGV4KyspIHtcclxuICAgICAgICAgIGlmIChzdWJTY3JpcHRpb25BcnJheVtzdWJzY3JpcHRpb25JbmRleF0ucHJvamVjdElkLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICBpZiAoc3ViU2NyaXB0aW9uQXJyYXlbc3Vic2NyaXB0aW9uSW5kZXhdLnByb2plY3RJZFswXS5lcXVhbHMocHJvamVjdElkKSkge1xyXG4gICAgICAgICAgICAgIHN1YlNjcmlwdGlvbkFycmF5W3N1YnNjcmlwdGlvbkluZGV4XSA9IHVwZGF0ZWRTdWJzY3JpcHRpb247XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHF1ZXJ5ID0geydfaWQnOiB1c2VySWR9O1xyXG4gICAgICAgIGxldCBuZXdEYXRhID0geyRzZXQ6IHsnc3Vic2NyaXB0aW9uJzogc3ViU2NyaXB0aW9uQXJyYXl9fTtcclxuICAgICAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIG5ld0RhdGEsIHtuZXc6IHRydWV9LCAoZXJyLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6J3N1Y2Nlc3MnfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICB9XHJcblxyXG4gIGNhbGN1bGF0ZVZhbGlkaXR5KHN1YnNjcmlwdGlvbjogYW55KSB7XHJcbiAgICBsZXQgYWN0aXZhdGlvbkRhdGUgPSBuZXcgRGF0ZShzdWJzY3JpcHRpb24uYWN0aXZhdGlvbkRhdGUpO1xyXG4gICAgbGV0IGV4cGlyeURhdGUgPSBuZXcgRGF0ZShzdWJzY3JpcHRpb24uYWN0aXZhdGlvbkRhdGUpO1xyXG4gICAgbGV0IHByb2plY3RFeHBpcnlEYXRlID0gbmV3IERhdGUoZXhwaXJ5RGF0ZS5zZXREYXRlKGFjdGl2YXRpb25EYXRlLmdldERhdGUoKSArIHN1YnNjcmlwdGlvbi52YWxpZGl0eSkpO1xyXG4gICAgbGV0IGN1cnJlbnRfZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICBsZXQgZGF5cyA9IHRoaXMuZGF5c2RpZmZlcmVuY2UocHJvamVjdEV4cGlyeURhdGUsY3VycmVudF9kYXRlKTtcclxuICAgIHJldHVybiBkYXlzO1xyXG4gIH1cclxuXHJcbiAgc2VuZFByb2plY3RFeHBpcnlXYXJuaW5nTWFpbHMoY2FsbGJhY2s6KGVycm9yIDogYW55LCByZXN1bHQgOmFueSk9PnZvaWQpIHtcclxuICAgIGxvZ2dlci5kZWJ1Zygnc2VuZFByb2plY3RFeHBpcnlXYXJuaW5nTWFpbHMgaXMgYmVlbiBoaXQnKTtcclxuICAgIGxldCBxdWVyeSA9IFtcclxuICAgICAgeyAkcHJvamVjdCA6IHsgJ3N1YnNjcmlwdGlvbicgOiAxLCAnZmlyc3RfbmFtZScgOiAxLCAnZW1haWwnIDogMSB9fSxcclxuICAgICAgeyAkdW53aW5kIDogJyRzdWJzY3JpcHRpb24nIH0sXHJcbiAgICAgIHsgJHVud2luZCA6ICckc3Vic2NyaXB0aW9uLnByb2plY3RJZCcgfVxyXG4gICAgXTtcclxuXHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmFnZ3JlZ2F0ZShxdWVyeSwgKGVycm9yLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICBpZihlcnJvcikge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcignc2VuZFByb2plY3RFeHBpcnlXYXJuaW5nTWFpbHMgZXJyb3IgOiAnK0pTT04uc3RyaW5naWZ5KGVycm9yKSk7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxvZ2dlci5kZWJ1Zygnc2VuZFByb2plY3RFeHBpcnlXYXJuaW5nTWFpbHMgc3VjZXNzJyk7XHJcbiAgICAgICAgbGV0IHVzZXJMaXN0ID0gbmV3IEFycmF5PFByb2plY3RTdWJjcmlwdGlvbj4oKTtcclxuICAgICAgICBsZXQgdXNlclN1YnNjcmlwdGlvblByb21pc2VBcnJheSA9W107XHJcblxyXG4gICAgICAgIGZvcihsZXQgdXNlciBvZiByZXNwb25zZSkge1xyXG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCdnZXRpbmcgYWxsIHVzZXIgZGF0YSBmb3Igc2VuZGluZyBtYWlsIHRvIHVzZXJzLicpO1xyXG4gICAgICAgICAgbGV0IHZhbGlkaXR5RGF5cyA9IHRoaXMuY2FsY3VsYXRlVmFsaWRpdHkodXNlci5zdWJzY3JpcHRpb24pO1xyXG4gICAgICAgICAgbGV0IHZhbGRpdHlEYXlzVmFsaWRhdGlvbiA9IGNvbmZpZy5nZXQoJ2Nyb25Kb2JNYWlsTm90aWZpY2F0aW9uVmFsaWRpdHlEYXlzJyk7XHJcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ3ZhbGlkaXR5RGF5cyA6ICcrdmFsaWRpdHlEYXlzKTtcclxuICAgICAgICAgIGlmKHZhbGRpdHlEYXlzVmFsaWRhdGlvbi5pbmRleE9mKHZhbGlkaXR5RGF5cykgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnY2FsbGluZyBwcm9taXNlJyk7XHJcbiAgICAgICAgICAgIGxldCBwcm9taXNlT2JqZWN0ID0gdGhpcy5nZXRQcm9qZWN0RGF0YUJ5SWQodXNlcik7XHJcbiAgICAgICAgICAgIHVzZXJTdWJzY3JpcHRpb25Qcm9taXNlQXJyYXkucHVzaChwcm9taXNlT2JqZWN0KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnaW52YWxpZCB2YWxpZGl0eURheXMgOiAnK3ZhbGlkaXR5RGF5cyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih1c2VyU3Vic2NyaXB0aW9uUHJvbWlzZUFycmF5Lmxlbmd0aCAhPT0gMCkge1xyXG5cclxuICAgICAgICAgIENDUHJvbWlzZS5hbGwodXNlclN1YnNjcmlwdGlvblByb21pc2VBcnJheSkudGhlbihmdW5jdGlvbihkYXRhOiBBcnJheTxhbnk+KSB7XHJcblxyXG4gICAgICAgICAgICBsb2dnZXIuZGVidWcoJ2RhdGEgcmVjaWV2ZWQgZm9yIGFsbCB1c2VyczogJytKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbiAgICAgICAgICAgIGxldCBzZW5kTWFpbFByb21pc2VBcnJheSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgZm9yKGxldCB1c2VyIG9mIGRhdGEpIHtcclxuICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoJ0NhbGxpbmcgc2VuZE1haWxGb3JQcm9qZWN0RXhwaXJ5VG9Vc2VyIGZvciB1c2VyIDogJytKU09OLnN0cmluZ2lmeSh1c2VyLmZpcnN0X25hbWUpKTtcclxuICAgICAgICAgICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgICAgICAgICBsZXQgc2VuZE1haWxQcm9taXNlID0gdXNlclNlcnZpY2Uuc2VuZE1haWxGb3JQcm9qZWN0RXhwaXJ5VG9Vc2VyKHVzZXIpO1xyXG4gICAgICAgICAgICAgIHNlbmRNYWlsUHJvbWlzZUFycmF5LnB1c2goc2VuZE1haWxQcm9taXNlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgQ0NQcm9taXNlLmFsbChzZW5kTWFpbFByb21pc2VBcnJheSkudGhlbihmdW5jdGlvbihtYWlsU2VudERhdGE6IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoJ21haWxTZW50RGF0YSBmb3IgYWxsIHVzZXJzOiAnK0pTT04uc3RyaW5naWZ5KG1haWxTZW50RGF0YSkpO1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHsgJ2RhdGEnIDogJ01haWwgc2VudCBzdWNjZXNzZnVsbHkgdG8gdXNlcnMuJyB9KTtcclxuICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZTphbnkpIHtcclxuICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoJ1Byb21pc2UgZmFpbGVkIGZvciBnZXR0aW5nIG1haWxTZW50RGF0YSAhIDonICtKU09OLnN0cmluZ2lmeShlLm1lc3NhZ2UpKTtcclxuICAgICAgICAgICAgICBDQ1Byb21pc2UucmVqZWN0KGUubWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGU6YW55KSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcignUHJvbWlzZSBmYWlsZWQgZm9yIHNlbmQgbWFpbCBub3RpZmljYXRpb24gISA6JyArSlNPTi5zdHJpbmdpZnkoZS5tZXNzYWdlKSk7XHJcbiAgICAgICAgICAgIENDUHJvbWlzZS5yZWplY3QoZS5tZXNzYWdlKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuaW5mbygnTm8gYW55IHByb2plY3QgaXMgZXhwaXJlZC4nKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0UHJvamVjdERhdGFCeUlkKHVzZXI6IGFueSkge1xyXG5cclxuICAgIHJldHVybiBuZXcgQ0NQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlOiBhbnksIHJlamVjdDogYW55KSB7XHJcblxyXG4gICAgICBsb2dnZXIuZGVidWcoJ2dldGluZyBhbGwgdXNlciBkYXRhIGZvciBzZW5kaW5nIG1haWwgdG8gdXNlcnMuJyk7XHJcblxyXG4gICAgICBsZXQgcHJvamVjdFN1YnNjcmlwdGlvbiA9IG5ldyBQcm9qZWN0U3ViY3JpcHRpb24oKTtcclxuICAgICAgbGV0IHByb2plY3Rpb24gPSB7ICduYW1lJyA6IDEgfTtcclxuICAgICAgbGV0IHByb2plY3RSZXBvc2l0b3J5ID0gbmV3IFByb2plY3RSZXBvc2l0b3J5KCk7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG5cclxuICAgICAgcHJvamVjdFJlcG9zaXRvcnkuZmluZEJ5SWRXaXRoUHJvamVjdGlvbih1c2VyLnN1YnNjcmlwdGlvbi5wcm9qZWN0SWQsIHByb2plY3Rpb24sIChlcnJvciAsIHJlc3ApID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbG9nZ2VyLmVycm9yKCdFcnJvciBpbiBmZXRjaGluZyBVc2VyIGRhdGEnK0pTT04uc3RyaW5naWZ5KGVycm9yKSk7XHJcbiAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ2dvdCBQcm9qZWN0U3Vic2NyaXB0aW9uIGZvciB1c2VyICcrIHVzZXIuX2lkKTtcclxuICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24udXNlcklkID0gdXNlci5faWQ7XHJcbiAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLnVzZXJFbWFpbCA9IHVzZXIuZW1haWw7XHJcbiAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLmZpcnN0X25hbWUgPSB1c2VyLmZpcnN0X25hbWU7XHJcbiAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLnZhbGlkaXR5RGF5cyA9IHVzZXIuc3Vic2NyaXB0aW9uLnZhbGlkaXR5O1xyXG4gICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5wcm9qZWN0RXhwaXJ5RGF0ZSA9IHVzZXJTZXJ2aWNlLmNhbGN1bGF0ZUV4cGlyeURhdGUodXNlci5zdWJzY3JpcHRpb24pO1xyXG4gICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5wcm9qZWN0TmFtZSA9IHJlc3AubmFtZTtcclxuICAgICAgICAgIHJlc29sdmUocHJvamVjdFN1YnNjcmlwdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbiAoZTogYW55KSB7XHJcbiAgICAgIGxvZ2dlci5lcnJvcignUHJvbWlzZSBmYWlsZWQgZm9yIGluZGl2aWR1YWwgY3JlYXRlUHJvbWlzZUZvckdldFByb2plY3RCeUlkICEgRXJyb3I6ICcgKyBKU09OLnN0cmluZ2lmeShlLm1lc3NhZ2UpKTtcclxuICAgICAgQ0NQcm9taXNlLnJlamVjdChlLm1lc3NhZ2UpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZW5kTWFpbEZvclByb2plY3RFeHBpcnlUb1VzZXIodXNlcjogYW55KSB7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBDQ1Byb21pc2UoZnVuY3Rpb24gKHJlc29sdmU6IGFueSwgcmVqZWN0OiBhbnkpIHtcclxuXHJcbiAgICAgIGxldCBtYWlsU2VydmljZSA9IG5ldyBTZW5kTWFpbFNlcnZpY2UoKTtcclxuXHJcbiAgICAgIGxldCBhdXRoID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgICBsZXQgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpO1xyXG4gICAgICBsZXQgaG9zdCA9IGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpO1xyXG4gICAgICBsZXQgaHRtbFRlbXBsYXRlID0gJ3Byb2plY3QtZXhwaXJ5LW5vdGlmaWNhdGlvbi1tYWlsLmh0bWwnO1xyXG5cclxuICAgICAgbGV0IGRhdGE6TWFwPHN0cmluZyxzdHJpbmc+PSBuZXcgTWFwKFtcclxuICAgICAgICBbJyRhcHBsaWNhdGlvbkxpbmskJyxjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLmhvc3QnKV0sIFsnJGZpcnN0X25hbWUkJyx1c2VyLmZpcnN0X25hbWVdLFxyXG4gICAgICAgIFsnJGV4cGlyeV9kYXRlJCcsdXNlci5wcm9qZWN0RXhwaXJ5RGF0ZV0sIFsnJHN1YnNjcmlwdGlvbl9saW5rJCcsY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5ob3N0JyldLFxyXG4gICAgICAgIFsnJGFwcF9uYW1lJCcsJ0J1aWxkSW5mbyAtIENvc3QgQ29udHJvbCddXSk7XHJcblxyXG4gICAgICBsZXQgYXR0YWNobWVudCA9IE1haWxBdHRhY2htZW50cy5BdHRhY2htZW50QXJyYXk7XHJcbiAgICAgIG1haWxTZXJ2aWNlLnNlbmQoIHVzZXIudXNlckVtYWlsLCBNZXNzYWdlcy5QUk9KRUNUX0VYUElSWV9XQVJOSU5HLCBodG1sVGVtcGxhdGUsIGRhdGEsYXR0YWNobWVudCxcclxuICAgICAgICAoZXJyOiBhbnksIHJlc3VsdDogYW55KSA9PiB7XHJcbiAgICAgICAgICBpZihlcnIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBzZW5kIG1haWwgdG8gdXNlciA6ICcrdXNlci51c2VyRW1haWwpO1xyXG4gICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdNYWlsIHNlbnQgc3VjY2Vzc2Z1bGx5IHRvIHVzZXIgOiAnK3VzZXIudXNlckVtYWlsKTtcclxuICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlOiBhbnkpIHtcclxuICAgICAgbG9nZ2VyLmVycm9yKCdQcm9taXNlIGZhaWxlZCBmb3IgaW5kaXZpZHVhbCBzZW5kTWFpbEZvclByb2plY3RFeHBpcnlUb1VzZXIgISBFcnJvcjogJyArIEpTT04uc3RyaW5naWZ5KGUubWVzc2FnZSkpO1xyXG4gICAgICBDQ1Byb21pc2UucmVqZWN0KGUubWVzc2FnZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNhbGN1bGF0ZUV4cGlyeURhdGUoc3Vic2NyaXB0aW9uIDogYW55KSB7XHJcbiAgICBsZXQgYWN0aXZhdGlvbkRhdGUgPSBuZXcgRGF0ZShzdWJzY3JpcHRpb24uYWN0aXZhdGlvbkRhdGUpO1xyXG4gICAgbGV0IGV4cGlyeURhdGUgPSBuZXcgRGF0ZShzdWJzY3JpcHRpb24uYWN0aXZhdGlvbkRhdGUpO1xyXG4gICAgbGV0IHByb2plY3RFeHBpcnlEYXRlID0gbmV3IERhdGUoZXhwaXJ5RGF0ZS5zZXREYXRlKGFjdGl2YXRpb25EYXRlLmdldERhdGUoKSArIHN1YnNjcmlwdGlvbi52YWxpZGl0eSkpO1xyXG4gICAgcmV0dXJuIHByb2plY3RFeHBpcnlEYXRlO1xyXG4gIH1cclxufVxyXG5cclxuT2JqZWN0LnNlYWwoVXNlclNlcnZpY2UpO1xyXG5leHBvcnQgPSBVc2VyU2VydmljZTtcclxuIl19
