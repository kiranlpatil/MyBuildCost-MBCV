"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AuthInterceptor = require("../interceptor/auth.interceptor");
var Messages = require("../shared/messages");
var UserService = require("../services/user.service");
var AdminService = require("../services/admin.service");
var request = require('request');
function create(req, res, next) {
    try {
        var newUser = req.body;
        newUser.isAdmin = true;
        newUser.first_name = 'Admin';
        newUser.email = 'support@jobmosis.com';
        newUser.mobile_number = 8669601616;
        newUser.isActivated = true;
        newUser.password = '$2a$10$5SBFt0BpQPp/15N5J38nZuh2zMSL1gbFmnEe4xRLIltlQn56bNcZq';
        var userService = new UserService();
        userService.createUser(newUser, function (error, result) {
            if (error) {
                if (error === Messages.MSG_ERROR_CHECK_EMAIL_PRESENT) {
                    next({
                        reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
                        message: Messages.MSG_ERROR_VERIFY_ACCOUNT,
                        stackTrace: new Error(),
                        code: 403
                    });
                }
                else if (error === Messages.MSG_ERROR_CHECK_MOBILE_PRESENT) {
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
                console.log('result', JSON.stringify(result));
                var token = auth.issueTokenWithUid(result);
                res.status(200).send({
                    'status': Messages.STATUS_SUCCESS,
                    'data': {
                        'reason': Messages.MSG_SUCCESS_REGISTRATION,
                        'first_name': newUser.first_name,
                        'email': newUser.email,
                        'mobile_number': newUser.mobile_number,
                        '_id': result._id,
                        'picture': ''
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
function getAllUser(req, res, next) {
    try {
        var userService = new UserService();
        var adminService = new AdminService();
        var params = {};
        if (req.user.isAdmin) {
            userService.retrieveAll(params, function (error, result) {
                if (error) {
                    next({
                        reason: Messages.MSG_ERROR_RETRIEVING_USER,
                        message: Messages.MSG_ERROR_RETRIEVING_USER,
                        stackTrace: new Error(),
                        code: 403
                    });
                }
                else {
                    adminService.getUserDetails(result, function (error, resp) {
                        if (error) {
                            next({
                                reason: Messages.MSG_ERROR_SEPERATING_USER,
                                message: Messages.MSG_ERROR_SEPERATING_USER,
                                stackTrace: new Error(),
                                code: 403
                            });
                        }
                        else {
                            res.status(200).send({
                                'status': 'success',
                                'data': resp
                            });
                        }
                    });
                }
            });
        }
        else {
            next({
                reason: Messages.MSG_ERROR_UNAUTHORIZED_USER,
                message: Messages.MSG_ERROR_UNAUTHORIZED_USER,
                stackTrace: new Error(),
                code: 401
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
exports.getAllUser = getAllUser;
function getCountOfUsers(req, res, next) {
    try {
        var adminService = new AdminService();
        var params = {};
        if (req.user.isAdmin) {
            adminService.getCountOfUsers(params, function (error, result) {
                if (error) {
                    next({
                        reason: Messages.MSG_ERROR_RETRIEVING_USER,
                        message: Messages.MSG_ERROR_RETRIEVING_USER,
                        stackTrace: new Error(),
                        code: 403
                    });
                }
                else {
                    res.status(200).send({
                        'status': 'success',
                        'data': result
                    });
                }
            });
        }
        else {
            next({
                reason: Messages.MSG_ERROR_UNAUTHORIZED_USER,
                message: Messages.MSG_ERROR_UNAUTHORIZED_USER,
                stackTrace: new Error(),
                code: 401
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
exports.getCountOfUsers = getCountOfUsers;
function getCandidateDetailsByInitial(req, res, next) {
    try {
        var adminService = new AdminService();
        var initial = req.params.initial;
        if (req.user.isAdmin) {
            adminService.getCandidateDetails(initial, function (error, result) {
                if (error) {
                    next({
                        reason: Messages.MSG_ERROR_RETRIEVING_USER,
                        message: Messages.MSG_ERROR_RETRIEVING_USER,
                        stackTrace: new Error(),
                        code: 403
                    });
                }
                else {
                    res.status(200).send({
                        'status': 'success',
                        'data': result
                    });
                }
            });
        }
        else {
            next({
                reason: Messages.MSG_ERROR_UNAUTHORIZED_USER,
                message: Messages.MSG_ERROR_UNAUTHORIZED_USER,
                stackTrace: new Error(),
                code: 401
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
exports.getCandidateDetailsByInitial = getCandidateDetailsByInitial;
function getRecruiterDetailsByInitial(req, res, next) {
    try {
        var adminService = new AdminService();
        var initial = req.params.initial;
        if (req.user.isAdmin) {
            adminService.getRecruiterDetails(initial, function (error, result) {
                if (error) {
                    next({
                        reason: Messages.MSG_ERROR_RETRIEVING_USER,
                        message: Messages.MSG_ERROR_RETRIEVING_USER,
                        stackTrace: new Error(),
                        code: 403
                    });
                }
                else {
                    res.status(200).send({
                        'status': 'success',
                        'data': result
                    });
                }
            });
        }
        else {
            next({
                reason: Messages.MSG_ERROR_UNAUTHORIZED_USER,
                message: Messages.MSG_ERROR_UNAUTHORIZED_USER,
                stackTrace: new Error(),
                code: 401
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
exports.getRecruiterDetailsByInitial = getRecruiterDetailsByInitial;
function exportCandidateDetails(req, res, next) {
    try {
        var userService = new UserService();
        var adminService = new AdminService();
        var params = {};
        var userType = 'candidate';
        if (req.user.isAdmin) {
            adminService.getUserDetails(userType, function (error, resp) {
                if (error) {
                    next({
                        reason: Messages.MSG_ERROR_SEPERATING_USER,
                        message: Messages.MSG_ERROR_SEPERATING_USER,
                        stackTrace: new Error(),
                        code: 403
                    });
                }
                else {
                    adminService.generateCandidateDetailFile(resp, function (err, respo) {
                        if (err) {
                            next({
                                reason: Messages.MSG_ERROR_CREATING_EXCEL,
                                message: Messages.MSG_ERROR_CREATING_EXCEL,
                                stackTrace: new Error(),
                                code: 403
                            });
                        }
                        else {
                            var file = '/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/candidate.csv';
                            res.download(file);
                        }
                    });
                }
            });
        }
        else {
            next({
                reason: Messages.MSG_ERROR_UNAUTHORIZED_USER,
                message: Messages.MSG_ERROR_UNAUTHORIZED_USER,
                stackTrace: new Error(),
                code: 401
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
exports.exportCandidateDetails = exportCandidateDetails;
function exportRecruiterDetails(req, res, next) {
    try {
        var userService = new UserService();
        var adminService = new AdminService();
        var params = {};
        var userType = 'recruiter';
        if (req.user.isAdmin) {
            adminService.getUserDetails(userType, function (error, resp) {
                if (error) {
                    next({
                        reason: Messages.MSG_ERROR_SEPERATING_USER,
                        message: Messages.MSG_ERROR_SEPERATING_USER,
                        stackTrace: new Error(),
                        code: 403
                    });
                }
                else {
                    adminService.generateRecruiterDetailFile(resp, function (err, respo) {
                        if (err) {
                            next({
                                reason: Messages.MSG_ERROR_CREATING_EXCEL,
                                message: Messages.MSG_ERROR_CREATING_EXCEL,
                                stackTrace: new Error(),
                                code: 403
                            });
                        }
                        else {
                            var file = '/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/recruiter.csv';
                            res.download(file);
                        }
                    });
                }
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
exports.exportRecruiterDetails = exportRecruiterDetails;
function getUsageDetails(req, res, next) {
    try {
        var adminService = new AdminService();
        var params = {};
        if (req.user.isAdmin) {
            adminService.getUsageDetails(params, function (error, result) {
                if (error) {
                    next({
                        reason: Messages.MSG_ERROR_RETRIEVING_USAGE_DETAIL,
                        message: Messages.MSG_ERROR_RETRIEVING_USAGE_DETAIL,
                        stackTrace: new Error(),
                        code: 403
                    });
                }
                else {
                    adminService.addUsageDetailsValue(result, function (error, resp) {
                        if (error) {
                            next({
                                reason: Messages.MSG_ERROR_ADDING_USAGE_DETAIL,
                                message: Messages.MSG_ERROR_ADDING_USAGE_DETAIL,
                                stackTrace: new Error(),
                                code: 403
                            });
                        }
                        else {
                            adminService.generateUsageDetailFile(resp, function (err, respo) {
                                if (err) {
                                    next({
                                        reason: Messages.MSG_ERROR_CREATING_EXCEL,
                                        message: Messages.MSG_ERROR_CREATING_EXCEL,
                                        stackTrace: new Error(),
                                        code: 403
                                    });
                                }
                                else {
                                    var file = '/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/usagedetail.csv';
                                    res.download(file);
                                }
                            });
                        }
                    });
                }
            });
        }
        else {
            next({
                reason: Messages.MSG_ERROR_UNAUTHORIZED_USER,
                message: Messages.MSG_ERROR_UNAUTHORIZED_USER,
                stackTrace: new Error(),
                code: 401
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
exports.getUsageDetails = getUsageDetails;
function updateDetailOfUser(req, res, next) {
    try {
        var newUserData = req.body;
        var params = req.query;
        delete params.access_token;
        var user = req.user;
        var _id = user._id;
        var auth = new AuthInterceptor();
        var adminService = new AdminService();
        var userService = new UserService();
        adminService.updateUser(newUserData.user_id, newUserData, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                userService.retrieve(_id, function (error, resu) {
                    if (error) {
                        next({
                            reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                            message: Messages.MSG_ERROR_WRONG_TOKEN,
                            stackTrace: new Error(),
                            code: 401
                        });
                    }
                    else {
                        var token = auth.issueTokenWithUid(resu[0]);
                        res.send({
                            'status': 'success',
                            'data': {
                                'updateUser': result,
                                'first_name': resu[0].first_name,
                                'email': resu[0].email,
                                'mobile_number': resu[0].mobile_number,
                                '_id': resu[0].userId,
                                'current_theme': resu[0].current_theme
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
exports.updateDetailOfUser = updateDetailOfUser;
function sendLoginInfoToAdmin(email, ip, latitude, longitude, next) {
    try {
        var params = { email: undefined, ip: undefined, location: undefined };
        var address;
        params.ip = ip;
        params.email = email;
        var adminService = new AdminService();
        request('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=true', function (error, response, body) {
            if (!error || response.statusCode == 200) {
                if (response.statusCode == 200) {
                    address = JSON.parse(body).results[0].formatted_address;
                    params.location = address;
                }
                adminService.sendAdminLoginInfoMail(params, function (error, result) {
                    if (error) {
                        next(error);
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
exports.sendLoginInfoToAdmin = sendLoginInfoToAdmin;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvYWRtaW4uY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGlFQUFvRTtBQUNwRSw2Q0FBZ0Q7QUFDaEQsc0RBQXlEO0FBRXpELHdEQUEyRDtBQUUzRCxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFHakMsZ0JBQXVCLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUFTO0lBQzNFLElBQUksQ0FBQztRQUNILElBQUksT0FBTyxHQUF5QixHQUFHLENBQUMsSUFBSSxDQUFDO1FBQzdDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLE9BQU8sQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDO1FBQzdCLE9BQU8sQ0FBQyxLQUFLLEdBQUcsc0JBQXNCLENBQUM7UUFDdkMsT0FBTyxDQUFDLGFBQWEsR0FBRyxVQUFVLENBQUM7UUFDbkMsT0FBTyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDM0IsT0FBTyxDQUFDLFFBQVEsR0FBRyw4REFBOEQsQ0FBQztRQUNsRixJQUFJLFdBQVcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQ3BDLFdBQVcsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07WUFDNUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVixFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssUUFBUSxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQztvQkFDckQsSUFBSSxDQUFDO3dCQUNILE1BQU0sRUFBRSxRQUFRLENBQUMsMkJBQTJCO3dCQUM1QyxPQUFPLEVBQUUsUUFBUSxDQUFDLHdCQUF3Qjt3QkFDMUMsVUFBVSxFQUFFLElBQUksS0FBSyxFQUFFO3dCQUN2QixJQUFJLEVBQUUsR0FBRztxQkFDVixDQUFDLENBQUM7Z0JBQ0wsQ0FBQztnQkFBQyxJQUFJLENBQUMsRUFBRSxD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cm9sbGVycy9hZG1pbi5jb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZXhwcmVzcyBmcm9tIFwiZXhwcmVzc1wiO1xyXG5pbXBvcnQgQXV0aEludGVyY2VwdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJjZXB0b3IvYXV0aC5pbnRlcmNlcHRvcicpO1xyXG5pbXBvcnQgTWVzc2FnZXMgPSByZXF1aXJlKCcuLi9zaGFyZWQvbWVzc2FnZXMnKTtcclxuaW1wb3J0IFVzZXJTZXJ2aWNlID0gcmVxdWlyZSgnLi4vc2VydmljZXMvdXNlci5zZXJ2aWNlJyk7XHJcbmltcG9ydCBDYW5kaWRhdGVTZXJ2aWNlID0gcmVxdWlyZSgnLi4vc2VydmljZXMvY2FuZGlkYXRlLnNlcnZpY2UnKTtcclxuaW1wb3J0IEFkbWluU2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL2FkbWluLnNlcnZpY2UnKTtcclxuaW1wb3J0IFVzZXJNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvdXNlci5tb2RlbCcpO1xyXG52YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QnKTtcclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgbmV3VXNlcjogVXNlck1vZGVsID0gPFVzZXJNb2RlbD5yZXEuYm9keTtcclxuICAgIG5ld1VzZXIuaXNBZG1pbiA9IHRydWU7XHJcbiAgICBuZXdVc2VyLmZpcnN0X25hbWUgPSAnQWRtaW4nO1xyXG4gICAgbmV3VXNlci5lbWFpbCA9ICdzdXBwb3J0QGpvYm1vc2lzLmNvbSc7XHJcbiAgICBuZXdVc2VyLm1vYmlsZV9udW1iZXIgPSA4NjY5NjAxNjE2O1xyXG4gICAgbmV3VXNlci5pc0FjdGl2YXRlZCA9IHRydWU7XHJcbiAgICBuZXdVc2VyLnBhc3N3b3JkID0gJyQyYSQxMCQ1U0JGdDBCcFFQcC8xNU41SjM4blp1aDJ6TVNMMWdiRm1uRWU0eFJMSWx0bFFuNTZiTmNacSc7XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIHVzZXJTZXJ2aWNlLmNyZWF0ZVVzZXIobmV3VXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgaWYgKGVycm9yID09PSBNZXNzYWdlcy5NU0dfRVJST1JfQ0hFQ0tfRU1BSUxfUFJFU0VOVCkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0FDQ09VTlQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZXJyb3IgPT09IE1lc3NhZ2VzLk1TR19FUlJPUl9DSEVDS19NT0JJTEVfUFJFU0VOVCkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfUkVHSVNUUkFUSU9OX01PQklMRV9OVU1CRVIsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0VYSVNUSU5HX1VTRVIsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9VU0VSX1dJVEhfRU1BSUxfUFJFU0VOVCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3Jlc3VsdCcsIEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xyXG4gICAgICAgIHZhciB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQocmVzdWx0KTtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XHJcbiAgICAgICAgICAnc3RhdHVzJzogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgICAnZGF0YSc6IHtcclxuICAgICAgICAgICAgJ3JlYXNvbic6IE1lc3NhZ2VzLk1TR19TVUNDRVNTX1JFR0lTVFJBVElPTixcclxuICAgICAgICAgICAgJ2ZpcnN0X25hbWUnOiBuZXdVc2VyLmZpcnN0X25hbWUsXHJcbiAgICAgICAgICAgICdlbWFpbCc6IG5ld1VzZXIuZW1haWwsXHJcbiAgICAgICAgICAgICdtb2JpbGVfbnVtYmVyJzogbmV3VXNlci5tb2JpbGVfbnVtYmVyLFxyXG4gICAgICAgICAgICAnX2lkJzogcmVzdWx0Ll9pZCxcclxuICAgICAgICAgICAgJ3BpY3R1cmUnOiAnJ1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGFjY2Vzc190b2tlbjogdG9rZW5cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgbmV4dCh7XHJcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICBjb2RlOiA0MDNcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEFsbFVzZXIocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgdmFyIGFkbWluU2VydmljZSA9IG5ldyBBZG1pblNlcnZpY2UoKTtcclxuICAgIHZhciBwYXJhbXMgPSB7fTtcclxuICAgIGlmIChyZXEudXNlci5pc0FkbWluKSB7XHJcbiAgICAgIHVzZXJTZXJ2aWNlLnJldHJpZXZlQWxsKHBhcmFtcywgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SRVRSSUVWSU5HX1VTRVIsLy9NZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9SRVRSSUVWSU5HX1VTRVIsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBhZG1pblNlcnZpY2UuZ2V0VXNlckRldGFpbHMocmVzdWx0LCAoZXJyb3IsIHJlc3ApID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9TRVBFUkFUSU5HX1VTRVIsLy9NZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfU0VQRVJBVElOR19VU0VSLFxyXG4gICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XHJcbiAgICAgICAgICAgICAgICAnc3RhdHVzJzogJ3N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAgICAgJ2RhdGEnOiByZXNwXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1VOQVVUSE9SSVpFRF9VU0VSLFxyXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1VOQVVUSE9SSVpFRF9VU0VSLFxyXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICBjb2RlOiA0MDFcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBuZXh0KHtcclxuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgIGNvZGU6IDQwM1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q291bnRPZlVzZXJzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgYWRtaW5TZXJ2aWNlID0gbmV3IEFkbWluU2VydmljZSgpO1xyXG4gICAgdmFyIHBhcmFtcyA9IHt9O1xyXG4gICAgaWYgKHJlcS51c2VyLmlzQWRtaW4pIHtcclxuICAgICAgYWRtaW5TZXJ2aWNlLmdldENvdW50T2ZVc2VycyhwYXJhbXMsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUkVUUklFVklOR19VU0VSLC8vTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfUkVUUklFVklOR19VU0VSLFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgICAnc3RhdHVzJzogJ3N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAnZGF0YSc6IHJlc3VsdFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgbmV4dCh7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9VTkFVVEhPUklaRURfVVNFUixcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9VTkFVVEhPUklaRURfVVNFUixcclxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgY29kZTogNDAxXHJcbiAgICAgICAgfVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNDAzXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDYW5kaWRhdGVEZXRhaWxzQnlJbml0aWFsKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICBsZXQgYWRtaW5TZXJ2aWNlID0gbmV3IEFkbWluU2VydmljZSgpO1xyXG4gICAgbGV0IGluaXRpYWwgPSByZXEucGFyYW1zLmluaXRpYWw7XHJcblxyXG4gICAgaWYgKHJlcS51c2VyLmlzQWRtaW4pIHtcclxuICAgICAgYWRtaW5TZXJ2aWNlLmdldENhbmRpZGF0ZURldGFpbHMoaW5pdGlhbCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SRVRSSUVWSU5HX1VTRVIsLy9NZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9SRVRSSUVWSU5HX1VTRVIsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XHJcbiAgICAgICAgICAgICdzdGF0dXMnOiAnc3VjY2VzcycsXHJcbiAgICAgICAgICAgICdkYXRhJzogcmVzdWx0XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9VTkFVVEhPUklaRURfVVNFUixcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9VTkFVVEhPUklaRURfVVNFUixcclxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgY29kZTogNDAxXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgbmV4dCh7XHJcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICBjb2RlOiA0MDNcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlY3J1aXRlckRldGFpbHNCeUluaXRpYWwocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIGxldCBhZG1pblNlcnZpY2UgPSBuZXcgQWRtaW5TZXJ2aWNlKCk7XHJcbiAgICBsZXQgaW5pdGlhbCA9IHJlcS5wYXJhbXMuaW5pdGlhbDtcclxuXHJcbiAgICBpZiAocmVxLnVzZXIuaXNBZG1pbikge1xyXG4gICAgICBhZG1pblNlcnZpY2UuZ2V0UmVjcnVpdGVyRGV0YWlscyhpbml0aWFsLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JFVFJJRVZJTkdfVVNFUiwvL01lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1JFVFJJRVZJTkdfVVNFUixcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgICAgJ3N0YXR1cyc6ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgJ2RhdGEnOiByZXN1bHRcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuZXh0KCB7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9VTkFVVEhPUklaRURfVVNFUixcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9VTkFVVEhPUklaRURfVVNFUixcclxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgY29kZTogNDAxXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNDAzXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBleHBvcnRDYW5kaWRhdGVEZXRhaWxzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIHZhciBhZG1pblNlcnZpY2UgPSBuZXcgQWRtaW5TZXJ2aWNlKCk7XHJcbiAgICB2YXIgcGFyYW1zID0ge307XHJcbiAgICBsZXQgdXNlclR5cGUgPSAnY2FuZGlkYXRlJztcclxuICAgIGlmIChyZXEudXNlci5pc0FkbWluKSB7XHJcbiAgICAgIGFkbWluU2VydmljZS5nZXRVc2VyRGV0YWlscyh1c2VyVHlwZSwgKGVycm9yLCByZXNwKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfU0VQRVJBVElOR19VU0VSLC8vTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfU0VQRVJBVElOR19VU0VSLFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYWRtaW5TZXJ2aWNlLmdlbmVyYXRlQ2FuZGlkYXRlRGV0YWlsRmlsZShyZXNwLCAoZXJyLCByZXNwbykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9DUkVBVElOR19FWENFTCwvL01lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9DUkVBVElOR19FWENFTCxcclxuICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgLy92YXIgZmlsZSA9ICcuL3NyYy9zZXJ2ZXIvcHVibGljL2NhbmRpZGF0ZS5jc3YnO1xyXG4gICAgICAgICAgICAgIHZhciBmaWxlID0gJy9ob21lL2JpdG5hbWkvYXBwcy9qb2Jtb3Npcy1zdGFnaW5nL2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy9jYW5kaWRhdGUuY3N2JztcclxuICAgICAgICAgICAgICByZXMuZG93bmxvYWQoZmlsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuZXh0KCB7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9VTkFVVEhPUklaRURfVVNFUixcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9VTkFVVEhPUklaRURfVVNFUixcclxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgY29kZTogNDAxXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNDAzXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBleHBvcnRSZWNydWl0ZXJEZXRhaWxzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIHZhciBhZG1pblNlcnZpY2UgPSBuZXcgQWRtaW5TZXJ2aWNlKCk7XHJcbiAgICB2YXIgcGFyYW1zID0ge307XHJcbiAgICBsZXQgdXNlclR5cGUgPSAncmVjcnVpdGVyJztcclxuICAgIGlmIChyZXEudXNlci5pc0FkbWluKSB7XHJcbiAgICAgIGFkbWluU2VydmljZS5nZXRVc2VyRGV0YWlscyh1c2VyVHlwZSwgKGVycm9yLCByZXNwKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfU0VQRVJBVElOR19VU0VSLC8vTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfU0VQRVJBVElOR19VU0VSLFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYWRtaW5TZXJ2aWNlLmdlbmVyYXRlUmVjcnVpdGVyRGV0YWlsRmlsZShyZXNwLCAoZXJyLCByZXNwbykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9DUkVBVElOR19FWENFTCwvL01lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9DUkVBVElOR19FWENFTCxcclxuICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgLy92YXIgZmlsZSA9ICcuL3NyYy9zZXJ2ZXIvcHVibGljL3JlY3J1aXRlci5jc3YnO1xyXG4gICAgICAgICAgICAgIHZhciBmaWxlID0gJy9ob21lL2JpdG5hbWkvYXBwcy9qb2Jtb3Npcy1zdGFnaW5nL2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy9yZWNydWl0ZXIuY3N2JztcclxuICAgICAgICAgICAgICByZXMuZG93bmxvYWQoZmlsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgbmV4dCh7XHJcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICBjb2RlOiA0MDNcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFVzYWdlRGV0YWlscyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG4gICAgdmFyIGFkbWluU2VydmljZSA9IG5ldyBBZG1pblNlcnZpY2UoKTtcclxuICAgIHZhciBwYXJhbXMgPSB7fTtcclxuICAgIGlmIChyZXEudXNlci5pc0FkbWluKSB7XHJcbiAgICAgIGFkbWluU2VydmljZS5nZXRVc2FnZURldGFpbHMocGFyYW1zLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JFVFJJRVZJTkdfVVNBR0VfREVUQUlMLC8vTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfUkVUUklFVklOR19VU0FHRV9ERVRBSUwsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBhZG1pblNlcnZpY2UuYWRkVXNhZ2VEZXRhaWxzVmFsdWUocmVzdWx0LCAoZXJyb3IsIHJlc3ApID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9BRERJTkdfVVNBR0VfREVUQUlMLC8vTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0FERElOR19VU0FHRV9ERVRBSUwsXHJcbiAgICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGFkbWluU2VydmljZS5nZW5lcmF0ZVVzYWdlRGV0YWlsRmlsZShyZXNwLCAoZXJyLCByZXNwbykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9DUkVBVElOR19FWENFTCwvL01lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfQ1JFQVRJTkdfRVhDRUwsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgLy92YXIgZmlsZSA9ICcuL3NyYy9zZXJ2ZXIvcHVibGljL3VzYWdlZGV0YWlsLmNzdic7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBmaWxlID0gJy9ob21lL2JpdG5hbWkvYXBwcy9qb2Jtb3Npcy1zdGFnaW5nL2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy91c2FnZWRldGFpbC5jc3YnO1xyXG4gICAgICAgICAgICAgICAgICByZXMuZG93bmxvYWQoZmlsZSk7IC8vIFNldCBkaXNwb3NpdGlvbiBhbmQgc2VuZCBpdC5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9VTkFVVEhPUklaRURfVVNFUixcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9VTkFVVEhPUklaRURfVVNFUixcclxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgY29kZTogNDAxXHJcbiAgICAgICAgfVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNDAzXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVEZXRhaWxPZlVzZXIocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciBuZXdVc2VyRGF0YTogVXNlck1vZGVsID0gPFVzZXJNb2RlbD5yZXEuYm9keTtcclxuICAgIHZhciBwYXJhbXMgPSByZXEucXVlcnk7XHJcbiAgICBkZWxldGUgcGFyYW1zLmFjY2Vzc190b2tlbjtcclxuICAgIHZhciB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICB2YXIgX2lkOiBzdHJpbmcgPSB1c2VyLl9pZDtcclxuICAgIHZhciBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICB2YXIgYWRtaW5TZXJ2aWNlID0gbmV3IEFkbWluU2VydmljZSgpO1xyXG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcblxyXG4gICAgYWRtaW5TZXJ2aWNlLnVwZGF0ZVVzZXIobmV3VXNlckRhdGEudXNlcl9pZCwgbmV3VXNlckRhdGEsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHVzZXJTZXJ2aWNlLnJldHJpZXZlKF9pZCwgKGVycm9yLCByZXN1KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dST05HX1RPS0VOLFxyXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwMVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQocmVzdVswXSk7XHJcbiAgICAgICAgICAgIHJlcy5zZW5kKHtcclxuICAgICAgICAgICAgICAnc3RhdHVzJzogJ3N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAgICdkYXRhJzoge1xyXG4gICAgICAgICAgICAgICAgJ3VwZGF0ZVVzZXInOiByZXN1bHQsXHJcbiAgICAgICAgICAgICAgICAnZmlyc3RfbmFtZSc6IHJlc3VbMF0uZmlyc3RfbmFtZSxcclxuICAgICAgICAgICAgICAgICdlbWFpbCc6IHJlc3VbMF0uZW1haWwsXHJcbiAgICAgICAgICAgICAgICAnbW9iaWxlX251bWJlcic6IHJlc3VbMF0ubW9iaWxlX251bWJlcixcclxuICAgICAgICAgICAgICAgICdfaWQnOiByZXN1WzBdLnVzZXJJZCxcclxuICAgICAgICAgICAgICAgICdjdXJyZW50X3RoZW1lJzogcmVzdVswXS5jdXJyZW50X3RoZW1lXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRva2VuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBuZXh0KHtcclxuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgIGNvZGU6IDQwM1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2VuZExvZ2luSW5mb1RvQWRtaW4oZW1haWw6IGFueSwgaXA6IGFueSwgbGF0aXR1ZGU6IGFueSwgbG9uZ2l0dWRlOiBhbnksbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciBwYXJhbXM6IGFueSA9IHtlbWFpbDogdW5kZWZpbmVkLCBpcDogdW5kZWZpbmVkLCBsb2NhdGlvbjogdW5kZWZpbmVkfTtcclxuICAgIHZhciBhZGRyZXNzOiBhbnk7XHJcbiAgICBwYXJhbXMuaXAgPSBpcDtcclxuICAgIHBhcmFtcy5lbWFpbCA9IGVtYWlsO1xyXG4gICAgdmFyIGFkbWluU2VydmljZSA9IG5ldyBBZG1pblNlcnZpY2UoKTtcclxuICAgIHJlcXVlc3QoJ2h0dHA6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2dlb2NvZGUvanNvbj9sYXRsbmc9JyArIGxhdGl0dWRlICsgJywnICsgbG9uZ2l0dWRlICsgJyZzZW5zb3I9dHJ1ZScsIGZ1bmN0aW9uIChlcnJvcjogYW55LCByZXNwb25zZTogYW55LCBib2R5OiBhbnkpIHtcclxuICAgICAgaWYgKCFlcnJvciB8fCByZXNwb25zZS5zdGF0dXNDb2RlID09IDIwMCkge1xyXG4gICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXNDb2RlID09IDIwMCkge1xyXG4gICAgICAgICAgYWRkcmVzcyA9IEpTT04ucGFyc2UoYm9keSkucmVzdWx0c1swXS5mb3JtYXR0ZWRfYWRkcmVzcztcclxuICAgICAgICAgIHBhcmFtcy5sb2NhdGlvbiA9IGFkZHJlc3M7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFkbWluU2VydmljZS5zZW5kQWRtaW5Mb2dpbkluZm9NYWlsKHBhcmFtcywgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgbmV4dCh7XHJcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICBjb2RlOiA0MDNcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=
