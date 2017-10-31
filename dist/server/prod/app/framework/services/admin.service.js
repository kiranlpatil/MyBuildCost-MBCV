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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvYWRtaW4uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBR0EseUVBQTRFO0FBQzVFLG9EQUF1RDtBQUN2RCw2Q0FBZ0Q7QUFDaEQsdURBQTBEO0FBQzFELG1GQUFzRjtBQUN0RiwyREFBOEQ7QUFDOUQsc0RBQXlEO0FBQ3pELHNEQUF5RDtBQUV6RCxpRkFBb0Y7QUFJcEYsNENBQStDO0FBQy9DLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzVDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFFM0MsSUFBSSxXQUFXLEdBQUcsc0JBQXNCLENBQUM7QUFFekMsSUFBSSxFQUFFLEdBQUcsa0JBQWtCLENBQUM7QUFDNUIsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLElBQUksUUFBUSxHQUFHLGtCQUFrQixDQUFDO0FBRWxDO0lBT0U7UUFDRSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztRQUNuRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1FBQ3JELElBQUksR0FBRyxHQUFRLElBQUksWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQy9DLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDO0lBQ2hELENBQUM7SUFFRCxzQ0FBZSxHQUFmLFVBQWdCLElBQVMsRUFBRSxRQUEyQztRQUNwRSxJQUFJLENBQUM7WUFDSCxJQUFJLGdCQUFnQixHQUFHLElBQUksZ0JBQWdCLEVB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QUM5QixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sT0FBTyxDQUFDLEdBQUcsQ0FBQyw2Q0FBNkMsR0FBRyxJQUFJLENBQUMsQ0FBQztnQkFDbEUsaUJBQWlCLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3pCLFFBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDNUIsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBVSxHQUFRO1lBQ3BELE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDOUMsTUFBTSxJQUFJLEdBQUcsQ0FBQztRQUNoQixDQUFDLENBQUMsQ0FBQztJQUVMLENBQUM7SUFFSCxtQkFBQztBQUFELENBcFdBLEFBb1dDLElBQUE7QUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzFCLGlCQUFTLFlBQVksQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL3NlcnZpY2VzL2FkbWluLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQ3JlYXRlZCBieSB0ZWNocHJpbWUwMDIgb24gOC8yOC8yMDE3LlxyXG4gKi9cclxuaW1wb3J0IFVzZXJSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L3VzZXIucmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgU2VuZE1haWxTZXJ2aWNlID0gcmVxdWlyZSgnLi9zZW5kbWFpbC5zZXJ2aWNlJyk7XHJcbmltcG9ydCBNZXNzYWdlcyA9IHJlcXVpcmUoJy4uL3NoYXJlZC9tZXNzYWdlcycpO1xyXG5pbXBvcnQgTWFpbEF0dGFjaG1lbnRzID0gcmVxdWlyZSgnLi4vc2hhcmVkL3NoYXJlZGFycmF5Jyk7XHJcbmltcG9ydCBSZWNydWl0ZXJSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L3JlY3J1aXRlci5yZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBVc2Vyc0NsYXNzTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3VzZXJzJyk7XHJcbmltcG9ydCBDYW5kaWRhdGVTZXJ2aWNlID0gcmVxdWlyZSgnLi9jYW5kaWRhdGUuc2VydmljZScpO1xyXG5pbXBvcnQgUmVjcnVpdGVyU2VydmljZSA9IHJlcXVpcmUoJy4vcmVjcnVpdGVyLnNlcnZpY2UnKTtcclxuaW1wb3J0IEluZHVzdHJ5TW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL2luZHVzdHJ5Lm1vZGVsJyk7XHJcbmltcG9ydCBJbmR1c3RyeVJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvaW5kdXN0cnkucmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgQ2FuZGlkYXRlTW9kZWxDbGFzcyA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvY2FuZGlkYXRlQ2xhc3MubW9kZWwnKTtcclxuaW1wb3J0IFJlY3J1aXRlckNsYXNzTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3JlY3J1aXRlckNsYXNzLm1vZGVsJyk7XHJcbmltcG9ydCBDYW5kaWRhdGVDbGFzc01vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9jYW5kaWRhdGUtY2xhc3MubW9kZWwnKTtcclxuaW1wb3J0IFVzZXJTZXJ2aWNlID0gcmVxdWlyZShcIi4vdXNlci5zZXJ2aWNlXCIpO1xyXG5sZXQgY29uZmlnID0gcmVxdWlyZSgnY29uZmlnJyk7XHJcbmxldCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XHJcbmxldCB1c2VzdHJhY2tpbmcgPSByZXF1aXJlKCd1c2VzLXRyYWNraW5nJyk7XHJcbmxldCBzcGF3biA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5zcGF3bjtcclxuXHJcbmxldCBtb25nb0V4cG9ydCA9ICcvdXNyL2Jpbi9tb25nb2V4cG9ydCc7XHJcbi8vL2xldCBkYiA9IGNvbmZpZy5nZXQoJ1RwbFNlZWQuZGF0YWJhc2UubmFtZScpO1xyXG5sZXQgZGIgPSAnSm9ibW9zaXMtc3RhZ2luZyc7XHJcbmxldCB1c2VybmFtZSA9ICdhZG1pbic7XHJcbmxldCBwYXNzd29yZCA9ICdqb2Jtb3Npc2FkbWluMTIzJztcclxuXHJcbmNsYXNzIEFkbWluU2VydmljZSB7XHJcbiAgY29tcGFueV9uYW1lOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSB1c2VyUmVwb3NpdG9yeTogVXNlclJlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSBpbmR1c3RyeVJlcG9zaXRpcnk6IEluZHVzdHJ5UmVwb3NpdG9yeTtcclxuICBwcml2YXRlIHJlY3J1aXRlclJlcG9zaXRvcnk6IFJlY3J1aXRlclJlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSB1c2VzVHJhY2tpbmdDb250cm9sbGVyOiBhbnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeSA9IG5ldyBVc2VyUmVwb3NpdG9yeSgpO1xyXG4gICAgdGhpcy5pbmR1c3RyeVJlcG9zaXRpcnkgPSBuZXcgSW5kdXN0cnlSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLnJlY3J1aXRlclJlcG9zaXRvcnkgPSBuZXcgUmVjcnVpdGVyUmVwb3NpdG9yeSgpO1xyXG4gICAgbGV0IG9iajogYW55ID0gbmV3IHVzZXN0cmFja2luZy5NeUNvbnRyb2xsZXIoKTtcclxuICAgIHRoaXMudXNlc1RyYWNraW5nQ29udHJvbGxlciA9IG9iai5fY29udHJvbGxlcjtcclxuICB9XHJcblxyXG4gIGdldENvdW50T2ZVc2VycyhpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCBjYW5kaWRhdGVTZXJ2aWNlID0gbmV3IENhbmRpZGF0ZVNlcnZpY2UoKTtcclxuICAgICAgbGV0IHJlY3J1aXRlclNlcnZpY2UgPSBuZXcgUmVjcnVpdGVyU2VydmljZSgpO1xyXG4gICAgICBsZXQgdXNlcnM6IFVzZXJzQ2xhc3NNb2RlbCA9IG5ldyBVc2Vyc0NsYXNzTW9kZWwoKTtcclxuICAgICAgbGV0IGZpbmRRdWVyeSA9IG5ldyBPYmplY3QoKTtcclxuXHJcbiAgICAgIGNhbmRpZGF0ZVNlcnZpY2UuZ2V0VG90YWxDYW5kaWRhdGVDb3VudCgoZXJyb3IsIGNhbmRpZGF0ZUNvdW50KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHVzZXJzLnRvdGFsTnVtYmVyT2ZDYW5kaWRhdGVzID0gY2FuZGlkYXRlQ291bnQ7XHJcbiAgICAgICAgICByZWNydWl0ZXJTZXJ2aWNlLmdldFRvdGFsUmVjcnVpdGVyQ291bnQoKGVycm9yLCByZWNydWl0ZXJDb3VudCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdXNlcnMudG90YWxOdW1iZXJPZlJlY3J1aXRlcnMgPSByZWNydWl0ZXJDb3VudDtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB1c2Vycyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaFxyXG4gICAgICAoZSkge1xyXG4gICAgICBjYWxsYmFjayhlLCBudWxsKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBnZXRSZWNydWl0ZXJEZXRhaWxzKGluaXRpYWw6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IHVzZXJTZXJ2aWNlID0gbmV3IFVzZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCB1c2VyczogVXNlcnNDbGFzc01vZGVsID0gbmV3IFVzZXJzQ2xhc3NNb2RlbCgpO1xyXG4gICAgICBsZXQgdXNlcnNNYXA6IE1hcDxhbnksIGFueT4gPSBuZXcgTWFwKCk7XHJcblxyXG4gICAgICBsZXQgcmVjcnVpdGVyU2VydmljZSA9IG5ldyBSZWNydWl0ZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGxldCByZWNydWl0ZXJzOiBSZWNydWl0ZXJDbGFzc01vZGVsW10gPSBuZXcgQXJyYXkoMCk7XHJcblxyXG4gICAgICBsZXQgcmVnRXggPSBuZXcgUmVnRXhwKCdeWycgKyBpbml0aWFsLnRvTG93ZXJDYXNlKCkgKyBpbml0aWFsLnRvVXBwZXJDYXNlKCkgKyAnXScpO1xyXG4gICAgICBsZXQgZmluZFF1ZXJ5ID0ge1xyXG4gICAgICAgICdjb21wYW55X25hbWUnOiB7XHJcbiAgICAgICAgICAkcmVnZXg6IHJlZ0V4XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGxldCBzb3J0aW5nUXVlcnkgPSB7J2NvbXBhbnlfbmFtZSc6IDEsICdjb21wYW55X3NpemUnOiAxfTtcclxuXHJcbiAgICAgIGxldCByZWNydWl0ZXJGaWVsZHMgPSB7XHJcbiAgICAgICAgJ3VzZXJJZCc6IDEsXHJcbiAgICAgICAgJ2NvbXBhbnlfbmFtZSc6IDEsXHJcbiAgICAgICAgJ2NvbXBhbnlfc2l6ZSc6IDEsXHJcbiAgICAgICAgJ3Bvc3RlZEpvYnMuaXNKb2JQb3N0ZWQnOiAxXHJcbiAgICAgIH07XHJcblxyXG4gICAgICByZWNydWl0ZXJTZXJ2aWNlLnJldHJpZXZlQnlTb3J0ZWRPcmRlcihmaW5kUXVlcnksIHJlY3J1aXRlckZpZWxkcywgc29ydGluZ1F1ZXJ5LCAoZXJyb3IsIHJlY3J1aXRlclJlc3VsdCkgPT4ge1xyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB1c2Vycy50b3RhbE51bWJlck9mUmVjcnVpdGVycyA9IHJlY3J1aXRlclJlc3VsdC5sZW5ndGg7XHJcbiAgICAgICAgICBpZiAocmVjcnVpdGVyUmVzdWx0Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHVzZXJzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgdXNlckZpZWxkcyA9IHtcclxuICAgICAgICAgICAgICAnX2lkJzogMSxcclxuICAgICAgICAgICAgICAnbW9iaWxlX251bWJlcic6IDEsXHJcbiAgICAgICAgICAgICAgJ2VtYWlsJzogMSxcclxuICAgICAgICAgICAgICAnaXNBY3RpdmF0ZWQnOiAxXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCByZWNydWl0ZXIgb2YgcmVjcnVpdGVyUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgdXNlcnNNYXAuc2V0KHJlY3J1aXRlci51c2VySWQudG9TdHJpbmcoKSwgcmVjcnVpdGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB1c2VyU2VydmljZS5yZXRyaWV2ZVdpdGhMZWFuKHsnaXNDYW5kaWRhdGUnOiBmYWxzZX0sIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmV0Y2hlZCBhbGwgcmVjcnVpdGVycyBmcm9tIHVzZXJzOlwiICsgcmVjcnVpdGVyUmVzdWx0Lmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB1c2VyIG9mIHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICBpZiAodXNlcnNNYXAuZ2V0KHVzZXIuX2lkLnRvU3RyaW5nKCkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlci5kYXRhID0gdXNlcnNNYXAuZ2V0KHVzZXIuX2lkLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlY3J1aXRlcnMucHVzaCh1c2VyKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHVzZXJzLnJlY3J1aXRlciA9IHJlY3J1aXRlcnM7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB1c2Vycyk7XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGNhdGNoXHJcbiAgICAgIChlKSB7XHJcbiAgICAgIGNhbGxiYWNrKGUsIG51bGwpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGdldENhbmRpZGF0ZURldGFpbHMoaW5pdGlhbDogc3RyaW5nLCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcclxuICAgICAgbGV0IHVzZXJzOiBVc2Vyc0NsYXNzTW9kZWwgPSBuZXcgVXNlcnNDbGFzc01vZGVsKCk7XHJcbiAgICAgIGxldCB1c2Vyc01hcDogTWFwPGFueSwgYW55PiA9IG5ldyBNYXAoKTtcclxuXHJcbiAgICAgIGxldCBjYW5kaWRhdGVzOiBDYW5kaWRhdGVNb2RlbENsYXNzW10gPSBuZXcgQXJyYXkoMCk7XHJcbiAgICAgIGxldCBjYW5kaWRhdGVTZXJ2aWNlID0gbmV3IENhbmRpZGF0ZVNlcnZpY2UoKTtcclxuXHJcbiAgICAgIGxldCByZWdFeCA9IG5ldyBSZWdFeHAoJ15bJyArIGluaXRpYWwudG9Mb3dlckNhc2UoKSArIGluaXRpYWwudG9VcHBlckNhc2UoKSArICddJyk7XHJcbiAgICAgIGxldCBmaW5kUXVlcnkgPSB7XHJcbiAgICAgICAgJ2ZpcnN0X25hbWUnOiB7XHJcbiAgICAgICAgICAkcmVnZXg6IHJlZ0V4XHJcbiAgICAgICAgfSxcclxuICAgICAgICAnaXNBZG1pbic6IGZhbHNlLFxyXG4gICAgICAgICdpc0NhbmRpZGF0ZSc6IHRydWVcclxuICAgICAgfTtcclxuICAgICAgbGV0IGluY2x1ZGVkX2ZpZWxkcyA9IHtcclxuICAgICAgICAnX2lkJzogMSxcclxuICAgICAgICAnZmlyc3RfbmFtZSc6IDEsXHJcbiAgICAgICAgJ2xhc3RfbmFtZSc6IDEsXHJcbiAgICAgICAgJ21vYmlsZV9udW1iZXInOiAxLFxyXG4gICAgICAgICdlbWFpbCc6IDEsXHJcbiAgICAgICAgJ2lzQWN0aXZhdGVkJzogMVxyXG4gICAgICB9O1xyXG4gICAgICBsZXQgc29ydGluZ1F1ZXJ5ID0geydmaXJzdF9uYW1lJzogMSwgJ2xhc3RfbmFtZSc6IDF9O1xyXG5cclxuICAgICAgdXNlclNlcnZpY2UucmV0cmlldmVCeVNvcnRlZE9yZGVyKGZpbmRRdWVyeSwgaW5jbHVkZWRfZmllbGRzLCBzb3J0aW5nUXVlcnksIChlcnJvciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHVzZXJzLnRvdGFsTnVtYmVyT2ZDYW5kaWRhdGVzID0gcmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXNlcnMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IDA7XHJcbiAgICAgICAgICAgIGxldCBjYW5kaWRhdGVGaWVsZHMgPSB7XHJcbiAgICAgICAgICAgICAgJ3VzZXJJZCc6IDEsXHJcbiAgICAgICAgICAgICAgJ2pvYlRpdGxlJzogMSxcclxuICAgICAgICAgICAgICAnaXNDb21wbGV0ZWQnOiAxLFxyXG4gICAgICAgICAgICAgICdpc1N1Ym1pdHRlZCc6IDEsXHJcbiAgICAgICAgICAgICAgJ2lzVmlzaWJsZSc6IDEsXHJcbiAgICAgICAgICAgICAgJ2xvY2F0aW9uLmNpdHknOiAxXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGNhbmRpZGF0ZVNlcnZpY2UucmV0cmlldmVXaXRoTGVhbih7fSwgY2FuZGlkYXRlRmllbGRzLCAoZXJyb3IsIGNhbmRpZGF0ZXNSZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGZXRjaGVkIGFsbCBjYW5kaWRhdGVzOlwiICsgY2FuZGlkYXRlc1Jlc3VsdC5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgY2FuZGlkYXRlIG9mIGNhbmRpZGF0ZXNSZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgdXNlcnNNYXAuc2V0KGNhbmRpZGF0ZS51c2VySWQudG9TdHJpbmcoKSwgY2FuZGlkYXRlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB1c2VyIG9mIHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICB1c2VyLmRhdGEgPSB1c2Vyc01hcC5nZXQodXNlci5faWQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZXMucHVzaCh1c2VyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB1c2Vycy5jYW5kaWRhdGUgPSBjYW5kaWRhdGVzO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXNlcnMpO1xyXG5cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBjYWxsYmFjayhlLCBudWxsKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBzZW5kQWRtaW5Mb2dpbkluZm9NYWlsKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCBoZWFkZXIxID0gZnMucmVhZEZpbGVTeW5jKCcuL3NyYy9zZXJ2ZXIvYXBwL2ZyYW1ld29yay9wdWJsaWMvaGVhZGVyMS5odG1sJykudG9TdHJpbmcoKTtcclxuICAgIGxldCBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKCcuL3NyYy9zZXJ2ZXIvYXBwL2ZyYW1ld29yay9wdWJsaWMvYWRtaW5sb2dpbmluZm8ubWFpbC5odG1sJykudG9TdHJpbmcoKTtcclxuICAgIGxldCBmb290ZXIxID0gZnMucmVhZEZpbGVTeW5jKCcuL3NyYy9zZXJ2ZXIvYXBwL2ZyYW1ld29yay9wdWJsaWMvZm9vdGVyMS5odG1sJykudG9TdHJpbmcoKTtcclxuICAgIGxldCBtaWRfY29udGVudCA9IGNvbnRlbnQucmVwbGFjZSgnJGVtYWlsJCcsIGZpZWxkLmVtYWlsKS5yZXBsYWNlKCckYWRkcmVzcyQnLCAoZmllbGQubG9jYXRpb24gPT09IHVuZGVmaW5lZCkgPyAnTm90IEZvdW5kJyA6IGZpZWxkLmxvY2F0aW9uKVxyXG4gICAgICAucmVwbGFjZSgnJGlwJCcsIGZpZWxkLmlwKS5yZXBsYWNlKCckaG9zdCQnLCBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuaG9zdCcpKTtcclxuXHJcblxyXG4gICAgbGV0IG1haWxPcHRpb25zID0ge1xyXG4gICAgICBmcm9tOiBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuTUFJTF9TRU5ERVInKSxcclxuICAgICAgdG86IGNvbmZpZy5nZXQoJ1RwbFNlZWQubWFpbC5BRE1JTl9NQUlMJyksXHJcbiAgICAgIGNjOiBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuVFBMR1JPVVBfTUFJTCcpLFxyXG4gICAgICBzdWJqZWN0OiBNZXNzYWdlcy5FTUFJTF9TVUJKRUNUX0FETUlOX0xPR0dFRF9PTiArIFwiIFwiICsgY29uZmlnLmdldCgnVHBsU2VlZC5tYWlsLmhvc3QnKSxcclxuICAgICAgaHRtbDogaGVhZGVyMSArIG1pZF9jb250ZW50ICsgZm9vdGVyMVxyXG4gICAgICAsIGF0dGFjaG1lbnRzOiBNYWlsQXR0YWNobWVudHMuQXR0YWNobWVudEFycmF5XHJcbiAgICB9XHJcbiAgICBsZXQgc2VuZE1haWxTZXJ2aWNlID0gbmV3IFNlbmRNYWlsU2VydmljZSgpO1xyXG4gICAgc2VuZE1haWxTZXJ2aWNlLnNlbmRNYWlsKG1haWxPcHRpb25zLCBjYWxsYmFjayk7XHJcblxyXG4gIH07XHJcblxyXG4gIHVwZGF0ZVVzZXIoX2lkOiBzdHJpbmcsIGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kQnlJZChfaWQsIChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgcmVzKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LnVwZGF0ZShyZXMuX2lkLCBpdGVtLCBjYWxsYmFjayk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGV4cG9ydENhbmRpZGF0ZUNvbGxlY3Rpb24oY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiaW5zaWRlIGV4cG9ydENhbmRpZGF0ZUNvbGxlY3Rpb25cIik7XHJcbiAgICBsZXQgc3RkZXJyOiBhbnkgPSAnJztcclxuXHJcbiAgICAvKmxldCBjYW5kaWRhdGVDaGlsZCA9IHNwYXduKCdtb25nb2V4cG9ydCcsWyctLWRiJyxkYiwnLS1jb2xsZWN0aW9uJywnY2FuZGlkYXRlcycsJy0tdHlwZScsJ2NzdicsJy0tZmllbGRzJywnX2lkLHVzZXJJZCxqb2JfbGlzdCxwcm9maWNpZW5jaWVzLGVtcGxveW1lbnRIaXN0b3J5LGFjYWRlbWljcyxpbmR1c3RyeSxhd2FyZHMsaW50ZXJlc3RlZEluZHVzdHJpZXMsY2VydGlmaWNhdGlvbnMscHJvZmlsZV91cGRhdGVfdHJhY2tpbmcsaXNWaXNpYmxlLGlzU3VibWl0dGVkLGlzQ29tcGxldGVkLGNvbXBsZXhpdHlfbm90ZV9tYXRyaXgscHJvZmVzc2lvbmFsRGV0YWlscyxhYm91dE15c2VsZixqb2JUaXRsZSxsb2NhdGlvbixsYXN0VXBkYXRlQXQnLCctLW91dCcsJy9ob21lL2thcGlsL0phdmFQcm9qZWN0L25nNC1jbmV4dC9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvY2FuZGlkYXRlcy5jc3YnXSk7Ki9cclxuXHJcbiAgICBsZXQgY2FuZGlkYXRlQ2hpbGQgPSBzcGF3bignbW9uZ29leHBvcnQnLCBbJy0tdXNlcm5hbWUnLCB1c2VybmFtZSwgJy0tcGFzc3dvcmQnLCBwYXNzd29yZCwgJy0tZGInLCBkYiwgJy0tY29sbGVjdGlvbicsICdjYW5kaWRhdGVzJywgJy0tdHlwZScsICdjc3YnLCAnLS1maWVsZHMnLCAnX2lkLHVzZXJJZCxqb2JfbGlzdCxwcm9maWNpZW5jaWVzLGVtcGxveW1lbnRIaXN0b3J5LGFjYWRlbWljcyxpbmR1c3RyeSxhd2FyZHMsaW50ZXJlc3RlZEluZHVzdHJpZXMsY2VydGlmaWNhdGlvbnMscHJvZmlsZV91cGRhdGVfdHJhY2tpbmcsaXNWaXNpYmxlLGlzU3VibWl0dGVkLGlzQ29tcGxldGVkLGNvbXBsZXhpdHlfbm90ZV9tYXRyaXgscHJvZmVzc2lvbmFsRGV0YWlscyxhYm91dE15c2VsZixqb2JUaXRsZSxsb2NhdGlvbixsYXN0VXBkYXRlQXQnLCAnLS1vdXQnLCAnL2hvbWUvYml0bmFtaS9hcHBzL2pvYm1vc2lzLXN0YWdpbmcvYy1uZXh0L2Rpc3Qvc2VydmVyL3Byb2QvcHVibGljL2NhbmRpZGF0ZXMuY3N2J10pO1xyXG5cclxuICAgIGNhbmRpZGF0ZUNoaWxkLm9uKCdleGl0JywgZnVuY3Rpb24gKGNvZGU6IGFueSkge1xyXG4gICAgICBpZiAoY29kZSAhPSAwKSB7XHJcbiAgICAgICAgY2FuZGlkYXRlQ2hpbGQua2lsbCgpO1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcigpLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnY2FuZGlkYXRlQ2hpbGQgcHJvY2VzcyBjbG9zZWQgd2l0aCBjb2RlICcgKyBjb2RlKTtcclxuICAgICAgICBjYW5kaWRhdGVDaGlsZC5raWxsKCk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgJ3N1Y2Nlc3MnKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgY2FuZGlkYXRlQ2hpbGQuc3RkZXJyLm9uKCdkYXRhJywgZnVuY3Rpb24gKGJ1ZjogYW55KSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdbU1RSXSBzdGRlcnIgXCIlc1wiJywgU3RyaW5nKGJ1ZikpO1xyXG4gICAgICBzdGRlcnIgKz0gYnVmO1xyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgZXhwb3J0Q2FuZGlkYXRlT3RoZXJEZXRhaWxzQ29sbGVjdGlvbihjYWxsYmFjazogKGVycjogYW55LCByZXM6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgY29uc29sZS5sb2coXCJpbnNpZGUgZXhwb3J0Q2FuZGlkYXRlRGV0YWlsc0NvbGxlY3Rpb25cIik7XHJcbiAgICBsZXQgc3RkZXJyOiBhbnkgPSAnJztcclxuICAgIC8qbGV0IGNhbmRpZGF0ZU90aGVyRGV0YWlsc0NoaWxkID0gc3Bhd24oJ21vbmdvZXhwb3J0JyxbJy0tZGInLGRiLCctLWNvbGxlY3Rpb24nLCdjYW5kaWRhdGVzJywnLS10eXBlJywnY3N2JywnLS1maWVsZHMnLCd1c2VySWQsY2FwYWJpbGl0eV9tYXRyaXgnLCctLW91dCcsJy9ob21lL2thcGlsL0phdmFQcm9qZWN0L25nNC1jbmV4dC9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvY2FuZGlkYXRlcy1vdGhlci1kZXRhaWxzLmNzdiddKTsqL1xyXG4gICAgbGV0IGNhbmRpZGF0ZU90aGVyRGV0YWlsc0NoaWxkID0gc3Bhd24oJ21vbmdvZXhwb3J0JywgWyctLXVzZXJuYW1lJywgdXNlcm5hbWUsICctLXBhc3N3b3JkJywgcGFzc3dvcmQsICctLWRiJywgZGIsICctLWNvbGxlY3Rpb24nLCAnY2FuZGlkYXRlcycsICctLXR5cGUnLCAnY3N2JywgJy0tZmllbGRzJywgJ3VzZXJJZCxjYXBhYmlsaXR5X21hdHJpeCcsICctLW91dCcsICcvaG9tZS9iaXRuYW1pL2FwcHMvam9ibW9zaXMtc3RhZ2luZy9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvY2FuZGlkYXRlcy1vdGhlci1kZXRhaWxzLmNzdiddKTtcclxuXHJcbiAgICBjYW5kaWRhdGVPdGhlckRldGFpbHNDaGlsZC5vbignZXhpdCcsIGZ1bmN0aW9uIChjb2RlOiBhbnkpIHtcclxuICAgICAgaWYgKGNvZGUgIT0gMCkge1xyXG4gICAgICAgIGNhbmRpZGF0ZU90aGVyRGV0YWlsc0NoaWxkLmtpbGwoKTtcclxuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoKSwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2NhbmRpZGF0ZU90aGVyRGV0YWlsc0NoaWxkIHByb2Nlc3MgY2xvc2VkIHdpdGggY29kZSAnICsgY29kZSk7XHJcbiAgICAgICAgY2FuZGlkYXRlT3RoZXJEZXRhaWxzQ2hpbGQua2lsbCgpO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsICdzdWNjZXNzJyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGNhbmRpZGF0ZU90aGVyRGV0YWlsc0NoaWxkLnN0ZGVyci5vbignZGF0YScsIGZ1bmN0aW9uIChidWY6IGFueSkge1xyXG4gICAgICBjb25zb2xlLmxvZygnW1NUUl0gc3RkZXJyIFwiJXNcIicsIFN0cmluZyhidWYpKTtcclxuICAgICAgc3RkZXJyICs9IGJ1ZjtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIGV4cG9ydFVzZXJDb2xsZWN0aW9uKHVzZXJUeXBlOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcImluc2lkZSBleHBvcnRVc2VyQ29sbGVjdGlvblwiKTtcclxuICAgIGxldCB1c2VyQ2hpbGQ6IGFueTtcclxuICAgIGxldCBzdGRlcnI6IGFueSA9ICcnO1xyXG5cclxuICAgIC8qaWYgKHVzZXJUeXBlID09ICdjYW5kaWRhdGUnKSB7XHJcbiAgICAgdXNlckNoaWxkID0gc3Bhd24oJ21vbmdvZXhwb3J0JywgWyctLWRiJyxkYiwnLS1jb2xsZWN0aW9uJywndXNlcnMnLCctLXR5cGUnLCdjc3YnLCctLWZpZWxkcycsJ19pZCxmaXJzdF9uYW1lLGxhc3RfbmFtZSxtb2JpbGVfbnVtYmVyLGVtYWlsLGN1cnJlbnRfdGhlbWUsaXNDYW5kaWRhdGUsZ3VpZGVfdG91cixub3RpZmljYXRpb25zLGNvbXBsZXhpdHlJc011c3RIYXZlLGlzQWRtaW4sb3RwLGlzQWN0aXZhdGVkLHRlbXBfbW9iaWxlJywnLS1vdXQnLCcvaG9tZS9rYXBpbC9KYXZhUHJvamVjdC9uZzQtY25leHQvYy1uZXh0L2Rpc3Qvc2VydmVyL3Byb2QvcHVibGljL3VzZXJzLmNzdicsJy0tcXVlcnknLCd7XCJpc0NhbmRpZGF0ZVwiOnRydWV9J10pO1xyXG4gICAgIH0gZWxzZSB7XHJcbiAgICAgdXNlckNoaWxkID0gc3Bhd24oJ21vbmdvZXhwb3J0JywgWyctLWRiJyxkYiwnLS1jb2xsZWN0aW9uJywndXNlcnMnLCctLXR5cGUnLCdjc3YnLCctLWZpZWxkcycsJ19pZCxtb2JpbGVfbnVtYmVyLGVtYWlsLGN1cnJlbnRfdGhlbWUsaXNDYW5kaWRhdGUsZ3VpZGVfdG91cixub3RpZmljYXRpb25zLGlzQWRtaW4sb3RwLGlzQWN0aXZhdGVkLHRlbXBfbW9iaWxlLGxvY2F0aW9uLHBpY3R1cmUnLCctLW91dCcsJy9ob21lL2thcGlsL0phdmFQcm9qZWN0L25nNC1jbmV4dC9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvdXNlcnMuY3N2JywnLS1xdWVyeScsJ3tcImlzQ2FuZGlkYXRlXCI6ZmFsc2V9J10pO1xyXG4gICAgIH0qL1xyXG5cclxuICAgIGlmICh1c2VyVHlwZSA9PSAnY2FuZGlkYXRlJykge1xyXG4gICAgICB1c2VyQ2hpbGQgPSBzcGF3bignbW9uZ29leHBvcnQnLCBbJy0tdXNlcm5hbWUnLCB1c2VybmFtZSwgJy0tcGFzc3dvcmQnLCBwYXNzd29yZCwgJy0tZGInLCBkYiwgJy0tY29sbGVjdGlvbicsICd1c2VycycsICctLXR5cGUnLCAnY3N2JywgJy0tZmllbGRzJywgJ19pZCxmaXJzdF9uYW1lLGxhc3RfbmFtZSxtb2JpbGVfbnVtYmVyLGVtYWlsLGN1cnJlbnRfdGhlbWUsaXNDYW5kaWRhdGUsZ3VpZGVfdG91cixub3RpZmljYXRpb25zLGNvbXBsZXhpdHlJc011c3RIYXZlLGlzQWRtaW4sb3RwLGlzQWN0aXZhdGVkLHRlbXBfbW9iaWxlJywgJy0tb3V0JywgJy9ob21lL2JpdG5hbWkvYXBwcy9qb2Jtb3Npcy1zdGFnaW5nL2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy91c2Vycy5jc3YnLCAnLS1xdWVyeScsICd7XCJpc0NhbmRpZGF0ZVwiOnRydWV9J10pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdXNlckNoaWxkID0gc3Bhd24oJ21vbmdvZXhwb3J0JywgWyctLXVzZXJuYW1lJywgdXNlcm5hbWUsICctLXBhc3N3b3JkJywgcGFzc3dvcmQsICctLWRiJywgZGIsICctLWNvbGxlY3Rpb24nLCAndXNlcnMnLCAnLS10eXBlJywgJ2NzdicsICctLWZpZWxkcycsICdfaWQsbW9iaWxlX251bWJlcixlbWFpbCxjdXJyZW50X3RoZW1lLGlzQ2FuZGlkYXRlLGd1aWRlX3RvdXIsbm90aWZpY2F0aW9ucyxpc0FkbWluLG90cCxpc0FjdGl2YXRlZCx0ZW1wX21vYmlsZSxsb2NhdGlvbixwaWN0dXJlJywgJy0tb3V0JywgJy9ob21lL2JpdG5hbWkvYXBwcy9qb2Jtb3Npcy1zdGFnaW5nL2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy91c2Vycy5jc3YnLCAnLS1xdWVyeScsICd7XCJpc0NhbmRpZGF0ZVwiOmZhbHNlfSddKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgdXNlckNoaWxkLm9uKCdleGl0JywgZnVuY3Rpb24gKGNvZGU6IGFueSkge1xyXG4gICAgICBpZiAoY29kZSAhPSAwKSB7XHJcbiAgICAgICAgdXNlckNoaWxkLmtpbGwoKTtcclxuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoKSwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3VzZXJDaGlsZCBwcm9jZXNzIGNsb3NlZCB3aXRoIGNvZGUgJyArIGNvZGUpO1xyXG4gICAgICAgIHVzZXJDaGlsZC5raWxsKCk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgJ3N1Y2Nlc3MnKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgdXNlckNoaWxkLnN0ZGVyci5vbignZGF0YScsIGZ1bmN0aW9uIChidWY6IGFueSkge1xyXG4gICAgICBjb25zb2xlLmxvZygnW1NUUl0gc3RkZXJyIFwiJXNcIicsIFN0cmluZyhidWYpKTtcclxuICAgICAgc3RkZXJyICs9IGJ1ZjtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIGV4cG9ydFJlY3J1aXRlckNvbGxlY3Rpb24oY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiaW5zaWRlIGV4cG9ydFJlY3J1aXRlckNvbGxlY3Rpb25cIik7XHJcbiAgICBsZXQgc3RkZXJyOiBhbnkgPSAnJztcclxuXHJcbiAgICAvKmxldCByZWNydWl0ZXJDaGlsZCA9IHNwYXduKCdtb25nb2V4cG9ydCcsIFsnLS1kYicsZGIsJy0tY29sbGVjdGlvbicsJ3JlY3J1aXRlcnMnLCctLXR5cGUnLCdjc3YnLCctLWZpZWxkcycsJ19pZCx1c2VySWQsaXNSZWNydWl0aW5nRm9yc2VsZixjb21wYW55X25hbWUsY29tcGFueV9zaXplLGNvbXBhbnlfd2Vic2l0ZSxwb3N0ZWRKb2JzLHNldE9mRG9jdW1lbnRzLGNvbXBhbnlfbG9nbycsJy0tb3V0JywnL2hvbWUva2FwaWwvSmF2YVByb2plY3Qvbmc0LWNuZXh0L2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy9yZWNydWl0ZXJzLmNzdiddKTsqL1xyXG5cclxuICAgIGxldCByZWNydWl0ZXJDaGlsZCA9IHNwYXduKCdtb25nb2V4cG9ydCcsIFsnLS11c2VybmFtZScsIHVzZXJuYW1lLCAnLS1wYXNzd29yZCcsIHBhc3N3b3JkLCAnLS1kYicsIGRiLCAnLS1jb2xsZWN0aW9uJywgJ3JlY3J1aXRlcnMnLCAnLS10eXBlJywgJ2NzdicsICctLWZpZWxkcycsICdfaWQsdXNlcklkLGlzUmVjcnVpdGluZ0ZvcnNlbGYsY29tcGFueV9uYW1lLGNvbXBhbnlfc2l6ZSxjb21wYW55X3dlYnNpdGUscG9zdGVkSm9icyxzZXRPZkRvY3VtZW50cyxjb21wYW55X2xvZ28nLCAnLS1vdXQnLCAnL2hvbWUvYml0bmFtaS9hcHBzL2pvYm1vc2lzLXN0YWdpbmcvYy1uZXh0L2Rpc3Qvc2VydmVyL3Byb2QvcHVibGljL3JlY3J1aXRlcnMuY3N2J10pO1xyXG5cclxuICAgIHJlY3J1aXRlckNoaWxkLm9uKCdleGl0JywgZnVuY3Rpb24gKGNvZGU6IGFueSkge1xyXG4gICAgICBpZiAoY29kZSAhPSAwKSB7XHJcbiAgICAgICAgcmVjcnVpdGVyQ2hpbGQua2lsbCgpO1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcigpLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZygncmVjcnVpdGVyQ2hpbGQgcHJvY2VzcyBjbG9zZWQgd2l0aCBjb2RlICcgKyBjb2RlKTtcclxuICAgICAgICByZWNydWl0ZXJDaGlsZC5raWxsKCk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgJ3N1Y2Nlc3MnKTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICByZWNydWl0ZXJDaGlsZC5zdGRlcnIub24oJ2RhdGEnLCBmdW5jdGlvbiAoYnVmOiBhbnkpIHtcclxuICAgICAgY29uc29sZS5sb2coJ1tTVFJdIHN0ZGVyciBcIiVzXCInLCBTdHJpbmcoYnVmKSk7XHJcbiAgICAgIHN0ZGVyciArPSBidWY7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gIH1cclxuXHJcbiAgZXhwb3J0VXNhZ2VEZXRhaWxzQ29sbGVjdGlvbihjYWxsYmFjazogKGVycjogYW55LCByZXM6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgY29uc29sZS5sb2coXCJpbnNpZGUgZXhwb3J0VXNhZ2VEZXRhaWxzQ29sbGVjdGlvblwiKTtcclxuICAgIGxldCBzdGRlcnI6IGFueSA9ICcnO1xyXG4gICAgLypsZXQgdXNhZ2VEZXRhaWxzQ2hpbGQgPSBzcGF3bignbW9uZ29leHBvcnQnLFsnLS1kYicsZGIsJy0tY29sbGVjdGlvbicsJ3VzZXN0cmFja2luZ3MnLCctLXR5cGUnLCdjc3YnLCctLWZpZWxkcycsJ19pZCxjYW5kaWRhdGVJZCxqb2JQcm9maWxlSWQsdGltZXN0YW1wLGFjdGlvbixfX3YnLCctLW91dCcsJy9ob21lL2thcGlsL0phdmFQcm9qZWN0L25nNC1jbmV4dC9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvdXNhZ2VkZXRhaWwuY3N2J10pOyovXHJcblxyXG4gICAgbGV0IHVzYWdlRGV0YWlsc0NoaWxkID0gc3Bhd24oJ21vbmdvZXhwb3J0JywgWyctLXVzZXJuYW1lJywgdXNlcm5hbWUsICctLXBhc3N3b3JkJywgcGFzc3dvcmQsICctLWRiJywgZGIsICctLWNvbGxlY3Rpb24nLCAndXNlc3RyYWNraW5ncycsICctLXR5cGUnLCAnY3N2JywgJy0tZmllbGRzJywgJ19pZCxjYW5kaWRhdGVJZCxqb2JQcm9maWxlSWQsdGltZXN0YW1wLGFjdGlvbixfX3YnLCAnLS1vdXQnLCAnL2hvbWUvYml0bmFtaS9hcHBzL2pvYm1vc2lzLXN0YWdpbmcvYy1uZXh0L2Rpc3Qvc2VydmVyL3Byb2QvcHVibGljL3VzYWdlZGV0YWlsLmNzdiddKTtcclxuXHJcbiAgICB1c2FnZURldGFpbHNDaGlsZC5vbignZXhpdCcsIGZ1bmN0aW9uIChjb2RlOiBhbnkpIHtcclxuICAgICAgaWYgKGNvZGUgIT0gMCkge1xyXG4gICAgICAgIHVzYWdlRGV0YWlsc0NoaWxkLmtpbGwoKTtcclxuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoKSwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3VzYWdlRGV0YWlsc0NoaWxkIHByb2Nlc3MgY2xvc2VkIHdpdGggY29kZSAnICsgY29kZSk7XHJcbiAgICAgICAgdXNhZ2VEZXRhaWxzQ2hpbGQua2lsbCgpO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsICdzdWNjZXNzJyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHVzYWdlRGV0YWlsc0NoaWxkLnN0ZGVyci5vbignZGF0YScsIGZ1bmN0aW9uIChidWY6IGFueSkge1xyXG4gICAgICBjb25zb2xlLmxvZygnW1NUUl0gc3RkZXJyIFwiJXNcIicsIFN0cmluZyhidWYpKTtcclxuICAgICAgc3RkZXJyICs9IGJ1ZjtcclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG59XHJcblxyXG5PYmplY3Quc2VhbChBZG1pblNlcnZpY2UpO1xyXG5leHBvcnQgPSBBZG1pblNlcnZpY2U7XHJcbiJdfQ==
