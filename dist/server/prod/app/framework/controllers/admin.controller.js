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
        var userType_1 = 'candidate';
        if (req.user.isAdmin) {
            adminService.exportCandidateCollection(function (err, respo) {
                if (err) {
                    next({
                        reason: Messages.MSG_ERROR_CREATING_EXCEL,
                        message: Messages.MSG_ERROR_CREATING_EXCEL,
                        stackTrace: new Error(),
                        code: 403
                    });
                }
                else {
                    adminService.exportCandidateOtherDetailsCollection(function (err, respo) {
                        if (err) {
                            next({
                                reason: Messages.MSG_ERROR_CREATING_EXCEL,
                                message: Messages.MSG_ERROR_CREATING_EXCEL,
                                stackTrace: new Error(),
                                code: 403
                            });
                        }
                        else {
                            adminService.exportUserCollection(userType_1, function (err, respo) {
                                if (err) {
                                    next({
                                        reason: Messages.MSG_ERROR_CREATING_EXCEL,
                                        message: Messages.MSG_ERROR_CREATING_EXCEL,
                                        stackTrace: new Error(),
                                        code: 403
                                    });
                                }
                                else {
                                    console.log("success");
                                    res.status(200).send({
                                        'status': 'success'
                                    });
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
exports.exportCandidateDetails = exportCandidateDetails;
function exportRecruiterDetails(req, res, next) {
    try {
        var userService = new UserService();
        var adminService = new AdminService();
        var params = {};
        var userType_2 = 'recruiter';
        if (req.user.isAdmin) {
            adminService.exportRecruiterCollection(function (err, respo) {
                if (err) {
                    next({
                        reason: Messages.MSG_ERROR_CREATING_EXCEL,
                        message: Messages.MSG_ERROR_CREATING_EXCEL,
                        stackTrace: new Error(),
                        code: 403
                    });
                }
                else {
                    adminService.exportUserCollection(userType_2, function (err, respo) {
                        if (err) {
                            next({
                                reason: Messages.MSG_ERROR_CREATING_EXCEL,
                                message: Messages.MSG_ERROR_CREATING_EXCEL,
                                stackTrace: new Error(),
                                code: 403
                            });
                        }
                        else {
                            console.log("success");
                            res.status(200).send({
                                'status': 'success'
                            });
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvYWRtaW4uY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGlFQUFvRTtBQUNwRSw2Q0FBZ0Q7QUFDaEQsc0RBQXlEO0FBRXpELHdEQUEyRDtBQUUzRCxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFHakMsZ0JBQXVCLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUFTO0lBQzNFLElBQUksQ0FBQztRQUNILElBQUksT0FBTyxHQUF5QixHQUFHLENBQUMsSUFBSSxDQUFDO1FBQzdDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLE9BQU8sQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDO1FBQzdCLE9BQU8sQ0FBQyxLQUFLLEdBQUcsc0JBQXNCLENBQUM7UUFDdkMsT0FBTyxDQUFDLGFBQWEsR0FBRyxVQUFVLENBQUM7UUFDbkMsT0FBTyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDM0IsT0FBTyxDQUFDLFFBQVEsR0FBRyw4REFBOEQsQ0FBQztRQUNsRixJQUFJLFdBQVcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQ3BDLFdBQVcsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07WUFDNUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVixFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssUUFBUSxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQztvQkFDckQsSUFBSSxDQUFDO3dCQUNILE1BQU0sRUFBRSxRQUFRLENBQUMsMkJBQTJCO3dCQUM1QyxPQUFPLEVBQUUsUUFBUSxDQUFDLHdCQUF3Qjt3QkFDMUMsVUFBVSxFQUFFLElBQUksS0FBSyxFQUFFO3dCQUN2QixJQUFJLEVBQUUsR0FBRztxQkFDVixDQUFDLENBQUM7Z0JBQ0wsQ0FBQztnQkFBQyxJQUFJLENBQUMsRUFBRSxD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S0FBSyxFQUFFLE1BQU07b0JBQ3hELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7d0JBQ1YsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNkLENBQUM7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQztZQUNILE1BQU0sRUFBRSxDQUFDLENBQUMsT0FBTztZQUNqQixPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU87WUFDbEIsVUFBVSxFQUFFLElBQUksS0FBSyxFQUFFO1lBQ3ZCLElBQUksRUFBRSxHQUFHO1NBQ1YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztBQUNILENBQUM7QUE1QkQsb0RBNEJDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvYWRtaW4uY29udHJvbGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGV4cHJlc3MgZnJvbSBcImV4cHJlc3NcIjtcclxuaW1wb3J0IEF1dGhJbnRlcmNlcHRvciA9IHJlcXVpcmUoJy4uL2ludGVyY2VwdG9yL2F1dGguaW50ZXJjZXB0b3InKTtcclxuaW1wb3J0IE1lc3NhZ2VzID0gcmVxdWlyZSgnLi4vc2hhcmVkL21lc3NhZ2VzJyk7XHJcbmltcG9ydCBVc2VyU2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL3VzZXIuc2VydmljZScpO1xyXG5pbXBvcnQgQ2FuZGlkYXRlU2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL2NhbmRpZGF0ZS5zZXJ2aWNlJyk7XHJcbmltcG9ydCBBZG1pblNlcnZpY2UgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9hZG1pbi5zZXJ2aWNlJyk7XHJcbmltcG9ydCBVc2VyTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3VzZXIubW9kZWwnKTtcclxudmFyIHJlcXVlc3QgPSByZXF1aXJlKCdyZXF1ZXN0Jyk7XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG4gICAgdmFyIG5ld1VzZXI6IFVzZXJNb2RlbCA9IDxVc2VyTW9kZWw+cmVxLmJvZHk7XHJcbiAgICBuZXdVc2VyLmlzQWRtaW4gPSB0cnVlO1xyXG4gICAgbmV3VXNlci5maXJzdF9uYW1lID0gJ0FkbWluJztcclxuICAgIG5ld1VzZXIuZW1haWwgPSAnc3VwcG9ydEBqb2Jtb3Npcy5jb20nO1xyXG4gICAgbmV3VXNlci5tb2JpbGVfbnVtYmVyID0gODY2OTYwMTYxNjtcclxuICAgIG5ld1VzZXIuaXNBY3RpdmF0ZWQgPSB0cnVlO1xyXG4gICAgbmV3VXNlci5wYXNzd29yZCA9ICckMmEkMTAkNVNCRnQwQnBRUHAvMTVONUozOG5adWgyek1TTDFnYkZtbkVlNHhSTElsdGxRbjU2Yk5jWnEnO1xyXG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICB1c2VyU2VydmljZS5jcmVhdGVVc2VyKG5ld1VzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGlmIChlcnJvciA9PT0gTWVzc2FnZXMuTVNHX0VSUk9SX0NIRUNLX0VNQUlMX1BSRVNFTlQpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRVhJU1RJTkdfVVNFUixcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1ZFUklGWV9BQ0NPVU5ULFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKGVycm9yID09PSBNZXNzYWdlcy5NU0dfRVJST1JfQ0hFQ0tfTU9CSUxFX1BSRVNFTlQpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRVhJU1RJTkdfVVNFUixcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTl9NT0JJTEVfTlVNQkVSLFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVVNFUl9XSVRIX0VNQUlMX1BSRVNFTlQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdyZXN1bHQnLCBKU09OLnN0cmluZ2lmeShyZXN1bHQpKTtcclxuICAgICAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc3VsdCk7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgJ3N0YXR1cyc6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgJ2RhdGEnOiB7XHJcbiAgICAgICAgICAgICdyZWFzb24nOiBNZXNzYWdlcy5NU0dfU1VDQ0VTU19SRUdJU1RSQVRJT04sXHJcbiAgICAgICAgICAgICdmaXJzdF9uYW1lJzogbmV3VXNlci5maXJzdF9uYW1lLFxyXG4gICAgICAgICAgICAnZW1haWwnOiBuZXdVc2VyLmVtYWlsLFxyXG4gICAgICAgICAgICAnbW9iaWxlX251bWJlcic6IG5ld1VzZXIubW9iaWxlX251bWJlcixcclxuICAgICAgICAgICAgJ19pZCc6IHJlc3VsdC5faWQsXHJcbiAgICAgICAgICAgICdwaWN0dXJlJzogJydcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRva2VuXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNDAzXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRBbGxVc2VyKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIHZhciBhZG1pblNlcnZpY2UgPSBuZXcgQWRtaW5TZXJ2aWNlKCk7XHJcbiAgICB2YXIgcGFyYW1zID0ge307XHJcbiAgICBpZiAocmVxLnVzZXIuaXNBZG1pbikge1xyXG4gICAgICB1c2VyU2VydmljZS5yZXRyaWV2ZUFsbChwYXJhbXMsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUkVUUklFVklOR19VU0VSLC8vTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfUkVUUklFVklOR19VU0VSLFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYWRtaW5TZXJ2aWNlLmdldFVzZXJEZXRhaWxzKHJlc3VsdCwgKGVycm9yLCByZXNwKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfU0VQRVJBVElOR19VU0VSLC8vTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1NFUEVSQVRJTkdfVVNFUixcclxuICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgICAgICAgJ3N0YXR1cyc6ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgICAgICdkYXRhJzogcmVzcFxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfVU5BVVRIT1JJWkVEX1VTRVIsXHJcbiAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1VOQVVUSE9SSVpFRF9VU0VSLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDQwMVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBuZXh0KHtcclxuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgIGNvZGU6IDQwM1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q291bnRPZlVzZXJzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgYWRtaW5TZXJ2aWNlID0gbmV3IEFkbWluU2VydmljZSgpO1xyXG4gICAgdmFyIHBhcmFtcyA9IHt9O1xyXG4gICAgaWYgKHJlcS51c2VyLmlzQWRtaW4pIHtcclxuICAgICAgYWRtaW5TZXJ2aWNlLmdldENvdW50T2ZVc2VycyhwYXJhbXMsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUkVUUklFVklOR19VU0VSLC8vTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfUkVUUklFVklOR19VU0VSLFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgICAnc3RhdHVzJzogJ3N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAnZGF0YSc6IHJlc3VsdFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfVU5BVVRIT1JJWkVEX1VTRVIsXHJcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVU5BVVRIT1JJWkVEX1VTRVIsXHJcbiAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgIGNvZGU6IDQwMVxyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBuZXh0KHtcclxuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgIGNvZGU6IDQwM1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2FuZGlkYXRlRGV0YWlsc0J5SW5pdGlhbChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG4gICAgbGV0IGFkbWluU2VydmljZSA9IG5ldyBBZG1pblNlcnZpY2UoKTtcclxuICAgIGxldCBpbml0aWFsID0gcmVxLnBhcmFtcy5pbml0aWFsO1xyXG5cclxuICAgIGlmIChyZXEudXNlci5pc0FkbWluKSB7XHJcbiAgICAgIGFkbWluU2VydmljZS5nZXRDYW5kaWRhdGVEZXRhaWxzKGluaXRpYWwsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUkVUUklFVklOR19VU0VSLC8vTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfUkVUUklFVklOR19VU0VSLFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgICAnc3RhdHVzJzogJ3N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAnZGF0YSc6IHJlc3VsdFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1VOQVVUSE9SSVpFRF9VU0VSLFxyXG4gICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9VTkFVVEhPUklaRURfVVNFUixcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDFcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgbmV4dCh7XHJcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICBjb2RlOiA0MDNcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlY3J1aXRlckRldGFpbHNCeUluaXRpYWwocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIGxldCBhZG1pblNlcnZpY2UgPSBuZXcgQWRtaW5TZXJ2aWNlKCk7XHJcbiAgICBsZXQgaW5pdGlhbCA9IHJlcS5wYXJhbXMuaW5pdGlhbDtcclxuXHJcbiAgICBpZiAocmVxLnVzZXIuaXNBZG1pbikge1xyXG4gICAgICBhZG1pblNlcnZpY2UuZ2V0UmVjcnVpdGVyRGV0YWlscyhpbml0aWFsLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JFVFJJRVZJTkdfVVNFUiwvL01lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1JFVFJJRVZJTkdfVVNFUixcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgICAgJ3N0YXR1cyc6ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgJ2RhdGEnOiByZXN1bHRcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9VTkFVVEhPUklaRURfVVNFUixcclxuICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVU5BVVRIT1JJWkVEX1VTRVIsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAxXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNDAzXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBleHBvcnRDYW5kaWRhdGVEZXRhaWxzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIHZhciBhZG1pblNlcnZpY2UgPSBuZXcgQWRtaW5TZXJ2aWNlKCk7XHJcbiAgICB2YXIgcGFyYW1zID0ge307XHJcbiAgICBsZXQgdXNlclR5cGUgPSAnY2FuZGlkYXRlJztcclxuICAgIGlmIChyZXEudXNlci5pc0FkbWluKSB7XHJcbiAgICAgIGFkbWluU2VydmljZS5leHBvcnRDYW5kaWRhdGVDb2xsZWN0aW9uKChlcnIsIHJlc3BvKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0NSRUFUSU5HX0VYQ0VMLC8vTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfQ1JFQVRJTkdfRVhDRUwsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBhZG1pblNlcnZpY2UuZXhwb3J0Q2FuZGlkYXRlT3RoZXJEZXRhaWxzQ29sbGVjdGlvbigoZXJyLCByZXNwbykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9DUkVBVElOR19FWENFTCwvL01lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9DUkVBVElOR19FWENFTCxcclxuICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgYWRtaW5TZXJ2aWNlLmV4cG9ydFVzZXJDb2xsZWN0aW9uKHVzZXJUeXBlLCAoZXJyLCByZXNwbykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9DUkVBVElOR19FWENFTCwvL01lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfQ1JFQVRJTkdfRVhDRUwsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzXCIpO1xyXG4gICAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgJ3N0YXR1cyc6ICdzdWNjZXNzJ1xyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9VTkFVVEhPUklaRURfVVNFUixcclxuICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVU5BVVRIT1JJWkVEX1VTRVIsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAxXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNDAzXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBleHBvcnRSZWNydWl0ZXJEZXRhaWxzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIHZhciBhZG1pblNlcnZpY2UgPSBuZXcgQWRtaW5TZXJ2aWNlKCk7XHJcbiAgICB2YXIgcGFyYW1zID0ge307XHJcbiAgICBsZXQgdXNlclR5cGUgPSAncmVjcnVpdGVyJztcclxuICAgIGlmIChyZXEudXNlci5pc0FkbWluKSB7XHJcbiAgICAgIGFkbWluU2VydmljZS5leHBvcnRSZWNydWl0ZXJDb2xsZWN0aW9uKChlcnIsIHJlc3BvKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0NSRUFUSU5HX0VYQ0VMLC8vTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfQ1JFQVRJTkdfRVhDRUwsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBhZG1pblNlcnZpY2UuZXhwb3J0VXNlckNvbGxlY3Rpb24odXNlclR5cGUsIChlcnIsIHJlc3BvKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0NSRUFUSU5HX0VYQ0VMLC8vTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0NSRUFUSU5HX0VYQ0VMLFxyXG4gICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3NcIik7XHJcbiAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgICAgICAgJ3N0YXR1cyc6ICdzdWNjZXNzJ1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNDAzXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRVc2FnZURldGFpbHMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciBhZG1pblNlcnZpY2UgPSBuZXcgQWRtaW5TZXJ2aWNlKCk7XHJcbiAgICB2YXIgcGFyYW1zID0ge307XHJcbiAgICBpZiAocmVxLnVzZXIuaXNBZG1pbikge1xyXG4gICAgICBhZG1pblNlcnZpY2UuZ2V0VXNhZ2VEZXRhaWxzKHBhcmFtcywgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SRVRSSUVWSU5HX1VTQUdFX0RFVEFJTCwvL01lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1JFVFJJRVZJTkdfVVNBR0VfREVUQUlMLFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYWRtaW5TZXJ2aWNlLmFkZFVzYWdlRGV0YWlsc1ZhbHVlKHJlc3VsdCwgKGVycm9yLCByZXNwKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfQURESU5HX1VTQUdFX0RFVEFJTCwvL01lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9BRERJTkdfVVNBR0VfREVUQUlMLFxyXG4gICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBhZG1pblNlcnZpY2UuZ2VuZXJhdGVVc2FnZURldGFpbEZpbGUocmVzcCwgKGVyciwgcmVzcG8pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfQ1JFQVRJTkdfRVhDRUwsLy9NZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0NSRUFUSU5HX0VYQ0VMLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIC8vdmFyIGZpbGUgPSAnLi9zcmMvc2VydmVyL3B1YmxpYy91c2FnZWRldGFpbC5jc3YnO1xyXG4gICAgICAgICAgICAgICAgICB2YXIgZmlsZSA9ICcvaG9tZS9iaXRuYW1pL2FwcHMvam9ibW9zaXMtc3RhZ2luZy9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvdXNhZ2VkZXRhaWwuY3N2JztcclxuICAgICAgICAgICAgICAgICAgcmVzLmRvd25sb2FkKGZpbGUpOyAvLyBTZXQgZGlzcG9zaXRpb24gYW5kIHNlbmQgaXQuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfVU5BVVRIT1JJWkVEX1VTRVIsXHJcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVU5BVVRIT1JJWkVEX1VTRVIsXHJcbiAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgIGNvZGU6IDQwMVxyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBuZXh0KHtcclxuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgIGNvZGU6IDQwM1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlRGV0YWlsT2ZVc2VyKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgbmV3VXNlckRhdGE6IFVzZXJNb2RlbCA9IDxVc2VyTW9kZWw+cmVxLmJvZHk7XHJcbiAgICB2YXIgcGFyYW1zID0gcmVxLnF1ZXJ5O1xyXG4gICAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XHJcbiAgICB2YXIgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgdmFyIF9pZDogc3RyaW5nID0gdXNlci5faWQ7XHJcbiAgICB2YXIgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgdmFyIGFkbWluU2VydmljZSA9IG5ldyBBZG1pblNlcnZpY2UoKTtcclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG5cclxuICAgIGFkbWluU2VydmljZS51cGRhdGVVc2VyKG5ld1VzZXJEYXRhLnVzZXJfaWQsIG5ld1VzZXJEYXRhLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB1c2VyU2VydmljZS5yZXRyaWV2ZShfaWQsIChlcnJvciwgcmVzdSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XUk9OR19UT0tFTixcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDFcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc3VbMF0pO1xyXG4gICAgICAgICAgICByZXMuc2VuZCh7XHJcbiAgICAgICAgICAgICAgJ3N0YXR1cyc6ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgICAnZGF0YSc6IHtcclxuICAgICAgICAgICAgICAgICd1cGRhdGVVc2VyJzogcmVzdWx0LFxyXG4gICAgICAgICAgICAgICAgJ2ZpcnN0X25hbWUnOiByZXN1WzBdLmZpcnN0X25hbWUsXHJcbiAgICAgICAgICAgICAgICAnZW1haWwnOiByZXN1WzBdLmVtYWlsLFxyXG4gICAgICAgICAgICAgICAgJ21vYmlsZV9udW1iZXInOiByZXN1WzBdLm1vYmlsZV9udW1iZXIsXHJcbiAgICAgICAgICAgICAgICAnX2lkJzogcmVzdVswXS51c2VySWQsXHJcbiAgICAgICAgICAgICAgICAnY3VycmVudF90aGVtZSc6IHJlc3VbMF0uY3VycmVudF90aGVtZVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgbmV4dCh7XHJcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICBjb2RlOiA0MDNcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNlbmRMb2dpbkluZm9Ub0FkbWluKGVtYWlsOiBhbnksIGlwOiBhbnksIGxhdGl0dWRlOiBhbnksIGxvbmdpdHVkZTogYW55LCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG4gICAgdmFyIHBhcmFtczogYW55ID0ge2VtYWlsOiB1bmRlZmluZWQsIGlwOiB1bmRlZmluZWQsIGxvY2F0aW9uOiB1bmRlZmluZWR9O1xyXG4gICAgdmFyIGFkZHJlc3M6IGFueTtcclxuICAgIHBhcmFtcy5pcCA9IGlwO1xyXG4gICAgcGFyYW1zLmVtYWlsID0gZW1haWw7XHJcbiAgICB2YXIgYWRtaW5TZXJ2aWNlID0gbmV3IEFkbWluU2VydmljZSgpO1xyXG4gICAgcmVxdWVzdCgnaHR0cDovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvZ2VvY29kZS9qc29uP2xhdGxuZz0nICsgbGF0aXR1ZGUgKyAnLCcgKyBsb25naXR1ZGUgKyAnJnNlbnNvcj10cnVlJywgZnVuY3Rpb24gKGVycm9yOiBhbnksIHJlc3BvbnNlOiBhbnksIGJvZHk6IGFueSkge1xyXG4gICAgICBpZiAoIWVycm9yIHx8IHJlc3BvbnNlLnN0YXR1c0NvZGUgPT0gMjAwKSB7XHJcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1c0NvZGUgPT0gMjAwKSB7XHJcbiAgICAgICAgICBhZGRyZXNzID0gSlNPTi5wYXJzZShib2R5KS5yZXN1bHRzWzBdLmZvcm1hdHRlZF9hZGRyZXNzO1xyXG4gICAgICAgICAgcGFyYW1zLmxvY2F0aW9uID0gYWRkcmVzcztcclxuICAgICAgICB9XHJcbiAgICAgICAgYWRtaW5TZXJ2aWNlLnNlbmRBZG1pbkxvZ2luSW5mb01haWwocGFyYW1zLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBuZXh0KHtcclxuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgIGNvZGU6IDQwM1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==
