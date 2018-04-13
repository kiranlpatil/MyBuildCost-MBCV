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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvVXNlckNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLHVDQUF5QztBQUV6QyxpRUFBb0U7QUFDcEUsNERBQStEO0FBRS9ELHFEQUF3RDtBQUN4RCw2Q0FBZ0Q7QUFDaEQsNERBQStEO0FBRy9ELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRS9CO0lBTUU7UUFDRSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztRQUM5QyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztRQUM5QyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksZUFBZSxFQUFFLENBQUM7SUFDaEQsQ0FBQztJQUVELCtCQUFNLEdBQU4sVUFBTyxHQUFvQixFQUFFLEdBQXFCLEVBQUUsSUFBUztRQUMzRCxJQUFJLENBQUM7WUFFSCxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ3BCLElBQUksV0FBVyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7WUFDcEMsSUFBSSxNQUFJLEdBQW9CLElBQUksZUFBZSxFQUFFLENBQUM7WUFDbEQsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsVUFBQyxLQUFLLEVBQUUsTUFBTTtnQkFDekMsRUFBRSxDQUFBLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDVCxJQUFJLENBQUM7d0JBQ0gsTUFBTSxFQUFFLFFBQVEsQ0FBQyxzQkFBc0I7d0JBQ3ZDLE9BQU8sRUFBRSxRQUFRLENBQUMsc0JBQXNCO3dCQUN4QyxVQUFV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QyxPQUFPO2dDQUNsQixVQUFVLEVBQUUsSUFBSSxLQUFLLEVBQUU7Z0NBQ3ZCLElBQUksRUFBRSxHQUFHOzZCQUNWLENBQUMsQ0FBQzt3QkFDTCxDQUFDO29CQUNILENBQUM7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDO1FBRUgsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsb0NBQVcsR0FBWCxVQUFZLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUFTO1FBQ2hFLElBQUksQ0FBQztZQUNILElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDcEIsSUFBSSxXQUFXLEdBQUksSUFBSSxXQUFXLEVBQUUsQ0FBQztZQUNyQyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxVQUFDLEtBQUssRUFBRSxNQUFNO2dCQUMxQyxFQUFFLENBQUEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNULElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDZCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ25CLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFBQyxLQUFLLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1YsSUFBSSxDQUFDO2dCQUNILE1BQU0sRUFBRSxDQUFDLENBQUMsT0FBTztnQkFDakIsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPO2dCQUNsQixVQUFVLEVBQUUsSUFBSSxLQUFLLEVBQUU7Z0JBQ3ZCLElBQUksRUFBRSxHQUFHO2FBQ1YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUM7SUFDSCxxQkFBQztBQUFELENBdnpCQSxBQXV6QkMsSUFBQTtBQUNELGlCQUFVLGNBQWMsQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2NvbnRyb2xsZXJzL1VzZXJDb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZXhwcmVzcyBmcm9tICdleHByZXNzJztcclxuaW1wb3J0ICogYXMgbXVsdGlwYXJ0eSBmcm9tICdtdWx0aXBhcnR5JztcclxuaW1wb3J0IHsgTWFpbENoaW1wTWFpbGVyU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL21haWxjaGltcC1tYWlsZXIuc2VydmljZSc7XHJcbmltcG9ydCBBdXRoSW50ZXJjZXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcmNlcHRvci9hdXRoLmludGVyY2VwdG9yJyk7XHJcbmltcG9ydCBTZW5kTWFpbFNlcnZpY2UgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9tYWlsZXIuc2VydmljZScpO1xyXG5pbXBvcnQgVXNlck1vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9Vc2VyTW9kZWwnKTtcclxuaW1wb3J0IFVzZXJTZXJ2aWNlID0gcmVxdWlyZSgnLi4vc2VydmljZXMvVXNlclNlcnZpY2UnKTtcclxuaW1wb3J0IE1lc3NhZ2VzID0gcmVxdWlyZSgnLi4vc2hhcmVkL21lc3NhZ2VzJyk7XHJcbmltcG9ydCBSZXNwb25zZVNlcnZpY2UgPSByZXF1aXJlKCcuLi9zaGFyZWQvcmVzcG9uc2Uuc2VydmljZScpO1xyXG5cclxuXHJcbmxldCBjb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcclxubGV0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XHJcbmxldCBiY3J5cHQgPSByZXF1aXJlKCdiY3J5cHQnKTtcclxuXHJcbmNsYXNzIFVzZXJDb250cm9sbGVyIHtcclxuICBwcml2YXRlIF9hdXRoSW50ZXJjZXB0b3IgOiBBdXRoSW50ZXJjZXB0b3I7XHJcbiAgcHJpdmF0ZSBfc2VuZE1haWxTZXJ2aWNlIDogU2VuZE1haWxTZXJ2aWNlO1xyXG4gIHByaXZhdGUgX3VzZXJTZXJ2aWNlIDogVXNlclNlcnZpY2U7XHJcbiAgcHJpdmF0ZSBfcmVzcG9uc2VTZXJ2aWNlIDogUmVzcG9uc2VTZXJ2aWNlO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuX2F1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgIHRoaXMuX3NlbmRNYWlsU2VydmljZSA9IG5ldyBTZW5kTWFpbFNlcnZpY2UoKTtcclxuICAgIHRoaXMuX3VzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICB0aGlzLl9yZXNwb25zZVNlcnZpY2UgPSBuZXcgUmVzcG9uc2VTZXJ2aWNlKCk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG5cclxuICAgICAgbGV0IGRhdGEgPSByZXEuYm9keTtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICAgIHVzZXJTZXJ2aWNlLmNyZWF0ZVVzZXIoZGF0YSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTixcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTixcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICAvKnJlcy5zdGF0dXMoNDAwKS5zZW5kKHsnZXJyb3InOmVycm9yLm1lc3NhZ2UsJ21lc3NhZ2UnOmVycm9yLm1lc3NhZ2UgfSk7Ki9cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZChyZXN1bHQpO1xyXG4gICAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgICAnZGF0YSc6IHJlc3VsdCxcclxuICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpICB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICByZXMuc2VuZCh7J2Vycm9yJzogJ2Vycm9yIGluIHlvdXIgcmVxdWVzdCd9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxvZ2luKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCBwYXJhbXMgPSByZXEuYm9keTtcclxuICAgICAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XHJcbiAgICAgIHVzZXJTZXJ2aWNlLmxvZ2luKHBhcmFtcywgKGVycm9yLCByZXN1bHQpPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQocmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICAvKnVzZXJTZXJ2aWNlLnJldHJpZXZlKHtcImVtYWlsXCI6IHBhcmFtcy5lbWFpbH0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdC5sZW5ndGggPiAwICYmIHJlc3VsdFswXS5pc0FjdGl2YXRlZCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgYmNyeXB0LmNvbXBhcmUocGFyYW1zLnBhc3N3b3JkLCByZXN1bHRbMF0ucGFzc3dvcmQsIChlcnI6IGFueSwgaXNTYW1lOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfUkVHSVNUUkFUSU9OX1NUQVRVUyxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQ0FORElEQVRFX0FDQ09VTlQsXHJcbiAgICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICAgIGFjdHVhbEVycm9yOiBlcnIsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKGlzU2FtZSl7XHJcbiAgICAgICAgICAgICAgICBsZXQgYXV0aCA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgICAgICAgICAgICAgIGxldCB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQocmVzdWx0WzBdKTtcclxuICAgICAgICAgICAgICAgIHZhciBkYXRhOiBhbnkgPSB7XHJcbiAgICAgICAgICAgICAgICAgIFwic3RhdHVzXCI6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgICAgICAgICBcImRhdGFcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiZmlyc3RfbmFtZVwiOiByZXN1bHRbMF0uZmlyc3RfbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBcImxhc3RfbmFtZVwiOiByZXN1bHRbMF0ubGFzdF9uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZW1haWxcIjogcmVzdWx0WzBdLmVtYWlsLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiX2lkXCI6IHJlc3VsdFswXS5faWQsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJjdXJyZW50X3RoZW1lXCI6IHJlc3VsdFswXS5jdXJyZW50X3RoZW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicGljdHVyZVwiOiByZXN1bHRbMF0ucGljdHVyZSxcclxuICAgICAgICAgICAgICAgICAgICBcIm1vYmlsZV9udW1iZXJcIjogcmVzdWx0WzBdLm1vYmlsZV9udW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpc0NhbmRpZGF0ZVwiOiByZXN1bHRbMF0uaXNDYW5kaWRhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpc0FkbWluXCI6IHJlc3VsdFswXS5pc0FkbWluLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZ3VpZGVfdG91clwiOiByZXN1bHRbMF0uZ3VpZGVfdG91clxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRva2VuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChkYXRhKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfUEFTU1dPUkQsXHJcbiAgICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHJlc3VsdC5sZW5ndGggPiAwICYmIHJlc3VsdFswXS5pc0FjdGl2YXRlZCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIGJjcnlwdC5jb21wYXJlKHBhcmFtcy5wYXNzd29yZCwgcmVzdWx0WzBdLnBhc3N3b3JkLCAoZXJyOiBhbnksIGlzUGFzc1NhbWU6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9SRUdJU1RSQVRJT05fU1RBVFVTLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1ZFUklGWV9DQU5ESURBVEVfQUNDT1VOVCxcclxuICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgaWYgKGlzUGFzc1NhbWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHRbMF0uaXNDYW5kaWRhdGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfUkVHSVNUUkFUSU9OX1NUQVRVUyxcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0NBTkRJREFURV9BQ0NPVU5ULFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX1JFR0lTVFJBVElPTl9TVEFUVVMsXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1ZFUklGWV9BQ0NPVU5ULFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfUEFTU1dPUkQsXHJcbiAgICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9VU0VSX05PVF9GT1VORCxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1VTRVJfTk9UX1BSRVNFTlQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7Ki9cclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgcmVzLnNlbmQoZSk7XHJcbiAgICAgIC8qbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDUwMFxyXG4gICAgICB9KTsqL1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2VuZE90cChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcGFyYW1zID0gcmVxLmJvZHk7ICAvL21vYmlsZV9udW1iZXIobmV3KVxyXG4gICAgICB1c2VyU2VydmljZS5zZW5kT3RwKHBhcmFtcywgdXNlciwgKGVycm9yLCByZXN1bHQpPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICByZXMuc2VuZChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICB9KTtcclxuXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2ZXJpZnlPdHAocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgICB0cnkge1xyXG5cclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHBhcmFtcyA9IHJlcS5ib2R5O1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgdXNlclNlcnZpY2UudmVyaWZ5T3RwKHBhcmFtcywgdXNlciwgKGVycm9yLCByZXN1bHQpPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnNlbmQocmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAzXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZm9yZ290UGFzc3dvcmQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgbGV0IHBhcmFtcyA9IHJlcS5ib2R5OyAgIC8vZW1haWxcclxuXHJcbiAgICAgIHVzZXJTZXJ2aWNlLmZvcmdvdFBhc3N3b3JkKHBhcmFtcywgKGVycm9yLCByZXN1bHQpID0+IHtcclxuXHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IgPT09IE1lc3NhZ2VzLk1TR19FUlJPUl9DSEVDS19JTkFDVElWRV9BQ0NPVU5UKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1VTRVJfTk9UX0FDVElWQVRFRCxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfQUNDT1VOVF9TVEFUVVMsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChlcnJvciA9PT0gTWVzc2FnZXMuTVNHX0VSUk9SX1VTRVJfTk9UX0ZPVU5EKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9VU0VSX05PVF9GT1VORCxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVVNFUl9OT1RfRk9VTkQsXHJcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XHJcbiAgICAgICAgICAgICdzdGF0dXMnOiBNZXNzYWdlcy5TVEFUVVNfU1VDQ0VTUyxcclxuICAgICAgICAgICAgJ2RhdGEnOiB7J21lc3NhZ2UnOiBNZXNzYWdlcy5NU0dfU1VDQ0VTU19FTUFJTF9GT1JHT1RfUEFTU1dPUkR9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAzXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVzZXRQYXNzd29yZChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwYXJhbXMgPSByZXEuYm9keTsgICAvL25ld19wYXNzd29yZFxyXG4gICAgICBkZWxldGUgcGFyYW1zLmFjY2Vzc190b2tlbjtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgIHVzZXJTZXJ2aWNlLnJlc2V0UGFzc3dvcmQocGFyYW1zLCB1c2VyLCAoZXJyOiBhbnksIHJlc3VsdDogYW55KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgICBuZXh0KGVyciwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zZW5kKHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgLypiY3J5cHQuaGFzaChyZXEuYm9keS5uZXdfcGFzc3dvcmQsIHNhbHRSb3VuZHMsIChlcnI6IGFueSwgaGFzaDogYW55KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogJ0Vycm9yIGluIGNyZWF0aW5nIGhhc2ggdXNpbmcgYmNyeXB0JyxcclxuICAgICAgICAgICAgbWVzc2FnZTogJ0Vycm9yIGluIGNyZWF0aW5nIGhhc2ggdXNpbmcgYmNyeXB0JyxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxldCB1cGRhdGVEYXRhID0geydwYXNzd29yZCc6IGhhc2h9O1xyXG4gICAgICAgICAgbGV0IHF1ZXJ5ID0ge1xyXG4gICAgICAgICAgICAnX2lkJzogdXNlci5faWQsXHJcbiAgICAgICAgICAgICdwYXNzd29yZCc6IHJlcS51c2VyLnBhc3N3b3JkXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgdXNlclNlcnZpY2UuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHJlcy5zZW5kKHtcclxuICAgICAgICAgICAgICAgICdzdGF0dXMnOiAnU3VjY2VzcycsXHJcbiAgICAgICAgICAgICAgICAnZGF0YSc6IHsnbWVzc2FnZSc6ICdQYXNzd29yZCBjaGFuZ2VkIHN1Y2Nlc3NmdWxseSd9XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7Ki9cclxuXHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGVEZXRhaWxzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IG5ld1VzZXJEYXRhOiBVc2VyTW9kZWwgPSA8VXNlck1vZGVsPnJlcS5ib2R5O1xyXG4gICAgICBsZXQgcGFyYW1zID0gcmVxLnF1ZXJ5O1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBkZWxldGUgcGFyYW1zLmFjY2Vzc190b2tlbjtcclxuXHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICB1c2VyU2VydmljZS51cGRhdGVEZXRhaWxzKG5ld1VzZXJEYXRhLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCk9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXMuc2VuZChyZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8qdXBkYXRlUHJvZmlsZUZpZWxkKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgLy9sZXQgbmV3VXNlckRhdGE6IFVzZXJNb2RlbCA9IDxVc2VyTW9kZWw+cmVxLmJvZHk7XHJcblxyXG4gICAgICBsZXQgcGFyYW1zID0gcmVxLnF1ZXJ5O1xyXG4gICAgICBkZWxldGUgcGFyYW1zLmFjY2Vzc190b2tlbjtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IF9pZDogc3RyaW5nID0gdXNlci5faWQ7XHJcbiAgICAgIGxldCBmTmFtZTogc3RyaW5nID0gcmVxLnBhcmFtcy5mbmFtZTtcclxuICAgICAgaWYgKGZOYW1lID09ICdndWlkZV90b3VyJykge1xyXG4gICAgICAgIHZhciBkYXRhID0geydndWlkZV90b3VyJzogcmVxLmJvZHl9O1xyXG4gICAgICB9XHJcbiAgICAgIGxldCBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICB1c2VyU2VydmljZS51cGRhdGUoX2lkLCBkYXRhLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgdXNlclNlcnZpY2UucmV0cmlldmUoX2lkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dST05HX1RPS0VOLFxyXG4gICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICByZXMuc2VuZCh7XHJcbiAgICAgICAgICAgICAgICBcInN0YXR1c1wiOiBcInN1Y2Nlc3NcIixcclxuICAgICAgICAgICAgICAgIFwiZGF0YVwiOiB7XHJcbiAgICAgICAgICAgICAgICAgIFwiZmlyc3RfbmFtZVwiOiByZXN1bHRbMF0uZmlyc3RfbmFtZSxcclxuICAgICAgICAgICAgICAgICAgXCJsYXN0X25hbWVcIjogcmVzdWx0WzBdLmxhc3RfbmFtZSxcclxuICAgICAgICAgICAgICAgICAgXCJlbWFpbFwiOiByZXN1bHRbMF0uZW1haWwsXHJcbiAgICAgICAgICAgICAgICAgIFwiX2lkXCI6IHJlc3VsdFswXS51c2VySWQsXHJcbiAgICAgICAgICAgICAgICAgIFwiZ3VpZGVfdG91clwiOiByZXN1bHRbMF0uZ3VpZGVfdG91clxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9Ki9cclxuXHJcbiAgcmV0cmlldmUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgbGV0IHBhcmFtcyA9IHJlcS5wYXJhbXMuaWQ7XHJcbiAgICAgIGRlbGV0ZSBwYXJhbXMuYWNjZXNzX3Rva2VuO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICAvL3ZhciB1c2VyU2VydmljZXMgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgdXNlclNlcnZpY2UuZ2V0VXNlckJ5SWQodXNlciwgKGVyciwgcmVzdWx0KT0+IHtcclxuICAgICAgICBpZihlcnIpIHtcclxuICAgICAgICAgIHJlcy5zZW5kKGVycik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zZW5kKHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgcmVzLnNlbmQoZSk7XHJcbiAgICAgIC8qbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICB9KTsqL1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyp2ZXJpZmljYXRpb25NYWlsKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwYXJhbXMgPSByZXEuYm9keTtcclxuICAgICAgdXNlclNlcnZpY2Uuc2VuZFZlcmlmaWNhdGlvbk1haWwocGFyYW1zLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9XSElMRV9DT05UQUNUSU5HLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV0hJTEVfQ09OVEFDVElORyxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgICBcInN0YXR1c1wiOiBNZXNzYWdlcy5TVEFUVVNfU1VDQ0VTUyxcclxuICAgICAgICAgICAgXCJkYXRhXCI6IHtcIm1lc3NhZ2VcIjogTWVzc2FnZXMuTVNHX1NVQ0NFU1NfRU1BSUxfUkVHSVNUUkFUSU9OfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG4gIH0qL1xyXG4gIC8qdmVyaWZ5QWNjb3VudChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICAgIHRyeSB7XHJcblxyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcGFyYW1zID0gcmVxLnF1ZXJ5O1xyXG4gICAgICBkZWxldGUgcGFyYW1zLmFjY2Vzc190b2tlbjtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgIHVzZXJTZXJ2aWNlLnZlcmlmeUFjY291bnQodXNlciwgKGVycm9yLCByZXN1bHQpPT4ge1xyXG5cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSovXHJcblxyXG4gIGNoYW5nZUVtYWlsSWQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHBhcmFtcyA9IHJlcS5xdWVyeTtcclxuICAgICAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XHJcbiAgICAgIHZhciBkYXRhID0ge1xyXG4gICAgICAgIGN1cnJlbnRfZW1haWw6IHJlcS5ib2R5LmN1cnJlbnRfZW1haWwsXHJcbiAgICAgICAgbmV3X2VtYWlsOiByZXEuYm9keS5uZXdfZW1haWxcclxuICAgICAgfTtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcblxyXG4gICAgICB1c2VyU2VydmljZS5jaGFuZ2VFbWFpbElkKGRhdGEsIHVzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXMuc2VuZChyZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2ZXJpZnlDaGFuZ2VkRW1haWxJZChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwYXJhbXMgPSByZXEucXVlcnk7XHJcbiAgICAgIGRlbGV0ZSBwYXJhbXMuYWNjZXNzX3Rva2VuO1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuXHJcbiAgICAgIHVzZXJTZXJ2aWNlLnZlcmlmeUNoYW5nZWRFbWFpbElkKHVzZXIsIChlcnJvciwgcmVzdWx0KT0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zZW5kKHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNoYW5nZU1vYmlsZU51bWJlcihyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcGFyYW1zID0gcmVxLmJvZHk7XHJcbiAgICAgIGxldCBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG5cclxuICAgICAgbGV0IHF1ZXJ5ID0geydtb2JpbGVfbnVtYmVyJzogcGFyYW1zLm5ld19tb2JpbGVfbnVtYmVyLCAnaXNBY3RpdmF0ZWQnOiB0cnVlfTtcclxuXHJcbiAgICAgIHVzZXJTZXJ2aWNlLnJldHJpZXZlKHF1ZXJ5LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfUkVHSVNUUkFUSU9OX01PQklMRV9OVU1CRVIsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsZXQgRGF0YSA9IHtcclxuICAgICAgICAgICAgY3VycmVudF9tb2JpbGVfbnVtYmVyOiB1c2VyLm1vYmlsZV9udW1iZXIsXHJcbiAgICAgICAgICAgIF9pZDogdXNlci5faWQsXHJcbiAgICAgICAgICAgIG5ld19tb2JpbGVfbnVtYmVyOiBwYXJhbXMubmV3X21vYmlsZV9udW1iZXJcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICB1c2VyU2VydmljZS5jaGFuZ2VNb2JpbGVOdW1iZXIoRGF0YSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fV0hJTEVfQ09OVEFDVElORyxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XSElMRV9DT05UQUNUSU5HLFxyXG4gICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XHJcbiAgICAgICAgICAgICAgICAnc3RhdHVzJzogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgICAgICAgICAnZGF0YSc6IHtcclxuICAgICAgICAgICAgICAgICAgJ21lc3NhZ2UnOiBNZXNzYWdlcy5NU0dfU1VDQ0VTU19PVFBfQ0hBTkdFX01PQklMRV9OVU1CRVJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZlcmlmeU1vYmlsZU51bWJlcihyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICAgIHRyeSB7XHJcblxyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcGFyYW1zID0gcmVxLmJvZHk7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICB1c2VyU2VydmljZS52ZXJpZnlNb2JpbGVOdW1iZXIocGFyYW1zLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCk9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXMuc2VuZChyZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjaGFuZ2VQYXNzd29yZChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwYXJhbXMgPSByZXEucXVlcnk7XHJcbiAgICAgIGRlbGV0ZSBwYXJhbXMuYWNjZXNzX3Rva2VuO1xyXG4gICAgICBsZXQgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgYmNyeXB0LmNvbXBhcmUocmVxLmJvZHkuY3VycmVudF9wYXNzd29yZCwgdXNlci5wYXNzd29yZCwgKGVycjogYW55LCBpc1NhbWU6IGFueSkgPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9SRUdJU1RSQVRJT05fU1RBVFVTLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0NBTkRJREFURV9BQ0NPVU5ULFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKGlzU2FtZSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlcS5ib2R5LmN1cnJlbnRfcGFzc3dvcmQgPT09IHJlcS5ib2R5Lm5ld19wYXNzd29yZCkge1xyXG4gICAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfU0FNRV9ORVdfUEFTU1dPUkQsXHJcbiAgICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICBsZXQgbmV3X3Bhc3N3b3JkOiBhbnk7XHJcbiAgICAgICAgICAgICAgY29uc3Qgc2FsdFJvdW5kcyA9IDEwO1xyXG4gICAgICAgICAgICAgIGJjcnlwdC5oYXNoKHJlcS5ib2R5Lm5ld19wYXNzd29yZCwgc2FsdFJvdW5kcywgKGVycjogYW55LCBoYXNoOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIFN0b3JlIGhhc2ggaW4geW91ciBwYXNzd29yZCBEQi5cclxuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfUkVHSVNUUkFUSU9OX1NUQVRVUyxcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfQkNSWVBUX0NSRUFUSU9OLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIG5ld19wYXNzd29yZCA9IGhhc2g7XHJcbiAgICAgICAgICAgICAgICAgIGxldCBxdWVyeSA9IHsnX2lkJzogcmVxLnVzZXIuX2lkfTtcclxuICAgICAgICAgICAgICAgICAgbGV0IHVwZGF0ZURhdGEgPSB7J3Bhc3N3b3JkJzogbmV3X3Bhc3N3b3JkfTtcclxuICAgICAgICAgICAgICAgICAgdXNlclNlcnZpY2UuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgbGV0IHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKTtcclxuICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0YXR1cyc6ICdTdWNjZXNzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGEnOiB7J21lc3NhZ2UnOiBNZXNzYWdlcy5NU0dfU1VDQ0VTU19QQVNTV09SRF9DSEFOR0V9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRva2VuXHJcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfQ1VSUkVOVF9QQVNTV09SRCxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNlbmRNYWlsKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCBwYXJhbXMgPSByZXEuYm9keTtcclxuICAgICAgdXNlclNlcnZpY2Uuc2VuZE1haWwocGFyYW1zLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9XSElMRV9DT05UQUNUSU5HLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV0hJTEVfQ09OVEFDVElORyxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgICAgJ3N0YXR1cyc6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgICAnZGF0YSc6IHsnbWVzc2FnZSc6IE1lc3NhZ2VzLk1TR19TVUNDRVNTX1NVQk1JVFRFRH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLypub3RpZmljYXRpb25zKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IGF1dGg6IEF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgICAgbGV0IHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKTtcclxuXHJcbiAgICAgIC8vcmV0cmlldmUgbm90aWZpY2F0aW9uIGZvciBhIHBhcnRpY3VsYXIgdXNlclxyXG4gICAgICBsZXQgcGFyYW1zID0ge19pZDogdXNlci5faWR9O1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuXHJcbiAgICAgIHVzZXJTZXJ2aWNlLnJldHJpZXZlKHBhcmFtcywgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIGxldCB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQodXNlcik7XHJcbiAgICAgICAgICByZXMuc2VuZCh7XHJcbiAgICAgICAgICAgICdzdGF0dXMnOiAnc3VjY2VzcycsXHJcbiAgICAgICAgICAgICdkYXRhJzogcmVzdWx0WzBdLm5vdGlmaWNhdGlvbnMsXHJcbiAgICAgICAgICAgICdjb2RlJyA6IDIwMCxcclxuICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1c2hOb3RpZmljYXRpb25zKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IGJvZHlfZGF0YSA9IHJlcS5ib2R5O1xyXG4gICAgICBsZXQgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgICBsZXQgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHVzZXIpO1xyXG5cclxuICAgICAgLy9yZXRyaWV2ZSBub3RpZmljYXRpb24gZm9yIGEgcGFydGljdWxhciB1c2VyXHJcbiAgICAgIGxldCBwYXJhbXMgPSB7X2lkOiB1c2VyLl9pZH07XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICBsZXQgZGF0YSA9IHskcHVzaDoge25vdGlmaWNhdGlvbnM6IGJvZHlfZGF0YX19O1xyXG5cclxuICAgICAgdXNlclNlcnZpY2UuZmluZE9uZUFuZFVwZGF0ZShwYXJhbXMsIGRhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxldCB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQodXNlcik7XHJcbiAgICAgICAgICByZXMuc2VuZCh7XHJcbiAgICAgICAgICAgICdzdGF0dXMnOiAnU3VjY2VzcycsXHJcbiAgICAgICAgICAgICdkYXRhJzogcmVzdWx0Lm5vdGlmaWNhdGlvbnMsXHJcbiAgICAgICAgICAgICdjb2RlJzogMjAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAzXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0qL1xyXG4gIHVwZGF0ZVBpY3R1cmUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICBfX2Rpcm5hbWUgPSBwYXRoLnJlc29sdmUoKSArIGNvbmZpZy5nZXQoJ2FwcGxpY2F0aW9uLnByb2ZpbGVQYXRoJyk7XHJcbiAgICBsZXQgZm9ybSA9IG5ldyBtdWx0aXBhcnR5LkZvcm0oe3VwbG9hZERpcjogX19kaXJuYW1lfSk7XHJcbiAgICBmb3JtLnBhcnNlKHJlcSwgKGVycjogRXJyb3IsIGZpZWxkczogYW55LCBmaWxlczogYW55KSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBuZXh0KHtcclxuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9ESVJFQ1RPUllfTk9UX0ZPVU5ELFxyXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0RJUkVDVE9SWV9OT1RfRk9VTkQsXHJcbiAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgIGFjdHVhbEVycm9yOiBlcnIsXHJcbiAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgcGF0aCA9IEpTT04uc3RyaW5naWZ5KGZpbGVzLmZpbGVbMF0ucGF0aCk7XHJcbiAgICAgICAgbGV0IGltYWdlX3BhdGggPSBmaWxlcy5maWxlWzBdLnBhdGg7XHJcbiAgICAgICAgbGV0IG9yaWdpbmFsRmlsZW5hbWUgPSBKU09OLnN0cmluZ2lmeShpbWFnZV9wYXRoLnN1YnN0cihmaWxlcy5maWxlWzBdLnBhdGgubGFzdEluZGV4T2YoJy8nKSArIDEpKTtcclxuICAgICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgICBwYXRoID0gY29uZmlnLmdldCgnYXBwbGljYXRpb24ucHJvZmlsZVBhdGhGb3JDbGllbnQnKSArIG9yaWdpbmFsRmlsZW5hbWUucmVwbGFjZSgvXCIvZywgJycpO1xyXG5cclxuICAgICAgICB1c2VyU2VydmljZS5VcGxvYWRJbWFnZShwYXRoLCBvcmlnaW5hbEZpbGVuYW1lLCBmdW5jdGlvbiAoZXJyOiBhbnksIHRlbXBhdGg6IGFueSkge1xyXG4gICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICBuZXh0KGVycik7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgbXlwYXRoID0gdGVtcGF0aDtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICAgICAgICAgIGxldCBxdWVyeSA9IHsnX2lkJzogdXNlci5faWR9O1xyXG5cclxuICAgICAgICAgICAgICB1c2VyU2VydmljZS5maW5kQnlJZCh1c2VyLl9pZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIHVzZXJTZXJ2aWNlLmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHtwaWN0dXJlOiBteXBhdGh9LCB7bmV3OiB0cnVlfSwgKGVycm9yLCByZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGxldCBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICBsZXQgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7YWNjZXNzX3Rva2VuOiB0b2tlbiwgZGF0YTogcmVzcG9uc2V9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0UHJvamVjdHMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSAgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgdXNlclNlcnZpY2UuZ2V0UHJvamVjdHModXNlciwgKGVycm9yLCByZXN1bHQpPT57XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXMuc2VuZChyZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuZXhwb3J0ICA9IFVzZXJDb250cm9sbGVyO1xyXG4iXX0=
