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
                                'industry.name': 1,
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
                                    if (usersMap_2.get(user._id.toString())) {
                                        user.data = usersMap_2.get(user._id.toString());
                                        recruiters_2.push(user);
                                    }
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
                    if (count_1 == 1) {
                        tempString_1 += result;
                    }
                    else {
                        tempString_1 += result.split('Scenario Code"')[1];
                    }
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
                    if (count_2 == 1) {
                        tempString_2 += result;
                    }
                    else {
                        tempString_2 += result.split('Expiring Date"')[1];
                    }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvYWRtaW4uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBR0EseUVBQTRFO0FBQzVFLG9EQUF1RDtBQUN2RCw2REFBeUQ7QUFDekQsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNuQyxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsNkNBQWdEO0FBQ2hELHVEQUEwRDtBQUMxRCxtRkFBc0Y7QUFDdEYsMkRBQThEO0FBQzlELHNEQUF5RDtBQUN6RCxzREFBeUQ7QUFFekQsaUZBQW9GO0FBSXBGLDRDQUErQztBQUMvQyxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFFNUM7SUFRRTtRQUNFLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztRQUMzQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxrQkFBa0IsRUFBRSxDQUFDO1FBQ25ELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLG1CQUFtQixFQUFFLENBQUM7UUFDckQsSUFBSSxHQUFHLEdBQVEsSUFBSSxZQUFZLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDL0MsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUM7SUFDaEQsQ0FBQztJQUVELHFDQUFjLEdBQWQsVUFBZSxRQUFnQixFQUFFLFFBQXVEO1FBQ3RGLElBQUksQ0FBQztZQUNILElBQUksV0FBVyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7WUFDcEMsSUFBSSxPQUFLLEdBQW9CLElBQUksZUFBZSxFQUFFLENBQUM7WUFDbkQsSUFBSSxVQUFRLEdBQWtCLElBQUksR0FBRyxFQUFFLENBQUM7WUFDeEMsSUFBSSxTQUFTLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FB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QUFFLEdBQVE7WUFDbkQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDUixRQUFRLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3JCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixLQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN0RCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQUEsQ0FBQztJQUVGLHNDQUFlLEdBQWYsVUFBZ0IsS0FBVSxFQUFFLFFBQTJDO1FBQ3JFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLENBQUMsVUFBQyxHQUFRLEVBQUUsR0FBUTtZQUN6RCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNSLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLFFBQVEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDdEIsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBRUwsQ0FBQztJQUNILG1CQUFDO0FBQUQsQ0FoaUJBLEFBZ2lCQyxJQUFBO0FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUMxQixpQkFBUyxZQUFZLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9zZXJ2aWNlcy9hZG1pbi5zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIENyZWF0ZWQgYnkgdGVjaHByaW1lMDAyIG9uIDgvMjgvMjAxNy5cclxuICovXHJcbmltcG9ydCBVc2VyUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS91c2VyLnJlcG9zaXRvcnknKTtcclxuaW1wb3J0IFNlbmRNYWlsU2VydmljZSA9IHJlcXVpcmUoJy4vc2VuZG1haWwuc2VydmljZScpO1xyXG5pbXBvcnQge0NvbnN0VmFyaWFibGVzfSBmcm9tIFwiLi4vc2hhcmVkL3NoYXJlZGNvbnN0YW50c1wiO1xyXG5sZXQgY29uZmlnID0gcmVxdWlyZSgnY29uZmlnJyk7XHJcbmxldCBqc29uMmNzdiA9IHJlcXVpcmUoJ2pzb24yY3N2Jyk7XHJcbmxldCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XHJcbmltcG9ydCBNZXNzYWdlcyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9tZXNzYWdlcycpO1xyXG5pbXBvcnQgTWFpbEF0dGFjaG1lbnRzID0gcmVxdWlyZSgnLi4vc2hhcmVkL3NoYXJlZGFycmF5Jyk7XHJcbmltcG9ydCBSZWNydWl0ZXJSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L3JlY3J1aXRlci5yZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBVc2Vyc0NsYXNzTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3VzZXJzJyk7XHJcbmltcG9ydCBDYW5kaWRhdGVTZXJ2aWNlID0gcmVxdWlyZSgnLi9jYW5kaWRhdGUuc2VydmljZScpO1xyXG5pbXBvcnQgUmVjcnVpdGVyU2VydmljZSA9IHJlcXVpcmUoJy4vcmVjcnVpdGVyLnNlcnZpY2UnKTtcclxuaW1wb3J0IEluZHVzdHJ5TW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL2luZHVzdHJ5Lm1vZGVsJyk7XHJcbmltcG9ydCBJbmR1c3RyeVJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvaW5kdXN0cnkucmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgQ2FuZGlkYXRlTW9kZWxDbGFzcyA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvY2FuZGlkYXRlQ2xhc3MubW9kZWwnKTtcclxuaW1wb3J0IFJlY3J1aXRlckNsYXNzTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3JlY3J1aXRlckNsYXNzLm1vZGVsJyk7XHJcbmltcG9ydCBDYW5kaWRhdGVDbGFzc01vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9jYW5kaWRhdGUtY2xhc3MubW9kZWwnKTtcclxuaW1wb3J0IFVzZXJTZXJ2aWNlID0gcmVxdWlyZShcIi4vdXNlci5zZXJ2aWNlXCIpO1xyXG5sZXQgdXNlc3RyYWNraW5nID0gcmVxdWlyZSgndXNlcy10cmFja2luZycpO1xyXG5cclxuY2xhc3MgQWRtaW5TZXJ2aWNlIHtcclxuICBjb21wYW55X25hbWU6IHN0cmluZztcclxuICBwcml2YXRlIHVzZXJSZXBvc2l0b3J5OiBVc2VyUmVwb3NpdG9yeTtcclxuICBwcml2YXRlIGluZHVzdHJ5UmVwb3NpdGlyeTogSW5kdXN0cnlSZXBvc2l0b3J5O1xyXG4gIHByaXZhdGUgcmVjcnVpdGVyUmVwb3NpdG9yeTogUmVjcnVpdGVyUmVwb3NpdG9yeTtcclxuICBwcml2YXRlIHVzZXNUcmFja2luZ0NvbnRyb2xsZXI6IGFueTtcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeSA9IG5ldyBVc2VyUmVwb3NpdG9yeSgpO1xyXG4gICAgdGhpcy5pbmR1c3RyeVJlcG9zaXRpcnkgPSBuZXcgSW5kdXN0cnlSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLnJlY3J1aXRlclJlcG9zaXRvcnkgPSBuZXcgUmVjcnVpdGVyUmVwb3NpdG9yeSgpO1xyXG4gICAgbGV0IG9iajogYW55ID0gbmV3IHVzZXN0cmFja2luZy5NeUNvbnRyb2xsZXIoKTtcclxuICAgIHRoaXMudXNlc1RyYWNraW5nQ29udHJvbGxlciA9IG9iai5fY29udHJvbGxlcjtcclxuICB9XHJcblxyXG4gIGdldFVzZXJEZXRhaWxzKHVzZXJUeXBlOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBVc2Vyc0NsYXNzTW9kZWwpID0+IHZvaWQpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICBsZXQgdXNlcnM6IFVzZXJzQ2xhc3NNb2RlbCA9IG5ldyBVc2Vyc0NsYXNzTW9kZWwoKTtcclxuICAgICAgbGV0IHVzZXJzTWFwOiBNYXA8YW55LCBhbnk+ID0gbmV3IE1hcCgpO1xyXG4gICAgICBsZXQgZmluZFF1ZXJ5ID0gbmV3IE9iamVjdCgpO1xyXG5cclxuICAgICAgaWYgKHVzZXJUeXBlID09ICdjYW5kaWRhdGUnKSB7XHJcbiAgICAgICAgZmluZFF1ZXJ5ID0geydpc0NhbmRpZGF0ZSc6IHRydWUsICdpc0FkbWluJzogZmFsc2V9O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZpbmRRdWVyeSA9IHsnaXNDYW5kaWRhdGUnOiBmYWxzZSwgJ2lzQWRtaW4nOiBmYWxzZX07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBpbmNsdWRlZF9maWVsZHMgPSB7XHJcbiAgICAgICAgJ19pZCc6IDEsXHJcbiAgICAgICAgJ2ZpcnN0X25hbWUnOiAxLFxyXG4gICAgICAgICdsYXN0X25hbWUnOiAxLFxyXG4gICAgICAgICdtb2JpbGVfbnVtYmVyJzogMSxcclxuICAgICAgICAnZW1haWwnOiAxLFxyXG4gICAgICAgICdpc0FjdGl2YXRlZCc6IDFcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGxldCBzb3J0aW5nUXVlcnkgPSB7J2ZpcnN0X25hbWUnOiAxLCAnbGFzdF9uYW1lJzogMX07XHJcblxyXG4gICAgICB1c2VyU2VydmljZS5yZXRyaWV2ZUJ5U29ydGVkT3JkZXIoZmluZFF1ZXJ5LCBpbmNsdWRlZF9maWVsZHMsIHNvcnRpbmdRdWVyeSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB1c2Vycyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHVzZXJUeXBlID09ICdjYW5kaWRhdGUnKSB7XHJcbiAgICAgICAgICAgICAgbGV0IGNhbmRpZGF0ZVNlcnZpY2UgPSBuZXcgQ2FuZGlkYXRlU2VydmljZSgpO1xyXG4gICAgICAgICAgICAgIGxldCBjYW5kaWRhdGVzOiBDYW5kaWRhdGVNb2RlbENsYXNzW10gPSBuZXcgQXJyYXkoMCk7XHJcbiAgICAgICAgICAgICAgbGV0IGNhbmRpZGF0ZUZpZWxkcyA9IHtcclxuICAgICAgICAgICAgICAgICd1c2VySWQnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ2pvYlRpdGxlJzogMSxcclxuICAgICAgICAgICAgICAgICdpc0NvbXBsZXRlZCc6IDEsXHJcbiAgICAgICAgICAgICAgICAnaXNTdWJtaXR0ZWQnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ2xvY2F0aW9uLmNpdHknOiAxLFxyXG4gICAgICAgICAgICAgICAgJ3Byb2ZpY2llbmNpZXMnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ3Byb2Zlc3Npb25hbERldGFpbHMnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ2NhcGFiaWxpdHlfbWF0cml4JzogMSxcclxuICAgICAgICAgICAgICAgICdpc1Zpc2libGUnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ2luZHVzdHJ5Lm5hbWUnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ2luZHVzdHJ5LnJvbGVzLm5hbWUnOiAxXHJcbiAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICBjYW5kaWRhdGVTZXJ2aWNlLnJldHJpZXZlV2l0aExlYW4oe30sIGNhbmRpZGF0ZUZpZWxkcywgKGVycm9yLCBjYW5kaWRhdGVzUmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGZXRjaGVkIGFsbCBjYW5kaWRhdGVzOlwiICsgY2FuZGlkYXRlc1Jlc3VsdC5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICBmb3IgKGxldCBjYW5kaWRhdGUgb2YgY2FuZGlkYXRlc1Jlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjYW5kaWRhdGUucHJvZmljaWVuY2llcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjYW5kaWRhdGUua2V5U2tpbGxzID0gY2FuZGlkYXRlLnByb2ZpY2llbmNpZXMudG9TdHJpbmcoKS5yZXBsYWNlKC8sL2csICcgJCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbmRpZGF0ZS5pbmR1c3RyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY2FuZGlkYXRlLnJvbGVzID0gY2FuZGlkYXRlU2VydmljZS5sb2FkUm9sZXMoY2FuZGlkYXRlLmluZHVzdHJ5LnJvbGVzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjYW5kaWRhdGUuY2FwYWJpbGl0eV9tYXRyaXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZS5jYXBhYmlsaXR5TWF0cml4ID0gY2FuZGlkYXRlU2VydmljZS5sb2FkQ2FwYWJpbGl0aURldGFpbHMoY2FuZGlkYXRlLmNhcGFiaWxpdHlfbWF0cml4KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcnNNYXAuc2V0KGNhbmRpZGF0ZS51c2VySWQudG9TdHJpbmcoKSwgY2FuZGlkYXRlKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdXNlciBvZiByZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICB1c2VyLmRhdGEgPSB1c2Vyc01hcC5nZXQodXNlci5faWQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FuZGlkYXRlcy5wdXNoKHVzZXIpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICB1c2Vycy5jYW5kaWRhdGUgPSBjYW5kaWRhdGVzO1xyXG4gICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB1c2Vycyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbnNpZGUgcmVjcnVpdGVyIGZldGNoXCIpO1xyXG4gICAgICAgICAgICAgIGxldCByZWNydWl0ZXJTZXJ2aWNlID0gbmV3IFJlY3J1aXRlclNlcnZpY2UoKTtcclxuICAgICAgICAgICAgICBsZXQgcmVjcnVpdGVyczogUmVjcnVpdGVyQ2xhc3NNb2RlbFtdID0gbmV3IEFycmF5KDApO1xyXG4gICAgICAgICAgICAgIGxldCByZWNydWl0ZXJGaWVsZHMgPSB7XHJcbiAgICAgICAgICAgICAgICAndXNlcklkJzogMSxcclxuICAgICAgICAgICAgICAgICdjb21wYW55X25hbWUnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ2NvbXBhbnlfc2l6ZSc6IDEsXHJcbiAgICAgICAgICAgICAgICAnaXNSZWNydWl0aW5nRm9yc2VsZic6IDEsXHJcbiAgICAgICAgICAgICAgICAncG9zdGVkSm9icy5pc0pvYlBvc3RlZCc6IDEsXHJcbiAgICAgICAgICAgICAgICAncG9zdGVkSm9icy5jYXBhYmlsaXR5X21hdHJpeCc6IDEsXHJcbiAgICAgICAgICAgICAgICAncG9zdGVkSm9icy5leHBpcmluZ0RhdGUnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ3Bvc3RlZEpvYnMucG9zdGluZ0RhdGUnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ3Bvc3RlZEpvYnMuam9iVGl0bGUnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ3Bvc3RlZEpvYnMuaGlyaW5nTWFuYWdlcic6IDEsXHJcbiAgICAgICAgICAgICAgICAncG9zdGVkSm9icy5kZXBhcnRtZW50JzogMSxcclxuICAgICAgICAgICAgICAgICdwb3N0ZWRKb2JzLmVkdWNhdGlvbic6IDEsXHJcbiAgICAgICAgICAgICAgICAncG9zdGVkSm9icy5leHBlcmllbmNlTWluVmFsdWUnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ3Bvc3RlZEpvYnMuZXhwZXJpZW5jZU1heFZhbHVlJzogMSxcclxuICAgICAgICAgICAgICAgICdwb3N0ZWRKb2JzLnNhbGFyeU1pblZhbHVlJzogMSxcclxuICAgICAgICAgICAgICAgICdwb3N0ZWRKb2JzLnNhbGFyeU1heFZhbHVlJzogMSxcclxuICAgICAgICAgICAgICAgICdwb3N0ZWRKb2JzLmpvaW5pbmdQZXJpb2QnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ3Bvc3RlZEpvYnMucHJvZmljaWVuY2llcyc6IDEsXHJcbiAgICAgICAgICAgICAgICAncG9zdGVkSm9icy5hZGRpdGlvbmFsUHJvZmljaWVuY2llcyc6IDEsXHJcbiAgICAgICAgICAgICAgICAncG9zdGVkSm9icy5pbmR1c3RyeS5uYW1lJzogMSxcclxuICAgICAgICAgICAgICAgICdwb3N0ZWRKb2JzLmluZHVzdHJ5LnJvbGVzLm5hbWUnOiAxLFxyXG4gICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgIHJlY3J1aXRlclNlcnZpY2UucmV0cmlldmVXaXRoTGVhbih7fSwgcmVjcnVpdGVyRmllbGRzLCAoZXJyb3IsIHJlY3J1aXRlclJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmV0Y2hlZCBhbGwgcmVjcnVpdGVyczpcIiArIHJlY3J1aXRlclJlc3VsdC5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICBmb3IgKGxldCByZWNydWl0ZXIgb2YgcmVjcnVpdGVyUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVjcnVpdGVyLm51bWJlck9mSm9ic1Bvc3RlZCA9IHJlY3J1aXRlci5wb3N0ZWRKb2JzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICByZWNydWl0ZXJTZXJ2aWNlLmxvYWRDYXBiaWxpdHlBbmRLZXlTa2lsbHMocmVjcnVpdGVyLnBvc3RlZEpvYnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJzTWFwLnNldChyZWNydWl0ZXIudXNlcklkLnRvU3RyaW5nKCksIHJlY3J1aXRlcik7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgIGZvciAobGV0IHVzZXIgb2YgcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlci5kYXRhID0gdXNlcnNNYXAuZ2V0KHVzZXIuX2lkLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlY3J1aXRlcnMucHVzaCh1c2VyKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgdXNlcnMucmVjcnVpdGVyID0gcmVjcnVpdGVycztcclxuICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXNlcnMpO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaFxyXG4gICAgICAoZSkge1xyXG4gICAgICBjYWxsYmFjayhlLCBudWxsKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBnZXRDb3VudE9mVXNlcnMoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgY2FuZGlkYXRlU2VydmljZSA9IG5ldyBDYW5kaWRhdGVTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCByZWNydWl0ZXJTZXJ2aWNlID0gbmV3IFJlY3J1aXRlclNlcnZpY2UoKTtcclxuICAgICAgbGV0IHVzZXJzOiBVc2Vyc0NsYXNzTW9kZWwgPSBuZXcgVXNlcnNDbGFzc01vZGVsKCk7XHJcbiAgICAgIGxldCBmaW5kUXVlcnkgPSBuZXcgT2JqZWN0KCk7XHJcblxyXG4gICAgICBjYW5kaWRhdGVTZXJ2aWNlLmdldFRvdGFsQ2FuZGlkYXRlQ291bnQoKGVycm9yLCBjYW5kaWRhdGVDb3VudCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB1c2Vycy50b3RhbE51bWJlck9mQ2FuZGlkYXRlcyA9IGNhbmRpZGF0ZUNvdW50O1xyXG4gICAgICAgICAgcmVjcnVpdGVyU2VydmljZS5nZXRUb3RhbFJlY3J1aXRlckNvdW50KChlcnJvciwgcmVjcnVpdGVyQ291bnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHVzZXJzLnRvdGFsTnVtYmVyT2ZSZWNydWl0ZXJzID0gcmVjcnVpdGVyQ291bnQ7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXNlcnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY2F0Y2hcclxuICAgICAgKGUpIHtcclxuICAgICAgY2FsbGJhY2soZSwgbnVsbCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRSZWNydWl0ZXJEZXRhaWxzKGluaXRpYWw6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCB1c2VyczogVXNlcnNDbGFzc01vZGVsID0gbmV3IFVzZXJzQ2xhc3NNb2RlbCgpO1xyXG4gICAgICBsZXQgdXNlcnNNYXA6IE1hcDxhbnksIGFueT4gPSBuZXcgTWFwKCk7XHJcblxyXG4gICAgICBsZXQgcmVjcnVpdGVyU2VydmljZSA9IG5ldyBSZWNydWl0ZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCByZWNydWl0ZXJzOiBSZWNydWl0ZXJDbGFzc01vZGVsW10gPSBuZXcgQXJyYXkoMCk7XHJcblxyXG4gICAgICBsZXQgcmVnRXggPSBuZXcgUmVnRXhwKCdeWycgKyBpbml0aWFsLnRvTG93ZXJDYXNlKCkgKyBpbml0aWFsLnRvVXBwZXJDYXNlKCkgKyAnXScpO1xyXG4gICAgICBsZXQgZmluZFF1ZXJ5ID0ge1xyXG4gICAgICAgICdjb21wYW55X25hbWUnOiB7XHJcbiAgICAgICAgICAkcmVnZXg6IHJlZ0V4XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGxldCBzb3J0aW5nUXVlcnkgPSB7J2NvbXBhbnlfbmFtZSc6IDEsICdjb21wYW55X3NpemUnOiAxfTtcclxuXHJcbiAgICAgIGxldCByZWNydWl0ZXJGaWVsZHMgPSB7XHJcbiAgICAgICAgJ3VzZXJJZCc6IDEsXHJcbiAgICAgICAgJ2NvbXBhbnlfbmFtZSc6IDEsXHJcbiAgICAgICAgJ2NvbXBhbnlfc2l6ZSc6IDEsXHJcbiAgICAgICAgJ3Bvc3RlZEpvYnMuaXNKb2JQb3N0ZWQnOiAxXHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZWNydWl0ZXJTZXJ2aWNlLnJldHJpZXZlQnlTb3J0ZWRPcmRlcihmaW5kUXVlcnksIHJlY3J1aXRlckZpZWxkcywgc29ydGluZ1F1ZXJ5LCAoZXJyb3IsIHJlY3J1aXRlclJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB1c2Vycy50b3RhbE51bWJlck9mUmVjcnVpdGVycyA9IHJlY3J1aXRlclJlc3VsdC5sZW5ndGg7XHJcbiAgICAgICAgICBpZiAocmVjcnVpdGVyUmVzdWx0Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHVzZXJzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgdXNlckZpZWxkcyA9IHtcclxuICAgICAgICAgICAgICAnX2lkJzogMSxcclxuICAgICAgICAgICAgICAnbW9iaWxlX251bWJlcic6IDEsXHJcbiAgICAgICAgICAgICAgJ2VtYWlsJzogMSxcclxuICAgICAgICAgICAgICAnaXNBY3RpdmF0ZWQnOiAxXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCByZWNydWl0ZXIgb2YgcmVjcnVpdGVyUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgdXNlcnNNYXAuc2V0KHJlY3J1aXRlci51c2VySWQudG9TdHJpbmcoKSwgcmVjcnVpdGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB1c2VyU2VydmljZS5yZXRyaWV2ZVdpdGhMZWFuKHsnaXNDYW5kaWRhdGUnOiBmYWxzZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmV0Y2hlZCBhbGwgcmVjcnVpdGVycyBmcm9tIHVzZXJzOlwiICsgcmVjcnVpdGVyUmVzdWx0Lmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB1c2VyIG9mIHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICBpZih1c2Vyc01hcC5nZXQodXNlci5faWQudG9TdHJpbmcoKSkpe1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXIuZGF0YSA9IHVzZXJzTWFwLmdldCh1c2VyLl9pZC50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgICAgICByZWNydWl0ZXJzLnB1c2godXNlcik7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB1c2Vycy5yZWNydWl0ZXIgPSByZWNydWl0ZXJzO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXNlcnMpO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaFxyXG4gICAgICAoZSkge1xyXG4gICAgICBjYWxsYmFjayhlLCBudWxsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldENhbmRpZGF0ZURldGFpbHMoaW5pdGlhbDogc3RyaW5nLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgbGV0IHVzZXJzOiBVc2Vyc0NsYXNzTW9kZWwgPSBuZXcgVXNlcnNDbGFzc01vZGVsKCk7XHJcbiAgICAgIGxldCB1c2Vyc01hcDogTWFwPGFueSwgYW55PiA9IG5ldyBNYXAoKTtcclxuXHJcbiAgICAgIGxldCBjYW5kaWRhdGVzOiBDYW5kaWRhdGVNb2RlbENsYXNzW10gPSBuZXcgQXJyYXkoMCk7XHJcbiAgICAgIGxldCBjYW5kaWRhdGVTZXJ2aWNlID0gbmV3IENhbmRpZGF0ZVNlcnZpY2UoKTtcclxuXHJcbiAgICAgIGxldCByZWdFeCA9IG5ldyBSZWdFeHAoJ15bJyArIGluaXRpYWwudG9Mb3dlckNhc2UoKSArIGluaXRpYWwudG9VcHBlckNhc2UoKSArICddJyk7XHJcbiAgICAgIGxldCBmaW5kUXVlcnkgPSB7XHJcbiAgICAgICAgJ2ZpcnN0X25hbWUnOiB7XHJcbiAgICAgICAgICAkcmVnZXg6IHJlZ0V4XHJcbiAgICAgICAgfSxcclxuICAgICAgICAnaXNBZG1pbic6IGZhbHNlLFxyXG4gICAgICAgICdpc0NhbmRpZGF0ZSc6IHRydWVcclxuICAgICAgfTtcclxuICAgICAgbGV0IGluY2x1ZGVkX2ZpZWxkcyA9IHtcclxuICAgICAgICAnX2lkJzogMSxcclxuICAgICAgICAnZmlyc3RfbmFtZSc6IDEsXHJcbiAgICAgICAgJ2xhc3RfbmFtZSc6IDEsXHJcbiAgICAgICAgJ21vYmlsZV9udW1iZXInOiAxLFxyXG4gICAgICAgICdlbWFpbCc6IDEsXHJcbiAgICAgICAgJ2lzQWN0aXZhdGVkJzogMVxyXG4gICAgICB9O1xyXG4gICAgICBsZXQgc29ydGluZ1F1ZXJ5ID0geydmaXJzdF9uYW1lJzogMSwgJ2xhc3RfbmFtZSc6IDF9O1xyXG5cclxuICAgICAgdXNlclNlcnZpY2UucmV0cmlldmVCeVNvcnRlZE9yZGVyKGZpbmRRdWVyeSwgaW5jbHVkZWRfZmllbGRzLCBzb3J0aW5nUXVlcnksIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHVzZXJzLnRvdGFsTnVtYmVyT2ZDYW5kaWRhdGVzID0gcmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXNlcnMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IDA7XHJcbiAgICAgICAgICAgIGxldCBjYW5kaWRhdGVGaWVsZHMgPSB7XHJcbiAgICAgICAgICAgICAgJ3VzZXJJZCc6IDEsXHJcbiAgICAgICAgICAgICAgJ2pvYlRpdGxlJzogMSxcclxuICAgICAgICAgICAgICAnaXNDb21wbGV0ZWQnOiAxLFxyXG4gICAgICAgICAgICAgICdpc1N1Ym1pdHRlZCc6IDEsXHJcbiAgICAgICAgICAgICAgJ2lzVmlzaWJsZSc6IDEsXHJcbiAgICAgICAgICAgICAgJ2xvY2F0aW9uLmNpdHknOiAxXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGNhbmRpZGF0ZVNlcnZpY2UucmV0cmlldmVXaXRoTGVhbih7fSwgY2FuZGlkYXRlRmllbGRzLCAoZXJyb3IsIGNhbmRpZGF0ZXNSZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGZXRjaGVkIGFsbCBjYW5kaWRhdGVzOlwiICsgY2FuZGlkYXRlc1Jlc3VsdC5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgY2FuZGlkYXRlIG9mIGNhbmRpZGF0ZXNSZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgdXNlcnNNYXAuc2V0KGNhbmRpZGF0ZS51c2VySWQudG9TdHJpbmcoKSwgY2FuZGlkYXRlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB1c2VyIG9mIHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICB1c2VyLmRhdGEgPSB1c2Vyc01hcC5nZXQodXNlci5faWQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZXMucHVzaCh1c2VyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB1c2Vycy5jYW5kaWRhdGUgPSBjYW5kaWRhdGVzO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXNlcnMpO1xyXG5cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBjYWxsYmFjayhlLCBudWxsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFkZFVzYWdlRGV0YWlsc1ZhbHVlKGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHZhbHVlOiBudW1iZXIgPSAwO1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW0ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YWx1ZSsrO1xyXG4gICAgICAgIGl0ZW1baV0uYWN0aW9uID0gQ29uc3RWYXJpYWJsZXMuQWN0aW9uc0FycmF5W2l0ZW1baV0uYWN0aW9uXTtcclxuICAgICAgICBpZiAoaXRlbS5sZW5ndGggPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhudWxsLCBpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgY2FsbGJhY2soZSwgbnVsbCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgZ2VuZXJhdGVVc2FnZURldGFpbEZpbGUocmVzdWx0OiBhbnksIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGxldCBmaWVsZHMgPSBbJ2NhbmRpZGF0ZUlkJywgJ3JlY3J1aXRlcklkJywgJ2pvYlByb2ZpbGVJZCcsICdhY3Rpb24nLCAndGltZXN0YW1wJ107XHJcbiAgICAgIGxldCBmaWVsZE5hbWVzID0gWydDYW5kaWRhdGUgSWQnLCAnUmVjcnVpdGVySWQnLCAnSm9iIFByb2ZpbGUgSWQnLCAnQWN0aW9uJywgJ1RpbWVTdGFtcCddO1xyXG4gICAgICBsZXQgY3N2ID0ganNvbjJjc3Yoe2RhdGE6IHJlc3VsdCwgZmllbGRzOiBmaWVsZHMsIGZpZWxkTmFtZXM6IGZpZWxkTmFtZXN9KTtcclxuICAgICAgLy9mcy53cml0ZUZpbGUoJy4vc3JjL3NlcnZlci9wdWJsaWMvdXNhZ2VkZXRhaWwuY3N2JywgY3N2LCBmdW5jdGlvbiAoZXJyOiBhbnkpIHtcclxuICAgICAgZnMud3JpdGVGaWxlKCcvaG9tZS9iaXRuYW1pL2FwcHMvam9ibW9zaXMtc3RhZ2luZy9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvdXNhZ2VkZXRhaWwuY3N2JywgY3N2LCBmdW5jdGlvbiAoZXJyOiBhbnkpIHtcclxuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0KTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjYWxsYmFjayhudWxsLCByZXN1bHQpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGdlbmVyYXRlQ2FuZGlkYXRlRGV0YWlsRmlsZShyZXN1bHQ6IGFueSwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiaW5zaWRlIGdlbmVyYXRlIGZpbGVcIik7XHJcbiAgICBpZiAocmVzdWx0LmNhbmRpZGF0ZSAmJiByZXN1bHQuY2FuZGlkYXRlLmxlbmd0aCA+IDApIHtcclxuICAgICAgbGV0IGZpZWxkcyA9IFsnZmlyc3RfbmFtZScsICdsYXN0X25hbWUnLCAnbW9iaWxlX251bWJlcicsICdlbWFpbCcsICdpc0FjdGl2YXRlZCcsICdkYXRhLmxvY2F0aW9uLmNpdHknLFxyXG4gICAgICAgICdkYXRhLnByb2Zlc3Npb25hbERldGFpbHMuZWR1Y2F0aW9uJywgJ2RhdGEucHJvZmVzc2lvbmFsRGV0YWlscy5leHBlcmllbmNlJyxcclxuICAgICAgICAnZGF0YS5wcm9mZXNzaW9uYWxEZXRhaWxzLmN1cnJlbnRTYWxhcnknLCAnZGF0YS5wcm9mZXNzaW9uYWxEZXRhaWxzLm5vdGljZVBlcmlvZCcsXHJcbiAgICAgICAgJ2RhdGEucHJvZmVzc2lvbmFsRGV0YWlscy5yZWxvY2F0ZScsICdkYXRhLnByb2Zlc3Npb25hbERldGFpbHMuaW5kdXN0cnlFeHBvc3VyZScsXHJcbiAgICAgICAgJ2RhdGEucHJvZmVzc2lvbmFsRGV0YWlscy5jdXJyZW50Q29tcGFueScsICdkYXRhLmlzQ29tcGxldGVkJywgJ2RhdGEuaXNTdWJtaXR0ZWQnLCAnZGF0YS5pc1Zpc2libGUnLFxyXG4gICAgICAgICdkYXRhLmtleVNraWxscycsICdkYXRhLmluZHVzdHJ5Lm5hbWUnLCAnZGF0YS5yb2xlcycsICdkYXRhLmNhcGFiaWxpdHlNYXRyaXguY2FwYWJpbGl0eUNvZGUnLFxyXG4gICAgICAgICdkYXRhLmNhcGFiaWxpdHlNYXRyaXguY29tcGxleGl0eUNvZGUnLCAnZGF0YS5jYXBhYmlsaXR5TWF0cml4LnNjZW5lcmlvQ29kZSddO1xyXG4gICAgICBsZXQgZmllbGROYW1lcyA9IFsnRmlyc3QgTmFtZScsICdMYXN0IE5hbWUnLCAnTW9iaWxlIE51bWJlcicsICdFbWFpbCcsICdJcyBBY3RpdmF0ZWQnLCAnQ2l0eScsICdFZHVjYXRpb24nLFxyXG4gICAgICAgICdFeHBlcmllbmNlJywgJ0N1cnJlbnQgU2FsYXJ5JywgJ05vdGljZSBQZXJpb2QnLCAnUmVhZHkgVG8gUmVsb2NhdGUnLCAnSW5kdXN0cnkgRXhwb3N1cmUnLCAnQ3VycmVudCBDb21wYW55JyxcclxuICAgICAgICAnSXMgQ29tcGxldGVkJywgJ0lzIFN1Ym1pdHRlZCcsICdJcyBWaXNpYmxlJywgJ0tleSBTa2lsbHMnLCAnSW5kdXN0cnknLCAnUm9sZScsICdDYXBhYmlsaXR5IENvZGUnLFxyXG4gICAgICAgICdDb21wbGV4aXR5IENvZGUnLCAnU2NlbmFyaW8gQ29kZSddO1xyXG5cclxuICAgICAgLypsZXQgY3N2ID0ganNvbjJjc3Yoe1xyXG4gICAgICAgZGF0YTogcmVzdWx0LmNhbmRpZGF0ZSwgZmllbGRzOiBmaWVsZHMsIGZpZWxkTmFtZXM6IGZpZWxkTmFtZXMsXHJcbiAgICAgICB1bndpbmRQYXRoOiBbJ2RhdGEuY2FwYWJpbGl0eU1hdHJpeCddXHJcbiAgICAgICB9KTtcclxuICAgICAgIGNvbnNvbGUubG9nKFwid3JpdGluZyBpbnRvIGZpbGUgZmlsZVwiKTtcclxuICAgICAgIC8vZnMud3JpdGVGaWxlKCcuL3NyYy9zZXJ2ZXIvcHVibGljL2NhbmRpZGF0ZS5jc3YnLCBjc3YsIGZ1bmN0aW9uIChlcnI6IGFueSkge1xyXG4gICAgICAgZnMud3JpdGVGaWxlKCcvaG9tZS9iaXRuYW1pL2FwcHMvam9ibW9zaXMtc3RhZ2luZy9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvY2FuZGlkYXRlLmNzdicsIGNzdiwgZnVuY3Rpb24gKGVycjogYW55KSB7XHJcbiAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgICBjYWxsYmFjayhudWxsLCByZXN1bHQpO1xyXG4gICAgICAgfSk7Ki9cclxuXHJcbiAgICAgIGxldCB0ZW1wU3RyaW5nOiBzdHJpbmcgPSAnJztcclxuICAgICAgbGV0IGNvdW50ID0gMDtcclxuICAgICAgbGV0IGNhbmRpZGF0ZUxlbmd0aCA9IHJlc3VsdC5jYW5kaWRhdGUubGVuZ3RoO1xyXG4gICAgICBmb3IgKGxldCBjYW5kaWRhdGUgb2YgcmVzdWx0LmNhbmRpZGF0ZSkge1xyXG4gICAgICAgIHRlbXBTdHJpbmcgPSBqc29uMmNzdih7XHJcbiAgICAgICAgICBkYXRhOiBjYW5kaWRhdGUsIGZpZWxkczogZmllbGRzLCBmaWVsZE5hbWVzOiBmaWVsZE5hbWVzLFxyXG4gICAgICAgICAgdW53aW5kUGF0aDogWydkYXRhLmNhcGFiaWxpdHlNYXRyaXgnXVxyXG4gICAgICAgIH0sIChlcnI6IGFueSwgcmVzdWx0OiBhbnkpID0+IHtcclxuICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICBpZihjb3VudCA9PSAxKXtcclxuICAgICAgICAgICAgdGVtcFN0cmluZyArPSByZXN1bHQ7XHJcbiAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgLypBbHdheXMgY2hlY2sgZm9yIHRoaXMgbGFzdCBjb2x1bW4gZm9yIHNwbGl0aW5nIHRoZSByZWNvcmRzKi9cclxuICAgICAgICAgICAgdGVtcFN0cmluZyArPSByZXN1bHQuc3BsaXQoJ1NjZW5hcmlvIENvZGVcIicpWzFdO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGNvdW50ID09IGNhbmRpZGF0ZUxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIndyaXRpbmcgaW50byBmaWxlIGZpbGVcIik7XHJcbiAgICAgICAgICAgIC8vZnMud3JpdGVGaWxlKCcuL3NyYy9zZXJ2ZXIvcHVibGljL2NhbmRpZGF0ZS5jc3YnLCB0ZW1wU3RyaW5nLCAoZXJyOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICBmcy53cml0ZUZpbGUoJy9ob21lL2JpdG5hbWkvYXBwcy9qb2Jtb3Npcy1zdGFnaW5nL2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy9jYW5kaWRhdGUuY3N2JywgdGVtcFN0cmluZywgZnVuY3Rpb24gKGVycjogYW55KSB7XHJcbiAgICAgICAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICAvKmxldCB0ZW1wU3RyaW5nOiBzdHJpbmcgPSAnJztcclxuICAgICAgIGxldCBjb3VudCA9IDA7XHJcbiAgICAgICBsZXQgY2FuZGlkYXRlTGVuZ3RoID0gcmVzdWx0LmNhbmRpZGF0ZS5sZW5ndGg7XHJcbiAgICAgICBmb3IodmFyIGk9MDsgaTw9Y2FuZGlkYXRlTGVuZ3RoOykge1xyXG4gICAgICAgY29uc29sZS5sb2coXCJFbnRlciBjb3VudDpcIiArIGkpO1xyXG4gICAgICAgbGV0IHRlbXBDYW5kaWRhdGUgPSByZXN1bHQuY2FuZGlkYXRlLnNwbGljZShpLDEwMCk7XHJcbiAgICAgICB0ZW1wU3RyaW5nID0ganNvbjJjc3Yoe1xyXG4gICAgICAgZGF0YTogdGVtcENhbmRpZGF0ZSwgZmllbGRzOiBmaWVsZHMsIGZpZWxkTmFtZXM6IGZpZWxkTmFtZXMsXHJcbiAgICAgICB1bndpbmRQYXRoOiBbJ2RhdGEuY2FwYWJpbGl0eU1hdHJpeCddXHJcbiAgICAgICB9LCAoZXJyOiBhbnkscmVzdWx0OiBhbnkpID0+IHtcclxuICAgICAgIGNvbnNvbGUubG9nKFwiQ1NWIGNvdW50OlwiICsgY291bnQpO1xyXG4gICAgICAgY291bnQgPSBjb3VudCArIDEwMDtcclxuICAgICAgIHRlbXBTdHJpbmcgKz0gcmVzdWx0O1xyXG4gICAgICAgaWYoY291bnQgPT0gY2FuZGlkYXRlTGVuZ3RoKSB7XHJcbiAgICAgICBjb25zb2xlLmxvZyhcIndyaXRpbmcgaW50byBmaWxlIGZpbGVcIik7XHJcbiAgICAgICBmcy53cml0ZUZpbGUoJy4vc3JjL3NlcnZlci9wdWJsaWMvY2FuZGlkYXRlLmNzdicsIHRlbXBTdHJpbmcsIChlcnI6IGFueSkgPT4ge1xyXG4gICAgICAgLy9mcy53cml0ZUZpbGUoJy9ob21lL2JpdG5hbWkvYXBwcy9qb2Jtb3Npcy1zdGFnaW5nL2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy9jYW5kaWRhdGUuY3N2JywgY3N2LCBmdW5jdGlvbiAoZXJyOiBhbnkpIHtcclxuICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdCk7XHJcbiAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgICAgIH0pXHJcbiAgICAgICBpPWkrMTAwO1xyXG4gICAgICAgfSovXHJcblxyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgZ2VuZXJhdGVSZWNydWl0ZXJEZXRhaWxGaWxlKHJlc3VsdDogYW55LCBjYWxsYmFjazogKGVycjogYW55LCByZXM6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgY29uc29sZS5sb2coXCJpbnNpZGUgZ2VuZXJhdGUgZmlsZVwiKTtcclxuICAgIGlmIChyZXN1bHQucmVjcnVpdGVyICYmIHJlc3VsdC5yZWNydWl0ZXIubGVuZ3RoID4gMCkge1xyXG4gICAgICBsZXQgZmllbGRzID0gWydkYXRhLmNvbXBhbnlfbmFtZScsICdkYXRhLmNvbXBhbnlfc2l6ZScsICdkYXRhLmlzUmVjcnVpdGluZ0ZvcnNlbGYnLFxyXG4gICAgICAgICdkYXRhLm51bWJlck9mSm9ic1Bvc3RlZCcsICdtb2JpbGVfbnVtYmVyJywgJ2VtYWlsJywgJ2lzQWN0aXZhdGVkJywgJ2RhdGEucG9zdGVkSm9icy5pc0pvYlBvc3RlZCcsXHJcbiAgICAgICAgJ2RhdGEucG9zdGVkSm9icy5qb2JUaXRsZScsICdkYXRhLnBvc3RlZEpvYnMuaGlyaW5nTWFuYWdlcicsICdkYXRhLnBvc3RlZEpvYnMuZGVwYXJ0bWVudCcsXHJcbiAgICAgICAgJ2RhdGEucG9zdGVkSm9icy5lZHVjYXRpb24nLCAnZGF0YS5wb3N0ZWRKb2JzLmV4cGVyaWVuY2VNaW5WYWx1ZScsICdkYXRhLnBvc3RlZEpvYnMuZXhwZXJpZW5jZU1heFZhbHVlJyxcclxuICAgICAgICAnZGF0YS5wb3N0ZWRKb2JzLnNhbGFyeU1pblZhbHVlJywgJ2RhdGEucG9zdGVkSm9icy5zYWxhcnlNYXhWYWx1ZScsICdkYXRhLnBvc3RlZEpvYnMuam9pbmluZ1BlcmlvZCcsXHJcbiAgICAgICAgJ2RhdGEucG9zdGVkSm9icy5rZXlTa2lsbHMnLCAnZGF0YS5wb3N0ZWRKb2JzLmFkZGl0aW9uYWxLZXlTa2lsbHMnLCAnZGF0YS5wb3N0ZWRKb2JzLmluZHVzdHJ5Lm5hbWUnLFxyXG4gICAgICAgICdkYXRhLnBvc3RlZEpvYnMucm9sZXMnLCAnZGF0YS5wb3N0ZWRKb2JzLmNhcGFiaWxpdHlNYXRyaXguY2FwYWJpbGl0eUNvZGUnLFxyXG4gICAgICAgICdkYXRhLnBvc3RlZEpvYnMuY2FwYWJpbGl0eU1hdHJpeC5jb21wbGV4aXR5Q29kZScsICdkYXRhLnBvc3RlZEpvYnMuY2FwYWJpbGl0eU1hdHJpeC5zY2VuZXJpb0NvZGUnLFxyXG4gICAgICAgICdkYXRhLnBvc3RlZEpvYnMucG9zdGluZ0RhdGUnLCAnZGF0YS5wb3N0ZWRKb2JzLmV4cGlyaW5nRGF0ZSddO1xyXG5cclxuICAgICAgbGV0IGZpZWxkTmFtZXMgPSBbJ0NvbXBhbnkgTmFtZScsICdjb21wYW55IHNpemUnLCAnUmVjcnVpdGluZyBGb3IgU2VsZicsICdOdW1iZXIgb2YgSm9iIFBvc3RlZCcsICdNb2JpbGUgTnVtYmVyJyxcclxuICAgICAgICAnRW1haWwnLCAnSXMgQWN0aXZhdGVkJywgJ0lzIEpvYiBQb3N0ZWQnLCAnSm9iIFRpdGxlJywgJ0hpcmluZyBNYW5hZ2VyJywgJ0RlcGFydG1lbnQnLCAnRWR1Y2F0aW9uJyxcclxuICAgICAgICAnRXhwZXJpZW5jZSBNaW5WYWx1ZScsICdFeHBlcmllbmNlIE1heFZhbHVlJywgJ1NhbGFyeSBNaW5WYWx1ZScsICdTYWxhcnkgTWF4VmFsdWUnLCAnSm9pbmluZyBQZXJpb2QnLFxyXG4gICAgICAgICdLZXkgU2tpbGxzJywgJ0FkZGl0aW9uYWwgS2V5IFNraWxscycsICdJbmR1c3RyeScsICdSb2xlJywgJ0NhcGFiaWxpdHkgQ29kZScsXHJcbiAgICAgICAgJ0NvbXBsZXhpdHkgQ29kZScsICdTY2VuYXJpbyBDb2RlJywgJ1Bvc3RpbmcgRGF0ZScsICdFeHBpcmluZyBEYXRlJ107XHJcbiAgICAgIC8qbGV0IGNzdiA9IGpzb24yY3N2KHtcclxuICAgICAgIGRhdGE6IHJlc3VsdC5yZWNydWl0ZXIsXHJcbiAgICAgICBmaWVsZHM6IGZpZWxkcyxcclxuICAgICAgIGZpZWxkTmFtZXM6IGZpZWxkTmFtZXMsXHJcbiAgICAgICB1bndpbmRQYXRoOiBbJ2RhdGEucG9zdGVkSm9icycsICdkYXRhLnBvc3RlZEpvYnMuY2FwYWJpbGl0eU1hdHJpeCddXHJcbiAgICAgICB9KTtcclxuICAgICAgIGZzLndyaXRlRmlsZSgnLi9zcmMvc2VydmVyL3B1YmxpYy9yZWNydWl0ZXIuY3N2JywgY3N2LCBmdW5jdGlvbiAoZXJyOiBhbnkpIHtcclxuICAgICAgIC8vZnMud3JpdGVGaWxlKCcvaG9tZS9iaXRuYW1pL2FwcHMvam9ibW9zaXMtc3RhZ2luZy9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvcmVjcnVpdGVyLmNzdicsIGNzdiwgZnVuY3Rpb24gKGVycjogYW55KSB7XHJcbiAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgICBjYWxsYmFjayhudWxsLCByZXN1bHQpO1xyXG4gICAgICAgfSk7Ki9cclxuXHJcblxyXG4gICAgICBsZXQgdGVtcFN0cmluZzogc3RyaW5nID0gJyc7XHJcbiAgICAgIGxldCBjb3VudCA9IDA7XHJcbiAgICAgIGxldCByZWNydWl0ZXJMZW5ndGggPSByZXN1bHQucmVjcnVpdGVyLmxlbmd0aDtcclxuICAgICAgZm9yIChsZXQgcmVjcnVpdGVyIG9mIHJlc3VsdC5yZWNydWl0ZXIpIHtcclxuICAgICAgICB0ZW1wU3RyaW5nID0ganNvbjJjc3Yoe1xyXG4gICAgICAgICAgZGF0YTogcmVjcnVpdGVyLCBmaWVsZHM6IGZpZWxkcywgZmllbGROYW1lczogZmllbGROYW1lcyxcclxuICAgICAgICAgIHVud2luZFBhdGg6IFsnZGF0YS5wb3N0ZWRKb2JzJywgJ2RhdGEucG9zdGVkSm9icy5jYXBhYmlsaXR5TWF0cml4J11cclxuICAgICAgICB9LCAoZXJyOiBhbnksIHJlc3VsdDogYW55KSA9PiB7XHJcbiAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgaWYoY291bnQgPT0gMSl7XHJcbiAgICAgICAgICAgIHRlbXBTdHJpbmcgKz0gcmVzdWx0O1xyXG4gICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIC8qQWx3YXlzIGNoZWNrIGZvciB0aGlzIGxhc3QgY29sdW1uIGZvciBzcGxpdGluZyB0aGUgcmVjb3JkcyovXHJcbiAgICAgICAgICAgIHRlbXBTdHJpbmcgKz0gcmVzdWx0LnNwbGl0KCdFeHBpcmluZyBEYXRlXCInKVsxXTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChjb3VudCA9PSByZWNydWl0ZXJMZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ3cml0aW5nIGludG8gZmlsZSBmaWxlXCIpO1xyXG4gICAgICAgICAgICAvL2ZzLndyaXRlRmlsZSgnLi9zcmMvc2VydmVyL3B1YmxpYy9yZWNydWl0ZXIuY3N2JywgdGVtcFN0cmluZywgZnVuY3Rpb24gKGVycjogYW55KSB7XHJcbiAgICAgICAgICAgICAgZnMud3JpdGVGaWxlKCcvaG9tZS9iaXRuYW1pL2FwcHMvam9ibW9zaXMtc3RhZ2luZy9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvcmVjcnVpdGVyLmNzdicsIHRlbXBTdHJpbmcsIGZ1bmN0aW9uIChlcnI6IGFueSkge1xyXG4gICAgICAgICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCByZXN1bHQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcblxyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgc2VuZEFkbWluTG9naW5JbmZvTWFpbChmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsZXQgaGVhZGVyMSA9IGZzLnJlYWRGaWxlU3luYygnLi9zcmMvc2VydmVyL2FwcC9mcmFtZXdvcmsvcHVibGljL2hlYWRlcjEuaHRtbCcpLnRvU3RyaW5nKCk7XHJcbiAgICBsZXQgY29udGVudCA9IGZzLnJlYWRGaWxlU3luYygnLi9zcmMvc2VydmVyL2FwcC9mcmFtZXdvcmsvcHVibGljL2FkbWlubG9naW5pbmZvLm1haWwuaHRtbCcpLnRvU3RyaW5nKCk7XHJcbiAgICBsZXQgZm9vdGVyMSA9IGZzLnJlYWRGaWxlU3luYygnLi9zcmMvc2VydmVyL2FwcC9mcmFtZXdvcmsvcHVibGljL2Zvb3RlcjEuaHRtbCcpLnRvU3RyaW5nKCk7XHJcbiAgICBsZXQgbWlkX2NvbnRlbnQgPSBjb250ZW50LnJlcGxhY2UoJyRlbWFpbCQnLCBmaWVsZC5lbWFpbCkucmVwbGFjZSgnJGFkZHJlc3MkJywgKGZpZWxkLmxvY2F0aW9uID09PSB1bmRlZmluZWQpID8gJ05vdCBGb3VuZCcgOiBmaWVsZC5sb2NhdGlvbilcclxuICAgICAgLnJlcGxhY2UoJyRpcCQnLCBmaWVsZC5pcCkucmVwbGFjZSgnJGhvc3QkJywgY29uZmlnLmdldCgnVHBsU2VlZC5tYWlsLmhvc3QnKSk7XHJcblxyXG5cclxuICAgIGxldCBtYWlsT3B0aW9ucyA9IHtcclxuICAgICAgZnJvbTogY29uZmlnLmdldCgnVHBsU2VlZC5tYWlsLk1BSUxfU0VOREVSJyksXHJcbiAgICAgIHRvOiBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuQURNSU5fTUFJTCcpLFxyXG4gICAgICBjYzogY29uZmlnLmdldCgnVHBsU2VlZC5tYWlsLlRQTEdST1VQX01BSUwnKSxcclxuICAgICAgc3ViamVjdDogTWVzc2FnZXMuRU1BSUxfU1VCSkVDVF9BRE1JTl9MT0dHRURfT04gKyBcIiBcIiArIGNvbmZpZy5nZXQoJ1RwbFNlZWQubWFpbC5ob3N0JyksXHJcbiAgICAgIGh0bWw6IGhlYWRlcjEgKyBtaWRfY29udGVudCArIGZvb3RlcjFcclxuICAgICAgLCBhdHRhY2htZW50czogTWFpbEF0dGFjaG1lbnRzLkF0dGFjaG1lbnRBcnJheVxyXG4gICAgfVxyXG4gICAgbGV0IHNlbmRNYWlsU2VydmljZSA9IG5ldyBTZW5kTWFpbFNlcnZpY2UoKTtcclxuICAgIHNlbmRNYWlsU2VydmljZS5zZW5kTWFpbChtYWlsT3B0aW9ucywgY2FsbGJhY2spO1xyXG5cclxuICB9O1xyXG5cclxuICB1cGRhdGVVc2VyKF9pZDogc3RyaW5nLCBpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkuZmluZEJ5SWQoX2lkLCAoZXJyOiBhbnksIHJlczogYW55KSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnIsIHJlcyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy51c2VyUmVwb3NpdG9yeS51cGRhdGUocmVzLl9pZCwgaXRlbSwgY2FsbGJhY2spO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBnZXRVc2FnZURldGFpbHMoZmllbGQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy51c2VzVHJhY2tpbmdDb250cm9sbGVyLnJldHJpZXZlQWxsKChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxufVxyXG5cclxuT2JqZWN0LnNlYWwoQWRtaW5TZXJ2aWNlKTtcclxuZXhwb3J0ID0gQWRtaW5TZXJ2aWNlO1xyXG4iXX0=
