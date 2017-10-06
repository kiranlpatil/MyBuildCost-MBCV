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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvdXNlci5jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsdUNBQXlDO0FBQ3pDLGlFQUFvRTtBQUdwRSxzREFBeUQ7QUFDekQsZ0VBQW1FO0FBQ25FLDZDQUFnRDtBQUVoRCxnRUFBbUU7QUFDbkUsb0RBQXNEO0FBR3RELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUUvQixlQUFzQixHQUFvQixFQUFFLEdBQXFCLEVBQUUsSUFBUztJQUMxRSxJQUFJLENBQUM7UUFFSCxJQUFJLFdBQVcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQ3BDLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDdEIsT0FBTyxNQUFNLENBQUMsWUFBWSxDQUFDO1FBQzNCLFdBQVcsQ0FBQyxRQUFRLENBQUMsRUFBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBQyxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07WUFDMUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDZCxDQUFDO1lBRUQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDN0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsVUFBQyxHQUFTLEVBQUUsTUFBWTtvQkFDMUUsRUFBRSxDQUFBLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDUCxJQUFJLENBQUM7NEJBQ0gsTUFBTSxFQUFFLFFBQVEsQ0FBQyx5Q0FBeUM7NEJBQzFELE9BQU8sRUFBRSxRQUFRLENB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S0FBSyxDQUFDLENBQUM7WUFDZCxDQUFDO1lBQ0QsSUFBSSxDQUFDLENBQUM7Z0JBQ0osSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUV6QyxHQUFHLENBQUMsSUFBSSxDQUFDO29CQUNQLFlBQVksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU07aUJBQ2xDLENBQUMsQ0FBQztZQUNMLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1QsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUM7SUFDN0MsQ0FBQztBQUdILENBQUM7QUEzQkQsa0NBMkJDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvdXNlci5jb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZXhwcmVzcyBmcm9tIFwiZXhwcmVzc1wiO1xyXG5pbXBvcnQgKiBhcyBtdWx0aXBhcnR5IGZyb20gXCJtdWx0aXBhcnR5XCI7XHJcbmltcG9ydCBBdXRoSW50ZXJjZXB0b3IgPSByZXF1aXJlKFwiLi4vaW50ZXJjZXB0b3IvYXV0aC5pbnRlcmNlcHRvclwiKTtcclxuaW1wb3J0IFNlbmRNYWlsU2VydmljZSA9IHJlcXVpcmUoXCIuLi9zZXJ2aWNlcy9zZW5kbWFpbC5zZXJ2aWNlXCIpO1xyXG5pbXBvcnQgVXNlck1vZGVsID0gcmVxdWlyZShcIi4uL2RhdGFhY2Nlc3MvbW9kZWwvdXNlci5tb2RlbFwiKTtcclxuaW1wb3J0IFVzZXJTZXJ2aWNlID0gcmVxdWlyZShcIi4uL3NlcnZpY2VzL3VzZXIuc2VydmljZVwiKTtcclxuaW1wb3J0IFJlY3J1aXRlclNlcnZpY2UgPSByZXF1aXJlKFwiLi4vc2VydmljZXMvcmVjcnVpdGVyLnNlcnZpY2VcIik7XHJcbmltcG9ydCBNZXNzYWdlcyA9IHJlcXVpcmUoXCIuLi9zaGFyZWQvbWVzc2FnZXNcIik7XHJcbmltcG9ydCBSZXNwb25zZVNlcnZpY2UgPSByZXF1aXJlKFwiLi4vc2hhcmVkL3Jlc3BvbnNlLnNlcnZpY2VcIik7XHJcbmltcG9ydCBDYW5kaWRhdGVTZXJ2aWNlID0gcmVxdWlyZShcIi4uL3NlcnZpY2VzL2NhbmRpZGF0ZS5zZXJ2aWNlXCIpO1xyXG5pbXBvcnQgYWRtaW5Db250cm9sbGVyPSByZXF1aXJlKFwiLi9hZG1pbi5jb250cm9sbGVyXCIpO1xyXG5pbXBvcnQgUmVjcnVpdGVyTW9kZWwgPSByZXF1aXJlKFwiLi4vZGF0YWFjY2Vzcy9tb2RlbC9yZWNydWl0ZXIubW9kZWxcIik7XHJcblxyXG52YXIgYmNyeXB0ID0gcmVxdWlyZSgnYmNyeXB0Jyk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbG9naW4ocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuXHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIHZhciBwYXJhbXMgPSByZXEuYm9keTtcclxuICAgIGRlbGV0ZSBwYXJhbXMuYWNjZXNzX3Rva2VuO1xyXG4gICAgdXNlclNlcnZpY2UucmV0cmlldmUoe1wiZW1haWxcIjogcGFyYW1zLmVtYWlsfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGVsc2UgaWYgKHJlc3VsdC5sZW5ndGggPiAwICYmIHJlc3VsdFswXS5pc0FjdGl2YXRlZCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIGJjcnlwdC5jb21wYXJlKHBhcmFtcy5wYXNzd29yZCwgcmVzdWx0WzBdLnBhc3N3b3JkLCAoZXJyIDogYW55LCBpc1NhbWUgOiBhbnkpPT4ge1xyXG4gICAgICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX1JFR0lTVFJBVElPTl9TVEFUVVMsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1ZFUklGWV9DQU5ESURBVEVfQUNDT1VOVCxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIGlmKGlzU2FtZSl7XHJcbiAgICAgICAgICAgICAgdmFyIGF1dGggPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICAgICAgICAgICAgdmFyIHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZChyZXN1bHRbMF0pO1xyXG4gICAgICAgICAgICAgIGlmKHJlc3VsdFswXS5pc0FkbWluKXtcclxuICAgICAgICAgICAgICAgIGFkbWluQ29udHJvbGxlci5zZW5kTG9naW5JbmZvVG9BZG1pbihyZXN1bHRbMF0uZW1haWwscmVxLmNvbm5lY3Rpb24ucmVtb3RlQWRkcmVzcyxwYXJhbXMubGF0aXR1ZGUscGFyYW1zLmxvbmdpdHVkZSk7XHJcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XHJcbiAgICAgICAgICAgICAgICAgIFwic3RhdHVzXCI6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgICAgICAgICBcImRhdGFcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiZW1haWxcIjogcmVzdWx0WzBdLmVtYWlsLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZmlyc3RfbmFtZVwiOiByZXN1bHRbMF0uZmlyc3RfbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBcIl9pZFwiOiByZXN1bHRbMF0uX2lkLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiY3VycmVudF90aGVtZVwiOiByZXN1bHRbMF0uY3VycmVudF90aGVtZSxcclxuICAgICAgICAgICAgICAgICAgICBcImVuZF91c2VyX2lkXCI6IHJlc3VsdFswXS5faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJwaWN0dXJlXCI6IHJlc3VsdFswXS5waWN0dXJlLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibW9iaWxlX251bWJlclwiOiByZXN1bHRbMF0ubW9iaWxlX251bWJlcixcclxuICAgICAgICAgICAgICAgICAgICBcImlzQ2FuZGlkYXRlXCI6IHJlc3VsdFswXS5pc0NhbmRpZGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICBcImlzQWRtaW5cIjogcmVzdWx0WzBdLmlzQWRtaW5cclxuICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0WzBdLmlzQ2FuZGlkYXRlID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICB2YXIgcmVjcnVpdGVyU2VydmljZSA9IG5ldyBSZWNydWl0ZXJTZXJ2aWNlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICByZWNydWl0ZXJTZXJ2aWNlLnJldHJpZXZlKHtcInVzZXJJZFwiOiByZXN1bHRbMF0uX2lkfSwgKGVycm9yLCByZWNydWl0ZXIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdGF0dXNcIjogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0YVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlbWFpbFwiOiByZXN1bHRbMF0uZW1haWwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJfaWRcIjogcmVzdWx0WzBdLl9pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImVuZF91c2VyX2lkXCI6IHJlY3J1aXRlclswXS5faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjdXJyZW50X3RoZW1lXCI6IHJlc3VsdFswXS5jdXJyZW50X3RoZW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwicGljdHVyZVwiOiByZXN1bHRbMF0ucGljdHVyZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbXBhbnlfaGVhZHF1YXJ0ZXJfY291bnRyeVwiOiByZWNydWl0ZXJbMF0uY29tcGFueV9oZWFkcXVhcnRlcl9jb3VudHJ5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29tcGFueV9uYW1lXCI6IHJlY3J1aXRlclswXS5jb21wYW55X25hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXRPZkRvY3VtZW50c1wiOiByZWNydWl0ZXJbMF0uc2V0T2ZEb2N1bWVudHMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb21wYW55X3NpemVcIjogcmVjcnVpdGVyWzBdLmNvbXBhbnlfc2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImlzUmVjcnVpdGluZ0ZvcnNlbGZcIjogcmVjcnVpdGVyWzBdLmlzUmVjcnVpdGluZ0ZvcnNlbGYsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJtb2JpbGVfbnVtYmVyXCI6IHJlc3VsdFswXS5tb2JpbGVfbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiaXNDYW5kaWRhdGVcIjogcmVzdWx0WzBdLmlzQ2FuZGlkYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiaXNBZG1pblwiOiByZXN1bHRbMF0uaXNBZG1pblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRva2VuXHJcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBjYW5kaWRhdGVTZXJ2aWNlID0gbmV3IENhbmRpZGF0ZVNlcnZpY2UoKTtcclxuICAgICAgICAgICAgICAgICAgY2FuZGlkYXRlU2VydmljZS5yZXRyaWV2ZSh7XCJ1c2VySWRcIjogcmVzdWx0WzBdLl9pZH0sIChlcnJvciwgY2FuZGlkYXRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3RhdHVzXCI6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRhdGFcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiZmlyc3RfbmFtZVwiOiByZXN1bHRbMF0uZmlyc3RfbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImxhc3RfbmFtZVwiOiByZXN1bHRbMF0ubGFzdF9uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiZW1haWxcIjogcmVzdWx0WzBdLmVtYWlsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiX2lkXCI6IHJlc3VsdFswXS5faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlbmRfdXNlcl9pZFwiOiBjYW5kaWRhdGVbMF0uX2lkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiY3VycmVudF90aGVtZVwiOiByZXN1bHRbMF0uY3VycmVudF90aGVtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcInBpY3R1cmVcIjogcmVzdWx0WzBdLnBpY3R1cmUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJtb2JpbGVfbnVtYmVyXCI6IHJlc3VsdFswXS5tb2JpbGVfbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiaXNDYW5kaWRhdGVcIjogcmVzdWx0WzBdLmlzQ2FuZGlkYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwiaXNBZG1pblwiOiByZXN1bHRbMF0uaXNBZG1pbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImlzQ29tcGxldGVkXCI6IGNhbmRpZGF0ZVswXS5pc0NvbXBsZXRlZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImlzU3VibWl0dGVkXCI6IGNhbmRpZGF0ZVswXS5pc1N1Ym1pdHRlZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImd1aWRlX3RvdXJcIjogcmVzdWx0WzBdLmd1aWRlX3RvdXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblxyXG4gICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfUEFTU1dPUkQsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKHJlc3VsdC5sZW5ndGggPiAwICYmIHJlc3VsdFswXS5pc0FjdGl2YXRlZCA9PT0gZmFsc2UpIHtcclxuICAgICAgICBiY3J5cHQuY29tcGFyZShwYXJhbXMucGFzc3dvcmQsIHJlc3VsdFswXS5wYXNzd29yZCwgKGVyciA6IGFueSwgaXNQYXNzU2FtZSA6IGFueSk9PiB7XHJcbiAgICAgICAgICBpZihlcnIpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfUkVHSVNUUkFUSU9OX1NUQVRVUyxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0NBTkRJREFURV9BQ0NPVU5ULFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgaWYoaXNQYXNzU2FtZSkge1xyXG4gICAgICAgICAgICAgIGlmKHJlc3VsdFswXS5pc0NhbmRpZGF0ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX1JFR0lTVFJBVElPTl9TVEFUVVMsXHJcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQ0FORElEQVRFX0FDQ09VTlQsXHJcbiAgICAgICAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9SRUdJU1RSQVRJT05fU1RBVFVTLFxyXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0FDQ09VTlQsXHJcbiAgICAgICAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XUk9OR19QQVNTV09SRCxcclxuICAgICAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fVVNFUl9OT1RfRk9VTkQsXHJcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVVNFUl9OT1RfUFJFU0VOVCxcclxuICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlT3RwKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIHZhciB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICB2YXIgcGFyYW1zID0gcmVxLmJvZHk7ICAvL21vYmlsZV9udW1iZXIobmV3KVxyXG5cclxuICAgIHZhciBEYXRhID0ge1xyXG4gICAgICBuZXdfbW9iaWxlX251bWJlcjogcGFyYW1zLm1vYmlsZV9udW1iZXIsXHJcbiAgICAgIG9sZF9tb2JpbGVfbnVtYmVyOiB1c2VyLm1vYmlsZV9udW1iZXIsXHJcbiAgICAgIF9pZDogdXNlci5faWRcclxuICAgIH07XHJcbiAgICB1c2VyU2VydmljZS5nZW5lcmF0ZU90cChEYXRhLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBpZiAoZXJyb3IgPT0gTWVzc2FnZXMuTVNHX0VSUk9SX0NIRUNLX01PQklMRV9QUkVTRU5UKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0VYSVNUSU5HX1VTRVIsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT05fTU9CSUxFX05VTUJFUixcclxuICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XHJcbiAgICAgICAgICBcInN0YXR1c1wiOiBNZXNzYWdlcy5TVEFUVVNfU1VDQ0VTUyxcclxuICAgICAgICAgIFwiZGF0YVwiOiB7XHJcbiAgICAgICAgICAgIFwibWVzc2FnZVwiOiBNZXNzYWdlcy5NU0dfU1VDQ0VTU19PVFBcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICByZXMuc3RhdHVzKDQwMSkuc2VuZCh7XHJcbiAgICAgICAgICBcInN0YXR1c1wiOiBNZXNzYWdlcy5TVEFUVVNfRVJST1IsXHJcbiAgICAgICAgICBcImRhdGFcIjoge1xyXG4gICAgICAgICAgICBcIm1lc3NhZ2VcIjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9VU0VSX05PVF9GT1VORFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuXHJcbiAgfVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB2ZXJpZmljYXRpb25NYWlsKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIHZhciB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICB2YXIgcGFyYW1zID0gcmVxLmJvZHk7XHJcbiAgICB1c2VyU2VydmljZS5zZW5kVmVyaWZpY2F0aW9uTWFpbChwYXJhbXMsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX1dISUxFX0NPTlRBQ1RJTkcsXHJcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV0hJTEVfQ09OVEFDVElORyxcclxuICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgIFwic3RhdHVzXCI6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgXCJkYXRhXCI6IHtcIm1lc3NhZ2VcIjogTWVzc2FnZXMuTVNHX1NVQ0NFU1NfRU1BSUxfUkVHSVNUUkFUSU9OfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuXHJcbiAgfVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiByZWNydWl0ZXJWZXJpZmljYXRpb25NYWlsKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIHZhciB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICB2YXIgcGFyYW1zID0gcmVxLmJvZHk7XHJcbiAgICB1c2VyU2VydmljZS5zZW5kUmVjcnVpdGVyVmVyaWZpY2F0aW9uTWFpbChwYXJhbXMsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX1dISUxFX0NPTlRBQ1RJTkcsXHJcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV0hJTEVfQ09OVEFDVElORyxcclxuICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgIFwic3RhdHVzXCI6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgXCJkYXRhXCI6IHtcIm1lc3NhZ2VcIjogTWVzc2FnZXMuTVNHX1NVQ0NFU1NfRU1BSUxfUkVHSVNUUkFUSU9OfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuXHJcbiAgfVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBtYWlsKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIHZhciBwYXJhbXMgPSByZXEuYm9keTtcclxuICAgIHVzZXJTZXJ2aWNlLnNlbmRNYWlsKHBhcmFtcywgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fV0hJTEVfQ09OVEFDVElORyxcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XSElMRV9DT05UQUNUSU5HLFxyXG4gICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgXCJzdGF0dXNcIjogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgICBcImRhdGFcIjoge1wibWVzc2FnZVwiOiBNZXNzYWdlcy5NU0dfU1VDQ0VTU19TVUJNSVRURUR9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG5cclxuICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG4gICAgdmFyIG5ld1VzZXI6IFVzZXJNb2RlbCA9IDxVc2VyTW9kZWw+cmVxLmJvZHk7XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIC8vIG5ld1VzZXIuaXNBY3RpdmF0ZWQ9dHJ1ZTtcclxuICAgIHVzZXJTZXJ2aWNlLmNyZWF0ZVVzZXIobmV3VXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJjcnQgdXNlciBlcnJvclwiLCBlcnJvcik7XHJcblxyXG4gICAgICAgIGlmIChlcnJvciA9PSBNZXNzYWdlcy5NU0dfRVJST1JfQ0hFQ0tfRU1BSUxfUFJFU0VOVCkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0FDQ09VTlQsXHJcbiAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGVycm9yID09IE1lc3NhZ2VzLk1TR19FUlJPUl9DSEVDS19NT0JJTEVfUFJFU0VOVCkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfUkVHSVNUUkFUSU9OX01PQklMRV9OVU1CRVIsXHJcbiAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVVNFUl9XSVRIX0VNQUlMX1BSRVNFTlQsXHJcbiAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHZhciBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3Jlc3VsdCcsSlNPTi5zdHJpbmdpZnkocmVzdWx0KSk7XHJcbiAgICAgICAgdmFyIHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZChyZXN1bHQpO1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgIFwic3RhdHVzXCI6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgXCJkYXRhXCI6IHtcclxuICAgICAgICAgICAgXCJyZWFzb25cIjogTWVzc2FnZXMuTVNHX1NVQ0NFU1NfUkVHSVNUUkFUSU9OLFxyXG4gICAgICAgICAgICBcImZpcnN0X25hbWVcIjogbmV3VXNlci5maXJzdF9uYW1lLFxyXG4gICAgICAgICAgICBcImxhc3RfbmFtZVwiOiBuZXdVc2VyLmxhc3RfbmFtZSxcclxuICAgICAgICAgICAgXCJlbWFpbFwiOiBuZXdVc2VyLmVtYWlsLFxyXG4gICAgICAgICAgICBcIm1vYmlsZV9udW1iZXJcIjogbmV3VXNlci5tb2JpbGVfbnVtYmVyLFxyXG4gICAgICAgICAgICBcIl9pZFwiOiByZXN1bHQuX2lkLFxyXG4gICAgICAgICAgICBcInBpY3R1cmVcIjogXCJcIlxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGFjY2Vzc190b2tlbjogdG9rZW5cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7XCJzdGF0dXNcIjogTWVzc2FnZXMuU1RBVFVTX0VSUk9SLCBcImVycm9yX21lc3NhZ2VcIjogZS5tZXNzYWdlfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZm9yZ290UGFzc3dvcmQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgdmFyIHBhcmFtcyA9IHJlcS5ib2R5OyAgIC8vZW1haWxcclxuXHJcbiAgICAvKiB2YXIgbGlua3EgPXJlcS51cmw7XHJcbiAgICAgdmFyIGZ1bGxVcmwgPSBhcHAuZ2V0KFwiL2FwaS9hZGRyZXNzXCIsICB1c2VyQ29udHJvbGxlci5nZXRBZGRyZXNzKTtyZXEucHJvdG9jb2wgKyAnOi8vJyArIHJlcS5nZXQoJ2hvc3QnKSArIHJlcS5vcmlnaW5hbFVybDtcclxuICAgICBjb25zb2xlLmxvZyhmdWxsVXJsKTsqL1xyXG4gICAgdXNlclNlcnZpY2UuZm9yZ290UGFzc3dvcmQocGFyYW1zLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG5cclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgaWYgKGVycm9yID09IE1lc3NhZ2VzLk1TR19FUlJPUl9DSEVDS19JTkFDVElWRV9BQ0NPVU5UKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfVVNFUl9OT1RfQUNUSVZBVEVELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfQUNDT1VOVF9TVEFUVVMsXHJcbiAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGVycm9yID09IE1lc3NhZ2VzLk1TR19FUlJPUl9DSEVDS19JTlZBTElEX0FDQ09VTlQpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fVVNFUl9OT1RfRk9VTkQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9VU0VSX05PVF9GT1VORCxcclxuICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgXCJzdGF0dXNcIjogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgICBcImRhdGFcIjoge1wibWVzc2FnZVwiOiBNZXNzYWdlcy5NU0dfU1VDQ0VTU19FTUFJTF9GT1JHT1RfUEFTU1dPUkR9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG5vdGlmaWNhdGlvbnMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICB2YXIgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgdmFyIHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKTtcclxuXHJcbiAgICAvL3JldHJpZXZlIG5vdGlmaWNhdGlvbiBmb3IgYSBwYXJ0aWN1bGFyIHVzZXJcclxuICAgIHZhciBwYXJhbXMgPSB7X2lkOiB1c2VyLl9pZH07XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuXHJcbiAgICB1c2VyU2VydmljZS5yZXRyaWV2ZShwYXJhbXMsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKHJlc3VsdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgdmFyIHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKTtcclxuICAgICAgICByZXMuc2VuZCh7XHJcbiAgICAgICAgICBcInN0YXR1c1wiOiBcInN1Y2Nlc3NcIixcclxuICAgICAgICAgIFwiZGF0YVwiOiByZXN1bHRbMF0ubm90aWZpY2F0aW9ucyxcclxuICAgICAgICAgIGFjY2Vzc190b2tlbjogdG9rZW5cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcblxyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHB1c2hOb3RpZmljYXRpb25zKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgdmFyIGJvZHlfZGF0YSA9IHJlcS5ib2R5O1xyXG4gICAgdmFyIGF1dGg6IEF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgIHZhciB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQodXNlcik7XHJcblxyXG4gICAgLy9yZXRyaWV2ZSBub3RpZmljYXRpb24gZm9yIGEgcGFydGljdWxhciB1c2VyXHJcbiAgICB2YXIgcGFyYW1zID0ge19pZDogdXNlci5faWR9O1xyXG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICB2YXIgZGF0YSA9IHskcHVzaDoge25vdGlmaWNhdGlvbnM6IGJvZHlfZGF0YX19O1xyXG5cclxuICAgIHVzZXJTZXJ2aWNlLmZpbmRPbmVBbmRVcGRhdGUocGFyYW1zLCBkYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKTtcclxuICAgICAgICByZXMuc2VuZCh7XHJcbiAgICAgICAgICBcInN0YXR1c1wiOiBcIlN1Y2Nlc3NcIixcclxuICAgICAgICAgIFwiZGF0YVwiOiByZXN1bHQubm90aWZpY2F0aW9ucyxcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG5cclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVOb3RpZmljYXRpb25zKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgdmFyIGJvZHlfZGF0YSA9IHJlcS5ib2R5O1xyXG4gICAgY29uc29sZS5sb2coJ05vdGlmaWNhdGlvbiBpZCA6JyArIEpTT04uc3RyaW5naWZ5KGJvZHlfZGF0YSkpO1xyXG4gICAgdmFyIGF1dGg6IEF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgIHZhciB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQodXNlcik7XHJcblxyXG4gICAgdmFyIHBhcmFtcyA9IHtfaWQ6IHVzZXIuX2lkfTtcclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgdmFyIGRhdGEgPSB7aXNfcmVhZDogdHJ1ZX07XHJcblxyXG4gICAgdXNlclNlcnZpY2UuZmluZEFuZFVwZGF0ZU5vdGlmaWNhdGlvbihwYXJhbXMsIGRhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpO1xyXG4gICAgICAgIHJlcy5zZW5kKHtcclxuICAgICAgICAgIFwic3RhdHVzXCI6IFwiU3VjY2Vzc1wiLFxyXG4gICAgICAgICAgXCJkYXRhXCI6IHJlc3VsdC5ub3RpZmljYXRpb25zLFxyXG5cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcblxyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZURldGFpbHMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciBuZXdVc2VyRGF0YTogVXNlck1vZGVsID0gPFVzZXJNb2RlbD5yZXEuYm9keTtcclxuICAgIHZhciBwYXJhbXMgPSByZXEucXVlcnk7XHJcbiAgICBkZWxldGUgcGFyYW1zLmFjY2Vzc190b2tlbjtcclxuICAgIHZhciB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICB2YXIgX2lkOiBzdHJpbmcgPSB1c2VyLl9pZDtcclxuXHJcbiAgICB2YXIgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICB1c2VyU2VydmljZS51cGRhdGUoX2lkLCBuZXdVc2VyRGF0YSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdXNlclNlcnZpY2UucmV0cmlldmUoX2lkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XUk9OR19UT0tFTixcclxuICAgICAgICAgICAgICBjb2RlOiA0MDFcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKTtcclxuICAgICAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgICAgIFwic3RhdHVzXCI6IFwic3VjY2Vzc1wiLFxyXG4gICAgICAgICAgICAgIFwiZGF0YVwiOiB7XHJcbiAgICAgICAgICAgICAgICBcImZpcnN0X25hbWVcIjogcmVzdWx0WzBdLmZpcnN0X25hbWUsXHJcbiAgICAgICAgICAgICAgICBcImxhc3RfbmFtZVwiOiByZXN1bHRbMF0ubGFzdF9uYW1lLFxyXG4gICAgICAgICAgICAgICAgXCJlbWFpbFwiOiByZXN1bHRbMF0uZW1haWwsXHJcbiAgICAgICAgICAgICAgICBcIm1vYmlsZV9udW1iZXJcIjogcmVzdWx0WzBdLm1vYmlsZV9udW1iZXIsXHJcbiAgICAgICAgICAgICAgICBcInBpY3R1cmVcIjogcmVzdWx0WzBdLnBpY3R1cmUsXHJcbiAgICAgICAgICAgICAgICBcIl9pZFwiOiByZXN1bHRbMF0udXNlcklkLFxyXG4gICAgICAgICAgICAgICAgXCJjdXJyZW50X3RoZW1lXCI6IHJlc3VsdFswXS5jdXJyZW50X3RoZW1lXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRva2VuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVJlY3J1aXRlckFjY291bnREZXRhaWxzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgbmV3VXNlckRhdGE6IFJlY3J1aXRlck1vZGVsID0gPFJlY3J1aXRlck1vZGVsPnJlcS5ib2R5O1xyXG4gICAgdmFyIHVzZXIgPSByZXEudXNlcjtcclxuICAgIHZhciBfaWQ6IHN0cmluZyA9IHVzZXIuX2lkO1xyXG4gICAgdmFyIGF1dGg6IEF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgIHZhciByZWNydWl0ZXJTZXJ2aWNlID0gbmV3IFJlY3J1aXRlclNlcnZpY2UoKTtcclxuICAgIHJlY3J1aXRlclNlcnZpY2UudXBkYXRlRGV0YWlscyhfaWQsIG5ld1VzZXJEYXRhLCAgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgJ3N0YXR1cyc6ICdTdWNjZXNzJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcbiAgfVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVQcm9maWxlRmllbGQocmVxOmV4cHJlc3MuUmVxdWVzdCwgcmVzOmV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6YW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIC8vdmFyIG5ld1VzZXJEYXRhOiBVc2VyTW9kZWwgPSA8VXNlck1vZGVsPnJlcS5ib2R5O1xyXG5cclxuICAgIHZhciBwYXJhbXMgPSByZXEucXVlcnk7XHJcbiAgICBkZWxldGUgcGFyYW1zLmFjY2Vzc190b2tlbjtcclxuICAgIHZhciB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICB2YXIgX2lkOnN0cmluZyA9IHVzZXIuX2lkO1xyXG4gICAgdmFyIGZOYW1lOnN0cmluZyA9IHJlcS5wYXJhbXMuZm5hbWU7XHJcbiAgICBpZiAoZk5hbWUgPT0gJ2d1aWRlX3RvdXInKSB7XHJcbiAgICAgIHZhciBkYXRhID0geydndWlkZV90b3VyJzogcmVxLmJvZHl9O1xyXG4gICAgfVxyXG4gICAgdmFyIGF1dGg6QXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICB1c2VyU2VydmljZS51cGRhdGUoX2lkLCBkYXRhLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB1c2VyU2VydmljZS5yZXRyaWV2ZShfaWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dST05HX1RPS0VOLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwMVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpO1xyXG4gICAgICAgICAgICByZXMuc2VuZCh7XHJcbiAgICAgICAgICAgICAgXCJzdGF0dXNcIjogXCJzdWNjZXNzXCIsXHJcbiAgICAgICAgICAgICAgXCJkYXRhXCI6IHtcclxuICAgICAgICAgICAgICAgIFwiZmlyc3RfbmFtZVwiOiByZXN1bHRbMF0uZmlyc3RfbmFtZSxcclxuICAgICAgICAgICAgICAgIFwibGFzdF9uYW1lXCI6IHJlc3VsdFswXS5sYXN0X25hbWUsXHJcbiAgICAgICAgICAgICAgICBcImVtYWlsXCI6IHJlc3VsdFswXS5lbWFpbCxcclxuICAgICAgICAgICAgICAgIFwiX2lkXCI6IHJlc3VsdFswXS51c2VySWQsXHJcbiAgICAgICAgICAgICAgICBcImd1aWRlX3RvdXJcIjogcmVzdWx0WzBdLmd1aWRlX3RvdXJcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGFjY2Vzc190b2tlbjogdG9rZW5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJldHJpZXZlKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIHZhciBwYXJhbXMgPSByZXEucXVlcnk7XHJcbiAgICBkZWxldGUgcGFyYW1zLmFjY2Vzc190b2tlbjtcclxuICAgIHZhciB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICB2YXIgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG5cclxuICAgIHVzZXJTZXJ2aWNlLnJldHJpZXZlKHBhcmFtcywgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XUk9OR19UT0tFTixcclxuICAgICAgICAgIGNvZGU6IDQwMVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpO1xyXG4gICAgICAgIHJlcy5zZW5kKHtcclxuICAgICAgICAgIFwic3RhdHVzXCI6IFwic3VjY2Vzc1wiLFxyXG4gICAgICAgICAgXCJkYXRhXCI6IHtcclxuICAgICAgICAgICAgXCJmaXJzdF9uYW1lXCI6IHVzZXIuZmlyc3RfbmFtZSxcclxuICAgICAgICAgICAgXCJsYXN0X25hbWVcIjogdXNlci5sYXN0X25hbWUsXHJcbiAgICAgICAgICAgIFwiZW1haWxcIjogdXNlci5lbWFpbCxcclxuICAgICAgICAgICAgXCJtb2JpbGVfbnVtYmVyXCI6IHVzZXIubW9iaWxlX251bWJlcixcclxuICAgICAgICAgICAgXCJwaWN0dXJlXCI6IHVzZXIucGljdHVyZSxcclxuICAgICAgICAgICAgXCJzb2NpYWxfcHJvZmlsZV9waWN0dXJlXCI6IHVzZXIuc29jaWFsX3Byb2ZpbGVfcGljdHVyZSxcclxuICAgICAgICAgICAgXCJfaWRcIjogdXNlci51c2VySWQsXHJcbiAgICAgICAgICAgIFwiY3VycmVudF90aGVtZVwiOiB1c2VyLmN1cnJlbnRfdGhlbWVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRva2VuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0UGFzc3dvcmQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICB2YXIgcGFyYW1zID0gcmVxLmJvZHk7ICAgLy9uZXdfcGFzc3dvcmRcclxuICAgIGRlbGV0ZSBwYXJhbXMuYWNjZXNzX3Rva2VuO1xyXG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICBjb25zdCBzYWx0Um91bmRzID0gMTA7XHJcbiAgICBiY3J5cHQuaGFzaChyZXEuYm9keS5uZXdfcGFzc3dvcmQsIHNhbHRSb3VuZHMsIChlcnI6YW55LCBoYXNoOmFueSkgPT57XHJcbiAgICAgIGlmKGVycikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiAnRXJyb3IgaW4gY3JlYXRpbmcgaGFzaCB1c2luZyBiY3J5cHQnfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFyIHVwZGF0ZURhdGEgPSB7J3Bhc3N3b3JkJzogaGFzaH07XHJcbiAgICAgICAgdmFyIHF1ZXJ5ID0ge1wiX2lkXCI6IHVzZXIuX2lkLCBcInBhc3N3b3JkXCI6IHJlcS51c2VyLnBhc3N3b3JkIH07XHJcbiAgICAgICAgdXNlclNlcnZpY2UuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIHJlcy5zZW5kKHtcclxuICAgICAgICAgICAgICAnc3RhdHVzJzogJ1N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAgICdkYXRhJzogeydtZXNzYWdlJzogJ1Bhc3N3b3JkIGNoYW5nZWQgc3VjY2Vzc2Z1bGx5J31cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGFuZ2VQYXNzd29yZChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG4gICAgdmFyIHVzZXIgPSByZXEudXNlcjtcclxuICAgIHZhciBwYXJhbXMgPSByZXEucXVlcnk7XHJcbiAgICBkZWxldGUgcGFyYW1zLmFjY2Vzc190b2tlbjtcclxuICAgIHZhciBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIGJjcnlwdC5jb21wYXJlKHJlcS5ib2R5LmN1cnJlbnRfcGFzc3dvcmQsdXNlci5wYXNzd29yZCAsIChlcnIgOiBhbnksIGlzU2FtZSA6IGFueSk9PiB7XHJcbiAgICAgIGlmKGVycikge1xyXG4gICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfUkVHSVNUUkFUSU9OX1NUQVRVUyxcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQ0FORElEQVRFX0FDQ09VTlQsXHJcbiAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICB9KTtcclxuICAgICAgfWVsc2Uge1xyXG4gICAgICAgIGlmKGlzU2FtZSkge1xyXG5cclxuICAgICAgICAgIGlmKHJlcS5ib2R5LmN1cnJlbnRfcGFzc3dvcmQ9PT1yZXEuYm9keS5uZXdfcGFzc3dvcmQpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1NBTUVfTkVXX1BBU1NXT1JELFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwMVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgdmFyIG5ld19wYXNzd29yZDphbnk7XHJcbiAgICAgICAgICBjb25zdCBzYWx0Um91bmRzID0gMTA7XHJcbiAgICAgICAgICBiY3J5cHQuaGFzaChyZXEuYm9keS5uZXdfcGFzc3dvcmQsIHNhbHRSb3VuZHMsIChlcnI6YW55LCBoYXNoOmFueSkgPT4ge1xyXG4gICAgICAgICAgICAvLyBTdG9yZSBoYXNoIGluIHlvdXIgcGFzc3dvcmQgREIuXHJcbiAgICAgICAgICAgIGlmKGVycikge1xyXG4gICAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfUkVHSVNUUkFUSU9OX1NUQVRVUyxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9CQ1JZUFRfQ1JFQVRJT04sXHJcbiAgICAgICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgIG5ld19wYXNzd29yZCA9IGhhc2g7XHJcbiAgICAgICAgICB2YXIgcXVlcnkgPSB7XCJfaWRcIjogcmVxLnVzZXIuX2lkfTtcclxuICAgICAgICAgIHZhciB1cGRhdGVEYXRhID0ge1wicGFzc3dvcmRcIjogbmV3X3Bhc3N3b3JkfTtcclxuICAgICAgICAgIHVzZXJTZXJ2aWNlLmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZURhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpO1xyXG4gICAgICAgICAgICAgIHJlcy5zZW5kKHtcclxuICAgICAgICAgICAgICAgIFwic3RhdHVzXCI6IFwiU3VjY2Vzc1wiLFxyXG4gICAgICAgICAgICAgICAgXCJkYXRhXCI6IHtcIm1lc3NhZ2VcIjogTWVzc2FnZXMuTVNHX1NVQ0NFU1NfUEFTU1dPUkRfQ0hBTkdFfSxcclxuICAgICAgICAgICAgICAgIGFjY2Vzc190b2tlbjogdG9rZW5cclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB9fSBlbHNlIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dST05HX0NVUlJFTlRfUEFTU1dPUkQsXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9fSk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2hhbmdlTW9iaWxlTnVtYmVyKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG5cclxuICB0cnkge1xyXG4gICAgdmFyIHVzZXIgPSByZXEudXNlcjtcclxuXHJcbiAgICB2YXIgcGFyYW1zID0gcmVxLmJvZHk7XHJcbiAgICB2YXIgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcblxyXG4gICAgdmFyIHF1ZXJ5ID0ge1wibW9iaWxlX251bWJlclwiOiBwYXJhbXMubmV3X21vYmlsZV9udW1iZXIsIFwiaXNBY3RpdmF0ZWRcIjogdHJ1ZX07XHJcblxyXG4gICAgdXNlclNlcnZpY2UucmV0cmlldmUocXVlcnksIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKHJlc3VsdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRVhJU1RJTkdfVVNFUixcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT05fTU9CSUxFX05VTUJFUixcclxuICAgICAgICAgIGNvZGU6IDQwMVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB2YXIgRGF0YSA9IHtcclxuICAgICAgICAgIGN1cnJlbnRfbW9iaWxlX251bWJlcjogdXNlci5tb2JpbGVfbnVtYmVyLFxyXG4gICAgICAgICAgX2lkOiB1c2VyLl9pZCxcclxuICAgICAgICAgIG5ld19tb2JpbGVfbnVtYmVyOiBwYXJhbXMubmV3X21vYmlsZV9udW1iZXJcclxuICAgICAgICB9O1xyXG4gICAgICAgIHVzZXJTZXJ2aWNlLmNoYW5nZU1vYmlsZU51bWJlcihEYXRhLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9XSElMRV9DT05UQUNUSU5HLFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XSElMRV9DT05UQUNUSU5HLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XHJcbiAgICAgICAgICAgICAgXCJzdGF0dXNcIjogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgICAgICAgXCJkYXRhXCI6IHtcclxuICAgICAgICAgICAgICAgIFwibWVzc2FnZVwiOiBNZXNzYWdlcy5NU0dfU1VDQ0VTU19PVFBfQ0hBTkdFX01PQklMRV9OVU1CRVJcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2hhbmdlRW1haWxJZChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuXHJcbiAgdHJ5IHtcclxuICAgIHZhciB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICB2YXIgcGFyYW1zID0gcmVxLnF1ZXJ5O1xyXG4gICAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XHJcbiAgICB2YXIgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcblxyXG5cclxuICAgIHZhciBxdWVyeSA9IHtcImVtYWlsXCI6IHJlcS5ib2R5Lm5ld19lbWFpbH07XHJcblxyXG4gICAgdXNlclNlcnZpY2UucmV0cmlldmUocXVlcnksIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcblxyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmIChyZXN1bHQubGVuZ3RoID4gMCAmJiByZXN1bHRbMF0uaXNBY3RpdmF0ZWQgPT09IHRydWUpIHtcclxuICAgICAgICBuZXh0KHtcclxuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxyXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTixcclxuICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmIChyZXN1bHQubGVuZ3RoID4gMCAmJiByZXN1bHRbMF0uaXNBY3RpdmF0ZWQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRVhJU1RJTkdfVVNFUixcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9BQ0NPVU5UX1NUQVRVUyxcclxuICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgfVxyXG5cclxuICAgICAgZWxzZSB7XHJcblxyXG4gICAgICAgIHZhciBlbWFpbElkID0ge1xyXG4gICAgICAgICAgY3VycmVudF9lbWFpbDogcmVxLmJvZHkuY3VycmVudF9lbWFpbCxcclxuICAgICAgICAgIG5ld19lbWFpbDogcmVxLmJvZHkubmV3X2VtYWlsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdXNlclNlcnZpY2UuU2VuZENoYW5nZU1haWxWZXJpZmljYXRpb24oZW1haWxJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IgPT09IE1lc3NhZ2VzLk1TR19FUlJPUl9DSEVDS19FTUFJTF9BQ0NPVU5UKSB7XHJcbiAgICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRVhJU1RJTkdfVVNFUixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9FTUFJTF9BQ1RJVkVfTk9XLFxyXG4gICAgICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fV0hJTEVfQ09OVEFDVElORyxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XSElMRV9DT05UQUNUSU5HLFxyXG4gICAgICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlbWFpbCBjaGFuZ2Ugc3VjY2Vzc1wiKTtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgICAgIFwic3RhdHVzXCI6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgICAgIFwiZGF0YVwiOiB7XCJtZXNzYWdlXCI6IE1lc3NhZ2VzLk1TR19TVUNDRVNTX0VNQUlMX0NIQU5HRV9FTUFJTElEfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgfVxyXG5cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZlcmlmeU1vYmlsZU51bWJlcihyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG5cclxuICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcblxyXG4gICAgdmFyIHBhcmFtcyA9IHJlcS5ib2R5OyAvL290cFxyXG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICB2YXIgcXVlcnkgPSB7XCJfaWRcIjogdXNlci5faWR9O1xyXG4gICAgdmFyIHVwZGF0ZURhdGEgPSB7XCJtb2JpbGVfbnVtYmVyXCI6IHVzZXIudGVtcF9tb2JpbGUsIFwidGVtcF9tb2JpbGVcIjogdXNlci5tb2JpbGVfbnVtYmVyfTtcclxuICAgIGlmICh1c2VyLm90cCA9PT0gcGFyYW1zLm90cCkge1xyXG4gICAgICB1c2VyU2VydmljZS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zZW5kKHtcclxuICAgICAgICAgICAgXCJzdGF0dXNcIjogXCJTdWNjZXNzXCIsXHJcbiAgICAgICAgICAgIFwiZGF0YVwiOiB7XCJtZXNzYWdlXCI6IFwiVXNlciBBY2NvdW50IHZlcmlmaWVkIHN1Y2Nlc3NmdWxseVwifVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfT1RQLFxyXG4gICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmVyaWZ5T3RwKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcblxyXG4gICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuXHJcbiAgICB2YXIgcGFyYW1zID0gcmVxLmJvZHk7IC8vT1RQXHJcbiAgICAvLyAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIHZhciBxdWVyeSA9IHtcIl9pZFwiOiB1c2VyLl9pZCwgXCJpc0FjdGl2YXRlZFwiOiBmYWxzZX07XHJcbiAgICB2YXIgdXBkYXRlRGF0YSA9IHtcImlzQWN0aXZhdGVkXCI6IHRydWV9O1xyXG4gICAgaWYgKHVzZXIub3RwID09PSBwYXJhbXMub3RwKSB7XHJcbiAgICAgIHVzZXJTZXJ2aWNlLmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZURhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgICBcInN0YXR1c1wiOiBcIlN1Y2Nlc3NcIixcclxuICAgICAgICAgICAgXCJkYXRhXCI6IHtcIm1lc3NhZ2VcIjogXCJVc2VyIEFjY291bnQgdmVyaWZpZWQgc3VjY2Vzc2Z1bGx5XCJ9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XUk9OR19PVFAsXHJcbiAgICAgICAgY29kZTogNDAzXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdmVyaWZ5QWNjb3VudChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG5cclxuICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICB2YXIgcGFyYW1zID0gcmVxLnF1ZXJ5O1xyXG4gICAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuXHJcbiAgICB2YXIgcXVlcnkgPSB7XCJfaWRcIjogdXNlci5faWQsIFwiaXNBY3RpdmF0ZWRcIjogZmFsc2V9O1xyXG4gICAgdmFyIHVwZGF0ZURhdGEgPSB7XCJpc0FjdGl2YXRlZFwiOiB0cnVlfTtcclxuICAgIHVzZXJTZXJ2aWNlLmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZURhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuXHJcbiAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgXCJzdGF0dXNcIjogXCJTdWNjZXNzXCIsXHJcbiAgICAgICAgICBcImRhdGFcIjoge1wibWVzc2FnZVwiOiBcIlVzZXIgQWNjb3VudCB2ZXJpZmllZCBzdWNjZXNzZnVsbHlcIn1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHZlcmlmeUNoYW5nZWRFbWFpbElkKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIkNoYW5nZW1haWx2ZXJpZmljYXRpb24gaGl0XCIpO1xyXG4gICAgdmFyIHVzZXIgPSByZXEudXNlcjtcclxuICAgIHZhciBwYXJhbXMgPSByZXEucXVlcnk7XHJcbiAgICBkZWxldGUgcGFyYW1zLmFjY2Vzc190b2tlbjtcclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG5cclxuICAgIHZhciBxdWVyeSA9IHtcIl9pZFwiOiB1c2VyLl9pZH07XHJcbiAgICB2YXIgdXBkYXRlRGF0YSA9IHtcImVtYWlsXCI6IHVzZXIudGVtcF9lbWFpbCwgXCJ0ZW1wX2VtYWlsXCI6IHVzZXIuZW1haWx9O1xyXG4gICAgdXNlclNlcnZpY2UuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ2hhbmdlbWFpbHZlcmlmaWNhdGlvbiBoaXQgZXJyb3JcIiwgZXJyb3IpO1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG5cclxuICAgICAgICByZXMuc2VuZCh7XHJcbiAgICAgICAgICBcInN0YXR1c1wiOiBcIlN1Y2Nlc3NcIixcclxuICAgICAgICAgIFwiZGF0YVwiOiB7XCJtZXNzYWdlXCI6IFwiVXNlciBBY2NvdW50IHZlcmlmaWVkIHN1Y2Nlc3NmdWxseVwifVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5kdXN0cnkocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSkge1xyXG4gIF9fZGlybmFtZSA9ICcuLyc7XHJcbiAgdmFyIGZpbGVwYXRoID0gXCJpbmR1c3RyeS5qc29uXCI7XHJcbiAgdHJ5IHtcclxuICAgIHJlcy5zZW5kRmlsZShmaWxlcGF0aCwge3Jvb3Q6IF9fZGlybmFtZX0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbXBhbnlTaXplKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UpIHtcclxuICBfX2Rpcm5hbWUgPSAnLi8nO1xyXG4gIHZhciBmaWxlcGF0aCA9IFwiY29tcGFueS1zaXplLmpzb25cIjtcclxuICB0cnkge1xyXG4gICAgcmVzLnNlbmRGaWxlKGZpbGVwYXRoLCB7cm9vdDogX19kaXJuYW1lfSk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWRkcmVzcyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlKSB7XHJcbiAgX19kaXJuYW1lID0gJy4vJztcclxuICB2YXIgZmlsZXBhdGggPSBcImFkZHJlc3MuanNvblwiO1xyXG4gIHRyeSB7XHJcbiAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgsIHtyb290OiBfX2Rpcm5hbWV9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlYWxvY2F0aW9uKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UpIHtcclxuXHJcbiAgX19kaXJuYW1lID0gJy4vJztcclxuICB2YXIgZmlsZXBhdGggPSBcInJlYWxvY2F0aW9uLmpzb25cIjtcclxuICB0cnkge1xyXG4gICAgcmVzLnNlbmRGaWxlKGZpbGVwYXRoLCB7cm9vdDogX19kaXJuYW1lfSk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcbiAgfVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRFZHVjYXRpb24ocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSkge1xyXG4gIF9fZGlybmFtZSA9ICcuLyc7XHJcbiAgdmFyIGZpbGVwYXRoID0gXCJlZHVjYXRpb24uanNvblwiO1xyXG4gIHRyeSB7XHJcbiAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgsIHtyb290OiBfX2Rpcm5hbWV9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRFeHBlcmllbmNlKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UpIHtcclxuICBfX2Rpcm5hbWUgPSAnLi8nO1xyXG4gIHZhciBmaWxlcGF0aCA9IFwiZXhwZXJpZW5jZUxpc3QuanNvblwiO1xyXG4gIHRyeSB7XHJcbiAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgsIHtyb290OiBfX2Rpcm5hbWV9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEN1cnJlbnRTYWxhcnkocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSkge1xyXG4gIF9fZGlybmFtZSA9ICcuLyc7XHJcbiAgdmFyIGZpbGVwYXRoID0gXCJjdXJyZW50c2FsYXJ5TGlzdC5qc29uXCI7XHJcbiAgdHJ5IHtcclxuICAgIHJlcy5zZW5kRmlsZShmaWxlcGF0aCwge3Jvb3Q6IF9fZGlybmFtZX0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldE5vdGljZVBlcmlvZChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlKSB7XHJcbiAgX19kaXJuYW1lID0gJy4vJztcclxuICB2YXIgZmlsZXBhdGggPSBcIm5vdGljZXBlcmlvZExpc3QuanNvblwiO1xyXG4gIHRyeSB7XHJcbiAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgsIHtyb290OiBfX2Rpcm5hbWV9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRJbmR1c3RyeUV4cG9zdXJlKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UpIHtcclxuICBfX2Rpcm5hbWUgPSAnLi8nO1xyXG4gIHZhciBmaWxlcGF0aCA9IFwiaW5kdXN0cnlleHBvc3VyZUxpc3QuanNvblwiO1xyXG4gIHRyeSB7XHJcbiAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgsIHtyb290OiBfX2Rpcm5hbWV9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRTZWFyY2hlZENhbmRpZGF0ZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlKSB7XHJcbiAgX19kaXJuYW1lID0gJy4vJztcclxuICB2YXIgZmlsZXBhdGggPSBcImNhbmRpZGF0ZS5qc29uXCI7XHJcbiAgdHJ5IHtcclxuICAgIHJlcy5zZW5kRmlsZShmaWxlcGF0aCwge3Jvb3Q6IF9fZGlybmFtZX0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q291bnRyaWVzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UpIHtcclxuICBfX2Rpcm5hbWUgPSAnLi8nO1xyXG4gIHZhciBmaWxlcGF0aCA9IFwiY291bnRyeS5qc29uXCI7XHJcbiAgdHJ5IHtcclxuICAgIHJlcy5zZW5kRmlsZShmaWxlcGF0aCwge3Jvb3Q6IF9fZGlybmFtZX0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5kaWFTdGF0ZXMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSkge1xyXG4gIF9fZGlybmFtZSA9ICcuLyc7XHJcbiAgdmFyIGZpbGVwYXRoID0gXCJpbmRpYVN0YXRlcy5qc29uXCI7XHJcbiAgdHJ5IHtcclxuICAgIHJlcy5zZW5kRmlsZShmaWxlcGF0aCwge3Jvb3Q6IF9fZGlybmFtZX0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEZ1bmN0aW9uKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UpIHtcclxuICBfX2Rpcm5hbWUgPSAnLi8nO1xyXG4gIHZhciBmaWxlcGF0aCA9IFwiZnVuY3Rpb24uanNvblwiO1xyXG4gIHRyeSB7XHJcbiAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgsIHtyb290OiBfX2Rpcm5hbWV9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFJvbGUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSkge1xyXG4gIF9fZGlybmFtZSA9ICcuLyc7XHJcbiAgdmFyIGZpbGVwYXRoID0gXCJyb2xlcy5qc29uXCI7XHJcbiAgdHJ5IHtcclxuICAgIHJlcy5zZW5kRmlsZShmaWxlcGF0aCwge3Jvb3Q6IF9fZGlybmFtZX0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJvZmljaWVuY3kocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSkge1xyXG4gIF9fZGlybmFtZSA9ICcuLyc7XHJcbiAgdmFyIGZpbGVwYXRoID0gXCJwcm9maWNpZW5jeS5qc29uXCI7XHJcbiAgdHJ5IHtcclxuICAgIHJlcy5zZW5kRmlsZShmaWxlcGF0aCwge3Jvb3Q6IF9fZGlybmFtZX0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldERvbWFpbihyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlKSB7XHJcbiAgX19kaXJuYW1lID0gJy4vJztcclxuICB2YXIgZmlsZXBhdGggPSBcImRvbWFpbi5qc29uXCI7XHJcbiAgdHJ5IHtcclxuICAgIHJlcy5zZW5kRmlsZShmaWxlcGF0aCwge3Jvb3Q6IF9fZGlybmFtZX0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDYXBhYmlsaXR5KHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UpIHtcclxuICBfX2Rpcm5hbWUgPSAnLi8nO1xyXG4gIHZhciBmaWxlcGF0aCA9IFwiY2FwYWJpbGl0eS5qc29uXCI7XHJcbiAgdHJ5IHtcclxuICAgIHJlcy5zZW5kRmlsZShmaWxlcGF0aCwge3Jvb3Q6IF9fZGlybmFtZX0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbXBsZXhpdHkocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSkge1xyXG4gIF9fZGlybmFtZSA9ICcuLyc7XHJcbiAgdmFyIGZpbGVwYXRoID0gXCJjb21wbGV4aXR5Lmpzb25cIjtcclxuICB0cnkge1xyXG4gICAgcmVzLnNlbmRGaWxlKGZpbGVwYXRoLCB7cm9vdDogX19kaXJuYW1lfSk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZmJsb2dpbihyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICB2YXIgcGFyYW1zID0gcmVxLnVzZXI7XHJcbiAgICB2YXIgYXV0aCA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgIHVzZXJTZXJ2aWNlLnJldHJpZXZlKHBhcmFtcywgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc3VsdFswXSk7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgXCJzdGF0dXNcIjogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgICBcImlzU29jaWFsTG9naW5cIjogdHJ1ZSxcclxuICAgICAgICAgIFwiZGF0YVwiOiB7XHJcbiAgICAgICAgICAgIFwiZmlyc3RfbmFtZVwiOiByZXN1bHRbMF0uZmlyc3RfbmFtZSxcclxuICAgICAgICAgICAgXCJsYXN0X25hbWVcIjogcmVzdWx0WzBdLmxhc3RfbmFtZSxcclxuICAgICAgICAgICAgXCJlbWFpbFwiOiByZXN1bHRbMF0uZW1haWwsXHJcbiAgICAgICAgICAgIFwibW9iaWxlX251bWJlclwiOiByZXN1bHRbMF0ubW9iaWxlX251bWJlcixcclxuICAgICAgICAgICAgXCJwaWN0dXJlXCI6IHJlc3VsdFswXS5waWN0dXJlLFxyXG4gICAgICAgICAgICBcIl9pZFwiOiByZXN1bHRbMF0uX2lkLFxyXG4gICAgICAgICAgICBcImN1cnJlbnRfdGhlbWVcIjogcmVzdWx0WzBdLmN1cnJlbnRfdGhlbWVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRva2VuXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG5cclxuICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGdvb2dsZWxvZ2luKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIHZhciBwYXJhbXMgPSByZXEudXNlcjtcclxuICAgIGNvbnNvbGUubG9nKFwicGFyYW1zIGluIGdvb2dsZSBsb2dpblwiLCBwYXJhbXMpO1xyXG4gICAgdmFyIGF1dGggPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICB1c2VyU2VydmljZS5yZXRyaWV2ZShwYXJhbXMsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKHJlc3VsdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJyZXN1bHQgc2VudCB0byBmcm50IGFmdHIgZytsb2dpblwiKTtcclxuICAgICAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc3VsdFswXSk7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgXCJzdGF0dXNcIjogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgICBcImlzU29jaWFsTG9naW5cIjogdHJ1ZSxcclxuICAgICAgICAgIFwiZGF0YVwiOiB7XHJcbiAgICAgICAgICAgIFwiZmlyc3RfbmFtZVwiOiByZXN1bHRbMF0uZmlyc3RfbmFtZSxcclxuICAgICAgICAgICAgXCJsYXN0X25hbWVcIjogcmVzdWx0WzBdLmxhc3RfbmFtZSxcclxuICAgICAgICAgICAgXCJlbWFpbFwiOiByZXN1bHRbMF0uZW1haWwsXHJcbiAgICAgICAgICAgIFwibW9iaWxlX251bWJlclwiOiByZXN1bHRbMF0ubW9iaWxlX251bWJlcixcclxuICAgICAgICAgICAgXCJzb2NpYWxfcHJvZmlsZV9waWN0dXJlXCI6IHJlc3VsdFswXS5zb2NpYWxfcHJvZmlsZV9waWN0dXJlLFxyXG4gICAgICAgICAgICBcImN1cnJlbnRfdGhlbWVcIjogcmVzdWx0WzBdLmN1cnJlbnRfdGhlbWUsXHJcbiAgICAgICAgICAgIFwiX2lkXCI6IHJlc3VsdFswXS5faWRcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRva2VuXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG5cclxuICB9XHJcbn1cclxuLypleHBvcnQgZnVuY3Rpb24gZ2V0R29vZ2xlVG9rZW4ocmVxIDogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gdmFyIHRva2VuID0gSlNPTi5zdHJpbmdpZnkocmVxLmJvZHkudG9rZW4pO1xyXG5cclxuIHZhciB1cmwgPSAnaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vb2F1dGgyL3YzL3Rva2VuaW5mbz9pZF90b2tlbj0nK3Rva2VuO1xyXG4gY29uc29sZS5sb2coJ3VybCA6ICcrdG9rZW4pO1xyXG4gcmVxdWVzdCh1cmwsIGZ1bmN0aW9uKCBlcnJvcjphbnkgLCByZXNwb25zZTphbnkgLCBib2R5OmFueSApIHtcclxuIGlmKGVycm9yKXtcclxuIGNvbnNvbGUubG9nKCdlcnJvciA6JytlcnJvcik7XHJcbiAvL3Jlcy5zZW5kKGVycm9yKTtcclxuIH1cclxuIGVsc2UgaWYgKGJvZHkpIHtcclxuIGNvbnNvbGUubG9nKCdib2R5IDonK0pTT04uc3RyaW5naWZ5KGJvZHkpKTtcclxuIC8vcmVzLnNlbmQoYm9keSk7XHJcbiB9XHJcbiB9KTtcclxuIC8vIHJlcy5zZW5kKHRva2VuKTtcclxuIH0qL1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVBpY3R1cmUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgX19kaXJuYW1lID0gJ3NyYy9zZXJ2ZXIvYXBwL2ZyYW1ld29yay9wdWJsaWMvcHJvZmlsZWltYWdlJztcclxuICB2YXIgZm9ybSA9IG5ldyBtdWx0aXBhcnR5LkZvcm0oe3VwbG9hZERpcjogX19kaXJuYW1lfSk7XHJcbiAgZm9ybS5wYXJzZShyZXEsIChlcnI6IEVycm9yLCBmaWVsZHM6IGFueSwgZmlsZXM6IGFueSkgPT4ge1xyXG4gICAgaWYgKGVycikge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRElSRUNUT1JZX05PVF9GT1VORCxcclxuICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRElSRUNUT1JZX05PVF9GT1VORCxcclxuICAgICAgICBjb2RlOiA0MDFcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgcGF0aCA9IEpTT04uc3RyaW5naWZ5KGZpbGVzLmZpbGVbMF0ucGF0aCk7XHJcbiAgICAgIHZhciBpbWFnZV9wYXRoID0gZmlsZXMuZmlsZVswXS5wYXRoO1xyXG4gICAgICB2YXIgb3JpZ2luYWxGaWxlbmFtZSA9IEpTT04uc3RyaW5naWZ5KGltYWdlX3BhdGguc3Vic3RyKGZpbGVzLmZpbGVbMF0ucGF0aC5sYXN0SW5kZXhPZignLycpICsgMSkpO1xyXG4gICAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuXHJcbiAgICAgIHVzZXJTZXJ2aWNlLlVwbG9hZEltYWdlKHBhdGgsIG9yaWdpbmFsRmlsZW5hbWUsIGZ1bmN0aW9uIChlcnI6IGFueSwgdGVtcGF0aDogYW55KSB7XHJcbiAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgbmV4dChlcnIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIHZhciBteXBhdGggPSB0ZW1wYXRoO1xyXG5cclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHZhciB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgICAgICAgIHZhciBxdWVyeSA9IHtcIl9pZFwiOiB1c2VyLl9pZH07XHJcblxyXG4gICAgICAgICAgICB1c2VyU2VydmljZS5maW5kQnlJZCh1c2VyLl9pZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlcnJvcn0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghcmVzdWx0LmlzQ2FuZGlkYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgIGxldCByZWNydWl0ZXJTZXJ2aWNlOiBSZWNydWl0ZXJTZXJ2aWNlID0gbmV3IFJlY3J1aXRlclNlcnZpY2UoKTtcclxuICAgICAgICAgICAgICAgICAgbGV0IHF1ZXJ5MSA9IHtcInVzZXJJZFwiOiByZXN1bHQuX2lkfTtcclxuICAgICAgICAgICAgICAgICAgcmVjcnVpdGVyU2VydmljZS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5MSwge2NvbXBhbnlfbG9nbzogbXlwYXRofSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzcG9uc2UxKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZXJyb3J9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ1cGRhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgdXNlclNlcnZpY2UuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwge3BpY3R1cmU6IG15cGF0aH0sIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlcnJvcn0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZChyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHthY2Nlc3NfdG9rZW46IHRva2VuLCBkYXRhOiByZXNwb25zZX0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICB1c2VyU2VydmljZS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB7cGljdHVyZTogbXlwYXRofSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlcnJvcn0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHZhciBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7YWNjZXNzX3Rva2VuOiB0b2tlbiwgZGF0YTogcmVzcG9uc2V9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICB9KTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVDb21wYW55RGV0YWlscyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuXHJcbiAgY29uc29sZS5sb2coXCJVcGRhdGVQaWN0dXJlIHVzZXIgQ29udHJvbGxlciBpcyBiZWVuIGhpdCByZXEgXCIpO1xyXG4gIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gIHZhciB1c2VyID0gcmVxLnVzZXI7XHJcbiAgdmFyIHF1ZXJ5ID0ge1wiX2lkXCI6IHVzZXIuX2lkfTtcclxuICAvKnVzZXJTZXJ2aWNlLmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHtwaWN0dXJlOiBteXBhdGh9LCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgaWYgKGVycm9yKSB7XHJcbiAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlcnJvcn0pO1xyXG4gICB9XHJcbiAgIGVsc2V7XHJcbiAgIHZhciBhdXRoOkF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgdmFyIHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZChyZXN1bHQpO1xyXG4gICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7YWNjZXNzX3Rva2VuOiB0b2tlbiwgZGF0YTogcmVzdWx0fSk7XHJcbiAgIH1cclxuICAgfSk7Ki9cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwbG9hZGRvY3VtZW50cyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICBfX2Rpcm5hbWUgPSAnc3JjL3NlcnZlci9hcHAvZnJhbWV3b3JrL3B1YmxpYy91cGxvYWRlZC1kb2N1bWVudCc7XHJcblxyXG4gIHZhciBmb3JtID0gbmV3IG11bHRpcGFydHkuRm9ybSh7dXBsb2FkRGlyOiBfX2Rpcm5hbWV9KTtcclxuICBjb25zb2xlLmxvZyhcInVwZGF0ZWRvY3VtZW50cyB1c2VyIENvbnRyb2xsZXIgaXMgYmVlbiBoaXQgcmVxIFwiLCByZXEpO1xyXG4gIGZvcm0ucGFyc2UocmVxLCAoZXJyOiBFcnJvciwgZmllbGRzOiBhbnksIGZpbGVzOiBhbnkpID0+IHtcclxuICAgIGlmIChlcnIpIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0RJUkVDVE9SWV9OT1RfRk9VTkQsXHJcbiAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0RJUkVDVE9SWV9OT1RfRk9VTkQsXHJcbiAgICAgICAgY29kZTogNDAxXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2coXCJmaWVsZHMgb2YgZG9jIHVwbG9hZDpcIiArIGZpZWxkcyk7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiZmlsZXMgb2YgZG9jIHVwbG9hZDpcIiArIGZpbGVzKTtcclxuXHJcbiAgICAgIHZhciBwYXRoID0gSlNPTi5zdHJpbmdpZnkoZmlsZXMuZmlsZVswXS5wYXRoKTtcclxuICAgICAgY29uc29sZS5sb2coXCJQYXRoIHVybCBvZiBkb2MgdXBsb2FkOlwiICsgcGF0aCk7XHJcbiAgICAgIHZhciBkb2N1bWVudF9wYXRoID0gZmlsZXMuZmlsZVswXS5wYXRoO1xyXG4gICAgICBjb25zb2xlLmxvZyhcIkRvY3VtZW50IHBhdGggb2YgZG9jIHVwbG9hZDpcIiArIGRvY3VtZW50X3BhdGgpO1xyXG4gICAgICB2YXIgb3JpZ2luYWxGaWxlbmFtZSA9IEpTT04uc3RyaW5naWZ5KGRvY3VtZW50X3BhdGguc3Vic3RyKGZpbGVzLmZpbGVbMF0ucGF0aC5sYXN0SW5kZXhPZignLycpICsgMSkpO1xyXG4gICAgICBjb25zb2xlLmxvZyhcIk9yaWdpbmFsIEZpbGVOYW1lIG9mIGRvYyB1cGxvYWQ6XCIgKyBvcmlnaW5hbEZpbGVuYW1lKTtcclxuXHJcbiAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICBcInN0YXR1c1wiOiBNZXNzYWdlcy5TVEFUVVNfU1VDQ0VTUyxcclxuICAgICAgICBcImRhdGFcIjoge1xyXG4gICAgICAgICAgXCJkb2N1bWVudFwiOiBkb2N1bWVudF9wYXRoXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8qICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgICB1c2VyU2VydmljZS5VcGxvYWREb2N1bWVudHMocGF0aCwgb3JpZ2luYWxGaWxlbmFtZSwgZnVuY3Rpb24gKGVycjphbnksIHRlbXBhdGg6YW55KSB7XHJcbiAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICBjb25zb2xlLmxvZyhcIkVyciBtZXNzYWdlIG9mIHVwbG9hZGRvY3VtZW50IGlzOlwiLGVycik7XHJcbiAgICAgICBuZXh0KGVycik7XHJcbiAgICAgICB9XHJcbiAgICAgICBlbHNlIHtcclxuICAgICAgIHZhciBteXBhdGggPSB0ZW1wYXRoO1xyXG4gICAgICAgdHJ5IHtcclxuICAgICAgIHZhciB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgICB2YXIgcXVlcnkgPSB7XCJfaWRcIjogdXNlci5faWR9O1xyXG4gICAgICAgdXNlclNlcnZpY2UuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwge2RvY3VtZW50MTogbXlwYXRofSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlcnJvcn0pO1xyXG4gICAgICAgfVxyXG4gICAgICAgZWxzZXtcclxuICAgICAgIHZhciBhdXRoOkF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgICAgIHZhciB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQocmVzdWx0KTtcclxuICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHthY2Nlc3NfdG9rZW46IHRva2VuLCBkYXRhOiByZXN1bHR9KTtcclxuICAgICAgIH1cclxuICAgICAgIH0pO1xyXG4gICAgICAgfVxyXG4gICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIH0pOyovXHJcbiAgICB9XHJcblxyXG4gIH0pO1xyXG5cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwcm9maWxlY3JlYXRlKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UpIHtcclxuICB0cnkge1xyXG5cclxuICAgIGNvbnNvbGUubG9nKFwiSW4gcHJvZmlsZSBjcmVhdGVcIik7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHByb2Zlc3Npb25hbGRhdGEocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSkge1xyXG4gIHRyeSB7XHJcblxyXG4gICAgdmFyIG5ld1VzZXIgPSByZXEuYm9keTtcclxuICAgIGNvbnNvbGUubG9nKFwibmV3VXNlclwiLCBKU09OLnN0cmluZ2lmeShuZXdVc2VyKSk7XHJcblxyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe1wic3RhdHVzXCI6IE1lc3NhZ2VzLlNUQVRVU19FUlJPUiwgXCJlcnJvcl9tZXNzYWdlXCI6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBlbXBsb3ltZW50ZGF0YShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlKSB7XHJcbiAgdHJ5IHtcclxuXHJcbiAgICB2YXIgbmV3VXNlciA9IHJlcS5ib2R5O1xyXG4gICAgY29uc29sZS5sb2coXCJuZXdVc2VyXCIsIEpTT04uc3RyaW5naWZ5KG5ld1VzZXIpKTtcclxuXHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7XCJzdGF0dXNcIjogTWVzc2FnZXMuU1RBVFVTX0VSUk9SLCBcImVycm9yX21lc3NhZ2VcIjogZS5tZXNzYWdlfSk7XHJcbiAgfVxyXG5cclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGFuZ2VUaGVtZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICB0cnkge1xyXG4gICAgdmFyIHVzZXIgPSByZXEudXNlcjtcclxuICAgIHZhciBwYXJhbXMgPSByZXEucXVlcnk7XHJcbiAgICBkZWxldGUgcGFyYW1zLmFjY2Vzc190b2tlbjtcclxuICAgIHZhciBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIHZhciBxdWVyeSA9IHtcIl9pZFwiOiByZXEudXNlci5pZH07XHJcbiAgICB2YXIgdXBkYXRlRGF0YSA9IHtcImN1cnJlbnRfdGhlbWVcIjogcmVxLmJvZHkuY3VycmVudF90aGVtZX07XHJcbiAgICB1c2VyU2VydmljZS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKTtcclxuXHJcbiAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlbiwgZGF0YTogcmVzdWx0XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxuXHJcblxyXG59XHJcbiJdfQ==
