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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvYWRtaW4uY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGlFQUFvRTtBQUNwRSw2Q0FBZ0Q7QUFDaEQsc0RBQXlEO0FBRXpELHdEQUEyRDtBQUUzRCxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFFakMsZ0JBQXVCLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUFTO0lBQzNFLElBQUksQ0FBQztRQUNILElBQUksT0FBTyxHQUF5QixHQUFHLENBQUMsSUFBSSxDQUFDO1FBQzdDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLE9BQU8sQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDO1FBQzdCLE9BQU8sQ0FBQyxLQUFLLEdBQUcsc0JBQXNCLENBQUM7UUFDdkMsT0FBTyxDQUFDLGFBQWEsR0FBRyxVQUFVLENBQUM7UUFDbkMsT0FBTyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDM0IsT0FBTyxDQUFDLFFBQVEsR0FBRyw4REFBOEQsQ0FBQztRQUNsRixJQUFJLFdBQVcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQ3BDLFdBQVcsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07WUFDNUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVixFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssUUFBUSxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQztvQkFDckQsSUFBSSxDQUFDO3dCQUNILE1BQU0sRUFBRSxRQUFRLENBQUMsMkJBQTJCO3dCQUM1QyxPQUFPLEVBQUUsUUFBUSxDQUFDLHdCQUF3Qjt3QkFDMUMsVUFBVSxFQUFFLElBQUksS0FBSyxFQUFFO3dCQUN2QixJQUFJLEVBQUUsR0FBRztxQkFDVixDQUFDLENBQUM7Z0JBQ0wsQ0FBQztnQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLFFBQVEsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUM7b0JBQzdELElBQUksQ0FBQzt3QkFDSCxNQUFNLEVBQUUsUUFBUSxDQUFDLDJCQUEyQjt3QkFDNUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxvQ0FBb0M7d0JBQ3RELFVBQVUsRUFBRSxJQUFJLEtBQUssRUFBRTt3QkFDdkIsSUFBSSxFQUFFLEdBQUc7cUJBQ1YsQ0FBQyxDQUFDO2dCQUNMLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sSUFBSSxDQUFDO3dCQUNILE1BQU0sRUFBRSxRQUFRLENBQUMsMkJBQTJCO3dCQUM1QyxPQUFPLEVBQUUsUUFBUSxDQUFDLGlDQUFpQzt3QkFDbkQsVUFBVSxFQUFFLElBQUksS0FBSyxFQUFFO3dCQUN2QixJQUFJLEVBQUUsR0FBRztxQkFDVixDQUFDLENBQUM7Z0JBQ0wsQ0FBQztZQUNILENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixJQUFJLElBQUksR0FBb0IsSUFBSSxlQUFlLEVBQUUsQ0FBQztnQkFDbEQsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUMzQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztvQkFDbkIsUUFBUSxFQUFFLFFBQVEsQ0FBQyxjQUFjO29CQUNqQyxNQUFNLEVBQUU7d0JBQ04sUUFBUSxFQUFFLFFBQVEsQ0FBQyx3QkFBd0I7d0JBQzNDLFlBQVksRUFBRSxPQUFPLENBQUMsVUFBVTt3QkFDaEMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxLQUFLO3dCQUN0QixlQUFlLEVBQUUsT0FBTyxDQUFDLGFBQWE7d0JBQ3RDLEtBQUssRUFBRSxNQUFNLENBQUMsR0FBRzt3QkFDakIsU0FBUyxFQUFFLEVBQUU7cUJBQ2Q7b0JBQ0QsWUFBWSxFQUFFLEtBQUs7aUJBQ3BCLENBQUMsQ0FBQztZQUNMLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDO1lBQ0gsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPO1lBQ2pCLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTztZQUNsQixVQUFVLEVBQUUsSUFBSSxLQUFLLEVBQUU7WUFDdkIsSUFBSSxFQUFFLEdBQUc7U0FDVixDQUFDLENBQUM7SUFDTCxDQUFDO0FBQ0gsQ0FBQztBQTNERCx3QkEyREM7QUFFRCx5QkFBZ0MsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQVM7SUFDcEYsSUFBSSxDQUFDO1FBQ0gsSUFBSSxZQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN0QyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDaEIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLFlBQVksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07Z0JBQ2pELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1YsSUFBSSxDQUFDO3dCQUNILE1BQU0sRUFBRSxRQUFRLENBQUMsZ0NBQWdDO3dCQUNqRCxPQUFPLEVBQUUsUUFBUSxDQUFDLGdDQUFnQzt3QkFDbEQsVUFBVSxFQUFFLElBQUksS0FBSyxFQUFFO3dCQUN2QixJQUFJLEVBQUUsR0FBRztxQkFDVixDQUFDLENBQUM7Z0JBQ0wsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQzt3QkFDbkIsUUFBUSxFQUFFLFNBQVM7d0JBQ25CLE1BQU0sRUFBRSxNQUFNO3FCQUNmLENBQUMsQ0FBQztnQkFDTCxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUM7Z0JBQ0QsTUFBTSxFQUFFLFFBQVEsQ0FBQywyQkFBMkI7Z0JBQzVDLE9BQU8sRUFBRSxRQUFRLENBQUMsMkJBQTJCO2dCQUM3QyxVQUFVLEVBQUUsSUFBSSxLQUFLLEVBQUU7Z0JBQ3ZCLElBQUksRUFBRSxHQUFHO2FBQ1YsQ0FDRixDQUFDO1FBQ0osQ0FBQztJQUNILENBQUM7SUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDO1lBQ0gsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPO1lBQ2pCLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTztZQUNsQixVQUFVLEVBQUUsSUFBSSxLQUFLLEVBQUU7WUFDdkIsSUFBSSxFQUFFLEdBQUc7U0FDVixDQUFDLENBQUM7SUFDTCxDQUFDO0FBQ0gsQ0FBQztBQXJDRCwwQ0FxQ0M7QUFFRCxzQ0FBNkMsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQVM7SUFDakcsSUFBSSxDQUFDO1FBQ0gsSUFBSSxZQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN0QyxJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUVqQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDckIsWUFBWSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxVQUFDLEtBQUssRUFBRSxNQUFNO2dCQUN0RCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNWLElBQUksQ0FBQzt3QkFDSCxNQUFNLEVBQUUsUUFBUSxDQUFDLHlCQUF5Qjt3QkFDMUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyx5QkFBeUI7d0JBQzNDLFVBQVUsRUFBRSxJQUFJLEtBQUssRUFBRTt3QkFDdkIsSUFBSSxFQUFFLEdBQUc7cUJBQ1YsQ0FBQyxDQUFDO2dCQUNMLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7d0JBQ25CLFFBQVEsRUFBRSxTQUFTO3dCQUNuQixNQUFNLEVBQUUsTUFBTTtxQkFDZixDQUFDLENBQUM7Z0JBQ0wsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDO2dCQUNILE1BQU0sRUFBRSxRQUFRLENBQUMsMkJBQTJCO2dCQUM1QyxPQUFPLEVBQUUsUUFBUSxDQUFDLDJCQUEyQjtnQkFDN0MsVUFBVSxFQUFFLElBQUksS0FBSyxFQUFFO2dCQUN2QixJQUFJLEVBQUUsR0FBRzthQUNWLENBQUMsQ0FBQztRQUNMLENBQUM7SUFDSCxDQUFDO0lBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQztZQUNILE1BQU0sRUFBRSxDQUFDLENBQUMsT0FBTztZQUNqQixPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU87WUFDbEIsVUFBVSxFQUFFLElBQUksS0FBSyxFQUFFO1lBQ3ZCLElBQUksRUFBRSxHQUFHO1NBQ1YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztBQUNILENBQUM7QUFyQ0Qsb0VBcUNDO0FBRUQsc0NBQTZDLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUFTO0lBQ2pHLElBQUksQ0FBQztRQUNILElBQUksWUFBWSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDdEMsSUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFFakMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsVUFBQyxLQUFLLEVBQUUsTUFBTTtnQkFDdEQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDVixJQUFJLENBQUM7d0JBQ0gsTUFBTSxFQUFFLFFBQVEsQ0FBQyx5QkFBeUI7d0JBQzFDLE9BQU8sRUFBRSxRQUFRLENBQUMseUJBQXlCO3dCQUMzQyxVQUFVLEVBQUUsSUFBSSxLQUFLLEVBQUU7d0JBQ3ZCLElBQUksRUFBRSxHQUFHO3FCQUNWLENBQUMsQ0FBQztnQkFDTCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO3dCQUNuQixRQUFRLEVBQUUsU0FBUzt3QkFDbkIsTUFBTSxFQUFFLE1BQU07cUJBQ2YsQ0FBQyxDQUFDO2dCQUNMLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQztnQkFDSCxNQUFNLEVBQUUsUUFBUSxDQUFDLDJCQUEyQjtnQkFDNUMsT0FBTyxFQUFFLFFBQVEsQ0FBQywyQkFBMkI7Z0JBQzdDLFVBQVUsRUFBRSxJQUFJLEtBQUssRUFBRTtnQkFDdkIsSUFBSSxFQUFFLEdBQUc7YUFDVixDQUFDLENBQUM7UUFDTCxDQUFDO0lBQ0gsQ0FBQztJQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUM7WUFDSCxNQUFNLEVBQUUsQ0FBQyxDQUFDLE9BQU87WUFDakIsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPO1lBQ2xCLFVBQVUsRUFBRSxJQUFJLEtBQUssRUFBRTtZQUN2QixJQUFJLEVBQUUsR0FBRztTQUNWLENBQUMsQ0FBQztJQUNMLENBQUM7QUFDSCxDQUFDO0FBckNELG9FQXFDQztBQUVELGdDQUF1QyxHQUFvQixFQUFFLEdBQXFCLEVBQUUsSUFBUztJQUMzRixJQUFJLENBQUM7UUFDSCxJQUFJLFdBQVcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQ3BDLElBQUksWUFBWSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDdEMsSUFBSSxVQUFRLEdBQUcsV0FBVyxDQUFDO1FBQzNCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNyQixZQUFZLENBQUMseUJBQXlCLENBQUMsVUFBQyxHQUFHLEVBQUUsS0FBSztnQkFDaEQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDUixJQUFJLENBQUM7d0JBQ0gsTUFBTSxFQUFFLFFBQVEsQ0FBQyx3QkFBd0I7d0JBQ3pDLE9BQU8sRUFBRSxRQUFRLENBQUMsd0JBQXdCO3dCQUMxQyxVQUFVLEVBQUUsR0FBRzt3QkFDZixJQUFJLEVBQUUsR0FBRztxQkFDVixDQUFDLENBQUM7Z0JBQ0wsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixZQUFZLENBQUMscUNBQXFDLENBQUMsVUFBQyxHQUFHLEVBQUUsS0FBSzt3QkFDNUQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs0QkFDUixJQUFJLENBQUM7Z0NBQ0gsTUFBTSxFQUFFLFFBQVEsQ0FBQyx3QkFBd0I7Z0NBQ3pDLE9BQU8sRUFBRSxRQUFRLENBQUMsd0JBQXdCO2dDQUMxQyxVQUFVLEVBQUUsR0FBRztnQ0FDZixJQUFJLEVBQUUsR0FBRzs2QkFDVixDQUFDLENBQUM7d0JBQ0wsQ0FBQzt3QkFBQyxJQUFJLENBQUMsQ0FBQzs0QkFDTixZQUFZLENBQUMsb0JBQW9CLENBQUMsVUFBUSxFQUFFLFVBQUMsR0FBRyxFQUFFLEtBQUs7Z0NBQ3JELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0NBQ1IsSUFBSSxDQUFDO3dDQUNILE1BQU0sRUFBRSxRQUFRLENBQUMsd0JBQXdCO3dDQUN6QyxPQUFPLEVBQUUsUUFBUSxDQUFDLHdCQUF3Qjt3Q0FDMUMsVUFBVSxFQUFFLEdBQUc7d0NBQ2YsSUFBSSxFQUFFLEdBQUc7cUNBQ1YsQ0FBQyxDQUFDO2dDQUNMLENBQUM7Z0NBQUMsSUFBSSxDQUFDLENBQUM7b0NBQ04sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7d0NBQ25CLFFBQVEsRUFBRSxTQUFTO3FDQUNwQixDQUFDLENBQUM7Z0NBQ0wsQ0FBQzs0QkFDSCxDQUFDLENBQUMsQ0FBQzt3QkFDTCxDQUFDO29CQUNILENBQUMsQ0FBQyxDQUFDO2dCQUNMLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFDRCxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksQ0FBQztnQkFDSCxNQUFNLEVBQUUsUUFBUSxDQUFDLDJCQUEyQjtnQkFDNUMsT0FBTyxFQUFFLFFBQVEsQ0FBQywyQkFBMkI7Z0JBQzdDLFVBQVUsRUFBRSxJQUFJLEtBQUssRUFBRTtnQkFDdkIsSUFBSSxFQUFFLEdBQUc7YUFDVixDQUFDLENBQUM7UUFDTCxDQUFDO0lBQ0gsQ0FBQztJQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUM7WUFDSCxNQUFNLEVBQUUsQ0FBQyxDQUFDLE9BQU87WUFDakIsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPO1lBQ2xCLFVBQVUsRUFBRSxJQUFJLEtBQUssRUFBRTtZQUN2QixJQUFJLEVBQUUsR0FBRztTQUNWLENBQUMsQ0FBQztJQUNMLENBQUM7QUFDSCxDQUFDO0FBM0RELHdEQTJEQztBQUVELGdDQUF1QyxHQUFvQixFQUFFLEdBQXFCLEVBQUUsSUFBUztJQUMzRixJQUFJLENBQUM7UUFDSCxJQUFJLFdBQVcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQ3BDLElBQUksWUFBWSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDdEMsSUFBSSxVQUFRLEdBQUcsV0FBVyxDQUFDO1FBQzNCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNyQixZQUFZLENBQUMseUJBQXlCLENBQUMsVUFBQyxHQUFHLEVBQUUsS0FBSztnQkFDaEQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDUixJQUFJLENBQUM7d0JBQ0gsTUFBTSxFQUFFLFFBQVEsQ0FBQyx3QkFBd0I7d0JBQ3pDLE9BQU8sRUFBRSxRQUFRLENBQUMsd0JBQXdCO3dCQUMxQyxVQUFVLEVBQUUsR0FBRzt3QkFDZixJQUFJLEVBQUUsR0FBRztxQkFDVixDQUFDLENBQUM7Z0JBQ0wsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixZQUFZLENBQUMsb0JBQW9CLENBQUMsVUFBUSxFQUFFLFVBQUMsR0FBRyxFQUFFLEtBQUs7d0JBQ3JELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7NEJBQ1IsSUFBSSxDQUFDO2dDQUNILE1BQU0sRUFBRSxRQUFRLENBQUMsd0JBQXdCO2dDQUN6QyxPQUFPLEVBQUUsUUFBUSxDQUFDLHdCQUF3QjtnQ0FDMUMsVUFBVSxFQUFFLEdBQUc7Z0NBQ2YsSUFBSSxFQUFFLEdBQUc7NkJBQ1YsQ0FBQyxDQUFDO3dCQUNMLENBQUM7d0JBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ04sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0NBQ25CLFFBQVEsRUFBRSxTQUFTOzZCQUNwQixDQUFDLENBQUM7d0JBQ0wsQ0FBQztvQkFDSCxDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUM7Z0JBQ0gsTUFBTSxFQUFFLFFBQVEsQ0FBQywyQkFBMkI7Z0JBQzVDLE9BQU8sRUFBRSxRQUFRLENBQUMsMkJBQTJCO2dCQUM3QyxVQUFVLEVBQUUsSUFBSSxLQUFLLEVBQUU7Z0JBQ3ZCLElBQUksRUFBRSxHQUFHO2FBQ1YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUM7SUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDO1lBQ0gsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPO1lBQ2pCLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTztZQUNsQixVQUFVLEVBQUUsSUFBSSxLQUFLLEVBQUU7WUFDdkIsSUFBSSxFQUFFLEdBQUc7U0FDVixDQUFDLENBQUM7SUFDTCxDQUFDO0FBQ0gsQ0FBQztBQS9DRCx3REErQ0M7QUFFRCw0QkFBbUMsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQVM7SUFDdkYsSUFBSSxDQUFDO1FBQ0gsSUFBSSxZQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN0QyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDckIsWUFBWSxDQUFDLDRCQUE0QixDQUFDLFVBQUMsS0FBSyxFQUFFLE1BQU07Z0JBQ3RELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1YsSUFBSSxDQUFDO3dCQUNILE1BQU0sRUFBRSxRQUFRLENBQUMsaUNBQWlDO3dCQUNsRCxPQUFPLEVBQUUsUUFBUSxDQUFDLGlDQUFpQzt3QkFDbkQsVUFBVSxFQUFFLEtBQUs7d0JBQ2pCLElBQUksRUFBRSxHQUFHO3FCQUNWLENBQUMsQ0FBQztnQkFDTCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO3dCQUNuQixRQUFRLEVBQUUsU0FBUztxQkFDcEIsQ0FBQyxDQUFDO2dCQUNMLENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQztnQkFDRCxNQUFNLEVBQUUsUUFBUSxDQUFDLDJCQUEyQjtnQkFDNUMsT0FBTyxFQUFFLFFBQVEsQ0FBQywyQkFBMkI7Z0JBQzdDLFVBQVUsRUFBRSxJQUFJLEtBQUssRUFBRTtnQkFDdkIsSUFBSSxFQUFFLEdBQUc7YUFDVixDQUNGLENBQUM7UUFDSixDQUFDO0lBQ0gsQ0FBQztJQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUM7WUFDSCxNQUFNLEVBQUUsQ0FBQyxDQUFDLE9BQU87WUFDakIsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPO1lBQ2xCLFVBQVUsRUFBRSxJQUFJLEtBQUssRUFBRTtZQUN2QixJQUFJLEVBQUUsR0FBRztTQUNWLENBQUMsQ0FBQztJQUNMLENBQUM7QUFDSCxDQUFDO0FBbkNELGdEQW1DQztBQUVELHlCQUFnQyxHQUFvQixFQUFFLEdBQXFCLEVBQUUsSUFBUztJQUNwRixJQUFJLENBQUM7UUFDSCxJQUFJLFlBQVksR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3RDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNyQixZQUFZLENBQUMseUJBQXlCLENBQUMsVUFBQyxLQUFLLEVBQUUsTUFBTTtnQkFDbkQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDVixJQUFJLENBQUM7d0JBQ0gsTUFBTSxFQUFFLFFBQVEsQ0FBQywrQkFBK0I7d0JBQ2hELE9BQU8sRUFBRSxRQUFRLENBQUMsK0JBQStCO3dCQUNqRCxVQUFVLEVBQUUsS0FBSzt3QkFDakIsSUFBSSxFQUFFLEdBQUc7cUJBQ1YsQ0FBQyxDQUFDO2dCQUNMLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7d0JBQ25CLFFBQVEsRUFBRSxTQUFTO3FCQUNwQixDQUFDLENBQUM7Z0JBQ0wsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDO2dCQUNELE1BQU0sRUFBRSxRQUFRLENBQUMsMkJBQTJCO2dCQUM1QyxPQUFPLEVBQUUsUUFBUSxDQUFDLDJCQUEyQjtnQkFDN0MsVUFBVSxFQUFFLElBQUksS0FBSyxFQUFFO2dCQUN2QixJQUFJLEVBQUUsR0FBRzthQUNWLENBQ0YsQ0FBQztRQUNKLENBQUM7SUFDSCxDQUFDO0lBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQztZQUNILE1BQU0sRUFBRSxDQUFDLENBQUMsT0FBTztZQUNqQixPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU87WUFDbEIsVUFBVSxFQUFFLElBQUksS0FBSyxFQUFFO1lBQ3ZCLElBQUksRUFBRSxHQUFHO1NBQ1YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztBQUNILENBQUM7QUFuQ0QsMENBbUNDO0FBRUQsNEJBQW1DLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUFTO0lBQ3ZGLElBQUksQ0FBQztRQUNILElBQUksV0FBVyxHQUF5QixHQUFHLENBQUMsSUFBSSxDQUFDO1FBQ2pELElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7UUFDdkIsT0FBTyxNQUFNLENBQUMsWUFBWSxDQUFDO1FBQzNCLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDcEIsSUFBSSxHQUFHLEdBQVcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUMzQixJQUFJLElBQUksR0FBb0IsSUFBSSxlQUFlLEVBQUUsQ0FBQztRQUNsRCxJQUFJLFlBQVksR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3RDLElBQUksV0FBVyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7UUFFcEMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxVQUFDLEtBQUssRUFBRSxNQUFNO1lBQ3RFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2QsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLFdBQVcsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLFVBQUMsS0FBSyxFQUFFLElBQUk7b0JBQ3BDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7d0JBQ1YsSUFBSSxDQUFDOzRCQUNILE1BQU0sRUFBRSxRQUFRLENBQUMsaUNBQWlDOzRCQUNsRCxPQUFPLEVBQUUsUUFBUSxDQUFDLHFCQUFxQjs0QkFDdkMsVUFBVSxFQUFFLElBQUksS0FBSyxFQUFFOzRCQUN2QixJQUFJLEVBQUUsR0FBRzt5QkFDVixDQUFDLENBQUM7b0JBQ0wsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDTixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzVDLEdBQUcsQ0FBQyxJQUFJLENBQUM7NEJBQ1AsUUFBUSxFQUFFLFNBQVM7NEJBQ25CLE1BQU0sRUFBRTtnQ0FDTixZQUFZLEVBQUUsTUFBTTtnQ0FDcEIsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVO2dDQUNoQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUs7Z0NBQ3RCLGVBQWUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYTtnQ0FDdEMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNO2dDQUNyQixlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWE7NkJBQ3ZDOzRCQUNELFlBQVksRUFBRSxLQUFLO3lCQUNwQixDQUFDLENBQUM7b0JBQ0wsQ0FBQztnQkFDSCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDO1lBQ0gsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPO1lBQ2pCLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTztZQUNsQixVQUFVLEVBQUUsSUFBSSxLQUFLLEVBQUU7WUFDdkIsSUFBSSxFQUFFLEdBQUc7U0FDVixDQUFDLENBQUM7SUFDTCxDQUFDO0FBQ0gsQ0FBQztBQWpERCxnREFpREM7QUFFRCw4QkFBcUMsS0FBVSxFQUFFLEVBQU8sRUFBRSxRQUFhLEVBQUUsU0FBYyxFQUFFLElBQVM7SUFDaEcsSUFBSSxDQUFDO1FBQ0gsSUFBSSxNQUFNLEdBQVEsRUFBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBQyxDQUFDO1FBQ3pFLElBQUksT0FBWSxDQUFDO1FBQ2pCLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2YsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDckIsSUFBSSxZQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN0QyxPQUFPLENBQUMsMERBQTBELEdBQUcsUUFBUSxHQUFHLEdBQUcsR0FBRyxTQUFTLEdBQUcsY0FBYyxFQUFFLFVBQVUsS0FBVSxFQUFFLFFBQWEsRUFBRSxJQUFTO1lBQzlKLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLFFBQVEsQ0FBQyxVQUFVLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDekMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUMvQixPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUM7b0JBQ3hELE1BQU0sQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO2dCQUM1QixDQUFDO2dCQUNELFlBQVksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLEVBQUUsVUFBQyxLQUFLLEVBQUUsTUFBTTtvQkFDeEQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzt3QkFDVixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ2QsQ0FBQztnQkFDSCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDO1lBQ0gsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPO1lBQ2pCLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTztZQUNsQixVQUFVLEVBQUUsSUFBSSxLQUFLLEVBQUU7WUFDdkIsSUFBSSxFQUFFLEdBQUc7U0FDVixDQUFDLENBQUM7SUFDTCxDQUFDO0FBQ0gsQ0FBQztBQTVCRCxvREE0QkMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9jb250cm9sbGVycy9hZG1pbi5jb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZXhwcmVzcyBmcm9tIFwiZXhwcmVzc1wiO1xyXG5pbXBvcnQgQXV0aEludGVyY2VwdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJjZXB0b3IvYXV0aC5pbnRlcmNlcHRvcicpO1xyXG5pbXBvcnQgTWVzc2FnZXMgPSByZXF1aXJlKCcuLi9zaGFyZWQvbWVzc2FnZXMnKTtcclxuaW1wb3J0IFVzZXJTZXJ2aWNlID0gcmVxdWlyZSgnLi4vc2VydmljZXMvdXNlci5zZXJ2aWNlJyk7XHJcbmltcG9ydCBDYW5kaWRhdGVTZXJ2aWNlID0gcmVxdWlyZSgnLi4vc2VydmljZXMvY2FuZGlkYXRlLnNlcnZpY2UnKTtcclxuaW1wb3J0IEFkbWluU2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL2FkbWluLnNlcnZpY2UnKTtcclxuaW1wb3J0IFVzZXJNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvdXNlci5tb2RlbCcpO1xyXG52YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QnKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciBuZXdVc2VyOiBVc2VyTW9kZWwgPSA8VXNlck1vZGVsPnJlcS5ib2R5O1xyXG4gICAgbmV3VXNlci5pc0FkbWluID0gdHJ1ZTtcclxuICAgIG5ld1VzZXIuZmlyc3RfbmFtZSA9ICdBZG1pbic7XHJcbiAgICBuZXdVc2VyLmVtYWlsID0gJ3N1cHBvcnRAam9ibW9zaXMuY29tJztcclxuICAgIG5ld1VzZXIubW9iaWxlX251bWJlciA9IDg2Njk2MDE2MTY7XHJcbiAgICBuZXdVc2VyLmlzQWN0aXZhdGVkID0gdHJ1ZTtcclxuICAgIG5ld1VzZXIucGFzc3dvcmQgPSAnJDJhJDEwJDVTQkZ0MEJwUVBwLzE1TjVKMzhuWnVoMnpNU0wxZ2JGbW5FZTR4UkxJbHRsUW41NmJOY1pxJztcclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgdXNlclNlcnZpY2UuY3JlYXRlVXNlcihuZXdVc2VyLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBpZiAoZXJyb3IgPT09IE1lc3NhZ2VzLk1TR19FUlJPUl9DSEVDS19FTUFJTF9QUkVTRU5UKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0VYSVNUSU5HX1VTRVIsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQUNDT1VOVCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChlcnJvciA9PT0gTWVzc2FnZXMuTVNHX0VSUk9SX0NIRUNLX01PQklMRV9QUkVTRU5UKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0VYSVNUSU5HX1VTRVIsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT05fTU9CSUxFX05VTUJFUixcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRVhJU1RJTkdfVVNFUixcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1VTRVJfV0lUSF9FTUFJTF9QUkVTRU5ULFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFyIGF1dGg6IEF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgICAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc3VsdCk7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgJ3N0YXR1cyc6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgJ2RhdGEnOiB7XHJcbiAgICAgICAgICAgICdyZWFzb24nOiBNZXNzYWdlcy5NU0dfU1VDQ0VTU19SRUdJU1RSQVRJT04sXHJcbiAgICAgICAgICAgICdmaXJzdF9uYW1lJzogbmV3VXNlci5maXJzdF9uYW1lLFxyXG4gICAgICAgICAgICAnZW1haWwnOiBuZXdVc2VyLmVtYWlsLFxyXG4gICAgICAgICAgICAnbW9iaWxlX251bWJlcic6IG5ld1VzZXIubW9iaWxlX251bWJlcixcclxuICAgICAgICAgICAgJ19pZCc6IHJlc3VsdC5faWQsXHJcbiAgICAgICAgICAgICdwaWN0dXJlJzogJydcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRva2VuXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNDAzXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDb3VudE9mVXNlcnMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciBhZG1pblNlcnZpY2UgPSBuZXcgQWRtaW5TZXJ2aWNlKCk7XHJcbiAgICB2YXIgcGFyYW1zID0ge307XHJcbiAgICBpZiAocmVxLnVzZXIuaXNBZG1pbikge1xyXG4gICAgICBhZG1pblNlcnZpY2UuZ2V0Q291bnRPZlVzZXJzKHBhcmFtcywgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SRVRSSUVWSU5HX1VTRVJTX0NPVU5ULC8vTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfUkVUUklFVklOR19VU0VSU19DT1VOVCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgICAgJ3N0YXR1cyc6ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgJ2RhdGEnOiByZXN1bHRcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1VOQVVUSE9SSVpFRF9VU0VSLFxyXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1VOQVVUSE9SSVpFRF9VU0VSLFxyXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICBjb2RlOiA0MDFcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgbmV4dCh7XHJcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICBjb2RlOiA0MDNcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENhbmRpZGF0ZURldGFpbHNCeUluaXRpYWwocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIGxldCBhZG1pblNlcnZpY2UgPSBuZXcgQWRtaW5TZXJ2aWNlKCk7XHJcbiAgICBsZXQgaW5pdGlhbCA9IHJlcS5wYXJhbXMuaW5pdGlhbDtcclxuXHJcbiAgICBpZiAocmVxLnVzZXIuaXNBZG1pbikge1xyXG4gICAgICBhZG1pblNlcnZpY2UuZ2V0Q2FuZGlkYXRlRGV0YWlscyhpbml0aWFsLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JFVFJJRVZJTkdfVVNFUiwvL01lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1JFVFJJRVZJTkdfVVNFUixcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgICAgJ3N0YXR1cyc6ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgJ2RhdGEnOiByZXN1bHRcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9VTkFVVEhPUklaRURfVVNFUixcclxuICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVU5BVVRIT1JJWkVEX1VTRVIsXHJcbiAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgY29kZTogNDAxXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNDAzXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRSZWNydWl0ZXJEZXRhaWxzQnlJbml0aWFsKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICBsZXQgYWRtaW5TZXJ2aWNlID0gbmV3IEFkbWluU2VydmljZSgpO1xyXG4gICAgbGV0IGluaXRpYWwgPSByZXEucGFyYW1zLmluaXRpYWw7XHJcblxyXG4gICAgaWYgKHJlcS51c2VyLmlzQWRtaW4pIHtcclxuICAgICAgYWRtaW5TZXJ2aWNlLmdldFJlY3J1aXRlckRldGFpbHMoaW5pdGlhbCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SRVRSSUVWSU5HX1VTRVIsLy9NZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9SRVRSSUVWSU5HX1VTRVIsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XHJcbiAgICAgICAgICAgICdzdGF0dXMnOiAnc3VjY2VzcycsXHJcbiAgICAgICAgICAgICdkYXRhJzogcmVzdWx0XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfVU5BVVRIT1JJWkVEX1VTRVIsXHJcbiAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1VOQVVUSE9SSVpFRF9VU0VSLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDQwMVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBuZXh0KHtcclxuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgIGNvZGU6IDQwM1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZXhwb3J0Q2FuZGlkYXRlRGV0YWlscyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG4gICAgdmFyIHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICB2YXIgYWRtaW5TZXJ2aWNlID0gbmV3IEFkbWluU2VydmljZSgpO1xyXG4gICAgbGV0IHVzZXJUeXBlID0gJ2NhbmRpZGF0ZSc7XHJcbiAgICBpZiAocmVxLnVzZXIuaXNBZG1pbikge1xyXG4gICAgICBhZG1pblNlcnZpY2UuZXhwb3J0Q2FuZGlkYXRlQ29sbGVjdGlvbigoZXJyLCByZXNwbykgPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9DUkVBVElOR19FWENFTCwvL01lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0NSRUFUSU5HX0VYQ0VMLFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBlcnIsXHJcbiAgICAgICAgICAgIGNvZGU6IDUwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGFkbWluU2VydmljZS5leHBvcnRDYW5kaWRhdGVPdGhlckRldGFpbHNDb2xsZWN0aW9uKChlcnIsIHJlc3BvKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0NSRUFUSU5HX0VYQ0VMLC8vTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0NSRUFUSU5HX0VYQ0VMLFxyXG4gICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogZXJyLFxyXG4gICAgICAgICAgICAgICAgY29kZTogNTAwXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgYWRtaW5TZXJ2aWNlLmV4cG9ydFVzZXJDb2xsZWN0aW9uKHVzZXJUeXBlLCAoZXJyLCByZXNwbykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9DUkVBVElOR19FWENFTCwvL01lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfQ1JFQVRJTkdfRVhDRUwsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogZXJyLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IDUwMFxyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgICAgICAgICAgICAnc3RhdHVzJzogJ3N1Y2Nlc3MnXHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1VOQVVUSE9SSVpFRF9VU0VSLFxyXG4gICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9VTkFVVEhPUklaRURfVVNFUixcclxuICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICBjb2RlOiA0MDFcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgbmV4dCh7XHJcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICBjb2RlOiA1MDBcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGV4cG9ydFJlY3J1aXRlckRldGFpbHMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgdmFyIGFkbWluU2VydmljZSA9IG5ldyBBZG1pblNlcnZpY2UoKTtcclxuICAgIGxldCB1c2VyVHlwZSA9ICdyZWNydWl0ZXInO1xyXG4gICAgaWYgKHJlcS51c2VyLmlzQWRtaW4pIHtcclxuICAgICAgYWRtaW5TZXJ2aWNlLmV4cG9ydFJlY3J1aXRlckNvbGxlY3Rpb24oKGVyciwgcmVzcG8pID0+IHtcclxuICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfQ1JFQVRJTkdfRVhDRUwsLy9NZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9DUkVBVElOR19FWENFTCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogZXJyLFxyXG4gICAgICAgICAgICBjb2RlOiA1MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBhZG1pblNlcnZpY2UuZXhwb3J0VXNlckNvbGxlY3Rpb24odXNlclR5cGUsIChlcnIsIHJlc3BvKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX0NSRUFUSU5HX0VYQ0VMLC8vTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX0NSRUFUSU5HX0VYQ0VMLFxyXG4gICAgICAgICAgICAgICAgc3RhY2tUcmFjZTogZXJyLFxyXG4gICAgICAgICAgICAgICAgY29kZTogNTAwXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgICAgICAgJ3N0YXR1cyc6ICdzdWNjZXNzJ1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfVU5BVVRIT1JJWkVEX1VTRVIsXHJcbiAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1VOQVVUSE9SSVpFRF9VU0VSLFxyXG4gICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgIGNvZGU6IDQwMVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBuZXh0KHtcclxuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgIGNvZGU6IDUwMFxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZXhwb3J0VXNhZ2VEZXRhaWxzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgYWRtaW5TZXJ2aWNlID0gbmV3IEFkbWluU2VydmljZSgpO1xyXG4gICAgaWYgKHJlcS51c2VyLmlzQWRtaW4pIHtcclxuICAgICAgYWRtaW5TZXJ2aWNlLmV4cG9ydFVzYWdlRGV0YWlsc0NvbGxlY3Rpb24oKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SRVRSSUVWSU5HX1VTQUdFX0RFVEFJTCwvL01lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1JFVFJJRVZJTkdfVVNBR0VfREVUQUlMLFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBlcnJvcixcclxuICAgICAgICAgICAgY29kZTogNTAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgICAnc3RhdHVzJzogJ3N1Y2Nlc3MnXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbmV4dCh7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9VTkFVVEhPUklaRURfVVNFUixcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9VTkFVVEhPUklaRURfVVNFUixcclxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgY29kZTogNDAxXHJcbiAgICAgICAgfVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNTAwXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBleHBvcnRLZXlTa2lsbHMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciBhZG1pblNlcnZpY2UgPSBuZXcgQWRtaW5TZXJ2aWNlKCk7XHJcbiAgICBpZiAocmVxLnVzZXIuaXNBZG1pbikge1xyXG4gICAgICBhZG1pblNlcnZpY2UuZXhwb3J0S2V5U2tpbGxzQ29sbGVjdGlvbigoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JFVFJJRVZJTkdfS0VZX1NLSUxMUyxcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1JFVFJJRVZJTkdfS0VZX1NLSUxMUyxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogZXJyb3IsXHJcbiAgICAgICAgICAgIGNvZGU6IDUwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgICAgJ3N0YXR1cyc6ICdzdWNjZXNzJ1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5leHQoe1xyXG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfVU5BVVRIT1JJWkVEX1VTRVIsXHJcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVU5BVVRIT1JJWkVEX1VTRVIsXHJcbiAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgIGNvZGU6IDQwMVxyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBuZXh0KHtcclxuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgIGNvZGU6IDUwMFxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlRGV0YWlsT2ZVc2VyKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICB2YXIgbmV3VXNlckRhdGE6IFVzZXJNb2RlbCA9IDxVc2VyTW9kZWw+cmVxLmJvZHk7XHJcbiAgICB2YXIgcGFyYW1zID0gcmVxLnF1ZXJ5O1xyXG4gICAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XHJcbiAgICB2YXIgdXNlciA9IHJlcS51c2VyO1xyXG4gICAgdmFyIF9pZDogc3RyaW5nID0gdXNlci5faWQ7XHJcbiAgICB2YXIgYXV0aDogQXV0aEludGVyY2VwdG9yID0gbmV3IEF1dGhJbnRlcmNlcHRvcigpO1xyXG4gICAgdmFyIGFkbWluU2VydmljZSA9IG5ldyBBZG1pblNlcnZpY2UoKTtcclxuICAgIHZhciB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG5cclxuICAgIGFkbWluU2VydmljZS51cGRhdGVVc2VyKG5ld1VzZXJEYXRhLnVzZXJfaWQsIG5ld1VzZXJEYXRhLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB1c2VyU2VydmljZS5yZXRyaWV2ZShfaWQsIChlcnJvciwgcmVzdSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9XUk9OR19UT0tFTixcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDFcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc3VbMF0pO1xyXG4gICAgICAgICAgICByZXMuc2VuZCh7XHJcbiAgICAgICAgICAgICAgJ3N0YXR1cyc6ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgICAnZGF0YSc6IHtcclxuICAgICAgICAgICAgICAgICd1cGRhdGVVc2VyJzogcmVzdWx0LFxyXG4gICAgICAgICAgICAgICAgJ2ZpcnN0X25hbWUnOiByZXN1WzBdLmZpcnN0X25hbWUsXHJcbiAgICAgICAgICAgICAgICAnZW1haWwnOiByZXN1WzBdLmVtYWlsLFxyXG4gICAgICAgICAgICAgICAgJ21vYmlsZV9udW1iZXInOiByZXN1WzBdLm1vYmlsZV9udW1iZXIsXHJcbiAgICAgICAgICAgICAgICAnX2lkJzogcmVzdVswXS51c2VySWQsXHJcbiAgICAgICAgICAgICAgICAnY3VycmVudF90aGVtZSc6IHJlc3VbMF0uY3VycmVudF90aGVtZVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgbmV4dCh7XHJcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICBjb2RlOiA1MDBcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNlbmRMb2dpbkluZm9Ub0FkbWluKGVtYWlsOiBhbnksIGlwOiBhbnksIGxhdGl0dWRlOiBhbnksIGxvbmdpdHVkZTogYW55LCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG4gICAgdmFyIHBhcmFtczogYW55ID0ge2VtYWlsOiB1bmRlZmluZWQsIGlwOiB1bmRlZmluZWQsIGxvY2F0aW9uOiB1bmRlZmluZWR9O1xyXG4gICAgdmFyIGFkZHJlc3M6IGFueTtcclxuICAgIHBhcmFtcy5pcCA9IGlwO1xyXG4gICAgcGFyYW1zLmVtYWlsID0gZW1haWw7XHJcbiAgICB2YXIgYWRtaW5TZXJ2aWNlID0gbmV3IEFkbWluU2VydmljZSgpO1xyXG4gICAgcmVxdWVzdCgnaHR0cDovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvZ2VvY29kZS9qc29uP2xhdGxuZz0nICsgbGF0aXR1ZGUgKyAnLCcgKyBsb25naXR1ZGUgKyAnJnNlbnNvcj10cnVlJywgZnVuY3Rpb24gKGVycm9yOiBhbnksIHJlc3BvbnNlOiBhbnksIGJvZHk6IGFueSkge1xyXG4gICAgICBpZiAoIWVycm9yIHx8IHJlc3BvbnNlLnN0YXR1c0NvZGUgPT0gMjAwKSB7XHJcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1c0NvZGUgPT0gMjAwKSB7XHJcbiAgICAgICAgICBhZGRyZXNzID0gSlNPTi5wYXJzZShib2R5KS5yZXN1bHRzWzBdLmZvcm1hdHRlZF9hZGRyZXNzO1xyXG4gICAgICAgICAgcGFyYW1zLmxvY2F0aW9uID0gYWRkcmVzcztcclxuICAgICAgICB9XHJcbiAgICAgICAgYWRtaW5TZXJ2aWNlLnNlbmRBZG1pbkxvZ2luSW5mb01haWwocGFyYW1zLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIG5leHQoZXJyb3IpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBuZXh0KHtcclxuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgIGNvZGU6IDUwMFxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==
