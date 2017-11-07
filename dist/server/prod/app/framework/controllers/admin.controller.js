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
function getCountOfUsers(req, res, next) {
    try {
        var adminService = new AdminService();
        var params = {};
        if (req.user.isAdmin) {
            adminService.getCountOfUsers(params, function (error, result) {
                if (error) {
                    next({
                        reason: Messages.MSG_ERROR_RETRIEVING_USERS_COUNT,
                        message: Messages.MSG_ERROR_RETRIEVING_USERS_COUNT,
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
        var userType_1 = 'candidate';
        if (req.user.isAdmin) {
            adminService.exportCandidateCollection(function (err, respo) {
                if (err) {
                    next({
                        reason: Messages.MSG_ERROR_CREATING_EXCEL,
                        message: Messages.MSG_ERROR_CREATING_EXCEL,
                        stackTrace: err,
                        code: 500
                    });
                }
                else {
                    adminService.exportCandidateOtherDetailsCollection(function (err, respo) {
                        if (err) {
                            next({
                                reason: Messages.MSG_ERROR_CREATING_EXCEL,
                                message: Messages.MSG_ERROR_CREATING_EXCEL,
                                stackTrace: err,
                                code: 500
                            });
                        }
                        else {
                            adminService.exportUserCollection(userType_1, function (err, respo) {
                                if (err) {
                                    next({
                                        reason: Messages.MSG_ERROR_CREATING_EXCEL,
                                        message: Messages.MSG_ERROR_CREATING_EXCEL,
                                        stackTrace: err,
                                        code: 500
                                    });
                                }
                                else {
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
            code: 500
        });
    }
}
exports.exportCandidateDetails = exportCandidateDetails;
function exportRecruiterDetails(req, res, next) {
    try {
        var userService = new UserService();
        var adminService = new AdminService();
        var userType_2 = 'recruiter';
        if (req.user.isAdmin) {
            adminService.exportRecruiterCollection(function (err, respo) {
                if (err) {
                    next({
                        reason: Messages.MSG_ERROR_CREATING_EXCEL,
                        message: Messages.MSG_ERROR_CREATING_EXCEL,
                        stackTrace: err,
                        code: 500
                    });
                }
                else {
                    adminService.exportUserCollection(userType_2, function (err, respo) {
                        if (err) {
                            next({
                                reason: Messages.MSG_ERROR_CREATING_EXCEL,
                                message: Messages.MSG_ERROR_CREATING_EXCEL,
                                stackTrace: err,
                                code: 500
                            });
                        }
                        else {
                            res.status(200).send({
                                'status': 'success'
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
            code: 500
        });
    }
}
exports.exportRecruiterDetails = exportRecruiterDetails;
function exportUsageDetails(req, res, next) {
    try {
        var adminService = new AdminService();
        if (req.user.isAdmin) {
            adminService.exportUsageDetailsCollection(function (error, result) {
                if (error) {
                    next({
                        reason: Messages.MSG_ERROR_RETRIEVING_USAGE_DETAIL,
                        message: Messages.MSG_ERROR_RETRIEVING_USAGE_DETAIL,
                        stackTrace: error,
                        code: 500
                    });
                }
                else {
                    res.status(200).send({
                        'status': 'success'
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
            code: 500
        });
    }
}
exports.exportUsageDetails = exportUsageDetails;
function exportKeySkills(req, res, next) {
    try {
        var adminService = new AdminService();
        if (req.user.isAdmin) {
            adminService.exportKeySkillsCollection(function (error, result) {
                if (error) {
                    next({
                        reason: Messages.MSG_ERROR_RETRIEVING_KEY_SKILLS,
                        message: Messages.MSG_ERROR_RETRIEVING_KEY_SKILLS,
                        stackTrace: error,
                        code: 500
                    });
                }
                else {
                    res.status(200).send({
                        'status': 'success'
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
            code: 500
        });
    }
}
exports.exportKeySkills = exportKeySkills;
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
            code: 500
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
            code: 500
        });
    }
}
exports.sendLoginInfoToAdmin = sendLoginInfoToAdmin;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvYWRtaW4uY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGlFQUFvRTtBQUNwRSw2Q0FBZ0Q7QUFDaEQsc0RBQXlEO0FBRXpELHdEQUEyRDtBQUUzRCxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFFakMsZ0JBQXVCLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUFTO0lBQzNFLElBQUksQ0FBQztRQUNILElBQUksT0FBTyxHQUF5QixHQUFHLENBQUMsSUFBSSxDQUFDO1FBQzdDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLE9BQU8sQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDO1FBQzdCLE9BQU8sQ0FBQyxLQUFLLEdBQUcsc0JBQXNCLENBQUM7UUFDdkMsT0FBTyxDQUFDLGFBQWEsR0FBRyxVQUFVLENBQUM7UUFDbkMsT0FBTyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDM0IsT0FBTyxDQUFDLFFBQVEsR0FBRyw4REFBOEQsQ0FBQztRQUNsRixJQUFJLFdBQVcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQ3BDLFdBQVcsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07WUFDNUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVixFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssUUFBUSxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQztvQkFDckQsSUFBSSxDQUFDO3dCQUNILE1BQU0sRUFBRSxRQUFRLENBQUMsMkJBQTJCO3dCQUM1QyxPQUFPLEVBQUUsUUFBUSxDQUFDLHdCQUF3Qjt3QkFDMUMsVUFBVSxFQUFFLElBQUksS0FBSyxFQUFFO3dCQUN2QixJQUFJLEVBQUUsR0FBRztxQkFDVixDQUFDLENBQUM7Z0JBQ0wsQ0FBQztnQkFBQyxJQUFJLENBQUMsRUFBRSxD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SUFBSSxLQUFLLEVBQUU7WUFDdkIsSUFBSSxFQUFFLEdBQUc7U0FDVixDQUFDLENBQUM7SUFDTCxDQUFDO0FBQ0gsQ0FBQztBQTVCRCxvREE0QkMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9jb250cm9sbGVycy9hZG1pbi5jb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZXhwcmVzcyBmcm9tIFwiZXhwcmVzc1wiO1xuaW1wb3J0IEF1dGhJbnRlcmNlcHRvciA9IHJlcXVpcmUoJy4uL2ludGVyY2VwdG9yL2F1dGguaW50ZXJjZXB0b3InKTtcbmltcG9ydCBNZXNzYWdlcyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9tZXNzYWdlcycpO1xuaW1wb3J0IFVzZXJTZXJ2aWNlID0gcmVxdWlyZSgnLi4vc2VydmljZXMvdXNlci5zZXJ2aWNlJyk7XG5pbXBvcnQgQ2FuZGlkYXRlU2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL2NhbmRpZGF0ZS5zZXJ2aWNlJyk7XG5pbXBvcnQgQWRtaW5TZXJ2aWNlID0gcmVxdWlyZSgnLi4vc2VydmljZXMvYWRtaW4uc2VydmljZScpO1xuaW1wb3J0IFVzZXJNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvdXNlci5tb2RlbCcpO1xudmFyIHJlcXVlc3QgPSByZXF1aXJlKCdyZXF1ZXN0Jyk7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XG4gIHRyeSB7XG4gICAgdmFyIG5ld1VzZXI6IFVzZXJNb2RlbCA9IDxVc2VyTW9kZWw+cmVxLmJvZHk7XG4gICAgbmV3VXNlci5pc0FkbWluID0gdHJ1ZTtcbiAgICBuZXdVc2VyLmZpcnN0X25hbWUgPSAnQWRtaW4nO1xuICAgIG5ld1VzZXIuZW1haWwgPSAnc3VwcG9ydEBqb2Jtb3Npcy5jb20nO1xuICAgIG5ld1VzZXIubW9iaWxlX251bWJlciA9IDg2Njk2MDE2MTY7XG4gICAgbmV3VXNlci5pc0FjdGl2YXRlZCA9IHRydWU7XG4gICAgbmV3VXNlci5wYXNzd29yZCA9ICckMmEkMTAkNVNCRnQwQnBRUHAvMTVONUozOG5adWgyek1TTDFnYkZtbkVlNHhSTElsdGxRbjU2Yk5jWnEnO1xuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xuICAgIHVzZXJTZXJ2aWNlLmNyZWF0ZVVzZXIobmV3VXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBpZiAoZXJyb3IgPT09IE1lc3NhZ2VzLk1TR19FUlJPUl9DSEVDS19FTUFJTF9QUkVTRU5UKSB7XG4gICAgICAgICAgbmV4dCh7XG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRVhJU1RJTkdfVVNFUixcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQUNDT1VOVCxcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgICAgY29kZTogNDAzXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXJyb3IgPT09IE1lc3NhZ2VzLk1TR19FUlJPUl9DSEVDS19NT0JJTEVfUFJFU0VOVCkge1xuICAgICAgICAgIG5leHQoe1xuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0VYSVNUSU5HX1VTRVIsXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfUkVHSVNUUkFUSU9OX01PQklMRV9OVU1CRVIsXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgICAgIGNvZGU6IDQwM1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5leHQoe1xuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0VYSVNUSU5HX1VTRVIsXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVVNFUl9XSVRIX0VNQUlMX1BSRVNFTlQsXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgICAgIGNvZGU6IDQwM1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xuICAgICAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc3VsdCk7XG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcbiAgICAgICAgICAnc3RhdHVzJzogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXG4gICAgICAgICAgJ2RhdGEnOiB7XG4gICAgICAgICAgICAncmVhc29uJzogTWVzc2FnZXMuTVNHX1NVQ0NFU1NfUkVHSVNUUkFUSU9OLFxuICAgICAgICAgICAgJ2ZpcnN0X25hbWUnOiBuZXdVc2VyLmZpcnN0X25hbWUsXG4gICAgICAgICAgICAnZW1haWwnOiBuZXdVc2VyLmVtYWlsLFxuICAgICAgICAgICAgJ21vYmlsZV9udW1iZXInOiBuZXdVc2VyLm1vYmlsZV9udW1iZXIsXG4gICAgICAgICAgICAnX2lkJzogcmVzdWx0Ll9pZCxcbiAgICAgICAgICAgICdwaWN0dXJlJzogJydcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFjY2Vzc190b2tlbjogdG9rZW5cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBuZXh0KHtcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICBjb2RlOiA0MDNcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q291bnRPZlVzZXJzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xuICB0cnkge1xuICAgIHZhciBhZG1pblNlcnZpY2UgPSBuZXcgQWRtaW5TZXJ2aWNlKCk7XG4gICAgdmFyIHBhcmFtcyA9IHt9O1xuICAgIGlmIChyZXEudXNlci5pc0FkbWluKSB7XG4gICAgICBhZG1pblNlcnZpY2UuZ2V0Q291bnRPZlVzZXJzKHBhcmFtcywgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgbmV4dCh7XG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SRVRSSUVWSU5HX1VTRVJTX0NPVU5ULC8vTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1JFVFJJRVZJTkdfVVNFUlNfQ09VTlQsXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgICAgIGNvZGU6IDQwM1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcbiAgICAgICAgICAgICdzdGF0dXMnOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAnZGF0YSc6IHJlc3VsdFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV4dCh7XG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfVU5BVVRIT1JJWkVEX1VTRVIsXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1VOQVVUSE9SSVpFRF9VU0VSLFxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgIGNvZGU6IDQwMVxuICAgICAgICB9XG4gICAgICApO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIG5leHQoe1xuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgIGNvZGU6IDQwM1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDYW5kaWRhdGVEZXRhaWxzQnlJbml0aWFsKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xuICB0cnkge1xuICAgIGxldCBhZG1pblNlcnZpY2UgPSBuZXcgQWRtaW5TZXJ2aWNlKCk7XG4gICAgbGV0IGluaXRpYWwgPSByZXEucGFyYW1zLmluaXRpYWw7XG5cbiAgICBpZiAocmVxLnVzZXIuaXNBZG1pbikge1xuICAgICAgYWRtaW5TZXJ2aWNlLmdldENhbmRpZGF0ZURldGFpbHMoaW5pdGlhbCwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgbmV4dCh7XG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SRVRSSUVWSU5HX1VTRVIsLy9NZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfUkVUUklFVklOR19VU0VSLFxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgICBjb2RlOiA0MDNcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XG4gICAgICAgICAgICAnc3RhdHVzJzogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgJ2RhdGEnOiByZXN1bHRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5leHQoe1xuICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9VTkFVVEhPUklaRURfVVNFUixcbiAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1VOQVVUSE9SSVpFRF9VU0VSLFxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgY29kZTogNDAxXG4gICAgICB9KTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBuZXh0KHtcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICBjb2RlOiA0MDNcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVjcnVpdGVyRGV0YWlsc0J5SW5pdGlhbChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcbiAgdHJ5IHtcbiAgICBsZXQgYWRtaW5TZXJ2aWNlID0gbmV3IEFkbWluU2VydmljZSgpO1xuICAgIGxldCBpbml0aWFsID0gcmVxLnBhcmFtcy5pbml0aWFsO1xuXG4gICAgaWYgKHJlcS51c2VyLmlzQWRtaW4pIHtcbiAgICAgIGFkbWluU2VydmljZS5nZXRSZWNydWl0ZXJEZXRhaWxzKGluaXRpYWwsIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIG5leHQoe1xuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUkVUUklFVklOR19VU0VSLC8vTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1JFVFJJRVZJTkdfVVNFUixcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgICAgY29kZTogNDAzXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xuICAgICAgICAgICAgJ3N0YXR1cyc6ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICdkYXRhJzogcmVzdWx0XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXh0KHtcbiAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfVU5BVVRIT1JJWkVEX1VTRVIsXG4gICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9VTkFVVEhPUklaRURfVVNFUixcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgIGNvZGU6IDQwMVxuICAgICAgfSk7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgbmV4dCh7XG4gICAgICByZWFzb246IGUubWVzc2FnZSxcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgY29kZTogNDAzXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4cG9ydENhbmRpZGF0ZURldGFpbHMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XG4gIHRyeSB7XG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XG4gICAgdmFyIGFkbWluU2VydmljZSA9IG5ldyBBZG1pblNlcnZpY2UoKTtcbiAgICBsZXQgdXNlclR5cGUgPSAnY2FuZGlkYXRlJztcbiAgICBpZiAocmVxLnVzZXIuaXNBZG1pbikge1xuICAgICAgYWRtaW5TZXJ2aWNlLmV4cG9ydENhbmRpZGF0ZUNvbGxlY3Rpb24oKGVyciwgcmVzcG8pID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIG5leHQoe1xuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfQ1JFQVRJTkdfRVhDRUwsLy9NZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfQ1JFQVRJTkdfRVhDRUwsXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBlcnIsXG4gICAgICAgICAgICBjb2RlOiA1MDBcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhZG1pblNlcnZpY2UuZXhwb3J0Q2FuZGlkYXRlT3RoZXJEZXRhaWxzQ29sbGVjdGlvbigoZXJyLCByZXNwbykgPT4ge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICBuZXh0KHtcbiAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9DUkVBVElOR19FWENFTCwvL01lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfQ1JFQVRJTkdfRVhDRUwsXG4gICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogZXJyLFxuICAgICAgICAgICAgICAgIGNvZGU6IDUwMFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGFkbWluU2VydmljZS5leHBvcnRVc2VyQ29sbGVjdGlvbih1c2VyVHlwZSwgKGVyciwgcmVzcG8pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICBuZXh0KHtcbiAgICAgICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfQ1JFQVRJTkdfRVhDRUwsLy9NZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9DUkVBVElOR19FWENFTCxcbiAgICAgICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogZXJyLFxuICAgICAgICAgICAgICAgICAgICBjb2RlOiA1MDBcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XG4gICAgICAgICAgICAgICAgICAgICdzdGF0dXMnOiAnc3VjY2VzcydcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG5leHQoe1xuICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9VTkFVVEhPUklaRURfVVNFUixcbiAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1VOQVVUSE9SSVpFRF9VU0VSLFxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgY29kZTogNDAxXG4gICAgICB9KTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBuZXh0KHtcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICBjb2RlOiA1MDBcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZXhwb3J0UmVjcnVpdGVyRGV0YWlscyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcbiAgdHJ5IHtcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcbiAgICB2YXIgYWRtaW5TZXJ2aWNlID0gbmV3IEFkbWluU2VydmljZSgpO1xuICAgIGxldCB1c2VyVHlwZSA9ICdyZWNydWl0ZXInO1xuICAgIGlmIChyZXEudXNlci5pc0FkbWluKSB7XG4gICAgICBhZG1pblNlcnZpY2UuZXhwb3J0UmVjcnVpdGVyQ29sbGVjdGlvbigoZXJyLCByZXNwbykgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgbmV4dCh7XG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9DUkVBVElOR19FWENFTCwvL01lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9DUkVBVElOR19FWENFTCxcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IGVycixcbiAgICAgICAgICAgIGNvZGU6IDUwMFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFkbWluU2VydmljZS5leHBvcnRVc2VyQ29sbGVjdGlvbih1c2VyVHlwZSwgKGVyciwgcmVzcG8pID0+IHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgbmV4dCh7XG4gICAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfQ1JFQVRJTkdfRVhDRUwsLy9NZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0NSRUFUSU5HX0VYQ0VMLFxuICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IGVycixcbiAgICAgICAgICAgICAgICBjb2RlOiA1MDBcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XG4gICAgICAgICAgICAgICAgJ3N0YXR1cyc6ICdzdWNjZXNzJ1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5leHQoe1xuICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9VTkFVVEhPUklaRURfVVNFUixcbiAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1VOQVVUSE9SSVpFRF9VU0VSLFxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgY29kZTogNDAxXG4gICAgICB9KTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBuZXh0KHtcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICBjb2RlOiA1MDBcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZXhwb3J0VXNhZ2VEZXRhaWxzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xuICB0cnkge1xuICAgIHZhciBhZG1pblNlcnZpY2UgPSBuZXcgQWRtaW5TZXJ2aWNlKCk7XG4gICAgaWYgKHJlcS51c2VyLmlzQWRtaW4pIHtcbiAgICAgIGFkbWluU2VydmljZS5leHBvcnRVc2FnZURldGFpbHNDb2xsZWN0aW9uKChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIG5leHQoe1xuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUkVUUklFVklOR19VU0FHRV9ERVRBSUwsLy9NZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfUkVUUklFVklOR19VU0FHRV9ERVRBSUwsXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBlcnJvcixcbiAgICAgICAgICAgIGNvZGU6IDUwMFxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcbiAgICAgICAgICAgICdzdGF0dXMnOiAnc3VjY2VzcydcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5leHQoe1xuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1VOQVVUSE9SSVpFRF9VU0VSLFxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9VTkFVVEhPUklaRURfVVNFUixcbiAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgICAgICBjb2RlOiA0MDFcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBuZXh0KHtcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICBjb2RlOiA1MDBcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZXhwb3J0S2V5U2tpbGxzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xuICB0cnkge1xuICAgIHZhciBhZG1pblNlcnZpY2UgPSBuZXcgQWRtaW5TZXJ2aWNlKCk7XG4gICAgaWYgKHJlcS51c2VyLmlzQWRtaW4pIHtcbiAgICAgIGFkbWluU2VydmljZS5leHBvcnRLZXlTa2lsbHNDb2xsZWN0aW9uKChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIG5leHQoe1xuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUkVUUklFVklOR19LRVlfU0tJTExTLFxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1JFVFJJRVZJTkdfS0VZX1NLSUxMUyxcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IGVycm9yLFxuICAgICAgICAgICAgY29kZTogNTAwXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xuICAgICAgICAgICAgJ3N0YXR1cyc6ICdzdWNjZXNzJ1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV4dCh7XG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfVU5BVVRIT1JJWkVEX1VTRVIsXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1VOQVVUSE9SSVpFRF9VU0VSLFxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxuICAgICAgICAgIGNvZGU6IDQwMVxuICAgICAgICB9XG4gICAgICApO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIG5leHQoe1xuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgIGNvZGU6IDUwMFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVEZXRhaWxPZlVzZXIocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XG4gIHRyeSB7XG4gICAgdmFyIG5ld1VzZXJEYXRhOiBVc2VyTW9kZWwgPSA8VXNlck1vZGVsPnJlcS5ib2R5O1xuICAgIHZhciBwYXJhbXMgPSByZXEucXVlcnk7XG4gICAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XG4gICAgdmFyIHVzZXIgPSByZXEudXNlcjtcbiAgICB2YXIgX2lkOiBzdHJpbmcgPSB1c2VyLl9pZDtcbiAgICB2YXIgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xuICAgIHZhciBhZG1pblNlcnZpY2UgPSBuZXcgQWRtaW5TZXJ2aWNlKCk7XG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XG5cbiAgICBhZG1pblNlcnZpY2UudXBkYXRlVXNlcihuZXdVc2VyRGF0YS51c2VyX2lkLCBuZXdVc2VyRGF0YSwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBuZXh0KGVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHVzZXJTZXJ2aWNlLnJldHJpZXZlKF9pZCwgKGVycm9yLCByZXN1KSA9PiB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICBuZXh0KHtcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XUk9OR19UT0tFTixcbiAgICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICAgICAgICAgIGNvZGU6IDQwMVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQocmVzdVswXSk7XG4gICAgICAgICAgICByZXMuc2VuZCh7XG4gICAgICAgICAgICAgICdzdGF0dXMnOiAnc3VjY2VzcycsXG4gICAgICAgICAgICAgICdkYXRhJzoge1xuICAgICAgICAgICAgICAgICd1cGRhdGVVc2VyJzogcmVzdWx0LFxuICAgICAgICAgICAgICAgICdmaXJzdF9uYW1lJzogcmVzdVswXS5maXJzdF9uYW1lLFxuICAgICAgICAgICAgICAgICdlbWFpbCc6IHJlc3VbMF0uZW1haWwsXG4gICAgICAgICAgICAgICAgJ21vYmlsZV9udW1iZXInOiByZXN1WzBdLm1vYmlsZV9udW1iZXIsXG4gICAgICAgICAgICAgICAgJ19pZCc6IHJlc3VbMF0udXNlcklkLFxuICAgICAgICAgICAgICAgICdjdXJyZW50X3RoZW1lJzogcmVzdVswXS5jdXJyZW50X3RoZW1lXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGFjY2Vzc190b2tlbjogdG9rZW5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBuZXh0KHtcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXG4gICAgICBjb2RlOiA1MDBcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VuZExvZ2luSW5mb1RvQWRtaW4oZW1haWw6IGFueSwgaXA6IGFueSwgbGF0aXR1ZGU6IGFueSwgbG9uZ2l0dWRlOiBhbnksIG5leHQ6IGFueSkge1xuICB0cnkge1xuICAgIHZhciBwYXJhbXM6IGFueSA9IHtlbWFpbDogdW5kZWZpbmVkLCBpcDogdW5kZWZpbmVkLCBsb2NhdGlvbjogdW5kZWZpbmVkfTtcbiAgICB2YXIgYWRkcmVzczogYW55O1xuICAgIHBhcmFtcy5pcCA9IGlwO1xuICAgIHBhcmFtcy5lbWFpbCA9IGVtYWlsO1xuICAgIHZhciBhZG1pblNlcnZpY2UgPSBuZXcgQWRtaW5TZXJ2aWNlKCk7XG4gICAgcmVxdWVzdCgnaHR0cDovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvZ2VvY29kZS9qc29uP2xhdGxuZz0nICsgbGF0aXR1ZGUgKyAnLCcgKyBsb25naXR1ZGUgKyAnJnNlbnNvcj10cnVlJywgZnVuY3Rpb24gKGVycm9yOiBhbnksIHJlc3BvbnNlOiBhbnksIGJvZHk6IGFueSkge1xuICAgICAgaWYgKCFlcnJvciB8fCByZXNwb25zZS5zdGF0dXNDb2RlID09IDIwMCkge1xuICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzQ29kZSA9PSAyMDApIHtcbiAgICAgICAgICBhZGRyZXNzID0gSlNPTi5wYXJzZShib2R5KS5yZXN1bHRzWzBdLmZvcm1hdHRlZF9hZGRyZXNzO1xuICAgICAgICAgIHBhcmFtcy5sb2NhdGlvbiA9IGFkZHJlc3M7XG4gICAgICAgIH1cbiAgICAgICAgYWRtaW5TZXJ2aWNlLnNlbmRBZG1pbkxvZ2luSW5mb01haWwocGFyYW1zLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgbmV4dChlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIG5leHQoe1xuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcbiAgICAgIGNvZGU6IDUwMFxuICAgIH0pO1xuICB9XG59XG4iXX0=
