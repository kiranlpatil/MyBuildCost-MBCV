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
                logger.debug('created user succesfully.');
                callback(null, res);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvVXNlclNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHdFQUEyRTtBQUMzRSxrREFBcUQ7QUFDckQsMERBQTZEO0FBQzdELHVCQUF5QjtBQUd6QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLDZDQUFnRDtBQUNoRCw4RUFBaUY7QUFDakYscURBQXdEO0FBQ3hELHVEQUEwRDtBQUUxRCwrQkFBa0M7QUFDbEMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDOUMsdUVBQW9FO0FBR3BFLDJGQUE4RjtBQUc5RixrSEFBcUg7QUFFckg7SUFPRTtRQUNFLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztRQUMzQyxJQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUM7SUFDeEMsQ0FBQztJQUVELGdDQUFVLEdBQVYsVUFBVyxJQUFTLEVBQUUsUUFBMkM7UUFBakUsaUJBa0RDO1FBakRDLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUMsRUFBRSxVQUFDLEdBQUcsRUFBRSxHQUFHO1lBQzNELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2pDLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixNQUFNLENBQUMsS0FB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SSxFQUFFLEdBQUc7YUFDVixFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ1gsQ0FBQztJQUNILENBQUM7SUFFRCxpQ0FBVyxHQUFYLFVBQVksSUFBVSxFQUFFLFFBQXlDO1FBQy9ELElBQUksS0FBSyxHQUFHLEVBQUMsR0FBRyxFQUFHLElBQUksQ0FBQyxHQUFHLEVBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUMsRUFBRSxVQUFDLEtBQUssRUFBRSxNQUFNO1lBQzFGLEVBQUUsQ0FBQSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1QsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN4QixDQUFDO1lBQUEsSUFBSSxDQUFDLENBQUM7Z0JBQ0wsSUFBSSxlQUFlLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztnQkFDNUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxlQUFlLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDO1lBQ25HLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDSCxrQkFBQztBQUFELENBcHJCQSxBQW9yQkMsSUFBQTtBQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDekIsaUJBQVMsV0FBVyxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvc2VydmljZXMvVXNlclNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVXNlclJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvVXNlclJlcG9zaXRvcnknKTtcbmltcG9ydCBTZW5kTWFpbFNlcnZpY2UgPSByZXF1aXJlKCcuL21haWxlci5zZXJ2aWNlJyk7XG5pbXBvcnQgU2VuZE1lc3NhZ2VTZXJ2aWNlID0gcmVxdWlyZSgnLi9zZW5kbWVzc2FnZS5zZXJ2aWNlJyk7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XG5pbXBvcnQgeyBTZW50TWVzc2FnZUluZm8gfSBmcm9tICdub2RlbWFpbGVyJztcbmxldCBjb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcbmxldCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuaW1wb3J0IE1lc3NhZ2VzID0gcmVxdWlyZSgnLi4vc2hhcmVkL21lc3NhZ2VzJyk7XG5pbXBvcnQgQXV0aEludGVyY2VwdG9yID0gcmVxdWlyZSgnLi4vLi4vZnJhbWV3b3JrL2ludGVyY2VwdG9yL2F1dGguaW50ZXJjZXB0b3InKTtcbmltcG9ydCBQcm9qZWN0QXNzZXQgPSByZXF1aXJlKCcuLi9zaGFyZWQvcHJvamVjdGFzc2V0Jyk7XG5pbXBvcnQgTWFpbEF0dGFjaG1lbnRzID0gcmVxdWlyZSgnLi4vc2hhcmVkL3NoYXJlZGFycmF5Jyk7XG5pbXBvcnQgeyBhc0VsZW1lbnREYXRhIH0gZnJvbSAnQGFuZ3VsYXIvY29yZS9zcmMvdmlldyc7XG5pbXBvcnQgYmNyeXB0ID0gcmVxdWlyZSgnYmNyeXB0Jyk7XG5sZXQgbG9nNGpzID0gcmVxdWlyZSgnbG9nNGpzJyk7XG5sZXQgbG9nZ2VyID0gbG9nNGpzLmdldExvZ2dlcignVXNlciBzZXJ2aWNlJyk7XG5pbXBvcnQgeyBNYWlsQ2hpbXBNYWlsZXJTZXJ2aWNlIH0gZnJvbSAnLi9tYWlsY2hpbXAtbWFpbGVyLnNlcnZpY2UnO1xuaW1wb3J0IFVzZXJNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvVXNlck1vZGVsJyk7XG5pbXBvcnQgVXNlciA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9uZ29vc2UvdXNlcicpO1xuaW1wb3J0IFN1YnNjcmlwdGlvblNlcnZpY2UgPSByZXF1aXJlKCcuLi8uLi9hcHBsaWNhdGlvblByb2plY3Qvc2VydmljZXMvU3Vic2NyaXB0aW9uU2VydmljZScpO1xuaW1wb3J0IFN1YnNjcmlwdGlvblBhY2thZ2UgPSByZXF1aXJlKCcuLi8uLi9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L1N1YnNjcmlwdGlvbi9TdWJzY3JpcHRpb25QYWNrYWdlJyk7XG5pbXBvcnQgQmFzZVN1YnNjcmlwdGlvblBhY2thZ2UgPSByZXF1aXJlKCcuLi8uLi9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L1N1YnNjcmlwdGlvbi9CYXNlU3Vic2NyaXB0aW9uUGFja2FnZScpO1xuaW1wb3J0IFVzZXJTdWJzY3JpcHRpb24gPSByZXF1aXJlKCcuLi8uLi9hcHBsaWNhdGlvblByb2plY3QvZGF0YWFjY2Vzcy9tb2RlbC9wcm9qZWN0L1N1YnNjcmlwdGlvbi9Vc2VyU3Vic2NyaXB0aW9uJyk7XG5cbmNsYXNzIFVzZXJTZXJ2aWNlIHtcbiAgQVBQX05BTUU6IHN0cmluZztcbiAgY29tcGFueV9uYW1lOiBzdHJpbmc7XG4gIG1pZF9jb250ZW50OiBhbnk7XG4gIHByaXZhdGUgdXNlclJlcG9zaXRvcnk6IFVzZXJSZXBvc2l0b3J5O1xuXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeSA9IG5ldyBVc2VyUmVwb3NpdG9yeSgpO1xuICAgIHRoaXMuQVBQX05BTUUgPSBQcm9qZWN0QXNzZXQuQVBQX05BTUU7XG4gIH1cblxuICBjcmVhdGVVc2VyKGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIHRoaXMudXNlclJlcG9zaXRvcnkucmV0cmlldmUoeydlbWFpbCc6IGl0ZW0uZW1haWx9LCAoZXJyLCByZXMpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKGVyciksIG51bGwpO1xuICAgICAgfSBlbHNlIGlmIChyZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBsb2dnZXIuZGVidWcoJ0VtYWlsIGFscmVhZHkgZXhpc3QnK0pTT04uc3RyaW5naWZ5KHJlcykpO1xuXG4gICAgICAgIGlmIChyZXNbMF0uaXNBY3RpdmF0ZWQgPT09IHRydWUpIHtcbiAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTiksIG51bGwpO1xuICAgICAgICB9IGVsc2UgaWYgKHJlc1swXS5pc0FjdGl2YXRlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1ZFUklGWV9BQ0NPVU5UKSwgbnVsbCk7XG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9nZ2VyLmRlYnVnKCdFbWFpbCBub3QgcHJlc2VudC4nK0pTT04uc3RyaW5naWZ5KHJlcykpO1xuICAgICAgICBjb25zdCBzYWx0Um91bmRzID0gMTA7XG4gICAgICAgIGJjcnlwdC5oYXNoKGl0ZW0ucGFzc3dvcmQsIHNhbHRSb3VuZHMsIChlcnI6IGFueSwgaGFzaDogYW55KSA9PiB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdFcnJvciBpbiBjcmVhdGluZyBoYXNoIHBhc3N3b3JkJyk7XG4gICAgICAgICAgICBjYWxsYmFjayh7XG4gICAgICAgICAgICAgIHJlYXNvbjogJ0Vycm9yIGluIGNyZWF0aW5nIGhhc2ggdXNpbmcgYmNyeXB0JyxcbiAgICAgICAgICAgICAgbWVzc2FnZTogJ0Vycm9yIGluIGNyZWF0aW5nIGhhc2ggdXNpbmcgYmNyeXB0JyxcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgICAgIGNvZGU6IDQwM1xuICAgICAgICAgICAgfSwgbnVsbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnY3JlYXRlZCBoYXNoIHN1Y2Nlc2Z1bGx5LicpO1xuICAgICAgICAgICAgaXRlbS5wYXNzd29yZCA9IGhhc2g7XG4gICAgICAgICAgICBsZXQgc3ViU2NyaXB0aW9uU2VydmljZSA9IG5ldyBTdWJzY3JpcHRpb25TZXJ2aWNlKCk7XG4gICAgICAgICAgICBzdWJTY3JpcHRpb25TZXJ2aWNlLmdldFN1YnNjcmlwdGlvblBhY2thZ2VCeU5hbWUoJ0ZyZWUnLCAoZXJyOiBhbnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJlZVN1YnNjcmlwdGlvbjogQXJyYXk8U3Vic2NyaXB0aW9uUGFja2FnZT4pID0+IHtcbiAgICAgICAgICAgICAgaWYgKGZyZWVTdWJzY3JpcHRpb24ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnZnJlZVN1YnNjcmlwdGlvbiBsZW5ndGggID4gMCcpO1xuICAgICAgICAgICAgICAgIHRoaXMuYXNzaWduRnJlZVN1YnNjcmlwdGlvbkFuZENyZWF0ZVVzZXIoaXRlbSwgZnJlZVN1YnNjcmlwdGlvblswXSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKCdmcmVlU3Vic2NyaXB0aW9uIGxlbmd0aCAhPT0wJyk7XG4gICAgICAgICAgICAgICAgc3ViU2NyaXB0aW9uU2VydmljZS5hZGRTdWJzY3JpcHRpb25QYWNrYWdlKGNvbmZpZy5nZXQoJ3N1YnNjcmlwdGlvbi5wYWNrYWdlLkZyZWUnKSxcbiAgICAgICAgICAgICAgICAgIChlcnI6IGFueSwgZnJlZVN1YnNjcmlwdGlvbik9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnYXNzaWduaW5nIGZyZWUgc3Vic2NyaXB0aW9uIGJ5IGNyZWF0aW5nIG5ldyB1c2VyJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXNzaWduRnJlZVN1YnNjcmlwdGlvbkFuZENyZWF0ZVVzZXIoaXRlbSwgZnJlZVN1YnNjcmlwdGlvbiwgY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgIH0pO1xuICB9XG5cbiAgIGFzc2lnbkZyZWVTdWJzY3JpcHRpb25BbmRDcmVhdGVVc2VyKGl0ZW06IGFueSwgZnJlZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uUGFja2FnZSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIGxldCB1c2VyOiBVc2VyTW9kZWwgPSBpdGVtO1xuICAgIGxldCBzZW5kTWFpbFNlcnZpY2UgPSBuZXcgU2VuZE1haWxTZXJ2aWNlKCk7XG4gICAgdGhpcy5hc3NpZ25GcmVlU3Vic2NyaXB0aW9uUGFja2FnZSh1c2VyLCBmcmVlU3Vic2NyaXB0aW9uKTtcbiAgICBsb2dnZXIuZGVidWcoJ0NyZWF0aW5nIHVzZXIgd2l0aCBuZXcgZnJlZSB0cmFpbCBzdWJzY3JpcHRpb24gcGFja2FnZScpO1xuICAgIHRoaXMudXNlclJlcG9zaXRvcnkuY3JlYXRlKHVzZXIsIChlcnI6RXJyb3IsIHJlczphbnkpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgbG9nZ2VyLmVycm9yKCdGYWlsZWQgdG8gQ3JlYXRpbmcgdXNlciBzdWJzY3JpcHRpb24gcGFja2FnZScpO1xuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTl9NT0JJTEVfTlVNQkVSKSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2dnZXIuZGVidWcoJ2NyZWF0ZWQgdXNlciBzdWNjZXNmdWxseS4nKTtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcbiAgICAgIH1cbiAgICAgICAgLypsZXQgYXV0aCA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcbiAgICAgICAgbGV0IHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZChyZXMpO1xuICAgICAgICBsZXQgaG9zdCA9IGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpO1xuICAgICAgICBsZXQgbGluayA9IGhvc3QgKyAnc2lnbmluP2FjY2Vzc190b2tlbj0nICsgdG9rZW4gKyAnJl9pZD0nICsgcmVzLl9pZDtcbiAgICAgICAgbGV0IGh0bWxUZW1wbGF0ZSA9ICd3ZWxjb21lLWFib2FyZC5odG1sJztcbiAgICAgICAgbGV0IGRhdGE6TWFwPHN0cmluZyxzdHJpbmc+PSBuZXcgTWFwKFtbJyRhcHBsaWNhdGlvbkxpbmskJyxjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLmhvc3QnKV0sXG4gICAgICAgICAgWyckZmlyc3RfbmFtZSQnLHJlcy5maXJzdF9uYW1lXSxbJyRsaW5rJCcsbGlua10sWyckYXBwX25hbWUkJyx0aGlzLkFQUF9OQU1FXV0pO1xuICAgICAgICBsZXQgYXR0YWNobWVudD1NYWlsQXR0YWNobWVudHMuV2VsY29tZUFib2FyZEF0dGFjaG1lbnRBcnJheTtcbiAgICAgICAgc2VuZE1haWxTZXJ2aWNlLnNlbmQoIHVzZXIuZW1haWwsIE1lc3NhZ2VzLkVNQUlMX1NVQkpFQ1RfQ0FORElEQVRFX1JFR0lTVFJBVElPTiwgaHRtbFRlbXBsYXRlLCBkYXRhLGF0dGFjaG1lbnQsXG4gICAgICAgICAgKGVycjogYW55LCByZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyLCByZXN1bHQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9Ki9cbiAgICB9KTtcbiAgfVxuXG4gIGFzc2lnbkZyZWVTdWJzY3JpcHRpb25QYWNrYWdlKHVzZXI6IFVzZXJNb2RlbCwgZnJlZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uUGFja2FnZSkge1xuICAgIGxldCBzdWJzY3JpcHRpb24gPSBuZXcgVXNlclN1YnNjcmlwdGlvbigpO1xuICAgIHN1YnNjcmlwdGlvbi5hY3RpdmF0aW9uRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgc3Vic2NyaXB0aW9uLm51bU9mQnVpbGRpbmdzID0gZnJlZVN1YnNjcmlwdGlvbi5iYXNlUGFja2FnZS5udW1PZkJ1aWxkaW5ncztcbiAgICBzdWJzY3JpcHRpb24ubnVtT2ZQcm9qZWN0cyA9IGZyZWVTdWJzY3JpcHRpb24uYmFzZVBhY2thZ2UubnVtT2ZQcm9qZWN0cztcbiAgICBzdWJzY3JpcHRpb24udmFsaWRpdHkgPSBmcmVlU3Vic2NyaXB0aW9uLmJhc2VQYWNrYWdlLnZhbGlkaXR5O1xuICAgIHN1YnNjcmlwdGlvbi5wcm9qZWN0SWQgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuICAgIHN1YnNjcmlwdGlvbi5wdXJjaGFzZWQgPSBuZXcgQXJyYXk8QmFzZVN1YnNjcmlwdGlvblBhY2thZ2U+KCk7XG4gICAgc3Vic2NyaXB0aW9uLnB1cmNoYXNlZC5wdXNoKGZyZWVTdWJzY3JpcHRpb24uYmFzZVBhY2thZ2UpO1xuICAgIHVzZXIuc3Vic2NyaXB0aW9uID0gbmV3IEFycmF5PFVzZXJTdWJzY3JpcHRpb24+KCk7XG4gICAgdXNlci5zdWJzY3JpcHRpb24ucHVzaChzdWJzY3JpcHRpb24pO1xuICB9XG5cbiAgbG9naW4oZGF0YTogYW55LCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLnJldHJpZXZlKHsnZW1haWwnOiBkYXRhLmVtYWlsfSwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICB9IGVsc2UgaWYgKHJlc3VsdC5sZW5ndGggPiAwICYmIHJlc3VsdFswXS5pc0FjdGl2YXRlZCA9PT0gdHJ1ZSkge1xuICAgICAgICBiY3J5cHQuY29tcGFyZShkYXRhLnBhc3N3b3JkLCByZXN1bHRbMF0ucGFzc3dvcmQsIChlcnI6IGFueSwgaXNTYW1lOiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICBjYWxsYmFjayh7XG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX1JFR0lTVFJBVElPTl9TVEFUVVMsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQ0FORElEQVRFX0FDQ09VTlQsXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgICAgICBhY3R1YWxFcnJvcjogZXJyLFxuICAgICAgICAgICAgICBjb2RlOiA1MDBcbiAgICAgICAgICAgIH0sIG51bGwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvKmNvbnNvbGUubG9nKCdnb3QgdXNlcicpOyovXG4gICAgICAgICAgICBpZiAoaXNTYW1lKSB7XG4gICAgICAgICAgICAgIGxldCBhdXRoID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xuICAgICAgICAgICAgICBsZXQgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc3VsdFswXSk7XG4gICAgICAgICAgICAgIHZhciBkYXRhOiBhbnkgPSB7XG4gICAgICAgICAgICAgICAgJ3N0YXR1cyc6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxuICAgICAgICAgICAgICAgICdkYXRhJzoge1xuICAgICAgICAgICAgICAgICAgJ2ZpcnN0X25hbWUnOiByZXN1bHRbMF0uZmlyc3RfbmFtZSxcbiAgICAgICAgICAgICAgICAgICdsYXN0X25hbWUnOiByZXN1bHRbMF0ubGFzdF9uYW1lLFxuICAgICAgICAgICAgICAgICAgJ2NvbXBhbnlfbmFtZSc6IHJlc3VsdFswXS5jb21wYW55X25hbWUsXG4gICAgICAgICAgICAgICAgICAnZW1haWwnOiByZXN1bHRbMF0uZW1haWwsXG4gICAgICAgICAgICAgICAgICAnX2lkJzogcmVzdWx0WzBdLl9pZCxcbiAgICAgICAgICAgICAgICAgICdjdXJyZW50X3RoZW1lJzogcmVzdWx0WzBdLmN1cnJlbnRfdGhlbWUsXG4gICAgICAgICAgICAgICAgICAncGljdHVyZSc6IHJlc3VsdFswXS5waWN0dXJlLFxuICAgICAgICAgICAgICAgICAgJ21vYmlsZV9udW1iZXInOiByZXN1bHRbMF0ubW9iaWxlX251bWJlcixcbiAgICAgICAgICAgICAgICAgICdhY2Nlc3NfdG9rZW4nOiB0b2tlblxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBkYXRhKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKHtcbiAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfUEFTU1dPUkQsXG4gICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgICAgICAgY29kZTogNDAwXG4gICAgICAgICAgICAgIH0sIG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKHJlc3VsdC5sZW5ndGggPiAwICYmIHJlc3VsdFswXS5pc0FjdGl2YXRlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgY2FsbGJhY2soe1xuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX1JFR0lTVFJBVElPTl9TVEFUVVMsXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1ZFUklGWV9DQU5ESURBVEVfQUNDT1VOVCxcbiAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgICBjb2RlOiA1MDBcbiAgICAgICAgfSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayh7XG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX1VTRVJfTk9UX0ZPVU5ELFxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9VU0VSX05PVF9QUkVTRU5ULFxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgIGNvZGU6IDQwMFxuICAgICAgICB9LG51bGwpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2VuZE90cChwYXJhbXM6IGFueSwgdXNlcjogYW55LCBjYWxsYmFjazooZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcbiAgICBsZXQgRGF0YSA9IHtcbiAgICAgIG5ld19tb2JpbGVfbnVtYmVyOiBwYXJhbXMubW9iaWxlX251bWJlcixcbiAgICAgIG9sZF9tb2JpbGVfbnVtYmVyOiB1c2VyLm1vYmlsZV9udW1iZXIsXG4gICAgICBfaWQ6IHVzZXIuX2lkXG4gICAgfTtcbiAgICB0aGlzLmdlbmVyYXRlT3RwKERhdGEsIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgaWYgKGVycm9yID09PSBNZXNzYWdlcy5NU0dfRVJST1JfQ0hFQ0tfTU9CSUxFX1BSRVNFTlQpIHtcbiAgICAgICAgICBjYWxsYmFjayh7XG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRVhJU1RJTkdfVVNFUixcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT05fTU9CSUxFX05VTUJFUixcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgICAgY29kZTogNDAwXG4gICAgICAgICAgfSwgbnVsbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHJlc3VsdC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNhbGxiYWNrKHtcbiAgICAgICAgICAnc3RhdHVzJzogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXG4gICAgICAgICAgJ2RhdGEnOiB7XG4gICAgICAgICAgICAnbWVzc2FnZSc6IE1lc3NhZ2VzLk1TR19TVUNDRVNTX09UUFxuICAgICAgICAgIH1cbiAgICAgICAgfSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayh7XG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX1VTRVJfTk9UX0ZPVU5ELFxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fVVNFUl9OT1RfRk9VTkQsXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgY29kZTogNDAwXG4gICAgICAgIH0sIG51bGwpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2VuZXJhdGVPdHAoZmllbGQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIHRoaXMudXNlclJlcG9zaXRvcnkucmV0cmlldmUoeydtb2JpbGVfbnVtYmVyJzogZmllbGQubmV3X21vYmlsZV9udW1iZXIsICdpc0FjdGl2YXRlZCc6IHRydWV9LCAoZXJyLCByZXMpID0+IHtcblxuICAgICAgaWYgKGVycikge1xuICAgICAgfSBlbHNlIGlmIChyZXMubGVuZ3RoID4gMCAmJiAocmVzWzBdLl9pZCkgIT09IGZpZWxkLl9pZCkge1xuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTl9NT0JJTEVfTlVNQkVSKSwgbnVsbCk7XG4gICAgICB9IGVsc2UgaWYgKHJlcy5sZW5ndGggPT09IDApIHtcblxuICAgICAgICBsZXQgcXVlcnkgPSB7J19pZCc6IGZpZWxkLl9pZH07XG4gICAgICAgIGxldCBvdHAgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogOTk5OTkpICsgMTAwMDAwKTtcbiAgICAgICAgbGV0IHVwZGF0ZURhdGEgPSB7J21vYmlsZV9udW1iZXInOiBmaWVsZC5uZXdfbW9iaWxlX251bWJlciwgJ290cCc6IG90cH07XG4gICAgICAgIHRoaXMudXNlclJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTl9NT0JJTEVfTlVNQkVSKSwgbnVsbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBEYXRhID0ge1xuICAgICAgICAgICAgICBtb2JpbGVObzogZmllbGQubmV3X21vYmlsZV9udW1iZXIsXG4gICAgICAgICAgICAgIG90cDogb3RwXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbGV0IHNlbmRNZXNzYWdlU2VydmljZSA9IG5ldyBTZW5kTWVzc2FnZVNlcnZpY2UoKTtcbiAgICAgICAgICAgIHNlbmRNZXNzYWdlU2VydmljZS5zZW5kTWVzc2FnZURpcmVjdChEYXRhLCBjYWxsYmFjayk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfUkVHSVNUUkFUSU9OX01PQklMRV9OVU1CRVIpLCBudWxsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHZlcmlmeU90cChwYXJhbXM6IGFueSwgdXNlcjphbnksIGNhbGxiYWNrOihlcnJvcjphbnksIHJlc3VsdDphbnkpID0+IHZvaWQpIHtcbiAgICBsZXQgbWFpbENoaW1wTWFpbGVyU2VydmljZSA9IG5ldyBNYWlsQ2hpbXBNYWlsZXJTZXJ2aWNlKCk7XG5cbiAgICBsZXQgcXVlcnkgPSB7J19pZCc6IHVzZXIuX2lkLCAnaXNBY3RpdmF0ZWQnOiBmYWxzZX07XG4gICAgbGV0IHVwZGF0ZURhdGEgPSB7J2lzQWN0aXZhdGVkJzogdHJ1ZSwgJ2FjdGl2YXRpb25fZGF0ZSc6IG5ldyBEYXRlKCl9O1xuICAgIGlmICh1c2VyLm90cCA9PT0gcGFyYW1zLm90cCkge1xuICAgICAgdGhpcy5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNhbGxiYWNrKG51bGwse1xuICAgICAgICAgICAgJ3N0YXR1cyc6ICdTdWNjZXNzJyxcbiAgICAgICAgICAgICdkYXRhJzogeydtZXNzYWdlJzogJ1VzZXIgQWNjb3VudCB2ZXJpZmllZCBzdWNjZXNzZnVsbHknfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG1haWxDaGltcE1haWxlclNlcnZpY2Uub25DYW5kaWRhdGVTaWduU3VjY2VzcyhyZXN1bHQpO1xuXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYWxsYmFjayh7XG4gICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxuICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfT1RQLFxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgY29kZTogNDAwXG4gICAgICB9LCBudWxsKTtcbiAgICB9XG5cbiAgfVxuXG4gIGNoYW5nZU1vYmlsZU51bWJlcihmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG5cbiAgICBsZXQgcXVlcnkgPSB7J19pZCc6IGZpZWxkLl9pZH07XG4gICAgbGV0IG90cCA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiA5OTk5OSkgKyAxMDAwMDApO1xuICAgIGxldCB1cGRhdGVEYXRhID0geydvdHAnOiBvdHAsICd0ZW1wX21vYmlsZSc6IGZpZWxkLm5ld19tb2JpbGVfbnVtYmVyfTtcblxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT04pLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBEYXRhID0ge1xuICAgICAgICAgIGN1cnJlbnRfbW9iaWxlX251bWJlcjogZmllbGQuY3VycmVudF9tb2JpbGVfbnVtYmVyLFxuICAgICAgICAgIG1vYmlsZU5vOiBmaWVsZC5uZXdfbW9iaWxlX251bWJlcixcbiAgICAgICAgICBvdHA6IG90cFxuICAgICAgICB9O1xuICAgICAgICBsZXQgc2VuZE1lc3NhZ2VTZXJ2aWNlID0gbmV3IFNlbmRNZXNzYWdlU2VydmljZSgpO1xuICAgICAgICBzZW5kTWVzc2FnZVNlcnZpY2Uuc2VuZENoYW5nZU1vYmlsZU1lc3NhZ2UoRGF0YSwgY2FsbGJhY2spO1xuXG4gICAgICB9XG4gICAgfSk7XG5cbiAgfVxuXG4gIGZvcmdvdFBhc3N3b3JkKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBTZW50TWVzc2FnZUluZm8pID0+IHZvaWQpIHtcblxuICAgIGxldCBzZW5kTWFpbFNlcnZpY2UgPSBuZXcgU2VuZE1haWxTZXJ2aWNlKCk7XG4gICAgbGV0IHF1ZXJ5ID0geydlbWFpbCc6IGZpZWxkLmVtYWlsfTtcblxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkucmV0cmlldmUocXVlcnksIChlcnIsIHJlcykgPT4ge1xuXG4gICAgICBpZiAocmVzLmxlbmd0aCA+IDAgJiYgcmVzWzBdLmlzQWN0aXZhdGVkID09PSB0cnVlKSB7XG5cbiAgICAgICAgbGV0IGF1dGggPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XG4gICAgICAgIGxldCB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQocmVzWzBdKTtcbiAgICAgICAgbGV0IGhvc3QgPSBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLmhvc3QnKTtcbiAgICAgICAgbGV0IGxpbmsgPSBob3N0ICsgJ3Jlc2V0LXBhc3N3b3JkP2FjY2Vzc190b2tlbj0nICsgdG9rZW4gKyAnJl9pZD0nICsgcmVzWzBdLl9pZDtcbiAgICAgICAgbGV0IGh0bWxUZW1wbGF0ZSA9ICdmb3Jnb3RwYXNzd29yZC5odG1sJztcbiAgICAgICAgbGV0IGRhdGE6TWFwPHN0cmluZyxzdHJpbmc+PSBuZXcgTWFwKFtbJyRhcHBsaWNhdGlvbkxpbmskJyxjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLmhvc3QnKV0sXG4gICAgICAgICAgWyckZmlyc3RfbmFtZSQnLHJlc1swXS5maXJzdF9uYW1lXSxbJyRsaW5rJCcsbGlua10sWyckYXBwX25hbWUkJyx0aGlzLkFQUF9OQU1FXV0pO1xuICAgICAgICBsZXQgYXR0YWNobWVudD1NYWlsQXR0YWNobWVudHMuRm9yZ2V0UGFzc3dvcmRBdHRhY2htZW50QXJyYXk7XG4gICAgICAgIHNlbmRNYWlsU2VydmljZS5zZW5kKCBmaWVsZC5lbWFpbCwgTWVzc2FnZXMuRU1BSUxfU1VCSkVDVF9GT1JHT1RfUEFTU1dPUkQsIGh0bWxUZW1wbGF0ZSwgZGF0YSxhdHRhY2htZW50LFxuKGVycjogYW55LCByZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyLCByZXN1bHQpO1xuICAgICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChyZXMubGVuZ3RoID4gMCAmJiByZXNbMF0uaXNBY3RpdmF0ZWQgPT09IGZhbHNlKSB7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfQUNDT1VOVF9TVEFUVVMpLCByZXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9VU0VSX05PVF9GT1VORCksIHJlcyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgfVxuXG5cbiAgU2VuZENoYW5nZU1haWxWZXJpZmljYXRpb24oZmllbGQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IFNlbnRNZXNzYWdlSW5mbykgPT4gdm9pZCkge1xuICAgIGxldCBxdWVyeSA9IHsnZW1haWwnOiBmaWVsZC5jdXJyZW50X2VtYWlsLCAnaXNBY3RpdmF0ZWQnOiB0cnVlfTtcbiAgICBsZXQgdXBkYXRlRGF0YSA9IHskc2V0OnsndGVtcF9lbWFpbCc6IGZpZWxkLm5ld19lbWFpbH19O1xuICAgIHRoaXMudXNlclJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfRU1BSUxfQUNUSVZFX05PVyksIG51bGwpO1xuICAgICAgfSBlbHNlIGlmKHJlc3VsdCA9PSBudWxsKSB7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0FDQ09VTlQpLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBhdXRoID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xuICAgICAgICBsZXQgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc3VsdCk7XG4gICAgICAgIGxldCBob3N0ID0gY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5ob3N0Jyk7XG4gICAgICAgIGxldCBsaW5rID0gaG9zdCArICdhY3RpdmF0ZS11c2VyP2FjY2Vzc190b2tlbj0nICsgdG9rZW4gKyAnJl9pZD0nICsgcmVzdWx0Ll9pZCsnaXNFbWFpbFZlcmlmaWNhdGlvbic7XG4gICAgICAgIGxldCBzZW5kTWFpbFNlcnZpY2UgPSBuZXcgU2VuZE1haWxTZXJ2aWNlKCk7XG4gICAgICAgIGxldCBkYXRhOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcChbWyckYXBwbGljYXRpb25MaW5rJCcsY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5ob3N0JyldLFxuICAgICAgICAgIFsnJGxpbmskJywgbGlua11dKTtcbiAgICAgICAgbGV0IGF0dGFjaG1lbnQ9TWFpbEF0dGFjaG1lbnRzLkF0dGFjaG1lbnRBcnJheTtcbiAgICAgICAgc2VuZE1haWxTZXJ2aWNlLnNlbmQoZmllbGQubmV3X2VtYWlsLFxuICAgICAgICAgIE1lc3NhZ2VzLkVNQUlMX1NVQkpFQ1RfQ0hBTkdFX0VNQUlMSUQsXG4gICAgICAgICAgJ2NoYW5nZS5tYWlsLmh0bWwnLCBkYXRhLGF0dGFjaG1lbnQsIGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG5cbiAvKiBzZW5kVmVyaWZpY2F0aW9uTWFpbChmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogU2VudE1lc3NhZ2VJbmZvKSA9PiB2b2lkKSB7XG5cbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnJldHJpZXZlKHsnZW1haWwnOiBmaWVsZC5lbWFpbH0sIChlcnIsIHJlcykgPT4ge1xuICAgICAgaWYgKHJlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeS5yZXRyaWV2ZSh7J3VzZXJJZCc6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZChyZXNbMF0uX2lkKX0sIChlcnIsIHJlY3J1aXRlcikgPT4ge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY29tcGFueV9uYW1lID0gcmVjcnVpdGVyWzBdLmNvbXBhbnlfbmFtZTtcbiAgICAgICAgICAgIGxldCBhdXRoID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xuICAgICAgICAgICAgbGV0IHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZChyZWNydWl0ZXJbMF0pO1xuICAgICAgICAgICAgbGV0IGhvc3QgPSBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLmhvc3QnKTtcbiAgICAgICAgICAgIGxldCBsaW5rID0gaG9zdCArICdjb21wYW55LWRldGFpbHM/YWNjZXNzX3Rva2VuPScgKyB0b2tlbiArICcmX2lkPScgKyByZXNbMF0uX2lkICsgJyZjb21wYW55TmFtZT0nICsgdGhpcy5jb21wYW55X25hbWU7XG4gICAgICAgICAgICBsZXQgc2VuZE1haWxTZXJ2aWNlID0gbmV3IFNlbmRNYWlsU2VydmljZSgpO1xuICAgICAgICAgICAgbGV0IGRhdGE6TWFwPHN0cmluZyxzdHJpbmc+PSBuZXcgTWFwKFtbJyRqb2Jtb3Npc0xpbmskJyxjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuaG9zdCcpXSxcbiAgICAgICAgICAgICAgWyckbGluayQnLGxpbmtdXSk7XG4gICAgICAgICAgICBzZW5kTWFpbFNlcnZpY2Uuc2VuZChmaWVsZC5lbWFpbCxcbiAgICAgICAgICAgICAgTWVzc2FnZXMuRU1BSUxfU1VCSkVDVF9SRUdJU1RSQVRJT04sXG4gICAgICAgICAgICAgICdyZWNydWl0ZXIubWFpbC5odG1sJyxkYXRhLChlcnI6IGFueSwgcmVzdWx0OiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgaWYoZXJyKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IHJlY3J1aXRlclNlcnZpY2UgPSBuZXcgUmVjcnVpdGVyU2VydmljZSgpO1xuICAgICAgICAgICAgICAgIHJlY3J1aXRlclNlcnZpY2UubWFpbE9uUmVjcnVpdGVyU2lnbnVwVG9BZG1pbihyZXNbMF0sIHRoaXMuY29tcGFueV9uYW1lLCBjYWxsYmFjayk7XG5cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgIH0gfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1VTRVJfTk9UX0ZPVU5EKSwgcmVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSovXG5cbi8qICBzZW5kUmVjcnVpdGVyVmVyaWZpY2F0aW9uTWFpbChmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogU2VudE1lc3NhZ2VJbmZvKSA9PiB2b2lkKSB7XG5cbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnJldHJpZXZlKHsnZW1haWwnOiBmaWVsZC5lbWFpbH0sIChlcnIsIHJlcykgPT4ge1xuICAgICAgaWYgKHJlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGxldCBhdXRoID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xuICAgICAgICBsZXQgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc1swXSk7XG4gICAgICAgIGxldCBob3N0ID0gY29uZmlnLmdldCgnVHBsU2VlZC5tYWlsLmhvc3QnKTtcbiAgICAgICAgbGV0IGxpbmsgPSBob3N0ICsgJ2FjdGl2YXRlLXVzZXI/YWNjZXNzX3Rva2VuPScgKyB0b2tlbiArICcmX2lkPScgKyByZXNbMF0uX2lkO1xuICAgICAgICBsZXQgc2VuZE1haWxTZXJ2aWNlID0gbmV3IFNlbmRNYWlsU2VydmljZSgpO1xuICAgICAgICBsZXQgZGF0YTogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoW1snJGpvYm1vc2lzTGluayQnLGNvbmZpZy5nZXQoJ1RwbFNlZWQubWFpbC5ob3N0JyldLFsnJGxpbmskJywgbGlua11dKTtcbiAgICAgICAgc2VuZE1haWxTZXJ2aWNlLnNlbmQoZmllbGQuZW1haWwsXG4gICAgICAgICAgTWVzc2FnZXMuRU1BSUxfU1VCSkVDVF9SRUdJU1RSQVRJT04sXG4gICAgICAgICAgJ3JlY3J1aXRlci5tYWlsLmh0bWwnLCBkYXRhLCBjYWxsYmFjayk7XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfVVNFUl9OT1RfRk9VTkQpLCByZXMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9Ki9cblxuXG4gIHNlbmRNYWlsKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBTZW50TWVzc2FnZUluZm8pID0+IHZvaWQpIHtcbiAgICBsZXQgc2VuZE1haWxTZXJ2aWNlID0gbmV3IFNlbmRNYWlsU2VydmljZSgpO1xuICAgIGxldCBkYXRhOk1hcDxzdHJpbmcsc3RyaW5nPj0gbmV3IE1hcChbWyckYXBwbGljYXRpb25MaW5rJCcsY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5ob3N0JyldLFxuICAgICAgWyckZmlyc3RfbmFtZSQnLGZpZWxkLmZpcnN0X25hbWVdLFsnJGVtYWlsJCcsZmllbGQuZW1haWxdLFsnJG1lc3NhZ2UkJyxmaWVsZC5tZXNzYWdlXV0pO1xuICAgIGxldCBhdHRhY2htZW50PU1haWxBdHRhY2htZW50cy5BdHRhY2htZW50QXJyYXk7XG4gICAgc2VuZE1haWxTZXJ2aWNlLnNlbmQoY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5BRE1JTl9NQUlMJyksXG4gICAgICBNZXNzYWdlcy5FTUFJTF9TVUJKRUNUX1VTRVJfQ09OVEFDVEVEX1lPVSxcbiAgICAgICdjb250YWN0dXMubWFpbC5odG1sJyxkYXRhLGF0dGFjaG1lbnQsY2FsbGJhY2spO1xuICB9XG5cbiAgc2VuZE1haWxPbkVycm9yKGVycm9ySW5mbzogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogU2VudE1lc3NhZ2VJbmZvKSA9PiB2b2lkKSB7XG4gICAgbGV0IGN1cnJlbnRfVGltZSA9IG5ldyBEYXRlKCkudG9Mb2NhbGVUaW1lU3RyaW5nKFtdLCB7aG91cjogJzItZGlnaXQnLCBtaW51dGU6ICcyLWRpZ2l0J30pO1xuICAgIGxldCBkYXRhOk1hcDxzdHJpbmcsc3RyaW5nPjtcbiAgICBpZihlcnJvckluZm8uc3RhY2tUcmFjZSkge1xuICAgICAgIGRhdGE9IG5ldyBNYXAoW1snJGFwcGxpY2F0aW9uTGluayQnLGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpXSxcbiAgICAgICAgIFsnJHRpbWUkJyxjdXJyZW50X1RpbWVdLFsnJGhvc3QkJyxjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLmhvc3QnKV0sXG4gICAgICAgIFsnJHJlYXNvbiQnLGVycm9ySW5mby5yZWFzb25dLFsnJGNvZGUkJyxlcnJvckluZm8uY29kZV0sXG4gICAgICAgIFsnJG1lc3NhZ2UkJyxlcnJvckluZm8ubWVzc2FnZV0sWyckZXJyb3IkJyxlcnJvckluZm8uc3RhY2tUcmFjZS5zdGFja11dKTtcblxuICAgIH0gZWxzZSBpZihlcnJvckluZm8uc3RhY2spIHtcbiAgICAgIGRhdGE9IG5ldyBNYXAoW1snJGFwcGxpY2F0aW9uTGluayQnLGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpXSxcbiAgICAgICAgWyckdGltZSQnLGN1cnJlbnRfVGltZV0sWyckaG9zdCQnLGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpXSxcbiAgICAgICAgWyckcmVhc29uJCcsZXJyb3JJbmZvLnJlYXNvbl0sWyckY29kZSQnLGVycm9ySW5mby5jb2RlXSxcbiAgICAgICAgWyckbWVzc2FnZSQnLGVycm9ySW5mby5tZXNzYWdlXSxbJyRlcnJvciQnLGVycm9ySW5mby5zdGFja11dKTtcbiAgICB9XG4gICAgbGV0IHNlbmRNYWlsU2VydmljZSA9IG5ldyBTZW5kTWFpbFNlcnZpY2UoKTtcbiAgICBsZXQgYXR0YWNobWVudCA9IE1haWxBdHRhY2htZW50cy5BdHRhY2htZW50QXJyYXk7XG4gICAgc2VuZE1haWxTZXJ2aWNlLnNlbmQoY29uZmlnLmdldCgnYXBwbGljYXRpb24ubWFpbC5BRE1JTl9NQUlMJyksXG4gICAgICBNZXNzYWdlcy5FTUFJTF9TVUJKRUNUX1NFUlZFUl9FUlJPUiArICcgb24gJyArIGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLm1haWwuaG9zdCcpLFxuICAgICAgJ2Vycm9yLm1haWwuaHRtbCcsZGF0YSxhdHRhY2htZW50LCBjYWxsYmFjayxjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5tYWlsLlRQTEdST1VQX01BSUwnKSk7XG4gIH1cblxuICBmaW5kQnlJZChpZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kQnlJZChpZCwgY2FsbGJhY2spO1xuICB9XG5cbiAgcmV0cmlldmUoZmllbGQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIHRoaXMudXNlclJlcG9zaXRvcnkucmV0cmlldmUoZmllbGQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJldHJpZXZlV2l0aExpbWl0KGZpZWxkOiBhbnksIGluY2x1ZGVkIDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgbGV0IGxpbWl0ID0gY29uZmlnLmdldCgnYXBwbGljYXRpb24ubGltaXRGb3JRdWVyeScpO1xuICAgIHRoaXMudXNlclJlcG9zaXRvcnkucmV0cmlldmVXaXRoTGltaXQoZmllbGQsIGluY2x1ZGVkLCBsaW1pdCwgY2FsbGJhY2spO1xuICB9XG5cbiAgcmV0cmlldmVXaXRoTGVhbihmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5yZXRyaWV2ZShmaWVsZCwgY2FsbGJhY2spO1xuICB9XG5cbiAgcmV0cmlldmVBbGwoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5yZXRyaWV2ZShpdGVtLCAoZXJyLCByZXMpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT05fTU9CSUxFX05VTUJFUiksIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZShfaWQ6IGFueSwgaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG5cbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmZpbmRCeUlkKF9pZCwgKGVycjogYW55LCByZXM6IGFueSkgPT4ge1xuXG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgcmVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudXNlclJlcG9zaXRvcnkudXBkYXRlKF9pZCwgaXRlbSwgY2FsbGJhY2spO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cblxuICBkZWxldGUoX2lkOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmRlbGV0ZShfaWQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGZpbmRPbmVBbmRVcGRhdGUocXVlcnk6IGFueSwgbmV3RGF0YTogYW55LCBvcHRpb25zOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIG5ld0RhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIFVwbG9hZEltYWdlKHRlbXBQYXRoOiBhbnksIGZpbGVOYW1lOiBhbnksIGNiOiBhbnkpIHtcbiAgICBsZXQgdGFyZ2V0cGF0aCA9IGZpbGVOYW1lO1xuICAgIGZzLnJlbmFtZSh0ZW1wUGF0aCwgdGFyZ2V0cGF0aCwgZnVuY3Rpb24gKGVycikge1xuICAgICAgY2IobnVsbCwgdGVtcFBhdGgpO1xuICAgIH0pO1xuICB9XG5cbiAgVXBsb2FkRG9jdW1lbnRzKHRlbXBQYXRoOiBhbnksIGZpbGVOYW1lOiBhbnksIGNiOiBhbnkpIHtcbiAgICBsZXQgdGFyZ2V0cGF0aCA9IGZpbGVOYW1lO1xuICAgIGZzLnJlbmFtZSh0ZW1wUGF0aCwgdGFyZ2V0cGF0aCwgZnVuY3Rpb24gKGVycjogYW55KSB7XG4gICAgICBjYihudWxsLCB0ZW1wUGF0aCk7XG4gICAgfSk7XG4gIH1cblxuICBmaW5kQW5kVXBkYXRlTm90aWZpY2F0aW9uKHF1ZXJ5OiBhbnksIG5ld0RhdGE6IGFueSwgb3B0aW9uczogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBuZXdEYXRhLCBvcHRpb25zLCBjYWxsYmFjayk7XG4gIH1cblxuICByZXRyaWV2ZUJ5U29ydGVkT3JkZXIocXVlcnk6IGFueSwgcHJvamVjdGlvbjphbnksIHNvcnRpbmdRdWVyeTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgLy90aGlzLnVzZXJSZXBvc2l0b3J5LnJldHJpZXZlQnlTb3J0ZWRPcmRlcihxdWVyeSwgcHJvamVjdGlvbiwgc29ydGluZ1F1ZXJ5LCBjYWxsYmFjayk7XG4gIH1cblxuICByZXNldFBhc3N3b3JkKGRhdGE6IGFueSwgdXNlciA6IGFueSwgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PmFueSkge1xuICAgIGNvbnN0IHNhbHRSb3VuZHMgPSAxMDtcbiAgICBiY3J5cHQuaGFzaChkYXRhLm5ld19wYXNzd29yZCwgc2FsdFJvdW5kcywgKGVycjogYW55LCBoYXNoOiBhbnkpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY2FsbGJhY2soe1xuICAgICAgICAgIHJlYXNvbjogJ0Vycm9yIGluIGNyZWF0aW5nIGhhc2ggdXNpbmcgYmNyeXB0JyxcbiAgICAgICAgICBtZXNzYWdlOiAnRXJyb3IgaW4gY3JlYXRpbmcgaGFzaCB1c2luZyBiY3J5cHQnLFxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgIGNvZGU6IDQwM1xuICAgICAgICB9LCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCB1cGRhdGVEYXRhID0geydwYXNzd29yZCc6IGhhc2h9O1xuICAgICAgICBsZXQgcXVlcnkgPSB7J19pZCc6IHVzZXIuX2lkLCAncGFzc3dvcmQnOiB1c2VyLnBhc3N3b3JkfTtcbiAgICAgICAgdGhpcy5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCx7XG4gICAgICAgICAgICAgICdzdGF0dXMnOiAnU3VjY2VzcycsXG4gICAgICAgICAgICAgICdkYXRhJzogeydtZXNzYWdlJzogJ1Bhc3N3b3JkIGNoYW5nZWQgc3VjY2Vzc2Z1bGx5J31cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVEZXRhaWxzKGRhdGE6ICBVc2VyTW9kZWwsIHVzZXI6IFVzZXJNb2RlbCwgY2FsbGJhY2s6KGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgbGV0IGF1dGg6IEF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcbiAgICBsZXQgcXVlcnkgPSB7J19pZCc6IHVzZXIuX2lkfTtcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIGRhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKG51bGwse1xuICAgICAgICAgICdzdGF0dXMnOiAnU3VjY2VzcycsXG4gICAgICAgICAgJ2RhdGEnOiB7J21lc3NhZ2UnOiAnVXNlciBQcm9maWxlIFVwZGF0ZWQgc3VjY2Vzc2Z1bGx5J31cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICB9KTtcbiAgfVxuICBnZXRVc2VyQnlJZCh1c2VyOmFueSwgY2FsbGJhY2s6KGVycm9yOmFueSwgcmVzdWx0OmFueSk9PnZvaWQpIHtcbiAgICBsZXQgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xuXG4gICAgbGV0IHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKTtcbiAgICBjYWxsYmFjayhudWxsLHtcbiAgICAgICdzdGF0dXMnOiAnc3VjY2VzcycsXG4gICAgICAnZGF0YSc6IHtcbiAgICAgICAgJ2ZpcnN0X25hbWUnOiB1c2VyLmZpcnN0X25hbWUsXG4gICAgICAgICdsYXN0X25hbWUnOiB1c2VyLmxhc3RfbmFtZSxcbiAgICAgICAgJ2VtYWlsJzogdXNlci5lbWFpbCxcbiAgICAgICAgJ21vYmlsZV9udW1iZXInOiB1c2VyLm1vYmlsZV9udW1iZXIsXG4gICAgICAgICdjb21wYW55X25hbWUnOiB1c2VyLmNvbXBhbnlfbmFtZSxcbiAgICAgICAgJ3N0YXRlJzogdXNlci5zdGF0ZSxcbiAgICAgICAgJ2NpdHknOiB1c2VyLmNpdHksXG4gICAgICAgICdwaWN0dXJlJzogdXNlci5waWN0dXJlLFxuICAgICAgICAnc29jaWFsX3Byb2ZpbGVfcGljdHVyZSc6IHVzZXIuc29jaWFsX3Byb2ZpbGVfcGljdHVyZSxcbiAgICAgICAgJ19pZCc6IHVzZXIuX2lkLFxuICAgICAgICAnY3VycmVudF90aGVtZSc6IHVzZXIuY3VycmVudF90aGVtZVxuICAgICAgfSxcbiAgICAgIGFjY2Vzc190b2tlbjogdG9rZW5cbiAgICB9KTtcbiAgfVxuXG4gIHZlcmlmeUFjY291bnQodXNlcjpVc2VyLCBjYWxsYmFjazooZXJyb3I6YW55LCByZXN1bHQ6YW55KT0+dm9pZCkge1xuICAgIGxldCBxdWVyeSA9IHsnX2lkJzogdXNlci5faWQsICdpc0FjdGl2YXRlZCc6IGZhbHNlfTtcbiAgICBsZXQgdXBkYXRlRGF0YSA9IHsnaXNBY3RpdmF0ZWQnOiB0cnVlfTtcbiAgICB0aGlzLmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZURhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKG51bGwse1xuICAgICAgICAgICdzdGF0dXMnOiAnU3VjY2VzcycsXG4gICAgICAgICAgJ2RhdGEnOiB7J21lc3NhZ2UnOiAnVXNlciBBY2NvdW50IHZlcmlmaWVkIHN1Y2Nlc3NmdWxseSd9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgfSk7XG4gIH1cblxuICBjaGFuZ2VFbWFpbElkKGRhdGE6YW55LCB1c2VyIDogVXNlciwgY2FsbGJhY2s6KGVycm9yOmFueSwgcmVzdWx0OmFueSk9PnZvaWQpIHtcbiAgICBsZXQgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xuICAgIGxldCBxdWVyeSA9IHsnZW1haWwnOiBkYXRhLm5ld19lbWFpbH07XG5cbiAgICB0aGlzLnJldHJpZXZlKHF1ZXJ5LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuXG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICAgICAgfSBlbHNlIGlmIChyZXN1bHQubGVuZ3RoID4gMCAmJiByZXN1bHRbMF0uaXNBY3RpdmF0ZWQgPT09IHRydWUpIHtcbiAgICAgICAgY2FsbGJhY2soe1xuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT04sXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgY29kZTogNDAwXG4gICAgICAgIH0sbnVsbCk7XG4gICAgICB9IGVsc2UgaWYgKHJlc3VsdC5sZW5ndGggPiAwICYmIHJlc3VsdFswXS5pc0FjdGl2YXRlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgY2FsbGJhY2soe1xuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9BQ0NPVU5UX1NUQVRVUyxcbiAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgICBjb2RlOiA0MDBcbiAgICAgICAgfSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIHRoaXMuU2VuZENoYW5nZU1haWxWZXJpZmljYXRpb24oZGF0YSwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChlcnJvci5tZXNzYWdlID09PSBNZXNzYWdlcy5NU0dfRVJST1JfQ0hFQ0tfRU1BSUxfQUNDT1VOVCkge1xuICAgICAgICAgICAgICBjYWxsYmFjayh7XG4gICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0VYSVNUSU5HX1VTRVIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNQUlMX0FDVElWRV9OT1csXG4gICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgICAgICAgY29kZTogNDAwXG4gICAgICAgICAgICAgIH0sIG51bGwpO1xuICAgICAgICAgICAgfWlmIChlcnJvci5tZXNzYWdlID09PSBNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0FDQ09VTlQpIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2soe1xuICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1ZFUklGWV9BQ0NPVU5ULFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQUNDT1VOVCxcbiAgICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgICAgICAgICBjb2RlOiA0MDBcbiAgICAgICAgICAgICAgfSwgbnVsbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjYWxsYmFjayh7XG4gICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX1dISUxFX0NPTlRBQ1RJTkcsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dISUxFX0NPTlRBQ1RJTkcsXG4gICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgICAgICAgY29kZTogNDAwXG4gICAgICAgICAgICAgIH0sIG51bGwpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHtcbiAgICAgICAgICAgICAgJ3N0YXR1cyc6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxuICAgICAgICAgICAgICAnZGF0YSc6IHsnbWVzc2FnZSc6IE1lc3NhZ2VzLk1TR19TVUNDRVNTX0VNQUlMX0NIQU5HRV9FTUFJTElEfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdmVyaWZ5Q2hhbmdlZEVtYWlsSWQodXNlcjogYW55LCBjYWxsYmFjazooZXJyb3IgOiBhbnksIHJlc3VsdCA6IGFueSk9PiBhbnkpIHtcbiAgICBsZXQgcXVlcnkgPSB7J19pZCc6IHVzZXIuX2lkfTtcbiAgICBsZXQgdXBkYXRlRGF0YSA9IHsnZW1haWwnOiB1c2VyLnRlbXBfZW1haWwsICd0ZW1wX2VtYWlsJzogdXNlci5lbWFpbH07XG4gICAgdGhpcy5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayhudWxsLHtcbiAgICAgICAgICAnc3RhdHVzJzogJ1N1Y2Nlc3MnLFxuICAgICAgICAgICdkYXRhJzogeydtZXNzYWdlJzogJ1VzZXIgQWNjb3VudCB2ZXJpZmllZCBzdWNjZXNzZnVsbHknfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgIH0pO1xuICB9XG5cbiAgdmVyaWZ5TW9iaWxlTnVtYmVyKGRhdGEgOmFueSAsIHVzZXIgOiBhbnksIGNhbGxiYWNrOihlcnJvcjphbnksIHJlc3VsdDphbnkpPT52b2lkKSB7XG4gICAgbGV0IHF1ZXJ5ID0geydfaWQnOiB1c2VyLl9pZH07XG4gICAgbGV0IHVwZGF0ZURhdGEgPSB7J21vYmlsZV9udW1iZXInOiB1c2VyLnRlbXBfbW9iaWxlLCAndGVtcF9tb2JpbGUnOiB1c2VyLm1vYmlsZV9udW1iZXJ9O1xuICAgIGlmICh1c2VyLm90cCA9PT0gZGF0YS5vdHApIHtcbiAgICAgIHRoaXMuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYWxsYmFjayhudWxsLHtcbiAgICAgICAgICAgICdzdGF0dXMnOiAnU3VjY2VzcycsXG4gICAgICAgICAgICAnZGF0YSc6IHsnbWVzc2FnZSc6ICdVc2VyIEFjY291bnQgdmVyaWZpZWQgc3VjY2Vzc2Z1bGx5J31cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhbGxiYWNrKHtcbiAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXG4gICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XUk9OR19PVFAsXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICBjb2RlOiA0MDBcbiAgICAgIH0sIG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIGdldFByb2plY3RzKHVzZXI6IFVzZXIsIGNhbGxiYWNrOihlcnJvciA6IGFueSwgcmVzdWx0IDphbnkpPT52b2lkKSB7XG4gICAgbGV0IHF1ZXJ5ID0ge19pZCA6IHVzZXIuX2lkfTtcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmZpbmRBbmRQb3B1bGF0ZShxdWVyeSwge3BhdGg6ICdwcm9qZWN0Jywgc2VsZWN0OiAnbmFtZSd9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgaWYoZXJyb3IpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICAgICAgfWVsc2Uge1xuICAgICAgICBsZXQgYXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xuICAgICAgICBjYWxsYmFjayhudWxsLCB7ZGF0YTogcmVzdWx0WzBdLnByb2plY3QsIGFjY2Vzc190b2tlbjogYXV0aEludGVyY2VwdG9yLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuT2JqZWN0LnNlYWwoVXNlclNlcnZpY2UpO1xuZXhwb3J0ID0gVXNlclNlcnZpY2U7XG4iXX0=
