"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var AuthInterceptor = require("../interceptor/auth.interceptor");
var Messages = require("../shared/messages");
var CandidateService = require("../services/candidate.service");
var RecruiterService = require("../services/recruiter.service");
var CNextMessages = require("../shared/cnext-messages");
var SearchService = require("../search/services/search.service");
var UserService = require("../services/user.service");
var CandidateSearchService = require("../services/candidate-search.service");
function create(req, res, next) {
    try {
        var newUser = req.body;
        var recruiterService = new RecruiterService();
        recruiterService.createUser(newUser, function (error, result) {
            if (error) {
                if (error == Messages.MSG_ERROR_CHECK_EMAIL_PRESENT) {
                    next({
                        reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
                        message: Messages.MSG_ERROR_VERIFY_ACCOUNT,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                else if (error == Messages.MSG_ERROR_CHECK_MOBILE_PRESENT) {
                    next({
                        reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
                        message: Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER,
                        stackTrace: new Error(),
                        code: 400
                    });
                }
                else {
                    next({
                        reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
                        message: Messages.MSG_ERROR_USER_WITH_EMAIL_PRESENT,
                        stackTrace: new Error(),
                        code: 400
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
                        '_id': result.userId,
                        'company_name': result.company_name,
                        'current_theme': result.current_theme,
                        'email': result.email,
                        'isRecruitingForself': result.isRecruitingForself,
                        'mobile_number': result.mobile_number,
                        'isCandidate': result.iscandidate
                    },
                    access_token: token
                });
            }
        });
    }
    catch (e) {
        next({ reason: e.message, message: e.message, stackTrace: new Error(), code: 500 });
    }
}
exports.create = create;
function postJob(req, res, next) {
    try {
        var newJob = req.body;
        var recruiterService = new RecruiterService();
        var userId = req.params.id;
        if (newJob.postedJobs._id !== undefined && newJob.postedJobs._id !== null && newJob.postedJobs._id !== '') {
            var currentDate = Number(new Date());
            var expiringDate = Number(new Date(newJob.postedJobs.expiringDate));
            var daysRemainingForExpiring = Math.round(Number(new Date(expiringDate - currentDate)) / (1000 * 60 * 60 * 24));
            newJob.postedJobs.daysRemainingForExpiring = daysRemainingForExpiring;
            if (daysRemainingForExpiring <= 0) {
                newJob.postedJobs.isJobPostExpired = true;
            }
            else {
                newJob.postedJobs.isJobPostExpired = false;
            }
            recruiterService.updateJob(userId, newJob, function (err, result) {
                if (err) {
                    next({
                        reason: Messages.MSG_ERROR_UPDATE_JOB,
                        message: Messages.MSG_ERROR_UPDATE_JOB,
                        stackTrace: new Error(),
                        actualError: err,
                        code: 403
                    });
                }
                else {
                    res.status(200).send({
                        'status': Messages.STATUS_SUCCESS,
                        'data': result
                    });
                }
            });
        }
        else {
            recruiterService.addJob(userId, newJob, function (err, result) {
                if (err) {
                    next({
                        reason: Messages.MSG_ERROR_CREATE_JOB,
                        message: Messages.MSG_ERROR_CREATE_JOB,
                        stackTrace: new Error(),
                        actualError: err,
                        code: 403
                    });
                }
                else {
                    res.status(200).send({
                        'status': Messages.STATUS_SUCCESS,
                        'data': result
                    });
                }
            });
        }
    }
    catch (e) {
        next({ reason: e.message, message: e.message, stackTrace: new Error(), code: 500 });
    }
}
exports.postJob = postJob;
function updateDetails(req, res, next) {
    try {
        var newRecruiter = req.body;
        var params = req.query;
        delete params.access_token;
        var userId = req.params.id;
        var auth = new AuthInterceptor();
        var recruiterService = new RecruiterService();
        recruiterService.updateDetails(userId, newRecruiter, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                var token = auth.issueTokenWithUid(newRecruiter);
                res.send({
                    'status': 'success',
                    'data': result,
                    access_token: token
                });
            }
        });
    }
    catch (e) {
        next({ reason: e.message, message: e.message, stackTrace: new Error(), code: 500 });
    }
}
exports.updateDetails = updateDetails;
function retrieve(req, res, next) {
    try {
        var recruiterService = new RecruiterService();
        var data = {
            'userId': new mongoose.Types.ObjectId(req.params.id)
        };
        recruiterService.retrieve(data, function (error, result) {
            if (error) {
                next({
                    reason: CNextMessages.PROBLEM_IN_RETRIEVE_JOB_PROFILE,
                    message: CNextMessages.PROBLEM_IN_RETRIEVE_JOB_PROFILE,
                    stackTrace: new Error(),
                    code: 401
                });
            }
            else {
                if (result[0]) {
                    res.status(200).send({
                        'status': Messages.STATUS_SUCCESS,
                        'data': result,
                        'jobCountModel': result[0].jobCountModel
                    });
                }
                else {
                    var currentDate = Number(new Date());
                    var expiringDate = Number(new Date(result[0].postedJobs[0].expiringDate));
                    var daysRemainingForExpiring = Math.round(Number(new Date(expiringDate - currentDate)) / (1000 * 60 * 60 * 24));
                    result[0].postedJobs[0].daysRemainingForExpiring = daysRemainingForExpiring;
                    if (daysRemainingForExpiring <= 0) {
                        result[0].postedJobs[0].isJobPostExpired = true;
                    }
                    else {
                        result[0].postedJobs[0].isJobPostExpired = false;
                    }
                    res.status(200).send({
                        'status': Messages.STATUS_SUCCESS,
                        'data': result
                    });
                }
            }
        });
    }
    catch (e) {
        next({ reason: e.message, message: e.message, stackTrace: new Error(), code: 500 });
    }
}
exports.retrieve = retrieve;
function getFilterList(req, res, next) {
    __dirname = './';
    var filepath = 'recruiter-filter-list.json';
    try {
        res.sendFile(filepath, { root: __dirname });
    }
    catch (e) {
        next({ reason: e.message, message: e.message, stackTrace: new Error(), code: 500 });
    }
}
exports.getFilterList = getFilterList;
function getList(req, res, next) {
    try {
        var data = {
            'jobProfileId': req.params.id,
            'listName': req.params.listName
        };
        var recruiterService = new RecruiterService();
        recruiterService.getCandidateList(data, function (error, response) {
            if (error) {
                next({
                    reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
                    message: Messages.MSG_ERROR_VERIFY_ACCOUNT,
                    stackTrace: new Error(),
                    code: 403
                });
            }
            else {
                res.send({
                    'status': 'success',
                    'data': response,
                });
            }
        });
    }
    catch (e) {
        next({ reason: e.message, message: e.message, stackTrace: new Error(), code: 500 });
    }
}
exports.getList = getList;
function getCompareDetailsOfCandidate(req, res, next) {
    try {
        var searchService = new SearchService();
        var params = req.query;
        var jobId = req.params.jobId;
        var recruiterId = req.params.id;
        var candidateId = JSON.parse(params.candidateId);
        searchService.getMultiCompareResult(candidateId, jobId, recruiterId, false, function (error, result) {
            if (error) {
                next({
                    reason: "Problem in Search Matching Result",
                    message: 'Problem in Search Matching Result',
                    stackTrace: new Error(),
                    code: 401
                });
            }
            else {
                res.send({
                    "status": "success",
                    "data": result,
                });
            }
        });
    }
    catch (e) {
        next({ reason: e.message, message: e.message, stackTrace: new Error(), code: 500 });
    }
}
exports.getCompareDetailsOfCandidate = getCompareDetailsOfCandidate;
function getCandidatesByName(req, res, next) {
    try {
        var userService = new UserService();
        var candidateService = new CandidateService();
        var candidateSearchService_1 = new CandidateSearchService();
        var userName = req.params.searchvalue;
        var query;
        var searchValueArray = userName.split(" ");
        var included = {
            '_id': 1
        };
        if (searchValueArray.length > 1) {
            var exp1 = eval('/^' + searchValueArray[0] + '/i');
            var exp2 = eval('/^' + searchValueArray[1] + '/i');
            var searchString1 = exp1.toString().replace(/'/g, "");
            var searchString2 = exp2.toString().replace(/'/g, "");
            query = {
                'isCandidate': true,
                $or: [{
                        'first_name': { $regex: eval(searchString1) },
                        'last_name': { $regex: eval(searchString2) }
                    }, { 'first_name': { $regex: eval(searchString2) }, 'last_name': { $regex: eval(searchString1) } }]
            };
        }
        else {
            var exp = eval('/^' + searchValueArray[0] + '/i');
            var searchString = exp.toString().replace(/'/g, "");
            query = {
                'isCandidate': true,
                $or: [{ 'first_name': { $regex: eval(searchString) } }, { 'last_name': { $regex: eval(searchString) } }]
            };
        }
        userService.retrieveWithLimit(query, included, function (error, result) {
            if (error) {
                next({
                    reason: 'Problem in Search user details',
                    message: 'Problem in Search user details',
                    stackTrace: new Error(),
                    code: 401
                });
            }
            else {
                var candidateId = new Array(0);
                for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                    var obj = result_1[_i];
                    candidateId.push(obj._id);
                }
                candidateSearchService_1.getCandidateInfo(candidateId, function (error, candidateInfo) {
                    if (error) {
                        next({
                            reason: 'Problem in Search user details',
                            message: 'Problem in Search user details',
                            stackTrace: new Error(),
                            code: 401
                        });
                    }
                    else {
                        var searchArray = candidateSearchService_1.buidResultOnCandidateSearch(candidateInfo);
                        res.send({
                            'status': 'success',
                            'data': searchArray,
                        });
                    }
                });
            }
        });
    }
    catch (e) {
        next({ reason: e.message, message: e.message, stackTrace: new Error(), code: 500 });
    }
}
exports.getCandidatesByName = getCandidatesByName;
function requestToAdvisor(req, res, next) {
    try {
        var recruiterService = new RecruiterService();
        var params = req.body;
        recruiterService.sendMailToAdvisor(params, function (error, result) {
            if (error) {
                next({
                    reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
                    message: Messages.MSG_ERROR_WHILE_CONTACTING,
                    stackTrace: new Error(),
                    code: 403
                });
            }
            else {
                res.status(200).send({
                    "status": Messages.STATUS_SUCCESS,
                    "data": { "message": Messages.MSG_SUCCESS_EMAIL }
                });
            }
        });
    }
    catch (e) {
        next({ reason: e.message, message: e.message, stackTrace: new Error(), code: 500 });
    }
}
exports.requestToAdvisor = requestToAdvisor;
function responseToRecruiter(req, res, next) {
    try {
        var recruiterService = new RecruiterService();
        var user = req.user;
        var params = req.body;
        recruiterService.sendMailToRecruiter(user, params, function (error, result) {
            if (error) {
                next({
                    reason: Messages.MSG_ERROR_RSN_WHILE_CONTACTING,
                    message: Messages.MSG_ERROR_WHILE_CONTACTING,
                    stackTrace: new Error(),
                    code: 403
                });
            }
            else {
                res.status(200).send({
                    "status": Messages.STATUS_SUCCESS,
                    "data": { "message": Messages.MSG_SUCCESS_EMAIL }
                });
            }
        });
    }
    catch (e) {
        next({ reason: e.message, message: e.message, stackTrace: new Error(), code: 500 });
    }
}
exports.responseToRecruiter = responseToRecruiter;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvcmVjcnVpdGVyLmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxtQ0FBcUM7QUFFckMsaUVBQW9FO0FBQ3BFLDZDQUFnRDtBQUNoRCxnRUFBbUU7QUFFbkUsZ0VBQW1FO0FBRW5FLHdEQUEyRDtBQUMzRCxpRUFBb0U7QUFHcEUsc0RBQXlEO0FBQ3pELDZFQUFnRjtBQUdoRixnQkFBdUIsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQVM7SUFDM0UsSUFBSSxDQUFDO1FBRUgsSUFBSSxPQUFPLEdBQW1DLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDdkQsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7UUFLOUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxVQUFDLEtBQUssRUFBRSxNQUFNO1lBQ2pELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLFFBQVEsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLENBQUM7b0JBQ3BELElBQUksQ0FBQzt3QkFDSCxNQUFNLEVBQUUsUUFBUSxDQUFDLDJCQUEyQjt3QkFDNUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyx3QkFBd0I7d0JBQzFDLFVBQVUsRUFBRSxJQUFJLEtBQUssRUFBRTt3QkFDdkIsSUFBSSxFQUFFLEdBQUc7cUJBQ1YsQ0FBQyxDQUFDO2dCQUNMLENBQUM7Z0JBQ0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxRQUFRLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDO29CQUMxRCxJQUFJLENBQUM7d0JBQ0gsTUFBTSxFQUFFLFFBQVEsQ0FBQywyQkFBMkI7d0JBQzVDLE9BQU8sRUFBRSxRQUFRLENBQUMsb0NBQW9DO3dCQUN0RCxVQUFVLEVBQUUsSUFBSSxLQUFLLEVBQUU7d0JBQ3ZCLElBQUksRUFBRSxHQUFHO3FC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Q0FBQyxDQUFDLENBQUM7Z0JBQ1YsSUFBSSxDQUFDO29CQUNILE1BQU0sRUFBRSxRQUFRLENBQUMsOEJBQThCO29CQUMvQyxPQUFPLEVBQUUsUUFBUSxDQUFDLDBCQUEwQjtvQkFDNUMsVUFBVSxFQUFFLElBQUksS0FBSyxFQUFFO29CQUN2QixJQUFJLEVBQUUsR0FBRztpQkFDVixDQUFDLENBQUM7WUFDTCxDQUFDO1lBQ0QsSUFBSSxDQUFDLENBQUM7Z0JBQ0osR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7b0JBQ25CLFFBQVEsRUFBRSxRQUFRLENBQUMsY0FBYztvQkFDakMsTUFBTSxFQUFFLEVBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxpQkFBaUIsRUFBQztpQkFDaEQsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNELEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDVCxJQUFJLENBQUMsRUFBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsSUFBSSxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQztJQUVwRixDQUFDO0FBQ0gsQ0FBQztBQTFCRCxrREEwQkMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9jb250cm9sbGVycy9yZWNydWl0ZXIuY29udHJvbGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGV4cHJlc3MgZnJvbSBcImV4cHJlc3NcIjtcclxuaW1wb3J0ICogYXMgbW9uZ29vc2UgZnJvbSBcIm1vbmdvb3NlXCI7XHJcbmltcG9ydCB7IFJlY3J1aXRlciB9IGZyb20gXCIuLi9kYXRhYWNjZXNzL21vZGVsL3JlY3J1aXRlci1maW5hbC5tb2RlbFwiO1xyXG5pbXBvcnQgQXV0aEludGVyY2VwdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJjZXB0b3IvYXV0aC5pbnRlcmNlcHRvcicpO1xyXG5pbXBvcnQgTWVzc2FnZXMgPSByZXF1aXJlKCcuLi9zaGFyZWQvbWVzc2FnZXMnKTtcclxuaW1wb3J0IENhbmRpZGF0ZVNlcnZpY2UgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9jYW5kaWRhdGUuc2VydmljZScpO1xyXG5pbXBvcnQgUmVjcnVpdGVyTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3JlY3J1aXRlci5tb2RlbCcpO1xyXG5pbXBvcnQgUmVjcnVpdGVyU2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL3JlY3J1aXRlci5zZXJ2aWNlJyk7XHJcbmltcG9ydCBKb2JQcm9maWxlTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL2pvYnByb2ZpbGUubW9kZWwnKTtcclxuaW1wb3J0IENOZXh0TWVzc2FnZXMgPSByZXF1aXJlKCcuLi9zaGFyZWQvY25leHQtbWVzc2FnZXMnKTtcclxuaW1wb3J0IFNlYXJjaFNlcnZpY2UgPSByZXF1aXJlKFwiLi4vc2VhcmNoL3NlcnZpY2VzL3NlYXJjaC5zZXJ2aWNlXCIpO1xyXG5pbXBvcnQgQ2FuZGlkYXRlSW5mb1NlYXJjaCA9IHJlcXVpcmUoXCIuLi9kYXRhYWNjZXNzL21vZGVsL2NhbmRpZGF0ZS1pbmZvLXNlYXJjaFwiKTtcclxuaW1wb3J0IENhbmRpZGF0ZU1vZGVsID0gcmVxdWlyZShcIi4uL2RhdGFhY2Nlc3MvbW9kZWwvY2FuZGlkYXRlLm1vZGVsXCIpO1xyXG5pbXBvcnQgVXNlclNlcnZpY2UgPSByZXF1aXJlKFwiLi4vc2VydmljZXMvdXNlci5zZXJ2aWNlXCIpO1xyXG5pbXBvcnQgQ2FuZGlkYXRlU2VhcmNoU2VydmljZSA9IHJlcXVpcmUoXCIuLi9zZXJ2aWNlcy9jYW5kaWRhdGUtc2VhcmNoLnNlcnZpY2VcIik7XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG5cclxuICAgIHZhciBuZXdVc2VyOiBSZWNydWl0ZXJNb2RlbCA9IDxSZWNydWl0ZXJNb2RlbD5yZXEuYm9keTtcclxuICAgIHZhciByZWNydWl0ZXJTZXJ2aWNlID0gbmV3IFJlY3J1aXRlclNlcnZpY2UoKTtcclxuLypcclxuICAgIGxldCBtYWlsQ2hpbXBNYWlsZXJTZXJ2aWNlID0gbmV3IE1haWxDaGltcE1haWxlclNlcnZpY2UoKTtcclxuKi9cclxuXHJcbiAgICByZWNydWl0ZXJTZXJ2aWNlLmNyZWF0ZVVzZXIobmV3VXNlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgaWYgKGVycm9yID09IE1lc3NhZ2VzLk1TR19FUlJPUl9DSEVDS19FTUFJTF9QUkVTRU5UKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0VYSVNUSU5HX1VTRVIsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQUNDT1VOVCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGVycm9yID09IE1lc3NhZ2VzLk1TR19FUlJPUl9DSEVDS19NT0JJTEVfUFJFU0VOVCkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfUkVHSVNUUkFUSU9OX01PQklMRV9OVU1CRVIsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRVhJU1RJTkdfVVNFUixcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1VTRVJfV0lUSF9FTUFJTF9QUkVTRU5ULFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIGF1dGg6IEF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgICAgICB2YXIgdG9rZW4gPSBhdXRoLmlzc3VlVG9rZW5XaXRoVWlkKHJlc3VsdCk7XHJcbi8qXHJcbiAgICAgICAgbWFpbENoaW1wTWFpbGVyU2VydmljZS5vblJlY3J1aXRlclNpZ25VcFN1Y2Nlc3MobmV3VXNlcik7XHJcbiovXHJcblxyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgICdzdGF0dXMnOiBNZXNzYWdlcy5TVEFUVVNfU1VDQ0VTUyxcclxuICAgICAgICAgICdkYXRhJzoge1xyXG4gICAgICAgICAgICAncmVhc29uJzogTWVzc2FnZXMuTVNHX1NVQ0NFU1NfUkVHSVNUUkFUSU9OLFxyXG4gICAgICAgICAgICAnX2lkJzogcmVzdWx0LnVzZXJJZCxcclxuICAgICAgICAgICAgJ2NvbXBhbnlfbmFtZSc6IHJlc3VsdC5jb21wYW55X25hbWUsXHJcbiAgICAgICAgICAgICdjdXJyZW50X3RoZW1lJzogcmVzdWx0LmN1cnJlbnRfdGhlbWUsXHJcbiAgICAgICAgICAgICdlbWFpbCc6IHJlc3VsdC5lbWFpbCxcclxuICAgICAgICAgICAgJ2lzUmVjcnVpdGluZ0ZvcnNlbGYnOiByZXN1bHQuaXNSZWNydWl0aW5nRm9yc2VsZixcclxuICAgICAgICAgICAgJ21vYmlsZV9udW1iZXInOiByZXN1bHQubW9iaWxlX251bWJlcixcclxuICAgICAgICAgICAgJ2lzQ2FuZGlkYXRlJzogcmVzdWx0LmlzY2FuZGlkYXRlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe3JlYXNvbjogZS5tZXNzYWdlLCBtZXNzYWdlOiBlLm1lc3NhZ2UsIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLCBjb2RlOiA1MDB9KTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcG9zdEpvYihyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG4gICAgdmFyIG5ld0pvYjogSm9iUHJvZmlsZU1vZGVsID0gPEpvYlByb2ZpbGVNb2RlbD5yZXEuYm9keTtcclxuICAgIHZhciByZWNydWl0ZXJTZXJ2aWNlID0gbmV3IFJlY3J1aXRlclNlcnZpY2UoKTtcclxuICAgIHZhciB1c2VySWQgPSByZXEucGFyYW1zLmlkO1xyXG4gICAgaWYgKG5ld0pvYi5wb3N0ZWRKb2JzLl9pZCAhPT0gdW5kZWZpbmVkICYmIG5ld0pvYi5wb3N0ZWRKb2JzLl9pZCAhPT0gbnVsbCAmJiBuZXdKb2IucG9zdGVkSm9icy5faWQgIT09ICcnKSB7XHJcblxyXG4gICAgICBsZXQgY3VycmVudERhdGUgPSBOdW1iZXIobmV3IERhdGUoKSk7XHJcbiAgICAgIGxldCBleHBpcmluZ0RhdGUgPSBOdW1iZXIobmV3IERhdGUobmV3Sm9iLnBvc3RlZEpvYnMuZXhwaXJpbmdEYXRlKSk7XHJcbiAgICAgIGxldCBkYXlzUmVtYWluaW5nRm9yRXhwaXJpbmcgPSBNYXRoLnJvdW5kKE51bWJlcihuZXcgRGF0ZShleHBpcmluZ0RhdGUgLSBjdXJyZW50RGF0ZSkpIC8gKDEwMDAgKiA2MCAqIDYwICogMjQpKTtcclxuICAgICAgbmV3Sm9iLnBvc3RlZEpvYnMuZGF5c1JlbWFpbmluZ0ZvckV4cGlyaW5nID0gZGF5c1JlbWFpbmluZ0ZvckV4cGlyaW5nO1xyXG4gICAgICBpZiAoZGF5c1JlbWFpbmluZ0ZvckV4cGlyaW5nIDw9IDApIHtcclxuICAgICAgICBuZXdKb2IucG9zdGVkSm9icy5pc0pvYlBvc3RFeHBpcmVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbmV3Sm9iLnBvc3RlZEpvYnMuaXNKb2JQb3N0RXhwaXJlZCA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAgIHJlY3J1aXRlclNlcnZpY2UudXBkYXRlSm9iKHVzZXJJZCwgbmV3Sm9iLCAoZXJyLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfVVBEQVRFX0pPQixcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1VQREFURV9KT0IsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBhY3R1YWxFcnJvcjogZXJyLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XHJcbiAgICAgICAgICAgICdzdGF0dXMnOiBNZXNzYWdlcy5TVEFUVVNfU1VDQ0VTUyxcclxuICAgICAgICAgICAgJ2RhdGEnOiByZXN1bHRcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgcmVjcnVpdGVyU2VydmljZS5hZGRKb2IodXNlcklkLCBuZXdKb2IsIChlcnIsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9DUkVBVEVfSk9CLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfQ1JFQVRFX0pPQixcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGFjdHVhbEVycm9yOiBlcnIsXHJcbiAgICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgICAgJ3N0YXR1cyc6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgICAnZGF0YSc6IHJlc3VsdFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICBuZXh0KHtyZWFzb246IGUubWVzc2FnZSwgbWVzc2FnZTogZS5tZXNzYWdlLCBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSwgY29kZTogNTAwfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlRGV0YWlscyhyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG4gICAgdmFyIG5ld1JlY3J1aXRlcjogUmVjcnVpdGVyTW9kZWwgPSA8UmVjcnVpdGVyTW9kZWw+cmVxLmJvZHk7XHJcbiAgICB2YXIgcGFyYW1zID0gcmVxLnF1ZXJ5O1xyXG4gICAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XHJcbiAgICB2YXIgdXNlcklkOiBzdHJpbmcgPSByZXEucGFyYW1zLmlkO1xyXG4gICAgdmFyIGF1dGg6IEF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgIHZhciByZWNydWl0ZXJTZXJ2aWNlID0gbmV3IFJlY3J1aXRlclNlcnZpY2UoKTtcclxuICAgIHJlY3J1aXRlclNlcnZpY2UudXBkYXRlRGV0YWlscyh1c2VySWQsIG5ld1JlY3J1aXRlciwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFyIHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZChuZXdSZWNydWl0ZXIpO1xyXG4gICAgICAgIHJlcy5zZW5kKHtcclxuICAgICAgICAgICdzdGF0dXMnOiAnc3VjY2VzcycsXHJcbiAgICAgICAgICAnZGF0YSc6IHJlc3VsdCxcclxuICAgICAgICAgIGFjY2Vzc190b2tlbjogdG9rZW5cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICBuZXh0KHtyZWFzb246IGUubWVzc2FnZSwgbWVzc2FnZTogZS5tZXNzYWdlLCBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSwgY29kZTogNTAwfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmV0cmlldmUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIHZhciByZWNydWl0ZXJTZXJ2aWNlID0gbmV3IFJlY3J1aXRlclNlcnZpY2UoKTtcclxuICAgIGxldCBkYXRhID0ge1xyXG4gICAgICAndXNlcklkJzogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKHJlcS5wYXJhbXMuaWQpXHJcbiAgICB9O1xyXG4gICAgcmVjcnVpdGVyU2VydmljZS5yZXRyaWV2ZShkYXRhLCAoZXJyb3I6IGFueSwgcmVzdWx0OiBSZWNydWl0ZXJbXSkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KHtcclxuICAgICAgICAgIHJlYXNvbjogQ05leHRNZXNzYWdlcy5QUk9CTEVNX0lOX1JFVFJJRVZFX0pPQl9QUk9GSUxFLFxyXG4gICAgICAgICAgbWVzc2FnZTogQ05leHRNZXNzYWdlcy5QUk9CTEVNX0lOX1JFVFJJRVZFX0pPQl9QUk9GSUxFLFxyXG4gICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICBjb2RlOiA0MDFcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVzdWx0WzBdKSB7XHJcbiAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7XHJcbiAgICAgICAgICAgICdzdGF0dXMnOiBNZXNzYWdlcy5TVEFUVVNfU1VDQ0VTUyxcclxuICAgICAgICAgICAgJ2RhdGEnOiByZXN1bHQsXHJcbiAgICAgICAgICAgICdqb2JDb3VudE1vZGVsJzogcmVzdWx0WzBdLmpvYkNvdW50TW9kZWxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgbGV0IGN1cnJlbnREYXRlID0gTnVtYmVyKG5ldyBEYXRlKCkpO1xyXG4gICAgICAgICAgbGV0IGV4cGlyaW5nRGF0ZSA9IE51bWJlcihuZXcgRGF0ZShyZXN1bHRbMF0ucG9zdGVkSm9ic1swXS5leHBpcmluZ0RhdGUpKTtcclxuICAgICAgICAgIGxldCBkYXlzUmVtYWluaW5nRm9yRXhwaXJpbmcgPSBNYXRoLnJvdW5kKE51bWJlcihuZXcgRGF0ZShleHBpcmluZ0RhdGUgLSBjdXJyZW50RGF0ZSkpIC8gKDEwMDAgKiA2MCAqIDYwICogMjQpKTtcclxuICAgICAgICAgIHJlc3VsdFswXS5wb3N0ZWRKb2JzWzBdLmRheXNSZW1haW5pbmdGb3JFeHBpcmluZyA9IGRheXNSZW1haW5pbmdGb3JFeHBpcmluZztcclxuICAgICAgICAgIGlmIChkYXlzUmVtYWluaW5nRm9yRXhwaXJpbmcgPD0gMCkge1xyXG4gICAgICAgICAgICByZXN1bHRbMF0ucG9zdGVkSm9ic1swXS5pc0pvYlBvc3RFeHBpcmVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXN1bHRbMF0ucG9zdGVkSm9ic1swXS5pc0pvYlBvc3RFeHBpcmVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgICAgJ3N0YXR1cyc6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgICAnZGF0YSc6IHJlc3VsdFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgfSk7XHJcblxyXG5cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBuZXh0KHtyZWFzb246IGUubWVzc2FnZSwgbWVzc2FnZTogZS5tZXNzYWdlLCBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSwgY29kZTogNTAwfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmlsdGVyTGlzdChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLG5leHQ6YW55KSB7XHJcbiAgX19kaXJuYW1lID0gJy4vJztcclxuICB2YXIgZmlsZXBhdGggPSAncmVjcnVpdGVyLWZpbHRlci1saXN0Lmpzb24nO1xyXG4gIHRyeSB7XHJcbiAgICByZXMuc2VuZEZpbGUoZmlsZXBhdGgsIHtyb290OiBfX2Rpcm5hbWV9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe3JlYXNvbjogZS5tZXNzYWdlLCBtZXNzYWdlOiBlLm1lc3NhZ2UsIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLCBjb2RlOiA1MDB9KTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGlzdChyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG4gICAgbGV0IGRhdGE6IGFueSA9IHtcclxuICAgICAgJ2pvYlByb2ZpbGVJZCc6IHJlcS5wYXJhbXMuaWQsXHJcbiAgICAgICdsaXN0TmFtZSc6IHJlcS5wYXJhbXMubGlzdE5hbWVcclxuICAgIH07XHJcbiAgICBsZXQgcmVjcnVpdGVyU2VydmljZSA9IG5ldyBSZWNydWl0ZXJTZXJ2aWNlKCk7XHJcbiAgICByZWNydWl0ZXJTZXJ2aWNlLmdldENhbmRpZGF0ZUxpc3QoZGF0YSwgKGVycm9yOiBhbnksIHJlc3BvbnNlOiBhbnkpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRVhJU1RJTkdfVVNFUixcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9WRVJJRllfQUNDT1VOVCxcclxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgJ3N0YXR1cyc6ICdzdWNjZXNzJyxcclxuICAgICAgICAgICdkYXRhJzogcmVzcG9uc2UsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe3JlYXNvbjogZS5tZXNzYWdlLCBtZXNzYWdlOiBlLm1lc3NhZ2UsIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLCBjb2RlOiA1MDB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21wYXJlRGV0YWlsc09mQ2FuZGlkYXRlKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG5cclxuICB0cnkge1xyXG4gICAgdmFyIHNlYXJjaFNlcnZpY2UgPSBuZXcgU2VhcmNoU2VydmljZSgpO1xyXG4gICAgdmFyIHBhcmFtcyA9IHJlcS5xdWVyeTtcclxuICAgIGxldCBqb2JJZCA9IHJlcS5wYXJhbXMuam9iSWQ7XHJcbiAgICBsZXQgcmVjcnVpdGVySWQgPSByZXEucGFyYW1zLmlkO1xyXG4gICAgbGV0IGNhbmRpZGF0ZUlkOiBzdHJpbmdbXSA9IEpTT04ucGFyc2UocGFyYW1zLmNhbmRpZGF0ZUlkKTtcclxuICAgIHNlYXJjaFNlcnZpY2UuZ2V0TXVsdGlDb21wYXJlUmVzdWx0KGNhbmRpZGF0ZUlkLCBqb2JJZCwgcmVjcnVpdGVySWQsIGZhbHNlLCAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICByZWFzb246IFwiUHJvYmxlbSBpbiBTZWFyY2ggTWF0Y2hpbmcgUmVzdWx0XCIsLy9NZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICBtZXNzYWdlOiAnUHJvYmxlbSBpbiBTZWFyY2ggTWF0Y2hpbmcgUmVzdWx0JywvL01lc3NhZ2VzLk1TR19FUlJPUl9XUk9OR19UT0tFTixcclxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgY29kZTogNDAxXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgXCJzdGF0dXNcIjogXCJzdWNjZXNzXCIsXHJcbiAgICAgICAgICBcImRhdGFcIjogcmVzdWx0LFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgbmV4dCh7cmVhc29uOiBlLm1lc3NhZ2UsIG1lc3NhZ2U6IGUubWVzc2FnZSwgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksIGNvZGU6IDUwMH0pO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDYW5kaWRhdGVzQnlOYW1lKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgIGxldCBjYW5kaWRhdGVTZXJ2aWNlID0gbmV3IENhbmRpZGF0ZVNlcnZpY2UoKTtcclxuICAgIGxldCBjYW5kaWRhdGVTZWFyY2hTZXJ2aWNlID0gbmV3IENhbmRpZGF0ZVNlYXJjaFNlcnZpY2UoKTtcclxuICAgIHZhciB1c2VyTmFtZSA9IHJlcS5wYXJhbXMuc2VhcmNodmFsdWU7XHJcbiAgICB2YXIgcXVlcnk6YW55O1xyXG4gICAgdmFyIHNlYXJjaFZhbHVlQXJyYXk6c3RyaW5nW10gPSB1c2VyTmFtZS5zcGxpdChcIiBcIik7XHJcbiAgICBsZXQgaW5jbHVkZWQgOiBhbnkgPSB7XHJcbiAgICAgICdfaWQnOjFcclxuICAgIH07XHJcbiAgICBpZiAoc2VhcmNoVmFsdWVBcnJheS5sZW5ndGggPiAxKSB7XHJcbiAgICAgIHZhciBleHAxID0gZXZhbCgnL14nICsgc2VhcmNoVmFsdWVBcnJheVswXSArICcvaScpO1xyXG4gICAgICB2YXIgZXhwMiA9IGV2YWwoJy9eJyArIHNlYXJjaFZhbHVlQXJyYXlbMV0gKyAnL2knKTtcclxuICAgICAgdmFyIHNlYXJjaFN0cmluZzE6IHN0cmluZyA9IGV4cDEudG9TdHJpbmcoKS5yZXBsYWNlKC8nL2csIFwiXCIpO1xyXG4gICAgICB2YXIgc2VhcmNoU3RyaW5nMjogc3RyaW5nID0gZXhwMi50b1N0cmluZygpLnJlcGxhY2UoLycvZywgXCJcIik7XHJcbiAgICAgIHF1ZXJ5ID0ge1xyXG4gICAgICAgICdpc0NhbmRpZGF0ZSc6IHRydWUsXHJcbiAgICAgICAgJG9yOiBbe1xyXG4gICAgICAgICAgJ2ZpcnN0X25hbWUnOiB7JHJlZ2V4OiBldmFsKHNlYXJjaFN0cmluZzEpfSxcclxuICAgICAgICAgICdsYXN0X25hbWUnOiB7JHJlZ2V4OiBldmFsKHNlYXJjaFN0cmluZzIpfVxyXG4gICAgICAgIH0sIHsnZmlyc3RfbmFtZSc6IHskcmVnZXg6IGV2YWwoc2VhcmNoU3RyaW5nMil9LCAnbGFzdF9uYW1lJzogeyRyZWdleDogZXZhbChzZWFyY2hTdHJpbmcxKX19XVxyXG4gICAgICB9O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyIGV4cCA9IGV2YWwoJy9eJyArIHNlYXJjaFZhbHVlQXJyYXlbMF0gKyAnL2knKTtcclxuICAgICAgdmFyIHNlYXJjaFN0cmluZzogc3RyaW5nID0gZXhwLnRvU3RyaW5nKCkucmVwbGFjZSgvJy9nLCBcIlwiKTtcclxuXHJcbiAgICAgIHF1ZXJ5ID0ge1xyXG4gICAgICAgICdpc0NhbmRpZGF0ZSc6IHRydWUsXHJcbiAgICAgICAgJG9yOiBbeydmaXJzdF9uYW1lJzogeyRyZWdleDogZXZhbChzZWFyY2hTdHJpbmcpfX0sIHsnbGFzdF9uYW1lJzogeyRyZWdleDogZXZhbChzZWFyY2hTdHJpbmcpfX1dXHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgICB1c2VyU2VydmljZS5yZXRyaWV2ZVdpdGhMaW1pdChxdWVyeSxpbmNsdWRlZCwgKGVycm9yOmFueSwgcmVzdWx0OmFueSkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KHtcclxuICAgICAgICAgIHJlYXNvbjogJ1Byb2JsZW0gaW4gU2VhcmNoIHVzZXIgZGV0YWlscycsXHJcbiAgICAgICAgICBtZXNzYWdlOiAnUHJvYmxlbSBpbiBTZWFyY2ggdXNlciBkZXRhaWxzJyxcclxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgY29kZTogNDAxXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdmFyIGNhbmRpZGF0ZUlkOiBzdHJpbmdbXSA9IG5ldyBBcnJheSgwKTtcclxuICAgICAgICBmb3IgKGxldCBvYmogb2YgcmVzdWx0KSB7XHJcbiAgICAgICAgICBjYW5kaWRhdGVJZC5wdXNoKG9iai5faWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYW5kaWRhdGVTZWFyY2hTZXJ2aWNlLmdldENhbmRpZGF0ZUluZm8oY2FuZGlkYXRlSWQsIChlcnJvcjogYW55LCBjYW5kaWRhdGVJbmZvOiBDYW5kaWRhdGVNb2RlbFtdKSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiAnUHJvYmxlbSBpbiBTZWFyY2ggdXNlciBkZXRhaWxzJyxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiAnUHJvYmxlbSBpbiBTZWFyY2ggdXNlciBkZXRhaWxzJyxcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDFcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgc2VhcmNoQXJyYXk6IENhbmRpZGF0ZUluZm9TZWFyY2hbXSA9IGNhbmRpZGF0ZVNlYXJjaFNlcnZpY2UuYnVpZFJlc3VsdE9uQ2FuZGlkYXRlU2VhcmNoKGNhbmRpZGF0ZUluZm8pO1xyXG4gICAgICAgICAgICByZXMuc2VuZCh7XHJcbiAgICAgICAgICAgICAgJ3N0YXR1cyc6ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgICAnZGF0YSc6IHNlYXJjaEFycmF5LFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgbmV4dCh7cmVhc29uOiBlLm1lc3NhZ2UsIG1lc3NhZ2U6IGUubWVzc2FnZSwgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksIGNvZGU6IDUwMH0pO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZXF1ZXN0VG9BZHZpc29yKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcblxyXG4gICAgbGV0IHJlY3J1aXRlclNlcnZpY2UgPSBuZXcgUmVjcnVpdGVyU2VydmljZSgpO1xyXG4gICAgdmFyIHBhcmFtcyA9IHJlcS5ib2R5O1xyXG4gICAgcmVjcnVpdGVyU2VydmljZS5zZW5kTWFpbFRvQWR2aXNvcihwYXJhbXMsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX1dISUxFX0NPTlRBQ1RJTkcsXHJcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV0hJTEVfQ09OVEFDVElORyxcclxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe1xyXG4gICAgICAgICAgXCJzdGF0dXNcIjogTWVzc2FnZXMuU1RBVFVTX1NVQ0NFU1MsXHJcbiAgICAgICAgICBcImRhdGFcIjoge1wibWVzc2FnZVwiOiBNZXNzYWdlcy5NU0dfU1VDQ0VTU19FTUFJTH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgICBuZXh0KHtyZWFzb246IGUubWVzc2FnZSwgbWVzc2FnZTogZS5tZXNzYWdlLCBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSwgY29kZTogNTAwfSk7XHJcblxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlc3BvbnNlVG9SZWNydWl0ZXIocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIGxldCByZWNydWl0ZXJTZXJ2aWNlID0gbmV3IFJlY3J1aXRlclNlcnZpY2UoKTtcclxuICAgIGxldCB1c2VyID0gcmVxLnVzZXI7XHJcbiAgICB2YXIgcGFyYW1zID0gcmVxLmJvZHk7XHJcbiAgICByZWNydWl0ZXJTZXJ2aWNlLnNlbmRNYWlsVG9SZWNydWl0ZXIodXNlciwgcGFyYW1zLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KHtcclxuICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9XSElMRV9DT05UQUNUSU5HLFxyXG4gICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dISUxFX0NPTlRBQ1RJTkcsXHJcbiAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgIGNvZGU6IDQwM1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgIFwic3RhdHVzXCI6IE1lc3NhZ2VzLlNUQVRVU19TVUNDRVNTLFxyXG4gICAgICAgICAgXCJkYXRhXCI6IHtcIm1lc3NhZ2VcIjogTWVzc2FnZXMuTVNHX1NVQ0NFU1NfRU1BSUx9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgbmV4dCh7cmVhc29uOiBlLm1lc3NhZ2UsIG1lc3NhZ2U6IGUubWVzc2FnZSwgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksIGNvZGU6IDUwMH0pO1xyXG5cclxuICB9XHJcbn1cclxuXHJcblxyXG4iXX0=
