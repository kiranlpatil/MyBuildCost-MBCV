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
                }, config.get('application.mail.BUILDINFO_ADMIN_MAIL'));
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
                var authInterceptor_1 = new AuthInterceptor();
                var populatedProject = result[0];
                var projectList = result[0].project;
                var subscriptionList = result[0].subscription;
                var projectSubscriptionArray_1 = Array();
                var sampleProjectSubscriptionArray_1 = Array();
                var isAbleToCreateNewProject_1 = false;
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
                                projectSubscriptionArray_1.push(projectSubscription);
                            }
                        }
                        else {
                            isAbleToCreateNewProject_1 = true;
                        }
                    }
                }
                if (projectList.length === 0 && subscriptionList[0].purchased.length !== 0) {
                    isAbleToCreateNewProject_1 = true;
                }
                var projectId = config.get('sampleProject.' + 'projectId');
                var projection = { 'name': 1, 'activeStatus': 1 };
                _this.projectRepository.findByIdWithProjection(projectId, projection, function (error, project) {
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        var data = project;
                        var sampleProjectSubscription = new ProjectSubscriptionDetails();
                        sampleProjectSubscription.projectName = project.name;
                        sampleProjectSubscription.projectId = project._id;
                        sampleProjectSubscription.activeStatus = project.activeStatus;
                        sampleProjectSubscriptionArray_1.push(sampleProjectSubscription);
                    }
                    callback(null, {
                        data: projectSubscriptionArray_1,
                        sampleProject: sampleProjectSubscriptionArray_1,
                        isSubscriptionAvailable: isAbleToCreateNewProject_1,
                        access_token: authInterceptor_1.issueTokenWithUid(user)
                    });
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
                ['$project_name$', user.projectName],
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
        var readabledate = projectExpiryDate.toDateString();
        return readabledate;
    };
    return UserService;
}());
Object.seal(UserService);
module.exports = UserService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvVXNlclNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHdFQUEyRTtBQUMzRSxrREFBcUQ7QUFDckQsMERBQTZEO0FBQzdELHVCQUF5QjtBQUN6QixtQ0FBcUM7QUFDckMsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7QUFFdkMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQiw2Q0FBZ0Q7QUFDaEQsOEVBQWlGO0FBQ2pGLHFEQUF3RDtBQUN4RCx1REFBMEQ7QUFFMUQsK0JBQWtDO0FBQ2xDLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3ZDLHVFQUFvRTtBQUczRSwyRkFBOEY7QUFHOUYsa0hBQXFIO0FBQ3JILG9HQUF1RztBQUN2RyxzSUFBeUk7QUFDekksbUVBQXVFO0FBQ3ZFLHFFQUF5RTtBQUN6RSx5R0FBNEc7QUFDNUcsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDdEQsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUM7QUFFOUM7SUFRRTtRQUpBLDhCQUF5QixHQUFTLEtBQUssQ0FBQztRQUt0QyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksaUJBQWlCLEVBQUUsQ0FBQztRQUNqRCxJQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUM7SUFD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LENBQUMsRUFBRSxFQUFFLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztRQUMzRixJQUFJLElBQXVCLENBQUM7UUFDNUIsRUFBRSxDQUFBLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDdkIsSUFBSSxHQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsRUFBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7Z0JBQ3RFLENBQUMsUUFBUSxFQUFDLFlBQVksQ0FBQyxFQUFDLENBQUMsUUFBUSxFQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztnQkFDdkUsQ0FBQyxVQUFVLEVBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFDLENBQUMsUUFBUSxFQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7Z0JBQ3ZELENBQUMsV0FBVyxFQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLFNBQVMsRUFBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU3RSxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzFCLElBQUksR0FBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLEVBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO2dCQUN0RSxDQUFDLFFBQVEsRUFBQyxZQUFZLENBQUMsRUFBQyxDQUFDLFFBQVEsRUFBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7Z0JBQ3RFLENBQUMsVUFBVSxFQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBQyxDQUFDLFFBQVEsRUFBQyxTQUFTLENBQUMsSUFBSSxDQUFDO2dCQUN2RCxDQUFDLFdBQVcsRUFBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxTQUFTLEVBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRSxDQUFDO1FBQ0QsSUFBSSxlQUFlLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztRQUM1QyxJQUFJLFVBQVUsR0FBRyxlQUFlLENBQUMsZUFBZSxDQUFDO1FBQ2pELGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxFQUM1RCxRQUFRLENBQUMsMEJBQTBCLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsRUFDbEYsaUJBQWlCLEVBQUMsSUFBSSxFQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDLENBQUM7SUFDOUYsQ0FBQztJQUVELDhCQUFRLEdBQVIsVUFBUyxFQUFPLEVBQUUsUUFBMkM7UUFDM0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCw4QkFBUSxHQUFSLFVBQVMsS0FBVSxFQUFFLFFBQTJDO1FBQzlELElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsdUNBQWlCLEdBQWpCLFVBQWtCLEtBQVUsRUFBRSxRQUFjLEVBQUUsUUFBMkM7UUFDdkYsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVELHNDQUFnQixHQUFoQixVQUFpQixLQUFVLEVBQUUsUUFBMkM7UUFDdEUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxpQ0FBVyxHQUFYLFVBQVksSUFBUyxFQUFFLFFBQTJDO1FBQ2hFLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFDLEdBQUcsRUFBRSxHQUFHO1lBQzFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxvQ0FBb0MsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzNFLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixRQUFRLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3RCLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCw0QkFBTSxHQUFOLFVBQU8sR0FBUSxFQUFFLElBQVMsRUFBRSxRQUEyQztRQUF2RSxpQkFVQztRQVJDLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxVQUFDLEdBQVEsRUFBRSxHQUFRO1lBRW5ELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsUUFBUSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNyQixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sS0FBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNsRCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBR0QsNEJBQU0sR0FBTixVQUFPLEdBQVcsRUFBRSxRQUEyQztRQUM3RCxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVELHNDQUFnQixHQUFoQixVQUFpQixLQUFVLEVBQUUsT0FBWSxFQUFFLE9BQVksRUFBRSxRQUEyQztRQUNsRyxJQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFRCxpQ0FBVyxHQUFYLFVBQVksUUFBYSxFQUFFLFFBQWEsRUFBRSxFQUFPO1FBQy9DLElBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQztRQUMxQixFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsVUFBVSxHQUFHO1lBQzNDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDckIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQscUNBQWUsR0FBZixVQUFnQixRQUFhLEVBQUUsUUFBYSxFQUFFLEVBQU87UUFDbkQsSUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDO1FBQzFCLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxVQUFVLEdBQVE7WUFDaEQsRUFBRSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNyQixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCwrQ0FBeUIsR0FBekIsVUFBMEIsS0FBVSxFQUFFLE9BQVksRUFBRSxPQUFZLEVBQUUsUUFBMkM7UUFDM0csSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRUQsMkNBQXFCLEdBQXJCLFVBQXNCLEtBQVUsRUFBRSxVQUFjLEVBQUUsWUFBaUIsRUFBRSxRQUEyQztJQUVoSCxDQUFDO0lBRUQsbUNBQWEsR0FBYixVQUFjLElBQVMsRUFBRSxJQUFVLEVBQUUsUUFBd0M7UUFBN0UsaUJBeUJDO1FBeEJDLElBQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUN0QixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsVUFBVSxFQUFFLFVBQUMsR0FBUSxFQUFFLElBQVM7WUFDN0QsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDUixRQUFRLENBQUM7b0JBQ1AsTUFBTSxFQUFFLHFDQUFxQztvQkFDN0MsT0FBTyxFQUFFLHFDQUFxQztvQkFDOUMsVUFBVSxFQUFFLElBQUksS0FBSyxFQUFFO29CQUN2QixJQUFJLEVBQUUsR0FBRztpQkFDVixFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ1gsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLElBQUksVUFBVSxHQUFHLEVBQUMsVUFBVSxFQUFFLElBQUksRUFBQyxDQUFDO2dCQUNwQyxJQUFJLEtBQUssR0FBRyxFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFDLENBQUM7Z0JBQ3pELEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBQyxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07b0JBQ2xFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7d0JBQ1YsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDeEIsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDTixRQUFRLENBQUMsSUFBSSxFQUFDOzRCQUNaLFFBQVEsRUFBRSxTQUFTOzRCQUNuQixNQUFNLEVBQUUsRUFBQyxTQUFTLEVBQUUsK0JBQStCLEVBQUM7eUJBQ3JELENBQUMsQ0FBQztvQkFDTCxDQUFDO2dCQUNILENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELG1DQUFhLEdBQWIsVUFBYyxJQUFnQixFQUFFLElBQWUsRUFBRSxRQUEwQztRQUN6RixJQUFJLElBQUksR0FBb0IsSUFBSSxlQUFlLEVBQUUsQ0FBQztRQUNsRCxJQUFJLEtBQUssR0FBRyxFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBQyxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07WUFDM0UsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVixRQUFRLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3hCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixRQUFRLENBQUMsSUFBSSxFQUFDO29CQUNaLFFBQVEsRUFBRSxTQUFTO29CQUNuQixNQUFNLEVBQUUsRUFBQyxTQUFTLEVBQUUsbUNBQW1DLEVBQUM7aUJBQ3pELENBQUMsQ0FBQztZQUNMLENBQUM7UUFFSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxpQ0FBVyxHQUFYLFVBQVksSUFBUSxFQUFFLFFBQXNDO1FBQzFELElBQUksSUFBSSxHQUFvQixJQUFJLGVBQWUsRUFBRSxDQUFDO1FBRWxELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QyxRQUFRLENBQUMsSUFBSSxFQUFDO1lBQ1osUUFBUSxFQUFFLFNBQVM7WUFDbkIsTUFBTSxFQUFFO2dCQUNOLFlBQVksRUFBRSxJQUFJLENBQUMsVUFBVTtnQkFDN0IsV0FBVyxFQUFFLElBQUksQ0FBQyxTQUFTO2dCQUMzQixPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ25CLGVBQWUsRUFBRSxJQUFJLENBQUMsYUFBYTtnQkFDbkMsY0FBYyxFQUFFLElBQUksQ0FBQyxZQUFZO2dCQUNqQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ25CLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDakIsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPO2dCQUN2Qix3QkFBd0IsRUFBRSxJQUFJLENBQUMsc0JBQXNCO2dCQUNyRCxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUc7Z0JBQ2YsZUFBZSxFQUFFLElBQUksQ0FBQyxhQUFhO2FBQ3BDO1lBQ0QsWUFBWSxFQUFFLEtBQUs7U0FDcEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELG1DQUFhLEdBQWIsVUFBYyxJQUFTLEVBQUUsUUFBc0M7UUFDN0QsSUFBSSxLQUFLLEdBQUcsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFDLENBQUM7UUFDcEQsSUFBSSxVQUFVLEdBQUcsRUFBQyxhQUFhLEVBQUUsSUFBSSxFQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFDLEVBQUUsVUFBQyxLQUFLLEVBQUUsTUFBTTtZQUNsRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNWLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDeEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLFFBQVEsQ0FBQyxJQUFJLEVBQUM7b0JBQ1osUUFBUSxFQUFFLFNBQVM7b0JBQ25CLE1BQU0sRUFBRSxFQUFDLFNBQVMsRUFBRSxvQ0FBb0MsRUFBQztpQkFDMUQsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztRQUVILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELG1DQUFhLEdBQWIsVUFBYyxJQUFRLEVBQUUsSUFBVyxFQUFFLFFBQXNDO1FBQTNFLGlCQTBEQztRQXpEQyxJQUFJLElBQUksR0FBb0IsSUFBSSxlQUFlLEVBQUUsQ0FBQztRQUNsRCxJQUFJLEtBQUssR0FBRyxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFDLENBQUM7UUFFdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBQyxLQUFLLEVBQUUsTUFBTTtZQUVqQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNWLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDeEIsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQy9ELFFBQVEsQ0FBQztvQkFDUCxNQUFNLEVBQUUsUUFBUSxDQUFDLDJCQUEyQjtvQkFDNUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxzQkFBc0I7b0JBQ3hDLFVBQVUsRUFBRSxJQUFJLEtBQUssRUFBRTtvQkFDdkIsSUFBSSxFQUFFLEdBQUc7aUJBQ1YsRUFBQyxJQUFJLENBQUMsQ0FBQztZQUNWLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNoRSxRQUFRLENBQUM7b0JBQ1AsTUFBTSxFQUFFLFFBQVEsQ0FBQywyQkFBMkI7b0JBQzVDLE9BQU8sRUFBRSxRQUFRLENBQUMsd0JBQXdCO29CQUMxQyxVQUFVLEVBQUUsSUFBSSxLQUFLLEVBQUU7b0JBQ3ZCLElBQUksRUFBRSxHQUFHO2lCQUNWLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDWCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sS0FBSSxDQUFDLDBCQUEwQixDQUFDLElBQUksRUFBRSxVQUFDLEtBQUssRUFBRSxNQUFNO29CQUNsRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUNWLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssUUFBUSxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQzs0QkFDN0QsUUFBUSxDQUFDO2dDQUNQLE1BQU0sRUFBRSxRQUFRLENBQUMsMkJBQTJCO2dDQUM1QyxPQUFPLEVBQUUsUUFBUSxDQUFDLDBCQUEwQjtnQ0FDNUMsVUFBVSxFQUFFLElBQUksS0FBSyxFQUFFO2dDQUN2QixJQUFJLEVBQUUsR0FBRzs2QkFDVixFQUFFLElBQUksQ0FBQyxDQUFDO3dCQUNYLENBQUM7d0JBQUEsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxRQUFRLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDOzRCQUN6RCxRQUFRLENBQUM7Z0NBQ1AsTUFBTSxFQUFFLFFBQVEsQ0FBQyx3QkFBd0I7Z0NBQ3pDLE9BQU8sRUFBRSxRQUFRLENBQUMsd0JBQXdCO2dDQUMxQyxVQUFVLEVBQUUsSUFBSSxLQUFLLEVBQUU7Z0NBQ3ZCLElBQUksRUFBRSxHQUFHOzZCQUNWLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQ1gsQ0FBQzt3QkFBQyxJQUFJLENBQUMsQ0FBQzs0QkFDTixRQUFRLENBQUM7Z0NBQ1AsTUFBTSxFQUFFLFFBQVEsQ0FBQyw4QkFBOEI7Z0NBQy9DLE9BQU8sRUFBRSxRQUFRLENBQUMsMEJBQTBCO2dDQUM1QyxVQUFVLEVBQUUsSUFBSSxLQUFLLEVBQUU7Z0NBQ3ZCLElBQUksRUFBRSxHQUFHOzZCQUNWLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBRVgsQ0FBQztvQkFDSCxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNOLFFBQVEsQ0FBQyxJQUFJLEVBQUU7NEJBQ2IsUUFBUSxFQUFFLFFBQVEsQ0FBQyxjQUFjOzRCQUNqQyxNQUFNLEVBQUUsRUFBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLGdDQUFnQyxFQUFDO3lCQUMvRCxDQUFDLENBQUM7b0JBQ0wsQ0FBQztnQkFDSCxDQUFDLENBQUMsQ0FBQztZQUVMLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCwwQ0FBb0IsR0FBcEIsVUFBcUIsSUFBUyxFQUFFLFFBQTBDO1FBQ3hFLElBQUksS0FBSyxHQUFHLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUMsQ0FBQztRQUM5QixJQUFJLFVBQVUsR0FBRyxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFDLEVBQUUsVUFBQyxLQUFLLEVBQUUsTUFBTTtZQUNsRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNWLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDeEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLFFBQVEsQ0FBQyxJQUFJLEVBQUM7b0JBQ1osUUFBUSxFQUFFLFNBQVM7b0JBQ25CLE1BQU0sRUFBRSxFQUFDLFNBQVMsRUFBRSxvQ0FBb0MsRUFBQztpQkFDMUQsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztRQUVILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELHdDQUFrQixHQUFsQixVQUFtQixJQUFTLEVBQUcsSUFBVSxFQUFFLFFBQXNDO1FBQy9FLElBQUksS0FBSyxHQUFHLEVBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUMsQ0FBQztRQUM5QixJQUFJLFVBQVUsR0FBRyxFQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFDLENBQUM7UUFDeEYsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUMsRUFBRSxVQUFDLEtBQUssRUFBRSxNQUFNO2dCQUNsRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNWLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3hCLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sUUFBUSxDQUFDLElBQUksRUFBQzt3QkFDWixRQUFRLEVBQUUsU0FBUzt3QkFDbkIsTUFBTSxFQUFFLEVBQUMsU0FBUyxFQUFFLG9DQUFvQyxFQUFDO3FCQUMxRCxDQUFDLENBQUM7Z0JBQ0wsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sUUFBUSxDQUFDO2dCQUNQLE1BQU0sRUFBRSxRQUFRLENBQUMsaUNBQWlDO2dCQUNsRCxPQUFPLEVBQUUsUUFBUSxDQUFDLG1CQUFtQjtnQkFDckMsVUFBVSxFQUFFLElBQUksS0FBSyxFQUFFO2dCQUN2QixJQUFJLEVBQUUsR0FBRzthQUNWLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDWCxDQUFDO0lBQ0gsQ0FBQztJQUVELDBDQUFvQixHQUFwQixVQUFxQixJQUFTLEVBQUMsTUFBYSxFQUFFLElBQVksRUFBQyxRQUEyQztRQUF0RyxpQkE0Q0M7UUEzQ0MsSUFBSSxVQUFVLEdBQUcsRUFBQyxZQUFZLEVBQUUsQ0FBQyxFQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLFVBQUMsS0FBSyxFQUFDLE1BQU07WUFDeEUsRUFBRSxDQUFBLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVCxRQUFRLENBQUMsS0FBSyxFQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixJQUFJLG1CQUFpQixHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7Z0JBQzVDLElBQUksbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO2dCQUNwRCxtQkFBbUIsQ0FBQyw0QkFBNEIsQ0FBQyxTQUFTLEVBQUMsYUFBYSxFQUN0RSxVQUFDLEtBQVUsRUFBRSxtQkFBK0M7b0JBQzFELEVBQUUsQ0FBQSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7d0JBQ1QsUUFBUSxDQUFDLEtBQUssRUFBQyxJQUFJLENBQUMsQ0FBQztvQkFDdkIsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDTixJQUFJLGNBQWMsR0FBRyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDNUMsRUFBRSxDQUFBLENBQUMsbUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUMvQyxtQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUM7NEJBQ2hGLG1CQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsR0FBRyxjQUFjLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQzs0QkFDOUUsbUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLG1CQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxjQUFjLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQzs0QkFDcEcsbUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUM7d0JBQ2xFLENBQUM7d0JBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ04sSUFBSSxZQUFZLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDOzRCQUMxQyxZQUFZLENBQUMsY0FBYyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7NEJBQ3pDLFlBQVksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUM7NEJBQ3hFLFlBQVksQ0FBQyxhQUFhLEdBQUcsY0FBYyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUM7NEJBQ3RFLFlBQVksQ0FBQyxRQUFRLEdBQUcsY0FBYyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUM7NEJBQzVELGNBQWMsQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQzs0QkFDdkMsWUFBWSxDQUFDLFNBQVMsR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDOzRCQUM3QyxZQUFZLENBQUMsU0FBUyxHQUFHLElBQUksS0FBSyxFQUEyQixDQUFDOzRCQUM5RCxZQUFZLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUM7NEJBQ3hELG1CQUFpQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQzt3QkFDdkMsQ0FBQzt3QkFDRCxJQUFJLEtBQUssR0FBRyxFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUMsQ0FBQzt3QkFDNUIsSUFBSSxPQUFPLEdBQUcsRUFBQyxJQUFJLEVBQUUsRUFBQyxjQUFjLEVBQUUsbUJBQWlCLEVBQUMsRUFBQyxDQUFDO3dCQUMxRCxLQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFDLEVBQUUsVUFBQyxHQUFHLEVBQUUsUUFBUTs0QkFDOUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQ0FDUixRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDOzRCQUN0QixDQUFDOzRCQUFDLElBQUksQ0FBQyxDQUFDO2dDQUNOLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBQyxJQUFJLEVBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQzs0QkFDbkMsQ0FBQzt3QkFDSCxDQUFDLENBQUMsQ0FBQztvQkFDTCxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGlDQUFXLEdBQVgsVUFBWSxJQUFVLEVBQUUsUUFBeUM7UUFBakUsaUJBbUZDO1FBakZDLElBQUksS0FBSyxHQUFHLEVBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUM3QixJQUFJLFFBQVEsR0FBRyxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLENBQUMsTUFBTSxFQUFDLFdBQVcsRUFBQyxjQUFjLENBQUMsRUFBQyxDQUFDO1FBQzlFLElBQUksQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsVUFBQyxLQUFLLEVBQUUsTUFBTTtZQUNqRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNWLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDeEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLElBQUksaUJBQWUsR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDO2dCQUM1QyxJQUFJLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakMsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDcEMsSUFBSSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDO2dCQUU5QyxJQUFJLDBCQUF3QixHQUFHLEtBQUssRUFBOEIsQ0FBQztnQkFDbkUsSUFBSSxnQ0FBOEIsR0FBRyxLQUFLLEVBQThCLENBQUM7Z0JBQ3pFLElBQUksMEJBQXdCLEdBQWEsS0FBSyxDQUFDO2dCQUMvQyxHQUFHLENBQUEsQ0FBZ0IsVUFBVyxFQUFYLDJCQUFXLEVBQVgseUJBQVcsRUFBWCxJQUFXO29CQUExQixJQUFJLE9BQU8sb0JBQUE7b0JBQ2IsR0FBRyxDQUFBLENBQXFCLFVBQWdCLEVBQWhCLHFDQUFnQixFQUFoQiw4QkFBZ0IsRUFBaEIsSUFBZ0I7d0JBQXBDLElBQUksWUFBWSx5QkFBQTt3QkFDbEIsRUFBRSxDQUFBLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDdkMsRUFBRSxDQUFBLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDakQsSUFBSSxtQkFBbUIsR0FBRyxJQUFJLDBCQUEwQixFQUFFLENBQUM7Z0NBQzNELG1CQUFtQixDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO2dDQUMvQyxtQkFBbUIsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztnQ0FDNUMsbUJBQW1CLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7Z0NBQ3hELG1CQUFtQixDQUFDLHVCQUF1QixHQUFHLENBQUMsWUFBWSxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dDQUN2RyxtQkFBbUIsQ0FBQyx1QkFBdUIsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztnQ0FDdkUsbUJBQW1CLENBQUMsV0FBVyxHQUFHLEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQ0FFekUsSUFBSSxlQUFlLEdBQUcsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dDQUM1RCxJQUFJLFVBQVUsR0FBRyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUM7Z0NBQ3ZELG1CQUFtQixDQUFDLFVBQVUsR0FBRyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQ0FHakgsSUFBSSxZQUFZLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztnQ0FDOUIsSUFBSSxhQUFhLEdBQUcsSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLENBQUM7Z0NBQzdELGFBQWEsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dDQUNyRSxJQUFJLFFBQVEsR0FBSSxLQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsRUFBRyxZQUFZLENBQUMsQ0FBQztnQ0FDbEUsbUJBQW1CLENBQUMsaUJBQWlCLEdBQUcsS0FBSSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0NBRTFHLEVBQUUsQ0FBQSxDQUFDLG1CQUFtQixDQUFDLGlCQUFpQixHQUFHLEVBQUUsSUFBSSxtQkFBbUIsQ0FBQyxpQkFBaUIsR0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO29DQUMxRixtQkFBbUIsQ0FBQyxjQUFjO3dDQUNoQyxjQUFjLEdBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLFFBQVEsQ0FBRTtnQ0FDcEYsQ0FBQztnQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFBLENBQUMsbUJBQW1CLENBQUMsaUJBQWlCLElBQUksQ0FBQyxJQUFLLFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29DQUN2RSxtQkFBbUIsQ0FBQyxhQUFhLEdBQUksa0JBQWtCLENBQUM7Z0NBQzFELENBQUM7Z0NBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29DQUN2QixtQkFBbUIsQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO2dDQUMzQyxDQUFDO2dDQUVELDBCQUF3QixDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOzRCQUVyRCxDQUFDO3dCQUNILENBQUM7d0JBQUMsSUFBSSxDQUFFLENBQUM7NEJBQ1AsMEJBQXdCLEdBQUcsSUFBSSxDQUFDO3dCQUNsQyxDQUFDO3FCQUNGO2lCQUNGO2dCQUVELEVBQUUsQ0FBQSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEtBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDekUsMEJBQXdCLEdBQUcsSUFBSSxDQUFDO2dCQUNsQyxDQUFDO2dCQUVELElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEdBQUcsV0FBVyxDQUFDLENBQUM7Z0JBQzNELElBQUksVUFBVSxHQUFHLEVBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxjQUFjLEVBQUUsQ0FBQyxFQUFDLENBQUM7Z0JBQ2hELEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxzQkFBc0IsQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQUMsS0FBSyxFQUFFLE9BQU87b0JBQ2xGLEVBQUUsQ0FBQSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7d0JBQ1QsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDeEIsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDTixJQUFJLElBQUksR0FBRyxPQUFPLENBQUM7d0JBQ25CLElBQUkseUJBQXlCLEdBQUcsSUFBSSwwQkFBMEIsRUFBRSxDQUFDO3dCQUNqRSx5QkFBeUIsQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQzt3QkFDckQseUJBQXlCLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7d0JBQ2xELHlCQUF5QixDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDO3dCQUM5RCxnQ0FBOEIsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQztvQkFDakUsQ0FBQztvQkFDRCxRQUFRLENBQUMsSUFBSSxFQUFFO3dCQUNiLElBQUksRUFBRSwwQkFBd0I7d0JBQzlCLGFBQWEsRUFBRSxnQ0FBOEI7d0JBQzdDLHVCQUF1QixFQUFHLDBCQUF3Qjt3QkFDbEQsWUFBWSxFQUFFLGlCQUFlLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDO3FCQUN0RCxDQUFDLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBR0EseUNBQW1CLEdBQW5CLFVBQW9CLFlBQWdCO1FBQ2xDLElBQUksZUFBZSxHQUFHLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM1RCxJQUFJLFVBQVUsR0FBRyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDdkQsSUFBSSxlQUFlLEdBQUcsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzVELElBQUksWUFBWSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDOUIsR0FBRyxDQUFBLENBQXdCLFVBQXNCLEVBQXRCLEtBQUEsWUFBWSxDQUFDLFNBQVMsRUFBdEIsY0FBc0IsRUFBdEIsSUFBc0I7WUFBN0MsSUFBSSxlQUFlLFNBQUE7WUFDckIsZUFBZSxHQUFHLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxHQUFHLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzFHLEdBQUcsQ0FBQyxDQUF3QixVQUFzQixFQUF0QixLQUFBLFlBQVksQ0FBQyxTQUFTLEVBQXRCLGNBQXNCLEVBQXRCLElBQXNCO2dCQUE3QyxJQUFJLGlCQUFlLFNBQUE7Z0JBRXRCLFVBQVUsR0FBRyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxpQkFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hHLEVBQUUsQ0FBQyxDQUFDLENBQUMsZUFBZSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbEUsTUFBTSxDQUFDLGlCQUFlLENBQUMsSUFBSSxDQUFDO2dCQUM1QixDQUFDO2FBQ0o7WUFDRCxFQUFFLENBQUEsQ0FBQyxlQUFlLENBQUMsSUFBSSxLQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxHQUFDLE1BQU0sQ0FBQztZQUNyQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEdBQUMsU0FBUyxDQUFDO1lBQ3hDLENBQUM7U0FDRjtJQUNGLENBQUM7SUFFSCxvQ0FBYyxHQUFkLFVBQWUsS0FBWSxFQUFFLEtBQVk7UUFDdkMsSUFBSSxNQUFNLEdBQUcsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2pDLElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUMvQixJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDL0IsSUFBSSxhQUFhLEdBQUcsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLENBQUM7UUFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRCw0Q0FBc0IsR0FBdEIsVUFBdUIsSUFBVSxFQUFFLFNBQWlCLEVBQUUsUUFBeUM7UUFBL0YsaUJBMERDO1FBeERDLElBQUksS0FBSyxHQUFHO1lBQ1YsRUFBQyxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBQyxFQUFDO1lBQ3BDLEVBQUUsUUFBUSxFQUFHLEVBQUMsY0FBYyxFQUFDLENBQUMsRUFBQyxFQUFDO1lBQ2hDLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBQztZQUMzQixFQUFFLE1BQU0sRUFBRSxFQUFDLHdCQUF3QixFQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBQyxFQUFDO1NBQzVELENBQUM7UUFDRixJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsVUFBQyxLQUFLLEVBQUUsTUFBTTtZQUNqRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNWLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDeEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLElBQUksT0FBSyxHQUFHLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBQyxDQUFDO2dCQUM5QixJQUFJLFFBQVEsR0FBRyxFQUFDLElBQUksRUFBRyxXQUFXLEVBQUMsQ0FBQztnQkFDcEMsS0FBSSxDQUFDLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxPQUFLLEVBQUUsUUFBUSxFQUFFLFVBQUMsS0FBSyxFQUFFLElBQUk7b0JBQ2xFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7d0JBQ1YsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDeEIsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDTixJQUFJLG1CQUFtQixHQUFHLElBQUksMEJBQTBCLEVBQUUsQ0FBQzt3QkFDM0QsbUJBQW1CLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7d0JBQy9DLG1CQUFtQixDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO3dCQUM1QyxtQkFBbUIsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQzt3QkFDeEQsbUJBQW1CLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7d0JBQ3ZFLG1CQUFtQixDQUFDLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDO3dCQUNoRixtQkFBbUIsQ0FBQyx1QkFBdUIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBQ2pILEVBQUUsQ0FBQSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsY0FBYyxLQUFLLEVBQUUsSUFBSSxtQkFBbUIsQ0FBQyx1QkFBdUIsS0FBSSxDQUFDLElBQUksbUJBQW1CLENBQUMsV0FBVyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7NEJBQ2xKLG1CQUFtQixDQUFDLGtCQUFrQixHQUFDLElBQUksQ0FBQzt3QkFDNUMsQ0FBQzt3QkFDSCxtQkFBbUIsQ0FBQyxXQUFXLEdBQUcsS0FBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQzt3QkFDbkYsRUFBRSxDQUFBLENBQUMsbUJBQW1CLENBQUMsV0FBVyxLQUFLLE1BQU0sSUFBSSxtQkFBbUIsQ0FBQyx1QkFBdUIsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNuRyxtQkFBbUIsQ0FBQyxrQkFBa0IsR0FBQyxJQUFJLENBQUM7d0JBQzlDLENBQUM7d0JBRUQsSUFBSSxlQUFlLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQzt3QkFDdEUsSUFBSSxVQUFVLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQzt3QkFDakUsbUJBQW1CLENBQUMsVUFBVSxHQUFHLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzt3QkFHM0gsSUFBSSxZQUFZLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQzt3QkFDOUIsSUFBSSxhQUFhLEdBQUcsSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLENBQUM7d0JBQzdELGFBQWEsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO3dCQUNyRSxJQUFJLFFBQVEsR0FBSSxLQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsRUFBRyxZQUFZLENBQUMsQ0FBQzt3QkFFbEUsbUJBQW1CLENBQUMsaUJBQWlCLEdBQUcsS0FBSSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUM7d0JBRTFHLEVBQUUsQ0FBQSxDQUFDLG1CQUFtQixDQUFDLGlCQUFpQixHQUFHLEVBQUUsSUFBSSxtQkFBbUIsQ0FBQyxpQkFBaUIsR0FBRSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUMxRixtQkFBbUIsQ0FBQyxjQUFjO2dDQUNoQyxjQUFjLEdBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLFFBQVEsQ0FBRTt3QkFDcEYsQ0FBQzt3QkFBQyxJQUFJLENBQUMsRUFBRSxDQUFBLENBQUMsbUJBQW1CLENBQUMsaUJBQWlCLElBQUksQ0FBQyxJQUFJLFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUN0RSxtQkFBbUIsQ0FBQyxhQUFhLEdBQUcsa0JBQWtCLENBQUM7d0JBQ3pELENBQUM7d0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUN2QixtQkFBbUIsQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO3dCQUMzQyxDQUFDO3dCQUNELFFBQVEsQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztvQkFDdEMsQ0FBQztnQkFDSCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCx3Q0FBa0IsR0FBbEIsVUFBbUIsSUFBVyxFQUFFLFNBQWlCLEVBQUUsV0FBbUIsRUFBQyx3QkFBNEIsRUFBQywwQkFBOEIsRUFBRSxRQUF5QztRQUE3SyxpQkEyQkM7UUExQkMsSUFBSSxLQUFLLEdBQUc7WUFDVixFQUFDLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFDLEVBQUM7WUFDcEMsRUFBRSxRQUFRLEVBQUcsRUFBQyxjQUFjLEVBQUMsQ0FBQyxFQUFDLEVBQUM7WUFDaEMsRUFBRSxPQUFPLEVBQUUsZUFBZSxFQUFDO1lBQzNCLEVBQUUsTUFBTSxFQUFFLEVBQUMsd0JBQXdCLEVBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFDLEVBQUM7U0FDNUQsQ0FBQztRQUNILElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxVQUFDLEtBQUssRUFBQyxNQUFNO1lBQ2hELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN4QixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQztnQkFDMUMsS0FBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBQyx3QkFBd0IsRUFBQywwQkFBMEIsRUFBQyxTQUFTLEVBQUMsVUFBQyxLQUFLLEVBQUUsTUFBTTtvQkFDN0gsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzt3QkFDVixJQUFJLE9BQUssR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO3dCQUN4QixPQUFLLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQywwQkFBMEIsQ0FBQzt3QkFDcEQsUUFBUSxDQUFDLE9BQUssRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDeEIsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDTixFQUFFLENBQUEsQ0FBQyxXQUFXLEtBQUssU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7NEJBQzNDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLHlCQUF5QixFQUFDLENBQUMsQ0FBQzt3QkFDN0QsQ0FBQzt3QkFBQyxJQUFJLENBQUMsQ0FBQzs0QkFDTixRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUM7d0JBQ3BDLENBQUM7b0JBQ0gsQ0FBQztnQkFDSCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCxtQ0FBYSxHQUFiLFVBQWMsSUFBVSxFQUFFLFlBQWlCLEVBQUUsV0FBbUIsRUFBQyx3QkFBNEIsRUFBQywwQkFBOEIsRUFBRSxTQUFnQixFQUFFLFFBQXlDO1FBQXpMLGlCQThFQztRQTdFQyxJQUFJLG1CQUFtQixHQUFHLElBQUksbUJBQW1CLEVBQUUsQ0FBQztRQUNwRCxNQUFNLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLEtBQUssU0FBUztnQkFDZCxDQUFDO29CQUNDLG1CQUFtQixDQUFDLDRCQUE0QixDQUFDLFNBQVMsRUFBQyxhQUFhLEVBQ3RFLFVBQUMsS0FBVSxFQUFFLG1CQUErQzt3QkFDMUQsRUFBRSxDQUFBLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs0QkFDVCxRQUFRLENBQUMsS0FBSyxFQUFDLElBQUksQ0FBQyxDQUFDO3dCQUN2QixDQUFDO3dCQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNOLElBQUksTUFBTSxHQUFHLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNwQyxZQUFZLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDOzRCQUNoRSxZQUFZLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDOzRCQUM5RCxJQUFJLGdCQUFnQixHQUFHLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsQ0FBQzs0QkFDNUQsWUFBWSxDQUFDLFFBQVEsR0FBRyxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQzs0QkFDdkUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsd0JBQXdCLENBQUM7NEJBQ25ELFlBQVksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQzs0QkFDaEQsS0FBSSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFDLFlBQVksRUFBRSxVQUFDLEtBQUssRUFBRSxNQUFNO2dDQUM3RSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29DQUNWLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0NBQ3hCLENBQUM7Z0NBQUMsSUFBSSxDQUFDLENBQUM7b0NBQ04sUUFBUSxDQUFDLElBQUksRUFBRSxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO2dDQUNwQyxDQUFDOzRCQUNILENBQUMsQ0FBQyxDQUFDO3dCQUNMLENBQUM7b0JBQ0gsQ0FBQyxDQUFDLENBQUM7b0JBQ0wsS0FBSyxDQUFDO2dCQUNSLENBQUM7WUFFRCxLQUFLLGNBQWM7Z0JBQ25CLENBQUM7b0JBQ0MsbUJBQW1CLENBQUMsNEJBQTRCLENBQUMsY0FBYyxFQUFDLGNBQWMsRUFDNUUsVUFBQyxLQUFVLEVBQUUsbUJBQStDO3dCQUMxRCxFQUFFLENBQUEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOzRCQUNULFFBQVEsQ0FBQyxLQUFLLEVBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ3ZCLENBQUM7d0JBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ04sSUFBSSxNQUFNLEdBQUcsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3BDLElBQUksZ0JBQWdCLEdBQUcsS0FBSSxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxDQUFDOzRCQUM1RCxZQUFZLENBQUMsUUFBUSxHQUFHLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDOzRCQUN4RSxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksR0FBRyx3QkFBd0IsQ0FBQzs0QkFDcEQsWUFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDOzRCQUNqRCxLQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07Z0NBQzdFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0NBQ1YsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztnQ0FDeEIsQ0FBQztnQ0FBQyxJQUFJLENBQUMsQ0FBQztvQ0FDTixRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUMsSUFBSSxFQUFFLDhCQUE4QixFQUFDLENBQUMsQ0FBQztnQ0FDekQsQ0FBQzs0QkFDSCxDQUFDLENBQUMsQ0FBQzt3QkFDTCxDQUFDO29CQUNILENBQUMsQ0FBQyxDQUFDO29CQUNMLEtBQUssQ0FBQztnQkFDUixDQUFDO1lBRUQsS0FBSyxjQUFjO2dCQUNuQixDQUFDO29CQUNDLG1CQUFtQixDQUFDLDRCQUE0QixDQUFDLGNBQWMsRUFBQyxjQUFjLEVBQzVFLFVBQUMsS0FBVSxFQUFFLG1CQUErQzt3QkFDMUQsRUFBRSxDQUFBLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs0QkFDVCxRQUFRLENBQUMsS0FBSyxFQUFDLElBQUksQ0FBQyxDQUFDO3dCQUN2QixDQUFDO3dCQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNOLElBQUkscUJBQXFCLEdBQUcsWUFBWSxDQUFDLGNBQWMsR0FBRywwQkFBMEIsQ0FBQzs0QkFDckYsSUFBSSxNQUFNLEdBQUcsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ2xDLE1BQU0sQ0FBQyxZQUFZLENBQUMsY0FBYyxHQUFHLDBCQUEwQixDQUFDOzRCQUNoRSxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksR0FBRyx3QkFBd0IsQ0FBQzs0QkFDcEQsWUFBWSxDQUFDLGNBQWMsR0FBRyxZQUFZLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDOzRCQUMvRixZQUFZLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7NEJBQ2pELEtBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBQyxZQUFZLEVBQUUsVUFBQyxLQUFLLEVBQUUsTUFBTTtnQ0FDN0UsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQ0FDVixRQUFRLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO2dDQUN4QixDQUFDO2dDQUFDLElBQUksQ0FBQyxDQUFDO29DQUNOLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztnQ0FDcEMsQ0FBQzs0QkFDSCxDQUFDLENBQUMsQ0FBQzt3QkFDSCxDQUFDO29CQUNULENBQUMsQ0FBQyxDQUFDO29CQUNILEtBQUssQ0FBQztnQkFDUixDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFRCwrQ0FBeUIsR0FBekIsVUFBMkIsTUFBVyxFQUFFLFNBQWdCLEVBQUMsbUJBQXdCLEVBQUUsUUFBeUM7UUFBNUgsaUJBeUJFO1FBeEJBLElBQUksVUFBVSxHQUFHLEVBQUMsWUFBWSxFQUFFLENBQUMsRUFBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxjQUFjLENBQUMsc0JBQXNCLENBQUMsTUFBTSxFQUFDLFVBQVUsRUFBQyxVQUFDLEtBQUssRUFBQyxNQUFNO1lBQ3hFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN4QixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sSUFBSSxpQkFBaUIsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDO2dCQUM1QyxHQUFHLENBQUMsQ0FBQyxJQUFJLGlCQUFpQixHQUFFLENBQUMsRUFBRSxpQkFBaUIsR0FBRSxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLEVBQUUsRUFBRSxDQUFDO29CQUNoRyxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDaEUsRUFBRSxDQUFDLENBQUMsaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDeEUsaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsR0FBRyxtQkFBbUIsQ0FBQzt3QkFDN0QsQ0FBQztvQkFDSCxDQUFDO2dCQUNILENBQUM7Z0JBQ0QsSUFBSSxLQUFLLEdBQUcsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFDLENBQUM7Z0JBQzVCLElBQUksT0FBTyxHQUFHLEVBQUMsSUFBSSxFQUFFLEVBQUMsY0FBYyxFQUFFLGlCQUFpQixFQUFDLEVBQUMsQ0FBQztnQkFDMUQsS0FBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBQyxFQUFFLFVBQUMsR0FBRyxFQUFFLFFBQVE7b0JBQzlFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ1IsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDdEIsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDTixRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUMsSUFBSSxFQUFDLFNBQVMsRUFBQyxDQUFDLENBQUM7b0JBQ25DLENBQUM7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUYsdUNBQWlCLEdBQWpCLFVBQWtCLFlBQWlCO1FBQ2pDLElBQUksY0FBYyxHQUFHLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMzRCxJQUFJLFVBQVUsR0FBRyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDdkQsSUFBSSxpQkFBaUIsR0FBRyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUN2RyxJQUFJLFlBQVksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQzlCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsaUJBQWlCLEVBQUMsWUFBWSxDQUFDLENBQUM7UUFDL0QsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxtREFBNkIsR0FBN0IsVUFBOEIsUUFBeUM7UUFBdkUsaUJBOERDO1FBN0RDLE1BQU0sQ0FBQyxLQUFLLENBQUMsMkNBQTJDLENBQUMsQ0FBQztRQUMxRCxJQUFJLEtBQUssR0FBRztZQUNWLEVBQUUsUUFBUSxFQUFHLEVBQUUsY0FBYyxFQUFHLENBQUMsRUFBRSxZQUFZLEVBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRyxDQUFDLEVBQUUsRUFBQztZQUNuRSxFQUFFLE9BQU8sRUFBRyxlQUFlLEVBQUU7WUFDN0IsRUFBRSxPQUFPLEVBQUcseUJBQXlCLEVBQUU7U0FDeEMsQ0FBQztRQUVGLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxVQUFDLEtBQUssRUFBRSxRQUFRO1lBQ25ELEVBQUUsQ0FBQSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1QsTUFBTSxDQUFDLEtBQUssQ0FBQyx3Q0FBd0MsR0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQzdFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDeEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLE1BQU0sQ0FBQyxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQztnQkFDckQsSUFBSSxRQUFRLEdBQUcsSUFBSSxLQUFLLEVBQXNCLENBQUM7Z0JBQy9DLElBQUksNEJBQTRCLEdBQUUsRUFBRSxDQUFDO2dCQUVyQyxHQUFHLENBQUEsQ0FBYSxVQUFRLEVBQVIscUJBQVEsRUFBUixzQkFBUSxFQUFSLElBQVE7b0JBQXBCLElBQUksSUFBSSxpQkFBQTtvQkFDVixNQUFNLENBQUMsS0FBSyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7b0JBQ2hFLElBQUksWUFBWSxHQUFHLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7b0JBQzdELElBQUkscUJBQXFCLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO29CQUM5RSxNQUFNLENBQUMsS0FBSyxDQUFDLGlCQUFpQixHQUFDLFlBQVksQ0FBQyxDQUFDO29CQUM3QyxFQUFFLENBQUEsQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN0RCxNQUFNLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7d0JBQ2hDLElBQUksYUFBYSxHQUFHLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDbEQsNEJBQTRCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUNuRCxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNOLE1BQU0sQ0FBQyxLQUFLLENBQUMseUJBQXlCLEdBQUMsWUFBWSxDQUFDLENBQUM7b0JBQ3ZELENBQUM7aUJBQ0Y7Z0JBRUQsRUFBRSxDQUFBLENBQUMsNEJBQTRCLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBRTdDLFNBQVMsQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBUyxJQUFnQjt3QkFFeEUsTUFBTSxDQUFDLEtBQUssQ0FBQywrQkFBK0IsR0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQ25FLElBQUksb0JBQW9CLEdBQUcsRUFBRSxDQUFDO3dCQUU5QixHQUFHLENBQUEsQ0FBYSxVQUFJLEVBQUosYUFBSSxFQUFKLGtCQUFJLEVBQUosSUFBSTs0QkFBaEIsSUFBSSxJQUFJLGFBQUE7NEJBQ1YsTUFBTSxDQUFDLEtBQUssQ0FBQyxvREFBb0QsR0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDOzRCQUNuRyxJQUFJLFdBQVcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDOzRCQUNwQyxJQUFJLGVBQWUsR0FBRyxXQUFXLENBQUMsOEJBQThCLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ3ZFLG9CQUFvQixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQzt5QkFDNUM7d0JBRUQsU0FBUyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFTLFlBQXdCOzRCQUN4RSxNQUFNLENBQUMsS0FBSyxDQUFDLDhCQUE4QixHQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQzs0QkFDMUUsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLE1BQU0sRUFBRyxrQ0FBa0MsRUFBRSxDQUFDLENBQUM7d0JBQ2xFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFTLENBQUs7NEJBQ3JCLE1BQU0sQ0FBQyxLQUFLLENBQUMsNkNBQTZDLEdBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzs0QkFDdkYsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBQzlCLENBQUMsQ0FBQyxDQUFDO29CQUVMLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFTLENBQUs7d0JBQ3JCLE1BQU0sQ0FBQyxLQUFLLENBQUMsK0NBQStDLEdBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzt3QkFDekYsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQzlCLENBQUMsQ0FBQyxDQUFDO2dCQUNMLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sTUFBTSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO2dCQUM1QyxDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELHdDQUFrQixHQUFsQixVQUFtQixJQUFTO1FBRTFCLE1BQU0sQ0FBQyxJQUFJLFNBQVMsQ0FBQyxVQUFVLE9BQVksRUFBRSxNQUFXO1lBRXRELE1BQU0sQ0FBQyxLQUFLLENBQUMsaURBQWlELENBQUMsQ0FBQztZQUVoRSxJQUFJLG1CQUFtQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztZQUNuRCxJQUFJLFVBQVUsR0FBRyxFQUFFLE1BQU0sRUFBRyxDQUFDLEVBQUUsQ0FBQztZQUNoQyxJQUFJLGlCQUFpQixHQUFHLElBQUksaUJBQWlCLEVBQUUsQ0FBQztZQUNoRCxJQUFJLFdBQVcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1lBRXBDLGlCQUFpQixDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFDLEtBQUssRUFBRyxJQUFJO2dCQUM3RixFQUFFLENBQUEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNULE1BQU0sQ0FBQyxLQUFLLENBQUMsNkJBQTZCLEdBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNsRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2hCLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sTUFBTSxDQUFDLEtBQUssQ0FBQyxtQ0FBbUMsR0FBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQzVELG1CQUFtQixDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO29CQUN0QyxtQkFBbUIsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztvQkFDM0MsbUJBQW1CLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7b0JBQ2pELG1CQUFtQixDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQztvQkFDOUQsbUJBQW1CLENBQUMsaUJBQWlCLEdBQUcsV0FBVyxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFDM0YsbUJBQW1CLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7b0JBQzVDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2dCQUMvQixDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFTCxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFNO1lBQ3ZCLE1BQU0sQ0FBQyxLQUFLLENBQUMsd0VBQXdFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNuSCxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxvREFBOEIsR0FBOUIsVUFBK0IsSUFBUztRQUV0QyxNQUFNLENBQUMsSUFBSSxTQUFTLENBQUMsVUFBVSxPQUFZLEVBQUUsTUFBVztZQUV0RCxJQUFJLFdBQVcsR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDO1lBRXhDLElBQUksSUFBSSxHQUFHLElBQUksZUFBZSxFQUFFLENBQUM7WUFDakMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3pDLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztZQUMvQyxJQUFJLFlBQVksR0FBRyx1Q0FBdUMsQ0FBQztZQUUzRCxJQUFJLElBQUksR0FBcUIsSUFBSSxHQUFHLENBQUM7Z0JBQ25DLENBQUMsbUJBQW1CLEVBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztnQkFDM0YsQ0FBQyxnQkFBZ0IsRUFBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUNuQyxDQUFDLGVBQWUsRUFBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDLHFCQUFxQixFQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsR0FBRSxRQUFRLENBQUM7Z0JBQy9HLENBQUMsWUFBWSxFQUFDLDBCQUEwQixDQUFDO2FBQUMsQ0FBQyxDQUFDO1lBRTlDLElBQUksVUFBVSxHQUFHLGVBQWUsQ0FBQyxlQUFlLENBQUM7WUFDakQsV0FBVyxDQUFDLElBQUksQ0FBRSxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFDLFVBQVUsRUFDOUYsVUFBQyxHQUFRLEVBQUUsTUFBVztnQkFDcEIsRUFBRSxDQUFBLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxHQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDN0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNkLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsR0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ2hFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbEIsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBRVAsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBTTtZQUN2QixNQUFNLENBQUMsS0FBSyxDQUFDLHdFQUF3RSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDbkgsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQseUNBQW1CLEdBQW5CLFVBQW9CLFlBQWtCO1FBQ3BDLElBQUksY0FBYyxHQUFHLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMzRCxJQUFJLFVBQVUsR0FBRyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDdkQsSUFBSSxpQkFBaUIsR0FBRyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUN2RyxJQUFJLFlBQVksR0FBRyxpQkFBaUIsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNwRCxNQUFNLENBQUMsWUFBWSxDQUFDO0lBQ3RCLENBQUM7SUFDSCxrQkFBQztBQUFELENBaHJDQSxBQWdyQ0MsSUFBQTtBQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDekIsaUJBQVMsV0FBVyxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvc2VydmljZXMvVXNlclNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVXNlclJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvVXNlclJlcG9zaXRvcnknKTtcbmltcG9ydCBTZW5kTWFpbFNlcnZpY2UgPSByZXF1aXJlKCcuL21haWxlci5zZXJ2aWNlJyk7XG5pbXBvcnQgU2VuZE1lc3NhZ2VTZXJ2aWNlID0gcmVxdWlyZSgnLi9zZW5kbWVzc2FnZS5zZXJ2aWNlJyk7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XG5sZXQgT2JqZWN0SWQgPSBtb25nb29zZS5UeXBlcy5PYmplY3RJZDtcbmltcG9ydCB7IFNlbnRNZXNzYWdlSW5mbyB9IGZyb20gJ25vZGVtYWlsZXInO1xubGV0IGNvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xubGV0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5pbXBvcnQgTWVzc2FnZXMgPSByZXF1aXJlKCcuLi9zaGFyZWQvbWVzc2FnZXMnKTtcbmltcG9ydCBBdXRoSW50ZXJjZXB0b3IgPSByZXF1aXJlKCcuLi8uLi9mcmFtZXdvcmsvaW50ZXJjZXB0b3IvYXV0aC5pbnRlcmNlcHRvcicpO1xuaW1wb3J0IFByb2plY3RBc3NldCA9IHJlcXVpcmUoJy4uL3NoYXJlZC9wcm9qZWN0YXNzZXQnKTtcbmltcG9ydCBNYWlsQXR0YWNobWVudHMgPSByZXF1aXJlKCcuLi9zaGFyZWQvc2hhcmVkYXJyYXknKTtcbmltcG9ydCB7IGFzRWxlbWVudERhdGEgfSBmcm9tICdAYW5ndWxhci9jb3JlL3NyYy92aWV3JztcbmltcG9ydCBiY3J5cHQgPSByZXF1aXJlKCdiY3J5cHQnKTtcbmxldCBsb2c0anMgPSByZXF1aXJlKCdsb2c0anMnKTtcbmxldCBsb2dnZXIgPSBsb2c0anMuZ2V0TG9nZ2VyKCdVc2VyIHNlcnZpY2UnKTtcbi4uLi4uLi5pbXBvcnQgeyBNYWlsQ2hpbXBNYWlsZXJTZXJ2aWNlIH0gZnJvbSAnLi9tYWlsY2hpbXAtbWFpbGVyLnNlcnZpY2UnO1xuaW1wb3J0IFVzZXJNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvVXNlck1vZGVsJyk7XG5pbXBvcnQgVXNlciA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9uZ29vc2UvdXNlcicpO1xuaW1wb3J0IFN1YnNjcmlwdGlvblNlcnZpY2UgPSByZXF1aXJlKCcuLi8uLi9hcHBsaWNhdGlvblByb2plY3Qvc2VydmljZXMvU3Vic2NyaXB0aW9uU2VydmljZScpO1xuaW1wb3J0IFN1YnNjcmlwdGlvblBhY2thZ2UgPSByZXF1aXJlKCcuLi8uLi9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L1N1YnNjcmlwdGlvbi9TdWJzY3JpcHRpb25QYWNrYWdlJyk7XG5pbXBvcnQgQmFzZVN1YnNjcmlwdGlvblBhY2thZ2UgPSByZXF1aXJlKCcuLi8uLi9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L1N1YnNjcmlwdGlvbi9CYXNlU3Vic2NyaXB0aW9uUGFja2FnZScpO1xuaW1wb3J0IFVzZXJTdWJzY3JpcHRpb24gPSByZXF1aXJlKCcuLi8uLi9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L1N1YnNjcmlwdGlvbi9Vc2VyU3Vic2NyaXB0aW9uJyk7XG5pbXBvcnQgUHJvamVjdFJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi8uLi9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L1Byb2plY3RSZXBvc2l0b3J5Jyk7XG5pbXBvcnQgUHJvamVjdFN1YnNjcmlwdGlvbkRldGFpbHMgPSByZXF1aXJlKCcuLi8uLi9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L1N1YnNjcmlwdGlvbi9Qcm9qZWN0U3Vic2NyaXB0aW9uRGV0YWlscycpO1xuaW1wb3J0IG1lc3NhZ2VzICA9IHJlcXVpcmUoJy4uLy4uL2FwcGxpY2F0aW9uUHJvamVjdC9zaGFyZWQvbWVzc2FnZXMnKTtcbmltcG9ydCBjb25zdGFudHMgID0gcmVxdWlyZSgnLi4vLi4vYXBwbGljYXRpb25Qcm9qZWN0L3NoYXJlZC9jb25zdGFudHMnKTtcbmltcG9ydCBQcm9qZWN0U3ViY3JpcHRpb24gPSByZXF1aXJlKCcuLi8uLi9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9tb2RlbC9jb21wYW55L1Byb2plY3RTdWJjcmlwdGlvbicpO1xubGV0IENDUHJvbWlzZSA9IHJlcXVpcmUoJ3Byb21pc2UvbGliL2VzNi1leHRlbnNpb25zJyk7XG5sZXQgbG9nNGpzID0gcmVxdWlyZSgnbG9nNGpzJyk7XG5sZXQgbG9nZ2VyID0gbG9nNGpzLmdldExvZ2dlcignVXNlciBzZXJ2aWNlJyk7XG5cbmNsYXNzIFVzZXJTZXJ2aWNlIHtcbiAgQVBQX05BTUU6IHN0cmluZztcbiAgY29tcGFueV9uYW1lOiBzdHJpbmc7XG4gIG1pZF9jb250ZW50OiBhbnk7XG4gIGlzQWN0aXZlQWRkQnVpbGRpbmdCdXR0b246Ym9vbGVhbj1mYWxzZTtcbiAgcHJpdmF0ZSB1c2VyUmVwb3NpdG9yeTogVXNlclJlcG9zaXRvcnk7XG4gIHByaXZhdGUgcHJvamVjdFJlcG9zaXRvcnkgOiBQcm9qZWN0UmVwb3NpdG9yeTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5ID0gbmV3IFVzZXJSZXBvc2l0b3J5KCk7XG4gICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeSA9IG5ldyBQcm9qZWN0UmVwb3NpdG9yeSgpO1xuICAgIHRoaXMuQVBQX05BTUUgPSBQcm9qZWN0QXNzZXQuQVBQX05BTUU7XG4gIH1cblxuICBjcmVhdGVVc2VyKGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIHRoaXMudXNlclJlcG9zaXRvcnkucmV0cmlldmUoeydlbWFpbCc6IGl0ZW0uZW1haWx9LCAoZXJyLCByZXMpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKGVyciksIG51bGwpO1xuICAgICAgfSBlbHNlIGlmIChyZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBsb2dnZXIuZGVidWcoJ0VtYWlsIGFscmVhZHkgZXhpc3QnK0pTT04uc3RyaW5naWZ5KHJlcykpO1xuXG4gICAgICAgIGlmIChyZXNbMF0uaXNBY3RpdmF0ZWQgPT09IHRydWUpIHtcbiAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTiksIG51bGwpO1xuICAgICAgICB9IGVsc2UgaWYgKHJlc1swXS5pc0FjdGl2YXRlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1ZFUklGWV9BQ0NPVU5UKSwgbnVsbCk7XG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9nZ2VyLmRlYnVnKCdFbWFpbCBub3QgcHJlc2VudC4nK0pTT04uc3RyaW5naWZ5KHJlcykpO1xuICAgICAgICBjb25zdCBzYWx0Um91bmRzID0gMTA7XG4gICAgICAgIGJjcnlwdC5oYXNoKGl0ZW0ucGFzc3dvcmQsIHNhbHRSb3VuZHMsIChlcnI6IGFueSwgaGFzaDogYW55KSA9PiB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdFcnJvciBpbiBjcmVhdGluZyBoYXNoIHBhc3N3b3JkJyk7XG4gICAgICAgICAgICBjYWxsYmFjayh7XG4gICAgICAgICAgICAgIHJlYXNvbjogJ0Vycm9yIGluIGNyZWF0aW5nIGhhc2ggdXNpbmcgYmNyeXB0JyxcbiAgICAgICAgICAgICAgbWVzc2FnZTogJ0Vycm9yIGluIGNyZWF0aW5nIGhhc2ggdXNpbmcgYmNyeXB0JyxcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgICAgIGNvZGU6IDQwM1xuICAgICAgICAgICAgfSwgbnVsbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnY3JlYXRlZCBoYXNoIHN1Y2Nlc2Z1bGx5LicpO1xuICAgICAgICAgICAgaXRlbS5wYXNzd29yZCA9IGhhc2g7XG4gICAgICAgICAgICBsZXQgc3ViU2NyaXB0aW9uU2VydmljZSA9IG5ldyBTdWJzY3JpcHRpb25TZXJ2aWNlKCk7XG4gICAgICAgICAgICBzdWJTY3JpcHRpb25TZXJ2aWNlLmdldFN1YnNjcmlwdGlvblBhY2thZ2VCeU5hbWUoJ0ZyZWUnLCdCYXNlUGFja2FnZScsIChlcnI6IGFueSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcmVlU3Vic2NyaXB0aW9uOiBBcnJheTxTdWJzY3JpcHRpb25QYWNrYWdlPikgPT4ge1xuICAgICAgICAgICAgICBpZiAoZnJlZVN1YnNjcmlwdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKCdmcmVlU3Vic2NyaXB0aW9uIGxlbmd0aCAgPiAwJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5hc3NpZ25GcmVlU3Vic2NyaXB0aW9uQW5kQ3JlYXRlVXNlcihpdGVtLCBmcmVlU3Vic2NyaXB0aW9uWzBdLCBjYWxsYmFjayk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnZnJlZVN1YnNjcmlwdGlvbiBsZW5ndGggIT09MCcpO1xuICAgICAgICAgICAgICAgIHN1YlNjcmlwdGlvblNlcnZpY2UuYWRkU3Vic2NyaXB0aW9uUGFja2FnZShjb25maWcuZ2V0KCdzdWJzY3JpcHRpb24ucGFja2FnZS5GcmVlJyksXG4gICAgICAgICAgICAgICAgICAoZXJyOiBhbnksIGZyZWVTdWJzY3JpcHRpb24pPT4ge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoJ2Fzc2lnbmluZyBmcmVlIHN1YnNjcmlwdGlvbiBieSBjcmVhdGluZyBuZXcgdXNlcicpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFzc2lnbkZyZWVTdWJzY3JpcHRpb25BbmRDcmVhdGVVc2VyKGl0ZW0sIGZyZWVTdWJzY3JpcHRpb24sIGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICB9KTtcbiAgfVxuXG4gIGNoZWNrRm9yVmFsaWRTdWJzY3JpcHRpb24odXNlcmlkIDogc3RyaW5nLCBjYWxsYmFjayA6IChlcnJvciA6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcblxuICAgIGxldCBxdWVyeSA9IFtcbiAgICAgIHsgJG1hdGNoOiB7J19pZCc6dXNlcmlkfX0sXG4gICAgICB7ICRwcm9qZWN0IDogeydzdWJzY3JpcHRpb24nOjF9fSxcbiAgICAgIHsgJHVud2luZDogJyRzdWJzY3JpcHRpb24nfVxuICAgIF07XG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5hZ2dyZWdhdGUocXVlcnkgLChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHZhbGlkU3Vic2NyaXB0aW9uUGFja2FnZTtcbiAgICAgICAgaWYocmVzdWx0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmb3IobGV0IHN1YnNjcmlwdGlvblBhY2thZ2Ugb2YgcmVzdWx0KSB7XG4gICAgICAgICAgICBpZihzdWJzY3JpcHRpb25QYWNrYWdlLnN1YnNjcmlwdGlvbi5wcm9qZWN0SWQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgIHZhbGlkU3Vic2NyaXB0aW9uUGFja2FnZSA9IHN1YnNjcmlwdGlvblBhY2thZ2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHZhbGlkU3Vic2NyaXB0aW9uUGFja2FnZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAgYXNzaWduRnJlZVN1YnNjcmlwdGlvbkFuZENyZWF0ZVVzZXIoaXRlbTogYW55LCBmcmVlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb25QYWNrYWdlLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgbGV0IHVzZXI6IFVzZXJNb2RlbCA9IGl0ZW07XG4gICAgbGV0IHNlbmRNYWlsU2VydmljZSA9IG5ldyBTZW5kTWFpbFNlcnZpY2UoKTtcbiAgICB0aGlzLmFzc2lnbkZyZWVTdWJzY3JpcHRpb25QYWNrYWdlKHVzZXIsIGZyZWVTdWJzY3JpcHRpb24pO1xuICAgIGxvZ2dlci5kZWJ1ZygnQ3JlYXRpbmcgdXNlciB3aXRoIG5ldyBmcmVlIHRyYWlsIHN1YnNjcmlwdGlvbiBwYWNrYWdlJyk7XG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5jcmVhdGUodXNlciwgKGVycjpFcnJvciwgcmVzOmFueSkgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBsb2dnZXIuZXJyb3IoJ0ZhaWxlZCB0byBDcmVhdGluZyB1c2VyIHN1YnNjcmlwdGlvbiBwYWNrYWdlJyk7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfUkVHSVNUUkFUSU9OX01PQklMRV9OVU1CRVIpLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvZ2dlci5kZWJ1ZygnY3JlYXRlZCB1c2VyIHN1Y2Nlc2Z1bGx5LicrSlNPTi5zdHJpbmdpZnkocmVzKSk7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgcmVzKTtcbiAgICAgICAgbGV0IGF1dGggPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XG4gICAgICAgIGxldCB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQocmVzKTtcbiAgICAgICAgbGV0IGhvc3QgPSBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLmhvc3QnKTtcbiAgICAgICAgbGV0IGxpbmsgPSBob3N0ICsgJ3NpZ25pbj9hY2Nlc3NfdG9rZW49JyArIHRva2VuICsgJyZfaWQ9JyArIHJlcy5faWQ7XG4gICAgICAgIGxldCBodG1sVGVtcGxhdGUgPSAnd2VsY29tZS1hYm9hcmQuaHRtbCc7XG4gICAgICAgIGxldCBkYXRhOk1hcDxzdHJpbmcsc3RyaW5nPj0gbmV3IE1hcChbWyckYXBwbGljYXRpb25MaW5rJCcsY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5ob3N0JyldLFxuICAgICAgICAgIFsnJGZpcnN0X25hbWUkJyxyZXMuZmlyc3RfbmFtZV0sWyckbGluayQnLGxpbmtdLFsnJGFwcF9uYW1lJCcsdGhpcy5BUFBfTkFNRV1dKTtcbiAgICAgICAgbGV0IGF0dGFjaG1lbnQgPSBNYWlsQXR0YWNobWVudHMuV2VsY29tZUFib2FyZEF0dGFjaG1lbnRBcnJheTtcbiAgICAgICAgbG9nZ2VyLmRlYnVnKCdzZW5kaW5nIG1haWwgdG8gbmV3IHVzZXIuJytKU09OLnN0cmluZ2lmeShhdHRhY2htZW50KSk7XG4gICAgICAgIHNlbmRNYWlsU2VydmljZS5zZW5kKCB1c2VyLmVtYWlsLCBNZXNzYWdlcy5FTUFJTF9TVUJKRUNUX0NBTkRJREFURV9SRUdJU1RSQVRJT04sIGh0bWxUZW1wbGF0ZSwgZGF0YSxhdHRhY2htZW50LFxuICAgICAgICAgIChlcnI6IGFueSwgcmVzdWx0OiBhbnkpID0+IHtcbiAgICAgICAgICBpZihlcnIpIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihKU09OLnN0cmluZ2lmeShlcnIpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCdTZW5kaW5nIE1haWwgOiAnK0pTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xuICAgICAgICAgICAgLy9jYWxsYmFjayhlcnIsIHJlc3VsdCk7XG4gICAgICAgICAgfSxjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLkJVSUxESU5GT19BRE1JTl9NQUlMJykpO1xuICAgICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRVc2VyRm9yQ2hlY2tpbmdCdWlsZGluZyh1c2VySWQ6c3RyaW5nLHByb2plY3RJZDpzdHJpbmcsdXNlcjpVc2VyLGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcbiAgICBsZXQgcXVlcnk9IFtcbiAgICAgIHsgJG1hdGNoOiB7J19pZCc6dXNlcklkfX0sXG4gICAgICB7ICRwcm9qZWN0IDogeydzdWJzY3JpcHRpb24nOjF9fSxcbiAgICAgIHsgJHVud2luZDogJyRzdWJzY3JpcHRpb24nfSxcbiAgICAgIHsgJG1hdGNoOiB7J3N1YnNjcmlwdGlvbi5wcm9qZWN0SWQnOnByb2plY3RJZH19XG4gICAgXTtcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmFnZ3JlZ2F0ZShxdWVyeSwoZXJyb3IscmVzdWx0KT0+IHtcbiAgICAgIGlmKGVycm9yKSB7XG4gICAgICAgIGNhbGxiYWNrKGVycm9yLG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYocmVzdWx0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmb3IobGV0IHN1YnNjcmlwdGlvblBhY2thZ2Ugb2YgcmVzdWx0KSB7XG4gICAgICAgICAgICAgIGlmKHN1YnNjcmlwdGlvblBhY2thZ2UgJiYgc3Vic2NyaXB0aW9uUGFja2FnZS5zdWJzY3JpcHRpb24ucHJvamVjdElkIT09bnVsbCkge1xuICAgICAgICAgICAgICAgIGxldCBxdWVyeSA9IHtfaWQ6IHByb2plY3RJZH07XG4gICAgICAgICAgICAgICAgbGV0IHBvcHVsYXRlID0ge3BhdGg6ICdidWlsZGluZycsIHNlbGVjdDogWyduYW1lJywgJ2J1aWxkaW5ncycsXX07XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kQW5kUG9wdWxhdGUocXVlcnksIHBvcHVsYXRlLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBub09mQnVpbGRpbmdzPXJlc3VsdC5idWlsZGluZ3MubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBpZihzdWJzY3JpcHRpb25QYWNrYWdlICYmIG5vT2ZCdWlsZGluZ3MgPD0gc3Vic2NyaXB0aW9uUGFja2FnZS5zdWJzY3JpcHRpb24ubnVtT2ZCdWlsZGluZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQWN0aXZlQWRkQnVpbGRpbmdCdXR0b249ZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0FjdGl2ZUFkZEJ1aWxkaW5nQnV0dG9uPXRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCxyZXN1bHQpO1xuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY2FsbGJhY2sobnVsbCx7ZGF0YTp0aGlzLmlzQWN0aXZlQWRkQnVpbGRpbmdCdXR0b259KTtcbiAgICB9KTtcbiAgfVxuXG5cbiAgYXNzaWduRnJlZVN1YnNjcmlwdGlvblBhY2thZ2UodXNlcjogVXNlck1vZGVsLCBmcmVlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb25QYWNrYWdlKSB7XG4gICAgbGV0IHN1YnNjcmlwdGlvbiA9IG5ldyBVc2VyU3Vic2NyaXB0aW9uKCk7XG4gICAgc3Vic2NyaXB0aW9uLmFjdGl2YXRpb25EYXRlID0gbmV3IERhdGUoKTtcbiAgICBzdWJzY3JpcHRpb24ubnVtT2ZCdWlsZGluZ3MgPSBmcmVlU3Vic2NyaXB0aW9uLmJhc2VQYWNrYWdlLm51bU9mQnVpbGRpbmdzO1xuICAgIHN1YnNjcmlwdGlvbi5udW1PZlByb2plY3RzID0gZnJlZVN1YnNjcmlwdGlvbi5iYXNlUGFja2FnZS5udW1PZlByb2plY3RzO1xuICAgIHN1YnNjcmlwdGlvbi52YWxpZGl0eSA9IGZyZWVTdWJzY3JpcHRpb24uYmFzZVBhY2thZ2UudmFsaWRpdHk7XG4gICAgc3Vic2NyaXB0aW9uLnByb2plY3RJZCA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG4gICAgc3Vic2NyaXB0aW9uLnB1cmNoYXNlZCA9IG5ldyBBcnJheTxCYXNlU3Vic2NyaXB0aW9uUGFja2FnZT4oKTtcbiAgICBzdWJzY3JpcHRpb24ucHVyY2hhc2VkLnB1c2goZnJlZVN1YnNjcmlwdGlvbi5iYXNlUGFja2FnZSk7XG4gICAgdXNlci5zdWJzY3JpcHRpb24gPSBuZXcgQXJyYXk8VXNlclN1YnNjcmlwdGlvbj4oKTtcbiAgICB1c2VyLnN1YnNjcmlwdGlvbi5wdXNoKHN1YnNjcmlwdGlvbik7XG4gIH1cblxuICBsb2dpbihkYXRhOiBhbnksIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIHRoaXMucmV0cmlldmUoeydlbWFpbCc6IGRhdGEuZW1haWx9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgIH0gZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDAgJiYgcmVzdWx0WzBdLmlzQWN0aXZhdGVkID09PSB0cnVlKSB7XG4gICAgICAgIGJjcnlwdC5jb21wYXJlKGRhdGEucGFzc3dvcmQsIHJlc3VsdFswXS5wYXNzd29yZCwgKGVycjogYW55LCBpc1NhbWU6IGFueSkgPT4ge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKHtcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfUkVHSVNUUkFUSU9OX1NUQVRVUyxcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1ZFUklGWV9DQU5ESURBVEVfQUNDT1VOVCxcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgICAgIGFjdHVhbEVycm9yOiBlcnIsXG4gICAgICAgICAgICAgIGNvZGU6IDUwMFxuICAgICAgICAgICAgfSwgbnVsbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8qY29uc29sZS5sb2coJ2dvdCB1c2VyJyk7Ki9cbiAgICAgICAgICAgIGlmIChpc1NhbWUpIHtcbiAgICAgICAgICAgICAgbGV0IGF1dGggPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XG4gICAgICAgICAgICAgIGxldCB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQocmVzdWx0WzBdKTtcbiAgICAgICAgICAgICAgdmFyIGRhdGE6IGFueSA9IHtcbiAgICAgICAgICAgICAgICAnc3RhdHVzJzogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXG4gICAgICAgICAgICAgICAgJ2RhdGEnOiB7XG4gICAgICAgICAgICAgICAgICAnZmlyc3RfbmFtZSc6IHJlc3VsdFswXS5maXJzdF9uYW1lLFxuICAgICAgICAgICAgICAgICAgJ2xhc3RfbmFtZSc6IHJlc3VsdFswXS5sYXN0X25hbWUsXG4gICAgICAgICAgICAgICAgICAnY29tcGFueV9uYW1lJzogcmVzdWx0WzBdLmNvbXBhbnlfbmFtZSxcbiAgICAgICAgICAgICAgICAgICdlbWFpbCc6IHJlc3VsdFswXS5lbWFpbCxcbiAgICAgICAgICAgICAgICAgICdfaWQnOiByZXN1bHRbMF0uX2lkLFxuICAgICAgICAgICAgICAgICAgJ2N1cnJlbnRfdGhlbWUnOiByZXN1bHRbMF0uY3VycmVudF90aGVtZSxcbiAgICAgICAgICAgICAgICAgICdwaWN0dXJlJzogcmVzdWx0WzBdLnBpY3R1cmUsXG4gICAgICAgICAgICAgICAgICAnbW9iaWxlX251bWJlcic6IHJlc3VsdFswXS5tb2JpbGVfbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgJ2FjY2Vzc190b2tlbic6IHRva2VuXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRva2VuXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGRhdGEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2soe1xuICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XUk9OR19QQVNTV09SRCxcbiAgICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgICAgICAgICBjb2RlOiA0MDBcbiAgICAgICAgICAgICAgfSwgbnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDAgJiYgcmVzdWx0WzBdLmlzQWN0aXZhdGVkID09PSBmYWxzZSkge1xuICAgICAgICBjYWxsYmFjayh7XG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfUkVHSVNUUkFUSU9OX1NUQVRVUyxcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0NBTkRJREFURV9BQ0NPVU5ULFxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgIGNvZGU6IDUwMFxuICAgICAgICB9LCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKHtcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fVVNFUl9OT1RfRk9VTkQsXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1VTRVJfTk9UX1BSRVNFTlQsXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgY29kZTogNDAwXG4gICAgICAgIH0sbnVsbCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZW5kT3RwKHBhcmFtczogYW55LCB1c2VyOiBhbnksIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIGxldCBEYXRhID0ge1xuICAgICAgbmV3X21vYmlsZV9udW1iZXI6IHBhcmFtcy5tb2JpbGVfbnVtYmVyLFxuICAgICAgb2xkX21vYmlsZV9udW1iZXI6IHVzZXIubW9iaWxlX251bWJlcixcbiAgICAgIF9pZDogdXNlci5faWRcbiAgICB9O1xuICAgIHRoaXMuZ2VuZXJhdGVPdHAoRGF0YSwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBpZiAoZXJyb3IgPT09IE1lc3NhZ2VzLk1TR19FUlJPUl9DSEVDS19NT0JJTEVfUFJFU0VOVCkge1xuICAgICAgICAgIGNhbGxiYWNrKHtcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTl9NT0JJTEVfTlVNQkVSLFxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgICBjb2RlOiA0MDBcbiAgICAgICAgICB9LCBudWxsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgY2FsbGJhY2soe1xuICAgICAgICAgICdzdGF0dXMnOiBNZXNzYWdlcy5TVEFUVVNfU1VDQ0VTUyxcbiAgICAgICAgICAnZGF0YSc6IHtcbiAgICAgICAgICAgICdtZXNzYWdlJzogTWVzc2FnZXMuTVNHX1NVQ0NFU1NfT1RQXG4gICAgICAgICAgfVxuICAgICAgICB9LCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKHtcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fVVNFUl9OT1RfRk9VTkQsXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9VU0VSX05PVF9GT1VORCxcbiAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgICBjb2RlOiA0MDBcbiAgICAgICAgfSwgbnVsbCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZW5lcmF0ZU90cChmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5yZXRyaWV2ZSh7J21vYmlsZV9udW1iZXInOiBmaWVsZC5uZXdfbW9iaWxlX251bWJlciwgJ2lzQWN0aXZhdGVkJzogdHJ1ZX0sIChlcnIsIHJlcykgPT4ge1xuXG4gICAgICBpZiAoZXJyKSB7XG4gICAgICB9IGVsc2UgaWYgKHJlcy5sZW5ndGggPiAwICYmIChyZXNbMF0uX2lkKSAhPT0gZmllbGQuX2lkKSB7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfUkVHSVNUUkFUSU9OX01PQklMRV9OVU1CRVIpLCBudWxsKTtcbiAgICAgIH0gZWxzZSBpZiAocmVzLmxlbmd0aCA9PT0gMCkge1xuXG4gICAgICAgIGxldCBxdWVyeSA9IHsnX2lkJzogZmllbGQuX2lkfTtcbiAgICAgICAgbGV0IG90cCA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiA5OTk5OSkgKyAxMDAwMDApO1xuICAgICAgICBsZXQgdXBkYXRlRGF0YSA9IHsnbW9iaWxlX251bWJlcic6IGZpZWxkLm5ld19tb2JpbGVfbnVtYmVyLCAnb3RwJzogb3RwfTtcbiAgICAgICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfUkVHSVNUUkFUSU9OX01PQklMRV9OVU1CRVIpLCBudWxsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IERhdGEgPSB7XG4gICAgICAgICAgICAgIG1vYmlsZU5vOiBmaWVsZC5uZXdfbW9iaWxlX251bWJlcixcbiAgICAgICAgICAgICAgb3RwOiBvdHBcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBsZXQgc2VuZE1lc3NhZ2VTZXJ2aWNlID0gbmV3IFNlbmRNZXNzYWdlU2VydmljZSgpO1xuICAgICAgICAgICAgc2VuZE1lc3NhZ2VTZXJ2aWNlLnNlbmRNZXNzYWdlRGlyZWN0KERhdGEsIGNhbGxiYWNrKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT05fTU9CSUxFX05VTUJFUiksIG51bGwpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdmVyaWZ5T3RwKHBhcmFtczogYW55LCB1c2VyOmFueSwgY2FsbGJhY2s6KGVycm9yOmFueSwgcmVzdWx0OmFueSkgPT4gdm9pZCkge1xuICAgIGxldCBtYWlsQ2hpbXBNYWlsZXJTZXJ2aWNlID0gbmV3IE1haWxDaGltcE1haWxlclNlcnZpY2UoKTtcblxuICAgIGxldCBxdWVyeSA9IHsnX2lkJzogdXNlci5faWQsICdpc0FjdGl2YXRlZCc6IGZhbHNlfTtcbiAgICBsZXQgdXBkYXRlRGF0YSA9IHsnaXNBY3RpdmF0ZWQnOiB0cnVlLCAnYWN0aXZhdGlvbl9kYXRlJzogbmV3IERhdGUoKX07XG4gICAgaWYgKHVzZXIub3RwID09PSBwYXJhbXMub3RwKSB7XG4gICAgICB0aGlzLmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZURhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FsbGJhY2sobnVsbCx7XG4gICAgICAgICAgICAnc3RhdHVzJzogJ1N1Y2Nlc3MnLFxuICAgICAgICAgICAgJ2RhdGEnOiB7J21lc3NhZ2UnOiAnVXNlciBBY2NvdW50IHZlcmlmaWVkIHN1Y2Nlc3NmdWxseSd9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbWFpbENoaW1wTWFpbGVyU2VydmljZS5vbkNhbmRpZGF0ZVNpZ25TdWNjZXNzKHJlc3VsdCk7XG5cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhbGxiYWNrKHtcbiAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXG4gICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XUk9OR19PVFAsXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICBjb2RlOiA0MDBcbiAgICAgIH0sIG51bGwpO1xuICAgIH1cblxuICB9XG5cbiAgY2hhbmdlTW9iaWxlTnVtYmVyKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcblxuICAgIGxldCBxdWVyeSA9IHsnX2lkJzogZmllbGQuX2lkfTtcbiAgICBsZXQgb3RwID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDk5OTk5KSArIDEwMDAwMCk7XG4gICAgbGV0IHVwZGF0ZURhdGEgPSB7J290cCc6IG90cCwgJ3RlbXBfbW9iaWxlJzogZmllbGQubmV3X21vYmlsZV9udW1iZXJ9O1xuXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTiksIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IERhdGEgPSB7XG4gICAgICAgICAgY3VycmVudF9tb2JpbGVfbnVtYmVyOiBmaWVsZC5jdXJyZW50X21vYmlsZV9udW1iZXIsXG4gICAgICAgICAgbW9iaWxlTm86IGZpZWxkLm5ld19tb2JpbGVfbnVtYmVyLFxuICAgICAgICAgIG90cDogb3RwXG4gICAgICAgIH07XG4gICAgICAgIGxldCBzZW5kTWVzc2FnZVNlcnZpY2UgPSBuZXcgU2VuZE1lc3NhZ2VTZXJ2aWNlKCk7XG4gICAgICAgIHNlbmRNZXNzYWdlU2VydmljZS5zZW5kQ2hhbmdlTW9iaWxlTWVzc2FnZShEYXRhLCBjYWxsYmFjayk7XG5cbiAgICAgIH1cbiAgICB9KTtcblxuICB9XG5cbiAgZm9yZ290UGFzc3dvcmQoZmllbGQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IFNlbnRNZXNzYWdlSW5mbykgPT4gdm9pZCkge1xuXG4gICAgbGV0IHNlbmRNYWlsU2VydmljZSA9IG5ldyBTZW5kTWFpbFNlcnZpY2UoKTtcbiAgICBsZXQgcXVlcnkgPSB7J2VtYWlsJzogZmllbGQuZW1haWx9O1xuXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5yZXRyaWV2ZShxdWVyeSwgKGVyciwgcmVzKSA9PiB7XG5cbiAgICAgIGlmIChyZXMubGVuZ3RoID4gMCAmJiByZXNbMF0uaXNBY3RpdmF0ZWQgPT09IHRydWUpIHtcblxuICAgICAgICBsZXQgYXV0aCA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcbiAgICAgICAgbGV0IHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZChyZXNbMF0pO1xuICAgICAgICBsZXQgaG9zdCA9IGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpO1xuICAgICAgICBsZXQgbGluayA9IGhvc3QgKyAncmVzZXQtcGFzc3dvcmQ/YWNjZXNzX3Rva2VuPScgKyB0b2tlbiArICcmX2lkPScgKyByZXNbMF0uX2lkO1xuICAgICAgICBsZXQgaHRtbFRlbXBsYXRlID0gJ2ZvcmdvdHBhc3N3b3JkLmh0bWwnO1xuICAgICAgICBsZXQgZGF0YTpNYXA8c3RyaW5nLHN0cmluZz49IG5ldyBNYXAoW1snJGFwcGxpY2F0aW9uTGluayQnLGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpXSxcbiAgICAgICAgICBbJyRmaXJzdF9uYW1lJCcscmVzWzBdLmZpcnN0X25hbWVdLFsnJHVzZXJfbWFpbCQnLHJlc1swXS5lbWFpbF0sWyckbGluayQnLGxpbmtdLFsnJGFwcF9uYW1lJCcsdGhpcy5BUFBfTkFNRV1dKTtcbiAgICAgICAgbGV0IGF0dGFjaG1lbnQ9TWFpbEF0dGFjaG1lbnRzLkZvcmdldFBhc3N3b3JkQXR0YWNobWVudEFycmF5O1xuICAgICAgICBzZW5kTWFpbFNlcnZpY2Uuc2VuZCggZmllbGQuZW1haWwsIE1lc3NhZ2VzLkVNQUlMX1NVQkpFQ1RfRk9SR09UX1BBU1NXT1JELCBodG1sVGVtcGxhdGUsIGRhdGEsYXR0YWNobWVudCxcbihlcnI6IGFueSwgcmVzdWx0OiBhbnkpID0+IHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgcmVzdWx0KTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAocmVzLmxlbmd0aCA+IDAgJiYgcmVzWzBdLmlzQWN0aXZhdGVkID09PSBmYWxzZSkge1xuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX0FDQ09VTlRfU1RBVFVTKSwgcmVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfVVNFUl9OT1RfRk9VTkQpLCByZXMpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gIH1cblxuXG4gIFNlbmRDaGFuZ2VNYWlsVmVyaWZpY2F0aW9uKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBTZW50TWVzc2FnZUluZm8pID0+IHZvaWQpIHtcbiAgICBsZXQgcXVlcnkgPSB7J2VtYWlsJzogZmllbGQuY3VycmVudF9lbWFpbCwgJ2lzQWN0aXZhdGVkJzogdHJ1ZX07XG4gICAgbGV0IHVwZGF0ZURhdGEgPSB7JHNldDp7J3RlbXBfZW1haWwnOiBmaWVsZC5uZXdfZW1haWx9fTtcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZURhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX0VNQUlMX0FDVElWRV9OT1cpLCBudWxsKTtcbiAgICAgIH0gZWxzZSBpZihyZXN1bHQgPT0gbnVsbCkge1xuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1ZFUklGWV9BQ0NPVU5UKSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgYXV0aCA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcbiAgICAgICAgbGV0IHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZChyZXN1bHQpO1xuICAgICAgICBsZXQgaG9zdCA9IGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpO1xuICAgICAgICBsZXQgbGluayA9IGhvc3QgKyAnYWN0aXZhdGUtdXNlcj9hY2Nlc3NfdG9rZW49JyArIHRva2VuICsgJyZfaWQ9JyArIHJlc3VsdC5faWQrJ2lzRW1haWxWZXJpZmljYXRpb24nO1xuICAgICAgICBsZXQgc2VuZE1haWxTZXJ2aWNlID0gbmV3IFNlbmRNYWlsU2VydmljZSgpO1xuICAgICAgICBsZXQgZGF0YTogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoW1snJGFwcGxpY2F0aW9uTGluayQnLGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpXSxcbiAgICAgICAgICBbJyRsaW5rJCcsIGxpbmtdXSk7XG4gICAgICAgIGxldCBhdHRhY2htZW50PU1haWxBdHRhY2htZW50cy5BdHRhY2htZW50QXJyYXk7XG4gICAgICAgIHNlbmRNYWlsU2VydmljZS5zZW5kKGZpZWxkLm5ld19lbWFpbCxcbiAgICAgICAgICBNZXNzYWdlcy5FTUFJTF9TVUJKRUNUX0NIQU5HRV9FTUFJTElELFxuICAgICAgICAgICdjaGFuZ2UubWFpbC5odG1sJywgZGF0YSxhdHRhY2htZW50LCBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZW5kTWFpbChmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogU2VudE1lc3NhZ2VJbmZvKSA9PiB2b2lkKSB7XG4gICAgbGV0IHNlbmRNYWlsU2VydmljZSA9IG5ldyBTZW5kTWFpbFNlcnZpY2UoKTtcbiAgICBsZXQgZGF0YTpNYXA8c3RyaW5nLHN0cmluZz49IG5ldyBNYXAoW1snJGFwcGxpY2F0aW9uTGluayQnLGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpXSxcbiAgICAgIFsnJGZpcnN0X25hbWUkJyxmaWVsZC5maXJzdF9uYW1lXSxbJyRlbWFpbCQnLGZpZWxkLmVtYWlsXSxbJyRtZXNzYWdlJCcsZmllbGQubWVzc2FnZV1dKTtcbiAgICBsZXQgYXR0YWNobWVudD1NYWlsQXR0YWNobWVudHMuQXR0YWNobWVudEFycmF5O1xuICAgIHNlbmRNYWlsU2VydmljZS5zZW5kKGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuQURNSU5fTUFJTCcpLFxuICAgICAgTWVzc2FnZXMuRU1BSUxfU1VCSkVDVF9VU0VSX0NPTlRBQ1RFRF9ZT1UsXG4gICAgICAnY29udGFjdHVzLm1haWwuaHRtbCcsZGF0YSxhdHRhY2htZW50LGNhbGxiYWNrKTtcbiAgfVxuXG4gIHNlbmRNYWlsT25FcnJvcihlcnJvckluZm86IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IFNlbnRNZXNzYWdlSW5mbykgPT4gdm9pZCkge1xuICAgIGxldCBjdXJyZW50X1RpbWUgPSBuZXcgRGF0ZSgpLnRvTG9jYWxlVGltZVN0cmluZyhbXSwge2hvdXI6ICcyLWRpZ2l0JywgbWludXRlOiAnMi1kaWdpdCd9KTtcbiAgICBsZXQgZGF0YTpNYXA8c3RyaW5nLHN0cmluZz47XG4gICAgaWYoZXJyb3JJbmZvLnN0YWNrVHJhY2UpIHtcbiAgICAgICBkYXRhPSBuZXcgTWFwKFtbJyRhcHBsaWNhdGlvbkxpbmskJyxjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLmhvc3QnKV0sXG4gICAgICAgICBbJyR0aW1lJCcsY3VycmVudF9UaW1lXSxbJyRob3N0JCcsY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5ob3N0JyldLFxuICAgICAgICBbJyRyZWFzb24kJyxlcnJvckluZm8ucmVhc29uXSxbJyRjb2RlJCcsZXJyb3JJbmZvLmNvZGVdLFxuICAgICAgICBbJyRtZXNzYWdlJCcsZXJyb3JJbmZvLm1lc3NhZ2VdLFsnJGVycm9yJCcsZXJyb3JJbmZvLnN0YWNrVHJhY2Uuc3RhY2tdXSk7XG5cbiAgICB9IGVsc2UgaWYoZXJyb3JJbmZvLnN0YWNrKSB7XG4gICAgICBkYXRhPSBuZXcgTWFwKFtbJyRhcHBsaWNhdGlvbkxpbmskJyxjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLmhvc3QnKV0sXG4gICAgICAgIFsnJHRpbWUkJyxjdXJyZW50X1RpbWVdLFsnJGhvc3QkJyxjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLmhvc3QnKV0sXG4gICAgICAgIFsnJHJlYXNvbiQnLGVycm9ySW5mby5yZWFzb25dLFsnJGNvZGUkJyxlcnJvckluZm8uY29kZV0sXG4gICAgICAgIFsnJG1lc3NhZ2UkJyxlcnJvckluZm8ubWVzc2FnZV0sWyckZXJyb3IkJyxlcnJvckluZm8uc3RhY2tdXSk7XG4gICAgfVxuICAgIGxldCBzZW5kTWFpbFNlcnZpY2UgPSBuZXcgU2VuZE1haWxTZXJ2aWNlKCk7XG4gICAgbGV0IGF0dGFjaG1lbnQgPSBNYWlsQXR0YWNobWVudHMuQXR0YWNobWVudEFycmF5O1xuICAgIHNlbmRNYWlsU2VydmljZS5zZW5kKGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuQURNSU5fTUFJTCcpLFxuICAgICAgTWVzc2FnZXMuRU1BSUxfU1VCSkVDVF9TRVJWRVJfRVJST1IgKyAnIG9uICcgKyBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLmhvc3QnKSxcbiAgICAgICdlcnJvci5tYWlsLmh0bWwnLGRhdGEsYXR0YWNobWVudCwgY2FsbGJhY2ssY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5UUExHUk9VUF9NQUlMJykpO1xuICB9XG5cbiAgZmluZEJ5SWQoaWQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIHRoaXMudXNlclJlcG9zaXRvcnkuZmluZEJ5SWQoaWQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJldHJpZXZlKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnJldHJpZXZlKGZpZWxkLCBjYWxsYmFjayk7XG4gIH1cblxuICByZXRyaWV2ZVdpdGhMaW1pdChmaWVsZDogYW55LCBpbmNsdWRlZCA6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIGxldCBsaW1pdCA9IGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLmxpbWl0Rm9yUXVlcnknKTtcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnJldHJpZXZlV2l0aExpbWl0KGZpZWxkLCBpbmNsdWRlZCwgbGltaXQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJldHJpZXZlV2l0aExlYW4oZmllbGQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIHRoaXMudXNlclJlcG9zaXRvcnkucmV0cmlldmUoZmllbGQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJldHJpZXZlQWxsKGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIHRoaXMudXNlclJlcG9zaXRvcnkucmV0cmlldmUoaXRlbSwgKGVyciwgcmVzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfUkVHSVNUUkFUSU9OX01PQklMRV9OVU1CRVIpLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGUoX2lkOiBhbnksIGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kQnlJZChfaWQsIChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHtcblxuICAgICAgaWYgKGVycikge1xuICAgICAgICBjYWxsYmFjayhlcnIsIHJlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnVwZGF0ZShfaWQsIGl0ZW0sIGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG5cbiAgZGVsZXRlKF9pZDogc3RyaW5nLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5kZWxldGUoX2lkLCBjYWxsYmFjayk7XG4gIH1cblxuICBmaW5kT25lQW5kVXBkYXRlKHF1ZXJ5OiBhbnksIG5ld0RhdGE6IGFueSwgb3B0aW9uczogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBuZXdEYXRhLCBvcHRpb25zLCBjYWxsYmFjayk7XG4gIH1cblxuICBVcGxvYWRJbWFnZSh0ZW1wUGF0aDogYW55LCBmaWxlTmFtZTogYW55LCBjYjogYW55KSB7XG4gICAgbGV0IHRhcmdldHBhdGggPSBmaWxlTmFtZTtcbiAgICBmcy5yZW5hbWUodGVtcFBhdGgsIHRhcmdldHBhdGgsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIGNiKG51bGwsIHRlbXBQYXRoKTtcbiAgICB9KTtcbiAgfVxuXG4gIFVwbG9hZERvY3VtZW50cyh0ZW1wUGF0aDogYW55LCBmaWxlTmFtZTogYW55LCBjYjogYW55KSB7XG4gICAgbGV0IHRhcmdldHBhdGggPSBmaWxlTmFtZTtcbiAgICBmcy5yZW5hbWUodGVtcFBhdGgsIHRhcmdldHBhdGgsIGZ1bmN0aW9uIChlcnI6IGFueSkge1xuICAgICAgY2IobnVsbCwgdGVtcFBhdGgpO1xuICAgIH0pO1xuICB9XG5cbiAgZmluZEFuZFVwZGF0ZU5vdGlmaWNhdGlvbihxdWVyeTogYW55LCBuZXdEYXRhOiBhbnksIG9wdGlvbnM6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIHRoaXMudXNlclJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgbmV3RGF0YSwgb3B0aW9ucywgY2FsbGJhY2spO1xuICB9XG5cbiAgcmV0cmlldmVCeVNvcnRlZE9yZGVyKHF1ZXJ5OiBhbnksIHByb2plY3Rpb246YW55LCBzb3J0aW5nUXVlcnk6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIC8vdGhpcy51c2VyUmVwb3NpdG9yeS5yZXRyaWV2ZUJ5U29ydGVkT3JkZXIocXVlcnksIHByb2plY3Rpb24sIHNvcnRpbmdRdWVyeSwgY2FsbGJhY2spO1xuICB9XG5cbiAgcmVzZXRQYXNzd29yZChkYXRhOiBhbnksIHVzZXIgOiBhbnksIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT5hbnkpIHtcbiAgICBjb25zdCBzYWx0Um91bmRzID0gMTA7XG4gICAgYmNyeXB0Lmhhc2goZGF0YS5uZXdfcGFzc3dvcmQsIHNhbHRSb3VuZHMsIChlcnI6IGFueSwgaGFzaDogYW55KSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNhbGxiYWNrKHtcbiAgICAgICAgICByZWFzb246ICdFcnJvciBpbiBjcmVhdGluZyBoYXNoIHVzaW5nIGJjcnlwdCcsXG4gICAgICAgICAgbWVzc2FnZTogJ0Vycm9yIGluIGNyZWF0aW5nIGhhc2ggdXNpbmcgYmNyeXB0JyxcbiAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgICBjb2RlOiA0MDNcbiAgICAgICAgfSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgdXBkYXRlRGF0YSA9IHsncGFzc3dvcmQnOiBoYXNofTtcbiAgICAgICAgbGV0IHF1ZXJ5ID0geydfaWQnOiB1c2VyLl9pZCwgJ3Bhc3N3b3JkJzogdXNlci5wYXNzd29yZH07XG4gICAgICAgIHRoaXMuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwse1xuICAgICAgICAgICAgICAnc3RhdHVzJzogJ1N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAnZGF0YSc6IHsnbWVzc2FnZSc6ICdQYXNzd29yZCBjaGFuZ2VkIHN1Y2Nlc3NmdWxseSd9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlRGV0YWlscyhkYXRhOiAgVXNlck1vZGVsLCB1c2VyOiBVc2VyTW9kZWwsIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIGxldCBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XG4gICAgbGV0IHF1ZXJ5ID0geydfaWQnOiB1c2VyLl9pZH07XG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBkYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayhudWxsLHtcbiAgICAgICAgICAnc3RhdHVzJzogJ1N1Y2Nlc3MnLFxuICAgICAgICAgICdkYXRhJzogeydtZXNzYWdlJzogJ1VzZXIgUHJvZmlsZSBVcGRhdGVkIHN1Y2Nlc3NmdWxseSd9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgfSk7XG4gIH1cblxuICBnZXRVc2VyQnlJZCh1c2VyOmFueSwgY2FsbGJhY2s6KGVycm9yOmFueSwgcmVzdWx0OmFueSk9PnZvaWQpIHtcbiAgICBsZXQgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xuXG4gICAgbGV0IHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKTtcbiAgICBjYWxsYmFjayhudWxsLHtcbiAgICAgICdzdGF0dXMnOiAnc3VjY2VzcycsXG4gICAgICAnZGF0YSc6IHtcbiAgICAgICAgJ2ZpcnN0X25hbWUnOiB1c2VyLmZpcnN0X25hbWUsXG4gICAgICAgICdsYXN0X25hbWUnOiB1c2VyLmxhc3RfbmFtZSxcbiAgICAgICAgJ2VtYWlsJzogdXNlci5lbWFpbCxcbiAgICAgICAgJ21vYmlsZV9udW1iZXInOiB1c2VyLm1vYmlsZV9udW1iZXIsXG4gICAgICAgICdjb21wYW55X25hbWUnOiB1c2VyLmNvbXBhbnlfbmFtZSxcbiAgICAgICAgJ3N0YXRlJzogdXNlci5zdGF0ZSxcbiAgICAgICAgJ2NpdHknOiB1c2VyLmNpdHksXG4gICAgICAgICdwaWN0dXJlJzogdXNlci5waWN0dXJlLFxuICAgICAgICAnc29jaWFsX3Byb2ZpbGVfcGljdHVyZSc6IHVzZXIuc29jaWFsX3Byb2ZpbGVfcGljdHVyZSxcbiAgICAgICAgJ19pZCc6IHVzZXIuX2lkLFxuICAgICAgICAnY3VycmVudF90aGVtZSc6IHVzZXIuY3VycmVudF90aGVtZVxuICAgICAgfSxcbiAgICAgIGFjY2Vzc190b2tlbjogdG9rZW5cbiAgICB9KTtcbiAgfVxuXG4gIHZlcmlmeUFjY291bnQodXNlcjpVc2VyLCBjYWxsYmFjazooZXJyb3I6YW55LCByZXN1bHQ6YW55KT0+dm9pZCkge1xuICAgIGxldCBxdWVyeSA9IHsnX2lkJzogdXNlci5faWQsICdpc0FjdGl2YXRlZCc6IGZhbHNlfTtcbiAgICBsZXQgdXBkYXRlRGF0YSA9IHsnaXNBY3RpdmF0ZWQnOiB0cnVlfTtcbiAgICB0aGlzLmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZURhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKG51bGwse1xuICAgICAgICAgICdzdGF0dXMnOiAnU3VjY2VzcycsXG4gICAgICAgICAgJ2RhdGEnOiB7J21lc3NhZ2UnOiAnVXNlciBBY2NvdW50IHZlcmlmaWVkIHN1Y2Nlc3NmdWxseSd9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgfSk7XG4gIH1cblxuICBjaGFuZ2VFbWFpbElkKGRhdGE6YW55LCB1c2VyIDogVXNlciwgY2FsbGJhY2s6KGVycm9yOmFueSwgcmVzdWx0OmFueSk9PnZvaWQpIHtcbiAgICBsZXQgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xuICAgIGxldCBxdWVyeSA9IHsnZW1haWwnOiBkYXRhLm5ld19lbWFpbH07XG5cbiAgICB0aGlzLnJldHJpZXZlKHF1ZXJ5LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuXG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICAgICAgfSBlbHNlIGlmIChyZXN1bHQubGVuZ3RoID4gMCAmJiByZXN1bHRbMF0uaXNBY3RpdmF0ZWQgPT09IHRydWUpIHtcbiAgICAgICAgY2FsbGJhY2soe1xuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT04sXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgY29kZTogNDAwXG4gICAgICAgIH0sbnVsbCk7XG4gICAgICB9IGVsc2UgaWYgKHJlc3VsdC5sZW5ndGggPiAwICYmIHJlc3VsdFswXS5pc0FjdGl2YXRlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgY2FsbGJhY2soe1xuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9BQ0NPVU5UX1NUQVRVUyxcbiAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgICBjb2RlOiA0MDBcbiAgICAgICAgfSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLlNlbmRDaGFuZ2VNYWlsVmVyaWZpY2F0aW9uKGRhdGEsIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAoZXJyb3IubWVzc2FnZSA9PT0gTWVzc2FnZXMuTVNHX0VSUk9SX0NIRUNLX0VNQUlMX0FDQ09VTlQpIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2soe1xuICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTUFJTF9BQ1RJVkVfTk9XLFxuICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgICAgICAgIGNvZGU6IDQwMFxuICAgICAgICAgICAgICB9LCBudWxsKTtcbiAgICAgICAgICAgIH1pZiAoZXJyb3IubWVzc2FnZSA9PT0gTWVzc2FnZXMuTVNHX0VSUk9SX1ZFUklGWV9BQ0NPVU5UKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKHtcbiAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQUNDT1VOVCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0FDQ09VTlQsXG4gICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgICAgICAgY29kZTogNDAwXG4gICAgICAgICAgICAgIH0sIG51bGwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2soe1xuICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9XSElMRV9DT05UQUNUSU5HLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XSElMRV9DT05UQUNUSU5HLFxuICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgICAgICAgIGNvZGU6IDQwMFxuICAgICAgICAgICAgICB9LCBudWxsKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7XG4gICAgICAgICAgICAgICdzdGF0dXMnOiBNZXNzYWdlcy5TVEFUVVNfU1VDQ0VTUyxcbiAgICAgICAgICAgICAgJ2RhdGEnOiB7J21lc3NhZ2UnOiBNZXNzYWdlcy5NU0dfU1VDQ0VTU19FTUFJTF9DSEFOR0VfRU1BSUxJRH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHZlcmlmeUNoYW5nZWRFbWFpbElkKHVzZXI6IGFueSwgY2FsbGJhY2s6KGVycm9yIDogYW55LCByZXN1bHQgOiBhbnkpPT4gYW55KSB7XG4gICAgbGV0IHF1ZXJ5ID0geydfaWQnOiB1c2VyLl9pZH07XG4gICAgbGV0IHVwZGF0ZURhdGEgPSB7J2VtYWlsJzogdXNlci50ZW1wX2VtYWlsLCAndGVtcF9lbWFpbCc6IHVzZXIuZW1haWx9O1xuICAgIHRoaXMuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sobnVsbCx7XG4gICAgICAgICAgJ3N0YXR1cyc6ICdTdWNjZXNzJyxcbiAgICAgICAgICAnZGF0YSc6IHsnbWVzc2FnZSc6ICdVc2VyIEFjY291bnQgdmVyaWZpZWQgc3VjY2Vzc2Z1bGx5J31cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICB9KTtcbiAgfVxuXG4gIHZlcmlmeU1vYmlsZU51bWJlcihkYXRhIDphbnkgLCB1c2VyIDogYW55LCBjYWxsYmFjazooZXJyb3I6YW55LCByZXN1bHQ6YW55KT0+dm9pZCkge1xuICAgIGxldCBxdWVyeSA9IHsnX2lkJzogdXNlci5faWR9O1xuICAgIGxldCB1cGRhdGVEYXRhID0geydtb2JpbGVfbnVtYmVyJzogdXNlci50ZW1wX21vYmlsZSwgJ3RlbXBfbW9iaWxlJzogdXNlci5tb2JpbGVfbnVtYmVyfTtcbiAgICBpZiAodXNlci5vdHAgPT09IGRhdGEub3RwKSB7XG4gICAgICB0aGlzLmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZURhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FsbGJhY2sobnVsbCx7XG4gICAgICAgICAgICAnc3RhdHVzJzogJ1N1Y2Nlc3MnLFxuICAgICAgICAgICAgJ2RhdGEnOiB7J21lc3NhZ2UnOiAnVXNlciBBY2NvdW50IHZlcmlmaWVkIHN1Y2Nlc3NmdWxseSd9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYWxsYmFjayh7XG4gICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxuICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfT1RQLFxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgY29kZTogNDAwXG4gICAgICB9LCBudWxsKTtcbiAgICB9XG4gIH1cblxuICBhc3NpZ25QcmVtaXVtUGFja2FnZSh1c2VyOlVzZXIsdXNlcklkOnN0cmluZywgY29zdDogbnVtYmVyLGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcbiAgICBsZXQgcHJvamVjdGlvbiA9IHtzdWJzY3JpcHRpb246IDF9O1xuICAgIHRoaXMudXNlclJlcG9zaXRvcnkuZmluZEJ5SWRXaXRoUHJvamVjdGlvbih1c2VySWQscHJvamVjdGlvbiwoZXJyb3IscmVzdWx0KT0+IHtcbiAgICAgIGlmKGVycm9yKSB7XG4gICAgICAgIGNhbGxiYWNrKGVycm9yLG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHN1YlNjcmlwdGlvbkFycmF5ID0gcmVzdWx0LnN1YnNjcmlwdGlvbjtcbiAgICAgICAgbGV0IHN1YlNjcmlwdGlvblNlcnZpY2UgPSBuZXcgU3Vic2NyaXB0aW9uU2VydmljZSgpO1xuICAgICAgICBzdWJTY3JpcHRpb25TZXJ2aWNlLmdldFN1YnNjcmlwdGlvblBhY2thZ2VCeU5hbWUoJ1ByZW1pdW0nLCdCYXNlUGFja2FnZScsXG4gICAgICAgICAgKGVycm9yOiBhbnksIHN1YnNjcmlwdGlvblBhY2thZ2U6IEFycmF5PFN1YnNjcmlwdGlvblBhY2thZ2U+KSA9PiB7XG4gICAgICAgICAgICBpZihlcnJvcikge1xuICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvcixudWxsKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGxldCBwcmVtaXVtUGFja2FnZSA9IHN1YnNjcmlwdGlvblBhY2thZ2VbMF07XG4gICAgICAgICAgICAgIGlmKHN1YlNjcmlwdGlvbkFycmF5WzBdLnByb2plY3RJZC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBzdWJTY3JpcHRpb25BcnJheVswXS5udW1PZkJ1aWxkaW5ncyA9IHByZW1pdW1QYWNrYWdlLmJhc2VQYWNrYWdlLm51bU9mQnVpbGRpbmdzO1xuICAgICAgICAgICAgICAgIHN1YlNjcmlwdGlvbkFycmF5WzBdLm51bU9mUHJvamVjdHMgPSBwcmVtaXVtUGFja2FnZS5iYXNlUGFja2FnZS5udW1PZlByb2plY3RzO1xuICAgICAgICAgICAgICAgIHN1YlNjcmlwdGlvbkFycmF5WzBdLnZhbGlkaXR5ID0gc3ViU2NyaXB0aW9uQXJyYXlbMF0udmFsaWRpdHkgKyBwcmVtaXVtUGFja2FnZS5iYXNlUGFja2FnZS52YWxpZGl0eTtcbiAgICAgICAgICAgICAgICBzdWJTY3JpcHRpb25BcnJheVswXS5wdXJjaGFzZWQucHVzaChwcmVtaXVtUGFja2FnZS5iYXNlUGFja2FnZSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IHN1YnNjcmlwdGlvbiA9IG5ldyBVc2VyU3Vic2NyaXB0aW9uKCk7XG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLmFjdGl2YXRpb25EYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24ubnVtT2ZCdWlsZGluZ3MgPSBwcmVtaXVtUGFja2FnZS5iYXNlUGFja2FnZS5udW1PZkJ1aWxkaW5ncztcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24ubnVtT2ZQcm9qZWN0cyA9IHByZW1pdW1QYWNrYWdlLmJhc2VQYWNrYWdlLm51bU9mUHJvamVjdHM7XG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLnZhbGlkaXR5ID0gcHJlbWl1bVBhY2thZ2UuYmFzZVBhY2thZ2UudmFsaWRpdHk7XG4gICAgICAgICAgICAgICAgcHJlbWl1bVBhY2thZ2UuYmFzZVBhY2thZ2UuY29zdCA9IGNvc3Q7XG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLnByb2plY3RJZCA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLnB1cmNoYXNlZCA9IG5ldyBBcnJheTxCYXNlU3Vic2NyaXB0aW9uUGFja2FnZT4oKTtcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24ucHVyY2hhc2VkLnB1c2gocHJlbWl1bVBhY2thZ2UuYmFzZVBhY2thZ2UpO1xuICAgICAgICAgICAgICAgIHN1YlNjcmlwdGlvbkFycmF5LnB1c2goc3Vic2NyaXB0aW9uKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBsZXQgcXVlcnkgPSB7J19pZCc6IHVzZXJJZH07XG4gICAgICAgICAgICAgIGxldCBuZXdEYXRhID0geyRzZXQ6IHsnc3Vic2NyaXB0aW9uJzogc3ViU2NyaXB0aW9uQXJyYXl9fTtcbiAgICAgICAgICAgICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBuZXdEYXRhLCB7bmV3OiB0cnVlfSwgKGVyciwgcmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTonc3VjY2Vzcyd9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldFByb2plY3RzKHVzZXI6IFVzZXIsIGNhbGxiYWNrOihlcnJvciA6IGFueSwgcmVzdWx0IDphbnkpPT52b2lkKSB7XG5cbiAgICBsZXQgcXVlcnkgPSB7X2lkOiB1c2VyLl9pZCB9O1xuICAgIGxldCBwb3B1bGF0ZSA9IHtwYXRoOiAncHJvamVjdCcsIHNlbGVjdDogWyduYW1lJywnYnVpbGRpbmdzJywnYWN0aXZlU3RhdHVzJ119O1xuICAgIHRoaXMudXNlclJlcG9zaXRvcnkuZmluZEFuZFBvcHVsYXRlKHF1ZXJ5LCBwb3B1bGF0ZSwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgYXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xuICAgICAgICBsZXQgcG9wdWxhdGVkUHJvamVjdCA9IHJlc3VsdFswXTtcbiAgICAgICAgbGV0IHByb2plY3RMaXN0ID0gcmVzdWx0WzBdLnByb2plY3Q7XG4gICAgICAgIGxldCBzdWJzY3JpcHRpb25MaXN0ID0gcmVzdWx0WzBdLnN1YnNjcmlwdGlvbjtcblxuICAgICAgICBsZXQgcHJvamVjdFN1YnNjcmlwdGlvbkFycmF5ID0gQXJyYXk8UHJvamVjdFN1YnNjcmlwdGlvbkRldGFpbHM+KCk7XG4gICAgICAgIGxldCBzYW1wbGVQcm9qZWN0U3Vic2NyaXB0aW9uQXJyYXkgPSBBcnJheTxQcm9qZWN0U3Vic2NyaXB0aW9uRGV0YWlscz4oKTtcbiAgICAgICAgbGV0IGlzQWJsZVRvQ3JlYXRlTmV3UHJvamVjdCA6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgZm9yKGxldCBwcm9qZWN0IG9mIHByb2plY3RMaXN0KSB7XG4gICAgICAgICAgZm9yKGxldCBzdWJzY3JpcHRpb24gb2Ygc3Vic2NyaXB0aW9uTGlzdCkge1xuICAgICAgICAgICAgaWYoc3Vic2NyaXB0aW9uLnByb2plY3RJZC5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICAgaWYoc3Vic2NyaXB0aW9uLnByb2plY3RJZFswXS5lcXVhbHMocHJvamVjdC5faWQpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHByb2plY3RTdWJzY3JpcHRpb24gPSBuZXcgUHJvamVjdFN1YnNjcmlwdGlvbkRldGFpbHMoKTtcbiAgICAgICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLnByb2plY3ROYW1lID0gcHJvamVjdC5uYW1lO1xuICAgICAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24ucHJvamVjdElkID0gcHJvamVjdC5faWQ7XG4gICAgICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5hY3RpdmVTdGF0dXMgPSBwcm9qZWN0LmFjdGl2ZVN0YXR1cztcbiAgICAgICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLm51bU9mQnVpbGRpbmdzUmVtYWluaW5nID0gKHN1YnNjcmlwdGlvbi5udW1PZkJ1aWxkaW5ncyAtIHByb2plY3QuYnVpbGRpbmdzLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5udW1PZkJ1aWxkaW5nc0FsbG9jYXRlZCA9IHByb2plY3QuYnVpbGRpbmdzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLnBhY2thZ2VOYW1lID0gdGhpcy5jaGVja0N1cnJlbnRQYWNrYWdlKHN1YnNjcmlwdGlvbik7XG4gICAgICAgICAgICAgICAgLy9hY3RpdmF0aW9uIGRhdGUgZm9yIHByb2plY3Qgc3Vic2NyaXB0aW9uXG4gICAgICAgICAgICAgICAgbGV0IGFjdGl2YXRpb25fZGF0ZSA9IG5ldyBEYXRlKHN1YnNjcmlwdGlvbi5hY3RpdmF0aW9uRGF0ZSk7XG4gICAgICAgICAgICAgICAgbGV0IGV4cGlyeURhdGUgPSBuZXcgRGF0ZShzdWJzY3JpcHRpb24uYWN0aXZhdGlvbkRhdGUpO1xuICAgICAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24uZXhwaXJ5RGF0ZSA9IG5ldyBEYXRlKGV4cGlyeURhdGUuc2V0RGF0ZShhY3RpdmF0aW9uX2RhdGUuZ2V0RGF0ZSgpICsgc3Vic2NyaXB0aW9uLnZhbGlkaXR5KSk7XG5cbiAgICAgICAgICAgICAgICAvL2V4cGlyeSBkYXRlIGZvciBwcm9qZWN0IHN1YnNjcmlwdGlvblxuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50X2RhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgICAgIHZhciBuZXdFeGlwcnlEYXRlID0gbmV3IERhdGUocHJvamVjdFN1YnNjcmlwdGlvbi5leHBpcnlEYXRlKTtcbiAgICAgICAgICAgICAgICBuZXdFeGlwcnlEYXRlLnNldERhdGUocHJvamVjdFN1YnNjcmlwdGlvbi5leHBpcnlEYXRlLmdldERhdGUoKSArIDMwKTtcbiAgICAgICAgICAgICAgICBsZXQgbm9PZkRheXMgPSAgdGhpcy5kYXlzZGlmZmVyZW5jZShuZXdFeGlwcnlEYXRlLCAgY3VycmVudF9kYXRlKTtcbiAgICAgICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLm51bU9mRGF5c1RvRXhwaXJlID0gdGhpcy5kYXlzZGlmZmVyZW5jZShwcm9qZWN0U3Vic2NyaXB0aW9uLmV4cGlyeURhdGUsIGN1cnJlbnRfZGF0ZSk7XG5cbiAgICAgICAgICAgICAgICBpZihwcm9qZWN0U3Vic2NyaXB0aW9uLm51bU9mRGF5c1RvRXhwaXJlIDwgMzAgJiYgcHJvamVjdFN1YnNjcmlwdGlvbi5udW1PZkRheXNUb0V4cGlyZSA+MCkge1xuICAgICAgICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi53YXJuaW5nTWVzc2FnZSA9XG4gICAgICAgICAgICAgICAgICAgICdFeHBpcmluZyBpbiAnICsgIE1hdGgucm91bmQocHJvamVjdFN1YnNjcmlwdGlvbi5udW1PZkRheXNUb0V4cGlyZSkgKyAnIGRheXMsJyA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKHByb2plY3RTdWJzY3JpcHRpb24ubnVtT2ZEYXlzVG9FeHBpcmUgPD0gMCAmJiAgbm9PZkRheXMgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5leHBpcnlNZXNzYWdlID0gICdQcm9qZWN0IGV4cGlyZWQsJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYobm9PZkRheXMgPCAwKSB7XG4gICAgICAgICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLmFjdGl2ZVN0YXR1cyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb25BcnJheS5wdXNoKHByb2plY3RTdWJzY3JpcHRpb24pO1xuXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSAge1xuICAgICAgICAgICAgICBpc0FibGVUb0NyZWF0ZU5ld1Byb2plY3QgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHByb2plY3RMaXN0Lmxlbmd0aCA9PT0gMCAmJiBzdWJzY3JpcHRpb25MaXN0WzBdLnB1cmNoYXNlZC5sZW5ndGggIT09MCkge1xuICAgICAgICAgIGlzQWJsZVRvQ3JlYXRlTmV3UHJvamVjdCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcHJvamVjdElkID0gY29uZmlnLmdldCgnc2FtcGxlUHJvamVjdC4nICsgJ3Byb2plY3RJZCcpO1xuICAgICAgICBsZXQgcHJvamVjdGlvbiA9IHsnbmFtZSc6IDEsICdhY3RpdmVTdGF0dXMnOiAxfTtcbiAgICAgICAgdGhpcy5wcm9qZWN0UmVwb3NpdG9yeS5maW5kQnlJZFdpdGhQcm9qZWN0aW9uKHByb2plY3RJZCwgcHJvamVjdGlvbiwgKGVycm9yLCBwcm9qZWN0KSA9PiB7XG4gICAgICAgICAgaWYoZXJyb3IpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBwcm9qZWN0O1xuICAgICAgICAgICAgbGV0IHNhbXBsZVByb2plY3RTdWJzY3JpcHRpb24gPSBuZXcgUHJvamVjdFN1YnNjcmlwdGlvbkRldGFpbHMoKTtcbiAgICAgICAgICAgIHNhbXBsZVByb2plY3RTdWJzY3JpcHRpb24ucHJvamVjdE5hbWUgPSBwcm9qZWN0Lm5hbWU7XG4gICAgICAgICAgICBzYW1wbGVQcm9qZWN0U3Vic2NyaXB0aW9uLnByb2plY3RJZCA9IHByb2plY3QuX2lkO1xuICAgICAgICAgICAgc2FtcGxlUHJvamVjdFN1YnNjcmlwdGlvbi5hY3RpdmVTdGF0dXMgPSBwcm9qZWN0LmFjdGl2ZVN0YXR1cztcbiAgICAgICAgICAgIHNhbXBsZVByb2plY3RTdWJzY3JpcHRpb25BcnJheS5wdXNoKHNhbXBsZVByb2plY3RTdWJzY3JpcHRpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYWxsYmFjayhudWxsLCB7XG4gICAgICAgICAgICBkYXRhOiBwcm9qZWN0U3Vic2NyaXB0aW9uQXJyYXksXG4gICAgICAgICAgICBzYW1wbGVQcm9qZWN0OiBzYW1wbGVQcm9qZWN0U3Vic2NyaXB0aW9uQXJyYXksXG4gICAgICAgICAgICBpc1N1YnNjcmlwdGlvbkF2YWlsYWJsZSA6IGlzQWJsZVRvQ3JlYXRlTmV3UHJvamVjdCxcbiAgICAgICAgICAgIGFjY2Vzc190b2tlbjogYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy9UbyBjaGVjayB3aGljaCBpcyBjdXJyZW50IHBhY2thZ2Ugb2NjdXBpZWQgYnkgdXNlci5cbiAgIGNoZWNrQ3VycmVudFBhY2thZ2Uoc3Vic2NyaXB0aW9uOmFueSkge1xuICAgICBsZXQgYWN0aXZhdGlvbl9kYXRlID0gbmV3IERhdGUoc3Vic2NyaXB0aW9uLmFjdGl2YXRpb25EYXRlKTtcbiAgICAgbGV0IGV4cGlyeURhdGUgPSBuZXcgRGF0ZShzdWJzY3JpcHRpb24uYWN0aXZhdGlvbkRhdGUpO1xuICAgICBsZXQgZXhwaXJ5RGF0ZU91dGVyID0gbmV3IERhdGUoc3Vic2NyaXB0aW9uLmFjdGl2YXRpb25EYXRlKTtcbiAgICAgbGV0IGN1cnJlbnRfZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgIGZvcihsZXQgcHVyY2hhc2VQYWNrYWdlIG9mIHN1YnNjcmlwdGlvbi5wdXJjaGFzZWQpIHtcbiAgICAgICBleHBpcnlEYXRlT3V0ZXIgPSBuZXcgRGF0ZShleHBpcnlEYXRlT3V0ZXIuc2V0RGF0ZShhY3RpdmF0aW9uX2RhdGUuZ2V0RGF0ZSgpICsgcHVyY2hhc2VQYWNrYWdlLnZhbGlkaXR5KSk7XG4gICAgICAgZm9yIChsZXQgcHVyY2hhc2VQYWNrYWdlIG9mIHN1YnNjcmlwdGlvbi5wdXJjaGFzZWQpIHtcbiAgICAgICAgIC8vZXhwaXJ5IGRhdGUgZm9yIGVhY2ggcGFja2FnZS5cbiAgICAgICAgIGV4cGlyeURhdGUgPSBuZXcgRGF0ZShleHBpcnlEYXRlLnNldERhdGUoYWN0aXZhdGlvbl9kYXRlLmdldERhdGUoKSArIHB1cmNoYXNlUGFja2FnZS52YWxpZGl0eSkpO1xuICAgICAgICAgaWYgKChleHBpcnlEYXRlT3V0ZXIgPCBleHBpcnlEYXRlKSAmJiAoZXhwaXJ5RGF0ZSA+PWN1cnJlbnRfZGF0ZSkpIHtcbiAgICAgICAgICAgcmV0dXJuIHB1cmNoYXNlUGFja2FnZS5uYW1lO1xuICAgICAgICAgICB9XG4gICAgICAgfVxuICAgICAgIGlmKHB1cmNoYXNlUGFja2FnZS5uYW1lID09PSdGcmVlJykge1xuICAgICAgICAgcmV0dXJuIHB1cmNoYXNlUGFja2FnZS5uYW1lPSdGcmVlJztcbiAgICAgICB9IGVsc2Uge1xuICAgICAgICAgcmV0dXJuIHB1cmNoYXNlUGFja2FnZS5uYW1lPSdQcmVtaXVtJztcbiAgICAgICB9XG4gICAgIH1cbiAgICB9XG5cbiAgZGF5c2RpZmZlcmVuY2UoZGF0ZTEgOiBEYXRlLCBkYXRlMiA6IERhdGUpIHtcbiAgICBsZXQgT05FREFZID0gMTAwMCAqIDYwICogNjAgKiAyNDtcbiAgICBsZXQgZGF0ZTFfbXMgPSBkYXRlMS5nZXRUaW1lKCk7XG4gICAgbGV0IGRhdGUyX21zID0gZGF0ZTIuZ2V0VGltZSgpO1xuICAgIGxldCBkaWZmZXJlbmNlX21zID0gKGRhdGUxX21zIC0gZGF0ZTJfbXMpO1xuICAgIHJldHVybiBNYXRoLnJvdW5kKGRpZmZlcmVuY2VfbXMvT05FREFZKTtcbiAgfVxuXG4gIGdldFByb2plY3RTdWJzY3JpcHRpb24odXNlcjogVXNlciwgcHJvamVjdElkOiBzdHJpbmcsIGNhbGxiYWNrOihlcnJvciA6IGFueSwgcmVzdWx0IDphbnkpPT52b2lkKSB7XG5cbiAgICBsZXQgcXVlcnkgPSBbXG4gICAgICB7JG1hdGNoOiB7J19pZCc6T2JqZWN0SWQodXNlci5faWQpfX0sXG4gICAgICB7ICRwcm9qZWN0IDogeydzdWJzY3JpcHRpb24nOjF9fSxcbiAgICAgIHsgJHVud2luZDogJyRzdWJzY3JpcHRpb24nfSxcbiAgICAgIHsgJG1hdGNoOiB7J3N1YnNjcmlwdGlvbi5wcm9qZWN0SWQnIDogT2JqZWN0SWQocHJvamVjdElkKX19XG4gICAgXTtcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmFnZ3JlZ2F0ZShxdWVyeSAsKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgcXVlcnkgPSB7IF9pZDogcHJvamVjdElkfTtcbiAgICAgICAgbGV0IHBvcHVsYXRlID0ge3BhdGggOiAnYnVpbGRpbmdzJ307XG4gICAgICAgIHRoaXMucHJvamVjdFJlcG9zaXRvcnkuZmluZEFuZFBvcHVsYXRlKHF1ZXJ5LCBwb3B1bGF0ZSwgKGVycm9yLCByZXNwKSA9PiB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBwcm9qZWN0U3Vic2NyaXB0aW9uID0gbmV3IFByb2plY3RTdWJzY3JpcHRpb25EZXRhaWxzKCk7XG4gICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLnByb2plY3ROYW1lID0gcmVzcFswXS5uYW1lO1xuICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5wcm9qZWN0SWQgPSByZXNwWzBdLl9pZDtcbiAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24uYWN0aXZlU3RhdHVzID0gcmVzcFswXS5hY3RpdmVTdGF0dXM7XG4gICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLm51bU9mQnVpbGRpbmdzQWxsb2NhdGVkID0gcmVzcFswXS5idWlsZGluZ3MubGVuZ3RoO1xuICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5udW1PZkJ1aWxkaW5nc0V4aXN0ID0gcmVzdWx0WzBdLnN1YnNjcmlwdGlvbi5udW1PZkJ1aWxkaW5ncztcbiAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24ubnVtT2ZCdWlsZGluZ3NSZW1haW5pbmcgPSAocmVzdWx0WzBdLnN1YnNjcmlwdGlvbi5udW1PZkJ1aWxkaW5ncyAtIHJlc3BbMF0uYnVpbGRpbmdzLmxlbmd0aCk7XG4gICAgICAgICAgICBpZihyZXN1bHRbMF0uc3Vic2NyaXB0aW9uLm51bU9mQnVpbGRpbmdzID09PSAxMCAmJiBwcm9qZWN0U3Vic2NyaXB0aW9uLm51bU9mQnVpbGRpbmdzUmVtYWluaW5nID09PTAgJiYgcHJvamVjdFN1YnNjcmlwdGlvbi5wYWNrYWdlTmFtZSAhPT0gJ0ZyZWUnKSB7XG4gICAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24uYWRkQnVpbGRpbmdEaXNhYmxlPXRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24ucGFja2FnZU5hbWUgPSB0aGlzLmNoZWNrQ3VycmVudFBhY2thZ2UocmVzdWx0WzBdLnN1YnNjcmlwdGlvbik7XG4gICAgICAgICAgICBpZihwcm9qZWN0U3Vic2NyaXB0aW9uLnBhY2thZ2VOYW1lID09PSAnRnJlZScgJiYgcHJvamVjdFN1YnNjcmlwdGlvbi5udW1PZkJ1aWxkaW5nc1JlbWFpbmluZyA9PT0gMCkge1xuICAgICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLmFkZEJ1aWxkaW5nRGlzYWJsZT10cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgYWN0aXZhdGlvbl9kYXRlID0gbmV3IERhdGUocmVzdWx0WzBdLnN1YnNjcmlwdGlvbi5hY3RpdmF0aW9uRGF0ZSk7XG4gICAgICAgICAgICBsZXQgZXhwaXJ5RGF0ZSA9IG5ldyBEYXRlKHJlc3VsdFswXS5zdWJzY3JpcHRpb24uYWN0aXZhdGlvbkRhdGUpO1xuICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi5leHBpcnlEYXRlID0gbmV3IERhdGUoZXhwaXJ5RGF0ZS5zZXREYXRlKGFjdGl2YXRpb25fZGF0ZS5nZXREYXRlKCkgKyByZXN1bHRbMF0uc3Vic2NyaXB0aW9uLnZhbGlkaXR5KSk7XG5cbiAgICAgICAgICAgIC8vZXhwaXJ5IGRhdGUgZm9yIHByb2plY3Qgc3Vic2NyaXB0aW9uXG4gICAgICAgICAgICBsZXQgY3VycmVudF9kYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIHZhciBuZXdFeGlwcnlEYXRlID0gbmV3IERhdGUocHJvamVjdFN1YnNjcmlwdGlvbi5leHBpcnlEYXRlKTtcbiAgICAgICAgICAgIG5ld0V4aXByeURhdGUuc2V0RGF0ZShwcm9qZWN0U3Vic2NyaXB0aW9uLmV4cGlyeURhdGUuZ2V0RGF0ZSgpICsgMzApO1xuICAgICAgICAgICAgbGV0IG5vT2ZEYXlzID0gIHRoaXMuZGF5c2RpZmZlcmVuY2UobmV3RXhpcHJ5RGF0ZSwgIGN1cnJlbnRfZGF0ZSk7XG5cbiAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24ubnVtT2ZEYXlzVG9FeHBpcmUgPSB0aGlzLmRheXNkaWZmZXJlbmNlKHByb2plY3RTdWJzY3JpcHRpb24uZXhwaXJ5RGF0ZSwgY3VycmVudF9kYXRlKTtcblxuICAgICAgICAgICAgaWYocHJvamVjdFN1YnNjcmlwdGlvbi5udW1PZkRheXNUb0V4cGlyZSA8IDMwICYmIHByb2plY3RTdWJzY3JpcHRpb24ubnVtT2ZEYXlzVG9FeHBpcmUgPjApIHtcbiAgICAgICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi53YXJuaW5nTWVzc2FnZSA9XG4gICAgICAgICAgICAgICAgJ0V4cGlyaW5nIGluICcgKyAgTWF0aC5yb3VuZChwcm9qZWN0U3Vic2NyaXB0aW9uLm51bU9mRGF5c1RvRXhwaXJlKSArICcgZGF5cy4nIDtcbiAgICAgICAgICAgIH0gZWxzZSBpZihwcm9qZWN0U3Vic2NyaXB0aW9uLm51bU9mRGF5c1RvRXhwaXJlIDw9IDAgJiYgbm9PZkRheXMgPj0gMCkge1xuICAgICAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLmV4cGlyeU1lc3NhZ2UgPSAnUHJvamVjdCBleHBpcmVkLCc7XG4gICAgICAgICAgICB9IGVsc2UgaWYobm9PZkRheXMgPCAwKSB7XG4gICAgICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24uYWN0aXZlU3RhdHVzID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBwcm9qZWN0U3Vic2NyaXB0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlU3Vic2NyaXB0aW9uKHVzZXIgOiBVc2VyLCBwcm9qZWN0SWQ6IHN0cmluZywgcGFja2FnZU5hbWU6IHN0cmluZyxjb3N0Rm9yQnVpbGRpbmdQdXJjaGFzZWQ6YW55LG51bWJlck9mQnVpbGRpbmdzUHVyY2hhc2VkOmFueSwgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KT0+IHZvaWQpIHtcbiAgICBsZXQgcXVlcnkgPSBbXG4gICAgICB7JG1hdGNoOiB7J19pZCc6T2JqZWN0SWQodXNlci5faWQpfX0sXG4gICAgICB7ICRwcm9qZWN0IDogeydzdWJzY3JpcHRpb24nOjF9fSxcbiAgICAgIHsgJHVud2luZDogJyRzdWJzY3JpcHRpb24nfSxcbiAgICAgIHsgJG1hdGNoOiB7J3N1YnNjcmlwdGlvbi5wcm9qZWN0SWQnIDogT2JqZWN0SWQocHJvamVjdElkKX19XG4gICAgXTtcbiAgIHRoaXMudXNlclJlcG9zaXRvcnkuYWdncmVnYXRlKHF1ZXJ5LCAoZXJyb3IscmVzdWx0KSA9PiB7XG4gICAgIGlmIChlcnJvcikge1xuICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgfSBlbHNlIHtcbiAgICAgICBsZXQgc3Vic2NyaXB0aW9uID0gcmVzdWx0WzBdLnN1YnNjcmlwdGlvbjtcbiAgICAgICB0aGlzLnVwZGF0ZVBhY2thZ2UodXNlciwgc3Vic2NyaXB0aW9uLCBwYWNrYWdlTmFtZSxjb3N0Rm9yQnVpbGRpbmdQdXJjaGFzZWQsbnVtYmVyT2ZCdWlsZGluZ3NQdXJjaGFzZWQscHJvamVjdElkLChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgbGV0IGVycm9yID0gbmV3IEVycm9yKCk7XG4gICAgICAgICAgIGVycm9yLm1lc3NhZ2UgPSBtZXNzYWdlcy5NU0dfRVJST1JfV0hJTEVfQ09OVEFDVElORztcbiAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgaWYocGFja2FnZU5hbWUgPT09IGNvbnN0YW50cy5SRU5FV19QUk9KRUNUKSB7XG4gICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge2RhdGE6IG1lc3NhZ2VzLk1TR19TVUNDRVNTX1BST0pFQ1RfUkVORVd9KTtcbiAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogJ3N1Y2Nlc3MnfSk7XG4gICAgICAgICAgIH1cbiAgICAgICAgIH1cbiAgICAgICB9KTtcbiAgICAgfVxuICAgfSk7XG4gIH1cblxuICB1cGRhdGVQYWNrYWdlKHVzZXI6IFVzZXIsIHN1YnNjcmlwdGlvbjogYW55LCBwYWNrYWdlTmFtZTogc3RyaW5nLGNvc3RGb3JCdWlsZGluZ1B1cmNoYXNlZDphbnksbnVtYmVyT2ZCdWlsZGluZ3NQdXJjaGFzZWQ6YW55LCBwcm9qZWN0SWQ6c3RyaW5nLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xuICAgIGxldCBzdWJTY3JpcHRpb25TZXJ2aWNlID0gbmV3IFN1YnNjcmlwdGlvblNlcnZpY2UoKTtcbiAgICBzd2l0Y2ggKHBhY2thZ2VOYW1lKSB7XG4gICAgICBjYXNlICdQcmVtaXVtJzpcbiAgICAgIHtcbiAgICAgICAgc3ViU2NyaXB0aW9uU2VydmljZS5nZXRTdWJzY3JpcHRpb25QYWNrYWdlQnlOYW1lKCdQcmVtaXVtJywnQmFzZVBhY2thZ2UnLFxuICAgICAgICAgIChlcnJvcjogYW55LCBzdWJzY3JpcHRpb25QYWNrYWdlOiBBcnJheTxTdWJzY3JpcHRpb25QYWNrYWdlPikgPT4ge1xuICAgICAgICAgICAgaWYoZXJyb3IpIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsbnVsbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gc3Vic2NyaXB0aW9uUGFja2FnZVswXTtcbiAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLm51bU9mQnVpbGRpbmdzID0gcmVzdWx0LmJhc2VQYWNrYWdlLm51bU9mQnVpbGRpbmdzO1xuICAgICAgICAgICAgICBzdWJzY3JpcHRpb24ubnVtT2ZQcm9qZWN0cyA9IHJlc3VsdC5iYXNlUGFja2FnZS5udW1PZlByb2plY3RzO1xuICAgICAgICAgICAgICBsZXQgbm9PZkRheXNUb0V4cGlyeSA9IHRoaXMuY2FsY3VsYXRlVmFsaWRpdHkoc3Vic2NyaXB0aW9uKTtcbiAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLnZhbGlkaXR5ID0gbm9PZkRheXNUb0V4cGlyeSArIHJlc3VsdC5iYXNlUGFja2FnZS52YWxpZGl0eTtcbiAgICAgICAgICAgICAgcmVzdWx0LmJhc2VQYWNrYWdlLmNvc3QgPSBjb3N0Rm9yQnVpbGRpbmdQdXJjaGFzZWQ7XG4gICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi5wdXJjaGFzZWQucHVzaChyZXN1bHQuYmFzZVBhY2thZ2UpO1xuICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVN1YnNjcmlwdGlvblBhY2thZ2UodXNlci5faWQsIHByb2plY3RJZCxzdWJzY3JpcHRpb24sIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiAnc3VjY2Vzcyd9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY2FzZSAnUmVuZXdQcm9qZWN0JzpcbiAgICAgIHtcbiAgICAgICAgc3ViU2NyaXB0aW9uU2VydmljZS5nZXRTdWJzY3JpcHRpb25QYWNrYWdlQnlOYW1lKCdSZW5ld1Byb2plY3QnLCdhZGRPblBhY2thZ2UnLFxuICAgICAgICAgIChlcnJvcjogYW55LCBzdWJzY3JpcHRpb25QYWNrYWdlOiBBcnJheTxTdWJzY3JpcHRpb25QYWNrYWdlPikgPT4ge1xuICAgICAgICAgICAgaWYoZXJyb3IpIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsbnVsbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gc3Vic2NyaXB0aW9uUGFja2FnZVswXTtcbiAgICAgICAgICAgICAgbGV0IG5vT2ZEYXlzVG9FeHBpcnkgPSB0aGlzLmNhbGN1bGF0ZVZhbGlkaXR5KHN1YnNjcmlwdGlvbik7XG4gICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi52YWxpZGl0eSA9IG5vT2ZEYXlzVG9FeHBpcnkgKyByZXN1bHQuYWRkT25QYWNrYWdlLnZhbGlkaXR5O1xuICAgICAgICAgICAgICByZXN1bHQuYWRkT25QYWNrYWdlLmNvc3QgPSBjb3N0Rm9yQnVpbGRpbmdQdXJjaGFzZWQ7XG4gICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi5wdXJjaGFzZWQucHVzaChyZXN1bHQuYWRkT25QYWNrYWdlKTtcbiAgICAgICAgICAgICAgdGhpcy51cGRhdGVTdWJzY3JpcHRpb25QYWNrYWdlKHVzZXIuX2lkLHByb2plY3RJZCwgc3Vic2NyaXB0aW9uLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogJ1Byb2plY3QgUmVuZXdlZCBzdWNjZXNzZnVsbHknfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGNhc2UgJ0FkZF9idWlsZGluZyc6XG4gICAgICB7XG4gICAgICAgIHN1YlNjcmlwdGlvblNlcnZpY2UuZ2V0U3Vic2NyaXB0aW9uUGFja2FnZUJ5TmFtZSgnQWRkX2J1aWxkaW5nJywnYWRkT25QYWNrYWdlJyxcbiAgICAgICAgICAoZXJyb3I6IGFueSwgc3Vic2NyaXB0aW9uUGFja2FnZTogQXJyYXk8U3Vic2NyaXB0aW9uUGFja2FnZT4pID0+IHtcbiAgICAgICAgICAgIGlmKGVycm9yKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLG51bGwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgbGV0IHByb2plY3RCdWlsZGluZ3NMaW1pdCA9IHN1YnNjcmlwdGlvbi5udW1PZkJ1aWxkaW5ncyArIG51bWJlck9mQnVpbGRpbmdzUHVyY2hhc2VkO1xuICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gc3Vic2NyaXB0aW9uUGFja2FnZVswXTtcbiAgICAgICAgICAgICAgICByZXN1bHQuYWRkT25QYWNrYWdlLm51bU9mQnVpbGRpbmdzID0gbnVtYmVyT2ZCdWlsZGluZ3NQdXJjaGFzZWQ7XG4gICAgICAgICAgICAgICAgcmVzdWx0LmFkZE9uUGFja2FnZS5jb3N0ID0gY29zdEZvckJ1aWxkaW5nUHVyY2hhc2VkO1xuICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi5udW1PZkJ1aWxkaW5ncyA9IHN1YnNjcmlwdGlvbi5udW1PZkJ1aWxkaW5ncyArIHJlc3VsdC5hZGRPblBhY2thZ2UubnVtT2ZCdWlsZGluZ3M7XG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLnB1cmNoYXNlZC5wdXNoKHJlc3VsdC5hZGRPblBhY2thZ2UpO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU3Vic2NyaXB0aW9uUGFja2FnZSh1c2VyLl9pZCwgcHJvamVjdElkLHN1YnNjcmlwdGlvbiwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogJ3N1Y2Nlc3MnfSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlU3Vic2NyaXB0aW9uUGFja2FnZSggdXNlcklkOiBhbnksIHByb2plY3RJZDpzdHJpbmcsdXBkYXRlZFN1YnNjcmlwdGlvbjogYW55LCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpPT4gdm9pZCkge1xuICAgIGxldCBwcm9qZWN0aW9uID0ge3N1YnNjcmlwdGlvbjogMX07XG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kQnlJZFdpdGhQcm9qZWN0aW9uKHVzZXJJZCxwcm9qZWN0aW9uLChlcnJvcixyZXN1bHQpPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBzdWJTY3JpcHRpb25BcnJheSA9IHJlc3VsdC5zdWJzY3JpcHRpb247XG4gICAgICAgIGZvciAobGV0IHN1YnNjcmlwdGlvbkluZGV4ID0wOyBzdWJzY3JpcHRpb25JbmRleDwgc3ViU2NyaXB0aW9uQXJyYXkubGVuZ3RoOyBzdWJzY3JpcHRpb25JbmRleCsrKSB7XG4gICAgICAgICAgaWYgKHN1YlNjcmlwdGlvbkFycmF5W3N1YnNjcmlwdGlvbkluZGV4XS5wcm9qZWN0SWQubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICBpZiAoc3ViU2NyaXB0aW9uQXJyYXlbc3Vic2NyaXB0aW9uSW5kZXhdLnByb2plY3RJZFswXS5lcXVhbHMocHJvamVjdElkKSkge1xuICAgICAgICAgICAgICBzdWJTY3JpcHRpb25BcnJheVtzdWJzY3JpcHRpb25JbmRleF0gPSB1cGRhdGVkU3Vic2NyaXB0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgcXVlcnkgPSB7J19pZCc6IHVzZXJJZH07XG4gICAgICAgIGxldCBuZXdEYXRhID0geyRzZXQ6IHsnc3Vic2NyaXB0aW9uJzogc3ViU2NyaXB0aW9uQXJyYXl9fTtcbiAgICAgICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBuZXdEYXRhLCB7bmV3OiB0cnVlfSwgKGVyciwgcmVzcG9uc2UpID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTonc3VjY2Vzcyd9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgfVxuXG4gIGNhbGN1bGF0ZVZhbGlkaXR5KHN1YnNjcmlwdGlvbjogYW55KSB7XG4gICAgbGV0IGFjdGl2YXRpb25EYXRlID0gbmV3IERhdGUoc3Vic2NyaXB0aW9uLmFjdGl2YXRpb25EYXRlKTtcbiAgICBsZXQgZXhwaXJ5RGF0ZSA9IG5ldyBEYXRlKHN1YnNjcmlwdGlvbi5hY3RpdmF0aW9uRGF0ZSk7XG4gICAgbGV0IHByb2plY3RFeHBpcnlEYXRlID0gbmV3IERhdGUoZXhwaXJ5RGF0ZS5zZXREYXRlKGFjdGl2YXRpb25EYXRlLmdldERhdGUoKSArIHN1YnNjcmlwdGlvbi52YWxpZGl0eSkpO1xuICAgIGxldCBjdXJyZW50X2RhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIGxldCBkYXlzID0gdGhpcy5kYXlzZGlmZmVyZW5jZShwcm9qZWN0RXhwaXJ5RGF0ZSxjdXJyZW50X2RhdGUpO1xuICAgIHJldHVybiBkYXlzO1xuICB9XG5cbiAgc2VuZFByb2plY3RFeHBpcnlXYXJuaW5nTWFpbHMoY2FsbGJhY2s6KGVycm9yIDogYW55LCByZXN1bHQgOmFueSk9PnZvaWQpIHtcbiAgICBsb2dnZXIuZGVidWcoJ3NlbmRQcm9qZWN0RXhwaXJ5V2FybmluZ01haWxzIGlzIGJlZW4gaGl0Jyk7XG4gICAgbGV0IHF1ZXJ5ID0gW1xuICAgICAgeyAkcHJvamVjdCA6IHsgJ3N1YnNjcmlwdGlvbicgOiAxLCAnZmlyc3RfbmFtZScgOiAxLCAnZW1haWwnIDogMSB9fSxcbiAgICAgIHsgJHVud2luZCA6ICckc3Vic2NyaXB0aW9uJyB9LFxuICAgICAgeyAkdW53aW5kIDogJyRzdWJzY3JpcHRpb24ucHJvamVjdElkJyB9XG4gICAgXTtcblxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkuYWdncmVnYXRlKHF1ZXJ5LCAoZXJyb3IsIHJlc3BvbnNlKSA9PiB7XG4gICAgICBpZihlcnJvcikge1xuICAgICAgICBsb2dnZXIuZXJyb3IoJ3NlbmRQcm9qZWN0RXhwaXJ5V2FybmluZ01haWxzIGVycm9yIDogJytKU09OLnN0cmluZ2lmeShlcnJvcikpO1xuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2dnZXIuZGVidWcoJ3NlbmRQcm9qZWN0RXhwaXJ5V2FybmluZ01haWxzIHN1Y2VzcycpO1xuICAgICAgICBsZXQgdXNlckxpc3QgPSBuZXcgQXJyYXk8UHJvamVjdFN1YmNyaXB0aW9uPigpO1xuICAgICAgICBsZXQgdXNlclN1YnNjcmlwdGlvblByb21pc2VBcnJheSA9W107XG5cbiAgICAgICAgZm9yKGxldCB1c2VyIG9mIHJlc3BvbnNlKSB7XG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCdnZXRpbmcgYWxsIHVzZXIgZGF0YSBmb3Igc2VuZGluZyBtYWlsIHRvIHVzZXJzLicpO1xuICAgICAgICAgIGxldCB2YWxpZGl0eURheXMgPSB0aGlzLmNhbGN1bGF0ZVZhbGlkaXR5KHVzZXIuc3Vic2NyaXB0aW9uKTtcbiAgICAgICAgICBsZXQgdmFsZGl0eURheXNWYWxpZGF0aW9uID0gY29uZmlnLmdldCgnY3JvbkpvYk1haWxOb3RpZmljYXRpb25WYWxpZGl0eURheXMnKTtcbiAgICAgICAgICBsb2dnZXIuZGVidWcoJ3ZhbGlkaXR5RGF5cyA6ICcrdmFsaWRpdHlEYXlzKTtcbiAgICAgICAgICBpZih2YWxkaXR5RGF5c1ZhbGlkYXRpb24uaW5kZXhPZih2YWxpZGl0eURheXMpICE9PSAtMSkge1xuICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKCdjYWxsaW5nIHByb21pc2UnKTtcbiAgICAgICAgICAgIGxldCBwcm9taXNlT2JqZWN0ID0gdGhpcy5nZXRQcm9qZWN0RGF0YUJ5SWQodXNlcik7XG4gICAgICAgICAgICB1c2VyU3Vic2NyaXB0aW9uUHJvbWlzZUFycmF5LnB1c2gocHJvbWlzZU9iamVjdCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnaW52YWxpZCB2YWxpZGl0eURheXMgOiAnK3ZhbGlkaXR5RGF5cyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYodXNlclN1YnNjcmlwdGlvblByb21pc2VBcnJheS5sZW5ndGggIT09IDApIHtcblxuICAgICAgICAgIENDUHJvbWlzZS5hbGwodXNlclN1YnNjcmlwdGlvblByb21pc2VBcnJheSkudGhlbihmdW5jdGlvbihkYXRhOiBBcnJheTxhbnk+KSB7XG5cbiAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnZGF0YSByZWNpZXZlZCBmb3IgYWxsIHVzZXJzOiAnK0pTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgICAgIGxldCBzZW5kTWFpbFByb21pc2VBcnJheSA9IFtdO1xuXG4gICAgICAgICAgICBmb3IobGV0IHVzZXIgb2YgZGF0YSkge1xuICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoJ0NhbGxpbmcgc2VuZE1haWxGb3JQcm9qZWN0RXhwaXJ5VG9Vc2VyIGZvciB1c2VyIDogJytKU09OLnN0cmluZ2lmeSh1c2VyLmZpcnN0X25hbWUpKTtcbiAgICAgICAgICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XG4gICAgICAgICAgICAgIGxldCBzZW5kTWFpbFByb21pc2UgPSB1c2VyU2VydmljZS5zZW5kTWFpbEZvclByb2plY3RFeHBpcnlUb1VzZXIodXNlcik7XG4gICAgICAgICAgICAgIHNlbmRNYWlsUHJvbWlzZUFycmF5LnB1c2goc2VuZE1haWxQcm9taXNlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgQ0NQcm9taXNlLmFsbChzZW5kTWFpbFByb21pc2VBcnJheSkudGhlbihmdW5jdGlvbihtYWlsU2VudERhdGE6IEFycmF5PGFueT4pIHtcbiAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKCdtYWlsU2VudERhdGEgZm9yIGFsbCB1c2VyczogJytKU09OLnN0cmluZ2lmeShtYWlsU2VudERhdGEpKTtcbiAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgeyAnZGF0YScgOiAnTWFpbCBzZW50IHN1Y2Nlc3NmdWxseSB0byB1c2Vycy4nIH0pO1xuICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZTphbnkpIHtcbiAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdQcm9taXNlIGZhaWxlZCBmb3IgZ2V0dGluZyBtYWlsU2VudERhdGEgISA6JyArSlNPTi5zdHJpbmdpZnkoZS5tZXNzYWdlKSk7XG4gICAgICAgICAgICAgIENDUHJvbWlzZS5yZWplY3QoZS5tZXNzYWdlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZTphbnkpIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcignUHJvbWlzZSBmYWlsZWQgZm9yIHNlbmQgbWFpbCBub3RpZmljYXRpb24gISA6JyArSlNPTi5zdHJpbmdpZnkoZS5tZXNzYWdlKSk7XG4gICAgICAgICAgICBDQ1Byb21pc2UucmVqZWN0KGUubWVzc2FnZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9nZ2VyLmluZm8oJ05vIGFueSBwcm9qZWN0IGlzIGV4cGlyZWQuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldFByb2plY3REYXRhQnlJZCh1c2VyOiBhbnkpIHtcblxuICAgIHJldHVybiBuZXcgQ0NQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlOiBhbnksIHJlamVjdDogYW55KSB7XG5cbiAgICAgIGxvZ2dlci5kZWJ1ZygnZ2V0aW5nIGFsbCB1c2VyIGRhdGEgZm9yIHNlbmRpbmcgbWFpbCB0byB1c2Vycy4nKTtcblxuICAgICAgbGV0IHByb2plY3RTdWJzY3JpcHRpb24gPSBuZXcgUHJvamVjdFN1YmNyaXB0aW9uKCk7XG4gICAgICBsZXQgcHJvamVjdGlvbiA9IHsgJ25hbWUnIDogMSB9O1xuICAgICAgbGV0IHByb2plY3RSZXBvc2l0b3J5ID0gbmV3IFByb2plY3RSZXBvc2l0b3J5KCk7XG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcblxuICAgICAgcHJvamVjdFJlcG9zaXRvcnkuZmluZEJ5SWRXaXRoUHJvamVjdGlvbih1c2VyLnN1YnNjcmlwdGlvbi5wcm9qZWN0SWQsIHByb2plY3Rpb24sIChlcnJvciAsIHJlc3ApID0+IHtcbiAgICAgICAgaWYoZXJyb3IpIHtcbiAgICAgICAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIGluIGZldGNoaW5nIFVzZXIgZGF0YScrSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcbiAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnZ290IFByb2plY3RTdWJzY3JpcHRpb24gZm9yIHVzZXIgJysgdXNlci5faWQpO1xuICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24udXNlcklkID0gdXNlci5faWQ7XG4gICAgICAgICAgcHJvamVjdFN1YnNjcmlwdGlvbi51c2VyRW1haWwgPSB1c2VyLmVtYWlsO1xuICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24uZmlyc3RfbmFtZSA9IHVzZXIuZmlyc3RfbmFtZTtcbiAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLnZhbGlkaXR5RGF5cyA9IHVzZXIuc3Vic2NyaXB0aW9uLnZhbGlkaXR5O1xuICAgICAgICAgIHByb2plY3RTdWJzY3JpcHRpb24ucHJvamVjdEV4cGlyeURhdGUgPSB1c2VyU2VydmljZS5jYWxjdWxhdGVFeHBpcnlEYXRlKHVzZXIuc3Vic2NyaXB0aW9uKTtcbiAgICAgICAgICBwcm9qZWN0U3Vic2NyaXB0aW9uLnByb2plY3ROYW1lID0gcmVzcC5uYW1lO1xuICAgICAgICAgIHJlc29sdmUocHJvamVjdFN1YnNjcmlwdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24gKGU6IGFueSkge1xuICAgICAgbG9nZ2VyLmVycm9yKCdQcm9taXNlIGZhaWxlZCBmb3IgaW5kaXZpZHVhbCBjcmVhdGVQcm9taXNlRm9yR2V0UHJvamVjdEJ5SWQgISBFcnJvcjogJyArIEpTT04uc3RyaW5naWZ5KGUubWVzc2FnZSkpO1xuICAgICAgQ0NQcm9taXNlLnJlamVjdChlLm1lc3NhZ2UpO1xuICAgIH0pO1xuICB9XG5cbiAgc2VuZE1haWxGb3JQcm9qZWN0RXhwaXJ5VG9Vc2VyKHVzZXI6IGFueSkge1xuXG4gICAgcmV0dXJuIG5ldyBDQ1Byb21pc2UoZnVuY3Rpb24gKHJlc29sdmU6IGFueSwgcmVqZWN0OiBhbnkpIHtcblxuICAgICAgbGV0IG1haWxTZXJ2aWNlID0gbmV3IFNlbmRNYWlsU2VydmljZSgpO1xuXG4gICAgICBsZXQgYXV0aCA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcbiAgICAgIGxldCB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQodXNlcik7XG4gICAgICBsZXQgaG9zdCA9IGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpO1xuICAgICAgbGV0IGh0bWxUZW1wbGF0ZSA9ICdwcm9qZWN0LWV4cGlyeS1ub3RpZmljYXRpb24tbWFpbC5odG1sJztcblxuICAgICAgbGV0IGRhdGE6TWFwPHN0cmluZyxzdHJpbmc+PSBuZXcgTWFwKFtcbiAgICAgICAgWyckYXBwbGljYXRpb25MaW5rJCcsY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5ob3N0JyldLCBbJyRmaXJzdF9uYW1lJCcsdXNlci5maXJzdF9uYW1lXSxcbiAgICAgICAgWyckcHJvamVjdF9uYW1lJCcsdXNlci5wcm9qZWN0TmFtZV0sXG4gICAgICAgIFsnJGV4cGlyeV9kYXRlJCcsdXNlci5wcm9qZWN0RXhwaXJ5RGF0ZV0sIFsnJHN1YnNjcmlwdGlvbl9saW5rJCcsY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5ob3N0JykrICdzaWduaW4nXSxcbiAgICAgICAgWyckYXBwX25hbWUkJywnQnVpbGRJbmZvIC0gQ29zdCBDb250cm9sJ11dKTtcblxuICAgICAgbGV0IGF0dGFjaG1lbnQgPSBNYWlsQXR0YWNobWVudHMuQXR0YWNobWVudEFycmF5O1xuICAgICAgbWFpbFNlcnZpY2Uuc2VuZCggdXNlci51c2VyRW1haWwsIE1lc3NhZ2VzLlBST0pFQ1RfRVhQSVJZX1dBUk5JTkcsIGh0bWxUZW1wbGF0ZSwgZGF0YSxhdHRhY2htZW50LFxuICAgICAgICAoZXJyOiBhbnksIHJlc3VsdDogYW55KSA9PiB7XG4gICAgICAgICAgaWYoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIHNlbmQgbWFpbCB0byB1c2VyIDogJyt1c2VyLnVzZXJFbWFpbCk7XG4gICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ01haWwgc2VudCBzdWNjZXNzZnVsbHkgdG8gdXNlciA6ICcrdXNlci51c2VyRW1haWwpO1xuICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9KS5jYXRjaChmdW5jdGlvbiAoZTogYW55KSB7XG4gICAgICBsb2dnZXIuZXJyb3IoJ1Byb21pc2UgZmFpbGVkIGZvciBpbmRpdmlkdWFsIHNlbmRNYWlsRm9yUHJvamVjdEV4cGlyeVRvVXNlciAhIEVycm9yOiAnICsgSlNPTi5zdHJpbmdpZnkoZS5tZXNzYWdlKSk7XG4gICAgICBDQ1Byb21pc2UucmVqZWN0KGUubWVzc2FnZSk7XG4gICAgfSk7XG4gIH1cblxuICBjYWxjdWxhdGVFeHBpcnlEYXRlKHN1YnNjcmlwdGlvbiA6IGFueSkge1xuICAgIGxldCBhY3RpdmF0aW9uRGF0ZSA9IG5ldyBEYXRlKHN1YnNjcmlwdGlvbi5hY3RpdmF0aW9uRGF0ZSk7XG4gICAgbGV0IGV4cGlyeURhdGUgPSBuZXcgRGF0ZShzdWJzY3JpcHRpb24uYWN0aXZhdGlvbkRhdGUpO1xuICAgIGxldCBwcm9qZWN0RXhwaXJ5RGF0ZSA9IG5ldyBEYXRlKGV4cGlyeURhdGUuc2V0RGF0ZShhY3RpdmF0aW9uRGF0ZS5nZXREYXRlKCkgKyBzdWJzY3JpcHRpb24udmFsaWRpdHkpKTtcbiAgICBsZXQgcmVhZGFibGVkYXRlID0gcHJvamVjdEV4cGlyeURhdGUudG9EYXRlU3RyaW5nKCk7XG4gICAgcmV0dXJuIHJlYWRhYmxlZGF0ZTtcbiAgfVxufVxuXG5PYmplY3Quc2VhbChVc2VyU2VydmljZSk7XG5leHBvcnQgPSBVc2VyU2VydmljZTtcbiJdfQ==
