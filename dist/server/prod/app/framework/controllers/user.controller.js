"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var multiparty = require("multiparty");
var AuthInterceptor = require("../interceptor/auth.interceptor");
var UserService = require("../services/user.service");
var RecruiterService = require("../services/recruiter.service");
var Messages = require("../shared/messages");
var CandidateService = require("../services/candidate.service");
var adminController = require("./admin.controller");
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
                            code: 403
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
                                code: 403
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
                            code: 403
                        });
                    }
                    else {
                        if (isPassSame) {
                            if (result[0].isCandidate === true) {
                                next({
                                    reason: Messages.MSG_ERROR_RSN_INVALID_REGISTRATION_STATUS,
                                    message: Messages.MSG_ERROR_VERIFY_CANDIDATE_ACCOUNT,
                                    stackTrace: new Error(),
                                    code: 403
                                });
                            }
                            else {
                                next({
                                    reason: Messages.MSG_ERROR_RSN_INVALID_REGISTRATION_STATUS,
                                    message: Messages.MSG_ERROR_VERIFY_ACCOUNT,
                                    stackTrace: new Error(),
                                    code: 403
                                });
                            }
                        }
                        else {
                            next({
                                reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                                message: Messages.MSG_ERROR_WRONG_PASSWORD,
                                stackTrace: new Error(),
                                code: 403
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvdXNlci5jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsdUNBQXlDO0FBQ3pDLGlFQUFvRTtBQUdwRSxzREFBeUQ7QUFDekQsZ0VBQW1FO0FBQ25FLDZDQUFnRDtBQUVoRCxnRUFBbUU7QUFDbkUsb0RBQXNEO0FBR3RELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUUvQixlQUFzQixHQUFvQixFQUFFLEdBQXFCLEVBQUUsSUFBUztJQUMxRSxJQUFJLENBQUM7UUFFSCxJQUFJLFdBQVcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQ3BDLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDdEIsT0FBTyxNQUFNLENBQUMsWUFBWSxDQUFDO1FBQzNCLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBQyxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07WUFDMUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDZCxDQUFDO1lBQ0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDN0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsVUFBQyxHQUFRLEVBQUUsTUFBVztvQkFDeEUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDUixJQUFJLENBQUM7NEJBQ0gsTUFBTSxFQUFFLFFBQVEsQ0FBQyx5Q0FBeUM7NEJBQzFELE9BQU8sRUFBRSxRQUFRLENB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YW1ld29yay9jb250cm9sbGVycy91c2VyLmNvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQgKiBhcyBtdWx0aXBhcnR5IGZyb20gJ211bHRpcGFydHknO1xyXG5pbXBvcnQgQXV0aEludGVyY2VwdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJjZXB0b3IvYXV0aC5pbnRlcmNlcHRvcicpO1xyXG5pbXBvcnQgU2VuZE1haWxTZXJ2aWNlID0gcmVxdWlyZSgnLi4vc2VydmljZXMvc2VuZG1haWwuc2VydmljZScpO1xyXG5pbXBvcnQgVXNlck1vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC91c2VyLm1vZGVsJyk7XHJcbmltcG9ydCBVc2VyU2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL3VzZXIuc2VydmljZScpO1xyXG5pbXBvcnQgUmVjcnVpdGVyU2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL3JlY3J1aXRlci5zZXJ2aWNlJyk7XHJcbmltcG9ydCBNZXNzYWdlcyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9tZXNzYWdlcycpO1xyXG5pbXBvcnQgUmVzcG9uc2VTZXJ2aWNlID0gcmVxdWlyZSgnLi4vc2hhcmVkL3Jlc3BvbnNlLnNlcnZpY2UnKTtcclxuaW1wb3J0IENhbmRpZGF0ZVNlcnZpY2UgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9jYW5kaWRhdGUuc2VydmljZScpO1xyXG5pbXBvcnQgYWRtaW5Db250cm9sbGVyPSByZXF1aXJlKCcuL2FkbWluLmNvbnRyb2xsZXInKTtcclxuaW1wb3J0IFJlY3J1aXRlck1vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9yZWNydWl0ZXIubW9kZWwnKTtcclxuXHJcbnZhciBiY3J5cHQgPSByZXF1aXJlKCdiY3J5cHQnKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2dpbihyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG5cclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgdmFyIHBhcmFtcyA9IHJlcS5ib2R5O1xyXG4gICAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XHJcbiAgICB1c2VyU2VydmljZS5yZXRyaWV2ZSh7XCJlbWFpbFwiOiBwYXJhbXMuZW1haWx9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmIChyZXN1bHQubGVuZ3RoID4gMCAmJiByZXN1bHRbMF0uaXNBY3RpdmF0ZWQgPT09IHRydWUpIHtcclxuICAgICAgICBiY3J5cHQuY29tcGFyZShwYXJhbXMucGFzc3dvcmQsIHJlc3VsdFswXS5wYXNzd29yZCwgKGVycjogYW55LCBpc1NhbWU6IGFueSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9SRUdJU1RSQVRJT05fU1RBVFVTLFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQ0FORElEQVRFX0FDQ09VTlQsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGlzU2FtZSkge1xyXG4gICAgICAgICAgICAgIHZhciBhdXRoID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgICAgICAgICAgIHZhciB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQocmVzdWx0WzBdKTtcclxuICAgICAgICAgICAgICBpZiAocmVzdWx0WzBdLmlzQWRtaW4pIHtcclxuICAgICAgICAgICAgICAgIGFkbWluQ29udHJvbGxlci5zZW5kTG9naW5JbmZvVG9BZG1pbihyZXN1bHRbMF0uZW1haWwsIHJlcS5jb25uZWN0aW9uLnJlbW90ZUFkZHJlc3MsIHBhcmFtcy5sYXRpdHVkZSwgcGFyYW1zLmxvbmdpdHVkZSxuZXh0KTtcclxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgICAgICAgICAgXCJzdGF0dXNcIjogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgICAgICAgICAgIFwiZGF0YVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJlbWFpbFwiOiByZXN1bHRbMF0uZW1haWwsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJmaXJzdF9uYW1lXCI6IHJlc3VsdFswXS5maXJzdF9uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiX2lkXCI6IHJlc3VsdFswXS5faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJjdXJyZW50X3RoZW1lXCI6IHJlc3VsdFswXS5jdXJyZW50X3RoZW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW5kX3VzZXJfaWRcIjogcmVzdWx0WzBdLl9pZCxcclxuICAgICAgICAgICAgICAgICAgICBcInBpY3R1cmVcIjogcmVzdWx0WzBdLnBpY3R1cmUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJtb2JpbGVfbnVtYmVyXCI6IHJlc3VsdFswXS5tb2JpbGVfbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaXNDYW5kaWRhdGVcIjogcmVzdWx0WzBdLmlzQ2FuZGlkYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaXNBZG1pblwiOiByZXN1bHRbMF0uaXNBZG1pblxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRva2VuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdFswXS5pc0NhbmRpZGF0ZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgdmFyIHJlY3J1aXRlclNlcnZpY2UgPSBuZXcgUmVjcnVpdGVyU2VydmljZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgcmVjcnVpdGVyU2VydmljZS5yZXRyaWV2ZSh7XCJ1c2VySWRcIjogcmVzdWx0WzBdLl9pZH0sIChlcnJvciwgcmVjcnVpdGVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3RhdHVzXCI6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRhdGFcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiZW1haWxcIjogcmVzdWx0WzBdLmVtYWlsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiX2lkXCI6IHJlc3VsdFswXS5faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlbmRfdXNlcl9pZFwiOiByZWNydWl0ZXJbMF0uX2lkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiY3VycmVudF90aGVtZVwiOiByZXN1bHRbMF0uY3VycmVudF90aGVtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcInBpY3R1cmVcIjogcmVzdWx0WzBdLnBpY3R1cmUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb21wYW55X2hlYWRxdWFydGVyX2NvdW50cnlcIjogcmVjcnVpdGVyWzBdLmNvbXBhbnlfaGVhZHF1YXJ0ZXJfY291bnRyeSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbXBhbnlfbmFtZVwiOiByZWNydWl0ZXJbMF0uY29tcGFueV9uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwic2V0T2ZEb2N1bWVudHNcIjogcmVjcnVpdGVyWzBdLnNldE9mRG9jdW1lbnRzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29tcGFueV9zaXplXCI6IHJlY3J1aXRlclswXS5jb21wYW55X3NpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpc1JlY3J1aXRpbmdGb3JzZWxmXCI6IHJlY3J1aXRlclswXS5pc1JlY3J1aXRpbmdGb3JzZWxmLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwibW9iaWxlX251bWJlclwiOiByZXN1bHRbMF0ubW9iaWxlX251bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImlzQ2FuZGlkYXRlXCI6IHJlc3VsdFswXS5pc0NhbmRpZGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImlzQWRtaW5cIjogcmVzdWx0WzBdLmlzQWRtaW5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblxyXG4gICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICB2YXIgY2FuZGlkYXRlU2VydmljZSA9IG5ldyBDYW5kaWRhdGVTZXJ2aWNlKCk7XHJcbiAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZVNlcnZpY2UucmV0cmlldmUoe1widXNlcklkXCI6IHJlc3VsdFswXS5faWR9LCAoZXJyb3IsIGNhbmRpZGF0ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN0YXR1c1wiOiBNZXNzYWdlcy5TVEFUVVNfU1VDQ0VTUyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImZpcnN0X25hbWVcIjogcmVzdWx0WzBdLmZpcnN0X25hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJsYXN0X25hbWVcIjogcmVzdWx0WzBdLmxhc3RfbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImVtYWlsXCI6IHJlc3VsdFswXS5lbWFpbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcIl9pZFwiOiByZXN1bHRbMF0uX2lkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiZW5kX3VzZXJfaWRcIjogY2FuZGlkYXRlWzBdLl9pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImN1cnJlbnRfdGhlbWVcIjogcmVzdWx0WzBdLmN1cnJlbnRfdGhlbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwaWN0dXJlXCI6IHJlc3VsdFswXS5waWN0dXJlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwibW9iaWxlX251bWJlclwiOiByZXN1bHRbMF0ubW9iaWxlX251bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImlzQ2FuZGlkYXRlXCI6IHJlc3VsdFswXS5pc0NhbmRpZGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImlzQWRtaW5cIjogcmVzdWx0WzBdLmlzQWRtaW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpc0NvbXBsZXRlZFwiOiBjYW5kaWRhdGVbMF0uaXNDb21wbGV0ZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpc1N1Ym1pdHRlZFwiOiBjYW5kaWRhdGVbMF0uaXNTdWJtaXR0ZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJndWlkZV90b3VyXCI6IHJlc3VsdFswXS5ndWlkZV90b3VyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2Vzc190b2tlbjogdG9rZW5cclxuICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfUEFTU1dPUkQsXHJcbiAgICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDAgJiYgcmVzdWx0WzBdLmlzQWN0aXZhdGVkID09PSBmYWxzZSkge1xyXG4gICAgICAgIGJjcnlwdC5jb21wYXJlKHBhcmFtcy5wYXNzd29yZCwgcmVzdWx0WzBdLnBhc3N3b3JkLCAoZXJyOiBhbnksIGlzUGFzc1NhbWU6IGFueSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9SRUdJU1RSQVRJT05fU1RBVFVTLFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQ0FORElEQVRFX0FDQ09VTlQsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGlzUGFzc1NhbWUpIHtcclxuICAgICAgICAgICAgICBpZiAocmVzdWx0WzBdLmlzQ2FuZGlkYXRlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfUkVHSVNUUkFUSU9OX1NUQVRVUyxcclxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1ZFUklGWV9DQU5ESURBVEVfQUNDT1VOVCxcclxuICAgICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9SRUdJU1RSQVRJT05fU1RBVFVTLFxyXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0FDQ09VTlQsXHJcbiAgICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dST05HX1BBU1NXT1JELFxyXG4gICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX1VTRVJfTk9UX0ZPVU5ELFxyXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1VTRVJfTk9UX1BSRVNFTlQsXHJcbiAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBuZXh0KHtcclxuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgIGNvZGU6IDQwM1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZU90cChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICB2YXIgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgdmFyIHBhcmFtcyA9IHJlcS5ib2R5OyAgLy9tb2JpbGVfbnVtYmVyKG5ldylcclxuXHJcbiAgICB2YXIgRGF0YSA9IHtcclxuICAgICAgbmV3X21vYmlsZV9udW1iZXI6IHBhcmFtcy5tb2JpbGVfbnVtYmVyLFxyXG4gICAgICBvbGRfbW9iaWxlX251bWJlcjogdXNlci5tb2JpbGVfbnVtYmVyLFxyXG4gICAgICBfaWQ6IHVzZXIuX2lkXHJcbiAgICB9O1xyXG4gICAgdXNlclNlcnZpY2UuZ2VuZXJhdGVPdHAoRGF0YSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgaWYgKGVycm9yID09IE1lc3NhZ2VzLk1TR19FUlJPUl9DSEVDS19NT0JJTEVfUFJFU0VOVCkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfUkVHSVNUUkFUSU9OX01PQklMRV9OVU1CRVIsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmIChyZXN1bHQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgIFwic3RhdHVzXCI6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgXCJkYXRhXCI6IHtcclxuICAgICAgICAgICAgXCJtZXNzYWdlXCI6IE1lc3NhZ2VzLk1TR19TVUNDRVNTX09UUFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX1VTRVJfTk9UX0ZPVU5ELFxyXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9VU0VSX05PVF9GT1VORCxcclxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgbmV4dCh7XHJcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICBjb2RlOiA0MDNcclxuICAgIH0pO1xyXG5cclxuICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHZlcmlmaWNhdGlvbk1haWwocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgdmFyIHVzZXIgPSByZXEudXNlcjtcclxuICAgIHZhciBwYXJhbXMgPSByZXEuYm9keTtcclxuICAgIHVzZXJTZXJ2aWNlLnNlbmRWZXJpZmljYXRpb25NYWlsKHBhcmFtcywgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fV0hJTEVfQ09OVEFDVElORyxcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XSElMRV9DT05UQUNUSU5HLFxyXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XHJcbiAgICAgICAgICBcInN0YXR1c1wiOiBNZXNzYWdlcy5TVEFUVVNfU1VDQ0VTUyxcclxuICAgICAgICAgIFwiZGF0YVwiOiB7XCJtZXNzYWdlXCI6IE1lc3NhZ2VzLk1TR19TVUNDRVNTX0VNQUlMX1JFR0lTVFJBVElPTn1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICBuZXh0KHtcclxuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgIGNvZGU6IDQwM1xyXG4gICAgfSk7XHJcblxyXG4gIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gcmVjcnVpdGVyVmVyaWZpY2F0aW9uTWFpbChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICB2YXIgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgdmFyIHBhcmFtcyA9IHJlcS5ib2R5O1xyXG4gICAgdXNlclNlcnZpY2Uuc2VuZFJlY3J1aXRlclZlcmlmaWNhdGlvbk1haWwocGFyYW1zLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KHtcclxuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9XSElMRV9DT05UQUNUSU5HLFxyXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dISUxFX0NPTlRBQ1RJTkcsXHJcbiAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgIFwic3RhdHVzXCI6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgXCJkYXRhXCI6IHtcIm1lc3NhZ2VcIjogTWVzc2FnZXMuTVNHX1NVQ0NFU1NfRU1BSUxfUkVHSVNUUkFUSU9OfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNDAzXHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBtYWlsKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIHZhciBwYXJhbXMgPSByZXEuYm9keTtcclxuICAgIHVzZXJTZXJ2aWNlLnNlbmRNYWlsKHBhcmFtcywgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fV0hJTEVfQ09OVEFDVElORyxcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XSElMRV9DT05UQUNUSU5HLFxyXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XHJcbiAgICAgICAgICBcInN0YXR1c1wiOiBNZXNzYWdlcy5TVEFUVVNfU1VDQ0VTUyxcclxuICAgICAgICAgIFwiZGF0YVwiOiB7XCJtZXNzYWdlXCI6IE1lc3NhZ2VzLk1TR19TVUNDRVNTX1NVQk1JVFRFRH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICBuZXh0KHtcclxuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgIGNvZGU6IDQwM1xyXG4gICAgfSk7XHJcblxyXG4gIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgbmV3VXNlcjogVXNlck1vZGVsID0gPFVzZXJNb2RlbD5yZXEuYm9keTtcclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgLy8gbmV3VXNlci5pc0FjdGl2YXRlZD10cnVlO1xyXG4gICAgdXNlclNlcnZpY2UuY3JlYXRlVXNlcihuZXdVc2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuXHJcbiAgICAgICAgaWYgKGVycm9yID09IE1lc3NhZ2VzLk1TR19FUlJPUl9DSEVDS19FTUFJTF9QUkVTRU5UKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0VYSVNUSU5HX1VTRVIsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQUNDT1VOVCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGVycm9yID09IE1lc3NhZ2VzLk1TR19FUlJPUl9DSEVDS19NT0JJTEVfUFJFU0VOVCkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfUkVHSVNUUkFUSU9OX01PQklMRV9OVU1CRVIsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRVhJU1RJTkdfVVNFUixcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1VTRVJfV0lUSF9FTUFJTF9QUkVTRU5ULFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIGF1dGg6IEF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgICAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc3VsdCk7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgXCJzdGF0dXNcIjogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgICBcImRhdGFcIjoge1xyXG4gICAgICAgICAgICBcInJlYXNvblwiOiBNZXNzYWdlcy5NU0dfU1VDQ0VTU19SRUdJU1RSQVRJT04sXHJcbiAgICAgICAgICAgIFwiZmlyc3RfbmFtZVwiOiBuZXdVc2VyLmZpcnN0X25hbWUsXHJcbiAgICAgICAgICAgIFwibGFzdF9uYW1lXCI6IG5ld1VzZXIubGFzdF9uYW1lLFxyXG4gICAgICAgICAgICBcImVtYWlsXCI6IG5ld1VzZXIuZW1haWwsXHJcbiAgICAgICAgICAgIFwibW9iaWxlX251bWJlclwiOiBuZXdVc2VyLm1vYmlsZV9udW1iZXIsXHJcbiAgICAgICAgICAgIFwiX2lkXCI6IHJlc3VsdC5faWQsXHJcbiAgICAgICAgICAgIFwicGljdHVyZVwiOiBcIlwiXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBuZXh0KHtcclxuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgIGNvZGU6IDQwM1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZm9yZ290UGFzc3dvcmQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgdmFyIHBhcmFtcyA9IHJlcS5ib2R5OyAgIC8vZW1haWxcclxuXHJcbiAgICAvKiB2YXIgbGlua3EgPXJlcS51cmw7XHJcbiAgICAgdmFyIGZ1bGxVcmwgPSBhcHAuZ2V0KFwiL2FwaS9hZGRyZXNzXCIsICB1c2VyQ29udHJvbGxlci5nZXRBZGRyZXNzKTtyZXEucHJvdG9jb2wgKyAnOi8vJyArIHJlcS5nZXQoJ2hvc3QnKSArIHJlcS5vcmlnaW5hbFVybDtcclxuICAgICBjb25zb2xlLmxvZyhmdWxsVXJsKTsqL1xyXG4gICAgdXNlclNlcnZpY2UuZm9yZ290UGFzc3dvcmQocGFyYW1zLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG5cclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgaWYgKGVycm9yID09IE1lc3NhZ2VzLk1TR19FUlJPUl9DSEVDS19JTkFDVElWRV9BQ0NPVU5UKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfVVNFUl9OT1RfQUNUSVZBVEVELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfQUNDT1VOVF9TVEFUVVMsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChlcnJvciA9PSBNZXNzYWdlcy5NU0dfRVJST1JfQ0hFQ0tfSU5WQUxJRF9BQ0NPVU5UKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX1VTRVJfTk9UX0ZPVU5ELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVVNFUl9OT1RfRk9VTkQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XHJcbiAgICAgICAgICBcInN0YXR1c1wiOiBNZXNzYWdlcy5TVEFUVVNfU1VDQ0VTUyxcclxuICAgICAgICAgIFwiZGF0YVwiOiB7XCJtZXNzYWdlXCI6IE1lc3NhZ2VzLk1TR19TVUNDRVNTX0VNQUlMX0ZPUkdPVF9QQVNTV09SRH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICBuZXh0KHtcclxuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgIGNvZGU6IDQwM1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbm90aWZpY2F0aW9ucyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG4gICAgdmFyIHVzZXIgPSByZXEudXNlcjtcclxuICAgIHZhciBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpO1xyXG5cclxuICAgIC8vcmV0cmlldmUgbm90aWZpY2F0aW9uIGZvciBhIHBhcnRpY3VsYXIgdXNlclxyXG4gICAgdmFyIHBhcmFtcyA9IHtfaWQ6IHVzZXIuX2lkfTtcclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG5cclxuICAgIHVzZXJTZXJ2aWNlLnJldHJpZXZlKHBhcmFtcywgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpO1xyXG4gICAgICAgIHJlcy5zZW5kKHtcclxuICAgICAgICAgIFwic3RhdHVzXCI6IFwic3VjY2Vzc1wiLFxyXG4gICAgICAgICAgXCJkYXRhXCI6IHJlc3VsdFswXS5ub3RpZmljYXRpb25zLFxyXG4gICAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBuZXh0KHtcclxuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgIGNvZGU6IDQwM1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcHVzaE5vdGlmaWNhdGlvbnMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICB2YXIgYm9keV9kYXRhID0gcmVxLmJvZHk7XHJcbiAgICB2YXIgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgdmFyIHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKTtcclxuXHJcbiAgICAvL3JldHJpZXZlIG5vdGlmaWNhdGlvbiBmb3IgYSBwYXJ0aWN1bGFyIHVzZXJcclxuICAgIHZhciBwYXJhbXMgPSB7X2lkOiB1c2VyLl9pZH07XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIHZhciBkYXRhID0geyRwdXNoOiB7bm90aWZpY2F0aW9uczogYm9keV9kYXRhfX07XHJcblxyXG4gICAgdXNlclNlcnZpY2UuZmluZE9uZUFuZFVwZGF0ZShwYXJhbXMsIGRhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpO1xyXG4gICAgICAgIHJlcy5zZW5kKHtcclxuICAgICAgICAgIFwic3RhdHVzXCI6IFwiU3VjY2Vzc1wiLFxyXG4gICAgICAgICAgXCJkYXRhXCI6IHJlc3VsdC5ub3RpZmljYXRpb25zLFxyXG5cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgbmV4dCh7XHJcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICBjb2RlOiA0MDNcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZU5vdGlmaWNhdGlvbnMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICB2YXIgYm9keV9kYXRhID0gcmVxLmJvZHk7XHJcbiAgICB2YXIgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgdmFyIHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKTtcclxuXHJcbiAgICB2YXIgcGFyYW1zID0ge19pZDogdXNlci5faWR9O1xyXG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICB2YXIgZGF0YSA9IHtpc19yZWFkOiB0cnVlfTtcclxuXHJcbiAgICB1c2VyU2VydmljZS5maW5kQW5kVXBkYXRlTm90aWZpY2F0aW9uKHBhcmFtcywgZGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHZhciB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQodXNlcik7XHJcbiAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgXCJzdGF0dXNcIjogXCJTdWNjZXNzXCIsXHJcbiAgICAgICAgICBcImRhdGFcIjogcmVzdWx0Lm5vdGlmaWNhdGlvbnMsXHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBuZXh0KHtcclxuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgIGNvZGU6IDQwM1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlRGV0YWlscyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG4gICAgdmFyIG5ld1VzZXJEYXRhOiBVc2VyTW9kZWwgPSA8VXNlck1vZGVsPnJlcS5ib2R5O1xyXG4gICAgdmFyIHBhcmFtcyA9IHJlcS5xdWVyeTtcclxuICAgIGRlbGV0ZSBwYXJhbXMuYWNjZXNzX3Rva2VuO1xyXG4gICAgdmFyIHVzZXIgPSByZXEudXNlcjtcclxuICAgIHZhciBfaWQ6IHN0cmluZyA9IHVzZXIuX2lkO1xyXG5cclxuICAgIHZhciBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIHVzZXJTZXJ2aWNlLnVwZGF0ZShfaWQsIG5ld1VzZXJEYXRhLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB1c2VyU2VydmljZS5yZXRyaWV2ZShfaWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dST05HX1RPS0VOLFxyXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpO1xyXG4gICAgICAgICAgICByZXMuc2VuZCh7XHJcbiAgICAgICAgICAgICAgXCJzdGF0dXNcIjogXCJzdWNjZXNzXCIsXHJcbiAgICAgICAgICAgICAgXCJkYXRhXCI6IHtcclxuICAgICAgICAgICAgICAgIFwiZmlyc3RfbmFtZVwiOiByZXN1bHRbMF0uZmlyc3RfbmFtZSxcclxuICAgICAgICAgICAgICAgIFwibGFzdF9uYW1lXCI6IHJlc3VsdFswXS5sYXN0X25hbWUsXHJcbiAgICAgICAgICAgICAgICBcImVtYWlsXCI6IHJlc3VsdFswXS5lbWFpbCxcclxuICAgICAgICAgICAgICAgIFwibW9iaWxlX251bWJlclwiOiByZXN1bHRbMF0ubW9iaWxlX251bWJlcixcclxuICAgICAgICAgICAgICAgIFwicGljdHVyZVwiOiByZXN1bHRbMF0ucGljdHVyZSxcclxuICAgICAgICAgICAgICAgIFwiX2lkXCI6IHJlc3VsdFswXS51c2VySWQsXHJcbiAgICAgICAgICAgICAgICBcImN1cnJlbnRfdGhlbWVcIjogcmVzdWx0WzBdLmN1cnJlbnRfdGhlbWVcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGFjY2Vzc190b2tlbjogdG9rZW5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgbmV4dCh7XHJcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICBjb2RlOiA0MDNcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVJlY3J1aXRlckFjY291bnREZXRhaWxzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgbmV3VXNlckRhdGE6IFJlY3J1aXRlck1vZGVsID0gPFJlY3J1aXRlck1vZGVsPnJlcS5ib2R5O1xyXG4gICAgdmFyIHVzZXIgPSByZXEudXNlcjtcclxuICAgIHZhciBfaWQ6IHN0cmluZyA9IHVzZXIuX2lkO1xyXG4gICAgdmFyIGF1dGg6IEF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgIHZhciByZWNydWl0ZXJTZXJ2aWNlID0gbmV3IFJlY3J1aXRlclNlcnZpY2UoKTtcclxuICAgIHJlY3J1aXRlclNlcnZpY2UudXBkYXRlRGV0YWlscyhfaWQsIG5ld1VzZXJEYXRhLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXMuc2VuZCh7XHJcbiAgICAgICAgICAnc3RhdHVzJzogJ1N1Y2Nlc3MnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNDAzXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVByb2ZpbGVGaWVsZChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG4gICAgLy92YXIgbmV3VXNlckRhdGE6IFVzZXJNb2RlbCA9IDxVc2VyTW9kZWw+cmVxLmJvZHk7XHJcblxyXG4gICAgdmFyIHBhcmFtcyA9IHJlcS5xdWVyeTtcclxuICAgIGRlbGV0ZSBwYXJhbXMuYWNjZXNzX3Rva2VuO1xyXG4gICAgdmFyIHVzZXIgPSByZXEudXNlcjtcclxuICAgIHZhciBfaWQ6IHN0cmluZyA9IHVzZXIuX2lkO1xyXG4gICAgdmFyIGZOYW1lOiBzdHJpbmcgPSByZXEucGFyYW1zLmZuYW1lO1xyXG4gICAgaWYgKGZOYW1lID09ICdndWlkZV90b3VyJykge1xyXG4gICAgICB2YXIgZGF0YSA9IHsnZ3VpZGVfdG91cic6IHJlcS5ib2R5fTtcclxuICAgIH1cclxuICAgIHZhciBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIHVzZXJTZXJ2aWNlLnVwZGF0ZShfaWQsIGRhdGEsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHVzZXJTZXJ2aWNlLnJldHJpZXZlKF9pZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfVE9LRU4sXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQodXNlcik7XHJcbiAgICAgICAgICAgIHJlcy5zZW5kKHtcclxuICAgICAgICAgICAgICBcInN0YXR1c1wiOiBcInN1Y2Nlc3NcIixcclxuICAgICAgICAgICAgICBcImRhdGFcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJmaXJzdF9uYW1lXCI6IHJlc3VsdFswXS5maXJzdF9uYW1lLFxyXG4gICAgICAgICAgICAgICAgXCJsYXN0X25hbWVcIjogcmVzdWx0WzBdLmxhc3RfbmFtZSxcclxuICAgICAgICAgICAgICAgIFwiZW1haWxcIjogcmVzdWx0WzBdLmVtYWlsLFxyXG4gICAgICAgICAgICAgICAgXCJfaWRcIjogcmVzdWx0WzBdLnVzZXJJZCxcclxuICAgICAgICAgICAgICAgIFwiZ3VpZGVfdG91clwiOiByZXN1bHRbMF0uZ3VpZGVfdG91clxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICBuZXh0KHtcclxuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgIGNvZGU6IDQwM1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmV0cmlldmUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgdmFyIHBhcmFtcyA9IHJlcS5wYXJhbXMuaWQ7XHJcbiAgICBkZWxldGUgcGFyYW1zLmFjY2Vzc190b2tlbjtcclxuICAgIHZhciB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICB2YXIgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG5cclxuICAgIHZhciB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQodXNlcik7XHJcbiAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgXCJzdGF0dXNcIjogXCJzdWNjZXNzXCIsXHJcbiAgICAgICAgICBcImRhdGFcIjoge1xyXG4gICAgICAgICAgICBcImZpcnN0X25hbWVcIjogdXNlci5maXJzdF9uYW1lLFxyXG4gICAgICAgICAgICBcImxhc3RfbmFtZVwiOiB1c2VyLmxhc3RfbmFtZSxcclxuICAgICAgICAgICAgXCJlbWFpbFwiOiB1c2VyLmVtYWlsLFxyXG4gICAgICAgICAgICBcIm1vYmlsZV9udW1iZXJcIjogdXNlci5tb2JpbGVfbnVtYmVyLFxyXG4gICAgICAgICAgICBcInBpY3R1cmVcIjogdXNlci5waWN0dXJlLFxyXG4gICAgICAgICAgICBcInNvY2lhbF9wcm9maWxlX3BpY3R1cmVcIjogdXNlci5zb2NpYWxfcHJvZmlsZV9waWN0dXJlLFxyXG4gICAgICAgICAgICBcIl9pZFwiOiB1c2VyLnVzZXJJZCxcclxuICAgICAgICAgICAgXCJjdXJyZW50X3RoZW1lXCI6IHVzZXIuY3VycmVudF90aGVtZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGFjY2Vzc190b2tlbjogdG9rZW5cclxuICAgICAgICB9KTtcclxuICB9Y2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNDAzXHJcbiAgICB9KTsgIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRQYXNzd29yZChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG4gICAgdmFyIHVzZXIgPSByZXEudXNlcjtcclxuICAgIHZhciBwYXJhbXMgPSByZXEuYm9keTsgICAvL25ld19wYXNzd29yZFxyXG4gICAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIGNvbnN0IHNhbHRSb3VuZHMgPSAxMDtcclxuICAgIGJjcnlwdC5oYXNoKHJlcS5ib2R5Lm5ld19wYXNzd29yZCwgc2FsdFJvdW5kcywgKGVycjogYW55LCBoYXNoOiBhbnkpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgcmVhc29uOiAnRXJyb3IgaW4gY3JlYXRpbmcgaGFzaCB1c2luZyBiY3J5cHQnLFxyXG4gICAgICAgICAgbWVzc2FnZTogJ0Vycm9yIGluIGNyZWF0aW5nIGhhc2ggdXNpbmcgYmNyeXB0JyxcclxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFyIHVwZGF0ZURhdGEgPSB7J3Bhc3N3b3JkJzogaGFzaH07XHJcbiAgICAgICAgdmFyIHF1ZXJ5ID0ge1wiX2lkXCI6IHVzZXIuX2lkLCBcInBhc3N3b3JkXCI6IHJlcS51c2VyLnBhc3N3b3JkfTtcclxuICAgICAgICB1c2VyU2VydmljZS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlcy5zZW5kKHtcclxuICAgICAgICAgICAgICAnc3RhdHVzJzogJ1N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAgICdkYXRhJzogeydtZXNzYWdlJzogJ1Bhc3N3b3JkIGNoYW5nZWQgc3VjY2Vzc2Z1bGx5J31cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNDAzXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGFuZ2VQYXNzd29yZChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG4gICAgdmFyIHVzZXIgPSByZXEudXNlcjtcclxuICAgIHZhciBwYXJhbXMgPSByZXEucXVlcnk7XHJcbiAgICBkZWxldGUgcGFyYW1zLmFjY2Vzc190b2tlbjtcclxuICAgIHZhciBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIGJjcnlwdC5jb21wYXJlKHJlcS5ib2R5LmN1cnJlbnRfcGFzc3dvcmQsIHVzZXIucGFzc3dvcmQsIChlcnI6IGFueSwgaXNTYW1lOiBhbnkpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfUkVHSVNUUkFUSU9OX1NUQVRVUyxcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQ0FORElEQVRFX0FDQ09VTlQsXHJcbiAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChpc1NhbWUpIHtcclxuXHJcbiAgICAgICAgICBpZiAocmVxLmJvZHkuY3VycmVudF9wYXNzd29yZCA9PT0gcmVxLmJvZHkubmV3X3Bhc3N3b3JkKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9TQU1FX05FV19QQVNTV09SRCxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgdmFyIG5ld19wYXNzd29yZDogYW55O1xyXG4gICAgICAgICAgICBjb25zdCBzYWx0Um91bmRzID0gMTA7XHJcbiAgICAgICAgICAgIGJjcnlwdC5oYXNoKHJlcS5ib2R5Lm5ld19wYXNzd29yZCwgc2FsdFJvdW5kcywgKGVycjogYW55LCBoYXNoOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAvLyBTdG9yZSBoYXNoIGluIHlvdXIgcGFzc3dvcmQgREIuXHJcbiAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX1JFR0lTVFJBVElPTl9TVEFUVVMsXHJcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9CQ1JZUFRfQ1JFQVRJT04sXHJcbiAgICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG5ld19wYXNzd29yZCA9IGhhc2g7XHJcbiAgICAgICAgICAgICAgICB2YXIgcXVlcnkgPSB7XCJfaWRcIjogcmVxLnVzZXIuX2lkfTtcclxuICAgICAgICAgICAgICAgIHZhciB1cGRhdGVEYXRhID0ge1wicGFzc3dvcmRcIjogbmV3X3Bhc3N3b3JkfTtcclxuICAgICAgICAgICAgICAgIHVzZXJTZXJ2aWNlLmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZURhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHtcclxuICAgICAgICAgICAgICAgICAgICAgIFwic3RhdHVzXCI6IFwiU3VjY2Vzc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgXCJkYXRhXCI6IHtcIm1lc3NhZ2VcIjogTWVzc2FnZXMuTVNHX1NVQ0NFU1NfUEFTU1dPUkRfQ0hBTkdFfSxcclxuICAgICAgICAgICAgICAgICAgICAgIGFjY2Vzc190b2tlbjogdG9rZW5cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfQ1VSUkVOVF9QQVNTV09SRCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNDAzXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGFuZ2VNb2JpbGVOdW1iZXIocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcblxyXG4gIHRyeSB7XHJcbiAgICB2YXIgdXNlciA9IHJlcS51c2VyO1xyXG5cclxuICAgIHZhciBwYXJhbXMgPSByZXEuYm9keTtcclxuICAgIHZhciBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuXHJcbiAgICB2YXIgcXVlcnkgPSB7XCJtb2JpbGVfbnVtYmVyXCI6IHBhcmFtcy5uZXdfbW9iaWxlX251bWJlciwgXCJpc0FjdGl2YXRlZFwiOiB0cnVlfTtcclxuXHJcbiAgICB1c2VyU2VydmljZS5yZXRyaWV2ZShxdWVyeSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICBuZXh0KHtcclxuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxyXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTl9NT0JJTEVfTlVNQkVSLFxyXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIERhdGEgPSB7XHJcbiAgICAgICAgICBjdXJyZW50X21vYmlsZV9udW1iZXI6IHVzZXIubW9iaWxlX251bWJlcixcclxuICAgICAgICAgIF9pZDogdXNlci5faWQsXHJcbiAgICAgICAgICBuZXdfbW9iaWxlX251bWJlcjogcGFyYW1zLm5ld19tb2JpbGVfbnVtYmVyXHJcbiAgICAgICAgfTtcclxuICAgICAgICB1c2VyU2VydmljZS5jaGFuZ2VNb2JpbGVOdW1iZXIoRGF0YSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fV0hJTEVfQ09OVEFDVElORyxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV0hJTEVfQ09OVEFDVElORyxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgICAgIFwic3RhdHVzXCI6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgICAgIFwiZGF0YVwiOiB7XHJcbiAgICAgICAgICAgICAgICBcIm1lc3NhZ2VcIjogTWVzc2FnZXMuTVNHX1NVQ0NFU1NfT1RQX0NIQU5HRV9NT0JJTEVfTlVNQkVSXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgbmV4dCh7XHJcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICBjb2RlOiA0MDNcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNoYW5nZUVtYWlsSWQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcblxyXG4gIHRyeSB7XHJcbiAgICB2YXIgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgdmFyIHBhcmFtcyA9IHJlcS5xdWVyeTtcclxuICAgIGRlbGV0ZSBwYXJhbXMuYWNjZXNzX3Rva2VuO1xyXG4gICAgdmFyIGF1dGg6IEF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG5cclxuXHJcbiAgICB2YXIgcXVlcnkgPSB7XCJlbWFpbFwiOiByZXEuYm9keS5uZXdfZW1haWx9O1xyXG5cclxuICAgIHVzZXJTZXJ2aWNlLnJldHJpZXZlKHF1ZXJ5LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG5cclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDAgJiYgcmVzdWx0WzBdLmlzQWN0aXZhdGVkID09PSB0cnVlKSB7XHJcbiAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRVhJU1RJTkdfVVNFUixcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT04sXHJcbiAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmIChyZXN1bHQubGVuZ3RoID4gMCAmJiByZXN1bHRbMF0uaXNBY3RpdmF0ZWQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRVhJU1RJTkdfVVNFUixcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9BQ0NPVU5UX1NUQVRVUyxcclxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgICBlbHNlIHtcclxuXHJcbiAgICAgICAgdmFyIGVtYWlsSWQgPSB7XHJcbiAgICAgICAgICBjdXJyZW50X2VtYWlsOiByZXEuYm9keS5jdXJyZW50X2VtYWlsLFxyXG4gICAgICAgICAgbmV3X2VtYWlsOiByZXEuYm9keS5uZXdfZW1haWxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB1c2VyU2VydmljZS5TZW5kQ2hhbmdlTWFpbFZlcmlmaWNhdGlvbihlbWFpbElkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvciA9PT0gTWVzc2FnZXMuTVNHX0VSUk9SX0NIRUNLX0VNQUlMX0FDQ09VTlQpIHtcclxuICAgICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNQUlMX0FDVElWRV9OT1csXHJcbiAgICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX1dISUxFX0NPTlRBQ1RJTkcsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV0hJTEVfQ09OVEFDVElORyxcclxuICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgICAgIFwic3RhdHVzXCI6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgICAgIFwiZGF0YVwiOiB7XCJtZXNzYWdlXCI6IE1lc3NhZ2VzLk1TR19TVUNDRVNTX0VNQUlMX0NIQU5HRV9FTUFJTElEfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgfVxyXG5cclxuICBjYXRjaCAoZSkge1xyXG4gICAgbmV4dCh7XHJcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICBjb2RlOiA0MDNcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZlcmlmeU1vYmlsZU51bWJlcihyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG5cclxuICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcblxyXG4gICAgdmFyIHBhcmFtcyA9IHJlcS5ib2R5OyAvL290cFxyXG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICB2YXIgcXVlcnkgPSB7XCJfaWRcIjogdXNlci5faWR9O1xyXG4gICAgdmFyIHVwZGF0ZURhdGEgPSB7XCJtb2JpbGVfbnVtYmVyXCI6IHVzZXIudGVtcF9tb2JpbGUsIFwidGVtcF9tb2JpbGVcIjogdXNlci5tb2JpbGVfbnVtYmVyfTtcclxuICAgIGlmICh1c2VyLm90cCA9PT0gcGFyYW1zLm90cCkge1xyXG4gICAgICB1c2VyU2VydmljZS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zZW5kKHtcclxuICAgICAgICAgICAgXCJzdGF0dXNcIjogXCJTdWNjZXNzXCIsXHJcbiAgICAgICAgICAgIFwiZGF0YVwiOiB7XCJtZXNzYWdlXCI6IFwiVXNlciBBY2NvdW50IHZlcmlmaWVkIHN1Y2Nlc3NmdWxseVwifVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfT1RQLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICBuZXh0KHtcclxuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgIGNvZGU6IDQwM1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmVyaWZ5T3RwKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcblxyXG4gICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuXHJcbiAgICB2YXIgcGFyYW1zID0gcmVxLmJvZHk7IC8vT1RQXHJcbiAgICAvLyAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIHZhciBxdWVyeSA9IHtcIl9pZFwiOiB1c2VyLl9pZCwgXCJpc0FjdGl2YXRlZFwiOiBmYWxzZX07XHJcbiAgICB2YXIgdXBkYXRlRGF0YSA9IHtcImlzQWN0aXZhdGVkXCI6IHRydWV9O1xyXG4gICAgaWYgKHVzZXIub3RwID09PSBwYXJhbXMub3RwKSB7XHJcbiAgICAgIHVzZXJTZXJ2aWNlLmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZURhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgICBcInN0YXR1c1wiOiBcIlN1Y2Nlc3NcIixcclxuICAgICAgICAgICAgXCJkYXRhXCI6IHtcIm1lc3NhZ2VcIjogXCJVc2VyIEFjY291bnQgdmVyaWZpZWQgc3VjY2Vzc2Z1bGx5XCJ9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XUk9OR19PVFAsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAzXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNDAzXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmVyaWZ5QWNjb3VudChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG5cclxuICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICB2YXIgcGFyYW1zID0gcmVxLnF1ZXJ5O1xyXG4gICAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuXHJcbiAgICB2YXIgcXVlcnkgPSB7XCJfaWRcIjogdXNlci5faWQsIFwiaXNBY3RpdmF0ZWRcIjogZmFsc2V9O1xyXG4gICAgdmFyIHVwZGF0ZURhdGEgPSB7XCJpc0FjdGl2YXRlZFwiOiB0cnVlfTtcclxuICAgIHVzZXJTZXJ2aWNlLmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZURhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuXHJcbiAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgXCJzdGF0dXNcIjogXCJTdWNjZXNzXCIsXHJcbiAgICAgICAgICBcImRhdGFcIjoge1wibWVzc2FnZVwiOiBcIlVzZXIgQWNjb3VudCB2ZXJpZmllZCBzdWNjZXNzZnVsbHlcIn1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgbmV4dCh7XHJcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICBjb2RlOiA0MDNcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZlcmlmeUNoYW5nZWRFbWFpbElkKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgdmFyIHBhcmFtcyA9IHJlcS5xdWVyeTtcclxuICAgIGRlbGV0ZSBwYXJhbXMuYWNjZXNzX3Rva2VuO1xyXG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcblxyXG4gICAgdmFyIHF1ZXJ5ID0ge1wiX2lkXCI6IHVzZXIuX2lkfTtcclxuICAgIHZhciB1cGRhdGVEYXRhID0ge1wiZW1haWxcIjogdXNlci50ZW1wX2VtYWlsLCBcInRlbXBfZW1haWxcIjogdXNlci5lbWFpbH07XHJcbiAgICB1c2VyU2VydmljZS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcblxyXG4gICAgICAgIHJlcy5zZW5kKHtcclxuICAgICAgICAgIFwic3RhdHVzXCI6IFwiU3VjY2Vzc1wiLFxyXG4gICAgICAgICAgXCJkYXRhXCI6IHtcIm1lc3NhZ2VcIjogXCJVc2VyIEFjY291bnQgdmVyaWZpZWQgc3VjY2Vzc2Z1bGx5XCJ9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNDAzXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRJbmR1c3RyeShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICBfX2Rpcm5hbWUgPSAnLi8nO1xyXG4gIHZhciBmaWxlcGF0aCA9IFwiaW5kdXN0cnkuanNvblwiO1xyXG4gIHRyeSB7XHJcbiAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgsIHtyb290OiBfX2Rpcm5hbWV9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNDAzXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21wYW55U2l6ZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICBfX2Rpcm5hbWUgPSAnLi8nO1xyXG4gIHZhciBmaWxlcGF0aCA9IFwiY29tcGFueS1zaXplLmpzb25cIjtcclxuICB0cnkge1xyXG4gICAgcmVzLnNlbmRGaWxlKGZpbGVwYXRoLCB7cm9vdDogX19kaXJuYW1lfSk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICBuZXh0KHtcclxuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgIGNvZGU6IDQwM1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWRkcmVzcyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICBfX2Rpcm5hbWUgPSAnLi8nO1xyXG4gIHZhciBmaWxlcGF0aCA9IFwiYWRkcmVzcy5qc29uXCI7XHJcbiAgdHJ5IHtcclxuICAgIHJlcy5zZW5kRmlsZShmaWxlcGF0aCwge3Jvb3Q6IF9fZGlybmFtZX0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgbmV4dCh7XHJcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICBjb2RlOiA0MDNcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVhbG9jYXRpb24ocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcblxyXG4gIF9fZGlybmFtZSA9ICcuLyc7XHJcbiAgdmFyIGZpbGVwYXRoID0gXCJyZWFsb2NhdGlvbi5qc29uXCI7XHJcbiAgdHJ5IHtcclxuICAgIHJlcy5zZW5kRmlsZShmaWxlcGF0aCwge3Jvb3Q6IF9fZGlybmFtZX0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgbmV4dCh7XHJcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICBjb2RlOiA0MDNcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWR1Y2F0aW9uKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIF9fZGlybmFtZSA9ICcuLyc7XHJcbiAgdmFyIGZpbGVwYXRoID0gXCJlZHVjYXRpb24uanNvblwiO1xyXG4gIHRyeSB7XHJcbiAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgsIHtyb290OiBfX2Rpcm5hbWV9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNDAzXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2xvc2VKb2JSZWFzb25zKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIF9fZGlybmFtZSA9ICcuLyc7XHJcbiAgdmFyIGZpbGVwYXRoID0gXCJjbG9zZUpvYi5qc29uXCI7XHJcbiAgdHJ5IHtcclxuICAgIHJlcy5zZW5kRmlsZShmaWxlcGF0aCwge3Jvb3Q6IF9fZGlybmFtZX0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgbmV4dCh7XHJcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICBjb2RlOiA0MDNcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRFeHBlcmllbmNlKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIF9fZGlybmFtZSA9ICcuLyc7XHJcbiAgdmFyIGZpbGVwYXRoID0gXCJleHBlcmllbmNlTGlzdC5qc29uXCI7XHJcbiAgdHJ5IHtcclxuICAgIHJlcy5zZW5kRmlsZShmaWxlcGF0aCwge3Jvb3Q6IF9fZGlybmFtZX0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgbmV4dCh7XHJcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICBjb2RlOiA0MDNcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3VycmVudFNhbGFyeShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICBfX2Rpcm5hbWUgPSAnLi8nO1xyXG4gIHZhciBmaWxlcGF0aCA9IFwiY3VycmVudHNhbGFyeUxpc3QuanNvblwiO1xyXG4gIHRyeSB7XHJcbiAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgsIHtyb290OiBfX2Rpcm5hbWV9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNDAzXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXROb3RpY2VQZXJpb2QocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgX19kaXJuYW1lID0gJy4vJztcclxuICB2YXIgZmlsZXBhdGggPSBcIm5vdGljZXBlcmlvZExpc3QuanNvblwiO1xyXG4gIHRyeSB7XHJcbiAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgsIHtyb290OiBfX2Rpcm5hbWV9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNDAzXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRJbmR1c3RyeUV4cG9zdXJlKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIF9fZGlybmFtZSA9ICcuLyc7XHJcbiAgdmFyIGZpbGVwYXRoID0gXCJpbmR1c3RyeWV4cG9zdXJlTGlzdC5qc29uXCI7XHJcbiAgdHJ5IHtcclxuICAgIHJlcy5zZW5kRmlsZShmaWxlcGF0aCwge3Jvb3Q6IF9fZGlybmFtZX0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgbmV4dCh7XHJcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICBjb2RlOiA0MDNcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFNlYXJjaGVkQ2FuZGlkYXRlKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIF9fZGlybmFtZSA9ICcuLyc7XHJcbiAgdmFyIGZpbGVwYXRoID0gXCJjYW5kaWRhdGUuanNvblwiO1xyXG4gIHRyeSB7XHJcbiAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgsIHtyb290OiBfX2Rpcm5hbWV9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNDAzXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENvdW50cmllcyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICBfX2Rpcm5hbWUgPSAnLi8nO1xyXG4gIHZhciBmaWxlcGF0aCA9IFwiY291bnRyeS5qc29uXCI7XHJcbiAgdHJ5IHtcclxuICAgIHJlcy5zZW5kRmlsZShmaWxlcGF0aCwge3Jvb3Q6IF9fZGlybmFtZX0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgbmV4dCh7XHJcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICBjb2RlOiA0MDNcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5kaWFTdGF0ZXMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgX19kaXJuYW1lID0gJy4vJztcclxuICB2YXIgZmlsZXBhdGggPSBcImluZGlhU3RhdGVzLmpzb25cIjtcclxuICB0cnkge1xyXG4gICAgcmVzLnNlbmRGaWxlKGZpbGVwYXRoLCB7cm9vdDogX19kaXJuYW1lfSk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICBuZXh0KHtcclxuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgIGNvZGU6IDQwM1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEZ1bmN0aW9uKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIF9fZGlybmFtZSA9ICcuLyc7XHJcbiAgdmFyIGZpbGVwYXRoID0gXCJmdW5jdGlvbi5qc29uXCI7XHJcbiAgdHJ5IHtcclxuICAgIHJlcy5zZW5kRmlsZShmaWxlcGF0aCwge3Jvb3Q6IF9fZGlybmFtZX0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgbmV4dCh7XHJcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICBjb2RlOiA0MDNcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Um9sZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICBfX2Rpcm5hbWUgPSAnLi8nO1xyXG4gIHZhciBmaWxlcGF0aCA9IFwicm9sZXMuanNvblwiO1xyXG4gIHRyeSB7XHJcbiAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgsIHtyb290OiBfX2Rpcm5hbWV9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNDAzXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFByb2ZpY2llbmN5KHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIF9fZGlybmFtZSA9ICcuLyc7XHJcbiAgdmFyIGZpbGVwYXRoID0gXCJwcm9maWNpZW5jeS5qc29uXCI7XHJcbiAgdHJ5IHtcclxuICAgIHJlcy5zZW5kRmlsZShmaWxlcGF0aCwge3Jvb3Q6IF9fZGlybmFtZX0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgbmV4dCh7XHJcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICBjb2RlOiA0MDNcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldERvbWFpbihyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICBfX2Rpcm5hbWUgPSAnLi8nO1xyXG4gIHZhciBmaWxlcGF0aCA9IFwiZG9tYWluLmpzb25cIjtcclxuICB0cnkge1xyXG4gICAgcmVzLnNlbmRGaWxlKGZpbGVwYXRoLCB7cm9vdDogX19kaXJuYW1lfSk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICBuZXh0KHtcclxuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgIGNvZGU6IDQwM1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENhcGFiaWxpdHkocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgX19kaXJuYW1lID0gJy4vJztcclxuICB2YXIgZmlsZXBhdGggPSBcImNhcGFiaWxpdHkuanNvblwiO1xyXG4gIHRyeSB7XHJcbiAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgsIHtyb290OiBfX2Rpcm5hbWV9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNDAzXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21wbGV4aXR5KHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIF9fZGlybmFtZSA9ICcuLyc7XHJcbiAgdmFyIGZpbGVwYXRoID0gXCJjb21wbGV4aXR5Lmpzb25cIjtcclxuICB0cnkge1xyXG4gICAgcmVzLnNlbmRGaWxlKGZpbGVwYXRoLCB7cm9vdDogX19kaXJuYW1lfSk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICBuZXh0KHtcclxuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgIGNvZGU6IDQwM1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmJsb2dpbihyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICB2YXIgcGFyYW1zID0gcmVxLnVzZXI7XHJcbiAgICB2YXIgYXV0aCA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgIHVzZXJTZXJ2aWNlLnJldHJpZXZlKHBhcmFtcywgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc3VsdFswXSk7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgXCJzdGF0dXNcIjogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgICBcImlzU29jaWFsTG9naW5cIjogdHJ1ZSxcclxuICAgICAgICAgIFwiZGF0YVwiOiB7XHJcbiAgICAgICAgICAgIFwiZmlyc3RfbmFtZVwiOiByZXN1bHRbMF0uZmlyc3RfbmFtZSxcclxuICAgICAgICAgICAgXCJsYXN0X25hbWVcIjogcmVzdWx0WzBdLmxhc3RfbmFtZSxcclxuICAgICAgICAgICAgXCJlbWFpbFwiOiByZXN1bHRbMF0uZW1haWwsXHJcbiAgICAgICAgICAgIFwibW9iaWxlX251bWJlclwiOiByZXN1bHRbMF0ubW9iaWxlX251bWJlcixcclxuICAgICAgICAgICAgXCJwaWN0dXJlXCI6IHJlc3VsdFswXS5waWN0dXJlLFxyXG4gICAgICAgICAgICBcIl9pZFwiOiByZXN1bHRbMF0uX2lkLFxyXG4gICAgICAgICAgICBcImN1cnJlbnRfdGhlbWVcIjogcmVzdWx0WzBdLmN1cnJlbnRfdGhlbWVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRva2VuXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICBuZXh0KHtcclxuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgIGNvZGU6IDQwM1xyXG4gICAgfSk7XHJcblxyXG4gIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZ29vZ2xlbG9naW4ocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgdmFyIHBhcmFtcyA9IHJlcS51c2VyO1xyXG4gICAgdmFyIGF1dGggPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICB1c2VyU2VydmljZS5yZXRyaWV2ZShwYXJhbXMsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKHJlc3VsdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgdmFyIHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZChyZXN1bHRbMF0pO1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgIFwic3RhdHVzXCI6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgXCJpc1NvY2lhbExvZ2luXCI6IHRydWUsXHJcbiAgICAgICAgICBcImRhdGFcIjoge1xyXG4gICAgICAgICAgICBcImZpcnN0X25hbWVcIjogcmVzdWx0WzBdLmZpcnN0X25hbWUsXHJcbiAgICAgICAgICAgIFwibGFzdF9uYW1lXCI6IHJlc3VsdFswXS5sYXN0X25hbWUsXHJcbiAgICAgICAgICAgIFwiZW1haWxcIjogcmVzdWx0WzBdLmVtYWlsLFxyXG4gICAgICAgICAgICBcIm1vYmlsZV9udW1iZXJcIjogcmVzdWx0WzBdLm1vYmlsZV9udW1iZXIsXHJcbiAgICAgICAgICAgIFwic29jaWFsX3Byb2ZpbGVfcGljdHVyZVwiOiByZXN1bHRbMF0uc29jaWFsX3Byb2ZpbGVfcGljdHVyZSxcclxuICAgICAgICAgICAgXCJjdXJyZW50X3RoZW1lXCI6IHJlc3VsdFswXS5jdXJyZW50X3RoZW1lLFxyXG4gICAgICAgICAgICBcIl9pZFwiOiByZXN1bHRbMF0uX2lkXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgbmV4dCh7XHJcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICBjb2RlOiA0MDNcclxuICAgIH0pO1xyXG5cclxuICB9XHJcbn1cclxuLypleHBvcnQgZnVuY3Rpb24gZ2V0R29vZ2xlVG9rZW4ocmVxIDogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gdmFyIHRva2VuID0gSlNPTi5zdHJpbmdpZnkocmVxLmJvZHkudG9rZW4pO1xyXG5cclxuIHZhciB1cmwgPSAnaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vb2F1dGgyL3YzL3Rva2VuaW5mbz9pZF90b2tlbj0nK3Rva2VuO1xyXG4gY29uc29sZS5sb2coJ3VybCA6ICcrdG9rZW4pO1xyXG4gcmVxdWVzdCh1cmwsIGZ1bmN0aW9uKCBlcnJvcjphbnkgLCByZXNwb25zZTphbnkgLCBib2R5OmFueSApIHtcclxuIGlmKGVycm9yKXtcclxuIGNvbnNvbGUubG9nKCdlcnJvciA6JytlcnJvcik7XHJcbiAvL3Jlcy5zZW5kKGVycm9yKTtcclxuIH1cclxuIGVsc2UgaWYgKGJvZHkpIHtcclxuIGNvbnNvbGUubG9nKCdib2R5IDonK0pTT04uc3RyaW5naWZ5KGJvZHkpKTtcclxuIC8vcmVzLnNlbmQoYm9keSk7XHJcbiB9XHJcbiB9KTtcclxuIC8vIHJlcy5zZW5kKHRva2VuKTtcclxuIH0qL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVBpY3R1cmUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgX19kaXJuYW1lID0gJ3NyYy9zZXJ2ZXIvYXBwL2ZyYW1ld29yay9wdWJsaWMvcHJvZmlsZWltYWdlJztcclxuICB2YXIgZm9ybSA9IG5ldyBtdWx0aXBhcnR5LkZvcm0oe3VwbG9hZERpcjogX19kaXJuYW1lfSk7XHJcbiAgZm9ybS5wYXJzZShyZXEsIChlcnI6IEVycm9yLCBmaWVsZHM6IGFueSwgZmlsZXM6IGFueSkgPT4ge1xyXG4gICAgaWYgKGVycikge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRElSRUNUT1JZX05PVF9GT1VORCxcclxuICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRElSRUNUT1JZX05PVF9GT1VORCxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgcGF0aCA9IEpTT04uc3RyaW5naWZ5KGZpbGVzLmZpbGVbMF0ucGF0aCk7XHJcbiAgICAgIHZhciBpbWFnZV9wYXRoID0gZmlsZXMuZmlsZVswXS5wYXRoO1xyXG4gICAgICB2YXIgb3JpZ2luYWxGaWxlbmFtZSA9IEpTT04uc3RyaW5naWZ5KGltYWdlX3BhdGguc3Vic3RyKGZpbGVzLmZpbGVbMF0ucGF0aC5sYXN0SW5kZXhPZignLycpICsgMSkpO1xyXG4gICAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuXHJcbiAgICAgIHVzZXJTZXJ2aWNlLlVwbG9hZEltYWdlKHBhdGgsIG9yaWdpbmFsRmlsZW5hbWUsIGZ1bmN0aW9uIChlcnI6IGFueSwgdGVtcGF0aDogYW55KSB7XHJcbiAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgbmV4dChlcnIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIHZhciBteXBhdGggPSB0ZW1wYXRoO1xyXG5cclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHZhciB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgICAgICAgIHZhciBxdWVyeSA9IHtcIl9pZFwiOiB1c2VyLl9pZH07XHJcblxyXG4gICAgICAgICAgICB1c2VyU2VydmljZS5maW5kQnlJZCh1c2VyLl9pZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghcmVzdWx0LmlzQ2FuZGlkYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgIGxldCByZWNydWl0ZXJTZXJ2aWNlOiBSZWNydWl0ZXJTZXJ2aWNlID0gbmV3IFJlY3J1aXRlclNlcnZpY2UoKTtcclxuICAgICAgICAgICAgICAgICAgbGV0IHF1ZXJ5MSA9IHtcInVzZXJJZFwiOiByZXN1bHQuX2lkfTtcclxuICAgICAgICAgICAgICAgICAgcmVjcnVpdGVyU2VydmljZS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5MSwge2NvbXBhbnlfbG9nbzogbXlwYXRofSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzcG9uc2UxKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICB1c2VyU2VydmljZS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB7cGljdHVyZTogbXlwYXRofSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF1dGg6IEF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe2FjY2Vzc190b2tlbjogdG9rZW4sIGRhdGE6IHJlc3BvbnNlfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIHVzZXJTZXJ2aWNlLmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHtwaWN0dXJlOiBteXBhdGh9LCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdmFyIGF1dGg6IEF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgICAgICAgICAgICAgICAgICAgIHZhciB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHthY2Nlc3NfdG9rZW46IHRva2VuLCBkYXRhOiByZXNwb25zZX0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICB9KTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVDb21wYW55RGV0YWlscyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuXHJcbiAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgdmFyIHVzZXIgPSByZXEudXNlcjtcclxuICB2YXIgcXVlcnkgPSB7XCJfaWRcIjogdXNlci5faWR9O1xyXG4gIC8qdXNlclNlcnZpY2UuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwge3BpY3R1cmU6IG15cGF0aH0sIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICBpZiAoZXJyb3IpIHtcclxuICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGVycm9yfSk7XHJcbiAgIH1cclxuICAgZWxzZXtcclxuICAgdmFyIGF1dGg6QXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc3VsdCk7XHJcbiAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHthY2Nlc3NfdG9rZW46IHRva2VuLCBkYXRhOiByZXN1bHR9KTtcclxuICAgfVxyXG4gICB9KTsqL1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBsb2FkZG9jdW1lbnRzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gIF9fZGlybmFtZSA9ICdzcmMvc2VydmVyL2FwcC9mcmFtZXdvcmsvcHVibGljL3VwbG9hZGVkLWRvY3VtZW50JztcclxuXHJcbiAgdmFyIGZvcm0gPSBuZXcgbXVsdGlwYXJ0eS5Gb3JtKHt1cGxvYWREaXI6IF9fZGlybmFtZX0pO1xyXG4gIGZvcm0ucGFyc2UocmVxLCAoZXJyOiBFcnJvciwgZmllbGRzOiBhbnksIGZpbGVzOiBhbnkpID0+IHtcclxuICAgIGlmIChlcnIpIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0RJUkVDVE9SWV9OT1RfRk9VTkQsXHJcbiAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0RJUkVDVE9SWV9OT1RfRk9VTkQsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAzXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyIHBhdGggPSBKU09OLnN0cmluZ2lmeShmaWxlcy5maWxlWzBdLnBhdGgpO1xyXG4gICAgICB2YXIgZG9jdW1lbnRfcGF0aCA9IGZpbGVzLmZpbGVbMF0ucGF0aDtcclxuICAgICAgdmFyIG9yaWdpbmFsRmlsZW5hbWUgPSBKU09OLnN0cmluZ2lmeShkb2N1bWVudF9wYXRoLnN1YnN0cihmaWxlcy5maWxlWzBdLnBhdGgubGFzdEluZGV4T2YoJy8nKSArIDEpKTtcclxuXHJcbiAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICBcInN0YXR1c1wiOiBNZXNzYWdlcy5TVEFUVVNfU1VDQ0VTUyxcclxuICAgICAgICBcImRhdGFcIjoge1xyXG4gICAgICAgICAgXCJkb2N1bWVudFwiOiBkb2N1bWVudF9wYXRoXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8qICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgICB1c2VyU2VydmljZS5VcGxvYWREb2N1bWVudHMocGF0aCwgb3JpZ2luYWxGaWxlbmFtZSwgZnVuY3Rpb24gKGVycjphbnksIHRlbXBhdGg6YW55KSB7XHJcbiAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICBjb25zb2xlLmxvZyhcIkVyciBtZXNzYWdlIG9mIHVwbG9hZGRvY3VtZW50IGlzOlwiLGVycik7XHJcbiAgICAgICBuZXh0KGVycik7XHJcbiAgICAgICB9XHJcbiAgICAgICBlbHNlIHtcclxuICAgICAgIHZhciBteXBhdGggPSB0ZW1wYXRoO1xyXG4gICAgICAgdHJ5IHtcclxuICAgICAgIHZhciB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgICB2YXIgcXVlcnkgPSB7XCJfaWRcIjogdXNlci5faWR9O1xyXG4gICAgICAgdXNlclNlcnZpY2UuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwge2RvY3VtZW50MTogbXlwYXRofSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlcnJvcn0pO1xyXG4gICAgICAgfVxyXG4gICAgICAgZWxzZXtcclxuICAgICAgIHZhciBhdXRoOkF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgICAgIHZhciB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQocmVzdWx0KTtcclxuICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHthY2Nlc3NfdG9rZW46IHRva2VuLCBkYXRhOiByZXN1bHR9KTtcclxuICAgICAgIH1cclxuICAgICAgIH0pO1xyXG4gICAgICAgfVxyXG4gICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgIG5leHQoe1xyXG4gICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICBzdGFja1RyYWNlOm5ldyBFcnJvcigpLFxyXG4gICAgICAgY29kZTogNDAzXHJcbiAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIH0pOyovXHJcbiAgICB9XHJcblxyXG4gIH0pO1xyXG5cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwcm9maWxlY3JlYXRlKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcblxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNDAzXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcHJvZmVzc2lvbmFsZGF0YShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG5cclxuICAgIHZhciBuZXdVc2VyID0gcmVxLmJvZHk7XHJcblxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNDAzXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZW1wbG95bWVudGRhdGEocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuXHJcbiAgICB2YXIgbmV3VXNlciA9IHJlcS5ib2R5O1xyXG5cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBuZXh0KHtcclxuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgIGNvZGU6IDQwM1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGFuZ2VUaGVtZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICB0cnkge1xyXG4gICAgdmFyIHVzZXIgPSByZXEudXNlcjtcclxuICAgIHZhciBwYXJhbXMgPSByZXEucXVlcnk7XHJcbiAgICBkZWxldGUgcGFyYW1zLmFjY2Vzc190b2tlbjtcclxuICAgIHZhciBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIHZhciBxdWVyeSA9IHtcIl9pZFwiOiByZXEudXNlci5pZH07XHJcbiAgICB2YXIgdXBkYXRlRGF0YSA9IHtcImN1cnJlbnRfdGhlbWVcIjogcmVxLmJvZHkuY3VycmVudF90aGVtZX07XHJcbiAgICB1c2VyU2VydmljZS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKTtcclxuXHJcbiAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlbiwgZGF0YTogcmVzdWx0XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNDAzXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxufVxyXG4iXX0=
