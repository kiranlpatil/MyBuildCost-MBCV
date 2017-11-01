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
var mongoExport = '/usr/bin/mongoexport';
var db = 'Jobmosis-staging';
var username = 'admin';
var password = 'jobmosisadmin123';
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
    AdminService.prototype.exportCandidateCollection = function (callback) {
        console.log("inside exportCandidateCollection");
        var stderr = '';
        var candidateChild = spawn('mongoexport', ['--username', username, '--password', password, '--db', db, '--collection', 'candidates', '--type', 'csv', '--fields', '_id,userId,job_list,proficiencies,employmentHistory,academics,industry,awards,interestedIndustries,certifications,profile_update_tracking,isVisible,isSubmitted,isCompleted,complexity_note_matrix,professionalDetails,aboutMyself,jobTitle,location,lastUpdateAt', '--out', '/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/candidates.csv']);
        candidateChild.on('exit', function (code) {
            if (code != 0) {
                candidateChild.kill();
                callback(new Error(), null);
            }
            else {
                console.log('candidateChild process closed with code ' + code);
                candidateChild.kill();
                callback(null, 'success');
            }
        });
        candidateChild.stderr.on('data', function (buf) {
            console.log('[STR] stderr "%s"', String(buf));
            stderr += buf;
        });
    };
    AdminService.prototype.exportCandidateOtherDetailsCollection = function (callback) {
        console.log("inside exportCandidateDetailsCollection");
        var stderr = '';
        var candidateOtherDetailsChild = spawn('mongoexport', ['--username', username, '--password', password, '--db', db, '--collection', 'candidates', '--type', 'csv', '--fields', 'userId,capability_matrix', '--out', '/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/candidates-other-details.csv']);
        candidateOtherDetailsChild.on('exit', function (code) {
            if (code != 0) {
                candidateOtherDetailsChild.kill();
                callback(new Error(), null);
            }
            else {
                console.log('candidateOtherDetailsChild process closed with code ' + code);
                candidateOtherDetailsChild.kill();
                callback(null, 'success');
            }
        });
        candidateOtherDetailsChild.stderr.on('data', function (buf) {
            console.log('[STR] stderr "%s"', String(buf));
            stderr += buf;
        });
    };
    AdminService.prototype.exportUserCollection = function (userType, callback) {
        console.log("inside exportUserCollection");
        var userChild;
        var stderr = '';
        if (userType == 'candidate') {
            userChild = spawn('mongoexport', ['--username', username, '--password', password, '--db', db, '--collection', 'users', '--type', 'csv', '--fields', '_id,first_name,last_name,mobile_number,email,current_theme,isCandidate,guide_tour,notifications,complexityIsMustHave,isAdmin,otp,isActivated,temp_mobile', '--out', '/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/users.csv', '--query', '{"isCandidate":true}']);
        }
        else {
            userChild = spawn('mongoexport', ['--username', username, '--password', password, '--db', db, '--collection', 'users', '--type', 'csv', '--fields', '_id,mobile_number,email,current_theme,isCandidate,guide_tour,notifications,isAdmin,otp,isActivated,temp_mobile,location,picture', '--out', '/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/users.csv', '--query', '{"isCandidate":false}']);
        }
        userChild.on('exit', function (code) {
            if (code != 0) {
                userChild.kill();
                callback(new Error(), null);
            }
            else {
                console.log('userChild process closed with code ' + code);
                userChild.kill();
                callback(null, 'success');
            }
        });
        userChild.stderr.on('data', function (buf) {
            console.log('[STR] stderr "%s"', String(buf));
            stderr += buf;
        });
    };
    AdminService.prototype.exportRecruiterCollection = function (callback) {
        console.log("inside exportRecruiterCollection");
        var stderr = '';
        var recruiterChild = spawn('mongoexport', ['--username', username, '--password', password, '--db', db, '--collection', 'recruiters', '--type', 'csv', '--fields', '_id,userId,isRecruitingForself,company_name,company_size,company_website,postedJobs,setOfDocuments,company_logo', '--out', '/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/recruiters.csv']);
        recruiterChild.on('exit', function (code) {
            if (code != 0) {
                recruiterChild.kill();
                callback(new Error(), null);
            }
            else {
                console.log('recruiterChild process closed with code ' + code);
                recruiterChild.kill();
                callback(null, 'success');
            }
        });
        recruiterChild.stderr.on('data', function (buf) {
            console.log('[STR] stderr "%s"', String(buf));
            stderr += buf;
        });
    };
    AdminService.prototype.exportUsageDetailsCollection = function (callback) {
        console.log("inside exportUsageDetailsCollection");
        var stderr = '';
        var usageDetailsChild = spawn('mongoexport', ['--username', username, '--password', password, '--db', db, '--collection', 'usestrackings', '--type', 'csv', '--fields', '_id,candidateId,jobProfileId,timestamp,action,__v', '--out', '/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/usagedetail.csv']);
        usageDetailsChild.on('exit', function (code) {
            if (code != 0) {
                usageDetailsChild.kill();
                callback(new Error(), null);
            }
            else {
                console.log('usageDetailsChild process closed with code ' + code);
                usageDetailsChild.kill();
                callback(null, 'success');
            }
        });
        usageDetailsChild.stderr.on('data', function (buf) {
            console.log('[STR] stderr "%s"', String(buf));
            stderr += buf;
        });
    };
    return AdminService;
}());
Object.seal(AdminService);
module.exports = AdminService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvYWRtaW4uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBR0EseUVBQTRFO0FBQzVFLG9EQUF1RDtBQUN2RCw2Q0FBZ0Q7QUFDaEQsdURBQTBEO0FBQzFELG1GQUFzRjtBQUN0RiwyREFBOEQ7QUFDOUQsc0RBQXlEO0FBQ3pELHNEQUF5RDtBQUV6RCxpRkFBb0Y7QUFJcEYsNENBQStDO0FBQy9DLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzVDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFFM0MsSUFBSSxXQUFXLEdBQUcsc0JBQXNCLENBQUM7QUFFekMsSUFBSSxFQUFFLEdBQUcsa0JBQWtCLENBQUM7QUFFNUIsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLElBQUksUUFBUSxHQUFHLGtCQUFrQixDQUFDO0FBRWxDO0lBT0U7UUFDRSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztRQUNuRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1FBQ3JELElBQUksR0FBRyxHQUFRLElBQUksWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQy9DLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDO0lBQ2hELENBQUM7SUFFRCxzQ0FBZSxHQUFmLFVBQWdCLElBQVMsRUFBRSxRQUEyQztRQUNwRSxJQUFJLENBQUM7WUFDSCxJQUFJLGdCQUFnQixHQUFHLElBQUksZ0JBQWdCLEVB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QUM5QixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sT0FBTyxDQUFDLEdBQUcsQ0FBQyw2Q0FBNkMsR0FBRyxJQUFJLENBQUMsQ0FBQztnQkFDbEUsaUJBQWlCLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3pCLFFBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDNUIsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBVSxHQUFRO1lBQ3BELE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDOUMsTUFBTSxJQUFJLEdBQUcsQ0FBQztRQUNoQixDQUFDLENBQUMsQ0FBQztJQUVMLENBQUM7SUFFSCxtQkFBQztBQUFELENBcFdBLEFBb1dDLElBQUE7QUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzFCLGlCQUFTLFlBQVksQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL3NlcnZpY2VzL2FkbWluLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQ3JlYXRlZCBieSB0ZWNocHJpbWUwMDIgb24gOC8yOC8yMDE3LlxyXG4gKi9cclxuaW1wb3J0IFVzZXJSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L3VzZXIucmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgU2VuZE1haWxTZXJ2aWNlID0gcmVxdWlyZSgnLi9zZW5kbWFpbC5zZXJ2aWNlJyk7XHJcbmltcG9ydCBNZXNzYWdlcyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9tZXNzYWdlcycpO1xyXG5pbXBvcnQgTWFpbEF0dGFjaG1lbnRzID0gcmVxdWlyZSgnLi4vc2hhcmVkL3NoYXJlZGFycmF5Jyk7XHJcbmltcG9ydCBSZWNydWl0ZXJSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L3JlY3J1aXRlci5yZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBVc2Vyc0NsYXNzTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3VzZXJzJyk7XHJcbmltcG9ydCBDYW5kaWRhdGVTZXJ2aWNlID0gcmVxdWlyZSgnLi9jYW5kaWRhdGUuc2VydmljZScpO1xyXG5pbXBvcnQgUmVjcnVpdGVyU2VydmljZSA9IHJlcXVpcmUoJy4vcmVjcnVpdGVyLnNlcnZpY2UnKTtcclxuaW1wb3J0IEluZHVzdHJ5TW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL2luZHVzdHJ5Lm1vZGVsJyk7XHJcbmltcG9ydCBJbmR1c3RyeVJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvaW5kdXN0cnkucmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgQ2FuZGlkYXRlTW9kZWxDbGFzcyA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvY2FuZGlkYXRlQ2xhc3MubW9kZWwnKTtcclxuaW1wb3J0IFJlY3J1aXRlckNsYXNzTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3JlY3J1aXRlckNsYXNzLm1vZGVsJyk7XHJcbmltcG9ydCBDYW5kaWRhdGVDbGFzc01vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9jYW5kaWRhdGUtY2xhc3MubW9kZWwnKTtcclxuaW1wb3J0IFVzZXJTZXJ2aWNlID0gcmVxdWlyZShcIi4vdXNlci5zZXJ2aWNlXCIpO1xyXG5sZXQgY29uZmlnID0gcmVxdWlyZSgnY29uZmlnJyk7XHJcbmxldCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XHJcbmxldCB1c2VzdHJhY2tpbmcgPSByZXF1aXJlKCd1c2VzLXRyYWNraW5nJyk7XHJcbmxldCBzcGF3biA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5zcGF3bjtcclxuXHJcbmxldCBtb25nb0V4cG9ydCA9ICcvdXNyL2Jpbi9tb25nb2V4cG9ydCc7XHJcbi8vL2xldCBkYiA9IGNvbmZpZy5nZXQoJ1RwbFNlZWQuZGF0YWJhc2UubmFtZScpO1xyXG5sZXQgZGIgPSAnSm9ibW9zaXMtc3RhZ2luZyc7XHJcbi8vbGV0IGRiID0gJ2MtbmV4dC1iYWNrZW5kJztcclxubGV0IHVzZXJuYW1lID0gJ2FkbWluJztcclxubGV0IHBhc3N3b3JkID0gJ2pvYm1vc2lzYWRtaW4xMjMnO1xyXG5cclxuY2xhc3MgQWRtaW5TZXJ2aWNlIHtcclxuICBjb21wYW55X25hbWU6IHN0cmluZztcclxuICBwcml2YXRlIHVzZXJSZXBvc2l0b3J5OiBVc2VyUmVwb3NpdG9yeTtcclxuICBwcml2YXRlIGluZHVzdHJ5UmVwb3NpdGlyeTogSW5kdXN0cnlSZXBvc2l0b3J5O1xyXG4gIHByaXZhdGUgcmVjcnVpdGVyUmVwb3NpdG9yeTogUmVjcnVpdGVyUmVwb3NpdG9yeTtcclxuICBwcml2YXRlIHVzZXNUcmFja2luZ0NvbnRyb2xsZXI6IGFueTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5ID0gbmV3IFVzZXJSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLmluZHVzdHJ5UmVwb3NpdGlyeSA9IG5ldyBJbmR1c3RyeVJlcG9zaXRvcnkoKTtcclxuICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeSA9IG5ldyBSZWNydWl0ZXJSZXBvc2l0b3J5KCk7XHJcbiAgICBsZXQgb2JqOiBhbnkgPSBuZXcgdXNlc3RyYWNraW5nLk15Q29udHJvbGxlcigpO1xyXG4gICAgdGhpcy51c2VzVHJhY2tpbmdDb250cm9sbGVyID0gb2JqLl9jb250cm9sbGVyO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q291bnRPZlVzZXJzKGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IGNhbmRpZGF0ZVNlcnZpY2UgPSBuZXcgQ2FuZGlkYXRlU2VydmljZSgpO1xyXG4gICAgICBsZXQgcmVjcnVpdGVyU2VydmljZSA9IG5ldyBSZWNydWl0ZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCB1c2VyczogVXNlcnNDbGFzc01vZGVsID0gbmV3IFVzZXJzQ2xhc3NNb2RlbCgpO1xyXG4gICAgICBsZXQgZmluZFF1ZXJ5ID0gbmV3IE9iamVjdCgpO1xyXG5cclxuICAgICAgY2FuZGlkYXRlU2VydmljZS5nZXRUb3RhbENhbmRpZGF0ZUNvdW50KChlcnJvciwgY2FuZGlkYXRlQ291bnQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdXNlcnMudG90YWxOdW1iZXJPZkNhbmRpZGF0ZXMgPSBjYW5kaWRhdGVDb3VudDtcclxuICAgICAgICAgIHJlY3J1aXRlclNlcnZpY2UuZ2V0VG90YWxSZWNydWl0ZXJDb3VudCgoZXJyb3IsIHJlY3J1aXRlckNvdW50KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB1c2Vycy50b3RhbE51bWJlck9mUmVjcnVpdGVycyA9IHJlY3J1aXRlckNvdW50O1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHVzZXJzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGNhdGNoXHJcbiAgICAgIChlKSB7XHJcbiAgICAgIGNhbGxiYWNrKGUsIG51bGwpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGdldFJlY3J1aXRlckRldGFpbHMoaW5pdGlhbDogc3RyaW5nLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgbGV0IHVzZXJzOiBVc2Vyc0NsYXNzTW9kZWwgPSBuZXcgVXNlcnNDbGFzc01vZGVsKCk7XHJcbiAgICAgIGxldCB1c2Vyc01hcDogTWFwPGFueSwgYW55PiA9IG5ldyBNYXAoKTtcclxuXHJcbiAgICAgIGxldCByZWNydWl0ZXJTZXJ2aWNlID0gbmV3IFJlY3J1aXRlclNlcnZpY2UoKTtcclxuICAgICAgbGV0IHJlY3J1aXRlcnM6IFJlY3J1aXRlckNsYXNzTW9kZWxbXSA9IG5ldyBBcnJheSgwKTtcclxuXHJcbiAgICAgIGxldCByZWdFeCA9IG5ldyBSZWdFeHAoJ15bJyArIGluaXRpYWwudG9Mb3dlckNhc2UoKSArIGluaXRpYWwudG9VcHBlckNhc2UoKSArICddJyk7XHJcbiAgICAgIGxldCBmaW5kUXVlcnkgPSB7XHJcbiAgICAgICAgJ2NvbXBhbnlfbmFtZSc6IHtcclxuICAgICAgICAgICRyZWdleDogcmVnRXhcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgbGV0IHNvcnRpbmdRdWVyeSA9IHsnY29tcGFueV9uYW1lJzogMSwgJ2NvbXBhbnlfc2l6ZSc6IDF9O1xyXG5cclxuICAgICAgbGV0IHJlY3J1aXRlckZpZWxkcyA9IHtcclxuICAgICAgICAndXNlcklkJzogMSxcclxuICAgICAgICAnY29tcGFueV9uYW1lJzogMSxcclxuICAgICAgICAnY29tcGFueV9zaXplJzogMSxcclxuICAgICAgICAncG9zdGVkSm9icy5pc0pvYlBvc3RlZCc6IDFcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHJlY3J1aXRlclNlcnZpY2UucmV0cmlldmVCeVNvcnRlZE9yZGVyKGZpbmRRdWVyeSwgcmVjcnVpdGVyRmllbGRzLCBzb3J0aW5nUXVlcnksIChlcnJvciwgcmVjcnVpdGVyUmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHVzZXJzLnRvdGFsTnVtYmVyT2ZSZWNydWl0ZXJzID0gcmVjcnVpdGVyUmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICAgIGlmIChyZWNydWl0ZXJSZXN1bHQubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXNlcnMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCB1c2VyRmllbGRzID0ge1xyXG4gICAgICAgICAgICAgICdfaWQnOiAxLFxyXG4gICAgICAgICAgICAgICdtb2JpbGVfbnVtYmVyJzogMSxcclxuICAgICAgICAgICAgICAnZW1haWwnOiAxLFxyXG4gICAgICAgICAgICAgICdpc0FjdGl2YXRlZCc6IDFcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IHJlY3J1aXRlciBvZiByZWNydWl0ZXJSZXN1bHQpIHtcclxuICAgICAgICAgICAgICB1c2Vyc01hcC5zZXQocmVjcnVpdGVyLnVzZXJJZC50b1N0cmluZygpLCByZWNydWl0ZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHVzZXJTZXJ2aWNlLnJldHJpZXZlV2l0aExlYW4oeydpc0NhbmRpZGF0ZSc6IGZhbHNlfSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGZXRjaGVkIGFsbCByZWNydWl0ZXJzIGZyb20gdXNlcnM6XCIgKyByZWNydWl0ZXJSZXN1bHQubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHVzZXIgb2YgcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmICh1c2Vyc01hcC5nZXQodXNlci5faWQudG9TdHJpbmcoKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB1c2VyLmRhdGEgPSB1c2Vyc01hcC5nZXQodXNlci5faWQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVjcnVpdGVycy5wdXNoKHVzZXIpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdXNlcnMucmVjcnVpdGVyID0gcmVjcnVpdGVycztcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHVzZXJzKTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY2F0Y2hcclxuICAgICAgKGUpIHtcclxuICAgICAgY2FsbGJhY2soZSwgbnVsbCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgZ2V0Q2FuZGlkYXRlRGV0YWlscyhpbml0aWFsOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICBsZXQgdXNlcnM6IFVzZXJzQ2xhc3NNb2RlbCA9IG5ldyBVc2Vyc0NsYXNzTW9kZWwoKTtcclxuICAgICAgbGV0IHVzZXJzTWFwOiBNYXA8YW55LCBhbnk+ID0gbmV3IE1hcCgpO1xyXG5cclxuICAgICAgbGV0IGNhbmRpZGF0ZXM6IENhbmRpZGF0ZU1vZGVsQ2xhc3NbXSA9IG5ldyBBcnJheSgwKTtcclxuICAgICAgbGV0IGNhbmRpZGF0ZVNlcnZpY2UgPSBuZXcgQ2FuZGlkYXRlU2VydmljZSgpO1xyXG5cclxuICAgICAgbGV0IHJlZ0V4ID0gbmV3IFJlZ0V4cCgnXlsnICsgaW5pdGlhbC50b0xvd2VyQ2FzZSgpICsgaW5pdGlhbC50b1VwcGVyQ2FzZSgpICsgJ10nKTtcclxuICAgICAgbGV0IGZpbmRRdWVyeSA9IHtcclxuICAgICAgICAnZmlyc3RfbmFtZSc6IHtcclxuICAgICAgICAgICRyZWdleDogcmVnRXhcclxuICAgICAgICB9LFxyXG4gICAgICAgICdpc0FkbWluJzogZmFsc2UsXHJcbiAgICAgICAgJ2lzQ2FuZGlkYXRlJzogdHJ1ZVxyXG4gICAgICB9O1xyXG4gICAgICBsZXQgaW5jbHVkZWRfZmllbGRzID0ge1xyXG4gICAgICAgICdfaWQnOiAxLFxyXG4gICAgICAgICdmaXJzdF9uYW1lJzogMSxcclxuICAgICAgICAnbGFzdF9uYW1lJzogMSxcclxuICAgICAgICAnbW9iaWxlX251bWJlcic6IDEsXHJcbiAgICAgICAgJ2VtYWlsJzogMSxcclxuICAgICAgICAnaXNBY3RpdmF0ZWQnOiAxXHJcbiAgICAgIH07XHJcbiAgICAgIGxldCBzb3J0aW5nUXVlcnkgPSB7J2ZpcnN0X25hbWUnOiAxLCAnbGFzdF9uYW1lJzogMX07XHJcblxyXG4gICAgICB1c2VyU2VydmljZS5yZXRyaWV2ZUJ5U29ydGVkT3JkZXIoZmluZFF1ZXJ5LCBpbmNsdWRlZF9maWVsZHMsIHNvcnRpbmdRdWVyeSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdXNlcnMudG90YWxOdW1iZXJPZkNhbmRpZGF0ZXMgPSByZXN1bHQubGVuZ3RoO1xyXG4gICAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB1c2Vycyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gMDtcclxuICAgICAgICAgICAgbGV0IGNhbmRpZGF0ZUZpZWxkcyA9IHtcclxuICAgICAgICAgICAgICAndXNlcklkJzogMSxcclxuICAgICAgICAgICAgICAnam9iVGl0bGUnOiAxLFxyXG4gICAgICAgICAgICAgICdpc0NvbXBsZXRlZCc6IDEsXHJcbiAgICAgICAgICAgICAgJ2lzU3VibWl0dGVkJzogMSxcclxuICAgICAgICAgICAgICAnaXNWaXNpYmxlJzogMSxcclxuICAgICAgICAgICAgICAnbG9jYXRpb24uY2l0eSc6IDFcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY2FuZGlkYXRlU2VydmljZS5yZXRyaWV2ZVdpdGhMZWFuKHt9LCBjYW5kaWRhdGVGaWVsZHMsIChlcnJvciwgY2FuZGlkYXRlc1Jlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZldGNoZWQgYWxsIGNhbmRpZGF0ZXM6XCIgKyBjYW5kaWRhdGVzUmVzdWx0Lmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjYW5kaWRhdGUgb2YgY2FuZGlkYXRlc1Jlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICB1c2Vyc01hcC5zZXQoY2FuZGlkYXRlLnVzZXJJZC50b1N0cmluZygpLCBjYW5kaWRhdGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHVzZXIgb2YgcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgIHVzZXIuZGF0YSA9IHVzZXJzTWFwLmdldCh1c2VyLl9pZC50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgICAgY2FuZGlkYXRlcy5wdXNoKHVzZXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHVzZXJzLmNhbmRpZGF0ZSA9IGNhbmRpZGF0ZXM7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB1c2Vycyk7XHJcblxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIGNhbGxiYWNrKGUsIG51bGwpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHNlbmRBZG1pbkxvZ2luSW5mb01haWwoZmllbGQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IGhlYWRlcjEgPSBmcy5yZWFkRmlsZVN5bmMoJy4vc3JjL3NlcnZlci9hcHAvZnJhbWV3b3JrL3B1YmxpYy9oZWFkZXIxLmh0bWwnKS50b1N0cmluZygpO1xyXG4gICAgbGV0IGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoJy4vc3JjL3NlcnZlci9hcHAvZnJhbWV3b3JrL3B1YmxpYy9hZG1pbmxvZ2luaW5mby5tYWlsLmh0bWwnKS50b1N0cmluZygpO1xyXG4gICAgbGV0IGZvb3RlcjEgPSBmcy5yZWFkRmlsZVN5bmMoJy4vc3JjL3NlcnZlci9hcHAvZnJhbWV3b3JrL3B1YmxpYy9mb290ZXIxLmh0bWwnKS50b1N0cmluZygpO1xyXG4gICAgbGV0IG1pZF9jb250ZW50ID0gY29udGVudC5yZXBsYWNlKCckZW1haWwkJywgZmllbGQuZW1haWwpLnJlcGxhY2UoJyRhZGRyZXNzJCcsIChmaWVsZC5sb2NhdGlvbiA9PT0gdW5kZWZpbmVkKSA/ICdOb3QgRm91bmQnIDogZmllbGQubG9jYXRpb24pXHJcbiAgICAgIC5yZXBsYWNlKCckaXAkJywgZmllbGQuaXApLnJlcGxhY2UoJyRob3N0JCcsIGNvbmZpZy5nZXQoJ1RwbFNlZWQubWFpbC5ob3N0JykpO1xyXG5cclxuXHJcbiAgICBsZXQgbWFpbE9wdGlvbnMgPSB7XHJcbiAgICAgIGZyb206IGNvbmZpZy5nZXQoJ1RwbFNlZWQubWFpbC5NQUlMX1NFTkRFUicpLFxyXG4gICAgICB0bzogY29uZmlnLmdldCgnVHBsU2VlZC5tYWlsLkFETUlOX01BSUwnKSxcclxuICAgICAgY2M6IGNvbmZpZy5nZXQoJ1RwbFNlZWQubWFpbC5UUExHUk9VUF9NQUlMJyksXHJcbiAgICAgIHN1YmplY3Q6IE1lc3NhZ2VzLkVNQUlMX1NVQkpFQ1RfQURNSU5fTE9HR0VEX09OICsgXCIgXCIgKyBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuaG9zdCcpLFxyXG4gICAgICBodG1sOiBoZWFkZXIxICsgbWlkX2NvbnRlbnQgKyBmb290ZXIxXHJcbiAgICAgICwgYXR0YWNobWVudHM6IE1haWxBdHRhY2htZW50cy5BdHRhY2htZW50QXJyYXlcclxuICAgIH1cclxuICAgIGxldCBzZW5kTWFpbFNlcnZpY2UgPSBuZXcgU2VuZE1haWxTZXJ2aWNlKCk7XHJcbiAgICBzZW5kTWFpbFNlcnZpY2Uuc2VuZE1haWwobWFpbE9wdGlvbnMsIGNhbGxiYWNrKTtcclxuXHJcbiAgfTtcclxuXHJcbiAgdXBkYXRlVXNlcihfaWQ6IHN0cmluZywgaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmZpbmRCeUlkKF9pZCwgKGVycjogYW55LCByZXM6IGFueSkgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyLCByZXMpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMudXNlclJlcG9zaXRvcnkudXBkYXRlKHJlcy5faWQsIGl0ZW0sIGNhbGxiYWNrKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgZXhwb3J0Q2FuZGlkYXRlQ29sbGVjdGlvbihjYWxsYmFjazogKGVycjogYW55LCByZXM6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgY29uc29sZS5sb2coXCJpbnNpZGUgZXhwb3J0Q2FuZGlkYXRlQ29sbGVjdGlvblwiKTtcclxuICAgIGxldCBzdGRlcnI6IGFueSA9ICcnO1xyXG5cclxuICAgIC8qbGV0IGNhbmRpZGF0ZUNoaWxkID0gc3Bhd24oJ21vbmdvZXhwb3J0JyxbJy0tZGInLGRiLCctLWNvbGxlY3Rpb24nLCdjYW5kaWRhdGVzJywnLS10eXBlJywnY3N2JywnLS1maWVsZHMnLCdfaWQsdXNlcklkLGpvYl9saXN0LHByb2ZpY2llbmNpZXMsZW1wbG95bWVudEhpc3RvcnksYWNhZGVtaWNzLGluZHVzdHJ5LGF3YXJkcyxpbnRlcmVzdGVkSW5kdXN0cmllcyxjZXJ0aWZpY2F0aW9ucyxwcm9maWxlX3VwZGF0ZV90cmFja2luZyxpc1Zpc2libGUsaXNTdWJtaXR0ZWQsaXNDb21wbGV0ZWQsY29tcGxleGl0eV9ub3RlX21hdHJpeCxwcm9mZXNzaW9uYWxEZXRhaWxzLGFib3V0TXlzZWxmLGpvYlRpdGxlLGxvY2F0aW9uLGxhc3RVcGRhdGVBdCcsJy0tb3V0JywnL2hvbWUva2FwaWwvSmF2YVByb2plY3Qvbmc0LWNuZXh0L2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy9jYW5kaWRhdGVzLmNzdiddKTsqL1xyXG5cclxuICAgIGxldCBjYW5kaWRhdGVDaGlsZCA9IHNwYXduKCdtb25nb2V4cG9ydCcsIFsnLS11c2VybmFtZScsIHVzZXJuYW1lLCAnLS1wYXNzd29yZCcsIHBhc3N3b3JkLCAnLS1kYicsIGRiLCAnLS1jb2xsZWN0aW9uJywgJ2NhbmRpZGF0ZXMnLCAnLS10eXBlJywgJ2NzdicsICctLWZpZWxkcycsICdfaWQsdXNlcklkLGpvYl9saXN0LHByb2ZpY2llbmNpZXMsZW1wbG95bWVudEhpc3RvcnksYWNhZGVtaWNzLGluZHVzdHJ5LGF3YXJkcyxpbnRlcmVzdGVkSW5kdXN0cmllcyxjZXJ0aWZpY2F0aW9ucyxwcm9maWxlX3VwZGF0ZV90cmFja2luZyxpc1Zpc2libGUsaXNTdWJtaXR0ZWQsaXNDb21wbGV0ZWQsY29tcGxleGl0eV9ub3RlX21hdHJpeCxwcm9mZXNzaW9uYWxEZXRhaWxzLGFib3V0TXlzZWxmLGpvYlRpdGxlLGxvY2F0aW9uLGxhc3RVcGRhdGVBdCcsICctLW91dCcsICcvaG9tZS9iaXRuYW1pL2FwcHMvam9ibW9zaXMtc3RhZ2luZy9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvY2FuZGlkYXRlcy5jc3YnXSk7XHJcblxyXG4gICAgY2FuZGlkYXRlQ2hpbGQub24oJ2V4aXQnLCBmdW5jdGlvbiAoY29kZTogYW55KSB7XHJcbiAgICAgIGlmIChjb2RlICE9IDApIHtcclxuICAgICAgICBjYW5kaWRhdGVDaGlsZC5raWxsKCk7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKCksIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjYW5kaWRhdGVDaGlsZCBwcm9jZXNzIGNsb3NlZCB3aXRoIGNvZGUgJyArIGNvZGUpO1xyXG4gICAgICAgIGNhbmRpZGF0ZUNoaWxkLmtpbGwoKTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCAnc3VjY2VzcycpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBjYW5kaWRhdGVDaGlsZC5zdGRlcnIub24oJ2RhdGEnLCBmdW5jdGlvbiAoYnVmOiBhbnkpIHtcclxuICAgICAgY29uc29sZS5sb2coJ1tTVFJdIHN0ZGVyciBcIiVzXCInLCBTdHJpbmcoYnVmKSk7XHJcbiAgICAgIHN0ZGVyciArPSBidWY7XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBleHBvcnRDYW5kaWRhdGVPdGhlckRldGFpbHNDb2xsZWN0aW9uKGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcImluc2lkZSBleHBvcnRDYW5kaWRhdGVEZXRhaWxzQ29sbGVjdGlvblwiKTtcclxuICAgIGxldCBzdGRlcnI6IGFueSA9ICcnO1xyXG4gICAgLypsZXQgY2FuZGlkYXRlT3RoZXJEZXRhaWxzQ2hpbGQgPSBzcGF3bignbW9uZ29leHBvcnQnLFsnLS1kYicsZGIsJy0tY29sbGVjdGlvbicsJ2NhbmRpZGF0ZXMnLCctLXR5cGUnLCdjc3YnLCctLWZpZWxkcycsJ3VzZXJJZCxjYXBhYmlsaXR5X21hdHJpeCcsJy0tb3V0JywnL2hvbWUva2FwaWwvSmF2YVByb2plY3Qvbmc0LWNuZXh0L2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy9jYW5kaWRhdGVzLW90aGVyLWRldGFpbHMuY3N2J10pOyovXHJcbiAgICBsZXQgY2FuZGlkYXRlT3RoZXJEZXRhaWxzQ2hpbGQgPSBzcGF3bignbW9uZ29leHBvcnQnLCBbJy0tdXNlcm5hbWUnLCB1c2VybmFtZSwgJy0tcGFzc3dvcmQnLCBwYXNzd29yZCwgJy0tZGInLCBkYiwgJy0tY29sbGVjdGlvbicsICdjYW5kaWRhdGVzJywgJy0tdHlwZScsICdjc3YnLCAnLS1maWVsZHMnLCAndXNlcklkLGNhcGFiaWxpdHlfbWF0cml4JywgJy0tb3V0JywgJy9ob21lL2JpdG5hbWkvYXBwcy9qb2Jtb3Npcy1zdGFnaW5nL2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy9jYW5kaWRhdGVzLW90aGVyLWRldGFpbHMuY3N2J10pO1xyXG5cclxuICAgIGNhbmRpZGF0ZU90aGVyRGV0YWlsc0NoaWxkLm9uKCdleGl0JywgZnVuY3Rpb24gKGNvZGU6IGFueSkge1xyXG4gICAgICBpZiAoY29kZSAhPSAwKSB7XHJcbiAgICAgICAgY2FuZGlkYXRlT3RoZXJEZXRhaWxzQ2hpbGQua2lsbCgpO1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcigpLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnY2FuZGlkYXRlT3RoZXJEZXRhaWxzQ2hpbGQgcHJvY2VzcyBjbG9zZWQgd2l0aCBjb2RlICcgKyBjb2RlKTtcclxuICAgICAgICBjYW5kaWRhdGVPdGhlckRldGFpbHNDaGlsZC5raWxsKCk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgJ3N1Y2Nlc3MnKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgY2FuZGlkYXRlT3RoZXJEZXRhaWxzQ2hpbGQuc3RkZXJyLm9uKCdkYXRhJywgZnVuY3Rpb24gKGJ1ZjogYW55KSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdbU1RSXSBzdGRlcnIgXCIlc1wiJywgU3RyaW5nKGJ1ZikpO1xyXG4gICAgICBzdGRlcnIgKz0gYnVmO1xyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgZXhwb3J0VXNlckNvbGxlY3Rpb24odXNlclR5cGU6IHN0cmluZywgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiaW5zaWRlIGV4cG9ydFVzZXJDb2xsZWN0aW9uXCIpO1xyXG4gICAgbGV0IHVzZXJDaGlsZDogYW55O1xyXG4gICAgbGV0IHN0ZGVycjogYW55ID0gJyc7XHJcblxyXG4gICAgLyppZiAodXNlclR5cGUgPT0gJ2NhbmRpZGF0ZScpIHtcclxuICAgICB1c2VyQ2hpbGQgPSBzcGF3bignbW9uZ29leHBvcnQnLCBbJy0tZGInLGRiLCctLWNvbGxlY3Rpb24nLCd1c2VycycsJy0tdHlwZScsJ2NzdicsJy0tZmllbGRzJywnX2lkLGZpcnN0X25hbWUsbGFzdF9uYW1lLG1vYmlsZV9udW1iZXIsZW1haWwsY3VycmVudF90aGVtZSxpc0NhbmRpZGF0ZSxndWlkZV90b3VyLG5vdGlmaWNhdGlvbnMsY29tcGxleGl0eUlzTXVzdEhhdmUsaXNBZG1pbixvdHAsaXNBY3RpdmF0ZWQsdGVtcF9tb2JpbGUnLCctLW91dCcsJy9ob21lL2thcGlsL0phdmFQcm9qZWN0L25nNC1jbmV4dC9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvdXNlcnMuY3N2JywnLS1xdWVyeScsJ3tcImlzQ2FuZGlkYXRlXCI6dHJ1ZX0nXSk7XHJcbiAgICAgfSBlbHNlIHtcclxuICAgICB1c2VyQ2hpbGQgPSBzcGF3bignbW9uZ29leHBvcnQnLCBbJy0tZGInLGRiLCctLWNvbGxlY3Rpb24nLCd1c2VycycsJy0tdHlwZScsJ2NzdicsJy0tZmllbGRzJywnX2lkLG1vYmlsZV9udW1iZXIsZW1haWwsY3VycmVudF90aGVtZSxpc0NhbmRpZGF0ZSxndWlkZV90b3VyLG5vdGlmaWNhdGlvbnMsaXNBZG1pbixvdHAsaXNBY3RpdmF0ZWQsdGVtcF9tb2JpbGUsbG9jYXRpb24scGljdHVyZScsJy0tb3V0JywnL2hvbWUva2FwaWwvSmF2YVByb2plY3Qvbmc0LWNuZXh0L2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy91c2Vycy5jc3YnLCctLXF1ZXJ5Jywne1wiaXNDYW5kaWRhdGVcIjpmYWxzZX0nXSk7XHJcbiAgICAgfSovXHJcblxyXG4gICAgaWYgKHVzZXJUeXBlID09ICdjYW5kaWRhdGUnKSB7XHJcbiAgICAgIHVzZXJDaGlsZCA9IHNwYXduKCdtb25nb2V4cG9ydCcsIFsnLS11c2VybmFtZScsIHVzZXJuYW1lLCAnLS1wYXNzd29yZCcsIHBhc3N3b3JkLCAnLS1kYicsIGRiLCAnLS1jb2xsZWN0aW9uJywgJ3VzZXJzJywgJy0tdHlwZScsICdjc3YnLCAnLS1maWVsZHMnLCAnX2lkLGZpcnN0X25hbWUsbGFzdF9uYW1lLG1vYmlsZV9udW1iZXIsZW1haWwsY3VycmVudF90aGVtZSxpc0NhbmRpZGF0ZSxndWlkZV90b3VyLG5vdGlmaWNhdGlvbnMsY29tcGxleGl0eUlzTXVzdEhhdmUsaXNBZG1pbixvdHAsaXNBY3RpdmF0ZWQsdGVtcF9tb2JpbGUnLCAnLS1vdXQnLCAnL2hvbWUvYml0bmFtaS9hcHBzL2pvYm1vc2lzLXN0YWdpbmcvYy1uZXh0L2Rpc3Qvc2VydmVyL3Byb2QvcHVibGljL3VzZXJzLmNzdicsICctLXF1ZXJ5JywgJ3tcImlzQ2FuZGlkYXRlXCI6dHJ1ZX0nXSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB1c2VyQ2hpbGQgPSBzcGF3bignbW9uZ29leHBvcnQnLCBbJy0tdXNlcm5hbWUnLCB1c2VybmFtZSwgJy0tcGFzc3dvcmQnLCBwYXNzd29yZCwgJy0tZGInLCBkYiwgJy0tY29sbGVjdGlvbicsICd1c2VycycsICctLXR5cGUnLCAnY3N2JywgJy0tZmllbGRzJywgJ19pZCxtb2JpbGVfbnVtYmVyLGVtYWlsLGN1cnJlbnRfdGhlbWUsaXNDYW5kaWRhdGUsZ3VpZGVfdG91cixub3RpZmljYXRpb25zLGlzQWRtaW4sb3RwLGlzQWN0aXZhdGVkLHRlbXBfbW9iaWxlLGxvY2F0aW9uLHBpY3R1cmUnLCAnLS1vdXQnLCAnL2hvbWUvYml0bmFtaS9hcHBzL2pvYm1vc2lzLXN0YWdpbmcvYy1uZXh0L2Rpc3Qvc2VydmVyL3Byb2QvcHVibGljL3VzZXJzLmNzdicsICctLXF1ZXJ5JywgJ3tcImlzQ2FuZGlkYXRlXCI6ZmFsc2V9J10pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB1c2VyQ2hpbGQub24oJ2V4aXQnLCBmdW5jdGlvbiAoY29kZTogYW55KSB7XHJcbiAgICAgIGlmIChjb2RlICE9IDApIHtcclxuICAgICAgICB1c2VyQ2hpbGQua2lsbCgpO1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcigpLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZygndXNlckNoaWxkIHByb2Nlc3MgY2xvc2VkIHdpdGggY29kZSAnICsgY29kZSk7XHJcbiAgICAgICAgdXNlckNoaWxkLmtpbGwoKTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCAnc3VjY2VzcycpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB1c2VyQ2hpbGQuc3RkZXJyLm9uKCdkYXRhJywgZnVuY3Rpb24gKGJ1ZjogYW55KSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdbU1RSXSBzdGRlcnIgXCIlc1wiJywgU3RyaW5nKGJ1ZikpO1xyXG4gICAgICBzdGRlcnIgKz0gYnVmO1xyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgZXhwb3J0UmVjcnVpdGVyQ29sbGVjdGlvbihjYWxsYmFjazogKGVycjogYW55LCByZXM6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgY29uc29sZS5sb2coXCJpbnNpZGUgZXhwb3J0UmVjcnVpdGVyQ29sbGVjdGlvblwiKTtcclxuICAgIGxldCBzdGRlcnI6IGFueSA9ICcnO1xyXG5cclxuICAgIC8qbGV0IHJlY3J1aXRlckNoaWxkID0gc3Bhd24oJ21vbmdvZXhwb3J0JywgWyctLWRiJyxkYiwnLS1jb2xsZWN0aW9uJywncmVjcnVpdGVycycsJy0tdHlwZScsJ2NzdicsJy0tZmllbGRzJywnX2lkLHVzZXJJZCxpc1JlY3J1aXRpbmdGb3JzZWxmLGNvbXBhbnlfbmFtZSxjb21wYW55X3NpemUsY29tcGFueV93ZWJzaXRlLHBvc3RlZEpvYnMsc2V0T2ZEb2N1bWVudHMsY29tcGFueV9sb2dvJywnLS1vdXQnLCcvaG9tZS9rYXBpbC9KYXZhUHJvamVjdC9uZzQtY25leHQvYy1uZXh0L2Rpc3Qvc2VydmVyL3Byb2QvcHVibGljL3JlY3J1aXRlcnMuY3N2J10pOyovXHJcblxyXG4gICAgbGV0IHJlY3J1aXRlckNoaWxkID0gc3Bhd24oJ21vbmdvZXhwb3J0JywgWyctLXVzZXJuYW1lJywgdXNlcm5hbWUsICctLXBhc3N3b3JkJywgcGFzc3dvcmQsICctLWRiJywgZGIsICctLWNvbGxlY3Rpb24nLCAncmVjcnVpdGVycycsICctLXR5cGUnLCAnY3N2JywgJy0tZmllbGRzJywgJ19pZCx1c2VySWQsaXNSZWNydWl0aW5nRm9yc2VsZixjb21wYW55X25hbWUsY29tcGFueV9zaXplLGNvbXBhbnlfd2Vic2l0ZSxwb3N0ZWRKb2JzLHNldE9mRG9jdW1lbnRzLGNvbXBhbnlfbG9nbycsICctLW91dCcsICcvaG9tZS9iaXRuYW1pL2FwcHMvam9ibW9zaXMtc3RhZ2luZy9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvcmVjcnVpdGVycy5jc3YnXSk7XHJcblxyXG4gICAgcmVjcnVpdGVyQ2hpbGQub24oJ2V4aXQnLCBmdW5jdGlvbiAoY29kZTogYW55KSB7XHJcbiAgICAgIGlmIChjb2RlICE9IDApIHtcclxuICAgICAgICByZWNydWl0ZXJDaGlsZC5raWxsKCk7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKCksIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdyZWNydWl0ZXJDaGlsZCBwcm9jZXNzIGNsb3NlZCB3aXRoIGNvZGUgJyArIGNvZGUpO1xyXG4gICAgICAgIHJlY3J1aXRlckNoaWxkLmtpbGwoKTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCAnc3VjY2VzcycpO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgIHJlY3J1aXRlckNoaWxkLnN0ZGVyci5vbignZGF0YScsIGZ1bmN0aW9uIChidWY6IGFueSkge1xyXG4gICAgICBjb25zb2xlLmxvZygnW1NUUl0gc3RkZXJyIFwiJXNcIicsIFN0cmluZyhidWYpKTtcclxuICAgICAgc3RkZXJyICs9IGJ1ZjtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgfVxyXG5cclxuICBleHBvcnRVc2FnZURldGFpbHNDb2xsZWN0aW9uKGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcImluc2lkZSBleHBvcnRVc2FnZURldGFpbHNDb2xsZWN0aW9uXCIpO1xyXG4gICAgbGV0IHN0ZGVycjogYW55ID0gJyc7XHJcbiAgICAvKmxldCB1c2FnZURldGFpbHNDaGlsZCA9IHNwYXduKCdtb25nb2V4cG9ydCcsWyctLWRiJyxkYiwnLS1jb2xsZWN0aW9uJywndXNlc3RyYWNraW5ncycsJy0tdHlwZScsJ2NzdicsJy0tZmllbGRzJywnX2lkLGNhbmRpZGF0ZUlkLGpvYlByb2ZpbGVJZCx0aW1lc3RhbXAsYWN0aW9uLF9fdicsJy0tb3V0JywnL2hvbWUva2FwaWwvSmF2YVByb2plY3Qvbmc0LWNuZXh0L2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy91c2FnZWRldGFpbC5jc3YnXSk7Ki9cclxuXHJcbiAgICBsZXQgdXNhZ2VEZXRhaWxzQ2hpbGQgPSBzcGF3bignbW9uZ29leHBvcnQnLCBbJy0tdXNlcm5hbWUnLCB1c2VybmFtZSwgJy0tcGFzc3dvcmQnLCBwYXNzd29yZCwgJy0tZGInLCBkYiwgJy0tY29sbGVjdGlvbicsICd1c2VzdHJhY2tpbmdzJywgJy0tdHlwZScsICdjc3YnLCAnLS1maWVsZHMnLCAnX2lkLGNhbmRpZGF0ZUlkLGpvYlByb2ZpbGVJZCx0aW1lc3RhbXAsYWN0aW9uLF9fdicsICctLW91dCcsICcvaG9tZS9iaXRuYW1pL2FwcHMvam9ibW9zaXMtc3RhZ2luZy9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvdXNhZ2VkZXRhaWwuY3N2J10pO1xyXG5cclxuICAgIHVzYWdlRGV0YWlsc0NoaWxkLm9uKCdleGl0JywgZnVuY3Rpb24gKGNvZGU6IGFueSkge1xyXG4gICAgICBpZiAoY29kZSAhPSAwKSB7XHJcbiAgICAgICAgdXNhZ2VEZXRhaWxzQ2hpbGQua2lsbCgpO1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcigpLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZygndXNhZ2VEZXRhaWxzQ2hpbGQgcHJvY2VzcyBjbG9zZWQgd2l0aCBjb2RlICcgKyBjb2RlKTtcclxuICAgICAgICB1c2FnZURldGFpbHNDaGlsZC5raWxsKCk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgJ3N1Y2Nlc3MnKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgdXNhZ2VEZXRhaWxzQ2hpbGQuc3RkZXJyLm9uKCdkYXRhJywgZnVuY3Rpb24gKGJ1ZjogYW55KSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdbU1RSXSBzdGRlcnIgXCIlc1wiJywgU3RyaW5nKGJ1ZikpO1xyXG4gICAgICBzdGRlcnIgKz0gYnVmO1xyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbn1cclxuXHJcbk9iamVjdC5zZWFsKEFkbWluU2VydmljZSk7XHJcbmV4cG9ydCA9IEFkbWluU2VydmljZTtcclxuIl19
