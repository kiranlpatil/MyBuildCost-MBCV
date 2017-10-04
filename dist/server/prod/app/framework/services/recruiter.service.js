"use strict";
var mongoose = require("mongoose");
var sharedconstants_1 = require("../shared/sharedconstants");
var job_count_model_1 = require("../dataaccess/model/job-count.model");
var Messages = require("../shared/messages");
var UserRepository = require("../dataaccess/repository/user.repository");
var RecruiterRepository = require("../dataaccess/repository/recruiter.repository");
var CandidateRepository = require("../dataaccess/repository/candidate.repository");
var fs = require("fs");
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
                item.postedJobs.capability_matrix = capabilityMatrixService.getCapabilityMatrix(item.postedJobs, industries, new_capability_matrix);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9mcmFtZXdvcmsvc2VydmljZXMvcmVjcnVpdGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLG1DQUFxQztBQUVyQyw2REFBeUQ7QUFDekQsdUVBQWtFO0FBQ2xFLDZDQUFnRDtBQUNoRCx5RUFBNEU7QUFDNUUsbUZBQXNGO0FBRXRGLG1GQUFzRjtBQUN0Rix1QkFBeUI7QUFDekIsb0VBQXVFO0FBRXZFLGlGQUFvRjtBQUNwRix1REFBMEQ7QUFDMUQsb0RBQXVEO0FBR3ZELHNEQUF5RDtBQUN6RCxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFFL0I7SUFPRTtRQUNFLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLG1CQUFtQixFQUFFLENBQUM7UUFDckQsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1FBQzNDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksbUJBQW1CLEVBQUUsQ0FBQztJQUN2RCxDQUFDO0lBRUQscUNBQVUsR0FBVixVQUFXLElBQVMsRUFBRSxRQUEyQztRQUFqRSxpQkE2Q0M7UUE1Q0MsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBQyxFQUFFLFVBQUMsR0FBRyxFQUFFLEdBQUc7WUFDM0QsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDUixRQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDakMsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FB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T0FBTyxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkQsSUFBSSxXQUFXLEdBQUc7WUFDaEIsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2QsT0FBTyxFQUFFLFFBQVEsQ0FBQyxxQ0FBcUMsR0FBQyxLQUFLLENBQUMsUUFBUTtZQUN0RSxJQUFJLEVBQUUsT0FBTyxHQUFDLE9BQU8sR0FBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsQ0FBQyxlQUFlO1NBQzdFLENBQUE7UUFDRCxJQUFJLGVBQWUsR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDO1FBQzVDLGVBQWUsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRCxpREFBc0IsR0FBdEIsVUFBdUIsUUFBMkM7UUFDaEUsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2YsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBQyxHQUFHLEVBQUUsTUFBTTtZQUNuRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNSLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLFFBQVEsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDeEIsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVILHVCQUFDO0FBQUQsQ0EvVkEsQUErVkMsSUFBQTtBQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUM5QixpQkFBUyxnQkFBZ0IsQ0FBQyIsImZpbGUiOiJhcHAvZnJhbWV3b3JrL3NlcnZpY2VzL3JlY3J1aXRlci5zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbW9uZ29vc2UgZnJvbSBcIm1vbmdvb3NlXCI7XHJcbmltcG9ydCB7UmVjcnVpdGVyfSBmcm9tIFwiLi4vZGF0YWFjY2Vzcy9tb2RlbC9yZWNydWl0ZXItZmluYWwubW9kZWxcIjtcclxuaW1wb3J0IHtDb25zdFZhcmlhYmxlc30gZnJvbSBcIi4uL3NoYXJlZC9zaGFyZWRjb25zdGFudHNcIjtcclxuaW1wb3J0IHtKb2JDb3VudE1vZGVsfSBmcm9tIFwiLi4vZGF0YWFjY2Vzcy9tb2RlbC9qb2ItY291bnQubW9kZWxcIjtcclxuaW1wb3J0IE1lc3NhZ2VzID0gcmVxdWlyZSgnLi4vc2hhcmVkL21lc3NhZ2VzJyk7XHJcbmltcG9ydCBVc2VyUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS91c2VyLnJlcG9zaXRvcnknKTtcclxuaW1wb3J0IFJlY3J1aXRlclJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL3JlcG9zaXRvcnkvcmVjcnVpdGVyLnJlcG9zaXRvcnknKTtcclxuaW1wb3J0IEpvYlByb2ZpbGVNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvam9icHJvZmlsZS5tb2RlbCcpO1xyXG5pbXBvcnQgQ2FuZGlkYXRlUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvcmVwb3NpdG9yeS9jYW5kaWRhdGUucmVwb3NpdG9yeScpO1xyXG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XHJcbmltcG9ydCBDYXBhYmlsaXR5TWF0cml4U2VydmljZSA9IHJlcXVpcmUoJy4vY2FwYmlsaXR5LW1hdHJpeC5idWlsZGVyJyk7XHJcbmltcG9ydCBJbmR1c3RyeU1vZGVsID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9tb2RlbC9pbmR1c3RyeS5tb2RlbCcpO1xyXG5pbXBvcnQgSW5kdXN0cnlSZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vZGF0YWFjY2Vzcy9yZXBvc2l0b3J5L2luZHVzdHJ5LnJlcG9zaXRvcnknKTtcclxuaW1wb3J0IE1haWxBdHRhY2htZW50cyA9IHJlcXVpcmUoXCIuLi9zaGFyZWQvc2hhcmVkYXJyYXlcIik7XHJcbmltcG9ydCBTZW5kTWFpbFNlcnZpY2UgPSByZXF1aXJlKFwiLi9zZW5kbWFpbC5zZXJ2aWNlXCIpO1xyXG5pbXBvcnQgUmVjcnVpdGVyTW9kZWwgPSByZXF1aXJlKCcuLi9kYXRhYWNjZXNzL21vZGVsL3JlY3J1aXRlci5tb2RlbCcpO1xyXG5pbXBvcnQgUmVjcnVpdGVyQ2xhc3NNb2RlbCA9IHJlcXVpcmUoJy4uL2RhdGFhY2Nlc3MvbW9kZWwvcmVjcnVpdGVyQ2xhc3MubW9kZWwnKTtcclxuaW1wb3J0IENhbmRpZGF0ZVNlcnZpY2UgPSByZXF1aXJlKCcuL2NhbmRpZGF0ZS5zZXJ2aWNlJyk7XHJcbnZhciBiY3J5cHQgPSByZXF1aXJlKCdiY3J5cHQnKTtcclxuXHJcbmNsYXNzIFJlY3J1aXRlclNlcnZpY2Uge1xyXG4gIEFQUF9OQU1FOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSByZWNydWl0ZXJSZXBvc2l0b3J5OiBSZWNydWl0ZXJSZXBvc2l0b3J5O1xyXG4gIHByaXZhdGUgY2FuZGlkYXRlUmVwb3NpdG9yeTogQ2FuZGlkYXRlUmVwb3NpdG9yeTtcclxuICBwcml2YXRlIHVzZXJSZXBvc2l0b3J5OiBVc2VyUmVwb3NpdG9yeTtcclxuICBwcml2YXRlIGluZHVzdHJ5UmVwb3NpdG9yeTogSW5kdXN0cnlSZXBvc2l0b3J5O1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeSA9IG5ldyBSZWNydWl0ZXJSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLnVzZXJSZXBvc2l0b3J5ID0gbmV3IFVzZXJSZXBvc2l0b3J5KCk7XHJcbiAgICB0aGlzLmluZHVzdHJ5UmVwb3NpdG9yeSA9IG5ldyBJbmR1c3RyeVJlcG9zaXRvcnkoKTtcclxuICAgIHRoaXMuY2FuZGlkYXRlUmVwb3NpdG9yeSA9IG5ldyBDYW5kaWRhdGVSZXBvc2l0b3J5KCk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVVc2VyKGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy51c2VyUmVwb3NpdG9yeS5yZXRyaWV2ZSh7J2VtYWlsJzogaXRlbS5lbWFpbH0sIChlcnIsIHJlcykgPT4ge1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKGVyciksIG51bGwpO1xyXG4gICAgICB9IGVsc2UgaWYgKHJlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgaWYgKHJlc1swXS5pc0FjdGl2YXRlZCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9SRUdJU1RSQVRJT04pLCBudWxsKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHJlc1swXS5pc0FjdGl2YXRlZCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcihNZXNzYWdlcy5NU0dfRVJST1JfVkVSSUZZX0FDQ09VTlQpLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaXRlbS5pc0FjdGl2YXRlZCA9IGZhbHNlO1xyXG4gICAgICAgIGl0ZW0uaXNDYW5kaWRhdGUgPSBmYWxzZTtcclxuICAgICAgICBjb25zdCBzYWx0Um91bmRzID0gMTA7XHJcbiAgICAgICAgYmNyeXB0Lmhhc2goaXRlbS5wYXNzd29yZCwgc2FsdFJvdW5kcywgKGVycjogYW55LCBoYXNoOiBhbnkpID0+IHtcclxuICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKE1lc3NhZ2VzLk1TR19FUlJPUl9CQ1JZUFRfQ1JFQVRJT04pLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGl0ZW0ucGFzc3dvcmQgPSBoYXNoO1xyXG4gICAgICAgICAgICB0aGlzLnVzZXJSZXBvc2l0b3J5LmNyZWF0ZShpdGVtLCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoTWVzc2FnZXMuTVNHX0VSUk9SX1JFR0lTVFJBVElPTl9NT0JJTEVfTlVNQkVSKSwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCB1c2VySWQxID0gcmVzLl9pZDtcclxuICAgICAgICAgICAgICAgIGxldCBuZXdJdGVtOiBhbnkgPSB7XHJcbiAgICAgICAgICAgICAgICAgIGlzUmVjcnVpdGluZ0ZvcnNlbGY6IGl0ZW0uaXNSZWNydWl0aW5nRm9yc2VsZixcclxuICAgICAgICAgICAgICAgICAgY29tcGFueV9uYW1lOiBpdGVtLmNvbXBhbnlfbmFtZSxcclxuICAgICAgICAgICAgICAgICAgY29tcGFueV9zaXplOiBpdGVtLmNvbXBhbnlfc2l6ZSxcclxuICAgICAgICAgICAgICAgICAgY29tcGFueV9sb2dvOiBpdGVtLmNvbXBhbnlfbG9nbyxcclxuICAgICAgICAgICAgICAgICAgY29tcGFueV93ZWJzaXRlOiBpdGVtLmNvbXBhbnlfd2Vic2l0ZSxcclxuICAgICAgICAgICAgICAgICAgdXNlcklkOiB1c2VySWQxXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LmNyZWF0ZShuZXdJdGVtLCAoZXJyOiBhbnksIHJlczogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZmluZE9uZUFuZFVwZGF0ZShxdWVyeTogYW55LCBuZXdEYXRhOiBhbnksIG9wdGlvbnM6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUocXVlcnksIG5ld0RhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKTtcclxuICB9XHJcblxyXG4gIHJldHJpZXZlKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeS5yZXRyaWV2ZShmaWVsZCwgKGVyciwgcmVzKSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBsZXQgZXIgPSBuZXcgRXJyb3IoJ1VuYWJsZSB0byByZXRyaWV2ZSByZWNydWl0ZXIgZGV0YWlscy4nKTtcclxuICAgICAgICBjYWxsYmFjayhlciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IHJlY3J1aXRlcjogUmVjcnVpdGVyO1xyXG4gICAgICAgIHJlY3J1aXRlciA9IHJlc1swXTtcclxuICAgICAgICBpZiAocmVjcnVpdGVyKSB7XHJcbiAgICAgICAgICByZWNydWl0ZXIuam9iQ291bnRNb2RlbCA9IG5ldyBKb2JDb3VudE1vZGVsKCk7XHJcbiAgICAgICAgICByZWNydWl0ZXIuam9iQ291bnRNb2RlbC5udW1iZXJPZkpvYnBvc3RlZCA9IHJlY3J1aXRlci5wb3N0ZWRKb2JzLmxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBpZiAocmVjcnVpdGVyLnBvc3RlZEpvYnMpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgam9iIG9mIHJlY3J1aXRlci5wb3N0ZWRKb2JzKSB7XHJcbiAgICAgICAgICAgICAgZm9yIChsZXQgbGlzdCBvZiBqb2IuY2FuZGlkYXRlX2xpc3QpIHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAobGlzdC5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNhc2UgQ29uc3RWYXJpYWJsZXMuQVBQTElFRF9DQU5ESURBVEUgOlxyXG4gICAgICAgICAgICAgICAgICAgIHJlY3J1aXRlci5qb2JDb3VudE1vZGVsLnRvdGFsTnVtYmVyT2ZDYW5kaWRhdGVzQXBwbGllZCArPSBsaXN0Lmlkcy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgIGNhc2UgQ29uc3RWYXJpYWJsZXMuQ0FSVF9MSVNURURfQ0FORElEQVRFIDpcclxuICAgICAgICAgICAgICAgICAgICByZWNydWl0ZXIuam9iQ291bnRNb2RlbC50b3RhbE51bWJlck9mQ2FuZGlkYXRlSW5DYXJ0ICs9IGxpc3QuaWRzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgY2FzZSBDb25zdFZhcmlhYmxlcy5SRUpFQ1RFRF9MSVNURURfQ0FORElEQVRFIDpcclxuICAgICAgICAgICAgICAgICAgICByZWNydWl0ZXIuam9iQ291bnRNb2RlbC50b3RhbE51bWJlck9mQ2FuZGlkYXRlc1JlamVjdGVkICs9IGxpc3QuaWRzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgZGVmYXVsdCA6XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIFtyZWNydWl0ZXJdKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBhZGRKb2IoX2lkOiBzdHJpbmcsIGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkgeyAvL1RvZG8gY2hhbmdlIHdpdGggY2FuZGlkYXRlX2lkIG5vdyBpdCBpcyBhIHVzZXJfaWQgb3BlcmF0aW9uXHJcbiAgICB0aGlzLnJlY3J1aXRlclJlcG9zaXRvcnkuZmluZE9uZUFuZFVwZGF0ZSh7J3VzZXJJZCc6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZChfaWQpfSxcclxuICAgICAgeyRwdXNoOiB7cG9zdGVkSm9iczogaXRlbS5wb3N0ZWRKb2JzfX0sXHJcbiAgICAgIHtcclxuICAgICAgICAnbmV3JzogdHJ1ZSwgc2VsZWN0OiB7XHJcbiAgICAgICAgcG9zdGVkSm9iczoge1xyXG4gICAgICAgICAgJGVsZW1NYXRjaDogeydwb3N0aW5nRGF0ZSc6IGl0ZW0ucG9zdGVkSm9icy5wb3N0aW5nRGF0ZX1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgZnVuY3Rpb24gKGVyciwgcmVjb3JkKSB7XHJcbiAgICAgICAgaWYgKHJlY29yZCkge1xyXG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVjb3JkKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IGVycm9yOiBhbnk7XHJcbiAgICAgICAgICBpZiAocmVjb3JkID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGVycm9yID0gbmV3IEVycm9yKCdVbmFibGUgdG8gdXBkYXRlIHBvc3RlZCBqb2IgbWF5YmUgcmVjcnVpdGVyIG5vdCBmb3VuZC4gJyk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIGFkZENsb25lSm9iKF9pZDogc3RyaW5nLCBpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHsgLy9Ub2RvIGNoYW5nZSB3aXRoIGNhbmRpZGF0ZV9pZCBub3cgaXQgaXMgYSB1c2VyX2lkIG9wZXJhdGlvblxyXG4gICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUoeyd1c2VySWQnOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQoX2lkKX0sXHJcbiAgICAgIHskcHVzaDoge3Bvc3RlZEpvYnM6IGl0ZW19fSxcclxuICAgICAge1xyXG4gICAgICAgICduZXcnOiB0cnVlLCBzZWxlY3Q6IHtcclxuICAgICAgICBwb3N0ZWRKb2JzOiB7XHJcbiAgICAgICAgICAkZWxlbU1hdGNoOiB7J3Bvc3RpbmdEYXRlJzogaXRlbS5wb3N0aW5nRGF0ZX1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgZnVuY3Rpb24gKGVyciwgcmVjb3JkKSB7XHJcbiAgICAgICAgaWYgKHJlY29yZCkge1xyXG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVjb3JkKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IGVycm9yOiBhbnk7XHJcbiAgICAgICAgICBpZiAocmVjb3JkID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGVycm9yID0gbmV3IEVycm9yKCdKb2IgY2xvbmluZyBpcyBmYWlsZWQnKTtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlSm9iKF9pZDogc3RyaW5nLCBpdGVtOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHsgLy9Ub2RvIGNoYW5nZSB3aXRoIGNhbmRpZGF0ZV9pZCBub3cgaXQgaXMgYSB1c2VyX2lkIG9wZXJhdGlvblxyXG5cclxuICAgIGxldCBjYXBhYmlsaXR5TWF0cml4U2VydmljZTogQ2FwYWJpbGl0eU1hdHJpeFNlcnZpY2UgPSBuZXcgQ2FwYWJpbGl0eU1hdHJpeFNlcnZpY2UoKTtcclxuICAgIHRoaXMuaW5kdXN0cnlSZXBvc2l0b3J5LnJldHJpZXZlKHsnbmFtZSc6IGl0ZW0ucG9zdGVkSm9icy5pbmR1c3RyeS5uYW1lfSwgKGVycm9yOiBhbnksIGluZHVzdHJpZXM6IEluZHVzdHJ5TW9kZWxbXSkgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKGl0ZW0ucG9zdGVkSm9icy5jYXBhYmlsaXR5X21hdHJpeCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICBpdGVtLnBvc3RlZEpvYnMuY2FwYWJpbGl0eV9tYXRyaXggPSB7fTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IG5ld19jYXBhYmlsaXR5X21hdHJpeDogYW55ID0ge307XHJcbiAgICAgICAgaXRlbS5wb3N0ZWRKb2JzLmNhcGFiaWxpdHlfbWF0cml4ID0gY2FwYWJpbGl0eU1hdHJpeFNlcnZpY2UuZ2V0Q2FwYWJpbGl0eU1hdHJpeChpdGVtLnBvc3RlZEpvYnMsIGluZHVzdHJpZXMsIG5ld19jYXBhYmlsaXR5X21hdHJpeCk7XHJcbiAgICAgICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUoXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgICd1c2VySWQnOiBuZXcgbW9uZ29vc2UuVHlwZXMuT2JqZWN0SWQoX2lkKSxcclxuICAgICAgICAgICAgJ3Bvc3RlZEpvYnMuX2lkJzogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKGl0ZW0ucG9zdGVkSm9icy5faWQpXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgeyRzZXQ6IHsncG9zdGVkSm9icy4kJzogaXRlbS5wb3N0ZWRKb2JzfX0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgICduZXcnOiB0cnVlLCBzZWxlY3Q6IHtcclxuICAgICAgICAgICAgcG9zdGVkSm9iczoge1xyXG4gICAgICAgICAgICAgICRlbGVtTWF0Y2g6IHsncG9zdGluZ0RhdGUnOiBpdGVtLnBvc3RlZEpvYnMucG9zdGluZ0RhdGV9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBmdW5jdGlvbiAoZXJyLCByZWNvcmQpIHtcclxuICAgICAgICAgICAgaWYgKHJlY29yZCkge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlY29yZCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgbGV0IGVycm9yOiBhbnk7XHJcbiAgICAgICAgICAgICAgaWYgKHJlY29yZCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoJ1VuYWJsZSB0byB1cGRhdGUgcG9zdGVkIGpvYiBtYXliZSByZWNydWl0ZXIgJiBqb2IgcG9zdCBub3QgZm91bmQuICcpO1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZmluZEJ5SWQoaWQ6IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LmZpbmRCeUlkKGlkLCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICBnZXRMaXN0KGl0ZW06IGFueSwgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgbGV0IHF1ZXJ5ID0ge1xyXG4gICAgICAncG9zdGVkSm9icy5faWQnOiB7JGluOiBpdGVtLmlkc30sXHJcbiAgICB9O1xyXG4gICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LnJldHJpZXZlKHF1ZXJ5LCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LmdldEpvYlByb2ZpbGVRQ2FyZChyZXMsIGl0ZW0uY2FuZGlkYXRlLCBpdGVtLmlkcywgJ25vbmUnLCAoY2FuRXJyb3IsIGNhblJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGNhbkVycm9yKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGNhbkVycm9yLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGNhblJlc3VsdCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlRGV0YWlscyhfaWQ6IHN0cmluZywgaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcblxyXG4gICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LnJldHJpZXZlKHsndXNlcklkJzogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKF9pZCl9LCAoZXJyLCByZXMpID0+IHtcclxuXHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnIsIHJlcyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LmZpbmRPbmVBbmRVcGRhdGUoeydfaWQnOiByZXNbMF0uX2lkfSwgaXRlbSwgeyduZXcnOiB0cnVlfSwgY2FsbGJhY2spO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldENhbmRpZGF0ZUxpc3QoaXRlbTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsZXQgcXVlcnkgPSB7XHJcbiAgICAgICdwb3N0ZWRKb2JzJzogeyRlbGVtTWF0Y2g6IHsnX2lkJzogbmV3IG1vbmdvb3NlLlR5cGVzLk9iamVjdElkKGl0ZW0uam9iUHJvZmlsZUlkKX19XHJcbiAgICB9O1xyXG4gICAgdGhpcy5yZWNydWl0ZXJSZXBvc2l0b3J5LnJldHJpZXZlKHF1ZXJ5LCAoZXJyLCByZXMpID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcignTm90IEZvdW5kIEFueSBKb2IgcG9zdGVkJyksIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChyZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgbGV0IGNhbmRpZGF0ZUlkczogc3RyaW5nW10gPSBuZXcgQXJyYXkoMCk7XHJcbiAgICAgICAgICBsZXQgam9iUHJvZmlsZTogSm9iUHJvZmlsZU1vZGVsO1xyXG4gICAgICAgICAgZm9yIChsZXQgam9iIG9mIHJlc1swXS5wb3N0ZWRKb2JzKSB7XHJcbiAgICAgICAgICAgIGlmIChqb2IuX2lkLnRvU3RyaW5nKCkgPT09IGl0ZW0uam9iUHJvZmlsZUlkKSB7XHJcbiAgICAgICAgICAgICAgam9iUHJvZmlsZSA9IGpvYjtcclxuICAgICAgICAgICAgICBmb3IgKGxldCBsaXN0IG9mIGpvYi5jYW5kaWRhdGVfbGlzdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxpc3QubmFtZS50b1N0cmluZygpID09PSBpdGVtLmxpc3ROYW1lLnRvU3RyaW5nKCkpIHtcclxuICAgICAgICAgICAgICAgICAgY2FuZGlkYXRlSWRzID0gbGlzdC5pZHM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkucmV0cmlldmVCeU11bHRpSWRzKGNhbmRpZGF0ZUlkcywge30sIChlcnI6IGFueSwgcmVzOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcignQ2FuZGlkYXRlcyBhcmUgbm90IGZvdW5kcycpLCBudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB0aGlzLmNhbmRpZGF0ZVJlcG9zaXRvcnkuZ2V0Q2FuZGlkYXRlUUNhcmQocmVzLCBqb2JQcm9maWxlLCBjYW5kaWRhdGVJZHMsIGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldEpvYkJ5SWQoaWQ6IHN0cmluZywgY2FsbGJhY2s6IChlcnJvcjogYW55LCByZXN1bHQ6IEpvYlByb2ZpbGVNb2RlbCkgPT4gdm9pZCkge1xyXG4gICAgbGV0IHF1ZXJ5ID0ge1xyXG4gICAgICAncG9zdGVkSm9icyc6IHskZWxlbU1hdGNoOiB7J19pZCc6IG5ldyBtb25nb29zZS5UeXBlcy5PYmplY3RJZChpZCl9fVxyXG4gICAgfTtcclxuICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeS5yZXRyaWV2ZShxdWVyeSwgKGVycjogYW55LCByZXM6IFJlY3J1aXRlck1vZGVsW10pID0+IHtcclxuICAgICAgaWYgKGVycikge1xyXG4gICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcignUHJvYmxlbSBpbiBKb2IgUmV0cmlldmUnKSwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IGpvYlByb2ZpbGU6IEpvYlByb2ZpbGVNb2RlbDtcclxuICAgICAgICBpZiAocmVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIGZvciAobGV0IGpvYiBvZiByZXNbMF0ucG9zdGVkSm9icykge1xyXG4gICAgICAgICAgICBpZiAoam9iLl9pZC50b1N0cmluZygpID09PSBpZCkge1xyXG4gICAgICAgICAgICAgIGpvYlByb2ZpbGUgPSBqb2I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgam9iUHJvZmlsZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbG9hZENhcGJpbGl0eUFuZEtleVNraWxscyhwb3N0ZWRKb2I6IEpvYlByb2ZpbGVNb2RlbFtdKSB7XHJcbiAgICBsZXQgY2FuZGlkYXRlU2VydmljZSA9IG5ldyBDYW5kaWRhdGVTZXJ2aWNlKCk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvc3RlZEpvYi5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZihwb3N0ZWRKb2JbaV0ucHJvZmljaWVuY2llcy5sZW5ndGggPiAwKXtcclxuICAgICAgICBwb3N0ZWRKb2JbaV0ua2V5U2tpbGxzID0gcG9zdGVkSm9iW2ldLnByb2ZpY2llbmNpZXMudG9TdHJpbmcoKS5yZXBsYWNlKC8sL2csICcgJCcpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKHBvc3RlZEpvYltpXS5hZGRpdGlvbmFsUHJvZmljaWVuY2llcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgcG9zdGVkSm9iW2ldLmFkZGl0aW9uYWxLZXlTa2lsbHMgPSBwb3N0ZWRKb2JbaV0uYWRkaXRpb25hbFByb2ZpY2llbmNpZXMudG9TdHJpbmcoKS5yZXBsYWNlKC8sL2csICcgJCcpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKHBvc3RlZEpvYltpXS5jYXBhYmlsaXR5X21hdHJpeCkge1xyXG4gICAgICAgIHBvc3RlZEpvYltpXS5jYXBhYmlsaXR5TWF0cml4ID0gY2FuZGlkYXRlU2VydmljZS5sb2FkQ2FwYWJpbGl0aURldGFpbHMocG9zdGVkSm9iW2ldLmNhcGFiaWxpdHlfbWF0cml4KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYocG9zdGVkSm9iW2ldLmluZHVzdHJ5LnJvbGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBwb3N0ZWRKb2JbaV0ucm9sZXMgPSBjYW5kaWRhdGVTZXJ2aWNlLmxvYWRSb2xlcyhwb3N0ZWRKb2JbaV0uaW5kdXN0cnkucm9sZXMpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHBvc3RlZEpvYjtcclxuICB9XHJcblxyXG4gIHJldHJpZXZlQnlTb3J0ZWRPcmRlcihxdWVyeTogYW55LCBwcm9qZWN0aW9uOiBhbnksIHNvcnRpbmdRdWVyeTogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB0aGlzLnJlY3J1aXRlclJlcG9zaXRvcnkucmV0cmlldmVCeVNvcnRlZE9yZGVyKHF1ZXJ5LCBwcm9qZWN0aW9uLCBzb3J0aW5nUXVlcnksIGNhbGxiYWNrKTtcclxuICB9XHJcblxyXG4gIHJldHJpZXZlV2l0aExlYW4oZmllbGQ6IGFueSwgcHJvamVjdGlvbjogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcImluc2lkZSByZWNydWl0ZXIgc2VydmljZVwiKTtcclxuICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeS5yZXRyaWV2ZVdpdGhMZWFuKGZpZWxkLCBwcm9qZWN0aW9uLCBjYWxsYmFjayk7XHJcbiAgfVxyXG4gIHNlbmRNYWlsVG9BZHZpc29yKGZpZWxkOiBhbnksIGNhbGxiYWNrOiAoZXJyb3I6IGFueSwgcmVzdWx0OiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHZhciBoZWFkZXIxID0gZnMucmVhZEZpbGVTeW5jKCcuL3NyYy9zZXJ2ZXIvcHVibGljL2hlYWRlcjEuaHRtbCcpLnRvU3RyaW5nKCk7XHJcbiAgICB2YXIgZm9vdGVyMSA9IGZzLnJlYWRGaWxlU3luYygnLi9zcmMvc2VydmVyL3B1YmxpYy9mb290ZXIxLmh0bWwnKS50b1N0cmluZygpO1xyXG4gICAgdmFyIG1haWxPcHRpb25zID0ge1xyXG4gICAgICB0bzogZmllbGQuZW1haWxfaWQsXHJcbiAgICAgIHN1YmplY3Q6IE1lc3NhZ2VzLkVNQUlMX1NVQkpFQ1RfUkVDUlVJVEVSX0NPTlRBQ1RFRF9ZT1UsXHJcbiAgICAgIGh0bWw6IGhlYWRlcjHigILigIIrIGZvb3RlcjEsIGF0dGFjaG1lbnRzOiBNYWlsQXR0YWNobWVudHMuQXR0YWNobWVudEFycmF5XHJcbiAgICB9XHJcbiAgICB2YXIgc2VuZE1haWxTZXJ2aWNlID0gbmV3IFNlbmRNYWlsU2VydmljZSgpO1xyXG4gICAgc2VuZE1haWxTZXJ2aWNlLnNlbmRNYWlsKG1haWxPcHRpb25zLCBjYWxsYmFjayk7XHJcblxyXG4gIH1cclxuXHJcbiAgc2VuZE1haWxUb1JlY3J1aXRlcih1c2VyOmFueSxmaWVsZDogYW55LCBjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICB2YXIgaGVhZGVyMSA9IGZzLnJlYWRGaWxlU3luYygnLi9zcmMvc2VydmVyL2FwcC9mcmFtZXdvcmsvcHVibGljL2hlYWRlcjEuaHRtbCcpLnRvU3RyaW5nKCk7XHJcbiAgICB2YXIgY29udGVudCA9IGZzLnJlYWRGaWxlU3luYygnLi9zcmMvc2VydmVyL2FwcC9mcmFtZXdvcmsvcHVibGljL2NvbmZpcm1hdGlvbi5tYWlsLmh0bWwnKS50b1N0cmluZygpO1xyXG4gICAgdmFyIGZvb3RlcjEgPSBmcy5yZWFkRmlsZVN5bmMoJy4vc3JjL3NlcnZlci9hcHAvZnJhbWV3b3JrL3B1YmxpYy9mb290ZXIxLmh0bWwnKS50b1N0cmluZygpO1xyXG4gICAgY29udGVudD1jb250ZW50LnJlcGxhY2UoJyRqb2JfdGl0bGUkJywgZmllbGQuam9iVGl0bGUpO1xyXG4gICAgdmFyIG1haWxPcHRpb25zID0ge1xyXG4gICAgICB0bzogdXNlci5lbWFpbCxcclxuICAgICAgc3ViamVjdDogTWVzc2FnZXMuRU1BSUxfU1VCSkVDVF9SRUNSVUlURVJfQ09OVEFDVEVEX1lPVStmaWVsZC5qb2JUaXRsZSxcclxuICAgICAgaHRtbDogaGVhZGVyMStjb250ZW50KyBmb290ZXIxLCBhdHRhY2htZW50czogTWFpbEF0dGFjaG1lbnRzLkF0dGFjaG1lbnRBcnJheVxyXG4gICAgfVxyXG4gICAgdmFyIHNlbmRNYWlsU2VydmljZSA9IG5ldyBTZW5kTWFpbFNlcnZpY2UoKTtcclxuICAgIHNlbmRNYWlsU2VydmljZS5zZW5kTWFpbChtYWlsT3B0aW9ucywgY2FsbGJhY2spO1xyXG4gIH1cclxuXHJcbiAgZ2V0VG90YWxSZWNydWl0ZXJDb3VudChjYWxsYmFjazogKGVycm9yOiBhbnksIHJlc3VsdDogYW55KSA9PiB2b2lkKSB7XHJcbiAgICBsZXQgcXVlcnkgPSB7fTtcclxuICAgIHRoaXMucmVjcnVpdGVyUmVwb3NpdG9yeS5nZXRDb3VudChxdWVyeSwgKGVyciwgcmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgcmVzdWx0KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxufVxyXG5cclxuT2JqZWN0LnNlYWwoUmVjcnVpdGVyU2VydmljZSk7XHJcbmV4cG9ydCA9IFJlY3J1aXRlclNlcnZpY2U7XHJcbiJdfQ==
