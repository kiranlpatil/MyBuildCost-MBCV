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
                            code: 403
                        });
                    }
                    else {
                        if (isSame) {
                            var auth = new AuthInterceptor();
                            var token = auth.issueTokenWithUid(result[0]);
                            if (result[0].isAdmin) {
                                adminController.sendLoginInfoToAdmin(result[0].email, req.connection.remoteAddress, params.latitude, params.longitude);
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
                            code: 403
                        });
                    }
                    else {
                        if (isPassSame) {
                            if (result[0].isCandidate === true) {
                                next({
                                    reason: Messages.MSG_ERROR_RSN_INVALID_REGISTRATION_STATUS,
                                    message: Messages.MSG_ERROR_VERIFY_CANDIDATE_ACCOUNT,
                                    code: 403
                                });
                            }
                            else {
                                next({
                                    reason: Messages.MSG_ERROR_RSN_INVALID_REGISTRATION_STATUS,
                                    message: Messages.MSG_ERROR_VERIFY_ACCOUNT,
                                    code: 403
                                });
                            }
                        }
                        else {
                            next({
                                reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                                message: Messages.MSG_ERROR_WRONG_PASSWORD,
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
                    code: 403
                });
            }
        });
    }
    catch (e) {
        res.status(403).send({ message: e.message });
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
                res.status(401).send({
                    "status": Messages.STATUS_ERROR,
                    "data": {
                        "message": Messages.MSG_ERROR_RSN_USER_NOT_FOUND
                    }
                });
            }
        });
    }
    catch (e) {
        res.status(403).send({ message: e.message });
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
        res.status(403).send({ message: e.message });
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
        res.status(403).send({ message: e.message });
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
        res.status(403).send({ message: e.message });
    }
}
exports.mail = mail;
function create(req, res, next) {
    try {
        var newUser = req.body;
        var userService = new UserService();
        userService.createUser(newUser, function (error, result) {
            if (error) {
                console.log("crt user error", error);
                if (error == Messages.MSG_ERROR_CHECK_EMAIL_PRESENT) {
                    next({
                        reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
                        message: Messages.MSG_ERROR_VERIFY_ACCOUNT,
                        code: 403
                    });
                }
                else if (error == Messages.MSG_ERROR_CHECK_MOBILE_PRESENT) {
                    next({
                        reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
                        message: Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER,
                        code: 403
                    });
                }
                else {
                    next({
                        reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
                        message: Messages.MSG_ERROR_USER_WITH_EMAIL_PRESENT,
                        code: 403
                    });
                }
            }
            else {
                var auth = new AuthInterceptor();
                console.log('result', JSON.stringify(result));
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
        res.status(403).send({ "status": Messages.STATUS_ERROR, "error_message": e.message });
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
                        code: 403
                    });
                }
                else if (error == Messages.MSG_ERROR_CHECK_INVALID_ACCOUNT) {
                    next({
                        reason: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
                        message: Messages.MSG_ERROR_USER_NOT_FOUND,
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
        res.status(403).send({ message: e.message });
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
        res.status(403).send({ message: e.message });
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
        res.status(403).send({ message: e.message });
    }
}
exports.pushNotifications = pushNotifications;
function updateNotifications(req, res, next) {
    try {
        var user = req.user;
        var body_data = req.body;
        console.log('Notification id :' + JSON.stringify(body_data));
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
        res.status(403).send({ message: e.message });
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
                            code: 401
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
        res.status(403).send({ message: e.message });
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
        res.status(403).send({ message: e.message });
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
                            code: 401
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
        res.status(403).send({ message: e.message });
    }
}
exports.updateProfileField = updateProfileField;
function retrieve(req, res, next) {
    try {
        var userService = new UserService();
        var params = req.query;
        delete params.access_token;
        var user = req.user;
        var auth = new AuthInterceptor();
        userService.retrieve(params, function (error, result) {
            if (error) {
                next({
                    reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                    message: Messages.MSG_ERROR_WRONG_TOKEN,
                    code: 401
                });
            }
            else {
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
        });
    }
    catch (e) {
        res.status(403).send({ message: e.message });
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
                res.status(403).send({ message: 'Error in creating hash using bcrypt' });
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
        res.status(403).send({ message: e.message });
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
                    code: 403
                });
            }
            else {
                if (isSame) {
                    if (req.body.current_password === req.body.new_password) {
                        next({
                            reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                            message: Messages.MSG_ERROR_SAME_NEW_PASSWORD,
                            code: 401
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
                        code: 401
                    });
                }
            }
        });
    }
    catch (e) {
        res.status(403).send({ message: e.message });
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
                    code: 401
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
        res.status(403).send({ message: e.message });
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
                    code: 403
                });
            }
            else if (result.length > 0 && result[0].isActivated === false) {
                next({
                    reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
                    message: Messages.MSG_ERROR_ACCOUNT_STATUS,
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
                                code: 403
                            });
                        }
                        else {
                            next({
                                reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
                                message: Messages.MSG_ERROR_WHILE_CONTACTING,
                                code: 403
                            });
                        }
                    }
                    else {
                        console.log("email change success");
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
        res.status(403).send({ message: e.message });
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
                code: 403
            });
        }
    }
    catch (e) {
        res.status(403).send({ message: e.message });
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
                code: 403
            });
        }
    }
    catch (e) {
        res.status(403).send({ message: e.message });
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
        res.status(403).send({ message: e.message });
    }
}
exports.verifyAccount = verifyAccount;
function verifyChangedEmailId(req, res, next) {
    try {
        console.log("Changemailverification hit");
        var user = req.user;
        var params = req.query;
        delete params.access_token;
        var userService = new UserService();
        var query = { "_id": user._id };
        var updateData = { "email": user.temp_email, "temp_email": user.email };
        userService.findOneAndUpdate(query, updateData, { new: true }, function (error, result) {
            if (error) {
                console.log("Changemailverification hit error", error);
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
        res.status(403).send({ message: e.message });
    }
}
exports.verifyChangedEmailId = verifyChangedEmailId;
function getIndustry(req, res) {
    __dirname = './';
    var filepath = "industry.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        res.status(403).send({ message: e.message });
    }
}
exports.getIndustry = getIndustry;
function getCompanySize(req, res) {
    __dirname = './';
    var filepath = "company-size.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        res.status(403).send({ message: e.message });
    }
}
exports.getCompanySize = getCompanySize;
function getAddress(req, res) {
    __dirname = './';
    var filepath = "address.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        res.status(403).send({ message: e.message });
    }
}
exports.getAddress = getAddress;
function getRealocation(req, res) {
    __dirname = './';
    var filepath = "realocation.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        res.status(403).send({ message: e.message });
    }
}
exports.getRealocation = getRealocation;
function getEducation(req, res) {
    __dirname = './';
    var filepath = "education.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        res.status(403).send({ message: e.message });
    }
}
exports.getEducation = getEducation;
function getCloseJobReasons(req, res) {
    __dirname = './';
    var filepath = "closeJob.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        res.status(403).send({ message: e.message });
    }
}
exports.getCloseJobReasons = getCloseJobReasons;
function getExperience(req, res) {
    __dirname = './';
    var filepath = "experienceList.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        res.status(403).send({ message: e.message });
    }
}
exports.getExperience = getExperience;
function getCurrentSalary(req, res) {
    __dirname = './';
    var filepath = "currentsalaryList.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        res.status(403).send({ message: e.message });
    }
}
exports.getCurrentSalary = getCurrentSalary;
function getNoticePeriod(req, res) {
    __dirname = './';
    var filepath = "noticeperiodList.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        res.status(403).send({ message: e.message });
    }
}
exports.getNoticePeriod = getNoticePeriod;
function getIndustryExposure(req, res) {
    __dirname = './';
    var filepath = "industryexposureList.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        res.status(403).send({ message: e.message });
    }
}
exports.getIndustryExposure = getIndustryExposure;
function getSearchedCandidate(req, res) {
    __dirname = './';
    var filepath = "candidate.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        res.status(403).send({ message: e.message });
    }
}
exports.getSearchedCandidate = getSearchedCandidate;
function getCountries(req, res) {
    __dirname = './';
    var filepath = "country.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        res.status(403).send({ message: e.message });
    }
}
exports.getCountries = getCountries;
function getIndiaStates(req, res) {
    __dirname = './';
    var filepath = "indiaStates.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        res.status(403).send({ message: e.message });
    }
}
exports.getIndiaStates = getIndiaStates;
function getFunction(req, res) {
    __dirname = './';
    var filepath = "function.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        res.status(403).send({ message: e.message });
    }
}
exports.getFunction = getFunction;
function getRole(req, res) {
    __dirname = './';
    var filepath = "roles.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        res.status(403).send({ message: e.message });
    }
}
exports.getRole = getRole;
function getProficiency(req, res) {
    __dirname = './';
    var filepath = "proficiency.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        res.status(403).send({ message: e.message });
    }
}
exports.getProficiency = getProficiency;
function getDomain(req, res) {
    __dirname = './';
    var filepath = "domain.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        res.status(403).send({ message: e.message });
    }
}
exports.getDomain = getDomain;
function getCapability(req, res) {
    __dirname = './';
    var filepath = "capability.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        res.status(403).send({ message: e.message });
    }
}
exports.getCapability = getCapability;
function getComplexity(req, res) {
    __dirname = './';
    var filepath = "complexity.json";
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        res.status(403).send({ message: e.message });
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
                    code: 403
                });
            }
        });
    }
    catch (e) {
        res.status(403).send({ message: e.message });
    }
}
exports.fblogin = fblogin;
function googlelogin(req, res, next) {
    try {
        var userService = new UserService();
        var params = req.user;
        console.log("params in google login", params);
        var auth = new AuthInterceptor();
        userService.retrieve(params, function (error, result) {
            if (error) {
                next(error);
            }
            else if (result.length > 0) {
                console.log("result sent to frnt aftr g+login");
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
                    code: 403
                });
            }
        });
    }
    catch (e) {
        res.status(403).send({ message: e.message });
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
                code: 401
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
                                res.status(403).send({ message: error });
                            }
                            else {
                                if (!result.isCandidate) {
                                    var recruiterService = new RecruiterService();
                                    var query1 = { "userId": result._id };
                                    recruiterService.findOneAndUpdate(query1, { company_logo: mypath }, { new: true }, function (error, response1) {
                                        if (error) {
                                            res.status(403).send({ message: error });
                                        }
                                        else {
                                            console.log("-----------------------------------------------------------");
                                            console.log("updated");
                                            userService.findOneAndUpdate(query, { picture: mypath }, { new: true }, function (error, response) {
                                                if (error) {
                                                    res.status(403).send({ message: error });
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
                                            res.status(403).send({ message: error });
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
                        res.status(403).send({ message: e.message });
                    }
                }
            });
        }
    });
}
exports.updatePicture = updatePicture;
function updateCompanyDetails(req, res, next) {
    console.log("UpdatePicture user Controller is been hit req ");
    var userService = new UserService();
    var user = req.user;
    var query = { "_id": user._id };
}
exports.updateCompanyDetails = updateCompanyDetails;
function uploaddocuments(req, res, next) {
    __dirname = 'src/server/app/framework/public/uploaded-document';
    var form = new multiparty.Form({ uploadDir: __dirname });
    console.log("updatedocuments user Controller is been hit req ", req);
    form.parse(req, function (err, fields, files) {
        if (err) {
            next({
                reason: Messages.MSG_ERROR_RSN_DIRECTORY_NOT_FOUND,
                message: Messages.MSG_ERROR_DIRECTORY_NOT_FOUND,
                code: 401
            });
        }
        else {
            console.log("fields of doc upload:" + fields);
            console.log("files of doc upload:" + files);
            var path = JSON.stringify(files.file[0].path);
            console.log("Path url of doc upload:" + path);
            var document_path = files.file[0].path;
            console.log("Document path of doc upload:" + document_path);
            var originalFilename = JSON.stringify(document_path.substr(files.file[0].path.lastIndexOf('/') + 1));
            console.log("Original FileName of doc upload:" + originalFilename);
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
function profilecreate(req, res) {
    try {
        console.log("In profile create");
    }
    catch (e) {
        res.status(403).send({ message: e.message });
    }
}
exports.profilecreate = profilecreate;
function professionaldata(req, res) {
    try {
        var newUser = req.body;
        console.log("newUser", JSON.stringify(newUser));
    }
    catch (e) {
        res.status(403).send({ "status": Messages.STATUS_ERROR, "error_message": e.message });
    }
}
exports.professionaldata = professionaldata;
function employmentdata(req, res) {
    try {
        var newUser = req.body;
        console.log("newUser", JSON.stringify(newUser));
    }
    catch (e) {
        res.status(403).send({ "status": Messages.STATUS_ERROR, "error_message": e.message });
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
        res.status(403).send({ message: e.message });
    }
}
exports.changeTheme = changeTheme;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvdXNlci5jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsdUNBQXlDO0FBQ3pDLGlFQUFvRTtBQUdwRSxzREFBeUQ7QUFDekQsZ0VBQW1FO0FBQ25FLDZDQUFnRDtBQUVoRCxnRUFBbUU7QUFDbkUsb0RBQXNEO0FBR3RELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUUvQixlQUFzQixHQUFvQixFQUFFLEdBQXFCLEVBQUUsSUFBUztJQUMxRSxJQUFJLENBQUM7UUFFSCxJQUFJLFdBQVcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQ3BDLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDdEIsT0FBTyxNQUFNLENBQUMsWUFBWSxDQUFDO1FBQzNCLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBQyxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07WUFDMUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDZCxDQUFDO1lBRUQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDN0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsVUFBQyxHQUFTLEVBQUUsTUFBWTtvQkFDMUUsRUFBRSxDQUFBLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDUCxJQUFJLENBQUM7NEJBQ0gsTUFBTSxFQUFFLFFBQVEsQ0FBQyx5Q0FBeUM7NEJBQzFELE9BQU8sRUFBRSxRQUFRLENB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ZSxFQUFFLENBQUM7UUFDbEQsSUFBSSxXQUFXLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztRQUNwQyxJQUFJLEtBQUssR0FBRyxFQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBQyxDQUFDO1FBQ2pDLElBQUksVUFBVSxHQUFHLEVBQUMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFDLENBQUM7UUFDM0QsV0FBVyxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFDLEVBQUUsVUFBQyxLQUFLLEVBQUUsTUFBTTtZQUN6RSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNWLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNkLENBQUM7WUFDRCxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRXpDLEdBQUcsQ0FBQyxJQUFJLENBQUM7b0JBQ1AsWUFBWSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTTtpQkFDbEMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNELEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDVCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQztJQUM3QyxDQUFDO0FBR0gsQ0FBQztBQTNCRCxrQ0EyQkMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9jb250cm9sbGVycy91c2VyLmNvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XHJcbmltcG9ydCAqIGFzIG11bHRpcGFydHkgZnJvbSBcIm11bHRpcGFydHlcIjtcclxuaW1wb3J0IEF1dGhJbnRlcmNlcHRvciA9IHJlcXVpcmUoXCIuLi9pbnRlcmNlcHRvci9hdXRoLmludGVyY2VwdG9yXCIpO1xyXG5pbXBvcnQgU2VuZE1haWxTZXJ2aWNlID0gcmVxdWlyZShcIi4uL3NlcnZpY2VzL3NlbmRtYWlsLnNlcnZpY2VcIik7XHJcbmltcG9ydCBVc2VyTW9kZWwgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzcy9tb2RlbC91c2VyLm1vZGVsXCIpO1xyXG5pbXBvcnQgVXNlclNlcnZpY2UgPSByZXF1aXJlKFwiLi4vc2VydmljZXMvdXNlci5zZXJ2aWNlXCIpO1xyXG5pbXBvcnQgUmVjcnVpdGVyU2VydmljZSA9IHJlcXVpcmUoXCIuLi9zZXJ2aWNlcy9yZWNydWl0ZXIuc2VydmljZVwiKTtcclxuaW1wb3J0IE1lc3NhZ2VzID0gcmVxdWlyZShcIi4uL3NoYXJlZC9tZXNzYWdlc1wiKTtcclxuaW1wb3J0IFJlc3BvbnNlU2VydmljZSA9IHJlcXVpcmUoXCIuLi9zaGFyZWQvcmVzcG9uc2Uuc2VydmljZVwiKTtcclxuaW1wb3J0IENhbmRpZGF0ZVNlcnZpY2UgPSByZXF1aXJlKFwiLi4vc2VydmljZXMvY2FuZGlkYXRlLnNlcnZpY2VcIik7XHJcbmltcG9ydCBhZG1pbkNvbnRyb2xsZXI9IHJlcXVpcmUoXCIuL2FkbWluLmNvbnRyb2xsZXJcIik7XHJcbmltcG9ydCBSZWNydWl0ZXJNb2RlbCA9IHJlcXVpcmUoXCIuLi9kYXRhYWNjZXNzL21vZGVsL3JlY3J1aXRlci5tb2RlbFwiKTtcclxuXHJcbnZhciBiY3J5cHQgPSByZXF1aXJlKCdiY3J5cHQnKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2dpbihyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG5cclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgdmFyIHBhcmFtcyA9IHJlcS5ib2R5O1xyXG4gICAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XHJcbiAgICB1c2VyU2VydmljZS5yZXRyaWV2ZSh7XCJlbWFpbFwiOiBwYXJhbXMuZW1haWx9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDAgJiYgcmVzdWx0WzBdLmlzQWN0aXZhdGVkID09PSB0cnVlKSB7XHJcbiAgICAgICAgYmNyeXB0LmNvbXBhcmUocGFyYW1zLnBhc3N3b3JkLCByZXN1bHRbMF0ucGFzc3dvcmQsIChlcnIgOiBhbnksIGlzU2FtZSA6IGFueSk9PiB7XHJcbiAgICAgICAgICBpZihlcnIpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfUkVHSVNUUkFUSU9OX1NUQVRVUyxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0NBTkRJREFURV9BQ0NPVU5ULFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgaWYoaXNTYW1lKXtcclxuICAgICAgICAgICAgICB2YXIgYXV0aCA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgICAgICAgICAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc3VsdFswXSk7XHJcbiAgICAgICAgICAgICAgaWYocmVzdWx0WzBdLmlzQWRtaW4pe1xyXG4gICAgICAgICAgICAgICAgYWRtaW5Db250cm9sbGVyLnNlbmRMb2dpbkluZm9Ub0FkbWluKHJlc3VsdFswXS5lbWFpbCxyZXEuY29ubmVjdGlvbi5yZW1vdGVBZGRyZXNzLHBhcmFtcy5sYXRpdHVkZSxwYXJhbXMubG9uZ2l0dWRlKTtcclxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgICAgICAgICAgXCJzdGF0dXNcIjogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgICAgICAgICAgIFwiZGF0YVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJlbWFpbFwiOiByZXN1bHRbMF0uZW1haWwsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJmaXJzdF9uYW1lXCI6IHJlc3VsdFswXS5maXJzdF9uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiX2lkXCI6IHJlc3VsdFswXS5faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJjdXJyZW50X3RoZW1lXCI6IHJlc3VsdFswXS5jdXJyZW50X3RoZW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW5kX3VzZXJfaWRcIjogcmVzdWx0WzBdLl9pZCxcclxuICAgICAgICAgICAgICAgICAgICBcInBpY3R1cmVcIjogcmVzdWx0WzBdLnBpY3R1cmUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJtb2JpbGVfbnVtYmVyXCI6IHJlc3VsdFswXS5tb2JpbGVfbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaXNDYW5kaWRhdGVcIjogcmVzdWx0WzBdLmlzQ2FuZGlkYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaXNBZG1pblwiOiByZXN1bHRbMF0uaXNBZG1pblxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRva2VuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHRbMF0uaXNDYW5kaWRhdGUgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgIHZhciByZWNydWl0ZXJTZXJ2aWNlID0gbmV3IFJlY3J1aXRlclNlcnZpY2UoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIHJlY3J1aXRlclNlcnZpY2UucmV0cmlldmUoe1widXNlcklkXCI6IHJlc3VsdFswXS5faWR9LCAoZXJyb3IsIHJlY3J1aXRlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN0YXR1c1wiOiBNZXNzYWdlcy5TVEFUVVNfU1VDQ0VTUyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImVtYWlsXCI6IHJlc3VsdFswXS5lbWFpbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcIl9pZFwiOiByZXN1bHRbMF0uX2lkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiZW5kX3VzZXJfaWRcIjogcmVjcnVpdGVyWzBdLl9pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImN1cnJlbnRfdGhlbWVcIjogcmVzdWx0WzBdLmN1cnJlbnRfdGhlbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwaWN0dXJlXCI6IHJlc3VsdFswXS5waWN0dXJlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29tcGFueV9oZWFkcXVhcnRlcl9jb3VudHJ5XCI6IHJlY3J1aXRlclswXS5jb21wYW55X2hlYWRxdWFydGVyX2NvdW50cnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb21wYW55X25hbWVcIjogcmVjcnVpdGVyWzBdLmNvbXBhbnlfbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcInNldE9mRG9jdW1lbnRzXCI6IHJlY3J1aXRlclswXS5zZXRPZkRvY3VtZW50cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbXBhbnlfc2l6ZVwiOiByZWNydWl0ZXJbMF0uY29tcGFueV9zaXplLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiaXNSZWNydWl0aW5nRm9yc2VsZlwiOiByZWNydWl0ZXJbMF0uaXNSZWNydWl0aW5nRm9yc2VsZixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcIm1vYmlsZV9udW1iZXJcIjogcmVzdWx0WzBdLm1vYmlsZV9udW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpc0NhbmRpZGF0ZVwiOiByZXN1bHRbMF0uaXNDYW5kaWRhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpc0FkbWluXCI6IHJlc3VsdFswXS5pc0FkbWluXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2Vzc190b2tlbjogdG9rZW5cclxuICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgdmFyIGNhbmRpZGF0ZVNlcnZpY2UgPSBuZXcgQ2FuZGlkYXRlU2VydmljZSgpO1xyXG4gICAgICAgICAgICAgICAgICBjYW5kaWRhdGVTZXJ2aWNlLnJldHJpZXZlKHtcInVzZXJJZFwiOiByZXN1bHRbMF0uX2lkfSwgKGVycm9yLCBjYW5kaWRhdGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdGF0dXNcIjogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0YVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJmaXJzdF9uYW1lXCI6IHJlc3VsdFswXS5maXJzdF9uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwibGFzdF9uYW1lXCI6IHJlc3VsdFswXS5sYXN0X25hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlbWFpbFwiOiByZXN1bHRbMF0uZW1haWwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJfaWRcIjogcmVzdWx0WzBdLl9pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImVuZF91c2VyX2lkXCI6IGNhbmRpZGF0ZVswXS5faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjdXJyZW50X3RoZW1lXCI6IHJlc3VsdFswXS5jdXJyZW50X3RoZW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwicGljdHVyZVwiOiByZXN1bHRbMF0ucGljdHVyZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcIm1vYmlsZV9udW1iZXJcIjogcmVzdWx0WzBdLm1vYmlsZV9udW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpc0NhbmRpZGF0ZVwiOiByZXN1bHRbMF0uaXNDYW5kaWRhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpc0FkbWluXCI6IHJlc3VsdFswXS5pc0FkbWluLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiaXNDb21wbGV0ZWRcIjogY2FuZGlkYXRlWzBdLmlzQ29tcGxldGVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiaXNTdWJtaXR0ZWRcIjogY2FuZGlkYXRlWzBdLmlzU3VibWl0dGVkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiZ3VpZGVfdG91clwiOiByZXN1bHRbMF0uZ3VpZGVfdG91clxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRva2VuXHJcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XUk9OR19QQVNTV09SRCxcclxuICAgICAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDAgJiYgcmVzdWx0WzBdLmlzQWN0aXZhdGVkID09PSBmYWxzZSkge1xyXG4gICAgICAgIGJjcnlwdC5jb21wYXJlKHBhcmFtcy5wYXNzd29yZCwgcmVzdWx0WzBdLnBhc3N3b3JkLCAoZXJyIDogYW55LCBpc1Bhc3NTYW1lIDogYW55KT0+IHtcclxuICAgICAgICAgIGlmKGVycikge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9SRUdJU1RSQVRJT05fU1RBVFVTLFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQ0FORElEQVRFX0FDQ09VTlQsXHJcbiAgICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICBpZihpc1Bhc3NTYW1lKSB7XHJcbiAgICAgICAgICAgICAgaWYocmVzdWx0WzBdLmlzQ2FuZGlkYXRlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfUkVHSVNUUkFUSU9OX1NUQVRVUyxcclxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1ZFUklGWV9DQU5ESURBVEVfQUNDT1VOVCxcclxuICAgICAgICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX1JFR0lTVFJBVElPTl9TVEFUVVMsXHJcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQUNDT1VOVCxcclxuICAgICAgICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dST05HX1BBU1NXT1JELFxyXG4gICAgICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBuZXh0KHtcclxuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9VU0VSX05PVF9GT1VORCxcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9VU0VSX05PVF9QUkVTRU5ULFxyXG4gICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVPdHAocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgdmFyIHVzZXIgPSByZXEudXNlcjtcclxuICAgIHZhciBwYXJhbXMgPSByZXEuYm9keTsgIC8vbW9iaWxlX251bWJlcihuZXcpXHJcblxyXG4gICAgdmFyIERhdGEgPSB7XHJcbiAgICAgIG5ld19tb2JpbGVfbnVtYmVyOiBwYXJhbXMubW9iaWxlX251bWJlcixcclxuICAgICAgb2xkX21vYmlsZV9udW1iZXI6IHVzZXIubW9iaWxlX251bWJlcixcclxuICAgICAgX2lkOiB1c2VyLl9pZFxyXG4gICAgfTtcclxuICAgIHVzZXJTZXJ2aWNlLmdlbmVyYXRlT3RwKERhdGEsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGlmIChlcnJvciA9PSBNZXNzYWdlcy5NU0dfRVJST1JfQ0hFQ0tfTU9CSUxFX1BSRVNFTlQpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRVhJU1RJTkdfVVNFUixcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTl9NT0JJTEVfTlVNQkVSLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmIChyZXN1bHQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgIFwic3RhdHVzXCI6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgXCJkYXRhXCI6IHtcclxuICAgICAgICAgICAgXCJtZXNzYWdlXCI6IE1lc3NhZ2VzLk1TR19TVUNDRVNTX09UUFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAxKS5zZW5kKHtcclxuICAgICAgICAgIFwic3RhdHVzXCI6IE1lc3NhZ2VzLlNUQVRVU19FUlJPUixcclxuICAgICAgICAgIFwiZGF0YVwiOiB7XHJcbiAgICAgICAgICAgIFwibWVzc2FnZVwiOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX1VTRVJfTk9UX0ZPVU5EXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG5cclxuICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHZlcmlmaWNhdGlvbk1haWwocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgdmFyIHVzZXIgPSByZXEudXNlcjtcclxuICAgIHZhciBwYXJhbXMgPSByZXEuYm9keTtcclxuICAgIHVzZXJTZXJ2aWNlLnNlbmRWZXJpZmljYXRpb25NYWlsKHBhcmFtcywgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fV0hJTEVfQ09OVEFDVElORyxcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XSElMRV9DT05UQUNUSU5HLFxyXG4gICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgXCJzdGF0dXNcIjogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgICBcImRhdGFcIjoge1wibWVzc2FnZVwiOiBNZXNzYWdlcy5NU0dfU1VDQ0VTU19FTUFJTF9SRUdJU1RSQVRJT059XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG5cclxuICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHJlY3J1aXRlclZlcmlmaWNhdGlvbk1haWwocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgdmFyIHVzZXIgPSByZXEudXNlcjtcclxuICAgIHZhciBwYXJhbXMgPSByZXEuYm9keTtcclxuICAgIHVzZXJTZXJ2aWNlLnNlbmRSZWNydWl0ZXJWZXJpZmljYXRpb25NYWlsKHBhcmFtcywgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fV0hJTEVfQ09OVEFDVElORyxcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XSElMRV9DT05UQUNUSU5HLFxyXG4gICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgXCJzdGF0dXNcIjogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgICBcImRhdGFcIjoge1wibWVzc2FnZVwiOiBNZXNzYWdlcy5NU0dfU1VDQ0VTU19FTUFJTF9SRUdJU1RSQVRJT059XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG5cclxuICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIG1haWwocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgdmFyIHBhcmFtcyA9IHJlcS5ib2R5O1xyXG4gICAgdXNlclNlcnZpY2Uuc2VuZE1haWwocGFyYW1zLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KHtcclxuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9XSElMRV9DT05UQUNUSU5HLFxyXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dISUxFX0NPTlRBQ1RJTkcsXHJcbiAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XHJcbiAgICAgICAgICBcInN0YXR1c1wiOiBNZXNzYWdlcy5TVEFUVVNfU1VDQ0VTUyxcclxuICAgICAgICAgIFwiZGF0YVwiOiB7XCJtZXNzYWdlXCI6IE1lc3NhZ2VzLk1TR19TVUNDRVNTX1NVQk1JVFRFRH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcblxyXG4gIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgbmV3VXNlcjogVXNlck1vZGVsID0gPFVzZXJNb2RlbD5yZXEuYm9keTtcclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgLy8gbmV3VXNlci5pc0FjdGl2YXRlZD10cnVlO1xyXG4gICAgdXNlclNlcnZpY2UuY3JlYXRlVXNlcihuZXdVc2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImNydCB1c2VyIGVycm9yXCIsIGVycm9yKTtcclxuXHJcbiAgICAgICAgaWYgKGVycm9yID09IE1lc3NhZ2VzLk1TR19FUlJPUl9DSEVDS19FTUFJTF9QUkVTRU5UKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0VYSVNUSU5HX1VTRVIsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQUNDT1VOVCxcclxuICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZXJyb3IgPT0gTWVzc2FnZXMuTVNHX0VSUk9SX0NIRUNLX01PQklMRV9QUkVTRU5UKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0VYSVNUSU5HX1VTRVIsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT05fTU9CSUxFX05VTUJFUixcclxuICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0VYSVNUSU5HX1VTRVIsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9VU0VSX1dJVEhfRU1BSUxfUFJFU0VOVCxcclxuICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIGF1dGg6IEF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgICAgICBjb25zb2xlLmxvZygncmVzdWx0JyxKU09OLnN0cmluZ2lmeShyZXN1bHQpKTtcclxuICAgICAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc3VsdCk7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgXCJzdGF0dXNcIjogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgICBcImRhdGFcIjoge1xyXG4gICAgICAgICAgICBcInJlYXNvblwiOiBNZXNzYWdlcy5NU0dfU1VDQ0VTU19SRUdJU1RSQVRJT04sXHJcbiAgICAgICAgICAgIFwiZmlyc3RfbmFtZVwiOiBuZXdVc2VyLmZpcnN0X25hbWUsXHJcbiAgICAgICAgICAgIFwibGFzdF9uYW1lXCI6IG5ld1VzZXIubGFzdF9uYW1lLFxyXG4gICAgICAgICAgICBcImVtYWlsXCI6IG5ld1VzZXIuZW1haWwsXHJcbiAgICAgICAgICAgIFwibW9iaWxlX251bWJlclwiOiBuZXdVc2VyLm1vYmlsZV9udW1iZXIsXHJcbiAgICAgICAgICAgIFwiX2lkXCI6IHJlc3VsdC5faWQsXHJcbiAgICAgICAgICAgIFwicGljdHVyZVwiOiBcIlwiXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHtcInN0YXR1c1wiOiBNZXNzYWdlcy5TVEFUVVNfRVJST1IsIFwiZXJyb3JfbWVzc2FnZVwiOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmb3Jnb3RQYXNzd29yZChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICB2YXIgcGFyYW1zID0gcmVxLmJvZHk7ICAgLy9lbWFpbFxyXG5cclxuICAgIC8qIHZhciBsaW5rcSA9cmVxLnVybDtcclxuICAgICB2YXIgZnVsbFVybCA9IGFwcC5nZXQoXCIvYXBpL2FkZHJlc3NcIiwgIHVzZXJDb250cm9sbGVyLmdldEFkZHJlc3MpO3JlcS5wcm90b2NvbCArICc6Ly8nICsgcmVxLmdldCgnaG9zdCcpICsgcmVxLm9yaWdpbmFsVXJsO1xyXG4gICAgIGNvbnNvbGUubG9nKGZ1bGxVcmwpOyovXHJcbiAgICB1c2VyU2VydmljZS5mb3Jnb3RQYXNzd29yZChwYXJhbXMsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcblxyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBpZiAoZXJyb3IgPT0gTWVzc2FnZXMuTVNHX0VSUk9SX0NIRUNLX0lOQUNUSVZFX0FDQ09VTlQpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9VU0VSX05PVF9BQ1RJVkFURUQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9BQ0NPVU5UX1NUQVRVUyxcclxuICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZXJyb3IgPT0gTWVzc2FnZXMuTVNHX0VSUk9SX0NIRUNLX0lOVkFMSURfQUNDT1VOVCkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9VU0VSX05PVF9GT1VORCxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1VTRVJfTk9UX0ZPVU5ELFxyXG4gICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XHJcbiAgICAgICAgICBcInN0YXR1c1wiOiBNZXNzYWdlcy5TVEFUVVNfU1VDQ0VTUyxcclxuICAgICAgICAgIFwiZGF0YVwiOiB7XCJtZXNzYWdlXCI6IE1lc3NhZ2VzLk1TR19TVUNDRVNTX0VNQUlMX0ZPUkdPVF9QQVNTV09SRH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbm90aWZpY2F0aW9ucyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG4gICAgdmFyIHVzZXIgPSByZXEudXNlcjtcclxuICAgIHZhciBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpO1xyXG5cclxuICAgIC8vcmV0cmlldmUgbm90aWZpY2F0aW9uIGZvciBhIHBhcnRpY3VsYXIgdXNlclxyXG4gICAgdmFyIHBhcmFtcyA9IHtfaWQ6IHVzZXIuX2lkfTtcclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG5cclxuICAgIHVzZXJTZXJ2aWNlLnJldHJpZXZlKHBhcmFtcywgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpO1xyXG4gICAgICAgIHJlcy5zZW5kKHtcclxuICAgICAgICAgIFwic3RhdHVzXCI6IFwic3VjY2Vzc1wiLFxyXG4gICAgICAgICAgXCJkYXRhXCI6IHJlc3VsdFswXS5ub3RpZmljYXRpb25zLFxyXG4gICAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuXHJcbiAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcHVzaE5vdGlmaWNhdGlvbnMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICB2YXIgYm9keV9kYXRhID0gcmVxLmJvZHk7XHJcbiAgICB2YXIgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgdmFyIHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKTtcclxuXHJcbiAgICAvL3JldHJpZXZlIG5vdGlmaWNhdGlvbiBmb3IgYSBwYXJ0aWN1bGFyIHVzZXJcclxuICAgIHZhciBwYXJhbXMgPSB7X2lkOiB1c2VyLl9pZH07XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIHZhciBkYXRhID0geyRwdXNoOiB7bm90aWZpY2F0aW9uczogYm9keV9kYXRhfX07XHJcblxyXG4gICAgdXNlclNlcnZpY2UuZmluZE9uZUFuZFVwZGF0ZShwYXJhbXMsIGRhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpO1xyXG4gICAgICAgIHJlcy5zZW5kKHtcclxuICAgICAgICAgIFwic3RhdHVzXCI6IFwiU3VjY2Vzc1wiLFxyXG4gICAgICAgICAgXCJkYXRhXCI6IHJlc3VsdC5ub3RpZmljYXRpb25zLFxyXG5cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcblxyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZU5vdGlmaWNhdGlvbnMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICB2YXIgYm9keV9kYXRhID0gcmVxLmJvZHk7XHJcbiAgICBjb25zb2xlLmxvZygnTm90aWZpY2F0aW9uIGlkIDonICsgSlNPTi5zdHJpbmdpZnkoYm9keV9kYXRhKSk7XHJcbiAgICB2YXIgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgdmFyIHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKTtcclxuXHJcbiAgICB2YXIgcGFyYW1zID0ge19pZDogdXNlci5faWR9O1xyXG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICB2YXIgZGF0YSA9IHtpc19yZWFkOiB0cnVlfTtcclxuXHJcbiAgICB1c2VyU2VydmljZS5maW5kQW5kVXBkYXRlTm90aWZpY2F0aW9uKHBhcmFtcywgZGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHZhciB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQodXNlcik7XHJcbiAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgXCJzdGF0dXNcIjogXCJTdWNjZXNzXCIsXHJcbiAgICAgICAgICBcImRhdGFcIjogcmVzdWx0Lm5vdGlmaWNhdGlvbnMsXHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuXHJcbiAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlRGV0YWlscyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG4gICAgdmFyIG5ld1VzZXJEYXRhOiBVc2VyTW9kZWwgPSA8VXNlck1vZGVsPnJlcS5ib2R5O1xyXG4gICAgdmFyIHBhcmFtcyA9IHJlcS5xdWVyeTtcclxuICAgIGRlbGV0ZSBwYXJhbXMuYWNjZXNzX3Rva2VuO1xyXG4gICAgdmFyIHVzZXIgPSByZXEudXNlcjtcclxuICAgIHZhciBfaWQ6IHN0cmluZyA9IHVzZXIuX2lkO1xyXG5cclxuICAgIHZhciBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIHVzZXJTZXJ2aWNlLnVwZGF0ZShfaWQsIG5ld1VzZXJEYXRhLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB1c2VyU2VydmljZS5yZXRyaWV2ZShfaWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dST05HX1RPS0VOLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwMVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpO1xyXG4gICAgICAgICAgICByZXMuc2VuZCh7XHJcbiAgICAgICAgICAgICAgXCJzdGF0dXNcIjogXCJzdWNjZXNzXCIsXHJcbiAgICAgICAgICAgICAgXCJkYXRhXCI6IHtcclxuICAgICAgICAgICAgICAgIFwiZmlyc3RfbmFtZVwiOiByZXN1bHRbMF0uZmlyc3RfbmFtZSxcclxuICAgICAgICAgICAgICAgIFwibGFzdF9uYW1lXCI6IHJlc3VsdFswXS5sYXN0X25hbWUsXHJcbiAgICAgICAgICAgICAgICBcImVtYWlsXCI6IHJlc3VsdFswXS5lbWFpbCxcclxuICAgICAgICAgICAgICAgIFwibW9iaWxlX251bWJlclwiOiByZXN1bHRbMF0ubW9iaWxlX251bWJlcixcclxuICAgICAgICAgICAgICAgIFwicGljdHVyZVwiOiByZXN1bHRbMF0ucGljdHVyZSxcclxuICAgICAgICAgICAgICAgIFwiX2lkXCI6IHJlc3VsdFswXS51c2VySWQsXHJcbiAgICAgICAgICAgICAgICBcImN1cnJlbnRfdGhlbWVcIjogcmVzdWx0WzBdLmN1cnJlbnRfdGhlbWVcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGFjY2Vzc190b2tlbjogdG9rZW5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlUmVjcnVpdGVyQWNjb3VudERldGFpbHMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciBuZXdVc2VyRGF0YTogUmVjcnVpdGVyTW9kZWwgPSA8UmVjcnVpdGVyTW9kZWw+cmVxLmJvZHk7XHJcbiAgICB2YXIgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgdmFyIF9pZDogc3RyaW5nID0gdXNlci5faWQ7XHJcbiAgICB2YXIgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgdmFyIHJlY3J1aXRlclNlcnZpY2UgPSBuZXcgUmVjcnVpdGVyU2VydmljZSgpO1xyXG4gICAgcmVjcnVpdGVyU2VydmljZS51cGRhdGVEZXRhaWxzKF9pZCwgbmV3VXNlckRhdGEsICAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXMuc2VuZCh7XHJcbiAgICAgICAgICAnc3RhdHVzJzogJ1N1Y2Nlc3MnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVByb2ZpbGVGaWVsZChyZXE6ZXhwcmVzcy5SZXF1ZXN0LCByZXM6ZXhwcmVzcy5SZXNwb25zZSwgbmV4dDphbnkpIHtcclxuICB0cnkge1xyXG4gICAgLy92YXIgbmV3VXNlckRhdGE6IFVzZXJNb2RlbCA9IDxVc2VyTW9kZWw+cmVxLmJvZHk7XHJcblxyXG4gICAgdmFyIHBhcmFtcyA9IHJlcS5xdWVyeTtcclxuICAgIGRlbGV0ZSBwYXJhbXMuYWNjZXNzX3Rva2VuO1xyXG4gICAgdmFyIHVzZXIgPSByZXEudXNlcjtcclxuICAgIHZhciBfaWQ6c3RyaW5nID0gdXNlci5faWQ7XHJcbiAgICB2YXIgZk5hbWU6c3RyaW5nID0gcmVxLnBhcmFtcy5mbmFtZTtcclxuICAgIGlmIChmTmFtZSA9PSAnZ3VpZGVfdG91cicpIHtcclxuICAgICAgdmFyIGRhdGEgPSB7J2d1aWRlX3RvdXInOiByZXEuYm9keX07XHJcbiAgICB9XHJcbiAgICB2YXIgYXV0aDpBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIHVzZXJTZXJ2aWNlLnVwZGF0ZShfaWQsIGRhdGEsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHVzZXJTZXJ2aWNlLnJldHJpZXZlKF9pZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfVE9LRU4sXHJcbiAgICAgICAgICAgICAgY29kZTogNDAxXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQodXNlcik7XHJcbiAgICAgICAgICAgIHJlcy5zZW5kKHtcclxuICAgICAgICAgICAgICBcInN0YXR1c1wiOiBcInN1Y2Nlc3NcIixcclxuICAgICAgICAgICAgICBcImRhdGFcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJmaXJzdF9uYW1lXCI6IHJlc3VsdFswXS5maXJzdF9uYW1lLFxyXG4gICAgICAgICAgICAgICAgXCJsYXN0X25hbWVcIjogcmVzdWx0WzBdLmxhc3RfbmFtZSxcclxuICAgICAgICAgICAgICAgIFwiZW1haWxcIjogcmVzdWx0WzBdLmVtYWlsLFxyXG4gICAgICAgICAgICAgICAgXCJfaWRcIjogcmVzdWx0WzBdLnVzZXJJZCxcclxuICAgICAgICAgICAgICAgIFwiZ3VpZGVfdG91clwiOiByZXN1bHRbMF0uZ3VpZGVfdG91clxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmV0cmlldmUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgdmFyIHBhcmFtcyA9IHJlcS5xdWVyeTtcclxuICAgIGRlbGV0ZSBwYXJhbXMuYWNjZXNzX3Rva2VuO1xyXG4gICAgdmFyIHVzZXIgPSByZXEudXNlcjtcclxuICAgIHZhciBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcblxyXG4gICAgdXNlclNlcnZpY2UucmV0cmlldmUocGFyYW1zLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KHtcclxuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dST05HX1RPS0VOLFxyXG4gICAgICAgICAgY29kZTogNDAxXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHZhciB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQodXNlcik7XHJcbiAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgXCJzdGF0dXNcIjogXCJzdWNjZXNzXCIsXHJcbiAgICAgICAgICBcImRhdGFcIjoge1xyXG4gICAgICAgICAgICBcImZpcnN0X25hbWVcIjogdXNlci5maXJzdF9uYW1lLFxyXG4gICAgICAgICAgICBcImxhc3RfbmFtZVwiOiB1c2VyLmxhc3RfbmFtZSxcclxuICAgICAgICAgICAgXCJlbWFpbFwiOiB1c2VyLmVtYWlsLFxyXG4gICAgICAgICAgICBcIm1vYmlsZV9udW1iZXJcIjogdXNlci5tb2JpbGVfbnVtYmVyLFxyXG4gICAgICAgICAgICBcInBpY3R1cmVcIjogdXNlci5waWN0dXJlLFxyXG4gICAgICAgICAgICBcInNvY2lhbF9wcm9maWxlX3BpY3R1cmVcIjogdXNlci5zb2NpYWxfcHJvZmlsZV9waWN0dXJlLFxyXG4gICAgICAgICAgICBcIl9pZFwiOiB1c2VyLnVzZXJJZCxcclxuICAgICAgICAgICAgXCJjdXJyZW50X3RoZW1lXCI6IHVzZXIuY3VycmVudF90aGVtZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGFjY2Vzc190b2tlbjogdG9rZW5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRQYXNzd29yZChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG4gICAgdmFyIHVzZXIgPSByZXEudXNlcjtcclxuICAgIHZhciBwYXJhbXMgPSByZXEuYm9keTsgICAvL25ld19wYXNzd29yZFxyXG4gICAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIGNvbnN0IHNhbHRSb3VuZHMgPSAxMDtcclxuICAgIGJjcnlwdC5oYXNoKHJlcS5ib2R5Lm5ld19wYXNzd29yZCwgc2FsdFJvdW5kcywgKGVycjphbnksIGhhc2g6YW55KSA9PntcclxuICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6ICdFcnJvciBpbiBjcmVhdGluZyBoYXNoIHVzaW5nIGJjcnlwdCd9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgdXBkYXRlRGF0YSA9IHsncGFzc3dvcmQnOiBoYXNofTtcclxuICAgICAgICB2YXIgcXVlcnkgPSB7XCJfaWRcIjogdXNlci5faWQsIFwicGFzc3dvcmRcIjogcmVxLnVzZXIucGFzc3dvcmQgfTtcclxuICAgICAgICB1c2VyU2VydmljZS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgICAgICdzdGF0dXMnOiAnU3VjY2VzcycsXHJcbiAgICAgICAgICAgICAgJ2RhdGEnOiB7J21lc3NhZ2UnOiAnUGFzc3dvcmQgY2hhbmdlZCBzdWNjZXNzZnVsbHknfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNoYW5nZVBhc3N3b3JkKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgdmFyIHBhcmFtcyA9IHJlcS5xdWVyeTtcclxuICAgIGRlbGV0ZSBwYXJhbXMuYWNjZXNzX3Rva2VuO1xyXG4gICAgdmFyIGF1dGg6IEF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgYmNyeXB0LmNvbXBhcmUocmVxLmJvZHkuY3VycmVudF9wYXNzd29yZCx1c2VyLnBhc3N3b3JkICwgKGVyciA6IGFueSwgaXNTYW1lIDogYW55KT0+IHtcclxuICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9SRUdJU1RSQVRJT05fU1RBVFVTLFxyXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1ZFUklGWV9DQU5ESURBVEVfQUNDT1VOVCxcclxuICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9ZWxzZSB7XHJcbiAgICAgICAgaWYoaXNTYW1lKSB7XHJcblxyXG4gICAgICAgICAgaWYocmVxLmJvZHkuY3VycmVudF9wYXNzd29yZD09PXJlcS5ib2R5Lm5ld19wYXNzd29yZCkge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfU0FNRV9ORVdfUEFTU1dPUkQsXHJcbiAgICAgICAgICAgICAgY29kZTogNDAxXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICB2YXIgbmV3X3Bhc3N3b3JkOmFueTtcclxuICAgICAgICAgIGNvbnN0IHNhbHRSb3VuZHMgPSAxMDtcclxuICAgICAgICAgIGJjcnlwdC5oYXNoKHJlcS5ib2R5Lm5ld19wYXNzd29yZCwgc2FsdFJvdW5kcywgKGVycjphbnksIGhhc2g6YW55KSA9PiB7XHJcbiAgICAgICAgICAgIC8vIFN0b3JlIGhhc2ggaW4geW91ciBwYXNzd29yZCBEQi5cclxuICAgICAgICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9SRUdJU1RSQVRJT05fU1RBVFVTLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0JDUllQVF9DUkVBVElPTixcclxuICAgICAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgbmV3X3Bhc3N3b3JkID0gaGFzaDtcclxuICAgICAgICAgIHZhciBxdWVyeSA9IHtcIl9pZFwiOiByZXEudXNlci5faWR9O1xyXG4gICAgICAgICAgdmFyIHVwZGF0ZURhdGEgPSB7XCJwYXNzd29yZFwiOiBuZXdfcGFzc3dvcmR9O1xyXG4gICAgICAgICAgdXNlclNlcnZpY2UuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgIHZhciB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQodXNlcik7XHJcbiAgICAgICAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgICAgICAgXCJzdGF0dXNcIjogXCJTdWNjZXNzXCIsXHJcbiAgICAgICAgICAgICAgICBcImRhdGFcIjoge1wibWVzc2FnZVwiOiBNZXNzYWdlcy5NU0dfU1VDQ0VTU19QQVNTV09SRF9DSEFOR0V9LFxyXG4gICAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIH19IGVsc2Uge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfQ1VSUkVOVF9QQVNTV09SRCxcclxuICAgICAgICAgICAgY29kZTogNDAxXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH19KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGFuZ2VNb2JpbGVOdW1iZXIocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcblxyXG4gIHRyeSB7XHJcbiAgICB2YXIgdXNlciA9IHJlcS51c2VyO1xyXG5cclxuICAgIHZhciBwYXJhbXMgPSByZXEuYm9keTtcclxuICAgIHZhciBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuXHJcbiAgICB2YXIgcXVlcnkgPSB7XCJtb2JpbGVfbnVtYmVyXCI6IHBhcmFtcy5uZXdfbW9iaWxlX251bWJlciwgXCJpc0FjdGl2YXRlZFwiOiB0cnVlfTtcclxuXHJcbiAgICB1c2VyU2VydmljZS5yZXRyaWV2ZShxdWVyeSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICBuZXh0KHtcclxuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxyXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTl9NT0JJTEVfTlVNQkVSLFxyXG4gICAgICAgICAgY29kZTogNDAxXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHZhciBEYXRhID0ge1xyXG4gICAgICAgICAgY3VycmVudF9tb2JpbGVfbnVtYmVyOiB1c2VyLm1vYmlsZV9udW1iZXIsXHJcbiAgICAgICAgICBfaWQ6IHVzZXIuX2lkLFxyXG4gICAgICAgICAgbmV3X21vYmlsZV9udW1iZXI6IHBhcmFtcy5uZXdfbW9iaWxlX251bWJlclxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdXNlclNlcnZpY2UuY2hhbmdlTW9iaWxlTnVtYmVyKERhdGEsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX1dISUxFX0NPTlRBQ1RJTkcsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dISUxFX0NPTlRBQ1RJTkcsXHJcbiAgICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgICAgICBcInN0YXR1c1wiOiBNZXNzYWdlcy5TVEFUVVNfU1VDQ0VTUyxcclxuICAgICAgICAgICAgICBcImRhdGFcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJtZXNzYWdlXCI6IE1lc3NhZ2VzLk1TR19TVUNDRVNTX09UUF9DSEFOR0VfTU9CSUxFX05VTUJFUlxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGFuZ2VFbWFpbElkKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG5cclxuICB0cnkge1xyXG4gICAgdmFyIHVzZXIgPSByZXEudXNlcjtcclxuICAgIHZhciBwYXJhbXMgPSByZXEucXVlcnk7XHJcbiAgICBkZWxldGUgcGFyYW1zLmFjY2Vzc190b2tlbjtcclxuICAgIHZhciBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuXHJcblxyXG4gICAgdmFyIHF1ZXJ5ID0ge1wiZW1haWxcIjogcmVxLmJvZHkubmV3X2VtYWlsfTtcclxuXHJcbiAgICB1c2VyU2VydmljZS5yZXRyaWV2ZShxdWVyeSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuXHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKHJlc3VsdC5sZW5ndGggPiAwICYmIHJlc3VsdFswXS5pc0FjdGl2YXRlZCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0VYSVNUSU5HX1VTRVIsXHJcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfUkVHSVNUUkFUSU9OLFxyXG4gICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKHJlc3VsdC5sZW5ndGggPiAwICYmIHJlc3VsdFswXS5pc0FjdGl2YXRlZCA9PT0gZmFsc2UpIHtcclxuICAgICAgICBuZXh0KHtcclxuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxyXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0FDQ09VTlRfU1RBVFVTLFxyXG4gICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICB9XHJcblxyXG4gICAgICBlbHNlIHtcclxuXHJcbiAgICAgICAgdmFyIGVtYWlsSWQgPSB7XHJcbiAgICAgICAgICBjdXJyZW50X2VtYWlsOiByZXEuYm9keS5jdXJyZW50X2VtYWlsLFxyXG4gICAgICAgICAgbmV3X2VtYWlsOiByZXEuYm9keS5uZXdfZW1haWxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB1c2VyU2VydmljZS5TZW5kQ2hhbmdlTWFpbFZlcmlmaWNhdGlvbihlbWFpbElkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvciA9PT0gTWVzc2FnZXMuTVNHX0VSUk9SX0NIRUNLX0VNQUlMX0FDQ09VTlQpIHtcclxuICAgICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0VNQUlMX0FDVElWRV9OT1csXHJcbiAgICAgICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9XSElMRV9DT05UQUNUSU5HLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dISUxFX0NPTlRBQ1RJTkcsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVtYWlsIGNoYW5nZSBzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XHJcbiAgICAgICAgICAgICAgXCJzdGF0dXNcIjogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgICAgICAgXCJkYXRhXCI6IHtcIm1lc3NhZ2VcIjogTWVzc2FnZXMuTVNHX1NVQ0NFU1NfRU1BSUxfQ0hBTkdFX0VNQUlMSUR9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5cclxuICB9XHJcblxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmVyaWZ5TW9iaWxlTnVtYmVyKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcblxyXG4gICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuXHJcbiAgICB2YXIgcGFyYW1zID0gcmVxLmJvZHk7IC8vb3RwXHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIHZhciBxdWVyeSA9IHtcIl9pZFwiOiB1c2VyLl9pZH07XHJcbiAgICB2YXIgdXBkYXRlRGF0YSA9IHtcIm1vYmlsZV9udW1iZXJcIjogdXNlci50ZW1wX21vYmlsZSwgXCJ0ZW1wX21vYmlsZVwiOiB1c2VyLm1vYmlsZV9udW1iZXJ9O1xyXG4gICAgaWYgKHVzZXIub3RwID09PSBwYXJhbXMub3RwKSB7XHJcbiAgICAgIHVzZXJTZXJ2aWNlLmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZURhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgICBcInN0YXR1c1wiOiBcIlN1Y2Nlc3NcIixcclxuICAgICAgICAgICAgXCJkYXRhXCI6IHtcIm1lc3NhZ2VcIjogXCJVc2VyIEFjY291bnQgdmVyaWZpZWQgc3VjY2Vzc2Z1bGx5XCJ9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XUk9OR19PVFAsXHJcbiAgICAgICAgY29kZTogNDAzXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2ZXJpZnlPdHAocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuXHJcbiAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG5cclxuICAgIHZhciBwYXJhbXMgPSByZXEuYm9keTsgLy9PVFBcclxuICAgIC8vICBkZWxldGUgcGFyYW1zLmFjY2Vzc190b2tlbjtcclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgdmFyIHF1ZXJ5ID0ge1wiX2lkXCI6IHVzZXIuX2lkLCBcImlzQWN0aXZhdGVkXCI6IGZhbHNlfTtcclxuICAgIHZhciB1cGRhdGVEYXRhID0ge1wiaXNBY3RpdmF0ZWRcIjogdHJ1ZX07XHJcbiAgICBpZiAodXNlci5vdHAgPT09IHBhcmFtcy5vdHApIHtcclxuICAgICAgdXNlclNlcnZpY2UuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICByZXMuc2VuZCh7XHJcbiAgICAgICAgICAgIFwic3RhdHVzXCI6IFwiU3VjY2Vzc1wiLFxyXG4gICAgICAgICAgICBcImRhdGFcIjoge1wibWVzc2FnZVwiOiBcIlVzZXIgQWNjb3VudCB2ZXJpZmllZCBzdWNjZXNzZnVsbHlcIn1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dST05HX09UUCxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2ZXJpZnlBY2NvdW50KHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcblxyXG4gICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgIHZhciBwYXJhbXMgPSByZXEucXVlcnk7XHJcbiAgICBkZWxldGUgcGFyYW1zLmFjY2Vzc190b2tlbjtcclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG5cclxuICAgIHZhciBxdWVyeSA9IHtcIl9pZFwiOiB1c2VyLl9pZCwgXCJpc0FjdGl2YXRlZFwiOiBmYWxzZX07XHJcbiAgICB2YXIgdXBkYXRlRGF0YSA9IHtcImlzQWN0aXZhdGVkXCI6IHRydWV9O1xyXG4gICAgdXNlclNlcnZpY2UuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG5cclxuICAgICAgICByZXMuc2VuZCh7XHJcbiAgICAgICAgICBcInN0YXR1c1wiOiBcIlN1Y2Nlc3NcIixcclxuICAgICAgICAgIFwiZGF0YVwiOiB7XCJtZXNzYWdlXCI6IFwiVXNlciBBY2NvdW50IHZlcmlmaWVkIHN1Y2Nlc3NmdWxseVwifVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmVyaWZ5Q2hhbmdlZEVtYWlsSWQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnNvbGUubG9nKFwiQ2hhbmdlbWFpbHZlcmlmaWNhdGlvbiBoaXRcIik7XHJcbiAgICB2YXIgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgdmFyIHBhcmFtcyA9IHJlcS5xdWVyeTtcclxuICAgIGRlbGV0ZSBwYXJhbXMuYWNjZXNzX3Rva2VuO1xyXG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcblxyXG4gICAgdmFyIHF1ZXJ5ID0ge1wiX2lkXCI6IHVzZXIuX2lkfTtcclxuICAgIHZhciB1cGRhdGVEYXRhID0ge1wiZW1haWxcIjogdXNlci50ZW1wX2VtYWlsLCBcInRlbXBfZW1haWxcIjogdXNlci5lbWFpbH07XHJcbiAgICB1c2VyU2VydmljZS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJDaGFuZ2VtYWlsdmVyaWZpY2F0aW9uIGhpdCBlcnJvclwiLCBlcnJvcik7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcblxyXG4gICAgICAgIHJlcy5zZW5kKHtcclxuICAgICAgICAgIFwic3RhdHVzXCI6IFwiU3VjY2Vzc1wiLFxyXG4gICAgICAgICAgXCJkYXRhXCI6IHtcIm1lc3NhZ2VcIjogXCJVc2VyIEFjY291bnQgdmVyaWZpZWQgc3VjY2Vzc2Z1bGx5XCJ9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRJbmR1c3RyeShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlKSB7XHJcbiAgX19kaXJuYW1lID0gJy4vJztcclxuICB2YXIgZmlsZXBhdGggPSBcImluZHVzdHJ5Lmpzb25cIjtcclxuICB0cnkge1xyXG4gICAgcmVzLnNlbmRGaWxlKGZpbGVwYXRoLCB7cm9vdDogX19kaXJuYW1lfSk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29tcGFueVNpemUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSkge1xyXG4gIF9fZGlybmFtZSA9ICcuLyc7XHJcbiAgdmFyIGZpbGVwYXRoID0gXCJjb21wYW55LXNpemUuanNvblwiO1xyXG4gIHRyeSB7XHJcbiAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgsIHtyb290OiBfX2Rpcm5hbWV9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRBZGRyZXNzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UpIHtcclxuICBfX2Rpcm5hbWUgPSAnLi8nO1xyXG4gIHZhciBmaWxlcGF0aCA9IFwiYWRkcmVzcy5qc29uXCI7XHJcbiAgdHJ5IHtcclxuICAgIHJlcy5zZW5kRmlsZShmaWxlcGF0aCwge3Jvb3Q6IF9fZGlybmFtZX0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVhbG9jYXRpb24ocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSkge1xyXG5cclxuICBfX2Rpcm5hbWUgPSAnLi8nO1xyXG4gIHZhciBmaWxlcGF0aCA9IFwicmVhbG9jYXRpb24uanNvblwiO1xyXG4gIHRyeSB7XHJcbiAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgsIHtyb290OiBfX2Rpcm5hbWV9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEVkdWNhdGlvbihyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlKSB7XHJcbiAgX19kaXJuYW1lID0gJy4vJztcclxuICB2YXIgZmlsZXBhdGggPSBcImVkdWNhdGlvbi5qc29uXCI7XHJcbiAgdHJ5IHtcclxuICAgIHJlcy5zZW5kRmlsZShmaWxlcGF0aCwge3Jvb3Q6IF9fZGlybmFtZX0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDbG9zZUpvYlJlYXNvbnMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSkge1xyXG4gIF9fZGlybmFtZSA9ICcuLyc7XHJcbiAgdmFyIGZpbGVwYXRoID0gXCJjbG9zZUpvYi5qc29uXCI7XHJcbiAgdHJ5IHtcclxuICAgIHJlcy5zZW5kRmlsZShmaWxlcGF0aCwge3Jvb3Q6IF9fZGlybmFtZX0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RXhwZXJpZW5jZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlKSB7XHJcbiAgX19kaXJuYW1lID0gJy4vJztcclxuICB2YXIgZmlsZXBhdGggPSBcImV4cGVyaWVuY2VMaXN0Lmpzb25cIjtcclxuICB0cnkge1xyXG4gICAgcmVzLnNlbmRGaWxlKGZpbGVwYXRoLCB7cm9vdDogX19kaXJuYW1lfSk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcbiAgfVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDdXJyZW50U2FsYXJ5KHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UpIHtcclxuICBfX2Rpcm5hbWUgPSAnLi8nO1xyXG4gIHZhciBmaWxlcGF0aCA9IFwiY3VycmVudHNhbGFyeUxpc3QuanNvblwiO1xyXG4gIHRyeSB7XHJcbiAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgsIHtyb290OiBfX2Rpcm5hbWV9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXROb3RpY2VQZXJpb2QocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSkge1xyXG4gIF9fZGlybmFtZSA9ICcuLyc7XHJcbiAgdmFyIGZpbGVwYXRoID0gXCJub3RpY2VwZXJpb2RMaXN0Lmpzb25cIjtcclxuICB0cnkge1xyXG4gICAgcmVzLnNlbmRGaWxlKGZpbGVwYXRoLCB7cm9vdDogX19kaXJuYW1lfSk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5kdXN0cnlFeHBvc3VyZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlKSB7XHJcbiAgX19kaXJuYW1lID0gJy4vJztcclxuICB2YXIgZmlsZXBhdGggPSBcImluZHVzdHJ5ZXhwb3N1cmVMaXN0Lmpzb25cIjtcclxuICB0cnkge1xyXG4gICAgcmVzLnNlbmRGaWxlKGZpbGVwYXRoLCB7cm9vdDogX19kaXJuYW1lfSk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VhcmNoZWRDYW5kaWRhdGUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSkge1xyXG4gIF9fZGlybmFtZSA9ICcuLyc7XHJcbiAgdmFyIGZpbGVwYXRoID0gXCJjYW5kaWRhdGUuanNvblwiO1xyXG4gIHRyeSB7XHJcbiAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgsIHtyb290OiBfX2Rpcm5hbWV9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcblxyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENvdW50cmllcyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlKSB7XHJcbiAgX19kaXJuYW1lID0gJy4vJztcclxuICB2YXIgZmlsZXBhdGggPSBcImNvdW50cnkuanNvblwiO1xyXG4gIHRyeSB7XHJcbiAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgsIHtyb290OiBfX2Rpcm5hbWV9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEluZGlhU3RhdGVzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UpIHtcclxuICBfX2Rpcm5hbWUgPSAnLi8nO1xyXG4gIHZhciBmaWxlcGF0aCA9IFwiaW5kaWFTdGF0ZXMuanNvblwiO1xyXG4gIHRyeSB7XHJcbiAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgsIHtyb290OiBfX2Rpcm5hbWV9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRGdW5jdGlvbihyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlKSB7XHJcbiAgX19kaXJuYW1lID0gJy4vJztcclxuICB2YXIgZmlsZXBhdGggPSBcImZ1bmN0aW9uLmpzb25cIjtcclxuICB0cnkge1xyXG4gICAgcmVzLnNlbmRGaWxlKGZpbGVwYXRoLCB7cm9vdDogX19kaXJuYW1lfSk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcbiAgfVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRSb2xlKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UpIHtcclxuICBfX2Rpcm5hbWUgPSAnLi8nO1xyXG4gIHZhciBmaWxlcGF0aCA9IFwicm9sZXMuanNvblwiO1xyXG4gIHRyeSB7XHJcbiAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgsIHtyb290OiBfX2Rpcm5hbWV9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFByb2ZpY2llbmN5KHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UpIHtcclxuICBfX2Rpcm5hbWUgPSAnLi8nO1xyXG4gIHZhciBmaWxlcGF0aCA9IFwicHJvZmljaWVuY3kuanNvblwiO1xyXG4gIHRyeSB7XHJcbiAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgsIHtyb290OiBfX2Rpcm5hbWV9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXREb21haW4ocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSkge1xyXG4gIF9fZGlybmFtZSA9ICcuLyc7XHJcbiAgdmFyIGZpbGVwYXRoID0gXCJkb21haW4uanNvblwiO1xyXG4gIHRyeSB7XHJcbiAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgsIHtyb290OiBfX2Rpcm5hbWV9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2FwYWJpbGl0eShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlKSB7XHJcbiAgX19kaXJuYW1lID0gJy4vJztcclxuICB2YXIgZmlsZXBhdGggPSBcImNhcGFiaWxpdHkuanNvblwiO1xyXG4gIHRyeSB7XHJcbiAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgsIHtyb290OiBfX2Rpcm5hbWV9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21wbGV4aXR5KHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UpIHtcclxuICBfX2Rpcm5hbWUgPSAnLi8nO1xyXG4gIHZhciBmaWxlcGF0aCA9IFwiY29tcGxleGl0eS5qc29uXCI7XHJcbiAgdHJ5IHtcclxuICAgIHJlcy5zZW5kRmlsZShmaWxlcGF0aCwge3Jvb3Q6IF9fZGlybmFtZX0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGZibG9naW4ocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgdmFyIHBhcmFtcyA9IHJlcS51c2VyO1xyXG4gICAgdmFyIGF1dGggPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICB1c2VyU2VydmljZS5yZXRyaWV2ZShwYXJhbXMsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKHJlc3VsdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgdmFyIHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZChyZXN1bHRbMF0pO1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgIFwic3RhdHVzXCI6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgXCJpc1NvY2lhbExvZ2luXCI6IHRydWUsXHJcbiAgICAgICAgICBcImRhdGFcIjoge1xyXG4gICAgICAgICAgICBcImZpcnN0X25hbWVcIjogcmVzdWx0WzBdLmZpcnN0X25hbWUsXHJcbiAgICAgICAgICAgIFwibGFzdF9uYW1lXCI6IHJlc3VsdFswXS5sYXN0X25hbWUsXHJcbiAgICAgICAgICAgIFwiZW1haWxcIjogcmVzdWx0WzBdLmVtYWlsLFxyXG4gICAgICAgICAgICBcIm1vYmlsZV9udW1iZXJcIjogcmVzdWx0WzBdLm1vYmlsZV9udW1iZXIsXHJcbiAgICAgICAgICAgIFwicGljdHVyZVwiOiByZXN1bHRbMF0ucGljdHVyZSxcclxuICAgICAgICAgICAgXCJfaWRcIjogcmVzdWx0WzBdLl9pZCxcclxuICAgICAgICAgICAgXCJjdXJyZW50X3RoZW1lXCI6IHJlc3VsdFswXS5jdXJyZW50X3RoZW1lXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuXHJcbiAgfVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBnb29nbGVsb2dpbihyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICB2YXIgcGFyYW1zID0gcmVxLnVzZXI7XHJcbiAgICBjb25zb2xlLmxvZyhcInBhcmFtcyBpbiBnb29nbGUgbG9naW5cIiwgcGFyYW1zKTtcclxuICAgIHZhciBhdXRoID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgdXNlclNlcnZpY2UucmV0cmlldmUocGFyYW1zLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmIChyZXN1bHQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicmVzdWx0IHNlbnQgdG8gZnJudCBhZnRyIGcrbG9naW5cIik7XHJcbiAgICAgICAgdmFyIHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZChyZXN1bHRbMF0pO1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgIFwic3RhdHVzXCI6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgXCJpc1NvY2lhbExvZ2luXCI6IHRydWUsXHJcbiAgICAgICAgICBcImRhdGFcIjoge1xyXG4gICAgICAgICAgICBcImZpcnN0X25hbWVcIjogcmVzdWx0WzBdLmZpcnN0X25hbWUsXHJcbiAgICAgICAgICAgIFwibGFzdF9uYW1lXCI6IHJlc3VsdFswXS5sYXN0X25hbWUsXHJcbiAgICAgICAgICAgIFwiZW1haWxcIjogcmVzdWx0WzBdLmVtYWlsLFxyXG4gICAgICAgICAgICBcIm1vYmlsZV9udW1iZXJcIjogcmVzdWx0WzBdLm1vYmlsZV9udW1iZXIsXHJcbiAgICAgICAgICAgIFwic29jaWFsX3Byb2ZpbGVfcGljdHVyZVwiOiByZXN1bHRbMF0uc29jaWFsX3Byb2ZpbGVfcGljdHVyZSxcclxuICAgICAgICAgICAgXCJjdXJyZW50X3RoZW1lXCI6IHJlc3VsdFswXS5jdXJyZW50X3RoZW1lLFxyXG4gICAgICAgICAgICBcIl9pZFwiOiByZXN1bHRbMF0uX2lkXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuXHJcbiAgfVxyXG59XHJcbi8qZXhwb3J0IGZ1bmN0aW9uIGdldEdvb2dsZVRva2VuKHJlcSA6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuIHZhciB0b2tlbiA9IEpTT04uc3RyaW5naWZ5KHJlcS5ib2R5LnRva2VuKTtcclxuXHJcbiB2YXIgdXJsID0gJ2h0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL29hdXRoMi92My90b2tlbmluZm8/aWRfdG9rZW49Jyt0b2tlbjtcclxuIGNvbnNvbGUubG9nKCd1cmwgOiAnK3Rva2VuKTtcclxuIHJlcXVlc3QodXJsLCBmdW5jdGlvbiggZXJyb3I6YW55ICwgcmVzcG9uc2U6YW55ICwgYm9keTphbnkgKSB7XHJcbiBpZihlcnJvcil7XHJcbiBjb25zb2xlLmxvZygnZXJyb3IgOicrZXJyb3IpO1xyXG4gLy9yZXMuc2VuZChlcnJvcik7XHJcbiB9XHJcbiBlbHNlIGlmIChib2R5KSB7XHJcbiBjb25zb2xlLmxvZygnYm9keSA6JytKU09OLnN0cmluZ2lmeShib2R5KSk7XHJcbiAvL3Jlcy5zZW5kKGJvZHkpO1xyXG4gfVxyXG4gfSk7XHJcbiAvLyByZXMuc2VuZCh0b2tlbik7XHJcbiB9Ki9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVQaWN0dXJlKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gIF9fZGlybmFtZSA9ICdzcmMvc2VydmVyL2FwcC9mcmFtZXdvcmsvcHVibGljL3Byb2ZpbGVpbWFnZSc7XHJcbiAgdmFyIGZvcm0gPSBuZXcgbXVsdGlwYXJ0eS5Gb3JtKHt1cGxvYWREaXI6IF9fZGlybmFtZX0pO1xyXG4gIGZvcm0ucGFyc2UocmVxLCAoZXJyOiBFcnJvciwgZmllbGRzOiBhbnksIGZpbGVzOiBhbnkpID0+IHtcclxuICAgIGlmIChlcnIpIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0RJUkVDVE9SWV9OT1RfRk9VTkQsXHJcbiAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0RJUkVDVE9SWV9OT1RfRk9VTkQsXHJcbiAgICAgICAgY29kZTogNDAxXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyIHBhdGggPSBKU09OLnN0cmluZ2lmeShmaWxlcy5maWxlWzBdLnBhdGgpO1xyXG4gICAgICB2YXIgaW1hZ2VfcGF0aCA9IGZpbGVzLmZpbGVbMF0ucGF0aDtcclxuICAgICAgdmFyIG9yaWdpbmFsRmlsZW5hbWUgPSBKU09OLnN0cmluZ2lmeShpbWFnZV9wYXRoLnN1YnN0cihmaWxlcy5maWxlWzBdLnBhdGgubGFzdEluZGV4T2YoJy8nKSArIDEpKTtcclxuICAgICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcblxyXG4gICAgICB1c2VyU2VydmljZS5VcGxvYWRJbWFnZShwYXRoLCBvcmlnaW5hbEZpbGVuYW1lLCBmdW5jdGlvbiAoZXJyOiBhbnksIHRlbXBhdGg6IGFueSkge1xyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgIG5leHQoZXJyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICB2YXIgbXlwYXRoID0gdGVtcGF0aDtcclxuXHJcbiAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB2YXIgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICAgICAgICB2YXIgcXVlcnkgPSB7XCJfaWRcIjogdXNlci5faWR9O1xyXG5cclxuICAgICAgICAgICAgdXNlclNlcnZpY2UuZmluZEJ5SWQodXNlci5faWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZXJyb3J9KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdC5pc0NhbmRpZGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICBsZXQgcmVjcnVpdGVyU2VydmljZTogUmVjcnVpdGVyU2VydmljZSA9IG5ldyBSZWNydWl0ZXJTZXJ2aWNlKCk7XHJcbiAgICAgICAgICAgICAgICAgIGxldCBxdWVyeTEgPSB7XCJ1c2VySWRcIjogcmVzdWx0Ll9pZH07XHJcbiAgICAgICAgICAgICAgICAgIHJlY3J1aXRlclNlcnZpY2UuZmluZE9uZUFuZFVwZGF0ZShxdWVyeTEsIHtjb21wYW55X2xvZ286IG15cGF0aH0sIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3BvbnNlMSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGVycm9yfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidXBkYXRlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgIHVzZXJTZXJ2aWNlLmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHtwaWN0dXJlOiBteXBhdGh9LCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZXJyb3J9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7YWNjZXNzX3Rva2VuOiB0b2tlbiwgZGF0YTogcmVzcG9uc2V9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgdXNlclNlcnZpY2UuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwge3BpY3R1cmU6IG15cGF0aH0sIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZXJyb3J9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgdmFyIHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZChyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe2FjY2Vzc190b2tlbjogdG9rZW4sIGRhdGE6IHJlc3BvbnNlfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgfSk7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQ29tcGFueURldGFpbHMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcblxyXG4gIGNvbnNvbGUubG9nKFwiVXBkYXRlUGljdHVyZSB1c2VyIENvbnRyb2xsZXIgaXMgYmVlbiBoaXQgcmVxIFwiKTtcclxuICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICB2YXIgdXNlciA9IHJlcS51c2VyO1xyXG4gIHZhciBxdWVyeSA9IHtcIl9pZFwiOiB1c2VyLl9pZH07XHJcbiAgLyp1c2VyU2VydmljZS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB7cGljdHVyZTogbXlwYXRofSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgIGlmIChlcnJvcikge1xyXG4gICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZXJyb3J9KTtcclxuICAgfVxyXG4gICBlbHNle1xyXG4gICB2YXIgYXV0aDpBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgIHZhciB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQocmVzdWx0KTtcclxuICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe2FjY2Vzc190b2tlbjogdG9rZW4sIGRhdGE6IHJlc3VsdH0pO1xyXG4gICB9XHJcbiAgIH0pOyovXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGxvYWRkb2N1bWVudHMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgX19kaXJuYW1lID0gJ3NyYy9zZXJ2ZXIvYXBwL2ZyYW1ld29yay9wdWJsaWMvdXBsb2FkZWQtZG9jdW1lbnQnO1xyXG5cclxuICB2YXIgZm9ybSA9IG5ldyBtdWx0aXBhcnR5LkZvcm0oe3VwbG9hZERpcjogX19kaXJuYW1lfSk7XHJcbiAgY29uc29sZS5sb2coXCJ1cGRhdGVkb2N1bWVudHMgdXNlciBDb250cm9sbGVyIGlzIGJlZW4gaGl0IHJlcSBcIiwgcmVxKTtcclxuICBmb3JtLnBhcnNlKHJlcSwgKGVycjogRXJyb3IsIGZpZWxkczogYW55LCBmaWxlczogYW55KSA9PiB7XHJcbiAgICBpZiAoZXJyKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9ESVJFQ1RPUllfTk9UX0ZPVU5ELFxyXG4gICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9ESVJFQ1RPUllfTk9UX0ZPVU5ELFxyXG4gICAgICAgIGNvZGU6IDQwMVxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiZmllbGRzIG9mIGRvYyB1cGxvYWQ6XCIgKyBmaWVsZHMpO1xyXG4gICAgICBjb25zb2xlLmxvZyhcImZpbGVzIG9mIGRvYyB1cGxvYWQ6XCIgKyBmaWxlcyk7XHJcblxyXG4gICAgICB2YXIgcGF0aCA9IEpTT04uc3RyaW5naWZ5KGZpbGVzLmZpbGVbMF0ucGF0aCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiUGF0aCB1cmwgb2YgZG9jIHVwbG9hZDpcIiArIHBhdGgpO1xyXG4gICAgICB2YXIgZG9jdW1lbnRfcGF0aCA9IGZpbGVzLmZpbGVbMF0ucGF0aDtcclxuICAgICAgY29uc29sZS5sb2coXCJEb2N1bWVudCBwYXRoIG9mIGRvYyB1cGxvYWQ6XCIgKyBkb2N1bWVudF9wYXRoKTtcclxuICAgICAgdmFyIG9yaWdpbmFsRmlsZW5hbWUgPSBKU09OLnN0cmluZ2lmeShkb2N1bWVudF9wYXRoLnN1YnN0cihmaWxlcy5maWxlWzBdLnBhdGgubGFzdEluZGV4T2YoJy8nKSArIDEpKTtcclxuICAgICAgY29uc29sZS5sb2coXCJPcmlnaW5hbCBGaWxlTmFtZSBvZiBkb2MgdXBsb2FkOlwiICsgb3JpZ2luYWxGaWxlbmFtZSk7XHJcblxyXG4gICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XHJcbiAgICAgICAgXCJzdGF0dXNcIjogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgXCJkYXRhXCI6IHtcclxuICAgICAgICAgIFwiZG9jdW1lbnRcIjogZG9jdW1lbnRfcGF0aFxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvKiAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICAgdXNlclNlcnZpY2UuVXBsb2FkRG9jdW1lbnRzKHBhdGgsIG9yaWdpbmFsRmlsZW5hbWUsIGZ1bmN0aW9uIChlcnI6YW55LCB0ZW1wYXRoOmFueSkge1xyXG4gICAgICAgaWYgKGVycikge1xyXG4gICAgICAgY29uc29sZS5sb2coXCJFcnIgbWVzc2FnZSBvZiB1cGxvYWRkb2N1bWVudCBpczpcIixlcnIpO1xyXG4gICAgICAgbmV4dChlcnIpO1xyXG4gICAgICAgfVxyXG4gICAgICAgZWxzZSB7XHJcbiAgICAgICB2YXIgbXlwYXRoID0gdGVtcGF0aDtcclxuICAgICAgIHRyeSB7XHJcbiAgICAgICB2YXIgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICAgdmFyIHF1ZXJ5ID0ge1wiX2lkXCI6IHVzZXIuX2lkfTtcclxuICAgICAgIHVzZXJTZXJ2aWNlLmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHtkb2N1bWVudDE6IG15cGF0aH0sIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZXJyb3J9KTtcclxuICAgICAgIH1cclxuICAgICAgIGVsc2V7XHJcbiAgICAgICB2YXIgYXV0aDpBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc3VsdCk7XHJcbiAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7YWNjZXNzX3Rva2VuOiB0b2tlbiwgZGF0YTogcmVzdWx0fSk7XHJcbiAgICAgICB9XHJcbiAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcbiAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICB9KTsqL1xyXG4gICAgfVxyXG5cclxuICB9KTtcclxuXHJcblxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcHJvZmlsZWNyZWF0ZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlKSB7XHJcbiAgdHJ5IHtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhcIkluIHByb2ZpbGUgY3JlYXRlXCIpO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwcm9mZXNzaW9uYWxkYXRhKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UpIHtcclxuICB0cnkge1xyXG5cclxuICAgIHZhciBuZXdVc2VyID0gcmVxLmJvZHk7XHJcbiAgICBjb25zb2xlLmxvZyhcIm5ld1VzZXJcIiwgSlNPTi5zdHJpbmdpZnkobmV3VXNlcikpO1xyXG5cclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHtcInN0YXR1c1wiOiBNZXNzYWdlcy5TVEFUVVNfRVJST1IsIFwiZXJyb3JfbWVzc2FnZVwiOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZW1wbG95bWVudGRhdGEocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSkge1xyXG4gIHRyeSB7XHJcblxyXG4gICAgdmFyIG5ld1VzZXIgPSByZXEuYm9keTtcclxuICAgIGNvbnNvbGUubG9nKFwibmV3VXNlclwiLCBKU09OLnN0cmluZ2lmeShuZXdVc2VyKSk7XHJcblxyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe1wic3RhdHVzXCI6IE1lc3NhZ2VzLlNUQVRVU19FUlJPUiwgXCJlcnJvcl9tZXNzYWdlXCI6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2hhbmdlVGhlbWUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICB2YXIgcGFyYW1zID0gcmVxLnF1ZXJ5O1xyXG4gICAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XHJcbiAgICB2YXIgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICB2YXIgcXVlcnkgPSB7XCJfaWRcIjogcmVxLnVzZXIuaWR9O1xyXG4gICAgdmFyIHVwZGF0ZURhdGEgPSB7XCJjdXJyZW50X3RoZW1lXCI6IHJlcS5ib2R5LmN1cnJlbnRfdGhlbWV9O1xyXG4gICAgdXNlclNlcnZpY2UuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHZhciB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQodXNlcik7XHJcblxyXG4gICAgICAgIHJlcy5zZW5kKHtcclxuICAgICAgICAgIGFjY2Vzc190b2tlbjogdG9rZW4sIGRhdGE6IHJlc3VsdFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcblxyXG5cclxufVxyXG4iXX0=
