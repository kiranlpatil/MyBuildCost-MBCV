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
                                'industry.name': 1
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
                                if (!result[i].isCandidate) {
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
                                }
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
                'data.industry.name', 'data.keySkills', 'data.capabilityMatrix.capabilityCode',
                'data.capabilityMatrix.complexityCode', 'data.capabilityMatrix.scenerioCode'];
            var fieldNames = ['First Name', 'Last Name', 'Mobile Number', 'Email', 'Is Activated', 'City', 'Education',
                'Experience', 'Current Salary', 'Notice Period', 'Ready To Relocate', 'Industry Exposure', 'Current Company',
                'Is Completed', 'Is Submitted', 'Is Visible', 'Industry Name', 'Key Skills', 'Capability Code',
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
                'data.postedJobs.keySkills', 'data.postedJobs.additionalKeySkills', 'data.postedJobs.capabilityMatrix.capabilityCode',
                'data.postedJobs.capabilityMatrix.complexityCode', 'data.postedJobs.capabilityMatrix.scenerioCode',
                'data.postedJobs.postingDate', 'data.postedJobs.expiringDate'];
            var fieldNames = ['Company Name', 'company size', 'Recruiting For Self', 'Number of Job Posted', 'Mobile Number',
                'Email', 'Is Activated', 'Is Job Posted', 'Job Title', 'Hiring Manager', 'Department', 'Education',
                'Experience MinValue', 'Experience MaxValue', 'Salary MinValue', 'Salary MaxValue', 'Joining Period',
                'Key Skills', 'Additional Key Skills', 'Capability Code',
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvYWRtaW4uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBR0EseUVBQTRFO0FBQzVFLG9EQUF1RDtBQUN2RCxtQ0FBcUM7QUFDckMsNkRBQXlEO0FBQ3pELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDbkMsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZCLDZDQUFnRDtBQUNoRCx1REFBMEQ7QUFDMUQsbUZBQXNGO0FBQ3RGLDJEQUE4RDtBQUM5RCxzREFBeUQ7QUFDekQsc0RBQXlEO0FBRXpELGlGQUFvRjtBQUlwRiw0Q0FBK0M7QUFDL0MsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBRTVDO0lBUUU7UUFDRSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztRQUNuRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1FBQ3JELElBQUksR0FBRyxHQUFRLElBQUksWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQy9DLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDO0lBQ2hELENBQUM7SUFFRCxxQ0FBYyxHQUFkLFVBQWUsUUFBZ0IsRUFBRSxRQUF1RDtRQUN0RixJQUFJLENBQUM7WUFDSCxJQUFJLFdBQVcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1lBQ3BDLElBQUksa0JBQWdCLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1lBQzlDLElBQUksa0JBQWdCLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1lBQzlDLElBQUksT0FBSyxHQUFv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QUM7SUFBQSxDQUFDO0lBRUYsaUNBQVUsR0FBVixVQUFXLEdBQVcsRUFBRSxJQUFTLEVBQUUsUUFBMkM7UUFBOUUsaUJBUUM7UUFQQyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsVUFBQyxHQUFRLEVBQUUsR0FBUTtZQUNuRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNSLFFBQVEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDckIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLEtBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3RELENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFBQSxDQUFDO0lBRUYsc0NBQWUsR0FBZixVQUFnQixLQUFVLEVBQUUsUUFBMkM7UUFDckUsSUFBSSxDQUFDLHNCQUFzQixDQUFDLFdBQVcsQ0FBQyxVQUFDLEdBQVEsRUFBRSxHQUFRO1lBQ3pELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN0QixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sUUFBUSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN0QixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFTCxDQUFDO0lBQ0gsbUJBQUM7QUFBRCxDQXJhQSxBQXFhQyxJQUFBO0FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUMxQixpQkFBUyxZQUFZLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9zZXJ2aWNlcy9hZG1pbi5zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIENyZWF0ZWQgYnkgdGVjaHByaW1lMDAyIG9uIDgvMjgvMjAxNy5cclxuICovXHJcbmltcG9ydCBVc2VyUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS91c2VyLnJlcG9zaXRvcnknKTtcclxuaW1wb3J0IFNlbmRNYWlsU2VydmljZSA9IHJlcXVpcmUoJy4vc2VuZG1haWwuc2VydmljZScpO1xyXG5pbXBvcnQgKiBhcyBtb25nb29zZSBmcm9tIFwibW9uZ29vc2VcIjtcclxuaW1wb3J0IHtDb25zdFZhcmlhYmxlc30gZnJvbSBcIi4uL3NoYXJlZC9zaGFyZWRjb25zdGFudHNcIjtcclxubGV0IGNvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xyXG5sZXQganNvbjJjc3YgPSByZXF1aXJlKCdqc29uMmNzdicpO1xyXG5sZXQgZnMgPSByZXF1aXJlKCdmcycpO1xyXG5pbXBvcnQgTWVzc2FnZXMgPSByZXF1aXJlKCcuLi9zaGFyZWQvbWVzc2FnZXMnKTtcclxuaW1wb3J0IE1haWxBdHRhY2htZW50cyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9zaGFyZWRhcnJheScpO1xyXG5pbXBvcnQgUmVjcnVpdGVyUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9yZWNydWl0ZXIucmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgVXNlcnNDbGFzc01vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC91c2VycycpO1xyXG5pbXBvcnQgQ2FuZGlkYXRlU2VydmljZSA9IHJlcXVpcmUoJy4vY2FuZGlkYXRlLnNlcnZpY2UnKTtcclxuaW1wb3J0IFJlY3J1aXRlclNlcnZpY2UgPSByZXF1aXJlKCcuL3JlY3J1aXRlci5zZXJ2aWNlJyk7XHJcbmltcG9ydCBJbmR1c3RyeU1vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9pbmR1c3RyeS5tb2RlbCcpO1xyXG5pbXBvcnQgSW5kdXN0cnlSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2luZHVzdHJ5LnJlcG9zaXRvcnknKTtcclxuaW1wb3J0IENhbmRpZGF0ZU1vZGVsQ2xhc3MgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL2NhbmRpZGF0ZUNsYXNzLm1vZGVsJyk7XHJcbmltcG9ydCBSZWNydWl0ZXJDbGFzc01vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9yZWNydWl0ZXJDbGFzcy5tb2RlbCcpO1xyXG5pbXBvcnQgQ2FuZGlkYXRlQ2xhc3NNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvY2FuZGlkYXRlLWNsYXNzLm1vZGVsJyk7XHJcbmltcG9ydCBVc2VyU2VydmljZSA9IHJlcXVpcmUoXCIuL3VzZXIuc2VydmljZVwiKTtcclxubGV0IHVzZXN0cmFja2luZyA9IHJlcXVpcmUoJ3VzZXMtdHJhY2tpbmcnKTtcclxuXHJcbmNsYXNzIEFkbWluU2VydmljZSB7XHJcbiAgY29tcGFueV9uYW1lOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSB1c2VyUmVwb3NpdG9yeTogVXNlclJlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSBpbmR1c3RyeVJlcG9zaXRpcnk6IEluZHVzdHJ5UmVwb3NpdG9yeTtcclxuICBwcml2YXRlIHJlY3J1aXRlclJlcG9zaXRvcnk6IFJlY3J1aXRlclJlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSB1c2VzVHJhY2tpbmdDb250cm9sbGVyOiBhbnk7XHJcblxyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkgPSBuZXcgVXNlclJlcG9zaXRvcnkoKTtcclxuICAgIHRoaXMuaW5kdXN0cnlSZXBvc2l0aXJ5ID0gbmV3IEluZHVzdHJ5UmVwb3NpdG9yeSgpO1xyXG4gICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5ID0gbmV3IFJlY3J1aXRlclJlcG9zaXRvcnkoKTtcclxuICAgIGxldCBvYmo6IGFueSA9IG5ldyB1c2VzdHJhY2tpbmcuTXlDb250cm9sbGVyKCk7XHJcbiAgICB0aGlzLnVzZXNUcmFja2luZ0NvbnRyb2xsZXIgPSBvYmouX2NvbnRyb2xsZXI7XHJcbiAgfVxyXG5cclxuICBnZXRVc2VyRGV0YWlscyh1c2VyVHlwZTogc3RyaW5nLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogVXNlcnNDbGFzc01vZGVsKSA9PiB2b2lkKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgbGV0IGNhbmRpZGF0ZVNlcnZpY2UgPSBuZXcgQ2FuZGlkYXRlU2VydmljZSgpO1xyXG4gICAgICBsZXQgcmVjcnVpdGVyU2VydmljZSA9IG5ldyBSZWNydWl0ZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCB1c2VyczogVXNlcnNDbGFzc01vZGVsID0gbmV3IFVzZXJzQ2xhc3NNb2RlbCgpO1xyXG4gICAgICBsZXQgZmluZFF1ZXJ5ID0gbmV3IE9iamVjdCgpO1xyXG5cclxuICAgICAgaWYgKHVzZXJUeXBlID09ICdjYW5kaWRhdGUnKSB7XHJcbiAgICAgICAgZmluZFF1ZXJ5ID0geydpc0NhbmRpZGF0ZSc6IHRydWUsICdpc0FkbWluJzogZmFsc2V9O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZpbmRRdWVyeSA9IHsnaXNDYW5kaWRhdGUnOiBmYWxzZSwgJ2lzQWRtaW4nOiBmYWxzZX07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBpbmNsdWRlZF9maWVsZHMgPSB7XHJcbiAgICAgICAgJ19pZCc6IDEsXHJcbiAgICAgICAgJ2ZpcnN0X25hbWUnOiAxLFxyXG4gICAgICAgICdsYXN0X25hbWUnOiAxLFxyXG4gICAgICAgICdtb2JpbGVfbnVtYmVyJzogMSxcclxuICAgICAgICAnZW1haWwnOiAxLFxyXG4gICAgICAgICdpc0NhbmRpZGF0ZSc6IDEsXHJcbiAgICAgICAgJ2lzQWN0aXZhdGVkJzogMVxyXG4gICAgICB9O1xyXG4gICAgICBsZXQgc29ydGluZ1F1ZXJ5ID0geydmaXJzdF9uYW1lJzogMSwgJ2xhc3RfbmFtZSc6IDF9O1xyXG5cclxuICAgICAgdXNlclNlcnZpY2UucmV0cmlldmVCeVNvcnRlZE9yZGVyKGZpbmRRdWVyeSwgaW5jbHVkZWRfZmllbGRzLCBzb3J0aW5nUXVlcnksIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXNlcnMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IDA7XHJcbiAgICAgICAgICAgIGlmICh1c2VyVHlwZSA9PSAnY2FuZGlkYXRlJykge1xyXG4gICAgICAgICAgICAgIGxldCBjYW5kaWRhdGVzOiBDYW5kaWRhdGVNb2RlbENsYXNzW10gPSBuZXcgQXJyYXkoMCk7XHJcbiAgICAgICAgICAgICAgbGV0IGNhbmRpZGF0ZUZpZWxkcyA9IHtcclxuICAgICAgICAgICAgICAgICdfaWQnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ2pvYlRpdGxlJzogMSxcclxuICAgICAgICAgICAgICAgICdpc0NvbXBsZXRlZCc6IDEsXHJcbiAgICAgICAgICAgICAgICAnaXNTdWJtaXR0ZWQnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ2xvY2F0aW9uJzogMSxcclxuICAgICAgICAgICAgICAgICdwcm9maWNpZW5jaWVzJzogMSxcclxuICAgICAgICAgICAgICAgICdwcm9mZXNzaW9uYWxEZXRhaWxzJzogMSxcclxuICAgICAgICAgICAgICAgICdjYXBhYmlsaXR5X21hdHJpeCc6IDEsXHJcbiAgICAgICAgICAgICAgICAnaXNWaXNpYmxlJzogMSxcclxuICAgICAgICAgICAgICAgICdpbmR1c3RyeS5uYW1lJzogMVxyXG4gICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNhbmRpZGF0ZVNlcnZpY2UucmV0cmlldmVXaXRoTGVhbih7J3VzZXJJZCc6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZChyZXN1bHRbaV0uX2lkKX0sIGNhbmRpZGF0ZUZpZWxkcywgKGVycm9yLCByZXN1KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSsrO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1WzBdLnByb2ZpY2llbmNpZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmVzdVswXS5rZXlTa2lsbHMgPSByZXN1WzBdLnByb2ZpY2llbmNpZXMudG9TdHJpbmcoKS5yZXBsYWNlKC8sL2csICcgJCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VbMF0uY2FwYWJpbGl0eV9tYXRyaXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHJlc3VbMF0uY2FwYWJpbGl0eU1hdHJpeCA9IGNhbmRpZGF0ZVNlcnZpY2UubG9hZENhcGFiaWxpdGlEZXRhaWxzKHJlc3VbMF0uY2FwYWJpbGl0eV9tYXRyaXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2ldLmRhdGEgPSByZXN1WzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZXMucHVzaChyZXN1bHRbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAmJiByZXN1bHQubGVuZ3RoID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdXNlcnMuY2FuZGlkYXRlID0gY2FuZGlkYXRlcztcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZmV0Y2ggYWxsIHJlY29yZHNcIiArIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHVzZXJzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImluc2lkZSByZWNydWl0ZXIgZmV0Y2hcIik7XHJcbiAgICAgICAgICAgICAgbGV0IHJlY3J1aXRlcnM6IFJlY3J1aXRlckNsYXNzTW9kZWxbXSA9IG5ldyBBcnJheSgwKTtcclxuICAgICAgICAgICAgICBsZXQgcmVjcnVpdGVyRmllbGRzID0ge1xyXG4gICAgICAgICAgICAgICAgJ19pZCc6IDEsXHJcbiAgICAgICAgICAgICAgICAnY29tcGFueV9uYW1lJzogMSxcclxuICAgICAgICAgICAgICAgICdjb21wYW55X3NpemUnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ2lzUmVjcnVpdGluZ0ZvcnNlbGYnOiAxLFxyXG4gICAgICAgICAgICAgICAgJ3Bvc3RlZEpvYnMnOiAxXHJcbiAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghcmVzdWx0W2ldLmlzQ2FuZGlkYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJlY3J1aXRlclNlcnZpY2UucmV0cmlldmVXaXRoTGVhbih7J3VzZXJJZCc6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZChyZXN1bHRbaV0uX2lkKX0sIHJlY3J1aXRlckZpZWxkcywgKGVycm9yLCByZXN1KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlKys7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXN1WzBdLm51bWJlck9mSm9ic1Bvc3RlZCA9IHJlc3VbMF0ucG9zdGVkSm9icy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZWNydWl0ZXJTZXJ2aWNlLmxvYWRDYXBiaWxpdHlBbmRLZXlTa2lsbHMocmVzdVswXS5wb3N0ZWRKb2JzKTtcclxuICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtpXS5kYXRhID0gcmVzdVswXTtcclxuICAgICAgICAgICAgICAgICAgICAgIHJlY3J1aXRlcnMucHVzaChyZXN1bHRbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlICYmIHJlc3VsdC5sZW5ndGggPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJzLnJlY3J1aXRlciA9IHJlY3J1aXRlcnM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZmV0Y2ggYWxsIHJlY29yZHNcIiArIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXNlcnMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoXHJcbiAgICAgIChlKSB7XHJcbiAgICAgIGNhbGxiYWNrKGUsIG51bGwpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGdldENvdW50T2ZVc2VycyhpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCBjYW5kaWRhdGVTZXJ2aWNlID0gbmV3IENhbmRpZGF0ZVNlcnZpY2UoKTtcclxuICAgICAgbGV0IHJlY3J1aXRlclNlcnZpY2UgPSBuZXcgUmVjcnVpdGVyU2VydmljZSgpO1xyXG4gICAgICBsZXQgdXNlcnM6IFVzZXJzQ2xhc3NNb2RlbCA9IG5ldyBVc2Vyc0NsYXNzTW9kZWwoKTtcclxuICAgICAgbGV0IGZpbmRRdWVyeSA9IG5ldyBPYmplY3QoKTtcclxuXHJcbiAgICAgIGNhbmRpZGF0ZVNlcnZpY2UuZ2V0VG90YWxDYW5kaWRhdGVDb3VudCgoZXJyb3IsIGNhbmRpZGF0ZUNvdW50KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHVzZXJzLnRvdGFsTnVtYmVyT2ZDYW5kaWRhdGVzID0gY2FuZGlkYXRlQ291bnQ7XHJcbiAgICAgICAgICByZWNydWl0ZXJTZXJ2aWNlLmdldFRvdGFsUmVjcnVpdGVyQ291bnQoKGVycm9yLCByZWNydWl0ZXJDb3VudCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdXNlcnMudG90YWxOdW1iZXJPZlJlY3J1aXRlcnMgPSByZWNydWl0ZXJDb3VudDtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB1c2Vycyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaFxyXG4gICAgICAoZSkge1xyXG4gICAgICBjYWxsYmFjayhlLCBudWxsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldFJlY3J1aXRlckRldGFpbHMoaW5pdGlhbDogc3RyaW5nLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgbGV0IHJlY3J1aXRlclNlcnZpY2UgPSBuZXcgUmVjcnVpdGVyU2VydmljZSgpO1xyXG4gICAgICBsZXQgdXNlcnM6IFVzZXJzQ2xhc3NNb2RlbCA9IG5ldyBVc2Vyc0NsYXNzTW9kZWwoKTtcclxuICAgICAgbGV0IHJlY3J1aXRlcnM6IFJlY3J1aXRlckNsYXNzTW9kZWxbXSA9IG5ldyBBcnJheSgwKTtcclxuXHJcbiAgICAgIGxldCByZWdFeCA9IG5ldyBSZWdFeHAoJ15bJyArIGluaXRpYWwudG9Mb3dlckNhc2UoKSArIGluaXRpYWwudG9VcHBlckNhc2UoKSArICddJyk7XHJcbiAgICAgIGxldCBmaW5kUXVlcnkgPSB7XHJcbiAgICAgICAgJ2NvbXBhbnlfbmFtZSc6IHtcclxuICAgICAgICAgICRyZWdleDogcmVnRXhcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgbGV0IHNvcnRpbmdRdWVyeSA9IHsnY29tcGFueV9uYW1lJzogMSwgJ2NvbXBhbnlfc2l6ZSc6IDF9O1xyXG5cclxuICAgICAgbGV0IHJlY3J1aXRlckZpZWxkcyA9IHtcclxuICAgICAgICAnX2lkJzogMSxcclxuICAgICAgICAndXNlcklkJzogMSxcclxuICAgICAgICAnY29tcGFueV9uYW1lJzogMSxcclxuICAgICAgICAnY29tcGFueV9zaXplJzogMSxcclxuICAgICAgICAnaXNSZWNydWl0aW5nRm9yc2VsZic6IDEsXHJcbiAgICAgICAgJ3Bvc3RlZEpvYnMnOiAxXHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZWNydWl0ZXJTZXJ2aWNlLnJldHJpZXZlQnlTb3J0ZWRPcmRlcihmaW5kUXVlcnksIHJlY3J1aXRlckZpZWxkcywgc29ydGluZ1F1ZXJ5LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB1c2Vycy50b3RhbE51bWJlck9mUmVjcnVpdGVycyA9IHJlc3VsdC5sZW5ndGg7XHJcbiAgICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHVzZXJzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSAwO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgIHVzZXJTZXJ2aWNlLnJldHJpZXZlV2l0aExlYW4oeydfaWQnOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQocmVzdWx0W2ldLnVzZXJJZCl9LCAoZXJyb3IsIHJlc3UpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICB2YWx1ZSsrO1xyXG4gICAgICAgICAgICAgICAgICByZXN1WzBdLmRhdGEgPSByZXN1bHRbaV07XHJcbiAgICAgICAgICAgICAgICAgIHJlY3J1aXRlcnMucHVzaChyZXN1WzBdKTtcclxuICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlICYmIHJlc3VsdC5sZW5ndGggPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcnMucmVjcnVpdGVyID0gcmVjcnVpdGVycztcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB1c2Vycyk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaFxyXG4gICAgICAoZSkge1xyXG4gICAgICBjYWxsYmFjayhlLCBudWxsKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldENhbmRpZGF0ZURldGFpbHMoaW5pdGlhbDogc3RyaW5nLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgbGV0IGNhbmRpZGF0ZVNlcnZpY2UgPSBuZXcgQ2FuZGlkYXRlU2VydmljZSgpO1xyXG4gICAgICBsZXQgdXNlcnM6IFVzZXJzQ2xhc3NNb2RlbCA9IG5ldyBVc2Vyc0NsYXNzTW9kZWwoKTtcclxuICAgICAgbGV0IGNhbmRpZGF0ZXM6IENhbmRpZGF0ZU1vZGVsQ2xhc3NbXSA9IG5ldyBBcnJheSgwKTtcclxuXHJcbiAgICAgIGxldCByZWdFeCA9IG5ldyBSZWdFeHAoJ15bJyArIGluaXRpYWwudG9Mb3dlckNhc2UoKSArIGluaXRpYWwudG9VcHBlckNhc2UoKSArICddJyk7XHJcblxyXG4gICAgICBsZXQgZmluZFF1ZXJ5ID0ge1xyXG4gICAgICAgICdmaXJzdF9uYW1lJzoge1xyXG4gICAgICAgICAgJHJlZ2V4OiByZWdFeFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgJ2lzQWRtaW4nOiBmYWxzZSxcclxuICAgICAgICAnaXNDYW5kaWRhdGUnOiB0cnVlXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBsZXQgaW5jbHVkZWRfZmllbGRzID0ge1xyXG4gICAgICAgICdfaWQnOiAxLFxyXG4gICAgICAgICdmaXJzdF9uYW1lJzogMSxcclxuICAgICAgICAnbGFzdF9uYW1lJzogMSxcclxuICAgICAgICAnbW9iaWxlX251bWJlcic6IDEsXHJcbiAgICAgICAgJ2VtYWlsJzogMSxcclxuICAgICAgICAnaXNBY3RpdmF0ZWQnOiAxXHJcbiAgICAgIH07XHJcbiAgICAgIGxldCBzb3J0aW5nUXVlcnkgPSB7J2ZpcnN0X25hbWUnOiAxLCAnbGFzdF9uYW1lJzogMX07XHJcblxyXG4gICAgICB1c2VyU2VydmljZS5yZXRyaWV2ZUJ5U29ydGVkT3JkZXIoZmluZFF1ZXJ5LCBpbmNsdWRlZF9maWVsZHMsIHNvcnRpbmdRdWVyeSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdXNlcnMudG90YWxOdW1iZXJPZkNhbmRpZGF0ZXMgPSByZXN1bHQubGVuZ3RoO1xyXG4gICAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB1c2Vycyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gMDtcclxuICAgICAgICAgICAgbGV0IGNhbmRpZGF0ZUZpZWxkcyA9IHtcclxuICAgICAgICAgICAgICAnX2lkJzogMSxcclxuICAgICAgICAgICAgICAnam9iVGl0bGUnOiAxLFxyXG4gICAgICAgICAgICAgICdpc0NvbXBsZXRlZCc6IDEsXHJcbiAgICAgICAgICAgICAgJ2lzU3VibWl0dGVkJzogMSxcclxuICAgICAgICAgICAgICAnbG9jYXRpb24nOiAxXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgY2FuZGlkYXRlU2VydmljZS5yZXRyaWV2ZVdpdGhMZWFuKHsndXNlcklkJzogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKHJlc3VsdFtpXS5faWQpfSwgY2FuZGlkYXRlRmllbGRzLCAoZXJyb3IsIHJlc3UpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICB2YWx1ZSsrO1xyXG4gICAgICAgICAgICAgICAgICByZXN1bHRbaV0uZGF0YSA9IHJlc3VbMF07XHJcbiAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZXMucHVzaChyZXN1bHRbaV0pO1xyXG4gICAgICAgICAgICAgICAgICBpZiAodmFsdWUgJiYgcmVzdWx0Lmxlbmd0aCA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB1c2Vycy5jYW5kaWRhdGUgPSBjYW5kaWRhdGVzO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHVzZXJzKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIGNhbGxiYWNrKGUsIG51bGwpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYWRkVXNhZ2VEZXRhaWxzVmFsdWUoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdmFsdWU6IG51bWJlciA9IDA7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhbHVlKys7XHJcbiAgICAgICAgaXRlbVtpXS5hY3Rpb24gPSBDb25zdFZhcmlhYmxlcy5BY3Rpb25zQXJyYXlbaXRlbVtpXS5hY3Rpb25dO1xyXG4gICAgICAgIGlmIChpdGVtLmxlbmd0aCA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBjYWxsYmFjayhlLCBudWxsKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBnZW5lcmF0ZVVzYWdlRGV0YWlsRmlsZShyZXN1bHQ6IGFueSwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgbGV0IGZpZWxkcyA9IFsnY2FuZGlkYXRlSWQnLCAncmVjcnVpdGVySWQnLCAnam9iUHJvZmlsZUlkJywgJ2FjdGlvbicsICd0aW1lc3RhbXAnXTtcclxuICAgICAgbGV0IGZpZWxkTmFtZXMgPSBbJ0NhbmRpZGF0ZSBJZCcsICdSZWNydWl0ZXJJZCcsICdKb2IgUHJvZmlsZSBJZCcsICdBY3Rpb24nLCAnVGltZVN0YW1wJ107XHJcbiAgICAgIGxldCBjc3YgPSBqc29uMmNzdih7ZGF0YTogcmVzdWx0LCBmaWVsZHM6IGZpZWxkcywgZmllbGROYW1lczogZmllbGROYW1lc30pO1xyXG4gICAgICAvL2ZzLndyaXRlRmlsZSgnLi9zcmMvc2VydmVyL3B1YmxpYy91c2FnZWRldGFpbC5jc3YnLCBjc3YsIGZ1bmN0aW9uIChlcnI6IGFueSkge1xyXG4gICAgICBmcy53cml0ZUZpbGUoJy9ob21lL2JpdG5hbWkvYXBwcy9qb2Jtb3Npcy1zdGFnaW5nL2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy91c2FnZWRldGFpbC5jc3YnLCBjc3YsIGZ1bmN0aW9uIChlcnI6IGFueSkge1xyXG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCByZXN1bHQpO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgZ2VuZXJhdGVDYW5kaWRhdGVEZXRhaWxGaWxlKHJlc3VsdDogYW55LCBjYWxsYmFjazogKGVycjogYW55LCByZXM6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgY29uc29sZS5sb2coXCJpbnNpZGUgZ2VuZXJhdGUgZmlsZVwiKTtcclxuICAgIGlmIChyZXN1bHQuY2FuZGlkYXRlICYmIHJlc3VsdC5jYW5kaWRhdGUubGVuZ3RoID4gMCkge1xyXG4gICAgICBsZXQgZmllbGRzID0gWydmaXJzdF9uYW1lJywgJ2xhc3RfbmFtZScsICdtb2JpbGVfbnVtYmVyJywgJ2VtYWlsJywgJ2lzQWN0aXZhdGVkJywgJ2RhdGEubG9jYXRpb24uY2l0eScsXHJcbiAgICAgICAgJ2RhdGEucHJvZmVzc2lvbmFsRGV0YWlscy5lZHVjYXRpb24nLCAnZGF0YS5wcm9mZXNzaW9uYWxEZXRhaWxzLmV4cGVyaWVuY2UnLFxyXG4gICAgICAgICdkYXRhLnByb2Zlc3Npb25hbERldGFpbHMuY3VycmVudFNhbGFyeScsICdkYXRhLnByb2Zlc3Npb25hbERldGFpbHMubm90aWNlUGVyaW9kJyxcclxuICAgICAgICAnZGF0YS5wcm9mZXNzaW9uYWxEZXRhaWxzLnJlbG9jYXRlJywgJ2RhdGEucHJvZmVzc2lvbmFsRGV0YWlscy5pbmR1c3RyeUV4cG9zdXJlJyxcclxuICAgICAgICAnZGF0YS5wcm9mZXNzaW9uYWxEZXRhaWxzLmN1cnJlbnRDb21wYW55JywgJ2RhdGEuaXNDb21wbGV0ZWQnLCAnZGF0YS5pc1N1Ym1pdHRlZCcsICdkYXRhLmlzVmlzaWJsZScsXHJcbiAgICAgICAgJ2RhdGEuaW5kdXN0cnkubmFtZScsICdkYXRhLmtleVNraWxscycsICdkYXRhLmNhcGFiaWxpdHlNYXRyaXguY2FwYWJpbGl0eUNvZGUnLFxyXG4gICAgICAgICdkYXRhLmNhcGFiaWxpdHlNYXRyaXguY29tcGxleGl0eUNvZGUnLCAnZGF0YS5jYXBhYmlsaXR5TWF0cml4LnNjZW5lcmlvQ29kZSddO1xyXG4gICAgICBsZXQgZmllbGROYW1lcyA9IFsnRmlyc3QgTmFtZScsICdMYXN0IE5hbWUnLCAnTW9iaWxlIE51bWJlcicsICdFbWFpbCcsICdJcyBBY3RpdmF0ZWQnLCAnQ2l0eScsICdFZHVjYXRpb24nLFxyXG4gICAgICAgICdFeHBlcmllbmNlJywgJ0N1cnJlbnQgU2FsYXJ5JywgJ05vdGljZSBQZXJpb2QnLCAnUmVhZHkgVG8gUmVsb2NhdGUnLCAnSW5kdXN0cnkgRXhwb3N1cmUnLCAnQ3VycmVudCBDb21wYW55JyxcclxuICAgICAgICAnSXMgQ29tcGxldGVkJywgJ0lzIFN1Ym1pdHRlZCcsICdJcyBWaXNpYmxlJywgJ0luZHVzdHJ5IE5hbWUnLCAnS2V5IFNraWxscycsICdDYXBhYmlsaXR5IENvZGUnLFxyXG4gICAgICAgICdDb21wbGV4aXR5IENvZGUnLCAnU2NlbmFyaW8gQ29kZSddO1xyXG5cclxuICAgICAgbGV0IGNzdiA9IGpzb24yY3N2KHtcclxuICAgICAgICBkYXRhOiByZXN1bHQuY2FuZGlkYXRlLCBmaWVsZHM6IGZpZWxkcywgZmllbGROYW1lczogZmllbGROYW1lcyxcclxuICAgICAgICB1bndpbmRQYXRoOiBbJ2RhdGEuY2FwYWJpbGl0eU1hdHJpeCddXHJcbiAgICAgIH0pO1xyXG4gICAgICBjb25zb2xlLmxvZyhcIndyaXRpbmcgaW50byBmaWxlIGZpbGVcIik7XHJcbiAgICAgIC8vZnMud3JpdGVGaWxlKCcuL3NyYy9zZXJ2ZXIvcHVibGljL2NhbmRpZGF0ZS5jc3YnLCBjc3YsIGZ1bmN0aW9uIChlcnI6IGFueSkge1xyXG4gICAgICBmcy53cml0ZUZpbGUoJy9ob21lL2JpdG5hbWkvYXBwcy9qb2Jtb3Npcy1zdGFnaW5nL2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy9jYW5kaWRhdGUuY3N2JywgY3N2LCBmdW5jdGlvbiAoZXJyOiBhbnkpIHtcclxuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0KTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjYWxsYmFjayhudWxsLCByZXN1bHQpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGdlbmVyYXRlUmVjcnVpdGVyRGV0YWlsRmlsZShyZXN1bHQ6IGFueSwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiaW5zaWRlIGdlbmVyYXRlIGZpbGVcIik7XHJcbiAgICBpZiAocmVzdWx0LnJlY3J1aXRlciAmJiByZXN1bHQucmVjcnVpdGVyLmxlbmd0aCA+IDApIHtcclxuICAgICAgbGV0IGZpZWxkcyA9IFsnZGF0YS5jb21wYW55X25hbWUnLCAnZGF0YS5jb21wYW55X3NpemUnLCAnZGF0YS5pc1JlY3J1aXRpbmdGb3JzZWxmJyxcclxuICAgICAgICAnZGF0YS5udW1iZXJPZkpvYnNQb3N0ZWQnLCAnbW9iaWxlX251bWJlcicsICdlbWFpbCcsICdpc0FjdGl2YXRlZCcsICdkYXRhLnBvc3RlZEpvYnMuaXNKb2JQb3N0ZWQnLFxyXG4gICAgICAgICdkYXRhLnBvc3RlZEpvYnMuam9iVGl0bGUnLCAnZGF0YS5wb3N0ZWRKb2JzLmhpcmluZ01hbmFnZXInLCAnZGF0YS5wb3N0ZWRKb2JzLmRlcGFydG1lbnQnLFxyXG4gICAgICAgICdkYXRhLnBvc3RlZEpvYnMuZWR1Y2F0aW9uJywgJ2RhdGEucG9zdGVkSm9icy5leHBlcmllbmNlTWluVmFsdWUnLCAnZGF0YS5wb3N0ZWRKb2JzLmV4cGVyaWVuY2VNYXhWYWx1ZScsXHJcbiAgICAgICAgJ2RhdGEucG9zdGVkSm9icy5zYWxhcnlNaW5WYWx1ZScsICdkYXRhLnBvc3RlZEpvYnMuc2FsYXJ5TWF4VmFsdWUnLCAnZGF0YS5wb3N0ZWRKb2JzLmpvaW5pbmdQZXJpb2QnLFxyXG4gICAgICAgICdkYXRhLnBvc3RlZEpvYnMua2V5U2tpbGxzJywgJ2RhdGEucG9zdGVkSm9icy5hZGRpdGlvbmFsS2V5U2tpbGxzJywgJ2RhdGEucG9zdGVkSm9icy5jYXBhYmlsaXR5TWF0cml4LmNhcGFiaWxpdHlDb2RlJyxcclxuICAgICAgICAnZGF0YS5wb3N0ZWRKb2JzLmNhcGFiaWxpdHlNYXRyaXguY29tcGxleGl0eUNvZGUnLCAnZGF0YS5wb3N0ZWRKb2JzLmNhcGFiaWxpdHlNYXRyaXguc2NlbmVyaW9Db2RlJyxcclxuICAgICAgICAnZGF0YS5wb3N0ZWRKb2JzLnBvc3RpbmdEYXRlJywgJ2RhdGEucG9zdGVkSm9icy5leHBpcmluZ0RhdGUnXTtcclxuXHJcbiAgICAgIGxldCBmaWVsZE5hbWVzID0gWydDb21wYW55IE5hbWUnLCAnY29tcGFueSBzaXplJywgJ1JlY3J1aXRpbmcgRm9yIFNlbGYnLCAnTnVtYmVyIG9mIEpvYiBQb3N0ZWQnLCAnTW9iaWxlIE51bWJlcicsXHJcbiAgICAgICAgJ0VtYWlsJywgJ0lzIEFjdGl2YXRlZCcsICdJcyBKb2IgUG9zdGVkJywgJ0pvYiBUaXRsZScsICdIaXJpbmcgTWFuYWdlcicsICdEZXBhcnRtZW50JywgJ0VkdWNhdGlvbicsXHJcbiAgICAgICAgJ0V4cGVyaWVuY2UgTWluVmFsdWUnLCAnRXhwZXJpZW5jZSBNYXhWYWx1ZScsICdTYWxhcnkgTWluVmFsdWUnLCAnU2FsYXJ5IE1heFZhbHVlJywgJ0pvaW5pbmcgUGVyaW9kJyxcclxuICAgICAgICAnS2V5IFNraWxscycsICdBZGRpdGlvbmFsIEtleSBTa2lsbHMnLCAnQ2FwYWJpbGl0eSBDb2RlJyxcclxuICAgICAgICAnQ29tcGxleGl0eSBDb2RlJywgJ1NjZW5hcmlvIENvZGUnLCAnUG9zdGluZyBEYXRlJywgJ0V4cGlyaW5nIERhdGUnXTtcclxuICAgICAgbGV0IGNzdiA9IGpzb24yY3N2KHtcclxuICAgICAgICBkYXRhOiByZXN1bHQucmVjcnVpdGVyLFxyXG4gICAgICAgIGZpZWxkczogZmllbGRzLFxyXG4gICAgICAgIGZpZWxkTmFtZXM6IGZpZWxkTmFtZXMsXHJcbiAgICAgICAgdW53aW5kUGF0aDogWydkYXRhLnBvc3RlZEpvYnMnLCAnZGF0YS5wb3N0ZWRKb2JzLmNhcGFiaWxpdHlNYXRyaXgnXVxyXG4gICAgICB9KTtcclxuICAgICAgLy9mcy53cml0ZUZpbGUoJy4vc3JjL3NlcnZlci9wdWJsaWMvcmVjcnVpdGVyLmNzdicsIGNzdiwgZnVuY3Rpb24gKGVycjogYW55KSB7XHJcbiAgICAgIGZzLndyaXRlRmlsZSgnL2hvbWUvYml0bmFtaS9hcHBzL2pvYm1vc2lzLXN0YWdpbmcvYy1uZXh0L2Rpc3Qvc2VydmVyL3Byb2QvcHVibGljL3JlY3J1aXRlci5jc3YnLCBjc3YsIGZ1bmN0aW9uIChlcnI6IGFueSkge1xyXG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCByZXN1bHQpO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgc2VuZEFkbWluTG9naW5JbmZvTWFpbChmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsZXQgaGVhZGVyMSA9IGZzLnJlYWRGaWxlU3luYygnLi9zcmMvc2VydmVyL2FwcC9mcmFtZXdvcmsvcHVibGljL2hlYWRlcjEuaHRtbCcpLnRvU3RyaW5nKCk7XHJcbiAgICBsZXQgY29udGVudCA9IGZzLnJlYWRGaWxlU3luYygnLi9zcmMvc2VydmVyL2FwcC9mcmFtZXdvcmsvcHVibGljL2FkbWlubG9naW5pbmZvLm1haWwuaHRtbCcpLnRvU3RyaW5nKCk7XHJcbiAgICBsZXQgZm9vdGVyMSA9IGZzLnJlYWRGaWxlU3luYygnLi9zcmMvc2VydmVyL2FwcC9mcmFtZXdvcmsvcHVibGljL2Zvb3RlcjEuaHRtbCcpLnRvU3RyaW5nKCk7XHJcbiAgICBsZXQgbWlkX2NvbnRlbnQgPSBjb250ZW50LnJlcGxhY2UoJyRlbWFpbCQnLCBmaWVsZC5lbWFpbCkucmVwbGFjZSgnJGFkZHJlc3MkJywgKGZpZWxkLmxvY2F0aW9uID09PSB1bmRlZmluZWQpID8gJ05vdCBGb3VuZCcgOiBmaWVsZC5sb2NhdGlvbilcclxuICAgICAgLnJlcGxhY2UoJyRpcCQnLCBmaWVsZC5pcCkucmVwbGFjZSgnJGhvc3QkJywgY29uZmlnLmdldCgnVHBsU2VlZC5tYWlsLmhvc3QnKSk7XHJcblxyXG5cclxuICAgIGxldCBtYWlsT3B0aW9ucyA9IHtcclxuICAgICAgZnJvbTogY29uZmlnLmdldCgnVHBsU2VlZC5tYWlsLk1BSUxfU0VOREVSJyksXHJcbiAgICAgIHRvOiBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuQURNSU5fTUFJTCcpLFxyXG4gICAgICBjYzogY29uZmlnLmdldCgnVHBsU2VlZC5tYWlsLlRQTEdST1VQX01BSUwnKSxcclxuICAgICAgc3ViamVjdDogTWVzc2FnZXMuRU1BSUxfU1VCSkVDVF9BRE1JTl9MT0dHRURfT04gKyBcIiBcIiArIGNvbmZpZy5nZXQoJ1RwbFNlZWQubWFpbC5ob3N0JyksXHJcbiAgICAgIGh0bWw6IGhlYWRlcjEgKyBtaWRfY29udGVudCArIGZvb3RlcjFcclxuICAgICAgLCBhdHRhY2htZW50czogTWFpbEF0dGFjaG1lbnRzLkF0dGFjaG1lbnRBcnJheVxyXG4gICAgfVxyXG4gICAgbGV0IHNlbmRNYWlsU2VydmljZSA9IG5ldyBTZW5kTWFpbFNlcnZpY2UoKTtcclxuICAgIHNlbmRNYWlsU2VydmljZS5zZW5kTWFpbChtYWlsT3B0aW9ucywgY2FsbGJhY2spO1xyXG5cclxuICB9O1xyXG5cclxuICB1cGRhdGVVc2VyKF9pZDogc3RyaW5nLCBpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkuZmluZEJ5SWQoX2lkLCAoZXJyOiBhbnksIHJlczogYW55KSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnIsIHJlcyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy51c2VyUmVwb3NpdG9yeS51cGRhdGUocmVzLl9pZCwgaXRlbSwgY2FsbGJhY2spO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBnZXRVc2FnZURldGFpbHMoZmllbGQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy51c2VzVHJhY2tpbmdDb250cm9sbGVyLnJldHJpZXZlQWxsKChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxufVxyXG5cclxuT2JqZWN0LnNlYWwoQWRtaW5TZXJ2aWNlKTtcclxuZXhwb3J0ID0gQWRtaW5TZXJ2aWNlO1xyXG4iXX0=
