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
                callback(err, res);
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
                    if (err) {
                        logger.error(JSON.stringify(err));
                    }
                    logger.debug('Sending Mail : ' + JSON.stringify(result));
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
                ['$expiry_date$', user.projectExpiryDate], ['$subscription_link$', config.get('application.mail.host') + 'signin'],
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvVXNlclNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHdFQUEyRTtBQUMzRSxrREFBcUQ7QUFDckQsMERBQTZEO0FBQzdELHVCQUF5QjtBQUN6QixtQ0FBcUM7QUFDckMsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7QUFFdkMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQiw2Q0FBZ0Q7QUFDaEQsOEVBQWlGO0FBQ2pGLHFEQUF3RDtBQUN4RCx1REFBMEQ7QUFFMUQsK0JBQWtDO0FBQ2xDLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzlDLHVFQUFvRTtBQUdwRSwyRkFBOEY7QUFHOUYsa0hBQXFIO0FBQ3JILG9HQUF1RztBQUN2RyxzSUFBeUk7QUFDekksbUVBQXVFO0FBQ3ZFLHFFQUF5RTtBQUN6RSx5R0FBNEc7QUFDNUcsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDdEQsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUM7QUFFOUM7SUFRRTtRQUpBLDhCQUF5QixHQUFTLEtBQUssQ0FBQztRQUt0QyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksaUJBQWlCLEVBQUUsQ0FBQztRQUNqRCxJQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUM7SUFD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QUFJLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDM0QsSUFBSSxVQUFVLEdBQUcsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3ZELElBQUksaUJBQWlCLEdBQUcsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDdkcsTUFBTSxDQUFDLGlCQUFpQixDQUFDO0lBQzNCLENBQUM7SUFDSCxrQkFBQztBQUFELENBL3BDQSxBQStwQ0MsSUFBQTtBQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDekIsaUJBQVMsV0FBVyxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvc2VydmljZXMvVXNlclNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVXNlclJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvVXNlclJlcG9zaXRvcnknKTtcclxuaW1wb3J0IFNlbmRNYWlsU2VydmljZSA9IHJlcXVpcmUoJy4vbWFpbGVyLnNlcnZpY2UnKTtcclxuaW1wb3J0IFNlbmRNZXNzYWdlU2VydmljZSA9IHJlcXVpcmUoJy4vc2VuZG1lc3NhZ2Uuc2VydmljZScpO1xyXG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XHJcbmltcG9ydCAqIGFzIG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxubGV0IE9iamVjdElkID0gbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQ7XHJcbmltcG9ydCB7IFNlbnRNZXNzYWdlSW5mbyB9IGZyb20gJ25vZGVtYWlsZXInO1xyXG5sZXQgY29uZmlnID0gcmVxdWlyZSgnY29uZmlnJyk7XHJcbmxldCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xyXG5pbXBvcnQgTWVzc2FnZXMgPSByZXF1aXJlKCcuLi9zaGFyZWQvbWVzc2FnZXMnKTtcclxuaW1wb3J0IEF1dGhJbnRlcmNlcHRvciA9IHJlcXVpcmUoJy4uLy4uL2ZyYW1ld29yay9pbnRlcmNlcHRvci9hdXRoLmludGVyY2VwdG9yJyk7XHJcbmltcG9ydCBQcm9qZWN0QXNzZXQgPSByZXF1aXJlKCcuLi9zaGFyZWQvcHJvamVjdGFzc2V0Jyk7XHJcbmltcG9ydCBNYWlsQXR0YWNobWVudHMgPSByZXF1aXJlKCcuLi9zaGFyZWQvc2hhcmVkYXJyYXknKTtcclxuaW1wb3J0IHsgYXNFbGVtZW50RGF0YSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUvc3JjL3ZpZXcnO1xyXG5pbXBvcnQgYmNyeXB0ID0gcmVxdWlyZSgnYmNyeXB0Jyk7XHJcbmxldCBsb2c0anMgPSByZXF1aXJlKCdsb2c0anMnKTtcclxubGV0IGxvZ2dlciA9IGxvZzRqcy5nZXRMb2dnZXIoJ1VzZXIgc2VydmljZScpO1xyXG5pbXBvcnQgeyBNYWlsQ2hpbXBNYWlsZXJTZXJ2aWNlIH0gZnJvbSAnLi9tYWlsY2hpbXAtbWFpbGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgVXNlck1vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9Vc2VyTW9kZWwnKTtcclxuaW1wb3J0IFVzZXIgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vbmdvb3NlL3VzZXInKTtcclxuaW1wb3J0IFN1YnNjcmlwdGlvblNlcnZpY2UgPSByZXF1aXJlKCcuLi8uLi9hcHBsaWNhdGlvblByb2plY3Qvc2VydmljZXMvU3Vic2NyaXB0aW9uU2VydmljZScpO1xyXG5pbXBvcnQgU3Vic2NyaXB0aW9uUGFja2FnZSA9IHJlcXVpcmUoJy4uLy4uL2FwcGxpY2F0aW9uUHJvamVjdC9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvU3Vic2NyaXB0aW9uL1N1YnNjcmlwdGlvblBhY2thZ2UnKTtcclxuaW1wb3J0IEJhc2VTdWJzY3JpcHRpb25QYWNrYWdlID0gcmVxdWlyZSgnLi4vLi4vYXBwbGljYXRpb25Qcm9qZWN0L2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9TdWJzY3JpcHRpb24vQmFzZVN1YnNjcmlwdGlvblBhY2thZ2UnKTtcclxuaW1wb3J0IFVzZXJTdWJzY3JpcHRpb24gPSByZXF1aXJlKCcuLi8uLi9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L1N1YnNjcmlwdGlvbi9Vc2VyU3Vic2NyaXB0aW9uJyk7XHJcbmltcG9ydCBQcm9qZWN0UmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uLy4uL2FwcGxpY2F0aW9uUHJvamVjdC9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvUHJvamVjdFJlcG9zaXRvcnknKTtcclxuaW1wb3J0IFByb2plY3RTdWJzY3JpcHRpb25EZXRhaWxzID0gcmVxdWlyZSgnLi4vLi4vYXBwbGljYXRpb25Qcm9qZWN0L2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9TdWJzY3JpcHRpb24vUHJvamVjdFN1YnNjcmlwdGlvbkRldGFpbHMnKTtcclxuaW1wb3J0IG1lc3NhZ2VzICA9IHJlcXVpcmUoJy4uLy4uL2FwcGxpY2F0aW9uUHJvamVjdC9zaGFyZWQvbWVzc2FnZXMnKTtcclxuaW1wb3J0IGNvbnN0YW50cyAgPSByZXF1aXJlKCcuLi8uLi9hcHBsaWNhdGlvblByb2plY3Qvc2hhcmVkL2NvbnN0YW50cycpO1xyXG5pbXBvcnQgUHJvamVjdFN1YmNyaXB0aW9uID0gcmVxdWlyZSgnLi4vLi4vYXBwbGljYXRpb25Qcm9qZWN0L2RhdGFhY2Nlc3MvbW9kZWwvY29tcGFueS9Qcm9qZWN0U3ViY3JpcHRpb24nKTtcclxubGV0IENDUHJvbWlzZSA9IHJlcXVpcmUoJ3Byb21pc2UvbGliL2VzNi1leHRlbnNpb25zJyk7XHJcbmxldCBsb2c0anMgPSByZXF1aXJlKCdsb2c0anMnKTtcclxubGV0IGxvZ2dlciA9IGxvZzRqcy5nZXRMb2dnZXIoJ1VzZXIgc2VydmljZScpO1xyXG5cclxuY2xhc3MgVXNlclNlcnZpY2Uge1xyXG4gIEFQUF9OQU1FOiBzdHJpbmc7XHJcbiAgY29tcGFueV9uYW1lOiBzdHJpbmc7XHJcbiAgbWlkX2NvbnRlbnQ6IGFueTtcclxuICBpc0FjdGl2ZUFkZEJ1aWxkaW5nQnV0dG9uOmJvb2xlYW49ZmFsc2U7XHJcbiAgcHJpdmF0ZSB1c2VyUmVwb3NpdG9yeTogVXNlclJlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSBwcm9qZWN0UmVwb3NpdG9yeSA6IFByb2plY3RSZXBvc2l0b3J5O1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkgPSBuZXcgVXNlclJlcG9zaXRvcnkoKTtcclxuICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkgPSBuZXcgUHJvamVjdFJlcG9zaXRvcnkoKTtcclxuICAgIHRoaXMuQVBQX05BTUUgPSBQcm9qZWN0QXNzZXQuQVBQX05BTUU7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVVc2VyKGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5yZXRyaWV2ZSh7J2VtYWlsJzogaXRlbS5lbWFpbH0sIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKGVyciksIG51bGwpO1xyXG4gICAgICB9IGVsc2UgaWYgKHJlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgbG9nZ2VyLmRlYnVnKCdFbWFpbCBhbHJlYWR5IGV4aXN0JytKU09OLnN0cmluZ2lmeShyZXMpKTtcclxuXHJcbiAgICAgICAgaWYgKHJlc1swXS5pc0FjdGl2YXRlZCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT04pLCBudWxsKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHJlc1swXS5pc0FjdGl2YXRlZCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0FDQ09VTlQpLCBudWxsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxvZ2dlci5kZWJ1ZygnRW1haWwgbm90IHByZXNlbnQuJytKU09OLnN0cmluZ2lmeShyZXMpKTtcclxuICAgICAgICBjb25zdCBzYWx0Um91bmRzID0gMTA7XHJcbiAgICAgICAgYmNyeXB0Lmhhc2goaXRlbS5wYXNzd29yZCwgc2FsdFJvdW5kcywgKGVycjogYW55LCBoYXNoOiBhbnkpID0+IHtcclxuICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdFcnJvciBpbiBjcmVhdGluZyBoYXNoIHBhc3N3b3JkJyk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKHtcclxuICAgICAgICAgICAgICByZWFzb246ICdFcnJvciBpbiBjcmVhdGluZyBoYXNoIHVzaW5nIGJjcnlwdCcsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogJ0Vycm9yIGluIGNyZWF0aW5nIGhhc2ggdXNpbmcgYmNyeXB0JyxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgICAgfSwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsb2dnZXIuZGVidWcoJ2NyZWF0ZWQgaGFzaCBzdWNjZXNmdWxseS4nKTtcclxuICAgICAgICAgICAgaXRlbS5wYXNzd29yZCA9IGhhc2g7XHJcbiAgICAgICAgICAgIGxldCBzdWJTY3JpcHRpb25TZXJ2aWNlID0gbmV3IFN1YnNjcmlwdGlvblNlcnZpY2UoKTtcclxuICAgICAgICAgICAgc3ViU2NyaXB0aW9uU2VydmljZS5nZXRTdWJzY3JpcHRpb25QYWNrYWdlQnlOYW1lKCdGcmVlJywnQmFzZVBhY2thZ2UnLCAoZXJyOiBhbnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcmVlU3Vic2NyaXB0aW9uOiBBcnJheTxTdWJzY3JpcHRpb25QYWNrYWdlPikgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChmcmVlU3Vic2NyaXB0aW9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnZnJlZVN1YnNjcmlwdGlvbiBsZW5ndGggID4gMCcpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hc3NpZ25GcmVlU3Vic2NyaXB0aW9uQW5kQ3JlYXRlVXNlcihpdGVtLCBmcmVlU3Vic2NyaXB0aW9uWzBdLCBjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKCdmcmVlU3Vic2NyaXB0aW9uIGxlbmd0aCAhPT0wJyk7XHJcbiAgICAgICAgICAgICAgICBzdWJTY3JpcHRpb25TZXJ2aWNlLmFkZFN1YnNjcmlwdGlvblBhY2thZ2UoY29uZmlnLmdldCgnc3Vic2NyaXB0aW9uLnBhY2thZ2UuRnJlZScpLFxyXG4gICAgICAgICAgICAgICAgICAoZXJyOiBhbnksIGZyZWVTdWJzY3JpcHRpb24pPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnYXNzaWduaW5nIGZyZWUgc3Vic2NyaXB0aW9uIGJ5IGNyZWF0aW5nIG5ldyB1c2VyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hc3NpZ25GcmVlU3Vic2NyaXB0aW9uQW5kQ3JlYXRlVXNlcihpdGVtLCBmcmVlU3Vic2NyaXB0aW9uLCBjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNoZWNrRm9yVmFsaWRTdWJzY3JpcHRpb24odXNlcmlkIDogc3RyaW5nLCBjYWxsYmFjayA6IChlcnJvciA6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuXHJcbiAgICBsZXQgcXVlcnkgPSBbXHJcbiAgICAgIHsgJG1hdGNoOiB7J19pZCc6dXNlcmlkfX0sXHJcbiAgICAgIHsgJHByb2plY3QgOiB7J3N1YnNjcmlwdGlvbic6MX19LFxyXG4gICAgICB7ICR1bndpbmQ6ICckc3Vic2NyaXB0aW9uJ31cclxuICAgIF07XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmFnZ3JlZ2F0ZShxdWVyeSAsKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCB2YWxpZFN1YnNjcmlwdGlvblBhY2thZ2U7XHJcbiAgICAgICAgaWYocmVzdWx0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIGZvcihsZXQgc3Vic2NyaXB0aW9uUGFja2FnZSBvZiByZXN1bHQpIHtcclxuICAgICAgICAgICAgaWYoc3Vic2NyaXB0aW9uUGFja2FnZS5zdWJzY3JpcHRpb24ucHJvamVjdElkLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgIHZhbGlkU3Vic2NyaXB0aW9uUGFja2FnZSA9IHN1YnNjcmlwdGlvblBhY2thZ2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgdmFsaWRTdWJzY3JpcHRpb25QYWNrYWdlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAgYXNzaWduRnJlZVN1YnNjcmlwdGlvbkFuZENyZWF0ZVVzZXIoaXRlbTogYW55LCBmcmVlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb25QYWNrYWdlLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsZXQgdXNlcjogVXNlck1vZGVsID0gaXRlbTtcclxuICAgIGxldCBzZW5kTWFpbFNlcnZpY2UgPSBuZXcgU2VuZE1haWxTZXJ2aWNlKCk7XHJcbiAgICB0aGlzLmFzc2lnbkZyZWVTdWJzY3JpcHRpb25QYWNrYWdlKHVzZXIsIGZyZWVTdWJzY3JpcHRpb24pO1xyXG4gICAgbG9nZ2VyLmRlYnVnKCdDcmVhdGluZyB1c2VyIHdpdGggbmV3IGZyZWUgdHJhaWwgc3Vic2NyaXB0aW9uIHBhY2thZ2UnKTtcclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkuY3JlYXRlKHVzZXIsIChlcnI6RXJyb3IsIHJlczphbnkpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcignRmFpbGVkIHRvIENyZWF0aW5nIHVzZXIgc3Vic2NyaXB0aW9uIHBhY2thZ2UnKTtcclxuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTl9NT0JJTEVfTlVNQkVSKSwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbG9nZ2VyLmRlYnVnKCdjcmVhdGVkIHVzZXIgc3VjY2VzZnVsbHkuJytKU09OLnN0cmluZ2lmeShyZXMpKTtcclxuICAgICAgICBjYWxsYmFjayhlcnIsIHJlcyk7XHJcbiAgICAgICAgbGV0IGF1dGggPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICAgICAgbGV0IHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZChyZXMpO1xyXG4gICAgICAgIGxldCBob3N0ID0gY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5ob3N0Jyk7XHJcbiAgICAgICAgbGV0IGxpbmsgPSBob3N0ICsgJ3NpZ25pbj9hY2Nlc3NfdG9rZW49JyArIHRva2VuICsgJyZfaWQ9JyArIHJlcy5faWQ7XHJcbiAgICAgICAgbGV0IGh0bWxUZW1wbGF0ZSA9ICd3ZWxjb21lLWFib2FyZC5odG1sJztcclxuICAgICAgICBsZXQgZGF0YTpNYXA8c3RyaW5nLHN0cmluZz49IG5ldyBNYXAoW1snJGFwcGxpY2F0aW9uTGluayQnLGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpXSxcclxuICAgICAgICAgIFsnJGZpcnN0X25hbWUkJyxyZXMuZmlyc3RfbmFtZV0sWyckbGluayQnLGxpbmtdLFsnJGFwcF9uYW1lJCcsdGhpcy5BUFBfTkFNRV1dKTtcclxuICAgICAgICBsZXQgYXR0YWNobWVudCA9IE1haWxBdHRhY2htZW50cy5XZWxjb21lQWJvYXJkQXR0YWNobWVudEFycmF5O1xyXG4gICAgICAgIGxvZ2dlci5kZWJ1Zygnc2VuZGluZyBtYWlsIHRvIG5ldyB1c2VyLicrSlNPTi5zdHJpbmdpZnkoYXR0YWNobWVudCkpO1xyXG4gICAgICAgIHNlbmRNYWlsU2VydmljZS5zZW5kKCB1c2VyLmVtYWlsLCBNZXNzYWdlcy5FTUFJTF9TVUJKRUNUX0NBTkRJREFURV9SRUdJU1RSQVRJT04sIGh0bWxUZW1wbGF0ZSwgZGF0YSxhdHRhY2htZW50LFxyXG4gICAgICAgICAgKGVycjogYW55LCByZXN1bHQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihKU09OLnN0cmluZ2lmeShlcnIpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnU2VuZGluZyBNYWlsIDogJytKU09OLnN0cmluZ2lmeShyZXN1bHQpKTtcclxuICAgICAgICAgICAgLy9jYWxsYmFjayhlcnIsIHJlc3VsdCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldFVzZXJGb3JDaGVja2luZ0J1aWxkaW5nKHVzZXJJZDpzdHJpbmcscHJvamVjdElkOnN0cmluZyx1c2VyOlVzZXIsY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IHF1ZXJ5PSBbXHJcbiAgICAgIHsgJG1hdGNoOiB7J19pZCc6dXNlcklkfX0sXHJcbiAgICAgIHsgJHByb2plY3QgOiB7J3N1YnNjcmlwdGlvbic6MX19LFxyXG4gICAgICB7ICR1bndpbmQ6ICckc3Vic2NyaXB0aW9uJ30sXHJcbiAgICAgIHsgJG1hdGNoOiB7J3N1YnNjcmlwdGlvbi5wcm9qZWN0SWQnOnByb2plY3RJZH19XHJcbiAgICBdO1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5hZ2dyZWdhdGUocXVlcnksKGVycm9yLHJlc3VsdCk9PiB7XHJcbiAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsbnVsbCk7XHJcbiAgICAgIH1lbHNlIHtcclxuICAgICAgICBpZihyZXN1bHQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgZm9yKGxldCBzdWJzY3JpcHRpb25QYWNrYWdlIG9mIHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgIGlmKHN1YnNjcmlwdGlvblBhY2thZ2UgJiYgc3Vic2NyaXB0aW9uUGFja2FnZS5zdWJzY3JpcHRpb24ucHJvamVjdElkIT09bnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHF1ZXJ5ID0ge19pZDogcHJvamVjdElkfTtcclxuICAgICAgICAgICAgICAgIGxldCBwb3B1bGF0ZSA9IHtwYXRoOiAnYnVpbGRpbmcnLCBzZWxlY3Q6IFsnbmFtZScsICdidWlsZGluZ3MnLF19O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kQW5kUG9wdWxhdGUocXVlcnksIHBvcHVsYXRlLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5vT2ZCdWlsZGluZ3M9cmVzdWx0LmJ1aWxkaW5ncy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoc3Vic2NyaXB0aW9uUGFja2FnZSAmJiBub09mQnVpbGRpbmdzIDw9IHN1YnNjcmlwdGlvblBhY2thZ2Uuc3Vic2NyaXB0aW9uLm51bU9mQnVpbGRpbmdzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQWN0aXZlQWRkQnVpbGRpbmdCdXR0b249ZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0FjdGl2ZUFkZEJ1aWxkaW5nQnV0dG9uPXRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCxyZXN1bHQpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBjYWxsYmFjayhudWxsLHtkYXRhOnRoaXMuaXNBY3RpdmVBZGRCdWlsZGluZ0J1dHRvbn0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgYXNzaWduRnJlZVN1YnNjcmlwdGlvblBhY2thZ2UodXNlcjogVXNlck1vZGVsLCBmcmVlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb25QYWNrYWdlKSB7XHJcbiAgICBsZXQgc3Vic2NyaXB0aW9uID0gbmV3IFVzZXJTdWJzY3JpcHRpb24oKTtcclxuICAgIHN1YnNjcmlwdGlvbi5hY3RpdmF0aW9uRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICBzdWJzY3JpcHRpb24ubnVtT2ZCdWlsZGluZ3MgPSBmcmVlU3Vic2NyaXB0aW9uLmJhc2VQYWNrYWdlLm51bU9mQnVpbGRpbmdzO1xyXG4gICAgc3Vic2NyaXB0aW9uLm51bU9mUHJvamVjdHMgPSBmcmVlU3Vic2NyaXB0aW9uLmJhc2VQYWNrYWdlLm51bU9mUHJvamVjdHM7XHJcbiAgICBzdWJzY3JpcHRpb24udmFsaWRpdHkgPSBmcmVlU3Vic2NyaXB0aW9uLmJhc2VQYWNrYWdlLnZhbGlkaXR5O1xyXG4gICAgc3Vic2NyaXB0aW9uLnByb2plY3RJZCA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcbiAgICBzdWJzY3JpcHRpb24ucHVyY2hhc2VkID0gbmV3IEFycmF5PEJhc2VTdWJzY3JpcHRpb25QYWNrYWdlPigpO1xyXG4gICAgc3Vic2NyaXB0aW9uLnB1cmNoYXNlZC5wdXNoKGZyZWVTdWJzY3JpcHRpb24uYmFzZVBhY2thZ2UpO1xyXG4gICAgdXNlci5zdWJzY3JpcHRpb24gPSBuZXcgQXJyYXk8VXNlclN1YnNjcmlwdGlvbj4oKTtcclxuICAgIHVzZXIuc3Vic2NyaXB0aW9uLnB1c2goc3Vic2NyaXB0aW9uKTtcclxuICB9XHJcblxyXG4gIGxvZ2luKGRhdGE6IGFueSwgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnJldHJpZXZlKHsnZW1haWwnOiBkYXRhLmVtYWlsfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2UgaWYgKHJlc3VsdC5sZW5ndGggPiAwICYmIHJlc3VsdFswXS5pc0FjdGl2YXRlZCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIGJjcnlwdC5jb21wYXJlKGRhdGEucGFzc3dvcmQsIHJlc3VsdFswXS5wYXNzd29yZCwgKGVycjogYW55LCBpc1NhbWU6IGFueSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfUkVHSVNUUkFUSU9OX1NUQVRVUyxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0NBTkRJREFURV9BQ0NPVU5ULFxyXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgIGFjdHVhbEVycm9yOiBlcnIsXHJcbiAgICAgICAgICAgICAgY29kZTogNTAwXHJcbiAgICAgICAgICAgIH0sIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLypjb25zb2xlLmxvZygnZ290IHVzZXInKTsqL1xyXG4gICAgICAgICAgICBpZiAoaXNTYW1lKSB7XHJcbiAgICAgICAgICAgICAgbGV0IGF1dGggPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICAgICAgICAgICAgbGV0IHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZChyZXN1bHRbMF0pO1xyXG4gICAgICAgICAgICAgIHZhciBkYXRhOiBhbnkgPSB7XHJcbiAgICAgICAgICAgICAgICAnc3RhdHVzJzogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgICAgICAgICAnZGF0YSc6IHtcclxuICAgICAgICAgICAgICAgICAgJ2ZpcnN0X25hbWUnOiByZXN1bHRbMF0uZmlyc3RfbmFtZSxcclxuICAgICAgICAgICAgICAgICAgJ2xhc3RfbmFtZSc6IHJlc3VsdFswXS5sYXN0X25hbWUsXHJcbiAgICAgICAgICAgICAgICAgICdjb21wYW55X25hbWUnOiByZXN1bHRbMF0uY29tcGFueV9uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAnZW1haWwnOiByZXN1bHRbMF0uZW1haWwsXHJcbiAgICAgICAgICAgICAgICAgICdfaWQnOiByZXN1bHRbMF0uX2lkLFxyXG4gICAgICAgICAgICAgICAgICAnY3VycmVudF90aGVtZSc6IHJlc3VsdFswXS5jdXJyZW50X3RoZW1lLFxyXG4gICAgICAgICAgICAgICAgICAncGljdHVyZSc6IHJlc3VsdFswXS5waWN0dXJlLFxyXG4gICAgICAgICAgICAgICAgICAnbW9iaWxlX251bWJlcic6IHJlc3VsdFswXS5tb2JpbGVfbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAnYWNjZXNzX3Rva2VuJzogdG9rZW5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRva2VuXHJcbiAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBkYXRhKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBjYWxsYmFjayh7XHJcbiAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XUk9OR19QQVNTV09SRCxcclxuICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgICAgfSwgbnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIGlmIChyZXN1bHQubGVuZ3RoID4gMCAmJiByZXN1bHRbMF0uaXNBY3RpdmF0ZWQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgY2FsbGJhY2soe1xyXG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfUkVHSVNUUkFUSU9OX1NUQVRVUyxcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQ0FORElEQVRFX0FDQ09VTlQsXHJcbiAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgIGNvZGU6IDUwMFxyXG4gICAgICAgIH0sIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKHtcclxuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9VU0VSX05PVF9GT1VORCxcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9VU0VSX05PVF9QUkVTRU5ULFxyXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICB9LG51bGwpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNlbmRPdHAocGFyYW1zOiBhbnksIHVzZXI6IGFueSwgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsZXQgRGF0YSA9IHtcclxuICAgICAgbmV3X21vYmlsZV9udW1iZXI6IHBhcmFtcy5tb2JpbGVfbnVtYmVyLFxyXG4gICAgICBvbGRfbW9iaWxlX251bWJlcjogdXNlci5tb2JpbGVfbnVtYmVyLFxyXG4gICAgICBfaWQ6IHVzZXIuX2lkXHJcbiAgICB9O1xyXG4gICAgdGhpcy5nZW5lcmF0ZU90cChEYXRhLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBpZiAoZXJyb3IgPT09IE1lc3NhZ2VzLk1TR19FUlJPUl9DSEVDS19NT0JJTEVfUFJFU0VOVCkge1xyXG4gICAgICAgICAgY2FsbGJhY2soe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRVhJU1RJTkdfVVNFUixcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTl9NT0JJTEVfTlVNQkVSLFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9LCBudWxsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChyZXN1bHQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGNhbGxiYWNrKHtcclxuICAgICAgICAgICdzdGF0dXMnOiBNZXNzYWdlcy5TVEFUVVNfU1VDQ0VTUyxcclxuICAgICAgICAgICdkYXRhJzoge1xyXG4gICAgICAgICAgICAnbWVzc2FnZSc6IE1lc3NhZ2VzLk1TR19TVUNDRVNTX09UUFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKHtcclxuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9VU0VSX05PVF9GT1VORCxcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fVVNFUl9OT1RfRk9VTkQsXHJcbiAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgIH0sIG51bGwpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdlbmVyYXRlT3RwKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkucmV0cmlldmUoeydtb2JpbGVfbnVtYmVyJzogZmllbGQubmV3X21vYmlsZV9udW1iZXIsICdpc0FjdGl2YXRlZCc6IHRydWV9LCAoZXJyLCByZXMpID0+IHtcclxuXHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgfSBlbHNlIGlmIChyZXMubGVuZ3RoID4gMCAmJiAocmVzWzBdLl9pZCkgIT09IGZpZWxkLl9pZCkge1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfUkVHSVNUUkFUSU9OX01PQklMRV9OVU1CRVIpLCBudWxsKTtcclxuICAgICAgfSBlbHNlIGlmIChyZXMubGVuZ3RoID09PSAwKSB7XHJcblxyXG4gICAgICAgIGxldCBxdWVyeSA9IHsnX2lkJzogZmllbGQuX2lkfTtcclxuICAgICAgICBsZXQgb3RwID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDk5OTk5KSArIDEwMDAwMCk7XHJcbiAgICAgICAgbGV0IHVwZGF0ZURhdGEgPSB7J21vYmlsZV9udW1iZXInOiBmaWVsZC5uZXdfbW9iaWxlX251bWJlciwgJ290cCc6IG90cH07XHJcbiAgICAgICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTl9NT0JJTEVfTlVNQkVSKSwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgRGF0YSA9IHtcclxuICAgICAgICAgICAgICBtb2JpbGVObzogZmllbGQubmV3X21vYmlsZV9udW1iZXIsXHJcbiAgICAgICAgICAgICAgb3RwOiBvdHBcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgbGV0IHNlbmRNZXNzYWdlU2VydmljZSA9IG5ldyBTZW5kTWVzc2FnZVNlcnZpY2UoKTtcclxuICAgICAgICAgICAgc2VuZE1lc3NhZ2VTZXJ2aWNlLnNlbmRNZXNzYWdlRGlyZWN0KERhdGEsIGNhbGxiYWNrKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTl9NT0JJTEVfTlVNQkVSKSwgbnVsbCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdmVyaWZ5T3RwKHBhcmFtczogYW55LCB1c2VyOmFueSwgY2FsbGJhY2s6KGVycm9yOmFueSwgcmVzdWx0OmFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IG1haWxDaGltcE1haWxlclNlcnZpY2UgPSBuZXcgTWFpbENoaW1wTWFpbGVyU2VydmljZSgpO1xyXG5cclxuICAgIGxldCBxdWVyeSA9IHsnX2lkJzogdXNlci5faWQsICdpc0FjdGl2YXRlZCc6IGZhbHNlfTtcclxuICAgIGxldCB1cGRhdGVEYXRhID0geydpc0FjdGl2YXRlZCc6IHRydWUsICdhY3RpdmF0aW9uX2RhdGUnOiBuZXcgRGF0ZSgpfTtcclxuICAgIGlmICh1c2VyLm90cCA9PT0gcGFyYW1zLm90cCkge1xyXG4gICAgICB0aGlzLmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZURhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhudWxsLHtcclxuICAgICAgICAgICAgJ3N0YXR1cyc6ICdTdWNjZXNzJyxcclxuICAgICAgICAgICAgJ2RhdGEnOiB7J21lc3NhZ2UnOiAnVXNlciBBY2NvdW50IHZlcmlmaWVkIHN1Y2Nlc3NmdWxseSd9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIG1haWxDaGltcE1haWxlclNlcnZpY2Uub25DYW5kaWRhdGVTaWduU3VjY2VzcyhyZXN1bHQpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2FsbGJhY2soe1xyXG4gICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XUk9OR19PVFAsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAwXHJcbiAgICAgIH0sIG51bGwpO1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIGNoYW5nZU1vYmlsZU51bWJlcihmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcblxyXG4gICAgbGV0IHF1ZXJ5ID0geydfaWQnOiBmaWVsZC5faWR9O1xyXG4gICAgbGV0IG90cCA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiA5OTk5OSkgKyAxMDAwMDApO1xyXG4gICAgbGV0IHVwZGF0ZURhdGEgPSB7J290cCc6IG90cCwgJ3RlbXBfbW9iaWxlJzogZmllbGQubmV3X21vYmlsZV9udW1iZXJ9O1xyXG5cclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfUkVHSVNUUkFUSU9OKSwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IERhdGEgPSB7XHJcbiAgICAgICAgICBjdXJyZW50X21vYmlsZV9udW1iZXI6IGZpZWxkLmN1cnJlbnRfbW9iaWxlX251bWJlcixcclxuICAgICAgICAgIG1vYmlsZU5vOiBmaWVsZC5uZXdfbW9iaWxlX251bWJlcixcclxuICAgICAgICAgIG90cDogb3RwXHJcbiAgICAgICAgfTtcclxuICAgICAgICBsZXQgc2VuZE1lc3NhZ2VTZXJ2aWNlID0gbmV3IFNlbmRNZXNzYWdlU2VydmljZSgpO1xyXG4gICAgICAgIHNlbmRNZXNzYWdlU2VydmljZS5zZW5kQ2hhbmdlTW9iaWxlTWVzc2FnZShEYXRhLCBjYWxsYmFjayk7XHJcblxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBmb3Jnb3RQYXNzd29yZChmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogU2VudE1lc3NhZ2VJbmZvKSA9PiB2b2lkKSB7XHJcblxyXG4gICAgbGV0IHNlbmRNYWlsU2VydmljZSA9IG5ldyBTZW5kTWFpbFNlcnZpY2UoKTtcclxuICAgIGxldCBxdWVyeSA9IHsnZW1haWwnOiBmaWVsZC5lbWFpbH07XHJcblxyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5yZXRyaWV2ZShxdWVyeSwgKGVyciwgcmVzKSA9PiB7XHJcblxyXG4gICAgICBpZiAocmVzLmxlbmd0aCA+IDAgJiYgcmVzWzBdLmlzQWN0aXZhdGVkID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgIGxldCBhdXRoID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgICAgIGxldCB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQocmVzWzBdKTtcclxuICAgICAgICBsZXQgaG9zdCA9IGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpO1xyXG4gICAgICAgIGxldCBsaW5rID0gaG9zdCArICdyZXNldC1wYXNzd29yZD9hY2Nlc3NfdG9rZW49JyArIHRva2VuICsgJyZfaWQ9JyArIHJlc1swXS5faWQ7XHJcbiAgICAgICAgbGV0IGh0bWxUZW1wbGF0ZSA9ICdmb3Jnb3RwYXNzd29yZC5odG1sJztcclxuICAgICAgICBsZXQgZGF0YTpNYXA8c3RyaW5nLHN0cmluZz49IG5ldyBNYXAoW1snJGFwcGxpY2F0aW9uTGluayQnLGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpXSxcclxuICAgICAgICAgIFsnJGZpcnN0X25hbWUkJyxyZXNbMF0uZmlyc3RfbmFtZV0sWyckdXNlcl9tYWlsJCcscmVzWzBdLmVtYWlsXSxbJyRsaW5rJCcsbGlua10sWyckYXBwX25hbWUkJyx0aGlzLkFQUF9OQU1FXV0pO1xyXG4gICAgICAgIGxldCBhdHRhY2htZW50PU1haWxBdHRhY2htZW50cy5Gb3JnZXRQYXNzd29yZEF0dGFjaG1lbnRBcnJheTtcclxuICAgICAgICBzZW5kTWFpbFNlcnZpY2Uuc2VuZCggZmllbGQuZW1haWwsIE1lc3NhZ2VzLkVNQUlMX1NVQkpFQ1RfRk9SR09UX1BBU1NXT1JELCBodG1sVGVtcGxhdGUsIGRhdGEsYXR0YWNobWVudCxcclxuKGVycjogYW55LCByZXN1bHQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnIsIHJlc3VsdCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIGlmIChyZXMubGVuZ3RoID4gMCAmJiByZXNbMF0uaXNBY3RpdmF0ZWQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9BQ0NPVU5UX1NUQVRVUyksIHJlcyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9VU0VSX05PVF9GT1VORCksIHJlcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG5cclxuICBTZW5kQ2hhbmdlTWFpbFZlcmlmaWNhdGlvbihmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogU2VudE1lc3NhZ2VJbmZvKSA9PiB2b2lkKSB7XHJcbiAgICBsZXQgcXVlcnkgPSB7J2VtYWlsJzogZmllbGQuY3VycmVudF9lbWFpbCwgJ2lzQWN0aXZhdGVkJzogdHJ1ZX07XHJcbiAgICBsZXQgdXBkYXRlRGF0YSA9IHskc2V0OnsndGVtcF9lbWFpbCc6IGZpZWxkLm5ld19lbWFpbH19O1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfRU1BSUxfQUNUSVZFX05PVyksIG51bGwpO1xyXG4gICAgICB9IGVsc2UgaWYocmVzdWx0ID09IG51bGwpIHtcclxuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1ZFUklGWV9BQ0NPVU5UKSwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGF1dGggPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICAgICAgbGV0IHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZChyZXN1bHQpO1xyXG4gICAgICAgIGxldCBob3N0ID0gY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5ob3N0Jyk7XHJcbiAgICAgICAgbGV0IGxpbmsgPSBob3N0ICsgJ2FjdGl2YXRlLXVzZXI/YWNjZXNzX3Rva2VuPScgKyB0b2tlbiArICcmX2lkPScgKyByZXN1bHQuX2lkKydpc0VtYWlsVmVyaWZpY2F0aW9uJztcclxuICAgICAgICBsZXQgc2VuZE1haWxTZXJ2aWNlID0gbmV3IFNlbmRNYWlsU2VydmljZSgpO1xyXG4gICAgICAgIGxldCBkYXRhOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcChbWyckYXBwbGljYXRpb25MaW5rJCcsY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5ob3N0JyldLFxyXG4gICAgICAgICAgWyckbGluayQnLCBsaW5rXV0pO1xyXG4gICAgICAgIGxldCBhdHRhY2htZW50PU1haWxBdHRhY2htZW50cy5BdHRhY2htZW50QXJyYXk7XHJcbiAgICAgICAgc2VuZE1haWxTZXJ2aWNlLnNlbmQoZmllbGQubmV3X2VtYWlsLFxyXG4gICAgICAgICAgTWVzc2FnZXMuRU1BSUxfU1VCSkVDVF9DSEFOR0VfRU1BSUxJRCxcclxuICAgICAgICAgICdjaGFuZ2UubWFpbC5odG1sJywgZGF0YSxhdHRhY2htZW50LCBjYWxsYmFjayk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2VuZE1haWwoZmllbGQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IFNlbnRNZXNzYWdlSW5mbykgPT4gdm9pZCkge1xyXG4gICAgbGV0IHNlbmRNYWlsU2VydmljZSA9IG5ldyBTZW5kTWFpbFNlcnZpY2UoKTtcclxuICAgIGxldCBkYXRhOk1hcDxzdHJpbmcsc3RyaW5nPj0gbmV3IE1hcChbWyckYXBwbGljYXRpb25MaW5rJCcsY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5ob3N0JyldLFxyXG4gICAgICBbJyRmaXJzdF9uYW1lJCcsZmllbGQuZmlyc3RfbmFtZV0sWyckZW1haWwkJyxmaWVsZC5lbWFpbF0sWyckbWVzc2FnZSQnLGZpZWxkLm1lc3NhZ2VdXSk7XHJcbiAgICBsZXQgYXR0YWNobWVudD1NYWlsQXR0YWNobWVudHMuQXR0YWNobWVudEFycmF5O1xyXG4gICAgc2VuZE1haWxTZXJ2aWNlLnNlbmQoY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5BRE1JTl9NQUlMJyksXHJcbiAgICAgIE1lc3NhZ2VzLkVNQUlMX1NVQkpFQ1RfVVNFUl9DT05UQUNURURfWU9VLFxyXG4gICAgICAnY29udGFjdHVzLm1haWwuaHRtbCcsZGF0YSxhdHRhY2htZW50LGNhbGxiYWNrKTtcclxuICB9XHJcblxyXG4gIHNlbmRNYWlsT25FcnJvcihlcnJvckluZm86IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IFNlbnRNZXNzYWdlSW5mbykgPT4gdm9pZCkge1xyXG4gICAgbGV0IGN1cnJlbnRfVGltZSA9IG5ldyBEYXRlKCkudG9Mb2NhbGVUaW1lU3RyaW5nKFtdLCB7aG91cjogJzItZGlnaXQnLCBtaW51dGU6ICcyLWRpZ2l0J30pO1xyXG4gICAgbGV0IGRhdGE6TWFwPHN0cmluZyxzdHJpbmc+O1xyXG4gICAgaWYoZXJyb3JJbmZvLnN0YWNrVHJhY2UpIHtcclxuICAgICAgIGRhdGE9IG5ldyBNYXAoW1snJGFwcGxpY2F0aW9uTGluayQnLGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpXSxcclxuICAgICAgICAgWyckdGltZSQnLGN1cnJlbnRfVGltZV0sWyckaG9zdCQnLGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpXSxcclxuICAgICAgICBbJyRyZWFzb24kJyxlcnJvckluZm8ucmVhc29uXSxbJyRjb2RlJCcsZXJyb3JJbmZvLmNvZGVdLFxyXG4gICAgICAgIFsnJG1lc3NhZ2UkJyxlcnJvckluZm8ubWVzc2FnZV0sWyckZXJyb3IkJyxlcnJvckluZm8uc3RhY2tUcmFjZS5zdGFja11dKTtcclxuXHJcbiAgICB9IGVsc2UgaWYoZXJyb3JJbmZvLnN0YWNrKSB7XHJcbiAgICAgIGRhdGE9IG5ldyBNYXAoW1snJGFwcGxpY2F0aW9uTGluayQnLGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpXSxcclxuICAgICAgICBbJyR0aW1lJCcsY3VycmVudF9UaW1lXSxbJyRob3N0JCcsY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5ob3N0JyldLFxyXG4gICAgICAgIFsnJHJlYXNvbiQnLGVycm9ySW5mby5yZWFzb25dLFsnJGNvZGUkJyxlcnJvckluZm8uY29kZV0sXHJcbiAgICAgICAgWyckbWVzc2FnZSQnLGVycm9ySW5mby5tZXNzYWdlXSxbJyRlcnJvciQnLGVycm9ySW5mby5zdGFja11dKTtcclxuICAgIH1cclxuICAgIGxldCBzZW5kTWFpbFNlcnZpY2UgPSBuZXcgU2VuZE1haWxTZXJ2aWNlKCk7XHJcbiAgICBsZXQgYXR0YWNobWVudCA9IE1haWxBdHRhY2htZW50cy5BdHRhY2htZW50QXJyYXk7XHJcbiAgICBzZW5kTWFpbFNlcnZpY2Uuc2VuZChjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLkFETUlOX01BSUwnKSxcclxuICAgICAgTWVzc2FnZXMuRU1BSUxfU1VCSkVDVF9TRVJWRVJfRVJST1IgKyAnIG9uICcgKyBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLmhvc3QnKSxcclxuICAgICAgJ2Vycm9yLm1haWwuaHRtbCcsZGF0YSxhdHRhY2htZW50LCBjYWxsYmFjayxjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLlRQTEdST1VQX01BSUwnKSk7XHJcbiAgfVxyXG5cclxuICBmaW5kQnlJZChpZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmZpbmRCeUlkKGlkLCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICByZXRyaWV2ZShmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnJldHJpZXZlKGZpZWxkLCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICByZXRyaWV2ZVdpdGhMaW1pdChmaWVsZDogYW55LCBpbmNsdWRlZCA6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IGxpbWl0ID0gY29uZmlnLmdldCgnYXBwbGljYXRpb24ubGltaXRGb3JRdWVyeScpO1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5yZXRyaWV2ZVdpdGhMaW1pdChmaWVsZCwgaW5jbHVkZWQsIGxpbWl0LCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICByZXRyaWV2ZVdpdGhMZWFuKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkucmV0cmlldmUoZmllbGQsIGNhbGxiYWNrKTtcclxuICB9XHJcblxyXG4gIHJldHJpZXZlQWxsKGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5yZXRyaWV2ZShpdGVtLCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfUkVHSVNUUkFUSU9OX01PQklMRV9OVU1CRVIpLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCByZXMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZShfaWQ6IGFueSwgaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcblxyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kQnlJZChfaWQsIChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHtcclxuXHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnIsIHJlcyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy51c2VyUmVwb3NpdG9yeS51cGRhdGUoX2lkLCBpdGVtLCBjYWxsYmFjayk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIGRlbGV0ZShfaWQ6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5kZWxldGUoX2lkLCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICBmaW5kT25lQW5kVXBkYXRlKHF1ZXJ5OiBhbnksIG5ld0RhdGE6IGFueSwgb3B0aW9uczogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIG5ld0RhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKTtcclxuICB9XHJcblxyXG4gIFVwbG9hZEltYWdlKHRlbXBQYXRoOiBhbnksIGZpbGVOYW1lOiBhbnksIGNiOiBhbnkpIHtcclxuICAgIGxldCB0YXJnZXRwYXRoID0gZmlsZU5hbWU7XHJcbiAgICBmcy5yZW5hbWUodGVtcFBhdGgsIHRhcmdldHBhdGgsIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgY2IobnVsbCwgdGVtcFBhdGgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBVcGxvYWREb2N1bWVudHModGVtcFBhdGg6IGFueSwgZmlsZU5hbWU6IGFueSwgY2I6IGFueSkge1xyXG4gICAgbGV0IHRhcmdldHBhdGggPSBmaWxlTmFtZTtcclxuICAgIGZzLnJlbmFtZSh0ZW1wUGF0aCwgdGFyZ2V0cGF0aCwgZnVuY3Rpb24gKGVycjogYW55KSB7XHJcbiAgICAgIGNiKG51bGwsIHRlbXBQYXRoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZmluZEFuZFVwZGF0ZU5vdGlmaWNhdGlvbihxdWVyeTogYW55LCBuZXdEYXRhOiBhbnksIG9wdGlvbnM6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBuZXdEYXRhLCBvcHRpb25zLCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICByZXRyaWV2ZUJ5U29ydGVkT3JkZXIocXVlcnk6IGFueSwgcHJvamVjdGlvbjphbnksIHNvcnRpbmdRdWVyeTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAvL3RoaXMudXNlclJlcG9zaXRvcnkucmV0cmlldmVCeVNvcnRlZE9yZGVyKHF1ZXJ5LCBwcm9qZWN0aW9uLCBzb3J0aW5nUXVlcnksIGNhbGxiYWNrKTtcclxuICB9XHJcblxyXG4gIHJlc2V0UGFzc3dvcmQoZGF0YTogYW55LCB1c2VyIDogYW55LCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+YW55KSB7XHJcbiAgICBjb25zdCBzYWx0Um91bmRzID0gMTA7XHJcbiAgICBiY3J5cHQuaGFzaChkYXRhLm5ld19wYXNzd29yZCwgc2FsdFJvdW5kcywgKGVycjogYW55LCBoYXNoOiBhbnkpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKHtcclxuICAgICAgICAgIHJlYXNvbjogJ0Vycm9yIGluIGNyZWF0aW5nIGhhc2ggdXNpbmcgYmNyeXB0JyxcclxuICAgICAgICAgIG1lc3NhZ2U6ICdFcnJvciBpbiBjcmVhdGluZyBoYXNoIHVzaW5nIGJjcnlwdCcsXHJcbiAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgIH0sIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCB1cGRhdGVEYXRhID0geydwYXNzd29yZCc6IGhhc2h9O1xyXG4gICAgICAgIGxldCBxdWVyeSA9IHsnX2lkJzogdXNlci5faWQsICdwYXNzd29yZCc6IHVzZXIucGFzc3dvcmR9O1xyXG4gICAgICAgIHRoaXMuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCx7XHJcbiAgICAgICAgICAgICAgJ3N0YXR1cyc6ICdTdWNjZXNzJyxcclxuICAgICAgICAgICAgICAnZGF0YSc6IHsnbWVzc2FnZSc6ICdQYXNzd29yZCBjaGFuZ2VkIHN1Y2Nlc3NmdWxseSd9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZURldGFpbHMoZGF0YTogIFVzZXJNb2RlbCwgdXNlcjogVXNlck1vZGVsLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICBsZXQgcXVlcnkgPSB7J19pZCc6IHVzZXIuX2lkfTtcclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgZGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLHtcclxuICAgICAgICAgICdzdGF0dXMnOiAnU3VjY2VzcycsXHJcbiAgICAgICAgICAnZGF0YSc6IHsnbWVzc2FnZSc6ICdVc2VyIFByb2ZpbGUgVXBkYXRlZCBzdWNjZXNzZnVsbHknfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRVc2VyQnlJZCh1c2VyOmFueSwgY2FsbGJhY2s6KGVycm9yOmFueSwgcmVzdWx0OmFueSk9PnZvaWQpIHtcclxuICAgIGxldCBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcblxyXG4gICAgbGV0IHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKTtcclxuICAgIGNhbGxiYWNrKG51bGwse1xyXG4gICAgICAnc3RhdHVzJzogJ3N1Y2Nlc3MnLFxyXG4gICAgICAnZGF0YSc6IHtcclxuICAgICAgICAnZmlyc3RfbmFtZSc6IHVzZXIuZmlyc3RfbmFtZSxcclxuICAgICAgICAnbGFzdF9uYW1lJzogdXNlci5sYXN0X25hbWUsXHJcbiAgICAgICAgJ2VtYWlsJzogdXNlci5lbWFpbCxcclxuICAgICAgICAnbW9iaWxlX251bWJlcic6IHVzZXIubW9iaWxlX251bWJlcixcclxuICAgICAgICAnY29tcGFueV9uYW1lJzogdXNlci5jb21wYW55X25hbWUsXHJcbiAgICAgICAgJ3N0YXRlJzogdXNlci5zdGF0ZSxcclxuICAgICAgICAnY2l0eSc6IHVzZXIuY2l0eSxcclxuICAgICAgICAncGljdHVyZSc6IHVzZXIucGljdHVyZSxcclxuICAgICAgICAnc29jaWFsX3Byb2ZpbGVfcGljdHVyZSc6IHVzZXIuc29jaWFsX3Byb2ZpbGVfcGljdHVyZSxcclxuICAgICAgICAnX2lkJzogdXNlci5faWQsXHJcbiAgICAgICAgJ2N1cnJlbnRfdGhlbWUnOiB1c2VyLmN1cnJlbnRfdGhlbWVcclxuICAgICAgfSxcclxuICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB2ZXJpZnlBY2NvdW50KHVzZXI6VXNlciwgY2FsbGJhY2s6KGVycm9yOmFueSwgcmVzdWx0OmFueSk9PnZvaWQpIHtcclxuICAgIGxldCBxdWVyeSA9IHsnX2lkJzogdXNlci5faWQsICdpc0FjdGl2YXRlZCc6IGZhbHNlfTtcclxuICAgIGxldCB1cGRhdGVEYXRhID0geydpc0FjdGl2YXRlZCc6IHRydWV9O1xyXG4gICAgdGhpcy5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwse1xyXG4gICAgICAgICAgJ3N0YXR1cyc6ICdTdWNjZXNzJyxcclxuICAgICAgICAgICdkYXRhJzogeydtZXNzYWdlJzogJ1VzZXIgQWNjb3VudCB2ZXJpZmllZCBzdWNjZXNzZnVsbHknfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjaGFuZ2VFbWFpbElkKGRhdGE6YW55LCB1c2VyIDogVXNlciwgY2FsbGJhY2s6KGVycm9yOmFueSwgcmVzdWx0OmFueSk9PnZvaWQpIHtcclxuICAgIGxldCBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICBsZXQgcXVlcnkgPSB7J2VtYWlsJzogZGF0YS5uZXdfZW1haWx9O1xyXG5cclxuICAgIHRoaXMucmV0cmlldmUocXVlcnksIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcblxyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDAgJiYgcmVzdWx0WzBdLmlzQWN0aXZhdGVkID09PSB0cnVlKSB7XHJcbiAgICAgICAgY2FsbGJhY2soe1xyXG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0VYSVNUSU5HX1VTRVIsXHJcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfUkVHSVNUUkFUSU9OLFxyXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICB9LG51bGwpO1xyXG4gICAgICB9IGVsc2UgaWYgKHJlc3VsdC5sZW5ndGggPiAwICYmIHJlc3VsdFswXS5pc0FjdGl2YXRlZCA9PT0gZmFsc2UpIHtcclxuICAgICAgICBjYWxsYmFjayh7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRVhJU1RJTkdfVVNFUixcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9BQ0NPVU5UX1NUQVRVUyxcclxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgfSwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5TZW5kQ2hhbmdlTWFpbFZlcmlmaWNhdGlvbihkYXRhLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvci5tZXNzYWdlID09PSBNZXNzYWdlcy5NU0dfRVJST1JfQ0hFQ0tfRU1BSUxfQUNDT1VOVCkge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKHtcclxuICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNQUlMX0FDVElWRV9OT1csXHJcbiAgICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICAgIH0sIG51bGwpO1xyXG4gICAgICAgICAgICB9aWYgKGVycm9yLm1lc3NhZ2UgPT09IE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQUNDT1VOVCkge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKHtcclxuICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1ZFUklGWV9BQ0NPVU5ULFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1ZFUklGWV9BQ0NPVU5ULFxyXG4gICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgICB9LCBudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBjYWxsYmFjayh7XHJcbiAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fV0hJTEVfQ09OVEFDVElORyxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XSElMRV9DT05UQUNUSU5HLFxyXG4gICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgICB9LCBudWxsKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtcclxuICAgICAgICAgICAgICAnc3RhdHVzJzogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgICAgICAgJ2RhdGEnOiB7J21lc3NhZ2UnOiBNZXNzYWdlcy5NU0dfU1VDQ0VTU19FTUFJTF9DSEFOR0VfRU1BSUxJRH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHZlcmlmeUNoYW5nZWRFbWFpbElkKHVzZXI6IGFueSwgY2FsbGJhY2s6KGVycm9yIDogYW55LCByZXN1bHQgOiBhbnkpPT4gYW55KSB7XHJcbiAgICBsZXQgcXVlcnkgPSB7J19pZCc6IHVzZXIuX2lkfTtcclxuICAgIGxldCB1cGRhdGVEYXRhID0geydlbWFpbCc6IHVzZXIudGVtcF9lbWFpbCwgJ3RlbXBfZW1haWwnOiB1c2VyLmVtYWlsfTtcclxuICAgIHRoaXMuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLHtcclxuICAgICAgICAgICdzdGF0dXMnOiAnU3VjY2VzcycsXHJcbiAgICAgICAgICAnZGF0YSc6IHsnbWVzc2FnZSc6ICdVc2VyIEFjY291bnQgdmVyaWZpZWQgc3VjY2Vzc2Z1bGx5J31cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdmVyaWZ5TW9iaWxlTnVtYmVyKGRhdGEgOmFueSAsIHVzZXIgOiBhbnksIGNhbGxiYWNrOihlcnJvcjphbnksIHJlc3VsdDphbnkpPT52b2lkKSB7XHJcbiAgICBsZXQgcXVlcnkgPSB7J19pZCc6IHVzZXIuX2lkfTtcclxuICAgIGxldCB1cGRhdGVEYXRhID0geydtb2JpbGVfbnVtYmVyJzogdXNlci50ZW1wX21vYmlsZSwgJ3RlbXBfbW9iaWxlJzogdXNlci5tb2JpbGVfbnVtYmVyfTtcclxuICAgIGlmICh1c2VyLm90cCA9PT0gZGF0YS5vdHApIHtcclxuICAgICAgdGhpcy5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY2FsbGJhY2sobnVsbCx7XHJcbiAgICAgICAgICAgICdzdGF0dXMnOiAnU3VjY2VzcycsXHJcbiAgICAgICAgICAgICdkYXRhJzogeydtZXNzYWdlJzogJ1VzZXIgQWNjb3VudCB2ZXJpZmllZCBzdWNjZXNzZnVsbHknfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNhbGxiYWNrKHtcclxuICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfT1RQLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICB9LCBudWxsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzc2lnblByZW1pdW1QYWNrYWdlKHVzZXI6VXNlcix1c2VySWQ6c3RyaW5nLCBjb3N0OiBudW1iZXIsY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IHByb2plY3Rpb24gPSB7c3Vic2NyaXB0aW9uOiAxfTtcclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkuZmluZEJ5SWRXaXRoUHJvamVjdGlvbih1c2VySWQscHJvamVjdGlvbiwoZXJyb3IscmVzdWx0KT0+IHtcclxuICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvcixudWxsKTtcclxuICAgICAgfWVsc2Uge1xyXG4gICAgICAgIGxldCBzdWJTY3JpcHRpb25BcnJheSA9IHJlc3VsdC5zdWJzY3JpcHRpb247XHJcbiAgICAgICAgbGV0IHN1YlNjcmlwdGlvblNlcnZpY2UgPSBuZXcgU3Vic2NyaXB0aW9uU2VydmljZSgpO1xyXG4gICAgICAgIHN1YlNjcmlwdGlvblNlcnZpY2UuZ2V0U3Vic2NyaXB0aW9uUGFja2FnZUJ5TmFtZSgnUHJlbWl1bScsJ0Jhc2VQYWNrYWdlJyxcclxuICAgICAgICAgIChlcnJvcjogYW55LCBzdWJzY3JpcHRpb25QYWNrYWdlOiBBcnJheTxTdWJzY3JpcHRpb25QYWNrYWdlPikgPT4ge1xyXG4gICAgICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLG51bGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGxldCBwcmVtaXVtUGFja2FnZSA9IHN1YnNjcmlwdGlvblBhY2thZ2VbMF07XHJcbiAgICAgICAgICAgICAgaWYoc3ViU2NyaXB0aW9uQXJyYXlbMF0ucHJvamVjdElkLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgc3ViU2NyaXB0aW9uQXJyYXlbMF0ubnVtT2ZCdWlsZGluZ3MgPSBwcmVtaXVtUGFja2FnZS5iYXNlUGFja2FnZS5udW1PZkJ1aWxkaW5ncztcclxuICAgICAgICAgICAgICAgIHN1YlNjcmlwdGlvbkFycmF5WzBdLm51bU9mUHJvamVjdHMgPSBwcmVtaXVtUGFja2FnZS5iYXNlUGFja2FnZS5udW1PZlByb2plY3RzO1xyXG4gICAgICAgICAgICAgICAgc3ViU2NyaXB0aW9uQXJyYXlbMF0udmFsaWRpdHkgPSBzdWJTY3JpcHRpb25BcnJheVswXS52YWxpZGl0eSArIHByZW1pdW1QYWNrYWdlLmJhc2VQYWNrYWdlLnZhbGlkaXR5O1xyXG4gICAgICAgICAgICAgICAgc3ViU2NyaXB0aW9uQXJyYXlbMF0ucHVyY2hhc2VkLnB1c2gocHJlbWl1bVBhY2thZ2UuYmFzZVBhY2thZ2UpO1xyXG4gICAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBzdWJzY3JpcHRpb24gPSBuZXcgVXNlclN1YnNjcmlwdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLmFjdGl2YXRpb25EYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi5udW1PZkJ1aWxkaW5ncyA9IHByZW1pdW1QYWNrYWdlLmJhc2VQYWNrYWdlLm51bU9mQnVpbGRpbmdzO1xyXG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLm51bU9mUHJvamVjdHMgPSBwcmVtaXVtUGFja2FnZS5iYXNlUGFja2FnZS5udW1PZlByb2plY3RzO1xyXG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLnZhbGlkaXR5ID0gcHJlbWl1bVBhY2thZ2UuYmFzZVBhY2thZ2UudmFsaWRpdHk7XHJcbiAgICAgICAgICAgICAgICBwcmVtaXVtUGFja2FnZS5iYXNlUGFja2FnZS5jb3N0ID0gY29zdDtcclxuICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi5wcm9qZWN0SWQgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLnB1cmNoYXNlZCA9IG5ldyBBcnJheTxCYXNlU3Vic2NyaXB0aW9uUGFja2FnZT4oKTtcclxuICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi5wdXJjaGFzZWQucHVzaChwcmVtaXVtUGFja2FnZS5iYXNlUGFja2FnZSk7XHJcbiAgICAgICAgICAgICAgICBzdWJTY3JpcHRpb25BcnJheS5wdXNoKHN1YnNjcmlwdGlvbik7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGxldCBxdWVyeSA9IHsnX2lkJzogdXNlcklkfTtcclxuICAgICAgICAgICAgICBsZXQgbmV3RGF0YSA9IHskc2V0OiB7J3N1YnNjcmlwdGlvbic6IHN1YlNjcmlwdGlvbkFycmF5fX07XHJcbiAgICAgICAgICAgICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBuZXdEYXRhLCB7bmV3OiB0cnVlfSwgKGVyciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOidzdWNjZXNzJ30pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0UHJvamVjdHModXNlcjogVXNlciwgY2FsbGJhY2s6KGVycm9yIDogYW55LCByZXN1bHQgOmFueSk9PnZvaWQpIHtcclxuXHJcbiAgICBsZXQgcXVlcnkgPSB7X2lkOiB1c2VyLl9pZCB9O1xyXG4gICAgbGV0IHBvcHVsYXRlID0ge3BhdGg6ICdwcm9qZWN0Jywgc2VsZWN0OiBbJ25hbWUnLCdidWlsZGluZ3MnLCdhY3RpdmVTdGF0dXMnXX07XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmZpbmRBbmRQb3B1bGF0ZShxdWVyeSwgcG9wdWxhdGUsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgYXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgICAgIGxldCBwb3B1bGF0ZWRQcm9qZWN0ID0gcmVzdWx0WzBdO1xyXG4gICAgICAgIGxldCBwcm9qZWN0TGlzdCA9IHJlc3VsdFswXS5wcm9qZWN0O1xyXG4gICAgICAgIGxldCBzdWJzY3JpcHRpb25MaXN0ID0gcmVzdWx0WzBdLnN1YnNjcmlwdGlvbjtcclxuXHJcbiAgICAgICAgbGV0IHByb2plY3RTdWJzY3JpcHRpb25BcnJheSA9IEFycmF5PFByb2plY3RTdWJzY3JpcHRpb25EZXRhaWxzPigpO1xyXG4gICAgICAgIGxldCBpc0FibGVUb0NyZWF0ZU5ld1Byb2plY3QgOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGZvcihsZXQgcHJvamVjdCBvZiBwcm9qZWN0TGlzdCkge1xyXG4gICAgICAgICAgZm9yKGxldCBzdWJzY3JpcHRpb24gb2Ygc3Vic2NyaXB0aW9uTGlzdCkge1xyXG4gICAgICAgICAgICBpZihzdWJzY3JpcHRpb24ucHJvamVjdElkLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgIGlmKHN1YnNjcmlwdGlvbi5wcm9qZWN0SWRbMF0uZXF1YWxzKHByb2plY3QuX2lkKSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHByb2plY3RTdWJzY3JpcHRpb24gPSBuZXcgUHJvamVjdFN1YnNjcmlwdGlvbkRldGFpbHMoKTtcclxuICAgICAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24ucHJvamVjdE5hbWUgPSBwcm9qZWN0Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLnByb2plY3RJZCA9IHByb2plY3QuX2lkO1xyXG4gICAgICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5hY3RpdmVTdGF0dXMgPSBwcm9qZWN0LmFjdGl2ZVN0YXR1cztcclxuICAgICAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24ubnVtT2ZCdWlsZGluZ3NSZW1haW5pbmcgPSAoc3Vic2NyaXB0aW9uLm51bU9mQnVpbGRpbmdzIC0gcHJvamVjdC5idWlsZGluZ3MubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24ubnVtT2ZCdWlsZGluZ3NBbGxvY2F0ZWQgPSBwcm9qZWN0LmJ1aWxkaW5ncy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLnBhY2thZ2VOYW1lID0gdGhpcy5jaGVja0N1cnJlbnRQYWNrYWdlKHN1YnNjcmlwdGlvbik7XHJcbiAgICAgICAgICAgICAgICAvL2FjdGl2YXRpb24gZGF0ZSBmb3IgcHJvamVjdCBzdWJzY3JpcHRpb25cclxuICAgICAgICAgICAgICAgIGxldCBhY3RpdmF0aW9uX2RhdGUgPSBuZXcgRGF0ZShzdWJzY3JpcHRpb24uYWN0aXZhdGlvbkRhdGUpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGV4cGlyeURhdGUgPSBuZXcgRGF0ZShzdWJzY3JpcHRpb24uYWN0aXZhdGlvbkRhdGUpO1xyXG4gICAgICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5leHBpcnlEYXRlID0gbmV3IERhdGUoZXhwaXJ5RGF0ZS5zZXREYXRlKGFjdGl2YXRpb25fZGF0ZS5nZXREYXRlKCkgKyBzdWJzY3JpcHRpb24udmFsaWRpdHkpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL2V4cGlyeSBkYXRlIGZvciBwcm9qZWN0IHN1YnNjcmlwdGlvblxyXG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRfZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3RXhpcHJ5RGF0ZSA9IG5ldyBEYXRlKHByb2plY3RTdWJzY3JpcHRpb24uZXhwaXJ5RGF0ZSk7XHJcbiAgICAgICAgICAgICAgICBuZXdFeGlwcnlEYXRlLnNldERhdGUocHJvamVjdFN1YnNjcmlwdGlvbi5leHBpcnlEYXRlLmdldERhdGUoKSArIDMwKTtcclxuICAgICAgICAgICAgICAgIGxldCBub09mRGF5cyA9ICB0aGlzLmRheXNkaWZmZXJlbmNlKG5ld0V4aXByeURhdGUsICBjdXJyZW50X2RhdGUpO1xyXG4gICAgICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5udW1PZkRheXNUb0V4cGlyZSA9IHRoaXMuZGF5c2RpZmZlcmVuY2UocHJvamVjdFN1YnNjcmlwdGlvbi5leHBpcnlEYXRlLCBjdXJyZW50X2RhdGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKHByb2plY3RTdWJzY3JpcHRpb24ubnVtT2ZEYXlzVG9FeHBpcmUgPCAzMCAmJiBwcm9qZWN0U3Vic2NyaXB0aW9uLm51bU9mRGF5c1RvRXhwaXJlID4wKSB7XHJcbiAgICAgICAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24ud2FybmluZ01lc3NhZ2UgPVxyXG4gICAgICAgICAgICAgICAgICAgICdFeHBpcmluZyBpbiAnICsgIE1hdGgucm91bmQocHJvamVjdFN1YnNjcmlwdGlvbi5udW1PZkRheXNUb0V4cGlyZSkgKyAnIGRheXMsJyA7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYocHJvamVjdFN1YnNjcmlwdGlvbi5udW1PZkRheXNUb0V4cGlyZSA8PSAwICYmICBub09mRGF5cyA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24uZXhwaXJ5TWVzc2FnZSA9ICAnUHJvamVjdCBleHBpcmVkLCc7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZihub09mRGF5cyA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5hY3RpdmVTdGF0dXMgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uQXJyYXkucHVzaChwcm9qZWN0U3Vic2NyaXB0aW9uKTtcclxuXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgIHtcclxuICAgICAgICAgICAgICBpc0FibGVUb0NyZWF0ZU5ld1Byb2plY3QgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihwcm9qZWN0TGlzdC5sZW5ndGggPT09IDAgJiYgc3Vic2NyaXB0aW9uTGlzdFswXS5wdXJjaGFzZWQubGVuZ3RoICE9PTApIHtcclxuICAgICAgICAgIGlzQWJsZVRvQ3JlYXRlTmV3UHJvamVjdCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjYWxsYmFjayhudWxsLCB7XHJcbiAgICAgICAgICBkYXRhOiBwcm9qZWN0U3Vic2NyaXB0aW9uQXJyYXksXHJcbiAgICAgICAgICBpc1N1YnNjcmlwdGlvbkF2YWlsYWJsZSA6IGlzQWJsZVRvQ3JlYXRlTmV3UHJvamVjdCxcclxuICAgICAgICAgIGFjY2Vzc190b2tlbjogYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy9UbyBjaGVjayB3aGljaCBpcyBjdXJyZW50IHBhY2thZ2Ugb2NjdXBpZWQgYnkgdXNlci5cclxuICAgY2hlY2tDdXJyZW50UGFja2FnZShzdWJzY3JpcHRpb246YW55KSB7XHJcbiAgICAgbGV0IGFjdGl2YXRpb25fZGF0ZSA9IG5ldyBEYXRlKHN1YnNjcmlwdGlvbi5hY3RpdmF0aW9uRGF0ZSk7XHJcbiAgICAgbGV0IGV4cGlyeURhdGUgPSBuZXcgRGF0ZShzdWJzY3JpcHRpb24uYWN0aXZhdGlvbkRhdGUpO1xyXG4gICAgIGxldCBleHBpcnlEYXRlT3V0ZXIgPSBuZXcgRGF0ZShzdWJzY3JpcHRpb24uYWN0aXZhdGlvbkRhdGUpO1xyXG4gICAgIGxldCBjdXJyZW50X2RhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgIGZvcihsZXQgcHVyY2hhc2VQYWNrYWdlIG9mIHN1YnNjcmlwdGlvbi5wdXJjaGFzZWQpIHtcclxuICAgICAgIGV4cGlyeURhdGVPdXRlciA9IG5ldyBEYXRlKGV4cGlyeURhdGVPdXRlci5zZXREYXRlKGFjdGl2YXRpb25fZGF0ZS5nZXREYXRlKCkgKyBwdXJjaGFzZVBhY2thZ2UudmFsaWRpdHkpKTtcclxuICAgICAgIGZvciAobGV0IHB1cmNoYXNlUGFja2FnZSBvZiBzdWJzY3JpcHRpb24ucHVyY2hhc2VkKSB7XHJcbiAgICAgICAgIC8vZXhwaXJ5IGRhdGUgZm9yIGVhY2ggcGFja2FnZS5cclxuICAgICAgICAgZXhwaXJ5RGF0ZSA9IG5ldyBEYXRlKGV4cGlyeURhdGUuc2V0RGF0ZShhY3RpdmF0aW9uX2RhdGUuZ2V0RGF0ZSgpICsgcHVyY2hhc2VQYWNrYWdlLnZhbGlkaXR5KSk7XHJcbiAgICAgICAgIGlmICgoZXhwaXJ5RGF0ZU91dGVyIDwgZXhwaXJ5RGF0ZSkgJiYgKGV4cGlyeURhdGUgPj1jdXJyZW50X2RhdGUpKSB7XHJcbiAgICAgICAgICAgcmV0dXJuIHB1cmNoYXNlUGFja2FnZS5uYW1lO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIGlmKHB1cmNoYXNlUGFja2FnZS5uYW1lID09PSdGcmVlJykge1xyXG4gICAgICAgICByZXR1cm4gcHVyY2hhc2VQYWNrYWdlLm5hbWU9J0ZyZWUnO1xyXG4gICAgICAgfWVsc2Uge1xyXG4gICAgICAgICByZXR1cm4gcHVyY2hhc2VQYWNrYWdlLm5hbWU9J1ByZW1pdW0nO1xyXG4gICAgICAgfVxyXG4gICAgIH1cclxuICAgIH1cclxuXHJcbiAgZGF5c2RpZmZlcmVuY2UoZGF0ZTEgOiBEYXRlLCBkYXRlMiA6IERhdGUpIHtcclxuICAgIGxldCBPTkVEQVkgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xyXG4gICAgbGV0IGRhdGUxX21zID0gZGF0ZTEuZ2V0VGltZSgpO1xyXG4gICAgbGV0IGRhdGUyX21zID0gZGF0ZTIuZ2V0VGltZSgpO1xyXG4gICAgbGV0IGRpZmZlcmVuY2VfbXMgPSAoZGF0ZTFfbXMgLSBkYXRlMl9tcyk7XHJcbiAgICByZXR1cm4gTWF0aC5yb3VuZChkaWZmZXJlbmNlX21zL09ORURBWSk7XHJcbiAgfVxyXG5cclxuICBnZXRQcm9qZWN0U3Vic2NyaXB0aW9uKHVzZXI6IFVzZXIsIHByb2plY3RJZDogc3RyaW5nLCBjYWxsYmFjazooZXJyb3IgOiBhbnksIHJlc3VsdCA6YW55KT0+dm9pZCkge1xyXG5cclxuICAgIGxldCBxdWVyeSA9IFtcclxuICAgICAgeyRtYXRjaDogeydfaWQnOk9iamVjdElkKHVzZXIuX2lkKX19LFxyXG4gICAgICB7ICRwcm9qZWN0IDogeydzdWJzY3JpcHRpb24nOjF9fSxcclxuICAgICAgeyAkdW53aW5kOiAnJHN1YnNjcmlwdGlvbid9LFxyXG4gICAgICB7ICRtYXRjaDogeydzdWJzY3JpcHRpb24ucHJvamVjdElkJyA6IE9iamVjdElkKHByb2plY3RJZCl9fVxyXG4gICAgXTtcclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkuYWdncmVnYXRlKHF1ZXJ5ICwoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IHF1ZXJ5ID0geyBfaWQ6IHByb2plY3RJZH07XHJcbiAgICAgICAgbGV0IHBvcHVsYXRlID0ge3BhdGggOiAnYnVpbGRpbmdzJ307XHJcbiAgICAgICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kQW5kUG9wdWxhdGUocXVlcnksIHBvcHVsYXRlLCAoZXJyb3IsIHJlc3ApID0+IHtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgcHJvamVjdFN1YnNjcmlwdGlvbiA9IG5ldyBQcm9qZWN0U3Vic2NyaXB0aW9uRGV0YWlscygpO1xyXG4gICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLnByb2plY3ROYW1lID0gcmVzcFswXS5uYW1lO1xyXG4gICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLnByb2plY3RJZCA9IHJlc3BbMF0uX2lkO1xyXG4gICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLmFjdGl2ZVN0YXR1cyA9IHJlc3BbMF0uYWN0aXZlU3RhdHVzO1xyXG4gICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLm51bU9mQnVpbGRpbmdzQWxsb2NhdGVkID0gcmVzcFswXS5idWlsZGluZ3MubGVuZ3RoO1xyXG4gICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLm51bU9mQnVpbGRpbmdzRXhpc3QgPSByZXN1bHRbMF0uc3Vic2NyaXB0aW9uLm51bU9mQnVpbGRpbmdzO1xyXG4gICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLm51bU9mQnVpbGRpbmdzUmVtYWluaW5nID0gKHJlc3VsdFswXS5zdWJzY3JpcHRpb24ubnVtT2ZCdWlsZGluZ3MgLSByZXNwWzBdLmJ1aWxkaW5ncy5sZW5ndGgpO1xyXG4gICAgICAgICAgICBpZihyZXN1bHRbMF0uc3Vic2NyaXB0aW9uLm51bU9mQnVpbGRpbmdzID09PSAxMCAmJiBwcm9qZWN0U3Vic2NyaXB0aW9uLm51bU9mQnVpbGRpbmdzUmVtYWluaW5nID09PTAgJiYgcHJvamVjdFN1YnNjcmlwdGlvbi5wYWNrYWdlTmFtZSAhPT0gJ0ZyZWUnKSB7XHJcbiAgICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5hZGRCdWlsZGluZ0Rpc2FibGU9dHJ1ZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24ucGFja2FnZU5hbWUgPSB0aGlzLmNoZWNrQ3VycmVudFBhY2thZ2UocmVzdWx0WzBdLnN1YnNjcmlwdGlvbik7XHJcbiAgICAgICAgICAgIGlmKHByb2plY3RTdWJzY3JpcHRpb24ucGFja2FnZU5hbWUgPT09ICdGcmVlJyAmJiBwcm9qZWN0U3Vic2NyaXB0aW9uLm51bU9mQnVpbGRpbmdzUmVtYWluaW5nID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5hZGRCdWlsZGluZ0Rpc2FibGU9dHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGFjdGl2YXRpb25fZGF0ZSA9IG5ldyBEYXRlKHJlc3VsdFswXS5zdWJzY3JpcHRpb24uYWN0aXZhdGlvbkRhdGUpO1xyXG4gICAgICAgICAgICBsZXQgZXhwaXJ5RGF0ZSA9IG5ldyBEYXRlKHJlc3VsdFswXS5zdWJzY3JpcHRpb24uYWN0aXZhdGlvbkRhdGUpO1xyXG4gICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLmV4cGlyeURhdGUgPSBuZXcgRGF0ZShleHBpcnlEYXRlLnNldERhdGUoYWN0aXZhdGlvbl9kYXRlLmdldERhdGUoKSArIHJlc3VsdFswXS5zdWJzY3JpcHRpb24udmFsaWRpdHkpKTtcclxuXHJcbiAgICAgICAgICAgIC8vZXhwaXJ5IGRhdGUgZm9yIHByb2plY3Qgc3Vic2NyaXB0aW9uXHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50X2RhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICB2YXIgbmV3RXhpcHJ5RGF0ZSA9IG5ldyBEYXRlKHByb2plY3RTdWJzY3JpcHRpb24uZXhwaXJ5RGF0ZSk7XHJcbiAgICAgICAgICAgIG5ld0V4aXByeURhdGUuc2V0RGF0ZShwcm9qZWN0U3Vic2NyaXB0aW9uLmV4cGlyeURhdGUuZ2V0RGF0ZSgpICsgMzApO1xyXG4gICAgICAgICAgICBsZXQgbm9PZkRheXMgPSAgdGhpcy5kYXlzZGlmZmVyZW5jZShuZXdFeGlwcnlEYXRlLCAgY3VycmVudF9kYXRlKTtcclxuXHJcbiAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24ubnVtT2ZEYXlzVG9FeHBpcmUgPSB0aGlzLmRheXNkaWZmZXJlbmNlKHByb2plY3RTdWJzY3JpcHRpb24uZXhwaXJ5RGF0ZSwgY3VycmVudF9kYXRlKTtcclxuXHJcbiAgICAgICAgICAgIGlmKHByb2plY3RTdWJzY3JpcHRpb24ubnVtT2ZEYXlzVG9FeHBpcmUgPCAzMCAmJiBwcm9qZWN0U3Vic2NyaXB0aW9uLm51bU9mRGF5c1RvRXhwaXJlID4wKSB7XHJcbiAgICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi53YXJuaW5nTWVzc2FnZSA9XHJcbiAgICAgICAgICAgICAgICAnRXhwaXJpbmcgaW4gJyArICBNYXRoLnJvdW5kKHByb2plY3RTdWJzY3JpcHRpb24ubnVtT2ZEYXlzVG9FeHBpcmUpICsgJyBkYXlzLicgO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYocHJvamVjdFN1YnNjcmlwdGlvbi5udW1PZkRheXNUb0V4cGlyZSA8PSAwICYmIG5vT2ZEYXlzID49IDApIHtcclxuICAgICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLmV4cGlyeU1lc3NhZ2UgPSAnUHJvamVjdCBleHBpcmVkLCc7XHJcbiAgICAgICAgICAgIH1lbHNlIGlmKG5vT2ZEYXlzIDwgMCkge1xyXG4gICAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24uYWN0aXZlU3RhdHVzID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcHJvamVjdFN1YnNjcmlwdGlvbik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlU3Vic2NyaXB0aW9uKHVzZXIgOiBVc2VyLCBwcm9qZWN0SWQ6IHN0cmluZywgcGFja2FnZU5hbWU6IHN0cmluZyxjb3N0Rm9yQnVpbGRpbmdQdXJjaGFzZWQ6YW55LG51bWJlck9mQnVpbGRpbmdzUHVyY2hhc2VkOmFueSwgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KT0+IHZvaWQpIHtcclxuICAgIGxldCBxdWVyeSA9IFtcclxuICAgICAgeyRtYXRjaDogeydfaWQnOk9iamVjdElkKHVzZXIuX2lkKX19LFxyXG4gICAgICB7ICRwcm9qZWN0IDogeydzdWJzY3JpcHRpb24nOjF9fSxcclxuICAgICAgeyAkdW53aW5kOiAnJHN1YnNjcmlwdGlvbid9LFxyXG4gICAgICB7ICRtYXRjaDogeydzdWJzY3JpcHRpb24ucHJvamVjdElkJyA6IE9iamVjdElkKHByb2plY3RJZCl9fVxyXG4gICAgXTtcclxuICAgdGhpcy51c2VyUmVwb3NpdG9yeS5hZ2dyZWdhdGUocXVlcnksIChlcnJvcixyZXN1bHQpID0+IHtcclxuICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICB9IGVsc2Uge1xyXG4gICAgICAgbGV0IHN1YnNjcmlwdGlvbiA9IHJlc3VsdFswXS5zdWJzY3JpcHRpb247XHJcbiAgICAgICB0aGlzLnVwZGF0ZVBhY2thZ2UodXNlciwgc3Vic2NyaXB0aW9uLCBwYWNrYWdlTmFtZSxjb3N0Rm9yQnVpbGRpbmdQdXJjaGFzZWQsbnVtYmVyT2ZCdWlsZGluZ3NQdXJjaGFzZWQscHJvamVjdElkLChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgIGxldCBlcnJvciA9IG5ldyBFcnJvcigpO1xyXG4gICAgICAgICAgIGVycm9yLm1lc3NhZ2UgPSBtZXNzYWdlcy5NU0dfRVJST1JfV0hJTEVfQ09OVEFDVElORztcclxuICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgaWYocGFja2FnZU5hbWUgPT09IGNvbnN0YW50cy5SRU5FV19QUk9KRUNUKSB7XHJcbiAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogbWVzc2FnZXMuTVNHX1NVQ0NFU1NfUFJPSkVDVF9SRU5FV30pO1xyXG4gICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogJ3N1Y2Nlc3MnfSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICB9XHJcbiAgICAgICB9KTtcclxuICAgICB9XHJcbiAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlUGFja2FnZSh1c2VyOiBVc2VyLCBzdWJzY3JpcHRpb246IGFueSwgcGFja2FnZU5hbWU6IHN0cmluZyxjb3N0Rm9yQnVpbGRpbmdQdXJjaGFzZWQ6YW55LG51bWJlck9mQnVpbGRpbmdzUHVyY2hhc2VkOmFueSwgcHJvamVjdElkOnN0cmluZywgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KT0+IHZvaWQpIHtcclxuICAgIGxldCBzdWJTY3JpcHRpb25TZXJ2aWNlID0gbmV3IFN1YnNjcmlwdGlvblNlcnZpY2UoKTtcclxuICAgIHN3aXRjaCAocGFja2FnZU5hbWUpIHtcclxuICAgICAgY2FzZSAnUHJlbWl1bSc6XHJcbiAgICAgIHtcclxuICAgICAgICBzdWJTY3JpcHRpb25TZXJ2aWNlLmdldFN1YnNjcmlwdGlvblBhY2thZ2VCeU5hbWUoJ1ByZW1pdW0nLCdCYXNlUGFja2FnZScsXHJcbiAgICAgICAgICAoZXJyb3I6IGFueSwgc3Vic2NyaXB0aW9uUGFja2FnZTogQXJyYXk8U3Vic2NyaXB0aW9uUGFja2FnZT4pID0+IHtcclxuICAgICAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvcixudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gc3Vic2NyaXB0aW9uUGFja2FnZVswXTtcclxuICAgICAgICAgICAgICBzdWJzY3JpcHRpb24ubnVtT2ZCdWlsZGluZ3MgPSByZXN1bHQuYmFzZVBhY2thZ2UubnVtT2ZCdWlsZGluZ3M7XHJcbiAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLm51bU9mUHJvamVjdHMgPSByZXN1bHQuYmFzZVBhY2thZ2UubnVtT2ZQcm9qZWN0cztcclxuICAgICAgICAgICAgICBsZXQgbm9PZkRheXNUb0V4cGlyeSA9IHRoaXMuY2FsY3VsYXRlVmFsaWRpdHkoc3Vic2NyaXB0aW9uKTtcclxuICAgICAgICAgICAgICBzdWJzY3JpcHRpb24udmFsaWRpdHkgPSBub09mRGF5c1RvRXhwaXJ5ICsgcmVzdWx0LmJhc2VQYWNrYWdlLnZhbGlkaXR5O1xyXG4gICAgICAgICAgICAgIHJlc3VsdC5iYXNlUGFja2FnZS5jb3N0ID0gY29zdEZvckJ1aWxkaW5nUHVyY2hhc2VkO1xyXG4gICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi5wdXJjaGFzZWQucHVzaChyZXN1bHQuYmFzZVBhY2thZ2UpO1xyXG4gICAgICAgICAgICAgIHRoaXMudXBkYXRlU3Vic2NyaXB0aW9uUGFja2FnZSh1c2VyLl9pZCwgcHJvamVjdElkLHN1YnNjcmlwdGlvbiwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogJ3N1Y2Nlc3MnfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjYXNlICdSZW5ld1Byb2plY3QnOlxyXG4gICAgICB7XHJcbiAgICAgICAgc3ViU2NyaXB0aW9uU2VydmljZS5nZXRTdWJzY3JpcHRpb25QYWNrYWdlQnlOYW1lKCdSZW5ld1Byb2plY3QnLCdhZGRPblBhY2thZ2UnLFxyXG4gICAgICAgICAgKGVycm9yOiBhbnksIHN1YnNjcmlwdGlvblBhY2thZ2U6IEFycmF5PFN1YnNjcmlwdGlvblBhY2thZ2U+KSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsbnVsbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHN1YnNjcmlwdGlvblBhY2thZ2VbMF07XHJcbiAgICAgICAgICAgICAgbGV0IG5vT2ZEYXlzVG9FeHBpcnkgPSB0aGlzLmNhbGN1bGF0ZVZhbGlkaXR5KHN1YnNjcmlwdGlvbik7XHJcbiAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLnZhbGlkaXR5ID0gbm9PZkRheXNUb0V4cGlyeSArIHJlc3VsdC5hZGRPblBhY2thZ2UudmFsaWRpdHk7XHJcbiAgICAgICAgICAgICAgcmVzdWx0LmFkZE9uUGFja2FnZS5jb3N0ID0gY29zdEZvckJ1aWxkaW5nUHVyY2hhc2VkO1xyXG4gICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi5wdXJjaGFzZWQucHVzaChyZXN1bHQuYWRkT25QYWNrYWdlKTtcclxuICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVN1YnNjcmlwdGlvblBhY2thZ2UodXNlci5faWQscHJvamVjdElkLCBzdWJzY3JpcHRpb24sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6ICdQcm9qZWN0IFJlbmV3ZWQgc3VjY2Vzc2Z1bGx5J30pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgY2FzZSAnQWRkX2J1aWxkaW5nJzpcclxuICAgICAge1xyXG4gICAgICAgIHN1YlNjcmlwdGlvblNlcnZpY2UuZ2V0U3Vic2NyaXB0aW9uUGFja2FnZUJ5TmFtZSgnQWRkX2J1aWxkaW5nJywnYWRkT25QYWNrYWdlJyxcclxuICAgICAgICAgIChlcnJvcjogYW55LCBzdWJzY3JpcHRpb25QYWNrYWdlOiBBcnJheTxTdWJzY3JpcHRpb25QYWNrYWdlPikgPT4ge1xyXG4gICAgICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLG51bGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGxldCBwcm9qZWN0QnVpbGRpbmdzTGltaXQgPSBzdWJzY3JpcHRpb24ubnVtT2ZCdWlsZGluZ3MgKyBudW1iZXJPZkJ1aWxkaW5nc1B1cmNoYXNlZDtcclxuICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gc3Vic2NyaXB0aW9uUGFja2FnZVswXTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5hZGRPblBhY2thZ2UubnVtT2ZCdWlsZGluZ3MgPSBudW1iZXJPZkJ1aWxkaW5nc1B1cmNoYXNlZDtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5hZGRPblBhY2thZ2UuY29zdCA9IGNvc3RGb3JCdWlsZGluZ1B1cmNoYXNlZDtcclxuICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi5udW1PZkJ1aWxkaW5ncyA9IHN1YnNjcmlwdGlvbi5udW1PZkJ1aWxkaW5ncyArIHJlc3VsdC5hZGRPblBhY2thZ2UubnVtT2ZCdWlsZGluZ3M7XHJcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24ucHVyY2hhc2VkLnB1c2gocmVzdWx0LmFkZE9uUGFja2FnZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVN1YnNjcmlwdGlvblBhY2thZ2UodXNlci5faWQsIHByb2plY3RJZCxzdWJzY3JpcHRpb24sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogJ3N1Y2Nlc3MnfSk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGVTdWJzY3JpcHRpb25QYWNrYWdlKCB1c2VySWQ6IGFueSwgcHJvamVjdElkOnN0cmluZyx1cGRhdGVkU3Vic2NyaXB0aW9uOiBhbnksIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSk9PiB2b2lkKSB7XHJcbiAgICBsZXQgcHJvamVjdGlvbiA9IHtzdWJzY3JpcHRpb246IDF9O1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kQnlJZFdpdGhQcm9qZWN0aW9uKHVzZXJJZCxwcm9qZWN0aW9uLChlcnJvcixyZXN1bHQpPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IHN1YlNjcmlwdGlvbkFycmF5ID0gcmVzdWx0LnN1YnNjcmlwdGlvbjtcclxuICAgICAgICBmb3IgKGxldCBzdWJzY3JpcHRpb25JbmRleCA9MDsgc3Vic2NyaXB0aW9uSW5kZXg8IHN1YlNjcmlwdGlvbkFycmF5Lmxlbmd0aDsgc3Vic2NyaXB0aW9uSW5kZXgrKykge1xyXG4gICAgICAgICAgaWYgKHN1YlNjcmlwdGlvbkFycmF5W3N1YnNjcmlwdGlvbkluZGV4XS5wcm9qZWN0SWQubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgIGlmIChzdWJTY3JpcHRpb25BcnJheVtzdWJzY3JpcHRpb25JbmRleF0ucHJvamVjdElkWzBdLmVxdWFscyhwcm9qZWN0SWQpKSB7XHJcbiAgICAgICAgICAgICAgc3ViU2NyaXB0aW9uQXJyYXlbc3Vic2NyaXB0aW9uSW5kZXhdID0gdXBkYXRlZFN1YnNjcmlwdGlvbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcXVlcnkgPSB7J19pZCc6IHVzZXJJZH07XHJcbiAgICAgICAgbGV0IG5ld0RhdGEgPSB7JHNldDogeydzdWJzY3JpcHRpb24nOiBzdWJTY3JpcHRpb25BcnJheX19O1xyXG4gICAgICAgIHRoaXMudXNlclJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgbmV3RGF0YSwge25ldzogdHJ1ZX0sIChlcnIsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTonc3VjY2Vzcyd9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgIH1cclxuXHJcbiAgY2FsY3VsYXRlVmFsaWRpdHkoc3Vic2NyaXB0aW9uOiBhbnkpIHtcclxuICAgIGxldCBhY3RpdmF0aW9uRGF0ZSA9IG5ldyBEYXRlKHN1YnNjcmlwdGlvbi5hY3RpdmF0aW9uRGF0ZSk7XHJcbiAgICBsZXQgZXhwaXJ5RGF0ZSA9IG5ldyBEYXRlKHN1YnNjcmlwdGlvbi5hY3RpdmF0aW9uRGF0ZSk7XHJcbiAgICBsZXQgcHJvamVjdEV4cGlyeURhdGUgPSBuZXcgRGF0ZShleHBpcnlEYXRlLnNldERhdGUoYWN0aXZhdGlvbkRhdGUuZ2V0RGF0ZSgpICsgc3Vic2NyaXB0aW9uLnZhbGlkaXR5KSk7XHJcbiAgICBsZXQgY3VycmVudF9kYXRlID0gbmV3IERhdGUoKTtcclxuICAgIGxldCBkYXlzID0gdGhpcy5kYXlzZGlmZmVyZW5jZShwcm9qZWN0RXhwaXJ5RGF0ZSxjdXJyZW50X2RhdGUpO1xyXG4gICAgcmV0dXJuIGRheXM7XHJcbiAgfVxyXG5cclxuICBzZW5kUHJvamVjdEV4cGlyeVdhcm5pbmdNYWlscyhjYWxsYmFjazooZXJyb3IgOiBhbnksIHJlc3VsdCA6YW55KT0+dm9pZCkge1xyXG4gICAgbG9nZ2VyLmRlYnVnKCdzZW5kUHJvamVjdEV4cGlyeVdhcm5pbmdNYWlscyBpcyBiZWVuIGhpdCcpO1xyXG4gICAgbGV0IHF1ZXJ5ID0gW1xyXG4gICAgICB7ICRwcm9qZWN0IDogeyAnc3Vic2NyaXB0aW9uJyA6IDEsICdmaXJzdF9uYW1lJyA6IDEsICdlbWFpbCcgOiAxIH19LFxyXG4gICAgICB7ICR1bndpbmQgOiAnJHN1YnNjcmlwdGlvbicgfSxcclxuICAgICAgeyAkdW53aW5kIDogJyRzdWJzY3JpcHRpb24ucHJvamVjdElkJyB9XHJcbiAgICBdO1xyXG5cclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkuYWdncmVnYXRlKHF1ZXJ5LCAoZXJyb3IsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgbG9nZ2VyLmVycm9yKCdzZW5kUHJvamVjdEV4cGlyeVdhcm5pbmdNYWlscyBlcnJvciA6ICcrSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbG9nZ2VyLmRlYnVnKCdzZW5kUHJvamVjdEV4cGlyeVdhcm5pbmdNYWlscyBzdWNlc3MnKTtcclxuICAgICAgICBsZXQgdXNlckxpc3QgPSBuZXcgQXJyYXk8UHJvamVjdFN1YmNyaXB0aW9uPigpO1xyXG4gICAgICAgIGxldCB1c2VyU3Vic2NyaXB0aW9uUHJvbWlzZUFycmF5ID1bXTtcclxuXHJcbiAgICAgICAgZm9yKGxldCB1c2VyIG9mIHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ2dldGluZyBhbGwgdXNlciBkYXRhIGZvciBzZW5kaW5nIG1haWwgdG8gdXNlcnMuJyk7XHJcbiAgICAgICAgICBsZXQgdmFsaWRpdHlEYXlzID0gdGhpcy5jYWxjdWxhdGVWYWxpZGl0eSh1c2VyLnN1YnNjcmlwdGlvbik7XHJcbiAgICAgICAgICBsZXQgdmFsZGl0eURheXNWYWxpZGF0aW9uID0gY29uZmlnLmdldCgnY3JvbkpvYk1haWxOb3RpZmljYXRpb25WYWxpZGl0eURheXMnKTtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygndmFsaWRpdHlEYXlzIDogJyt2YWxpZGl0eURheXMpO1xyXG4gICAgICAgICAgaWYodmFsZGl0eURheXNWYWxpZGF0aW9uLmluZGV4T2YodmFsaWRpdHlEYXlzKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKCdjYWxsaW5nIHByb21pc2UnKTtcclxuICAgICAgICAgICAgbGV0IHByb21pc2VPYmplY3QgPSB0aGlzLmdldFByb2plY3REYXRhQnlJZCh1c2VyKTtcclxuICAgICAgICAgICAgdXNlclN1YnNjcmlwdGlvblByb21pc2VBcnJheS5wdXNoKHByb21pc2VPYmplY3QpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKCdpbnZhbGlkIHZhbGlkaXR5RGF5cyA6ICcrdmFsaWRpdHlEYXlzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHVzZXJTdWJzY3JpcHRpb25Qcm9taXNlQXJyYXkubGVuZ3RoICE9PSAwKSB7XHJcblxyXG4gICAgICAgICAgQ0NQcm9taXNlLmFsbCh1c2VyU3Vic2NyaXB0aW9uUHJvbWlzZUFycmF5KS50aGVuKGZ1bmN0aW9uKGRhdGE6IEFycmF5PGFueT4pIHtcclxuXHJcbiAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnZGF0YSByZWNpZXZlZCBmb3IgYWxsIHVzZXJzOiAnK0pTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuICAgICAgICAgICAgbGV0IHNlbmRNYWlsUHJvbWlzZUFycmF5ID0gW107XHJcblxyXG4gICAgICAgICAgICBmb3IobGV0IHVzZXIgb2YgZGF0YSkge1xyXG4gICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnQ2FsbGluZyBzZW5kTWFpbEZvclByb2plY3RFeHBpcnlUb1VzZXIgZm9yIHVzZXIgOiAnK0pTT04uc3RyaW5naWZ5KHVzZXIuZmlyc3RfbmFtZSkpO1xyXG4gICAgICAgICAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICAgICAgICAgIGxldCBzZW5kTWFpbFByb21pc2UgPSB1c2VyU2VydmljZS5zZW5kTWFpbEZvclByb2plY3RFeHBpcnlUb1VzZXIodXNlcik7XHJcbiAgICAgICAgICAgICAgc2VuZE1haWxQcm9taXNlQXJyYXkucHVzaChzZW5kTWFpbFByb21pc2UpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBDQ1Byb21pc2UuYWxsKHNlbmRNYWlsUHJvbWlzZUFycmF5KS50aGVuKGZ1bmN0aW9uKG1haWxTZW50RGF0YTogQXJyYXk8YW55Pikge1xyXG4gICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnbWFpbFNlbnREYXRhIGZvciBhbGwgdXNlcnM6ICcrSlNPTi5zdHJpbmdpZnkobWFpbFNlbnREYXRhKSk7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgeyAnZGF0YScgOiAnTWFpbCBzZW50IHN1Y2Nlc3NmdWxseSB0byB1c2Vycy4nIH0pO1xyXG4gICAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihlOmFueSkge1xyXG4gICAgICAgICAgICAgIGxvZ2dlci5lcnJvcignUHJvbWlzZSBmYWlsZWQgZm9yIGdldHRpbmcgbWFpbFNlbnREYXRhICEgOicgK0pTT04uc3RyaW5naWZ5KGUubWVzc2FnZSkpO1xyXG4gICAgICAgICAgICAgIENDUHJvbWlzZS5yZWplY3QoZS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZTphbnkpIHtcclxuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdQcm9taXNlIGZhaWxlZCBmb3Igc2VuZCBtYWlsIG5vdGlmaWNhdGlvbiAhIDonICtKU09OLnN0cmluZ2lmeShlLm1lc3NhZ2UpKTtcclxuICAgICAgICAgICAgQ0NQcm9taXNlLnJlamVjdChlLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5pbmZvKCdObyBhbnkgcHJvamVjdCBpcyBleHBpcmVkLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRQcm9qZWN0RGF0YUJ5SWQodXNlcjogYW55KSB7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBDQ1Byb21pc2UoZnVuY3Rpb24gKHJlc29sdmU6IGFueSwgcmVqZWN0OiBhbnkpIHtcclxuXHJcbiAgICAgIGxvZ2dlci5kZWJ1ZygnZ2V0aW5nIGFsbCB1c2VyIGRhdGEgZm9yIHNlbmRpbmcgbWFpbCB0byB1c2Vycy4nKTtcclxuXHJcbiAgICAgIGxldCBwcm9qZWN0U3Vic2NyaXB0aW9uID0gbmV3IFByb2plY3RTdWJjcmlwdGlvbigpO1xyXG4gICAgICBsZXQgcHJvamVjdGlvbiA9IHsgJ25hbWUnIDogMSB9O1xyXG4gICAgICBsZXQgcHJvamVjdFJlcG9zaXRvcnkgPSBuZXcgUHJvamVjdFJlcG9zaXRvcnkoKTtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcblxyXG4gICAgICBwcm9qZWN0UmVwb3NpdG9yeS5maW5kQnlJZFdpdGhQcm9qZWN0aW9uKHVzZXIuc3Vic2NyaXB0aW9uLnByb2plY3RJZCwgcHJvamVjdGlvbiwgKGVycm9yICwgcmVzcCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIGluIGZldGNoaW5nIFVzZXIgZGF0YScrSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcclxuICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnZ290IFByb2plY3RTdWJzY3JpcHRpb24gZm9yIHVzZXIgJysgdXNlci5faWQpO1xyXG4gICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi51c2VySWQgPSB1c2VyLl9pZDtcclxuICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24udXNlckVtYWlsID0gdXNlci5lbWFpbDtcclxuICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24uZmlyc3RfbmFtZSA9IHVzZXIuZmlyc3RfbmFtZTtcclxuICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24udmFsaWRpdHlEYXlzID0gdXNlci5zdWJzY3JpcHRpb24udmFsaWRpdHk7XHJcbiAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLnByb2plY3RFeHBpcnlEYXRlID0gdXNlclNlcnZpY2UuY2FsY3VsYXRlRXhwaXJ5RGF0ZSh1c2VyLnN1YnNjcmlwdGlvbik7XHJcbiAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLnByb2plY3ROYW1lID0gcmVzcC5uYW1lO1xyXG4gICAgICAgICAgcmVzb2x2ZShwcm9qZWN0U3Vic2NyaXB0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlOiBhbnkpIHtcclxuICAgICAgbG9nZ2VyLmVycm9yKCdQcm9taXNlIGZhaWxlZCBmb3IgaW5kaXZpZHVhbCBjcmVhdGVQcm9taXNlRm9yR2V0UHJvamVjdEJ5SWQgISBFcnJvcjogJyArIEpTT04uc3RyaW5naWZ5KGUubWVzc2FnZSkpO1xyXG4gICAgICBDQ1Byb21pc2UucmVqZWN0KGUubWVzc2FnZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNlbmRNYWlsRm9yUHJvamVjdEV4cGlyeVRvVXNlcih1c2VyOiBhbnkpIHtcclxuXHJcbiAgICByZXR1cm4gbmV3IENDUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZTogYW55LCByZWplY3Q6IGFueSkge1xyXG5cclxuICAgICAgbGV0IG1haWxTZXJ2aWNlID0gbmV3IFNlbmRNYWlsU2VydmljZSgpO1xyXG5cclxuICAgICAgbGV0IGF1dGggPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICAgIGxldCB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQodXNlcik7XHJcbiAgICAgIGxldCBob3N0ID0gY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5ob3N0Jyk7XHJcbiAgICAgIGxldCBodG1sVGVtcGxhdGUgPSAncHJvamVjdC1leHBpcnktbm90aWZpY2F0aW9uLW1haWwuaHRtbCc7XHJcblxyXG4gICAgICBsZXQgZGF0YTpNYXA8c3RyaW5nLHN0cmluZz49IG5ldyBNYXAoW1xyXG4gICAgICAgIFsnJGFwcGxpY2F0aW9uTGluayQnLGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpXSwgWyckZmlyc3RfbmFtZSQnLHVzZXIuZmlyc3RfbmFtZV0sXHJcbiAgICAgICAgWyckZXhwaXJ5X2RhdGUkJyx1c2VyLnByb2plY3RFeHBpcnlEYXRlXSwgWyckc3Vic2NyaXB0aW9uX2xpbmskJyxjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLmhvc3QnKSsgJ3NpZ25pbiddLFxyXG4gICAgICAgIFsnJGFwcF9uYW1lJCcsJ0J1aWxkSW5mbyAtIENvc3QgQ29udHJvbCddXSk7XHJcblxyXG4gICAgICBsZXQgYXR0YWNobWVudCA9IE1haWxBdHRhY2htZW50cy5BdHRhY2htZW50QXJyYXk7XHJcbiAgICAgIG1haWxTZXJ2aWNlLnNlbmQoIHVzZXIudXNlckVtYWlsLCBNZXNzYWdlcy5QUk9KRUNUX0VYUElSWV9XQVJOSU5HLCBodG1sVGVtcGxhdGUsIGRhdGEsYXR0YWNobWVudCxcclxuICAgICAgICAoZXJyOiBhbnksIHJlc3VsdDogYW55KSA9PiB7XHJcbiAgICAgICAgICBpZihlcnIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBzZW5kIG1haWwgdG8gdXNlciA6ICcrdXNlci51c2VyRW1haWwpO1xyXG4gICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdNYWlsIHNlbnQgc3VjY2Vzc2Z1bGx5IHRvIHVzZXIgOiAnK3VzZXIudXNlckVtYWlsKTtcclxuICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlOiBhbnkpIHtcclxuICAgICAgbG9nZ2VyLmVycm9yKCdQcm9taXNlIGZhaWxlZCBmb3IgaW5kaXZpZHVhbCBzZW5kTWFpbEZvclByb2plY3RFeHBpcnlUb1VzZXIgISBFcnJvcjogJyArIEpTT04uc3RyaW5naWZ5KGUubWVzc2FnZSkpO1xyXG4gICAgICBDQ1Byb21pc2UucmVqZWN0KGUubWVzc2FnZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNhbGN1bGF0ZUV4cGlyeURhdGUoc3Vic2NyaXB0aW9uIDogYW55KSB7XHJcbiAgICBsZXQgYWN0aXZhdGlvbkRhdGUgPSBuZXcgRGF0ZShzdWJzY3JpcHRpb24uYWN0aXZhdGlvbkRhdGUpO1xyXG4gICAgbGV0IGV4cGlyeURhdGUgPSBuZXcgRGF0ZShzdWJzY3JpcHRpb24uYWN0aXZhdGlvbkRhdGUpO1xyXG4gICAgbGV0IHByb2plY3RFeHBpcnlEYXRlID0gbmV3IERhdGUoZXhwaXJ5RGF0ZS5zZXREYXRlKGFjdGl2YXRpb25EYXRlLmdldERhdGUoKSArIHN1YnNjcmlwdGlvbi52YWxpZGl0eSkpO1xyXG4gICAgcmV0dXJuIHByb2plY3RFeHBpcnlEYXRlO1xyXG4gIH1cclxufVxyXG5cclxuT2JqZWN0LnNlYWwoVXNlclNlcnZpY2UpO1xyXG5leHBvcnQgPSBVc2VyU2VydmljZTtcclxuIl19
