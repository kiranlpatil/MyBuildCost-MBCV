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
var spawn = require('child_process').spawn;
var mongoExport = '/usr/bin/mongoexport';
var username = 'admin';
var password = 'jobmosisadmin123';
var db = 'Jobmosis-staging';
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
            var sortingQuery = {};
            console.log("before users fetch call");
            userService.retrieveBySortedOrder(findQuery, included_fields, sortingQuery, function (error, result) {
                if (error) {
                    callback(error, null);
                }
                else {
                    console.log("after users fetch call");
                    if (result.length == 0) {
                        callback(null, users_1);
                    }
                    else {
                        if (userType == 'candidate') {
                            var candidateService = new CandidateService();
                            var candidates_1 = new Array(0);
                            var candidateIds = [];
                            for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                                var candidate = result_1[_i];
                                candidateIds.push(candidate._id);
                            }
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
                            console.log("before candiates fetch call");
                            candidateService.retrieveWithLean({}, candidateFields, function (error, candidatesResult) {
                                if (error) {
                                    callback(error, null);
                                }
                                else {
                                    console.log("Fetched all candidates:" + candidatesResult.length);
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
    ;
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
    ;
    AdminService.prototype.getCandidateDetails = function (initial, callback) {
        try {
            var userService = new UserService();
            var users_4 = new UsersClassModel();
            var usersMap_3 = new Map();
            var candidates_2 = new Array(0);
            var candidateService_1 = new CandidateService();
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
                        candidateService_1.retrieveWithLean({}, candidateFields, function (error, candidatesResult) {
                            if (error) {
                                callback(error, null);
                            }
                            else {
                                console.log("Fetched all candidates:" + candidatesResult.length);
                                for (var _i = 0, candidatesResult_1 = candidatesResult; _i < candidatesResult_1.length; _i++) {
                                    var candidate = candidatesResult_1[_i];
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
    ;
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
    AdminService.prototype.exportCandidateCollection = function (callback) {
        console.log("inside exportCandidateCollection");
        var candidateChild = spawn('mongoexport', ['--username', username, '--password', password, '--db', db, '--collection',
            'candidates', '--type', 'csv', '--fields',
            'userId,jobTitle,isCompleted,isSubmitted,location.city,proficiencies,professionalDetails,isVisible',
            '--out', '/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/candidates.csv']);
        candidateChild.on('exit', function (code) {
            console.log('candidateChild process closed with code ' + code);
            candidateChild.kill();
            callback(null, 'success');
        });
    };
    AdminService.prototype.exportCandidateOtherDetailsCollection = function (callback) {
        console.log("inside exportCandidateDetailsCollection");
        var candidateOtherDetailsChild = spawn('mongoexport', ['--username', username, '--password', password, '--db', db, '--collection', 'candidates',
            '--type', 'csv', '--fields', 'userId,capability_matrix', '--out',
            '/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/candidates-other-details.csv']);
        candidateOtherDetailsChild.on('exit', function (code) {
            console.log('candidateOtherDetailsChild process closed with code ' + code);
            candidateOtherDetailsChild.kill();
            callback(null, 'success');
        });
    };
    AdminService.prototype.exportUserCollection = function (userType, callback) {
        console.log("inside exportUserCollection");
        var userChild;
        if (userType == 'candidate') {
            userChild = spawn('mongoexport', ['--username', username, 'password', password, '--db', db, '--collection', 'users', '--type', 'csv', '--fields',
                '_id,first_name,last_name,email,location.city,isActivated',
                '--out', '/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/users.csv', '--query',
                '{"isCandidate": true}']);
        }
        else {
            userChild = spawn('mongoexport', ['--username', username, 'password', password, '--db', db, '--collection', 'users', '--type', 'csv', '--fields',
                '_id,mobile_number,email,location.city,isActivated', '--out',
                '/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/users.csv',
                '--query', '{"isCandidate": false}']);
        }
        userChild.on('close', function (code) {
            console.log('userChild process closed with code ' + code);
            userChild.kill();
            callback(null, 'success');
        });
    };
    AdminService.prototype.exportRecruiterCollection = function (callback) {
        console.log("inside exportRecruiterCollection");
        var recruiterChild = spawn('mongoexport', ['--username', username, 'password', password, '--db', db, '--collection', 'recruiters', '--type', 'csv',
            '--fields', 'userId,isRecruitingForself,company_name,company_size,company_website,postedJobs', '--out',
            '/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/recruiters.csv']);
        recruiterChild.on('exit', function (code) {
            console.log('recruiterChild process closed with code ' + code);
            callback(null, 'success');
        });
    };
    return AdminService;
}());
Object.seal(AdminService);
module.exports = AdminService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvYWRtaW4uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBR0EseUVBQTRFO0FBQzVFLG9EQUF1RDtBQUN2RCw2REFBeUQ7QUFDekQsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNuQyxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsNkNBQWdEO0FBQ2hELHVEQUEwRDtBQUMxRCxtRkFBc0Y7QUFDdEYsMkRBQThEO0FBQzlELHNEQUF5RDtBQUN6RCxzREFBeUQ7QUFFekQsaUZBQW9GO0FBSXBGLDRDQUErQztBQUUvQyxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDNUMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUUzQyxJQUFJLFdBQVcsR0FBRyxzQkFBc0IsQ0FBQztBQUV6QyxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUM7QUFDdkIsSUFBSSxRQUFRLEdBQUcsa0JBQWtCLENBQUM7QUFFbEMsSUFBSSxFQUFFLEdBQUcsa0JBQWtCLENBQUM7QUFFNUI7SUFRRTtRQUNFLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztRQUMzQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxrQkFBa0IsRUFBRSxDQUFDO1FBQ25ELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLG1CQUFtQixFQUFFLENBQUM7UUFDckQsSUFBSSxHQUFHLEdBQVEsSUFBSSxZQUFZLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDL0MsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUM7SUFDaEQsQ0FBQztJQUVELHFDQUFjLEdBQWQsVUFBZSxRQUFnQixFQUFF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LENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLElBQVM7WUFDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUMxRCxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDakIsUUFBUSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxnREFBeUIsR0FBekIsVUFBMEIsUUFBc0M7UUFDOUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO1FBT2hELElBQUksY0FBYyxHQUFHLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQyxZQUFZLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxjQUFjLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxLQUFLO1lBQ2hKLFVBQVUsRUFBQyxpRkFBaUYsRUFBRSxPQUFPO1lBQ3JHLG1GQUFtRixDQUFDLENBQUMsQ0FBQztRQUV4RixjQUFjLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFVLElBQVM7WUFDM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQ0FBMEMsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUMvRCxRQUFRLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUdILG1CQUFDO0FBQUQsQ0F2ZkEsQUF1ZkMsSUFBQTtBQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDMUIsaUJBQVMsWUFBWSxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvc2VydmljZXMvYWRtaW4uc2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IHRlY2hwcmltZTAwMiBvbiA4LzI4LzIwMTcuXHJcbiAqL1xyXG5pbXBvcnQgVXNlclJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvdXNlci5yZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBTZW5kTWFpbFNlcnZpY2UgPSByZXF1aXJlKCcuL3NlbmRtYWlsLnNlcnZpY2UnKTtcclxuaW1wb3J0IHtDb25zdFZhcmlhYmxlc30gZnJvbSBcIi4uL3NoYXJlZC9zaGFyZWRjb25zdGFudHNcIjtcclxubGV0IGNvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xyXG5sZXQganNvbjJjc3YgPSByZXF1aXJlKCdqc29uMmNzdicpO1xyXG5sZXQgZnMgPSByZXF1aXJlKCdmcycpO1xyXG5pbXBvcnQgTWVzc2FnZXMgPSByZXF1aXJlKCcuLi9zaGFyZWQvbWVzc2FnZXMnKTtcclxuaW1wb3J0IE1haWxBdHRhY2htZW50cyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9zaGFyZWRhcnJheScpO1xyXG5pbXBvcnQgUmVjcnVpdGVyUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9yZWNydWl0ZXIucmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgVXNlcnNDbGFzc01vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC91c2VycycpO1xyXG5pbXBvcnQgQ2FuZGlkYXRlU2VydmljZSA9IHJlcXVpcmUoJy4vY2FuZGlkYXRlLnNlcnZpY2UnKTtcclxuaW1wb3J0IFJlY3J1aXRlclNlcnZpY2UgPSByZXF1aXJlKCcuL3JlY3J1aXRlci5zZXJ2aWNlJyk7XHJcbmltcG9ydCBJbmR1c3RyeU1vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9pbmR1c3RyeS5tb2RlbCcpO1xyXG5pbXBvcnQgSW5kdXN0cnlSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2luZHVzdHJ5LnJlcG9zaXRvcnknKTtcclxuaW1wb3J0IENhbmRpZGF0ZU1vZGVsQ2xhc3MgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL2NhbmRpZGF0ZUNsYXNzLm1vZGVsJyk7XHJcbmltcG9ydCBSZWNydWl0ZXJDbGFzc01vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9yZWNydWl0ZXJDbGFzcy5tb2RlbCcpO1xyXG5pbXBvcnQgQ2FuZGlkYXRlQ2xhc3NNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvY2FuZGlkYXRlLWNsYXNzLm1vZGVsJyk7XHJcbmltcG9ydCBVc2VyU2VydmljZSA9IHJlcXVpcmUoXCIuL3VzZXIuc2VydmljZVwiKTtcclxuXHJcbmxldCB1c2VzdHJhY2tpbmcgPSByZXF1aXJlKCd1c2VzLXRyYWNraW5nJyk7XHJcbmxldCBzcGF3biA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5zcGF3bjtcclxuXHJcbmxldCBtb25nb0V4cG9ydCA9ICcvdXNyL2Jpbi9tb25nb2V4cG9ydCc7XHJcbi8vbGV0IGRiID0gY29uZmlnLmdldCgnVHBsU2VlZC5kYXRhYmFzZS5uYW1lJyk7XHJcbmxldCB1c2VybmFtZSA9ICdhZG1pbic7XHJcbmxldCBwYXNzd29yZCA9ICdqb2Jtb3Npc2FkbWluMTIzJztcclxuXHJcbmxldCBkYiA9ICdKb2Jtb3Npcy1zdGFnaW5nJztcclxuLy9sZXQgZGIgPSAnYy1uZXh0LWJhY2tlbmQnO1xyXG5jbGFzcyBBZG1pblNlcnZpY2Uge1xyXG4gIGNvbXBhbnlfbmFtZTogc3RyaW5nO1xyXG4gIHByaXZhdGUgdXNlclJlcG9zaXRvcnk6IFVzZXJSZXBvc2l0b3J5O1xyXG4gIHByaXZhdGUgaW5kdXN0cnlSZXBvc2l0aXJ5OiBJbmR1c3RyeVJlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSByZWNydWl0ZXJSZXBvc2l0b3J5OiBSZWNydWl0ZXJSZXBvc2l0b3J5O1xyXG4gIHByaXZhdGUgdXNlc1RyYWNraW5nQ29udHJvbGxlcjogYW55O1xyXG5cclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5ID0gbmV3IFVzZXJSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLmluZHVzdHJ5UmVwb3NpdGlyeSA9IG5ldyBJbmR1c3RyeVJlcG9zaXRvcnkoKTtcclxuICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeSA9IG5ldyBSZWNydWl0ZXJSZXBvc2l0b3J5KCk7XHJcbiAgICBsZXQgb2JqOiBhbnkgPSBuZXcgdXNlc3RyYWNraW5nLk15Q29udHJvbGxlcigpO1xyXG4gICAgdGhpcy51c2VzVHJhY2tpbmdDb250cm9sbGVyID0gb2JqLl9jb250cm9sbGVyO1xyXG4gIH1cclxuXHJcbiAgZ2V0VXNlckRldGFpbHModXNlclR5cGU6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IFVzZXJzQ2xhc3NNb2RlbCkgPT4gdm9pZCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCB1c2VyczogVXNlcnNDbGFzc01vZGVsID0gbmV3IFVzZXJzQ2xhc3NNb2RlbCgpO1xyXG4gICAgICBsZXQgdXNlcnNNYXA6IE1hcDxhbnksIGFueT4gPSBuZXcgTWFwKCk7XHJcbiAgICAgIGxldCBmaW5kUXVlcnkgPSBuZXcgT2JqZWN0KCk7XHJcblxyXG4gICAgICBpZiAodXNlclR5cGUgPT0gJ2NhbmRpZGF0ZScpIHtcclxuICAgICAgICBmaW5kUXVlcnkgPSB7J2lzQ2FuZGlkYXRlJzogdHJ1ZSwgJ2lzQWRtaW4nOiBmYWxzZX07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZmluZFF1ZXJ5ID0geydpc0NhbmRpZGF0ZSc6IGZhbHNlLCAnaXNBZG1pbic6IGZhbHNlfTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGluY2x1ZGVkX2ZpZWxkcyA9IHtcclxuICAgICAgICAnX2lkJzogMSxcclxuICAgICAgICAnZmlyc3RfbmFtZSc6IDEsXHJcbiAgICAgICAgJ2xhc3RfbmFtZSc6IDEsXHJcbiAgICAgICAgJ21vYmlsZV9udW1iZXInOiAxLFxyXG4gICAgICAgICdlbWFpbCc6IDEsXHJcbiAgICAgICAgJ2lzQWN0aXZhdGVkJzogMVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy9sZXQgc29ydGluZ1F1ZXJ5ID0geydmaXJzdF9uYW1lJzogMSwgJ2xhc3RfbmFtZSc6IDF9O1xyXG4gICAgICBsZXQgc29ydGluZ1F1ZXJ5ID0ge307XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiYmVmb3JlIHVzZXJzIGZldGNoIGNhbGxcIik7XHJcbiAgICAgIHVzZXJTZXJ2aWNlLnJldHJpZXZlQnlTb3J0ZWRPcmRlcihmaW5kUXVlcnksIGluY2x1ZGVkX2ZpZWxkcywgc29ydGluZ1F1ZXJ5LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYWZ0ZXIgdXNlcnMgZmV0Y2ggY2FsbFwiKTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHVzZXJzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICBpZiAodXNlclR5cGUgPT0gJ2NhbmRpZGF0ZScpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjYW5kaWRhdGVTZXJ2aWNlID0gbmV3IENhbmRpZGF0ZVNlcnZpY2UoKTtcclxuICAgICAgICAgICAgICAgIGxldCBjYW5kaWRhdGVzOiBDYW5kaWRhdGVNb2RlbENsYXNzW10gPSBuZXcgQXJyYXkoMCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FuZGlkYXRlSWRzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgY2FuZGlkYXRlIG9mIHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICBjYW5kaWRhdGVJZHMucHVzaChjYW5kaWRhdGUuX2lkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGNhbmRpZGF0ZUZpZWxkcyA9IHtcclxuICAgICAgICAgICAgICAgICAgJ3VzZXJJZCc6IDEsXHJcbiAgICAgICAgICAgICAgICAgICdqb2JUaXRsZSc6IDEsXHJcbiAgICAgICAgICAgICAgICAgICdpc0NvbXBsZXRlZCc6IDEsXHJcbiAgICAgICAgICAgICAgICAgICdpc1N1Ym1pdHRlZCc6IDEsXHJcbiAgICAgICAgICAgICAgICAgICdsb2NhdGlvbi5jaXR5JzogMSxcclxuICAgICAgICAgICAgICAgICAgJ3Byb2ZpY2llbmNpZXMnOiAxLFxyXG4gICAgICAgICAgICAgICAgICAncHJvZmVzc2lvbmFsRGV0YWlscyc6IDEsXHJcbiAgICAgICAgICAgICAgICAgICdjYXBhYmlsaXR5X21hdHJpeCc6IDEsXHJcbiAgICAgICAgICAgICAgICAgICdpc1Zpc2libGUnOiAxLFxyXG4gICAgICAgICAgICAgICAgICAnaW5kdXN0cnkubmFtZSc6IDEsXHJcbiAgICAgICAgICAgICAgICAgICdpbmR1c3RyeS5yb2xlcy5uYW1lJzogMVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYmVmb3JlIGNhbmRpYXRlcyBmZXRjaCBjYWxsXCIpO1xyXG4gICAgICAgICAgICAgICAgY2FuZGlkYXRlU2VydmljZS5yZXRyaWV2ZVdpdGhMZWFuKHt9LCBjYW5kaWRhdGVGaWVsZHMsIChlcnJvciwgY2FuZGlkYXRlc1Jlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAvL2NhbmRpZGF0ZVNlcnZpY2UucmV0cmlldmVXaXRoTGVhbih7J3VzZXJJZCc6IHskaW46IGNhbmRpZGF0ZUlkc319LCB7fSwgKGVycm9yLCBjYW5kaWRhdGVzUmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZldGNoZWQgYWxsIGNhbmRpZGF0ZXM6XCIgKyBjYW5kaWRhdGVzUmVzdWx0Lmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLyogICAgICAgICAgICAgICAgICBmb3IgKGxldCBjYW5kaWRhdGUgb2YgY2FuZGlkYXRlc1Jlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICBpZiAoY2FuZGlkYXRlLnByb2ZpY2llbmNpZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICBjYW5kaWRhdGUua2V5U2tpbGxzID0gY2FuZGlkYXRlLnByb2ZpY2llbmNpZXMudG9TdHJpbmcoKS5yZXBsYWNlKC8sL2csICcgJCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICBpZiAoY2FuZGlkYXRlLmluZHVzdHJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZS5yb2xlcyA9IGNhbmRpZGF0ZVNlcnZpY2UubG9hZFJvbGVzKGNhbmRpZGF0ZS5pbmR1c3RyeS5yb2xlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgIGlmIChjYW5kaWRhdGUuY2FwYWJpbGl0eV9tYXRyaXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgY2FuZGlkYXRlLmNhcGFiaWxpdHlNYXRyaXggPSBjYW5kaWRhdGVTZXJ2aWNlLmxvYWRDYXBhYmlsaXRpRGV0YWlscyhjYW5kaWRhdGUuY2FwYWJpbGl0eV9tYXRyaXgpO1xyXG4gICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgIHVzZXJzTWFwLnNldChjYW5kaWRhdGUudXNlcklkLnRvU3RyaW5nKCksIGNhbmRpZGF0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHVzZXIgb2YgcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgIHVzZXIuZGF0YSA9IHVzZXJzTWFwLmdldCh1c2VyLl9pZC50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgICAgICAgY2FuZGlkYXRlcy5wdXNoKHVzZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICB9Ki9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcnMuY2FuZGlkYXRlID0gY2FuZGlkYXRlcztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXNlcnMpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImluc2lkZSByZWNydWl0ZXIgZmV0Y2hcIik7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVjcnVpdGVyU2VydmljZSA9IG5ldyBSZWNydWl0ZXJTZXJ2aWNlKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVjcnVpdGVyczogUmVjcnVpdGVyQ2xhc3NNb2RlbFtdID0gbmV3IEFycmF5KDApO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlY3J1aXRlckZpZWxkcyA9IHtcclxuICAgICAgICAgICAgICAgICAgJ3VzZXJJZCc6IDEsXHJcbiAgICAgICAgICAgICAgICAgICdjb21wYW55X25hbWUnOiAxLFxyXG4gICAgICAgICAgICAgICAgICAnY29tcGFueV9zaXplJzogMSxcclxuICAgICAgICAgICAgICAgICAgJ2lzUmVjcnVpdGluZ0ZvcnNlbGYnOiAxLFxyXG4gICAgICAgICAgICAgICAgICAncG9zdGVkSm9icy5pc0pvYlBvc3RlZCc6IDEsXHJcbiAgICAgICAgICAgICAgICAgICdwb3N0ZWRKb2JzLmNhcGFiaWxpdHlfbWF0cml4JzogMSxcclxuICAgICAgICAgICAgICAgICAgJ3Bvc3RlZEpvYnMuZXhwaXJpbmdEYXRlJzogMSxcclxuICAgICAgICAgICAgICAgICAgJ3Bvc3RlZEpvYnMucG9zdGluZ0RhdGUnOiAxLFxyXG4gICAgICAgICAgICAgICAgICAncG9zdGVkSm9icy5qb2JUaXRsZSc6IDEsXHJcbiAgICAgICAgICAgICAgICAgICdwb3N0ZWRKb2JzLmhpcmluZ01hbmFnZXInOiAxLFxyXG4gICAgICAgICAgICAgICAgICAncG9zdGVkSm9icy5kZXBhcnRtZW50JzogMSxcclxuICAgICAgICAgICAgICAgICAgJ3Bvc3RlZEpvYnMuZWR1Y2F0aW9uJzogMSxcclxuICAgICAgICAgICAgICAgICAgJ3Bvc3RlZEpvYnMuZXhwZXJpZW5jZU1pblZhbHVlJzogMSxcclxuICAgICAgICAgICAgICAgICAgJ3Bvc3RlZEpvYnMuZXhwZXJpZW5jZU1heFZhbHVlJzogMSxcclxuICAgICAgICAgICAgICAgICAgJ3Bvc3RlZEpvYnMuc2FsYXJ5TWluVmFsdWUnOiAxLFxyXG4gICAgICAgICAgICAgICAgICAncG9zdGVkSm9icy5zYWxhcnlNYXhWYWx1ZSc6IDEsXHJcbiAgICAgICAgICAgICAgICAgICdwb3N0ZWRKb2JzLmpvaW5pbmdQZXJpb2QnOiAxLFxyXG4gICAgICAgICAgICAgICAgICAncG9zdGVkSm9icy5wcm9maWNpZW5jaWVzJzogMSxcclxuICAgICAgICAgICAgICAgICAgJ3Bvc3RlZEpvYnMuYWRkaXRpb25hbFByb2ZpY2llbmNpZXMnOiAxLFxyXG4gICAgICAgICAgICAgICAgICAncG9zdGVkSm9icy5pbmR1c3RyeS5uYW1lJzogMSxcclxuICAgICAgICAgICAgICAgICAgJ3Bvc3RlZEpvYnMuaW5kdXN0cnkucm9sZXMubmFtZSc6IDEsXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHJlY3J1aXRlclNlcnZpY2UucmV0cmlldmVXaXRoTGVhbih7fSwgcmVjcnVpdGVyRmllbGRzLCAoZXJyb3IsIHJlY3J1aXRlclJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGZXRjaGVkIGFsbCByZWNydWl0ZXJzOlwiICsgcmVjcnVpdGVyUmVzdWx0Lmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgcmVjcnVpdGVyIG9mIHJlY3J1aXRlclJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmVjcnVpdGVyLm51bWJlck9mSm9ic1Bvc3RlZCA9IHJlY3J1aXRlci5wb3N0ZWRKb2JzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICAgIHJlY3J1aXRlclNlcnZpY2UubG9hZENhcGJpbGl0eUFuZEtleVNraWxscyhyZWNydWl0ZXIucG9zdGVkSm9icyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICB1c2Vyc01hcC5zZXQocmVjcnVpdGVyLnVzZXJJZC50b1N0cmluZygpLCByZWNydWl0ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdXNlciBvZiByZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHVzZXIuZGF0YSA9IHVzZXJzTWFwLmdldCh1c2VyLl9pZC50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgICAgICAgIHJlY3J1aXRlcnMucHVzaCh1c2VyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJzLnJlY3J1aXRlciA9IHJlY3J1aXRlcnM7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXNlcnMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIGNhdGNoXHJcbiAgICAgIChlKSB7XHJcbiAgICAgIGNhbGxiYWNrKGUsIG51bGwpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGdldENvdW50T2ZVc2VycyhpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCBjYW5kaWRhdGVTZXJ2aWNlID0gbmV3IENhbmRpZGF0ZVNlcnZpY2UoKTtcclxuICAgICAgbGV0IHJlY3J1aXRlclNlcnZpY2UgPSBuZXcgUmVjcnVpdGVyU2VydmljZSgpO1xyXG4gICAgICBsZXQgdXNlcnM6IFVzZXJzQ2xhc3NNb2RlbCA9IG5ldyBVc2Vyc0NsYXNzTW9kZWwoKTtcclxuICAgICAgbGV0IGZpbmRRdWVyeSA9IG5ldyBPYmplY3QoKTtcclxuXHJcbiAgICAgIGNhbmRpZGF0ZVNlcnZpY2UuZ2V0VG90YWxDYW5kaWRhdGVDb3VudCgoZXJyb3IsIGNhbmRpZGF0ZUNvdW50KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHVzZXJzLnRvdGFsTnVtYmVyT2ZDYW5kaWRhdGVzID0gY2FuZGlkYXRlQ291bnQ7XHJcbiAgICAgICAgICByZWNydWl0ZXJTZXJ2aWNlLmdldFRvdGFsUmVjcnVpdGVyQ291bnQoKGVycm9yLCByZWNydWl0ZXJDb3VudCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdXNlcnMudG90YWxOdW1iZXJPZlJlY3J1aXRlcnMgPSByZWNydWl0ZXJDb3VudDtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB1c2Vycyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaFxyXG4gICAgICAoZSkge1xyXG4gICAgICBjYWxsYmFjayhlLCBudWxsKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBnZXRSZWNydWl0ZXJEZXRhaWxzKGluaXRpYWw6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCB1c2VyczogVXNlcnNDbGFzc01vZGVsID0gbmV3IFVzZXJzQ2xhc3NNb2RlbCgpO1xyXG4gICAgICBsZXQgdXNlcnNNYXA6IE1hcDxhbnksIGFueT4gPSBuZXcgTWFwKCk7XHJcblxyXG4gICAgICBsZXQgcmVjcnVpdGVyU2VydmljZSA9IG5ldyBSZWNydWl0ZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCByZWNydWl0ZXJzOiBSZWNydWl0ZXJDbGFzc01vZGVsW10gPSBuZXcgQXJyYXkoMCk7XHJcblxyXG4gICAgICBsZXQgcmVnRXggPSBuZXcgUmVnRXhwKCdeWycgKyBpbml0aWFsLnRvTG93ZXJDYXNlKCkgKyBpbml0aWFsLnRvVXBwZXJDYXNlKCkgKyAnXScpO1xyXG4gICAgICBsZXQgZmluZFF1ZXJ5ID0ge1xyXG4gICAgICAgICdjb21wYW55X25hbWUnOiB7XHJcbiAgICAgICAgICAkcmVnZXg6IHJlZ0V4XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGxldCBzb3J0aW5nUXVlcnkgPSB7J2NvbXBhbnlfbmFtZSc6IDEsICdjb21wYW55X3NpemUnOiAxfTtcclxuXHJcbiAgICAgIGxldCByZWNydWl0ZXJGaWVsZHMgPSB7XHJcbiAgICAgICAgJ3VzZXJJZCc6IDEsXHJcbiAgICAgICAgJ2NvbXBhbnlfbmFtZSc6IDEsXHJcbiAgICAgICAgJ2NvbXBhbnlfc2l6ZSc6IDEsXHJcbiAgICAgICAgJ3Bvc3RlZEpvYnMuaXNKb2JQb3N0ZWQnOiAxXHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZWNydWl0ZXJTZXJ2aWNlLnJldHJpZXZlQnlTb3J0ZWRPcmRlcihmaW5kUXVlcnksIHJlY3J1aXRlckZpZWxkcywgc29ydGluZ1F1ZXJ5LCAoZXJyb3IsIHJlY3J1aXRlclJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB1c2Vycy50b3RhbE51bWJlck9mUmVjcnVpdGVycyA9IHJlY3J1aXRlclJlc3VsdC5sZW5ndGg7XHJcbiAgICAgICAgICBpZiAocmVjcnVpdGVyUmVzdWx0Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHVzZXJzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgdXNlckZpZWxkcyA9IHtcclxuICAgICAgICAgICAgICAnX2lkJzogMSxcclxuICAgICAgICAgICAgICAnbW9iaWxlX251bWJlcic6IDEsXHJcbiAgICAgICAgICAgICAgJ2VtYWlsJzogMSxcclxuICAgICAgICAgICAgICAnaXNBY3RpdmF0ZWQnOiAxXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCByZWNydWl0ZXIgb2YgcmVjcnVpdGVyUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgdXNlcnNNYXAuc2V0KHJlY3J1aXRlci51c2VySWQudG9TdHJpbmcoKSwgcmVjcnVpdGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB1c2VyU2VydmljZS5yZXRyaWV2ZVdpdGhMZWFuKHsnaXNDYW5kaWRhdGUnOiBmYWxzZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmV0Y2hlZCBhbGwgcmVjcnVpdGVycyBmcm9tIHVzZXJzOlwiICsgcmVjcnVpdGVyUmVzdWx0Lmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB1c2VyIG9mIHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICBpZiAodXNlcnNNYXAuZ2V0KHVzZXIuX2lkLnRvU3RyaW5nKCkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlci5kYXRhID0gdXNlcnNNYXAuZ2V0KHVzZXIuX2lkLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlY3J1aXRlcnMucHVzaCh1c2VyKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHVzZXJzLnJlY3J1aXRlciA9IHJlY3J1aXRlcnM7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB1c2Vycyk7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGNhdGNoXHJcbiAgICAgIChlKSB7XHJcbiAgICAgIGNhbGxiYWNrKGUsIG51bGwpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGdldENhbmRpZGF0ZURldGFpbHMoaW5pdGlhbDogc3RyaW5nLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgbGV0IHVzZXJzOiBVc2Vyc0NsYXNzTW9kZWwgPSBuZXcgVXNlcnNDbGFzc01vZGVsKCk7XHJcbiAgICAgIGxldCB1c2Vyc01hcDogTWFwPGFueSwgYW55PiA9IG5ldyBNYXAoKTtcclxuXHJcbiAgICAgIGxldCBjYW5kaWRhdGVzOiBDYW5kaWRhdGVNb2RlbENsYXNzW10gPSBuZXcgQXJyYXkoMCk7XHJcbiAgICAgIGxldCBjYW5kaWRhdGVTZXJ2aWNlID0gbmV3IENhbmRpZGF0ZVNlcnZpY2UoKTtcclxuXHJcbiAgICAgIGxldCByZWdFeCA9IG5ldyBSZWdFeHAoJ15bJyArIGluaXRpYWwudG9Mb3dlckNhc2UoKSArIGluaXRpYWwudG9VcHBlckNhc2UoKSArICddJyk7XHJcbiAgICAgIGxldCBmaW5kUXVlcnkgPSB7XHJcbiAgICAgICAgJ2ZpcnN0X25hbWUnOiB7XHJcbiAgICAgICAgICAkcmVnZXg6IHJlZ0V4XHJcbiAgICAgICAgfSxcclxuICAgICAgICAnaXNBZG1pbic6IGZhbHNlLFxyXG4gICAgICAgICdpc0NhbmRpZGF0ZSc6IHRydWVcclxuICAgICAgfTtcclxuICAgICAgbGV0IGluY2x1ZGVkX2ZpZWxkcyA9IHtcclxuICAgICAgICAnX2lkJzogMSxcclxuICAgICAgICAnZmlyc3RfbmFtZSc6IDEsXHJcbiAgICAgICAgJ2xhc3RfbmFtZSc6IDEsXHJcbiAgICAgICAgJ21vYmlsZV9udW1iZXInOiAxLFxyXG4gICAgICAgICdlbWFpbCc6IDEsXHJcbiAgICAgICAgJ2lzQWN0aXZhdGVkJzogMVxyXG4gICAgICB9O1xyXG4gICAgICBsZXQgc29ydGluZ1F1ZXJ5ID0geydmaXJzdF9uYW1lJzogMSwgJ2xhc3RfbmFtZSc6IDF9O1xyXG5cclxuICAgICAgdXNlclNlcnZpY2UucmV0cmlldmVCeVNvcnRlZE9yZGVyKGZpbmRRdWVyeSwgaW5jbHVkZWRfZmllbGRzLCBzb3J0aW5nUXVlcnksIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHVzZXJzLnRvdGFsTnVtYmVyT2ZDYW5kaWRhdGVzID0gcmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXNlcnMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IDA7XHJcbiAgICAgICAgICAgIGxldCBjYW5kaWRhdGVGaWVsZHMgPSB7XHJcbiAgICAgICAgICAgICAgJ3VzZXJJZCc6IDEsXHJcbiAgICAgICAgICAgICAgJ2pvYlRpdGxlJzogMSxcclxuICAgICAgICAgICAgICAnaXNDb21wbGV0ZWQnOiAxLFxyXG4gICAgICAgICAgICAgICdpc1N1Ym1pdHRlZCc6IDEsXHJcbiAgICAgICAgICAgICAgJ2lzVmlzaWJsZSc6IDEsXHJcbiAgICAgICAgICAgICAgJ2xvY2F0aW9uLmNpdHknOiAxXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGNhbmRpZGF0ZVNlcnZpY2UucmV0cmlldmVXaXRoTGVhbih7fSwgY2FuZGlkYXRlRmllbGRzLCAoZXJyb3IsIGNhbmRpZGF0ZXNSZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGZXRjaGVkIGFsbCBjYW5kaWRhdGVzOlwiICsgY2FuZGlkYXRlc1Jlc3VsdC5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgY2FuZGlkYXRlIG9mIGNhbmRpZGF0ZXNSZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgdXNlcnNNYXAuc2V0KGNhbmRpZGF0ZS51c2VySWQudG9TdHJpbmcoKSwgY2FuZGlkYXRlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB1c2VyIG9mIHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICB1c2VyLmRhdGEgPSB1c2Vyc01hcC5nZXQodXNlci5faWQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZXMucHVzaCh1c2VyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB1c2Vycy5jYW5kaWRhdGUgPSBjYW5kaWRhdGVzO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXNlcnMpO1xyXG5cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBjYWxsYmFjayhlLCBudWxsKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBhZGRVc2FnZURldGFpbHNWYWx1ZShpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB2YWx1ZTogbnVtYmVyID0gMDtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFsdWUrKztcclxuICAgICAgICBpdGVtW2ldLmFjdGlvbiA9IENvbnN0VmFyaWFibGVzLkFjdGlvbnNBcnJheVtpdGVtW2ldLmFjdGlvbl07XHJcbiAgICAgICAgaWYgKGl0ZW0ubGVuZ3RoID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwgaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIGNhbGxiYWNrKGUsIG51bGwpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGdlbmVyYXRlVXNhZ2VEZXRhaWxGaWxlKHJlc3VsdDogYW55LCBjYWxsYmFjazogKGVycjogYW55LCByZXM6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgaWYgKHJlc3VsdCAmJiByZXN1bHQubGVuZ3RoID4gMCkge1xyXG4gICAgICBsZXQgZmllbGRzID0gWydjYW5kaWRhdGVJZCcsICdyZWNydWl0ZXJJZCcsICdqb2JQcm9maWxlSWQnLCAnYWN0aW9uJywgJ3RpbWVzdGFtcCddO1xyXG4gICAgICBsZXQgZmllbGROYW1lcyA9IFsnQ2FuZGlkYXRlIElkJywgJ1JlY3J1aXRlcklkJywgJ0pvYiBQcm9maWxlIElkJywgJ0FjdGlvbicsICdUaW1lU3RhbXAnXTtcclxuICAgICAgbGV0IGNzdiA9IGpzb24yY3N2KHtkYXRhOiByZXN1bHQsIGZpZWxkczogZmllbGRzLCBmaWVsZE5hbWVzOiBmaWVsZE5hbWVzfSk7XHJcbiAgICAgIC8vZnMud3JpdGVGaWxlKCcuL3NyYy9zZXJ2ZXIvcHVibGljL3VzYWdlZGV0YWlsLmNzdicsIGNzdiwgZnVuY3Rpb24gKGVycjogYW55KSB7XHJcbiAgICAgIGZzLndyaXRlRmlsZSgnL2hvbWUvYml0bmFtaS9hcHBzL2pvYm1vc2lzLXN0YWdpbmcvYy1uZXh0L2Rpc3Qvc2VydmVyL3Byb2QvcHVibGljL3VzYWdlZGV0YWlsLmNzdicsIGNzdiwgZnVuY3Rpb24gKGVycjogYW55KSB7XHJcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBzZW5kQWRtaW5Mb2dpbkluZm9NYWlsKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCBoZWFkZXIxID0gZnMucmVhZEZpbGVTeW5jKCcuL3NyYy9zZXJ2ZXIvYXBwL2ZyYW1ld29yay9wdWJsaWMvaGVhZGVyMS5odG1sJykudG9TdHJpbmcoKTtcclxuICAgIGxldCBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKCcuL3NyYy9zZXJ2ZXIvYXBwL2ZyYW1ld29yay9wdWJsaWMvYWRtaW5sb2dpbmluZm8ubWFpbC5odG1sJykudG9TdHJpbmcoKTtcclxuICAgIGxldCBmb290ZXIxID0gZnMucmVhZEZpbGVTeW5jKCcuL3NyYy9zZXJ2ZXIvYXBwL2ZyYW1ld29yay9wdWJsaWMvZm9vdGVyMS5odG1sJykudG9TdHJpbmcoKTtcclxuICAgIGxldCBtaWRfY29udGVudCA9IGNvbnRlbnQucmVwbGFjZSgnJGVtYWlsJCcsIGZpZWxkLmVtYWlsKS5yZXBsYWNlKCckYWRkcmVzcyQnLCAoZmllbGQubG9jYXRpb24gPT09IHVuZGVmaW5lZCkgPyAnTm90IEZvdW5kJyA6IGZpZWxkLmxvY2F0aW9uKVxyXG4gICAgICAucmVwbGFjZSgnJGlwJCcsIGZpZWxkLmlwKS5yZXBsYWNlKCckaG9zdCQnLCBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuaG9zdCcpKTtcclxuXHJcblxyXG4gICAgbGV0IG1haWxPcHRpb25zID0ge1xyXG4gICAgICBmcm9tOiBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuTUFJTF9TRU5ERVInKSxcclxuICAgICAgdG86IGNvbmZpZy5nZXQoJ1RwbFNlZWQubWFpbC5BRE1JTl9NQUlMJyksXHJcbiAgICAgIGNjOiBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuVFBMR1JPVVBfTUFJTCcpLFxyXG4gICAgICBzdWJqZWN0OiBNZXNzYWdlcy5FTUFJTF9TVUJKRUNUX0FETUlOX0xPR0dFRF9PTiArIFwiIFwiICsgY29uZmlnLmdldCgnVHBsU2VlZC5tYWlsLmhvc3QnKSxcclxuICAgICAgaHRtbDogaGVhZGVyMSArIG1pZF9jb250ZW50ICsgZm9vdGVyMVxyXG4gICAgICAsIGF0dGFjaG1lbnRzOiBNYWlsQXR0YWNobWVudHMuQXR0YWNobWVudEFycmF5XHJcbiAgICB9XHJcbiAgICBsZXQgc2VuZE1haWxTZXJ2aWNlID0gbmV3IFNlbmRNYWlsU2VydmljZSgpO1xyXG4gICAgc2VuZE1haWxTZXJ2aWNlLnNlbmRNYWlsKG1haWxPcHRpb25zLCBjYWxsYmFjayk7XHJcblxyXG4gIH07XHJcblxyXG4gIHVwZGF0ZVVzZXIoX2lkOiBzdHJpbmcsIGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kQnlJZChfaWQsIChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgcmVzKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnVwZGF0ZShyZXMuX2lkLCBpdGVtLCBjYWxsYmFjayk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGdldFVzYWdlRGV0YWlscyhmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnVzZXNUcmFja2luZ0NvbnRyb2xsZXIucmV0cmlldmVBbGwoKGVycjogYW55LCByZXM6IGFueSkgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCByZXMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBleHBvcnRDYW5kaWRhdGVDb2xsZWN0aW9uKGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcImluc2lkZSBleHBvcnRDYW5kaWRhdGVDb2xsZWN0aW9uXCIpO1xyXG4gICAgLypsZXQgY2FuZGlkYXRlQ2hpbGQgPSBzcGF3bignbW9uZ29leHBvcnQnLCBbJy0tZGInLCBkYiwgJy0tY29sbGVjdGlvbicsICdjYW5kaWRhdGVzJywgJy0tdHlwZScsICdjc3YnLCAnLS1maWVsZHMnLFxyXG4gICAgICAndXNlcklkLGpvYlRpdGxlLGlzQ29tcGxldGVkLGlzU3VibWl0dGVkLGxvY2F0aW9uLmNpdHkscHJvZmljaWVuY2llcyxwcm9mZXNzaW9uYWxEZXRhaWxzLGlzVmlzaWJsZScsXHJcbiAgICAgICctLW91dCcsICcvaG9tZS9zaHJpa2FudC9KYXZhUHJvamVjdC9uZzQtY25leHQvYy1uZXh0L2Rpc3Qvc2VydmVyL3Byb2QvcHVibGljL2NhbmRpZGF0ZXMuY3N2J10pOyovXHJcblxyXG4gICAgbGV0IGNhbmRpZGF0ZUNoaWxkID0gc3Bhd24oJ21vbmdvZXhwb3J0JywgWyctLXVzZXJuYW1lJywgdXNlcm5hbWUsICctLXBhc3N3b3JkJywgcGFzc3dvcmQsJy0tZGInLCBkYiwgJy0tY29sbGVjdGlvbicsXHJcbiAgICAgICdjYW5kaWRhdGVzJywgJy0tdHlwZScsICdjc3YnLCAnLS1maWVsZHMnLFxyXG4gICAgICAndXNlcklkLGpvYlRpdGxlLGlzQ29tcGxldGVkLGlzU3VibWl0dGVkLGxvY2F0aW9uLmNpdHkscHJvZmljaWVuY2llcyxwcm9mZXNzaW9uYWxEZXRhaWxzLGlzVmlzaWJsZScsXHJcbiAgICAgICctLW91dCcsICcvaG9tZS9iaXRuYW1pL2FwcHMvam9ibW9zaXMtc3RhZ2luZy9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvY2FuZGlkYXRlcy5jc3YnXSk7XHJcblxyXG4gICAgY2FuZGlkYXRlQ2hpbGQub24oJ2V4aXQnLCBmdW5jdGlvbiAoY29kZTogYW55KSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdjYW5kaWRhdGVDaGlsZCBwcm9jZXNzIGNsb3NlZCB3aXRoIGNvZGUgJyArIGNvZGUpO1xyXG4gICAgICBjYW5kaWRhdGVDaGlsZC5raWxsKCk7XHJcbiAgICAgIGNhbGxiYWNrKG51bGwsICdzdWNjZXNzJyk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGV4cG9ydENhbmRpZGF0ZU90aGVyRGV0YWlsc0NvbGxlY3Rpb24oY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiaW5zaWRlIGV4cG9ydENhbmRpZGF0ZURldGFpbHNDb2xsZWN0aW9uXCIpO1xyXG4gICAgLypsZXQgY2FuZGlkYXRlT3RoZXJEZXRhaWxzQ2hpbGQgPSBzcGF3bignbW9uZ29leHBvcnQnLCBbJy0tZGInLCBkYiwgJy0tY29sbGVjdGlvbicsICdjYW5kaWRhdGVzJyxcclxuICAgICAgJy0tdHlwZScsICdjc3YnLCAnLS1maWVsZHMnLCAndXNlcklkLGNhcGFiaWxpdHlfbWF0cml4JywgJy0tb3V0JyxcclxuICAgICAgJy9ob21lL2thcGlsL0phdmFQcm9qZWN0L25nNC1jbmV4dC9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvY2FuZGlkYXRlcy1vdGhlci1kZXRhaWxzLmNzdiddKTtcclxuKi9cclxuICAgIGxldCBjYW5kaWRhdGVPdGhlckRldGFpbHNDaGlsZCA9IHNwYXduKCdtb25nb2V4cG9ydCcsIFsnLS11c2VybmFtZScsIHVzZXJuYW1lLCAnLS1wYXNzd29yZCcsIHBhc3N3b3JkLCAnLS1kYicsIGRiLCAnLS1jb2xsZWN0aW9uJywgJ2NhbmRpZGF0ZXMnLFxyXG4gICAgICAnLS10eXBlJywgJ2NzdicsICctLWZpZWxkcycsICd1c2VySWQsY2FwYWJpbGl0eV9tYXRyaXgnLCAnLS1vdXQnLFxyXG4gICAgICAnL2hvbWUvYml0bmFtaS9hcHBzL2pvYm1vc2lzLXN0YWdpbmcvYy1uZXh0L2Rpc3Qvc2VydmVyL3Byb2QvcHVibGljL2NhbmRpZGF0ZXMtb3RoZXItZGV0YWlscy5jc3YnXSk7XHJcblxyXG4gICAgY2FuZGlkYXRlT3RoZXJEZXRhaWxzQ2hpbGQub24oJ2V4aXQnLCBmdW5jdGlvbiAoY29kZTogYW55KSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdjYW5kaWRhdGVPdGhlckRldGFpbHNDaGlsZCBwcm9jZXNzIGNsb3NlZCB3aXRoIGNvZGUgJyArIGNvZGUpO1xyXG4gICAgICBjYW5kaWRhdGVPdGhlckRldGFpbHNDaGlsZC5raWxsKCk7XHJcbiAgICAgIGNhbGxiYWNrKG51bGwsICdzdWNjZXNzJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBleHBvcnRVc2VyQ29sbGVjdGlvbih1c2VyVHlwZTogc3RyaW5nLCBjYWxsYmFjazogKGVycjogYW55LCByZXM6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgY29uc29sZS5sb2coXCJpbnNpZGUgZXhwb3J0VXNlckNvbGxlY3Rpb25cIik7XHJcbiAgICBsZXQgdXNlckNoaWxkOiBhbnk7XHJcblxyXG4vKlxyXG4gICAgaWYgKHVzZXJUeXBlID09ICdjYW5kaWRhdGUnKSB7XHJcbiAgICAgIHVzZXJDaGlsZCA9IHNwYXduKCdtb25nb2V4cG9ydCcsIFsnLS1kYicsIGRiLCAnLS1jb2xsZWN0aW9uJywgJ3VzZXJzJywgJy0tdHlwZScsICdjc3YnLCAnLS1maWVsZHMnLFxyXG4gICAgICAgICdfaWQsZmlyc3RfbmFtZSxsYXN0X25hbWUsZW1haWwsbG9jYXRpb24uY2l0eSxpc0FjdGl2YXRlZCcsXHJcbiAgICAgICAgJy0tb3V0JywgJy9ob21lL2thcGlsL0phdmFQcm9qZWN0L25nNC1jbmV4dC9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvdXNlcnMuY3N2JywgJy0tcXVlcnknLFxyXG4gICAgICAgICd7XCJpc0NhbmRpZGF0ZVwiOiB0cnVlfSddKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHVzZXJDaGlsZCA9IHNwYXduKCdtb25nb2V4cG9ydCcsIFsnLS1kYicsIGRiLCAnLS1jb2xsZWN0aW9uJywgJ3VzZXJzJywgJy0tdHlwZScsICdjc3YnLCAnLS1maWVsZHMnLFxyXG4gICAgICAgICdfaWQsbW9iaWxlX251bWJlcixlbWFpbCxsb2NhdGlvbi5jaXR5LGlzQWN0aXZhdGVkJywgJy0tb3V0JyxcclxuICAgICAgICAnL2hvbWUva2FwaWwvSmF2YVByb2plY3Qvbmc0LWNuZXh0L2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy91c2Vycy5jc3YnLFxyXG4gICAgICAgICctLXF1ZXJ5JywgJ3tcImlzQ2FuZGlkYXRlXCI6IGZhbHNlfSddKTtcclxuICAgIH1cclxuKi9cclxuXHJcbiAgICBpZiAodXNlclR5cGUgPT0gJ2NhbmRpZGF0ZScpIHtcclxuICAgICAgdXNlckNoaWxkID0gc3Bhd24oJ21vbmdvZXhwb3J0JywgWyctLXVzZXJuYW1lJywgdXNlcm5hbWUsICdwYXNzd29yZCcsIHBhc3N3b3JkLCAnLS1kYicsIGRiLCAnLS1jb2xsZWN0aW9uJywgJ3VzZXJzJywgJy0tdHlwZScsICdjc3YnLCAnLS1maWVsZHMnLFxyXG4gICAgICAgICdfaWQsZmlyc3RfbmFtZSxsYXN0X25hbWUsZW1haWwsbG9jYXRpb24uY2l0eSxpc0FjdGl2YXRlZCcsXHJcbiAgICAgICAgJy0tb3V0JywgJy9ob21lL2JpdG5hbWkvYXBwcy9qb2Jtb3Npcy1zdGFnaW5nL2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy91c2Vycy5jc3YnLCAnLS1xdWVyeScsXHJcbiAgICAgICAgJ3tcImlzQ2FuZGlkYXRlXCI6IHRydWV9J10pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdXNlckNoaWxkID0gc3Bhd24oJ21vbmdvZXhwb3J0JywgWyctLXVzZXJuYW1lJywgdXNlcm5hbWUsICdwYXNzd29yZCcsIHBhc3N3b3JkLCAnLS1kYicsIGRiLCAnLS1jb2xsZWN0aW9uJywgJ3VzZXJzJywgJy0tdHlwZScsICdjc3YnLCAnLS1maWVsZHMnLFxyXG4gICAgICAgICdfaWQsbW9iaWxlX251bWJlcixlbWFpbCxsb2NhdGlvbi5jaXR5LGlzQWN0aXZhdGVkJywgJy0tb3V0JyxcclxuICAgICAgICAnL2hvbWUvYml0bmFtaS9hcHBzL2pvYm1vc2lzLXN0YWdpbmcvYy1uZXh0L2Rpc3Qvc2VydmVyL3Byb2QvcHVibGljL3VzZXJzLmNzdicsXHJcbiAgICAgICAgJy0tcXVlcnknLCAne1wiaXNDYW5kaWRhdGVcIjogZmFsc2V9J10pO1xyXG4gICAgfVxyXG5cclxuICAgIHVzZXJDaGlsZC5vbignY2xvc2UnLCBmdW5jdGlvbiAoY29kZTogYW55KSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCd1c2VyQ2hpbGQgcHJvY2VzcyBjbG9zZWQgd2l0aCBjb2RlICcgKyBjb2RlKTtcclxuICAgICAgdXNlckNoaWxkLmtpbGwoKTtcclxuICAgICAgY2FsbGJhY2sobnVsbCwgJ3N1Y2Nlc3MnKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZXhwb3J0UmVjcnVpdGVyQ29sbGVjdGlvbihjYWxsYmFjazogKGVycjogYW55LCByZXM6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgY29uc29sZS5sb2coXCJpbnNpZGUgZXhwb3J0UmVjcnVpdGVyQ29sbGVjdGlvblwiKTtcclxuLypcclxuICAgIGxldCByZWNydWl0ZXJDaGlsZCA9IHNwYXduKCdtb25nb2V4cG9ydCcsIFsnLS1kYicsIGRiLCAnLS1jb2xsZWN0aW9uJywgJ3JlY3J1aXRlcnMnLCAnLS10eXBlJywgJ2NzdicsXHJcbiAgICAgICctLWZpZWxkcycsJ3VzZXJJZCxpc1JlY3J1aXRpbmdGb3JzZWxmLGNvbXBhbnlfbmFtZSxjb21wYW55X3NpemUsY29tcGFueV93ZWJzaXRlLHBvc3RlZEpvYnMnLCAnLS1vdXQnLFxyXG4gICAgICAnL2hvbWUva2FwaWwvSmF2YVByb2plY3Qvbmc0LWNuZXh0L2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy9yZWNydWl0ZXJzLmNzdiddKTtcclxuKi9cclxuXHJcbiAgICBsZXQgcmVjcnVpdGVyQ2hpbGQgPSBzcGF3bignbW9uZ29leHBvcnQnLCBbJy0tdXNlcm5hbWUnLCB1c2VybmFtZSwgJ3Bhc3N3b3JkJywgcGFzc3dvcmQsICctLWRiJywgZGIsICctLWNvbGxlY3Rpb24nLCAncmVjcnVpdGVycycsICctLXR5cGUnLCAnY3N2JyxcclxuICAgICAgJy0tZmllbGRzJywndXNlcklkLGlzUmVjcnVpdGluZ0ZvcnNlbGYsY29tcGFueV9uYW1lLGNvbXBhbnlfc2l6ZSxjb21wYW55X3dlYnNpdGUscG9zdGVkSm9icycsICctLW91dCcsXHJcbiAgICAgICcvaG9tZS9iaXRuYW1pL2FwcHMvam9ibW9zaXMtc3RhZ2luZy9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvcmVjcnVpdGVycy5jc3YnXSk7XHJcblxyXG4gICAgcmVjcnVpdGVyQ2hpbGQub24oJ2V4aXQnLCBmdW5jdGlvbiAoY29kZTogYW55KSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdyZWNydWl0ZXJDaGlsZCBwcm9jZXNzIGNsb3NlZCB3aXRoIGNvZGUgJyArIGNvZGUpO1xyXG4gICAgICBjYWxsYmFjayhudWxsLCAnc3VjY2VzcycpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbn1cclxuXHJcbk9iamVjdC5zZWFsKEFkbWluU2VydmljZSk7XHJcbmV4cG9ydCA9IEFkbWluU2VydmljZTtcclxuIl19
