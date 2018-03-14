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
                    res.send({ 'error': error.message });
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
                    if (error === Messages.MSG_ERROR_CHECK_INACTIVE_ACCOUNT) {
                        next({
                            reason: Messages.MSG_ERROR_USER_NOT_ACTIVATED,
                            message: Messages.MSG_ERROR_ACCOUNT_STATUS,
                            stackTrace: new Error(),
                            code: 400
                        });
                    }
                    else if (error === Messages.MSG_ERROR_USER_NOT_FOUND) {
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
            var userServices = new UserService();
            userServices.getUserById(user, function (err, result) {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvVXNlckNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLHVDQUF5QztBQUV6QyxpRUFBb0U7QUFDcEUsNERBQStEO0FBRS9ELHFEQUF3RDtBQUN4RCw2Q0FBZ0Q7QUFDaEQsNERBQStEO0FBRy9ELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRS9CO0lBTUU7UUFDRSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztRQUM5QyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztRQUM5QyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksZUFBZSxFQUFFLENBQUM7SUFDaEQsQ0FBQztJQUVELCtCQUFNLEdBQU4sVUFBTyxHQUFvQixFQUFFLEdBQXFCLEVBQUUsSUFBUztRQUMzRCxJQUFJLENBQUM7WUFFSCxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ3BCLElBQUksV0FBVyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7WUFDcEMsSUFBSSxNQUFJLEdBQW9CLElBQUksZUFBZSxFQUFFLENBQUM7WUFDbEQsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsVUFBQyxLQUFLLEVBQUUsTUFBTTtnQkFDekMsRUFBRSxDQUFBLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDVCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFDO2dCQUNyQyxDQUFDO2dCQUFDLElBQUks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Q0FDdkIsSUFBSSxFQUFFLEdBQUc7NkJBQ1YsQ0FBQyxDQUFDO3dCQUNMLENBQUM7b0JBQ0gsQ0FBQztnQkFDSCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUM7UUFFSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxvQ0FBVyxHQUFYLFVBQVksR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQVM7UUFDaEUsSUFBSSxDQUFDO1lBQ0gsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztZQUNwQixJQUFJLFdBQVcsR0FBSSxJQUFJLFdBQVcsRUFBRSxDQUFDO1lBQ3JDLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07Z0JBQzFDLEVBQUUsQ0FBQSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1QsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNkLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbkIsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUFDLEtBQUssQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDVixJQUFJLENBQUM7Z0JBQ0gsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPO2dCQUNqQixPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU87Z0JBQ2xCLFVBQVUsRUFBRSxJQUFJLEtBQUssRUFBRTtnQkFDdkIsSUFBSSxFQUFFLEdBQUc7YUFDVixDQUFDLENBQUM7UUFDTCxDQUFDO0lBQ0gsQ0FBQztJQUNILHFCQUFDO0FBQUQsQ0FqekJBLEFBaXpCQyxJQUFBO0FBQ0QsaUJBQVUsY0FBYyxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvVXNlckNvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQgKiBhcyBtdWx0aXBhcnR5IGZyb20gJ211bHRpcGFydHknO1xyXG5pbXBvcnQgeyBNYWlsQ2hpbXBNYWlsZXJTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvbWFpbGNoaW1wLW1haWxlci5zZXJ2aWNlJztcclxuaW1wb3J0IEF1dGhJbnRlcmNlcHRvciA9IHJlcXVpcmUoJy4uL2ludGVyY2VwdG9yL2F1dGguaW50ZXJjZXB0b3InKTtcclxuaW1wb3J0IFNlbmRNYWlsU2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL21haWxlci5zZXJ2aWNlJyk7XHJcbmltcG9ydCBVc2VyTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL1VzZXJNb2RlbCcpO1xyXG5pbXBvcnQgVXNlclNlcnZpY2UgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9Vc2VyU2VydmljZScpO1xyXG5pbXBvcnQgTWVzc2FnZXMgPSByZXF1aXJlKCcuLi9zaGFyZWQvbWVzc2FnZXMnKTtcclxuaW1wb3J0IFJlc3BvbnNlU2VydmljZSA9IHJlcXVpcmUoJy4uL3NoYXJlZC9yZXNwb25zZS5zZXJ2aWNlJyk7XHJcblxyXG5cclxubGV0IGNvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xyXG5sZXQgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcclxubGV0IGJjcnlwdCA9IHJlcXVpcmUoJ2JjcnlwdCcpO1xyXG5cclxuY2xhc3MgVXNlckNvbnRyb2xsZXIge1xyXG4gIHByaXZhdGUgX2F1dGhJbnRlcmNlcHRvciA6IEF1dGhJbnRlcmNlcHRvcjtcclxuICBwcml2YXRlIF9zZW5kTWFpbFNlcnZpY2UgOiBTZW5kTWFpbFNlcnZpY2U7XHJcbiAgcHJpdmF0ZSBfdXNlclNlcnZpY2UgOiBVc2VyU2VydmljZTtcclxuICBwcml2YXRlIF9yZXNwb25zZVNlcnZpY2UgOiBSZXNwb25zZVNlcnZpY2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5fYXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgdGhpcy5fc2VuZE1haWxTZXJ2aWNlID0gbmV3IFNlbmRNYWlsU2VydmljZSgpO1xyXG4gICAgdGhpcy5fdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIHRoaXMuX3Jlc3BvbnNlU2VydmljZSA9IG5ldyBSZXNwb25zZVNlcnZpY2UoKTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcblxyXG4gICAgICBsZXQgZGF0YSA9IHJlcS5ib2R5O1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgbGV0IGF1dGg6IEF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgICAgdXNlclNlcnZpY2UuY3JlYXRlVXNlcihkYXRhLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICByZXMuc2VuZCh7J2Vycm9yJzogZXJyb3IubWVzc2FnZX0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsZXQgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc3VsdCk7XHJcbiAgICAgICAgICByZXMuc2VuZCh7XHJcbiAgICAgICAgICAgICdkYXRhJzogcmVzdWx0LFxyXG4gICAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRva2VuXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkgIHtcclxuICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgIHJlcy5zZW5kKHsnZXJyb3InOiAnZXJyb3IgaW4geW91ciByZXF1ZXN0J30pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbG9naW4ocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgbGV0IHBhcmFtcyA9IHJlcS5ib2R5O1xyXG4gICAgICBkZWxldGUgcGFyYW1zLmFjY2Vzc190b2tlbjtcclxuICAgICAgdXNlclNlcnZpY2UubG9naW4ocGFyYW1zLCAoZXJyb3IsIHJlc3VsdCk9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChyZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIC8qdXNlclNlcnZpY2UucmV0cmlldmUoe1wiZW1haWxcIjogcGFyYW1zLmVtYWlsfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDAgJiYgcmVzdWx0WzBdLmlzQWN0aXZhdGVkID09PSB0cnVlKSB7XHJcbiAgICAgICAgICBiY3J5cHQuY29tcGFyZShwYXJhbXMucGFzc3dvcmQsIHJlc3VsdFswXS5wYXNzd29yZCwgKGVycjogYW55LCBpc1NhbWU6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9SRUdJU1RSQVRJT05fU1RBVFVTLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1ZFUklGWV9DQU5ESURBVEVfQUNDT1VOVCxcclxuICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgICAgYWN0dWFsRXJyb3I6IGVycixcclxuICAgICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICBpZiAoaXNTYW1lKXtcclxuICAgICAgICAgICAgICAgIGxldCBhdXRoID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZChyZXN1bHRbMF0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGE6IGFueSA9IHtcclxuICAgICAgICAgICAgICAgICAgXCJzdGF0dXNcIjogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgICAgICAgICAgIFwiZGF0YVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJmaXJzdF9uYW1lXCI6IHJlc3VsdFswXS5maXJzdF9uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibGFzdF9uYW1lXCI6IHJlc3VsdFswXS5sYXN0X25hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJlbWFpbFwiOiByZXN1bHRbMF0uZW1haWwsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJfaWRcIjogcmVzdWx0WzBdLl9pZCxcclxuICAgICAgICAgICAgICAgICAgICBcImN1cnJlbnRfdGhlbWVcIjogcmVzdWx0WzBdLmN1cnJlbnRfdGhlbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJwaWN0dXJlXCI6IHJlc3VsdFswXS5waWN0dXJlLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibW9iaWxlX251bWJlclwiOiByZXN1bHRbMF0ubW9iaWxlX251bWJlcixcclxuICAgICAgICAgICAgICAgICAgICBcImlzQ2FuZGlkYXRlXCI6IHJlc3VsdFswXS5pc0NhbmRpZGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICBcImlzQWRtaW5cIjogcmVzdWx0WzBdLmlzQWRtaW4sXHJcbiAgICAgICAgICAgICAgICAgICAgXCJndWlkZV90b3VyXCI6IHJlc3VsdFswXS5ndWlkZV90b3VyXHJcbiAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgIGFjY2Vzc190b2tlbjogdG9rZW5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKGRhdGEpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XUk9OR19QQVNTV09SRCxcclxuICAgICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDAgJiYgcmVzdWx0WzBdLmlzQWN0aXZhdGVkID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgYmNyeXB0LmNvbXBhcmUocGFyYW1zLnBhc3N3b3JkLCByZXN1bHRbMF0ucGFzc3dvcmQsIChlcnI6IGFueSwgaXNQYXNzU2FtZTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX1JFR0lTVFJBVElPTl9TVEFUVVMsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0NBTkRJREFURV9BQ0NPVU5ULFxyXG4gICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBpZiAoaXNQYXNzU2FtZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdFswXS5pc0NhbmRpZGF0ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9SRUdJU1RSQVRJT05fU1RBVFVTLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQ0FORElEQVRFX0FDQ09VTlQsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfUkVHSVNUUkFUSU9OX1NUQVRVUyxcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0FDQ09VTlQsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XUk9OR19QQVNTV09SRCxcclxuICAgICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX1VTRVJfTk9UX0ZPVU5ELFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVVNFUl9OT1RfUFJFU0VOVCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTsqL1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICByZXMuc2VuZChlKTtcclxuICAgICAgLypuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNTAwXHJcbiAgICAgIH0pOyovXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZW5kT3RwKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwYXJhbXMgPSByZXEuYm9keTsgIC8vbW9iaWxlX251bWJlcihuZXcpXHJcbiAgICAgIHVzZXJTZXJ2aWNlLnNlbmRPdHAocGFyYW1zLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCk9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIHJlcy5zZW5kKGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQocmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAzXHJcbiAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZlcmlmeU90cChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICAgIHRyeSB7XHJcblxyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcGFyYW1zID0gcmVxLmJvZHk7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICB1c2VyU2VydmljZS52ZXJpZnlPdHAocGFyYW1zLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCk9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXMuc2VuZChyZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmb3Jnb3RQYXNzd29yZChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICBsZXQgcGFyYW1zID0gcmVxLmJvZHk7ICAgLy9lbWFpbFxyXG5cclxuICAgICAgdXNlclNlcnZpY2UuZm9yZ290UGFzc3dvcmQocGFyYW1zLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG5cclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIGlmIChlcnJvciA9PT0gTWVzc2FnZXMuTVNHX0VSUk9SX0NIRUNLX0lOQUNUSVZFX0FDQ09VTlQpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfVVNFUl9OT1RfQUNUSVZBVEVELFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9BQ0NPVU5UX1NUQVRVUyxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yID09PSBNZXNzYWdlcy5NU0dfRVJST1JfVVNFUl9OT1RfRk9VTkQpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX1VTRVJfTk9UX0ZPVU5ELFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9VU0VSX05PVF9GT1VORCxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgICAgJ3N0YXR1cyc6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgICAnZGF0YSc6IHsnbWVzc2FnZSc6IE1lc3NhZ2VzLk1TR19TVUNDRVNTX0VNQUlMX0ZPUkdPVF9QQVNTV09SRH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXNldFBhc3N3b3JkKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHBhcmFtcyA9IHJlcS5ib2R5OyAgIC8vbmV3X3Bhc3N3b3JkXHJcbiAgICAgIGRlbGV0ZSBwYXJhbXMuYWNjZXNzX3Rva2VuO1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgdXNlclNlcnZpY2UucmVzZXRQYXNzd29yZChwYXJhbXMsIHVzZXIsIChlcnI6IGFueSwgcmVzdWx0OiBhbnkpID0+IHtcclxuICAgICAgICBpZihlcnIpIHtcclxuICAgICAgICAgIG5leHQoZXJyLCBudWxsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnNlbmQocmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICAvKmJjcnlwdC5oYXNoKHJlcS5ib2R5Lm5ld19wYXNzd29yZCwgc2FsdFJvdW5kcywgKGVycjogYW55LCBoYXNoOiBhbnkpID0+IHtcclxuICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiAnRXJyb3IgaW4gY3JlYXRpbmcgaGFzaCB1c2luZyBiY3J5cHQnLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiAnRXJyb3IgaW4gY3JlYXRpbmcgaGFzaCB1c2luZyBiY3J5cHQnLFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IHVwZGF0ZURhdGEgPSB7J3Bhc3N3b3JkJzogaGFzaH07XHJcbiAgICAgICAgICBsZXQgcXVlcnkgPSB7XHJcbiAgICAgICAgICAgICdfaWQnOiB1c2VyLl9pZCxcclxuICAgICAgICAgICAgJ3Bhc3N3b3JkJzogcmVxLnVzZXIucGFzc3dvcmRcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICB1c2VyU2VydmljZS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB1cGRhdGVEYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgICAgICAgJ3N0YXR1cyc6ICdTdWNjZXNzJyxcclxuICAgICAgICAgICAgICAgICdkYXRhJzogeydtZXNzYWdlJzogJ1Bhc3N3b3JkIGNoYW5nZWQgc3VjY2Vzc2Z1bGx5J31cclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTsqL1xyXG5cclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVwZGF0ZURldGFpbHMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgbmV3VXNlckRhdGE6IFVzZXJNb2RlbCA9IDxVc2VyTW9kZWw+cmVxLmJvZHk7XHJcbiAgICAgIGxldCBwYXJhbXMgPSByZXEucXVlcnk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGRlbGV0ZSBwYXJhbXMuYWNjZXNzX3Rva2VuO1xyXG5cclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgIHVzZXJTZXJ2aWNlLnVwZGF0ZURldGFpbHMobmV3VXNlckRhdGEsIHVzZXIsIChlcnJvciwgcmVzdWx0KT0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zZW5kKHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbiAgLyp1cGRhdGVQcm9maWxlRmllbGQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAvL2xldCBuZXdVc2VyRGF0YTogVXNlck1vZGVsID0gPFVzZXJNb2RlbD5yZXEuYm9keTtcclxuXHJcbiAgICAgIGxldCBwYXJhbXMgPSByZXEucXVlcnk7XHJcbiAgICAgIGRlbGV0ZSBwYXJhbXMuYWNjZXNzX3Rva2VuO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgX2lkOiBzdHJpbmcgPSB1c2VyLl9pZDtcclxuICAgICAgbGV0IGZOYW1lOiBzdHJpbmcgPSByZXEucGFyYW1zLmZuYW1lO1xyXG4gICAgICBpZiAoZk5hbWUgPT0gJ2d1aWRlX3RvdXInKSB7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB7J2d1aWRlX3RvdXInOiByZXEuYm9keX07XHJcbiAgICAgIH1cclxuICAgICAgbGV0IGF1dGg6IEF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgIHVzZXJTZXJ2aWNlLnVwZGF0ZShfaWQsIGRhdGEsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICB1c2VyU2VydmljZS5yZXRyaWV2ZShfaWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfVE9LRU4sXHJcbiAgICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgIHJlcy5zZW5kKHtcclxuICAgICAgICAgICAgICAgIFwic3RhdHVzXCI6IFwic3VjY2Vzc1wiLFxyXG4gICAgICAgICAgICAgICAgXCJkYXRhXCI6IHtcclxuICAgICAgICAgICAgICAgICAgXCJmaXJzdF9uYW1lXCI6IHJlc3VsdFswXS5maXJzdF9uYW1lLFxyXG4gICAgICAgICAgICAgICAgICBcImxhc3RfbmFtZVwiOiByZXN1bHRbMF0ubGFzdF9uYW1lLFxyXG4gICAgICAgICAgICAgICAgICBcImVtYWlsXCI6IHJlc3VsdFswXS5lbWFpbCxcclxuICAgICAgICAgICAgICAgICAgXCJfaWRcIjogcmVzdWx0WzBdLnVzZXJJZCxcclxuICAgICAgICAgICAgICAgICAgXCJndWlkZV90b3VyXCI6IHJlc3VsdFswXS5ndWlkZV90b3VyXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAzXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0qL1xyXG5cclxuICByZXRyaWV2ZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICBsZXQgcGFyYW1zID0gcmVxLnBhcmFtcy5pZDtcclxuICAgICAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIHZhciB1c2VyU2VydmljZXMgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgdXNlclNlcnZpY2VzLmdldFVzZXJCeUlkKHVzZXIsIChlcnIsIHJlc3VsdCk9PiB7XHJcbiAgICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgICByZXMuc2VuZChlcnIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXMuc2VuZChyZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIHJlcy5zZW5kKGUpO1xyXG4gICAgICAvKm5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7Ki9cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qdmVyaWZpY2F0aW9uTWFpbChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcGFyYW1zID0gcmVxLmJvZHk7XHJcbiAgICAgIHVzZXJTZXJ2aWNlLnNlbmRWZXJpZmljYXRpb25NYWlsKHBhcmFtcywgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fV0hJTEVfQ09OVEFDVElORyxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dISUxFX0NPTlRBQ1RJTkcsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgICAgXCJzdGF0dXNcIjogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgICAgIFwiZGF0YVwiOiB7XCJtZXNzYWdlXCI6IE1lc3NhZ2VzLk1TR19TVUNDRVNTX0VNQUlMX1JFR0lTVFJBVElPTn1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAzXHJcbiAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuICB9Ki9cclxuICAvKnZlcmlmeUFjY291bnQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgICB0cnkge1xyXG5cclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHBhcmFtcyA9IHJlcS5xdWVyeTtcclxuICAgICAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICB1c2VyU2VydmljZS52ZXJpZnlBY2NvdW50KHVzZXIsIChlcnJvciwgcmVzdWx0KT0+IHtcclxuXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0qL1xyXG5cclxuICBjaGFuZ2VFbWFpbElkKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwYXJhbXMgPSByZXEucXVlcnk7XHJcbiAgICAgIGRlbGV0ZSBwYXJhbXMuYWNjZXNzX3Rva2VuO1xyXG4gICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICBjdXJyZW50X2VtYWlsOiByZXEuYm9keS5jdXJyZW50X2VtYWlsLFxyXG4gICAgICAgIG5ld19lbWFpbDogcmVxLmJvZHkubmV3X2VtYWlsXHJcbiAgICAgIH07XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG5cclxuICAgICAgdXNlclNlcnZpY2UuY2hhbmdlRW1haWxJZChkYXRhLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnNlbmQocmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAzXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmVyaWZ5Q2hhbmdlZEVtYWlsSWQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcGFyYW1zID0gcmVxLnF1ZXJ5O1xyXG4gICAgICBkZWxldGUgcGFyYW1zLmFjY2Vzc190b2tlbjtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcblxyXG4gICAgICB1c2VyU2VydmljZS52ZXJpZnlDaGFuZ2VkRW1haWxJZCh1c2VyLCAoZXJyb3IsIHJlc3VsdCk9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXMuc2VuZChyZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjaGFuZ2VNb2JpbGVOdW1iZXIocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHBhcmFtcyA9IHJlcS5ib2R5O1xyXG4gICAgICBsZXQgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuXHJcbiAgICAgIGxldCBxdWVyeSA9IHsnbW9iaWxlX251bWJlcic6IHBhcmFtcy5uZXdfbW9iaWxlX251bWJlciwgJ2lzQWN0aXZhdGVkJzogdHJ1ZX07XHJcblxyXG4gICAgICB1c2VyU2VydmljZS5yZXRyaWV2ZShxdWVyeSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRVhJU1RJTkdfVVNFUixcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTl9NT0JJTEVfTlVNQkVSLFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IERhdGEgPSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRfbW9iaWxlX251bWJlcjogdXNlci5tb2JpbGVfbnVtYmVyLFxyXG4gICAgICAgICAgICBfaWQ6IHVzZXIuX2lkLFxyXG4gICAgICAgICAgICBuZXdfbW9iaWxlX251bWJlcjogcGFyYW1zLm5ld19tb2JpbGVfbnVtYmVyXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgdXNlclNlcnZpY2UuY2hhbmdlTW9iaWxlTnVtYmVyKERhdGEsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX1dISUxFX0NPTlRBQ1RJTkcsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV0hJTEVfQ09OVEFDVElORyxcclxuICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgICAgICAgJ3N0YXR1cyc6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgICAgICAgJ2RhdGEnOiB7XHJcbiAgICAgICAgICAgICAgICAgICdtZXNzYWdlJzogTWVzc2FnZXMuTVNHX1NVQ0NFU1NfT1RQX0NIQU5HRV9NT0JJTEVfTlVNQkVSXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2ZXJpZnlNb2JpbGVOdW1iZXIocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgICB0cnkge1xyXG5cclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHBhcmFtcyA9IHJlcS5ib2R5O1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgdXNlclNlcnZpY2UudmVyaWZ5TW9iaWxlTnVtYmVyKHBhcmFtcywgdXNlciwgKGVycm9yLCByZXN1bHQpPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnNlbmQocmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAzXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY2hhbmdlUGFzc3dvcmQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcGFyYW1zID0gcmVxLnF1ZXJ5O1xyXG4gICAgICBkZWxldGUgcGFyYW1zLmFjY2Vzc190b2tlbjtcclxuICAgICAgbGV0IGF1dGg6IEF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGJjcnlwdC5jb21wYXJlKHJlcS5ib2R5LmN1cnJlbnRfcGFzc3dvcmQsIHVzZXIucGFzc3dvcmQsIChlcnI6IGFueSwgaXNTYW1lOiBhbnkpID0+IHtcclxuICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfUkVHSVNUUkFUSU9OX1NUQVRVUyxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1ZFUklGWV9DQU5ESURBVEVfQUNDT1VOVCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmIChpc1NhbWUpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXEuYm9keS5jdXJyZW50X3Bhc3N3b3JkID09PSByZXEuYm9keS5uZXdfcGFzc3dvcmQpIHtcclxuICAgICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1NBTUVfTkVXX1BBU1NXT1JELFxyXG4gICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgbGV0IG5ld19wYXNzd29yZDogYW55O1xyXG4gICAgICAgICAgICAgIGNvbnN0IHNhbHRSb3VuZHMgPSAxMDtcclxuICAgICAgICAgICAgICBiY3J5cHQuaGFzaChyZXEuYm9keS5uZXdfcGFzc3dvcmQsIHNhbHRSb3VuZHMsIChlcnI6IGFueSwgaGFzaDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBTdG9yZSBoYXNoIGluIHlvdXIgcGFzc3dvcmQgREIuXHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX1JFR0lTVFJBVElPTl9TVEFUVVMsXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0JDUllQVF9DUkVBVElPTixcclxuICAgICAgICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBuZXdfcGFzc3dvcmQgPSBoYXNoO1xyXG4gICAgICAgICAgICAgICAgICBsZXQgcXVlcnkgPSB7J19pZCc6IHJlcS51c2VyLl9pZH07XHJcbiAgICAgICAgICAgICAgICAgIGxldCB1cGRhdGVEYXRhID0geydwYXNzd29yZCc6IG5ld19wYXNzd29yZH07XHJcbiAgICAgICAgICAgICAgICAgIHVzZXJTZXJ2aWNlLmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZURhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGxldCB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQodXNlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXMuc2VuZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdGF0dXMnOiAnU3VjY2VzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhJzogeydtZXNzYWdlJzogTWVzc2FnZXMuTVNHX1NVQ0NFU1NfUEFTU1dPUkRfQ0hBTkdFfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblxyXG4gICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dST05HX0NVUlJFTlRfUEFTU1dPUkQsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZW5kTWFpbChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICBsZXQgcGFyYW1zID0gcmVxLmJvZHk7XHJcbiAgICAgIHVzZXJTZXJ2aWNlLnNlbmRNYWlsKHBhcmFtcywgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fV0hJTEVfQ09OVEFDVElORyxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dISUxFX0NPTlRBQ1RJTkcsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XHJcbiAgICAgICAgICAgICdzdGF0dXMnOiBNZXNzYWdlcy5TVEFUVVNfU1VDQ0VTUyxcclxuICAgICAgICAgICAgJ2RhdGEnOiB7J21lc3NhZ2UnOiBNZXNzYWdlcy5NU0dfU1VDQ0VTU19TVUJNSVRURUR9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAzXHJcbiAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qbm90aWZpY2F0aW9ucyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICAgIGxldCB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQodXNlcik7XHJcblxyXG4gICAgICAvL3JldHJpZXZlIG5vdGlmaWNhdGlvbiBmb3IgYSBwYXJ0aWN1bGFyIHVzZXJcclxuICAgICAgbGV0IHBhcmFtcyA9IHtfaWQ6IHVzZXIuX2lkfTtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcblxyXG4gICAgICB1c2VyU2VydmljZS5yZXRyaWV2ZShwYXJhbXMsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBsZXQgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpO1xyXG4gICAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgICAnc3RhdHVzJzogJ3N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAnZGF0YSc6IHJlc3VsdFswXS5ub3RpZmljYXRpb25zLFxyXG4gICAgICAgICAgICAnY29kZScgOiAyMDAsXHJcbiAgICAgICAgICAgIGFjY2Vzc190b2tlbjogdG9rZW5cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdXNoTm90aWZpY2F0aW9ucyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBib2R5X2RhdGEgPSByZXEuYm9keTtcclxuICAgICAgbGV0IGF1dGg6IEF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgICAgbGV0IHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKTtcclxuXHJcbiAgICAgIC8vcmV0cmlldmUgbm90aWZpY2F0aW9uIGZvciBhIHBhcnRpY3VsYXIgdXNlclxyXG4gICAgICBsZXQgcGFyYW1zID0ge19pZDogdXNlci5faWR9O1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgbGV0IGRhdGEgPSB7JHB1c2g6IHtub3RpZmljYXRpb25zOiBib2R5X2RhdGF9fTtcclxuXHJcbiAgICAgIHVzZXJTZXJ2aWNlLmZpbmRPbmVBbmRVcGRhdGUocGFyYW1zLCBkYXRhLCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsZXQgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpO1xyXG4gICAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgICAnc3RhdHVzJzogJ1N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAnZGF0YSc6IHJlc3VsdC5ub3RpZmljYXRpb25zLFxyXG4gICAgICAgICAgICAnY29kZSc6IDIwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9Ki9cclxuICB1cGRhdGVQaWN0dXJlKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgX19kaXJuYW1lID0gcGF0aC5yZXNvbHZlKCkgKyBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5wcm9maWxlUGF0aCcpO1xyXG4gICAgbGV0IGZvcm0gPSBuZXcgbXVsdGlwYXJ0eS5Gb3JtKHt1cGxvYWREaXI6IF9fZGlybmFtZX0pO1xyXG4gICAgZm9ybS5wYXJzZShyZXEsIChlcnI6IEVycm9yLCBmaWVsZHM6IGFueSwgZmlsZXM6IGFueSkgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRElSRUNUT1JZX05PVF9GT1VORCxcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9ESVJFQ1RPUllfTk9UX0ZPVU5ELFxyXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICBhY3R1YWxFcnJvcjogZXJyLFxyXG4gICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IHBhdGggPSBKU09OLnN0cmluZ2lmeShmaWxlcy5maWxlWzBdLnBhdGgpO1xyXG4gICAgICAgIGxldCBpbWFnZV9wYXRoID0gZmlsZXMuZmlsZVswXS5wYXRoO1xyXG4gICAgICAgIGxldCBvcmlnaW5hbEZpbGVuYW1lID0gSlNPTi5zdHJpbmdpZnkoaW1hZ2VfcGF0aC5zdWJzdHIoZmlsZXMuZmlsZVswXS5wYXRoLmxhc3RJbmRleE9mKCcvJykgKyAxKSk7XHJcbiAgICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgICAgcGF0aCA9IGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLnByb2ZpbGVQYXRoRm9yQ2xpZW50JykgKyBvcmlnaW5hbEZpbGVuYW1lLnJlcGxhY2UoL1wiL2csICcnKTtcclxuXHJcbiAgICAgICAgdXNlclNlcnZpY2UuVXBsb2FkSW1hZ2UocGF0aCwgb3JpZ2luYWxGaWxlbmFtZSwgZnVuY3Rpb24gKGVycjogYW55LCB0ZW1wYXRoOiBhbnkpIHtcclxuICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgbmV4dChlcnIpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IG15cGF0aCA9IHRlbXBhdGg7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgICAgICAgICBsZXQgcXVlcnkgPSB7J19pZCc6IHVzZXIuX2lkfTtcclxuXHJcbiAgICAgICAgICAgICAgdXNlclNlcnZpY2UuZmluZEJ5SWQodXNlci5faWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICB1c2VyU2VydmljZS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCB7cGljdHVyZTogbXlwYXRofSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBsZXQgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgbGV0IHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZChyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe2FjY2Vzc190b2tlbjogdG9rZW4sIGRhdGE6IHJlc3BvbnNlfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldFByb2plY3RzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWR7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgIHVzZXJTZXJ2aWNlLmdldFByb2plY3RzKHVzZXIsIChlcnJvciwgcmVzdWx0KT0+e1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnNlbmQocmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbmV4cG9ydCAgPSBVc2VyQ29udHJvbGxlcjtcclxuIl19
