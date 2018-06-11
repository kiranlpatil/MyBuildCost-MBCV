"use strict";
var UserRepository = require("../dataaccess/repository/UserRepository");
var SendMailService = require("./mailer.service");
var SendMessageService = require("./sendmessage.service");
var fs = require("fs");
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
var UserService = (function () {
    function UserService() {
        this.userRepository = new UserRepository();
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
                        subScriptionService_1.getSubscriptionPackageByName('Free', function (err, freeSubscription) {
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
                    ['$first_name$', res[0].first_name], ['$link$', link], ['$app_name$', _this.APP_NAME]]);
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
    UserService.prototype.getProjects = function (user, callback) {
        var query = { _id: user._id };
        this.userRepository.findAndPopulate(query, { path: 'project', select: 'name' }, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                var authInterceptor = new AuthInterceptor();
                callback(null, { data: result[0].project, access_token: authInterceptor.issueTokenWithUid(user) });
            }
        });
    };
    return UserService;
}());
Object.seal(UserService);
module.exports = UserService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvVXNlclNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHdFQUEyRTtBQUMzRSxrREFBcUQ7QUFDckQsMERBQTZEO0FBQzdELHVCQUF5QjtBQUd6QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLDZDQUFnRDtBQUNoRCw4RUFBaUY7QUFDakYscURBQXdEO0FBQ3hELHVEQUEwRDtBQUUxRCwrQkFBa0M7QUFDbEMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDOUMsdUVBQW9FO0FBR3BFLDJGQUE4RjtBQUc5RixrSEFBcUg7QUFFckg7SUFPRTtRQUNFLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztRQUMzQyxJQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUM7SUFDeEMsQ0FBQztJQUVELGdDQUFVLEdBQVYsVUFBVyxJQUFTLEVBQUUsUUFBMkM7UUFBakUsaUJBa0RDO1FBakRDLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUMsRUFBRSxVQUFDLEdBQUcsRUFBRSxHQUFHO1lBQzNELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2pDLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixNQUFNLENBQUMsS0FB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RSxRQUF5QztRQUMvRCxJQUFJLEtBQUssR0FBRyxFQUFDLEdBQUcsRUFBRyxJQUFJLENBQUMsR0FBRyxFQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFDLEVBQUUsVUFBQyxLQUFLLEVBQUUsTUFBTTtZQUMxRixFQUFFLENBQUEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNULFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDeEIsQ0FBQztZQUFBLElBQUksQ0FBQyxDQUFDO2dCQUNMLElBQUksZUFBZSxHQUFHLElBQUksZUFBZSxFQUFFLENBQUM7Z0JBQzVDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsZUFBZSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQztZQUNuRyxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0gsa0JBQUM7QUFBRCxDQW5yQkEsQUFtckJDLElBQUE7QUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3pCLGlCQUFTLFdBQVcsQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL3NlcnZpY2VzL1VzZXJTZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFVzZXJSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L1VzZXJSZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBTZW5kTWFpbFNlcnZpY2UgPSByZXF1aXJlKCcuL21haWxlci5zZXJ2aWNlJyk7XHJcbmltcG9ydCBTZW5kTWVzc2FnZVNlcnZpY2UgPSByZXF1aXJlKCcuL3NlbmRtZXNzYWdlLnNlcnZpY2UnKTtcclxuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xyXG5pbXBvcnQgKiBhcyBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcbmltcG9ydCB7IFNlbnRNZXNzYWdlSW5mbyB9IGZyb20gJ25vZGVtYWlsZXInO1xyXG5sZXQgY29uZmlnID0gcmVxdWlyZSgnY29uZmlnJyk7XHJcbmxldCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xyXG5pbXBvcnQgTWVzc2FnZXMgPSByZXF1aXJlKCcuLi9zaGFyZWQvbWVzc2FnZXMnKTtcclxuaW1wb3J0IEF1dGhJbnRlcmNlcHRvciA9IHJlcXVpcmUoJy4uLy4uL2ZyYW1ld29yay9pbnRlcmNlcHRvci9hdXRoLmludGVyY2VwdG9yJyk7XHJcbmltcG9ydCBQcm9qZWN0QXNzZXQgPSByZXF1aXJlKCcuLi9zaGFyZWQvcHJvamVjdGFzc2V0Jyk7XHJcbmltcG9ydCBNYWlsQXR0YWNobWVudHMgPSByZXF1aXJlKCcuLi9zaGFyZWQvc2hhcmVkYXJyYXknKTtcclxuaW1wb3J0IHsgYXNFbGVtZW50RGF0YSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUvc3JjL3ZpZXcnO1xyXG5pbXBvcnQgYmNyeXB0ID0gcmVxdWlyZSgnYmNyeXB0Jyk7XHJcbmxldCBsb2c0anMgPSByZXF1aXJlKCdsb2c0anMnKTtcclxubGV0IGxvZ2dlciA9IGxvZzRqcy5nZXRMb2dnZXIoJ1VzZXIgc2VydmljZScpO1xyXG5pbXBvcnQgeyBNYWlsQ2hpbXBNYWlsZXJTZXJ2aWNlIH0gZnJvbSAnLi9tYWlsY2hpbXAtbWFpbGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgVXNlck1vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9Vc2VyTW9kZWwnKTtcclxuaW1wb3J0IFVzZXIgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vbmdvb3NlL3VzZXInKTtcclxuaW1wb3J0IFN1YnNjcmlwdGlvblNlcnZpY2UgPSByZXF1aXJlKCcuLi8uLi9hcHBsaWNhdGlvblByb2plY3Qvc2VydmljZXMvU3Vic2NyaXB0aW9uU2VydmljZScpO1xyXG5pbXBvcnQgU3Vic2NyaXB0aW9uUGFja2FnZSA9IHJlcXVpcmUoJy4uLy4uL2FwcGxpY2F0aW9uUHJvamVjdC9kYXRhYWNjZXNzL21vZGVsL3Byb2plY3QvU3Vic2NyaXB0aW9uL1N1YnNjcmlwdGlvblBhY2thZ2UnKTtcclxuaW1wb3J0IEJhc2VTdWJzY3JpcHRpb25QYWNrYWdlID0gcmVxdWlyZSgnLi4vLi4vYXBwbGljYXRpb25Qcm9qZWN0L2RhdGFhY2Nlc3MvbW9kZWwvcHJvamVjdC9TdWJzY3JpcHRpb24vQmFzZVN1YnNjcmlwdGlvblBhY2thZ2UnKTtcclxuaW1wb3J0IFVzZXJTdWJzY3JpcHRpb24gPSByZXF1aXJlKCcuLi8uLi9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L1N1YnNjcmlwdGlvbi9Vc2VyU3Vic2NyaXB0aW9uJyk7XHJcblxyXG5jbGFzcyBVc2VyU2VydmljZSB7XHJcbiAgQVBQX05BTUU6IHN0cmluZztcclxuICBjb21wYW55X25hbWU6IHN0cmluZztcclxuICBtaWRfY29udGVudDogYW55O1xyXG4gIHByaXZhdGUgdXNlclJlcG9zaXRvcnk6IFVzZXJSZXBvc2l0b3J5O1xyXG5cclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5ID0gbmV3IFVzZXJSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLkFQUF9OQU1FID0gUHJvamVjdEFzc2V0LkFQUF9OQU1FO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlVXNlcihpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkucmV0cmlldmUoeydlbWFpbCc6IGl0ZW0uZW1haWx9LCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihlcnIpLCBudWxsKTtcclxuICAgICAgfSBlbHNlIGlmIChyZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGxvZ2dlci5kZWJ1ZygnRW1haWwgYWxyZWFkeSBleGlzdCcrSlNPTi5zdHJpbmdpZnkocmVzKSk7XHJcblxyXG4gICAgICAgIGlmIChyZXNbMF0uaXNBY3RpdmF0ZWQgPT09IHRydWUpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfUkVHSVNUUkFUSU9OKSwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChyZXNbMF0uaXNBY3RpdmF0ZWQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1ZFUklGWV9BQ0NPVU5UKSwgbnVsbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsb2dnZXIuZGVidWcoJ0VtYWlsIG5vdCBwcmVzZW50LicrSlNPTi5zdHJpbmdpZnkocmVzKSk7XHJcbiAgICAgICAgY29uc3Qgc2FsdFJvdW5kcyA9IDEwO1xyXG4gICAgICAgIGJjcnlwdC5oYXNoKGl0ZW0ucGFzc3dvcmQsIHNhbHRSb3VuZHMsIChlcnI6IGFueSwgaGFzaDogYW55KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcignRXJyb3IgaW4gY3JlYXRpbmcgaGFzaCBwYXNzd29yZCcpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiAnRXJyb3IgaW4gY3JlYXRpbmcgaGFzaCB1c2luZyBiY3J5cHQnLFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICdFcnJvciBpbiBjcmVhdGluZyBoYXNoIHVzaW5nIGJjcnlwdCcsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICAgIH0sIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKCdjcmVhdGVkIGhhc2ggc3VjY2VzZnVsbHkuJyk7XHJcbiAgICAgICAgICAgIGl0ZW0ucGFzc3dvcmQgPSBoYXNoO1xyXG4gICAgICAgICAgICBsZXQgc3ViU2NyaXB0aW9uU2VydmljZSA9IG5ldyBTdWJzY3JpcHRpb25TZXJ2aWNlKCk7XHJcbiAgICAgICAgICAgIHN1YlNjcmlwdGlvblNlcnZpY2UuZ2V0U3Vic2NyaXB0aW9uUGFja2FnZUJ5TmFtZSgnRnJlZScsIChlcnI6IGFueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyZWVTdWJzY3JpcHRpb246IEFycmF5PFN1YnNjcmlwdGlvblBhY2thZ2U+KSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKGZyZWVTdWJzY3JpcHRpb24ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKCdmcmVlU3Vic2NyaXB0aW9uIGxlbmd0aCAgPiAwJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFzc2lnbkZyZWVTdWJzY3JpcHRpb25BbmRDcmVhdGVVc2VyKGl0ZW0sIGZyZWVTdWJzY3JpcHRpb25bMF0sIGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoJ2ZyZWVTdWJzY3JpcHRpb24gbGVuZ3RoICE9PTAnKTtcclxuICAgICAgICAgICAgICAgIHN1YlNjcmlwdGlvblNlcnZpY2UuYWRkU3Vic2NyaXB0aW9uUGFja2FnZShjb25maWcuZ2V0KCdzdWJzY3JpcHRpb24ucGFja2FnZS5GcmVlJyksXHJcbiAgICAgICAgICAgICAgICAgIChlcnI6IGFueSwgZnJlZVN1YnNjcmlwdGlvbik9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKCdhc3NpZ25pbmcgZnJlZSBzdWJzY3JpcHRpb24gYnkgY3JlYXRpbmcgbmV3IHVzZXInKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFzc2lnbkZyZWVTdWJzY3JpcHRpb25BbmRDcmVhdGVVc2VyKGl0ZW0sIGZyZWVTdWJzY3JpcHRpb24sIGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgIGFzc2lnbkZyZWVTdWJzY3JpcHRpb25BbmRDcmVhdGVVc2VyKGl0ZW06IGFueSwgZnJlZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uUGFja2FnZSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IHVzZXI6IFVzZXJNb2RlbCA9IGl0ZW07XHJcbiAgICBsZXQgc2VuZE1haWxTZXJ2aWNlID0gbmV3IFNlbmRNYWlsU2VydmljZSgpO1xyXG4gICAgdGhpcy5hc3NpZ25GcmVlU3Vic2NyaXB0aW9uUGFja2FnZSh1c2VyLCBmcmVlU3Vic2NyaXB0aW9uKTtcclxuICAgIGxvZ2dlci5kZWJ1ZygnQ3JlYXRpbmcgdXNlciB3aXRoIG5ldyBmcmVlIHRyYWlsIHN1YnNjcmlwdGlvbiBwYWNrYWdlJyk7XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmNyZWF0ZSh1c2VyLCAoZXJyOkVycm9yLCByZXM6YW55KSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBsb2dnZXIuZXJyb3IoJ0ZhaWxlZCB0byBDcmVhdGluZyB1c2VyIHN1YnNjcmlwdGlvbiBwYWNrYWdlJyk7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT05fTU9CSUxFX05VTUJFUiksIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxvZ2dlci5kZWJ1ZygnY3JlYXRlZCB1c2VyIHN1Y2Nlc2Z1bGx5LicrSlNPTi5zdHJpbmdpZnkocmVzKSk7XHJcbiAgICAgICAgbGV0IGF1dGggPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICAgICAgbGV0IHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZChyZXMpO1xyXG4gICAgICAgIGxldCBob3N0ID0gY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5ob3N0Jyk7XHJcbiAgICAgICAgbGV0IGxpbmsgPSBob3N0ICsgJ3NpZ25pbj9hY2Nlc3NfdG9rZW49JyArIHRva2VuICsgJyZfaWQ9JyArIHJlcy5faWQ7XHJcbiAgICAgICAgbGV0IGh0bWxUZW1wbGF0ZSA9ICd3ZWxjb21lLWFib2FyZC5odG1sJztcclxuICAgICAgICBsZXQgZGF0YTpNYXA8c3RyaW5nLHN0cmluZz49IG5ldyBNYXAoW1snJGFwcGxpY2F0aW9uTGluayQnLGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpXSxcclxuICAgICAgICAgIFsnJGZpcnN0X25hbWUkJyxyZXMuZmlyc3RfbmFtZV0sWyckbGluayQnLGxpbmtdLFsnJGFwcF9uYW1lJCcsdGhpcy5BUFBfTkFNRV1dKTtcclxuICAgICAgICBsZXQgYXR0YWNobWVudCA9IE1haWxBdHRhY2htZW50cy5XZWxjb21lQWJvYXJkQXR0YWNobWVudEFycmF5O1xyXG4gICAgICAgIGxvZ2dlci5kZWJ1Zygnc2VuZGluZyBtYWlsIHRvIG5ldyB1c2VyLicrSlNPTi5zdHJpbmdpZnkoYXR0YWNobWVudCkpO1xyXG4gICAgICAgIHNlbmRNYWlsU2VydmljZS5zZW5kKCB1c2VyLmVtYWlsLCBNZXNzYWdlcy5FTUFJTF9TVUJKRUNUX0NBTkRJREFURV9SRUdJU1RSQVRJT04sIGh0bWxUZW1wbGF0ZSwgZGF0YSxhdHRhY2htZW50LFxyXG4gICAgICAgICAgKGVycjogYW55LCByZXN1bHQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnIsIHJlc3VsdCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFzc2lnbkZyZWVTdWJzY3JpcHRpb25QYWNrYWdlKHVzZXI6IFVzZXJNb2RlbCwgZnJlZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uUGFja2FnZSkge1xyXG4gICAgbGV0IHN1YnNjcmlwdGlvbiA9IG5ldyBVc2VyU3Vic2NyaXB0aW9uKCk7XHJcbiAgICBzdWJzY3JpcHRpb24uYWN0aXZhdGlvbkRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgc3Vic2NyaXB0aW9uLm51bU9mQnVpbGRpbmdzID0gZnJlZVN1YnNjcmlwdGlvbi5iYXNlUGFja2FnZS5udW1PZkJ1aWxkaW5ncztcclxuICAgIHN1YnNjcmlwdGlvbi5udW1PZlByb2plY3RzID0gZnJlZVN1YnNjcmlwdGlvbi5iYXNlUGFja2FnZS5udW1PZlByb2plY3RzO1xyXG4gICAgc3Vic2NyaXB0aW9uLnZhbGlkaXR5ID0gZnJlZVN1YnNjcmlwdGlvbi5iYXNlUGFja2FnZS52YWxpZGl0eTtcclxuICAgIHN1YnNjcmlwdGlvbi5wcm9qZWN0SWQgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG4gICAgc3Vic2NyaXB0aW9uLnB1cmNoYXNlZCA9IG5ldyBBcnJheTxCYXNlU3Vic2NyaXB0aW9uUGFja2FnZT4oKTtcclxuICAgIHN1YnNjcmlwdGlvbi5wdXJjaGFzZWQucHVzaChmcmVlU3Vic2NyaXB0aW9uLmJhc2VQYWNrYWdlKTtcclxuICAgIHVzZXIuc3Vic2NyaXB0aW9uID0gbmV3IEFycmF5PFVzZXJTdWJzY3JpcHRpb24+KCk7XHJcbiAgICB1c2VyLnN1YnNjcmlwdGlvbi5wdXNoKHN1YnNjcmlwdGlvbik7XHJcbiAgfVxyXG5cclxuICBsb2dpbihkYXRhOiBhbnksIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy5yZXRyaWV2ZSh7J2VtYWlsJzogZGF0YS5lbWFpbH0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIGlmIChyZXN1bHQubGVuZ3RoID4gMCAmJiByZXN1bHRbMF0uaXNBY3RpdmF0ZWQgPT09IHRydWUpIHtcclxuICAgICAgICBiY3J5cHQuY29tcGFyZShkYXRhLnBhc3N3b3JkLCByZXN1bHRbMF0ucGFzc3dvcmQsIChlcnI6IGFueSwgaXNTYW1lOiBhbnkpID0+IHtcclxuICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX1JFR0lTVFJBVElPTl9TVEFUVVMsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1ZFUklGWV9DQU5ESURBVEVfQUNDT1VOVCxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBhY3R1YWxFcnJvcjogZXJyLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDUwMFxyXG4gICAgICAgICAgICB9LCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8qY29uc29sZS5sb2coJ2dvdCB1c2VyJyk7Ki9cclxuICAgICAgICAgICAgaWYgKGlzU2FtZSkge1xyXG4gICAgICAgICAgICAgIGxldCBhdXRoID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgICAgICAgICAgIGxldCB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQocmVzdWx0WzBdKTtcclxuICAgICAgICAgICAgICB2YXIgZGF0YTogYW55ID0ge1xyXG4gICAgICAgICAgICAgICAgJ3N0YXR1cyc6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgICAgICAgJ2RhdGEnOiB7XHJcbiAgICAgICAgICAgICAgICAgICdmaXJzdF9uYW1lJzogcmVzdWx0WzBdLmZpcnN0X25hbWUsXHJcbiAgICAgICAgICAgICAgICAgICdsYXN0X25hbWUnOiByZXN1bHRbMF0ubGFzdF9uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAnY29tcGFueV9uYW1lJzogcmVzdWx0WzBdLmNvbXBhbnlfbmFtZSxcclxuICAgICAgICAgICAgICAgICAgJ2VtYWlsJzogcmVzdWx0WzBdLmVtYWlsLFxyXG4gICAgICAgICAgICAgICAgICAnX2lkJzogcmVzdWx0WzBdLl9pZCxcclxuICAgICAgICAgICAgICAgICAgJ2N1cnJlbnRfdGhlbWUnOiByZXN1bHRbMF0uY3VycmVudF90aGVtZSxcclxuICAgICAgICAgICAgICAgICAgJ3BpY3R1cmUnOiByZXN1bHRbMF0ucGljdHVyZSxcclxuICAgICAgICAgICAgICAgICAgJ21vYmlsZV9udW1iZXInOiByZXN1bHRbMF0ubW9iaWxlX251bWJlcixcclxuICAgICAgICAgICAgICAgICAgJ2FjY2Vzc190b2tlbic6IHRva2VuXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblxyXG4gICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgZGF0YSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2soe1xyXG4gICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfUEFTU1dPUkQsXHJcbiAgICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICAgIH0sIG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDAgJiYgcmVzdWx0WzBdLmlzQWN0aXZhdGVkID09PSBmYWxzZSkge1xyXG4gICAgICAgIGNhbGxiYWNrKHtcclxuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX1JFR0lTVFJBVElPTl9TVEFUVVMsXHJcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0NBTkRJREFURV9BQ0NPVU5ULFxyXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICBjb2RlOiA1MDBcclxuICAgICAgICB9LCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayh7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fVVNFUl9OT1RfRk9VTkQsXHJcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVVNFUl9OT1RfUFJFU0VOVCxcclxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgfSxudWxsKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZW5kT3RwKHBhcmFtczogYW55LCB1c2VyOiBhbnksIGNhbGxiYWNrOihlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IERhdGEgPSB7XHJcbiAgICAgIG5ld19tb2JpbGVfbnVtYmVyOiBwYXJhbXMubW9iaWxlX251bWJlcixcclxuICAgICAgb2xkX21vYmlsZV9udW1iZXI6IHVzZXIubW9iaWxlX251bWJlcixcclxuICAgICAgX2lkOiB1c2VyLl9pZFxyXG4gICAgfTtcclxuICAgIHRoaXMuZ2VuZXJhdGVPdHAoRGF0YSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgaWYgKGVycm9yID09PSBNZXNzYWdlcy5NU0dfRVJST1JfQ0hFQ0tfTU9CSUxFX1BSRVNFTlQpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0VYSVNUSU5HX1VTRVIsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT05fTU9CSUxFX05VTUJFUixcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICBjYWxsYmFjayh7XHJcbiAgICAgICAgICAnc3RhdHVzJzogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgICAnZGF0YSc6IHtcclxuICAgICAgICAgICAgJ21lc3NhZ2UnOiBNZXNzYWdlcy5NU0dfU1VDQ0VTU19PVFBcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayh7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fVVNFUl9OT1RfRk9VTkQsXHJcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX1VTRVJfTk9UX0ZPVU5ELFxyXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICB9LCBudWxsKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZW5lcmF0ZU90cChmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnJldHJpZXZlKHsnbW9iaWxlX251bWJlcic6IGZpZWxkLm5ld19tb2JpbGVfbnVtYmVyLCAnaXNBY3RpdmF0ZWQnOiB0cnVlfSwgKGVyciwgcmVzKSA9PiB7XHJcblxyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgIH0gZWxzZSBpZiAocmVzLmxlbmd0aCA+IDAgJiYgKHJlc1swXS5faWQpICE9PSBmaWVsZC5faWQpIHtcclxuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTl9NT0JJTEVfTlVNQkVSKSwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSBpZiAocmVzLmxlbmd0aCA9PT0gMCkge1xyXG5cclxuICAgICAgICBsZXQgcXVlcnkgPSB7J19pZCc6IGZpZWxkLl9pZH07XHJcbiAgICAgICAgbGV0IG90cCA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiA5OTk5OSkgKyAxMDAwMDApO1xyXG4gICAgICAgIGxldCB1cGRhdGVEYXRhID0geydtb2JpbGVfbnVtYmVyJzogZmllbGQubmV3X21vYmlsZV9udW1iZXIsICdvdHAnOiBvdHB9O1xyXG4gICAgICAgIHRoaXMudXNlclJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT05fTU9CSUxFX05VTUJFUiksIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IERhdGEgPSB7XHJcbiAgICAgICAgICAgICAgbW9iaWxlTm86IGZpZWxkLm5ld19tb2JpbGVfbnVtYmVyLFxyXG4gICAgICAgICAgICAgIG90cDogb3RwXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGxldCBzZW5kTWVzc2FnZVNlcnZpY2UgPSBuZXcgU2VuZE1lc3NhZ2VTZXJ2aWNlKCk7XHJcbiAgICAgICAgICAgIHNlbmRNZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZURpcmVjdChEYXRhLCBjYWxsYmFjayk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT05fTU9CSUxFX05VTUJFUiksIG51bGwpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHZlcmlmeU90cChwYXJhbXM6IGFueSwgdXNlcjphbnksIGNhbGxiYWNrOihlcnJvcjphbnksIHJlc3VsdDphbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCBtYWlsQ2hpbXBNYWlsZXJTZXJ2aWNlID0gbmV3IE1haWxDaGltcE1haWxlclNlcnZpY2UoKTtcclxuXHJcbiAgICBsZXQgcXVlcnkgPSB7J19pZCc6IHVzZXIuX2lkLCAnaXNBY3RpdmF0ZWQnOiBmYWxzZX07XHJcbiAgICBsZXQgdXBkYXRlRGF0YSA9IHsnaXNBY3RpdmF0ZWQnOiB0cnVlLCAnYWN0aXZhdGlvbl9kYXRlJzogbmV3IERhdGUoKX07XHJcbiAgICBpZiAodXNlci5vdHAgPT09IHBhcmFtcy5vdHApIHtcclxuICAgICAgdGhpcy5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY2FsbGJhY2sobnVsbCx7XHJcbiAgICAgICAgICAgICdzdGF0dXMnOiAnU3VjY2VzcycsXHJcbiAgICAgICAgICAgICdkYXRhJzogeydtZXNzYWdlJzogJ1VzZXIgQWNjb3VudCB2ZXJpZmllZCBzdWNjZXNzZnVsbHknfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBtYWlsQ2hpbXBNYWlsZXJTZXJ2aWNlLm9uQ2FuZGlkYXRlU2lnblN1Y2Nlc3MocmVzdWx0KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNhbGxiYWNrKHtcclxuICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfT1RQLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICB9LCBudWxsKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBjaGFuZ2VNb2JpbGVOdW1iZXIoZmllbGQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG5cclxuICAgIGxldCBxdWVyeSA9IHsnX2lkJzogZmllbGQuX2lkfTtcclxuICAgIGxldCBvdHAgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogOTk5OTkpICsgMTAwMDAwKTtcclxuICAgIGxldCB1cGRhdGVEYXRhID0geydvdHAnOiBvdHAsICd0ZW1wX21vYmlsZSc6IGZpZWxkLm5ld19tb2JpbGVfbnVtYmVyfTtcclxuXHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZURhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTiksIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBEYXRhID0ge1xyXG4gICAgICAgICAgY3VycmVudF9tb2JpbGVfbnVtYmVyOiBmaWVsZC5jdXJyZW50X21vYmlsZV9udW1iZXIsXHJcbiAgICAgICAgICBtb2JpbGVObzogZmllbGQubmV3X21vYmlsZV9udW1iZXIsXHJcbiAgICAgICAgICBvdHA6IG90cFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgbGV0IHNlbmRNZXNzYWdlU2VydmljZSA9IG5ldyBTZW5kTWVzc2FnZVNlcnZpY2UoKTtcclxuICAgICAgICBzZW5kTWVzc2FnZVNlcnZpY2Uuc2VuZENoYW5nZU1vYmlsZU1lc3NhZ2UoRGF0YSwgY2FsbGJhY2spO1xyXG5cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgZm9yZ290UGFzc3dvcmQoZmllbGQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IFNlbnRNZXNzYWdlSW5mbykgPT4gdm9pZCkge1xyXG5cclxuICAgIGxldCBzZW5kTWFpbFNlcnZpY2UgPSBuZXcgU2VuZE1haWxTZXJ2aWNlKCk7XHJcbiAgICBsZXQgcXVlcnkgPSB7J2VtYWlsJzogZmllbGQuZW1haWx9O1xyXG5cclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkucmV0cmlldmUocXVlcnksIChlcnIsIHJlcykgPT4ge1xyXG5cclxuICAgICAgaWYgKHJlcy5sZW5ndGggPiAwICYmIHJlc1swXS5pc0FjdGl2YXRlZCA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICBsZXQgYXV0aCA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgICAgICBsZXQgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc1swXSk7XHJcbiAgICAgICAgbGV0IGhvc3QgPSBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLmhvc3QnKTtcclxuICAgICAgICBsZXQgbGluayA9IGhvc3QgKyAncmVzZXQtcGFzc3dvcmQ/YWNjZXNzX3Rva2VuPScgKyB0b2tlbiArICcmX2lkPScgKyByZXNbMF0uX2lkO1xyXG4gICAgICAgIGxldCBodG1sVGVtcGxhdGUgPSAnZm9yZ290cGFzc3dvcmQuaHRtbCc7XHJcbiAgICAgICAgbGV0IGRhdGE6TWFwPHN0cmluZyxzdHJpbmc+PSBuZXcgTWFwKFtbJyRhcHBsaWNhdGlvbkxpbmskJyxjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLmhvc3QnKV0sXHJcbiAgICAgICAgICBbJyRmaXJzdF9uYW1lJCcscmVzWzBdLmZpcnN0X25hbWVdLFsnJGxpbmskJyxsaW5rXSxbJyRhcHBfbmFtZSQnLHRoaXMuQVBQX05BTUVdXSk7XHJcbiAgICAgICAgbGV0IGF0dGFjaG1lbnQ9TWFpbEF0dGFjaG1lbnRzLkZvcmdldFBhc3N3b3JkQXR0YWNobWVudEFycmF5O1xyXG4gICAgICAgIHNlbmRNYWlsU2VydmljZS5zZW5kKCBmaWVsZC5lbWFpbCwgTWVzc2FnZXMuRU1BSUxfU1VCSkVDVF9GT1JHT1RfUEFTU1dPUkQsIGh0bWxUZW1wbGF0ZSwgZGF0YSxhdHRhY2htZW50LFxyXG4oZXJyOiBhbnksIHJlc3VsdDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgcmVzdWx0KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2UgaWYgKHJlcy5sZW5ndGggPiAwICYmIHJlc1swXS5pc0FjdGl2YXRlZCA9PT0gZmFsc2UpIHtcclxuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX0FDQ09VTlRfU1RBVFVTKSwgcmVzKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1VTRVJfTk9UX0ZPVU5EKSwgcmVzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcblxyXG4gIFNlbmRDaGFuZ2VNYWlsVmVyaWZpY2F0aW9uKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBTZW50TWVzc2FnZUluZm8pID0+IHZvaWQpIHtcclxuICAgIGxldCBxdWVyeSA9IHsnZW1haWwnOiBmaWVsZC5jdXJyZW50X2VtYWlsLCAnaXNBY3RpdmF0ZWQnOiB0cnVlfTtcclxuICAgIGxldCB1cGRhdGVEYXRhID0geyRzZXQ6eyd0ZW1wX2VtYWlsJzogZmllbGQubmV3X2VtYWlsfX07XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZURhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9FTUFJTF9BQ1RJVkVfTk9XKSwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSBpZihyZXN1bHQgPT0gbnVsbCkge1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0FDQ09VTlQpLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgYXV0aCA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgICAgICBsZXQgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc3VsdCk7XHJcbiAgICAgICAgbGV0IGhvc3QgPSBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLmhvc3QnKTtcclxuICAgICAgICBsZXQgbGluayA9IGhvc3QgKyAnYWN0aXZhdGUtdXNlcj9hY2Nlc3NfdG9rZW49JyArIHRva2VuICsgJyZfaWQ9JyArIHJlc3VsdC5faWQrJ2lzRW1haWxWZXJpZmljYXRpb24nO1xyXG4gICAgICAgIGxldCBzZW5kTWFpbFNlcnZpY2UgPSBuZXcgU2VuZE1haWxTZXJ2aWNlKCk7XHJcbiAgICAgICAgbGV0IGRhdGE6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBuZXcgTWFwKFtbJyRhcHBsaWNhdGlvbkxpbmskJyxjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLmhvc3QnKV0sXHJcbiAgICAgICAgICBbJyRsaW5rJCcsIGxpbmtdXSk7XHJcbiAgICAgICAgbGV0IGF0dGFjaG1lbnQ9TWFpbEF0dGFjaG1lbnRzLkF0dGFjaG1lbnRBcnJheTtcclxuICAgICAgICBzZW5kTWFpbFNlcnZpY2Uuc2VuZChmaWVsZC5uZXdfZW1haWwsXHJcbiAgICAgICAgICBNZXNzYWdlcy5FTUFJTF9TVUJKRUNUX0NIQU5HRV9FTUFJTElELFxyXG4gICAgICAgICAgJ2NoYW5nZS5tYWlsLmh0bWwnLCBkYXRhLGF0dGFjaG1lbnQsIGNhbGxiYWNrKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbiAvKiBzZW5kVmVyaWZpY2F0aW9uTWFpbChmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogU2VudE1lc3NhZ2VJbmZvKSA9PiB2b2lkKSB7XHJcblxyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5yZXRyaWV2ZSh7J2VtYWlsJzogZmllbGQuZW1haWx9LCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgaWYgKHJlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LnJldHJpZXZlKHsndXNlcklkJzogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKHJlc1swXS5faWQpfSwgKGVyciwgcmVjcnVpdGVyKSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNvbXBhbnlfbmFtZSA9IHJlY3J1aXRlclswXS5jb21wYW55X25hbWU7XHJcbiAgICAgICAgICAgIGxldCBhdXRoID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgICAgICAgICBsZXQgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlY3J1aXRlclswXSk7XHJcbiAgICAgICAgICAgIGxldCBob3N0ID0gY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5ob3N0Jyk7XHJcbiAgICAgICAgICAgIGxldCBsaW5rID0gaG9zdCArICdjb21wYW55LWRldGFpbHM/YWNjZXNzX3Rva2VuPScgKyB0b2tlbiArICcmX2lkPScgKyByZXNbMF0uX2lkICsgJyZjb21wYW55TmFtZT0nICsgdGhpcy5jb21wYW55X25hbWU7XHJcbiAgICAgICAgICAgIGxldCBzZW5kTWFpbFNlcnZpY2UgPSBuZXcgU2VuZE1haWxTZXJ2aWNlKCk7XHJcbiAgICAgICAgICAgIGxldCBkYXRhOk1hcDxzdHJpbmcsc3RyaW5nPj0gbmV3IE1hcChbWyckam9ibW9zaXNMaW5rJCcsY29uZmlnLmdldCgnVHBsU2VlZC5tYWlsLmhvc3QnKV0sXHJcbiAgICAgICAgICAgICAgWyckbGluayQnLGxpbmtdXSk7XHJcbiAgICAgICAgICAgIHNlbmRNYWlsU2VydmljZS5zZW5kKGZpZWxkLmVtYWlsLFxyXG4gICAgICAgICAgICAgIE1lc3NhZ2VzLkVNQUlMX1NVQkpFQ1RfUkVHSVNUUkFUSU9OLFxyXG4gICAgICAgICAgICAgICdyZWNydWl0ZXIubWFpbC5odG1sJyxkYXRhLChlcnI6IGFueSwgcmVzdWx0OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICBpZihlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycixyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxldCByZWNydWl0ZXJTZXJ2aWNlID0gbmV3IFJlY3J1aXRlclNlcnZpY2UoKTtcclxuICAgICAgICAgICAgICAgIHJlY3J1aXRlclNlcnZpY2UubWFpbE9uUmVjcnVpdGVyU2lnbnVwVG9BZG1pbihyZXNbMF0sIHRoaXMuY29tcGFueV9uYW1lLCBjYWxsYmFjayk7XHJcblxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgIH0gfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9VU0VSX05PVF9GT1VORCksIHJlcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0qL1xyXG5cclxuLyogIHNlbmRSZWNydWl0ZXJWZXJpZmljYXRpb25NYWlsKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBTZW50TWVzc2FnZUluZm8pID0+IHZvaWQpIHtcclxuXHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnJldHJpZXZlKHsnZW1haWwnOiBmaWVsZC5lbWFpbH0sIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICBpZiAocmVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBsZXQgYXV0aCA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgICAgICBsZXQgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc1swXSk7XHJcbiAgICAgICAgbGV0IGhvc3QgPSBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuaG9zdCcpO1xyXG4gICAgICAgIGxldCBsaW5rID0gaG9zdCArICdhY3RpdmF0ZS11c2VyP2FjY2Vzc190b2tlbj0nICsgdG9rZW4gKyAnJl9pZD0nICsgcmVzWzBdLl9pZDtcclxuICAgICAgICBsZXQgc2VuZE1haWxTZXJ2aWNlID0gbmV3IFNlbmRNYWlsU2VydmljZSgpO1xyXG4gICAgICAgIGxldCBkYXRhOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcChbWyckam9ibW9zaXNMaW5rJCcsY29uZmlnLmdldCgnVHBsU2VlZC5tYWlsLmhvc3QnKV0sWyckbGluayQnLCBsaW5rXV0pO1xyXG4gICAgICAgIHNlbmRNYWlsU2VydmljZS5zZW5kKGZpZWxkLmVtYWlsLFxyXG4gICAgICAgICAgTWVzc2FnZXMuRU1BSUxfU1VCSkVDVF9SRUdJU1RSQVRJT04sXHJcbiAgICAgICAgICAncmVjcnVpdGVyLm1haWwuaHRtbCcsIGRhdGEsIGNhbGxiYWNrKTtcclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9VU0VSX05PVF9GT1VORCksIHJlcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0qL1xyXG5cclxuXHJcbiAgc2VuZE1haWwoZmllbGQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IFNlbnRNZXNzYWdlSW5mbykgPT4gdm9pZCkge1xyXG4gICAgbGV0IHNlbmRNYWlsU2VydmljZSA9IG5ldyBTZW5kTWFpbFNlcnZpY2UoKTtcclxuICAgIGxldCBkYXRhOk1hcDxzdHJpbmcsc3RyaW5nPj0gbmV3IE1hcChbWyckYXBwbGljYXRpb25MaW5rJCcsY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5ob3N0JyldLFxyXG4gICAgICBbJyRmaXJzdF9uYW1lJCcsZmllbGQuZmlyc3RfbmFtZV0sWyckZW1haWwkJyxmaWVsZC5lbWFpbF0sWyckbWVzc2FnZSQnLGZpZWxkLm1lc3NhZ2VdXSk7XHJcbiAgICBsZXQgYXR0YWNobWVudD1NYWlsQXR0YWNobWVudHMuQXR0YWNobWVudEFycmF5O1xyXG4gICAgc2VuZE1haWxTZXJ2aWNlLnNlbmQoY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5BRE1JTl9NQUlMJyksXHJcbiAgICAgIE1lc3NhZ2VzLkVNQUlMX1NVQkpFQ1RfVVNFUl9DT05UQUNURURfWU9VLFxyXG4gICAgICAnY29udGFjdHVzLm1haWwuaHRtbCcsZGF0YSxhdHRhY2htZW50LGNhbGxiYWNrKTtcclxuICB9XHJcblxyXG4gIHNlbmRNYWlsT25FcnJvcihlcnJvckluZm86IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IFNlbnRNZXNzYWdlSW5mbykgPT4gdm9pZCkge1xyXG4gICAgbGV0IGN1cnJlbnRfVGltZSA9IG5ldyBEYXRlKCkudG9Mb2NhbGVUaW1lU3RyaW5nKFtdLCB7aG91cjogJzItZGlnaXQnLCBtaW51dGU6ICcyLWRpZ2l0J30pO1xyXG4gICAgbGV0IGRhdGE6TWFwPHN0cmluZyxzdHJpbmc+O1xyXG4gICAgaWYoZXJyb3JJbmZvLnN0YWNrVHJhY2UpIHtcclxuICAgICAgIGRhdGE9IG5ldyBNYXAoW1snJGFwcGxpY2F0aW9uTGluayQnLGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpXSxcclxuICAgICAgICAgWyckdGltZSQnLGN1cnJlbnRfVGltZV0sWyckaG9zdCQnLGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpXSxcclxuICAgICAgICBbJyRyZWFzb24kJyxlcnJvckluZm8ucmVhc29uXSxbJyRjb2RlJCcsZXJyb3JJbmZvLmNvZGVdLFxyXG4gICAgICAgIFsnJG1lc3NhZ2UkJyxlcnJvckluZm8ubWVzc2FnZV0sWyckZXJyb3IkJyxlcnJvckluZm8uc3RhY2tUcmFjZS5zdGFja11dKTtcclxuXHJcbiAgICB9IGVsc2UgaWYoZXJyb3JJbmZvLnN0YWNrKSB7XHJcbiAgICAgIGRhdGE9IG5ldyBNYXAoW1snJGFwcGxpY2F0aW9uTGluayQnLGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpXSxcclxuICAgICAgICBbJyR0aW1lJCcsY3VycmVudF9UaW1lXSxbJyRob3N0JCcsY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5ob3N0JyldLFxyXG4gICAgICAgIFsnJHJlYXNvbiQnLGVycm9ySW5mby5yZWFzb25dLFsnJGNvZGUkJyxlcnJvckluZm8uY29kZV0sXHJcbiAgICAgICAgWyckbWVzc2FnZSQnLGVycm9ySW5mby5tZXNzYWdlXSxbJyRlcnJvciQnLGVycm9ySW5mby5zdGFja11dKTtcclxuICAgIH1cclxuICAgIGxldCBzZW5kTWFpbFNlcnZpY2UgPSBuZXcgU2VuZE1haWxTZXJ2aWNlKCk7XHJcbiAgICBsZXQgYXR0YWNobWVudCA9IE1haWxBdHRhY2htZW50cy5BdHRhY2htZW50QXJyYXk7XHJcbiAgICBzZW5kTWFpbFNlcnZpY2Uuc2VuZChjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLkFETUlOX01BSUwnKSxcclxuICAgICAgTWVzc2FnZXMuRU1BSUxfU1VCSkVDVF9TRVJWRVJfRVJST1IgKyAnIG9uICcgKyBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLmhvc3QnKSxcclxuICAgICAgJ2Vycm9yLm1haWwuaHRtbCcsZGF0YSxhdHRhY2htZW50LCBjYWxsYmFjayxjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLlRQTEdST1VQX01BSUwnKSk7XHJcbiAgfVxyXG5cclxuICBmaW5kQnlJZChpZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmZpbmRCeUlkKGlkLCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICByZXRyaWV2ZShmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnJldHJpZXZlKGZpZWxkLCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICByZXRyaWV2ZVdpdGhMaW1pdChmaWVsZDogYW55LCBpbmNsdWRlZCA6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IGxpbWl0ID0gY29uZmlnLmdldCgnYXBwbGljYXRpb24ubGltaXRGb3JRdWVyeScpO1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5yZXRyaWV2ZVdpdGhMaW1pdChmaWVsZCwgaW5jbHVkZWQsIGxpbWl0LCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICByZXRyaWV2ZVdpdGhMZWFuKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkucmV0cmlldmUoZmllbGQsIGNhbGxiYWNrKTtcclxuICB9XHJcblxyXG4gIHJldHJpZXZlQWxsKGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5yZXRyaWV2ZShpdGVtLCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfUkVHSVNUUkFUSU9OX01PQklMRV9OVU1CRVIpLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCByZXMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZShfaWQ6IGFueSwgaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcblxyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kQnlJZChfaWQsIChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHtcclxuXHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnIsIHJlcyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy51c2VyUmVwb3NpdG9yeS51cGRhdGUoX2lkLCBpdGVtLCBjYWxsYmFjayk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIGRlbGV0ZShfaWQ6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5kZWxldGUoX2lkLCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICBmaW5kT25lQW5kVXBkYXRlKHF1ZXJ5OiBhbnksIG5ld0RhdGE6IGFueSwgb3B0aW9uczogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIG5ld0RhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKTtcclxuICB9XHJcblxyXG4gIFVwbG9hZEltYWdlKHRlbXBQYXRoOiBhbnksIGZpbGVOYW1lOiBhbnksIGNiOiBhbnkpIHtcclxuICAgIGxldCB0YXJnZXRwYXRoID0gZmlsZU5hbWU7XHJcbiAgICBmcy5yZW5hbWUodGVtcFBhdGgsIHRhcmdldHBhdGgsIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgY2IobnVsbCwgdGVtcFBhdGgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBVcGxvYWREb2N1bWVudHModGVtcFBhdGg6IGFueSwgZmlsZU5hbWU6IGFueSwgY2I6IGFueSkge1xyXG4gICAgbGV0IHRhcmdldHBhdGggPSBmaWxlTmFtZTtcclxuICAgIGZzLnJlbmFtZSh0ZW1wUGF0aCwgdGFyZ2V0cGF0aCwgZnVuY3Rpb24gKGVycjogYW55KSB7XHJcbiAgICAgIGNiKG51bGwsIHRlbXBQYXRoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZmluZEFuZFVwZGF0ZU5vdGlmaWNhdGlvbihxdWVyeTogYW55LCBuZXdEYXRhOiBhbnksIG9wdGlvbnM6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBuZXdEYXRhLCBvcHRpb25zLCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICByZXRyaWV2ZUJ5U29ydGVkT3JkZXIocXVlcnk6IGFueSwgcHJvamVjdGlvbjphbnksIHNvcnRpbmdRdWVyeTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAvL3RoaXMudXNlclJlcG9zaXRvcnkucmV0cmlldmVCeVNvcnRlZE9yZGVyKHF1ZXJ5LCBwcm9qZWN0aW9uLCBzb3J0aW5nUXVlcnksIGNhbGxiYWNrKTtcclxuICB9XHJcblxyXG4gIHJlc2V0UGFzc3dvcmQoZGF0YTogYW55LCB1c2VyIDogYW55LCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+YW55KSB7XHJcbiAgICBjb25zdCBzYWx0Um91bmRzID0gMTA7XHJcbiAgICBiY3J5cHQuaGFzaChkYXRhLm5ld19wYXNzd29yZCwgc2FsdFJvdW5kcywgKGVycjogYW55LCBoYXNoOiBhbnkpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKHtcclxuICAgICAgICAgIHJlYXNvbjogJ0Vycm9yIGluIGNyZWF0aW5nIGhhc2ggdXNpbmcgYmNyeXB0JyxcclxuICAgICAgICAgIG1lc3NhZ2U6ICdFcnJvciBpbiBjcmVhdGluZyBoYXNoIHVzaW5nIGJjcnlwdCcsXHJcbiAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgIH0sIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCB1cGRhdGVEYXRhID0geydwYXNzd29yZCc6IGhhc2h9O1xyXG4gICAgICAgIGxldCBxdWVyeSA9IHsnX2lkJzogdXNlci5faWQsICdwYXNzd29yZCc6IHVzZXIucGFzc3dvcmR9O1xyXG4gICAgICAgIHRoaXMuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCx7XHJcbiAgICAgICAgICAgICAgJ3N0YXR1cyc6ICdTdWNjZXNzJyxcclxuICAgICAgICAgICAgICAnZGF0YSc6IHsnbWVzc2FnZSc6ICdQYXNzd29yZCBjaGFuZ2VkIHN1Y2Nlc3NmdWxseSd9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZURldGFpbHMoZGF0YTogIFVzZXJNb2RlbCwgdXNlcjogVXNlck1vZGVsLCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICBsZXQgcXVlcnkgPSB7J19pZCc6IHVzZXIuX2lkfTtcclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgZGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLHtcclxuICAgICAgICAgICdzdGF0dXMnOiAnU3VjY2VzcycsXHJcbiAgICAgICAgICAnZGF0YSc6IHsnbWVzc2FnZSc6ICdVc2VyIFByb2ZpbGUgVXBkYXRlZCBzdWNjZXNzZnVsbHknfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGdldFVzZXJCeUlkKHVzZXI6YW55LCBjYWxsYmFjazooZXJyb3I6YW55LCByZXN1bHQ6YW55KT0+dm9pZCkge1xyXG4gICAgbGV0IGF1dGg6IEF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuXHJcbiAgICBsZXQgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpO1xyXG4gICAgY2FsbGJhY2sobnVsbCx7XHJcbiAgICAgICdzdGF0dXMnOiAnc3VjY2VzcycsXHJcbiAgICAgICdkYXRhJzoge1xyXG4gICAgICAgICdmaXJzdF9uYW1lJzogdXNlci5maXJzdF9uYW1lLFxyXG4gICAgICAgICdsYXN0X25hbWUnOiB1c2VyLmxhc3RfbmFtZSxcclxuICAgICAgICAnZW1haWwnOiB1c2VyLmVtYWlsLFxyXG4gICAgICAgICdtb2JpbGVfbnVtYmVyJzogdXNlci5tb2JpbGVfbnVtYmVyLFxyXG4gICAgICAgICdjb21wYW55X25hbWUnOiB1c2VyLmNvbXBhbnlfbmFtZSxcclxuICAgICAgICAnc3RhdGUnOiB1c2VyLnN0YXRlLFxyXG4gICAgICAgICdjaXR5JzogdXNlci5jaXR5LFxyXG4gICAgICAgICdwaWN0dXJlJzogdXNlci5waWN0dXJlLFxyXG4gICAgICAgICdzb2NpYWxfcHJvZmlsZV9waWN0dXJlJzogdXNlci5zb2NpYWxfcHJvZmlsZV9waWN0dXJlLFxyXG4gICAgICAgICdfaWQnOiB1c2VyLl9pZCxcclxuICAgICAgICAnY3VycmVudF90aGVtZSc6IHVzZXIuY3VycmVudF90aGVtZVxyXG4gICAgICB9LFxyXG4gICAgICBhY2Nlc3NfdG9rZW46IHRva2VuXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHZlcmlmeUFjY291bnQodXNlcjpVc2VyLCBjYWxsYmFjazooZXJyb3I6YW55LCByZXN1bHQ6YW55KT0+dm9pZCkge1xyXG4gICAgbGV0IHF1ZXJ5ID0geydfaWQnOiB1c2VyLl9pZCwgJ2lzQWN0aXZhdGVkJzogZmFsc2V9O1xyXG4gICAgbGV0IHVwZGF0ZURhdGEgPSB7J2lzQWN0aXZhdGVkJzogdHJ1ZX07XHJcbiAgICB0aGlzLmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZURhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCx7XHJcbiAgICAgICAgICAnc3RhdHVzJzogJ1N1Y2Nlc3MnLFxyXG4gICAgICAgICAgJ2RhdGEnOiB7J21lc3NhZ2UnOiAnVXNlciBBY2NvdW50IHZlcmlmaWVkIHN1Y2Nlc3NmdWxseSd9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNoYW5nZUVtYWlsSWQoZGF0YTphbnksIHVzZXIgOiBVc2VyLCBjYWxsYmFjazooZXJyb3I6YW55LCByZXN1bHQ6YW55KT0+dm9pZCkge1xyXG4gICAgbGV0IGF1dGg6IEF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgIGxldCBxdWVyeSA9IHsnZW1haWwnOiBkYXRhLm5ld19lbWFpbH07XHJcblxyXG4gICAgdGhpcy5yZXRyaWV2ZShxdWVyeSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuXHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIGlmIChyZXN1bHQubGVuZ3RoID4gMCAmJiByZXN1bHRbMF0uaXNBY3RpdmF0ZWQgPT09IHRydWUpIHtcclxuICAgICAgICBjYWxsYmFjayh7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRVhJU1RJTkdfVVNFUixcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT04sXHJcbiAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgIH0sbnVsbCk7XHJcbiAgICAgIH0gZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDAgJiYgcmVzdWx0WzBdLmlzQWN0aXZhdGVkID09PSBmYWxzZSkge1xyXG4gICAgICAgIGNhbGxiYWNrKHtcclxuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxyXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0FDQ09VTlRfU1RBVFVTLFxyXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICB9LCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgdGhpcy5TZW5kQ2hhbmdlTWFpbFZlcmlmaWNhdGlvbihkYXRhLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvci5tZXNzYWdlID09PSBNZXNzYWdlcy5NU0dfRVJST1JfQ0hFQ0tfRU1BSUxfQUNDT1VOVCkge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKHtcclxuICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNQUlMX0FDVElWRV9OT1csXHJcbiAgICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICAgIH0sIG51bGwpO1xyXG4gICAgICAgICAgICB9aWYgKGVycm9yLm1lc3NhZ2UgPT09IE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQUNDT1VOVCkge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKHtcclxuICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1ZFUklGWV9BQ0NPVU5ULFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1ZFUklGWV9BQ0NPVU5ULFxyXG4gICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgICB9LCBudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBjYWxsYmFjayh7XHJcbiAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fV0hJTEVfQ09OVEFDVElORyxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XSElMRV9DT05UQUNUSU5HLFxyXG4gICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgICB9LCBudWxsKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtcclxuICAgICAgICAgICAgICAnc3RhdHVzJzogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgICAgICAgJ2RhdGEnOiB7J21lc3NhZ2UnOiBNZXNzYWdlcy5NU0dfU1VDQ0VTU19FTUFJTF9DSEFOR0VfRU1BSUxJRH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHZlcmlmeUNoYW5nZWRFbWFpbElkKHVzZXI6IGFueSwgY2FsbGJhY2s6KGVycm9yIDogYW55LCByZXN1bHQgOiBhbnkpPT4gYW55KSB7XHJcbiAgICBsZXQgcXVlcnkgPSB7J19pZCc6IHVzZXIuX2lkfTtcclxuICAgIGxldCB1cGRhdGVEYXRhID0geydlbWFpbCc6IHVzZXIudGVtcF9lbWFpbCwgJ3RlbXBfZW1haWwnOiB1c2VyLmVtYWlsfTtcclxuICAgIHRoaXMuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLHtcclxuICAgICAgICAgICdzdGF0dXMnOiAnU3VjY2VzcycsXHJcbiAgICAgICAgICAnZGF0YSc6IHsnbWVzc2FnZSc6ICdVc2VyIEFjY291bnQgdmVyaWZpZWQgc3VjY2Vzc2Z1bGx5J31cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdmVyaWZ5TW9iaWxlTnVtYmVyKGRhdGEgOmFueSAsIHVzZXIgOiBhbnksIGNhbGxiYWNrOihlcnJvcjphbnksIHJlc3VsdDphbnkpPT52b2lkKSB7XHJcbiAgICBsZXQgcXVlcnkgPSB7J19pZCc6IHVzZXIuX2lkfTtcclxuICAgIGxldCB1cGRhdGVEYXRhID0geydtb2JpbGVfbnVtYmVyJzogdXNlci50ZW1wX21vYmlsZSwgJ3RlbXBfbW9iaWxlJzogdXNlci5tb2JpbGVfbnVtYmVyfTtcclxuICAgIGlmICh1c2VyLm90cCA9PT0gZGF0YS5vdHApIHtcclxuICAgICAgdGhpcy5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY2FsbGJhY2sobnVsbCx7XHJcbiAgICAgICAgICAgICdzdGF0dXMnOiAnU3VjY2VzcycsXHJcbiAgICAgICAgICAgICdkYXRhJzogeydtZXNzYWdlJzogJ1VzZXIgQWNjb3VudCB2ZXJpZmllZCBzdWNjZXNzZnVsbHknfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNhbGxiYWNrKHtcclxuICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfT1RQLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICB9LCBudWxsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldFByb2plY3RzKHVzZXI6IFVzZXIsIGNhbGxiYWNrOihlcnJvciA6IGFueSwgcmVzdWx0IDphbnkpPT52b2lkKSB7XHJcbiAgICBsZXQgcXVlcnkgPSB7X2lkIDogdXNlci5faWR9O1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kQW5kUG9wdWxhdGUocXVlcnksIHtwYXRoOiAncHJvamVjdCcsIHNlbGVjdDogJ25hbWUnfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH1lbHNlIHtcclxuICAgICAgICBsZXQgYXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHtkYXRhOiByZXN1bHRbMF0ucHJvamVjdCwgYWNjZXNzX3Rva2VuOiBhdXRoSW50ZXJjZXB0b3IuaXNzdWVUb2tlbldpdGhVaWQodXNlcil9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5PYmplY3Quc2VhbChVc2VyU2VydmljZSk7XHJcbmV4cG9ydCA9IFVzZXJTZXJ2aWNlO1xyXG4iXX0=
