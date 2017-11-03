"use strict";
var UserRepository = require("../dataaccess/repository/user.repository");
var SendMailService = require("./sendmail.service");
var Messages = require("../shared/messages");
var MailAttachments = require("../shared/sharedarray");
var RecruiterRepository = require("../dataaccess/repository/recruiter.repository");
var UsersClassModel = require("../dataaccess/model/users");
var CandidateService = require("./candidate.service");
var RecruiterService = require("./recruiter.service");
var IndustryRepository = require("../dataaccess/repository/industry.repository");
var UserService = require("./user.service");
var config = require('config');
var fs = require('fs');
var usestracking = require('uses-tracking');
var spawn = require('child_process').spawn;
var mongoExport = config.get('TplSeed.database.mongoExport');
var db = config.get('TplSeed.database.name');
var username = config.get('TplSeed.database.username');
var password = config.get('TplSeed.database.password');
var AdminService = (function () {
    function AdminService() {
        this.userRepository = new UserRepository();
        this.industryRepositiry = new IndustryRepository();
        this.recruiterRepository = new RecruiterRepository();
        var obj = new usestracking.MyController();
        this.usesTrackingController = obj._controller;
    }
    AdminService.prototype.getCountOfUsers = function (item, callback) {
        try {
            var candidateService = new CandidateService();
            var recruiterService_1 = new RecruiterService();
            var users_1 = new UsersClassModel();
            var findQuery = new Object();
            candidateService.getTotalCandidateCount(function (error, candidateCount) {
                if (error) {
                    callback(error, null);
                }
                else {
                    users_1.totalNumberOfCandidates = candidateCount;
                    recruiterService_1.getTotalRecruiterCount(function (error, recruiterCount) {
                        if (error) {
                            callback(error, null);
                        }
                        else {
                            users_1.totalNumberOfRecruiters = recruiterCount;
                            callback(null, users_1);
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
            var users_2 = new UsersClassModel();
            var usersMap_1 = new Map();
            var recruiterService = new RecruiterService();
            var recruiters_1 = new Array(0);
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
                    users_2.totalNumberOfRecruiters = recruiterResult.length;
                    if (recruiterResult.length == 0) {
                        callback(null, users_2);
                    }
                    else {
                        var userFields = {
                            '_id': 1,
                            'mobile_number': 1,
                            'email': 1,
                            'isActivated': 1
                        };
                        for (var _i = 0, recruiterResult_1 = recruiterResult; _i < recruiterResult_1.length; _i++) {
                            var recruiter = recruiterResult_1[_i];
                            usersMap_1.set(recruiter.userId.toString(), recruiter);
                        }
                        userService_1.retrieveWithLean({ 'isCandidate': false }, function (error, result) {
                            if (error) {
                                callback(error, null);
                            }
                            else {
                                console.log("Fetched all recruiters from users:" + recruiterResult.length);
                                for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                                    var user = result_1[_i];
                                    if (usersMap_1.get(user._id.toString())) {
                                        user.data = usersMap_1.get(user._id.toString());
                                        recruiters_1.push(user);
                                    }
                                }
                                users_2.recruiter = recruiters_1;
                                callback(null, users_2);
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
            var users_3 = new UsersClassModel();
            var usersMap_2 = new Map();
            var candidates_1 = new Array(0);
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
                    users_3.totalNumberOfCandidates = result.length;
                    if (result.length == 0) {
                        callback(null, users_3);
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
                                    usersMap_2.set(candidate.userId.toString(), candidate);
                                }
                                for (var _a = 0, result_2 = result; _a < result_2.length; _a++) {
                                    var user = result_2[_a];
                                    user.data = usersMap_2.get(user._id.toString());
                                    candidates_1.push(user);
                                }
                                users_3.candidate = candidates_1;
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
    AdminService.prototype.exportCollection = function (collectionType, fields, downloadLocation, query, callback) {
        console.log("inside " + collectionType + "collection");
        var stderr = '';
        var childProcess;
        if (username == "") {
            childProcess = spawn('mongoexport', ['--db', db, '--collection', collectionType, '--type', 'csv', '--fields', fields,
                '--out', downloadLocation, '--query', query]);
        }
        else {
            childProcess = spawn('mongoexport', ['--username', username, '--password', password, '--db', db, '--collection',
                collectionType, '--type', 'csv', '--fields', fields, '--out', downloadLocation, '--query', query]);
        }
        childProcess.on('exit', function (code) {
            if (code != 0) {
                childProcess.kill();
                callback(new Error(), null);
            }
            else {
                console.log(collectionType + ' process closed with code ' + code);
                childProcess.kill();
                callback(null, 'success');
            }
        });
        childProcess.stderr.on('data', function (buf) {
            console.log('[STR] stderr "%s"', String(buf));
            stderr += buf;
        });
    };
    AdminService.prototype.exportCandidateCollection = function (callback) {
        var fields = '_id,userId,job_list,proficiencies,employmentHistory,academics,industry,awards,interestedIndustries,' +
            'certifications,profile_update_tracking,isVisible,isSubmitted,isCompleted,complexity_note_matrix,' +
            'professionalDetails,aboutMyself,jobTitle,location,lastUpdateAt';
        var downloadLocation = config.get('TplSeed.adminExportFilePath.candidatesCSV');
        this.exportCollection("candidates", fields, downloadLocation, '{}', function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, 'success');
            }
        });
    };
    AdminService.prototype.exportCandidateOtherDetailsCollection = function (callback) {
        var fields = 'userId,capability_matrix';
        var downloadLocation = config.get('TplSeed.adminExportFilePath.candidateOtherDetailsCSV');
        this.exportCollection("candidates", fields, downloadLocation, '{}', function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, 'success');
            }
        });
    };
    AdminService.prototype.exportUserCollection = function (userType, callback) {
        var fields;
        var query;
        var downloadLocation = config.get('TplSeed.adminExportFilePath.usersCSV');
        if (userType == 'candidate') {
            fields = '_id,first_name,last_name,mobile_number,email,current_theme,isCandidate,guide_tour,notifications,' +
                'isAdmin,otp,isActivated,temp_mobile';
            query = '{"isCandidate":true}';
        }
        else {
            fields = '_id,mobile_number,email,current_theme,isCandidate,guide_tour,notifications,isAdmin,otp,isActivated,' +
                'temp_mobile,location,picture',
                query = '{"isCandidate":false}';
        }
        this.exportCollection("users", fields, downloadLocation, query, function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, 'success');
            }
        });
    };
    AdminService.prototype.exportRecruiterCollection = function (callback) {
        var fields = '_id,userId,isRecruitingForself,company_name,company_size,company_website,postedJobs,setOfDocuments,' +
            'company_logo';
        var downloadLocation = config.get('TplSeed.adminExportFilePath.recruitersCSV');
        this.exportCollection("recruiters", fields, downloadLocation, '{}', function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, 'success');
            }
        });
    };
    AdminService.prototype.exportUsageDetailsCollection = function (callback) {
        var fields = '_id,candidateId,jobProfileId,timestamp,action,__v';
        var downloadLocation = config.get('TplSeed.adminExportFilePath.usageDetailsCSV');
        this.exportCollection("usestrackings", fields, downloadLocation, '{}', function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, 'success');
            }
        });
    };
    AdminService.prototype.exportKeySkillsCollection = function (callback) {
        var fields = '_id,proficiencies';
        var downloadLocation = config.get('TplSeed.adminExportFilePath.keySkillsCSV');
        this.exportCollection("proficiencies", fields, downloadLocation, '{}', function (error, result) {
            if (error) {
                callback(error, null);
            }
            else {
                callback(null, 'success');
            }
        });
    };
    return AdminService;
}());
Object.seal(AdminService);
module.exports = AdminService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvYWRtaW4uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBR0EseUVBQTRFO0FBQzVFLG9EQUF1RDtBQUN2RCw2Q0FBZ0Q7QUFDaEQsdURBQTBEO0FBQzFELG1GQUFzRjtBQUN0RiwyREFBOEQ7QUFDOUQsc0RBQXlEO0FBQ3pELHNEQUF5RDtBQUV6RCxpRkFBb0Y7QUFJcEYsNENBQStDO0FBQy9DLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzVDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFFM0MsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0FBQzdELElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUM3QyxJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFDdkQsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBRXZEO0lBT0U7UUFDRSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztRQUNuRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1FBQ3JELElBQUksR0FBRyxHQUFRLElBQUksWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQy9DLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFD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RWpGLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLEVBQUUsTUFBTSxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxVQUFDLEtBQVUsRUFBRSxNQUFXO1lBQzdGLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN4QixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sUUFBUSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztZQUM1QixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFTCxDQUFDO0lBRUQsZ0RBQXlCLEdBQXpCLFVBQTBCLFFBQXNDO1FBQzlELElBQUksTUFBTSxHQUFHLG1CQUFtQixDQUFDO1FBQ2pDLElBQUksZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO1FBRTlFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLEVBQUUsTUFBTSxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxVQUFDLEtBQVUsRUFBRSxNQUFXO1lBQzdGLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN4QixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sUUFBUSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztZQUM1QixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFTCxDQUFDO0lBRUgsbUJBQUM7QUFBRCxDQS9WQSxBQStWQyxJQUFBO0FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUMxQixpQkFBUyxZQUFZLENBQUMiLCJmaWxlIjoiYXBwL2ZyYW1ld29yay9zZXJ2aWNlcy9hZG1pbi5zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHRlY2hwcmltZTAwMiBvbiA4LzI4LzIwMTcuXG4gKi9cbmltcG9ydCBVc2VyUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS91c2VyLnJlcG9zaXRvcnknKTtcbmltcG9ydCBTZW5kTWFpbFNlcnZpY2UgPSByZXF1aXJlKCcuL3NlbmRtYWlsLnNlcnZpY2UnKTtcbmltcG9ydCBNZXNzYWdlcyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9tZXNzYWdlcycpO1xuaW1wb3J0IE1haWxBdHRhY2htZW50cyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9zaGFyZWRhcnJheScpO1xuaW1wb3J0IFJlY3J1aXRlclJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvcmVjcnVpdGVyLnJlcG9zaXRvcnknKTtcbmltcG9ydCBVc2Vyc0NsYXNzTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3VzZXJzJyk7XG5pbXBvcnQgQ2FuZGlkYXRlU2VydmljZSA9IHJlcXVpcmUoJy4vY2FuZGlkYXRlLnNlcnZpY2UnKTtcbmltcG9ydCBSZWNydWl0ZXJTZXJ2aWNlID0gcmVxdWlyZSgnLi9yZWNydWl0ZXIuc2VydmljZScpO1xuaW1wb3J0IEluZHVzdHJ5TW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL2luZHVzdHJ5Lm1vZGVsJyk7XG5pbXBvcnQgSW5kdXN0cnlSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2luZHVzdHJ5LnJlcG9zaXRvcnknKTtcbmltcG9ydCBDYW5kaWRhdGVNb2RlbENsYXNzID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9jYW5kaWRhdGVDbGFzcy5tb2RlbCcpO1xuaW1wb3J0IFJlY3J1aXRlckNsYXNzTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3JlY3J1aXRlckNsYXNzLm1vZGVsJyk7XG5pbXBvcnQgQ2FuZGlkYXRlQ2xhc3NNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvY2FuZGlkYXRlLWNsYXNzLm1vZGVsJyk7XG5pbXBvcnQgVXNlclNlcnZpY2UgPSByZXF1aXJlKFwiLi91c2VyLnNlcnZpY2VcIik7XG5sZXQgY29uZmlnID0gcmVxdWlyZSgnY29uZmlnJyk7XG5sZXQgZnMgPSByZXF1aXJlKCdmcycpO1xubGV0IHVzZXN0cmFja2luZyA9IHJlcXVpcmUoJ3VzZXMtdHJhY2tpbmcnKTtcbmxldCBzcGF3biA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5zcGF3bjtcblxubGV0IG1vbmdvRXhwb3J0ID0gY29uZmlnLmdldCgnVHBsU2VlZC5kYXRhYmFzZS5tb25nb0V4cG9ydCcpO1xubGV0IGRiID0gY29uZmlnLmdldCgnVHBsU2VlZC5kYXRhYmFzZS5uYW1lJyk7XG5sZXQgdXNlcm5hbWUgPSBjb25maWcuZ2V0KCdUcGxTZWVkLmRhdGFiYXNlLnVzZXJuYW1lJyk7XG5sZXQgcGFzc3dvcmQgPSBjb25maWcuZ2V0KCdUcGxTZWVkLmRhdGFiYXNlLnBhc3N3b3JkJyk7XG5cbmNsYXNzIEFkbWluU2VydmljZSB7XG4gIGNvbXBhbnlfbmFtZTogc3RyaW5nO1xuICBwcml2YXRlIHVzZXJSZXBvc2l0b3J5OiBVc2VyUmVwb3NpdG9yeTtcbiAgcHJpdmF0ZSBpbmR1c3RyeVJlcG9zaXRpcnk6IEluZHVzdHJ5UmVwb3NpdG9yeTtcbiAgcHJpdmF0ZSByZWNydWl0ZXJSZXBvc2l0b3J5OiBSZWNydWl0ZXJSZXBvc2l0b3J5O1xuICBwcml2YXRlIHVzZXNUcmFja2luZ0NvbnRyb2xsZXI6IGFueTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5ID0gbmV3IFVzZXJSZXBvc2l0b3J5KCk7XG4gICAgdGhpcy5pbmR1c3RyeVJlcG9zaXRpcnkgPSBuZXcgSW5kdXN0cnlSZXBvc2l0b3J5KCk7XG4gICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5ID0gbmV3IFJlY3J1aXRlclJlcG9zaXRvcnkoKTtcbiAgICBsZXQgb2JqOiBhbnkgPSBuZXcgdXNlc3RyYWNraW5nLk15Q29udHJvbGxlcigpO1xuICAgIHRoaXMudXNlc1RyYWNraW5nQ29udHJvbGxlciA9IG9iai5fY29udHJvbGxlcjtcbiAgfVxuXG4gIGdldENvdW50T2ZVc2VycyhpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcbiAgICB0cnkge1xuICAgICAgbGV0IGNhbmRpZGF0ZVNlcnZpY2UgPSBuZXcgQ2FuZGlkYXRlU2VydmljZSgpO1xuICAgICAgbGV0IHJlY3J1aXRlclNlcnZpY2UgPSBuZXcgUmVjcnVpdGVyU2VydmljZSgpO1xuICAgICAgbGV0IHVzZXJzOiBVc2Vyc0NsYXNzTW9kZWwgPSBuZXcgVXNlcnNDbGFzc01vZGVsKCk7XG4gICAgICBsZXQgZmluZFF1ZXJ5ID0gbmV3IE9iamVjdCgpO1xuXG4gICAgICBjYW5kaWRhdGVTZXJ2aWNlLmdldFRvdGFsQ2FuZGlkYXRlQ291bnQoKGVycm9yLCBjYW5kaWRhdGVDb3VudCkgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdXNlcnMudG90YWxOdW1iZXJPZkNhbmRpZGF0ZXMgPSBjYW5kaWRhdGVDb3VudDtcbiAgICAgICAgICByZWNydWl0ZXJTZXJ2aWNlLmdldFRvdGFsUmVjcnVpdGVyQ291bnQoKGVycm9yLCByZWNydWl0ZXJDb3VudCkgPT4ge1xuICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHVzZXJzLnRvdGFsTnVtYmVyT2ZSZWNydWl0ZXJzID0gcmVjcnVpdGVyQ291bnQ7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHVzZXJzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGNhdGNoXG4gICAgICAoZSkge1xuICAgICAgY2FsbGJhY2soZSwgbnVsbCk7XG4gICAgfVxuICB9O1xuXG4gIGdldFJlY3J1aXRlckRldGFpbHMoaW5pdGlhbDogc3RyaW5nLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgdHJ5IHtcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xuICAgICAgbGV0IHVzZXJzOiBVc2Vyc0NsYXNzTW9kZWwgPSBuZXcgVXNlcnNDbGFzc01vZGVsKCk7XG4gICAgICBsZXQgdXNlcnNNYXA6IE1hcDxhbnksIGFueT4gPSBuZXcgTWFwKCk7XG5cbiAgICAgIGxldCByZWNydWl0ZXJTZXJ2aWNlID0gbmV3IFJlY3J1aXRlclNlcnZpY2UoKTtcbiAgICAgIGxldCByZWNydWl0ZXJzOiBSZWNydWl0ZXJDbGFzc01vZGVsW10gPSBuZXcgQXJyYXkoMCk7XG5cbiAgICAgIGxldCByZWdFeCA9IG5ldyBSZWdFeHAoJ15bJyArIGluaXRpYWwudG9Mb3dlckNhc2UoKSArIGluaXRpYWwudG9VcHBlckNhc2UoKSArICddJyk7XG4gICAgICBsZXQgZmluZFF1ZXJ5ID0ge1xuICAgICAgICAnY29tcGFueV9uYW1lJzoge1xuICAgICAgICAgICRyZWdleDogcmVnRXhcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGV0IHNvcnRpbmdRdWVyeSA9IHsnY29tcGFueV9uYW1lJzogMSwgJ2NvbXBhbnlfc2l6ZSc6IDF9O1xuXG4gICAgICBsZXQgcmVjcnVpdGVyRmllbGRzID0ge1xuICAgICAgICAndXNlcklkJzogMSxcbiAgICAgICAgJ2NvbXBhbnlfbmFtZSc6IDEsXG4gICAgICAgICdjb21wYW55X3NpemUnOiAxLFxuICAgICAgICAncG9zdGVkSm9icy5pc0pvYlBvc3RlZCc6IDFcbiAgICAgIH07XG5cbiAgICAgIHJlY3J1aXRlclNlcnZpY2UucmV0cmlldmVCeVNvcnRlZE9yZGVyKGZpbmRRdWVyeSwgcmVjcnVpdGVyRmllbGRzLCBzb3J0aW5nUXVlcnksIChlcnJvciwgcmVjcnVpdGVyUmVzdWx0KSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1c2Vycy50b3RhbE51bWJlck9mUmVjcnVpdGVycyA9IHJlY3J1aXRlclJlc3VsdC5sZW5ndGg7XG4gICAgICAgICAgaWYgKHJlY3J1aXRlclJlc3VsdC5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXNlcnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCB1c2VyRmllbGRzID0ge1xuICAgICAgICAgICAgICAnX2lkJzogMSxcbiAgICAgICAgICAgICAgJ21vYmlsZV9udW1iZXInOiAxLFxuICAgICAgICAgICAgICAnZW1haWwnOiAxLFxuICAgICAgICAgICAgICAnaXNBY3RpdmF0ZWQnOiAxXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmb3IgKGxldCByZWNydWl0ZXIgb2YgcmVjcnVpdGVyUmVzdWx0KSB7XG4gICAgICAgICAgICAgIHVzZXJzTWFwLnNldChyZWNydWl0ZXIudXNlcklkLnRvU3RyaW5nKCksIHJlY3J1aXRlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1c2VyU2VydmljZS5yZXRyaWV2ZVdpdGhMZWFuKHsnaXNDYW5kaWRhdGUnOiBmYWxzZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZldGNoZWQgYWxsIHJlY3J1aXRlcnMgZnJvbSB1c2VyczpcIiArIHJlY3J1aXRlclJlc3VsdC5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHVzZXIgb2YgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICBpZiAodXNlcnNNYXAuZ2V0KHVzZXIuX2lkLnRvU3RyaW5nKCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXIuZGF0YSA9IHVzZXJzTWFwLmdldCh1c2VyLl9pZC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgcmVjcnVpdGVycy5wdXNoKHVzZXIpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHVzZXJzLnJlY3J1aXRlciA9IHJlY3J1aXRlcnM7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXNlcnMpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGNhdGNoXG4gICAgICAoZSkge1xuICAgICAgY2FsbGJhY2soZSwgbnVsbCk7XG4gICAgfVxuICB9O1xuXG4gIGdldENhbmRpZGF0ZURldGFpbHMoaW5pdGlhbDogc3RyaW5nLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgdHJ5IHtcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xuICAgICAgbGV0IHVzZXJzOiBVc2Vyc0NsYXNzTW9kZWwgPSBuZXcgVXNlcnNDbGFzc01vZGVsKCk7XG4gICAgICBsZXQgdXNlcnNNYXA6IE1hcDxhbnksIGFueT4gPSBuZXcgTWFwKCk7XG5cbiAgICAgIGxldCBjYW5kaWRhdGVzOiBDYW5kaWRhdGVNb2RlbENsYXNzW10gPSBuZXcgQXJyYXkoMCk7XG4gICAgICBsZXQgY2FuZGlkYXRlU2VydmljZSA9IG5ldyBDYW5kaWRhdGVTZXJ2aWNlKCk7XG5cbiAgICAgIGxldCByZWdFeCA9IG5ldyBSZWdFeHAoJ15bJyArIGluaXRpYWwudG9Mb3dlckNhc2UoKSArIGluaXRpYWwudG9VcHBlckNhc2UoKSArICddJyk7XG4gICAgICBsZXQgZmluZFF1ZXJ5ID0ge1xuICAgICAgICAnZmlyc3RfbmFtZSc6IHtcbiAgICAgICAgICAkcmVnZXg6IHJlZ0V4XG4gICAgICAgIH0sXG4gICAgICAgICdpc0FkbWluJzogZmFsc2UsXG4gICAgICAgICdpc0NhbmRpZGF0ZSc6IHRydWVcbiAgICAgIH07XG4gICAgICBsZXQgaW5jbHVkZWRfZmllbGRzID0ge1xuICAgICAgICAnX2lkJzogMSxcbiAgICAgICAgJ2ZpcnN0X25hbWUnOiAxLFxuICAgICAgICAnbGFzdF9uYW1lJzogMSxcbiAgICAgICAgJ21vYmlsZV9udW1iZXInOiAxLFxuICAgICAgICAnZW1haWwnOiAxLFxuICAgICAgICAnaXNBY3RpdmF0ZWQnOiAxXG4gICAgICB9O1xuICAgICAgbGV0IHNvcnRpbmdRdWVyeSA9IHsnZmlyc3RfbmFtZSc6IDEsICdsYXN0X25hbWUnOiAxfTtcblxuICAgICAgdXNlclNlcnZpY2UucmV0cmlldmVCeVNvcnRlZE9yZGVyKGZpbmRRdWVyeSwgaW5jbHVkZWRfZmllbGRzLCBzb3J0aW5nUXVlcnksIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1c2Vycy50b3RhbE51bWJlck9mQ2FuZGlkYXRlcyA9IHJlc3VsdC5sZW5ndGg7XG4gICAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXNlcnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IDA7XG4gICAgICAgICAgICBsZXQgY2FuZGlkYXRlRmllbGRzID0ge1xuICAgICAgICAgICAgICAndXNlcklkJzogMSxcbiAgICAgICAgICAgICAgJ2pvYlRpdGxlJzogMSxcbiAgICAgICAgICAgICAgJ2lzQ29tcGxldGVkJzogMSxcbiAgICAgICAgICAgICAgJ2lzU3VibWl0dGVkJzogMSxcbiAgICAgICAgICAgICAgJ2lzVmlzaWJsZSc6IDEsXG4gICAgICAgICAgICAgICdsb2NhdGlvbi5jaXR5JzogMVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNhbmRpZGF0ZVNlcnZpY2UucmV0cmlldmVXaXRoTGVhbih7fSwgY2FuZGlkYXRlRmllbGRzLCAoZXJyb3IsIGNhbmRpZGF0ZXNSZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmV0Y2hlZCBhbGwgY2FuZGlkYXRlczpcIiArIGNhbmRpZGF0ZXNSZXN1bHQubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjYW5kaWRhdGUgb2YgY2FuZGlkYXRlc1Jlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgdXNlcnNNYXAuc2V0KGNhbmRpZGF0ZS51c2VySWQudG9TdHJpbmcoKSwgY2FuZGlkYXRlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCB1c2VyIG9mIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgdXNlci5kYXRhID0gdXNlcnNNYXAuZ2V0KHVzZXIuX2lkLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgY2FuZGlkYXRlcy5wdXNoKHVzZXIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHVzZXJzLmNhbmRpZGF0ZSA9IGNhbmRpZGF0ZXM7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXNlcnMpO1xuXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjYWxsYmFjayhlLCBudWxsKTtcbiAgICB9XG4gIH07XG5cbiAgc2VuZEFkbWluTG9naW5JbmZvTWFpbChmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgbGV0IGhlYWRlcjEgPSBmcy5yZWFkRmlsZVN5bmMoJy4vc3JjL3NlcnZlci9hcHAvZnJhbWV3b3JrL3B1YmxpYy9oZWFkZXIxLmh0bWwnKS50b1N0cmluZygpO1xuICAgIGxldCBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKCcuL3NyYy9zZXJ2ZXIvYXBwL2ZyYW1ld29yay9wdWJsaWMvYWRtaW5sb2dpbmluZm8ubWFpbC5odG1sJykudG9TdHJpbmcoKTtcbiAgICBsZXQgZm9vdGVyMSA9IGZzLnJlYWRGaWxlU3luYygnLi9zcmMvc2VydmVyL2FwcC9mcmFtZXdvcmsvcHVibGljL2Zvb3RlcjEuaHRtbCcpLnRvU3RyaW5nKCk7XG4gICAgbGV0IG1pZF9jb250ZW50ID0gY29udGVudC5yZXBsYWNlKCckZW1haWwkJywgZmllbGQuZW1haWwpLnJlcGxhY2UoJyRhZGRyZXNzJCcsIChmaWVsZC5sb2NhdGlvbiA9PT0gdW5kZWZpbmVkKSA/ICdOb3QgRm91bmQnIDogZmllbGQubG9jYXRpb24pXG4gICAgICAucmVwbGFjZSgnJGlwJCcsIGZpZWxkLmlwKS5yZXBsYWNlKCckaG9zdCQnLCBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuaG9zdCcpKTtcblxuXG4gICAgbGV0IG1haWxPcHRpb25zID0ge1xuICAgICAgZnJvbTogY29uZmlnLmdldCgnVHBsU2VlZC5tYWlsLk1BSUxfU0VOREVSJyksXG4gICAgICB0bzogY29uZmlnLmdldCgnVHBsU2VlZC5tYWlsLkFETUlOX01BSUwnKSxcbiAgICAgIGNjOiBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuVFBMR1JPVVBfTUFJTCcpLFxuICAgICAgc3ViamVjdDogTWVzc2FnZXMuRU1BSUxfU1VCSkVDVF9BRE1JTl9MT0dHRURfT04gKyBcIiBcIiArIGNvbmZpZy5nZXQoJ1RwbFNlZWQubWFpbC5ob3N0JyksXG4gICAgICBodG1sOiBoZWFkZXIxICsgbWlkX2NvbnRlbnQgKyBmb290ZXIxXG4gICAgICAsIGF0dGFjaG1lbnRzOiBNYWlsQXR0YWNobWVudHMuQXR0YWNobWVudEFycmF5XG4gICAgfVxuICAgIGxldCBzZW5kTWFpbFNlcnZpY2UgPSBuZXcgU2VuZE1haWxTZXJ2aWNlKCk7XG4gICAgc2VuZE1haWxTZXJ2aWNlLnNlbmRNYWlsKG1haWxPcHRpb25zLCBjYWxsYmFjayk7XG5cbiAgfTtcblxuICB1cGRhdGVVc2VyKF9pZDogc3RyaW5nLCBpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmZpbmRCeUlkKF9pZCwgKGVycjogYW55LCByZXM6IGFueSkgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjYWxsYmFjayhlcnIsIHJlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnVwZGF0ZShyZXMuX2lkLCBpdGVtLCBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgZXhwb3J0Q29sbGVjdGlvbihjb2xsZWN0aW9uVHlwZTogc3RyaW5nLCBmaWVsZHM6IHN0cmluZywgZG93bmxvYWRMb2NhdGlvbjogc3RyaW5nLCBxdWVyeTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczogYW55KSA9PiB2b2lkKSB7XG4gICAgY29uc29sZS5sb2coXCJpbnNpZGUgXCIgKyBjb2xsZWN0aW9uVHlwZSArIFwiY29sbGVjdGlvblwiKTtcbiAgICBsZXQgc3RkZXJyOiBhbnkgPSAnJztcbiAgICBsZXQgY2hpbGRQcm9jZXNzOiBhbnk7XG5cbiAgICBpZiAodXNlcm5hbWUgPT0gXCJcIikge1xuICAgICAgY2hpbGRQcm9jZXNzID0gc3Bhd24oJ21vbmdvZXhwb3J0JywgWyctLWRiJywgZGIsICctLWNvbGxlY3Rpb24nLCBjb2xsZWN0aW9uVHlwZSwgJy0tdHlwZScsICdjc3YnLCAnLS1maWVsZHMnLCBmaWVsZHMsXG4gICAgICAgICctLW91dCcsIGRvd25sb2FkTG9jYXRpb24sICctLXF1ZXJ5JywgcXVlcnldKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2hpbGRQcm9jZXNzID0gc3Bhd24oJ21vbmdvZXhwb3J0JywgWyctLXVzZXJuYW1lJywgdXNlcm5hbWUsICctLXBhc3N3b3JkJywgcGFzc3dvcmQsICctLWRiJywgZGIsICctLWNvbGxlY3Rpb24nLFxuICAgICAgICBjb2xsZWN0aW9uVHlwZSwgJy0tdHlwZScsICdjc3YnLCAnLS1maWVsZHMnLCBmaWVsZHMsICctLW91dCcsIGRvd25sb2FkTG9jYXRpb24sICctLXF1ZXJ5JywgcXVlcnldKTtcbiAgICB9XG5cblxuICAgIGNoaWxkUHJvY2Vzcy5vbignZXhpdCcsIGZ1bmN0aW9uIChjb2RlOiBhbnkpIHtcbiAgICAgIGlmIChjb2RlICE9IDApIHtcbiAgICAgICAgY2hpbGRQcm9jZXNzLmtpbGwoKTtcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKCksIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coY29sbGVjdGlvblR5cGUgKyAnIHByb2Nlc3MgY2xvc2VkIHdpdGggY29kZSAnICsgY29kZSk7XG4gICAgICAgIGNoaWxkUHJvY2Vzcy5raWxsKCk7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsICdzdWNjZXNzJyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjaGlsZFByb2Nlc3Muc3RkZXJyLm9uKCdkYXRhJywgZnVuY3Rpb24gKGJ1ZjogYW55KSB7XG4gICAgICBjb25zb2xlLmxvZygnW1NUUl0gc3RkZXJyIFwiJXNcIicsIFN0cmluZyhidWYpKTtcbiAgICAgIHN0ZGVyciArPSBidWY7XG4gICAgfSk7XG4gIH1cblxuICBleHBvcnRDYW5kaWRhdGVDb2xsZWN0aW9uKGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczogYW55KSA9PiB2b2lkKSB7XG4gICAgbGV0IGZpZWxkcyA9ICdfaWQsdXNlcklkLGpvYl9saXN0LHByb2ZpY2llbmNpZXMsZW1wbG95bWVudEhpc3RvcnksYWNhZGVtaWNzLGluZHVzdHJ5LGF3YXJkcyxpbnRlcmVzdGVkSW5kdXN0cmllcywnICtcbiAgICAgICdjZXJ0aWZpY2F0aW9ucyxwcm9maWxlX3VwZGF0ZV90cmFja2luZyxpc1Zpc2libGUsaXNTdWJtaXR0ZWQsaXNDb21wbGV0ZWQsY29tcGxleGl0eV9ub3RlX21hdHJpeCwnICtcbiAgICAgICdwcm9mZXNzaW9uYWxEZXRhaWxzLGFib3V0TXlzZWxmLGpvYlRpdGxlLGxvY2F0aW9uLGxhc3RVcGRhdGVBdCc7XG5cbiAgICBsZXQgZG93bmxvYWRMb2NhdGlvbiA9IGNvbmZpZy5nZXQoJ1RwbFNlZWQuYWRtaW5FeHBvcnRGaWxlUGF0aC5jYW5kaWRhdGVzQ1NWJyk7XG5cbiAgICB0aGlzLmV4cG9ydENvbGxlY3Rpb24oXCJjYW5kaWRhdGVzXCIsIGZpZWxkcywgZG93bmxvYWRMb2NhdGlvbiwgJ3t9JywgKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgJ3N1Y2Nlc3MnKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICB9XG5cbiAgZXhwb3J0Q2FuZGlkYXRlT3RoZXJEZXRhaWxzQ29sbGVjdGlvbihjYWxsYmFjazogKGVycjogYW55LCByZXM6IGFueSkgPT4gdm9pZCkge1xuICAgIGxldCBmaWVsZHMgPSAndXNlcklkLGNhcGFiaWxpdHlfbWF0cml4JztcblxuICAgIGxldCBkb3dubG9hZExvY2F0aW9uID0gY29uZmlnLmdldCgnVHBsU2VlZC5hZG1pbkV4cG9ydEZpbGVQYXRoLmNhbmRpZGF0ZU90aGVyRGV0YWlsc0NTVicpO1xuXG4gICAgdGhpcy5leHBvcnRDb2xsZWN0aW9uKFwiY2FuZGlkYXRlc1wiLCBmaWVsZHMsIGRvd25sb2FkTG9jYXRpb24sICd7fScsIChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsICdzdWNjZXNzJyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBleHBvcnRVc2VyQ29sbGVjdGlvbih1c2VyVHlwZTogc3RyaW5nLCBjYWxsYmFjazogKGVycjogYW55LCByZXM6IGFueSkgPT4gdm9pZCkge1xuICAgIGxldCBmaWVsZHM6IHN0cmluZztcbiAgICBsZXQgcXVlcnk6IHN0cmluZztcbiAgICBsZXQgZG93bmxvYWRMb2NhdGlvbiA9IGNvbmZpZy5nZXQoJ1RwbFNlZWQuYWRtaW5FeHBvcnRGaWxlUGF0aC51c2Vyc0NTVicpO1xuXG4gICAgaWYgKHVzZXJUeXBlID09ICdjYW5kaWRhdGUnKSB7XG4gICAgICBmaWVsZHMgPSAnX2lkLGZpcnN0X25hbWUsbGFzdF9uYW1lLG1vYmlsZV9udW1iZXIsZW1haWwsY3VycmVudF90aGVtZSxpc0NhbmRpZGF0ZSxndWlkZV90b3VyLG5vdGlmaWNhdGlvbnMsJyArXG4gICAgICAgICdpc0FkbWluLG90cCxpc0FjdGl2YXRlZCx0ZW1wX21vYmlsZSdcbiAgICAgIHF1ZXJ5ID0gJ3tcImlzQ2FuZGlkYXRlXCI6dHJ1ZX0nO1xuICAgIH0gZWxzZSB7XG4gICAgICBmaWVsZHMgPSAnX2lkLG1vYmlsZV9udW1iZXIsZW1haWwsY3VycmVudF90aGVtZSxpc0NhbmRpZGF0ZSxndWlkZV90b3VyLG5vdGlmaWNhdGlvbnMsaXNBZG1pbixvdHAsaXNBY3RpdmF0ZWQsJyArXG4gICAgICAgICd0ZW1wX21vYmlsZSxsb2NhdGlvbixwaWN0dXJlJyxcbiAgICAgICAgcXVlcnkgPSAne1wiaXNDYW5kaWRhdGVcIjpmYWxzZX0nO1xuICAgIH1cblxuICAgIHRoaXMuZXhwb3J0Q29sbGVjdGlvbihcInVzZXJzXCIsIGZpZWxkcywgZG93bmxvYWRMb2NhdGlvbiwgcXVlcnksIChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsICdzdWNjZXNzJyk7XG4gICAgICB9XG4gICAgfSk7XG5cblxuICB9XG5cbiAgZXhwb3J0UmVjcnVpdGVyQ29sbGVjdGlvbihjYWxsYmFjazogKGVycjogYW55LCByZXM6IGFueSkgPT4gdm9pZCkge1xuICAgIGxldCBmaWVsZHMgPSAnX2lkLHVzZXJJZCxpc1JlY3J1aXRpbmdGb3JzZWxmLGNvbXBhbnlfbmFtZSxjb21wYW55X3NpemUsY29tcGFueV93ZWJzaXRlLHBvc3RlZEpvYnMsc2V0T2ZEb2N1bWVudHMsJyArXG4gICAgICAnY29tcGFueV9sb2dvJ1xuXG4gICAgbGV0IGRvd25sb2FkTG9jYXRpb24gPSBjb25maWcuZ2V0KCdUcGxTZWVkLmFkbWluRXhwb3J0RmlsZVBhdGgucmVjcnVpdGVyc0NTVicpO1xuXG4gICAgdGhpcy5leHBvcnRDb2xsZWN0aW9uKFwicmVjcnVpdGVyc1wiLCBmaWVsZHMsIGRvd25sb2FkTG9jYXRpb24sICd7fScsIChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsICdzdWNjZXNzJyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgfVxuXG4gIGV4cG9ydFVzYWdlRGV0YWlsc0NvbGxlY3Rpb24oY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHZvaWQpIHtcbiAgICBsZXQgZmllbGRzID0gJ19pZCxjYW5kaWRhdGVJZCxqb2JQcm9maWxlSWQsdGltZXN0YW1wLGFjdGlvbixfX3YnO1xuICAgIGxldCBkb3dubG9hZExvY2F0aW9uID0gY29uZmlnLmdldCgnVHBsU2VlZC5hZG1pbkV4cG9ydEZpbGVQYXRoLnVzYWdlRGV0YWlsc0NTVicpO1xuXG4gICAgdGhpcy5leHBvcnRDb2xsZWN0aW9uKFwidXNlc3RyYWNraW5nc1wiLCBmaWVsZHMsIGRvd25sb2FkTG9jYXRpb24sICd7fScsIChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4ge1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsICdzdWNjZXNzJyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgfVxuXG4gIGV4cG9ydEtleVNraWxsc0NvbGxlY3Rpb24oY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHZvaWQpIHtcbiAgICBsZXQgZmllbGRzID0gJ19pZCxwcm9maWNpZW5jaWVzJztcbiAgICBsZXQgZG93bmxvYWRMb2NhdGlvbiA9IGNvbmZpZy5nZXQoJ1RwbFNlZWQuYWRtaW5FeHBvcnRGaWxlUGF0aC5rZXlTa2lsbHNDU1YnKTtcblxuICAgIHRoaXMuZXhwb3J0Q29sbGVjdGlvbihcInByb2ZpY2llbmNpZXNcIiwgZmllbGRzLCBkb3dubG9hZExvY2F0aW9uLCAne30nLCAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayhudWxsLCAnc3VjY2VzcycpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gIH1cblxufVxuXG5PYmplY3Quc2VhbChBZG1pblNlcnZpY2UpO1xuZXhwb3J0ID0gQWRtaW5TZXJ2aWNlO1xuIl19
