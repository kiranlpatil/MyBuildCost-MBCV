"use strict";
var UserRepository = require("../dataaccess/repository/user.repository");
var SendMailService = require("./sendmail.service");
var sharedconstants_1 = require("../shared/sharedconstants");
var config = require('config');
var json2csv = require('json2csv');
var fs = require('fs');
var Messages = require("../shared/messages");
var MailAttachments = require("../shared/sharedarray");
var RecruiterRepository = require("../dataaccess/repository/recruiter.repository");
var UsersClassModel = require("../dataaccess/model/users");
var CandidateService = require("./candidate.service");
var RecruiterService = require("./recruiter.service");
var IndustryRepository = require("../dataaccess/repository/industry.repository");
var UserService = require("./user.service");
var usestracking = require('uses-tracking');
var AdminService = (function () {
    function AdminService() {
        this.userRepository = new UserRepository();
        this.industryRepositiry = new IndustryRepository();
        this.recruiterRepository = new RecruiterRepository();
        var obj = new usestracking.MyController();
        this.usesTrackingController = obj._controller;
    }
    AdminService.prototype.getUserDetails = function (userType, callback) {
        try {
            var userService = new UserService();
            var users_1 = new UsersClassModel();
            var usersMap_1 = new Map();
            var findQuery = new Object();
            if (userType == 'candidate') {
                findQuery = { 'isCandidate': true, 'isAdmin': false };
            }
            else {
                findQuery = { 'isCandidate': false, 'isAdmin': false };
            }
            var included_fields = {
                '_id': 1,
                'first_name': 1,
                'last_name': 1,
                'mobile_number': 1,
                'email': 1,
                'isActivated': 1
            };
            var sortingQuery = { 'first_name': 1, 'last_name': 1 };
            userService.retrieveBySortedOrder(findQuery, included_fields, sortingQuery, function (error, result) {
                if (error) {
                    callback(error, null);
                }
                else {
                    if (result.length == 0) {
                        callback(null, users_1);
                    }
                    else {
                        if (userType == 'candidate') {
                            var candidateService_1 = new CandidateService();
                            var candidates_1 = new Array(0);
                            var candidateFields = {
                                'userId': 1,
                                'jobTitle': 1,
                                'isCompleted': 1,
                                'isSubmitted': 1,
                                'location.city': 1,
                                'proficiencies': 1,
                                'professionalDetails': 1,
                                'capability_matrix': 1,
                                'isVisible': 1,
                                'industry.roles.name': 1
                            };
                            candidateService_1.retrieveWithLean({}, candidateFields, function (error, candidatesResult) {
                                if (error) {
                                    callback(error, null);
                                }
                                else {
                                    console.log("Fetched all candidates:" + candidatesResult.length);
                                    for (var _i = 0, candidatesResult_1 = candidatesResult; _i < candidatesResult_1.length; _i++) {
                                        var candidate = candidatesResult_1[_i];
                                        if (candidate.proficiencies.length > 0) {
                                            candidate.keySkills = candidate.proficiencies.toString().replace(/,/g, ' $');
                                        }
                                        if (candidate.industry) {
                                            candidate.roles = candidateService_1.loadRoles(candidate.industry.roles);
                                        }
                                        if (candidate.capability_matrix) {
                                            candidate.capabilityMatrix = candidateService_1.loadCapabilitiDetails(candidate.capability_matrix);
                                        }
                                        usersMap_1.set(candidate.userId.toString(), candidate);
                                    }
                                    for (var _a = 0, result_1 = result; _a < result_1.length; _a++) {
                                        var user = result_1[_a];
                                        user.data = usersMap_1.get(user._id.toString());
                                        candidates_1.push(user);
                                    }
                                    users_1.candidate = candidates_1;
                                    callback(null, users_1);
                                }
                            });
                        }
                        else {
                            console.log("inside recruiter fetch");
                            var recruiterService_1 = new RecruiterService();
                            var recruiters_1 = new Array(0);
                            var recruiterFields = {
                                'userId': 1,
                                'company_name': 1,
                                'company_size': 1,
                                'isRecruitingForself': 1,
                                'postedJobs.isJobPosted': 1,
                                'postedJobs.capability_matrix': 1,
                                'postedJobs.expiringDate': 1,
                                'postedJobs.postingDate': 1,
                                'postedJobs.jobTitle': 1,
                                'postedJobs.hiringManager': 1,
                                'postedJobs.department': 1,
                                'postedJobs.education': 1,
                                'postedJobs.experienceMinValue': 1,
                                'postedJobs.experienceMaxValue': 1,
                                'postedJobs.salaryMinValue': 1,
                                'postedJobs.salaryMaxValue': 1,
                                'postedJobs.joiningPeriod': 1,
                                'postedJobs.proficiencies': 1,
                                'postedJobs.additionalProficiencies': 1,
                                'postedJobs.industry.name': 1,
                                'postedJobs.industry.roles.name': 1,
                            };
                            recruiterService_1.retrieveWithLean({}, recruiterFields, function (error, recruiterResult) {
                                if (error) {
                                    callback(error, null);
                                }
                                else {
                                    console.log("Fetched all recruiters:" + recruiterResult.length);
                                    for (var _i = 0, recruiterResult_1 = recruiterResult; _i < recruiterResult_1.length; _i++) {
                                        var recruiter = recruiterResult_1[_i];
                                        recruiter.numberOfJobsPosted = recruiter.postedJobs.length;
                                        recruiterService_1.loadCapbilityAndKeySkills(recruiter.postedJobs);
                                        usersMap_1.set(recruiter.userId.toString(), recruiter);
                                    }
                                    for (var _a = 0, result_2 = result; _a < result_2.length; _a++) {
                                        var user = result_2[_a];
                                        user.data = usersMap_1.get(user._id.toString());
                                        recruiters_1.push(user);
                                    }
                                    users_1.recruiter = recruiters_1;
                                    callback(null, users_1);
                                }
                            });
                        }
                    }
                }
            });
        }
        catch (e) {
            callback(e, null);
        }
    };
    ;
    AdminService.prototype.getCountOfUsers = function (item, callback) {
        try {
            var candidateService = new CandidateService();
            var recruiterService_2 = new RecruiterService();
            var users_2 = new UsersClassModel();
            var findQuery = new Object();
            candidateService.getTotalCandidateCount(function (error, candidateCount) {
                if (error) {
                    callback(error, null);
                }
                else {
                    users_2.totalNumberOfCandidates = candidateCount;
                    recruiterService_2.getTotalRecruiterCount(function (error, recruiterCount) {
                        if (error) {
                            callback(error, null);
                        }
                        else {
                            users_2.totalNumberOfRecruiters = recruiterCount;
                            callback(null, users_2);
                        }
                    });
                }
            });
        }
        catch (e) {
            callback(e, null);
        }
    };
    AdminService.prototype.getRecruiterDetails = function (initial, callback) {
        try {
            var userService_1 = new UserService();
            var users_3 = new UsersClassModel();
            var usersMap_2 = new Map();
            var recruiterService = new RecruiterService();
            var recruiters_2 = new Array(0);
            var regEx = new RegExp('^[' + initial.toLowerCase() + initial.toUpperCase() + ']');
            var findQuery = {
                'company_name': {
                    $regex: regEx
                }
            };
            var sortingQuery = { 'company_name': 1, 'company_size': 1 };
            var recruiterFields = {
                'userId': 1,
                'company_name': 1,
                'company_size': 1,
                'postedJobs.isJobPosted': 1
            };
            recruiterService.retrieveBySortedOrder(findQuery, recruiterFields, sortingQuery, function (error, recruiterResult) {
                if (error) {
                    callback(error, null);
                }
                else {
                    users_3.totalNumberOfRecruiters = recruiterResult.length;
                    if (recruiterResult.length == 0) {
                        callback(null, users_3);
                    }
                    else {
                        var userFields = {
                            '_id': 1,
                            'mobile_number': 1,
                            'email': 1,
                            'isActivated': 1
                        };
                        for (var _i = 0, recruiterResult_2 = recruiterResult; _i < recruiterResult_2.length; _i++) {
                            var recruiter = recruiterResult_2[_i];
                            usersMap_2.set(recruiter.userId.toString(), recruiter);
                        }
                        userService_1.retrieveWithLean({ 'isCandidate': false }, function (error, result) {
                            if (error) {
                                callback(error, null);
                            }
                            else {
                                console.log("Fetched all recruiters from users:" + recruiterResult.length);
                                for (var _i = 0, result_3 = result; _i < result_3.length; _i++) {
                                    var user = result_3[_i];
                                    user.data = usersMap_2.get(user._id.toString());
                                    recruiters_2.push(user);
                                }
                                users_3.recruiter = recruiters_2;
                                callback(null, users_3);
                            }
                        });
                    }
                }
            });
        }
        catch (e) {
            callback(e, null);
        }
    };
    AdminService.prototype.getCandidateDetails = function (initial, callback) {
        try {
            var userService = new UserService();
            var users_4 = new UsersClassModel();
            var usersMap_3 = new Map();
            var candidates_2 = new Array(0);
            var candidateService_2 = new CandidateService();
            var regEx = new RegExp('^[' + initial.toLowerCase() + initial.toUpperCase() + ']');
            var findQuery = {
                'first_name': {
                    $regex: regEx
                },
                'isAdmin': false,
                'isCandidate': true
            };
            var included_fields = {
                '_id': 1,
                'first_name': 1,
                'last_name': 1,
                'mobile_number': 1,
                'email': 1,
                'isActivated': 1
            };
            var sortingQuery = { 'first_name': 1, 'last_name': 1 };
            userService.retrieveBySortedOrder(findQuery, included_fields, sortingQuery, function (error, result) {
                if (error) {
                    callback(error, null);
                }
                else {
                    users_4.totalNumberOfCandidates = result.length;
                    if (result.length == 0) {
                        callback(null, users_4);
                    }
                    else {
                        var value = 0;
                        var candidateFields = {
                            'userId': 1,
                            'jobTitle': 1,
                            'isCompleted': 1,
                            'isSubmitted': 1,
                            'isVisible': 1,
                            'location.city': 1
                        };
                        candidateService_2.retrieveWithLean({}, candidateFields, function (error, candidatesResult) {
                            if (error) {
                                callback(error, null);
                            }
                            else {
                                console.log("Fetched all candidates:" + candidatesResult.length);
                                for (var _i = 0, candidatesResult_2 = candidatesResult; _i < candidatesResult_2.length; _i++) {
                                    var candidate = candidatesResult_2[_i];
                                    usersMap_3.set(candidate.userId.toString(), candidate);
                                }
                                for (var _a = 0, result_4 = result; _a < result_4.length; _a++) {
                                    var user = result_4[_a];
                                    user.data = usersMap_3.get(user._id.toString());
                                    candidates_2.push(user);
                                }
                                users_4.candidate = candidates_2;
                                callback(null, users_4);
                            }
                        });
                    }
                }
            });
        }
        catch (e) {
            callback(e, null);
        }
    };
    AdminService.prototype.addUsageDetailsValue = function (item, callback) {
        try {
            var value = 0;
            for (var i = 0; i < item.length; i++) {
                value++;
                item[i].action = sharedconstants_1.ConstVariables.ActionsArray[item[i].action];
                if (item.length === value) {
                    callback(null, item);
                }
            }
        }
        catch (e) {
            callback(e, null);
        }
    };
    ;
    AdminService.prototype.generateUsageDetailFile = function (result, callback) {
        if (result && result.length > 0) {
            var fields = ['candidateId', 'recruiterId', 'jobProfileId', 'action', 'timestamp'];
            var fieldNames = ['Candidate Id', 'RecruiterId', 'Job Profile Id', 'Action', 'TimeStamp'];
            var csv = json2csv({ data: result, fields: fields, fieldNames: fieldNames });
            fs.writeFile('/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/usagedetail.csv', csv, function (err) {
                if (err)
                    throw err;
                callback(null, result);
            });
        }
        else {
            callback(null, result);
        }
    };
    ;
    AdminService.prototype.generateCandidateDetailFile = function (result, callback) {
        console.log("inside generate file");
        if (result.candidate && result.candidate.length > 0) {
            var fields = ['first_name', 'last_name', 'mobile_number', 'email', 'isActivated', 'data.location.city',
                'data.professionalDetails.education', 'data.professionalDetails.experience',
                'data.professionalDetails.currentSalary', 'data.professionalDetails.noticePeriod',
                'data.professionalDetails.relocate', 'data.professionalDetails.industryExposure',
                'data.professionalDetails.currentCompany', 'data.isCompleted', 'data.isSubmitted', 'data.isVisible',
                'data.keySkills', 'data.industry.name', 'data.roles', 'data.capabilityMatrix.capabilityCode',
                'data.capabilityMatrix.complexityCode', 'data.capabilityMatrix.scenerioCode'];
            var fieldNames = ['First Name', 'Last Name', 'Mobile Number', 'Email', 'Is Activated', 'City', 'Education',
                'Experience', 'Current Salary', 'Notice Period', 'Ready To Relocate', 'Industry Exposure', 'Current Company',
                'Is Completed', 'Is Submitted', 'Is Visible', 'Key Skills', 'Industry', 'Role', 'Capability Code',
                'Complexity Code', 'Scenario Code'];
            var tempString_1 = '';
            var count_1 = 0;
            var candidateLength_1 = result.candidate.length;
            for (var _i = 0, _a = result.candidate; _i < _a.length; _i++) {
                var candidate = _a[_i];
                tempString_1 = json2csv({
                    data: candidate, fields: fields, fieldNames: fieldNames,
                    unwindPath: ['data.capabilityMatrix']
                }, function (err, result) {
                    count_1++;
                    tempString_1 += result;
                    if (count_1 == candidateLength_1) {
                        console.log("writing into file file");
                        fs.writeFile('/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/candidate.csv', tempString_1, function (err) {
                            if (err)
                                throw err;
                            callback(null, result);
                        });
                    }
                });
            }
        }
        else {
            callback(null, result);
        }
    };
    ;
    AdminService.prototype.generateRecruiterDetailFile = function (result, callback) {
        console.log("inside generate file");
        if (result.recruiter && result.recruiter.length > 0) {
            var fields = ['data.company_name', 'data.company_size', 'data.isRecruitingForself',
                'data.numberOfJobsPosted', 'mobile_number', 'email', 'isActivated', 'data.postedJobs.isJobPosted',
                'data.postedJobs.jobTitle', 'data.postedJobs.hiringManager', 'data.postedJobs.department',
                'data.postedJobs.education', 'data.postedJobs.experienceMinValue', 'data.postedJobs.experienceMaxValue',
                'data.postedJobs.salaryMinValue', 'data.postedJobs.salaryMaxValue', 'data.postedJobs.joiningPeriod',
                'data.postedJobs.keySkills', 'data.postedJobs.additionalKeySkills', 'data.postedJobs.industry.name',
                'data.postedJobs.roles', 'data.postedJobs.capabilityMatrix.capabilityCode',
                'data.postedJobs.capabilityMatrix.complexityCode', 'data.postedJobs.capabilityMatrix.scenerioCode',
                'data.postedJobs.postingDate', 'data.postedJobs.expiringDate'];
            var fieldNames = ['Company Name', 'company size', 'Recruiting For Self', 'Number of Job Posted', 'Mobile Number',
                'Email', 'Is Activated', 'Is Job Posted', 'Job Title', 'Hiring Manager', 'Department', 'Education',
                'Experience MinValue', 'Experience MaxValue', 'Salary MinValue', 'Salary MaxValue', 'Joining Period',
                'Key Skills', 'Additional Key Skills', 'Industry', 'Role', 'Capability Code',
                'Complexity Code', 'Scenario Code', 'Posting Date', 'Expiring Date'];
            var tempString_2 = '';
            var count_2 = 0;
            var recruiterLength_1 = result.recruiter.length;
            for (var _i = 0, _a = result.recruiter; _i < _a.length; _i++) {
                var recruiter = _a[_i];
                tempString_2 = json2csv({
                    data: recruiter, fields: fields, fieldNames: fieldNames,
                    unwindPath: ['data.postedJobs', 'data.postedJobs.capabilityMatrix']
                }, function (err, result) {
                    count_2++;
                    tempString_2 += result;
                    if (count_2 == recruiterLength_1) {
                        console.log("writing into file file");
                        fs.writeFile('/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/recruiter.csv', tempString_2, function (err) {
                            if (err)
                                throw err;
                            callback(null, result);
                        });
                    }
                });
            }
        }
        else {
            callback(null, result);
        }
    };
    ;
    AdminService.prototype.sendAdminLoginInfoMail = function (field, callback) {
        var header1 = fs.readFileSync('./src/server/app/framework/public/header1.html').toString();
        var content = fs.readFileSync('./src/server/app/framework/public/adminlogininfo.mail.html').toString();
        var footer1 = fs.readFileSync('./src/server/app/framework/public/footer1.html').toString();
        var mid_content = content.replace('$email$', field.email).replace('$address$', (field.location === undefined) ? 'Not Found' : field.location)
            .replace('$ip$', field.ip).replace('$host$', config.get('TplSeed.mail.host'));
        var mailOptions = {
            from: config.get('TplSeed.mail.MAIL_SENDER'),
            to: config.get('TplSeed.mail.ADMIN_MAIL'),
            cc: config.get('TplSeed.mail.TPLGROUP_MAIL'),
            subject: Messages.EMAIL_SUBJECT_ADMIN_LOGGED_ON + " " + config.get('TplSeed.mail.host'),
            html: header1 + mid_content + footer1,
            attachments: MailAttachments.AttachmentArray
        };
        var sendMailService = new SendMailService();
        sendMailService.sendMail(mailOptions, callback);
    };
    ;
    AdminService.prototype.updateUser = function (_id, item, callback) {
        var _this = this;
        this.userRepository.findById(_id, function (err, res) {
            if (err) {
                callback(err, res);
            }
            else {
                _this.userRepository.update(res._id, item, callback);
            }
        });
    };
    ;
    AdminService.prototype.getUsageDetails = function (field, callback) {
        this.usesTrackingController.retrieveAll(function (err, res) {
            if (err) {
                callback(err, null);
            }
            else {
                callback(null, res);
            }
        });
    };
    return AdminService;
}());
Object.seal(AdminService);
module.exports = AdminService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvYWRtaW4uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBR0EseUVBQTRFO0FBQzVFLG9EQUF1RDtBQUN2RCw2REFBeUQ7QUFDekQsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNuQyxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsNkNBQWdEO0FBQ2hELHVEQUEwRDtBQUMxRCxtRkFBc0Y7QUFDdEYsMkRBQThEO0FBQzlELHNEQUF5RDtBQUN6RCxzREFBeUQ7QUFFekQsaUZBQW9GO0FBSXBGLDRDQUErQztBQUMvQyxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFFNUM7SUFRRTtRQUNFLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztRQUMzQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxrQkFBa0IsRUFBRSxDQUFDO1FBQ25ELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLG1CQUFtQixFQUFFLENBQUM7UUFDckQsSUFBSSxHQUFHLEdBQVEsSUFBSSxZQUFZLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDL0MsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUM7SUFDaEQsQ0FBQztJQUVELHFDQUFjLEdBQWQsVUFBZSxRQUFnQixFQUFFLFFBQXVEO1FBQ3RGLElBQUksQ0FBQztZQUNILElBQUksV0FBVyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7WUFDcEMsSUFBSSxPQUFLLEdBQW9CLElBQUksZUFBZSxFQUFFLENBQUM7WUFDbkQsSUFBSSxVQUFRLEdBQWtCLElBQUksR0FBRyxFQUFFLENBQUM7WUFDeEMsSUFBSSxTQUFTLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FB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SSxDQUFDLENBQUM7Z0JBQ04sUUFBUSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN0QixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFTCxDQUFDO0lBQ0gsbUJBQUM7QUFBRCxDQW5oQkEsQUFtaEJDLElBQUE7QUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzFCLGlCQUFTLFlBQVksQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL3NlcnZpY2VzL2FkbWluLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQ3JlYXRlZCBieSB0ZWNocHJpbWUwMDIgb24gOC8yOC8yMDE3LlxyXG4gKi9cclxuaW1wb3J0IFVzZXJSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L3VzZXIucmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgU2VuZE1haWxTZXJ2aWNlID0gcmVxdWlyZSgnLi9zZW5kbWFpbC5zZXJ2aWNlJyk7XHJcbmltcG9ydCB7Q29uc3RWYXJpYWJsZXN9IGZyb20gXCIuLi9zaGFyZWQvc2hhcmVkY29uc3RhbnRzXCI7XHJcbmxldCBjb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcclxubGV0IGpzb24yY3N2ID0gcmVxdWlyZSgnanNvbjJjc3YnKTtcclxubGV0IGZzID0gcmVxdWlyZSgnZnMnKTtcclxuaW1wb3J0IE1lc3NhZ2VzID0gcmVxdWlyZSgnLi4vc2hhcmVkL21lc3NhZ2VzJyk7XHJcbmltcG9ydCBNYWlsQXR0YWNobWVudHMgPSByZXF1aXJlKCcuLi9zaGFyZWQvc2hhcmVkYXJyYXknKTtcclxuaW1wb3J0IFJlY3J1aXRlclJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvcmVjcnVpdGVyLnJlcG9zaXRvcnknKTtcclxuaW1wb3J0IFVzZXJzQ2xhc3NNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvdXNlcnMnKTtcclxuaW1wb3J0IENhbmRpZGF0ZVNlcnZpY2UgPSByZXF1aXJlKCcuL2NhbmRpZGF0ZS5zZXJ2aWNlJyk7XHJcbmltcG9ydCBSZWNydWl0ZXJTZXJ2aWNlID0gcmVxdWlyZSgnLi9yZWNydWl0ZXIuc2VydmljZScpO1xyXG5pbXBvcnQgSW5kdXN0cnlNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvaW5kdXN0cnkubW9kZWwnKTtcclxuaW1wb3J0IEluZHVzdHJ5UmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9pbmR1c3RyeS5yZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBDYW5kaWRhdGVNb2RlbENsYXNzID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9jYW5kaWRhdGVDbGFzcy5tb2RlbCcpO1xyXG5pbXBvcnQgUmVjcnVpdGVyQ2xhc3NNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcmVjcnVpdGVyQ2xhc3MubW9kZWwnKTtcclxuaW1wb3J0IENhbmRpZGF0ZUNsYXNzTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL2NhbmRpZGF0ZS1jbGFzcy5tb2RlbCcpO1xyXG5pbXBvcnQgVXNlclNlcnZpY2UgPSByZXF1aXJlKFwiLi91c2VyLnNlcnZpY2VcIik7XHJcbmxldCB1c2VzdHJhY2tpbmcgPSByZXF1aXJlKCd1c2VzLXRyYWNraW5nJyk7XHJcblxyXG5jbGFzcyBBZG1pblNlcnZpY2Uge1xyXG4gIGNvbXBhbnlfbmFtZTogc3RyaW5nO1xyXG4gIHByaXZhdGUgdXNlclJlcG9zaXRvcnk6IFVzZXJSZXBvc2l0b3J5O1xyXG4gIHByaXZhdGUgaW5kdXN0cnlSZXBvc2l0aXJ5OiBJbmR1c3RyeVJlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSByZWNydWl0ZXJSZXBvc2l0b3J5OiBSZWNydWl0ZXJSZXBvc2l0b3J5O1xyXG4gIHByaXZhdGUgdXNlc1RyYWNraW5nQ29udHJvbGxlcjogYW55O1xyXG5cclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5ID0gbmV3IFVzZXJSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLmluZHVzdHJ5UmVwb3NpdGlyeSA9IG5ldyBJbmR1c3RyeVJlcG9zaXRvcnkoKTtcclxuICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeSA9IG5ldyBSZWNydWl0ZXJSZXBvc2l0b3J5KCk7XHJcbiAgICBsZXQgb2JqOiBhbnkgPSBuZXcgdXNlc3RyYWNraW5nLk15Q29udHJvbGxlcigpO1xyXG4gICAgdGhpcy51c2VzVHJhY2tpbmdDb250cm9sbGVyID0gb2JqLl9jb250cm9sbGVyO1xyXG4gIH1cclxuXHJcbiAgZ2V0VXNlckRldGFpbHModXNlclR5cGU6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IFVzZXJzQ2xhc3NNb2RlbCkgPT4gdm9pZCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCB1c2VyczogVXNlcnNDbGFzc01vZGVsID0gbmV3IFVzZXJzQ2xhc3NNb2RlbCgpO1xyXG4gICAgICBsZXQgdXNlcnNNYXA6IE1hcDxhbnksIGFueT4gPSBuZXcgTWFwKCk7XHJcbiAgICAgIGxldCBmaW5kUXVlcnkgPSBuZXcgT2JqZWN0KCk7XHJcblxyXG4gICAgICBpZiAodXNlclR5cGUgPT0gJ2NhbmRpZGF0ZScpIHtcclxuICAgICAgICBmaW5kUXVlcnkgPSB7J2lzQ2FuZGlkYXRlJzogdHJ1ZSwgJ2lzQWRtaW4nOiBmYWxzZX07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZmluZFF1ZXJ5ID0geydpc0NhbmRpZGF0ZSc6IGZhbHNlLCAnaXNBZG1pbic6IGZhbHNlfTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGluY2x1ZGVkX2ZpZWxkcyA9IHtcclxuICAgICAgICAnX2lkJzogMSxcclxuICAgICAgICAnZmlyc3RfbmFtZSc6IDEsXHJcbiAgICAgICAgJ2xhc3RfbmFtZSc6IDEsXHJcbiAgICAgICAgJ21vYmlsZV9udW1iZXInOiAxLFxyXG4gICAgICAgICdlbWFpbCc6IDEsXHJcbiAgICAgICAgJ2lzQWN0aXZhdGVkJzogMVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgbGV0IHNvcnRpbmdRdWVyeSA9IHsnZmlyc3RfbmFtZSc6IDEsICdsYXN0X25hbWUnOiAxfTtcclxuXHJcbiAgICAgIHVzZXJTZXJ2aWNlLnJldHJpZXZlQnlTb3J0ZWRPcmRlcihmaW5kUXVlcnksIGluY2x1ZGVkX2ZpZWxkcywgc29ydGluZ1F1ZXJ5LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHVzZXJzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodXNlclR5cGUgPT0gJ2NhbmRpZGF0ZScpIHtcclxuICAgICAgICAgICAgICBsZXQgY2FuZGlkYXRlU2VydmljZSA9IG5ldyBDYW5kaWRhdGVTZXJ2aWNlKCk7XHJcbiAgICAgICAgICAgICAgbGV0IGNhbmRpZGF0ZXM6IENhbmRpZGF0ZU1vZGVsQ2xhc3NbXSA9IG5ldyBBcnJheSgwKTtcclxuICAgICAgICAgICAgICBsZXQgY2FuZGlkYXRlRmllbGRzID0ge1xyXG4gICAgICAgICAgICAgICAgJ3VzZXJJZCc6IDEsXHJcbiAgICAgICAgICAgICAgICAnam9iVGl0bGUnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ2lzQ29tcGxldGVkJzogMSxcclxuICAgICAgICAgICAgICAgICdpc1N1Ym1pdHRlZCc6IDEsXHJcbiAgICAgICAgICAgICAgICAnbG9jYXRpb24uY2l0eSc6IDEsXHJcbiAgICAgICAgICAgICAgICAncHJvZmljaWVuY2llcyc6IDEsXHJcbiAgICAgICAgICAgICAgICAncHJvZmVzc2lvbmFsRGV0YWlscyc6IDEsXHJcbiAgICAgICAgICAgICAgICAnY2FwYWJpbGl0eV9tYXRyaXgnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ2lzVmlzaWJsZSc6IDEsXHJcbiAgICAgICAgICAgICAgICAnaW5kdXN0cnkucm9sZXMubmFtZSc6IDFcclxuICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgIGNhbmRpZGF0ZVNlcnZpY2UucmV0cmlldmVXaXRoTGVhbih7fSwgY2FuZGlkYXRlRmllbGRzLCAoZXJyb3IsIGNhbmRpZGF0ZXNSZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZldGNoZWQgYWxsIGNhbmRpZGF0ZXM6XCIgKyBjYW5kaWRhdGVzUmVzdWx0Lmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgIGZvciAobGV0IGNhbmRpZGF0ZSBvZiBjYW5kaWRhdGVzUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbmRpZGF0ZS5wcm9maWNpZW5jaWVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZS5rZXlTa2lsbHMgPSBjYW5kaWRhdGUucHJvZmljaWVuY2llcy50b1N0cmluZygpLnJlcGxhY2UoLywvZywgJyAkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2FuZGlkYXRlLmluZHVzdHJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjYW5kaWRhdGUucm9sZXMgPSBjYW5kaWRhdGVTZXJ2aWNlLmxvYWRSb2xlcyhjYW5kaWRhdGUuaW5kdXN0cnkucm9sZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbmRpZGF0ZS5jYXBhYmlsaXR5X21hdHJpeCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY2FuZGlkYXRlLmNhcGFiaWxpdHlNYXRyaXggPSBjYW5kaWRhdGVTZXJ2aWNlLmxvYWRDYXBhYmlsaXRpRGV0YWlscyhjYW5kaWRhdGUuY2FwYWJpbGl0eV9tYXRyaXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB1c2Vyc01hcC5zZXQoY2FuZGlkYXRlLnVzZXJJZC50b1N0cmluZygpLCBjYW5kaWRhdGUpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICBmb3IgKGxldCB1c2VyIG9mIHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXIuZGF0YSA9IHVzZXJzTWFwLmdldCh1c2VyLl9pZC50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgICAgICBjYW5kaWRhdGVzLnB1c2godXNlcik7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgIHVzZXJzLmNhbmRpZGF0ZSA9IGNhbmRpZGF0ZXM7XHJcbiAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHVzZXJzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImluc2lkZSByZWNydWl0ZXIgZmV0Y2hcIik7XHJcbiAgICAgICAgICAgICAgbGV0IHJlY3J1aXRlclNlcnZpY2UgPSBuZXcgUmVjcnVpdGVyU2VydmljZSgpO1xyXG4gICAgICAgICAgICAgIGxldCByZWNydWl0ZXJzOiBSZWNydWl0ZXJDbGFzc01vZGVsW10gPSBuZXcgQXJyYXkoMCk7XHJcbiAgICAgICAgICAgICAgbGV0IHJlY3J1aXRlckZpZWxkcyA9IHtcclxuICAgICAgICAgICAgICAgICd1c2VySWQnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ2NvbXBhbnlfbmFtZSc6IDEsXHJcbiAgICAgICAgICAgICAgICAnY29tcGFueV9zaXplJzogMSxcclxuICAgICAgICAgICAgICAgICdpc1JlY3J1aXRpbmdGb3JzZWxmJzogMSxcclxuICAgICAgICAgICAgICAgICdwb3N0ZWRKb2JzLmlzSm9iUG9zdGVkJzogMSxcclxuICAgICAgICAgICAgICAgICdwb3N0ZWRKb2JzLmNhcGFiaWxpdHlfbWF0cml4JzogMSxcclxuICAgICAgICAgICAgICAgICdwb3N0ZWRKb2JzLmV4cGlyaW5nRGF0ZSc6IDEsXHJcbiAgICAgICAgICAgICAgICAncG9zdGVkSm9icy5wb3N0aW5nRGF0ZSc6IDEsXHJcbiAgICAgICAgICAgICAgICAncG9zdGVkSm9icy5qb2JUaXRsZSc6IDEsXHJcbiAgICAgICAgICAgICAgICAncG9zdGVkSm9icy5oaXJpbmdNYW5hZ2VyJzogMSxcclxuICAgICAgICAgICAgICAgICdwb3N0ZWRKb2JzLmRlcGFydG1lbnQnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ3Bvc3RlZEpvYnMuZWR1Y2F0aW9uJzogMSxcclxuICAgICAgICAgICAgICAgICdwb3N0ZWRKb2JzLmV4cGVyaWVuY2VNaW5WYWx1ZSc6IDEsXHJcbiAgICAgICAgICAgICAgICAncG9zdGVkSm9icy5leHBlcmllbmNlTWF4VmFsdWUnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ3Bvc3RlZEpvYnMuc2FsYXJ5TWluVmFsdWUnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ3Bvc3RlZEpvYnMuc2FsYXJ5TWF4VmFsdWUnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ3Bvc3RlZEpvYnMuam9pbmluZ1BlcmlvZCc6IDEsXHJcbiAgICAgICAgICAgICAgICAncG9zdGVkSm9icy5wcm9maWNpZW5jaWVzJzogMSxcclxuICAgICAgICAgICAgICAgICdwb3N0ZWRKb2JzLmFkZGl0aW9uYWxQcm9maWNpZW5jaWVzJzogMSxcclxuICAgICAgICAgICAgICAgICdwb3N0ZWRKb2JzLmluZHVzdHJ5Lm5hbWUnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ3Bvc3RlZEpvYnMuaW5kdXN0cnkucm9sZXMubmFtZSc6IDEsXHJcbiAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgcmVjcnVpdGVyU2VydmljZS5yZXRyaWV2ZVdpdGhMZWFuKHt9LCByZWNydWl0ZXJGaWVsZHMsIChlcnJvciwgcmVjcnVpdGVyUmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGZXRjaGVkIGFsbCByZWNydWl0ZXJzOlwiICsgcmVjcnVpdGVyUmVzdWx0Lmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgIGZvciAobGV0IHJlY3J1aXRlciBvZiByZWNydWl0ZXJSZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZWNydWl0ZXIubnVtYmVyT2ZKb2JzUG9zdGVkID0gcmVjcnVpdGVyLnBvc3RlZEpvYnMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlY3J1aXRlclNlcnZpY2UubG9hZENhcGJpbGl0eUFuZEtleVNraWxscyhyZWNydWl0ZXIucG9zdGVkSm9icyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcnNNYXAuc2V0KHJlY3J1aXRlci51c2VySWQudG9TdHJpbmcoKSwgcmVjcnVpdGVyKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdXNlciBvZiByZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICB1c2VyLmRhdGEgPSB1c2Vyc01hcC5nZXQodXNlci5faWQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVjcnVpdGVycy5wdXNoKHVzZXIpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICB1c2Vycy5yZWNydWl0ZXIgPSByZWNydWl0ZXJzO1xyXG4gICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB1c2Vycyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoXHJcbiAgICAgIChlKSB7XHJcbiAgICAgIGNhbGxiYWNrKGUsIG51bGwpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGdldENvdW50T2ZVc2VycyhpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCBjYW5kaWRhdGVTZXJ2aWNlID0gbmV3IENhbmRpZGF0ZVNlcnZpY2UoKTtcclxuICAgICAgbGV0IHJlY3J1aXRlclNlcnZpY2UgPSBuZXcgUmVjcnVpdGVyU2VydmljZSgpO1xyXG4gICAgICBsZXQgdXNlcnM6IFVzZXJzQ2xhc3NNb2RlbCA9IG5ldyBVc2Vyc0NsYXNzTW9kZWwoKTtcclxuICAgICAgbGV0IGZpbmRRdWVyeSA9IG5ldyBPYmplY3QoKTtcclxuXHJcbiAgICAgIGNhbmRpZGF0ZVNlcnZpY2UuZ2V0VG90YWxDYW5kaWRhdGVDb3VudCgoZXJyb3IsIGNhbmRpZGF0ZUNvdW50KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHVzZXJzLnRvdGFsTnVtYmVyT2ZDYW5kaWRhdGVzID0gY2FuZGlkYXRlQ291bnQ7XHJcbiAgICAgICAgICByZWNydWl0ZXJTZXJ2aWNlLmdldFRvdGFsUmVjcnVpdGVyQ291bnQoKGVycm9yLCByZWNydWl0ZXJDb3VudCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdXNlcnMudG90YWxOdW1iZXJPZlJlY3J1aXRlcnMgPSByZWNydWl0ZXJDb3VudDtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB1c2Vycyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaFxyXG4gICAgICAoZSkge1xyXG4gICAgICBjYWxsYmFjayhlLCBudWxsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldFJlY3J1aXRlckRldGFpbHMoaW5pdGlhbDogc3RyaW5nLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgbGV0IHVzZXJzOiBVc2Vyc0NsYXNzTW9kZWwgPSBuZXcgVXNlcnNDbGFzc01vZGVsKCk7XHJcbiAgICAgIGxldCB1c2Vyc01hcDogTWFwPGFueSwgYW55PiA9IG5ldyBNYXAoKTtcclxuXHJcbiAgICAgIGxldCByZWNydWl0ZXJTZXJ2aWNlID0gbmV3IFJlY3J1aXRlclNlcnZpY2UoKTtcclxuICAgICAgbGV0IHJlY3J1aXRlcnM6IFJlY3J1aXRlckNsYXNzTW9kZWxbXSA9IG5ldyBBcnJheSgwKTtcclxuXHJcbiAgICAgIGxldCByZWdFeCA9IG5ldyBSZWdFeHAoJ15bJyArIGluaXRpYWwudG9Mb3dlckNhc2UoKSArIGluaXRpYWwudG9VcHBlckNhc2UoKSArICddJyk7XHJcbiAgICAgIGxldCBmaW5kUXVlcnkgPSB7XHJcbiAgICAgICAgJ2NvbXBhbnlfbmFtZSc6IHtcclxuICAgICAgICAgICRyZWdleDogcmVnRXhcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgbGV0IHNvcnRpbmdRdWVyeSA9IHsnY29tcGFueV9uYW1lJzogMSwgJ2NvbXBhbnlfc2l6ZSc6IDF9O1xyXG5cclxuICAgICAgbGV0IHJlY3J1aXRlckZpZWxkcyA9IHtcclxuICAgICAgICAndXNlcklkJzogMSxcclxuICAgICAgICAnY29tcGFueV9uYW1lJzogMSxcclxuICAgICAgICAnY29tcGFueV9zaXplJzogMSxcclxuICAgICAgICAncG9zdGVkSm9icy5pc0pvYlBvc3RlZCc6IDFcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJlY3J1aXRlclNlcnZpY2UucmV0cmlldmVCeVNvcnRlZE9yZGVyKGZpbmRRdWVyeSwgcmVjcnVpdGVyRmllbGRzLCBzb3J0aW5nUXVlcnksIChlcnJvciwgcmVjcnVpdGVyUmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHVzZXJzLnRvdGFsTnVtYmVyT2ZSZWNydWl0ZXJzID0gcmVjcnVpdGVyUmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICAgIGlmIChyZWNydWl0ZXJSZXN1bHQubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXNlcnMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCB1c2VyRmllbGRzID0ge1xyXG4gICAgICAgICAgICAgICdfaWQnOiAxLFxyXG4gICAgICAgICAgICAgICdtb2JpbGVfbnVtYmVyJzogMSxcclxuICAgICAgICAgICAgICAnZW1haWwnOiAxLFxyXG4gICAgICAgICAgICAgICdpc0FjdGl2YXRlZCc6IDFcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IHJlY3J1aXRlciBvZiByZWNydWl0ZXJSZXN1bHQpIHtcclxuICAgICAgICAgICAgICB1c2Vyc01hcC5zZXQocmVjcnVpdGVyLnVzZXJJZC50b1N0cmluZygpLCByZWNydWl0ZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHVzZXJTZXJ2aWNlLnJldHJpZXZlV2l0aExlYW4oeydpc0NhbmRpZGF0ZSc6IGZhbHNlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGZXRjaGVkIGFsbCByZWNydWl0ZXJzIGZyb20gdXNlcnM6XCIgKyByZWNydWl0ZXJSZXN1bHQubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHVzZXIgb2YgcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgIHVzZXIuZGF0YSA9IHVzZXJzTWFwLmdldCh1c2VyLl9pZC50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgICAgcmVjcnVpdGVycy5wdXNoKHVzZXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHVzZXJzLnJlY3J1aXRlciA9IHJlY3J1aXRlcnM7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB1c2Vycyk7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGNhdGNoXHJcbiAgICAgIChlKSB7XHJcbiAgICAgIGNhbGxiYWNrKGUsIG51bGwpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0Q2FuZGlkYXRlRGV0YWlscyhpbml0aWFsOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICBsZXQgdXNlcnM6IFVzZXJzQ2xhc3NNb2RlbCA9IG5ldyBVc2Vyc0NsYXNzTW9kZWwoKTtcclxuICAgICAgbGV0IHVzZXJzTWFwOiBNYXA8YW55LCBhbnk+ID0gbmV3IE1hcCgpO1xyXG5cclxuICAgICAgbGV0IGNhbmRpZGF0ZXM6IENhbmRpZGF0ZU1vZGVsQ2xhc3NbXSA9IG5ldyBBcnJheSgwKTtcclxuICAgICAgbGV0IGNhbmRpZGF0ZVNlcnZpY2UgPSBuZXcgQ2FuZGlkYXRlU2VydmljZSgpO1xyXG5cclxuICAgICAgbGV0IHJlZ0V4ID0gbmV3IFJlZ0V4cCgnXlsnICsgaW5pdGlhbC50b0xvd2VyQ2FzZSgpICsgaW5pdGlhbC50b1VwcGVyQ2FzZSgpICsgJ10nKTtcclxuICAgICAgbGV0IGZpbmRRdWVyeSA9IHtcclxuICAgICAgICAnZmlyc3RfbmFtZSc6IHtcclxuICAgICAgICAgICRyZWdleDogcmVnRXhcclxuICAgICAgICB9LFxyXG4gICAgICAgICdpc0FkbWluJzogZmFsc2UsXHJcbiAgICAgICAgJ2lzQ2FuZGlkYXRlJzogdHJ1ZVxyXG4gICAgICB9O1xyXG4gICAgICBsZXQgaW5jbHVkZWRfZmllbGRzID0ge1xyXG4gICAgICAgICdfaWQnOiAxLFxyXG4gICAgICAgICdmaXJzdF9uYW1lJzogMSxcclxuICAgICAgICAnbGFzdF9uYW1lJzogMSxcclxuICAgICAgICAnbW9iaWxlX251bWJlcic6IDEsXHJcbiAgICAgICAgJ2VtYWlsJzogMSxcclxuICAgICAgICAnaXNBY3RpdmF0ZWQnOiAxXHJcbiAgICAgIH07XHJcbiAgICAgIGxldCBzb3J0aW5nUXVlcnkgPSB7J2ZpcnN0X25hbWUnOiAxLCAnbGFzdF9uYW1lJzogMX07XHJcblxyXG4gICAgICB1c2VyU2VydmljZS5yZXRyaWV2ZUJ5U29ydGVkT3JkZXIoZmluZFF1ZXJ5LCBpbmNsdWRlZF9maWVsZHMsIHNvcnRpbmdRdWVyeSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdXNlcnMudG90YWxOdW1iZXJPZkNhbmRpZGF0ZXMgPSByZXN1bHQubGVuZ3RoO1xyXG4gICAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB1c2Vycyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gMDtcclxuICAgICAgICAgICAgbGV0IGNhbmRpZGF0ZUZpZWxkcyA9IHtcclxuICAgICAgICAgICAgICAndXNlcklkJzogMSxcclxuICAgICAgICAgICAgICAnam9iVGl0bGUnOiAxLFxyXG4gICAgICAgICAgICAgICdpc0NvbXBsZXRlZCc6IDEsXHJcbiAgICAgICAgICAgICAgJ2lzU3VibWl0dGVkJzogMSxcclxuICAgICAgICAgICAgICAnaXNWaXNpYmxlJzogMSxcclxuICAgICAgICAgICAgICAnbG9jYXRpb24uY2l0eSc6IDFcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY2FuZGlkYXRlU2VydmljZS5yZXRyaWV2ZVdpdGhMZWFuKHt9LCBjYW5kaWRhdGVGaWVsZHMsIChlcnJvciwgY2FuZGlkYXRlc1Jlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZldGNoZWQgYWxsIGNhbmRpZGF0ZXM6XCIgKyBjYW5kaWRhdGVzUmVzdWx0Lmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjYW5kaWRhdGUgb2YgY2FuZGlkYXRlc1Jlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICB1c2Vyc01hcC5zZXQoY2FuZGlkYXRlLnVzZXJJZC50b1N0cmluZygpLCBjYW5kaWRhdGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHVzZXIgb2YgcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgIHVzZXIuZGF0YSA9IHVzZXJzTWFwLmdldCh1c2VyLl9pZC50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgICAgY2FuZGlkYXRlcy5wdXNoKHVzZXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHVzZXJzLmNhbmRpZGF0ZSA9IGNhbmRpZGF0ZXM7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB1c2Vycyk7XHJcblxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIGNhbGxiYWNrKGUsIG51bGwpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYWRkVXNhZ2VEZXRhaWxzVmFsdWUoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdmFsdWU6IG51bWJlciA9IDA7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhbHVlKys7XHJcbiAgICAgICAgaXRlbVtpXS5hY3Rpb24gPSBDb25zdFZhcmlhYmxlcy5BY3Rpb25zQXJyYXlbaXRlbVtpXS5hY3Rpb25dO1xyXG4gICAgICAgIGlmIChpdGVtLmxlbmd0aCA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBjYWxsYmFjayhlLCBudWxsKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBnZW5lcmF0ZVVzYWdlRGV0YWlsRmlsZShyZXN1bHQ6IGFueSwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgbGV0IGZpZWxkcyA9IFsnY2FuZGlkYXRlSWQnLCAncmVjcnVpdGVySWQnLCAnam9iUHJvZmlsZUlkJywgJ2FjdGlvbicsICd0aW1lc3RhbXAnXTtcclxuICAgICAgbGV0IGZpZWxkTmFtZXMgPSBbJ0NhbmRpZGF0ZSBJZCcsICdSZWNydWl0ZXJJZCcsICdKb2IgUHJvZmlsZSBJZCcsICdBY3Rpb24nLCAnVGltZVN0YW1wJ107XHJcbiAgICAgIGxldCBjc3YgPSBqc29uMmNzdih7ZGF0YTogcmVzdWx0LCBmaWVsZHM6IGZpZWxkcywgZmllbGROYW1lczogZmllbGROYW1lc30pO1xyXG4gICAgICAvL2ZzLndyaXRlRmlsZSgnLi9zcmMvc2VydmVyL3B1YmxpYy91c2FnZWRldGFpbC5jc3YnLCBjc3YsIGZ1bmN0aW9uIChlcnI6IGFueSkge1xyXG4gICAgICBmcy53cml0ZUZpbGUoJy9ob21lL2JpdG5hbWkvYXBwcy9qb2Jtb3Npcy1zdGFnaW5nL2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy91c2FnZWRldGFpbC5jc3YnLCBjc3YsIGZ1bmN0aW9uIChlcnI6IGFueSkge1xyXG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCByZXN1bHQpO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgZ2VuZXJhdGVDYW5kaWRhdGVEZXRhaWxGaWxlKHJlc3VsdDogYW55LCBjYWxsYmFjazogKGVycjogYW55LCByZXM6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgY29uc29sZS5sb2coXCJpbnNpZGUgZ2VuZXJhdGUgZmlsZVwiKTtcclxuICAgIGlmIChyZXN1bHQuY2FuZGlkYXRlICYmIHJlc3VsdC5jYW5kaWRhdGUubGVuZ3RoID4gMCkge1xyXG4gICAgICBsZXQgZmllbGRzID0gWydmaXJzdF9uYW1lJywgJ2xhc3RfbmFtZScsICdtb2JpbGVfbnVtYmVyJywgJ2VtYWlsJywgJ2lzQWN0aXZhdGVkJywgJ2RhdGEubG9jYXRpb24uY2l0eScsXHJcbiAgICAgICAgJ2RhdGEucHJvZmVzc2lvbmFsRGV0YWlscy5lZHVjYXRpb24nLCAnZGF0YS5wcm9mZXNzaW9uYWxEZXRhaWxzLmV4cGVyaWVuY2UnLFxyXG4gICAgICAgICdkYXRhLnByb2Zlc3Npb25hbERldGFpbHMuY3VycmVudFNhbGFyeScsICdkYXRhLnByb2Zlc3Npb25hbERldGFpbHMubm90aWNlUGVyaW9kJyxcclxuICAgICAgICAnZGF0YS5wcm9mZXNzaW9uYWxEZXRhaWxzLnJlbG9jYXRlJywgJ2RhdGEucHJvZmVzc2lvbmFsRGV0YWlscy5pbmR1c3RyeUV4cG9zdXJlJyxcclxuICAgICAgICAnZGF0YS5wcm9mZXNzaW9uYWxEZXRhaWxzLmN1cnJlbnRDb21wYW55JywgJ2RhdGEuaXNDb21wbGV0ZWQnLCAnZGF0YS5pc1N1Ym1pdHRlZCcsICdkYXRhLmlzVmlzaWJsZScsXHJcbiAgICAgICAgJ2RhdGEua2V5U2tpbGxzJywgJ2RhdGEuaW5kdXN0cnkubmFtZScsICdkYXRhLnJvbGVzJywgJ2RhdGEuY2FwYWJpbGl0eU1hdHJpeC5jYXBhYmlsaXR5Q29kZScsXHJcbiAgICAgICAgJ2RhdGEuY2FwYWJpbGl0eU1hdHJpeC5jb21wbGV4aXR5Q29kZScsICdkYXRhLmNhcGFiaWxpdHlNYXRyaXguc2NlbmVyaW9Db2RlJ107XHJcbiAgICAgIGxldCBmaWVsZE5hbWVzID0gWydGaXJzdCBOYW1lJywgJ0xhc3QgTmFtZScsICdNb2JpbGUgTnVtYmVyJywgJ0VtYWlsJywgJ0lzIEFjdGl2YXRlZCcsICdDaXR5JywgJ0VkdWNhdGlvbicsXHJcbiAgICAgICAgJ0V4cGVyaWVuY2UnLCAnQ3VycmVudCBTYWxhcnknLCAnTm90aWNlIFBlcmlvZCcsICdSZWFkeSBUbyBSZWxvY2F0ZScsICdJbmR1c3RyeSBFeHBvc3VyZScsICdDdXJyZW50IENvbXBhbnknLFxyXG4gICAgICAgICdJcyBDb21wbGV0ZWQnLCAnSXMgU3VibWl0dGVkJywgJ0lzIFZpc2libGUnLCAnS2V5IFNraWxscycsICdJbmR1c3RyeScsICdSb2xlJywgJ0NhcGFiaWxpdHkgQ29kZScsXHJcbiAgICAgICAgJ0NvbXBsZXhpdHkgQ29kZScsICdTY2VuYXJpbyBDb2RlJ107XHJcblxyXG4gICAgICAvKmxldCBjc3YgPSBqc29uMmNzdih7XHJcbiAgICAgICBkYXRhOiByZXN1bHQuY2FuZGlkYXRlLCBmaWVsZHM6IGZpZWxkcywgZmllbGROYW1lczogZmllbGROYW1lcyxcclxuICAgICAgIHVud2luZFBhdGg6IFsnZGF0YS5jYXBhYmlsaXR5TWF0cml4J11cclxuICAgICAgIH0pO1xyXG4gICAgICAgY29uc29sZS5sb2coXCJ3cml0aW5nIGludG8gZmlsZSBmaWxlXCIpO1xyXG4gICAgICAgLy9mcy53cml0ZUZpbGUoJy4vc3JjL3NlcnZlci9wdWJsaWMvY2FuZGlkYXRlLmNzdicsIGNzdiwgZnVuY3Rpb24gKGVycjogYW55KSB7XHJcbiAgICAgICBmcy53cml0ZUZpbGUoJy9ob21lL2JpdG5hbWkvYXBwcy9qb2Jtb3Npcy1zdGFnaW5nL2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy9jYW5kaWRhdGUuY3N2JywgY3N2LCBmdW5jdGlvbiAoZXJyOiBhbnkpIHtcclxuICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdCk7XHJcbiAgICAgICB9KTsqL1xyXG5cclxuICAgICAgbGV0IHRlbXBTdHJpbmc6IHN0cmluZyA9ICcnO1xyXG4gICAgICBsZXQgY291bnQgPSAwO1xyXG4gICAgICBsZXQgY2FuZGlkYXRlTGVuZ3RoID0gcmVzdWx0LmNhbmRpZGF0ZS5sZW5ndGg7XHJcbiAgICAgIGZvciAobGV0IGNhbmRpZGF0ZSBvZiByZXN1bHQuY2FuZGlkYXRlKSB7XHJcbiAgICAgICAgdGVtcFN0cmluZyA9IGpzb24yY3N2KHtcclxuICAgICAgICAgIGRhdGE6IGNhbmRpZGF0ZSwgZmllbGRzOiBmaWVsZHMsIGZpZWxkTmFtZXM6IGZpZWxkTmFtZXMsXHJcbiAgICAgICAgICB1bndpbmRQYXRoOiBbJ2RhdGEuY2FwYWJpbGl0eU1hdHJpeCddXHJcbiAgICAgICAgfSwgKGVycjogYW55LCByZXN1bHQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgIHRlbXBTdHJpbmcgKz0gcmVzdWx0O1xyXG4gICAgICAgICAgaWYgKGNvdW50ID09IGNhbmRpZGF0ZUxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIndyaXRpbmcgaW50byBmaWxlIGZpbGVcIik7XHJcbiAgICAgICAgICAgIC8vZnMud3JpdGVGaWxlKCcuL3NyYy9zZXJ2ZXIvcHVibGljL2NhbmRpZGF0ZS5jc3YnLCB0ZW1wU3RyaW5nLCAoZXJyOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICBmcy53cml0ZUZpbGUoJy9ob21lL2JpdG5hbWkvYXBwcy9qb2Jtb3Npcy1zdGFnaW5nL2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy9jYW5kaWRhdGUuY3N2JywgdGVtcFN0cmluZywgZnVuY3Rpb24gKGVycjogYW55KSB7XHJcbiAgICAgICAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICAvKmxldCB0ZW1wU3RyaW5nOiBzdHJpbmcgPSAnJztcclxuICAgICAgIGxldCBjb3VudCA9IDA7XHJcbiAgICAgICBsZXQgY2FuZGlkYXRlTGVuZ3RoID0gcmVzdWx0LmNhbmRpZGF0ZS5sZW5ndGg7XHJcbiAgICAgICBmb3IodmFyIGk9MDsgaTw9Y2FuZGlkYXRlTGVuZ3RoOykge1xyXG4gICAgICAgY29uc29sZS5sb2coXCJFbnRlciBjb3VudDpcIiArIGkpO1xyXG4gICAgICAgbGV0IHRlbXBDYW5kaWRhdGUgPSByZXN1bHQuY2FuZGlkYXRlLnNwbGljZShpLDEwMCk7XHJcbiAgICAgICB0ZW1wU3RyaW5nID0ganNvbjJjc3Yoe1xyXG4gICAgICAgZGF0YTogdGVtcENhbmRpZGF0ZSwgZmllbGRzOiBmaWVsZHMsIGZpZWxkTmFtZXM6IGZpZWxkTmFtZXMsXHJcbiAgICAgICB1bndpbmRQYXRoOiBbJ2RhdGEuY2FwYWJpbGl0eU1hdHJpeCddXHJcbiAgICAgICB9LCAoZXJyOiBhbnkscmVzdWx0OiBhbnkpID0+IHtcclxuICAgICAgIGNvbnNvbGUubG9nKFwiQ1NWIGNvdW50OlwiICsgY291bnQpO1xyXG4gICAgICAgY291bnQgPSBjb3VudCArIDEwMDtcclxuICAgICAgIHRlbXBTdHJpbmcgKz0gcmVzdWx0O1xyXG4gICAgICAgaWYoY291bnQgPT0gY2FuZGlkYXRlTGVuZ3RoKSB7XHJcbiAgICAgICBjb25zb2xlLmxvZyhcIndyaXRpbmcgaW50byBmaWxlIGZpbGVcIik7XHJcbiAgICAgICBmcy53cml0ZUZpbGUoJy4vc3JjL3NlcnZlci9wdWJsaWMvY2FuZGlkYXRlLmNzdicsIHRlbXBTdHJpbmcsIChlcnI6IGFueSkgPT4ge1xyXG4gICAgICAgLy9mcy53cml0ZUZpbGUoJy9ob21lL2JpdG5hbWkvYXBwcy9qb2Jtb3Npcy1zdGFnaW5nL2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy9jYW5kaWRhdGUuY3N2JywgY3N2LCBmdW5jdGlvbiAoZXJyOiBhbnkpIHtcclxuICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdCk7XHJcbiAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgICAgIH0pXHJcbiAgICAgICBpPWkrMTAwO1xyXG4gICAgICAgfSovXHJcblxyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgZ2VuZXJhdGVSZWNydWl0ZXJEZXRhaWxGaWxlKHJlc3VsdDogYW55LCBjYWxsYmFjazogKGVycjogYW55LCByZXM6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgY29uc29sZS5sb2coXCJpbnNpZGUgZ2VuZXJhdGUgZmlsZVwiKTtcclxuICAgIGlmIChyZXN1bHQucmVjcnVpdGVyICYmIHJlc3VsdC5yZWNydWl0ZXIubGVuZ3RoID4gMCkge1xyXG4gICAgICBsZXQgZmllbGRzID0gWydkYXRhLmNvbXBhbnlfbmFtZScsICdkYXRhLmNvbXBhbnlfc2l6ZScsICdkYXRhLmlzUmVjcnVpdGluZ0ZvcnNlbGYnLFxyXG4gICAgICAgICdkYXRhLm51bWJlck9mSm9ic1Bvc3RlZCcsICdtb2JpbGVfbnVtYmVyJywgJ2VtYWlsJywgJ2lzQWN0aXZhdGVkJywgJ2RhdGEucG9zdGVkSm9icy5pc0pvYlBvc3RlZCcsXHJcbiAgICAgICAgJ2RhdGEucG9zdGVkSm9icy5qb2JUaXRsZScsICdkYXRhLnBvc3RlZEpvYnMuaGlyaW5nTWFuYWdlcicsICdkYXRhLnBvc3RlZEpvYnMuZGVwYXJ0bWVudCcsXHJcbiAgICAgICAgJ2RhdGEucG9zdGVkSm9icy5lZHVjYXRpb24nLCAnZGF0YS5wb3N0ZWRKb2JzLmV4cGVyaWVuY2VNaW5WYWx1ZScsICdkYXRhLnBvc3RlZEpvYnMuZXhwZXJpZW5jZU1heFZhbHVlJyxcclxuICAgICAgICAnZGF0YS5wb3N0ZWRKb2JzLnNhbGFyeU1pblZhbHVlJywgJ2RhdGEucG9zdGVkSm9icy5zYWxhcnlNYXhWYWx1ZScsICdkYXRhLnBvc3RlZEpvYnMuam9pbmluZ1BlcmlvZCcsXHJcbiAgICAgICAgJ2RhdGEucG9zdGVkSm9icy5rZXlTa2lsbHMnLCAnZGF0YS5wb3N0ZWRKb2JzLmFkZGl0aW9uYWxLZXlTa2lsbHMnLCAnZGF0YS5wb3N0ZWRKb2JzLmluZHVzdHJ5Lm5hbWUnLFxyXG4gICAgICAgICdkYXRhLnBvc3RlZEpvYnMucm9sZXMnLCAnZGF0YS5wb3N0ZWRKb2JzLmNhcGFiaWxpdHlNYXRyaXguY2FwYWJpbGl0eUNvZGUnLFxyXG4gICAgICAgICdkYXRhLnBvc3RlZEpvYnMuY2FwYWJpbGl0eU1hdHJpeC5jb21wbGV4aXR5Q29kZScsICdkYXRhLnBvc3RlZEpvYnMuY2FwYWJpbGl0eU1hdHJpeC5zY2VuZXJpb0NvZGUnLFxyXG4gICAgICAgICdkYXRhLnBvc3RlZEpvYnMucG9zdGluZ0RhdGUnLCAnZGF0YS5wb3N0ZWRKb2JzLmV4cGlyaW5nRGF0ZSddO1xyXG5cclxuICAgICAgbGV0IGZpZWxkTmFtZXMgPSBbJ0NvbXBhbnkgTmFtZScsICdjb21wYW55IHNpemUnLCAnUmVjcnVpdGluZyBGb3IgU2VsZicsICdOdW1iZXIgb2YgSm9iIFBvc3RlZCcsICdNb2JpbGUgTnVtYmVyJyxcclxuICAgICAgICAnRW1haWwnLCAnSXMgQWN0aXZhdGVkJywgJ0lzIEpvYiBQb3N0ZWQnLCAnSm9iIFRpdGxlJywgJ0hpcmluZyBNYW5hZ2VyJywgJ0RlcGFydG1lbnQnLCAnRWR1Y2F0aW9uJyxcclxuICAgICAgICAnRXhwZXJpZW5jZSBNaW5WYWx1ZScsICdFeHBlcmllbmNlIE1heFZhbHVlJywgJ1NhbGFyeSBNaW5WYWx1ZScsICdTYWxhcnkgTWF4VmFsdWUnLCAnSm9pbmluZyBQZXJpb2QnLFxyXG4gICAgICAgICdLZXkgU2tpbGxzJywgJ0FkZGl0aW9uYWwgS2V5IFNraWxscycsICdJbmR1c3RyeScsICdSb2xlJywgJ0NhcGFiaWxpdHkgQ29kZScsXHJcbiAgICAgICAgJ0NvbXBsZXhpdHkgQ29kZScsICdTY2VuYXJpbyBDb2RlJywgJ1Bvc3RpbmcgRGF0ZScsICdFeHBpcmluZyBEYXRlJ107XHJcbiAgICAgIC8qbGV0IGNzdiA9IGpzb24yY3N2KHtcclxuICAgICAgIGRhdGE6IHJlc3VsdC5yZWNydWl0ZXIsXHJcbiAgICAgICBmaWVsZHM6IGZpZWxkcyxcclxuICAgICAgIGZpZWxkTmFtZXM6IGZpZWxkTmFtZXMsXHJcbiAgICAgICB1bndpbmRQYXRoOiBbJ2RhdGEucG9zdGVkSm9icycsICdkYXRhLnBvc3RlZEpvYnMuY2FwYWJpbGl0eU1hdHJpeCddXHJcbiAgICAgICB9KTtcclxuICAgICAgIGZzLndyaXRlRmlsZSgnLi9zcmMvc2VydmVyL3B1YmxpYy9yZWNydWl0ZXIuY3N2JywgY3N2LCBmdW5jdGlvbiAoZXJyOiBhbnkpIHtcclxuICAgICAgIC8vZnMud3JpdGVGaWxlKCcvaG9tZS9iaXRuYW1pL2FwcHMvam9ibW9zaXMtc3RhZ2luZy9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvcmVjcnVpdGVyLmNzdicsIGNzdiwgZnVuY3Rpb24gKGVycjogYW55KSB7XHJcbiAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgICBjYWxsYmFjayhudWxsLCByZXN1bHQpO1xyXG4gICAgICAgfSk7Ki9cclxuXHJcblxyXG4gICAgICBsZXQgdGVtcFN0cmluZzogc3RyaW5nID0gJyc7XHJcbiAgICAgIGxldCBjb3VudCA9IDA7XHJcbiAgICAgIGxldCByZWNydWl0ZXJMZW5ndGggPSByZXN1bHQucmVjcnVpdGVyLmxlbmd0aDtcclxuICAgICAgZm9yIChsZXQgcmVjcnVpdGVyIG9mIHJlc3VsdC5yZWNydWl0ZXIpIHtcclxuICAgICAgICB0ZW1wU3RyaW5nID0ganNvbjJjc3Yoe1xyXG4gICAgICAgICAgZGF0YTogcmVjcnVpdGVyLCBmaWVsZHM6IGZpZWxkcywgZmllbGROYW1lczogZmllbGROYW1lcyxcclxuICAgICAgICAgIHVud2luZFBhdGg6IFsnZGF0YS5wb3N0ZWRKb2JzJywgJ2RhdGEucG9zdGVkSm9icy5jYXBhYmlsaXR5TWF0cml4J11cclxuICAgICAgICB9LCAoZXJyOiBhbnksIHJlc3VsdDogYW55KSA9PiB7XHJcbiAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgdGVtcFN0cmluZyArPSByZXN1bHQ7XHJcbiAgICAgICAgICBpZiAoY291bnQgPT0gcmVjcnVpdGVyTGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwid3JpdGluZyBpbnRvIGZpbGUgZmlsZVwiKTtcclxuICAgICAgICAgICAgLy9mcy53cml0ZUZpbGUoJy4vc3JjL3NlcnZlci9wdWJsaWMvcmVjcnVpdGVyLmNzdicsIHRlbXBTdHJpbmcsIGZ1bmN0aW9uIChlcnI6IGFueSkge1xyXG4gICAgICAgICAgICAgIGZzLndyaXRlRmlsZSgnL2hvbWUvYml0bmFtaS9hcHBzL2pvYm1vc2lzLXN0YWdpbmcvYy1uZXh0L2Rpc3Qvc2VydmVyL3Byb2QvcHVibGljL3JlY3J1aXRlci5jc3YnLCB0ZW1wU3RyaW5nLCBmdW5jdGlvbiAoZXJyOiBhbnkpIHtcclxuICAgICAgICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjYWxsYmFjayhudWxsLCByZXN1bHQpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHNlbmRBZG1pbkxvZ2luSW5mb01haWwoZmllbGQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IGhlYWRlcjEgPSBmcy5yZWFkRmlsZVN5bmMoJy4vc3JjL3NlcnZlci9hcHAvZnJhbWV3b3JrL3B1YmxpYy9oZWFkZXIxLmh0bWwnKS50b1N0cmluZygpO1xyXG4gICAgbGV0IGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoJy4vc3JjL3NlcnZlci9hcHAvZnJhbWV3b3JrL3B1YmxpYy9hZG1pbmxvZ2luaW5mby5tYWlsLmh0bWwnKS50b1N0cmluZygpO1xyXG4gICAgbGV0IGZvb3RlcjEgPSBmcy5yZWFkRmlsZVN5bmMoJy4vc3JjL3NlcnZlci9hcHAvZnJhbWV3b3JrL3B1YmxpYy9mb290ZXIxLmh0bWwnKS50b1N0cmluZygpO1xyXG4gICAgbGV0IG1pZF9jb250ZW50ID0gY29udGVudC5yZXBsYWNlKCckZW1haWwkJywgZmllbGQuZW1haWwpLnJlcGxhY2UoJyRhZGRyZXNzJCcsIChmaWVsZC5sb2NhdGlvbiA9PT0gdW5kZWZpbmVkKSA/ICdOb3QgRm91bmQnIDogZmllbGQubG9jYXRpb24pXHJcbiAgICAgIC5yZXBsYWNlKCckaXAkJywgZmllbGQuaXApLnJlcGxhY2UoJyRob3N0JCcsIGNvbmZpZy5nZXQoJ1RwbFNlZWQubWFpbC5ob3N0JykpO1xyXG5cclxuXHJcbiAgICBsZXQgbWFpbE9wdGlvbnMgPSB7XHJcbiAgICAgIGZyb206IGNvbmZpZy5nZXQoJ1RwbFNlZWQubWFpbC5NQUlMX1NFTkRFUicpLFxyXG4gICAgICB0bzogY29uZmlnLmdldCgnVHBsU2VlZC5tYWlsLkFETUlOX01BSUwnKSxcclxuICAgICAgY2M6IGNvbmZpZy5nZXQoJ1RwbFNlZWQubWFpbC5UUExHUk9VUF9NQUlMJyksXHJcbiAgICAgIHN1YmplY3Q6IE1lc3NhZ2VzLkVNQUlMX1NVQkpFQ1RfQURNSU5fTE9HR0VEX09OICsgXCIgXCIgKyBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuaG9zdCcpLFxyXG4gICAgICBodG1sOiBoZWFkZXIxICsgbWlkX2NvbnRlbnQgKyBmb290ZXIxXHJcbiAgICAgICwgYXR0YWNobWVudHM6IE1haWxBdHRhY2htZW50cy5BdHRhY2htZW50QXJyYXlcclxuICAgIH1cclxuICAgIGxldCBzZW5kTWFpbFNlcnZpY2UgPSBuZXcgU2VuZE1haWxTZXJ2aWNlKCk7XHJcbiAgICBzZW5kTWFpbFNlcnZpY2Uuc2VuZE1haWwobWFpbE9wdGlvbnMsIGNhbGxiYWNrKTtcclxuXHJcbiAgfTtcclxuXHJcbiAgdXBkYXRlVXNlcihfaWQ6IHN0cmluZywgaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmZpbmRCeUlkKF9pZCwgKGVycjogYW55LCByZXM6IGFueSkgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyLCByZXMpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMudXNlclJlcG9zaXRvcnkudXBkYXRlKHJlcy5faWQsIGl0ZW0sIGNhbGxiYWNrKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgZ2V0VXNhZ2VEZXRhaWxzKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRoaXMudXNlc1RyYWNraW5nQ29udHJvbGxlci5yZXRyaWV2ZUFsbCgoZXJyOiBhbnksIHJlczogYW55KSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICB9XHJcbn1cclxuXHJcbk9iamVjdC5zZWFsKEFkbWluU2VydmljZSk7XHJcbmV4cG9ydCA9IEFkbWluU2VydmljZTtcclxuIl19
