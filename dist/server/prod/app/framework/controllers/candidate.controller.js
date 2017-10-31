"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var AuthInterceptor = require("../interceptor/auth.interceptor");
var Messages = require("../shared/messages");
var CandidateService = require("../services/candidate.service");
var UserService = require("../services/user.service");
var SearchService = require("../search/services/search.service");
var mailchimp_mailer_service_1 = require("../services/mailchimp-mailer.service");
function create(req, res, next) {
    try {
        var newUser = req.body;
        var candidateService = new CandidateService();
        candidateService.createUser(newUser, function (error, result) {
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
            code: 500
        });
    }
}
exports.create = create;
function updateDetails(req, res, next) {
    try {
        var updatedCandidate_1 = req.body;
        var params = req.query;
        delete params.access_token;
        var userId_1 = req.params.id;
        var auth_1 = new AuthInterceptor();
        var isEditingProfile_1 = false;
        var candidateService_1 = new CandidateService();
        var mailChimpMailerService_1 = new mailchimp_mailer_service_1.MailChimpMailerService();
        candidateService_1.get(userId_1, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                updatedCandidate_1.lastUpdateAt = new Date().toISOString();
                if (result && result.isSubmitted) {
                    isEditingProfile_1 = true;
                }
                candidateService_1.update(userId_1, updatedCandidate_1, function (error, result) {
                    if (error) {
                        next(error);
                    }
                    else {
                        candidateService_1.retrieve(result._id, function (error, result) {
                            if (error) {
                                next({
                                    reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                                    message: Messages.MSG_ERROR_WRONG_TOKEN,
                                    stackTrace: new Error(),
                                    code: 400
                                });
                            }
                            else {
                                var token = auth_1.issueTokenWithUid(result[0]);
                                mailChimpMailerService_1.onCandidatePofileSubmitted(req.body.basicInformation, updatedCandidate_1.isSubmitted, isEditingProfile_1);
                                res.send({
                                    'status': 'success',
                                    'data': result,
                                    access_token: token
                                });
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
            code: 500
        });
    }
}
exports.updateDetails = updateDetails;
function getCapabilityMatrix(req, res, next) {
    try {
        var candidateId = req.params.id;
        var candidateService = new CandidateService();
        candidateService.getCapabilityValueKeyMatrix(candidateId, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                res.send({
                    'status': 'success',
                    'data': result,
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
exports.getCapabilityMatrix = getCapabilityMatrix;
function retrieve(req, res, next) {
    try {
        var userService_1 = new UserService();
        var candidateService_2 = new CandidateService();
        var params = req.params.id;
        var candidateId = req.params.candidateId;
        if (candidateId) {
            candidateService_2.findById(candidateId, function (error, resu) {
                if (error) {
                    next({
                        reason: 'User Not Available',
                        message: 'User is not available',
                        stackTrace: new Error(),
                        code: 401
                    });
                }
                else {
                    userService_1.findById(resu.userId, function (error, result) {
                        if (error) {
                            next({
                                reason: 'User Not Available',
                                message: 'User is not available',
                                stackTrace: new Error(),
                                code: 401
                            });
                        }
                        else {
                            res.send({
                                'status': 'success',
                                'data': resu,
                                'metadata': result
                            });
                        }
                    });
                }
            });
        }
        else {
            userService_1.findById(params, function (error, result) {
                if (error) {
                    next({
                        reason: Messages.MSG_ERROR_RSN_INVALID_CREDENTIALS,
                        message: Messages.MSG_ERROR_WRONG_TOKEN,
                        stackTrace: new Error(),
                        code: 401
                    });
                }
                else {
                    if (result.length <= 0) {
                        next({
                            reason: 'User Not Available',
                            message: 'User is not available',
                            stackTrace: new Error(),
                            code: 401
                        });
                    }
                    else {
                        candidateService_2.retrieve({ 'userId': new mongoose.Types.ObjectId(result._id) }, function (error, resu) {
                            if (error) {
                                next({
                                    reason: 'User Not Available',
                                    message: 'User is not available',
                                    stackTrace: new Error(),
                                    code: 401
                                });
                            }
                            else {
                                res.send({
                                    'status': 'success',
                                    'data': resu,
                                    'metadata': result
                                });
                            }
                        });
                    }
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
exports.retrieve = retrieve;
function get(req, res, next) {
    try {
        var candidateService = new CandidateService();
        var candidateId = req.params.id;
        candidateService.get(candidateId, function (error, result) {
            if (error) {
                next(error);
            }
            else {
                res.send({
                    'status': 'success',
                    'data': result,
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
exports.get = get;
function metchResult(req, res, next) {
    try {
        var searchService = new SearchService();
        var jobId = req.params.jobId;
        var candidateId = req.params.candidateId;
        searchService.getMatchingResult(candidateId, jobId, true, function (error, result) {
            if (error) {
                next({
                    reason: 'Problem in Search Matching Result',
                    message: 'Problem in Search Matching Result',
                    stackTrace: new Error(),
                    code: 401
                });
            }
            else {
                res.send({
                    'status': 'success',
                    'data': result,
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
exports.metchResult = metchResult;
function getList(req, res, next) {
    try {
        var candidateId = req.params.id;
        var listName_1 = req.params.listName;
        var candidateService_3 = new CandidateService();
        candidateService_3.findById(candidateId, function (error, response) {
            if (error) {
                next({
                    reason: Messages.MSG_ERROR_RSN_EXISTING_USER,
                    message: Messages.MSG_ERROR_VERIFY_ACCOUNT,
                    code: 403
                });
            }
            else {
                var isFound = false;
                for (var _i = 0, _a = response.job_list; _i < _a.length; _i++) {
                    var list = _a[_i];
                    if (listName_1 === list.name) {
                        isFound = true;
                        var data = {
                            listName: listName_1,
                            ids: list.ids,
                            candidate: response
                        };
                        candidateService_3.getList(data, function (err, result) {
                            if (err) {
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
                                    'data': result,
                                });
                            }
                        });
                        break;
                    }
                }
                if (!isFound) {
                    var result = [];
                    res.send({
                        'status': 'success',
                        'data': result,
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
}
exports.getList = getList;
function updateField(req, res, next) {
    var candidateService = new CandidateService();
    try {
        var value = req.query.value;
        var data = { $max: { 'profile_update_tracking': Number(value) } };
        var userId = req.params.id;
        candidateService.updateField(userId, data, function (error, result) {
            if (error) {
                next({
                    reason: Messages.MSG_ERROR_FAILED_TO_UPDATE_CANDIDATE_FIELD,
                    message: Messages.MSG_ERROR_FAILED_TO_UPDATE_CANDIDATE_FIELD,
                    stackTrace: new Error(),
                    code: 403
                });
            }
            else {
                res.send({
                    'status': 'success',
                    'data': result,
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
exports.updateField = updateField;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvY29udHJvbGxlcnMvY2FuZGlkYXRlLmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxtQ0FBcUM7QUFDckMsaUVBQW9FO0FBQ3BFLDZDQUFnRDtBQUVoRCxnRUFBbUU7QUFDbkUsc0RBQXlEO0FBRXpELGlFQUFvRTtBQUVwRSxpRkFBOEU7QUFHOUUsZ0JBQXVCLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUFTO0lBQzNFLElBQUksQ0FBQztRQUNILElBQUksT0FBTyxHQUFtQyxHQUFHLENBQUMsSUFBSSxDQUFDO1FBQ3ZELElBQUksZ0JBQWdCLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1FBQzlDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsVUFBQyxLQUFLLEVBQUUsTUFBTTtZQUNqRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNWLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxRQUFRLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxDQUFDO29CQUNwRCxJQUFJLENBQUM7d0JBQ0gsTUFBTSxFQUFFLFFBQVEsQ0FBQywyQkFBMkI7d0JBQzVDLE9BQU8sRUFBRSxRQUFRLENBQUMsd0JBQXdCO3dCQUMxQyxVQUFVLEVBQUUsSUFBSSxLQUFLLEVBQUU7d0JBQ3ZCLElBQUksRUFBRSxHQUFHO3FCQUNWLENBQUMsQ0FBQztnQkFDTCxDQUFDO2dCQUNELElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksUUFBUSxDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQztvQkFDMUQsSUFBSSxDQUFDO3dCQUNILE1BQU0sRUFBRSxRQUFRLENBQUMsMkJBQTJCO3dCQUM1QyxPQUFPLEVBQUUsUUFBUSxDQUFDLG9DQUFvQzt3QkFDdEQsVUFBVSxFQUFFLElBQUksS0FBSyxFQUFFO3dCQUN2QixJQUFJLEVBQUUsR0FBRztxQkFDVixDQUFDLENBQUM7Z0JBQ0wsQ0FBQztn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QUMsQ0FBQyxDQUFDO2dCQUNWLElBQUksQ0FBQztvQkFDSCxNQUFNLEVBQUUsUUFBUSxDQUFDLDBDQUEwQztvQkFDM0QsT0FBTyxFQUFFLFFBQVEsQ0FBQywwQ0FBMEM7b0JBQzVELFVBQVUsRUFBRSxJQUFJLEtBQUssRUFBRTtvQkFDdkIsSUFBSSxFQUFFLEdBQUc7aUJBQ1YsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLEdBQUcsQ0FBQyxJQUFJLENBQUM7b0JBQ1AsUUFBUSxFQUFFLFNBQVM7b0JBQ25CLE1BQU0sRUFBRSxNQUFNO2lCQUNmLENBQUMsQ0FBQztZQUNMLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1QsSUFBSSxDQUFDO1lBQ0gsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPO1lBQ2pCLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTztZQUNsQixVQUFVLEVBQUUsSUFBSSxLQUFLLEVBQUU7WUFDdkIsSUFBSSxFQUFFLEdBQUc7U0FDVixDQUFDLENBQUM7SUFDTCxDQUFDO0FBRUgsQ0FBQztBQS9CRCxrQ0ErQkMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9jb250cm9sbGVycy9jYW5kaWRhdGUuY29udHJvbGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGV4cHJlc3MgZnJvbSBcImV4cHJlc3NcIjtcclxuaW1wb3J0ICogYXMgbW9uZ29vc2UgZnJvbSBcIm1vbmdvb3NlXCI7XHJcbmltcG9ydCBBdXRoSW50ZXJjZXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcmNlcHRvci9hdXRoLmludGVyY2VwdG9yJyk7XHJcbmltcG9ydCBNZXNzYWdlcyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9tZXNzYWdlcycpO1xyXG5pbXBvcnQgQ2FuZGlkYXRlTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL2NhbmRpZGF0ZS5tb2RlbCcpO1xyXG5pbXBvcnQgQ2FuZGlkYXRlU2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL2NhbmRpZGF0ZS5zZXJ2aWNlJyk7XHJcbmltcG9ydCBVc2VyU2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL3VzZXIuc2VydmljZScpO1xyXG5pbXBvcnQgUmVjcnVpdGVyU2VydmljZSA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL3JlY3J1aXRlci5zZXJ2aWNlJyk7XHJcbmltcG9ydCBTZWFyY2hTZXJ2aWNlID0gcmVxdWlyZSgnLi4vc2VhcmNoL3NlcnZpY2VzL3NlYXJjaC5zZXJ2aWNlJyk7XHJcbmltcG9ydCBDYW5kaWRhdGVJbmZvU2VhcmNoID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9jYW5kaWRhdGUtaW5mby1zZWFyY2gnKTtcclxuaW1wb3J0IHsgTWFpbENoaW1wTWFpbGVyU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL21haWxjaGltcC1tYWlsZXIuc2VydmljZSc7XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBhbnkpIHtcclxuICB0cnkge1xyXG4gICAgbGV0IG5ld1VzZXI6IENhbmRpZGF0ZU1vZGVsID0gPENhbmRpZGF0ZU1vZGVsPnJlcS5ib2R5O1xyXG4gICAgbGV0IGNhbmRpZGF0ZVNlcnZpY2UgPSBuZXcgQ2FuZGlkYXRlU2VydmljZSgpO1xyXG4gICAgY2FuZGlkYXRlU2VydmljZS5jcmVhdGVVc2VyKG5ld1VzZXIsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGlmIChlcnJvciA9PSBNZXNzYWdlcy5NU0dfRVJST1JfQ0hFQ0tfRU1BSUxfUFJFU0VOVCkge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0FDQ09VTlQsXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDBcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChlcnJvciA9PSBNZXNzYWdlcy5NU0dfRVJST1JfQ0hFQ0tfTU9CSUxFX1BSRVNFTlQpIHtcclxuICAgICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9SU05fRVhJU1RJTkdfVVNFUixcclxuICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTl9NT0JJTEVfTlVNQkVSLFxyXG4gICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgY29kZTogNDAwXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0VYSVNUSU5HX1VTRVIsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9VU0VSX1dJVEhfRU1BSUxfUFJFU0VOVCxcclxuICAgICAgICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGxldCBhdXRoOiBBdXRoSW50ZXJjZXB0b3IgPSBuZXcgQXV0aEludGVyY2VwdG9yKCk7XHJcbiAgICAgICAgbGV0IHRva2VuID0gYXV0aC5pc3N1ZVRva2VuV2l0aFVpZChyZXN1bHQpO1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcclxuICAgICAgICAgICdzdGF0dXMnOiBNZXNzYWdlcy5TVEFUVVNfU1VDQ0VTUyxcclxuICAgICAgICAgICdkYXRhJzoge1xyXG4gICAgICAgICAgICAncmVhc29uJzogTWVzc2FnZXMuTVNHX1NVQ0NFU1NfUkVHSVNUUkFUSU9OLFxyXG4gICAgICAgICAgICAnX2lkJzogcmVzdWx0LnVzZXJJZCxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBhY2Nlc3NfdG9rZW46IHRva2VuXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgbmV4dCh7XHJcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICBjb2RlOiA1MDBcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVEZXRhaWxzKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICBsZXQgdXBkYXRlZENhbmRpZGF0ZTogQ2FuZGlkYXRlTW9kZWwgPSA8Q2FuZGlkYXRlTW9kZWw+cmVxLmJvZHk7XHJcbiAgICBsZXQgcGFyYW1zID0gcmVxLnF1ZXJ5O1xyXG4gICAgZGVsZXRlIHBhcmFtcy5hY2Nlc3NfdG9rZW47XHJcbiAgICBsZXQgdXNlcklkOiBzdHJpbmcgPSByZXEucGFyYW1zLmlkO1xyXG4gICAgbGV0IGF1dGg6IEF1dGhJbnRlcmNlcHRvciA9IG5ldyBBdXRoSW50ZXJjZXB0b3IoKTtcclxuICAgIGxldCBpc0VkaXRpbmdQcm9maWxlOiBib29sZWFuPWZhbHNlO1xyXG5cclxuICAgIC8qbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgbGV0IHF1ZXJ5ID0ge1wiX2lkXCI6IHVzZXJJZH07XHJcbiAgICAgbGV0IHVwZGF0ZURhdGEgPSB7XCJsb2NhdGlvblwiOiB1cGRhdGVkQ2FuZGlkYXRlLnByb2Zlc3Npb25hbERldGFpbHMubG9jYXRpb259OyovXHJcbiAgICBsZXQgY2FuZGlkYXRlU2VydmljZSA9IG5ldyBDYW5kaWRhdGVTZXJ2aWNlKCk7XHJcbiAgICBsZXQgbWFpbENoaW1wTWFpbGVyU2VydmljZSA9IG5ldyBNYWlsQ2hpbXBNYWlsZXJTZXJ2aWNlKCk7XHJcblxyXG5cclxuICAgIGNhbmRpZGF0ZVNlcnZpY2UuZ2V0KHVzZXJJZCwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdXBkYXRlZENhbmRpZGF0ZS5sYXN0VXBkYXRlQXQ9bmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xyXG4gICAgICAgIC8qaWYocmVzdWx0LnByb2ZpbGVDb21wbGV0ZWQgJiYgcmVzdWx0LnByb2ZpbGVDb21wbGV0ZWQgPj0gdXBkYXRlZENhbmRpZGF0ZS5wcm9maWxlQ29tcGxldGVkKSB7XHJcbiAgICAgICAgICB1cGRhdGVkQ2FuZGlkYXRlLnByb2ZpbGVDb21wbGV0ZWQ9cmVzdWx0LnByb2ZpbGVDb21wbGV0ZWQ7XHJcbiAgICAgICAgfSovXHJcbiAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQuaXNTdWJtaXR0ZWQpIHtcclxuICAgICAgICAgIGlzRWRpdGluZ1Byb2ZpbGUgPSB0cnVlO1xyXG4vKlxyXG4gICAgICAgICAgdXBkYXRlZENhbmRpZGF0ZS5wcm9maWxlQ29tcGxldGVkPTEwMDtcclxuKi9cclxuICAgICAgICB9XHJcbiAgICAgICAgLyppZih1cGRhdGVkQ2FuZGlkYXRlLmlzU3VibWl0dGVkKSB7XHJcbiAgICAgICAgICB1cGRhdGVkQ2FuZGlkYXRlLnByb2ZpbGVDb21wbGV0ZWQ9MTAwO1xyXG4gICAgICAgIH0qL1xyXG4gICAgY2FuZGlkYXRlU2VydmljZS51cGRhdGUodXNlcklkLCB1cGRhdGVkQ2FuZGlkYXRlLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYW5kaWRhdGVTZXJ2aWNlLnJldHJpZXZlKHJlc3VsdC5faWQsIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgICAgbWVzc2FnZTogTWVzc2FnZXMuTVNHX0VSUk9SX1dST05HX1RPS0VOLFxyXG4gICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgIGNvZGU6IDQwMFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCB0b2tlbiA9IGF1dGguaXNzdWVUb2tlbldpdGhVaWQocmVzdWx0WzBdKTtcclxuICAgICAgICAgICAgICAgIG1haWxDaGltcE1haWxlclNlcnZpY2Uub25DYW5kaWRhdGVQb2ZpbGVTdWJtaXR0ZWQocmVxLmJvZHkuYmFzaWNJbmZvcm1hdGlvbix1cGRhdGVkQ2FuZGlkYXRlLmlzU3VibWl0dGVkLCBpc0VkaXRpbmdQcm9maWxlKTtcclxuICAgICAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgICAgICdzdGF0dXMnOiAnc3VjY2VzcycsXHJcbiAgICAgICAgICAgICAgJ2RhdGEnOiByZXN1bHQsXHJcbiAgICAgICAgICAgICAgYWNjZXNzX3Rva2VuOiB0b2tlblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAvKnVzZXJTZXJ2aWNlLmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIHVwZGF0ZURhdGEsIHtuZXc6IHRydWV9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgIGlmIChlcnJvcikge1xyXG4gICAgIG5leHQoZXJyb3IpO1xyXG4gICAgIH0gZWxzZSB7XHJcbiAgICAgcmVzLnNlbmQoe1xyXG4gICAgIFwic3RhdHVzXCI6IFwiU3VjY2Vzc1wiLFxyXG4gICAgIFwiZGF0YVwiOiB7XCJkYXRhXCI6IHJlc3VsdH1cclxuICAgICB9KTtcclxuICAgICB9XHJcbiAgICAgfSk7Ki9cclxuXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICBjYXRjaCAoZSkge1xyXG4gICAgbmV4dCh7XHJcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICBjb2RlOiA1MDBcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENhcGFiaWxpdHlNYXRyaXgocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7XHJcbiAgdHJ5IHtcclxuICAgIGxldCBjYW5kaWRhdGVJZDogc3RyaW5nID0gcmVxLnBhcmFtcy5pZDtcclxuICAgIGxldCBjYW5kaWRhdGVTZXJ2aWNlID0gbmV3IENhbmRpZGF0ZVNlcnZpY2UoKTtcclxuICAgIGNhbmRpZGF0ZVNlcnZpY2UuZ2V0Q2FwYWJpbGl0eVZhbHVlS2V5TWF0cml4KGNhbmRpZGF0ZUlkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBuZXh0KGVycm9yKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICAgIHJlcy5zZW5kKHtcclxuICAgICAgICAgICAgJ3N0YXR1cyc6ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgJ2RhdGEnOiByZXN1bHQsXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNTAwXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmV0cmlldmUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7IC8vdG9kbyBhdXRoZW50aWNhdGlvbiBpcyByZW1haW5pbmdcclxuICB0cnkge1xyXG4gICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICBsZXQgY2FuZGlkYXRlU2VydmljZSA9IG5ldyBDYW5kaWRhdGVTZXJ2aWNlKCk7XHJcbiAgICBsZXQgcGFyYW1zID0gcmVxLnBhcmFtcy5pZDtcclxuICAgIGxldCBjYW5kaWRhdGVJZCA9IHJlcS5wYXJhbXMuY2FuZGlkYXRlSWQ7XHJcbiAgICBpZiAoY2FuZGlkYXRlSWQpIHtcclxuICAgICAgY2FuZGlkYXRlU2VydmljZS5maW5kQnlJZChjYW5kaWRhdGVJZCwgKGVycm9yLCByZXN1KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgcmVhc29uOiAnVXNlciBOb3QgQXZhaWxhYmxlJywvL01lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgbWVzc2FnZTogJ1VzZXIgaXMgbm90IGF2YWlsYWJsZScsLy9NZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfVE9LRU4sXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDFcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIHVzZXJTZXJ2aWNlLmZpbmRCeUlkKHJlc3UudXNlcklkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICAgIHJlYXNvbjogJ1VzZXIgTm90IEF2YWlsYWJsZScsLy9NZXNzYWdlcy5NU0dfRVJST1JfUlNOX0lOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVXNlciBpcyBub3QgYXZhaWxhYmxlJywvL01lc3NhZ2VzLk1TR19FUlJPUl9XUk9OR19UT0tFTixcclxuICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgICAgY29kZTogNDAxXHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICByZXMuc2VuZCh7XHJcbiAgICAgICAgICAgICAgICAnc3RhdHVzJzogJ3N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAgICAgJ2RhdGEnOiByZXN1LFxyXG4gICAgICAgICAgICAgICAgJ21ldGFkYXRhJzogcmVzdWx0XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdXNlclNlcnZpY2UuZmluZEJ5SWQocGFyYW1zLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfVE9LRU4sXHJcbiAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDFcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoIDw9IDApIHtcclxuICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgcmVhc29uOiAnVXNlciBOb3QgQXZhaWxhYmxlJywvL01lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgICBtZXNzYWdlOiAnVXNlciBpcyBub3QgYXZhaWxhYmxlJywvL01lc3NhZ2VzLk1TR19FUlJPUl9XUk9OR19UT0tFTixcclxuICAgICAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgICAgICBjb2RlOiA0MDFcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYW5kaWRhdGVTZXJ2aWNlLnJldHJpZXZlKHsndXNlcklkJzogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKHJlc3VsdC5faWQpfSwgKGVycm9yLCByZXN1KSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBuZXh0KHtcclxuICAgICAgICAgICAgICAgICAgcmVhc29uOiAnVXNlciBOb3QgQXZhaWxhYmxlJywvL01lc3NhZ2VzLk1TR19FUlJPUl9SU05fSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1VzZXIgaXMgbm90IGF2YWlsYWJsZScsLy9NZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfVE9LRU4sXHJcbiAgICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgICAgICBjb2RlOiA0MDFcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHtcclxuICAgICAgICAgICAgICAgICAgJ3N0YXR1cyc6ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgICAgICAgJ2RhdGEnOiByZXN1LFxyXG4gICAgICAgICAgICAgICAgICAnbWV0YWRhdGEnOiByZXN1bHRcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG4gIGNhdGNoIChlKSB7XHJcbiAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNDAzXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXQocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogYW55KSB7IC8vdG9kbyBhdXRoZW50aWNhdGlvbiBpcyByZW1haW5pbmdcclxuICB0cnkge1xyXG4gICAgbGV0IGNhbmRpZGF0ZVNlcnZpY2UgPSBuZXcgQ2FuZGlkYXRlU2VydmljZSgpO1xyXG4gICAgbGV0IGNhbmRpZGF0ZUlkID0gcmVxLnBhcmFtcy5pZDtcclxuICAgIC8qIGlmIChTdHJpbmcocmVxLnVzZXIuX2lkKSA9PT0gU3RyaW5nKGNhbmRpZGF0ZUlkKSkgeyovXHJcbiAgICAgIGNhbmRpZGF0ZVNlcnZpY2UuZ2V0KGNhbmRpZGF0ZUlkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgbmV4dChlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgICAnc3RhdHVzJzogJ3N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAnZGF0YSc6IHJlc3VsdCxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAvKiB9IGVsc2Uge1xyXG4gICAgICBuZXh0KHtcclxuICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9JRl9VU0VSX0lEX0lOVkFMSURfRlJPTV9VUkxfUEFSQU1FVEVSLFxyXG4gICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9JRl9VU0VSX0lEX0lOVkFMSURfRlJPTV9VUkxfUEFSQU1FVEVSLFxyXG4gICAgICAgIGNvZGU6IDQwMVxyXG4gICAgICB9KTtcclxuICAgICB9Ki9cclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgbmV4dCh7XHJcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICBjb2RlOiA0MDNcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1ldGNoUmVzdWx0KHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICBsZXQgc2VhcmNoU2VydmljZSA9IG5ldyBTZWFyY2hTZXJ2aWNlKCk7XHJcbiAgICBsZXQgam9iSWQgPSByZXEucGFyYW1zLmpvYklkO1xyXG4gICAgbGV0IGNhbmRpZGF0ZUlkID0gcmVxLnBhcmFtcy5jYW5kaWRhdGVJZDtcclxuICAgIHNlYXJjaFNlcnZpY2UuZ2V0TWF0Y2hpbmdSZXN1bHQoY2FuZGlkYXRlSWQsIGpvYklkLCB0cnVlLCAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICByZWFzb246ICdQcm9ibGVtIGluIFNlYXJjaCBNYXRjaGluZyBSZXN1bHQnLC8vTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgbWVzc2FnZTogJ1Byb2JsZW0gaW4gU2VhcmNoIE1hdGNoaW5nIFJlc3VsdCcsLy9NZXNzYWdlcy5NU0dfRVJST1JfV1JPTkdfVE9LRU4sXHJcbiAgICAgICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgICAgIGNvZGU6IDQwMVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIHJlcy5zZW5kKHtcclxuICAgICAgICAgICdzdGF0dXMnOiAnc3VjY2VzcycsXHJcbiAgICAgICAgICAnZGF0YSc6IHJlc3VsdCxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgbmV4dCh7XHJcbiAgICAgIHJlYXNvbjogZS5tZXNzYWdlLFxyXG4gICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICBjb2RlOiA0MDNcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRMaXN0KHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGFueSkge1xyXG4gIHRyeSB7XHJcbiAgICBsZXQgY2FuZGlkYXRlSWQ6IHN0cmluZyA9IHJlcS5wYXJhbXMuaWQ7XHJcbiAgICBsZXQgbGlzdE5hbWU6IHN0cmluZyA9IHJlcS5wYXJhbXMubGlzdE5hbWU7XHJcbiAgICBsZXQgY2FuZGlkYXRlU2VydmljZSA9IG5ldyBDYW5kaWRhdGVTZXJ2aWNlKCk7XHJcbiAgICBjYW5kaWRhdGVTZXJ2aWNlLmZpbmRCeUlkKGNhbmRpZGF0ZUlkLCAoZXJyb3I6IGFueSwgcmVzcG9uc2U6IENhbmRpZGF0ZU1vZGVsKSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIG5leHQoe1xyXG4gICAgICAgICAgcmVhc29uOiBNZXNzYWdlcy5NU0dfRVJST1JfUlNOX0VYSVNUSU5HX1VTRVIsXHJcbiAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0FDQ09VTlQsXHJcbiAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgaXNGb3VuZCA6IGJvb2xlYW49IGZhbHNlO1xyXG4gICAgICAgIGZvciAobGV0IGxpc3Qgb2YgcmVzcG9uc2Uuam9iX2xpc3QpIHtcclxuICAgICAgICAgIGlmIChsaXN0TmFtZSA9PT0gbGlzdC5uYW1lKSB7XHJcbiAgICAgICAgICAgIGlzRm91bmQ9IHRydWU7XHJcbiAgICAgICAgICAgIGxldCBkYXRhOiBhbnkgPSB7XHJcbiAgICAgICAgICAgICAgbGlzdE5hbWU6IGxpc3ROYW1lLFxyXG4gICAgICAgICAgICAgIGlkczogbGlzdC5pZHMsXHJcbiAgICAgICAgICAgICAgY2FuZGlkYXRlOiByZXNwb25zZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBjYW5kaWRhdGVTZXJ2aWNlLmdldExpc3QoZGF0YSwgKGVyciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICAgICAgICAgIHJlYXNvbjogTWVzc2FnZXMuTVNHX0VSUk9SX1JTTl9FWElTVElOR19VU0VSLFxyXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiBNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0FDQ09VTlQsXHJcbiAgICAgICAgICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgICAgICAgICBjb2RlOiA0MDNcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXMuc2VuZCh7XHJcbiAgICAgICAgICAgICAgICAgICdzdGF0dXMnOiAnc3VjY2VzcycsXHJcbiAgICAgICAgICAgICAgICAgICdkYXRhJzogcmVzdWx0LFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCFpc0ZvdW5kKSB7XHJcbiAgICAgICAgICBsZXQgcmVzdWx0IDogYW55PVtdO1xyXG4gICAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgICAnc3RhdHVzJzogJ3N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAnZGF0YSc6IHJlc3VsdCxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICBuZXh0KHtcclxuICAgICAgcmVhc29uOiBlLm1lc3NhZ2UsXHJcbiAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgc3RhY2tUcmFjZTogbmV3IEVycm9yKCksXHJcbiAgICAgIGNvZGU6IDQwM1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlRmllbGQocmVxOmV4cHJlc3MuUmVxdWVzdCwgcmVzOmV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6YW55KSB7XHJcbiAgbGV0IGNhbmRpZGF0ZVNlcnZpY2UgPSBuZXcgQ2FuZGlkYXRlU2VydmljZSgpO1xyXG4gIHRyeSB7XHJcbiAgICBsZXQgdmFsdWU6IG51bWJlciA9IHJlcS5xdWVyeS52YWx1ZTtcclxuICAgIGxldCBkYXRhOmFueSA9IHskbWF4OiB7J3Byb2ZpbGVfdXBkYXRlX3RyYWNraW5nJzogTnVtYmVyKHZhbHVlKX19O1xyXG4gICAgbGV0IHVzZXJJZDpzdHJpbmcgPSByZXEucGFyYW1zLmlkO1xyXG4gICAgY2FuZGlkYXRlU2VydmljZS51cGRhdGVGaWVsZCh1c2VySWQsIGRhdGEsIChlcnJvcjphbnksIHJlc3VsdDphbnkpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgbmV4dCh7XHJcbiAgICAgICAgICByZWFzb246IE1lc3NhZ2VzLk1TR19FUlJPUl9GQUlMRURfVE9fVVBEQVRFX0NBTkRJREFURV9GSUVMRCxcclxuICAgICAgICAgIG1lc3NhZ2U6IE1lc3NhZ2VzLk1TR19FUlJPUl9GQUlMRURfVE9fVVBEQVRFX0NBTkRJREFURV9GSUVMRCxcclxuICAgICAgICAgIHN0YWNrVHJhY2U6IG5ldyBFcnJvcigpLFxyXG4gICAgICAgICAgY29kZTogNDAzXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgICAgJ3N0YXR1cyc6ICdzdWNjZXNzJyxcclxuICAgICAgICAgICdkYXRhJzogcmVzdWx0LFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbiAgY2F0Y2ggKGUpIHtcclxuICAgIG5leHQoe1xyXG4gICAgICByZWFzb246IGUubWVzc2FnZSxcclxuICAgICAgbWVzc2FnZTogZS5tZXNzYWdlLFxyXG4gICAgICBzdGFja1RyYWNlOiBuZXcgRXJyb3IoKSxcclxuICAgICAgY29kZTogNTAwXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG59XHJcbiJdfQ==
