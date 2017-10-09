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
                unwindPath: ['data.capabilityMatrix']
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
                unwindPath: ['data.postedJobs', 'data.postedJobs.capabilityMatrix']
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvYWRtaW4uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBR0EseUVBQTRFO0FBQzVFLG9EQUF1RDtBQUN2RCxtQ0FBcUM7QUFDckMsNkRBQXlEO0FBQ3pELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDbkMsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZCLDZDQUFnRDtBQUNoRCx1REFBMEQ7QUFDMUQsbUZBQXNGO0FBQ3RGLDJEQUE4RDtBQUM5RCxzREFBeUQ7QUFDekQsc0RBQXlEO0FBRXpELGlGQUFvRjtBQUlwRiw0Q0FBK0M7QUFDL0MsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBRTVDO0lBUUU7UUFDRSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztRQUNuRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1FBQ3JELElBQUksR0FBRyxHQUFRLElBQUksWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQy9DLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDO0lBQ2hELENBQUM7SUFFRCxxQ0FBYyxHQUFkLFVBQWUsUUFBZ0IsRUFBRSxRQUF1RDtRQUN0RixJQUFJLENBQUM7WUFDSCxJQUFJLFdBQVcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1lBQ3BDLElBQUksa0JBQWdCLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1lBQzlDLElBQUksa0JBQWdCLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1lBQzlDLElBQUksT0FBSyxHQUFv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Q0FBQyxZQUFZLENBQUMsQ0FBQztBQUMxQixpQkFBUyxZQUFZLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9zZXJ2aWNlcy9hZG1pbi5zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIENyZWF0ZWQgYnkgdGVjaHByaW1lMDAyIG9uIDgvMjgvMjAxNy5cclxuICovXHJcbmltcG9ydCBVc2VyUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS91c2VyLnJlcG9zaXRvcnknKTtcclxuaW1wb3J0IFNlbmRNYWlsU2VydmljZSA9IHJlcXVpcmUoJy4vc2VuZG1haWwuc2VydmljZScpO1xyXG5pbXBvcnQgKiBhcyBtb25nb29zZSBmcm9tIFwibW9uZ29vc2VcIjtcclxuaW1wb3J0IHtDb25zdFZhcmlhYmxlc30gZnJvbSBcIi4uL3NoYXJlZC9zaGFyZWRjb25zdGFudHNcIjtcclxubGV0IGNvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xyXG5sZXQganNvbjJjc3YgPSByZXF1aXJlKCdqc29uMmNzdicpO1xyXG5sZXQgZnMgPSByZXF1aXJlKCdmcycpO1xyXG5pbXBvcnQgTWVzc2FnZXMgPSByZXF1aXJlKCcuLi9zaGFyZWQvbWVzc2FnZXMnKTtcclxuaW1wb3J0IE1haWxBdHRhY2htZW50cyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9zaGFyZWRhcnJheScpO1xyXG5pbXBvcnQgUmVjcnVpdGVyUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9yZWNydWl0ZXIucmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgVXNlcnNDbGFzc01vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC91c2VycycpO1xyXG5pbXBvcnQgQ2FuZGlkYXRlU2VydmljZSA9IHJlcXVpcmUoJy4vY2FuZGlkYXRlLnNlcnZpY2UnKTtcclxuaW1wb3J0IFJlY3J1aXRlclNlcnZpY2UgPSByZXF1aXJlKCcuL3JlY3J1aXRlci5zZXJ2aWNlJyk7XHJcbmltcG9ydCBJbmR1c3RyeU1vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9pbmR1c3RyeS5tb2RlbCcpO1xyXG5pbXBvcnQgSW5kdXN0cnlSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2luZHVzdHJ5LnJlcG9zaXRvcnknKTtcclxuaW1wb3J0IENhbmRpZGF0ZU1vZGVsQ2xhc3MgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL2NhbmRpZGF0ZUNsYXNzLm1vZGVsJyk7XHJcbmltcG9ydCBSZWNydWl0ZXJDbGFzc01vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9yZWNydWl0ZXJDbGFzcy5tb2RlbCcpO1xyXG5pbXBvcnQgQ2FuZGlkYXRlQ2xhc3NNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvY2FuZGlkYXRlLWNsYXNzLm1vZGVsJyk7XHJcbmltcG9ydCBVc2VyU2VydmljZSA9IHJlcXVpcmUoXCIuL3VzZXIuc2VydmljZVwiKTtcclxubGV0IHVzZXN0cmFja2luZyA9IHJlcXVpcmUoJ3VzZXMtdHJhY2tpbmcnKTtcclxuXHJcbmNsYXNzIEFkbWluU2VydmljZSB7XHJcbiAgY29tcGFueV9uYW1lOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSB1c2VyUmVwb3NpdG9yeTogVXNlclJlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSBpbmR1c3RyeVJlcG9zaXRpcnk6IEluZHVzdHJ5UmVwb3NpdG9yeTtcclxuICBwcml2YXRlIHJlY3J1aXRlclJlcG9zaXRvcnk6IFJlY3J1aXRlclJlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSB1c2VzVHJhY2tpbmdDb250cm9sbGVyOiBhbnk7XHJcblxyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkgPSBuZXcgVXNlclJlcG9zaXRvcnkoKTtcclxuICAgIHRoaXMuaW5kdXN0cnlSZXBvc2l0aXJ5ID0gbmV3IEluZHVzdHJ5UmVwb3NpdG9yeSgpO1xyXG4gICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5ID0gbmV3IFJlY3J1aXRlclJlcG9zaXRvcnkoKTtcclxuICAgIGxldCBvYmo6IGFueSA9IG5ldyB1c2VzdHJhY2tpbmcuTXlDb250cm9sbGVyKCk7XHJcbiAgICB0aGlzLnVzZXNUcmFja2luZ0NvbnRyb2xsZXIgPSBvYmouX2NvbnRyb2xsZXI7XHJcbiAgfVxyXG5cclxuICBnZXRVc2VyRGV0YWlscyh1c2VyVHlwZTogc3RyaW5nLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogVXNlcnNDbGFzc01vZGVsKSA9PiB2b2lkKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgbGV0IGNhbmRpZGF0ZVNlcnZpY2UgPSBuZXcgQ2FuZGlkYXRlU2VydmljZSgpO1xyXG4gICAgICBsZXQgcmVjcnVpdGVyU2VydmljZSA9IG5ldyBSZWNydWl0ZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCB1c2VyczogVXNlcnNDbGFzc01vZGVsID0gbmV3IFVzZXJzQ2xhc3NNb2RlbCgpO1xyXG4gICAgICBsZXQgZmluZFF1ZXJ5ID0gbmV3IE9iamVjdCgpO1xyXG5cclxuICAgICAgaWYgKHVzZXJUeXBlID09ICdjYW5kaWRhdGUnKSB7XHJcbiAgICAgICAgZmluZFF1ZXJ5ID0geydpc0NhbmRpZGF0ZSc6IHRydWUsICdpc0FkbWluJzogZmFsc2V9O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZpbmRRdWVyeSA9IHsnaXNDYW5kaWRhdGUnOiBmYWxzZSwgJ2lzQWRtaW4nOiBmYWxzZX07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBpbmNsdWRlZF9maWVsZHMgPSB7XHJcbiAgICAgICAgJ19pZCc6IDEsXHJcbiAgICAgICAgJ2ZpcnN0X25hbWUnOiAxLFxyXG4gICAgICAgICdsYXN0X25hbWUnOiAxLFxyXG4gICAgICAgICdtb2JpbGVfbnVtYmVyJzogMSxcclxuICAgICAgICAnZW1haWwnOiAxLFxyXG4gICAgICAgICdpc0NhbmRpZGF0ZSc6IDEsXHJcbiAgICAgICAgJ2lzQWN0aXZhdGVkJzogMVxyXG4gICAgICB9O1xyXG4gICAgICBsZXQgc29ydGluZ1F1ZXJ5ID0geydmaXJzdF9uYW1lJzogMSwgJ2xhc3RfbmFtZSc6IDF9O1xyXG5cclxuICAgICAgdXNlclNlcnZpY2UucmV0cmlldmVCeVNvcnRlZE9yZGVyKGZpbmRRdWVyeSwgaW5jbHVkZWRfZmllbGRzLCBzb3J0aW5nUXVlcnksIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXNlcnMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IDA7XHJcbiAgICAgICAgICAgIGlmICh1c2VyVHlwZSA9PSAnY2FuZGlkYXRlJykge1xyXG4gICAgICAgICAgICAgIGxldCBjYW5kaWRhdGVzOiBDYW5kaWRhdGVNb2RlbENsYXNzW10gPSBuZXcgQXJyYXkoMCk7XHJcbiAgICAgICAgICAgICAgbGV0IGNhbmRpZGF0ZUZpZWxkcyA9IHtcclxuICAgICAgICAgICAgICAgICdfaWQnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ2pvYlRpdGxlJzogMSxcclxuICAgICAgICAgICAgICAgICdpc0NvbXBsZXRlZCc6IDEsXHJcbiAgICAgICAgICAgICAgICAnaXNTdWJtaXR0ZWQnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ2xvY2F0aW9uJzogMSxcclxuICAgICAgICAgICAgICAgICdwcm9maWNpZW5jaWVzJzogMSxcclxuICAgICAgICAgICAgICAgICdwcm9mZXNzaW9uYWxEZXRhaWxzJzogMSxcclxuICAgICAgICAgICAgICAgICdjYXBhYmlsaXR5X21hdHJpeCc6IDEsXHJcbiAgICAgICAgICAgICAgICAnaXNWaXNpYmxlJzogMSxcclxuICAgICAgICAgICAgICAgICdpbmR1c3RyeSc6IDFcclxuICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjYW5kaWRhdGVTZXJ2aWNlLnJldHJpZXZlV2l0aExlYW4oeyd1c2VySWQnOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQocmVzdWx0W2ldLl9pZCl9LCBjYW5kaWRhdGVGaWVsZHMsIChlcnJvciwgcmVzdSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUrKztcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdVswXS5wcm9maWNpZW5jaWVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHJlc3VbMF0ua2V5U2tpbGxzID0gcmVzdVswXS5wcm9maWNpZW5jaWVzLnRvU3RyaW5nKCkucmVwbGFjZSgvLC9nLCAnICQnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1WzBdLmluZHVzdHJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXN1WzBdLnJvbGVzID0gY2FuZGlkYXRlU2VydmljZS5sb2FkUm9sZXMocmVzdVswXS5pbmR1c3RyeS5yb2xlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdVswXS5jYXBhYmlsaXR5X21hdHJpeCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmVzdVswXS5jYXBhYmlsaXR5TWF0cml4ID0gY2FuZGlkYXRlU2VydmljZS5sb2FkQ2FwYWJpbGl0aURldGFpbHMocmVzdVswXS5jYXBhYmlsaXR5X21hdHJpeCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRbaV0uZGF0YSA9IHJlc3VbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgY2FuZGlkYXRlcy5wdXNoKHJlc3VsdFtpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlICYmIHJlc3VsdC5sZW5ndGggPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICB1c2Vycy5jYW5kaWRhdGUgPSBjYW5kaWRhdGVzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmZXRjaCBhbGwgcmVjb3Jkc1wiICsgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXNlcnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW5zaWRlIHJlY3J1aXRlciBmZXRjaFwiKTtcclxuICAgICAgICAgICAgICBsZXQgcmVjcnVpdGVyczogUmVjcnVpdGVyQ2xhc3NNb2RlbFtdID0gbmV3IEFycmF5KDApO1xyXG4gICAgICAgICAgICAgIGxldCByZWNydWl0ZXJGaWVsZHMgPSB7XHJcbiAgICAgICAgICAgICAgICAnX2lkJzogMSxcclxuICAgICAgICAgICAgICAgICdjb21wYW55X25hbWUnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ2NvbXBhbnlfc2l6ZSc6IDEsXHJcbiAgICAgICAgICAgICAgICAnaXNSZWNydWl0aW5nRm9yc2VsZic6IDEsXHJcbiAgICAgICAgICAgICAgICAncG9zdGVkSm9icyc6IDFcclxuICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICByZWNydWl0ZXJTZXJ2aWNlLnJldHJpZXZlV2l0aExlYW4oeyd1c2VySWQnOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQocmVzdWx0W2ldLl9pZCl9LCByZWNydWl0ZXJGaWVsZHMsIChlcnJvciwgcmVzdSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmVzdVswXS5udW1iZXJPZkpvYnNQb3N0ZWQgPSByZXN1WzBdLnBvc3RlZEpvYnMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmVjcnVpdGVyU2VydmljZS5sb2FkQ2FwYmlsaXR5QW5kS2V5U2tpbGxzKHJlc3VbMF0ucG9zdGVkSm9icyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbaV0uZGF0YSA9IHJlc3VbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICByZWNydWl0ZXJzLnB1c2gocmVzdWx0W2ldKTtcclxuICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAmJiByZXN1bHQubGVuZ3RoID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2Vycy5yZWNydWl0ZXIgPSByZWNydWl0ZXJzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImZldGNoIGFsbCByZWNvcmRzXCIgKyB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHVzZXJzKTtcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaFxyXG4gICAgICAoZSkge1xyXG4gICAgICBjYWxsYmFjayhlLCBudWxsKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBnZXRDb3VudE9mVXNlcnMoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgY2FuZGlkYXRlU2VydmljZSA9IG5ldyBDYW5kaWRhdGVTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCByZWNydWl0ZXJTZXJ2aWNlID0gbmV3IFJlY3J1aXRlclNlcnZpY2UoKTtcclxuICAgICAgbGV0IHVzZXJzOiBVc2Vyc0NsYXNzTW9kZWwgPSBuZXcgVXNlcnNDbGFzc01vZGVsKCk7XHJcbiAgICAgIGxldCBmaW5kUXVlcnkgPSBuZXcgT2JqZWN0KCk7XHJcblxyXG4gICAgICBjYW5kaWRhdGVTZXJ2aWNlLmdldFRvdGFsQ2FuZGlkYXRlQ291bnQoKGVycm9yLCBjYW5kaWRhdGVDb3VudCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB1c2Vycy50b3RhbE51bWJlck9mQ2FuZGlkYXRlcyA9IGNhbmRpZGF0ZUNvdW50O1xyXG4gICAgICAgICAgcmVjcnVpdGVyU2VydmljZS5nZXRUb3RhbFJlY3J1aXRlckNvdW50KChlcnJvciwgcmVjcnVpdGVyQ291bnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHVzZXJzLnRvdGFsTnVtYmVyT2ZSZWNydWl0ZXJzID0gcmVjcnVpdGVyQ291bnQ7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXNlcnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY2F0Y2hcclxuICAgICAgKGUpIHtcclxuICAgICAgY2FsbGJhY2soZSwgbnVsbCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRSZWNydWl0ZXJEZXRhaWxzKGluaXRpYWw6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCByZWNydWl0ZXJTZXJ2aWNlID0gbmV3IFJlY3J1aXRlclNlcnZpY2UoKTtcclxuICAgICAgbGV0IHVzZXJzOiBVc2Vyc0NsYXNzTW9kZWwgPSBuZXcgVXNlcnNDbGFzc01vZGVsKCk7XHJcbiAgICAgIGxldCByZWNydWl0ZXJzOiBSZWNydWl0ZXJDbGFzc01vZGVsW10gPSBuZXcgQXJyYXkoMCk7XHJcblxyXG4gICAgICBsZXQgcmVnRXggPSBuZXcgUmVnRXhwKCdeWycgKyBpbml0aWFsLnRvTG93ZXJDYXNlKCkgKyBpbml0aWFsLnRvVXBwZXJDYXNlKCkgKyAnXScpO1xyXG4gICAgICBsZXQgZmluZFF1ZXJ5ID0ge1xyXG4gICAgICAgICdjb21wYW55X25hbWUnOiB7XHJcbiAgICAgICAgICAkcmVnZXg6IHJlZ0V4XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGxldCBzb3J0aW5nUXVlcnkgPSB7J2NvbXBhbnlfbmFtZSc6IDEsICdjb21wYW55X3NpemUnOiAxfTtcclxuXHJcbiAgICAgIGxldCByZWNydWl0ZXJGaWVsZHMgPSB7XHJcbiAgICAgICAgJ19pZCc6IDEsXHJcbiAgICAgICAgJ3VzZXJJZCc6IDEsXHJcbiAgICAgICAgJ2NvbXBhbnlfbmFtZSc6IDEsXHJcbiAgICAgICAgJ2NvbXBhbnlfc2l6ZSc6IDEsXHJcbiAgICAgICAgJ2lzUmVjcnVpdGluZ0ZvcnNlbGYnOiAxLFxyXG4gICAgICAgICdwb3N0ZWRKb2JzJzogMVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgcmVjcnVpdGVyU2VydmljZS5yZXRyaWV2ZUJ5U29ydGVkT3JkZXIoZmluZFF1ZXJ5LCByZWNydWl0ZXJGaWVsZHMsIHNvcnRpbmdRdWVyeSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdXNlcnMudG90YWxOdW1iZXJPZlJlY3J1aXRlcnMgPSByZXN1bHQubGVuZ3RoO1xyXG4gICAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB1c2Vycyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gMDtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICB1c2VyU2VydmljZS5yZXRyaWV2ZVdpdGhMZWFuKHsnX2lkJzogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKHJlc3VsdFtpXS51c2VySWQpfSwgKGVycm9yLCByZXN1KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgdmFsdWUrKztcclxuICAgICAgICAgICAgICAgICAgcmVzdVswXS5kYXRhID0gcmVzdWx0W2ldO1xyXG4gICAgICAgICAgICAgICAgICByZWNydWl0ZXJzLnB1c2gocmVzdVswXSk7XHJcbiAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAmJiByZXN1bHQubGVuZ3RoID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJzLnJlY3J1aXRlciA9IHJlY3J1aXRlcnM7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXNlcnMpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY2F0Y2hcclxuICAgICAgKGUpIHtcclxuICAgICAgY2FsbGJhY2soZSwgbnVsbCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRDYW5kaWRhdGVEZXRhaWxzKGluaXRpYWw6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCBjYW5kaWRhdGVTZXJ2aWNlID0gbmV3IENhbmRpZGF0ZVNlcnZpY2UoKTtcclxuICAgICAgbGV0IHVzZXJzOiBVc2Vyc0NsYXNzTW9kZWwgPSBuZXcgVXNlcnNDbGFzc01vZGVsKCk7XHJcbiAgICAgIGxldCBjYW5kaWRhdGVzOiBDYW5kaWRhdGVNb2RlbENsYXNzW10gPSBuZXcgQXJyYXkoMCk7XHJcblxyXG4gICAgICBsZXQgcmVnRXggPSBuZXcgUmVnRXhwKCdeWycgKyBpbml0aWFsLnRvTG93ZXJDYXNlKCkgKyBpbml0aWFsLnRvVXBwZXJDYXNlKCkgKyAnXScpO1xyXG5cclxuICAgICAgbGV0IGZpbmRRdWVyeSA9IHtcclxuICAgICAgICAnZmlyc3RfbmFtZSc6IHtcclxuICAgICAgICAgICRyZWdleDogcmVnRXhcclxuICAgICAgICB9LFxyXG4gICAgICAgICdpc0FkbWluJzogZmFsc2UsXHJcbiAgICAgICAgJ2lzQ2FuZGlkYXRlJzogdHJ1ZVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgbGV0IGluY2x1ZGVkX2ZpZWxkcyA9IHtcclxuICAgICAgICAnX2lkJzogMSxcclxuICAgICAgICAnZmlyc3RfbmFtZSc6IDEsXHJcbiAgICAgICAgJ2xhc3RfbmFtZSc6IDEsXHJcbiAgICAgICAgJ21vYmlsZV9udW1iZXInOiAxLFxyXG4gICAgICAgICdlbWFpbCc6IDEsXHJcbiAgICAgICAgJ2lzQWN0aXZhdGVkJzogMVxyXG4gICAgICB9O1xyXG4gICAgICBsZXQgc29ydGluZ1F1ZXJ5ID0geydmaXJzdF9uYW1lJzogMSwgJ2xhc3RfbmFtZSc6IDF9O1xyXG5cclxuICAgICAgdXNlclNlcnZpY2UucmV0cmlldmVCeVNvcnRlZE9yZGVyKGZpbmRRdWVyeSwgaW5jbHVkZWRfZmllbGRzLCBzb3J0aW5nUXVlcnksIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHVzZXJzLnRvdGFsTnVtYmVyT2ZDYW5kaWRhdGVzID0gcmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXNlcnMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IDA7XHJcbiAgICAgICAgICAgIGxldCBjYW5kaWRhdGVGaWVsZHMgPSB7XHJcbiAgICAgICAgICAgICAgJ19pZCc6IDEsXHJcbiAgICAgICAgICAgICAgJ2pvYlRpdGxlJzogMSxcclxuICAgICAgICAgICAgICAnaXNDb21wbGV0ZWQnOiAxLFxyXG4gICAgICAgICAgICAgICdpc1N1Ym1pdHRlZCc6IDEsXHJcbiAgICAgICAgICAgICAgJ2xvY2F0aW9uJzogMVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgIGNhbmRpZGF0ZVNlcnZpY2UucmV0cmlldmVXaXRoTGVhbih7J3VzZXJJZCc6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZChyZXN1bHRbaV0uX2lkKX0sIGNhbmRpZGF0ZUZpZWxkcywgKGVycm9yLCByZXN1KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgdmFsdWUrKztcclxuICAgICAgICAgICAgICAgICAgcmVzdWx0W2ldLmRhdGEgPSByZXN1WzBdO1xyXG4gICAgICAgICAgICAgICAgICBjYW5kaWRhdGVzLnB1c2gocmVzdWx0W2ldKTtcclxuICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlICYmIHJlc3VsdC5sZW5ndGggPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcnMuY2FuZGlkYXRlID0gY2FuZGlkYXRlcztcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB1c2Vycyk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBjYWxsYmFjayhlLCBudWxsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFkZFVzYWdlRGV0YWlsc1ZhbHVlKGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHZhbHVlOiBudW1iZXIgPSAwO1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW0ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YWx1ZSsrO1xyXG4gICAgICAgIGl0ZW1baV0uYWN0aW9uID0gQ29uc3RWYXJpYWJsZXMuQWN0aW9uc0FycmF5W2l0ZW1baV0uYWN0aW9uXTtcclxuICAgICAgICBpZiAoaXRlbS5sZW5ndGggPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhudWxsLCBpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgY2FsbGJhY2soZSwgbnVsbCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgZ2VuZXJhdGVVc2FnZURldGFpbEZpbGUocmVzdWx0OiBhbnksIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGxldCBmaWVsZHMgPSBbJ2NhbmRpZGF0ZUlkJywgJ3JlY3J1aXRlcklkJywgJ2pvYlByb2ZpbGVJZCcsICdhY3Rpb24nLCAndGltZXN0YW1wJ107XHJcbiAgICAgIGxldCBmaWVsZE5hbWVzID0gWydDYW5kaWRhdGUgSWQnLCAnUmVjcnVpdGVySWQnLCAnSm9iIFByb2ZpbGUgSWQnLCAnQWN0aW9uJywgJ1RpbWVTdGFtcCddO1xyXG4gICAgICBsZXQgY3N2ID0ganNvbjJjc3Yoe2RhdGE6IHJlc3VsdCwgZmllbGRzOiBmaWVsZHMsIGZpZWxkTmFtZXM6IGZpZWxkTmFtZXN9KTtcclxuICAgICAgLy9mcy53cml0ZUZpbGUoJy4vc3JjL3NlcnZlci9wdWJsaWMvdXNhZ2VkZXRhaWwuY3N2JywgY3N2LCBmdW5jdGlvbiAoZXJyOiBhbnkpIHtcclxuICAgICAgZnMud3JpdGVGaWxlKCcvaG9tZS9iaXRuYW1pL2FwcHMvam9ibW9zaXMtc3RhZ2luZy9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvdXNhZ2VkZXRhaWwuY3N2JywgY3N2LCBmdW5jdGlvbiAoZXJyOiBhbnkpIHtcclxuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0KTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjYWxsYmFjayhudWxsLCByZXN1bHQpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGdlbmVyYXRlQ2FuZGlkYXRlRGV0YWlsRmlsZShyZXN1bHQ6IGFueSwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiaW5zaWRlIGdlbmVyYXRlIGZpbGVcIik7XHJcbiAgICBpZiAocmVzdWx0LmNhbmRpZGF0ZSAmJiByZXN1bHQuY2FuZGlkYXRlLmxlbmd0aCA+IDApIHtcclxuICAgICAgbGV0IGZpZWxkcyA9IFsnZmlyc3RfbmFtZScsICdsYXN0X25hbWUnLCAnbW9iaWxlX251bWJlcicsICdlbWFpbCcsICdpc0FjdGl2YXRlZCcsICdkYXRhLmxvY2F0aW9uLmNpdHknLFxyXG4gICAgICAgICdkYXRhLnByb2Zlc3Npb25hbERldGFpbHMuZWR1Y2F0aW9uJywgJ2RhdGEucHJvZmVzc2lvbmFsRGV0YWlscy5leHBlcmllbmNlJyxcclxuICAgICAgICAnZGF0YS5wcm9mZXNzaW9uYWxEZXRhaWxzLmN1cnJlbnRTYWxhcnknLCAnZGF0YS5wcm9mZXNzaW9uYWxEZXRhaWxzLm5vdGljZVBlcmlvZCcsXHJcbiAgICAgICAgJ2RhdGEucHJvZmVzc2lvbmFsRGV0YWlscy5yZWxvY2F0ZScsICdkYXRhLnByb2Zlc3Npb25hbERldGFpbHMuaW5kdXN0cnlFeHBvc3VyZScsXHJcbiAgICAgICAgJ2RhdGEucHJvZmVzc2lvbmFsRGV0YWlscy5jdXJyZW50Q29tcGFueScsICdkYXRhLmlzQ29tcGxldGVkJywgJ2RhdGEuaXNTdWJtaXR0ZWQnLCAnZGF0YS5pc1Zpc2libGUnLFxyXG4gICAgICAgICdkYXRhLmtleVNraWxscycsICdkYXRhLmluZHVzdHJ5Lm5hbWUnLCAnZGF0YS5yb2xlcycsICdkYXRhLmNhcGFiaWxpdHlNYXRyaXguY2FwYWJpbGl0eUNvZGUnLFxyXG4gICAgICAgICdkYXRhLmNhcGFiaWxpdHlNYXRyaXguY29tcGxleGl0eUNvZGUnLCAnZGF0YS5jYXBhYmlsaXR5TWF0cml4LnNjZW5lcmlvQ29kZSddO1xyXG4gICAgICBsZXQgZmllbGROYW1lcyA9IFsnRmlyc3QgTmFtZScsICdMYXN0IE5hbWUnLCAnTW9iaWxlIE51bWJlcicsICdFbWFpbCcsICdJcyBBY3RpdmF0ZWQnLCAnQ2l0eScsICdFZHVjYXRpb24nLFxyXG4gICAgICAgICdFeHBlcmllbmNlJywgJ0N1cnJlbnQgU2FsYXJ5JywgJ05vdGljZSBQZXJpb2QnLCAnUmVhZHkgVG8gUmVsb2NhdGUnLCAnSW5kdXN0cnkgRXhwb3N1cmUnLCAnQ3VycmVudCBDb21wYW55JyxcclxuICAgICAgICAnSXMgQ29tcGxldGVkJywgJ0lzIFN1Ym1pdHRlZCcsICdJcyBWaXNpYmxlJywgJ0tleSBTa2lsbHMnLCAnSW5kdXN0cnknLCAnUm9sZScsICdDYXBhYmlsaXR5IENvZGUnLFxyXG4gICAgICAgICdDb21wbGV4aXR5IENvZGUnLCAnU2NlbmFyaW8gQ29kZSddO1xyXG5cclxuICAgICAgbGV0IGNzdiA9IGpzb24yY3N2KHtcclxuICAgICAgICBkYXRhOiByZXN1bHQuY2FuZGlkYXRlLCBmaWVsZHM6IGZpZWxkcywgZmllbGROYW1lczogZmllbGROYW1lcyxcclxuICAgICAgICB1bndpbmRQYXRoOiBbJ2RhdGEuY2FwYWJpbGl0eU1hdHJpeCddXHJcbiAgICAgIH0pO1xyXG4gICAgICBjb25zb2xlLmxvZyhcIndyaXRpbmcgaW50byBmaWxlIGZpbGVcIik7XHJcbiAgICAgIC8vZnMud3JpdGVGaWxlKCcuL3NyYy9zZXJ2ZXIvcHVibGljL2NhbmRpZGF0ZS5jc3YnLCBjc3YsIGZ1bmN0aW9uIChlcnI6IGFueSkge1xyXG4gICAgICBmcy53cml0ZUZpbGUoJy9ob21lL2JpdG5hbWkvYXBwcy9qb2Jtb3Npcy1zdGFnaW5nL2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy9jYW5kaWRhdGUuY3N2JywgY3N2LCBmdW5jdGlvbiAoZXJyOiBhbnkpIHtcclxuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0KTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjYWxsYmFjayhudWxsLCByZXN1bHQpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGdlbmVyYXRlUmVjcnVpdGVyRGV0YWlsRmlsZShyZXN1bHQ6IGFueSwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiaW5zaWRlIGdlbmVyYXRlIGZpbGVcIik7XHJcbiAgICBpZiAocmVzdWx0LnJlY3J1aXRlciAmJiByZXN1bHQucmVjcnVpdGVyLmxlbmd0aCA+IDApIHtcclxuICAgICAgbGV0IGZpZWxkcyA9IFsnZGF0YS5jb21wYW55X25hbWUnLCAnZGF0YS5jb21wYW55X3NpemUnLCAnZGF0YS5pc1JlY3J1aXRpbmdGb3JzZWxmJyxcclxuICAgICAgICAnZGF0YS5udW1iZXJPZkpvYnNQb3N0ZWQnLCAnbW9iaWxlX251bWJlcicsICdlbWFpbCcsICdpc0FjdGl2YXRlZCcsICdkYXRhLnBvc3RlZEpvYnMuaXNKb2JQb3N0ZWQnLFxyXG4gICAgICAgICdkYXRhLnBvc3RlZEpvYnMuam9iVGl0bGUnLCAnZGF0YS5wb3N0ZWRKb2JzLmhpcmluZ01hbmFnZXInLCAnZGF0YS5wb3N0ZWRKb2JzLmRlcGFydG1lbnQnLFxyXG4gICAgICAgICdkYXRhLnBvc3RlZEpvYnMuZWR1Y2F0aW9uJywgJ2RhdGEucG9zdGVkSm9icy5leHBlcmllbmNlTWluVmFsdWUnLCAnZGF0YS5wb3N0ZWRKb2JzLmV4cGVyaWVuY2VNYXhWYWx1ZScsXHJcbiAgICAgICAgJ2RhdGEucG9zdGVkSm9icy5zYWxhcnlNaW5WYWx1ZScsICdkYXRhLnBvc3RlZEpvYnMuc2FsYXJ5TWF4VmFsdWUnLCAnZGF0YS5wb3N0ZWRKb2JzLmpvaW5pbmdQZXJpb2QnLFxyXG4gICAgICAgICdkYXRhLnBvc3RlZEpvYnMua2V5U2tpbGxzJywgJ2RhdGEucG9zdGVkSm9icy5hZGRpdGlvbmFsS2V5U2tpbGxzJywgJ2RhdGEucG9zdGVkSm9icy5pbmR1c3RyeS5uYW1lJyxcclxuICAgICAgICAnZGF0YS5wb3N0ZWRKb2JzLnJvbGVzJywgJ2RhdGEucG9zdGVkSm9icy5jYXBhYmlsaXR5TWF0cml4LmNhcGFiaWxpdHlDb2RlJyxcclxuICAgICAgICAnZGF0YS5wb3N0ZWRKb2JzLmNhcGFiaWxpdHlNYXRyaXguY29tcGxleGl0eUNvZGUnLCAnZGF0YS5wb3N0ZWRKb2JzLmNhcGFiaWxpdHlNYXRyaXguc2NlbmVyaW9Db2RlJyxcclxuICAgICAgICAnZGF0YS5wb3N0ZWRKb2JzLnBvc3RpbmdEYXRlJywgJ2RhdGEucG9zdGVkSm9icy5leHBpcmluZ0RhdGUnXTtcclxuXHJcbiAgICAgIGxldCBmaWVsZE5hbWVzID0gWydDb21wYW55IE5hbWUnLCAnY29tcGFueSBzaXplJywgJ1JlY3J1aXRpbmcgRm9yIFNlbGYnLCAnTnVtYmVyIG9mIEpvYiBQb3N0ZWQnLCAnTW9iaWxlIE51bWJlcicsXHJcbiAgICAgICAgJ0VtYWlsJywgJ0lzIEFjdGl2YXRlZCcsICdJcyBKb2IgUG9zdGVkJywgJ0pvYiBUaXRsZScsICdIaXJpbmcgTWFuYWdlcicsICdEZXBhcnRtZW50JywgJ0VkdWNhdGlvbicsXHJcbiAgICAgICAgJ0V4cGVyaWVuY2UgTWluVmFsdWUnLCAnRXhwZXJpZW5jZSBNYXhWYWx1ZScsICdTYWxhcnkgTWluVmFsdWUnLCAnU2FsYXJ5IE1heFZhbHVlJywgJ0pvaW5pbmcgUGVyaW9kJyxcclxuICAgICAgICAnS2V5IFNraWxscycsICdBZGRpdGlvbmFsIEtleSBTa2lsbHMnLCAnSW5kdXN0cnknLCAnUm9sZScsICdDYXBhYmlsaXR5IENvZGUnLFxyXG4gICAgICAgICdDb21wbGV4aXR5IENvZGUnLCAnU2NlbmFyaW8gQ29kZScsICdQb3N0aW5nIERhdGUnLCAnRXhwaXJpbmcgRGF0ZSddO1xyXG4gICAgICBsZXQgY3N2ID0ganNvbjJjc3Yoe1xyXG4gICAgICAgIGRhdGE6IHJlc3VsdC5yZWNydWl0ZXIsXHJcbiAgICAgICAgZmllbGRzOiBmaWVsZHMsXHJcbiAgICAgICAgZmllbGROYW1lczogZmllbGROYW1lcyxcclxuICAgICAgICB1bndpbmRQYXRoOiBbJ2RhdGEucG9zdGVkSm9icycsICdkYXRhLnBvc3RlZEpvYnMuY2FwYWJpbGl0eU1hdHJpeCddXHJcbiAgICAgIH0pO1xyXG4gICAgICAvL2ZzLndyaXRlRmlsZSgnLi9zcmMvc2VydmVyL3B1YmxpYy9yZWNydWl0ZXIuY3N2JywgY3N2LCBmdW5jdGlvbiAoZXJyOiBhbnkpIHtcclxuICAgICAgZnMud3JpdGVGaWxlKCcvaG9tZS9iaXRuYW1pL2FwcHMvam9ibW9zaXMtc3RhZ2luZy9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvcmVjcnVpdGVyLmNzdicsIGNzdiwgZnVuY3Rpb24gKGVycjogYW55KSB7XHJcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBzZW5kQWRtaW5Mb2dpbkluZm9NYWlsKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCBoZWFkZXIxID0gZnMucmVhZEZpbGVTeW5jKCcuL3NyYy9zZXJ2ZXIvYXBwL2ZyYW1ld29yay9wdWJsaWMvaGVhZGVyMS5odG1sJykudG9TdHJpbmcoKTtcclxuICAgIGxldCBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKCcuL3NyYy9zZXJ2ZXIvYXBwL2ZyYW1ld29yay9wdWJsaWMvYWRtaW5sb2dpbmluZm8ubWFpbC5odG1sJykudG9TdHJpbmcoKTtcclxuICAgIGxldCBmb290ZXIxID0gZnMucmVhZEZpbGVTeW5jKCcuL3NyYy9zZXJ2ZXIvYXBwL2ZyYW1ld29yay9wdWJsaWMvZm9vdGVyMS5odG1sJykudG9TdHJpbmcoKTtcclxuICAgIGxldCBtaWRfY29udGVudCA9IGNvbnRlbnQucmVwbGFjZSgnJGVtYWlsJCcsIGZpZWxkLmVtYWlsKS5yZXBsYWNlKCckYWRkcmVzcyQnLCAoZmllbGQubG9jYXRpb24gPT09IHVuZGVmaW5lZCkgPyAnTm90IEZvdW5kJyA6IGZpZWxkLmxvY2F0aW9uKVxyXG4gICAgICAucmVwbGFjZSgnJGlwJCcsIGZpZWxkLmlwKS5yZXBsYWNlKCckaG9zdCQnLCBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuaG9zdCcpKTtcclxuXHJcblxyXG4gICAgbGV0IG1haWxPcHRpb25zID0ge1xyXG4gICAgICBmcm9tOiBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuTUFJTF9TRU5ERVInKSxcclxuICAgICAgdG86IGNvbmZpZy5nZXQoJ1RwbFNlZWQubWFpbC5BRE1JTl9NQUlMJyksXHJcbiAgICAgIGNjOiBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuVFBMR1JPVVBfTUFJTCcpLFxyXG4gICAgICBzdWJqZWN0OiBNZXNzYWdlcy5FTUFJTF9TVUJKRUNUX0FETUlOX0xPR0dFRF9PTiArIFwiIFwiICsgY29uZmlnLmdldCgnVHBsU2VlZC5tYWlsLmhvc3QnKSxcclxuICAgICAgaHRtbDogaGVhZGVyMSArIG1pZF9jb250ZW50ICsgZm9vdGVyMVxyXG4gICAgICAsIGF0dGFjaG1lbnRzOiBNYWlsQXR0YWNobWVudHMuQXR0YWNobWVudEFycmF5XHJcbiAgICB9XHJcbiAgICBsZXQgc2VuZE1haWxTZXJ2aWNlID0gbmV3IFNlbmRNYWlsU2VydmljZSgpO1xyXG4gICAgc2VuZE1haWxTZXJ2aWNlLnNlbmRNYWlsKG1haWxPcHRpb25zLCBjYWxsYmFjayk7XHJcblxyXG4gIH07XHJcblxyXG4gIHVwZGF0ZVVzZXIoX2lkOiBzdHJpbmcsIGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kQnlJZChfaWQsIChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgcmVzKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnVwZGF0ZShyZXMuX2lkLCBpdGVtLCBjYWxsYmFjayk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGdldFVzYWdlRGV0YWlscyhmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnVzZXNUcmFja2luZ0NvbnRyb2xsZXIucmV0cmlldmVBbGwoKGVycjogYW55LCByZXM6IGFueSkgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCByZXMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG59XHJcblxyXG5PYmplY3Quc2VhbChBZG1pblNlcnZpY2UpO1xyXG5leHBvcnQgPSBBZG1pblNlcnZpY2U7XHJcbiJdfQ==
