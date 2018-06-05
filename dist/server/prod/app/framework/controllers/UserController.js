"use strict";
var multiparty = require("multiparty");
var AuthInterceptor = require("../interceptor/auth.interceptor");
var SendMailService = require("../services/mailer.service");
var UserService = require("../services/UserService");
var Messages = require("../shared/messages");
var ResponseService = require("../shared/response.service");
var config = require('config');
var path = require('path');
var bcrypt = require('bcrypt');
var UserController = (function () {
    function UserController() {
        this._authInterceptor = new AuthInterceptor();
        this._sendMailService = new SendMailService();
        this._userService = new UserService();
        this._responseService = new ResponseService();
    }
    UserController.prototype.create = function (req, res, next) {
        try {
            var data = req.body;
            var userService = new UserService();
            var auth_1 = new AuthInterceptor();
            userService.createUser(data, function (error, result) {
                if (error) {
                    next({
                        reason: Messages.MSG_ERROR_REGISTRATION,
                        message: Messages.MSG_ERROR_REGISTRATION,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                else {
                    var token = auth_1.issueTokenWithUid(result);
                    res.send({
                        'data': result,
                        access_token: token
                    });
                }
            });
        }
        catch (e) {
            console.log(e);
            res.send({ 'error': 'error in your request' });
        }
    };
    UserController.prototype.login = function (req, res, next) {
        try {
            var userService = new UserService();
            var params = req.body;
            delete params.access_token;
            userService.login(params, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    res.status(200).send(result);
                }
            });
        }
        catch (e) {
            res.send(e);
        }
    };
    UserController.prototype.sendOtp = function (req, res, next) {
        try {
            var userService = new UserService();
            var user = req.user;
            var params = req.body;
            userService.sendOtp(params, user, function (error, result) {
                if (error) {
                    res.send(error);
                }
                else {
                    res.status(200).send(result);
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
    };
    UserController.prototype.verifyOtp = function (req, res, next) {
        try {
            var user = req.user;
            var params = req.body;
            var userService = new UserService();
            userService.verifyOtp(params, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    res.send(result);
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
    };
    UserController.prototype.forgotPassword = function (req, res, next) {
        try {
            var userService = new UserService();
            var params = req.body;
            userService.forgotPassword(params, function (error, result) {
                if (error) {
                    if (error.message === Messages.MSG_ERROR_CHECK_INACTIVE_ACCOUNT) {
                        next({
                            reason: Messages.MSG_ERROR_USER_NOT_ACTIVATED,
                            message: Messages.MSG_ERROR_ACCOUNT_STATUS,
                            stackTrace: new Error(),
                            code: 400
                        });
                    }
                    else if (error.message === Messages.MSG_ERROR_USER_NOT_FOUND) {
                        next({
                            reason: Messages.MSG_ERROR_RSN_USER_NOT_FOUND,
                            message: Messages.MSG_ERROR_USER_NOT_FOUND,
                            stackTrace: new Error(),
                            code: 400
                        });
                    }
                }
                else {
                    res.status(200).send({
                        'status': Messages.STATUS_SUCCESS,
                        'data': { 'message': Messages.MSG_SUCCESS_EMAIL_FORGOT_PASSWORD }
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
    };
    UserController.prototype.resetPassword = function (req, res, next) {
        try {
            var user = req.user;
            var params = req.body;
            delete params.access_token;
            var userService = new UserService();
            userService.resetPassword(params, user, function (err, result) {
                if (err) {
                    next(err, null);
                }
                else {
                    res.send(result);
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
    };
    UserController.prototype.updateDetails = function (req, res, next) {
        try {
            var newUserData = req.body;
            var params = req.query;
            var user = req.user;
            delete params.access_token;
            var userService = new UserService();
            userService.updateDetails(newUserData, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    res.send(result);
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
    };
    UserController.prototype.retrieve = function (req, res, next) {
        try {
            var userService = new UserService();
            var params = req.params.id;
            delete params.access_token;
            var user = req.user;
            userService.getUserById(user, function (err, result) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.send(result);
                }
            });
        }
        catch (e) {
            res.send(e);
        }
    };
    UserController.prototype.changeEmailId = function (req, res, next) {
        try {
            var user = req.user;
            var params = req.query;
            delete params.access_token;
            var data = {
                current_email: req.body.current_email,
                new_email: req.body.new_email
            };
            var userService = new UserService();
            userService.changeEmailId(data, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    res.send(result);
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
    };
    UserController.prototype.verifyChangedEmailId = function (req, res, next) {
        try {
            var user = req.user;
            var params = req.query;
            delete params.access_token;
            var userService = new UserService();
            userService.verifyChangedEmailId(user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    res.send(result);
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
    };
    UserController.prototype.changeMobileNumber = function (req, res, next) {
        try {
            var user_1 = req.user;
            var params_1 = req.body;
            var auth = new AuthInterceptor();
            var userService_1 = new UserService();
            var query = { 'mobile_number': params_1.new_mobile_number, 'isActivated': true };
            userService_1.retrieve(query, function (error, result) {
                if (error) {
                    next(error);
                }
                else if (result.length > 0) {
                    next({
                        reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
                        message: Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                else {
                    var Data = {
                        current_mobile_number: user_1.mobile_number,
                        _id: user_1._id,
                        new_mobile_number: params_1.new_mobile_number
                    };
                    userService_1.changeMobileNumber(Data, function (error, result) {
                        if (error) {
                            next({
                                reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
                                message: Messages.MSG_ERROR_WHILE_CONTACTING,
                                stackTrace: new Error(),
                                code: 400
                            });
                        }
                        else {
                            res.status(200).send({
                                'status': Messages.STATUS_SUCCESS,
                                'data': {
                                    'message': Messages.MSG_SUCCESS_OTP_CHANGE_MOBILE_NUMBER
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
    };
    UserController.prototype.verifyMobileNumber = function (req, res, next) {
        try {
            var user = req.user;
            var params = req.body;
            var userService = new UserService();
            userService.verifyMobileNumber(params, user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    res.send(result);
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
    };
    UserController.prototype.changePassword = function (req, res, next) {
        try {
            var user_2 = req.user;
            var params = req.query;
            delete params.access_token;
            var auth_2 = new AuthInterceptor();
            var userService_2 = new UserService();
            bcrypt.compare(req.body.current_password, user_2.password, function (err, isSame) {
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
                        if (req.body.current_password === req.body.new_password) {
                            next({
                                reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                                message: Messages.MSG_ERROR_SAME_NEW_PASSWORD,
                                stackTrace: new Error(),
                                code: 400
                            });
                        }
                        else {
                            var new_password_1;
                            var saltRounds = 10;
                            bcrypt.hash(req.body.new_password, saltRounds, function (err, hash) {
                                if (err) {
                                    next({
                                        reason: Messages.MSG_ERROR_RSN_INVALID_REGISTRATION_STATUS,
                                        message: Messages.MSG_ERROR_BCRYPT_CREATION,
                                        stackTrace: new Error(),
                                        code: 400
                                    });
                                }
                                else {
                                    new_password_1 = hash;
                                    var query = { '_id': req.user._id };
                                    var updateData = { 'password': new_password_1 };
                                    userService_2.findOneAndUpdate(query, updateData, { new: true }, function (error, result) {
                                        if (error) {
                                            next(error);
                                        }
                                        else {
                                            var token = auth_2.issueTokenWithUid(user_2);
                                            res.send({
                                                'status': 'Success',
                                                'data': { 'message': Messages.MSG_SUCCESS_PASSWORD_CHANGE },
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
                            code: 400
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
    };
    UserController.prototype.sendMail = function (req, res, next) {
        try {
            var userService = new UserService();
            var params = req.body;
            userService.sendMail(params, function (error, result) {
                if (error) {
                    next({
                        reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
                        message: Messages.MSG_ERROR_WHILE_CONTACTING,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                else {
                    res.status(200).send({
                        'status': Messages.STATUS_SUCCESS,
                        'data': { 'message': Messages.MSG_SUCCESS_SUBMITTED }
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
    };
    UserController.prototype.updatePicture = function (req, res, next) {
        __dirname = path.resolve() + config.get('application.profilePath');
        var form = new multiparty.Form({ uploadDir: __dirname });
        form.parse(req, function (err, fields, files) {
            if (err) {
                next({
                    reason: Messages.MSG_ERROR_RSN_DIRECTORY_NOT_FOUND,
                    message: Messages.MSG_ERROR_DIRECTORY_NOT_FOUND,
                    stackTrace: new Error(),
                    actualError: err,
                    code: 403
                });
            }
            else {
                var path_1 = JSON.stringify(files.file[0].path);
                var image_path = files.file[0].path;
                var originalFilename = JSON.stringify(image_path.substr(files.file[0].path.lastIndexOf('/') + 1));
                var userService_3 = new UserService();
                path_1 = config.get('application.profilePathForClient') + originalFilename.replace(/"/g, '');
                userService_3.UploadImage(path_1, originalFilename, function (err, tempath) {
                    if (err) {
                        next(err);
                    }
                    else {
                        var mypath_1 = tempath;
                        try {
                            var user = req.user;
                            var query_1 = { '_id': user._id };
                            userService_3.findById(user._id, function (error, result) {
                                if (error) {
                                    next(error);
                                }
                                else {
                                    userService_3.findOneAndUpdate(query_1, { picture: mypath_1 }, { new: true }, function (error, response) {
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
    };
    UserController.prototype.getProjects = function (req, res, next) {
        try {
            var user = req.user;
            var userService = new UserService();
            userService.getProjects(user, function (error, result) {
                if (error) {
                    next(error);
                }
                else {
                    res.send(result);
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
    };
    return UserController;
}());
module.exports = UserController;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvVXNlckNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLHVDQUF5QztBQUV6QyxpRUFBb0U7QUFDcEUsNERBQStEO0FBRS9ELHFEQUF3RDtBQUN4RCw2Q0FBZ0Q7QUFDaEQsNERBQStEO0FBRy9ELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRS9CO0lBTUU7UUFDRSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztRQUM5QyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztRQUM5QyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksZUFBZSxFQUFFLENBQUM7SUFDaEQsQ0FBQztJQUVELCtCQUFNLEdBQU4sVUFBTyxHQUFvQixFQUFFLEdBQXFCLEVBQUUsSUFBUztRQUMzRCxJQUFJLENBQUM7WUFFSCxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ3BCLElBQUksV0FBVyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7WUFDcEMsSUFBSSxNQUFJLEdBQW9CLElBQUksZUFBZSxFQUFFLENBQUM7WUFDbEQsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsVUFBQyxLQUFLLEVBQUUsTUFBTTtnQkFDekMsRUFBRSxDQUFBLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDVCxJQUFJLENBQUM7d0JBQ0gsTUFBTSxFQUFFLFFBQVEsQ0FBQyxzQkFBc0I7d0JBQ3ZDLE9BQU8sRUFBRSxRQUFRLENBQUMsc0JBQXNCO3dCQUN4QyxVQUFV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IjpbImltcG9ydCAqIGFzIGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XHJcbmltcG9ydCAqIGFzIG11bHRpcGFydHkgZnJvbSAnbXVsdGlwYXJ0eSc7XHJcbmltcG9ydCB7IE1haWxDaGltcE1haWxlclNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9tYWlsY2hpbXAtbWFpbGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgQXV0aEludGVyY2VwdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJjZXB0b3IvYXV0aC5pbnRlcmNlcHRvcicpO1xyXG5pbXBvcnQgU2VuZE1haWxTZXJ2aWNlID0gcmVxdWlyZSgnLi4vc2VydmljZXMvbWFpbGVyLnNlcnZpY2UnKTtcclxuaW1wb3J0IFVzZXJNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvVXNlck1vZGVsJyk7XHJcbmltcG9ydCBVc2VyU2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL1VzZXJTZXJ2aWNlJyk7XHJcbmltcG9ydCBNZXNzYWdlcyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9tZXNzYWdlcycpO1xyXG5pbXBvcnQgUmVzcG9uc2VTZXJ2aWNlID0gcmVxdWlyZSgnLi4vc2hhcmVkL3Jlc3BvbnNlLnNlcnZpY2UnKTtcclxuXHJcblxyXG5sZXQgY29uZmlnID0gcmVxdWlyZSgnY29uZmlnJyk7XHJcbmxldCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xyXG5sZXQgYmNyeXB0ID0gcmVxdWlyZSgnYmNyeXB0Jyk7XHJcblxyXG5jbGFzcyBVc2VyQ29udHJvbGxlciB7XHJcbiAgcHJpdmF0ZSBfYXV0aEludGVyY2VwdG9yIDogQXV0aEludGVyY2VwdG9yO1xyXG4gIHByaXZhdGUgX3NlbmRNYWlsU2VydmljZSA6IFNlbmRNYWlsU2VydmljZTtcclxuICBwcml2YXRlIF91c2VyU2VydmljZSA6IFVzZXJTZXJ2aWNlO1xyXG4gIHByaXZhdGUgX3Jlc3BvbnNlU2VydmljZSA6IFJlc3BvbnNlU2VydmljZTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLl9hdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICB0aGlzLl9zZW5kTWFpbFNlcnZpY2UgPSBuZXcgU2VuZE1haWxTZXJ2aWNlKCk7XHJcbiAgICB0aGlzLl91c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgdGhpcy5fcmVzcG9uc2VTZXJ2aWNlID0gbmV3IFJlc3BvbnNlU2VydmljZSgpO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuXHJcbiAgICAgIGxldCBkYXRhID0gcmVxLmJvZHk7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICBsZXQgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgICB1c2VyU2VydmljZS5jcmVhdGVVc2VyKGRhdGEsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT04sXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT04sXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgLypyZXMuc3RhdHVzKDQwMCkuc2VuZCh7J2Vycm9yJzplcnJvci5tZXNzYWdlLCdtZXNzYWdlJzplcnJvci5tZXNzYWdlIH0pOyovXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxldCB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQocmVzdWx0KTtcclxuICAgICAgICAgIHJlcy5zZW5kKHtcclxuICAgICAgICAgICAgJ2RhdGEnOiByZXN1bHQsXHJcbiAgICAgICAgICAgIGFjY2Vzc190b2tlbjogdG9rZW5cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSAge1xyXG4gICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgcmVzLnNlbmQoeydlcnJvcic6ICdlcnJvciBpbiB5b3VyIHJlcXVlc3QnfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBsb2dpbihyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICBsZXQgcGFyYW1zID0gcmVxLmJvZHk7XHJcbiAgICAgIGRlbGV0ZSBwYXJhbXMuYWNjZXNzX3Rva2VuO1xyXG4gICAgICB1c2VyU2VydmljZS5sb2dpbihwYXJhbXMsIChlcnJvciwgcmVzdWx0KT0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgcmVzLnNlbmQoZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZW5kT3RwKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwYXJhbXMgPSByZXEuYm9keTsgIC8vbW9iaWxlX251bWJlcihuZXcpXHJcbiAgICAgIHVzZXJTZXJ2aWNlLnNlbmRPdHAocGFyYW1zLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCk9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIHJlcy5zZW5kKGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQocmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAzXHJcbiAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZlcmlmeU90cChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICAgIHRyeSB7XHJcblxyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcGFyYW1zID0gcmVxLmJvZHk7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICB1c2VyU2VydmljZS52ZXJpZnlPdHAocGFyYW1zLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCk9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXMuc2VuZChyZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmb3Jnb3RQYXNzd29yZChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICBsZXQgcGFyYW1zID0gcmVxLmJvZHk7ICAgLy9lbWFpbFxyXG5cclxuICAgICAgdXNlclNlcnZpY2UuZm9yZ290UGFzc3dvcmQocGFyYW1zLCAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHtcclxuXHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IubWVzc2FnZSA9PT0gTWVzc2FnZXMuTVNHX0VSUk9SX0NIRUNLX0lOQUNUSVZFX0FDQ09VTlQpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfVVNFUl9OT1RfQUNUSVZBVEVELFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9BQ0NPVU5UX1NUQVRVUyxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yLm1lc3NhZ2UgPT09IE1lc3NhZ2VzLk1TR19FUlJPUl9VU0VSX05PVF9GT1VORCkge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fVVNFUl9OT1RfRk9VTkQsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1VTRVJfTk9UX0ZPVU5ELFxyXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgICAnc3RhdHVzJzogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgICAgICdkYXRhJzogeydtZXNzYWdlJzogTWVzc2FnZXMuTVNHX1NVQ0NFU1NfRU1BSUxfRk9SR09UX1BBU1NXT1JEfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlc2V0UGFzc3dvcmQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcGFyYW1zID0gcmVxLmJvZHk7ICAgLy9uZXdfcGFzc3dvcmRcclxuICAgICAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICB1c2VyU2VydmljZS5yZXNldFBhc3N3b3JkKHBhcmFtcywgdXNlciwgKGVycjogYW55LCByZXN1bHQ6IGFueSkgPT4ge1xyXG4gICAgICAgIGlmKGVycikge1xyXG4gICAgICAgICAgbmV4dChlcnIsIG51bGwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXMuc2VuZChyZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIC8qYmNyeXB0Lmhhc2gocmVxLmJvZHkubmV3X3Bhc3N3b3JkLCBzYWx0Um91bmRzLCAoZXJyOiBhbnksIGhhc2g6IGFueSkgPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246ICdFcnJvciBpbiBjcmVhdGluZyBoYXNoIHVzaW5nIGJjcnlwdCcsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdFcnJvciBpbiBjcmVhdGluZyBoYXNoIHVzaW5nIGJjcnlwdCcsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsZXQgdXBkYXRlRGF0YSA9IHsncGFzc3dvcmQnOiBoYXNofTtcclxuICAgICAgICAgIGxldCBxdWVyeSA9IHtcclxuICAgICAgICAgICAgJ19pZCc6IHVzZXIuX2lkLFxyXG4gICAgICAgICAgICAncGFzc3dvcmQnOiByZXEudXNlci5wYXNzd29yZFxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIHVzZXJTZXJ2aWNlLmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZURhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICByZXMuc2VuZCh7XHJcbiAgICAgICAgICAgICAgICAnc3RhdHVzJzogJ1N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAgICAgJ2RhdGEnOiB7J21lc3NhZ2UnOiAnUGFzc3dvcmQgY2hhbmdlZCBzdWNjZXNzZnVsbHknfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pOyovXHJcblxyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAzXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlRGV0YWlscyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCBuZXdVc2VyRGF0YTogVXNlck1vZGVsID0gPFVzZXJNb2RlbD5yZXEuYm9keTtcclxuICAgICAgbGV0IHBhcmFtcyA9IHJlcS5xdWVyeTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XHJcblxyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgdXNlclNlcnZpY2UudXBkYXRlRGV0YWlscyhuZXdVc2VyRGF0YSwgdXNlciwgKGVycm9yLCByZXN1bHQpPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnNlbmQocmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAzXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuICAvKnVwZGF0ZVByb2ZpbGVGaWVsZChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIC8vbGV0IG5ld1VzZXJEYXRhOiBVc2VyTW9kZWwgPSA8VXNlck1vZGVsPnJlcS5ib2R5O1xyXG5cclxuICAgICAgbGV0IHBhcmFtcyA9IHJlcS5xdWVyeTtcclxuICAgICAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBfaWQ6IHN0cmluZyA9IHVzZXIuX2lkO1xyXG4gICAgICBsZXQgZk5hbWU6IHN0cmluZyA9IHJlcS5wYXJhbXMuZm5hbWU7XHJcbiAgICAgIGlmIChmTmFtZSA9PSAnZ3VpZGVfdG91cicpIHtcclxuICAgICAgICB2YXIgZGF0YSA9IHsnZ3VpZGVfdG91cic6IHJlcS5ib2R5fTtcclxuICAgICAgfVxyXG4gICAgICBsZXQgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgdXNlclNlcnZpY2UudXBkYXRlKF9pZCwgZGF0YSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIHVzZXJTZXJ2aWNlLnJldHJpZXZlKF9pZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XUk9OR19UT0tFTixcclxuICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgICAgICAgXCJzdGF0dXNcIjogXCJzdWNjZXNzXCIsXHJcbiAgICAgICAgICAgICAgICBcImRhdGFcIjoge1xyXG4gICAgICAgICAgICAgICAgICBcImZpcnN0X25hbWVcIjogcmVzdWx0WzBdLmZpcnN0X25hbWUsXHJcbiAgICAgICAgICAgICAgICAgIFwibGFzdF9uYW1lXCI6IHJlc3VsdFswXS5sYXN0X25hbWUsXHJcbiAgICAgICAgICAgICAgICAgIFwiZW1haWxcIjogcmVzdWx0WzBdLmVtYWlsLFxyXG4gICAgICAgICAgICAgICAgICBcIl9pZFwiOiByZXN1bHRbMF0udXNlcklkLFxyXG4gICAgICAgICAgICAgICAgICBcImd1aWRlX3RvdXJcIjogcmVzdWx0WzBdLmd1aWRlX3RvdXJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSovXHJcblxyXG4gIHJldHJpZXZlKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCBwYXJhbXMgPSByZXEucGFyYW1zLmlkO1xyXG4gICAgICBkZWxldGUgcGFyYW1zLmFjY2Vzc190b2tlbjtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgLy92YXIgdXNlclNlcnZpY2VzID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgIHVzZXJTZXJ2aWNlLmdldFVzZXJCeUlkKHVzZXIsIChlcnIsIHJlc3VsdCk9PiB7XHJcbiAgICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgICByZXMuc2VuZChlcnIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXMuc2VuZChyZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIHJlcy5zZW5kKGUpO1xyXG4gICAgICAvKm5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7Ki9cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qdmVyaWZpY2F0aW9uTWFpbChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcGFyYW1zID0gcmVxLmJvZHk7XHJcbiAgICAgIHVzZXJTZXJ2aWNlLnNlbmRWZXJpZmljYXRpb25NYWlsKHBhcmFtcywgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fV0hJTEVfQ09OVEFDVElORyxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dISUxFX0NPTlRBQ1RJTkcsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgICAgXCJzdGF0dXNcIjogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgICAgIFwiZGF0YVwiOiB7XCJtZXNzYWdlXCI6IE1lc3NhZ2VzLk1TR19TVUNDRVNTX0VNQUlMX1JFR0lTVFJBVElPTn1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAzXHJcbiAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuICB9Ki9cclxuICAvKnZlcmlmeUFjY291bnQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgICB0cnkge1xyXG5cclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHBhcmFtcyA9IHJlcS5xdWVyeTtcclxuICAgICAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICB1c2VyU2VydmljZS52ZXJpZnlBY2NvdW50KHVzZXIsIChlcnJvciwgcmVzdWx0KT0+IHtcclxuXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0qL1xyXG5cclxuICBjaGFuZ2VFbWFpbElkKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwYXJhbXMgPSByZXEucXVlcnk7XHJcbiAgICAgIGRlbGV0ZSBwYXJhbXMuYWNjZXNzX3Rva2VuO1xyXG4gICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICBjdXJyZW50X2VtYWlsOiByZXEuYm9keS5jdXJyZW50X2VtYWlsLFxyXG4gICAgICAgIG5ld19lbWFpbDogcmVxLmJvZHkubmV3X2VtYWlsXHJcbiAgICAgIH07XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG5cclxuICAgICAgdXNlclNlcnZpY2UuY2hhbmdlRW1haWxJZChkYXRhLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnNlbmQocmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAzXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmVyaWZ5Q2hhbmdlZEVtYWlsSWQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcGFyYW1zID0gcmVxLnF1ZXJ5O1xyXG4gICAgICBkZWxldGUgcGFyYW1zLmFjY2Vzc190b2tlbjtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcblxyXG4gICAgICB1c2VyU2VydmljZS52ZXJpZnlDaGFuZ2VkRW1haWxJZCh1c2VyLCAoZXJyb3IsIHJlc3VsdCk9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXMuc2VuZChyZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjaGFuZ2VNb2JpbGVOdW1iZXIocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHBhcmFtcyA9IHJlcS5ib2R5O1xyXG4gICAgICBsZXQgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuXHJcbiAgICAgIGxldCBxdWVyeSA9IHsnbW9iaWxlX251bWJlcic6IHBhcmFtcy5uZXdfbW9iaWxlX251bWJlciwgJ2lzQWN0aXZhdGVkJzogdHJ1ZX07XHJcblxyXG4gICAgICB1c2VyU2VydmljZS5yZXRyaWV2ZShxdWVyeSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRVhJU1RJTkdfVVNFUixcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTl9NT0JJTEVfTlVNQkVSLFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IERhdGEgPSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRfbW9iaWxlX251bWJlcjogdXNlci5tb2JpbGVfbnVtYmVyLFxyXG4gICAgICAgICAgICBfaWQ6IHVzZXIuX2lkLFxyXG4gICAgICAgICAgICBuZXdfbW9iaWxlX251bWJlcjogcGFyYW1zLm5ld19tb2JpbGVfbnVtYmVyXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgdXNlclNlcnZpY2UuY2hhbmdlTW9iaWxlTnVtYmVyKERhdGEsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX1dISUxFX0NPTlRBQ1RJTkcsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV0hJTEVfQ09OVEFDVElORyxcclxuICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgICAgICAgJ3N0YXR1cyc6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgICAgICAgJ2RhdGEnOiB7XHJcbiAgICAgICAgICAgICAgICAgICdtZXNzYWdlJzogTWVzc2FnZXMuTVNHX1NVQ0NFU1NfT1RQX0NIQU5HRV9NT0JJTEVfTlVNQkVSXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2ZXJpZnlNb2JpbGVOdW1iZXIocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgICB0cnkge1xyXG5cclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHBhcmFtcyA9IHJlcS5ib2R5O1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgdXNlclNlcnZpY2UudmVyaWZ5TW9iaWxlTnVtYmVyKHBhcmFtcywgdXNlciwgKGVycm9yLCByZXN1bHQpPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnNlbmQocmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAzXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY2hhbmdlUGFzc3dvcmQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcGFyYW1zID0gcmVxLnF1ZXJ5O1xyXG4gICAgICBkZWxldGUgcGFyYW1zLmFjY2Vzc190b2tlbjtcclxuICAgICAgbGV0IGF1dGg6IEF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGJjcnlwdC5jb21wYXJlKHJlcS5ib2R5LmN1cnJlbnRfcGFzc3dvcmQsIHVzZXIucGFzc3dvcmQsIChlcnI6IGFueSwgaXNTYW1lOiBhbnkpID0+IHtcclxuICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfUkVHSVNUUkFUSU9OX1NUQVRVUyxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1ZFUklGWV9DQU5ESURBVEVfQUNDT1VOVCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmIChpc1NhbWUpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXEuYm9keS5jdXJyZW50X3Bhc3N3b3JkID09PSByZXEuYm9keS5uZXdfcGFzc3dvcmQpIHtcclxuICAgICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1NBTUVfTkVXX1BBU1NXT1JELFxyXG4gICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgbGV0IG5ld19wYXNzd29yZDogYW55O1xyXG4gICAgICAgICAgICAgIGNvbnN0IHNhbHRSb3VuZHMgPSAxMDtcclxuICAgICAgICAgICAgICBiY3J5cHQuaGFzaChyZXEuYm9keS5uZXdfcGFzc3dvcmQsIHNhbHRSb3VuZHMsIChlcnI6IGFueSwgaGFzaDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBTdG9yZSBoYXNoIGluIHlvdXIgcGFzc3dvcmQgREIuXHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX1JFR0lTVFJBVElPTl9TVEFUVVMsXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0JDUllQVF9DUkVBVElPTixcclxuICAgICAgICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBuZXdfcGFzc3dvcmQgPSBoYXNoO1xyXG4gICAgICAgICAgICAgICAgICBsZXQgcXVlcnkgPSB7J19pZCc6IHJlcS51c2VyLl9pZH07XHJcbiAgICAgICAgICAgICAgICAgIGxldCB1cGRhdGVEYXRhID0geydwYXNzd29yZCc6IG5ld19wYXNzd29yZH07XHJcbiAgICAgICAgICAgICAgICAgIHVzZXJTZXJ2aWNlLmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZURhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGxldCB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQodXNlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdGF0dXMnOiAnU3VjY2VzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhJzogeydtZXNzYWdlJzogTWVzc2FnZXMuTVNHX1NVQ0NFU1NfUEFTU1dPUkRfQ0hBTkdFfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblxyXG4gICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dST05HX0NVUlJFTlRfUEFTU1dPUkQsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZW5kTWFpbChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICBsZXQgcGFyYW1zID0gcmVxLmJvZHk7XHJcbiAgICAgIHVzZXJTZXJ2aWNlLnNlbmRNYWlsKHBhcmFtcywgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fV0hJTEVfQ09OVEFDVElORyxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dISUxFX0NPTlRBQ1RJTkcsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XHJcbiAgICAgICAgICAgICdzdGF0dXMnOiBNZXNzYWdlcy5TVEFUVVNfU1VDQ0VTUyxcclxuICAgICAgICAgICAgJ2RhdGEnOiB7J21lc3NhZ2UnOiBNZXNzYWdlcy5NU0dfU1VDQ0VTU19TVUJNSVRURUR9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAzXHJcbiAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qbm90aWZpY2F0aW9ucyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICAgIGxldCB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQodXNlcik7XHJcblxyXG4gICAgICAvL3JldHJpZXZlIG5vdGlmaWNhdGlvbiBmb3IgYSBwYXJ0aWN1bGFyIHVzZXJcclxuICAgICAgbGV0IHBhcmFtcyA9IHtfaWQ6IHVzZXIuX2lkfTtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcblxyXG4gICAgICB1c2VyU2VydmljZS5yZXRyaWV2ZShwYXJhbXMsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBsZXQgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpO1xyXG4gICAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgICAnc3RhdHVzJzogJ3N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAnZGF0YSc6IHJlc3VsdFswXS5ub3RpZmljYXRpb25zLFxyXG4gICAgICAgICAgICAnY29kZScgOiAyMDAsXHJcbiAgICAgICAgICAgIGFjY2Vzc190b2tlbjogdG9rZW5cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdXNoTm90aWZpY2F0aW9ucyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBib2R5X2RhdGEgPSByZXEuYm9keTtcclxuICAgICAgbGV0IGF1dGg6IEF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgICAgbGV0IHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKTtcclxuXHJcbiAgICAgIC8vcmV0cmlldmUgbm90aWZpY2F0aW9uIGZvciBhIHBhcnRpY3VsYXIgdXNlclxyXG4gICAgICBsZXQgcGFyYW1zID0ge19pZDogdXNlci5faWR9O1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgbGV0IGRhdGEgPSB7JHB1c2g6IHtub3RpZmljYXRpb25zOiBib2R5X2RhdGF9fTtcclxuXHJcbiAgICAgIHVzZXJTZXJ2aWNlLmZpbmRPbmVBbmRVcGRhdGUocGFyYW1zLCBkYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsZXQgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpO1xyXG4gICAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgICAnc3RhdHVzJzogJ1N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAnZGF0YSc6IHJlc3VsdC5ub3RpZmljYXRpb25zLFxyXG4gICAgICAgICAgICAnY29kZSc6IDIwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9Ki9cclxuICB1cGRhdGVQaWN0dXJlKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgX19kaXJuYW1lID0gcGF0aC5yZXNvbHZlKCkgKyBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5wcm9maWxlUGF0aCcpO1xyXG4gICAgbGV0IGZvcm0gPSBuZXcgbXVsdGlwYXJ0eS5Gb3JtKHt1cGxvYWREaXI6IF9fZGlybmFtZX0pO1xyXG4gICAgZm9ybS5wYXJzZShyZXEsIChlcnI6IEVycm9yLCBmaWVsZHM6IGFueSwgZmlsZXM6IGFueSkgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRElSRUNUT1JZX05PVF9GT1VORCxcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9ESVJFQ1RPUllfTk9UX0ZPVU5ELFxyXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICBhY3R1YWxFcnJvcjogZXJyLFxyXG4gICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IHBhdGggPSBKU09OLnN0cmluZ2lmeShmaWxlcy5maWxlWzBdLnBhdGgpO1xyXG4gICAgICAgIGxldCBpbWFnZV9wYXRoID0gZmlsZXMuZmlsZVswXS5wYXRoO1xyXG4gICAgICAgIGxldCBvcmlnaW5hbEZpbGVuYW1lID0gSlNPTi5zdHJpbmdpZnkoaW1hZ2VfcGF0aC5zdWJzdHIoZmlsZXMuZmlsZVswXS5wYXRoLmxhc3RJbmRleE9mKCcvJykgKyAxKSk7XHJcbiAgICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgICAgcGF0aCA9IGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLnByb2ZpbGVQYXRoRm9yQ2xpZW50JykgKyBvcmlnaW5hbEZpbGVuYW1lLnJlcGxhY2UoL1wiL2csICcnKTtcclxuXHJcbiAgICAgICAgdXNlclNlcnZpY2UuVXBsb2FkSW1hZ2UocGF0aCwgb3JpZ2luYWxGaWxlbmFtZSwgZnVuY3Rpb24gKGVycjogYW55LCB0ZW1wYXRoOiBhbnkpIHtcclxuICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgbmV4dChlcnIpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IG15cGF0aCA9IHRlbXBhdGg7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgICAgICAgICBsZXQgcXVlcnkgPSB7J19pZCc6IHVzZXIuX2lkfTtcclxuXHJcbiAgICAgICAgICAgICAgdXNlclNlcnZpY2UuZmluZEJ5SWQodXNlci5faWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICB1c2VyU2VydmljZS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB7cGljdHVyZTogbXlwYXRofSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBsZXQgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgbGV0IHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZChyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe2FjY2Vzc190b2tlbjogdG9rZW4sIGRhdGE6IHJlc3BvbnNlfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldFByb2plY3RzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWR7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgIHVzZXJTZXJ2aWNlLmdldFByb2plY3RzKHVzZXIsIChlcnJvciwgcmVzdWx0KT0+e1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnNlbmQocmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbmV4cG9ydCAgPSBVc2VyQ29udHJvbGxlcjtcclxuIl19
