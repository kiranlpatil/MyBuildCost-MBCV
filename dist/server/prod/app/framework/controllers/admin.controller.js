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
                console.log('crt user error', error);
                if (error === Messages.MSG_ERROR_CHECK_EMAIL_PRESENT) {
                    next({
                        reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
                        message: Messages.MSG_ERROR_VERIFY_ACCOUNT,
                        code: 403
                    });
                }
                else if (error === Messages.MSG_ERROR_CHECK_MOBILE_PRESENT) {
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
        res.status(403).send({ 'status': Messages.STATUS_ERROR, 'error_message': e.message });
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
                        code: 403
                    });
                }
                else {
                    adminService.getUserDetails(result, function (error, resp) {
                        if (error) {
                            next({
                                reason: Messages.MSG_ERROR_SEPERATING_USER,
                                message: Messages.MSG_ERROR_SEPERATING_USER,
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
            res.status(401).send({
                'error': {
                    reason: Messages.MSG_ERROR_UNAUTHORIZED_USER,
                    message: Messages.MSG_ERROR_UNAUTHORIZED_USER,
                    code: 401
                }
            });
        }
    }
    catch (e) {
        res.status(403).send({ message: e.message });
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
            res.status(401).send({
                'error': {
                    reason: Messages.MSG_ERROR_UNAUTHORIZED_USER,
                    message: Messages.MSG_ERROR_UNAUTHORIZED_USER,
                    code: 401
                }
            });
        }
    }
    catch (e) {
        res.status(403).send({ message: e.message });
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
            res.status(401).send({
                'error': {
                    reason: Messages.MSG_ERROR_UNAUTHORIZED_USER,
                    message: Messages.MSG_ERROR_UNAUTHORIZED_USER,
                    code: 401
                }
            });
        }
    }
    catch (e) {
        res.status(403).send({ message: e.message });
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
            res.status(401).send({
                'error': {
                    reason: Messages.MSG_ERROR_UNAUTHORIZED_USER,
                    message: Messages.MSG_ERROR_UNAUTHORIZED_USER,
                    code: 401
                }
            });
        }
    }
    catch (e) {
        res.status(403).send({ message: e.message });
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
                        code: 403
                    });
                }
                else {
                    adminService.generateCandidateDetailFile(resp, function (err, respo) {
                        if (err) {
                            next({
                                reason: Messages.MSG_ERROR_CREATING_EXCEL,
                                message: Messages.MSG_ERROR_CREATING_EXCEL,
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
            res.status(401).send({
                'error': {
                    reason: Messages.MSG_ERROR_UNAUTHORIZED_USER,
                    message: Messages.MSG_ERROR_UNAUTHORIZED_USER,
                    code: 401
                }
            });
        }
    }
    catch (e) {
        res.status(403).send({ message: e.message });
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
                        code: 403
                    });
                }
                else {
                    adminService.generateRecruiterDetailFile(resp, function (err, respo) {
                        if (err) {
                            next({
                                reason: Messages.MSG_ERROR_CREATING_EXCEL,
                                message: Messages.MSG_ERROR_CREATING_EXCEL,
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
        res.status(403).send({ message: e.message });
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
                        code: 403
                    });
                }
                else {
                    adminService.addUsageDetailsValue(result, function (error, resp) {
                        if (error) {
                            next({
                                reason: Messages.MSG_ERROR_ADDING_USAGE_DETAIL,
                                message: Messages.MSG_ERROR_ADDING_USAGE_DETAIL,
                                code: 403
                            });
                        }
                        else {
                            adminService.generateUsageDetailFile(resp, function (err, respo) {
                                if (err) {
                                    next({
                                        reason: Messages.MSG_ERROR_CREATING_EXCEL,
                                        message: Messages.MSG_ERROR_CREATING_EXCEL,
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
            res.status(401).send({
                'error': {
                    reason: Messages.MSG_ERROR_UNAUTHORIZED_USER,
                    message: Messages.MSG_ERROR_UNAUTHORIZED_USER,
                    code: 401
                }
            });
        }
    }
    catch (e) {
        res.status(403).send({ message: e.message });
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
        res.status(403).send({ message: e.message });
    }
}
exports.updateDetailOfUser = updateDetailOfUser;
function sendLoginInfoToAdmin(email, ip, latitude, longitude) {
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
                        console.log(error);
                    }
                });
            }
        });
    }
    catch (e) {
        console.log(e);
    }
}
exports.sendLoginInfoToAdmin = sendLoginInfoToAdmin;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvYWRtaW4uY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGlFQUFvRTtBQUNwRSw2Q0FBZ0Q7QUFDaEQsc0RBQXlEO0FBRXpELHdEQUEyRDtBQUUzRCxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFHakMsZ0JBQXVCLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUFTO0lBQzNFLElBQUksQ0FBQztRQUNILElBQUksT0FBTyxHQUF5QixHQUFHLENBQUMsSUFBSSxDQUFDO1FBQzdDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLE9BQU8sQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDO1FBQzdCLE9BQU8sQ0FBQyxLQUFLLEdBQUcsc0JBQXNCLENBQUM7UUFDdkMsT0FBTyxDQUFDLGFBQWEsR0FBRyxVQUFVLENBQUM7UUFDbkMsT0FBTyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDM0IsT0FBTyxDQUFDLFFBQVEsR0FBRyw4REFBOEQsQ0FBQztRQUNsRixJQUFJLFdBQVcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQ3BDLFdBQVcsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07WUFDNUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUVyQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssUUFBUSxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQztvQkFDckQsSUFBSSxDQUFDO3dCQUNILE1BQU0sRUFBRSxRQUFRLENBQUMsMkJBQTJCO3dCQUM1QyxPQUFPLEVBQUUsUUFBUSxDQUFDLHdCQUF3Qjt3QkFDMUMsSUFBSSxFQUFFLEdBQUc7cUJBQ1YsQ0FBQyxDQUFDO2dCQUNMLENBQUM7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QUM7UUFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pCLENBQUM7QUFDSCxDQUFDO0FBdkJELG9EQXVCQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL2NvbnRyb2xsZXJzL2FkbWluLmNvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XHJcbmltcG9ydCBBdXRoSW50ZXJjZXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcmNlcHRvci9hdXRoLmludGVyY2VwdG9yJyk7XHJcbmltcG9ydCBNZXNzYWdlcyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9tZXNzYWdlcycpO1xyXG5pbXBvcnQgVXNlclNlcnZpY2UgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy91c2VyLnNlcnZpY2UnKTtcclxuaW1wb3J0IENhbmRpZGF0ZVNlcnZpY2UgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9jYW5kaWRhdGUuc2VydmljZScpO1xyXG5pbXBvcnQgQWRtaW5TZXJ2aWNlID0gcmVxdWlyZSgnLi4vc2VydmljZXMvYWRtaW4uc2VydmljZScpO1xyXG5pbXBvcnQgVXNlck1vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC91c2VyLm1vZGVsJyk7XHJcbnZhciByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdCcpO1xyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciBuZXdVc2VyOiBVc2VyTW9kZWwgPSA8VXNlck1vZGVsPnJlcS5ib2R5O1xyXG4gICAgbmV3VXNlci5pc0FkbWluID0gdHJ1ZTtcclxuICAgIG5ld1VzZXIuZmlyc3RfbmFtZSA9ICdBZG1pbic7XHJcbiAgICBuZXdVc2VyLmVtYWlsID0gJ3N1cHBvcnRAam9ibW9zaXMuY29tJztcclxuICAgIG5ld1VzZXIubW9iaWxlX251bWJlciA9IDg2Njk2MDE2MTY7XHJcbiAgICBuZXdVc2VyLmlzQWN0aXZhdGVkID0gdHJ1ZTtcclxuICAgIG5ld1VzZXIucGFzc3dvcmQgPSAnJDJhJDEwJDVTQkZ0MEJwUVBwLzE1TjVKMzhuWnVoMnpNU0wxZ2JGbW5FZTR4UkxJbHRsUW41NmJOY1pxJztcclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgdXNlclNlcnZpY2UuY3JlYXRlVXNlcihuZXdVc2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnY3J0IHVzZXIgZXJyb3InLCBlcnJvcik7XHJcblxyXG4gICAgICAgIGlmIChlcnJvciA9PT0gTWVzc2FnZXMuTVNHX0VSUk9SX0NIRUNLX0VNQUlMX1BSRVNFTlQpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRVhJU1RJTkdfVVNFUixcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1ZFUklGWV9BQ0NPVU5ULFxyXG4gICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZXJyb3IgPT09IE1lc3NhZ2VzLk1TR19FUlJPUl9DSEVDS19NT0JJTEVfUFJFU0VOVCkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfUkVHSVNUUkFUSU9OX01PQklMRV9OVU1CRVIsXHJcbiAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRVhJU1RJTkdfVVNFUixcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1VTRVJfV0lUSF9FTUFJTF9QUkVTRU5ULFxyXG4gICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdyZXN1bHQnLCBKU09OLnN0cmluZ2lmeShyZXN1bHQpKTtcclxuICAgICAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc3VsdCk7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgJ3N0YXR1cyc6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgJ2RhdGEnOiB7XHJcbiAgICAgICAgICAgICdyZWFzb24nOiBNZXNzYWdlcy5NU0dfU1VDQ0VTU19SRUdJU1RSQVRJT04sXHJcbiAgICAgICAgICAgICdmaXJzdF9uYW1lJzogbmV3VXNlci5maXJzdF9uYW1lLFxyXG4gICAgICAgICAgICAnZW1haWwnOiBuZXdVc2VyLmVtYWlsLFxyXG4gICAgICAgICAgICAnbW9iaWxlX251bWJlcic6IG5ld1VzZXIubW9iaWxlX251bWJlcixcclxuICAgICAgICAgICAgJ19pZCc6IHJlc3VsdC5faWQsXHJcbiAgICAgICAgICAgICdwaWN0dXJlJzogJydcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRva2VuXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHsnc3RhdHVzJzogTWVzc2FnZXMuU1RBVFVTX0VSUk9SLCAnZXJyb3JfbWVzc2FnZSc6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEFsbFVzZXIocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgdmFyIGFkbWluU2VydmljZSA9IG5ldyBBZG1pblNlcnZpY2UoKTtcclxuICAgIHZhciBwYXJhbXMgPSB7fTtcclxuICAgIGlmIChyZXEudXNlci5pc0FkbWluKSB7XHJcbiAgICAgIHVzZXJTZXJ2aWNlLnJldHJpZXZlQWxsKHBhcmFtcywgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SRVRSSUVWSU5HX1VTRVIsLy9NZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9SRVRSSUVWSU5HX1VTRVIsXHJcbiAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGFkbWluU2VydmljZS5nZXRVc2VyRGV0YWlscyhyZXN1bHQsIChlcnJvciwgcmVzcCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1NFUEVSQVRJTkdfVVNFUiwvL01lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9TRVBFUkFUSU5HX1VTRVIsXHJcbiAgICAgICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XHJcbiAgICAgICAgICAgICAgICAnc3RhdHVzJzogJ3N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAgICAgJ2RhdGEnOiByZXNwXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXMuc3RhdHVzKDQwMSkuc2VuZCh7XHJcbiAgICAgICAgJ2Vycm9yJzoge1xyXG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfVU5BVVRIT1JJWkVEX1VTRVIsXHJcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVU5BVVRIT1JJWkVEX1VTRVIsXHJcbiAgICAgICAgICBjb2RlOiA0MDFcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDb3VudE9mVXNlcnMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciBhZG1pblNlcnZpY2UgPSBuZXcgQWRtaW5TZXJ2aWNlKCk7XHJcbiAgICB2YXIgcGFyYW1zID0ge307XHJcbiAgICBpZiAocmVxLnVzZXIuaXNBZG1pbikge1xyXG4gICAgICBhZG1pblNlcnZpY2UuZ2V0Q291bnRPZlVzZXJzKHBhcmFtcywgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SRVRSSUVWSU5HX1VTRVIsLy9NZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9SRVRSSUVWSU5HX1VTRVIsXHJcbiAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgICAgJ3N0YXR1cyc6ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgJ2RhdGEnOiByZXN1bHRcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXMuc3RhdHVzKDQwMSkuc2VuZCh7XHJcbiAgICAgICAgJ2Vycm9yJzoge1xyXG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfVU5BVVRIT1JJWkVEX1VTRVIsXHJcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVU5BVVRIT1JJWkVEX1VTRVIsXHJcbiAgICAgICAgICBjb2RlOiA0MDFcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDYW5kaWRhdGVEZXRhaWxzQnlJbml0aWFsKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICBsZXQgYWRtaW5TZXJ2aWNlID0gbmV3IEFkbWluU2VydmljZSgpO1xyXG4gICAgbGV0IGluaXRpYWwgPSByZXEucGFyYW1zLmluaXRpYWw7XHJcblxyXG4gICAgaWYgKHJlcS51c2VyLmlzQWRtaW4pIHtcclxuICAgICAgYWRtaW5TZXJ2aWNlLmdldENhbmRpZGF0ZURldGFpbHMoaW5pdGlhbCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SRVRSSUVWSU5HX1VTRVIsLy9NZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9SRVRSSUVWSU5HX1VTRVIsXHJcbiAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgICAgJ3N0YXR1cyc6ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgJ2RhdGEnOiByZXN1bHRcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXMuc3RhdHVzKDQwMSkuc2VuZCh7XHJcbiAgICAgICAgJ2Vycm9yJzoge1xyXG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfVU5BVVRIT1JJWkVEX1VTRVIsXHJcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVU5BVVRIT1JJWkVEX1VTRVIsXHJcbiAgICAgICAgICBjb2RlOiA0MDFcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRSZWNydWl0ZXJEZXRhaWxzQnlJbml0aWFsKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICBsZXQgYWRtaW5TZXJ2aWNlID0gbmV3IEFkbWluU2VydmljZSgpO1xyXG4gICAgbGV0IGluaXRpYWwgPSByZXEucGFyYW1zLmluaXRpYWw7XHJcblxyXG4gICAgaWYgKHJlcS51c2VyLmlzQWRtaW4pIHtcclxuICAgICAgYWRtaW5TZXJ2aWNlLmdldFJlY3J1aXRlckRldGFpbHMoaW5pdGlhbCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SRVRSSUVWSU5HX1VTRVIsLy9NZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9SRVRSSUVWSU5HX1VTRVIsXHJcbiAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgICAgJ3N0YXR1cyc6ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgJ2RhdGEnOiByZXN1bHRcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXMuc3RhdHVzKDQwMSkuc2VuZCh7XHJcbiAgICAgICAgJ2Vycm9yJzoge1xyXG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfVU5BVVRIT1JJWkVEX1VTRVIsXHJcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVU5BVVRIT1JJWkVEX1VTRVIsXHJcbiAgICAgICAgICBjb2RlOiA0MDFcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBleHBvcnRDYW5kaWRhdGVEZXRhaWxzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIHZhciBhZG1pblNlcnZpY2UgPSBuZXcgQWRtaW5TZXJ2aWNlKCk7XHJcbiAgICB2YXIgcGFyYW1zID0ge307XHJcbiAgICBsZXQgdXNlclR5cGUgPSAnY2FuZGlkYXRlJztcclxuICAgIGlmIChyZXEudXNlci5pc0FkbWluKSB7XHJcbiAgICAgIGFkbWluU2VydmljZS5nZXRVc2VyRGV0YWlscyh1c2VyVHlwZSwgKGVycm9yLCByZXNwKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfU0VQRVJBVElOR19VU0VSLC8vTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfU0VQRVJBVElOR19VU0VSLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBhZG1pblNlcnZpY2UuZ2VuZXJhdGVDYW5kaWRhdGVEZXRhaWxGaWxlKHJlc3AsIChlcnIsIHJlc3BvKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0NSRUFUSU5HX0VYQ0VMLC8vTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0NSRUFUSU5HX0VYQ0VMLFxyXG4gICAgICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgLy92YXIgZmlsZSA9ICcuL3NyYy9zZXJ2ZXIvcHVibGljL2NhbmRpZGF0ZS5jc3YnO1xyXG4gICAgICAgICAgICAgIHZhciBmaWxlID0gJy9ob21lL2JpdG5hbWkvYXBwcy9qb2Jtb3Npcy1zdGFnaW5nL2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy9jYW5kaWRhdGUuY3N2JztcclxuICAgICAgICAgICAgICByZXMuZG93bmxvYWQoZmlsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXMuc3RhdHVzKDQwMSkuc2VuZCh7XHJcbiAgICAgICAgJ2Vycm9yJzoge1xyXG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfVU5BVVRIT1JJWkVEX1VTRVIsXHJcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVU5BVVRIT1JJWkVEX1VTRVIsXHJcbiAgICAgICAgICBjb2RlOiA0MDFcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKHttZXNzYWdlOiBlLm1lc3NhZ2V9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBleHBvcnRSZWNydWl0ZXJEZXRhaWxzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIHZhciBhZG1pblNlcnZpY2UgPSBuZXcgQWRtaW5TZXJ2aWNlKCk7XHJcbiAgICB2YXIgcGFyYW1zID0ge307XHJcbiAgICBsZXQgdXNlclR5cGUgPSAncmVjcnVpdGVyJztcclxuICAgIGlmIChyZXEudXNlci5pc0FkbWluKSB7XHJcbiAgICAgIGFkbWluU2VydmljZS5nZXRVc2VyRGV0YWlscyh1c2VyVHlwZSwgKGVycm9yLCByZXNwKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfU0VQRVJBVElOR19VU0VSLC8vTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfU0VQRVJBVElOR19VU0VSLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBhZG1pblNlcnZpY2UuZ2VuZXJhdGVSZWNydWl0ZXJEZXRhaWxGaWxlKHJlc3AsIChlcnIsIHJlc3BvKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0NSRUFUSU5HX0VYQ0VMLC8vTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0NSRUFUSU5HX0VYQ0VMLFxyXG4gICAgICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgLy92YXIgZmlsZSA9ICcuL3NyYy9zZXJ2ZXIvcHVibGljL3JlY3J1aXRlci5jc3YnO1xyXG4gICAgICAgICAgICAgIHZhciBmaWxlID0gJy9ob21lL2JpdG5hbWkvYXBwcy9qb2Jtb3Npcy1zdGFnaW5nL2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy9yZWNydWl0ZXIuY3N2JztcclxuICAgICAgICAgICAgICByZXMuZG93bmxvYWQoZmlsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFVzYWdlRGV0YWlscyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG4gICAgdmFyIGFkbWluU2VydmljZSA9IG5ldyBBZG1pblNlcnZpY2UoKTtcclxuICAgIHZhciBwYXJhbXMgPSB7fTtcclxuICAgIGlmIChyZXEudXNlci5pc0FkbWluKSB7XHJcbiAgICAgIGFkbWluU2VydmljZS5nZXRVc2FnZURldGFpbHMocGFyYW1zLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JFVFJJRVZJTkdfVVNBR0VfREVUQUlMLC8vTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfUkVUUklFVklOR19VU0FHRV9ERVRBSUwsXHJcbiAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGFkbWluU2VydmljZS5hZGRVc2FnZURldGFpbHNWYWx1ZShyZXN1bHQsIChlcnJvciwgcmVzcCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0FERElOR19VU0FHRV9ERVRBSUwsLy9NZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfQURESU5HX1VTQUdFX0RFVEFJTCxcclxuICAgICAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGFkbWluU2VydmljZS5nZW5lcmF0ZVVzYWdlRGV0YWlsRmlsZShyZXNwLCAoZXJyLCByZXNwbykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9DUkVBVElOR19FWENFTCwvL01lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfQ1JFQVRJTkdfRVhDRUwsXHJcbiAgICAgICAgICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgLy92YXIgZmlsZSA9ICcuL3NyYy9zZXJ2ZXIvcHVibGljL3VzYWdlZGV0YWlsLmNzdic7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBmaWxlID0gJy9ob21lL2JpdG5hbWkvYXBwcy9qb2Jtb3Npcy1zdGFnaW5nL2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy91c2FnZWRldGFpbC5jc3YnO1xyXG4gICAgICAgICAgICAgICAgICByZXMuZG93bmxvYWQoZmlsZSk7IC8vIFNldCBkaXNwb3NpdGlvbiBhbmQgc2VuZCBpdC5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzLnN0YXR1cyg0MDEpLnNlbmQoe1xyXG4gICAgICAgICdlcnJvcic6IHtcclxuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1VOQVVUSE9SSVpFRF9VU0VSLFxyXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1VOQVVUSE9SSVpFRF9VU0VSLFxyXG4gICAgICAgICAgY29kZTogNDAxXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICByZXMuc3RhdHVzKDQwMykuc2VuZCh7bWVzc2FnZTogZS5tZXNzYWdlfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlRGV0YWlsT2ZVc2VyKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgbmV3VXNlckRhdGE6IFVzZXJNb2RlbCA9IDxVc2VyTW9kZWw+cmVxLmJvZHk7XHJcbiAgICB2YXIgcGFyYW1zID0gcmVxLnF1ZXJ5O1xyXG4gICAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XHJcbiAgICB2YXIgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgdmFyIF9pZDogc3RyaW5nID0gdXNlci5faWQ7XHJcbiAgICB2YXIgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgdmFyIGFkbWluU2VydmljZSA9IG5ldyBBZG1pblNlcnZpY2UoKTtcclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG5cclxuICAgIGFkbWluU2VydmljZS51cGRhdGVVc2VyKG5ld1VzZXJEYXRhLnVzZXJfaWQsIG5ld1VzZXJEYXRhLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB1c2VyU2VydmljZS5yZXRyaWV2ZShfaWQsIChlcnJvciwgcmVzdSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XUk9OR19UT0tFTixcclxuICAgICAgICAgICAgICBjb2RlOiA0MDFcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc3VbMF0pO1xyXG4gICAgICAgICAgICByZXMuc2VuZCh7XHJcbiAgICAgICAgICAgICAgJ3N0YXR1cyc6ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgICAnZGF0YSc6IHtcclxuICAgICAgICAgICAgICAgICd1cGRhdGVVc2VyJzogcmVzdWx0LFxyXG4gICAgICAgICAgICAgICAgJ2ZpcnN0X25hbWUnOiByZXN1WzBdLmZpcnN0X25hbWUsXHJcbiAgICAgICAgICAgICAgICAnZW1haWwnOiByZXN1WzBdLmVtYWlsLFxyXG4gICAgICAgICAgICAgICAgJ21vYmlsZV9udW1iZXInOiByZXN1WzBdLm1vYmlsZV9udW1iZXIsXHJcbiAgICAgICAgICAgICAgICAnX2lkJzogcmVzdVswXS51c2VySWQsXHJcbiAgICAgICAgICAgICAgICAnY3VycmVudF90aGVtZSc6IHJlc3VbMF0uY3VycmVudF90aGVtZVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoe21lc3NhZ2U6IGUubWVzc2FnZX0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNlbmRMb2dpbkluZm9Ub0FkbWluKGVtYWlsOiBhbnksIGlwOiBhbnksIGxhdGl0dWRlOiBhbnksIGxvbmdpdHVkZTogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciBwYXJhbXM6IGFueSA9IHtlbWFpbDogdW5kZWZpbmVkLCBpcDogdW5kZWZpbmVkLCBsb2NhdGlvbjogdW5kZWZpbmVkfTtcclxuICAgIHZhciBhZGRyZXNzOiBhbnk7XHJcbiAgICBwYXJhbXMuaXAgPSBpcDtcclxuICAgIHBhcmFtcy5lbWFpbCA9IGVtYWlsO1xyXG4gICAgdmFyIGFkbWluU2VydmljZSA9IG5ldyBBZG1pblNlcnZpY2UoKTtcclxuICAgIHJlcXVlc3QoJ2h0dHA6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2dlb2NvZGUvanNvbj9sYXRsbmc9JyArIGxhdGl0dWRlICsgJywnICsgbG9uZ2l0dWRlICsgJyZzZW5zb3I9dHJ1ZScsIGZ1bmN0aW9uIChlcnJvcjogYW55LCByZXNwb25zZTogYW55LCBib2R5OiBhbnkpIHtcclxuICAgICAgaWYgKCFlcnJvciB8fCByZXNwb25zZS5zdGF0dXNDb2RlID09IDIwMCkge1xyXG4gICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXNDb2RlID09IDIwMCkge1xyXG4gICAgICAgICAgYWRkcmVzcyA9IEpTT04ucGFyc2UoYm9keSkucmVzdWx0c1swXS5mb3JtYXR0ZWRfYWRkcmVzcztcclxuICAgICAgICAgIHBhcmFtcy5sb2NhdGlvbiA9IGFkZHJlc3M7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFkbWluU2VydmljZS5zZW5kQWRtaW5Mb2dpbkluZm9NYWlsKHBhcmFtcywgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gIH1cclxufVxyXG4iXX0=
