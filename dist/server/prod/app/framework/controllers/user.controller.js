"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var multiparty = require("multiparty");
var AuthInterceptor = require("../interceptor/auth.interceptor");
var UserService = require("../services/user.service");
var RecruiterService = require("../services/recruiter.service");
var Messages = require("../shared/messages");
var CandidateService = require("../services/candidate.service");
var adminController = require("./admin.controller");
var mailchimp_mailer_service_1 = require("../services/mailchimp-mailer.service");
var bcrypt = require('bcrypt');
function login(req, res, next) {
    try {
        var userService = new UserService();
        var params = req.body;
        delete params.access_token;
        userService.retrieve({ "email": params.email }, function (error, result) {
            if (error) {
                next(error);
            }
            else if (result.length > 0 && result[0].isActivated === true) {
                bcrypt.compare(params.password, result[0].password, function (err, isSame) {
                    if (err) {
                        next({
                            reason: Messages.MSG_ERROR_RSN_INVALID_REGISTRATION_STATUS,
                            message: Messages.MSG_ERROR_VERIFY_CANDIDATE_ACCOUNT,
                            stackTrace: new Error(),
                            code: 400
                        });
                    }
                    else {
                        if (isSame) {
                            var auth = new AuthInterceptor();
                            var token = auth.issueTokenWithUid(result[0]);
                            if (result[0].isAdmin) {
                                adminController.sendLoginInfoToAdmin(result[0].email, req.connection.remoteAddress, params.latitude, params.longitude, next);
                                res.status(200).send({
                                    "status": Messages.STATUS_SUCCESS,
                                    "data": {
                                        "email": result[0].email,
                                        "first_name": result[0].first_name,
                                        "_id": result[0]._id,
                                        "current_theme": result[0].current_theme,
                                        "end_user_id": result[0]._id,
                                        "picture": result[0].picture,
                                        "mobile_number": result[0].mobile_number,
                                        "isCandidate": result[0].isCandidate,
                                        "isAdmin": result[0].isAdmin
                                    },
                                    access_token: token
                                });
                            }
                            else {
                                if (result[0].isCandidate === false) {
                                    var recruiterService = new RecruiterService();
                                    recruiterService.retrieve({ "userId": result[0]._id }, function (error, recruiter) {
                                        if (error) {
                                            next(error);
                                        }
                                        else {
                                            res.status(200).send({
                                                "status": Messages.STATUS_SUCCESS,
                                                "data": {
                                                    "email": result[0].email,
                                                    "_id": result[0]._id,
                                                    "end_user_id": recruiter[0]._id,
                                                    "current_theme": result[0].current_theme,
                                                    "picture": result[0].picture,
                                                    "company_headquarter_country": recruiter[0].company_headquarter_country,
                                                    "company_name": recruiter[0].company_name,
                                                    "setOfDocuments": recruiter[0].setOfDocuments,
                                                    "company_size": recruiter[0].company_size,
                                                    "isRecruitingForself": recruiter[0].isRecruitingForself,
                                                    "mobile_number": result[0].mobile_number,
                                                    "isCandidate": result[0].isCandidate,
                                                    "isAdmin": result[0].isAdmin
                                                },
                                                access_token: token
                                            });
                                        }
                                    });
                                }
                                else {
                                    var candidateService = new CandidateService();
                                    candidateService.retrieve({ "userId": result[0]._id }, function (error, candidate) {
                                        if (error) {
                                            next(error);
                                        }
                                        else {
                                            res.status(200).send({
                                                "status": Messages.STATUS_SUCCESS,
                                                "data": {
                                                    "first_name": result[0].first_name,
                                                    "last_name": result[0].last_name,
                                                    "email": result[0].email,
                                                    "_id": result[0]._id,
                                                    "end_user_id": candidate[0]._id,
                                                    "current_theme": result[0].current_theme,
                                                    "picture": result[0].picture,
                                                    "mobile_number": result[0].mobile_number,
                                                    "isCandidate": result[0].isCandidate,
                                                    "isAdmin": result[0].isAdmin,
                                                    "isCompleted": candidate[0].isCompleted,
                                                    "isSubmitted": candidate[0].isSubmitted,
                                                    "guide_tour": result[0].guide_tour
                                                },
                                                access_token: token
                                            });
                                        }
                                    });
                                }
                            }
                        }
                        else {
                            next({
                                reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                                message: Messages.MSG_ERROR_WRONG_PASSWORD,
                                stackTrace: new Error(),
                                code: 400
                            });
                        }
                    }
                });
            }
            else if (result.length > 0 && result[0].isActivated === false) {
                bcrypt.compare(params.password, result[0].password, function (err, isPassSame) {
                    if (err) {
                        next({
                            reason: Messages.MSG_ERROR_RSN_INVALID_REGISTRATION_STATUS,
                            message: Messages.MSG_ERROR_VERIFY_CANDIDATE_ACCOUNT,
                            stackTrace: new Error(),
                            code: 400
                        });
                    }
                    else {
                        if (isPassSame) {
                            if (result[0].isCandidate === true) {
                                next({
                                    reason: Messages.MSG_ERROR_RSN_INVALID_REGISTRATION_STATUS,
                                    message: Messages.MSG_ERROR_VERIFY_CANDIDATE_ACCOUNT,
                                    stackTrace: new Error(),
                                    code: 400
                                });
                            }
                            else {
                                next({
                                    reason: Messages.MSG_ERROR_RSN_INVALID_REGISTRATION_STATUS,
                                    message: Messages.MSG_ERROR_VERIFY_ACCOUNT,
                                    stackTrace: new Error(),
                                    code: 400
                                });
                            }
                        }
                        else {
                            next({
                                reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                                message: Messages.MSG_ERROR_WRONG_PASSWORD,
                                stackTrace: new Error(),
                                code: 400
                            });
                        }
                    }
                });
            }
            else {
                next({
                    reason: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
                    message: Messages.MSG_ERROR_USER_NOT_PRESENT,
                    stackTrace: new Error(),
                    code: 400
                });
            }
        });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 500
        });
    }
}
exports.login = login;
function generateOtp(req, res, next) {
    try {
        var userService = new UserService();
        var user = req.user;
        var params = req.body;
        var Data = {
            new_mobile_number: params.mobile_number,
            old_mobile_number: user.mobile_number,
            _id: user._id
        };
        userService.generateOtp(Data, function (error, result) {
            if (error) {
                if (error == Messages.MSG_ERROR_CHECK_MOBILE_PRESENT) {
                    next({
                        reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
                        message: Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER,
                        stackTrace: new Error(),
                        code: 403
                    });
                }
                else {
                    next(error);
                }
            }
            else if (result.length > 0) {
                res.status(200).send({
                    "status": Messages.STATUS_SUCCESS,
                    "data": {
                        "message": Messages.MSG_SUCCESS_OTP
                    }
                });
            }
            else {
                next({
                    reason: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
                    message: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
                    stackTrace: new Error(),
                    code: 403
                });
            }
        });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.generateOtp = generateOtp;
function verificationMail(req, res, next) {
    try {
        var userService = new UserService();
        var user = req.user;
        var params = req.body;
        userService.sendVerificationMail(params, function (error, result) {
            if (error) {
                next({
                    reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
                    message: Messages.MSG_ERROR_WHILE_CONTACTING,
                    stackTrace: new Error(),
                    code: 403
                });
            }
            else {
                res.status(200).send({
                    "status": Messages.STATUS_SUCCESS,
                    "data": { "message": Messages.MSG_SUCCESS_EMAIL_REGISTRATION }
                });
            }
        });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.verificationMail = verificationMail;
function recruiterVerificationMail(req, res, next) {
    try {
        var userService = new UserService();
        var user = req.user;
        var params = req.body;
        userService.sendRecruiterVerificationMail(params, function (error, result) {
            if (error) {
                next({
                    reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
                    message: Messages.MSG_ERROR_WHILE_CONTACTING,
                    stackTrace: new Error(),
                    code: 403
                });
            }
            else {
                res.status(200).send({
                    "status": Messages.STATUS_SUCCESS,
                    "data": { "message": Messages.MSG_SUCCESS_EMAIL_REGISTRATION }
                });
            }
        });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.recruiterVerificationMail = recruiterVerificationMail;
function mail(req, res, next) {
    try {
        var userService = new UserService();
        var params = req.body;
        userService.sendMail(params, function (error, result) {
            if (error) {
                next({
                    reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
                    message: Messages.MSG_ERROR_WHILE_CONTACTING,
                    stackTrace: new Error(),
                    code: 403
                });
            }
            else {
                res.status(200).send({
                    "status": Messages.STATUS_SUCCESS,
                    "data": { "message": Messages.MSG_SUCCESS_SUBMITTED }
                });
            }
        });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.mail = mail;
function create(req, res, next) {
    try {
        var newUser = req.body;
        var userService = new UserService();
        userService.createUser(newUser, function (error, result) {
            if (error) {
                if (error == Messages.MSG_ERROR_CHECK_EMAIL_PRESENT) {
                    next({
                        reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
                        message: Messages.MSG_ERROR_VERIFY_ACCOUNT,
                        stackTrace: new Error(),
                        code: 403
                    });
                }
                else if (error == Messages.MSG_ERROR_CHECK_MOBILE_PRESENT) {
                    next({
                        reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
                        message: Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER,
                        stackTrace: new Error(),
                        code: 403
                    });
                }
                else {
                    next({
                        reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
                        message: Messages.MSG_ERROR_USER_WITH_EMAIL_PRESENT,
                        stackTrace: new Error(),
                        code: 403
                    });
                }
            }
            else {
                var auth = new AuthInterceptor();
                var token = auth.issueTokenWithUid(result);
                res.status(200).send({
                    "status": Messages.STATUS_SUCCESS,
                    "data": {
                        "reason": Messages.MSG_SUCCESS_REGISTRATION,
                        "first_name": newUser.first_name,
                        "last_name": newUser.last_name,
                        "email": newUser.email,
                        "mobile_number": newUser.mobile_number,
                        "_id": result._id,
                        "picture": ""
                    },
                    access_token: token
                });
            }
        });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.create = create;
function forgotPassword(req, res, next) {
    try {
        var userService = new UserService();
        var params = req.body;
        userService.forgotPassword(params, function (error, result) {
            if (error) {
                if (error == Messages.MSG_ERROR_CHECK_INACTIVE_ACCOUNT) {
                    next({
                        reason: Messages.MSG_ERROR_USER_NOT_ACTIVATED,
                        message: Messages.MSG_ERROR_ACCOUNT_STATUS,
                        stackTrace: new Error(),
                        code: 403
                    });
                }
                else if (error == Messages.MSG_ERROR_CHECK_INVALID_ACCOUNT) {
                    next({
                        reason: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
                        message: Messages.MSG_ERROR_USER_NOT_FOUND,
                        stackTrace: new Error(),
                        code: 403
                    });
                }
            }
            else {
                res.status(200).send({
                    "status": Messages.STATUS_SUCCESS,
                    "data": { "message": Messages.MSG_SUCCESS_EMAIL_FORGOT_PASSWORD }
                });
            }
        });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.forgotPassword = forgotPassword;
function notifications(req, res, next) {
    try {
        var user = req.user;
        var auth = new AuthInterceptor();
        var token = auth.issueTokenWithUid(user);
        var params = { _id: user._id };
        var userService = new UserService();
        userService.retrieve(params, function (error, result) {
            if (error) {
                next(error);
            }
            else if (result.length > 0) {
                var token = auth.issueTokenWithUid(user);
                res.send({
                    "status": "success",
                    "data": result[0].notifications,
                    access_token: token
                });
            }
        });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.notifications = notifications;
function pushNotifications(req, res, next) {
    try {
        var user = req.user;
        var body_data = req.body;
        var auth = new AuthInterceptor();
        var token = auth.issueTokenWithUid(user);
        var params = { _id: user._id };
        var userService = new UserService();
        var data = { $push: { notifications: body_data } };
        userService.findOneAndUpdate(params, data, { new: true }, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                var token = auth.issueTokenWithUid(user);
                res.send({
                    "status": "Success",
                    "data": result.notifications,
                });
            }
        });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.pushNotifications = pushNotifications;
function updateNotifications(req, res, next) {
    try {
        var user = req.user;
        var body_data = req.body;
        var auth = new AuthInterceptor();
        var token = auth.issueTokenWithUid(user);
        var params = { _id: user._id };
        var userService = new UserService();
        var data = { is_read: true };
        userService.findAndUpdateNotification(params, data, { new: true }, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                var token = auth.issueTokenWithUid(user);
                res.send({
                    "status": "Success",
                    "data": result.notifications,
                });
            }
        });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.updateNotifications = updateNotifications;
function updateDetails(req, res, next) {
    try {
        var newUserData = req.body;
        var params = req.query;
        delete params.access_token;
        var user = req.user;
        var _id = user._id;
        var auth = new AuthInterceptor();
        var userService = new UserService();
        userService.update(_id, newUserData, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                userService.retrieve(_id, function (error, result) {
                    if (error) {
                        next({
                            reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                            message: Messages.MSG_ERROR_WRONG_TOKEN,
                            stackTrace: new Error(),
                            code: 403
                        });
                    }
                    else {
                        var token = auth.issueTokenWithUid(user);
                        res.send({
                            "status": "success",
                            "data": {
                                "first_name": result[0].first_name,
                                "last_name": result[0].last_name,
                                "email": result[0].email,
                                "mobile_number": result[0].mobile_number,
                                "picture": result[0].picture,
                                "_id": result[0].userId,
                                "current_theme": result[0].current_theme
                            },
                            access_token: token
                        });
                    }
                });
            }
        });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.updateDetails = updateDetails;
function updateRecruiterAccountDetails(req, res, next) {
    try {
        var newUserData = req.body;
        var user = req.user;
        var _id = user._id;
        var auth = new AuthInterceptor();
        var recruiterService = new RecruiterService();
        recruiterService.updateDetails(_id, newUserData, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                res.send({
                    'status': 'Success'
                });
            }
        });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.updateRecruiterAccountDetails = updateRecruiterAccountDetails;
function updateProfileField(req, res, next) {
    try {
        var params = req.query;
        delete params.access_token;
        var user = req.user;
        var _id = user._id;
        var fName = req.params.fname;
        if (fName == 'guide_tour') {
            var data = { 'guide_tour': req.body };
        }
        var auth = new AuthInterceptor();
        var userService = new UserService();
        userService.update(_id, data, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                userService.retrieve(_id, function (error, result) {
                    if (error) {
                        next({
                            reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                            message: Messages.MSG_ERROR_WRONG_TOKEN,
                            stackTrace: new Error(),
                            code: 403
                        });
                    }
                    else {
                        var token = auth.issueTokenWithUid(user);
                        res.send({
                            "status": "success",
                            "data": {
                                "first_name": result[0].first_name,
                                "last_name": result[0].last_name,
                                "email": result[0].email,
                                "_id": result[0].userId,
                                "guide_tour": result[0].guide_tour
                            },
                            access_token: token
                        });
                    }
                });
            }
        });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.updateProfileField = updateProfileField;
function retrieve(req, res, next) {
    try {
        var userService = new UserService();
        var params = req.params.id;
        delete params.access_token;
        var user = req.user;
        var auth = new AuthInterceptor();
        var token = auth.issueTokenWithUid(user);
        res.send({
            "status": "success",
            "data": {
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "mobile_number": user.mobile_number,
                "picture": user.picture,
                "social_profile_picture": user.social_profile_picture,
                "_id": user.userId,
                "current_theme": user.current_theme
            },
            access_token: token
        });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.retrieve = retrieve;
function resetPassword(req, res, next) {
    try {
        var user = req.user;
        var params = req.body;
        delete params.access_token;
        var userService = new UserService();
        var saltRounds = 10;
        bcrypt.hash(req.body.new_password, saltRounds, function (err, hash) {
            if (err) {
                next({
                    reason: 'Error in creating hash using bcrypt',
                    message: 'Error in creating hash using bcrypt',
                    stackTrace: new Error(),
                    code: 403
                });
            }
            else {
                var updateData = { 'password': hash };
                var query = { "_id": user._id, "password": req.user.password };
                userService.findOneAndUpdate(query, updateData, { new: true }, function (error, result) {
                    if (error) {
                        next(error);
                    }
                    else {
                        res.send({
                            'status': 'Success',
                            'data': { 'message': 'Password changed successfully' }
                        });
                    }
                });
            }
        });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.resetPassword = resetPassword;
function changePassword(req, res, next) {
    try {
        var user = req.user;
        var params = req.query;
        delete params.access_token;
        var auth = new AuthInterceptor();
        var userService = new UserService();
        bcrypt.compare(req.body.current_password, user.password, function (err, isSame) {
            if (err) {
                next({
                    reason: Messages.MSG_ERROR_RSN_INVALID_REGISTRATION_STATUS,
                    message: Messages.MSG_ERROR_VERIFY_CANDIDATE_ACCOUNT,
                    stackTrace: new Error(),
                    code: 403
                });
            }
            else {
                if (isSame) {
                    if (req.body.current_password === req.body.new_password) {
                        next({
                            reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                            message: Messages.MSG_ERROR_SAME_NEW_PASSWORD,
                            stackTrace: new Error(),
                            code: 403
                        });
                    }
                    else {
                        var new_password;
                        var saltRounds = 10;
                        bcrypt.hash(req.body.new_password, saltRounds, function (err, hash) {
                            if (err) {
                                next({
                                    reason: Messages.MSG_ERROR_RSN_INVALID_REGISTRATION_STATUS,
                                    message: Messages.MSG_ERROR_BCRYPT_CREATION,
                                    stackTrace: new Error(),
                                    code: 403
                                });
                            }
                            else {
                                new_password = hash;
                                var query = { "_id": req.user._id };
                                var updateData = { "password": new_password };
                                userService.findOneAndUpdate(query, updateData, { new: true }, function (error, result) {
                                    if (error) {
                                        next(error);
                                    }
                                    else {
                                        var token = auth.issueTokenWithUid(user);
                                        res.send({
                                            "status": "Success",
                                            "data": { "message": Messages.MSG_SUCCESS_PASSWORD_CHANGE },
                                            access_token: token
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
                else {
                    next({
                        reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                        message: Messages.MSG_ERROR_WRONG_CURRENT_PASSWORD,
                        stackTrace: new Error(),
                        code: 403
                    });
                }
            }
        });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.changePassword = changePassword;
function changeMobileNumber(req, res, next) {
    try {
        var user = req.user;
        var params = req.body;
        var auth = new AuthInterceptor();
        var userService = new UserService();
        var query = { "mobile_number": params.new_mobile_number, "isActivated": true };
        userService.retrieve(query, function (error, result) {
            if (error) {
                next(error);
            }
            else if (result.length > 0) {
                next({
                    reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
                    message: Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER,
                    stackTrace: new Error(),
                    code: 403
                });
            }
            else {
                var Data = {
                    current_mobile_number: user.mobile_number,
                    _id: user._id,
                    new_mobile_number: params.new_mobile_number
                };
                userService.changeMobileNumber(Data, function (error, result) {
                    if (error) {
                        next({
                            reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
                            message: Messages.MSG_ERROR_WHILE_CONTACTING,
                            stackTrace: new Error(),
                            code: 403
                        });
                    }
                    else {
                        res.status(200).send({
                            "status": Messages.STATUS_SUCCESS,
                            "data": {
                                "message": Messages.MSG_SUCCESS_OTP_CHANGE_MOBILE_NUMBER
                            }
                        });
                    }
                });
            }
        });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.changeMobileNumber = changeMobileNumber;
function changeEmailId(req, res, next) {
    try {
        var user = req.user;
        var params = req.query;
        delete params.access_token;
        var auth = new AuthInterceptor();
        var userService = new UserService();
        var query = { "email": req.body.new_email };
        userService.retrieve(query, function (error, result) {
            if (error) {
                next(error);
            }
            else if (result.length > 0 && result[0].isActivated === true) {
                next({
                    reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
                    message: Messages.MSG_ERROR_REGISTRATION,
                    stackTrace: new Error(),
                    code: 403
                });
            }
            else if (result.length > 0 && result[0].isActivated === false) {
                next({
                    reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
                    message: Messages.MSG_ERROR_ACCOUNT_STATUS,
                    stackTrace: new Error(),
                    code: 403
                });
            }
            else {
                var emailId = {
                    current_email: req.body.current_email,
                    new_email: req.body.new_email
                };
                userService.SendChangeMailVerification(emailId, function (error, result) {
                    if (error) {
                        if (error === Messages.MSG_ERROR_CHECK_EMAIL_ACCOUNT) {
                            next({
                                reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
                                message: Messages.MSG_ERROR_EMAIL_ACTIVE_NOW,
                                stackTrace: new Error(),
                                code: 403
                            });
                        }
                        else {
                            next({
                                reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
                                message: Messages.MSG_ERROR_WHILE_CONTACTING,
                                stackTrace: new Error(),
                                code: 403
                            });
                        }
                    }
                    else {
                        res.status(200).send({
                            "status": Messages.STATUS_SUCCESS,
                            "data": { "message": Messages.MSG_SUCCESS_EMAIL_CHANGE_EMAILID }
                        });
                    }
                });
            }
        });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.changeEmailId = changeEmailId;
function verifyMobileNumber(req, res, next) {
    try {
        var user = req.user;
        var params = req.body;
        var userService = new UserService();
        var query = { "_id": user._id };
        var updateData = { "mobile_number": user.temp_mobile, "temp_mobile": user.mobile_number };
        if (user.otp === params.otp) {
            userService.findOneAndUpdate(query, updateData, { new: true }, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    res.send({
                        "status": "Success",
                        "data": { "message": "User Account verified successfully" }
                    });
                }
            });
        }
        else {
            next({
                reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                message: Messages.MSG_ERROR_WRONG_OTP,
                stackTrace: new Error(),
                code: 403
            });
        }
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.verifyMobileNumber = verifyMobileNumber;
function verifyOtp(req, res, next) {
    try {
        var user = req.user;
        var params = req.body;
        var userService = new UserService();
        var mailChimpMailerService_1 = new mailchimp_mailer_service_1.MailChimpMailerService();
        var query = { "_id": user._id, "isActivated": false };
        var updateData = { "isActivated": true };
        if (user.otp === params.otp) {
            userService.findOneAndUpdate(query, updateData, { new: true }, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    res.send({
                        "status": "Success",
                        "data": { "message": "User Account verified successfully" }
                    });
                    mailChimpMailerService_1.onCandidateSignSuccess(result);
                }
            });
        }
        else {
            next({
                reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                message: Messages.MSG_ERROR_WRONG_OTP,
                stackTrace: new Error(),
                code: 403
            });
        }
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.verifyOtp = verifyOtp;
function verifyAccount(req, res, next) {
    try {
        var user = req.user;
        var params = req.query;
        delete params.access_token;
        var userService = new UserService();
        var query = { "_id": user._id, "isActivated": false };
        var updateData = { "isActivated": true };
        userService.findOneAndUpdate(query, updateData, { new: true }, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                res.send({
                    "status": "Success",
                    "data": { "message": "User Account verified successfully" }
                });
            }
        });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.verifyAccount = verifyAccount;
function verifyChangedEmailId(req, res, next) {
    try {
        var user = req.user;
        var params = req.query;
        delete params.access_token;
        var userService = new UserService();
        var query = { "_id": user._id };
        var updateData = { "email": user.temp_email, "temp_email": user.email };
        userService.findOneAndUpdate(query, updateData, { new: true }, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                res.send({
                    "status": "Success",
                    "data": { "message": "User Account verified successfully" }
                });
            }
        });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.verifyChangedEmailId = verifyChangedEmailId;
function getIndustry(req, res, next) {
    __dirname = './';
    var filepath = "industry.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.getIndustry = getIndustry;
function getCompanySize(req, res, next) {
    __dirname = './';
    var filepath = "company-size.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.getCompanySize = getCompanySize;
function getAddress(req, res, next) {
    __dirname = './';
    var filepath = "address.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.getAddress = getAddress;
function getRealocation(req, res, next) {
    __dirname = './';
    var filepath = "realocation.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.getRealocation = getRealocation;
function getEducation(req, res, next) {
    __dirname = './';
    var filepath = "education.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.getEducation = getEducation;
function getCloseJobReasons(req, res, next) {
    __dirname = './';
    var filepath = "closeJob.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.getCloseJobReasons = getCloseJobReasons;
function getExperience(req, res, next) {
    __dirname = './';
    var filepath = "experienceList.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.getExperience = getExperience;
function getCurrentSalary(req, res, next) {
    __dirname = './';
    var filepath = "currentsalaryList.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.getCurrentSalary = getCurrentSalary;
function getNoticePeriod(req, res, next) {
    __dirname = './';
    var filepath = "noticeperiodList.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.getNoticePeriod = getNoticePeriod;
function getIndustryExposure(req, res, next) {
    __dirname = './';
    var filepath = "industryexposureList.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.getIndustryExposure = getIndustryExposure;
function getSearchedCandidate(req, res, next) {
    __dirname = './';
    var filepath = "candidate.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.getSearchedCandidate = getSearchedCandidate;
function getCountries(req, res, next) {
    __dirname = './';
    var filepath = "country.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.getCountries = getCountries;
function getIndiaStates(req, res, next) {
    __dirname = './';
    var filepath = "indiaStates.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.getIndiaStates = getIndiaStates;
function getFunction(req, res, next) {
    __dirname = './';
    var filepath = "function.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.getFunction = getFunction;
function getRole(req, res, next) {
    __dirname = './';
    var filepath = "roles.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.getRole = getRole;
function getProficiency(req, res, next) {
    __dirname = './';
    var filepath = "proficiency.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.getProficiency = getProficiency;
function getDomain(req, res, next) {
    __dirname = './';
    var filepath = "domain.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.getDomain = getDomain;
function getCapability(req, res, next) {
    __dirname = './';
    var filepath = "capability.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.getCapability = getCapability;
function getComplexity(req, res, next) {
    __dirname = './';
    var filepath = "complexity.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.getComplexity = getComplexity;
function fblogin(req, res, next) {
    try {
        var userService = new UserService();
        var params = req.user;
        var auth = new AuthInterceptor();
        userService.retrieve(params, function (error, result) {
            if (error) {
                next(error);
            }
            else if (result.length > 0) {
                var token = auth.issueTokenWithUid(result[0]);
                res.status(200).send({
                    "status": Messages.STATUS_SUCCESS,
                    "isSocialLogin": true,
                    "data": {
                        "first_name": result[0].first_name,
                        "last_name": result[0].last_name,
                        "email": result[0].email,
                        "mobile_number": result[0].mobile_number,
                        "picture": result[0].picture,
                        "_id": result[0]._id,
                        "current_theme": result[0].current_theme
                    },
                    access_token: token
                });
            }
            else {
                next({
                    reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                    message: Messages.MSG_ERROR_INVALID_CREDENTIALS,
                    stackTrace: new Error(),
                    code: 403
                });
            }
        });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.fblogin = fblogin;
function googlelogin(req, res, next) {
    try {
        var userService = new UserService();
        var params = req.user;
        var auth = new AuthInterceptor();
        userService.retrieve(params, function (error, result) {
            if (error) {
                next(error);
            }
            else if (result.length > 0) {
                var token = auth.issueTokenWithUid(result[0]);
                res.status(200).send({
                    "status": Messages.STATUS_SUCCESS,
                    "isSocialLogin": true,
                    "data": {
                        "first_name": result[0].first_name,
                        "last_name": result[0].last_name,
                        "email": result[0].email,
                        "mobile_number": result[0].mobile_number,
                        "social_profile_picture": result[0].social_profile_picture,
                        "current_theme": result[0].current_theme,
                        "_id": result[0]._id
                    },
                    access_token: token
                });
            }
            else {
                next({
                    reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                    message: Messages.MSG_ERROR_INVALID_CREDENTIALS,
                    stackTrace: new Error(),
                    code: 403
                });
            }
        });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.googlelogin = googlelogin;
function updatePicture(req, res, next) {
    __dirname = 'src/server/app/framework/public/profileimage';
    var form = new multiparty.Form({ uploadDir: __dirname });
    form.parse(req, function (err, fields, files) {
        if (err) {
            next({
                reason: Messages.MSG_ERROR_RSN_DIRECTORY_NOT_FOUND,
                message: Messages.MSG_ERROR_DIRECTORY_NOT_FOUND,
                stackTrace: new Error(),
                code: 403
            });
        }
        else {
            var path = JSON.stringify(files.file[0].path);
            var image_path = files.file[0].path;
            var originalFilename = JSON.stringify(image_path.substr(files.file[0].path.lastIndexOf('/') + 1));
            var userService = new UserService();
            userService.UploadImage(path, originalFilename, function (err, tempath) {
                if (err) {
                    next(err);
                }
                else {
                    var mypath = tempath;
                    try {
                        var user = req.user;
                        var query = { "_id": user._id };
                        userService.findById(user._id, function (error, result) {
                            if (error) {
                                next(error);
                            }
                            else {
                                if (!result.isCandidate) {
                                    var recruiterService = new RecruiterService();
                                    var query1 = { "userId": result._id };
                                    recruiterService.findOneAndUpdate(query1, { company_logo: mypath }, { new: true }, function (error, response1) {
                                        if (error) {
                                            next(error);
                                        }
                                        else {
                                            userService.findOneAndUpdate(query, { picture: mypath }, { new: true }, function (error, response) {
                                                if (error) {
                                                    next(error);
                                                }
                                                else {
                                                    var auth = new AuthInterceptor();
                                                    var token = auth.issueTokenWithUid(result);
                                                    res.status(200).send({ access_token: token, data: response });
                                                }
                                            });
                                        }
                                    });
                                }
                                else {
                                    userService.findOneAndUpdate(query, { picture: mypath }, { new: true }, function (error, response) {
                                        if (error) {
                                            next(error);
                                        }
                                        else {
                                            var auth = new AuthInterceptor();
                                            var token = auth.issueTokenWithUid(result);
                                            res.status(200).send({ access_token: token, data: response });
                                        }
                                    });
                                }
                            }
                        });
                    }
                    catch (e) {
                        next({
                            reason: e.message,
                            message: e.message,
                            stackTrace: new Error(),
                            code: 403
                        });
                    }
                }
            });
        }
    });
}
exports.updatePicture = updatePicture;
function updateCompanyDetails(req, res, next) {
    var userService = new UserService();
    var user = req.user;
    var query = { "_id": user._id };
}
exports.updateCompanyDetails = updateCompanyDetails;
function uploaddocuments(req, res, next) {
    __dirname = 'src/server/app/framework/public/uploaded-document';
    var form = new multiparty.Form({ uploadDir: __dirname });
    form.parse(req, function (err, fields, files) {
        if (err) {
            next({
                reason: Messages.MSG_ERROR_RSN_DIRECTORY_NOT_FOUND,
                message: Messages.MSG_ERROR_DIRECTORY_NOT_FOUND,
                stackTrace: new Error(),
                code: 403
            });
        }
        else {
            var path = JSON.stringify(files.file[0].path);
            var document_path = files.file[0].path;
            var originalFilename = JSON.stringify(document_path.substr(files.file[0].path.lastIndexOf('/') + 1));
            res.status(200).send({
                "status": Messages.STATUS_SUCCESS,
                "data": {
                    "document": document_path
                }
            });
        }
    });
}
exports.uploaddocuments = uploaddocuments;
function profilecreate(req, res, next) {
    try {
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.profilecreate = profilecreate;
function professionaldata(req, res, next) {
    try {
        var newUser = req.body;
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.professionaldata = professionaldata;
function employmentdata(req, res, next) {
    try {
        var newUser = req.body;
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.employmentdata = employmentdata;
function changeTheme(req, res, next) {
    try {
        var user = req.user;
        var params = req.query;
        delete params.access_token;
        var auth = new AuthInterceptor();
        var userService = new UserService();
        var query = { "_id": req.user.id };
        var updateData = { "current_theme": req.body.current_theme };
        userService.findOneAndUpdate(query, updateData, { new: true }, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                var token = auth.issueTokenWithUid(user);
                res.send({
                    access_token: token, data: result
                });
            }
        });
    }
    catch (e) {
        next({
            reason: e.message,
            message: e.message,
            stackTrace: new Error(),
            code: 403
        });
    }
}
exports.changeTheme = changeTheme;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvdXNlci5jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsdUNBQXlDO0FBQ3pDLGlFQUFvRTtBQUdwRSxzREFBeUQ7QUFDekQsZ0VBQW1FO0FBQ25FLDZDQUFnRDtBQUVoRCxnRUFBbUU7QUFDbkUsb0RBQXNEO0FBRXRELGlGQUE4RTtBQUU5RSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFFL0IsZUFBc0IsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQVM7SUFDMUUsSUFBSSxDQUFDO1FBRUgsSUFBSSxXQUFXLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztRQUNwQyxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1FBQ3RCLE9BQU8sTUFBTSxDQUFDLFlBQVksQ0FBQztRQUMzQixXQUFXLENBQUMsUUFBUSxDQUFDLEVBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUMsRUFBRSxVQUFDLEtBQUssRUFBRSxNQUFNO1lBQzFELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2QsQ0FBQztZQUNELElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQzdELE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLFVBQUMsR0FBUSxFQUFFLE1BQVc7b0JBQ3hFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ1IsSUFBSSxDQUFDOzRCQUNILE1BQU0sRUFBRSxRQUFRLENBQUMseUNBQXlDOzRCQUMxRCxPQUFP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RUFBRSxJQUFJLEtBQUssRUFBRTtZQUN2QixJQUFJLEVBQUUsR0FBRztTQUNWLENBQUMsQ0FBQztJQUNMLENBQUM7QUFHSCxDQUFDO0FBL0JELGtDQStCQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2NvbnRyb2xsZXJzL3VzZXIuY29udHJvbGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgKiBhcyBtdWx0aXBhcnR5IGZyb20gJ211bHRpcGFydHknO1xuaW1wb3J0IEF1dGhJbnRlcmNlcHRvciA9IHJlcXVpcmUoJy4uL2ludGVyY2VwdG9yL2F1dGguaW50ZXJjZXB0b3InKTtcbmltcG9ydCBTZW5kTWFpbFNlcnZpY2UgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9zZW5kbWFpbC5zZXJ2aWNlJyk7XG5pbXBvcnQgVXNlck1vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC91c2VyLm1vZGVsJyk7XG5pbXBvcnQgVXNlclNlcnZpY2UgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy91c2VyLnNlcnZpY2UnKTtcbmltcG9ydCBSZWNydWl0ZXJTZXJ2aWNlID0gcmVxdWlyZSgnLi4vc2VydmljZXMvcmVjcnVpdGVyLnNlcnZpY2UnKTtcbmltcG9ydCBNZXNzYWdlcyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9tZXNzYWdlcycpO1xuaW1wb3J0IFJlc3BvbnNlU2VydmljZSA9IHJlcXVpcmUoJy4uL3NoYXJlZC9yZXNwb25zZS5zZXJ2aWNlJyk7XG5pbXBvcnQgQ2FuZGlkYXRlU2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL2NhbmRpZGF0ZS5zZXJ2aWNlJyk7XG5pbXBvcnQgYWRtaW5Db250cm9sbGVyPSByZXF1aXJlKCcuL2FkbWluLmNvbnRyb2xsZXInKTtcbmltcG9ydCBSZWNydWl0ZXJNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcmVjcnVpdGVyLm1vZGVsJyk7XG5pbXBvcnQgeyBNYWlsQ2hpbXBNYWlsZXJTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvbWFpbGNoaW1wLW1haWxlci5zZXJ2aWNlJztcblxudmFyIGJjcnlwdCA9IHJlcXVpcmUoJ2JjcnlwdCcpO1xuXG5leHBvcnQgZnVuY3Rpb24gbG9naW4ocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XG4gIHRyeSB7XG5cbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcbiAgICB2YXIgcGFyYW1zID0gcmVxLmJvZHk7XG4gICAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XG4gICAgdXNlclNlcnZpY2UucmV0cmlldmUoe1wiZW1haWxcIjogcGFyYW1zLmVtYWlsfSwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBuZXh0KGVycm9yKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHJlc3VsdC5sZW5ndGggPiAwICYmIHJlc3VsdFswXS5pc0FjdGl2YXRlZCA9PT0gdHJ1ZSkge1xuICAgICAgICBiY3J5cHQuY29tcGFyZShwYXJhbXMucGFzc3dvcmQsIHJlc3VsdFswXS5wYXNzd29yZCwgKGVycjogYW55LCBpc1NhbWU6IGFueSkgPT4ge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIG5leHQoe1xuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9SRUdJU1RSQVRJT05fU1RBVFVTLFxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0NBTkRJREFURV9BQ0NPVU5ULFxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgICAgICAgY29kZTogNDAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGlzU2FtZSkge1xuICAgICAgICAgICAgICB2YXIgYXV0aCA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcbiAgICAgICAgICAgICAgdmFyIHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZChyZXN1bHRbMF0pO1xuICAgICAgICAgICAgICBpZiAocmVzdWx0WzBdLmlzQWRtaW4pIHtcbiAgICAgICAgICAgICAgICBhZG1pbkNvbnRyb2xsZXIuc2VuZExvZ2luSW5mb1RvQWRtaW4ocmVzdWx0WzBdLmVtYWlsLCByZXEuY29ubmVjdGlvbi5yZW1vdGVBZGRyZXNzLCBwYXJhbXMubGF0aXR1ZGUsIHBhcmFtcy5sb25naXR1ZGUsbmV4dCk7XG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xuICAgICAgICAgICAgICAgICAgXCJzdGF0dXNcIjogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXG4gICAgICAgICAgICAgICAgICBcImRhdGFcIjoge1xuICAgICAgICAgICAgICAgICAgICBcImVtYWlsXCI6IHJlc3VsdFswXS5lbWFpbCxcbiAgICAgICAgICAgICAgICAgICAgXCJmaXJzdF9uYW1lXCI6IHJlc3VsdFswXS5maXJzdF9uYW1lLFxuICAgICAgICAgICAgICAgICAgICBcIl9pZFwiOiByZXN1bHRbMF0uX2lkLFxuICAgICAgICAgICAgICAgICAgICBcImN1cnJlbnRfdGhlbWVcIjogcmVzdWx0WzBdLmN1cnJlbnRfdGhlbWUsXG4gICAgICAgICAgICAgICAgICAgIFwiZW5kX3VzZXJfaWRcIjogcmVzdWx0WzBdLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgXCJwaWN0dXJlXCI6IHJlc3VsdFswXS5waWN0dXJlLFxuICAgICAgICAgICAgICAgICAgICBcIm1vYmlsZV9udW1iZXJcIjogcmVzdWx0WzBdLm1vYmlsZV9udW1iZXIsXG4gICAgICAgICAgICAgICAgICAgIFwiaXNDYW5kaWRhdGVcIjogcmVzdWx0WzBdLmlzQ2FuZGlkYXRlLFxuICAgICAgICAgICAgICAgICAgICBcImlzQWRtaW5cIjogcmVzdWx0WzBdLmlzQWRtaW5cbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRva2VuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdFswXS5pc0NhbmRpZGF0ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgIHZhciByZWNydWl0ZXJTZXJ2aWNlID0gbmV3IFJlY3J1aXRlclNlcnZpY2UoKTtcblxuICAgICAgICAgICAgICAgICAgcmVjcnVpdGVyU2VydmljZS5yZXRyaWV2ZSh7XCJ1c2VySWRcIjogcmVzdWx0WzBdLl9pZH0sIChlcnJvciwgcmVjcnVpdGVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgIG5leHQoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3RhdHVzXCI6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlbWFpbFwiOiByZXN1bHRbMF0uZW1haWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiX2lkXCI6IHJlc3VsdFswXS5faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiZW5kX3VzZXJfaWRcIjogcmVjcnVpdGVyWzBdLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjdXJyZW50X3RoZW1lXCI6IHJlc3VsdFswXS5jdXJyZW50X3RoZW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBcInBpY3R1cmVcIjogcmVzdWx0WzBdLnBpY3R1cmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29tcGFueV9oZWFkcXVhcnRlcl9jb3VudHJ5XCI6IHJlY3J1aXRlclswXS5jb21wYW55X2hlYWRxdWFydGVyX2NvdW50cnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29tcGFueV9uYW1lXCI6IHJlY3J1aXRlclswXS5jb21wYW55X25hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwic2V0T2ZEb2N1bWVudHNcIjogcmVjcnVpdGVyWzBdLnNldE9mRG9jdW1lbnRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbXBhbnlfc2l6ZVwiOiByZWNydWl0ZXJbMF0uY29tcGFueV9zaXplLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImlzUmVjcnVpdGluZ0ZvcnNlbGZcIjogcmVjcnVpdGVyWzBdLmlzUmVjcnVpdGluZ0ZvcnNlbGYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwibW9iaWxlX251bWJlclwiOiByZXN1bHRbMF0ubW9iaWxlX251bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpc0NhbmRpZGF0ZVwiOiByZXN1bHRbMF0uaXNDYW5kaWRhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiaXNBZG1pblwiOiByZXN1bHRbMF0uaXNBZG1pblxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2Vzc190b2tlbjogdG9rZW5cbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgdmFyIGNhbmRpZGF0ZVNlcnZpY2UgPSBuZXcgQ2FuZGlkYXRlU2VydmljZSgpO1xuICAgICAgICAgICAgICAgICAgY2FuZGlkYXRlU2VydmljZS5yZXRyaWV2ZSh7XCJ1c2VySWRcIjogcmVzdWx0WzBdLl9pZH0sIChlcnJvciwgY2FuZGlkYXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgIG5leHQoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3RhdHVzXCI6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJmaXJzdF9uYW1lXCI6IHJlc3VsdFswXS5maXJzdF9uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImxhc3RfbmFtZVwiOiByZXN1bHRbMF0ubGFzdF9uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImVtYWlsXCI6IHJlc3VsdFswXS5lbWFpbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJfaWRcIjogcmVzdWx0WzBdLl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlbmRfdXNlcl9pZFwiOiBjYW5kaWRhdGVbMF0uX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImN1cnJlbnRfdGhlbWVcIjogcmVzdWx0WzBdLmN1cnJlbnRfdGhlbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwicGljdHVyZVwiOiByZXN1bHRbMF0ucGljdHVyZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJtb2JpbGVfbnVtYmVyXCI6IHJlc3VsdFswXS5tb2JpbGVfbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImlzQ2FuZGlkYXRlXCI6IHJlc3VsdFswXS5pc0NhbmRpZGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpc0FkbWluXCI6IHJlc3VsdFswXS5pc0FkbWluLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImlzQ29tcGxldGVkXCI6IGNhbmRpZGF0ZVswXS5pc0NvbXBsZXRlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpc1N1Ym1pdHRlZFwiOiBjYW5kaWRhdGVbMF0uaXNTdWJtaXR0ZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiZ3VpZGVfdG91clwiOiByZXN1bHRbMF0uZ3VpZGVfdG91clxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2Vzc190b2tlbjogdG9rZW5cbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBuZXh0KHtcbiAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfUEFTU1dPUkQsXG4gICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgICAgICAgY29kZTogNDAwXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChyZXN1bHQubGVuZ3RoID4gMCAmJiByZXN1bHRbMF0uaXNBY3RpdmF0ZWQgPT09IGZhbHNlKSB7XG4gICAgICAgIGJjcnlwdC5jb21wYXJlKHBhcmFtcy5wYXNzd29yZCwgcmVzdWx0WzBdLnBhc3N3b3JkLCAoZXJyOiBhbnksIGlzUGFzc1NhbWU6IGFueSkgPT4ge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIG5leHQoe1xuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9SRUdJU1RSQVRJT05fU1RBVFVTLFxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0NBTkRJREFURV9BQ0NPVU5ULFxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgICAgICAgY29kZTogNDAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGlzUGFzc1NhbWUpIHtcbiAgICAgICAgICAgICAgaWYgKHJlc3VsdFswXS5pc0NhbmRpZGF0ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIG5leHQoe1xuICAgICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfUkVHSVNUUkFUSU9OX1NUQVRVUyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQ0FORElEQVRFX0FDQ09VTlQsXG4gICAgICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgICAgICAgICAgIGNvZGU6IDQwMFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5leHQoe1xuICAgICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfUkVHSVNUUkFUSU9OX1NUQVRVUyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQUNDT1VOVCxcbiAgICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgICAgICAgICAgY29kZTogNDAwXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG5leHQoe1xuICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XUk9OR19QQVNTV09SRCxcbiAgICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgICAgICAgICBjb2RlOiA0MDBcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBuZXh0KHtcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fVVNFUl9OT1RfRk9VTkQsXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1VTRVJfTk9UX1BSRVNFTlQsXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgY29kZTogNDAwXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgbmV4dCh7XG4gICAgICByZWFzb246IGUubWVzc2FnZSxcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgY29kZTogNTAwXG4gICAgfSk7XG4gIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZU90cChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcbiAgdHJ5IHtcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcbiAgICB2YXIgdXNlciA9IHJlcS51c2VyO1xuICAgIHZhciBwYXJhbXMgPSByZXEuYm9keTsgIC8vbW9iaWxlX251bWJlcihuZXcpXG5cbiAgICB2YXIgRGF0YSA9IHtcbiAgICAgIG5ld19tb2JpbGVfbnVtYmVyOiBwYXJhbXMubW9iaWxlX251bWJlcixcbiAgICAgIG9sZF9tb2JpbGVfbnVtYmVyOiB1c2VyLm1vYmlsZV9udW1iZXIsXG4gICAgICBfaWQ6IHVzZXIuX2lkXG4gICAgfTtcbiAgICB1c2VyU2VydmljZS5nZW5lcmF0ZU90cChEYXRhLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGlmIChlcnJvciA9PSBNZXNzYWdlcy5NU0dfRVJST1JfQ0hFQ0tfTU9CSUxFX1BSRVNFTlQpIHtcbiAgICAgICAgICBuZXh0KHtcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTl9NT0JJTEVfTlVNQkVSLFxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgICBjb2RlOiA0MDNcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBuZXh0KGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xuICAgICAgICAgIFwic3RhdHVzXCI6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxuICAgICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgICBcIm1lc3NhZ2VcIjogTWVzc2FnZXMuTVNHX1NVQ0NFU1NfT1RQXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBuZXh0KHtcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fVVNFUl9OT1RfRk9VTkQsXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9VU0VSX05PVF9GT1VORCxcbiAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgICBjb2RlOiA0MDNcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICBuZXh0KHtcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICBjb2RlOiA0MDNcbiAgICB9KTtcblxuICB9XG59XG5leHBvcnQgZnVuY3Rpb24gdmVyaWZpY2F0aW9uTWFpbChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcbiAgdHJ5IHtcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcbiAgICB2YXIgdXNlciA9IHJlcS51c2VyO1xuICAgIHZhciBwYXJhbXMgPSByZXEuYm9keTtcbiAgICB1c2VyU2VydmljZS5zZW5kVmVyaWZpY2F0aW9uTWFpbChwYXJhbXMsIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgbmV4dCh7XG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX1dISUxFX0NPTlRBQ1RJTkcsXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dISUxFX0NPTlRBQ1RJTkcsXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgY29kZTogNDAzXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcbiAgICAgICAgICBcInN0YXR1c1wiOiBNZXNzYWdlcy5TVEFUVVNfU1VDQ0VTUyxcbiAgICAgICAgICBcImRhdGFcIjoge1wibWVzc2FnZVwiOiBNZXNzYWdlcy5NU0dfU1VDQ0VTU19FTUFJTF9SRUdJU1RSQVRJT059XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgbmV4dCh7XG4gICAgICByZWFzb246IGUubWVzc2FnZSxcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgY29kZTogNDAzXG4gICAgfSk7XG5cbiAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIHJlY3J1aXRlclZlcmlmaWNhdGlvbk1haWwocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XG4gIHRyeSB7XG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XG4gICAgdmFyIHVzZXIgPSByZXEudXNlcjtcbiAgICB2YXIgcGFyYW1zID0gcmVxLmJvZHk7XG4gICAgdXNlclNlcnZpY2Uuc2VuZFJlY3J1aXRlclZlcmlmaWNhdGlvbk1haWwocGFyYW1zLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIG5leHQoe1xuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9XSElMRV9DT05UQUNUSU5HLFxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XSElMRV9DT05UQUNUSU5HLFxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgIGNvZGU6IDQwM1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XG4gICAgICAgICAgXCJzdGF0dXNcIjogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXG4gICAgICAgICAgXCJkYXRhXCI6IHtcIm1lc3NhZ2VcIjogTWVzc2FnZXMuTVNHX1NVQ0NFU1NfRU1BSUxfUkVHSVNUUkFUSU9OfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBjYXRjaCAoZSkge1xuICAgIG5leHQoe1xuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgIGNvZGU6IDQwM1xuICAgIH0pO1xuXG4gIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBtYWlsKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xuICB0cnkge1xuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xuICAgIHZhciBwYXJhbXMgPSByZXEuYm9keTtcbiAgICB1c2VyU2VydmljZS5zZW5kTWFpbChwYXJhbXMsIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgbmV4dCh7XG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX1dISUxFX0NPTlRBQ1RJTkcsXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dISUxFX0NPTlRBQ1RJTkcsXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgY29kZTogNDAzXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcbiAgICAgICAgICBcInN0YXR1c1wiOiBNZXNzYWdlcy5TVEFUVVNfU1VDQ0VTUyxcbiAgICAgICAgICBcImRhdGFcIjoge1wibWVzc2FnZVwiOiBNZXNzYWdlcy5NU0dfU1VDQ0VTU19TVUJNSVRURUR9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgbmV4dCh7XG4gICAgICByZWFzb246IGUubWVzc2FnZSxcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgY29kZTogNDAzXG4gICAgfSk7XG5cbiAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcbiAgdHJ5IHtcbiAgICB2YXIgbmV3VXNlcjogVXNlck1vZGVsID0gPFVzZXJNb2RlbD5yZXEuYm9keTtcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcbiAgICAvLyBuZXdVc2VyLmlzQWN0aXZhdGVkPXRydWU7XG4gICAgdXNlclNlcnZpY2UuY3JlYXRlVXNlcihuZXdVc2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG5cbiAgICAgICAgaWYgKGVycm9yID09IE1lc3NhZ2VzLk1TR19FUlJPUl9DSEVDS19FTUFJTF9QUkVTRU5UKSB7XG4gICAgICAgICAgbmV4dCh7XG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRVhJU1RJTkdfVVNFUixcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQUNDT1VOVCxcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgICAgY29kZTogNDAzXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZXJyb3IgPT0gTWVzc2FnZXMuTVNHX0VSUk9SX0NIRUNLX01PQklMRV9QUkVTRU5UKSB7XG4gICAgICAgICAgbmV4dCh7XG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRVhJU1RJTkdfVVNFUixcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT05fTU9CSUxFX05VTUJFUixcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgICAgY29kZTogNDAzXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgbmV4dCh7XG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRVhJU1RJTkdfVVNFUixcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9VU0VSX1dJVEhfRU1BSUxfUFJFU0VOVCxcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgICAgY29kZTogNDAzXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXIgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xuICAgICAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc3VsdCk7XG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcbiAgICAgICAgICBcInN0YXR1c1wiOiBNZXNzYWdlcy5TVEFUVVNfU1VDQ0VTUyxcbiAgICAgICAgICBcImRhdGFcIjoge1xuICAgICAgICAgICAgXCJyZWFzb25cIjogTWVzc2FnZXMuTVNHX1NVQ0NFU1NfUkVHSVNUUkFUSU9OLFxuICAgICAgICAgICAgXCJmaXJzdF9uYW1lXCI6IG5ld1VzZXIuZmlyc3RfbmFtZSxcbiAgICAgICAgICAgIFwibGFzdF9uYW1lXCI6IG5ld1VzZXIubGFzdF9uYW1lLFxuICAgICAgICAgICAgXCJlbWFpbFwiOiBuZXdVc2VyLmVtYWlsLFxuICAgICAgICAgICAgXCJtb2JpbGVfbnVtYmVyXCI6IG5ld1VzZXIubW9iaWxlX251bWJlcixcbiAgICAgICAgICAgIFwiX2lkXCI6IHJlc3VsdC5faWQsXG4gICAgICAgICAgICBcInBpY3R1cmVcIjogXCJcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIG5leHQoe1xuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgIGNvZGU6IDQwM1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3Jnb3RQYXNzd29yZChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcbiAgdHJ5IHtcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcbiAgICB2YXIgcGFyYW1zID0gcmVxLmJvZHk7ICAgLy9lbWFpbFxuXG4gICAgLyogdmFyIGxpbmtxID1yZXEudXJsO1xuICAgICB2YXIgZnVsbFVybCA9IGFwcC5nZXQoXCIvYXBpL2FkZHJlc3NcIiwgIHVzZXJDb250cm9sbGVyLmdldEFkZHJlc3MpO3JlcS5wcm90b2NvbCArICc6Ly8nICsgcmVxLmdldCgnaG9zdCcpICsgcmVxLm9yaWdpbmFsVXJsO1xuICAgICBjb25zb2xlLmxvZyhmdWxsVXJsKTsqL1xuICAgIHVzZXJTZXJ2aWNlLmZvcmdvdFBhc3N3b3JkKHBhcmFtcywgKGVycm9yLCByZXN1bHQpID0+IHtcblxuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGlmIChlcnJvciA9PSBNZXNzYWdlcy5NU0dfRVJST1JfQ0hFQ0tfSU5BQ1RJVkVfQUNDT1VOVCkge1xuICAgICAgICAgIG5leHQoe1xuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfVVNFUl9OT1RfQUNUSVZBVEVELFxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0FDQ09VTlRfU1RBVFVTLFxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgICBjb2RlOiA0MDNcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChlcnJvciA9PSBNZXNzYWdlcy5NU0dfRVJST1JfQ0hFQ0tfSU5WQUxJRF9BQ0NPVU5UKSB7XG4gICAgICAgICAgbmV4dCh7XG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fVVNFUl9OT1RfRk9VTkQsXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVVNFUl9OT1RfRk9VTkQsXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgICAgIGNvZGU6IDQwM1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xuICAgICAgICAgIFwic3RhdHVzXCI6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxuICAgICAgICAgIFwiZGF0YVwiOiB7XCJtZXNzYWdlXCI6IE1lc3NhZ2VzLk1TR19TVUNDRVNTX0VNQUlMX0ZPUkdPVF9QQVNTV09SRH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICBuZXh0KHtcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICBjb2RlOiA0MDNcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbm90aWZpY2F0aW9ucyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcbiAgdHJ5IHtcbiAgICB2YXIgdXNlciA9IHJlcS51c2VyO1xuICAgIHZhciBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XG4gICAgdmFyIHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKTtcblxuICAgIC8vcmV0cmlldmUgbm90aWZpY2F0aW9uIGZvciBhIHBhcnRpY3VsYXIgdXNlclxuICAgIHZhciBwYXJhbXMgPSB7X2lkOiB1c2VyLl9pZH07XG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XG5cbiAgICB1c2VyU2VydmljZS5yZXRyaWV2ZShwYXJhbXMsIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgbmV4dChlcnJvcik7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChyZXN1bHQubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpO1xuICAgICAgICByZXMuc2VuZCh7XG4gICAgICAgICAgXCJzdGF0dXNcIjogXCJzdWNjZXNzXCIsXG4gICAgICAgICAgXCJkYXRhXCI6IHJlc3VsdFswXS5ub3RpZmljYXRpb25zLFxuICAgICAgICAgIGFjY2Vzc190b2tlbjogdG9rZW5cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBuZXh0KHtcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICBjb2RlOiA0MDNcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcHVzaE5vdGlmaWNhdGlvbnMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XG4gIHRyeSB7XG4gICAgdmFyIHVzZXIgPSByZXEudXNlcjtcbiAgICB2YXIgYm9keV9kYXRhID0gcmVxLmJvZHk7XG4gICAgdmFyIGF1dGg6IEF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcbiAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpO1xuXG4gICAgLy9yZXRyaWV2ZSBub3RpZmljYXRpb24gZm9yIGEgcGFydGljdWxhciB1c2VyXG4gICAgdmFyIHBhcmFtcyA9IHtfaWQ6IHVzZXIuX2lkfTtcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcbiAgICB2YXIgZGF0YSA9IHskcHVzaDoge25vdGlmaWNhdGlvbnM6IGJvZHlfZGF0YX19O1xuXG4gICAgdXNlclNlcnZpY2UuZmluZE9uZUFuZFVwZGF0ZShwYXJhbXMsIGRhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIG5leHQoZXJyb3IpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhciB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQodXNlcik7XG4gICAgICAgIHJlcy5zZW5kKHtcbiAgICAgICAgICBcInN0YXR1c1wiOiBcIlN1Y2Nlc3NcIixcbiAgICAgICAgICBcImRhdGFcIjogcmVzdWx0Lm5vdGlmaWNhdGlvbnMsXG5cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBuZXh0KHtcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICBjb2RlOiA0MDNcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlTm90aWZpY2F0aW9ucyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcbiAgdHJ5IHtcbiAgICB2YXIgdXNlciA9IHJlcS51c2VyO1xuICAgIHZhciBib2R5X2RhdGEgPSByZXEuYm9keTtcbiAgICB2YXIgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xuICAgIHZhciB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQodXNlcik7XG5cbiAgICB2YXIgcGFyYW1zID0ge19pZDogdXNlci5faWR9O1xuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xuICAgIHZhciBkYXRhID0ge2lzX3JlYWQ6IHRydWV9O1xuXG4gICAgdXNlclNlcnZpY2UuZmluZEFuZFVwZGF0ZU5vdGlmaWNhdGlvbihwYXJhbXMsIGRhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIG5leHQoZXJyb3IpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhciB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQodXNlcik7XG4gICAgICAgIHJlcy5zZW5kKHtcbiAgICAgICAgICBcInN0YXR1c1wiOiBcIlN1Y2Nlc3NcIixcbiAgICAgICAgICBcImRhdGFcIjogcmVzdWx0Lm5vdGlmaWNhdGlvbnMsXG5cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBuZXh0KHtcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICBjb2RlOiA0MDNcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlRGV0YWlscyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcbiAgdHJ5IHtcbiAgICB2YXIgbmV3VXNlckRhdGE6IFVzZXJNb2RlbCA9IDxVc2VyTW9kZWw+cmVxLmJvZHk7XG4gICAgdmFyIHBhcmFtcyA9IHJlcS5xdWVyeTtcbiAgICBkZWxldGUgcGFyYW1zLmFjY2Vzc190b2tlbjtcbiAgICB2YXIgdXNlciA9IHJlcS51c2VyO1xuICAgIHZhciBfaWQ6IHN0cmluZyA9IHVzZXIuX2lkO1xuXG4gICAgdmFyIGF1dGg6IEF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcbiAgICB1c2VyU2VydmljZS51cGRhdGUoX2lkLCBuZXdVc2VyRGF0YSwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBuZXh0KGVycm9yKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB1c2VyU2VydmljZS5yZXRyaWV2ZShfaWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICBuZXh0KHtcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XUk9OR19UT0tFTixcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgICAgIGNvZGU6IDQwM1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKTtcbiAgICAgICAgICAgIHJlcy5zZW5kKHtcbiAgICAgICAgICAgICAgXCJzdGF0dXNcIjogXCJzdWNjZXNzXCIsXG4gICAgICAgICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgICAgICAgXCJmaXJzdF9uYW1lXCI6IHJlc3VsdFswXS5maXJzdF9uYW1lLFxuICAgICAgICAgICAgICAgIFwibGFzdF9uYW1lXCI6IHJlc3VsdFswXS5sYXN0X25hbWUsXG4gICAgICAgICAgICAgICAgXCJlbWFpbFwiOiByZXN1bHRbMF0uZW1haWwsXG4gICAgICAgICAgICAgICAgXCJtb2JpbGVfbnVtYmVyXCI6IHJlc3VsdFswXS5tb2JpbGVfbnVtYmVyLFxuICAgICAgICAgICAgICAgIFwicGljdHVyZVwiOiByZXN1bHRbMF0ucGljdHVyZSxcbiAgICAgICAgICAgICAgICBcIl9pZFwiOiByZXN1bHRbMF0udXNlcklkLFxuICAgICAgICAgICAgICAgIFwiY3VycmVudF90aGVtZVwiOiByZXN1bHRbMF0uY3VycmVudF90aGVtZVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRva2VuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgbmV4dCh7XG4gICAgICByZWFzb246IGUubWVzc2FnZSxcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgY29kZTogNDAzXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVJlY3J1aXRlckFjY291bnREZXRhaWxzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xuICB0cnkge1xuICAgIHZhciBuZXdVc2VyRGF0YTogUmVjcnVpdGVyTW9kZWwgPSA8UmVjcnVpdGVyTW9kZWw+cmVxLmJvZHk7XG4gICAgdmFyIHVzZXIgPSByZXEudXNlcjtcbiAgICB2YXIgX2lkOiBzdHJpbmcgPSB1c2VyLl9pZDtcbiAgICB2YXIgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xuICAgIHZhciByZWNydWl0ZXJTZXJ2aWNlID0gbmV3IFJlY3J1aXRlclNlcnZpY2UoKTtcbiAgICByZWNydWl0ZXJTZXJ2aWNlLnVwZGF0ZURldGFpbHMoX2lkLCBuZXdVc2VyRGF0YSwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBuZXh0KGVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcy5zZW5kKHtcbiAgICAgICAgICAnc3RhdHVzJzogJ1N1Y2Nlc3MnXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgbmV4dCh7XG4gICAgICByZWFzb246IGUubWVzc2FnZSxcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgY29kZTogNDAzXG4gICAgfSk7XG4gIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVQcm9maWxlRmllbGQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XG4gIHRyeSB7XG4gICAgLy92YXIgbmV3VXNlckRhdGE6IFVzZXJNb2RlbCA9IDxVc2VyTW9kZWw+cmVxLmJvZHk7XG5cbiAgICB2YXIgcGFyYW1zID0gcmVxLnF1ZXJ5O1xuICAgIGRlbGV0ZSBwYXJhbXMuYWNjZXNzX3Rva2VuO1xuICAgIHZhciB1c2VyID0gcmVxLnVzZXI7XG4gICAgdmFyIF9pZDogc3RyaW5nID0gdXNlci5faWQ7XG4gICAgdmFyIGZOYW1lOiBzdHJpbmcgPSByZXEucGFyYW1zLmZuYW1lO1xuICAgIGlmIChmTmFtZSA9PSAnZ3VpZGVfdG91cicpIHtcbiAgICAgIHZhciBkYXRhID0geydndWlkZV90b3VyJzogcmVxLmJvZHl9O1xuICAgIH1cbiAgICB2YXIgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xuICAgIHVzZXJTZXJ2aWNlLnVwZGF0ZShfaWQsIGRhdGEsIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgbmV4dChlcnJvcik7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdXNlclNlcnZpY2UucmV0cmlldmUoX2lkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgbmV4dCh7XG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfVE9LRU4sXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgICAgICBjb2RlOiA0MDNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQodXNlcik7XG4gICAgICAgICAgICByZXMuc2VuZCh7XG4gICAgICAgICAgICAgIFwic3RhdHVzXCI6IFwic3VjY2Vzc1wiLFxuICAgICAgICAgICAgICBcImRhdGFcIjoge1xuICAgICAgICAgICAgICAgIFwiZmlyc3RfbmFtZVwiOiByZXN1bHRbMF0uZmlyc3RfbmFtZSxcbiAgICAgICAgICAgICAgICBcImxhc3RfbmFtZVwiOiByZXN1bHRbMF0ubGFzdF9uYW1lLFxuICAgICAgICAgICAgICAgIFwiZW1haWxcIjogcmVzdWx0WzBdLmVtYWlsLFxuICAgICAgICAgICAgICAgIFwiX2lkXCI6IHJlc3VsdFswXS51c2VySWQsXG4gICAgICAgICAgICAgICAgXCJndWlkZV90b3VyXCI6IHJlc3VsdFswXS5ndWlkZV90b3VyXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGFjY2Vzc190b2tlbjogdG9rZW5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICBuZXh0KHtcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICBjb2RlOiA0MDNcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmV0cmlldmUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XG4gIHRyeSB7XG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XG4gICAgdmFyIHBhcmFtcyA9IHJlcS5wYXJhbXMuaWQ7XG4gICAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XG4gICAgdmFyIHVzZXIgPSByZXEudXNlcjtcbiAgICB2YXIgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xuXG4gICAgdmFyIHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKTtcbiAgICAgICAgcmVzLnNlbmQoe1xuICAgICAgICAgIFwic3RhdHVzXCI6IFwic3VjY2Vzc1wiLFxuICAgICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgICBcImZpcnN0X25hbWVcIjogdXNlci5maXJzdF9uYW1lLFxuICAgICAgICAgICAgXCJsYXN0X25hbWVcIjogdXNlci5sYXN0X25hbWUsXG4gICAgICAgICAgICBcImVtYWlsXCI6IHVzZXIuZW1haWwsXG4gICAgICAgICAgICBcIm1vYmlsZV9udW1iZXJcIjogdXNlci5tb2JpbGVfbnVtYmVyLFxuICAgICAgICAgICAgXCJwaWN0dXJlXCI6IHVzZXIucGljdHVyZSxcbiAgICAgICAgICAgIFwic29jaWFsX3Byb2ZpbGVfcGljdHVyZVwiOiB1c2VyLnNvY2lhbF9wcm9maWxlX3BpY3R1cmUsXG4gICAgICAgICAgICBcIl9pZFwiOiB1c2VyLnVzZXJJZCxcbiAgICAgICAgICAgIFwiY3VycmVudF90aGVtZVwiOiB1c2VyLmN1cnJlbnRfdGhlbWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFjY2Vzc190b2tlbjogdG9rZW5cbiAgICAgICAgfSk7XG4gIH1jYXRjaCAoZSkge1xuICAgIG5leHQoe1xuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgIGNvZGU6IDQwM1xuICAgIH0pOyAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0UGFzc3dvcmQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XG4gIHRyeSB7XG4gICAgdmFyIHVzZXIgPSByZXEudXNlcjtcbiAgICB2YXIgcGFyYW1zID0gcmVxLmJvZHk7ICAgLy9uZXdfcGFzc3dvcmRcbiAgICBkZWxldGUgcGFyYW1zLmFjY2Vzc190b2tlbjtcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcbiAgICBjb25zdCBzYWx0Um91bmRzID0gMTA7XG4gICAgYmNyeXB0Lmhhc2gocmVxLmJvZHkubmV3X3Bhc3N3b3JkLCBzYWx0Um91bmRzLCAoZXJyOiBhbnksIGhhc2g6IGFueSkgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBuZXh0KHtcbiAgICAgICAgICByZWFzb246ICdFcnJvciBpbiBjcmVhdGluZyBoYXNoIHVzaW5nIGJjcnlwdCcsXG4gICAgICAgICAgbWVzc2FnZTogJ0Vycm9yIGluIGNyZWF0aW5nIGhhc2ggdXNpbmcgYmNyeXB0JyxcbiAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgICBjb2RlOiA0MDNcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgdXBkYXRlRGF0YSA9IHsncGFzc3dvcmQnOiBoYXNofTtcbiAgICAgICAgdmFyIHF1ZXJ5ID0ge1wiX2lkXCI6IHVzZXIuX2lkLCBcInBhc3N3b3JkXCI6IHJlcS51c2VyLnBhc3N3b3JkfTtcbiAgICAgICAgdXNlclNlcnZpY2UuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICBuZXh0KGVycm9yKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzLnNlbmQoe1xuICAgICAgICAgICAgICAnc3RhdHVzJzogJ1N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAnZGF0YSc6IHsnbWVzc2FnZSc6ICdQYXNzd29yZCBjaGFuZ2VkIHN1Y2Nlc3NmdWxseSd9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICBuZXh0KHtcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICBjb2RlOiA0MDNcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2hhbmdlUGFzc3dvcmQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XG4gIHRyeSB7XG4gICAgdmFyIHVzZXIgPSByZXEudXNlcjtcbiAgICB2YXIgcGFyYW1zID0gcmVxLnF1ZXJ5O1xuICAgIGRlbGV0ZSBwYXJhbXMuYWNjZXNzX3Rva2VuO1xuICAgIHZhciBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XG4gICAgYmNyeXB0LmNvbXBhcmUocmVxLmJvZHkuY3VycmVudF9wYXNzd29yZCwgdXNlci5wYXNzd29yZCwgKGVycjogYW55LCBpc1NhbWU6IGFueSkgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBuZXh0KHtcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9SRUdJU1RSQVRJT05fU1RBVFVTLFxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQ0FORElEQVRFX0FDQ09VTlQsXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgY29kZTogNDAzXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGlzU2FtZSkge1xuXG4gICAgICAgICAgaWYgKHJlcS5ib2R5LmN1cnJlbnRfcGFzc3dvcmQgPT09IHJlcS5ib2R5Lm5ld19wYXNzd29yZCkge1xuICAgICAgICAgICAgbmV4dCh7XG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfU0FNRV9ORVdfUEFTU1dPUkQsXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgICAgICBjb2RlOiA0MDNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHZhciBuZXdfcGFzc3dvcmQ6IGFueTtcbiAgICAgICAgICAgIGNvbnN0IHNhbHRSb3VuZHMgPSAxMDtcbiAgICAgICAgICAgIGJjcnlwdC5oYXNoKHJlcS5ib2R5Lm5ld19wYXNzd29yZCwgc2FsdFJvdW5kcywgKGVycjogYW55LCBoYXNoOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgLy8gU3RvcmUgaGFzaCBpbiB5b3VyIHBhc3N3b3JkIERCLlxuICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgbmV4dCh7XG4gICAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9SRUdJU1RSQVRJT05fU1RBVFVTLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0JDUllQVF9DUkVBVElPTixcbiAgICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgICAgICAgICAgY29kZTogNDAzXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3X3Bhc3N3b3JkID0gaGFzaDtcbiAgICAgICAgICAgICAgICB2YXIgcXVlcnkgPSB7XCJfaWRcIjogcmVxLnVzZXIuX2lkfTtcbiAgICAgICAgICAgICAgICB2YXIgdXBkYXRlRGF0YSA9IHtcInBhc3N3b3JkXCI6IG5ld19wYXNzd29yZH07XG4gICAgICAgICAgICAgICAgdXNlclNlcnZpY2UuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dChlcnJvcik7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNlbmQoe1xuICAgICAgICAgICAgICAgICAgICAgIFwic3RhdHVzXCI6IFwiU3VjY2Vzc1wiLFxuICAgICAgICAgICAgICAgICAgICAgIFwiZGF0YVwiOiB7XCJtZXNzYWdlXCI6IE1lc3NhZ2VzLk1TR19TVUNDRVNTX1BBU1NXT1JEX0NIQU5HRX0sXG4gICAgICAgICAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5leHQoe1xuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfQ1VSUkVOVF9QQVNTV09SRCxcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgICAgY29kZTogNDAzXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBjYXRjaCAoZSkge1xuICAgIG5leHQoe1xuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgIGNvZGU6IDQwM1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGFuZ2VNb2JpbGVOdW1iZXIocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XG5cbiAgdHJ5IHtcbiAgICB2YXIgdXNlciA9IHJlcS51c2VyO1xuXG4gICAgdmFyIHBhcmFtcyA9IHJlcS5ib2R5O1xuICAgIHZhciBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XG5cbiAgICB2YXIgcXVlcnkgPSB7XCJtb2JpbGVfbnVtYmVyXCI6IHBhcmFtcy5uZXdfbW9iaWxlX251bWJlciwgXCJpc0FjdGl2YXRlZFwiOiB0cnVlfTtcblxuICAgIHVzZXJTZXJ2aWNlLnJldHJpZXZlKHF1ZXJ5LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIG5leHQoZXJyb3IpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgbmV4dCh7XG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0VYSVNUSU5HX1VTRVIsXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTl9NT0JJTEVfTlVNQkVSLFxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgIGNvZGU6IDQwM1xuICAgICAgICB9KTtcblxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhciBEYXRhID0ge1xuICAgICAgICAgIGN1cnJlbnRfbW9iaWxlX251bWJlcjogdXNlci5tb2JpbGVfbnVtYmVyLFxuICAgICAgICAgIF9pZDogdXNlci5faWQsXG4gICAgICAgICAgbmV3X21vYmlsZV9udW1iZXI6IHBhcmFtcy5uZXdfbW9iaWxlX251bWJlclxuICAgICAgICB9O1xuICAgICAgICB1c2VyU2VydmljZS5jaGFuZ2VNb2JpbGVOdW1iZXIoRGF0YSwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIG5leHQoe1xuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fV0hJTEVfQ09OVEFDVElORyxcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dISUxFX0NPTlRBQ1RJTkcsXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgICAgICBjb2RlOiA0MDNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcbiAgICAgICAgICAgICAgXCJzdGF0dXNcIjogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXG4gICAgICAgICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgICAgICAgXCJtZXNzYWdlXCI6IE1lc3NhZ2VzLk1TR19TVUNDRVNTX09UUF9DSEFOR0VfTU9CSUxFX05VTUJFUlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgbmV4dCh7XG4gICAgICByZWFzb246IGUubWVzc2FnZSxcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgY29kZTogNDAzXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNoYW5nZUVtYWlsSWQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XG5cbiAgdHJ5IHtcbiAgICB2YXIgdXNlciA9IHJlcS51c2VyO1xuICAgIHZhciBwYXJhbXMgPSByZXEucXVlcnk7XG4gICAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XG4gICAgdmFyIGF1dGg6IEF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcblxuXG4gICAgdmFyIHF1ZXJ5ID0ge1wiZW1haWxcIjogcmVxLmJvZHkubmV3X2VtYWlsfTtcblxuICAgIHVzZXJTZXJ2aWNlLnJldHJpZXZlKHF1ZXJ5LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuXG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgbmV4dChlcnJvcik7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChyZXN1bHQubGVuZ3RoID4gMCAmJiByZXN1bHRbMF0uaXNBY3RpdmF0ZWQgPT09IHRydWUpIHtcbiAgICAgICAgbmV4dCh7XG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0VYSVNUSU5HX1VTRVIsXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTixcbiAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgICBjb2RlOiA0MDNcbiAgICAgICAgfSk7XG5cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHJlc3VsdC5sZW5ndGggPiAwICYmIHJlc3VsdFswXS5pc0FjdGl2YXRlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgbmV4dCh7XG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0VYSVNUSU5HX1VTRVIsXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0FDQ09VTlRfU1RBVFVTLFxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgIGNvZGU6IDQwM1xuICAgICAgICB9KTtcblxuICAgICAgfVxuXG4gICAgICBlbHNlIHtcblxuICAgICAgICB2YXIgZW1haWxJZCA9IHtcbiAgICAgICAgICBjdXJyZW50X2VtYWlsOiByZXEuYm9keS5jdXJyZW50X2VtYWlsLFxuICAgICAgICAgIG5ld19lbWFpbDogcmVxLmJvZHkubmV3X2VtYWlsXG4gICAgICAgIH07XG5cbiAgICAgICAgdXNlclNlcnZpY2UuU2VuZENoYW5nZU1haWxWZXJpZmljYXRpb24oZW1haWxJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChlcnJvciA9PT0gTWVzc2FnZXMuTVNHX0VSUk9SX0NIRUNLX0VNQUlMX0FDQ09VTlQpIHtcbiAgICAgICAgICAgICAgbmV4dCh7XG4gICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0VYSVNUSU5HX1VTRVIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNQUlMX0FDVElWRV9OT1csXG4gICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgICAgICAgY29kZTogNDAzXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIG5leHQoe1xuICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9XSElMRV9DT05UQUNUSU5HLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XSElMRV9DT05UQUNUSU5HLFxuICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgICAgICAgIGNvZGU6IDQwM1xuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcbiAgICAgICAgICAgICAgXCJzdGF0dXNcIjogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXG4gICAgICAgICAgICAgIFwiZGF0YVwiOiB7XCJtZXNzYWdlXCI6IE1lc3NhZ2VzLk1TR19TVUNDRVNTX0VNQUlMX0NIQU5HRV9FTUFJTElEfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgfVxuICAgIH0pO1xuXG5cbiAgfVxuXG4gIGNhdGNoIChlKSB7XG4gICAgbmV4dCh7XG4gICAgICByZWFzb246IGUubWVzc2FnZSxcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgY29kZTogNDAzXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZlcmlmeU1vYmlsZU51bWJlcihyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcbiAgdHJ5IHtcblxuICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XG5cbiAgICB2YXIgcGFyYW1zID0gcmVxLmJvZHk7IC8vb3RwXG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XG4gICAgdmFyIHF1ZXJ5ID0ge1wiX2lkXCI6IHVzZXIuX2lkfTtcbiAgICB2YXIgdXBkYXRlRGF0YSA9IHtcIm1vYmlsZV9udW1iZXJcIjogdXNlci50ZW1wX21vYmlsZSwgXCJ0ZW1wX21vYmlsZVwiOiB1c2VyLm1vYmlsZV9udW1iZXJ9O1xuICAgIGlmICh1c2VyLm90cCA9PT0gcGFyYW1zLm90cCkge1xuICAgICAgdXNlclNlcnZpY2UuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIG5leHQoZXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHJlcy5zZW5kKHtcbiAgICAgICAgICAgIFwic3RhdHVzXCI6IFwiU3VjY2Vzc1wiLFxuICAgICAgICAgICAgXCJkYXRhXCI6IHtcIm1lc3NhZ2VcIjogXCJVc2VyIEFjY291bnQgdmVyaWZpZWQgc3VjY2Vzc2Z1bGx5XCJ9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG5leHQoe1xuICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcbiAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dST05HX09UUCxcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgIGNvZGU6IDQwM1xuICAgICAgfSk7XG4gICAgfVxuXG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICBuZXh0KHtcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICBjb2RlOiA0MDNcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdmVyaWZ5T3RwKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xuICB0cnkge1xuXG4gICAgbGV0IHVzZXIgPSByZXEudXNlcjtcblxuICAgIHZhciBwYXJhbXMgPSByZXEuYm9keTsgLy9PVFBcbiAgICAvLyAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XG4gICAgbGV0IG1haWxDaGltcE1haWxlclNlcnZpY2UgPSBuZXcgTWFpbENoaW1wTWFpbGVyU2VydmljZSgpO1xuXG4gICAgdmFyIHF1ZXJ5ID0ge1wiX2lkXCI6IHVzZXIuX2lkLCBcImlzQWN0aXZhdGVkXCI6IGZhbHNlfTtcbiAgICB2YXIgdXBkYXRlRGF0YSA9IHtcImlzQWN0aXZhdGVkXCI6IHRydWV9O1xuICAgIGlmICh1c2VyLm90cCA9PT0gcGFyYW1zLm90cCkge1xuICAgICAgdXNlclNlcnZpY2UuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIG5leHQoZXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHJlcy5zZW5kKHtcbiAgICAgICAgICAgIFwic3RhdHVzXCI6IFwiU3VjY2Vzc1wiLFxuICAgICAgICAgICAgXCJkYXRhXCI6IHtcIm1lc3NhZ2VcIjogXCJVc2VyIEFjY291bnQgdmVyaWZpZWQgc3VjY2Vzc2Z1bGx5XCJ9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbWFpbENoaW1wTWFpbGVyU2VydmljZS5vbkNhbmRpZGF0ZVNpZ25TdWNjZXNzKHJlc3VsdCk7XG5cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbmV4dCh7XG4gICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxuICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfT1RQLFxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgY29kZTogNDAzXG4gICAgICB9KTtcbiAgICB9XG5cbiAgfVxuICBjYXRjaCAoZSkge1xuICAgIG5leHQoe1xuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgIGNvZGU6IDQwM1xuICAgIH0pO1xuICB9XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHZlcmlmeUFjY291bnQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XG4gIHRyeSB7XG5cbiAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xuICAgIHZhciBwYXJhbXMgPSByZXEucXVlcnk7XG4gICAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XG5cbiAgICB2YXIgcXVlcnkgPSB7XCJfaWRcIjogdXNlci5faWQsIFwiaXNBY3RpdmF0ZWRcIjogZmFsc2V9O1xuICAgIHZhciB1cGRhdGVEYXRhID0ge1wiaXNBY3RpdmF0ZWRcIjogdHJ1ZX07XG4gICAgdXNlclNlcnZpY2UuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgbmV4dChlcnJvcik7XG4gICAgICB9XG4gICAgICBlbHNlIHtcblxuICAgICAgICByZXMuc2VuZCh7XG4gICAgICAgICAgXCJzdGF0dXNcIjogXCJTdWNjZXNzXCIsXG4gICAgICAgICAgXCJkYXRhXCI6IHtcIm1lc3NhZ2VcIjogXCJVc2VyIEFjY291bnQgdmVyaWZpZWQgc3VjY2Vzc2Z1bGx5XCJ9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgfSk7XG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICBuZXh0KHtcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICBjb2RlOiA0MDNcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdmVyaWZ5Q2hhbmdlZEVtYWlsSWQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XG4gIHRyeSB7XG4gICAgdmFyIHVzZXIgPSByZXEudXNlcjtcbiAgICB2YXIgcGFyYW1zID0gcmVxLnF1ZXJ5O1xuICAgIGRlbGV0ZSBwYXJhbXMuYWNjZXNzX3Rva2VuO1xuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xuXG4gICAgdmFyIHF1ZXJ5ID0ge1wiX2lkXCI6IHVzZXIuX2lkfTtcbiAgICB2YXIgdXBkYXRlRGF0YSA9IHtcImVtYWlsXCI6IHVzZXIudGVtcF9lbWFpbCwgXCJ0ZW1wX2VtYWlsXCI6IHVzZXIuZW1haWx9O1xuICAgIHVzZXJTZXJ2aWNlLmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZURhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIG5leHQoZXJyb3IpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG5cbiAgICAgICAgcmVzLnNlbmQoe1xuICAgICAgICAgIFwic3RhdHVzXCI6IFwiU3VjY2Vzc1wiLFxuICAgICAgICAgIFwiZGF0YVwiOiB7XCJtZXNzYWdlXCI6IFwiVXNlciBBY2NvdW50IHZlcmlmaWVkIHN1Y2Nlc3NmdWxseVwifVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgIH0pO1xuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgbmV4dCh7XG4gICAgICByZWFzb246IGUubWVzc2FnZSxcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgY29kZTogNDAzXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEluZHVzdHJ5KHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xuICBfX2Rpcm5hbWUgPSAnLi8nO1xuICB2YXIgZmlsZXBhdGggPSBcImluZHVzdHJ5Lmpzb25cIjtcbiAgdHJ5IHtcbiAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgsIHtyb290OiBfX2Rpcm5hbWV9KTtcbiAgfVxuICBjYXRjaCAoZSkge1xuICAgIG5leHQoe1xuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgIGNvZGU6IDQwM1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21wYW55U2l6ZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcbiAgX19kaXJuYW1lID0gJy4vJztcbiAgdmFyIGZpbGVwYXRoID0gXCJjb21wYW55LXNpemUuanNvblwiO1xuICB0cnkge1xuICAgIHJlcy5zZW5kRmlsZShmaWxlcGF0aCwge3Jvb3Q6IF9fZGlybmFtZX0pO1xuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgbmV4dCh7XG4gICAgICByZWFzb246IGUubWVzc2FnZSxcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgY29kZTogNDAzXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFkZHJlc3MocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XG4gIF9fZGlybmFtZSA9ICcuLyc7XG4gIHZhciBmaWxlcGF0aCA9IFwiYWRkcmVzcy5qc29uXCI7XG4gIHRyeSB7XG4gICAgcmVzLnNlbmRGaWxlKGZpbGVwYXRoLCB7cm9vdDogX19kaXJuYW1lfSk7XG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICBuZXh0KHtcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICBjb2RlOiA0MDNcbiAgICB9KTtcbiAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlYWxvY2F0aW9uKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xuXG4gIF9fZGlybmFtZSA9ICcuLyc7XG4gIHZhciBmaWxlcGF0aCA9IFwicmVhbG9jYXRpb24uanNvblwiO1xuICB0cnkge1xuICAgIHJlcy5zZW5kRmlsZShmaWxlcGF0aCwge3Jvb3Q6IF9fZGlybmFtZX0pO1xuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgbmV4dCh7XG4gICAgICByZWFzb246IGUubWVzc2FnZSxcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgY29kZTogNDAzXG4gICAgfSk7XG4gIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRFZHVjYXRpb24ocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XG4gIF9fZGlybmFtZSA9ICcuLyc7XG4gIHZhciBmaWxlcGF0aCA9IFwiZWR1Y2F0aW9uLmpzb25cIjtcbiAgdHJ5IHtcbiAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgsIHtyb290OiBfX2Rpcm5hbWV9KTtcbiAgfVxuICBjYXRjaCAoZSkge1xuICAgIG5leHQoe1xuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgIGNvZGU6IDQwM1xuICAgIH0pO1xuICB9XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENsb3NlSm9iUmVhc29ucyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcbiAgX19kaXJuYW1lID0gJy4vJztcbiAgdmFyIGZpbGVwYXRoID0gXCJjbG9zZUpvYi5qc29uXCI7XG4gIHRyeSB7XG4gICAgcmVzLnNlbmRGaWxlKGZpbGVwYXRoLCB7cm9vdDogX19kaXJuYW1lfSk7XG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICBuZXh0KHtcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICBjb2RlOiA0MDNcbiAgICB9KTtcbiAgfVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFeHBlcmllbmNlKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xuICBfX2Rpcm5hbWUgPSAnLi8nO1xuICB2YXIgZmlsZXBhdGggPSBcImV4cGVyaWVuY2VMaXN0Lmpzb25cIjtcbiAgdHJ5IHtcbiAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgsIHtyb290OiBfX2Rpcm5hbWV9KTtcbiAgfVxuICBjYXRjaCAoZSkge1xuICAgIG5leHQoe1xuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgIGNvZGU6IDQwM1xuICAgIH0pO1xuICB9XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3VycmVudFNhbGFyeShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcbiAgX19kaXJuYW1lID0gJy4vJztcbiAgdmFyIGZpbGVwYXRoID0gXCJjdXJyZW50c2FsYXJ5TGlzdC5qc29uXCI7XG4gIHRyeSB7XG4gICAgcmVzLnNlbmRGaWxlKGZpbGVwYXRoLCB7cm9vdDogX19kaXJuYW1lfSk7XG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICBuZXh0KHtcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICBjb2RlOiA0MDNcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Tm90aWNlUGVyaW9kKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xuICBfX2Rpcm5hbWUgPSAnLi8nO1xuICB2YXIgZmlsZXBhdGggPSBcIm5vdGljZXBlcmlvZExpc3QuanNvblwiO1xuICB0cnkge1xuICAgIHJlcy5zZW5kRmlsZShmaWxlcGF0aCwge3Jvb3Q6IF9fZGlybmFtZX0pO1xuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgbmV4dCh7XG4gICAgICByZWFzb246IGUubWVzc2FnZSxcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgY29kZTogNDAzXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEluZHVzdHJ5RXhwb3N1cmUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XG4gIF9fZGlybmFtZSA9ICcuLyc7XG4gIHZhciBmaWxlcGF0aCA9IFwiaW5kdXN0cnlleHBvc3VyZUxpc3QuanNvblwiO1xuICB0cnkge1xuICAgIHJlcy5zZW5kRmlsZShmaWxlcGF0aCwge3Jvb3Q6IF9fZGlybmFtZX0pO1xuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgbmV4dCh7XG4gICAgICByZWFzb246IGUubWVzc2FnZSxcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgY29kZTogNDAzXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNlYXJjaGVkQ2FuZGlkYXRlKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xuICBfX2Rpcm5hbWUgPSAnLi8nO1xuICB2YXIgZmlsZXBhdGggPSBcImNhbmRpZGF0ZS5qc29uXCI7XG4gIHRyeSB7XG4gICAgcmVzLnNlbmRGaWxlKGZpbGVwYXRoLCB7cm9vdDogX19kaXJuYW1lfSk7XG4gIH1cbiAgY2F0Y2ggKGUpIHtcbiAgICBuZXh0KHtcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICBjb2RlOiA0MDNcbiAgICB9KTtcbiAgfVxuXG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvdW50cmllcyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcbiAgX19kaXJuYW1lID0gJy4vJztcbiAgdmFyIGZpbGVwYXRoID0gXCJjb3VudHJ5Lmpzb25cIjtcbiAgdHJ5IHtcbiAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgsIHtyb290OiBfX2Rpcm5hbWV9KTtcbiAgfVxuICBjYXRjaCAoZSkge1xuICAgIG5leHQoe1xuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgIGNvZGU6IDQwM1xuICAgIH0pO1xuICB9XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5kaWFTdGF0ZXMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XG4gIF9fZGlybmFtZSA9ICcuLyc7XG4gIHZhciBmaWxlcGF0aCA9IFwiaW5kaWFTdGF0ZXMuanNvblwiO1xuICB0cnkge1xuICAgIHJlcy5zZW5kRmlsZShmaWxlcGF0aCwge3Jvb3Q6IF9fZGlybmFtZX0pO1xuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgbmV4dCh7XG4gICAgICByZWFzb246IGUubWVzc2FnZSxcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgY29kZTogNDAzXG4gICAgfSk7XG4gIH1cbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RnVuY3Rpb24ocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XG4gIF9fZGlybmFtZSA9ICcuLyc7XG4gIHZhciBmaWxlcGF0aCA9IFwiZnVuY3Rpb24uanNvblwiO1xuICB0cnkge1xuICAgIHJlcy5zZW5kRmlsZShmaWxlcGF0aCwge3Jvb3Q6IF9fZGlybmFtZX0pO1xuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgbmV4dCh7XG4gICAgICByZWFzb246IGUubWVzc2FnZSxcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgY29kZTogNDAzXG4gICAgfSk7XG4gIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRSb2xlKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xuICBfX2Rpcm5hbWUgPSAnLi8nO1xuICB2YXIgZmlsZXBhdGggPSBcInJvbGVzLmpzb25cIjtcbiAgdHJ5IHtcbiAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgsIHtyb290OiBfX2Rpcm5hbWV9KTtcbiAgfVxuICBjYXRjaCAoZSkge1xuICAgIG5leHQoe1xuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgIGNvZGU6IDQwM1xuICAgIH0pO1xuICB9XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJvZmljaWVuY3kocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XG4gIF9fZGlybmFtZSA9ICcuLyc7XG4gIHZhciBmaWxlcGF0aCA9IFwicHJvZmljaWVuY3kuanNvblwiO1xuICB0cnkge1xuICAgIHJlcy5zZW5kRmlsZShmaWxlcGF0aCwge3Jvb3Q6IF9fZGlybmFtZX0pO1xuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgbmV4dCh7XG4gICAgICByZWFzb246IGUubWVzc2FnZSxcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgY29kZTogNDAzXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERvbWFpbihyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcbiAgX19kaXJuYW1lID0gJy4vJztcbiAgdmFyIGZpbGVwYXRoID0gXCJkb21haW4uanNvblwiO1xuICB0cnkge1xuICAgIHJlcy5zZW5kRmlsZShmaWxlcGF0aCwge3Jvb3Q6IF9fZGlybmFtZX0pO1xuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgbmV4dCh7XG4gICAgICByZWFzb246IGUubWVzc2FnZSxcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgY29kZTogNDAzXG4gICAgfSk7XG4gIH1cbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2FwYWJpbGl0eShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcbiAgX19kaXJuYW1lID0gJy4vJztcbiAgdmFyIGZpbGVwYXRoID0gXCJjYXBhYmlsaXR5Lmpzb25cIjtcbiAgdHJ5IHtcbiAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgsIHtyb290OiBfX2Rpcm5hbWV9KTtcbiAgfVxuICBjYXRjaCAoZSkge1xuICAgIG5leHQoe1xuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgIGNvZGU6IDQwM1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21wbGV4aXR5KHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xuICBfX2Rpcm5hbWUgPSAnLi8nO1xuICB2YXIgZmlsZXBhdGggPSBcImNvbXBsZXhpdHkuanNvblwiO1xuICB0cnkge1xuICAgIHJlcy5zZW5kRmlsZShmaWxlcGF0aCwge3Jvb3Q6IF9fZGlybmFtZX0pO1xuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgbmV4dCh7XG4gICAgICByZWFzb246IGUubWVzc2FnZSxcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgY29kZTogNDAzXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZibG9naW4ocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XG4gIHRyeSB7XG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XG4gICAgdmFyIHBhcmFtcyA9IHJlcS51c2VyO1xuICAgIHZhciBhdXRoID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xuICAgIHVzZXJTZXJ2aWNlLnJldHJpZXZlKHBhcmFtcywgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBuZXh0KGVycm9yKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHJlc3VsdC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQocmVzdWx0WzBdKTtcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xuICAgICAgICAgIFwic3RhdHVzXCI6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxuICAgICAgICAgIFwiaXNTb2NpYWxMb2dpblwiOiB0cnVlLFxuICAgICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgICBcImZpcnN0X25hbWVcIjogcmVzdWx0WzBdLmZpcnN0X25hbWUsXG4gICAgICAgICAgICBcImxhc3RfbmFtZVwiOiByZXN1bHRbMF0ubGFzdF9uYW1lLFxuICAgICAgICAgICAgXCJlbWFpbFwiOiByZXN1bHRbMF0uZW1haWwsXG4gICAgICAgICAgICBcIm1vYmlsZV9udW1iZXJcIjogcmVzdWx0WzBdLm1vYmlsZV9udW1iZXIsXG4gICAgICAgICAgICBcInBpY3R1cmVcIjogcmVzdWx0WzBdLnBpY3R1cmUsXG4gICAgICAgICAgICBcIl9pZFwiOiByZXN1bHRbMF0uX2lkLFxuICAgICAgICAgICAgXCJjdXJyZW50X3RoZW1lXCI6IHJlc3VsdFswXS5jdXJyZW50X3RoZW1lXG4gICAgICAgICAgfSxcbiAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRva2VuXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIG5leHQoe1xuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9JTlZBTElEX0NSRURFTlRJQUxTLFxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgIGNvZGU6IDQwM1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBjYXRjaCAoZSkge1xuICAgIG5leHQoe1xuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgIGNvZGU6IDQwM1xuICAgIH0pO1xuXG4gIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBnb29nbGVsb2dpbihyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcbiAgdHJ5IHtcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcbiAgICB2YXIgcGFyYW1zID0gcmVxLnVzZXI7XG4gICAgdmFyIGF1dGggPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XG4gICAgdXNlclNlcnZpY2UucmV0cmlldmUocGFyYW1zLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIG5leHQoZXJyb3IpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZChyZXN1bHRbMF0pO1xuICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XG4gICAgICAgICAgXCJzdGF0dXNcIjogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXG4gICAgICAgICAgXCJpc1NvY2lhbExvZ2luXCI6IHRydWUsXG4gICAgICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgICAgIFwiZmlyc3RfbmFtZVwiOiByZXN1bHRbMF0uZmlyc3RfbmFtZSxcbiAgICAgICAgICAgIFwibGFzdF9uYW1lXCI6IHJlc3VsdFswXS5sYXN0X25hbWUsXG4gICAgICAgICAgICBcImVtYWlsXCI6IHJlc3VsdFswXS5lbWFpbCxcbiAgICAgICAgICAgIFwibW9iaWxlX251bWJlclwiOiByZXN1bHRbMF0ubW9iaWxlX251bWJlcixcbiAgICAgICAgICAgIFwic29jaWFsX3Byb2ZpbGVfcGljdHVyZVwiOiByZXN1bHRbMF0uc29jaWFsX3Byb2ZpbGVfcGljdHVyZSxcbiAgICAgICAgICAgIFwiY3VycmVudF90aGVtZVwiOiByZXN1bHRbMF0uY3VycmVudF90aGVtZSxcbiAgICAgICAgICAgIFwiX2lkXCI6IHJlc3VsdFswXS5faWRcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFjY2Vzc190b2tlbjogdG9rZW5cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgbmV4dCh7XG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0lOVkFMSURfQ1JFREVOVElBTFMsXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgY29kZTogNDAzXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGNhdGNoIChlKSB7XG4gICAgbmV4dCh7XG4gICAgICByZWFzb246IGUubWVzc2FnZSxcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgY29kZTogNDAzXG4gICAgfSk7XG5cbiAgfVxufVxuLypleHBvcnQgZnVuY3Rpb24gZ2V0R29vZ2xlVG9rZW4ocmVxIDogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xuIHZhciB0b2tlbiA9IEpTT04uc3RyaW5naWZ5KHJlcS5ib2R5LnRva2VuKTtcblxuIHZhciB1cmwgPSAnaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vb2F1dGgyL3YzL3Rva2VuaW5mbz9pZF90b2tlbj0nK3Rva2VuO1xuIGNvbnNvbGUubG9nKCd1cmwgOiAnK3Rva2VuKTtcbiByZXF1ZXN0KHVybCwgZnVuY3Rpb24oIGVycm9yOmFueSAsIHJlc3BvbnNlOmFueSAsIGJvZHk6YW55ICkge1xuIGlmKGVycm9yKXtcbiBjb25zb2xlLmxvZygnZXJyb3IgOicrZXJyb3IpO1xuIC8vcmVzLnNlbmQoZXJyb3IpO1xuIH1cbiBlbHNlIGlmIChib2R5KSB7XG4gY29uc29sZS5sb2coJ2JvZHkgOicrSlNPTi5zdHJpbmdpZnkoYm9keSkpO1xuIC8vcmVzLnNlbmQoYm9keSk7XG4gfVxuIH0pO1xuIC8vIHJlcy5zZW5kKHRva2VuKTtcbiB9Ki9cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVBpY3R1cmUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XG4gIF9fZGlybmFtZSA9ICdzcmMvc2VydmVyL2FwcC9mcmFtZXdvcmsvcHVibGljL3Byb2ZpbGVpbWFnZSc7XG4gIHZhciBmb3JtID0gbmV3IG11bHRpcGFydHkuRm9ybSh7dXBsb2FkRGlyOiBfX2Rpcm5hbWV9KTtcbiAgZm9ybS5wYXJzZShyZXEsIChlcnI6IEVycm9yLCBmaWVsZHM6IGFueSwgZmlsZXM6IGFueSkgPT4ge1xuICAgIGlmIChlcnIpIHtcbiAgICAgIG5leHQoe1xuICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRElSRUNUT1JZX05PVF9GT1VORCxcbiAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0RJUkVDVE9SWV9OT1RfRk9VTkQsXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICBjb2RlOiA0MDNcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcGF0aCA9IEpTT04uc3RyaW5naWZ5KGZpbGVzLmZpbGVbMF0ucGF0aCk7XG4gICAgICB2YXIgaW1hZ2VfcGF0aCA9IGZpbGVzLmZpbGVbMF0ucGF0aDtcbiAgICAgIHZhciBvcmlnaW5hbEZpbGVuYW1lID0gSlNPTi5zdHJpbmdpZnkoaW1hZ2VfcGF0aC5zdWJzdHIoZmlsZXMuZmlsZVswXS5wYXRoLmxhc3RJbmRleE9mKCcvJykgKyAxKSk7XG4gICAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcblxuICAgICAgdXNlclNlcnZpY2UuVXBsb2FkSW1hZ2UocGF0aCwgb3JpZ2luYWxGaWxlbmFtZSwgZnVuY3Rpb24gKGVycjogYW55LCB0ZW1wYXRoOiBhbnkpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIG5leHQoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB2YXIgbXlwYXRoID0gdGVtcGF0aDtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgdXNlciA9IHJlcS51c2VyO1xuICAgICAgICAgICAgdmFyIHF1ZXJ5ID0ge1wiX2lkXCI6IHVzZXIuX2lkfTtcblxuICAgICAgICAgICAgdXNlclNlcnZpY2UuZmluZEJ5SWQodXNlci5faWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIG5leHQoZXJyb3IpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghcmVzdWx0LmlzQ2FuZGlkYXRlKSB7XG4gICAgICAgICAgICAgICAgICBsZXQgcmVjcnVpdGVyU2VydmljZTogUmVjcnVpdGVyU2VydmljZSA9IG5ldyBSZWNydWl0ZXJTZXJ2aWNlKCk7XG4gICAgICAgICAgICAgICAgICBsZXQgcXVlcnkxID0ge1widXNlcklkXCI6IHJlc3VsdC5faWR9O1xuICAgICAgICAgICAgICAgICAgcmVjcnVpdGVyU2VydmljZS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5MSwge2NvbXBhbnlfbG9nbzogbXlwYXRofSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzcG9uc2UxKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgIG5leHQoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIHVzZXJTZXJ2aWNlLmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHtwaWN0dXJlOiBteXBhdGh9LCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5leHQoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe2FjY2Vzc190b2tlbjogdG9rZW4sIGRhdGE6IHJlc3BvbnNlfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgdXNlclNlcnZpY2UuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwge3BpY3R1cmU6IG15cGF0aH0sIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgIG5leHQoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZChyZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHthY2Nlc3NfdG9rZW46IHRva2VuLCBkYXRhOiByZXNwb25zZX0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIG5leHQoe1xuICAgICAgICAgICAgICByZWFzb246IGUubWVzc2FnZSxcbiAgICAgICAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgICAgICAgY29kZTogNDAzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICB9KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQ29tcGFueURldGFpbHMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XG5cbiAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XG4gIHZhciB1c2VyID0gcmVxLnVzZXI7XG4gIHZhciBxdWVyeSA9IHtcIl9pZFwiOiB1c2VyLl9pZH07XG4gIC8qdXNlclNlcnZpY2UuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwge3BpY3R1cmU6IG15cGF0aH0sIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgaWYgKGVycm9yKSB7XG4gICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZXJyb3J9KTtcbiAgIH1cbiAgIGVsc2V7XG4gICB2YXIgYXV0aDpBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XG4gICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc3VsdCk7XG4gICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7YWNjZXNzX3Rva2VuOiB0b2tlbiwgZGF0YTogcmVzdWx0fSk7XG4gICB9XG4gICB9KTsqL1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBsb2FkZG9jdW1lbnRzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xuICBfX2Rpcm5hbWUgPSAnc3JjL3NlcnZlci9hcHAvZnJhbWV3b3JrL3B1YmxpYy91cGxvYWRlZC1kb2N1bWVudCc7XG5cbiAgdmFyIGZvcm0gPSBuZXcgbXVsdGlwYXJ0eS5Gb3JtKHt1cGxvYWREaXI6IF9fZGlybmFtZX0pO1xuICBmb3JtLnBhcnNlKHJlcSwgKGVycjogRXJyb3IsIGZpZWxkczogYW55LCBmaWxlczogYW55KSA9PiB7XG4gICAgaWYgKGVycikge1xuICAgICAgbmV4dCh7XG4gICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9ESVJFQ1RPUllfTk9UX0ZPVU5ELFxuICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRElSRUNUT1JZX05PVF9GT1VORCxcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgIGNvZGU6IDQwM1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBwYXRoID0gSlNPTi5zdHJpbmdpZnkoZmlsZXMuZmlsZVswXS5wYXRoKTtcbiAgICAgIHZhciBkb2N1bWVudF9wYXRoID0gZmlsZXMuZmlsZVswXS5wYXRoO1xuICAgICAgdmFyIG9yaWdpbmFsRmlsZW5hbWUgPSBKU09OLnN0cmluZ2lmeShkb2N1bWVudF9wYXRoLnN1YnN0cihmaWxlcy5maWxlWzBdLnBhdGgubGFzdEluZGV4T2YoJy8nKSArIDEpKTtcblxuICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xuICAgICAgICBcInN0YXR1c1wiOiBNZXNzYWdlcy5TVEFUVVNfU1VDQ0VTUyxcbiAgICAgICAgXCJkYXRhXCI6IHtcbiAgICAgICAgICBcImRvY3VtZW50XCI6IGRvY3VtZW50X3BhdGhcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8qICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XG4gICAgICAgdXNlclNlcnZpY2UuVXBsb2FkRG9jdW1lbnRzKHBhdGgsIG9yaWdpbmFsRmlsZW5hbWUsIGZ1bmN0aW9uIChlcnI6YW55LCB0ZW1wYXRoOmFueSkge1xuICAgICAgIGlmIChlcnIpIHtcbiAgICAgICBjb25zb2xlLmxvZyhcIkVyciBtZXNzYWdlIG9mIHVwbG9hZGRvY3VtZW50IGlzOlwiLGVycik7XG4gICAgICAgbmV4dChlcnIpO1xuICAgICAgIH1cbiAgICAgICBlbHNlIHtcbiAgICAgICB2YXIgbXlwYXRoID0gdGVtcGF0aDtcbiAgICAgICB0cnkge1xuICAgICAgIHZhciB1c2VyID0gcmVxLnVzZXI7XG4gICAgICAgdmFyIHF1ZXJ5ID0ge1wiX2lkXCI6IHVzZXIuX2lkfTtcbiAgICAgICB1c2VyU2VydmljZS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB7ZG9jdW1lbnQxOiBteXBhdGh9LCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZXJyb3J9KTtcbiAgICAgICB9XG4gICAgICAgZWxzZXtcbiAgICAgICB2YXIgYXV0aDpBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XG4gICAgICAgdmFyIHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZChyZXN1bHQpO1xuICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHthY2Nlc3NfdG9rZW46IHRva2VuLCBkYXRhOiByZXN1bHR9KTtcbiAgICAgICB9XG4gICAgICAgfSk7XG4gICAgICAgfVxuICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgbmV4dCh7XG4gICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXG4gICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxuICAgICAgIHN0YWNrVHJhY2U6bmV3IEVycm9yKCksXG4gICAgICAgY29kZTogNDAzXG4gICAgICAgfSk7XG4gICAgICAgfVxuICAgICAgIH1cbiAgICAgICB9KTsqL1xuICAgIH1cblxuICB9KTtcblxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9maWxlY3JlYXRlKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xuICB0cnkge1xuXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBuZXh0KHtcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICBjb2RlOiA0MDNcbiAgICB9KTtcbiAgfVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9mZXNzaW9uYWxkYXRhKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xuICB0cnkge1xuXG4gICAgdmFyIG5ld1VzZXIgPSByZXEuYm9keTtcblxuICB9IGNhdGNoIChlKSB7XG4gICAgbmV4dCh7XG4gICAgICByZWFzb246IGUubWVzc2FnZSxcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgY29kZTogNDAzXG4gICAgfSk7XG4gIH1cblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZW1wbG95bWVudGRhdGEocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XG4gIHRyeSB7XG5cbiAgICB2YXIgbmV3VXNlciA9IHJlcS5ib2R5O1xuXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBuZXh0KHtcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICBjb2RlOiA0MDNcbiAgICB9KTtcbiAgfVxuXG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNoYW5nZVRoZW1lKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xuICB0cnkge1xuICAgIHZhciB1c2VyID0gcmVxLnVzZXI7XG4gICAgdmFyIHBhcmFtcyA9IHJlcS5xdWVyeTtcbiAgICBkZWxldGUgcGFyYW1zLmFjY2Vzc190b2tlbjtcbiAgICB2YXIgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xuICAgIHZhciBxdWVyeSA9IHtcIl9pZFwiOiByZXEudXNlci5pZH07XG4gICAgdmFyIHVwZGF0ZURhdGEgPSB7XCJjdXJyZW50X3RoZW1lXCI6IHJlcS5ib2R5LmN1cnJlbnRfdGhlbWV9O1xuICAgIHVzZXJTZXJ2aWNlLmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZURhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIG5leHQoZXJyb3IpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHZhciB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQodXNlcik7XG5cbiAgICAgICAgcmVzLnNlbmQoe1xuICAgICAgICAgIGFjY2Vzc190b2tlbjogdG9rZW4sIGRhdGE6IHJlc3VsdFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIG5leHQoe1xuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgIGNvZGU6IDQwM1xuICAgIH0pO1xuICB9XG5cblxufVxuIl19
