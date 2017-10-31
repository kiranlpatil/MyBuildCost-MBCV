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
        var candidateChild = spawn('mongoexport', ['--host', '52.10.145.87', '--db', db, '--collection', 'candidates', '--type', 'csv', '--fields',
            '_id,userId,job_list,proficiencies,employmentHistory,academics,industry,awards,interestedIndustries,certifications,profile_update_tracking,isVisible,isSubmitted,isCompleted,complexity_note_matrix,professionalDetails,aboutMyself,jobTitle,location,lastUpdateAt',
            '--out', '/home/kapil/JavaProject/ng4-cnext/c-next/dist/server/prod/public/candidates.csv']);
        candidateChild.on('exit', function (code) {
            if (code != 0) {
                candidateChild.kill();
                callback(new Error(), null);
            }
            else {
                candidateChild.kill();
                callback(null, 'success');
            }
        });
    };
    AdminService.prototype.exportCandidateOtherDetailsCollection = function (callback) {
        var candidateOtherDetailsChild = spawn('mongoexport', ['--db', db, '--collection', 'candidates',
            '--type', 'csv', '--fields', 'userId,capability_matrix', '--out',
            '/home/kapil/JavaProject/ng4-cnext/c-next/dist/server/prod/public/candidates-other-details.csv']);
        candidateOtherDetailsChild.on('exit', function (code) {
            if (code != 0) {
                candidateOtherDetailsChild.kill();
                callback(new Error(), null);
            }
            else {
                candidateOtherDetailsChild.kill();
                callback(null, 'success');
            }
        });
    };
    AdminService.prototype.exportUserCollection = function (userType, callback) {
        var userChild;
        if (userType == 'candidate') {
            userChild = spawn('mongoexport', ['--db', db, '--collection', 'users', '--type', 'csv', '--fields',
                '_id,first_name,last_name,mobile_number,email,current_theme,isCandidate,guide_tour,notifications,complexityIsMustHave,isAdmin,otp,isActivated,temp_mobile',
                '--out', '/home/kapil/JavaProject/ng4-cnext/c-next/dist/server/prod/public/users.csv', '--query',
                '{"isCandidate": true}']);
        }
        else {
            userChild = spawn('mongoexport', ['--db', db, '--collection', 'users', '--type', 'csv', '--fields',
                '_id,mobile_number,email,current_theme,isCandidate,guide_tour,notifications,isAdmin,otp,isActivated,temp_mobile,location,picture', '--out',
                '/home/kapil/JavaProject/ng4-cnext/c-next/dist/server/prod/public/users.csv',
                '--query', '{"isCandidate": false}']);
        }
        userChild.on('exit', function (code) {
            if (code != 0) {
                userChild.kill();
                callback(new Error(), null);
            }
            else {
                userChild.kill();
                callback(null, 'success');
            }
        });
    };
    AdminService.prototype.exportRecruiterCollection = function (callback) {
        var recruiterChild = spawn('mongoexport', ['--username', username, 'password', password, '--db', db, '--collection', 'recruiters', '--type', 'csv', '--fields', '_id', '--out', '/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/recruiters.csv']);
        recruiterChild.on('exit', function (code) {
            if (code != 0) {
                recruiterChild.kill();
                callback(new Error(), null);
            }
            else {
                recruiterChild.kill();
                callback(null, 'success');
            }
        });
    };
    AdminService.prototype.exportUsageDetailsCollection = function (callback) {
        var usageDetailsChild = spawn('mongoexport', ['--db', db, '--collection', 'usestrackings', '--type', 'csv',
            '--fields', '_id,candidateId,jobProfileId,timestamp,action,__v', '--out',
            '/home/kapil/JavaProject/ng4-cnext/c-next/dist/server/prod/public/usagedetail.csv']);
        usageDetailsChild.on('exit', function (code) {
            if (code != 0) {
                usageDetailsChild.kill();
                callback(new Error(), null);
            }
            else {
                usageDetailsChild.kill();
                callback(null, 'success');
            }
        });
    };
    return AdminService;
}());
Object.seal(AdminService);
module.exports = AdminService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvYWRtaW4uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBR0EseUVBQTRFO0FBQzVFLG9EQUF1RDtBQUN2RCw2Q0FBZ0Q7QUFDaEQsdURBQTBEO0FBQzFELG1GQUFzRjtBQUN0RiwyREFBOEQ7QUFDOUQsc0RBQXlEO0FBQ3pELHNEQUF5RDtBQUV6RCxpRkFBb0Y7QUFJcEYsNENBQStDO0FBQy9DLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzVDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFFM0MsSUFBSSxXQUFXLEdBQUcsc0JBQXNCLENBQUM7QUFFekMsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLElBQUksUUFBUSxHQUFHLGtCQUFrQixDQUFDO0FBRWxDLElBQUksRUFBRSxHQUFHLGtCQUFrQixDQUFDO0FBRTVCO0lBT0U7UUFDRSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztRQUNuRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1FBQ3JELElBQUksR0FBRyxHQUFRLElBQUksWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQy9DLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDO0lBQ2hELENBQUM7SUFFRCxzQ0FBZSxHQUFmLFVBQWdCLElBQVMsRUFBRSxRQUEyQztRQUNwRSxJQUFJLENBQUM7WUFDSCxJQUFJLGdCQUFnQixHQUFHLElBQUksZ0JBQWdCLEVB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VSxFQUFFLG1EQUFtRCxFQUFFLE9BQU87WUFDeEUsa0ZBQWtGLENBQUMsQ0FBQyxDQUFDO1FBTXZGLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBVSxJQUFTO1lBQzlDLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNkLGlCQUFpQixDQUFDLElBQUksRUFBRSxDQUFDO2dCQUN6QixRQUFRLENBQUMsSUFBSSxLQUFLLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM5QixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04saUJBQWlCLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3pCLFFBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDNUIsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBRUwsQ0FBQztJQUVILG1CQUFDO0FBQUQsQ0E5VUEsQUE4VUMsSUFBQTtBQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDMUIsaUJBQVMsWUFBWSxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvc2VydmljZXMvYWRtaW4uc2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IHRlY2hwcmltZTAwMiBvbiA4LzI4LzIwMTcuXHJcbiAqL1xyXG5pbXBvcnQgVXNlclJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvdXNlci5yZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBTZW5kTWFpbFNlcnZpY2UgPSByZXF1aXJlKCcuL3NlbmRtYWlsLnNlcnZpY2UnKTtcclxuaW1wb3J0IE1lc3NhZ2VzID0gcmVxdWlyZSgnLi4vc2hhcmVkL21lc3NhZ2VzJyk7XHJcbmltcG9ydCBNYWlsQXR0YWNobWVudHMgPSByZXF1aXJlKCcuLi9zaGFyZWQvc2hhcmVkYXJyYXknKTtcclxuaW1wb3J0IFJlY3J1aXRlclJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvcmVjcnVpdGVyLnJlcG9zaXRvcnknKTtcclxuaW1wb3J0IFVzZXJzQ2xhc3NNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvdXNlcnMnKTtcclxuaW1wb3J0IENhbmRpZGF0ZVNlcnZpY2UgPSByZXF1aXJlKCcuL2NhbmRpZGF0ZS5zZXJ2aWNlJyk7XHJcbmltcG9ydCBSZWNydWl0ZXJTZXJ2aWNlID0gcmVxdWlyZSgnLi9yZWNydWl0ZXIuc2VydmljZScpO1xyXG5pbXBvcnQgSW5kdXN0cnlNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvaW5kdXN0cnkubW9kZWwnKTtcclxuaW1wb3J0IEluZHVzdHJ5UmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9pbmR1c3RyeS5yZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBDYW5kaWRhdGVNb2RlbENsYXNzID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9jYW5kaWRhdGVDbGFzcy5tb2RlbCcpO1xyXG5pbXBvcnQgUmVjcnVpdGVyQ2xhc3NNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcmVjcnVpdGVyQ2xhc3MubW9kZWwnKTtcclxuaW1wb3J0IENhbmRpZGF0ZUNsYXNzTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL2NhbmRpZGF0ZS1jbGFzcy5tb2RlbCcpO1xyXG5pbXBvcnQgVXNlclNlcnZpY2UgPSByZXF1aXJlKFwiLi91c2VyLnNlcnZpY2VcIik7XHJcbmxldCBjb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcclxubGV0IGZzID0gcmVxdWlyZSgnZnMnKTtcclxubGV0IHVzZXN0cmFja2luZyA9IHJlcXVpcmUoJ3VzZXMtdHJhY2tpbmcnKTtcclxubGV0IHNwYXduID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLnNwYXduO1xyXG5cclxubGV0IG1vbmdvRXhwb3J0ID0gJy91c3IvYmluL21vbmdvZXhwb3J0JztcclxuLy9sZXQgZGIgPSBjb25maWcuZ2V0KCdUcGxTZWVkLmRhdGFiYXNlLm5hbWUnKTtcclxubGV0IHVzZXJuYW1lID0gJ2FkbWluJztcclxubGV0IHBhc3N3b3JkID0gJ2pvYm1vc2lzYWRtaW4xMjMnO1xyXG5cclxubGV0IGRiID0gJ0pvYm1vc2lzLXN0YWdpbmcnO1xyXG4vL2xldCBkYiA9ICdjLW5leHQtYmFja2VuZCc7XHJcbmNsYXNzIEFkbWluU2VydmljZSB7XHJcbiAgY29tcGFueV9uYW1lOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSB1c2VyUmVwb3NpdG9yeTogVXNlclJlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSBpbmR1c3RyeVJlcG9zaXRpcnk6IEluZHVzdHJ5UmVwb3NpdG9yeTtcclxuICBwcml2YXRlIHJlY3J1aXRlclJlcG9zaXRvcnk6IFJlY3J1aXRlclJlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSB1c2VzVHJhY2tpbmdDb250cm9sbGVyOiBhbnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeSA9IG5ldyBVc2VyUmVwb3NpdG9yeSgpO1xyXG4gICAgdGhpcy5pbmR1c3RyeVJlcG9zaXRpcnkgPSBuZXcgSW5kdXN0cnlSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLnJlY3J1aXRlclJlcG9zaXRvcnkgPSBuZXcgUmVjcnVpdGVyUmVwb3NpdG9yeSgpO1xyXG4gICAgbGV0IG9iajogYW55ID0gbmV3IHVzZXN0cmFja2luZy5NeUNvbnRyb2xsZXIoKTtcclxuICAgIHRoaXMudXNlc1RyYWNraW5nQ29udHJvbGxlciA9IG9iai5fY29udHJvbGxlcjtcclxuICB9XHJcblxyXG4gIGdldENvdW50T2ZVc2VycyhpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCBjYW5kaWRhdGVTZXJ2aWNlID0gbmV3IENhbmRpZGF0ZVNlcnZpY2UoKTtcclxuICAgICAgbGV0IHJlY3J1aXRlclNlcnZpY2UgPSBuZXcgUmVjcnVpdGVyU2VydmljZSgpO1xyXG4gICAgICBsZXQgdXNlcnM6IFVzZXJzQ2xhc3NNb2RlbCA9IG5ldyBVc2Vyc0NsYXNzTW9kZWwoKTtcclxuICAgICAgbGV0IGZpbmRRdWVyeSA9IG5ldyBPYmplY3QoKTtcclxuXHJcbiAgICAgIGNhbmRpZGF0ZVNlcnZpY2UuZ2V0VG90YWxDYW5kaWRhdGVDb3VudCgoZXJyb3IsIGNhbmRpZGF0ZUNvdW50KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHVzZXJzLnRvdGFsTnVtYmVyT2ZDYW5kaWRhdGVzID0gY2FuZGlkYXRlQ291bnQ7XHJcbiAgICAgICAgICByZWNydWl0ZXJTZXJ2aWNlLmdldFRvdGFsUmVjcnVpdGVyQ291bnQoKGVycm9yLCByZWNydWl0ZXJDb3VudCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdXNlcnMudG90YWxOdW1iZXJPZlJlY3J1aXRlcnMgPSByZWNydWl0ZXJDb3VudDtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB1c2Vycyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaFxyXG4gICAgICAoZSkge1xyXG4gICAgICBjYWxsYmFjayhlLCBudWxsKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBnZXRSZWNydWl0ZXJEZXRhaWxzKGluaXRpYWw6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCB1c2VyczogVXNlcnNDbGFzc01vZGVsID0gbmV3IFVzZXJzQ2xhc3NNb2RlbCgpO1xyXG4gICAgICBsZXQgdXNlcnNNYXA6IE1hcDxhbnksIGFueT4gPSBuZXcgTWFwKCk7XHJcblxyXG4gICAgICBsZXQgcmVjcnVpdGVyU2VydmljZSA9IG5ldyBSZWNydWl0ZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCByZWNydWl0ZXJzOiBSZWNydWl0ZXJDbGFzc01vZGVsW10gPSBuZXcgQXJyYXkoMCk7XHJcblxyXG4gICAgICBsZXQgcmVnRXggPSBuZXcgUmVnRXhwKCdeWycgKyBpbml0aWFsLnRvTG93ZXJDYXNlKCkgKyBpbml0aWFsLnRvVXBwZXJDYXNlKCkgKyAnXScpO1xyXG4gICAgICBsZXQgZmluZFF1ZXJ5ID0ge1xyXG4gICAgICAgICdjb21wYW55X25hbWUnOiB7XHJcbiAgICAgICAgICAkcmVnZXg6IHJlZ0V4XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGxldCBzb3J0aW5nUXVlcnkgPSB7J2NvbXBhbnlfbmFtZSc6IDEsICdjb21wYW55X3NpemUnOiAxfTtcclxuXHJcbiAgICAgIGxldCByZWNydWl0ZXJGaWVsZHMgPSB7XHJcbiAgICAgICAgJ3VzZXJJZCc6IDEsXHJcbiAgICAgICAgJ2NvbXBhbnlfbmFtZSc6IDEsXHJcbiAgICAgICAgJ2NvbXBhbnlfc2l6ZSc6IDEsXHJcbiAgICAgICAgJ3Bvc3RlZEpvYnMuaXNKb2JQb3N0ZWQnOiAxXHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZWNydWl0ZXJTZXJ2aWNlLnJldHJpZXZlQnlTb3J0ZWRPcmRlcihmaW5kUXVlcnksIHJlY3J1aXRlckZpZWxkcywgc29ydGluZ1F1ZXJ5LCAoZXJyb3IsIHJlY3J1aXRlclJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB1c2Vycy50b3RhbE51bWJlck9mUmVjcnVpdGVycyA9IHJlY3J1aXRlclJlc3VsdC5sZW5ndGg7XHJcbiAgICAgICAgICBpZiAocmVjcnVpdGVyUmVzdWx0Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHVzZXJzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgdXNlckZpZWxkcyA9IHtcclxuICAgICAgICAgICAgICAnX2lkJzogMSxcclxuICAgICAgICAgICAgICAnbW9iaWxlX251bWJlcic6IDEsXHJcbiAgICAgICAgICAgICAgJ2VtYWlsJzogMSxcclxuICAgICAgICAgICAgICAnaXNBY3RpdmF0ZWQnOiAxXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCByZWNydWl0ZXIgb2YgcmVjcnVpdGVyUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgdXNlcnNNYXAuc2V0KHJlY3J1aXRlci51c2VySWQudG9TdHJpbmcoKSwgcmVjcnVpdGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB1c2VyU2VydmljZS5yZXRyaWV2ZVdpdGhMZWFuKHsnaXNDYW5kaWRhdGUnOiBmYWxzZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHVzZXIgb2YgcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmICh1c2Vyc01hcC5nZXQodXNlci5faWQudG9TdHJpbmcoKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB1c2VyLmRhdGEgPSB1c2Vyc01hcC5nZXQodXNlci5faWQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVjcnVpdGVycy5wdXNoKHVzZXIpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdXNlcnMucmVjcnVpdGVyID0gcmVjcnVpdGVycztcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHVzZXJzKTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY2F0Y2hcclxuICAgICAgKGUpIHtcclxuICAgICAgY2FsbGJhY2soZSwgbnVsbCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgZ2V0Q2FuZGlkYXRlRGV0YWlscyhpbml0aWFsOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB1c2VyU2VydmljZSA9IG5ldyBVc2VyU2VydmljZSgpO1xyXG4gICAgICBsZXQgdXNlcnM6IFVzZXJzQ2xhc3NNb2RlbCA9IG5ldyBVc2Vyc0NsYXNzTW9kZWwoKTtcclxuICAgICAgbGV0IHVzZXJzTWFwOiBNYXA8YW55LCBhbnk+ID0gbmV3IE1hcCgpO1xyXG5cclxuICAgICAgbGV0IGNhbmRpZGF0ZXM6IENhbmRpZGF0ZU1vZGVsQ2xhc3NbXSA9IG5ldyBBcnJheSgwKTtcclxuICAgICAgbGV0IGNhbmRpZGF0ZVNlcnZpY2UgPSBuZXcgQ2FuZGlkYXRlU2VydmljZSgpO1xyXG5cclxuICAgICAgbGV0IHJlZ0V4ID0gbmV3IFJlZ0V4cCgnXlsnICsgaW5pdGlhbC50b0xvd2VyQ2FzZSgpICsgaW5pdGlhbC50b1VwcGVyQ2FzZSgpICsgJ10nKTtcclxuICAgICAgbGV0IGZpbmRRdWVyeSA9IHtcclxuICAgICAgICAnZmlyc3RfbmFtZSc6IHtcclxuICAgICAgICAgICRyZWdleDogcmVnRXhcclxuICAgICAgICB9LFxyXG4gICAgICAgICdpc0FkbWluJzogZmFsc2UsXHJcbiAgICAgICAgJ2lzQ2FuZGlkYXRlJzogdHJ1ZVxyXG4gICAgICB9O1xyXG4gICAgICBsZXQgaW5jbHVkZWRfZmllbGRzID0ge1xyXG4gICAgICAgICdfaWQnOiAxLFxyXG4gICAgICAgICdmaXJzdF9uYW1lJzogMSxcclxuICAgICAgICAnbGFzdF9uYW1lJzogMSxcclxuICAgICAgICAnbW9iaWxlX251bWJlcic6IDEsXHJcbiAgICAgICAgJ2VtYWlsJzogMSxcclxuICAgICAgICAnaXNBY3RpdmF0ZWQnOiAxXHJcbiAgICAgIH07XHJcbiAgICAgIGxldCBzb3J0aW5nUXVlcnkgPSB7J2ZpcnN0X25hbWUnOiAxLCAnbGFzdF9uYW1lJzogMX07XHJcblxyXG4gICAgICB1c2VyU2VydmljZS5yZXRyaWV2ZUJ5U29ydGVkT3JkZXIoZmluZFF1ZXJ5LCBpbmNsdWRlZF9maWVsZHMsIHNvcnRpbmdRdWVyeSwgKGVycm9yLCByZXN1bHQpID0+IHtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdXNlcnMudG90YWxOdW1iZXJPZkNhbmRpZGF0ZXMgPSByZXN1bHQubGVuZ3RoO1xyXG4gICAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB1c2Vycyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gMDtcclxuICAgICAgICAgICAgbGV0IGNhbmRpZGF0ZUZpZWxkcyA9IHtcclxuICAgICAgICAgICAgICAndXNlcklkJzogMSxcclxuICAgICAgICAgICAgICAnam9iVGl0bGUnOiAxLFxyXG4gICAgICAgICAgICAgICdpc0NvbXBsZXRlZCc6IDEsXHJcbiAgICAgICAgICAgICAgJ2lzU3VibWl0dGVkJzogMSxcclxuICAgICAgICAgICAgICAnaXNWaXNpYmxlJzogMSxcclxuICAgICAgICAgICAgICAnbG9jYXRpb24uY2l0eSc6IDFcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY2FuZGlkYXRlU2VydmljZS5yZXRyaWV2ZVdpdGhMZWFuKHt9LCBjYW5kaWRhdGVGaWVsZHMsIChlcnJvciwgY2FuZGlkYXRlc1Jlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjYW5kaWRhdGUgb2YgY2FuZGlkYXRlc1Jlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICB1c2Vyc01hcC5zZXQoY2FuZGlkYXRlLnVzZXJJZC50b1N0cmluZygpLCBjYW5kaWRhdGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHVzZXIgb2YgcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgIHVzZXIuZGF0YSA9IHVzZXJzTWFwLmdldCh1c2VyLl9pZC50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgICAgICAgY2FuZGlkYXRlcy5wdXNoKHVzZXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHVzZXJzLmNhbmRpZGF0ZSA9IGNhbmRpZGF0ZXM7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB1c2Vycyk7XHJcblxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIGNhbGxiYWNrKGUsIG51bGwpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHNlbmRBZG1pbkxvZ2luSW5mb01haWwoZmllbGQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IGhlYWRlcjEgPSBmcy5yZWFkRmlsZVN5bmMoJy4vc3JjL3NlcnZlci9hcHAvZnJhbWV3b3JrL3B1YmxpYy9oZWFkZXIxLmh0bWwnKS50b1N0cmluZygpO1xyXG4gICAgbGV0IGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoJy4vc3JjL3NlcnZlci9hcHAvZnJhbWV3b3JrL3B1YmxpYy9hZG1pbmxvZ2luaW5mby5tYWlsLmh0bWwnKS50b1N0cmluZygpO1xyXG4gICAgbGV0IGZvb3RlcjEgPSBmcy5yZWFkRmlsZVN5bmMoJy4vc3JjL3NlcnZlci9hcHAvZnJhbWV3b3JrL3B1YmxpYy9mb290ZXIxLmh0bWwnKS50b1N0cmluZygpO1xyXG4gICAgbGV0IG1pZF9jb250ZW50ID0gY29udGVudC5yZXBsYWNlKCckZW1haWwkJywgZmllbGQuZW1haWwpLnJlcGxhY2UoJyRhZGRyZXNzJCcsIChmaWVsZC5sb2NhdGlvbiA9PT0gdW5kZWZpbmVkKSA/ICdOb3QgRm91bmQnIDogZmllbGQubG9jYXRpb24pXHJcbiAgICAgIC5yZXBsYWNlKCckaXAkJywgZmllbGQuaXApLnJlcGxhY2UoJyRob3N0JCcsIGNvbmZpZy5nZXQoJ1RwbFNlZWQubWFpbC5ob3N0JykpO1xyXG5cclxuXHJcbiAgICBsZXQgbWFpbE9wdGlvbnMgPSB7XHJcbiAgICAgIGZyb206IGNvbmZpZy5nZXQoJ1RwbFNlZWQubWFpbC5NQUlMX1NFTkRFUicpLFxyXG4gICAgICB0bzogY29uZmlnLmdldCgnVHBsU2VlZC5tYWlsLkFETUlOX01BSUwnKSxcclxuICAgICAgY2M6IGNvbmZpZy5nZXQoJ1RwbFNlZWQubWFpbC5UUExHUk9VUF9NQUlMJyksXHJcbiAgICAgIHN1YmplY3Q6IE1lc3NhZ2VzLkVNQUlMX1NVQkpFQ1RfQURNSU5fTE9HR0VEX09OICsgXCIgXCIgKyBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuaG9zdCcpLFxyXG4gICAgICBodG1sOiBoZWFkZXIxICsgbWlkX2NvbnRlbnQgKyBmb290ZXIxXHJcbiAgICAgICwgYXR0YWNobWVudHM6IE1haWxBdHRhY2htZW50cy5BdHRhY2htZW50QXJyYXlcclxuICAgIH1cclxuICAgIGxldCBzZW5kTWFpbFNlcnZpY2UgPSBuZXcgU2VuZE1haWxTZXJ2aWNlKCk7XHJcbiAgICBzZW5kTWFpbFNlcnZpY2Uuc2VuZE1haWwobWFpbE9wdGlvbnMsIGNhbGxiYWNrKTtcclxuXHJcbiAgfTtcclxuXHJcbiAgdXBkYXRlVXNlcihfaWQ6IHN0cmluZywgaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmZpbmRCeUlkKF9pZCwgKGVycjogYW55LCByZXM6IGFueSkgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyLCByZXMpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMudXNlclJlcG9zaXRvcnkudXBkYXRlKHJlcy5faWQsIGl0ZW0sIGNhbGxiYWNrKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgZXhwb3J0Q2FuZGlkYXRlQ29sbGVjdGlvbihjYWxsYmFjazogKGVycjogYW55LCByZXM6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IGNhbmRpZGF0ZUNoaWxkID0gc3Bhd24oJ21vbmdvZXhwb3J0JywgWyctLWhvc3QnLCAnNTIuMTAuMTQ1Ljg3JywgJy0tZGInLCBkYiwgJy0tY29sbGVjdGlvbicsICdjYW5kaWRhdGVzJywgJy0tdHlwZScsICdjc3YnLCAnLS1maWVsZHMnLFxyXG4gICAgICAnX2lkLHVzZXJJZCxqb2JfbGlzdCxwcm9maWNpZW5jaWVzLGVtcGxveW1lbnRIaXN0b3J5LGFjYWRlbWljcyxpbmR1c3RyeSxhd2FyZHMsaW50ZXJlc3RlZEluZHVzdHJpZXMsY2VydGlmaWNhdGlvbnMscHJvZmlsZV91cGRhdGVfdHJhY2tpbmcsaXNWaXNpYmxlLGlzU3VibWl0dGVkLGlzQ29tcGxldGVkLGNvbXBsZXhpdHlfbm90ZV9tYXRyaXgscHJvZmVzc2lvbmFsRGV0YWlscyxhYm91dE15c2VsZixqb2JUaXRsZSxsb2NhdGlvbixsYXN0VXBkYXRlQXQnLFxyXG4gICAgICAnLS1vdXQnLCAnL2hvbWUva2FwaWwvSmF2YVByb2plY3Qvbmc0LWNuZXh0L2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy9jYW5kaWRhdGVzLmNzdiddKTtcclxuXHJcbiAgICAvKmxldCBjYW5kaWRhdGVDaGlsZCA9IHNwYXduKCdtb25nb2V4cG9ydCcsIFsnLS11c2VybmFtZScsIHVzZXJuYW1lLCAnLS1wYXNzd29yZCcsIHBhc3N3b3JkLCctLWRiJywgZGIsICctLWNvbGxlY3Rpb24nLFxyXG4gICAgICdjYW5kaWRhdGVzJywgJy0tdHlwZScsICdjc3YnLCAnLS1maWVsZHMnLFxyXG4gICAgICdfaWQsdXNlcklkLGpvYl9saXN0LHByb2ZpY2llbmNpZXMsZW1wbG95bWVudEhpc3RvcnksYWNhZGVtaWNzLGluZHVzdHJ5LGF3YXJkcyxpbnRlcmVzdGVkSW5kdXN0cmllcyxjZXJ0aWZpY2F0aW9ucyxwcm9maWxlX3VwZGF0ZV90cmFja2luZyxpc1Zpc2libGUsaXNTdWJtaXR0ZWQsaXNDb21wbGV0ZWQsY29tcGxleGl0eV9ub3RlX21hdHJpeCxwcm9mZXNzaW9uYWxEZXRhaWxzLGFib3V0TXlzZWxmLGpvYlRpdGxlLGxvY2F0aW9uLGxhc3RVcGRhdGVBdCcsXHJcbiAgICAgJy0tb3V0JywgJy9ob21lL2JpdG5hbWkvYXBwcy9qb2Jtb3Npcy1zdGFnaW5nL2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy9jYW5kaWRhdGVzLmNzdiddKTsqL1xyXG5cclxuICAgIGNhbmRpZGF0ZUNoaWxkLm9uKCdleGl0JywgZnVuY3Rpb24gKGNvZGU6IGFueSkge1xyXG4gICAgICBpZiAoY29kZSAhPSAwKSB7XHJcbiAgICAgICAgY2FuZGlkYXRlQ2hpbGQua2lsbCgpO1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcigpLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjYW5kaWRhdGVDaGlsZC5raWxsKCk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgJ3N1Y2Nlc3MnKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgZXhwb3J0Q2FuZGlkYXRlT3RoZXJEZXRhaWxzQ29sbGVjdGlvbihjYWxsYmFjazogKGVycjogYW55LCByZXM6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IGNhbmRpZGF0ZU90aGVyRGV0YWlsc0NoaWxkID0gc3Bhd24oJ21vbmdvZXhwb3J0JywgWyctLWRiJywgZGIsICctLWNvbGxlY3Rpb24nLCAnY2FuZGlkYXRlcycsXHJcbiAgICAgICctLXR5cGUnLCAnY3N2JywgJy0tZmllbGRzJywgJ3VzZXJJZCxjYXBhYmlsaXR5X21hdHJpeCcsICctLW91dCcsXHJcbiAgICAgICcvaG9tZS9rYXBpbC9KYXZhUHJvamVjdC9uZzQtY25leHQvYy1uZXh0L2Rpc3Qvc2VydmVyL3Byb2QvcHVibGljL2NhbmRpZGF0ZXMtb3RoZXItZGV0YWlscy5jc3YnXSk7XHJcbiAgICAvKmxldCBjYW5kaWRhdGVPdGhlckRldGFpbHNDaGlsZCA9IHNwYXduKCdtb25nb2V4cG9ydCcsIFsnLS11c2VybmFtZScsIHVzZXJuYW1lLCAnLS1wYXNzd29yZCcsIHBhc3N3b3JkLCAnLS1kYicsIGRiLCAnLS1jb2xsZWN0aW9uJywgJ2NhbmRpZGF0ZXMnLFxyXG4gICAgICctLXR5cGUnLCAnY3N2JywgJy0tZmllbGRzJywgJ3VzZXJJZCxjYXBhYmlsaXR5X21hdHJpeCcsICctLW91dCcsXHJcbiAgICAgJy9ob21lL2JpdG5hbWkvYXBwcy9qb2Jtb3Npcy1zdGFnaW5nL2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy9jYW5kaWRhdGVzLW90aGVyLWRldGFpbHMuY3N2J10pOyovXHJcblxyXG4gICAgY2FuZGlkYXRlT3RoZXJEZXRhaWxzQ2hpbGQub24oJ2V4aXQnLCBmdW5jdGlvbiAoY29kZTogYW55KSB7XHJcbiAgICAgIGlmIChjb2RlICE9IDApIHtcclxuICAgICAgICBjYW5kaWRhdGVPdGhlckRldGFpbHNDaGlsZC5raWxsKCk7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKCksIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbmRpZGF0ZU90aGVyRGV0YWlsc0NoaWxkLmtpbGwoKTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCAnc3VjY2VzcycpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBleHBvcnRVc2VyQ29sbGVjdGlvbih1c2VyVHlwZTogc3RyaW5nLCBjYWxsYmFjazogKGVycjogYW55LCByZXM6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IHVzZXJDaGlsZDogYW55O1xyXG5cclxuICAgIGlmICh1c2VyVHlwZSA9PSAnY2FuZGlkYXRlJykge1xyXG4gICAgICB1c2VyQ2hpbGQgPSBzcGF3bignbW9uZ29leHBvcnQnLCBbJy0tZGInLCBkYiwgJy0tY29sbGVjdGlvbicsICd1c2VycycsICctLXR5cGUnLCAnY3N2JywgJy0tZmllbGRzJyxcclxuICAgICAgICAnX2lkLGZpcnN0X25hbWUsbGFzdF9uYW1lLG1vYmlsZV9udW1iZXIsZW1haWwsY3VycmVudF90aGVtZSxpc0NhbmRpZGF0ZSxndWlkZV90b3VyLG5vdGlmaWNhdGlvbnMsY29tcGxleGl0eUlzTXVzdEhhdmUsaXNBZG1pbixvdHAsaXNBY3RpdmF0ZWQsdGVtcF9tb2JpbGUnLFxyXG4gICAgICAgICctLW91dCcsICcvaG9tZS9rYXBpbC9KYXZhUHJvamVjdC9uZzQtY25leHQvYy1uZXh0L2Rpc3Qvc2VydmVyL3Byb2QvcHVibGljL3VzZXJzLmNzdicsICctLXF1ZXJ5JyxcclxuICAgICAgICAne1wiaXNDYW5kaWRhdGVcIjogdHJ1ZX0nXSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB1c2VyQ2hpbGQgPSBzcGF3bignbW9uZ29leHBvcnQnLCBbJy0tZGInLCBkYiwgJy0tY29sbGVjdGlvbicsICd1c2VycycsICctLXR5cGUnLCAnY3N2JywgJy0tZmllbGRzJyxcclxuICAgICAgICAnX2lkLG1vYmlsZV9udW1iZXIsZW1haWwsY3VycmVudF90aGVtZSxpc0NhbmRpZGF0ZSxndWlkZV90b3VyLG5vdGlmaWNhdGlvbnMsaXNBZG1pbixvdHAsaXNBY3RpdmF0ZWQsdGVtcF9tb2JpbGUsbG9jYXRpb24scGljdHVyZScsICctLW91dCcsXHJcbiAgICAgICAgJy9ob21lL2thcGlsL0phdmFQcm9qZWN0L25nNC1jbmV4dC9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvdXNlcnMuY3N2JyxcclxuICAgICAgICAnLS1xdWVyeScsICd7XCJpc0NhbmRpZGF0ZVwiOiBmYWxzZX0nXSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyppZiAodXNlclR5cGUgPT0gJ2NhbmRpZGF0ZScpIHtcclxuICAgICB1c2VyQ2hpbGQgPSBzcGF3bignbW9uZ29leHBvcnQnLCBbJy0tdXNlcm5hbWUnLCB1c2VybmFtZSwgJ3Bhc3N3b3JkJywgcGFzc3dvcmQsICctLWRiJywgZGIsICctLWNvbGxlY3Rpb24nLCAndXNlcnMnLCAnLS10eXBlJywgJ2NzdicsICctLWZpZWxkcycsXHJcbiAgICAgJ19pZCxmaXJzdF9uYW1lLGxhc3RfbmFtZSxtb2JpbGVfbnVtYmVyLGVtYWlsLGN1cnJlbnRfdGhlbWUsaXNDYW5kaWRhdGUsZ3VpZGVfdG91cixub3RpZmljYXRpb25zLGNvbXBsZXhpdHlJc011c3RIYXZlLGlzQWRtaW4sb3RwLGlzQWN0aXZhdGVkLHRlbXBfbW9iaWxlJyxcclxuICAgICAnLS1vdXQnLCAnL2hvbWUvYml0bmFtaS9hcHBzL2pvYm1vc2lzLXN0YWdpbmcvYy1uZXh0L2Rpc3Qvc2VydmVyL3Byb2QvcHVibGljL3VzZXJzLmNzdicsICctLXF1ZXJ5JyxcclxuICAgICAne1wiaXNDYW5kaWRhdGVcIjogdHJ1ZX0nXSk7XHJcbiAgICAgfSBlbHNlIHtcclxuICAgICB1c2VyQ2hpbGQgPSBzcGF3bignbW9uZ29leHBvcnQnLCBbJy0tdXNlcm5hbWUnLCB1c2VybmFtZSwgJ3Bhc3N3b3JkJywgcGFzc3dvcmQsICctLWRiJywgZGIsICctLWNvbGxlY3Rpb24nLCAndXNlcnMnLCAnLS10eXBlJywgJ2NzdicsICctLWZpZWxkcycsXHJcbiAgICAgJ19pZCxtb2JpbGVfbnVtYmVyLGVtYWlsLGN1cnJlbnRfdGhlbWUsaXNDYW5kaWRhdGUsZ3VpZGVfdG91cixub3RpZmljYXRpb25zLGlzQWRtaW4sb3RwLGlzQWN0aXZhdGVkLHRlbXBfbW9iaWxlLGxvY2F0aW9uLHBpY3R1cmUnLCAnLS1vdXQnLFxyXG4gICAgICcvaG9tZS9iaXRuYW1pL2FwcHMvam9ibW9zaXMtc3RhZ2luZy9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvdXNlcnMuY3N2JyxcclxuICAgICAnLS1xdWVyeScsICd7XCJpc0NhbmRpZGF0ZVwiOiBmYWxzZX0nXSk7XHJcbiAgICAgfSovXHJcblxyXG5cclxuICAgIHVzZXJDaGlsZC5vbignZXhpdCcsIGZ1bmN0aW9uIChjb2RlOiBhbnkpIHtcclxuICAgICAgaWYgKGNvZGUgIT0gMCkge1xyXG4gICAgICAgIHVzZXJDaGlsZC5raWxsKCk7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKCksIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHVzZXJDaGlsZC5raWxsKCk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgJ3N1Y2Nlc3MnKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBleHBvcnRSZWNydWl0ZXJDb2xsZWN0aW9uKGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAvKmxldCByZWNydWl0ZXJDaGlsZCA9IHNwYXduKCdtb25nb2V4cG9ydCcsWyctLWhvc3QnLCc1Mi4xMC4xNDUuODcnLCctLWRiJyxkYiwnLS1jb2xsZWN0aW9uJywncmVjcnVpdGVycycsJy0tdHlwZScsJ2NzdicsJy0tZmllbGRzJywnX2lkLHVzZXJJZCxpc1JlY3J1aXRpbmdGb3JzZWxmLGNvbXBhbnlfbmFtZSxjb21wYW55X3NpemUsY29tcGFueV93ZWJzaXRlLHBvc3RlZEpvYnMsc2V0T2ZEb2N1bWVudHMsY29tcGFueV9sb2dvJywnLS1vdXQnLCcvaG9tZS9rYXBpbC9KYXZhUHJvamVjdC9uZzQtY25leHQvYy1uZXh0L2Rpc3Qvc2VydmVyL3Byb2QvcHVibGljL3JlY3J1aXRlcnMuY3N2J10pOyovXHJcblxyXG4gICAgbGV0IHJlY3J1aXRlckNoaWxkID0gc3Bhd24oJ21vbmdvZXhwb3J0JyxbJy0tdXNlcm5hbWUnLHVzZXJuYW1lLCdwYXNzd29yZCcscGFzc3dvcmQsJy0tZGInLGRiLCctLWNvbGxlY3Rpb24nLCdyZWNydWl0ZXJzJywnLS10eXBlJywnY3N2JywnLS1maWVsZHMnLCdfaWQnLCctLW91dCcsJy9ob21lL2JpdG5hbWkvYXBwcy9qb2Jtb3Npcy1zdGFnaW5nL2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy9yZWNydWl0ZXJzLmNzdiddKTtcclxuICAgIHJlY3J1aXRlckNoaWxkLm9uKCdleGl0JywgZnVuY3Rpb24gKGNvZGU6IGFueSkge1xyXG4gICAgICBpZiAoY29kZSAhPSAwKSB7XHJcbiAgICAgICAgcmVjcnVpdGVyQ2hpbGQua2lsbCgpO1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcigpLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZWNydWl0ZXJDaGlsZC5raWxsKCk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgJ3N1Y2Nlc3MnKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgZXhwb3J0VXNhZ2VEZXRhaWxzQ29sbGVjdGlvbihjYWxsYmFjazogKGVycjogYW55LCByZXM6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IHVzYWdlRGV0YWlsc0NoaWxkID0gc3Bhd24oJ21vbmdvZXhwb3J0JywgWyctLWRiJywgZGIsICctLWNvbGxlY3Rpb24nLCAndXNlc3RyYWNraW5ncycsICctLXR5cGUnLCAnY3N2JyxcclxuICAgICAgJy0tZmllbGRzJywgJ19pZCxjYW5kaWRhdGVJZCxqb2JQcm9maWxlSWQsdGltZXN0YW1wLGFjdGlvbixfX3YnLCAnLS1vdXQnLFxyXG4gICAgICAnL2hvbWUva2FwaWwvSmF2YVByb2plY3Qvbmc0LWNuZXh0L2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy91c2FnZWRldGFpbC5jc3YnXSk7XHJcblxyXG4gICAgLypsZXQgdXNhZ2VEZXRhaWxzQ2hpbGQgPSBzcGF3bignbW9uZ29leHBvcnQnLCBbJy0tZGInLCBkYiwgJy0tY29sbGVjdGlvbicsICd1c2VzdHJhY2tpbmdzJywgJy0tdHlwZScsICdjc3YnLFxyXG4gICAgICctLWZpZWxkcycsICdfaWQsY2FuZGlkYXRlSWQsam9iUHJvZmlsZUlkLHRpbWVzdGFtcCxhY3Rpb24sX192JywgJy0tb3V0JyxcclxuICAgICAnL2hvbWUvYml0bmFtaS9hcHBzL2pvYm1vc2lzLXN0YWdpbmcvYy1uZXh0L2Rpc3Qvc2VydmVyL3Byb2QvcHVibGljL3VzYWdlZGV0YWlsLmNzdiddKTsqL1xyXG5cclxuICAgIHVzYWdlRGV0YWlsc0NoaWxkLm9uKCdleGl0JywgZnVuY3Rpb24gKGNvZGU6IGFueSkge1xyXG4gICAgICBpZiAoY29kZSAhPSAwKSB7XHJcbiAgICAgICAgdXNhZ2VEZXRhaWxzQ2hpbGQua2lsbCgpO1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcigpLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB1c2FnZURldGFpbHNDaGlsZC5raWxsKCk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgJ3N1Y2Nlc3MnKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbn1cclxuXHJcbk9iamVjdC5zZWFsKEFkbWluU2VydmljZSk7XHJcbmV4cG9ydCA9IEFkbWluU2VydmljZTtcclxuIl19
