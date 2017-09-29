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
var usestracking = require('uses-tracking');
var AdminService = (function () {
    function AdminService() {
        this.userRepository = new UserRepository();
        this.industryRepositiry = new IndustryRepository();
        this.recruiterRepository = new RecruiterRepository();
        var obj = new usestracking.MyController();
        this.usesTrackingController = obj._controller;
    }
    AdminService.prototype.seperateUsers = function (item, callback) {
        try {
            var users_1 = new UsersClassModel();
            var candidateService = new CandidateService();
            var candidates_1 = new Array(0);
            var recruiters_1 = new Array(0);
            var value_1 = 0;
            var _loop_1 = function (i) {
                if (item[i].isCandidate) {
                    candidateService.retrieve({ 'userId': new mongoose.Types.ObjectId(item[i]._id) }, function (error, resu) {
                        if (error) {
                            callback(error, null);
                        }
                        else {
                            value_1++;
                            if (!item[i].isAdmin) {
                                item[i].data = resu[0];
                                candidates_1.push(item[i]);
                                if (value_1 && item.length === value_1) {
                                    users_1.candidate = candidates_1;
                                    users_1.recruiter = recruiters_1;
                                    callback(null, users_1);
                                }
                            }
                        }
                    });
                }
                else if (!item[i].isCandidate) {
                    var recruiterService = new RecruiterService();
                    var data = {
                        'userId': new mongoose.Types.ObjectId(item[i]._id)
                    };
                    recruiterService.retrieve(data, function (error, result) {
                        if (error) {
                            callback(error, null);
                        }
                        else {
                            value_1++;
                            if (!item[i].isAdmin) {
                                item[i].data = result[0];
                                recruiters_1.push(item[i]);
                            }
                            if (value_1 && item.length === value_1) {
                                users_1.candidate = candidates_1;
                                users_1.recruiter = recruiters_1;
                                callback(null, users_1);
                            }
                        }
                    });
                }
            };
            for (var i = 0; i < item.length; i++) {
                _loop_1(i);
            }
        }
        catch (e) {
            callback(e, null);
        }
    };
    ;
    AdminService.prototype.extractedForValueIncrement = function (value, item, users, candidates, recruiters, callback) {
        if (value && item.length === value) {
            users.candidate = candidates;
            users.recruiter = recruiters;
            callback(null, users);
        }
    };
    AdminService.prototype.getRecruiterDetails = function (result, industries, item, i, recruiters) {
        var recruiterService = new RecruiterService();
        recruiterService.loadCapbilityAndKeySkills(result[0].postedJobs, industries);
        item[i].data = result[0];
        item[i].data.jobCountModel = result[0].jobCountModel;
        recruiters.push(item[i]);
    };
    AdminService.prototype.getCandidateDetails = function (resu, item, i, industries, value, candidates) {
        var candidateService = new CandidateService();
        var response = candidateService.getCandidateDetail(resu[0], item[i], industries);
        response.personalDetails = {};
        item[i].data = response;
        value++;
        candidates.push(item[i]);
        return value;
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
            fs.writeFile('/home/bitnami/apps/jobmosis-staging/c-next/dist/prod/server/public/usagedetail.csv', csv, function (err) {
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
        if (result.candidate && result.candidate.length > 0) {
            var fields = ['first_name', 'last_name', 'mobile_number', 'email', 'isActivated', 'data.location.city', 'data.professionalDetails.education',
                'data.professionalDetails.experience', 'data.professionalDetails.currentSalary', 'data.professionalDetails.noticePeriod',
                'data.professionalDetails.relocate', 'data.professionalDetails.industryExposure', 'data.professionalDetails.currentCompany',
                'data.isCompleted', 'data.isSubmitted', 'data.isVisible'];
            var fieldNames = ['First Name', 'Last Name', 'Mobile Number', 'Email', 'Is Activated', 'Location', 'Education', 'Experience',
                'Current Salary', 'Notice Period', 'Relocate', 'Industry Exposure', 'Current Company', 'Is Completed', 'Is Submitted',
                'Is Visible'];
            var csv = json2csv({
                data: result.candidate, fields: fields, fieldNames: fieldNames,
                unwindPath: []
            });
            fs.writeFile('/home/bitnami/apps/jobmosis-staging/c-next/dist/prod/server/public/candidate.csv', csv, function (err) {
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
        if (result.recruiter && result.recruiter.length > 0) {
            var fields = ['data.company_name', 'data.company_size', 'data.isRecruitingForself', 'data.jobCountModel.numberOfJobposted', 'mobile_number', 'email', 'isActivated', 'data.postedJobs.isJobPosted', 'data.postedJobs.jobTitle', 'data.postedJobs.hiringManager', 'data.postedJobs.department', 'data.postedJobs.education', 'data.postedJobs.experienceMinValue', 'data.postedJobs.experienceMaxValue', 'data.postedJobs.salaryMinValue', 'data.postedJobs.salaryMaxValue', 'data.postedJobs.joiningPeriod', 'data.postedJobs.postingDate', 'data.postedJobs.expiringDate'];
            var fieldNames = ['Company Name', 'company size', 'Recruiting For Self', 'Number of Job Posted', 'Mobile Number', 'Email', 'Is Activated', 'Job Posted', 'Job Title', 'Hiring Manager', 'Department', 'Education', 'Minimum Experience', 'Maximum Experience', 'Minimum Salary', 'Maximum Salary', 'Joining Period', 'Job Posting Date', 'Job Expiry Date'];
            var csv = json2csv({
                data: result.recruiter,
                fields: fields,
                fieldNames: fieldNames,
                unwindPath: ['data.postedJobs']
            });
            fs.writeFile('/home/bitnami/apps/jobmosis-staging/c-next/dist/prod/server/public/recruiter.csv', csv, function (err) {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvYWRtaW4uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBR0EseUVBQTRFO0FBQzVFLG9EQUF1RDtBQUN2RCxtQ0FBcUM7QUFFckMsNkRBQXlEO0FBQ3pELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDbkMsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZCLDZDQUFnRDtBQUNoRCx1REFBMEQ7QUFDMUQsbUZBQXNGO0FBQ3RGLDJEQUE4RDtBQUM5RCxzREFBeUQ7QUFDekQsc0RBQXlEO0FBRXpELGlGQUFvRjtBQUlwRixJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFFNUM7SUFRRTtRQUNFLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztRQUMzQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxrQkFBa0IsRUFBRSxDQUFDO1FBQ25ELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLG1CQUFtQixFQUFFLENBQUM7UUFDckQsSUFBSSxHQUFHLEdBQU8sSUFBSSxZQUFZLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDOUMsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUM7SUFDaEQsQ0FBQztJQUVELG9DQUFhLEdBQWIsVUFBYyxJQUFRLEVBQUUsUUFBb0Q7UUFDMUUsSUFBSSxDQUFDO1lBQ0gsSUFBSSxPQUFLLEdBQW1CLElBQUksZUFBZSxFQUFFLENBQUM7WUFDbEQsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7WUFDOUMsSUFBSSxZQUFVLEdBQXlCLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BELElBQUksWUFBVSxHQUF5QixJQUFJ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OiJhcHAvZnJhbWV3b3JrL3NlcnZpY2VzL2FkbWluLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdGVjaHByaW1lMDAyIG9uIDgvMjgvMjAxNy5cbiAqL1xuaW1wb3J0IFVzZXJSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L3VzZXIucmVwb3NpdG9yeScpO1xuaW1wb3J0IFNlbmRNYWlsU2VydmljZSA9IHJlcXVpcmUoJy4vc2VuZG1haWwuc2VydmljZScpO1xuaW1wb3J0ICogYXMgbW9uZ29vc2UgZnJvbSBcIm1vbmdvb3NlXCI7XG5pbXBvcnQge1JlY3J1aXRlcn0gZnJvbSBcIi4uL2RhdGFhY2Nlc3MvbW9kZWwvcmVjcnVpdGVyLWZpbmFsLm1vZGVsXCI7XG5pbXBvcnQge0NvbnN0VmFyaWFibGVzfSBmcm9tIFwiLi4vc2hhcmVkL3NoYXJlZGNvbnN0YW50c1wiO1xubGV0IGNvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xubGV0IGpzb24yY3N2ID0gcmVxdWlyZSgnanNvbjJjc3YnKTtcbmxldCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5pbXBvcnQgTWVzc2FnZXMgPSByZXF1aXJlKCcuLi9zaGFyZWQvbWVzc2FnZXMnKTtcbmltcG9ydCBNYWlsQXR0YWNobWVudHMgPSByZXF1aXJlKCcuLi9zaGFyZWQvc2hhcmVkYXJyYXknKTtcbmltcG9ydCBSZWNydWl0ZXJSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L3JlY3J1aXRlci5yZXBvc2l0b3J5Jyk7XG5pbXBvcnQgVXNlcnNDbGFzc01vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC91c2VycycpO1xuaW1wb3J0IENhbmRpZGF0ZVNlcnZpY2UgPSByZXF1aXJlKCcuL2NhbmRpZGF0ZS5zZXJ2aWNlJyk7XG5pbXBvcnQgUmVjcnVpdGVyU2VydmljZSA9IHJlcXVpcmUoJy4vcmVjcnVpdGVyLnNlcnZpY2UnKTtcbmltcG9ydCBJbmR1c3RyeU1vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9pbmR1c3RyeS5tb2RlbCcpO1xuaW1wb3J0IEluZHVzdHJ5UmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9pbmR1c3RyeS5yZXBvc2l0b3J5Jyk7XG5pbXBvcnQgQ2FuZGlkYXRlTW9kZWxDbGFzcyA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvY2FuZGlkYXRlQ2xhc3MubW9kZWwnKTtcbmltcG9ydCBSZWNydWl0ZXJDbGFzc01vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9yZWNydWl0ZXJDbGFzcy5tb2RlbCcpO1xuaW1wb3J0IENhbmRpZGF0ZUNsYXNzTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL2NhbmRpZGF0ZS1jbGFzcy5tb2RlbCcpO1xubGV0IHVzZXN0cmFja2luZyA9IHJlcXVpcmUoJ3VzZXMtdHJhY2tpbmcnKTtcblxuY2xhc3MgQWRtaW5TZXJ2aWNlIHtcbiAgY29tcGFueV9uYW1lOnN0cmluZztcbiAgcHJpdmF0ZSB1c2VyUmVwb3NpdG9yeTpVc2VyUmVwb3NpdG9yeTtcbiAgcHJpdmF0ZSBpbmR1c3RyeVJlcG9zaXRpcnk6SW5kdXN0cnlSZXBvc2l0b3J5O1xuICBwcml2YXRlIHJlY3J1aXRlclJlcG9zaXRvcnk6UmVjcnVpdGVyUmVwb3NpdG9yeTtcbiAgcHJpdmF0ZSB1c2VzVHJhY2tpbmdDb250cm9sbGVyOmFueTtcblxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudXNlclJlcG9zaXRvcnkgPSBuZXcgVXNlclJlcG9zaXRvcnkoKTtcbiAgICB0aGlzLmluZHVzdHJ5UmVwb3NpdGlyeSA9IG5ldyBJbmR1c3RyeVJlcG9zaXRvcnkoKTtcbiAgICB0aGlzLnJlY3J1aXRlclJlcG9zaXRvcnkgPSBuZXcgUmVjcnVpdGVyUmVwb3NpdG9yeSgpO1xuICAgIGxldCBvYmo6YW55ID0gbmV3IHVzZXN0cmFja2luZy5NeUNvbnRyb2xsZXIoKTtcbiAgICB0aGlzLnVzZXNUcmFja2luZ0NvbnRyb2xsZXIgPSBvYmouX2NvbnRyb2xsZXI7XG4gIH1cblxuICBzZXBlcmF0ZVVzZXJzKGl0ZW06YW55LCBjYWxsYmFjazooZXJyb3I6YW55LCByZXN1bHQ6VXNlcnNDbGFzc01vZGVsKSA9PiB2b2lkKSB7XG4gICAgdHJ5IHtcbiAgICAgIGxldCB1c2VyczpVc2Vyc0NsYXNzTW9kZWwgPSBuZXcgVXNlcnNDbGFzc01vZGVsKCk7XG4gICAgICBsZXQgY2FuZGlkYXRlU2VydmljZSA9IG5ldyBDYW5kaWRhdGVTZXJ2aWNlKCk7XG4gICAgICBsZXQgY2FuZGlkYXRlczpDYW5kaWRhdGVNb2RlbENsYXNzW10gPSBuZXcgQXJyYXkoMCk7XG4gICAgICBsZXQgcmVjcnVpdGVyczpSZWNydWl0ZXJDbGFzc01vZGVsW10gPSBuZXcgQXJyYXkoMCk7XG4gICAgICBsZXQgdmFsdWUgPSAwO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpdGVtW2ldLmlzQ2FuZGlkYXRlKSB7XG4gICAgICAgICAgY2FuZGlkYXRlU2VydmljZS5yZXRyaWV2ZSh7J3VzZXJJZCc6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZChpdGVtW2ldLl9pZCl9LCAoZXJyb3IsIHJlc3UpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB2YWx1ZSsrO1xuICAgICAgICAgICAgICBpZiAoIWl0ZW1baV0uaXNBZG1pbikge1xuICAgICAgICAgICAgICAgICAgaXRlbVtpXS5kYXRhID0gcmVzdVswXTtcbiAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZXMucHVzaChpdGVtW2ldKTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgJiYgaXRlbS5sZW5ndGggPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICB1c2Vycy5jYW5kaWRhdGUgPSBjYW5kaWRhdGVzO1xuICAgICAgICAgICAgICAgICAgdXNlcnMucmVjcnVpdGVyID0gcmVjcnVpdGVycztcbiAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHVzZXJzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghaXRlbVtpXS5pc0NhbmRpZGF0ZSkge1xuXG4gICAgICAgICAgbGV0IHJlY3J1aXRlclNlcnZpY2UgPSBuZXcgUmVjcnVpdGVyU2VydmljZSgpO1xuICAgICAgICAgIGxldCBkYXRhID0ge1xuICAgICAgICAgICAgICAndXNlcklkJzogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKGl0ZW1baV0uX2lkKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgO1xuICAgICAgICAgIHJlY3J1aXRlclNlcnZpY2UucmV0cmlldmUoZGF0YSwgKGVycm9yOiBhbnksIHJlc3VsdDogUmVjcnVpdGVyW10pID0+IHtcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB2YWx1ZSsrO1xuICAgICAgICAgICAgICBpZiAoIWl0ZW1baV0uaXNBZG1pbikge1xuICAgICAgICAgICAgICAgIGl0ZW1baV0uZGF0YSA9IHJlc3VsdFswXVxuICAgICAgICAgICAgICAgIHJlY3J1aXRlcnMucHVzaChpdGVtW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAodmFsdWUgJiYgaXRlbS5sZW5ndGggPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdXNlcnMuY2FuZGlkYXRlID0gY2FuZGlkYXRlcztcbiAgICAgICAgICAgICAgICB1c2Vycy5yZWNydWl0ZXIgPSByZWNydWl0ZXJzO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHVzZXJzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNhbGxiYWNrKGUsIG51bGwpO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIGV4dHJhY3RlZEZvclZhbHVlSW5jcmVtZW50KHZhbHVlOm51bWJlciwgaXRlbTphbnksIHVzZXJzOlVzZXJzQ2xhc3NNb2RlbCwgY2FuZGlkYXRlczpDYW5kaWRhdGVNb2RlbENsYXNzW10sIHJlY3J1aXRlcnM6UmVjcnVpdGVyQ2xhc3NNb2RlbFtdLCBjYWxsYmFjazooZXJyb3I6YW55LCByZXN1bHQ6YW55KT0+dm9pZCkge1xuICAgIGlmICh2YWx1ZSAmJiBpdGVtLmxlbmd0aCA9PT0gdmFsdWUpIHtcbiAgICAgIHVzZXJzLmNhbmRpZGF0ZSA9IGNhbmRpZGF0ZXM7XG4gICAgICB1c2Vycy5yZWNydWl0ZXIgPSByZWNydWl0ZXJzO1xuICAgICAgY2FsbGJhY2sobnVsbCwgdXNlcnMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0UmVjcnVpdGVyRGV0YWlscyhyZXN1bHQ6UmVjcnVpdGVyW10sIGluZHVzdHJpZXM6SW5kdXN0cnlNb2RlbFtdLCBpdGVtOmFueSwgaTpudW1iZXIsIHJlY3J1aXRlcnM6UmVjcnVpdGVyQ2xhc3NNb2RlbFtdKSB7XG4gICAgbGV0IHJlY3J1aXRlclNlcnZpY2UgPSBuZXcgUmVjcnVpdGVyU2VydmljZSgpO1xuICAgIHJlY3J1aXRlclNlcnZpY2UubG9hZENhcGJpbGl0eUFuZEtleVNraWxscyhyZXN1bHRbMF0ucG9zdGVkSm9icywgaW5kdXN0cmllcyk7XG4gICAgaXRlbVtpXS5kYXRhID0gcmVzdWx0WzBdO1xuICAgIGl0ZW1baV0uZGF0YS5qb2JDb3VudE1vZGVsPXJlc3VsdFswXS5qb2JDb3VudE1vZGVsO1xuICAgIHJlY3J1aXRlcnMucHVzaChpdGVtW2ldKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0Q2FuZGlkYXRlRGV0YWlscyhyZXN1OmFueSwgaXRlbTphbnksIGk6bnVtYmVyLCBpbmR1c3RyaWVzOkluZHVzdHJ5TW9kZWxbXSwgdmFsdWU6bnVtYmVyLCBjYW5kaWRhdGVzOkNhbmRpZGF0ZU1vZGVsQ2xhc3NbXSkge1xuICAgIGxldCBjYW5kaWRhdGVTZXJ2aWNlID0gbmV3IENhbmRpZGF0ZVNlcnZpY2UoKTtcbiAgICBsZXQgcmVzcG9uc2U6YW55ID0gY2FuZGlkYXRlU2VydmljZS5nZXRDYW5kaWRhdGVEZXRhaWwocmVzdVswXSwgaXRlbVtpXSwgaW5kdXN0cmllcyk7XG4gICAgcmVzcG9uc2UucGVyc29uYWxEZXRhaWxzID0ge307XG4gICAgaXRlbVtpXS5kYXRhID0gcmVzcG9uc2U7XG4gICAgdmFsdWUrKztcbiAgICBjYW5kaWRhdGVzLnB1c2goaXRlbVtpXSk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgYWRkVXNhZ2VEZXRhaWxzVmFsdWUoaXRlbTphbnksIGNhbGxiYWNrOihlcnJvcjphbnksIHJlc3VsdDphbnkpID0+IHZvaWQpIHtcbiAgICB0cnkge1xuICAgICAgbGV0IHZhbHVlOm51bWJlciA9IDA7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFsdWUrKztcbiAgICAgICAgaXRlbVtpXS5hY3Rpb24gPSBDb25zdFZhcmlhYmxlcy5BY3Rpb25zQXJyYXlbaXRlbVtpXS5hY3Rpb25dO1xuICAgICAgICBpZiAoaXRlbS5sZW5ndGggPT09IHZhbHVlKSB7XG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwgaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjYWxsYmFjayhlLCBudWxsKTtcbiAgICB9XG4gIH07XG5cbiAgZ2VuZXJhdGVVc2FnZURldGFpbEZpbGUocmVzdWx0OmFueSwgY2FsbGJhY2s6KGVycjphbnksIHJlczphbnkpID0+IHZvaWQpIHtcbiAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgZmllbGRzID0gWydjYW5kaWRhdGVJZCcsICdyZWNydWl0ZXJJZCcsICdqb2JQcm9maWxlSWQnLCAnYWN0aW9uJywgJ3RpbWVzdGFtcCddO1xuICAgICAgbGV0IGZpZWxkTmFtZXMgPSBbJ0NhbmRpZGF0ZSBJZCcsICdSZWNydWl0ZXJJZCcsICdKb2IgUHJvZmlsZSBJZCcsICdBY3Rpb24nLCAnVGltZVN0YW1wJ107XG4gICAgICBsZXQgY3N2ID0ganNvbjJjc3Yoe2RhdGE6IHJlc3VsdCwgZmllbGRzOiBmaWVsZHMsIGZpZWxkTmFtZXM6IGZpZWxkTmFtZXN9KTtcbiAgICAgIC8vZnMud3JpdGVGaWxlKCcuL3NyYy9zZXJ2ZXIvcHVibGljL3VzYWdlZGV0YWlsLmNzdicsIGNzdiwgZnVuY3Rpb24gKGVycjogYW55KSB7XG4gICAgICBmcy53cml0ZUZpbGUoJy9ob21lL2JpdG5hbWkvYXBwcy9qb2Jtb3Npcy1zdGFnaW5nL2MtbmV4dC9kaXN0L3Byb2Qvc2VydmVyL3B1YmxpYy91c2FnZWRldGFpbC5jc3YnLCBjc3YsIGZ1bmN0aW9uIChlcnI6IGFueSkge1xuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0KTtcbiAgICB9XG4gIH07XG5cbiAgZ2VuZXJhdGVDYW5kaWRhdGVEZXRhaWxGaWxlKHJlc3VsdDphbnksIGNhbGxiYWNrOihlcnI6YW55LCByZXM6YW55KSA9PiB2b2lkKSB7XG4gICAgaWYgKHJlc3VsdC5jYW5kaWRhdGUgJiYgcmVzdWx0LmNhbmRpZGF0ZS5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgZmllbGRzID0gWydmaXJzdF9uYW1lJywgJ2xhc3RfbmFtZScsICdtb2JpbGVfbnVtYmVyJywgJ2VtYWlsJywgJ2lzQWN0aXZhdGVkJywgJ2RhdGEubG9jYXRpb24uY2l0eScsICdkYXRhLnByb2Zlc3Npb25hbERldGFpbHMuZWR1Y2F0aW9uJyxcbiAgICAgICAgJ2RhdGEucHJvZmVzc2lvbmFsRGV0YWlscy5leHBlcmllbmNlJywgJ2RhdGEucHJvZmVzc2lvbmFsRGV0YWlscy5jdXJyZW50U2FsYXJ5JywgJ2RhdGEucHJvZmVzc2lvbmFsRGV0YWlscy5ub3RpY2VQZXJpb2QnLFxuICAgICAgICAnZGF0YS5wcm9mZXNzaW9uYWxEZXRhaWxzLnJlbG9jYXRlJywgJ2RhdGEucHJvZmVzc2lvbmFsRGV0YWlscy5pbmR1c3RyeUV4cG9zdXJlJywgJ2RhdGEucHJvZmVzc2lvbmFsRGV0YWlscy5jdXJyZW50Q29tcGFueScsXG4gICAgICAgICdkYXRhLmlzQ29tcGxldGVkJywgJ2RhdGEuaXNTdWJtaXR0ZWQnLCAnZGF0YS5pc1Zpc2libGUnXTtcbiAgICAgIGxldCBmaWVsZE5hbWVzID0gWydGaXJzdCBOYW1lJywgJ0xhc3QgTmFtZScsICdNb2JpbGUgTnVtYmVyJywgJ0VtYWlsJywgJ0lzIEFjdGl2YXRlZCcsICdMb2NhdGlvbicsICdFZHVjYXRpb24nLCAnRXhwZXJpZW5jZScsXG4gICAgICAgICdDdXJyZW50IFNhbGFyeScsICdOb3RpY2UgUGVyaW9kJywgJ1JlbG9jYXRlJywgJ0luZHVzdHJ5IEV4cG9zdXJlJywgJ0N1cnJlbnQgQ29tcGFueScsICdJcyBDb21wbGV0ZWQnLCAnSXMgU3VibWl0dGVkJyxcbiAgICAgICAgJ0lzIFZpc2libGUnXTsvL1xuICAgICAgbGV0IGNzdiA9IGpzb24yY3N2KHtcbiAgICAgICAgZGF0YTogcmVzdWx0LmNhbmRpZGF0ZSwgZmllbGRzOiBmaWVsZHMsIGZpZWxkTmFtZXM6IGZpZWxkTmFtZXMsXG4gICAgICAgIHVud2luZFBhdGg6IFtdXG4gICAgICB9KTtcbiAgICAgIC8vZnMud3JpdGVGaWxlKCcuL3NyYy9zZXJ2ZXIvcHVibGljL2NhbmRpZGF0ZS5jc3YnLCBjc3YsIGZ1bmN0aW9uIChlcnI6YW55KSB7XG4gICAgICBmcy53cml0ZUZpbGUoJy9ob21lL2JpdG5hbWkvYXBwcy9qb2Jtb3Npcy1zdGFnaW5nL2MtbmV4dC9kaXN0L3Byb2Qvc2VydmVyL3B1YmxpYy9jYW5kaWRhdGUuY3N2JywgY3N2LCBmdW5jdGlvbiAoZXJyOiBhbnkpIHtcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICBjYWxsYmFjayhudWxsLCByZXN1bHQpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdCk7XG4gICAgfVxuICB9O1xuXG4gIGdlbmVyYXRlUmVjcnVpdGVyRGV0YWlsRmlsZShyZXN1bHQ6YW55LCBjYWxsYmFjazooZXJyOmFueSwgcmVzOmFueSkgPT4gdm9pZCkge1xuICAgIGlmIChyZXN1bHQucmVjcnVpdGVyICYmIHJlc3VsdC5yZWNydWl0ZXIubGVuZ3RoID4gMCkge1xuICAgICAgbGV0IGZpZWxkcyA9IFsnZGF0YS5jb21wYW55X25hbWUnLCAnZGF0YS5jb21wYW55X3NpemUnLCAnZGF0YS5pc1JlY3J1aXRpbmdGb3JzZWxmJywgJ2RhdGEuam9iQ291bnRNb2RlbC5udW1iZXJPZkpvYnBvc3RlZCcsICdtb2JpbGVfbnVtYmVyJywgJ2VtYWlsJywgJ2lzQWN0aXZhdGVkJywgJ2RhdGEucG9zdGVkSm9icy5pc0pvYlBvc3RlZCcsICdkYXRhLnBvc3RlZEpvYnMuam9iVGl0bGUnLCAnZGF0YS5wb3N0ZWRKb2JzLmhpcmluZ01hbmFnZXInLCAnZGF0YS5wb3N0ZWRKb2JzLmRlcGFydG1lbnQnLCAnZGF0YS5wb3N0ZWRKb2JzLmVkdWNhdGlvbicsICdkYXRhLnBvc3RlZEpvYnMuZXhwZXJpZW5jZU1pblZhbHVlJywgJ2RhdGEucG9zdGVkSm9icy5leHBlcmllbmNlTWF4VmFsdWUnLCAnZGF0YS5wb3N0ZWRKb2JzLnNhbGFyeU1pblZhbHVlJywgJ2RhdGEucG9zdGVkSm9icy5zYWxhcnlNYXhWYWx1ZScsICdkYXRhLnBvc3RlZEpvYnMuam9pbmluZ1BlcmlvZCcsICdkYXRhLnBvc3RlZEpvYnMucG9zdGluZ0RhdGUnLCAnZGF0YS5wb3N0ZWRKb2JzLmV4cGlyaW5nRGF0ZSddO1xuICAgICAgbGV0IGZpZWxkTmFtZXMgPSBbJ0NvbXBhbnkgTmFtZScsICdjb21wYW55IHNpemUnLCAnUmVjcnVpdGluZyBGb3IgU2VsZicsICdOdW1iZXIgb2YgSm9iIFBvc3RlZCcsICdNb2JpbGUgTnVtYmVyJywgJ0VtYWlsJywgJ0lzIEFjdGl2YXRlZCcsICdKb2IgUG9zdGVkJywgJ0pvYiBUaXRsZScsICdIaXJpbmcgTWFuYWdlcicsICdEZXBhcnRtZW50JywgJ0VkdWNhdGlvbicsICdNaW5pbXVtIEV4cGVyaWVuY2UnLCAnTWF4aW11bSBFeHBlcmllbmNlJywgJ01pbmltdW0gU2FsYXJ5JywgJ01heGltdW0gU2FsYXJ5JywgJ0pvaW5pbmcgUGVyaW9kJywgJ0pvYiBQb3N0aW5nIERhdGUnLCAnSm9iIEV4cGlyeSBEYXRlJ107XG4gICAgICBsZXQgY3N2ID0ganNvbjJjc3Yoe1xuICAgICAgICBkYXRhOiByZXN1bHQucmVjcnVpdGVyLFxuICAgICAgICBmaWVsZHM6IGZpZWxkcyxcbiAgICAgICAgZmllbGROYW1lczogZmllbGROYW1lcyxcbiAgICAgICAgdW53aW5kUGF0aDogWydkYXRhLnBvc3RlZEpvYnMnXVxuICAgICAgfSk7XG4gICAgICAvL2ZzLndyaXRlRmlsZSgnLi9zcmMvc2VydmVyL3B1YmxpYy9yZWNydWl0ZXIuY3N2JywgY3N2LCBmdW5jdGlvbiAoZXJyOiBhbnkpIHtcbiAgICAgIGZzLndyaXRlRmlsZSgnL2hvbWUvYml0bmFtaS9hcHBzL2pvYm1vc2lzLXN0YWdpbmcvYy1uZXh0L2Rpc3QvcHJvZC9zZXJ2ZXIvcHVibGljL3JlY3J1aXRlci5jc3YnLCBjc3YsIGZ1bmN0aW9uIChlcnI6IGFueSkge1xuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0KTtcbiAgICB9XG4gIH07XG5cbiAgc2VuZEFkbWluTG9naW5JbmZvTWFpbChmaWVsZDphbnksIGNhbGxiYWNrOihlcnJvcjphbnksIHJlc3VsdDphbnkpID0+IHZvaWQpIHtcbiAgICBsZXQgaGVhZGVyMSA9IGZzLnJlYWRGaWxlU3luYygnLi9zcmMvc2VydmVyL2FwcC9mcmFtZXdvcmsvcHVibGljL2hlYWRlcjEuaHRtbCcpLnRvU3RyaW5nKCk7XG4gICAgbGV0IGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoJy4vc3JjL3NlcnZlci9hcHAvZnJhbWV3b3JrL3B1YmxpYy9hZG1pbmxvZ2luaW5mby5tYWlsLmh0bWwnKS50b1N0cmluZygpO1xuICAgIGxldCBmb290ZXIxID0gZnMucmVhZEZpbGVTeW5jKCcuL3NyYy9zZXJ2ZXIvYXBwL2ZyYW1ld29yay9wdWJsaWMvZm9vdGVyMS5odG1sJykudG9TdHJpbmcoKTtcbiAgICBsZXQgbWlkX2NvbnRlbnQgPSBjb250ZW50LnJlcGxhY2UoJyRlbWFpbCQnLCBmaWVsZC5lbWFpbCkucmVwbGFjZSgnJGFkZHJlc3MkJywgKGZpZWxkLmxvY2F0aW9uID09PSB1bmRlZmluZWQpID8gJ05vdCBGb3VuZCcgOiBmaWVsZC5sb2NhdGlvbilcbiAgICAgIC5yZXBsYWNlKCckaXAkJywgZmllbGQuaXApLnJlcGxhY2UoJyRob3N0JCcsIGNvbmZpZy5nZXQoJ1RwbFNlZWQubWFpbC5ob3N0JykpO1xuXG5cbiAgICBsZXQgbWFpbE9wdGlvbnMgPSB7XG4gICAgICBmcm9tOiBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuTUFJTF9TRU5ERVInKSxcbiAgICAgIHRvOiBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuQURNSU5fTUFJTCcpLFxuICAgICAgY2M6IGNvbmZpZy5nZXQoJ1RwbFNlZWQubWFpbC5UUExHUk9VUF9NQUlMJyksXG4gICAgICBzdWJqZWN0OiBNZXNzYWdlcy5FTUFJTF9TVUJKRUNUX0FETUlOX0xPR0dFRF9PTiArIFwiIFwiICsgY29uZmlnLmdldCgnVHBsU2VlZC5tYWlsLmhvc3QnKSxcbiAgICAgIGh0bWw6IGhlYWRlcjEgKyBtaWRfY29udGVudCArIGZvb3RlcjFcbiAgICAgICwgYXR0YWNobWVudHM6IE1haWxBdHRhY2htZW50cy5BdHRhY2htZW50QXJyYXlcbiAgICB9XG4gICAgbGV0IHNlbmRNYWlsU2VydmljZSA9IG5ldyBTZW5kTWFpbFNlcnZpY2UoKTtcbiAgICBzZW5kTWFpbFNlcnZpY2Uuc2VuZE1haWwobWFpbE9wdGlvbnMsIGNhbGxiYWNrKTtcblxuICB9O1xuXG4gIHVwZGF0ZVVzZXIoX2lkOnN0cmluZywgaXRlbTphbnksIGNhbGxiYWNrOihlcnJvcjphbnksIHJlc3VsdDphbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmZpbmRCeUlkKF9pZCwgKGVycjphbnksIHJlczphbnkpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyLCByZXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy51c2VyUmVwb3NpdG9yeS51cGRhdGUocmVzLl9pZCwgaXRlbSwgY2FsbGJhY2spO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGdldFVzYWdlRGV0YWlscyhmaWVsZDphbnksIGNhbGxiYWNrOihlcnJvcjphbnksIHJlc3VsdDphbnkpID0+IHZvaWQpIHtcbiAgICB0aGlzLnVzZXNUcmFja2luZ0NvbnRyb2xsZXIucmV0cmlldmVBbGwoKGVycjphbnksIHJlczphbnkpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlcyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgfVxufVxuXG5PYmplY3Quc2VhbChBZG1pblNlcnZpY2UpO1xuZXhwb3J0ID0gQWRtaW5TZXJ2aWNlO1xuIl19
