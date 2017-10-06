"use strict";
var UserRepository = require("../dataaccess/repository/user.repository");
var SendMailService = require("./sendmail.service");
var mongoose = require("mongoose");
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
            var candidateService_1 = new CandidateService();
            var recruiterService_1 = new RecruiterService();
            var users_1 = new UsersClassModel();
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
                'isCandidate': 1,
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
                        var value_1 = 0;
                        if (userType == 'candidate') {
                            var candidates_1 = new Array(0);
                            var candidateFields = {
                                '_id': 1,
                                'jobTitle': 1,
                                'isCompleted': 1,
                                'isSubmitted': 1,
                                'location': 1,
                                'proficiencies': 1,
                                'professionalDetails': 1,
                                'capability_matrix': 1,
                                'isVisible': 1,
                                'industry': 1
                            };
                            var _loop_1 = function (i) {
                                candidateService_1.retrieveWithLean({ 'userId': new mongoose.Types.ObjectId(result[i]._id) }, candidateFields, function (error, resu) {
                                    if (error) {
                                        callback(error, null);
                                    }
                                    else {
                                        value_1++;
                                        if (resu[0].proficiencies.length > 0) {
                                            resu[0].keySkills = resu[0].proficiencies.toString().replace(/,/g, ' $');
                                        }
                                        if (resu[0].industry) {
                                            resu[0].roles = candidateService_1.loadRoles(resu[0].industry.roles);
                                        }
                                        if (resu[0].capability_matrix) {
                                            resu[0].capabilityMatrix = candidateService_1.loadCapabilitiDetails(resu[0].capability_matrix);
                                        }
                                        result[i].data = resu[0];
                                        candidates_1.push(result[i]);
                                        if (value_1 && result.length === value_1) {
                                            users_1.candidate = candidates_1;
                                            console.log("fetch all records" + value_1);
                                            callback(null, users_1);
                                        }
                                    }
                                });
                            };
                            for (var i = 0; i < result.length; i++) {
                                _loop_1(i);
                            }
                        }
                        else {
                            console.log("inside recruiter fetch");
                            var recruiters_1 = new Array(0);
                            var recruiterFields = {
                                '_id': 1,
                                'company_name': 1,
                                'company_size': 1,
                                'isRecruitingForself': 1,
                                'postedJobs': 1
                            };
                            var _loop_2 = function (i) {
                                recruiterService_1.retrieveWithLean({ 'userId': new mongoose.Types.ObjectId(result[i]._id) }, recruiterFields, function (error, resu) {
                                    if (error) {
                                        callback(error, null);
                                    }
                                    else {
                                        value_1++;
                                        resu[0].numberOfJobsPosted = resu[0].postedJobs.length;
                                        recruiterService_1.loadCapbilityAndKeySkills(resu[0].postedJobs);
                                        result[i].data = resu[0];
                                        recruiters_1.push(result[i]);
                                        if (value_1 && result.length === value_1) {
                                            users_1.recruiter = recruiters_1;
                                            console.log("fetch all records" + value_1);
                                            callback(null, users_1);
                                        }
                                    }
                                });
                            };
                            for (var i = 0; i < result.length; i++) {
                                _loop_2(i);
                            }
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
            var recruiterService = new RecruiterService();
            var users_3 = new UsersClassModel();
            var recruiters_2 = new Array(0);
            var regEx = new RegExp('^[' + initial.toLowerCase() + initial.toUpperCase() + ']');
            var findQuery = {
                'company_name': {
                    $regex: regEx
                }
            };
            var sortingQuery = { 'company_name': 1, 'company_size': 1 };
            var recruiterFields = {
                '_id': 1,
                'userId': 1,
                'company_name': 1,
                'company_size': 1,
                'isRecruitingForself': 1,
                'postedJobs': 1
            };
            recruiterService.retrieveBySortedOrder(findQuery, recruiterFields, sortingQuery, function (error, result) {
                if (error) {
                    callback(error, null);
                }
                else {
                    users_3.totalNumberOfRecruiters = result.length;
                    if (result.length == 0) {
                        callback(null, users_3);
                    }
                    else {
                        var value_2 = 0;
                        var _loop_3 = function (i) {
                            userService_1.retrieveWithLean({ '_id': new mongoose.Types.ObjectId(result[i].userId) }, function (error, resu) {
                                if (error) {
                                    callback(error, null);
                                }
                                else {
                                    value_2++;
                                    resu[0].data = result[i];
                                    recruiters_2.push(resu[0]);
                                    if (value_2 && result.length === value_2) {
                                        users_3.recruiter = recruiters_2;
                                        callback(null, users_3);
                                    }
                                }
                            });
                        };
                        for (var i = 0; i < result.length; i++) {
                            _loop_3(i);
                        }
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
            var candidateService_2 = new CandidateService();
            var users_4 = new UsersClassModel();
            var candidates_2 = new Array(0);
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
                        var value_3 = 0;
                        var candidateFields = {
                            '_id': 1,
                            'jobTitle': 1,
                            'isCompleted': 1,
                            'isSubmitted': 1,
                            'location': 1
                        };
                        var _loop_4 = function (i) {
                            candidateService_2.retrieveWithLean({ 'userId': new mongoose.Types.ObjectId(result[i]._id) }, candidateFields, function (error, resu) {
                                if (error) {
                                    callback(error, null);
                                }
                                else {
                                    value_3++;
                                    result[i].data = resu[0];
                                    candidates_2.push(result[i]);
                                    if (value_3 && result.length === value_3) {
                                        users_4.candidate = candidates_2;
                                        callback(null, users_4);
                                    }
                                }
                            });
                        };
                        for (var i = 0; i < result.length; i++) {
                            _loop_4(i);
                        }
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
            var csv = json2csv({
                data: result.candidate, fields: fields, fieldNames: fieldNames,
                unwindPath: ['data.roles', 'data.capabilityMatrix']
            });
            console.log("writing into file file");
            fs.writeFile('/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/candidate.csv', csv, function (err) {
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
            var csv = json2csv({
                data: result.recruiter,
                fields: fields,
                fieldNames: fieldNames,
                unwindPath: ['data.postedJobs', 'data.postedJobs.roles', 'data.postedJobs.capabilityMatrix']
            });
            fs.writeFile('/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/recruiter.csv', csv, function (err) {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvYWRtaW4uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBR0EseUVBQTRFO0FBQzVFLG9EQUF1RDtBQUN2RCxtQ0FBcUM7QUFDckMsNkRBQXlEO0FBQ3pELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDbkMsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZCLDZDQUFnRDtBQUNoRCx1REFBMEQ7QUFDMUQsbUZBQXNGO0FBQ3RGLDJEQUE4RDtBQUM5RCxzREFBeUQ7QUFDekQsc0RBQXlEO0FBRXpELGlGQUFvRjtBQUlwRiw0Q0FBK0M7QUFDL0MsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBRTVDO0lBUUU7UUFDRSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztRQUNuRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1FBQ3JELElBQUksR0FBRyxHQUFRLElBQUksWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQy9DLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDO0lBQ2hELENBQUM7SUFFRCxxQ0FBYyxHQUFkLFVBQWUsUUFBZ0IsRUFBRSxRQUF1RDtRQUN0RixJQUFJLENBQUM7WUFDSCxJQUFJLFdBQVcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1lBQ3BDLElBQUksa0JBQWdCLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1lBQzlDLElBQUksa0JBQWdCLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1lBQzlDLElBQUksT0FBSyxHQUFvQixJQUFJLGVBQWUsRUFBRSxDQUFDO1lBQ25ELElBQUksU0FBUyxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7WUFFN0IsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLFNBQVMsR0FBRyxFQUFDLGFBQWEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBQyxDQUFDO1lBQ3RELENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixTQUFTLEdBQUcsRUFBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUMsQ0FBQztZQUN2RCxDQUFDO1lBRUQsSUFBSSxlQUFlLEdBQUc7Z0JBQ3BCLEtBQUssRUFBRSxDQUFDO2dCQUNSLFlBQVksRUFBRSxDQUFDO2dCQUNmLFdBQVcsRUFBRSxDQUFDO2dCQUNkLGVBQWUsRUFBRSxDQUFDO2dCQUNsQixPQUFPLEVBQUUsQ0FBQztnQkFDVixhQUFhLEVBQUUsQ0FBQztnQkFDaEIsYUFBYSxFQUFFLENBQUM7YUFDakIsQ0FBQztZQUNGLElBQUksWUFBWSxHQUFHLEVBQUMsWUFBWSxFQUFFLENBQUMsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFDLENBQUM7WUFFckQsV0FBVyxDQUFDLHFCQUFxQixDQUFDLFNBQVMsRUFBRSxlQUFlLEVBQUUsWUFBWSxFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07Z0JBQ3hGLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1YsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDeEIsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3ZCLFFBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBSyxDQUFDLENBQUM7b0JBQ3hCLENBQUM7b0JBQ0QsSUFBSSxDQUFDLENBQUM7d0JBQ0osSUFBSSxPQUFLLEdBQUcsQ0FBQyxDQUFDO3dCQUNkLEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDOzRCQUM1QixJQUFJLFlBQVUsR0FBMEIsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3JELElBQUksZUFBZSxHQUFHO2dDQUNwQixLQUFLLEVBQUUsQ0FBQztnQ0FDUixVQUFVLEVBQUUsQ0FBQztnQ0FDYixhQUFhLEVBQUUsQ0FBQztnQ0FDaEIsYUFBYSxFQUFFLENBQUM7Z0NBQ2hCLFVBQVUsRUFBRSxDQUFDO2dDQUNiLGVBQWUsRUFBRSxDQUFDO2dDQUNsQixxQkFBcUIsRUFBRSxDQUFDO2dDQUN4QixtQkFBbUIsRUFBRSxDQUFDO2dDQUN0QixXQUFXLEVBQUUsQ0FBQztnQ0FDZCxVQUFVLEVBQUUsQ0FBQzs2QkFDZCxDQUFDO29EQUNPLENBQUM7Z0NBQ1Isa0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUMsRUFBRSxlQUFlLEVBQUUsVUFBQyxLQUFLLEVBQUUsSUFBSTtvQ0FDckgsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzt3Q0FDVixRQUFRLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO29DQUN4QixDQUFDO29DQUFDLElBQUksQ0FBQyxDQUFDO3dDQUNOLE9BQUssRUFBRSxDQUFDO3dDQUNSLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7NENBQ3JDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO3dDQUMzRSxDQUFDO3dDQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDOzRDQUNyQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLGtCQUFnQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO3dDQUNyRSxDQUFDO3dDQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7NENBQzlCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsR0FBRyxrQkFBZ0IsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQzt3Q0FDL0YsQ0FBQzt3Q0FFRCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3Q0FDekIsWUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3Q0FDM0IsRUFBRSxDQUFDLENBQUMsT0FBSyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssT0FBSyxDQUFDLENBQUMsQ0FBQzs0Q0FDckMsT0FBSyxDQUFDLFNBQVMsR0FBRyxZQUFVLENBQUM7NENBQzdCLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEdBQUcsT0FBSyxDQUFDLENBQUM7NENBQ3pDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBSyxDQUFDLENBQUM7d0NBQ3hCLENBQUM7b0NBQ0gsQ0FBQztnQ0FDSCxDQUFDLENBQUMsQ0FBQzs0QkFDTCxDQUFDOzRCQTNCRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFO3dDQUE3QixDQUFDOzZCQTJCVDt3QkFDSCxDQUFDO3dCQUNELElBQUksQ0FBQyxDQUFDOzRCQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQzs0QkFDdEMsSUFBSSxZQUFVLEdBQTBCLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNyRCxJQUFJLGVBQWUsR0FBRztnQ0FDcEIsS0FBSyxFQUFFLENBQUM7Z0NBQ1IsY0FBYyxFQUFFLENBQUM7Z0NBQ2pCLGNBQWMsRUFBRSxDQUFDO2dDQUNqQixxQkFBcUIsRUFBRSxDQUFDO2dDQUN4QixZQUFZLEVBQUUsQ0FBQzs2QkFDaEIsQ0FBQztvREFFTyxDQUFDO2dDQUNOLGtCQUFnQixDQUFDLGdCQUFnQixDQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLEVBQUUsZUFBZSxFQUFFLFVBQUMsS0FBSyxFQUFFLElBQUk7b0NBQ3JILEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7d0NBQ1YsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztvQ0FDeEIsQ0FBQztvQ0FBQyxJQUFJLENBQUMsQ0FBQzt3Q0FDTixPQUFLLEVBQUUsQ0FBQzt3Q0FDUixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7d0NBQ3ZELGtCQUFnQixDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQzt3Q0FDL0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7d0NBQ3pCLFlBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0NBQzNCLEVBQUUsQ0FBQyxDQUFDLE9BQUssSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLE9BQUssQ0FBQyxDQUFDLENBQUM7NENBQ3JDLE9BQUssQ0FBQyxTQUFTLEdBQUcsWUFBVSxDQUFDOzRDQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixHQUFHLE9BQUssQ0FBQyxDQUFDOzRDQUN6QyxRQUFRLENBQUMsSUFBSSxFQUFFLE9BQUssQ0FBQyxDQUFDO3dDQUN4QixDQUFDO29DQUNILENBQUM7Z0NBQ0gsQ0FBQyxDQUFDLENBQUM7NEJBQ1AsQ0FBQzs0QkFqQkQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTt3Q0FBN0IsQ0FBQzs2QkFpQlQ7d0JBQ0gsQ0FBQztvQkFDSCxDQUFDO2dCQUVILENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFBQyxLQUFLLENBQ0wsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ0wsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwQixDQUFDO0lBQ0gsQ0FBQztJQUFBLENBQUM7SUFFRixzQ0FBZSxHQUFmLFVBQWdCLElBQVMsRUFBRSxRQUEyQztRQUNwRSxJQUFJLENBQUM7WUFDSCxJQUFJLGdCQUFnQixHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztZQUM5QyxJQUFJLGtCQUFnQixHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztZQUM5QyxJQUFJLE9BQUssR0FBb0IsSUFBSSxlQUFlLEVBQUUsQ0FBQztZQUNuRCxJQUFJLFNBQVMsR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO1lBRTdCLGdCQUFnQixDQUFDLHNCQUFzQixDQUFDLFVBQUMsS0FBSyxFQUFFLGNBQWM7Z0JBQzVELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1YsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDeEIsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixPQUFLLENBQUMsdUJBQXVCLEdBQUcsY0FBYyxDQUFDO29CQUMvQyxrQkFBZ0IsQ0FBQyxzQkFBc0IsQ0FBQyxVQUFDLEtBQUssRUFBRSxjQUFjO3dCQUM1RCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOzRCQUNWLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQ3hCLENBQUM7d0JBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ04sT0FBSyxDQUFDLHVCQUF1QixHQUFHLGNBQWMsQ0FBQzs0QkFDL0MsUUFBUSxDQUFDLElBQUksRUFBRSxPQUFLLENBQUMsQ0FBQzt3QkFDeEIsQ0FBQztvQkFDSCxDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBQ0QsS0FBSyxDQUNILENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNMLFFBQVEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEIsQ0FBQztJQUNILENBQUM7SUFFRCwwQ0FBbUIsR0FBbkIsVUFBb0IsT0FBZSxFQUFFLFFBQTJDO1FBQzlFLElBQUksQ0FBQztZQUNILElBQUksYUFBVyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7WUFDcEMsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7WUFDOUMsSUFBSSxPQUFLLEdBQW9CLElBQUksZUFBZSxFQUFFLENBQUM7WUFDbkQsSUFBSSxZQUFVLEdBQTBCLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXJELElBQUksS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsV0FBVyxFQUFFLEdBQUcsT0FBTyxDQUFDLFdBQVcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ25GLElBQUksU0FBUyxHQUFHO2dCQUNkLGNBQWMsRUFBRTtvQkFDZCxNQUFNLEVBQUUsS0FBSztpQkFDZDthQUNGLENBQUE7WUFDRCxJQUFJLFlBQVksR0FBRyxFQUFDLGNBQWMsRUFBRSxDQUFDLEVBQUUsY0FBYyxFQUFFLENBQUMsRUFBQyxDQUFDO1lBRTFELElBQUksZUFBZSxHQUFHO2dCQUNwQixLQUFLLEVBQUUsQ0FBQztnQkFDUixRQUFRLEVBQUUsQ0FBQztnQkFDWCxjQUFjLEVBQUUsQ0FBQztnQkFDakIsY0FBYyxFQUFFLENBQUM7Z0JBQ2pCLHFCQUFxQixFQUFFLENBQUM7Z0JBQ3hCLFlBQVksRUFBRSxDQUFDO2FBQ2hCLENBQUM7WUFFRixnQkFBZ0IsQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLEVBQUUsZUFBZSxFQUFFLFlBQVksRUFBRSxVQUFDLEtBQUssRUFBRSxNQUFNO2dCQUM3RixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNWLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3hCLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sT0FBSyxDQUFDLHVCQUF1QixHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7b0JBQzlDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDdkIsUUFBUSxDQUFDLElBQUksRUFBRSxPQUFLLENBQUMsQ0FBQztvQkFDeEIsQ0FBQztvQkFDRCxJQUFJLENBQUMsQ0FBQzt3QkFDSixJQUFJLE9BQUssR0FBRyxDQUFDLENBQUM7Z0RBQ0wsQ0FBQzs0QkFDUixhQUFXLENBQUMsZ0JBQWdCLENBQUMsRUFBQyxLQUFLLEVBQUUsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUMsRUFBRSxVQUFDLEtBQUssRUFBRSxJQUFJO2dDQUMvRixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29DQUNWLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0NBQ3hCLENBQUM7Z0NBQUMsSUFBSSxDQUFDLENBQUM7b0NBQ04sT0FBSyxFQUFFLENBQUM7b0NBQ1IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7b0NBQ3pCLFlBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0NBQ3pCLEVBQUUsQ0FBQyxDQUFDLE9BQUssSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLE9BQUssQ0FBQyxDQUFDLENBQUM7d0NBQ3JDLE9BQUssQ0FBQyxTQUFTLEdBQUcsWUFBVSxDQUFDO3dDQUM3QixRQUFRLENBQUMsSUFBSSxFQUFFLE9BQUssQ0FBQyxDQUFDO29DQUN4QixDQUFDO2dDQUNILENBQUM7NEJBQ0gsQ0FBQyxDQUFDLENBQUM7d0JBQ0wsQ0FBQzt3QkFkRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFO29DQUE3QixDQUFDO3lCQWNUO29CQUNILENBQUM7Z0JBQ0gsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUNELEtBQUssQ0FDSCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDTCxRQUFRLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3BCLENBQUM7SUFDSCxDQUFDO0lBRUQsMENBQW1CLEdBQW5CLFVBQW9CLE9BQWUsRUFBRSxRQUEyQztRQUM5RSxJQUFJLENBQUM7WUFDSCxJQUFJLFdBQVcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1lBQ3BDLElBQUksa0JBQWdCLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1lBQzlDLElBQUksT0FBSyxHQUFvQixJQUFJLGVBQWUsRUFBRSxDQUFDO1lBQ25ELElBQUksWUFBVSxHQUEwQixJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVyRCxJQUFJLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLFdBQVcsRUFBRSxHQUFHLE9BQU8sQ0FBQyxXQUFXLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUVuRixJQUFJLFNBQVMsR0FBRztnQkFDZCxZQUFZLEVBQUU7b0JBQ1osTUFBTSxFQUFFLEtBQUs7aUJBQ2Q7Z0JBQ0QsU0FBUyxFQUFFLEtBQUs7Z0JBQ2hCLGFBQWEsRUFBRSxJQUFJO2FBQ3BCLENBQUM7WUFFRixJQUFJLGVBQWUsR0FBRztnQkFDcEIsS0FBSyxFQUFFLENBQUM7Z0JBQ1IsWUFBWSxFQUFFLENBQUM7Z0JBQ2YsV0FBVyxFQUFFLENBQUM7Z0JBQ2QsZUFBZSxFQUFFLENBQUM7Z0JBQ2xCLE9BQU8sRUFBRSxDQUFDO2dCQUNWLGFBQWEsRUFBRSxDQUFDO2FBQ2pCLENBQUM7WUFDRixJQUFJLFlBQVksR0FBRyxFQUFDLFlBQVksRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBQyxDQUFDO1lBRXJELFdBQVcsQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLEVBQUUsZUFBZSxFQUFFLFlBQVksRUFBRSxVQUFDLEtBQUssRUFBRSxNQUFNO2dCQUN4RixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNWLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3hCLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sT0FBSyxDQUFDLHVCQUF1QixHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7b0JBQzlDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDdkIsUUFBUSxDQUFDLElBQUksRUFBRSxPQUFLLENBQUMsQ0FBQztvQkFDeEIsQ0FBQztvQkFDRCxJQUFJLENBQUMsQ0FBQzt3QkFDSixJQUFJLE9BQUssR0FBRyxDQUFDLENBQUM7d0JBQ2QsSUFBSSxlQUFlLEdBQUc7NEJBQ3BCLEtBQUssRUFBRSxDQUFDOzRCQUNSLFVBQVUsRUFBRSxDQUFDOzRCQUNiLGFBQWEsRUFBRSxDQUFDOzRCQUNoQixhQUFhLEVBQUUsQ0FBQzs0QkFDaEIsVUFBVSxFQUFFLENBQUM7eUJBQ2QsQ0FBQztnREFDTyxDQUFDOzRCQUNSLGtCQUFnQixDQUFDLGdCQUFnQixDQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLEVBQUUsZUFBZSxFQUFFLFVBQUMsS0FBSyxFQUFFLElBQUk7Z0NBQ3JILEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0NBQ1YsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztnQ0FDeEIsQ0FBQztnQ0FBQyxJQUFJLENBQUMsQ0FBQztvQ0FDTixPQUFLLEVBQUUsQ0FBQztvQ0FDUixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQ0FDekIsWUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQ0FDM0IsRUFBRSxDQUFDLENBQUMsT0FBSyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssT0FBSyxDQUFDLENBQUMsQ0FBQzt3Q0FDckMsT0FBSyxDQUFDLFNBQVMsR0FBRyxZQUFVLENBQUM7d0NBQzdCLFFBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBSyxDQUFDLENBQUM7b0NBQ3hCLENBQUM7Z0NBQ0gsQ0FBQzs0QkFDSCxDQUFDLENBQUMsQ0FBQzt3QkFDTCxDQUFDO3dCQWRELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7b0NBQTdCLENBQUM7eUJBY1Q7b0JBQ0gsQ0FBQztnQkFFSCxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNYLFFBQVEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEIsQ0FBQztJQUNILENBQUM7SUFFRCwyQ0FBb0IsR0FBcEIsVUFBcUIsSUFBUyxFQUFFLFFBQTJDO1FBQ3pFLElBQUksQ0FBQztZQUNILElBQUksS0FBSyxHQUFXLENBQUMsQ0FBQztZQUN0QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDckMsS0FBSyxFQUFFLENBQUM7Z0JBQ1IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxnQ0FBYyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzdELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDMUIsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDdkIsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNYLFFBQVEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEIsQ0FBQztJQUNILENBQUM7SUFBQSxDQUFDO0lBRUYsOENBQXVCLEdBQXZCLFVBQXdCLE1BQVcsRUFBRSxRQUFzQztRQUN6RSxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLElBQUksTUFBTSxHQUFHLENBQUMsYUFBYSxFQUFFLGFBQWEsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ25GLElBQUksVUFBVSxHQUFHLENBQUMsY0FBYyxFQUFFLGFBQWEsRUFBRSxnQkFBZ0IsRUFBRSxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDMUYsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUMsQ0FBQyxDQUFDO1lBRTNFLEVBQUUsQ0FBQyxTQUFTLENBQUMsb0ZBQW9GLEVBQUUsR0FBRyxFQUFFLFVBQVUsR0FBUTtnQkFDeEgsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDO29CQUFDLE1BQU0sR0FBRyxDQUFDO2dCQUNuQixRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3pCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sUUFBUSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN6QixDQUFDO0lBQ0gsQ0FBQztJQUFBLENBQUM7SUFFRixrREFBMkIsR0FBM0IsVUFBNEIsTUFBVyxFQUFFLFFBQXNDO1FBQzdFLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNwQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEQsSUFBSSxNQUFNLEdBQUcsQ0FBQyxZQUFZLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLG9CQUFvQjtnQkFDcEcsb0NBQW9DLEVBQUUscUNBQXFDO2dCQUMzRSx3Q0FBd0MsRUFBRSx1Q0FBdUM7Z0JBQ2pGLG1DQUFtQyxFQUFFLDJDQUEyQztnQkFDaEYseUNBQXlDLEVBQUUsa0JBQWtCLEVBQUUsa0JBQWtCLEVBQUUsZ0JBQWdCO2dCQUNuRyxnQkFBZ0IsRUFBRSxvQkFBb0IsRUFBRSxZQUFZLEVBQUUsc0NBQXNDO2dCQUM1RixzQ0FBc0MsRUFBRSxvQ0FBb0MsQ0FBQyxDQUFDO1lBQ2hGLElBQUksVUFBVSxHQUFHLENBQUMsWUFBWSxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsV0FBVztnQkFDeEcsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGVBQWUsRUFBRSxtQkFBbUIsRUFBRSxtQkFBbUIsRUFBRSxpQkFBaUI7Z0JBQzVHLGNBQWMsRUFBRSxjQUFjLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLGlCQUFpQjtnQkFDakcsaUJBQWlCLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFFdEMsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDO2dCQUNqQixJQUFJLEVBQUUsTUFBTSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxVQUFVO2dCQUM5RCxVQUFVLEVBQUUsQ0FBQyxZQUFZLEVBQUMsdUJBQXVCLENBQUM7YUFDbkQsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1lBRXRDLEVBQUUsQ0FBQyxTQUFTLENBQUMsa0ZBQWtGLEVBQUUsR0FBRyxFQUFFLFVBQVUsR0FBUTtnQkFDdEgsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDO29CQUFDLE1BQU0sR0FBRyxDQUFDO2dCQUNuQixRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3pCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sUUFBUSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN6QixDQUFDO0lBQ0gsQ0FBQztJQUFBLENBQUM7SUFFRixrREFBMkIsR0FBM0IsVUFBNEIsTUFBVyxFQUFFLFFBQXNDO1FBQzdFLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNwQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEQsSUFBSSxNQUFNLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxtQkFBbUIsRUFBRSwwQkFBMEI7Z0JBQ2hGLHlCQUF5QixFQUFFLGVBQWUsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLDZCQUE2QjtnQkFDakcsMEJBQTBCLEVBQUUsK0JBQStCLEVBQUUsNEJBQTRCO2dCQUN6RiwyQkFBMkIsRUFBRSxvQ0FBb0MsRUFBRSxvQ0FBb0M7Z0JBQ3ZHLGdDQUFnQyxFQUFFLGdDQUFnQyxFQUFFLCtCQUErQjtnQkFDbkcsMkJBQTJCLEVBQUUscUNBQXFDLEVBQUUsK0JBQStCO2dCQUNuRyx1QkFBdUIsRUFBRSxpREFBaUQ7Z0JBQzFFLGlEQUFpRCxFQUFFLCtDQUErQztnQkFDbEcsNkJBQTZCLEVBQUUsOEJBQThCLENBQUMsQ0FBQztZQUVqRSxJQUFJLFVBQVUsR0FBRyxDQUFDLGNBQWMsRUFBRSxjQUFjLEVBQUUscUJBQXFCLEVBQUUsc0JBQXNCLEVBQUUsZUFBZTtnQkFDOUcsT0FBTyxFQUFFLGNBQWMsRUFBRSxlQUFlLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixFQUFFLFlBQVksRUFBRSxXQUFXO2dCQUNsRyxxQkFBcUIsRUFBRSxxQkFBcUIsRUFBRSxpQkFBaUIsRUFBRSxpQkFBaUIsRUFBRSxnQkFBZ0I7Z0JBQ3BHLFlBQVksRUFBRSx1QkFBdUIsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLGlCQUFpQjtnQkFDNUUsaUJBQWlCLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRSxlQUFlLENBQUMsQ0FBQztZQUN2RSxJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUM7Z0JBQ2pCLElBQUksRUFBRSxNQUFNLENBQUMsU0FBUztnQkFDdEIsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsVUFBVSxFQUFFLFVBQVU7Z0JBQ3RCLFVBQVUsRUFBRSxDQUFDLGlCQUFpQixFQUFFLHVCQUF1QixFQUFFLGtDQUFrQyxDQUFDO2FBQzdGLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxTQUFTLENBQUMsa0ZBQWtGLEVBQUUsR0FBRyxFQUFFLFVBQVUsR0FBUTtnQkFDdEgsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDO29CQUFDLE1BQU0sR0FBRyxDQUFDO2dCQUNuQixRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3pCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sUUFBUSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN6QixDQUFDO0lBQ0gsQ0FBQztJQUFBLENBQUM7SUFFRiw2Q0FBc0IsR0FBdEIsVUFBdUIsS0FBVSxFQUFFLFFBQTJDO1FBQzVFLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsZ0RBQWdELENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMzRixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLDREQUE0RCxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDdkcsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzNGLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO2FBQzFJLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7UUFHaEYsSUFBSSxXQUFXLEdBQUc7WUFDaEIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUM7WUFDNUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUM7WUFDekMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUM7WUFDNUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyw2QkFBNkIsR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQztZQUN2RixJQUFJLEVBQUUsT0FBTyxHQUFHLFdBQVcsR0FBRyxPQUFPO1lBQ25DLFdBQVcsRUFBRSxlQUFlLENBQUMsZUFBZTtTQUMvQyxDQUFBO1FBQ0QsSUFBSSxlQUFlLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztRQUM1QyxlQUFlLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUVsRCxDQUFDO0lBQUEsQ0FBQztJQUVGLGlDQUFVLEdBQVYsVUFBVyxHQUFXLEVBQUUsSUFBUyxFQUFFLFFBQTJDO1FBQTlFLGlCQVFDO1FBUEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLFVBQUMsR0FBUSxFQUFFLEdBQVE7WUFDbkQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDUixRQUFRLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3JCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixLQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN0RCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQUEsQ0FBQztJQUVGLHNDQUFlLEdBQWYsVUFBZ0IsS0FBVSxFQUFFLFFBQTJDO1FBQ3JFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLENBQUMsVUFBQyxHQUFRLEVBQUUsR0FBUTtZQUN6RCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNSLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLFFBQVEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDdEIsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBRUwsQ0FBQztJQUNILG1CQUFDO0FBQUQsQ0F4YUEsQUF3YUMsSUFBQTtBQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDMUIsaUJBQVMsWUFBWSxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvc2VydmljZXMvYWRtaW4uc2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IHRlY2hwcmltZTAwMiBvbiA4LzI4LzIwMTcuXHJcbiAqL1xyXG5pbXBvcnQgVXNlclJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvdXNlci5yZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBTZW5kTWFpbFNlcnZpY2UgPSByZXF1aXJlKCcuL3NlbmRtYWlsLnNlcnZpY2UnKTtcclxuaW1wb3J0ICogYXMgbW9uZ29vc2UgZnJvbSBcIm1vbmdvb3NlXCI7XHJcbmltcG9ydCB7Q29uc3RWYXJpYWJsZXN9IGZyb20gXCIuLi9zaGFyZWQvc2hhcmVkY29uc3RhbnRzXCI7XHJcbmxldCBjb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcclxubGV0IGpzb24yY3N2ID0gcmVxdWlyZSgnanNvbjJjc3YnKTtcclxubGV0IGZzID0gcmVxdWlyZSgnZnMnKTtcclxuaW1wb3J0IE1lc3NhZ2VzID0gcmVxdWlyZSgnLi4vc2hhcmVkL21lc3NhZ2VzJyk7XHJcbmltcG9ydCBNYWlsQXR0YWNobWVudHMgPSByZXF1aXJlKCcuLi9zaGFyZWQvc2hhcmVkYXJyYXknKTtcclxuaW1wb3J0IFJlY3J1aXRlclJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvcmVjcnVpdGVyLnJlcG9zaXRvcnknKTtcclxuaW1wb3J0IFVzZXJzQ2xhc3NNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvdXNlcnMnKTtcclxuaW1wb3J0IENhbmRpZGF0ZVNlcnZpY2UgPSByZXF1aXJlKCcuL2NhbmRpZGF0ZS5zZXJ2aWNlJyk7XHJcbmltcG9ydCBSZWNydWl0ZXJTZXJ2aWNlID0gcmVxdWlyZSgnLi9yZWNydWl0ZXIuc2VydmljZScpO1xyXG5pbXBvcnQgSW5kdXN0cnlNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvaW5kdXN0cnkubW9kZWwnKTtcclxuaW1wb3J0IEluZHVzdHJ5UmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9pbmR1c3RyeS5yZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBDYW5kaWRhdGVNb2RlbENsYXNzID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9jYW5kaWRhdGVDbGFzcy5tb2RlbCcpO1xyXG5pbXBvcnQgUmVjcnVpdGVyQ2xhc3NNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcmVjcnVpdGVyQ2xhc3MubW9kZWwnKTtcclxuaW1wb3J0IENhbmRpZGF0ZUNsYXNzTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL2NhbmRpZGF0ZS1jbGFzcy5tb2RlbCcpO1xyXG5pbXBvcnQgVXNlclNlcnZpY2UgPSByZXF1aXJlKFwiLi91c2VyLnNlcnZpY2VcIik7XHJcbmxldCB1c2VzdHJhY2tpbmcgPSByZXF1aXJlKCd1c2VzLXRyYWNraW5nJyk7XHJcblxyXG5jbGFzcyBBZG1pblNlcnZpY2Uge1xyXG4gIGNvbXBhbnlfbmFtZTogc3RyaW5nO1xyXG4gIHByaXZhdGUgdXNlclJlcG9zaXRvcnk6IFVzZXJSZXBvc2l0b3J5O1xyXG4gIHByaXZhdGUgaW5kdXN0cnlSZXBvc2l0aXJ5OiBJbmR1c3RyeVJlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSByZWNydWl0ZXJSZXBvc2l0b3J5OiBSZWNydWl0ZXJSZXBvc2l0b3J5O1xyXG4gIHByaXZhdGUgdXNlc1RyYWNraW5nQ29udHJvbGxlcjogYW55O1xyXG5cclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5ID0gbmV3IFVzZXJSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLmluZHVzdHJ5UmVwb3NpdGlyeSA9IG5ldyBJbmR1c3RyeVJlcG9zaXRvcnkoKTtcclxuICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeSA9IG5ldyBSZWNydWl0ZXJSZXBvc2l0b3J5KCk7XHJcbiAgICBsZXQgb2JqOiBhbnkgPSBuZXcgdXNlc3RyYWNraW5nLk15Q29udHJvbGxlcigpO1xyXG4gICAgdGhpcy51c2VzVHJhY2tpbmdDb250cm9sbGVyID0gb2JqLl9jb250cm9sbGVyO1xyXG4gIH1cclxuXHJcbiAgZ2V0VXNlckRldGFpbHModXNlclR5cGU6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IFVzZXJzQ2xhc3NNb2RlbCkgPT4gdm9pZCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCBjYW5kaWRhdGVTZXJ2aWNlID0gbmV3IENhbmRpZGF0ZVNlcnZpY2UoKTtcclxuICAgICAgbGV0IHJlY3J1aXRlclNlcnZpY2UgPSBuZXcgUmVjcnVpdGVyU2VydmljZSgpO1xyXG4gICAgICBsZXQgdXNlcnM6IFVzZXJzQ2xhc3NNb2RlbCA9IG5ldyBVc2Vyc0NsYXNzTW9kZWwoKTtcclxuICAgICAgbGV0IGZpbmRRdWVyeSA9IG5ldyBPYmplY3QoKTtcclxuXHJcbiAgICAgIGlmICh1c2VyVHlwZSA9PSAnY2FuZGlkYXRlJykge1xyXG4gICAgICAgIGZpbmRRdWVyeSA9IHsnaXNDYW5kaWRhdGUnOiB0cnVlLCAnaXNBZG1pbic6IGZhbHNlfTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBmaW5kUXVlcnkgPSB7J2lzQ2FuZGlkYXRlJzogZmFsc2UsICdpc0FkbWluJzogZmFsc2V9O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgaW5jbHVkZWRfZmllbGRzID0ge1xyXG4gICAgICAgICdfaWQnOiAxLFxyXG4gICAgICAgICdmaXJzdF9uYW1lJzogMSxcclxuICAgICAgICAnbGFzdF9uYW1lJzogMSxcclxuICAgICAgICAnbW9iaWxlX251bWJlcic6IDEsXHJcbiAgICAgICAgJ2VtYWlsJzogMSxcclxuICAgICAgICAnaXNDYW5kaWRhdGUnOiAxLFxyXG4gICAgICAgICdpc0FjdGl2YXRlZCc6IDFcclxuICAgICAgfTtcclxuICAgICAgbGV0IHNvcnRpbmdRdWVyeSA9IHsnZmlyc3RfbmFtZSc6IDEsICdsYXN0X25hbWUnOiAxfTtcclxuXHJcbiAgICAgIHVzZXJTZXJ2aWNlLnJldHJpZXZlQnlTb3J0ZWRPcmRlcihmaW5kUXVlcnksIGluY2x1ZGVkX2ZpZWxkcywgc29ydGluZ1F1ZXJ5LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHVzZXJzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSAwO1xyXG4gICAgICAgICAgICBpZiAodXNlclR5cGUgPT0gJ2NhbmRpZGF0ZScpIHtcclxuICAgICAgICAgICAgICBsZXQgY2FuZGlkYXRlczogQ2FuZGlkYXRlTW9kZWxDbGFzc1tdID0gbmV3IEFycmF5KDApO1xyXG4gICAgICAgICAgICAgIGxldCBjYW5kaWRhdGVGaWVsZHMgPSB7XHJcbiAgICAgICAgICAgICAgICAnX2lkJzogMSxcclxuICAgICAgICAgICAgICAgICdqb2JUaXRsZSc6IDEsXHJcbiAgICAgICAgICAgICAgICAnaXNDb21wbGV0ZWQnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ2lzU3VibWl0dGVkJzogMSxcclxuICAgICAgICAgICAgICAgICdsb2NhdGlvbic6IDEsXHJcbiAgICAgICAgICAgICAgICAncHJvZmljaWVuY2llcyc6IDEsXHJcbiAgICAgICAgICAgICAgICAncHJvZmVzc2lvbmFsRGV0YWlscyc6IDEsXHJcbiAgICAgICAgICAgICAgICAnY2FwYWJpbGl0eV9tYXRyaXgnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ2lzVmlzaWJsZSc6IDEsXHJcbiAgICAgICAgICAgICAgICAnaW5kdXN0cnknOiAxXHJcbiAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY2FuZGlkYXRlU2VydmljZS5yZXRyaWV2ZVdpdGhMZWFuKHsndXNlcklkJzogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKHJlc3VsdFtpXS5faWQpfSwgY2FuZGlkYXRlRmllbGRzLCAoZXJyb3IsIHJlc3UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlKys7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VbMF0ucHJvZmljaWVuY2llcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXN1WzBdLmtleVNraWxscyA9IHJlc3VbMF0ucHJvZmljaWVuY2llcy50b1N0cmluZygpLnJlcGxhY2UoLywvZywgJyAkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdVswXS5pbmR1c3RyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmVzdVswXS5yb2xlcyA9IGNhbmRpZGF0ZVNlcnZpY2UubG9hZFJvbGVzKHJlc3VbMF0uaW5kdXN0cnkucm9sZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VbMF0uY2FwYWJpbGl0eV9tYXRyaXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHJlc3VbMF0uY2FwYWJpbGl0eU1hdHJpeCA9IGNhbmRpZGF0ZVNlcnZpY2UubG9hZENhcGFiaWxpdGlEZXRhaWxzKHJlc3VbMF0uY2FwYWJpbGl0eV9tYXRyaXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2ldLmRhdGEgPSByZXN1WzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZXMucHVzaChyZXN1bHRbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAmJiByZXN1bHQubGVuZ3RoID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdXNlcnMuY2FuZGlkYXRlID0gY2FuZGlkYXRlcztcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZmV0Y2ggYWxsIHJlY29yZHNcIiArIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHVzZXJzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImluc2lkZSByZWNydWl0ZXIgZmV0Y2hcIik7XHJcbiAgICAgICAgICAgICAgbGV0IHJlY3J1aXRlcnM6IFJlY3J1aXRlckNsYXNzTW9kZWxbXSA9IG5ldyBBcnJheSgwKTtcclxuICAgICAgICAgICAgICBsZXQgcmVjcnVpdGVyRmllbGRzID0ge1xyXG4gICAgICAgICAgICAgICAgJ19pZCc6IDEsXHJcbiAgICAgICAgICAgICAgICAnY29tcGFueV9uYW1lJzogMSxcclxuICAgICAgICAgICAgICAgICdjb21wYW55X3NpemUnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ2lzUmVjcnVpdGluZ0ZvcnNlbGYnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ3Bvc3RlZEpvYnMnOiAxXHJcbiAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgcmVjcnVpdGVyU2VydmljZS5yZXRyaWV2ZVdpdGhMZWFuKHsndXNlcklkJzogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKHJlc3VsdFtpXS5faWQpfSwgcmVjcnVpdGVyRmllbGRzLCAoZXJyb3IsIHJlc3UpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWUrKztcclxuICAgICAgICAgICAgICAgICAgICAgIHJlc3VbMF0ubnVtYmVyT2ZKb2JzUG9zdGVkID0gcmVzdVswXS5wb3N0ZWRKb2JzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICAgIHJlY3J1aXRlclNlcnZpY2UubG9hZENhcGJpbGl0eUFuZEtleVNraWxscyhyZXN1WzBdLnBvc3RlZEpvYnMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2ldLmRhdGEgPSByZXN1WzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmVjcnVpdGVycy5wdXNoKHJlc3VsdFtpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgJiYgcmVzdWx0Lmxlbmd0aCA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcnMucmVjcnVpdGVyID0gcmVjcnVpdGVycztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmZXRjaCBhbGwgcmVjb3Jkc1wiICsgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB1c2Vycyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2hcclxuICAgICAgKGUpIHtcclxuICAgICAgY2FsbGJhY2soZSwgbnVsbCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgZ2V0Q291bnRPZlVzZXJzKGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IGNhbmRpZGF0ZVNlcnZpY2UgPSBuZXcgQ2FuZGlkYXRlU2VydmljZSgpO1xyXG4gICAgICBsZXQgcmVjcnVpdGVyU2VydmljZSA9IG5ldyBSZWNydWl0ZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCB1c2VyczogVXNlcnNDbGFzc01vZGVsID0gbmV3IFVzZXJzQ2xhc3NNb2RlbCgpO1xyXG4gICAgICBsZXQgZmluZFF1ZXJ5ID0gbmV3IE9iamVjdCgpO1xyXG5cclxuICAgICAgY2FuZGlkYXRlU2VydmljZS5nZXRUb3RhbENhbmRpZGF0ZUNvdW50KChlcnJvciwgY2FuZGlkYXRlQ291bnQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdXNlcnMudG90YWxOdW1iZXJPZkNhbmRpZGF0ZXMgPSBjYW5kaWRhdGVDb3VudDtcclxuICAgICAgICAgIHJlY3J1aXRlclNlcnZpY2UuZ2V0VG90YWxSZWNydWl0ZXJDb3VudCgoZXJyb3IsIHJlY3J1aXRlckNvdW50KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB1c2Vycy50b3RhbE51bWJlck9mUmVjcnVpdGVycyA9IHJlY3J1aXRlckNvdW50O1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHVzZXJzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGNhdGNoXHJcbiAgICAgIChlKSB7XHJcbiAgICAgIGNhbGxiYWNrKGUsIG51bGwpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0UmVjcnVpdGVyRGV0YWlscyhpbml0aWFsOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICBsZXQgcmVjcnVpdGVyU2VydmljZSA9IG5ldyBSZWNydWl0ZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCB1c2VyczogVXNlcnNDbGFzc01vZGVsID0gbmV3IFVzZXJzQ2xhc3NNb2RlbCgpO1xyXG4gICAgICBsZXQgcmVjcnVpdGVyczogUmVjcnVpdGVyQ2xhc3NNb2RlbFtdID0gbmV3IEFycmF5KDApO1xyXG5cclxuICAgICAgbGV0IHJlZ0V4ID0gbmV3IFJlZ0V4cCgnXlsnICsgaW5pdGlhbC50b0xvd2VyQ2FzZSgpICsgaW5pdGlhbC50b1VwcGVyQ2FzZSgpICsgJ10nKTtcclxuICAgICAgbGV0IGZpbmRRdWVyeSA9IHtcclxuICAgICAgICAnY29tcGFueV9uYW1lJzoge1xyXG4gICAgICAgICAgJHJlZ2V4OiByZWdFeFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBsZXQgc29ydGluZ1F1ZXJ5ID0geydjb21wYW55X25hbWUnOiAxLCAnY29tcGFueV9zaXplJzogMX07XHJcblxyXG4gICAgICBsZXQgcmVjcnVpdGVyRmllbGRzID0ge1xyXG4gICAgICAgICdfaWQnOiAxLFxyXG4gICAgICAgICd1c2VySWQnOiAxLFxyXG4gICAgICAgICdjb21wYW55X25hbWUnOiAxLFxyXG4gICAgICAgICdjb21wYW55X3NpemUnOiAxLFxyXG4gICAgICAgICdpc1JlY3J1aXRpbmdGb3JzZWxmJzogMSxcclxuICAgICAgICAncG9zdGVkSm9icyc6IDFcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJlY3J1aXRlclNlcnZpY2UucmV0cmlldmVCeVNvcnRlZE9yZGVyKGZpbmRRdWVyeSwgcmVjcnVpdGVyRmllbGRzLCBzb3J0aW5nUXVlcnksIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHVzZXJzLnRvdGFsTnVtYmVyT2ZSZWNydWl0ZXJzID0gcmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXNlcnMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IDA7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgdXNlclNlcnZpY2UucmV0cmlldmVXaXRoTGVhbih7J19pZCc6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZChyZXN1bHRbaV0udXNlcklkKX0sIChlcnJvciwgcmVzdSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlKys7XHJcbiAgICAgICAgICAgICAgICAgIHJlc3VbMF0uZGF0YSA9IHJlc3VsdFtpXTtcclxuICAgICAgICAgICAgICAgICAgcmVjcnVpdGVycy5wdXNoKHJlc3VbMF0pO1xyXG4gICAgICAgICAgICAgICAgICBpZiAodmFsdWUgJiYgcmVzdWx0Lmxlbmd0aCA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB1c2Vycy5yZWNydWl0ZXIgPSByZWNydWl0ZXJzO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHVzZXJzKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGNhdGNoXHJcbiAgICAgIChlKSB7XHJcbiAgICAgIGNhbGxiYWNrKGUsIG51bGwpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0Q2FuZGlkYXRlRGV0YWlscyhpbml0aWFsOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICBsZXQgY2FuZGlkYXRlU2VydmljZSA9IG5ldyBDYW5kaWRhdGVTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCB1c2VyczogVXNlcnNDbGFzc01vZGVsID0gbmV3IFVzZXJzQ2xhc3NNb2RlbCgpO1xyXG4gICAgICBsZXQgY2FuZGlkYXRlczogQ2FuZGlkYXRlTW9kZWxDbGFzc1tdID0gbmV3IEFycmF5KDApO1xyXG5cclxuICAgICAgbGV0IHJlZ0V4ID0gbmV3IFJlZ0V4cCgnXlsnICsgaW5pdGlhbC50b0xvd2VyQ2FzZSgpICsgaW5pdGlhbC50b1VwcGVyQ2FzZSgpICsgJ10nKTtcclxuXHJcbiAgICAgIGxldCBmaW5kUXVlcnkgPSB7XHJcbiAgICAgICAgJ2ZpcnN0X25hbWUnOiB7XHJcbiAgICAgICAgICAkcmVnZXg6IHJlZ0V4XHJcbiAgICAgICAgfSxcclxuICAgICAgICAnaXNBZG1pbic6IGZhbHNlLFxyXG4gICAgICAgICdpc0NhbmRpZGF0ZSc6IHRydWVcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGxldCBpbmNsdWRlZF9maWVsZHMgPSB7XHJcbiAgICAgICAgJ19pZCc6IDEsXHJcbiAgICAgICAgJ2ZpcnN0X25hbWUnOiAxLFxyXG4gICAgICAgICdsYXN0X25hbWUnOiAxLFxyXG4gICAgICAgICdtb2JpbGVfbnVtYmVyJzogMSxcclxuICAgICAgICAnZW1haWwnOiAxLFxyXG4gICAgICAgICdpc0FjdGl2YXRlZCc6IDFcclxuICAgICAgfTtcclxuICAgICAgbGV0IHNvcnRpbmdRdWVyeSA9IHsnZmlyc3RfbmFtZSc6IDEsICdsYXN0X25hbWUnOiAxfTtcclxuXHJcbiAgICAgIHVzZXJTZXJ2aWNlLnJldHJpZXZlQnlTb3J0ZWRPcmRlcihmaW5kUXVlcnksIGluY2x1ZGVkX2ZpZWxkcywgc29ydGluZ1F1ZXJ5LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB1c2Vycy50b3RhbE51bWJlck9mQ2FuZGlkYXRlcyA9IHJlc3VsdC5sZW5ndGg7XHJcbiAgICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHVzZXJzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSAwO1xyXG4gICAgICAgICAgICBsZXQgY2FuZGlkYXRlRmllbGRzID0ge1xyXG4gICAgICAgICAgICAgICdfaWQnOiAxLFxyXG4gICAgICAgICAgICAgICdqb2JUaXRsZSc6IDEsXHJcbiAgICAgICAgICAgICAgJ2lzQ29tcGxldGVkJzogMSxcclxuICAgICAgICAgICAgICAnaXNTdWJtaXR0ZWQnOiAxLFxyXG4gICAgICAgICAgICAgICdsb2NhdGlvbic6IDFcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICBjYW5kaWRhdGVTZXJ2aWNlLnJldHJpZXZlV2l0aExlYW4oeyd1c2VySWQnOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQocmVzdWx0W2ldLl9pZCl9LCBjYW5kaWRhdGVGaWVsZHMsIChlcnJvciwgcmVzdSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlKys7XHJcbiAgICAgICAgICAgICAgICAgIHJlc3VsdFtpXS5kYXRhID0gcmVzdVswXTtcclxuICAgICAgICAgICAgICAgICAgY2FuZGlkYXRlcy5wdXNoKHJlc3VsdFtpXSk7XHJcbiAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAmJiByZXN1bHQubGVuZ3RoID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJzLmNhbmRpZGF0ZSA9IGNhbmRpZGF0ZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXNlcnMpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgY2FsbGJhY2soZSwgbnVsbCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhZGRVc2FnZURldGFpbHNWYWx1ZShpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB2YWx1ZTogbnVtYmVyID0gMDtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFsdWUrKztcclxuICAgICAgICBpdGVtW2ldLmFjdGlvbiA9IENvbnN0VmFyaWFibGVzLkFjdGlvbnNBcnJheVtpdGVtW2ldLmFjdGlvbl07XHJcbiAgICAgICAgaWYgKGl0ZW0ubGVuZ3RoID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwgaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIGNhbGxiYWNrKGUsIG51bGwpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGdlbmVyYXRlVXNhZ2VEZXRhaWxGaWxlKHJlc3VsdDogYW55LCBjYWxsYmFjazogKGVycjogYW55LCByZXM6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgaWYgKHJlc3VsdCAmJiByZXN1bHQubGVuZ3RoID4gMCkge1xyXG4gICAgICBsZXQgZmllbGRzID0gWydjYW5kaWRhdGVJZCcsICdyZWNydWl0ZXJJZCcsICdqb2JQcm9maWxlSWQnLCAnYWN0aW9uJywgJ3RpbWVzdGFtcCddO1xyXG4gICAgICBsZXQgZmllbGROYW1lcyA9IFsnQ2FuZGlkYXRlIElkJywgJ1JlY3J1aXRlcklkJywgJ0pvYiBQcm9maWxlIElkJywgJ0FjdGlvbicsICdUaW1lU3RhbXAnXTtcclxuICAgICAgbGV0IGNzdiA9IGpzb24yY3N2KHtkYXRhOiByZXN1bHQsIGZpZWxkczogZmllbGRzLCBmaWVsZE5hbWVzOiBmaWVsZE5hbWVzfSk7XHJcbiAgICAgIC8vZnMud3JpdGVGaWxlKCcuL3NyYy9zZXJ2ZXIvcHVibGljL3VzYWdlZGV0YWlsLmNzdicsIGNzdiwgZnVuY3Rpb24gKGVycjogYW55KSB7XHJcbiAgICAgIGZzLndyaXRlRmlsZSgnL2hvbWUvYml0bmFtaS9hcHBzL2pvYm1vc2lzLXN0YWdpbmcvYy1uZXh0L2Rpc3Qvc2VydmVyL3Byb2QvcHVibGljL3VzYWdlZGV0YWlsLmNzdicsIGNzdiwgZnVuY3Rpb24gKGVycjogYW55KSB7XHJcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBnZW5lcmF0ZUNhbmRpZGF0ZURldGFpbEZpbGUocmVzdWx0OiBhbnksIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcImluc2lkZSBnZW5lcmF0ZSBmaWxlXCIpO1xyXG4gICAgaWYgKHJlc3VsdC5jYW5kaWRhdGUgJiYgcmVzdWx0LmNhbmRpZGF0ZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGxldCBmaWVsZHMgPSBbJ2ZpcnN0X25hbWUnLCAnbGFzdF9uYW1lJywgJ21vYmlsZV9udW1iZXInLCAnZW1haWwnLCAnaXNBY3RpdmF0ZWQnLCAnZGF0YS5sb2NhdGlvbi5jaXR5JyxcclxuICAgICAgICAnZGF0YS5wcm9mZXNzaW9uYWxEZXRhaWxzLmVkdWNhdGlvbicsICdkYXRhLnByb2Zlc3Npb25hbERldGFpbHMuZXhwZXJpZW5jZScsXHJcbiAgICAgICAgJ2RhdGEucHJvZmVzc2lvbmFsRGV0YWlscy5jdXJyZW50U2FsYXJ5JywgJ2RhdGEucHJvZmVzc2lvbmFsRGV0YWlscy5ub3RpY2VQZXJpb2QnLFxyXG4gICAgICAgICdkYXRhLnByb2Zlc3Npb25hbERldGFpbHMucmVsb2NhdGUnLCAnZGF0YS5wcm9mZXNzaW9uYWxEZXRhaWxzLmluZHVzdHJ5RXhwb3N1cmUnLFxyXG4gICAgICAgICdkYXRhLnByb2Zlc3Npb25hbERldGFpbHMuY3VycmVudENvbXBhbnknLCAnZGF0YS5pc0NvbXBsZXRlZCcsICdkYXRhLmlzU3VibWl0dGVkJywgJ2RhdGEuaXNWaXNpYmxlJyxcclxuICAgICAgICAnZGF0YS5rZXlTa2lsbHMnLCAnZGF0YS5pbmR1c3RyeS5uYW1lJywgJ2RhdGEucm9sZXMnLCAnZGF0YS5jYXBhYmlsaXR5TWF0cml4LmNhcGFiaWxpdHlDb2RlJyxcclxuICAgICAgICAnZGF0YS5jYXBhYmlsaXR5TWF0cml4LmNvbXBsZXhpdHlDb2RlJywgJ2RhdGEuY2FwYWJpbGl0eU1hdHJpeC5zY2VuZXJpb0NvZGUnXTtcclxuICAgICAgbGV0IGZpZWxkTmFtZXMgPSBbJ0ZpcnN0IE5hbWUnLCAnTGFzdCBOYW1lJywgJ01vYmlsZSBOdW1iZXInLCAnRW1haWwnLCAnSXMgQWN0aXZhdGVkJywgJ0NpdHknLCAnRWR1Y2F0aW9uJyxcclxuICAgICAgICAnRXhwZXJpZW5jZScsICdDdXJyZW50IFNhbGFyeScsICdOb3RpY2UgUGVyaW9kJywgJ1JlYWR5IFRvIFJlbG9jYXRlJywgJ0luZHVzdHJ5IEV4cG9zdXJlJywgJ0N1cnJlbnQgQ29tcGFueScsXHJcbiAgICAgICAgJ0lzIENvbXBsZXRlZCcsICdJcyBTdWJtaXR0ZWQnLCAnSXMgVmlzaWJsZScsICdLZXkgU2tpbGxzJywgJ0luZHVzdHJ5JywgJ1JvbGUnLCAnQ2FwYWJpbGl0eSBDb2RlJyxcclxuICAgICAgICAnQ29tcGxleGl0eSBDb2RlJywgJ1NjZW5hcmlvIENvZGUnXTtcclxuXHJcbiAgICAgIGxldCBjc3YgPSBqc29uMmNzdih7XHJcbiAgICAgICAgZGF0YTogcmVzdWx0LmNhbmRpZGF0ZSwgZmllbGRzOiBmaWVsZHMsIGZpZWxkTmFtZXM6IGZpZWxkTmFtZXMsXHJcbiAgICAgICAgdW53aW5kUGF0aDogWydkYXRhLnJvbGVzJywnZGF0YS5jYXBhYmlsaXR5TWF0cml4J11cclxuICAgICAgfSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwid3JpdGluZyBpbnRvIGZpbGUgZmlsZVwiKTtcclxuICAgICAgLy9mcy53cml0ZUZpbGUoJy4vc3JjL3NlcnZlci9wdWJsaWMvY2FuZGlkYXRlLmNzdicsIGNzdiwgZnVuY3Rpb24gKGVycjogYW55KSB7XHJcbiAgICAgIGZzLndyaXRlRmlsZSgnL2hvbWUvYml0bmFtaS9hcHBzL2pvYm1vc2lzLXN0YWdpbmcvYy1uZXh0L2Rpc3Qvc2VydmVyL3Byb2QvcHVibGljL2NhbmRpZGF0ZS5jc3YnLCBjc3YsIGZ1bmN0aW9uIChlcnI6IGFueSkge1xyXG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCByZXN1bHQpO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgZ2VuZXJhdGVSZWNydWl0ZXJEZXRhaWxGaWxlKHJlc3VsdDogYW55LCBjYWxsYmFjazogKGVycjogYW55LCByZXM6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgY29uc29sZS5sb2coXCJpbnNpZGUgZ2VuZXJhdGUgZmlsZVwiKTtcclxuICAgIGlmIChyZXN1bHQucmVjcnVpdGVyICYmIHJlc3VsdC5yZWNydWl0ZXIubGVuZ3RoID4gMCkge1xyXG4gICAgICBsZXQgZmllbGRzID0gWydkYXRhLmNvbXBhbnlfbmFtZScsICdkYXRhLmNvbXBhbnlfc2l6ZScsICdkYXRhLmlzUmVjcnVpdGluZ0ZvcnNlbGYnLFxyXG4gICAgICAgICdkYXRhLm51bWJlck9mSm9ic1Bvc3RlZCcsICdtb2JpbGVfbnVtYmVyJywgJ2VtYWlsJywgJ2lzQWN0aXZhdGVkJywgJ2RhdGEucG9zdGVkSm9icy5pc0pvYlBvc3RlZCcsXHJcbiAgICAgICAgJ2RhdGEucG9zdGVkSm9icy5qb2JUaXRsZScsICdkYXRhLnBvc3RlZEpvYnMuaGlyaW5nTWFuYWdlcicsICdkYXRhLnBvc3RlZEpvYnMuZGVwYXJ0bWVudCcsXHJcbiAgICAgICAgJ2RhdGEucG9zdGVkSm9icy5lZHVjYXRpb24nLCAnZGF0YS5wb3N0ZWRKb2JzLmV4cGVyaWVuY2VNaW5WYWx1ZScsICdkYXRhLnBvc3RlZEpvYnMuZXhwZXJpZW5jZU1heFZhbHVlJyxcclxuICAgICAgICAnZGF0YS5wb3N0ZWRKb2JzLnNhbGFyeU1pblZhbHVlJywgJ2RhdGEucG9zdGVkSm9icy5zYWxhcnlNYXhWYWx1ZScsICdkYXRhLnBvc3RlZEpvYnMuam9pbmluZ1BlcmlvZCcsXHJcbiAgICAgICAgJ2RhdGEucG9zdGVkSm9icy5rZXlTa2lsbHMnLCAnZGF0YS5wb3N0ZWRKb2JzLmFkZGl0aW9uYWxLZXlTa2lsbHMnLCAnZGF0YS5wb3N0ZWRKb2JzLmluZHVzdHJ5Lm5hbWUnLFxyXG4gICAgICAgICdkYXRhLnBvc3RlZEpvYnMucm9sZXMnLCAnZGF0YS5wb3N0ZWRKb2JzLmNhcGFiaWxpdHlNYXRyaXguY2FwYWJpbGl0eUNvZGUnLFxyXG4gICAgICAgICdkYXRhLnBvc3RlZEpvYnMuY2FwYWJpbGl0eU1hdHJpeC5jb21wbGV4aXR5Q29kZScsICdkYXRhLnBvc3RlZEpvYnMuY2FwYWJpbGl0eU1hdHJpeC5zY2VuZXJpb0NvZGUnLFxyXG4gICAgICAgICdkYXRhLnBvc3RlZEpvYnMucG9zdGluZ0RhdGUnLCAnZGF0YS5wb3N0ZWRKb2JzLmV4cGlyaW5nRGF0ZSddO1xyXG5cclxuICAgICAgbGV0IGZpZWxkTmFtZXMgPSBbJ0NvbXBhbnkgTmFtZScsICdjb21wYW55IHNpemUnLCAnUmVjcnVpdGluZyBGb3IgU2VsZicsICdOdW1iZXIgb2YgSm9iIFBvc3RlZCcsICdNb2JpbGUgTnVtYmVyJyxcclxuICAgICAgICAnRW1haWwnLCAnSXMgQWN0aXZhdGVkJywgJ0lzIEpvYiBQb3N0ZWQnLCAnSm9iIFRpdGxlJywgJ0hpcmluZyBNYW5hZ2VyJywgJ0RlcGFydG1lbnQnLCAnRWR1Y2F0aW9uJyxcclxuICAgICAgICAnRXhwZXJpZW5jZSBNaW5WYWx1ZScsICdFeHBlcmllbmNlIE1heFZhbHVlJywgJ1NhbGFyeSBNaW5WYWx1ZScsICdTYWxhcnkgTWF4VmFsdWUnLCAnSm9pbmluZyBQZXJpb2QnLFxyXG4gICAgICAgICdLZXkgU2tpbGxzJywgJ0FkZGl0aW9uYWwgS2V5IFNraWxscycsICdJbmR1c3RyeScsICdSb2xlJywgJ0NhcGFiaWxpdHkgQ29kZScsXHJcbiAgICAgICAgJ0NvbXBsZXhpdHkgQ29kZScsICdTY2VuYXJpbyBDb2RlJywgJ1Bvc3RpbmcgRGF0ZScsICdFeHBpcmluZyBEYXRlJ107XHJcbiAgICAgIGxldCBjc3YgPSBqc29uMmNzdih7XHJcbiAgICAgICAgZGF0YTogcmVzdWx0LnJlY3J1aXRlcixcclxuICAgICAgICBmaWVsZHM6IGZpZWxkcyxcclxuICAgICAgICBmaWVsZE5hbWVzOiBmaWVsZE5hbWVzLFxyXG4gICAgICAgIHVud2luZFBhdGg6IFsnZGF0YS5wb3N0ZWRKb2JzJywgJ2RhdGEucG9zdGVkSm9icy5yb2xlcycsICdkYXRhLnBvc3RlZEpvYnMuY2FwYWJpbGl0eU1hdHJpeCddXHJcbiAgICAgIH0pO1xyXG4gICAgICAvL2ZzLndyaXRlRmlsZSgnLi9zcmMvc2VydmVyL3B1YmxpYy9yZWNydWl0ZXIuY3N2JywgY3N2LCBmdW5jdGlvbiAoZXJyOiBhbnkpIHtcclxuICAgICAgZnMud3JpdGVGaWxlKCcvaG9tZS9iaXRuYW1pL2FwcHMvam9ibW9zaXMtc3RhZ2luZy9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvcmVjcnVpdGVyLmNzdicsIGNzdiwgZnVuY3Rpb24gKGVycjogYW55KSB7XHJcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBzZW5kQWRtaW5Mb2dpbkluZm9NYWlsKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCBoZWFkZXIxID0gZnMucmVhZEZpbGVTeW5jKCcuL3NyYy9zZXJ2ZXIvYXBwL2ZyYW1ld29yay9wdWJsaWMvaGVhZGVyMS5odG1sJykudG9TdHJpbmcoKTtcclxuICAgIGxldCBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKCcuL3NyYy9zZXJ2ZXIvYXBwL2ZyYW1ld29yay9wdWJsaWMvYWRtaW5sb2dpbmluZm8ubWFpbC5odG1sJykudG9TdHJpbmcoKTtcclxuICAgIGxldCBmb290ZXIxID0gZnMucmVhZEZpbGVTeW5jKCcuL3NyYy9zZXJ2ZXIvYXBwL2ZyYW1ld29yay9wdWJsaWMvZm9vdGVyMS5odG1sJykudG9TdHJpbmcoKTtcclxuICAgIGxldCBtaWRfY29udGVudCA9IGNvbnRlbnQucmVwbGFjZSgnJGVtYWlsJCcsIGZpZWxkLmVtYWlsKS5yZXBsYWNlKCckYWRkcmVzcyQnLCAoZmllbGQubG9jYXRpb24gPT09IHVuZGVmaW5lZCkgPyAnTm90IEZvdW5kJyA6IGZpZWxkLmxvY2F0aW9uKVxyXG4gICAgICAucmVwbGFjZSgnJGlwJCcsIGZpZWxkLmlwKS5yZXBsYWNlKCckaG9zdCQnLCBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuaG9zdCcpKTtcclxuXHJcblxyXG4gICAgbGV0IG1haWxPcHRpb25zID0ge1xyXG4gICAgICBmcm9tOiBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuTUFJTF9TRU5ERVInKSxcclxuICAgICAgdG86IGNvbmZpZy5nZXQoJ1RwbFNlZWQubWFpbC5BRE1JTl9NQUlMJyksXHJcbiAgICAgIGNjOiBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuVFBMR1JPVVBfTUFJTCcpLFxyXG4gICAgICBzdWJqZWN0OiBNZXNzYWdlcy5FTUFJTF9TVUJKRUNUX0FETUlOX0xPR0dFRF9PTiArIFwiIFwiICsgY29uZmlnLmdldCgnVHBsU2VlZC5tYWlsLmhvc3QnKSxcclxuICAgICAgaHRtbDogaGVhZGVyMSArIG1pZF9jb250ZW50ICsgZm9vdGVyMVxyXG4gICAgICAsIGF0dGFjaG1lbnRzOiBNYWlsQXR0YWNobWVudHMuQXR0YWNobWVudEFycmF5XHJcbiAgICB9XHJcbiAgICBsZXQgc2VuZE1haWxTZXJ2aWNlID0gbmV3IFNlbmRNYWlsU2VydmljZSgpO1xyXG4gICAgc2VuZE1haWxTZXJ2aWNlLnNlbmRNYWlsKG1haWxPcHRpb25zLCBjYWxsYmFjayk7XHJcblxyXG4gIH07XHJcblxyXG4gIHVwZGF0ZVVzZXIoX2lkOiBzdHJpbmcsIGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kQnlJZChfaWQsIChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgcmVzKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnVwZGF0ZShyZXMuX2lkLCBpdGVtLCBjYWxsYmFjayk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGdldFVzYWdlRGV0YWlscyhmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnVzZXNUcmFja2luZ0NvbnRyb2xsZXIucmV0cmlldmVBbGwoKGVycjogYW55LCByZXM6IGFueSkgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCByZXMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG59XHJcblxyXG5PYmplY3Quc2VhbChBZG1pblNlcnZpY2UpO1xyXG5leHBvcnQgPSBBZG1pblNlcnZpY2U7XHJcbiJdfQ==
