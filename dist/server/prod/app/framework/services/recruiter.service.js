"use strict";
var mongoose = require("mongoose");
var sharedconstants_1 = require("../shared/sharedconstants");
var job_count_model_1 = require("../dataaccess/model/job-count.model");
var Messages = require("../shared/messages");
var UserRepository = require("../dataaccess/repository/user.repository");
var RecruiterRepository = require("../dataaccess/repository/recruiter.repository");
var CandidateRepository = require("../dataaccess/repository/candidate.repository");
var fs = require("fs");
var config = require('config');
var CapabilityMatrixService = require("./capbility-matrix.builder");
var IndustryRepository = require("../dataaccess/repository/industry.repository");
var MailAttachments = require("../shared/sharedarray");
var SendMailService = require("./sendmail.service");
var CandidateService = require("./candidate.service");
var bcrypt = require('bcrypt');
var RecruiterService = (function () {
    function RecruiterService() {
        this.recruiterRepository = new RecruiterRepository();
        this.userRepository = new UserRepository();
        this.industryRepository = new IndustryRepository();
        this.candidateRepository = new CandidateRepository();
    }
    RecruiterService.prototype.createUser = function (item, callback) {
        var _this = this;
        this.userRepository.retrieve({ 'email': item.email }, function (err, res) {
            if (err) {
                callback(new Error(err), null);
            }
            else if (res.length > 0) {
                if (res[0].isActivated === true) {
                    callback(new Error(Messages.MSG_ERROR_REGISTRATION), null);
                }
                else if (res[0].isActivated === false) {
                    callback(new Error(Messages.MSG_ERROR_VERIFY_ACCOUNT), null);
                }
            }
            else {
                item.isActivated = false;
                item.isCandidate = false;
                var saltRounds = 10;
                bcrypt.hash(item.password, saltRounds, function (err, hash) {
                    if (err) {
                        callback(new Error(Messages.MSG_ERROR_BCRYPT_CREATION), null);
                    }
                    else {
                        item.password = hash;
                        _this.userRepository.create(item, function (err, res) {
                            if (err) {
                                callback(new Error(Messages.MSG_ERROR_REGISTRATION_MOBILE_NUMBER), null);
                            }
                            else {
                                var userId1 = res._id;
                                var newItem = {
                                    isRecruitingForself: item.isRecruitingForself,
                                    company_name: item.company_name,
                                    company_size: item.company_size,
                                    company_logo: item.company_logo,
                                    company_website: item.company_website,
                                    userId: userId1
                                };
                                _this.recruiterRepository.create(newItem, function (err, res) {
                                    if (err) {
                                        callback(err, null);
                                    }
                                    else {
                                        callback(null, res);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    };
    RecruiterService.prototype.findOneAndUpdate = function (query, newData, options, callback) {
        this.recruiterRepository.findOneAndUpdate(query, newData, options, callback);
    };
    RecruiterService.prototype.retrieve = function (field, callback) {
        this.recruiterRepository.retrieve(field, function (err, res) {
            if (err) {
                var er = new Error('Unable to retrieve recruiter details.');
                callback(er, null);
            }
            else {
                var recruiter = void 0;
                recruiter = res[0];
                if (recruiter) {
                    recruiter.jobCountModel = new job_count_model_1.JobCountModel();
                    recruiter.jobCountModel.numberOfJobposted = recruiter.postedJobs.length;
                }
                if (res.length > 0) {
                    if (recruiter.postedJobs) {
                        for (var _i = 0, _a = recruiter.postedJobs; _i < _a.length; _i++) {
                            var job = _a[_i];
                            for (var _b = 0, _c = job.candidate_list; _b < _c.length; _b++) {
                                var list = _c[_b];
                                switch (list.name) {
                                    case sharedconstants_1.ConstVariables.APPLIED_CANDIDATE:
                                        recruiter.jobCountModel.totalNumberOfCandidatesApplied += list.ids.length;
                                        break;
                                    case sharedconstants_1.ConstVariables.CART_LISTED_CANDIDATE:
                                        recruiter.jobCountModel.totalNumberOfCandidateInCart += list.ids.length;
                                        break;
                                    case sharedconstants_1.ConstVariables.REJECTED_LISTED_CANDIDATE:
                                        recruiter.jobCountModel.totalNumberOfCandidatesRejected += list.ids.length;
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                    }
                }
                callback(null, [recruiter]);
            }
        });
    };
    RecruiterService.prototype.addJob = function (_id, item, callback) {
        this.recruiterRepository.findOneAndUpdate({ 'userId': new mongoose.Types.ObjectId(_id) }, { $push: { postedJobs: item.postedJobs } }, {
            'new': true, select: {
                postedJobs: {
                    $elemMatch: { 'postingDate': item.postedJobs.postingDate }
                }
            }
        }, function (err, record) {
            if (record) {
                callback(null, record);
            }
            else {
                var error = void 0;
                if (record === null) {
                    error = new Error('Unable to update posted job maybe recruiter not found. ');
                    callback(error, null);
                }
                else {
                    callback(err, null);
                }
            }
        });
    };
    RecruiterService.prototype.addCloneJob = function (_id, item, callback) {
        this.recruiterRepository.findOneAndUpdate({ 'userId': new mongoose.Types.ObjectId(_id) }, { $push: { postedJobs: item } }, {
            'new': true, select: {
                postedJobs: {
                    $elemMatch: { 'postingDate': item.postingDate }
                }
            }
        }, function (err, record) {
            if (record) {
                callback(null, record);
            }
            else {
                var error = void 0;
                if (record === null) {
                    error = new Error('Job cloning is failed');
                    callback(error, null);
                }
                else {
                    callback(err, null);
                }
            }
        });
    };
    RecruiterService.prototype.updateJob = function (_id, item, callback) {
        var _this = this;
        var capabilityMatrixService = new CapabilityMatrixService();
        this.industryRepository.retrieve({ 'name': item.postedJobs.industry.name }, function (error, industries) {
            if (error) {
                callback(error, null);
            }
            else {
                if (item.postedJobs.capability_matrix === undefined) {
                    item.postedJobs.capability_matrix = {};
                }
                var new_capability_matrix = {};
                var new_complexity_musthave_matrix = {};
                item.postedJobs.capability_matrix = capabilityMatrixService.getCapabilityMatrix(item.postedJobs, industries, new_capability_matrix);
                item.postedJobs.complexity_musthave_matrix = capabilityMatrixService.getComplexityMustHaveMatrix(item.postedJobs, industries, new_complexity_musthave_matrix);
                _this.recruiterRepository.findOneAndUpdate({
                    'userId': new mongoose.Types.ObjectId(_id),
                    'postedJobs._id': new mongoose.Types.ObjectId(item.postedJobs._id)
                }, { $set: { 'postedJobs.$': item.postedJobs } }, {
                    'new': true, select: {
                        postedJobs: {
                            $elemMatch: { 'postingDate': item.postedJobs.postingDate }
                        }
                    }
                }, function (err, record) {
                    if (record) {
                        callback(null, record);
                    }
                    else {
                        var error_1;
                        if (record === null) {
                            error_1 = new Error('Unable to update posted job maybe recruiter & job post not found. ');
                            callback(error_1, null);
                        }
                        else {
                            callback(err, null);
                        }
                    }
                });
            }
        });
    };
    RecruiterService.prototype.findById = function (id, callback) {
        this.recruiterRepository.findById(id, callback);
    };
    RecruiterService.prototype.getList = function (item, callback) {
        var _this = this;
        var query = {
            'postedJobs._id': { $in: item.ids },
        };
        this.recruiterRepository.retrieve(query, function (err, res) {
            if (err) {
                callback(err, null);
            }
            else {
                _this.recruiterRepository.getJobProfileQCard(res, item.candidate, item.ids, 'none', function (canError, canResult) {
                    if (canError) {
                        callback(canError, null);
                    }
                    else {
                        callback(null, canResult);
                    }
                });
            }
        });
    };
    RecruiterService.prototype.updateDetails = function (_id, item, callback) {
        var _this = this;
        this.recruiterRepository.retrieve({ 'userId': new mongoose.Types.ObjectId(_id) }, function (err, res) {
            if (err) {
                callback(err, res);
            }
            else {
                _this.recruiterRepository.findOneAndUpdate({ '_id': res[0]._id }, item, { 'new': true }, callback);
            }
        });
    };
    RecruiterService.prototype.getCandidateList = function (item, callback) {
        var _this = this;
        var query = {
            'postedJobs': { $elemMatch: { '_id': new mongoose.Types.ObjectId(item.jobProfileId) } }
        };
        this.recruiterRepository.retrieve(query, function (err, res) {
            if (err) {
                callback(new Error('Not Found Any Job posted'), null);
            }
            else {
                if (res.length > 0) {
                    var candidateIds_1 = new Array(0);
                    var jobProfile_1;
                    for (var _i = 0, _a = res[0].postedJobs; _i < _a.length; _i++) {
                        var job = _a[_i];
                        if (job._id.toString() === item.jobProfileId) {
                            jobProfile_1 = job;
                            for (var _b = 0, _c = job.candidate_list; _b < _c.length; _b++) {
                                var list = _c[_b];
                                if (list.name.toString() === item.listName.toString()) {
                                    candidateIds_1 = list.ids;
                                }
                            }
                        }
                    }
                    _this.candidateRepository.retrieveByMultiIds(candidateIds_1, {}, function (err, res) {
                        if (err) {
                            callback(new Error('Candidates are not founds'), null);
                        }
                        else {
                            _this.candidateRepository.getCandidateQCard(res, jobProfile_1, candidateIds_1, callback);
                        }
                    });
                }
            }
        });
    };
    RecruiterService.prototype.getJobById = function (id, callback) {
        var query = {
            'postedJobs': { $elemMatch: { '_id': new mongoose.Types.ObjectId(id) } }
        };
        this.recruiterRepository.retrieve(query, function (err, res) {
            if (err) {
                callback(new Error('Problem in Job Retrieve'), null);
            }
            else {
                var jobProfile = void 0;
                if (res.length > 0) {
                    for (var _i = 0, _a = res[0].postedJobs; _i < _a.length; _i++) {
                        var job = _a[_i];
                        if (job._id.toString() === id) {
                            jobProfile = job;
                        }
                    }
                }
                callback(null, jobProfile);
            }
        });
    };
    RecruiterService.prototype.loadCapbilityAndKeySkills = function (postedJob) {
        var candidateService = new CandidateService();
        for (var i = 0; i < postedJob.length; i++) {
            if (postedJob[i].proficiencies.length > 0) {
                postedJob[i].keySkills = postedJob[i].proficiencies.toString().replace(/,/g, ' $');
            }
            if (postedJob[i].additionalProficiencies.length > 0) {
                postedJob[i].additionalKeySkills = postedJob[i].additionalProficiencies.toString().replace(/,/g, ' $');
            }
            if (postedJob[i].capability_matrix) {
                postedJob[i].capabilityMatrix = candidateService.loadCapabilitiDetails(postedJob[i].capability_matrix);
            }
            if (postedJob[i].industry.roles.length > 0) {
                postedJob[i].roles = candidateService.loadRoles(postedJob[i].industry.roles);
            }
        }
        return postedJob;
    };
    RecruiterService.prototype.retrieveBySortedOrder = function (query, projection, sortingQuery, callback) {
        this.recruiterRepository.retrieveBySortedOrder(query, projection, sortingQuery, callback);
    };
    RecruiterService.prototype.retrieveWithLean = function (field, projection, callback) {
        console.log("inside recruiter service");
        this.recruiterRepository.retrieveWithLean(field, projection, callback);
    };
    RecruiterService.prototype.sendMailToAdvisor = function (field, callback) {
        var header1 = fs.readFileSync('./src/server/public/header1.html').toString();
        var footer1 = fs.readFileSync('./src/server/public/footer1.html').toString();
        var mailOptions = {
            to: field.email_id,
            subject: Messages.EMAIL_SUBJECT_RECRUITER_CONTACTED_YOU,
            html: header1 + footer1, attachments: MailAttachments.AttachmentArray
        };
        var sendMailService = new SendMailService();
        sendMailService.sendMail(mailOptions, callback);
    };
    RecruiterService.prototype.sendMailToRecruiter = function (user, field, callback) {
        var header1 = fs.readFileSync('./src/server/app/framework/public/header1.html').toString();
        var content = fs.readFileSync('./src/server/app/framework/public/confirmation.mail.html').toString();
        var footer1 = fs.readFileSync('./src/server/app/framework/public/footer1.html').toString();
        content = content.replace('$job_title$', field.jobTitle);
        var host = config.get('TplSeed.mail.host');
        var link = host + 'signin';
        content = content.replace('$link$', link);
        var mailOptions = {
            to: user.email,
            subject: Messages.EMAIL_SUBJECT_RECRUITER_CONTACTED_YOU + field.jobTitle,
            html: header1 + content + footer1, attachments: MailAttachments.AttachmentArray
        };
        var sendMailService = new SendMailService();
        sendMailService.sendMail(mailOptions, callback);
    };
    RecruiterService.prototype.getTotalRecruiterCount = function (callback) {
        var query = {};
        this.recruiterRepository.getCount(query, function (err, result) {
            if (err) {
                callback(err, null);
            }
            else {
                callback(err, result);
            }
        });
    };
    return RecruiterService;
}());
Object.seal(RecruiterService);
module.exports = RecruiterService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvcmVjcnVpdGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLG1DQUFxQztBQUVyQyw2REFBeUQ7QUFDekQsdUVBQWtFO0FBQ2xFLDZDQUFnRDtBQUNoRCx5RUFBNEU7QUFDNUUsbUZBQXNGO0FBRXRGLG1GQUFzRjtBQUN0Rix1QkFBeUI7QUFDekIsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLG9FQUF1RTtBQUV2RSxpRkFBb0Y7QUFDcEYsdURBQTBEO0FBQzFELG9EQUF1RDtBQUd2RCxzREFBeUQ7QUFDekQsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRS9CO0lBT0U7UUFDRSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1FBQ3JELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztRQUMzQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxrQkFBa0IsRUFBRSxDQUFDO1FBQ25ELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLG1CQUFtQixFQUFFLENBQUM7SUFDdkQsQ0FBQztJQUVELHFDQUFVLEdBQVYsVUFBVyxJQUFTLEVBQUUsUUFBMkM7UUFBakUsaUJBNkNDO1FBNUNDLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUMsRUFBRSxVQUFDLEdBQUcsRUFBRSxHQUFHO1lBQzNELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2pDLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFD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QUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sUUFBUSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUN4QixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUgsdUJBQUM7QUFBRCxDQXBXQSxBQW9XQyxJQUFBO0FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzlCLGlCQUFTLGdCQUFnQixDQUFDIiwiZmlsZSI6ImFwcC9mcmFtZXdvcmsvc2VydmljZXMvcmVjcnVpdGVyLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBtb25nb29zZSBmcm9tIFwibW9uZ29vc2VcIjtcclxuaW1wb3J0IHtSZWNydWl0ZXJ9IGZyb20gXCIuLi9kYXRhYWNjZXNzL21vZGVsL3JlY3J1aXRlci1maW5hbC5tb2RlbFwiO1xyXG5pbXBvcnQge0NvbnN0VmFyaWFibGVzfSBmcm9tIFwiLi4vc2hhcmVkL3NoYXJlZGNvbnN0YW50c1wiO1xyXG5pbXBvcnQge0pvYkNvdW50TW9kZWx9IGZyb20gXCIuLi9kYXRhYWNjZXNzL21vZGVsL2pvYi1jb3VudC5tb2RlbFwiO1xyXG5pbXBvcnQgTWVzc2FnZXMgPSByZXF1aXJlKCcuLi9zaGFyZWQvbWVzc2FnZXMnKTtcclxuaW1wb3J0IFVzZXJSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L3VzZXIucmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgUmVjcnVpdGVyUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9yZWNydWl0ZXIucmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgSm9iUHJvZmlsZU1vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9qb2Jwcm9maWxlLm1vZGVsJyk7XHJcbmltcG9ydCBDYW5kaWRhdGVSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2NhbmRpZGF0ZS5yZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJ2NvbmZpZycpO1xyXG5pbXBvcnQgQ2FwYWJpbGl0eU1hdHJpeFNlcnZpY2UgPSByZXF1aXJlKCcuL2NhcGJpbGl0eS1tYXRyaXguYnVpbGRlcicpO1xyXG5pbXBvcnQgSW5kdXN0cnlNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvaW5kdXN0cnkubW9kZWwnKTtcclxuaW1wb3J0IEluZHVzdHJ5UmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9pbmR1c3RyeS5yZXBvc2l0b3J5Jyk7XHJcbmltcG9ydCBNYWlsQXR0YWNobWVudHMgPSByZXF1aXJlKFwiLi4vc2hhcmVkL3NoYXJlZGFycmF5XCIpO1xyXG5pbXBvcnQgU2VuZE1haWxTZXJ2aWNlID0gcmVxdWlyZShcIi4vc2VuZG1haWwuc2VydmljZVwiKTtcclxuaW1wb3J0IFJlY3J1aXRlck1vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9yZWNydWl0ZXIubW9kZWwnKTtcclxuaW1wb3J0IFJlY3J1aXRlckNsYXNzTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3JlY3J1aXRlckNsYXNzLm1vZGVsJyk7XHJcbmltcG9ydCBDYW5kaWRhdGVTZXJ2aWNlID0gcmVxdWlyZSgnLi9jYW5kaWRhdGUuc2VydmljZScpO1xyXG52YXIgYmNyeXB0ID0gcmVxdWlyZSgnYmNyeXB0Jyk7XHJcblxyXG5jbGFzcyBSZWNydWl0ZXJTZXJ2aWNlIHtcclxuICBBUFBfTkFNRTogc3RyaW5nO1xyXG4gIHByaXZhdGUgcmVjcnVpdGVyUmVwb3NpdG9yeTogUmVjcnVpdGVyUmVwb3NpdG9yeTtcclxuICBwcml2YXRlIGNhbmRpZGF0ZVJlcG9zaXRvcnk6IENhbmRpZGF0ZVJlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSB1c2VyUmVwb3NpdG9yeTogVXNlclJlcG9zaXRvcnk7XHJcbiAgcHJpdmF0ZSBpbmR1c3RyeVJlcG9zaXRvcnk6IEluZHVzdHJ5UmVwb3NpdG9yeTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnJlY3J1aXRlclJlcG9zaXRvcnkgPSBuZXcgUmVjcnVpdGVyUmVwb3NpdG9yeSgpO1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeSA9IG5ldyBVc2VyUmVwb3NpdG9yeSgpO1xyXG4gICAgdGhpcy5pbmR1c3RyeVJlcG9zaXRvcnkgPSBuZXcgSW5kdXN0cnlSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkgPSBuZXcgQ2FuZGlkYXRlUmVwb3NpdG9yeSgpO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlVXNlcihpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRoaXMudXNlclJlcG9zaXRvcnkucmV0cmlldmUoeydlbWFpbCc6IGl0ZW0uZW1haWx9LCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihlcnIpLCBudWxsKTtcclxuICAgICAgfSBlbHNlIGlmIChyZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGlmIChyZXNbMF0uaXNBY3RpdmF0ZWQgPT09IHRydWUpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfUkVHSVNUUkFUSU9OKSwgbnVsbCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChyZXNbMF0uaXNBY3RpdmF0ZWQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1ZFUklGWV9BQ0NPVU5UKSwgbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGl0ZW0uaXNBY3RpdmF0ZWQgPSBmYWxzZTtcclxuICAgICAgICBpdGVtLmlzQ2FuZGlkYXRlID0gZmFsc2U7XHJcbiAgICAgICAgY29uc3Qgc2FsdFJvdW5kcyA9IDEwO1xyXG4gICAgICAgIGJjcnlwdC5oYXNoKGl0ZW0ucGFzc3dvcmQsIHNhbHRSb3VuZHMsIChlcnI6IGFueSwgaGFzaDogYW55KSA9PiB7XHJcbiAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfQkNSWVBUX0NSRUFUSU9OKSwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpdGVtLnBhc3N3b3JkID0gaGFzaDtcclxuICAgICAgICAgICAgdGhpcy51c2VyUmVwb3NpdG9yeS5jcmVhdGUoaXRlbSwgKGVyciwgcmVzKSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT05fTU9CSUxFX05VTUJFUiksIG51bGwpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdXNlcklkMSA9IHJlcy5faWQ7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3SXRlbTogYW55ID0ge1xyXG4gICAgICAgICAgICAgICAgICBpc1JlY3J1aXRpbmdGb3JzZWxmOiBpdGVtLmlzUmVjcnVpdGluZ0ZvcnNlbGYsXHJcbiAgICAgICAgICAgICAgICAgIGNvbXBhbnlfbmFtZTogaXRlbS5jb21wYW55X25hbWUsXHJcbiAgICAgICAgICAgICAgICAgIGNvbXBhbnlfc2l6ZTogaXRlbS5jb21wYW55X3NpemUsXHJcbiAgICAgICAgICAgICAgICAgIGNvbXBhbnlfbG9nbzogaXRlbS5jb21wYW55X2xvZ28sXHJcbiAgICAgICAgICAgICAgICAgIGNvbXBhbnlfd2Vic2l0ZTogaXRlbS5jb21wYW55X3dlYnNpdGUsXHJcbiAgICAgICAgICAgICAgICAgIHVzZXJJZDogdXNlcklkMVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeS5jcmVhdGUobmV3SXRlbSwgKGVycjogYW55LCByZXM6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCByZXMpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZpbmRPbmVBbmRVcGRhdGUocXVlcnk6IGFueSwgbmV3RGF0YTogYW55LCBvcHRpb25zOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHF1ZXJ5LCBuZXdEYXRhLCBvcHRpb25zLCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICByZXRyaWV2ZShmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnJlY3J1aXRlclJlcG9zaXRvcnkucmV0cmlldmUoZmllbGQsIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgbGV0IGVyID0gbmV3IEVycm9yKCdVbmFibGUgdG8gcmV0cmlldmUgcmVjcnVpdGVyIGRldGFpbHMuJyk7XHJcbiAgICAgICAgY2FsbGJhY2soZXIsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCByZWNydWl0ZXI6IFJlY3J1aXRlcjtcclxuICAgICAgICByZWNydWl0ZXIgPSByZXNbMF07XHJcbiAgICAgICAgaWYgKHJlY3J1aXRlcikge1xyXG4gICAgICAgICAgcmVjcnVpdGVyLmpvYkNvdW50TW9kZWwgPSBuZXcgSm9iQ291bnRNb2RlbCgpO1xyXG4gICAgICAgICAgcmVjcnVpdGVyLmpvYkNvdW50TW9kZWwubnVtYmVyT2ZKb2Jwb3N0ZWQgPSByZWNydWl0ZXIucG9zdGVkSm9icy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgaWYgKHJlY3J1aXRlci5wb3N0ZWRKb2JzKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGpvYiBvZiByZWNydWl0ZXIucG9zdGVkSm9icykge1xyXG4gICAgICAgICAgICAgIGZvciAobGV0IGxpc3Qgb2Ygam9iLmNhbmRpZGF0ZV9saXN0KSB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGxpc3QubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICBjYXNlIENvbnN0VmFyaWFibGVzLkFQUExJRURfQ0FORElEQVRFIDpcclxuICAgICAgICAgICAgICAgICAgICByZWNydWl0ZXIuam9iQ291bnRNb2RlbC50b3RhbE51bWJlck9mQ2FuZGlkYXRlc0FwcGxpZWQgKz0gbGlzdC5pZHMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICBjYXNlIENvbnN0VmFyaWFibGVzLkNBUlRfTElTVEVEX0NBTkRJREFURSA6XHJcbiAgICAgICAgICAgICAgICAgICAgcmVjcnVpdGVyLmpvYkNvdW50TW9kZWwudG90YWxOdW1iZXJPZkNhbmRpZGF0ZUluQ2FydCArPSBsaXN0Lmlkcy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgIGNhc2UgQ29uc3RWYXJpYWJsZXMuUkVKRUNURURfTElTVEVEX0NBTkRJREFURSA6XHJcbiAgICAgICAgICAgICAgICAgICAgcmVjcnVpdGVyLmpvYkNvdW50TW9kZWwudG90YWxOdW1iZXJPZkNhbmRpZGF0ZXNSZWplY3RlZCArPSBsaXN0Lmlkcy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgIGRlZmF1bHQgOlxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYWxsYmFjayhudWxsLCBbcmVjcnVpdGVyXSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgYWRkSm9iKF9pZDogc3RyaW5nLCBpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHsgLy9Ub2RvIGNoYW5nZSB3aXRoIGNhbmRpZGF0ZV9pZCBub3cgaXQgaXMgYSB1c2VyX2lkIG9wZXJhdGlvblxyXG4gICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUoeyd1c2VySWQnOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQoX2lkKX0sXHJcbiAgICAgIHskcHVzaDoge3Bvc3RlZEpvYnM6IGl0ZW0ucG9zdGVkSm9ic319LFxyXG4gICAgICB7XHJcbiAgICAgICAgJ25ldyc6IHRydWUsIHNlbGVjdDoge1xyXG4gICAgICAgIHBvc3RlZEpvYnM6IHtcclxuICAgICAgICAgICRlbGVtTWF0Y2g6IHsncG9zdGluZ0RhdGUnOiBpdGVtLnBvc3RlZEpvYnMucG9zdGluZ0RhdGV9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGZ1bmN0aW9uIChlcnIsIHJlY29yZCkge1xyXG4gICAgICAgIGlmIChyZWNvcmQpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlY29yZCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxldCBlcnJvcjogYW55O1xyXG4gICAgICAgICAgaWYgKHJlY29yZCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBlcnJvciA9IG5ldyBFcnJvcignVW5hYmxlIHRvIHVwZGF0ZSBwb3N0ZWQgam9iIG1heWJlIHJlY3J1aXRlciBub3QgZm91bmQuICcpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBhZGRDbG9uZUpvYihfaWQ6IHN0cmluZywgaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7IC8vVG9kbyBjaGFuZ2Ugd2l0aCBjYW5kaWRhdGVfaWQgbm93IGl0IGlzIGEgdXNlcl9pZCBvcGVyYXRpb25cclxuICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeS5maW5kT25lQW5kVXBkYXRlKHsndXNlcklkJzogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKF9pZCl9LFxyXG4gICAgICB7JHB1c2g6IHtwb3N0ZWRKb2JzOiBpdGVtfX0sXHJcbiAgICAgIHtcclxuICAgICAgICAnbmV3JzogdHJ1ZSwgc2VsZWN0OiB7XHJcbiAgICAgICAgcG9zdGVkSm9iczoge1xyXG4gICAgICAgICAgJGVsZW1NYXRjaDogeydwb3N0aW5nRGF0ZSc6IGl0ZW0ucG9zdGluZ0RhdGV9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGZ1bmN0aW9uIChlcnIsIHJlY29yZCkge1xyXG4gICAgICAgIGlmIChyZWNvcmQpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlY29yZCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxldCBlcnJvcjogYW55O1xyXG4gICAgICAgICAgaWYgKHJlY29yZCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBlcnJvciA9IG5ldyBFcnJvcignSm9iIGNsb25pbmcgaXMgZmFpbGVkJyk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUpvYihfaWQ6IHN0cmluZywgaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7IC8vVG9kbyBjaGFuZ2Ugd2l0aCBjYW5kaWRhdGVfaWQgbm93IGl0IGlzIGEgdXNlcl9pZCBvcGVyYXRpb25cclxuXHJcbiAgICBsZXQgY2FwYWJpbGl0eU1hdHJpeFNlcnZpY2U6IENhcGFiaWxpdHlNYXRyaXhTZXJ2aWNlID0gbmV3IENhcGFiaWxpdHlNYXRyaXhTZXJ2aWNlKCk7XHJcbiAgICB0aGlzLmluZHVzdHJ5UmVwb3NpdG9yeS5yZXRyaWV2ZSh7J25hbWUnOiBpdGVtLnBvc3RlZEpvYnMuaW5kdXN0cnkubmFtZX0sIChlcnJvcjogYW55LCBpbmR1c3RyaWVzOiBJbmR1c3RyeU1vZGVsW10pID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChpdGVtLnBvc3RlZEpvYnMuY2FwYWJpbGl0eV9tYXRyaXggPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgaXRlbS5wb3N0ZWRKb2JzLmNhcGFiaWxpdHlfbWF0cml4ID0ge307XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBuZXdfY2FwYWJpbGl0eV9tYXRyaXg6IGFueSA9IHt9O1xyXG4gICAgICAgIGxldCBuZXdfY29tcGxleGl0eV9tdXN0aGF2ZV9tYXRyaXg6IGFueSA9IHt9O1xyXG4gICAgICAgIGl0ZW0ucG9zdGVkSm9icy5jYXBhYmlsaXR5X21hdHJpeCA9IGNhcGFiaWxpdHlNYXRyaXhTZXJ2aWNlLmdldENhcGFiaWxpdHlNYXRyaXgoaXRlbS5wb3N0ZWRKb2JzLCBpbmR1c3RyaWVzLCBuZXdfY2FwYWJpbGl0eV9tYXRyaXgpO1xyXG4gICAgICAgIGl0ZW0ucG9zdGVkSm9icy5jb21wbGV4aXR5X211c3RoYXZlX21hdHJpeCA9IGNhcGFiaWxpdHlNYXRyaXhTZXJ2aWNlLmdldENvbXBsZXhpdHlNdXN0SGF2ZU1hdHJpeChpdGVtLnBvc3RlZEpvYnMsIGluZHVzdHJpZXMsIG5ld19jb21wbGV4aXR5X211c3RoYXZlX21hdHJpeCk7XHJcbiAgICAgICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUoXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgICd1c2VySWQnOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQoX2lkKSxcclxuICAgICAgICAgICAgJ3Bvc3RlZEpvYnMuX2lkJzogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKGl0ZW0ucG9zdGVkSm9icy5faWQpXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgeyRzZXQ6IHsncG9zdGVkSm9icy4kJzogaXRlbS5wb3N0ZWRKb2JzfX0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgICduZXcnOiB0cnVlLCBzZWxlY3Q6IHtcclxuICAgICAgICAgICAgcG9zdGVkSm9iczoge1xyXG4gICAgICAgICAgICAgICRlbGVtTWF0Y2g6IHsncG9zdGluZ0RhdGUnOiBpdGVtLnBvc3RlZEpvYnMucG9zdGluZ0RhdGV9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBmdW5jdGlvbiAoZXJyLCByZWNvcmQpIHtcclxuICAgICAgICAgICAgaWYgKHJlY29yZCkge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlY29yZCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgbGV0IGVycm9yOiBhbnk7XHJcbiAgICAgICAgICAgICAgaWYgKHJlY29yZCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoJ1VuYWJsZSB0byB1cGRhdGUgcG9zdGVkIGpvYiBtYXliZSByZWNydWl0ZXIgJiBqb2IgcG9zdCBub3QgZm91bmQuICcpO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZmluZEJ5SWQoaWQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LmZpbmRCeUlkKGlkLCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICBnZXRMaXN0KGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IHF1ZXJ5ID0ge1xyXG4gICAgICAncG9zdGVkSm9icy5faWQnOiB7JGluOiBpdGVtLmlkc30sXHJcbiAgICB9O1xyXG4gICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LnJldHJpZXZlKHF1ZXJ5LCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LmdldEpvYlByb2ZpbGVRQ2FyZChyZXMsIGl0ZW0uY2FuZGlkYXRlLCBpdGVtLmlkcywgJ25vbmUnLCAoY2FuRXJyb3IsIGNhblJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGNhbkVycm9yKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGNhbkVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGNhblJlc3VsdCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlRGV0YWlscyhfaWQ6IHN0cmluZywgaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcblxyXG4gICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LnJldHJpZXZlKHsndXNlcklkJzogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKF9pZCl9LCAoZXJyLCByZXMpID0+IHtcclxuXHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnIsIHJlcyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUoeydfaWQnOiByZXNbMF0uX2lkfSwgaXRlbSwgeyduZXcnOiB0cnVlfSwgY2FsbGJhY2spO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldENhbmRpZGF0ZUxpc3QoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsZXQgcXVlcnkgPSB7XHJcbiAgICAgICdwb3N0ZWRKb2JzJzogeyRlbGVtTWF0Y2g6IHsnX2lkJzogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKGl0ZW0uam9iUHJvZmlsZUlkKX19XHJcbiAgICB9O1xyXG4gICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LnJldHJpZXZlKHF1ZXJ5LCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcignTm90IEZvdW5kIEFueSBKb2IgcG9zdGVkJyksIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgbGV0IGNhbmRpZGF0ZUlkczogc3RyaW5nW10gPSBuZXcgQXJyYXkoMCk7XHJcbiAgICAgICAgICBsZXQgam9iUHJvZmlsZTogSm9iUHJvZmlsZU1vZGVsO1xyXG4gICAgICAgICAgZm9yIChsZXQgam9iIG9mIHJlc1swXS5wb3N0ZWRKb2JzKSB7XHJcbiAgICAgICAgICAgIGlmIChqb2IuX2lkLnRvU3RyaW5nKCkgPT09IGl0ZW0uam9iUHJvZmlsZUlkKSB7XHJcbiAgICAgICAgICAgICAgam9iUHJvZmlsZSA9IGpvYjtcclxuICAgICAgICAgICAgICBmb3IgKGxldCBsaXN0IG9mIGpvYi5jYW5kaWRhdGVfbGlzdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxpc3QubmFtZS50b1N0cmluZygpID09PSBpdGVtLmxpc3ROYW1lLnRvU3RyaW5nKCkpIHtcclxuICAgICAgICAgICAgICAgICAgY2FuZGlkYXRlSWRzID0gbGlzdC5pZHM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkucmV0cmlldmVCeU11bHRpSWRzKGNhbmRpZGF0ZUlkcywge30sIChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcignQ2FuZGlkYXRlcyBhcmUgbm90IGZvdW5kcycpLCBudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkuZ2V0Q2FuZGlkYXRlUUNhcmQocmVzLCBqb2JQcm9maWxlLCBjYW5kaWRhdGVJZHMsIGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEpvYkJ5SWQoaWQ6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IEpvYlByb2ZpbGVNb2RlbCkgPT4gdm9pZCkge1xyXG4gICAgbGV0IHF1ZXJ5ID0ge1xyXG4gICAgICAncG9zdGVkSm9icyc6IHskZWxlbU1hdGNoOiB7J19pZCc6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZChpZCl9fVxyXG4gICAgfTtcclxuICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeS5yZXRyaWV2ZShxdWVyeSwgKGVycjogYW55LCByZXM6IFJlY3J1aXRlck1vZGVsW10pID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcignUHJvYmxlbSBpbiBKb2IgUmV0cmlldmUnKSwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGpvYlByb2ZpbGU6IEpvYlByb2ZpbGVNb2RlbDtcclxuICAgICAgICBpZiAocmVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIGZvciAobGV0IGpvYiBvZiByZXNbMF0ucG9zdGVkSm9icykge1xyXG4gICAgICAgICAgICBpZiAoam9iLl9pZC50b1N0cmluZygpID09PSBpZCkge1xyXG4gICAgICAgICAgICAgIGpvYlByb2ZpbGUgPSBqb2I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgam9iUHJvZmlsZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbG9hZENhcGJpbGl0eUFuZEtleVNraWxscyhwb3N0ZWRKb2I6IEpvYlByb2ZpbGVNb2RlbFtdKSB7XHJcbiAgICBsZXQgY2FuZGlkYXRlU2VydmljZSA9IG5ldyBDYW5kaWRhdGVTZXJ2aWNlKCk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvc3RlZEpvYi5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZihwb3N0ZWRKb2JbaV0ucHJvZmljaWVuY2llcy5sZW5ndGggPiAwKXtcclxuICAgICAgICBwb3N0ZWRKb2JbaV0ua2V5U2tpbGxzID0gcG9zdGVkSm9iW2ldLnByb2ZpY2llbmNpZXMudG9TdHJpbmcoKS5yZXBsYWNlKC8sL2csICcgJCcpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKHBvc3RlZEpvYltpXS5hZGRpdGlvbmFsUHJvZmljaWVuY2llcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgcG9zdGVkSm9iW2ldLmFkZGl0aW9uYWxLZXlTa2lsbHMgPSBwb3N0ZWRKb2JbaV0uYWRkaXRpb25hbFByb2ZpY2llbmNpZXMudG9TdHJpbmcoKS5yZXBsYWNlKC8sL2csICcgJCcpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKHBvc3RlZEpvYltpXS5jYXBhYmlsaXR5X21hdHJpeCkge1xyXG4gICAgICAgIHBvc3RlZEpvYltpXS5jYXBhYmlsaXR5TWF0cml4ID0gY2FuZGlkYXRlU2VydmljZS5sb2FkQ2FwYWJpbGl0aURldGFpbHMocG9zdGVkSm9iW2ldLmNhcGFiaWxpdHlfbWF0cml4KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYocG9zdGVkSm9iW2ldLmluZHVzdHJ5LnJvbGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBwb3N0ZWRKb2JbaV0ucm9sZXMgPSBjYW5kaWRhdGVTZXJ2aWNlLmxvYWRSb2xlcyhwb3N0ZWRKb2JbaV0uaW5kdXN0cnkucm9sZXMpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHBvc3RlZEpvYjtcclxuICB9XHJcblxyXG4gIHJldHJpZXZlQnlTb3J0ZWRPcmRlcihxdWVyeTogYW55LCBwcm9qZWN0aW9uOiBhbnksIHNvcnRpbmdRdWVyeTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnJlY3J1aXRlclJlcG9zaXRvcnkucmV0cmlldmVCeVNvcnRlZE9yZGVyKHF1ZXJ5LCBwcm9qZWN0aW9uLCBzb3J0aW5nUXVlcnksIGNhbGxiYWNrKTtcclxuICB9XHJcblxyXG4gIHJldHJpZXZlV2l0aExlYW4oZmllbGQ6IGFueSwgcHJvamVjdGlvbjogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcImluc2lkZSByZWNydWl0ZXIgc2VydmljZVwiKTtcclxuICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeS5yZXRyaWV2ZVdpdGhMZWFuKGZpZWxkLCBwcm9qZWN0aW9uLCBjYWxsYmFjayk7XHJcbiAgfVxyXG4gIHNlbmRNYWlsVG9BZHZpc29yKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHZhciBoZWFkZXIxID0gZnMucmVhZEZpbGVTeW5jKCcuL3NyYy9zZXJ2ZXIvcHVibGljL2hlYWRlcjEuaHRtbCcpLnRvU3RyaW5nKCk7XHJcbiAgICB2YXIgZm9vdGVyMSA9IGZzLnJlYWRGaWxlU3luYygnLi9zcmMvc2VydmVyL3B1YmxpYy9mb290ZXIxLmh0bWwnKS50b1N0cmluZygpO1xyXG4gICAgdmFyIG1haWxPcHRpb25zID0ge1xyXG4gICAgICB0bzogZmllbGQuZW1haWxfaWQsXHJcbiAgICAgIHN1YmplY3Q6IE1lc3NhZ2VzLkVNQUlMX1NVQkpFQ1RfUkVDUlVJVEVSX0NPTlRBQ1RFRF9ZT1UsXHJcbiAgICAgIGh0bWw6IGhlYWRlcjHigILigIIrIGZvb3RlcjEsIGF0dGFjaG1lbnRzOiBNYWlsQXR0YWNobWVudHMuQXR0YWNobWVudEFycmF5XHJcbiAgICB9XHJcbiAgICB2YXIgc2VuZE1haWxTZXJ2aWNlID0gbmV3IFNlbmRNYWlsU2VydmljZSgpO1xyXG4gICAgc2VuZE1haWxTZXJ2aWNlLnNlbmRNYWlsKG1haWxPcHRpb25zLCBjYWxsYmFjayk7XHJcblxyXG4gIH1cclxuXHJcbiAgc2VuZE1haWxUb1JlY3J1aXRlcih1c2VyOmFueSxmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB2YXIgaGVhZGVyMSA9IGZzLnJlYWRGaWxlU3luYygnLi9zcmMvc2VydmVyL2FwcC9mcmFtZXdvcmsvcHVibGljL2hlYWRlcjEuaHRtbCcpLnRvU3RyaW5nKCk7XHJcbiAgICB2YXIgY29udGVudCA9IGZzLnJlYWRGaWxlU3luYygnLi9zcmMvc2VydmVyL2FwcC9mcmFtZXdvcmsvcHVibGljL2NvbmZpcm1hdGlvbi5tYWlsLmh0bWwnKS50b1N0cmluZygpO1xyXG4gICAgdmFyIGZvb3RlcjEgPSBmcy5yZWFkRmlsZVN5bmMoJy4vc3JjL3NlcnZlci9hcHAvZnJhbWV3b3JrL3B1YmxpYy9mb290ZXIxLmh0bWwnKS50b1N0cmluZygpO1xyXG4gICAgY29udGVudD1jb250ZW50LnJlcGxhY2UoJyRqb2JfdGl0bGUkJywgZmllbGQuam9iVGl0bGUpO1xyXG4gICAgbGV0IGhvc3QgPSBjb25maWcuZ2V0KCdUcGxTZWVkLm1haWwuaG9zdCcpO1xyXG4gICAgbGV0IGxpbmsgPSBob3N0ICsgJ3NpZ25pbic7XHJcbiAgICBjb250ZW50PWNvbnRlbnQucmVwbGFjZSgnJGxpbmskJywgbGluayk7XHJcbiAgICB2YXIgbWFpbE9wdGlvbnMgPSB7XHJcbiAgICAgIHRvOiB1c2VyLmVtYWlsLFxyXG4gICAgICBzdWJqZWN0OiBNZXNzYWdlcy5FTUFJTF9TVUJKRUNUX1JFQ1JVSVRFUl9DT05UQUNURURfWU9VK2ZpZWxkLmpvYlRpdGxlLFxyXG4gICAgICBodG1sOiBoZWFkZXIxK2NvbnRlbnQrIGZvb3RlcjEsIGF0dGFjaG1lbnRzOiBNYWlsQXR0YWNobWVudHMuQXR0YWNobWVudEFycmF5XHJcbiAgICB9XHJcbiAgICB2YXIgc2VuZE1haWxTZXJ2aWNlID0gbmV3IFNlbmRNYWlsU2VydmljZSgpO1xyXG4gICAgc2VuZE1haWxTZXJ2aWNlLnNlbmRNYWlsKG1haWxPcHRpb25zLCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICBnZXRUb3RhbFJlY3J1aXRlckNvdW50KGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIGxldCBxdWVyeSA9IHt9O1xyXG4gICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LmdldENvdW50KHF1ZXJ5LCAoZXJyLCByZXN1bHQpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyLCByZXN1bHQpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG59XHJcblxyXG5PYmplY3Quc2VhbChSZWNydWl0ZXJTZXJ2aWNlKTtcclxuZXhwb3J0ID0gUmVjcnVpdGVyU2VydmljZTtcclxuIl19
