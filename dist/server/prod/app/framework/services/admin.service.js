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
var db = 'c-next-backend';
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvYWRtaW4uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBR0EseUVBQTRFO0FBQzVFLG9EQUF1RDtBQUN2RCw2Q0FBZ0Q7QUFDaEQsdURBQTBEO0FBQzFELG1GQUFzRjtBQUN0RiwyREFBOEQ7QUFDOUQsc0RBQXlEO0FBQ3pELHNEQUF5RDtBQUV6RCxpRkFBb0Y7QUFJcEYsNENBQStDO0FBQy9DLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzVDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFFM0MsSUFBSSxXQUFXLEdBQUcsc0JBQXNCLENBQUM7QUFHekMsSUFBSSxFQUFFLEdBQUcsZ0JBQWdCLENBQUM7QUFDMUIsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLElBQUksUUFBUSxHQUFHLGtCQUFrQixDQUFDO0FBRWxDO0lBT0U7UUFDRSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztRQUNuRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1FBQ3JELElBQUksR0FBRyxHQUFRLElBQUksWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQy9DLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDO0lBQ2hELENBQUM7SUFFRCxzQ0FBZSxHQUFmLFVBQWdCLElBQVMsRUFBRSxRQUEyQztRQUNwRSxJQUFJLENBQUM7WUFDSCxJQUFJLGdCQUFnQixHQUFHLElBQUksZ0JBQWdCLEVB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QUM5QixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sT0FBTyxDQUFDLEdBQUcsQ0FBQyw2Q0FBNkMsR0FBRyxJQUFJLENBQUMsQ0FBQztnQkFDbEUsaUJBQWlCLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3pCLFFBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDNUIsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBVSxHQUFRO1lBQ3BELE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDOUMsTUFBTSxJQUFJLEdBQUcsQ0FBQztRQUNoQixDQUFDLENBQUMsQ0FBQztJQUVMLENBQUM7SUFFSCxtQkFBQztBQUFELENBcFdBLEFBb1dDLElBQUE7QUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzFCLGlCQUFTLFlBQVksQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL3NlcnZpY2VzL2FkbWluLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdGVjaHByaW1lMDAyIG9uIDgvMjgvMjAxNy5cbiAqL1xuaW1wb3J0IFVzZXJSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L3VzZXIucmVwb3NpdG9yeScpO1xuaW1wb3J0IFNlbmRNYWlsU2VydmljZSA9IHJlcXVpcmUoJy4vc2VuZG1haWwuc2VydmljZScpO1xuaW1wb3J0IE1lc3NhZ2VzID0gcmVxdWlyZSgnLi4vc2hhcmVkL21lc3NhZ2VzJyk7XG5pbXBvcnQgTWFpbEF0dGFjaG1lbnRzID0gcmVxdWlyZSgnLi4vc2hhcmVkL3NoYXJlZGFycmF5Jyk7XG5pbXBvcnQgUmVjcnVpdGVyUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9yZWNydWl0ZXIucmVwb3NpdG9yeScpO1xuaW1wb3J0IFVzZXJzQ2xhc3NNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvdXNlcnMnKTtcbmltcG9ydCBDYW5kaWRhdGVTZXJ2aWNlID0gcmVxdWlyZSgnLi9jYW5kaWRhdGUuc2VydmljZScpO1xuaW1wb3J0IFJlY3J1aXRlclNlcnZpY2UgPSByZXF1aXJlKCcuL3JlY3J1aXRlci5zZXJ2aWNlJyk7XG5pbXBvcnQgSW5kdXN0cnlNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvaW5kdXN0cnkubW9kZWwnKTtcbmltcG9ydCBJbmR1c3RyeVJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvaW5kdXN0cnkucmVwb3NpdG9yeScpO1xuaW1wb3J0IENhbmRpZGF0ZU1vZGVsQ2xhc3MgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL2NhbmRpZGF0ZUNsYXNzLm1vZGVsJyk7XG5pbXBvcnQgUmVjcnVpdGVyQ2xhc3NNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcmVjcnVpdGVyQ2xhc3MubW9kZWwnKTtcbmltcG9ydCBDYW5kaWRhdGVDbGFzc01vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9jYW5kaWRhdGUtY2xhc3MubW9kZWwnKTtcbmltcG9ydCBVc2VyU2VydmljZSA9IHJlcXVpcmUoXCIuL3VzZXIuc2VydmljZVwiKTtcbmxldCBjb25maWcgPSByZXF1aXJlKCdjb25maWcnKTtcbmxldCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5sZXQgdXNlc3RyYWNraW5nID0gcmVxdWlyZSgndXNlcy10cmFja2luZycpO1xubGV0IHNwYXduID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLnNwYXduO1xuXG5sZXQgbW9uZ29FeHBvcnQgPSAnL3Vzci9iaW4vbW9uZ29leHBvcnQnO1xuLy8vbGV0IGRiID0gY29uZmlnLmdldCgnVHBsU2VlZC5kYXRhYmFzZS5uYW1lJyk7XG4vL2xldCBkYiA9ICdKb2Jtb3Npcy1zdGFnaW5nJztcbmxldCBkYiA9ICdjLW5leHQtYmFja2VuZCc7XG5sZXQgdXNlcm5hbWUgPSAnYWRtaW4nO1xubGV0IHBhc3N3b3JkID0gJ2pvYm1vc2lzYWRtaW4xMjMnO1xuXG5jbGFzcyBBZG1pblNlcnZpY2Uge1xuICBjb21wYW55X25hbWU6IHN0cmluZztcbiAgcHJpdmF0ZSB1c2VyUmVwb3NpdG9yeTogVXNlclJlcG9zaXRvcnk7XG4gIHByaXZhdGUgaW5kdXN0cnlSZXBvc2l0aXJ5OiBJbmR1c3RyeVJlcG9zaXRvcnk7XG4gIHByaXZhdGUgcmVjcnVpdGVyUmVwb3NpdG9yeTogUmVjcnVpdGVyUmVwb3NpdG9yeTtcbiAgcHJpdmF0ZSB1c2VzVHJhY2tpbmdDb250cm9sbGVyOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeSA9IG5ldyBVc2VyUmVwb3NpdG9yeSgpO1xuICAgIHRoaXMuaW5kdXN0cnlSZXBvc2l0aXJ5ID0gbmV3IEluZHVzdHJ5UmVwb3NpdG9yeSgpO1xuICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeSA9IG5ldyBSZWNydWl0ZXJSZXBvc2l0b3J5KCk7XG4gICAgbGV0IG9iajogYW55ID0gbmV3IHVzZXN0cmFja2luZy5NeUNvbnRyb2xsZXIoKTtcbiAgICB0aGlzLnVzZXNUcmFja2luZ0NvbnRyb2xsZXIgPSBvYmouX2NvbnRyb2xsZXI7XG4gIH1cblxuICBnZXRDb3VudE9mVXNlcnMoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgdHJ5IHtcbiAgICAgIGxldCBjYW5kaWRhdGVTZXJ2aWNlID0gbmV3IENhbmRpZGF0ZVNlcnZpY2UoKTtcbiAgICAgIGxldCByZWNydWl0ZXJTZXJ2aWNlID0gbmV3IFJlY3J1aXRlclNlcnZpY2UoKTtcbiAgICAgIGxldCB1c2VyczogVXNlcnNDbGFzc01vZGVsID0gbmV3IFVzZXJzQ2xhc3NNb2RlbCgpO1xuICAgICAgbGV0IGZpbmRRdWVyeSA9IG5ldyBPYmplY3QoKTtcblxuICAgICAgY2FuZGlkYXRlU2VydmljZS5nZXRUb3RhbENhbmRpZGF0ZUNvdW50KChlcnJvciwgY2FuZGlkYXRlQ291bnQpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHVzZXJzLnRvdGFsTnVtYmVyT2ZDYW5kaWRhdGVzID0gY2FuZGlkYXRlQ291bnQ7XG4gICAgICAgICAgcmVjcnVpdGVyU2VydmljZS5nZXRUb3RhbFJlY3J1aXRlckNvdW50KChlcnJvciwgcmVjcnVpdGVyQ291bnQpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB1c2Vycy50b3RhbE51bWJlck9mUmVjcnVpdGVycyA9IHJlY3J1aXRlckNvdW50O1xuICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCB1c2Vycyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBjYXRjaFxuICAgICAgKGUpIHtcbiAgICAgIGNhbGxiYWNrKGUsIG51bGwpO1xuICAgIH1cbiAgfTtcblxuICBnZXRSZWNydWl0ZXJEZXRhaWxzKGluaXRpYWw6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIHRyeSB7XG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcbiAgICAgIGxldCB1c2VyczogVXNlcnNDbGFzc01vZGVsID0gbmV3IFVzZXJzQ2xhc3NNb2RlbCgpO1xuICAgICAgbGV0IHVzZXJzTWFwOiBNYXA8YW55LCBhbnk+ID0gbmV3IE1hcCgpO1xuXG4gICAgICBsZXQgcmVjcnVpdGVyU2VydmljZSA9IG5ldyBSZWNydWl0ZXJTZXJ2aWNlKCk7XG4gICAgICBsZXQgcmVjcnVpdGVyczogUmVjcnVpdGVyQ2xhc3NNb2RlbFtdID0gbmV3IEFycmF5KDApO1xuXG4gICAgICBsZXQgcmVnRXggPSBuZXcgUmVnRXhwKCdeWycgKyBpbml0aWFsLnRvTG93ZXJDYXNlKCkgKyBpbml0aWFsLnRvVXBwZXJDYXNlKCkgKyAnXScpO1xuICAgICAgbGV0IGZpbmRRdWVyeSA9IHtcbiAgICAgICAgJ2NvbXBhbnlfbmFtZSc6IHtcbiAgICAgICAgICAkcmVnZXg6IHJlZ0V4XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCBzb3J0aW5nUXVlcnkgPSB7J2NvbXBhbnlfbmFtZSc6IDEsICdjb21wYW55X3NpemUnOiAxfTtcblxuICAgICAgbGV0IHJlY3J1aXRlckZpZWxkcyA9IHtcbiAgICAgICAgJ3VzZXJJZCc6IDEsXG4gICAgICAgICdjb21wYW55X25hbWUnOiAxLFxuICAgICAgICAnY29tcGFueV9zaXplJzogMSxcbiAgICAgICAgJ3Bvc3RlZEpvYnMuaXNKb2JQb3N0ZWQnOiAxXG4gICAgICB9O1xuXG4gICAgICByZWNydWl0ZXJTZXJ2aWNlLnJldHJpZXZlQnlTb3J0ZWRPcmRlcihmaW5kUXVlcnksIHJlY3J1aXRlckZpZWxkcywgc29ydGluZ1F1ZXJ5LCAoZXJyb3IsIHJlY3J1aXRlclJlc3VsdCkgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdXNlcnMudG90YWxOdW1iZXJPZlJlY3J1aXRlcnMgPSByZWNydWl0ZXJSZXN1bHQubGVuZ3RoO1xuICAgICAgICAgIGlmIChyZWNydWl0ZXJSZXN1bHQubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHVzZXJzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgdXNlckZpZWxkcyA9IHtcbiAgICAgICAgICAgICAgJ19pZCc6IDEsXG4gICAgICAgICAgICAgICdtb2JpbGVfbnVtYmVyJzogMSxcbiAgICAgICAgICAgICAgJ2VtYWlsJzogMSxcbiAgICAgICAgICAgICAgJ2lzQWN0aXZhdGVkJzogMVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZm9yIChsZXQgcmVjcnVpdGVyIG9mIHJlY3J1aXRlclJlc3VsdCkge1xuICAgICAgICAgICAgICB1c2Vyc01hcC5zZXQocmVjcnVpdGVyLnVzZXJJZC50b1N0cmluZygpLCByZWNydWl0ZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdXNlclNlcnZpY2UucmV0cmlldmVXaXRoTGVhbih7J2lzQ2FuZGlkYXRlJzogZmFsc2V9LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGZXRjaGVkIGFsbCByZWNydWl0ZXJzIGZyb20gdXNlcnM6XCIgKyByZWNydWl0ZXJSZXN1bHQubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB1c2VyIG9mIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgaWYgKHVzZXJzTWFwLmdldCh1c2VyLl9pZC50b1N0cmluZygpKSkge1xuICAgICAgICAgICAgICAgICAgICB1c2VyLmRhdGEgPSB1c2Vyc01hcC5nZXQodXNlci5faWQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgIHJlY3J1aXRlcnMucHVzaCh1c2VyKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB1c2Vycy5yZWNydWl0ZXIgPSByZWNydWl0ZXJzO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHVzZXJzKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBjYXRjaFxuICAgICAgKGUpIHtcbiAgICAgIGNhbGxiYWNrKGUsIG51bGwpO1xuICAgIH1cbiAgfTtcblxuICBnZXRDYW5kaWRhdGVEZXRhaWxzKGluaXRpYWw6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIHRyeSB7XG4gICAgICBsZXQgdXNlclNlcnZpY2UgPSBuZXcgVXNlclNlcnZpY2UoKTtcbiAgICAgIGxldCB1c2VyczogVXNlcnNDbGFzc01vZGVsID0gbmV3IFVzZXJzQ2xhc3NNb2RlbCgpO1xuICAgICAgbGV0IHVzZXJzTWFwOiBNYXA8YW55LCBhbnk+ID0gbmV3IE1hcCgpO1xuXG4gICAgICBsZXQgY2FuZGlkYXRlczogQ2FuZGlkYXRlTW9kZWxDbGFzc1tdID0gbmV3IEFycmF5KDApO1xuICAgICAgbGV0IGNhbmRpZGF0ZVNlcnZpY2UgPSBuZXcgQ2FuZGlkYXRlU2VydmljZSgpO1xuXG4gICAgICBsZXQgcmVnRXggPSBuZXcgUmVnRXhwKCdeWycgKyBpbml0aWFsLnRvTG93ZXJDYXNlKCkgKyBpbml0aWFsLnRvVXBwZXJDYXNlKCkgKyAnXScpO1xuICAgICAgbGV0IGZpbmRRdWVyeSA9IHtcbiAgICAgICAgJ2ZpcnN0X25hbWUnOiB7XG4gICAgICAgICAgJHJlZ2V4OiByZWdFeFxuICAgICAgICB9LFxuICAgICAgICAnaXNBZG1pbic6IGZhbHNlLFxuICAgICAgICAnaXNDYW5kaWRhdGUnOiB0cnVlXG4gICAgICB9O1xuICAgICAgbGV0IGluY2x1ZGVkX2ZpZWxkcyA9IHtcbiAgICAgICAgJ19pZCc6IDEsXG4gICAgICAgICdmaXJzdF9uYW1lJzogMSxcbiAgICAgICAgJ2xhc3RfbmFtZSc6IDEsXG4gICAgICAgICdtb2JpbGVfbnVtYmVyJzogMSxcbiAgICAgICAgJ2VtYWlsJzogMSxcbiAgICAgICAgJ2lzQWN0aXZhdGVkJzogMVxuICAgICAgfTtcbiAgICAgIGxldCBzb3J0aW5nUXVlcnkgPSB7J2ZpcnN0X25hbWUnOiAxLCAnbGFzdF9uYW1lJzogMX07XG5cbiAgICAgIHVzZXJTZXJ2aWNlLnJldHJpZXZlQnlTb3J0ZWRPcmRlcihmaW5kUXVlcnksIGluY2x1ZGVkX2ZpZWxkcywgc29ydGluZ1F1ZXJ5LCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdXNlcnMudG90YWxOdW1iZXJPZkNhbmRpZGF0ZXMgPSByZXN1bHQubGVuZ3RoO1xuICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHVzZXJzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSAwO1xuICAgICAgICAgICAgbGV0IGNhbmRpZGF0ZUZpZWxkcyA9IHtcbiAgICAgICAgICAgICAgJ3VzZXJJZCc6IDEsXG4gICAgICAgICAgICAgICdqb2JUaXRsZSc6IDEsXG4gICAgICAgICAgICAgICdpc0NvbXBsZXRlZCc6IDEsXG4gICAgICAgICAgICAgICdpc1N1Ym1pdHRlZCc6IDEsXG4gICAgICAgICAgICAgICdpc1Zpc2libGUnOiAxLFxuICAgICAgICAgICAgICAnbG9jYXRpb24uY2l0eSc6IDFcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjYW5kaWRhdGVTZXJ2aWNlLnJldHJpZXZlV2l0aExlYW4oe30sIGNhbmRpZGF0ZUZpZWxkcywgKGVycm9yLCBjYW5kaWRhdGVzUmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZldGNoZWQgYWxsIGNhbmRpZGF0ZXM6XCIgKyBjYW5kaWRhdGVzUmVzdWx0Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgY2FuZGlkYXRlIG9mIGNhbmRpZGF0ZXNSZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgIHVzZXJzTWFwLnNldChjYW5kaWRhdGUudXNlcklkLnRvU3RyaW5nKCksIGNhbmRpZGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgdXNlciBvZiByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgIHVzZXIuZGF0YSA9IHVzZXJzTWFwLmdldCh1c2VyLl9pZC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZXMucHVzaCh1c2VyKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB1c2Vycy5jYW5kaWRhdGUgPSBjYW5kaWRhdGVzO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHVzZXJzKTtcblxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY2FsbGJhY2soZSwgbnVsbCk7XG4gICAgfVxuICB9O1xuXG4gIHNlbmRBZG1pbkxvZ2luSW5mb01haWwoZmllbGQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xuICAgIGxldCBoZWFkZXIxID0gZnMucmVhZEZpbGVTeW5jKCcuL3NyYy9zZXJ2ZXIvYXBwL2ZyYW1ld29yay9wdWJsaWMvaGVhZGVyMS5odG1sJykudG9TdHJpbmcoKTtcbiAgICBsZXQgY29udGVudCA9IGZzLnJlYWRGaWxlU3luYygnLi9zcmMvc2VydmVyL2FwcC9mcmFtZXdvcmsvcHVibGljL2FkbWlubG9naW5pbmZvLm1haWwuaHRtbCcpLnRvU3RyaW5nKCk7XG4gICAgbGV0IGZvb3RlcjEgPSBmcy5yZWFkRmlsZVN5bmMoJy4vc3JjL3NlcnZlci9hcHAvZnJhbWV3b3JrL3B1YmxpYy9mb290ZXIxLmh0bWwnKS50b1N0cmluZygpO1xuICAgIGxldCBtaWRfY29udGVudCA9IGNvbnRlbnQucmVwbGFjZSgnJGVtYWlsJCcsIGZpZWxkLmVtYWlsKS5yZXBsYWNlKCckYWRkcmVzcyQnLCAoZmllbGQubG9jYXRpb24gPT09IHVuZGVmaW5lZCkgPyAnTm90IEZvdW5kJyA6IGZpZWxkLmxvY2F0aW9uKVxuICAgICAgLnJlcGxhY2UoJyRpcCQnLCBmaWVsZC5pcCkucmVwbGFjZSgnJGhvc3QkJywgY29uZmlnLmdldCgnVHBsU2VlZC5tYWlsLmhvc3QnKSk7XG5cblxuICAgIGxldCBtYWlsT3B0aW9ucyA9IHtcbiAgICAgIGZyb206IGNvbmZpZy5nZXQoJ1RwbFNlZWQubWFpbC5NQUlMX1NFTkRFUicpLFxuICAgICAgdG86IGNvbmZpZy5nZXQoJ1RwbFNlZWQubWFpbC5BRE1JTl9NQUlMJyksXG4gICAgICBjYzogY29uZmlnLmdldCgnVHBsU2VlZC5tYWlsLlRQTEdST1VQX01BSUwnKSxcbiAgICAgIHN1YmplY3Q6IE1lc3NhZ2VzLkVNQUlMX1NVQkpFQ1RfQURNSU5fTE9HR0VEX09OICsgXCIgXCIgKyBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuaG9zdCcpLFxuICAgICAgaHRtbDogaGVhZGVyMSArIG1pZF9jb250ZW50ICsgZm9vdGVyMVxuICAgICAgLCBhdHRhY2htZW50czogTWFpbEF0dGFjaG1lbnRzLkF0dGFjaG1lbnRBcnJheVxuICAgIH1cbiAgICBsZXQgc2VuZE1haWxTZXJ2aWNlID0gbmV3IFNlbmRNYWlsU2VydmljZSgpO1xuICAgIHNlbmRNYWlsU2VydmljZS5zZW5kTWFpbChtYWlsT3B0aW9ucywgY2FsbGJhY2spO1xuXG4gIH07XG5cbiAgdXBkYXRlVXNlcihfaWQ6IHN0cmluZywgaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5maW5kQnlJZChfaWQsIChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyLCByZXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy51c2VyUmVwb3NpdG9yeS51cGRhdGUocmVzLl9pZCwgaXRlbSwgY2FsbGJhY2spO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGV4cG9ydENhbmRpZGF0ZUNvbGxlY3Rpb24oY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHZvaWQpIHtcbiAgICBjb25zb2xlLmxvZyhcImluc2lkZSBleHBvcnRDYW5kaWRhdGVDb2xsZWN0aW9uXCIpO1xuICAgIGxldCBzdGRlcnI6IGFueSA9ICcnO1xuXG4gICAgLypsZXQgY2FuZGlkYXRlQ2hpbGQgPSBzcGF3bignbW9uZ29leHBvcnQnLFsnLS1kYicsZGIsJy0tY29sbGVjdGlvbicsJ2NhbmRpZGF0ZXMnLCctLXR5cGUnLCdjc3YnLCctLWZpZWxkcycsJ19pZCx1c2VySWQsam9iX2xpc3QscHJvZmljaWVuY2llcyxlbXBsb3ltZW50SGlzdG9yeSxhY2FkZW1pY3MsaW5kdXN0cnksYXdhcmRzLGludGVyZXN0ZWRJbmR1c3RyaWVzLGNlcnRpZmljYXRpb25zLHByb2ZpbGVfdXBkYXRlX3RyYWNraW5nLGlzVmlzaWJsZSxpc1N1Ym1pdHRlZCxpc0NvbXBsZXRlZCxjb21wbGV4aXR5X25vdGVfbWF0cml4LHByb2Zlc3Npb25hbERldGFpbHMsYWJvdXRNeXNlbGYsam9iVGl0bGUsbG9jYXRpb24sbGFzdFVwZGF0ZUF0JywnLS1vdXQnLCcvaG9tZS9rYXBpbC9KYXZhUHJvamVjdC9uZzQtY25leHQvYy1uZXh0L2Rpc3Qvc2VydmVyL3Byb2QvcHVibGljL2NhbmRpZGF0ZXMuY3N2J10pOyovXG5cbiAgICBsZXQgY2FuZGlkYXRlQ2hpbGQgPSBzcGF3bignbW9uZ29leHBvcnQnLCBbJy0tdXNlcm5hbWUnLCB1c2VybmFtZSwgJy0tcGFzc3dvcmQnLCBwYXNzd29yZCwgJy0tZGInLCBkYiwgJy0tY29sbGVjdGlvbicsICdjYW5kaWRhdGVzJywgJy0tdHlwZScsICdjc3YnLCAnLS1maWVsZHMnLCAnX2lkLHVzZXJJZCxqb2JfbGlzdCxwcm9maWNpZW5jaWVzLGVtcGxveW1lbnRIaXN0b3J5LGFjYWRlbWljcyxpbmR1c3RyeSxhd2FyZHMsaW50ZXJlc3RlZEluZHVzdHJpZXMsY2VydGlmaWNhdGlvbnMscHJvZmlsZV91cGRhdGVfdHJhY2tpbmcsaXNWaXNpYmxlLGlzU3VibWl0dGVkLGlzQ29tcGxldGVkLGNvbXBsZXhpdHlfbm90ZV9tYXRyaXgscHJvZmVzc2lvbmFsRGV0YWlscyxhYm91dE15c2VsZixqb2JUaXRsZSxsb2NhdGlvbixsYXN0VXBkYXRlQXQnLCAnLS1vdXQnLCAnL2hvbWUvYml0bmFtaS9hcHBzL2pvYm1vc2lzLXN0YWdpbmcvYy1uZXh0L2Rpc3Qvc2VydmVyL3Byb2QvcHVibGljL2NhbmRpZGF0ZXMuY3N2J10pO1xuXG4gICAgY2FuZGlkYXRlQ2hpbGQub24oJ2V4aXQnLCBmdW5jdGlvbiAoY29kZTogYW55KSB7XG4gICAgICBpZiAoY29kZSAhPSAwKSB7XG4gICAgICAgIGNhbmRpZGF0ZUNoaWxkLmtpbGwoKTtcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKCksIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2NhbmRpZGF0ZUNoaWxkIHByb2Nlc3MgY2xvc2VkIHdpdGggY29kZSAnICsgY29kZSk7XG4gICAgICAgIGNhbmRpZGF0ZUNoaWxkLmtpbGwoKTtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgJ3N1Y2Nlc3MnKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNhbmRpZGF0ZUNoaWxkLnN0ZGVyci5vbignZGF0YScsIGZ1bmN0aW9uIChidWY6IGFueSkge1xuICAgICAgY29uc29sZS5sb2coJ1tTVFJdIHN0ZGVyciBcIiVzXCInLCBTdHJpbmcoYnVmKSk7XG4gICAgICBzdGRlcnIgKz0gYnVmO1xuICAgIH0pO1xuXG4gIH1cblxuICBleHBvcnRDYW5kaWRhdGVPdGhlckRldGFpbHNDb2xsZWN0aW9uKGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczogYW55KSA9PiB2b2lkKSB7XG4gICAgY29uc29sZS5sb2coXCJpbnNpZGUgZXhwb3J0Q2FuZGlkYXRlRGV0YWlsc0NvbGxlY3Rpb25cIik7XG4gICAgbGV0IHN0ZGVycjogYW55ID0gJyc7XG4gICAgLypsZXQgY2FuZGlkYXRlT3RoZXJEZXRhaWxzQ2hpbGQgPSBzcGF3bignbW9uZ29leHBvcnQnLFsnLS1kYicsZGIsJy0tY29sbGVjdGlvbicsJ2NhbmRpZGF0ZXMnLCctLXR5cGUnLCdjc3YnLCctLWZpZWxkcycsJ3VzZXJJZCxjYXBhYmlsaXR5X21hdHJpeCcsJy0tb3V0JywnL2hvbWUva2FwaWwvSmF2YVByb2plY3Qvbmc0LWNuZXh0L2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy9jYW5kaWRhdGVzLW90aGVyLWRldGFpbHMuY3N2J10pOyovXG4gICAgbGV0IGNhbmRpZGF0ZU90aGVyRGV0YWlsc0NoaWxkID0gc3Bhd24oJ21vbmdvZXhwb3J0JywgWyctLXVzZXJuYW1lJywgdXNlcm5hbWUsICctLXBhc3N3b3JkJywgcGFzc3dvcmQsICctLWRiJywgZGIsICctLWNvbGxlY3Rpb24nLCAnY2FuZGlkYXRlcycsICctLXR5cGUnLCAnY3N2JywgJy0tZmllbGRzJywgJ3VzZXJJZCxjYXBhYmlsaXR5X21hdHJpeCcsICctLW91dCcsICcvaG9tZS9iaXRuYW1pL2FwcHMvam9ibW9zaXMtc3RhZ2luZy9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvY2FuZGlkYXRlcy1vdGhlci1kZXRhaWxzLmNzdiddKTtcblxuICAgIGNhbmRpZGF0ZU90aGVyRGV0YWlsc0NoaWxkLm9uKCdleGl0JywgZnVuY3Rpb24gKGNvZGU6IGFueSkge1xuICAgICAgaWYgKGNvZGUgIT0gMCkge1xuICAgICAgICBjYW5kaWRhdGVPdGhlckRldGFpbHNDaGlsZC5raWxsKCk7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcigpLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdjYW5kaWRhdGVPdGhlckRldGFpbHNDaGlsZCBwcm9jZXNzIGNsb3NlZCB3aXRoIGNvZGUgJyArIGNvZGUpO1xuICAgICAgICBjYW5kaWRhdGVPdGhlckRldGFpbHNDaGlsZC5raWxsKCk7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsICdzdWNjZXNzJyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjYW5kaWRhdGVPdGhlckRldGFpbHNDaGlsZC5zdGRlcnIub24oJ2RhdGEnLCBmdW5jdGlvbiAoYnVmOiBhbnkpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdbU1RSXSBzdGRlcnIgXCIlc1wiJywgU3RyaW5nKGJ1ZikpO1xuICAgICAgc3RkZXJyICs9IGJ1ZjtcbiAgICB9KTtcblxuICB9XG5cbiAgZXhwb3J0VXNlckNvbGxlY3Rpb24odXNlclR5cGU6IHN0cmluZywgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHZvaWQpIHtcbiAgICBjb25zb2xlLmxvZyhcImluc2lkZSBleHBvcnRVc2VyQ29sbGVjdGlvblwiKTtcbiAgICBsZXQgdXNlckNoaWxkOiBhbnk7XG4gICAgbGV0IHN0ZGVycjogYW55ID0gJyc7XG5cbiAgICAvKmlmICh1c2VyVHlwZSA9PSAnY2FuZGlkYXRlJykge1xuICAgICB1c2VyQ2hpbGQgPSBzcGF3bignbW9uZ29leHBvcnQnLCBbJy0tZGInLGRiLCctLWNvbGxlY3Rpb24nLCd1c2VycycsJy0tdHlwZScsJ2NzdicsJy0tZmllbGRzJywnX2lkLGZpcnN0X25hbWUsbGFzdF9uYW1lLG1vYmlsZV9udW1iZXIsZW1haWwsY3VycmVudF90aGVtZSxpc0NhbmRpZGF0ZSxndWlkZV90b3VyLG5vdGlmaWNhdGlvbnMsY29tcGxleGl0eUlzTXVzdEhhdmUsaXNBZG1pbixvdHAsaXNBY3RpdmF0ZWQsdGVtcF9tb2JpbGUnLCctLW91dCcsJy9ob21lL2thcGlsL0phdmFQcm9qZWN0L25nNC1jbmV4dC9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvdXNlcnMuY3N2JywnLS1xdWVyeScsJ3tcImlzQ2FuZGlkYXRlXCI6dHJ1ZX0nXSk7XG4gICAgIH0gZWxzZSB7XG4gICAgIHVzZXJDaGlsZCA9IHNwYXduKCdtb25nb2V4cG9ydCcsIFsnLS1kYicsZGIsJy0tY29sbGVjdGlvbicsJ3VzZXJzJywnLS10eXBlJywnY3N2JywnLS1maWVsZHMnLCdfaWQsbW9iaWxlX251bWJlcixlbWFpbCxjdXJyZW50X3RoZW1lLGlzQ2FuZGlkYXRlLGd1aWRlX3RvdXIsbm90aWZpY2F0aW9ucyxpc0FkbWluLG90cCxpc0FjdGl2YXRlZCx0ZW1wX21vYmlsZSxsb2NhdGlvbixwaWN0dXJlJywnLS1vdXQnLCcvaG9tZS9rYXBpbC9KYXZhUHJvamVjdC9uZzQtY25leHQvYy1uZXh0L2Rpc3Qvc2VydmVyL3Byb2QvcHVibGljL3VzZXJzLmNzdicsJy0tcXVlcnknLCd7XCJpc0NhbmRpZGF0ZVwiOmZhbHNlfSddKTtcbiAgICAgfSovXG5cbiAgICBpZiAodXNlclR5cGUgPT0gJ2NhbmRpZGF0ZScpIHtcbiAgICAgIHVzZXJDaGlsZCA9IHNwYXduKCdtb25nb2V4cG9ydCcsIFsnLS11c2VybmFtZScsIHVzZXJuYW1lLCAnLS1wYXNzd29yZCcsIHBhc3N3b3JkLCAnLS1kYicsIGRiLCAnLS1jb2xsZWN0aW9uJywgJ3VzZXJzJywgJy0tdHlwZScsICdjc3YnLCAnLS1maWVsZHMnLCAnX2lkLGZpcnN0X25hbWUsbGFzdF9uYW1lLG1vYmlsZV9udW1iZXIsZW1haWwsY3VycmVudF90aGVtZSxpc0NhbmRpZGF0ZSxndWlkZV90b3VyLG5vdGlmaWNhdGlvbnMsY29tcGxleGl0eUlzTXVzdEhhdmUsaXNBZG1pbixvdHAsaXNBY3RpdmF0ZWQsdGVtcF9tb2JpbGUnLCAnLS1vdXQnLCAnL2hvbWUvYml0bmFtaS9hcHBzL2pvYm1vc2lzLXN0YWdpbmcvYy1uZXh0L2Rpc3Qvc2VydmVyL3Byb2QvcHVibGljL3VzZXJzLmNzdicsICctLXF1ZXJ5JywgJ3tcImlzQ2FuZGlkYXRlXCI6dHJ1ZX0nXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVzZXJDaGlsZCA9IHNwYXduKCdtb25nb2V4cG9ydCcsIFsnLS11c2VybmFtZScsIHVzZXJuYW1lLCAnLS1wYXNzd29yZCcsIHBhc3N3b3JkLCAnLS1kYicsIGRiLCAnLS1jb2xsZWN0aW9uJywgJ3VzZXJzJywgJy0tdHlwZScsICdjc3YnLCAnLS1maWVsZHMnLCAnX2lkLG1vYmlsZV9udW1iZXIsZW1haWwsY3VycmVudF90aGVtZSxpc0NhbmRpZGF0ZSxndWlkZV90b3VyLG5vdGlmaWNhdGlvbnMsaXNBZG1pbixvdHAsaXNBY3RpdmF0ZWQsdGVtcF9tb2JpbGUsbG9jYXRpb24scGljdHVyZScsICctLW91dCcsICcvaG9tZS9iaXRuYW1pL2FwcHMvam9ibW9zaXMtc3RhZ2luZy9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvdXNlcnMuY3N2JywgJy0tcXVlcnknLCAne1wiaXNDYW5kaWRhdGVcIjpmYWxzZX0nXSk7XG4gICAgfVxuXG5cbiAgICB1c2VyQ2hpbGQub24oJ2V4aXQnLCBmdW5jdGlvbiAoY29kZTogYW55KSB7XG4gICAgICBpZiAoY29kZSAhPSAwKSB7XG4gICAgICAgIHVzZXJDaGlsZC5raWxsKCk7XG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcigpLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCd1c2VyQ2hpbGQgcHJvY2VzcyBjbG9zZWQgd2l0aCBjb2RlICcgKyBjb2RlKTtcbiAgICAgICAgdXNlckNoaWxkLmtpbGwoKTtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgJ3N1Y2Nlc3MnKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHVzZXJDaGlsZC5zdGRlcnIub24oJ2RhdGEnLCBmdW5jdGlvbiAoYnVmOiBhbnkpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdbU1RSXSBzdGRlcnIgXCIlc1wiJywgU3RyaW5nKGJ1ZikpO1xuICAgICAgc3RkZXJyICs9IGJ1ZjtcbiAgICB9KTtcblxuICB9XG5cbiAgZXhwb3J0UmVjcnVpdGVyQ29sbGVjdGlvbihjYWxsYmFjazogKGVycjogYW55LCByZXM6IGFueSkgPT4gdm9pZCkge1xuICAgIGNvbnNvbGUubG9nKFwiaW5zaWRlIGV4cG9ydFJlY3J1aXRlckNvbGxlY3Rpb25cIik7XG4gICAgbGV0IHN0ZGVycjogYW55ID0gJyc7XG5cbiAgICAvKmxldCByZWNydWl0ZXJDaGlsZCA9IHNwYXduKCdtb25nb2V4cG9ydCcsIFsnLS1kYicsZGIsJy0tY29sbGVjdGlvbicsJ3JlY3J1aXRlcnMnLCctLXR5cGUnLCdjc3YnLCctLWZpZWxkcycsJ19pZCx1c2VySWQsaXNSZWNydWl0aW5nRm9yc2VsZixjb21wYW55X25hbWUsY29tcGFueV9zaXplLGNvbXBhbnlfd2Vic2l0ZSxwb3N0ZWRKb2JzLHNldE9mRG9jdW1lbnRzLGNvbXBhbnlfbG9nbycsJy0tb3V0JywnL2hvbWUva2FwaWwvSmF2YVByb2plY3Qvbmc0LWNuZXh0L2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy9yZWNydWl0ZXJzLmNzdiddKTsqL1xuXG4gICAgbGV0IHJlY3J1aXRlckNoaWxkID0gc3Bhd24oJ21vbmdvZXhwb3J0JywgWyctLXVzZXJuYW1lJywgdXNlcm5hbWUsICctLXBhc3N3b3JkJywgcGFzc3dvcmQsICctLWRiJywgZGIsICctLWNvbGxlY3Rpb24nLCAncmVjcnVpdGVycycsICctLXR5cGUnLCAnY3N2JywgJy0tZmllbGRzJywgJ19pZCx1c2VySWQsaXNSZWNydWl0aW5nRm9yc2VsZixjb21wYW55X25hbWUsY29tcGFueV9zaXplLGNvbXBhbnlfd2Vic2l0ZSxwb3N0ZWRKb2JzLHNldE9mRG9jdW1lbnRzLGNvbXBhbnlfbG9nbycsICctLW91dCcsICcvaG9tZS9iaXRuYW1pL2FwcHMvam9ibW9zaXMtc3RhZ2luZy9jLW5leHQvZGlzdC9zZXJ2ZXIvcHJvZC9wdWJsaWMvcmVjcnVpdGVycy5jc3YnXSk7XG5cbiAgICByZWNydWl0ZXJDaGlsZC5vbignZXhpdCcsIGZ1bmN0aW9uIChjb2RlOiBhbnkpIHtcbiAgICAgIGlmIChjb2RlICE9IDApIHtcbiAgICAgICAgcmVjcnVpdGVyQ2hpbGQua2lsbCgpO1xuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoKSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZygncmVjcnVpdGVyQ2hpbGQgcHJvY2VzcyBjbG9zZWQgd2l0aCBjb2RlICcgKyBjb2RlKTtcbiAgICAgICAgcmVjcnVpdGVyQ2hpbGQua2lsbCgpO1xuICAgICAgICBjYWxsYmFjayhudWxsLCAnc3VjY2VzcycpO1xuICAgICAgfVxuICAgIH0pXG5cbiAgICByZWNydWl0ZXJDaGlsZC5zdGRlcnIub24oJ2RhdGEnLCBmdW5jdGlvbiAoYnVmOiBhbnkpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdbU1RSXSBzdGRlcnIgXCIlc1wiJywgU3RyaW5nKGJ1ZikpO1xuICAgICAgc3RkZXJyICs9IGJ1ZjtcbiAgICB9KTtcblxuXG4gIH1cblxuICBleHBvcnRVc2FnZURldGFpbHNDb2xsZWN0aW9uKGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczogYW55KSA9PiB2b2lkKSB7XG4gICAgY29uc29sZS5sb2coXCJpbnNpZGUgZXhwb3J0VXNhZ2VEZXRhaWxzQ29sbGVjdGlvblwiKTtcbiAgICBsZXQgc3RkZXJyOiBhbnkgPSAnJztcbiAgICAvKmxldCB1c2FnZURldGFpbHNDaGlsZCA9IHNwYXduKCdtb25nb2V4cG9ydCcsWyctLWRiJyxkYiwnLS1jb2xsZWN0aW9uJywndXNlc3RyYWNraW5ncycsJy0tdHlwZScsJ2NzdicsJy0tZmllbGRzJywnX2lkLGNhbmRpZGF0ZUlkLGpvYlByb2ZpbGVJZCx0aW1lc3RhbXAsYWN0aW9uLF9fdicsJy0tb3V0JywnL2hvbWUva2FwaWwvSmF2YVByb2plY3Qvbmc0LWNuZXh0L2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy91c2FnZWRldGFpbC5jc3YnXSk7Ki9cblxuICAgIGxldCB1c2FnZURldGFpbHNDaGlsZCA9IHNwYXduKCdtb25nb2V4cG9ydCcsIFsnLS11c2VybmFtZScsIHVzZXJuYW1lLCAnLS1wYXNzd29yZCcsIHBhc3N3b3JkLCAnLS1kYicsIGRiLCAnLS1jb2xsZWN0aW9uJywgJ3VzZXN0cmFja2luZ3MnLCAnLS10eXBlJywgJ2NzdicsICctLWZpZWxkcycsICdfaWQsY2FuZGlkYXRlSWQsam9iUHJvZmlsZUlkLHRpbWVzdGFtcCxhY3Rpb24sX192JywgJy0tb3V0JywgJy9ob21lL2JpdG5hbWkvYXBwcy9qb2Jtb3Npcy1zdGFnaW5nL2MtbmV4dC9kaXN0L3NlcnZlci9wcm9kL3B1YmxpYy91c2FnZWRldGFpbC5jc3YnXSk7XG5cbiAgICB1c2FnZURldGFpbHNDaGlsZC5vbignZXhpdCcsIGZ1bmN0aW9uIChjb2RlOiBhbnkpIHtcbiAgICAgIGlmIChjb2RlICE9IDApIHtcbiAgICAgICAgdXNhZ2VEZXRhaWxzQ2hpbGQua2lsbCgpO1xuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoKSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZygndXNhZ2VEZXRhaWxzQ2hpbGQgcHJvY2VzcyBjbG9zZWQgd2l0aCBjb2RlICcgKyBjb2RlKTtcbiAgICAgICAgdXNhZ2VEZXRhaWxzQ2hpbGQua2lsbCgpO1xuICAgICAgICBjYWxsYmFjayhudWxsLCAnc3VjY2VzcycpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdXNhZ2VEZXRhaWxzQ2hpbGQuc3RkZXJyLm9uKCdkYXRhJywgZnVuY3Rpb24gKGJ1ZjogYW55KSB7XG4gICAgICBjb25zb2xlLmxvZygnW1NUUl0gc3RkZXJyIFwiJXNcIicsIFN0cmluZyhidWYpKTtcbiAgICAgIHN0ZGVyciArPSBidWY7XG4gICAgfSk7XG5cbiAgfVxuXG59XG5cbk9iamVjdC5zZWFsKEFkbWluU2VydmljZSk7XG5leHBvcnQgPSBBZG1pblNlcnZpY2U7XG4iXX0=
