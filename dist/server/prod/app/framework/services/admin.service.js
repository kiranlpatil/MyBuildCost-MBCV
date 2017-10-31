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
        var candidateChild = spawn('mongoexport', ['--host', '52.10.145.87', '--db', db, '--collection', 'candidates', '--type', 'csv', '--fields',
            '_id,userId,job_list,proficiencies,employmentHistory,academics,industry,awards,interestedIndustries,certifications,profile_update_tracking,isVisible,isSubmitted,isCompleted,complexity_note_matrix,professionalDetails,aboutMyself,jobTitle,location,lastUpdateAt',
            '--out', '/home/kapil/JavaProject/ng4-cnext/c-next/dist/server/prod/public/candidates.csv']);
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
    };
    AdminService.prototype.exportCandidateOtherDetailsCollection = function (callback) {
        console.log("inside exportCandidateDetailsCollection");
        var candidateOtherDetailsChild = spawn('mongoexport', ['--db', db, '--collection', 'candidates',
            '--type', 'csv', '--fields', 'userId,capability_matrix', '--out',
            '/home/kapil/JavaProject/ng4-cnext/c-next/dist/server/prod/public/candidates-other-details.csv']);
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
    };
    AdminService.prototype.exportUserCollection = function (userType, callback) {
        console.log("inside exportUserCollection");
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
                console.log('userChild process closed with code ' + code);
                userChild.kill();
                callback(null, 'success');
            }
        });
    };
    AdminService.prototype.exportRecruiterCollection = function (callback) {
        console.log("inside exportRecruiterCollection");
        var recruiterChild = spawn('mongoexport', ['--username', username, 'password', password, '--db', db, '--collection', 'recruiters', '--type', 'csv', '--fields', '_id', '--out', '/home/bitnami/apps/jobmosis-staging/c-next/dist/server/prod/public/recruiters.csv']);
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
    };
    AdminService.prototype.exportUsageDetailsCollection = function (callback) {
        console.log("inside exportUsageDetailsCollection");
        var usageDetailsChild = spawn('mongoexport', ['--db', db, '--collection', 'usestrackings', '--type', 'csv',
            '--fields', '_id,candidateId,jobProfileId,timestamp,action,__v', '--out',
            '/home/kapil/JavaProject/ng4-cnext/c-next/dist/server/prod/public/usagedetail.csv']);
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
    };
    return AdminService;
}());
Object.seal(AdminService);
module.exports = AdminService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvYWRtaW4uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBR0EseUVBQTRFO0FBQzVFLG9EQUF1RDtBQUN2RCw2Q0FBZ0Q7QUFDaEQsdURBQTBEO0FBQzFELG1GQUFzRjtBQUN0RiwyREFBOEQ7QUFDOUQsc0RBQXlEO0FBQ3pELHNEQUF5RDtBQUV6RCxpRkFBb0Y7QUFJcEYsNENBQStDO0FBQy9DLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzVDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFFM0MsSUFBSSxXQUFXLEdBQUcsc0JBQXNCLENBQUM7QUFFekMsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLElBQUksUUFBUSxHQUFHLGtCQUFrQixDQUFDO0FBRWxDLElBQUksRUFBRSxHQUFHLGtCQUFrQixDQUFDO0FBRTVCO0lBT0U7UUFDRSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztRQUNuRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1FBQ3JELElBQUksR0FBRyxHQUFRLElBQUksWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQy9DLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDO0lBQ2hELENBQUM7SUFFRCxzQ0FBZSxHQUFmLFVBQWdCLElBQVMsRUFBRSxRQUEyQztRQUNwRSxJQUFJLENBQUM7WUFDSCxJQUFJLGdCQUFnQixHQUFHLElBQUksZ0JBQWdCLEVB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SUFBSSxFQUFFLENBQUM7Z0JBQ3pCLFFBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDNUIsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBRUwsQ0FBQztJQUVILG1CQUFDO0FBQUQsQ0ExVkEsQUEwVkMsSUFBQTtBQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDMUIsaUJBQVMsWUFBWSxDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvc2VydmljZXMvYWRtaW4uc2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IHRlY2hwcmltZTAwMiBvbiA4LzI4LzIwMTcuXHJcbiAqL1xyXG5pbXBvcnQgVXNlclJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvdXNlci5yZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBTZW5kTWFpbFNlcnZpY2UgPSByZXF1aXJlKCcuL3NlbmRtYWlsLnNlcnZpY2UnKTtcclxuaW1wb3J0IE1lc3NhZ2VzID0gcmVxdWlyZSgnLi4vc2hhcmVkL21lc3NhZ2VzJyk7XHJcbmltcG9ydCBNYWlsQXR0YWNobWVudHMgPSByZXF1aXJlKCcuLi9zaGFyZWQvc2hhcmVkYXJyYXknKTtcclxuaW1wb3J0IFJlY3J1aXRlclJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvcmVjcnVpdGVyLnJlcG9zaXRvcnknKTtcclxuaW1wb3J0IFVzZXJzQ2xhc3NNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvdXNlcnMnKTtcclxuaW1wb3J0IENhbmRpZGF0ZVNlcnZpY2UgPSByZXF1aXJlKCcuL2NhbmRpZGF0ZS5zZXJ2aWNlJyk7XHJcbmltcG9ydCBSZWNydWl0ZXJTZXJ2aWNlID0gcmVxdWlyZSgnLi9yZWNydWl0ZXIuc2VydmljZScpO1xyXG5pbXBvcnQgSW5kdXN0cnlNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvaW5kdXN0cnkubW9kZWwnKTtcclxuaW1wb3J0IEluZHVzdHJ5UmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9pbmR1c3RyeS5yZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBDYW5kaWRhdGVNb2RlbENsYXNzID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9jYW5kaWRhdGVDbGFzcy5tb2RlbCcpO1xyXG5pbXBvcnQgUmVjcnVpdGVyQ2xhc3NNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcmVjcnVpdGVyQ2xhc3MubW9kZWwnKTtcclxuaW1wb3J0IENhbmRpZGF0ZUNsYXNzTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL2NhbmRpZGF0ZS1jbGFzcy5tb2RlbCcpO1xyXG5pbXBvcnQgVXNlclNlcnZpY2UgPSByZXF1aXJlKFwiLi91c2VyLnNlcnZpY2VcIik7XHJcbmxldCBjb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcclxubGV0IGZzID0gcmVxdWlyZSgnZnMnKTtcclxubGV0IHVzZXN0cmFja2luZyA9IHJlcXVpcmUoJ3VzZXMtdHJhY2tpbmcnKTtcclxubGV0IHNwYXduID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLnNwYXduO1xyXG5cclxubGV0IG1vbmdvRXhwb3J0ID0gJy91c3IvYmluL21vbmdvZXhwb3J0JztcclxuLy9sZXQgZGIgPSBjb25maWcuZ2V0KCdUcGxTZWVkLmRhdGFiYXNlLm5hbWUnKTtcclxubGV0IHVzZXJuYW1lID0gJ2FkbWluJztcclxubGV0IHBhc3N3b3JkID0gJ2pvYm1vc2lzYWRtaW4xMjMnO1xyXG5cclxubGV0IGRiID0gJ0pvYm1vc2lzLXN0YWdpbmcnO1xyXG4vL2xldCBkYiA9ICdjLW5leHQtYmFja2VuZCc7XHJcbmNsYXNzIEFkbWluU2VydmljZSB7XHJcbiAgY29tcGFueV9uYW1lOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSB1c2VyUmVwb3NpdG9yeTogVXNlclJlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSBpbmR1c3RyeVJlcG9zaXRpcnk6IEluZHVzdHJ5UmVwb3NpdG9yeTtcclxuICBwcml2YXRlIHJlY3J1aXRlclJlcG9zaXRvcnk6IFJlY3J1aXRlclJlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSB1c2VzVHJhY2tpbmdDb250cm9sbGVyOiBhbnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeSA9IG5ldyBVc2VyUmVwb3NpdG9yeSgpO1xyXG4gICAgdGhpcy5pbmR1c3RyeVJlcG9zaXRpcnkgPSBuZXcgSW5kdXN0cnlSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLnJlY3J1aXRlclJlcG9zaXRvcnkgPSBuZXcgUmVjcnVpdGVyUmVwb3NpdG9yeSgpO1xyXG4gICAgbGV0IG9iajogYW55ID0gbmV3IHVzZXN0cmFja2luZy5NeUNvbnRyb2xsZXIoKTtcclxuICAgIHRoaXMudXNlc1RyYWNraW5nQ29udHJvbGxlciA9IG9iai5fY29udHJvbGxlcjtcclxuICB9XHJcblxyXG4gIGdldENvdW50T2ZVc2VycyhpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCBjYW5kaWRhdGVTZXJ2aWNlID0gbmV3IENhbmRpZGF0ZVNlcnZpY2UoKTtcclxuICAgICAgbGV0IHJlY3J1aXRlclNlcnZpY2UgPSBuZXcgUmVjcnVpdGVyU2VydmljZSgpO1xyXG4gICAgICBsZXQgdXNlcnM6IFVzZXJzQ2xhc3NNb2RlbCA9IG5ldyBVc2Vyc0NsYXNzTW9kZWwoKTtcclxuICAgICAgbGV0IGZpbmRRdWVyeSA9IG5ldyBPYmplY3QoKTtcclxuXHJcbiAgICAgIGNhbmRpZGF0ZVNlcnZpY2UuZ2V0VG90YWxDYW5kaWRhdGVDb3VudCgoZXJyb3IsIGNhbmRpZGF0ZUNvdW50KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHVzZXJzLnRvdGFsTnVtYmVyT2ZDYW5kaWRhdGVzID0gY2FuZGlkYXRlQ291bnQ7XHJcbiAgICAgICAgICByZWNydWl0ZXJTZXJ2aWNlLmdldFRvdGFsUmVjcnVpdGVyQ291bnQoKGVycm9yLCByZWNydWl0ZXJDb3VudCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdXNlcnMudG90YWxOdW1iZXJPZlJlY3J1aXRlcnMgPSByZWNydWl0ZXJDb3VudDtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB1c2Vycyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaFxyXG4gICAgICAoZSkge1xyXG4gICAgICBjYWxsYmFjayhlLCBudWxsKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBnZXRSZWNydWl0ZXJEZXRhaWxzKGluaXRpYWw6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCB1c2VyczogVXNlcnNDbGFzc01vZGVsID0gbmV3IFVzZXJzQ2xhc3NNb2RlbCgpO1xyXG4gICAgICBsZXQgdXNlcnNNYXA6IE1hcDxhbnksIGFueT4gPSBuZXcgTWFwKCk7XHJcblxyXG4gICAgICBsZXQgcmVjcnVpdGVyU2VydmljZSA9IG5ldyBSZWNydWl0ZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCByZWNydWl0ZXJzOiBSZWNydWl0ZXJDbGFzc01vZGVsW10gPSBuZXcgQXJyYXkoMCk7XHJcblxyXG4gICAgICBsZXQgcmVnRXggPSBuZXcgUmVnRXhwKCdeWycgKyBpbml0aWFsLnRvTG93ZXJDYXNlKCkgKyBpbml0aWFsLnRvVXBwZXJDYXNlKCkgKyAnXScpO1xyXG4gICAgICBsZXQgZmluZFF1ZXJ5ID0ge1xyXG4gICAgICAgICdjb21wYW55X25hbWUnOiB7XHJcbiAgICAgICAgICAkcmVnZXg6IHJlZ0V4XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGxldCBzb3J0aW5nUXVlcnkgPSB7J2NvbXBhbnlfbmFtZSc6IDEsICdjb21wYW55X3NpemUnOiAxfTtcclxuXHJcbiAgICAgIGxldCByZWNydWl0ZXJGaWVsZHMgPSB7XHJcbiAgICAgICAgJ3VzZXJJZCc6IDEsXHJcbiAgICAgICAgJ2NvbXBhbnlfbmFtZSc6IDEsXHJcbiAgICAgICAgJ2NvbXBhbnlfc2l6ZSc6IDEsXHJcbiAgICAgICAgJ3Bvc3RlZEpvYnMuaXNKb2JQb3N0ZWQnOiAxXHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZWNydWl0ZXJTZXJ2aWNlLnJldHJpZXZlQnlTb3J0ZWRPcmRlcihmaW5kUXVlcnksIHJlY3J1aXRlckZpZWxkcywgc29ydGluZ1F1ZXJ5LCAoZXJyb3IsIHJlY3J1aXRlclJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB1c2Vycy50b3RhbE51bWJlck9mUmVjcnVpdGVycyA9IHJlY3J1aXRlclJlc3VsdC5sZW5ndGg7XHJcbiAgICAgICAgICBpZiAocmVjcnVpdGVyUmVzdWx0Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHVzZXJzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgdXNlckZpZWxkcyA9IHtcclxuICAgICAgICAgICAgICAnX2lkJzogMSxcclxuICAgICAgICAgICAgICAnbW9iaWxlX251bWJlcic6IDEsXHJcbiAgICAgICAgICAgICAgJ2VtYWlsJzogMSxcclxuICAgICAgICAgICAgICAnaXNBY3RpdmF0ZWQnOiAxXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCByZWNydWl0ZXIgb2YgcmVjcnVpdGVyUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgdXNlcnNNYXAuc2V0KHJlY3J1aXRlci51c2VySWQudG9TdHJpbmcoKSwgcmVjcnVpdGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB1c2VyU2VydmljZS5yZXRyaWV2ZVdpdGhMZWFuKHsnaXNDYW5kaWRhdGUnOiBmYWxzZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmV0Y2hlZCBhbGwgcmVjcnVpdGVycyBmcm9tIHVzZXJzOlwiICsgcmVjcnVpdGVyUmVzdWx0Lmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB1c2VyIG9mIHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICBpZiAodXNlcnNNYXAuZ2V0KHVzZXIuX2lkLnRvU3RyaW5nKCkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlci5kYXRhID0gdXNlcnNNYXAuZ2V0KHVzZXIuX2lkLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlY3J1aXRlcnMucHVzaCh1c2VyKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHVzZXJzLnJlY3J1aXRlciA9IHJlY3J1aXRlcnM7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB1c2Vycyk7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGNhdGNoXHJcbiAgICAgIChlKSB7XHJcbiAgICAgIGNhbGxiYWNrKGUsIG51bGwpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGdldENhbmRpZGF0ZURldGFpbHMoaW5pdGlhbDogc3RyaW5nLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgbGV0IHVzZXJzOiBVc2Vyc0NsYXNzTW9kZWwgPSBuZXcgVXNlcnNDbGFzc01vZGVsKCk7XHJcbiAgICAgIGxldCB1c2Vyc01hcDogTWFwPGFueSwgYW55PiA9IG5ldyBNYXAoKTtcclxuXHJcbiAgICAgIGxldCBjYW5kaWRhdGVzOiBDYW5kaWRhdGVNb2RlbENsYXNzW10gPSBuZXcgQXJyYXkoMCk7XHJcbiAgICAgIGxldCBjYW5kaWRhdGVTZXJ2aWNlID0gbmV3IENhbmRpZGF0ZVNlcnZpY2UoKTtcclxuXHJcbiAgICAgIGxldCByZWdFeCA9IG5ldyBSZWdFeHAoJ15bJyArIGluaXRpYWwudG9Mb3dlckNhc2UoKSArIGluaXRpYWwudG9VcHBlckNhc2UoKSArICddJyk7XHJcbiAgICAgIGxldCBmaW5kUXVlcnkgPSB7XHJcbiAgICAgICAgJ2ZpcnN0X25hbWUnOiB7XHJcbiAgICAgICAgICAkcmVnZXg6IHJlZ0V4XHJcbiAgICAgICAgfSxcclxuICAgICAgICAnaXNBZG1pbic6IGZhbHNlLFxyXG4gICAgICAgICdpc0NhbmRpZGF0ZSc6IHRydWVcclxuICAgICAgfTtcclxuICAgICAgbGV0IGluY2x1ZGVkX2ZpZWxkcyA9IHtcclxuICAgICAgICAnX2lkJzogMSxcclxuICAgICAgICAnZmlyc3RfbmFtZSc6IDEsXHJcbiAgICAgICAgJ2xhc3RfbmFtZSc6IDEsXHJcbiAgICAgICAgJ21vYmlsZV9udW1iZXInOiAxLFxyXG4gICAgICAgICdlbWFpbCc6IDEsXHJcbiAgICAgICAgJ2lzQWN0aXZhdGVkJzogMVxyXG4gICAgICB9O1xyXG4gICAgICBsZXQgc29ydGluZ1F1ZXJ5ID0geydmaXJzdF9uYW1lJzogMSwgJ2xhc3RfbmFtZSc6IDF9O1xyXG5cclxuICAgICAgdXNlclNlcnZpY2UucmV0cmlldmVCeVNvcnRlZE9yZGVyKGZpbmRRdWVyeSwgaW5jbHVkZWRfZmllbGRzLCBzb3J0aW5nUXVlcnksIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHVzZXJzLnRvdGFsTnVtYmVyT2ZDYW5kaWRhdGVzID0gcmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXNlcnMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IDA7XHJcbiAgICAgICAgICAgIGxldCBjYW5kaWRhdGVGaWVsZHMgPSB7XHJcbiAgICAgICAgICAgICAgJ3VzZXJJZCc6IDEsXHJcbiAgICAgICAgICAgICAgJ2pvYlRpdGxlJzogMSxcclxuICAgICAgICAgICAgICAnaXNDb21wbGV0ZWQnOiAxLFxyXG4gICAgICAgICAgICAgICdpc1N1Ym1pdHRlZCc6IDEsXHJcbiAgICAgICAgICAgICAgJ2lzVmlzaWJsZSc6IDEsXHJcbiAgICAgICAgICAgICAgJ2xvY2F0aW9uLmNpdHknOiAxXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGNhbmRpZGF0ZVNlcnZpY2UucmV0cmlldmVXaXRoTGVhbih7fSwgY2FuZGlkYXRlRmllbGRzLCAoZXJyb3IsIGNhbmRpZGF0ZXNSZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGZXRjaGVkIGFsbCBjYW5kaWRhdGVzOlwiICsgY2FuZGlkYXRlc1Jlc3VsdC5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgY2FuZGlkYXRlIG9mIGNhbmRpZGF0ZXNSZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgdXNlcnNNYXAuc2V0KGNhbmRpZGF0ZS51c2VySWQudG9TdHJpbmcoKSwgY2FuZGlkYXRlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB1c2VyIG9mIHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICB1c2VyLmRhdGEgPSB1c2Vyc01hcC5nZXQodXNlci5faWQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZXMucHVzaCh1c2VyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB1c2Vycy5jYW5kaWRhdGUgPSBjYW5kaWRhdGVzO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXNlcnMpO1xyXG5cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBjYWxsYmFjayhlLCBudWxsKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBzZW5kQWRtaW5Mb2dpbkluZm9NYWlsKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCBoZWFkZXIxID0gZnMucmVhZEZpbGVTeW5jKCcuL3NyYy9zZXJ2ZXIvYXBwL2ZyYW1ld29yay9wdWJsaWMvaGVhZGVyMS5odG1sJykudG9TdHJpbmcoKTtcclxuICAgIGxldCBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKCcuL3NyYy9zZXJ2ZXIvYXBwL2ZyYW1ld29yay9wdWJsaWMvYWRtaW5sb2dpbmluZm8ubWFpbC5odG1sJykudG9TdHJpbmcoKTtcclxuICAgIGxldCBmb290ZXIxID0gZnMucmVhZEZpbGVTeW5jKCcuL3NyYy9zZXJ2ZXIvYXBwL2ZyYW1ld29yay9wdWJsaWMvZm9vdGVyMS5odG1sJykudG9TdHJpbmcoKTtcclxuICAgIGxldCBtaWRfY29udGVudCA9IGNvbnRlbnQucmVwbGFjZSgnJGVtYWlsJCcsIGZpZWxkLmVtYWlsKS5yZXBsYWNlKCckYWRkcmVzcyQnLCAoZmllbGQubG9jYXRpb24gPT09IHVuZGVmaW5lZCkgPyAnTm90IEZvdW5kJyA6IGZpZWxkLmxvY2F0aW9uKVxyXG4gICAgICAucmVwbGFjZSgnJGlwJCcsIGZpZWxkLmlwKS5yZXBsYWNlKCckaG9zdCQnLCBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuaG9zdCcpKTtcclxuXHJcblxyXG4gICAgbGV0IG1haWxPcHRpb25zID0ge1xyXG4gICAgICBmcm9tOiBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuTUFJTF9TRU5ERVInKSxcclxuICAgICAgdG86IGNvbmZpZy5nZXQoJ1RwbFNlZWQubWFpbC5BRE1JTl9NQUlMJyksXHJcbiAgICAgIGNjOiBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuVFBMR1JPVVBfTUFJTCcpLFxyXG4gICAgICBzdWJqZWN0OiBNZXNzYWdlcy5FTUFJTF9TVUJKRUNUX0FETUlOX0xPR0dFRF9PTiArIFwiIFwiICsgY29uZmlnLmdldCgnVHBsU2VlZC5tYWlsLmhvc3QnKSxcclxuICAgICAgaHRtbDogaGVhZGVyMSArIG1pZF9jb250ZW50ICsgZm9vdGVyMVxyXG4gICAgICAsIGF0dGFjaG1lbnRzOiBNYWlsQXR0YWNobWVudHMuQXR0YWNobWVudEFycmF5XHJcbiAgICB9XHJcbiAgICBsZXQgc2VuZE1haWxTZXJ2aWNlID0gbmV3IFNlbmRNYWlsU2VydmljZSgpO1xyXG4gICAgc2VuZE1haWxTZXJ2aWNlLnNlbmRNYWlsKG1haWxPcHRpb25zLCBjYWxsYmFjayk7XHJcblxyXG4gIH07XHJcblxyXG4gIHVwZGF0ZVVzZXIoX2lkOiBzdHJpbmcsIGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kQnlJZChfaWQsIChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgcmVzKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnVwZGF0ZShyZXMuX2lkLCBpdGVtLCBjYWxsYmFjayk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGV4cG9ydENhbmRpZGF0ZUNvbGxlY3Rpb24oY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiaW5zaWRlIGV4cG9ydENhbmRpZGF0ZUNvbGxlY3Rpb25cIik7XHJcbiAgICBsZXQgY2FuZGlkYXRlQ2hpbGQgPSBzcGF3bignbW9uZ29leHBvcnQnLCBbJy0taG9zdCcsICc1Mi4xMC4xNDUuODcnLCAnLS1kYicsIGRiLCAnLS1jb2xsZWN0aW9uJywgJ2NhbmRpZGF0ZXMnLCAnLS10eXBlJywgJ2NzdicsICctLWZpZWxkcycsXHJcbiAgICAgICdfaWQsdXNlcklkLGpvYl9saXN0LHByb2ZpY2llbmNpZXMsZW1wbG95bWVudEhpc3RvcnksYWNhZGVtaWNzLGluZHVzdHJ5LGF3YXJkcyxpbnRlcmVzdGVkSW5kdXN0cmllcyxjZXJ0aWZpY2F0aW9ucyxwcm9maWxlX3VwZGF0ZV90cmFja2luZyxpc1Zpc2libGUsaXNTdWJtaXR0ZWQsaXNDb21wbGV0ZWQsY29tcGxleGl0eV9ub3RlX21hdHJpeCxwcm9mZXNzaW9uYWxEZXRhaWxzLGFib3V0TXlzZWxmLGpvYlRpdGxlLGxvY2F0aW9uLGxhc3RVcGRhdGVBdCcsXHJcbiAgICAgICctLW91dCcsICcvaG9tZS9rYXBpbC9KYXZhUHJvamVjdC9uZzQtY25leHQvYy1uZXh0L2Rpc3Qvc2VydmVyL3Byb2QvcHVibGljL2NhbmRpZGF0ZXMuY3N2J10pO1xyXG5cclxuICAgIC8qbGV0IGNhbmRpZGF0ZUNoaWxkID0gc3Bhd24oJ21vbmdvZXhwb3J0JywgWyctLXVzZXJuYW1lJywgdXNlcm5hbWUsICctLXBhc3N3b3JkJywgcGFzc3dvcmQsJy0tZGInLCBkYiwgJy0tY29sbGVjdGlvbicsXHJcbiAgICAgJ2NhbmRpZGF0ZXMnLCAnLS10eXBlJywgJ2NzdicsICctLWZpZWxkcycsXHJcbiAgICAgJ19pZCx1c2VySWQsam9iX2xpc3QscHJvZmljaWVuY2llcyxlbXBsb3ltZW50SGlzdG9yeSxhY2FkZW1pY3MsaW5kdXN0cnksYXdhcmRzLGludGVyZXN0ZWRJbmR1c3RyaWVzLGNlcnRpZmljYXRpb25zLHByb2ZpbGVfdXBkYXRlX3RyYWNraW5nLGlzVmlzaWJsZSxpc1N1Ym1pdHRlZCxpc0NvbXBsZXRlZCxjb21wbGV4aXR5X25vdGVfbWF0cml4LHByb2Zlc3Npb25hbERldGFpbHMsYWJvdXRNeXNlbGYsam9iVGl0bGUsbG9jYXRpb24sbGFzdFVwZGF0ZUF0JyxcclxuICAgICAnLS1vdXQnLCAnL2hvbWUvYml0bmFtaS9hcHBzL2pvYm1vc2lzLXN0YWdpbmcvYy1uZXh0L2Rpc3Qvc2VydmVyL3Byb2QvcHVibGljL2NhbmRpZGF0ZXMuY3N2J10pOyovXHJcblxyXG4gICAgY2FuZGlkYXRlQ2hpbGQub24oJ2V4aXQnLCBmdW5jdGlvbiAoY29kZTogYW55KSB7XHJcbiAgICAgIGlmIChjb2RlICE9IDApIHtcclxuICAgICAgICBjYW5kaWRhdGVDaGlsZC5raWxsKCk7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKCksIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjYW5kaWRhdGVDaGlsZCBwcm9jZXNzIGNsb3NlZCB3aXRoIGNvZGUgJyArIGNvZGUpO1xyXG4gICAgICAgIGNhbmRpZGF0ZUNoaWxkLmtpbGwoKTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCAnc3VjY2VzcycpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBleHBvcnRDYW5kaWRhdGVPdGhlckRldGFpbHNDb2xsZWN0aW9uKGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcImluc2lkZSBleHBvcnRDYW5kaWRhdGVEZXRhaWxzQ29sbGVjdGlvblwiKTtcclxuICAgIGxldCBjYW5kaWRhdGVPdGhlckRldGFpbHNDaGlsZCA9IHNwYXduKCdtb25nb2V4cG9ydCcsIFsnLS1kYicsIGRiLCAnLS1jb2xsZWN0aW9uJywgJ2NhbmRpZGF0ZXMnLFxyXG4gICAgICAnLS10eXBlJywgJ2NzdicsICctLWZpZWxkcycsICd1c2VySWQsY2FwYWJpbGl0eV9tYXRyaXgnLCAnLS1vdXQnLFxyXG4gICAgICAnL2hvbWUva2FwaWwvSmF2YVByb2plY3Qvbmc0LWNuZXh0L2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy9jYW5kaWRhdGVzLW90aGVyLWRldGFpbHMuY3N2J10pO1xyXG4gICAgLypsZXQgY2FuZGlkYXRlT3RoZXJEZXRhaWxzQ2hpbGQgPSBzcGF3bignbW9uZ29leHBvcnQnLCBbJy0tdXNlcm5hbWUnLCB1c2VybmFtZSwgJy0tcGFzc3dvcmQnLCBwYXNzd29yZCwgJy0tZGInLCBkYiwgJy0tY29sbGVjdGlvbicsICdjYW5kaWRhdGVzJyxcclxuICAgICAnLS10eXBlJywgJ2NzdicsICctLWZpZWxkcycsICd1c2VySWQsY2FwYWJpbGl0eV9tYXRyaXgnLCAnLS1vdXQnLFxyXG4gICAgICcvaG9tZS9iaXRuYW1pL2FwcHMvam9ibW9zaXMtc3RhZ2luZy9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvY2FuZGlkYXRlcy1vdGhlci1kZXRhaWxzLmNzdiddKTsqL1xyXG5cclxuICAgIGNhbmRpZGF0ZU90aGVyRGV0YWlsc0NoaWxkLm9uKCdleGl0JywgZnVuY3Rpb24gKGNvZGU6IGFueSkge1xyXG4gICAgICBpZiAoY29kZSAhPSAwKSB7XHJcbiAgICAgICAgY2FuZGlkYXRlT3RoZXJEZXRhaWxzQ2hpbGQua2lsbCgpO1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcigpLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnY2FuZGlkYXRlT3RoZXJEZXRhaWxzQ2hpbGQgcHJvY2VzcyBjbG9zZWQgd2l0aCBjb2RlICcgKyBjb2RlKTtcclxuICAgICAgICBjYW5kaWRhdGVPdGhlckRldGFpbHNDaGlsZC5raWxsKCk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgJ3N1Y2Nlc3MnKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgZXhwb3J0VXNlckNvbGxlY3Rpb24odXNlclR5cGU6IHN0cmluZywgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiaW5zaWRlIGV4cG9ydFVzZXJDb2xsZWN0aW9uXCIpO1xyXG4gICAgbGV0IHVzZXJDaGlsZDogYW55O1xyXG5cclxuICAgIGlmICh1c2VyVHlwZSA9PSAnY2FuZGlkYXRlJykge1xyXG4gICAgICB1c2VyQ2hpbGQgPSBzcGF3bignbW9uZ29leHBvcnQnLCBbJy0tZGInLCBkYiwgJy0tY29sbGVjdGlvbicsICd1c2VycycsICctLXR5cGUnLCAnY3N2JywgJy0tZmllbGRzJyxcclxuICAgICAgICAnX2lkLGZpcnN0X25hbWUsbGFzdF9uYW1lLG1vYmlsZV9udW1iZXIsZW1haWwsY3VycmVudF90aGVtZSxpc0NhbmRpZGF0ZSxndWlkZV90b3VyLG5vdGlmaWNhdGlvbnMsY29tcGxleGl0eUlzTXVzdEhhdmUsaXNBZG1pbixvdHAsaXNBY3RpdmF0ZWQsdGVtcF9tb2JpbGUnLFxyXG4gICAgICAgICctLW91dCcsICcvaG9tZS9rYXBpbC9KYXZhUHJvamVjdC9uZzQtY25leHQvYy1uZXh0L2Rpc3Qvc2VydmVyL3Byb2QvcHVibGljL3VzZXJzLmNzdicsICctLXF1ZXJ5JyxcclxuICAgICAgICAne1wiaXNDYW5kaWRhdGVcIjogdHJ1ZX0nXSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB1c2VyQ2hpbGQgPSBzcGF3bignbW9uZ29leHBvcnQnLCBbJy0tZGInLCBkYiwgJy0tY29sbGVjdGlvbicsICd1c2VycycsICctLXR5cGUnLCAnY3N2JywgJy0tZmllbGRzJyxcclxuICAgICAgICAnX2lkLG1vYmlsZV9udW1iZXIsZW1haWwsY3VycmVudF90aGVtZSxpc0NhbmRpZGF0ZSxndWlkZV90b3VyLG5vdGlmaWNhdGlvbnMsaXNBZG1pbixvdHAsaXNBY3RpdmF0ZWQsdGVtcF9tb2JpbGUsbG9jYXRpb24scGljdHVyZScsICctLW91dCcsXHJcbiAgICAgICAgJy9ob21lL2thcGlsL0phdmFQcm9qZWN0L25nNC1jbmV4dC9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvdXNlcnMuY3N2JyxcclxuICAgICAgICAnLS1xdWVyeScsICd7XCJpc0NhbmRpZGF0ZVwiOiBmYWxzZX0nXSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyppZiAodXNlclR5cGUgPT0gJ2NhbmRpZGF0ZScpIHtcclxuICAgICB1c2VyQ2hpbGQgPSBzcGF3bignbW9uZ29leHBvcnQnLCBbJy0tdXNlcm5hbWUnLCB1c2VybmFtZSwgJ3Bhc3N3b3JkJywgcGFzc3dvcmQsICctLWRiJywgZGIsICctLWNvbGxlY3Rpb24nLCAndXNlcnMnLCAnLS10eXBlJywgJ2NzdicsICctLWZpZWxkcycsXHJcbiAgICAgJ19pZCxmaXJzdF9uYW1lLGxhc3RfbmFtZSxtb2JpbGVfbnVtYmVyLGVtYWlsLGN1cnJlbnRfdGhlbWUsaXNDYW5kaWRhdGUsZ3VpZGVfdG91cixub3RpZmljYXRpb25zLGNvbXBsZXhpdHlJc011c3RIYXZlLGlzQWRtaW4sb3RwLGlzQWN0aXZhdGVkLHRlbXBfbW9iaWxlJyxcclxuICAgICAnLS1vdXQnLCAnL2hvbWUvYml0bmFtaS9hcHBzL2pvYm1vc2lzLXN0YWdpbmcvYy1uZXh0L2Rpc3Qvc2VydmVyL3Byb2QvcHVibGljL3VzZXJzLmNzdicsICctLXF1ZXJ5JyxcclxuICAgICAne1wiaXNDYW5kaWRhdGVcIjogdHJ1ZX0nXSk7XHJcbiAgICAgfSBlbHNlIHtcclxuICAgICB1c2VyQ2hpbGQgPSBzcGF3bignbW9uZ29leHBvcnQnLCBbJy0tdXNlcm5hbWUnLCB1c2VybmFtZSwgJ3Bhc3N3b3JkJywgcGFzc3dvcmQsICctLWRiJywgZGIsICctLWNvbGxlY3Rpb24nLCAndXNlcnMnLCAnLS10eXBlJywgJ2NzdicsICctLWZpZWxkcycsXHJcbiAgICAgJ19pZCxtb2JpbGVfbnVtYmVyLGVtYWlsLGN1cnJlbnRfdGhlbWUsaXNDYW5kaWRhdGUsZ3VpZGVfdG91cixub3RpZmljYXRpb25zLGlzQWRtaW4sb3RwLGlzQWN0aXZhdGVkLHRlbXBfbW9iaWxlLGxvY2F0aW9uLHBpY3R1cmUnLCAnLS1vdXQnLFxyXG4gICAgICcvaG9tZS9iaXRuYW1pL2FwcHMvam9ibW9zaXMtc3RhZ2luZy9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvdXNlcnMuY3N2JyxcclxuICAgICAnLS1xdWVyeScsICd7XCJpc0NhbmRpZGF0ZVwiOiBmYWxzZX0nXSk7XHJcbiAgICAgfSovXHJcblxyXG5cclxuICAgIHVzZXJDaGlsZC5vbignZXhpdCcsIGZ1bmN0aW9uIChjb2RlOiBhbnkpIHtcclxuICAgICAgaWYgKGNvZGUgIT0gMCkge1xyXG4gICAgICAgIHVzZXJDaGlsZC5raWxsKCk7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKCksIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCd1c2VyQ2hpbGQgcHJvY2VzcyBjbG9zZWQgd2l0aCBjb2RlICcgKyBjb2RlKTtcclxuICAgICAgICB1c2VyQ2hpbGQua2lsbCgpO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsICdzdWNjZXNzJyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZXhwb3J0UmVjcnVpdGVyQ29sbGVjdGlvbihjYWxsYmFjazogKGVycjogYW55LCByZXM6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgY29uc29sZS5sb2coXCJpbnNpZGUgZXhwb3J0UmVjcnVpdGVyQ29sbGVjdGlvblwiKTtcclxuICAgIC8qbGV0IHJlY3J1aXRlckNoaWxkID0gc3Bhd24oJ21vbmdvZXhwb3J0JyxbJy0taG9zdCcsJzUyLjEwLjE0NS44NycsJy0tZGInLGRiLCctLWNvbGxlY3Rpb24nLCdyZWNydWl0ZXJzJywnLS10eXBlJywnY3N2JywnLS1maWVsZHMnLCdfaWQsdXNlcklkLGlzUmVjcnVpdGluZ0ZvcnNlbGYsY29tcGFueV9uYW1lLGNvbXBhbnlfc2l6ZSxjb21wYW55X3dlYnNpdGUscG9zdGVkSm9icyxzZXRPZkRvY3VtZW50cyxjb21wYW55X2xvZ28nLCctLW91dCcsJy9ob21lL2thcGlsL0phdmFQcm9qZWN0L25nNC1jbmV4dC9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvcmVjcnVpdGVycy5jc3YnXSk7Ki9cclxuXHJcbiAgICBsZXQgcmVjcnVpdGVyQ2hpbGQgPSBzcGF3bignbW9uZ29leHBvcnQnLFsnLS11c2VybmFtZScsdXNlcm5hbWUsJ3Bhc3N3b3JkJyxwYXNzd29yZCwnLS1kYicsZGIsJy0tY29sbGVjdGlvbicsJ3JlY3J1aXRlcnMnLCctLXR5cGUnLCdjc3YnLCctLWZpZWxkcycsJ19pZCcsJy0tb3V0JywnL2hvbWUvYml0bmFtaS9hcHBzL2pvYm1vc2lzLXN0YWdpbmcvYy1uZXh0L2Rpc3Qvc2VydmVyL3Byb2QvcHVibGljL3JlY3J1aXRlcnMuY3N2J10pO1xyXG4gICAgcmVjcnVpdGVyQ2hpbGQub24oJ2V4aXQnLCBmdW5jdGlvbiAoY29kZTogYW55KSB7XHJcbiAgICAgIGlmIChjb2RlICE9IDApIHtcclxuICAgICAgICByZWNydWl0ZXJDaGlsZC5raWxsKCk7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKCksIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdyZWNydWl0ZXJDaGlsZCBwcm9jZXNzIGNsb3NlZCB3aXRoIGNvZGUgJyArIGNvZGUpO1xyXG4gICAgICAgIHJlY3J1aXRlckNoaWxkLmtpbGwoKTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCAnc3VjY2VzcycpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICBleHBvcnRVc2FnZURldGFpbHNDb2xsZWN0aW9uKGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcImluc2lkZSBleHBvcnRVc2FnZURldGFpbHNDb2xsZWN0aW9uXCIpO1xyXG4gICAgbGV0IHVzYWdlRGV0YWlsc0NoaWxkID0gc3Bhd24oJ21vbmdvZXhwb3J0JywgWyctLWRiJywgZGIsICctLWNvbGxlY3Rpb24nLCAndXNlc3RyYWNraW5ncycsICctLXR5cGUnLCAnY3N2JyxcclxuICAgICAgJy0tZmllbGRzJywgJ19pZCxjYW5kaWRhdGVJZCxqb2JQcm9maWxlSWQsdGltZXN0YW1wLGFjdGlvbixfX3YnLCAnLS1vdXQnLFxyXG4gICAgICAnL2hvbWUva2FwaWwvSmF2YVByb2plY3Qvbmc0LWNuZXh0L2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy91c2FnZWRldGFpbC5jc3YnXSk7XHJcblxyXG4gICAgLypsZXQgdXNhZ2VEZXRhaWxzQ2hpbGQgPSBzcGF3bignbW9uZ29leHBvcnQnLCBbJy0tZGInLCBkYiwgJy0tY29sbGVjdGlvbicsICd1c2VzdHJhY2tpbmdzJywgJy0tdHlwZScsICdjc3YnLFxyXG4gICAgICctLWZpZWxkcycsICdfaWQsY2FuZGlkYXRlSWQsam9iUHJvZmlsZUlkLHRpbWVzdGFtcCxhY3Rpb24sX192JywgJy0tb3V0JyxcclxuICAgICAnL2hvbWUvYml0bmFtaS9hcHBzL2pvYm1vc2lzLXN0YWdpbmcvYy1uZXh0L2Rpc3Qvc2VydmVyL3Byb2QvcHVibGljL3VzYWdlZGV0YWlsLmNzdiddKTsqL1xyXG5cclxuICAgIHVzYWdlRGV0YWlsc0NoaWxkLm9uKCdleGl0JywgZnVuY3Rpb24gKGNvZGU6IGFueSkge1xyXG4gICAgICBpZiAoY29kZSAhPSAwKSB7XHJcbiAgICAgICAgdXNhZ2VEZXRhaWxzQ2hpbGQua2lsbCgpO1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcigpLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZygndXNhZ2VEZXRhaWxzQ2hpbGQgcHJvY2VzcyBjbG9zZWQgd2l0aCBjb2RlICcgKyBjb2RlKTtcclxuICAgICAgICB1c2FnZURldGFpbHNDaGlsZC5raWxsKCk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgJ3N1Y2Nlc3MnKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbn1cclxuXHJcbk9iamVjdC5zZWFsKEFkbWluU2VydmljZSk7XHJcbmV4cG9ydCA9IEFkbWluU2VydmljZTtcclxuIl19
