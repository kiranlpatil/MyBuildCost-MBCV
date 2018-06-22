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
    UserController.prototype.checkForLimitationOfBuilding = function (req, res, next) {
        try {
            var user = req.user;
            var projectId = req.params.projectId;
            var userId = req.params.userId;
            var projectService = new UserService();
            projectService.getUserForCheckingBuilding(userId, projectId, user, function (error, result) {
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
                stackTrace: new Error()
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
    UserController.prototype.getProjectSubscription = function (req, res, next) {
        try {
            var user = req.user;
            var projectId = req.params.projectId;
            var userService = new UserService();
            userService.getProjectSubscription(user, projectId, function (error, result) {
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
    UserController.prototype.updateSubscription = function (req, res, next) {
        try {
            var user = req.user;
            var projectId = req.params.projectId;
            var packageName = req.body.packageName;
            var costForBuildingPurchased = req.body.totalBilled;
            var numberOfBuildingsPurchased = req.body.numOfPurchasedBuildings;
            var userService = new UserService();
            userService.updateSubscription(user, projectId, packageName, costForBuildingPurchased, numberOfBuildingsPurchased, function (error, result) {
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
    UserController.prototype.assignPremiumPackage = function (req, res, next) {
        try {
            var user = req.user;
            var userId = req.params.userId;
            var cost = req.body.totalBilled;
            var userService = new UserService();
            userService.assignPremiumPackage(user, userId, cost, function (error, result) {
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
    UserController.prototype.getAdvertisingBanner = function (req, res, next) {
        try {
            __dirname = './';
            var filepath = 'banners.json';
            res.sendFile(filepath, { root: __dirname });
        }
        catch (e) {
            next({
                reason: e.message,
                message: e.message,
                stackTrace: e,
                code: 403
            });
        }
    };
    UserController.prototype.sendProjectExpiryMails = function (req, res, next) {
        try {
            var userService = new UserService();
            userService.sendProjectExpiryWarningMails(function (error, result) {
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
                stackTrace: e,
                code: 403
            });
        }
    };
    return UserController;
}());
module.exports = UserController;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvVXNlckNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLHVDQUF5QztBQUV6QyxpRUFBb0U7QUFDcEUsNERBQStEO0FBRS9ELHFEQUF3RDtBQUN4RCw2Q0FBZ0Q7QUFDaEQsNERBQStEO0FBRy9ELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRS9CO0lBTUU7UUFDRSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztRQUM5QyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztRQUM5QyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksZUFBZSxFQUFFLENBQUM7SUFDaEQsQ0FBQztJQUVELCtCQUFNLEdBQU4sVUFBTyxHQUFvQixFQUFFLEdBQXFCLEVBQUUsSUFBUztRQUMzRCxJQUFJLENBQUM7WUFFSCxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ3BCLElBQUksV0FBVyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7WUFDcEMsSUFBSSxNQUFJLEdBQW9CLElBQUksZUFBZSxFQUFFLENBQUM7WUFDbEQsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsVUFBQyxLQUFLLEVBQUUsTUFBTTtnQkFDekMsRUFBRSxDQUFBLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDVCxJQUFJLENBQUM7d0JBQ0gsTUFBTSxFQUFFLFFBQVEsQ0FBQyxzQkFBc0I7d0JBQ3ZDLE9BQU8sRUFBRSxRQUFRLENBQUMsc0JBQXNCO3dCQUN4QyxVQUFV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O1lBQ1gsSUFBSSxDQUFDO2dCQUNILE1BQU0sRUFBRSxDQUFDLENBQUMsT0FBTztnQkFDakIsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPO2dCQUNsQixVQUFVLEVBQUUsQ0FBQztnQkFDYixJQUFJLEVBQUUsR0FBRzthQUNWLENBQUMsQ0FBQztRQUNMLENBQUM7SUFDSCxDQUFDO0lBRUgscUJBQUM7QUFBRCxDQTFzQkEsQUEwc0JDLElBQUE7QUFDRCxpQkFBVSxjQUFjLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9jb250cm9sbGVycy9Vc2VyQ29udHJvbGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XHJcbmltcG9ydCAqIGFzIG11bHRpcGFydHkgZnJvbSAnbXVsdGlwYXJ0eSc7XHJcbmltcG9ydCB7IE1haWxDaGltcE1haWxlclNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9tYWlsY2hpbXAtbWFpbGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgQXV0aEludGVyY2VwdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJjZXB0b3IvYXV0aC5pbnRlcmNlcHRvcicpO1xyXG5pbXBvcnQgU2VuZE1haWxTZXJ2aWNlID0gcmVxdWlyZSgnLi4vc2VydmljZXMvbWFpbGVyLnNlcnZpY2UnKTtcclxuaW1wb3J0IFVzZXJNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvVXNlck1vZGVsJyk7XHJcbmltcG9ydCBVc2VyU2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL1VzZXJTZXJ2aWNlJyk7XHJcbmltcG9ydCBNZXNzYWdlcyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9tZXNzYWdlcycpO1xyXG5pbXBvcnQgUmVzcG9uc2VTZXJ2aWNlID0gcmVxdWlyZSgnLi4vc2hhcmVkL3Jlc3BvbnNlLnNlcnZpY2UnKTtcclxuXHJcblxyXG5sZXQgY29uZmlnID0gcmVxdWlyZSgnY29uZmlnJyk7XHJcbmxldCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xyXG5sZXQgYmNyeXB0ID0gcmVxdWlyZSgnYmNyeXB0Jyk7XHJcblxyXG5jbGFzcyBVc2VyQ29udHJvbGxlciB7XHJcbiAgcHJpdmF0ZSBfYXV0aEludGVyY2VwdG9yIDogQXV0aEludGVyY2VwdG9yO1xyXG4gIHByaXZhdGUgX3NlbmRNYWlsU2VydmljZSA6IFNlbmRNYWlsU2VydmljZTtcclxuICBwcml2YXRlIF91c2VyU2VydmljZSA6IFVzZXJTZXJ2aWNlO1xyXG4gIHByaXZhdGUgX3Jlc3BvbnNlU2VydmljZSA6IFJlc3BvbnNlU2VydmljZTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLl9hdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICB0aGlzLl9zZW5kTWFpbFNlcnZpY2UgPSBuZXcgU2VuZE1haWxTZXJ2aWNlKCk7XHJcbiAgICB0aGlzLl91c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgdGhpcy5fcmVzcG9uc2VTZXJ2aWNlID0gbmV3IFJlc3BvbnNlU2VydmljZSgpO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSk6IHZvaWQge1xyXG4gICAgdHJ5IHtcclxuXHJcbiAgICAgIGxldCBkYXRhID0gcmVxLmJvZHk7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICBsZXQgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgICB1c2VyU2VydmljZS5jcmVhdGVVc2VyKGRhdGEsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT04sXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT04sXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgLypyZXMuc3RhdHVzKDQwMCkuc2VuZCh7J2Vycm9yJzplcnJvci5tZXNzYWdlLCdtZXNzYWdlJzplcnJvci5tZXNzYWdlIH0pOyovXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxldCB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQocmVzdWx0KTtcclxuICAgICAgICAgIHJlcy5zZW5kKHtcclxuICAgICAgICAgICAgJ2RhdGEnOiByZXN1bHQsXHJcbiAgICAgICAgICAgIGFjY2Vzc190b2tlbjogdG9rZW5cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSAge1xyXG4gICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgcmVzLnNlbmQoeydlcnJvcic6ICdlcnJvciBpbiB5b3VyIHJlcXVlc3QnfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBsb2dpbihyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICBsZXQgcGFyYW1zID0gcmVxLmJvZHk7XHJcbiAgICAgIGRlbGV0ZSBwYXJhbXMuYWNjZXNzX3Rva2VuO1xyXG4gICAgICB1c2VyU2VydmljZS5sb2dpbihwYXJhbXMsIChlcnJvciwgcmVzdWx0KT0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgcmVzLnNlbmQoZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZW5kT3RwKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwYXJhbXMgPSByZXEuYm9keTsgIC8vbW9iaWxlX251bWJlcihuZXcpXHJcbiAgICAgIHVzZXJTZXJ2aWNlLnNlbmRPdHAocGFyYW1zLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCk9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIHJlcy5zZW5kKGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQocmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAzXHJcbiAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZlcmlmeU90cChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICAgIHRyeSB7XHJcblxyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcGFyYW1zID0gcmVxLmJvZHk7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICB1c2VyU2VydmljZS52ZXJpZnlPdHAocGFyYW1zLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCk9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXMuc2VuZChyZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmb3Jnb3RQYXNzd29yZChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICBsZXQgcGFyYW1zID0gcmVxLmJvZHk7ICAgLy9lbWFpbFxyXG5cclxuICAgICAgdXNlclNlcnZpY2UuZm9yZ290UGFzc3dvcmQocGFyYW1zLCAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHtcclxuXHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IubWVzc2FnZSA9PT0gTWVzc2FnZXMuTVNHX0VSUk9SX0NIRUNLX0lOQUNUSVZFX0FDQ09VTlQpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfVVNFUl9OT1RfQUNUSVZBVEVELFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9BQ0NPVU5UX1NUQVRVUyxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yLm1lc3NhZ2UgPT09IE1lc3NhZ2VzLk1TR19FUlJPUl9VU0VSX05PVF9GT1VORCkge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fVVNFUl9OT1RfRk9VTkQsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1VTRVJfTk9UX0ZPVU5ELFxyXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgICAnc3RhdHVzJzogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgICAgICdkYXRhJzogeydtZXNzYWdlJzogTWVzc2FnZXMuTVNHX1NVQ0NFU1NfRU1BSUxfRk9SR09UX1BBU1NXT1JEfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlc2V0UGFzc3dvcmQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcGFyYW1zID0gcmVxLmJvZHk7ICAgLy9uZXdfcGFzc3dvcmRcclxuICAgICAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICB1c2VyU2VydmljZS5yZXNldFBhc3N3b3JkKHBhcmFtcywgdXNlciwgKGVycjogYW55LCByZXN1bHQ6IGFueSkgPT4ge1xyXG4gICAgICAgIGlmKGVycikge1xyXG4gICAgICAgICAgbmV4dChlcnIsIG51bGwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXMuc2VuZChyZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIC8qYmNyeXB0Lmhhc2gocmVxLmJvZHkubmV3X3Bhc3N3b3JkLCBzYWx0Um91bmRzLCAoZXJyOiBhbnksIGhhc2g6IGFueSkgPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246ICdFcnJvciBpbiBjcmVhdGluZyBoYXNoIHVzaW5nIGJjcnlwdCcsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdFcnJvciBpbiBjcmVhdGluZyBoYXNoIHVzaW5nIGJjcnlwdCcsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsZXQgdXBkYXRlRGF0YSA9IHsncGFzc3dvcmQnOiBoYXNofTtcclxuICAgICAgICAgIGxldCBxdWVyeSA9IHtcclxuICAgICAgICAgICAgJ19pZCc6IHVzZXIuX2lkLFxyXG4gICAgICAgICAgICAncGFzc3dvcmQnOiByZXEudXNlci5wYXNzd29yZFxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIHVzZXJTZXJ2aWNlLmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZURhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICByZXMuc2VuZCh7XHJcbiAgICAgICAgICAgICAgICAnc3RhdHVzJzogJ1N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAgICAgJ2RhdGEnOiB7J21lc3NhZ2UnOiAnUGFzc3dvcmQgY2hhbmdlZCBzdWNjZXNzZnVsbHknfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pOyovXHJcblxyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAzXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlRGV0YWlscyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCBuZXdVc2VyRGF0YTogVXNlck1vZGVsID0gPFVzZXJNb2RlbD5yZXEuYm9keTtcclxuICAgICAgbGV0IHBhcmFtcyA9IHJlcS5xdWVyeTtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XHJcblxyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgdXNlclNlcnZpY2UudXBkYXRlRGV0YWlscyhuZXdVc2VyRGF0YSwgdXNlciwgKGVycm9yLCByZXN1bHQpPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnNlbmQocmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAzXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0cmlldmUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgbGV0IHBhcmFtcyA9IHJlcS5wYXJhbXMuaWQ7XHJcbiAgICAgIGRlbGV0ZSBwYXJhbXMuYWNjZXNzX3Rva2VuO1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICAvL3ZhciB1c2VyU2VydmljZXMgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgdXNlclNlcnZpY2UuZ2V0VXNlckJ5SWQodXNlciwgKGVyciwgcmVzdWx0KT0+IHtcclxuICAgICAgICBpZihlcnIpIHtcclxuICAgICAgICAgIHJlcy5zZW5kKGVycik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zZW5kKHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgcmVzLnNlbmQoZSk7XHJcbiAgICAgIC8qbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICB9KTsqL1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY2hhbmdlRW1haWxJZChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcGFyYW1zID0gcmVxLnF1ZXJ5O1xyXG4gICAgICBkZWxldGUgcGFyYW1zLmFjY2Vzc190b2tlbjtcclxuICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgY3VycmVudF9lbWFpbDogcmVxLmJvZHkuY3VycmVudF9lbWFpbCxcclxuICAgICAgICBuZXdfZW1haWw6IHJlcS5ib2R5Lm5ld19lbWFpbFxyXG4gICAgICB9O1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuXHJcbiAgICAgIHVzZXJTZXJ2aWNlLmNoYW5nZUVtYWlsSWQoZGF0YSwgdXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zZW5kKHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZlcmlmeUNoYW5nZWRFbWFpbElkKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHBhcmFtcyA9IHJlcS5xdWVyeTtcclxuICAgICAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG5cclxuICAgICAgdXNlclNlcnZpY2UudmVyaWZ5Q2hhbmdlZEVtYWlsSWQodXNlciwgKGVycm9yLCByZXN1bHQpPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnNlbmQocmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAzXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY2hlY2tGb3JMaW1pdGF0aW9uT2ZCdWlsZGluZyhyZXE6ZXhwcmVzcy5SZXF1ZXN0LHJlczpleHByZXNzLlJlc3BvbnNlLG5leHQ6YW55KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCB1c2VySWQgPXJlcS5wYXJhbXMudXNlcklkO1xyXG4gICAgICBsZXQgcHJvamVjdFNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgcHJvamVjdFNlcnZpY2UuZ2V0VXNlckZvckNoZWNraW5nQnVpbGRpbmcodXNlcklkLHByb2plY3RJZCx1c2VyLChlcnJvcjphbnkscmVzdWx0OmFueSkgPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICByZXMuc2VuZChyZXN1bHQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOmUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOmUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNoYW5nZU1vYmlsZU51bWJlcihyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcGFyYW1zID0gcmVxLmJvZHk7XHJcbiAgICAgIGxldCBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG5cclxuICAgICAgbGV0IHF1ZXJ5ID0geydtb2JpbGVfbnVtYmVyJzogcGFyYW1zLm5ld19tb2JpbGVfbnVtYmVyLCAnaXNBY3RpdmF0ZWQnOiB0cnVlfTtcclxuXHJcbiAgICAgIHVzZXJTZXJ2aWNlLnJldHJpZXZlKHF1ZXJ5LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfUkVHSVNUUkFUSU9OX01PQklMRV9OVU1CRVIsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsZXQgRGF0YSA9IHtcclxuICAgICAgICAgICAgY3VycmVudF9tb2JpbGVfbnVtYmVyOiB1c2VyLm1vYmlsZV9udW1iZXIsXHJcbiAgICAgICAgICAgIF9pZDogdXNlci5faWQsXHJcbiAgICAgICAgICAgIG5ld19tb2JpbGVfbnVtYmVyOiBwYXJhbXMubmV3X21vYmlsZV9udW1iZXJcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICB1c2VyU2VydmljZS5jaGFuZ2VNb2JpbGVOdW1iZXIoRGF0YSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fV0hJTEVfQ09OVEFDVElORyxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XSElMRV9DT05UQUNUSU5HLFxyXG4gICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XHJcbiAgICAgICAgICAgICAgICAnc3RhdHVzJzogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgICAgICAgICAnZGF0YSc6IHtcclxuICAgICAgICAgICAgICAgICAgJ21lc3NhZ2UnOiBNZXNzYWdlcy5NU0dfU1VDQ0VTU19PVFBfQ0hBTkdFX01PQklMRV9OVU1CRVJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHZlcmlmeU1vYmlsZU51bWJlcihyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICAgIHRyeSB7XHJcblxyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcGFyYW1zID0gcmVxLmJvZHk7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICB1c2VyU2VydmljZS52ZXJpZnlNb2JpbGVOdW1iZXIocGFyYW1zLCB1c2VyLCAoZXJyb3IsIHJlc3VsdCk9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXMuc2VuZChyZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjaGFuZ2VQYXNzd29yZChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwYXJhbXMgPSByZXEucXVlcnk7XHJcbiAgICAgIGRlbGV0ZSBwYXJhbXMuYWNjZXNzX3Rva2VuO1xyXG4gICAgICBsZXQgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgYmNyeXB0LmNvbXBhcmUocmVxLmJvZHkuY3VycmVudF9wYXNzd29yZCwgdXNlci5wYXNzd29yZCwgKGVycjogYW55LCBpc1NhbWU6IGFueSkgPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9SRUdJU1RSQVRJT05fU1RBVFVTLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0NBTkRJREFURV9BQ0NPVU5ULFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKGlzU2FtZSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlcS5ib2R5LmN1cnJlbnRfcGFzc3dvcmQgPT09IHJlcS5ib2R5Lm5ld19wYXNzd29yZCkge1xyXG4gICAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfU0FNRV9ORVdfUEFTU1dPUkQsXHJcbiAgICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICBsZXQgbmV3X3Bhc3N3b3JkOiBhbnk7XHJcbiAgICAgICAgICAgICAgY29uc3Qgc2FsdFJvdW5kcyA9IDEwO1xyXG4gICAgICAgICAgICAgIGJjcnlwdC5oYXNoKHJlcS5ib2R5Lm5ld19wYXNzd29yZCwgc2FsdFJvdW5kcywgKGVycjogYW55LCBoYXNoOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIFN0b3JlIGhhc2ggaW4geW91ciBwYXNzd29yZCBEQi5cclxuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfUkVHSVNUUkFUSU9OX1NUQVRVUyxcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfQkNSWVBUX0NSRUFUSU9OLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIG5ld19wYXNzd29yZCA9IGhhc2g7XHJcbiAgICAgICAgICAgICAgICAgIGxldCBxdWVyeSA9IHsnX2lkJzogcmVxLnVzZXIuX2lkfTtcclxuICAgICAgICAgICAgICAgICAgbGV0IHVwZGF0ZURhdGEgPSB7J3Bhc3N3b3JkJzogbmV3X3Bhc3N3b3JkfTtcclxuICAgICAgICAgICAgICAgICAgdXNlclNlcnZpY2UuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwgdXBkYXRlRGF0YSwge25ldzogdHJ1ZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgbGV0IHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZCh1c2VyKTtcclxuICAgICAgICAgICAgICAgICAgICAgIHJlcy5zZW5kKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0YXR1cyc6ICdTdWNjZXNzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGEnOiB7J21lc3NhZ2UnOiBNZXNzYWdlcy5NU0dfU1VDQ0VTU19QQVNTV09SRF9DSEFOR0V9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRva2VuXHJcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfQ1VSUkVOVF9QQVNTV09SRCxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNlbmRNYWlsKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCBwYXJhbXMgPSByZXEuYm9keTtcclxuICAgICAgdXNlclNlcnZpY2Uuc2VuZE1haWwocGFyYW1zLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9XSElMRV9DT05UQUNUSU5HLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV0hJTEVfQ09OVEFDVElORyxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgICAgJ3N0YXR1cyc6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgICAnZGF0YSc6IHsnbWVzc2FnZSc6IE1lc3NhZ2VzLk1TR19TVUNDRVNTX1NVQk1JVFRFRH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlUGljdHVyZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIF9fZGlybmFtZSA9IHBhdGgucmVzb2x2ZSgpICsgY29uZmlnLmdldCgnYXBwbGljYXRpb24ucHJvZmlsZVBhdGgnKTtcclxuICAgIGxldCBmb3JtID0gbmV3IG11bHRpcGFydHkuRm9ybSh7dXBsb2FkRGlyOiBfX2Rpcm5hbWV9KTtcclxuICAgIGZvcm0ucGFyc2UocmVxLCAoZXJyOiBFcnJvciwgZmllbGRzOiBhbnksIGZpbGVzOiBhbnkpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0RJUkVDVE9SWV9OT1RfRk9VTkQsXHJcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfRElSRUNUT1JZX05PVF9GT1VORCxcclxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgYWN0dWFsRXJyb3I6IGVycixcclxuICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCBwYXRoID0gSlNPTi5zdHJpbmdpZnkoZmlsZXMuZmlsZVswXS5wYXRoKTtcclxuICAgICAgICBsZXQgaW1hZ2VfcGF0aCA9IGZpbGVzLmZpbGVbMF0ucGF0aDtcclxuICAgICAgICBsZXQgb3JpZ2luYWxGaWxlbmFtZSA9IEpTT04uc3RyaW5naWZ5KGltYWdlX3BhdGguc3Vic3RyKGZpbGVzLmZpbGVbMF0ucGF0aC5sYXN0SW5kZXhPZignLycpICsgMSkpO1xyXG4gICAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICAgIHBhdGggPSBjb25maWcuZ2V0KCdhcHBsaWNhdGlvbi5wcm9maWxlUGF0aEZvckNsaWVudCcpICsgb3JpZ2luYWxGaWxlbmFtZS5yZXBsYWNlKC9cIi9nLCAnJyk7XHJcblxyXG4gICAgICAgIHVzZXJTZXJ2aWNlLlVwbG9hZEltYWdlKHBhdGgsIG9yaWdpbmFsRmlsZW5hbWUsIGZ1bmN0aW9uIChlcnI6IGFueSwgdGVtcGF0aDogYW55KSB7XHJcbiAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgIG5leHQoZXJyKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBteXBhdGggPSB0ZW1wYXRoO1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgICAgICAgICAgbGV0IHF1ZXJ5ID0geydfaWQnOiB1c2VyLl9pZH07XHJcblxyXG4gICAgICAgICAgICAgIHVzZXJTZXJ2aWNlLmZpbmRCeUlkKHVzZXIuX2lkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgdXNlclNlcnZpY2UuZmluZE9uZUFuZFVwZGF0ZShxdWVyeSwge3BpY3R1cmU6IG15cGF0aH0sIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgbGV0IGF1dGg6IEF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgICAgICAgICAgICAgICAgICAgIGxldCB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHthY2Nlc3NfdG9rZW46IHRva2VuLCBkYXRhOiByZXNwb25zZX0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRQcm9qZWN0cyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lke1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXIgPSByZXEudXNlcjtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlICA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICB1c2VyU2VydmljZS5nZXRQcm9qZWN0cyh1c2VyLCAoZXJyb3IsIHJlc3VsdCk9PntcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zZW5kKHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAzXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0UHJvamVjdFN1YnNjcmlwdGlvbihyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICAgIGxldCBwcm9qZWN0SWQgPSAgcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSAgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgdXNlclNlcnZpY2UuZ2V0UHJvamVjdFN1YnNjcmlwdGlvbih1c2VyLCBwcm9qZWN0SWQsKGVycm9yLCByZXN1bHQpPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnNlbmQocmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaChlKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGVTdWJzY3JpcHRpb24ocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gcmVxLnBhcmFtcy5wcm9qZWN0SWQ7XHJcbiAgICAgIGxldCBwYWNrYWdlTmFtZSA9IHJlcS5ib2R5LnBhY2thZ2VOYW1lO1xyXG4gICAgICBsZXQgY29zdEZvckJ1aWxkaW5nUHVyY2hhc2VkID1yZXEuYm9keS50b3RhbEJpbGxlZDtcclxuICAgICAgbGV0IG51bWJlck9mQnVpbGRpbmdzUHVyY2hhc2VkID0gcmVxLmJvZHkubnVtT2ZQdXJjaGFzZWRCdWlsZGluZ3M7XHJcblxyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgdXNlclNlcnZpY2UudXBkYXRlU3Vic2NyaXB0aW9uKHVzZXIscHJvamVjdElkLCBwYWNrYWdlTmFtZSxjb3N0Rm9yQnVpbGRpbmdQdXJjaGFzZWQsbnVtYmVyT2ZCdWlsZGluZ3NQdXJjaGFzZWQsKGVycm9yLCByZXN1bHQpPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICByZXMuc2VuZChyZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9Y2F0Y2goZSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3ICBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbiAgYXNzaWduUHJlbWl1bVBhY2thZ2UocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgdXNlcklkID1yZXEucGFyYW1zLnVzZXJJZDtcclxuICAgICAgbGV0IGNvc3QgPXJlcS5ib2R5LnRvdGFsQmlsbGVkO1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgdXNlclNlcnZpY2UuYXNzaWduUHJlbWl1bVBhY2thZ2UodXNlcix1c2VySWQsY29zdCwoZXJyb3IsIHJlc3VsdCk9PiB7XHJcbiAgICAgICAgaWYoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgIHJlcy5zZW5kKHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1jYXRjaChlKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgIEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAzXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbi8qXHJcbiAgYXNzaWduVXNlclN1YnNjcmlwdGlvblBhY2thZ2UocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgICBsZXQgcHJvamVjdElkID0gIHJlcS5wYXJhbXMucHJvamVjdElkO1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgIHVzZXJTZXJ2aWNlLmdldFByb2plY3RTdWJzY3JpcHRpb24odXNlciwgcHJvamVjdElkLChlcnJvciwgcmVzdWx0KT0+IHtcclxuICAgICAgICBpZihlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zZW5kKHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAzXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuKi9cclxuXHJcblxyXG4gIGdldEFkdmVydGlzaW5nQmFubmVyKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGV4cHJlc3MuTmV4dEZ1bmN0aW9uKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBfX2Rpcm5hbWUgPSAnLi8nO1xyXG4gICAgICBsZXQgZmlsZXBhdGggPSAnYmFubmVycy5qc29uJztcclxuICAgICAgcmVzLnNlbmRGaWxlKGZpbGVwYXRoLCB7cm9vdDogX19kaXJuYW1lfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFja1RyYWNlOiBlLFxyXG4gICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNlbmRQcm9qZWN0RXhwaXJ5TWFpbHMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogZXhwcmVzcy5OZXh0RnVuY3Rpb24pIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSAgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgdXNlclNlcnZpY2Uuc2VuZFByb2plY3RFeHBpcnlXYXJuaW5nTWFpbHMoKGVycm9yLCByZXN1bHQpPT4ge1xyXG4gICAgICAgIGlmKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnNlbmQocmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IGUsXHJcbiAgICAgICAgY29kZTogNDAzXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbn1cclxuZXhwb3J0ICA9IFVzZXJDb250cm9sbGVyO1xyXG4iXX0=
